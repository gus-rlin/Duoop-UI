import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import './Tabs.css';

export function Tabs({
  items,
  value,
  defaultValue,
  onValueChange,
  variant = 'contained',
  size = 'md',
  orientation = 'horizontal',
  width = 'content',
  alignment = 'start',
  activation = 'automatic',
  loop = true,
  keepMounted = false,
  transition = 'fade',
  dir,
  label = 'Tabs',
  className = '',
}) {
  const generated = useId();
  const [internal, setInternal] = useState(
    defaultValue ?? items.find((item) => !item.disabled)?.value,
  );
  const selected = value ?? internal;
  const listRef = useRef(null);
  const [indicator, setIndicator] = useState({ start: 0, size: 0, ready: false });
  const enabled = items.filter((item) => !item.disabled);
  const itemSignature = items
    .map(
      (item) =>
        `${item.value}:${typeof item.label === 'string' ? item.label : ''}:${item.disabled ? 1 : 0}`,
    )
    .join('|');
  function select(next) {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  }
  function measure() {
    const list = listRef.current;
    const tab = list?.querySelector(`[data-value="${CSS.escape(String(selected))}"]`);
    if (!list || !tab) return;
    const vertical = orientation === 'vertical';
    const start = vertical ? tab.offsetTop : tab.offsetLeft;
    const size = vertical ? tab.offsetHeight : tab.offsetWidth;
    setIndicator((current) =>
      current.start === start && current.size === size && current.ready
        ? current
        : { start, size, ready: true },
    );
  }
  useLayoutEffect(measure, [
    selected,
    orientation,
    itemSignature,
    alignment,
    width,
    size,
    dir,
    variant,
  ]);
  useEffect(() => {
    if (!listRef.current || !window.ResizeObserver) return;
    const observer = new ResizeObserver(measure);
    observer.observe(listRef.current);
    [...listRef.current.children].forEach((child) => observer.observe(child));
    return () => observer.disconnect();
  }, [selected, orientation, itemSignature]);
  function move(event, current) {
    const horizontal = orientation === 'horizontal';
    const rtl = horizontal && dir === 'rtl';
    const previousKey = horizontal ? (rtl ? 'ArrowRight' : 'ArrowLeft') : 'ArrowUp';
    const nextKey = horizontal ? (rtl ? 'ArrowLeft' : 'ArrowRight') : 'ArrowDown';
    if (![previousKey, nextKey, 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const index = enabled.findIndex((item) => item.value === current);
    let nextIndex =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? enabled.length - 1
          : index + (event.key === nextKey ? 1 : -1);
    if (loop) nextIndex = (nextIndex + enabled.length) % enabled.length;
    else nextIndex = Math.max(0, Math.min(enabled.length - 1, nextIndex));
    const next = enabled[nextIndex];
    listRef.current.querySelector(`[data-value="${CSS.escape(String(next.value))}"]`)?.focus();
    if (activation === 'automatic') select(next.value);
  }
  const style =
    orientation === 'vertical'
      ? {
          '--tabs-indicator-y': `${indicator.start}px`,
          '--tabs-indicator-h': `${indicator.size}px`,
        }
      : {
          '--tabs-indicator-x': `${indicator.start}px`,
          '--tabs-indicator-w': `${indicator.size}px`,
        };
  return (
    <div
      className={`duoop-tabs duoop-tabs--${variant} duoop-tabs--${size} duoop-tabs--${orientation} duoop-tabs--${width} duoop-tabs--align-${alignment} ${className}`}
      dir={dir}
      data-transition={transition}
    >
      <div
        ref={listRef}
        className="duoop-tabs__list"
        role="tablist"
        aria-label={label}
        aria-orientation={orientation}
        style={style}
        data-indicator-ready={indicator.ready || undefined}
      >
        <span className="duoop-tabs__indicator" aria-hidden="true" />
        {items.map((item) => {
          const Component = item.href ? 'a' : 'button';
          return (
            <Component
              key={item.value}
              id={`${generated}-tab-${item.value}`}
              data-value={item.value}
              className="duoop-tabs__tab"
              role="tab"
              {...(item.href
                ? { href: item.href, 'aria-disabled': item.disabled || undefined }
                : { type: 'button', disabled: item.disabled })}
              aria-selected={selected === item.value}
              aria-controls={`${generated}-panel-${item.value}`}
              tabIndex={item.disabled ? -1 : selected === item.value ? 0 : -1}
              onClick={(event) => {
                if (item.disabled) {
                  event.preventDefault();
                  return;
                }
                select(item.value);
              }}
              onKeyDown={(event) => move(event, item.value)}
            >
              {item.icon && (
                <span className="duoop-tabs__icon" aria-hidden="true">
                  {item.icon}
                </span>
              )}
              <span className="duoop-tabs__label">{item.label}</span>
              {item.meta}
            </Component>
          );
        })}
      </div>
      <div className="duoop-tabs__panels">
        {items.map((item) => (
          <div
            key={item.value}
            id={`${generated}-panel-${item.value}`}
            role="tabpanel"
            aria-labelledby={`${generated}-tab-${item.value}`}
            hidden={selected !== item.value}
            tabIndex={0}
            className="duoop-tabs__panel"
          >
            {(keepMounted || selected === item.value) && item.panel}
          </div>
        ))}
      </div>
    </div>
  );
}
