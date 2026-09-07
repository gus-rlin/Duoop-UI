import { Button } from '../Button/Button';
import React, { useRef, useState } from 'react';
import { CodeBlock, SourceFiles, ExampleSource } from '../Button/Documentation';
import {
  SelectionExample,
  GroupExample,
  NestedExample,
  CheckboxForm,
  TableExample,
  InteractionExample,
  ThemeExample,
  DocumentIllustration,
} from './CheckboxDemos';
import componentSource from './Checkbox.jsx?raw';
import cssSource from './Checkbox.css?raw';
import demoSource from './CheckboxDemos.jsx?raw';
import demoCss from './CheckboxShowcase.css?raw';
import '../Button/showcase.css';
import './CheckboxShowcase.css';
export const checkboxEntry = {
  id: 'builtin-checkbox',
  name: 'Checkbox',
  category: 'Forms',
  notes:
    'Crisp checkmarks, short tactile transitions, and indeterminate states. Labels, cards, groups, nested selection, and accessible forms.',
};
const example = (title, group, props = {}) => ({
  title,
  group,
  Demo: SelectionExample,
  props: {
    label: 'Enable notifications',
    ...props,
  },
});
const composition = (title, group, Demo, props = {}, wide = false) => ({
  title,
  group,
  Demo,
  props,
  wide,
});
const examples = [
  example('Simple with label', 'Presentation'),
  example('With description', 'Presentation', {
    initial: 'checked',
    description: 'Receive updates about your project. You can change this at any time.',
  }),
  example('Entire clickable row', 'Presentation', {
    variant: 'row',
    label: 'Weekly project summary',
    badge: 'New',
  }),
  example('Checkbox after content', 'Presentation', {
    position: 'after',
    variant: 'row',
    label: 'Activity updates',
  }),
  example('Multiline label', 'Presentation', {
    label:
      'Notify me when a teammate updates a shared project or requests a review of my work',
  }),
  {
    title: 'Accessible name only',
    group: 'Presentation',
    Demo: SelectionExample,
    props: {
      'aria-label': 'Select this item',
    },
  },
  example('With icon and counter', 'Presentation', {
    label: 'Project files',
    icon: '▤',
    badge: '12',
    initial: 'checked',
  }),
  {
    ...example('With illustration', 'Presentation', {
      label: 'Include project brief',
      description: 'The context behind your next great project.',
      badge: 'PDF · 4 pages',
      variant: 'card',
      illustration: <DocumentIllustration />,
    }),
    code: 'import { Checkbox } from \'./Checkbox\';\nimport { DocumentIllustration } from \'./CheckboxDemos\';\n\n<Checkbox label="Include project brief" variant="card" description="The context behind your next great project." badge="PDF · 4 pages" illustration={<DocumentIllustration />} />',
  },
  ...[
    ['unchecked', 'Unchecked'],
    ['checked', 'Checked'],
    ['mixed', 'Indeterminate'],
  ].map(([initial, title]) =>
    example(title, 'Selection', {
      initial,
    }),
  ),
  ...[
    ['unchecked', 'Disabled unchecked'],
    ['checked', 'Disabled checked'],
    ['mixed', 'Disabled indeterminate'],
  ].map(([initial, title]) =>
    example(title, 'Availability', {
      initial,
      disabled: true,
    }),
  ),
  example('Read only', 'Availability', {
    initial: 'checked',
    readOnly: true,
  }),
  example('Optional', 'Validation', {
    optional: true,
  }),
  example('Required', 'Validation', {
    required: true,
    label: 'Accept terms and conditions',
  }),
  example('Invalid unchecked', 'Validation', {
    readOnly: true,
    label: 'Accept terms',
    error: 'Accept the terms to continue.',
  }),
  example('Invalid checked', 'Validation', {
    readOnly: true,
    initial: 'checked',
    label: 'Publish externally',
    error: 'External publishing is unavailable for this workspace.',
  }),
  ...[
    ['sm', 'Small'],
    ['default', 'Standard'],
    ['lg', 'Large'],
  ].map(([size, title]) =>
    example(title, 'Sizes', {
      size,
      initial: 'checked',
    }),
  ),
  ...[
    ['Unselected card', {}],
    [
      'Selected card',
      {
        initial: 'checked',
      },
    ],
    [
      'Disabled card',
      {
        disabled: true,
      },
    ],
    [
      'Selected disabled card',
      {
        initial: 'checked',
        disabled: true,
      },
    ],
    [
      'Indeterminate disabled card',
      {
        initial: 'mixed',
        disabled: true,
      },
    ],
    [
      'Invalid card',
      {
        readOnly: true,
        error: 'Select this option to continue.',
      },
    ],
    [
      'Selected invalid card',
      {
        readOnly: true,
        initial: 'checked',
        error: 'This option is incompatible with your plan.',
      },
    ],
  ].map(([title, props]) =>
    example(title, 'Cards', {
      variant: 'card',
      label: 'Project notifications',
      description: 'Stay informed about your team’s activity.',
      ...props,
    }),
  ),
  composition('Vertical group', 'Groups', GroupExample),
  composition(
    'Horizontal wrapping',
    'Groups',
    GroupExample,
    {
      layout: 'horizontal',
    },
    true,
  ),
  composition(
    'Grid of cards',
    'Groups',
    GroupExample,
    {
      layout: 'grid',
      cards: true,
    },
    true,
  ),
  composition('Disabled option', 'Groups', GroupExample, {
    disabledOption: true,
    initial: ['design', 'research'],
  }),
  composition('Entire group disabled', 'Groups', GroupExample, {
    disabled: true,
  }),
  ...[
    ['None selected', []],
    ['Partially selected', ['design']],
    ['All selected', ['design', 'engineering', 'research']],
  ].map(([title, initial]) =>
    composition(title, 'Parent selection', GroupExample, {
      parent: true,
      initial,
    }),
  ),
  composition('Parent with disabled child', 'Parent selection', GroupExample, {
    parent: true,
    disabledOption: true,
    initial: ['research'],
  }),
  composition('Nested parents', 'Parent selection', NestedExample, {}, true),
  composition('Required checkbox form', 'Contexts', CheckboxForm),
  composition('Group form', 'Contexts', CheckboxForm, {
    group: true,
  }),
  composition('Table row selection', 'Contexts', TableExample, {}, true),
  composition('Hover, press & keyboard focus', 'Interaction', InteractionExample, {}, true),
  composition('Light theme', 'Theme & direction', ThemeExample),
  composition('Dark theme', 'Theme & direction', ThemeExample, {
    dark: true,
  }),
  composition('Right to left', 'Theme & direction', ThemeExample, {
    rtl: true,
  }),
  composition('Dark & right to left', 'Theme & direction', ThemeExample, {
    rtl: true,
    dark: true,
  }),
];
function source(item) {
  if (item.code) return item.code;
  const name = Object.entries({
    SelectionExample,
    GroupExample,
    NestedExample,
    CheckboxForm,
    TableExample,
    InteractionExample,
    ThemeExample,
  }).find(([, component]) => component === item.Demo)[0];
  return `import { ${name} } from './CheckboxDemos';\n\n<${name}${Object.entries(item.props)
    .map(([key, value]) => ` ${key}={${JSON.stringify(value)}}`)
    .join('')} />`;
}
function Preview({ item }) {
  return <item.Demo {...item.props} />;
}
const api = [
  [
    'label / description',
    'Visible clickable label and linked help text. Omit label only with aria-label.',
  ],
  [
    'checked / defaultChecked / onChange',
    'Native controlled or uncontrolled boolean selection. onChange receives the input event.',
  ],
  [
    'indeterminate',
    'Controlled partial selection, derived from children; overrides the visual checkmark.',
  ],
  ['variant / position', 'plain · row · card / before · after'],
  ['size', 'sm · default · lg (16 / 20 / 24 px; label target at least 44 px tall)'],
  [
    'disabled / readOnly',
    'Disabled skips keyboard and form submission. Read only preserves focus and submission while blocking activation.',
  ],
  [
    'error / required / optional',
    'Linked error message, native required validation, explicit obligation label.',
  ],
  [
    'icon / badge / illustration',
    'Optional content. Icons and illustrations are decorative; describe their meaning in the label.',
  ],
  [
    'name / value / ref / native attributes',
    'Forwarded to the input. Only checked enabled inputs are submitted.',
  ],
  [
    'CheckboxGroup',
    'Native fieldset: legend, description, error, disabled, layout (vertical · horizontal · grid).',
  ],
  [
    'selectionState / toggleSelection',
    'Derive parent state and update a set of descendants; pass actionable values to preserve disabled children.',
  ],
];
export function CheckboxShowcase() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const groups = [...new Set(examples.map((item) => item.group))];
  const visible = examples.filter((item) => filter === 'All' || item.group === filter);
  return (
    <article className="button-showcase checkbox-showcase" aria-labelledby="checkbox-name">
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">03 / FORMS</span>
            <h2 id="checkbox-name">Checkbox</h2>
            <p>{checkboxEntry.notes}</p>
          </div>
          <a className="secondary" href="#checkbox-source">
            Source code ↗
          </a>
        </header>
        <section className="component-gallery doc-section" id="checkbox-preview">
          <div className="gallery-heading">
            <div>
              <h3>Examples</h3>
              <p>
                Explore presentations, states, and compositions. Click a label or use Tab and
                Space.
              </p>
            </div>
            <a href="#checkbox-usage">Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div
              className="gallery-filters"
              role="group"
              aria-label="Filter checkbox examples"
            >
              {['All', ...groups].map((group) => (
                <Button
                  key={group}
                  size="sm" variant={filter === group ? "solid" : "outline"} selected={filter === group}
                  onClick={() => setFilter(group)}
                >
                  {group}
                </Button>
              ))}
            </div>
            <span role="status">{visible.length} examples</span>
          </div>
          <div className="gallery-groups">
            {groups
              .filter((group) => visible.some((item) => item.group === group))
              .map((group) => (
                <section className="gallery-category" key={group}>
                  <div className="gallery-category-heading">
                    <h4>{group}</h4>
                    <span>
                      {visible.filter((item) => item.group === group).length} examples
                    </span>
                  </div>
                  <div className="gallery-grid">
                    {visible
                      .filter((item) => item.group === group)
                      .map((item) => (
                        <article
                          key={item.title}
                          className={`gallery-card ${item.wide ? 'gallery-card--wide' : ''}`}
                          aria-label={`Checkbox: ${item.title}`}
                        >
                          <div className="gallery-card-preview">
                            <Preview item={item} />
                          </div>
                          <div className="gallery-card-info">
                            <h5>{item.title}</h5>
                            <span>{group}</span>
                          </div>
                          <div className="gallery-card-actions">
                            <button
                              aria-label={`View code: Checkbox ${item.title}`}
                              onClick={() => {
                                setSelected(item);
                                dialog.current.showModal();
                              }}
                            >
                              View code <span aria-hidden="true">↗</span>
                            </button>
                          </div>
                        </article>
                      ))}
                  </div>
                </section>
              ))}
          </div>
        </section>
        <section className="doc-section" id="checkbox-usage">
          <h3>Usage & accessibility</h3>
          <p>
            Copy Checkbox.jsx and Checkbox.css into the same folder. The primitives depend only
            on React. Use a visible label or an accessible name, and fieldset legends for
            related options.
          </p>
          <CodeBlock
            label="Using Checkbox"
            code={
              'import { Checkbox, CheckboxGroup } from "./Checkbox";\n\n<CheckboxGroup legend="Notifications">\n  <Checkbox name="channels" value="email" label="Email" defaultChecked />\n  <Checkbox name="channels" value="push" label="Push" description="Updates on your device." />\n</CheckboxGroup>'
            }
          />
          <div className="api-table">
            <table>
              <thead>
                <tr>
                  <th>Prop / component</th>
                  <th>Behavior</th>
                </tr>
              </thead>
              <tbody>
                {api.map((row) => (
                  <tr key={row[0]}>
                    {row.map((cell, index) => (
                      <td key={index}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Indeterminate represents partial selection. A parent selects all available
            descendants or clears them; it does not cycle through three states. Disabled
            children keep their selection. Static error examples are read-only snapshots; the
            forms demonstrate correction, submission, and reset locally.
          </p>
          <p>
            Hover, press, and keyboard focus are live interactions in every selection state.
            Check and border transitions take 100–160 ms and stop with prefers-reduced-motion.
            Theme tokens support dark surfaces; logical spacing supports right-to-left text.
            For dark mode, use a checkbox-surface wrapper with data-theme="dark".
          </p>
          <p>
            Coverage references:{' '}
            <a
              href="https://coss.com/ui/docs/components/checkbox"
              target="_blank"
              rel="noreferrer"
            >
              coss ui Checkbox ↗
            </a>{' '}
            and{' '}
            <a
              href="https://coss.com/ui/docs/components/checkbox-group"
              target="_blank"
              rel="noreferrer"
            >
              Checkbox Group ↗
            </a>
            . The expanded states, sizes, content, tables, and themes belong to this catalogue.
            This implementation uses its own React API.
          </p>
        </section>
        <section className="doc-section" id="checkbox-source">
          <h3>Source code</h3>
          <p>
            The demos also use CheckboxDemos.jsx, CheckboxShowcase.css, and the existing Button
            component (Button.jsx, Button.css, buttonColor.js). Copy the matching demo export
            with the component sources.
          </p>
          <SourceFiles
            files={[
              ['Checkbox.jsx', componentSource],
              ['Checkbox.css', cssSource],
              ['CheckboxDemos.jsx', demoSource],
              ['CheckboxShowcase.css', demoCss],
            ]}
          />
        </section>
        <dialog
          className="example-dialog"
          ref={dialog}
          aria-labelledby="checkbox-dialog-title"
        >
          <div className="dialog-heading">
            <div>
              <span className="doc-eyebrow">CHECKBOX EXAMPLE</span>
              <h2 id="checkbox-dialog-title">{selected?.title}</h2>
            </div>
            <button
              className="close"
              aria-label="Close example"
              onClick={() => dialog.current.close()}
            >
              ×
            </button>
          </div>
          {selected && (
            <>
              <ExampleSource
                key={selected.title}
                code={source(selected)}
                label={`${selected.title} · JSX`}
              />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
