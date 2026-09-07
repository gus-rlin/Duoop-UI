import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAnchoredOverlay } from '../useAnchoredOverlay';
import './Select.css';
import './SelectPlacement.css';

export function Select({
  options,
  value,
  defaultValue,
  onValueChange,
  multiple = false,
  placeholder = 'Select an option',
  size = 'md',
  variant = 'default',
  width = 'content',
  placement = 'bottom-start',
  defaultOpen = false,
  disabled = false,
  invalid = false,
  required = false,
  label,
  'aria-label': ariaLabel,
  description,
  error,
  renderValue,
  className = '',
}) {
  const id = useId();
  const root = useRef(null);
  const trigger = useRef(null);
  const overlay = useRef(null);
  const list = useRef(null);
  const [internal, setInternal] = useState(defaultValue ?? (multiple ? [] : null));
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(0);
  const current = value ?? internal;
  const flat = useMemo(() => options.flatMap((group) => group.options ?? [group]), [options]);
  const enabled = flat.filter((option) => !option.disabled);
  const selected = (option) =>
    multiple ? current.includes(option.value) : current === option.value;
  const chosen = flat.filter(selected);
  const display = renderValue
    ? renderValue(current, chosen)
    : multiple
      ? chosen.length
        ? `${chosen[0].label}${chosen.length > 1 ? ` (+${chosen.length - 1})` : ''}`
        : placeholder
      : (chosen[0]?.label ?? placeholder);
  const anchored = useAnchoredOverlay({
    open,
    anchorRef: trigger,
    overlayRef: overlay,
    placement,
    gap: 9,
    minimumWidth: 240,
  });
  useEffect(() => {
    if (!open) return;
    const close = (event) => {
      if (!root.current?.contains(event.target) && !overlay.current?.contains(event.target))
        setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const closeOnExternalGesture = (event) => {
      if (!overlay.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener('wheel', closeOnExternalGesture, {
      capture: true,
      passive: true,
    });
    document.addEventListener('touchmove', closeOnExternalGesture, {
      capture: true,
      passive: true,
    });
    return () => {
      document.removeEventListener('wheel', closeOnExternalGesture, true);
      document.removeEventListener('touchmove', closeOnExternalGesture, true);
    };
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const index = Math.max(0, enabled.findIndex(selected));
    setActive(index);
    requestAnimationFrame(() => {
      const container = list.current;
      const option = container?.querySelector('[data-active=true]');
      if (!container || !option) return;
      const top = option.offsetTop;
      const bottom = top + option.offsetHeight;
      if (top < container.scrollTop) container.scrollTop = top;
      else if (bottom > container.scrollTop + container.clientHeight)
        container.scrollTop = bottom - container.clientHeight;
    });
  }, [open]);
  useEffect(() => {
    if (open && enabled[active])
      document
        .getElementById(`${id}-option-${flat.indexOf(enabled[active])}`)
        ?.scrollIntoView({ block: 'nearest' });
  }, [open, active]);
  function choose(option) {
    if (!option || option.disabled) return;
    const next = multiple
      ? selected(option)
        ? current.filter((item) => item !== option.value)
        : [...current, option.value]
      : option.value;
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
    if (!multiple) {
      setOpen(false);
      trigger.current?.focus();
    }
  }
  function keydown(event) {
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (!open) return setOpen(true);
      if (!enabled.length) return;
      const next =
        event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? enabled.length - 1
            : (active + (event.key === 'ArrowDown' ? 1 : -1) + enabled.length) %
              enabled.length;
      setActive(next);
    } else if ((event.key === 'Enter' || event.key === ' ') && open) {
      event.preventDefault();
      choose(enabled[active]);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      trigger.current?.focus();
    } else if (event.key === 'Tab') setOpen(false);
  }
  function renderOption(option) {
    const index = enabled.indexOf(option);
    return (
      <li
        key={String(option.value)}
        id={`${id}-option-${flat.indexOf(option)}`}
        role="option"
        aria-selected={selected(option)}
        aria-disabled={option.disabled || undefined}
        data-active={index === active || undefined}
        data-selected={selected(option) || undefined}
        onPointerMove={() => !option.disabled && setActive(index)}
        onClick={() => choose(option)}
      >
        {option.icon && (
          <span className="duoop-select__option-icon" aria-hidden="true">
            {option.icon}
          </span>
        )}
        <span className="duoop-select__option-copy">
          <strong>{option.label}</strong>
          {option.description && <small>{option.description}</small>}
        </span>
        {option.meta && <span className="duoop-select__option-meta">{option.meta}</span>}
        <svg className="duoop-select__check" viewBox="0 0 20 20" aria-hidden="true">
          <path d="m4 10 4 4 8-9" />
        </svg>
      </li>
    );
  }
  return (
    <div
      className={`duoop-select-field duoop-select-field--${width} ${className}`.trim()}
      ref={root}
    >
      {label && (
        <label id={`${id}-label`} htmlFor={`${id}-trigger`}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      )}
      {description && (
        <span className="duoop-select__help" id={`${id}-help`}>
          {description}
        </span>
      )}
      <button
        ref={trigger}
        id={`${id}-trigger`}
        type="button"
        className={`duoop-select duoop-select--${size} duoop-select--${variant}`}
        role="combobox"
        aria-label={label ? undefined : ariaLabel || placeholder}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-activedescendant={
          open && enabled[active] ? `${id}-option-${flat.indexOf(enabled[active])}` : undefined
        }
        aria-expanded={open}
        aria-controls={open ? `${id}-list` : undefined}
        aria-labelledby={label ? `${id}-label ${id}-trigger` : undefined}
        aria-describedby={error ? `${id}-error` : description ? `${id}-help` : undefined}
        aria-invalid={invalid || undefined}
        onClick={() => setOpen((state) => !state)}
        onKeyDown={keydown}
      >
        <span data-placeholder={!chosen.length || undefined}>{display}</span>
        <svg viewBox="0 0 20 20" aria-hidden="true">
          <path d="m5 7.5 5 5 5-5" />
        </svg>
      </button>
      {open &&
        createPortal(
          <div
            ref={overlay}
            className={`duoop-select__popup duoop-select__popup--${anchored.resolvedPlacement}`}
            style={anchored.style}
          >
            <ul
              ref={list}
              id={`${id}-list`}
              role="listbox"
              aria-multiselectable={multiple || undefined}
              aria-labelledby={label ? `${id}-label` : undefined}
              tabIndex={-1}
              onKeyDown={keydown}
            >
              {options.map((entry, groupIndex) =>
                entry.options ? (
                  <React.Fragment key={entry.label ?? groupIndex}>
                    {entry.label && (
                      <li className="duoop-select__group" role="presentation">
                        {entry.label}
                      </li>
                    )}
                    {entry.options.map(renderOption)}
                    {groupIndex < options.length - 1 && (
                      <li className="duoop-select__separator" role="separator" />
                    )}
                  </React.Fragment>
                ) : (
                  renderOption(entry)
                ),
              )}
            </ul>
          </div>,
          trigger.current?.closest('dialog') || document.body,
        )}
      {error && (
        <span className="duoop-select__error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
