import React, { useState } from 'react';
import { Autocomplete } from './Autocomplete';
import { Button } from '../Button/Button';

const tools = [
  { value:'figma', label:'Figma', description:'Interface design and prototypes', group:'Design' },
  { value:'framer', label:'Framer', description:'Interactive websites', group:'Design' },
  { value:'sketch', label:'Sketch', description:'Design on macOS', group:'Design', disabled:true },
  { value:'github', label:'GitHub', description:'Code and collaboration', group:'Development' },
  { value:'linear', label:'Linear', description:'Issues and project planning', group:'Development' },
  { value:'notion', label:'Notion', description:'Notes and shared knowledge', group:'Writing' },
  { value:'obsidian', label:'Obsidian', description:'Connected personal notes', group:'Writing' },
];
const simpleTools = tools.map(({ value, label, disabled }) => ({ value, label, disabled }));
const cities = ['Amsterdam','Barcelona','Berlin','Copenhagen','Dublin','Edinburgh','Florence','Helsinki','Lisbon','London','Lyon','Madrid','Marseille','Milan','Montréal','Oslo','Paris','Porto','Prague','Reykjavík','Rome','Stockholm','Vienna','Zürich'].map(label => ({ value:label, label }));

export const autocompleteExamples = [
  ['Default','Essentials'], ['Clear and trigger','Essentials'], ['Search icon','Essentials'],
  ['Small','Sizes'], ['Large','Sizes'],
  ['Grouped suggestions','Content'], ['Long list','Content'], ['No results','Content'],
  ['Auto highlight','Behavior'], ['Controlled value','Behavior'], ['Disabled','States'], ['Form validation','States'],
];

export function AutocompleteDemo({ example }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  if (example === 'Form validation') return <form className="autocomplete-demo" noValidate onSubmit={event => {
    event.preventDefault();
    if (!value.trim()) { setError('Enter a tool name or choose a suggestion.'); event.currentTarget.elements.tool.focus(); return; }
    setError(''); setSaved(true);
  }}>
    <Autocomplete items={simpleTools} name="tool" label="Preferred tool" placeholder="Choose or type a tool…" required value={value} onValueChange={next => { setValue(next); setError(''); setSaved(false); }} error={error} showClear />
    <Button type="submit" status={saved ? 'success' : 'idle'}>{saved ? 'Preference saved' : 'Save preference'}</Button>
  </form>;
  const grouped = example === 'Grouped suggestions';
  return <div className="autocomplete-demo">
    <Autocomplete
      items={example === 'Long list' ? cities : grouped ? tools : simpleTools}
      label={example === 'Long list' ? 'City' : 'Tool'}
      placeholder={example === 'Long list' ? 'Search cities…' : 'Find your tool…'}
      description={grouped ? 'Explore by discipline, or type a name.' : 'Choose a suggestion or enter your own.'}
      size={example === 'Small' ? 'sm' : example === 'Large' ? 'lg' : 'md'}
      showClear={['Clear and trigger','Search icon','Controlled value','No results'].includes(example)}
      showTrigger={example === 'Clear and trigger' || grouped || example === 'Long list'}
      startAddon={example === 'Search icon' ? <svg viewBox="0 0 20 20"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg> : undefined}
      autoHighlight={example === 'Auto highlight'}
      disabled={example === 'Disabled'}
      defaultValue={example === 'No results' ? 'Paper planner' : example === 'Disabled' ? 'Figma' : ''}
      {...(example === 'Controlled value' ? { value, onValueChange:setValue } : {})}
    />
    {example === 'Controlled value' && <><p className="autocomplete-demo-note" role="status">Current value: {value || 'Nothing entered yet'}</p><Button variant="outline" size="sm" onClick={() => setValue('')}>Reset value</Button></>}
  </div>;
}

export function AutocompletePreview() {
  return <span className="autocomplete-preview"><span>F<span aria-hidden="true">|</span></span><span><i>Figma</i><i>Framer</i></span></span>;
}
