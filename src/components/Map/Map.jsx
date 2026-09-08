import React, { useEffect, useRef, useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { Button } from '../Button/Button';
import './Map.css';

const DEFAULT_CENTER = [40.7484, -73.9857];
function ControlIcon({ kind }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={kind === 'plus' ? 'M5 12h14M12 5v14' : kind === 'minus' ? 'M5 12h14' : 'M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5'} /></svg>;
}

/** A neutral basemap. Center and zoom define the initial and reset view. */
export function Map({ center = DEFAULT_CENTER, zoom = 12, label = 'New York map' }) {
  const host = useRef(null);
  const instance = useRef(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  const [level, setLevel] = useState(zoom);
  const [moving, setMoving] = useState(false);
  const initial = useRef({ center, zoom });
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let disposed = false;
    let map;
    let observer;
    setReady(false);
    setMoving(false);
    setError('');
    Promise.all([import('leaflet'), import('leaflet/dist/leaflet.css')]).then(([module]) => {
      if (disposed) return;
      const L = module.default;
      map = L.map(host.current, { zoomControl: false, scrollWheelZoom: false, minZoom: 3, maxZoom: 19, zoomAnimation: !reduced(), fadeAnimation: !reduced() }).setView(initial.current.center, initial.current.zoom);
      instance.current = map;
      setLevel(map.getZoom());
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>', maxZoom: 19,
      }).on('tileerror', () => { if (!disposed) setError('Map tiles could not load. Check your connection and retry.'); }).addTo(map);
      map.on('zoomend', () => setLevel(map.getZoom()));
      map.on('movestart', () => setMoving(true));
      map.on('moveend', () => setMoving(false));
      observer = new ResizeObserver(() => map.invalidateSize({ pan: true, animate: false }));
      observer.observe(host.current);
      setReady(true);
    }).catch(() => { if (!disposed) setError('The map could not load. Please retry.'); });
    return () => { disposed = true; observer?.disconnect(); map?.remove(); instance.current = null; };
  }, [attempt]);

  return <div className={`duoop-map${moving ? ' is-moving' : ''}`}>
    <div ref={host} className="duoop-map-canvas" role="region" aria-label={label} />
    {!ready && !error && <div className="duoop-map-message" role="status">Loading map…</div>}
    {error && <div className="duoop-map-message" role="alert"><span>{error}</span><Button variant="outline" onClick={() => setAttempt(value => value + 1)}>Retry</Button></div>}
    <div className="duoop-map-compass" aria-hidden="true">
      <svg viewBox="0 0 100 110" fill="none">
        <circle cx="50" cy="59" r="47" fill="#1d1b1b" />
        <circle cx="50" cy="53" r="47" fill="white" stroke="#1d1b1b" strokeWidth="2" />
        <circle cx="50" cy="53" r="38" stroke="#373434" strokeDasharray="2 5" opacity=".35" />
        <text x="50" y="30" textAnchor="middle" fill="#373434" fontSize="12" fontWeight="800">N</text>
        <g className="duoop-map-needle">
          <path d="m50 36 12 34-12-7-12 7Z" fill="#eeeceb" stroke="#1d1b1b" strokeWidth="2" strokeLinejoin="round" />
          <path d="M50 36v27l-12 7Z" fill="#373434" />
        </g>
      </svg>
    </div>
    <div className="duoop-map-readout" aria-live="polite" aria-atomic="true"><span>Zoom</span><strong key={level}>{String(level).padStart(2, '0')}</strong><span className="duoop-map-meter" aria-hidden="true"><i style={{ transform: `scaleX(${(level - 2) / 17})` }} /></span></div>
    <div className="duoop-map-controls" role="group" aria-label={`${label} controls`}>
      <IconButton variant="outline" label="Zoom in" icon={<ControlIcon kind="plus" />} disabled={!ready || level >= 19} onClick={() => instance.current.zoomIn(1, { animate: !reduced() })} />
      <IconButton variant="outline" label="Zoom out" icon={<ControlIcon kind="minus" />} disabled={!ready || level <= 3} onClick={() => instance.current.zoomOut(1, { animate: !reduced() })} />
      <IconButton variant="outline" label="Reset view" icon={<ControlIcon />} disabled={!ready} onClick={() => instance.current.setView(initial.current.center, initial.current.zoom, { animate: !reduced() })} />
    </div>
  </div>;
}
