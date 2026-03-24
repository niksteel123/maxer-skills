# Layermaxxer — Output Templates

## Strategy Handoff Template

```markdown
# {PROJECT} — Layer Strategy Handoff

**Date:** {YYYY-MM-DD}
**Task:** Create a Layer Strategy Document for the {PROJECT} implementation
**Output:** A single document: `{output_path}/{date}-{project}-layer-strategy.md`
**Scope:** Strategy and sequencing ONLY — do NOT create individual layer specification documents

---

## 1. YOUR MISSION

You are an implementation architect. Your job is to study the {PROJECT} {source_doc_type}
document through a structured, multi-phase investigation and produce a **Layer Strategy
Document** that decomposes the monolithic design into **sequentially shippable layers** —
each layer building on the previous, each independently testable, each delivering
incremental capability.

This is THE critical architectural planning step. The layer sequencing you design will
determine the entire implementation roadmap, team parallelization strategy, and audit
scope per milestone. Getting this wrong means building on unstable foundations, discovering
integration problems late, or shipping capability that can't be used because a dependency
was deferred.

**You are NOT implementing anything.** You are NOT writing code. You are NOT writing
per-layer spec documents. You ARE producing a single strategy document that defines what
the layers are, why they're in this order, what each layer ships, and how the layers
compose into the complete system.

---

## 2. SOURCE MATERIAL

### Primary Source (MANDATORY — read every line)

```
{source_doc_path}
```

This is ~{line_count} lines{revision_note}. It contains:
{source_doc_contents_summary}

**Do NOT skim this document.** The layer strategy requires understanding cross-cutting
dependencies that are only visible when you've read {cross_cutting_example_sections}
together. A surface read will produce a naive "one {component_term} per layer"
decomposition that misses critical integration points.

### Secondary Source (read for project constraints)

```
{agents_md_path}
```

{secondary_source_description}

---

## 3. STRUCTURED RESEARCH PROTOCOL — DO THIS BEFORE DESIGNING LAYERS

**This research phase is mandatory.** The {source_doc_type} document is too dense and
interconnected for a single sequential read to yield reliable layer boundaries. You MUST
build structured cross-cutting maps before attempting decomposition.

### Phase 1: Parallel Deep-Read Investigations

Use subagents to perform the following investigations IN PARALLEL. Each investigation
should read the specific sections indicated, extract structured data, and return it to
you. Do not attempt all of these sequentially — the document is too long and you will
lose context.

**Investigation A: Data Structure Cartography**
- Read: {data_structure_sections}
- Produce: A complete list of every {data_unit_term}, its owning {component_term},
  its {key_term}, its fields with types, which {component_term_plural} read it, and
  which write it
- Pay special attention to: {data_structure_gotchas}

**Investigation B: Invariant & Safety Map**
- Read: {invariant_sections}
- Produce: For each invariant, list which {data_unit_term_plural} it constrains,
  which {operation_term_plural} must enforce it, and the earliest point in the
  lifecycle where it becomes relevant
- Flag: Which invariants are constitutional (immutable in code) vs runtime-enforced

**Investigation C: {Operation_Term} Dependency & Composition Map**
- Read: {operation_sections}
- Produce: A complete list of every {operation_term} across all {component_term_plural},
  which {data_unit_term_plural} each reads/writes, and which {operation_term_plural}
  are atomically paired (MUST ship together)
- Map: {key_flows_to_map}

**Investigation D: {Financial_Or_Economic_Or_Domain} Dependencies**
- Read: {domain_specific_sections}
- Produce: {domain_specific_deliverable}
- Answer: {domain_specific_questions}

**Investigation E: Decision Catalog & Capability Map**
- Read: {decision_sections}
- Produce: For each {decision_term}, a one-line summary, the capability it enables,
  and which {data_unit_term_plural}/{operation_term_plural} it affects
- {additional_decision_instructions}

**Investigation F: Core Lifecycle Analysis**
- Read: {lifecycle_sections}
- Produce: The complete lifecycle of {the_fundamental_cycle}, including every state
  transition, every {operation_term}, and the resolution of any circular dependencies
- Answer: {lifecycle_questions}

{OPTIONAL_INVESTIGATION_G}

### Phase 2: Synthesis

After all investigations complete, synthesize their outputs into:

1. **A unified {data_unit_term} introduction order** — which {data_unit_term_plural}
   must exist before which others can be created
2. **An {operation_term} dependency matrix** — which {operation_term_plural} depend on
   which {data_unit_term_plural}, and which are atomically paired
3. **An invariant activation sequence** — the order in which invariants become relevant
4. **A capability dependency DAG** — which user-facing capabilities depend on which
   other capabilities

Only AFTER completing this synthesis should you begin designing layer boundaries.

---

## 4. WHAT YOU MUST UNDERSTAND — CRITICAL CONTEXT

### 4.1 What {PROJECT} Is

{project_description_2_3_paragraphs}

### 4.2 The {Component_Architecture_Title}

{component_architecture_with_dependency_arrows}

### 4.3 {Domain_Specific_Mechanics_Title}

{domain_specific_mechanics_explanation_with_layering_implications}

### 4.4 Non-Negotiable Architectural Constraints

These constraints apply to EVERY layer. Violating any of them makes the layer
strategy invalid:

{numbered_constraints_list}

### 4.5 The Dependency Graph

{dependency_graph_with_circular_dependency_resolutions}

### 4.6 {Platform}-Specific Context for Layer Feasibility

{platform_upgrade_mechanisms}
{schema_stability_constraints}
{testing_infrastructure}
{forward_compatibility_mechanisms}

---

## 5. WHAT "SHIPPABLE LAYER" MEANS — PRECISE DEFINITION

A shippable layer is NOT "one {component_term}." A shippable layer is a **vertical
slice of capability** that satisfies ALL of:

1. **Compiles and deploys** — all {component_term_plural} build with zero warnings
2. **Has a complete happy path** — at least one end-to-end user-facing flow works
3. **Is independently testable** — integration tests exercise the layer's capability
4. **Maintains all applicable invariants** — no invariant is "relaxed now, enforced later"
5. **Defines stable interfaces for later layers** — schemas and signatures are FROZEN
6. **Has a clear definition of done** — specific flows, invariants, tests
7. **Produces a usable interface** — SDK/API/CLI surface for every operation in the layer
8. **Has corresponding automation support** — if the layer introduces lifecycle steps,
   the automation/keeper service can drive them

**A layer MAY include:**
{what_layers_may_include}

**A layer MUST NOT include:**
{what_layers_must_not_include}

---

## 6. THE {LOOP_NAME} — YOUR LAYER BOUNDARY ANCHOR

The system's fundamental unit of operation is {the_loop_description}. Your first
user-facing layer MUST complete at least one full cycle:

```
{complete_loop_enumeration_with_every_step}
```

Not all of these must be in the first layer. But you must consciously decide what's
in vs out and why. In particular:
{specific_deferral_questions}

---

## 7. THINGS THAT WILL BREAK YOUR LAYER STRATEGY IF MISSED

{subsections_for_each_trap_identified_in_phase_1}

### 7.N A Concrete Example of BAD Layer Decomposition

{bad_decomposition_example_specific_to_project}

---

## 8. EXECUTION ARTIFACT POLICY

The maintained end-state is intentionally small. Your strategy document MUST define
the exact maintained documentation set as part of the strategy — typically:

- One README
- One cross-reference index
- One strategy document (the one you're producing)
- Exactly N canonical layer documents (one per layer you define)

**No standalone cross-layer ledgers, companion docs, or decision files.** All
cross-cutting material (invariants, decisions, SDK contracts, keeper specs) must
be embedded inside the relevant layer doc. Open questions live inside the owning
layer doc under explicit blocker sections, not in separate files.

This policy constrains ALL downstream work (beads design, agent execution). The
strategy author must define it as part of the strategy because the layer count
determines the file count. If you define 7 layers, the maintained set is ~10 files.

Why this matters: without this constraint, downstream agents will proliferate
companion docs, cross-layer ledgers, and decision files that fragment authority,
go stale, and create maintenance burden. The compact set is a forcing function
for architectural clarity.

---

## 9. WHAT THE LAYER STRATEGY DOCUMENT MUST CONTAIN

### 9.1 Required Document Structure

```
1. Executive Summary
   - Total number of layers
   - One-sentence description of each layer
   - Estimated relative complexity (S/M/L/XL)
   - Key sequencing insight

2. Layer Dependency Graph
   - Visual diagram
   - Parallelizable work
   - Critical path

3. Per-Layer Definitions (for EACH layer):

   3.N Layer N: [Name]

   3.N.1 Capability Delivered
   3.N.2 {Component_Term_Plural} Touched
   3.N.3 {Data_Unit_Term_Plural} Introduced
   3.N.4 Shared Library Additions
   3.N.5 Invariants Enforced
   3.N.6 What's Stubbed or Simplified
   3.N.7 Definition of Done
   3.N.8 Integration Test Scenarios
   3.N.9 SDK/API Surface
   3.N.10 Automation Requirements
   3.N.11 Decisions Addressed
   3.N.12 Dependencies
   3.N.13 Risks and Constraints

4. Cross-Layer Concerns
   4.1 Schema Stability Matrix
   4.2 Interface Contracts Between {Component_Term_Plural}
   4.3 Testing Strategy Evolution
   4.4 Audit Checkpoints
   4.5 {Governance_Or_Admin} Transition Plan

5. Sequencing Rationale
6. Parallelization Opportunities
7. Open Questions
```

### 9.2 Quality Criteria

**Your strategy document is GOOD if:**
{project_specific_good_criteria}

**Your strategy document is BAD if:**
{project_specific_bad_criteria}

---

## 10. PROCESS INSTRUCTIONS

### Step 1: Research (use subagents — see Section 3)
### Step 2: Synthesize
### Step 3: Identify the Minimum {Loop_Name}
### Step 4: Work Outward
### Step 5: Validate
### Step 6: Write

---

## 11. FINAL NOTE — THE STANDARD YOU'RE HELD TO

This layer strategy document will be the foundation for potentially months of
implementation work across multiple agents and sessions. Every layer boundary you
draw becomes a deployment milestone, an audit checkpoint, and a coordination point.

{consequences_of_bad_boundaries}
{consequences_of_good_boundaries}

Take your time. Use subagents for the research phase. Think about cross-cutting
dependencies. The {source_doc_type} doc is dense and interconnected — that's why
this decomposition task is hard and why it matters.
```

---

## Strategy Optimization Template

```markdown
# {PROJECT} — Layer Strategy Fresh-Eyes Optimization

**Date:** {YYYY-MM-DD}
**Scope:** Validate and improve the layer strategy document

---

## This Is Not a Superficial Review

The strategy document is the foundation for potentially months of implementation work.
An optimization pass that catches a single bad layer boundary saves weeks of downstream
rework. You MUST re-read both source documents in full — not skim, not "I already know
this" — before validating anything.

ULTRATHINK and be meticulous.

---

## Step 1: Deep Re-Read (MANDATORY before any validation)

Read these documents fully, in order — every line:

1. {agents_md_path} (agent guidelines)
2. {source_doc_path} (the complete source document — {line_count} lines)
3. {strategy_doc_path} (the layer strategy to optimize)

Build a FRESH mental model of both the source architecture and the proposed layer
decomposition. Note any places where the strategy DIVERGES from the source — missing
capabilities, changed terminology, simplified models, or dropped requirements.

---

## Step 2: Structural Validation (binary pass/fail — ANY failure = fix required)

Check EVERY one of these. A single failure means the strategy needs fixing:

- [ ] No forward references — no layer uses a {data_unit_term} introduced in a later layer
- [ ] No invariant gaps — no invariant is "temporarily relaxed" between layers
- [ ] No schema migrations — only {forward_compat_mechanism} between layers
- [ ] Atomic pairs intact — {list_of_atomic_pairs} never split across layers
- [ ] Every layer has at least one new user-facing capability
- [ ] Every layer has a concrete, testable definition of done
- [ ] Every {decision_term} is addressed in exactly one layer (or explicitly split with rationale)
- [ ] Every invariant is activated in exactly one layer
- [ ] The first layer completes the full {loop_name} end-to-end

---

## Step 3: Logical Validation

- Does the first layer prove the COMPLETE operational loop?
- Could each layer survive "what if we never build layer N+1?"
- Are the complexity estimates reasonable and internally consistent?
- Is the dependency graph truly linear where claimed?
- Are parallelization opportunities correctly identified?
- Is user value delivered early enough in the sequence?
- Does the governance/admin transition plan have gaps between layers?

---

## Step 4: Layering Quality (the hard questions)

For each layer boundary, answer concretely:
- What would CONCRETELY break if you swapped this layer with the next?
- Are there tightly-coupled subsystems that got split across layers?
- Are there loosely-coupled subsystems that got bundled unnecessarily?
- Is any layer so large it should be split?
- Is any layer so small it should be merged?
- Does each layer's "what's stubbed" section have a concrete "enhanced in layer N" target?
- Are the cross-layer interface contracts explicit enough for independent teams?

---

## Step 5: Subtle Problem Detection

Look specifically for:
- Capabilities deferred too long (user value arrives too late)
- Capabilities shipped too early (unnecessary complexity in early layers)
- Missing forward-compatibility requirements that will force schema migrations
- Extension points that constrain future layers too tightly
- Test scenarios that can't actually be tested with just the current layer's {data_unit_term_plural}
- SDK/API surface gaps (operations listed but interface design not considered)
- Keeper/automation requirements that are hand-waved

---

## Step 6: Project-Specific Checks

{project_specific_validation_items}

---

## Step 7: Execution Artifact Policy Validation

- Does the strategy define the maintained doc set (README + index + strategy + N layer docs)?
- Is the authority split clear (strategy doc for sequencing vs layer docs for execution-grade detail)?
- Are there any "companion doc" or "cross-layer ledger" patterns that should be eliminated?
- Does the strategy explicitly state that open questions live inside the owning layer doc?

---

## Step 8: Fix and Final Fresh-Eyes Pass

Fix issues with targeted edits. Not wholesale rewrites.
For each fix: explain the rationale.
For each change: verify it doesn't break other layer boundaries.

After all fixes, re-read the strategy ONE MORE TIME with completely fresh eyes.
Ask yourself: "If I gave this to an implementation team tomorrow, would they know
exactly what to build first, second, third — with no ambiguity about layer boundaries?"

Fix anything that fails this test.

Use ultrathink.
```

---

## Beads Creation Template

```markdown
# {PROJECT} — Strategy-to-Beads Conversion

ULTRATHINK and be meticulous.

## Your Mission

You are converting the {PROJECT} layer strategy into an executable bead graph.

Think of yourself as designing a manufacturing plan for a **compact documentation system**:
- the layer docs are the product
- the beads are the work orders
- extra standalone docs are a planning failure
- but every canonical layer doc must absorb the full layer detail — compact file count
  does NOT mean compact content

{IF_BEAD_TOOL_PRESENT}
Invoke the `/beads-from-sources` skill for methodology only.
Use the skill for bead quality and dependency discipline.
{END_IF}

---

## Final Maintained Doc Set (NON-NEGOTIABLE)

The final maintained documentation set must be exactly:

{maintained_doc_set_with_paths}

### Authority split

{authority_split_description}

### Path-ownership hard rule

No bead may own, create, review, or preserve any markdown path outside the
{N}-file set above. No temporary companion docs, decision docs, cross-layer
ledgers, or consolidation files.

---

## Source of Truth

Read fully before creating beads:

{source_docs_with_paths}

Inspect current files in `{strategy_dir}/` and classify each as:
- final maintained artifact
- source material to merge
- obsolete residue

---

## Pre-Bead Research (MANDATORY)

{pre_bead_research_steps}

---

## What The Bead Graph Must Do

1. **Produce the compact {N}-doc maintained set** — not a supporting-doc pack
2. **Keep beads self-contained** — enough context to execute without reopening source
3. **Use section-level ownership** — each bead names one maintained file + its sections
4. **Consolidate instead of proliferate** — lossless merging of existing material
5. **Preserve full architecture** — {architecture_preservation_checklist}
6. **Keep open questions explicit** — inside the owning layer doc, not separate files
7. **Make reviews obvious** — every maintained file has authoring + review beads

---

## Recommended Topology

```text
Root Epic: {PROJECT} Compact Layer Docs
├── Epic: Strategy Docs Front Matter
│   ├── README authoring/consolidation
│   ├── {index_doc_name} authoring/consolidation
│   └── final front-matter review
├── Epic: Layer 1 Canonical Doc
│   ├── section consolidation/drafting beads
│   ├── integration bead
│   └── review/acceptance bead
├── Epic: Layer 2 Canonical Doc
├── ...
├── Epic: Layer {N} Canonical Doc
└── Epic: Final Compact-Doc QA Gate
```

### Canonical-layer density rule

Every canonical layer doc must be rich enough that an implementation agent does NOT
need to reopen the strategy or source doc to recover missing detail.

---

## Bead Quality Standard

### Minimum contents for every bead

1. **Background** — what this bead changes, which maintained file, which section(s)
2. **Current-state context** — what existing material to merge/rewrite
3. **Target behavior** — exact section-level outcome, what must remain explicit
4. **Architectural detail** — {component_term_plural}, {data_unit_term_plural},
   {operation_term_plural}, invariants, {decision_term_plural}
5. **Dependencies** — what must come first, what can run in parallel
6. **Verification** — what a reviewer should check
7. **Acceptance criteria** — concrete and reviewable

### Critical rules

- Never say "see the {source_doc_type} doc" as a substitute for content
- Never normalize extra maintained docs outside the {N}-file set
- Never turn an open question into a hidden assumption
- Never let cross-layer material escape into standalone docs
- Never let "compact doc set" turn into "compressed layer summary"

---

## Required Final Audit Summary

{audit_summary_requirements}

---

## Follow-Up Pass

Now re-read the {source_doc_type} doc, the strategy doc, and every bead with
completely fresh eyes. Use ultrathink. Check whether any bead still implies
standalone docs outside the maintained set. Fix anything that would let the
graph drift into document sprawl.
```

---

## Beads Optimization Template

```markdown
# {PROJECT} — Bead Graph QA Audit

ULTRATHINK and be meticulous.

## Your Mission

You are performing a meticulous bead-by-bead QA pass on the {PROJECT} bead graph.

This is the final planning audit before agents execute. If two different agents could
read the same bead and produce materially different outputs, that bead is not ready.

---

## The Correct Deliverable Model

The bead graph must produce and maintain exactly:

{maintained_doc_set_with_paths}

Nothing else is a valid maintained end-state artifact.

---

## What To Read First

### Source of truth

Read fully:
{source_docs_with_paths}

### Current working-tree docs

Inspect every current file in `{strategy_dir}/`.
Classify as: maintained artifact, source material, or obsolete residue.

### The bead graph

Read every bead, not just the open ones.

---

## Audit Methodology

### 1. Compact-artifact audit
Does each bead target one of the maintained files? Specify which sections?
Avoid mentioning paths outside the set?

### 2. Consolidation audit
Does each bead say what gets merged? Preserve source detail?
Prevent source docs from surviving as unnecessary artifacts?

### 3. Self-containment audit
Could an agent execute without reopening the source doc?
Includes context, constraints, invariants?

### 4. Dependency audit
Correct sequencing? Safe parallelism? Missing or fake dependencies?
Open questions embedded in the right layer doc?

### 5. Architecture-coverage audit
All layers, {component_term_plural}, {data_unit_term_plural},
{operation_term_plural}, invariants, {decision_term_plural},
automation/SDK/interface concerns represented?

{project_specific_coverage_items}

### 6. Final-shape sanity audit
If this graph executes perfectly, does the repo end with exactly the
maintained doc set and nothing else?

---

## Required Audit Output

```text
Total beads audited: X
PASS: X
ENRICHED: X
FIXED: X
DEPENDENCY_FIX: X
CREATED: X

Allowed maintained files: {N}
Beads still implying extra maintained docs: X (target: 0)
Beads mentioning out-of-set markdown paths: X (target: 0)
Coverage gaps remaining: X (target: 0)
```

---

## Follow-Up Fresh-Eyes Pass

Re-read the source doc, the strategy doc, and every bead with completely fresh eyes.
Fix any bead that would recreate doc sprawl, split-doc companion files, or lossy
compression of layer detail.
```

---

## Execution Kickoff Template

```markdown
# {PROJECT} — Execution Agent Kickoff

> Copy this entire file into a fresh session to onboard an execution agent.

---

## Your Mission

ULTRATHINK and be meticulous.

You are executing the **{PROJECT} compact layer-doc program** from the bead inventory.

This is a documentation-first execution workflow.
Compact file count does **not** mean compact layer content.

The maintained end-state is:
{maintained_doc_set_with_paths}

Role split:
{authority_split_description}

You are **not** building a permanent supporting-doc pack.
You are **not** maintaining standalone cross-layer ledgers or decision docs.
Your job is to execute beads that consolidate material into the compact final doc set.
That means merging files without losing architectural density.

### Core operating rules

- Read the full source and strategy docs before touching any bead work.
- Do the bead's actual deliverable, mapping into one of the maintained files.
- If a bead implies creating standalone docs outside the set, stop and fix the graph.
- Do NOT interpret "compact doc set" as permission to summarize a layer.
  The canonical layer docs are execution-grade references.

### Architectural truths you must preserve

{architectural_truths_list}

---

## Step 0: Load Source Of Truth (MANDATORY)

Read in order:
{numbered_source_docs_with_paths}

---

## Step 1: Sanity-Check The Bead Graph

Verify beads map into the maintained doc set only.
Audit-only beads (review gates, coherence audits) are valid exceptions.

---

## Step 2: Coordination

{IF_AGENT_MAIL}
Set up Agent Mail, check inbox, reserve files before editing.
{ELSE}
If other agents are active, coordinate file ownership before editing.
{END_IF}

---

## Step 3: Choose Work

Pick a ready non-epic bead. Before claiming:
- Read the bead + parent epic
- Identify which maintained file it contributes to
- Identify which source material it absorbs

---

## Step 4: Execute In Compact-Doc Mode

That means:
- Merge cross-layer material into the relevant layer doc
- Merge decision material into explicit sections inside the layer doc
- Use old fragmented docs only as source material
- Preserve full source detail

That does NOT mean:
- Creating standalone docs outside the maintained set
- Summarizing a layer so an implementation agent has to reopen the source doc

---

## Step 5: Verification

File-count discipline: does the bead strengthen one of the maintained files?
Density check: does the layer doc still carry full execution-grade detail?

---

## Step 6: Close, Sync, Push, Repeat

Close the bead, sync, commit, push, release reservations, loop immediately.
Do not ask what to work on next.
```

---

## Execution Push Template

```markdown
# {PROJECT} — Execution Push

> Paste this into an existing execution session to keep it moving.

---

Re-read `{agents_md_path}` so it is fresh in your mind.

The maintained end-state is:
{maintained_doc_set_with_paths}

Role split:
{authority_split_description}

If your current bead work is producing standalone docs outside the maintained set,
stop and fix the graph before continuing.

## First

If you already have a bead `in_progress`, finish it first:
- Improve one of the maintained files
- Consolidate source material into that file
- Keep open questions inside the owning layer doc
- Verify you reduced fragmentation instead of increasing it
- Verify consolidation did not hollow out the layer detail
- Close, sync, commit, push, release, announce

---

## Re-orient

Re-open the source of truth if your context is stale:
{numbered_source_docs_with_paths}

Confirm the bead is helping the repo converge toward the compact doc set, not
away from it. Confirm you are absorbing detail rather than summarizing.

---

## Pick Real Work

Ignore epics. Only claim ready non-epic beads.

Audit beads (review gates, coherence audits) are valid exceptions that
create no markdown artifacts — they validate the compact system.

---

## Execute In The Right Mode

Merge, consolidate, absorb. Don't proliferate, summarize, or create extra files.
Preserve full execution-grade detail in every layer doc.

---

## Non-Negotiables To Preserve

{architectural_truths_list}

If a doc weakens any of those, it is not ready.

---

## Verification

File-count discipline: did this bead improve one of the maintained files?
Density: does the file still carry full execution-grade detail?
Fragmentation: did you pull material inward instead of spawning more docs?

---

## Finish Properly

Close bead, sync, commit, push, release reservations, announce completion.
Then loop immediately. Do not ask what to work on next.
```

---

## Layer Boundary Heuristics

When identifying layer boundaries, use these heuristics:

```
THE LOOP ANCHOR:
  Find the system's fundamental operational cycle.
  The first layer MUST complete this cycle end-to-end.
  Work outward from the loop, adding capability per layer.

VERTICAL SLICES, NOT HORIZONTAL:
  Each layer touches MULTIPLE components but delivers COMPLETE capability.
  "One component per layer" is almost always wrong.

THE "WHAT IF NEVER" TEST:
  Could each layer survive "what if we never build layer N+1?"
  Each layer must be independently valuable, not just infrastructure.

ATOMIC PAIR RULE:
  Operations that are atomically composed at runtime MUST ship in the same layer.
  Never split a runtime pair across a layer boundary.

SCHEMA FREEZE RULE:
  Once a data structure schema ships in layer N, it cannot change in layer N+1.
  Only forward-compatible mechanisms (reserved bytes, optional fields).
  Therefore: schemas must accommodate ALL future layers from day 1.

INVARIANT ACTIVATION RULE:
  Invariants that apply to data in layer N must be enforced in layer N.
  No invariant is "temporarily relaxed" — each layer is fully safe as shipped.

COMPLEXITY BUDGET:
  Typically 4-8 layers total.
  More than ~8: too granular, too many coordination points.
  Fewer than 3: too coarse, no iteration value.
  Layer 1 is often the largest (proving the complete loop).

EXTENSION BOUNDARY:
  The cleanest layer boundary is between core and extensions.
  Extensions that consume core outputs (not modify core state) are ideal
  late-layer candidates.

GOVERNANCE GRADIENT:
  Early layers: admin authority with forward-compatible governance fields.
  Middle layers: governance mechanisms activate.
  Late layers: full decentralized governance.
```
