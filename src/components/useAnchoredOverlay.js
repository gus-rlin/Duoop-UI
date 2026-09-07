import { useLayoutEffect, useState } from 'react';

const VIEWPORT_GUTTER = 12;

export function useAnchoredOverlay({ open, anchorRef, overlayRef, placement = 'bottom-start', gap = 8, minimumWidth = 0, matchAnchorWidth = false }) {
  const [position, setPosition] = useState({ ready: false, left: 0, top: 0, resolvedPlacement: placement });
  useLayoutEffect(() => {
    if (!open) return undefined;
    const anchor = anchorRef.current;
    const overlay = overlayRef.current;
    if (!anchor || !overlay) return undefined;
    function update() {
      const anchorRect = anchor.getBoundingClientRect();
      const width = matchAnchorWidth ? anchorRect.width : Math.max(overlay.offsetWidth, minimumWidth, anchorRect.width);
      const height = overlay.offsetHeight;
      const [preferredSide, alignment = 'start'] = placement.split('-');
      const roomBelow = window.innerHeight - anchorRect.bottom - VIEWPORT_GUTTER;
      const roomAbove = anchorRect.top - VIEWPORT_GUTTER;
      const roomRight = window.innerWidth - anchorRect.right - VIEWPORT_GUTTER;
      const roomLeft = anchorRect.left - VIEWPORT_GUTTER;
      let side = preferredSide;
      if (side === 'bottom' && height > roomBelow && roomAbove > roomBelow) side = 'top';
      if (side === 'top' && height > roomAbove && roomBelow > roomAbove) side = 'bottom';
      if (side === 'right' && width > roomRight && roomLeft > roomRight) side = 'left';
      if (side === 'left' && width > roomLeft && roomRight > roomLeft) side = 'right';
      let left = side === 'right' ? anchorRect.right + gap : side === 'left' ? anchorRect.left - width - gap : alignment === 'end' ? anchorRect.right - width : alignment === 'center' ? anchorRect.left + (anchorRect.width - width) / 2 : anchorRect.left;
      left = Math.min(Math.max(VIEWPORT_GUTTER, left), Math.max(VIEWPORT_GUTTER, window.innerWidth - width - VIEWPORT_GUTTER));
      const desiredTop = side === 'top' ? anchorRect.top - height - gap : side === 'bottom' ? anchorRect.bottom + gap : alignment === 'end' ? anchorRect.bottom - height : alignment === 'center' ? anchorRect.top + (anchorRect.height - height) / 2 : anchorRect.top;
      const top = Math.min(Math.max(VIEWPORT_GUTTER, desiredTop), Math.max(VIEWPORT_GUTTER, window.innerHeight - height - VIEWPORT_GUTTER));
      setPosition({ ready: true, left, top, width, resolvedPlacement: `${side}-${alignment}` });
    }
    update();
    const observer = new ResizeObserver(update);
    observer.observe(anchor); observer.observe(overlay);
    window.addEventListener('resize', update); window.addEventListener('scroll', update, true);
    return () => { observer.disconnect(); window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true); };
  }, [open, placement, gap, minimumWidth, matchAnchorWidth, anchorRef, overlayRef]);
  return { resolvedPlacement: position.resolvedPlacement, style: { position: 'fixed', inset: 'auto', insetInline: 'auto', insetBlock: 'auto', right: 'auto', bottom: 'auto', left: position.left, top: position.top, minWidth: position.width, visibility: position.ready ? 'visible' : 'hidden' } };
}
