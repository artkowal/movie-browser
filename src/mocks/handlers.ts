import { http, HttpResponse, delay } from 'msw';

const TMDB_BASE = 'https://api.themoviedb.org/3';

const MOCK_MOVIES = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Film testowy ${i + 1}`,
  overview: 'To jest opis testowego filmu wygenerowanego przez MSW Mock Service Worker.',
  poster_path: null,
  release_date: `202${i % 5}-0${(i % 9) + 1}-01`,
  vote_average: parseFloat((6 + (i % 5) * 0.4).toFixed(1)),
  genre_ids: [28, 12],
}));

export const handlers = [
  http.get(`${TMDB_BASE}/movie/popular`, async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    return HttpResponse.json({
      page,
      total_pages: 10,
      total_results: 200,
      results: MOCK_MOVIES.map((m, i) => ({
        ...m,
        id: (page - 1) * 20 + i + 1,
        title: `Film testowy ${(page - 1) * 20 + i + 1}`,
      })),
    });
  }),

  http.get(`${TMDB_BASE}/search/movie`, async ({ request }) => {
    await delay(500);
    const url = new URL(request.url);
    const query = (url.searchParams.get('query') ?? '').toLowerCase();
    const filtered = query
      ? MOCK_MOVIES.filter((m) => m.title.toLowerCase().includes(query))
      : MOCK_MOVIES;
    return HttpResponse.json({
      page: 1,
      total_pages: 1,
      total_results: filtered.length,
      results: filtered,
    });
  }),

  http.get(`${TMDB_BASE}/movie/:id`, async ({ params }) => {
    await delay(600);
    const id = Number(params.id);
    return HttpResponse.json({
      id,
      title: `Film testowy ${id}`,
      overview:
        'Szczegółowy opis testowego filmu wygenerowanego przez MSW. Mock Service Worker przechwytuje żądania na poziomie Service Workera, nie modyfikując kodu produkcyjnego.',
      poster_path: null,
      backdrop_path: null,
      release_date: '2024-03-15',
      vote_average: 7.5,
      vote_count: 1234,
      runtime: 120,
      genres: [
        { id: 28, name: 'Akcja' },
        { id: 12, name: 'Przygodowy' },
      ],
      tagline: 'MSW działa — dane są mockowane!',
    });
  }),
];
