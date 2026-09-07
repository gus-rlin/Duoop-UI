import React, { useContext, useRef, useState } from 'react';
import { CodeBlock, SourceFiles, ExampleSource } from './Button/Documentation';
import './Button/showcase.css';
import { SourceContext } from '../catalog/SourceContext';
import { recipeFor } from '../catalog/recipes';
import { Button } from './Button/Button';
export function CatalogShowcase({
  entry,
  number,
  section = 'OTHER',
  examples,
  Demo,
  api,
  usage,
  accessibility,
  sources,
  wide = [],
  playground,
  usageCode,
}) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const dialog = useRef(null);
  const groups = [...new Set(examples.map(([, group]) => group))];
  const visible = examples.filter(([, group]) => filter === 'All' || group === filter);
  const slug = entry.name.toLowerCase().replaceAll(' ', '-');
  const publicEntry = useContext(SourceContext);
  const demoFile = sources.find(([name]) => /Demos\.jsx$/.test(name));
  const demoName = demoFile?.[1].match(/export\s+function\s+(\w+Demo)\b/)?.[1];
  const exampleCode = `import { ${demoName} } from './${demoFile?.[0]}';\n\n<${demoName} example=${JSON.stringify(selected)} />`;
  return (
    <article className={`button-showcase ${slug}-showcase`} aria-labelledby={`${slug}-name`}>
      <div className="documentation-content">
        <header className="showcase-heading">
          <div>
            <span className="doc-eyebrow">
              {number} / {section}
            </span>
            <h2 id={`${slug}-name`}>{entry.name}</h2>
            <p>{entry.notes}</p>
          </div>
          <a className="secondary" href={`#${slug}-source`}>
            Source code ↗
          </a>
        </header>
        {playground}
        <section className="component-gallery doc-section">
          <div className="gallery-heading">
            <div>
              <h3>Variants and behaviors</h3>
              <p>{accessibility}</p>
            </div>
            <a href={`#${slug}-usage`}>Usage & API ↗</a>
          </div>
          <div className="gallery-toolbar">
            <div
              className="gallery-filters"
              role="group"
              aria-label={`Filter ${entry.name} examples`}
            >
              {['All', ...groups].map((group) => (
                <Button
                  key={group}
                  size="sm"
                  variant={filter === group ? 'solid' : 'outline'}
                  selected={filter === group}
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
              .filter((group) => visible.some(([, g]) => g === group))
              .map((group) => (
                <section className="gallery-category" key={group}>
                  <div className="gallery-category-heading">
                    <h4>{group}</h4>
                    <span>{visible.filter(([, g]) => g === group).length} examples</span>
                  </div>
                  <div className="gallery-grid">
                    {visible
                      .filter(([, g]) => g === group)
                      .map(([title]) => (
                        <article
                          className={`gallery-card ${wide.includes(title) ? 'gallery-card--wide' : ''}`}
                          key={title}
                          aria-label={`${entry.name}: ${title}`}
                        >
                          <div className="gallery-card-preview">
                            <Demo example={title} />
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
                              aria-label={`View code: ${entry.name} ${title}`}
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
        <section className="doc-section" id={`${slug}-usage`}>
          <h3>Usage & accessibility</h3>
          <p>{usage}</p>
          <CodeBlock
            label={`Using ${entry.name}`}
            code={publicEntry ? recipeFor(publicEntry) : usageCode}
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
        </section>
        <section className="doc-section" id={`${slug}-source`}>
          <h3>Source code</h3>
          <p>
            Component, motion, examples, and catalogue presentation stay together for review.
          </p>
          <SourceFiles files={sources} />
        </section>
        <dialog
          className="example-dialog"
          ref={dialog}
          onClose={() => setSelected(null)}
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
              <ExampleSource code={exampleCode} label={`${selected} · JSX`} />
            </>
          )}
        </dialog>
      </div>
    </article>
  );
}
