# Session Analysis

Analiza zachowań użytkowników na podstawie syntetycznych danych sesji (712 rekordów, 30 dni).

## Pliki

| Plik | Opis |
|---|---|
| `index.html` | Strona z wynikami analizy — bounce rate, drop-off formularza, top kliknięcia |
| `sessions_lab12.csv` | Dane wejściowe — zanonimizowane, nie zawierają danych osobowych |

## Uruchomienie

Plik `index.html` wczytuje CSV przez `fetch()`, więc **nie zadziała przez dwuklik** — potrzebny jest lokalny serwer HTTP.

```bash
# z głównego folderu projektu
npx serve session-analysis
```

Otwórz `http://localhost:3000`.

Alternatywnie przez Python:

```bash
cd session-analysis && python3 -m http.server 8080
# → http://localhost:8080
```

## Struktura CSV

| Kolumna | Opis |
|---|---|
| `session_id` | UUID sesji (zanonimizowany) |
| `page` | Odwiedzona strona: `home`, `about`, `form`, `confirm` |
| `duration_sec` | Czas na stronie w sekundach |
| `bounce` | `true` jeśli sesja jednostronicowa bez interakcji |
| `form_step_reached` | Ostatni ukończony krok formularza (1–4) lub puste |
| `element_clicked` | Najczęściej klikany element w sesji |
| `timestamp_bucket` | Pora dnia: `morning`, `afternoon`, `evening` |
| `device` | Typ urządzenia: `mobile`, `desktop`, `tablet` |

## Co analizujemy

**Bounce rate per strona** — jaki % użytkowników opuścił stronę bez żadnej interakcji.

**Drop-off w formularzu** — ile % sesji dotarło do każdego kroku (1–4) i gdzie jest największy odpływ.

**Top 5 klikanych elementów** — ranking najczęściej klikanych elementów interfejsu.

Wyniki są dostępne zarówno wizualnie na stronie, jak i przez `console.table()` w DevTools (F12).
