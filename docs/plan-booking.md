# Plan: egen bookingkalender i Hey Kasper-stil

Status 2026-10-20: fase 2 til 4 er bygget (Apps Script, Netlify Functions og UI med demo-data), og designet er testet lokalt. Fase 5 kræver opsætningen i docs/automatisering.md, del 4. Beslutningerne nederst er sat til standardværdier, som kan rettes i `INDSTILLINGER.BOOKING`.

Afvigelse fra planen: på mobil bruges månedsgitteret også (44px dage er plads til på 390px), i stedet for dato-chips. Tiderne står under måneden og rulles frem, når man vælger en dag.

## Målet

Den indlejrede Google-kalender i bookingsektionen skiftes ud med en kalender, vi selv bygger. Den skal se ud som resten af siden i både lyst og mørkt tema, og bookinger skal stadig ende i Kaspers Google Kalender med et Google Meet-link. Det kører gennem Apps Scriptet, som allerede modtager formularen.

Gevinsterne ud over designet:

- **En rigtig konvertering.** I dag kan siden ikke se bookinger inde i Googles iframe (se docs/sporing.md). Med vores egen kalender kan vi sende `booking_bekraeftet`, når mødet faktisk står i kalenderen.
- **Bookingen lander i arket.** Den samme række i Google Sheet'et, som henvendelserne bruger, med status "Møde booket".
- **Ingen iframe.** `frame-src https://calendar.google.com` kan fjernes fra CSP'en, og Google sætter ikke længere cookies i rammen.

## Hvad andre gør

| Tilgang | Hvordan | Vurdering |
|---|---|---|
| Googles aftaleplan (det vi har) | Iframe eller link til `calendar.app.google` | Kan ikke styles, og jeg har ikke fundet nogen dokumenteret API til aftaleplaner. Bookinger inde i rammen kan ikke måles |
| Egen side på Calendar API | Frontend kalder et eget endpoint, der læser ledige tider og opretter begivenheden med `events.insert`. Google Kalender er databasen, ingen anden lagring ([Furmanets](https://andriifurmanets.com/blogs/build-your-own-booking-system-comprehensive-guide)) | Det mønster, vi følger. Forfatterens egne lærdomme: tjek for overlap lige før oprettelsen, test tidszoner tidligt, vis kontaktfelterne først, når en tid er valgt, og lav spambeskyttelse fra start |
| Apps Script som backend | `Calendar.Events.insert` med `conferenceData.createRequest` og `conferenceDataVersion: 1` giver et Meet-link ([Labnol](https://www.labnol.org/schedule-google-meeting-calendar-210529), [Tanaike](https://gist.github.com/tanaikech/94791d48823e9659aa376cf7f0161d9b), [YAMM](https://yamm.com/blog/create-calendar-events-with-google-meet-links-using-the-calendar-api-and-google-apps-script/)) | Passer til os: scriptet kører allerede som Kasper, så der skal ingen servicekonto eller OAuth-nøgler til |
| Cal.com / Calendly | Hostet booker med layouts til måned, uge og kolonner ([Cal.com](https://cal.com/blog/enhanced-flexibility-take-advantage-of-cal-com-s-multiple-booking-layouts)) | God reference for layoutet, men det er en tredjepart med eget design og egne cookies. Det er det, vi vil væk fra |

UX-mønstre, der går igen ([Eleken](https://www.eleken.co/blog-posts/calendar-ui), [Appy Pie](https://www.appypie.com/blog/booking-app-ux-patterns), [UX Movement](https://uxmovement.medium.com/the-best-mobile-ui-for-picking-date-and-time-ca226b719c9), [UX Patterns](https://uxpatterns.dev/patterns/forms/date-picker)):

- Vis kun tider, der kan bookes. Dage uden ledige tider er gråtonede og kan ikke vælges.
- Åbn på den første dag med ledige tider, ikke på i dag.
- På mobil bruges dato-chips og tidsknapper i stedet for spinnere. Trykområder skal være mindst 44px.
- Opdag tidszonen automatisk, og sig det tydeligt, når den besøgende ikke er i dansk tid.
- Tidsknapper skal have en fuld skærmlæsertekst med dato, klokkeslæt og varighed.

## Arkitektur

```
Browser (bookingsektionen)
   │  fetch, samme domæne (CSP connect-src 'self' holder)
   ▼
Netlify Functions  /api/ledige-tider   /api/book
   │  tjekker input og spam, tilføjer den hemmelige nøgle
   ▼
Apps Script webapp (henvendelser.gs, kører som Kasper)
   ├─ ledige tider: Freebusy på Kaspers kalendere, regler for arbejdstid
   └─ booking: lås, tjek igen, Calendar.Events.insert med Meet og gæst, række i arket, mail
```

**Hvorfor en Netlify Function i midten og ikke et direkte kald til Apps Script fra browseren?**

- Et Apps Script-webapp svarer via en redirect til `script.googleusercontent.com` og kan ikke sætte CORS-headere. Det driller især POST fra browseren ([Content Service](https://developers.google.com/apps-script/guides/content), [Airtable-tråd](https://community.airtable.com/t/new-remote-fetch-in-scripting-app/37611/5)). Fra en server er det ikke et problem.
- Den hemmelige nøgle bliver på serveren. Lå den i sidens JavaScript, kunne alle oprette møder i Kaspers kalender.
- Spamtjek og en grænse for antal kald pr. IP kan ligge i funktionen, før noget når kalenderen.
- Siden kalder sit eget domæne, så CSP'en kun skal ændres ved at fjerne `calendar.google.com`.

**Apps Script: to nye handlinger i den samme webapp**

- `ledige-tider` (GET): læser regler fra `INDSTILLINGER` (hverdage, fx 9 til 16, 30 minutter, buffer og mindste varsel), henter optaget tid med `Calendar.Freebusy.query` for de kalendere, der skal tælle, og returnerer de næste [INDSÆT: antal] dages ledige tider i Europe/Copenhagen. Resultatet caches i `CacheService` i ca. 60 sekunder, så sektionen svarer hurtigt.
- `book` (POST): tager `LockService`, spørger Freebusy igen for netop den tid (to personer kan have valgt den samme tid), opretter begivenheden med `Calendar.Events.insert` (Meet via `conferenceData`, kunden som gæst, `sendUpdates: 'all'`, så Google sender invitationen), skriver en række i arket og mailer Kasper. Returnerer tid og Meet-link. Optaget tid giver svaret `409`, og siden viser så de nye ledige tider.
- Den eksisterende `doPost` fra Netlify-formularen bliver, som den er. Handlingerne skilles ad med et `action`-felt.

**Kvoter for en almindelig Gmail** ([Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)): 5.000 oprettede begivenheder om dagen, 20.000 URL-kald, 100 mailmodtagere via MailApp, 6 minutter pr. kørsel og 30 kørsler på samme tid. Invitationen sendes af Google Kalender og tæller ikke med i MailApp-grænsen. Det rækker rigeligt.

**Testsiden på GitHub Pages kan ikke køre Netlify Functions.** Derfor får kalenderen en demo-tilstand med faste, falske tider, når `/api` ikke svarer. Så kan designet ses på testsiden, mens den rigtige booking testes på en Netlify-preview.

## Design og flow

Én boks som i dag, under knappen "Book en tid". Formularen "Send en forespørgsel" bliver, som den er.

**Desktop (tre kolonner i boksen)**

1. **Mødet:** memojiens hoved, "Afklaring, 30 minutter", Google Meet og tidszonen.
2. **Måneden:** et gitter med ugedage. Dage med ledige tider står i `ink` med en lille prik i `accent`. Valgt dag er fyldt med `ink` og har tekst i `bg`, ligesom valgte faner på siden. Andre dage står i `muted` og kan ikke vælges. Pile til næste og forrige måned.
3. **Tiderne:** en kolonne af tidsknapper for den valgte dag (pille, kant i `field-border`, valgt i `ink`). Når en tid er valgt, glider formularen ind i samme kolonne.

**Mobil (trin for trin)**

1. En vandret række af dato-chips med de næste dage med ledige tider
2. Tidsknapper i et gitter med to kolonner
3. Formularen: navn, virksomhed og e-mail, og "Hvad skal vi kigge på?" (valgfrit)
4. Bekræftelsen

**Bekræftelsen** står i boksen: den mediterende memoji, dato og klokkeslæt, Meet-linket og "Tilføj til kalender" (en .ics-fil genereret i browseren). Teksten fortæller, at invitationen også ligger i indbakken.

**Tilstande:** skelet-gitter mens tiderne hentes (henter allerede, når sektionen nærmer sig skærmen), en besked med link til Googles bookingside, hvis API'et fejler, og en tydelig besked, hvis tiden blev taget i mellemtiden.

**Regler fra designsystemet:**

- Kun tokens. Accent kun i prikkerne og fokus.
- Fokusring på 3px i `focus`.
- Felter som formularens.
- Kurverne `ease-out` og `ease-drawer`, under 300 ms, og kun transform og opacity.
- Stilstand ved `prefers-reduced-motion`.

**Tilgængelighed:**

- Måneden er et `role="grid"`, der kan styres med piletaster.
- Dagene har aria-labels som "tirsdag 27. oktober, 4 ledige tider".
- Tidsknapperne har labels som "kl. 10.00 til 10.30".
- Skiftet til et nyt trin meldes i en `aria-live`-region.
- Uden JavaScript vises linket til Googles bookingside.

## Copy (udkast efter copywriter-skillen)

- Overskrift i boksen: "Vælg et tidspunkt, der passer jer"
- Under: "30 minutter på Google Meet. Invitationen lander i jeres indbakke med det samme."
- Knap: "Book [dag] kl. [tid]"
- Bekræftelse: "Mødet står i jeres kalender. Vi ses [dag] kl. [tid]."
- Fejl, tiden er taget: "Den tid nåede en anden at tage. Her er de ledige tider lige nu."

## Sporing, privatliv og sikkerhed

- **Events i dataLayer:**
  - `booking_dato_valgt`
  - `booking_tid_valgt`
  - `booking_bekraeftet`: den rigtige konvertering, så Google Ads kan få den som primær konvertering, når der kommer tags
  - `booking_fejl`

  Opdatér docs/sporing.md.
- **Privatlivspolitikken:** Den skal sige, at navn, virksomhed og e-mail sendes til Kaspers Google Kalender og Google Sheet ved booking. Afsnittet om Googles cookies i den indlejrede kalender udgår.
- **CSP:** `frame-src https://calendar.google.com` fjernes. Bruges Turnstile, så tilføjes `challenges.cloudflare.com` til `script-src` og `frame-src`.
- **Spam:**
  - Honeypot-felt og validering i funktionen.
  - En grænse på [INDSÆT: fx 5] bookinger pr. IP i timen.
  - Bookingen afvises, hvis den samme e-mail allerede har et fremtidigt møde.
  - Cloudflare Turnstile ([Cloudflare](https://developers.cloudflare.com/use-cases/solutions/protect-sensitive-forms-fraud-abuse/)) er en mulighed, men det er en tredjepart og kræver Kaspers ja (CLAUDE.md).
- **Tidszoner:** Alt regnes i Europe/Copenhagen, så skiftet til sommer- og vintertid håndteres af `Utilities.formatDate`. Er den besøgende i en anden zone, så vises en linje som "Tiderne står i dansk tid".

## Faser

1. **Beslutninger** (Kasper, se nedenfor)
2. **Apps Script:** `ledige-tider` og `book` i henvendelser.gs. Slå den avancerede Calendar-tjeneste til, og test fra editoren med en testfunktion som `testHenvendelse()`.
3. **Netlify Functions:** `netlify/functions/ledige-tider.js` og `book.js` med miljøvariablerne `APPS_SCRIPT_URL` og `APPS_SCRIPT_TOKEN`.
4. **UI:** HTML, CSS og JS i bookingsektionen med demo-data. Vises på testsiden og testes i lyst og mørkt tema og på mobil med playwright.
5. **Kobling og test på en Netlify-preview:**
   - En rigtig booking til Kaspers egen e-mail
   - To bookinger af samme tid på samme tid (den ene skal få 409)
   - API'et slukket (fallback til Googles link)
   - Tidszone sat til New York i browseren
6. **Oprydning:**
   - Sporing og privatliv
   - CSP
   - docs/automatisering.md og CLAUDE.md
   - Det automatiske svar i scriptet linker til sidens kalender i stedet for Googles
7. **Senere:** aflys og flyt mødet via et signeret link i bekræftelsesmailen (`doGet` med token), og påmindelse dagen før fra scriptet. Googles gratis bookingside kan ikke sende påmindelser.

## Beslutninger, Kasper skal tage

Sat til standardværdier, så kalenderen kunne bygges. Ret dem, hvis de ikke passer.

- [ ] Dage og tidsrum: hverdage kl. 9 til 16, 21 dage frem
- [ ] Mødelængde: 30 minutter
- [ ] Buffer og varsel: 15 minutter og 12 timer
- [ ] Kalendere, der tæller som optaget: kun den primære
- [ ] Felter: navn, e-mail, virksomhed (valgfri) og "Hvad skal vi kigge på?" (valgfri). Ingen telefon
- [ ] Googles aftaleplan bliver som reserve (link uden JS og ved fejl)
- [ ] Ingen Turnstile. Honeypot, rate limit (5 pr. minut pr. IP) og validering i stedet
