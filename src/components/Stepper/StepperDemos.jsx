import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { Stepper, stepStates } from './Stepper';
import { Button, ActionFeedback } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Switch } from '../Selection/Selection';
import { Select } from '../Select/Select';
import { ExperienceIcon } from '../Feedback/ExperienceIcon';
import { useDemoRequest } from '../Feedback/useDemoRequest';
import '../Feedback/Experience.css';

export const stepperExamples = [
  ['Numbered journey','Orientation'], ['With icons','Orientation'], ['Vertical details','Orientation'], ['Inline content','Orientation'],
  ['Compact dots','Presentation'], ['Labels beside','Presentation'], ['Segmented connectors','Presentation'], ['Without connectors','Presentation'], ['Partial progress','Presentation'],
  ['Free navigation','Behavior'], ['Restricted backtracking','Behavior'], ['Validation and error','Behavior'], ['Optional step','Behavior'], ['Conditional journey','Behavior'],
  ['Long condensed journey','Responsive'], ['Scrollable journey','Responsive'], ['Mobile summary','Responsive'], ['Long labels','Responsive'], ['Dark surface','Responsive'], ['Right to left','Responsive'],
  ['Every step state','States'], ['Initial loading','States'],
];
const base = [
  { id:'profile', title:'Profile', description:'Tell us who is joining.', icon:<ExperienceIcon name="person" /> },
  { id:'workspace', title:'Workspace', description:'Make room for your next idea.', icon:<ExperienceIcon name="file" /> },
  { id:'ready', title:'Ready', description:'Review your setup and start creating.', icon:<ExperienceIcon name="success" /> },
];

export function StepperFlow({ example = 'Numbered journey', config = {} }) {
  const { dark:configuredDark, rtl:configuredRtl, long:configuredLong, ...stepperConfig } = config;
  const [current, setCurrent] = useState('workspace');
  const [completed, setCompleted] = useState(['profile']);
  const [skipped, setSkipped] = useState([]);
  const [consent, setConsent] = useState(false);
  const [team, setTeam] = useState(false);
  const [finished, setFinished] = useState(false);
  const [fraction, setFraction] = useState(40);
  const request = useDemoRequest();
  const long = ['Long condensed journey', 'Scrollable journey'].includes(example);
  const rtl = example === 'Right to left' || configuredRtl;
  const detailed = ['Vertical details','Inline content'].includes(example);
  const validation = example === 'Validation and error';
  const optional = example === 'Optional step';
  let steps = long ? ['Profile','Workspace','People','Roles','Billing','Review','Ready'].map((title, index) => ({ id:index === 0 ? 'profile' : index === 1 ? 'workspace' : `step-${index}`, title })) : base;
  if (example === 'Conditional journey' && team) steps = [base[0], base[1], { id:'team', title:'Teammates', description:'Invite collaborators after creating the workspace.', icon:<ExperienceIcon name="team" /> }, base[2]];
  if (example === 'Long labels' || configuredLong) steps = steps.map((item, i) => ({ ...item, title:['Your personal profile and preferences','A shared workspace for research and field notes','Review the details before opening your workspace'][i] }));
  if (rtl) steps = steps.map((item, i) => ({ ...item, title:['الملف الشخصي','مساحة العمل','جاهز'][i] || item.title, description:undefined }));
  const index = Math.max(0, steps.findIndex(item => item.id === current));
  const busy = request.status === 'loading';
  const move = id => { if (busy) return; request.reset(); setCurrent(id); setFinished(false); };
  const items = steps.map(item => ({ ...item, optional:optional && item.id === 'workspace', state:item.id === current && busy ? 'loading' : item.id === current && request.status === 'error' ? 'error' : skipped.includes(item.id) ? 'skipped' : completed.includes(item.id) ? 'complete' : item.id === current ? 'current' : 'upcoming', content:<div className="experience-panel"><p className="experience-kicker">WORKSPACE / SETUP</p><h4>{item.title}</h4><p>{item.description || 'Review this stage of your workspace setup.'}</p>{item.id === 'workspace' && validation && <Checkbox label="I have reviewed the workspace settings" checked={consent} onChange={event => { setConsent(event.target.checked); request.reset(); }} error={request.status === 'error' ? 'Review the settings to continue.' : undefined} />}{item.id === 'workspace' && example === 'Conditional journey' && <Switch label="This is a team workspace" checked={team} onChange={event => setTeam(event.target.checked)} />}</div> }));
  if (rtl) items.forEach(item => { item.stateLabel = ({ complete:'مكتمل', current:'قيد التنفيذ', upcoming:'قادم', skipped:'تم التخطي', error:'يحتاج إلى مراجعة', loading:'جارٍ التحقق' })[item.state]; });
  async function next(skip = false) {
    if (busy || finished) return;
    if (validation && !skip) {
      if (!await request.run({ fail:current === 'workspace' && !consent })) return;
      request.reset();
    }
    if (skip) setSkipped(old => [...new Set([...old, current])]);
    else { setCompleted(old => [...new Set([...old, current])]); setSkipped(old => old.filter(id => id !== current)); }
    if (index < steps.length - 1) setCurrent(steps[index + 1].id);
    else setFinished(true);
  }
  function reset() { request.reset(); setCurrent('workspace'); setCompleted(['profile']); setSkipped([]); setFinished(false); setConsent(false); setTeam(false); }
  const hasPanel = ['Inline content','Validation and error','Conditional journey'].includes(example);
  const props = { orientation:detailed ? 'vertical' : 'horizontal', presentation:detailed ? 'detailed' : example === 'Compact dots' ? 'compact' : 'standard', indicator:example === 'With icons' ? 'icon' : example === 'Compact dots' ? 'dot' : 'number', labels:example === 'Labels beside' ? 'beside' : 'below', connector:example === 'Segmented connectors' ? 'segments' : example === 'Without connectors' ? 'none' : 'continuous', mobile:example === 'Mobile summary' ? 'summary' : long || ['Compact dots','Numbered journey','With icons','Segmented connectors','Without connectors','Partial progress','Labels beside'].includes(example) ? 'scroll' : 'vertical', overflow:example === 'Long condensed journey' ? 'condensed' : 'scroll', content:example === 'Inline content' ? 'inline' : hasPanel ? 'panel' : 'none', linear:example !== 'Free navigation', allowBack:example !== 'Restricted backtracking', ...stepperConfig };
  return <div className="experience-demo feedback-surface experience-surface" data-theme={example === 'Dark surface' || configuredDark ? 'dark' : 'light'} dir={rtl ? 'rtl' : 'ltr'}>
    <Stepper {...props} items={items} value={current} progress={example === 'Partial progress' ? fraction / 100 : 0} onValueChange={move} formatSummary={rtl ? (step, total) => `الخطوة ${step} من ${total}` : undefined} />
    {example === 'Partial progress' && <label className="experience-note stepper-progress-control"><span>Workspace preparation · {fraction}%</span><input aria-label="Step progress" type="range" min="0" max="100" value={fraction} onChange={event => setFraction(Number(event.target.value))} /></label>}
    <div className="experience-actions"><Button size="sm" variant="outline" disabled={busy || index === 0 || !props.allowBack} onClick={() => move(steps[index - 1].id)}>{rtl ? 'السابق' : 'Back'}</Button>{optional && current === 'workspace' && !finished && <Button size="sm" variant="outline" onClick={() => next(true)}>Skip for now</Button>}<Button size="sm" status={busy ? 'loading' : finished ? 'success' : 'idle'} successLabel={rtl ? 'تم الإعداد' : 'Setup complete'} onClick={() => next()}>{rtl ? 'متابعة' : index === steps.length - 1 ? 'Finish setup' : 'Continue'}</Button><Button size="sm" variant="outline" onClick={reset}>{rtl ? 'إعادة' : 'Reset'}</Button></div>
    {validation && <p className="experience-note">Simulated validation · review the settings, then continue. A failed check keeps your current step.</p>}
    {example === 'Free navigation' && <p className="experience-note">Choose any step. Arrow keys move focus; Enter or Space selects.</p>}
    {example === 'Restricted backtracking' && <p className="experience-note">Completed stages are read only in this journey.</p>}
    <ActionFeedback>{finished ? rtl ? 'مساحة العمل جاهزة.' : 'Your workspace is ready for its first idea.' : ''}</ActionFeedback>
  </div>;
}

export function StepperDemo({ example }) {
  const request = useDemoRequest();
  if (example === 'Every step state') return <div className="experience-demo feedback-surface stepper-state-reference"><Stepper orientation="vertical" presentation="detailed" value="current" items={Object.entries(stepStates).map(([state, title]) => ({ id:state, title, state, description:state === 'blocked' ? 'Complete identity verification first.' : state === 'skipped' ? 'An optional stage left for later.' : undefined }))} /><p className="experience-note">State reference · validation is shown as a static snapshot.</p></div>;
  if (example === 'Initial loading') return <div className="experience-demo feedback-surface"><div aria-busy={request.status === 'loading'}>{request.status === 'success' ? <Stepper value="workspace" items={base} /> : <div className="experience-panel"><ExperienceIcon name="file" /><p role="status">{request.status === 'loading' ? 'Loading your saved journey…' : 'Load your saved progress to resume setup.'}</p></div>}</div><div className="experience-actions"><Button variant="outline" size="sm" status={request.status === 'loading' ? 'loading' : 'idle'} onClick={() => request.run()}>Load saved journey</Button><Button size="sm" variant="outline" onClick={request.reset}>Reset</Button></div><p className="experience-note">Simulated request · no saved account is accessed.</p></div>;
  return <StepperFlow example={example} />;
}

export function StepperPlayground() {
  const [orientation, setOrientation] = useState('horizontal');
  const [presentation, setPresentation] = useState('standard');
  const [indicator, setIndicator] = useState('number');
  const [size, setSize] = useState('md');
  const [dark, setDark] = useState(false);
  const [rtl, setRtl] = useState(false);
  const [long, setLong] = useState(false);
  return <Card variant="elevated" interactive className="feedback-lab playground-card" aria-label="Stepper playground"><div className="feedback-lab-heading"><h3>One step closer.</h3><p>Complete a stage, feel it settle, and carry its progress into the next. Make the journey your own.</p></div><div className="feedback-lab-layout"><div className="feedback-lab-controls">{[['Orientation',orientation,setOrientation,['horizontal','vertical']],['Presentation',presentation,setPresentation,['standard','compact','detailed']],['Indicator',indicator,setIndicator,['number','icon','dot']],['Size',size,setSize,['sm','md','lg']]].map(([label,value,onValueChange,values]) => <Select key={label} label={label} width="full" value={value} onValueChange={onValueChange} options={values.map(value => ({ value,label:value }))} />)}<Switch label="Dark surface" checked={dark} onChange={e => setDark(e.target.checked)} /><Switch label="Right to left" checked={rtl} onChange={e => setRtl(e.target.checked)} /><Switch label="Long labels" checked={long} onChange={e => setLong(e.target.checked)} /></div><div className="feedback-lab-stage feedback-surface" data-theme={dark ? 'dark' : 'light'}><StepperFlow config={{ orientation,presentation,indicator,size,dark,rtl,long,mobile:'vertical' }} /></div></div></Card>;
}

