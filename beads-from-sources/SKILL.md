---
name: beads-from-sources
description: Create executable beads directly from 3 Source of Truth documents (Spec, TDD, Strategy). Embeds spec and TDD content verbatim into self-contained beads. Strategy provides ordering only — never content. Eliminates spec drift from intermediate plan documents.
---

# Beads From Sources

This skill creates executable **beads** directly from 3 Source of Truth documents. Beads embed spec and TDD content **verbatim** — no intermediate plan document that can drift.

## The 3-SOT Model

```
┌─────────────────────────┐     ┌─────────────────────────┐
│      Spec (SOT #1)      │     │      TDD (SOT #2)       │
│       (WHAT)            │     │    (HOW TO VERIFY)      │
│                         │     │                         │
│  Every requirement,     │     │  Every test with full   │
│  acceptance criteria,   │     │  assertions. Coverage   │
│  architecture details.  │     │  matrix: req → tests.   │
│  PRIMARY content source │     │  PRIMARY content source │
└────────────┬────────────┘     └────────────┬────────────┘
             │                               │
             └──────────────┬────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Strategy (SOT #3)     │
              │    (WHAT ORDER)         │
              │                         │
              │  Phase ordering, deps,  │
              │  domain batches, gate   │
              │  criteria. ~500-800     │
              │  lines. ORDERING ONLY.  │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │        Beads            │
              │     (EXECUTION)         │
              │                         │
              │  Self-contained tasks.  │
              │  Content from spec+TDD. │
              │  Order from strategy.   │
              └─────────────────────────┘
```

**Spec = WHAT** to build (PRIMARY — all content comes from here)
**TDD = HOW TO VERIFY** (PRIMARY — all test definitions come from here)
**Strategy = WHAT ORDER** (ORDERING ONLY — determines bead structure, never content)

## Source of Truth Hierarchy

1. **Spec** (PRIMARY) — Requirements, acceptance criteria, architecture, implementation details
2. **TDD + Bootstrap** (PRIMARY) — Test definitions with full assertions, coverage matrix, bootstrap scripts
3. **Strategy** (ORDERING ONLY) — Phase ordering, domain batches, gate criteria, dependency graph

**The strategy is NOT a content source.** It determines which beads exist, their grouping, and their dependencies. It never provides requirement text, implementation details, or test definitions.

## Critical Principles

1. **Spec content is embedded verbatim** — Quote directly from the spec with section citations. Never paraphrase or editorialize.
2. **TDD tests are embedded with full assertions** — Each bead includes its test IDs and the complete pseudo-code/assertions from the TDD doc.
3. **Strategy provides structure only** — Phase grouping, ordering, dependencies, and gate criteria. Zero content.
4. **No post-MVP scoping** — If it's in the spec, it must be in a bead. To exclude something, remove it from the spec FIRST.
5. **Coverage verification is mandatory** — After bead creation, verify: every spec requirement is in a bead, every TDD test is assigned to a bead.
6. **Beads are fully self-contained** — An agent picks up a bead and has everything needed to execute without reading any other document (though the SOT WARNING tells them where to look for clarification).

## When to Use This Skill

- You have a spec, TDD, and strategy document (from the 3-SOT pipeline)
- You need to create executable beads from those documents
- You want to eliminate spec drift from intermediate plan documents

## What You Need

Before invoking this skill, ensure you have:

1. **Required:** Spec document — contains all requirements, acceptance criteria, architecture
2. **Required:** TDD document — contains all test definitions with full assertions and coverage matrix
3. **Required:** Strategy document (from `spec-to-strategy`) — contains phase ordering, domain batches, gate criteria
4. **Required:** Access to the `bd` CLI tool (or `br` if preferred)

## Core Methodology (Summary)

| Phase | What | Source |
|-------|------|--------|
| 0. Preparation | Gather and verify all 3 SOT docs | — |
| 1. Spec + TDD Analysis | Build requirement inventory + test inventory | Spec, TDD |
| 2. Strategy Analysis | Extract phase structure, ordering, gates | Strategy |
| 3. Hierarchy Design | Map strategy phases → epic hierarchy + bead grouping | Strategy |
| 4. Bead Creation | Embed spec + TDD content into each bead | Spec, TDD, Strategy |
| 5. Coverage Verification | Every req covered? Every test assigned? | Spec, TDD |
| 6. Quality Check | Self-contained? Agent-executable? No drift? | All |

See **METHODOLOGY.md** for the complete step-by-step process.

## Quick Start

### 1. Gather All Inputs

```bash
# Required — your 3 Source of Truth documents:
{spec_path}          # SOT #1: What to build (PRIMARY)
{tdd_path}           # SOT #2: How to verify (PRIMARY)
{strategy_path}      # SOT #3: What order (ORDERING ONLY)
```

### 2. Build Inventories

Read the spec cover-to-cover. Build a **requirement inventory**:
```
REQ-001: §3.1 — Agent entity with lifecycle tracking
REQ-002: §3.2 — Session entity with message history
REQ-003: §4.1 — Agent service CRUD operations
...
```

Read the TDD cover-to-cover. Build a **test inventory**:
```
UT-FR-001: Agent registration validation (§3.1)
UT-FR-002: Session creation with defaults (§3.2)
IT-SVC-001: Agent service integration (§4.1)
E2E-001: Full agent lifecycle flow
...
```

### 3. Map Strategy → Bead Structure

Read the strategy for phase ordering. This determines bead GROUPING, not bead CONTENT:
```
Phase 1: Bootstrap (REQ-001, REQ-002) → Tests: UT-FR-001, UT-FR-002
Phase 2: Services (REQ-003, REQ-004) → Tests: IT-SVC-001, IT-SVC-002
Phase 3: Integration + QA Gate       → Tests: E2E-001, E2E-002
```

### 4. Create Beads with `bd` CLI

```bash
# Create root epic
bd create "Feature Implementation" --type epic

# Create phase epic (parent to root)
bd create "Phase 1: Bootstrap" --type epic --parent <root-id>

# Create tasks with EMBEDDED spec + TDD content
bd create "Agent Entity Types" --type task --parent <phase-id>
bd update <task-id> --deps <prerequisite-id>
bd update <task-id> --labels "phase-1,spec-3.1"
```

### 5. Verify Coverage

```bash
# List all beads
bd list --json

# Check: every spec requirement is covered
# Check: every TDD test ID is assigned
# Check: no orphaned requirements or tests
```

## Supporting Files

- **METHODOLOGY.md** — Complete 7-phase process with detailed steps
- **TEMPLATES.md** — Bead templates with SOURCE OF TRUTH WARNING
- **EXAMPLES.md** — Real examples showing verbatim spec + TDD embedding

## Workflow Integration

```
spec-to-strategy  →  beads-from-sources  →  bead-plan-audit  →  beads-to-execution
(creates routing      (creates beads from     (audits beads for    (prepares agents
 table from spec       spec + TDD directly,    drift & gaps —       for execution)
 + TDD)                strategy for ordering)  RECOMMENDED)
```

**Previous:** `spec-to-strategy` — Creates the lightweight strategy routing table
**Next (recommended):** `bead-plan-audit` — Audits beads for spec drift, coverage gaps, and quality before execution
**Next (after audit):** `beads-to-execution` — Prepares kickoff prompt and active-plan for agent execution

---

## Next Stage Kickoff Prompt

After completing this skill, copy the prompt below to kick off the next stage:

```
Use the **beads-to-execution** skill.

- Spec: `{spec_path}` (SOURCE OF TRUTH)
- TDD: `{tdd_path}` (TEST SPECIFICATIONS)
- Strategy: `{strategy_path}` (ORDERING REFERENCE)
- Beads: `.beads/issues.jsonl`
- Feature name: `{feature_name}`

Beads have been created. Prepare kickoff prompt and active-plan.yaml for agent execution.
Output: `docs/plan-hub/prompts/{feature}-kickoff.md`
```

**Fill in the placeholders** with your actual paths before pasting.

> **IMPORTANT:** After `beads-to-execution` completes, the agent must **STOP**
> and report to the human. Execution requires explicit human authorization.

---

## Best Practices

- Every bead MUST include a SOURCE OF TRUTH WARNING pointing to spec + TDD + strategy
- Embed spec content **verbatim** with section citations — never paraphrase
- Embed TDD test IDs with their **full assertions/pseudo-code** — not just IDs
- Strategy is ordering context ONLY — never copy content from it into beads
- QA gate beads must embed the complete TDD test specifications for their scope
- Run coverage verification BEFORE declaring beads complete
- If a spec requirement has no bead, that's a bug — fix it, don't scope it out
- If a TDD test has no bead assignment, that's a bug — assign it
