import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { DepthCarousel } from './DepthCarousel';
import { Button } from '../Button/Button';
import '../Feedback/Feedback.css';

export const depthItems = [
  { id: 'mountains', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1000&q=85', alt: 'A forested valley beneath snow-capped mountains' },
  { id: 'lake', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1000&q=85', alt: 'A mountain landscape reflected in a still lake' },
  { id: 'forest', image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1000&q=85', alt: 'Sunlight falling through a green forest' },
  { id: 'coast', image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1000&q=85', alt: 'Ocean waves beneath an open sky' },
  { id: 'dunes', image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?auto=format&fit=crop&w=1000&q=85', alt: 'Red sandstone mesas in a desert landscape' },
];

export const depthExamples = [['Perspective right', 'Composition'], ['Perspective left', 'Composition'], ['Dark surface', 'Composition'], ['Bounded collection', 'Behavior']];
export function DepthCarouselDemo({ example }) {
  return <div className="depth-demo feedback-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'}><DepthCarousel items={depthItems} direction={example === 'Perspective left' ? 'left' : 'right'} loop={example !== 'Bounded collection'} label={example} /></div>;
}

export function DepthPlayground() {
  const [direction, setDirection] = useState('right');
  const [theme, setTheme] = useState('light');
  const [depth, setDepth] = useState(180);
  return <Card variant="elevated" interactive className="depth-playground playground-card" aria-label="Depth Carousel playground">
    <div className="depth-playground__preview feedback-surface" data-theme={theme}>
      <DepthCarousel items={depthItems} direction={direction} depth={depth} label="Studio perspectives" />
    </div>
    <div className="depth-controls"><fieldset><legend>Direction</legend><div>{['left', 'right'].map(value => <Button key={value} variant="outline" size="sm" selected={direction === value} onClick={() => setDirection(value)}>{value === 'left' ? 'Left' : 'Right'}</Button>)}</div></fieldset><fieldset><legend>Surface</legend><div>{['light', 'dark'].map(value => <Button key={value} variant="outline" size="sm" selected={theme === value} onClick={() => setTheme(value)}>{value === 'light' ? 'Light' : 'Dark'}</Button>)}</div></fieldset><fieldset><legend>Depth</legend><div>{[100, 180, 280].map(value => <Button key={value} variant="outline" size="sm" selected={depth === value} onClick={() => setDepth(value)}>{value === 100 ? 'Shallow' : value === 180 ? 'Balanced' : 'Deep'}</Button>)}</div></fieldset></div>
  </Card>;
}

export function DepthPreview() {
  return <span className="depth-mini">{[2, 1, 0].map(index => <span key={index}><img src={depthItems[index].image.replace('w=1000', 'w=300')} alt="" loading="lazy" /></span>)}</span>;
}

