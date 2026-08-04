# Playwright Setup for Visual Consistency Testing

Configuration guide for setting up Playwright to capture consistent screenshots for visual comparison.

## Installation

```bash
# Install Playwright and dependencies
pnpm add -D @playwright/test pixelmatch pngjs

# Install browsers
npx playwright install chromium
```

## playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e/visual',
  fullyParallel: false, // Run visual tests sequentially for consistency
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1, // Single worker for consistent screenshots
  reporter: 'html',

  use: {
    baseURL: process.env.WEBAPP_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        deviceScaleFactor: 1, // Consistent pixel density
      },
    },
  ],

  // Ensure webapp is running
  webServer: [
    {
      command: 'pnpm dev',
      url: 'http://localhost:3000',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],
});
```

## Multi-Context Browser Setup

For comparing two URLs simultaneously:

```typescript
import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";

interface DualContext {
  refCtx: BrowserContext;
  implCtx: BrowserContext;
  refPage: Page;
  implPage: Page;
}

async function createDualContext(browser: Browser): Promise<DualContext> {
  const viewport = { width: 1920, height: 1080 };

  const refCtx = await browser.newContext({ viewport });
  const implCtx = await browser.newContext({ viewport });

  const refPage = await refCtx.newPage();
  const implPage = await implCtx.newPage();

  return { refCtx, implCtx, refPage, implPage };
}

async function closeDualContext(ctx: DualContext): Promise<void> {
  await ctx.refCtx.close();
  await ctx.implCtx.close();
}

// Usage in test:
test("component comparison", async ({ browser }) => {
  const { refPage, implPage, refCtx, implCtx } = await createDualContext(browser);

  try {
    await refPage.goto("http://localhost:3001/page");
    await implPage.goto("http://localhost:3000/page");
    // ... capture and compare
  } finally {
    await closeDualContext({ refCtx, implCtx, refPage, implPage });
  }
});
```

## Screenshot Configuration Options

### Full Page Screenshot
```typescript
await page.screenshot({
  path: "test-results/full-page.png",
  fullPage: true, // Captures entire scrollable page
});
```

### Viewport Screenshot
```typescript
await page.screenshot({
  path: "test-results/viewport.png",
  fullPage: false, // Only visible viewport
});
```

### Element Screenshot
```typescript
const element = page.locator('[data-testid="MarketCard"]');
await element.screenshot({
  path: "test-results/element.png",
});
```

### With Specific Options
```typescript
await page.screenshot({
  path: "test-results/screenshot.png",
  fullPage: true,
  animations: "disabled", // Freeze animations
  caret: "hide", // Hide text cursor
  scale: "css", // Use CSS pixels (not device pixels)
});
```

## Viewport Consistency

Always use the same viewport for reference and implementation:

```typescript
const VIEWPORT = { width: 1920, height: 1080 };

// Reference context
const refCtx = await browser.newContext({ viewport: VIEWPORT });

// Implementation context (SAME viewport)
const implCtx = await browser.newContext({ viewport: VIEWPORT });
```

## Waiting for Content

### Network Idle
```typescript
await page.waitForLoadState("networkidle");
```

### Specific Element
```typescript
await page.waitForSelector('[data-testid="content-loaded"]', {
  state: 'visible',
  timeout: 10000,
});
```

### Animation Completion
```typescript
// Wait for network + fixed delay for animations
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1500);
```

### Dynamic Content
```typescript
// Wait for specific number of items
await page.waitForFunction(() => {
  return document.querySelectorAll('[data-testid="card"]').length >= 6;
});
```

## Environment Variables

```bash
# .env.test
REFERENCE_URL=http://localhost:3001
WEBAPP_URL=http://localhost:3000
DIFF_THRESHOLD=0.01
```

```typescript
// In test file
const REFERENCE_URL = process.env.REFERENCE_URL || "http://localhost:3001";
const WEBAPP_URL = process.env.WEBAPP_URL || "http://localhost:3000";
const DIFF_THRESHOLD = parseFloat(process.env.DIFF_THRESHOLD || "0.01");
```

## Running Tests

### Single Test
```bash
npx playwright test --grep "MarketCard" --project=chromium
```

### All Visual Tests
```bash
npx playwright test tests/e2e/visual --project=chromium
```

### With Debug Mode
```bash
npx playwright test --debug --grep "MarketCard"
```

### View Report
```bash
npx playwright show-report
```

## CI/CD Configuration

### GitHub Actions Example
```yaml
name: Visual Tests

on: [push, pull_request]

jobs:
  visual-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright
        run: npx playwright install --with-deps chromium

      - name: Start servers
        run: |
          pnpm dev &
          pnpm prototype &
          sleep 10

      - name: Run visual tests
        run: npx playwright test tests/e2e/visual --project=chromium

      - name: Upload results
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: visual-test-results
          path: test-results/
```

## Troubleshooting

### Screenshots Have Different Sizes
- Ensure same `viewport` in both contexts
- Use `fullPage: false` for viewport-only comparison
- Check for responsive breakpoints

### Fonts Look Different
- Install same fonts in CI environment
- Use web fonts that load consistently
- Increase pixelmatch threshold slightly

### Colors Slightly Off
- Check color profile settings
- Use `deviceScaleFactor: 1` in context
- Ensure same browser version

### Network-Dependent Content Fails
- Mock API responses
- Use `waitForLoadState("networkidle")`
- Add explicit waits for content
