import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer, build } from 'vite';
import { chromium, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import { entries } from '../src/catalog/catalog.js';
import { essentialRecipes } from '../src/catalog/essential-recipes.js';

const selected = entries.filter(entry => Object.hasOwn(essentialRecipes, entry.id.slice(8)));
const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const base = server.resolvedUrls.local[0];
await fs.mkdir('artifacts/essential-downloads', { recursive: true });
const root = await fs.mkdtemp(path.resolve('artifacts/essential-downloads/run-'));
const results = [];
const runtimeErrors = [];
page.on('pageerror', error => runtimeErrors.push(error.message));

async function verify(button, name, entry) {
  const pending = page.waitForEvent('download');
  await button.click();
  const download = await pending;
  const archive = path.join(root, `${name}.zip`);
  await download.saveAs(archive);
  const files = Object.fromEntries(Object.entries(unzipSync(await fs.readFile(archive))).map(([key, value]) => [key, strFromU8(value)]));
  assert.ok(files['src/App.jsx']);
  assert.ok(files[entry.path]);
  assert.ok(files['THIRD_PARTY_NOTICES.md'].includes('MIT License'));
  const deps = JSON.parse(files['package.json']).dependencies;
  assert.ok(Object.values(deps).every(version => version !== '*'));
  const directory = path.join(root, name);
  for (const [file, content] of Object.entries(files)) {
    const target = path.resolve(directory, file);
    assert.ok(target.startsWith(directory + path.sep), 'Archive path stays inside its destination');
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, content);
  }
  await build({ configFile: false, root: directory, logLevel: 'silent', build: { write: false } });
  results.push(name);
}
try {
  for (const entry of selected) {
    await page.goto(`${base}?component=${entry.id}&tab=code`);
    await expect(page.locator('.bundle-files')).toBeVisible();
    await verify(page.getByRole('button', { name: 'Download project' }), entry.id, entry);
    await page.getByRole('tab', { name: 'Preview', exact: true }).click();
    await expect(page.locator('.button-showcase')).toBeVisible();
    const variants = page.getByRole('button', { name: /^View code:/ });
    for (let index = 0; index < await variants.count(); index++) {
      await variants.nth(index).click();
      const dialog = page.locator('dialog[open]').last();
      await expect(dialog.locator('.bundle-files')).toBeVisible();
      await verify(dialog.getByRole('button', { name: 'Download project' }), `${entry.id}-example-${index + 1}`, entry);
      await dialog.getByRole('button', { name: 'Close example' }).click();
    }
    console.log(`PASS downloadable ${entry.name} starter and variants`);
  }
  assert.deepEqual(runtimeErrors, []);
  await fs.writeFile('artifacts/essential-downloads/results.json', JSON.stringify({ built: results.length, projects: results }, null, 2));
  console.log(`PASS ${results.length} actual downloaded projects build with declared dependencies and retained licenses.`);
} finally { await browser.close(); await server.close(); }
