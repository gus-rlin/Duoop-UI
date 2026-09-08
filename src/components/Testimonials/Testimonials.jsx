import React, { useId, useState } from 'react';
import { Button } from '../Button/Button';
import { Avatar } from '../Avatar/Avatar';
import './Testimonials.css';

export function QuoteMark() {
  const shape = 'M8 42C8 23 19 12 38 10V22C28 24 23 29 23 37H38V66H8V42ZM54 42C54 23 65 12 84 10V22C74 24 69 29 69 37H84V66H54V42Z';
  return <svg className="testimonials__mark" viewBox="0 0 94 80" stroke="#1d1b1b" strokeWidth="2.5" strokeLinejoin="round" aria-hidden="true"><path d={shape} fill="#1d1b1b" transform="translate(0 6)" /><path d={shape} fill="#fff" /></svg>;
}
function Author({ item }) {
  return <figcaption className="testimonials__author"><Avatar name={item.name} src={item.image} size="sm" /><span><strong>{item.name}</strong><small>{item.role} · {item.company}</small></span></figcaption>;
}
function Quote({ item, featured = false }) {
  return <figure className={`testimonials__quote${featured ? ' testimonials__quote--featured' : ''}`}><QuoteMark /><blockquote>{item.quote}</blockquote><Author item={item} /></figure>;
}
function TestimonialWall({ items }) {
  const remaining = items.slice(1);
  const sideCount = Math.ceil(remaining.length / 4);
  const left = remaining.slice(0, sideCount);
  const right = remaining.slice(sideCount, sideCount * 2);
  const center = remaining.slice(sideCount * 2);
  const column = entries => entries.map(entry => <Quote key={entry.id} item={entry} />);
  return <div className="testimonials__wall">
    <div className="testimonials__wall-column">{column(left)}</div>
    <div className="testimonials__wall-center">
      <Quote item={items[0]} featured />
      <div className="testimonials__wall-lower">
        <div className="testimonials__wall-column">{column(center.slice(0, Math.ceil(center.length / 2)))}</div>
        <div className="testimonials__wall-column">{column(center.slice(Math.ceil(center.length / 2)))}</div>
      </div>
    </div>
    <div className="testimonials__wall-column">{column(right)}</div>
  </div>;
}
const Arrow = ({ back }) => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={back ? 'M19 12H5m6-6-6 6 6 6' : 'M5 12h14m-6-6 6 6-6 6'} /></svg>;

/** Items use stable unique IDs. Switching is immediate; only the incoming content animates. */
export function Testimonials({ items = [], variant = 'spotlight', eyebrow = 'In good company', title = 'Good work. Shared words.', description, label = 'Customer testimonials' }) {
  const [selected, setSelected] = useState(null);
  const [direction, setDirection] = useState(1);
  const heading = useId();
  const index = Math.max(0, items.findIndex(item => item.id === selected));
  const item = items[index];
  const change = delta => {
    setDirection(delta);
    setSelected(items[(index + delta + items.length) % items.length].id);
  };
  return <section className={`testimonials testimonials--${variant}`} aria-label={label} style={{ '--testimonial-direction': direction }}>
    <header className="testimonials__heading"><span className="testimonials__eyebrow">{eyebrow}</span><h3 id={heading}>{title}</h3>{description && <p>{description}</p>}</header>
    {!item ? <p className="testimonials__empty">No stories to share yet.</p> : variant === 'wall' ? <TestimonialWall items={items} /> : <div className="testimonials__stage">
      {variant === 'voices' && <div className="testimonials__choices" role="group" aria-label="Choose a customer story">{items.map(entry => <Button key={entry.id} variant="outline" selected={entry.id === item.id} onClick={() => setSelected(entry.id)}><span className="testimonials__choice"><strong>{entry.company}</strong><small>{entry.name}</small></span></Button>)}</div>}
      <div className="testimonials__paper"><div className="testimonials__story" key={item.id}><span className="testimonials__company">{item.company}<span>Customer story / {String(index + 1).padStart(2, '0')}</span></span><Quote item={item} featured /></div>
        <footer className="testimonials__footer"><span role="status" aria-live="polite" aria-atomic="true">{String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}<span className="duoop-sr-only"> — {item.name}, {item.company}</span></span><div><Button variant="outline" iconPosition="only" icon={<Arrow back />} aria-label="Previous testimonial" disabled={items.length < 2} onClick={() => change(-1)} /><Button variant="outline" iconPosition="only" icon={<Arrow />} aria-label="Next testimonial" disabled={items.length < 2} onClick={() => change(1)} /></div></footer>
      </div>
    </div>}
  </section>;
}

