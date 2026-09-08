import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { TooltipDemo, tooltipExamples } from './TooltipDemos';
import component from './Tooltip.jsx?raw';
import css from './Tooltip.css?raw';
import demos from './TooltipDemos.jsx?raw';

export function TooltipShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-tooltip',
        name: 'Tooltip',
        category: 'Feedback',
        notes:
          'Context at the right moment. Focus, hover, timing and collision-aware hints.',
      }}
      number="34"
      section="FEEDBACK"
      examples={tooltipExamples}
      Demo={TooltipDemo}
      wide={[]}
      accessibility="Hover or focus an action. Escape dismisses the hint."
      usage="Wrap toolbars in TooltipProvider for shared delay. Tooltip accepts one ref-forwarding child. Disabled buttons receive a focusable wrapper. Touch does not delay or consume the action; keep essential instructions visible. Use Popover for interactive content."
      api={[
        [
          'content / children',
          'Plain hint content and one trigger element. Give icon actions an accessible name.',
        ],
        [
          'side / align / collisionPadding',
          'Four sides, three alignments, automatic flipping and viewport constraints.',
        ],
        [
          'delay / TooltipProvider',
          'Per-trigger delay or shared delay (400 ms) and skipDelay (250 ms).',
        ],
        [
          'open / defaultOpen / onOpenChange',
          'Controlled or uncontrolled visibility. Escape and activation dismiss.',
        ],
        [
          'Open-source reference',
          <a
            href="https://www.radix-ui.com/primitives/docs/components/tooltip"
            target="_blank"
            rel="noreferrer"
          >
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['Tooltip.jsx', component],
        ['Tooltip.css', css],
        ['TooltipDemos.jsx', demos],
      ]}
    />
  );
}
