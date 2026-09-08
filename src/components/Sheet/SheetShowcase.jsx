import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { SheetDemo, sheetExamples } from './SheetDemos';
import component from './Sheet.jsx?raw';
import css from './Sheet.css?raw';
import demos from './SheetDemos.jsx?raw';

export function SheetShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-sheet',
        name: 'Sheet',
        category: 'Feedback',
        notes: 'Bring the details in. A focused panel from any side of the screen.',
      }}
      number="41"
      section="FEEDBACK"
      examples={sheetExamples}
      Demo={SheetDemo}
      wide={[]}
      accessibility="Four edges, one primitive. Focus stays with the task."
      usage="Sheet composes Radix Dialog primitives into four edge panels. It is modal, locks background scroll, contains focus and restores it to the trigger. Always supply SheetTitle and SheetDescription, and include SheetClose for your primary closing action. Escape and backdrop dismiss. Content scrolls independently."
      api={[
        ['Sheet', 'open, defaultOpen, onOpenChange. Modal root.'],
        ['SheetTrigger / SheetClose', 'Compose one ref-forwarding Button.'],
        [
          'SheetContent side',
          'top, right (default), bottom or left. Radix content props pass through.',
        ],
        [
          'SheetTitle / SheetDescription',
          'Required accessible heading and supporting description.',
        ],
        [
          'Open-source reference',
          <a
            href="https://www.radix-ui.com/primitives/docs/components/dialog"
            target="_blank"
            rel="noreferrer"
          >
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['Sheet.jsx', component],
        ['Sheet.css', css],
        ['SheetDemos.jsx', demos],
      ]}
    />
  );
}
