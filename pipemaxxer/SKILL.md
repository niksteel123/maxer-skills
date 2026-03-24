---
name: pipemaxxer
description: "Orchestrate the complete 3-SOT implementation pipeline from any entry point. Deep-researches the codebase, generates feature-specific handoff prompts for every stage (spec, TDD, strategy, beads, audit, kickoff, push, completion audit, archive). Composable: start from research doc, existing spec, or mid-pipeline. Works on any codebase."
disable-model-invocation: false
---

# Pipemaxxer — 3-SOT Implementation Pipeline Generator

> Generate the complete handoff chain for implementing a feature, layer, or plan — from any starting point to production-audited code.

## Philosophy

Every implementation follows the same pipeline. The artifacts differ, but the shape is constant:

```
Source of Truth #1 (SPEC)     — WHAT to build
Source of Truth #2 (TDD)      — HOW to verify it
Source of Truth #3 (STRATEGY) — WHAT ORDER to build it
         ↓ all three feed into
      BEADS                    — SELF-CONTAINED execution units
         ↓ verified by
      AUDIT                    — ZERO drift from spec
         ↓ executed via
      KICKOFF + PUSH           — Agent onboarding + continuation
         ↓ verified by
      COMPLETION AUDIT         — Codebase matches spec 100%
```

Pipemaxxer doesn't execute this pipeline — it **generates the handoff prompts** for each step. Each handoff is:
- **Feature-specific** — references actual codebase files, types, and patterns (not generic templates)
- **Self-contained** — paste into a fresh session and it works
- **Skill-aware** — tells the agent exactly which skill to invoke
- **Sub-optimized** — every create/modify step ends with a "re-read with fresh eyes" self-check

## When to Use

**Trigger phrases:**
- "pipemaxxer", "pipe maxxer", "/pipemaxxer"
- "Generate implementation pipeline for [feature]"
- "Set up 3-SOT pipeline for [layer/plan]"
- "Create handoffs for implementing [feature]"

**Use when:**
- You have a research doc and want to go from research → production code
- You have an existing spec/layer doc and want to implement it
- You're resuming a pipeline mid-way (TDD exists, need strategy + beads)
- You're starting a new layer in a multi-layer architecture

## Composable Entry Points

Pipemaxxer detects what already exists and starts from the right point:

| You Have | Entry Point | Batches Generated |
|----------|------------|-------------------|
| Research doc only | Batch 1 (create spec) | 1-6 + post-implementation |
| Spec/layer doc (no TDD) | Batch 1* (validate spec) + Batch 2 | 1*-6 + post |
| Spec + TDD | Batch 3 (create strategy) | 3-6 + post |
| Spec + TDD + Strategy | Batch 4 (create beads) | 4-6 + post |
| Spec + TDD + Strategy + Beads | Batch 5 (audit beads) | 5-6 + post |

*Batch 1 in "spec exists" mode is a lightweight validation pass, not full research-to-spec.

## Input

```
/pipemaxxer <source_doc_path>
```

**Arguments:**
- `$ARGUMENTS[0]` — path to source document (research doc, spec, or layer doc)
- Optional flags detected from context:
  - If source doc looks like research → full pipeline
  - If source doc looks like a spec (has requirement IDs, ACs) → skip to TDD
  - If TDD already exists at expected path → skip to strategy
  - Agent will ask to confirm detection if ambiguous

## Output

A numbered set of handoff files in `{working_dir}/`, plus a manifest:

```
{feature}-pipeline/
├── manifest.yaml              # All file paths, bead prefix, metadata
├── 01-create-spec.md          # or 01-validate-spec.md if spec exists
├── 02-optimize-spec.md
├── 03-create-tdd.md
├── 04-optimize-tdd.md
├── 05-create-strategy.md
├── 06-optimize-strategy.md
├── 07-create-beads.md
├── 08-optimize-beads.md
├── 09-audit-beads.md
├── 10-generate-kickoff.md
├── 11-push.md
├── 12-completion-audit.md
├── 13-execute-fix-beads.md
├── 14-archive.md
└── EXECUTION-GUIDE.md          # Run order, parallelization, checkpoints
```

Only files from the entry point onward are generated. If starting from Batch 3, files 01-04 are not created.

## The Pipeline (All 7 Batches)

### Batch 1: SPEC
```
01-create-spec        → /research-to-spec (or validate-spec if spec exists)
                        + sub-optimization
02-optimize-spec      → fresh-eyes audit + sub-optimization
```

### Batch 2: TDD
```
03-create-tdd         → /spec-to-tdd + sub-optimization
04-optimize-tdd       → fresh-eyes audit + sub-optimization
```

### Batch 3: STRATEGY
```
05-create-strategy    → /spec-to-strategy + sub-optimization
06-optimize-strategy  → fresh-eyes audit + sub-optimization
```

### Batch 4: BEADS
```
07-create-beads       → /beads-from-sources + sub-optimization
08-optimize-beads     → fresh-eyes audit + sub-optimization
```

### Batch 5: AUDIT
```
09-audit-beads        → /bead-plan-audit + sub-optimization
```

### Batch 6: KICKOFF + PUSH
```
10-generate-kickoff   → /beads-to-execution (no sub-optimization — IS the deliverable)
    ⛔ MANDATORY STOP — Human authorizes execution
11-push               → continuation nudge (used as needed during execution)
    ⛔ MANDATORY STOP — Human triggers audit
```

### Post-Implementation
```
12-completion-audit   → /bead-completion-audit + sub-optimization
13-execute-fix-beads  → execute fixes + mini push at end
14-archive            → archive pipeline, clean up, report deliverables
```

## What Makes This Different From Featuremaxxer

| | Featuremaxxer | Pipemaxxer |
|-|---------------|------------|
| TDD | Skipped (testing front-loaded into optimization) | Full TDD as SOT #2 |
| Plan/Strategy | No plan at all | Lightweight strategy (SOT #3, ordering only) |
| Self-checks | Single optimization pass | Sub-optimization on EVERY step |
| Entry points | Research doc only | Any point in pipeline |
| Handoff specificity | Good | Deep codebase research → feature-specific |
| Completion audit | Not included | Full audit-fix-verify loop |
| Archive | Not included | Clean pipeline reset for next run |

**Use featuremaxxer** for quick features that don't need TDD rigor.
**Use pipemaxxer** for anything that needs thorough testing, multi-agent execution, or is part of a layered architecture.

## First Action When Invoked

1. Read `METHODOLOGY.md` fully — it defines the 5-phase workflow you follow
2. Read `TEMPLATES.md` — parameterized templates for each handoff type
3. Read `references/PATTERNS.md` — detect which usage pattern applies
4. Then execute Phase 0 (Detect Context)

## Progressive Handoff Enrichment

Pipemaxxer generates all handoffs upfront, but later handoffs improve as artifacts are created. Between each batch, an **enrichment pass** updates subsequent handoffs with data from newly created artifacts:

```
Batch 1 completes (spec created)
  → ENRICH: Update handoffs 03-14 with spec metadata
    (requirement IDs, subsystem count, section structure)

Batch 2 completes (TDD created)
  → ENRICH: Update handoffs 05-14 with TDD metadata
    (test IDs, coverage matrix summary, test counts by type)

Batch 3 completes (strategy created)
  → ENRICH: Update handoffs 07-14 with strategy metadata
    (phase names, bead grouping, gate criteria, expected bead count)

Batch 4 completes (beads created)
  → ENRICH: Update handoffs 09-14 with bead metadata
    (bead prefix, total count, ready count, phase distribution)
```

The enrichment is embedded in the EXECUTION-GUIDE.md as a 5-minute step between batches. It's a quick read of the new artifact + sed/edit of subsequent handoff files to replace generic references with specific data.

## Skill-to-Step Mapping

| Step | Skill to Invoke | What It Produces |
|------|----------------|-----------------|
| 01 create-spec | `/research-to-spec` | Spec (SOT #1) + Architecture |
| 01* validate-spec | No skill — manual validation | Validated existing spec |
| 02 optimize-spec | No skill — fresh-eyes audit | Improved spec |
| 03 create-tdd | `/spec-to-tdd` | TDD + Bootstrap (SOT #2) |
| 04 optimize-tdd | No skill — fresh-eyes audit | Improved TDD |
| 05 create-strategy | `/spec-to-strategy` | Strategy (SOT #3) |
| 06 optimize-strategy | No skill — fresh-eyes audit | Improved strategy |
| 07 create-beads | `/beads-from-sources` | Beads |
| 08 optimize-beads | No skill — fresh-eyes audit | Improved beads |
| 09 audit-beads | `/bead-plan-audit` | Audited beads (zero drift) |
| 10 generate-kickoff | `/beads-to-execution` | Kickoff + Push + Status |
| 12 completion-audit | `/bead-completion-audit` | Audit report + fix beads |

## Supporting Files

- **METHODOLOGY.md** — Detailed phase-by-phase workflow for generating handoffs
- **TEMPLATES.md** — Parameterized handoff templates for each batch type (including archive)
- **references/PATTERNS.md** — Usage patterns (feature integration, layer implementation, resume)

## Quick Start

```
# Feature integration (research doc → full pipeline)
/pipemaxxer thoughts/research/2026-03-23-dynamic-mcp-tool-subsetting-research.md

# Layer implementation (layer spec exists, skip to TDD)
/pipemaxxer thoughts/layer-3/unified-mesh-layer-3-spec.md

# Resume mid-pipeline (TDD exists, generate strategy onward)
/pipemaxxer thoughts/specs/my-feature-spec.md
# → pipemaxxer detects TDD at expected path, asks: "TDD found, start from strategy?"
```
