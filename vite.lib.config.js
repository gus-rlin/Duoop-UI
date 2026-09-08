import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';

const manifest = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf8'));
const dependencies = Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies });

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'lib',
    lib: {
      entry: 'src/index.js',
      formats: ['es'],
      fileName: 'index',
      cssFileName: 'styles',
    },
    // Keep readable output and pure annotations for consumer tree shaking.
    minify: false,
    rolldownOptions: {
      external: id => !id.endsWith('.css') && dependencies.some(name => id === name || id.startsWith(`${name}/`)),
      output: { banner: '"use client";' },
    },
  },
});
