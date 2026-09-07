import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import { unzipSync } from 'fflate';
import { build, preview } from 'vite';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const name of ['landing', 'settings']) {
    const root = await fs.mkdtemp(path.resolve(`artifacts/standalone-${name}-`));
    const archive = unzipSync(await fs.readFile(`artifacts/downloads/${name}.zip`));
    for (const [file, content] of Object.entries(archive)) {
      const target = path.resolve(root, file);
      assert.ok(target.startsWith(root + path.sep));
      await fs.mkdir(path.dirname(target), { recursive: true });
      await fs.writeFile(target, content);
    }
    await build({ root, configFile: false, logLevel: 'silent' });
    const server = await preview({ root, configFile: false, logLevel: 'silent', preview: { host: '127.0.0.1', port: 4188, strictPort: true } });
    const context = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 960 });
        await page.goto('http://127.0.0.1:4188', { waitUntil: 'domcontentloaded' });
        await page.locator('.example-page').waitFor();
        assert.equal(await page.getByRole('heading', { level: 1 }).count(), 1);
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${name} fits ${width}px`);
        const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        const violations = audit.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.failureSummary) }));
        results.push({ name, width, violations });
        await page.screenshot({ path: `artifacts/${name}-standalone-${width}.png`, fullPage: true });
      }
      if (name === 'landing') {
        await page.getByRole('radio', { name: 'Yearly · save 25%' }).check();
        assert.match(await page.locator('.forma-price').innerText(), /€9/);
        await page.getByRole('button', { name: 'Start your studio' }).click();
        await page.getByRole('textbox', { name: 'Studio name' }).fill('Independent studio');
        await page.getByRole('button', { name: 'Create sample studio' }).click();
        assert.match(await page.locator('.forma-created').innerText(), /Independent studio/);
      } else {
        await page.getByRole('textbox', { name: 'Full name' }).fill('Independent user');
        await page.getByRole('button', { name: 'Save changes' }).click();
        await page.reload();
        assert.equal(await page.getByRole('textbox', { name: 'Full name' }).inputValue(), 'Independent user');
      }
      assert.deepEqual(errors, []);
    } finally { await context.close(); await new Promise(resolve => server.httpServer.close(resolve)); }
  }
} finally { await browser.close(); }
await fs.writeFile('artifacts/standalone-pages.json', JSON.stringify(results, null, 2));
assert.ok(results.every(result => !result.violations.length), 'Standalone pages have no detected accessibility violations');
console.log('PASS: both downloaded pages build and run independently, interact, and pass axe at four widths.');
