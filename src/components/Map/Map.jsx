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
  const initial = useRef({ center, zoom });
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let disposed = false;
    let map;
    let observer;
    setReady(false);
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
      observer = new ResizeObserver(() => map.invalidateSize({ pan: true, animate: false }));
      observer.observe(host.current);
      setReady(true);
    }).catch(() => { if (!disposed) setError('The map could not load. Please retry.'); });
    return () => { disposed = true; observer?.disconnect(); map?.remove(); instance.current = null; };
  }, [attempt]);

  return <div className="duoop-map">
    <div ref={host} className="duoop-map-canvas" role="region" aria-label={label} />
    {!ready && !error && <div className="duoop-map-message" role="status">Loading map…</div>}
    {error && <div className="duoop-map-message" role="alert"><span>{error}</span><Button variant="outline" onClick={() => setAttempt(value => value + 1)}>Retry</Button></div>}
    <div className="duoop-map-controls" role="group" aria-label={`${label} controls`}>
      <IconButton variant="outline" label="Zoom in" icon={<ControlIcon kind="plus" />} disabled={!ready || level >= 19} onClick={() => instance.current.zoomIn(1, { animate: !reduced() })} />
      <IconButton variant="outline" label="Zoom out" icon={<ControlIcon kind="minus" />} disabled={!ready || level <= 3} onClick={() => instance.current.zoomOut(1, { animate: !reduced() })} />
      <IconButton variant="outline" label="Reset view" icon={<ControlIcon />} disabled={!ready} onClick={() => instance.current.setView(initial.current.center, initial.current.zoom, { animate: !reduced() })} />
    </div>
  </div>;
}
