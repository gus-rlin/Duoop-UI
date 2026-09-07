import React from 'react';

/** Shared stroke language for notification and progress outcomes. */
export function FeedbackIcon({ status = 'info', className = '' }) {
  if (['loading', 'preparing', 'finalizing'].includes(status)) return <span className={`duoop-spinner ${className}`} aria-hidden="true" />;
  return <svg className={`feedback-icon ${status === 'success' ? 'duoop-check' : ''} ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path pathLength="1" d={status === 'success' ? 'm5 12 4 4L19 6' : status === 'error' || status === 'cancelled' ? 'm7 7 10 10M17 7 7 17' : status === 'paused' ? 'M8 5v14M16 5v14' : status === 'file' ? 'M6 3h9l3 3v15H6zM15 3v4h3M9 12h6M9 16h4' : status === 'warning' || status === 'partial' ? 'M12 3 2 21h20L12 3Zm0 6v5m0 3h.01' : 'M12 11v7m0-12h.01'} />
  </svg>;
}
