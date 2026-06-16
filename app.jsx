/* ============================================================
   app.jsx — compose landing + Tweaks
   ============================================================ */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#1f8497",
  "heroTitle": "gradient",
  "display": "Poppins",
  "popup": true
}/*EDITMODE-END*/;

function applyVars(t) {
  const root = document.documentElement.style;
  // accent (terra) + derive a warm second accent
  root.setProperty('--accent', t.accent);
  document.documentElement.style.setProperty('--font-display', `'${t.display}', system-ui, sans-serif`);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  useReveal();
  React.useEffect(() => { applyVars(t); }, [t.accent, t.display]);

  React.useEffect(() => {
    document.documentElement.dataset.herotitle = t.heroTitle;
  }, [t.heroTitle]);

  return (
    <React.Fragment>
      <Nav />
      <main>
        <Hero />
        <Registration />
        <Location />
        <Activity />
        <Agenda />
        <Rooms />
        <PastEvents />
        <Support />
      </main>
      <Footer />
      {t.popup && <HatPopup />}

      <TweaksPanel>
        <TweakSection label="Colore" />
        <TweakColor label="Accento" value={t.accent}
          options={['#1f8497', '#0e6275', '#3aa66e', '#7cb342', '#e7b21a']}
          onChange={(v) => setTweak('accent', v)} />
        <TweakSection label="Tipografia" />
        <TweakSelect label="Font titoli" value={t.display}
          options={['Poppins', 'Mulish', 'Sora', 'Nunito']}
          onChange={(v) => setTweak('display', v)} />
        <TweakSection label="Hero" />
        <TweakRadio label="Titolo" value={t.heroTitle}
          options={['gradient', 'solido']}
          onChange={(v) => setTweak('heroTitle', v)} />
        <TweakSection label="Varie" />
        <TweakToggle label="Pop-up cappellino" value={t.popup}
          onChange={(v) => setTweak('popup', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
