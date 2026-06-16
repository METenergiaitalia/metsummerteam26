/* ============================================================
   top.jsx — Nav, Hero (+ countdown), Hat popup
   ============================================================ */

function Nav() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const links = [
  ['', '#registrazione'],
  ['Location', '#location'],
  ['Attività', '#attivita'],
  ['Agenda', '#agenda'],
  ['Camere', '#camere'],
  ['Supporto', '#supporto']];

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <div className="nav-left">
          <a href="#top" className="brand"><img className="brand-logo" src="assets/met-logo.jpg" alt="MET Italia" /></a>
          <a href="organizzatori.html" className="nav-login"><Icon.lock /> Login Organizzatori</a>
        </div>
        <nav className="nav-links">
          {links.map(([t, h]) => <a key={h} href={h}>{t}</a>)}
        </nav>
        <a href="#registrazione" className="btn btn-accent btn-sm nav-cta">Check-In Hotel</a>
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>
      {open &&
      <div className="nav-mobile">
          {links.map(([t, h]) => <a key={h} href={h} onClick={() => setOpen(false)}>{t}</a>)}
          <a href="#registrazione" className="btn btn-accent" onClick={() => setOpen(false)}>Registrati</a>
          <a href="organizzatori.html" className="nav-mobile-login"><Icon.lock /> Login Organizzatori</a>
        </div>
      }
    </header>);

}

function useCountdown(target) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff % 86400000 / 3600000);
    const m = Math.floor(diff % 3600000 / 60000);
    const s = Math.floor(diff % 60000 / 1000);
    return { d, h, m, s };
  };
  const [t, setT] = React.useState(calc);
  React.useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

function Countdown() {
  const { d, h, m, s } = useCountdown(EVENT_DATE);
  const cell = (val, lab) =>
  <div className="cd-cell">
      <span className="cd-num">{String(val).padStart(2, '0')}</span>
      <span className="cd-lab">{lab}</span>
    </div>;

  return (
    <div className="countdown">
      <span className="cd-title"><Icon.sun /> Mancano</span>
      <div className="cd-grid">
        {cell(d, 'giorni')}<span className="cd-sep">:</span>
        {cell(h, 'ore')}<span className="cd-sep">:</span>
        {cell(m, 'min')}<span className="cd-sep">:</span>
        {cell(s, 'sec')}
      </div>
    </div>);

}

function Hero() {
  const occhiello = ['Brainstorming', 'Outdoors', 'Fun', 'DJ Set'];
  const photoRef = React.useRef(null);
  React.useEffect(() => {
    let raf = null;
    const update = () => {
      raf = null;
      if (photoRef.current) photoRef.current.style.transform = `translate3d(0, ${window.scrollY * 0.4}px, 0)`;
    };
    const onScroll = () => {if (raf == null) raf = requestAnimationFrame(update);};
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {window.removeEventListener('scroll', onScroll);if (raf) cancelAnimationFrame(raf);};
  }, []);
  return (
    <section className="hero" id="top">
      <div className="hero-photo" ref={photoRef} aria-hidden="true"></div>
      <div className="hero-scrim" aria-hidden="true"></div>
      <div className="wrap hero-inner">
        <div className="hero-occhiello">
          {occhiello.map((o, i) =>
          <React.Fragment key={o}>
              <span>{o}</span>
              {i < occhiello.length - 1 && <span className="dot">•</span>}
            </React.Fragment>
          )}
        </div>
        <h1 className="hero-title">SummerTeam</h1>
        <p className="hero-sub">Celebrating People &amp; Connections<br /><span>Teambuilding MET Italia</span></p>

        <div className="hero-meta">
          <div className="hero-date">
            <Icon.pin />
            <div>
              <strong>26 giugno 2026</strong>
              <span>Aethos Monterosa · Champoluc</span>
            </div>
          </div>
          <Countdown />
        </div>

        <p className="hero-desc">
          C’è un momento dell’anno in cui le giornate si allungano, le agende si alleggeriscono
          e la voglia di stare insieme prende il posto della routine quotidiana. Una giornata per
          stare tutti insieme, rafforzare lo spirito di squadra e condividere esperienze, relax e
          divertimento immersi nella natura.
        </p>

        <div className="hero-cta">
          <a href="#registrazione" className="btn btn-accent">Fai il Check-In <Icon.send /></a>
          <a href="#agenda" className="btn btn-ghost">Scopri il programma</a>
        </div>
      </div>
      <a href="#registrazione" className="hero-scroll" aria-label="Scorri">
        <span></span>
      </a>
    </section>);

}

function HatPopup() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const seen = false; // demo: mostra sempre all'apertura
    const t = setTimeout(() => {if (!seen) setShow(true);}, 1100);
    return () => clearTimeout(t);
  }, []);
  if (!show) return null;
  return (
    <div className="popup-overlay" onClick={() => setShow(false)}>
      <div className="popup-card" onClick={(e) => e.stopPropagation()}>
        <button className="popup-x" onClick={() => setShow(false)} aria-label="Chiudi"><Icon.close /></button>
        <div className="popup-icon"><Icon.hat /></div>
        <h3>Ricordati il cappellino MET!</h3>
        <p>Se sei un <em>new joiner</em>, ti verrà consegnato direttamente al Team Building. 🧢☀️</p>
        <button className="btn btn-primary" onClick={() => setShow(false)}>Ok, ricevuto!</button>
      </div>
    </div>);

}

Object.assign(window, { Nav, Hero, HatPopup, Countdown });
