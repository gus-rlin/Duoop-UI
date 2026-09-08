import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { CalendarDemo, calendarExamples } from './CalendarDemos';
import component from './Calendar.jsx?raw';
import css from './Calendar.css?raw';
import demos from './CalendarDemos.jsx?raw';

export function CalendarShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-calendar',
        name: 'Calendar',
        category: 'Forms',
        notes: 'A day to remember. Standalone single-date and range selection.',
      }}
      number="37"
      section="FORMS"
      examples={calendarExamples}
      Demo={CalendarDemo}
      wide={[]}
      accessibility="Choose a day, move through months, or plan a longer stay."
      usage="Calendar wraps React DayPicker v9 with Duoop CSS. The caller owns selected and onSelect. Arrow keys navigate days; Page Up/Down navigate months, and dropdowns select month/year. Supply disabled matchers or a predicate; use excludeDisabled with ranges. The default dropdown spans 100 years back and 20 ahead."
      api={[
        [
          'mode / selected / onSelect',
          'single uses Date; range uses {from, to}. Selection is controlled.',
        ],
        [
          'disabled / excludeDisabled',
          'Disable dates, date ranges, weekdays, or a predicate; reject ranges crossing disabled days.',
        ],
        [
          'defaultMonth / month / onMonthChange',
          'Initial or controlled visible month.',
        ],
        [
          'captionLayout / startMonth / endMonth',
          'Month and year dropdowns with bounded navigation.',
        ],
        [
          'Other DayPicker props',
          'Locale, week start, min/max nights and accessible labels pass through.',
        ],
        [
          'Open-source reference',
          <a href="https://daypicker.dev/v9" target="_blank" rel="noreferrer">
            Official documentation and source (MIT)
          </a>,
        ],
      ]}
      sources={[
        ['Calendar.jsx', component],
        ['Calendar.css', css],
        ['CalendarDemos.jsx', demos],
      ]}
    />
  );
}
