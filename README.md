<div align="center">

<img src="public/armadillo-logo.png" alt="Duoop UI armadillo" width="88" />

# Duoop UI

### Interfaces you can feel. Source code you can own.

Tactile React components with crisp outlines, playful motion, and satisfying feedback.

**46 components across 7 categories — interactive previews, source code, and downloadable examples.**

[**Explore the live catalog →**](https://duoop-ui.com/) · [Components](https://duoop-ui.com/?page=components) · [Installation](https://duoop-ui.com/?page=installation) · [Page examples](https://duoop-ui.com/?page=examples)

[![CI](https://github.com/gus-rlin/Duoop-UI/actions/workflows/ci.yml/badge.svg)](https://github.com/gus-rlin/Duoop-UI/actions/workflows/ci.yml)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-303b51?style=flat-square)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19-303b51?style=flat-square&logo=react)](https://react.dev/)

</div>

[![Duoop UI live catalog](docs/images/catalog.png)](https://duoop-ui.com/)

## Why Duoop?

- **A distinctive feel.** Raised surfaces, short shadows, expressive SVGs, and motion that responds to your actions.
- **Source included.** Preview, inspect, and copy complete JSX and CSS files, including local helpers.
- **Runnable downloads.** Download a Vite project with the displayed example, styles, and dependencies.
- **Plain React and CSS.** No Tailwind setup, custom CLI, or global provider required for a basic button.
- **Interaction matters.** Keyboard behavior, visible focus, reduced motion, and clear action feedback are part of the design.

This repository contains the documentation site and the installable React library, under Apache 2.0. Use the package to install the whole collection, or keep copying source files and downloading examples when you want to edit their implementation. Dedicated TypeScript declarations are not yet supplied.

## Install the library

Install [duoop-ui from npm](https://www.npmjs.com/package/duoop-ui) in your React 19 application:

```sh
npm i duoop-ui
```

Component dependencies install automatically. React and React DOM are shared with your application as peer dependencies.

Import the stylesheet once in your application entry, then import components by name:

```jsx
import { Button, Card } from 'duoop-ui';
import 'duoop-ui/styles.css';

export default function App() {
  return <Card><Button onClick={() => alert('Hello!')}>Press me</Button></Card>;
}
```

The ESM package contains all public components, their compound components and helpers, including `IconButton`. It excludes the catalogue, demos and development tools. Your bundler can remove unused JavaScript exports; the single stylesheet includes the full collection, the shared foundation and Leaflet styles. The foundation sets page defaults such as body margin and font, so import your application overrides afterwards. DM Sans remains an optional font installation.

Use a React bundler such as Vite. For Next.js, import the stylesheet in the root layout and use interactive components from a client component; the library entry preserves its `"use client"` boundary. Next.js integration and dedicated TypeScript declarations are not yet verified/provided. The source-copy instructions below remain available.

## Explore the collection

**46 components · 7 categories**, each with downloadable examples. The collection includes Breadcrumb and Separator, plus Tooltip, Popover, Slider, Calendar, Date Picker, Table, Pagination, Sheet, File Upload, Skeleton and Alert. See [integration notes and verification](docs/essential-components.md).

| Collection | Explore |
| --- | --- |
| Buttons | [Raised buttons and reactions](https://duoop-ui.com/?category=Buttons) |
| Forms | [Inputs, selection, and validation](https://duoop-ui.com/?category=Forms) |
| Navigation | [Menus and tabs](https://duoop-ui.com/?category=Navigation) |
| Cards | [Cards and composed layouts](https://duoop-ui.com/?category=Cards) |
| Feedback | [Toasts, progress, and achievements](https://duoop-ui.com/?category=Feedback) |
| Motion | [Animated text and expressive interactions](https://duoop-ui.com/?category=Motion) |
| Display | [Avatars, maps, and more](https://duoop-ui.com/?category=Display) |

Explore [Page examples](https://duoop-ui.com/?page=examples). Sources include a [studio landing page](src/examples/LandingPage.jsx) and a [settings page](src/examples/SettingsPage.jsx). Example brands, pricing, forms, and persistence are demonstrations; connect your own services when adapting them.

## Your first component by copying source

Use **React 19 + React DOM 19**, JSX compilation, and CSS imports. For a new Vite app, use Node.js **22.12+ or 24+**:

```sh
npm create vite@latest my-duoop-app -- --template react
cd my-duoop-app
npm install
```

Open [Raised button → Code](https://duoop-ui.com/?component=builtin-relief-button&tab=code) and copy these files, preserving their paths:

| File | Purpose |
| --- | --- |
| [src/base.css](src/base.css) | Shared sizing, font fallback, accessible hidden text, and inset focus. |
| [src/components/Button/Button.jsx](src/components/Button/Button.jsx) | Button and ActionFeedback; imports its CSS and helper. |
| [src/components/Button/Button.css](src/components/Button/Button.css) | Appearance, depth, states, and reduced motion. |
| [src/components/Button/buttonColor.js](src/components/Button/buttonColor.js) | Custom color palette calculations. |

Or select **Download project**, unzip it, run `npm install`, then `npm run dev`. The download already includes the setup below.

Replace `src/main.jsx` with:

```jsx
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './base.css';

createRoot(document.getElementById('root')).render(<App />);
```

Keep Vite's `<div id="root"></div>` in `index.html`. Remove its template `index.css` and `App.css` imports to avoid conflicting layout rules. Do not copy the catalog's `src/styles.css` into your app.

Replace `src/App.jsx` with:

```jsx
import React, { useState } from 'react';
import { Button } from './components/Button/Button.jsx';

export default function App() {
  const [count, setCount] = useState(0);
  return (
    <main style={{ padding: 32 }}>
      <Button onClick={() => setCount(value => value + 1)}>
        Pressed {count} times
      </Button>
    </main>
  );
}
```

Run `npm run dev`. Clicking increments the counter; Tab reveals inset focus and Enter/Space activate the button. `npm run build` creates `dist/`. Button needs no additional dependencies beyond React.

### Styling and integration

Import `base.css` once; components import their own styles. To match the site's **DM Sans** font, install and import `@fontsource-variable/dm-sans`, then set `:root { --duoop-font: 'DM Sans Variable', system-ui, sans-serif; }`. Otherwise, the foundation uses a system font.

| Feature | Integration |
| --- | --- |
| GSAP motion | Install `gsap` when listed in Installation. Preserve reduced-motion behavior; Text Loop includes an explicit pause in its minimal example. |
| Map | Install `leaflet`; preserve CSS and attribution. OSM/CARTO tiles need network access and remain subject to provider terms and capacity. |
| Toast | Wrap `useToast()` consumers in `ToastProvider` and render `ToastViewport` once. |
| Dialog, Select, Menu | Keep the positioning helpers and CSS listed in Installation. Overlays may use portals. |
| Images and async demos | Supply production images and connect authentication, server validation, requests, quotas, and persistence. |
| Next.js | Add a `'use client';` boundary above hook-based components; import the foundation in your layout. Map needs client-only loading without SSR. This framework integration is not separately verified. |
| TypeScript | Allow JavaScript with `allowJs: true`, or add types in your project. |

Page downloads map the page to `src/App.jsx` and [pages.css](src/examples/pages.css) to `src/example.css`, including the foundation and local dependencies. The settings example stores test data under `duoop-example-settings-v1`; replace `readSettings()` and `save()` with your API.

On Windows, if npm reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE` and your network certificate is in the system store, use Node.js 24 and set `$env:NODE_USE_SYSTEM_CA = '1'` in PowerShell before installing. This preserves TLS verification.

## Develop and test

Catalog tooling requires **Node.js 22.18+ in the 22.x line, or 24.11+**, and npm.

```sh
git clone https://github.com/gus-rlin/Duoop-UI.git
cd Duoop-UI
npm ci
npm run dev
```

| Command | Purpose |
| --- | --- |
| `npm run build` | Build the static site into `dist/`. |
| `npm run preview` | Preview the production build. |
| `npm test` | Build, check imports, run public browser/SEO tests, and build downloaded projects. |
| `npm run test:primitives` | Run detailed primitive suites against a dev server on port 5176. |
| `npm run test:a11y` | Audit galleries against a dev server on port 5176. |
| `npm run test:pages` | Build and test downloaded pages after `npm test`. |
| `npm run test:integration` | Verify the README button in a fresh Vite app; requires npm access. |

Install Chromium with `npx playwright install chromium`. For a fixed dev port, run `npm run dev -- --port 5176 --strictPort`; `TEST_URL` overrides the primitive suites' server address. Reports and screenshots go to the ignored `artifacts/` directory.

GitHub CI runs the production build, import checks, and SEO browser tests. See [VALIDATION.md](VALIDATION.md) for historical results and known limitations. Automated accessibility checks are not a comprehensive certification.

## Deployment

The live site is on [Cloudflare Pages](https://duoop-ui.com/). Deploy `dist/` over HTTPS for clipboard access. Query-based deep links do not need route rewrites. Preserve public TXT/XML files and allow required remote demo assets in any CSP. See [SEO.md](SEO.md).

Legacy personal entries in `duoop-ui.components.v1` are no longer displayed; their stored data is not deleted or rewritten.

## Contribute

Start with [CONTRIBUTING.md](CONTRIBUTING.md), follow the [design guidelines](design.md), and use the [issue templates](https://github.com/gus-rlin/Duoop-UI/issues/new/choose) for bugs and ideas.

Useful entry points: [catalog metadata](src/catalog/catalog.js), [integration recipes](src/catalog/recipes.js), [source bundling](src/catalog/source-bundle.js), and [code documentation](src/components/Button/Documentation.jsx).

If Duoop helps you build something, a GitHub star helps others discover it.

## License

[Apache License 2.0](LICENSE). Preserve required license and attribution notices. Third-party dependencies and demo assets retain their own terms.
