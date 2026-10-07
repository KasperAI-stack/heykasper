# Plan: Ny hero med memoji-vælger

Status: færdig. Den nye hero er flyttet ind på forsiden (site/index.html), testsiden er slettet, og sektionen "Tre ting, jeg tager ansvar for" er fjernet. De gældende tekster står i docs/copy.md. Planen herunder er gemt som baggrund.

## 1. Hvad videoen gør

Videoen er 8 sekunder og viser én skærm, der fungerer sådan her:

- Øverst en lille hilsen ("Hey, Jimmy") og en stor, venlig overskrift med et spørgsmål.
- I midten en stor figur, der skifter, når man vælger noget.
- Under figuren et stort farvet ord (Okay, Good, Great) og en hvid, rund knap.
- Nederst en svagt buet bar med fem små ikoner. Det valgte ikon ligger i en hvid "pille".
- Når man vælger et nyt ikon, sker fire ting på samme tid på cirka en tredjedel af et sekund:
  1. Den gamle figur toner ud og bliver lidt sløret, og den nye "popper" ind (bliver lidt større og falder på plads).
  2. Ordet skifter på samme måde og får en ny farve.
  3. Det farvede lysskær bag figuren glider over i en ny farve.
  4. Pillen i baren glider hen til det nye ikon.

Det er en enkel opbygning, og alt kan laves med ren HTML, CSS og lidt JavaScript, som resten af siden.

## 2. Sådan ser det ud hos Hey Kasper

```
            Jeres nye AI marketing manager          <- lille linje over (brief'ens overskrift)

               Hvad vil I bygge i dag?              <- H1

                  ( lilla lysskær )
                 [ STOR MEMOJI ]                    <- skifter efter valg

                    En SoMe-agent                   <- stor titel, skifter
        Jeg bygger en agent, der skriver opslag     <- én sætning, skifter
          i jeres tone, så I altid har noget klar.

               ( Book en snak om det )              <- knap i tekstfarven

   .-----------------------------------------------.
  (  [hoved]  [hoved]  [HOVED]  [hoved]  [hoved]    )  <- buet bar, valgt = udfyldt pille
  (   SoMe    E-mail    Meta-   Landing-  Produkt-  )
   '-----------------   annoncer  page    tekster -'
```

Tilpasning til brandet:

- Lysskæret bag memojien er lilla i stedet for blå, grøn og orange. Hver mulighed får sin egen lilla tone (violet, orkidé, dyb violet, og rosé i mørkt tema), så skiftet stadig kan ses.
- Knappen og den valgte pille i baren er i tekstfarven (sort i lyst tema, lys i mørkt tema) og helt runde i enderne, som briefen siger om knapper og vælgere.
- Baren står på den grå flade (Tåge i lyst tema, Grafit i mørkt tema).
- Skriften er Geist med stram afstand i den store overskrift, som resten af siden.

## 3. Tekst (udkast, skal godkendes og tjekkes med /copy-review)

Overskrift: **Hvad vil I bygge i dag?** Briefen siger, at vi skriver "I" og "jer" til virksomheden, så "du" fra jeres forslag er rettet til "I".

Linjen over overskriften: "Jeres nye AI marketing manager". Så står den nuværende overskrift stadig på siden, også for Google.

Mulighederne i baren skal hænge sammen med de tre produkter i docs/tilbud.md. Forslag:

| Tekst i baren | Stor titel | Sætning under titlen | Hører til produktet |
|---|---|---|---|
| SoMe-agent | En SoMe-agent | Jeg bygger en agent, der skriver opslag i jeres tone, så I altid har noget klar til næste uge. | Content-agent |
| E-mail | En e-mailkampagne | Jeg skriver kampagnen og sætter den op, så den når de rigtige modtagere og følger op af sig selv. | Content-agent |
| Meta-annoncer | Analyse af ugens Meta-annoncer | I får et overblik over, hvad der virkede, hvad der ikke gjorde, og hvor I skal sætte ind. | Analyse og rapportering |
| Landingpage | En landingpage med leadform | En side bygget til at konvertere, hvor leads bliver sorteret og fulgt op uden manuelt arbejde. | Landingpages og leadforms |
| Produkttekster | Produkttekster og SEO | Jeg skriver tekster i jeres tone, så I kan producere mere uden at ansætte flere. | Content-agent |

Knappen: "Book en snak om det". Når man trykker, hopper siden ned til formularen, og beskedfeltet er udfyldt med fx "Hey Kasper, byg os en SoMe-agent." Det binder heroen sammen med formularens "Hey Kasper, byg os ..." og gør det lettere at skrive til jer.

Fem muligheder passer til videoen, men fire er lettere at få til at se godt ud på en smal mobil.

## 4. Billeder fra Higgsfield: det skal jeg bruge

**Anbefaling: stillbilleder, ikke SVG og ikke video i første omgang.**

- SVG giver kun mening for flade tegninger med linjer og flader. En memoji er et "foto-agtigt" 3D-billede, og hvis den gemmes som SVG, ligger der bare et almindeligt billede inde i filen. Den bliver tungere og ikke skarpere.
- Animeret video med gennemsigtig baggrund er svær på nettet. Chrome kan vise WebM med gennemsigtighed, men Safari på iPhone kan ikke, og den skal have en særlig HEVC-fil, som kun kan laves på en Mac. Hvis Higgsfield kun kan levere video med baggrund, kan den ikke ligge oven på lysskæret og skifte mellem lyst og mørkt tema.
- Stillbilleder plus animation i CSS (pop, fade og glidende lysskær) giver præcis den fornemmelse, man ser i videoen. Bevægelsen i videoen kommer næsten kun fra skiftet, ikke fra figuren selv.

Pr. mulighed:

1. **Én stor memoji**
   - Samme figur som site/assets/kasper-memoji.webp.
   - Samme beskæring på alle (enten overkrop som i dag eller hele figuren som blobben i videoen), samme kameravinkel og samme størrelse i billedet, så de ikke "hopper" ved skift.
   - Gennemsigtig baggrund, PNG, 1024 x 1024 pixels, figuren i midten.
   - Et udtryk eller en ting i hånden, der passer til opgaven, fx telefon (SoMe), kuvert (e-mail), forstørrelsesglas (annoncer), bærbar computer (landingpage), notesblok (tekster). Ingen tal og ingen tekst i billedet.
2. **Ét lille hoved til baren**
   - Kun hovedet med samme udtryk som den store, gennemsigtig baggrund, PNG, 256 x 256 pixels.
   - Kan I ikke lave dem, klipper jeg dem ud af de store billeder.

Jeg laver filerne om til WebP og komprimerer dem. Målet er højst 40 KB pr. stor memoji og 8 KB pr. hoved.

Animation (valgfrit, senere): hvis I vil prøve en levende memoji, så lav en løkke på 2 til 3 sekunder, der starter og slutter i samme stilling, med gennemsigtig baggrund (PNG-sekvens eller .mov med alfakanal). Så tester vi den på den valgte memoji alene, og den slås fra ved prefers-reduced-motion.

## 5. Sådan bygges koden

Samme principper som resten af siden: ren HTML, CSS og JavaScript, intet framework, og siden virker uden JavaScript.

**HTML.** Alt indhold står i HTML, så Google kan læse det, og så det virker uden JavaScript. Det følger samme mønster som produktfanerne (`data-show` og `hidden`):

```html
<section class="hero hero-pick">
  <p class="hero-eyebrow">Jeres nye AI marketing manager</p>
  <h1>Hvad vil I bygge i dag?</h1>

  <div class="stage" data-glow="1">
    <div class="stage-item" id="vis-some">
      <img src="/assets/memoji/some.webp" alt="Kasper som memoji med en telefon i hånden" width="320" height="320" fetchpriority="high">
      <p class="stage-title">En SoMe-agent</p>
      <p class="stage-text">Jeg bygger en agent, der skriver opslag ...</p>
    </div>
    <div class="stage-item" id="vis-email" hidden> ... </div>
    ...
    <a class="btn" href="#book" data-prompt="Hey Kasper, byg os en SoMe-agent.">Book en snak om det</a>
  </div>

  <div class="picker" role="group" aria-label="Vælg en opgave">
    <span class="picker-pill" aria-hidden="true"></span>
    <button class="pick" type="button" data-show="vis-some" data-glow="1" aria-pressed="true">
      <img src="/assets/memoji/some-hoved.webp" alt="" width="48" height="48">
      <span>SoMe-agent</span>
    </button>
    ...
  </div>
</section>
```

**CSS** (nyt afsnit i styles.css):

- Lysskæret er en `radial-gradient` bag memojien med farven i en variabel (`--glow`), der skifter efter `data-glow`. Svage lysstråler kan laves med en `conic-gradient`. Ingen billeder.
- Skiftet: den nye memoji og titel får en kort animation fra `opacity: 0; scale: .9; filter: blur(4px)` til normal på cirka 350 ms med en let "fjedrende" kurve (`cubic-bezier(.34, 1.56, .64, 1)`).
- Pillen i baren er ét element, der flyttes med `transform: translateX(...)`, så den glider i stedet for at hoppe.
- Den buede bar: knapperne yderst ligger lidt lavere end dem i midten (`translate: 0 8px` og `0 3px`), og baren har en bred, oval rundhed.
- `@media (prefers-reduced-motion: reduce)` slår pop, glid og sløring fra, så skiftet sker med det samme.
- Mobil først: baren er fuld bredde med korte tekster under hovederne. Er der ikke plads, kan den rulles sidelæns med `scroll-snap`.

**JavaScript** (cirka 50 linjer i main.js):

- Klik på en mulighed: sæt `aria-pressed`, vis det rigtige `stage-item`, skift `data-glow`, flyt pillen og opdater knappens `data-prompt`.
- Piletasterne venstre og højre skifter mulighed, når baren har fokus.
- Swipe til siden på memojien skifter til næste eller forrige mulighed på mobil, som "Swipe to select mood" i videoen.
- Knappen udfylder beskedfeltet i formularen med teksten fra `data-prompt` og sætter markøren der (genbruger det, siden allerede gør med `data-focus`).
- Når siden er færdig med at loade, hentes de andre memojier i baggrunden, så der ikke kommer et blink første gang, man skifter.

**Uden JavaScript** vises den første mulighed med knap til booking, og baren skjules, så der ikke står knapper, der ikke gør noget.

**Tilgængelighed:** synligt fokus på alle muligheder, alt-tekst på de store memojier (hovederne i baren har tom alt, fordi teksten står under), og titlen læses op af skærmlæsere, når den skifter (`aria-live="polite"`). Kontrasten tjekkes i begge temaer.

**Hastighed:** kun den første store memoji hentes med det samme. Hele heroen bør holde sig under cirka 250 KB billeder.

## 6. Test før det kommer på hey-kasper.dk

Vi bygger på grenen `claude/hero-memoji-bar-design-4ey39t`. Intet kommer på den rigtige side, før I siger god for det, og grenen bliver lagt sammen med den gren, der er live.

1. **Testside.** Jeg laver `site/test-hero.html` med sin egen `test-hero.css` og `test-hero.js`. Den nuværende forside bliver ikke rørt. Testsiden får `noindex`, så Google ikke viser den, og der linkes ikke til den.
2. **Pladsholdere først.** Indtil Higgsfield-billederne er klar, bruger testen de memojier, vi allerede har. Så kan I mærke animationen og layoutet med det samme.
3. **Se testen:**
   - Lokalt: `npx serve site` og åbn `/test-hero.html`.
   - Online: Netlify laver en testadresse for grenen (branch deploy eller deploy preview, når der er en pull request). Den er låst bag jeres Netlify-login, så kun I kan se den.
4. **Tjekliste før godkendelse:** iPhone (Safari), Android (Chrome), computer, lyst og mørkt tema, tastatur, "reducér bevægelse" slået til, /copy-review og en Lighthouse-måling.

## 7. Faserne

| Fase | Hvad | Hvem |
|---|---|---|
| 0 | Svar på spørgsmålene i afsnit 8 | Kasper |
| 1 | Testside med pladsholderbilleder, animation, bar, mobil og mørkt tema | Claude |
| 2 | Lav memojierne i Higgsfield efter afsnit 4 | Kasper |
| 3 | Billederne konverteres, komprimeres og sættes ind i testen. Finpudsning. | Claude |
| 4 | Testen godkendes på mobil og computer | Kasper |
| 5 | Heroen flyttes ind i index.html, testsiden slettes, og CLAUDE.md, docs/copy.md og site/assets/README.md opdateres, så briefen beskriver den nye hero i stedet for chatvinduet | Claude |
| 6 | Grenen lægges sammen med den, der er live, og hey-kasper.dk opdateres automatisk | Kasper godkender |

## 8. Det skal Kasper beslutte

1. Overskriften "Hvad vil I bygge i dag?" erstatter "Jeres nye AI marketing manager" som H1. Er det i orden, at den gamle overskrift står som den lille linje over?
2. Hvilke 4 eller 5 muligheder skal med, og passer teksterne i tabellen?
3. Skal chatvinduet ("Hey Kasper, byg os en Landing Page med fokus på ...") helt ud af heroen, som i videoen, eller skal det blive under baren?
4. Skal den store memoji være overkrop (som i dag) eller hele figuren (som blobben i videoen)?

## 9. Ting jeg opdagede undervejs (ikke en del af heroen)

- **Domænet.** Netlify siger, at siden ligger på hey-kasper.dk, men koden skriver heykasper.dk uden bindestreg i `canonical`, `og:url`, sitemap.xml og robots.txt. Det bør rettes, så Google og deling på sociale medier peger det rigtige sted hen.
- **Formularen.** Netlify Forms står som "ikke slået til" på projektet. Så bliver henvendelser fra formularen ikke gemt. Det slås til i Netlify under Forms og kræver en ny udgivelse bagefter.
- **Live-grenen.** Briefen siger, at siden udgives, når der pushes til main, men der findes ingen main-gren på GitHub. Tjek i Netlify under "Branches and deploy contexts", hvilken gren der er live.
