import React from 'react';
import './BentoGrid.css';

/** Content order is also reading order. Spans collapse within narrow containers. */
export function BentoGrid({ children, label = 'Bento grid', className = '', ...props }) {
  return <section {...props} aria-label={label} className={`duoop-bento ${className}`}><div className="duoop-bento__grid">{children}</div></section>;
}

export function BentoItem({ children, span = 'single', tone = 'default', className = '', ...props }) {
  return <article {...props} className={`duoop-bento__item duoop-bento__item--${span} duoop-bento__item--${tone} ${className}`}>{children}</article>;
}
