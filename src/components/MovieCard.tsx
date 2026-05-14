import { useState, useCallback } from 'react';
import { useFavourites } from '../hooks/useFavourites';
import type { Movie } from '../hooks/useFetchMovies';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props {
  movie: Movie;
  onClick: () => void;
}

export function MovieCard({ movie, onClick }: Props) {
  const { isFavourite, toggleFavourite } = useFavourites();
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);

  const displayedFav = optimisticFav ?? isFavourite(movie.id);

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setOptimisticFav(!displayedFav);
      toggleFavourite(movie);
      setOptimisticFav(null);
    },
    [displayedFav, toggleFavourite, movie]
  );

  return (
    <div className="movie-card" onClick={onClick}>
      {movie.poster_path ? (
        <img
          src={`${IMG_BASE}${movie.poster_path}`}
          alt={movie.title}
          loading="lazy"
        />
      ) : (
        <div className="no-poster">🎬</div>
      )}
      <div className="card-info">
        <h3>{movie.title}</h3>
        <p className="card-meta">
          {movie.release_date?.slice(0, 4)} · ⭐ {movie.vote_average.toFixed(1)}
        </p>
      </div>
      <button
        className={`fav-btn ${displayedFav ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label={displayedFav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
      >
        {displayedFav ? '❤️' : '🤍'}
      </button>
    </div>
  );
}
