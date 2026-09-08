import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';

const root = path.resolve(import.meta.dirname, '..');
// Gallery definitions belong to the release fingerprint too: adding a variant
// must not silently leave the machine-facing snapshot behind the public UI.
export async function catalogFingerprint() {
  const componentFiles = (await fs.readdir(path.join(root, 'src/components'), { recursive: true }))
    .filter(name => /\.(jsx|js|css|json)$/.test(name))
    .map(name => `src/components/${name.replaceAll('\\', '/')}`);
  const files = [...componentFiles, 'src/base.css', 'src/catalog/catalog.js', 'src/catalog/recipes.js',
    'src/catalog/essential-recipes.js', 'src/catalog/source-bundle.js', 'LICENSE', 'THIRD_PARTY_NOTICES.md'].sort();
  const hash = createHash('sha256');
  for (const file of files) hash.update(file).update('\0').update((await fs.readFile(path.join(root, file), 'utf8')).replaceAll('\r\n', '\n')).update('\0');
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  hash.update(JSON.stringify({ ...manifest.dependencies, ...manifest.peerDependencies }));
  return hash.digest('hex');
}
