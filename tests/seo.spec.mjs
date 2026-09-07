import { test, expect } from '@playwright/test';
import { categories, entries } from '../src/catalog/catalog.js';
import { siteOrigin } from '../src/catalog/seo.js';

test('SEO files are served as text and XML, and cover the public catalogue', async ({ page, request }) => {
  const robots = await request.get('/robots.txt');
  expect(robots.status()).toBe(200);
  expect(robots.headers()['content-type']).toContain('text/plain');
  expect((await robots.text()).replaceAll('\r\n', '\n')).toBe(`User-agent: *\nDisallow:\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);

  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.status()).toBe(200);
  expect(sitemap.headers()['content-type']).toMatch(/(?:application|text)\/xml/);
  const xml = await sitemap.text();
  const parsed = await page.evaluate((source) => {
    const doc = new DOMParser().parseFromString(source, 'application/xml');
    return {
      error: !!doc.querySelector('parsererror'),
      namespace: doc.documentElement.namespaceURI,
      urls: [...doc.querySelectorAll('loc')].map((loc) => loc.textContent),
    };
  }, xml);
  expect(parsed.error).toBe(false);
  expect(parsed.namespace).toBe('http://www.sitemaps.org/schemas/sitemap/0.9');
  const expected = [
    '/', '/?page=components', '/?page=installation', '/?page=examples',
    '/?page=examples&example=landing',
    ...categories.map((category) => `/?category=${encodeURIComponent(category)}`),
    ...entries.map((entry) => `/?component=${entry.id}`),
  ].map((path) => `${siteOrigin}${path}`);
  expect(parsed.urls).toEqual(expected);
  expect(new Set(parsed.urls).size).toBe(expected.length);

  const llms = await request.get('/llms.txt');
  expect(llms.status()).toBe(200);
  expect(llms.headers()['content-type']).toContain('text/plain');
  const text = (await llms.text()).replaceAll('\r\n', '\n');
  expect(text).toMatch(/^# Duoop-UI\n\n> /);
  expect(text).not.toMatch(/localhost|127\.0\.0\.1|8a3f3afc|\[DOMAINE\]/);
  const links = [...text.matchAll(/\]\((https:\/\/[^)]+)\)/g)].map((match) => match[1]);
  expect(links.length).toBeGreaterThan(10);
  for (const link of links) {
    if (new URL(link).origin === siteOrigin) expect(parsed.urls).toContain(link);
    else expect(link).toBe('https://github.com/gus-rlin/Duoop-UI');
  }
});

test('SEO keeps strategic pages indexable and canonicalizes their view parameters', async ({ page }) => {
  const cases = [
    ['/', '/'],
    ['/?page=components', '/?page=components'],
    ['/?category=Forms', '/?category=Forms'],
    ['/?category=Animations', '/?category=Motion'],
    ['/?tab=code&component=builtin-menu&utm_source=test', '/?component=builtin-menu'],
    ['/?component=builtin-relief-button&tab=installation', '/?component=builtin-relief-button'],
    ['/?page=installation', '/?page=installation'],
    ['/?page=examples', '/?page=examples'],
    ['/?page=examples&example=landing&tab=code', '/?page=examples&example=landing'],
  ];
  for (const [input, canonical] of cases) {
    await page.goto(input);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', siteOrigin + canonical);
    await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
    await expect(page.locator('.page-loading')).toHaveCount(0);
    await expect(page.locator('main')).not.toContainText('This page could not load.');
  }
});

test('SEO search noindex is removed when navigating to a component and restored by history', async ({ page }) => {
  await page.goto('/?page=components&q=dropdown');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await expect(page.locator('.catalog-card')).toHaveCount(1);
  await page.getByRole('link', { name: 'Get Dropdown Menu code' }).click();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteOrigin}/?component=builtin-menu`);
  await page.goBack();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await page.getByRole('searchbox').fill('');
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteOrigin}/?page=components`);
});

test('SEO excludes nonexistent components without excluding valid component pages', async ({ page }) => {
  await page.goto('/?component=does-not-exist');
  await expect(page.getByRole('heading', { name: 'Component not found.' })).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Explore all components' }).click();
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${siteOrigin}/?page=components`);
});
