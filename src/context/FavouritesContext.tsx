import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { Movie } from '../hooks/useFetchMovies';

const STORAGE_KEY = 'movie-browser-favorites';

function load(): Movie[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
  } catch {
    return [];
  }
}

interface FavCtx {
  favourites: Movie[];
  toggleFavourite: (movie: Movie) => void;
  isFavourite: (id: number) => boolean;
  reorderFavourites: (movies: Movie[]) => void;
}

const FavouritesContext = createContext<FavCtx | null>(null);

export function FavouritesProvider({ children }: { children: ReactNode }) {
  const [favourites, setFavourites] = useState<Movie[]>(load);

  const toggleFavourite = useCallback((movie: Movie) => {
    setFavourites((prev) => {
      const next = prev.some((m) => m.id === movie.id)
        ? prev.filter((m) => m.id !== movie.id)
        : [...prev, movie];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isFavourite = useCallback(
    (id: number) => favourites.some((m) => m.id === id),
    [favourites]
  );

  const reorderFavourites = useCallback((movies: Movie[]) => {
    setFavourites(movies);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(movies));
  }, []);

  return (
    <FavouritesContext.Provider value={{ favourites, toggleFavourite, isFavourite, reorderFavourites }}>
      {children}
    </FavouritesContext.Provider>
  );
}

export function useFavourites() {
  const ctx = useContext(FavouritesContext);
  if (!ctx) throw new Error('useFavourites must be used within FavouritesProvider');
  return ctx;
}
