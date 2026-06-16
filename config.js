/* ============================================================
   config.js — Collegamento al "mini-backend" Google
   (Google Sheet + Google Apps Script)
   ------------------------------------------------------------
   ▶ COMPILA I DUE VALORI QUI SOTTO dopo aver pubblicato lo
     script Google. Trovi la procedura passo-passo nel file
     "ISTRUZIONI GOOGLE.txt".
   Finché restano vuoti, il sito funziona in modalità locale
   (i dati restano solo nel browser di chi compila).
   ============================================================ */
window.ST_CONFIG = {
  // 1) URL dell'app web di Apps Script (termina con /exec)
  endpoint: 'https://script.google.com/macros/s/AKfycbxDqM0pIoZBEfETDTPzmnUS76D6qN-IVVrlFSIMemE--ZCOzaBJ6n5h3KXqoyBz18xQ/exec',
  // 2) Lo stesso "TOKEN" che hai impostato dentro lo script Google
  token: 'summerteam'
};

window.STBackend = {
  attivo: function () {
    return !!(window.ST_CONFIG && ST_CONFIG.endpoint);
  },

  // — JSONP generico (lettura senza problemi di CORS) —
  _jsonp: function (params) {
    return new Promise(function (resolve, reject) {
      if (!window.ST_CONFIG || !ST_CONFIG.endpoint) { reject(new Error('backend non configurato')); return; }
      var cb = '__st_cb_' + Math.random().toString(36).slice(2);
      var s = document.createElement('script');
      var timer = setTimeout(function () { cleanup(); reject(new Error('timeout')); }, 12000);
      function cleanup() { clearTimeout(timer); try { delete window[cb]; } catch (e) {} if (s.parentNode) s.parentNode.removeChild(s); }
      window[cb] = function (data) { cleanup(); resolve(data); };
      s.onerror = function () { cleanup(); reject(new Error('rete')); };
      var sep = ST_CONFIG.endpoint.indexOf('?') >= 0 ? '&' : '?';
      s.src = ST_CONFIG.endpoint + sep + params + '&callback=' + cb;
      document.head.appendChild(s);
    });
  },

  // Invio dati (registrazione o messaggio) → scrive una riga sul foglio Google
  invia: function (payload) {
    if (!this.attivo()) return Promise.reject(new Error('backend non configurato'));
    return fetch(ST_CONFIG.endpoint, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(Object.assign({ token: ST_CONFIG.token }, payload))
    });
  },

  // Solo il NUMERO di iscritti (nessun dato personale) → per il contatore pubblico
  conteggio: function () {
    return this._jsonp('action=count').then(function (d) {
      return d && typeof d.participants === 'number' ? d.participants : 0;
    });
  },

  // Tutti i dati (iscritti + richieste) → solo per l'Area Organizzatori
  elenco: function () {
    return this._jsonp('action=list&token=' + encodeURIComponent(ST_CONFIG.token));
  }
};
