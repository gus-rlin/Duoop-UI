import React from 'react';
import { DayPicker } from 'react-day-picker';
import './Calendar.css';

/** React DayPicker v9 (MIT), with Duoop surfaces. Selection is owned by the caller. */
export function Calendar({
  mode = 'single',
  captionLayout = 'dropdown',
  startMonth,
  endMonth,
  className = '',
  ...props
}) {
  const year = new Date().getFullYear();
  return (
    <DayPicker
      mode={mode}
      resetOnSelect={mode === 'range'}
      captionLayout={captionLayout}
      navLayout="after"
      showOutsideDays
      fixedWeeks
      weekStartsOn={1}
      startMonth={startMonth ?? new Date(year - 100, 0)}
      endMonth={endMonth ?? new Date(year + 20, 11)}
      {...props}
      className={`duoop-calendar ${className}`}
    />
  );
}

export function formatDate(date, locale = 'en-GB') {
  return date
    ? new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(date)
    : '';
}

// Local calendar dates must not shift across time zones when submitted.
export function dateValue(date) {
  return date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    : '';
}
