import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { PopoverDemo, popoverExamples } from './PopoverDemos';
import component from './Popover.jsx?raw';
import css from './Popover.css?raw';
import demos from './PopoverDemos.jsx?raw';

export function PopoverShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-popover',
        name: 'Popover',
        category: 'Feedback',
        notes: 'A little more room, right next to the action. Non-modal by design.',
      }}
      number="35"
      section="FEEDBACK"
      examples={popoverExamples}
      Demo={PopoverDemo}
      wide={[]}
      accessibility="Small forms and filters without leaving the page."
      usage="Compose Popover, PopoverTrigger and PopoverContent. Triggers must forward refs and DOM props. Content is portalled, collision-aware and non-modal; outside interaction and Escape dismiss it. Use container when hosting inside a native dialog. Provide label, and use PopoverClose for a closing action."
      api={[
        ['Popover', 'open, defaultOpen, onOpenChange. Always non-modal.'],
        [
          'PopoverTrigger / PopoverClose',
          'Compose one Button or another ref-forwarding element.',
        ],
        [
          'PopoverContent',
          'label, side, align, container and Radix content props, including focus callbacks.',
        ],
        [
          'Open-source reference',
          <a
            href="https://www.radix-ui.com/primitives/docs/components/popover"
            target="_blank"
            rel="noreferrer"
          >
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['Popover.jsx', component],
        ['Popover.css', css],
        ['PopoverDemos.jsx', demos],
      ]}
    />
  );
}
