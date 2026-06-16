/* ============================================================
   admin.jsx — Area Organizzatori (login + dashboard)
   Accesso: utente "Ambraemaia" · password "Test!"
   Dati condivisi con la landing via localStorage.
   ============================================================ */

const REG_KEY = 'summerteam_participants_v1';
const MSG_KEY = 'summerteam_messages_v1';
const AUTH_KEY = 'summerteam_admin_auth_v1';
const CRED = { user: 'Ambraemaia', pass: 'Test!' };

const DIET_OPTS = ['Onnivoro', 'Vegetariano', 'Vegano', 'Senza glutine', 'Senza lattosio', 'Kosher / Halal'];

function loadParts() {
  try { return JSON.parse(localStorage.getItem(REG_KEY) || '[]'); } catch { return []; }
}
function saveParts(list) { localStorage.setItem(REG_KEY, JSON.stringify(list)); }

function loadMsgs() {
  try { return JSON.parse(localStorage.getItem(MSG_KEY) || '[]'); } catch { return []; }
}
function saveMsgs(list) { localStorage.setItem(MSG_KEY, JSON.stringify(list)); }

/* ---- Stato locale dell'organizzatore ----
   I dati arrivano dal foglio Google in sola lettura: lo stato "letto" e gli
   elementi nascosti restano nel browser di chi consulta la dashboard. ---- */
const READ_KEY = 'summerteam_read_v1';
const HIDE_KEY = 'summerteam_hidden_v1';
function _loadSet(key) { try { return new Set(JSON.parse(localStorage.getItem(key) || '[]')); } catch { return new Set(); } }
function _saveSet(key, set) { localStorage.setItem(key, JSON.stringify([...set])); }
function loadReadSet() { return _loadSet(READ_KEY); }
function loadHiddenSet() { return _loadSet(HIDE_KEY); }

/* Sorgente dati: foglio Google se configurato (config.js), altrimenti localStorage. */
function useDataset() {
  const online = !!(window.STBackend && STBackend.attivo());
  const [participants, setParticipants] = React.useState(() => online ? [] : loadParts());
  const [messages, setMessages] = React.useState(() => online ? [] : loadMsgs());
  const [loading, setLoading] = React.useState(online);
  const [error, setError] = React.useState(null);

  const reload = React.useCallback(() => {
    if (!online) { setParticipants(loadParts()); setMessages(loadMsgs()); return; }
    setLoading(true); setError(null);
    STBackend.elenco().then((d) => {
      if (d && d.ok) { setParticipants(d.participants || []); setMessages(d.messages || []); }
      else setError((d && d.error) || 'Risposta non valida dal backend');
    }).catch((e) => setError(e.message || 'Errore di rete')).finally(() => setLoading(false));
  }, [online]);

  React.useEffect(() => {
    reload();
    if (online) { const iv = setInterval(reload, 30000); return () => clearInterval(iv); }
    const onStorage = () => { setParticipants(loadParts()); setMessages(loadMsgs()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [reload, online]);

  return { participants, messages, loading, error, online, reload };
}

/* tiny icons (self-contained) */
const I = {
  lock: () => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/><circle cx="12" cy="15.5" r="1.4"/></svg>,
  user: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="8" r="3.4"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>,
  key: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="8" r="4"/><path d="m11 11 8 8m-3-3 2-2m-4 0 2-2"/></svg>,
  search: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/></svg>,
  dl: () => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 3v12m0 0 4-4m-4 4-4-4"/><path d="M5 21h14"/></svg>,
  print: () => <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M7 8V3h10v5M7 18H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2h-2"/><path d="M7 14h10v7H7z"/></svg>,
  out: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3"/><path d="M10 12H3m0 0 3.5-3.5M3 12l3.5 3.5"/></svg>,
  trash: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13"/></svg>,
  back: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M15 5l-7 7 7 7"/></svg>,
  warn: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 9v4m0 3h.01M10.3 4l-7 12A2 2 0 0 0 5 19h14a2 2 0 0 0 1.7-3l-7-12a2 2 0 0 0-3.4 0Z"/></svg>,
  mail: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>,
  users: () => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="9" cy="8" r="3.2"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5M18 20a6 6 0 0 0-3-5.2"/></svg>,
  reply: () => <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 7 4 12l5 5"/><path d="M4 12h11a5 5 0 0 1 5 5v1"/></svg>,
  refresh: () => <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M20 11a8 8 0 1 0-.6 4"/><path d="M20 4v5h-5"/></svg>,
};

/* ---------------- LOGIN ---------------- */
function Login({ onOk }) {
  const [u, setU] = React.useState('');
  const [p, setP] = React.useState('');
  const [err, setErr] = React.useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (u.trim() === CRED.user && p === CRED.pass) {
      sessionStorage.setItem(AUTH_KEY, '1');
      onOk();
    } else { setErr(true); }
  };
  return (
    <div className="login-wrap">
      <div className="login-bg" aria-hidden="true"></div>
      <form className="login-card" onSubmit={submit}>
        <div className="login-mark">ST</div>
        <span className="login-tag">SummerTeam · MET Italia 2026</span>
        <h1>Area Organizzatori</h1>
        <p className="login-sub">Accesso riservato al team che organizza l’evento.</p>

        <label className="adm-field">
          <span>Nome utente</span>
          <div className="adm-inp-ic">{I.user()}<input value={u} onChange={(e) => { setU(e.target.value); setErr(false); }} placeholder="Nome utente" autoFocus /></div>
        </label>
        <label className="adm-field">
          <span>Password</span>
          <div className="adm-inp-ic">{I.key()}<input type="password" value={p} onChange={(e) => { setP(e.target.value); setErr(false); }} placeholder="Password" /></div>
        </label>

        {err && <div className="login-err">{I.warn()} Credenziali non valide. Riprova.</div>}

        <button type="submit" className="adm-btn adm-btn-primary login-btn">{I.lock()} Accedi</button>
        <a className="login-back" href="index.html">{I.back()} Torna al sito</a>
      </form>
    </div>
  );
}

/* ---------------- DASHBOARD: ISCRITTI ---------------- */
function ParticipantsView({ data, hidden, onRemove }) {
  const [q, setQ] = React.useState('');
  const [diet, setDiet] = React.useState('Tutte');
  const [sort, setSort] = React.useState('recenti');

  const remove = (id) => { if (confirm('Rimuovere questo iscritto dalla vista?')) onRemove(id); };

  const parts = data.participants.filter((p) => !hidden.has('reg:' + p.id));

  let filtered = parts.filter((p) => {
    const s = q.toLowerCase();
    const m = !s || `${p.nome} ${p.cognome} ${p.luogo} ${p.carta}`.toLowerCase().includes(s);
    const d = diet === 'Tutte' || p.diet === diet;
    return m && d;
  });
  filtered = [...filtered].sort((a, b) => {
    if (sort === 'recenti') return b.id - a.id;
    if (sort === 'cognome') return (a.cognome || '').localeCompare(b.cognome || '');
    return (a.nome || '').localeCompare(b.nome || '');
  });

  const withAllergie = parts.filter((p) => (p.allergie || '').trim()).length;
  const special = parts.filter((p) => p.diet && p.diet !== 'Onnivoro').length;
  const withCar = parts.filter((p) => p.auto === 'Sì').length;

  const cols = ['Nome', 'Cognome', 'Data di nascita', 'Luogo di nascita', 'Carta identità', 'Preferenza alimentare', 'Allergie/Note', 'Auto a disposizione', 'Data iscrizione'];
  const rowOf = (p) => [p.nome, p.cognome, p.nascita, p.luogo, p.carta, p.diet, p.allergie, p.auto || '—', fmtDate(p.ts)];

  function fmtDate(ts) { try { return new Date(ts).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' }); } catch { return '—'; } }
  function dl(blob, name) { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 1500); }

  const exportCSV = () => {
    const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.map(esc).join(';'), ...filtered.map((p) => rowOf(p).map(esc).join(';'))];
    dl(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }), 'iscritti-summerteam-2026.csv');
  };
  const exportXLS = () => {
    const cell = (s) => `<td style="mso-number-format:'\\@'">${String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>th{background:#0e6275;color:#fff;padding:6px 10px;text-align:left}td{padding:5px 10px;border:1px solid #cdd}</style></head><body><h3>Iscritti SummerTeam 2026</h3><table border="1"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filtered.map((p) => `<tr>${rowOf(p).map(cell).join('')}</tr>`).join('')}</tbody></table></body></html>`;
    dl(new Blob([html], { type: 'application/vnd.ms-excel' }), 'iscritti-summerteam-2026.xls');
  };
  const printList = () => {
    const w = window.open('', '_blank'); if (!w) { alert('Abilita i popup per stampare.'); return; }
    const rows = filtered.map((p) => `<tr>${rowOf(p).map((c) => `<td>${String(c ?? '')}</td>`).join('')}</tr>`).join('');
    w.document.write(`<!doctype html><meta charset=utf-8><title>Iscritti SummerTeam 2026</title><style>body{font-family:Mulish,system-ui,sans-serif;color:#1f3a44;margin:32px}h1{font-family:Poppins,sans-serif;color:#0e6275}table{border-collapse:collapse;width:100%;font-size:12px;margin-top:16px}th{background:#0e6275;color:#fff;padding:8px;text-align:left}td{padding:7px 8px;border-bottom:1px solid #e0e8ea}@media print{body{margin:0}}</style><h1>Iscritti SummerTeam 2026</h1><p>${filtered.length} partecipanti · esportato il ${new Date().toLocaleDateString('it-IT')}</p><table><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table><script>window.onload=()=>window.print()<\/script>`);
    w.document.close();
  };

  return (
    <React.Fragment>
        <div className="adm-stats">
          <div className="stat stat-hero">
            <span className="stat-lab">Iscritti totali</span>
            <strong>{parts.length}</strong>
            <span className="stat-sub">aggiornato in tempo reale</span>
          </div>
          <div className="stat">
            <span className="stat-lab">Diete speciali</span>
            <strong>{special}</strong>
            <span className="stat-sub">non onnivori</span>
          </div>
          <div className="stat">
            <span className="stat-lab">Con allergie / note</span>
            <strong>{withAllergie}</strong>
            <span className="stat-sub">da verificare in cucina</span>
          </div>
          <div className="stat">
            <span className="stat-lab">Auto a disposizione</span>
            <strong>{withCar}</strong>
            <span className="stat-sub">colleghi disponibili</span>
          </div>
          <div className="stat">
            <span className="stat-lab">In elenco (filtrati)</span>
            <strong>{filtered.length}</strong>
            <span className="stat-sub">risultati visibili</span>
          </div>
        </div>

        <div className="adm-panel">
          <div className="adm-toolbar">
            <div className="adm-search">{I.search()}<input placeholder="Cerca per nome, città o documento…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
            <select className="adm-sel" value={diet} onChange={(e) => setDiet(e.target.value)}>
              <option>Tutte</option>
              {DIET_OPTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select className="adm-sel" value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recenti">Più recenti</option>
              <option value="cognome">Cognome A–Z</option>
              <option value="nome">Nome A–Z</option>
            </select>
            <div className="adm-exports">
              <button className="adm-btn" onClick={exportCSV} disabled={!filtered.length}>{I.dl()} CSV</button>
              <button className="adm-btn" onClick={exportXLS} disabled={!filtered.length}>{I.dl()} Excel</button>
              <button className="adm-btn" onClick={printList} disabled={!filtered.length}>{I.print()} Stampa</button>
            </div>
          </div>

          <div className="adm-table-wrap">
            {filtered.length === 0 ? (
              <div className="adm-empty">
                {parts.length === 0
                  ? 'Ancora nessun iscritto. Le registrazioni inviate dal sito compaiono qui automaticamente.'
                  : 'Nessun risultato per i filtri selezionati.'}
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>#</th><th>Partecipante</th><th>Nascita</th><th>Documento</th><th>Preferenza</th><th>Allergie / note</th><th>Auto</th><th>Iscrizione</th><th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => (
                    <tr key={p.id}>
                      <td className="c-num">{i + 1}</td>
                      <td>
                        <div className="c-name"><span className="c-av">{(p.nome[0] || '') + (p.cognome[0] || '')}</span>
                          <div><strong>{p.nome} {p.cognome}</strong><span>{p.luogo}</span></div>
                        </div>
                      </td>
                      <td className="c-mono">{p.nascita || '—'}</td>
                      <td className="c-mono">{p.carta || '—'}</td>
                      <td><span className={`c-diet ${p.diet !== 'Onnivoro' ? 'c-diet-on' : ''}`}>{p.diet}</span></td>
                      <td className="c-allerg">{p.allergie ? p.allergie : <span className="c-dash">—</span>}</td>
                      <td><span className={`c-auto ${p.auto === 'Sì' ? 'c-auto-yes' : p.auto === 'No' ? 'c-auto-no' : ''}`}>{p.auto || '—'}</span></td>
                      <td className="c-mono c-date">{fmtDate(p.ts)}</td>
                      <td><button className="c-del" onClick={() => remove(p.id)} title="Rimuovi">{I.trash()}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <p className="adm-note">{I.warn()} {data.online
          ? 'I dati provengono dal foglio Google condiviso: ogni iscrizione inviata dal sito compare qui per tutti gli organizzatori. Export Excel/CSV e stampa sempre disponibili.'
          : 'Modalità locale: i dati sono salvati solo in questo browser. Configura config.js per condividerli tra tutti gli organizzatori (vedi ISTRUZIONI GOOGLE).'}</p>
    </React.Fragment>
  );
}

/* ---------------- DASHBOARD: RICHIESTE ---------------- */
function MessagesView({ data, hidden, isRead, onRead, onRemove }) {
  const [q, setQ] = React.useState('');
  const [filter, setFilter] = React.useState('Tutte');
  const [sort, setSort] = React.useState('recenti');
  const [openId, setOpenId] = React.useState(null);

  const msgs = data.messages
    .filter((m) => !hidden.has('msg:' + m.id))
    .map((m) => ({ ...m, letta: isRead(m) }));

  const toggleRead = (id, letta) => onRead(id, letta);
  const remove = (id) => {
    if (!confirm('Eliminare questa richiesta dalla vista?')) return;
    onRemove(id);
    if (openId === id) setOpenId(null);
  };
  const openDetail = (m) => {
    setOpenId(m.id);
    if (!m.letta) toggleRead(m.id, true);
  };

  const unread = msgs.filter((m) => !m.letta).length;

  let filtered = msgs.filter((m) => {
    const s = q.toLowerCase();
    const hit = !s || `${m.nome} ${m.cognome} ${m.email} ${m.oggetto} ${m.messaggio}`.toLowerCase().includes(s);
    const f = filter === 'Tutte' || (filter === 'Da leggere' && !m.letta) || (filter === 'Lette' && m.letta);
    return hit && f;
  });
  filtered = [...filtered].sort((a, b) => sort === 'recenti' ? b.id - a.id : a.id - b.id);

  function fmtDate(ts) { try { return new Date(ts).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }); } catch { return '—'; } }
  function dl(blob, name) { const u = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = u; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(u), 1500); }

  const cols = ['Data', 'Nome', 'Cognome', 'Email', 'Oggetto', 'Messaggio', 'Stato'];
  const rowOf = (m) => [fmtDate(m.ts), m.nome, m.cognome, m.email, m.oggetto || '—', m.messaggio, m.letta ? 'Letta' : 'Da leggere'];

  const exportCSV = () => {
    const esc = (s) => `"${String(s ?? '').replace(/"/g, '""')}"`;
    const lines = [cols.map(esc).join(';'), ...filtered.map((m) => rowOf(m).map(esc).join(';'))];
    dl(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8' }), 'richieste-summerteam-2026.csv');
  };
  const exportXLS = () => {
    const cell = (s) => `<td style="mso-number-format:'\\@'">${String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')}</td>`;
    const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"><style>th{background:#0e6275;color:#fff;padding:6px 10px;text-align:left}td{padding:5px 10px;border:1px solid #cdd;vertical-align:top}</style></head><body><h3>Richieste SummerTeam 2026</h3><table border="1"><thead><tr>${cols.map((c) => `<th>${c}</th>`).join('')}</tr></thead><tbody>${filtered.map((m) => `<tr>${rowOf(m).map(cell).join('')}</tr>`).join('')}</tbody></table></body></html>`;
    dl(new Blob([html], { type: 'application/vnd.ms-excel' }), 'richieste-summerteam-2026.xls');
  };

  const open = msgs.find((m) => m.id === openId) || null;

  return (
    <React.Fragment>
      <div className="adm-stats">
        <div className="stat stat-hero">
          <span className="stat-lab">Richieste totali</span>
          <strong>{msgs.length}</strong>
          <span className="stat-sub">messaggi ricevuti dal sito</span>
        </div>
        <div className="stat">
          <span className="stat-lab">Da leggere</span>
          <strong>{unread}</strong>
          <span className="stat-sub">nuove richieste</span>
        </div>
        <div className="stat">
          <span className="stat-lab">In elenco (filtrate)</span>
          <strong>{filtered.length}</strong>
          <span className="stat-sub">risultati visibili</span>
        </div>
      </div>

      <div className="adm-panel">
        <div className="adm-toolbar">
          <div className="adm-search">{I.search()}<input placeholder="Cerca per nome, email, oggetto o testo…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
          <select className="adm-sel" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>Tutte</option>
            <option>Da leggere</option>
            <option>Lette</option>
          </select>
          <select className="adm-sel" value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recenti">Più recenti</option>
            <option value="vecchi">Meno recenti</option>
          </select>
          <div className="adm-exports">
            <button className="adm-btn" onClick={exportCSV} disabled={!filtered.length}>{I.dl()} CSV</button>
            <button className="adm-btn" onClick={exportXLS} disabled={!filtered.length}>{I.dl()} Excel</button>
          </div>
        </div>

        <div className="adm-table-wrap">
          {filtered.length === 0 ? (
            <div className="adm-empty">
              {msgs.length === 0
                ? 'Ancora nessuna richiesta. I messaggi inviati dal modulo “Chiedi ad Ambra & Maia” compaiono qui automaticamente.'
                : 'Nessun risultato per i filtri selezionati.'}
            </div>
          ) : (
            <ul className="msg-list">
              {filtered.map((m) => (
                <li key={m.id} className={`msg-row ${m.letta ? '' : 'msg-unread'}`} onClick={() => openDetail(m)}>
                  <span className="msg-dot" title={m.letta ? 'Letta' : 'Da leggere'}></span>
                  <span className="msg-av">{(m.nome[0] || '') + (m.cognome[0] || '')}</span>
                  <div className="msg-main">
                    <div className="msg-line1">
                      <strong>{m.nome} {m.cognome}</strong>
                      <span className="msg-date">{fmtDate(m.ts)}</span>
                    </div>
                    <div className="msg-line2">
                      {m.oggetto ? <span className="msg-subj">{m.oggetto}</span> : <span className="msg-subj msg-subj-empty">Senza oggetto</span>}
                      <span className="msg-prev">{m.messaggio}</span>
                    </div>
                  </div>
                  <button className="c-del" onClick={(e) => { e.stopPropagation(); remove(m.id); }} title="Elimina">{I.trash()}</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <p className="adm-note">{I.warn()} {data.online
        ? 'Le richieste arrivano dal foglio Google condiviso. Lo stato “letto” e gli elementi nascosti restano sul tuo dispositivo. Rispondi via email con un clic.'
        : 'Modalità locale: le richieste sono salvate solo in questo browser. Configura config.js per condividerle tra tutti gli organizzatori.'}</p>

      {open && (
        <div className="msg-overlay" onClick={() => setOpenId(null)}>
          <div className="msg-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <header className="msg-modal-head">
              <span className="msg-av msg-av-lg">{(open.nome[0] || '') + (open.cognome[0] || '')}</span>
              <div className="msg-modal-id">
                <strong>{open.nome} {open.cognome}</strong>
                <a href={`mailto:${open.email}`}>{open.email}</a>
              </div>
              <button className="msg-modal-x" onClick={() => setOpenId(null)} aria-label="Chiudi">{I.out()}</button>
            </header>
            <div className="msg-modal-meta">
              <span><b>Oggetto</b>{open.oggetto || '—'}</span>
              <span><b>Ricevuto</b>{fmtDate(open.ts)}</span>
            </div>
            <div className="msg-modal-body">{open.messaggio}</div>
            <div className="msg-modal-foot">
              <button className="adm-btn" onClick={() => toggleRead(open.id, !open.letta)}>{open.letta ? 'Segna da leggere' : 'Segna come letta'}</button>
              <a className="adm-btn adm-btn-primary" href={`mailto:${open.email}?subject=${encodeURIComponent('Re: ' + (open.oggetto || 'La tua richiesta — SummerTeam 2026'))}`}>{I.reply()} Rispondi via email</a>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

/* ---------------- DASHBOARD SHELL (tabs) ---------------- */
function Dashboard({ onLogout }) {
  const [view, setView] = React.useState('iscritti');
  const data = useDataset();
  const [readSet, setReadSet] = React.useState(() => loadReadSet());
  const [hidden, setHidden] = React.useState(() => loadHiddenSet());

  const isRead = (m) => readSet.has(m.id) || (!data.online && m.letta);

  const markRead = (id, letta) => {
    const r = loadReadSet(); letta ? r.add(id) : r.delete(id);
    _saveSet(READ_KEY, r); setReadSet(new Set(r));
    if (!data.online) { const next = loadMsgs().map((m) => m.id === id ? { ...m, letta } : m); saveMsgs(next); }
  };
  const hideItem = (kind, id) => {
    if (data.online) { const h = loadHiddenSet(); h.add(kind + ':' + id); _saveSet(HIDE_KEY, h); setHidden(new Set(h)); }
    else {
      if (kind === 'reg') { saveParts(loadParts().filter((p) => p.id !== id)); }
      else { saveMsgs(loadMsgs().filter((m) => m.id !== id)); }
      data.reload();
    }
  };

  const unread = data.messages.filter((m) => !hidden.has('msg:' + m.id) && !isRead(m)).length;

  return (
    <div className="adm">
      <header className="adm-top">
        <div className="adm-top-l">
          <span className="adm-mark">ST</span>
          <div>
            <strong>Area Organizzatori</strong>
            <span>SummerTeam · MET Italia 2026</span>
          </div>
        </div>
        <div className="adm-top-r">
          <a className="adm-link" href="index.html">{I.back()} Sito pubblico</a>
          <button className="adm-link adm-link-out" onClick={onLogout}>{I.out()} Esci</button>
        </div>
      </header>

      <main className="adm-main">
        <div className="adm-status">
          <span className={`adm-dot ${data.online ? (data.error ? 'off' : 'on') : 'local'}`}></span>
          <span className="adm-status-txt">
            {data.online
              ? (data.loading ? 'Aggiornamento in corso…'
                : data.error ? ('Connessione al foglio Google non riuscita — ' + data.error)
                : ('Connesso al foglio Google · ' + data.participants.length + ' iscritti · ' + data.messages.length + ' richieste'))
              : 'Modalità locale (backend Google non ancora configurato)'}
          </span>
          <button className="adm-btn adm-refresh" onClick={data.reload} disabled={data.loading}>{I.refresh ? I.refresh() : null} Aggiorna</button>
        </div>

        <div className="adm-tabs">
          <button className={`adm-tab ${view === 'iscritti' ? 'on' : ''}`} onClick={() => setView('iscritti')}>{I.users()} Iscritti</button>
          <button className={`adm-tab ${view === 'richieste' ? 'on' : ''}`} onClick={() => setView('richieste')}>{I.mail()} Richieste{unread > 0 && <span className="adm-tab-badge">{unread}</span>}</button>
        </div>
        {view === 'iscritti'
          ? <ParticipantsView data={data} hidden={hidden} onRemove={(id) => hideItem('reg', id)} />
          : <MessagesView data={data} hidden={hidden} isRead={isRead} onRead={markRead} onRemove={(id) => hideItem('msg', id)} />}
      </main>
    </div>
  );
}

function AdminApp() {
  const [auth, setAuth] = React.useState(() => sessionStorage.getItem(AUTH_KEY) === '1');
  if (!auth) return <Login onOk={() => setAuth(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(AUTH_KEY); setAuth(false); }} />;
}

ReactDOM.createRoot(document.getElementById('root')).render(<AdminApp />);
