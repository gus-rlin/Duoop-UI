import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const context = await browser.newContext({ viewport:{ width:1440, height:1000 }, permissions:['clipboard-read','clipboard-write'] });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
const card = (kind, name) => page.getByRole('article', { name:`${kind}: ${name}`, exact:true });
const wait = ms => page.waitForTimeout(ms);
const noOverflow = async () => assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);

async function choose(scope, label, value) {
  const labels = { '0':'Persistent', linear:'Linear', circular:'Circular', waiting:'Waiting', preparing:'Preparing\u2026', running:'In progress', paused:'Paused', finalizing:'Finalizing\u2026', success:'Complete', error:'Failed', cancelled:'Cancelled', partial:'Partially complete' };
  const name = label === 'State' || label === 'Shape' || label === 'Duration' ? labels[value] || value : value;
  await scope.getByRole('combobox', { name: new RegExp(`^${label} `) }).click();
  await page.getByRole('listbox', { name:label, exact:true }).getByRole('option', { name, exact:true }).click();
}

await mkdir('artifacts', { recursive:true });
try {
  await openCatalog(page, `${base}/?component=builtin-toast`);
  assert.equal(await page.locator('.gallery-card').count(), 18);
  const undo = card('Toast','With undo');
  await undo.getByRole('button', { name:'Archive file', exact:true }).click();
  assert.match(await undo.locator('.toast-file-state').innerText(), /Archived/);
  await undo.getByRole('button', { name:'Undo', exact:true }).click();
  assert.match(await undo.locator('.toast-file-state').innerText(), /In workspace/);
  assert.equal(await undo.getByRole('button', { name:'Archive file' }).evaluate(el => el === document.activeElement), true);
  await undo.getByRole('button', { name:'Archive file' }).click();
  await undo.getByRole('button', { name:'Dismiss: File archived' }).click();
  await wait(400);
  assert.equal(await undo.locator('.duoop-toast').count(), 0);
  assert.match(await undo.locator('.toast-file-state').innerText(), /Archived/);
  await undo.getByRole('button', { name:'Reset example' }).click();

  const dedupe = card('Toast','Deduplicated');
  await dedupe.getByRole('button', { name:'Save a change' }).click({ clickCount:4, delay:50 });
  assert.equal(await dedupe.locator('.duoop-toast').count(), 1);
  assert.match(await dedupe.locator('.toast-title').innerText(), /4 changes saved/);

  const retry = card('Toast','With retry');
  await retry.getByRole('button', { name:'Retry', exact:true }).click();
  await retry.locator('.duoop-toast[data-tone=loading]').waitFor();
  await retry.getByText('Verifying archive…', { exact:true }).waitFor();
  assert.equal(await retry.locator('.duoop-toast[data-tone=success]').count(), 0);
  await retry.getByText('Archive ready', { exact:true }).waitFor();
  const asyncCard = card('Toast','Async operation');
  await asyncCard.getByRole('switch', { name:'Simulate an error' }).check();
  await asyncCard.getByRole('button', { name:'Run simulation' }).click();
  await asyncCard.getByText('Export interrupted', { exact:true }).waitFor();
  await asyncCard.getByRole('button', { name:'Retry', exact:true }).click();
  await asyncCard.getByText('Archive ready', { exact:true }).waitFor();

  const countdown = card('Toast','Countdown');
  await countdown.getByRole('button', { name:'Archive file' }).click();
  const track = countdown.locator('.toast-countdown>span');
  await countdown.locator('.duoop-toast').hover();
  await wait(250);
  const frozen = await track.getAttribute('style');
  await wait(700);
  assert.equal(await track.getAttribute('style'), frozen);
  await countdown.getByRole('button', { name:'Undo', exact:true }).focus();
  await page.mouse.move(0,0);
  await wait(500);
  assert.equal(await track.getAttribute('style'), frozen);
  await countdown.getByRole('button', { name:'Reset example' }).focus();
  await wait(350);
  assert.notEqual(await track.getAttribute('style'), frozen);

  const stacked = card('Toast','Stacked');
  await stacked.getByRole('button', { name:'Add five notifications' }).click();
  assert.equal(await stacked.locator('.duoop-toast').count(), 3);
  assert.match(await stacked.locator('.toast-queue-count').innerText(), /3 queued/);
  await stacked.locator('.toast-viewport').focus();
  await wait(400);
  assert.equal(await stacked.locator('.toast-stack').getAttribute('data-expanded'), 'true');
  const rects = await stacked.locator('.duoop-toast').evaluateAll(nodes => nodes.map(el => { const r = el.getBoundingClientRect(); return { top:r.top, bottom:r.bottom }; }));
  assert.ok(rects.every((r,i) => !i || r.top >= rects[i-1].bottom + 8));
  await stacked.screenshot({ path:'artifacts/toast-stack.png' });
  await stacked.getByRole('button', { name:'Dismiss: Workspace saved' }).click();
  await wait(400);
  assert.match(await stacked.locator('.toast-queue-count').innerText(), /2 queued/);

  const contextual = card('Toast','Contextual action');
  await contextual.getByRole('button', { name:'View file' }).click();
  assert.equal(await contextual.locator('.toast-file-details').evaluate(el => el === document.activeElement), true);
  await contextual.getByRole('button', { name:'Close details' }).click();

  const anchored = card('Toast','Compact anchored');
  await anchored.getByRole('button', { name:'Copy path' }).click();
  await page.locator('.toast-anchor .toast-title').getByText('Copied!', { exact:true }).waitFor();
  assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'Workspace / Field-notes.md');
  for (const side of ['left','right','bottom','top']) {
    await choose(anchored, 'Placement', side);
    const r = await page.locator('.toast-anchor').boundingBox();
    assert.ok(r.x >= 11 && r.x + r.width <= 1440 - 11 && r.y >= 11 && r.y + r.height <= 1000 - 11);
  }
  await anchored.getByRole('button', { name:/View code/ }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name:'Copy path' }).click();
  await dialog.locator('.toast-anchor .toast-title').waitFor();
  await page.keyboard.press('Escape');
  await wait(100);
  assert.equal(await page.locator('dialog .toast-anchor').count(), 0);

  const lab = page.getByRole('region', { name:'Toast playground' });
  await lab.getByRole('switch', { name:'Dark surface' }).check();
  await lab.getByRole('switch', { name:'Long text' }).check();
  await choose(lab, 'Duration', '0');
  for (const position of ['top-left','top-center','top-right','bottom-left','bottom-center','bottom-right']) {
    await choose(lab, 'Position', position);
    await lab.getByRole('button', { name:'Show notification' }).click();
    const live = page.getByRole('region', { name:'Playground notifications' });
    const r = await live.boundingBox();
    assert.ok(r.x >= 15 && r.x + r.width <= 1425 && r.y >= 15 && r.y + r.height <= 985);
    await live.getByRole('button', { name:/Dismiss/ }).click();
    await live.locator('.duoop-toast').waitFor({ state:'detached' });
  }
  for (const status of ['neutral','success','error','warning','info']) {
    await choose(lab, 'Status', status);
    for (const surface of ['neutral','tinted','solid']) {
      await choose(lab, 'Surface', surface);
      const contrast = await lab.locator('.feedback-lab-stage .toast-title').evaluate(el => {
        const toast = el.closest('.duoop-toast');
        const rgb = value => value.match(/[\d.]+/g).slice(0,3).map(Number).map(c => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; }).reduce((sum,c,i) => sum + c * [.2126,.7152,.0722][i],0);
        const a = rgb(getComputedStyle(el).color), b = rgb(getComputedStyle(toast).backgroundColor);
        return (Math.max(a,b) + .05) / (Math.min(a,b) + .05);
      });
      assert.ok(contrast >= 4.5, `${status}/${surface}: ${contrast}`);
    }
  }
  await choose(lab, 'Status', 'success');
  await choose(lab, 'Surface', 'tinted');
  await lab.scrollIntoViewIfNeeded();
  await wait(300);
  await page.screenshot({ path:'artifacts/toast-dark.png' });
  for (const width of [1024,390,320]) { await page.setViewportSize({ width,height:844 }); await noOverflow(); }
  await page.setViewportSize({ width:390,height:844 });
  await lab.locator('.feedback-lab-stage').scrollIntoViewIfNeeded();
  await page.screenshot({ path:'artifacts/toast-mobile.png' });
  await page.emulateMedia({ reducedMotion:'reduce' });
  assert.equal(await lab.locator('.duoop-toast').evaluate(el => getComputedStyle(el).animationName), 'none');

  await page.setViewportSize({ width:1440,height:1000 });
  await page.emulateMedia({ reducedMotion:'no-preference' });
  await openCatalog(page, `${base}/?component=builtin-progress`);
  assert.equal(await page.locator('.gallery-card').count(), 18);
  const controls = card('Progress','With controls');
  await controls.getByRole('button', { name:'Run simulation' }).click();
  await wait(750);
  await controls.getByRole('button', { name:'Pause', exact:true }).click();
  const pausedValue = await controls.getByRole('progressbar').getAttribute('aria-valuenow');
  await wait(650);
  assert.equal(await controls.getByRole('progressbar').getAttribute('aria-valuenow'), pausedValue);
  await controls.getByRole('button', { name:'Resume', exact:true }).click();
  await wait(400);
  assert.ok(Number(await controls.getByRole('progressbar').getAttribute('aria-valuenow')) > Number(pausedValue));
  await controls.getByRole('button', { name:'Cancel', exact:true }).click();
  assert.equal(await controls.locator('.duoop-progress').getAttribute('data-state'), 'cancelled');
  const cancelledValue = await controls.getByRole('progressbar').getAttribute('aria-valuenow');
  await wait(500);
  assert.equal(await controls.getByRole('progressbar').getAttribute('aria-valuenow'), cancelledValue);
  await controls.getByRole('switch').check();
  await controls.getByRole('button', { name:'Run again' }).click();
  await controls.getByText('Failed', { exact:true }).waitFor();
  await controls.getByRole('switch').uncheck();
  await controls.getByRole('button', { name:'Retry', exact:true }).click();
  await controls.getByText('Complete', { exact:true }).waitFor();

  const transition = card('Progress','Indeterminate to determinate');
  await transition.getByRole('button', { name:'Run simulation' }).click();
  assert.equal(await transition.getByRole('progressbar').getAttribute('aria-valuenow'), null);
  await wait(1100);
  assert.notEqual(await transition.getByRole('progressbar').getAttribute('aria-valuenow'), null);
  for (const title of ['Linear success','Circular success']) {
    const complete = card('Progress',title);
    await complete.getByRole('button', { name:'Run simulation' }).click();
    await complete.getByText('Finalizing…', { exact:true }).waitFor();
    assert.equal(await complete.getByRole('progressbar').getAttribute('aria-valuenow'), '100');
    assert.equal(await complete.locator('[data-state=success]').count(), 0);
    await complete.getByText('Complete', { exact:true }).waitFor();
    assert.equal(await complete.locator('.duoop-check').count() > 0, true);
  }
  const multiple = card('Progress','Multiple tasks');
  await multiple.getByRole('switch').check();
  await multiple.getByRole('button', { name:'Run simulation' }).click();
  await multiple.getByText('Partially complete', { exact:true }).waitFor();
  assert.equal(await multiple.locator('[data-state=success]').count(), 2);
  assert.equal(await multiple.locator('[data-state=error]').count(), 1);
  await multiple.getByRole('switch').uncheck();
  assert.equal(await multiple.locator('[data-state=error]').count(), 1, 'Changing future settings must not rewrite an existing result');
  await multiple.getByRole('button', { name:'Retry', exact:true }).click();
  await multiple.getByText('3 of 3 files verified.', { exact:true }).waitFor();
  const progressLab = page.getByRole('region', { name:'Progress playground' });
  for (const state of ['waiting','preparing','running','paused','finalizing','success','error','cancelled','partial']) {
    await choose(progressLab, 'State', state);
    assert.equal(await progressLab.locator('.duoop-progress').getAttribute('data-state'), state);
  }
  await choose(progressLab, 'Shape', 'circular');
  await choose(progressLab, 'State', 'success');
  await progressLab.getByRole('switch', { name:'Dark surface' }).check();
  await progressLab.scrollIntoViewIfNeeded();
  await wait(400);
  await page.screenshot({ path:'artifacts/progress-dark.png' });
  await page.getByRole('button', { name:'Circular', exact:true }).click();
  await card('Progress','Circular percentage').scrollIntoViewIfNeeded();
  await page.screenshot({ path:'artifacts/progress-circular.png' });
  await page.getByRole('button', { name:'All', exact:true }).click();
  await progressLab.getByRole('switch', { name:'Long text' }).check();
  await choose(progressLab, 'Shape', 'linear');
  for (const width of [1024,390,320]) {
    await page.setViewportSize({ width,height:844 });
    for (const position of ['above','beside','below']) { await choose(progressLab, 'Text position', position); await noOverflow(); }
  }
  await page.setViewportSize({ width:390,height:844 });
  await progressLab.locator('.feedback-lab-stage').scrollIntoViewIfNeeded();
  await page.screenshot({ path:'artifacts/progress-mobile.png' });
  await page.emulateMedia({ reducedMotion:'reduce' });
  await choose(progressLab, 'State', 'preparing');
  assert.equal(await progressLab.locator('.progress-fill').evaluate(el => getComputedStyle(el).animationName), 'none');
  await choose(progressLab, 'Shape', 'circular');
  assert.equal(await progressLab.locator('.progress-ring>svg').evaluate(el => getComputedStyle(el).animationName), 'none');
  await openCatalog(page, base);
  assert.equal(await page.getByRole('link', { name:'Explore Toast', exact:true }).count(), 1);
  assert.equal(await page.getByRole('link', { name:'Explore Progress', exact:true }).count(), 1);
  await noOverflow();
  assert.deepEqual(errors, []);
  console.log('PASS: 36 demos; undo versus dismiss; retry/error; countdown pause; queue, deduplication and keyboard expansion; anchored clipboard and dialog cleanup; six placements; dark contrast; pause/resume/cancel; preparation, finalization and partial success; 320/390/1024/1440px; reduced motion.');
} finally { await browser.close(); }
