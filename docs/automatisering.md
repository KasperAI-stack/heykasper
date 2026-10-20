# Henvendelser og booking: sådan sættes det op

Alt her er gratis. Det kræver kun din Google-konto (Gmail) og Netlify.

Når det er sat op, sker dette:

- **Book en tid:** Kunden vælger et tidspunkt i bookingkalenderen på siden. Siden henter ledige tider fra din Google Kalender og opretter mødet med Google Meet gennem to Netlify Functions og det samme script (se del 4). Google sender invitationen til kunden, mødet står i begge kalendere, og bookingen kommer i arket med status "Møde booket".
- **Send en forespørgsel:** Netlify modtager formularen og sender den videre til et lille script i din Google-konto. Scriptet
  1. gemmer henvendelsen i et Google Sheet med status "Ny",
  2. sender dig en mail, som du kan svare direkte på,
  3. sender kunden et automatisk svar med et link til at booke en tid,
  4. minder dig hver morgen kl. 8 om henvendelser, der har stået som "Ny" i mere end et døgn.

Du skal igennem tre dele. Tag dem i rækkefølge.

---

## Del 1: Bookingside i Google Kalender (ca. 10 minutter)

1. Åbn **calendar.google.com** på en computer.
2. Klik **Opret** øverst til venstre, og vælg **Aftaleplan** (på engelsk: Appointment schedule).
3. Giv den titlen "Afklaringsmøde, 30 minutter", og vælg varighed **30 minutter**.
4. Vælg de dage og tidsrum, hvor man må booke dig.
5. Under **Booket aftale** kan du tilføje **Google Meet**, så mødet automatisk får et videolink.
6. Klik **Gem**.
7. Klik på aftaleplanen i kalenderen, og vælg **Del** (eller "Åbn bookingside"). Kopiér linket. Det ligner `https://calendar.app.google/...`.
8. Dit bookinglink er allerede sat ind på hjemmesiden og i scriptet:
   `https://calendar.app.google/h7uCdYSGWCpxRuK57`
   Laver du en ny bookingside senere, skal linket skiftes i `site/index.html` og i `automatisering/henvendelser.gs`.

---

## Del 2: Scriptet i Google (ca. 15 minutter)

1. Gå til **script.google.com**, og klik **Nyt projekt**.
2. Giv projektet navnet "Landingpage henvendelser" (klik på "Unavngivet projekt" øverst).
3. Slet alt i editoren, og indsæt hele indholdet af filen `automatisering/henvendelser.gs`.
4. Øverst i koden, under `INDSTILLINGER`:
   - Skift `HEMMELIG_NOEGLE` til en lang, tilfældig tekst, fx 30 tilfældige bogstaver og tal. Skriv den ned, du skal bruge den i del 3.
   - `BOOKING_LINK` er allerede udfyldt med dit bookinglink.
5. Klik på diskette-ikonet for at gemme.
6. Vælg funktionen **opsaet** i menuen øverst, og klik **Kør**.
7. Google spørger om tilladelser. Vælg din konto. Hvis der står "Google har ikke bekræftet denne app", så klik **Avanceret** og derefter **Gå til Landingpage henvendelser**. Det er dit eget script, så det er trygt. Klik **Tillad**.
8. Nu findes der et nyt Google Sheet i din Drive, der hedder "Henvendelser fra landingpagen".
9. Klik **Implementer** øverst til højre, og vælg **Ny implementering**.
   - Klik tandhjulet, og vælg **Webapp**.
   - **Udfør som:** Mig
   - **Hvem har adgang:** Alle
   - Klik **Implementer**, og kopiér **Webapp-URL'en**. Den ender på `/exec`.

Hvis du senere ændrer i koden, skal du vælge **Implementer**, derefter **Administrer implementeringer**, klikke på blyanten og vælge **Ny version**. Så beholder URL'en sin adresse.

---

## Del 3: Forbind Netlify med scriptet (ca. 5 minutter)

Det kræver, at siden allerede er deployet på Netlify.

1. Åbn dit projekt på **app.netlify.com**.
2. Gå til **Forms**, og sørg for, at formularregistrering er slået til. Formularen "kontakt" dukker op efter første deploy.
3. Gå til **Project configuration**, derefter **Notifications** og **Form submission notifications**.
4. Klik **Add notification**, og vælg **HTTP POST request** (outgoing webhook).
   - **Event to listen for:** New form submission
   - **URL to notify:** din webapp-URL fra del 2 med nøglen sat bagpå, sådan her:
     `https://script.google.com/macros/s/.../exec?token=DIN-HEMMELIGE-NOEGLE`
   - **Form:** kontakt
   - Klik **Save**.
5. Du kan også tilføje en **Email notification** direkte fra Netlify som ekstra sikkerhed. Det er ikke nødvendigt, fordi scriptet allerede sender dig en mail.

---

---

## Del 4: Bookingkalenderen på siden (ca. 10 minutter)

Bookingkalenderen bruger scriptet fra del 2 gennem to Netlify Functions (`netlify/functions/ledige-tider.mjs` og `book.mjs`). Reglerne for, hvornår man kan booke, står under `BOOKING` i `INDSTILLINGER` øverst i scriptet: hverdage kl. 9 til 16, møder på 30 minutter, 15 minutters buffer til andre aftaler, mindst 12 timers varsel og 21 dage frem. Ret dem dér.

1. Åbn scriptet på **script.google.com**, og indsæt den nyeste version af `automatisering/henvendelser.gs`.
2. Klik **+** ud for **Tjenester** i menuen til venstre, vælg **Google Calendar API**, og klik **Tilføj**. Den skal hedde `Calendar`.
3. Vælg funktionen **testBooking**, og klik **Kør**. Google spørger om lov til kalenderen, så klik **Tillad** som i del 2. Under **Udførelseslog** står, hvor mange ledige tider der er, og at der er booket et testmøde i din kalender med dig selv som gæst. Slet testmødet bagefter.
4. Lav en ny version af implementeringen: **Implementer**, **Administrer implementeringer**, blyanten, **Ny version**, **Implementer**. URL'en er den samme som før.
5. I Netlify: **Project configuration**, **Environment variables**, **Add a variable**. Tilføj to variabler med scope **Functions**:
   - `APPS_SCRIPT_URL`: webapp-URL'en, der ender på `/exec` (uden `?token=`)
   - `APPS_SCRIPT_TOKEN`: din `HEMMELIG_NOEGLE`
6. Deploy siden igen, så funktionerne får variablerne.
7. Åbn `https://hey-kasper.dk/api/ledige-tider` i browseren. Der skal stå `"status":"ok"` og en liste af tider.

Funktionen `/api/book` tillader 5 bookinger i minuttet pr. IP-adresse, og et skjult felt fanger robotter.

---

## Test det

1. Åbn den rigtige side (din `.netlify.app`-adresse), og send formularen med din egen e-mail.
2. Inden for et minut bør du have:
   - en mail med emnet "Ny henvendelse: ..."
   - en mail med emnet "Tak for jeres henvendelse"
   - en ny række i Google Sheet'et med status "Ny"
3. Klik **Book en tid** på siden, book et møde med din egen e-mail, og tjek, at mødet står i kalenderen med et Meet-link, at invitationen kom, og at der er en ny række med "Møde booket" i arket.

Virker det ikke, så åbn scriptet og kig under **Udførelser** i menuen til venstre. Der står, om Netlify har ramt scriptet, og hvad der eventuelt gik galt.

## Fejlfinding: jeg får ingen mails

Tag trinene i rækkefølge, og stop, når du finder fejlen.

1. **Virker scriptet i sig selv?** Åbn scriptet, vælg funktionen **testHenvendelse** i menuen øverst, og klik **Kør**. Du bør få to mails og en ny række i arket. Kommer der ingen mails, så tjek spam-mappen i Gmail.
2. **Er notifikationen lavet det rigtige sted?** I Netlify skal den ligge under **Form submission notifications**, ikke under **Deploy notifications**. Eventet skal være **New form submission**, og formularen skal være **kontakt**.
3. **Rammer Netlify scriptet?** Åbn scriptet, og klik **Udførelser** i menuen til venstre. Står der ingen kørsler af **doPost**, når du sender formularen, så når Netlify slet ikke frem. Tjek URL'en i Netlify, og tjek, at webappen har **Hvem har adgang: Alle**.
4. **Bliver henvendelsen afvist?** Står der "Afvist: nøglen i URL'en passer ikke" under Udførelser, så er teksten efter `?token=` i Netlify ikke den samme som `HEMMELIG_NOEGLE` i koden.
5. **Har du ændret i koden efter implementeringen?** Webappen kører den version, du implementerede. Vælg **Implementer**, derefter **Administrer implementeringer**, klik på blyanten, vælg **Ny version** og klik **Implementer**.

## I hverdagen

- Svar på henvendelser direkte fra mailen "Ny henvendelse". Svaret går til kunden.
- Ret status i arket til "Besvaret", "Møde booket" eller "Ikke relevant", så du ikke får påmindelser om dem.

## Grænser i de gratis versioner

- Netlify Forms: 100 henvendelser om måneden.
- Google Apps Script med en almindelig Gmail: op til 100 mails om dagen.
- Google Apps Script med en almindelig Gmail kan oprette 5.000 kalenderbegivenheder om dagen. Invitationerne sendes af Google Kalender og tæller ikke med i de 100 mails.
- Bookingkalenderen sender endnu ingen påmindelse inden mødet ud over Google Kalenders egen påmindelse i gæstens kalender (se docs/plan-booking.md, fase 7).
