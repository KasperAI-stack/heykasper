// Siden virker uden JavaScript. Dette er kun små forbedringer.

// Forhindrer dobbelt afsendelse af formularen. Netlify fjerner data-netlify ved deploy, så formularen findes på navnet.
document.querySelectorAll('form[name="kontakt"]').forEach(function (form) {
  var button = form.querySelector('button[type="submit"]');
  if (!button) return;
  var label = button.textContent;
  form.addEventListener("submit", function () {
    button.disabled = true;
    button.textContent = "Sender…";
  });
  // Går man tilbage til siden (fx fra en fejl), skal knappen kunne bruges igen.
  window.addEventListener("pageshow", function () {
    button.disabled = false;
    button.textContent = label;
  });
});

// Hero: "Hey Kasper, byg os lige …" og agent-vælgeren i den buede bar.
// Uden JavaScript vises den midterste agent, og baren er skjult.

(function () {
  var hero = document.querySelector(".hero-pick");
  var picker = hero && hero.querySelector("[data-picker]");
  if (!picker) return;

  var picks = Array.prototype.slice.call(picker.querySelectorAll(".pick"));
  var pill = picker.querySelector(".picker-pill");
  var hint = hero.querySelector("[data-picker-hint]");
  var hey = hero.querySelector(".hey");
  var live = hero.querySelector("[data-scene-live]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var current = picks.filter(function (p) { return p.getAttribute("aria-pressed") === "true"; })[0] || picks[0];

  var panel = function (btn) { return document.getElementById(btn.getAttribute("data-show")); };

  // Navnet deles op i bogstaver og beskrivelsen i ord, så de kan glide ind ét ad gangen.
  // Skærmlæsere får navnet som én tekst.
  var split = function (el, byChar) {
    var text = el.textContent.trim();
    var n = 0;
    var box = document.createElement("span");
    text.split(/\s+/).forEach(function (word, i) {
      if (i) box.appendChild(document.createTextNode(" "));
      var wd = document.createElement("span");
      wd.className = "wd";
      if (byChar) {
        word.split("").forEach(function (c) {
          var ch = document.createElement("span");
          ch.className = "ch";
          ch.style.setProperty("--d", n++);
          ch.textContent = c;
          wd.appendChild(ch);
        });
      } else {
        wd.style.setProperty("--d", n++);
        wd.textContent = word;
      }
      box.appendChild(wd);
    });
    el.textContent = "";
    if (byChar) {
      var sr = document.createElement("span");
      sr.className = "visually-hidden";
      sr.textContent = text;
      box.setAttribute("aria-hidden", "true");
      el.appendChild(sr);
    }
    el.appendChild(box);
  };

  picks.forEach(function (btn) {
    var item = panel(btn);
    item.hidden = false;
    item.classList.toggle("is-off", btn !== current);
    split(item.querySelector(".scene-title"), true);
    split(item.querySelector(".scene-text"), false);
  });

  // Prikkerne efter "byg os lige" taler, mens svaret kommer frem.
  var talkTimer;
  var talk = function () {
    if (reduce.matches) return;
    hey.classList.add("is-talking");
    clearTimeout(talkTimer);
    talkTimer = setTimeout(function () { hey.classList.remove("is-talking"); }, 1400);
  };

  // Knapperne placeres langs buen i baren.
  var layout = function () {
    var css = getComputedStyle(picker);
    var ro = parseFloat(css.getPropertyValue("--ro"));
    var band = parseFloat(css.getPropertyValue("--band"));
    var r = ro - band / 2;
    var mid = picker.clientWidth / 2;
    picks.forEach(function (btn) {
      var x = btn.offsetLeft + btn.offsetWidth / 2 - mid;
      var dy = r - Math.sqrt(Math.max(r * r - x * x, 0));
      var rot = Math.asin(Math.max(-1, Math.min(1, x / r))) * 180 / Math.PI * 0.6;
      btn.style.setProperty("--dy", dy.toFixed(1) + "px");
      btn.style.setProperty("--rot", rot.toFixed(2) + "deg");
      btn.arc = { x: btn.offsetLeft, y: btn.offsetTop + dy, rot: rot };
    });
  };

  // Den hvide pude glider hen bag den valgte agent.
  var movePill = function (animate) {
    var a = current.arc;
    if (!animate) pill.style.transition = "none";
    picker.style.setProperty("--px", a.x + "px");
    picker.style.setProperty("--py", a.y + "px");
    picker.style.setProperty("--prot", a.rot + "deg");
    if (!animate) {
      void pill.offsetWidth;
      pill.style.transition = "";
    }
  };

  var select = function (btn) {
    if (btn === current) return;
    var prev = panel(current);
    var next = panel(btn);

    picks.forEach(function (p) { p.setAttribute("aria-pressed", p === btn ? "true" : "false"); });
    hero.setAttribute("data-glow", btn.getAttribute("data-glow"));

    prev.classList.remove("is-in");
    prev.classList.add("is-out");
    clearTimeout(prev.outTimer);
    prev.outTimer = setTimeout(function () {
      prev.classList.remove("is-out");
      prev.classList.add("is-off");
    }, reduce.matches ? 150 : 180);

    clearTimeout(next.outTimer);
    next.classList.remove("is-off", "is-out", "is-in");
    void next.offsetWidth; // starter animationen forfra
    next.classList.add("is-in"); // ved reduceret bevægelse bliver det en stille fade (se CSS)

    current = btn;
    movePill(true);
    talk();
    if (live) live.textContent = btn.getAttribute("aria-label") + ". " + next.querySelector(".scene-text").textContent;
  };

  picks.forEach(function (btn) {
    btn.addEventListener("click", function () { select(btn); });
  });

  // Piletasterne skifter agent, når baren har fokus.
  picker.addEventListener("keydown", function (e) {
    var i = picks.indexOf(current);
    var to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: picks.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    var btn = picks[Math.max(0, Math.min(picks.length - 1, to))];
    select(btn);
    btn.focus();
  });

  // På mobil kan man stryge til siden på memojien eller baren for at skifte.
  var swipe = function (el) {
    var start = null;
    el.addEventListener("pointerdown", function (e) {
      if (e.isPrimary) start = { x: e.clientX, y: e.clientY };
    });
    el.addEventListener("pointerup", function (e) {
      if (!start) return;
      var dx = e.clientX - start.x;
      var dy = e.clientY - start.y;
      start = null;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      var i = picks.indexOf(current) + (dx < 0 ? 1 : -1);
      if (i >= 0 && i < picks.length) select(picks[i]);
    });
    el.addEventListener("pointercancel", function () { start = null; });
  };
  swipe(hero.querySelector("[data-swipe]"));
  swipe(picker);

  picker.hidden = false;
  if (hint) hint.hidden = false;
  layout();
  movePill(false);
  panel(current).classList.add("is-in");
  if (!reduce.matches) setTimeout(talk, 400);
  window.addEventListener("resize", function () { layout(); movePill(false); });
  if (document.fonts) document.fonts.ready.then(function () { layout(); movePill(false); });
})();

// Knappen i toppen skifter mellem lyst og mørkt tema og husker valget i browseren.
var toggle = document.querySelector("[data-theme-toggle]");
if (toggle) {
  var root = document.documentElement;
  var prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  var current = function () {
    return root.getAttribute("data-theme") || (prefersDark.matches ? "dark" : "light");
  };
  var render = function () {
    var dark = current() === "dark";
    toggle.setAttribute("data-active", dark ? "dark" : "light");
    toggle.setAttribute("aria-label", dark ? "Skift til lyst tema" : "Skift til mørkt tema");
    // Browserens farve (adresselinjen på mobil) følger det valgte tema.
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
      meta.setAttribute("content", dark ? "#0F0E13" : "#FFFFFF");
    });
  };
  toggle.hidden = false;
  render();
  prefersDark.addEventListener("change", render);
  toggle.addEventListener("click", function () {
    var next = current() === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("tema", next); } catch (e) {}
    render();
  });
}

// Kontakt: skift mellem forespørgsel og booking. Uden JavaScript vises begge dele under hinanden.
var contactSwitch = document.querySelector("[data-contact-switch]");
if (contactSwitch) {
  var modeButtons = contactSwitch.querySelectorAll("[data-mode]");
  var panels = document.querySelectorAll(".contact-mode[data-panel]");
  var setContactMode = function (mode) {
    modeButtons.forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-mode") === mode ? "true" : "false");
    });
    panels.forEach(function (panel) {
      panel.hidden = panel.getAttribute("data-panel") !== mode;
    });
  };
  modeButtons.forEach(function (btn) {
    btn.addEventListener("click", function () { setContactMode(btn.getAttribute("data-mode")); });
  });
  contactSwitch.hidden = false;
  document.getElementById("book").classList.add("js-switch");
  setContactMode("forespoergsel");
}

// Samarbejdsform i "Sådan foregår det": vælgeren skifter trin 3 og 4 og linjen under trinnene.
// ?samarbejde=fastansat|konsulent|projekt i adressen åbner et bestemt spor. Uden JavaScript står alle tre spor under hinanden.
(function () {
  var section = document.getElementById("samarbejde");
  var group = document.querySelector("[data-spor-switch]");
  if (!section || !group) return;
  var radios = Array.prototype.slice.call(group.querySelectorAll("[data-spor-valg]"));
  var navne = { fastansat: "Fastansat", konsulent: "Konsulent", projekt: "Projekt" };
  var felt = document.getElementById("samarbejde-felt");

  var vaelg = function (spor, fokus, maal) {
    if (!navne[spor]) return;
    radios.forEach(function (r) {
      var on = r.getAttribute("data-spor-valg") === spor;
      r.setAttribute("aria-checked", on ? "true" : "false");
      r.setAttribute("aria-pressed", on ? "true" : "false");
      r.tabIndex = on ? 0 : -1;
      if (on && fokus) r.focus();
    });
    section.querySelectorAll(".spor[data-spor]").forEach(function (el) {
      el.classList.toggle("is-active", el.getAttribute("data-spor") === spor);
    });
    // Lægges kun i dataLayer. Intet bliver målt, før der er sat sporing op med samtykke.
    if (maal) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "samarbejdsform_valgt", form: spor });
    }
  };

  radios.forEach(function (r) {
    r.addEventListener("click", function () { vaelg(r.getAttribute("data-spor-valg"), false, true); });
  });
  group.addEventListener("keydown", function (e) {
    var i = radios.indexOf(document.activeElement);
    if (i < 0) return;
    var next = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = radios[(i + 1) % radios.length];
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = radios[(i - 1 + radios.length) % radios.length];
    if (e.key === "Home") next = radios[0];
    if (e.key === "End") next = radios[radios.length - 1];
    if (!next) return;
    e.preventDefault();
    vaelg(next.getAttribute("data-spor-valg"), true, true);
  });

  // Knappen under trinnene hopper ned til formularen og vælger samarbejdsformen på forhånd.
  section.querySelectorAll("[data-vaelg-spor]").forEach(function (link) {
    link.addEventListener("click", function () {
      var spor = link.getAttribute("data-vaelg-spor");
      if (typeof setContactMode === "function") setContactMode("forespoergsel");
      if (felt && navne[spor]) felt.value = navne[spor];
    });
  });

  var start = "fastansat";
  try {
    var fraAdresse = new URLSearchParams(window.location.search).get("samarbejde");
    if (fraAdresse && navne[fraAdresse.toLowerCase()]) start = fraAdresse.toLowerCase();
  } catch (e) {}
  section.classList.add("js-spor");
  group.hidden = false;
  vaelg(start, false, false);
})();

// Konvertering: klik på et link til min kalender. GTM lytter efter eventet "booking_klik".
document.querySelectorAll('[data-track="booking"]').forEach(function (link) {
  link.addEventListener("click", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "booking_klik" });
  });
});

// Afsløring ved scroll: overskrifter og grupper glider stille ind første gang, de kommer frem.
// Kun når browseren kan det, så intet indhold nogensinde bliver hængende usynligt.
(function () {
  if (!("IntersectionObserver" in window)) return;
  var groups = [
    ".section:not(.hero) > h2", ".split-text", ".section > .lede-small", ".process-intro",
    ".steps > li", ".spor-fits", ".about-text", ".cv-head", ".cv-item", ".tool", ".panel"
  ];
  var els = [];
  groups.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (el, i) {
      el.setAttribute("data-reveal", "");
      // Elementer i samme gruppe kommer lidt efter hinanden (højst 5 trin, så intet venter længe)
      if (/li|item|tool/.test(sel)) el.style.setProperty("--i", Math.min(i, 5));
      els.push(el);
    });
  });
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -8% 0px" });
  document.documentElement.classList.add("js-reveal");
  els.forEach(function (el) { io.observe(el); });
})();
