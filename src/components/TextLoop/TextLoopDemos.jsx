import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { TextLoop } from './TextLoop';
import { Button } from '../Button/Button';
import { ColorControl } from '../Button/ColorControl';
import { luminance } from '../Button/buttonColor';
import { Input } from '../Forms/Input';
import { Select } from '../Select/Select';
import '../Feedback/Feedback.css';

const shapes = ['wave', 'circle', 'arch', 'line'];
export const textLoopExamples = [['Rolling wave', 'Ribbons'], ['Full circle', 'Ribbons'], ['An upward curve', 'Ribbons'], ['Straight ahead', 'Typography'], ['After hours', 'Typography']];
const presets = {
  'Rolling wave': { shape: 'wave', text: 'Make some waves', expression: 1 },
  'Full circle': { shape: 'circle', text: 'Keep creating', fontSize: 40 },
  'An upward curve': { shape: 'arch', text: 'On the rise' },
  'Straight ahead': { shape: 'line', text: 'Less noise. More feeling.', ribbon: false, expression: 0.2 },
  'After hours': { shape: 'wave', text: 'Stay curious', direction: 'reverse' },
};

export function TextLoopDemo({ example }) {
  const [paused, setPaused] = useState(false);
  return <div className="text-loop-stage feedback-surface" data-theme={example === 'After hours' ? 'dark' : 'light'}>
    <TextLoop {...presets[example]} paused={paused} />
    <div className="text-loop-footer"><span>Continuous type / {presets[example]?.shape}</span><Button size="sm" variant="outline" selected={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Resume' : 'Pause'}</Button></div>
  </div>;
}

export function TextLoopPlayground() {
  const [text, setText] = useState('Made to move');
  const [shape, setShape] = useState('wave');
  const [theme, setTheme] = useState('light');
  const [ribbonColor, setRibbonColor] = useState('');
  const ribbonInk = ribbonColor ? (luminance(ribbonColor.slice(1).match(/../g).map(channel => parseInt(channel, 16))) < 0.179 ? '#ffffff' : '#000000') : undefined;
  const [speed, setSpeed] = useState(90);
  const [curviness, setCurviness] = useState(60);
  const [expression, setExpression] = useState(0.8);
  const [direction, setDirection] = useState('forward');
  const [ribbon, setRibbon] = useState(true);
  const [paused, setPaused] = useState(false);
  return <Card variant="elevated" interactive className="text-loop-playground playground-card" aria-label="Text Loop playground">
    <div className="text-loop-stage feedback-surface" data-theme={theme}>
      <div className="text-loop-meta"><span>A LITTLE TYPE, A LITTLE LIFE</span><span>Letter by letter</span></div>
      <TextLoop text={text} shape={shape} speed={speed} curviness={curviness} expression={expression} direction={direction} ribbon={ribbon} ribbonColor={ribbonColor || undefined} color={ribbon ? ribbonInk : undefined} paused={paused} />
      <div className="text-loop-footer"><p>A little rhythm. A lasting impression.</p><Button variant="outline" size="sm" selected={paused} onClick={() => setPaused(value => !value)}>{paused ? 'Resume' : 'Pause'}</Button></div>
    </div>
    <div className="text-loop-controls feedback-lab-controls">
      <label className="text-loop-words">Your words<Input value={text} maxLength={80} onChange={event => setText(event.target.value)} /></label>
      <Select label="Shape" value={shape} onValueChange={setShape} width="full" options={shapes.map(value => ({ value, label: value[0].toUpperCase() + value.slice(1) }))} />
      <Select label="Surface" value={theme} onValueChange={setTheme} width="full" options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
      <label>Speed · {speed} units/s<input type="range" min="0" max="180" step="10" value={speed} onChange={event => setSpeed(Number(event.target.value))} /></label>
      <label>Curvature · {curviness}<input type="range" min="0" max="100" value={curviness} disabled={shape === 'line'} onChange={event => setCurviness(Number(event.target.value))} /></label>
      <label>Accent motion · {Math.round(expression * 100)}%<input type="range" min="0" max="1" step="0.05" value={expression} onChange={event => setExpression(Number(event.target.value))} /></label>
      <div className="text-loop-actions"><Button size="sm" variant="outline" selected={direction === 'reverse'} onClick={() => setDirection(value => value === 'forward' ? 'reverse' : 'forward')}>Reverse</Button><Button size="sm" variant="outline" selected={ribbon} onClick={() => setRibbon(value => !value)}>Ribbon</Button></div>
      <ColorControl label="Ribbon color" value={ribbonColor} onChange={setRibbonColor} fallback={theme === 'dark' ? '#252323' : '#ffffff'} description="Choose the ribbon’s fill. Text contrast adapts automatically; shadows keep their original color." />
    </div>
    <p className="text-loop-note">Hover over the ribbon to pause. Motion also pauses off screen and follows your system’s reduced-motion preference.</p>
  </Card>;
}

export function TextLoopPreview() {
  return <span className="text-loop-mini"><TextLoop text="Made to move" paused fontSize={58} curviness={45} /></span>;
}

