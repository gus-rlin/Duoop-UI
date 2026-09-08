import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { SkeletonDemo, skeletonExamples } from './SkeletonDemos';
import component from './Skeleton.jsx?raw';
import css from './Skeleton.css?raw';
import demos from './SkeletonDemos.jsx?raw';

export function SkeletonShowcase() {
  return (
    <CatalogShowcase
      entry={{
        id: 'builtin-skeleton',
        name: 'Skeleton',
        category: 'Feedback',
        notes: 'Keep the shape of what comes next. Quiet structural loading states.',
      }}
      number="43"
      section="FEEDBACK"
      examples={skeletonExamples}
      Demo={SkeletonDemo}
      wide={skeletonExamples.map(([title]) => title)}
      accessibility="Text, avatars, cards and tables with a reduced-motion fallback."
      usage="Skeleton shapes are decorative and hidden from assistive technology. Put aria-busy on the containing content region and announce loading once with a status. Match the final layout to limit movement. The gallery toggle is a manual state demonstration. Reduced motion removes the shimmer."
      api={[
        [
          'Skeleton shape / width / height',
          'text (default), avatar or card. CSS lengths or numeric dimensions.',
        ],
        [
          'SkeletonText lines',
          'One to twenty text lines, with a shorter final line.',
        ],
        ['SkeletonCard', 'Image, avatar and text composition.'],
        [
          'SkeletonTable rows / columns',
          'Grid placeholder with bounded row/column counts.',
        ],
      ]}
      sources={[
        ['Skeleton.jsx', component],
        ['Skeleton.css', css],
        ['SkeletonDemos.jsx', demos],
      ]}
    />
  );
}
