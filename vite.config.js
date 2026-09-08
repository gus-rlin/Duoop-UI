import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import { format } from 'prettier';
import { categories, entries, repository } from './src/catalog/catalog.js';

const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);

// Serve the current inventory to readers that do not execute React. React's
// createRoot replaces this same public content when the interactive app loads.
function catalogSummary() {
  const groups = categories.map(category => `<section>
    <h2>${escapeHtml(category)}</h2>
    <ul>${entries.filter(entry => entry.category === category).map(entry =>
      `<li><a href="?component=${encodeURIComponent(entry.id)}">${escapeHtml(entry.name)}</a> — ${escapeHtml(entry.summary)}</li>`,
    ).join('\n')}</ul>
  </section>`).join('\n');
  return `<main data-catalog-summary>
    <h1>Duoop UI — Tactile React components</h1>
    <p>${entries.length} components across ${categories.length} categories. Interactive previews, complete JSX and CSS source files, and runnable examples.</p>
    <h2>Install the library</h2>
    <p>Install the published npm package in a React 19 application:</p>
    <pre><code>npm i duoop-ui</code></pre>
    <p>Import components from <code>duoop-ui</code> and the stylesheet <code>duoop-ui/styles.css</code> once. Runtime dependencies install automatically.</p>
    <p>You can also copy source files or download a runnable Vite project. Dedicated TypeScript declarations are not supplied.</p>
    <nav aria-label="Documentation">
      <a href="?page=components">Component catalog</a> ·
      <a href="?page=installation">Installation guide</a> ·
      <a href="/llms.txt">Plain-text component index</a> ·
      <a href="${escapeHtml(repository)}/blob/main/README.md">README</a>
    </nav>
    ${groups}
    <h2>Page example</h2>
    <p><a href="?page=examples&amp;example=landing">Outdoor adventure landing page</a>: the current public page example, with source files and a runnable download.</p>
    <p>Duoop UI is open source under Apache-2.0.</p>
  </main>`;
}

export default defineConfig({
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: ['**/artifacts/**', '**/tests/**'] } },
  plugins: [{
    name: 'readable-catalog-html',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const description = `${entries.length} React components across ${categories.length} categories. Install duoop-ui from npm, explore live previews, or copy complete JSX and CSS source files.`;
        return html.replaceAll('%DUOOP_CATALOG_DESCRIPTION%', escapeHtml(description))
          .replace('<!--duoop-catalog-summary-->', catalogSummary());
      },
    },
  }, {
    name: 'readable-component-sources',
    enforce: 'pre',
    async load(id) {
      if (!/\.(jsx|js|css)\?raw$/.test(id)) return;
      const text = await fs.readFile(id.slice(0, -4), 'utf8');
      const code = await format(text, { parser: id.endsWith('.css?raw') ? 'css' : 'babel', singleQuote: true, printWidth: 85 });
      return `export default ${JSON.stringify(code)};`;
    },
  }],
  build: { reportCompressedSize: false },
});
