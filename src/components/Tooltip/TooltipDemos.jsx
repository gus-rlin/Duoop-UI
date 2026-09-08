import React, { useState } from 'react';
import { Tooltip, TooltipProvider } from './Tooltip';
import { Button } from '../Button/Button';
import '../Essentials/EssentialsDemos.css';

export const tooltipExamples = [
  ['Icon toolbar', 'Everyday'],
  ['Four placements', 'Positioning'],
  ['Disabled action', 'Everyday'],
  ['Custom delay', 'Timing'],
];
export function TooltipDemo({ example = 'Icon toolbar' }) {
  const [count, setCount] = useState(0);
  if (example === 'Four placements')
    return (
      <div className="essential-demo essential-demo--center">
        <div className="essential-demo__row">
          {['top', 'right', 'bottom', 'left'].map((side) => (
            <Tooltip
              key={side}
              side={side}
              content={`Placed on the ${side}. Flips near an edge.`}
            >
              <Button variant="outline" size="sm">
                {side[0].toUpperCase() + side.slice(1)}
              </Button>
            </Tooltip>
          ))}
        </div>
        <p>Move close to an edge. The hint stays in view.</p>
      </div>
    );
  if (example === 'Disabled action')
    return (
      <div className="essential-demo essential-demo--center">
        <Tooltip content="Add at least one file before publishing.">
          <Button disabled>Publish collection</Button>
        </Tooltip>
        <p>Add a file to enable publishing.</p>
      </div>
    );
  if (example === 'Custom delay')
    return (
      <div className="essential-demo essential-demo--center">
        <Tooltip
          delay={1000}
          content="A little patience. This hint waits one second."
        >
          <Button variant="outline">Take your time</Button>
        </Tooltip>
        <p>A 1,000 ms delay keeps quieter actions quiet.</p>
      </div>
    );
  return (
    <div className="essential-demo essential-demo--center">
      <div>
        <span className="essential-demo__eyebrow">YOUR WORKSPACE</span>
        <h3>A little context.</h3>
        <p>Hover or focus an action to see its hint.</p>
      </div>
      <TooltipProvider>
        <div className="essential-demo__toolbar">
          {[
            ['Save to collection', 'M4 3h12v14H4zM7 3v5h6V3M7 17v-5h6v5'],
            ['Copy item', 'M7 7h10v10H7zM13 3H3v10'],
            ['Share item', 'M10 13V2m-4 4 4-4 4 4M4 10v7h12v-7'],
          ].map(([label, path]) => (
            <Tooltip content={label} key={label}>
              <Button
                variant="outline"
                aria-label={label}
                iconPosition="only"
                onClick={() => setCount((n) => n + 1)}
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
                    <path d={path} />
                  </svg>
                }
              />
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      <span className="essential-demo__result" role="status">
        {count
          ? `${count} demo actions activated`
          : 'Keyboard friendly. Touch actions stay immediate.'}
      </span>
    </div>
  );
}
