/**
 * Automatisering af henvendelser fra landingpagen.
 *
 * Kører gratis i Google Apps Script på Kaspers egen Google-konto.
 * Netlify sender hver ny formular hertil (outgoing webhook), og scriptet
 *   1. gemmer henvendelsen i et Google Sheet,
 *   2. sender Kasper en mail om den nye henvendelse,
 *   3. sender et automatisk svar til afsenderen med link til at booke en tid,
 *   4. minder Kasper om henvendelser, der stadig står som "Ny" dagen efter.
 *
 * Bookingkalenderen på siden bruger samme webapp via to Netlify Functions:
 *   - GET  ?action=ledige-tider  giver de ledige tider (Freebusy på Kaspers kalendere)
 *   - POST {"action": "book"}    opretter mødet med Google Meet, gemmer det i arket og mailer Kasper
 *
 * Opsætning: se docs/automatisering.md. Bookingen kræver den avancerede tjeneste "Google Calendar API".
 */

const INDSTILLINGER = {
  // En lang, hemmelig tekst, som kun Netlify og scriptet kender. Skift den, før du går i gang.
  HEMMELIG_NOEGLE: 'SKIFT-MIG-til-en-lang-tilfaeldig-tekst',

  // Linket i det automatiske svar: bookingkalenderen på siden.
  BOOKING_LINK: 'https://hey-kasper.dk/#book',

  // Navnet, som står som afsender på det automatiske svar.
  AFSENDER_NAVN: 'Kasper Schrøder Asmussen',

  // Klokkeslæt for den daglige påmindelse om ubesvarede henvendelser.
  PAAMINDELSE_KL: 8,

  // Regler for bookingkalenderen på siden. Alle tider er dansk tid.
  BOOKING: {
    TITEL: 'Afklaring med Hey Kasper',
    TIDSZONE: 'Europe/Copenhagen',
    VARIGHED_MIN: 30,
    INTERVAL_MIN: 30,            // hvor tit en ny tid starter
    BUFFER_MIN: 15,              // fri tid før og efter andre aftaler
    VARSEL_TIMER: 12,            // mindste varsel
    DAGE_FREM: 21,
    UGEDAGE: [1, 2, 3, 4, 5],    // 1 = mandag, 7 = søndag
    START_KL: '09:00',
    SLUT_KL: '16:00',            // sidste møde slutter senest her
    KALENDERE: ['primary'],      // kalendere, hvor en aftale gør tiden optaget
  },
};

const KOLONNER = ['Modtaget', 'Status', 'Navn', 'Virksomhed', 'E-mail', 'Telefon', 'Besked', 'Samarbejde'];

/**
 * Kør denne funktion én gang fra editoren. Den opretter arket og den daglige påmindelse,
 * og Google beder dig om at give scriptet lov til at sende mails og skrive i arket.
 */
function opsaet() {
  const props = PropertiesService.getScriptProperties();
  let ark = hentArk_();
  if (!ark) {
    const regneark = SpreadsheetApp.create('Henvendelser fra landingpagen');
    ark = regneark.getSheets()[0];
    ark.setName('Henvendelser');
    ark.appendRow(KOLONNER);
    ark.setFrozenRows(1);
    ark.getRange(1, 1, 1, KOLONNER.length).setFontWeight('bold');
    ark.getRange('B2:B').setDataValidation(
      SpreadsheetApp.newDataValidation().requireValueInList(['Ny', 'Besvaret', 'Møde booket', 'Ikke relevant']).build()
    );
    props.setProperty('ARK_ID', regneark.getId());
  }

  ScriptApp.getProjectTriggers()
    .filter(function (t) { return t.getHandlerFunction() === 'paamindelse'; })
    .forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ScriptApp.newTrigger('paamindelse').timeBased().everyDays(1).atHour(INDSTILLINGER.PAAMINDELSE_KL).create();

  Logger.log('Klar. Arket ligger her: ' + ark.getParent().getUrl());
}

/** Netlify kalder denne funktion, hver gang nogen sender formularen eller booker et møde. */
function doPost(e) {
  if (!e || !e.parameter || e.parameter.token !== INDSTILLINGER.HEMMELIG_NOEGLE) {
    console.warn('Afvist: nøglen i URL\'en passer ikke med HEMMELIG_NOEGLE. Tjek "?token=" i Netlify, og husk at lave en ny version af implementeringen, når du ændrer koden.');
    return svar_('afvist');
  }

  let data = {};
  try {
    const payload = JSON.parse(e.postData.contents);
    if (payload.action === 'book') return json_(bookMoede_(payload));
    data = payload.data || {};
    data.modtaget = payload.created_at ? new Date(payload.created_at) : new Date();
  } catch (fejl) {
    console.error('Kunne ikke læse data fra Netlify: ' + fejl);
    return svar_('ugyldig data');
  }

  // Svar altid Netlify med "OK", så webhooken ikke bliver slået fra. Fejl kan ses under Udførelser.
  try {
    return behandl_(data);
  } catch (fejl) {
    console.error('Fejl under behandling: ' + fejl + '. Har du kørt opsaet() og givet tilladelse?');
    return svar_('fejl');
  }
}

/** Bookingkalenderen henter ledige tider her. Uden action kan URL'en åbnes i en browser for at tjekke, at den kan nås. */
function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'ledige-tider') {
    if (p.token !== INDSTILLINGER.HEMMELIG_NOEGLE) return svar_('afvist');
    try {
      return json_({ status: 'ok', tidszone: INDSTILLINGER.BOOKING.TIDSZONE, varighed: INDSTILLINGER.BOOKING.VARIGHED_MIN, tider: ledigeTider_(false) });
    } catch (fejl) {
      console.error('Kunne ikke hente ledige tider: ' + fejl + '. Er tjenesten "Google Calendar API" slået til?');
      return svar_('fejl');
    }
  }
  return ContentService.createTextOutput('Scriptet kører og kan nås udefra.');
}

/**
 * Kør denne funktion fra editoren for at teste uden Netlify.
 * Den opretter en testhenvendelse med din egen e-mail, så du får begge mails og en ny række i arket.
 */
function testHenvendelse() {
  const status = behandl_({
    modtaget: new Date(),
    navn: 'Test Testesen',
    virksomhed: 'Testfirma',
    email: minEmail_(),
    telefon: '',
    besked: 'Dette er en test fra script.google.com.',
    samarbejde: 'Ved ikke endnu',
  });
  Logger.log('Resultat: ' + status.getContent());
}

/**
 * Kør denne funktion fra editoren for at teste bookingen uden siden.
 * Den booker den første ledige tid med din egen e-mail. Slet mødet i kalenderen bagefter.
 */
function testBooking() {
  const tider = ledigeTider_(true);
  Logger.log('Ledige tider: ' + tider.length + (tider.length ? ', første: ' + tider[0] : ''));
  if (!tider.length) return;
  const resultat = bookMoede_({ start: tider[0], navn: 'Test Testesen', virksomhed: 'Testfirma', email: minEmail_(), emne: 'Test fra script.google.com' });
  Logger.log('Resultat: ' + JSON.stringify(resultat));
}

function behandl_(data) {
  const henvendelse = {
    modtaget: data.modtaget,
    navn: tekst_(data.navn),
    virksomhed: tekst_(data.virksomhed),
    email: tekst_(data.email),
    telefon: tekst_(data.telefon),
    besked: tekst_(data.besked),
    samarbejde: tekst_(data.samarbejde),
  };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(henvendelse.email)) {
    console.warn('Afvist: henvendelsen har ingen gyldig e-mail.');
    return svar_('mangler e-mail');
  }

  const laas = LockService.getScriptLock();
  laas.waitLock(20000);
  try {
    gemIArk_(henvendelse);
  } finally {
    laas.releaseLock();
  }

  sendBeskedTilMig_(henvendelse);
  sendAutosvar_(henvendelse);
  console.log('Modtaget og sendt videre: ' + henvendelse.navn + ' (' + henvendelse.email + ')');
  return svar_('ok');
}

/** Kører hver morgen og sender en liste over henvendelser, der er mere end et døgn gamle og stadig står som "Ny". */
function paamindelse() {
  const ark = hentArk_();
  if (!ark || ark.getLastRow() < 2) return;

  const graense = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const raekker = ark.getRange(2, 1, ark.getLastRow() - 1, KOLONNER.length).getValues();
  const ubesvarede = raekker.filter(function (r) {
    return r[1] === 'Ny' && r[0] instanceof Date && r[0] < graense;
  });
  if (ubesvarede.length === 0) return;

  const liste = ubesvarede.map(function (r) {
    return '- ' + r[2] + ', ' + r[3] + ' (' + r[4] + '), modtaget ' + dato_(r[0]);
  }).join('\n');

  MailApp.sendEmail({
    to: minEmail_(),
    subject: 'Påmindelse: ' + ubesvarede.length + ' henvendelse(r) venter på svar',
    body: 'Disse henvendelser står stadig som "Ny" i arket:\n\n' + liste +
      '\n\nSæt status til "Besvaret" eller "Møde booket", når du har svaret.\n' + ark.getParent().getUrl(),
  });
}

/**
 * Ledige starttider som ISO-tekster (UTC). Tiderne følger reglerne i INDSTILLINGER.BOOKING,
 * og en tid er optaget, hvis den inklusive buffer rører en aftale i en af KALENDERE.
 * Resultatet gemmes i ét minut, så siden svarer hurtigt. frisk = true springer gemmet over.
 */
function ledigeTider_(frisk) {
  const b = INDSTILLINGER.BOOKING;
  const cache = CacheService.getScriptCache();
  if (!frisk) {
    const gemt = cache.get('ledige-tider');
    if (gemt) return JSON.parse(gemt);
  }

  const nu = new Date();
  const tidligst = new Date(nu.getTime() + b.VARSEL_TIMER * 3600000);
  const svar = Calendar.Freebusy.query({
    timeMin: nu.toISOString(),
    timeMax: new Date(nu.getTime() + (b.DAGE_FREM + 1) * 86400000).toISOString(),
    timeZone: b.TIDSZONE,
    items: b.KALENDERE.map(function (id) { return { id: id }; }),
  });
  const optaget = [];
  Object.keys(svar.calendars || {}).forEach(function (id) {
    (svar.calendars[id].busy || []).forEach(function (blok) {
      optaget.push([new Date(blok.start).getTime() - b.BUFFER_MIN * 60000, new Date(blok.end).getTime() + b.BUFFER_MIN * 60000]);
    });
  });

  const tider = [];
  const start = b.START_KL.split(':').map(Number);
  const slut = b.SLUT_KL.split(':').map(Number);
  for (let d = 0; d <= b.DAGE_FREM; d++) {
    const dag = new Date(nu.getTime() + d * 86400000);
    if (b.UGEDAGE.indexOf(Number(Utilities.formatDate(dag, b.TIDSZONE, 'u'))) === -1) continue;
    const dato = Utilities.formatDate(dag, b.TIDSZONE, 'yyyy-MM-dd');
    for (let min = start[0] * 60 + start[1]; min + b.VARIGHED_MIN <= slut[0] * 60 + slut[1]; min += b.INTERVAL_MIN) {
      const kl = ('0' + Math.floor(min / 60)).slice(-2) + ':' + ('0' + (min % 60)).slice(-2);
      // parseDate regner i dansk tid, så skiftet til sommer- og vintertid kommer med af sig selv
      const fra = Utilities.parseDate(dato + ' ' + kl, b.TIDSZONE, 'yyyy-MM-dd HH:mm').getTime();
      const til = fra + b.VARIGHED_MIN * 60000;
      if (fra < tidligst.getTime()) continue;
      if (!optaget.some(function (o) { return fra < o[1] && til > o[0]; })) tider.push(new Date(fra).toISOString());
    }
  }

  cache.put('ledige-tider', JSON.stringify(tider), 60);
  return tider;
}

/**
 * Opretter mødet i Kaspers kalender med Google Meet og kunden som gæst. Google sender invitationen.
 * Tiden tjekkes igen under en lås, så to personer ikke kan booke den samme tid.
 */
function bookMoede_(p) {
  const b = INDSTILLINGER.BOOKING;
  const navn = tekst_(p.navn).slice(0, 200);
  const virksomhed = tekst_(p.virksomhed).slice(0, 200);
  const email = tekst_(p.email).slice(0, 200);
  const emne = tekst_(p.emne).slice(0, 2000);
  const start = new Date(p.start);
  if (!navn || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || isNaN(start.getTime())) {
    console.warn('Booking afvist: navn, e-mail eller tid mangler.');
    return { status: 'ugyldig' };
  }

  const laas = LockService.getScriptLock();
  laas.waitLock(20000);
  let begivenhed;
  try {
    if (ledigeTider_(true).indexOf(start.toISOString()) === -1) return { status: 'optaget' };
    const slut = new Date(start.getTime() + b.VARIGHED_MIN * 60000);
    begivenhed = Calendar.Events.insert({
      summary: b.TITEL + ': ' + navn + (virksomhed ? ', ' + virksomhed : ''),
      description: 'Booket på hey-kasper.dk\n\nNavn: ' + navn + '\nVirksomhed: ' + (virksomhed || 'ikke oplyst') +
        '\nE-mail: ' + email + '\n\nHvad skal vi kigge på?\n' + (emne || '(ikke udfyldt)'),
      start: { dateTime: start.toISOString(), timeZone: b.TIDSZONE },
      end: { dateTime: slut.toISOString(), timeZone: b.TIDSZONE },
      attendees: [{ email: email, displayName: navn }],
      conferenceData: { createRequest: { requestId: Utilities.getUuid(), conferenceSolutionKey: { type: 'hangoutsMeet' } } },
      reminders: { useDefault: true },
    }, 'primary', { conferenceDataVersion: 1, sendUpdates: 'all' });
    CacheService.getScriptCache().remove('ledige-tider');
    gemIArk_({
      modtaget: new Date(), status: 'Møde booket', navn: navn, virksomhed: virksomhed, email: email, telefon: '',
      besked: 'Møde ' + dato_(start) + (emne ? '. ' + emne : ''), samarbejde: '',
    });
  } finally {
    laas.releaseLock();
  }

  MailApp.sendEmail({
    to: minEmail_(),
    replyTo: email,
    subject: 'Nyt møde booket: ' + navn + (virksomhed ? ', ' + virksomhed : '') + ', ' + dato_(start),
    body: navn + (virksomhed ? ' fra ' + virksomhed : '') + ' har booket ' + dato_(start) + '.\n\n' +
      'E-mail: ' + email + '\nHvad skal vi kigge på?\n' + (emne || '(ikke udfyldt)') + '\n\n' +
      'Mødet: ' + begivenhed.htmlLink + (begivenhed.hangoutLink ? '\nGoogle Meet: ' + begivenhed.hangoutLink : ''),
  });
  console.log('Møde booket: ' + navn + ' (' + email + ') ' + dato_(start));
  return { status: 'ok', start: start.toISOString(), meet: begivenhed.hangoutLink || '' };
}

function gemIArk_(h) {
  const ark = hentArk_();
  if (!ark) throw new Error('Arket findes ikke. Kør opsaet() først.');
  // Ældre ark mangler overskriften til den nye kolonne, så den sættes, hvis den er tom.
  if (ark.getRange(1, KOLONNER.length).getValue() === '') ark.getRange(1, KOLONNER.length).setValue('Samarbejde').setFontWeight('bold');
  ark.appendRow([h.modtaget, h.status || 'Ny', sikker_(h.navn), sikker_(h.virksomhed), sikker_(h.email), sikker_(h.telefon), sikker_(h.besked), sikker_(h.samarbejde)]);
}

function sendBeskedTilMig_(h) {
  const ark = hentArk_();
  MailApp.sendEmail({
    to: minEmail_(),
    replyTo: h.email,
    subject: 'Ny henvendelse: ' + (h.navn || 'Ukendt') + (h.virksomhed ? ', ' + h.virksomhed : ''),
    body:
      'Navn: ' + h.navn + '\n' +
      'Virksomhed: ' + h.virksomhed + '\n' +
      'E-mail: ' + h.email + '\n' +
      'Telefon: ' + (h.telefon || 'ikke oplyst') + '\n' +
      'Samarbejde: ' + (h.samarbejde || 'ikke valgt') + '\n\n' +
      'Hey Kasper, hjælp os med:\n' + (h.besked || '(ikke udfyldt)') + '\n\n' +
      'Svar direkte på denne mail for at skrive til ' + (h.navn || 'afsenderen') + '.\n' +
      'Alle henvendelser: ' + (ark ? ark.getParent().getUrl() : ''),
  });
}

function sendAutosvar_(h) {
  const fornavn = (h.navn || '').split(' ')[0];
  const hilsen = fornavn ? 'Hej ' + fornavn : 'Hej';
  const tekst =
    hilsen + '\n\n' +
    'Tak for jeres besked. Jeg har modtaget den og vender tilbage inden for en arbejdsdag.\n\n' +
    'Hvis I hellere vil finde et tidspunkt med det samme, kan I booke et møde på 30 minutter direkte på siden her:\n' +
    INDSTILLINGER.BOOKING_LINK + '\n\n' +
    'Venlig hilsen\n' + INDSTILLINGER.AFSENDER_NAVN;

  MailApp.sendEmail({
    to: h.email,
    subject: 'Tak for jeres henvendelse',
    body: tekst,
    name: INDSTILLINGER.AFSENDER_NAVN,
    replyTo: minEmail_(),
  });
}

function hentArk_() {
  const id = PropertiesService.getScriptProperties().getProperty('ARK_ID');
  if (!id) return null;
  return SpreadsheetApp.openById(id).getSheetByName('Henvendelser');
}

function minEmail_() {
  return Session.getEffectiveUser().getEmail();
}

function tekst_(v) {
  return String(v == null ? '' : v).trim().slice(0, 5000);
}

// Forhindrer, at tekst fra formularen bliver tolket som en formel i arket.
function sikker_(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function dato_(d) {
  return Utilities.formatDate(d, 'Europe/Copenhagen', 'd/M HH:mm');
}

function svar_(status) {
  return json_({ status: status });
}

function json_(objekt) {
  return ContentService.createTextOutput(JSON.stringify(objekt)).setMimeType(ContentService.MimeType.JSON);
}
