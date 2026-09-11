import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  // 'line' prints a compact summary in the terminal; no HTML file is written
  reporter: 'line',
  outputDir: 'test-results', // keep the folder name but it will stay empty
  use: {
    baseURL: 'http://localhost:3000',
    // only capture a trace on CI retries, never locally
    trace: process.env.CI ? 'on-first-retry' : 'off',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
