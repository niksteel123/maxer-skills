/**
 * Visual Consistency Comparison Test Template
 *
 * Copy this template and customize for your component/view.
 *
 * Usage:
 * 1. Copy to tests/e2e/visual/{component}.spec.ts
 * 2. Replace {COMPONENT_NAME} with actual component name
 * 3. Update navigation paths for reference and implementation
 * 4. Add component-specific selectors if needed
 * 5. Run: npx playwright test --grep "{ComponentName}" --project=chromium
 */

import { test, expect, Browser, BrowserContext, Page } from "@playwright/test";
import Pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import * as fs from "fs";
import * as path from "path";

// Configuration
const REFERENCE_URL = process.env.REFERENCE_URL || "http://localhost:3001";
const WEBAPP_URL = process.env.WEBAPP_URL || "http://localhost:3000";
const DIFF_THRESHOLD = parseFloat(process.env.DIFF_THRESHOLD || "0.01"); // 1%
const VIEWPORT = { width: 1920, height: 1080 };

// Types
interface DiffResult {
  component: string;
  diffPercent: number;
  status: "PASS" | "FAIL";
  mismatchedPixels: number;
  totalPixels: number;
  diffImagePath: string;
  referencePath: string;
  implementationPath: string;
}

interface DualContext {
  refCtx: BrowserContext;
  implCtx: BrowserContext;
  refPage: Page;
  implPage: Page;
}

// Utilities
async function createDualContext(browser: Browser): Promise<DualContext> {
  const refCtx = await browser.newContext({ viewport: VIEWPORT });
  const implCtx = await browser.newContext({ viewport: VIEWPORT });
  const refPage = await refCtx.newPage();
  const implPage = await implCtx.newPage();
  return { refCtx, implCtx, refPage, implPage };
}

async function closeDualContext(ctx: DualContext): Promise<void> {
  await ctx.refCtx.close();
  await ctx.implCtx.close();
}

function compareImages(
  refPath: string,
  implPath: string,
  diffPath: string,
  component: string
): DiffResult {
  const refImg = PNG.sync.read(fs.readFileSync(refPath));
  const implImg = PNG.sync.read(fs.readFileSync(implPath));

  // Handle size mismatch
  if (refImg.width !== implImg.width || refImg.height !== implImg.height) {
    console.warn(`Size mismatch: ref=${refImg.width}x${refImg.height}, impl=${implImg.width}x${implImg.height}`);
    // Use smaller dimensions for comparison
    const width = Math.min(refImg.width, implImg.width);
    const height = Math.min(refImg.height, implImg.height);
    const diff = new PNG({ width, height });

    const mismatchedPixels = Pixelmatch(
      refImg.data, implImg.data, diff.data,
      width, height,
      { threshold: 0.1 }
    );

    fs.writeFileSync(diffPath, PNG.sync.write(diff));

    const totalPixels = width * height;
    const diffPercent = (mismatchedPixels / totalPixels) * 100;

    return {
      component,
      diffPercent,
      status: diffPercent < DIFF_THRESHOLD * 100 ? "PASS" : "FAIL",
      mismatchedPixels,
      totalPixels,
      diffImagePath: diffPath,
      referencePath: refPath,
      implementationPath: implPath,
    };
  }

  const { width, height } = refImg;
  const diff = new PNG({ width, height });

  const mismatchedPixels = Pixelmatch(
    refImg.data, implImg.data, diff.data,
    width, height,
    { threshold: 0.1 }
  );

  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  const totalPixels = width * height;
  const diffPercent = (mismatchedPixels / totalPixels) * 100;

  return {
    component,
    diffPercent,
    status: diffPercent < DIFF_THRESHOLD * 100 ? "PASS" : "FAIL",
    mismatchedPixels,
    totalPixels,
    diffImagePath: diffPath,
    referencePath: refPath,
    implementationPath: implPath,
  };
}

function logResult(result: DiffResult): void {
  console.log("\n" + "=".repeat(60));
  console.log(`VISUAL DIFF RESULT: ${result.component}`);
  console.log("=".repeat(60));
  console.log(JSON.stringify(result, null, 2));
  console.log("=".repeat(60) + "\n");
}

// Ensure test-results directory exists
const resultsDir = path.join(process.cwd(), "test-results");
if (!fs.existsSync(resultsDir)) {
  fs.mkdirSync(resultsDir, { recursive: true });
}

// ============================================================
// TEST SUITE: {COMPONENT_NAME}
// ============================================================

test.describe("{COMPONENT_NAME} Visual Consistency", () => {

  // Full page comparison
  test("full page matches reference", async ({ browser }) => {
    const component = "{COMPONENT_NAME}";
    const refPath = `test-results/reference-${component}.png`;
    const implPath = `test-results/implementation-${component}.png`;
    const diffPath = `test-results/diff-${component}.png`;

    const { refPage, implPage, refCtx, implCtx } = await createDualContext(browser);

    try {
      // 1. Capture reference
      await refPage.goto(`${REFERENCE_URL}/{PATH_TO_VIEW}`);
      await refPage.waitForLoadState("networkidle");
      await refPage.waitForTimeout(1500);
      await refPage.screenshot({ path: refPath, fullPage: true });

      // 2. Capture implementation
      await implPage.goto(`${WEBAPP_URL}/{PATH_TO_VIEW}`);
      await implPage.waitForLoadState("networkidle");
      await implPage.waitForTimeout(1500);
      await implPage.screenshot({ path: implPath, fullPage: true });

      // 3. Compare
      const result = compareImages(refPath, implPath, diffPath, component);
      logResult(result);

      // 4. Assert
      expect(result.status, `Diff ${result.diffPercent.toFixed(2)}% exceeds threshold`).toBe("PASS");

    } finally {
      await closeDualContext({ refCtx, implCtx, refPage, implPage });
    }
  });

  // Component-level comparison (using selector)
  test("component element matches reference", async ({ browser }) => {
    const component = "{COMPONENT_NAME}-element";
    const selector = "[data-testid='{COMPONENT_SELECTOR}']";
    const refPath = `test-results/reference-${component}.png`;
    const implPath = `test-results/implementation-${component}.png`;
    const diffPath = `test-results/diff-${component}.png`;

    const { refPage, implPage, refCtx, implCtx } = await createDualContext(browser);

    try {
      // 1. Capture reference element
      await refPage.goto(`${REFERENCE_URL}/{PATH_TO_VIEW}`);
      await refPage.waitForLoadState("networkidle");
      await refPage.waitForTimeout(1000);

      const refElement = refPage.locator(selector).first();
      if (await refElement.isVisible()) {
        await refElement.screenshot({ path: refPath });
      } else {
        throw new Error(`Reference element not found: ${selector}`);
      }

      // 2. Capture implementation element
      await implPage.goto(`${WEBAPP_URL}/{PATH_TO_VIEW}`);
      await implPage.waitForLoadState("networkidle");
      await implPage.waitForTimeout(1000);

      const implElement = implPage.locator(selector).first();
      if (await implElement.isVisible()) {
        await implElement.screenshot({ path: implPath });
      } else {
        throw new Error(`Implementation element not found: ${selector}`);
      }

      // 3. Compare
      const result = compareImages(refPath, implPath, diffPath, component);
      logResult(result);

      // 4. Assert
      expect(result.status, `Diff ${result.diffPercent.toFixed(2)}% exceeds threshold`).toBe("PASS");

    } finally {
      await closeDualContext({ refCtx, implCtx, refPage, implPage });
    }
  });

  // Interaction test: Tab switching
  test("tab switching preserves state", async ({ page }) => {
    const component = "{COMPONENT_NAME}-tabs";

    await page.goto(`${WEBAPP_URL}/{PATH_TO_VIEW}`);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    // Capture initial state
    const state1Path = `test-results/${component}-state1.png`;
    await page.screenshot({ path: state1Path, fullPage: true });

    // Click tab to switch
    await page.click('text={TAB_NAME}');
    await page.waitForTimeout(500);

    // Capture after state
    const state2Path = `test-results/${component}-state2.png`;
    await page.screenshot({ path: state2Path, fullPage: true });

    // Click back to original tab
    await page.click('text={ORIGINAL_TAB}');
    await page.waitForTimeout(500);

    // Capture return state
    const state3Path = `test-results/${component}-state3.png`;
    await page.screenshot({ path: state3Path, fullPage: true });

    // Compare state1 vs state3 (should match after round-trip)
    const diffPath = `test-results/diff-${component}-roundtrip.png`;
    const result = compareImages(state1Path, state3Path, diffPath, `${component}-roundtrip`);
    logResult(result);

    expect(result.status, "Tab round-trip should return to original state").toBe("PASS");
  });

  // Hover state test
  test("hover state matches reference", async ({ browser }) => {
    const component = "{COMPONENT_NAME}-hover";
    const selector = "[data-testid='{COMPONENT_SELECTOR}']";
    const refPath = `test-results/reference-${component}.png`;
    const implPath = `test-results/implementation-${component}.png`;
    const diffPath = `test-results/diff-${component}.png`;

    const { implPage, implCtx, refCtx, refPage } = await createDualContext(browser);

    try {
      // Capture reference hover state
      await refPage.goto(`${REFERENCE_URL}/{PATH_TO_VIEW}`);
      await refPage.waitForLoadState("networkidle");
      const refElement = refPage.locator(selector).first();
      await refElement.hover();
      await refPage.waitForTimeout(300);
      await refElement.screenshot({ path: refPath });

      // Capture implementation hover state
      await implPage.goto(`${WEBAPP_URL}/{PATH_TO_VIEW}`);
      await implPage.waitForLoadState("networkidle");
      const implElement = implPage.locator(selector).first();
      await implElement.hover();
      await implPage.waitForTimeout(300);
      await implElement.screenshot({ path: implPath });

      // Compare
      const result = compareImages(refPath, implPath, diffPath, component);
      logResult(result);

      expect(result.status, "Hover state should match reference").toBe("PASS");

    } finally {
      await closeDualContext({ refCtx, implCtx, refPage, implPage });
    }
  });
});
