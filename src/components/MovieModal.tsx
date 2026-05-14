import { useMovieDetails } from '../hooks/useMovieDetails';
import { useFavourites } from '../hooks/useFavourites';
import type { Movie } from '../hooks/useFetchMovies';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

interface Props {
  movieId: number;
  onClose: () => void;
}

export function MovieModal({ movieId, onClose }: Props) {
  const { data, isLoading, isError } = useMovieDetails(movieId);
  const { isFavourite, toggleFavourite } = useFavourites();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleFavToggle = () => {
    if (!data) return;
    const movie: Movie = {
      id: data.id,
      title: data.title,
      overview: data.overview,
      poster_path: data.poster_path,
      release_date: data.release_date,
      vote_average: data.vote_average,
      genre_ids: data.genres.map((g) => g.id),
    };
    toggleFavourite(movie);
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-content" role="dialog" aria-modal="true">
        <button className="modal-close" onClick={onClose} aria-label="Zamknij">
          ✕
        </button>

        {isLoading && <div className="modal-loading">Ładowanie...</div>}
        {isError && <div className="modal-error">Błąd pobierania szczegółów</div>}

        {data && (
          <div className="modal-body">
            <div className="modal-poster">
              {data.poster_path ? (
                <img src={`${IMG_BASE}${data.poster_path}`} alt={data.title} />
              ) : (
                <div className="no-poster large">🎬</div>
              )}
            </div>
            <div className="modal-info">
              <h2>{data.title}</h2>
              {data.tagline && <p className="tagline">{data.tagline}</p>}
              <div className="movie-meta">
                <span>{data.release_date?.slice(0, 4)}</span>
                {data.runtime && <span>{data.runtime} min</span>}
                <span>⭐ {data.vote_average.toFixed(1)}</span>
                <span>{data.vote_count.toLocaleString()} ocen</span>
              </div>
              {data.genres.length > 0 && (
                <div className="genres">
                  {data.genres.map((g) => (
                    <span key={g.id} className="genre-tag">
                      {g.name}
                    </span>
                  ))}
                </div>
              )}
              <p className="overview">{data.overview}</p>
              <button
                className={`fav-btn modal-fav-btn ${isFavourite(data.id) ? 'active' : ''}`}
                onClick={handleFavToggle}
              >
                {isFavourite(data.id) ? '❤️ W ulubionych' : '🤍 Dodaj do ulubionych'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
