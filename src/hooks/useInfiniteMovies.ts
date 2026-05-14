import { useInfiniteQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import { ENDPOINTS } from '../api/endpoints';
import { QUERY_KEYS } from '../constants/queryKeys';
import type { Movie } from './useFetchMovies';

interface MoviesPage {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export function useInfiniteMovies(query = '') {
  const isSearch = query.trim().length > 0;

  return useInfiniteQuery({
    queryKey: QUERY_KEYS.movies.infinite(query),
    queryFn: async ({ pageParam }) => {
      const endpoint = isSearch ? ENDPOINTS.movies.search : ENDPOINTS.movies.popular;
      const params: Record<string, string | number> = { page: pageParam };
      if (isSearch) params.query = query;
      const { data } = await tmdbClient.get<MoviesPage>(endpoint, { params });
      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
    enabled: !isSearch || query.trim().length >= 2,
  });
}
