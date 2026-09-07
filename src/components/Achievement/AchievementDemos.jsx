import { Card } from '../Card/Card';
import React, { useRef, useState } from 'react';
import { Achievement, AchievementCollection, AchievementDetails, AchievementSummary, AchievementTiers, AchievementUnlock, achievementStates, isAchievementEarned } from './Achievement';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Switch } from '../Selection/Selection';
import { Select } from '../Select/Select';
import { useDemoRequest } from '../Feedback/useDemoRequest';
import '../Feedback/Experience.css';

export const achievementExamples = [
  ['Unlocked badge','Presentation'], ['Compact row','Presentation'], ['Detailed card','Presentation'], ['With illustration','Presentation'],
  ['Locked achievement','Discovery'], ['Secret achievement','Discovery'], ['Partially revealed','Discovery'], ['Ready to begin','Discovery'],
  ['Numeric progress','Progress'], ['Progress bar','Progress'], ['Progress ring','Progress'], ['Checklist','Progress'], ['Daily streak','Progress'], ['Achievement tiers','Progress'],
  ['Team achievement','Rewards'], ['Seasonal achievement','Rewards'], ['Claim a reward','Rewards'], ['Repeatable achievement','Rewards'], ['Collection and summary','Rewards'],
  ['Inline unlock','Celebration'], ['Unlock toast','Celebration'], ['Unlock banner','Celebration'], ['Celebration dialog','Celebration'],
  ['Every achievement state','System'], ['Initial loading','System'], ['Loading error','System'], ['Long content','System'], ['Sizes','System'], ['Dark surface','System'], ['Right to left','System'],
];
export const firstSteps = { id:'first-steps', title:'First steps', description:'Turn your first three ideas into shared field notes.', state:'progress', icon:'trophy', progress:1, target:3, unit:'notes shared', reward:'100 points', condition:'Share three original notes in your workspace.', rarity:'Common', repetition:'Once', attribution:'Individual', availability:'Permanent' };
const collection = [{ ...firstSteps, state:'claimed', progress:3, unlockedAt:'2026-09-07', tier:'Bronze' }, { ...firstSteps, id:'regular', title:'A little, every day', description:'Keep a seven-day writing streak.', icon:'flame', progress:4, target:7, tier:'Silver', reward:'New journal cover' }, { ...firstSteps, id:'secret', title:'The hidden chapter', state:'locked', visibility:'hidden', progress:0, tier:'Gold' }];
const checklistLabels = ['Write your first note','Add a useful reference','Share it with the team'];

function ClaimDemo() {
  const request = useDemoRequest();
  const [claimed, setClaimed] = useState(false);
  const [fail, setFail] = useState(false);
  async function claim() { if (request.status === 'loading' || claimed) return; if (await request.run({ fail })) setClaimed(true); }
  return <><Achievement item={{ ...firstSteps, state:claimed ? 'claimed' : 'claimable', progress:3, reward:'Unlock the Studio journal cover' }} onClaim={claim} claimStatus={request.status} /><Switch label="Simulate a claim error" checked={fail} disabled={request.status === 'loading'} onChange={e => setFail(e.target.checked)} /><div className="experience-actions"><Button size="sm" variant="outline" onClick={() => { request.reset(); setClaimed(false); }}>Reset reward</Button></div><p className="experience-note" role="status">{claimed ? 'Studio journal cover added to your demo collection.' : 'Simulated reward claim · your achievement stays unlocked if the request fails.'}</p></>;
}

function ProgressAchievement({ example }) {
  const [value, setValue] = useState(example === 'Ready to begin' ? 0 : example === 'Daily streak' ? 4 : 1);
  const [checked, setChecked] = useState([checklistLabels[0]]);
  const [run, setRun] = useState(0);
  const [open, setOpen] = useState(false);
  const repeat = example === 'Repeatable achievement';
  const daily = example === 'Daily streak';
  const checklist = example === 'Checklist';
  const team = example === 'Team achievement';
  const target = daily ? 7 : team ? 10 : 3;
  const progress = checklist ? checked.length : value;
  const earned = progress >= target;
  const item = { ...firstSteps, id:'progress-demo', title:daily ? 'A little, every day' : team ? 'Better together' : repeat ? 'Weekly contributor' : firstSteps.title, description:daily ? 'Write a note on seven consecutive days.' : team ? 'Bring ten shared ideas together as a team.' : firstSteps.description, icon:daily ? 'flame' : team ? 'team' : 'trophy', progress, target, state:earned ? 'unlocked' : progress === 0 ? 'available' : 'progress', criteria:checklistLabels.map(label => ({ label,complete:checked.includes(label) })), repetition:repeat ? 'Weekly · resets next period' : 'Once', attribution:team ? 'Collective · Studio team' : 'Individual' };
  function add() { if (earned) return; const next = progress + 1; setValue(next); if (next === target) { setRun(old => old + 1); setOpen(true); } }
  function change(label, selected) { const next = selected ? [...checked,label] : checked.filter(item => item !== label); setChecked(next); if (next.length === 3) { setRun(old => old + 1); setOpen(true); } else setOpen(false); }
  return <><Achievement item={item} presentation={team || repeat ? 'detailed' : 'card'} progressDisplay={example === 'Numeric progress' ? 'count' : example === 'Progress ring' ? 'ring' : checklist ? 'checklist' : 'bar'} />
    {checklist ? <div className="achievement-demo-checklist" role="group" aria-label="Complete the achievement criteria">{checklistLabels.map(label => <Checkbox key={label} label={label} checked={checked.includes(label)} onChange={e => change(label,e.target.checked)} />)}</div> : <>{daily && <div className="achievement-streak" aria-label={`${value} consecutive days`}>{['M','T','W','T','F','S','S'].map((day,index) => <span key={index} data-done={index < value} aria-label={`Day ${index + 1}: ${index < value ? 'complete' : 'upcoming'}`}>{day}</span>)}</div>}<div className="experience-actions"><Button size="sm" variant="outline" disabled={earned} onClick={add}>{daily ? 'Simulate next day' : team ? 'Add team contribution' : 'Share a note'}</Button><Button size="sm" variant="outline" onClick={() => { setValue(0); setOpen(false); }}>{repeat && earned ? 'Start next week' : daily ? 'Miss a day · reset' : 'Reset progress'}</Button></div></>}
    <AchievementUnlock item={item} open={open} onOpenChange={setOpen} celebration="brief" mode="banner" replayKey={run} />
    <p className="experience-note">{daily ? 'Simulated days · a missed day resets the consecutive streak.' : repeat ? 'Local weekly simulation. The application owns period boundaries and repeat eligibility.' : 'Local progress demonstration · completion is confirmed by the action above.'}</p></>;
}

function UnlockDemo({ example }) {
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(0);
  const anchor = useRef(null);
  const mode = example === 'Unlock toast' ? 'toast' : example === 'Celebration dialog' ? 'dialog' : example === 'Unlock banner' ? 'banner' : 'inline';
  return <><Achievement item={{ ...firstSteps, state:'unlocked', progress:3 }} presentation="row" visual="icon" progressDisplay="none" /><div className="experience-actions"><Button ref={anchor} size="sm" variant="outline" onClick={() => { setRun(old => old + 1); setOpen(true); }}>Replay unlock</Button></div><AchievementUnlock item={firstSteps} mode={mode} open={open} onOpenChange={setOpen} celebration={mode === 'dialog' ? 'confetti' : 'brief'} replayKey={run} container={anchor.current?.closest('dialog')} returnFocus={anchor.current} /><p className="experience-note">The achievement is already earned. Replay its announcement without changing progress.</p></>;
}

export function AchievementDemo({ example }) {
  const [details, setDetails] = useState(null);
  const [reveal, setReveal] = useState(false);
  const request = useDemoRequest();
  let content;
  if (['Numeric progress','Progress bar','Progress ring','Checklist','Daily streak','Team achievement','Repeatable achievement','Ready to begin'].includes(example)) content = <ProgressAchievement example={example} />;
  else if (['Inline unlock','Unlock toast','Unlock banner','Celebration dialog'].includes(example)) content = <UnlockDemo example={example} />;
  else switch (example) {
    case 'Unlocked badge': content = <Achievement item={{ ...firstSteps, state:'unlocked', reward:undefined }} presentation="badge" progressDisplay="none" />; break;
    case 'Compact row': content = <Achievement item={firstSteps} presentation="row" visual="icon" />; break;
    case 'Detailed card': content = <Achievement item={{ ...firstSteps, tier:'Bronze', state:'claimed', progress:3, unlockedAt:'2026-09-07' }} presentation="detailed" onDetails={() => setDetails({ ...firstSteps, state:'claimed', progress:3, unlockedAt:'2026-09-07' })} />; break;
    case 'With illustration': content = <Achievement item={{ ...firstSteps, state:'unlocked', progress:3, title:'An idea worth sharing' }} visual="illustration" progressDisplay="none" />; break;
    case 'Locked achievement': content = <Achievement item={{ ...firstSteps, title:'The next chapter', description:'Finish First steps to unlock this challenge.', state:'locked', progress:0 }} />; break;
    case 'Secret achievement':
    case 'Partially revealed': content = <><Achievement item={{ ...firstSteps, title:'The hidden chapter', description:'You found an unexpected connection between three notes.', hint:'Three notes. One unexpected connection.', state:reveal ? 'unlocked' : 'locked', visibility:example === 'Secret achievement' ? 'hidden' : 'partial', progress:reveal ? 3 : 0 }} /><div className="experience-actions"><Button variant="outline" size="sm" onClick={() => setReveal(!reveal)}>{reveal ? 'Reset discovery' : 'Simulate discovery'}</Button></div></>; break;
    case 'Achievement tiers': content = <AchievementTiers items={['Bronze','Silver','Gold'].map((tier, index) => ({ ...firstSteps, id:tier, tier, title:['First steps','Finding a rhythm','A lasting contribution'][index], target:[3,10,25][index], progress:[3,6,6][index], state:index === 0 ? 'unlocked' : index === 1 ? 'progress' : 'locked', reward:`${[100,250,500][index]} points` }))} />; break;
    case 'Seasonal achievement': content = <Achievement item={{ ...firstSteps, title:'September field notes', icon:'clock', description:'Capture the season in five original notes.', target:5, progress:2, availability:'Season 04 · until September 30, 2026', repetition:'Each season', reward:'Season 04 profile badge' }} presentation="detailed" />; break;
    case 'Claim a reward': content = <ClaimDemo />; break;
    case 'Collection and summary': content = <><AchievementSummary items={collection} /><AchievementCollection items={collection} layout="list" visual="icon" onDetails={setDetails} /></>; break;
    case 'Every achievement state': content = <AchievementCollection items={Object.entries(achievementStates).map(([state,title]) => ({ ...firstSteps, id:state, title, state, progress:isAchievementEarned(state) ? 3 : state === 'progress' ? 1 : 0, reward:undefined, description:state === 'expired' ? 'The September 2025 challenge has ended.' : state === 'unavailable' ? 'This challenge is not available for this workspace.' : undefined }))} visual="icon" progressDisplay="none" />; break;
    case 'Initial loading':
    case 'Loading error': content = <><Achievement item={firstSteps} loading={request.status === 'loading'} error={request.status === 'error' ? 'Achievements could not be loaded. Try the request again.' : example === 'Loading error' && request.status === 'idle' ? 'The simulated request failed. Try again to load your progress.' : undefined} onRetry={() => request.run()} /><div className="experience-actions"><Button variant="outline" size="sm" status={request.status === 'loading' ? 'loading' : 'idle'} onClick={() => request.run({ fail:example === 'Loading error' })}>{example === 'Loading error' ? 'Simulate failed reload' : 'Simulate initial load'}</Button></div><p className="experience-note">Simulated loading · the preview is replaced with a skeleton only during the request.</p></>; break;
    case 'Long content': content = <Achievement item={{ ...firstSteps, title:'A shared collection of field notes, unexpected discoveries and thoughtful conversations', description:'Bring the entire research team together around one carefully documented collection, including references, decisions and questions for the next study.', target:100000, progress:12480, reward:'Unlock the extended research workspace' }} presentation="detailed" />; break;
    case 'Sizes': content = <div className="experience-state-list">{['sm','md','lg'].map(size => <Achievement key={size} item={firstSteps} size={size} presentation="row" visual="icon" />)}</div>; break;
    case 'Dark surface': content = <><Achievement item={{ ...firstSteps, state:'claimable', progress:3, tier:'Bronze' }} /><Achievement item={{ ...firstSteps, state:'locked', visibility:'hidden' }} presentation="row" visual="icon" /></>; break;
    case 'Right to left': content = <Achievement item={{ ...firstSteps, title:'الخطوات الأولى', description:'شارك ثلاث أفكار مع فريقك في مساحة العمل.', reward:'١٠٠ نقطة', stateLabel:'قيد التنفيذ', progressLabel:'تقدم الإنجاز', target:3000, progress:1248 }} locale="ar" />; break;
    default: content = <Achievement item={firstSteps} />;
  }
  return <div className="experience-demo feedback-surface experience-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'} dir={example === 'Right to left' ? 'rtl' : 'ltr'}>{content}{details && <AchievementDetails item={details} open onOpenChange={open => { if (!open) setDetails(null); }} />}</div>;
}

export function AchievementPlayground() {
  const [presentation, setPresentation] = useState('card');
  const [visual, setVisual] = useState('medallion');
  const [display, setDisplay] = useState('bar');
  const [celebration, setCelebration] = useState('confetti');
  const [dark, setDark] = useState(false);
  const [value, setValue] = useState(2);
  const [open, setOpen] = useState(false);
  const [run, setRun] = useState(0);
  const item = { ...firstSteps, progress:value, state:value === 3 ? 'unlocked' : 'progress', tier:'Bronze' };
  return <Card variant="elevated" interactive className="feedback-lab playground-card" aria-label="Achievement playground"><div className="feedback-lab-heading"><h3>Progress deserves a keepsake.</h3><p>One more note to a first milestone. Choose its shape, complete the goal, and give the moment its due.</p></div><div className="feedback-lab-layout"><div className="feedback-lab-controls">{[['Presentation',presentation,setPresentation,['badge','row','card','detailed']],['Visual',visual,setVisual,['icon','medallion','illustration']],['Progress',display,setDisplay,['none','count','bar','ring']],['Celebration',celebration,setCelebration,['none','accent','brief','confetti']]].map(([label,value,onValueChange,values]) => <Select key={label} label={label} width="full" value={value} onValueChange={onValueChange} options={values.map(value => ({ value,label:value }))} />)}<Switch label="Dark surface" checked={dark} onChange={e => setDark(e.target.checked)} /></div><div className="feedback-lab-stage feedback-surface experience-surface" data-theme={dark ? 'dark' : 'light'}><Achievement item={item} presentation={presentation} visual={visual} progressDisplay={display} /><div className="experience-actions"><Button size="sm" status={value === 3 ? 'success' : 'idle'} successLabel="Achievement unlocked" onClick={() => { setValue(3); setRun(old => old + 1); setOpen(true); }}>Share the last note</Button><Button size="sm" variant="outline" onClick={() => { setValue(2); setOpen(false); }}>Reset</Button></div><AchievementUnlock item={item} open={open} onOpenChange={setOpen} celebration={celebration} mode="inline" replayKey={run} /></div></div></Card>;
}
