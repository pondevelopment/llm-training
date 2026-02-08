import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for paper interactive smoke tests.
 * Uses system Chrome via channel option for WSL compatibility.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 2,
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  timeout: 60000,
  use: {
    baseURL: 'http://127.0.0.1:5501',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        channel: 'chrome',
      },
    },
  ],
  webServer: {
    command: 'npx vite --port 5501',
    port: 5501,
    reuseExistingServer: true,
    timeout: 120000,
  },
});
