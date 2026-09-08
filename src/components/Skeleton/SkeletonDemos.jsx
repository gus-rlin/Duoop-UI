import React, { useState } from 'react';
import { Skeleton, SkeletonText, SkeletonCard, SkeletonTable } from './Skeleton';
import { Button } from '../Button/Button';
import '../Essentials/EssentialsDemos.css';

export const skeletonExamples = [
  ['Text and avatar', 'Shapes'],
  ['Card', 'Composition'],
  ['Table', 'Composition'],
  ['Loading to content', 'Transition'],
];
export function SkeletonDemo({ example = 'Text and avatar' }) {
  const [loaded, setLoaded] = useState(false);
  return (
    <div className="essential-demo essential-demo--wide">
      {example === 'Loading to content' ? (
        <>
          <div
            aria-busy={!loaded}
            role="region"
            aria-label="Article preview"
            className="essential-demo__stack"
            style={{ minHeight: 110 }}
          >
            {loaded ? (
              <>
                <h3>A quieter workspace.</h3>
                <p>
                  A few considered details can make room for better work. Start with
                  what you use every day.
                </p>
              </>
            ) : (
              <SkeletonText lines={4} />
            )}
          </div>
          <Button variant="outline" onClick={() => setLoaded(!loaded)}>
            {loaded ? 'Show loading state' : 'Show loaded content'}
          </Button>
          <p>Manually switch between sample states.</p>
        </>
      ) : (
        <div role="status" aria-label="Loading preview" aria-busy="true">
          {example === 'Card' ? (
            <SkeletonCard />
          ) : example === 'Table' ? (
            <SkeletonTable />
          ) : (
            <div className="essential-demo__stack">
              <div className="duoop-skeleton-person">
                <Skeleton shape="avatar" />
                <SkeletonText lines={2} />
              </div>
              <SkeletonText />
            </div>
          )}
          <span className="duoop-sr-only">Loading preview…</span>
        </div>
      )}
    </div>
  );
}
