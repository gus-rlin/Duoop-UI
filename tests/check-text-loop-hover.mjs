import { chromium, expect } from '@playwright/test';
const browser = await chromium.launch();
try {
 const page = await browser.newPage({reducedMotion:'no-preference'});
 for (const width of [1440,390]) {
  await page.setViewportSize({width,height:960});
  await page.goto(`${process.env.TEST_URL || 'http://127.0.0.1:5176'}/?page=examples&example=landing`,{waitUntil:'domcontentloaded'});
  const loop=page.locator('.forma-loop'); await loop.waitFor();
  await loop.evaluate(e=>e.scrollIntoView({block:'center'}));
  await page.evaluate(()=>document.fonts.ready); await page.waitForTimeout(400);
  const bounds=await loop.boundingBox();
  const offset=()=>loop.locator('.text-loop-glyph').first().getAttribute('transform');
  async function moving(expected){const before=await offset();await page.waitForTimeout(180);const after=await offset();expect(after===before).toBe(!expected);}
  await page.mouse.move(bounds.x+10,bounds.y+10);await moving(true);
  await page.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await page.waitForTimeout(50);await moving(false);
  await page.mouse.move(bounds.x+bounds.width-10,bounds.y+bounds.height-10);await moving(true);
  await page.mouse.move(bounds.x+5,bounds.y+bounds.height/2);await page.waitForTimeout(50);await moving(false);
  await page.mouse.move(bounds.x+bounds.width/2,bounds.y+10);await moving(true);
  await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(50);await moving(false);
  await page.emulateMedia({reducedMotion:'no-preference'});
  console.log(width,'blank areas continue; ribbon pauses; exit resumes; reduced motion preserved');
 }
} finally {await browser.close();}
