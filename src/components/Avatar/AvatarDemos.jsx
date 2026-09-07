import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { Avatar, AvatarGroup } from './Avatar';
import { Button } from '../Button/Button';
import '../Feedback/Feedback.css';
import './AvatarShowcase.css';

export const people = [
  { name: 'Luke Tracy', role: 'Product designer', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=192&h=192&fit=crop&auto=format&q=80' },
  { name: 'Alex Morgan', role: 'Frontend engineer', src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=192&h=192&fit=crop&auto=format&q=80' },
  { name: 'Sam Rivera', role: 'Design engineer', src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=192&h=192&fit=crop&auto=format&q=80' },
];

export function AvatarPreview() {
  return <AvatarGroup><Avatar {...people[0]} /><Avatar {...people[1]} /><Avatar name="Jordan Lee" /></AvatarGroup>;
}

export function AvatarPlayground() {
  const [selected, setSelected] = useState(0);
  const [photos, setPhotos] = useState(true);
  const [dark, setDark] = useState(false);
  const person = people[selected];
  return <Card variant="elevated" interactive className="avatar-lab playground-card" aria-label="Avatar playground">
    <header><div><span className="doc-eyebrow">A FACE TO THE NAME</span><h3>A small frame. A familiar face.</h3><p>Choose a teammate. Every identity has a place.</p></div><span className="avatar-lab__index">01 — 03</span></header>
    <div className="avatar-lab__stage feedback-surface" data-theme={dark ? 'dark' : 'light'}>
      <div className="avatar-profile"><Avatar name={person.name} src={photos ? person.src : undefined} size="xl" status="online" /><div className="avatar-profile__copy" key={person.name} aria-live="polite"><strong>{person.name}</strong><span>{person.role}</span><small>Available for collaboration</small></div></div>
      <div className="avatar-roster" role="group" aria-label="Choose a teammate">{people.map((member, index) => <button key={member.name} className="avatar-choice" aria-label={`Select ${member.name}`} aria-pressed={selected === index} onClick={() => setSelected(index)}><Avatar name={member.name} src={photos ? member.src : undefined} /></button>)}</div>
    </div>
    <footer><span>YOUR WORKSPACE, WITH CHARACTER</span><div><Button size="sm" variant="outline" selected={!photos} onClick={() => setPhotos(value => !value)}>{photos ? 'Show initials' : 'Show photos'}</Button><Button size="sm" variant="outline" selected={dark} onClick={() => setDark(value => !value)}>{dark ? 'Light surface' : 'Dark surface'}</Button></div></footer>
  </Card>;
}

export const avatarExamples = [['Portrait', 'Essentials'], ['Initials', 'Essentials'], ['Sizes', 'Essentials'], ['Image recovery', 'Behavior'], ['Presence', 'Behavior'], ['Team stack', 'Composition'], ['Dark surface', 'Composition'], ['Right to left', 'Composition'], ['Disabled action', 'Behavior']];

function RecoveryDemo() {
  const [broken, setBroken] = useState(true);
  return <div className="avatar-example"><Avatar name={people[0].name} src={broken ? 'data:image/png;base64,broken' : people[0].src} size="lg" /><p>{broken ? 'Unavailable image. Identity stays.' : 'Portrait restored.'}</p><Button size="sm" variant="outline" onClick={() => setBroken(value => !value)}>{broken ? 'Restore photo' : 'Break image'}</Button></div>;
}

export function AvatarDemo({ example }) {
  if (example === 'Image recovery') return <RecoveryDemo />;
  if (example === 'Sizes') return <div className="avatar-row">{['sm', 'md', 'lg', 'xl'].map(size => <div key={size}><Avatar name="Jordan Lee" size={size} /><small>{size.toUpperCase()}</small></div>)}</div>;
  if (example === 'Presence') return <div className="avatar-row">{['online', 'busy', 'away'].map(status => <div key={status}><Avatar name="Jordan Lee" status={status} /><small>{status}</small></div>)}</div>;
  if (['Team stack', 'Dark surface', 'Right to left'].includes(example)) return <div className="avatar-example avatar-composition feedback-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'} dir={example === 'Right to left' ? 'rtl' : 'ltr'}><AvatarGroup label="Design team">{people.map(person => <Avatar key={person.name} name={person.name} src={person.src} />)}<Avatar name="Four more members" fallback="+4" /></AvatarGroup><p>{example === 'Right to left' ? 'فريق التصميم' : 'Good work is a team effort.'}</p></div>;
  if (example === 'Disabled action') return <div className="avatar-example"><button className="avatar-choice" disabled aria-label="Select Jordan Lee"><Avatar name="Jordan Lee" /></button><p>Selection unavailable</p></div>;
  return <div className="avatar-example"><Avatar name={example === 'Initials' ? 'Jordan Lee' : people[0].name} src={example === 'Initials' ? undefined : people[0].src} size="lg" /><p>{example === 'Initials' ? 'A name is enough.' : 'A portrait, with a little depth.'}</p></div>;
}
