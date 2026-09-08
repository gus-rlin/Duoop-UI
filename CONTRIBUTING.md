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

## Verify your work

```sh
npm run build
node tests/check-imports.mjs
npx playwright install chromium
npx playwright test tests/seo.spec.mjs
```

For interaction or download changes, run `npm test` and relevant primitive suites. Start `npm run dev -- --port 5176 --strictPort` in another terminal before `npm run test:primitives` or `npm run test:a11y`. Page and fresh-app integration commands are in the [README](README.md).

Check UI changes at desktop and mobile widths, with keyboard input and reduced motion. Include screenshots for visible changes. Report failing checks honestly, including whether they fail before your change. See [VALIDATION.md](VALIDATION.md) for historical results and known limitations.

## Open a pull request

Explain the user-visible problem, resulting behavior, and verification. Link related issues. Keep generated `dist/`, `artifacts/`, credentials, and `node_modules/` out of commits.

Be respectful and specific in reviews. Discuss the work, welcome different experience levels, and provide actionable feedback. Contributions use the repository's [Apache 2.0 license](LICENSE).
