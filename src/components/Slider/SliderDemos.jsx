import React, { useState } from 'react';
import { Slider, RangeSlider } from './Slider';
import '../Essentials/EssentialsDemos.css';

export const sliderExamples = [
  ['Volume', 'Single value'],
  ['Price range', 'Range'],
  ['Zoom with marks', 'Single value'],
  ['Disabled', 'States'],
  ['Right to left', 'Direction'],
];
export function SliderDemo({ example = 'Volume' }) {
  const [volume, setVolume] = useState([64]);
  const [zoom, setZoom] = useState([100]);
  return (
    <div className="essential-demo">
      {example === 'Price range' ? (
        <>
          <div>
            <span className="essential-demo__eyebrow">FIND YOUR RANGE</span>
            <h3>Room in the budget.</h3>
            <p>Move either handle to narrow the price.</p>
          </div>
          <RangeSlider
            label="Price per night"
            min={0}
            max={500}
            step={10}
            defaultValue={[80, 280]}
            minStepsBetweenThumbs={1}
            formatValue={(n) => `€${n}`}
            marks={[0, 250, 500]}
          />
        </>
      ) : example === 'Zoom with marks' ? (
        <>
          <div className="essential-demo__swatch">
            <span style={{ transform: `scale(${zoom[0] / 100})` }}>Aa</span>
          </div>
          <Slider
            label="Canvas zoom"
            min={50}
            max={150}
            step={25}
            value={zoom}
            onValueChange={setZoom}
            formatValue={(n) => `${n}%`}
            marks={[50, 100, 150]}
          />
        </>
      ) : (
        <>
          <div>
            <span className="essential-demo__eyebrow">MAKE IT YOURS</span>
            <h3>
              {example === 'Disabled' ? 'A quiet moment.' : 'Just the right level.'}
            </h3>
            <p>Arrow keys adjust. Home and End reach the limits.</p>
          </div>
          <Slider
            label="Volume"
            value={volume}
            onValueChange={setVolume}
            disabled={example === 'Disabled'}
            dir={example === 'Right to left' ? 'rtl' : 'ltr'}
            formatValue={(n) => `${n}%`}
            marks={[0, 50, 100]}
          />
        </>
      )}
    </div>
  );
}
