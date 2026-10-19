# Landingpage: Hey Kasper

Denne fil er din brief. Læs den helt, før du laver noget i projektet.

## Hvad projektet er

En personlig landingpage for Kasper Schrøder Asmussen, der præsenterer sig som virksomhedens nye AI marketing manager. Siden er bygget på samme kodebase som heyotto.dk. Sidens eneste mål er, at den besøgende booker en snak på 30 minutter via formularen eller kalenderen.

## Brand

- Navn: Hey Kasper. Skrives "Hey Kasper" i tekst. Kasper Schrøder Asmussen skriver siden som "jeg".
- Logo: vektorgrafikken site/assets/logo.svg ("hey" i en tynd serif og "Kasper" i en fed skrift) med gennemsigtig baggrund. Den er mørk i lyst tema og bliver vendt til lys i mørkt tema. Står ved siden af memojiens hoved (favicon) i toppen og i footeren med "v/ Kasper Schrøder Asmussen".
- Overskrift (h1): tilbuddet i én sætning (arbejdstekst: "Jeg bygger AI-agenter, der overtager jeres faste marketingopgaver"). "Hey Kasper, byg os lige …" er sidens motiv: en taleboble i agentkortet i hero, hvor fire violette prikker lytter og taler ligesom "Hey Siri". "Jeres nye AI marketing manager" står i titel og meta.
- Koncept: En moderne konsulentside i sort, grå og lilla, med lyst og mørkt tema. Ordene er jordnære, og alt, hvad der står, er let at forstå.
- Figur: Kaspers memoji med gennemsigtig baggrund. Kasper optræder kun som memoji, aldrig på rigtige fotos. I agentkortet i hero står memojien i fem situationer, én for hver agent (site/assets/memoji/), og hovederne fra de samme billeder er knapperne i rækken under. Hele figuren (site/assets/kasper-memoji-hel.webp) står på tak-siden og 404-siden, og hovedet med gennemsigtig baggrund er ikon i browserfanen og ved logoet i toppen (favicon.svg, favicon-*.png, apple-touch-icon.png, site/favicon.ico og brand-mark.webp). I "Hvem bygger det?" står den pegende og blinkende memoji (site/assets/kasper-peger.svg) på den grå flade, og i bookingsektionen ("Hvilke opgaver skal I slippe for først?") sidder den mediterende memoji (site/assets/kasper-meditation.svg). Begge er SVG med gennemsigtig baggrund.

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

Redesignet fra 19. oktober 2026 er beskrevet i docs/redesign-plan.md (farver, skala, komponenter og hvad der er fjernet).

0. Top (sticky): logo og knappen "Book 30 minutter" (→ #book). Ingen temaknap.
1. Hero: h1 med tilbuddet, en underlinje og to knapper ("Book 30 minutter" → #book og "Se hvordan det foregår" → #samarbejde). Til højre (på mobil under) agentkortet: taleboblen "Hey Kasper, byg os lige …", memojiens svar med agentens navn og én eller to sætninger, og en række med fem memoji-hoveder (SoMe, mail, annoncer, leads og tekster). Uden JavaScript vises Annonce-agenten, og rækken er skjult.
2. Problemet (grå flade)
3. Sådan foregår det (#samarbejde): fire trin med tal (Afklaring, Prøveopgave, Opstart, Hverdag). Derunder "Tre måder at arbejde sammen på": Projekt, Konsulent og Fastansat side om side, hver med opstart, hverdag, "Passer til jer, der …" og en knap, der hopper til #book og vælger samarbejdsformen i formularens felt "samarbejde". Til sidst én stille linje om, at værktøjerne oprettes på kundens egne konti, med små logoer.
4. Hvem bygger det? (grå flade): den pegende memoji, to afsnit og én linje med uddannelsen.
5. Cases (#cases, sort flade): ét kort pr. job (VoiceArchive, Poetype, Africa Tours, Cand) med de rigtige tal fra CV'et som store tal og pladsholdere for kontekst, udfordring og udtalelse.
6. Book et møde (#book): overskrift og den mediterende memoji. Google-kalenderen indlejret til venstre (på mobil øverst), formularen til højre.
7. Footer: e-mail (kasper@heyotto.dk), telefon (+45 22 46 38 40), LinkedIn og links til Privatlivspolitik og Vilkår for brug. CVR tilføjes, når Kasper har et.

Undersider: site/privatliv.html (/privatliv), site/vilkaar.html (/vilkaar), site/tak.html og site/404.html. De har samme top og footer som forsiden. Privatlivspolitikken skal passe med det, siden faktisk gør (formularens felter, Netlify, Google Sheets og Gmail, den indlejrede Google-kalender og GTM med samtykke som standard "nej"), så den skal opdateres, hvis der kommer nye felter, værktøjer eller sporing til. Under formularen står en kort linje med link til privatlivspolitikken.

Teksten til hver sektion ligger i docs/copy.md.

## Design

Retningen: samtalen er formen (talebobler), memojien er den eneste illustration, beviser frem for teknik, én accent, og rytmen kommer fra flader, der skifter (hvid, grå, sort). Alle farver er CSS-variabler i site/css/styles.css. Siden følger enhedens lyse eller mørke tema. Der er ingen temaknap, og intet gemmes i browseren.

Lyst tema: baggrund #FFFFFF, flader #F4F4F4, tekst #000000, metadata #5C5C5C, pynt-linjer #E2E2E2, feltkanter #8A8A8A, violet #7C3AED (hover #6D28D9), lys violet flade #F1EBFE. Case-sektionen er sort med hvid tekst, metadata #BDBDBD og tal i #C4B5FD.

Mørkt tema: baggrund #000000, flader #151515, tekst #F2F2F2, metadata #C4C4C4, linjer #2A2A2A, feltkanter #7A7A7A, violet #A78BFA med sort tekst på knapper, lys violet flade #1E1830. Case-sektionen står på #151515.

Regler:

- Skrift: Schibsted Grotesk (variabel, 400 til 900) til både overskrifter og brødtekst. Skriften ligger selv på siden (site/fonts/schibsted-grotesk-latin.woff2, SIL Open Font License), så der ikke hentes noget fra Google Fonts. Skalaen er 14, 17, 21, 26, 33, 41, 52 og 64 px (--fs-14 til --fs-64). Overskrifter i vægt 800, ingen versaler i labels og ingen fremhævede enkeltord i overskrifter.
- Brødtekst står i tekstfarven. Den dæmpede grå bruges kun til metadata (perioder, roller, noter).
- Ren sort og hvid med neutrale grå. Violet er den eneste farve og betyder "Kasper taler" eller "det kan I trykke på": primære knapper, links i fokus, taleboblen og den valgte agent. Ingen gradienter og ingen glød.
- Knapper er handlinger: primær er violet med radius 12 px, sekundær er en kant i feltkantfarven. Kun knapper er udfyldte. Agentrækken er en toggle: den valgte agent får lys violet flade og violet kant.
- Talebobler har radius 20 px og ét skarpt hjørne mod den, der taler. Kort (samarbejdsformer og cases) har radius 16 px og en tynd kant, ingen skygger.
- Ingen gitter, skinner med plus-mærker, prikkede flader, isometriske figurer eller stregikoner. Sektioner adskilles af flader, ikke af linjer.
- Pladsholdere i firkantede parenteser har klassen ph (stiplet understregning).
- Illustrationer er rene vektorgrafikker (SVG) eller memojien. Memojien er den eneste figur. Ingen pixel-art og ingen detaljerede AI-genererede billeder. Værktøjslogoerne i site/assets/tools kommer fra Iconify Logos og Simple Icons (CC0).
- Mobil først. Kontrast mindst WCAG AA (feltkanter mindst 3:1). Synligt fokus (3 px violet ring) på alle knapper, links og felter.
- Animation følger skillen i .claude/skills/animate (Emil Kowalskis principper). Kurverne er tokens i :root (--ease-out, --ease-in-out, --ease-drawer), og der må ikke laves andre. Kun transform og opacity animeres, UI-animationer holdes under 300 ms, hover-bevægelse står i @media (hover: hover) and (pointer: fine), og ting, man kan klikke hurtigt på, bruger transitions i stedet for keyframes.
- Bevægelse sker kun som svar på det, den besøgende gør: når man vælger en agent, kommer memojien frem, navnet glider ind bogstav for bogstav, og prikkerne taler (scaleY, ikke height). Prikkerne lytter stille, mens man venter. Ingen scroll-reveals, ingen blur og ingen svævende figurer. Knapper giver et lille tryk (scale 0.97).
- Ved prefers-reduced-motion står prikkerne stille, og skiftet mellem agenter bliver en stille fade.

## Teknik

- Ren HTML, CSS og JavaScript. Intet framework og intet build-step.
- Alt, der skal online, ligger i mappen site/, som Netlify publicerer (se netlify.toml).
- Formularen bruger Netlify Forms (data-netlify="true") med et honeypot-felt mod spam. Efter afsendelse sendes brugeren til /tak.html.
- Bookingsektionen viser Kaspers gratis bookingside fra Google Kalender i en iframe (loading="lazy") ved siden af formularen, med et link til samme side under rammen. https://calendar.google.com står i frame-src i CSP'en i netlify.toml. Google kan sætte egne cookies i rammen, og det er nævnt i privatlivspolitikken. Klik inde i rammen kan ikke måles (se docs/sporing.md).
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
