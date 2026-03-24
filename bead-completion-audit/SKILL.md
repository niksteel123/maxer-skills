---
name: bead-completion-audit
description: Autonomous spec-verification + fix loop. Reads spec + TDD + codebase, finds every gap, fixes inline or via fix beads, re-verifies in a loop until 100% spec completion or BLOCKED on human input. Works on any codebase (Rust, TypeScript, Python, Go, etc.).
---

# Bead Completion Audit (v4.0 — Autonomous Fix Loop)

> **Not just an audit — an autonomous spec-verification + fix loop.**
> Reads spec + TDD cover-to-cover, deep-reads codebase field-by-field,
> finds every gap, fixes inline or creates fix beads, executes fixes,
> re-verifies, and **loops until 100% spec completion** or BLOCKED on human input.
> Works on any codebase.

## Core Philosophy

**The audit is not done when the report is written. It's done when EVERY spec requirement is implemented and verified.**

Spec drift is the primary threat. TDD drift is equally dangerous. This audit operates as an autonomous fix loop:

1. Read the blueprints (spec + TDD — both PRIMARY sources of truth)
2. Open the hood (read every implementation file)
3. Check every weld against the engineering drawing (field-by-field, test-by-test)
4. When you find a bad weld — **FIX IT** (inline or via fix bead)
5. Re-inspect the welded area
6. Keep going until every weld passes inspection — or flag what needs human input

**Anti-philosophy: What this audit does NOT do:**
- Trust bead status as evidence of implementation
- Trust test names as evidence of coverage — READ THE BODY
- Trust struct/class existence as evidence of correctness
- Produce passive reports without fixes
- Stop after finding drift — it FIXES drift
- Guess at ambiguous spec requirements — flags them as SPEC_QUESTION

---

## When to Use This Skill

Use this skill when:
- A bead-based implementation has been executed and needs verification
- You want to drive a feature to 100% spec completion, not just audit it
- You need to catch AND FIX spec drift between planning docs and code
- Post-implementation QA before marking a feature production-ready
- You suspect fake/placeholder tests or incomplete implementations
- TDD test assertions need to be verified against actual test bodies

**Trigger phrases:**
- "Run a completion audit"
- "Audit and fix the implementation"
- "Drive {feature} to 100% spec completion"
- "Post-implementation audit"
- "Verify and fix spec drift"
- "FCA audit"
- "bead-completion-audit"

---

## Inputs

### Required (provided or discovered)

| Input | Description | Discovery Method |
|-------|-------------|------------------|
| `spec` | PRIMARY source-of-truth spec document | User provides OR search `docs/`, `thoughts/` |
| `tdd` | PRIMARY source-of-truth TDD + bootstrap document | User provides OR search alongside spec |
| `implementation_files` | Code files that implement the spec | Extract from kickoff prompt OR explore codebase |

### Optional

| Input | Default |
|-------|---------|
| `strategy` | Auto-discover alongside spec (ordering-only, not content) |
| `beads_root` | Auto-discover via `br list` / `bd list` |
| `beads_cli` | Auto-detect: `br` preferred, `bd` fallback |
| `output_path` | `docs/plan-hub/audit/{date}-{feature}-audit-report.md` |
| `max_iterations` | `5` (safety valve for loop termination) |
| `language` | Auto-detect from project (Cargo.toml → Rust, package.json → TS, etc.) |

---

## Source of Truth Hierarchy

```
Spec    (PRIMARY) — what must be implemented
TDD     (PRIMARY) — what tests must exist and what they assert
Strategy (ORDERING) — phase gates and dependency order only
Beads   (DERIVED) — task breakdown, references spec + TDD
Code    (IMPLEMENTATION) — must match spec + TDD
```

**If code works but doesn't match spec → [FAIL]**
**If tests pass but don't match TDD assertions → [FAIL]**
**If spec is ambiguous → [SPEC_QUESTION]**

---

## The Audit-Fix-Verify Loop

```
┌───────────────────────────────────────────────────────────────┐
│               COMPLETION AUDIT LOOP (v4.0)                     │
│                                                                │
│  PHASE 1: FULL SPEC + TDD INVENTORY                           │
│    Read spec cover-to-cover                                    │
│    Extract EVERY requirement ID + acceptance criteria           │
│    Read TDD cover-to-cover                                     │
│    Extract EVERY test ID + assertions                          │
│    This is the checklist. Every item must be GREEN.            │
│                                                                │
│  PHASE 2: CODEBASE DEEP READ                                  │
│    For each spec requirement:                                  │
│      - Does the implementation exist?                          │
│      - Does it match the spec's acceptance criteria?           │
│      - Field-by-field, behavior-by-behavior verification       │
│    For each TDD test:                                          │
│      - Does the test file/function exist?                      │
│      - Does the test body match TDD assertions?                │
│      - Is the test actually runnable (not skipped/stubbed)?    │
│                                                                │
│  PHASE 3: BUILD + TEST GATE                                   │
│    Bootstrap prerequisites check (from TDD bootstrap doc)      │
│    cargo check / bun typecheck (language-appropriate)          │
│    Run full test suite                                         │
│    Run lint/format checks                                      │
│    Any failure = BLOCKER before proceeding                     │
│                                                                │
│  PHASE 4: GAP CLASSIFICATION                                  │
│    For each gap found in Phase 2:                              │
│      INLINE_FIX  — small, fix right now (missing field,       │
│                    wrong type, missing assertion)               │
│      FIX_BEAD    — larger work (missing feature, missing       │
│                    test file, architectural gap)                │
│      SPEC_QUESTION — ambiguous spec, needs human input         │
│                                                                │
│  PHASE 5: FIX INLINE ISSUES                                   │
│    Fix all INLINE_FIX gaps immediately in the codebase         │
│    Re-run build + test gate after each fix batch               │
│                                                                │
│  PHASE 6: CREATE FIX BEADS                                    │
│    For each FIX_BEAD gap:                                      │
│      Create a new bead with spec requirement (verbatim),       │
│      TDD test IDs, specific code changes, AC from spec         │
│      Tag as "audit-fix" with parent = original bead            │
│                                                                │
│  PHASE 7: EXECUTE FIX BEADS                                   │
│    Implement each fix                                          │
│    Run the specific TDD tests                                  │
│    Verify acceptance criteria                                  │
│    Mark bead complete                                          │
│                                                                │
│  PHASE 8: RE-VERIFY                                           │
│    Run full build + test gate                                  │
│    Re-read fixed areas against spec                            │
│    Did the fix introduce new gaps?                             │
│    If YES → back to Phase 4 with new gaps                      │
│    If NO  → continue                                           │
│                                                                │
│  PHASE 9: FINAL VERIFICATION                                  │
│    Walk ENTIRE spec inventory from Phase 1                     │
│    Every requirement: [PASS] or [FAIL]                         │
│    Every TDD test: [PASS] or [FAIL]                            │
│    If any [FAIL] → back to Phase 4                             │
│    If ALL [PASS] → produce final report                        │
│                                                                │
│  PHASE 10: SYNTHESIS REPORT                                   │
│    Per-requirement status table                                │
│    Per-TDD-test status table                                   │
│    Fix beads created + completed                               │
│    Inline fixes applied                                        │
│    Loop iterations count                                       │
│    SPEC_QUESTION items for human                               │
│    VERDICT: COMPLETE or BLOCKED                                │
│                                                                │
└───────────────────────────────────────────────────────────────┘
```

### Loop Control Flow

```
START → Phase 1 → Phase 2 → Phase 3 → Phase 4
                                         │
                        ┌────────────────┤
                        ▼                ▼
                   Phase 5          Phase 6
                   (inline)         (fix beads)
                        │                │
                        └────────┬───────┘
                                 ▼
                            Phase 7
                            (execute)
                                 │
                                 ▼
                            Phase 8 ──── gaps? ──→ Phase 4 (loop)
                                 │
                                 ▼ (no new gaps)
                            Phase 9 ──── fails? ──→ Phase 4 (loop)
                                 │
                                 ▼ (all pass)
                            Phase 10
                            (report)
                                 │
                                 ▼
                               DONE
```

### Loop Termination Criteria

The loop terminates when ONE of:
1. **COMPLETE**: Every spec requirement [PASS], every TDD test [PASS], build green
2. **BLOCKED**: All remaining gaps are SPEC_QUESTION requiring human input
3. **MAX_ITERATIONS**: Safety valve (default 5) — report remaining gaps

---

## Gap Classification

| Classification | Criteria | Action |
|---------------|----------|--------|
| **INLINE_FIX** | <30 min work, localized, no architectural impact | Fix immediately in the codebase |
| **FIX_BEAD** | >30 min work, touches multiple files, needs coordinated changes | Create fix bead, execute, verify |
| **SPEC_QUESTION** | Spec is ambiguous, contradictory, or silent on the matter | Log for human input, continue auditing |

---

## Language Detection & Tool Mapping

| Indicator | Language | Build | Lint | Format | Test |
|-----------|----------|-------|------|--------|------|
| `Cargo.toml` | Rust | `cargo check --all-targets` | `cargo clippy --all-targets -- -D warnings` | `cargo fmt --check` | `cargo test` |
| `package.json` + `tsconfig.json` | TypeScript | `tsc --noEmit` | `eslint .` | `prettier --check .` | `vitest`/`jest`/`bun test` |
| `pyproject.toml` | Python | `mypy .` | `ruff check .` | `ruff format --check .` | `pytest` |
| `go.mod` | Go | `go build ./...` | `golangci-lint run` | `gofmt -l .` | `go test ./...` |

**Mixed-language projects:** Run all applicable toolchains.

---

## Related Files

- **METHODOLOGY.md** — Detailed phase-by-phase execution with loop mechanics
- **CHECKLIST.md** — Per-phase verification checklists
- **TEMPLATES.md** — Report template, fix bead template, SPEC_QUESTION template
- **QA-VERIFICATION.md** — TDD cross-check deep dive + test body reading

---

## Integration with Master Workflow

```
[research-to-spec] → [spec-to-tdd] → [spec-to-strategy] → [beads-from-sources] → [bead-plan-audit]
                                                           ↓
                                                  ⛔ STOP — Human authorizes
                                                           ↓
                                                  [Agents implement beads]
                                                           ↓
                                              ⛔ STOP — Human triggers audit
                                                           ↓
                                              [bead-completion-audit] ← THIS SKILL
                                                    ↕ (loops until 100%)
                                              ✅ COMPLETE or 🚫 BLOCKED
```

---

## Example Invocations

**Full audit with 3 SOTs:**
```
Run a completion audit.
Spec: thoughts/layer-2/unified-mesh-layer-2-mesh.md
TDD: thoughts/layer-2/layer-2-mesh-tdd.md
Root epic: bd-3ubh
```

**Minimal (auto-discover):**
```
Audit and fix all beads for epic bd-xxxx.
Spec: thoughts/shared/feature-spec.md
TDD: thoughts/shared/feature-tdd.md
```

**Explicit paths:**
```
Drive VXG Testing to 100% spec completion.
Root epic: bd-if5i
Spec: thoughts/shared/2026-03-11-vxg-testing-source-of-truth.md
TDD: thoughts/shared/vxg-testing-tdd.md
Implementation: crates/swarm-services/src/vxg/test_*.rs
```

---

## Initiative Rules

1. **Spec + TDD are co-primary sources of truth.** Code must match both. Beads are derived.
2. **Do NOT trust test names.** Read the body. Compare assertions against TDD. "Would a no-op pass?" If yes → fake → rewrite.
3. **Do NOT trust bead status.** "Closed" means nothing. Only code matching the spec matters.
4. **If you find a gap — FIX IT.** Small gaps: inline fix. Large gaps: fix bead. Never report-only.
5. **Loop until 100% or BLOCKED.** The audit is done when every spec requirement is implemented, not when the report is written.
6. **SPEC_QUESTION items need human input.** Do NOT guess. Log them, continue auditing other areas, include in final report.
7. **Re-verify after every fix batch.** Fixes can introduce new gaps. Always re-run build + tests.
8. **Follow project conventions** (AGENTS.md, CLAUDE.md) for all code fixes.
9. **Use ultrathink for deep read phases (1, 2, 9).** Phase 1 (inventory extraction), Phase 2 (codebase deep read), and Phase 9 (final verification) require maximum analytical depth. Quality over speed.
10. **Commit fixes as you go.** Descriptive messages per fix batch.
11. **Context management.** Read large files in sections. If context fills, state exact resume point with loop iteration number.
12. **Real-runtime tests are NON-NEGOTIABLE.** "E2E" with mocks is NOT E2E. Rewrite it.
13. **Test bodies must match TDD assertions, not just test names.** A test that exists but doesn't assert what the TDD specifies is a [FAIL].
14. **Bootstrap verification before test runs.** Check TDD bootstrap prerequisites are met.
15. **MAX_ITERATIONS is a safety valve, not a target.** Most audits should complete in 1-3 iterations.
16. **Divergence = investigate.** If gap count increases between iterations, PAUSE and investigate root cause (cascading type changes? contradictory spec sections?) before continuing. Do not blindly burn iterations.
