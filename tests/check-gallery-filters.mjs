import { chromium, expect } from "@playwright/test";
import { entries } from "../src/catalog/catalog.js";
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  page.setDefaultTimeout(10000);
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 960 });
    for (const entry of entries) {
      console.log(width, entry.id);
      await page.goto(`http://127.0.0.1:5176/?component=${entry.id}`, {
        waitUntil: "domcontentloaded",
      });
      await page.locator(".gallery-filters").first().waitFor();
      await expect(
        page.locator(".gallery-filters button:not(.duoop-button)"),
      ).toHaveCount(0);
      const filters = page.locator(".gallery-filters").first();
      const choices = filters.getByRole("button");
      const allCount = await page.locator(".gallery-card").count();
      await choices.nth(1).click();
      await expect(choices.nth(1)).toHaveAttribute("aria-pressed", "true");
      expect(await page.locator(".gallery-card").count()).toBeGreaterThan(0);
      await choices.first().click();
      await expect(page.locator(".gallery-card")).toHaveCount(allCount);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      if (entry.id === "builtin-field") {
        await filters.scrollIntoViewIfNeeded();
        await page.screenshot({ path: `artifacts/field-filters-${width}.png` });
      }
    }
    console.log(`${width}px: all 33 component filters use Button and work`);
  }
} finally {
  await browser.close();
}
