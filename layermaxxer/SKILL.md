---
name: layermaxxer
description: "Decompose monolithic plans into sequentially-shippable layers with complete execution pipeline. Use when: user says 'layermaxxer', 'decompose into layers', 'create layer strategy', 'shard this plan', 'layer decomposition', 'shippable layers', or '/layermaxxer'. Reads monolithic research/plan documents, deeply understands the architecture, and generates the complete prompt pipeline: strategy creation → strategy optimization → beads creation → beads optimization → execution kickoff/push. Works on any codebase."
user_invocable: true
compatibility: "Works with Claude Code, Codex, and any Agent Skills-compatible tool."
metadata:
  author: steel
  version: "1.0"
---

# Layermaxxer — Monolith-to-Layers Decomposition Engine

> Transform any monolithic plan or research document into sequentially-shippable layers, with a complete prompt pipeline from strategy through execution.

---

## The Pipeline

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   /layermaxxer                                                          │
│       │                                                                 │
│       ├── Generates: STRATEGY HANDOFF      → layermaxxer/active/        │
│       ├── Generates: STRATEGY OPTIMIZATION → layermaxxer/active/        │
│       ├── Generates: BEADS CREATION        → layermaxxer/active/        │
│       ├── Generates: BEADS OPTIMIZATION    → layermaxxer/active/        │
│       ├── Generates: EXECUTION KICKOFF     → layermaxxer/active/        │
│       └── Generates: EXECUTION PUSH        → layermaxxer/active/        │
│                                                                         │
│   USER RUNS strategy handoff → produces layer strategy document         │
│       │                                                                 │
│   USER RUNS strategy optimization → refines strategy with fresh eyes    │
│       │                                                                 │
│   USER RUNS beads creation → produces bead graph from strategy          │
│       │                                                                 │
│   USER RUNS beads optimization → audits and fixes bead graph            │
│       │                                                                 │
│   USER RUNS execution kickoff/push → agents execute beads               │
│       │                                                                 │
│   (optional: run /planmaxer on the produced layer docs for review)      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### File Structure

```
layermaxxer/                         (lives at project root or docs/layermaxxer/)
├── active/                          (current run — generated prompts)
│   ├── strategy-handoff.md          (prompt to create layer strategy document)
│   ├── strategy-optimization.md     (prompt to optimize the strategy)
│   ├── beads-creation.md            (prompt to convert strategy into beads)
│   ├── beads-optimization.md        (prompt to audit and fix bead graph)
│   ├── execution-kickoff.md         (prompt to onboard fresh execution agents)
│   └── execution-push.md           (prompt to push continuing execution agents)
├── archived/                        (previous runs — kept for reference)
│   ├── run-001/
│   └── run-002/
└── .run                             (counter file: current run number)
```

All layermaxxer artifacts are **temporary working prompts** — they exist to drive the decomposition pipeline, not to be permanent documentation. The produced layer strategy document and canonical layer docs ARE the permanent outputs.

### Pipeline Sequencing — Sequential Invocation

The 6 prompts have a **strict dependency chain**. Downstream prompts become fully project-specific only after upstream prompts produce their outputs:

```
/layermaxxer (first run)
    │
    ├── strategy-handoff.md        ← FULLY FILLED (needs only source doc)
    ├── strategy-optimization.md   ← FULLY FILLED (needs only source doc)
    │
    ├── beads-creation.md          ← SCAFFOLD (maintained doc set TBD until
    ├── beads-optimization.md      ←   strategy defines layer count + names)
    ├── execution-kickoff.md       ←   Marked with {AFTER_STRATEGY} sections.
    └── execution-push.md          ←   Still 90% filled from Phase 1 analysis.

User runs strategy-handoff → produces strategy doc
User runs strategy-optimization → refines strategy

/layermaxxer --beads-only (second run — reads existing strategy doc)
    │
    ├── beads-creation.md          ← NOW FULLY FILLED (knows layer count, file paths)
    └── beads-optimization.md      ← NOW FULLY FILLED

User runs beads-creation → produces bead graph
User runs beads-optimization → audits beads

/layermaxxer --execution-only (third run — reads strategy + current state)
    │
    ├── execution-kickoff.md       ← NOW FULLY FILLED (real maintained set,
    └── execution-push.md          ←   real architectural truths from layer docs)
```

On the first run, downstream prompts are generated as **structured scaffolds**: everything the skill CAN fill in from Phase 1 analysis (project context, architectural truths, quality criteria, platform constraints) IS filled in. Only the maintained doc set section is marked `{AFTER_STRATEGY: re-run /layermaxxer --beads-only after strategy defines layer count}`. Re-running with `--beads-only` or `--execution-only` reads the existing strategy document and auto-fills these sections.

Each re-run archives the previous `active/` contents to `archived/run-NNN/` before generating new prompts.

---

## Arguments

```
/layermaxxer [source doc path] [flags]

Examples:
  /layermaxxer                              Full run — generate all prompts (first invocation)
  /layermaxxer docs/research/plan.md        Specify the source document explicitly
  /layermaxxer --strategy-only              Only generate strategy handoff + optimization
  /layermaxxer --beads-only                 After strategy exists: generate fully-filled beads prompts
  /layermaxxer --execution-only             After strategy exists: generate fully-filled execution prompts
```

---

## The 8-Phase Workflow

```
Phase 0           Phase 1             Phase 2             Phase 3
ORIENTATION   ──► DEEP UNDERSTANDING ──► STRATEGY       ──► STRATEGY
(auto)            (ULTRATHINK)           HANDOFF            OPTIMIZATION
                                         GENERATION         PROMPT
                                                                │
                                                                ▼
Phase 7       Phase 6             Phase 5             Phase 4
OUTPUT &  ◄── EXECUTION       ◄── BEADS            ◄── BEADS
MANIFEST      PROMPT              OPTIMIZATION         CREATION
              GENERATION          PROMPT               HANDOFF
```

---

## Phase 0: ORIENTATION

**Duration:** 5-10 minutes
**Goal:** Find the monolithic source document and understand project structure
**Gate:** Know the source doc, project type, tech stack, and output location

### Protocol

#### Step 0.1: Read Foundation Documents

Read these if they exist (in order):
1. `AGENTS.md` — agent guidelines, toolchain, rules
2. `README.md` — project overview
3. `CLAUDE.md` — project-specific instructions (check both root and `.claude/`)

#### Step 0.2: Locate the Monolithic Source Document

The source document is the dense design/research/plan doc that needs decomposition into layers. If the user specified a path, use that. Otherwise, scan:

```
SEARCH PATTERNS (priority order):
  docs/research/*research*.md          → Research document (most likely)
  docs/research/*.md                   → Research directory
  docs/plan*.md, docs/design*.md       → Plan documents
  docs/spec*.md, docs/architecture*.md → Spec documents
  *-research.md, *-plan.md, *-spec.md  → Root-level plan docs
  docs/**/*.md                         → Any large structured doc
```

The source document is typically:
- The LARGEST markdown file in the project
- Dense, interconnected, covering multiple subsystems
- Contains design decisions, invariants, data schemas, or API definitions
- Has cross-references between sections

#### Step 0.3: Detect Project Domain

```
FINANCIAL/DEFI:
  Signals: vaults, pools, liquidity, AMM, settlement, collateral, fees,
           tokens, oracle, epoch, staking, governance, bonds
  → Include financial mechanics investigation
  → Loop anchor: a complete settlement/trading cycle

DISTRIBUTED SYSTEMS:
  Signals: consensus, nodes, replication, sharding, networking, gossip,
           state machine, leader election, fault tolerance
  → Include consensus/networking investigation
  → Loop anchor: a complete request lifecycle or consensus round

WEB APPLICATION:
  Signals: API, routes, middleware, auth, database, models, controllers,
           views, components, hooks, state management
  → Include API/data flow investigation
  → Loop anchor: a complete user flow (signup → action → result)

PROTOCOL DESIGN:
  Signals: messages, encoding, versioning, handshake, extensions,
           backwards compatibility, wire format
  → Include protocol lifecycle investigation
  → Loop anchor: a complete message exchange cycle

INFRASTRUCTURE:
  Signals: deployment, CI/CD, containers, orchestration, monitoring,
           scaling, load balancing, service mesh
  → Include deployment/operations investigation
  → Loop anchor: a complete deploy-to-production cycle
```

#### Step 0.4: Detect Existing Pipeline State

Check if earlier pipeline outputs already exist (critical for `--beads-only` and `--execution-only` re-runs):

```
EXISTING STRATEGY DOC:
  {strategy_dir}/*layer-strategy*.md or *-layer-strategy*.md
  If found: read it. Extract layer count, layer names, maintained file list.
  Downstream prompts can now be FULLY FILLED instead of scaffolds.
  If not found: downstream prompts generated as scaffolds with {AFTER_STRATEGY} markers.

EXISTING LAYER DOCS:
  {strategy_dir}/*layer-1*.md, *layer-2*.md, etc.
  If found: extract architectural truths, invariants, open questions for execution prompts.

EXISTING BEAD GRAPH:
  .beads/ directory or bead tool present
  If found: execution prompts reference bead commands.
  If not found: execution prompts still generated (user may use different task system).
```

#### Step 0.5: Identify Output Conventions

Determine what the layer strategy should produce:
- Does `docs/strategy/` already exist? Use it.
- What naming conventions does the project use?
- Is there an existing doc set? What should it become?

---

## Phase 1: DEEP UNDERSTANDING (ULTRATHINK REQUIRED)

**Duration:** 30-90 minutes depending on source doc size
**Goal:** Deeply understand the entire architecture — every primitive, every decision, every dependency
**Gate:** Can explain the architecture to a domain expert without referring to the docs

### This Phase Cannot Be Rushed

The quality of EVERY generated prompt depends on how deeply the source document is understood. Shallow understanding produces generic prompts that lead to naive "one component per layer" decompositions. Deep understanding produces prompts that capture the TRUE cross-cutting dependency graph.

### Protocol

#### Step 1.1: Read the Complete Source Document

Read the ENTIRE source document. For large documents (>3000 lines), read in chunks but do NOT skip sections. Cross-cutting dependencies are only visible when you've read multiple subsystems together.

#### Step 1.2: Extract Core Value Proposition

Understand WHY this project exists and what makes the design approach unique:

```
VALUE PROPOSITION:
  What problem does this project solve? For whom?
  What is the core "unlock" — the thing that makes this possible/better/unique?
  What existing solutions does it replace or improve on?
  What is the key insight that makes the decomposition non-trivial?

COMPETITIVE FRAMING:
  What are the closest alternatives?
  Where does this project deliberately differ from conventional wisdom?
  What tradeoffs does the design REFUSE to make?

SUCCESS CRITERIA:
  What would "this decomposition is optimal" look like?
  What tradeoffs would the user NEVER make for layer boundaries?
  What would cause the user to reject a proposed decomposition entirely?
  What is the user's thesis about WHY their specific design approach wins?
```

#### Step 1.3: Extract Architecture for Layer Decomposition

This extraction is specifically oriented toward finding layer boundaries:

```
COMPONENTS:
  What are the major programs/services/modules?
  What are the shared libraries/crates/packages?
  What are the extension/plugin components?

DATA STRUCTURES:
  What are the core data types/accounts/models?
  What are the PDA seeds / primary keys / schema constraints?
  Which components own which data types?
  Which components READ data owned by other components?

OPERATIONS:
  What are all the instructions/endpoints/functions?
  Which operations are atomically paired (MUST execute together)?
  Which operations have cross-component dependencies?

DEPENDENCIES (CRITICAL):
  Component-to-component dependency graph
  Data-to-component ownership map
  Operation-to-data dependency matrix
  Circular dependencies and their resolutions
  Shared infrastructure (math libraries, common types, etc.)

INVARIANTS:
  What rules must NEVER be violated?
  At what point in the lifecycle does each invariant become relevant?
  Which are constitutional (immutable in code) vs runtime-enforced?
  Which invariants span multiple components?

DECISIONS:
  What architectural decisions have been made (ADRs/RFCs)?
  Which are irreversible? Which constrain future options?
  Which feel undertested or fragile?

THE LOOP (CRITICAL — THIS IS YOUR LAYER BOUNDARY ANCHOR):
  What is the system's fundamental operational cycle?
  What is the minimum set of components needed for one complete cycle?
  What data flows through the cycle?
  Where are the state transitions?
  The first user-facing layer MUST complete this loop end-to-end.

EXTENSION POINTS:
  What capabilities are designed for later activation?
  What forward-compatibility mechanisms exist?
  Where is the cleanest boundary between core and extensions?
```

#### Step 1.4: Identify Layer-Decomposition Traps

These are the project-specific gotchas that will break a naive decomposition:

```
ATOMIC PAIRS:
  Which operations MUST ship in the same layer because they're
  atomically composed at runtime? Never split a pair across layers.

ACCUMULATOR PATTERNS:
  What state tracking mechanisms must exist from the FIRST operation?
  (Fee accumulators, counters, checkpoints that can't be retrofitted)

DAY-1 SAFETY:
  What safety invariants must be enforced from the very first layer?
  What would happen if they were "added later"?

FORWARD COMPATIBILITY:
  What interfaces in early layers must accommodate later layers?
  What schema fields must exist (even if unused) from day 1?
  What extension points need to be designed upfront?

GOVERNANCE BOOTSTRAPPING:
  How are parameters set before governance/admin systems are built?
  How does control transition from bootstrapped to permanent?

COMPLEXITY SPECTRUMS:
  Where does the design span from "simple now" to "complex later"?
  What must be schema-ready from day 1 vs code-activated later?

BAD DECOMPOSITION:
  What would a naive "one component per layer" look like for THIS project?
  Why would it fail? Which integration points would break?
  Document this specifically — it becomes an example in the strategy handoff.
```

#### Step 1.5: Determine Maintained Doc Set

Based on the architecture, estimate the final maintained documentation set:

```
MAINTAINED DOC SET:
  How many layers does the architecture suggest? (typically 4-8)
  One strategy/overview doc
  One cross-reference index doc
  One README
  One canonical doc per layer
  Total: typically 8-12 files

AUTHORITY SPLIT:
  Strategy doc: rollout order, dependency rationale, sequencing
  Index doc: cross-reference navigation
  Layer docs: execution-grade source of truth for each layer
  README: project overview and document map
```

---

## Phase 2: STRATEGY HANDOFF GENERATION

**Duration:** 30-60 minutes
**Goal:** Generate a comprehensive prompt that will produce a layer strategy document
**Gate:** Prompt is self-contained, project-specific, and would produce a high-quality strategy doc

This is the MOST IMPORTANT generated artifact. The strategy handoff prompt determines the quality of every downstream step.

### What the Strategy Handoff Must Contain

See **references/TEMPLATES.md → Strategy Handoff Template** for the full structure.

The strategy handoff must include ALL of:

```
1. MISSION STATEMENT
   Frame the agent as an implementation architect.
   Clear deliverable: a single strategy document.
   Scope: strategy and sequencing ONLY, not per-layer spec docs.

2. SOURCE MATERIAL
   Primary source path + reading instructions.
   Secondary sources (AGENTS.md, README, etc.).
   "Do NOT skim this document" — explain WHY cross-cutting deps matter.

3. STRUCTURED RESEARCH PROTOCOL (CRITICAL)
   5-7 parallel investigations tailored to the project domain.
   Each investigation: specific sections to read, structured output to produce,
   key questions to answer.
   Synthesis phase: unified dependency maps + activation sequences.
   "Only AFTER completing synthesis should you begin designing layers."

   STANDARD INVESTIGATIONS (always include):
   A. Data Structure / Account Cartography
   B. Invariant & Safety Map
   C. Operation / Instruction Dependency Map
   D. Decision (ADR/RFC) Catalog & Capability Map
   E. Core Lifecycle / Flow Analysis

   DOMAIN-SPECIFIC INVESTIGATIONS (include when relevant):
   F. Financial Mechanics & Economic Dependencies (DeFi/fintech)
   G. Extension / Plugin Architecture (if extension layer exists)
   H. Consensus / Networking (distributed systems)
   I. API / Data Flow (web applications)

4. CRITICAL CONTEXT
   What the project is (2-3 paragraphs, precise, no hand-waving).
   Component architecture with dependency arrows.
   Financial/economic mechanics if relevant — WHY they matter for layering.
   Non-negotiable architectural constraints (5-8 constraints).
   The complete dependency graph (with circular dependency resolutions).
   Platform-specific context for layer feasibility (schema stability,
   upgrade mechanisms, testing infrastructure).

5. THE LOOP ANCHOR
   The system's fundamental operational cycle, fully enumerated.
   Every step, every operation, every state transition.
   What can be deferred vs what must be in the first layer.
   "Your first user-facing layer MUST complete at least one full cycle."

6. THINGS THAT WILL BREAK THE STRATEGY IF MISSED
   Atomic operation pairing traps (with specific pairs listed).
   Accumulator/state-tracking that must exist from first operation.
   Day-1 safety requirements.
   Forward-compatibility requirements.
   Governance bootstrapping problem.
   Complexity spectrum decisions.
   A CONCRETE EXAMPLE of bad decomposition specific to THIS project.

7. WHAT "SHIPPABLE LAYER" MEANS
   Precise definition with 6-8 criteria:
   compiles, has complete happy path, independently testable,
   maintains all applicable invariants, defines stable interfaces,
   has clear definition of done, produces SDK surface, has automation support.
   What a layer MAY include (stubs, simplified modes).
   What a layer MUST NOT include (temporary patterns, schema migrations,
   relaxed invariants, split atomic pairs).

8. EXECUTION ARTIFACT POLICY
   Define the maintained doc set constraint for ALL downstream work:
   "The maintained end-state is intentionally small: one README, one index,
   one strategy doc, and exactly N canonical layer docs. No standalone
   cross-layer ledgers, companion docs, or decision files. Cross-cutting
   material must be embedded inside the relevant layer doc. Open questions
   live inside the owning layer doc under explicit blocker sections."
   This policy constrains beads design and agent execution downstream.
   The strategy author must define it as part of the strategy.

9. REQUIRED DOCUMENT STRUCTURE
   Exact section list for the strategy document per layer:
   capability delivered, components touched, data introduced,
   shared library additions, invariants enforced, what's stubbed,
   definition of done, test scenarios, SDK surface, automation needs,
   decisions addressed, dependencies, risks.
   Cross-layer sections: schema stability matrix, interface contracts,
   testing evolution, audit checkpoints, governance transition plan.

10. QUALITY CRITERIA
    "Good if" checklist (10+ criteria, project-specific).
    "Bad if" checklist (8+ criteria, project-specific).
    Both must reference specific aspects of THIS project.

11. PROCESS INSTRUCTIONS
    Step 1: Research (use subagents for parallel investigations).
    Step 2: Synthesize (build unified maps).
    Step 3: Identify minimum loop (the first layer core).
    Step 4: Work outward (correctness → value → cleanliness).
    Step 5: Validate (no forward refs, no invariant gaps, etc.).
    Step 6: Write the strategy document.
```

### What Makes a Great Strategy Handoff

```
GREAT strategy handoffs:
  ✓ Include a structured research protocol with parallel investigations
  ✓ Investigations are project-specific (reference actual sections/subsystems)
  ✓ Explain WHY cross-cutting deps matter with project-specific examples
  ✓ Include the complete operational loop as a layer boundary anchor
  ✓ Have a concrete bad-decomposition example for THIS project
  ✓ Define "shippable layer" precisely with project-relevant criteria
  ✓ Quality criteria reference specific project aspects
  ✓ Process instructions enforce research-before-design

BAD strategy handoffs:
  ✗ "Decompose this into layers" with no context
  ✗ Missing the loop anchor (no constraint on first layer content)
  ✗ No research protocol (reader will skim and produce naive decomposition)
  ✗ Generic quality criteria ("layers should be independent")
  ✗ Missing atomic pair documentation (layers will split paired operations)
  ✗ No bad example (reader will default to "one component per layer")
  ✗ No platform-specific context (reader won't know feasibility constraints)
```

---

## Phase 3: STRATEGY OPTIMIZATION PROMPT

**Duration:** 15-25 minutes
**Goal:** Generate a comprehensive fresh-eyes optimization prompt for the strategy document
**Gate:** Prompt covers structural validation, logical validation, project-specific checks, and layering quality

### This Is Not a Superficial Review

The optimization prompt must force the agent to re-read BOTH the source document and the strategy with completely fresh eyes, then systematically validate every aspect. The strategy is the foundation for months of work — an optimization pass that catches a single bad layer boundary saves weeks of downstream rework.

### What the Strategy Optimization Must Check

```
The optimization prompt should instruct the agent to:

1. DEEP RE-READ (mandatory before any validation)
   - Re-read the ENTIRE source document (not skim — full read)
   - Re-read the ENTIRE strategy document
   - Build a fresh mental model of both
   - Note any places where the strategy DIVERGES from the source

2. VALIDATE structural correctness (binary pass/fail — ANY failure = fix required):
   - No forward references (no layer uses data not introduced in an equal or prior layer)
   - No invariant gaps (no invariant is "temporarily relaxed" between layers)
   - No schema migrations between layers (only forward-compatible mechanisms)
   - Atomic operation pairs never split across layers
   - Every layer has at least one new user-facing capability
   - Every layer has a concrete, testable definition of done
   - Every decision/ADR is addressed in exactly one layer (or explicitly split)
   - Every invariant is activated in exactly one layer
   - The first layer completes the full operational loop end-to-end

3. VALIDATE logical soundness:
   - Does the first layer prove the COMPLETE operational loop?
   - Could each layer survive "what if we never build layer N+1?"
   - Are the complexity estimates reasonable and internally consistent?
   - Is the dependency graph truly linear where claimed?
   - Are parallelization opportunities correctly identified?
   - Is user value delivered early enough in the sequence?
   - Does the governance/admin transition plan have gaps between layers?

4. VALIDATE layering quality (the hard questions):
   - For each layer boundary: what would CONCRETELY break if you swapped the order?
   - Are there tightly-coupled subsystems that got split across layers?
   - Are there loosely-coupled subsystems that got bundled unnecessarily?
   - Is any layer so large it should be split?
   - Is any layer so small it should be merged?
   - Does each layer's "what's stubbed" section have a concrete "enhanced in layer N"?
   - Are the cross-layer interface contracts explicit enough for independent teams?

5. LOOK FOR subtle problems:
   - Capabilities deferred too long (user value arrives too late)
   - Capabilities shipped too early (unnecessary complexity in early layers)
   - Missing forward-compatibility requirements that will force schema migrations
   - Extension points that constrain future layers too tightly
   - Test scenarios that can't actually be tested with just the current layer's accounts
   - SDK surface gaps (operations listed but SDK design not considered)
   - Keeper/automation requirements that are hand-waved

6. VALIDATE the execution artifact policy:
   - Does the strategy define the maintained doc set?
   - Is the authority split clear (strategy doc vs layer docs)?
   - Are there any "companion doc" or "cross-layer ledger" patterns that should be eliminated?

7. FIX issues with targeted edits, not wholesale rewrites
   - For each fix: explain the rationale
   - For each change: verify it doesn't break other layer boundaries

8. FOLLOW-UP FRESH-EYES PASS
   After all fixes, re-read the strategy one more time with completely fresh eyes.
   Ask: "If I gave this to an implementation team tomorrow, would they know exactly
   what to build first, second, third — with no ambiguity about layer boundaries?"
```

Include project-specific checks based on the traps identified in Phase 1 (Step 1.4). The optimization prompt should reference the SPECIFIC atomic pairs, forward-compatibility requirements, governance bootstrapping decisions, and complexity spectrums identified during deep understanding.

---

## Phase 4: BEADS CREATION HANDOFF

**Duration:** 15-25 minutes
**Goal:** Generate a prompt that converts the strategy into executable beads (work orders)
**Gate:** Prompt defines exact maintained doc set, bead quality standards, and topology

### What the Beads Creation Handoff Must Contain

See **references/TEMPLATES.md → Beads Creation Template** for the full structure.

```
1. MISSION
   Frame: "designing a manufacturing plan for a compact documentation system"
   Beads are work orders — layer docs are the product.
   Extra standalone docs are a planning failure.
   Compact file count does NOT mean compact content.

2. FINAL MAINTAINED DOC SET (non-negotiable)
   Exact list of all maintained files (README + index + strategy + N layer docs).
   Authority split: strategy doc for sequencing, layer docs for execution-grade detail.
   Path-ownership hard rule: no bead may own files outside this set.
   Explicit prohibition on standalone cross-layer ledgers, decision docs, companion docs.

3. CURRENT REPO STATE
   Source of truth docs with paths.
   Classification: what to keep, merge, or discard.

4. MANDATORY PRE-BEAD RESEARCH
   Read all source docs fully before creating beads.
   Classify current files (keep / merge into X / discard).
   Build private planning map before writing beads.

5. WHAT THE BEAD GRAPH MUST DO
   Produce the compact maintained set.
   Keep beads self-contained.
   Use section-level ownership within files.
   Consolidate instead of proliferate — lossless merging.
   Preserve full architectural detail.
   Keep open questions explicit (inside owning layer doc).
   Make review gates obvious.

6. RECOMMENDED TOPOLOGY
   Root epic → per-layer epics → section beads + review gates.
   Canonical-layer density rule: layer docs are execution-grade references,
   NOT summaries. An implementation agent should NOT need to reopen the
   source doc to recover missing detail.

7. BEAD QUALITY STANDARDS
   Minimum contents: background, current-state context, target behavior,
   architectural detail, dependencies, verification, acceptance criteria.
   Critical rules: never say "see source doc" as substitute for content,
   never normalize extra docs, never turn open questions into hidden assumptions.

8. FINAL AUDIT SUMMARY
   What the planning agent must report when done.
   Validation: every path in bead graph belongs to the maintained set.

9. FOLLOW-UP FRESH-EYES PASS
   Re-read everything with fresh eyes after bead creation.
   Check for doc sprawl, lossy compression, or split-doc drift.
```

---

## Phase 5: BEADS OPTIMIZATION PROMPT

**Duration:** 10-15 minutes
**Goal:** Generate a meticulous bead-by-bead QA audit prompt
**Gate:** Prompt includes all 6 audit dimensions and a follow-up pass

### What the Beads Optimization Must Check

```
The optimization prompt should include these audits:

1. COMPACT-ARTIFACT AUDIT
   Does each bead target one of the allowed maintained files?
   Does it specify which section(s) it owns?
   Does it avoid mentioning any path outside the maintained set?

2. CONSOLIDATION AUDIT
   Does each bead say what fragmented material gets merged?
   Does it preserve source detail (not lossy summarize)?
   Does it prevent source docs from surviving as unnecessary artifacts?

3. SELF-CONTAINMENT AUDIT
   Could an agent execute the bead without reopening the source doc?
   Does it include necessary context, constraints, invariants?
   Does it name the exact target file and section?

4. DEPENDENCY AUDIT
   Is sequencing correct?
   Can it safely run in parallel where claimed?
   Are dependencies missing or too conservative?
   Are open questions embedded in the right layer doc?

5. ARCHITECTURE-COVERAGE AUDIT
   All layers represented?
   All major components, data structures, operations covered?
   All invariants and decisions included?
   All automation/SDK/interface concerns addressed?
   [Project-specific coverage items from Phase 1]

6. FINAL-SHAPE SANITY AUDIT
   If this graph executes perfectly, does the repo end with exactly
   the maintained doc set and nothing else?
   Enumerate every markdown path in the bead graph — exact match?

REQUIRED OUTPUT:
  Total beads audited, pass/enriched/fixed/created counts.
  Full set of markdown paths in the graph.
  Coverage gaps remaining.
  Any beads still implying extra docs.

FOLLOW-UP FRESH-EYES PASS:
  Re-read everything with completely fresh eyes.
  Fix any bead that would recreate doc sprawl or lossy compression.
```

---

## Phase 6: EXECUTION PROMPT GENERATION

**Duration:** 10-15 minutes
**Goal:** Generate kickoff (for fresh agents) and push (for continuing agents)
**Gate:** Both prompts are self-contained and enforce compact-doc discipline

### Kickoff Prompt (for fresh agents)

```
The kickoff prompt must include:

1. MISSION
   What the agent is executing (compact layer-doc program).
   Compact file count ≠ compact content.
   The maintained end-state (exact file list).
   Role split (strategy doc vs layer docs vs navigation docs).
   Core operating rules.
   "You are NOT building a permanent supporting-doc pack."

2. ARCHITECTURAL TRUTHS TO PRESERVE
   Project-specific invariants that must never be weakened.
   Things that are "not live yet" and must be honestly marked as blocked.
   Key safety properties.

3. MANDATORY SOURCE-OF-TRUTH LOADING
   Read all source docs before claiming work.
   Classify current files (maintained vs source material vs residue).
   Understand the bead graph.

4. GRAPH SANITY CHECK
   Verify beads map to maintained files only.
   Identify audit vs content beads.

5. COORDINATION (if multi-agent)
   File reservations via Agent Mail if present.
   Announce claims if other agents are active.

6. WORK SELECTION
   Pick ready non-epic beads.
   Read bead + parent epic + identify target file.
   Claim and reserve.

7. EXECUTION MODE
   What "execute" means: merge, consolidate, absorb source detail.
   What it does NOT mean: create extra docs, summarize away detail.
   Verification: file-count discipline + density check.

8. CLOSE/SYNC/PUSH LOOP
   Close bead, sync, commit, push, release, repeat.
   "Do not ask what to work on next."
```

### Push Prompt (for continuing agents)

```
The push prompt must include:

1. RE-ORIENT
   Re-read source docs if context is stale.
   Confirm convergence toward maintained doc set.

2. CHECK COORDINATION (if multi-agent)
   Check inbox / file reservations.
   Avoid claiming work another agent owns.

3. PICK REAL WORK
   Ignore epics, pick ready non-epic beads.
   Verify target file is in the maintained set.

4. EXECUTE
   Merge, consolidate, absorb — don't proliferate.
   Preserve detail — don't summarize.

5. VERIFICATION
   File-count discipline pass.
   Density pass (did consolidation lose detail?).

6. FINISH PROPERLY
   Close, sync, commit, push, announce, repeat.
   "Do not let the graph drift back into document sprawl."
```

---

## Phase 7: OUTPUT & MANIFEST

**Duration:** 5 minutes
**Goal:** Archive previous run (if any), write all prompts, and report to user

### Archive Previous Run

Before writing new prompts, check if `layermaxxer/active/` has existing content:

```
1. READ the current run number from layermaxxer/.run
   (if file doesn't exist, assume run 0)

2. IF active/ has content:
   a. CREATE layermaxxer/archived/run-{NNN}/ (zero-padded to 3 digits)
   b. MOVE all contents of active/ into the archive directory
   c. INCREMENT the run counter in .run

3. Recreate empty active/ directory
```

### Output Location

```
Location priority for layermaxxer/ root:
  1. layermaxxer/ (if it already exists at project root)
  2. docs/layermaxxer/ (if docs/ exists)
  3. Create layermaxxer/ at project root

Create if needed:
  layermaxxer/active/
  layermaxxer/.run (set to 0 if doesn't exist)
```

### File Names

```
layermaxxer/active/strategy-handoff.md
layermaxxer/active/strategy-optimization.md
layermaxxer/active/beads-creation.md
layermaxxer/active/beads-optimization.md
layermaxxer/active/execution-kickoff.md
layermaxxer/active/execution-push.md
```

### Report to User

```
LAYERMAXXER OUTPUT (run {N}):
  Source document: {path} ({line_count} lines)
  Project domain: {FINANCIAL | DISTRIBUTED | WEB | PROTOCOL | INFRASTRUCTURE}
  Estimated layers: ~{N} (from architecture analysis)
  Value proposition: {1-line summary}
  Loop anchor: {what the first layer must complete end-to-end}

  Generated:
    1. layermaxxer/active/strategy-handoff.md
       → Run FIRST to produce the layer strategy document
       → Best with: subagent-capable model (research protocol uses parallel investigations)

    2. layermaxxer/active/strategy-optimization.md
       → Run AFTER strategy document is created
       → Fresh-eyes validation and improvement pass

    3. layermaxxer/active/beads-creation.md
       → Run AFTER strategy is finalized
       → Converts strategy into executable bead graph

    4. layermaxxer/active/beads-optimization.md
       → Run AFTER beads are created
       → Meticulous bead-by-bead QA audit

    5. layermaxxer/active/execution-kickoff.md
       → Use to onboard fresh execution agents

    6. layermaxxer/active/execution-push.md
       → Use to push continuing execution agents

  Workflow:
    1. Run strategy-handoff.md (produces strategy document)
    2. Run strategy-optimization.md (refines strategy)
    3. (Optional: run /planmaxer on the strategy for expert domain reviews)
    4. Re-run: /layermaxxer --beads-only (fills in beads prompts with real layer names/paths)
    5. Run beads-creation.md (produces bead graph)
    6. Run beads-optimization.md (audits bead graph)
    7. Re-run: /layermaxxer --execution-only (fills in execution prompts with real doc set)
    8. Use execution-kickoff.md to start agents
    9. Use execution-push.md to keep agents on track
```

---

## Quality Gates

### Gate 0 → 1: Orientation Complete
- [ ] Found monolithic source document with path and line count
- [ ] Know project domain (financial/distributed/web/protocol/infra)
- [ ] Read AGENTS.md, README, CLAUDE.md if they exist
- [ ] Know output location for artifacts

### Gate 1 → 2: Deep Understanding Complete
- [ ] Can articulate value proposition in one paragraph
- [ ] Identified ALL components/programs/services
- [ ] Mapped ALL data structures with ownership
- [ ] Mapped ALL operations with cross-component dependencies
- [ ] Identified the fundamental operational loop (THE LOOP ANCHOR)
- [ ] Identified ALL invariants and their activation points
- [ ] Identified ALL architectural decisions
- [ ] Identified ALL atomic operation pairs
- [ ] Identified ALL forward-compatibility requirements
- [ ] Identified the governance/admin bootstrapping path
- [ ] Can describe a BAD decomposition and why it fails for THIS project

### Gate 2 → 3: Strategy Handoff Generated
- [ ] Has structured research protocol with 5-7 parallel investigations
- [ ] Research investigations are project-specific (reference actual sections)
- [ ] Includes the complete operational loop as layer boundary anchor
- [ ] Includes concrete bad-decomposition example specific to this project
- [ ] Defines "shippable layer" precisely with project-relevant criteria
- [ ] Has project-specific quality criteria (not generic)
- [ ] Process instructions enforce research-before-design
- [ ] Non-negotiable constraints fully documented
- [ ] Platform-specific feasibility context included

### Gate 3 → 4: Strategy Optimization Prompt Generated
- [ ] Covers all structural validation criteria
- [ ] Includes project-specific checks from Phase 1 trap analysis
- [ ] Enforces targeted edits, not wholesale rewrites

### Gate 4 → 5: Beads Creation Handoff Generated
- [ ] Defines exact maintained doc set with file paths
- [ ] Has path-ownership hard rule (no extra docs)
- [ ] Includes bead quality standards with minimum contents
- [ ] Has canonical-layer density rule (no lossy summarization)
- [ ] Includes final audit summary requirements

### Gate 5 → 6: Beads Optimization Prompt Generated
- [ ] Has all 6 audit dimensions
- [ ] Includes follow-up fresh-eyes pass
- [ ] Has required audit output format with counts

### Gate 6 → 7: Execution Prompts Generated
- [ ] Kickoff is self-contained for fresh agents
- [ ] Push is usable for continuing agents
- [ ] Both enforce compact-doc discipline
- [ ] Both include project-specific architectural truths to preserve

---

## Anti-Patterns

### The Naive Decomposition
```
BAD: "One component per layer" — registry first, then oracle, then epoch, etc.

WHY: Components are interdependent. The first user-facing capability requires
multiple components working together. Decomposing by component boundary
produces layers that can't be tested end-to-end.
```

### The Infrastructure-First Trap
```
BAD: 3 layers of infrastructure plumbing before any user-facing capability.

WHY: Layers should deliver incremental user value. Infrastructure-only layers
can't be validated because there's nothing to test end-to-end. The first
layer should prove the complete operational loop.
```

### The Schema Migration Assumption
```
BAD: "We'll add these fields later when we need them."

WHY: On platforms with fixed-size accounts (Solana) or strict migrations (SQL),
adding fields later is expensive. Forward-compatibility mechanisms (reserved
bytes, nullable columns, optional fields) must be designed into early layers.
```

### The Deferred Safety Trap
```
BAD: "We'll add this invariant enforcement in a later layer."

WHY: Invariants that apply to data in the current layer must be enforced NOW.
"Temporarily relaxed" invariants create windows where the system is subtly
unsafe. Each layer must be fully safe as shipped.
```

### The Missing Loop
```
BAD: No constraint on what the first user-facing layer must demonstrate.

WHY: Without a loop anchor, the first layer might deliver half a flow
(deposits without withdrawals, orders without settlement). The first layer
must complete the system's fundamental operational cycle end-to-end.
```

### The Document Tsunami
```
BAD: Every bead creates a new standalone doc (companion docs, decision docs,
cross-layer ledgers) instead of consolidating into canonical layer docs.

WHY: The maintained end-state is a COMPACT doc set. Extra docs create
maintenance burden, stale references, and split authority. All material
must be absorbed into the canonical layer docs, not kept alongside them.
```
