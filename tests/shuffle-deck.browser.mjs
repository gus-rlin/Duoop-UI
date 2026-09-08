import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{width:1440,height:1100} });
const errors = []; page.on('pageerror', e => errors.push(e.message));
try {
  await openCatalog(page, process.env.TEST_URL || 'http://127.0.0.1:5176');
  assert.equal(await page.locator('.catalog-card-preview-link').count(),33);
  await page.getByRole('link', { name:'Explore Shuffle Deck',exact:true}).click();
  const lab=page.getByRole('region',{name:'Shuffle Deck playground'});
  const deck=lab.getByRole('region',{name:'Studio deck'});
  const viewport=deck.locator('.shuffle-deck__viewport');
  const status=deck.getByRole('status').filter({hasText:/\d/});
  const active=()=>deck.locator('.shuffle-deck__card[aria-hidden=false]');
  await page.waitForTimeout(650);
  await page.screenshot({path:'artifacts/shuffle-desktop.png'});
  await deck.getByRole('button',{name:'Next card'}).click();
  await page.waitForTimeout(950);
  assert.equal(await status.innerText(),'2 / 4');
  assert.match(await active().innerText(),/Make room/);
  await viewport.press('ArrowLeft'); await page.waitForTimeout(950);
  assert.equal(await status.innerText(),'1 / 4');
  await viewport.press('ArrowLeft'); await page.waitForTimeout(950);
  assert.equal(await status.innerText(),'4 / 4');
  await viewport.press('ArrowRight'); await page.waitForTimeout(950);
  async function drag(distance) {
    const box=await viewport.boundingBox();
    await page.mouse.move(box.x+box.width/2,box.y+150);
    await page.mouse.down(); await page.mouse.move(box.x+box.width/2+distance,box.y+150,{steps:12});
    await page.mouse.up(); await page.waitForTimeout(950);
  }
  await drag(-100); assert.equal(await status.innerText(),'2 / 4');
  await drag(25); assert.equal(await status.innerText(),'2 / 4');
  await drag(110); assert.equal(await status.innerText(),'1 / 4');
  await lab.getByRole('button',{name:'Stack',exact:true}).click();
  await page.waitForTimeout(650);
  assert.equal(await active().count(),1);
  for(const width of [1000,768,390,320]) {
    await page.setViewportSize({width,height:1100});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}`);
    assert.ok(await active().evaluate(node=>node.scrollHeight<=node.clientHeight),`Card text fits at ${width}`);
    if(width===390) await lab.screenshot({path:'artifacts/shuffle-mobile.png'});
  }
  await deck.getByRole('button',{name:'Next card'}).click();
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForTimeout(100);
  assert.equal(await status.innerText(),'2 / 4','Changing motion preference during exit completes navigation');
  await deck.getByRole('button',{name:'Next card'}).click();
  assert.equal(await status.innerText(),'3 / 4');
  assert.equal(await active().evaluate(node=>getComputedStyle(node).opacity),'1');
  for(let i=0;i<4;i++) {
    assert.ok(await active().evaluate(node=>node.scrollHeight<=node.clientHeight),'Every card fits at 320 px');
    await deck.getByRole('button',{name:'Next card'}).click();
  }
  await page.setViewportSize({width:1440,height:1100});
  await lab.getByRole('combobox', { name: 'Surface Light' }).click();
  await page.getByRole('option',{name:'Dark',exact:true}).click();
  await page.waitForTimeout(250);
  await lab.screenshot({path:'artifacts/shuffle-dark.png'});
  await page.locator('.component-gallery').screenshot({path:'artifacts/shuffle-gallery.png'});
  await page.getByRole('button',{name:'View code: Shuffle Deck Studio cards'}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Next card'}).click();
  await page.getByRole('button',{name:'Close example'}).click();
  await page.locator('.back-link').click();
  assert.deepEqual(errors,[]);
  console.log('PASS: 24 entries, buttons, keyboard, wraparound, drag, snap back, themes, five widths, reduced motion, modal and cleanup.');
} finally {await browser.close();}
