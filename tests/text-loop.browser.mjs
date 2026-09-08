import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('artifacts', { recursive: true });
try {
  await openCatalog(page, process.env.TEST_URL || 'http://127.0.0.1:5176');
  assert.ok(await page.getByRole('link', { name:'Explore Text Loop', exact: true }).isVisible());
  await page.getByRole('link', { name:'Explore Text Loop', exact: true }).click();
  const lab = page.getByRole('article', { name: 'Text Loop playground', exact: true });
  const head = lab.locator('.text-loop-glyph').first();
  const offset = () => head.getAttribute('transform');
  await page.mouse.move(0, 0);
  await page.waitForTimeout(150);
  const first = await offset();
  await page.waitForTimeout(180);
  assert.notEqual(await offset(), first, 'Visible text moves');
  await lab.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await offset();
  await page.waitForTimeout(180);
  assert.equal(await offset(), paused, 'Pause freezes current position');
  await lab.getByRole('button', { name: 'Resume', exact: true }).click();
  await page.waitForTimeout(180);
  assert.notEqual(await offset(), paused, 'Resume continues');
  await lab.locator('.text-loop-svg').hover();
  const hovered = await offset();
  await page.waitForTimeout(180);
  assert.equal(await offset(), hovered, 'Hover pauses');
  await page.mouse.move(0, 0);
  for (const shape of ['Circle', 'Arch', 'Line', 'Wave']) {
    await lab.getByRole('combobox', { name: /^Shape / }).click();
    await page.getByRole('option', { name: shape, exact: true }).click();
    assert.ok(await lab.locator('.text-loop-track').evaluate(node => node.getTotalLength() > 0));
  }
  await lab.getByRole('combobox', { name: /^Shape / }).click();
  await page.getByRole('option', { name: 'Line', exact: true }).click();
  await lab.getByRole('button', { name: 'Reverse', exact: true }).click();
  await page.mouse.move(0, 0);
  await page.waitForTimeout(160);
  const x = async () => Number((await lab.locator('.text-loop-glyph').nth(8).getAttribute('transform')).match(/translate\(([-\d.]+)/)[1]);
  const reverseStart = await x();
  await page.waitForTimeout(160);
  assert.ok(await x() < reverseStart, 'Reverse travels backwards');
  await lab.getByLabel('Your words').fill('');
  await head.waitFor({ state: 'detached' });
  assert.equal(await lab.locator('.text-loop-glyph').count(), 0, 'Empty text has no stray glyphs');
  await lab.getByLabel('Your words').fill('Café 👩‍🎨');
  assert.ok((await lab.locator('.text-loop-glyph').allTextContents()).includes('👩‍🎨'), 'Emoji is a single grapheme');
  await lab.getByLabel('Your words').fill('Curiosity & craft');
  assert.equal(await lab.locator('.text-loop-svg').getAttribute('aria-label'), 'Curiosity & craft');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.waitForTimeout(80);
  const reduced = await offset();
  await page.waitForTimeout(180);
  assert.equal(await offset(), reduced, 'Live reduced motion freezes text');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.waitForTimeout(160);
  assert.notEqual(await offset(), reduced);
  await lab.getByRole('button', { name: 'Pause', exact: true }).focus();
  await page.keyboard.press('Space');
  assert.ok(await lab.getByRole('button', { name: 'Resume', exact: true }).isVisible(), 'Keyboard pause');
  await page.keyboard.press('Space');
  await page.locator('.component-gallery').scrollIntoViewIfNeeded();
  await page.waitForTimeout(100);
  const offscreen = await offset();
  await page.waitForTimeout(180);
  assert.equal(await offset(), offscreen, 'Off-screen animation pauses');
  await lab.scrollIntoViewIfNeeded();
  await lab.screenshot({ path: 'artifacts/text-loop-desktop.png' });
  await lab.getByRole('combobox', { name: 'Surface Light' }).click();
  await page.getByRole('option', { name: 'Dark', exact: true }).click();
  assert.equal(await lab.locator('.text-loop-stage').getAttribute('data-theme'), 'dark');
  await lab.screenshot({ path: 'artifacts/text-loop-dark.png' });
  for (const width of [1000, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
    if (width === 390) await lab.screenshot({ path: 'artifacts/text-loop-mobile.png' });
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.locator('.component-gallery').screenshot({ path: 'artifacts/text-loop-gallery.png' });
  await page.getByRole('button', { name: 'View code: Text Loop Full circle', exact: true }).click();
  assert.ok(await page.getByRole('dialog').isVisible());
  await page.getByRole('button', { name: 'Close example', exact: true }).click();
  assert.deepEqual(errors, []);
  console.log('Text Loop: catalog, motion, pause, hover, shapes, reverse, text edits, reduced motion, themes, responsive layout and code dialog passed.');
} finally {
  await browser.close();
}


