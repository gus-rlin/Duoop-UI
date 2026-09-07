export async function openCatalog(page, url) {
  const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
  if (new URL(url).searchParams.has('component')) {
    await page.locator('.button-showcase').waitFor();
  } else {
    await page.locator('.catalog-card').first().waitFor();
  }
  return response;
}
