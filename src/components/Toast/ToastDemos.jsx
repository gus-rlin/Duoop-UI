import { Card } from '../Card/Card';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { Switch } from '../Selection/Selection';
import { Select } from '../Select/Select';
import { FeedbackIcon } from '../Feedback/FeedbackIcon';
import { useDemoOperation } from '../Progress/useDemoOperation';
import { Toast, ToastProvider, ToastViewport, AnchoredToast, useToast } from './Toast';

export const toastExamples = [
  ['Simple','Essentials'], ['With description','Essentials'], ['Success','Essentials'], ['Error','Essentials'], ['Warning','Essentials'], ['Information','Essentials'],
  ['Loading','Operations'], ['Async operation','Operations'], ['With undo','Operations'], ['With retry','Operations'], ['Contextual action','Operations'],
  ['Persistent','Timing & stacks'], ['Countdown','Timing & stacks'], ['With progress','Timing & stacks'], ['Stacked','Timing & stacks'], ['Deduplicated','Timing & stacks'],
  ['Anchored','Anchored'], ['Compact anchored','Anchored'],
];

const samples = {
  'Simple':{ title:'Changes saved' },
  'With description':{ title:'Workspace updated', description:'Your team can now see the latest project details.' },
  'Success':{ title:'Changes saved', description:'Everything is up to date.', status:'success', appearance:'tinted' },
  'Error':{ title:'Upload interrupted', description:'Your file is safe. Check your connection before trying again.', status:'error', appearance:'tinted' },
  'Warning':{ title:'Session expires soon', description:'Save your work before signing in again.', status:'warning', appearance:'tinted' },
  'Information':{ title:'A new version is available', description:'Your current workspace will stay open.', status:'info' },
  'Loading':{ title:'Ready to export', description:'Run the simulation to see the loading state.', status:'info' },
  'Async operation':{ title:'Ready to create an archive', description:'The same notification follows the whole operation.', status:'info' },
  'With undo':{ title:'Field-notes.md is in your workspace', description:'Archive the file, then undo to restore it.', status:'info' },
  'With retry':{ title:'Export failed', description:'The simulated connection was interrupted. Try again.', status:'error' },
  'Contextual action':{ title:'Field notes are ready', description:'Open the details from this notification.', status:'success' },
  'Persistent':{ title:'Review needed', description:'This notification stays until you dismiss it.', status:'warning' },
  'Countdown':{ title:'A little time to undo', description:'Archive the file to start the countdown. Hover or focus to pause.', status:'info' },
  'With progress':{ title:'Workspace export', description:'Ready to transfer a 240 MB archive.', progress:40, status:'info' },
  'Stacked':{ title:'Workspace saved', description:'Add notifications, then hover or focus the stack to expand it.', status:'success' },
  'Deduplicated':{ title:'Watching for changes', description:'Repeated saves update this notification in place.', status:'info' },
};

export function ToastDemo({ example }) {
  return <ToastProvider initialToasts={samples[example] ? [{ ...samples[example], id:'demo', duration:0 }] : []}><ToastScenario example={example} /></ToastProvider>;
}

function ToastScenario({ example }) {
  const { add, update, items } = useToast();
  const op = useDemoOperation();
  const [fail, setFail] = useState(false);
  const [archived, setArchived] = useState(false);
  const [details, setDetails] = useState(false);
  const count = useRef(0);
  const trigger = useRef(null);
  const restoreFocus = useRef(false);
  const detailsRef = useRef(null);
  const [container, setContainer] = useState(null);
  const [placement, setPlacement] = useState('top-center');
  const anchored = example === 'Anchored' || example === 'Compact anchored';
  const asyncExample = ['Loading','Async operation','With retry','With progress'].includes(example);
  const active = ['running','preparing','finalizing','paused'].includes(op.state);
  useEffect(() => {
    if (!asyncExample || !op.run) return;
    const status = op.state === 'success' ? 'success' : op.state === 'error' ? 'error' : 'loading';
    update('demo', {
      title:op.state === 'success' ? 'Archive ready' : op.state === 'error' ? 'Export interrupted' : op.state === 'finalizing' ? 'Verifying archive…' : 'Creating archive…',
      description:op.state === 'success' ? 'The archive was verified successfully.' : op.state === 'error' ? 'Your originals are safe. Retry the simulation.' : op.state === 'finalizing' ? 'Transfer complete. Checking the result before confirming.' : 'Simulated export · no files are uploaded.',
      status, duration:op.state === 'success' ? 5000 : 0,
      progress:example === 'With progress' ? op.value : undefined,
      action:op.state === 'error' ? { label:'Retry', onClick:() => begin(false) } : undefined,
    });
  }, [op.state, op.value, op.run, asyncExample, example, update]);
  useEffect(() => {
    if (example === 'With retry') update('demo', { action:{ label:'Retry', onClick:() => begin(false) } });
    if (example === 'Contextual action') update('demo', { action:{ label:'View file', onClick:() => setDetails(true) } });
  }, [example, update]);
  useEffect(() => { if (details) detailsRef.current?.focus(); }, [details]);
  useEffect(() => { if (!archived && restoreFocus.current) { trigger.current?.focus({ preventScroll:true }); restoreFocus.current = false; } }, [archived]);

  function begin(failure = fail) {
    add({ id:'demo', title:'Creating archive…', status:'loading', duration:0, action:undefined });
    op.start({ fail:failure });
  }
  function archive() {
    setArchived(true);
    add({ id:'demo', title:'File archived', description:'Field-notes.md was moved out of your workspace.', status:'success', duration:example === 'Countdown' ? 8000 : 0, countdown:example === 'Countdown', action:{ label:'Undo', onClick:() => {
      restoreFocus.current = true;
      setArchived(false);
      add({ id:'demo', title:'File restored', description:'Field-notes.md is back in your workspace.', status:'success', duration:5000, action:undefined, countdown:false });
    } } });
  }
  async function show(event) {
    setContainer(event.currentTarget.closest('dialog'));
    if (asyncExample) { begin(); return; }
    if (example === 'With undo' || example === 'Countdown') { archive(); return; }
    if (example === 'Stacked') {
      count.current += 1;
      ['Design tokens saved','New comment in Field notes','Archive verified','Workspace synchronized','All changes backed up'].forEach((title, index) => add({ title, id:`batch-${count.current}-${index}`, description:index % 2 ? 'A longer notification keeps its own height when the stack expands. All actions remain reachable from the keyboard.' : undefined, status:index === 1 ? 'info' : 'success', duration:6000 }));
      return;
    }
    if (example === 'Deduplicated') {
      count.current += 1;
      add({ id:'demo', title:`${count.current} change${count.current === 1 ? '' : 's'} saved`, description:'One stable ID. The existing toast is updated.', status:'success', duration:5000 });
      return;
    }
    if (anchored) {
      try {
        await navigator.clipboard.writeText('Workspace / Field-notes.md');
        add({ id:'demo', title:'Copied!', description:example === 'Anchored' ? 'The file path is on your clipboard.' : undefined, status:'success', density:example === 'Compact anchored' ? 'compact' : 'standard', duration:4000 });
      } catch {
        add({ id:'demo', title:'Copy unavailable', description:'Clipboard access was denied. Select the file path and copy it manually.', status:'error', density:'standard', duration:0 });
      }
      return;
    }
    add({ ...samples[example], id:'demo', duration:example === 'Persistent' ? 0 : 5000, action:example === 'Contextual action' ? { label:'View file', onClick:() => setDetails(true) } : undefined });
  }
  return <div className="feedback-demo feedback-surface">
    {anchored ? <div className="toast-anchor-preview"><Toast toast={{ title:example === 'Compact anchored' ? 'Copied!' : 'File path copied', description:example === 'Anchored' ? 'A confirmation close to its control.' : undefined, status:'success', density:example === 'Compact anchored' ? 'compact' : 'standard' }} /><p className="feedback-demo-note">Preview · activate Copy path to anchor the live notification.</p></div> : <div className="toast-demo-stage"><ToastViewport inline /></div>}
    {(example === 'With undo' || example === 'Countdown') && <div className="toast-file-state" role="status"><FeedbackIcon status="file" />Field-notes.md · {archived ? 'Archived' : 'In workspace'}</div>}
    {anchored && <><code className="toast-copy-path">Workspace / Field-notes.md</code><Select className="toast-placement-field" label="Placement" width="full" value={placement} onValueChange={setPlacement} options={['top','bottom','left','right'].map(side => ({ value:`${side}-center`, label:side }))} /></>}
    <div className="feedback-demo-actions"><Button ref={trigger} size="sm" variant="outline" disabled={active || (['With undo','Countdown'].includes(example) && archived)} onClick={show}>
      {anchored ? 'Copy path' : ['With undo','Countdown'].includes(example) ? 'Archive file' : example === 'Stacked' ? 'Add five notifications' : example === 'Deduplicated' ? 'Save a change' : asyncExample ? 'Run simulation' : 'Show toast'}
    </Button>{archived && <Button size="sm" variant="outline" onClick={() => { setArchived(false); add({ ...samples[example], id:'demo', duration:0, action:undefined, countdown:false }); }}>Reset example</Button>}{example === 'Stacked' && <span className="feedback-demo-note">{items.filter(item => !item.leaving).length} notifications</span>}</div>
    {example === 'Async operation' && <Switch label="Simulate an error" checked={fail} disabled={active} onChange={event => setFail(event.target.checked)} />}
    {details && <div className="toast-file-details" ref={detailsRef} tabIndex={-1}><strong>Field-notes.md</strong><p>Workspace notes · 12 KB<br />Decisions, next steps and open questions.</p><Button variant="outline" size="sm" onClick={() => { setDetails(false); trigger.current?.focus(); }}>Close details</Button></div>}
    {anchored && <AnchoredToast anchorRef={trigger} placement={placement} container={container} />}
    <p className="feedback-demo-note">{asyncExample ? 'Simulated operation · loading, verification and outcome.' : example === 'Persistent' ? 'No timeout. Dismissal is separate from resolving an operation.' : example === 'Stacked' ? '3 visible · remaining items wait. Hover or focus to expand.' : 'Hover or focus pauses automatic dismissal.'}</p>
  </div>;
}

function ToastLabContent() {
  const { add } = useToast();
  const [position, setPosition] = useState('bottom-right');
  const [status, setStatus] = useState('success');
  const [appearance, setAppearance] = useState('neutral');
  const [density, setDensity] = useState('standard');
  const [duration, setDuration] = useState(5000);
  const [dark, setDark] = useState(false);
  const [long, setLong] = useState(false);
  const [icon, setIcon] = useState(true);
  const sample = { title:{ success:'Changes saved', error:'Upload interrupted', warning:'Session expires soon', info:'A new version is available', neutral:'Workspace updated' }[status], description:long ? 'The workspace archive includes the original research documents, all attachments and the complete version history. This longer message wraps naturally, including a-file-name-that-keeps-going-without-spaces.zip.' : 'Your project details are up to date.', status, appearance, density, duration, icon, countdown:duration > 0 };
  return <Card variant="elevated" interactive className="feedback-lab playground-card" aria-label="Toast playground"><div className="feedback-lab-heading"><h3>A small message. A clear outcome.</h3><p>Compose a notification, then try it in one of six viewport positions. Hover or focus pauses its timer.</p></div>
    <div className="feedback-lab-layout"><div className="feedback-lab-controls">
      <Select label="Position" width="full" value={position} onValueChange={setPosition} options={['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right'].map(value => ({ value, label:value }))} />
      <Select label="Status" width="full" value={status} onValueChange={setStatus} options={['neutral','success','error','warning','info'].map(value => ({ value, label:value }))} />
      <Select label="Surface" width="full" value={appearance} onValueChange={setAppearance} options={['neutral','tinted','solid'].map(value => ({ value, label:value }))} />
      <Select label="Density" width="full" value={density} onValueChange={setDensity} options={[{ value:'standard', label:'Standard' }, { value:'compact', label:'Compact' }]} />
      <Select label="Duration" width="full" value={duration} onValueChange={setDuration} options={[{ value:5000, label:'5 seconds' }, { value:10000, label:'10 seconds' }, { value:0, label:'Persistent' }]} />
      <Switch label="Show icon" checked={icon} onChange={event => setIcon(event.target.checked)} />
      <Switch label="Dark surface" checked={dark} onChange={event => setDark(event.target.checked)} />
      <Switch label="Long text" checked={long} onChange={event => setLong(event.target.checked)} />
    </div><div className="feedback-lab-stage feedback-surface" data-theme={dark ? 'dark' : 'light'}>
      <Toast toast={{ ...sample, countdown:false }} />
      <div className="feedback-demo-actions"><Button size="sm" variant="outline" onClick={() => add(sample)}>Show notification</Button></div>
      <p className="feedback-demo-note">Live preview · appearance and behavior combine independently.</p>
    </div></div><ToastViewport position={position} theme={dark ? 'dark' : 'light'} label="Playground notifications" />
  </Card>;
}
export function ToastPlayground() { return <ToastProvider><ToastLabContent /></ToastProvider>; }
