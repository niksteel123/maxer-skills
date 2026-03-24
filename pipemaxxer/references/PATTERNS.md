# Pipemaxxer — Usage Patterns

## Pattern A: Feature Integration

**Scenario:** You have a research doc for a new feature. The codebase already exists with implemented layers/modules. You want to integrate the feature.

**Input:** Research document
**Entry Point:** Batch 1 (Create Spec via /research-to-spec)
**Handoffs Generated:** All 14 (01-14)

**Example:**
```
/pipemaxxer thoughts/research/2026-03-23-dynamic-mcp-tool-subsetting-research.md
```

**Context:** The research doc explores the feature. Pipemaxxer reads it, studies the existing codebase, and generates handoffs that reference actual files the feature will modify. The spec is created FROM the research doc using /research-to-spec.

**Source of Truth flow:**
```
Research doc (INPUT) → Spec (SOT #1, created) → TDD (SOT #2) → Strategy (SOT #3) → Beads → Execute
```

---

## Pattern B: Layer/Plan Implementation (Greenfield from Existing Spec)

**Scenario:** You already HAVE a spec — it's a layer doc, plan doc, or hand-written specification. Prior layers may be built, this one is next. No research-to-spec needed.

**Input:** Spec/layer document
**Entry Point:** Batch 1* (Validate Spec) + Batch 2 (Create TDD)
**Handoffs Generated:** 01*-validate + 02-optimize + 03-14

**Example:**
```
/pipemaxxer thoughts/layer-3/unified-mesh-layer-3-spec.md
```

**Context:** The layer spec IS the spec (SOT #1). Pipemaxxer detects it's already a spec (has requirement IDs, ACs) and skips research-to-spec. Instead, Batch 1 becomes a lightweight validation pass (check structure, add missing IDs, verify completeness). Then straight to TDD.

**Source of Truth flow:**
```
Layer doc (IS SOT #1, validated) → TDD (SOT #2) → Strategy (SOT #3) → Beads → Execute
```

**Semi-greenfield variant:** Prior layers are built. The spec references types/APIs from those layers. Pipemaxxer's codebase research finds the implemented layers and the handoffs reference them as "existing integration surface."

---

## Pattern C: Resume Mid-Pipeline

**Scenario:** You started the pipeline earlier. Some artifacts exist (spec, TDD, maybe strategy). You want to pick up where you left off.

**Input:** Spec doc (pipemaxxer auto-discovers other artifacts)
**Entry Point:** Wherever the pipeline stopped
**Handoffs Generated:** From the entry point onward

**Example:**
```
/pipemaxxer thoughts/specs/my-feature-spec.md
# pipemaxxer detects: TDD exists at thoughts/specs/my-feature-tdd.md
# pipemaxxer asks: "TDD found. Start from Batch 3 (Create Strategy)?"
```

**Detection logic:**
1. Pipemaxxer reads the spec path
2. Searches for TDD at expected paths (same dir, `-tdd.md` suffix)
3. Searches for strategy at expected paths
4. Searches for beads with matching prefix
5. Determines entry point
6. Asks user to confirm if ambiguous

---

## Pattern D: Spec Already Has TDD (Rare)

**Scenario:** Both spec and TDD exist (perhaps from a prior pipemaxxer run that was interrupted after Batch 2). Need strategy + beads + execution.

**Input:** Spec doc
**Entry Point:** Batch 3 (Create Strategy)
**Handoffs Generated:** 05-14

---

## Pattern Selection Flowchart

```
Is the source document a research doc?
  YES → Pattern A (full pipeline, Batch 1-6 + post)
  NO ↓

Is the source document an existing spec/layer doc?
  YES → Does a TDD already exist for this spec?
    YES → Does a strategy already exist?
      YES → Do beads already exist?
        YES → Pattern C (start at Batch 5 audit or Batch 6 kickoff)
        NO → Pattern C (start at Batch 4 create beads)
      NO → Pattern C (start at Batch 3 create strategy)
    NO → Pattern B (validate spec + start at Batch 2 create TDD)
  NO → Ask user what the document is
```

---

## Cross-Pattern Constants

Regardless of pattern, these are always true:

1. **3-SOT hierarchy:** Spec (PRIMARY) > TDD (PRIMARY) > Strategy (ORDERING ONLY)
2. **Beads embed verbatim:** spec + TDD content, not paraphrased
3. **Every create step has sub-optimization:** feature-specific self-check at end
4. **Every optimize step has sub-optimization:** auditor re-checks own fixes
5. **Audit is dedicated (Batch 5):** systematic spec drift detection
6. **Completion audit is a loop:** audit → fix beads → execute → re-audit until 100%
7. **Archive at the end:** clean state for next pipeline run
8. **"If it's in the spec, it ships":** no step can silently drop requirements
