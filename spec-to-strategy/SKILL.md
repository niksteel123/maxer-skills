---
name: spec-to-strategy
description: Convert specifications into lightweight implementation strategy documents. Use when you have a feature spec and TDD document and need to define phase ordering, dependency graphs, domain batches, and gate criteria — without duplicating spec content. Produces a single ~500-800 line routing table, not a multi-thousand-line plan.
---

# Spec to Strategy Conversion

This skill transforms specifications and TDD documents into a **lightweight implementation strategy** — a routing table that defines what order to build things, not what to build.

## The 3-SOT Model

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│        Spec (SOT #1)    │     │     TDD (SOT #2)        │     │   Strategy (SOT #3)     │
│        (WHAT)           │     │   (HOW TO VERIFY)       │     │   (WHAT ORDER)          │
│                         │     │                         │     │                         │
│  Every detail of the    │     │  Real tests, real       │     │  Phase ordering, deps,  │
│  feature. Source of     │     │  assertions. Test       │     │  domain batches, gate   │
│  truth for content.     │     │  specifications.        │     │  criteria. Routing only.│
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

**Spec = WHAT** to build (source of truth for all content)
**TDD = HOW TO VERIFY** (test specifications, assertions, bootstrap)
**Strategy = WHAT ORDER** (phase dependencies, batching, gates)

## When to Use This Skill

- You have a detailed feature specification
- You have a TDD document (created by `spec-to-tdd`)
- You need to define the execution order for implementation
- You're preparing work for bead creation directly from spec + TDD + strategy

## What This Skill Produces

### Single Strategy Document
**Location:** `docs/strategy/{feature}-strategy.md`

A single document (~500-800 lines) containing:
- Phase overview table with prerequisites and gates
- Per-phase ordering (parallel vs sequential work items)
- Domain batches where applicable
- Gate criteria (concrete, testable, referencing TDD test IDs)
- Completeness mapping (every spec section maps to a phase)

### What It Does NOT Produce

- Task descriptions (that's spec content)
- Effort estimates (unreliable, biases scope decisions)
- Per-task test mappings (that's TDD content)
- Implementation guidance (that's spec/architecture content)
- Acceptance criteria (that's spec content)
- Code examples (that's spec/architecture content)
- Multiple phase files (single document only)

## Core Principles

### 1. The Strategy is a Routing Table
It says "build Phase 1 first, then Phase 2" and "within Phase 2, these items are parallel." It does NOT say "here's how to build the registry" — that's in the spec.

### 2. No Content Duplication
If someone reads only the strategy, they should know WHAT ORDER to build things. They must read the spec to know WHAT to build.

### 3. Spec Authority is Absolute
If it's in the spec, it ships. No intermediate document gets to make scope cuts. If something shouldn't ship, remove it from the spec first.

### 4. Gates Reference TDD
Phase gate criteria should reference TDD test IDs where possible, not invent new test descriptions.

### 5. Lightweight by Design
~500-800 lines total. If it's growing past 1000 lines, you're duplicating spec content.

## Input Requirements

1. **Required:** Path to spec document
2. **Required:** Path to TDD document
3. **Optional:** Path to architecture document

## Quick Start

```
# When you have a spec + TDD ready for strategy creation:
# 1. Read spec and TDD thoroughly
# 2. Invoke this skill
# 3. Review the single strategy document
# 4. Create beads directly from spec + TDD + strategy
```

## Supporting Files

- **METHODOLOGY.md** - Step-by-step strategy creation process
- **TEMPLATES.md** - Strategy document template
- **EXAMPLES.md** - Real strategy examples
- **VERIFICATION.md** - Completeness and drift verification

---

## Next Stage

After completing this skill, beads are created **directly from Spec + TDD + Strategy**:

```
Create beads for {feature}.

Sources of truth:
- Spec: `{spec_path}` (SOT #1 — WHAT to build)
- TDD: `{tdd_path}` (SOT #2 — HOW TO VERIFY)
- Strategy: `{strategy_path}` (SOT #3 — WHAT ORDER)

Each bead embeds relevant spec sections verbatim and TDD test IDs with full assertions.
The strategy provides phase context and ordering only.
DO NOT embed strategy content into beads — strategy is for phase routing, never bead content.
```

> **IMPORTANT:** Beads are created from spec + TDD directly. The strategy provides
> ordering context but bead CONTENT comes from the spec and TDD, never paraphrased
> through the strategy. If you find yourself copying text from the strategy into a
> bead, you are drifting — go back to the spec.
