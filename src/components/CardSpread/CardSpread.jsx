import React, { useRef, useState } from 'react';
import './CardSpread.css';

export function CardSpread({ items, label = 'Photo collection', className = '' }) {
  const [hovered, setHovered] = useState(null);
  const [focused, setFocused] = useState(null);
  const [selected, setSelected] = useState(null);
  const buttons = useRef([]);
  const pointer = useRef(null);
  const activeId = hovered ?? focused ?? selected;
  const active = items.findIndex(item => item.id === activeId);
  const middle = (items.length - 1) / 2;

  function navigate(event, index) {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % items.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = items.length - 1;
    if (event.key === 'Escape') {
      setSelected(null); setHovered(null); setFocused(null);
    }
    if (next !== undefined) { event.preventDefault(); buttons.current[next]?.focus(); }
  }

  return <section className={`card-spread ${className}`} aria-label={label}>
    {items.length ? <div className="card-spread__fan"
      onPointerMove={event => {
        if (event.pointerType === 'touch') return;
        // Moving cards can generate boundary events under a stationary cursor.
        // Only a real pointer movement should choose a different photograph.
        if (pointer.current?.x === event.clientX && pointer.current?.y === event.clientY) return;
        pointer.current = { x:event.clientX, y:event.clientY };
        const card = event.target.closest('.card-spread__card');
        if (card && event.currentTarget.contains(card)) setHovered(card.dataset.id);
      }}
      onPointerLeave={() => { pointer.current = null; setHovered(null); }}>
      {items.map((item, index) => {
        const offset = middle ? (index - middle) / Math.max(middle, 3) * 3 : 0;
        const engaged = active === index;
        const separation = active < 0 || engaged ? 0 : Math.sign(index - active) * 3;
        return <button type="button" key={item.id} ref={node => { buttons.current[index] = node; }}
          className="card-spread__card" data-id={item.id} data-active={engaged} aria-label={item.title} aria-pressed={selected === item.id}
          style={{ '--x': `${offset * 10}%`, '--shift': `${separation / .23}%`, '--y': `${offset * offset * 2}%`, '--angle': `${offset * 15}deg`, '--lift': engaged ? '-14%' : '0%', zIndex: engaged ? items.length + 1 : items.length - Math.round(Math.abs(index - middle)) }}
          onFocus={event => { if (event.currentTarget.matches(':focus-visible')) setFocused(item.id); }}
          onBlur={() => setFocused(null)} onKeyDown={event => navigate(event, index)}
          onClick={() => setSelected(current => current === item.id ? null : item.id)}>
          <img src={item.image} alt="" draggable="false" loading="eager" decoding="sync" />
        </button>;
      })}
    </div> : <p className="card-spread__empty">No photographs to display.</p>}
  </section>;
}
