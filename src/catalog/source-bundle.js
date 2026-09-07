const loaders = import.meta.glob('../components/**/*.{jsx,js,css,json}', {
  query: '?raw',
  import: 'default',
});
const baseLoader = () => import('../base.css?raw').then((module) => module.default);
const cache = new Map();
const normalize = (path) => {
  const segments = [];
  for (const part of path.split('/')) {
    if (part === '..') segments.pop();
    else if (part !== '.') segments.push(part);
  }
  return segments.join('/');
};
export function resolveFile(from, specifier) {
  const path = normalize(`${from.slice(0, from.lastIndexOf('/'))}/${specifier.split('?')[0]}`);
  return [path, `${path}.jsx`, `${path}.js`, `${path}.css`, `${path}.json`].find(
    (candidate) => candidate === 'src/base.css' || loaders[candidate.replace('src/', '../')],
  );
}
export async function readSource(path) {
  if (!cache.has(path)) {
    const loader = path === 'src/base.css' ? baseLoader : loaders[path.replace('src/', '../')];
    if (!loader) throw new Error(`Source file is missing: ${path}`);
    cache.set(
      path,
      loader().catch((error) => {
        cache.delete(path);
        throw error;
      }),
    );
  }
  return cache.get(path);
}
export function importsIn(code) {
  return [
    ...code.matchAll(
      /(?:\bimport\s+(?:[^;'"]+?\s+from\s+)?|\bexport\s+[^;'"]+?\s+from\s+|@import\s+)["']([^"']+)["']/g,
    ),
  ].map((match) => match[1]);
}
export async function collectFiles(paths, virtual = {}) {
  const files = new Map();
  const dependencies = new Set(['react', 'react-dom']);
  async function visit(path) {
    if (files.has(path)) return;
    files.set(path, '');
    const code = virtual[path] ?? (await readSource(path));
    files.set(path, code);
    for (const specifier of importsIn(code)) {
      if (specifier.startsWith('.')) {
        const virtualPath = normalize(`${path.slice(0, path.lastIndexOf('/'))}/${specifier}`);
        const resolved = Object.hasOwn(virtual, virtualPath)
          ? virtualPath
          : resolveFile(path, specifier);
        if (!resolved) throw new Error(`Missing ${specifier}, imported by ${path}`);
        await visit(resolved);
      } else if (!specifier.startsWith('http'))
        dependencies.add(
          specifier.startsWith('@')
            ? specifier.split('/').slice(0, 2).join('/')
            : specifier.split('/')[0],
        );
    }
  }
  for (const path of paths) await visit(path);
  return { files: [...files], dependencies: [...dependencies].sort() };
}
export async function componentBundle(entry, usage) {
  return collectFiles(['src/App.jsx', 'src/base.css', entry.path], { 'src/App.jsx': usage });
}

// An example includes its actual demonstration module, plus the complete import graph.
// Relocating explicit imports keeps every supplied file directly copyable into src/.
export async function exampleBundle(entry, snippet, origin) {
  const demoPath = `src/components/${entry.folder}/${entry.demo}.jsx`;
  const from = origin || `src/components/${entry.folder}/${entry.showcase}.jsx`;
  let code = snippet.replace(
    /(\bfrom\s+|\bimport\s+)(['"])(\.[^'"]+)\2/g,
    (match, prefix, quote, specifier) => {
      const resolved = resolveFile(from, specifier);
      if (!resolved) throw new Error(`Cannot resolve ${specifier} from ${from}`);
      return `${prefix}${quote}./${resolved.slice(4)}${quote}`;
    },
  );
  const demo = await readSource(demoPath);
  if (!code.includes('import ')) {
    const used = [...code.matchAll(/<([A-Z][\w]*)\b/g)].map((match) => match[1]);
    const exported = [...demo.matchAll(/export\s+(?:function|const|class)\s+(\w+)/g)].map(
      (match) => match[1],
    );
    const names = [...new Set(used.filter((name) => exported.includes(name)))];
    if (names.length)
      code = `import { ${names.join(', ')} } from './${demoPath.slice(4)}';\n\n${code}`;
  }
  if (!/import\s+React\b/.test(code)) code = `import React from 'react';\n${code}`;
  if (!/export\s+default\b/.test(code)) {
    const importLines = [];
    code = code.replace(/import\s+(?:[^;]+?\s+from\s+)?['"][^'"]+['"];?/g, (match) => {
      importLines.push(match);
      return '';
    });
    code = `${importLines.join('\n')}\n\nexport default function App() {\n  return (\n    <>${code.trim()}</>\n  );\n}\n`;
  }
  code = `import './base.css';\n${code}`;
  const extraStyles = Object.keys(loaders)
    .filter(
      (key) => key.startsWith(`../components/${entry.folder}/`) && /Showcase\.css$/.test(key),
    )
    .map((key) => key.replace('../', 'src/'));
  if (entry.folder === 'Button') extraStyles.push('src/components/Button/showcase.css');
  for (const style of extraStyles) code = `import './${style.slice(4)}';\n${code}`;
  const bundle = await collectFiles(['src/App.jsx'], { 'src/App.jsx': code });
  // Put the real demonstration implementation ahead of its short mounting example.
  bundle.files.sort(([a], [b]) => (a === demoPath ? -1 : b === demoPath ? 1 : 0));
  return bundle;
}
