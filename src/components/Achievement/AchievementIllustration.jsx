import React from 'react';

/** A single vector drawing: curved bowl, inset handles and connected laurel branches. */
export function AchievementIllustration({ concealed = false }) {
  const leaves = <g strokeWidth="1.5">
    <path d="M59 125C39 111 27 90 29 64" fill="none" />
    <path d="M29 76C20 73 18 63 22 55c8 5 11 13 7 21Z" />
    <path d="M30 85c-10-1-17-8-18-17 11 1 17 7 18 17Z" />
    <path d="M34 95c-1-10 3-18 11-22 3 10-1 18-11 22Z" />
    <path d="M40 106c-12 0-20-5-24-14 12-1 20 4 24 14Z" />
    <path d="M48 115c-4-9-2-19 5-25 5 10 3 18-5 25Z" />
    <path d="M58 124c-12 2-22-1-28-9 12-4 21 0 28 9Z" />
  </g>;
  return <svg className="achievement-trophy-art" viewBox="0 0 200 160" fill="none" aria-hidden="true">
    <g className="achievement-ribbon">{leaves}<g transform="translate(200 0) scale(-1 1)">{leaves}</g></g>
    <g strokeWidth="2">
      <path className="achievement-ribbon" d="M72 42H53c-5 0-7 3-7 8 0 18 12 30 34 33l-3-9C62 71 54 62 54 50h19m55-8h19c5 0 7 3 7 8 0 18-12 30-34 33l3-9c15-3 23-12 23-24h-19" />
      <path className="achievement-ribbon" d="M95 96v16c0 7-4 10-12 12h34c-8-2-12-5-12-12V96Z" />
      <path className="achievement-medal-face" d="M68 31c2 39 11 65 32 68 21-3 30-29 32-68Z" />
      <path className="achievement-trophy-shade" d="M119 34c-2 32-8 53-22 64 23 2 33-29 35-67Z" stroke="none" />
      <path d="M68 31c2 39 11 65 32 68 21-3 30-29 32-68" />
      <rect className="achievement-medal-face" x="65" y="25" width="70" height="11" rx="5.5" />
      <path d="M76 46c1 12 4 23 8 30" strokeWidth="1.5" />
      {concealed ? <path d="M95 55a5 5 0 1 1 8 4c-3 2-3 3-3 5m0 5h.01" /> : <path className="achievement-ribbon" d="m100 51 3.4 6.8 7.6 1.1-5.5 5.3 1.3 7.5-6.8-3.5-6.8 3.5 1.3-7.5-5.5-5.3 7.6-1.1Z" strokeWidth="1.6" />}
      <rect className="achievement-svg-shadow" x="72" y="132" width="56" height="10" rx="3" />
      <rect className="achievement-ribbon" x="80" y="123" width="40" height="9" rx="2" />
      <rect className="achievement-medal-face" x="72" y="130" width="56" height="9" rx="2.5" />
      <path d="M91 134.5h18" strokeWidth="1.4" />
    </g>
  </svg>;
}
