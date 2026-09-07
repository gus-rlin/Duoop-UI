import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
try {
  await openCatalog(page, process.env.TEST_URL || 'http://127.0.0.1:5176');
  assert.ok(await page.locator('.catalog-card-preview-link').count() >= 27);
  await page.getByRole('link', { name:'Explore Depth Carousel', exact: true }).click();
  const lab = page.getByRole('region', { name: 'Depth Carousel playground' });
  const carousel = lab.getByRole('region', { name: 'Studio perspectives' });
  const stage = carousel.locator('.depth-carousel__viewport');
  const status = carousel.locator('.depth-carousel__counter');
  const active = () => carousel.locator('.depth-carousel__card[aria-hidden=false]');
  await page.waitForFunction(() => [...document.querySelectorAll('.depth-carousel__card img')].every(image => image.complete && image.naturalWidth > 0));
  assert.equal(await lab.locator('.depth-playground__copy').count(), 0);
  assert.ok((await active().boundingBox()).width >= 370);
  await page.screenshot({ path: 'artifacts/depth-desktop.png' });
  await carousel.getByRole('button', { name: 'Next card', exact: true }).click();
  assert.equal(await status.innerText(), '02 / 05');
  await stage.press('ArrowLeft');
  await stage.press('ArrowLeft');
  assert.equal(await status.innerText(), '05 / 05');
  await stage.press('Home');
  await page.waitForTimeout(650);
  async function drag(distance) {
    const box = await stage.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + 160);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + distance, box.y + 160, { steps: 8 });
    await page.mouse.up();
    await page.waitForTimeout(650);
  }
  await drag(-100);
  assert.equal(await status.innerText(), '02 / 05');
  await drag(20);
  assert.equal(await status.innerText(), '02 / 05');
  await drag(100);
  assert.equal(await status.innerText(), '01 / 05');
  await carousel.getByRole('button', { name: 'Go to card 3', exact: true }).click();
  assert.equal(await status.innerText(), '03 / 05');
  await page.waitForTimeout(650);
  await lab.getByRole('button', { name: 'Left', exact: true }).click();
  await lab.getByRole('button', { name: 'Deep', exact: true }).click();
  await lab.getByRole('button', { name: 'Dark', exact: true }).click();
  await page.waitForTimeout(250);
  await lab.screenshot({ path: 'artifacts/depth-dark.png' });
  await lab.getByRole('button', { name: 'Light', exact: true }).click();
  for (const width of [1000, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1100 });
    await page.waitForTimeout(100);
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `No overflow at ${width}`);
    for (let i = 0; i < 5; i++) {
      await carousel.getByRole('button', { name: `Go to card ${i + 1}`, exact: true }).click();
      assert.ok(await active().evaluate(node => node.scrollHeight <= node.clientHeight), `Card ${i + 1} fits at ${width}`);
    }
    if (width === 390) { await page.waitForTimeout(650); await lab.screenshot({ path: 'artifacts/depth-mobile.png' }); }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await stage.press('Home');
  await stage.press('ArrowRight');
  assert.equal(await status.innerText(), '02 / 05');
  assert.equal(await active().evaluate(node => getComputedStyle(node).opacity), '1');
  const bounded = page.getByRole('region', { name: 'Bounded collection', exact: true });
  assert.ok(await bounded.getByRole('button', { name: 'Previous card', exact: true }).isDisabled());
  await bounded.locator('.depth-carousel__viewport').press('End');
  assert.ok(await bounded.getByRole('button', { name: 'Next card', exact: true }).isDisabled());
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.locator('.component-gallery').screenshot({ path: 'artifacts/depth-gallery.png' });
  await page.getByRole('button', { name: 'View code: Depth Carousel Perspective right', exact: true }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Next card', exact: true }).click();
  await page.getByRole('button', { name: 'Close example', exact: true }).click();
  await page.locator('.back-link').click();
  await page.evaluate(async () => {
    const React = await import('/node_modules/.vite/deps/react.js');
    const { default: ReactDOM } = await import('/node_modules/.vite/deps/react-dom_client.js');
    const { DepthCarousel } = await import('/src/components/DepthCarousel/DepthCarousel.jsx');
    const host = document.createElement('div');
    document.body.append(host);
    window.depthTestRoot = ReactDOM.createRoot(host);
    window.renderDepthTest = count => window.depthTestRoot.render(React.default.createElement(DepthCarousel, {
      items: Array.from({ length: count }, (_, index) => ({ id: String(index), title: `Card ${index + 1}` })),
      label: 'Collection changes',
    }));
    window.renderDepthTest(5);
  });
  const fixture = page.getByRole('region', { name: 'Collection changes' });
  await fixture.locator('.depth-carousel__viewport').press('End');
  await page.evaluate(() => window.renderDepthTest(1));
  await page.waitForTimeout(50);
  assert.equal(await fixture.locator('.depth-carousel__counter').innerText(), '01 / 01');
  assert.ok(await fixture.getByRole('button', { name: 'Next card', exact: true }).isDisabled());
  await page.evaluate(() => window.renderDepthTest(0));
  await page.waitForTimeout(50);
  assert.match(await fixture.innerText(), /No cards to display/);
  await page.evaluate(() => window.renderDepthTest(3));
  await page.waitForTimeout(50);
  assert.equal(await fixture.locator('.depth-carousel__counter').innerText(), '01 / 03');
  await page.evaluate(() => window.depthTestRoot.unmount());
  assert.deepEqual(errors, []);
  console.log('PASS: 27 entries, arrows, rapid navigation, wraparound, drag, short gesture, indicators, themes, depth, five widths, reduced motion, boundaries and dialog cleanup.');
} finally { await browser.close(); }

