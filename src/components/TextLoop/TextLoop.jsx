import React, { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { gsap } from 'gsap';

import './TextLoop.css';

const VIEW_W = 1200;
const VIEW_H = 520;
const CX = VIEW_W / 2;
const CY = VIEW_H / 2;
const EDGE_PAD = 6;

const buildPath = (shape, curviness, ribbonWidth) => {
  const c = Math.max(0, curviness);
  const room = Math.max(20, CY - Math.max(0, ribbonWidth) / 2 - EDGE_PAD);

  switch (shape) {
    case 'circle': {
      const r = Math.min(90 + c * 0.95, room);
      return `M ${CX - r} ${CY} A ${r} ${r} 0 1 1 ${CX + r} ${CY} A ${r} ${r} 0 1 1 ${CX - r} ${CY} Z`;
    }
    case 'arch': {
      const rise = Math.min(120 + c * 1.1, room * 2);
      return `M 120 ${CY + rise / 2} Q ${CX} ${CY - rise * 1.5} ${VIEW_W - 120} ${CY + rise / 2}`;
    }
    case 'line':
      return `M -320 ${CY} L ${VIEW_W + 320} ${CY}`;
    case 'wave':
    default: {
      const a = Math.min(c * 2.2, room * 2);
      return `M -320 ${CY} Q -160 ${CY - a} 0 ${CY} T 320 ${CY} T 640 ${CY} T 960 ${CY} T 1280 ${CY} T ${VIEW_W + 320} ${CY}`;
    }
  }
};

export const TextLoop = ({
  text = 'Made to move',
  shape = 'wave',
  path,
  speed = 90,
  direction = 'forward',
  separator = '✦',
  curviness = 90,
  fontSize = 46,
  fontWeight = 800,
  letterSpacing = 2,
  uppercase = true,
  color = 'var(--feedback-ink, #373434)',
  ribbon = true,
  ribbonColor = 'var(--feedback-face, #ffffff)',
  ribbonWidth = 86,
  pauseOnHover = true,
  paused = false,
  className = '',
  style = {}
}) => {
  const rootRef = useRef(null);
  const hoverPathRef = useRef(null);
  const pathRef = useRef(null);
  const measureRef = useRef(null);
  const headRef = useRef(null);
  const tailRef = useRef(null);
  const tweenRef = useRef(null);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  const [metrics, setMetrics] = useState({ length: 0, reps: 1 });

  const rawId = useId();
  const pathId = `text-loop-${rawId.replace(/:/g, '')}`;
  const d = useMemo(() => path || buildPath(shape, curviness, ribbonWidth), [path, shape, curviness, ribbonWidth]);

  const unit = useMemo(() => {
    const base = uppercase ? String(text).toUpperCase() : String(text);
    if (!base.trim()) return '';
    const gap = separator ? `\u00A0${separator}\u00A0` : '\u00A0\u00A0\u00A0';
    return `${base}${gap}`;
  }, [text, separator, uppercase]);

  const textStyle = useMemo(
    () => ({ fontSize: `${fontSize}px`, fontWeight, letterSpacing: `${letterSpacing}px` }),
    [fontSize, fontWeight, letterSpacing]
  );

  useLayoutEffect(() => {
    const pathEl = pathRef.current;
    const measureEl = measureRef.current;
    if (!pathEl || !measureEl) return undefined;

    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      let length = 0;
      let unitWidth = 0;
      try {
        length = pathEl.getTotalLength();
        unitWidth = measureEl.getComputedTextLength();
      } catch {
        return;
      }
      if (!length) return;

      const reps = unitWidth > 0 ? Math.max(1, Math.floor(length / unitWidth)) : 1;
      setMetrics(prev => (prev.length === length && prev.reps === reps ? prev : { length, reps }));
    };

    measure();
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(measure).catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [d, unit, fontSize, fontWeight, letterSpacing]);

  useEffect(() => {
    const { length } = metrics;
    const head = headRef.current;
    const tail = tailRef.current;
    if (!head || !tail || !length) return undefined;

    const apply = offset => {
      const partner = offset >= 0 ? offset - length : offset + length;
      head.setAttribute('startOffset', String(offset));
      tail.setAttribute('startOffset', String(partner));
    };

    apply(0);

    if (speed <= 0 || !String(text).trim()) return undefined;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    const state = { offset: 0 };
    const tween = gsap.to(state, {
      offset: direction === 'reverse' ? -length : length,
      duration: length / speed,
      ease: 'none',
      repeat: -1,
      paused: true,
      onUpdate: () => apply(state.offset)
    });

    const root = rootRef.current;
    const hoverPath = hoverPathRef.current;
    let hovered = false;
    let visible = false;
    const sync = () => tween.paused(pausedRef.current || reduced.matches || hovered || !visible || document.hidden);
    tweenRef.current = sync;
    const pause = () => { hovered = true; sync(); };
    const resume = () => { hovered = false; sync(); };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(root);
    reduced.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);

    if (pauseOnHover && hoverPath) {
      hovered = hoverPath.matches(':hover');
      sync();
      hoverPath.addEventListener('pointerenter', pause);
      hoverPath.addEventListener('pointerleave', resume);
    }

    return () => {
      tween.kill();
      tweenRef.current = null;
      observer.disconnect();
      reduced.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
      if (pauseOnHover && hoverPath) {
        hoverPath.removeEventListener('pointerenter', pause);
        hoverPath.removeEventListener('pointerleave', resume);
      }
    };
  }, [metrics, speed, direction, pauseOnHover, text]);

  useEffect(() => { tweenRef.current?.(); }, [paused]);

  const loopText = unit.repeat(metrics.reps);
  const fitLength = metrics.length || undefined;

  return (
    <div ref={rootRef} className={`text-loop ${className}`.trim()} style={style}>
      <svg
        className="text-loop-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label={text}
        style={{ pointerEvents: 'none' }}
      >
        {ribbon && <g fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d={d} stroke="var(--feedback-edge, #1d1b1b)" strokeWidth={ribbonWidth + 8} transform="translate(0 8)" />
          <path d={d} stroke="var(--feedback-edge, #1d1b1b)" strokeWidth={ribbonWidth + 8} />
        </g>}
        <path
          ref={pathRef}
          id={pathId}
          d={d}
          fill="none"
          stroke={ribbon ? ribbonColor : 'none'}
          strokeWidth={ribbon ? ribbonWidth : 0}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <text ref={measureRef} className="text-loop-measure" style={textStyle} aria-hidden="true">
          {unit}
        </text>

        <text className="text-loop-text" style={textStyle} fill={color} dominantBaseline="central" aria-hidden="true">
          <textPath ref={headRef} href={`#${pathId}`} startOffset={0} textLength={fitLength} lengthAdjust="spacing">
            {loopText}
          </textPath>
        </text>

        <text className="text-loop-text" style={textStyle} fill={color} dominantBaseline="central" aria-hidden="true">
          <textPath ref={tailRef} href={`#${pathId}`} startOffset={-metrics.length} textLength={fitLength} lengthAdjust="spacing">
            {loopText}
          </textPath>
        </text>
        <path
          ref={hoverPathRef}
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth={ribbon ? ribbonWidth + 16 : fontSize * 1.2}
          transform={ribbon ? 'translate(0 4)' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ pointerEvents: 'stroke' }}
          aria-hidden="true"
        />
      </svg>
    </div>
  );
};

export default TextLoop;

