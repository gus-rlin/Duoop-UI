import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../Button/Button';
import { FeedbackIcon } from '../Feedback/FeedbackIcon';
import { Progress } from '../Progress/Progress';
import { useAnchoredOverlay } from '../useAnchoredOverlay';
import '../Feedback/Feedback.css';
import './Toast.css';

const ToastContext = createContext(null);
const announcementKey = item => JSON.stringify([item.revision, item.title, item.description, item.status]);
const normalizeDuration = value => value === 0 ? 0 : Number.isFinite(value) ? Math.max(1000, value) : 5000;
const makeToast = (options) => {
  const duration = normalizeDuration(options.duration);
  return { ...options, id:options.id ?? crypto.randomUUID(), duration, remaining:duration, revision:0, leaving:false };
};

/** A scoped queue. Upsert replays; update preserves identity and never revives a dismissed toast. */
export function ToastProvider({ children, initialToasts = [], limit = 3 }) {
  const [items, setItems] = useState(() => initialToasts.map(makeToast));
  const current = useRef(items);
  const mounted = useRef(true);
  const paused = useRef(new Set());
  const visibleLimit = Math.max(1, Math.min(10, Math.floor(limit) || 3));
  const announced = useRef(new Map(items.slice(0, visibleLimit).map(item => [item.id, announcementKey(item)])));
  const [announcement, setAnnouncement] = useState({ text:'', urgent:false, revision:0 });
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  const commit = useCallback(next => { if (!mounted.current) return; current.current = typeof next === 'function' ? next(current.current) : next; setItems(current.current); }, []);
  useEffect(() => {
    const visible = items.slice(0, visibleLimit).filter(item => !item.leaving);
    const changed = visible.filter(item => announced.current.get(item.id) !== announcementKey(item));
    announced.current = new Map(visible.map(item => [item.id, announcementKey(item)]));
    if (changed.length) setAnnouncement(old => ({ text:changed.map(item => [item.title, item.description].filter(Boolean).join('. ')).join('. '), urgent:changed.some(item => item.status === 'error'), revision:old.revision + 1 }));
  }, [items, visibleLimit]);
  const api = useMemo(() => {
    const add = options => {
      if (!mounted.current) return null;
      const previous = current.current.find(item => item.id === options.id);
      if (!previous && current.current.length >= 50) return null;
      const item = { ...makeToast({ ...previous, ...options }), generation:Symbol('toast'), revision:(previous?.revision ?? -1) + 1, returnFocus:previous?.returnFocus || document.activeElement };
      commit(list => previous ? list.map(old => old.id === item.id ? item : old) : [...list, item]);
      return item.id;
    };
    const update = (id, patch) => {
      if (!mounted.current) return;
      const item = current.current.find(old => old.id === id && !old.leaving);
      if (!item) return;
      const next = { ...item, ...patch, ...(patch.duration !== undefined ? { duration:normalizeDuration(patch.duration), remaining:normalizeDuration(patch.duration) } : {}) };
      commit(list => list.map(old => old.id === id ? next : old));
    };
    const dismiss = id => commit(list => list.map(item => item.id === id ? { ...item, leaving:true, exitRemaining:240 } : item));
    return { add, update, dismiss, pause:(key, value) => { if (value) paused.current.add(key); else paused.current.delete(key); },
      promise:async (task, messages) => {
        const id = add({ id:messages.id, title:messages.loading, status:'loading', duration:0 });
        const generation = current.current.find(item => item.id === id)?.generation;
        const finish = patch => { if (id && current.current.some(item => item.id === id && item.generation === generation)) update(id, patch); };
        try { const result = await task(); finish({ title:typeof messages.success === 'function' ? messages.success(result) : messages.success, status:'success', duration:5000 }); return result; }
        catch (error) { finish({ title:typeof messages.error === 'function' ? messages.error(error) : messages.error, status:'error', duration:0 }); throw error; }
      },
    };
  }, [commit]);
  const needsClock = items.some(item => item.duration > 0 || item.leaving);
  useEffect(() => {
    if (!needsClock) return undefined;
    let last = performance.now();
    const resetClock = () => { last = performance.now(); };
    document.addEventListener('visibilitychange', resetClock);
    const timer = setInterval(() => {
      const now = performance.now(); const elapsed = now - last; last = now;
      const next = current.current.map((item, index) => {
        if (item.leaving) return { ...item, exitRemaining:item.exitRemaining - elapsed };
        if (index >= visibleLimit || !item.duration || paused.current.size || document.hidden) return item;
        const remaining = Math.max(0, item.remaining - elapsed);
        return { ...item, remaining, leaving:remaining === 0, exitRemaining:240 };
      }).filter(item => !item.leaving || item.exitRemaining > 0);
      if (next.some((item, i) => item !== current.current[i]) || next.length !== current.current.length) commit(next);
    }, 100);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', resetClock); };
  }, [needsClock, visibleLimit, commit]);
  return <ToastContext.Provider value={{ ...api, items, limit:visibleLimit }}>
    {children}
    <div className="duoop-sr-only" role="status" aria-atomic="true">{!announcement.urgent && <span key={announcement.revision}>{announcement.text}</span>}</div>
    <div className="duoop-sr-only" role="alert" aria-atomic="true">{announcement.urgent && <span key={announcement.revision}>{announcement.text}</span>}</div>
  </ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used inside ToastProvider.');
  return context;
}

/** Presentation can also be used on its own for a static preview. */
export function Toast({ toast, onDismiss, className = '' }) {
  const { title, description, status = 'neutral', action, icon = true, appearance = 'neutral', density = 'standard', progress, remaining, duration, countdown } = toast;
  const element = useRef(null);
  function dismiss() {
    if (element.current?.contains(document.activeElement)) {
      if (toast.returnFocus?.isConnected && !toast.returnFocus.disabled) toast.returnFocus.focus({ preventScroll:true });
      else element.current.closest('.toast-viewport')?.focus({ preventScroll:true });
    }
    onDismiss?.(toast.id);
  }
  return <div ref={element} className={`duoop-toast ${className}`} data-tone={status} data-appearance={appearance} data-density={density} data-leaving={!!toast.leaving} data-toast-id={toast.id}>
    {icon && status !== 'neutral' && <span className="toast-status-icon" key={`${status}-${toast.revision}`}><FeedbackIcon status={status} /></span>}
    <div className="toast-content">
      <strong className="toast-title" key={`title-${toast.revision}`}>{title}</strong>
      {description && <p>{description}</p>}
      {progress !== undefined && <Progress value={progress} label="Transfer progress" hideLabel state={status === 'success' ? 'success' : status === 'error' ? 'error' : 'running'} size="sm" />}
      {action && <Button size="sm" variant="outline" onClick={action.onClick}>{action.label}</Button>}
      {countdown && duration > 0 && <div className="toast-countdown" aria-label="Time remaining before dismissal"><span style={{ transform:`scaleX(${remaining / duration})` }} /></div>}
    </div>
    {onDismiss && <Button className="toast-close" variant="outline" size="sm" iconPosition="only" icon={<FeedbackIcon status="cancelled" />} aria-label={`Dismiss: ${title}`} onClick={dismiss} />}
  </div>;
}

function ToastSlot({ item, index, expanded, offset, reportHeight, dismiss }) {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => reportHeight(item.id, ref.current.offsetHeight));
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [item.id, reportHeight]);
  return <div ref={ref} className="toast-slot" data-covered={!expanded && index > 0} style={{ zIndex:20 - index, transform:`translateY(${expanded ? offset : index * 12}px) scale(${expanded ? 1 : 1 - index * .045})` }}>
    <Toast toast={item} onDismiss={dismiss} />
  </div>;
}

export function ToastViewport({ inline = false, position = 'bottom-right', theme = 'light', container, label = 'Notifications' }) {
  const { items, limit, dismiss, pause } = useToast();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [heights, setHeights] = useState({});
  const pauseKey = useRef(Symbol('viewport'));
  const visible = items.slice(0, limit);
  const expanded = hovered || focused;
  const reportHeight = useCallback((id, height) => setHeights(old => old[id] === height ? old : { ...old, [id]:height }), []);
  useEffect(() => { pause(pauseKey.current, expanded); return () => pause(pauseKey.current, false); }, [expanded, pause]);
  // Drop measurements when queued notifications leave; long-lived providers stay bounded.
  useEffect(() => setHeights(old => Object.fromEntries(Object.entries(old).filter(([id]) => items.some(item => item.id === id)))), [items.length]);
  let offset = 0;
  const rows = visible.map((item, index) => { const top = offset; offset += (heights[item.id] || 100) + 12; return <ToastSlot key={item.id} item={item} index={index} expanded={expanded} offset={top} reportHeight={reportHeight} dismiss={dismiss} />; });
  const height = visible.length ? expanded ? offset - 12 : (heights[visible[0].id] || 100) + (visible.length - 1) * 12 : 0;
  const node = <section className={`toast-viewport feedback-surface ${inline ? 'toast-viewport--inline' : ''}`} data-position={position} data-theme={theme} aria-label={label} tabIndex={visible.length ? 0 : -1} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }} onKeyDown={event => {
    if (event.key !== 'Escape' || !visible.length) return;
    event.stopPropagation();
    const focusedId = event.target.closest('[data-toast-id]')?.dataset.toastId;
    const item = visible.find(toast => toast.id === focusedId) || visible[0];
    if (item.returnFocus?.isConnected && !item.returnFocus.disabled) item.returnFocus.focus({ preventScroll:true });
    else event.currentTarget.focus({ preventScroll:true });
    dismiss(item.id);
  }}>
    <div className="toast-stack" data-expanded={expanded} style={{ height }}>{rows}</div>
    {items.length > limit && <span className="toast-queue-count">{items.length - limit} queued</span>}
  </section>;
  return inline ? node : createPortal(node, container || document.body);
}

export function AnchoredToast({ anchorRef, placement = 'top-center', theme = 'light', container }) {
  const { items, dismiss, pause } = useToast();
  const item = items[0];
  const ref = useRef(null);
  const key = useRef(Symbol('anchor'));
  const pointer = useRef(false);
  const focus = useRef(false);
  const { style, resolvedPlacement } = useAnchoredOverlay({ open:!!item, anchorRef, overlayRef:ref, placement, gap:12 });
  useEffect(() => () => pause(key.current, false), [pause]);
  useEffect(() => { if (!item) { pointer.current = false; focus.current = false; pause(key.current, false); } }, [!!item, pause]);
  if (!item) return null;
  return createPortal(<div ref={ref} className="toast-anchor feedback-surface" data-theme={theme} data-placement={resolvedPlacement} style={style}
    onPointerEnter={() => { pointer.current = true; pause(key.current, true); }} onPointerLeave={() => { pointer.current = false; pause(key.current, focus.current); }}
    onFocusCapture={() => { focus.current = true; pause(key.current, true); }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { focus.current = false; pause(key.current, pointer.current); } }}>
    <Toast toast={item} onDismiss={dismiss} />
  </div>, container || document.body);
}
