import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const errors = []; page.on('pageerror', error => errors.push(error.message)); page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const example = (kind,title) => page.getByRole('article',{name:`${kind}: ${title}`,exact:true});
async function noOverflow(){assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true)}
async function portalIsVisibleAndContained(locator){const box=await locator.boundingBox();assert.ok(box);assert.equal(await locator.evaluate(node=>Boolean(node.closest('.gallery-card'))),false);const viewport=page.viewportSize();assert.ok(box.x>=0&&box.y>=0&&box.x+box.width<=viewport.width&&box.y+box.height<=viewport.height)}
try{
  await openCatalog(page, `${base}/?component=builtin-accordion`); assert.equal(await page.locator('.gallery-card').count(),15);
  const accordion=example('Accordion','Default'); const trigger=accordion.getByRole('button',{name:'What is included?'}); assert.equal(await trigger.getAttribute('aria-expanded'),'true'); await trigger.click(); assert.equal(await trigger.getAttribute('aria-expanded'),'false'); await accordion.getByRole('button',{name:'How does billing work?'}).press('ArrowDown'); assert.equal(await accordion.getByRole('button',{name:'Where is my data stored?'}).evaluate(node=>node===document.activeElement),true);

  await openCatalog(page, `${base}/?component=builtin-select`); assert.equal(await page.locator('.gallery-card').count(),22); assert.equal(await page.evaluate(()=>scrollY),0);
  const select=example('Select','Default').locator('.duoop-select'); await select.click(); assert.equal(await select.getAttribute('aria-expanded'),'true'); const selectList=page.locator(`[id="${await select.getAttribute('aria-controls')}"]`); await portalIsVisibleAndContained(selectList); assert.ok((await selectList.boundingBox()).width<400); await select.press('ArrowDown'); await select.press('Enter'); assert.equal(await select.innerText(),'Engineering');
  await select.click(); await page.mouse.wheel(0,120); await page.waitForTimeout(50); assert.equal(await select.getAttribute('aria-expanded'),'false'); assert.equal(await selectList.count(),0);
  const multiple=example('Select','Multiple selection'); const multipleTrigger=multiple.locator('.duoop-select'); await multipleTrigger.click(); const multipleList=page.locator(`[id="${await multipleTrigger.getAttribute('aria-controls')}"]`); assert.equal(await multipleList.getAttribute('aria-multiselectable'),'true');
  const triggerIcon=example('Select','Trigger icon').locator('.select-rich-value svg'); assert.deepEqual(await triggerIcon.evaluate(node=>{const box=node.getBoundingClientRect();return {fill:getComputedStyle(node).fill,width:box.width,height:box.height}}),{fill:'none',width:18,height:18});
  const longSelect=example('Select','Long scrollable list'); const longTrigger=longSelect.locator('.duoop-select'); await longTrigger.click(); const longList=page.locator(`[id="${await longTrigger.getAttribute('aria-controls')}"]`); await longList.hover(); await page.mouse.wheel(0,160); assert.equal(await longTrigger.getAttribute('aria-expanded'),'true'); await longTrigger.press('Escape');

  await openCatalog(page, `${base}/?component=builtin-menu`); assert.equal(await page.locator('.gallery-card').count(),20);
  const menu=example('Dropdown Menu','Default'); await menu.getByRole('button',{name:'Actions'}).click(); const menuPopup=page.getByRole('menu',{name:'Default actions'}); assert.equal(await menuPopup.isVisible(),true); await portalIsVisibleAndContained(menuPopup); await menuPopup.getByRole('menuitem',{name:'Edit document'}).press('ArrowDown'); assert.equal(await menuPopup.getByRole('menuitem',{name:'Duplicate'}).evaluate(node=>node===document.activeElement),true); await page.keyboard.press('Escape'); assert.equal(await menu.getByRole('button',{name:'Actions'}).evaluate(node=>node===document.activeElement),true);
  await menu.getByRole('button',{name:'Actions'}).click(); await page.mouse.wheel(0,120); await page.waitForTimeout(50); assert.equal(await menu.getByRole('button',{name:'Actions'}).getAttribute('aria-expanded'),'false');
  const nested=example('Dropdown Menu','Nested menu'); await nested.getByRole('button',{name:'Actions'}).click(); const nestedRoot=page.getByRole('menu',{name:'Nested menu actions'}); const submenuTrigger=nestedRoot.getByRole('menuitem',{name:'Move to'}); await submenuTrigger.focus(); await submenuTrigger.press('ArrowRight'); const submenu=page.getByRole('menu',{name:'Move to'}); await portalIsVisibleAndContained(submenu);

  await openCatalog(page, `${base}/?component=builtin-dialog`); assert.equal(await page.locator('.gallery-card').count(),18);
  await example('Dialog','Information').getByRole('button',{name:'Open information'}).click(); const dialog=page.getByRole('dialog',{name:'Good work starts here.'}); await dialog.waitFor(); assert.equal(await dialog.isVisible(),true); await page.waitForTimeout(250); const dialogBox=await dialog.boundingBox(); assert.ok(dialogBox.width<700&&dialogBox.height<700); assert.ok(Math.abs(dialogBox.x+dialogBox.width/2-page.viewportSize().width/2)<2); await dialog.getByRole('button',{name:'Close dialog'}).click(); assert.equal(await dialog.isVisible(),false);
  for(const width of [1024,390]){await page.setViewportSize({width,height:844});await noOverflow()}
  await page.emulateMedia({reducedMotion:'reduce'}); await openCatalog(page, `${base}/?component=builtin-accordion`); assert.equal(await page.locator('.duoop-accordion__region').first().evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  assert.deepEqual(errors,[]); console.log('PASS: Accordion, Select, Dropdown Menu and Dialog examples, semantics, keyboard, mobile overflow and reduced motion.');
}finally{await browser.close()}
