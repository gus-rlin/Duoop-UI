import React, { useEffect, useRef, useState } from 'react';
import './ResetLimit.css';

function ResetMark() {
  return <path d="M11 17a16 16 0 1 1-2 16M11 7v10h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />;
}

export function ResetIcon() {
  return <svg viewBox="0 0 48 48" fill="none" aria-hidden="true"><ResetMark /></svg>;
}

function ResetSculpture() {
  return <svg className="reset-limit__sculpture" viewBox="0 0 320 248" aria-hidden="true">
    <path className="reset-limit__plinth-edge" d="M22 177v8a138 58 0 0 0 276 0v-8Z" />
    <ellipse className="reset-limit__plinth" cx="160" cy="177" rx="138" ry="58" />
    <ellipse className="reset-limit__socket" cx="160" cy="173" rx="117" ry="48" />
    <g className="reset-limit__barrel">
      <path className="reset-limit__wall" d="M50 100h220v55c0 31-49 57-110 57S50 186 50 155Z" />
      <path className="reset-limit__shade" d="M234 100h36v55c0 20-19 38-48 48 8-11 12-23 12-37Z" />
      <path className="reset-limit__wall-line" d="M50 100v55c0 31 49 57 110 57s110-26 110-57v-55" />
    </g>
    <g className="reset-limit__cap">
      <ellipse className="reset-limit__cap-rim" cx="160" cy="106" rx="114" ry="64" />
      <ellipse className="reset-limit__cap-top" cx="160" cy="96" rx="114" ry="64" />
      <path className="reset-limit__shine" d="M77 68c18-15 44-23 71-25" />
      <ellipse className="reset-limit__focus" cx="160" cy="96" rx="103" ry="54" />
      {/* A gentle optical correction keeps the lettering legible on the tilted face. */}
      <g transform="translate(160 96) scale(1 .72) translate(-160 -96)">
        <g transform="translate(142 53) scale(.75)">
          <g className="reset-limit__icon"><ResetMark /></g>
        </g>
        <text x="160" y="128" textAnchor="middle">Reset Limit</text>
      </g>
    </g>
  </svg>;
}

// A local, replayable joke. This component never calls an account or usage API.
export function ResetLimit({ theme = 'light', disabled = false }) {
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState('idle');
  const timer = useRef(null);
  const root = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  function reset() {
    clearTimeout(timer.current);
    root.current.getAnimations({ subtree: true }).forEach(animation => { animation.currentTime = 0; });
    setRun(value => value + 1);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase('done');
      return;
    }
    setPhase('resetting');
    timer.current = setTimeout(() => setPhase('done'), 1250);
  }

  return <div ref={root} className="reset-limit" data-theme={theme} data-phase={phase} data-disabled={disabled}>
    <div className="reset-limit__meter">
      <div className="reset-limit__readout"><span>Demo usage</span><strong>{phase === 'idle' ? '100%' : phase === 'resetting' ? 'Resetting…' : '0%'}</strong></div>
      <div className="reset-limit__track" aria-hidden="true"><span key={run} /></div>
    </div>
    <div className="reset-limit__mechanism">
      <span className="reset-limit__burst" aria-hidden="true">{Array.from({ length: 8 }, (_, index) => <i key={index} style={{ '--angle': `${index * 45}deg` }} />)}</span>
      <button className="reset-limit__button" type="button" aria-label="Reset Limit" disabled={disabled} onClick={reset}>
        <ResetSculpture />
      </button>
    </div>
    <div className="reset-limit__status" role="status" aria-live="polite">
      <strong>{phase === 'done' && !disabled && <svg className="reset-limit__check" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="m4 10 4 4 8-8" pathLength="1" /></svg>}{disabled ? 'Reset unavailable' : phase === 'done' ? 'Demo usage reset' : phase === 'resetting' ? 'Resetting demo usage…' : 'Press to reset'}</strong>
      <span>Interactive demo. No account connected.</span>
    </div>
  </div>;
}

export function ResetLimitPreview() {
  return <span className="reset-limit-mini"><ResetSculpture /></span>;
}
