# Spec to Strategy Methodology

A step-by-step guide for creating lightweight implementation strategies.

---

## Overview

This methodology produces a single strategy document (~500-800 lines) that defines execution order, dependencies, and phase gates — without duplicating spec content.

```
Input:                           Output:
┌────────────────┐               ┌──────────────────────────────────┐
│ Spec (SOT #1)  │               │ docs/strategy/                   │
│ TDD  (SOT #2)  │ ──────────▶   │ └── {feature}-strategy.md        │
│ Arch (optional) │               │     (~500-800 lines)             │
└────────────────┘               └──────────────────────────────────┘
```

---

## Phase 0: Inputs

### Step 0.1: Gather and Read

Read the spec and TDD thoroughly. You need to understand:
- Every subsystem / domain area in the spec
- Dependencies between subsystems (what requires what)
- The TDD test structure (which tests cover which spec sections)

### Step 0.2: Verify TDD Exists

The TDD must already exist before strategy creation. If it doesn't, use `spec-to-tdd` first. The strategy references TDD test IDs in gate criteria.

---

## Phase 1: Dependency Analysis

### Step 1.1: Identify Technical Dependencies

Map what must come before what:

- **Types before implementations** — Shared types/interfaces before code that uses them
- **Core before features** — Foundation libraries before consumer features
- **Backend before frontend** — Services before UI that calls them
- **Infrastructure before business logic** — Database, transport, auth before domain logic
- **Independent subsystems** — Identify what has NO dependencies and can be built in any order

### Step 1.2: Build Dependency Graph

Create a mental (or written) graph of subsystem dependencies:

```
Types ──▶ Core Services ──▶ Domain Logic ──▶ Integration ──▶ UI
                │                                              │
                └──── Security ────────────────────────────────┘
```

Note: This graph is for YOUR understanding during strategy creation. Only the resulting phase structure goes into the output document.

---

## Phase 2: Phase Boundary Identification

### Step 2.1: Group Related Spec Sections

Group spec subsystems into phases based on:

1. **Dependency clusters** — Things that depend on each other belong together
2. **Independent verification** — Each phase should be testable on its own
3. **Natural boundaries** — Bootstrap → core → features → integration → polish

### Step 2.2: Phase Boundary Rules

- Each phase has a clear **gate** — concrete criteria that prove the phase works
- No phase should have more than ~15 work items (split if larger)
- Phases should be ordered so that earlier phases unblock later ones
- If two subsystems have no dependency relationship, they can be in the same phase as parallel work or in separate phases — choose based on what creates the cleanest gates

### Step 2.3: Create Phase Overview Table

| Phase | Name | Prerequisites | Gate Summary |
|-------|------|---------------|--------------|
| 1 | {Name} | None | {One-line gate description} |
| 2 | {Name} | Phase 1 | {One-line gate description} |
| 3 | {Name} | Phase 2 + partial Phase 1 | {One-line gate description} |

---

## Phase 3: Ordering Within Phases

### Step 3.1: Classify Work Items

For each phase, list the spec sections/subsystems it contains and classify:

- **Parallel:** Independent items with no dependency on each other. Can be built simultaneously.
- **Sequential:** Items that must be built in order within the phase.

### Step 3.2: Identify Domain Batches (if applicable)

When a phase involves migrating or building many similar items (e.g., migrating 226 methods across 19 files), group them into domain batches:

| Batch | Domains | Approximate Scope |
|-------|---------|-------------------|
| 1 | device, capability | ~14 methods |
| 2 | project, view | ~51 methods |

Batches provide manageability without becoming task descriptions.

### Step 3.3: Name Items, Not Descriptions

**Phase-level items** — use spec section references:
- **Do:** "§4.2 Transport Layer" or "L2.3 Replication subsystem"
- **Don't:** "Implement the transport layer with WebSocket support and fallback to HTTP polling"

**Within-phase ordering** — concise action names (2-4 words) are acceptable when spec section references are too coarse-grained for sequencing sub-steps:
- **Do:** "Register MCP tools → wire scoping → replace dispatch → delete old files"
- **Don't:** "Register all 21 MCP tools using the new SwarmMethodRegistry macro with schemars-derived JSON schemas"

The rule: a reader should need the spec to understand what each item involves. Names identify; descriptions explain.

---

## Phase 4: Gate Design

### Step 4.1: Define Gate Criteria

For each phase boundary, define concrete, testable criteria:

**Good gates:**
- "Registry compiles, 21 methods register, duplicate-name test passes"
- "tools/list parity verified, scoping tests pass"
- "All 226 methods registered, CLI parity verified against fixture capture"

**Bad gates (too vague):**
- "Phase 1 works correctly"
- "All tests pass"
- "Code reviewed and approved"

### Step 4.2: Reference TDD Test IDs

Where possible, gates should reference specific TDD test IDs:

```
Gate: UT-REG-001 through UT-REG-015 pass, IT-REG-001 through IT-REG-005 pass
```

This anchors gates to the TDD (SOT #2) rather than inventing new test descriptions.

### Step 4.3: Define Rollback Criteria

For each phase, define when to STOP and reassess:

```
Roll back if: Schema generation requires widespread type duplication beyond documented exceptions
```

Rollback criteria prevent sunk-cost continuation when assumptions prove wrong.

---

## Phase 5: Write Strategy Document

### Step 5.1: Document Structure

Follow the template in TEMPLATES.md. The complete document should be:

1. **Source Documents** — Links to spec, TDD, and optional architecture
2. **Phase Overview Table** — All phases with prerequisites and gates
3. **Per-Phase Sections** — Ordering, domain batches (if applicable), gate criteria, rollback criteria
4. **Completeness Mapping** — Every spec section mapped to a phase
5. **Dependency Diagram** — Visual representation of phase ordering

### Step 5.2: Length Check

- Target: 500-800 lines
- Acceptable: up to 1000 lines for very large features
- Red flag: >1000 lines means you're duplicating spec content

If over budget, check for:
- Task descriptions masquerading as ordering info
- Implementation guidance that belongs in the spec
- Test descriptions that belong in the TDD

---

## Phase 6: Verify Completeness

### Step 6.1: Spec Coverage Check

Every spec section must map to exactly one phase. No section should be silently dropped.

Create a completeness table:

| Spec Section | Phase | Notes |
|-------------|-------|-------|
| §1 | 1 | |
| §2.1-2.3 | 1 | |
| §3 | 2 | |

### Step 6.2: TDD Coverage Check

Every TDD test should have a phase home (via the spec section it tests).

### Step 6.3: Drift Check

Read through the strategy and ask:
- Does any section describe WHAT to build (instead of just ordering)?
- Does any section contain implementation guidance?
- Does any section duplicate spec content?
- Are there effort estimates anywhere?
- Are there per-task acceptance criteria?

If yes to any: remove it. That content lives in the spec or TDD.

---

## Anti-Patterns to Avoid

### Anti-Pattern: Task Description Creep
**Wrong:** "Task P1.3: Create SQLite schema with users, sessions, and config tables per §2.2"
**Right:** "§2.2 (Database Schema) — parallel with §2.1"

### Anti-Pattern: Effort Estimation
**Wrong:** "Phase 1: ~2-3 weeks, Medium complexity"
**Right:** (no effort info — it's unreliable and biases scope decisions)

### Anti-Pattern: Implementation Guidance
**Wrong:** "Use `schemars::JsonSchema` derive on all param structs for auto-generation"
**Right:** (this is spec content, not ordering info)

### Anti-Pattern: Test Design in Strategy
**Wrong:** "E2E Test: Start service, send GET /health, assert 200"
**Right:** "Gate: UT-CORE-001 through UT-CORE-010, IT-CORE-001 pass"
