# Validation status

This document records verification scope, not a blanket certification. The current catalog contains **46 components across 7 categories** and one public page example. The package is published as `duoop-ui`. See the [README](README.md) for installation and [SEO.md](SEO.md) for deployment checks.

## Component documentation refresh — September 8, 2026

Compared the current catalog, public exports, Chart implementation and playground, rendered installation guide, component categories, source-copy instructions and public indexes. The catalog remains at 46 entries in 7 categories, with 58 sitemap URLs.

- Moved Folder, Achievement and Chart into Cards, Feedback and Display in `public/llms.txt`; aligned the sitemap with catalog order and corrected Achievement's showcase category.
- Added [Chart integration and playground documentation](docs/chart.md), including numeric data, missing values, series colors, Our data, draft retention, Reset and the distinction between demo controls and the component API. Updated the rendered Chart Usage & API notes.
- Clarified that current source/downloads can be newer than an installed npm version. The registry check still returned version 1.0.0 with the previous homepage. No npm release was published during this refresh.
- Documentation checks now cover new untracked guide files, category placement in the AI index, both README count formats, the essential guide's catalog total and sitemap order.

| Check | Result for this refresh |
| --- | --- |
| `npm run test:docs` | Passed: 12 Markdown/TXT files, three rendered/download guides, category placement, counts, links and sitemap order. |
| `npm run build -- --logLevel warn` | Passed. |
| `node tests/check-imports.mjs` | Passed: 255 source files. |
| `node tests/chart.browser.mjs` | Passed: chart interactions, data editor, reset, bar spacing, accessibility, mobile and reduced motion. |
| `npx playwright test tests/seo.spec.mjs` | All five tests passed. |

These results are separate from the earlier audits below. Package installation, full downloads, the full `npm test` suite and production deployment were not rerun.

## Achievement restoration — September 8, 2026

Restored the Achievement section from `c32dfaa`, including the original medallion and playground. Site and library builds, import checks, documentation checks, all five SEO tests, and `node tests/achievement.browser.mjs` pass. The targeted browser test covers progress, unlock/reset, light/dark, WCAG A/AA automated checks, 768/390/320 px overflow, reduced motion, and compilation of the downloaded starter. Desktop and mobile screenshots were inspected. The broader public-catalog suite was interrupted after its discovery/search/copy test exceeded 90 seconds; it is not reported as passing.

## Documentation audit — September 8, 2026

The audit compared documentation and generated download instructions with catalog metadata, public page registration, package exports, npm scripts, the CI workflow and live HTTP responses. Node.js 24.18.0 was used locally.

- Catalog metadata: 46 entries and 7 categories. Compound exports such as IconButton, RangeSlider and DataTable do not add catalog entries.
- Public pages: one outdoor adventure landing page. SettingsPage.jsx remains source-only.
- Registry: `npm view duoop-ui version homepage` confirmed version 1.0.0. The published homepage still uses the previous hosting address; the corrected production homepage is already in package.json. A Git push does not update a published package's metadata or README.
- Production: the home page, robots.txt, llms.txt and sitemap.xml returned HTTP 200. TXT files had text/plain content types; the sitemap had application/xml. Cloudflare adds managed bot rules to the deployed robots.txt; see [SEO.md](SEO.md).

Local results from this audit:

| Check | Result |
| --- | --- |
| `npm run test:docs` | Passed: tracked Markdown/TXT files and three rendered/download guides; catalog inventory, links, scripts and 58 sitemap URLs agree. |
| `npm run build -- --logLevel warn` | Passed: production catalog build. |
| `node tests/check-imports.mjs` | Passed: 254 source files with resolvable imports and exact path casing. |
| `npm run test:package` | Passed: isolated archive installation, 145 exports, shared React, production build, stylesheet, mouse and keyboard interaction. |
| `npm run test:integration` | Passed: README source-copy example in a fresh Vite app, build, click, Space activation, tactile styles and mobile width. |
| `npm run test:essentials` | Passed: interactions, all eleven galleries at 1440/768/390/320 px, axe, reduced motion and alert dismissal. The Vite server logged ResizeObserver notifications during the run; browser assertions and the final console check passed. |
| `npx playwright test tests/seo.spec.mjs` | All four tests passed: public TXT/XML delivery, sitemap coverage, index links, canonicals and search/error directives. |

The full `npm test`, all-download, primitive and legacy page suites were not rerun in this documentation audit. Older delivery reports are available in [Git history](https://github.com/gus-rlin/Duoop-UI/commits/main/VALIDATION.md); their totals and passing results must not be reused as current validation.

## HTML retrieval follow-up — September 8, 2026

The external web reader reproduced the stale GitHub homepage snapshot while direct HTTP and the direct README URL returned current content. Before this follow-up, the site's initial HTML contained no component inventory and directed readers without JavaScript to GitHub. Vite now generates the inventory and npm instructions into the HTML from catalog metadata. Documentation checks, the production build, import checks and all five SEO tests passed in an isolated checkout. The added browser test disables JavaScript, verifies every component link and installation facts, then verifies that React replaces the summary with the interactive catalog. This is a delivery correction, not a guarantee that external readers have refreshed their stored copies.

## Duoop UI MCP — September 8, 2026

The standalone MCP snapshot contains all 46 catalog components and 553 gallery variants, collected through the website's source-bundle functions. Its archive is about 316 kB before installing runtime dependencies.

- `npm run test:mcp`: five tests passed, including snapshot freshness, every source bundle's local import graph, JSX parsing, search and pagination, variant selection, path validation and a real stdio MCP client handshake.
- The packaged archive was installed in an isolated consumer. The stdio client test also passed against that installed copy from a different working directory.
- The production site build and documentation checks passed. The new badge uses the original Codex icon from the official OpenAI extension and links to the rendered MCP setup guide.
- Browser checks at 1440, 390 and 320 px passed for the badge, icon loading, keyboard activation, guide arrival and horizontal overflow; screenshots were inspected.
- The broader public browser run was stopped after the existing discovery test timed out waiting for the removed “A little more focus” switch. It is not reported as passing.

The [MCP guide](docs/mcp.md) documents installation and release steps. The package has been built locally; this work does not publish it on npm or deploy the website.

## Reproduce the maintained checks

Use the Node.js range in package.json (22.18+ in the 22.x line, or 24.11+) and install Chromium:

```sh
npm ci
npm ci --prefix mcp
npm run test:mcp
npx playwright install chromium
npm run test:docs
npm run build
node tests/check-imports.mjs
npm run test:package
npm run test:essentials
npx playwright test tests/seo.spec.mjs
```

These are the checks run by [GitHub CI](.github/workflows/ci.yml). Package checks create an isolated consumer app, install a locally packed archive, verify public exports and shared React, then check production build, styles and interaction. They require npm access and test the local archive, not every historical registry release.

For additional focused coverage:

- `npm run test:integration`: create an independent Vite app from the [optional source-copy guide](docs/source-installation.md); build and check pointer/keyboard interaction, styling and mobile width. Requires npm access.
- `npm run test:essential-downloads`: download and build essential starters and variants using its own server.
- `npm run test:navigation`: check Breadcrumb and Separator with its own server.
- `npm run test:primitives` and `npm run test:a11y`: first start `npm run dev -- --port 5176 --strictPort` in another terminal. Some individual diagnostic scripts use fixed local addresses; inspect them before overriding TEST_URL.

Reports, downloaded archives and screenshots are written under ignored `artifacts/`. Use results from the current execution, since previous artifacts can remain there.

## Known broader-suite gaps

- `npm test` runs the maintained checks relevant to the catalog plus the broader public browser and download-build suite. It stops on failure and does not include the package test. The public suite still contains expectations for removed home-page controls and the former studio/settings pages in `tests/public-catalog.spec.mjs`; its last recorded discovery failure expected the absent “A little more focus” switch. Do not describe the full suite as passing based on CI's narrower scope.
- `npm run test:pages` still consumes both landing.zip and settings.zip and uses old studio selectors in `tests/standalone-pages.mjs`. It is a legacy regression script, not a current public-page validation command. It cannot be reproduced from today's single public page download without updating the script.
- `tests/build-downloads.mjs` builds archives already in `artifacts/downloads/`; stale downloads can affect its totals. No current aggregate variant or full-download success count is claimed.

## Installation-guide clarification — September 8, 2026

The README now presents the published npm package as the primary installation path. The source-copy tutorial is in [docs/source-installation.md](docs/source-installation.md); packing and release instructions are in CONTRIBUTING.md. The fresh-app integration script reads the relocated tutorial. Documentation checks and that integration test passed after the move. The external web reader may still return the older repository-homepage snapshot; this edit does not purge its copy.

## Integration limits

The supported distribution paths are the npm ESM library, copied JSX/CSS source and runnable Vite downloads. Dedicated TypeScript declarations are not supplied. Next.js notes are integration guidance; Next.js, server rendering, every browser and every screen reader have not been separately validated.

Examples require application services for production requests, authentication, persistence and uploads. Remote images and map tiles retain their own terms and availability. Axe and keyboard checks cover the tested scenarios and are not an exhaustive accessibility certification.
