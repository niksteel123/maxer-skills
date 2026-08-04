# Design Consistency Verification Checklist

Automated checklist for agents to complete before marking visual work done.

## Pre-Verification Requirements

- [ ] Reference source identified (localhost URL or static image path)
- [ ] Implementation server running and accessible
- [ ] `pixelmatch` and `pngjs` dependencies available
- [ ] Playwright test file exists for component/view
- [ ] Viewport size matches between reference and implementation
- [ ] Test data/content is consistent between both sources

## Verification Execution

- [ ] Playwright test executed successfully (no connection errors)
- [ ] Reference screenshot captured: `test-results/reference-{component}.png`
- [ ] Implementation screenshot captured: `test-results/implementation-{component}.png`
- [ ] Diff image generated: `test-results/diff-{component}.png`
- [ ] Diff analysis returned structured JSON result

## Pass/Fail Criteria

- [ ] **Diff percentage < 1.0% (PASS status)**
- [ ] If FAIL: Agent analyzed diff image to identify specific issues
- [ ] If FAIL: Agent made code fixes to address identified issues
- [ ] If FAIL: Agent re-ran verification after fixes
- [ ] Re-verification achieved PASS status

## Interaction Testing (if applicable)

- [ ] All tab/view switches tested
- [ ] Before and after states captured for each transition
- [ ] Diff analysis passed for all state transitions
- [ ] Return-to-original-state verified (no state persistence bugs)

### Specific Interactions Tested:

- [ ] Tab switching (Trading ↔ Community, etc.)
- [ ] Hover states on interactive elements
- [ ] Modal open/close states
- [ ] Dropdown expand/collapse states
- [ ] Form input focus states
- [ ] Button click feedback

## Final Verification

- [ ] All diff results logged to `test-results/verification-report.json`
- [ ] Overall status is PASS for all tested components
- [ ] No outstanding FAIL results
- [ ] Verification iterations documented (if multiple attempts needed)

## Report to User

After all checks pass, report:

```
Visual verification complete for {component}:
- Diff: {diffPercent}% (PASS)
- Interactions: {interactionCount} tested, all PASS
- Iterations: {iterationCount} (if > 1)
```

---

## Quick Reference Commands

### Run verification
```bash
npx playwright test --grep "{component}" --project=chromium
```

### View diff image
```bash
open test-results/diff-{component}.png
```

### Check all results
```bash
cat test-results/verification-report.json
```

### Re-run after fix
```bash
npx playwright test --grep "{component}" --project=chromium --retries=0
```

---

## Common Failure Resolutions

| Failure Type | Quick Check |
|--------------|-------------|
| >50% diff | Component not rendering - check animation/conditional |
| 10-50% diff | Layout issue - check dimensions/spacing |
| 1-10% diff | Styling issue - check colors/fonts |
| Interaction fail | State not updating - check onClick handlers |
| Tab switch fail | Animation variant issue - use direct props |

---

## Sign-Off

Agent confirms:

- [ ] All verification steps completed autonomously
- [ ] No human review requested or required
- [ ] Final PASS status achieved for all components
- [ ] Results documented in verification report
