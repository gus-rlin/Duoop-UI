import { openCatalog } from './catalog-page.mjs';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
const card = title => page.getByRole('article', { name: `Checkbox: ${title}`, exact: true });
try {
  await openCatalog(page, `${process.env.TEST_URL || 'http://127.0.0.1:5176'}/?component=builtin-checkbox`);
  await page.getByRole('heading', { name: 'Checkbox', exact: true }).waitFor();
  assert.equal(await page.locator('.gallery-card').count(), 47);
  const simple = card('Simple with label').getByRole('checkbox');
  await card('Simple with label').getByText('Enable notifications', { exact: true }).click();
  assert.equal(await simple.isChecked(), true);
  await simple.press('Space');
  assert.equal(await simple.isChecked(), false);
  assert.equal(await simple.evaluate(el => el.matches(':focus-visible')), true);
  assert.equal(await simple.evaluate(el => getComputedStyle(el.nextElementSibling).outlineStyle), 'none');
  assert.equal(await simple.evaluate(el => getComputedStyle(el.nextElementSibling).borderTopStyle), 'dashed');
  const partial = card('Partially selected');
  const parent = partial.getByRole('checkbox', { name: 'Select all teams' });
  assert.equal(await parent.evaluate(el => el.indeterminate), true);
  await parent.click();
  assert.equal(await partial.locator('input:checked').count(), 4);
  await parent.click();
  assert.equal(await partial.locator('input:checked').count(), 0);
  const locked = card('Parent with disabled child');
  await locked.getByRole('checkbox', { name: 'Select all teams' }).click();
  await locked.getByRole('checkbox', { name: 'Select all teams' }).click();
  assert.equal(await locked.locator('input:checked').count(), 1);
  assert.equal(await locked.getByRole('checkbox', { name: 'Research' }).isChecked(), true);
  for (const title of ['Disabled unchecked', 'Disabled checked', 'Disabled indeterminate']) assert.equal(await card(title).getByRole('checkbox').isDisabled(), true);
  assert.equal(await card('Disabled indeterminate').getByRole('checkbox').evaluate(el => el.indeterminate), true);
  const readonly = card('Read only').getByRole('checkbox');
  await readonly.click();
  assert.equal(await readonly.isChecked(), true);
  await readonly.press('Space');
  assert.equal(await readonly.isChecked(), true);
  const nested = card('Nested parents');
  await nested.getByRole('checkbox', { name: 'Content', exact: true }).click();
  assert.equal(await nested.getByRole('checkbox', { name: 'Edit projects', exact: true }).isChecked(), true);
  assert.equal(await nested.getByRole('checkbox', { name: 'Projects', exact: true }).evaluate(el => el.indeterminate), true);
  await nested.getByRole('checkbox', { name: 'All permissions', exact: true }).click();
  assert.equal(await nested.locator('input:not(:checked)').count(), 0);
  for (const [title, label] of [['Required checkbox form', /Accept terms/], ['Group form', 'Email']]) {
    const form = card(title);
    await form.getByRole('button', { name: 'Save preferences' }).click();
    assert.equal(await form.locator('input').first().evaluate(el => el === document.activeElement), true);
    assert.equal(await form.locator('input').first().getAttribute('aria-invalid'), 'true');
    await form.getByRole('checkbox', { name: label }).check();
    await form.getByRole('button', { name: 'Save preferences' }).click();
    assert.match(await form.locator('.checkbox-form-notice').innerText(), /Preferences saved/);
    assert.equal(await form.locator('button[type=submit]').getAttribute('data-status'), 'success');
    assert.equal(await form.locator('.feedback-symbol').evaluate(el => getComputedStyle(el).animationName), 'feedback-trace');
    await form.getByRole('button', { name: 'Reset' }).click();
    assert.equal(await form.locator('input:checked').count(), 0);
    assert.equal(await form.locator('.checkbox-form-notice').innerText(), '');
  }
  const table = card('Table row selection');
  await table.getByRole('checkbox', { name: 'Select all files', exact: true }).click();
  assert.equal(await table.locator('tbody tr[data-selected=true]').count(), 3);
  await card('Simple with label').getByRole('button', { name: /View code/ }).click();
  await page.getByRole('dialog').waitFor();
  assert.match(await page.getByRole('dialog').locator('pre').innerText(), /SelectionExample/);
  await page.keyboard.press('Escape');
  assert.equal(await page.getByRole('dialog').count(), 0);
  await page.getByRole('button', { name: 'Cards', exact: true, pressed: false }).click();
  assert.equal(await page.locator('.gallery-card').count(), 7);
  await mkdir('artifacts', { recursive: true });
  await page.evaluate(() => scrollTo(0, 0));
  await page.screenshot({ path: 'artifacts/checkbox-desktop.png' });
  for (const width of [1024, 390]) {
    await page.setViewportSize({ width, height: 844 });
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  }
  await card('Selected card').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'artifacts/checkbox-mobile.png' });
  await page.getByRole('button', { name: 'Theme & direction', exact: true }).click();
  await card('Dark theme').scrollIntoViewIfNeeded();
  await page.screenshot({ path: 'artifacts/checkbox-themes.png' });
  assert.equal(await card('Dark & right to left').locator('[dir=rtl]').count(), 1);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  assert.equal(await card('Dark theme').locator('.checkbox-box').first().evaluate(el => getComputedStyle(el).transitionDuration), '0s');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
  assert.deepEqual(errors, []);
  console.log('PASS: 47 examples, labels, keyboard, mixed states, disabled preservation, read-only, nested parents, forms, reset, table, code dialog, filters, responsive widths, dark/RTL and reduced motion.');
} finally { await browser.close(); }



