import React, { useId } from 'react';
import './Selection.css';

/** Native radios preserve arrow navigation, form values and clickable labels. */
export function RadioGroup({ legend, name, options, value, defaultValue, onChange, description, error, required = false, disabled = false, layout = 'vertical', variant = 'plain', indicator = 'start', className = '', children, ...props }) {
  const id = useId();
  const help = [props['aria-describedby'], description && `${id}-help`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;
  return <fieldset {...props} disabled={disabled} className={`selection-group ${className}`} aria-describedby={help} aria-invalid={error ? true : undefined} data-invalid={!!error}>
    <legend>{legend}{required && <small> (required)</small>}</legend>
    {description && <p className="selection-help" id={`${id}-help`}>{description}</p>}
    <div className={`radio-options radio-options--${layout} radio-options--${variant}`}>
      {options.map(option => {
        const optionId = `${id}-${option.value}`;
        return <label key={option.value} className={`radio-option radio-option--${variant}`} data-indicator={indicator}>
          <span className="radio-control"><input type="radio" name={name || id} value={option.value} disabled={option.disabled} required={required} checked={value !== undefined ? value === option.value : undefined} defaultChecked={value === undefined ? defaultValue === option.value : undefined} onChange={onChange} aria-labelledby={`${optionId}-label`} aria-describedby={[help, option.description && `${optionId}-description`].filter(Boolean).join(' ') || undefined} aria-invalid={error ? true : undefined} /><span className="radio-disc" aria-hidden="true"><span /></span></span>
          <span className="selection-content">
            {option.image && <span className="selection-image" aria-hidden="true">{option.image}</span>}
            {option.swatch && <span className="selection-swatch" style={{ background: option.swatch }} aria-hidden="true" />}
            <span className="selection-title"><span id={`${optionId}-label`}>{option.icon && <span className="selection-icon" aria-hidden="true">{option.icon}</span>}{option.label}</span>{option.badge && <span className="selection-badge">{option.badge}</span>}</span>
            {option.price && <span className="selection-price">{option.price}<small> / month</small></span>}
            {option.description && <span className="selection-help" id={`${optionId}-description`}>{option.description}</span>}
            {option.features && <span className="selection-features">{option.features.map(feature => <span key={feature}>✓ {feature}</span>)}</span>}
          </span>
        </label>;
      })}
    </div>
    {children}
    <div aria-live="polite">{error && <p className="selection-error" id={`${id}-error`}>{error}</p>}</div>
  </fieldset>;
}

/** Controlled and uncontrolled binary switch; onChange receives a native event. */
export function Switch({ label, description, error, size = 'default', position = 'start', variant = 'plain', icon, internalIcons = false, showState = false, pending = false, className = '', id, ...props }) {
  const generated = useId();
  const controlId = id || generated;
  const help = [props['aria-describedby'], description && `${controlId}-help`, error && `${controlId}-error`].filter(Boolean).join(' ') || undefined;
  return <div className={`duoop-switch duoop-switch--${size} duoop-switch--${variant} ${className}`} data-invalid={!!error}>
    <label className="switch-label" htmlFor={controlId} data-position={position}>
      <span className="switch-control"><input {...props} id={controlId} type="checkbox" role="switch" aria-describedby={help} aria-invalid={error ? true : props['aria-invalid']} aria-busy={pending || undefined} disabled={props.disabled || pending} /><span className="switch-track" aria-hidden="true">{internalIcons && <span className="switch-track-icons"><span>✓</span><span>−</span></span>}<span className="switch-thumb">{pending && <span className="switch-spinner" />}</span></span></span>
      {label && <span className="selection-content"><span className="selection-title">{icon && <span className="selection-icon" aria-hidden="true">{icon}</span>}{label}{props.required && <small> (required)</small>}</span>{description && <span className="selection-help" id={`${controlId}-help`}>{description}</span>}</span>}
      {showState && <span className="switch-state" aria-hidden="true"><span className="switch-state-on">Enabled</span><span className="switch-state-off">Disabled</span></span>}
    </label>
    {!label && description && <p className="selection-help" id={`${controlId}-help`}>{description}</p>}
    <div aria-live="polite">{error && <p className="selection-error" id={`${controlId}-error`}>{error}</p>}</div>
  </div>;
}
