export const QUERY_KEYS = {
  movies: {
    all:     () => ['movies'] as const,
    popular: (page: number) => ['movies', 'popular', page] as const,
    search:  (query: string, page: number) => ['movies', 'search', query, page] as const,
    detail:   (id: number) => ['movies', 'detail', id] as const,
    infinite: (query: string) => ['movies', 'infinite', query] as const,
  },
  genres: {
    all: () => ['genres'] as const,
  },
  // Rick & Morty (warm-up)
  characters: {
    all:  () => ['characters'] as const,
    page: (page: number) => ['characters', page] as const,
  },
} as const;