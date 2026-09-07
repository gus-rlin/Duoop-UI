import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage();
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
try {
  await openCatalog(page, base);
  // Mount the real Vite modules in an isolated fixture; no production test hooks.
  await page.evaluate(async () => {
    const source = await (await fetch('/src/main.jsx')).text();
    const dependency = file => source.match(new RegExp(`from "([^" ]*/${file}\\.js[^" ]*)"`))[1];
    const React = (await import(dependency('react'))).default;
    const { createRoot } = (await import(dependency('react-dom_client'))).default;
    const { ToastProvider, ToastViewport, useToast } = await import('/src/components/Toast/Toast.jsx');
    const { Progress } = await import('/src/components/Progress/Progress.jsx');
    const fixture = document.createElement('div'); fixture.id = 'state-fixture'; document.body.append(fixture);
    function Probe() {
      const toast = useToast();
      React.useEffect(() => { window.toastProbe = toast; }, [toast]);
      return React.createElement(ToastViewport, { inline:true });
    }
    window.fixtureRoot = createRoot(fixture);
    window.fixtureRoot.render(React.createElement(ToastProvider, { limit:1 }, React.createElement(Probe), React.createElement(Progress, { label:'Clamped value', value:200, max:80 }), React.createElement(Progress, { label:'Unknown value', value:null }), React.createElement(Progress, { label:'Invalid numeric input', value:NaN, max:-1 })));
  });
  await page.waitForFunction(() => !!window.toastProbe);
  const fixture = page.locator('#state-fixture');
  assert.equal(await fixture.getByRole('progressbar', { name:'Clamped value' }).getAttribute('aria-valuenow'), '80');
  assert.equal(await fixture.getByRole('progressbar', { name:'Unknown value' }).getAttribute('aria-valuenow'), null);
  assert.equal(await fixture.getByRole('progressbar', { name:'Invalid numeric input' }).getAttribute('aria-valuenow'), '0');
  await page.evaluate(() => {
    window.toastProbe.add({ id:'first', title:'First', duration:0 });
    window.toastProbe.add({ id:'second', title:'Second', duration:1000 });
  });
  await page.waitForTimeout(1300);
  assert.equal(await page.evaluate(() => window.toastProbe.items.find(item => item.id === 'second').remaining), 1000);
  await page.evaluate(() => window.toastProbe.dismiss('first'));
  await page.waitForTimeout(450);
  assert.equal(await fixture.locator('.toast-title').innerText(), 'Second');
  await page.waitForTimeout(1400);
  assert.equal(await fixture.locator('.duoop-toast').count(), 0);
  await page.evaluate(() => window.toastProbe.update('second', { title:'Must not revive' }));
  assert.equal(await fixture.locator('.duoop-toast').count(), 0);
  const result = await page.evaluate(async () => {
    return window.toastProbe.promise(async () => 42, { id:'promise', loading:'Working', success:value => `Result ${value}`, error:'Failed' });
  });
  assert.equal(result, 42);
  assert.equal(await fixture.locator('.toast-title').innerText(), 'Result 42');
  assert.equal(await page.evaluate(async () => {
    try { await window.toastProbe.promise(async () => { throw new Error('Expected failure'); }, { id:'promise', loading:'Working', success:'Done', error:error => error.message }); }
    catch (error) { return error.message; }
  }), 'Expected failure');
  assert.equal(await fixture.locator('.duoop-toast').getAttribute('data-tone'), 'error');
  await page.evaluate(() => {
    window.pendingResult = window.toastProbe.promise(() => new Promise(resolve => { window.resolveOld = resolve; }), { id:'promise', loading:'Old operation', success:'Old result', error:'Old error' });
    window.toastProbe.add({ id:'promise', title:'New operation', duration:0 });
    window.resolveOld('old');
  });
  await page.evaluate(() => window.pendingResult);
  assert.equal(await fixture.locator('.toast-title').innerText(), 'New operation');
  await page.evaluate(() => {
    window.pendingResult = window.toastProbe.promise(() => new Promise(resolve => { window.resolveOld = resolve; }), { id:'promise', loading:'Closing operation', success:'Late result', error:'Error' });
    window.toastProbe.dismiss('promise');
    window.resolveOld('late');
  });
  await page.evaluate(() => window.pendingResult);
  await page.waitForTimeout(400);
  assert.equal(await fixture.locator('.duoop-toast').count(), 0);
  const capacity = await page.evaluate(() => {
    const ids = Array.from({ length:51 }, (_, i) => window.toastProbe.add({ id:`capacity-${i}`, title:`Event ${i}`, duration:0 }));
    return ids.filter(Boolean).length;
  });
  assert.equal(capacity, 50);
  await page.evaluate(() => window.fixtureRoot.unmount());
  assert.equal(await fixture.locator('.toast-viewport').count(), 0);
  console.log('PASS: value clamping and unknown ARIA values; queued clocks; automatic dismissal; no resurrection; promise success/error and stale-result protection; bounded capacity; cleanup.');
} finally { await browser.close(); }
