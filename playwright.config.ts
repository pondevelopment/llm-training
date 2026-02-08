import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;

/**
 * Playwright configuration for paper & question smoke tests.
 *
 * Local (WSL): uses system Chrome via channel option.
 * CI:          uses Playwright's bundled Chromium (installed via npx playwright install).
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : 2,
  reporter: isCI
    ? [['html', { open: 'never' }], ['github']]
    : [['html', { open: 'never' }], ['list']],
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
        // Local WSL needs system Chrome; CI uses bundled Chromium
        ...(isCI ? {} : { channel: 'chrome' }),
      },
    },
  ],
  webServer: {
    command: 'npx vite --port 5501',
    port: 5501,
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});
