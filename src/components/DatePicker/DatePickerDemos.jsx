import React, { useState } from 'react';
import { DatePicker } from './DatePicker';
import { Button } from '../Button/Button';
import '../Essentials/EssentialsDemos.css';

export const datePickerExamples = [
  ['Schedule a visit', 'Single date'],
  ['Plan a stay', 'Range'],
  ['Unavailable dates', 'Availability'],
  ['Disabled', 'States'],
];
export function DatePickerDemo({ example = 'Schedule a visit' }) {
  const [value, setValue] = useState(null);
  const [result, setResult] = useState('');
  const range = example === 'Plan a stay';
  return (
    <form
      className="essential-demo"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult(
          [...data.values()].filter(Boolean).join(' → ') || 'Choose a date first.',
        );
      }}
    >
      <div>
        <span className="essential-demo__eyebrow">SOMETHING TO LOOK FORWARD TO</span>
        <h3>{range ? 'Make room for a getaway.' : 'Put it on the calendar.'}</h3>
        <p>
          {example === 'Unavailable dates'
            ? 'Visits are available Monday to Friday.'
            : 'Choose a date. Keep the rest of your page in view.'}
        </p>
      </div>
      <DatePicker
        label={range ? 'Your stay' : 'Visit date'}
        mode={range ? 'range' : 'single'}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          setResult('');
        }}
        name="visit"
        disabled={example === 'Disabled'}
        disabledDates={
          example === 'Unavailable dates' ? { dayOfWeek: [0, 6] } : undefined
        }
        calendarProps={{
          defaultMonth: new Date(2026, 8),
          min: range ? 1 : undefined,
        }}
      />
      <Button type="submit" variant="outline" disabled={example === 'Disabled'}>
        Read form value
      </Button>
      <span role="status" className="essential-demo__result">
        {result || 'Dates are stored locally in this example.'}
      </span>
    </form>
  );
}
