import React, { useEffect, useId, useRef, useState } from 'react';
import { Button, ActionFeedback } from '../Button/Button';
import { Dialog, DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './Dialog';

export const dialogExamples = [['Information','Content'],['Form','Content'],['Confirmation','Content'],['Small','Size'],['Large','Size'],['Extra large','Size'],['Fullscreen','Size'],['Bare footer','Footer'],['Without footer','Footer'],['Without close button','Closing'],['Scrollable content','Overflow'],['Sticky footer','Overflow'],['Nested dialog','Hierarchy'],['Unsaved changes','Closing'],['Submitting','States'],['Form error','States'],['Mobile bottom sheet','Responsive'],['Mobile fullscreen','Responsive']];

function ProjectSummary({ archive = false }) {
  return <><div className="dialog-demo-project"><svg viewBox="0 0 48 56" aria-hidden="true"><path d="M9 5h23l8 8v37H9z"/><path d="M32 5v9h8M17 24h15M17 31h15M17 38h9"/></svg><div><strong>Studio workspace</strong><span>Product design · Shared project</span></div></div><dl className="dialog-demo-details"><div><dt>Team access</dt><dd>8 members</dd></div><div><dt>Project files</dt><dd>24 documents</dd></div><div><dt>{archive ? 'Recovery window' : 'Visibility'}</dt><dd>{archive ? '30 days' : 'Invite only'}</dd></div></dl><p className="dialog-demo-note">{archive ? 'Members will lose access until you restore the project. Your files will be kept during the recovery window.' : 'A shared place for briefs, decisions, and work in progress.'}</p></>;
}

function DialogInner({ example, onClose, onDirtyChange }) {
  const [nested, setNested] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(example === 'Form error');
  const input = useRef(null);
  const saveTimer = useRef(null);
  useEffect(() => () => clearTimeout(saveTimer.current), []);
  const errorId = useId();
  const form = ['Form', 'Form error', 'Unsaved changes', 'Submitting'].includes(example);
  const archive = example === 'Confirmation';
  const overflow = ['Scrollable content', 'Sticky footer'].includes(example);
  const submit = () => {
    if (form && name.trim().length < 3) { setError(true); input.current?.focus(); return; }
    if (example === 'Submitting') {
      setStatus('loading');
      saveTimer.current = setTimeout(() => setStatus('success'), 700);
    } else { setStatus('success'); onDirtyChange?.(false); }
  };
  return <DialogContent showCloseButton={example !== 'Without close button'}>
    <DialogHeader><span className="dialog-demo-eyebrow">{archive ? 'Project / Archive' : form ? 'Workspace / Settings' : 'Workspace / Overview'}</span><DialogTitle>{archive ? 'Archive this project?' : form ? 'Make room for your next idea.' : 'Good work starts here.'}</DialogTitle><DialogDescription>{archive ? 'Take it off your list. Keep the work behind it.' : form ? 'Give your project a name and a little context.' : 'Everything your team needs, in one shared workspace.'}</DialogDescription></DialogHeader>
    <DialogBody>
      {form ? <><label>Project name<input ref={input} disabled={status === 'loading'} value={name} placeholder="e.g. Studio workspace" onChange={e => { setName(e.target.value); onDirtyChange?.(true); setError(false); setStatus('idle'); }} aria-invalid={error || undefined} aria-describedby={error ? errorId : undefined}/></label>{error && <p id={errorId} className="dialog-demo-error" role="alert">Enter a project name with at least three characters.</p>}<label>Summary<textarea disabled={status === 'loading'} rows="3" defaultValue="A focused workspace for the product team." onChange={() => { setStatus('idle'); onDirtyChange?.(true); }}/></label><p className="dialog-demo-note">{example === 'Submitting' ? 'Demo: a 700 ms simulated save, followed by confirmation.' : 'You can change these details whenever you need.'}</p></> : <ProjectSummary archive={archive}/>}
      {overflow && ['A place for the brief', 'Keep decisions close', 'Share work in progress', 'Make feedback useful', 'Keep a clear history', 'Invite your team', 'Organize your files', 'Wrap up the project'].map((title, i) => <section className="dialog-demo-section" key={title}><h3>{String(i + 1).padStart(2, '0')} / {title}</h3><p>Keep project notes and documents together so every member can find the context they need. Review access with your team as the project evolves.</p></section>)}
      {example === 'Nested dialog' && <><p className="dialog-demo-note">Manage who can contribute to this workspace.</p><Button variant="outline" onClick={() => setNested(true)}>Open permissions</Button><Dialog open={nested} onOpenChange={setNested} size="sm"><DialogContent><DialogHeader><span className="dialog-demo-eyebrow">Workspace / Access</span><DialogTitle>Permissions</DialogTitle><DialogDescription>Current access for this workspace.</DialogDescription></DialogHeader><DialogBody><dl className="dialog-demo-details"><div><dt>Members</dt><dd>Can edit</dd></div><div><dt>Guests</dt><dd>Can comment</dd></div></dl></DialogBody><DialogFooter><Button onClick={() => setNested(false)}>Done</Button></DialogFooter></DialogContent></Dialog></>}
      {status === 'success' && <ActionFeedback>{archive ? 'Project archived in this preview.' : 'Your changes are saved in this preview.'}</ActionFeedback>}
    </DialogBody>
    {example !== 'Without footer' && <DialogFooter bare={example === 'Bare footer'}><DialogClose><Button variant="outline">{status === 'success' ? 'Close' : 'Cancel'}</Button></DialogClose><Button status={status} successLabel={archive ? 'Archived' : 'Saved'} onClick={form || archive ? submit : onClose}>{archive ? 'Archive project' : form ? 'Save changes' : 'Got it'}</Button></DialogFooter>}
  </DialogContent>;
}

export function DialogDemo({ example = 'Information' }) {
  const [open, setOpen] = useState(false);
  const dirty = useRef(false);
  const size = { Small: 'sm', Large: 'lg', 'Extra large': 'xl', Fullscreen: 'fullscreen' }[example] || 'md';
  const mobile = example === 'Mobile bottom sheet' ? 'bottom' : example === 'Mobile fullscreen' ? 'fullscreen' : 'center';
  return <Dialog open={open} onOpenChange={next => { setOpen(next); if (!next) dirty.current = false; }} size={size} mobile={mobile} confirmClose={example === 'Unsaved changes' ? () => !dirty.current || window.confirm('Discard unsaved changes?') : undefined}><DialogTrigger><Button variant="outline">Open {example.toLowerCase()}</Button></DialogTrigger><DialogInner key={String(open)} example={example} onDirtyChange={next => { dirty.current = next; }} onClose={() => setOpen(false)}/></Dialog>;
}
