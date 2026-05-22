import { useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInfiniteMovies } from '../hooks/useInfiniteMovies';
import type { Movie } from '../hooks/useFetchMovies';
import { MovieCard } from './MovieCard';
import { SkeletonCard } from './SkeletonCard';
import { ErrorBanner } from './ErrorBanner';
import { EmptyState } from './EmptyState';

interface Props {
  query: string;
  onMovieClick: (id: number) => void;
}

const GRID_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};


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

  const shouldReduce = useReducedMotion();
  const CARD_VARIANTS_ACTIVE = {
    hidden: { opacity: 0, y: shouldReduce ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

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

  const movies: Movie[] = data?.pages.flatMap((p) => p.results) ?? [];

  if (movies.length === 0) return <EmptyState />;

  return (
    <>
      <motion.div
          className="movie-grid"
          variants={GRID_VARIANTS}
          initial="hidden"
          animate="visible"
      >
        {movies.map((movie) => (
            <motion.div key={movie.id} variants={CARD_VARIANTS_ACTIVE}>
              <MovieCard movie={movie} onClick={() => onMovieClick(movie.id)} />
            </motion.div>
        ))}
        {isFetchingNextPage &&
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`sk-${i}`} />)}
      </motion.div>

      {/* Element obserwowany przez IntersectionObserver */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {!hasNextPage && (
        <p className="no-more">Wszystkie filmy zostały załadowane</p>
      )}
    </>
  );
}
