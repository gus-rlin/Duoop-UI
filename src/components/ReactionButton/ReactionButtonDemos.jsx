import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { ReactionButton, ReactionGroup, ReactionPicker, ReactionSummary, ReactionDetails, defaultReactions } from './ReactionButton';
import { Button } from '../Button/Button';
import { Select } from '../Select/Select';
import { Switch } from '../Selection/Selection';
import { simulateRequest, useDemoRequest } from '../Feedback/useDemoRequest';
import '../Feedback/Experience.css';

export const reactionExamples = [
  ['Like with count','Essentials'], ['Favorite','Essentials'], ['Repeatable applause','Essentials'], ['Custom icon','Essentials'],
  ['Icon only','Presentation'], ['Text only','Presentation'], ['Separate counter','Presentation'], ['Zero values','Presentation'], ['Number formats','Presentation'], ['Stable label','Presentation'],
  ['Exclusive choices','Compositions'], ['Multiple reactions','Compositions'], ['Add reaction','Compositions'], ['Collective summary','Compositions'],
  ['Initial loading','Data and states'], ['Confirmed update','Data and states'], ['Optimistic rollback','Data and states'], ['Disabled','Data and states'], ['Read only','Data and states'], ['Contribution limit','Data and states'], ['Sign in required','Data and states'],
  ['Motion styles','System'], ['Sizes','System'], ['Dark surface','System'], ['Right to left','System'],
];
const groupItems = defaultReactions.slice(0,3).map((item, i) => ({ ...item, count:[24,8,12][i] }));
const people = [{ id:'1', name:'Alex Morgan', detail:'Product design', reaction:'like' }, { id:'2', name:'Sam Rivera', detail:'Engineering', reaction:'clap' }, { id:'3', name:'Charlie Martin', detail:'Research', reaction:'favorite' }, { id:'4', name:'Taylor Chen', detail:'Product design', reaction:'like' }];

function AsyncReaction({ optimistic }) {
  const [fail, setFail] = useState(optimistic);
  const [run, setRun] = useState(0);
  return <><ReactionButton key={run} defaultValue={{ count:1248 }} counter="separate" update={optimistic ? 'optimistic' : 'confirmed'} onReact={(_, { signal }) => simulateRequest({ signal, fail, delay:900 })} /><Switch label="Simulate a failed save" checked={fail} onChange={e => setFail(e.target.checked)} /><div className="experience-actions"><Button variant="outline" size="sm" onClick={() => setRun(old => old + 1)}>Reset</Button></div><p className="experience-note">Simulated save · {optimistic ? 'the total changes immediately and rolls back if saving fails. Turn off the failure, then retry.' : 'the total changes only after the request succeeds.'}</p></>;
}

export function ReactionButtonDemo({ example }) {
  const request = useDemoRequest();
  const [pickerItems, setPickerItems] = useState([{ ...defaultReactions[0], count:4 }]);
  const [selection, setSelection] = useState([]);
  const [details, setDetails] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [signInPrompt, setSignInPrompt] = useState(false);
  let content;
  switch (example) {
    case 'Favorite': content = <ReactionButton kind="favorite" counter="hidden" />; break;
    case 'Repeatable applause': content = <><ReactionButton kind="clap" action="repeat" feedback="particles" defaultValue={{ count:86 }} /><p className="experience-note">Each activation adds one applause. No application quota in this example.</p></>; break;
    case 'Custom icon': content = <ReactionButton kind="custom" icon="bulb" label="Great idea" selectedLabel="Inspired" defaultValue={{ count:12 }} />; break;
    case 'Icon only': content = <div className="experience-actions"><ReactionButton presentation="icon" defaultValue={{ count:24 }} /><ReactionButton kind="favorite" presentation="icon" counter="hidden" /></div>; break;
    case 'Text only': content = <ReactionButton presentation="text" defaultValue={{ count:24 }} />; break;
    case 'Separate counter': content = <ReactionButton counter="separate" defaultValue={{ count:1248 }} />; break;
    case 'Zero values': content = <div className="experience-state-list">{['show','hide','invite'].map(zero => <div key={zero}><p className="experience-kicker">{zero === 'show' ? 'SHOW ZERO' : zero === 'hide' ? 'HIDE ZERO' : 'INVITE A FIRST REACTION'}</p><ReactionButton zero={zero} label={zero === 'invite' ? 'Be the first to like' : 'Like'} /></div>)}</div>; break;
    case 'Number formats': content = <div className="experience-state-list">{['exact','compact','capped'].map(format => <div key={format}><p className="experience-kicker">{format}</p><ReactionButton format={format} defaultValue={{ count:1248 }} /></div>)}</div>; break;
    case 'Stable label': content = <ReactionButton kind="favorite" label="Favorite" selectedLabel="Favorite" defaultValue={{ count:8 }} />; break;
    case 'Exclusive choices':
    case 'Multiple reactions': content = <><ReactionGroup items={groupItems} mode={example === 'Exclusive choices' ? 'exclusive' : 'multiple'} value={selection} onValueChange={setSelection} buttonProps={{ size:'sm' }} /><p className="experience-note" role="status">{selection.length ? `${selection.length} selected · ${selection.map(id => defaultReactions.find(item => item.id === id).label).join(', ')}` : example === 'Exclusive choices' ? 'Choose one reaction. Choosing another replaces it.' : 'Choose as many reactions as you like.'}</p></>; break;
    case 'Add reaction': content = <><ReactionGroup items={pickerItems} value={selection} onValueChange={setSelection} buttonProps={{ size:'sm' }} /><div className="experience-actions"><ReactionPicker onSelect={item => { setPickerItems(old => old.some(existing => existing.id === item.id) ? old : [...old, { ...item, count:0 }]); setSelection(old => [...new Set([...old,item.id])]); }} /></div><p className="experience-note">Pick with a click or arrow keys. Reusing a reaction selects its existing button.</p></>; break;
    case 'Collective summary': content = <><div className="reaction-editorial"><p className="experience-kicker">FIELD NOTES / 04</p><h4>Good ideas deserve a little applause.</h4><p>A small sign of appreciation helps a shared idea find its people.</p><ReactionSummary items={groupItems} total={people.length} onDetails={() => setDetails(true)} /></div><ReactionDetails open={details} onOpenChange={setDetails} participants={people} /></>; break;
    case 'Initial loading': content = <>{request.status !== 'idle' ? <ReactionButton key={request.status === 'success' ? 'loaded' : 'loading'} loading={request.status === 'loading'} defaultValue={{ count:1248 }} counter="separate" /> : <p className="experience-note">Load the current reactions to join the conversation.</p>}<div className="experience-actions"><Button variant="outline" size="sm" disabled={request.status === 'loading'} onClick={() => request.run()}>Load reactions</Button></div><p className="experience-note">Simulated initial request · no total is displayed before it is available.</p></>; break;
    case 'Confirmed update': content = <AsyncReaction optimistic={false} />; break;
    case 'Optimistic rollback': content = <AsyncReaction optimistic />; break;
    case 'Disabled': content = <div className="experience-actions"><ReactionButton disabled defaultValue={{ count:24 }} /><ReactionButton disabled kind="favorite" defaultValue={{ selected:true, count:8 }} /></div>; break;
    case 'Read only': content = <><ReactionButton readOnly defaultValue={{ selected:true, count:128 }} /><p className="experience-note">An archived conversation. Totals remain readable without an active control.</p></>; break;
    case 'Contribution limit': content = <><ReactionButton kind="clap" action="repeat" quota={3} feedback="particles" defaultValue={{ count:24 }} /><p className="experience-note">Up to three contributions per viewer in this example.</p></>; break;
    case 'Sign in required': content = <><ReactionButton authRequired={!signedIn} onAuthRequest={() => setSignInPrompt(true)} defaultValue={{ count:24 }} />{signInPrompt && !signedIn && <div className="experience-actions"><Button size="sm" variant="outline" onClick={() => { setSignedIn(true); setSignInPrompt(false); }}>Use demo account</Button></div>}<p className="experience-note">{signedIn ? 'Demo account active. You can now react.' : 'Local sign-in demonstration · no account is created.'}</p></>; break;
    case 'Motion styles': content = <div className="experience-state-list">{['instant','soft','pulse','particles'].map(feedback => <div key={feedback}><p className="experience-kicker">{feedback}</p><ReactionButton feedback={feedback} defaultValue={{ count:24 }} /></div>)}</div>; break;
    case 'Sizes': content = <div className="experience-state-list">{['sm','md','lg'].map(size => <ReactionButton key={size} size={size} defaultValue={{ count:24 }} />)}</div>; break;
    case 'Dark surface': content = <><ReactionButton feedback="particles" defaultValue={{ count:24 }} /><ReactionButton kind="favorite" counter="hidden" /><ReactionButton kind="clap" readOnly defaultValue={{ count:1248 }} /></>; break;
    case 'Right to left': content = <><ReactionButton label="أعجبني" selectedLabel="أعجبك" locale="ar" defaultValue={{ count:1248 }} /><p className="experience-note">تقدير صغير لفكرة تستحق المشاركة.</p></>; break;
    default: content = <ReactionButton defaultValue={{ count:24 }} feedback="particles" />;
  }
  return <div className="experience-demo feedback-surface experience-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'} dir={example === 'Right to left' ? 'rtl' : 'ltr'}>{content}</div>;
}

export function ReactionPlayground() {
  const [kind, setKind] = useState('like');
  const [feedback, setFeedback] = useState('particles');
  const [counter, setCounter] = useState('integrated');
  const [format, setFormat] = useState('exact');
  const [size, setSize] = useState('md');
  const [dark, setDark] = useState(false);
  const [run, setRun] = useState(0);
  return <Card variant="elevated" interactive className="feedback-lab playground-card" aria-label="Reaction Button playground"><div className="feedback-lab-heading"><h3>A little appreciation goes a long way.</h3><p>Press, react, and watch the count settle. The familiar Button carries every interaction.</p></div><div className="feedback-lab-layout"><div className="feedback-lab-controls">{[['Reaction',kind,setKind,['like','favorite','clap','custom']],['Feedback',feedback,setFeedback,['instant','soft','pulse','particles']],['Counter',counter,setCounter,['hidden','integrated','separate']],['Number format',format,setFormat,['exact','compact','capped']],['Size',size,setSize,['sm','md','lg']]].map(([label,value,onValueChange,values]) => <Select key={label} label={label} width="full" value={value} onValueChange={onValueChange} options={values.map(value => ({ value,label:value }))} />)}<Switch label="Dark surface" checked={dark} onChange={e => setDark(e.target.checked)} /></div><div className="feedback-lab-stage feedback-surface experience-surface" data-theme={dark ? 'dark' : 'light'}><div className="reaction-editorial"><p className="experience-kicker">FROM THE STUDIO / FIELD NOTES</p><h4>Small details. Lasting impressions.</h4><p>A collection of things we learned while building a more thoughtful workspace.</p><ReactionButton key={`${kind}-${run}`} kind={kind} action={kind === 'clap' ? 'repeat' : 'toggle'} feedback={feedback} counter={counter} format={format} size={size} defaultValue={{ count:1248 }} /></div><div className="experience-actions"><Button size="sm" variant="outline" onClick={() => setRun(old => old + 1)}>Reset reaction</Button></div></div></div></Card>;
}
