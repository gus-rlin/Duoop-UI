import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { ProgressDemo, ProgressPlayground, progressExamples } from './ProgressDemos';
import componentSource from './Progress.jsx?raw';
import cssSource from './Progress.css?raw';
import demoSource from './ProgressDemos.jsx?raw';
import operationSource from './useDemoOperation.js?raw';
import iconSource from '../Feedback/FeedbackIcon.jsx?raw';
import sharedCss from '../Feedback/Feedback.css?raw';

export const progressEntry = { id:'builtin-progress', name:'Progress', category:'Animations', notes:'Measured motion, tactile tracks and rings. Eighteen examples from the first byte to a confirmed result.' };
export function ProgressShowcase() {
  return <CatalogShowcase entry={progressEntry} number="16" section="FEEDBACK" examples={progressExamples} Demo={ProgressDemo} playground={<ProgressPlayground />} wide={['Multiple tasks']}
    accessibility="Run each simulation to see its motion. Pause, retry and cancel are real simulation controls; completion is announced only after verification."
    usage="Progress is controlled by its caller. Pass null when the amount is unknown, and set success only after the operation resolves. The progressbar exposes a name, range and current value; status changes use a polite live region. Reduced motion keeps values and outcomes visible. The page-edge example is contained in a miniature page; place that same track at your application's edge for global navigation."
    usageCode={'import { Progress } from \'./components/Progress/Progress\';\n\n<Progress label="Workspace export" value={64} state="running" />\n<Progress label="Verifying archive" value={100} state="finalizing" />\n<Progress label="Archive ready" value={100} state="success" shape="circular" />'}
    api={[
      ['value / max','Finite measured value, clamped to 0…max. null is indeterminate. Default max: 100.'],
      ['state','waiting · preparing · running · paused · finalizing · success · error · cancelled · partial'],
      ['shape / size','linear or circular; sm, md or lg.'],
      ['label / hideLabel / description','Accessible operation name, optional visible label and secondary context.'],
      ['display / children','none · percent · quantity. Circular children can supply an icon or a count.'],
      ['textPosition','above · beside · below for linear progress. Circular content stays centered.'],
      ['buffer / segments / rounded','Available amount behind measured progress; phase dividers; rounded or straight ends.'],
      ['Theme','Wrap in feedback-surface and set data-theme="dark" to inherit the full dark palette.'],
      ['Motion','GSAP synchronizes the visible percentage and measured fill. Updates interrupt smoothly; paused/error/cancelled states settle immediately. ARIA always reports the actual value.'],
      ['Confirmation','Success triggers a finite settling pulse and a drawn check for circular progress. Reduced motion removes travel, sweeps and pulses.'],
      ['Circular status','Indeterminate status text sits below the ring. The center is reserved for measured values, outcome icons or custom content.'],
    ]}
    sources={[[ 'Progress.jsx',componentSource ],[ 'Progress.css',cssSource ],[ 'ProgressDemos.jsx',demoSource ],[ 'useDemoOperation.js',operationSource ],[ 'FeedbackIcon.jsx',iconSource ],[ 'Feedback.css',sharedCss ]]} />;
}
