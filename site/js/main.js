// Siden virker uden JavaScript. Dette er kun små forbedringer.

// Forhindrer dobbelt afsendelse af formularen.
document.querySelectorAll("form[data-netlify]").forEach(function (form) {
  form.addEventListener("submit", function () {
    var button = form.querySelector('button[type="submit"]');
    if (button) {
      button.disabled = true;
      button.textContent = "Sender";
    }
  });
});

// Svarfeltet i toppen hopper ned til formularen og sætter markøren i beskedfeltet.
document.querySelectorAll("[data-focus]").forEach(function (link) {
  link.addEventListener("click", function () {
    var field = document.getElementById(link.getAttribute("data-focus"));
    if (field) {
      setTimeout(function () { field.focus({ preventScroll: true }); }, 400);
    }
  });
});

// Produktfanerne skifter illustrationen i det farvede panel.
var tabs = document.querySelectorAll(".tab[data-show]");
tabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    tabs.forEach(function (other) {
      var active = other === tab;
      other.setAttribute("aria-pressed", active ? "true" : "false");
      var view = document.getElementById(other.getAttribute("data-show"));
      if (view) view.hidden = !active;
    });
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

// Svarfeltet i toppen skal altid åbne formularen, også hvis booking er valgt.
document.querySelectorAll("[data-focus]").forEach(function (link) {
  link.addEventListener("click", function () { setContactMode("forespoergsel"); });
});
