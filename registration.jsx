/* ============================================================
   registration.jsx — Sez 1: Registrazione & check-in
   (l'area dati riservata è in "Area Organizzatori.html")
   ============================================================ */

const REG_KEY = 'summerteam_participants_v1';

function loadParts() {
  try { return JSON.parse(localStorage.getItem(REG_KEY) || '[]'); } catch { return []; }
}
function saveParts(list) { localStorage.setItem(REG_KEY, JSON.stringify(list)); }

const DIET_OPTS = ['Onnivoro', 'Vegetariano', 'Vegano', 'Senza glutine', 'Senza lattosio', 'Kosher / Halal'];

function Field({ label, children, half, req }) {
  return (
    <label className={`field ${half ? 'field-half' : ''}`}>
      <span>{label}{req && <i>*</i>}</span>
      {children}
    </label>
  );
}

function Registration() {
  const [count, setCount] = React.useState(loadParts().length);
  const blank = { nome: '', cognome: '', nascita: '', luogo: '', carta: '', diet: 'Onnivoro', allergie: '', auto: '' };
  const [form, setForm] = React.useState(blank);
  const [done, setDone] = React.useState(false);
  const [err, setErr] = React.useState({});

  // Contatore iscritti dal backend Google (se configurato)
  React.useEffect(() => {
    if (window.STBackend && STBackend.attivo()) {
      STBackend.conteggio().then((n) => setCount(n)).catch(() => {});
    }
  }, []);

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setErr((e) => ({ ...e, [k]: false })); };

  const submit = (e) => {
    e.preventDefault();
    const need = ['nome', 'cognome', 'nascita', 'luogo', 'carta', 'auto'];
    const ne = {};
    need.forEach((k) => { if (!form[k].trim()) ne[k] = true; });
    if (Object.keys(ne).length) { setErr(ne); return; }
    const rec = { ...form, id: Date.now(), ts: new Date().toISOString() };
    // copia locale (cache / fallback offline)
    const next = [...loadParts(), rec];
    saveParts(next);
    // invio al foglio Google condiviso
    if (window.STBackend && STBackend.attivo()) {
      STBackend.invia({ type: 'reg', ...rec }).catch(() => {});
      setCount((c) => c + 1);
    } else {
      setCount(next.length);
    }
    setDone(true); setForm(blank);
    setTimeout(() => setDone(false), 4600);
  };

  const inp = (k, type = 'text', ph = '') => (
    <input className={err[k] ? 'inp inp-err' : 'inp'} type={type} value={form[k]} placeholder={ph}
      onChange={(e) => set(k, e.target.value)} />
  );

  return (
    <section className="section sec-reg" id="registrazione">
      <div className="wrap">
        <div className="reveal">
          <Head kicker="Sezione 01 · Check-in" title="Check-In Hotel"
            intro="Compila il modulo per confermare la tua presenza al SummerTeam. Bastano due minuti compila con i tuoi dati per velocizzare il check-in in albergo." />
        </div>

        <div className="reg-grid reveal">
          {/* FORM */}
          <form className="card reg-form" onSubmit={submit}>
            <div className="reg-formhead">
              <span className="chip"><span className="num-dot">1</span> Dati anagrafici</span>
            </div>
            <div className="field-row">
              <Field label="Nome" half req>{inp('nome', 'text', 'Es. Giulia')}</Field>
              <Field label="Cognome" half req>{inp('cognome', 'text', 'Es. Rossi')}</Field>
            </div>
            <div className="field-row">
              <Field label="Data di nascita" half req>{inp('nascita', 'date')}</Field>
              <Field label="Luogo di nascita" half req>{inp('luogo', 'text', 'Es. Milano')}</Field>
            </div>
            <Field label="Numero carta d’identità" req>{inp('carta', 'text', 'Es. CA12345AB')}</Field>

            <div className="reg-formhead" style={{ marginTop: 8 }}>
              <span className="chip"><span className="num-dot">2</span> Informazioni organizzative</span>
            </div>
            <Field label="Preferenze alimentari">
              <div className="diet-pills">
                {DIET_OPTS.map((d) => (
                  <button type="button" key={d} className={`diet-pill ${form.diet === d ? 'on' : ''}`} onClick={() => set('diet', d)}>{d}</button>
                ))}
              </div>
            </Field>
            <Field label="Allergie alimentari / note">
              <textarea className="inp" rows="3" value={form.allergie} placeholder="Indica eventuali allergie o intolleranze…"
                onChange={(e) => set('allergie', e.target.value)} />
            </Field>
            <Field label="Metterai la tua macchina a disposizione?" req>
              <div className={err.auto ? 'yn-pills yn-err' : 'yn-pills'}>
                {['Sì', 'No'].map((o) => (
                  <button type="button" key={o} className={`yn-pill ${form.auto === o ? 'on' : ''}`} onClick={() => set('auto', o)}>{o}</button>
                ))}
              </div>
            </Field>

            <div className="reg-actions">
              <button type="submit" className="btn btn-accent">Conferma registrazione <Icon.check /></button>
              <span className="reg-note">* Campi obbligatori</span>
            </div>

            {done && (
              <div className="reg-toast">
                <Icon.check /> Registrazione confermata! Ci vediamo al SummerTeam 🎉
              </div>
            )}
          </form>

          {/* INFO ASIDE */}
          <aside className="reg-aside">
            <div className="card reg-info reg-info-dark">
              <span className="reg-info-tag">Già registrati</span>
              <div className="reg-counter">
                <strong>{count}</strong>
                <span>{count === 1 ? 'collega a bordo' : 'colleghi a bordo'} 🎒</span>
              </div>
              <p>Unisciti alla squadra: ogni iscrizione ci aiuta a organizzare al meglio trasporti, camere e menù.</p>
            </div>

            <div className="card reg-info">
              <h4>Cosa è incluso</h4>
              <ul className="reg-incl">
                <li><Icon.trek /> Trekking guidato &amp; team challenge</li>
                <li><Icon.bed /> Pernottamento ad Aethos Monterosa</li>
                <li><Icon.sun /> Pranzo, cena conviviale &amp; DJ set</li>
                <li><Icon.pin /> Trasferimento a/r organizzato</li>
              </ul>
            </div>

            <div className="reg-privacy muted">
              <Icon.check /> I dati raccolti sono usati solo per l’organizzazione del Team Building e gestiti dal team MET Italia.
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Registration });
