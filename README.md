# 🎬 Movie Browser

![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-1-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
![MSW](https://img.shields.io/badge/MSW-2-FF6A33?style=for-the-badge&logo=mockserviceworker&logoColor=white)

Aplikacja webowa do przeglądania filmów z [The Movie Database (TMDB)](https://www.themoviedb.org/). Pozwala przeglądać popularne filmy, wyszukiwać je, dodawać do ulubionych i przeglądać szczegóły — wszystko z płynnym infinite scrollem.

Aplikacja zawiera też zakładkę **Rick & Morty** — korzysta z w pełni publicznego [Rick and Morty API](https://rickandmortyapi.com/) (bez klucza) z paginowaną listą postaci z serialu.

---

## 🚀 Uruchomienie lokalne

### 1. Sklonuj repozytorium i zainstaluj zależności

```bash
git clone <adres-repozytorium>
cd movie-browser
npm install
```

### 2. Utwórz plik `.env`

W głównym katalogu projektu utwórz plik `.env` (nie trafia do repozytorium — jest w `.gitignore`).

**Wariant A — z kluczem TMDB (prawdziwe dane):**

```env
VITE_TMDB_API_KEY=twój_klucz_api_tutaj
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

**Wariant B — bez klucza (aplikacja użyje MSW z danymi testowymi):**

```env
VITE_TMDB_API_KEY=
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

> Gdy `VITE_TMDB_API_KEY` jest pusty, aplikacja automatycznie uruchamia MSW i serwuje dane testowe zamiast odpytywać TMDB. Zakładka Rick & Morty zawsze działa — tamto API jest w pełni publiczne i nie wymaga klucza.

#### Jak zdobyć klucz TMDB API?

1. Zarejestruj się bezpłatnie na [themoviedb.org](https://www.themoviedb.org/signup)
2. Przejdź do **Konto → Ustawienia → API**
3. Utwórz nowy klucz (wybierz typ **Developer**)
4. Skopiuj wartość z pola **API Key (v3 auth)** i wklej ją do `.env`

> Klucz jest darmowy do użytku niekomercyjnego. Nigdy nie wrzucaj go do repozytorium — plik `.env` jest już dodany do `.gitignore`.

### 3. Uruchom dev server

```bash
npm run dev
```

Aplikacja dostępna pod adresem `http://localhost:5173`.

---

## 📁 Struktura projektu

```
movie-browser/
│
├── public/
│   └── mockServiceWorker.js       # Plik wymagany przez MSW (serwis worker w przeglądarce)
│
├── src/
│   ├── api/
│   │   ├── tmdbClient.ts          # Skonfigurowany klient HTTP (axios) — klucz API, język
│   │   └── endpoints.ts           # Adresy URL endpointów zebrane w jednym miejscu
│   │
│   ├── components/
│   │   ├── MovieCard.tsx          # Karta pojedynczego filmu z przyciskiem ulubionych
│   │   ├── MovieModal.tsx         # Okno ze szczegółami po kliknięciu w film
│   │   ├── InfiniteMovieList.tsx  # Siatka filmów z nieskończonym przewijaniem
│   │   ├── SkeletonCard.tsx       # Animowany placeholder podczas ładowania
│   │   ├── ErrorBanner.tsx        # Baner z komunikatem błędu i przyciskiem retry
│   │   ├── EmptyState.tsx         # Komunikat "brak wyników"
│   │   ├── CharacterCard.tsx      # Karta postaci Rick & Morty
│   │   └── CharactersList.tsx     # Lista postaci z paginacją
│   │
│   ├── constants/
│   │   └── queryKeys.ts           # Klucze cache React Query — jeden plik, zero literówek
│   │
│   ├── context/
│   │   └── FavouritesContext.tsx  # Globalny stan ulubionych współdzielony przez całą aplikację
│   │
│   ├── hooks/
│   │   ├── useFetchMovies.ts      # Pobieranie listy filmów lub wyników wyszukiwania
│   │   ├── useInfiniteMovies.ts   # Nieskończone przewijanie (infinite scroll)
│   │   ├── useMovieDetails.ts     # Szczegóły jednego filmu — pobiera tylko gdy modal otwarty
│   │   ├── useDebounce.ts         # Opóźnianie wartości — ogranicza liczbę zapytań
│   │   ├── useFavourites.ts       # Dostęp do kontekstu ulubionych
│   │   └── useCharacters.ts       # Pobieranie postaci Rick & Morty
│   │
│   ├── mocks/
│   │   ├── handlers.ts            # Definicje fałszywych odpowiedzi API (MSW)
│   │   └── browser.ts             # Uruchomienie serwis workera MSW w przeglądarce
│   │
│   ├── App.tsx                    # Główny komponent — taby, wyszukiwarka, modal, toggle 401
│   ├── main.tsx                   # Punkt wejścia — QueryClient, Providery, start MSW
│   └── index.css                  # Style całej aplikacji
│
├── .env                           # Klucz TMDB API — NIE wrzucaj do repozytorium!
├── .env.example                   # Szablon zmiennych środowiskowych (bez wartości)
└── .gitignore
```

> **Prosta zasada:** `hooks/` to logika pobierania danych, `components/` to wygląd, `api/` to połączenie z internetem, `context/` to dane współdzielone przez całą aplikację, `mocks/` to udawane API na potrzeby testów.

---

## ✅ Funkcjonalności

### 1 — Konfiguracja React Query v5

**Co robi:** React Query zarządza pobieraniem danych z API — zamiast ręcznych `fetch` + `useState` dostajemy gotowe hooki z automatycznym cache, ponownymi próbami i statusami ładowania. Konfiguracja żyje w jednym miejscu na samej górze aplikacji.

**Pliki:** [`src/main.tsx`](src/main.tsx) · [`src/constants/queryKeys.ts`](src/constants/queryKeys.ts)

```ts
// src/main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // dane "świeże" przez 5 minut — brak zbędnych zapytań
      retry: 2,                  // przy błędzie sieci spróbuj jeszcze 2 razy
      refetchOnWindowFocus: false,
    },
  },
});
```

Klucze zapytań zebrane w jednym pliku — zero literówek, łatwe czyszczenie cache:

```ts
// src/constants/queryKeys.ts
export const QUERY_KEYS = {
  movies: {
    popular:  (page: number)                => ['movies', 'popular', page],
    search:   (query: string, page: number) => ['movies', 'search', query, page],
    detail:   (id: number)                  => ['movies', 'detail', id],
    infinite: (query: string)               => ['movies', 'infinite', query],
  },
} as const;
```

---

### 2 — Lista popularnych filmów

**Co robi:** Przy starcie aplikacji automatycznie pobiera popularne filmy z TMDB i wyświetla je w siatce. Ten sam hook obsługuje też wyszukiwanie — wykrywa czy użytkownik wpisał zapytanie i zmienia endpoint.

**Pliki:** [`src/hooks/useFetchMovies.ts`](src/hooks/useFetchMovies.ts) · [`src/api/tmdbClient.ts`](src/api/tmdbClient.ts)

```ts
// src/hooks/useFetchMovies.ts
export function useFetchMovies(page = 1, query = '') {
  const isSearch = query.trim().length > 0;

  return useQuery({
    queryKey: isSearch
      ? QUERY_KEYS.movies.search(query, page)
      : QUERY_KEYS.movies.popular(page),
    queryFn: async () => {
      const endpoint = isSearch ? '/search/movie' : '/movie/popular';
      const { data } = await tmdbClient.get(endpoint, { params: { page, query } });
      return data;
    },
  });
}
```

Klient HTTP konfiguruje się raz — klucz API i język PL doklejają się do każdego żądania automatycznie. Błędy tłumaczone są na czytelny komunikat z odpowiedzi API:

```ts
// src/api/tmdbClient.ts
export const tmdbClient = axios.create({
  baseURL: import.meta.env.VITE_TMDB_BASE_URL,
  params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'pl-PL' },
});

// Zamiast "Request failed with status 401" pokaże "Invalid API key."
tmdbClient.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(new Error(error.response?.data?.status_message ?? error.message))
);
```

---

### 3 — Obsługa wszystkich stanów UI

**Co robi:** Aplikacja zawsze informuje użytkownika co się dzieje — animacja ładowania, komunikat błędu z opcją ponowienia, informacja o braku wyników lub właściwa treść.

**Pliki:** [`src/components/SkeletonCard.tsx`](src/components/SkeletonCard.tsx) · [`src/components/ErrorBanner.tsx`](src/components/ErrorBanner.tsx) · [`src/components/EmptyState.tsx`](src/components/EmptyState.tsx) · [`src/components/InfiniteMovieList.tsx`](src/components/InfiniteMovieList.tsx)

| Stan | Warunek | Komponent |
|---|---|---|
| Ładowanie | `isLoading === true` | `<SkeletonCard />` × 12 z animacją shimmer |
| Błąd | `isError === true` | `<ErrorBanner />` z komunikatem i przyciskiem retry |
| Brak wyników | `results.length === 0` | `<EmptyState />` z ikoną |
| Sukces | dane załadowane | siatka `<MovieCard />` |

```tsx
// src/components/InfiniteMovieList.tsx
if (isError)             return <ErrorBanner message={error.message} onRetry={refetch} />;
if (isLoading)           return <div className="movie-grid">{/* 12× SkeletonCard */}</div>;
if (movies.length === 0) return <EmptyState />;
return                          <div className="movie-grid">{/* MovieCard × n */}</div>;
```

---

### 4 — Wyszukiwanie z debouncingiem

**Co robi:** Użytkownik wpisuje tekst, ale zapytanie do API wysyłane jest dopiero **300 ms** po tym jak przestał pisać. Bez tego każda wpisana litera wysyłałaby osobne żądanie HTTP. Zapytanie startuje też dopiero od 2 znaków.

**Pliki:** [`src/hooks/useDebounce.ts`](src/hooks/useDebounce.ts) · [`src/App.tsx`](src/App.tsx)

```ts
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // resetuje odliczanie gdy wartość zmienia się szybciej
  }, [value, delay]);

  return debouncedValue;
}
```

```tsx
// src/App.tsx
const [query, setQuery] = useState('');
const debouncedQuery = useDebounce(query, 300);
// input pokazuje query natychmiast, do hooka trafia debouncedQuery — po 300 ms ciszy
```

---

### 5 — Modal szczegółów z leniwym pobieraniem

**Co robi:** Szczegóły filmu (czas trwania, gatunki, tagline) są pobierane **dopiero gdy użytkownik kliknie w kartę**. Parametr `enabled: false` całkowicie wyłącza zapytanie gdy żaden film nie jest wybrany.

**Pliki:** [`src/hooks/useMovieDetails.ts`](src/hooks/useMovieDetails.ts) · [`src/components/MovieModal.tsx`](src/components/MovieModal.tsx)

```ts
// src/hooks/useMovieDetails.ts
export function useMovieDetails(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.movies.detail(id ?? 0),
    queryFn:  async () => {
      const { data } = await tmdbClient.get(`/movie/${id}`);
      return data;
    },
    enabled: id !== null, // ← zapytanie aktywne TYLKO gdy modal jest otwarty
  });
}
```

---

### 6 — Ulubione z localStorage i optimistic update

**Co robi:** Filmy można dodawać do ulubionych. Lista jest zapisywana w przeglądarce i przetrwa odświeżenie strony. Interfejs reaguje **natychmiast** po kliknięciu — serduszko podświetla się bez czekania na zapis.

**Pliki:** [`src/context/FavouritesContext.tsx`](src/context/FavouritesContext.tsx) · [`src/components/MovieCard.tsx`](src/components/MovieCard.tsx)

Stan ulubionych żyje w React Context — jeden wspólny stan dla całej aplikacji (licznik w zakładce i serduszka na kartach są zawsze zsynchronizowane):

```tsx
// src/context/FavouritesContext.tsx
export function FavouritesProvider({ children }) {
  const [favourites, setFavourites] = useState<Movie[]>(() =>
    JSON.parse(localStorage.getItem('movie-browser-favorites') ?? '[]')
  );

  const toggleFavourite = useCallback((movie: Movie) => {
    setFavourites((prev) => {
      const next = prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id) // usuń jeśli już jest
        : [...prev, movie];                      // dodaj jeśli nie ma
      localStorage.setItem('movie-browser-favorites', JSON.stringify(next));
      return next;
    });
  }, []);
}
```

Optimistic update w karcie — trzy kroki:

```tsx
// src/components/MovieCard.tsx
const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
const displayedFav = optimisticFav ?? isFavourite(movie.id);

const handleToggle = (e) => {
  e.stopPropagation();
  setOptimisticFav(!displayedFav); // 1. natychmiastowa zmiana UI
  toggleFavourite(movie);          // 2. faktyczny zapis w kontekście i localStorage
  setOptimisticFav(null);          // 3. synchronizacja z prawdziwym stanem
};
```

---

### 7 — Mockowanie HTTP i demo błędu 401

**Co robi:** MSW (Mock Service Worker) przechwytuje żądania HTTP na poziomie przeglądarki bez żadnych zmian w kodzie produkcyjnym. W nagłówku aplikacji (widoczny tylko w trybie deweloperskim) jest toggle switch, który włącza symulację błędu 401 — `ErrorBanner` pojawia się z komunikatem "Invalid API key." dokładnie tak jak przy błędnym kluczu API.

**Pliki:** [`src/mocks/handlers.ts`](src/mocks/handlers.ts) · [`src/mocks/browser.ts`](src/mocks/browser.ts) · [`src/App.tsx`](src/App.tsx)

```ts
// src/App.tsx
const toggle401 = async () => {
  const { worker } = await import('./mocks/browser');

  if (!errorMode) {
    const { http, HttpResponse } = await import('msw');
    worker.use(
      http.get(`${TMDB_BASE}/movie/popular`, () =>
        HttpResponse.json({ status_message: 'Invalid API key.' }, { status: 401 })
      )
    );
  } else {
    worker.resetHandlers(); // usuń handlery — requesty wracają do prawdziwego TMDB
  }

  queryClient.invalidateQueries({ queryKey: ['movies'] });
};
```

MSW startuje przy każdym uruchomieniu dev servera z `onUnhandledRequest: 'bypass'` — bez aktywnych handlerów wszystkie żądania normalnie trafiają do TMDB.

---

### ✨ BONUS — Infinite Scroll

**Co robi:** Kolejne filmy ładują się automatycznie gdy użytkownik doscrolluje do końca listy — bez przycisku "Następna strona". Działa przez `IntersectionObserver`: przeglądarka informuje aplikację gdy niewidoczny element na dole listy wejdzie w pole widzenia.

**Pliki:** [`src/hooks/useInfiniteMovies.ts`](src/hooks/useInfiniteMovies.ts) · [`src/components/InfiniteMovieList.tsx`](src/components/InfiniteMovieList.tsx)

```ts
// src/hooks/useInfiniteMovies.ts
return useInfiniteQuery({
  queryKey: QUERY_KEYS.movies.infinite(query),
  queryFn: async ({ pageParam }) => {
    const { data } = await tmdbClient.get('/movie/popular', { params: { page: pageParam } });
    return data;
  },
  initialPageParam: 1,
  getNextPageParam: (lastPage) =>
    lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
});
```

```tsx
// src/components/InfiniteMovieList.tsx
const sentinelRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage(); // sentinel widoczny → załaduj następną stronę
    }
  }, { threshold: 0.1 });

  if (sentinelRef.current) observer.observe(sentinelRef.current);
  return () => observer.disconnect();
}, [fetchNextPage, hasNextPage, isFetchingNextPage]);

// niewidoczny "czujnik" na samym dole listy
<div ref={sentinelRef} style={{ height: 1 }} />
```

---

### Rick & Morty — zakładka bez klucza API

**Co robi:** Osobna zakładka z listą postaci z serialu Rick & Morty pobieraną z publicznego API — bez żadnego klucza. Służy jako niezależna demonstracja wzorca paginacji i hooków React Query na API, które nie wymaga rejestracji.

**Pliki:** [`src/hooks/useCharacters.ts`](src/hooks/useCharacters.ts) · [`src/components/CharactersList.tsx`](src/components/CharactersList.tsx) · [`src/components/CharacterCard.tsx`](src/components/CharacterCard.tsx)

```ts
// src/hooks/useCharacters.ts — brak tmdbClient, bezpośrednie axios do publicznego endpointu
const RAM_BASE = 'https://rickandmortyapi.com/api';

export function useCharacters(page = 1, name = '') {
  return useQuery({
    queryKey: QUERY_KEYS.characters.page(page),
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (name) params.set('name', name);
      const { data } = await axios.get(`${RAM_BASE}/character?${params}`);
      return data;
    },
    placeholderData: (prev) => prev, // zachowuje poprzednie dane przy zmianie strony
  });
}
```

---

## 🛠 Technologie

| Technologia | Wersja | Zastosowanie |
|---|---|---|
| React | 19 | Budowanie interfejsu użytkownika |
| TypeScript | 6 | Typowanie i bezpieczeństwo kodu |
| Vite | 8 | Dev server i bundler |
| TanStack Query | 5 | Zarządzanie danymi z API, cache |
| Axios | 1 | Klient HTTP |
| MSW | 2 | Mockowanie HTTP w przeglądarce |
