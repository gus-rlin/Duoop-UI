import fs from 'node:fs/promises';
import { execFile } from 'node:child_process';

const files = (await fs.readdir('tests')).filter(name => name.endsWith('.browser.mjs'));
const previous = process.argv.includes('--failed') ? JSON.parse(await fs.readFile('artifacts/primitive-regressions.json', 'utf8')) : [];
const results = previous.filter(item => item.result === 'passed');
const queue = files.filter(file => !results.some(item => item.file === file));
async function worker() {
  while (queue.length) {
    const file = queue.shift();
    const result = await new Promise(resolve => {
      execFile(process.execPath, [`tests/${file}`], { env: { ...process.env, TEST_URL: process.env.TEST_URL || 'http://127.0.0.1:5176' }, windowsHide: true, timeout: 180000, maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => resolve({ file, result: error ? 'failed' : 'passed', output: (stdout + stderr).trim() }));
    });
    results.push(result);
    console.log(`${result.result.toUpperCase()}: ${file}${result.result === 'failed' ? '\n' + result.output.slice(-3500) : ''}`);
  }
}
await Promise.all([worker(), worker()]);
await fs.mkdir('artifacts', { recursive: true });
await fs.writeFile('artifacts/primitive-regressions.json', JSON.stringify(results, null, 2));
console.log(`${results.filter(item => item.result === 'passed').length}/${files.length} primitive suites passed.`);
if (results.some(item => item.result === 'failed')) process.exitCode = 1;
