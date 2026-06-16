/*****************************************************************
 * SummerTeam 2026 — MET Italia
 * MINI-BACKEND su Google Apps Script (gratuito)
 * Riceve le iscrizioni e le richieste dal sito e le salva su un
 * Foglio Google; l'Area Organizzatori le rilegge da qui.
 *
 * ▶ Vedi "ISTRUZIONI GOOGLE.txt" per la procedura passo-passo.
 *****************************************************************/

// ❶ Scegli una parola segreta (lettere/numeri, niente spazi).
//    DEVE essere IDENTICA a quella che metti in config.js (campo "token").
const TOKEN = 'CAMBIA-QUESTA-PAROLA-SEGRETA';

// ❷ Email che ricevono la notifica a ogni nuovo invio.
//    (lascia l'array vuoto [] per disattivare le notifiche)
const NOTIFY = ['ambra.demi@met.com', 'maia.ingaramo@met.com'];


// ---- Scrittura (il sito invia qui i dati dei moduli) ----
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.token !== TOKEN) return _out({ ok: false, error: 'auth' });
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (data.type === 'reg') {
      const sh = _tab(ss, 'Iscritti', ['ID', 'Data iscrizione', 'Nome', 'Cognome', 'Data nascita', 'Luogo nascita', 'Carta identita', 'Preferenza alimentare', 'Allergie/Note', 'Auto a disposizione']);
      sh.appendRow([data.id, new Date(), data.nome, data.cognome, "'" + (data.nascita || ''), data.luogo, "'" + (data.carta || ''), data.diet, data.allergie, data.auto]);
      _notify(
        'Nuova iscrizione SummerTeam: ' + data.nome + ' ' + data.cognome,
        'È arrivata una nuova iscrizione al Check-In Hotel.\n\n' +
        'Nome: ' + data.nome + ' ' + data.cognome + '\n' +
        'Data di nascita: ' + (data.nascita || '-') + '\n' +
        'Luogo di nascita: ' + (data.luogo || '-') + '\n' +
        'Carta d\'identità: ' + (data.carta || '-') + '\n' +
        'Preferenza alimentare: ' + (data.diet || '-') + '\n' +
        'Allergie/Note: ' + (data.allergie || '-') + '\n' +
        'Auto a disposizione: ' + (data.auto || '-') + '\n\n' +
        'Vedi tutte le iscrizioni nell\'Area Organizzatori o nel Foglio Google.'
      );
    } else if (data.type === 'msg') {
      const sh = _tab(ss, 'Richieste', ['ID', 'Data', 'Nome', 'Cognome', 'Email', 'Oggetto', 'Messaggio']);
      sh.appendRow([data.id, new Date(), data.nome, data.cognome, data.email, data.oggetto, data.messaggio]);
      _notify(
        'Nuova richiesta SummerTeam da ' + data.nome + ' ' + data.cognome,
        'È arrivata una nuova richiesta dal modulo "Chiedi ad Ambra & Maia".\n\n' +
        'Da: ' + data.nome + ' ' + data.cognome + ' (' + (data.email || 'email non indicata') + ')\n' +
        'Oggetto: ' + (data.oggetto || '-') + '\n\n' +
        'Messaggio:\n' + (data.messaggio || '') + '\n\n' +
        'Puoi rispondere direttamente a questa email.',
        data.email
      );
    }
    return _out({ ok: true });
  } catch (err) {
    return _out({ ok: false, error: String(err) });
  }
}

// ---- Lettura (contatore pubblico + elenco per l'area organizzatori) ----
function doGet(e) {
  const cb = e.parameter.callback;
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  if (action === 'count') {
    return _send({ ok: true, participants: _count(ss, 'Iscritti') }, cb);
  }
  if (action === 'list') {
    if (e.parameter.token !== TOKEN) return _send({ ok: false, error: 'auth' }, cb);
    return _send({
      ok: true,
      participants: _rows(ss, 'Iscritti', 'reg'),
      messages: _rows(ss, 'Richieste', 'msg')
    }, cb);
  }
  return _send({ ok: true, status: 'SummerTeam backend attivo' }, cb);
}

// ---- Helper ----
function _notify(subject, body, replyTo) {
  if (!NOTIFY || !NOTIFY.length) return;
  try {
    const opts = { name: 'SummerTeam 2026' };
    if (replyTo) opts.replyTo = replyTo;
    MailApp.sendEmail(NOTIFY.join(','), subject, body, opts);
  } catch (err) {
    // un eventuale errore email non deve bloccare il salvataggio dei dati
  }
}
function _tab(ss, name, headers) {
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name);
    sh.appendRow(headers);
    sh.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}
function _count(ss, name) {
  const sh = ss.getSheetByName(name);
  return sh ? Math.max(0, sh.getLastRow() - 1) : 0;
}
function _rows(ss, name, kind) {
  const sh = ss.getSheetByName(name);
  if (!sh || sh.getLastRow() < 2) return [];
  const v = sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
  return v.map(function (r) {
    const ts = r[1] ? new Date(r[1]).toISOString() : '';
    let id = r[0] || (r[1] ? new Date(r[1]).getTime() : Math.random());
    id = Number(id) || id;
    if (kind === 'reg') {
      return { id: id, ts: ts, nome: r[2], cognome: r[3], nascita: _d(r[4]), luogo: r[5], carta: String(r[6]), diet: r[7], allergie: r[8], auto: r[9] };
    }
    return { id: id, ts: ts, nome: r[2], cognome: r[3], email: r[4], oggetto: r[5], messaggio: r[6] };
  });
}
function _d(v) {
  if (v instanceof Date) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(v || '').replace(/^'/, '');
}
function _out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
function _send(obj, cb) {
  const json = JSON.stringify(obj);
  if (cb) return ContentService.createTextOutput(cb + '(' + json + ')').setMimeType(ContentService.MimeType.JAVASCRIPT);
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
