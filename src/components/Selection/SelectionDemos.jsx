import React, { useEffect, useId, useRef, useState } from 'react';
import { RadioGroup, Switch } from './Selection';
import { Button, ActionFeedback } from '../Button/Button';
import { Input } from '../Forms/Input';

const channels = [{ value: 'email', label: 'Email' }, { value: 'push', label: 'Push' }, { value: 'sms', label: 'SMS' }];
const descriptions = ['A considered summary, delivered to your inbox.', 'Timely updates on your device.', 'Only the moments that need your attention.'];
function ChannelIcon({ channel }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    {channel === 'email' ? <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></> : channel === 'push' ? <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></> : <><path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z" /><path d="M7 9h9M7 13h6" /></>}
  </svg>;
}
export function LayoutPreview({ type = 'editorial' }) {
  return <svg viewBox="0 0 180 110" fill="none"><rect x="10" y="5" width="160" height="100" rx="6" fill="var(--selection-bg,#fff)" stroke="var(--selection-border,#777474)" strokeWidth="2" /><path d="M10 23h160M21 14h28" stroke="var(--selection-border,#777474)" strokeWidth="2" />{type === 'editorial' ? <><rect x="22" y="35" width="62" height="56" rx="3" fill="var(--selection-soft,#f0eeee)" /><path d="M96 39h58M96 49h48M96 65h58M96 74h54M96 83h35" stroke="var(--selection-border,#777474)" strokeWidth="3" /></> : <>{[22,70,118].map(x => <g key={x}><rect x={x} y="35" width="39" height="36" rx="3" fill="var(--selection-soft,#f0eeee)" /><path d={`M${x} 81h39M${x} 90h26`} stroke="var(--selection-border,#777474)" strokeWidth="2" /></g>)}</>}</svg>;
}
export const radioCompositions = [
  ['Classic vertical', 'Essentials'], ['Classic horizontal', 'Essentials'], ['With descriptions', 'Essentials'], ['With icons', 'Essentials'], ['Secondary information', 'Essentials'],
  ['Bordered rows', 'Surfaces'], ['Shared frame', 'Surfaces'], ['Compact cards', 'Surfaces'], ['Descriptive cards', 'Surfaces'], ['Cards with icons', 'Surfaces'], ['Cards with images', 'Surfaces'], ['Pricing cards', 'Surfaces'], ['Visual swatches', 'Surfaces'],
  ['Conditional content', 'Contexts'], ['In a form', 'Contexts'],
];
export function RadioDemo({ example = 'Classic vertical', layout: requestedLayout }) {
  const [value, setValue] = useState('email');
  const fieldId = useId();
  if (example === 'In a form') return <SelectionForm />;
  let options = channels;
  let layout = 'vertical';
  let variant = 'plain';
  let indicator = 'start';
  let legend = 'Delivery channel';
  if (example === 'Classic horizontal') layout = 'horizontal';
  if (['With descriptions', 'Descriptive cards', 'Cards with icons', 'Bordered rows', 'Shared frame'].includes(example)) options = channels.map((option, i) => ({ ...option, description: descriptions[i] }));
  if (['With icons', 'Cards with icons'].includes(example)) options = options.map(option => ({ ...option, icon: <ChannelIcon channel={option.value} /> }));
  if (example === 'Secondary information') options = channels.map((option, i) => ({ ...option, badge: ['Recommended', 'Instant', 'Unavailable'][i], disabled: i === 2 }));
  if (example === 'Bordered rows') variant = 'row';
  if (example === 'Shared frame') variant = 'list';
  if (['Compact cards', 'Descriptive cards', 'Cards with icons', 'Cards with images', 'Pricing cards', 'Visual swatches'].includes(example)) { variant = 'card'; layout = requestedLayout || 'grid'; }
  if (['Cards with icons', 'Cards with images', 'Pricing cards', 'Visual swatches'].includes(example)) indicator = 'corner';
  if (example === 'Cards with images') { legend = 'Starting layout'; options = [{ value: 'email', label: 'Editorial', description: 'A story with room to breathe.', image: <LayoutPreview /> }, { value: 'grid', label: 'Gallery', description: 'Your work, side by side.', image: <LayoutPreview type="grid" /> }]; }
  if (example === 'Pricing cards') { legend = 'Your workspace plan'; options = [{ value: 'email', label: 'Personal', price: '$0', description: 'A place for your own ideas.', features: ['3 projects', 'Community support'] }, { value: 'studio', label: 'Studio', badge: 'Recommended', price: '$19', description: 'For teams building together.', features: ['Unlimited projects', 'Shared libraries', 'Priority support'] }]; }
  if (example === 'Visual swatches') { legend = 'Notebook cover'; options = [{ value: 'email', label: 'Chalk', swatch: '#e7e2da' }, { value: 'graphite', label: 'Graphite', swatch: '#454140' }, { value: 'linen', label: 'Linen', swatch: 'repeating-linear-gradient(45deg,#cdc6bb 0 3px,#f2eee7 3px 7px)' }]; }
  if (example === 'Conditional content') { legend = 'Delivery schedule'; options = [{ value: 'email', label: 'As it happens', description: 'Send each update when it is ready.' }, { value: 'custom', label: 'Daily digest', description: 'Bundle updates at your preferred time.' }]; }
  return <RadioGroup legend={legend} options={options} value={value} onChange={event => setValue(event.target.value)} layout={layout} variant={variant} indicator={indicator}>{example === 'Conditional content' && value === 'custom' && <div className="selection-reveal"><label className="selection-field" htmlFor={fieldId}>Delivery time<Input id={fieldId} type="time" defaultValue="09:00" /></label></div>}</RadioGroup>;
}
export const switchCompositions = [
  ['Standalone', 'Essentials'], ['Label on the right', 'Essentials'], ['Label on the left', 'Essentials'], ['With description', 'Essentials'], ['External icon', 'Essentials'], ['Internal icons', 'Essentials'], ['State indicator', 'Essentials'],
  ['Settings row', 'Surfaces'], ['Bordered card', 'Surfaces'], ['Settings list', 'Surfaces'], ['Conditional content', 'Contexts'], ['Async save', 'Contexts'], ['In a form', 'Contexts'],
];
export function SwitchDemo({ example = 'Label on the right' }) {
  const [checked, setChecked] = useState(['With description', 'Bordered card', 'Internal icons'].includes(example));
  const id = useId();
  if (example === 'In a form') return <SelectionForm kind="switch" />;
  if (example === 'Async save') return <AsyncSwitch />;
  if (example === 'Settings list') return <div className="selection-settings-list"><Switch label="Project activity" description="Changes across your shared projects." position="end" defaultChecked /><Switch label="Weekly summary" description="A little perspective, every Monday." position="end" /><Switch label="Product news" description="New features and improvements." position="end" /></div>;
  const description = ['With description', 'Bordered card', 'Conditional content'].includes(example) ? 'Keep a secure copy of your workspace up to date.' : undefined;
  return <div><Switch label={example === 'Standalone' ? undefined : 'Automatic backup'} aria-label={example === 'Standalone' ? 'Automatic backup' : undefined} checked={checked} onChange={event => setChecked(event.target.checked)} description={description} position={['Label on the left', 'Settings row', 'Bordered card', 'Conditional content'].includes(example) ? 'end' : 'start'} variant={example === 'Bordered card' ? 'card' : example === 'Settings row' ? 'row' : 'plain'} icon={example === 'External icon' ? '↥' : undefined} internalIcons={example === 'Internal icons'} showState={example === 'State indicator'} />{example === 'Conditional content' && checked && <div className="selection-reveal"><label className="selection-field" htmlFor={id}>Backup folder<Input id={id} defaultValue="Workspace / Backups" /></label><Switch label="Include project assets" defaultChecked /></div>}</div>;
}
export function AsyncSwitch() {
  const [checked, setChecked] = useState(false);
  const [status, setStatus] = useState('idle');
  const [fail, setFail] = useState(false);
  const timer = useRef(null);
  const id = useId();
  useEffect(() => () => clearTimeout(timer.current), []);
  function save(event) {
    const previous = checked;
    setChecked(event.target.checked);
    setStatus('loading');
    timer.current = setTimeout(() => { if (fail) { setChecked(previous); setStatus('error'); } else setStatus('success'); }, 900);
  }
  return <div className="selection-async"><Switch label="Cloud backup" description="Save a copy in your connected workspace." checked={checked} onChange={save} pending={status === 'loading'} position="end" error={status === 'error' ? 'Backup could not be saved. The previous setting was restored. Try again.' : undefined} aria-describedby={`${id}-status`} /><div id={`${id}-status`} role="status" className="selection-status">{status === 'loading' ? 'Saving…' : status === 'success' ? <ActionFeedback>Backup {checked ? 'enabled' : 'disabled'}.</ActionFeedback> : ''}</div><Switch label="Simulate a failed save" size="sm" checked={fail} disabled={status === 'loading'} onChange={event => setFail(event.target.checked)} /><p className="selection-help">Local demo · simulated 900 ms response. No data is sent.</p></div>;
}
export function SelectionForm({ kind = 'radio' }) {
  const [value, setValue] = useState(kind === 'radio' ? '' : false);
  const [attempted, setAttempted] = useState(false);
  const [saved, setSaved] = useState(false);
  const [revision, setRevision] = useState(0);
  const form = useRef(null);
  const error = attempted && !value ? (kind === 'radio' ? 'Choose a delivery channel to continue.' : 'Enable activity logging to continue.') : '';
  function submit(event) { event.preventDefault(); setAttempted(true); setSaved(!!value); setRevision(current => current + 1); if (!value) form.current.querySelector('input').focus(); }
  function update(event) { setValue(kind === 'radio' ? event.target.value : event.target.checked); setSaved(false); }
  return <form ref={form} className="selection-form" noValidate onSubmit={submit} onReset={() => { setValue(kind === 'radio' ? '' : false); setAttempted(false); setSaved(false); }}>
    {kind === 'radio' ? <RadioGroup name="channel" legend="Delivery channel" description="Select one channel for your project updates." options={channels} value={value} onChange={update} required error={error} /> : <Switch name="logging" label="Activity logging" description="Required to keep a history of workspace changes." checked={value} onChange={update} required error={error} />}
    <div className="selection-actions"><Button type="submit" size="sm" status={saved ? 'success' : 'idle'} successLabel="Preferences saved">Save preferences</Button><Button type="reset" size="sm" variant="ghost">Reset</Button></div>
    <ActionFeedback replayKey={revision}>{saved ? 'Preferences saved in this demo.' : ''}</ActionFeedback>
  </form>;
}
export function StateLab({ kind }) {
  const [disabled, setDisabled] = useState(false);
  const [initial, setInitial] = useState(true);
  const [layout, setLayout] = useState('grid');
  const [dark, setDark] = useState(false);
  return <div className="selection-state-lab"><div className="selection-lab-tools"><Switch label="Disable group" checked={disabled} onChange={event => setDisabled(event.target.checked)} /><Switch label="Default value" checked={initial} onChange={event => setInitial(event.target.checked)} /><Switch label="Dark surface" checked={dark} onChange={event => setDark(event.target.checked)} />{kind === 'radio' && <Switch label="Stack cards" checked={layout === 'vertical'} onChange={event => setLayout(event.target.checked ? 'vertical' : 'grid')} />}</div><div className="selection-surface" data-theme={dark ? 'dark' : 'light'}>
    <span className="selection-kicker">YOUR WORKSPACE</span><h4>A setting for every state.</h4><p className="selection-help">Try a label, then Tab and {kind === 'radio' ? 'the arrow keys' : 'Space'}. Disabled values stay visible.</p>
    {kind === 'radio' ? <RadioGroup key={String(initial)} legend="Workspace access" description="One exclusive choice. Two options are managed by your administrator." disabled={disabled} defaultValue={initial ? 'managed' : undefined} variant="card" layout={layout} options={[{ value: 'private', label: 'Private', description: 'Only invited teammates.' }, { value: 'public', label: 'Public', description: 'Anyone with the link.' }, { value: 'managed', label: 'Managed', description: 'Selected and unavailable.', disabled: true }, { value: 'archived', label: 'Archived', description: 'Unavailable.', disabled: true }]} /> : <fieldset disabled={disabled} className="selection-group" key={String(initial)}><legend>Backup preferences</legend><div className="selection-settings-list">{['sm', 'default', 'lg'].map((size, i) => <Switch key={size} size={size} label={['Small', 'Standard', 'Large'][i]} defaultChecked={initial} position="end" />)}<Switch label="Disabled off" disabled position="end" /><Switch label="Disabled on" disabled defaultChecked position="end" /></div></fieldset>}
  </div></div>;
}
