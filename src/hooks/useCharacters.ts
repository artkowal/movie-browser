import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { QUERY_KEYS } from '../constants/queryKeys';

const RAM_BASE = 'https://rickandmortyapi.com/api';

interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  image: string;
}

interface RamResponse {
  info: { count: number; pages: number; next: string | null };
  results: Character[];
}

export function useCharacters(page = 1, name = '') {
  return useQuery({
    queryKey: QUERY_KEYS.characters.page(page),
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page) });
      if (name) params.set('name', name);
      const { data } = await axios.get<RamResponse>(
        `${RAM_BASE}/character?${params}`
      );
      return data;
    },
    placeholderData: (prev) => prev,  // zachowuje poprzednie dane przy zmianie strony
  });
}