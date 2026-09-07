import React, { useId, useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FeedbackIcon } from '../Feedback/FeedbackIcon';
import '../Feedback/Feedback.css';
import './Progress.css';

export const progressStates = { waiting:'Waiting', preparing:'Preparing…', running:'In progress', paused:'Paused', finalizing:'Finalizing…', success:'Complete', error:'Failed', cancelled:'Cancelled', partial:'Partially complete' };

/** Controlled progress: reaching max does not imply a confirmed success. */
export function Progress({ value = 0, max = 100, state = 'running', shape = 'linear', size = 'md', label = 'Progress', hideLabel = false, display = 'percent', description, buffer, segments = 0, rounded = true, textPosition = 'above', children, className = '', ...props }) {
  const id = useId();
  const root = useRef(null);
  const drawn = useRef(null);
  const limit = Number.isFinite(max) && max > 0 ? max : 100;
  const current = Number.isFinite(value) ? Math.min(limit, Math.max(0, value)) : 0;
  const indefinite = value === null || state === 'preparing';
  const percent = current / limit * 100;
  const buffered = Number.isFinite(buffer) ? Math.max(percent, Math.min(100, buffer / limit * 100)) : percent;
  const status = progressStates[state] || progressStates.running;
  const amount = indefinite ? status : display === 'quantity' ? `${current} / ${limit}` : `${Math.round(percent)}%`;
  const terminal = ['success', 'error', 'cancelled', 'partial'].includes(state);
  const ring = shape === 'circular';
  useLayoutEffect(() => {
    const node = root.current;
    const fill = node.querySelector('.progress-fill');
    const arc = node.querySelector('.progress-ring-fill');
    const counter = node.querySelector('[data-progress-counter]');
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tween;
    const model = { percent: drawn.current ?? percent };
    const paint = () => {
      drawn.current = model.percent;
      if (fill) fill.style.transform = `scaleX(${model.percent / 100})`;
      if (arc) arc.style.strokeDasharray = `${model.percent} 100`;
      if (counter && display === 'percent') counter.textContent = `${Math.round(model.percent)}%`;
    };
    const update = () => {
      tween?.kill();
      if (indefinite) { drawn.current = null; return; }
      if (media.matches || ['paused','waiting','error','cancelled'].includes(state)) { model.percent = percent; paint(); }
      else { paint(); tween = gsap.to(model, { percent, duration:.6, ease:'power3.out', onUpdate:paint }); }
    };
    update();
    media.addEventListener('change', update);
    return () => { tween?.kill(); media.removeEventListener('change', update); };
  }, [percent, indefinite, state, ring, display]);

  return <div ref={root} className={`duoop-progress ${className}`} data-state={state} data-shape={shape} data-size={size} data-rounded={rounded} data-text-position={textPosition} data-indeterminate={indefinite}>
    <div className={`progress-heading ${hideLabel && (display === 'none' || ring) ? 'duoop-sr-only' : ''}`}>
      <span id={`${id}-label`} className={hideLabel ? 'duoop-sr-only' : ''}>{label}</span>
      {!ring && display !== 'none' && <span className="progress-value" data-progress-counter aria-hidden="true">{amount}</span>}
    </div>
    <div {...props} className="progress-meter" role="progressbar" aria-labelledby={`${id}-label`} aria-describedby={`${id}-status`} aria-valuemin={0} aria-valuemax={limit} aria-valuenow={indefinite ? undefined : current} aria-valuetext={`${status}${indefinite ? '' : `, ${amount}`}`}>
      {ring ? <div className="progress-ring">
        <svg viewBox="0 0 120 120" aria-hidden="true"><circle className="progress-ring-edge" cx="60" cy="60" r="50" /><circle className="progress-ring-track" cx="60" cy="60" r="50" /><circle className="progress-ring-fill" cx="60" cy="60" r="50" pathLength="100" style={{ strokeDasharray:`${indefinite ? 26 : percent} 100` }} /></svg>
        <span className="progress-ring-center" key={terminal ? state : 'value'}>{terminal ? <FeedbackIcon status={state} /> : children || (!indefinite && display !== 'none' ? <strong data-progress-counter aria-hidden="true">{amount}</strong> : null)}</span>
      </div> : <div className="progress-track">
        {buffer !== undefined && <span className="progress-buffer" style={{ transform:`scaleX(${buffered / 100})` }} />}
        <span className="progress-fill" style={indefinite ? undefined : { transform:`scaleX(${percent / 100})` }} />
        {segments > 1 && <span className="progress-segments" aria-hidden="true">{Array.from({ length:Math.min(100, Math.floor(segments)) - 1 }, (_, i) => <i key={i} style={{ insetInlineStart:`${(i + 1) / Math.min(100, Math.floor(segments)) * 100}%` }} />)}</span>}
      </div>}
      {state === 'success' && <span className="progress-arrival" aria-hidden="true" />}
    </div>
    <div className="progress-caption" id={`${id}-status`}>
      <span className="progress-status" role="status">{(state !== 'running' || ring && indefinite) && <>{state !== 'running' && <FeedbackIcon key={state} status={state} />}{status}</>}</span>
      {description && <span>{description}</span>}
    </div>
  </div>;
}
