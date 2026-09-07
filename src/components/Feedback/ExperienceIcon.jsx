import React from 'react';
import { FeedbackIcon } from './FeedbackIcon';

/** The catalogue's 24px stroke family, extended for journeys and rewards. */
export function ExperienceIcon({ name = 'trophy', filled = false, ...props }) {
  if (['success', 'error', 'loading', 'file', 'info'].includes(name)) return <FeedbackIcon status={name} />;
  const paths = {
    heart: 'M20.8 4.8a5.5 5.5 0 0 0-7.8 0L12 5.9l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.4a5.5 5.5 0 0 0 0-7.8Z',
    star: 'm12 3 2.8 5.7 6.3.9-4.6 4.5 1.1 6.3L12 17.4l-5.6 3 1.1-6.3L3 9.6l6.2-.9L12 3Z',
    clap: 'm8 12 4-7a1.5 1.5 0 0 1 2.6 1.5l-2.2 3.8 3.3-5.7a1.5 1.5 0 0 1 2.6 1.5l-3.2 5.6 3.5-4.2a1.5 1.5 0 0 1 2.3 1.9l-6 8.2c-2.8 3.8-6.9 3.5-9.1.8L3 15a1.5 1.5 0 0 1 2.2-2l2 1.7M4 4l1 2M8 2v2M2 8l2 1',
    trophy: 'M7 3h10v6a5 5 0 0 1-10 0V3Zm10 2h4v2a5 5 0 0 1-5 5M7 5H3v2a5 5 0 0 0 5 5m4 2v5m-4 2h8m-7-2h6',
    lock: 'M6 10h12v11H6V10Zm2 0V7a4 4 0 0 1 8 0v3m-4 5v2',
    person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-2a8 8 0 0 1 16 0v2',
    team: 'M14 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM4 21v-3a7 7 0 0 1 14 0v3m0-17a3 3 0 0 1 0 6m3 10v-2a7 7 0 0 0-3-6',
    gift: 'M3 8h18v5H3V8Zm2 5v8h14v-8M12 8v13m0-13C4 9 4 2 8 3c2 0 4 5 4 5Zm0 0c8 1 8-6 4-5-2 0-4 5-4 5Z',
    flame: 'M12 2c2 5 6 6 6 11a6 6 0 0 1-12 0c0-3 2-5 4-7 0 3 1 4 2 4V2Zm0 11c-3 3-3 6 0 7 3-1 3-3 0-7Z',
    clock: 'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-5v6l4 2',
    plus: 'M12 5v14M5 12h14',
    minus: 'M5 12h14',
    arrow: 'M5 12h14m-6-6 6 6-6 6',
    spark: 'm12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z',
    hidden: 'M8 8a4 4 0 1 1 6 3.5c-2 1-2 1.5-2 3.5m0 4h.01',
    bulb: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 .8-1 2-1 2H9s0-1.2-1-2ZM12 2V1M3 5 2 4m19 1 1-1',
    celebrate: 'm4 10-2 12 12-4L4 10Zm0 0 10 8M9 7l1-3m4 6 4-4m-1 9 4-1M14 2l2 1m5 6 1 2',
    thanks: 'M12 20V9m0 0L9 3 5 12l-2 5 5 4 4-1Zm0 0 3-6 4 9 2 5-5 4-4-1Z',
    more: 'M5 12h.01M12 12h.01M19 12h.01',
  };
  return <svg {...props} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.trophy} /></svg>;
}
