import { chromium, expect } from '@playwright/test';
import { unzipSync, strFromU8 } from 'fflate';
import { build } from 'vite';
import fs from 'node:fs/promises';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
const browser = await chromium.launch();
try {
 const context = await browser.newContext({viewport:{width:1440,height:1100}});
 const page = await context.newPage();
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:5174'}/?component=builtin-achievement`);
 const lab=page.getByLabel('Achievement playground');
 const card=lab.locator('.duoop-achievement');
 await expect(card).toHaveAttribute('data-state','progress');
 await expect(card).toContainText('2 / 3');
 await expect(card).toContainText('100 points');
 await lab.screenshot({path:'artifacts/achievement-restored-desktop.png'});
 await lab.getByRole('button',{name:'Share the last note'}).click();
 await expect(card).toHaveAttribute('data-state','unlocked');
 await expect(card).toContainText('3 / 3');
 await lab.getByRole('button',{name:'Reset',exact:true}).click();
 await expect(card).toHaveAttribute('data-state','progress');
 await lab.getByRole('switch',{name:'Dark surface'}).check();
 await expect(lab.locator('.feedback-lab-stage')).toHaveAttribute('data-theme','dark');
 await lab.getByRole('switch',{name:'Dark surface'}).uncheck();
 const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).include('[aria-label="Achievement playground"]').analyze();
 expect(audit.violations).toEqual([]);
 for(const width of [768,390,320]) {
  await page.setViewportSize({width,height:1000});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  if(width===390) await lab.screenshot({path:'artifacts/achievement-restored-mobile.png'});
 }
 await page.emulateMedia({reducedMotion:'reduce'});
 await lab.getByRole('button',{name:'Share the last note'}).click();
 await expect(card).toHaveAttribute('data-state','unlocked');
 await page.goto((process.env.TEST_URL || 'http://127.0.0.1:5174')+'/?component=builtin-achievement&tab=code');
 const pending=page.waitForEvent('download');
 await page.getByRole('button',{name:'Download project'}).click();
 const download=await pending;
 const archive=await fs.readFile(await download.path());
 const root=await fs.mkdtemp(path.resolve('artifacts/achievement-download-'));
 for(const [name,bytes] of Object.entries(unzipSync(archive))) {
  const target=path.resolve(root,name);
  if(!target.startsWith(root+path.sep)) throw Error('Invalid archive path');
  await fs.mkdir(path.dirname(target),{recursive:true});
  await fs.writeFile(target,strFromU8(bytes));
 }
 await build({configFile:false,root,logLevel:'silent',build:{write:false}});
 expect(errors).toEqual([]);
 console.log('PASS Achievement restoration: progress, unlock, reset, theme, axe, responsive and reduced motion.');
} finally {await browser.close();}


