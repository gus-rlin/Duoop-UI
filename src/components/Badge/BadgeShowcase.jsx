import { Button } from '../Button/Button';
import React, { useRef, useState } from 'react';
import { CodeBlock, SourceFiles, ExampleSource } from '../Button/Documentation';
import { BadgeDemo, BadgeMatrix, badgeExamples } from './BadgeDemos';
import componentSource from './Badge.jsx?raw';
import cssSource from './Badge.css?raw';
import demoSource from './BadgeDemos.jsx?raw';
import demoCss from './BadgeShowcase.css?raw';
import '../Button/showcase.css';
import './BadgeShowcase.css';
export const badgeEntry = {
  id: 'builtin-badge',
  name: 'Badge',
  category: 'Other',
  notes:
    'Compact labels with independent appearance and tone, semantic color families, counters, links, buttons, and local loading feedback.',
};
const api = [
  ['appearance', 'solid · soft · outline'],
  ['tone', 'neutral · brand · info · success · warning · danger'],
  ['size / shape', 'sm · md · lg / rounded · pill · circle'],
  ['leading / trailing', 'Icons, status dots, avatars, or short secondary marks.'],
  [
    'href / onClick',
    'Render a semantic link or button with hover, press, focus, disabled and loading states.',
  ],
  ['RemovableBadge', 'Keeps removal as its own named button rather than nesting controls.'],
];
export function BadgeShowcase() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const groups = [...new Set(badgeExamples.map(([, g]) => g))];
  const visible = badgeExamples.filter(([, g]) => filter === 'All' || g === filter);
  return (
    <article className="button-showcase badge-showcase" aria-labelledby="badge-name">
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">07 / OTHER</span>
            <h2 id="badge-name">Badge</h2>
            <p>{badgeEntry.notes}</p>
          </div>
          <a className="secondary" href="#badge-source">
            Source code ↗
          </a>
        </header>
        <section className="component-gallery doc-section">
          <div className="gallery-heading">
            <div>
              <h3>Content and interaction</h3>
              <p>
                Meaning and appearance are separate axes, so every semantic family stays
                predictable.
              </p>
            </div>
            <a href="#badge-usage">Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div className="gallery-filters" role="group" aria-label="Filter badge examples">
              {['All', ...groups].map((g) => (
                <Button key={g} size="sm" variant={filter === g ? "solid" : "outline"} selected={filter === g} onClick={() => setFilter(g)}>
                  {g}
                </Button>
              ))}
            </div>
            <span role="status">{visible.length} examples</span>
          </div>
          <div className="gallery-grid">
            {visible.map(([title, group]) => (
              <article className="gallery-card" key={title} aria-label={`Badge: ${title}`}>
                <div className="gallery-card-preview">
                  <BadgeDemo example={title} />
                </div>
                <div className="gallery-card-info">
                  <h5>{title}</h5>
                  <span>{group}</span>
                </div>
                <div className="gallery-card-actions">
                  <button
                    onClick={() => {
                      setSelected(title);
                      dialog.current.showModal();
                    }}
                    aria-label={`View code: Badge ${title}`}
                  >
                    View code <span aria-hidden="true">↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="doc-section" id="badge-states">
          <h3>Appearance × tone</h3>
          <p>
            Each tone carries its own ink, soft surface, and border. Color is reinforced by
            text, icon, or status copy.
          </p>
          <BadgeMatrix />
        </section>
        <section className="doc-section" id="badge-usage">
          <h3>Usage & accessibility</h3>
          <p>
            Use badges for concise metadata and state. Use a button or link only when the label
            performs an action or navigation.
          </p>
          <CodeBlock
            label="Using Badge"
            code={
              'import { Badge, StatusDot } from "./Badge";\n\n<Badge appearance="soft" tone="success" leading={<StatusDot />}>\n  Active\n</Badge>'
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
                {api.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="doc-section" id="badge-source">
          <h3>Source code</h3>
          <SourceFiles
            files={[
              ['Badge.jsx', componentSource],
              ['Badge.css', cssSource],
              ['BadgeDemos.jsx', demoSource],
              ['BadgeShowcase.css', demoCss],
            ]}
          />
        </section>
        <dialog className="example-dialog" ref={dialog} aria-labelledby="badge-dialog-title">
          <div className="dialog-heading">
            <div>
              <span className="doc-eyebrow">BADGE EXAMPLE</span>
              <h2 id="badge-dialog-title">{selected}</h2>
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
                code={`import { BadgeDemo } from './BadgeDemos';\n\n<BadgeDemo example=${JSON.stringify(selected)} />`}
                label={`${selected} · JSX`}
              />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
