import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { categories, entries, repository } from '../src/catalog/catalog.js';
import { siteOrigin } from '../src/catalog/seo.js';

const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFile(path.join(root, file), 'utf8');
const manifest = JSON.parse(await read('package.json'));
const tracked = execFileSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8', windowsHide: true }).split('\0').filter(Boolean);
const documents = tracked.filter(file => /\.(md|txt)$/.test(file));
const guideFiles = ['src/catalog/Installation.jsx', 'src/catalog/Examples.jsx', 'src/catalog/download.js'];
const publicPaths = new Set([
  '/', '/?page=components', '/?page=installation', '/?page=examples',
  '/?page=examples&example=landing', '/robots.txt', '/llms.txt', '/sitemap.xml',
  ...categories.map(category => `/?category=${encodeURIComponent(category)}`),
  ...entries.map(entry => `/?component=${entry.id}`),
]);

assert.equal(manifest.homepage, `${siteOrigin}/`, 'Package homepage must match canonical origin');
assert.equal(manifest.repository.url, `git+${repository}.git`);

for (const file of [...documents, ...guideFiles]) {
  const content = await read(file);
  assert.doesNotMatch(content, /https?:\/\/[^\s)"<>]*\.pages\.dev\b/, `${file}: use the production domain`);
  assert.doesNotMatch(content, /\b(?:34 components|504 variants|Apache 2\.0d|No Duoop npm package)\b/i, `${file}: obsolete documentation`);
  assert.doesNotMatch(content, /no published\s+`?duoop-ui`?\s+npm package|duoop-ui\s+(?:npm\s+)?package\s+is\s+not\s+(?:yet\s+)?published/i, `${file}: obsolete npm publication claim`);
  for (const [, command] of content.matchAll(/\bnpm run ([\w:-]+)/g)) {
    assert.ok(Object.hasOwn(manifest.scripts, command), `${file}: npm script ${command} does not exist`);
  }
  for (const [, target] of content.matchAll(/\]\(([^)]+)\)/g)) {
    if (target.startsWith('https://')) {
      const url = new URL(target);
      if (url.origin !== siteOrigin) continue;
      url.searchParams.delete('tab');
      assert.ok(publicPaths.has(url.pathname + url.search), `${file}: unknown public route ${target}`);
    } else if (!/^(?:[a-z]+:|#)/i.test(target)) {
      const local = decodeURIComponent(target.split('#')[0]);
      await assert.doesNotReject(fs.access(path.resolve(root, path.dirname(file), local)), `${file}: missing link target ${target}`);
    }
  }
}

for (const file of ['README.md', 'VALIDATION.md', 'public/llms.txt']) {
  const content = await read(file);
  const counts = [...content.matchAll(/\b(\d+) components (?:across|in) (\d+) categories\b/g)];
  assert.ok(counts.length, `${file}: missing catalog totals`);
  for (const [, components, groups] of counts) {
    assert.equal(Number(components), entries.length, `${file}: stale component count`);
    assert.equal(Number(groups), categories.length, `${file}: stale category count`);
  }
}

const llms = await read('public/llms.txt');
const indexed = [...llms.matchAll(/\]\(https:\/\/[^)]+\?component=([^)&]+)\)/g)].map(match => match[1]);
assert.deepEqual(indexed.sort(), entries.map(entry => entry.id).sort(), 'llms.txt must index every component exactly once');
const sitemap = await read('public/sitemap.xml');
const locations = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1].replaceAll('&amp;', '&'));
const expected = [...publicPaths].filter(route => !/\.(txt|xml)$/.test(route)).map(route => siteOrigin + route);
assert.deepEqual(locations.sort(), expected.sort(), 'Sitemap routes must match the public catalog');
const seo = await read('SEO.md');
assert.equal(Number(seo.match(/\b(\d+) URLs\b/)?.[1]), expected.length, 'SEO.md: stale sitemap total');
console.log(`PASS documentation: ${documents.length} Markdown/TXT files, 3 rendered/download guides, ${entries.length} components, ${categories.length} categories and ${expected.length} sitemap URLs.`);
