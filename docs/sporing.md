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
| `booking_klik` | Når man klikker på et link med `data-track="booking"`: reservelinket til Googles bookingside og linket på tak-siden | site/js/main.js |
| `booking_dato_valgt` | Når man vælger en dag i bookingkalenderen | site/js/booking.js |
| `booking_tid_valgt` | Når man vælger et tidspunkt | site/js/booking.js |
| `booking_bekraeftet` | Når mødet står i Kaspers kalender (Apps Scriptet har svaret "ok"). Den rigtige konvertering, og den bør være primær i Google Ads | site/js/booking.js |
| `booking_fejl` | Når hentning eller booking fejler. Parameteren `booking_fejl` er `hent`, `optaget`, `netvaerk` eller HTTP-status | site/js/booking.js |

Signalerne afhænger ikke af sidernes adresser, så målingen virker, selv om en URL ændrer sig.

Siden 20. oktober 2026 er bookingkalenderen vores egen (se docs/plan-booking.md), så bookinger kan måles direkte med `booking_bekraeftet`. På testsiden kører kalenderen med eksempeltider, og `booking_bekraeftet` bliver også sendt dér, når man prøver demoen.

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
