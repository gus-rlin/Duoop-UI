import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { CardSpreadDemo, SpreadPlayground, spreadExamples } from './CardSpreadDemos';
import component from './CardSpread.jsx?raw';
import css from './CardSpread.css?raw';
import demos from './CardSpreadDemos.jsx?raw';

export const spreadEntry = { id:'builtin-card-spread', name:'Card Spread', category:'Animations', notes:'A collection of perspectives. An open fan of photographs, with a little room for the one that catches your eye.' };
export function CardSpreadShowcase() {
  return <CatalogShowcase entry={spreadEntry} number="34" section="ANIMATIONS" examples={spreadExamples} Demo={CardSpreadDemo} playground={<SpreadPlayground />}
    accessibility="Hover or focus a photograph to lift it above the fan. Click or tap to keep it open; press Escape to reset."
    usage="Use CardSpread for a short visual collection, ideally three to seven photographs. Supply stable unique IDs, meaningful titles and image URLs. Every card is a native button: Tab reaches each photograph, arrows move through the collection, Home and End jump to its edges. Clicking again clears the retained card. Reduced motion preserves every state without animated travel."
    usageCode={'import { CardSpread } from \'./components/CardSpread/CardSpread\';\n\nconst items = [\n  { id: "lake", title: "A new perspective", image: "/photos/lake.jpg" },\n  { id: "forest", title: "In good shape", image: "/photos/forest.jpg" },\n];\n\n<CardSpread items={items} label="Selected nature" />'}
    api={[[ 'items', 'Array of { id, title, image }. Stable unique IDs; an empty collection displays a message.' ],[ 'label', 'Accessible collection name.' ],[ 'className', 'Optional local styling. Colors inherit the shared feedback palette.' ],[ 'Interaction', 'Hover and keyboard focus temporarily reveal cards; click or tap toggles a retained card.' ],[ 'Motion', 'Interruptible 480 ms fan transition. Pointer movement controls hover; stacking changes immediately so the active card stays in front. No autoplay or animation dependency.' ]]}
    sources={[[ 'CardSpread.jsx', component ],[ 'CardSpread.css', css ],[ 'CardSpreadDemos.jsx', demos ]]} />;
}
