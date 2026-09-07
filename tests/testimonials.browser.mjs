import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width:1440, height:1100 } });
const errors=[];
page.on('pageerror', error => errors.push(error.message));
try {
  await openCatalog(page, 'http://127.0.0.1:5176/?component=builtin-testimonials');
  await page.getByRole('heading', { name:'Testimonials', exact:true }).waitFor();
  const spotlight=page.getByRole('region',{name:'Editorial spotlight',exact:true});
  const voices=page.getByRole('region',{name:'Team voices',exact:true});
  assert.equal(await page.locator('.testimonials').count(),3);
  await spotlight.getByRole('button',{name:'Next testimonial'}).click();
  await spotlight.getByRole('button',{name:'Next testimonial'}).click();
  assert.match(await spotlight.locator('.testimonials__footer > [role=status]').innerText(),/03 \/ 03/);
  await spotlight.getByRole('button',{name:'Next testimonial'}).click();
  assert.match(await spotlight.locator('.testimonials__footer > [role=status]').innerText(),/01 \/ 03/);
  await spotlight.getByRole('button',{name:'Previous testimonial'}).focus();
  await page.keyboard.press('Enter');
  assert.match(await spotlight.locator('.testimonials__footer > [role=status]').innerText(),/03 \/ 03/);
  await voices.getByRole('button',{name:'Goodside Alex Morgan'}).click();
  assert.equal(await voices.getByRole('button',{name:'Goodside Alex Morgan'}).getAttribute('aria-pressed'),'true');
  assert.match(await voices.locator('blockquote').innerText(),/conversations/);
  await voices.locator('.testimonials__story').evaluate(el => Promise.all(el.getAnimations().map(animation => animation.finished)));
  await page.locator('.component-gallery').screenshot({path:'artifacts/testimonials-desktop.png'});
  for(const width of [1000,768,390,320]) {
    await page.setViewportSize({width,height:1000});
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`No overflow at ${width}`);
    if(width===390) await page.locator('.component-gallery').screenshot({path:'artifacts/testimonials-mobile.png'});
  }
  await page.emulateMedia({reducedMotion:'reduce'});
  await spotlight.getByRole('button',{name:'Next testimonial'}).click();
  assert.equal(await spotlight.locator('.testimonials__story').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.getByRole('button',{name:'View code: Testimonials Team voices'}).click();
  await page.getByRole('dialog').getByRole('button',{name:'Next testimonial'}).click();
  await page.getByRole('button',{name:'Close example'}).click();
  await openCatalog(page, 'http://127.0.0.1:5176/');
  assert.equal(await page.getByRole('link', { name:'Explore Testimonials',exact:true}).count(),1);
  await page.evaluate(async () => {
    const {default:React} = await import('/node_modules/.vite/deps/react.js');
    const {default:{createRoot}} = await import('/node_modules/.vite/deps/react-dom_client.js');
    const {Testimonials} = await import('/src/components/Testimonials/Testimonials.jsx');
    const host=document.createElement('div'); document.body.append(host);
    window.testimonialTestRoot=createRoot(host);
    window.testimonialTestRoot.render(React.createElement(Testimonials,{items:[],label:'Empty fixture'}));
  });
  await page.getByText('No stories to share yet.').waitFor();
  await page.evaluate(async () => {
    const {default:React}=await import('/node_modules/.vite/deps/react.js');
    const {Testimonials}=await import('/src/components/Testimonials/Testimonials.jsx');
    window.testimonialTestRoot.render(React.createElement(Testimonials,{items:[{id:'one',name:'One customer',role:'Designer',company:'Studio',quote:'One story.'}],label:'Single fixture'}));
  });
  const single=page.getByRole('region',{name:'Single fixture'});
  await single.waitFor();
  assert.ok(await single.getByRole('button',{name:'Next testimonial'}).isDisabled());
  assert.ok(await single.getByRole('button',{name:'Previous testimonial'}).isDisabled());
  await page.evaluate(()=>window.testimonialTestRoot.unmount());
  assert.deepEqual(errors,[]);
  console.log('PASS: three sections, navigation, wraparound, keyboard, selector, four responsive widths, reduced motion, modal, catalogue, no runtime errors.');
} finally { await browser.close(); }



