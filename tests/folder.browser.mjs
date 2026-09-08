import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const browser = await chromium.launch();
await mkdir('artifacts', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:5173'}/?component=builtin-folder`);
  const stage = page.locator('.folder-playground');
  const folder = stage.locator('.duoop-folder');
  const cover = folder.locator('.duoop-folder__cover');
  const toggle = folder.locator('.duoop-folder__front');
  const documents = folder.locator('.duoop-folder__documents');
  const cards = folder.locator('.duoop-folder__document');
  await folder.scrollIntoViewIfNeeded();
  await page.mouse.move(0, 0);
  await expect(folder).toHaveAttribute('data-state', 'closed');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(cards.first()).toBeHidden();
  await stage.screenshot({ path: 'artifacts/folder-closed.png' });
  await cover.hover();
  await expect(folder).toHaveAttribute('data-state', 'preview');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(documents).toHaveAttribute('inert', '');
  await page.waitForTimeout(350);
  const perspective = await toggle.evaluate(node => {
    const style = getComputedStyle(node);
    const matrix = new DOMMatrixReadOnly(style.transform);
    const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
    const project = (x, y) => {
      const p = new DOMPoint(x - ox, y - oy, 0, 1).matrixTransform(matrix);
      return { x: p.x / p.w + ox, y: p.y / p.w + oy };
    };
    const tl = project(0, 0), tr = project(node.offsetWidth, 0);
    const bl = project(0, node.offsetHeight), br = project(node.offsetWidth, node.offsetHeight);
    return { topWidth: tr.x - tl.x, bottomWidth: br.x - bl.x, topY: tl.y };
  });
  expect(perspective.topWidth).toBeGreaterThan(perspective.bottomWidth);
  expect(perspective.topY).toBeGreaterThan(0);
  await stage.screenshot({ path: 'artifacts/folder-hover.png' });
  await page.mouse.move(0, 0);
  await expect(folder).toHaveAttribute('data-state', 'closed');
  await toggle.click();
  await page.mouse.move(0, 0);
  await expect(folder).toHaveAttribute('data-state', 'expanded');
  await expect(documents).not.toHaveAttribute('inert', '');
  await page.waitForTimeout(350);
  for (const card of await cards.all()) {
    const box = await card.boundingBox();
    expect(box.width).toBeGreaterThan(box.height);
  }
  await stage.screenshot({ path: 'artifacts/folder-open.png' });
  await toggle.focus();
  await page.keyboard.press('Tab');
  await expect(cards.first()).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(cards.first()).toHaveAttribute('aria-pressed', 'true');
  await expect(stage.getByRole('status')).toContainText('Project brief selected');
  await page.keyboard.press('Escape');
  await expect(folder).toHaveAttribute('data-state', 'closed');
  await expect(toggle).toBeFocused();
  const returning = await cards.first().evaluate(node => getComputedStyle(node).transform);
  await page.waitForTimeout(120);
  expect(await cards.first().evaluate(node => Number(getComputedStyle(node).opacity))).toBeGreaterThan(.8);
  expect(await cards.first().evaluate(node => getComputedStyle(node).transform)).not.toBe(returning);
  await expect(cards.first()).toBeHidden();
  await page.keyboard.press('Enter');
  await expect(folder).toHaveAttribute('data-state', 'expanded');
  await expect(cards.first()).toHaveAttribute('aria-pressed', 'true');
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await folder.scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (const card of await cards.all()) {
      const dimensions = await card.evaluate(node => ({ width: node.offsetWidth, height: node.offsetHeight }));
      expect(dimensions.width).toBeGreaterThan(dimensions.height);
    }
    if (width === 390) await stage.screenshot({ path: 'artifacts/folder-mobile.png' });
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await cards.first().evaluate(node => getComputedStyle(node).transitionDuration)).toBe('0s');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(errors).toEqual([]);
  console.log('PASS Folder: closed, hover-only preview, click reveal, landscape cards, persistent expansion, keyboard selection, Escape, mobile and reduced motion.');
} finally { await browser.close(); }
