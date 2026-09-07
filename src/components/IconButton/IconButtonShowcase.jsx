import { ColorControl } from '../Button/ColorControl';
import React, { useState } from 'react';
import { IconButton } from './IconButton';
import source from './IconButton.jsx?raw';
import { Example, SourceFiles } from '../Button/Documentation';
import iconExamples from './examples.json';
import '../Button/showcase.css';


function ActionIcon({ name }) {
  const paths = { plus: 'M12 5v14M5 12h14', close: 'm6 6 12 12M6 18 18 6', arrow: 'M4 12h16m-6-6 6 6-6 6', trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7' };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}
const variants = [['solid', 'Solid'], ['outline', 'Outline'], ['ghost', 'Subtle'], ['destructive', 'Destructive'], ['destructive-outline', 'Destructive outline']];
export function IconButtonShowcase({ preset = {} }) {
  const [color, setColor] = useState('');
  const [variant, setVariant] = useState(preset.variant ?? 'outline');
  const [size, setSize] = useState(preset.size ?? 'md');
  const [action, setAction] = useState(preset.action ?? 'plus');
  const [disabled, setDisabled] = useState(preset.disabled ?? false);
  const [message, setMessage] = useState('Every icon has an accessible name.');
  const names = { plus: 'Add', close: 'Close', arrow: 'Next', trash: 'Delete' };
  const report = label => setMessage(`${label} : simulated action, no data changed.`);
  let configuredCode = iconExamples.playground;
  for (const [name, value] of Object.entries({ variant, size, action, disabled })) {
    const setter = 'set' + name[0].toUpperCase() + name.slice(1);
    const line = configuredCode.split('\n').find(line => line.includes('const [' + name + ', '));
    if (line) configuredCode = configuredCode.replace(line, '  const [' + name + ', ' + setter + '] = useState(' + JSON.stringify(value) + ');');
  }
  if (color) configuredCode = configuredCode.replace('return (<IconButton ', 'return (<IconButton color="' + color + '" ');
  return <section className="variant-section" aria-labelledby="icon-button-name">
    <div className="variant-heading"><h3 id="icon-button-name">Icon buttons</h3><p>Icon buttons with accessible labels.</p></div>
    <Example code={configuredCode} label="Icon playground">
    <div className="button-playground">
      <div className="button-stage"><span className="stage-caption">PREVIEW</span><IconButton color={color || undefined} icon={<ActionIcon name={action} />} label={names[action]} variant={variant} size={size} disabled={disabled} iconMotion={action === 'plus' ? 'plus' : action === 'arrow' ? 'arrow' : 'none'} onClick={() => report(names[action])} /><span className="stage-feedback" role="status">{message}</span></div>
      <div className="button-controls"><ColorControl value={color} onChange={setColor} fallback={variant.startsWith('destructive') ? '#b42332' : '#373434'} />
        <label>Icon<select value={action} onChange={e => setAction(e.target.value)}>{Object.entries(names).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Style<select value={variant} onChange={e => setVariant(e.target.value)}>{variants.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Format<select value={size} onChange={e => setSize(e.target.value)}><option value="sm">Small</option><option value="md">Standard</option><option value="lg">Large</option></select></label>
        <label className="disabled-control"><input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />Disabled</label>
      </div>
    </div>
    </Example>

    <section className="doc-section" id="icon-button-documentation"><h4>Source code · IconButton</h4><p>Provide icon and label to name the action. Place IconButton.jsx in a folder next to Button: it reuses its styles, sizes, and states.</p><SourceFiles files={[["IconButton.jsx", source]]} /></section>
  </section>;
}
