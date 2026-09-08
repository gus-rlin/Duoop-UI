# Historical library validation — September 7, 2026

The current catalogue, as of September 8, 2026, contains **46 components in seven categories**. See the [current README](README.md) and [catalogue summary](https://duoop-ui.pages.dev/llms.txt). The component and variant totals below describe an older test snapshot, not the current collection. A current total variant count is not published.

Historical checks performed on **September 7, 2026**, with Node.js 24.18.0, React 19, Vite 8.2.2, and Chromium through Playwright 1.63. These results describe that delivery snapshot, not a guarantee that every subsequent revision passes the same checks.

## Recorded results

The checked catalog contained 34 components, 504 variant sources, and two full compositions. No build or runtime blocker was identified within that snapshot's tested scope.

| Check | Recorded result |
| --- | --- |
| Catalog build and imports | Passed; 198 files checked, including Linux path casing. |
| Public journeys | 7 scenarios passed: discovery, search, history, source, real clipboard copying, installation, downloads, pages, and keyboard use. |
| Downloaded projects | **540/540 built**: 34 initial examples, 504 variants, and 2 pages. Each archive was extracted into a fresh directory; local imports and declared dependencies were checked before building. |
| Primitive regressions | **25/25 suites passed**, covering forms, selection, overlays, animations, carousels, maps, avatars, notifications, and asynchronous states. |
| Gallery accessibility | No axe WCAG A/AA violations detected across 34 galleries at 1440 and 390 px; no document overflow at 390 and 320 px. |
| Site responsiveness | Six journeys checked at 1440, 1024, 768, 390, and 320 px; axe checks at 1440 and 390 px. |
| Standalone pages | Builds, interactions, and axe checks passed at 1440, 768, 390, and 320 px using downloaded files. |
| Fresh integration | Independent React/Vite app with its own dependencies followed the README: build, click, Space activation, tactile depth, and mobile rendering passed. |
| Production dependencies | `npm audit --omit=dev` reported no vulnerabilities at the time. |

Visual review covered the home page, source view, installation, compositions, and mobile layouts. Mobile navigation trapped focus and closed with Escape; tabs supported arrow keys. Checks also covered retaining edits between preview and code, validation in hidden tabs, cancellation, and settings persistence.

## Fixes from that validation

- Removed 320 px overflow and improved secondary text contrast.
- Isolated Tabs styles so nested tabs do not affect each other.
- Improved Select accessible names and active-option tracking, named badge semantics, and the Textarea resize target.
- Resolved multiline imports and shared files in downloads; fixed Avatar import casing for Linux.
- Removed duplicate code-dialog previews; included formatted implementations, explicit files, dependencies, and the license.
- Excluded test artifacts from Vite watching and dependency discovery to avoid reloads during verification.

## Reproduce the checks

```sh
npm ci
npx playwright install chromium
npm test
npm run test:pages
npm run test:integration
```

For primitive and gallery checks, start `npm run dev -- --port 5176 --strictPort` in another terminal, then run:

```sh
npm run test:primitives
npm run test:a11y
```

Generated evidence is stored in ignored `artifacts/`: `public-test-results.json`, `gallery-coverage.json`, `download-builds.json`, `primitive-regressions.json`, `accessibility.json`, `gallery-accessibility.json`, `standalone-pages.json`, `fresh-integration.json`, and screenshots.

## Subsequent findings and CI scope

On September 8, the SEO build and four SEO tests passed. An additional public test, `discover, search, deep-link, use history and copy real source`, failed because it expected the `A little more focus` switch on a home page that no longer displayed it. See [SEO.md](SEO.md). The full functional suite has therefore not been revalidated by those checks.

The GitHub CI workflow now runs the production build, import checks, essential-component browser checks, and the four SEO browser tests. Its badge reflects that scope; it does not certify the full download, primitive, or accessibility suites.

## Deployment and limitations

At the September 7 validation, hosting was not configured. The production domain is now [duoop-ui.pages.dev](https://duoop-ui.pages.dev/); see [SEO.md](SEO.md) for the subsequent deployment record. Serve `dist/` over HTTPS for clipboard access. Query-based deep links do not require route rewrites.

The verified distribution is JSX/CSS source copied into React 19 with Vite. No Duoop npm package, complete TypeScript declarations, or server-rendering validation is claimed. Next.js notes describe adaptations, not a completed framework integration test.

Studio creation, settings, rewards, and example requests are local demonstrations that require application services in production. Remote images and map tiles retain their own terms and availability limits. Image-recovery tests use controlled responses to isolate component behavior from the CDN.

Axe and keyboard checks are not an exhaustive certification across all screen readers and browsers.
