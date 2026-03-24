# Beads From Sources — Methodology

A complete step-by-step guide for creating executable beads directly from Spec, TDD, and Strategy documents.

---

## Critical Concept: 3-SOT Content Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                          BEAD CONTENT SOURCES                               │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  FROM SPEC (PRIMARY — verbatim):                                            │
│  ├── Requirements with acceptance criteria                                   │
│  ├── Architecture details and integration points                             │
│  ├── Data models, APIs, type definitions                                     │
│  └── Edge cases, constraints, gotchas                                        │
│                                                                              │
│  FROM TDD (PRIMARY — verbatim):                                             │
│  ├── Test IDs mapped to this bead's scope                                    │
│  ├── Full pseudo-code with assertions                                        │
│  ├── Coverage matrix (which req → which test)                                │
│  └── Bootstrap/setup requirements                                            │
│                                                                              │
│  FROM STRATEGY (ordering context only):                                      │
│  ├── Phase grouping (which phase is this bead in?)                           │
│  ├── Dependencies (what must complete first?)                                │
│  └── Gate criteria (what does this phase's QA gate check?)                   │
│                                                                              │
│  NEVER FROM STRATEGY:                                                        │
│  ├── Requirement text (that's in the spec)                                   │
│  ├── Implementation details (that's in the spec)                             │
│  ├── Test definitions (that's in the TDD)                                    │
│  └── Effort estimates (not in beads at all)                                  │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 0: Preparation

### Step 0.1: Gather All Materials

```bash
# Required — your 3 Source of Truth documents:
{spec_path}          # SOT #1: Spec — requirements, architecture, acceptance criteria
{tdd_path}           # SOT #2: TDD — test definitions, coverage matrix, bootstrap
{strategy_path}      # SOT #3: Strategy — phase ordering, batches, gates (~500-800 lines)
```

Checklist:
- [ ] Spec document exists and is complete (all requirements have acceptance criteria)
- [ ] TDD document exists with full test assertions (not stubs)
- [ ] TDD coverage matrix maps every spec requirement to test IDs
- [ ] Strategy document exists (from `spec-to-strategy` skill)
- [ ] Strategy is a lightweight routing table, NOT a full plan with task descriptions
- [ ] Access to the `bd` (or `br`) CLI tool

### Step 0.2: Verify Source Document Quality

Before proceeding, spot-check:

**Spec quality:**
- Requirements have IDs (e.g., FR-2.1.1, SC-003)
- Acceptance criteria are testable
- Architecture sections describe integration patterns

**TDD quality:**
- Tests have IDs (e.g., UT-REG-001, IT-SVC-003, E2E-FLOW-001)
- Each test has full pseudo-code with assertions (not just a title)
- Coverage matrix links spec requirements ↔ test IDs

**Strategy quality:**
- Phases are ordered with clear dependencies
- Domain batches group related work
- Gate criteria define what passes/fails between phases
- NO task descriptions, effort estimates, or spec content duplicated

### Step 0.3: Understand the Beads System

**Beads** is a dependency-aware task tracking system:
- Tasks stored in `.beads/issues.jsonl` (JSONL format)
- CLI tool `bd` (or `br`) for creating and managing tasks
- Viewer tool `bv` for analyzing task graphs

**Key bd Commands:**
```bash
bd create "Title" --type <type>         # Create task
bd update <id> --deps <dep-id>          # Add dependency
bd update <id> --labels "label1,label2" # Add labels
bd update <id> --status <status>        # Update status
bd list --json                          # List all tasks
bd ready --json                         # List ready tasks (no blockers)
bd show <id> --json                     # Show task details
```

**Task Types:**
- `epic` — Container for related tasks (phase or feature grouping)
- `task` — Atomic unit of work

---

## Phase 1: Spec + TDD Analysis

This is the most important phase. You must understand the CONTENT before designing the STRUCTURE.

### Step 1.1: Read the Spec — Build Requirement Inventory

Read the spec document cover-to-cover. Build a complete **requirement inventory**:

```
REQUIREMENT INVENTORY
=====================

§3 — Domain Model
  REQ-3.1: Agent entity with lifecycle states (Pending, Active, Suspended, Terminated)
  REQ-3.2: Session entity with message history and agent assignment
  REQ-3.3: Workspace entity with project isolation

§4 — Service Layer
  REQ-4.1: Agent service — register, list, get, updateStatus, delete
  REQ-4.2: Session service — create, list, get, addMessage, close
  ...

§5 — API Layer
  REQ-5.1: REST endpoints for agent CRUD
  REQ-5.2: REST endpoints for session management
  REQ-5.3: WebSocket endpoint for real-time updates
  ...

TOTAL: {N} requirements
```

**Create a spec section map** for cross-referencing:
```
{spec_path}
├── §1 — Vision and Overview
├── §2 — Technical Stack
├── §3 — Domain Model
│   ├── §3.1 — Agent Entity
│   ├── §3.2 — Session Entity
│   └── §3.3 — Workspace Entity
├── §4 — Service Layer
│   ├── §4.1 — Agent Service
│   └── §4.2 — Session Service
└── §5 — API Layer
    ├── §5.1 — REST Endpoints
    └── §5.2 — WebSocket
```

### Step 1.2: Read the TDD — Build Test Inventory

Read the TDD document cover-to-cover. Build a complete **test inventory**:

```
TEST INVENTORY
==============

Unit Tests (UT):
  UT-AG-001: Agent registration creates valid entity (§3.1)
  UT-AG-002: Agent status transitions follow state machine (§3.1)
  UT-SS-001: Session creation with defaults (§3.2)
  UT-SS-002: Message append preserves ordering (§3.2)
  ...

Integration Tests (IT):
  IT-SVC-001: Agent service full CRUD cycle (§4.1)
  IT-SVC-002: Session service with message persistence (§4.2)
  ...

E2E Tests (E2E):
  E2E-FLOW-001: Agent lifecycle from creation to termination
  E2E-FLOW-002: Session with real-time message delivery
  ...

TOTAL: {N} tests ({X} UT + {Y} IT + {Z} E2E)
```

### Step 1.3: Cross-Reference — Requirements ↔ Tests

Use the TDD coverage matrix (or build one) to verify completeness:

| Spec Requirement | Test IDs | Coverage |
|-----------------|----------|----------|
| REQ-3.1 (Agent entity) | UT-AG-001, UT-AG-002, IT-SVC-001 | 3 tests |
| REQ-3.2 (Session entity) | UT-SS-001, UT-SS-002, IT-SVC-002 | 3 tests |
| REQ-4.1 (Agent service) | IT-SVC-001, E2E-FLOW-001 | 2 tests |
| REQ-5.1 (REST endpoints) | IT-API-001, E2E-FLOW-001 | 2 tests |

**Flag any gaps:**
- Requirements with zero tests → TDD is incomplete (fix TDD first, or note for audit)
- Tests with no requirement → orphaned test (verify or remove)

---

## Phase 2: Strategy Analysis

The strategy is read ONLY for structural information. Do not copy content from it.

### Step 2.1: Extract Phase Structure

From the strategy, identify:
- **Phase names and order** (e.g., Phase 1 → Phase 2 → Phase 3)
- **Domain batches** (which requirements are grouped together)
- **Parallel vs sequential** (which phases can overlap)
- **Gate criteria** (what must pass to advance)

```
PHASE STRUCTURE (from strategy)
===============================

Phase 1: Bootstrap (sequential)
  Domain batch: §3 (entities, types, schema)
  Requirements: REQ-3.1, REQ-3.2, REQ-3.3
  Gate: All entity types compile, schema migrates

Phase 2: Services (sequential, depends on Phase 1 gate)
  Domain batch: §4 (service layer)
  Requirements: REQ-4.1, REQ-4.2
  Gate: All service CRUD operations pass integration tests

Phase 3: API + Integration (depends on Phase 2 gate)
  Domain batch: §5 (API layer)
  Requirements: REQ-5.1, REQ-5.2, REQ-5.3
  Gate: Full E2E flows pass, WebSocket connects
```

### Step 2.2: Map Requirements → Phases

Build the assignment table — which requirements go in which phase:

| Phase | Requirements | TDD Tests |
|-------|-------------|-----------|
| Phase 1 | REQ-3.1, REQ-3.2, REQ-3.3 | UT-AG-001..002, UT-SS-001..002 |
| Phase 2 | REQ-4.1, REQ-4.2 | IT-SVC-001..002 |
| Phase 3 | REQ-5.1, REQ-5.2, REQ-5.3 | IT-API-001, E2E-FLOW-001..002 |

**Verify completeness:**
- Every requirement from Phase 1 inventory appears in exactly one phase
- Every test from Phase 1 inventory is assigned to at least one phase
- No requirement is "scoped out" — if it's in the spec, it must be in a phase

---

## Phase 3: Hierarchy Design

### Step 3.1: Map Strategy Phases → Epic Hierarchy

```
EPIC: {project-name}-epic
│     (root — all SOT docs referenced)
│
├── EPIC: phase1-{domain}-epic
│   │     (Phase 1 from strategy)
│   │
│   ├── TASK: phase1-{subtask1}-task   (REQ-3.1 → UT-AG-001, UT-AG-002)
│   ├── TASK: phase1-{subtask2}-task   (REQ-3.2 → UT-SS-001, UT-SS-002)
│   └── QA-GATE: phase1-qa-gate       (gate criteria from strategy)
│
├── EPIC: phase2-{domain}-epic
│   │     (Phase 2 from strategy)
│   │
│   ├── TASK: phase2-{subtask1}-task   (REQ-4.1 → IT-SVC-001)
│   ├── TASK: phase2-{subtask2}-task   (REQ-4.2 → IT-SVC-002)
│   └── QA-GATE: phase2-qa-gate
│
├── EPIC: phase3-{domain}-epic
│   └── ...
```

### Step 3.2: Determine Bead Granularity

Each bead should be a **single coherent unit of work** that:
- Covers 1-3 related spec requirements
- Has a clear set of TDD tests to verify it
- Can be implemented in a single session by one agent
- Has clear file boundaries (which files to create/modify)

**Too coarse:** A bead covering an entire subsystem (too much for one agent session)
**Too fine:** A bead for a single function (not enough context, too many dependencies)
**Right size:** A bead covering one service + its tests, or one component + its integration

### Step 3.3: Define Dependencies

**Within Phase:**
- Parallel beads: no dependencies on each other
- Sequential beads: chain via `deps` field
- QA gate: depends on ALL beads in its phase

**Between Phases:**
- First bead of Phase N depends on QA gate of Phase N-1
- Unless strategy explicitly allows overlap (parallel phases)

```
phase1-types ─┬─> phase1-schema ─┬─> phase1-qa-gate
phase1-utils ─┘                  │
                                 ↓
phase2-service1 ─┬─> phase2-qa-gate
phase2-service2 ─┘
```

---

## Phase 4: Bead Creation

### Step 4.1: Write the SOURCE OF TRUTH WARNING

Every bead MUST start with this warning:

```markdown
## SOURCE OF TRUTH WARNING

This bead is a quick-reference derived from:
- **Spec**: `{spec_path}` — §{section} (PRIMARY — read this first)
- **TDD**: `{tdd_path}` — {test_ids} (PRIMARY — test definitions here)
- **Strategy**: `{strategy_path}` — Phase {N} (ordering context only)

Before implementing, you MUST read the referenced spec and TDD sections directly.
This bead embeds key excerpts but the full documents are authoritative.
```

### Step 4.2: Embed Spec Content Verbatim

For each bead, extract the relevant spec sections and embed them **verbatim**:

```markdown
## Spec Requirements

### From §{section}: {Section Title}

> {Direct quote from spec — copy-paste, do not paraphrase}

**Acceptance Criteria** (from spec §{section}):
1. {AC-1 — verbatim from spec}
2. {AC-2 — verbatim from spec}
3. {AC-3 — verbatim from spec}
```

**Rules:**
- Use blockquotes (`>`) for direct quotes
- Cite the exact section (§3.1, not "section 3")
- Include ALL acceptance criteria — do not summarize or truncate
- If the spec section is very long (>200 lines), embed the core requirements and add: "See spec §{section} for complete details including {what's omitted}"

### Step 4.3: Embed TDD Tests with Full Assertions

For each bead, include the assigned test IDs with their **complete pseudo-code**:

```markdown
## Tests To Pass

### {test_id}: {Test Title}
**Priority:** {P0/P1/P2} | **Type:** {UT/IT/E2E} | **Subsystem:** {subsystem}

```{language}
// Full pseudo-code from TDD document — copy verbatim
describe('{test suite}', () => {
  it('{test name}', () => {
    // Setup
    const input = createTestInput({ ... });

    // Execute
    const result = service.execute(input);

    // Assert
    expect(result.status).toBe('active');
    expect(result.id).toMatch(/^agent-/);
    expect(result.createdAt).toBeInstanceOf(Date);
  });
});
```

**Expected Output:** {what success looks like}
**False Positive Prevention:** {how to avoid false passes}
```

### Step 4.4: Add Implementation Context

From the spec's architecture sections, add:

```markdown
## Implementation Details

### Files to Create/Modify
- `{path/to/file1}` — {what to create/change}
- `{path/to/file2}` — {what to create/change}

### Architecture Context (from spec §{arch_section})
- {Integration point 1}
- {Integration point 2}
- {Key constraint or pattern}

### Dependencies
- **Blocks:** {bead_ids this bead blocks}
- **Blocked by:** {bead_ids that must complete first}
- **Phase:** {N} — {phase name from strategy}
```

### Step 4.5: Add Acceptance Criteria and Verification

```markdown
## Acceptance Criteria

1. {AC from spec — verbatim}
2. {AC from spec — verbatim}
3. All tests pass: {list test IDs}

## Gotchas & Anti-Patterns

1. {Known issue from spec or TDD}
2. {Common mistake to avoid}
```

### Step 4.6: Create Root and Phase Epics

Root epic references all 3 SOT docs. Phase epics reference their scope within each doc.

### Step 4.7: Create QA Gate Beads

QA gates embed the gate criteria from the strategy AND the E2E/integration tests from the TDD:

```markdown
## Phase {N} QA Gate

### Gate Criteria (from strategy)
- {criterion 1}
- {criterion 2}

### Tests to Execute
{embed all IT and E2E tests scoped to this phase, with full assertions}
```

### Step 4.8: Execute bd Commands

```bash
# Create root epic
bd create "{Project} Implementation" --type epic

# Create phase epics
bd create "Phase 1: {Domain}" --type epic --parent <root-id>

# Create task beads (each gets the full description from steps 4.1-4.5)
bd create "{Task Title}" --type task --parent <phase-id>
bd update <task-id> --deps <prerequisite-id>
bd update <task-id> --labels "phase-1,{domain},{spec-section}"

# Create QA gates
bd create "Phase 1 QA Gate" --type task --parent <phase-id>
bd update <qa-id> --deps <all-phase-task-ids>
bd update <qa-id> --labels "phase-1,qa-gate"

# Link phases
bd update <phase2-first-task> --deps <phase1-qa-gate>
```

---

## Phase 5: Coverage Verification

This phase is **mandatory**. Do not skip it.

### Step 5.1: Verify Spec Requirement Coverage

Check every requirement from Phase 1 inventory:

```
SPEC COVERAGE CHECK
===================

REQ-3.1 → bd-{id}.1.1 (phase1-agent-types)     ✓
REQ-3.2 → bd-{id}.1.2 (phase1-session-types)    ✓
REQ-3.3 → bd-{id}.1.3 (phase1-workspace-types)  ✓
REQ-4.1 → bd-{id}.2.1 (phase2-agent-service)    ✓
REQ-4.2 → bd-{id}.2.2 (phase2-session-service)  ✓
REQ-5.1 → bd-{id}.3.1 (phase3-rest-api)         ✓
REQ-5.2 → bd-{id}.3.1 (phase3-rest-api)         ✓
REQ-5.3 → bd-{id}.3.2 (phase3-websocket)        ✓

Coverage: {N}/{N} requirements covered (100%)
UNCOVERED: {list any gaps}
```

**If any requirement is uncovered:** Create a bead for it. Do NOT scope it out.

### Step 5.2: Verify TDD Test Assignment

Check every test ID from Phase 1 inventory:

```
TDD COVERAGE CHECK
==================

UT-AG-001 → bd-{id}.1.1    ✓
UT-AG-002 → bd-{id}.1.1    ✓
UT-SS-001 → bd-{id}.1.2    ✓
UT-SS-002 → bd-{id}.1.2    ✓
IT-SVC-001 → bd-{id}.2.1   ✓
IT-SVC-002 → bd-{id}.2.2   ✓
E2E-FLOW-001 → bd-{id}.3.3 (qa-gate)  ✓
E2E-FLOW-002 → bd-{id}.3.3 (qa-gate)  ✓

Coverage: {N}/{N} tests assigned (100%)
UNASSIGNED: {list any gaps}
```

**If any test is unassigned:** Assign it to the appropriate bead. Do NOT leave orphaned tests.

### Step 5.3: Verify No Drift

For each bead, spot-check:
- [ ] Acceptance criteria in the bead match the spec verbatim (no editorial changes)
- [ ] Test assertions in the bead match the TDD verbatim (no simplified versions)
- [ ] No claims in the bead that aren't traceable to the spec
- [ ] No "post-MVP" or "future work" scoping that removes spec requirements

### Step 5.4: Coverage Gate (BLOCKER)

**This is a hard gate. Do NOT proceed to Phase 6 until all three conditions pass:**

1. **Spec coverage = 100%** — The denominator MUST equal the Phase 1 requirement inventory total. Every requirement has at least one bead.
2. **TDD coverage = 100%** — The denominator MUST equal the Phase 1 test inventory total. Every test is assigned to at least one bead.
3. **No drift detected** — Step 5.3 spot-check found zero drift.

If any condition fails, **STOP** and fix before continuing:
- Uncovered requirement → create a new bead or expand an existing bead's scope
- Unassigned test → assign to the most relevant bead (cross-cutting tests → QA gate)
- Drift detected → rewrite the drifted content from spec/TDD verbatim

**This gate is non-negotiable.** An incomplete or drifted bead set is worse than no beads — it gives false confidence that everything is covered when it isn't.

---

## Phase 6: Quality Check

### Step 6.1: Self-Containment Check

For each bead, verify:
- [ ] An agent can execute this bead without reading any other bead
- [ ] SOURCE OF TRUTH WARNING is present and accurate
- [ ] Spec references are specific (§3.1, not "the spec")
- [ ] TDD test IDs are listed with full assertions
- [ ] Files to create/modify are explicitly listed
- [ ] Dependencies are correctly set

### Step 6.2: Structural Check

```bash
# List all beads
bd list --json

# Verify hierarchy
bv --robot-insights

# Check ready queue (should show only entry-point beads)
bd ready --json
```

### Step 6.3: Summary Statistics

Report:
- Total beads: {N} ({X} epics + {Y} tasks + {Z} QA gates)
- Spec coverage: {N}/{N} requirements (should be 100%)
- TDD coverage: {N}/{N} tests assigned (should be 100%)
- Min/Max/Avg bead size (chars)
- Any thin beads (<5000 chars) — verify they're scope-appropriate

---

## Common Patterns

### Pattern: Parallel Tasks (Different Spec Sections)

Tasks from different spec sections with no shared dependencies:
```
phase1-agents (§3.1)    ─┐
phase1-sessions (§3.2)  ─┼─> phase1-qa-gate
phase1-workspace (§3.3) ─┘
```

### Pattern: Sequential Tasks (Layered Dependencies)

Tasks where output feeds into input:
```
phase1-types (§3) → phase1-schema (§3+arch) → phase1-service (§4) → phase1-qa-gate
```

### Pattern: Fork-Join (Shared Foundation)

Multiple tasks depend on a shared prerequisite:
```
                     ┌─> phase2-agent-svc (§4.1)   ─┐
phase1-qa-gate ─────┼─> phase2-session-svc (§4.2)  ─┼─> phase2-qa-gate
                     └─> phase2-workspace-svc (§4.3) ─┘
```

---

## Troubleshooting

### "Spec requirement not covered"
- Create a bead for it. Never scope it out.
- If it genuinely shouldn't be built, fix the spec FIRST.

### "TDD test has no bead"
- Assign it to the most relevant bead.
- If it's a cross-cutting test (e.g., E2E), assign to the QA gate.

### "Bead too large"
- Split into multiple beads along spec section boundaries.
- Each sub-bead gets its own test subset.

### "Bead too thin"
- Merge with an adjacent bead if they share spec sections.
- Or verify it's legitimately thin (e.g., configuration, wiring).

### "Strategy has task descriptions"
- Ignore them. Use spec content only.
- The strategy should only provide ordering context.
- If the strategy contains detailed task descriptions, treat it as a plan document and flag for refactoring.
