import React, { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { createPortal } from 'react-dom';
import { Card } from '../Card/Card';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { Checkbox } from '../Checkbox/Checkbox';
import { Progress } from '../Progress/Progress';
import { Toast } from '../Toast/Toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody, DialogFooter } from '../Dialog/Dialog';
import { ExperienceIcon } from '../Feedback/ExperienceIcon';
import '../Feedback/Feedback.css';
import '../Feedback/Experience.css';
import './Achievement.css';
import { AchievementIllustration } from './AchievementIllustration';

export const achievementStates = { locked:'Locked', available:'Ready to begin', progress:'In progress', unlocked:'Unlocked', claimable:'Reward ready', claimed:'Reward claimed', expired:'Expired', unavailable:'Unavailable' };
export const isAchievementEarned = state => ['unlocked','claimable','claimed'].includes(state);

export function AchievementEmblem({ icon = 'trophy', visual = 'medallion', concealed = false }) {
  const symbol = concealed ? 'hidden' : icon;
  return <span className="achievement-emblem" data-visual={visual} aria-hidden="true">
    {visual === 'medallion' && <svg viewBox="0 0 100 116" fill="none"><g className="achievement-svg-shadow" transform="translate(0 3)"><path d="m28 70-9 36 18-7 11 12 5-34 7 34 11-12 18 7-9-36Z" /><path d="M50.0 3.0 L60.4 8.4 L72.0 8.9 L78.3 18.7 L88.1 25.0 L88.6 36.6 L94.0 47.0 L88.6 57.4 L88.1 69.0 L78.3 75.3 L72.0 85.1 L60.4 85.6 L50.0 91.0 L39.6 85.6 L28.0 85.1 L21.7 75.3 L11.9 69.0 L11.4 57.4 L6.0 47.0 L11.4 36.6 L11.9 25.0 L21.7 18.7 L28.0 8.9 L39.6 8.4Z" /></g><path className="achievement-ribbon" d="m28 70-9 36 18-7 11 12 5-34 7 34 11-12 18 7-9-36Z" /><path className="achievement-medal-face" d="M50.0 3.0 L60.4 8.4 L72.0 8.9 L78.3 18.7 L88.1 25.0 L88.6 36.6 L94.0 47.0 L88.6 57.4 L88.1 69.0 L78.3 75.3 L72.0 85.1 L60.4 85.6 L50.0 91.0 L39.6 85.6 L28.0 85.1 L21.7 75.3 L11.9 69.0 L11.4 57.4 L6.0 47.0 L11.4 36.6 L11.9 25.0 L21.7 18.7 L28.0 8.9 L39.6 8.4Z" /><circle className="achievement-medal-inset" cx="50" cy="47" r="30" /><ExperienceIcon name={symbol} x="32" y="29" width="36" height="36" /></svg>}
    {visual === 'icon' && <svg viewBox="0 0 64 68" fill="none"><rect className="achievement-svg-shadow" x="3" y="7" width="58" height="58" rx="10" /><rect className="achievement-medal-face" x="3" y="3" width="58" height="58" rx="10" /><ExperienceIcon name={symbol} x="17" y="16" width="30" height="30" /></svg>}
    {visual === 'illustration' && <AchievementIllustration concealed={concealed} />}
  </span>;
}

/** Persistent presentation. Progress alone never awards or claims an achievement. */
export function Achievement({ item, presentation = 'card', visual = 'medallion', progressDisplay = 'bar', size = 'md', onDetails, onClaim, claimStatus = 'idle', loading = false, error, onRetry, locale = 'en', className = '' }) {
  const earned = isAchievementEarned(item.state);
  const card = useRef(null);
  const previous = useRef({ id:item.id, earned });
  useLayoutEffect(() => {
    const prior = previous.current;
    previous.current = { id:item.id, earned };
    if (prior.id !== item.id || prior.earned || !earned || loading || error) return;
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const emblem = card.current.querySelector('.achievement-emblem:not([data-visual=illustration])');
      const badge = card.current.querySelector('.achievement-copy .duoop-badge');
      const reward = card.current.querySelector('.achievement-reward');
      const sequence = gsap.timeline();
      if (emblem) sequence.fromTo(emblem, { y:10, rotation:-12, scale:.8 }, { y:0, rotation:0, scale:1, duration:.85, ease:'elastic.out(1,.55)' }, 0);
      if (badge) sequence.fromTo(badge, { y:7, opacity:0 }, { y:0, opacity:1, duration:.35 }, .18);
      if (reward) sequence.fromTo(reward, { y:7, opacity:0 }, { y:0, opacity:1, duration:.35 }, .3);
    });
    return () => media.revert();
  }, [earned, item.id, loading, error]);
  const concealed = !earned && item.visibility === 'hidden';
  const partial = !earned && item.visibility === 'partial';
  const title = concealed ? 'Secret achievement' : item.title;
  const description = concealed ? 'Keep exploring. This achievement reveals itself when earned.' : partial ? item.hint || 'A clue will reveal the next step.' : item.description;
  const total = Number.isFinite(item.target) && item.target > 0 ? item.target : 1;
  const value = Number.isFinite(item.progress) ? Math.max(0, Math.min(total,item.progress)) : 0;
  const amount = `${new Intl.NumberFormat(locale).format(value)} / ${new Intl.NumberFormat(locale).format(total)}`;
  const hasProgress = !concealed && progressDisplay !== 'none' && item.progress !== undefined;
  const unavailable = ['locked','expired','unavailable'].includes(item.state);
  const tone = earned ? 'success' : item.state === 'expired' ? 'warning' : 'neutral';
  return <Card ref={card} variant={presentation === 'badge' || presentation === 'row' ? 'outline' : 'elevated'} size={size} className={`duoop-achievement ${className}`} data-state={item.state} data-presentation={presentation} data-size={size} data-concealed={concealed} aria-label={title} loading={loading}>
    {error ? <div className="achievement-error"><ExperienceIcon name="error" /><p role="alert">{error}</p>{onRetry && <Button variant="outline" size="sm" onClick={onRetry}>Try again</Button>}</div> : <>
      <div className="achievement-heading"><AchievementEmblem icon={unavailable && !concealed ? 'lock' : item.icon || 'trophy'} visual={visual} concealed={concealed} /><div className="achievement-copy">{item.tier && !concealed && <p className="achievement-eyebrow">{item.tier} / {item.rarity || 'MILESTONE'}</p>}<h4>{title}</h4>{presentation !== 'badge' && description && <p>{description}</p>}<Badge tone={tone} size="sm" leading={<ExperienceIcon name={earned ? 'success' : unavailable ? 'lock' : 'spark'} />}>{item.stateLabel || achievementStates[item.state] || achievementStates.available}</Badge></div></div>
      {hasProgress && <div className="achievement-progress">{progressDisplay === 'count' ? <p className="achievement-quantity" aria-label={`${title}: ${amount}`}><strong>{amount}</strong><span>{item.unit || 'completed'}</span></p> : progressDisplay === 'checklist' ? <ul className="achievement-checklist">{(item.criteria || []).map(criterion => <li key={criterion.label}><Checkbox label={criterion.label} checked={criterion.complete} readOnly /></li>)}</ul> : <><p className="achievement-progress-label"><span>{item.progressLabel || `${title} progress`}</span><span>{amount}</span></p><Progress label={item.progressLabel || `${title} progress`} hideLabel value={value} max={total} shape={progressDisplay === 'ring' ? 'circular' : 'linear'} state={earned ? 'success' : unavailable ? 'paused' : 'running'} display="none" size={size}>{progressDisplay === 'ring' ? <strong>{amount}</strong> : null}</Progress></>}</div>}
      {presentation === 'detailed' && !concealed && <dl className="achievement-metadata">{[[ 'Criteria',item.condition ],[ 'Availability',item.availability ],[ 'Attribution',item.attribution ],[ 'Repeats',item.repetition ],[ 'Rarity',item.rarity ],[ 'Unlocked',item.unlockedAt ? new Intl.DateTimeFormat(locale, { dateStyle:'medium', timeZone:'UTC' }).format(new Date(item.unlockedAt)) : null ]].filter(([,value]) => value).map(([name,value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl>}
      {(item.reward && !concealed || onDetails || item.state === 'claimable' && onClaim) && <div className="achievement-footer">{item.reward && !concealed && <span className="achievement-reward"><ExperienceIcon name="gift" />{item.reward}</span>}<div className="experience-actions">{onDetails && <Button size="sm" variant="outline" onClick={onDetails} aria-label={`Details: ${title}`}>Details</Button>}{item.state === 'claimable' && onClaim && <Button size="sm" status={claimStatus} onClick={onClaim}>Claim reward</Button>}</div></div>}
      {claimStatus === 'error' && <p className="achievement-claim-error" role="alert">Reward could not be claimed. Your achievement is safe; retry to claim it.</p>}
    </>}
  </Card>;
}

export function AchievementCollection({ items, layout = 'grid', onDetails, ...props }) {
  return <ul className="achievement-collection" data-layout={layout} aria-label="Achievement collection">{items.map(item => <li key={item.id}><Achievement {...props} item={item} presentation={layout === 'list' ? 'row' : props.presentation || 'card'} onDetails={onDetails ? () => onDetails(item) : undefined} /></li>)}</ul>;
}

export function AchievementSummary({ items, locale = 'en' }) {
  const earned = items.filter(item => isAchievementEarned(item.state)).length;
  return <div className="achievement-summary"><span className="achievement-summary-icon"><ExperienceIcon name="trophy" /></span><div><strong>{new Intl.NumberFormat(locale).format(earned)} of {new Intl.NumberFormat(locale).format(items.length)} unlocked</strong><Progress label="Collection progress" value={earned} max={items.length || 1} display="none" size="sm" /></div></div>;
}

export function AchievementTiers({ items, ...props }) {
  return <ol className="achievement-tiers" aria-label="Achievement tiers">{items.map(item => <li key={item.id}><Achievement item={item} presentation="row" visual="icon" {...props} /></li>)}</ol>;
}

export function AchievementDetails({ item, open, onOpenChange, ...props }) {
  const title = item.visibility === 'hidden' && !isAchievementEarned(item.state) ? 'Secret achievement' : item.title;
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent><DialogHeader><DialogTitle>{title}</DialogTitle><DialogDescription>Criteria, progress and the reward for this achievement.</DialogDescription></DialogHeader><DialogBody><div className="feedback-surface experience-surface"><Achievement {...props} item={item} presentation="detailed" /></div></DialogBody></DialogContent></Dialog>;
}

function Celebration({ intensity }) {
  return intensity === 'confetti' ? <span className="achievement-confetti" aria-hidden="true">{Array.from({ length:12 }, (_, index) => <i key={index} style={{ '--confetti-x':`${(index % 6 - 2.5) * 32}px`, '--confetti-y':`${-65 - index % 3 * 18}px`, '--confetti-turn':`${index % 2 ? 160 : -140}deg`, '--confetti-delay':`${index % 3 * 25}ms` }} />)}</span> : null;
}

/** A separate, caller-triggered announcement; mounting a collection never celebrates. */
export function AchievementUnlock({ item, open, onOpenChange, mode = 'inline', celebration = 'brief', replayKey = 0, container, returnFocus }) {
  const close = () => onOpenChange?.(false);
  const body = <div className="achievement-unlock-body" data-celebration={celebration} key={replayKey}><Celebration intensity={celebration} /><AchievementEmblem icon={item.icon || 'trophy'} /><span className="experience-kicker">ACHIEVEMENT UNLOCKED</span><h4>{item.title}</h4><p>{item.reward || 'A milestone worth keeping.'}</p></div>;
  if (mode === 'dialog') return <Dialog open={open} onOpenChange={onOpenChange} size="sm"><DialogContent><DialogHeader><DialogTitle>A moment well earned.</DialogTitle><DialogDescription>Your progress has unlocked a new achievement.</DialogDescription></DialogHeader><DialogBody><div className="feedback-surface experience-surface">{body}</div></DialogBody><DialogFooter><Button onClick={close}>Keep going</Button></DialogFooter></DialogContent></Dialog>;
  if (!open) return null;
  if (mode === 'toast') return createPortal(<div className="achievement-toast feedback-surface experience-surface" role="status" key={replayKey}><Toast toast={{ id:'achievement', title:`Unlocked: ${item.title}`, description:item.reward, status:'success', returnFocus }} onDismiss={close} /></div>, container || document.body);
  return <div className="achievement-unlock" data-mode={mode} data-celebration={celebration} role="status">{body}<Button size="sm" variant="outline" onClick={close}>Keep going</Button></div>;
}
