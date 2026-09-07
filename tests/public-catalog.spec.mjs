import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import fs from 'node:fs/promises';
import { unzipSync, strFromU8 } from 'fflate';
import { parse } from '@babel/parser';
import { entries } from '../src/catalog/catalog.js';

test.beforeEach(async ({ page }) => {
  await page.context().grantPermissions(['clipboard-read', 'clipboard-write']);
});

async function noOverflow(page) {
  const size = await page.evaluate(() => ({ document: document.documentElement.scrollWidth, viewport: innerWidth }));
  expect(size.document, `${page.url()} at ${size.viewport}px`).toBeLessThanOrEqual(size.viewport + 1);
}

async function settle(page) {
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all(document.getAnimations().filter(animation => Number.isFinite(animation.effect?.getComputedTiming().endTime)).map(animation => animation.finished.catch(() => {}))));
}

async function download(page, button, name) {
  const pending = page.waitForEvent('download');
  await button.click();
  const item = await pending;
  await fs.mkdir('artifacts/downloads', { recursive: true });
  const path = `artifacts/downloads/${name}.zip`;
  await item.saveAs(path);
  const files = Object.fromEntries(Object.entries(unzipSync(await fs.readFile(path))).map(([name, bytes]) => [name, strFromU8(bytes)]));
  expect(files['src/App.jsx']).toBeTruthy();
  expect(files['src/base.css']).toBeTruthy();
  expect(files['package.json']).toBeTruthy();
  expect(files.LICENSE).toContain('Apache License');
  for (const [path, content] of Object.entries(files)) if (/\.(jsx|js)$/.test(path)) parse(content, { sourceType: 'module', plugins: ['jsx'] });
  return files;
}

test('discover, search, deep-link, use history and copy real source', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Small details.Big difference.');
  await expect(page.locator('.catalog-card')).toHaveCount(34);
  await page.getByRole('switch', { name: 'A little more focus' }).uncheck();
  await page.getByRole('checkbox', { name: 'Make something worth sharing' }).check();
  await page.keyboard.press('Control+k');
  await expect(page.getByRole('searchbox')).toBeFocused();
  await page.getByRole('searchbox').fill('dropdown');
  await expect(page.locator('.catalog-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Get Dropdown Menu code' }).click();
  await expect(page.getByRole('tab', { name: 'Code', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.source-files code').first()).toContainText('MenuItem');
  await page.getByRole('button', { name: 'Copy code: src/App.jsx', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('onSelect');
  await page.getByRole('tab', { name: 'Installation', exact: true }).click();
  await expect(page.locator('.install-file-list')).toContainText('useAnchoredOverlay.js');
  await expect(page.locator('.install-file-list')).toContainText('MenuPortal.css');
  await page.goBack();
  await expect(page.getByRole('tab', { name: 'Code', exact: true })).toHaveAttribute('aria-selected', 'true');
  await page.goBack();
  await expect(page.getByRole('searchbox')).toHaveValue('dropdown');
  await page.getByRole('searchbox').fill('nothingmatches123');
  await expect(page.getByRole('heading', { name: 'No matching components.' })).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.locator('.catalog-card')).toHaveCount(34);
  expect(errors).toEqual([]);
});

test('every component has a complete downloadable integration', async ({ page }) => {
  test.setTimeout(240000);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const entry of entries) {
    await test.step(entry.name, async () => {
      await page.goto(`/?component=${entry.id}&tab=code`);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(entry.name);
      await expect(page.locator('.bundle-files')).toBeVisible();
      const files = await download(page, page.getByRole('button', { name: 'Download project' }), entry.id);
      expect(files[entry.path]).toBeTruthy();
      await noOverflow(page);
    });
  }
  expect(errors).toEqual([]);
});

test('every gallery variant includes its complete implementation', async ({ page }) => {
  test.setTimeout(900000);
  const errors = [];
  const coverage = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const entry of entries) {
    await test.step(entry.name, async () => {
      await page.goto(`/?component=${entry.id}`);
      await expect(page.locator('.button-showcase')).toBeVisible();
      const buttons = page.getByRole('button', { name: /^View code:/ });
      const count = await buttons.count();
      expect(count, `${entry.name} examples`).toBeGreaterThan(0);
      for (let index = 0; index < count; index++) {
        const title = await buttons.nth(index).getAttribute('aria-label');
        await buttons.nth(index).click();
        const dialog = page.locator('dialog[open]').last();
        await expect(dialog.locator('.bundle-files')).toBeVisible();
        await expect(dialog.locator('.source-files pre')).not.toHaveText(/^\s*<\w+Demo example=/);
        await download(page, dialog.getByRole('button', { name: 'Download project' }), `${entry.id}-example-${index + 1}`);
        coverage.push({ component: entry.name, example: title, result: 'passed' });
        await dialog.getByRole('button', { name: 'Close example' }).click();
      }
      await noOverflow(page);
    });
  }
  await fs.writeFile('artifacts/gallery-coverage.json', JSON.stringify(coverage, null, 2));
  expect(errors).toEqual([]);
});

test('landing page interactions and complete page download', async ({ page }) => {
  await page.goto('/?page=examples&example=landing');
  await page.getByRole('checkbox', { name: 'Share it with the world' }).check();
  await expect(page.locator('.forma-progress')).toContainText('3 of 3');
  await page.getByRole('radio', { name: 'Yearly · save 25%' }).check();
  await expect(page.locator('.forma-price')).toContainText('€9');
  await page.getByRole('button', { name: 'Start your studio' }).click();
  await page.getByRole('textbox', { name: 'Studio name' }).fill('Test studio');
  await page.getByRole('button', { name: 'Create sample studio' }).click();
  await expect(page.locator('.forma-created')).toContainText('Test studio');
  await page.getByRole('button', { name: 'Can I build my own page with this?' }).click();
  await expect(page.getByText('Yes. Copy the complete page')).toBeVisible();
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  const files = await download(page, page.getByRole('button', { name: 'Download project' }), 'landing');
  expect(files['src/example.css']).toContain('.forma');
  expect(files['src/components/Dialog/Dialog.jsx']).toBeTruthy();
});

test('settings validate, persist, discard and survive a tab change', async ({ page }) => {
  await page.goto('/?page=examples&example=settings');
  await page.getByRole('textbox', { name: 'Full name' }).fill('Taylor Jordan');
  await page.getByRole('tab', { name: 'Notifications', exact: true }).click();
  await page.getByRole('switch', { name: 'Product letters' }).check();
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('textbox', { name: 'Full name' })).toHaveValue('Taylor Jordan');
  await page.getByRole('textbox', { name: 'Full name' }).fill('Unsaved');
  await page.getByRole('button', { name: 'Discard changes' }).click();
  await expect(page.getByRole('textbox', { name: 'Full name' })).toHaveValue('Taylor Jordan');
  await page.getByRole('tab', { name: 'Preferences', exact: true }).click();
  await page.getByRole('radio', { name: 'Compact', exact: false }).check();
  await expect(page.locator('.settings-page')).toHaveAttribute('data-density', 'compact');
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  const files = await download(page, page.getByRole('button', { name: 'Download project' }), 'settings');
  expect(files['src/components/Selection/Selection.jsx']).toBeTruthy();
});

test('settings protect invalid and unsaved edits; Select announces keyboard focus', async ({ page }) => {
  await page.goto('/?page=examples&example=settings');
  await page.getByRole('textbox', { name: 'Full name' }).fill('   ');
  await page.getByRole('tab', { name: 'Notifications', exact: true }).click();
  await page.getByRole('button', { name: 'Save changes', exact: true }).click();
  await expect(page.getByRole('tab', { name: 'Profile', exact: true })).toHaveAttribute('aria-selected', 'true');
  await expect(page.getByRole('textbox', { name: 'Full name' })).toBeFocused();
  expect(await page.evaluate(() => localStorage.getItem('duoop-example-settings-v1'))).toBeNull();
  await page.getByRole('textbox', { name: 'Full name' }).fill('A draft worth keeping');
  await page.getByRole('tab', { name: 'Code', exact: true }).click();
  await page.getByRole('tab', { name: 'Preview', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Full name' })).toHaveValue('A draft worth keeping');
  page.once('dialog', dialog => dialog.dismiss());
  await page.getByRole('searchbox').fill('tabs');
  await expect(page.getByRole('textbox', { name: 'Full name' })).toHaveValue('A draft worth keeping');
  await page.getByRole('button', { name: 'Discard changes' }).click();
  await page.getByRole('tab', { name: 'Preferences', exact: true }).click();
  const select = page.getByRole('combobox', { name: 'Preferred language' });
  await select.press('ArrowDown');
  await select.press('ArrowDown');
  const active = await select.getAttribute('aria-activedescendant');
  await expect(page.locator(`[id="${active}"]`)).toContainText('Français');
  await select.press('Enter');
  await expect(select).toContainText('Français');
  await select.press('ArrowDown');
  await select.press('Escape');
  await expect(select).toBeFocused();
  await expect(select).toHaveAttribute('aria-expanded', 'false');
});

test('responsive layouts, keyboard navigation and accessibility', async ({ page }) => {
  test.setTimeout(240000);
  const routes = ['/', '/?page=installation', '/?component=builtin-menu&tab=code', '/?page=examples', '/?page=examples&example=landing', '/?page=examples&example=settings'];
  const violations = [];
  for (const width of [1440, 1024, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 960 });
    for (const path of routes) {
      await page.goto(path);
      await expect(page.locator('.page-loading')).toHaveCount(0);
      await settle(page);
      await noOverflow(page);
      if ([1440, 390].includes(width)) {
        const result = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
        violations.push(...result.violations.map(item => ({ width, path, id: item.id, nodes: item.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })));
        await page.screenshot({ path: `artifacts/${path.includes('landing') ? 'landing' : path.includes('settings') ? 'settings' : path.includes('installation') ? 'installation' : path.includes('component') ? 'code' : path.includes('examples') ? 'examples' : 'home'}-${width}.png`, fullPage: false });
      }
    }
  }
  await fs.writeFile('artifacts/accessibility.json', JSON.stringify(violations, null, 2));
  expect(violations).toEqual([]);
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.locator('.catalog-sidebar')).toBeVisible();
  const drawer = page.getByRole('dialog', { name: 'Library navigation' });
  await drawer.getByRole('button', { name: 'Close navigation' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(drawer.getByRole('link', { name: 'Start building' })).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(drawer.getByRole('button', { name: 'Close navigation' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open navigation' })).toBeFocused();
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/?component=builtin-menu');
  await page.getByRole('tab', { name: 'Preview', exact: true }).press('ArrowRight');
  await expect(page.getByRole('tab', { name: 'Code', exact: true })).toBeFocused();
});
