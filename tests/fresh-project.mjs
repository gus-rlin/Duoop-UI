import fs from 'node:fs/promises';
import path from 'node:path';
import { execFileSync, spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';

// Follow README.md literally, outside the repository and its node_modules tree.
const readme = await fs.readFile('README.md', 'utf8');
const main = readme.match(/Remplacez `src\/main.jsx` par :\s*```jsx\n([\s\S]+?)```/)[1];
const app = readme.match(/Remplacez `src\/App.jsx` par :\s*```jsx\n([\s\S]+?)```/)[1];
const files = [...readme.matchAll(/\| \[(src\/(?:base\.css|components\/Button\/[^\]]+))\]/g)].map(match => match[1]);
assert.equal(files.length, 4);
// Windows Application Control blocks native Vite bindings in this host's Temp folder.
// A sibling project is still outside both the catalog and its dependency tree.
const directory = await fs.mkdtemp(path.join(path.resolve('..'), 'duoop-integration-'));
const npm = process.platform === 'win32' ? path.join(path.dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js') : process.env.npm_execpath;
const environment = { ...process.env, NODE_USE_SYSTEM_CA: '1' };
const run = args => execFileSync(process.execPath, [npm, ...args], { cwd:directory, env:environment, windowsHide:true, timeout:120000, stdio:'pipe' }).toString();
console.log(run(['create','vite@latest','.', '--','--template','react','--no-interactive']));
console.log(run(['install']));
assert.ok((await fs.stat(path.join(directory, 'node_modules/react/package.json'))).isFile());
assert.ok((await fs.stat(path.join(directory, 'node_modules/vite/package.json'))).isFile());
for (const file of files) { await fs.mkdir(path.dirname(path.join(directory,file)), { recursive:true }); await fs.copyFile(file,path.join(directory,file)); }
await fs.writeFile(path.join(directory,'src/main.jsx'), main);
await fs.writeFile(path.join(directory,'src/App.jsx'), app);
console.log(run(['run','build']));
const server = spawn(process.execPath,[path.join(directory,'node_modules/vite/bin/vite.js'),'preview','--host','127.0.0.1','--port','4187','--strictPort'],{cwd:directory, env:environment, windowsHide:true, stdio:'pipe'});
let output = '';
server.stdout.on('data', chunk => { output += chunk; });
server.stderr.on('data', chunk => { output += chunk; });
let browser;
try {
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(output);
    try { if ((await fetch('http://127.0.0.1:4187')).ok) break; } catch { /* Wait for this new server. */ }
    await new Promise(resolve => setTimeout(resolve,100));
  }
  browser = await chromium.launch({ headless:true });
  const page = await browser.newPage({ viewport:{width:390,height:800} });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('http://127.0.0.1:4187');
  const button = page.getByRole('button',{name:'Pressed 0 times'});
  await button.click();
  assert.equal(await page.getByRole('button',{name:'Pressed 1 times'}).count(),1);
  await page.getByRole('button',{name:'Pressed 1 times'}).press('Space');
  assert.equal(await page.getByRole('button',{name:'Pressed 2 times'}).count(),1);
  const style = await page.getByRole('button',{name:'Pressed 2 times'}).evaluate(node => ({border:getComputedStyle(node).borderTopWidth,shadow:getComputedStyle(node).boxShadow}));
  assert.equal(style.border,'2px');
  assert.notEqual(style.shadow,'none');
  assert.deepEqual(errors,[]);
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
  await fs.mkdir('artifacts',{recursive:true});
  await page.screenshot({path:'artifacts/fresh-integration.png'});
  await fs.writeFile('artifacts/fresh-integration.json',JSON.stringify({directory,source:'README.md',files,node:process.version,build:'passed',mouse:'passed',keyboard:'passed',styles:style,consoleErrors:errors},null,2));
  console.log(`Fresh README integration passed: ${directory}`);
} finally { await browser?.close(); server.kill(); }
