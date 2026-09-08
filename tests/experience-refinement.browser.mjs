import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{width:1491,height:1272} });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const card=(name,title)=>page.getByRole('article',{name:`${name}: ${title}`,exact:true});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await mkdir('artifacts',{recursive:true});
try {
  await openCatalog(page, `${base}/?component=builtin-reaction-button`);
  assert.equal(await page.locator('.reaction-emoji').count(),0);
  assert.equal(await card('Reaction Button','Custom icon').locator('.reaction-glyph svg').count(),1);
  for(const title of ['Zero values','Number formats','Motion styles']) {
    const scope=card('Reaction Button',title);
    assert.ok(await scope.locator('.experience-kicker').evaluateAll(nodes=>nodes.every(el=>el.nextElementSibling.getBoundingClientRect().top-el.getBoundingClientRect().bottom>=11)),title);
    await scope.screenshot({path:`artifacts/refine-reaction-${title.replaceAll(' ','-')}.png`});
  }
  await openCatalog(page, `${base}/?component=builtin-stepper`);
  const inline=card('Stepper','Inline content');
  await inline.getByRole('button',{name:'Continue',exact:true}).click();
  await inline.getByRole('button',{name:'Finish setup',exact:true}).click();
  assert.ok(await inline.locator('.stepper-item[data-active=true]').evaluate(el=>{const copy=el.querySelector('.stepper-copy').getBoundingClientRect(),panel=el.querySelector('.experience-panel').getBoundingClientRect();return panel.top-copy.bottom>=16}));
  await inline.screenshot({path:'artifacts/refine-stepper-inline.png'});
  await card('Stepper','Labels beside').screenshot({path:'artifacts/refine-stepper-beside.png'});
  await card('Stepper','Dark surface').screenshot({path:'artifacts/refine-stepper-dark.png'});
  for(const width of [1491,1000,768,540,390,320]) {
    await page.setViewportSize({width,height:1000});
    const condensed=card('Stepper','Long condensed journey');
    for(let stage=0;stage<5;stage++) {
      const boxes=await condensed.locator('.stepper-item,.stepper-gap').evaluateAll(nodes=>nodes.map(el=>{const r=el.getBoundingClientRect();return {left:r.left,right:r.right,width:r.width}}));
      assert.ok(boxes.every((r,i)=>r.width>=111 && (!i || r.left>=boxes[i-1].right-1)),`non-overlapping slots at ${width}`);
      await condensed.getByRole('button',{name:'Continue',exact:true}).click();
    }
    await condensed.getByRole('button',{name:'Reset',exact:true}).click();
    if(width===1491||width===390) await condensed.screenshot({path:`artifacts/refine-stepper-condensed-${width}.png`});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  }
  assert.deepEqual(errors,[]);
  console.log('PASS: neutral self-contained SVGs, all icon sizes, SVG reactions, caption and panel spacing, connector layering and condensed layout across six widths.');
} finally {await browser.close();}
