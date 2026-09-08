# Duoop UI SEO configuration

## Domain and deployment

Production uses https://duoop-ui.pages.dev/. An HTTP check on September 8, 2026 found the public site there without an `X-Robots-Tag: noindex` header. The deployment-specific `8a3f3afc.duoop-ui.pages.dev` address had that header and remains a non-indexable preview.

`npm run build` copies `public/robots.txt`, `public/llms.txt`, and `public/sitemap.xml` to the root of `dist/`. Deploy the contents of `dist/` to production Cloudflare Pages. These static files must replace the HTML fallback at those URLs; do not rewrite them to `index.html`.

## Crawl policy

- Allow all crawlers, including Googlebot and Bingbot. No private server area, cart, or administration interface was identified in this catalog. CSS, JavaScript, images, categories, and navigation parameters remain accessible.
- Internal search results (`q`) and nonexistent components receive `noindex, follow` in the application. Keep them crawlable so engines can read the directive.
- Components, categories, installation, and examples have distinct canonical URLs. Remove tab and tracking parameters from canonicals. Search/error views must not announce conflicting canonicals.
- The sitemap contains 58 URLs: home, catalog, installation, examples index, landing-page example, 7 categories, and 46 components. Exclude searches, alternate tabs, invented modification dates, and preview domains.
- `llms.txt` is an optional Markdown index for AI agents, not a Google ranking factor or indexing guarantee.
- No `llms-full.txt` is needed for the current scope. A second `sitemap.txt` would duplicate the XML sitemap.
- Do not add `ads.txt`/`app-ads.txt` without relevant advertising activity, `security.txt` without a defined reporting process and contact, or IndexNow without an actual key integration.

## Publication checks

1. Run `npm run build`, then `npx playwright test tests/seo.spec.mjs`.
2. After deployment, check the three public URLs: HTTP 200, actual file contents, `text/plain` for TXT files, and an XML MIME type for the sitemap. HTML with HTTP 200 is not a valid sitemap.
3. Check that production pages have no HTTP `noindex` and that intended crawlers are not blocked by a CDN challenge. Preserve `noindex` on Cloudflare previews.
4. Inspect a component, category, and search in Google Search Console and Bing Webmaster Tools. Check rendered content, accessible resources, canonical URLs, and `noindex`, then submit the XML sitemap.
5. Update the sitemap and `llms.txt` when the catalog changes. For a new domain, also update `siteOrigin` in `src/catalog/seo.js` and plan migration redirects.

The site is client-rendered. Page canonicals and directives require JavaScript; TXT/XML files do not. Server rendering or prerendering of important pages would be separate work. Local checks cannot establish search-engine indexing.

## Historical results: September 8, 2026

- `npm run build -- --logLevel warn` passed.
- All four `tests/seo.spec.mjs` tests passed: XML parsing, 46-URL coverage, MIME types, `llms.txt` links, canonicals, and navigation into/out of search.
- An additional general test, `discover, search, deep-link, use history and copy real source`, failed at line 44: it expected the `A little more focus` switch, absent from the current home page. This did not validate the entire functional suite.
- The delivery archive was `artifacts/duoop-ui-seo-production.zip`, containing the full build, public files, and metadata changes.
- The owner reported deploying the archive. The subsequent HTTP check still returned site HTML for `/robots.txt`, `/llms.txt`, and `/sitemap.xml` (HTTP 200, `text/html`). At that check, production file delivery and search-engine inspections remained unconfirmed. This is a historical observation, not a fresh deployment check.

## References

- [Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309.html)
- [Google robots.txt specification](https://developers.google.com/crawling/docs/robots-txt/robots-txt-spec)
- [Google JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google AI features](https://developers.google.com/search/docs/appearance/ai-features)
- [Bing robots.txt guidance](https://www.bing.com/webmasters/help/how-to-create-a-robots-txt-file-cb7c31ec)
- [llms.txt proposal](https://llmstxt.org/)
- [Cloudflare preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/)
