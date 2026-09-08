// Index the actual catalog UI and its download bundles at release time.
// The shipped MCP uses only JSON + the SDK; no browser, Vite or network at runtime.
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { entries } from '../src/catalog/catalog.js';
import { catalogFingerprint } from './mcp-inputs.mjs';

const root = path.resolve(import.meta.dirname, '..');
const manifest = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
const notices = await Promise.all(['LICENSE', 'THIRD_PARTY_NOTICES.md'].map(async name => [name, await fs.readFile(path.join(root, name), 'utf8')]));
const data = { fingerprint: await catalogFingerprint(), entries: [], sources: {}, dependencies: { ...manifest.dependencies, ...manifest.peerDependencies } };
function pack(bundle) {
  for (const dependency of bundle.dependencies) {
    if (!data.dependencies[dependency]) throw new Error(`Missing dependency version: ${dependency}`);
  }
  return { dependencies: bundle.dependencies, files: [...bundle.files, ...notices].map(([name, content]) => {
    const hash = createHash('sha256').update(content).digest('hex');
    data.sources[hash] = content;
    return [name, hash];
  }) };
}
const server = await createServer({ root, logLevel: 'error', server: { host: '127.0.0.1', port: 0 }, plugins: [{
  name: 'capture-mcp-bundles', enforce: 'pre',
  transform(code, id) {
    if (!id.replaceAll('\\', '/').endsWith('/catalog/source-bundle.js')) return;
    for (const name of ['componentBundle', 'exampleBundle']) {
      code = code.replace(`export async function ${name}(`, `async function original_${name}(`);
      code += `\nexport async function ${name}(...args) { const bundle = await original_${name}(...args); globalThis.__mcpBundle = bundle; return bundle; }`;
    }
    return code;
  },
}] });
let browser;
try {
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  // External demonstration images/tiles aren't required to index source code.
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  const base = server.resolvedUrls.local[0];
  async function capture() {
      await page.waitForFunction(() => !!globalThis.__mcpBundle);
    return pack(await page.evaluate(() => globalThis.__mcpBundle));
  }
  for (const entry of entries) {
    await page.goto(`${base}?component=${entry.id}&tab=code`);
    const bundle = await capture();
    await page.getByRole('tab', { name: 'Preview', exact: true }).click();
    await page.locator('.gallery-card').first().waitFor();
    const cards = page.locator('.gallery-card').filter({ has: page.getByRole('button', { name: /^View code:/ }) });
    const variants = [];
    for (let index = 0; index < await cards.count(); index++) {
      const card = cards.nth(index);
      const name = await card.locator('.gallery-card-info h5').innerText();
      const group = await card.locator('.gallery-card-info span').innerText();
      await page.evaluate(() => { globalThis.__mcpBundle = null; });
      await card.getByRole('button', { name: /^View code:/ }).evaluate(button => button.click());
      try {
        variants.push({ name, group, bundle: await capture() });
      } catch (error) {
        throw new Error(`${entry.name} / ${name}: ${await page.locator('dialog[open]').last().innerText()}`, { cause: error });
      }
      await page.locator('dialog[open]').last().getByRole('button', { name: 'Close example', exact: true }).evaluate(button => new Promise(resolve => {
        button.closest('dialog').addEventListener('close', () => requestAnimationFrame(() => resolve()), { once: true });
        button.click();
      }));
    }
    if (!variants.length) throw new Error(`No variants indexed for ${entry.id}`);
    data.entries.push({ ...entry, bundle, variants });
    console.log(`Indexed ${entry.name}: ${variants.length} variants`);
  }
  if (await catalogFingerprint() !== data.fingerprint) throw new Error('Catalog changed during indexing. Run build:mcp again to produce a consistent snapshot.');
  await fs.writeFile(path.join(root, 'mcp/data.json'), JSON.stringify(data));
  for (const [name, content] of notices) await fs.writeFile(path.join(root, 'mcp', name), content);
  await fs.mkdir(path.join(root, 'artifacts'), { recursive: true });
  console.log(`MCP ready: ${data.entries.length} components, ${data.entries.reduce((n, entry) => n + entry.variants.length, 0)} variants.`);
} finally {
  await browser?.close();
  await server.close();
}
