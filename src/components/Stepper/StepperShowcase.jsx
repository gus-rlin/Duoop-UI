import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { StepperDemo, StepperPlayground, stepperExamples } from './StepperDemos';
import component from './Stepper.jsx?raw';
import css from './Stepper.css?raw';
import demos from './StepperDemos.jsx?raw';
import icons from '../Feedback/ExperienceIcon.jsx?raw';
import simulation from '../Feedback/useDemoRequest.js?raw';
import shared from '../Feedback/Experience.css?raw';

export const stepperEntry = { id:'builtin-stepper', name:'Stepper', category:'Navigation', notes:'A considered path forward. Tactile steps, animated connections and twenty-two ways to guide a journey.' };
export function StepperShowcase() {
  return <CatalogShowcase entry={stepperEntry} number="18" section="NAVIGATION" examples={stepperExamples} Demo={StepperDemo} playground={<StepperPlayground />} wide={['Labels beside','Long condensed journey','Scrollable journey','Long labels','Every step state']}
    accessibility="Explore each journey with the controls below it. State names, checkmarks and prerequisite locks keep progress clear beyond color."
    usage="Supply stable item IDs and a controlled active value. Omit onValueChange for an informative list. Arrow keys, Home and End move focus among available steps; Enter and Space select. In a linear journey every preceding step must be complete or skipped before a new stage can be selected. Validation, optional skipping and conditional inclusion are owned by the caller. Inline content is designed for vertical journeys; panel content follows the entire list."
    usageCode={'import { useState } from \'react\';\nimport { Stepper } from \'./components/Stepper/Stepper\';\n\nexport function Example() {\n  const [step, setStep] = useState("workspace");\n  return <Stepper value={step} onValueChange={setStep} items={[\n    { id: "profile", title: "Profile", state: "complete" },\n    { id: "workspace", title: "Workspace" },\n    { id: "ready", title: "Ready" }\n  ]} />;\n}'}
    api={[
      ['items / value / onValueChange','Items: id, title, description, icon, state, optional, content. Explicit states survive backtracking; absent states derive from the active position.'],
      ['state / stateLabel','upcoming · current · complete · skipped · error · loading · blocked · disabled. An item stateLabel can translate the visible and announced state. Optional is a property.'],
      ['orientation / presentation','horizontal · vertical; standard · compact · detailed.'],
      ['indicator / labels / size','number · icon · dot; below · beside; sm · md · lg.'],
      ['connector / progress','continuous · segments · none. progress is the current connector fraction, clamped to 0…1.'],
      ['linear / allowBack','Both default true. Free navigation uses linear={false}; allowBack={false} restricts revisiting earlier steps.'],
      ['content / mobile / overflow','none · panel · inline; vertical · summary · scroll below 460px; scroll · condensed for long paths. Condensed gaps can expand.'],
      ['label / formatSummary / dir','Navigation name, translated (step, total) summary formatter and inherited ltr/rtl direction.'],
      ['Theme / motion','Inherit feedback-surface variables. prefers-reduced-motion preserves outcomes without spatial animation.'],
    ]} sources={[[ 'Stepper.jsx',component ],[ 'Stepper.css',css ],[ 'StepperDemos.jsx',demos ],[ 'ExperienceIcon.jsx',icons ],[ 'useDemoRequest.js',simulation ],[ 'Experience.css',shared ]]} />;
}
