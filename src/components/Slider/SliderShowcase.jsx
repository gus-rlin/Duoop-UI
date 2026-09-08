import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { SliderDemo, sliderExamples } from './SliderDemos';
import component from './Slider.jsx?raw';
import css from './Slider.css?raw';
import demos from './SliderDemos.jsx?raw';

export function SliderShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-slider',
        name: 'Slider',
        category: 'Forms',
        notes:
          'One value or a considered range. Continuous control with tactile handles.',
      }}
      number="36"
      section="FORMS"
      examples={sliderExamples}
      Demo={SliderDemo}
      wide={[]}
      accessibility="Drag, tap or use the keyboard. Every adjustment stays precise."
      usage="Slider uses arrays for both single values and ranges. Radix supplies keyboard, touch, form submission and RTL support. Use Arrow keys, Home, End, Page Up/Down and Shift+Arrow. Keep min below max, step positive and values inside the bounds. Marks are visual references, not extra tab stops."
      api={[
        [
          'value / defaultValue',
          'An array: [50] for one thumb or [20, 80] for a range.',
        ],
        [
          'onValueChange / onValueCommit',
          'Live values and the committed interaction result.',
        ],
        [
          'min / max / step / minStepsBetweenThumbs',
          'Bounds, increment and minimum thumb separation in steps.',
        ],
        [
          'label / thumbLabels / formatValue',
          'Visible heading, individual accessible names and value text.',
        ],
        [
          'marks / disabled / dir / name',
          'Tick labels, disabled state, RTL direction and native form field name.',
        ],
        [
          'Open-source reference',
          <a
            href="https://www.radix-ui.com/primitives/docs/components/slider"
            target="_blank"
            rel="noreferrer"
          >
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['Slider.jsx', component],
        ['Slider.css', css],
        ['SliderDemos.jsx', demos],
      ]}
    />
  );
}
