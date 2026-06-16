/* ============================================================
   support.jsx — Sez 7: Supporto Ambra & Maia + chatbot + footer
   ============================================================ */

const SUPPORT_EMAILS = ['ambra.demi@met.com', 'maia.ingaramo@met.com'];
const MSG_KEY = 'summerteam_messages_v1';

function loadMsgs() {
  try { return JSON.parse(localStorage.getItem(MSG_KEY) || '[]'); } catch { return []; }
}
function saveMsgs(list) { localStorage.setItem(MSG_KEY, JSON.stringify(list)); }

/* Archivia la richiesta: copia locale (cache) + invio al foglio Google
   condiviso (se il backend è configurato in config.js). */
function archiveMessage(msg) {
  const rec = { ...msg, id: Date.now(), ts: new Date().toISOString(), letta: false };
  const list = loadMsgs();
  saveMsgs([...list, rec]);
  if (window.STBackend && STBackend.attivo()) {
    STBackend.invia({ type: 'msg', ...rec }).catch(() => {});
  }
}

/* Avatar placeholder — circular striped with initials (caricature drop-in) */
function Avatar({ name, hue = 'green', size = 64 }) {
  const initials = name.split(' ').map((s) => s[0]).join('');
  return (
    <div className={`avatar avatar-${hue}`} style={{ width: size, height: size }} title={`Caricatura ${name}`}>
      <span>{initials}</span>
    </div>
  );
}

/* ---------------- Sez 7: Support section ---------------- */
function Support() {
  const blank = { nome: '', cognome: '', email: '', oggetto: '', messaggio: '' };
  const [form, setForm] = React.useState(blank);
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState({});
  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErr((e) => ({ ...e, [k]: false })); };

  const submit = (e) => {
    e.preventDefault();
    const ne = {};
    ['nome', 'cognome', 'email', 'messaggio'].forEach((k) => { if (!form[k].trim()) ne[k] = true; });
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) ne.email = true;
    if (Object.keys(ne).length) { setErr(ne); return; }
    archiveMessage({
      nome: form.nome.trim(),
      cognome: form.cognome.trim(),
      email: form.email.trim(),
      oggetto: form.oggetto.trim(),
      messaggio: form.messaggio.trim(),
    });
    setSent(true);
  };

  return (
    <section className="section sec-support" id="supporto">
      <div className="wrap">
        <div className="sup-grid reveal">
          <div className="sup-intro">
            <Head kicker="Sezione 07 · Supporto" title="Chiedi ad Ambra & Maia" />
            <p className="section-intro">Hai dubbi sul SummerTeam? Chiedi ad Ambra &amp; Maia. Ti risponderemo il prima possibile.</p>
            <div className="sup-avatars">
              <div className="sup-photo"><img src="assets/ambra-maia.jpg" alt="Ambra & Maia" /></div>
              <div className="sup-names">
                <strong>Ambra &amp; Maia</strong>
                <span className="muted">Team organizzazione SummerTeam</span>
              </div>
            </div>
            <p className="sup-route muted"><Icon.send /> Ogni richiesta viene registrata e gestita direttamente da Ambra &amp; Maia, che ti risponderanno via email.</p>
          </div>

          <div className="card sup-form">
            {sent ? (
              <div className="sup-success">
                <div className="sup-success-ic"><Icon.check /></div>
                <h3>Grazie!</h3>
                <p>La tua richiesta è stata inviata correttamente ad Ambra &amp; Maia. Ti risponderemo il prima possibile.</p>
                <button className="btn btn-ghost" onClick={() => { setSent(false); setForm(blank); }}>Invia un’altra domanda</button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="field-row">
                  <label className="field field-half"><span>Nome<i>*</i></span>
                    <input className={err.nome ? 'inp inp-err' : 'inp'} value={form.nome} onChange={(e) => set('nome', e.target.value)} /></label>
                  <label className="field field-half"><span>Cognome<i>*</i></span>
                    <input className={err.cognome ? 'inp inp-err' : 'inp'} value={form.cognome} onChange={(e) => set('cognome', e.target.value)} /></label>
                </div>
                <label className="field"><span>Email<i>*</i></span>
                  <input className={err.email ? 'inp inp-err' : 'inp'} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></label>
                <label className="field"><span>Oggetto della domanda</span>
                  <input className="inp" value={form.oggetto} onChange={(e) => set('oggetto', e.target.value)} placeholder="Es. Trasporti, camere, dieta…" /></label>
                <label className="field"><span>Messaggio<i>*</i></span>
                  <textarea className={err.messaggio ? 'inp inp-err' : 'inp'} rows="4" value={form.messaggio} onChange={(e) => set('messaggio', e.target.value)} /></label>
                <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>Invia domanda <Icon.send /></button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <span className="footer-logo"><img src="assets/met-logo.jpg" alt="MET Italia" /></span>
          <div>
            <strong>SummerTeam</strong>
            <span>Celebrating People &amp; Connections</span>
          </div>
        </div>
        <div className="footer-meta">
          <span><Icon.pin /> Aethos Monterosa · Champoluc</span>
          <span><Icon.clock /> 26 giugno 2026</span>
          <a className="footer-mail" href={`mailto:${SUPPORT_EMAILS.join(',')}`}><Icon.send /> {SUPPORT_EMAILS.join(' · ')}</a>
        </div>
        <p className="footer-note">Teambuilding MET Italia 2026 · Una giornata per stare insieme, immersi nella natura.</p>
        <a className="footer-admin" href="Area Organizzatori.html"><Icon.lock /> Area organizzatori</a>
      </div>
    </footer>
  );
}

Object.assign(window, { Support, Footer, Avatar });
