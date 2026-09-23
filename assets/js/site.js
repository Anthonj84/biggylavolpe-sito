// Biggy la Volpe — comportamenti minimi del sito.
// Nessuna dipendenza esterna. Il sito funziona anche senza questo file.

(function () {
  "use strict";

  /* Menu mobile ------------------------------------------------------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("nav-principale");

  function isMobile() {
    return window.matchMedia("(max-width: 720px)").matches;
  }

  function closeNav() {
    if (!nav || !toggle) return;
    nav.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    if (!nav || !toggle) return;
    nav.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }

  function syncNav() {
    if (!nav || !toggle) return;
    if (isMobile()) {
      if (toggle.getAttribute("aria-expanded") !== "true") closeNav();
    } else {
      nav.hidden = false;
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  if (toggle && nav) {
    syncNav();
    toggle.addEventListener("click", function () {
      if (nav.hidden) openNav();
      else closeNav();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && isMobile() && !nav.hidden) {
        closeNav();
        toggle.focus();
      }
    });
    window.addEventListener("resize", syncNav);
  }

  /* Anno corrente nel footer ------------------------------------------ */
  var anno = document.querySelectorAll("[data-anno]");
  for (var i = 0; i < anno.length; i++) {
    anno[i].textContent = String(new Date().getFullYear());
  }
})();

/* Copia link negli appunti, con ripiego se l'API non è disponibile
   (contesti non sicuri o browser che la bloccano). */
document.querySelectorAll('[data-condividi]').forEach(function (box) {
  var btn = box.querySelector('[data-copia]');
  var esito = box.querySelector('[data-esito]');
  if (!btn) return;
  btn.addEventListener('click', function () {
    var url = location.href.split('#')[0];
    function fatto() {
      if (!esito) return;
      esito.hidden = false;
      setTimeout(function () { esito.hidden = true; }, 2500);
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url).then(fatto).catch(ripiego);
    } else {
      ripiego();
    }
    function ripiego() {
      var t = document.createElement('textarea');
      t.value = url;
      t.setAttribute('readonly', '');
      t.style.position = 'absolute';
      t.style.left = '-9999px';
      document.body.appendChild(t);
      t.select();
      try { document.execCommand('copy'); fatto(); } catch (e) { /* niente da fare */ }
      t.remove();
    }
  });
});
