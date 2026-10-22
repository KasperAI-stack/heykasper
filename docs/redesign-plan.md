# Redesign af hey-kasper.dk, version 2

Plan fra 19. oktober 2026, bygget i heykasper-test. Version 1 (nyt farvesystem, ny skrift og oprydning i gitter, glød og værktøjsstak) blev afvist af Kasper, fordi siden ikke længere var lige så stilren. Version 2 bygger derfor på det originale design fra live-grenen (claude/heykasper-landing-page-1hm0xw) og tilføjer kun de ændringer, Kasper har bedt om.

## 1. Grundlag: det originale designsystem

Alt fra originalen er bevaret: Geist, farverne (Onyx, Grafit, Skifer, Sølvgrå, Tåge og de lilla accenter), lyst og mørkt tema med temaknappen, rammen af tynde linjer med plus-mærker, gitteret og gløden i toppen, de runde sorte knapper, scroll-reveals og værktøjssektionen med den isometriske stak, de svævende fliser og den prikkede flade. Farver og regler står i docs/brief-landingpage.md under "Design".

Usynlige tilgængelighedsfixes, der ikke ændrer udtrykket:

| Token | Lyst tema | Mørkt tema | Hvorfor |
|---|---|---|---|
| --field-border | #8A8697 (3,2:1 på Tåge) | #75707F (3,5:1 på Grafit) | Kanten på formularens felter var #D3CFDD/#3B3845 og under 3:1. Hover er nu den dæmpede tekstfarve, så kanten bliver tydeligere. |

## 2. De ændringer, der er bygget (i den rækkefølge, de er bygget)

1. **Workshop-sektionen er slettet** (HTML, CSS og JS).
2. **Booking direkte på siden.** I bookingsektionen er "Book en tid" valgt fra start og viser Googles bookingside i en iframe i den originale ramme. Iframen har title, loading="lazy", responsiv højde (820 px på mobil, 760 px fra 48rem) og et link under sig til samme side hos Google. "Send en forespørgsel" viser formularen som før. netlify.toml har fået https://calendar.google.com i frame-src. privatliv.html, vilkaar.html og docs/sporing.md nævner den indlejrede kalender.
3. **Sticky top.** Toppen med logo, temaknap og "Book en snak" står fast, når man scroller.
4. **Ny hero.** Centreret h1 med tilbuddet, underlinje og én knap, og under dem et chatfelt i stil med ChatGPT og Claude (se afsnit 3).
5. **Cases i stedet for CV.** Et rent gitter med 2x3 lyse kort (se afsnit 4).
6. **Udtalelse.** Stort citat i serif med memojien på hver side (se afsnit 5).

Værktøjssektionen er uændret fra originalen og må ikke fjernes.

## 3. Hero

- **H1 (arbejdstekst fra copywriteren, Kasper kan ændre den):** "Jeg bygger AI-agenter, der overtager jeres *faste marketingopgaver*". De sidste to ord står i Instrument Serif kursiv, en tynd serif, der minder om "hey" i logoet. Fremhævningen tager agentens farve (samme tone som agentens navn) og skifter blødt, når man vælger en agent.
- **Underlinje:** "Til marketingteams uden en udvikler i huset. Vi starter med én opgave og en gratis prøveopgave på jeres egne data, så I ser den virke, før I beslutter noget."
- **Knap:** "Book 30 minutter" → #book.
- **Chatfeltet:** et afrundet felt (radius 22 px, lys kant og blød skygge) med teksten "Hey Kasper, byg os lige en annonce-agent". Når man vælger en agent, bliver agentens navn slettet og skrevet igen med en blinkende markør, de fire prikker i højre side taler som "skriver"-indikator, og først derefter kommer svaret. De fem memoji-hoveder sidder som valg i bunden af feltet, ligesom værktøjsrækken i Claude, og den valgte står på den hvide, hævede pude fra originalen.
- **Svaret:** den originale memoji-scene med agentens navn i agentens farve og beskrivelsen under. Gløden i agentens farve ligger bag feltet og svaret, og gitteret bærer baggrunden.
- **Teknik:** piletaster, Home og End skifter agent, når valgene har fokus. Man kan stryge på mobil. aria-live læser agentens navn og beskrivelse op. Ved prefers-reduced-motion skiftes teksten uden skriveanimation, markøren vises ikke, og prikkerne står stille. Uden JavaScript står "Hey Kasper, byg os lige en annonce-agent" i feltet, Annonce-agenten vises som svar, og valgene er skjult.
- **Mobil:** h1, underlinje og knap er synlige uden scroll, og chatfeltet står kompakt under dem.
- Skrifter: Instrument Serif (normal og kursiv) ligger i site/fonts under SIL Open Font License (site/fonts/OFL-instrument-serif.txt). Kursiven preloades på forsiden.

## 4. Cases

- Stor centreret overskrift på to linjer (arbejdstekst): "Det har mit arbejde / ført til". Under den én kort linje med link til LinkedIn.
- 2x3 lysegrå kort (Tåge, radius 28 px) på desktop, 2 kolonner på tablet og 1 på mobil. Hvert kort har emnet øverst i midten, firmaet under, ét tal fra CV'et i midten og en lille pladsholder nederst.

| Kort | Firma | Tal | Motiv |
|---|---|---|---|
| Account Based Marketing | VoiceArchive | 12x ROI | Kun tallet |
| Google Ads | VoiceArchive | 17→40 % søgevisningsandel | To søjler |
| AI-drevet SEO | VoiceArchive | 30→10 gennemsnitlig placering | Kun tallet |
| Programmatisk SEO | VoiceArchive | 320 landingpages med n8n | Stablede sider |
| Webinarer | Poetype | 600 deltagere på 5 webinarer | Kun tallet |
| Podcast | Poetype | Top 2 på marketinghitlisten | Lille hitliste |

260 deltagere på 5 fysiske events (Poetype) er ikke med, fordi der kun er seks kort. Africa Tours og Cand har ingen tal i CV'et og er derfor ikke med.

## 5. Udtalelse

- Placeret efter cases og før booking, så beviserne kommer samlet lige før næste skridt.
- Citatet står stort og centreret i Instrument Serif, med navn, titel og virksomhed under. Begge er pladsholdere.
- Til venstre memojiens overkrop (site/assets/kasper-memoji.webp) beskåret til et kvadrat, til højre selfie-agenten (site/assets/memoji/some.webp). Begge står på en lys lilla flade (Violet blandet 16 % med baggrunden), og de er forskudt i højden som i referencen. På mobil står citatet øverst og billederne side om side under det.

## 6. Måling

`booking_klik` kan ikke længere måles på samme måde. Klik og bookinger inde i iframen kan siden ikke se, fordi rammen ligger hos Google. Eventet sendes kun, når nogen bruger linket under kalenderen eller linket på tak-siden. En bekræftet booking kan kun måles i Google Kalender, fx ved at sende Googles bekræftelser videre til Apps Scriptet.

## 7. Til afklaring med Kasper

- Bookingsiden i Google hedder "AI afklaringsmøde" og er sat til 60 minutter, mens siden siger 30 minutter.
- Cookies: når kalenderen er indlejret, kan Google sætte egne cookies i rammen. Det kræver normalt samtykke. En mulig løsning er at koble rammen på cookiebanneret eller vise kalenderen først efter et klik.
- Arbejdsteksterne: h1, overskriften på cases og linjen under den.

## 8. Det mangler fra Kasper

- Udtalelse: [UDTALELSE] og [NAVN], [TITEL], [VIRKSOMHED].
- Cases: [KONTEKST] på hvert af de seks kort.
- CVR til footeren, når det findes.

## Stablede kort i "Sådan foregår det" (19. oktober 2026)

Samarbejdsvælgeren og de tre spor er erstattet af ét fælles flow med fire kort, inspireret af stablede servicekort. Sektionen er mørk (onyx, i mørkt tema #1A1820) og går helt ud til skærmens kanter. Kortene er dyb violet #4C1D95, violet #7C3AED, lavendel #E6DCFB og hvid, hver med ikon i en cirkel, overskrift i Instrument Serif, tekst, en knap med pil og en memoji på en klat i kontrastfarven (posttasken, detektiven, faldskærmen og løbebåndet). Kortene sætter sig fast under toppen med en kant på 24 px (12 px på mobil), og main.js skalerer dem efter scroll. På mobil står memojien lille i øverste højre hjørne, så hvert kort kan være på skærmen. Eventet samarbejdsform_valgt og ?samarbejde= i adressen er fjernet.

Justeret samme dag: sektionen er lys lilla (#F5F1FD, i mørkt tema #17132A) i stedet for onyx, så overgangen fra værktøjssektionen er blid. Kortene går fra lys til mørk (hvid, lavendel, violet, dyb violet), så det sidste kort med booking står stærkest. Kortene er gjort mindre, så de passer i skala til værktøjssektionen: højde ca. 22 rem, titler ca. 38 px, memoji ca. 200 px og 32 px mellem kortene. Overskrift og intro er centreret som i værktøjer og cases.
