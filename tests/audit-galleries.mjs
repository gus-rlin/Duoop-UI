import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { entries } from '../src/catalog/catalog.js';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 960 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const results = [];
try {
  for (const entry of entries) {
    await page.setViewportSize({ width: 1440, height: 960 });
    await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:5176'}/?component=${entry.id}`, { waitUntil: 'domcontentloaded' });
    await page.locator('.button-showcase').waitFor();
    await page.evaluate(() => document.fonts.ready);
    const audit = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const violations = audit.violations.map(item => ({ width: 1440, id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) }));
    const overflow = [];
    for (const width of [390, 320]) {
      await page.setViewportSize({ width, height: 960 });
      const documentWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      if (documentWidth > width + 1) overflow.push({ viewport: width, document: documentWidth });
      if (width === 390) {
        const mobile = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        violations.push(...mobile.violations.map(item => ({ width, id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })));
      }
    }
    results.push({ component: entry.name, violations, overflow });
    console.log(`${entry.name}: ${violations.map(item => `${item.id} at ${item.width}px (${item.nodes.length})`).concat(overflow.map(item => `overflow at ${item.viewport}px`)).join(', ') || 'passed'}`);
  }
  await fs.mkdir('artifacts', { recursive: true });
  await fs.writeFile('artifacts/gallery-accessibility.json', JSON.stringify(results, null, 2));
  if (results.some(item => item.violations.length || item.overflow.length)) process.exitCode = 1;
} finally { await browser.close(); }
