import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { KineticPlayground, KineticTypeDemo, kineticExamples } from './KineticTypeDemos';
import component from './KineticType.jsx?raw';
import css from './KineticType.css?raw';
import demos from './KineticTypeDemos.jsx?raw';

export const kineticEntry = { id: 'builtin-kinetic-type', name: 'Kinetic Type', category: 'Animations', notes: 'Typography with presence. Scatter, wave and flip your words into place with three replayable, cinematic entrances.' };

export function KineticTypeShowcase() {
  return <CatalogShowcase entry={kineticEntry} number="23" section="ANIMATIONS" examples={kineticExamples} Demo={KineticTypeDemo} playground={<KineticPlayground />}
    accessibility="Three distinct choreographies, one readable result. Every entrance can be replayed; reduced motion shows the complete text immediately."
    usage="Use KineticType for short headlines, launches and section openings. The component inherits your typography and color. Newlines define intentional line breaks. Set container-type: inline-size on a parent and font-size: var(--kinetic-size) on the component for the demo’s fluid sizing, or use your own font size. Text is exposed once to assistive technology; decorative letters are hidden. GSAP is the only animation dependency, already included in this project."
    usageCode={'import { useState } from \'react\';\nimport { KineticType } from \'./components/KineticType/KineticType\';\n\nexport function Headline() {\n  const [replay, setReplay] = useState(0);\n  return (\n    <>\n      <KineticType as="h1" text={"Make some\\nnoise."}\n        effect="scatter" duration={1.8} replayKey={replay}\n        style={{ fontSize: "clamp(32px, 8vw, 120px)", fontWeight: 650 }} />\n      <button onClick={() => setReplay(value => value + 1)}>Replay</button>\n    </>\n  );\n}'}
    api={[
      ['text', 'Plain text. Newlines create lines; Unicode graphemes preserve accents and joined emoji. Best for short headlines.'],
      ['as / className / style', 'Semantic element (span by default), classes and inherited typography. Use a heading level appropriate to the page.'],
      ['effect', 'scatter (default): letters assemble from a dispersed field. wave: staggered rising letters. flip: a perspective entrance.'],
      ['duration', 'Total sequence duration in seconds, including stagger; default 1.4, bounded to 0.4–4.'],
      ['replayKey', 'Change this value to restart. Changing text, effect or duration also restarts the entrance.'],
      ['paused', 'Pause or resume the current sequence. Default false. No automatic looping.'],
      ['Visibility / cleanup', 'Starts on intersection, pauses off screen, resumes on return. Observers and animation are removed on unmount.'],
      ['Playground', 'Reuses the library Button, Textarea and Select controls and shared light/dark feedback palettes.'],
      ['Reduced motion', 'Live system preference: skip movement and show the final text. Content is visible before enhancement.'],
    ]} sources={[[ 'KineticType.jsx', component ], [ 'KineticType.css', css ], [ 'KineticTypeDemos.jsx', demos ]]} />;
}

