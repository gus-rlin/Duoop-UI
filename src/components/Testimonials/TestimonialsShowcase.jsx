import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { TestimonialsDemo, testimonialsExamples } from './TestimonialsDemos';
import component from './Testimonials.jsx?raw';
import css from './Testimonials.css?raw';
import demos from './TestimonialsDemos.jsx?raw';

export const testimonialsEntry = { id:'builtin-testimonials', name:'Testimonials', category:'Cards', notes:'Three ways to give good words a place. Editorial stories, a wall of quotes and a chorus of customer voices.' };
export function TestimonialsShowcase() {
  return <CatalogShowcase entry={testimonialsEntry} number="32" section="CARDS" examples={testimonialsExamples} Demo={TestimonialsDemo} wide={testimonialsExamples.map(([title]) => title)}
    playground={<p className="testimonials-reference">Fictional people and quotes for demonstration. Layout reference: <a href="https://gist.github.com/kyrylo/2cb9fca0ffd411869dc6a74407f2237a" target="_blank" rel="noreferrer">Kyrylo’s CSS column testimonials</a>. Original Duoop implementation using existing Button and Avatar primitives.</p>}
    accessibility="Explore three full-width sections. Change stories with tactile controls; every quote stays readable on smaller screens."
    usage="Use spotlight for a featured story, wall for a collection, or voices for a customer selector. Provide permissioned customer quotes and stable unique IDs. Names, roles and companies are visible text. Navigation is manual, keyboard accessible and announced through a concise live status. Reduced motion removes entrance movement. Empty collections show a message; single stories disable navigation."
    usageCode={'import { Testimonials } from \'./components/Testimonials/Testimonials\';\n\nconst items = [{ id: "maya", name: "Maya Chen", role: "Design lead",\n  company: "Layers", quote: "Every detail feels considered." }];\n\n<Testimonials items={items} variant="spotlight" title="In their words." />'}
    api={[
      ['items', 'Array of { id, name, role, company, quote, image? }. Images are optional; Avatar supplies a tactile initials fallback.'],
      ['variant', 'spotlight (default), wall, or voices. The wall features the first quote in a wide center card, with independent stacks around it. It collapses to one column on mobile.'],
      ['eyebrow / title / description', 'Section heading and optional introduction. Text wraps naturally.'],
      ['label', 'Accessible section name. Give each instance a distinct label.'],
      ['Motion', '320 ms incoming story reveal; immediate state changes support rapid clicks. No autoplay or timers.'],
      ['Dependencies', 'React, shared Button and Avatar components and their styles. No new package.'],
    ]} sources={[[ 'Testimonials.jsx',component ],[ 'Testimonials.css',css ],[ 'TestimonialsDemos.jsx',demos ]]} />;
}


