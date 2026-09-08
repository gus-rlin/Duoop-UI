import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { AlertDemo, alertExamples } from './AlertDemos';
import component from './Alert.jsx?raw';
import css from './Alert.css?raw';
import demos from './AlertDemos.jsx?raw';

export function AlertShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-alert',
        name: 'Alert',
        category: 'Feedback',
        notes:
          'A message that stays. Clear context, useful actions and considered tones.',
      }}
      number="44"
      section="FEEDBACK"
      examples={alertExamples}
      Demo={AlertDemo}
      wide={alertExamples.map(([title]) => title)}
      accessibility="Persistent information, success, warning and error states."
      usage="Alert is persistent page content, distinct from Toast. Supply a title and use children for supporting text. action accepts an existing Button; onDismiss renders a labeled close action. The default region role does not interrupt reading. Use the alert role only for a newly occurring urgent error; color is accompanied by an icon and explicit text."
      api={[
        [
          'title / children',
          'Accessible heading and persistent supporting content.',
        ],
        ['tone', 'info, success, warning or error. Full semantic palettes.'],
        [
          'action / onDismiss',
          'Optional action element and controlled dismissal callback.',
        ],
        ['role / Callout', 'region by default. Callout is an alias for Alert.'],
      ]}
      sources={[
        ['Alert.jsx', component],
        ['Alert.css', css],
        ['AlertDemos.jsx', demos],
      ]}
    />
  );
}
