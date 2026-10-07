# Landingpage: Hey Kasper

En enkel landingpage i ren HTML og CSS, der publiceres gratis via Netlify.

## Mappen

- CLAUDE.md: briefen til Claude Code. Brand, tone, design og regler.
- docs/tilbud.md: produkter, proces og priser.
- docs/copy.md: teksten til hver sektion.
- site/: selve hjemmesiden. Det er kun denne mappe, der kommer online.
- docs/automatisering.md: sådan sætter du booking og automatiske svar op (gratis).
- automatisering/: scriptet til Google Apps Script. Kommer ikke online.
- netlify.toml: fortæller Netlify, at site/ skal publiceres.
- .claude/commands/copy-review.md: kommandoen /copy-review, der tjekker teksten mod dine regler.

## Kom i gang

1. Læg mappen et sted på din computer, og åbn en terminal i den.
2. Start Claude Code med kommandoen `claude`. Den læser CLAUDE.md automatisk.
3. Se siden lokalt: `npx serve site` og åbn adressen, der vises i terminalen.
4. Din memoji ligger i site/assets/: kasper-memoji.webp (overkrop i hero), kasper-memoji-hel.webp (hele figuren på tak-siden), kasper-peger.svg ("Hvem bygger det?") og kasper-meditation.svg (bookingsektionen). Siden bruger ingen rigtige fotos.
5. Udfyld pladsholderne i firkantede parenteser, fx resultater, e-mail, telefon, CVR og LinkedIn.

## Publicér via Netlify

1. Opret et repository på GitHub, og push mappen dertil. Claude Code kan hjælpe med det.
2. Log ind på netlify.com, vælg "Add new site" og derefter "Import an existing project".
3. Vælg dit GitHub-repository. Netlify læser netlify.toml og publicerer site/ automatisk.
4. Formularen: gå til Forms i Netlify og slå formularregistrering til, hvis den ikke allerede er slået til. Tilføj din e-mail under notifikationer, så du får besked ved nye henvendelser.
5. Domæne: tilføj dit eget domæne under Domain management. Ø kan ikke bruges i alle domæner, så tjek fx en variant med oe.

Hver gang du pusher til main, opdaterer Netlify siden automatisk.

## Gode første opgaver til Claude Code

- "Gennemgå siden på mobil og ret det, der ikke ser godt ud."
- "/copy-review"
- "Lav en version af hero-sektionen, hvor memojien er til venstre og teksten til højre på desktop."
