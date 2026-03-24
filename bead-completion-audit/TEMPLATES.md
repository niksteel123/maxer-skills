# Bead Completion Audit — Templates (v4.0)

Templates for the autonomous spec-verification + fix loop output.

---

## Synthesis Report Template

```markdown
# Completion Audit Report — {Feature Name}

## Summary

| Metric | Value |
|--------|-------|
| **Date** | YYYY-MM-DD |
| **Auditor** | {agent-name} |
| **Scope** | {feature} — {N} spec requirements, {N} TDD tests |
| **Language** | {Rust / TypeScript / Python / Go / Mixed} |
| **Audit Iterations** | {N} |
| **Inline Fixes Applied** | {N} |
| **Fix Beads Created** | {N} |
| **Fix Beads Completed** | {N} |
| **Spec Questions (Human Input)** | {N} |
| **Verdict** | **COMPLETE** / **BLOCKED** |

{2-3 sentence summary.}

---

## Spec Requirement Status

| Requirement | Description | Status | Notes |
|------------|-------------|--------|-------|
| FR-2.1.1 | Method registry | PASS | |
| FR-2.1.2 | Unified dispatch | PASS | Fixed in iteration 2 (missing field) |
| FR-2.2.1 | Streaming handler | PASS | Fix bead audit-fix-001 |
| FR-2.3.1 | Graceful error handling | SPEC_QUESTION | Ambiguous — see below |

**Total: {passed}/{total} PASS ({percentage}%)**

---

## TDD Test Status

| Test ID | Description | Status | TDD Match | Notes |
|---------|-------------|--------|-----------|-------|
| UT-REG-001 | Registry insert | PASS | 4/4 | |
| IT-REG-005 | Registry persistence | PASS | 3/3 | Assertion added in iteration 1 |
| E2E-REG-001 | Registry E2E | PASS | 6/6 | Test file created via fix bead |

**Total: {passed}/{total} PASS ({percentage}%)**

---

## Fix Beads Created

| Bead ID | Gap Description | Req/Test IDs | Status | Iteration |
|---------|----------------|-------------|--------|-----------|
| audit-fix-001 | Missing StreamingMethodHandler | FR-2.2.1, UT-STR-001 | COMPLETE | 2 |
| audit-fix-002 | Stubbed schema parity test | UT-SCH-003 | COMPLETE | 3 |

---

## Inline Fixes Applied

| # | Fix Description | Files Modified | Req/Test IDs | Iteration |
|---|----------------|----------------|-------------|-----------|
| 1 | Added `workspace_id` field to VxgParams | vxg/types.rs | FR-2.1.1 | 1 |
| 2 | Fixed return type mismatch in list_work | work/service.rs | FR-2.4.2 | 1 |
| 3 | Strengthened UT-REG-002 assertions (2→4) | tests/ut_registry.rs | UT-REG-002 | 1 |

---

## Spec Questions (Human Input Required)

| # | Requirement | Spec Text | Question | Impact |
|---|------------|-----------|----------|--------|
| 1 | FR-2.3.1 | "handle gracefully" | Error type undefined — return specific or generic? | 3 error paths |

---

## Build & Test Status

| Check | Status |
|-------|--------|
| Build | PASS |
| Lint | PASS (0 warnings) |
| Format | PASS |
| Test Suite | {N}/{N} passing |
| Ignored Tests | {N} ({N} justified) |

---

## Loop History

| Iteration | Gaps Found | Inline Fixes | Fix Beads | New Gaps After Fix | Trend |
|-----------|-----------|-------------|-----------|-------------------|-------|
| 1 | 12 | 8 | 2 | 1 | — |
| 2 | 1 | 1 | 0 | 0 | Converging |
| FINAL | 0 | — | — | — | COMPLETE |

---

## Verdict

**{COMPLETE / BLOCKED}**

{Justification paragraph. If BLOCKED, list remaining blockers.}
```

---

## Fix Bead Template

```markdown
# audit-fix: {original-bead-id} — {gap description}

## SOURCE OF TRUTH WARNING
- **Spec**: {path} — §{section}
- **TDD**: {path} — {test_ids}
- **Original Bead**: {bead_id}
- **Audit Finding**: {what's missing}
- **Audit Iteration**: {N}

## Gap
{What the spec requires that isn't implemented}

## Spec Requirement (verbatim)
{Exact text from spec — copy/paste, not paraphrased}

## Required Changes
{Specific code changes — files, functions, types}

## TDD Tests to Satisfy
| Test ID | Assertions (from TDD) |
|---------|----------------------|
| {id} | {assertion pseudo-code} |

## Acceptance Criteria (from spec)
- [ ] {criterion 1 — verbatim from spec}
- [ ] {criterion 2}

## Verification
- [ ] Build passes
- [ ] Tests {test_ids} pass
- [ ] Spec acceptance criteria met
- [ ] No regressions in existing tests
```

---

## SPEC_QUESTION Template

```markdown
## SPEC_QUESTION #{N}

**Requirement:** {req_id} — {title}
**Spec text:** "{exact quote from spec}"

**Ambiguity:** {what's unclear}

**Possible interpretations:**
A) {interpretation A — implications}
B) {interpretation B — implications}

**Code impact:** {what depends on this decision}
**Current implementation:** {what the code currently does, if anything}
**Recommendation:** {if you have a strong preference, state it — but don't implement it}
```

---

## Progress Update Template

```markdown
## Audit Progress: {Feature}

**Loop iteration:** {N} of {max}
**Current phase:** {N}/10

### Inventory
- Spec requirements: {checked}/{total}
- TDD tests: {checked}/{total}

### This Iteration
- Gaps found: {N} (INLINE: {N}, FIX_BEAD: {N}, SPEC_QUESTION: {N})
- Inline fixes applied: {N}
- Fix beads created: {N}
- Fix beads completed: {N}

### Cumulative
- Total inline fixes: {N}
- Total fix beads: {N} ({N} complete)
- Total spec questions: {N}
- Converging: {YES/NO} ({trend})
```

---

## Loop Iteration Summary Template

```markdown
### Iteration {N} Summary

**Entry:** {N} gaps from previous iteration
**Inline fixes:** {N} applied
**Fix beads:** {N} created, {N} completed
**Re-verification:** {N} new gaps found / CLEAN
**Exit:** → {Phase 4 (loop) / Phase 9 (final verify) / Phase 10 (report)}
```
