---
name: master-workflow
description: Master guide for the 3-SOT implementation pipeline. Orchestrates research-to-spec, spec-to-tdd, strategy creation, beads-from-sources, bead-plan-audit, beads-to-execution, and bead-completion-audit with drift checks at every stage.
---

# Master Workflow Skill — 3-SOT Pipeline

> Orchestrates the complete feature implementation pipeline using the **3 Source of Truth** model. Each stage produces a SOT document; beads derive from all three. Drift is checked at every transition.

## When to Use This Skill

Use this skill when:
- Starting a new feature implementation from scratch
- Unsure which skill to use next in the pipeline
- Need to understand the 3-SOT implementation workflow
- Onboarding to how the skill pipeline works
- Recovering from a stuck or confused state

**Trigger phrases:**
- "Guide me through the master workflow"
- "What skill should I use next?"
- "Start implementation for [feature]"
- "Walk me through the 3-SOT pipeline"
- "Help me understand the implementation pipeline"

---

## Key Principles

1. **If it's in the spec, it ships.** No downstream document gets to make scope cuts. If something shouldn't ship, remove it from the spec first.
2. **Beads embed, don't paraphrase.** Spec and TDD content appears verbatim in beads, not rewritten through an intermediary.
3. **Strategy is ordering, not content.** It says what order to build, not what to build. All content lives in Spec and TDD.
4. **Every optimization pass is a drift check.** Not internal consistency — alignment with the SOT documents above it.
5. **Two mandatory stops.** Before execution (Phase 4 -> 5) and before audit (Phase 5 -> 6). Human authorization required at both.
6. **Spec wins all conflicts.** If spec and TDD disagree, fix the TDD to match spec. If spec and strategy disagree, fix the strategy. Flag every discrepancy.
7. **Flag ambiguity, don't guess.** If a spec requirement is unclear, flag it for human resolution. Never interpret ambiguity silently — that's how drift enters.
8. **Existing code doesn't expand scope.** During execution, only the spec determines what to build. Existing codebase patterns are not license to add work beyond spec.

---

## The 3-SOT Pipeline

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       3-SOT IMPLEMENTATION PIPELINE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 0: SPEC      │   [research-to-spec] skill                         │
│  │  ─────────────────  │                                                    │
│  │  Research doc        │   Output: Spec (SOT #1) + Architecture             │
│  │       ↓              │   -> Optimization: drift check vs research         │
│  │  Spec + Arch         │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 1: TDD       │   [spec-to-tdd] skill                              │
│  │  ─────────────────  │                                                    │
│  │  Spec                │   Output: TDD + Bootstrap (SOT #2)                 │
│  │       ↓              │   -> Optimization: every requirement has test      │
│  │  TDD + Bootstrap     │     coverage (drift check vs spec)                 │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 2: STRATEGY  │   [spec-to-strategy] skill                         │
│  │  ─────────────────  │                                                    │
│  │  Spec + TDD          │   Output: Implementation Strategy (SOT #3)        │
│  │       ↓              │   -> Optimization: every spec section maps to a   │
│  │  Strategy doc        │     phase (drift check vs spec + TDD)              │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 3: BEADS     │   [beads-from-sources] skill                             │
│  │  ─────────────────  │                                                    │
│  │  Spec + TDD +        │   Output: Self-contained beads                    │
│  │  Strategy             │   -> Audit: [bead-plan-audit] with spec drift    │
│  │       ↓              │     detection                                      │
│  │  Executable Beads    │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 4: KICKOFF   │   [beads-to-execution] skill                       │
│  │  ─────────────────  │                                                    │
│  │  Beads + 3 SOTs      │   Output: Kickoff prompt + status file            │
│  │       ↓              │                                                    │
│  │  Agent-Ready State   │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│  ═══════════╪═══════════════════════════════════════════════════════════    │
│             │  MANDATORY STOP #1 -- HUMAN AUTHORIZATION REQUIRED            │
│  ═══════════╪═══════════════════════════════════════════════════════════    │
│             │                                                               │
│             ▼  (REQUIRES: Human confirmation OR new session)                │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 5: EXECUTE   │   NOT part of master workflow -- HUMAN INITIATED   │
│  │  ─────────────────  │                                                    │
│  │  * Pick ready bead  │   Key activities:                                  │
│  │  * Implement         │   * Read spec+TDD for each bead (not strategy)    │
│  │  * Verify & commit   │   * AgentMail for coordination                    │
│  │  * Repeat            │   * bd update for progress                        │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│  ═══════════╪═══════════════════════════════════════════════════════════    │
│             │  MANDATORY STOP #2 -- HUMAN TRIGGERS AUDIT                    │
│  ═══════════╪═══════════════════════════════════════════════════════════    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 6: AUDIT     │   [bead-completion-audit] skill -- HUMAN TRIGGERED │
│  │  ─────────────────  │                                                    │
│  │  * Spec drift check  │   Key activities:                                 │
│  │  * Test coverage     │   * Deep codebase exploration                     │
│  │  * Implementation    │   * Git diff analysis per bead                    │
│  │    quality check     │   * REOPEN -> FIX -> CLOSE lifecycle              │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 7: COMPLETE  │   Feature Done                                     │
│  │  ─────────────────  │                                                    │
│  │  QA gates passed     │                                                    │
│  │  Audit passed        │                                                    │
│  └─────────────────────┘                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase Summary

| Phase | Skill | SOT Produced | Outputs |
|-------|-------|-------------|---------|
| **0: Spec** | `research-to-spec` | SOT #1: Spec | Spec + Architecture doc |
| -- | optimization pass | -- | Drift check vs research findings |
| **1: TDD** | `spec-to-tdd` | SOT #2: TDD | TDD + Bootstrap doc |
| -- | optimization pass | -- | Drift check vs spec (every req has tests) |
| **2: Strategy** | `spec-to-strategy` | SOT #3: Strategy | Implementation Strategy (~500-800 lines) |
| -- | optimization pass | -- | Drift check vs spec + TDD |
| **3: Beads** | `beads-from-sources` | -- | Self-contained beads (from all 3 SOTs) |
| -- | `bead-plan-audit` | -- | Spec drift detection + bead improvements |
| **4: Kickoff** | `beads-to-execution` | -- | Kickoff prompt + status file |
| **STOP #1** | Report to human | -- | Wait for authorization |
| **5: Execute** | Agent loop (HUMAN INITIATED) | -- | Commits, artifacts, TDD passes |
| **STOP #2** | Report to human | -- | Wait for audit trigger |
| **6: Audit** | `bead-completion-audit` (HUMAN TRIGGERED) | -- | Findings doc, fixes |
| **7: Complete** | (finish) | -- | Feature shipped |

> **Invocation names:** Use `spec-to-strategy` for Phase 2 and `beads-from-sources` for Phase 3. These are the actual skill names.

---

## Source of Truth Hierarchy

```
┌─────────────────────────────────────────────────────┐
│  SPEC (SOT #1) -- WHAT to build                     │
│  ───────────────────────────────────────────────    │
│  * Every requirement. No shortcuts.                  │
│  * If it's in the spec, it ships.                    │
│  * If something shouldn't ship, remove it HERE.      │
└───────────────────┬─────────────────────────────────┘
                    │ feeds into
                    ▼
┌─────────────────────────────────────────────────────┐
│  TDD + BOOTSTRAP (SOT #2) -- HOW to test it         │
│  ───────────────────────────────────────────────    │
│  * Real assertions. No stubs.                        │
│  * Every spec requirement has test coverage.         │
│  * If it's not testable, it shouldn't be in spec.    │
└───────────────────┬─────────────────────────────────┘
                    │ feeds into
                    ▼
┌─────────────────────────────────────────────────────┐
│  STRATEGY (SOT #3) -- WHAT ORDER to build it         │
│  ───────────────────────────────────────────────    │
│  * Phases. Gates. Dependencies. (~500-800 lines)     │
│  * NOT a content document. Ordering only.            │
│  * Does not define WHAT -- only WHEN and IN WHAT     │
│    ORDER.                                            │
└───────────────────┬─────────────────────────────────┘
                    │ all three feed into
                    ▼
┌─────────────────────────────────────────────────────┐
│  BEADS -- SELF-CONTAINED execution units             │
│  ───────────────────────────────────────────────    │
│  * Embed spec sections + TDD test IDs verbatim       │
│  * Phase context from strategy                       │
│  * Agent picks up a bead = everything needed         │
│  * Derived from SOTs, not independent documents      │
└─────────────────────────────────────────────────────┘
```

**Why this hierarchy exists:** Spec drift is the #1 failure mode in multi-stage pipelines. Each intermediate document is a lossy proxy. Anchoring beads directly to Spec + TDD eliminates this drift vector. The Strategy doc is intentionally lightweight (ordering only) to minimize the surface area where drift can hide.

---

## Core Skills

### `research-to-spec` -- Phase 0
Transforms research documents into comprehensive specifications.
- **When:** Have a research doc, need a formal spec
- **Input:** Research document
- **Output:** Spec (SOT #1) + Architecture document
- **Optimization:** Drift check -- does every research finding appear in spec?

### `spec-to-tdd` -- Phase 1
Transforms spec + architecture into TDD test specifications and bootstrap.
- **When:** Have Spec (SOT #1), need test specifications
- **Input:** Spec document, architecture document
- **Output:** TDD document + Bootstrap (SOT #2)
- **Key:** Real assertions, real bootstrap. No stubs. If it's not testable, fix the spec.
- **Optimization:** Drift check -- does every spec requirement have test coverage?

### `spec-to-strategy` -- Phase 2
Creates a lightweight implementation strategy from spec + TDD.
- **When:** Have Spec + TDD, need execution ordering
- **Input:** Spec (SOT #1), TDD (SOT #2)
- **Output:** Implementation Strategy (SOT #3) -- phases, gates, dependencies (~500-800 lines)
- **Key:** Ordering only. No task descriptions, no effort estimates. All content lives in Spec and TDD.
- **Optimization:** Drift check -- does every spec section map to a phase?

### `beads-from-sources` -- Phase 3
Creates self-contained beads directly from all 3 SOTs.
- **When:** Have all 3 SOTs (Spec, TDD, Strategy)
- **Input:** Spec (SOT #1), TDD (SOT #2), Strategy (SOT #3)
- **Output:** Beads with embedded spec sections, TDD test IDs, and phase context
- **Key:** Beads embed spec and TDD content verbatim. They do NOT paraphrase through the strategy.
- **Audit:** Follow with `bead-plan-audit` for spec drift detection

### `beads-to-execution` -- Phase 4
Prepares minimal kickoff context for agent execution.
- **When:** Have audited beads, ready to start agent work
- **Input:** Beads, Spec, TDD
- **Output:** Kickoff prompt + status file

### `bead-plan-audit` -- After Phase 3
Pre-implementation audit for beads -- spec drift detection.
- **When:** Beads created, before execution
- **Input:** Beads, Spec, TDD, Strategy
- **Output:** Improved beads, audit findings
- **Key:** Checks every bead against spec for drift: "Does this bead faithfully represent the spec?"

### `bead-completion-audit` -- Phase 6
Post-implementation audit with REOPEN -> FIX -> CLOSE lifecycle.
- **When:** Agents have completed implementation
- **Input:** Beads, Spec, TDD, codebase
- **Output:** Findings document, fixes applied
- **Key:** Checks spec drift, test coverage, implementation quality

---

## Quick Decision Tree

```
Where am I in the pipeline?
│
├── Have research but no spec?
│   └── Phase 0: Use [research-to-spec]
│       -> Then optimize: drift check vs research
│
├── Have spec but no TDD?
│   └── Phase 1: Use [spec-to-tdd]
│       -> Then optimize: drift check vs spec
│
├── Have spec + TDD but no strategy?
│   └── Phase 2: Use [spec-to-strategy]
│       -> Then optimize: drift check vs spec + TDD
│
├── Have all 3 SOTs but no beads?
│   └── Phase 3: Use [beads-from-sources]
│       -> Then audit: [bead-plan-audit]
│
├── Have audited beads, no kickoff?
│   └── Phase 4: Use [beads-to-execution]
│
├── Have kickoff, beads ready?
│   └── MANDATORY STOP #1
│       Report to human, wait for authorization.
│
├── Execution complete, all beads closed?
│   └── MANDATORY STOP #2
│       Wait for human to trigger audit.
│       -> Phase 6: Use [bead-completion-audit]
│
├── Want to verify quality at any stage?
│   ├── Spec quality -> optimization pass (or researchmaxer)
│   ├── TDD coverage -> optimization pass vs spec
│   ├── Strategy completeness -> optimization pass vs spec + TDD
│   └── Bead fidelity -> [bead-plan-audit]
│
└── Everything corrupted/confused?
```

---

## Related Files

- **WORKFLOW.md** - Detailed step-by-step for each phase
- **DECISION-TREE.md** - Complete decision logic for skill selection
- **QUICK-REFERENCE.md** - One-page command cheat sheet

---

## Common Patterns

### Fresh Feature Start (Full Pipeline)
```
1. [research-to-spec] -> Spec + Arch (SOT #1)
2. Optimization pass -> drift check vs research
3. [spec-to-tdd] -> TDD + Bootstrap (SOT #2)
4. Optimization pass -> drift check vs spec
5. [spec-to-strategy] -> Strategy (SOT #3)
6. Optimization pass -> drift check vs spec + TDD
7. [beads-from-sources] -> Beads
8. [bead-plan-audit] -> spec drift detection
9. [beads-to-execution] -> kickoff
10. STOP AND REPORT TO HUMAN
```

### Starting with Existing Spec
```
1. Skip Phase 0 (spec already exists)
2. [spec-to-tdd] -> TDD + Bootstrap (SOT #2)
3. Continue from step 4 above
```

### Optimization Pass (Any Stage)
```
1. Identify which SOT to check against
2. Read both the SOT and the document being optimized
3. MECHANICAL CHECK: List every requirement/section ID in the SOT.
   For each, verify a corresponding entry exists downstream.
   Any SOT item with no downstream coverage = FAIL (fix before proceeding).
4. REVERSE CHECK: Scan downstream doc for items that don't trace to any SOT entry.
   Any orphan = drift (remove or push back to spec).
5. Fix drift, don't add new scope
6. If context is filling mid-pass: checkpoint progress (note which SOT items
   are verified, which remain), hand off to a fresh session with the checkpoint.
```

### Pre-Implementation Audit
```
1. After beads created (Phase 3)
2. [bead-plan-audit] -> spec drift detection
3. Fix any beads that don't faithfully represent the spec
4. Continue to Phase 4
```

### Execution (Human Initiated)
```
1. Human approves execution OR starts fresh session with kickoff prompt
2. Execute beads -- read spec + TDD for each bead (not strategy)
3. STOP AND REPORT when all beads closed
```

### Post-Implementation Audit (Human Triggered)
```
1. Human triggers audit
2. [bead-completion-audit] -> findings + fixes
3. All issues resolved -> Feature complete
```

### Mid-Feature Recovery
```
1. Check current state: bd ready --json
2. If beads exist -> continue execution
4. If strategy missing -> [spec-to-strategy] from spec + TDD
5. If TDD missing -> [spec-to-tdd] from spec
```

### Complete Reset
```
1. Clean up any stale beads manually if needed
2. Start fresh from Phase 0
```

---

## Session Handoff

Each skill provides a **"Next Stage Kickoff Prompt"** section at the end. When you complete a skill:

1. Copy the kickoff prompt from the skill's output
2. Fill in the placeholder paths (`{spec_path}`, `{tdd_path}`, `{strategy_path}`, etc.)
3. Paste into a new session to continue the workflow

This enables seamless handoff between sessions without losing context.
