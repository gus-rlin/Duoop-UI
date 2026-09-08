import React, { useEffect, useId, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import '../Feedback/Feedback.css';
import './CardsCarousel.css';

const Arrow = ({ back = false }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} /></svg>;

function CardImage({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} /> : <span className={`cards-carousel__image-fallback ${className}`}>Image unavailable</span>;
}

/** A scroll-snap collection with native touch scrolling and modal card details. */
export function CardsCarousel({ items = [], title = 'A little more to discover.', label = 'Featured stories', size = 'large', theme = 'light', className = '' }) {
  const rail = useRef(null);
  const progress = useRef(null);
  const dialog = useRef(null);
  const headingId = useId();
  const detailId = useId();
  const detailHeading = useRef(null);
  const [selectedId, setSelectedId] = useState(null);
  const selected = items.find(item => item.id === selectedId);
  const selectedIndex = items.findIndex(item => item.id === selectedId);
  const [position, setPosition] = useState({ start: true, end: true });

  useEffect(() => {
    const node = rail.current;
    const measure = () => {
      const distance = node.scrollWidth - node.clientWidth;
      progress.current?.style.setProperty('--collection-progress', String(distance > 0 ? Math.max(0, Math.min(1, node.scrollLeft / distance)) : 1));
      const next = { start: node.scrollLeft <= 2, end: node.scrollLeft + node.clientWidth >= node.scrollWidth - 2 };
      setPosition(previous => previous.start === next.start && previous.end === next.end ? previous : next);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    for (const child of node.children) observer.observe(child);
    node.addEventListener('scroll', measure, { passive: true });
    measure();
    return () => { observer.disconnect(); node.removeEventListener('scroll', measure); };
  }, [items, size]);

  useEffect(() => {
    const node = dialog.current;
    if (!selected) { if (node.open) node.close(); return; }
    if (!node.open) node.showModal();
    else detailHeading.current?.focus({ preventScroll: true });
    node.scrollTop = 0;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = overflow; };
  }, [selected]);

  const close = () => { dialog.current.close(); setSelectedId(null); };
  function move(direction) {
    const node = rail.current;
    const card = node.firstElementChild;
    if (!card) return;
    const step = card.offsetWidth + parseFloat(getComputedStyle(node).columnGap);
    node.scrollBy({ left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
  function navigate(event) {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...rail.current.querySelectorAll('.cards-carousel__card')];
    if (!buttons.length) return;
    event.preventDefault();
    const current = buttons.indexOf(document.activeElement);
    const index = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : Math.max(0, Math.min(buttons.length - 1, current + (event.key === 'ArrowRight' ? 1 : -1)));
    buttons[index].focus({ preventScroll: true });
    buttons[index].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }

  return <section className={`cards-carousel feedback-surface ${className}`} data-size={size} data-theme={theme} aria-label={label} aria-roledescription="carousel">
    <header className="cards-carousel__heading"><div><span className="cards-carousel__eyebrow">THE COLLECTION / {String(items.length).padStart(2, '0')} STORIES</span><h3 id={headingId}>{title}</h3></div><span className="cards-carousel__hint">A new perspective, one card away.</span></header>
    <div className="cards-carousel__rail" ref={rail} onKeyDown={navigate} aria-labelledby={headingId}>
      {items.map((item, index) => <button key={item.id} className="cards-carousel__card" type="button" aria-label={`Read ${item.title}`} aria-haspopup="dialog" onClick={() => setSelectedId(item.id)}>
        <span className="cards-carousel__copy"><span className="cards-carousel__eyebrow">{item.category}</span><strong>{item.title}</strong></span>
        <span className="cards-carousel__window"><CardImage key={item.src} src={item.src} alt="" className="cards-carousel__image" /></span>
        <span className="cards-carousel__card-footer"><span>{String(index + 1).padStart(2, '0')} / Explore story</span><span className="cards-carousel__plus" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M5 12h14M12 5v14" /></svg></span></span>
      </button>)}
      {!items.length && <p className="cards-carousel__empty">No stories to display.</p>}
    </div>
    <footer className="cards-carousel__navigation"><span>Scroll to explore. Select a card to go deeper.<span ref={progress} className="cards-carousel__progress" aria-hidden="true"><span /></span></span><div><Button variant="outline" iconPosition="only" icon={<Arrow back />} aria-label="Previous cards" disabled={position.start} onClick={() => move(-1)} /><Button variant="outline" iconPosition="only" icon={<Arrow />} aria-label="Next cards" disabled={position.end} onClick={() => move(1)} /></div></footer>
    <dialog ref={dialog} className="cards-carousel__dialog" aria-labelledby={detailId} onCancel={event => { event.preventDefault(); event.stopPropagation(); close(); }} onClose={event => { event.stopPropagation(); setSelectedId(null); }} onClick={event => { if (event.target === event.currentTarget) { const rect = event.currentTarget.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) close(); } }}>
      {selected && <>
        <div className="cards-carousel__detail-toolbar"><span className="cards-carousel__eyebrow">The collection <span aria-hidden="true">/</span> Field notes</span><Button variant="outline" iconPosition="only" aria-label="Close story" onClick={close} icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m6 6 12 12M18 6 6 18" /></svg>} /></div>
        <article className="cards-carousel__story" key={selected.id}>
          <header className="cards-carousel__detail-heading"><span className="cards-carousel__story-number" aria-hidden="true">{String(selectedIndex + 1).padStart(2, '0')}</span><div><span className="cards-carousel__eyebrow">{selected.category}</span><h2 ref={detailHeading} tabIndex={-1} id={detailId}>{selected.title}</h2></div></header>
          <figure className="cards-carousel__figure"><CardImage key={selected.src} src={selected.src} alt={selected.alt} className="cards-carousel__detail-image" /><figcaption><span>A new perspective, one card away.</span><span>{String(selectedIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</span></figcaption></figure>
          <div className="cards-carousel__detail-content"><div className="cards-carousel__prose">{selected.content}</div>{selected.takeaway && <aside className="cards-carousel__takeaway"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 4h13l4 4v20H8zM20 4v5h5M12 14h9M12 19h6M12 24h4" /></svg><span className="cards-carousel__eyebrow">Try this today</span><p>{selected.takeaway}</p></aside>}</div>
        </article>
        <footer className="cards-carousel__detail-footer"><Button className="cards-carousel__return" variant="outline" onClick={close}>Back to collection</Button><nav aria-label="Story navigation"><Button variant="outline" iconPosition="only" icon={<Arrow back />} aria-label="Previous story" disabled={selectedIndex === 0} onClick={() => setSelectedId(items[selectedIndex - 1].id)} /><span className="cards-carousel__story-position" role="status">{String(selectedIndex + 1).padStart(2, '0')} <span>/ {String(items.length).padStart(2, '0')}</span></span><Button variant="outline" iconPosition="only" icon={<Arrow />} aria-label="Next story" disabled={selectedIndex === items.length - 1} onClick={() => setSelectedId(items[selectedIndex + 1].id)} /></nav></footer>
      </>}
    </dialog>
  </section>;
}
