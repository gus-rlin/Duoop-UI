import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createServer } from "vite";
import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
const server = await createServer({
  server: { host: "127.0.0.1", port: 0 },
  logLevel: "error",
});
await server.listen();
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await fs.mkdir("artifacts/navigation", { recursive: true });
try {
  for (const width of [1440, 820, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const id of ["breadcrumb", "separator"]) {
      await page.goto(
        `${server.resolvedUrls.local[0]}?component=builtin-${id}`,
      );
      await expect(page.locator(`.${id}-showcase`)).toBeVisible();
      await expect(page.locator(".gallery-card")).toHaveCount(3);
      if (width >= 820) {
        const card = await page.locator(".gallery-card").first().boundingBox();
        const grid = await page.locator(".gallery-grid").first().boundingBox();
        assert.ok(
          Math.abs(card.width - grid.width) < 2,
          "Wide examples fill their grid",
        );
      }
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
      const audit = await new AxeBuilder({ page })
        .include(`.${id}-showcase .gallery-card-preview`)
        .analyze();
      assert.deepEqual(
        audit.violations.map((v) => [v.id, v.nodes.map((n) => n.target)]),
        [],
      );
      if (id === "breadcrumb") {
        const nav = page
          .getByRole("navigation", { name: "Collection breadcrumb" })
          .first();
        await expect(nav.locator('[aria-current="page"]')).toHaveText("Shoes");
        const home = nav.getByRole("link", { name: "Home", exact: true });
        await home.focus();
        await expect(home).toBeFocused();
        assert.equal(
          await home.evaluate((e) => getComputedStyle(e).textDecorationLine),
          "underline",
        );
        await page.keyboard.press("Tab");
        await expect(nav.getByRole("link", { name: "Products" })).toBeFocused();
        await page.keyboard.press("Tab");
        await expect(nav.locator('[aria-current="page"]')).not.toBeFocused();
        const rtl = page.locator('.duoop-breadcrumb[dir="rtl"]');
        await expect(rtl).toHaveAttribute("lang", "ar");
        const first = await rtl.getByRole("link").first().boundingBox();
        const last = await rtl.locator('[aria-current="page"]').boundingBox();
        assert.ok(
          first.y < last.y || first.x > last.x,
          "RTL path reads right to left, then wraps downward",
        );
        await home.hover();
        await page.waitForTimeout(220);
        assert.notEqual(
          await home.evaluate((e) => getComputedStyle(e).boxShadow),
          "none",
        );
        await page.mouse.down();
        await page.waitForTimeout(220);
        assert.equal(
          await home.evaluate((e) => getComputedStyle(e).boxShadow),
          "none",
        );
        await page.mouse.move(0, 0);
        await page.mouse.up();
        await page.waitForTimeout(240);
      } else {
        await expect(
          page.locator('.separator-showcase [role="separator"]'),
        ).toHaveCount(2);
        const vertical = page.locator(
          '.duoop-separator[data-orientation="vertical"]',
        );
        const box = await vertical.boundingBox();
        assert.ok(box.width === 1 && box.height >= 24);
        await expect(vertical).toHaveAttribute("aria-orientation", "vertical");
        await expect(
          page.locator(
            '.separator-showcase .duoop-separator[aria-hidden="true"]',
          ),
        ).toHaveCount(1);
      }
      await page
        .locator(".gallery-card")
        .first()
        .screenshot({ path: `artifacts/navigation/${id}-${width}.png` });
    }
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(
    `${server.resolvedUrls.local[0]}?component=builtin-breadcrumb`,
  );
  const link = page.locator(".duoop-breadcrumb__link").first();
  await expect(link).toBeVisible();
  assert.equal(
    await link.evaluate((e) => getComputedStyle(e).transitionDuration),
    "0s",
  );
  await link.click();
  await expect(page).toHaveURL(/page=home/);
  await page.goto(
    `${server.resolvedUrls.local[0]}tests/fixtures/navigation.html`,
  );
  await page.setViewportSize({ width: 640, height: 1000 });
  const path = page.getByRole("navigation", { name: "Long path" });
  await expect(path).toBeVisible();
  for (const zoom of [1, 2]) {
    await page.evaluate((value) => {
      document.body.style.zoom = value;
    }, zoom);
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
      `No overflow at ${zoom * 100}% zoom`,
    );
    for (const item of await path.locator("a, [aria-current]").all()) {
      assert.ok(
        await item.evaluate((e) => e.scrollWidth <= e.clientWidth + 1),
        "Unbroken labels fit",
      );
    }
  }
  await page.evaluate(() => {
    document.body.style.zoom = 1;
  });
  await path.getByRole("link").first().focus();
  await page.keyboard.press("Tab");
  await expect(path.getByRole("link").last()).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "After breadcrumb" }),
  ).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Single page" }).getByRole("link"),
  ).toHaveCount(0);
  await expect(page.getByTestId("fallback")).toHaveAttribute(
    "aria-orientation",
    "horizontal",
  );
  await expect(page.getByTestId("decorative")).not.toHaveAttribute(
    "aria-orientation",
  );
  const fixtureAudit = await new AxeBuilder({ page }).analyze();
  assert.deepEqual(
    fixtureAudit.violations.map((v) => v.id),
    [],
  );
  await page.emulateMedia({ forcedColors: "active" });
  const ruleColor = await page
    .locator("#rules .duoop-separator")
    .evaluate((e) => getComputedStyle(e).backgroundColor);
  const surfaceColor = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  assert.notEqual(
    ruleColor,
    surfaceColor,
    "Separator remains visible in forced colors",
  );
  await path.getByRole("link").first().focus();
  assert.equal(
    await path
      .getByRole("link")
      .first()
      .evaluate((e) => getComputedStyle(e).textDecorationLine),
    "underline",
  );
  await page.emulateMedia({ forcedColors: "none" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${server.resolvedUrls.local[0]}?page=components`);
  for (const id of ["breadcrumb", "separator"]) {
    const preview = page.locator(`.catalog-preview--${id}`);
    await preview.scrollIntoViewIfNeeded();
    await expect(preview.locator(`.duoop-${id}`).first()).toBeVisible();
    await preview.screenshot({
      path: `artifacts/navigation/${id}-catalog.png`,
    });
  }
  assert.deepEqual(errors, []);
  console.log(
    "Breadcrumb and Separator: desktop, tablet, mobile, accessibility, focus, hover, press, navigation and reduced motion passed.",
  );
} finally {
  await browser.close();
  await server.close();
}
