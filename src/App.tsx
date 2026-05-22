import { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { CharactersList } from './components/CharactersList';
import { MovieCard } from './components/MovieCard';
import { MovieModal } from './components/MovieModal';
import { EmptyState } from './components/EmptyState';
import { InfiniteMovieList } from './components/InfiniteMovieList';
import { useDebounce } from './hooks/useDebounce';
import { useFavourites } from './hooks/useFavourites';

type Tab = 'movies' | 'favourites' | 'characters';

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
  const { favourites } = useFavourites();

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
            onClick={() => setTab('movies')}
          >
            Filmy
          </button>
          <button
            className={`tab-btn ${tab === 'favourites' ? 'active' : ''}`}
            onClick={() => setTab('favourites')}
          >
            Ulubione ({favourites.length})
          </button>
          <button
            className={`tab-btn ${tab === 'characters' ? 'active' : ''}`}
            onClick={() => setTab('characters')}
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
                onMovieClick={(id) => setSelectedMovieId(id)}
              />
            </div>
          )}

          {tab === 'favourites' && (
            <div className="movie-browser">
              {favourites.length === 0 ? (
                <EmptyState />
              ) : (
                <div className="movie-grid">
                  {favourites.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onClick={() => setSelectedMovieId(movie.id)}
                    />
                  ))}
                </div>
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
    </div>
  );
}

export default App;
