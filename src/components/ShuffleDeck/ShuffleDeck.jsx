import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Button } from '../Button/Button';
import './ShuffleDeck.css';

/** A finite, cyclic deck. Supply stable unique item IDs and non-interactive card content. */
export function ShuffleDeck({ items, renderItem, layout = 'stack', label = 'Card deck', onIndexChange, className = '' }) {
  const [position, setPosition] = useState(0);
  const [busy, setBusy] = useState(false);
  const cards = useRef([]);
  const drag = useRef(null);
  const locked = useRef(false);
  const reduced = useRef(false);
  const exitTween = useRef(null);
  const settle = useRef(() => {});
  const index = items.length ? position % items.length : 0;

  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => {
      reduced.current = media.matches;
      if (media.matches) {
        exitTween.current?.progress(1);
        settle.current(true);
      }
    };
    update();
    media.addEventListener('change', update);
    return () => { media.removeEventListener('change', update); exitTween.current?.kill(); };
  }, []);

  useLayoutEffect(() => {
      const nodes = cards.current.filter(Boolean);
      function arrange(immediate = false) {
        cards.current.forEach((card, i) => {
          if (!card) return;
          const depth = (i - index + items.length) % items.length;
          const visible = depth < 3;
          gsap.set(card, { zIndex: items.length - depth });
          const target = { x: layout === 'fan' && depth ? (depth === 1 ? -28 : 28) : 0,
            y: depth * -12, rotation: layout === 'fan' ? [0, -9, 9][depth] || 0 : depth * -3,
            scale: 1 - Math.min(depth, 3) * .055, opacity: visible ? 1 : 0 };
          if (reduced.current || immediate || !visible) { gsap.killTweensOf(card); gsap.set(card, target); }
          else gsap.to(card, { ...target, duration: .55, ease: 'back.out(1.25)', overwrite: true });
        });
      }
      settle.current = arrange;
      arrange(reduced.current);
    locked.current = false;
    setBusy(false);
    drag.current = null;
    return () => { exitTween.current?.kill(); nodes.forEach(card => gsap.killTweensOf(card)); };
  }, [index, items, layout]);

  function move(direction) {
    if (locked.current || items.length < 2) return;
    locked.current = true;
    setBusy(true);
    const next = (index + direction + items.length) % items.length;
    const finish = () => { setPosition(next); onIndexChange?.(next); };
    if (reduced.current) finish();
    else exitTween.current = gsap.to(cards.current[index], {
      x: direction * -320, y: -55, rotation: direction * -24, opacity: 0,
      duration: .3, ease: 'power2.in', overwrite: true, onComplete: finish,
    });
  }

  function startDrag(event) {
    if (locked.current || items.length < 2 || !event.isPrimary || event.button !== 0) return;
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, id: event.pointerId, distance: 0 };
    gsap.killTweensOf(cards.current[index]);
  }
  function dragCard(event) {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    const distance = Math.max(-240, Math.min(240, event.clientX - drag.current.x));
    drag.current.distance = distance;
    if (!reduced.current) gsap.set(cards.current[index], { x: distance, rotation: distance / 14, y: -Math.abs(distance) / 12 });
  }
  function endDrag(event, cancel = false) {
    if (!drag.current) return;
    const distance = drag.current.distance;
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    if (!cancel && Math.abs(distance) > 60) move(distance < 0 ? 1 : -1);
    else settle.current();
  }

  return <section className={`shuffle-deck ${className}`} aria-label={label} aria-roledescription="carousel">
    {items.length ? <>
      <div className="shuffle-deck__viewport" tabIndex={0} role="group" aria-label="Drag cards or use left and right arrow keys"
        onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1); } }}
        onPointerDown={startDrag} onPointerMove={dragCard} onPointerUp={event => endDrag(event)} onPointerCancel={event => endDrag(event, true)} onLostPointerCapture={event => endDrag(event, true)}>
        {items.map((item, i) => <div className="shuffle-deck__card" key={item.id} ref={node => { cards.current[i] = node; }} aria-hidden={i !== index} inert={i !== index}>
          {renderItem ? renderItem(item, i) : <><span className="shuffle-deck__eyebrow">{item.eyebrow}</span><h3>{item.title}</h3><p>{item.description}</p></>}
        </div>)}
      </div>
      <div className="shuffle-deck__navigation"><Button size="sm" variant="outline" onClick={() => move(-1)} disabled={busy || items.length < 2} aria-label="Previous card">←</Button><span role="status" aria-live="polite" aria-atomic="true">{index + 1} <span>/ {items.length}</span></span><Button size="sm" variant="outline" onClick={() => move(1)} disabled={busy || items.length < 2} aria-label="Next card">→</Button></div>
    </> : <p className="shuffle-deck__empty">No cards to display.</p>}
  </section>;
}
