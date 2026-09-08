import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from 'vite';
import { chromium } from '@playwright/test';
import { entries } from '../src/catalog/catalog.js';

const server = await createServer({ server: { host: '127.0.0.1', port: 0 }, logLevel: 'error' });
await server.listen();
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, reducedMotion: 'reduce' });
await fs.mkdir('artifacts/focus', { recursive: true });
let total = 0;
try {
  for (const entry of entries) {
    await page.goto(`${server.resolvedUrls.local[0]}?component=${entry.id}`);
    await page.locator('.button-showcase').waitFor();
    // Use keyboard modality, then exercise every focusable control in live previews.
    await page.keyboard.press('Tab');
    const result = await page.evaluate(() => {
      let count = 0;
      const rings = [];
      const controls = document.querySelectorAll('.gallery-card-preview :is(button, a[href], input, textarea, select, [tabindex])');
      for (const node of controls) {
        if (node.disabled || node.tabIndex < 0 || !node.getClientRects().length) continue;
        node.focus({ preventScroll: true });
        if (document.activeElement !== node) continue;
        count++;
        const targets = new Set([node, node.nextElementSibling]);
        for (let ancestor = node.parentElement; ancestor?.closest('.gallery-card-preview'); ancestor = ancestor.parentElement) targets.add(ancestor);
        node.querySelectorAll('*').forEach(child => targets.add(child));
        for (const target of targets) {
          if (!target) continue;
          for (const pseudo of [null, '::before', '::after']) {
            const style = getComputedStyle(target, pseudo);
            if (!['none', 'hidden'].includes(style.outlineStyle) && parseFloat(style.outlineWidth) > 0) {
              rings.push(`${target.className}${pseudo || ''}: ${style.outline}`);
            }
          }
        }
      }
      return { count, rings: [...new Set(rings)] };
    });
    total += result.count;
    assert.deepEqual(result.rings, [], `${entry.id}: unexpected focus rings`);
    console.log(`PASS ${entry.id}: ${result.count} focused controls`);
    if (entry.id === 'builtin-input-group') {
      const input = page.locator('.gallery-card-preview .duoop-input-group input').first();
      await input.focus();
      await input.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'artifacts/focus/source-input-group.png' });
      await page.setViewportSize({ width: 390, height: 844 });
      await input.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'artifacts/focus/source-input-group-mobile.png' });
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
      await page.setViewportSize({ width: 1280, height: 900 });
    }
  }
  assert.ok(total > 100, 'The catalog must expose real interactive previews');
  console.log(`PASS: ${total} controls across ${entries.length} component families without focus rings.`);
} finally {
  await browser.close();
  await server.close();
}
