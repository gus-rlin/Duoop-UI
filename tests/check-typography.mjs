import { chromium } from "@playwright/test";
import { entries } from "../src/catalog/catalog.js";
const browser = await chromium.launch();
const page = await browser.newPage();
const issues = [];
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 960 });
  for (const route of [
    "",
    "?page=components",
    "?page=examples",
    "?page=installation",
    "?page=examples&example=landing",
    "?page=examples&example=settings",
    ...entries.map((e) => "?component=" + e.id),
  ]) {
    await page.goto("http://127.0.0.1:5176/" + route);
    await page.locator("h1").first().waitFor();
    await page
      .getByText("Loading your next detail...", { exact: true })
      .waitFor({ state: "hidden" });
    await page.waitForTimeout(350);
    const result = await page.evaluate(() => ({
      overflow: document.documentElement.scrollWidth > innerWidth + 1,
      small: [...document.querySelectorAll("body *")]
        .filter(
          (e) =>
            !e.closest(
              ".catalog-card-preview-link, .gallery-card-preview, .hero-demo-card, .full-page-preview, .page-example-art",
            ) &&
            e.getClientRects().length &&
            [...e.childNodes].some(
              (n) => n.nodeType === 3 && n.textContent.trim(),
            ) &&
            parseFloat(getComputedStyle(e).fontSize) < 14,
        )
        .map((e) => ({
          tag: e.tagName,
          cls: e.className,
          size: getComputedStyle(e).fontSize,
        }))
        .slice(0, 8),
    }));
    if (result.overflow || result.small.length)
      issues.push({ width, route, ...result });
    if (["?page=components", "?page=examples"].includes(route))
      await page.screenshot({
        path: `artifacts/check-${width}-${route.slice(6)}.png`,
      });
  }
}
console.log(JSON.stringify(issues, null, 2));
await browser.close();
if (issues.length) process.exitCode = 1;
