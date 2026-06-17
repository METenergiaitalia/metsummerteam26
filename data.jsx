/* ============================================================
   data.jsx — event data + shared small components
   ============================================================ */

const EVENT_DATE = new Date('2026-06-26T09:00:00+02:00');

const AGENDA = [
{ time: '09:00', title: 'Arrivo in hotel', desc: 'Accoglienza e ritrovo dei partecipanti.', tag: 'Logistica' },
{ time: '09:00 – 09:45', title: 'Welcome coffee', desc: 'Caffè di benvenuto per iniziare insieme la giornata.', tag: 'Insieme' },
{ time: '09:45 – 12:00', title: 'Town Hall Meeting', desc: 'Seguire la segnaletica presente in hotel per raggiungere la sala.', tag: 'Meeting' },
{ time: '12:00 – 12:45', title: 'Light lunch', desc: 'Pausa pranzo leggera prima della partenza.', tag: 'Food' },
{ time: '12:45', title: 'Partenza verso Saint-Jacques', desc: 'Trasferimento con le proprie auto fino a Park Saint-Jacques, punto di partenza del trekking.', tag: 'Logistica' },
{ time: '13:00 – 14:30', title: 'Trekking fino ai Piani di Verra', desc: 'I partecipanti saranno suddivisi in 3 gruppi per la salita.', tag: 'Outdoor' },
{ time: '14:30', title: 'Arrivo ai Piani di Verra', desc: 'Distribuzione dell’acqua e breve sosta prima della scelta del percorso.', tag: 'Outdoor' }];


const AGENDA_SPLIT = {
  note: 'La scelta del percorso è libera: puoi decidere a quale gruppo aggregarti anche sul momento, direttamente ai Piani di Verra.',
  groups: [
  {
    name: 'Gruppo 1',
    label: 'Percorso breve',
    items: [
    { time: '14:30 – 15:00', title: 'Sosta ai Piani di Verra' },
    { time: '15:00', title: 'Inizio della discesa', desc: 'Rientro verso Saint-Jacques.' },
    { time: '16:30 circa', title: 'Fine del trekking', desc: 'Rientro in hotel.' }]

  },
  {
    name: 'Gruppo 2',
    label: 'Percorso completo · Lago Blu',
    items: [
    { time: '14:30 – 16:00', title: 'Trekking verso il Lago Blu', desc: 'Dai Piani di Verra fino al Lago Blu.' },
    { time: '16:00 – 16:30', title: 'Sosta al Lago Blu' },
    { time: '16:30', title: 'Inizio della discesa', desc: 'Rientro verso Saint-Jacques.' },
    { time: '18:00 – 18:30 circa', title: 'Rientro in hotel' }]

  }]

};

const AGENDA_EVENING = [
{ time: '19:45', title: 'Aperitivo al Bar “The Doping”', desc: 'Brindisi di gruppo per chiudere la giornata outdoor.', tag: 'Food' },
{ time: '20:30', title: 'Cena al ristorante dell’Hotel', desc: 'A seguire intrattenimento con DJ set e karaoke.', tag: 'DJ Set' }];


const ROOMS = [
{ room: 'Camera 01', type: 'Singola', guests: ['Chiara Bruschi'] },
{ room: 'Camera 02', type: 'Singola', guests: ['Andrea Crosetti'] },
{ room: 'Camera 03', type: 'Singola', guests: ['Guido D\'Auria'] },
{ room: 'Camera 04', type: 'Singola', guests: ['Greta Del Duca'] },
{ room: 'Camera 05', type: 'Singola', guests: ['Mauro Del Monaco'] },
{ room: 'Camera 06', type: 'Singola', guests: ['Cristiano Ferrari'] },
{ room: 'Camera 07', type: 'Singola', guests: ['Andrea Rebora'] },
{ room: 'Camera 08', type: 'Singola', guests: ['Giuseppe Rebuzzini'] },
{ room: 'Camera 09', type: 'Tripla', guests: ['Ambra Demi', 'Irene Faciocchi', 'Rossana Barrella'] },
{ room: 'Camera 10', type: 'Tripla', guests: ['Ivan Fozzati', 'Umberto Furlan', 'Alessio Spinozzi Di Sante'] },
{ room: 'Camera 11', type: 'Tripla', guests: ['Ilenia Scandale', 'Simona Zec', 'Claudia Francesca Carani'] },
{ room: 'Camera 12', type: 'Doppia', guests: ['Maia Ingaramo', 'Alessia Lombardi'] },
{ room: 'Camera 13', type: 'Doppia', guests: ['Marta Carpignano', 'Deborah Busani'] },
{ room: 'Camera 14', type: 'Doppia', guests: ['Elona Rredhi', 'Nikolett Nosza'] },
{ room: 'Camera 15', type: 'Doppia', guests: ['Edoardo Vialli', 'Matteo Bazzi'] },
{ room: 'Camera 16', type: 'Doppia', guests: ['Ella Esteleydes', 'Federica Giunta'] },
{ room: 'Camera 17', type: 'Doppia', guests: ['Rossella Bergonzi', 'Elisa Matli'] },
{ room: 'Camera 18', type: 'Doppia', guests: ['Leonardo Bellisario', 'Gianluca Brozzi'] },
{ room: 'Camera 19', type: 'Doppia', guests: ['Francesco Cattaneo', 'Carlo Santini'] },
{ room: 'Camera 20', type: 'Doppia', guests: ['Riccardo Minunni', 'Mattia Pavesi'] },
{ room: 'Camera 21', type: 'Doppia', guests: ['Matteo Saitta', 'Gianluigi Mosti'] },
{ room: 'Camera 22', type: 'Doppia', guests: ['Matteo Valente', 'Federico Pogliani'] },
{ room: 'Camera 23', type: 'Doppia', guests: ['Matteo Turrisi', 'Marco Paissoni'] },
{ room: 'Camera 24', type: 'Doppia', guests: ['Ernesto Valeo', 'Sante Luberto'] },
{ room: 'Camera 25', type: 'Doppia', guests: ['Davide Carminati', 'Alessio Chiaversoli'] },
{ room: 'Camera 26', type: 'Doppia', guests: ['Marco Falanga', 'Gabriele Musico'] }];


const PAST_EVENTS = [
{ year: '2022', place: 'Milano', note: 'Lezioni di Padel & Mental Coaching', photos: 9 },
{ year: '2023', place: 'Lago di Pusiano', note: 'Canoa Orienteering & Skills Game', photos: 9 },
{ year: '2024', place: 'Courmayeur', note: 'Rafting', photos: 9 },
{ year: '2025', place: 'Langhe Tenuta Fontana Fredda', note: 'Passeggiata tra i vigneti patrimonio Unesco', photos: 9 }];


const TREK = {
  durata: '5h 00\u2032 circa',
  difficolta: 'E - Escursionistico',
  dislivello: 'Piani di Verra +350 m\nLago Blu +500 m',
  lunghezza: 'Piani di Verra · A/R 6 km\nLago Blu · A/R 9 km',
  portare: ['Bottiglietta acqua o thermos/borraccia (alle fontane dei Piani di Verra troveremo acqua)', 'Snack (forniti da noi a tutti)', 'K-way / giacca antivento', 'Zainetto', 'Crema solare', 'Maglietta di ricambio', 'Bastoncini (facoltativi ma consigliati)'],
  indossare: ['Scarpe da trekking con buona suola (Vibram)', 'Abbigliamento a strati', 'Occhiali da sole', 'Cappellino MET']
};

/* ---------- Fillable image slot (user drops/clicks to add photo) ---------- */
function Ph({ label, id, src, shape = 'rounded', radius = 18, style, className = '' }) {
  return (
    <image-slot
      id={id}
      placeholder={label}
      src={src}
      shape={shape}
      radius={String(radius)}
      class={`ph-slot ${className}`}
      style={style}>
    </image-slot>);

}

/* ---------- Section heading block ---------- */
function Head({ kicker, title, intro, align = 'left', titleStyle }) {
  return (
    <div style={{ textAlign: align, maxWidth: align === 'center' ? 720 : 'none', margin: align === 'center' ? '0 auto' : 0 }}>
      <span className="kicker">{kicker}</span>
      <h2 className="section-title" style={{ marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0, ...titleStyle, fontWeight: "700" }}>{title}</h2>
      {intro && <p className="section-intro" style={{ marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0, fontWeight: "500" }}>{intro}</p>}
    </div>);

}

/* ---------- Scroll reveal hook ---------- */
function useReveal() {
  React.useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) {e.target.classList.add('in');io.unobserve(e.target);}});
    }, { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  });
}

/* ---------- Inline icons (simple, geometric) ---------- */
const Icon = {
  pin: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>,
  clock: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.2 2" /></svg>,
  trek: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="m3 20 6-9 4 5 2-3 6 7" /><path d="m8 11 2.5-4" /><circle cx="11" cy="5" r="1.6" /></svg>,
  up: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="m4 18 6-8 4 4 6-9" /><path d="M20 9v4M20 9h-4" /></svg>,
  ruler: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 9h18v6H3z" /><path d="M7 9v3M11 9v3M15 9v3M19 9v3" /></svg>,
  pdf: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5" /><path d="M9 13v4M9 13h1.5a1.3 1.3 0 0 1 0 2.6H9" /></svg>,
  download: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 21h14" /></svg>,
  bed: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M3 8v11M3 13h18v6M21 19v-6a3 3 0 0 0-3-3H8" /><circle cx="7" cy="11" r="1.6" /></svg>,
  send: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></svg>,
  hat: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.7" {...p}><path d="M4 14c0-4.4 3.6-8 8-8s8 3.6 8 8" /><path d="M2.5 14h19" /><path d="M12 6V4.5" /></svg>,
  check: (p) => <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="m5 13 4 4 10-11" /></svg>,
  close: (p) => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>,
  chat: (p) => <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" /><path d="M8.5 11h7M8.5 14h4" /></svg>,
  sun: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></svg>,
  lock: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.4" /></svg>,
  users: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="9" cy="8" r="3.2" /><path d="M3.5 20a5.5 5.5 0 0 1 11 0" /><path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17 14.5a5.5 5.5 0 0 1 3.5 5.1" /></svg>,
  search: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></svg>,
  logout: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 12H3m0 0 3.5-3.5M3 12l3.5 3.5" /></svg>,
  grid: (p) => <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" {...p}><rect x="3" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5" /><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5" /><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5" /></svg>
};

Object.assign(window, { EVENT_DATE, AGENDA, ROOMS, PAST_EVENTS, TREK, Ph, Head, useReveal, Icon, REG_KEY_SHARED: 'summerteam_participants_v1' });