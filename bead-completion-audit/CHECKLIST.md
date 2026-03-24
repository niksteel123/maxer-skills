# Bead Completion Audit — Checklists (v4.0)

Per-phase verification checklists for the autonomous spec-verification + fix loop.
Language-agnostic — adapt commands to your project's toolchain.

---

## Pre-Audit Checklist

### Environment
- [ ] Beads CLI available (`br --version` or `bd --version`)
- [ ] Git repository in known state (`git status`)
- [ ] Project language detected

### Source of Truth Documents
- [ ] **Spec** document located and readable (PRIMARY)
- [ ] **TDD + Bootstrap** document located and readable (PRIMARY)
- [ ] Strategy document located (if exists, ORDERING only)
- [ ] Root epic bead ID known (if using beads)

### Loop State Initialized
- [ ] Output path decided
- [ ] Max iterations set (default: 5)
- [ ] Implementation file map started

---

## Phase 1: Full Spec + TDD Inventory

- [ ] Spec read cover-to-cover
- [ ] ALL requirement IDs extracted with acceptance criteria
- [ ] TDD read cover-to-cover
- [ ] ALL test IDs extracted with key assertions
- [ ] Bootstrap document read (if exists)
  - [ ] Required tools/services noted
  - [ ] Validation scripts noted
- [ ] Implementation file map created (subsystem → source → tests)
- [ ] Inventory tables built:
  - [ ] Spec requirements table: ___ items
  - [ ] TDD tests table: ___ items

---

## Phase 2: Codebase Deep Read

### Per-Requirement Verification
For EACH spec requirement:
- [ ] Implementation code located
- [ ] Field-by-field comparison done
- [ ] Behavior-by-behavior comparison done
- [ ] Error/edge case paths verified
- [ ] State transitions verified (if applicable)
- [ ] Wiring verified (entry point → service → storage)
- [ ] Marked: [PASS] / [FAIL] / [PARTIAL]

### Per-TDD-Test Verification
For EACH TDD test:
- [ ] Test file/function found in codebase
- [ ] Test BODY read (not just name)
- [ ] Assertions compared against TDD pseudo-code
- [ ] Test is runnable (not ignored/skipped/stubbed)
- [ ] Correct infrastructure used (real vs mock per TDD spec)
- [ ] Edge cases from TDD covered
- [ ] Marked: [PASS] / [FAIL] / [PARTIAL]

### Completion
- [ ] All spec requirements checked: ___/___
- [ ] All TDD tests checked: ___/___
- [ ] Gap list compiled: ___ gaps found

---

## Phase 3: Build + Test Gate

- [ ] Bootstrap prerequisites verified (if applicable)
- [ ] **Build check passes** (zero errors)
- [ ] **Lint check passes** (zero warnings)
- [ ] **Format check passes**
- [ ] **Full test suite runs**
  - Total: ___ | Passed: ___ | Failed: ___ | Ignored: ___
- [ ] **Baseline recorded** for comparison
- [ ] **Any failures FIXED** before proceeding

---

## Phase 4: Gap Classification

For EACH gap:
- [ ] Classified as INLINE_FIX / FIX_BEAD / SPEC_QUESTION
- [ ] Priority assigned (CRITICAL / HIGH / MEDIUM)
- [ ] Gap table built:
  - INLINE_FIX: ___ items
  - FIX_BEAD: ___ items
  - SPEC_QUESTION: ___ items

---

## Phase 5: Fix Inline Issues

- [ ] All INLINE_FIX items addressed
- [ ] Fixes applied in priority order (CRITICAL → HIGH → MEDIUM)
- [ ] Build + test gate re-run after each fix batch
- [ ] No regressions introduced
- [ ] Each fix logged in remediation summary
- [ ] Fixes committed with descriptive messages

---

## Phase 6: Create Fix Beads

For EACH FIX_BEAD gap:
- [ ] Fix bead created with:
  - [ ] SOURCE OF TRUTH WARNING (spec path + TDD path)
  - [ ] Spec requirement (verbatim from spec)
  - [ ] TDD test IDs + assertions
  - [ ] Specific code changes needed
  - [ ] Acceptance criteria (from spec, not invented)
- [ ] Tagged as "audit-fix"
- [ ] Parent set to original bead

---

## Phase 7: Execute Fix Beads

For EACH fix bead:
- [ ] Full content read
- [ ] Changes implemented
- [ ] Specific TDD tests run
- [ ] Acceptance criteria verified
- [ ] Build + test gate green
- [ ] Bead marked complete
- [ ] Changes committed

---

## Phase 8: Re-Verify

- [ ] Full build + test gate re-run
- [ ] Fixed areas re-read against spec
- [ ] Adjacent code checked for new drift
- [ ] **New gaps found?**
  - [ ] YES → added to gap table, loop back to Phase 4
  - [ ] NO → continue to Phase 9

---

## Phase 9: Final Verification

- [ ] EVERY spec requirement re-checked: ___/___ [PASS]
- [ ] EVERY TDD test re-checked: ___/___ [PASS]
- [ ] Final build + test suite green
- [ ] **Any [FAIL]?**
  - [ ] YES → loop back to Phase 4
  - [ ] NO → continue to Phase 10

---

## Phase 10: Synthesis Report

- [ ] Summary section with counts and percentages
- [ ] Spec requirement status table (all items)
- [ ] TDD test status table (all items)
- [ ] Fix beads created table
- [ ] Inline fixes applied table
- [ ] SPEC_QUESTION items listed (if any)
- [ ] Build & test status confirmed green
- [ ] Verdict: COMPLETE / BLOCKED
- [ ] Report written to output path

---

## Per-Loop-Iteration Checklist

At the start of each iteration (2+):
- [ ] Iteration number: ___
- [ ] New gaps from previous iteration: ___
- [ ] New gaps classified
- [ ] Inline fixes applied
- [ ] Fix beads created and executed
- [ ] Re-verification complete
- [ ] Converging? (fewer gaps than previous iteration)

---

## Red Flags

### Spec Drift
- [ ] Type exists but missing fields from spec
- [ ] Field exists but wrong type
- [ ] Behavior in spec with no enforcement code
- [ ] Type defined but never used in logic
- [ ] State transition not matching spec lifecycle
- [ ] Error path in spec with no handler

### TDD Drift
- [ ] Test exists but assertions don't match TDD
- [ ] Test uses mocks where TDD specifies real infrastructure
- [ ] TDD specifies N assertions, test has fewer
- [ ] Test ID doesn't exist in codebase at all
- [ ] Test is skipped/ignored without justification

### Fake Tests
- [ ] Empty test bodies
- [ ] `assert!(true)` / `expect(true).toBe(true)`
- [ ] Tests only checking compilation
- [ ] No-op would pass the test
- [ ] `#[ignore]` / `.skip` without justification
- [ ] "Integration" test using only mocks

### Stub Implementations
- [ ] Service returns default/hardcoded values
- [ ] Handler dispatches to `todo!()`
- [ ] CLI prints help but doesn't call service
- [ ] Gateway route exists but handler empty
