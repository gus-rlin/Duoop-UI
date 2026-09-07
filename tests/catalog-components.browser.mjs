import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const example = (kind, title) => page.getByRole('article', { name: `${kind}: ${title}`, exact: true });
async function noOverflow() { assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true); }
try {
  await openCatalog(page, `${base}/?component=builtin-card`);
  assert.equal(await page.locator('.gallery-card').count(), 22);
  const selection = example('Card', 'Selection card').locator('.duoop-card');
  assert.equal(await selection.evaluate(node => node.tagName), 'BUTTON');
  await selection.click();
  assert.equal(await selection.getAttribute('aria-pressed'), 'true');
  assert.equal(await example('Card', 'Fully clickable').locator('a.duoop-card').count(), 1);
  assert.equal(await example('Card', 'Loading skeleton').locator('[aria-busy=true]').count(), 1);
  await noOverflow();

  await openCatalog(page, `${base}/?component=builtin-badge`);
  assert.equal(await page.locator('.gallery-card').count(), 14);
  assert.equal(await page.locator('.badge-matrix .duoop-badge').count(), 18);
  const badgeButton = example('Badge', 'As button').locator('button.duoop-badge');
  await badgeButton.click();
  assert.equal(await badgeButton.getAttribute('aria-pressed'), 'true');
  const removable = example('Badge', 'Removable');
  await removable.getByRole('button', { name: 'Remove Research' }).click();
  assert.equal(await removable.getByRole('button', { name: 'Restore badge' }).isVisible(), true);

  await openCatalog(page, `${base}/?component=builtin-tabs`);
  assert.equal(await page.locator('.gallery-card').count(), 21);
  const contained = example('Tabs', 'Contained');
  await contained.getByRole('tab', { name: 'Overview' }).press('ArrowRight');
  assert.equal(await contained.getByRole('tab', { name: 'Activity' }).getAttribute('aria-selected'), 'true');
  assert.match(await contained.getByRole('tabpanel').innerText(), /Recent changes/);
  const disabled = example('Tabs', 'Disabled tab');
  await disabled.getByRole('tab', { name: 'Overview' }).press('ArrowRight');
  assert.equal(await disabled.getByRole('tab', { name: 'Settings' }).getAttribute('aria-selected'), 'true');
  const manual = example('Tabs', 'Manual activation');
  await manual.getByRole('tab', { name: 'Overview' }).press('ArrowRight');
  assert.equal(await manual.getByRole('tab', { name: 'Overview' }).getAttribute('aria-selected'), 'true');
  await manual.getByRole('tab', { name: 'Activity' }).press('Enter');
  assert.equal(await manual.getByRole('tab', { name: 'Activity' }).getAttribute('aria-selected'), 'true');
  assert.equal(await example('Tabs', 'Links pattern').locator('[role=tab][href]').count(), 3);
  assert.equal(await example('Tabs', 'Keep mounted').locator('[role=tabpanel]').count(), 3);
  for (const width of [1024, 390]) { await page.setViewportSize({ width, height: 844 }); await noOverflow(); }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await page.locator('.duoop-tabs__indicator').first().evaluate(node => getComputedStyle(node).transitionDuration), '0s');
  assert.deepEqual(errors, []);
  console.log('PASS: Card, Badge and Tabs semantics, interaction, keyboard, mobile overflow and reduced motion.');
} finally { await browser.close(); }
