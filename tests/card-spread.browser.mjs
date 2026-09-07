import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{width:1440,height:1100} });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await openCatalog(page, process.env.TEST_URL || 'http://127.0.0.1:5176');
  assert.equal(await page.locator('.catalog-card-preview-link').count(), 34);
  await page.getByRole('link', { name:'Explore Card Spread', exact:true}).click();
  const lab = page.getByRole('region', {name:'Card Spread playground'});
  const fan = lab.locator('.card-spread');
  const cards = fan.locator('button');
  await fan.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  await page.mouse.move(0,0);
  await page.waitForTimeout(680);
  await lab.screenshot({path:'artifacts/card-spread-rest.png'});
  for (const index of [6,0,5,1,4,2,3]) {
    const point = await cards.nth(index).evaluate(card => {
      const rect = card.getBoundingClientRect();
      for (let y = Math.max(0, rect.top + 12); y < Math.min(innerHeight, rect.bottom - 12); y += 8) {
        for (let x = Math.max(0, rect.left + 12); x < Math.min(innerWidth, rect.right - 12); x += 8) {
          if (document.elementFromPoint(x,y)?.closest('.card-spread__card') === card) return {x,y};
        }
      }
    });
    assert.ok(point, `Card ${index} has an exposed pointer target`);
    await page.mouse.move(point.x,point.y);
    for (let sample=0; sample<4; sample++) {
      await page.waitForTimeout(140);
      assert.equal(await cards.nth(index).getAttribute('data-active'), 'true', 'Stationary pointer does not switch cards during motion');
      assert.ok(await cards.evaluateAll((nodes, active) => nodes.every((node,i) =>
        i === active || Number(getComputedStyle(node).zIndex) < Number(getComputedStyle(nodes[active]).zIndex)
      ), index), 'The active card is the only frontmost card, including mid-transition');
    }
  }
  await page.mouse.move(0,0);
  await page.waitForTimeout(550);
  await cards.nth(3).hover();
  await page.waitForTimeout(680);
  assert.equal(await cards.nth(3).getAttribute('data-active'), 'true');
  await lab.screenshot({path:'artifacts/card-spread-center.png'});
  await page.mouse.move(0,0);
  await cards.first().focus();
  await cards.first().press('ArrowRight');
  assert.equal(await cards.nth(1).getAttribute('data-active'), 'true');
  await cards.nth(1).press('Home');
  await page.waitForTimeout(680);
  await lab.screenshot({path:'artifacts/card-spread-edge.png'});
  await cards.first().press('Enter');
  assert.equal(await cards.first().getAttribute('aria-pressed'), 'true');
  await cards.first().press('Escape');
  assert.equal(await fan.locator('[data-active=true]').count(), 0);
  // Interrupt settling repeatedly; photos must retain their decoded sources and full geometry.
  const sources = await fan.locator('img').evaluateAll(images => images.map(img => img.currentSrc));
  for (let index = 0; index < 21; index++) {
    await cards.nth(index % 7).focus();
    await page.waitForTimeout(45);
    assert.ok(await fan.locator('img').evaluateAll(images => images.every(img =>
      img.complete && img.naturalWidth > 0 && img.offsetHeight > 0 && getComputedStyle(img).visibility === 'visible'
    )));
  }
  assert.deepEqual(await fan.locator('img').evaluateAll(images => images.map(img => img.currentSrc)), sources);
  await cards.last().press('Escape');
  await lab.getByRole('button',{name:'Dark',exact:true}).click();
  await lab.screenshot({path:'artifacts/card-spread-dark.png'});
  for (const width of [1000,768,390,320]) {
    await page.setViewportSize({width,height:1000});
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
    if (width === 390) await lab.screenshot({path:'artifacts/card-spread-mobile.png'});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await cards.nth(3).focus();
  assert.equal(await cards.nth(3).evaluate(node => getComputedStyle(node).transitionDuration), '0s');
  await page.getByRole('button',{name:'View code: Card Spread Seven perspectives'}).click();
  assert.equal(await page.getByRole('dialog').locator('.card-spread__card').count(),7);
  await page.getByRole('button',{name:'Close example'}).click();
  assert.deepEqual(errors, []);
  console.log('PASS: 34 components, images, hover, keyboard, selection/reset, dark surface, responsive widths, reduced motion and code dialog.');
} finally { await browser.close(); }
