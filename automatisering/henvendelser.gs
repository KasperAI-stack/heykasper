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
 * Opsætning: se docs/automatisering.md.
 */

const INDSTILLINGER = {
  // En lang, hemmelig tekst, som kun Netlify og scriptet kender. Skift den, før du går i gang.
  HEMMELIG_NOEGLE: 'SKIFT-MIG-til-en-lang-tilfaeldig-tekst',

  // Linket til din bookingside i Google Kalender (samme link som på hjemmesiden).
  BOOKING_LINK: 'https://calendar.app.google/h7uCdYSGWCpxRuK57',

  // Navnet, som står som afsender på det automatiske svar.
  AFSENDER_NAVN: 'Kasper Schrøder Asmussen',

  // Klokkeslæt for den daglige påmindelse om ubesvarede henvendelser.
  PAAMINDELSE_KL: 8,
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

/** Netlify kalder denne funktion, hver gang nogen sender formularen. */
function doPost(e) {
  if (!e || !e.parameter || e.parameter.token !== INDSTILLINGER.HEMMELIG_NOEGLE) {
    console.warn('Afvist: nøglen i URL\'en passer ikke med HEMMELIG_NOEGLE. Tjek "?token=" i Netlify, og husk at lave en ny version af implementeringen, når du ændrer koden.');
    return svar_('afvist');
  }

  let data = {};
  try {
    const payload = JSON.parse(e.postData.contents);
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

/** Åbn webapp-URL'en i en browser for at tjekke, at den kan nås. */
function doGet() {
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

function gemIArk_(h) {
  const ark = hentArk_();
  if (!ark) throw new Error('Arket findes ikke. Kør opsaet() først.');
  // Ældre ark mangler overskriften til den nye kolonne, så den sættes, hvis den er tom.
  if (ark.getRange(1, KOLONNER.length).getValue() === '') ark.getRange(1, KOLONNER.length).setValue('Samarbejde').setFontWeight('bold');
  ark.appendRow([h.modtaget, 'Ny', sikker_(h.navn), sikker_(h.virksomhed), sikker_(h.email), sikker_(h.telefon), sikker_(h.besked), sikker_(h.samarbejde)]);
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
    'Hvis I hellere vil finde et tidspunkt med det samme, kan I booke et møde på 30 minutter direkte i min kalender her:\n' +
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
  return ContentService.createTextOutput(JSON.stringify({ status: status })).setMimeType(ContentService.MimeType.JSON);
}
