import React, { useId, useState } from 'react';
import * as Primitive from '@radix-ui/react-slider';
import './Slider.css';

// Radix Slider (MIT) owns pointer capture, touch, keyboard, RTL and form inputs.
export function Slider({
  label = 'Value',
  value,
  defaultValue = [50],
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  minStepsBetweenThumbs = 0,
  marks = [],
  formatValue = String,
  thumbLabels,
  disabled = false,
  name,
  dir = 'ltr',
  className = '',
  ...props
}) {
  const [internal, setInternal] = useState(defaultValue);
  const values = value ?? internal;
  const id = useId();
  return (
    <div
      className={`duoop-slider ${className}`}
      data-disabled={disabled || undefined}
      dir={dir}
    >
      <div className="duoop-slider__heading">
        <span id={id}>{label}</span>
        <output>{values.map(formatValue).join(' – ')}</output>
      </div>
      <Primitive.Root
        {...props}
        className="duoop-slider__control"
        value={values}
        onValueChange={(next) => {
          if (value === undefined) setInternal(next);
          onValueChange?.(next);
        }}
        onValueCommit={onValueCommit}
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={minStepsBetweenThumbs}
        disabled={disabled}
        name={name}
        dir={dir}
      >
        <Primitive.Track className="duoop-slider__track">
          <Primitive.Range className="duoop-slider__range" />
        </Primitive.Track>
        {values.map((amount, index) => (
          <Primitive.Thumb
            key={index}
            className="duoop-slider__thumb"
            aria-label={
              thumbLabels?.[index] ||
              (values.length > 1
                ? `${label} ${index === 0 ? 'minimum' : 'maximum'}`
                : label)
            }
            aria-valuetext={formatValue(amount)}
          />
        ))}
      </Primitive.Root>
      {marks.length > 0 && (
        <div className="duoop-slider__marks" aria-hidden="true">
          {marks
            .filter((mark) => mark >= min && mark <= max)
            .map((mark) => (
              <span
                key={mark}
                style={{
                  insetInlineStart: `${((mark - min) / (max - min)) * 100}%`,
                }}
              >
                {formatValue(mark)}
              </span>
            ))}
        </div>
      )}
    </div>
  );
}
export function RangeSlider({ defaultValue = [25, 75], ...props }) {
  return <Slider defaultValue={defaultValue} {...props} />;
}
