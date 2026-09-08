import { Card } from '../Card/Card';
import React, { useState } from 'react';
import { BentoGrid, BentoItem } from './BentoGrid';
import { Button } from '../Button/Button';
import { ExperienceIcon } from '../Feedback/ExperienceIcon';
import '../Feedback/Feedback.css';

function LayoutDrawing({ compact }) {
  return <svg className="bento-drawing" viewBox="0 0 400 190" fill="none" aria-hidden="true">
    <rect x="42" y="20" width="320" height="154" rx="10" fill="var(--feedback-edge)" />
    <rect x="38" y="14" width="320" height="154" rx="10" fill="var(--feedback-face)" stroke="currentColor" strokeWidth="2" />
    <path d="M38 42h320M54 28h24m230 0h32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <g className="bento-drawing__layout" key={String(compact)} stroke="currentColor" strokeWidth="2">
      <rect x="54" y="56" width={compact ? 132 : 180} height="96" rx="6" fill="var(--feedback-soft)" />
      <rect x={compact ? 198 : 246} y="56" width={compact ? 144 : 96} height="42" rx="6" fill="var(--feedback-face)" />
      <rect x={compact ? 198 : 246} y="110" width={compact ? 144 : 96} height="42" rx="6" fill="var(--feedback-soft)" />
      <path d="M70 76h64m-64 12h44m0 46v-24m12 24v-12m12 12v-32" strokeLinecap="round" />
    </g>
  </svg>;
}

export const bentoExamples = [['Studio overview', 'Composition'], ['Quiet surface', 'Composition'], ['Dark surface', 'Theme']];

export function BentoGridDemo({ example = 'Studio overview', copy = {} }) {
  const [compact, setCompact] = useState(false);
  const [saved, setSaved] = useState(false);
  return <div className="bento-demo feedback-surface" data-theme={example === 'Dark surface' ? 'dark' : 'light'}>
    <BentoGrid label={`${example} grid`}>
      <BentoItem span="feature" tone={example === 'Quiet surface' ? 'default' : 'soft'}>
        <div className="bento-kicker"><span>{copy.eyebrow ?? 'STUDIO / COLLECTION 031'}</span><ExperienceIcon name="spark" /></div>
        <div className="bento-hero-copy"><h3>{copy.titleFirst ?? 'A place for'}<br />{copy.titleSecond ?? 'every good idea.'}</h3><p>{copy.introFirst ?? 'Give your work a little structure.'}<br />{copy.introSecond ?? 'Leave room for the unexpected.'}</p></div>
        <LayoutDrawing compact={compact} />
        <div className="bento-footer"><span>{copy.footer ?? 'One grid. Your rhythm.'}</span><Button variant="outline" size="sm" selected={compact} onClick={() => setCompact(value => !value)} icon={<ExperienceIcon name="arrow" />} iconPosition="right">Change layout</Button></div>
      </BentoItem>
      <BentoItem><div className="bento-kicker"><span>{copy.essentialsEyebrow ?? 'THE ESSENTIALS'}</span><ExperienceIcon name="file" /></div><div className="bento-metric">12<span> / 12</span></div><h3>{copy.essentialsTitle ?? 'Everything in place.'}</h3><p>{copy.essentialsDescription ?? 'A considered set of foundations, ready for your next project.'}</p><div className="bento-meter" aria-hidden="true">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div></BentoItem>
      <BentoItem><div className="bento-kicker"><span>{copy.saveEyebrow ?? 'MADE TO FEEL'}</span><ExperienceIcon name="plus" /></div><h3>{copy.saveTitleFirst ?? 'Small details.'}<br />{copy.saveTitleSecond ?? 'A lasting impression.'}</h3><p>{copy.saveDescription ?? 'Press, release, repeat. A little depth goes a long way.'}</p><div className="bento-save"><Button variant="outline" status={saved ? 'success' : 'idle'} successLabel="Added" onClick={() => setSaved(true)} icon={<ExperienceIcon name="plus" />}>{copy.saveButton ?? 'Add to collection'}</Button>{saved && <Button size="sm" variant="ghost" onClick={() => setSaved(false)}>Undo</Button>}</div><span className="bento-status" role="status">{saved ? (copy.savedStatus ?? 'Added to this demo collection.') : (copy.idleStatus ?? 'Try the tactile feedback.')}</span></BentoItem>
      <BentoItem span="wide"><div className="bento-bottom-copy"><span className="bento-kicker">{copy.wideEyebrow ?? 'BUILT TO ADAPT'}</span><h3>{copy.wideTitle ?? 'Different sizes. Same language.'}</h3><p>{copy.wideDescription ?? 'From a generous canvas to the palm of your hand.'}</p></div><div className="bento-formats" aria-hidden="true"><span /><span /><span /></div></BentoItem>
      <BentoItem tone="soft"><div className="bento-kicker"><span>{copy.quietEyebrow ?? 'LESS, BUT BETTER'}</span><ExperienceIcon name="heart" /></div><h3>{copy.quietTitle ?? 'Room to breathe.'}</h3><p>{copy.quietDescription ?? 'Clear hierarchy. Warm neutrals. Nothing competing for your attention.'}</p></BentoItem>
    </BentoGrid>
  </div>;
}

export function BentoPlayground() {
  return <Card variant="elevated" interactive className="bento-playground playground-card" aria-label="Bento Grid playground"><div className="bento-playground__heading"><span className="doc-eyebrow">A LITTLE ORDER. A LOT OF POSSIBILITY.</span><span>Interactive preview</span></div><BentoGridDemo /></Card>;
}

export function BentoPreview() {
  return <span className="bento-mini"><span><small>STUDIO / 031</small><strong>Ideas,<br />in good company.</strong></span><span><ExperienceIcon name="spark" /></span><span><i /><i /><i /></span><span>Room to create.<ExperienceIcon name="arrow" /></span></span>;
}
