import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await mkdir('artifacts', { recursive: true });
try {
  await openCatalog(page, base);
  assert.equal(await page.locator('.catalog-card-preview-link').count(), 33);
  await page.getByRole('link', { name:'Explore Kinetic Type', exact: true }).click();
  const playground = page.getByRole('region', { name: 'Kinetic Type playground' });
  const letters = playground.locator('.kinetic-type__letter');
  const snapshot = () => letters.evaluateAll(nodes => nodes.map(node => node.style.transform).join('|'));
  await expect.poll(snapshot, { timeout: 10000 }).toMatch(/^(translate\(0px, 0px\)\|?)+$/);
  const settled = await snapshot();
  await playground.getByRole('button', { name: 'Replay animation' }).click();
  await page.waitForTimeout(160);
  assert.notEqual(await snapshot(), settled, 'Entrance visibly moves letters');
  await playground.getByRole('button', { name: 'Pause', exact: true }).click();
  const paused = await snapshot();
  await page.waitForTimeout(250);
  assert.equal(await snapshot(), paused, 'Pause freezes animation');
  await playground.getByRole('button', { name: 'Resume', exact: true }).click();
  await expect.poll(snapshot, { timeout: 10000, message: 'Resume reaches final layout' }).toBe(settled);
  for (const effect of ['Wave', 'Flip', 'Scatter']) {
    await playground.getByRole('button', { name: effect, exact: true }).click();
    await page.waitForTimeout(120);
    assert.notEqual(await snapshot(), settled, `${effect} animates`);
    await page.waitForTimeout(2000);
  }
  await playground.getByRole('button', { name: 'Replay animation' }).click({ clickCount: 3 });
  await page.waitForTimeout(2000);
  assert.equal(await snapshot(), settled, 'Rapid replay settles');
  await page.screenshot({ path: 'artifacts/kinetic-desktop.png' });
  // The playground composes the library controls and its shared semantic theme.
  const stage = playground.locator('.kinetic-stage');
  assert.ok(await letters.first().evaluate(node => getComputedStyle(node).fontFamily.includes('DM Sans')));
  await playground.getByRole('combobox', { name: 'Surface Light' }).press('ArrowDown');
  await playground.getByRole('combobox', { name: 'Surface Light' }).press('End');
  await playground.getByRole('combobox', { name: 'Surface Light' }).press('Enter');
  assert.equal(await stage.getAttribute('data-theme'), 'dark');
  assert.equal(await stage.evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(37, 35, 35)');
  await page.waitForTimeout(300);
  await playground.screenshot({ path: 'artifacts/kinetic-dark.png' });
  await playground.getByRole('combobox', { name: 'Surface Dark' }).click();
  await page.getByRole('option', { name: 'Light', exact: true }).click();
  assert.equal(await stage.evaluate(node => getComputedStyle(node).backgroundColor), 'rgb(255, 255, 255)');
  await page.locator('.component-gallery').scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  await page.locator('.component-gallery').screenshot({ path: 'artifacts/kinetic-gallery.png' });
  for (const width of [1000, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
    assert.ok(await letters.evaluateAll(nodes => nodes.every(node => {
      const a = node.getBoundingClientRect(), b = node.closest('.kinetic-stage').getBoundingClientRect();
      return a.left >= b.left && a.right <= b.right;
    })), `Headline fits at ${width}`);
    if (width === 390) await playground.screenshot({ path: 'artifacts/kinetic-mobile.png' });
  }
  await playground.getByLabel('Your words').fill('Élan 👩‍🚀\nGO.');
  assert.equal(await letters.count(), 9, 'Joined emoji remains one grapheme');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await playground.getByRole('button', { name: 'Replay animation' }).click();
  await page.waitForTimeout(150);
  assert.ok(await letters.evaluateAll(nodes => nodes.every(node => getComputedStyle(node).transform === 'none' && getComputedStyle(node).opacity === '1')));
  await playground.getByLabel('Your words').fill('');
  await playground.getByLabel('Your words').fill('W'.repeat(80));
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await page.getByRole('button', { name: 'View code: Kinetic Type Scatter & settle' }).click();
  await page.getByRole('button', { name: 'Close example' }).press('Enter');
  await page.locator('.back-link').click();
  assert.equal(await page.getByRole('link', { name:'Explore Kinetic Type', exact: true }).count(), 1);
  assert.deepEqual(errors, []);
  console.log('PASS: catalogue, three animated entrances, pause/resume, rapid replay, five widths, graphemes, reduced motion, empty text, source dialog and navigation.');
} finally { await browser.close(); }
