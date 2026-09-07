import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { CardsCarouselDemo, CardsCarouselPlayground, cardsExamples } from './CardsCarouselDemos';
import component from './CardsCarousel.jsx?raw';
import css from './CardsCarousel.css?raw';
import demos from './CardsCarouselDemos.jsx?raw';

export const cardsCarouselEntry = { id:'builtin-cards-carousel', name:'Cards Carousel', category:'Cards', notes:'An invitation to explore. Tactile photo cards, a smooth horizontal scroll and a story behind every card.' };
export function CardsCarouselShowcase() {
  return <CatalogShowcase entry={cardsCarouselEntry} number="30" section="CARDS" examples={cardsExamples} Demo={CardsCarouselDemo} playground={<CardsCarouselPlayground />}
    accessibility="Swipe or scroll through the collection. Use the arrows to browse, then open any card to read its story."
    usage="Inspired by the Apple-style expanding cards carousel, with Duoop’s warm surfaces, dark contours and short tactile shadows. Supply unique stable IDs, image URLs, descriptive image alt text and React content. Touch scrolling and trackpads use native scroll snapping. On a focused card, arrow keys, Home and End move through the collection; Enter opens its details. The native modal contains focus, Escape closes it and focus returns to the trigger. Reduced motion removes spatial animation. Images have a readable fallback; empty and single-item collections are supported."
    usageCode={'import { CardsCarousel } from "./components/CardsCarousel/CardsCarousel";\n\nconst stories = [{\n  id: "perspective",\n  category: "Perspective",\n  title: "Find a different point of view.",\n  src: "/images/mountains.jpg",\n  alt: "A mountain ridge beneath a cloudy sky",\n  content: <p>Step back and explore a new approach.</p>,\n}];\n\n<CardsCarousel items={stories} title="A little more to discover." />'}
    api={[
      ['items', 'Array of { id, category, title, src, alt, content, takeaway? }. Optional takeaway adds a short practice note beside the story. IDs must be unique and stable. content accepts React nodes, including links and actions.'],
      ['title / label', 'Visible collection heading and accessible carousel name. Give each collection a distinct label.'],
      ['size', 'large (default) or compact. Both adapt to the available width on mobile.'],
      ['theme', 'light (default) or dark. Applies to the cards, navigation and detail modal.'],
      ['className', 'Additional class for local layout adjustments.'],
      ['Navigation', 'Native horizontal scrolling, bounded previous/next controls, arrow keys, Home and End. No autoplay.'],
      ['Details', 'Native dialog with previous/next story navigation, position counter and background scroll lock. Changing stories resets scroll and focuses the heading. Escape, backdrop or Back to collection closes the dialog.'],
      ['Dependencies', 'Existing Button and Feedback palette; no additional package.'],
    ]} sources={[[ 'CardsCarousel.jsx', component ],[ 'CardsCarousel.css', css ],[ 'CardsCarouselDemos.jsx', demos ]]} />;
}
