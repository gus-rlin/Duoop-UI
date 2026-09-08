import React from 'react';
import './Skeleton.css';

/** Placeholders are hidden from AT; announce loading once on their containing region. */
export function Skeleton({
  shape = 'text',
  width,
  height,
  className = '',
  style,
  ...props
}) {
  return (
    <span
      {...props}
      aria-hidden="true"
      className={`duoop-skeleton duoop-skeleton--${shape} ${className}`}
      style={{ width, height, ...style }}
    />
  );
}
export function SkeletonText({ lines = 3 }) {
  return (
    <div className="duoop-skeleton-text">
      {Array.from({ length: Math.max(1, Math.min(20, lines)) }, (_, index) => (
        <Skeleton key={index} width={index === lines - 1 ? '65%' : '100%'} />
      ))}
    </div>
  );
}
export function SkeletonCard() {
  return (
    <div className="duoop-skeleton-card" aria-hidden="true">
      <Skeleton shape="card" height={120} />
      <div className="duoop-skeleton-person">
        <Skeleton shape="avatar" />
        <SkeletonText lines={2} />
      </div>
      <SkeletonText />
    </div>
  );
}
export function SkeletonTable({ rows = 4, columns = 3 }) {
  return (
    <div className="duoop-skeleton-table" aria-hidden="true">
      {Array.from({ length: Math.max(1, Math.min(20, rows)) }, (_, row) => (
        <div
          key={row}
          style={{
            gridTemplateColumns: `repeat(${Math.max(1, Math.min(10, columns))}, 1fr)`,
          }}
        >
          {Array.from({ length: Math.max(1, Math.min(10, columns)) }, (_, col) => (
            <Skeleton key={col} width={col === 0 ? '70%' : '85%'} />
          ))}
        </div>
      ))}
    </div>
  );
}
