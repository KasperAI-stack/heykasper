# Plan: blog på hey-kasper.dk

Status: plan, ikke bygget. Skrevet 19. oktober 2026.

## Mål

Kasper skal kunne udgive blogindlæg på hey-kasper.dk, der bliver fundet i Google og citeret af AI-søgning (ChatGPT, Google AI Overviews, Perplexity). Indlæggene skal kunne skrives af agenterne i HeyOtto Studio og må først gå live, når Kasper har godkendt dem.

## Beslutninger

| Spørgsmål | Valg | Hvorfor |
|---|---|---|
| Hvor bor teksterne? | Markdown-filer i samme GitHub-repo som sitet (`site/blog/`) | Gratis, fuld historik, ingen låsning til et CMS |
| Hvilken adresse? | Undermappe: `hey-kasper.dk/blog/<slug>/` | Al autoritet samles på ét domæne. Underdomæne eller Medium og LinkedIn spreder den |
| Database eller CMS? | Nej. Hverken Supabase, WordPress eller headless CMS | Sitet har ingen dynamiske data. Supabase pauser desuden gratisprojekter efter en uge uden aktivitet |
| Hvordan bliver Markdown til sider? | Eleventy (11ty) som statisk sitegenerator | Kan bruge den nuværende håndskrevne HTML og CSS uændret. Astro kræver mere omskrivning |
| Hvor hostes det? | Netlify som i dag. Cloudflare Pages, hvis der udgives ofte (se Omkostninger) | Formularen kører allerede på Netlify Forms |
| Hvem godkender? | Kasper, ved at merge et pull request | Følger reglen om, at intet går live uden godkendelse |

## Mappestruktur

```
site/
  index.html              forsiden, uændret
  blog/
    index.njk             oversigt over alle indlæg (/blog/)
    <slug>.md             ét indlæg pr. fil
    blog.json             fælles indstillinger for indlæg (layout, permalink)
  _includes/
    base.njk              fælles <head>, header og footer (trukket ud af index.html)
    post.njk              layout for et indlæg
  assets/blog/<slug>/     billeder til indlægget, som WebP
eleventy.config.js        byggeopsætning
```

## Et indlæg

Hvert indlæg er én Markdown-fil med disse felter øverst:

```yaml
---
title: "Sådan automatiserer I mandagsrapporten med AI"
description: "Én sætning på højst 155 tegn, der bruges i Google og ved deling."
date: 2026-11-03
updated: 2026-11-03
tags: [rapportering, automatisering]
image: /assets/blog/mandagsrapport/forside.webp
imageAlt: "Beskrivelse af billedet"
draft: true
---
```

`draft: true` betyder, at indlægget bygges i testsitet, men ikke kommer med i sitemap, RSS eller live-sitet.

## Det, hvert indlæg får automatisk

- egen URL, `<title>`, meta description og canonical
- Open Graph- og Twitter-kort med billede
- `BlogPosting` i JSON-LD med forfatter (koblet til `Person` på forsiden via `@id`), dato, opdateret dato og billede
- `BreadcrumbList` (Forside, Blog, indlæg)
- plads i `sitemap.xml` og i et RSS-feed på `/blog/feed.xml`
- samme header, footer og design som resten af siden
- læsetid og dato øverst og links til de seneste indlæg nederst
- en afsluttende boks med "Book 30 minutter" (til `/#book`)

## Skriveregler for indlæg (SEO og GEO)

Reglerne i docs/stemme.md gælder også her: I-form, Kasper skriver "jeg", ingen tankestreger og ingen AI-klingende vendinger.

- Ét emne pr. indlæg, formuleret som et spørgsmål, en virksomhed faktisk søger på.
- Første afsnit svarer direkte på spørgsmålet i to til tre sætninger, så det kan citeres alene.
- Mellemoverskrifter (`##`) som spørgsmål eller tydelige trin.
- Konkrete eksempler fra Kaspers eget arbejde. Ingen opdigtede tal, kunder eller citater. Mangler et tal, står det som `[PLADSHOLDER]`, og indlægget må ikke udgives, før det er fyldt ud.
- Link til mindst ét andet indlæg eller til den relevante sektion på forsiden.
- Billeder har altid alt-tekst og er komprimeret som WebP på højst ca. 150 KB.

## Arbejdsgang med HeyOtto Studio

1. Kasper eller strategen vælger et emne.
2. Copywriter-agenten skriver indlægget som Markdown med `draft: true` på en ny branch og åbner et pull request.
3. Testsitet på GitHub Pages viser indlægget, så Kasper kan læse det i sit rigtige design.
4. Kasper retter eller godkender. Ved godkendelse sættes `draft: false`, og pull requestet merges.
5. Indlæg udgives samlet på faste dage (se Omkostninger), ikke ét ad gangen.

## Omkostninger

Alt er gratis, så længe udgivelserne holdes samlet.

- Tekst og billeder: gratis i GitHub. Et indlæg fylder få KB plus billeder.
- Testsitet: gratis på GitHub Pages, uanset hvor mange gange der pushes.
- Live-sitet: Netlifys gratis plan har 300 kreditter om måneden, og hver produktionsudgivelse koster ca. 15 (tallene varierer mellem kilderne, så tjek Billing på app.netlify.com/teams/kasmussen80). Puljen deles med heyotto.dk og heyotto-os, og når den er brugt op, sættes alle tre sites på pause. Derfor udgives indlæg samlet, fx én gang om ugen.
- Udgives der mere end ca. to gange om ugen, eller kommer der meget trafik fra annoncer, flyttes live-sitet til Cloudflare Pages (500 bygninger om måneden på den gratis plan). Det kræver, at formularen flyttes væk fra Netlify Forms.
- Billeder: i repoet. Først ved hundredvis af store billeder giver et separat billedlager mening (Cloudflare R2 eller Netlifys billed-CDN).

## Trin

Hvert trin bygges og godkendes i testrepoet, før det går videre.

1. **Byggetrin uden synlige ændringer.** Tilføj Eleventy, så den bygger `site/` til `_site/`. Forsiden og undersiderne skal se præcis ud som før. Preview-workflowet og `netlify.toml` (build-kommando og publish-mappe) opdateres.
   *Færdigt når:* testsitet er identisk med i dag, og `npm run build` virker lokalt.
2. **Fælles layout.** Træk `<head>`, header og footer ud i `_includes/base.njk`, så de findes ét sted. Forsiden bruger stadig sin egen HTML til indholdet.
   *Færdigt når:* alle fem sider ser ens ud som før, og en ændring i footeren slår igennem overalt.
3. **Blogskabelon og oversigt.** `post.njk`, `/blog/` med kort for hvert indlæg, og et eksempelindlæg med `draft: true`.
   *Færdigt når:* eksempelindlægget kan ses på testsitet i lyst og mørkt tema på desktop og mobil.
4. **SEO og GEO.** JSON-LD, Open Graph, sitemap, RSS og breadcrumbs. Link til bloggen i footeren og i `robots.txt`-sitemappen.
   *Færdigt når:* JSON-LD er gyldigt i Googles test for rich results, og sitemap og RSS indeholder kun udgivne indlæg.
5. **Arbejdsgang.** Skabelon til nye indlæg, en kort guide i `docs/`, og opsætning i HeyOtto Studio, så copywriter-agenten kan åbne pull requests med indlæg.
   *Færdigt når:* et indlæg kan gå fra emne til godkendt pull request uden manuelle trin ud over Kaspers godkendelse.
6. **Første rigtige indlæg** skrevet af copywriter-agenten og godkendt af Kasper. Derefter flyttes bloggen til live-repoet sammen med resten af redesignet.

## Åbne spørgsmål til Kasper

- Hvilke tre til fem emner skal de første indlæg handle om?
- Hvor ofte vil du udgive? Det afgør, om Netlify er nok, eller om vi skal over på Cloudflare Pages.
- Skal indlæggene også deles som LinkedIn-opslag, og skal copywriter-agenten i så fald skrive dem samtidig?
