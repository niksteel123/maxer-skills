---
name: design-consistency
description: "Verify visual consistency between a prototype/reference design and implementation. Use this skill when implementing UI from designs, fixing visual bugs, or ensuring pixel-perfect design matching. This skill operates FULLY AUTONOMOUSLY - no human review required. Agent makes all pass/fail decisions based on automated pixel diff analysis."
version: 1.0.0
---

# Design Consistency Verification Skill

This skill enforces rigorous visual verification between a reference design and implementation using automated Playwright testing and pixel diff analysis.

## Core Principle

**NEVER assume a fix works without automated visual verification.**

Code changes are NOT verified until diff analysis returns PASS status.

## When This Skill Triggers

- Implementing UI components from a prototype/design
- Fixing visual bugs or discrepancies
- User reports something "looks wrong" or "doesn't match"
- After any CSS/styling changes
- When testing interactive states (tabs, modals, hovers)

## Autonomous Operation

This skill operates **without human intervention**:
- Agent captures screenshots using available tools
- Agent analyzes visual differences to determine PASS/FAIL
- Agent fixes code and re-runs verification on FAIL
- Agent reports final status only after achieving PASS

## Tool Selection (Priority Order)

### 1. Claude in Chrome (`/chrome` MCP tools) - PREFERRED
When `mcp__claude-in-chrome__*` tools are available, use them for:
- Real-time browser interaction
- Side-by-side visual comparison
- Screenshot capture with `computer` action
- Direct DOM inspection with `read_page`

**Advantages**: Interactive, immediate feedback, can view both pages simultaneously

```
// Using Claude in Chrome:
1. mcp__claude-in-chrome__tabs_context_mcp - Get tab context
2. mcp__claude-in-chrome__tabs_create_mcp - Create tabs for ref & impl
3. mcp__claude-in-chrome__navigate - Navigate to URLs
4. mcp__claude-in-chrome__computer action="screenshot" - Capture screenshots
5. Read tool to view screenshots and compare visually
```

### 2. Playwright Tests - AUTOMATED CI/CD
Use Playwright with pixelmatch for:
- Automated test suites
- CI/CD pipelines
- Batch verification of multiple components
- Regression testing

**Advantages**: Scriptable, repeatable, generates diff images

### Decision Matrix

| Scenario | Tool |
|----------|------|
| Interactive debugging | Claude in Chrome |
| Quick visual check | Claude in Chrome |
| Side-by-side comparison | Claude in Chrome |
| Automated test suite | Playwright |
| CI/CD pipeline | Playwright |
| Regression testing | Playwright |
| Multiple components | Playwright |

## 5-Phase Workflow

### Phase 1: Setup Environment

1. Identify reference source:
   - Localhost URL (e.g., `http://localhost:3001` for prototype)
   - OR static image path (e.g., `./reference-images/MarketCard.png`)

2. Identify implementation URL (e.g., `http://localhost:3000`)

3. Verify servers are running:
   ```bash
   curl -s http://localhost:3000 > /dev/null && echo "Webapp OK" || echo "Webapp DOWN"
   curl -s http://localhost:3001 > /dev/null && echo "Prototype OK" || echo "Prototype DOWN"
   ```

4. Ensure dependencies available:
   - `pixelmatch` and `pngjs` in project devDependencies
   - `@playwright/test` installed

5. Create/locate Playwright test file for the component

### Phase 2: Reference Capture

1. If localhost reference:
   ```typescript
   await refPage.goto(REFERENCE_URL);
   await refPage.waitForLoadState("networkidle");
   await refPage.waitForTimeout(1000); // Allow animations
   await refPage.screenshot({ path: refPath, fullPage: true });
   ```

2. If static image reference:
   - Load image from specified path
   - Use as baseline for comparison

3. For component-specific capture (use selector):
   ```typescript
   const element = page.locator("[data-testid='MarketCard']");
   await element.screenshot({ path: refPath });
   ```

4. Save to: `test-results/reference-{component}.png`

### Phase 3: Implementation Capture

1. Navigate to implementation with SAME path/state as reference
2. Apply same viewport size
3. Wait for network idle + animations
4. Capture screenshot to: `test-results/implementation-{component}.png`

### Phase 4: Automated Diff Analysis

Run pixelmatch comparison:

```typescript
const mismatchedPixels = Pixelmatch(
  refImg.data, implImg.data, diff.data,
  width, height,
  { threshold: 0.1 }
);

const diffPercent = (mismatchedPixels / totalPixels) * 100;
const status = diffPercent < 1.0 ? "PASS" : "FAIL";
```

**Threshold**: < 1% pixel difference = PASS

Output structured result:
```json
{
  "component": "MarketCard",
  "diffPercent": 0.42,
  "status": "PASS",
  "mismatchedPixels": 1247,
  "totalPixels": 297000,
  "diffImagePath": "test-results/diff-MarketCard.png"
}
```

**On FAIL**:
1. Read diff image to identify problem areas (highlighted in red/magenta)
2. Analyze what's different: dimensions, colors, spacing, missing content
3. Fix the code
4. Return to Phase 3 and re-capture

### Phase 5: Interaction Testing

For interactive components, test ALL state transitions:

1. **Tab Switching**:
   - Capture "Trading" tab state
   - Click "Community" tab → wait → capture
   - Click "Trading" tab → wait → capture
   - Run diff on each state

2. **Hover States**:
   ```typescript
   await element.hover();
   await page.waitForTimeout(300);
   await element.screenshot({ path: hoverPath });
   ```

3. **Modal/Dropdown States**:
   - Capture closed state
   - Trigger open
   - Capture open state
   - Run diff on each

4. **Animation Completion**:
   - Wait for `networkidle`
   - Add fixed delay (1-2 seconds)
   - Then capture

## Mandatory Rules

1. **No Assumptions**: Code is NOT fixed until diff returns PASS
2. **Automated Evidence**: Every verification produces diff image + JSON result
3. **Component First**: Test components individually before full page
4. **All Interactions**: Test every clickable/interactive element
5. **State Persistence**: Verify views stay correct after state changes
6. **Threshold < 1%**: Must achieve < 1% pixel diff for PASS
7. **Auto-Retry**: On FAIL, fix code and re-verify automatically
8. **No Human Review**: Agent makes all decisions based on metrics

## Quick Reference

### Run Single Component Test
```bash
npx playwright test --grep "MarketCard" --project=chromium
```

### View Diff Image
```bash
open test-results/diff-MarketCard.png
```

### Check Test Results
```bash
cat test-results/verification-report.json
```

## See Also

- `METHODOLOGY.md` - Detailed step-by-step process
- `PLAYWRIGHT-SETUP.md` - Configuration guide
- `DIFF-ANALYSIS.md` - Interpreting diff results
- `CHECKLIST.md` - Pre-completion checklist
- `templates/comparison-test.spec.ts` - Test template
