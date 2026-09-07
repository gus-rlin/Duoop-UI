import React, { createContext, useContext, useId, useMemo, useRef, useState } from 'react';
import './Accordion.css';


const AccordionContext = createContext(null);

export function Accordion({ children, type = 'single', value, defaultValue, onValueChange, collapsible = true, variant = 'divided', size = 'md', iconPosition = 'right', className = '', ...props }) {
  const initial = type === 'multiple' ? (defaultValue ?? []) : (defaultValue ?? '');
  const [internal, setInternal] = useState(initial);
  const current = value ?? internal;
  const root = useRef(null);
  const open = item => type === 'multiple' ? current.includes(item) : current === item;
  const toggle = item => {
    const next = type === 'multiple'
      ? (open(item) ? current.filter(entry => entry !== item) : [...current, item])
      : (open(item) && collapsible ? '' : item);
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  function move(event) {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    const triggers = [...root.current.querySelectorAll(':scope > .duoop-accordion__item > .duoop-accordion__heading > .duoop-accordion__trigger:not(:disabled)')];
    const index = triggers.indexOf(event.currentTarget);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? triggers.length - 1 : (index + (event.key === 'ArrowDown' ? 1 : -1) + triggers.length) % triggers.length;
    event.preventDefault(); triggers[next]?.focus();
  }
  const context = useMemo(() => ({ open, toggle, move, iconPosition }), [current, type, collapsible, iconPosition]);
  return <AccordionContext.Provider value={context}><div ref={root} className={`duoop-accordion duoop-accordion--${variant} duoop-accordion--${size} ${className}`.trim()} {...props}>{children}</div></AccordionContext.Provider>;
}

export function AccordionItem({ value, disabled = false, children, className = '' }) {
  const baseId=useId(); return <section className={`duoop-accordion__item ${className}`.trim()} data-disabled={disabled || undefined} data-value={value}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, { itemValue: value, itemDisabled: disabled, baseId }) : child)}</section>;
}

export function AccordionTrigger({ children, description, meta, icon, itemValue, itemDisabled, baseId }) {
  const context = useContext(AccordionContext); const isOpen = context.open(itemValue);
  const indicator = icon === null ? null : <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 7.5 5 5 5-5" /></svg>;
  return <h3 className="duoop-accordion__heading"><button id={`${baseId}-trigger`} className="duoop-accordion__trigger" type="button" disabled={itemDisabled} aria-expanded={isOpen} aria-controls={`${baseId}-panel`} onClick={() => context.toggle(itemValue)} onKeyDown={context.move}>
    {indicator && context.iconPosition === 'left' && <span className="duoop-accordion__chevron">{indicator}</span>}
    {icon && icon !== null && <span className="duoop-accordion__leading" aria-hidden="true">{icon}</span>}
    <span className="duoop-accordion__copy"><span>{children}</span>{description && <small>{description}</small>}</span>{meta && <span className="duoop-accordion__meta">{meta}</span>}
    {indicator && context.iconPosition !== 'left' && <span className="duoop-accordion__chevron">{indicator}</span>}
  </button></h3>;
}

export function AccordionContent({ children, itemValue, baseId }) {
  const context = useContext(AccordionContext); const isOpen = context.open(itemValue);
  return <div className="duoop-accordion__region" data-open={isOpen || undefined} aria-hidden={!isOpen} inert={!isOpen}><div className="duoop-accordion__clip"><div id={`${baseId}-panel`} role="region" aria-labelledby={`${baseId}-trigger`} className="duoop-accordion__content">{children}</div></div></div>;
}

