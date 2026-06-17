/* ============================================================
   info.jsx — Sez 2..6: Location, Attività, Agenda, Camere, Past
   ============================================================ */

/* ---- helper: open a clean printable window (PDF via browser) ---- */
function printDoc(title, bodyHTML) {
  const w = window.open('', '_blank');
  if (!w) {alert('Abilita i popup per scaricare il PDF.');return;}
  w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title>
  <style>
    body{font-family:'Hanken Grotesk',system-ui,sans-serif;color:#1f2b24;max-width:720px;margin:40px auto;padding:0 24px;}
    h1{font-family:'Space Grotesk',sans-serif;color:#2b5d3f;font-size:30px;margin:0 0 4px;}
    h2{font-family:'Space Grotesk',sans-serif;color:#2b5d3f;font-size:19px;margin:26px 0 6px;}
    .sub{color:#6b7d72;margin:0 0 26px;}
    .row{display:flex;gap:16px;padding:13px 0;border-bottom:1px solid #e4ebe5;}
    .t{font-family:'Space Grotesk',sans-serif;font-weight:700;color:#c2682f;min-width:118px;}
    .ti{font-weight:700;}.d{color:#6b7d72;font-size:14px;margin-top:2px;}
    .grp{border:1px solid #e4ebe5;border-radius:12px;padding:6px 16px;margin:12px 0;}
    .grp-h{font-family:'Space Grotesk',sans-serif;font-weight:700;color:#2b5d3f;padding:10px 0 4px;border-bottom:2px solid #2b5d3f;}
    .rm{display:flex;justify-content:space-between;padding:12px 0;border-bottom:1px solid #e4ebe5;}
    .g{color:#6b7d72;}
    @media print{body{margin:0;}}
  </style></head><body>${bodyHTML}
  <script>window.onload=()=>{window.print();}<\/script></body></html>`);
  w.document.close();
}

/* ---- archivio immagini salvate (sidecar, sola lettura) ---- */
let __imgStorePromise = null;
// Prova prima 'gallery.json' (nome usato online su GitHub), poi ripiega sul
// vecchio sidecar '.image-slots.state.json' (ambiente di anteprima/progetto).
function fetchImgStore() {
  return fetch('gallery.json', { cache: 'no-store' }).
  then((r) => r.ok ? r.json() : Promise.reject()).
  catch(() =>
  fetch('.image-slots.state.json', { cache: 'no-store' }).
  then((r) => r.ok ? r.json() : {}).
  catch(() => ({})));
}
function loadImgStore() {
  if (!__imgStorePromise) {
    __imgStorePromise = fetchImgStore();
  }
  return __imgStorePromise;
}
function useImgUrl(id) {
  const [url, setUrl] = React.useState(null);
  React.useEffect(() => {
    let alive = true;
    loadImgStore().then((j) => {
      if (!alive) return;
      const v = j && j[id];
      setUrl(v ? typeof v === 'string' ? v : v.u || null : null);
    });
    return () => {alive = false;};
  }, [id]);
  return url;
}
/* Immagine fissa e bloccata (niente caricamento/replace) letta dall'archivio. */
function StaticPhoto({ id, alt, className, style }) {
  const url = useImgUrl(id);
  return (
    <div className={`static-photo ${url ? '' : 'static-photo-empty'} ${className || ''}`} style={style}>
      {url && <img src={url} alt={alt || ''} loading="lazy" />}
    </div>);

}

/* ===================== SEZ 2 — LOCATION ===================== */
function Location() {
  const MAP = 'https://maps.google.com/maps?q=Aethos%20Monterosa%20Champoluc&t=&z=12&ie=UTF8&iwloc=&output=embed';
  return (
    <section className="section sec-location" id="location" style={{ fontWeight: "500" }}>
      <div className="wrap">
        <div className="loc-grid reveal">
          <div className="loc-copy">
            <Head kicker="Sezione 02 · Location" title="Aethos Monterosa" />
            <p className="section-intro">
              Aethos Monterosa si trova a <strong>Champoluc</strong>, nel cuore della Val d’Ayas,
              una delle principali località alpine ai piedi del massiccio del Monte Rosa. La struttura
              è immersa in un contesto naturale fatto di boschi, sentieri e ampi panorami di montagna.
            </p>
            <div className="loc-facts">
              <div className="loc-fact"><Icon.pin /><span>Champoluc · Val d’Ayas (AO)</span></div>
              <div className="loc-fact"><Icon.trek /><span>Ai piedi del Monte Rosa</span></div>
            </div>
            <a className="btn btn-primary" href="https://maps.app.goo.gl/S8MAbBEhBcFr9b4z9" target="_blank" rel="noreferrer">
              <Icon.pin /> Apri in Google Maps
            </a>
          </div>
          <div className="loc-video">
            <video src="assets/hotel.mp4" muted autoPlay loop playsInline preload="metadata"></video>
            <span className="loc-video-tag">Aethos Monterosa</span>
          </div>
        </div>

        <div className="loc-gallery reveal">
          <StaticPhoto id="loc-esterni" alt="Esterni · Aethos Monterosa" style={{ aspectRatio: '4/5' }} />
          <StaticPhoto id="loc-interni" alt="Interni · Aethos Monterosa" style={{ aspectRatio: '4/5' }} />
          <StaticPhoto id="loc-vista" alt="Vista sulle vette" style={{ aspectRatio: '4/5' }} />
          <StaticPhoto id="loc-spa" alt="Spa / relax" style={{ aspectRatio: '4/5' }} />
        </div>

        <div className="loc-map reveal">
          <div className="map-head">
            <h3><Icon.pin /> Come raggiungerla</h3>
            <a className="btn btn-ghost btn-sm" href="https://maps.app.goo.gl/S8MAbBEhBcFr9b4z9" target="_blank" rel="noreferrer">Indicazioni stradali</a>
          </div>
          <div className="map-frame">
            <iframe title="Mappa Aethos Monterosa" src={MAP} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
          </div>
        </div>
      </div>
    </section>);

}

/* ===================== SEZ 3 — ATTIVITÀ ===================== */
function Activity() {
  const facts = [
  { ic: Icon.clock, lab: 'Durata totale', val: TREK.durata },
  { ic: Icon.trek, lab: 'Difficoltà', val: TREK.difficolta },
  { ic: Icon.up, lab: 'Dislivello', val: TREK.dislivello },
  { ic: Icon.ruler, lab: 'Lunghezza', val: TREK.lunghezza }];

  return (
    <section className="section sec-activity" id="attivita">
      <div className="wrap">
        <div className="reveal">
          <Head kicker="Sezione 03 · Outdoor" title="L’avventura che ci aspetta"
          intro="Partenza dal villaggio di Saint-Jacques-des-Allemands e salita attraverso il suggestivo bosco di larici fino al piccolo borgo di Fiéry. Il percorso prosegue poi verso i Piani di Verra, uno splendido anfiteatro naturale ai piedi del massiccio del Monte Rosa, da cui si possono ammirare panorami di grande fascino. Per chi desidera proseguire l’escursione, sarà possibile continuare fino all’iconico Lago Blu, uno dei luoghi più caratteristici e fotografati della valle." />
        </div>

        <div className="act-facts reveal">
          {facts.map((f) =>
          <div className="act-fact card" key={f.lab}>
              <span className="act-ic">{f.ic()}</span>
              <span className="act-lab">{f.lab}</span>
              <span className={`act-val${String(f.val).includes('\n') ? ' act-val--multi' : ''}`}>{f.val}</span>
            </div>
          )}
        </div>

        <div className="act-grid reveal">
          <div className="act-lists">
            <div className="act-list card">
              <h4><Icon.download /> Cosa portare</h4>
              <ul>{TREK.portare.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="act-list card">
              <h4><Icon.trek /> Cosa indossare</h4>
              <ul>{TREK.indossare.map((x) => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <div className="act-gallery">
            <StaticPhoto id="act-sentiero" alt="Trekking · sentiero" style={{ gridArea: 'a' }} />
            <StaticPhoto id="act-vetta" alt="Vetta" style={{ gridArea: 'b' }} />
            <StaticPhoto id="act-bosco" alt="Bosco" style={{ gridArea: 'c' }} />
          </div>
        </div>

        <Weather />
      </div>
    </section>);

}

/* ===================== SEZ 4 — AGENDA ===================== */
function TimelineList({ items }) {
  return (
    <div className="timeline reveal">
      {items.map((a, i) =>
      <div className="tl-item" key={i}>
          <div className="tl-time">{a.time}</div>
          <div className="tl-dot"><span></span></div>
          <div className="tl-card card">
            <span className="tl-tag">{a.tag}</span>
            <h4>{a.title}</h4>
            {a.desc && <p>{a.desc}</p>}
          </div>
        </div>
      )}
    </div>);

}

function Agenda() {
  const pdf = () => {
    const line = (a) => `<div class="row"><div class="t">${a.time}</div><div><div class="ti">${a.title}</div>${a.desc ? `<div class="d">${a.desc}</div>` : ''}</div></div>`;
    const morning = AGENDA.map(line).join('');
    const evening = AGENDA_EVENING.map(line).join('');
    const groups = AGENDA_SPLIT.groups.map((g) =>
    `<div class="grp"><div class="grp-h">${g.name} — ${g.label}</div>${g.items.map(line).join('')}</div>`).join('');
    const split = `<h2>Trekking · scelta del percorso</h2><p class="sub">${AGENDA_SPLIT.note}</p>${groups}`;
    printDoc('Agenda · SummerTeam 2026', `<h1>Agenda SummerTeam</h1><p class="sub">26 giugno 2026 · Champoluc — Saint-Jacques, Monte Rosa</p>${morning}${split}<h2>Rientro & serata</h2>${evening}`);
  };
  return (
    <section className="section sec-agenda" id="agenda">
      <div className="wrap">
        <div className="agenda-head reveal">
          <Head kicker="Sezione 04 · Programma" title="Cronoprogramma" />
          <button className="btn btn-accent" onClick={pdf}><Icon.pdf /> Scarica agenda PDF</button>
        </div>

        <TimelineList items={AGENDA} />

        <div className="ag-split reveal">
          <div className="ag-split-head">
            <span className="ag-split-kicker"><Icon.trek /> Trekking · scegli il tuo percorso</span>
            <p>{AGENDA_SPLIT.note}</p>
          </div>
          <div className="ag-groups">
            {AGENDA_SPLIT.groups.map((g) =>
            <div className="ag-group card" key={g.name}>
                <div className="ag-group-head">
                  <span className="ag-group-badge">{g.name}</span>
                  <strong>{g.label}</strong>
                </div>
                <ul className="ag-group-list">
                  {g.items.map((it, j) =>
                  <li key={j}>
                      <span className="ag-gt">{it.time}</span>
                      <div className="ag-gi">
                        <strong>{it.title}</strong>
                        {it.desc && <span>{it.desc}</span>}
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>

        <TimelineList items={AGENDA_EVENING} />
      </div>
    </section>);

}

/* ===================== SEZ 5 — CAMERE ===================== */
function Rooms() {
  const pdf = () => {
    const rows = ROOMS.map((r) => `<div class="rm"><div><div class="ti">${r.room} <span class="g">· ${r.type}</span></div><div class="g">${r.guests.join(', ')}</div></div></div>`).join('');
    printDoc('Divisione camere · SummerTeam 2026', `<h1>Divisione camere</h1><p class="sub">Aethos Monterosa · 26 giugno 2026</p>${rows}`);
  };
  return (
    <section className="section sec-rooms" id="camere">
      <div className="wrap">
        <div className="agenda-head reveal">
          <Head kicker="Sezione 05 · Pernottamento" title="Dove ricaricare le tue energie" />
          <button className="btn btn-accent" onClick={pdf}><Icon.pdf /> Scarica camere PDF</button>
        </div>
        <div className="rooms-grid reveal">
          {ROOMS.map((r) =>
          <div className="room-card card" key={r.room}>
              <div className="room-top">
                <span className="room-ic"><Icon.bed /></span>
                <div>
                  <h4>{r.room}</h4>
                  <span className="room-type">{r.type}</span>
                </div>
                <span className="room-count">{r.guests.length}</span>
              </div>
              <ul className="room-guests">
                {r.guests.map((g) => <li key={g}><span className="g-av">{g.split(' ').slice(0, 2).map((s) => s[0]).join('')}</span>{g}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ===================== SEZ 6 — PAST EVENTS ===================== */
function GalleryModal({ event, photos, onClose }) {
  React.useEffect(() => {
    const onKey = (ev) => {if (ev.key === 'Escape') onClose();};
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {document.removeEventListener('keydown', onKey);document.body.style.overflow = prev;};
  }, [onClose]);

  const hasPhotos = photos && photos.length > 0;
  const editable = !!(window.omelette && window.omelette.writeFile);
  const reopen = event.reopen && editable;

  // Posizioni ancora libere (per il re-inserimento foto su album riaperto).
  const taken = new Set((photos || []).map((p) => p.n));
  const slots = Array.from({ length: event.photos || 9 }, (_, k) => k + 1).filter((k) => !taken.has(k));

  return (
    <div className="gal-overlay" onClick={onClose}>
      <div className="gal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Galleria ${event.year}`}>
        <header className="gal-head">
          <div>
            <span className="gal-year">{event.year}</span>
            <h3>{event.place}</h3>
            <p>{event.note}</p>
          </div>
          <button className="gal-close" onClick={onClose} aria-label="Chiudi galleria"><Icon.close /></button>
        </header>

        {hasPhotos ?
        <div className="gal-grid">
            {photos.map((p, idx) =>
          <div className={`gal-photo ${idx === 0 && !reopen ? 'gal-hero' : ''}`} key={p.n}>
                <img src={p.url} alt={`${event.place} — foto ${p.n}`} loading="lazy" />
              </div>
          )}
          </div> :

        !reopen &&
        <div className="gal-pending">
            <Icon.grid />
            <p>Le foto di questa edizione saranno disponibili a breve.</p>
          </div>
        }

        {reopen && slots.length > 0 &&
        <div className="gal-uploader">
            <span className="gal-uploader-lab"><Icon.grid /> Carica le foto {event.year} — trascina un’immagine su ogni riquadro (visibile solo a te in modifica)</span>
            <div className="gal-uploader-grid">
              {slots.map((k) =>
            <Ph key={k} id={`past-${event.year}-${k}`} label={`Foto ${k}`} />
            )}
            </div>
          </div>
        }
      </div>
    </div>);

}

function PastEvents() {
  const [open, setOpen] = React.useState(null);
  const [store, setStore] = React.useState(null);

  // Carica una sola volta l'archivio immagini salvato (sidecar).
  React.useEffect(() => {
    let alive = true;
    fetchImgStore().
    then((j) => {if (alive) setStore(j || {});}).
    catch(() => {if (alive) setStore({});});
    return () => {alive = false;};
  }, []);

  const photosFor = (year) => {
    if (!store) return [];
    const re = new RegExp('^past-' + year + '-(\\d+)$');
    return Object.keys(store).
    map((k) => {
      const m = k.match(re);
      const v = store[k];
      const url = v && (typeof v === 'string' ? v : v.u);
      return m && url ? { n: +m[1], url } : null;
    }).
    filter(Boolean).
    sort((a, b) => a.n - b.n);
  };

  return (
    <section className="section sec-past" id="past">
      <div className="wrap">
        <div className="reveal">
          <Head kicker="Sezione 06 · Archivio" title="Nelle puntate precedenti…"
          intro="Ogni anno nuove mete, nuovi volti e nuove storie da vivere insieme. Un piccolo viaggio tra i SummerTeam che ci hanno portato fin qui." />
        </div>
        <div className="past-grid reveal">
          {PAST_EVENTS.map((e, i) => {
            const photos = photosFor(e.year);
            const cover = photos[0];
            return (
              <figure className="past-card" key={e.year}>
                <button
                  type="button"
                  className="past-cover"
                  onClick={() => setOpen(e)}
                  aria-label={`Apri la galleria ${e.year} · ${e.place}`}>
                  {cover ?
                  <div className="past-cover-img"><img src={cover.url} alt={`${e.year} · ${e.place}`} loading="lazy" /></div> :

                  <div className="past-cover-empty"><span>{e.year}</span></div>
                  }
                  <span className="past-overlay">
                    <span className="past-badge"><Icon.grid /> {photos.length} foto</span>
                  </span>
                </button>
                <figcaption>
                  <span className="past-year">{e.year}</span>
                  <strong>{e.place}</strong>
                  <span className="past-note">{e.note}</span>
                </figcaption>
              </figure>);

          })}
        </div>
      </div>
      {open && <GalleryModal event={open} photos={photosFor(open.year)} onClose={() => setOpen(null)} />}
    </section>);

}

Object.assign(window, { Location, Activity, Agenda, Rooms, PastEvents });