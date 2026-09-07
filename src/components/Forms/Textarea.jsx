import React, { useLayoutEffect, useRef } from 'react';
import './Forms.css';
import './EnrichedForms.css';

export function Textarea({ size = 'default', autoSize = false, resize = 'none', className = '', ref, onChange, ...props }) {
  const localRef = useRef(null);
  function fit() {
    const node = localRef.current;
    if (!autoSize || !node) return;
    node.style.height = 'auto';
    node.style.height = `${node.scrollHeight + node.offsetHeight - node.clientHeight}px`;
  }
  useLayoutEffect(() => {
    if (!autoSize) return;
    fit();
    const observer = new ResizeObserver(entries => {
      const width = entries[0].contentRect.width;
      if (width !== previousWidth) { previousWidth = width; fit(); }
    });
    let previousWidth = localRef.current.clientWidth;
    observer.observe(localRef.current);
    return () => observer.disconnect();
  }, [autoSize, props.value, props.defaultValue]);
  const control = <textarea {...props} ref={node => { localRef.current = node; if (typeof ref === 'function') return ref(node); else if (ref) ref.current = node; }}
    className={`duoop-input duoop-input--${size} duoop-textarea ${className}`}
    style={{ ...props.style, resize: 'none', overflowY: autoSize ? 'hidden' : 'auto' }}
    onChange={event => { fit(); onChange?.(event); }} />;
  if (autoSize || resize !== 'vertical') return control;
  function resizeTo(height) { localRef.current.style.height = `${Math.max(84, Math.min(600, height))}px`; }
  return <div className="textarea-resizable">{control}<button type="button" className="textarea-resize-handle" aria-label="Resize message height" disabled={props.disabled}
    onPointerDown={event => { event.currentTarget.setPointerCapture(event.pointerId); event.currentTarget.dataset.startY = event.clientY; event.currentTarget.dataset.startHeight = localRef.current.offsetHeight; }}
    onPointerMove={event => { if (event.currentTarget.hasPointerCapture(event.pointerId)) resizeTo(Number(event.currentTarget.dataset.startHeight) + event.clientY - Number(event.currentTarget.dataset.startY)); }}
    onPointerUp={event => event.currentTarget.releasePointerCapture(event.pointerId)}
    onKeyDown={event => { if (['ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) { event.preventDefault(); resizeTo(event.key === 'Home' ? 84 : event.key === 'End' ? 600 : localRef.current.offsetHeight + (event.key === 'ArrowUp' ? -24 : 24)); } }}><span /></button></div>;
}
