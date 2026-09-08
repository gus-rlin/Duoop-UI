# Optional: install by copying source

Use this method when you want to edit the component implementation directly in your project. The standard [npm installation](../README.md#install-the-library) already supplies the component JavaScript, CSS and runtime dependencies. Copying source is an independent option: the copied component imports its local files, rather than importing from `duoop-ui`.

Use **React 19 + React DOM 19**, JSX compilation, and CSS imports. Use Node.js **22.18+ in the 22.x line, or 24.11+**, matching this repository's supported tooling:

```sh
npm create vite@latest my-duoop-app -- --template react
cd my-duoop-app
npm install
```

Open [Raised button → Code](https://duoop-ui.com/?component=builtin-relief-button&tab=code) and copy these files, preserving their paths:

| File | Purpose |
| --- | --- |
| [src/base.css](../src/base.css) | Shared sizing, font fallback, accessible hidden text, and keyboard focus without extra rings. |
| [src/components/Button/Button.jsx](../src/components/Button/Button.jsx) | Button and ActionFeedback; imports its CSS and helper. |
| [src/components/Button/Button.css](../src/components/Button/Button.css) | Appearance, depth, states, and reduced motion. |
| [src/components/Button/buttonColor.js](../src/components/Button/buttonColor.js) | Custom color palette calculations. |

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

Run `npm run dev`. Clicking increments the counter; Tab reveals an internal focus marker and Enter/Space activate the button. `npm run build` creates `dist/`. Button needs no additional dependencies beyond React.

### Styling and integration

Import `base.css` once; components import their own styles. To match the site's **DM Sans** font, install and import `@fontsource-variable/dm-sans`, then set `:root { --duoop-font: 'DM Sans Variable', system-ui, sans-serif; }`. Otherwise, the foundation uses a system font.

| Feature | Integration |
| --- | --- |
| GSAP motion | Install `gsap` when listed in Installation. Preserve reduced-motion behavior; Text Loop includes an explicit pause in its minimal example. |
| Map | Install `leaflet`; preserve CSS and attribution. OSM/CARTO tiles need network access and remain subject to provider terms and capacity. |
| Toast | Wrap `useToast()` consumers in `ToastProvider` and render `ToastViewport` once. |
| Chart | Copy Chart.jsx and Chart.css for the chart itself; no external chart runtime is needed. The playground imports additional Duoop controls. See the [Chart guide](chart.md) for data, series, missing values and Our data. |
| Dialog, Select, Menu | Keep the positioning helpers and CSS listed in Installation. Overlays may use portals. |
| Images and async demos | Supply production images and connect authentication, server validation, requests, quotas, and persistence. |
| Next.js | Add a `'use client';` boundary above hook-based components; import the foundation in your layout. Map needs client-only loading without SSR. This framework integration is not separately verified. |
| TypeScript | Allow JavaScript with `allowJs: true`, or add types in your project. |

The public page download maps [LandingPage.jsx](../src/examples/LandingPage.jsx) to `src/App.jsx` and [pages.css](../src/examples/pages.css) to `src/example.css`, including the foundation and local dependencies. If adapting the source-only settings example, replace its `readSettings()` and `save()` functions with your API; its demo storage key is `duoop-example-settings-v1`.

On Windows, if npm reports `UNABLE_TO_VERIFY_LEAF_SIGNATURE` and your network certificate is in the system store, use Node.js 24 and set `$env:NODE_USE_SYSTEM_CA = '1'` in PowerShell before installing. This preserves TLS verification.
