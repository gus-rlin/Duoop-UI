import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { ShuffleDeck } from './ShuffleDeck';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import '../Feedback/Feedback.css';
import '../Feedback/Experience.css';

export const deckItems = [
  { id:'discover', eyebrow:'01 / Discover', title:'Start with curiosity.', description:'Collect the questions before you look for answers.', footer:'Field notes', mark:'01' },
  { id:'shape', eyebrow:'02 / Shape', title:'Make room for ideas.', description:'Explore the unexpected. Give your best ideas a little space.', footer:'Studio practice', mark:'02' },
  { id:'build', eyebrow:'03 / Build', title:'Bring it to life.', description:'Turn a small experiment into something people can use.', footer:'Work in progress', mark:'03' },
  { id:'refine', eyebrow:'04 / Refine', title:'Care for the details.', description:'The last few adjustments make the whole thing feel right.', footer:'Finishing touches', mark:'04' },
];
const quotes = [
  { id:'one', eyebrow:'Design principle / 01', title:'Less, but better.', description:'Give the essential things the attention they deserve.', footer:'Studio principles', mark:'01' },
  { id:'two', eyebrow:'Design principle / 02', title:'Show, then tell.', description:'Let the interaction explain what happens next.', footer:'Studio principles', mark:'02' },
  { id:'three', eyebrow:'Design principle / 03', title:'Make it feel right.', description:'A clear response turns an action into a conversation.', footer:'Studio principles', mark:'03' },
];
export function DeckCard(item) {
  return <><span className="shuffle-deck__eyebrow">{item.eyebrow}</span><h4>{item.title}</h4><p>{item.description}</p><div className="shuffle-deck__card-footer"><span>{item.footer}</span><span>{item.mark}</span></div></>;
}
export const shuffleExamples = [['Studio cards', 'Compositions'], ['Fanned cards', 'Compositions'], ['Principles', 'Compositions'], ['Dark surface', 'Compositions']];
export function ShuffleDeckDemo({ example }) {
  return <div className="shuffle-demo feedback-surface experience-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'}><ShuffleDeck items={example === 'Principles' ? quotes : deckItems} renderItem={DeckCard} layout={example === 'Fanned cards' ? 'fan' : 'stack'} label={example} /></div>;
}
export function ShufflePlayground() {
  const [layout, setLayout] = useState('fan');
  const [theme, setTheme] = useState('light');
  return <Card variant="elevated" interactive className="shuffle-playground playground-card" aria-label="Shuffle Deck playground">
    <div className="shuffle-playground__preview feedback-surface experience-surface" data-theme={theme}>
      <div className="shuffle-playground__copy"><span className="shuffle-deck__eyebrow">A little organised chaos</span><h3>Good ideas.<br />Keep them moving.</h3><p>Pick up a card. Give it a nudge. There’s always another perspective underneath.</p><small>Drag sideways · Arrow keys · Previous / next</small></div>
      <ShuffleDeck items={deckItems} renderItem={DeckCard} layout={layout} label="Studio deck" />
    </div>
    <div className="shuffle-controls"><fieldset><legend>Arrangement</legend><div>{['stack','fan'].map(value => <Button key={value} variant="outline" size="sm" selected={layout === value} onClick={() => setLayout(value)}>{value === 'stack' ? 'Stack' : 'Fan'}</Button>)}</div></fieldset><Select label="Surface" value={theme} onValueChange={setTheme} options={[{ value:'light', label:'Light' },{ value:'dark', label:'Dark' }]} /></div>
    <p className="shuffle-reference">Interaction reference: <a href="https://www.awwwards.com/inspiration/draggable-info-panels-stefano-bartoletti-portfolio" target="_blank" rel="noreferrer">Stefano Bartoletti’s draggable panels on Awwwards ↗</a>. An original deck composition, built with Duoop’s type, surfaces and tactile controls.</p>
  </Card>;
}
export function ShufflePreview() {
  return <span className="shuffle-mini"><span /><span /><span><small>IDEAS IN MOTION</small><strong>Your next move.</strong></span></span>;
}
