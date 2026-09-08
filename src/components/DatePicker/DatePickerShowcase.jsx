import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { DatePickerDemo, datePickerExamples } from './DatePickerDemos';
import component from './DatePicker.jsx?raw';
import css from './DatePicker.css?raw';
import demos from './DatePickerDemos.jsx?raw';

export function DatePickerShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-date-picker',
        name: 'Date Picker',
        category: 'Forms',
        notes: 'Make a date. A field, a popover and a calendar working together.',
      }}
      number="38"
      section="FORMS"
      examples={datePickerExamples}
      Demo={DatePickerDemo}
      wide={[]}
      accessibility="Single dates and stays, with keyboard access and local form values."
      usage="DatePicker composes Button, Popover and Calendar. Use value/onValueChange or defaultValue; null clears a controlled selection. Single selection closes immediately; range selection closes after the end date. Hidden named fields submit local YYYY-MM-DD dates without UTC shifts. The trigger is a button rather than a free-text date parser."
      api={[
        [
          'label / placeholder / disabled',
          'Visible label, empty value and disabled field.',
        ],
        [
          'mode / value / onValueChange',
          'single: Date or null; range: {from, to} or null.',
        ],
        [
          'disabledDates / calendarProps',
          'Disabled matchers plus month/year bounds, locale and other calendar options.',
        ],
        [
          'name / locale',
          'Form field name and display locale. Ranges submit name.from and name.to.',
        ],
        [
          'Open-source reference',
          <a
            href="https://daypicker.dev/v9/guides/input-fields"
            target="_blank"
            rel="noreferrer"
          >
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['DatePicker.jsx', component],
        ['DatePicker.css', css],
        ['DatePickerDemos.jsx', demos],
      ]}
    />
  );
}
