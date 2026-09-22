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
