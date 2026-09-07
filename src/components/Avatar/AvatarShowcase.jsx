import React from 'react';
import { CatalogShowcase } from '../CatalogShowcase';
import { AvatarDemo, AvatarPlayground, avatarExamples } from './AvatarDemos';
import component from './Avatar.jsx?raw';
import css from './Avatar.css?raw';
import demos from './AvatarDemos.jsx?raw';
import showcaseCss from './AvatarShowcase.css?raw';

export const avatarEntry = { id: 'builtin-avatar', name: 'Avatar', category: 'Other', notes: 'Familiar faces in tactile frames. Portraits, initials, presence and team stacks with a little depth.' };

export function AvatarShowcase() {
  return <CatalogShowcase entry={avatarEntry} number="28" examples={avatarExamples} Demo={AvatarDemo} playground={<AvatarPlayground />}
    accessibility="Nine examples. Four sizes, resilient image fallbacks, meaningful presence and keyboard-operated selection."
    usage={<>Inspired by <a href="https://coss.com/ui/docs/components/avatar" target="_blank" rel="noreferrer">Coss UI Avatar</a>: image, fallback, sizes and groups. Adapted to Duoop-UI with rounded square frames, dark contours and short shadows. Portraits in these demos load from Unsplash; initials remain visible while loading or after failure. Wrap an avatar in a native button when it performs an action.</>}
    usageCode={'import { Avatar, AvatarGroup } from \'./components/Avatar/Avatar\';\n\n<Avatar name="Jordan Lee" src="/jordan.jpg" size="lg" status="online" />\n<AvatarGroup label="Design team">\n  <Avatar name="Jordan Lee" />\n  <Avatar name="Alex Morgan" />\n</AvatarGroup>'}
    api={[
      ['name / fallback', 'Accessible identity; up to two initials are derived from name. Supply fallback to override the visible text.'],
      ['src / loading', 'Optional image URL; loading is eager by default or lazy. The image stays mounted while loading, then fades in. Failed images keep their fallback. Changing src resets image state.'],
      ['size', 'sm (32), md (48, default), lg (64), xl (88 pixels). All sizes preserve the tactile frame.'],
      ['status', 'Optional online, busy or away. Each uses a distinct SVG symbol and is included in the accessible name.'],
      ['AvatarGroup', 'Overlapping avatars in logical reading order. label names the group. Inherits right-to-left direction.'],
      ['Interaction / motion', 'Avatar is a non-interactive image. Native buttons own selection, disabled state and keyboard focus. The supplied avatar-choice class adds lift, compression and an interior solid focus border. Reduced motion removes displacement.'],
      ['Theme / className', 'Inherits the existing feedback-surface theme tokens. className and standard span attributes are forwarded.'],
    ]} sources={[[ 'Avatar.jsx', component ], [ 'Avatar.css', css ], [ 'AvatarDemos.jsx', demos ], [ 'AvatarShowcase.css', showcaseCss ]]} />;
}
