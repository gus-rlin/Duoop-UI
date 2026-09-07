import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { IconButton } from '../IconButton/IconButton';
import './DepthCarousel.css';

const wrap = (value, count) => ((value % count) + count) % count;
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const EMPTY = [];
const arrow = direction => <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={direction === 'left' ? 'm14 5-7 7 7 7' : 'm10 5 7 7-7 7'} /></svg>;

/** Short collections with stable IDs and non-interactive card content. */
export function DepthCarousel({ items = EMPTY, renderItem, label = 'Depth carousel', depth = 180, spread = 78, tilt = 16, direction = 'right', loop = true, onIndexChange, className = '' }) {
  const [selected, setSelected] = useState(0);
  const active = clamp(selected, 0, Math.max(0, items.length - 1));
  const viewport = useRef(null);
  const cards = useRef([]);
  const motion = useRef({ position: 0 });
  const target = useRef(0);
  const tween = useRef(null);
  const drag = useRef(null);
  const reduced = useRef(false);
  const width = useRef(400);
  const count = items.length;

  const layout = useCallback(() => {
    const scale = Math.min(1, width.current / 440);
    cards.current.forEach((card, index) => {
      if (!card || !count) return;
      let distance = index - motion.current.position;
      if (loop && count > 1) {
        distance = wrap(distance, count);
        if (distance > count / 2) distance -= count;
      }
      const back = Math.max(0, distance);
      const sign = direction === 'left' ? -1 : 1;
      card.style.transform = `translate(-50%, -50%) translateX(${sign * spread * distance * scale}px) translateZ(${-depth * distance * scale}px) rotateY(${sign * tilt * clamp(distance, 0, 1)}deg)`;
      card.style.opacity = String(distance < 0 ? Math.max(0, 1 + distance) : 1);
      card.style.zIndex = String(Math.round(100 - distance * 10));
      card.style.setProperty('--depth-shade', Math.min(.48, back * .16));
    });
  }, [count, depth, spread, tilt, direction, loop]);

  const goTo = useCallback(raw => {
    if (!count) return;
    const next = loop ? wrap(raw, count) : clamp(raw, 0, count - 1);
    let delta = next - motion.current.position;
    if (loop) {
      delta = wrap(delta, count);
      if (delta > count / 2) delta -= count;
    }
    tween.current?.kill();
    const changed = next !== target.current;
    target.current = next;
    setSelected(next);
    tween.current = gsap.to(motion.current, {
      position: motion.current.position + delta,
      duration: reduced.current ? 0 : .56,
      ease: 'power3.out',
      onUpdate: layout,
      onComplete: () => { motion.current.position = next; layout(); },
    });
    if (changed) onIndexChange?.(next, items[next]);
  }, [count, loop, items, layout, onIndexChange]);

  useLayoutEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      reduced.current = preference.matches;
      if (preference.matches) { tween.current?.progress(1); drag.current = null; }
    };
    sync();
    preference.addEventListener('change', sync);
    const observer = new ResizeObserver(([entry]) => { width.current = entry.contentRect.width; layout(); });
    observer.observe(viewport.current);
    return () => { preference.removeEventListener('change', sync); observer.disconnect(); tween.current?.kill(); drag.current = null; };
  }, [layout]);

  useLayoutEffect(() => {
    tween.current?.kill();
    drag.current = null;
    setSelected(value => clamp(value, 0, Math.max(0, count - 1)));
    target.current = active;
    motion.current.position = active;
    layout();
  }, [count, layout]);

  function endDrag(event, cancelled = false) {
    const gesture = drag.current;
    if (!gesture || gesture.id !== event.pointerId) return;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    const dx = event.clientX - gesture.x;
    goTo(!cancelled && Math.abs(dx) > 45 ? gesture.index + (dx < 0 ? 1 : -1) : gesture.index);
  }

  return <section className={`depth-carousel ${className}`} aria-label={label} aria-roledescription="carousel">
    <div className="depth-carousel__viewport" ref={viewport} tabIndex={count > 1 ? 0 : undefined} role="group" aria-label="Cards. Use left and right arrow keys."
      onKeyDown={event => {
        const next = { ArrowLeft: target.current - 1, ArrowRight: target.current + 1, Home: 0, End: count - 1 }[event.key];
        if (next !== undefined) { event.preventDefault(); goTo(next); }
      }}
      onPointerDown={event => {
        if (count < 2 || event.button !== 0 || !event.isPrimary) return;
        tween.current?.kill();
        drag.current = { id: event.pointerId, x: event.clientX, position: motion.current.position, index: target.current };
        event.currentTarget.setPointerCapture(event.pointerId);
      }}
      onPointerMove={event => {
        const gesture = drag.current;
        if (!gesture || gesture.id !== event.pointerId || reduced.current) return;
        const position = gesture.position - (event.clientX - gesture.x) / Math.max(120, width.current * .45);
        motion.current.position = loop ? position : clamp(position, 0, count - 1);
        layout();
      }}
      onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)} onLostPointerCapture={event => endDrag(event, true)}>
      {items.map((item, index) => <div key={item.id} ref={node => { cards.current[index] = node; }} className="depth-carousel__card" role="group" aria-roledescription="slide" aria-label={`${index + 1} of ${count}`} aria-hidden={index !== active} inert={index !== active}>
        {renderItem ? renderItem(item, index) : <>{item.image && <img src={item.image} alt={item.alt || ''} draggable="false" />}{item.title && <h4>{item.title}</h4>}</>}
      </div>)}
      {!count && <p className="depth-carousel__empty">No cards to display.</p>}
    </div>
    {count > 0 && <div className="depth-carousel__navigation">
      <IconButton variant="outline" label="Previous card" icon={arrow('left')} disabled={count < 2 || (!loop && active === 0)} onClick={() => goTo(target.current - 1)} />
      <span className="depth-carousel__counter" role="status" aria-live="polite">{String(active + 1).padStart(2, '0')} <span>/ {String(count).padStart(2, '0')}</span></span>
      <IconButton variant="outline" label="Next card" icon={arrow('right')} disabled={count < 2 || (!loop && active === count - 1)} onClick={() => goTo(target.current + 1)} />
    </div>}
    {count > 1 && <div className="depth-carousel__indicators" role="group" aria-label="Choose a card">{items.map((item, index) => <button key={item.id} type="button" aria-label={`Go to card ${index + 1}`} aria-pressed={index === active} onClick={() => goTo(index)}><span /></button>)}</div>}
  </section>;
}
