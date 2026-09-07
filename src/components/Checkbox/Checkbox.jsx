import React, { useId, useLayoutEffect, useRef } from 'react';
import './Checkbox.css';

// Native input keeps label activation, keyboard behavior and form submission.
export function Checkbox({ id, label, description, error, size = 'default', variant = 'plain', position = 'before', indeterminate = false, readOnly = false, optional = false, icon, badge, illustration, className = '', ref, onClick, onChange, ...props }) {
  const generatedId = useId();
  const controlId = id || generatedId;
  const input = useRef(null);
  useLayoutEffect(() => { input.current.indeterminate = indeterminate; });
  const describedBy = [props['aria-describedby'], description && `${controlId}-description`, error && `${controlId}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={`duoop-checkbox duoop-checkbox--${size} duoop-checkbox--${variant} ${className}`} data-position={position} data-readonly={readOnly || undefined}>
    <label className="checkbox-label" htmlFor={controlId}>
      <span className="checkbox-control">
        <input {...props} id={controlId} type="checkbox" ref={node => {
          input.current = node;
          if (typeof ref === 'function') return ref(node);
          if (ref) ref.current = node;
        }} onChange={event => { if (!readOnly) onChange?.(event); }} readOnly={readOnly} aria-readonly={readOnly || undefined} aria-invalid={error ? true : props['aria-invalid']} aria-describedby={describedBy} onClick={event => {
          if (readOnly) event.preventDefault();
          onClick?.(event);
        }} />
        <span className="checkbox-box" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none"><path className="checkbox-tick" d="m3 8 3.2 3.2L13 4.5" /><path className="checkbox-dash" d="M4 8h8" /></svg></span>
      </span>
      {(label || description || icon || badge || illustration) && <span className="checkbox-content">
        {illustration && <span className="checkbox-illustration" aria-hidden="true">{illustration}</span>}
        <span className="checkbox-title">{icon && <span className="checkbox-icon" aria-hidden="true">{icon}</span>}{label}{badge && <span className="checkbox-badge">{badge}</span>}{(props.required || optional) && <small>({props.required ? 'required' : 'optional'})</small>}{readOnly && <small>(read only)</small>}</span>
        {description && <span className="checkbox-description" id={`${controlId}-description`}>{description}</span>}
      </span>}
    </label>
    {error && <p className="checkbox-error" id={`${controlId}-error`}>{error}</p>}
  </div>;
}

export function CheckboxGroup({ legend, description, error, layout = 'vertical', children, className = '', ...props }) {
  const id = useId();
  return <fieldset {...props} className={`duoop-checkbox-group ${className}`} aria-describedby={[props['aria-describedby'], description && `${id}-description`, error && `${id}-error`].filter(Boolean).join(' ') || undefined}>
    <legend>{legend}</legend>
    {description && <p className="checkbox-group-description" id={`${id}-description`}>{description}</p>}
    <div className={`checkbox-options checkbox-options--${layout}`}>{children}</div>
    <div aria-live="polite">{error && <p className="checkbox-error" id={`${id}-error`}>{error}</p>}</div>
  </fieldset>;
}

// Pass only actionable descendants; disabled values stay untouched by the caller.
export function selectionState(values, selected) {
  const count = values.filter(value => selected.includes(value)).length;
  return { checked: values.length > 0 && count === values.length, indeterminate: count > 0 && count < values.length };
}
export function toggleSelection(selected, values, checked) {
  return checked ? [...new Set([...selected, ...values])] : selected.filter(value => !values.includes(value));
}

