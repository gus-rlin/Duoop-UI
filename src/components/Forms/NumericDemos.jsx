import React, { useState } from 'react';
import { Field } from './Input';
import { NumberField } from './NumberField';
import { OtpField } from './OtpField';

export function NumberDemo({ variant = 'quantity', size = 'default' }) {
  const presets = {
    quantity: { label: 'Quantity', defaultValue: 3, min: 0, description: 'Use − / + or the up and down arrow keys.' },
    decimal: { label: 'Distance', defaultValue: 1.25, step: 0.25, description: 'Increments of 0.25. Commas and dots accepted.' },
    currency: { label: 'Budget', defaultValue: 1250, step: 50, min: 0, format: 'currency', description: 'EUR · formatted when you leave the field.' },
    percent: { label: 'Discount', defaultValue: 15, step: 5, min: 0, max: 100, format: 'percent', description: '0–100% · increments of 5 percentage points.' },
    bounded: { label: 'Seats', defaultValue: 5, min: 1, max: 5, description: '1–5 seats. Each button stops at its limit.' },
    scrub: { label: 'Rotation', defaultValue: 90, min: 0, max: 360, scrub: true, description: 'Drag the area above the field, or use − / +.' },
    empty: { label: 'Optional quantity', defaultValue: null, placeholder: '—', description: 'An empty value stays empty until you enter a number.' },
    invalid: { label: 'Quantity', defaultValue: 12, min: 1, max: 10, description: 'Enter 1–10 to correct this value. Try letters to test invalid input.' },
    disabled: { label: 'Reserved seats', defaultValue: 4, disabled: true, description: 'This value is managed by your administrator.' },
  };
  const { label, description, ...props } = presets[variant];
  return <Field label={label} description={description}><NumberField {...props} size={size} /></Field>;
}

export function OtpDemo({ length = 6, grouped = false, alphanumeric = false, masked = false, size = 'default', variant = 'default' }) {
  const expected = alphanumeric ? 'AB12CD'.slice(0, length) : '123456'.slice(0, length);
  const [code, setCode] = useState(variant === 'partial' ? '12' : variant === 'rejected' ? '000000'.slice(0, length) : '');
  const [status, setStatus] = useState(variant === 'rejected' ? 'error' : '');
  const description = variant === 'paste' ? `Paste ${alphanumeric ? 'ab-12-cd' : '123 456'}. Spaces and separators are removed automatically.` : variant === 'partial' ? `Continue the code. Try ${expected}.` : `Demo code: ${expected}. Validated automatically when complete.`;
  return <Field label={alphanumeric ? 'Verification key' : 'Verification code'} description={description} error={status === 'error' ? 'Code not recognized. Try the demo code above.' : undefined} success={status === 'success' ? 'Code accepted.' : undefined}>
    <OtpField length={length} grouped={grouped} alphanumeric={alphanumeric} masked={masked} size={size} placeholder={variant === 'placeholder' ? '○' : ''} disabled={variant === 'disabled'} value={code} onValueChange={next => { setCode(next); setStatus(''); }} onComplete={next => setStatus(next === expected ? 'success' : 'error')} />
  </Field>;
}
