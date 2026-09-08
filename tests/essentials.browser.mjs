import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const server = await createServer({
  server: { host: '127.0.0.1', port: 0 },
  logLevel: 'error',
});
await server.listen();
const base = server.resolvedUrls.local[0];
const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('console', (message) => {
  if (message.type() === 'error' || message.type() === 'warning')
    errors.push(message.text());
});
const gallery = (name, title) =>
  page.getByRole('article', { name: `${name}: ${title}`, exact: true });
const go = async (id) => {
  await page.goto(`${base}?component=builtin-${id}`);
  await expect(page.locator('.button-showcase')).toBeVisible();
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((animation) =>
          Number.isFinite(animation.effect?.getComputedTiming().endTime),
        )
        .map((animation) => animation.finished.catch(() => {})),
    ),
  );
};
const contained = async (locator) => {
  const box = await locator.boundingBox();
  assert.ok(box);
  assert.ok(
    box.x >= 0 &&
      box.y >= 0 &&
      box.x + box.width <= page.viewportSize().width + 1 &&
      box.y + box.height <= page.viewportSize().height + 1,
    JSON.stringify(box),
  );
};
await fs.mkdir('artifacts/essentials', { recursive: true });
try {
  await go('tooltip');
  const save = gallery('Tooltip', 'Icon toolbar').getByRole('button', {
    name: 'Save to collection',
  });
  await save.hover();
  await page.waitForTimeout(100);
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await expect(page.getByRole('tooltip')).toBeVisible();
  await contained(page.locator('.duoop-tooltip').first());
  await page.keyboard.press('Escape');
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await page.mouse.move(0, 0);
  await save.focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await save.press('Enter');
  await expect(gallery('Tooltip', 'Icon toolbar')).toContainText('1 demo actions');
  await gallery('Tooltip', 'Disabled action')
    .getByRole('group', { name: 'Publish collection' })
    .focus();
  await expect(
    page.getByRole('tooltip', { name: /Add at least one file/ }),
  ).toContainText('Add at least one file');
  console.log('PASS tooltip delay, keyboard, activation, disabled trigger');

  await go('popover');
  const edit = gallery('Popover', 'Quick edit').getByRole('button', {
    name: 'Edit details',
  });
  await edit.click();
  const popup = page.getByRole('dialog', { name: 'Edit collection' });
  await expect(popup.getByRole('textbox')).toBeFocused();
  await contained(popup);
  await popup.getByRole('textbox').fill('New collection');
  await popup.getByRole('button', { name: 'Save changes' }).click();
  await expect(gallery('Popover', 'Quick edit')).toContainText('New collection');
  await expect(edit).toBeFocused();
  await edit.click();
  await page.keyboard.press('Escape');
  await expect(popup).toHaveCount(0);
  await expect(edit).toBeFocused();
  console.log('PASS popover focus, form, Escape and restoration');

  await go('slider');
  const volume = gallery('Slider', 'Volume').getByRole('slider');
  await volume.focus();
  await volume.press('ArrowRight');
  await expect(volume).toHaveAttribute('aria-valuenow', '65');
  await volume.press('Home');
  await expect(volume).toHaveAttribute('aria-valuenow', '0');
  await volume.press('End');
  await expect(volume).toHaveAttribute('aria-valuenow', '100');
  const thumbs = gallery('Slider', 'Price range').getByRole('slider');
  await thumbs.first().press('End');
  assert.ok(
    Number(await thumbs.first().getAttribute('aria-valuenow')) <
      Number(await thumbs.last().getAttribute('aria-valuenow')),
  );
  console.log('PASS single/range slider keyboard and separation');

  await go('calendar');
  const cal = gallery('Calendar', 'Pick a day');
  await cal.getByRole('combobox', { name: /month/i }).selectOption('9');
  await expect(cal.getByRole('combobox', { name: /month/i })).toHaveValue('9');
  await cal.getByRole('combobox', { name: /year/i }).selectOption('2027');
  await expect(cal.getByRole('combobox', { name: /year/i })).toHaveValue('2027');
  await expect(
    gallery('Calendar', 'Weekdays only').locator('.rdp-disabled button').first(),
  ).toBeDisabled();
  const day = cal.locator('.rdp-day_button').filter({ hasText: /^15$/ });
  await day.focus();
  await day.press('ArrowRight');
  await expect(
    cal.locator('.rdp-day_button').filter({ hasText: /^16$/ }),
  ).toBeFocused();
  await go('date-picker');
  const date = gallery('Date Picker', 'Schedule a visit');
  await date.getByRole('button', { name: 'Visit date', exact: true }).click();
  await page
    .locator('.duoop-date-picker__popup[data-state="open"] .rdp-day_button')
    .filter({ hasText: /^16$/ })
    .click();
  await expect(date.locator('input[name="visit"]')).toHaveValue('2026-09-16');
  const stay = gallery('Date Picker', 'Plan a stay');
  await stay.getByRole('button', { name: 'Your stay', exact: true }).click();
  await page
    .locator('.duoop-date-picker__popup[data-state="open"] .rdp-day_button')
    .filter({ hasText: /^14$/ })
    .click();
  await expect(
    page.locator('.duoop-date-picker__popup[data-state="open"]'),
  ).toBeVisible();
  await page
    .locator('.duoop-date-picker__popup[data-state="open"] .rdp-day_button')
    .filter({ hasText: /^18$/ })
    .click();
  await expect(stay.locator('input[name="visit.from"]')).toHaveValue('2026-09-14');
  await expect(stay.locator('input[name="visit.to"]')).toHaveValue('2026-09-18');
  console.log('PASS calendar navigation, disabled dates, date/range form values');

  await go('table');
  const table = gallery('Table', 'Project activity');
  await table.getByRole('button', { name: 'Budget', exact: true }).click();
  await expect(table.locator('tbody tr').first()).toContainText('Welcome sequence');
  await table.getByRole('checkbox', { name: 'Select this page' }).check();
  await expect(table.locator('.duoop-data-table__footer > span')).toContainText(
    '4 of 7 selected',
  );
  await table.getByRole('button', { name: 'Next page' }).click();
  await expect(table.locator('tbody tr')).toHaveCount(3);
  await table.getByRole('button', { name: 'Previous page' }).click();
  await expect(
    table.getByRole('checkbox', { name: 'Select this page' }),
  ).toBeChecked();
  await table.getByRole('searchbox').fill('absent');
  await expect(table).toContainText('No results');
  await table.getByRole('button', { name: 'Clear search' }).click();
  await go('pagination');
  const archive = gallery('Pagination', 'Browse the archive');
  await archive.getByRole('button', { name: 'Next page' }).click();
  await expect(archive).toContainText('Small things, well made');
  console.log('PASS sorting, page selection, pagination, empty-state recovery');

  await go('sheet');
  for (const side of ['right', 'bottom', 'left', 'top']) {
    const trigger = page.getByRole('button', { name: `Open ${side} sheet` });
    await trigger.click();
    const sheet = page.getByRole('dialog', { name: 'Refine your stay' });
    await expect(sheet).toBeVisible();
    await page.waitForTimeout(260);
    await contained(sheet);
    await page.keyboard.press('Shift+Tab');
    assert.ok(await sheet.evaluate((node) => node.contains(document.activeElement)));
    await page.keyboard.press('Escape');
    await expect(sheet).toHaveCount(0);
    await expect(trigger).toBeFocused();
  }
  console.log('PASS four sheet placements, focus containment and restoration');

  await page.goto(`${base}tests/fixtures/essentials.html`);
  await page.getByRole('button', { name: 'Edge hint' }).focus();
  await expect(page.getByRole('tooltip')).toBeVisible();
  await contained(page.locator('.duoop-tooltip').first());
  await expect(page.locator('.duoop-tooltip').first()).toHaveAttribute(
    'data-side',
    'bottom',
  );
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Nested tools', exact: true }).click();
  await page.getByRole('button', { name: 'Child tools', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(
    page.getByRole('dialog', { name: 'Child tools', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole('dialog', { name: 'Parent tools' })).toBeVisible();
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: 'Dates', exact: true }).click();
  await page
    .locator('.duoop-date-picker__popup[data-state="open"] .rdp-day_button')
    .filter({ hasText: /^16$/ })
    .click();
  await expect(
    page.locator('.duoop-date-picker__popup[data-state="open"]'),
  ).toBeVisible();
  await page
    .locator('.duoop-date-picker__popup[data-state="open"] .rdp-day_button')
    .filter({ hasText: /^16$/ })
    .click();
  await expect(page.locator('input[name="dates.to"]')).toHaveValue('2026-09-16');
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page.getByRole('checkbox', { name: 'Select Gamma' })).toBeDisabled();
  await page.getByRole('button', { name: 'Shrink data' }).click();
  await expect(page.locator('tbody')).toContainText('Alpha');
  await expect(page.getByRole('button', { name: 'Next page' })).toBeDisabled();
  const input = page.locator('input[type="file"]');
  const file = (name) => ({
    name,
    mimeType: 'text/plain',
    buffer: Buffer.from('a real local fixture'),
  });
  await input.setInputFiles({
    name: 'large.txt',
    mimeType: 'text/plain',
    buffer: Buffer.alloc(2048),
  });
  await expect(page.locator('.duoop-file-upload__errors')).toContainText('larger');
  await input.setInputFiles([file('a.txt'), file('b.txt'), file('c.txt')]);
  await expect(page.locator('.duoop-file-upload__list li')).toHaveCount(2);
  await expect(page.locator('.duoop-file-upload__errors')).toContainText('up to 2');
  await page.getByRole('button', { name: 'Upload files', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.uploadJobs.length)).toBe(2);
  await page.evaluate(() => {
    window.uploadJobs[0].progress(42);
    window.uploadJobs[1].reject(new Error('Network unavailable. Retry.'));
  });
  await expect(
    page.getByRole('progressbar', { name: 'Uploading a.txt' }),
  ).toHaveAttribute('aria-valuenow', '42');
  await expect(page.getByRole('alert')).toContainText('Network unavailable');
  await page.getByRole('button', { name: 'Retry', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.uploadJobs.length)).toBe(3);
  await page.evaluate(() => window.uploadJobs[2].resolve());
  await expect(page.locator('li[data-state="success"]')).toContainText('b.txt');
  await page.getByRole('button', { name: 'Cancel a.txt' }).click();
  assert.equal(await page.evaluate(() => window.uploadJobs[0].aborted), true);
  await page.getByRole('button', { name: 'Remove b.txt' }).click();
  await input.setInputFiles(file('c.txt'));
  await page.getByRole('button', { name: 'Upload files', exact: true }).click();
  await expect.poll(() => page.evaluate(() => window.uploadJobs.length)).toBe(4);
  await page.getByRole('button', { name: 'Toggle uploader' }).click();
  assert.equal(await page.evaluate(() => window.uploadJobs[3].aborted), true);
  console.log(
    'PASS edge collision, nested overlays, one-day range, changed data, upload rejection/progress/retry/cancel/unmount',
  );

  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const touchPage = await touch.newPage();
  await touchPage.goto(`${base}tests/fixtures/essentials.html`);
  await touchPage.getByRole('button', { name: 'Immediate action' }).tap();
  await expect(touchPage.getByLabel('Action count')).toHaveText('1');
  await expect(touchPage.getByRole('tooltip')).toHaveCount(0);
  await expect(
    touchPage.getByRole('button', { name: 'Immediate action' }),
  ).not.toHaveAttribute('title');
  await touch.close();
  console.log('PASS touch activation without tooltip interception');

  const ids = [
    'tooltip',
    'popover',
    'slider',
    'calendar',
    'date-picker',
    'table',
    'pagination',
    'sheet',
    'file-upload',
    'skeleton',
    'alert',
  ];
  const violations = [];
  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const id of ids) {
      await go(id);
      await page.evaluate(() => document.fonts.ready);
      assert.ok(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        `${id} overflow at ${width}`,
      );
      // Also catch preview-only clipping, which does not necessarily overflow the page.
      if (id === 'calendar')
        assert.ok(
          await page
            .locator('.duoop-calendar')
            .first()
            .evaluate((node) => node.scrollWidth <= node.clientWidth + 2),
          `calendar internal overflow ${width}`,
        );
      if ([1440, 390].includes(width)) {
        const results = await new AxeBuilder({ page })
          .include('.button-showcase')
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        violations.push(
          ...results.violations.map((v) => ({
            id,
            width,
            rule: v.id,
            nodes: v.nodes.map((n) => ({
              target: n.target,
              summary: n.failureSummary,
            })),
          })),
        );
        await page
          .locator('.component-gallery')
          .screenshot({ path: `artifacts/essentials/${id}-${width}.png` });
      }
    }
    console.log(`PASS all eleven galleries at ${width}px`);
  }
  await fs.writeFile(
    'artifacts/essentials/accessibility.json',
    JSON.stringify(violations, null, 2),
  );
  assert.deepEqual(violations, []);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await go('skeleton');
  assert.equal(
    await page
      .locator('.duoop-skeleton')
      .first()
      .evaluate((node) => getComputedStyle(node, '::after').animationName),
    'none',
  );
  await go('alert');
  const dismissible = gallery('Alert', 'Dismissible');
  await dismissible.getByRole('button', { name: /^Dismiss / }).click();
  await expect(dismissible.getByRole('region')).toHaveCount(0);
  await dismissible.getByRole('button', { name: 'Restore callout' }).click();
  await expect(dismissible.getByRole('region')).toBeVisible();
  assert.deepEqual(errors, []);
  console.log(
    'PASS accessibility, reduced motion, alert dismissal and clean console',
  );
} finally {
  await browser.close();
  await server.close();
}
