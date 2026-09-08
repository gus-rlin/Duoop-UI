import { readFile } from 'node:fs/promises';

export const data = JSON.parse(await readFile(new URL('./data.json', import.meta.url), 'utf8'));
const normalize = value => value.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const describe = entry => ({
  id: entry.id, name: entry.name, category: entry.category, family: entry.folder,
  summary: entry.summary, url: `https://duoop-ui.com/?component=${entry.id}`,
});

export function search({ query = '', family = '', limit = 20, offset = 0 } = {}) {
  const terms = normalize(query).split(' ').filter(Boolean);
  const group = normalize(family);
  const results = data.entries.flatMap(entry => {
    const componentText = normalize([entry.id, entry.name, entry.component, entry.category, entry.folder, entry.summary].join(' '));
    const matches = (text, variantGroup = '') => terms.every(term => text.includes(term)) &&
      (!group || [entry.category, entry.folder, entry.name, variantGroup].some(value => normalize(value) === group));
    const result = [];
    if (matches(componentText)) result.push({ ...describe(entry), type: 'component', variantCount: entry.variants.length });
    for (const variant of entry.variants) {
      if (matches(`${componentText} ${normalize(variant.name)} ${normalize(variant.group)}`, variant.group)) {
        result.push({ ...describe(entry), type: 'variant', variant: variant.name, group: variant.group });
      }
    }
    return result;
  });
  // Keep component discovery useful even when the first family has many variants.
  results.sort((a, b) => Number(a.type === 'variant') - Number(b.type === 'variant'));
  return { total: results.length, offset, nextOffset: offset + limit < results.length ? offset + limit : null,
    families: [...new Set(data.entries.map(entry => entry.category))], results: results.slice(offset, offset + limit) };
}

export function getSource({ component, variant, file } = {}) {
  const key = normalize(component);
  const entries = data.entries.filter(entry => [entry.id, entry.id.slice(8), entry.name, entry.component].some(value => normalize(value) === key));
  const entry = entries.find(item => normalize(item.id) === key || normalize(item.name) === key) || (entries.length === 1 ? entries[0] : null);
  if (!entry) throw new Error('Unknown or ambiguous component. Use search_components and pass its exact component id.');
  const selected = variant ? entry.variants.find(item => normalize(item.name) === normalize(variant)) : null;
  if (variant && !selected) throw new Error(`Unknown variant for ${entry.name}. Available variants: ${entry.variants.map(item => item.name).join(', ')}`);
  const bundle = selected?.bundle || entry.bundle;
  if (file && !bundle.files.some(([name]) => name === file)) throw new Error('Unknown file. Pass one of the exact paths in the source manifest.');
  return {
    ...describe(entry), variant: selected?.name || null,
    variants: entry.variants.map(({ name, group }) => ({ name, group })),
    dependencies: Object.fromEntries(bundle.dependencies.map(name => [name, data.dependencies[name]])),
    instructions: 'Copy files preserving paths. src/App.jsx is the runnable example; adapt it to your app. Import base.css once. Install listed dependencies. For Next.js use a client boundary; Map also requires SSR disabled. Preserve the supplied license and third-party notices.',
    manifest: bundle.files.map(([path, hash]) => ({ path, bytes: Buffer.byteLength(data.sources[hash]) })),
    files: bundle.files.filter(([path]) => !file || path === file).map(([path, hash]) => ({ path, content: data.sources[hash] })),
    license: 'Apache-2.0',
  };
}
