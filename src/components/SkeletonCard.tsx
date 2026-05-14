export function SkeletonCard() {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <div className="skeleton-img shimmer" />
      <div className="skeleton-title shimmer" />
      <div className="skeleton-meta shimmer" />
    </div>
  );
}
