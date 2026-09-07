import React, { useId } from 'react';
import './Forms.css';

export function Input({ size = 'default', className = '', ...props }) {
  return <input {...props} size={typeof size === 'number' ? size : undefined} className={`duoop-input duoop-input--${typeof size === 'string' ? size : 'default'} ${className}`} />;
}

export function Field({ id, label, description, error, success, required, optional, disabled, orientation = 'vertical', children, className = '' }) {
  const generatedId = useId();
  const control = React.Children.only(children);
  const controlId = id || control.props.id || generatedId;
  const isRequired = required ?? control.props.required;
  const isDisabled = disabled ?? control.props.disabled;
  const message = error || success;
  const describedBy = [control.props['aria-describedby'], description && `${controlId}-help`, message && `${controlId}-message`].filter(Boolean).join(' ') || undefined;
  return <div className={`duoop-field duoop-field--${orientation} ${className}`} data-disabled={isDisabled || undefined} data-state={error ? 'error' : success ? 'success' : undefined}>
    <label htmlFor={controlId}>{label}{(isRequired || optional) && <span className="field-required"> ({isRequired ? 'required' : 'optional'})</span>}</label>
    <div className="field-content">
      {React.cloneElement(control, { id: controlId, required: isRequired, disabled: isDisabled, 'aria-describedby': describedBy, 'aria-invalid': error ? true : control.props['aria-invalid'] })}
      {description && <p id={`${controlId}-help`} className="field-help">{description}</p>}
      <div className="field-feedback" aria-live="polite" aria-atomic="true">{message && <p id={`${controlId}-message`} className={error ? 'form-validation-error' : 'field-message'}><span aria-hidden="true">{error ? '!' : '✓'}</span>{message}</p>}</div>
    </div>
  </div>;
}
