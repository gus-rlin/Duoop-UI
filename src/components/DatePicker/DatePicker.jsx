import React, { useId, useState } from 'react';
import { Calendar, dateValue, formatDate } from '../Calendar/Calendar';
import { Popover, PopoverTrigger, PopoverContent } from '../Popover/Popover';
import { Button } from '../Button/Button';
import './DatePicker.css';

export function DatePicker({
  label = 'Date',
  mode = 'single',
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  disabledDates,
  placeholder = 'Choose a date',
  name,
  locale = 'en-GB',
  calendarProps = {},
}) {
  const [internal, setInternal] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const selected = value === undefined ? internal : value;
  const id = useId();
  const display =
    mode === 'range'
      ? [formatDate(selected?.from, locale), formatDate(selected?.to, locale)]
          .filter(Boolean)
          .join(' – ')
      : formatDate(selected, locale);
  const change = (next) => {
    if (value === undefined) setInternal(next);
    onValueChange?.(next);
  };
  return (
    <div className="duoop-date-picker">
      <label htmlFor={id}>{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button
            id={id}
            variant="outline"
            disabled={disabled}
            className="duoop-date-picker__trigger"
            iconPosition="right"
            icon={
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 4h12v13H4zM7 2v4m6-4v4M4 8h12" />
              </svg>
            }
          >
            {display || placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          label={`Choose ${label.toLowerCase()}`}
          className="duoop-date-picker__popup"
        >
          <Calendar
            {...calendarProps}
            autoFocus
            mode={mode}
            selected={selected ?? undefined}
            defaultMonth={
              (mode === 'range' ? selected?.from : selected) ||
              calendarProps.defaultMonth
            }
            disabled={disabledDates}
            excludeDisabled
            onSelect={(next) => {
              change(next);
              if (mode === 'single' || next?.to) setOpen(false);
            }}
          />
          <div className="duoop-date-picker__footer">
            <span>
              {mode === 'range'
                ? 'Choose a start and end date.'
                : 'Choose a day to continue.'}
            </span>
            <Button
              size="sm"
              variant="ghost"
              disabled={!selected}
              onClick={() => {
                change(null);
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </div>
        </PopoverContent>
      </Popover>
      {name &&
        (mode === 'range' ? (
          <>
            <input
              type="hidden"
              name={`${name}.from`}
              value={dateValue(selected?.from)}
              disabled={disabled}
            />
            <input
              type="hidden"
              name={`${name}.to`}
              value={dateValue(selected?.to)}
              disabled={disabled}
            />
          </>
        ) : (
          <input
            type="hidden"
            name={name}
            value={dateValue(selected)}
            disabled={disabled}
          />
        ))}
    </div>
  );
}
