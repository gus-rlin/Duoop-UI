import React from 'react';
import { Button } from '../Button/Button';
import './Pagination.css';

export function Pagination({
  page = 1,
  pageCount = 1,
  onPageChange,
  disabled = false,
  label = 'Pagination',
  className = '',
}) {
  const count = Number.isFinite(pageCount) ? Math.max(1, Math.floor(pageCount)) : 1;
  const current = Math.min(count, Math.max(1, Math.floor(page) || 1));
  const candidates = [...new Set([1, current - 1, current, current + 1, count])]
    .filter((n) => n >= 1 && n <= count)
    .sort((a, b) => a - b);
  const pages = [];
  candidates.forEach((n, index) => {
    if (index && n - candidates[index - 1] > 1) pages.push(`gap-${n}`);
    pages.push(n);
  });
  const go = (next) => {
    if (!disabled && next !== current) onPageChange?.(next);
  };
  return (
    <nav className={`duoop-pagination ${className}`} aria-label={label}>
      <Button
        variant="outline"
        size="sm"
        aria-label="Previous page"
        disabled={disabled || current === 1}
        onClick={() => go(current - 1)}
        iconPosition="only"
        icon={<Chevron reverse />}
      />
      <span className="duoop-pagination__pages">
        {pages.map((n) =>
          typeof n === 'string' ? (
            <span key={n} className="duoop-pagination__gap" aria-hidden="true">
              …
            </span>
          ) : (
            <Button
              key={n}
              variant={n === current ? 'solid' : 'outline'}
              size="sm"
              aria-label={`Page ${n}`}
              aria-current={n === current ? 'page' : undefined}
              disabled={disabled}
              onClick={() => go(n)}
            >
              {n}
            </Button>
          ),
        )}
      </span>
      <span className="duoop-pagination__compact" aria-live="polite">
        {current} / {count}
      </span>
      <Button
        variant="outline"
        size="sm"
        aria-label="Next page"
        disabled={disabled || current === count}
        onClick={() => go(current + 1)}
        iconPosition="only"
        icon={<Chevron />}
      />
    </nav>
  );
}
function Chevron({ reverse }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d={reverse ? 'm12 5-5 5 5 5' : 'm8 5 5 5-5 5'} />
    </svg>
  );
}
