const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests/e2e',
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'test_reports/playwright', open: 'never' }]
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry'
  },
  webServer: process.env.PLAYWRIGHT_NO_WEB_SERVER
    ? undefined
    : {
        command: 'BROWSER=none yarn start',
        port: 3000,
        reuseExistingServer: !process.env.CI,
        timeout: 120000
      }
});
