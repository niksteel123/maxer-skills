/**
 * Visual Diff Utility
 *
 * Standalone utility for comparing two images and generating a diff report.
 *
 * Usage:
 *   npx ts-node visual-diff.ts <reference> <implementation> [threshold]
 *
 * Example:
 *   npx ts-node visual-diff.ts ref.png impl.png 0.01
 */

import Pixelmatch from "pixelmatch";
import { PNG } from "pngjs";
import * as fs from "fs";
import * as path from "path";

// Types
export interface DiffResult {
  component: string;
  diffPercent: number;
  status: "PASS" | "FAIL";
  mismatchedPixels: number;
  totalPixels: number;
  diffImagePath: string;
  referencePath: string;
  implementationPath: string;
  dimensions: {
    reference: { width: number; height: number };
    implementation: { width: number; height: number };
    compared: { width: number; height: number };
  };
  timestamp: string;
}

export interface AnalysisResult {
  status: "PASS" | "FAIL";
  diffPercent: number;
  severity: "none" | "minor" | "moderate" | "major" | "critical";
  suggestedAction: string;
}

/**
 * Compare two PNG images and generate a diff image
 */
export function compareImages(
  refPath: string,
  implPath: string,
  diffPath: string,
  component: string,
  threshold: number = 0.01
): DiffResult {
  // Read images
  const refImg = PNG.sync.read(fs.readFileSync(refPath));
  const implImg = PNG.sync.read(fs.readFileSync(implPath));

  // Determine comparison dimensions (use minimum of both)
  const width = Math.min(refImg.width, implImg.width);
  const height = Math.min(refImg.height, implImg.height);

  // Create diff image
  const diff = new PNG({ width, height });

  // Run pixelmatch
  const mismatchedPixels = Pixelmatch(
    refImg.data,
    implImg.data,
    diff.data,
    width,
    height,
    {
      threshold: 0.1, // Color difference threshold
      includeAA: false, // Ignore anti-aliased pixels
      alpha: 0.1,
      diffColor: [255, 0, 255], // Magenta for differences
      diffColorAlt: [0, 255, 0], // Green for alternative diff
    }
  );

  // Ensure output directory exists
  const diffDir = path.dirname(diffPath);
  if (!fs.existsSync(diffDir)) {
    fs.mkdirSync(diffDir, { recursive: true });
  }

  // Write diff image
  fs.writeFileSync(diffPath, PNG.sync.write(diff));

  // Calculate results
  const totalPixels = width * height;
  const diffPercent = (mismatchedPixels / totalPixels) * 100;

  return {
    component,
    diffPercent,
    status: diffPercent < threshold * 100 ? "PASS" : "FAIL",
    mismatchedPixels,
    totalPixels,
    diffImagePath: diffPath,
    referencePath: refPath,
    implementationPath: implPath,
    dimensions: {
      reference: { width: refImg.width, height: refImg.height },
      implementation: { width: implImg.width, height: implImg.height },
      compared: { width, height },
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Analyze diff result and provide suggested action
 */
export function analyzeResult(diffPercent: number): AnalysisResult {
  if (diffPercent < 1.0) {
    return {
      status: "PASS",
      diffPercent,
      severity: "none",
      suggestedAction: "No action needed - visual match achieved",
    };
  }

  if (diffPercent < 5.0) {
    return {
      status: "FAIL",
      diffPercent,
      severity: "minor",
      suggestedAction: "Check colors, fonts, and minor spacing differences",
    };
  }

  if (diffPercent < 20.0) {
    return {
      status: "FAIL",
      diffPercent,
      severity: "moderate",
      suggestedAction: "Check dimensions, padding, margin, and layout structure",
    };
  }

  if (diffPercent < 50.0) {
    return {
      status: "FAIL",
      diffPercent,
      severity: "major",
      suggestedAction: "Check component rendering and conditional logic",
    };
  }

  return {
    status: "FAIL",
    diffPercent,
    severity: "critical",
    suggestedAction:
      "Component may not be rendering - check mounting, data loading, and animation state",
  };
}

/**
 * Generate verification report
 */
export function generateReport(
  results: DiffResult[],
  outputPath: string
): void {
  const report = {
    timestamp: new Date().toISOString(),
    overallStatus: results.every((r) => r.status === "PASS") ? "PASS" : "FAIL",
    totalTests: results.length,
    passedTests: results.filter((r) => r.status === "PASS").length,
    failedTests: results.filter((r) => r.status === "FAIL").length,
    results: results.map((r) => ({
      ...r,
      analysis: analyzeResult(r.diffPercent),
    })),
  };

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`Report saved to: ${outputPath}`);
}

/**
 * Print result to console
 */
export function printResult(result: DiffResult): void {
  const analysis = analyzeResult(result.diffPercent);

  console.log("\n" + "=".repeat(60));
  console.log(`VISUAL DIFF: ${result.component}`);
  console.log("=".repeat(60));
  console.log(`Status: ${result.status}`);
  console.log(`Diff: ${result.diffPercent.toFixed(2)}%`);
  console.log(`Severity: ${analysis.severity}`);
  console.log(`Mismatched: ${result.mismatchedPixels.toLocaleString()} / ${result.totalPixels.toLocaleString()} pixels`);
  console.log(`Action: ${analysis.suggestedAction}`);
  console.log(`Diff Image: ${result.diffImagePath}`);
  console.log("=".repeat(60) + "\n");
}

// CLI execution
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log("Usage: npx ts-node visual-diff.ts <reference> <implementation> [threshold]");
    console.log("Example: npx ts-node visual-diff.ts ref.png impl.png 0.01");
    process.exit(1);
  }

  const [refPath, implPath, thresholdStr] = args;
  const threshold = thresholdStr ? parseFloat(thresholdStr) : 0.01;

  const component = path.basename(refPath, path.extname(refPath)).replace("reference-", "");
  const diffPath = path.join(
    path.dirname(refPath),
    `diff-${component}.png`
  );

  try {
    const result = compareImages(refPath, implPath, diffPath, component, threshold);
    printResult(result);

    // Exit with appropriate code
    process.exit(result.status === "PASS" ? 0 : 1);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}
