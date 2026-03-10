---
name: harmonymaxer
description: "Integrate new features, research findings, or feedback into existing plan/layer documentation with perfect cross-document consistency. Use when: user says 'harmonymaxer', 'harmonize this', 'integrate this feature', 'integrate feedback', 'harmonize docs', 'absorb this research', 'harmonize into layers', or '/harmonymaxer'. Reads new material (research docs, feature plans, or feedback), deeply understands both the new material and the existing doc set, then generates harmonization handoff + optimization prompts that produce perfectly consistent documentation. Works on any codebase."
user_invocable: true
compatibility: "Works with Claude Code, Codex, and any Agent Skills-compatible tool."
metadata:
  author: steel
  version: "1.0"
---

# Harmonymaxer — Feature & Feedback Integration Engine

> Integrate new features, research findings, or feedback into existing plan/layer docs — producing harmonization handoffs that ensure perfect cross-document consistency.

---

## The Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   /harmonymaxer research.md                                             │
│       │                                                                 │
│       ├── Phase 0-1: Deep understand existing docs + new material       │
│       ├── Phase 1: Build change impact map + classify affected docs     │
│       │                                                                 │
│       ├── Generates: HARMONIZATION HANDOFF   → harmonymaxer/active/     │
│       └── Generates: HARMONIZATION OPTIMIZATION → harmonymaxer/active/  │
│                                                                         │
│   USER RUNS harmonization handoff → docs updated with new material      │
│       │                                                                 │
│       ├── (built-in fresh-eyes follow-up at end of same session)        │
│       │                                                                 │
│   USER RUNS harmonization optimization → docs verified for consistency  │
│       │                                                                 │
│       └── (built-in fresh-eyes follow-up at end of same session)        │
│                                                                         │
│   RESULT: Layer/plan docs are self-contained. Source material is no     │
│           longer needed. All docs tell one coherent story.              │
│                                                                         │
│   (optional: run /planmaxer on the updated docs for expert reviews)     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### File Structure

```
harmonymaxer/                          (lives at project root or docs/harmonymaxer/)
├── active/                            (current run — generated prompts)
│   ├── harmonization-handoff.md       (prompt to integrate new material into docs)
│   └── harmonization-optimization.md  (prompt to verify integration quality)
├── archived/                          (previous runs — kept for reference)
│   ├── run-001/
│   └── run-002/
└── .run                               (counter file: current run number)
```

All harmonymaxer artifacts are **temporary working prompts** — they exist to drive the integration pipeline. The updated layer/plan docs ARE the permanent outputs. The source material (research doc or feedback) should become redundant after harmonization.

---

## Arguments

```
/harmonymaxer [source material path] [flags]

Examples:
  /harmonymaxer docs/research/auth-research.md         Integrate research doc into layer docs
  /harmonymaxer feedback.md                             Integrate feedback into plan docs
  /harmonymaxer research.md --into docs/strategy/       Specify target doc directory
  /harmonymaxer --feedback-mode notes.md                Force feedback mode for brief source
```

Flags:
  --into <path>       Specify target docs directory (auto-detected if not provided)
  --feedback-mode     Force feedback mode (less structured source, more reasoning guidance)
  --research-mode     Force research doc mode (structured source, more mechanical mapping)

---

## The 5-Phase Workflow

```
Phase 0           Phase 1                Phase 2              Phase 3
ORIENTATION   ──► DEEP UNDERSTANDING ──► HARMONIZATION    ──► OPTIMIZATION
(auto)            (ULTRATHINK)           HANDOFF               PROMPT
                                         GENERATION            GENERATION
                                                                   │
                                                                   ▼
                                                              Phase 4
                                                              OUTPUT &
                                                              MANIFEST
```

---

## Phase 0: ORIENTATION

**Duration:** 5-10 minutes
**Goal:** Find the source material, find the target docs, understand project structure
**Gate:** Know the source material, target doc set, project domain, and output location

### Protocol

#### Step 0.1: Read Foundation Documents

Read these if they exist (in order):
1. `AGENTS.md` — agent guidelines, toolchain, rules
2. `README.md` — project overview
3. `CLAUDE.md` — project-specific instructions (check both root and `.claude/`)

#### Step 0.2: Locate the Source Material

The source material is the new content to integrate — a research doc, feature plan, design review output, or reviewer feedback. If the user specified a path, use that. Otherwise, ask.

Classify the source:

```
RESEARCH DOC MODE (structured, detailed):
  Signals: >500 lines, clear section headers, data schemas, decisions/ADRs,
           invariants, state machines, detailed analysis, formal structure
  → Source has enough structure to map sections → affected doc sections
  → Harmonization prompt can be highly specific about what goes where
  → Less reasoning burden on the executing agent

FEEDBACK MODE (brief, less structured):
  Signals: <300 lines, bullet points, reviewer comments, informal notes,
           no formal sections, suggestions without full justification
  → Source requires MORE interpretation and reasoning
  → Harmonization prompt must include "implications to reason through"
  → Executing agent needs more latitude and reasoning guidance
  → More emphasis on cascading effects and consistency checking

HYBRID MODE (mix):
  Signals: some sections are detailed, others are brief notes or suggestions
  → Treat detailed sections as research, brief sections as feedback
  → Include both specific mapping AND reasoning guidance for each part
```

#### Step 0.3: Locate the Target Documentation Set

The target docs are the existing plan/layer docs that will absorb the new material. If the user specified `--into`, use that. Otherwise, scan:

```
SEARCH PATTERNS (priority order):
  docs/strategy/*layer*.md              → Layer docs (most common target)
  docs/strategy/*.md                    → Strategy directory
  docs/layers/*.md                      → Layer directory
  thoughts/layer-*/*.md                 → Layer subdirectories
  docs/plan*.md, docs/spec*.md          → Plan documents
  docs/*.md                             → Any structured doc set
```

Classify the target:
- **Multi-doc layer set**: Multiple layer docs + strategy/index/README
- **Single plan doc**: One monolithic plan document
- **Mixed doc set**: Plan doc + supporting docs with authority split

#### Step 0.4: Detect Project Domain

```
FINANCIAL/DEFI:
  Signals: vaults, pools, liquidity, AMM, settlement, collateral, fees,
           tokens, oracle, epoch, staking, governance, bonds
  → Integration must preserve: invariants, fee math, settlement flows, oracle deps
  → Common harmonization risks: breaking collateral math, fee accumulator consistency

DISTRIBUTED SYSTEMS:
  Signals: consensus, nodes, replication, sharding, networking, gossip,
           state machine, leader election, fault tolerance
  → Integration must preserve: consensus properties, networking assumptions, fault tolerance
  → Common harmonization risks: breaking safety/liveness guarantees

WEB APPLICATION:
  Signals: API, routes, middleware, auth, database, models, controllers,
           views, components, hooks, state management
  → Integration must preserve: API contracts, data model consistency, auth flows
  → Common harmonization risks: breaking existing API surface, permission model gaps

PROTOCOL DESIGN:
  Signals: messages, encoding, versioning, handshake, extensions,
           backwards compatibility, wire format
  → Integration must preserve: wire format, versioning, backwards compatibility
  → Common harmonization risks: breaking protocol state machines

INFRASTRUCTURE:
  Signals: deployment, CI/CD, containers, orchestration, monitoring,
           scaling, load balancing, service mesh
  → Integration must preserve: deployment flows, monitoring coverage, scaling assumptions
  → Common harmonization risks: breaking CI/CD pipelines, deployment dependencies
```

#### Step 0.5: Detect Implementation State

If the project has code alongside docs, determine what's built:

```
IMPLEMENTATION STATE:
  Which layers/phases are implemented?
  Which are partially implemented?
  Which are not implemented yet?

  This matters because:
  - Docs for implemented layers must not contradict running code
  - Docs must be clear about what exists vs what's aspirational
  - New material integration must preserve current-vs-target distinction
  - Integration must not imply unbuilt features are available

  If no code exists (pure documentation project): skip this step.
```

#### Step 0.6: Identify Output Location

```
Location priority for harmonymaxer/ root:
  1. harmonymaxer/ (if it already exists)
  2. docs/harmonymaxer/ (if docs/ exists)
  3. Create harmonymaxer/ at project root
```

---

## Phase 1: DEEP UNDERSTANDING (ULTRATHINK REQUIRED)

**Duration:** 30-90 minutes depending on doc set size and source material complexity
**Goal:** Deeply understand both the existing doc set AND the new material, then build a complete change impact map
**Gate:** Can articulate exactly what changes, where, why, and what consistency risks exist

### This Phase Cannot Be Rushed

The quality of the generated harmonization prompts depends ENTIRELY on how deeply both the existing docs and the new material are understood. A shallow pass produces generic prompts that miss affected documents, create contradictions, or lose important context. Deep understanding produces prompts that guide the integrating agent to exactly the right docs, sections, and consistency checks.

The difference between planmaxer and harmonymaxer is this: planmaxer generates handoffs for REVIEWERS who critique the docs. Harmonymaxer generates handoffs for INTEGRATORS who modify the docs. Integrators need more specific guidance — they need to know not just "what to think about" but "what to change where, and what not to break."

### Protocol

#### Step 1.1: Read the Complete Target Doc Set

Read EVERY document in the target set. For multi-layer projects, this means every layer doc, the strategy doc, the index, and the README. Do NOT skip docs that "probably aren't affected" — cross-cutting dependencies are only visible after reading everything.

Build a mental model of:
- The overall architecture and its key concepts
- How the docs relate to each other (authority split, cross-references)
- Key invariants, decisions, and data structures
- Terminology conventions and where each concept is authoritatively defined
- The narrative flow — how a reader would traverse the docs to understand the system
- Where existing content is thin, dense, or potentially stale

#### Step 1.2: Read the Complete Source Material

Read the ENTIRE research doc or feedback. For research docs, understand every section. For feedback, understand every point and its implications.

Build a mental model of:

```
WHAT THE SOURCE MATERIAL:

  ADDS (net-new concepts, capabilities, data structures, flows):
    List every concept that doesn't exist in the current docs at all.
    For each: where should it live? Which doc owns it?

  CHANGES (modifications to existing patterns, flows, or models):
    List every concept that exists but is being modified.
    For each: what specifically changes? What stays the same?

  CORRECTS (fixes to existing documentation):
    List every point where the source says the docs are wrong.
    For each: which doc, which section, what's incorrect?

  IMPLIES (cascading effects not explicitly stated):
    What does the source material assume or require that it doesn't
    explicitly state? What other docs must change for consistency
    even though the source doesn't mention them?
```

#### Step 1.3: Classify the Integration

```
INTEGRATION TYPE (most integrations are a MIX — classify the primary type):

  FEATURE ADDITION:
    New capability being added to the system.
    Primarily adds new sections to existing docs.
    May introduce new invariants, decisions, data structures.
    Risk: new material contradicting implicit assumptions in existing docs.

  ARCHITECTURE EVOLUTION:
    Existing patterns being refined or replaced.
    Primarily modifies existing sections in docs.
    May deprecate old patterns and introduce new ones.
    Risk: partial updates leaving some docs on the old model.

  FEEDBACK CORRECTION:
    External review feedback being incorporated.
    Mix of corrections, clarifications, and enhancements.
    May affect terminology, invariants, edge cases.
    Risk: addressing literal feedback but missing its implications.

  CROSS-CUTTING CONCERN:
    New material that spans multiple layers/docs simultaneously.
    Affects many docs with consistency requirements between them.
    Risk: docs telling slightly different versions of the same story.
```

#### Step 1.4: Build the Change Impact Map (CRITICAL)

This is the most important analytical step. For EACH concept in the new material, determine:

```
CHANGE IMPACT MAP:

For each new/changed concept:
  1. CONCEPT: What is it? (one-line name and description)
  2. SOURCE LOCATION: Where in the source material is it described?
  3. AFFECTED DOCS: Which target docs does it touch?
  4. AFFECTED SECTIONS: Which specific sections within each doc?
  5. CHANGE TYPE: Add new section? Modify existing? Replace? Clarify?
  6. CONTRADICTION RISK: Does it conflict with anything currently stated?
  7. CASCADING EFFECTS: What other docs/sections must be updated for consistency?
  8. TERMINOLOGY: Does it introduce new terms or change existing ones?
  9. INVARIANTS: Does it add, modify, or affect any invariants?
  10. DECISIONS: Does it add, modify, or affect any architectural decisions?
```

This map becomes the backbone of the harmonization handoff. Every entry maps to a specific section in the generated prompt's "Expected Document Changes" and "Core Harmonization Goals."

#### Step 1.5: Classify Affected Documents

Based on the change impact map, classify EACH target document:

```
DOCUMENT CLASSIFICATION:

  PRIMARY TARGETS (substantial changes needed):
    These docs receive the bulk of new material.
    Specific sections will be added, rewritten, or significantly expanded.
    List: which sections specifically, and what changes.
    The harmonizing agent must read these with extreme care.

  SECONDARY TARGETS (consistency alignment needed):
    These docs reference concepts that are changing.
    Terminology updates, cross-reference fixes, brief clarifications.
    List: which concepts need alignment, in which sections.
    The harmonizing agent must check these for contradictions.

  LIGHT TOUCH (may need minor updates):
    These docs might reference affected concepts tangentially.
    Only update if explicit contradictions exist after primary changes.
    Do not churn unnecessarily.

  UNAFFECTED (verify only):
    These docs appear unaffected based on the impact map.
    The harmonizing agent should still verify — sometimes cross-cutting
    effects are invisible until you re-read with the changes in mind.
```

#### Step 1.6: Identify Core Harmonization Goals

Extract the specific alignment targets — what must become consistent across ALL docs after harmonization:

```
HARMONIZATION GOALS:

For each major concept area the new material touches:
  - What must the docs CONSISTENTLY STATE across all affected docs?
  - What TERMINOLOGY must be used uniformly?
  - What DISTINCTIONS must be clear everywhere (not just where defined)?
  - What must NOT be stated (avoiding false implications)?
  - Which docs currently DISAGREE about this concept?

Frame goals as concrete statements, not generic advice:
  GOOD: "All docs must consistently state that T0 is the sole authority
         for operator-device trust. L1, L2, and L2.5 currently disagree."
  BAD:  "Auth should be consistent across docs."
```

#### Step 1.7: Identify Contradiction Risks and Edge Cases

```
RISK IDENTIFICATION:

  DIRECT CONTRADICTIONS:
    Where does the new material directly conflict with existing doc text?
    List the specific doc, section, and conflicting statement.
    For each: which direction should win? (typically: new material wins
    for its domain, existing docs win for unrelated domains)

  TERMINOLOGY CONFLICTS:
    Where does the new material use different terms for existing concepts?
    Or where does it redefine existing terms with new meaning?
    For each: which term should the unified docs use?

  SCOPE CONFLICTS:
    Where does the new material expand or narrow the scope of existing features?
    This can create implicit contradictions if not handled carefully.
    For each: what text in other docs becomes stale?

  TEMPORAL CONFLICTS:
    Where does the new material assume features that aren't built yet?
    The docs must preserve current-vs-target distinction.
    For each: flag what needs "not yet implemented" caveats.

  CASCADING RISKS:
    What changes in doc A will make doc B inconsistent if B isn't also updated?
    These are the most dangerous — they're invisible until someone reads
    both docs together after only one was updated.
    For each: explicitly list the doc B sections that must also change.
```

#### Step 1.8: Determine Integration Principles

Based on the full analysis, determine the specific principles for THIS harmonization:

```
INTEGRATION PRINCIPLES (project-specific):

  - CONFLICT RESOLUTION: Which source wins when there's a conflict?
    (new material for its domain, existing docs for unrelated domains)
  - PLACEMENT: How should the new material's structure map to existing doc structure?
    (integrate into existing sections, or add new subsections?)
  - DETAIL LEVEL: What level of detail must be preserved from the source material?
    (full absorption — source must become redundant after harmonization)
  - TERMINOLOGY: Should the source material's terminology override existing conventions?
    (decide case by case, document each decision)
  - EXCLUSIONS: What must stay OUT of the docs?
    (implementation sequencing, task planning, bead design, tool instructions)
  - TEMPORAL HONESTY: What current-vs-target distinctions must be maintained?
    (don't write as if unbuilt features exist)
  - ABSORPTION TEST: After harmonization, is the source doc truly redundant?
    (an engineer should NEVER need to read the source to implement)

  IF FEEDBACK MODE:
  - AMBIGUITY HANDLING: For each ambiguous feedback point, what reasoning
    questions must the harmonizing agent answer before editing?
  - INFERENCE DEPTH: How far should the agent extrapolate from brief feedback?
    (trace implications but flag assumptions for user verification)
```

---

## Phase 2: HARMONIZATION HANDOFF GENERATION

**Duration:** 30-60 minutes
**Goal:** Generate a comprehensive prompt that will guide another agent through integrating the new material into the target docs
**Gate:** Prompt is self-contained, project-specific, and produces consistent docs

This is the PRIMARY output. The harmonization handoff prompt must contain enough context and specificity that the executing agent knows exactly what to read, what to change, what consistency checks to perform, and what NOT to do.

### What the Harmonization Handoff Must Contain

See **references/TEMPLATES.md -> Harmonization Handoff Template** for the full structure.

The harmonization handoff must include ALL of:

```
1. MISSION STATEMENT
   Frame the agent as a chief systems integrator updating master architecture.
   Clear deliverable: updated documentation that fully absorbs the new material.
   "You are editing documentation only. Do not change code."
   Primary goal: one coherent model, no contradictions, no stale content.
   Secondary goal: implementation-safe docs — no ambiguity that could produce
   incompatible implementations from different docs.

2. IMPLEMENTATION CONTEXT (include only if code exists alongside docs)
   What's implemented vs partially implemented vs not yet built.
   Worldview constraint: harmonize for intended architecture, but don't write
   as if unbuilt features exist in code.
   Concrete list of what's built (layers/phases/modules with status).
   "Make the documents clear about what is implemented, what is foundationally
   in place, and what remains future architecture."

3. MANDATORY PRE-READ REQUIREMENT (CRITICAL — from Phase 1 analysis)
   "Before you touch any documentation, you MUST perform a deep-reading and
   comparison pass."
   This is not optional. Do not start editing after reading only the source.
   Required steps:
   a. Read the source material in full
   b. Read every relevant target doc in full
   c. Read overview/index docs in full
   d. Inspect code surfaces for implementation drift (if applicable)
   e. Build a private comparison matrix:
      - intended architecture (from source material)
      - current documented behavior
      - current implemented behavior (if code exists)
   f. Only THEN begin harmonizing the docs
   You must not skip or collapse this research pass.

4. WHAT TO READ (with exact paths and reading priorities)
   Primary source: path, line count, what to focus on, key conclusions
   that must not be diluted.
   Target docs grouped by priority (primary → secondary → light touch),
   each with a parenthetical note about what to focus on.
   Overview/index docs.
   Code surfaces (if applicable): paths with note "read for drift awareness,
   not changing code."

5. CORE HARMONIZATION GOALS (from Phase 1 Step 1.6 — numbered, specific)
   Each goal: what must become consistent + which docs it affects.
   These are the SPECIFIC things the agent must align.
   Each goal should include enough context that the agent knows WHY
   this alignment matters, not just WHAT to align.

6. EXPECTED DOCUMENT CHANGES (from Phase 1 Steps 1.4-1.5)
   Grouped by priority:
   - Highest-priority docs: which specific sections need what changes
   - Secondary docs: which concepts need alignment in which sections
   - Light-touch docs: only if specific contradictions exist
   "If a doc already matches the source direction, do not churn it."

7. INTEGRATION RULES
   What must be true after harmonization:
   - No contradictions between any pair of docs
   - No stale terminology surviving in any doc
   - No implicit assumptions that contradict the source material
   What must stay OUT:
   - Implementation task planning / bead sequencing
   - Tool-specific dev instructions
   - Design iteration workflow
   - "first implement X then Y" language
   What must be ADDED where existing docs are too vague:
   - Explicit statements replacing hand-waving
   - New sections for concepts that didn't exist before
   - Updated cross-references
   Style rules:
   - Preserve each document's local style and section structure
   - Integrate into existing sections, not dump as appendices
   - If a concept is missing entirely, add a properly placed subsection

8. FEEDBACK MODE REASONING GUIDANCE (include only if source is feedback mode)
   For each ambiguous or underspecified feedback point:
   - What is the implication for the architecture?
   - What cascading changes does this imply across docs?
   - What questions must the agent answer before editing?
   Interpretation principles:
   - When feedback says "X should be Y," what does that mean for each doc?
   - When feedback is silent on a topic: "keep as is" or "needs thought"?
   - Where must the agent use judgment vs where is the direction clear?

9. WHAT A GREAT OUTCOME LOOKS LIKE
   Concrete success criteria specific to THIS integration.
   "An engineer reading only the harmonized docs gets one coherent {model}."
   "The docs should now clearly distinguish {X} from {Y}."
   "The docs no longer imply {stale assumption}."
   "Edit until this standard is met, not until you've touched the obvious files."

10. DELIVERABLE
    Updated documentation files.
    Concise change summary: which docs changed, what was resolved, what remains open.
    At minimum expect to modify: {list of primary + secondary target docs}.

11. FINAL VERIFICATION CHECKLIST
    Before stopping, verify:
    - Every modified doc was re-read after editing
    - No modified doc contradicts the source material
    - No modified doc contradicts another target doc
    - No modified doc gained implementation sequencing content
    - {project-specific verification items from Phase 1 risk analysis}

12. FOLLOW-UP FRESH-EYES PASS (built-in sub-optimization)
    Marked clearly: "> Send this as a follow-up message in the same session"
    Re-read source + every modified doc with completely fresh eyes.
    Contradiction hunt for SPECIFIC terms/concepts identified in Phase 1.
    Verify no stale wording remains.
    Verify no implementation planning leaked in.
    Bump versions/changelog entries where appropriate.
```

### What Makes a Great Harmonization Handoff

```
GREAT harmonization handoffs:
  ✓ Include a mandatory pre-read with comparison matrix
  ✓ Harmonization goals are SPECIFIC to the material being integrated
  ✓ Affected docs are classified by priority with specific section references
  ✓ Integration rules distinguish what must change vs what must stay
  ✓ Success criteria reference specific concepts from THIS integration
  ✓ Follow-up pass targets specific terms/concepts to hunt for
  ✓ Implementation context (if applicable) is concrete with layer/phase status
  ✓ For feedback mode: includes reasoning guidance for ambiguous points

BAD harmonization handoffs:
  ✗ "Integrate this into the docs" with no specifics
  ✗ No pre-read requirement (agent will start editing immediately and miss deps)
  ✗ Generic harmonization goals ("make docs consistent")
  ✗ Missing affected doc classification (agent has to guess what to read)
  ✗ No integration rules (agent will dump appendices everywhere)
  ✗ No follow-up pass (contradictions will survive the first pass)
  ✗ No implementation context (agent can't distinguish current vs target state)
  ✗ For feedback mode: no reasoning guidance (agent will integrate literally)
```

---

## Phase 3: HARMONIZATION OPTIMIZATION GENERATION

**Duration:** 15-25 minutes
**Goal:** Generate a comprehensive fresh-eyes optimization prompt that verifies harmonization quality
**Gate:** Prompt covers all audit dimensions, targets project-specific risks, and includes a follow-up pass

### This Is the Final Architecture QA Gate

The optimization prompt must force the agent to re-read BOTH the source material and every target doc, then systematically verify that the harmonization is flawless. The standard is "boringly consistent" — no doc should tell a different story about any concept the source material touches.

### What the Optimization Must Check

See **references/TEMPLATES.md -> Harmonization Optimization Template** for the full structure.

```
The optimization prompt should instruct the agent to:

1. DEEP RE-READ (mandatory before any audit)
   - Re-read source material in full
   - Re-read every target doc in full (not just modified ones — ALL of them)
   - Build a fresh mental model
   - Note any remaining divergences

2. CONTRADICTION HUNT
   For each core concept from the source material:
   - Search every doc for statements about this concept
   - Verify all statements are mutually consistent
   - Flag any remaining stale or conflicting language
   Include a SPECIFIC list of terms/concepts to hunt for (from Phase 1 analysis).

3. DOC BOUNDARY SANITY
   Verify concept ownership hasn't drifted:
   - Each concept is still authoritatively defined in the right doc
   - Cross-references between docs are correct and bidirectional
   - No doc has accidentally absorbed material that belongs elsewhere
   - Authority split (strategy vs layer docs vs index) is maintained

4. IMPLEMENTATION READINESS
   Ask: could an engineer implement from only the docs?
   - Are the integrated concepts clear enough to implement?
   - Are boundaries between related concepts unmistakable?
   - Could engineers reading different docs derive compatible implementations?
   - Is current-vs-target distinction maintained where applicable?
   - Could the engineer still misread any integrated concept?

5. OVERREACH CHECK
   Verify the harmonization didn't:
   - Add implementation sequencing or task planning
   - Include "first implement X, then Y" language
   - Blur into execution guidance
   - Over-specify things that are still design choices

6. ABSORPTION COMPLETENESS
   Verify the source material is FULLY absorbed:
   - Every concept from the source has a home in the target docs
   - Nothing was silently dropped
   - The source doc is now genuinely redundant
   - An engineer does NOT need to read the source to get the full picture

7. TERMINOLOGY CONSISTENCY
   Verify all documents use identical terminology for:
   - {specific terms from Phase 1 analysis}
   - No doc uses an old term that was replaced
   - No doc defines a term differently than other docs

8. FIX AND FINAL FRESH-EYES PASS
   Fix issues with targeted edits, not wholesale rewrites.
   After all fixes, re-read everything ONE MORE TIME.
   "Imagine you are the implementation engineer and the docs are the only
   thing you get. Could you still misread anything about {key concepts}?"
   Fix anything that fails this test.
```

Include project-specific audit items based on the Phase 1 analysis — the specific terms, distinctions, and contradiction risks most likely to survive imperfectly.

---

## Phase 4: OUTPUT & MANIFEST

**Duration:** 5 minutes
**Goal:** Archive previous run (if any), write all prompts, and report to user

### Archive Previous Run

Before writing new prompts, check if `harmonymaxer/active/` has existing content:

```
1. READ the current run number from harmonymaxer/.run
   (if file doesn't exist, assume run 0)

2. IF active/ has content:
   a. CREATE harmonymaxer/archived/run-{NNN}/ (zero-padded to 3 digits)
   b. MOVE all contents of active/ into the archive directory
   c. INCREMENT the run counter in .run

3. Recreate empty active/ directory
```

### Output Location

```
Location priority for harmonymaxer/ root:
  1. harmonymaxer/ (if it already exists at project root)
  2. docs/harmonymaxer/ (if docs/ exists)
  3. Create harmonymaxer/ at project root

Create if needed:
  harmonymaxer/active/
  harmonymaxer/.run (set to 0 if doesn't exist)
```

### File Names

```
harmonymaxer/active/harmonization-handoff.md
harmonymaxer/active/harmonization-optimization.md
```

### Report to User

```
HARMONYMAXER OUTPUT (run {N}):
  Source material: {path} ({line_count} lines, mode: {RESEARCH | FEEDBACK | HYBRID})
  Integration type: {FEATURE_ADDITION | ARCHITECTURE_EVOLUTION | FEEDBACK_CORRECTION | CROSS_CUTTING}
  Target doc set: {path} ({N} docs)

  Change Impact Summary:
    Primary targets ({N} docs):
      - {doc_path} — {what changes, which sections}
      - ...
    Secondary targets ({N} docs):
      - {doc_path} — {what needs alignment}
      - ...
    Light touch ({N} docs):
      - {doc_path} — {only if contradictions exist}

  Core harmonization goals:
    1. {goal_1}
    2. {goal_2}
    ...

  Key risks identified:
    - {risk_1}
    - {risk_2}

  Generated:
    1. harmonymaxer/active/harmonization-handoff.md
       → Run FIRST to integrate new material into docs
       → Includes built-in fresh-eyes follow-up at end of same session
       → Best with: model that can handle large context (reads many docs)

    2. harmonymaxer/active/harmonization-optimization.md
       → Run AFTER harmonization is complete
       → Fresh-eyes verification and consistency audit
       → Includes built-in fresh-eyes follow-up at end of same session

  Workflow:
    1. Run harmonization-handoff.md (integrates new material)
    2. Send the "Follow-Up Pass" section as a second message in the same session
    3. Run harmonization-optimization.md (verifies consistency)
    4. Send the "Follow-Up Pass" section as a second message in the same session
    5. Source material should now be redundant — verify by spot-checking
    6. (Optional: run /planmaxer on the updated docs for expert domain reviews)
```

---

## Quality Gates

### Gate 0 -> 1: Orientation Complete
- [ ] Found source material with path, line count, and mode classification
- [ ] Found target doc set with all paths
- [ ] Know project domain
- [ ] Read AGENTS.md, README, CLAUDE.md if they exist
- [ ] Know implementation state (if code exists alongside docs)
- [ ] Know output location

### Gate 1 -> 2: Deep Understanding Complete
- [ ] Read every target doc fully — can articulate the current architecture
- [ ] Read source material fully — can articulate what it adds/changes/corrects/implies
- [ ] Classified integration type (feature/evolution/feedback/cross-cutting)
- [ ] Built complete change impact map (concept -> affected docs -> sections -> change type)
- [ ] Classified every target doc (primary/secondary/light touch/unaffected)
- [ ] Identified all core harmonization goals (specific, not generic)
- [ ] Identified all direct contradictions with resolution direction
- [ ] Identified all terminology conflicts with preferred resolution
- [ ] Identified all cascading effects (changes in doc A that require changes in doc B)
- [ ] Determined integration principles specific to this project
- [ ] If feedback mode: identified all ambiguous points requiring interpretation

### Gate 2 -> 3: Harmonization Handoff Generated
- [ ] Has mandatory pre-read requirement with comparison matrix
- [ ] Source material path and reading instructions included
- [ ] All target docs listed with priority classification and section specifics
- [ ] Core harmonization goals are project-specific (reference specific docs/sections)
- [ ] Expected document changes specify which sections in which docs
- [ ] Integration rules clearly separate what changes from what stays out
- [ ] Success criteria reference specific concepts from this integration
- [ ] Final verification checklist is specific to this integration
- [ ] Follow-up fresh-eyes pass targets specific terms/concepts
- [ ] If feedback mode: includes reasoning guidance for ambiguous points
- [ ] If code exists: includes implementation context with layer/phase status

### Gate 3 -> 4: Optimization Prompt Generated
- [ ] Has all 8 audit dimensions
- [ ] Contradiction hunt targets specific terms from Phase 1 analysis
- [ ] Absorption completeness check covers every source concept
- [ ] Implementation readiness questions are project-specific
- [ ] Terminology consistency check lists specific terms to verify
- [ ] Follow-up pass targets specific concepts most likely to survive wrong
- [ ] Required output format included (docs changed, contradictions removed, ambiguities tightened)

---

## Anti-Patterns

### The Appendix Dump
```
BAD: New material gets dumped as a new appendix at the end of each doc.

WHY: This produces fragmented docs where the "real" architecture is in the
original sections and the "new" material is bolted on as an afterthought.
Integration means weaving the new material INTO existing sections so the
doc reads as one coherent document, not as "original + patch."
```

### The Surface Skim
```
BAD: Read source material, skim target docs, start editing immediately.

WHY: Cross-document contradictions are only visible after deeply reading
ALL docs. The mandatory comparison matrix exists because shortcuts here
produce contradictions that survive into implementation.
```

### The Terminology Split
```
BAD: New material uses term "A" while existing docs use term "B" for the
same concept, and both survive the harmonization.

WHY: Engineers reading different docs will implement incompatible models.
Terminology must be unified — pick one term and use it everywhere.
```

### The Scope Creep
```
BAD: Harmonization expands into implementation planning, task sequencing,
or bead design.

WHY: Harmonization is architecture docs only. The moment you start writing
"first implement X, then Y," you've crossed into execution planning.
Keep the docs describing WHAT the architecture is, not HOW to build it.
```

### The Silent Drop
```
BAD: Source material has 10 concepts but only 7 survive into the harmonized docs.

WHY: The absorption test requires EVERY concept from the source to have a home
in the target docs. If a concept was intentionally excluded, the change summary
must say so and justify why. Silent omission creates a documentation gap that
will surface during implementation.
```

### The False Consistency
```
BAD: Docs use the same words but mean different things in different contexts.
Or docs avoid stating anything concrete to "not contradict" each other.

WHY: Consistency requires substance, not just shared vocabulary. Each doc
must make concrete, specific statements that are compatible with every
other doc's concrete, specific statements.
```

### The Overcorrection
```
BAD: Docs for unaffected components get rewritten just because they're
nearby in the doc set.

WHY: Unnecessary churn creates review burden, risks introducing new
inconsistencies, and makes it harder to see what actually changed.
Only modify docs that genuinely need it — churn without cause is noise.
```

### The Literal Integration
```
BAD: Brief feedback says "auth should use trust tiers" and the agent
adds "auth should use trust tiers" to a doc without reasoning about
what that means for session management, API keys, device pairing, etc.

WHY: Feedback mode requires REASONING about implications. The agent must
trace the feedback through every affected subsystem, not just parrot it
into the nearest section. The harmonization prompt must include reasoning
guidance that forces this depth.
```
