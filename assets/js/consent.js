/* Biggy la Volpe — Google Analytics 4 con Consent Mode v2 + banner cookie.
   Prima del consenso: nessun cookie viene impostato (Consent Mode invia
   solo ping anonimi in modalita "cookieless"). Dopo l'accettazione,
   analytics_storage passa a "granted". */

(function () {
  "use strict";

  var GA_ID = "G-481B4QYX6X";
  var STORAGE_KEY = "biggy_consent_v1";

  /* --- 1) Consent Mode v2: stato di default negato ------------------- */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag("consent", "default", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
    wait_for_update: 500
  });

  /* --- 2) Carica la libreria gtag.js ---------------------------------- */
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  gtag("js", new Date());
  gtag("config", GA_ID, { anonymize_ip: true });

  /* --- 3) Stato del consenso salvato ----------------------------------- */
  function getScelta() {
    try { return window.localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function salvaScelta(v) {
    try { window.localStorage.setItem(STORAGE_KEY, v); } catch (e) { /* niente da fare */ }
  }
  function applicaScelta(v) {
    if (v === "granted") {
      gtag("consent", "update", { analytics_storage: "granted" });
    } else {
      gtag("consent", "update", { analytics_storage: "denied" });
    }
  }

  var scelta = getScelta();
  if (scelta) applicaScelta(scelta);

  /* --- 4) Banner cookie ------------------------------------------------ */
  function creaBanner() {
    var box = document.createElement("div");
    box.id = "cookie-banner";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-label", "Preferenze cookie");
    box.innerHTML =
      '<div class="cookie-banner__inner">' +
      '<p>Usiamo Google Analytics per capire quali inchieste vengono lette e da dove arrivano i visitatori. Si attiva solo se accetti.</p>' +
      '<div class="cookie-banner__azioni">' +
      '<button type="button" class="btn btn--ghost" data-cookie-rifiuta>Rifiuta</button>' +
      '<button type="button" class="btn btn--primary" data-cookie-accetta>Accetta</button>' +
      '</div></div>';
    document.body.appendChild(box);

    box.querySelector("[data-cookie-accetta]").addEventListener("click", function () {
      salvaScelta("granted");
      applicaScelta("granted");
      box.remove();
    });
    box.querySelector("[data-cookie-rifiuta]").addEventListener("click", function () {
      salvaScelta("denied");
      applicaScelta("denied");
      box.remove();
    });
  }

  window.riapriPreferenzeCookie = function () {
    var esistente = document.getElementById("cookie-banner");
    if (esistente) esistente.remove();
    creaBanner();
  };

  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest("[data-cookie-prefs]");
    if (link) { e.preventDefault(); window.riapriPreferenzeCookie(); }
  });

  function avvia() {
    if (!getScelta()) creaBanner();
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }

  /* --- 5) Tracciamento clic sui bottoni "Condividi" -------------------- */
  function metodoDa(a) {
    var label = (a.getAttribute("aria-label") || "").replace(/^Condividi (su|per)\s*/i, "");
    return label || "altro";
  }
  function avviaTracciamentoCondividi() {
    document.querySelectorAll("[data-condividi] a[href]").forEach(function (a) {
      a.addEventListener("click", function () {
        gtag("event", "share", {
          method: metodoDa(a),
          content_type: "articolo",
          item_id: location.pathname
        });
      });
    });
    document.querySelectorAll("[data-condividi] [data-copia]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        gtag("event", "share", {
          method: "copia link",
          content_type: "articolo",
          item_id: location.pathname
        });
      });
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avviaTracciamentoCondividi);
  } else {
    avviaTracciamentoCondividi();
  }
})();
