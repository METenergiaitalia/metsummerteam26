/* ============================================================
   weather.jsx — Meteo live Champoluc (Open-Meteo, API pubblica)
   Nessuna chiave richiesta. CORS aperto, uso gratuito per siti.
   ============================================================ */

const CHAMPOLUC = { lat: 45.8186, lon: 7.7286 };
const EVENT_ISO = '2026-06-26';

/* WMO weather code → glyph + etichetta IT */
const WMO = {
  0: ['☀️', 'Sereno'],
  1: ['🌤️', 'Poco nuvoloso'], 2: ['⛅', 'Parz. nuvoloso'], 3: ['☁️', 'Nuvoloso'],
  45: ['🌫️', 'Nebbia'], 48: ['🌫️', 'Nebbia'],
  51: ['🌦️', 'Pioviggine'], 53: ['🌦️', 'Pioviggine'], 55: ['🌦️', 'Pioviggine'],
  56: ['🌧️', 'Pioviggine gelata'], 57: ['🌧️', 'Pioviggine gelata'],
  61: ['🌧️', 'Pioggia debole'], 63: ['🌧️', 'Pioggia'], 65: ['🌧️', 'Pioggia forte'],
  66: ['🌧️', 'Pioggia gelata'], 67: ['🌧️', 'Pioggia gelata'],
  71: ['🌨️', 'Neve debole'], 73: ['🌨️', 'Neve'], 75: ['❄️', 'Neve forte'], 77: ['❄️', 'Nevischio'],
  80: ['🌦️', 'Rovesci'], 81: ['🌦️', 'Rovesci'], 82: ['⛈️', 'Rovesci forti'],
  85: ['🌨️', 'Rovesci di neve'], 86: ['🌨️', 'Rovesci di neve'],
  95: ['⛈️', 'Temporale'], 96: ['⛈️', 'Temporale'], 99: ['⛈️', 'Temporale e grandine']
};
const wmo = (c) => WMO[c] || ['🌡️', '—'];

function fmtDay(iso) {
  const d = new Date(iso + 'T12:00:00');
  const wd = d.toLocaleDateString('it-IT', { weekday: 'short' });
  return { wd: wd.charAt(0).toUpperCase() + wd.slice(1).replace('.', ''), dm: d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' }) };
}

function Weather() {
  const [state, setState] = React.useState({ status: 'loading', days: [], eventInData: false });

  React.useEffect(() => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CHAMPOLUC.lat}&longitude=${CHAMPOLUC.lon}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max` +
    `&timezone=Europe%2FRome&forecast_days=16`;
    let alive = true;
    fetch(url).
    then((r) => {if (!r.ok) throw new Error('HTTP ' + r.status);return r.json();}).
    then((j) => {
      if (!alive) return;
      const d = j.daily;
      const all = d.time.map((t, i) => ({
        iso: t,
        code: d.weather_code[i],
        tmax: Math.round(d.temperature_2m_max[i]),
        tmin: Math.round(d.temperature_2m_min[i]),
        pop: d.precipitation_probability_max[i],
        wind: Math.round(d.wind_speed_10m_max[i])
      }));
      const eventIdx = all.findIndex((x) => x.iso === EVENT_ISO);
      let days,eventInData = false;
      if (eventIdx >= 0) {
        // mostra una finestra centrata sul giorno dell'evento
        const start = Math.max(0, eventIdx - 2);
        days = all.slice(start, start + 6);
        eventInData = true;
      } else {
        days = all.slice(0, 6); // anteprima prossimi giorni finché l'evento è fuori finestra
      }
      setState({ status: 'ok', days, eventInData });
    }).
    catch(() => {if (alive) setState({ status: 'error', days: [], eventInData: false });});
    return () => {alive = false;};
  }, []);

  const { status, days, eventInData } = state;

  return (
    <div className="act-weather reveal">
      <div className="wx-head">
        <div className="wx-title">
          <span className="wx-pin" style={{ color: "rgb(254, 254, 254)", backgroundColor: "rgb(34, 146, 161)" }}>{Icon.pin()}</span>
          <div>
            <h3 style={{ color: "rgb(34, 181, 158)" }}>Meteo a Champoluc</h3>
            <span className="wx-sub" style={{ color: "rgb(255, 255, 255)" }}>
              {status === 'ok' && eventInData ?
              'Previsioni per i giorni dell’evento · dati live' :
              status === 'ok' ?
              'Previsioni dei prossimi giorni · dati live' :
              'Val d’Ayas · 1.568 m s.l.m.'}
            </span>
          </div>
        </div>
        <span className="wx-src">Fonte: Open-Meteo</span>
      </div>

      {status === 'loading' &&
      <div className="wx-row">
          {Array.from({ length: 6 }).map((_, i) => <div className="wx-card wx-skeleton" key={i}></div>)}
        </div>
      }

      {status === 'error' &&
      <div className="wx-error">
          Meteo non disponibile al momento. <a href={`https://www.google.com/search?q=meteo+Champoluc`} target="_blank" rel="noreferrer">Apri le previsioni →</a>
        </div>
      }

      {status === 'ok' &&
      <>
          <div className="wx-row">
            {days.map((d) => {
            const [g, lab] = wmo(d.code);
            const isEvent = d.iso === EVENT_ISO;
            const { wd, dm } = fmtDay(d.iso);
            return (
              <div className={`wx-card ${isEvent ? 'wx-event' : ''}`} key={d.iso}>
                  {isEvent && <span className="wx-badge">Evento</span>}
                  <span className="wx-wd">{wd}</span>
                  <span className="wx-dm">{dm}</span>
                  <span className="wx-glyph" role="img" aria-label={lab}>{g}</span>
                  <span className="wx-lab">{lab}</span>
                  <span className="wx-temp"><strong>{d.tmax}°</strong><i>{d.tmin}°</i></span>
                  <div className="wx-meta">
                    <span title="Probabilità di pioggia">💧 {d.pop ?? 0}%</span>
                    <span title="Vento max">🌬️ {d.wind} km/h</span>
                  </div>
                </div>);

          })}
          </div>
          {!eventInData &&
        <p className="wx-note" style={{ color: "rgb(255, 255, 255)" }}>Le previsioni per il <strong style={{ color: "rgb(255, 255, 255)" }}>26 giugno</strong> compariranno qui sopra man mano che la data si avvicina.. così potrai organizzarti al meglio!</p>
        }
        </>
      }
    </div>);

}

Object.assign(window, { Weather });