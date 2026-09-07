import React from 'react';
import './Card.css';

const join = (...values) => values.filter(Boolean).join(' ');

/** A composable surface. Pass href or onClick only when the whole card is one action. */
export function Card({ as, variant = 'outline', size = 'md', radius = 'md', orientation = 'vertical', interactive = false, selected = false, disabled = false, loading = false, href, className = '', children, ...props }) {
  const isInteractive = interactive;
  const Component = href ? 'a' : props.onClick ? 'button' : 'article';
  const handleClick = event => {
    if (disabled || loading) { event.preventDefault(); return; }
    props.onClick?.(event);
  };
  return <Component
    {...props}
    {...(href ? { href } : {})}
    {...(href || props.onClick ? { onClick: handleClick } : {})}
    {...(Component === 'button' ? { type: props.type || 'button', disabled: disabled || loading } : {})}
    className={join('duoop-card', `duoop-card--${variant}`, `duoop-card--${size}`, `duoop-card--radius-${radius}`, `duoop-card--${orientation}`, isInteractive && 'duoop-card--interactive', className)}
    data-selected={selected || undefined}
    data-disabled={disabled || undefined}
    aria-disabled={Component !== 'button' && disabled ? true : undefined}
    aria-busy={loading || undefined}
    tabIndex={Component !== 'button' && disabled ? -1 : props.tabIndex}
  >{loading ? <CardSkeleton /> : children}</Component>;
}

export function CardHeader({ className = '', children, ...props }) { return <header {...props} className={join('duoop-card__header', className)}>{children}</header>; }
export function CardTitle({ as: Component = 'h3', className = '', children, ...props }) { return <Component {...props} className={join('duoop-card__title', className)}>{children}</Component>; }
export function CardDescription({ className = '', children, ...props }) { return <p {...props} className={join('duoop-card__description', className)}>{children}</p>; }
export function CardAction({ className = '', children, ...props }) { return <div {...props} className={join('duoop-card__action', className)}>{children}</div>; }
export function CardMedia({ className = '', children, ...props }) { return <div {...props} className={join('duoop-card__media', className)}>{children}</div>; }
export function CardContent({ className = '', children, ...props }) { return <div {...props} className={join('duoop-card__content', className)}>{children}</div>; }
export const CardPanel = CardContent;
export function CardFooter({ className = '', children, ...props }) { return <footer {...props} className={join('duoop-card__footer', className)}>{children}</footer>; }

export function CardFrame({ className = '', loading = false, children, ...props }) { return <section {...props} className={join('duoop-card-frame', className)} aria-busy={loading || undefined}>{loading ? <CardSkeleton rows={3} /> : children}</section>; }
export function CardFrameHeader({ className = '', children, ...props }) { return <header {...props} className={join('duoop-card-frame__header', className)}>{children}</header>; }
export const CardFrameTitle = CardTitle;
export const CardFrameDescription = CardDescription;
export const CardFrameAction = CardAction;
export function CardFrameFooter({ className = '', children, ...props }) { return <footer {...props} className={join('duoop-card-frame__footer', className)}>{children}</footer>; }

export function CardSkeleton({ rows = 2 }) {
  return <div className="duoop-card__skeleton" role="status"><span className="sr-only">Loading content…</span><i className="skeleton-media" />{Array.from({ length: rows }, (_, index) => <i key={index} className="skeleton-line" />)}</div>;
}
