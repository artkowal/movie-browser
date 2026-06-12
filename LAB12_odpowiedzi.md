# Laboratorium 12 — Odpowiedzi
**Przedmiot:** Zaawansowany interfejs użytkownika
**Wybrana ścieżka (Zadanie A):** Plausible (privacy-first)

---

## A — Eksploracja narzędzi (pkt 2.3)

### 1. Zdarzenia GA4 domyślne vs wymagające implementacji

**Domyślnie (Automatically collected):**  
`page_view`, `session_start`, `first_visit`, `user_engagement`, `scroll` (90% głębokość), `click` (linki zewnętrzne)

**Wymagają implementacji (Enhanced / Custom):**  
`purchase`, `add_to_cart`, `login`, `sign_up`, `search`, `view_item` — każde musi być wywołane ręcznie przez `gtag('event', ...)` lub warstwę danych GTM

### 2. Microsoft Clarity vs Hotjar Free — wybór i uzasadnienie

**Wybrałbym: Microsoft Clarity**

Clarity oferuje nielimitowane nagrania sesji i heatmapy bez żadnych dziennych limitów. Hotjar Free ogranicza nagrania do 35 sesji/dzień, co przy większym ruchu jest niewystarczające. Clarity jest całkowicie bezpłatny, integruje się z GA4, a dane są przechowywane przez 90 dni. Dla projektu studenckiego i małego MVP to wyraźnie lepszy wybór.

### 3. Rozmiar paczek (Bundlephobia)

| Paczka | Rozmiar (min+gzip) |
|---|---|
| `react-ga4` | ~3.4 kB |
| `plausible-tracker` | ~1.3 kB |

**Różnica:** `plausible-tracker` jest ~2,6× lżejszy. Dla Core Web Vitals każde kB skryptu third-party ma znaczenie — Plausible minimalnie obciąża TBT (Total Blocking Time).

### 4. Które narzędzie wymaga banera cookie w Polsce?

**Google Analytics 4** wymaga banera cookie consent na polskiej stronie.

GA4 domyślnie zapisuje cookies (`_ga`, `_ga_XXXXXX`) i zbiera Client ID powiązany z urządzeniem — co UODO i TSUE (wyrok C-673/17) kwalifikują jako przetwarzanie danych osobowych wymagające zgody. Bez implementacji Consent Mode v2 i banera CMP korzystanie z GA4 jest niezgodne z RODO na terenie UE.

**Plausible** nie wymaga banera — nie używa cookies ani localStorage, nie zbiera IP w sposób umożliwiający identyfikację, hash sesji jest resetowany codziennie. Potwierdzone przez UODO i audytorów RODO jako privacy-first.

---

## B — Wyniki analizy CSV

Dane: `session-analysis/sessions_lab12.csv` · 712 sesji · 30 dni

### B1. Bounce rate per strona

| Strona | Bounce rate | Sesje |
|---|---|---|
| home | **79,4%** | 251/316 |
| about | 61,6% | 77/125 |
| confirm | 24,8% | 31/125 |
| form | 21,2% | 31/146 |

**Strona z najwyższym bounce rate:** `home`  
**Możliwa przyczyna:** Brak wyraźnego CTA above-the-fold; użytkownik nie widzi wartości aplikacji i opuszcza stronę bez interakcji.

### B2. Drop-off formularza

| Krok | Ukończenie | Sesje |
|---|---|---|
| Krok 1 | 100,0% | 135/135 |
| Krok 2 | 65,9% | 89/135 |
| Krok 3 | 37,0% | 50/135 |
| Krok 4 | 20,0% | 27/135 |

**Krok o najwyższym drop-off:** Krok 2 (−34,1 pp)  
**Hipoteza przyczyny:** Krok 2 zawiera zbyt wiele pól lub nieoczekiwany poziom trudności po prostym kroku 1; brak progress indicator sprawia, że użytkownik nie wie ile zostało.

### B3. Top 5 klikanych elementów

| # | Element | Kliknięcia |
|---|---|---|
| 1 | `logo` | 85 |
| 2 | `form_next_btn` | 52 |
| 3 | `nav_about` | 46 |
| 4 | `scroll_banner` | 45 |
| 5 | `nav_form` | 37 |

---

## C — Propozycje iteracji projektu

### Iteracja 1 — Hero CTA na stronie głównej

| | |
|---|---|
| **Problem (dane)** | `home` bounce rate = **79,4%** (251/316 sesji); `hero_cta` klikany tylko 33 razy przy 316 odwiedzinach → CTR ~10% |
| **Hipoteza** | CTA jest niewidoczne lub nieczytelne above-the-fold; użytkownicy nie widzą wartości aplikacji i wychodzą bez interakcji |
| **Proponowana zmiana** | W `InfiniteMovieList` — wyróżnić pierwszą kartę filmową jako hero (większy format). Zwiększyć kontrast i rozmiar przycisku CTA, przenieść go above-the-fold |
| **Metryka sukcesu** | Bounce rate `home` spada poniżej 60%; kliknięcia `hero_cta` rosną o min. 50% (z 33 do ~50) |
| **Wysiłek** | Niski |

### Iteracja 2 — Uproszczenie kroku 2 formularza

| | |
|---|---|
| **Problem (dane)** | Drop-off między krokiem 1 a 2 wynosi **34,1 pp** (135 → 89 sesji) — największy skok porzuceń w lejku |
| **Hipoteza** | Krok 2 zawiera za dużo pól lub jest nieoczekiwanie skomplikowany; brak progress bar sprawia, że użytkownik nie wie ile zostało |
| **Proponowana zmiana** | W komponencie formularza — dodać progress bar z % ukończenia. Zredukować liczbę wymaganych pól w kroku 2 lub podzielić go na dwa mniejsze kroki |
| **Metryka sukcesu** | Ukończenie kroku 2 rośnie z 65,9% do min. 80%; ukończenie całego formularza (krok 4) rośnie z 20% do 30% |
| **Wysiłek** | Średni |

### Iteracja 3 — Nawigacja powrotna zamiast ucieczki przez logo

| | |
|---|---|
| **Problem (dane)** | `logo` to **najczęściej klikany element** (85 kliknięć) — 2× więcej niż `form_next_btn` (52); symptom dezorientacji nawigacyjnej |
| **Hipoteza** | Użytkownicy klikają logo jako "escape" bo brakuje wyraźnej nawigacji powrotnej — nie wiedzą jak wrócić do poprzedniego widoku |
| **Proponowana zmiana** | W `App.tsx` / header — dodać breadcrumb lub link "← Wróć do filmów" widoczny w widoku modala i formularza. Kliknięcie logo powinno przywracać tab `movies` z zachowanym stanem |
| **Metryka sukcesu** | Kliknięcia `logo` spadają o 40%; `nav_about` i `nav_form` rosną — użytkownicy nawigują intencjonalnie |
| **Wysiłek** | Niski |
