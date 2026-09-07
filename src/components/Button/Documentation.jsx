import React, { useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import json from 'highlight.js/lib/languages/json';
import { Button, ActionFeedback } from './Button';
import { Icon } from '../../catalog/Icon';
import { SourceContext } from '../../catalog/SourceContext';
import { exampleBundle } from '../../catalog/source-bundle';
import { downloadBundle } from '../../catalog/download';
import '../../catalog/code.css';

hljs.registerLanguage('xml', xml);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);

export function CodeBlock({ code = '', label = 'App.jsx', language }) {
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const syntax =
    language ||
    (/\.css$/.test(label)
      ? 'css'
      : /\.json$/.test(label)
        ? 'json'
        : /terminal|install|command/i.test(label)
          ? 'bash'
          : 'javascript');
  const highlighted = useMemo(
    () => hljs.highlight(String(code), { language: syntax, ignoreIllegals: true }).value,
    [code, syntax],
  );
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setStatus('success');
      setMessage('');
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setStatus('idle'), 1800);
    } catch {
      setStatus('idle');
      setMessage('Clipboard unavailable. Select the code below and copy it manually.');
    }
  }
  return (
    <div className="code-block">
      <div className="code-toolbar">
        <span>
          <Icon name="code" size={15} />
          {label}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={copy}
          status={status}
          successLabel="Copied"
          icon={<Icon name="copy" size={15} />}
          aria-label={`Copy code: ${label}`}
        >
          Copy code
        </Button>
      </div>
      <pre tabIndex={0} aria-label={label}>
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </pre>
      {message && <ActionFeedback tone="error">{message}</ActionFeedback>}
    </div>
  );
}

export function Example({ children, code, label = 'Example' }) {
  const [showCode, setShowCode] = useState(false);
  const id = useId();
  return (
    <div className="doc-example">
      <div className="example-toolbar">
        <div className="view-switch" role="group" aria-label={`${label}: view`}>
          <button
            type="button"
            aria-pressed={!showCode}
            aria-controls={id}
            onClick={() => setShowCode(false)}
          >
            Preview
          </button>
          <button
            type="button"
            aria-pressed={showCode}
            aria-controls={id}
            onClick={() => setShowCode(true)}
          >
            Code
          </button>
        </div>
        <span>React · JSX</span>
      </div>
      <div id={id}>{showCode ? <CodeBlock code={code} label={label} /> : children}</div>
    </div>
  );
}

export function SourceFiles({ files, initialFile }) {
  const [selected, setSelected] = useState(initialFile || files[0]?.[0]);
  const current = files.find(([name]) => name === selected) || files[0];
  const id = useId();
  if (!current) return <p>No source files available.</p>;
  return (
    <div className="source-files">
      <div className="source-file-picker">
        <label htmlFor={id}>
          File <span>{files.length} available</span>
        </label>
        <select
          id={id}
          aria-label="Source file"
          value={current[0]}
          onChange={(event) => setSelected(event.target.value)}
        >
          {files.map(([name]) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </div>
      <div className="source-file-layout">
        <nav className="file-switch" aria-label="Source files">
          {files.map(([name]) => (
            <button
              type="button"
              key={name}
              aria-pressed={name === current[0]}
              onClick={() => setSelected(name)}
            >
              <Icon name="code" size={14} />
              <span>{name.replace(/^src\//, '')}</span>
            </button>
          ))}
        </nav>
        <CodeBlock key={current[0]} code={current[1]} label={current[0]} />
      </div>
    </div>
  );
}

export function BundleFiles({ bundle, name = 'duoop-example' }) {
  const [error, setError] = useState('');
  const extras = bundle.dependencies.filter(
    (value) => !['react', 'react-dom'].includes(value),
  );
  return (
    <div className="bundle-files">
      <div className="bundle-heading">
        <div>
          <strong>Everything this example uses.</strong>
          <p>
            {bundle.files.length} files · React + CSS
            {extras.length ? ` · ${extras.join(', ')}` : ' · No extra runtime dependency'}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          icon={<Icon name="download" size={16} />}
          onClick={async () => {
            try {
              await downloadBundle(bundle, name);
            } catch {
              setError('Download failed. You can still copy each file below.');
            }
          }}
        >
          Download project
        </Button>
      </div>
      {error && <p role="alert">{error}</p>}
      <SourceFiles files={bundle.files} />
      <p className="source-note">
        Keep the displayed paths. The download includes a runnable Vite project. Run{' '}
        <code>npm install</code>, then <code>npm run dev</code>.
      </p>
    </div>
  );
}

export function ExampleSource({ code, label, origin }) {
  const entry = useContext(SourceContext);
  const [result, setResult] = useState({});
  useEffect(() => {
    let current = true;
    setResult({});
    if (entry)
      exampleBundle(entry, code, origin).then(
        (bundle) => {
          if (current) setResult({ bundle });
        },
        (error) => {
          if (current) setResult({ error: error.message });
        },
      );
    return () => {
      current = false;
    };
  }, [entry, code, origin]);
  if (!entry) return <CodeBlock code={code} label={label} />;
  if (result.error) return <p role="alert">Could not prepare this example: {result.error}</p>;
  if (!result.bundle)
    return (
      <p className="source-loading" role="status">
        Preparing the complete example…
      </p>
    );
  return <BundleFiles bundle={result.bundle} name={`${entry.id.slice(8)}-example`} />;
}
