import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true, channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome' });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('artifacts', { recursive: true });
try {
  await openCatalog(page, process.env.TEST_URL || 'http://127.0.0.1:5176');
  await page.getByRole('link', { name:'Explore Bento Grid', exact: true }).click();
  const lab = page.getByRole('region', { name: 'Bento Grid playground' });
  const layout = lab.getByRole('button', { name: 'Change layout' });
  await layout.focus();
  await layout.press('Enter');
  assert.equal(await layout.getAttribute('aria-pressed'), 'true');
  await layout.press('Enter');
  assert.equal(await layout.getAttribute('aria-pressed'), 'false');
  await lab.getByRole('button', { name: 'Add to collection' }).click();
  assert.match(await lab.locator('.bento-status').innerText(), /Added/);
  await lab.getByRole('button', { name: 'Undo', exact: true }).click();
  assert.match(await lab.locator('.bento-status').innerText(), /Try/);
  await lab.screenshot({ path: 'artifacts/bento-desktop.png' });
  for (const width of [900, 390]) {
    await page.setViewportSize({ width, height: 950 });
    assert.equal(await lab.evaluate(el => el.scrollWidth <= el.clientWidth), true);
    const count = await lab.locator('.duoop-bento__grid').evaluate(el => getComputedStyle(el).gridTemplateColumns.split(' ').length);
    assert.equal(count, width === 390 ? 1 : 2);
    await lab.screenshot({ path: `artifacts/bento-${width}.png` });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await layout.click();
  assert.equal(await lab.locator('.bento-drawing__layout').evaluate(el => getComputedStyle(el).animationName), 'none');
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.getByRole('button', { name: 'View code: Bento Grid Dark surface', exact: true }).click();
  await page.locator('dialog[open] .bento-demo').screenshot({ path: 'artifacts/bento-dark.png' });
  await page.getByRole('button', { name: 'Close example', exact: true }).click();
  assert.deepEqual(errors, []);
  console.log('Bento Grid: navigation, keyboard, layout, add/undo, responsive, reduced motion, dark dialog passed.');
} finally { await browser.close(); }
