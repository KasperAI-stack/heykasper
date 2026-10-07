# Landingpage: Hey Kasper

Denne fil er din brief. Læs den helt, før du laver noget i projektet.

## Hvad projektet er

En personlig landingpage for Kasper Schrøder Asmussen, der præsenterer sig som virksomhedens nye AI marketing manager. Siden er bygget på samme kodebase som heyotto.dk. Sidens eneste mål er, at den besøgende booker en snak på 30 minutter via formularen eller kalenderen.

## Brand

- Navn: Hey Kasper. Skrives "Hey Kasper" i tekst. Kasper Schrøder Asmussen skriver siden som "jeg".
- Logo: vektorgrafikken site/assets/logo.svg ("hey" i en tynd serif og "Kasper" i en fed skrift) med gennemsigtig baggrund. Den er mørk i lyst tema og bliver vendt til lys i mørkt tema. Står ved siden af memojiens hoved (favicon) i toppen og i footeren med "v/ Kasper Schrøder Asmussen".
- Overskrift (h1): en lille linje med "Jeres nye AI marketing manager" og under den "Hey Kasper, byg os lige …", hvor fire lilla prikker lytter og taler ligesom "Hey Siri". Den lille linje står inde i h1, så Google kan se, hvad siden handler om.
- Koncept: En moderne konsulentside i sort, grå og lilla, med lyst og mørkt tema. Ordene er jordnære, og alt, hvad der står, er let at forstå.
- Figur: Kaspers memoji med gennemsigtig baggrund. Kasper optræder kun som memoji, aldrig på rigtige fotos. I toppen står memojien i fem situationer, én for hver agent (site/assets/memoji/), og hovederne fra de samme billeder er knapperne i baren. Hele figuren (site/assets/kasper-memoji-hel.webp) står på tak-siden og 404-siden, og hovedet med gennemsigtig baggrund er ikon i browserfanen og ved logoet i toppen (favicon.svg, favicon-*.png, apple-touch-icon.png og brand-mark.webp). I "Hvem bygger det?" står den pegende og blinkende memoji (site/assets/kasper-peger.svg) på en rolig flade, og i bookingsektionen ("Hvilke opgaver skal I slippe for først?") sidder den mediterende memoji (site/assets/kasper-meditation.svg). Begge er SVG med gennemsigtig baggrund.

## Sprog og tone

Disse regler gælder al tekst på siden, også knapper, fejlbeskeder og alt-tekster.

- Dansk. Skriv til virksomheden som "I" og "jer". Kasper skriver som "jeg".
- Fortællende tone i hele sætninger. Ingen hakkende korte fragmenter efter hinanden.
- Ingen tankestreger. Brug komma eller punktum i stedet.
- Intet rumsprog i teksten, fx take off, hyperspace, galakse, cockpit, commander, deploy eller mission. Rummet må kun være i det visuelle.
- Ingen AI-klingende vendinger, fx "i en verden hvor", "lås op for", "revolutionér", "sømløs", "game changer", "dyk ned i", "tag din virksomhed til næste niveau".
- Ingen opdigtede tal, statistikker, kundecitater eller logoer. Brug pladsholdere i firkantede parenteser, fx [CASE], indtil Kasper leverer de rigtige.
- Siden skrives bredt til mindre og mellemstore virksomheder uden egne AI-folk. Den må ikke skrives til én bestemt branche.

## Tilbuddet

Se docs/tilbud.md. Trin og produkter skal stå præcis som der. Siden viser ingen priser.

## Sidens opbygning

1. Hero: "Hey Kasper, byg os lige …", memojien og en buet bar med fem agenter (SoMe, mail, annoncer, leads og tekster). Hver agent har et navn og én eller to sætninger. Booking ligger i knappen i toppen.
2. Problemet
3. Sådan foregår det: de fire trin med priser
4. Hvem bygger det? (om Kasper)
5. CV: stillinger, resultater og uddannelse fra Kaspers LinkedIn
6. Værktøjer: de værktøjer, Kasper bygger med
7. Workshops og oplæring
8. Book et møde: formularen eller booking
9. Footer: e-mail (kasper@heyotto.dk), telefon (+45 22 46 38 40) og LinkedIn. CVR tilføjes, når Kasper har et.

Teksten til hver sektion ligger i docs/copy.md.

## Design

Farver (defineret som CSS-variabler i site/css/styles.css). Siden har et lyst og et mørkt tema. Den følger den besøgendes egen indstilling, og en knap i toppen skifter mellem dem. Valget huskes i browseren (localStorage, ingen cookies).

Neutrale:

- Onyx #0F0E13: tekst i lyst tema, baggrund i mørkt tema
- Grafit #1E1C24: flader i mørkt tema
- Skifer #3B3845: linjer i mørkt tema
- Sølvgrå #A7A3B2: dæmpet tekst i mørkt tema
- Tåge #F4F2F8: flader i lyst tema, tekst i mørkt tema
- Lyst tema har hvid baggrund og dæmpet tekst i #5E5A6B

Lilla accenter:

- Dyb violet #4C1D95
- Violet #7C3AED
- Orkidé #C026D3
- Rosé #F472B6 (kun i mørkt tema, den er for lys på hvid baggrund)

Regler:

- Skrift: Geist til både overskrifter og brødtekst. Skriften ligger selv på siden (site/fonts/geist-latin.woff2, SIL Open Font License), så der ikke hentes noget fra Google Fonts. Store overskrifter med stram afstand mellem bogstaverne.
- Grid: Siden står i en ramme af tynde lodrette linjer, og sektionerne er adskilt af vandrette linjer med små plus-mærker, hvor linjerne mødes. De fire trin står i kolonner adskilt af gridlinjer, hver med et lille lysende ikon og en titel, hvor trinnets navn er fedt og prisen dæmpet.
- Toppen har et neutralt gitter af tynde, grå linjer bag memojien og ingen farvet baggrund. Agenterne vælges i en buet bar, hvor den valgte ligger i en hvid, hævet pude (den eneste vælger, der ikke er i tekstfarven). Agentens navn står stort i sin egen lilla tone.
- Sort, grå og hvid bærer siden. Knapper, valgte faner og vælgere er i tekstfarven (sort i lyst tema, lys i mørkt tema) og helt runde i enderne. Lilla er en accent, der kun bruges i agentens navn og prikkerne i toppen, i ikonerne ved de fire trin, i prikkerne i CV-sektionen og i figuren i værktøjssektionen.
- Temakontakten i toppen viser sol og måne side om side, og det aktive tema er markeret.
- Værktøjssektionen er en prikket flade med en stablet flise i midten (site/assets/stack.svg) og værktøjernes logoer i lyse app-ikoner rundt om. Logoerne ligger i site/assets/tools og kommer fra Iconify Logos og Simple Icons (CC0).
- Illustrationer er rene vektorgrafikker (SVG). Memojien er den eneste figur. Ingen pixel-art og ingen detaljerede AI-genererede billeder.
- Mobil først. Kontrast mindst WCAG AA. Synligt fokus på alle knapper og felter.
- Animation hører til i toppen: memojien svæver, agentens navn og beskrivelse glider ind, prikkerne lytter og taler, og puden i baren glider. Resten af siden holdes rolig. Al animation slås fra ved prefers-reduced-motion.

## Teknik

- Ren HTML, CSS og JavaScript. Intet framework og intet build-step.
- Alt, der skal online, ligger i mappen site/, som Netlify publicerer (se netlify.toml).
- Formularen bruger Netlify Forms (data-netlify="true") med et honeypot-felt mod spam. Efter afsendelse sendes brugeren til /tak.html.
- Kontaktsektionen har en knap, der skifter mellem "Send en forespørgsel" (formularen) og "Book en tid" (link til Kaspers gratis bookingside i Google Kalender). Bookingsiden linkes og indlejres ikke, så Google ikke sætter cookies på siden.
- Automatisering: Netlify sender hver formular videre til et Google Apps Script (automatisering/henvendelser.gs), som gemmer den i et Google Sheet, mailer Kasper, sender et automatisk svar og sender en daglig påmindelse om ubesvarede henvendelser. Opsætningen står i docs/automatisering.md. Mappen automatisering/ kommer ikke online.
- Ingen tracking eller cookies uden samtykke. Hvis der skal måles trafik, brug en cookiefri løsning og spørg Kasper først.
- Billeder komprimeres og får altid en alt-tekst. Billeder under folden får loading="lazy".
- Delingsbillede: site/assets/og-image.jpg (1200x630). Strukturerede data (JSON-LD) står i <head> på forsiden og må kun indeholde oplysninger, der også står på siden.
- Domænet er https://hey-kasper.dk/ (med bindestreg). heykasper.dk uden bindestreg er et andet site, så canonical, og:url, robots.txt og sitemap skal altid pege på hey-kasper.dk.

## Arbejdsgang

- Kør siden lokalt med `npx serve site` eller `netlify dev`.
- Tjek al ny eller ændret tekst mod reglerne ovenfor. Kommandoen /copy-review gør det.
- Lav små commits med korte danske beskeder.
- Deploy sker automatisk, når der pushes til main på GitHub.

## Det må du ikke uden at spørge Kasper

- Ændre navn, overskrift eller tilbud, eller sætte priser på siden.
- Tilføje nye sektioner, sider eller funktioner.
- Tilføje tredjeparts-scripts, tracking eller cookies.
- Opfinde cases, kunder, resultater eller citater.
