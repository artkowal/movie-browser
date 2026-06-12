import { useState } from 'react';
import { AnimatePresence, motion, Reorder, useDragControls, type Variants } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { CharactersList } from './components/CharactersList';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { EmptyState } from './components/EmptyState';
import { InfiniteMovieList } from './components/InfiniteMovieList';
import { ToastContainer } from './components/ToastContainer';
import { useDebounce } from './hooks/useDebounce';
import { useFavourites } from './hooks/useFavourites';
import type { Movie } from './hooks/useFetchMovies';
import { trackEvent, trackPageview } from './analytics';

type Tab = 'movies' | 'favourites' | 'characters';

interface FavouriteItemProps {
  movie: Movie;
  onCardClick: () => void;
}

function FavouriteItem({ movie, onCardClick }: FavouriteItemProps) {
  const dragControls = useDragControls();
  return (
    <Reorder.Item
      value={movie}
      dragControls={dragControls}
      dragListener={false}
      className="fav-item"
    >
      <span
        className="fav-drag-handle"
        onPointerDown={(e) => dragControls.start(e)}
        title="Przeciągnij aby zmienić kolejność"
      >
        ≡
      </span>
      <MovieCard movie={movie} onClick={onCardClick} />
    </Reorder.Item>
  );
}

const PAGE_VARIANTS: Variants = {
  initial: { opacity: 0, x: -16 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.28, ease: 'easeOut' } },
  exit:    { opacity: 0, x: 16,  transition: { duration: 0.18, ease: 'easeIn' } },
};

function App() {
  const [tab, setTab] = useState<Tab>('movies');
  const [query, setQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [errorMode, setErrorMode] = useState(false);

  const queryClient = useQueryClient();
  const debouncedQuery = useDebounce(query, 300);
  const { favourites, reorderFavourites } = useFavourites();

  // Zmiana zakładki = pageview + wykrywanie porzucenia wyszukiwania
  const handleTabChange = (newTab: Tab) => {
    // RODO: śledzimy fakt porzucenia wyszukiwania, nie jego treść (zasada minimalizacji danych)
    if (query.trim() && newTab !== 'movies') {
      trackEvent('Search Abandoned');
    }
    // Ręczny pageview — app używa tab-based navigation zamiast React Router
    trackPageview('/' + newTab);
    setTab(newTab);
  };

  // RODO: movie_id to publiczne ID z API TMDB — nie jest danymi osobowymi
  const handleMovieOpen = (id: number) => {
    trackEvent('Movie CTA Click', { movie_id: String(id) });
    setSelectedMovieId(id);
  };

  const toggle401 = async () => {
    const { worker } = await import('./mocks/browser');
    if (!errorMode) {
      const { http, HttpResponse } = await import('msw');
      const tmdbBase = import.meta.env.VITE_TMDB_BASE_URL;
      worker.use(
        http.get(`${tmdbBase}/movie/popular`, () =>
          HttpResponse.json({ status_message: 'Invalid API key.' }, { status: 401 })
        ),
        http.get(`${tmdbBase}/search/movie`, () =>
          HttpResponse.json({ status_message: 'Invalid API key.' }, { status: 401 })
        )
      );
    } else {
      worker.resetHandlers();
    }
    setErrorMode((v) => !v);
    queryClient.invalidateQueries({ queryKey: ['movies'] });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">🎬 Movie Browser</h1>
        <nav className="tabs">
          <button
            className={`tab-btn ${tab === 'movies' ? 'active' : ''}`}
            onClick={() => handleTabChange('movies')}
          >
            Filmy
          </button>
          <button
            className={`tab-btn ${tab === 'favourites' ? 'active' : ''}`}
            onClick={() => handleTabChange('favourites')}
          >
            Ulubione ({favourites.length})
          </button>
          <button
            className={`tab-btn ${tab === 'characters' ? 'active' : ''}`}
            onClick={() => handleTabChange('characters')}
          >
            Rick &amp; Morty
          </button>
        </nav>
        {import.meta.env.DEV && (
          <label className="error-toggle" title="MSW: symuluje odpowiedź 401 Invalid API key">
            <input type="checkbox" checked={errorMode} onChange={toggle401} />
            <span className="toggle-track" />
            <span className="toggle-label">Symuluj błąd 401</span>
          </label>
        )}
      </header>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          variants={PAGE_VARIANTS}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {tab === 'movies' && (
            <div className="movie-browser">
              <div className="search-bar">
                <input
                  type="search"
                  placeholder="Szukaj filmów... (min. 2 znaki)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="search-input"
                />
              </div>
              <InfiniteMovieList
                query={debouncedQuery}
                onMovieClick={handleMovieOpen}
              />
            </div>
          )}

          {tab === 'favourites' && (
            <div className="movie-browser">
              {favourites.length === 0 ? (
                <EmptyState />
              ) : (
                <Reorder.Group
                  as="div"
                  axis="y"
                  values={favourites}
                  onReorder={reorderFavourites}
                  className="fav-list"
                >
                  {favourites.map((movie) => (
                    <FavouriteItem
                      key={movie.id}
                      movie={movie}
                      onCardClick={() => handleMovieOpen(movie.id)}
                    />
                  ))}
                </Reorder.Group>
              )}
            </div>
          )}

          {tab === 'characters' && <CharactersList />}
        </motion.div>
      </AnimatePresence>

      {selectedMovieId !== null && (
        <MovieModal
          movieId={selectedMovieId}
          onClose={() => setSelectedMovieId(null)}
        />
      )}
      <ToastContainer />
    </div>
  );
}

export default App;
