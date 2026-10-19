# Sporing på hey-kasper.dk

Status 9. oktober 2026: Google Tag Manager er installeret på alle sider. Der er endnu ingen tags, intet cookiebanner, ingen GA4, ingen Google Ads og ingen Meta-pixel. Indtil der kommer tags i GTM, bliver der ikke målt noget.

## Koden på siderne

- Consent Mode-standard ("denied" for statistik og annoncer) står i `<head>` på alle sider i site/, før GTM. Den sættes kun dér.
- GTM-snippet lige efter Consent Mode, og GTM noscript lige efter `<body>`.
- Content-Security-Policy-Report-Only i netlify.toml tillader googletagmanager.com og har hashes for de inline-scripts, der står i `<head>`. Nye tags i GTM (GA4, Google Ads, Cookiebot) skal have deres domæner tilføjet dér.

## Signaler fra siden

| Event | Hvornår | Hvor i koden |
|---|---|---|
| `henvendelse_sendt` | Når tak-siden vises, altså efter en sendt formular | site/tak.html |
| `booking_klik` | Når man klikker på et link til Google Kalender (`data-track="booking"`): linket under den indlejrede kalender og linket på tak-siden | site/js/main.js |
| `samarbejdsform_valgt` | Når man vælger Fastansat, Konsulent eller Projekt i "Sådan foregår det". Parameter: `form` | site/js/main.js |

Signalerne afhænger ikke af sidernes adresser, så målingen virker, selv om en URL ændrer sig. Et booking-klik er ikke en bekræftet booking, fordi Google Kalender ikke kan sende besked tilbage til siden.

Siden 19. oktober 2026 er bookingkalenderen indlejret i en iframe i bookingsektionen. Klik og bookinger inde i iframen kan siden ikke se, fordi rammen ligger hos Google. `booking_klik` fanger derfor kun dem, der bruger linkene. En bekræftet booking kan kun måles i Google Kalender, fx ved at sende Googles bekræftelsesmails videre til Apps Scriptet og tælle dem dér.

## Google Tag Manager

- Container: `GTM-K7W77X5Z`

| Tag | Type | Trigger |
|---|---|---|
| (ingen endnu) | | |

## Før der kommer tags

1. Sæt et cookiebanner op (fx Cookiebot) i GTM på Consent Initialization - All Pages, uden egne standardværdier.
2. Tilføj en knap "Cookieindstillinger" i footeren på alle sider.
3. Opdatér privatlivspolitikken med de konkrete værktøjer.
4. Husk **Indsend** og **Udgiv** i GTM efter ændringer.
