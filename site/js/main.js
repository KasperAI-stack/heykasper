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

// Produktfanerne skifter illustrationen i det farvede panel.
var tabs = document.querySelectorAll(".tab[data-show]");
tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    selectTab(tab);
  });
});
function selectTab(tab) {
  tabs.forEach(function (other) {
    var active = other === tab;
    other.setAttribute("aria-pressed", active ? "true" : "false");
    var view = document.getElementById(other.getAttribute("data-show"));
    if (view) view.hidden = !active;
  });
}

// Pillerne i toppen hopper til produkterne og vælger den fane, der står på pillen.
document.querySelectorAll(".pill[data-tab]").forEach(function (pill) {
  pill.addEventListener("click", function () {
    var tab = document.querySelector('.tab[data-show="' + pill.getAttribute("data-tab") + '"]');
    if (tab) selectTab(tab);
  });
});

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
var setContactMode = function () {};
if (contactSwitch) {
  var modeButtons = contactSwitch.querySelectorAll("[data-mode]");
  var panels = document.querySelectorAll(".contact-mode[data-panel]");
  setContactMode = function (mode) {
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
