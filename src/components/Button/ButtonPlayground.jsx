import { Card } from '../Card/Card';
import { ColorControl } from './ColorControl';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from './Button';
import { Example } from './Documentation';
import examples from './examples.json';

function Icon({ name = 'arrow' }) {
  return <svg className={name === 'star' ? 'favorite-star' : undefined} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{name === 'plus' ? <path d="M12 5v14M5 12h14" /> : name === 'star' ? <><path className="favorite-star-fill" fill="#facc15" stroke="none" d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></> : name === 'trash' ? <><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7" /></> : <path d="M4 12h16m-6-6 6 6-6 6" />}</svg>;
}
function Choice({ label, value, onChange, options }) {
  return <label>{label}<select value={value} onChange={e => onChange(e.target.value)}>{options.map(([value, text]) => <option key={value} value={value}>{text}</option>)}</select></label>;
}
export function ButtonPlayground({ preset = {} }) {
  const [color, setColor] = useState('');
  const [variant, setVariant] = useState(preset.variant ?? 'solid');
  const [motion, setMotion] = useState(preset.motion ?? 'tactile');
  const [size, setSize] = useState(preset.size ?? 'md');
  const [disabled, setDisabled] = useState(preset.disabled ?? false);
  const [label, setLabel] = useState(preset.label ?? 'Continue');
  const [content, setContent] = useState(preset.content ?? 'text');
  const [width, setWidth] = useState(preset.width ?? 'auto');
  const [behavior, setBehavior] = useState(preset.behavior ?? 'click');
  const [status, setStatus] = useState(preset.status ?? 'idle');
  const [selected, setSelected] = useState(false);
  const [message, setMessage] = useState('Click to test.');
  const timers = useRef([]);
  const locked = useRef(false);
  const reset = () => { timers.current.forEach(clearTimeout); timers.current = []; locked.current = false; setStatus('idle'); setSelected(false); setMessage('Click to test.'); };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  function act(action = behavior) {
    if (locked.current) return;
    if (action === 'toggle') { setSelected(!selected); setMessage(selected ? 'Favorite removed.' : 'Favorite selected.'); return; }
    if (action === 'click') { setMessage('Click registered.'); return; }
    const retry = status === 'error';
    locked.current = true; setStatus('loading'); setMessage('Demo: action in progress…');
    timers.current.push(setTimeout(() => {
      if (action === 'error' && !retry) { locked.current = false; setStatus('error'); setMessage('Simulated failure. Click Retry.'); }
      else { setStatus('success'); setMessage('Action completed.'); timers.current.push(setTimeout(() => { locked.current = false; setStatus('idle'); }, 1600)); }
    }, 1200));
  }
  let playgroundCode = examples.playground.replaceAll("behavior === 'toggle' ? 'star' : 'arrow'", "behavior === 'toggle' ? 'star' : " + JSON.stringify(preset.iconName ?? 'arrow')); 
  for (const [name, value] of Object.entries({ variant, motion, size, disabled, label, content, width, behavior, status })) {
    const setter = 'set' + name[0].toUpperCase() + name.slice(1);
    // Replace the initial setting only; event handlers remain identical to the preview.
    const line = playgroundCode.split('\n').find(line => line.includes('const [' + name + ', '));
    if (line) playgroundCode = playgroundCode.replace(line, '  const [' + name + ', ' + setter + '] = useState(' + JSON.stringify(value) + ');');
  }
  if (color) playgroundCode = playgroundCode.replace('return (<Button ', 'return (<Button color="' + color + '" ');
  if (preset.href) playgroundCode = playgroundCode.replace('return (<Button ', 'return (<Button href={' + JSON.stringify(preset.href) + '} ');
  return (<Card variant="elevated" interactive className="doc-section playground-card" id="button-playground"><h3>Playground</h3><p>Adjust the button, then copy the code for your settings.</p><Example code={playgroundCode} label="Playground">
    <div className="button-playground">
      <div className="button-stage"><span className="stage-caption">PREVIEW</span>
        <div className="stage-button"><Button color={color || undefined} href={preset.href} variant={variant} motion={motion} iconMotion={behavior === 'toggle' ? 'star' : (preset.iconName ?? 'arrow')} size={size} disabled={disabled} fullWidth={width === 'full'} status={status} selected={behavior === 'toggle' ? selected : undefined} icon={content === 'text' ? undefined : <Icon name={behavior === 'toggle' ? 'star' : (preset.iconName ?? 'arrow')} />} iconPosition={content === 'text' ? 'left' : content} aria-label={content === 'only' ? (label.trim() || 'Continue') : undefined} onClick={() => act()}>{label.trim() || 'Continue'}</Button></div>
        <span className="stage-feedback" role="status">{message}</span>
      </div>
      <div className="button-controls"><ColorControl value={color} onChange={setColor} fallback={variant.startsWith('destructive') ? '#b42332' : '#373434'} />
        <label>Text<input value={label} maxLength={160} onChange={e => setLabel(e.target.value)} /></label>
        <Choice label="Variant" value={variant} onChange={setVariant} options={[["solid", "Primary"], ["outline", "Outline"], ["ghost", "Ghost"], ["destructive", "Destructive"], ["destructive-outline", "Destructive outline"], ["link", "Link · text"]]} />
        <Choice label="Animation" value={motion} onChange={setMotion} options={[["discreet", "Subtle"], ["tactile", "Tactile"], ["expressive", "Expressive"]]} />
        <Choice label="Size" value={size} onChange={setSize} options={[["sm", "Small"], ["md", "Standard"], ["lg", "Large"]]} />
        <Choice label="Content" value={content} onChange={setContent} options={[["text", "Text only"], ["left", "Left icon"], ["right", "Right icon"], ["only", "Icon only"]]} />
        <Choice label="Width" value={width} onChange={setWidth} options={[["auto", "Fit content"], ["full", "Full width"]]} />
        <Choice label="On click" value={behavior} onChange={value => { reset(); setBehavior(value); }} options={[["click", "Simple action"], ["success", "Loading → success"], ["error", "Error → retry"], ["toggle", "Toggle / favorite"]]} />
        <label className="disabled-control"><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disabled</label>
      </div>
    </div>
    </Example></Card>);
}

