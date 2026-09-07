import React, { useId, useRef, useState } from 'react';
import { Checkbox, CheckboxGroup, selectionState, toggleSelection } from './Checkbox';
import { Button, ActionFeedback } from '../Button/Button';

export function SelectionExample({ initial = 'unchecked', ...props }) {
  const [value, setValue] = useState(initial);
  return <Checkbox {...props} checked={value === 'checked'} indeterminate={value === 'mixed'} onChange={event => setValue(event.target.checked ? 'checked' : 'unchecked')} />;
}

export function GroupExample({ layout = 'vertical', disabled = false, disabledOption = false, parent = false, initial = ['design'], cards = false }) {
  const [selected, setSelected] = useState(initial);
  const options = [['design', 'Design'], ['engineering', 'Engineering'], ['research', 'Research']];
  const actionable = options.filter(([value]) => !(disabledOption && value === 'research')).map(([value]) => value);
  function update(values, checked) { setSelected(current => toggleSelection(current, values, checked)); }
  return <CheckboxGroup legend="Project teams" description={parent ? `${selected.length} of 3 selected` : undefined} layout={layout} disabled={disabled}>
    {parent && <Checkbox label="Select all teams" {...selectionState(actionable, selected)} onChange={event => update(actionable, event.target.checked)} />}
    {options.map(([value, label]) => <Checkbox key={value} name="teams" value={value} label={label} variant={cards ? 'card' : 'plain'} checked={selected.includes(value)} disabled={disabledOption && value === 'research'} description={disabledOption && value === 'research' ? 'Managed by your administrator.' : cards ? 'Include this team in your project.' : undefined} onChange={event => update([value], event.target.checked)} />)}
  </CheckboxGroup>;
}

const permissions = [
  { label: 'Projects', children: [{ label: 'Content', children: [{ label: 'View projects', value: 'view' }, { label: 'Edit projects', value: 'edit' }] }, { label: 'Archive projects', value: 'archive' }] },
  { label: 'Members', children: [{ label: 'Invite members', value: 'invite' }, { label: 'Remove members', value: 'remove' }] },
];
function descendants(node) { return node.value ? [node.value] : node.children.flatMap(descendants); }
function PermissionBranch({ node, selected, update }) {
  const values = descendants(node);
  return <div><Checkbox label={node.label} {...selectionState(values, selected)} onChange={event => update(values, event.target.checked)} />{node.children && <div className="checkbox-children" role="group" aria-label={node.label}>{node.children.map(child => <PermissionBranch key={child.label} node={child} selected={selected} update={update} />)}</div>}</div>;
}
export function NestedExample() {
  const [selected, setSelected] = useState(['view']);
  const values = permissions.flatMap(descendants);
  const update = (items, checked) => setSelected(current => toggleSelection(current, items, checked));
  return <CheckboxGroup legend="Workspace permissions"><Checkbox label="All permissions" {...selectionState(values, selected)} onChange={event => update(values, event.target.checked)} /><div className="checkbox-children">{permissions.map(node => <PermissionBranch key={node.label} node={node} selected={selected} update={update} />)}</div></CheckboxGroup>;
}

export function CheckboxForm({ group = false }) {
  const [accepted, setAccepted] = useState(false);
  const [channels, setChannels] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  const first = useRef(null);
  const id = useId();
  const error = submitted && (group ? channels.length === 0 : !accepted) ? (group ? 'Choose at least one channel.' : 'Accept the terms to continue.') : '';
  function submit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (group ? channels.length === 0 : !accepted) {
      setNotice(''); first.current.focus();
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const control = first.current.closest('.duoop-checkbox');
        control.getAnimations().forEach(animation => animation.cancel());
        control.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-3px)' }, { transform: 'translateX(3px)' }, { transform: 'translateX(0)' }], { duration: 240, easing: 'ease-out' });
      }
      return;
    }
    const data = new FormData(event.currentTarget);
    setNotice(group ? `Saved channels: ${data.getAll('channels').join(', ')}.` : `Terms accepted: ${data.get('terms')}.`);
  }
  return <form className="checkbox-demo-form" noValidate onSubmit={submit} onReset={() => { setAccepted(false); setChannels([]); setSubmitted(false); setNotice(''); }}>
    {group ? <CheckboxGroup legend="Notification channels (required)" description="Choose one or more channels." error={error}>
      {['Email', 'Push', 'SMS'].map((channel, index) => <Checkbox ref={index === 0 ? first : undefined} key={channel} label={channel} value={channel} name="channels" checked={channels.includes(channel)} aria-invalid={error ? true : undefined} aria-describedby={error ? `${id}-error` : undefined} onChange={event => { setChannels(current => toggleSelection(current, [channel], event.target.checked)); setNotice(''); }} />)}
    </CheckboxGroup> : <Checkbox ref={first} label="Accept terms and conditions" description="Required to create your workspace." required name="terms" value="yes" checked={accepted} error={error} onChange={event => { setAccepted(event.target.checked); setNotice(''); }} />}
    <span id={`${id}-error`} className="sr-only">{error}</span>
    <div className="checkbox-form-actions"><Button type="submit" size="sm" status={notice ? 'success' : 'idle'} successLabel="Preferences saved">Save preferences</Button><Button type="reset" variant="ghost" size="sm">Reset</Button></div>
    <ActionFeedback className="checkbox-form-notice">{notice && (group ? `Preferences saved · ${channels.join(', ')}` : 'Preferences saved. Your workspace is ready.')}</ActionFeedback>
  </form>;
}

export function TableExample() {
  const [selected, setSelected] = useState(['brief']);
  const rows = [['brief', 'Design brief', 'Document'], ['assets', 'Brand assets', 'Folder'], ['notes', 'Meeting notes', 'Document']];
  const values = rows.map(([id]) => id);
  const update = (items, checked) => setSelected(current => toggleSelection(current, items, checked));
  return <div className="checkbox-table-wrap"><table className="checkbox-table"><caption>Project files · {selected.length} selected</caption><thead><tr><th><Checkbox aria-label="Select all files" {...selectionState(values, selected)} onChange={event => update(values, event.target.checked)} /></th><th scope="col">Name</th><th scope="col">Type</th></tr></thead><tbody>{rows.map(([id, name, type]) => <tr key={id} data-selected={selected.includes(id)}><td><Checkbox aria-label={`Select ${name}`} checked={selected.includes(id)} onChange={event => update([id], event.target.checked)} /></td><th scope="row">{name}</th><td>{type}</td></tr>)}</tbody></table></div>;
}

export function InteractionExample() {
  return <CheckboxGroup legend="Try Tab, then Space" description="Hover or press any label. Focus stays visible in every selection state.">{['unchecked', 'checked', 'mixed'].map(initial => <SelectionExample key={initial} initial={initial} label={initial === 'mixed' ? 'Partially selected' : initial === 'checked' ? 'Selected' : 'Not selected'} />)}</CheckboxGroup>;
}
export function ThemeExample({ dark = false, rtl = false }) {
  return <div className="checkbox-surface" data-theme={dark ? 'dark' : 'light'} dir={rtl ? 'rtl' : 'ltr'} lang={rtl ? 'ar' : 'en'}>
    <header className="theme-settings-heading"><span className="theme-kicker">{rtl ? 'مساحة العمل' : 'WORKSPACE'}</span><strong>{rtl ? 'ابق على اطلاع' : 'Make it your space.'}</strong><p>{rtl ? 'اختر التحديثات التي تهمك.' : 'Choose the updates that matter to you.'}</p></header>
    <SelectionExample initial="checked" variant="card" label={rtl ? 'إشعارات المشروع' : 'Project notifications'} description={rtl ? 'تلقي تحديثات عن نشاط الفريق' : 'The important moments, as they happen.'} />
    <CheckboxGroup className="theme-secondary-options" legend={rtl ? 'تفضيلات إضافية' : 'Fine-tune your updates'}>
      <SelectionExample initial="mixed" label={rtl ? 'ملخصات الفريق' : 'Team summaries'} description={rtl ? 'بعض الفرق مختارة' : 'Some teams are selected.'} />
      <SelectionExample label={rtl ? 'أخبار المنتج' : 'Product news'} description={rtl ? 'إصدارات جديدة، بدون ضجيج' : 'New releases. No extra noise.'} />
    </CheckboxGroup>
    <footer className="theme-settings-footer"><span aria-hidden="true">◌</span>{rtl ? 'يمكنك تغيير هذه الخيارات في أي وقت' : 'Always yours to change.'}</footer>
  </div>;
}
export function DocumentIllustration() {
  return <svg viewBox="0 0 180 128" fill="none" strokeWidth="1.6"><g className="brief-sheet brief-sheet--back"><rect x="55" y="14" width="66" height="96" rx="5" /></g><g className="brief-sheet brief-sheet--front"><rect x="57" y="10" width="66" height="96" rx="5" /><path className="brief-lines" d="M69 26h18M69 34h40M69 74h40M69 81h32M69 88h22" /><rect x="69" y="44" width="40" height="20" rx="3" fill="var(--check-soft)" stroke="none" /><path className="brief-lines" d="m76 58 8-8 8 7 7-5 5 6" /></g></svg>;
}

