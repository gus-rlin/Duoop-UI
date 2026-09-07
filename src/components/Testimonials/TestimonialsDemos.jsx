import React from 'react';
import { Testimonials, QuoteMark } from './Testimonials';

export const testimonialItems = [
  { id:'maya', name:'Maya Chen', role:'Design lead', company:'Layers', quote:'The small details finally feel as considered as the big ideas. We spend less time rebuilding the basics and more time making the product our own.' },
  { id:'alex', name:'Alex Morgan', role:'Co-founder', company:'Goodside', quote:'It feels like someone already had all the conversations about spacing, states and motion. Everything belongs together.' },
  { id:'jules', name:'Jules Martin', role:'Frontend engineer', company:'Forma', quote:'From the first click to the last detail, there’s a clear point of view. Thoughtful components, without the extra complexity.' },
  { id:'nina', name:'Nina Park', role:'Product designer', company:'Outline', quote:'The interactions are what sold us. A little movement, a clear response, and suddenly the whole product feels more human.' },
  { id:'sam', name:'Sam Rivera', role:'Creative director', company:'Common', quote:'A foundation with personality. We could make it ours without starting from a blank canvas.' },
  { id:'lea', name:'Lea Dubois', role:'Product lead', company:'Offset', quote:'Design and engineering finally speak the same language. Even the quietest details get the attention they deserve.' },
];
const wallItems = [...testimonialItems,
  { id:'eli', name:'Eli Brooks', role:'Developer', company:'Fieldwork', quote:'The code is easy to follow. We can adjust a component and still understand it a month later.' },
  { id:'ada', name:'Ada Wells', role:'Design director', company:'Paper', quote:'We wanted something quiet, with character. The tactile details give our pages exactly that balance.' },
  { id:'noah', name:'Noah Kim', role:'Founder', company:'Margin', quote:'Our first prototype already felt like a product. That made the next conversation with our team much easier.' },
  { id:'iris', name:'Iris Laurent', role:'Engineer', company:'Studio North', quote:'Keyboard states, small screens, long labels. The things we usually leave until later were already considered.' },
  { id:'leo', name:'Leo Adams', role:'Product designer', company:'Atelier', quote:'A few thoughtful components, and the whole experience started to come together.' },
];
export const testimonialsExamples = [['Editorial spotlight', 'Sections'], ['Wall of words', 'Sections'], ['Team voices', 'Sections']];
export function TestimonialsDemo({ example }) {
  const wall = example === 'Wall of words';
  const voices = example === 'Team voices';
  return <Testimonials items={wall ? wallItems : testimonialItems.slice(0,3)} variant={wall ? 'wall' : voices ? 'voices' : 'spotlight'} eyebrow={wall ? 'A few kind words' : voices ? 'Different teams. Same attention to detail.' : 'Made for the way you work'} title={wall ? 'Little details. Lasting impressions.' : voices ? 'Their work. Their words.' : 'Good tools make room for good work.'} description={wall ? 'Perspectives from the people behind the products.' : voices ? 'Meet the people making something of their own.' : 'A shared foundation. A very personal way of building.'} label={example} />;
}
export function TestimonialsPreview() {
  return <span className="testimonials-mini"><QuoteMark /><strong>“Every detail feels right.”</strong><small>Maya Chen · Layers</small></span>;
}

