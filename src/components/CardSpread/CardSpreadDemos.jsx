import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { CardSpread } from './CardSpread';
import { Button } from '../Button/Button';
import '../Feedback/Feedback.css';

export const spreadItems = [
  ['mountains', 'Above the clouds', 'photo-1464822759023-fed622ff2c3b'],
  ['forest', 'Into the forest', 'photo-1441974231531-c6227db76b6e'],
  ['coast', 'Ocean air', 'photo-1518837695005-2083093ee35b'],
  ['lake', 'Still waters', 'photo-1470770841072-f978cf4d019e'],
  ['desert', 'Desert light', 'photo-1509316785289-025f5b846b35'],
  ['valley', 'The long way home', 'photo-1472396961693-142e6e269027'],
  ['alpine', 'Wild horizons', 'photo-1469474968028-56623f02e42e'],
].map(([id, title, photo]) => ({ id, title, image:`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=700&q=85` }));

export const spreadExamples = [['Seven perspectives', 'Composition'], ['Small collection', 'Composition'], ['Dark surface', 'Surface']];
export function CardSpreadDemo({ example }) {
  return <div className="spread-demo feedback-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'}><CardSpread items={example === 'Small collection' ? spreadItems.slice(1, 6) : spreadItems} label={example} /></div>;
}
export function SpreadPlayground() {
  const [theme, setTheme] = useState('light');
  return <Card variant="elevated" interactive className="spread-playground playground-card" aria-label="Card Spread playground">
    <div className="spread-stage feedback-surface" data-theme={theme}>
      <div className="spread-stage__heading"><h3>A different point of view.</h3><span>OUT IN THE WILD / 01—07</span></div>
      <CardSpread items={spreadItems} label="Nature perspectives" />
      <p>Hover to explore. Click to keep a card in view.<br />Use Tab and arrow keys, or tap a photograph.</p>
    </div>
    <div className="spread-controls" role="group" aria-label="Surface">{['light', 'dark'].map(value => <Button key={value} size="sm" variant="outline" selected={theme === value} onClick={() => setTheme(value)}>{value === 'light' ? 'Light' : 'Dark'}</Button>)}</div>
  </Card>;
}
export function SpreadPreview() {
  return <span className="spread-mini">{spreadItems.map((item, index) => <span key={item.id} style={{ '--offset':index - 3, '--drop':Math.abs(index - 3), zIndex:7 - Math.abs(index - 3) }}><img src={item.image.replace('w=700', 'w=160')} alt="" loading="lazy" /></span>)}</span>;
}
