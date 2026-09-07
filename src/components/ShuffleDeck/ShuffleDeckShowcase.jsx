import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { ShufflePlayground, ShuffleDeckDemo, shuffleExamples } from './ShuffleDeckDemos';
import component from './ShuffleDeck.jsx?raw';
import css from './ShuffleDeck.css?raw';
import demos from './ShuffleDeckDemos.jsx?raw';

export const shuffleEntry = { id:'builtin-shuffle-deck', name:'Shuffle Deck', category:'Animations', notes:'A stack with a sense of motion. Drag, flick and cycle through cards as the next idea rises into place.' };
export function ShuffleDeckShowcase() {
  return <CatalogShowcase entry={shuffleEntry} number="24" section="ANIMATIONS" examples={shuffleExamples} Demo={ShuffleDeckDemo} playground={<ShufflePlayground />}
    accessibility="Drag left for the next card, right for the previous one. Buttons and arrow keys offer the same navigation. No autoplay; reduced motion changes cards immediately."
    usage="Use ShuffleDeck for short collections of ideas, portfolio summaries or onboarding cards. Supply stable unique IDs and non-interactive card content; inactive cards are hidden from assistive technology. The viewport supports horizontal dragging while preserving vertical touch scrolling. Short drags spring back, and completed gestures cycle through the collection. Keep each card concise enough to fit the fixed presentation, or override its height for your content."
    usageCode={'import { ShuffleDeck } from \'./components/ShuffleDeck/ShuffleDeck\';\n\nconst ideas = [\n  { id: "explore", eyebrow: "01 / Explore", title: "Start with curiosity.", description: "Ask a better question." },\n  { id: "create", eyebrow: "02 / Create", title: "Bring it to life.", description: "Try a small experiment." },\n];\n\n<ShuffleDeck items={ideas} layout="fan" label="Creative process" />'}
    api={[
      ['items', 'Array with unique stable id. Default content: eyebrow, title, description. Empty and single-card collections are supported.'],
      ['renderItem(item, index)', 'Optional custom non-interactive card content. Use headings appropriate to the surrounding document.'],
      ['layout', 'stack (default) or fan. Up to three cards are visible. Arrangement changes animate in place.'],
      ['label / className', 'Accessible carousel name and local styling. Palette inherits the shared feedback surface variables.'],
      ['onIndexChange(index)', 'Called after a completed navigation, with the next zero-based index.'],
      ['Input', 'Drag more than 60 px to navigate, or use arrows/buttons. New navigation is ignored during the 300 ms exit.'],
      ['Motion', 'Finite GSAP exit and spring-like settling. Live reduced-motion preference removes travel. Timelines are cleaned up on unmount.'],
      ['Dependencies', 'Existing GSAP and Button. Catalogue demos also reuse Select and shared Feedback/Experience palettes.'],
    ]} sources={[[ 'ShuffleDeck.jsx',component ],[ 'ShuffleDeck.css',css ],[ 'ShuffleDeckDemos.jsx',demos ]]} />;
}
