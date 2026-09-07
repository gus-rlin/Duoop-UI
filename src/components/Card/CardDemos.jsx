import React, { useState } from 'react';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Badge, StatusDot } from '../Badge/Badge';
import { Input } from '../Forms/Input';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardFrame, CardFrameAction, CardFrameDescription, CardFrameFooter, CardFrameHeader, CardFrameTitle, CardHeader, CardMedia, CardTitle } from './Card';

const base = { title: 'Weekly field notes', description: 'A concise record of decisions, open questions, and the work ahead.' };
function LineIcon({ name }) {
  const paths = {
    person: <><circle cx="12" cy="8" r="3.2"/><path d="M5.5 20c.6-4 2.8-6 6.5-6s5.9 2 6.5 6"/></>,
    document: <><path d="M6 3h8l4 4v14H6z"/><path d="M14 3v5h5M9 12h6M9 16h6"/></>,
    team: <><circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.3"/><path d="M3.8 20c.5-4 2.2-6 5.2-6s4.7 2 5.2 6M14.5 15c3.1-.7 5.1 1 5.7 4"/></>,
    arrow: <><path d="M6 18 18 6M6 6h12v12"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    moon: <path d="M20 14A8.5 8.5 0 0 1 10 4a8.5 8.5 0 1 0 10 10Z"/>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="19" cy="12" r="1" fill="currentColor" stroke="none"/></>,
  };
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}
function TactileIcon({ name = 'person', large = false }) { return <span className={`card-symbol${large ? ' card-symbol--large' : ''}`} aria-hidden="true"><LineIcon name={name}/></span>; }
function Artwork({ compact = false }) { return <svg className={`card-artwork ${compact ? 'card-artwork--compact' : ''}`} viewBox="0 0 220 154" fill="none" aria-hidden="true"><path className="card-artwork__shadow" d="M77 25 160 15l13 105-84 11z"/><path className="card-artwork__back" d="M65 20 150 12l11 108-84 9z"/><path className="card-artwork__front" d="m86 18 76 8-10 108-76-8z"/><path className="card-artwork__rule" d="m99 52 38 4m-40 13 27 3m-30 31 42 4m-44 11 29 3"/><path className="card-artwork__mark" d="m132 82 7 7 14-18"/><circle className="card-artwork__pin" cx="153" cy="36" r="5"/></svg>; }
function MoreButton() { return <IconButton size="sm" variant="outline" label="More options" icon={<LineIcon name="more"/>}/>; }
function Eyebrow({ children }) { return <span className="card-eyebrow">{children}</span>; }

export const cardExamples = [
  ['Simple card', 'Essentials'], ['Title and description', 'Essentials'], ['Header and action', 'Essentials'], ['Content and footer', 'Essentials'], ['Top image', 'Media'], ['Side image', 'Media'], ['Avatar or icon', 'Media'], ['Status badge', 'Media'], ['Metric card', 'Use cases'], ['Product card', 'Use cases'], ['Profile card', 'Use cases'], ['Selection card', 'Interaction'], ['Fully clickable', 'Interaction'], ['Multiple actions', 'Interaction'], ['Form card', 'Interaction'], ['Frame with global action', 'Frames'], ['Frame with list', 'Frames'], ['Frame with table', 'Frames'], ['Empty state', 'States'], ['Loading skeleton', 'States'], ['Error state', 'States'], ['Long content and overflow', 'States'],
];

export function CardDemo({ example = 'Simple card' }) {
  const [selected, setSelected] = useState(false);
  if (example === 'Simple card') return <Card><CardContent className="card-simple-content">A quiet surface for related content.</CardContent></Card>;
  if (example === 'Title and description') return <Card className="card-note"><CardHeader><Eyebrow>Journal / September</Eyebrow><CardTitle>{base.title}</CardTitle><CardDescription>{base.description}</CardDescription></CardHeader></Card>;
  if (example === 'Header and action') return <Card variant="elevated"><CardHeader><CardTitle>Project brief</CardTitle><CardAction><MoreButton /></CardAction><CardDescription>Updated twelve minutes ago.</CardDescription></CardHeader></Card>;
  if (example === 'Content and footer') return <Card><CardHeader><CardTitle>Review queue</CardTitle></CardHeader><CardContent>Three drafts are ready for a considered pass.</CardContent><CardFooter><span>3 items</span><Button size="sm" variant="ghost">Open queue</Button></CardFooter></Card>;
  if (example === 'Top image') return <Card variant="elevated"><CardMedia><Artwork /></CardMedia><CardHeader><Eyebrow>Research / 09</Eyebrow><CardTitle>Field journal</CardTitle><CardDescription>Observations from the September study.</CardDescription></CardHeader></Card>;
  if (example === 'Side image') return <Card orientation="horizontal"><CardMedia><Artwork compact /></CardMedia><CardHeader><CardTitle>Material study</CardTitle><CardDescription>Paper, ink, and a deliberate pace.</CardDescription></CardHeader></Card>;
  if (example === 'Avatar or icon') return <Card><CardHeader className="card-person-header"><TactileIcon name="person"/><div><Eyebrow>Research team</Eyebrow><CardTitle>Amélie Martin</CardTitle><CardDescription>Research lead · Paris</CardDescription></div></CardHeader></Card>;
  if (example === 'Status badge') return <Card variant="filled"><CardHeader><CardTitle>Editorial review</CardTitle><Badge tone="success" leading={<StatusDot />}>Ready</Badge><CardDescription>All required checks passed.</CardDescription></CardHeader></Card>;
  if (example === 'Metric card') return <Card size="lg" variant="elevated" className="card-stat"><CardHeader><Eyebrow>Workspace insights</Eyebrow><CardTitle>Completion rate</CardTitle><Badge appearance="outline">30 days</Badge></CardHeader><CardContent><div className="card-metric-row"><strong className="card-metric">84<span>%</span></strong><span className="card-delta"><LineIcon name="arrow"/>12%<small>from August</small></span></div><div className="card-meter" role="meter" aria-label="Completion rate" aria-valuemin={0} aria-valuemax={100} aria-valuenow={84}><span/></div><div className="card-meter-labels"><span>Completed</span><span>84 / 100</span></div></CardContent></Card>;
  if (example === 'Product card') return <Card variant="elevated"><CardMedia><Artwork /></CardMedia><CardHeader><CardTitle>Studio notebook</CardTitle><Badge tone="warning">Low stock</Badge><CardDescription>Recycled paper · 160 pages</CardDescription></CardHeader><CardFooter><strong>€24</strong><Button size="sm">Add to cart</Button></CardFooter></Card>;
  if (example === 'Profile card') return <Card size="lg" className="card-profile"><CardHeader><Eyebrow>Studio / People</Eyebrow><TactileIcon name="person" large/><CardTitle>Noah Laurent</CardTitle><CardDescription>Product designer shaping calm, legible tools.</CardDescription></CardHeader><CardFooter><Badge appearance="outline" leading={<LineIcon name="document"/>}>8 projects</Badge><Button size="sm" variant="outline">View profile</Button></CardFooter></Card>;
  if (example === 'Selection card') return <Card as="button" className="card-selection" interactive selected={selected} onClick={() => setSelected(value => !value)} aria-pressed={selected}><CardHeader><TactileIcon name="moon"/><span className="card-selection-check" aria-hidden="true"><LineIcon name="check"/></span><CardTitle>Quiet mode</CardTitle><CardDescription>Reduce non-essential activity across the workspace.</CardDescription></CardHeader><CardFooter><span>Workspace preference</span><span className="card-selection-status">{selected ? 'Selected' : 'Select mode'}</span></CardFooter></Card>;
  if (example === 'Fully clickable') return <Card href="#card-usage" interactive variant="elevated" className="card-guide"><CardHeader><Eyebrow>Resources / Getting started</Eyebrow><CardTitle>Read the implementation guide</CardTitle><CardDescription>One semantic link owns the whole surface.</CardDescription></CardHeader><CardFooter><span>Explore the guide</span><TactileIcon name="arrow"/></CardFooter></Card>;
  if (example === 'Multiple actions') return <Card><CardHeader><CardTitle>September report</CardTitle><CardAction><MoreButton /></CardAction><CardDescription>Shared with four collaborators.</CardDescription></CardHeader><CardFooter><Button size="sm" variant="outline">Preview</Button><Button size="sm">Download</Button></CardFooter></Card>;
  if (example === 'Form card') return <Card><CardHeader><CardTitle>Invite a collaborator</CardTitle><CardDescription>They will receive access to this project.</CardDescription></CardHeader><CardContent><label className="card-field">Email address<Input type="email" placeholder="name@example.com" /></label></CardContent><CardFooter><span /><Button size="sm">Send invite</Button></CardFooter></Card>;
  if (example === 'Frame with global action') return <CardFrame><CardFrameHeader><div><CardFrameTitle>Recent documents</CardFrameTitle><CardFrameDescription>Work opened this week.</CardFrameDescription></div><CardFrameAction><Button size="sm">New document</Button></CardFrameAction></CardFrameHeader><CardContent><div className="card-list-row"><span>Launch notes</span><Badge tone="success">Ready</Badge></div></CardContent></CardFrame>;
  if (example === 'Frame with list') return <CardFrame><CardFrameHeader><CardFrameTitle>Workspace members</CardFrameTitle><Badge appearance="outline" leading={<LineIcon name="team"/>}>3</Badge></CardFrameHeader><CardContent className="card-list">{['Amélie Martin', 'Noah Laurent', 'Sofia Bernard'].map((name, i) => <div className="card-list-row" key={name}><TactileIcon name="person"/><span>{name}</span><small>{i ? 'Editor' : 'Owner'}</small></div>)}</CardContent></CardFrame>;
  if (example === 'Frame with table') return <CardFrame><CardFrameHeader><CardFrameTitle>Plan usage</CardFrameTitle><CardFrameAction><Button size="sm" variant="ghost">Manage</Button></CardFrameAction></CardFrameHeader><CardContent className="card-table-wrap"><table className="card-table"><thead><tr><th>Resource</th><th>Used</th><th>Limit</th></tr></thead><tbody><tr><td>Projects</td><td>8</td><td>12</td></tr><tr><td>Members</td><td>14</td><td>20</td></tr></tbody></table></CardContent><CardFrameFooter><span>Updated today</span><Badge tone="info">On track</Badge></CardFrameFooter></CardFrame>;
  if (example === 'Empty state') return <Card variant="filled"><CardContent className="card-empty"><TactileIcon name="document" large/><CardTitle>No saved views</CardTitle><CardDescription>Save a filter to return to it later.</CardDescription><Button size="sm" variant="outline">Create view</Button></CardContent></Card>;
  if (example === 'Loading skeleton') return <Card loading aria-label="Loading project summary" />;
  if (example === 'Error state') return <Card className="duoop-card--error"><CardHeader><CardTitle>Preview unavailable</CardTitle><Badge tone="danger">Error</Badge><CardDescription>The file could not be loaded. Check your connection and try again.</CardDescription></CardHeader><CardFooter><span /><Button size="sm" variant="destructive-outline">Try again</Button></CardFooter></Card>;
  return <Card><CardHeader><CardTitle>A very long research title that demonstrates how the surface protects its layout when content becomes unusually verbose</CardTitle><CardDescription>This description deliberately runs beyond the comfortable reading length. It wraps naturally, preserves the action area, and never forces the card wider than its container.</CardDescription></CardHeader><CardContent><div className="card-overflow" tabIndex="0">{Array.from({ length: 7 }, (_, i) => <p key={i}>Observation {i + 1}: long content remains available inside a bounded, keyboard-scrollable region.</p>)}</div></CardContent></Card>;
}

export function CardVariantLab() {
  return <div className="card-variant-lab">{['outline','elevated','filled','ghost'].map(variant => <Card key={variant} variant={variant}><CardHeader><CardTitle>{variant}</CardTitle><CardDescription>A {variant} surface.</CardDescription></CardHeader></Card>)}</div>;
}

export function CardStateLab() {
  return <div className="card-state-lab"><Card interactive onClick={() => {}}><CardHeader><CardTitle>Interactive</CardTitle></CardHeader></Card><Card interactive selected onClick={() => {}}><CardHeader><CardTitle>Selected</CardTitle></CardHeader></Card><Card interactive disabled onClick={() => {}}><CardHeader><CardTitle>Disabled</CardTitle></CardHeader></Card><Card loading aria-label="Loading card" /></div>;
}
