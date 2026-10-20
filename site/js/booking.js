// Bookingkalender: henter ledige tider fra /api/ledige-tider og booker via /api/book (Netlify Functions,
// der taler med Apps Scriptet). Alle tider vises i dansk tid. Svarer /api ikke (fx på testsiden på GitHub Pages),
// kører kalenderen med eksempeltider, og der bliver ikke booket noget.
(function () {
  var booker = document.querySelector("[data-booker]");
  if (!booker) return;

  var TZ = "Europe/Copenhagen";
  var VARIGHED = 30;
  var $ = function (sel) { return booker.querySelector(sel); };
  var grid = $("[data-booker-grid]");
  var monthLabel = $("[data-booker-month]");
  var prevBtn = $("[data-booker-prev]");
  var nextBtn = $("[data-booker-next]");
  var dayLabel = $("[data-booker-day]");
  var slotsEl = $("[data-booker-slots]");
  var picked = $("[data-booker-picked]");
  var form = $("[data-booker-form]");
  var errorEl = $("[data-booker-error]");
  var submitBtn = $("[data-booker-submit]");
  var live = $("[data-booker-live]");
  var fallback = document.querySelector("[data-booker-fallback]");
  var fallbackHref = fallback ? fallback.querySelector("a").href : "";

  var dagKey = new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" });
  var fmtTid = new Intl.DateTimeFormat("da-DK", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  var fmtDag = new Intl.DateTimeFormat("da-DK", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" });
  var fmtMaaned = new Intl.DateTimeFormat("da-DK", { timeZone: "UTC", month: "long", year: "numeric" });
  var fmtTime = new Intl.DateTimeFormat("en-GB", { timeZone: TZ, hour: "2-digit", hourCycle: "h23" });

  var state = { demo: false, perDag: {}, dage: [], maaned: null, dag: null, tid: null, resultat: null };

  // Datoer i kalenderen er rene datoer (åååå-mm-dd), regnet i UTC, så sommer- og vintertid ikke flytter dem
  var dato = function (key) { var p = key.split("-"); return new Date(Date.UTC(+p[0], p[1] - 1, +p[2])); };
  var keyAf = function (d) { return d.toISOString().slice(0, 10); };
  var dagNavn = function (key) { return fmtDag.format(dato(key)); };
  var tidNavn = function (iso) { return fmtTid.format(new Date(iso)); };
  var track = function (event, extra) {
    window.dataLayer = window.dataLayer || [];
    var data = { event: event };
    for (var k in extra) data[k] = extra[k];
    window.dataLayer.push(data);
  };
  var say = function (text) { live.textContent = ""; setTimeout(function () { live.textContent = text; }, 50); };

  var setStep = function (step, focusEl) {
    booker.setAttribute("data-step", step);
    if (focusEl) focusEl.focus({ preventScroll: step === "dato" });
  };

  // Eksempeltider til testsiden: hverdage fra i morgen, kl. 9 til 15.30, med huller, så det ligner en rigtig uge
  var demoTider = function () {
    var tider = [];
    var nu = new Date();
    for (var d = 1; d <= 21; d++) {
      var dag = new Date(Date.UTC(nu.getUTCFullYear(), nu.getUTCMonth(), nu.getUTCDate() + d));
      var ugedag = dag.getUTCDay();
      if (ugedag === 0 || ugedag === 6) continue;
      // Forskellen mellem dansk tid og UTC den dag (1 time om vinteren, 2 om sommeren)
      var forskel = +fmtTime.format(new Date(dag.getTime() + 12 * 3600000)) - 12;
      for (var min = 9 * 60; min + VARIGHED <= 16 * 60; min += 30) {
        if ((d * 7 + min / 30) % 3 === 0) continue;
        tider.push(new Date(dag.getTime() + (min - forskel * 60) * 60000).toISOString());
      }
    }
    return tider;
  };

  var hent = function () {
    booker.classList.add("is-loading");
    renderMaaned();
    return fetch("/api/ledige-tider", { headers: { Accept: "application/json" } })
      .then(function (res) { if (!res.ok) throw new Error(res.status); return res.json(); })
      .catch(function (err) {
        // Ingen API (testsiden eller lokalt): kør med eksempeltider. Er API'et der, men fejler, så vis linket til Google.
        if (/^(404|405)$/.test(err.message) || location.hostname.slice(-10) === ".github.io") {
          state.demo = true;
          $("[data-booker-demo]").hidden = false;
          return { tider: demoTider() };
        }
        throw err;
      })
      .then(function (data) {
        modtag(data.tider || []);
        booker.classList.remove("is-loading");
      })
      .catch(function () {
        booker.classList.remove("is-loading");
        monthLabel.textContent = "Kalenderen kan ikke hentes";
        grid.innerHTML = "";
        dayLabel.textContent = "Prøv igen om lidt";
        slotsEl.innerHTML = '<p class="booker-hint">Eller book via <a href="' + fallbackHref + '" target="_blank" rel="noopener" data-track="booking">min Google-kalender</a>.</p>';
        prevBtn.disabled = nextBtn.disabled = true;
        track("booking_fejl", { booking_fejl: "hent" });
      });
  };

  var modtag = function (tider) {
    state.perDag = {};
    tider.forEach(function (iso) {
      var key = dagKey.format(new Date(iso));
      (state.perDag[key] = state.perDag[key] || []).push(iso);
    });
    state.dage = Object.keys(state.perDag).sort();
    if (state.dag && !state.perDag[state.dag]) state.dag = null;
    if (!state.maaned) state.maaned = (state.dage[0] || keyAf(new Date())).slice(0, 7);
    renderMaaned();
    if (state.dag) renderTider(); else visForsteDag();
  };

  var visForsteDag = function () {
    dayLabel.textContent = state.dage.length ? "Vælg en dag" : "Ingen ledige tider lige nu";
    slotsEl.innerHTML = state.dage.length ? "" : '<p class="booker-hint">Skriv i stedet via <a href="#" data-booker-to-form>en forespørgsel</a>, så finder vi en tid.</p>';
  };

  var renderMaaned = function () {
    var ym = state.maaned || keyAf(new Date()).slice(0, 7);
    var forste = dato(ym + "-01");
    monthLabel.textContent = state.dage.length || !booker.classList.contains("is-loading") ? fmtMaaned.format(forste) : "Henter ledige tider";
    var foran = (forste.getUTCDay() + 6) % 7; // mandag først
    var antal = new Date(Date.UTC(forste.getUTCFullYear(), forste.getUTCMonth() + 1, 0)).getUTCDate();
    var html = "";
    var celle = 0;
    for (var i = 0; i < foran + antal; i++) {
      if (celle % 7 === 0) html += '<div class="booker-row" role="row">';
      if (i < foran) {
        html += '<div role="gridcell"></div>';
      } else {
        var key = ym + "-" + ("0" + (i - foran + 1)).slice(-2);
        var antalTider = (state.perDag[key] || []).length;
        var label = dagNavn(key) + (antalTider ? ", " + antalTider + (antalTider === 1 ? " ledig tid" : " ledige tider") : ", ingen ledige tider");
        html += '<div role="gridcell"><button type="button" class="booker-date' + (antalTider ? " is-open" : "") + '" data-dag="' + key + '"' +
          ' aria-label="' + label + '" aria-pressed="' + (key === state.dag) + '" tabindex="-1"' + (antalTider ? "" : " disabled") + ">" + (i - foran + 1) + "</button></div>";
      }
      celle++;
      if (celle % 7 === 0) html += "</div>";
    }
    if (celle % 7) { while (celle % 7) { html += '<div role="gridcell"></div>'; celle++; } html += "</div>"; }
    grid.innerHTML = html;

    // Ét tabstop i gitteret: den valgte dag, ellers den første dag med ledige tider
    var aktiv = grid.querySelector('[aria-pressed="true"]') || grid.querySelector(".is-open");
    if (aktiv) aktiv.tabIndex = 0;
    var forsteMaaned = (state.dage[0] || keyAf(new Date())).slice(0, 7);
    var sidsteMaaned = (state.dage[state.dage.length - 1] || forsteMaaned).slice(0, 7);
    prevBtn.disabled = ym <= forsteMaaned;
    nextBtn.disabled = ym >= sidsteMaaned;
  };

  var skiftMaaned = function (delta) {
    var d = dato(state.maaned + "-01");
    state.maaned = keyAf(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + delta, 1))).slice(0, 7);
    renderMaaned();
  };

  var vaelgDag = function (key) {
    state.dag = key;
    renderMaaned();
    renderTider();
    track("booking_dato_valgt", {});
    say(dagNavn(key) + ". " + state.perDag[key].length + " ledige tider.");
    // På mobil står tiderne under måneden, så de rulles frem
    if (window.matchMedia("(max-width: 55.99rem)").matches) {
      dayLabel.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  };

  var renderTider = function () {
    dayLabel.textContent = dagNavn(state.dag);
    slotsEl.classList.remove("is-in");
    slotsEl.innerHTML = state.perDag[state.dag].map(function (iso) {
      var slut = new Date(new Date(iso).getTime() + VARIGHED * 60000);
      return '<button type="button" class="booker-slot" data-tid="' + iso + '" aria-label="' + dagNavn(state.dag) + ", kl. " + tidNavn(iso) + " til " + fmtTid.format(slut) + '">' + tidNavn(iso) + "</button>";
    }).join("");
    void slotsEl.offsetWidth;
    slotsEl.classList.add("is-in");
  };

  var vaelgTid = function (iso) {
    state.tid = iso;
    picked.textContent = dagNavn(state.dag) + " kl. " + tidNavn(iso);
    picked.hidden = false;
    errorEl.hidden = true;
    submitBtn.textContent = "Book " + dagNavn(state.dag).split(" ")[0] + " kl. " + tidNavn(iso);
    track("booking_tid_valgt", {});
    setStep("form", form.querySelector("#b-navn"));
  };

  var tilbage = function () {
    picked.hidden = true;
    state.tid = null;
    setStep("dato");
    var valgt = state.dag && slotsEl.querySelector(".booker-slot");
    (valgt || grid.querySelector('[tabindex="0"]') || prevBtn).focus();
  };

  var visFejl = function (text) {
    errorEl.textContent = text;
    errorEl.hidden = false;
  };

  var book = function (data) {
    if (state.demo) {
      return new Promise(function (resolve) {
        setTimeout(function () { resolve({ status: 200, body: { status: "ok", start: data.start, meet: "" } }); }, 700);
      });
    }
    return fetch("/api/book", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (body) { return { status: res.status, body: body }; });
    });
  };

  var bekraeft = function (resultat) {
    state.resultat = resultat;
    var meet = $("[data-booker-meet]");
    $("[data-booker-done-text]").textContent = state.demo
      ? "Sådan ser bekræftelsen ud. På den rigtige side står mødet nu i begge kalendere, og invitationen med linket til Google Meet ligger i jeres indbakke."
      : "Vi ses " + dagNavn(state.dag) + " kl. " + tidNavn(resultat.start) + ". Invitationen med linket til Google Meet ligger i jeres indbakke.";
    meet.hidden = !resultat.meet;
    if (resultat.meet) meet.href = resultat.meet;
    setStep("done", $("[data-booker-done-title]"));
    track("booking_bekraeftet", {});
  };

  // .ics-fil til kalendere uden Google, lavet i browseren
  var ics = function () {
    var start = new Date(state.resultat.start);
    var slut = new Date(start.getTime() + VARIGHED * 60000);
    var stempel = function (d) { return d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); };
    var linjer = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Hey Kasper//Booking//DA", "BEGIN:VEVENT",
      "UID:" + stempel(start) + "@hey-kasper.dk", "DTSTAMP:" + stempel(new Date()),
      "DTSTART:" + stempel(start), "DTEND:" + stempel(slut),
      "SUMMARY:Afklaring med Hey Kasper",
      "DESCRIPTION:" + (state.resultat.meet ? "Google Meet: " + state.resultat.meet : "Linket til Google Meet står i invitationen."),
      state.resultat.meet ? "LOCATION:" + state.resultat.meet : "",
      "END:VEVENT", "END:VCALENDAR",
    ].filter(Boolean);
    var url = URL.createObjectURL(new Blob([linjer.join("\r\n")], { type: "text/calendar" }));
    var a = document.createElement("a");
    a.href = url;
    a.download = "afklaring-hey-kasper.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  };

  // Hændelser
  prevBtn.addEventListener("click", function () { skiftMaaned(-1); });
  nextBtn.addEventListener("click", function () { skiftMaaned(1); });

  grid.addEventListener("click", function (e) {
    var btn = e.target.closest(".booker-date.is-open");
    if (btn) vaelgDag(btn.getAttribute("data-dag"));
  });

  // Piletaster flytter mellem dagene (op og ned er en uge), Home og End går til ugens start og slut
  grid.addEventListener("keydown", function (e) {
    var btn = e.target.closest(".booker-date");
    if (!btn) return;
    var trin = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
    var d = dato(btn.getAttribute("data-dag"));
    if (e.key === "Home") trin = -((d.getUTCDay() + 6) % 7);
    if (e.key === "End") trin = 6 - ((d.getUTCDay() + 6) % 7);
    if (trin === undefined) return;
    e.preventDefault();
    var maal = keyAf(new Date(d.getTime() + trin * 86400000));
    if (maal.slice(0, 7) !== state.maaned) {
      state.maaned = maal.slice(0, 7);
      renderMaaned();
    }
    var ny = grid.querySelector('[data-dag="' + maal + '"]');
    if (!ny) return;
    grid.querySelectorAll(".booker-date").forEach(function (b) { b.tabIndex = -1; });
    ny.tabIndex = 0;
    ny.focus();
  });

  slotsEl.addEventListener("click", function (e) {
    var btn = e.target.closest(".booker-slot");
    if (btn) vaelgTid(btn.getAttribute("data-tid"));
    var tilForm = e.target.closest("[data-booker-to-form]");
    if (tilForm) {
      e.preventDefault();
      var knap = document.querySelector('[data-mode="forespoergsel"]');
      if (knap) knap.click();
    }
  });

  $("[data-booker-back]").addEventListener("click", tilbage);
  $("[data-booker-ics]").addEventListener("click", ics);

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    if (!f.navn.value.trim()) { visFejl("Skriv jeres navn, så ved jeg, hvem jeg skal møde."); f.navn.focus(); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim())) { visFejl("Tjek e-mailen. Invitationen bliver sendt dertil."); f.email.focus(); return; }
    errorEl.hidden = true;
    submitBtn.disabled = true;
    var tekst = submitBtn.textContent;
    submitBtn.textContent = "Booker …";
    book({
      start: state.tid, navn: f.navn.value, virksomhed: f.virksomhed.value,
      email: f.email.value, emne: f.emne.value, website: f.website.value,
    }).then(function (svar) {
      submitBtn.disabled = false;
      submitBtn.textContent = tekst;
      if (svar.status === 200 && svar.body.status === "ok") return bekraeft(svar.body);
      if (svar.status === 409) {
        track("booking_fejl", { booking_fejl: "optaget" });
        tilbage();
        dayLabel.textContent = "Den tid nåede en anden at tage";
        hent().then(function () {
          if (state.dag) renderTider();
          say("Den tid nåede en anden at tage. Her er de ledige tider lige nu.");
        });
        return;
      }
      track("booking_fejl", { booking_fejl: String(svar.status) });
      visFejl(svar.status === 429
        ? "Der er sendt mange bookinger på kort tid. Prøv igen om et minut."
        : "Mødet kunne ikke bookes lige nu. Prøv igen, eller book via min Google-kalender nederst i boksen.");
    }).catch(function () {
      submitBtn.disabled = false;
      submitBtn.textContent = tekst;
      track("booking_fejl", { booking_fejl: "netvaerk" });
      visFejl("Forbindelsen svigtede. Tjek nettet, og prøv igen.");
    });
  });

  // Start: vis kalenderen i stedet for linket, og hent tiderne, når bookingsektionen nærmer sig skærmen
  booker.hidden = false;
  var hentet = false;
  var start = function () { if (!hentet) { hentet = true; hent(); } };
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      if (entries.some(function (en) { return en.isIntersecting; })) { start(); io.disconnect(); }
    }, { rootMargin: "800px 0px" });
    io.observe(booker);
  } else {
    start();
  }
})();
