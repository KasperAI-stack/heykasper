// Testside: memoji-vælgeren i toppen. Flyttes ind i main.js, når den er godkendt.
// Uden JavaScript vises den første mulighed med knappen til booking, og baren er skjult.

(function () {
  var picker = document.querySelector("[data-picker]");
  var scene = document.querySelector(".scene");
  if (!picker || !scene) return;

  var picks = Array.prototype.slice.call(picker.querySelectorAll(".pick"));
  var pill = picker.querySelector(".picker-pill");
  var live = scene.querySelector("[data-scene-live]");
  var cta = scene.querySelector("[data-scene-cta]");
  var lead = document.querySelector("[data-besked-lead]");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var current = picks.filter(function (p) { return p.getAttribute("aria-pressed") === "true"; })[0] || picks[0];

  var panel = function (btn) { return document.getElementById(btn.getAttribute("data-show")); };

  // Alle muligheder ligger oven på hinanden, og kun den valgte er synlig.
  picks.forEach(function (btn) {
    var item = panel(btn);
    item.hidden = false;
    item.classList.toggle("is-off", btn !== current);
  });

  // Den mørke pille glider hen bag den valgte mulighed.
  var movePill = function (animate) {
    var bar = picker.getBoundingClientRect();
    var box = current.getBoundingClientRect();
    if (!animate) pill.style.transition = "none";
    picker.style.setProperty("--px", (box.left - bar.left - picker.clientLeft) + "px");
    picker.style.setProperty("--py", (box.top - bar.top - picker.clientTop) + "px");
    picker.style.setProperty("--pw", box.width + "px");
    picker.style.setProperty("--ph", box.height + "px");
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
    scene.setAttribute("data-glow", btn.getAttribute("data-glow"));

    prev.classList.remove("is-in");
    prev.classList.add("is-out");
    clearTimeout(prev.outTimer);
    prev.outTimer = setTimeout(function () {
      prev.classList.remove("is-out");
      prev.classList.add("is-off");
    }, reduce.matches ? 0 : 200);

    clearTimeout(next.outTimer);
    next.classList.remove("is-off", "is-out", "is-in");
    void next.offsetWidth; // starter animationen forfra
    next.classList.add("is-in");

    current = btn;
    movePill(true);
    if (live) {
      live.textContent = next.querySelector(".scene-title").textContent + ". " + next.querySelector(".scene-text").textContent;
    }
  };

  picks.forEach(function (btn) {
    btn.addEventListener("click", function () { select(btn); });
  });

  // Piletasterne skifter mulighed, når baren har fokus.
  picker.addEventListener("keydown", function (e) {
    var i = picks.indexOf(current);
    var to = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: picks.length - 1 }[e.key];
    if (to === undefined) return;
    e.preventDefault();
    var btn = picks[Math.max(0, Math.min(picks.length - 1, to))];
    select(btn);
    btn.focus();
  });

  // På mobil kan man stryge til siden på memojien for at skifte.
  var swipe = scene.querySelector("[data-swipe]");
  var start = null;
  swipe.addEventListener("pointerdown", function (e) {
    if (e.isPrimary) start = { x: e.clientX, y: e.clientY };
  });
  swipe.addEventListener("pointerup", function (e) {
    if (!start) return;
    var dx = e.clientX - start.x;
    var dy = e.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
    var i = picks.indexOf(current) + (dx < 0 ? 1 : -1);
    if (i >= 0 && i < picks.length) select(picks[i]);
  });
  swipe.addEventListener("pointercancel", function () { start = null; });

  // Knappen skriver opgaven ind i formularen. Selve hoppet og fokus klarer main.js (data-focus).
  if (cta && lead) {
    cta.addEventListener("click", function () {
      lead.textContent = current.getAttribute("data-lead");
    });
  }

  picker.hidden = false;
  movePill(false);
  window.addEventListener("resize", function () { movePill(false); });
  if (document.fonts) document.fonts.ready.then(function () { movePill(false); });
})();
