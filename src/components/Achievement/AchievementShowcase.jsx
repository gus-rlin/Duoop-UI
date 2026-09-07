import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { AchievementDemo, AchievementPlayground, achievementExamples } from './AchievementDemos';
import component from './Achievement.jsx?raw';
import illustration from './AchievementIllustration.jsx?raw';
import css from './Achievement.css?raw';
import demos from './AchievementDemos.jsx?raw';
import icons from '../Feedback/ExperienceIcon.jsx?raw';
import simulation from '../Feedback/useDemoRequest.js?raw';
import shared from '../Feedback/Experience.css?raw';

export const achievementEntry = { id:'builtin-achievement', name:'Achievement', category:'Other', notes:'Make progress worth keeping. Thirty examples of milestones, collectible badges and moments of celebration.' };
export function AchievementShowcase() {
  return <CatalogShowcase entry={achievementEntry} number="20" section="MILESTONES" examples={achievementExamples} Demo={AchievementDemo} playground={<AchievementPlayground />} wide={['Every achievement state','Long content']}
    accessibility="Persistent achievements explain the goal and its state. Unlock announcements are separate, explicitly triggered, dismissible, and respectful of reduced motion."
    usage="Achievement renders caller-owned progress and state; reaching the target never awards a reward by itself. The caller evaluates criteria, streak dates, prerequisites, team contributions and period boundaries. Keep hidden achievement details on the server if they must remain confidential: visual concealment is presentation only. Claiming reuses Button status; update the item to claimed only after success. Card, Badge, Progress, Checkbox, Toast and Dialog provide the shared behavior and visual language."
    usageCode={'import { Achievement } from \'./components/Achievement/Achievement\';\n\n<Achievement item={{\n  id: "first-steps", title: "First steps",\n  description: "Share three original notes.",\n  state: "progress", progress: 2, target: 3,\n  icon: "trophy", reward: "100 points"\n}} progressDisplay="bar" />'}
    api={[
      ['item','id, title, description, state, icon, progress, target, unit, reward; metadata is optional.'],
      ['item.state / stateLabel / progressLabel','locked · available · progress · unlocked · claimable · claimed · expired · unavailable. Optional labels translate state and progress wording.'],
      ['presentation / visual / size','badge · row · card · detailed; icon · medallion · illustration; sm · md · lg.'],
      ['progressDisplay / item.criteria','none · count · bar · ring · checklist. Criteria entries: { label, complete }.'],
      ['item.visibility / hint','visible (default) · hidden · partial. Hidden content reveals after earning; partial visibility shows a hint.'],
      ['item metadata','tier, rarity, condition, repetition, availability, attribution, unlockedAt (ISO date). locale formats dates and quantities.'],
      ['onClaim / claimStatus','Caller-owned async claim. idle · loading · error; change item.state to claimed after confirmation.'],
      ['loading / error / onRetry','Initial skeleton while loading; accessible error and retry action.'],
      ['AchievementCollection / AchievementTiers','Items in grid/list, or ordered tiers. onDetails(item) can open criteria for each entry.'],
      ['AchievementDetails / AchievementSummary','Controlled detail dialog; earned count and total progress.'],
      ['AchievementUnlock','item, open, onOpenChange. mode inline · toast · banner · dialog; celebration none · accent · brief · confetti.'],
      ['replayKey / container / returnFocus','Replay the explicit announcement; toast portal target (including a containing dialog) and triggering element for focus restoration. Toast persists until dismissed.'],
      ['Theme / motion','feedback-surface and experience-surface inherit semantic palettes. Reduced motion preserves state and removes confetti and spatial movement.'],
      ['Unlock choreography','Brief/confetti: perspective medal entrance, engraved inset, staggered text and a finite halo. Confetti follows an outward arc and fall. Accent stays subtle; none stays still.'],
      ['Earned transition','A newly earned persistent card animates its medallion, state badge and reward once. Mounting an earned collection does not celebrate; illustrations remain static.'],
    ]} sources={[[ 'Achievement.jsx',component ],[ 'AchievementIllustration.jsx',illustration ],[ 'Achievement.css',css ],[ 'AchievementDemos.jsx',demos ],[ 'ExperienceIcon.jsx',icons ],[ 'useDemoRequest.js',simulation ],[ 'Experience.css',shared ]]} />;
}
