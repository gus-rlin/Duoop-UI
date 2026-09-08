import React, { useId, useState } from 'react';
import { normalizeColor } from './buttonColor';

export function ColorControl({ value, onChange, fallback = '#373434', label = 'Color', description = 'Shadow, hover and text colors adapt automatically.' }) {
  const id = useId();
  const [draft, setDraft] = useState(value || '');
  const invalid = Boolean(draft && !normalizeColor(draft));
  return <fieldset className="color-control"><legend>{label}</legend>
    <div className="color-inputs">
      <input type="color" aria-label="Choose color" value={value || fallback} onChange={event => { onChange(event.target.value); setDraft(event.target.value); }} />
      <input aria-label="Hex color" placeholder={fallback} value={draft} maxLength={7} spellCheck={false} aria-invalid={invalid} aria-describedby={id} onChange={event => { const next = event.target.value; setDraft(next); if (!next) onChange(''); else if (normalizeColor(next)) onChange(normalizeColor(next)); }} />
      <button type="button" onClick={() => { onChange(''); setDraft(''); }}>Reset</button>
    </div>
    <p id={id}>{invalid ? 'Enter a hex color, e.g. #86c5ff.' : description}</p>
  </fieldset>;
}
