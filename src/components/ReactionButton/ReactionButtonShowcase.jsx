import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { ReactionButtonDemo, ReactionPlayground, reactionExamples } from './ReactionButtonDemos';
import component from './ReactionButton.jsx?raw';
import css from './ReactionButton.css?raw';
import demos from './ReactionButtonDemos.jsx?raw';
import icons from '../Feedback/ExperienceIcon.jsx?raw';
import simulation from '../Feedback/useDemoRequest.js?raw';
import shared from '../Feedback/Experience.css?raw';

export const reactionEntry = { id:'builtin-reaction-button', name:'Reaction Button', category:'Buttons', notes:'Appreciation with a tangible response. Twenty-five examples of likes, favorites, applause and shared reactions.' };
export function ReactionButtonShowcase() {
  return <CatalogShowcase entry={reactionEntry} number="19" section="BUTTONS" examples={reactionExamples} Demo={ReactionButtonDemo} playground={<ReactionPlayground />}
    accessibility="Toggle reactions expose aria-pressed. Repeated applause is an action with a quota. Every total has an exact accessible label, even when its visual format is abbreviated."
    usage="ReactionButton composes the existing Button, so size, press, focus and disabled behavior stay consistent. Supply a whole value object for controlled state, or defaultValue for local state. An optional onReact(next, { signal }) callback handles saving; rejection restores the previous value and allows retry. Honor the signal to cancel work when the component unmounts. Enforce identity, quotas and durable totals on your server. The catalogue's account and network examples are explicit local simulations."
    usageCode={'import { ReactionButton } from \'./components/ReactionButton/ReactionButton\';\n\n<ReactionButton kind="like" defaultValue={{ count:24 }} feedback="particles" />\n<ReactionButton kind="favorite" counter="hidden" />\n<ReactionButton kind="clap" action="repeat" quota={5} defaultValue={{ count:86 }} />'}
    api={[
      ['kind / icon / label / selectedLabel','like · favorite · clap · custom. Custom SVG icons and translated labels; identical labels keep wording stable.'],
      ['value / defaultValue / onValueChange','{ selected, count, contributions }. Callback receives the confirmed next value.'],
      ['action / quota','toggle · repeat; nonnegative contribution maximum or Infinity. Rapid clicks cannot overrun an in-flight request.'],
      ['onReact / update','Optional sync or async save callback; optimistic (default) or confirmed. Errors roll back and the same action retries.'],
      ['loading','Caller-owned initial loading state. Keeps the button geometry while replacing an unknown count with a dash.'],
      ['presentation / counter','icon-text · icon · text; integrated · separate · hidden. Icon-only totals render beside the control.'],
      ['format / cap / locale / zero','exact · compact · capped; default cap 99. Intl formatting. Zero: show · hide · invite.'],
      ['feedback / size / variant','instant · soft · pulse · particles; inherited Button size and variant. Reduced motion removes bursts and travel.'],
      ['disabled / readOnly / authRequired','Disabled action, informative total, or authentication gate. onAuthRequest opens the caller’s sign-in flow.'],
      ['ReactionGroup','items, value/defaultValue selected IDs, onValueChange, mode exclusive/multiple. Item counts exclude this viewer.'],
      ['ReactionPicker / AddReaction','Keyboard-operated anchored chooser. items and onSelect(item); reuses Button and useAnchoredOverlay.'],
      ['ReactionSummary / ReactionDetails','Top glyphs and total, optional onDetails; participant dialog with reaction filters.'],
      ['Dependencies','Button, Badge, Dialog, useAnchoredOverlay, FeedbackIcon and shared feedback palettes. No new packages.'],
    ]} sources={[[ 'ReactionButton.jsx',component ],[ 'ReactionButton.css',css ],[ 'ReactionButtonDemos.jsx',demos ],[ 'ExperienceIcon.jsx',icons ],[ 'useDemoRequest.js',simulation ],[ 'Experience.css',shared ]]} />;
}
