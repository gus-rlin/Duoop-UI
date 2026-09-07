import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await openCatalog(page, base);
  assert.equal((await page.locator('.collection-count').innerText()).replace(/\s+/g, ' '), '34 components');
  await openCatalog(page, `${base}/?component=builtin-reset-limit`);
  const demo = page.locator('.reset-limit-hero .reset-limit');
  const button = demo.getByRole('button', { name: 'Reset Limit', exact: true });
  await button.hover();
  await page.screenshot({ path: 'tests/reset-limit-desktop.png' });
  await button.focus();
  await button.press('Enter');
  await page.waitForTimeout(300);
  assert.equal(await demo.getAttribute('data-phase'), 'resetting');
  await page.screenshot({ path: 'tests/reset-limit-motion.png' });
  await button.press('Space');
  assert.equal(await button.evaluate(node => node === document.activeElement), true);
  await page.waitForTimeout(1350);
  assert.equal(await demo.getAttribute('data-phase'), 'done');
  assert.match(await demo.innerText(), /0%/);
  await button.click();
  await page.waitForTimeout(1350);
  assert.equal(await demo.getAttribute('data-phase'), 'done');
  assert.equal(await page.locator('.reset-limit button:disabled').count(), 1);
  for (const width of [1024, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await page.screenshot({ path: 'tests/reset-limit-mobile.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await button.click();
  assert.equal(await demo.getAttribute('data-phase'), 'done');
  assert.equal(await button.evaluate(node => getComputedStyle(node).animationName), 'none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await button.click();
  await page.locator('.back-link').click();
  await page.locator('.catalog-preview--reset-limit').scrollIntoViewIfNeeded();
  await page.locator('.reset-limit-mini').waitFor();
  assert.equal(await page.locator('.reset-limit-mini').count(), 1);
  assert.deepEqual(errors, []);
  console.log('PASS: catalogue entry, replay, keyboard focus, disabled, reduced motion, responsive layouts and unmount.');
} finally { await browser.close(); }
