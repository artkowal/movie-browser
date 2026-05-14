export const ENDPOINTS = {
  movies: {
    popular: '/movie/popular',
    search: '/search/movie',
    detail: (id: number) => `/movie/${id}`,
  },
  genres: {
    list: '/genre/movie/list',
  },
} as const;
