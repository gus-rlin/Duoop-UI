import React, { useEffect, useState } from 'react';
import { Tabs } from '../components/Tabs/Tabs';
import { Badge } from '../components/Badge/Badge';
import { CodeBlock, BundleFiles } from '../components/Button/Documentation';
import { Showcase } from './Showcases';
import { SourceContext } from './SourceContext';
import { recipeFor, notes } from './recipes';
import { componentBundle } from './source-bundle';
import { Icon } from './Icon';

export function ComponentDetail({ entry, mode, onMode }) {
  const [result, setResult] = useState({});
  const recipe = recipeFor(entry);
  useEffect(() => {
    let active = true;
    setResult({});
    componentBundle(entry, recipe).then(
      (bundle) => {
        if (active) setResult({ bundle });
      },
      (error) => {
        if (active) setResult({ error: error.message });
      },
    );
    return () => {
      active = false;
    };
  }, [entry, recipe]);
  const extra =
    result.bundle?.dependencies.filter((name) => !['react', 'react-dom'].includes(name)) || [];
  const install = (
    <div className="installation-panel">
      <h2>Make {entry.name} yours.</h2>
      <p>Use an existing React project, or download the complete starter from the Code tab.</p>
      <ol className="installation-steps">
        <li>
          <h3>Install the dependencies</h3>
          <p>
            React 19 and React DOM are required.
            {extra.length
              ? ' This component also uses the packages below.'
              : ' No additional runtime package is needed.'}
          </p>
          <CodeBlock
            label="Terminal"
            language="bash"
            code={`npm install react react-dom${extra.length ? ` ${extra.join(' ')}` : ''}`}
          />
        </li>
        <li>
          <h3>Copy the files with their paths</h3>
          <p>
            Get every file in the Code tab. Keep the directory structure so relative imports
            continue to resolve.
          </p>
          <ul className="install-file-list">
            {result.bundle?.files.map(([path]) => (
              <li key={path}>
                <Icon name="code" size={14} />
                <code>{path}</code>
              </li>
            ))}
          </ul>
        </li>
        <li>
          <h3>Import the foundation once</h3>
          <CodeBlock label="src/main.jsx · shared styles" code={"import './base.css';"} />
          <p>
            The component imports its own CSS. No Tailwind, path alias or Vite-specific import
            is needed. Where a provider is required, the working example includes it. DM Sans
            is optional; a system font is the fallback.
          </p>
        </li>
        <li>
          <h3>Use the working example</h3>
          <CodeBlock code={recipe} label="src/App.jsx" />
          <p>
            Adjust props and content to your project.{' '}
            {notes[entry.id.slice(8)] ||
              'Your application owns persistence and real requests. The gallery shows local interactions.'}
          </p>
        </li>
      </ol>
      <a className="text-link" href="?page=installation">
        Read the complete installation guide <Icon name="arrow" />
      </a>
    </div>
  );
  return (
    <SourceContext.Provider value={entry}>
      <div className="component-detail">
        <a className="back-link" href={`?category=${encodeURIComponent(entry.category)}`}>
          <span aria-hidden="true">←</span> {entry.category}
        </a>
        <header className="detail-heading">
          <div>
            <span className="eyebrow">THE COMPONENT LIBRARY</span>
            <h1>{entry.name}</h1>
            <p>{entry.summary}</p>
          </div>
          <Badge>React + CSS</Badge>
        </header>
        <Tabs
          className="detail-tabs"
          label={`${entry.name} documentation`}
          value={mode}
          onValueChange={onMode}
          variant="underline"
          items={[
            {
              value: 'preview',
              label: 'Preview',
              icon: <Icon name="grid" />,
              panel: <Showcase entry={entry} />,
            },
            {
              value: 'code',
              label: 'Code',
              icon: <Icon name="code" />,
              panel: result.error ? (
                <p role="alert">{result.error}</p>
              ) : result.bundle ? (
                <BundleFiles bundle={result.bundle} name={entry.id.slice(8)} />
              ) : (
                <p role="status">Preparing source files…</p>
              ),
            },
            {
              value: 'installation',
              label: 'Installation',
              icon: <Icon name="download" />,
              panel: install,
            },
          ]}
        />
      </div>
    </SourceContext.Provider>
  );
}
