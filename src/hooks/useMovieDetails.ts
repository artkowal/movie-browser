import { useQuery } from '@tanstack/react-query';
import { tmdbClient } from '../api/tmdbClient';
import { ENDPOINTS } from '../api/endpoints';
import { QUERY_KEYS } from '../constants/queryKeys';

export interface MovieDetails {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number | null;
  genres: { id: number; name: string }[];
  tagline: string;
}

export function useMovieDetails(id: number | null) {
  return useQuery({
    queryKey: QUERY_KEYS.movies.detail(id ?? 0),
    queryFn: async () => {
      const { data } = await tmdbClient.get<MovieDetails>(ENDPOINTS.movies.detail(id!));
      return data;
    },
    enabled: id !== null,
  });
}
