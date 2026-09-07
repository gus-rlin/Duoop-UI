import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'public-catalog.spec.mjs',
  timeout: 90000,
  expect: { timeout: 15000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['json', { outputFile: 'artifacts/public-test-results.json' }]],
  outputDir: 'artifacts/playwright',
  use: { baseURL: 'http://127.0.0.1:4176', viewport: { width: 1440, height: 960 }, screenshot: 'only-on-failure', trace: 'retain-on-failure' },
  webServer: { command: 'npm run preview -- --port 4176 --strictPort', url: 'http://127.0.0.1:4176', reuseExistingServer: !process.env.CI },
});
