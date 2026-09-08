import { chromium } from 'playwright';
import assert from 'node:assert/strict';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
try {
  await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:5173'}/?component=builtin-text-loop`);
  const circle = page.getByRole('article', { name: 'Text Loop: Full circle', exact: true });
  await circle.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await circle.locator('.text-loop-glyph').first().waitFor();
  const result = await circle.evaluate(async root => {
    const glyphs = [...root.querySelectorAll('.text-loop-glyph')];
    const group = glyphs[0].parentElement;
    const initial = glyphs.map(el => el.getAttribute('transform'));
    let stable = true, minOpacity = 1, maxStep = 0, travel = 0, previous;
    const start = performance.now();
    await new Promise(resolve => {
      function frame(now) {
        stable &&= glyphs.every((el, i) => el.getAttribute('transform') === initial[i]);
        minOpacity = Math.min(minOpacity, ...glyphs.map(el => Number(el.getAttribute('opacity'))));
        const angle = Number(group.getAttribute('transform')?.match(/rotate\(([^ ]+)/)?.[1] || 0);
        if (previous !== undefined) {
          const delta = ((angle - previous + 540) % 360) - 180;
          travel += delta;
          maxStep = Math.max(maxStep, Math.abs(delta));
        }
        previous = angle;
        if (now - start < 14000) requestAnimationFrame(frame); else resolve();
      }
      requestAnimationFrame(frame);
    });
    return { stable, minOpacity, maxStep, travel };
  });
  assert.equal(result.stable, true, 'Letters must not lift, tilt or scale independently');
  assert.equal(result.minOpacity, 1, 'Circle must not fade letters at the seam');
  assert.ok(result.travel > 360, 'Observe more than one complete revolution');
  assert.ok(result.maxStep < 10, 'No visible jump at the loop boundary');
  await circle.getByRole('button', { name: 'Pause', exact: true }).click();
  const group = circle.locator('.text-loop-glyph').first().locator('..');
  const stopped = await group.getAttribute('transform');
  await page.waitForTimeout(180);
  assert.equal(await group.getAttribute('transform'), stopped);
  await circle.screenshot({ path: 'artifacts/text-loop-circle-fixed.png' });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await circle.getByRole('button', { name: 'Resume', exact: true }).click();
  const reduced = await group.getAttribute('transform');
  await page.waitForTimeout(180);
  assert.equal(await group.getAttribute('transform'), reduced);
  console.log('PASS TextLoop: full revolution, stable letters, seam continuity, pause and reduced motion.', result);
} finally { await browser.close(); }
