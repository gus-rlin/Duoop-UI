import React, { useId, useRef, useState } from 'react';
import { Button } from '../Button/Button';
import { ExperienceIcon } from '../Feedback/ExperienceIcon';
import '../Feedback/Feedback.css';
import './Stepper.css';

export const stepStates = { upcoming:'Upcoming', current:'In progress', complete:'Complete', skipped:'Skipped', error:'Needs attention', loading:'Validating…', blocked:'Prerequisite required', disabled:'Disabled' };
const resolved = state => ['complete', 'skipped'].includes(state);
export function getStepState(item, index, currentIndex) {
  return item.state || (index < currentIndex ? 'complete' : index === currentIndex ? 'current' : 'upcoming');
}

/** Controlled navigation. Validation and conditional item inclusion belong to the caller. */
export function Stepper({ items, value, onValueChange, label = 'Setup progress', orientation = 'horizontal', presentation = 'standard', indicator = 'number', labels = 'below', connector = 'continuous', progress = 0, linear = true, allowBack = true, content = 'none', mobile = 'vertical', overflow = 'scroll', size = 'md', formatSummary = (step, total) => `Step ${step} of ${total}`, className = '', ...props }) {
  const id = useId();
  const root = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const currentIndex = Math.max(0, items.findIndex(item => item.id === value));
  const current = items[currentIndex];
  const interactive = Boolean(onValueChange);
  const states = items.map((item, index) => getStepState(item, index, currentIndex));
  function canVisit(index) {
    if (!items[index] || ['blocked', 'disabled', 'loading'].includes(states[index])) return false;
    if (!allowBack && index < currentIndex) return false;
    return !linear || index <= currentIndex || states.slice(0, index).every(resolved);
  }
  function keys(event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key)) return;
    const buttons = [...event.currentTarget.querySelectorAll('button[data-step]:not(:disabled)')];
    const active = buttons.indexOf(document.activeElement);
    if (active < 0) return;
    const rtl = getComputedStyle(root.current).direction === 'rtl';
    const forward = ['ArrowDown', rtl ? 'ArrowLeft' : 'ArrowRight'].includes(event.key);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 : Math.max(0, Math.min(buttons.length - 1, active + (forward ? 1 : -1)));
    event.preventDefault();
    buttons[next]?.focus();
  }
  const visible = items.map((_, i) => i).filter(i => overflow !== 'condensed' || expanded || items.length <= 5 || i === 0 || i === items.length - 1 || Math.abs(i - currentIndex) <= 1);
  const fraction = Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;
  function expandAt(index) {
    setExpanded(true);
    requestAnimationFrame(() => {
      const controls = root.current?.querySelectorAll('button[data-step]') || [];
      const target = [...controls].find(control => control.dataset.step === items[index].id && !control.disabled);
      const fallback = [...controls].find(control => control.getAttribute('aria-current') === 'step' && !control.disabled);
      (target || fallback)?.focus();
    });
  }
  if (!current) return <p className="stepper-empty" role="status">No steps available.</p>;
  return <div {...props} ref={root} className={`duoop-stepper ${className}`} data-orientation={orientation} data-presentation={presentation} data-indicator={indicator} data-labels={labels} data-connector={connector} data-mobile={mobile} data-overflow={overflow} data-size={size}>
    <div className="stepper-mobile-summary"><span className="stepper-marker" aria-hidden="true">{currentIndex + 1}</span><div><small>{formatSummary(currentIndex + 1, items.length)}</small><strong>{current.title}</strong></div>{interactive && <div className="stepper-summary-actions"><Button variant="outline" iconPosition="only" icon={<span aria-hidden="true">−</span>} aria-label="Previous step" disabled={!canVisit(currentIndex - 1)} onClick={() => onValueChange(items[currentIndex - 1].id)} /><Button variant="outline" iconPosition="only" icon={<ExperienceIcon name="arrow" />} aria-label="Next step" disabled={!canVisit(currentIndex + 1)} onClick={() => onValueChange(items[currentIndex + 1].id)} /></div>}</div>
    <nav aria-label={label} className="stepper-navigation">
      <ol className="stepper-list" onKeyDown={keys}>
        {visible.map((index, position) => {
          const item = items[index];
          const state = states[index];
          const stateLabel = item.stateLabel || stepStates[state];
          const active = index === currentIndex;
          const Control = interactive ? 'button' : 'div';
          const gap = position > 0 && index - visible[position - 1] > 1;
          const mark = state === 'complete' ? <ExperienceIcon name="success" /> : state === 'skipped' ? <ExperienceIcon name="minus" /> : state === 'error' ? <ExperienceIcon name="error" /> : state === 'loading' ? <ExperienceIcon name="loading" /> : ['blocked', 'disabled'].includes(state) ? <ExperienceIcon name="lock" /> : indicator === 'icon' ? item.icon || <ExperienceIcon name="file" /> : indicator === 'dot' ? <span className="stepper-dot" /> : index + 1;
          return <React.Fragment key={item.id}>{gap && <li className="stepper-gap"><span className="stepper-connector" aria-hidden="true"><i style={{ '--step-progress':0 }} /></span><Button variant="outline" size="sm" iconPosition="only" icon={<ExperienceIcon name="more" />} aria-label={`Show ${index - visible[position - 1] - 1} hidden steps`} onClick={() => expandAt(visible[position - 1] + 1)} /><small aria-hidden="true">{index - visible[position - 1] - 1} hidden</small></li>}<li className="stepper-item" data-state={state} data-active={active}>
            {position < visible.length - 1 && <span className="stepper-connector" aria-hidden="true"><i style={{ '--step-progress':resolved(state) ? 1 : active ? fraction : 0 }} /></span>}
            <Control {...(interactive ? { type:'button', disabled:!canVisit(index), onClick:() => onValueChange(item.id), 'data-step':item.id } : {})} className="stepper-control" aria-current={active ? 'step' : undefined} aria-controls={content === 'none' ? undefined : `${id}-panel-${content === 'panel' ? 'active' : item.id}`} aria-label={interactive ? `${index + 1}. ${item.title}. ${stateLabel}${item.optional ? '. Optional' : ''}` : undefined}>
              <span className="stepper-marker" key={state} aria-hidden="true">{mark}</span>
              <span className="stepper-copy"><strong>{item.title}</strong>{presentation === 'detailed' && item.description && <span>{item.description}</span>}<small>{item.optional ? 'Optional · ' : ''}{stateLabel}</small></span>
            </Control>
            {content === 'inline' && <div id={`${id}-panel-${item.id}`} hidden={!active} className="stepper-inline-panel">{active && item.content}</div>}
          </li></React.Fragment>;
        })}
      </ol>
    </nav>
    {content === 'panel' && <section className="stepper-panel" id={`${id}-panel-active`} aria-label={current.title}><div key={current.id}>{current.content}</div></section>}
    <span className="duoop-sr-only" role="status">{formatSummary(currentIndex + 1, items.length)}. {current.title}. {current.stateLabel || stepStates[states[currentIndex]]}</span>
  </div>;
}
