import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1100},deviceScaleFactor:2});
try {
  await openCatalog(page, `${process.env.TEST_URL || 'http://127.0.0.1:5176'}/?component=builtin-progress`);
  const lab=page.getByRole('region',{name:'Progress playground'});
  await lab.getByRole('slider',{name:'Progress value'}).fill('100');
  await page.waitForTimeout(750);
  assert.equal(await page.locator('.progress-glint').count(),0);
  const bounds=await lab.locator('.progress-track').evaluate(track=>{
    const a=track.getBoundingClientRect(),b=track.querySelector('.progress-fill').getBoundingClientRect();
    return {width:a.width-b.width,height:a.height-b.height,left:a.left-b.left,top:a.top-b.top,edge:getComputedStyle(track,'::after').borderTopWidth};
  });
  assert.deepEqual(bounds,{width:0,height:0,left:0,top:0,edge:'2px'});
  await lab.locator('.progress-track').screenshot({path:'artifacts/progress-full-bleed.png'});
  const ring=page.getByRole('article',{name:'Progress: Circular indeterminate',exact:true});
  await ring.getByRole('button',{name:'Run simulation'}).click();
  await page.waitForTimeout(250);
  assert.equal((await ring.locator('.progress-ring-center').innerText()).trim(),'');
  assert.match(await ring.locator('.progress-status').innerText(),/In progress|Preparing/);
  await ring.screenshot({path:'artifacts/progress-indeterminate-spacing.png'});
  for(const width of [390,320]) {
    await page.setViewportSize({width,height:1100});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  console.log('PASS: status outside ring, no glint, fill covers full track beneath outline, mobile overflow.');
} finally {await browser.close();}
