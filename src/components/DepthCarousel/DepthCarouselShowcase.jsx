import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { DepthPlayground, DepthCarouselDemo, depthExamples } from './DepthCarouselDemos';
import component from './DepthCarousel.jsx?raw';
import css from './DepthCarousel.css?raw';
import demos from './DepthCarouselDemos.jsx?raw';

export const depthEntry = { id:'builtin-depth-carousel', name:'Depth Carousel', category:'Animations', notes:'An image carousel with depth and tactile controls.' };
export function DepthCarouselShowcase() {
  return <CatalogShowcase entry={depthEntry} number="27" section="ANIMATIONS" examples={depthExamples} Demo={DepthCarouselDemo} playground={<DepthPlayground />}
    accessibility="Drag, click or use the arrow keys."
    usage="Use a short collection with stable, unique IDs and non-interactive content. Inactive cards are hidden from assistive technology. Vertical touch scrolling is preserved; cancelled and short drags settle back into place. Navigation can interrupt an animation. There is no autoplay. Reduced motion updates the selected card immediately. Cards have a fixed presentation height: keep content concise or customize the card styles."
    usageCode={'import { DepthCarousel } from \'./components/DepthCarousel/DepthCarousel\';\n\nconst items = [\n  { id: "first", image: "/images/study-01.webp", alt: "An architectural study in paper" },\n  { id: "second", image: "/images/study-02.webp", alt: "Layered paper forms" },\n];\n\n<DepthCarousel items={items} label="Studio studies" depth={180} />'}
    api={[
      ['items', 'Array of objects with stable unique id. Default rendering supports image, alt and title. Empty and single-item collections are supported.'],
      ['renderItem(item, index)', 'Optional renderer for non-interactive card content. Omit to render images directly.'],
      ['depth / spread / tilt', 'Distance in Z (180 px), horizontal offset (78 px) and angle (16 degrees).'],
      ['direction', 'right (default) or left. Changes the direction of the receding cards.'],
      ['loop', 'true by default. Set false to disable wraparound and disable the controls at either end.'],
      ['label / className', 'Accessible carousel name and optional local styling. Theme inherits shared feedback variables.'],
      ['onIndexChange(index, item)', 'Called when navigation changes the selected zero-based index.'],
      ['Motion', '560 ms interruptible GSAP easing. Live reduced-motion support and cleanup on unmount. No autoplay or wheel capture.'],
      ['Dependencies', 'Existing GSAP, IconButton and Button. Demos use the shared Feedback palette.'],
    ]} sources={[[ 'DepthCarousel.jsx',component ],[ 'DepthCarousel.css',css ],[ 'DepthCarouselDemos.jsx',demos ]]} />;
}

