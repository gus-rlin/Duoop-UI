import React, { useEffect, useId, useRef, useState } from 'react';

import { InputGroup, InputGroupAddon as Addon, InputGroupInput, InputGroupTextarea, InputGroupText as Text } from './InputGroup';

import { Textarea } from './Textarea';

import { Field } from './Input';

import { Button, ActionFeedback } from '../Button/Button';



export function FormIcon({ name = 'search' }) {

  const paths = { search: 'm21 21-5-5 M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0', mail: 'M3 5h18v14H3z m0 0 9 8 9-8', lock: 'M5 10h14v11H5z M8 10V6a4 4 0 0 1 8 0v4', eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12 M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0', close: 'm6 6 12 12 M6 18 18 6', copy: 'M8 8h13v13H8z M16 8V3H3v13h5', send: 'm3 3 18 9-18 9 4-9z M7 12h14', info: 'M12 11v6 M12 7h.01 M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0', check: 'm5 12 4 4L19 6' };

  return <svg className="form-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.search} /></svg>;

}

function IconButton({ name, label, selected, ...props }) { return <button type="button" className={`group-icon-action ${name === 'send' ? 'group-icon-action--send' : ''}`} aria-label={label} aria-pressed={selected} {...props}><FormIcon name={name} /></button>; }

function SendAction({ done, iconOnly = false }) { return <button type="submit" data-done={done || undefined} className={iconOnly ? 'group-icon-action group-icon-action--send' : 'group-send-action'} aria-label={iconOnly ? (done ? 'Message prepared' : 'Send message') : undefined}>{!iconOnly && <span>{done ? 'Ready' : 'Send'}</span>}<FormIcon key={String(done)} name={done ? 'check' : 'send'} /></button>; }

function LoadingDemo() {

  const [value, setValue] = useState('');

  const [status, setStatus] = useState('idle');

  useEffect(() => { if (status !== 'loading') return; const timer = setTimeout(() => setStatus('done'), 1200); return () => clearTimeout(timer); }, [status, value]);

  return <form className="enriched-demo" onSubmit={event => { event.preventDefault(); if (value.trim()) setStatus('loading'); }}><InputGroup>

    <InputGroupInput aria-label="Search the library" placeholder="Find a component…" value={value} onChange={event => { setValue(event.target.value); setStatus('idle'); }} />

    <Addon><FormIcon name="search" /></Addon><Addon align="inline-end"><button type="submit" className="group-loading-action" disabled={!value.trim() || status === 'loading'} aria-label={status === 'loading' ? 'Searching' : 'Run demo search'}>{status === 'loading' ? <span className="group-loader" aria-hidden="true" /> : <FormIcon name={status === 'done' ? 'check' : 'send'} />}</button></Addon>

  </InputGroup><span className="group-status" role="status">{status === 'loading' ? 'Searching the demo library…' : status === 'done' ? 'Demo search complete' : 'Type a keyword, then start the search.'}</span></form>;

}

function Info() {

  const id = useId();

  const [open, setOpen] = useState(false);

  return <span className="form-tooltip" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={event => { if (event.key === 'Escape') setOpen(false); }}><IconButton name="info" label="Password requirements" aria-describedby={open ? id : undefined} onClick={() => setOpen(true)} />{open && <span role="tooltip" id={id}>Use at least 8 characters.</span>}</span>;

}



export function GroupDemo({ variant = 'start-icon', size = 'default' }) {

  const [value, setValue] = useState(variant === 'copy' ? 'duoop.design' : variant === 'password' ? 'Design-system-26' : variant === 'clear' ? 'Input group' : '');

  const [shown, setShown] = useState(false);

  const [notice, setNotice] = useState('');

  const input = useRef(null);

  const id = useId();

  async function copy() {

    try { await navigator.clipboard.writeText(`https://${value}`); setNotice('URL copied.'); }

    catch { setNotice('Copy unavailable. Select and copy the URL manually.'); input.current.focus(); input.current.select(); }

  }

  const startIcon = ['start-icon', 'both-icons', 'clear', 'password', 'shortcut'].includes(variant);

  const prefix = ['prefix', 'both-text', 'copy'].includes(variant);

  const numeric = ['number', 'amount', 'suffix'].includes(variant);

  const send = ['send', 'text-button', 'icon-button'].includes(variant);

  function submit(event) { event.preventDefault(); if (!send) return; setNotice(value.trim() ? 'Message prepared' : 'Enter a message first.'); if (!value.trim()) input.current.focus(); }

  if (variant === 'loading') return <LoadingDemo />;

  const group = <InputGroup size={size}>

    <InputGroupInput ref={input} id={id} aria-label={variant === 'label' ? undefined : ['password', 'tooltip'].includes(variant) ? 'Password' : variant === 'clear' ? 'Search components' : variant === 'copy' ? 'Website URL' : numeric ? 'Amount' : send ? 'Message' : 'Input group example'} type={(variant === 'password' && !shown) || variant === 'tooltip' ? 'password' : variant === 'clear' ? 'search' : numeric ? 'number' : 'text'} step={numeric ? '0.01' : undefined} value={value} onChange={event => { setValue(event.target.value); setNotice(''); }} placeholder={numeric ? '0.00' : send ? 'Write a message…' : 'Enter a value…'} />

    {startIcon && <Addon><FormIcon name={variant === 'password' ? 'lock' : 'search'} /></Addon>}

    {prefix && <Addon><Text>https://</Text></Addon>}

    {variant === 'amount' && <Addon><Text>€</Text></Addon>}

    {variant === 'label' && <Addon align="block-start"><label className="input-group-label" htmlFor={id}>Workspace name</label></Addon>}

    <Addon align="inline-end">

      {['end-icon', 'both-icons'].includes(variant) && <FormIcon name="mail" />}

      {variant === 'both-text' && <Text>.com</Text>}

      {['suffix', 'number'].includes(variant) && <Text>kg</Text>}

      {variant === 'amount' && <Text>EUR</Text>}

      {variant === 'clear' && <IconButton name="close" label="Clear search" disabled={!value} onClick={() => { setValue(''); input.current.focus(); }} />}

      {variant === 'password' && <IconButton name="eye" label={shown ? 'Hide password' : 'Show password'} selected={shown} onClick={() => setShown(!shown)} />}

      {variant === 'copy' && <IconButton name={notice === 'URL copied.' ? 'check' : 'copy'} label="Copy URL" onClick={copy} />}

      {variant === 'tooltip' && <Info />}

      {variant === 'badge' && <span className="input-group-badge">Optional</span>}

      {variant === 'shortcut' && <kbd className="input-group-kbd">Esc</kbd>}


      {send && <SendAction done={notice === 'Message prepared'} iconOnly={variant === 'icon-button'} />}

    </Addon>

  </InputGroup>;

  return <form className="enriched-demo" onSubmit={submit} onKeyDown={event => { if (variant === 'shortcut' && event.key === 'Escape') { setValue(''); input.current.focus(); } }}>{group}<ActionFeedback tone={notice.includes('first') || notice.includes('unavailable') ? 'error' : 'success'}>{notice}</ActionFeedback></form>;

}



export function MultilineDemo({ position = 'bottom' }) {

  const [value, setValue] = useState('');

  const [done, setDone] = useState(false);

  const id = useId();

  return <form className="enriched-demo" onSubmit={event => { event.preventDefault(); if (value.trim()) setDone(true); }}>

    <InputGroup className="message-composer">

      <InputGroupTextarea id={id} aria-label="Draft message" required autoSize spellCheck={false} placeholder="Share an idea with your team…" value={value} onChange={event => { setValue(event.target.value); setDone(false); }} />

      <Addon align={position === 'top' ? 'block-start' : 'block-end'} className="composer-toolbar">

        {position === 'top' ? <label htmlFor={id} className="composer-label"><FormIcon name="mail" />New message</label> : <span className="composer-count">{value.length > 0 ? `${value.length} characters` : 'Your next idea starts here'}</span>}

        <SendAction done={done} />

      </Addon>

    </InputGroup><ActionFeedback>{done ? 'Message prepared. Demo only.' : ''}</ActionFeedback>

  </form>;

}



export function TextareaDemo({ variant = 'standard', size = 'default' }) {

  const limit = 120;

  const [value, setValue] = useState(variant === 'limit' ? 'A shared component library brings clear labels, consistent feedback, and thoughtful interactions to every form we create.'.padEnd(limit, '.').slice(0, limit) : variant === 'long' ? Array.from({ length: 10 }, (_, i) => `Paragraph ${i + 1}. A shared library keeps our forms consistent, accessible, and ready for the next idea.`).join('\n\n') : '');

  const [saved, setSaved] = useState(false);

  const id = useId();

  if (variant === 'actions') return <MultilineDemo />;

  const counted = ['counter', 'limit'].includes(variant);

  const control = <Textarea size={size} rows={3} autoSize={variant === 'auto'} resize={variant === 'resize' ? 'vertical' : 'none'} spellCheck={false} style={['fixed', 'long'].includes(variant) ? { height: 128 } : undefined} disabled={variant === 'disabled'} placeholder={variant === 'auto' ? 'Keep writing — this field grows with you…' : 'Write your message…'} aria-label="Message" aria-describedby={counted ? id : undefined} maxLength={counted ? limit : undefined} value={value} onChange={event => { setValue(event.target.value); setSaved(false); }} required={variant === 'form'} name="message" />;

  return <form className="enriched-demo" onSubmit={event => { event.preventDefault(); setSaved(true); }}>

    {['label', 'form'].includes(variant) ? <Field label="Message" description="Tell us about your project.">{control}</Field> : control}

    {counted && <p className="textarea-counter" data-limit={value.length === limit} id={id}>{value.length} / {limit}{value.length === limit ? ' · Limit reached' : ''}</p>}

    {counted && <span className="sr-only" role="status">{value.length === limit ? 'Character limit reached.' : ''}</span>}

    {variant === 'form' && <><Button type="submit" status={saved ? 'success' : 'idle'} successLabel="Validated">Validate message</Button><ActionFeedback className="form-notice">{saved ? 'Message validated. This demo sends no data.' : ''}</ActionFeedback></>}

  </form>;

}


