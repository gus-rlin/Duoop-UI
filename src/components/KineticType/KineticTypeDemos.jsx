import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { KineticType } from './KineticType';
import { Button } from '../Button/Button';
import { Textarea } from '../Forms/Textarea';
import { Select } from '../Select/Select';
import '../Feedback/Feedback.css';
import '../Feedback/Experience.css';

export const kineticExamples = [['Scatter & settle', 'Entrances'], ['Rolling wave', 'Entrances'], ['Perspective flip', 'Entrances']];
const presets = { 'Scatter & settle': ['scatter', 'Make\nwaves.', 'light'], 'Rolling wave': ['wave', 'Good\nthings.', 'light'], 'Perspective flip': ['flip', 'Next\nchapter.', 'dark'] };
const surfaces = [{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }];

export function KineticTypeDemo({ example }) {
  const [replay, setReplay] = useState(0);
  const [effect, text, theme] = presets[example] || presets['Scatter & settle'];
  return <div className="kinetic-stage kinetic-demo feedback-surface experience-surface" data-theme={theme}>
    <div className="kinetic-stage__body"><KineticType text={text} effect={effect} replayKey={replay} /></div>
    <div className="kinetic-stage__footer"><span>{effect === 'scatter' ? '01 / Assemble' : effect === 'wave' ? '02 / Rise' : '03 / Turn'}</span><Button variant="outline" size="sm" onClick={() => setReplay(value => value + 1)} aria-label={`Replay ${example}`}>↻ Replay</Button></div>
  </div>;
}

export function KineticPlayground() {
  const [text, setText] = useState('Make some\nnoise.');
  const [effect, setEffect] = useState('scatter');
  const [theme, setTheme] = useState('light');
  const [duration, setDuration] = useState(1.8);
  const [replay, setReplay] = useState(0);
  const [paused, setPaused] = useState(false);
  return <Card variant="elevated" interactive className="kinetic-playground playground-card" aria-label="Kinetic Type playground">
    <div className="kinetic-stage feedback-surface experience-surface" data-theme={theme}>
      <div className="kinetic-stage__meta"><span>Type in motion</span><span>Interactive preview</span></div>
      <div className="kinetic-stage__body"><KineticType as="h3" text={text} effect={effect} duration={duration} replayKey={replay} paused={paused} /></div>
      <div className="kinetic-stage__footer"><p>A few words. A proper entrance.</p><div className="kinetic-stage__actions"><Button variant="outline" size="sm" onClick={() => setPaused(value => !value)} selected={paused}>{paused ? 'Resume' : 'Pause'}</Button><Button size="sm" onClick={() => { setPaused(false); setReplay(value => value + 1); }}>↻ Replay animation</Button></div></div>
    </div>
    <div className="kinetic-controls">
      <label>Your words<Textarea value={text} maxLength={80} rows={2} onChange={event => setText(event.target.value)} /></label>
      <fieldset><legend>Choreography</legend><div className="kinetic-presets">{['scatter', 'wave', 'flip'].map(value => <Button variant="outline" size="sm" key={value} selected={effect === value} onClick={() => setEffect(value)}>{value[0].toUpperCase() + value.slice(1)}</Button>)}</div></fieldset>
      <div className="kinetic-controls__stack"><Select label="Surface" width="full" value={theme} onValueChange={setTheme} options={surfaces} /><label>Duration · {duration.toFixed(1)}s<input type="range" min="0.6" max="3" step="0.1" value={duration} onChange={event => setDuration(Number(event.target.value))} /></label></div>
    </div>
    <p className="kinetic-note">Plays once when visible. Replay on demand. Reduced-motion preferences keep your words still and readable.</p>
  </Card>;
}

export function KineticPreview() {
  return <span className="kinetic-mini"><KineticType text={'Make it\nmove.'} duration={1.6} /></span>;
}
