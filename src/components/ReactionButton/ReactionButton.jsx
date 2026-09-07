import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button';
import { Badge } from '../Badge/Badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody } from '../Dialog/Dialog';
import { ExperienceIcon } from '../Feedback/ExperienceIcon';
import { useAnchoredOverlay } from '../useAnchoredOverlay';
import '../Feedback/Feedback.css';
import '../Feedback/Experience.css';
import './ReactionButton.css';

export const reactionTypes = { like:{ label:'Like', selectedLabel:'Liked', icon:'heart' }, favorite:{ label:'Favorite', selectedLabel:'Saved to favorites', icon:'star' }, clap:{ label:'Applaud', selectedLabel:'Applauded', icon:'clap' }, custom:{ label:'Celebrate', selectedLabel:'Celebrated', icon:'celebrate' } };
const nonnegative = value => Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
export function formatReactionCount(value, format = 'exact', locale = 'en', cap = 99) {
  const count = nonnegative(value);
  return format === 'capped' && count > cap ? `${new Intl.NumberFormat(locale).format(cap)}+` : new Intl.NumberFormat(locale, { notation:format === 'compact' ? 'compact' : 'standard', maximumFractionDigits:1 }).format(count);
}
export function ReactionGlyph({ kind = 'like', icon, selected }) {
  const reaction = reactionTypes[kind] || reactionTypes.like;
  return <ExperienceIcon name={icon || reaction.icon} filled={selected && ['like','favorite'].includes(kind)} />;
}

/** A value is {selected, count, contributions}. onReact may return a promise; failures roll back. */
export function ReactionButton({ kind = 'like', icon, label, selectedLabel, value:controlled, defaultValue = {}, onValueChange, onReact, action = 'toggle', quota = Infinity, update = 'optimistic', presentation = 'icon-text', counter = 'integrated', format = 'exact', cap = 99, locale = 'en', zero = 'show', feedback = 'pulse', disabled = false, readOnly = false, loading = false, authRequired = false, onAuthRequest, size = 'md', variant = 'outline', className = '' }) {
  const id = useId();
  const [internal, setInternal] = useState({ selected:false, count:0, contributions:0, ...defaultValue });
  const [draft, setDraft] = useState(null);
  const [status, setStatus] = useState('idle');
  const [announcement, setAnnouncement] = useState('');
  const [activation, setActivation] = useState(0);
  const request = useRef(null);
  const committed = controlled ?? internal;
  const current = draft || committed;
  const count = nonnegative(current.count);
  const contributions = nonnegative(committed.contributions);
  const selected = Boolean(current.selected);
  const max = Number.isFinite(quota) ? nonnegative(quota) : Infinity;
  const atQuota = action === 'repeat' && contributions >= max;
  const reaction = reactionTypes[kind] || reactionTypes.like;
  const baseLabel = label || reaction.label;
  const displayLabel = selected ? selectedLabel || reaction.selectedLabel : baseLabel;
  const showCount = counter !== 'hidden' && !(count === 0 && zero !== 'show');
  const exact = formatReactionCount(count, 'exact', locale);
  const countLabel = loading ? '—' : formatReactionCount(count, format, locale, cap);
  const busy = loading || status === 'loading';
  useEffect(() => () => request.current?.abort(), []);
  async function react() {
    if (request.current || loading || disabled || readOnly || atQuota) return;
    if (authRequired) { setAnnouncement('Sign in to add a reaction.'); onAuthRequest?.(); return; }
    const nextSelected = action === 'repeat' || !Boolean(committed.selected);
    const next = { selected:nextSelected, count:Math.max(0, nonnegative(committed.count) + (nextSelected ? 1 : -1)), contributions:action === 'repeat' ? contributions + 1 : Number(nextSelected) };
    const controller = new AbortController();
    request.current = controller;
    setAnnouncement('');
    if (update === 'optimistic') setDraft(next);
    setActivation(old => old + 1);
    try {
      if (onReact) {
        setStatus('loading');
        await onReact(next, { signal:controller.signal });
      }
      if (controller.signal.aborted) return;
      if (controlled === undefined) setInternal(next);
      onValueChange?.(next);
      setDraft(null);
      setStatus('idle');
      setAnnouncement(`${nextSelected ? selectedLabel || reaction.selectedLabel : `${baseLabel} removed`}. ${formatReactionCount(next.count, 'exact', locale)} total.`);
    } catch (error) {
      if (!controller.signal.aborted) { setDraft(null); setStatus('error'); setAnnouncement('Reaction was not saved. Your previous total is restored. Activate the button to retry.'); }
    } finally {
      if (request.current === controller) request.current = null;
    }
  }
  const glyph = <span className="reaction-glyph" key={activation} data-activated={activation > 0}><ReactionGlyph kind={kind} icon={icon} selected={selected} /></span>;
  const text = <><span className="reaction-label"><span>{zero === 'invite' && count === 0 ? baseLabel : displayLabel}</span><span className="reaction-label-reserve" aria-hidden="true">{baseLabel}</span><span className="reaction-label-reserve" aria-hidden="true">{selectedLabel || reaction.selectedLabel}</span></span>{showCount && counter === 'integrated' && <span className="reaction-count" key={count}>{countLabel}</span>}</>;
  return <span className={`duoop-reaction ${className}`} data-feedback={feedback} data-state={readOnly ? 'readonly' : disabled ? 'disabled' : atQuota ? 'quota' : authRequired ? 'auth' : status === 'error' ? 'error' : busy ? 'loading' : selected ? 'selected' : 'idle'} data-selected={selected}>
    <span className="reaction-control-wrap">
      {readOnly ? <span className="reaction-readonly" aria-label={`${baseLabel}, ${exact} reactions, read only`}>{presentation !== 'text' && glyph}{presentation !== 'icon' && text}{presentation === 'icon' && showCount && <span>{countLabel}</span>}</span> : <Button className="reaction-button" size={size} variant={variant} selected={action === 'toggle' ? selected : undefined} disabled={disabled || atQuota} status={busy ? 'loading' : 'idle'} icon={presentation === 'text' ? undefined : glyph} iconPosition={presentation === 'icon' ? 'only' : 'left'} aria-label={`${status === 'error' ? 'Retry: ' : ''}${displayLabel}${counter !== 'hidden' ? `, ${exact} reactions` : ''}${atQuota ? ', contribution limit reached' : ''}${authRequired ? ', sign in required' : ''}`} aria-describedby={`${id}-status`} onClick={react}>{text}</Button>}
      {feedback === 'particles' && activation > 0 && selected && <span className="reaction-particles" key={activation} aria-hidden="true">{Array.from({ length:6 }, (_, i) => <i key={i} style={{ '--particle-angle':`${i * 60}deg` }} />)}</span>}
    </span>
    {showCount && (counter === 'separate' || presentation === 'icon' && !readOnly && counter === 'integrated') && <Badge className="reaction-separate-count" aria-label={loading ? 'Loading reactions' : `${exact} reactions`}><span key={count} className="reaction-count">{countLabel}</span></Badge>}
    <span id={`${id}-status`} className={status === 'error' || atQuota || authRequired && announcement ? 'reaction-message' : 'duoop-sr-only'} role="status">{atQuota ? `${formatReactionCount(max, 'exact', locale)} of ${formatReactionCount(max, 'exact', locale)} contributions used.` : announcement}</span>
  </span>;
}

/** Counts on group items exclude this viewer's single contribution. */
export function ReactionGroup({ items, value, defaultValue = [], onValueChange, mode = 'multiple', label = 'Reactions', buttonProps = {} }) {
  const [internal, setInternal] = useState(defaultValue);
  const selected = value ?? internal;
  function change(id, next) {
    const updated = next.selected ? mode === 'exclusive' ? [id] : [...new Set([...selected, id])] : selected.filter(item => item !== id);
    if (value === undefined) setInternal(updated);
    onValueChange?.(updated);
  }
  return <div className="reaction-group" role="group" aria-label={label}>{items.map(item => <ReactionButton key={item.id} {...buttonProps} {...item} value={{ selected:selected.includes(item.id), count:nonnegative(item.count) + Number(selected.includes(item.id)) }} onValueChange={next => change(item.id, next)} />)}</div>;
}

export const defaultReactions = [{ id:'like', kind:'like', label:'Like' }, { id:'favorite', kind:'favorite', label:'Favorite' }, { id:'clap', kind:'clap', label:'Applaud' }, { id:'celebrate', kind:'custom', icon:'celebrate', label:'Celebrate' }, { id:'idea', kind:'custom', icon:'bulb', label:'Great idea' }, { id:'thanks', kind:'custom', icon:'thanks', label:'Thank you' }];

export function ReactionPicker({ items = defaultReactions, onSelect, label = 'Add reaction', disabled = false }) {
  const [open, setOpen] = useState(false);
  const anchor = useRef(null);
  const overlay = useRef(null);
  const id = useId();
  const { style } = useAnchoredOverlay({ open, anchorRef:anchor, overlayRef:overlay, placement:'bottom-start', minimumWidth:230, gap:10 });
  useEffect(() => {
    if (!open) return;
    const outside = event => { if (!anchor.current?.contains(event.target) && !overlay.current?.contains(event.target)) setOpen(false); };
    document.addEventListener('pointerdown', outside);
    return () => { document.removeEventListener('pointerdown', outside); };
  }, [open]);
  useEffect(() => {
    if (open && style.visibility === 'visible') overlay.current?.querySelector('button')?.focus();
  }, [open, style.visibility]);
  const close = () => { setOpen(false); anchor.current?.focus(); };
  function keys(event) {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(); }
    if (['ArrowRight','ArrowLeft','ArrowDown','ArrowUp','Home','End'].includes(event.key)) {
      event.preventDefault();
      const buttons = [...overlay.current.querySelectorAll('button')];
      const index = buttons.indexOf(document.activeElement);
      const rtl = getComputedStyle(overlay.current).direction === 'rtl';
      const offset = event.key === 'ArrowDown' ? 3 : event.key === 'ArrowUp' ? -3 : event.key === (rtl ? 'ArrowLeft' : 'ArrowRight') ? 1 : -1;
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : (index + offset + buttons.length) % buttons.length;
      buttons[next]?.focus();
    }
  }
  return <><Button ref={anchor} variant="outline" icon={<ExperienceIcon name="plus" />} disabled={disabled} aria-expanded={open} aria-haspopup="dialog" aria-controls={open ? id : undefined} onClick={() => setOpen(!open)}>{label}</Button>{open && createPortal(<div id={id} ref={overlay} className="reaction-picker feedback-surface experience-surface" role="dialog" aria-label="Choose a reaction" style={style} onKeyDown={keys} onBlur={event => { if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget) && !anchor.current?.contains(event.relatedTarget)) setOpen(false); }}><p>Choose a reaction</p><div>{items.map(item => <Button key={item.id} size="sm" variant="outline" iconPosition="only" icon={<ReactionGlyph {...item} />} aria-label={item.label} title={item.label} onClick={() => { onSelect?.(item); close(); }} />)}</div></div>, anchor.current?.closest('dialog') || document.body)}</>;
}
export const AddReaction = ReactionPicker;

export function ReactionSummary({ items, total, onDetails, locale = 'en' }) {
  return <div className="reaction-summary"><span className="reaction-summary-marks" aria-hidden="true">{items.slice(0,3).map(item => <span key={item.id}><ReactionGlyph {...item} /></span>)}</span>{onDetails ? <Button variant="outline" size="sm" onClick={onDetails}>{formatReactionCount(total, 'exact', locale)} reactions · View people</Button> : <span>{formatReactionCount(total, 'exact', locale)} reactions</span>}</div>;
}

export function ReactionDetails({ open, onOpenChange, participants, reactions = defaultReactions }) {
  const [filter, setFilter] = useState('all');
  const visible = participants.filter(person => filter === 'all' || person.reaction === filter);
  return <Dialog open={open} onOpenChange={onOpenChange} size="sm"><DialogContent><DialogHeader><DialogTitle>People who reacted</DialogTitle><DialogDescription>Explore the reactions to this field note.</DialogDescription></DialogHeader><DialogBody><div className="reaction-details feedback-surface experience-surface"><div className="reaction-detail-filters" role="group" aria-label="Filter participants"><Button variant="outline" size="sm" selected={filter === 'all'} onClick={() => setFilter('all')}>All</Button>{reactions.filter(reaction => participants.some(person => person.reaction === reaction.id)).map(reaction => <Button key={reaction.id} size="sm" variant="outline" selected={filter === reaction.id} iconPosition="only" icon={<ReactionGlyph {...reaction} />} aria-label={reaction.label} onClick={() => setFilter(reaction.id)} />)}</div><ul>{visible.map(person => <li key={person.id}><span className="reaction-person-icon" aria-hidden="true"><ExperienceIcon name="person" /></span><span><strong>{person.name}</strong><small>{person.detail}</small></span><ReactionGlyph {...reactions.find(reaction => reaction.id === person.reaction)} /></li>)}</ul><p className="experience-note" role="status">{visible.length} {visible.length === 1 ? 'person' : 'people'}</p></div></DialogBody></DialogContent></Dialog>;
}
