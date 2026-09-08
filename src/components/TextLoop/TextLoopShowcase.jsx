import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { TextLoopDemo, TextLoopPlayground, textLoopExamples } from './TextLoopDemos';
import component from './TextLoop.jsx?raw';
import css from './TextLoop.css?raw';
import demos from './TextLoopDemos.jsx?raw';

export const textLoopEntry = { id: 'builtin-text-loop', name: 'Text Loop', category: 'Animations', notes: 'Words with a rhythm. Continuous SVG typography on sculpted, tactile ribbons, from a gentle wave to an endless loop.' };

export function TextLoopShowcase() {
  return <CatalogShowcase entry={textLoopEntry} number="26" section="ANIMATIONS" examples={textLoopExamples} Demo={TextLoopDemo} playground={<TextLoopPlayground />}
    accessibility="Four paths, two surfaces. Each example has a pause control. Repeated text is announced once; reduced motion keeps it still."
    usage="Use TextLoop for short editorial phrases and illustrated banners. Text follows the track at a steady speed without individual letter motion. Circles rotate as a single group with a continuous seam. Stitched edges and drawn accents give the ribbon its character. Supply an adjacent pause control for continuous motion. Keep essential instructions in ordinary text as well. Use short Latin-script phrases; separating glyphs does not preserve connected-script shaping."
    usageCode={'import { useState } from \'react\';\nimport { TextLoop } from \'./components/TextLoop/TextLoop\';\nimport { Button } from \'./components/Button/Button\';\n\nexport function Banner() {\n  const [paused, setPaused] = useState(false);\n  return <>\n    <TextLoop text="Made to move" shape="wave" paused={paused} />\n    <Button onClick={() => setPaused(value => !value)}>\n      {paused ? "Resume" : "Pause"}\n    </Button>\n  </>;\n}'}
    api={[
      ['text / separator', 'Short phrase and repeating separator (default ✦). Text is exposed once through the SVG accessible name.'],
      ['shape / path', 'wave, circle, arch or line. Optional custom SVG path in the 1200 × 520 viewBox.'],
      ['speed / direction', 'SVG units per second, default 90. Zero stops motion. direction: forward or reverse.'],
      ['paused / pauseOnHover', 'Controlled pause, default false; hover pause defaults to true. Resuming preserves the current position.'],
      ['curviness', 'Curve amplitude; default 90. Playground range 0–100. Has no effect on a straight line.'],
      ['expression', '0–1, default 0.65. Controls the illustrated accents only. Letters always stay aligned to the track.'],
      ['ribbon / ribbonWidth / ribbonColor', 'Show the stitched ribbon (default true), preferred width in SVG units (86), and face color. Width expands to fit large letters.'],
      ['fontSize / fontWeight / letterSpacing', 'Glyph size, weight and spacing: 46, 800 and 2 by default. Font loading triggers remeasurement.'],
      ['uppercase / color', 'Uppercase by default. Text color inherits the neutral feedback ink token.'],
      ['className / style', 'Root styling. Place in feedback-surface with data-theme="dark" for the shared dark palette.'],
      ['Motion lifecycle', 'Pauses off screen, in hidden tabs and on live reduced-motion preference changes. Cleans up tween, listeners and observer.'],
    ]} sources={[[ 'TextLoop.jsx', component ], [ 'TextLoop.css', css ], [ 'TextLoopDemos.jsx', demos ]]} />;
}

