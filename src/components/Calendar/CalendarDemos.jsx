import React, { useState } from 'react';
import { Calendar, formatDate } from './Calendar';
import '../Essentials/EssentialsDemos.css';

export const calendarExamples = [
  ['Pick a day', 'Selection'],
  ['Date range', 'Selection'],
  ['Weekdays only', 'Availability'],
];
export function CalendarDemo({ example = 'Pick a day' }) {
  const [day, setDay] = useState(new Date(2026, 8, 16));
  const [range, setRange] = useState({
    from: new Date(2026, 8, 14),
    to: new Date(2026, 8, 18),
  });
  const isRange = example === 'Date range';
  return (
    <div className="essential-demo essential-demo--center">
      <Calendar
        aria-label={isRange ? 'Choose a date range' : 'Choose a day'}
        mode={isRange ? 'range' : 'single'}
        selected={isRange ? range : day}
        onSelect={isRange ? setRange : setDay}
        defaultMonth={new Date(2026, 8)}
        disabled={example === 'Weekdays only' ? { dayOfWeek: [0, 6] } : undefined}
        excludeDisabled
        min={isRange ? 1 : undefined}
      />
      <span className="essential-demo__result" role="status">
        {isRange
          ? range?.to
            ? `${formatDate(range.from)} – ${formatDate(range.to)}`
            : 'Choose an end date.'
          : day
            ? formatDate(day)
            : 'Choose a day.'}
      </span>
    </div>
  );
}
