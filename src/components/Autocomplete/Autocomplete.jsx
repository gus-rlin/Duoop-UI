import React, { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import '../Forms/Forms.css';
import { useAnchoredOverlay } from '../useAnchoredOverlay';
import './Autocomplete.css';

const normalize = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase();

// Free text is the value; choosing a suggestion also returns the original item.
export function Autocomplete({ items, label, description, error, id: suppliedId, value, defaultValue = '', onValueChange, onSelect, size = 'md', showClear = false, showTrigger = false, startAddon, autoHighlight = false, emptyMessage = 'No matches. Try another search or keep your text.', disabled = false, required = false, className = '', ...inputProps }) {
  const generatedId = useId();
  const id = suppliedId || generatedId;
  const root = useRef(null);
  const anchor = useRef(null);
  const input = useRef(null);
  const popup = useRef(null);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const [expanded, setExpanded] = useState(false);
  const [activeValue, setActiveValue] = useState(null);
  const current = value !== undefined ? value : internalValue;
  const open = expanded && !disabled;
  const filtered = items.filter(item => normalize(`${item.label} ${item.keywords || ''}`).includes(normalize(current.trim())));
  const groups = [...new Set(filtered.map(item => item.group || ''))];
  const matches = groups.flatMap(group => filtered.filter(item => (item.group || '') === group));
  const enabled = matches.filter(item => !item.disabled);
  const active = enabled.find(item => item.value === activeValue) || (autoHighlight ? enabled[0] : undefined);
  const activeIndex = active ? matches.indexOf(active) : -1;
  const { style, resolvedPlacement } = useAnchoredOverlay({ open, anchorRef: anchor, overlayRef: popup, matchAnchorWidth: true });

  function change(next) {
    if (value === undefined) setInternalValue(next);
    onValueChange?.(next);
  }
  function close() { setExpanded(false); setActiveValue(null); }
  function choose(item) {
    change(item.label);
    onSelect?.(item);
    close();
    input.current.focus();
  }

  useEffect(() => {
    if (!open) return;
    function dismiss(event) {
      if (!root.current?.contains(event.target) && !popup.current?.contains(event.target)) {
        setExpanded(false); setActiveValue(null);
      }
    }
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('focusin', dismiss);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('focusin', dismiss);
    };
  }, [open]);

  useEffect(() => {
    if (open && activeIndex >= 0) document.getElementById(`${id}-option-${activeIndex}`)?.scrollIntoView({ block: 'nearest' });
  }, [open, activeIndex, id]);

  useEffect(() => {
    const form = input.current?.form;
    function reset() {
      if (value === undefined) setInternalValue(defaultValue);
      setExpanded(false); setActiveValue(null);
    }
    form?.addEventListener('reset', reset);
    return () => form?.removeEventListener('reset', reset);
  }, [defaultValue, value]);

  function onKeyDown(event) {
    inputProps.onKeyDown?.(event);
    if (event.defaultPrevented || event.nativeEvent.isComposing) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setExpanded(true);
      const index = open ? enabled.indexOf(active) : -1;
      const next = event.key === 'ArrowDown' ? (index + 1) % enabled.length : (index <= 0 ? enabled.length - 1 : index - 1);
      setActiveValue(enabled[next]?.value ?? null);
    } else if (event.key === 'Enter' && open && active) {
      event.preventDefault(); choose(active);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault(); event.stopPropagation(); close();
    } else if (event.key === 'Tab') close();
  }

  return <div ref={root} className={`duoop-autocomplete ${className}`} data-disabled={disabled || undefined}>
    <div className="duoop-field" data-state={error ? 'error' : undefined}>
      <label htmlFor={id}>{label}{required && <span className="field-required"> (required)</span>}</label>
      <div ref={anchor} className={`autocomplete-control autocomplete-control--${size}`} data-invalid={Boolean(error) || inputProps['aria-invalid'] || undefined} data-open={open || undefined}>
        {startAddon && <span className="autocomplete-addon" aria-hidden="true">{startAddon}</span>}
        <input {...inputProps} ref={input} id={id} type="text" role="combobox" autoComplete="off" aria-autocomplete="list" aria-expanded={open} aria-controls={open ? `${id}-list` : undefined} aria-activedescendant={open && activeIndex >= 0 ? `${id}-option-${activeIndex}` : undefined} aria-describedby={[description && `${id}-help`, error && `${id}-message`, inputProps['aria-describedby']].filter(Boolean).join(' ') || undefined} aria-invalid={Boolean(error) || inputProps['aria-invalid'] || undefined} required={required} disabled={disabled} value={current} onKeyDown={onKeyDown} onFocus={event => { inputProps.onFocus?.(event); }} onClick={event => { inputProps.onClick?.(event); setExpanded(true); }} onChange={event => { change(event.target.value); setActiveValue(null); setExpanded(true); inputProps.onChange?.(event); }} />
        {showClear && <button type="button" className="autocomplete-action" aria-label={`Clear ${label}`} disabled={disabled || !current} onClick={() => { change(''); setActiveValue(null); setExpanded(true); input.current.focus(); }}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m6 6 8 8M14 6l-8 8" /></svg></button>}
        {showTrigger && <button type="button" className="autocomplete-action autocomplete-trigger" aria-label={`${open ? 'Hide' : 'Show'} ${label} suggestions`} aria-expanded={open} disabled={disabled} onClick={() => { setExpanded(!open); setActiveValue(null); input.current.focus(); }}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7 5 5 5-5" /></svg></button>}
      </div>
      {description && <p id={`${id}-help`} className="field-help">{description}</p>}
      <div className="field-feedback" aria-live="polite">{error && <p id={`${id}-message`} className="form-validation-error">{error}</p>}</div>
    </div>
    {open && createPortal(<div ref={popup} className="autocomplete-popup" style={style} data-side={resolvedPlacement.split('-')[0]}>
      <div id={`${id}-list`} role="listbox" aria-label={`${label} suggestions`} className="autocomplete-list">
        {groups.map(group => <div key={group} role={group ? 'group' : 'presentation'} aria-label={group || undefined}>
          {group && <div className="autocomplete-group" aria-hidden="true">{group}</div>}
          {matches.filter(item => (item.group || '') === group).map(item => <div key={item.value} id={`${id}-option-${matches.indexOf(item)}`} role="option" aria-selected={active?.value === item.value} aria-disabled={item.disabled || undefined} data-active={active?.value === item.value || undefined} className="autocomplete-option" onPointerMove={() => { if (!item.disabled) setActiveValue(item.value); }} onPointerDown={event => event.preventDefault()} onClick={() => { if (!item.disabled) choose(item); }}>
            <span><strong>{item.label}</strong>{item.description && <small>{item.description}</small>}</span>
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11m-4-4 4 4-4 4" /></svg>
          </div>)}
        </div>)}
      </div>
      {!matches.length && <p className="autocomplete-empty">{emptyMessage}</p>}
      <div className="autocomplete-footer" aria-hidden="true"><span>{matches.length} suggestion{matches.length !== 1 ? 's' : ''}</span><span>↑ ↓ <span className="autocomplete-key-hint">to explore</span> · Enter <span className="autocomplete-key-hint">to choose</span></span></div>
    </div>, root.current?.closest('dialog') || document.body)}
    <span className="sr-only" role="status">{open ? `${matches.length} suggestions available.${matches.length ? '' : ` ${emptyMessage}`}` : ''}</span>
  </div>;
}
