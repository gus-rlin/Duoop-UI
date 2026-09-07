import { Button } from '../Button/Button';
import React, { useRef, useState } from 'react';
import { CodeBlock, SourceFiles, ExampleSource } from '../Button/Documentation';
import {
  RadioDemo,
  SwitchDemo,
  StateLab,
  radioCompositions,
  switchCompositions,
} from './SelectionDemos';
import componentSource from './Selection.jsx?raw';
import cssSource from './Selection.css?raw';
import demoSource from './SelectionDemos.jsx?raw';
import demoCss from './SelectionShowcase.css?raw';
import '../Button/showcase.css';
import './SelectionShowcase.css';
export const radioEntry = {
  id: 'builtin-radio-group',
  name: 'Radio Group',
  category: 'Forms',
  notes:
    'One considered choice. Tactile radios, responsive cards, visual options, and accessible forms across 15 compositions.',
};
export const switchEntry = {
  id: 'builtin-switch',
  name: 'Switch',
  category: 'Forms',
  notes:
    'Small movements, clear decisions. Mechanical switches, settings, and honest save feedback across 13 compositions.',
};
const radioApi = [
  [
    'legend / name / options',
    'Group label, form field name and options: value, label, description, disabled, icon, badge, image, swatch, price, features. Values must be unique strings.',
  ],
  [
    'value / defaultValue / onChange',
    'Controlled or native uncontrolled exclusive selection. onChange receives the radio input event. Omit both values for no initial selection.',
  ],
  [
    'layout / variant / indicator',
    'vertical · horizontal · grid / plain · row · list · card / start · corner. Cards work in both columns and responsive grids.',
  ],
  [
    'description / error / required / disabled',
    'Help and errors are linked to the group and each radio. required applies native validation; disabled affects the entire fieldset.',
  ],
  [
    'children',
    'Associated conditional content, placed outside option labels. Keep interactive fields outside the label.',
  ],
];
const switchApi = [
  [
    'label / aria-label / description / error',
    'Clickable visible label or accessible name, associated help and error. Keep the accessible name stable as the value changes.',
  ],
  [
    'checked / defaultChecked / onChange',
    'Controlled or native uncontrolled boolean. onChange receives the input event; event.target.checked is the next value.',
  ],
  [
    'position / variant / size',
    'start · end / plain · row · card / sm · default · lg. These are catalogue sizes, not an official coss size scale. Targets remain at least 44 px tall.',
  ],
  [
    'icon / internalIcons / showState',
    'External setting icon, decorative track symbols, optional Enabled / Disabled text.',
  ],
  [
    'disabled / pending / required',
    'Disabled preserves the displayed value. Pending blocks interaction and shows a local spinner. Required uses native form validation.',
  ],
  [
    'name / value / ref / native input props',
    'Passed to the native checkbox with role=switch. Only enabled, checked controls are submitted.',
  ],
];
export function SelectionShowcase({ kind = 'radio' }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [layout, setLayout] = useState('grid');
  const dialog = useRef(null);
  const isRadio = kind === 'radio';
  const entry = isRadio ? radioEntry : switchEntry;
  const examples = isRadio ? radioCompositions : switchCompositions;
  const Demo = isRadio ? RadioDemo : SwitchDemo;
  const name = isRadio ? 'RadioDemo' : 'SwitchDemo';
  const slug = isRadio ? 'radio-group' : 'switch';
  const groups = ['Essentials', 'Surfaces', 'Contexts'];
  const source = (title) =>
    `import { ${name} } from './SelectionDemos';\n\n<${name} example=${JSON.stringify(title)}${isRadio ? ` layout="${layout}"` : ''} />`;
  return (
    <article className="button-showcase selection-showcase" aria-labelledby={`${slug}-name`}>
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">{isRadio ? '04' : '05'} / FORMS</span>
            <h2 id={`${slug}-name`}>{entry.name}</h2>
            <p>{entry.notes}</p>
          </div>
          <a className="secondary" href={`#${slug}-source`}>
            Source code ↗
          </a>
        </header>
        <section className="component-gallery doc-section">
          <div className="gallery-heading">
            <div>
              <h3>Examples</h3>
              <p>
                {isRadio
                  ? 'Choose one. Use Tab to enter a group, then the arrow keys to explore.'
                  : 'A binary setting. Click its label or use Tab and Space to change it.'}
              </p>
            </div>
            <a href={`#${slug}-usage`}>Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div className="gallery-filters" role="group" aria-label="Filter examples">
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
            <span role="status">
              {examples.filter(([, group]) => filter === 'All' || group === filter).length}{' '}
              compositions
            </span>
          </div>
          {isRadio && (
            <div className="selection-layout-toolbar">
              <span>Card arrangement</span>
              <div className="gallery-filters" role="group" aria-label="Card arrangement">
                {['grid', 'vertical'].map((mode) => (
                  <Button
                    key={mode}
                    size="sm" variant={layout === mode ? "solid" : "outline"} selected={layout === mode}
                    onClick={() => setLayout(mode)}
                  >
                    {mode === 'grid' ? 'Responsive grid' : 'Column'}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <div className="gallery-groups">
            {groups
              .filter((group) => filter === 'All' || group === filter)
              .map((group) => (
                <section className="gallery-category" key={group}>
                  <div className="gallery-category-heading">
                    <h4>{group}</h4>
                    <span>
                      {examples.filter(([, category]) => category === group).length}{' '}
                      compositions
                    </span>
                  </div>
                  <div className="gallery-grid">
                    {examples
                      .filter(([, category]) => category === group)
                      .map(([title]) => (
                        <article
                          key={title}
                          className={`gallery-card ${isRadio && group === 'Surfaces' && !['Bordered rows', 'Shared frame'].includes(title) ? 'gallery-card--wide' : ''}`}
                          aria-label={`${entry.name}: ${title}`}
                        >
                          <div className="gallery-card-preview">
                            <Demo example={title} layout={layout} />
                          </div>
                          <div className="gallery-card-info">
                            <h5>{title}</h5>
                            <span>{group}</span>
                          </div>
                          <div className="gallery-card-actions">
                            <button
                              aria-label={`View code: ${entry.name} ${title}`}
                              onClick={() => {
                                setSelected(title);
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
        <section className="doc-section" id={`${slug}-states`}>
          <h3>States & interaction</h3>
          <p>
            Explore defaults, unavailable values, keyboard focus and dark surfaces. Hover and
            press feedback is live throughout the catalogue.
          </p>
          <StateLab kind={kind} />
        </section>
        <section className="doc-section" id={`${slug}-usage`}>
          <h3>Usage & accessibility</h3>
          <p>
            Copy Selection.jsx and Selection.css together. Both primitives use React and native
            inputs.{' '}
            {isRadio
              ? 'A Radio Group represents one exclusive choice; segmented controls belong to their own category.'
              : 'A Switch represents an on/off setting with no intermediate state.'}
          </p>
          <CodeBlock
            label={`Using ${entry.name}`}
            code={
              isRadio
                ? 'import { RadioGroup } from "./Selection";\n\n<RadioGroup legend="Delivery channel" name="channel"\n  defaultValue="email" options={[\n    { value: "email", label: "Email", description: "A daily summary." },\n    { value: "push", label: "Push" }\n  ]} />'
                : 'import { Switch } from "./Selection";\n\n<Switch name="backup" label="Automatic backup"\n  description="Keep a copy of your workspace."\n  position="end" defaultChecked />'
            }
          />
          <div className="api-table">
            <table>
              <thead>
                <tr>
                  <th>Prop</th>
                  <th>Behavior</th>
                </tr>
              </thead>
              <tbody>
                {(isRadio ? radioApi : switchApi).map(([prop, text]) => (
                  <tr key={prop}>
                    <td>{prop}</td>
                    <td>{text}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Focus adds a solid inset outline. Descriptions and validation
            messages remain associated with their controls. The form demonstrates correction,
            focus on error, submission and reset. Dark mode uses a selection-surface wrapper
            with data-theme="dark".
          </p>
          <p>
            {isRadio
              ? 'The indicator settles in 180 ms; selected cards retain their short tactile shadow. Every visual option has a text label and a visible radio.'
              : 'The thumb slides in 210 ms, stretches slightly on press and settles with subtle damping. The track changes color during travel. Async save is explicitly simulated and restores the previous value on failure.'}{' '}
            Reduced motion removes animated movement while preserving visible feedback.
          </p>
          <p>
            Coverage reference:{' '}
            <a
              href={`https://coss.com/ui/docs/components/${slug}`}
              target="_blank"
              rel="noreferrer"
            >
              coss ui {entry.name} ↗
            </a>
            . Expanded compositions and tactile styling belong to this catalogue; the
            primitives expose their own React API.
          </p>
        </section>
        <section className="doc-section" id={`${slug}-source`}>
          <h3>Source code</h3>
          <p>
            Demo exports also use the existing Button (Button.jsx, Button.css, buttonColor.js)
            and Input (Input.jsx, Forms.css). SelectionShowcase.css provides demo layout
            styles.
          </p>
          <SourceFiles
            files={[
              ['Selection.jsx', componentSource],
              ['Selection.css', cssSource],
              ['SelectionDemos.jsx', demoSource],
              ['SelectionShowcase.css', demoCss],
            ]}
          />
        </section>
        <dialog
          className="example-dialog"
          ref={dialog}
          aria-labelledby={`${slug}-dialog-title`}
        >
          <div className="dialog-heading">
            <div>
              <span className="doc-eyebrow">{entry.name.toUpperCase()} EXAMPLE</span>
              <h2 id={`${slug}-dialog-title`}>{selected}</h2>
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
              <ExampleSource code={source(selected)} label={`${selected} · JSX`} />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
