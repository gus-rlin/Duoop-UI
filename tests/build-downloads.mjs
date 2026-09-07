import fs from 'node:fs/promises';
import path from 'node:path';
import { unzipSync, strFromU8 } from 'fflate';
import { build } from 'vite';
import { parse } from '@babel/parser';

const files = (await fs.readdir('artifacts/downloads')).filter(name => name.endsWith('.zip'));
const results = [];
await fs.mkdir('artifacts/download-builds', { recursive: true });
const runRoot = await fs.mkdtemp(path.resolve('artifacts/download-builds/run-'));
for (const archive of files) {
  const directory = path.join(runRoot,archive.slice(0,-4));
  const content = unzipSync(await fs.readFile(`artifacts/downloads/${archive}`));
  for (const [name, bytes] of Object.entries(content)) {
    const target = path.resolve(directory,name);
    if (!target.startsWith(directory + path.sep)) throw new Error('Unexpected archive path');
    await fs.mkdir(path.dirname(target),{recursive:true}); await fs.writeFile(target,strFromU8(bytes));
  }
  try {
    const declared = JSON.parse(strFromU8(content['package.json'])).dependencies;
    for (const [file, bytes] of Object.entries(content)) {
      if (!/\.(jsx|js)$/.test(file)) continue;
      const imports = parse(strFromU8(bytes), { sourceType:'module', plugins:['jsx'] }).program.body.filter(node => ['ImportDeclaration','ExportNamedDeclaration','ExportAllDeclaration'].includes(node.type) && node.source).map(node => node.source.value);
      for (const specifier of imports) {
        if (specifier.startsWith('.')) {
          const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), specifier));
          if (![target, target+'.jsx', target+'.js', target+'.css', target+'.json'].some(candidate => Object.hasOwn(content,candidate))) throw Error(`${file} imports missing archive file ${specifier}`);
        } else {
          const dependency = specifier.startsWith('@') ? specifier.split('/').slice(0,2).join('/') : specifier.split('/')[0];
          if (!declared[dependency]) throw Error(`${file} imports undeclared dependency ${dependency}`);
        }
      }
    }
    await build({configFile:false,root:directory,logLevel:'silent',build:{write:false}});
    results.push({archive,result:'passed'});
  } catch(error) { results.push({archive,result:'failed',error:error.message}); }
  if (results.length % 50 === 0) console.log(`Built ${results.length}/${files.length} downloaded projects.`);
}
await fs.writeFile('artifacts/download-builds.json',JSON.stringify(results,null,2));
console.log(JSON.stringify({total:results.length,passed:results.filter(item=>item.result==='passed').length,failures:results.filter(item=>item.result!=='passed')},null,2));
if (results.some(item=>item.result==='failed')) process.exitCode=1;
