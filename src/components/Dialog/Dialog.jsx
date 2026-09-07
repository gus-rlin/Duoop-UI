import React, { createContext, useContext, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './Dialog.css';
import './DialogPosition.css';

const DialogContext = createContext(null);
export function Dialog({ children, open: controlled, defaultOpen = false, onOpenChange, size = 'md', mobile = 'center', closeOnBackdrop = true, closeOnEscape = true, confirmClose, initialFocusRef }) {
  const [internal,setInternal]=useState(defaultOpen); const open=controlled??internal; const dialog=useRef(null); const titleId=useId(); const descriptionId=useId();
  const setOpen=next=>{if(controlled===undefined)setInternal(next);onOpenChange?.(next)};
  const requestClose=()=>{if(confirmClose&&!confirmClose())return;setOpen(false)};
  useEffect(()=>{const node=dialog.current;if(open&&!node.open){node.showModal();requestAnimationFrame(()=>initialFocusRef?.current?.focus())}else if(!open&&node.open)node.close()},[open]);
  useEffect(()=>{const node=dialog.current;const closed=()=>setOpen(false);node?.addEventListener('close',closed);return()=>node?.removeEventListener('close',closed)},[]);
  const context={open,setOpen,requestClose,titleId,descriptionId};
  const entries=React.Children.toArray(children); const triggers=entries.filter(child=>child.type===DialogTrigger); const content=entries.filter(child=>child.type!==DialogTrigger);
  return <DialogContext.Provider value={context}>{triggers}{createPortal(<dialog ref={dialog} className={`duoop-dialog duoop-dialog--${size} duoop-dialog--mobile-${mobile}`} aria-labelledby={titleId} aria-describedby={descriptionId} onCancel={event=>{event.preventDefault();if(closeOnEscape)requestClose()}} onPointerDown={event=>{if(closeOnBackdrop&&event.target===event.currentTarget)requestClose()}}><div className="duoop-dialog__surface">{content}</div></dialog>,document.body)}</DialogContext.Provider>;
}
export function DialogTrigger({children}){const dialog=useContext(DialogContext);return React.cloneElement(children,{onClick:event=>{children.props.onClick?.(event);dialog.setOpen(true)}})}
export function DialogContent({children,showCloseButton=true}){const dialog=useContext(DialogContext);return <>{showCloseButton&&<button type="button" className="duoop-dialog__close" aria-label="Close dialog" onClick={dialog.requestClose}><svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15"/></svg></button>}{children}</>}
export function DialogHeader({children}){return <header className="duoop-dialog__header">{children}</header>}
export function DialogTitle({children}){const dialog=useContext(DialogContext);return <h2 id={dialog.titleId}>{children}</h2>}
export function DialogDescription({children}){const dialog=useContext(DialogContext);return <p id={dialog.descriptionId}>{children}</p>}
export function DialogBody({children,className=''}){return <div className={`duoop-dialog__body ${className}`.trim()}>{children}</div>}
export function DialogFooter({children,bare=false}){return <footer className="duoop-dialog__footer" data-bare={bare||undefined}>{children}</footer>}
export function DialogClose({children}){const dialog=useContext(DialogContext);return React.cloneElement(children,{onClick:event=>{children.props.onClick?.(event);dialog.requestClose()}})}
