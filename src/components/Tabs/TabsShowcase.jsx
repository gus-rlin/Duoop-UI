import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import React, { useRef, useState } from 'react';
import { CodeBlock, SourceFiles, ExampleSource } from '../Button/Documentation';
import { ControlledTabs, TabsDemo, TabsSizeLab, tabsExamples } from './TabsDemos';
import componentSource from './Tabs.jsx?raw';
import cssSource from './Tabs.css?raw';
import demoSource from './TabsDemos.jsx?raw';
import demoCss from './TabsShowcase.css?raw';
import '../Button/showcase.css';
import './TabsShowcase.css';
export const tabsEntry = {
  id: 'builtin-tabs',
  name: 'Tabs',
  category: 'Navigation',
  notes:
    'Accessible peer navigation with a springy measured indicator, tactile contours, responsive orientation, keyboard activation, and resilient panels.',
};
const api = [
  ['items', 'Unique value, label, optional icon/meta, panel, and disabled state.'],
  ['value / defaultValue / onValueChange', 'Controlled or uncontrolled selection.'],
  ['variant / size', 'contained · underline / sm · md · lg'],
  [
    'orientation / width / alignment',
    'horizontal · vertical / content · full / start · center · end',
  ],
  [
    'activation / loop',
    'automatic or manual keyboard activation; optional wrapping arrow navigation.',
  ],
  [
    'keepMounted / transition',
    'Preserve inactive panels or mount only the active one; none or fade.',
  ],
  ['dir', 'LTR or RTL. The indicator follows measured tab geometry and resize.'],
];
export function TabsShowcase() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const groups = [...new Set(tabsExamples.map(([, g]) => g))];
  const visible = tabsExamples.filter(([, g]) => filter === 'All' || g === filter);
  return (
    <article className="button-showcase tabs-showcase" aria-labelledby="tabs-name">
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">08 / NAVIGATION</span>
            <h2 id="tabs-name">Tabs</h2>
            <p>{tabsEntry.notes}</p>
          </div>
          <a className="secondary" href="#tabs-source">
            Source code ↗
          </a>
        </header>
        <section className="component-gallery doc-section">
          <div className="gallery-heading">
            <div>
              <h3>Variants and behaviors</h3>
              <p>
                Use Tab to enter, arrow keys to move, and Enter or Space when activation is
                manual.
              </p>
            </div>
            <a href="#tabs-usage">Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div className="gallery-filters" role="group" aria-label="Filter tabs examples">
              {['All', ...groups].map((g) => (
                <Button key={g} size="sm" variant={filter === g ? "solid" : "outline"} selected={filter === g} onClick={() => setFilter(g)}>
                  {g}
                </Button>
              ))}
            </div>
            <span role="status">{visible.length} examples</span>
          </div>
          <div className="gallery-groups">
            {groups
              .filter((g) => visible.some(([, x]) => x === g))
              .map((g) => (
                <section className="gallery-category" key={g}>
                  <div className="gallery-category-heading">
                    <h4>{g}</h4>
                    <span>{visible.filter(([, x]) => x === g).length} examples</span>
                  </div>
                  <div className="gallery-grid">
                    {visible
                      .filter(([, x]) => x === g)
                      .map(([title]) => (
                        <article
                          className={`gallery-card ${['Vertical', 'Many tabs and overflow', 'Long labels'].includes(title) ? 'gallery-card--wide' : ''}`}
                          key={title}
                          aria-label={`Tabs: ${title}`}
                        >
                          <div className="gallery-card-preview">
                            <TabsDemo example={title} />
                          </div>
                          <div className="gallery-card-info">
                            <h5>{title}</h5>
                            <span>{g}</span>
                          </div>
                          <div className="gallery-card-actions">
                            <button
                              onClick={() => {
                                setSelected(title);
                                dialog.current.showModal();
                              }}
                              aria-label={`View code: Tabs ${title}`}
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
        <section className="doc-section" id="tabs-controlled">
          <h3>Controlled selection</h3>
          <p>
            The active value can live with the feature that owns it. Local focus and indicator
            measurement stay inside Tabs.
          </p>
          <Card variant="elevated" interactive className="tabs-lab playground-card">
            <ControlledTabs />
          </Card>
        </section>
        <section className="doc-section" id="tabs-sizes">
          <h3>Size scale</h3>
          <p>
            Small, medium, and large tabs keep the same measured indicator and keyboard model.
          </p>
          <TabsSizeLab />
        </section>
        <section className="doc-section" id="tabs-usage">
          <h3>Usage & accessibility</h3>
          <p>
            Tabs expose native tab, tablist and tabpanel semantics with roving focus. Disabled
            tabs are skipped by arrow navigation, and panels keep a stable accessible
            relationship.
          </p>
          <CodeBlock
            label="Using Tabs"
            code={
              'import { Tabs } from "./Tabs";\n\n<Tabs defaultValue="overview" items={[\n  { value: "overview", label: "Overview", panel: <Overview /> },\n  { value: "activity", label: "Activity", panel: <Activity /> }\n]} />'
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
                {api.map((r) => (
                  <tr key={r[0]}>
                    <td>{r[0]}</td>
                    <td>{r[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            The shared indicator responds to label width, resize, scrolling, orientation and
            direction. Reduced motion removes its travel and panel displacement without hiding
            state.
          </p>
        </section>
        <section className="doc-section" id="tabs-source">
          <h3>Source code</h3>
          <p>The content examples reuse Badge and Button for meaningful states.</p>
          <SourceFiles
            files={[
              ['Tabs.jsx', componentSource],
              ['Tabs.css', cssSource],
              ['TabsDemos.jsx', demoSource],
              ['TabsShowcase.css', demoCss],
            ]}
          />
        </section>
        <dialog className="example-dialog" ref={dialog} aria-labelledby="tabs-dialog-title">
          <div className="dialog-heading">
            <div>
              <span className="doc-eyebrow">TABS EXAMPLE</span>
              <h2 id="tabs-dialog-title">{selected}</h2>
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
                code={`import { TabsDemo } from './TabsDemos';\n\n<TabsDemo example=${JSON.stringify(selected)} />`}
                label={`${selected} · JSX`}
              />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
