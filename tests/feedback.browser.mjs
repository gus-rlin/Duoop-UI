import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport:{width:1440,height:1000}, permissions:['clipboard-read','clipboard-write'] });
const errors = [];
page.on('pageerror', e => errors.push(e.message));
const url = process.env.TEST_URL || 'http://127.0.0.1:5176';
try {
  await openCatalog(page, `${url}/?component=builtin-checkbox`);
  const filter = name => page.getByRole('group',{name:'Filter checkbox examples'}).getByRole('button',{name,exact:true}).click();
  const card = title => page.getByRole('article',{name:`Checkbox: ${title}`,exact:true});
  await filter('Theme & direction');
  await page.locator('.gallery-groups').scrollIntoViewIfNeeded();
  await page.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
  await page.screenshot({path:'artifacts/checkbox-themes-refined.png'});
  await filter('Presentation');
  await card('With illustration').scrollIntoViewIfNeeded();
  await page.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
  await page.screenshot({path:'artifacts/checkbox-illustration-refined.png'});
  await filter('Validation');
  for(const title of ['Invalid checked','Invalid unchecked']) {
    const input = card(title).getByRole('checkbox');
    await input.focus();
    const style = await input.evaluate(el => { const s = getComputedStyle(el.nextElementSibling); return { outline:s.outlineStyle, border:s.borderTopColor, shadow:s.boxShadow, bg:s.backgroundColor }; });
    assert.equal(style.outline,'none');
    assert.equal(style.border,'rgb(165, 29, 45)');
    assert.match(style.shadow,/165, 29, 45/);
    if(title==='Invalid checked') assert.equal(style.bg,style.border);
  }
  await page.locator('.gallery-groups').scrollIntoViewIfNeeded();
  await page.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
  await page.screenshot({path:'artifacts/checkbox-errors-refined.png'});
  await filter('Contexts');
  const form = card('Required checkbox form');
  await form.getByRole('checkbox').check();
  await form.getByRole('button',{name:'Save preferences'}).click();
  assert.equal(await form.locator('[data-status=success]').count(),1);
  await form.scrollIntoViewIfNeeded();
  await page.evaluate(() => Promise.all(document.getAnimations().filter(a => a.effect?.getTiming().iterations !== Infinity).map(a => a.finished.catch(() => {}))));
  await page.screenshot({path:'artifacts/checkbox-success-refined.png'});
  await form.getByRole('button',{name:'Reset',exact:true}).click();
  assert.equal(await form.locator('[data-status=success]').count(),0);
  await page.setViewportSize({width:390,height:844});
  for(const name of ['Theme & direction','Presentation','Validation','Contexts']) {
    await filter(name);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),true);
  }
  await page.emulateMedia({ reducedMotion:'reduce' });
  await form.getByRole('checkbox').check();
  await form.getByRole('button',{name:'Save preferences'}).click();
  assert.equal(await form.locator('.feedback-symbol').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await openCatalog(page, `${url}/?component=builtin-input`);
  const email = page.getByRole('article',{name:'Input: Form integration',exact:true});
  await email.getByRole('textbox').fill('test@example.com');
  await email.getByRole('button',{name:'Validate email'}).click();
  assert.equal(await email.locator('.feedback-symbol').count(),1);
  await openCatalog(page, `${url}/?component=builtin-field`);
  const username = page.getByRole('article',{name:'Field: Length and business validation',exact:true});
  await username.getByRole('textbox').fill('alex_morgan');
  await username.getByRole('button',{name:'Validate username'}).click();
  assert.equal(await username.locator('[data-status=success]').count(),1);
  await openCatalog(page, `${url}/?component=builtin-checkbox`);
  await card('Simple with label').getByRole('button',{name:/View code/}).click();
  await page.getByRole('dialog').getByRole('button',{name:/^Copy code:/}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Copied',exact:true}).waitFor();
  assert.equal(await page.getByRole('dialog').locator('.duoop-check').count(),1);
  assert.deepEqual(errors,[]);
  console.log('PASS: no external checkbox focus rings, coherent error colors/shadows, success animation/reset/reduced motion, responsive refinements, shared email/username and copy feedback.');
} finally { await browser.close(); }

