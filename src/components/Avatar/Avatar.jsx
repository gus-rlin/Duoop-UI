import React, { useLayoutEffect, useRef, useState } from 'react';
import './Avatar.css';

/** Image state is scoped to its source, so changing profiles never exposes a stale portrait. */
function Portrait({ src, name, fallback, loading }) {
  const [state, setState] = useState('loading');
  const image = useRef(null);
  useLayoutEffect(() => {
    if (image.current?.complete && image.current.naturalWidth > 0) setState('cached');
  }, []);
  return <>
    <span className="duoop-avatar__fallback" dir="auto" aria-hidden="true">{fallback || name.trim().split(/\s+/u).slice(0, 2).map(word => Array.from(word)[0]).join('').toLocaleUpperCase() || '?'}</span>
    {src && <img ref={image} src={src} alt="" loading={loading} decoding="async" data-loaded={state === 'loaded' || state === 'cached'} data-cached={state === 'cached'} onLoad={() => setState(current => current === 'cached' ? current : 'loaded')} onError={() => setState('error')} />}
  </>;
}

export function Avatar({ name = 'Guest', src, fallback, size = 'md', status, loading = 'eager', className = '', ...props }) {
  return <span {...props} className={`duoop-avatar duoop-avatar--${size} ${className}`} role="img" aria-label={`${name}${status ? ` · ${status}` : ''}`}>
    <span className="duoop-avatar__face"><Portrait key={src || 'fallback'} src={src} name={name} fallback={fallback} loading={loading} /></span>
    {status && <span className="duoop-avatar__status" data-status={status} aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={status === 'online' ? 'm4 8 3 3 5-6' : status === 'busy' ? 'M4 8h8' : 'M8 4v4l3 2'} /></svg></span>}
  </span>;
}

export function AvatarGroup({ children, label = 'Team members', className = '', ...props }) {
  return <span {...props} role="group" aria-label={label} className={`duoop-avatar-group ${className}`}>{children}</span>;
}
