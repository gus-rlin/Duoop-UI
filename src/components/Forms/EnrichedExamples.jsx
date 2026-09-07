import React from 'react';
import { GroupDemo, MultilineDemo, TextareaDemo } from './EnrichedDemos';
import groupSource from './InputGroup.jsx?raw';
import textareaSource from './Textarea.jsx?raw';
import enrichedCss from './EnrichedForms.css?raw';
import enrichedDemos from './EnrichedDemos.jsx?raw';
import inputSource from './Input.jsx?raw';
import formsCss from './Forms.css?raw';

export const inputGroupEntry = { id: 'builtin-input-group', name: 'Input Group', category: 'Forms', notes: 'Enriched inputs with icons, text, actions, and tactile focus feedback.' };
export const textareaEntry = { id: 'builtin-textarea', name: 'Textarea', category: 'Forms', notes: 'Multiline writing with flexible heights, character limits, and integrated actions.' };
const groupItems = [
  ['Start icon', 'Icons', 'start-icon'], ['End icon', 'Icons', 'end-icon'], ['Both icons', 'Icons', 'both-icons'],
  ['Prefix', 'Integrated text', 'prefix'], ['Suffix', 'Integrated text', 'suffix'], ['Prefix and suffix', 'Integrated text', 'both-text'],
  ['Icon button', 'Actions', 'icon-button'], ['Text button', 'Actions', 'text-button'],
  ['Tooltip', 'Information', 'tooltip'], ['Badge', 'Information', 'badge'], ['Keyboard shortcut', 'Information', 'shortcut'],
  ['Inner label', 'Composition', 'label'], ['Loading indicator', 'Composition', 'loading'], ['Number with unit', 'Composition', 'number'],
  ['Search with clear', 'Use cases', 'clear'], ['Reveal password', 'Use cases', 'password'], ['URL with copy', 'Use cases', 'copy'], ['Amount with currency', 'Use cases', 'amount'], ['Message with send', 'Use cases', 'send'],
];
const wrap = (title, group, Component, props) => ({ title, group, Demo: () => <Component {...props} />, code: `import { ${(Component === GroupDemo ? 'GroupDemo' : Component === MultilineDemo ? 'MultilineDemo' : 'TextareaDemo')} } from './EnrichedDemos';\n\n<${(Component === GroupDemo ? 'GroupDemo' : Component === MultilineDemo ? 'MultilineDemo' : 'TextareaDemo')} ${Object.entries(props).map(([key, value]) => `${key}=${JSON.stringify(value)}`).join(' ')} />` });
const sizes = [['Small', 'sm'], ['Standard', 'default'], ['Large', 'lg']];
export const enrichedConfigs = {
  'input-group': {
    entry: inputGroupEntry,
    examples: [...groupItems.map(([title, group, variant]) => wrap(title, group, GroupDemo, { variant })), ...['top', 'bottom'].map(position => wrap(`Elements at the ${position}`, 'Multiline', MultilineDemo, { position })), ...sizes.map(([title, size]) => wrap(title, 'Sizes', GroupDemo, { size }))],
    usage: `import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from './InputGroup';\n\n<InputGroup>\n  <InputGroupInput aria-label="Website" placeholder="example.com" />\n  <InputGroupAddon><InputGroupText>https://</InputGroupText></InputGroupAddon>\n</InputGroup>`,
    api: [['InputGroup: size', 'sm · default · lg', 'default'], ['InputGroupAddon: align', 'inline-start · inline-end · block-start · block-end', 'inline-start'], ['InputGroupInput / InputGroupTextarea', 'Native control props and refs', '—'], ['InputGroupText', 'Muted text or units', '—'], ['children', 'Compose a control followed by addons in DOM order', '—']],
  },
  textarea: {
    entry: textareaEntry,
    examples: [...sizes.map(([title, size]) => wrap(title, 'Sizes', TextareaDemo, { size })), ...[['Disabled', 'States', 'disabled'], ['With label', 'Presentation', 'label'], ['Form integration', 'Presentation', 'form'], ['Fixed height', 'Height', 'fixed'], ['Automatic height', 'Height', 'auto'], ['Vertical resize', 'Height', 'resize'], ['Character counter', 'Content', 'counter'], ['Limit reached', 'Content', 'limit'], ['Long text with scroll', 'Content', 'long'], ['Bottom actions', 'Actions', 'actions']].map(([title, group, variant]) => wrap(title, group, TextareaDemo, { variant }))],
    usage: `import { Textarea } from './Textarea';\nimport { Field } from './Input';\n\n<Field label="Message">\n  <Textarea autoSize placeholder="Write a message…" />\n</Field>`,
    api: [['size', 'sm · default · lg', 'default'], ['autoSize', 'Fits content on edits, controlled updates, and width changes', 'false'], ['resize', 'none · vertical; drag the bottom grip or use arrow keys (84–600px)', 'none'], ['rows / maxLength / disabled / required', 'Native textarea attributes', '—'], ['value / defaultValue / onChange / ref', 'Standard React textarea behavior', '—']],
  },
};
export const enrichedFiles = [['InputGroup.jsx', groupSource], ['Textarea.jsx', textareaSource], ['EnrichedForms.css', enrichedCss], ['EnrichedDemos.jsx', enrichedDemos], ['Input.jsx', inputSource], ['Forms.css', formsCss]];
