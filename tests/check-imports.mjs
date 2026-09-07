import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { parse } from '@babel/parser';

const files = fs.readdirSync('src', { recursive: true }).filter(file => /\.(js|jsx|css)$/.test(file)).map(file => path.join('src', file));
const failures = [];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  const imports = file.endsWith('.css')
    ? [...source.matchAll(/@import\s+["']([^"']+)["']/g)].map(match => match[1])
    : parse(source, { sourceType: 'module', plugins: ['jsx'] }).program.body.filter(node => ['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source).map(node => node.source.value);
  for (const specifier of imports) {
    if (!specifier.startsWith('.')) continue;
    const target = path.resolve(path.dirname(file), specifier.split('?')[0]);
    const resolved = [target, target + '.jsx', target + '.js', target + '.css', target + '.json'].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    if (!resolved) { failures.push(`${file}: missing ${specifier}`); continue; }
    let current = path.resolve('src');
    for (const part of path.relative(current, resolved).split(path.sep)) {
      if (part === '..') { current = path.dirname(current); continue; }
      if (!fs.readdirSync(current).includes(part)) { failures.push(`${file}: incorrect import casing ${specifier}`); break; }
      current = path.join(current, part);
    }
  }
}
assert.deepEqual(failures, []);
console.log(`PASS: ${files.length} source files checked for resolvable imports and exact path casing.`);
