import { Button } from '../Button/Button';
import React, { useRef, useState } from 'react';
import { Input, Field } from './Input';
import {
  AdjacentInput,
  EmailForm,
  UsernameForm,
  HelpLinkField,
  GroupedFields,
} from './FormDemos';
import { CodeBlock, SourceFiles, ExampleSource } from '../Button/Documentation';
import componentSource from './Input.jsx?raw';
import cssSource from './Forms.css?raw';
import demoSource from './FormDemos.jsx?raw';
import { enrichedConfigs, enrichedFiles } from './EnrichedExamples';
import { numericConfigs } from './NumericExamples';
export const inputEntry = {
  id: 'builtin-input',
  name: 'Input',
  category: 'Forms',
  notes: 'Simple inputs with tactile borders, three sizes, native types, and composition.',
};
export const fieldEntry = {
  id: 'builtin-field',
  name: 'Field',
  category: 'Forms',
  notes: 'Labels, help text, and accessible validation for your forms.',
};
const inputCode = (props) =>
  `<Input ${Object.entries(props)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ')} />`;
const simple = (title, group, props) => ({
  title,
  group,
  props,
  code: inputCode(props),
});
const inputExamples = [
  ...[
    ['Small', 'sm'],
    ['Standard', 'default'],
    ['Large', 'lg'],
  ].map(([title, size]) =>
    simple(title, 'Sizes', {
      size,
      'aria-label': `${title} input`,
      placeholder: `${title} input`,
    }),
  ),
  simple('Empty', 'Content', {
    'aria-label': 'Empty input',
  }),
  simple('Placeholder', 'Content', {
    'aria-label': 'Your name',
    placeholder: 'Your name',
  }),
  simple('Filled', 'Content', {
    'aria-label': 'Your name',
    defaultValue: 'Alex Morgan',
  }),
  ...[
    ['Text', 'text', 'Your name'],
    ['Email', 'email', 'you@example.com'],
    ['Password', 'password', 'Enter a password'],
    ['Search', 'search', 'Search components…'],
    ['Phone', 'tel', '+33 6 12 34 56 78'],
    ['URL', 'url', 'https://example.com'],
  ].map(([title, type, placeholder]) =>
    simple(title, 'Input types', {
      type,
      'aria-label': title,
      placeholder,
    }),
  ),
  simple('Native file picker', 'File', {
    type: 'file',
    'aria-label': 'Choose a file',
  }),
  simple('Disabled', 'States', {
    disabled: true,
    'aria-label': 'Disabled input',
    placeholder: 'Unavailable',
  }),
  simple('Accessible name', 'Presentation', {
    'aria-label': 'Project name',
    placeholder: 'Project name',
  }),
  {
    title: 'With label',
    group: 'Presentation',
    field: {
      label: 'Project name',
    },
    props: {
      placeholder: 'My project',
    },
  },
  {
    title: 'Adjacent button',
    group: 'Presentation',
    Demo: AdjacentInput,
  },
  {
    title: 'Form integration',
    group: 'Presentation',
    Demo: EmailForm,
  },
];
const fieldExamples = [
  {
    title: 'Label',
    group: 'Labels',
    field: {
      label: 'Display name',
    },
    props: {
      placeholder: 'Alex Morgan',
    },
  },
  {
    title: 'Required',
    group: 'Labels',
    field: {
      label: 'Display name',
      required: true,
    },
    props: {
      placeholder: 'Your name',
    },
  },
  {
    title: 'Optional',
    group: 'Labels',
    field: {
      label: 'Website',
      optional: true,
    },
    props: {
      type: 'url',
      placeholder: 'https://example.com',
    },
  },
  {
    title: 'Help text',
    group: 'Help',
    field: {
      label: 'Username',
      description: 'Use 3–20 letters, numbers, or underscores.',
    },
    props: {
      placeholder: 'alex_morgan',
      minLength: 3,
      maxLength: 20,
      pattern: '[A-Za-z0-9_]{3,20}',
    },
  },
  {
    title: 'Multiline help',
    group: 'Help',
    field: {
      label: 'Project name',
      description:
        'Choose a descriptive name that your entire team can recognize. It appears in invitations, reports, and shared project links. You can change it later in project settings.',
    },
    props: {
      placeholder: 'Website redesign',
    },
  },
  {
    title: 'Disabled field',
    group: 'States',
    field: {
      label: 'Team',
      description: 'Your administrator manages this value.',
    },
    props: {
      disabled: true,
      defaultValue: 'Design team',
    },
  },
  {
    title: 'Error only',
    group: 'Errors',
    field: {
      label: 'Email address',
      error: 'Enter a valid email, such as you@example.com.',
    },
    props: {
      type: 'email',
      defaultValue: 'alex@',
      readOnly: true,
    },
  },
  {
    title: 'Help with error',
    group: 'Errors',
    field: {
      label: 'Username',
      description: 'Use 3–20 letters, numbers, or underscores.',
      error: 'Spaces are not allowed. Replace them with underscores.',
    },
    props: {
      defaultValue: 'alex morgan',
      readOnly: true,
    },
  },
  {
    title: 'Long error',
    group: 'Errors',
    field: {
      label: 'Workspace name',
      error:
        'This workspace name is already used by another team in your organization. Add a department or location to create a unique name, then submit again.',
    },
    props: {
      defaultValue: 'Design',
      readOnly: true,
    },
  },
  {
    title: 'Validation success',
    group: 'Validation',
    field: {
      label: 'Username',
      success: 'This username is available.',
    },
    props: {
      defaultValue: 'alex_morgan',
      readOnly: true,
    },
  },
  {
    title: 'Required and email format',
    group: 'Validation',
    Demo: EmailForm,
  },
  {
    title: 'Length and business validation',
    group: 'Validation',
    Demo: UsernameForm,
  },
  {
    title: 'Label above',
    group: 'Placement',
    field: {
      label: 'Project name',
    },
    props: {
      placeholder: 'My project',
    },
  },
  {
    title: 'Responsive label',
    group: 'Placement',
    field: {
      label: 'Project name',
      orientation: 'horizontal',
      description: 'Label on the left from 768px; above on mobile.',
    },
    props: {
      placeholder: 'My project',
    },
  },
  {
    title: 'Long label',
    group: 'Content',
    field: {
      label: 'Email address of the person responsible for approving project changes',
    },
    props: {
      type: 'email',
      placeholder: 'you@example.com',
    },
  },
  {
    title: 'Long translation',
    group: 'Content',
    field: {
      label: (
        <span lang="de">
          E-Mail-Adresse der verantwortlichen Ansprechperson für Projektfreigaben
        </span>
      ),
      description: (
        <span lang="de">
          An diese Adresse senden wir alle Benachrichtigungen zu ausstehenden Projektfreigaben.
        </span>
      ),
    },
    props: {
      type: 'email',
      placeholder: 'name@example.com',
    },
    code: '<Field label={<span lang="de">E-Mail-Adresse der verantwortlichen Ansprechperson für Projektfreigaben</span>} description={<span lang="de">An diese Adresse senden wir alle Benachrichtigungen zu ausstehenden Projektfreigaben.</span>}>\n  <Input type="email" placeholder="name@example.com" />\n</Field>',
  },
  {
    title: 'Help with a link',
    group: 'Content',
    Demo: HelpLinkField,
  },
  {
    title: 'Common legend',
    group: 'Grouping',
    Demo: GroupedFields,
  },
  ...[
    ['Small', 'sm'],
    ['Standard', 'default'],
    ['Large', 'lg'],
  ].map(([title, size]) => ({
    title,
    group: 'Input sizes',
    field: {
      label: 'Project name',
    },
    props: {
      size,
      placeholder: 'My project',
    },
  })),
];
function source(item) {
  if (item.code) return item.code;
  if (item.Demo) {
    const name = Object.entries({
      AdjacentInput,
      EmailForm,
      UsernameForm,
      HelpLinkField,
      GroupedFields,
    }).find(([, component]) => component === item.Demo)[0];
    return `import { ${name} } from './FormDemos';\n\n<${name} />`;
  }
  return `<Field ${Object.entries(item.field)
    .map(([key, value]) => `${key}={${JSON.stringify(value)}}`)
    .join(' ')}>\n  ${inputCode(item.props)}\n</Field>`;
}
function Preview({ item }) {
  if (item.Demo) return <item.Demo />;
  const input = <Input {...item.props} />;
  return item.field ? <Field {...item.field}>{input}</Field> : input;
}
export function FormsShowcase({ kind }) {
  const config = numericConfigs[kind] || enrichedConfigs[kind];
  const entry = config?.entry || (kind === 'input' ? inputEntry : fieldEntry);
  const examples = config?.examples || (kind === 'input' ? inputExamples : fieldExamples);
  const groups = [...new Set(examples.map((item) => item.group))];
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const visible = examples.filter((item) => filter === 'All' || item.group === filter);
  const api =
    config?.api ||
    (kind === 'input'
      ? [
          ['size', 'sm · default · lg; number for native width', 'default'],
          ['type', 'Native input types, including file', 'text'],
          ['disabled / required / readOnly', 'Native boolean attributes', 'false'],
          ['value / defaultValue / onChange', 'Standard React input behavior', '—'],
          ['aria-label / id / name / ref', 'Forwarded to the native input', '—'],
        ]
      : [
          ['label', 'Visible label linked to the input; accepts React content', 'Required'],
          ['description', 'Help linked with aria-describedby; accepts links', '—'],
          ['error', 'Message, aria-invalid, and live announcement', '—'],
          ['success', 'Confirmation message; error takes precedence', '—'],
          [
            'required / disabled',
            'Inherited from Input; explicit Field value takes precedence',
            'Input value',
          ],
          ['optional', 'Optional indication unless required', 'false'],
          [
            'orientation',
            'vertical · horizontal (left from 768px, above on mobile)',
            'vertical',
          ],
          ['children', 'One control accepting native input props', 'Required'],
          ['id', 'Control ID; automatically generated if omitted', 'useId'],
        ]);
  return (
    <article className="button-showcase forms-showcase" aria-labelledby={`${kind}-name`}>
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">COMPONENTS / FORMS</span>
            <h2 id={`${kind}-name`}>{entry.name}</h2>
            <p>{entry.notes}</p>
          </div>
          <a className="secondary" href={`#${kind}-source`}>
            Source code ↗
          </a>
        </header>
        <section className="component-gallery doc-section" id={`${kind}-preview`}>
          <div className="gallery-heading">
            <div>
              <h3>Examples</h3>
              <p>Explore each variant, try an input, and copy its code.</p>
            </div>
            <a href={`#${kind}-usage`}>Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div
              className="gallery-filters"
              role="group"
              aria-label={`Filter ${kind} examples`}
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
                <section
                  className="gallery-category"
                  key={group}
                  id={`${kind}-${group.toLowerCase().replaceAll(' ', '-')}`}
                >
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
                          className="gallery-card"
                          key={item.title}
                          aria-label={`${entry.name}: ${item.title}`}
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
                              aria-label={`View code: ${entry.name} ${item.title}`}
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
        <section className="doc-section" id={`${kind}-usage`}>
          <h3>Usage & accessibility</h3>
          <p>
            {config?.guidance ||
              (kind === 'textarea'
                ? 'Copy Textarea.jsx, Forms.css, and EnrichedForms.css. Use Field for a visible label. Automatic height follows content and width; fixed height keeps long text scrollable.'
                : config
                  ? 'Copy the component and stylesheet sources below. Give each control an accessible name. Addons follow the control in DOM order; visual placement is handled by CSS. Escape clears the keyboard-shortcut example.'
                  : 'Copy Input.jsx and Forms.css into the same folder. Both components depend only on React. Give a standalone Input an aria-label, or wrap it in Field for a linked label.')}
          </p>
          <CodeBlock
            label={`Using ${entry.name}`}
            code={
              config?.usage ||
              (kind === 'input'
                ? 'import { Input } from "./Input";\n\n<Input size="default" type="email" aria-label="Email" placeholder="you@example.com" />'
                : 'import { Input, Field } from "./Input";\n\n<Field label="Email" required description="Your contact address." error={error}>\n  <Input name="email" type="email" autoComplete="email" />\n</Field>')
            }
          />
          <div className="api-table">
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Values / behavior</th>
                  <th>Default</th>
                </tr>
              </thead>
              <tbody>
                {api.map((row) => (
                  <tr key={row[0]}>
                    {row.map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!config && (
            <p>
              Field presents validation supplied by its parent. Static error and success
              examples are read-only snapshots; use the validation forms to try correction and
              submission. Username rules are local demo rules, not an account availability
              check. Native file selection stays on your device. The demos send no data.
            </p>
          )}
          {config && (
            <p>
              {config.note ||
                (kind === 'textarea'
                  ? 'Examples run locally and send no data. Counters use native maxLength counting (UTF-16 code units). The form uses native required validation.'
                  : 'Examples run locally and send no data. URL copy uses your clipboard and reports failures. The loading example simulates a search for 1.2 seconds after submission.')}
            </p>
          )}
          <p>
            Coverage reference:{' '}
            <a
              href={`https://coss.com/ui/docs/components/${kind}`}
              target="_blank"
              rel="noreferrer"
            >
              coss ui {entry.name} ↗
            </a>
            .{' '}
            {kind === 'field' &&
              'Responsive placement, long content, and grouping are additional examples. This library uses its own React API. Group related fields with native fieldset and legend.'}
          </p>
        </section>
        <section className="doc-section" id={`${kind}-source`}>
          <h3>Source code</h3>
          <p>Copy the files used by your example, including its component and styles.</p>
          <SourceFiles
            files={
              config?.files ||
              (config
                ? enrichedFiles
                : [
                    ['Input.jsx', componentSource],
                    ['Forms.css', cssSource],
                    ['FormDemos.jsx', demoSource],
                  ])
            }
          />
        </section>
        <dialog
          className="example-dialog"
          ref={dialog}
          aria-labelledby={`${kind}-dialog-title`}
        >
          <div className="dialog-heading">
            <div>
              <span className="doc-eyebrow">{entry.name.toUpperCase()} EXAMPLE</span>
              <h2 id={`${kind}-dialog-title`}>{selected?.title}</h2>
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
                code={
                  selected.Demo
                    ? source(selected)
                    : `import { Input, Field } from './Input';\n\n${source(selected)}`
                }
                label={`${selected.title} · JSX`}
              />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
