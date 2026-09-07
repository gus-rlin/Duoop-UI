import React, { useEffect, useId, useRef, useState } from 'react';
import './NumericForms.css';

// Accept French decimal separators and pasted, locally formatted EUR amounts.
export function parseNumber(text) {
  const cleaned = text.trim().replace(/[\s\u00a0\u202f€%]/g, '').replace(',', '.');
  if (!cleaned) return null;
  return /^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(cleaned) && Number.isFinite(Number(cleaned)) ? Number(cleaned) : NaN;
}

export function NumberField({ value, defaultValue = null, onValueChange, min, max, step = 1, size = 'default', format = 'decimal', scrub = false, disabled, className = '', ...props }) {
  const [internal, setInternal] = useState(defaultValue);
  const [draft, setDraft] = useState(null);
  const input = useRef(null);
  const errorId = useId();
  const drag = useRef(null);
  const current = value === undefined ? internal : value;
  const numeric = draft === null ? current : parseNumber(draft);
  const invalid = Number.isNaN(numeric) || (numeric !== null && ((min !== undefined && numeric < min) || (max !== undefined && numeric > max)));
  const error = Number.isNaN(numeric) ? 'Enter a valid number.' : min !== undefined && max !== undefined ? `Enter a value between ${min} and ${max}.` : min !== undefined ? `Enter a value of at least ${min}.` : `Enter a value of at most ${max}.`;
  useEffect(() => { input.current.setCustomValidity(invalid ? error : ''); }, [invalid, error]);
  const clamp = n => Math.min(max ?? Infinity, Math.max(min ?? -Infinity, n));
  function update(n) {
    setInternal(n);
    onValueChange?.(n);
  }
  function changeBy(direction) {
    const base = Number.isFinite(numeric) ? numeric : (min ?? 0);
    const next = clamp(Number((base + direction * step).toFixed(10)));
    setDraft(null);
    update(next);
    input.current.setCustomValidity('');
  }
  function edit(text) {
    setDraft(text);
    const next = parseNumber(text);
    if (!Number.isNaN(next)) update(next);
  }
  const formatted = current == null ? '' : new Intl.NumberFormat('fr-FR', format === 'currency' ? { style: 'currency', currency: 'EUR' } : { maximumFractionDigits: 10 }).format(current) + (format === 'percent' ? ' %' : '');
  return <div className={`number-field number-field--${size} ${className}`} data-invalid={invalid || props['aria-invalid'] || undefined} data-disabled={disabled || undefined}>
    {scrub && <span className="number-scrub" aria-hidden="true" onPointerDown={event => {
      if (disabled || event.button !== 0) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { x: event.clientX, value: Number.isFinite(numeric) ? numeric : (min ?? 0) };
    }} onPointerMove={event => {
      if (!drag.current) return;
      const next = clamp(Number((drag.current.value + Math.trunc((event.clientX - drag.current.x) / 8) * step).toFixed(10)));
      setDraft(null); update(next); input.current.setCustomValidity('');
    }} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} onLostPointerCapture={() => { drag.current = null; }}>↔ <span>Drag to adjust</span></span>}
    <div className="number-control">
      <button type="button" aria-label="Decrease value" disabled={disabled || (Number.isFinite(numeric) && numeric <= min)} onClick={() => changeBy(-1)}>−</button>
      <input {...props} ref={input} aria-describedby={[props['aria-describedby'], invalid && !props['aria-invalid'] && errorId].filter(Boolean).join(' ') || undefined} type="text" role="spinbutton" inputMode="decimal" disabled={disabled} value={draft ?? formatted} aria-valuenow={Number.isFinite(numeric) ? numeric : undefined} aria-valuemin={min} aria-valuemax={max} aria-invalid={invalid || props['aria-invalid'] || undefined} onChange={event => edit(event.target.value)} onFocus={event => { if (draft === null) setDraft(current == null ? '' : String(current).replace('.', ',')); props.onFocus?.(event); }} onBlur={event => { if (!invalid) setDraft(null); props.onBlur?.(event); }} onKeyDown={event => {
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') { event.preventDefault(); changeBy(event.key === 'ArrowUp' ? 1 : -1); }
        props.onKeyDown?.(event);
      }} />
      <button type="button" aria-label="Increase value" disabled={disabled || (Number.isFinite(numeric) && numeric >= max)} onClick={() => changeBy(1)}>+</button>
    </div>
    {invalid && !props['aria-invalid'] && <p id={errorId} className="number-error" role="status">{error}</p>}
  </div>;
}
