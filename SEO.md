# Duoop UI SEO configuration

## Domain and deployment

The canonical production URL is [https://duoop-ui.com/](https://duoop-ui.com/). Its source of truth is `siteOrigin` in [src/catalog/seo.js](src/catalog/seo.js). Public links, package.json, index.html, the sitemap and the repository's robots.txt and llms.txt use that domain.

The site is hosted on Cloudflare Pages, with GitHub main as the deployment source and `dist/` as the build output. `npm run build` copies `public/robots.txt`, `public/llms.txt`, and `public/sitemap.xml` to the root of dist/. These paths must serve their actual files rather than the HTML fallback. Query-based deep links do not need route rewrites. Serve the site over HTTPS for clipboard access.

The alternate Cloudflare hosting address is not a canonical documentation URL. The published npm 1.0.0 metadata still contains that previous address as of September 8, 2026; package.json is corrected for the next release. Publishing source to main does not update a published npm version.

## Crawl policy and public routes

- The repository's robots.txt allows crawling and points to the XML sitemap. The production CDN also adds Cloudflare managed rules, including restrictions for some AI crawlers; the local file alone does not describe the deployed policy. Search crawlers such as Googlebot and Bingbot are not explicitly disallowed by the observed file.
- Internal search results (`q`) and nonexistent components receive `noindex, follow` in the application. They remain crawlable so engines can read the directive.
- Components, categories, installation, and examples have distinct canonical URLs. Tab and tracking parameters are removed. Search/error views do not announce conflicting canonicals.
- The sitemap contains **58 URLs**: home, catalog, installation, examples index, one outdoor adventure landing-page example, 7 categories, and 46 components. Source-only SettingsPage.jsx has no public example route. Exclude searches, alternate tabs, preview domains and invented modification dates.
- `public/llms.txt` is a current Markdown index of installation guidance, all catalog components and the public example. It is optional agent-facing documentation, not an indexing guarantee. Keep its inventory aligned with [catalog.js](src/catalog/catalog.js).

The site is client-rendered. Page canonicals and search directives require JavaScript; TXT/XML files do not. Local checks cannot establish search-engine indexing.

## Publication checks

1. Run `npm run test:docs`, `npm run build`, then `npx playwright test tests/seo.spec.mjs` (Chromium must be installed).
2. After deployment, request /robots.txt, /llms.txt and /sitemap.xml: require HTTP 200, actual file contents, text/plain for TXT files and an XML MIME type for the sitemap. HTML with HTTP 200 is not a valid sitemap.
3. Inspect the deployed robots.txt and response headers for CDN additions and unintended noindex or crawler challenges. Preview deployment policy is configured separately from production.
4. Use Google Search Console and Bing Webmaster Tools to inspect rendered component/category/search pages and submit the sitemap. This repository's tests do not establish the status of those external inspections.
5. When routes change, update the sitemap and llms.txt. When the domain changes, update siteOrigin, package.json, index.html, public files and documentation together, and configure migration redirects on the host.

## Production check — September 8, 2026

The home page, robots.txt, llms.txt and sitemap.xml all returned HTTP 200. Both TXT responses used `text/plain; charset=utf-8`; the sitemap used `application/xml`. Production robots.txt contained the repository's sitemap directive plus a Cloudflare managed block with search allowed and explicit restrictions for several AI bots. This supersedes the older report of HTML fallback responses at those file URLs.

See [VALIDATION.md](VALIDATION.md) for local test results and broader-suite limitations. A successful HTTP check confirms file delivery, not search-engine indexing or a completed deployment of future commits.

## References

- [Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Google robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Bing robots.txt guidance](https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec)
- [llms.txt proposal](https://llmstxt.org/)
- [Cloudflare preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
