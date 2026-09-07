import { zipSync, strToU8 } from 'fflate';
import license from '../../LICENSE?raw';

export const runtimeVersions = {
  react: '^19.2.8',
  'react-dom': '^19.2.8',
  gsap: '^3.15.0',
  leaflet: '^1.9.4',
};
export function starterFiles(bundle) {
  return [
    ...bundle.files,
    ['LICENSE', license],
    [
      'src/main.jsx',
      "import React from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App.jsx';\nimport './base.css';\n\ncreateRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);\n",
    ],
    [
      'index.html',
      '<!doctype html>\n<html lang="en"><head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>Duoop example</title></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>\n',
    ],
    [
      'package.json',
      JSON.stringify(
        {
          name: 'duoop-example',
          license: 'Apache-2.0',
          private: true,
          type: 'module',
          scripts: { dev: 'vite', build: 'vite build', preview: 'vite preview' },
          dependencies: Object.fromEntries(
            bundle.dependencies.map((name) => [name, runtimeVersions[name] || '*']),
          ),
          devDependencies: { vite: '^8.2.2' },
        },
        null,
        2,
      ),
    ],
    [
      'README.md',
      '# Duoop example\n\nRequires Node.js 22.12+ or 24+ and npm.\n\n```sh\nnpm install\nnpm run dev\n```\n\nBuild with `npm run build`. The output is in `dist/`.\n\nTo use in an existing React application, keep the supplied paths inside `src/`, install the dependencies in package.json, import `src/base.css` once, and use App.jsx as your example. Component styles are imported by their implementations. DM Sans is optional: the shared base uses a system font fallback.\n\nGallery requests, sample accounts and rewards are local demonstrations. Map and photographic examples use remote providers; check attribution, availability and usage terms before publishing.\n\nDuoop source is Apache 2.0d; retain the project license notice.\n',
    ],
  ];
}
export async function downloadBundle(bundle, name) {
  const archive = zipSync(
    Object.fromEntries(starterFiles(bundle).map(([path, code]) => [path, strToU8(code)])),
  );
  const url = URL.createObjectURL(new Blob([archive], { type: 'application/zip' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `duoop-${name}.zip`;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
