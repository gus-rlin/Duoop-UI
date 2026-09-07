import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{ width:1440,height:1000 } });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const card = (kind,title) => page.getByRole('article',{ name:`${kind}: ${title}`,exact:true });
await mkdir('artifacts',{ recursive:true });
try {
  for (const [id,name] of [['stepper','Stepper'],['reaction-button','Reaction Button'],['achievement','Achievement']]) {
    await openCatalog(page, `${base}/?component=builtin-${id}`);
    const lab = page.getByRole('region',{ name:`${name} playground` });
    await lab.getByRole('switch',{ name:'Dark surface' }).check();
    if (id === 'stepper') {
      await lab.getByRole('switch',{ name:'Long labels' }).check();
      await lab.getByRole('switch',{ name:'Right to left' }).check();
      assert.equal(await lab.locator('.duoop-stepper').evaluate(el => getComputedStyle(el).direction),'rtl');
    }
    await page.waitForTimeout(350);
    await lab.screenshot({ path:`artifacts/${id}-dark.png` });
    if (id === 'achievement') {
      const ratios = await lab.locator('.duoop-badge').evaluateAll(nodes => nodes.map(el => {
        const luminance = value => value.match(/[\d.]+/g).slice(0,3).map(Number).map(c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum,c,index) => sum+c*[.2126,.7152,.0722][index],0);
        const style = getComputedStyle(el); const a = luminance(style.color), b = luminance(style.backgroundColor);
        return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
      }));
      assert.ok(ratios.every(ratio => ratio >= 4.5));
    }
    await card(name,'Right to left').screenshot({ path:`artifacts/${id}-rtl.png` });
  }
  await openCatalog(page, `${base}/?component=builtin-stepper`);
  const step = card('Stepper','Numbered journey');
  await step.getByRole('button',{ name:'Continue',exact:true }).click();
  assert.ok(await step.locator('.stepper-marker').evaluateAll(nodes => nodes.some(el => el.getAnimations().length > 0)), 'Step changes animate');
  await step.screenshot({ path:'artifacts/stepper-motion.png',animations:'allow' });
  await openCatalog(page, `${base}/?component=builtin-reaction-button`);
  const like = card('Reaction Button','Like with count');
  const before = await like.locator('.reaction-button').boundingBox();
  await like.locator('.reaction-button').hover();
  await page.waitForTimeout(240);
  const lifted = await like.locator('.reaction-button').boundingBox();
  assert.ok(lifted.y < before.y,'Reaction hover lifts the existing button');
  await like.locator('.reaction-button').click();
  const after = await like.locator('.reaction-button').boundingBox();
  assert.ok(Math.abs(after.width - before.width) < 1,'Adaptive reaction labels preserve button width');
  assert.ok(await like.locator('.reaction-glyph').evaluate(el => el.getAnimations().length > 0));
  await like.screenshot({ path:'artifacts/reaction-motion.png',animations:'allow' });
  await page.waitForTimeout(550);
  assert.ok(await like.locator('.reaction-particles i').evaluateAll(nodes => nodes.every(el => getComputedStyle(el).opacity === '0')));
  await openCatalog(page, `${base}/?component=builtin-achievement`);
  await card('Achievement','Celebration dialog').getByRole('button',{ name:'Replay unlock' }).click();
  const modal = page.getByRole('dialog',{ name:'A moment well earned.' });
  assert.ok(await modal.locator('.achievement-emblem').evaluate(el => el.getAnimations().length > 0));
  await modal.screenshot({ path:'artifacts/achievement-motion.png',animations:'allow' });
  await page.waitForTimeout(750);
  await modal.screenshot({ path:'artifacts/achievement-settled.png' });
  await page.keyboard.press('Escape');
  await openCatalog(page, base);
  await page.getByRole('link', { name:'Explore Achievement',exact:true }).scrollIntoViewIfNeeded();
  await page.screenshot({ path:'artifacts/experience-library-new.png' });
  console.log('Passed: theme contrast, RTL, tactile hover, stable labels and transient motion. Captured desktop, dark, RTL, in-flight and settled states.');
} finally { await browser.close(); }
