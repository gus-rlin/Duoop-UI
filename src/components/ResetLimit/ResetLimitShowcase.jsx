import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { ResetLimit } from './ResetLimit';
import { ResetLimitDemo } from './ResetLimitDemos';
import component from './ResetLimit.jsx?raw';
import css from './ResetLimit.css?raw';
import demos from './ResetLimitDemos.jsx?raw';

export const resetLimitEntry = { id: 'builtin-reset-limit', name: 'Reset Limit', category: 'Animations', notes: 'A sculpted push button with tactile motion and animated reset feedback.' };


export function ResetLimitShowcase() {
  return <CatalogShowcase entry={resetLimitEntry} number="25" section="ANIMATIONS"
    playground={<section className="reset-limit-hero" aria-label="Interactive reset demo"><div className="reset-limit-hero__caption"><span>INTERACTIVE PREVIEW</span><span>Simulated reset</span></div><ResetLimit /></section>}
    examples={[[ 'Dark surface', 'States' ], [ 'Disabled', 'States' ]]} Demo={ResetLimitDemo}
    accessibility="Light and dark surfaces, with keyboard support and reduced-motion behavior."
    usage="A playful nod to the Codex limit-reset button. This is a self-contained parody: the usage meter is fictional and no account is connected. Each press replays the sequence, including during an animation. Reduced motion goes straight to the result."
    usageCode={'import { ResetLimit } from \'./components/ResetLimit/ResetLimit\';\n\n<ResetLimit />\n<ResetLimit theme="dark" />\n<ResetLimit disabled />'}
    api={[[ 'theme', 'light (default) or dark. Adapts face, border, depth and text together.' ], [ 'disabled', 'Disables the native button. Default false.' ], [ 'Motion', '1.25-second local sequence. Repeated clicks restart it; the timer is cleared on unmount.' ], [ 'Accessibility', 'Native button, interior keyboard focus, polite result announcement and reduced-motion support.' ]]}
    sources={[[ 'ResetLimit.jsx', component ], [ 'ResetLimit.css', css ], [ 'ResetLimitDemos.jsx', demos ]]} />;
}
