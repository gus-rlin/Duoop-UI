import React from 'react';
import { Map } from './Map';

export const mapExamples = [['New York', 'Map']];
export function MapDemo() {
  return <section className="map-experience" aria-label="New York city map">
    <div className="map-atlas">
      <header className="map-atlas-heading"><div><span className="map-eyebrow">THE CITY AT YOUR FINGERTIPS / 01</span><h3>New York<span>.</span></h3></div><span className="map-coordinates"><b>UNITED STATES</b>40.7484° N<br />73.9857° W</span></header>
      <Map />
      <footer className="map-atlas-footer"><span>Explore at your own pace.</span><span>Drag to pan <i aria-hidden="true">/</i> + − to zoom</span></footer>
    </div>
  </section>;
}

export function MapPreview() {
  return <span className="mini-map" aria-hidden="true">
    <svg viewBox="0 0 250 170" fill="none">
      <path d="M0 0h250v170H0z" fill="#f0eeee" />
      <path d="M0 44h250v104H0z" fill="#d9dcdb" />
      <path d="M0 44h70l34 104H0zM143 44h24l-48 104H95zM212 44h38v104h-86z" fill="#efede8" />
      <path d="m153 44-48 104m60-104-48 104M0 68l79-8M0 95l89-9M0 125l99-10M204 65l46 10M190 96l60 14M177 126l73 15M131 78l30 14M118 107l29 14" stroke="white" strokeWidth="3" />
      <path d="M0 44h250M0 148h250" stroke="#1d1b1b" strokeWidth="1.5" />
      <text x="14" y="29" fill="#373434" fontSize="23" fontWeight="800" letterSpacing="-1">NEW YORK.</text>
      <text x="236" y="20" textAnchor="end" fill="#686565" fontSize="6" fontWeight="600">UNITED</text>
      <text x="236" y="29" textAnchor="end" fill="#686565" fontSize="6" fontWeight="600">STATES</text>
      <g transform="translate(12 99) scale(.42)">
        <circle cx="50" cy="59" r="47" fill="#1d1b1b" />
        <circle cx="50" cy="53" r="47" fill="white" stroke="#1d1b1b" strokeWidth="3" />
        <circle cx="50" cy="53" r="38" stroke="#373434" strokeDasharray="2 5" opacity=".35" />
        <text x="50" y="30" textAnchor="middle" fill="#373434" fontSize="12" fontWeight="800">N</text>
        <path d="m50 36 12 34-12-7-12 7Z" fill="#eeeceb" stroke="#1d1b1b" strokeWidth="2" strokeLinejoin="round" />
        <path d="M50 36v27l-12 7Z" fill="#373434" />
      </g>
      <g stroke="#1d1b1b" strokeWidth="1.5">
        <rect x="216" y="57" width="22" height="23" rx="5" fill="#1d1b1b" />
        <rect x="216" y="55" width="22" height="22" rx="5" fill="white" />
        <path d="M222 66h10m-5-5v10" />
        <rect x="216" y="86" width="22" height="23" rx="5" fill="#1d1b1b" />
        <rect x="216" y="84" width="22" height="22" rx="5" fill="white" />
        <path d="M222 95h10" />
        <rect x="185" y="117" width="53" height="25" rx="5" fill="#1d1b1b" />
        <rect x="185" y="115" width="53" height="24" rx="5" fill="white" />
      </g>
      <text x="192" y="126" fill="#373434" fontSize="5" fontWeight="700">ZOOM</text>
      <text x="231" y="127" textAnchor="end" fill="#373434" fontSize="10" fontWeight="800">12</text>
      <path d="M192 132h38" stroke="#e6e2e2" strokeWidth="2" />
      <path d="M192 132h23" stroke="#373434" strokeWidth="2" />
      <path d="M0 149h250v21H0z" fill="white" />
      <text x="14" y="162" fill="#686565" fontSize="7">Explore at your own pace.</text>
    </svg>
  </span>;
}
