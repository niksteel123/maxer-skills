# Design Consistency Methodology

Detailed step-by-step process for achieving visual consistency between reference designs and implementation.

## Pre-Verification Setup

### 1. Identify Reference Source

**Option A: Running Prototype Server**
```
Reference URL: http://localhost:3001
Type: localhost
Navigation: Same as production routes
```

**Option B: Static Reference Images**
```
Reference Path: ./reference-images/{component}.png
Type: static
Source: Exported from Figma, screenshot from prototype, etc.
```

### 2. Ensure Dependencies

Add to project if not present:
```bash
pnpm add -D pixelmatch pngjs @playwright/test
```

### 3. Create Test Directory Structure

```
project/
├── tests/
│   └── e2e/
│       └── visual/
│           ├── components/           # Component-level tests
│           │   ├── market-card.spec.ts
│           │   └── forum-view.spec.ts
│           ├── pages/                # Full page tests
│           │   ├── collective.spec.ts
│           │   └── home.spec.ts
│           └── interactions/         # State transition tests
│               └── tab-switching.spec.ts
├── test-results/                     # Generated screenshots
│   ├── reference-*.png
│   ├── implementation-*.png
│   └── diff-*.png
└── reference-images/                 # Static reference images
    └── *.png
```

## Verification Process

### Step 1: Create Test File

For each component/view, create a test file:

```typescript
// tests/e2e/visual/components/market-card.spec.ts
import { test, expect } from "@playwright/test";
import { compareImages, DiffResult } from "../utils/visual-diff";

const REFERENCE_URL = process.env.REFERENCE_URL || "http://localhost:3001";
const WEBAPP_URL = process.env.WEBAPP_URL || "http://localhost:3000";

test.describe("MarketCard Visual Consistency", () => {
  test("default state matches reference", async ({ browser }) => {
    // Test implementation here
  });
});
```

### Step 2: Capture Reference Screenshot

```typescript
// Capture from running prototype
const refCtx = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});
const refPage = await refCtx.newPage();

await refPage.goto(`${REFERENCE_URL}/collectives/example`);
await refPage.waitForLoadState("networkidle");
await refPage.waitForTimeout(1500); // Wait for animations

await refPage.screenshot({
  path: "test-results/reference-MarketCard.png",
  fullPage: true
});
```

### Step 3: Capture Implementation Screenshot

```typescript
const implCtx = await browser.newContext({
  viewport: { width: 1920, height: 1080 } // SAME viewport
});
const implPage = await implCtx.newPage();

await implPage.goto(`${WEBAPP_URL}/collectives/example`);
await implPage.waitForLoadState("networkidle");
await implPage.waitForTimeout(1500); // SAME wait time

await implPage.screenshot({
  path: "test-results/implementation-MarketCard.png",
  fullPage: true
});
```

### Step 4: Run Diff Analysis

```typescript
const result = await compareImages(
  "test-results/reference-MarketCard.png",
  "test-results/implementation-MarketCard.png",
  "test-results/diff-MarketCard.png",
  "MarketCard"
);

console.log(JSON.stringify(result, null, 2));
// {
//   "component": "MarketCard",
//   "diffPercent": 8.34,
//   "status": "FAIL",
//   "mismatchedPixels": 24789,
//   "totalPixels": 297000
// }

expect(result.status).toBe("PASS");
```

### Step 5: Analyze FAIL Results

When diff returns FAIL:

1. **Read the diff image**:
   ```typescript
   // Diff image highlights differences in magenta/red
   // Use Read tool to view: test-results/diff-MarketCard.png
   ```

2. **Identify problem areas**:
   - Dimension differences (height, width)
   - Color mismatches
   - Missing elements
   - Spacing/padding issues
   - Font rendering differences

3. **Common issues and fixes**:

   | Symptom | Likely Cause | Fix |
   |---------|--------------|-----|
   | Large magenta area | Missing content | Check conditional rendering |
   | Shifted elements | Wrong spacing | Check padding/margin |
   | Color differences | Wrong variables | Check color tokens |
   | Size mismatch | Wrong dimensions | Check height/width CSS |
   | Blank section | Animation not completing | Use direct `initial/animate` |

### Step 6: Fix and Re-Verify

After identifying issues:

1. Make code changes
2. Re-run the test:
   ```bash
   npx playwright test --grep "MarketCard" --project=chromium
   ```
3. Check new diff percentage
4. Repeat until PASS (< 1%)

## Interaction Testing Methodology

### Tab/View Switching

```typescript
test("tab switching preserves content", async ({ browser }) => {
  const page = await browser.newPage();
  await page.goto(`${WEBAPP_URL}/collectives/example`);

  // Capture initial state (Trading tab)
  await page.screenshot({ path: "test-results/state-1-trading.png" });

  // Switch to Community
  await page.click('text=Community');
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/state-2-community.png" });

  // Switch back to Trading
  await page.click('text=Trading');
  await page.waitForTimeout(500);
  await page.screenshot({ path: "test-results/state-3-trading-return.png" });

  // Diff state-1 vs state-3 (should be identical)
  const result = await compareImages(
    "test-results/state-1-trading.png",
    "test-results/state-3-trading-return.png",
    "test-results/diff-trading-return.png",
    "TradingReturn"
  );

  expect(result.status).toBe("PASS");
});
```

### Hover States

```typescript
test("hover state matches reference", async ({ page }) => {
  await page.goto(WEBAPP_URL);

  const card = page.locator('[data-testid="MarketCard"]').first();

  // Normal state
  await card.screenshot({ path: "test-results/card-normal.png" });

  // Hover state
  await card.hover();
  await page.waitForTimeout(300);
  await card.screenshot({ path: "test-results/card-hover.png" });

  // Compare hover state to reference
  const result = await compareImages(
    "reference-images/card-hover.png",
    "test-results/card-hover.png",
    "test-results/diff-card-hover.png",
    "CardHover"
  );

  expect(result.status).toBe("PASS");
});
```

### Modal/Dropdown States

```typescript
test("modal open state", async ({ page }) => {
  await page.goto(WEBAPP_URL);

  // Closed state
  await page.screenshot({ path: "test-results/modal-closed.png" });

  // Open modal
  await page.click('[data-testid="open-modal-btn"]');
  await page.waitForSelector('[data-testid="modal"]', { state: 'visible' });
  await page.waitForTimeout(300); // Animation

  // Open state
  await page.screenshot({ path: "test-results/modal-open.png" });

  // Compare to reference
  const result = await compareImages(
    "reference-images/modal-open.png",
    "test-results/modal-open.png",
    "test-results/diff-modal.png",
    "ModalOpen"
  );

  expect(result.status).toBe("PASS");
});
```

## Common Pitfalls

### 1. Animation Timing

**Problem**: Screenshots captured before animation completes

**Solution**:
```typescript
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1500); // Fixed delay for animations
```

### 2. Viewport Mismatch

**Problem**: Different viewport sizes cause layout differences

**Solution**:
```typescript
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});
```

### 3. Dynamic Content

**Problem**: Timestamps, random data cause false failures

**Solution**: Mock dynamic content or use component-level screenshots with stable data

### 4. Font Rendering

**Problem**: Fonts render slightly differently across systems

**Solution**:
- Use higher pixelmatch threshold (0.1-0.2)
- Accept < 1% diff as passing
- Focus on layout, not sub-pixel differences

### 5. Conditional Rendering

**Problem**: Content doesn't render due to missing data/state

**Solution**:
- Ensure test data is loaded before capture
- Use `waitForSelector` for dynamic content:
```typescript
await page.waitForSelector('[data-testid="content-loaded"]');
```

### 6. Framer Motion Variants

**Problem**: `variants={staggerItem}` doesn't animate after initial render

**Solution**: Use direct animation props:
```tsx
// Instead of:
<motion.div variants={staggerItem}>

// Use:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
>
```

## Verification Report Format

After all tests pass, generate summary:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "results": [
    {
      "component": "MarketCard",
      "diffPercent": 0.42,
      "status": "PASS"
    },
    {
      "component": "ForumView",
      "diffPercent": 0.18,
      "status": "PASS"
    },
    {
      "component": "TabSwitching",
      "diffPercent": 0.05,
      "status": "PASS"
    }
  ],
  "overallStatus": "PASS",
  "totalTests": 3,
  "passedTests": 3
}
```
