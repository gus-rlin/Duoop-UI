import React, { useState } from 'react';
import './NumericForms.css';

export function normalizeOtp(text, alphanumeric = false, length = 6) {
  return text.normalize('NFKC').toUpperCase().replace(alphanumeric ? /[^A-Z0-9]/g : /[^0-9]/g, '').slice(0, length);
}

// One native input preserves selection, paste, autofill, and mobile keyboard behavior.
export function OtpField({ length = 6, alphanumeric = false, masked = false, grouped = false, size = 'default', placeholder = '', value, defaultValue = '', onValueChange, onComplete, className = '', ...props }) {
  const [internal, setInternal] = useState(() => normalizeOtp(defaultValue, alphanumeric, length));
  const [focused, setFocused] = useState(false);
  const [position, setPosition] = useState(0);
  const code = value === undefined ? internal : normalizeOtp(value, alphanumeric, length);
  function change(event) {
    const next = normalizeOtp(event.target.value, alphanumeric, length);
    const caret = normalizeOtp(event.target.value.slice(0, event.target.selectionStart), alphanumeric, length).length;
    setInternal(next); setPosition(caret); if (next !== code) onValueChange?.(next);
    // Restore the selection after removing separators or normalizing characters.
    requestAnimationFrame(() => { if (event.target.isConnected) event.target.setSelectionRange(caret, caret); });
    if (next.length === length && next !== code) onComplete?.(next);
  }
  return <div className={`otp-field otp-field--${size} ${className}`} data-invalid={props['aria-invalid'] || undefined} data-disabled={props.disabled || undefined}>
    <input {...props} type={masked ? 'password' : 'text'} value={code} inputMode={alphanumeric ? 'text' : 'numeric'} autoComplete="one-time-code" autoCapitalize="characters" spellCheck={false} pattern={alphanumeric ? `[A-Z0-9]{${length}}` : `[0-9]{${length}}`} aria-label={props['aria-label']} onChange={change} onFocus={event => { setFocused(true); setPosition(event.target.selectionStart); props.onFocus?.(event); }} onBlur={event => { setFocused(false); props.onBlur?.(event); }} onSelect={event => setPosition(event.target.selectionStart)} />
    <div className="otp-slots" aria-hidden="true">{Array.from({ length }, (_, index) => <React.Fragment key={index}>{grouped && index === Math.ceil(length / 2) && <span className="otp-separator">−</span>}<span className="otp-slot" data-active={focused && Math.min(position, length - 1) === index || undefined} data-filled={Boolean(code[index]) || undefined}><span key={code[index] || 'empty'}>{code[index] ? masked ? '•' : code[index] : placeholder}</span></span></React.Fragment>)}</div>
  </div>;
}
