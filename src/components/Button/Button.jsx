import React, { useState } from 'react';
import './Button.css';
import { buttonColorStyle } from './buttonColor';

/** The caller owns async work and controls status: idle | loading | success | error. */
export function Button({ children, variant = 'solid', size = 'md', className = '',
  type = 'button', href, fullWidth = false, icon, iconPosition = 'left',
  motion = 'tactile', iconMotion = 'none', successLabel = 'Saved',
  status = 'idle', color, style, selected, intent = 'standard', disabled = false, onClick, ...props }) {
  const [activation, setActivation] = useState(0);
  const palette = buttonColorStyle(color);
  const blocked = disabled || status === 'loading' || status === 'success';
  const Element = href !== undefined ? 'a' : 'button';
  const statusLabel = { loading: 'Loading in progress', success: successLabel, error: 'Failed. Retry' }[status];
  const onlyIcon = iconPosition === 'only';
  const renderIcon = () => <span key={activation} className="duoop-button-icon" data-icon-motion={iconMotion} data-activated={activation > 0} aria-hidden="true">{icon}</span>;
  return <Element {...props} data-custom-color={palette ? true : undefined} style={{ ...palette, ...style }}
    {...(href !== undefined ? { href: blocked ? undefined : href, role: 'link', tabIndex: blocked ? -1 : props.tabIndex } : { type, disabled })}
    aria-label={statusLabel || props['aria-label']} aria-disabled={blocked || undefined} aria-busy={status === 'loading' || undefined}
    aria-pressed={href === undefined ? selected : undefined}
    onClick={event => { if (blocked) { event.preventDefault(); return; } setActivation(value => value + 1); onClick?.(event); }}
    data-status={status} data-intent={intent} data-motion={motion}
    className={`duoop-button duoop-button--${variant} duoop-button--${size}${fullWidth ? ' duoop-button--full' : ''}${onlyIcon ? ' duoop-button--icon' : ''} ${className}`.trim()}>
    <span className="duoop-button-content" aria-hidden={status !== 'idle' ? true : undefined}>
      {icon && iconPosition !== 'right' && renderIcon()}
      {!onlyIcon && <span className="duoop-button-label">{children}</span>}
      {icon && iconPosition === 'right' && renderIcon()}
    </span>
    <span className="duoop-button-status" aria-hidden="true">
      {status === 'loading' ? <><span className="duoop-spinner" />{!onlyIcon && <span>Loading…</span>}</> : status === 'success' ? <><svg className="duoop-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path pathLength="1" d="m5 12 4 4L19 6" /></svg>{!onlyIcon && <span>{successLabel}</span>}</> : status === 'error' ? <><span>↻</span>{!onlyIcon && <span>Retry</span>}</> : null}
    </span>
    {!onlyIcon && <span className="duoop-button-reserve" aria-hidden="true"><span>◯ Loading…</span><span>✓ {successLabel}</span><span>↻ Retry</span></span>}
    <span className="duoop-sr-only" role="status">{statusLabel}</span>
  </Element>;
}

/** Local outcomes are announced only when supplied by the action owner. */
export function ActionFeedback({ children, tone = 'success', className = '', replayKey = 0 }) {
  return <div className={`action-feedback ${className}`} data-tone={tone} role="status">{children && <div className="action-feedback-content" key={`${replayKey}-${String(children)}`}><svg viewBox="0 0 32 32" fill="none" aria-hidden="true"><circle className="feedback-orbit" cx="16" cy="16" r="13" pathLength="1" /><path className="feedback-symbol" pathLength="1" d={tone === 'success' ? 'm10 16 4 4 8-9' : 'M16 9v9m0 5h.01'} /></svg><span>{children}</span></div>}</div>;
}

