// Testside: "Hey Kasper, byg os lige" og agent-vælgeren i toppen. Flyttes ind i main.js, når den er godkendt.
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

  // Den hvide pude glider hen bag den valgte agent og strækker sig lidt på vejen.
  var movePill = function (animate) {
    var a = current.arc;
    if (!animate) pill.style.transition = "none";
    picker.style.setProperty("--px", a.x + "px");
    picker.style.setProperty("--py", a.y + "px");
    picker.style.setProperty("--prot", a.rot + "deg");
    if (!animate) {
      void pill.offsetWidth;
      pill.style.transition = "";
    } else if (!reduce.matches) {
      pill.classList.remove("is-moving");
      void pill.offsetWidth;
      pill.classList.add("is-moving");
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
    }, reduce.matches ? 0 : 220);

    clearTimeout(next.outTimer);
    next.classList.remove("is-off", "is-out", "is-in");
    void next.offsetWidth; // starter animationen forfra
    if (!reduce.matches) next.classList.add("is-in");

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
  if (!reduce.matches) {
    panel(current).classList.add("is-in");
    setTimeout(talk, 400);
  }
  window.addEventListener("resize", function () { layout(); movePill(false); });
  if (document.fonts) document.fonts.ready.then(function () { layout(); movePill(false); });
})();
