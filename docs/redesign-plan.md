# Redesign af hey-kasper.dk

Plan fra 19. oktober 2026. Bygget i heykasper-test, før noget kommer på hey-kasper.dk. Planen står i den rækkefølge, den er bygget.

Grundlaget er tre analyser af den nuværende side: struktur og SEO, visuelt design og "AI slop". Konklusionen var, at håndværket er godt, men at siden er bygget af standarddele (gitter, skinner med plus-mærker, Geist, sorte piller, lilla glød og fade-up på alt), og at tilbuddet står med lille, grå skrift. Memojien og "Hey Kasper"-stemmen er det eneste, der er Kaspers eget. Redesignet fjerner dekorationen og lader de to bære siden.

## 1. Designretning

1. Samtalen er formen. Talebobler er sidens eneste gennemgående motiv: den besøgende siger "Hey Kasper, byg os lige …", og Kasper svarer med en agent.
2. Memojien er den eneste illustration. Ingen stregikoner, ingen isometri og ingen pynt-logoer.
3. Vis marketing, ikke teknik. Beviserne (tallene fra Kaspers job) er sidens stærkeste visuelle element.
4. Én accent. Sort, hvid og grå bærer siden, og violet betyder kun "Kasper taler" eller "det kan I trykke på". Ingen gradient og ingen glød.
5. Rytmen kommer fra indholdet. Flader skifter (hvid, grå, sort) i stedet for hårlinjer, og bevægelse sker kun som svar på det, den besøgende gør.

## 2. Ny sektionsrækkefølge

| # | Sektion | Formål | Indhold | CTA |
|---|---|---|---|---|
| 0 | Top (sticky) | Booking er altid ét klik væk | Logo og knap | "Book 30 minutter" → #book |
| 1 | Hero | Sige på 5 sekunder, hvad Kasper gør, for hvem, og hvad næste skridt er | H1 = tilbuddet, underlinje, to knapper. Til højre et agentkort: taleboblen "Hey Kasper, byg os lige …" med de fire prikker, memojiens svar (agentens navn og tekst) og en række med fem memoji-hoveder | Primær "Book 30 minutter" → #book. Sekundær "Se hvordan det foregår" → #samarbejde |
| 2 | Problemet | Genkendelse | Uændret tekst fra copy.md | Ingen |
| 3 | Sådan foregår det (#samarbejde) | Vise, at første skridt er risikofrit, og hvordan samarbejdet kan se ud | Fire nummererede trin (1 til 4) uden ikoner. Derunder en fast sammenligning i tre kolonner: Projekt, Konsulent, Fastansat, hver med opstart, hverdag og "Passer til jer, der …". Til sidst én stille linje om værktøjerne med små logoer | Én knap pr. kolonne → #book. Knappen vælger samarbejdsformen i formularen |
| 4 | Hvem bygger det? | Afsender og troværdighed | Den pegende memoji, de to afsnit fra copy.md og én linje med uddannelsen | Ingen |
| 5 | Cases (#cases) | Bevis. Sidens mørke flade bryder rytmen | Ét kort pr. job: VoiceArchive og Poetype først (de har tal), derefter Africa Tours og Cand. Store tal fra CV'et og pladsholdere for resten | Link til LinkedIn |
| 6 | Book et møde (#book) | Sidens mål: en booket snak | Overskrift og den mediterende memoji. Google-kalenderen indlejret til venstre, formularen til højre. På mobil står kalenderen øverst | Booking i kalenderen eller "Send forespørgsel" |
| 7 | Footer | Kontakt og jura | Uændret | |

Fjernet: Værktøjer som egen sektion (nu én linje i trin 3), CV (nu Cases), Workshops og oplæring, temaknappen.

Arbejdstekster, som Kasper kan ændre. Copywriteren har foreslået dem, og de er ikke godkendt endnu:

- H1: "Jeg bygger AI-agenter, der overtager jeres faste marketingopgaver"
- Underlinje: "Til marketingteams uden en udvikler i huset. Vi starter med én opgave og en gratis prøveopgave på jeres egne data, så I ser den virke, før I beslutter noget."
- Intro til "Sådan foregår det": "De to første trin er de samme, uanset hvordan vi arbejder sammen, så I altid kan se en løsning virke på jeres egne data, før I beslutter noget."
- Trin 3 og 4 er skrevet ud fra docs/tilbud.md, fordi de ikke længere skifter med samarbejdsformen.
- Overskrift på case-sektionen: "Det har mit arbejde ført til"
- Booking: "Vælg et tidspunkt i kalenderen" og "Eller skriv til mig"

## 3. Farvesystem

Valg af mørk tone: ren sort (#000000) og ren hvid i stedet for den lilla-tonede næsten-sort #0F0E13. Begrundelse: den tonede næsten-sort er netop det træk, der får siden til at ligne en standardskabelon. Ren sort og hvid giver et grafisk, redaktionelt udtryk, der passer til Schibsted Grotesk, og lader violet og memojiens farver være de eneste farver på siden. En varm mørk tone blev fravalgt, fordi violet bliver mudret på brunlig sort. Alle grå er neutrale (ingen lilla tone), så violet står alene.

Kontrast er målt med WCAG 2 og APCA (Lc). Krav: brødtekst mindst 4,5:1, UI-kanter mindst 3:1.

### Lyst tema

| Token | Hex | Rolle | Målt kontrast |
|---|---|---|---|
| --bg | #FFFFFF | Baggrund | |
| --surface | #F4F4F4 | Rolige flader (Problemet, kort, formularens felter) | |
| --ink | #000000 | Overskrifter og al brødtekst | 21,0:1 på bg, 19,1:1 på surface (Lc 106) |
| --muted | #5C5C5C | Kun metadata (perioder, roller, små noter) | 6,69:1 på bg, 6,08:1 på surface (Lc 83) |
| --line | #E2E2E2 | Dekorative skillelinjer (ikke UI-kanter) | 1,30:1 (kun pynt) |
| --field-border | #8A8A8A | Kanter på felter og sekundære knapper | 3,45:1 på bg, 3,14:1 på surface |
| --accent | #7C3AED | Violet: primære knapper, links, valgt agent, taleboblens tekst | 5,70:1 på bg, 5,18:1 på surface (Lc 78) |
| --accent-hover | #6D28D9 | Hover på primære knapper | hvid tekst 7,10:1 |
| --on-accent | #FFFFFF | Tekst på violet | 5,70:1 |
| --accent-soft | #F1EBFE | Taleboblen fra den besøgende, valgt agent | ink 18,1:1, accent 4,90:1 |
| --focus | #7C3AED | Fokusring (3 px) | 5,70:1 |
| --inverse-bg | #000000 | Case-sektionen | |
| --inverse-ink | #FFFFFF | Tekst i case-sektionen | 21,0:1 |
| --inverse-muted | #BDBDBD | Metadata i case-sektionen | 11,2:1 |
| --inverse-line | #3A3A3A | Kortkanter i case-sektionen | 1,85:1 (kun pynt) |
| --stat | #C4B5FD | De store tal i case-sektionen | 11,4:1 |

### Mørkt tema (følger enhedens indstilling)

| Token | Hex | Rolle | Målt kontrast |
|---|---|---|---|
| --bg | #000000 | Baggrund | |
| --surface | #151515 | Flader | |
| --ink | #F2F2F2 | Overskrifter og brødtekst | 18,8:1 på bg, 16,3:1 på surface |
| --muted | #C4C4C4 | Metadata (løftet fra #A7A3B2, som var Lc 53) | 12,0:1 på bg, 10,5:1 på surface (Lc 71) |
| --line | #2A2A2A | Skillelinjer (pynt) | 1,46:1 |
| --field-border | #7A7A7A | Felter og sekundære knapper | 4,89:1 på bg, 4,25:1 på surface |
| --accent | #A78BFA | Violet i mørkt tema | 7,72:1 på bg, 6,71:1 på surface |
| --accent-hover | #C4B5FD | Hover | sort tekst 11,4:1 |
| --on-accent | #000000 | Tekst på violet | 7,72:1 |
| --accent-soft | #1E1830 | Taleboble, valgt agent | ink 15,3:1 |
| --focus | #A78BFA | Fokusring | 7,72:1 |
| --inverse-bg | #151515 | Case-sektionen (lidt lysere end siden) | |
| --inverse-muted | #C4C4C4 | Metadata i cases | 10,5:1 |
| --stat | #C4B5FD | Store tal | 9,89:1 |

Fjernet fra paletten: Dyb violet #4C1D95, Orkidé #C026D3, Rosé #F472B6, --gradient, --glow og de fem agentfarver.

## 4. Typografi

Skrift: Schibsted Grotesk (variabel, vægt 400 til 900) i stedet for Geist. Den ligger selv på siden som site/fonts/schibsted-grotesk-latin.woff2 (latin inkl. æøå, 47 KB) under SIL Open Font License (site/fonts/OFL.txt).

Hvorfor Schibsted frem for Familjen Grotesk: Schibsted er tegnet til et nordisk mediehus og er bygget til at blive læst, både i 17 px brødtekst og i tunge overskrifter. Den har et redaktionelt, journalistisk præg, der siger marketing og indhold frem for udviklerværktøj. Familjen Grotesk har mere særpræg i detaljerne, men kun vægt 400 til 700 og er svagere i lange brødtekster.

Skala (forhold ca. 1,25, base 17 px), som tokens i :root:

| Token | px | Bruges til |
|---|---|---|
| --fs-14 | 14 | Metadata, noter, labels på tal |
| --fs-17 | 17 | Brødtekst, knapper, felter (mindst 16 px forhindrer zoom på iOS) |
| --fs-21 | 21 | Underlinje i hero, h3, agentens tekst på desktop |
| --fs-26 | 26 | Agentens navn, kort-titler |
| --fs-33 | 33 | H1 og h2 på mobil |
| --fs-41 | 41 | H2 på desktop, store tal på mobil |
| --fs-52 | 52 | H1 på tablet, store tal på desktop |
| --fs-64 | 64 | H1 på desktop |

Regler: overskrifter i vægt 700 med let negativ spatiering, brødtekst 400, ingen versaler i labels og ingen fremhævning af enkelte ord i overskrifter. Linjer holdes under ca. 70 tegn.

## 5. Komponenter

- **Knapper (handlinger):** primær er violet flade med hvid tekst (mørkt tema: lys violet med sort tekst), radius 12 px, mindst 48 px høj. Sekundær er en kant i --field-border med ink-tekst. Begge giver et lille tryk (scale 0,97). Kun knapper er udfyldte.
- **Toggles (valg):** kun agentrækken i hero. Den valgte agent får en flade i --accent-soft og en 2 px kant i --accent. Ingen sort pille.
- **Talebobler:** radius 20 px med ét skarpt hjørne (4 px) mod afsenderen. Den besøgendes boble ("Hey Kasper, byg os lige …") står i --accent-soft med violet tekst og de fire talende prikker. Kaspers svar (agentkortet) står på --surface.
- **Kort:** samarbejdsformer og cases er kort med radius 16 px og kant i --line (cases: --inverse-line). Ingen skygger.
- **Store tal:** tallet i --fs-52 (mobil --fs-41) og vægt 800 i --stat, med en forklaring i --fs-14 under.
- **Pladsholdere:** tekst i firkantede parenteser har klassen `ph` (stiplet understregning), så de er nemme at finde.

## 6. Fjernet (fra slop-analysen)

- Gitteret bag hero (.hero-grid) og den prikkede flade (.tools-stage)
- Skinnerne med plus-mærker (.page border-inline, .section::before/::after, footer)
- Den isometriske værktøjsstak (assets/stack.svg) og de skæve logofliser
- Gradient (--gradient, .frame, .g1 til .g3) og al glød (--glow, glød på trin-ikoner, figurens radiale glød)
- Scroll-reveals (data-reveal i main.js og CSS)
- Blur-in på overskriften (hey-in) og den svævende memoji (fig-float)
- Den buede bar med hævet pude i agentvælgeren (nu en ren række)
- Stregikonerne på de fire trin (nu tallene 1 til 4)
- Versaler i labels (.spor-label) og fremhævede enkeltord i trin- og CV-titler
- Temaknappen og scriptet, der huskede temaet i localStorage

Beholdt: de fire talende prikker og memojiens svar, når man vælger en agent (navnet glider ind bogstav for bogstav). Ved prefers-reduced-motion bliver svaret en stille fade, og prikkerne står stille.

## 7. Booking direkte på siden

- "Åbn min kalender"-kortet og skifteren mellem forespørgsel og booking er erstattet af Googles bookingside i en iframe ved siden af formularen: https://calendar.google.com/calendar/appointments/schedules/AcZssZ3MViM8rz10NnRz3-VbJuZ231pkGropG5vH6Q_wX3aKAZgnltTjzKpcPQnqLo_ya82ZmCmgYgiA?gv=true
- iframen har title, loading="lazy", responsiv højde og et link under sig til samme side hos Google, hvis den ikke vises.
- netlify.toml: https://calendar.google.com er tilføjet til frame-src i CSP'en.
- privatliv.html og vilkaar.html nævner nu den indlejrede kalender.
- **Måling:** `booking_klik` kan ikke længere måles som før. Klik inde i iframen kan siden ikke se, fordi kalenderen ligger hos Google. Eventet sendes nu kun, når nogen bruger linket under kalenderen eller linket på tak-siden. En bekræftet booking kan kun måles i Google Kalender eller ved at sende Google-bekræftelserne videre til Apps Scriptet. Se docs/sporing.md.
- **Til afklaring med Kasper:** CLAUDE.md fravalgte tidligere at indlejre kalenderen, så Google ikke sætter cookies på siden. Når kalenderen er indlejret, kan Google sætte sine egne cookies i rammen, når den indlæses. Det kræver efter de danske regler normalt samtykke. Kalenderen indlæses først, når sektionen nærmer sig skærmen (loading="lazy"). En løsning, der overholder reglerne, er "klik for at vise kalenderen" eller at koble iframen på cookiebanneret. Det er ikke bygget, fordi Kasper bad om en direkte indlejring.

## 8. Ændringer i undersider, netlify.toml og docs

- Alle sider: Schibsted Grotesk i preload, ingen temaknap, intet tema-script, theme-color #FFFFFF/#000000.
- 404.html: genvejen "Mit CV" er nu "Cases" (/#cases).
- tak.html og 404.html: samme top og footer som forsiden.
- netlify.toml: tema-scriptets hash (WaAKX…) er fjernet fra script-src, og https://calendar.google.com er tilføjet til frame-src.
- docs/copy.md: hero, "Sådan foregår det", cases og booking er opdateret. Værktøjer, CV og workshops er fjernet.
- docs/sporing.md: `booking_klik` og `samarbejdsform_valgt` er beskrevet på ny (knapperne i sammenligningen sender nu `samarbejdsform_valgt`).
- CLAUDE.md: "Sidens opbygning" og "Design" passer til den nye side.
- site/assets: stack.svg og geist-latin.woff2 er slettet.

## 9. Det mangler fra Kasper

- Godkendelse eller ændring af arbejdsteksterne i afsnit 2.
- Cases, pr. job: [KONTEKST] (virksomheden og udgangspunktet), [HVAD VAR SVÆRT], [UDTALELSE] med navn og titel, og for Africa Tours og Cand også [RESULTAT] med rigtige tal.
- Beslutning om cookies og den indlejrede kalender (afsnit 7).
- CVR til footeren, når det findes.
- Om "Workshops og oplæring" skal tilbage et andet sted. Det står stadig i docs/tilbud.md, men vises ikke på siden.
