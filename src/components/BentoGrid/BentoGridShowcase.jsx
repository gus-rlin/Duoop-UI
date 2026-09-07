import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { BentoGridDemo, BentoPlayground, bentoExamples } from './BentoGridDemos';
import component from './BentoGrid.jsx?raw';
import css from './BentoGrid.css?raw';
import demos from './BentoGridDemos.jsx?raw';

export const bentoEntry = { id:'builtin-bento-grid', name:'Bento Grid', category:'Cards', notes:'A little structure for your next big idea. Uneven proportions, warm surfaces and a reassuring sense of depth.' };
export function BentoGridShowcase() {
  return <CatalogShowcase entry={bentoEntry} number="31" section="CARDS" examples={bentoExamples} Demo={BentoGridDemo} wide={bentoExamples.map(([name]) => name)} playground={<BentoPlayground />}
    accessibility="A responsive composition with natural reading order. Try changing the illustration layout or adding an item to the demo collection."
    usage="Compose content with BentoGrid and BentoItem. Feature cards occupy two columns and two rows; wide cards span two columns. Container queries adapt to the space available, including inside dialogs. Keep headings appropriate to your page and use real buttons or links inside cards. The grid itself has no artificial click target."
    usageCode={'import { BentoGrid, BentoItem } from \'./components/BentoGrid/BentoGrid\';\n\n<BentoGrid label="Project overview">\n  <BentoItem span="feature" tone="soft"><h3>Your next idea</h3></BentoItem>\n  <BentoItem><h3>Resources</h3></BentoItem>\n  <BentoItem><h3>Activity</h3></BentoItem>\n</BentoGrid>'}
    api={[
      ['BentoGrid: children / label', 'Composable content and accessible section name. Other native section attributes are forwarded.'],
      ['BentoItem: span', 'single (default), wide or feature. Three columns above 700px, two above 440px, one below. DOM order is preserved.'],
      ['BentoItem: tone', 'default or soft. Colors inherit feedback surface variables, with neutral standalone fallbacks.'],
      ['className / native attributes', 'Local styling and native section/article attributes. Card height grows with content.'],
      ['Motion & keyboard', 'Short hover lift; solid border when a child receives focus. Reduced motion removes travel. Actions reuse Button.'],
      ['Demo state', 'Layout changes affect the SVG preview. Add and Undo update only this mounted demo, with no network request or persistence.'],
      ['Reference', <a href="https://ui.aceternity.com/components/bento-grid" target="_blank" rel="noreferrer">Aceternity Bento Grid — composition reference. Original local implementation, no copied dependency.</a>],
    ]} sources={[[ 'BentoGrid.jsx',component ],[ 'BentoGrid.css',css ],[ 'BentoGridDemos.jsx',demos ]]} />;
}
