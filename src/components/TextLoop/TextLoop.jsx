import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import './TextLoop.css';

const TAU = Math.PI * 2;
const modulo = (n, size) => ((n % size) + size) % size;
const bounded = (value, min, max) => Math.max(min, Math.min(max, Number(value) || 0));

// Parametric drawings; custom paths use the same sampled arc-length lookup.
function drawTrack(shape, curvature, thickness) {
  const amplitude = Math.min(150, curvature * 1.25, 215 - thickness / 2);
  if (shape === 'circle') {
    const radius = Math.min(215 - thickness / 2, 90 + curvature);
    return `M600,${260 - radius} A${radius},${radius} 0 1 1 600,${260 + radius} A${radius},${radius} 0 1 1 600,${260 - radius} Z`;
  }
  const points = Array.from({ length: 121 }, (_, i) => {
    const t = i / 120;
    const x = -120 + 1440 * t;
    const y = shape === 'line' ? 260 : shape === 'arch'
      ? 330 - amplitude * Math.sin(t * Math.PI)
      : 260 + amplitude * Math.sin(t * TAU);
    return [x, y];
  });
  return points.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(2)},${y.toFixed(2)}`).join(' ') + (shape === 'circle' ? ' Z' : '');
}

function sampleTrack(node) {
  const length = node.getTotalLength();
  if (!Number.isFinite(length) || length < 1) return null;
  const samples = Array.from({ length: 361 }, (_, i) => node.getPointAtLength(length * i / 360));
  return {
    length,
    at(distance) {
      const position = bounded(distance / length, 0, 1) * 360;
      const index = Math.min(359, Math.floor(position));
      const a = samples[index];
      const b = samples[index + 1];
      const mix = position - index;
      return { x: a.x + (b.x - a.x) * mix, y: a.y + (b.y - a.y) * mix, angle: Math.atan2(b.y - a.y, b.x - a.x) };
    },
  };
}

export function TextLoop({
  text = 'Made to move', shape = 'wave', path, speed = 90,
  direction = 'forward', separator = '✦', curviness = 90,
  fontSize = 46, fontWeight = 800, letterSpacing = 2, uppercase = true,
  color = 'var(--feedback-ink, #373434)', ribbon = true,
  ribbonColor = 'var(--feedback-face, #ffffff)', ribbonWidth = 86,
  expression = 0.65, pauseOnHover = true, paused = false,
  className = '', style = {},
}) {
  const svgRef = useRef(null);
  const trackRef = useRef(null);
  const lettersRef = useRef(null);
  const accentsRef = useRef(null);
  const controlRef = useRef(null);
  const [drawing, setDrawing] = useState(null);
  const size = bounded(fontSize, 8, 160);
  const thickness = Math.max(size * 1.35, bounded(ribbonWidth, 12, 200));
  const energy = bounded(expression, 0, 1);
  const content = uppercase ? String(text).toLocaleUpperCase() : String(text);
  const route = useMemo(() => path || drawTrack(shape, bounded(curviness, 0, 120), thickness), [path, shape, curviness, thickness]);

  useLayoutEffect(() => {
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      let track;
      try { track = sampleTrack(trackRef.current); } catch { setDrawing(null); return; }
      if (!track || !content.trim()) { setDrawing(null); return; }
      const canvas = document.createElement('canvas').getContext('2d');
      if (!canvas) return;
      canvas.font = `${fontWeight} ${size}px ${getComputedStyle(svgRef.current).fontFamily}`;
      const phrase = separator ? `${content} ${separator} ` : `${content}  `;
      // Graphemes preserve combining accents and emoji sequences.
      const characters = typeof Intl.Segmenter === 'function'
        ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(phrase), part => part.segment)
        : Array.from(phrase);
      let advance = 0;
      const unit = characters.map(character => {
        const width = Math.max(size * .18, canvas.measureText(character).width + bounded(letterSpacing, -4, 40));
        const glyph = { character, distance: advance + width / 2 };
        advance += width;
        return glyph;
      });
      const closed = !path && shape === 'circle';
      const repeats = Math.max(1, Math.round(track.length / advance));
      const lap = closed ? track.length : Math.max(track.length, advance);
      const spacing = lap / (repeats * advance);
      const glyphs = Array.from({ length: repeats }, (_, repeat) => unit.map(glyph => ({
        character: glyph.character, distance: (repeat * advance + glyph.distance) * spacing,
      }))).flat();
      const seams = [-1, 1].map(side => Array.from({ length: 121 }, (_, i) => {
        const p = track.at(track.length * i / 120);
        const inset = side * (thickness / 2 - 9);
        return `${i ? 'L' : 'M'}${(p.x - Math.sin(p.angle) * inset).toFixed(2)},${(p.y + Math.cos(p.angle) * inset).toFixed(2)}`;
      }).join(' '));
      setDrawing({ track, glyphs, lap, seams, closed, glyphSize: size * Math.min(1, spacing) });
    };
    measure();
    document.fonts?.ready.then(measure);
    document.fonts?.addEventListener('loadingdone', measure);
    return () => { disposed = true; document.fonts?.removeEventListener('loadingdone', measure); };
  }, [route, content, separator, size, fontWeight, letterSpacing, thickness, path, shape]);

  useLayoutEffect(() => {
    if (!drawing) return;
    const nodes = Array.from(lettersRef.current.children);
    const accents = Array.from(accentsRef.current.children);
    const clock = { travel: 0, beat: 0 };
    const paint = () => {
      // A closed loop rotates as one rigid group, including across its seam.
      lettersRef.current.setAttribute('transform', drawing.closed
        ? `rotate(${clock.travel / drawing.track.length * 360} 600 260)` : '');
      drawing.glyphs.forEach((glyph, index) => {
        const distance = modulo(glyph.distance + (drawing.closed ? 0 : clock.travel), drawing.lap);
        const p = drawing.track.at(Math.min(distance, drawing.track.length));
        nodes[index].setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.angle * 180 / Math.PI})`);
        const fade = drawing.closed ? 1 : bounded(Math.min(distance, drawing.track.length - distance) / size, 0, 1);
        nodes[index].setAttribute('opacity', String(fade));
      });
      accents.forEach((node, i) => {
        const bob = Math.sin(clock.beat * TAU + i * 1.5);
        node.setAttribute('transform', `translate(${i ? 930 : 270} ${i ? 410 : 100}) rotate(${energy * bob * 14}) scale(${1 + energy * bob * .12})`);
      });
    };
    paint();
    const motion = gsap.timeline({ paused: true, onUpdate: paint });
    const velocity = bounded(speed, 0, 1000);
    motion.to(clock, { travel: (direction === 'reverse' ? -1 : 1) * drawing.lap, duration: drawing.lap / Math.max(1, velocity), repeat: -1, ease: 'none' }, 0);
    motion.to(clock, { beat: 1, duration: 3.6, repeat: -1, ease: 'none' }, 0);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    let hovering = false;
    let requestedPause = paused;
    const sync = () => motion.paused(requestedPause || !velocity || reduced.matches || !visible || document.hidden || hovering);
    controlRef.current = value => { requestedPause = value; sync(); };
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); });
    observer.observe(svgRef.current);
    const hit = svgRef.current.querySelector('.text-loop-hit');
    const enter = () => { hovering = true; sync(); };
    const leave = () => { hovering = false; sync(); };
    if (pauseOnHover) {
      hovering = hit.matches(':hover');
      hit.addEventListener('pointerenter', enter);
      hit.addEventListener('pointerleave', leave);
    }
    document.addEventListener('visibilitychange', sync);
    reduced.addEventListener('change', sync);
    sync();
    return () => {
      motion.kill();
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
      reduced.removeEventListener('change', sync);
      hit.removeEventListener('pointerenter', enter);
      hit.removeEventListener('pointerleave', leave);
      controlRef.current = null;
    };
  }, [drawing, direction, speed, energy, pauseOnHover, path, shape, size]);

  useLayoutEffect(() => { controlRef.current?.(paused); }, [paused]);

  return <div className={`text-loop ${className}`.trim()} style={style}>
    <svg ref={svgRef} className="text-loop-svg" viewBox="0 0 1200 520" role="img" aria-label={String(text)}>
      <g aria-hidden="true" className="text-loop-art">
        {ribbon && <g fill="none" strokeLinejoin="round">
          <path d={route} className="text-loop-edge" strokeWidth={thickness + 5} transform="translate(0 9)" />
          <path d={route} className="text-loop-edge" strokeWidth={thickness + 5} />
          <path d={route} stroke={ribbonColor} strokeWidth={thickness} />
          {drawing?.seams.map((seam, i) => <path key={i} d={seam} className="text-loop-stitch" />)}
        </g>}
        <path ref={trackRef} className="text-loop-track" d={route} fill="none" stroke="none" />
        <g ref={accentsRef} className="text-loop-accents" display={energy && ribbon && drawing ? undefined : 'none'}>
          {[0, 1].map(i => <g key={i} transform={`translate(${i ? 930 : 270} ${i ? 410 : 100})`}>
            <path d="M0,-23 Q4,-4 23,0 Q4,4 0,23 Q-4,4 -23,0 Q-4,-4 0,-23Z" fill={ribbonColor} />
            <path d="M33,-23 l5,-9 M-29,20 l-7,5" fill="none" />
          </g>)}
        </g>
        <g ref={lettersRef} fill={color} fontSize={drawing?.glyphSize || size} fontWeight={fontWeight} textAnchor="middle" dominantBaseline="central">
          {drawing?.glyphs.map((glyph, index) => {
            const p = drawing.track.at(Math.min(glyph.distance, drawing.track.length));
            return <text key={index} className="text-loop-glyph" transform={`translate(${p.x} ${p.y}) rotate(${p.angle * 180 / Math.PI})`}>{glyph.character}</text>;
          })}
        </g>
        {!drawing && content.trim() && <text x="600" y="260" fill={color} fontSize={size} textAnchor="middle">{content}</text>}
      </g>
      <path className="text-loop-hit" d={route} fill="none" stroke="transparent" strokeWidth={ribbon ? thickness + 8 : size * 1.4} aria-hidden="true" />
    </svg>
  </div>;
}

export default TextLoop;
