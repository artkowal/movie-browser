import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import { ENDPOINTS } from '../api/endpoints';
import { QUERY_KEYS } from '../constants/queryKeys';

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function useFetchMovies(page = 1, query = '') {
  const isSearch = query.trim().length > 0;

  return useQuery({
    queryKey: isSearch
      ? QUERY_KEYS.movies.search(query, page)
      : QUERY_KEYS.movies.popular(page),
    queryFn: async () => {
      const endpoint = isSearch ? ENDPOINTS.movies.search : ENDPOINTS.movies.popular;
      const params: Record<string, string | number> = { page };
      if (isSearch) params.query = query;
      const { data } = await tmdbClient.get<MoviesResponse>(endpoint, { params });
      return data;
    },
    enabled: !isSearch || query.trim().length >= 2,
    placeholderData: (prev) => prev,
    staleTime: 1000 * 60 * 3,
  });
}
