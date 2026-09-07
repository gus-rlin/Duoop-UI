import { Button } from '../Button/Button';
import React, { useRef, useState } from 'react';
import { CodeBlock, SourceFiles, ExampleSource } from '../Button/Documentation';
import { CardDemo, CardStateLab, CardVariantLab, cardExamples } from './CardDemos';
import componentSource from './Card.jsx?raw';
import cssSource from './Card.css?raw';
import demoSource from './CardDemos.jsx?raw';
import demoCss from './CardShowcase.css?raw';
import '../Button/showcase.css';
import './CardShowcase.css';
export const cardEntry = {
  id: 'builtin-card',
  name: 'Card',
  category: 'Cards',
  notes:
    'Composable surfaces with tactile depth, honest interactivity, media, frames, and resilient content across 22 compositions.',
};
const api = [
  ['variant', 'outline · elevated · filled · ghost'],
  [
    'size / radius',
    'sm · md · lg. Radius inherits the catalogue’s compact, standard and generous geometry.',
  ],
  [
    'orientation',
    'vertical · horizontal; horizontal collapses when its container becomes narrow.',
  ],
  [
    'interactive / href / onClick',
    'href renders a link; onClick renders a button. Informational cards remain articles without false hover behavior.',
  ],
  [
    'selected / disabled / loading',
    'Visible selection, unavailable interaction and shape-matched skeleton states.',
  ],
  [
    'Card anatomy',
    'CardHeader, CardTitle, CardDescription, CardAction, CardMedia, CardContent / CardPanel and CardFooter.',
  ],
  [
    'CardFrame anatomy',
    'FrameHeader, FrameTitle, FrameDescription, FrameAction, content and FrameFooter for grouped data.',
  ],
];
export function CardShowcase() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const groups = [...new Set(cardExamples.map(([, group]) => group))];
  const visible = cardExamples.filter(([, group]) => filter === 'All' || group === filter);
  return (
    <article className="button-showcase card-showcase" aria-labelledby="card-name">
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">06 / CARDS</span>
            <h2 id="card-name">Card</h2>
            <p>{cardEntry.notes}</p>
          </div>
          <a className="secondary" href="#card-source">
            Source code ↗
          </a>
        </header>
        <section className="component-gallery doc-section">
          <div className="gallery-heading">
            <div>
              <h3>Compositions</h3>
              <p>
                Information stays quiet. Interactive surfaces answer with lift, press, focus,
                and selection.
              </p>
            </div>
            <a href="#card-usage">Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div className="gallery-filters" role="group" aria-label="Filter card examples">
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
            <span role="status">{visible.length} compositions</span>
          </div>
          <div className="gallery-groups">
            {groups
              .filter((group) => visible.some(([, itemGroup]) => itemGroup === group))
              .map((group) => (
                <section className="gallery-category" key={group}>
                  <div className="gallery-category-heading">
                    <h4>{group}</h4>
                    <span>
                      {visible.filter(([, itemGroup]) => itemGroup === group).length}{' '}
                      compositions
                    </span>
                  </div>
                  <div className="gallery-grid">
                    {visible
                      .filter(([, itemGroup]) => itemGroup === group)
                      .map(([title]) => (
                        <article
                          className={`gallery-card ${['Frame with list', 'Frame with table', 'Long content and overflow'].includes(title) ? 'gallery-card--wide' : ''}`}
                          key={title}
                          aria-label={`Card: ${title}`}
                        >
                          <div className="gallery-card-preview">
                            <CardDemo example={title} />
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
                              aria-label={`View code: Card ${title}`}
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
        <section className="doc-section" id="card-variants">
          <h3>Variants & states</h3>
          <p>
            Four materials share the same anatomy. Interactive, selected, disabled, and loading
            states keep stable geometry.
          </p>
          <CardVariantLab />
          <CardStateLab />
        </section>
        <section className="doc-section" id="card-usage">
          <h3>Usage & accessibility</h3>
          <p>
            Compose only the regions a card needs. Interactive is explicit: use a real link for
            navigation or a real button for one action, and keep multi-action cards as
            non-interactive containers.
          </p>
          <CodeBlock
            label="Using Card"
            code={
              'import { Card, CardHeader, CardTitle, CardDescription } from "./Card";\n\n<Card href="/notes" interactive variant="elevated">\n  <CardHeader>\n    <CardTitle>Weekly field notes</CardTitle>\n    <CardDescription>Decisions and open questions.</CardDescription>\n  </CardHeader>\n</Card>'
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
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            Hover and press use short transform and shadow transitions. Keyboard focus adds a solid inset outline. Reduced motion removes displacement while retaining
            visible state changes.
          </p>
        </section>
        <section className="doc-section" id="card-source">
          <h3>Source code</h3>
          <p>The examples reuse the catalogue Button, Badge and Input primitives.</p>
          <SourceFiles
            files={[
              ['Card.jsx', componentSource],
              ['Card.css', cssSource],
              ['CardDemos.jsx', demoSource],
              ['CardShowcase.css', demoCss],
            ]}
          />
        </section>
        <dialog className="example-dialog" ref={dialog} aria-labelledby="card-dialog-title">
          <div className="dialog-heading">
            <div>
              <span className="doc-eyebrow">CARD EXAMPLE</span>
              <h2 id="card-dialog-title">{selected}</h2>
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
                code={`import { CardDemo } from './CardDemos';\n\n<CardDemo example=${JSON.stringify(selected)} />`}
                label={`${selected} · JSX`}
              />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
