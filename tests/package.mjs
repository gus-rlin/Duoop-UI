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
      return <main style={{padding: 32, maxWidth: 560}}>
        <Duoop.Button onClick={() => setCount(value => value + 1)}>Pressed {count} times</Duoop.Button>
        <label htmlFor="weight">Poids maximal autorisé</label>
        <Duoop.InputGroup>
          <Duoop.InputGroupInput id="weight" aria-invalid="true" />
          <Duoop.InputGroupAddon align="inline-end"><Duoop.InputGroupText>Ko</Duoop.InputGroupText></Duoop.InputGroupAddon>
        </Duoop.InputGroup>
        <Duoop.Checkbox label="Notifications" />
        <Duoop.Switch label="Automatic updates" />
      </main>;
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
  const page = await browser.newPage({ reducedMotion: 'reduce' });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url);
  // Simulate a consuming site's generic focus styles, loaded after the library.
  await page.addStyleTag({ content: 'input:focus-visible { outline: 3px solid #356247; outline-offset: 5px; } .duoop-input-group:where(:focus-within) { outline: 3px solid #356247; outline-offset: 5px; }' });
  await page.getByRole('button', { name: 'Pressed 0 times', exact: true }).click();
  await page.getByRole('button', { name: 'Pressed 1 times', exact: true }).press('Space');
  const button = page.getByRole('button', { name: 'Pressed 2 times', exact: true });
  await button.waitFor();
  assert.deepEqual((await page.evaluate(() => window.packageExports)).sort(), [...expected].sort());
  const style = await button.evaluate(node => ({ border: getComputedStyle(node).borderTopWidth, shadow: getComputedStyle(node).boxShadow }));
  assert.equal(style.border, '2px');
  assert.notEqual(style.shadow, 'none');
  await page.keyboard.press('Tab');
  const input = page.getByRole('textbox', { name: 'Poids maximal autorisé' });
  assert.equal(await input.evaluate(node => node === document.activeElement), true);
  await input.fill('2000');
  const groupStyle = await input.evaluate(node => {
    const control = getComputedStyle(node);
    const group = getComputedStyle(node.parentElement);
    return { outline: control.outlineStyle, groupOutline: group.outlineStyle, border: group.borderTopWidth, color: group.borderTopColor, shadow: group.boxShadow };
  });
  assert.equal(groupStyle.outline, 'none');
  assert.equal(groupStyle.groupOutline, 'none');
  assert.equal(groupStyle.border, '2px');
  assert.equal(groupStyle.color, 'rgb(165, 29, 45)');
  assert.equal(groupStyle.shadow, 'rgb(165, 29, 45) 0px 3px 0px 0px');
  await fs.mkdir(path.join(root, 'artifacts/focus'), { recursive: true });
  await page.screenshot({ path: path.join(root, 'artifacts/focus/npm-input-group.png') });
  for (const role of ['checkbox', 'switch']) {
    await page.keyboard.press('Tab');
    const control = page.getByRole(role);
    assert.equal(await control.evaluate(node => node === document.activeElement), true);
    const indicator = await control.evaluate(node => {
      const style = getComputedStyle(node.nextElementSibling);
      return { outline: style.outlineStyle, border: style.borderTopStyle, width: style.borderTopWidth };
    });
    assert.deepEqual(indicator, { outline: 'none', border: 'dashed', width: '2px' });
    await control.press('Space');
    assert.equal(await control.isChecked(), true);
  }
  await button.focus();
  assert.equal(await button.evaluate(node => getComputedStyle(node, '::after').borderTopWidth), '0px');
  assert.equal(await button.evaluate(node => getComputedStyle(node, '::after').height), '2px');
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
