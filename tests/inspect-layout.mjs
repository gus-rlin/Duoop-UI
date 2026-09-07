import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext();
const page = await context.newPage();
const results = [];
for (const width of [1440, 390, 320]) {
  await page.setViewportSize({ width, height:960 });
  for (const route of ['/', '/?page=installation', '/?component=builtin-menu&tab=code', '/?page=examples', '/?page=examples&example=landing', '/?page=examples&example=settings']) {
    await page.goto(`http://127.0.0.1:5176${route}`);
    await page.locator('h1').first().waitFor();
    await page.locator('.page-loading').waitFor({ state: 'hidden' });
    await page.evaluate(() => document.fonts.ready);
    await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime)).map(animation => animation.finished.catch(() => {}))));
    const overflow = await page.evaluate(() => [...document.querySelectorAll('*')].filter(node => { const box = node.getBoundingClientRect(); return box.width && (box.right > innerWidth + 1 || box.left < -1) && getComputedStyle(node).visibility !== 'hidden'; }).map(node => ({ tag:node.tagName, class:node.className?.baseVal ?? node.className, width:Math.round(node.getBoundingClientRect().width), right:Math.round(node.getBoundingClientRect().right) })).slice(0, 15));
    const result = await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
    results.push({ width, route, overflow, violations:result.violations.map(item => ({ id:item.id, nodes:item.nodes.map(node => ({ target:node.target, summary:node.failureSummary })) })) });
  }
}
await fs.mkdir('artifacts', { recursive:true });
await fs.writeFile('artifacts/layout-audit.json', JSON.stringify(results,null,2));
console.log(JSON.stringify(results.map(({width,route,overflow,violations}) => ({width,route,overflow:overflow.slice(0,5),violations:violations.map(v=>({id:v.id,count:v.nodes.length,first:v.nodes[0]}))})),null,2));
await browser.close();
