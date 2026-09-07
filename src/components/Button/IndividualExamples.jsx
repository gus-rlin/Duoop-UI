import { Button } from './Button';
import React, { useEffect, useRef, useState } from 'react';
import { CodeBlock, ExampleSource } from './Documentation';
import { ButtonPlayground } from './ButtonPlayground';
import { IconButtonShowcase } from '../IconButton/IconButtonShowcase';
import sections from './demo-sections.json';
const components = import.meta.glob('./demos/*.jsx', {
  eager: true,
  import: 'default',
});
const sources = import.meta.glob('./demos/*.jsx', {
  eager: true,
  query: '?raw',
  import: 'default',
});
const items = sections.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    group: group.id,
  })),
);
const filters = ['All', 'Variants', 'Sizes', 'Icons', 'States', 'Motion'];
const family = (item) =>
  item.group === 'button-status'
    ? 'States'
    : item.group === 'button-motion'
      ? 'Motion'
      : item.group === 'icon-button-examples' || /example-(icon-|favorite)/.test(item.id)
        ? 'Icons'
        : item.group === 'button-sizes'
          ? 'Sizes'
          : 'Variants';
const galleryGroups = sections.flatMap((section) =>
  section.id === 'button-sizes'
    ? [
        {
          id: 'button-sizes',
          title: 'Sizes',
          items: items.filter((item) => family(item) === 'Sizes'),
        },
        {
          id: 'button-icon-content',
          title: 'Icons and labels',
          items: items.filter(
            (item) => item.group === 'button-sizes' && family(item) === 'Icons',
          ),
        },
      ]
    : [
        {
          ...section,
          items: items.filter((item) => item.group === section.id),
        },
      ],
);
export function ComponentGallery() {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [mode, setMode] = useState('code');
  const dialog = useRef(null);
  const visibleGroups = galleryGroups
    .map((group) => ({
      ...group,
      items: group.items.filter((item) => filter === 'All' || family(item) === filter),
    }))
    .filter((group) => group.items.length);
  const visibleCount = visibleGroups.reduce((count, group) => count + group.items.length, 0);
  useEffect(() => {
    function syncLocation() {
      const item = items.find((item) => '#' + item.id === location.hash);
      if (item) {
        setSelected(item);
        setMode('code');
        if (!dialog.current.open) dialog.current.showModal();
      } else if (location.hash === '#button-playground') {
        setSelected(items[0]);
        setMode('customize');
        if (!dialog.current.open) dialog.current.showModal();
      } else if (dialog.current.open) dialog.current.close();
      const queryFilter = new URLSearchParams(location.search).get('family');
      setFilter(filters.includes(queryFilter) ? queryFilter : 'All');
    }
    syncLocation();
    window.addEventListener('hashchange', syncLocation);
    window.addEventListener('popstate', syncLocation);
    return () => {
      window.removeEventListener('hashchange', syncLocation);
      window.removeEventListener('popstate', syncLocation);
    };
  }, []);
  function chooseFilter(value) {
    setFilter(value);
    const url = new URL(location.href);
    value === 'All'
      ? url.searchParams.delete('family')
      : url.searchParams.set('family', value);
    history.replaceState(null, '', url);
  }
  function open(item, nextMode) {
    setSelected(item);
    setMode(nextMode);
    history.replaceState(null, '', location.pathname + location.search + '#' + item.id);
    dialog.current.showModal();
  }
  function close() {
    setSelected(null);
    if (
      items.some((item) => '#' + item.id === location.hash) ||
      location.hash === '#button-playground'
    )
      history.replaceState(null, '', location.pathname + location.search + '#button-preview');
  }
  const Demo = selected ? components[`./demos/${selected.id}.jsx`] : null;
  return (
    <section
      className="component-gallery doc-section"
      id="button-preview"
      aria-labelledby="gallery-title"
    >
      <div className="gallery-heading">
        <div>
          <h3 id="gallery-title">Examples</h3>
          <p>Browse examples, copy code, or customize a button.</p>
        </div>
        <a href="#button-usage">Usage & API ↗</a>
      </div>
      <div className="gallery-toolbar">
        <div className="gallery-filters" role="group" aria-label="Filter examples">
          {filters.map((value) => (
            <Button
              key={value}
              size="sm" variant={filter === value ? "solid" : "outline"} selected={filter === value}
              onClick={() => chooseFilter(value)}
            >
              {value}
            </Button>
          ))}
        </div>
        <span role="status">{visibleCount} examples</span>
      </div>
      <div className="gallery-groups">
        {visibleGroups.map((group) => (
          <section
            className="gallery-category"
            key={group.id}
            id={group.id}
            aria-labelledby={`${group.id}-heading`}
          >
            <div className="gallery-category-heading">
              <h4 id={`${group.id}-heading`}>{group.title}</h4>
              <span>{group.items.length} examples</span>
            </div>
            <div className="gallery-grid">
              {group.items.map((item) => {
                const Preview = components[`./demos/${item.id}.jsx`];
                return (
                  <article className="gallery-card" key={item.id} aria-label={item.title}>
                    <div className="gallery-card-preview">
                      <Preview />
                    </div>
                    <div className="gallery-card-info">
                      <h5>{item.title}</h5>
                      <span>{group.title}</span>
                    </div>
                    <div className="gallery-card-actions">
                      <button
                        onClick={() => open(item, 'code')}
                        aria-label={`View code: ${item.title}`}
                      >
                        View code <span aria-hidden="true">↗</span>
                      </button>
                      <button
                        onClick={() => open(item, 'customize')}
                        aria-label={`Customize: ${item.title}`}
                      >
                        Customize
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))}
      </div>
      <dialog
        className="example-dialog"
        ref={dialog}
        onClose={close}
        aria-labelledby="example-dialog-title"
      >
        <div className="dialog-heading">
          <div>
            <span className="doc-eyebrow">BUTTON EXAMPLE</span>
            <h2 id="example-dialog-title">{selected?.title}</h2>
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
            <div className="example-mode" role="group" aria-label="Example view">
              <button aria-pressed={mode === 'code'} onClick={() => setMode('code')}>
                Example & code
              </button>
              <button aria-pressed={mode === 'customize'} onClick={() => setMode('customize')}>
                Customize
              </button>
            </div>
            {mode === 'code' ? (
              <>
                <ExampleSource
                  key={selected.id}
                  label={`${selected.title} · JSX`}
                  code={sources[`./demos/${selected.id}.jsx`]}
                  origin={`src/components/Button/demos/${selected.id}.jsx`}
                />
              </>
            ) : selected.group === 'icon-button-examples' ? (
              <IconButtonShowcase key={selected.id} preset={selected.preset} />
            ) : (
              <ButtonPlayground key={selected.id} preset={selected.preset} />
            )}
          </>
        )}
      </dialog>
    </section>
  );
}
