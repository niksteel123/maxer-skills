# Diff Analysis Guide

How to interpret pixelmatch diff results and identify visual issues.

## Understanding Diff Output

### Structured Result Format

```json
{
  "component": "MarketCard",
  "diffPercent": 8.34,
  "status": "FAIL",
  "mismatchedPixels": 24789,
  "totalPixels": 297000,
  "diffImagePath": "test-results/diff-MarketCard.png"
}
```

### Status Thresholds

| Diff Percentage | Status | Action |
|-----------------|--------|--------|
| < 0.1% | PASS | Pixel-perfect match |
| 0.1% - 1.0% | PASS | Acceptable variance (fonts, anti-aliasing) |
| 1.0% - 5.0% | FAIL | Minor layout issues |
| 5.0% - 20% | FAIL | Significant visual differences |
| > 20% | FAIL | Major issues (missing content, wrong layout) |

## Reading Diff Images

Pixelmatch generates a diff image where:

- **Transparent/Black**: Matching pixels
- **Magenta/Red**: Differing pixels
- **Yellow**: Anti-aliased pixels (ignored with threshold)

### Interpreting Patterns

#### Large Solid Magenta Area
**Indicates**: Missing or extra content
**Example**: A component not rendering, blank section
**Fix**: Check conditional rendering, data loading, animation state

#### Horizontal/Vertical Magenta Bands
**Indicates**: Size/dimension mismatch
**Example**: Card is taller/shorter than reference
**Fix**: Check height, padding, margin values

#### Scattered Magenta Dots
**Indicates**: Color or font differences
**Example**: Wrong color variable, different font rendering
**Fix**: Check color tokens, font-family, font-weight

#### Shifted Content (Offset Magenta)
**Indicates**: Positioning mismatch
**Example**: Element moved left/right/up/down
**Fix**: Check padding, margin, flexbox alignment

#### Edge-Only Magenta
**Indicates**: Border or shadow differences
**Example**: Different border-radius, shadow spread
**Fix**: Check border, box-shadow, border-radius values

## Automated Analysis Logic

```typescript
function analyzeDiff(result: DiffResult): string[] {
  const issues: string[] = [];

  if (result.diffPercent > 50) {
    issues.push("CRITICAL: More than half the image differs - likely missing content or wrong page");
  } else if (result.diffPercent > 20) {
    issues.push("MAJOR: Significant layout differences - check component structure");
  } else if (result.diffPercent > 5) {
    issues.push("MODERATE: Noticeable differences - check dimensions and spacing");
  } else if (result.diffPercent > 1) {
    issues.push("MINOR: Small differences - check colors and fonts");
  }

  return issues;
}
```

## Common Diff Patterns and Solutions

### Pattern 1: Entire Section Missing (>80% diff)

**Symptoms**:
- Large contiguous magenta area
- Diff percentage very high

**Likely Causes**:
1. Component not mounting
2. Conditional render returning null
3. Animation stuck in hidden state
4. Data not loaded

**Solutions**:
```typescript
// Check for animation issues
// Instead of variants:
<motion.div variants={staggerItem}>

// Use direct props:
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
>
```

### Pattern 2: Dimension Mismatch (10-30% diff)

**Symptoms**:
- Horizontal or vertical bands of magenta
- Content appears shifted

**Likely Causes**:
1. Wrong height/width
2. Missing/extra padding
3. Different grid configuration

**Solutions**:
```css
/* Check these properties */
height: 280px;      /* Exact match */
padding: 16px;      /* Exact match */
gap: 24px;          /* Grid gap */
```

### Pattern 3: Color Differences (1-5% diff)

**Symptoms**:
- Scattered magenta, not structural
- Same layout, different appearance

**Likely Causes**:
1. Wrong color variable
2. Missing opacity
3. Different background

**Solutions**:
```css
/* Verify color tokens */
background: rgba(10, 10, 14, 0.6);  /* Check opacity */
color: rgba(255, 255, 255, 0.9);    /* Check alpha */
border-color: rgba(255, 255, 255, 0.1);
```

### Pattern 4: Interactive State Mismatch

**Symptoms**:
- Diff appears only after interaction
- First capture matches, subsequent don't

**Likely Causes**:
1. Wrong hover state
2. Animation not completing
3. State not updating

**Solutions**:
```typescript
// Ensure interaction completes
await element.hover();
await page.waitForTimeout(500); // Wait for transition

// Check state updates
await page.click('[data-testid="tab"]');
await page.waitForTimeout(1000); // Wait for animation
```

## Threshold Configuration

### Default Threshold
```typescript
const DIFF_THRESHOLD = 0.01; // 1%
```

### Adjusting for Specific Cases

```typescript
// Stricter for critical components
const STRICT_THRESHOLD = 0.005; // 0.5%

// Looser for text-heavy content (font rendering variance)
const TEXT_THRESHOLD = 0.02; // 2%

// Looser for animation snapshots
const ANIMATION_THRESHOLD = 0.03; // 3%
```

### Pixelmatch Options

```typescript
const mismatchedPixels = Pixelmatch(
  refImg.data,
  implImg.data,
  diff.data,
  width,
  height,
  {
    threshold: 0.1,           // Color difference threshold (0-1)
    includeAA: false,         // Ignore anti-aliased pixels
    alpha: 0.1,               // Alpha channel threshold
    aaColor: [255, 255, 0],   // Color for anti-aliased pixels
    diffColor: [255, 0, 255], // Color for diff pixels
    diffColorAlt: [0, 255, 0] // Alt color for diff pixels
  }
);
```

## Automated Decision Making

```typescript
interface AnalysisResult {
  status: "PASS" | "FAIL";
  diffPercent: number;
  severity: "none" | "minor" | "moderate" | "major" | "critical";
  suggestedAction: string;
}

function makeDecision(diffPercent: number): AnalysisResult {
  if (diffPercent < 1.0) {
    return {
      status: "PASS",
      diffPercent,
      severity: "none",
      suggestedAction: "No action needed"
    };
  }

  if (diffPercent < 5.0) {
    return {
      status: "FAIL",
      diffPercent,
      severity: "minor",
      suggestedAction: "Check colors, fonts, and minor spacing"
    };
  }

  if (diffPercent < 20.0) {
    return {
      status: "FAIL",
      diffPercent,
      severity: "moderate",
      suggestedAction: "Check dimensions, padding, and layout structure"
    };
  }

  if (diffPercent < 50.0) {
    return {
      status: "FAIL",
      diffPercent,
      severity: "major",
      suggestedAction: "Check component rendering and conditional logic"
    };
  }

  return {
    status: "FAIL",
    diffPercent,
    severity: "critical",
    suggestedAction: "Component may not be rendering - check mounting and animation state"
  };
}
```

## Verification Report

After analysis, generate report:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "component": "MarketCard",
  "reference": "test-results/reference-MarketCard.png",
  "implementation": "test-results/implementation-MarketCard.png",
  "diff": "test-results/diff-MarketCard.png",
  "analysis": {
    "status": "FAIL",
    "diffPercent": 8.34,
    "severity": "moderate",
    "suggestedAction": "Check dimensions, padding, and layout structure",
    "mismatchedPixels": 24789,
    "totalPixels": 297000
  },
  "iterations": [
    { "attempt": 1, "diffPercent": 8.34, "status": "FAIL" },
    { "attempt": 2, "diffPercent": 2.1, "status": "FAIL" },
    { "attempt": 3, "diffPercent": 0.42, "status": "PASS" }
  ]
}
```
