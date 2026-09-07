import React from 'react';
import './Badge.css';

const join = (...values) => values.filter(Boolean).join(' ');

export function Badge({
  appearance = 'soft',
  tone = 'neutral',
  size = 'md',
  shape = 'rounded',
  href,
  onClick,
  disabled = false,
  loading = false,
  className = '',
  leading,
  trailing,
  children,
  ...props
}) {
  const Component = href ? 'a' : onClick ? 'button' : 'span';
  const handleClick = (event) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  return (
    <Component
      {...props}
      role={props.role || (Component === 'span' && props['aria-label'] ? 'img' : undefined)}
      {...(href ? { href } : {})}
      {...(href || onClick ? { onClick: handleClick } : {})}
      {...(Component === 'button'
        ? { type: props.type || 'button', disabled: disabled || loading }
        : {})}
      className={join(
        'duoop-badge',
        `duoop-badge--${appearance}`,
        `duoop-badge--${tone}`,
        `duoop-badge--${size}`,
        `duoop-badge--${shape}`,
        (href || onClick) && 'duoop-badge--interactive',
        className,
      )}
      aria-disabled={Component !== 'button' && (disabled || loading) ? true : undefined}
      aria-busy={loading || undefined}
      data-disabled={disabled || loading || undefined}
      tabIndex={Component === 'a' && (disabled || loading) ? -1 : props.tabIndex}
    >
      {loading ? <span className="duoop-badge__spinner" aria-hidden="true" /> : leading}
      {children && <span className="duoop-badge__label">{children}</span>}
      {trailing}
    </Component>
  );
}

export function RemovableBadge({ onRemove, removeLabel, children, ...props }) {
  return (
    <span className="duoop-badge-group">
      <Badge {...props}>{children}</Badge>
      <button
        type="button"
        className="duoop-badge__remove"
        onClick={onRemove}
        aria-label={removeLabel || `Remove ${children}`}
      >
        ×
      </button>
    </span>
  );
}

export function StatusDot() {
  return <span className="duoop-badge__dot" aria-hidden="true" />;
}
