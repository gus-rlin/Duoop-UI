import React from 'react';
import { Map } from './Map';

export const mapExamples = [['New York', 'Map']];
export function MapDemo() {
  return <section className="map-experience" aria-label="New York city map">
    <div className="map-atlas">
      <header className="map-atlas-heading"><div><span className="map-eyebrow">UNITED STATES / 01</span><h3>New York<span>.</span></h3></div><span className="map-coordinates">40.7484° N<br />73.9857° W</span></header>
      <Map />
      <footer className="map-atlas-footer"><span>Explore at your own pace.</span><span>Drag to pan <i aria-hidden="true">/</i> + − to zoom</span></footer>
    </div>
  </section>;
}

export function MapPreview() {
  return <span className="mini-map"><svg viewBox="0 0 250 150" fill="none"><path d="M0 0h250v150H0z" fill="#d9dcdb" /><path d="M0 0h70l48 150H0zM143 0h34L108 150H77zM212 0h38v150H142z" fill="#efede8" /><path d="m155 0-66 150M166 0l-67 150M0 35l82-8M0 68l93-9M0 101l102-10M201 28l49 10M187 60l63 14M173 94l77 17M125 39l39 17M111 69l39 17M99 99l37 16" stroke="white" strokeWidth="4" /></svg><b>New York.</b><small>40.75° N / 73.99° W</small></span>;
}
