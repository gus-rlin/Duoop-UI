# Contributing to Duoop UI

Thanks for helping improve the collection. Use English for documentation, new code comments, issues, and pull requests.

## Get started

1. Fork the repository and create a focused branch.
2. Use Node.js 22.18+ in the 22.x line, or 24.11+.
3. Run `npm ci`, then `npm run dev`.
4. Read the [design guidelines](design.md) before changing a component.

For larger features, open an issue describing the problem and proposed behavior first. Small fixes can go straight to a pull request.

## Make a focused change

Preserve the tactile style, keyboard behavior, visible focus, and reduced-motion support. Reuse existing primitives and helpers. Avoid unrelated formatting or dependencies without a concrete need.

A new component needs an implementation, CSS, gallery, public entry in `src/catalog/catalog.js`, minimal recipe in `src/catalog/recipes.js`, and matching preview. Verify that copied and downloaded sources include every local import and required dependency. Update the sitemap and `public/llms.txt` when public routes change.

Export new public components from `src/index.js` as well. Run `npm run test:package` for changes to library exports, dependencies or packaging; it verifies an actual archive in a separate consumer app. Keep catalogue-only dependencies in `devDependencies`, runtime dependencies in `dependencies`, and React in `peerDependencies` and `devDependencies`.

## Verify your work

```sh
npm run test:docs
npm run build
node tests/check-imports.mjs
npx playwright install chromium
npx playwright test tests/seo.spec.mjs
```

For interaction or download changes, run `npm test` and relevant primitive suites. Start `npm run dev -- --port 5176 --strictPort` in another terminal before `npm run test:primitives` or `npm run test:a11y`. Page and fresh-app integration commands are in the [README](README.md).

Check UI changes at desktop and mobile widths, with keyboard input and reduced motion. Include screenshots for visible changes. Report failing checks honestly, including whether they fail before your change. See [VALIDATION.md](VALIDATION.md) for verification scope and known limitations.

## Keep documentation consistent

- Read current facts from `src/catalog/catalog.js` (entries and categories), `src/catalog/seo.js` (production origin), `src/catalog/Examples.jsx` (public pages), and `package.json` (scripts, engines, exports and dependencies).
- Keep [README.md](README.md) as the main installation and development guide. Update the rendered guides in `src/catalog/Installation.jsx`, `src/catalog/Examples.jsx`, and the generated download README in `src/catalog/download.js` when those instructions change.
- For catalog or route changes, update the README totals, `public/llms.txt`, `public/sitemap.xml`, and [SEO.md](SEO.md). The AI index describes the current collection; historical test totals belong in Git history, not in its introduction.
- The initial HTML summary and description metadata are generated from catalog metadata by `vite.config.js`. Keep these facts readable without JavaScript; the SEO suite checks that the static inventory matches the interactive collection.
- Use [docs/source-installation.md](docs/source-installation.md) for optional source copying, [docs/essential-components.md](docs/essential-components.md) for the eleven essential families, [design.md](design.md) for design guidance, and [VALIDATION.md](VALIDATION.md) for dated verification and known gaps. Preserve third-party notices in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).
- Run `npm run test:docs` and the SEO checks after documentation changes. Confirm registry status with `npm view duoop-ui version homepage` before claiming a release is published. Source changes and site deployment do not publish an npm release.
- Keep component links under their actual categories in `public/llms.txt`. Update component-specific guides such as [docs/chart.md](docs/chart.md) and the rendered Usage & API notes when props or playground interactions change. Distinguish playground controls from the reusable component API.

## Open a pull request

Explain the user-visible problem, resulting behavior, and verification. Link related issues. Keep generated `dist/`, `artifacts/`, credentials, and `node_modules/` out of commits.

Be respectful and specific in reviews. Discuss the work, welcome different experience levels, and provide actionable feedback. Contributions use the repository's [Apache 2.0 license](LICENSE).

## Publish a new npm release (maintainers)

Run `npm run test:package` before releasing (Chromium must be installed). Review `npm pack --dry-run`, verify that you control the npm package name, and sign in with `npm login`. Set a new, unpublished release version with `npm version <version>`, then run `npm publish --access public`. The `prepack` hook rebuilds the library for packing and publishing. Registry publication is a separate maintainer action; this repository does not publish automatically.

The published `1.0.0` release was confirmed on September 8, 2026. Its registry metadata still contains the previous hosting URL; `package.json` now points to the production domain. Pushing this repository updates the source documentation, but does not rewrite a published npm version's README or metadata. Include the corrected documentation and homepage in the next npm release.

### Test a local library archive

To build an installable archive from a local checkout instead:

```sh
npm ci
npm pack
```

In your React 19 application, install the generated archive (adjust the path):

```sh
npm i /path/to/Duoop-UI/duoop-ui-1.0.1.tgz
```

A local archive is useful for testing unpublished changes before a release. Users installing the published library can use `npm i duoop-ui` directly.
