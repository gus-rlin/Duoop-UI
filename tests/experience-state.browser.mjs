import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless:true });
const page = await browser.newPage({ viewport:{ width:1440,height:1000 } });
const base = process.env.TEST_URL || 'http://127.0.0.1:5176';
try {
  await openCatalog(page, base);
  await page.evaluate(async () => {
    const source = await (await fetch('/src/main.jsx')).text();
    const dependency = file => source.match(new RegExp(`from "([^" ]*/${file}\\.js[^" ]*)"`))[1];
    const React = (await import(dependency('react'))).default;
    const { createRoot } = (await import(dependency('react-dom_client'))).default;
    const { ReactionButton, formatReactionCount } = await import('/src/components/ReactionButton/ReactionButton.jsx');
    const { Stepper } = await import('/src/components/Stepper/Stepper.jsx');
    const { Achievement } = await import('/src/components/Achievement/Achievement.jsx');
    const fixture = document.createElement('div'); fixture.id = 'experience-fixture'; document.body.prepend(fixture);
    window.experienceProbe = { calls:0, changes:0, formats:[formatReactionCount(-1),formatReactionCount(1248,'capped'),formatReactionCount(1248,'exact','fr')] };
    const root = createRoot(fixture);
    window.experienceProbe.unmount = () => root.unmount();
    function Probe() {
      const [value,setValue] = React.useState({ selected:false,count:10,contributions:0 });
      return React.createElement(React.Fragment,null,
        React.createElement(ReactionButton,{ value,onValueChange:next => { window.experienceProbe.changes++; setValue(next); },onReact:(next,{ signal }) => { window.experienceProbe.calls++; window.experienceProbe.signal = signal; return new Promise((resolve,reject) => { window.experienceProbe.resolve = resolve; window.experienceProbe.reject = reject; }); },counter:'separate' }),
        React.createElement(Stepper,{ value:'one',items:[{ id:'one',title:'One',state:'complete' },{ id:'two',title:'Two',state:'blocked' },{ id:'three',title:'Three',state:'upcoming' }],onValueChange:() => {},progress:10 }),
        React.createElement(Achievement,{ item:{ id:'bounds',title:'Bounded goal',state:'progress',progress:90,target:3 } })
      );
    }
    root.render(React.createElement(React.StrictMode,null,React.createElement(Probe)));
  });
  const fixture = page.locator('#experience-fixture');
  const react = fixture.locator('.reaction-button');
  await react.click();
  await react.click({ force:true,clickCount:4,delay:20 });
  assert.equal(await page.evaluate(() => window.experienceProbe.calls),1);
  assert.equal(await page.evaluate(() => window.experienceProbe.changes),0);
  assert.match(await fixture.locator('.reaction-separate-count').innerText(),/11/);
  await page.evaluate(() => window.experienceProbe.reject(new Error('Offline')));
  await fixture.locator('.duoop-reaction[data-state=error]').waitFor();
  assert.match(await fixture.locator('.reaction-separate-count').innerText(),/10/);
  await react.click();
  await page.evaluate(() => window.experienceProbe.resolve());
  await fixture.locator('.duoop-reaction[data-state=selected]').waitFor();
  assert.equal(await page.evaluate(() => window.experienceProbe.changes),1);
  assert.equal(await fixture.locator('[data-step=two]').isDisabled(),true);
  assert.equal(await fixture.locator('[data-step=three]').isDisabled(),true);
  assert.equal(await fixture.getByRole('progressbar',{ name:'Bounded goal progress' }).getAttribute('aria-valuenow'),'3');
  const formats = await page.evaluate(() => window.experienceProbe.formats);
  assert.equal(formats[0],'0'); assert.equal(formats[1],'99+'); assert.equal(formats[2].replace(/\s/g,''),'1248');
  await react.click();
  await page.evaluate(() => window.experienceProbe.unmount());
  assert.equal(await page.evaluate(() => window.experienceProbe.signal.aborted),true);
  await page.evaluate(() => window.experienceProbe.resolve());
  assert.equal(await page.evaluate(() => window.experienceProbe.changes),1);
  console.log('Passed: controlled optimistic state, rapid requests, rollback/retry, unmount cancellation, prerequisites and numeric bounds.');
} finally { await browser.close(); }
