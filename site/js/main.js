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

// Hero: I siger "Hey Kasper, byg os lige …", og memojien svarer med den agent, I vælger i rækken.
// Uden JavaScript vises den midterste agent, og rækken er skjult.
(function () {
  var hero = document.querySelector(".hero-pick");
  var picker = hero && hero.querySelector("[data-picker]");
  if (!picker) return;

  var picks = Array.prototype.slice.call(picker.querySelectorAll(".pick"));
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

  var select = function (btn) {
    if (btn === current) return;
    var prev = panel(current);
    var next = panel(btn);

    picks.forEach(function (p) { p.setAttribute("aria-pressed", p === btn ? "true" : "false"); });

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
    talk();
    if (live) live.textContent = btn.getAttribute("aria-label") + ". " + next.querySelector(".scene-text").textContent;
  };

  picks.forEach(function (btn) {
    btn.addEventListener("click", function () { select(btn); });
  });

  // Piletasterne skifter agent, når rækken har fokus.
  picker.addEventListener("keydown", function (e) {
    var i = picks.indexOf(current);
    var to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: picks.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    var btn = picks[Math.max(0, Math.min(picks.length - 1, to))];
    select(btn);
    btn.focus();
  });

  // På mobil kan man stryge til siden på svaret eller rækken for at skifte.
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
  panel(current).classList.add("is-in");
  if (!reduce.matches) setTimeout(talk, 400);
})();

// Samarbejdsformer: knappen i hver kolonne hopper ned til booking og vælger samarbejdsformen i formularen på forhånd.
// GTM kan lytte efter eventet "samarbejdsform_valgt" (parameter: form). Intet bliver målt uden samtykke.
(function () {
  var navne = { fastansat: "Fastansat", konsulent: "Konsulent", projekt: "Projekt" };
  var felt = document.getElementById("samarbejde-felt");
  document.querySelectorAll("[data-vaelg-spor]").forEach(function (link) {
    link.addEventListener("click", function () {
      var spor = link.getAttribute("data-vaelg-spor");
      if (!navne[spor]) return;
      if (felt) felt.value = navne[spor];
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({ event: "samarbejdsform_valgt", form: spor });
    });
  });
})();

// Konvertering: klik på et link til min kalender. GTM lytter efter eventet "booking_klik".
// Klik inde i den indlejrede kalender kan siden ikke se, fordi rammen ligger hos Google.
document.querySelectorAll('[data-track="booking"]').forEach(function (link) {
  link.addEventListener("click", function () {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "booking_klik" });
  });
});
