# Bead Completion Audit — Methodology (v4.0)

Detailed phase-by-phase execution for the autonomous spec-verification + fix loop.
Language-agnostic — auto-detects Rust, TypeScript, Python, Go, or mixed projects.

---

## Pre-Audit Setup

### 1. Verify Prerequisites

```bash
# Beads CLI (try br first, fallback to bd)
br --version 2>/dev/null || bd --version

# Git clean state (or understood)
git status

# Detect language
ls Cargo.toml package.json pyproject.toml go.mod 2>/dev/null
```

### 2. Locate Source of Truth Documents

| Document | Role | Required? |
|----------|------|-----------|
| Spec | PRIMARY — what to build | **YES** |
| TDD + Bootstrap | PRIMARY — what tests to write, what they assert | **YES** |
| Strategy | ORDERING — phase gates, dependency order | Optional |
| Beads | DERIVED — task breakdown referencing spec + TDD | Optional |
| Kickoff/Handoff prompts | Context | Optional |

### 3. Initialize Loop State

```
LOOP STATE:
  iteration: 0
  spec_requirements: [] (populated in Phase 1)
  tdd_tests: [] (populated in Phase 1)
  gaps: [] (populated in Phase 2+)
  inline_fixes: 0
  fix_beads_created: 0
  fix_beads_completed: 0
  spec_questions: []
```

---

## Phase 1: Full Spec + TDD Inventory

**Goal:** Build the complete checklist of what must exist. Every item starts [UNCHECKED].

### Step 1.1: Read Spec Cover-to-Cover

Read the entire spec document. For each requirement:
- Extract requirement ID (e.g., FR-2.1.1, SC-3, NN-5)
- Extract acceptance criteria (what "done" looks like)
- Note: fields/types, behavioral invariants, error paths, state transitions, integration contracts

Build a table:
```
| Req ID | Description | AC Summary | Status |
|--------|-------------|------------|--------|
| FR-2.1.1 | Method registry | 226 methods, unified dispatch | [UNCHECKED] |
```

### Step 1.2: Read TDD Cover-to-Cover

Read the entire TDD document. For each test:
- Extract test ID (e.g., UT-REG-001, IT-CONN-005, E2E-MESH-001)
- Extract the test's assertions (what specifically it verifies)
- Note the TDD pseudo-code — this is what the test body MUST match
- Note the infrastructure requirements (real vs mock)

Build a table:
```
| Test ID | Description | Key Assertions | Infra | Status |
|---------|-------------|---------------|-------|--------|
| UT-REG-001 | Registry insert | method_count == 226, lookup by name | Unit | [UNCHECKED] |
```

### Step 1.3: Read Bootstrap Document (if exists)

Extract:
- Required tools/services
- Environment configuration
- Validation scripts
- Pre-test setup steps

### Step 1.4: Map Implementation Locations

```
| Subsystem | Source Files | Test Files |
|-----------|-------------|------------|
| Registry | `src/registry.rs` | `tests/ut_registry.rs` |
| Connector | `src/connector.rs` | `tests/it_connector.rs` |
```

---

## Phase 2: Codebase Deep Read

**Goal:** Check every item from Phase 1 against actual code. This is ~50% of audit effort.

### Step 2.1: Per-Requirement Verification

For EACH spec requirement from the Phase 1 inventory:

1. **Find the code** — locate implementation file(s)
2. **Read the spec section** — every stated requirement
3. **Read the code** — what it actually does
4. **Compare field-by-field** — types, fields, enums, interfaces
5. **Compare behavior-by-behavior** — invariants, error paths, state transitions
6. **Flag drift** — any mismatch is a gap

```
| Spec Field | Expected Type | Code Field | Code Type | Match? |
|------------|---------------|------------|-----------|--------|
| `name` | `String` | `name` | `String` | PASS |
| `target_ref` | `NodeRef` | — | — | **FAIL — MISSING** |
```

### Step 2.2: Per-TDD-Test Verification (THE TDD CROSS-CHECK)

For EACH TDD test from the Phase 1 inventory:

1. **Does a corresponding test file/function exist?** Search by test ID or descriptive name.
2. **Read the test BODY** — not just the name, the actual assertions.
3. **Compare against TDD pseudo-code** — does the test body match the TDD assertions?
   ```
   TDD says:                          Test does:
   ────────                            ─────────
   Insert 226 methods                  ✓ Inserts 226 methods
   Verify count == 226                 ✓ assert_eq!(count, 226)
   Lookup by name returns correct      ✗ MISSING — no lookup test
   Lookup by unknown returns None      ✗ MISSING — no negative test
   ```
4. **Is the test runnable?** Not `#[ignore]`, not `// TODO`, not `skip()`, not `xit()`?
5. **Does it use the right infrastructure?** If TDD says "real harness", mocks are [FAIL].
6. **Does it cover the same edge cases?** If TDD specifies 3 assertions, test has 1 → [FAIL].

### Step 2.3: Mark Each Item

Update the inventory tables:
- `[PASS]` — implementation exists AND matches spec/TDD
- `[FAIL]` — missing, wrong, stubbed, or divergent
- `[PARTIAL]` — exists but incomplete (missing fields, missing assertions)

> **[PARTIAL] lifecycle:** Items marked [PARTIAL] are classified in Phase 4 (as INLINE_FIX, FIX_BEAD, or SPEC_QUESTION) and resolved in Phases 5-7. By Phase 9 final verification, all items should be either [PASS] or [FAIL] — treat any surviving [PARTIAL] as [FAIL].

### Subsystem Priority Order

1. Service/Business logic — most complex behavior
2. Event sourcing / State management — lifecycle correctness
3. CLI/RPC wiring — integration completeness
4. Test coverage — TDD assertion fidelity
5. Persistence — storage correctness
6. Ancillary (MCP, UI, adapters)

---

## Phase 3: Build + Test Gate

**Goal:** Ensure the codebase compiles and existing tests pass BEFORE classifying gaps.

### Step 3.1: Bootstrap Verification

If a bootstrap document exists:
1. Are bootstrap-specified tools/services available?
2. Do validation scripts pass?
3. Is the test environment configured as TDD bootstrap specifies?

### Step 3.2: Language-Specific Commands

**Rust:**
```bash
cargo check --all-targets 2>&1 | tee /tmp/audit-check.txt
cargo clippy --all-targets -- -D warnings 2>&1 | tee /tmp/audit-clippy.txt
cargo fmt --check 2>&1 | tee /tmp/audit-fmt.txt
cargo test 2>&1 | tee /tmp/audit-test.txt
grep "ignored" /tmp/audit-test.txt
```

**TypeScript:**
```bash
npx tsc --noEmit 2>&1 | tee /tmp/audit-tsc.txt
npx eslint . 2>&1 | tee /tmp/audit-lint.txt
npm test 2>&1 | tee /tmp/audit-test.txt
```

**Python:**
```bash
mypy . 2>&1 | tee /tmp/audit-mypy.txt
ruff check . 2>&1 | tee /tmp/audit-lint.txt
pytest 2>&1 | tee /tmp/audit-test.txt
```

**Go:**
```bash
go build ./... 2>&1 | tee /tmp/audit-build.txt
golangci-lint run 2>&1 | tee /tmp/audit-lint.txt
go test ./... 2>&1 | tee /tmp/audit-test.txt
```

### Step 3.3: Record Baseline

Total tests, passed, failed, ignored/skipped. This is the comparison point for post-fix verification.

### Step 3.4: Fix Build Failures

Any build/lint/test failure is a BLOCKER. Fix before proceeding to Phase 4. These fixes count as INLINE_FIX in the loop stats.

---

## Phase 4: Gap Classification

**Goal:** Triage every gap from Phase 2 into an actionable category.

For each [FAIL] or [PARTIAL] item:

| Classification | Criteria | Examples |
|---------------|----------|---------|
| **INLINE_FIX** | <30 min, localized, no architectural impact | Missing field, wrong type, missing assertion, missing error return |
| **FIX_BEAD** | >30 min, multi-file, coordinated changes | Missing test file, missing feature, architectural gap, new subsystem wiring |
| **SPEC_QUESTION** | Spec ambiguous, contradictory, or silent | "Handle gracefully" without error type, conflicting sections |

Build the gap table:
```
| # | Req/Test ID | Gap Description | Classification | Priority |
|---|------------|-----------------|----------------|----------|
| 1 | FR-2.1.1 | Missing `workspace_id` field | INLINE_FIX | HIGH |
| 2 | UT-REG-001 | Test file doesn't exist | FIX_BEAD | CRITICAL |
| 3 | FR-2.3.1 | "Handle gracefully" undefined | SPEC_QUESTION | — |
```

---

## Phase 5: Fix Inline Issues

**Goal:** Apply all INLINE_FIX items immediately.

### Execution

1. Group related inline fixes (same file, same subsystem)
2. Apply fixes
3. Re-run build + tests after each batch (per-subsystem or per-file group)
4. Verify no regressions
5. Log each fix in the remediation summary
6. Commit related fixes together with descriptive messages

### Priority Order

1. CRITICAL — core behavior, fake tests
2. HIGH — missing fields, wrong types
3. MEDIUM — missing edge cases, weak assertions

---

## Phase 6: Create Fix Beads

**Goal:** For each FIX_BEAD gap, create a self-contained fix bead.

### Fix Bead Structure

See TEMPLATES.md for the full fix bead template. Key elements:

1. **SOURCE OF TRUTH WARNING** — spec path, TDD path, original bead, finding
2. **Spec Requirement (verbatim)** — exact text from spec, copy/paste
3. **Required Changes** — specific files, functions, types
4. **TDD Tests to Satisfy** — test IDs + assertion pseudo-code from TDD
5. **Acceptance Criteria** — from spec, never invented

### Creating the Bead

```bash
# Create fix bead as child of original bead
br create --title "audit-fix: {gap}" --parent {original-bead-id} --tag audit-fix
# Write content to bead body
br update {new-bead-id} --body-file /tmp/fix-bead-content.md
```

---

## Phase 7: Execute Fix Beads

**Goal:** Implement each fix bead and verify it satisfies its acceptance criteria.

### Per Fix Bead:

1. Read the fix bead's full content
2. Implement the required changes
3. Run the specific TDD tests referenced in the bead
4. Verify acceptance criteria
5. Re-run build + test gate
6. Mark bead complete: `br update <bead-id> --status complete`
7. Commit the implementation

### Ordering

Execute fix beads in dependency order:
- Type definitions before behavior implementations
- Infrastructure before tests that need it
- Foundation before features that depend on it

---

## Phase 8: Re-Verify

**Goal:** Confirm fixes didn't introduce new gaps.

### Steps:

1. Run full build + test gate (all languages)
2. Re-read the fixed areas against spec — does the fix fully satisfy the requirement?
3. Check: did the fix introduce new gaps? (new failures, new drift in adjacent code)
4. **If new gaps found** → add to gap table → back to Phase 4
5. **If no new gaps** → continue to Phase 9

### Re-Verification Focus Areas

- Adjacent code affected by type changes
- Tests that may now assert wrong things due to changed types
- Integration points where a fix in one subsystem affects another

---

## Phase 9: Final Verification (Full Inventory Walk)

**Goal:** Walk the ENTIRE inventory from Phase 1. Every item must be [PASS].

### Steps:

1. For EACH spec requirement from Phase 1:
   - Re-check implementation against spec
   - Mark [PASS] or [FAIL]

2. For EACH TDD test from Phase 1:
   - Re-check test body against TDD assertions
   - Confirm test is runnable and passes
   - Mark [PASS] or [FAIL]

3. **If any [FAIL]** → back to Phase 4 with new gaps
4. **If ALL [PASS]** → continue to Phase 10

### Final Build Gate

Run one last full build + test suite. All must be green.

---

## Phase 10: Synthesis Report

**Goal:** Produce the structured completion report. See TEMPLATES.md for full format.

### Required Sections:

1. **Summary** — counts, percentages, verdict
2. **Spec Requirement Status** — per-requirement [PASS/FAIL/SPEC_QUESTION]
3. **TDD Test Status** — per-test [PASS/FAIL]
4. **Fix Beads Created** — bead ID, gap, status, iteration
5. **Inline Fixes Applied** — fix description, files, iteration
6. **SPEC_QUESTION Items** — requirement, question, needs human input
7. **Build & Test Status** — final green confirmation
8. **Loop History** — per-iteration gap counts and convergence
9. **Verdict** — COMPLETE or BLOCKED (with blocker list)

---

## Loop Mechanics

### Iteration Counting

- Iteration 0: Phases 1-3 (inventory + baseline)
- Iteration 1: First Phase 4-8 cycle
- Iteration 2+: Subsequent cycles if re-verification finds new gaps

### MAX_ITERATIONS Safety Valve

Default: 5 iterations. If the loop does not converge:
1. Stop the loop
2. Report all remaining [FAIL] items
3. Set verdict to BLOCKED with remaining gap list
4. Note: "Audit did not converge in {N} iterations — remaining gaps need manual review"

### Divergence Detection

If the gap count in iteration N+1 is **greater than** iteration N (fixes creating more gaps than they resolve):
1. **PAUSE** — do not blindly continue the loop
2. Investigate root cause: are fixes touching shared types that break downstream code? Is the spec internally contradictory?
3. Consider re-classifying remaining gaps (some FIX_BEAD items may need to be SPEC_QUESTION)
4. If root cause is architectural (fixes cascade), batch related fixes into a single coordinated fix bead
5. Document the divergence in the Loop History with a note

### Context Management for Multi-Session

If context fills during a long audit:
1. Save current loop state: iteration number, completed phases, gap table, fix log
2. State exact resume point: "Resume at Phase {N}, iteration {M}, subsystem {X}"
3. Next session: reload loop state, continue from resume point

---

## SPEC_QUESTION Handling

When the spec is ambiguous:

1. **Do NOT guess or make assumptions**
2. Log the exact ambiguity (see TEMPLATES.md for format)
3. **Continue auditing other areas** — don't block on one question
4. Include in final report
5. These require human input before audit can reach 100%

---

## Troubleshooting

### Large Codebases
Read files in 300-500 line chunks using offset/limit. Prioritize by subsystem importance.

### Mixed-Language Projects
Run all applicable toolchains. Rust feature code + TypeScript E2E is common.

### Flaky Tests
Run 3x. Fails 2/3 = real failure. Fails 1/3 = flag as flaky.

### No Beads CLI
If neither `br` nor `bd` is available, create fix notes in the audit report instead of fix beads. The audit loop still finds and fixes inline issues.
