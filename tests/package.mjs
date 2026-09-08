import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { parse } from '@babel/parser';
import { chromium } from 'playwright';
import { entries } from '../src/catalog/catalog.js';

const root = path.resolve(import.meta.dirname, '..');
// A sibling avoids resolving missing consumer dependencies from this repository.
const parent = path.dirname(root);
const directory = await fs.mkdtemp(path.join(parent, 'duoop-package-'));
const npm = process.env.npm_execpath;
assert.ok(npm, 'Run this check with npm run test:package');
const env = { ...process.env };
const run = (args, cwd = directory) => execFileSync(process.execPath, [npm, ...args], {
  cwd, env, windowsHide: true, timeout: 180000, encoding: 'utf8', stdio: 'pipe',
});
let browser;
let server;
let passed = false;
try {
  console.log(run(['run', 'build:lib'], root));
  const [archive] = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--pack-destination', directory], root));
  assert.ok(archive.files.some(file => file.path === 'lib/index.js'));
  assert.ok(archive.files.some(file => file.path === 'lib/styles.css'));
  assert.ok(archive.files.every(file => /^(lib\/|package.json$|README.md$|LICENSE$|THIRD_PARTY_NOTICES.md$)/.test(file.path)));
  const manifest = JSON.parse(await fs.readFile(path.join(root, 'package.json'), 'utf8'));
  await fs.writeFile(path.join(directory, 'package.json'), JSON.stringify({
    private: true, type: 'module',
    dependencies: { 'duoop-ui': `file:./${archive.filename}`, react: manifest.devDependencies.react, 'react-dom': manifest.devDependencies['react-dom'] },
    devDependencies: { vite: manifest.devDependencies.vite },
  }));
  console.log(run(['install', '--no-audit', '--no-fund']));
  const installed = JSON.parse(await fs.readFile(path.join(directory, 'node_modules/duoop-ui/package.json'), 'utf8'));
  assert.ok(installed.peerDependencies.react);
  assert.equal(installed.dependencies.react, undefined);
  const consumerRequire = createRequire(path.join(directory, 'package.json'));
  const libraryRequire = createRequire(path.join(directory, 'node_modules/duoop-ui/package.json'));
  assert.equal(consumerRequire.resolve('react'), libraryRequire.resolve('react'), 'React must be shared');
  const expected = new Set();
  for (const file of new Set([...entries.map(entry => entry.path), 'src/components/IconButton/IconButton.jsx'])) {
    const ast = parse(await fs.readFile(path.join(root, file), 'utf8'), { sourceType: 'module', plugins: ['jsx'] });
    for (const node of ast.program.body) {
      if (node.type !== 'ExportNamedDeclaration') continue;
      if (node.declaration?.id) expected.add(node.declaration.id.name);
      for (const declaration of node.declaration?.declarations ?? []) expected.add(declaration.id.name);
      for (const specifier of node.specifiers) expected.add(specifier.exported.name);
    }
  }
  await fs.writeFile(path.join(directory, 'index.html'), '<div id="root"></div><script type="module" src="/main.jsx"></script>');
  await fs.writeFile(path.join(directory, 'main.jsx'), `
    import React, { useState } from 'react';
    import { createRoot } from 'react-dom/client';
    import * as Duoop from 'duoop-ui';
    import 'duoop-ui/styles.css';
    window.packageExports = Object.keys(Duoop);
    function App() {
      const [count, setCount] = useState(0);
      return <Duoop.Button onClick={() => setCount(value => value + 1)}>Pressed {count} times</Duoop.Button>;
    }
    createRoot(document.getElementById('root')).render(<App />);
  `);
  console.log(run(['exec', '--', 'vite', 'build']));
  server = spawn(process.execPath, [path.join(directory, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '0'], {
    cwd: directory, env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'],
  });
  const url = await new Promise((resolve, reject) => {
    let output = '';
    const timer = setTimeout(() => reject(new Error(`Preview startup timed out: ${output}`)), 15000);
    server.once('error', error => { clearTimeout(timer); reject(error); });
    server.once('exit', code => { clearTimeout(timer); reject(new Error(`Preview exited ${code}: ${output}`)); });
    server.stdout.on('data', chunk => {
      output += chunk;
      const match = output.match(/http:\/\/127\.0\.0\.1:\d+/);
      if (match) { clearTimeout(timer); resolve(match[0]); }
    });
    server.stderr.on('data', chunk => { output += chunk; });
  });
  browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  await page.getByRole('button', { name: 'Pressed 0 times', exact: true }).click();
  await page.getByRole('button', { name: 'Pressed 1 times', exact: true }).press('Space');
  const button = page.getByRole('button', { name: 'Pressed 2 times', exact: true });
  await button.waitFor();
  assert.deepEqual((await page.evaluate(() => window.packageExports)).sort(), [...expected].sort());
  const style = await button.evaluate(node => ({ border: getComputedStyle(node).borderTopWidth, shadow: getComputedStyle(node).boxShadow }));
  assert.equal(style.border, '2px');
  assert.notEqual(style.shadow, 'none');
  assert.deepEqual(errors, []);
  passed = true;
  console.log(`PASS: packed archive installed independently; ${expected.size} exports, shared React, production build, styles, mouse and keyboard verified.`);
} finally {
  await browser?.close();
  if (server && server.exitCode === null) {
    const stopped = new Promise(resolve => server.once('exit', resolve));
    server.kill();
    await stopped;
  }
  if (passed && path.dirname(directory) === parent && path.basename(directory).startsWith('duoop-package-')) {
    await fs.rm(directory, { recursive: true, force: true });
  } else {
    console.log(`Consumer fixture retained for inspection: ${directory}`);
  }
}
