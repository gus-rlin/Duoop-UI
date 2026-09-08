import React, { useId, useRef, useState } from 'react';
import './Folder.css';

const flapPath = 'M24 236Q8 236 8 220V28Q8 12 24 12H108Q119 12 126 21L139 37Q146 46 158 46H376Q392 46 392 62V220Q392 236 376 236Z';

/** A small document collection. Item IDs must be unique and stable. */
export function Folder({ items = [], label = 'Documents', defaultOpen = false, onSelect, className = '' }) {
  const [open, setOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(null);
  const trigger = useRef(null);
  const id = useId();
  const state = open ? 'expanded' : hovered ? 'preview' : 'closed';
  return <div className={`duoop-folder ${className}`} data-open={open} data-state={state}
    onPointerLeave={() => setHovered(false)}
    onKeyDown={event => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        setOpen(false);
        setHovered(false);
        trigger.current?.focus();
      }
    }}>
    <svg className="duoop-folder__back" viewBox="0 0 400 250" fill="none" aria-hidden="true">
      <path d={flapPath} fill="#e7e3e1" stroke="#1d1b1b" strokeWidth="3.5" strokeLinejoin="round" />
    </svg>
    <div className="duoop-folder__cover"
      onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true); }}
      onPointerLeave={() => setHovered(false)}>
    <button ref={trigger} type="button" className="duoop-folder__front" aria-expanded={open} aria-controls={id} onClick={() => setOpen(value => !value)}>
      <svg className="duoop-folder__flap" viewBox="0 0 400 250" fill="none" aria-hidden="true">
        <path d={flapPath} transform="translate(0 6)" fill="#1d1b1b" stroke="#1d1b1b" strokeWidth="3.5" strokeLinejoin="round" />
        <path className="duoop-folder__flap-face" d={flapPath} fill="#ffffff" stroke="#1d1b1b" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M42 24Q42 35 54 36Q42 37 42 48Q41 37 30 36Q41 35 42 24Z" fill="#373434" />
        <path d="M68 36H99" stroke="#373434" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <span className="duoop-folder__caption"><strong>{label}</strong></span>
      <span className="duoop-folder__toggle"><span>{open ? 'Put away' : 'View files'}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="m8 10 4 4 4-4" /></svg></span>
    </button>
    </div>
    <div id={id} className="duoop-folder__documents" inert={!open} aria-hidden={!open} role="group" aria-label={`${label} documents`} data-many={items.length > 3}>
      {items.map((item, index) => <button type="button" key={item.id} disabled={item.disabled} className="duoop-folder__document" aria-pressed={selected === item.id} style={{ '--offset': index % 3 - (Math.min(3, items.length) - 1) / 2, '--rise': items.length === 1 ? '-120%' : items.length >= 3 && index % 3 === 1 ? '-150%' : '-112%' }} onClick={() => {
        setSelected(item.id);
        onSelect?.(item);
      }}>
        <span className="duoop-folder__document-top"><span>{item.type || 'DOC'}</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">{selected === item.id ? <path d="m5 12 4 4L19 6" /> : <path d="M6 3h8l4 4v14H6V3Zm8 0v5h4M9 12h6M9 16h4" />}</svg></span>
        <strong>{item.title}</strong><span className="duoop-folder__meta">{item.description || 'Document'}</span>
      </button>)}
      {!items.length && <p className="duoop-folder__empty">No documents yet.</p>}
    </div>
  </div>;
}
