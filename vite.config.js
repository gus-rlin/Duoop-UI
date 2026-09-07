import { defineConfig } from 'vite';
import fs from 'node:fs/promises';
import { format } from 'prettier';

export default defineConfig({
  optimizeDeps: { entries: ['index.html'] },
  server: { watch: { ignored: ['**/artifacts/**', '**/tests/**'] } },
  plugins: [{
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
