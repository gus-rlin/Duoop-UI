import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({viewport:{width:1440,height:1100}});
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const errors=[];page.on('pageerror',e=>errors.push(e.message));
try {
  await openCatalog(page, `${base}/?component=builtin-progress`);
  const lab=page.getByRole('region',{name:'Progress playground'});
  const slider=lab.getByRole('slider',{name:'Progress value'});
  await slider.fill('10'); await page.waitForTimeout(700);
  await slider.fill('90'); await page.waitForTimeout(120);
  const during=await lab.locator('.duoop-progress').evaluate(node=>({
    counter:parseInt(node.querySelector('.progress-value').textContent),
    scale:new DOMMatrix(getComputedStyle(node.querySelector('.progress-fill')).transform).a,
    value:Number(node.querySelector('[role=progressbar]').getAttribute('aria-valuenow')),
  }));
  assert.ok(during.counter>10 && during.counter<90);
  assert.ok(Math.abs(during.counter-during.scale*100)<1,'Counter and fill share the same clock');
  assert.equal(during.value,90,'Accessible value remains the actual measured value');
  await slider.fill('25');await page.waitForTimeout(700);
  assert.equal(await lab.locator('.progress-value').innerText(),'25%');
  await lab.getByRole('button',{name:'Play sequence',exact:true}).click();
  await page.waitForTimeout(4600);
  assert.equal(await lab.locator('.duoop-progress').getAttribute('data-state'),'finalizing');
  await page.waitForTimeout(500);
  assert.equal(await lab.locator('.duoop-progress').getAttribute('data-state'),'success');
  await lab.screenshot({path:'artifacts/progress-choreography.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await lab.getByRole('button',{name:'Reset preview'}).click();
  await slider.fill('42');
  assert.equal(await lab.locator('.progress-value').innerText(),'42%');
  await page.emulateMedia({reducedMotion:'no-preference'});
  assert.deepEqual(errors,[]);
  console.log('PASS: synchronized numeric motion, interruption, real ARIA values, verification before success, reduced motion.');
} finally {await browser.close();}
