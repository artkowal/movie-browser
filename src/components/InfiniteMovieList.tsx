import { useEffect, useRef } from 'react';
import { useInfiniteMovies } from '../hooks/useInfiniteMovies';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';
import { ErrorBanner } from './ErrorBanner';
import { EmptyState } from './EmptyState';

interface Props {
  query: string;
  onMovieClick: (id: number) => void;
}

export function InfiniteMovieList({ query, onMovieClick }: Props) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteMovies(query);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isError) {
    return <ErrorBanner message={(error as Error).message} onRetry={() => refetch()} />;
  }

  if (isLoading) {
    return (
      <div className="movie-grid">
        {Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  const movies = data?.pages.flatMap((p) => p.results) ?? [];

  if (movies.length === 0) return <EmptyState />;

  return (
    <>
      <div className="movie-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie.id)} />
        ))}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </div>

      {/* Element obserwowany przez IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {!hasNextPage && (
        <p className="no-more">Wszystkie filmy zostały załadowane</p>
      )}
    </>
  );
}
