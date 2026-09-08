import React, { useState } from 'react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './Sheet';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { RangeSlider } from '../Slider/Slider';
import '../Essentials/EssentialsDemos.css';

export const sheetExamples = [
  ['Right panel', 'Placement'],
  ['Bottom sheet', 'Placement'],
  ['Left panel', 'Placement'],
  ['Top sheet', 'Placement'],
];
export function SheetDemo({ example = 'Right panel' }) {
  const side = example.toLowerCase().split(' ')[0];
  const [available, setAvailable] = useState(true);
  const [price, setPrice] = useState([60, 240]);
  const [applied, setApplied] = useState('');
  return (
    <div className="essential-demo essential-demo--center">
      <div>
        <span className="essential-demo__eyebrow">A LITTLE MORE SPACE</span>
        <h3>Find your kind of place.</h3>
        <p>Bring the details in from the {side}.</p>
      </div>
      <Sheet>
        <SheetTrigger>
          <Button variant="outline">Open {side} sheet</Button>
        </SheetTrigger>
        <SheetContent side={side}>
          <SheetTitle>Refine your stay</SheetTitle>
          <SheetDescription>
            A few preferences for a place that feels like you.
          </SheetDescription>
          <div className="essential-demo__sheet-body">
            <RangeSlider
              label="Price per night"
              min={0}
              max={400}
              step={10}
              value={price}
              onValueChange={setPrice}
              formatValue={(n) => `€${n}`}
            />
            <Checkbox
              label="Available this weekend"
              description="Only show places ready for your next escape."
              checked={available}
              onChange={(e) => setAvailable(e.target.checked)}
            />
            <SheetClose>
              <Button
                onClick={() =>
                  setApplied(
                    `€${price[0]}–€${price[1]}${available ? ' · Available this weekend' : ' · All dates'}`,
                  )
                }
              >
                Apply filters
              </Button>
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
      <span className="essential-demo__result" role="status">
        {applied || 'Your page stays right where you left it.'}
      </span>
    </div>
  );
}
