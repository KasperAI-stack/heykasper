# Landingpage: Hey Kasper

Denne fil er din brief. Læs den helt, før du laver noget i projektet.

## Hvad projektet er

En personlig landingpage for Kasper Schrøder Asmussen, der præsenterer sig som virksomhedens nye AI marketing manager. Siden er bygget på samme kodebase som heyotto.dk. Sidens eneste mål er, at den besøgende booker en snak på 30 minutter via formularen eller kalenderen.

## Brand

- Navn: Hey Kasper. Skrives "Hey Kasper" i tekst. Kasper Schrøder Asmussen skriver siden som "jeg".
- Logo: vektorgrafikken site/assets/logo.svg ("hey" i en tynd serif og "Kasper" i en fed skrift) med gennemsigtig baggrund. Den er mørk i lyst tema og bliver vendt til lys i mørkt tema. Står ved siden af memojiens hoved (favicon) i toppen og i footeren med "v/ Kasper Schrøder Asmussen".
- Overskrift (h1): tilbuddet i én sætning (arbejdstekst: "Jeg bygger AI-agenter, der overtager jeres faste marketingopgaver"), hvor "faste marketingopgaver" står i en tynd kursiv serif (Instrument Serif) i agentens farve, ligesom "hey" i logoet er en tynd serif. "Hey Kasper, byg os lige …" bor i chatfeltet under overskriften, hvor fire lilla prikker lytter og "skriver" ligesom "Hey Siri". "Jeres nye AI marketing manager" står i titel og meta.
- Koncept: En moderne konsulentside i sort, grå og lilla, med lyst og mørkt tema. Ordene er jordnære, og alt, hvad der står, er let at forstå.
- Figur: Kaspers memoji med gennemsigtig baggrund. Kasper optræder kun som memoji, aldrig på rigtige fotos. I toppen står memojien i fem situationer, én for hver agent (site/assets/memoji/), og hovederne fra de samme billeder er valgene i bunden af chatfeltet. Ved citatet står den vinkende memoji (site/assets/kasper-vinker.webp) og memojien med armene over kors (site/assets/kasper-armene-over-kors.webp), beskåret til overkroppen, frilagt og uden flade bag sig. Hele figuren (site/assets/kasper-memoji-hel.webp) står på tak-siden og 404-siden, og hovedet med gennemsigtig baggrund er ikon i browserfanen og ved logoet i toppen (favicon.svg, favicon-*.png, apple-touch-icon.png, site/favicon.ico og brand-mark.webp). I "Hvem bygger det?" står den pegende og blinkende memoji (site/assets/kasper-peger.svg) på en rolig flade, og i bookingsektionen ("Hvilke opgaver skal I slippe for først?") sidder den mediterende memoji (site/assets/kasper-meditation.svg). Begge er SVG med gennemsigtig baggrund.

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

Ændringerne fra 19. oktober 2026 står i docs/redesign-plan.md.

1. Hero: centreret h1 med tilbuddet, underlinje og knappen "Book 30 minutter". Under dem et chatfelt (afrundet felt med lys kant og blød skygge) med "Hey Kasper, byg os lige en annonce-agent". Når man vælger en agent med hovederne i bunden af feltet, bliver agentens navn skrevet, prikkerne skriver, og memojien svarer med agentens navn og én eller to sætninger (SoMe, mail, annoncer, leads og tekster). Gitteret og gløden i agentens farve ligger bag. Toppen står fast (sticky) med booking i knappen.
2. Problemet
3. Værktøjer: de værktøjer, Kasper bygger med (isometrisk stak, svævende fliser og prikket flade, som originalen)
4. Sådan foregår det: lys lilla sektion (#F5F1FD, i mørkt tema #17132A) med centreret overskrift og fire kort (Afklaring, Prøveopgave, Opstart, Hverdag) i ét fælles flow. Kortene går fra lys til mørk: hvid, lavendel, violet og dyb violet, og har ikon, serif-overskrift, tekst, en knap med pil og en memoji på en klat. De stables med position: sticky, når man scroller, og main.js skalerer dem (det kommende vokser på plads, de dækkede krymper og bliver lidt mørkere). Ved reduceret bevægelse og uden JS stables de uden skalering. Formularens felt "samarbejde" findes stadig, men vælges ikke længere fra sektionen.
5. Hvem bygger det? (om Kasper)
6. Cases (#cases): stor centreret overskrift og tre AI-cases i et bento-gitter: HeyOtto (AI-orkestreringsplatform) i et højt kort til venstre, Programmatisk SEO (300+ produktsider) og Hjemmeside (99 i PageSpeed) i to halvt så høje kort til højre. På mobil står de under hinanden. Hvert kort har en SVG-illustration i temaets farver (stamtræ med Otto og agenterne, sitehierarki, browservindue), og tallene står som en lille linje under illustrationen
7. Citat: Kaspers eget citat i serif ("AI er ikke raketvidenskab …", Kasper Schrøder Asmussen, Hey Kasper) og memojien på hver side uden flade bag sig
8. FAQ (#faq): "Ofte stillede spørgsmål" med et glasagtigt kort (memoji, "Book 30 minutter", knap til #book) til venstre og otte spørgsmål som <details> til højre på slørede lilla farveklatter. Svarene står i HTML'en og samme tekst som FAQPage i JSON-LD, så søgemaskiner og AI kan læse dem. Ret begge steder, hvis et svar ændres. Svarene må kun bygge på docs/tilbud.md og sidens indhold.
9. Book et møde: "Book en tid" (vores egen bookingkalender, valgt fra start) eller "Send en forespørgsel" (formularen)
10. Footer: mørk violet flade (#13092B) helt ud til kanterne. Øverst én linje med "© 2026 Kasper Schrøder Asmussen", genveje (Cases, Book en snak, Privatlivspolitik, Vilkår for brug) og kontakt (kasper@heyotto.dk, +45 22 46 38 40, LinkedIn-ikon). Under den står memojiens hoved (assets/favicon-512.png) og logoet skaleret op i lavendel, så de fylder hele bredden. Logoet er logo.svg brugt som CSS-maske. Samme footer på alle sider. CVR tilføjes, når Kasper har et.

Undersider: site/privatliv.html (/privatliv), site/vilkaar.html (/vilkaar), site/tak.html og site/404.html. De har samme top og footer som forsiden. Privatlivspolitikken skal passe med det, siden faktisk gør (formularens felter, Netlify, Google Sheets og Gmail, bookingkalenderen og Google Kalender, temavalg i localStorage), så den skal opdateres, hvis der kommer nye felter, værktøjer eller sporing til. Under formularen står en kort linje med link til privatlivspolitikken.

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

- Skrift: Geist til både overskrifter og brødtekst. Skriften ligger selv på siden (site/fonts/geist-latin.woff2, SIL Open Font License), så der ikke hentes noget fra Google Fonts. Store overskrifter med stram afstand mellem bogstaverne. Instrument Serif (site/fonts/instrument-serif-*.woff2, SIL Open Font License) bruges kun til fremhævningen i h1 (kursiv) og citatet i udtalelsen.
- Grid: Siden står i en ramme af tynde lodrette linjer, og sektionerne er adskilt af vandrette linjer med små plus-mærker, hvor linjerne mødes. De fire trin står i kolonner adskilt af gridlinjer, hver med et lille lysende ikon og en titel, hvor trinnets navn er fedt og prisen dæmpet.
- Toppen har et neutralt gitter af tynde, grå linjer og en blød glød i agentens farve bag chatfeltet. Agenterne vælges i bunden af chatfeltet, hvor den valgte ligger på en hvid, hævet pude. Agentens navn og fremhævningen i h1 står i agentens egen lilla tone.
- Sort, grå og hvid bærer siden. Knapper, valgte faner og vælgere er i tekstfarven (sort i lyst tema, lys i mørkt tema) og helt runde i enderne. Lilla er en accent, der kun bruges i agentens navn og prikkerne i toppen, i kortene i "Sådan foregår det", i figuren i værktøjssektionen, i søjlen i case-kortet om Google Ads og i fladerne bag memojien i udtalelsen.
- Temakontakten i toppen viser sol og måne side om side, og det aktive tema er markeret.
- Værktøjssektionen er en prikket flade med en stablet flise i midten (site/assets/stack.svg) og værktøjernes logoer i lyse app-ikoner rundt om. Logoerne ligger i site/assets/tools og kommer fra Iconify Logos og Simple Icons (CC0).
- Illustrationer er rene vektorgrafikker (SVG). Memojien er den eneste figur. Ingen pixel-art og ingen detaljerede AI-genererede billeder.
- Mobil først. Kontrast mindst WCAG AA, og feltkanter mindst 3:1 (--field-border). Synligt fokus på alle knapper og felter.
- Animation følger skillen i .claude/skills/animate (Emil Kowalskis principper). Kurverne er tokens i :root (--ease-out, --ease-in-out, --ease-drawer), og der må ikke laves andre. Kun transform og opacity animeres, UI-animationer holdes under 300 ms, hover-bevægelse står i @media (hover: hover) and (pointer: fine), og ting, man kan klikke hurtigt på, bruger transitions i stedet for keyframes.
- Toppen må have liv: når man vælger en agent, bliver navnet skrevet i chatfeltet med en blinkende markør, prikkerne "skriver" (scaleY, ikke height), memojien svæver og popper ind, og navn og beskrivelse glider ind. Resten af siden er rolig: overskrifter og grupper glider stille ind én gang ved scroll (data-reveal, sat af main.js), og knapper giver et lille tryk (scale 0.97).
- Ved prefers-reduced-motion forsvinder bevægelse, men fades og farveskift bliver, så skift stadig kan ses.

## Teknik

- Ren HTML, CSS og JavaScript. Intet framework og intet build-step.
- Alt, der skal online, ligger i mappen site/, som Netlify publicerer (se netlify.toml). Netlify Functions ligger i netlify/functions/ og bruger miljøvariablerne APPS_SCRIPT_URL og APPS_SCRIPT_TOKEN.
- Formularen bruger Netlify Forms (data-netlify="true") med et honeypot-felt mod spam. Efter afsendelse sendes brugeren til /tak.html.
- Kontaktsektionen har en knap, der skifter mellem "Book en tid" (valgt fra start) og "Send en forespørgsel" (formularen). "Book en tid" er vores egen bookingkalender (site/js/booking.js): mødet, en måned med ledige dage og tiderne side om side, derefter en formular og en bekræftelse. Den henter tider fra /api/ledige-tider og booker via /api/book (netlify/functions/), som taler med Apps Scriptet, der opretter mødet med Google Meet i Kaspers kalender. Reglerne for bookingtider står i scriptets INDSTILLINGER.BOOKING. Svarer /api ikke (testsiden på GitHub Pages og lokalt), kører kalenderen med eksempeltider og en tydelig demo-linje. Uden JavaScript eller ved fejl vises et link til Googles bookingside. Planen og beslutningerne står i docs/plan-booking.md, opsætningen i docs/automatisering.md (del 4).
- Automatisering: Netlify sender hver formular videre til et Google Apps Script (automatisering/henvendelser.gs), som gemmer den i et Google Sheet, mailer Kasper, sender et automatisk svar og sender en daglig påmindelse om ubesvarede henvendelser. Opsætningen står i docs/automatisering.md. Mappen automatisering/ kommer ikke online.
- Ingen tracking eller cookies uden samtykke. Hvis der skal måles trafik, brug en cookiefri løsning og spørg Kasper først.
- Google Tag Manager (GTM-K7W77X5Z) står på alle sider med Consent Mode-standard "denied" før sig. Nye sider skal have samme kode i <head> og noscript efter <body>. Status, events og næste skridt står i docs/sporing.md.
- Billeder komprimeres og får altid en alt-tekst. Billeder under folden får loading="lazy".
- Filer i /assets/ caches i et år (se netlify.toml). Når logo, favicon eller brand-mark skiftes ud under samme filnavn, skal ?v= i linkene i alle .html-filer tælles én op, ellers ser besøgende den gamle version.
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
