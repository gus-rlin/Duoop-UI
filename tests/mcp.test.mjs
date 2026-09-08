import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import os from 'node:os';
import { parse } from '@babel/parser';
import { entries } from '../src/catalog/catalog.js';
import { data, search, getSource } from '../mcp/catalog.mjs';
import { catalogFingerprint } from '../scripts/mcp-inputs.mjs';

const requireMcp = createRequire(new URL('../mcp/package.json', import.meta.url));
const { Client } = await import(pathToFileURL(requireMcp.resolve('@modelcontextprotocol/sdk/client/index.js')));
const { StdioClientTransport } = await import(pathToFileURL(requireMcp.resolve('@modelcontextprotocol/sdk/client/stdio.js')));

test('release snapshot matches the current catalog sources and dependencies', async () => {
  assert.equal(data.fingerprint, await catalogFingerprint(), 'Catalog changed: run npm run build:mcp and commit mcp/data.json.');
});

test('snapshot covers every component and every bundle has valid JSX and closed local imports', () => {
  assert.deepEqual(data.entries.map(entry => entry.id), entries.map(entry => entry.id));
  for (const entry of data.entries) {
    assert.ok(entry.variants.length > 0, entry.id);
    assert.equal(new Set(entry.variants.map(item => item.name)).size, entry.variants.length, entry.id);
    for (const bundle of [entry.bundle, ...entry.variants.map(item => item.bundle)]) {
      const files = new Map(bundle.files.map(([name, hash]) => [name, data.sources[hash]]));
      for (const name of ['src/App.jsx', 'src/base.css', 'LICENSE', 'THIRD_PARTY_NOTICES.md']) assert.ok(files.has(name), `${entry.id}: ${name}`);
      for (const [name, code] of files) {
        assert.equal(typeof code, 'string');
        for (const [, specifier] of code.matchAll(/(?:\bimport\s+(?:[^;'"\n]+?\s+from\s+)?|\bexport\s+[^;'"\n]+?\s+from\s+|@import\s+)["']([^"']+)["']/g)) {
          if (!specifier.startsWith('.')) continue;
          const target = path.posix.normalize(path.posix.join(path.posix.dirname(name), specifier));
          assert.ok(['', '.jsx', '.js', '.css', '.json'].some(ext => files.has(target + ext)), `${entry.id}: ${name} -> ${specifier}`);
        }
      }
      for (const dependency of bundle.dependencies) assert.ok(data.dependencies[dependency], dependency);
    }
  }
  // Parse deduplicated JSX/JS once, including every generated variant App.jsx.
  const checked = new Set();
  for (const entry of data.entries) for (const bundle of [entry.bundle, ...entry.variants.map(item => item.bundle)]) {
    for (const [name, hash] of bundle.files) if (/\.(jsx|js)$/.test(name) && !checked.has(hash)) {
      parse(data.sources[hash], { sourceType: 'module', plugins: ['jsx'] });
      checked.add(hash);
    }
  }
});

test('search finds families, variants and complete pagination without duplicate results', () => {
  const forms = search({ family: 'forms', limit: 50 });
  assert.ok(forms.results.some(item => item.id === 'builtin-input'));
  const loading = search({ query: 'loading', family: 'Button' });
  assert.ok(loading.results.some(item => item.type === 'variant'));
  const all = [];
  let offset = 0;
  do {
    const page = search({ limit: 50, offset });
    all.push(...page.results);
    offset = page.nextOffset;
  } while (offset !== null);
  assert.equal(all.length, data.entries.reduce((n, entry) => n + 1 + entry.variants.length, 0));
  assert.equal(new Set(all.map(item => `${item.id}:${item.variant || ''}`)).size, all.length);
  assert.equal(search({ query: 'no-such-component-98765' }).total, 0);
});

test('source retrieval selects the actual variant, includes helpers and rejects arbitrary paths', () => {
  const component = getSource({ component: 'builtin-relief-button' });
  assert.ok(component.files.some(file => file.path.endsWith('/buttonColor.js')));
  const chart = data.entries.find(entry => entry.id === 'builtin-chart');
  const variant = getSource({ component: chart.id, variant: chart.variants[1].name });
  assert.equal(variant.variant, chart.variants[1].name);
  assert.notEqual(variant.files.find(file => file.path === 'src/App.jsx').content, getSource({ component: chart.id }).files.find(file => file.path === 'src/App.jsx').content);
  assert.equal(getSource({ component: chart.id, file: 'src/App.jsx' }).files.length, 1);
  assert.throws(() => getSource({ component: '../../package.json' }), /Unknown/);
  assert.throws(() => getSource({ component: chart.id, file: '../../package.json' }), /Unknown file/);
  assert.throws(() => getSource({ component: chart.id, variant: 'not-a-variant' }), /Available variants/);
});

test('real stdio MCP handshake, tool discovery, search, source and validation from another cwd', async () => {
  const serverPath = process.env.MCP_SERVER || path.resolve(import.meta.dirname, '../mcp/server.mjs');
  const transport = new StdioClientTransport({ command: process.execPath, args: [serverPath], cwd: os.tmpdir(), stderr: 'pipe' });
  let stderr = '';
  transport.stderr?.on('data', chunk => { stderr += chunk; });
  const client = new Client({ name: 'duoop-mcp-test', version: '1.0.0' });
  try {
    await client.connect(transport);
    const { tools } = await client.listTools();
    assert.deepEqual(tools.map(tool => tool.name).sort(), ['get_component_source', 'search_components']);
    assert.ok(tools.every(tool => tool.annotations.readOnlyHint));
    const found = await client.callTool({ name: 'search_components', arguments: { query: 'chart' } });
    assert.ok(JSON.parse(found.content[0].text).results.some(item => item.id === 'builtin-chart'));
    const source = await client.callTool({ name: 'get_component_source', arguments: { component: 'builtin-chart', file: 'src/components/Chart/Chart.jsx' } });
    assert.equal(JSON.parse(source.content[0].text).files.length, 1);
    for (const call of [
      { name: 'search_components', arguments: { limit: 500 } },
      { name: 'get_component_source', arguments: { component: 'builtin-chart', file: '/etc/passwd' } },
    ]) assert.equal((await client.callTool(call)).isError, true);
  } finally {
    await client.close();
  }
  assert.equal(stderr, '');
});
