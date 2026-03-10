---
name: planmaxer
description: "Optimize any plan or architecture through iterative expert review cycles. Use when: user says 'planmaxer', 'optimize my plan', 'improve my architecture', 'generate handoffs for review', 'plan optimization', 'architecture review cycle', 'planmax', or '/planmaxer'. Detects plan structure (single doc vs multi-layer), extracts optimal review domains, generates expert handoff prompts, reintegration pre-preps, and holistic cross-plan improvement prompts. Works on any codebase. Designed for iterative cycling — re-run after each integration round to regenerate prompts against the updated plan state."
user_invocable: true
compatibility: "Works with Claude Code, Codex, and any Agent Skills-compatible tool."
metadata:
  author: steel
  version: "1.0"
---

# Planmaxer — Iterative Plan Optimization Engine

> Transform any plan or architecture into its best possible version through structured expert review cycles.

---

## The Iteration Cycle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   /planmaxer                                                            │
│       │                                                                 │
│       ├── Generates: HANDOFF prompts  → planmaxer/active/handoffs/      │
│       ├── Generates: PRE-PREP prompts → planmaxer/active/prepreps/      │
│       └── Generates: HOLISTIC prompt  → planmaxer/active/               │
│                                                                         │
│   USER SENDS handoffs to reviewer (GPT Pro, Claude, native agent)       │
│       │   (native agents save reviews → planmaxer/active/reviews/)      │
│       │                                                                 │
│   USER RUNS pre-preps to integrate feedback into plan docs              │
│       │                                                                 │
│   USER RUNS holistic pass for cross-plan improvement                    │
│       │                                                                 │
│   USER RUNS archive prompt → moves active/ to archived/iteration-NNN/   │
│       │                                                                 │
│   /planmaxer  ← RE-RUN: regenerates ALL artifacts against new state     │
│       │                                                                 │
│   (repeat until plan is optimal)                                        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Re-running planmaxer IS the prompt refinement step.** Each invocation reads the current plan state fresh, detects what changed, and generates updated prompts. No separate "update prompts" step needed.

### File Structure

```
planmaxer/                           (lives at project root or docs/planmaxer/)
├── active/                          (current iteration — working artifacts)
│   ├── handoffs/                    (handoff prompts to send to reviewers)
│   │   ├── handoff-{domain1}.md
│   │   └── handoff-{domain2}.md
│   ├── prepreps/                    (reintegration prompts)
│   │   ├── preprep-{domain1}.md
│   │   └── preprep-{domain2}.md
│   ├── reviews/                     (reviewer responses — from native agents)
│   │   ├── review-{domain1}.md
│   │   └── review-{domain2}.md
│   └── holistic-pass.md
├── archived/                        (previous iterations — kept for reference)
│   ├── iteration-001/
│   │   ├── handoffs/
│   │   ├── prepreps/
│   │   ├── reviews/
│   │   └── holistic-pass.md
│   └── iteration-002/
│       └── ...
└── .iteration                       (counter file: current iteration number)
```

All planmaxer artifacts are **temporary working documents** — they exist to improve the plan, not to be permanent. The `archived/` folder keeps history for reference but these files never become part of the canonical project documentation.

---

## Arguments

```
/planmaxer [focus areas] [flags]

Examples:
  /planmaxer                           Full auto — detect domains, generate everything
  /planmaxer vaults, governance        Focus on specific domains
  /planmaxer --handoffs-only           Only generate handoff prompts
  /planmaxer --prepreps-only           Only generate pre-prep prompts
  /planmaxer --holistic-only           Only generate the holistic pass prompt
  /planmaxer --native                  Include "write MD, don't modify codebase" directive
```

---

## The 8-Phase Workflow

```
Phase 0           Phase 1             Phase 2             Phase 3
ORIENTATION   ──► DEEP UNDERSTANDING ──► STRATEGY       ──► HANDOFF
(auto)            (ULTRATHINK)           SELECTION          GENERATION
                                                                │
                                                                ▼
Phase 7       Phase 6             Phase 5             Phase 4
OUTPUT & ◄── ARCHIVE PROMPT ◄── HOLISTIC PASS  ◄── PRE-PREP
MANIFEST      GENERATION         GENERATION          GENERATION
```

---

## Phase 0: ORIENTATION

**Duration:** 5-10 minutes
**Goal:** Understand the project and detect plan architecture
**Gate:** Can describe project purpose, plan structure, and document locations

### Protocol

#### Step 0.1: Read Foundation Documents

Read these if they exist (in order):
1. `AGENTS.md` — agent guidelines, toolchain, rules
2. `README.md` — project overview
3. `CLAUDE.md` — project-specific instructions (check both root and `.claude/`)

#### Step 0.2: Detect Plan Architecture

Scan for plan/architecture documents:

```
SEARCH PATTERNS (priority order):
  docs/strategy/*layer*.md          → MULTI_LAYER
  docs/strategy/*.md                → Check if multiple related docs
  docs/spec/*.md, specs/*.md        → SINGLE_PLAN or MULTI_MODULE
  docs/architecture/*.md            → SINGLE_PLAN or MULTI_MODULE
  docs/research/*research*.md       → RESEARCH_SOURCE (upstream, not the plan itself)
  docs/plan*.md, docs/design*.md    → SINGLE_PLAN
  *-spec.md, *-plan.md              → SINGLE_PLAN
  docs/**/*.md                      → Scan for any structured plan docs
```

Also look for:
- Cross-reference indexes (layer index, table of contents docs)
- Strategy/rollout documents
- README files within docs directories

#### Step 0.3: Classify Architecture Type

```
MULTI_LAYER:
  Multiple docs with clear layer/module separation
  Each doc is self-contained with its own scope
  Typically has a cross-reference index
  → Parallel domain decomposition likely optimal

SINGLE_PLAN:
  One or few docs covering the whole plan
  May have sections but in one file
  → Single-threaded or section-based decomposition

MULTI_MODULE:
  Multiple docs organized by module/component (not layers)
  Similar to MULTI_LAYER but without sequential ordering
  → Parallel by module boundary

RESEARCH_ONLY:
  Research/exploration docs exist but no formal plan yet
  → Suggest running research-to-spec first, or treat research as the plan
```

#### Step 0.4: Catalog All Plan Documents

Build a complete list with:
- File path
- Approximate size (line count)
- Scope (what it covers)
- Key dependencies on other docs

---

## Phase 1: DEEP UNDERSTANDING (ULTRATHINK REQUIRED)

**Duration:** 30-90 minutes depending on plan size
**Goal:** Deeply understand the entire plan — every primitive, every decision, every tension
**Gate:** Can explain the architecture to a domain expert without referring to the docs

### This Phase Cannot Be Rushed

The quality of the handoff prompts depends ENTIRELY on how deeply the plan is understood. Shallow understanding produces generic handoffs. Deep understanding produces handoffs that ask the RIGHT questions.

### Protocol

#### Step 1.1: Read Every Plan Document

Read ALL plan documents in dependency order (referenced docs first, then docs that build on them). For large documents, read in chunks but do NOT skip sections.

#### Step 1.2: Extract Core Value Proposition

**This is the FIRST extraction — before architecture.** The value proposition drives everything downstream: which tensions matter most, what expert framing to use, what "genius insights" actually look like for this project.

```
VALUE PROPOSITION:
  What problem does this project solve? For whom?
  What is the core "unlock" — the thing that makes this possible/better/unique?
  What is the user's thesis about WHY this approach wins?
  What existing solutions does it replace or improve on?
  What is the "triple duty" insight — where does one design choice serve multiple goals?

COMPETITIVE FRAMING:
  What are the closest competitors/alternatives?
  What would they say is wrong with this approach?
  Where does this project DELIBERATELY differ from conventional wisdom?
  What is the user's strongest contrarian bet?

SUCCESS CRITERIA:
  What would "this plan is optimal" look like?
  What tradeoffs would the user NEVER make?
  What would cause the user to abandon this approach entirely?
```

The value proposition is NOT just "what the project does" — it's the user's THESIS about why their specific design choices create outsized value. Expert reviewers need to engage with this thesis, not just audit the technical architecture.

#### Step 1.3: Extract Core Architecture

While reading, extract and internalize:

```
PRIMITIVES:
  What are the fundamental building blocks?
  What are the key data structures / account schemas / models?
  What are the core operations / instructions / API endpoints?

DESIGN PRINCIPLES:
  What are the stated design principles?
  What are the UNSTATED design principles (inferred from decisions)?
  What tradeoffs were made and why?

INVARIANTS:
  What rules must NEVER be violated?
  What safety properties does the system guarantee?
  What are the mathematical/logical constraints?

DECISIONS:
  What architectural decisions have been made (ADRs or equivalent)?
  What was the rationale for each?
  Which decisions feel most fragile or undertested?

OPEN QUESTIONS:
  What is explicitly unresolved?
  What is implicitly unresolved (stated as decided but with weak justification)?
  What would an expert challenge?

TENSIONS:
  Where do design goals conflict with each other?
  Where is the system trying to serve multiple masters?
  Where is complexity being pushed around rather than eliminated?

DEPENDENCIES:
  What depends on what?
  What is the critical path?
  What can be changed independently vs what cascades?
```

#### Step 1.4: Map the Tension Graph

This is the most important extraction. Every interesting architecture has tensions — places where two legitimate goals pull in opposite directions. These tensions are where expert reviewers add the most value.

```
For each tension, note:
  - The two (or more) competing goals
  - The current resolution (if any)
  - Why the current resolution might be wrong
  - What a different resolution would enable/sacrifice
```

#### Step 1.5: Identify Optimization Domains

Based on the architecture, identify natural clusters of related concerns that could be reviewed independently. Each domain should be:

```
COHESIVE:     The topics within a domain are tightly related
DECOUPLED:    The domain can be reviewed without deep knowledge of other domains
SUBSTANTIAL:  The domain has enough depth to warrant expert review
TENSIONED:    The domain contains unresolved tensions or questionable decisions
```

**If user specified focus areas:** Use those as the primary domains, but note any auto-detected domains that the user didn't mention.

**If no focus specified:** Auto-extract 2-5 domains based on the tension graph and natural architectural boundaries.

---

## Phase 2: STRATEGY SELECTION

**Duration:** 5-10 minutes
**Goal:** Decide threading model and domain decomposition
**Gate:** Clear list of domains, each with primary docs and key tensions

### Threading Decision

```
SINGLE_THREAD (1 handoff, 1 preprep):
  When to use:
    - Total plan < 1000 lines
    - Fewer than 3 natural domains
    - Single plan document

MULTI_THREAD (N handoffs, N prepreps, parallel integration):
  When to use:
    - Total plan > 1000 lines
    - 3+ natural domains with clear boundaries
    - Multi-layer or multi-module architecture
  Just define file ownership per domain and let agents run in parallel.
  If Agent Mail MCP is present: add file reservations for safety.

HYBRID (N handoffs, sequential prepreps):
  When to use:
    - Multiple domains but high interdependency
    - Documents are small enough that coordination overhead > benefit
```

### Domain Specification

For each domain, define:

```
DOMAIN: [name]
  EXPERT FRAMING: What kind of expert reviews this? (e.g., "mechanism designer",
                  "trade finance architect", "distributed systems engineer")
  PRIMARY DOCS: Which plan docs does the reviewer need to read?
  SHARED DOCS: Which docs overlap with other domains?
  KEY TENSIONS: The 3-5 most important tensions in this domain
  USER BELIEFS: Any strong user opinions about this domain (from request or CLAUDE.md)
  ANTI-PATTERNS: What the reviewer should NOT propose
```

### File Ownership (Multi-Thread Only)

If multi-threaded, define which files each domain owns. Note section-level boundaries for shared files. If Agent Mail MCP is present, add file reservations.

---

## Phase 3: HANDOFF GENERATION

**Duration:** 15-30 minutes per domain
**Goal:** Generate expert review prompts that maximize creative, innovative output
**Gate:** Each handoff is self-contained, domain-specific, and provokes deep thinking

### Value Proposition Orientation

Every handoff must be oriented around the project's core value proposition (extracted in Phase 1, Step 1.2). The reviewer isn't just auditing technical architecture — they're being asked to **improve the value proposition through its architecture**. Frame tensions in terms of what they mean for the value thesis, not just technical correctness.

```
ASK YOURSELF before writing each handoff:
  - How does this domain connect to the core value proposition?
  - What would "optimal" look like for THIS domain in service of the value thesis?
  - What industry-standard approaches would undermine the value proposition?
  - What non-obvious design choices in this domain AMPLIFY the value proposition?
```

### Handoff Prompt Structure

See **references/TEMPLATES.md** for the full template. Key elements:

```
1. EXPERT FRAMING (not generic "genius")
   - Frame the reviewer as a specific type of expert
   - Reference real-world systems/protocols they should draw from
   - Name specific prior art (protocols, papers, systems)

2. MISSION
   - "ULTRATHINK and be meticulous"
   - Clear scope statement
   - "Don't just answer my questions — the questions I DON'T KNOW to ask are more important"
   - Frame the review in terms of the VALUE PROPOSITION, not just technical correctness

3. USER'S STRONG BELIEFS (tensions to engage with)
   - State 2-3 beliefs the user holds about this domain
   - Ask the reviewer to either challenge or strengthen them

4. ESSENTIAL CONTEXT
   - What the project is (2-3 paragraphs, domain-specific framing)
   - Key terms explained (don't assume reviewer knows project jargon)
   - Technical constraints

5. CURRENT ARCHITECTURE
   - Account schemas, data structures, key algorithms
   - Only what's relevant to this domain
   - Include enough detail for the reviewer to propose concrete changes

6. TENSIONS TO RESOLVE (not flat Q&A)
   - 3-5 tensions, each framed as a conflict between legitimate goals
   - For each: what the current resolution is and why it might be wrong
   - Specific scenarios that stress-test the design

7. WHAT I DON'T WANT (anti-patterns)
   - Specific things the reviewer should NOT propose
   - Prevents wasted effort on known-bad directions

8. WHAT I DO WANT (expectations)
   - Concrete deliverables
   - "Ideas I haven't asked about"
   - Git-diff style output requirement
   - Reference specific doc sections for diffs

9. CONTEXT DOCS TO ATTACH
   - List of plan docs the reviewer should read
   - Brief note on what to look for in each

10. [OPTIONAL — for native coding agents only]
    "Write your complete response as a markdown document saved to
    planmaxer/active/reviews/review-{domain}.md. Do NOT modify any plan
    documents directly — that is handled by the reintegration step."
```

### What Makes a Great Handoff

```
GREAT handoffs:
  ✓ Frame the reviewer as a domain-specific expert, not generic "genius"
  ✓ Reference specific real-world systems the reviewer should draw from
  ✓ State the user's strong beliefs as tensions to engage with
  ✓ Structure around tensions, not flat question lists
  ✓ Include "what am I NOT asking?" provocation
  ✓ Have anti-patterns section (saves reviewer from wasted directions)
  ✓ Ask for "ideas I haven't asked about"

BAD handoffs:
  ✗ Generic "be creative and innovative" without domain framing
  ✗ Flat list of questions that constrain rather than open creative space
  ✗ Missing essential context (reviewer has to guess at project jargon)
  ✗ No anti-patterns (reviewer proposes things already considered and rejected)
  ✗ Too encyclopedic — reads like documentation, not a creative brief
  ✗ No user opinions/beliefs for reviewer to engage with
```

---

## Phase 4: PRE-PREP GENERATION

**Duration:** 10-20 minutes per domain
**Goal:** Generate reintegration prompts for after the reviewer responds
**Gate:** Each pre-prep has all 4 steps, self-contained, ready to paste

### Pre-Prep Structure (4 Steps per Domain)

Each pre-prep is a single document with 4 sequential prompts:

```
STEP 1: PRE-PREP RESEARCH
  - Read AGENTS.md (always)
  - Read all relevant plan docs in order
  - Read the handoff prompt that produced the feedback
  - Understand architecture deeply enough to evaluate the feedback
  - [If multi-thread]: Include file ownership map so agent knows what it can edit
  - [If Agent Mail MCP present]: Add file reservation setup here
  - Specific things to pay attention to (per domain)

STEP 2: FEEDBACK INTEGRATION
  - "<INSERT REVIEWER RESPONSE HERE>" placeholder
  - For each proposed change: agree/partially agree/disagree and how strongly
  - Which files this agent can edit directly
  - Preserve invariant IDs and ADR numbers

STEP 3: FRESH-EYES OPTIMIZATION
  - Re-read edited docs with fresh eyes
  - Specific consistency checks per domain
  - Cross-layer/cross-doc contradiction detection

STEP 4: SYNC PASS
  - Update README/index docs (as-if-always language, not changelog)
  - Update cross-reference index if accounts/invariants/decisions changed
```

### Multi-Thread File Ownership

For parallel pre-preps, include a file ownership map so each agent knows what it can edit. Keep it simple — just list which files belong to which domain. If Agent Mail MCP is present, add file reservations for safety.

---

## Phase 5: HOLISTIC PASS GENERATION

**Duration:** 10-15 minutes
**Goal:** Generate a prompt for cross-plan unification after integration cycles
**Gate:** Prompt covers all plan docs, focuses on cross-cutting concerns

### Holistic Pass Prompt Structure

This prompt is designed to run AFTER one or more handoff+preprep cycles. It's a full-context pass where the agent reads ALL plan docs and improves cross-cutting architecture.

```
STEP 1: DEEP READ
  - Read AGENTS.md
  - Read ALL plan docs in order, cover to cover
  - Read the cross-reference index
  - Build a mental model of the complete architecture

STEP 2: CROSS-PLAN IMPROVEMENT
  With "fresh eyes," look carefully for:
  - Contradictions between docs (same concept described differently)
  - Inconsistent terminology (same thing called different names)
  - Missing cross-references (doc A implies something about doc B but doesn't say it)
  - Invariant violations (a rule stated in one doc is violated by another)
  - Unnecessary complexity (things that could be simplified now that the design matured)
  - Missing invariants (properties that are assumed but not stated)
  - Stale open questions (questions that were resolved but not marked as such)
  - Orphaned decisions (ADRs referenced but not defined, or defined but not referenced)

  Fix each issue with a small, targeted edit. Not one big rewrite.

STEP 3: ARCHITECTURAL COHERENCE
  Ask:
  - Does every component serve a clear purpose?
  - Are the boundaries between components in the right place?
  - Is the dependency direction correct everywhere?
  - Are there circular dependencies or unnecessary coupling?
  - Is complexity allocated to the right places?

STEP 4: SYNC
  - Update cross-reference index
  - Update README
  - Verify all doc metadata (dates, revision numbers, status fields)
```

---

## Phase 6: ARCHIVE PROMPT GENERATION

**Duration:** 5 minutes
**Goal:** Generate a prompt that archives the current iteration's artifacts and prepares for the next cycle
**Gate:** Archive prompt handles all artifact types, increments counter, cleans active/

### Archive Prompt Structure

This prompt is run AFTER the user has completed all integration and holistic passes for the current iteration. It moves everything in `planmaxer/active/` to `planmaxer/archived/iteration-NNN/` and resets for the next `/planmaxer` run.

```
The generated archive prompt should instruct the agent to:

1. READ the current iteration number from planmaxer/.iteration
   (if file doesn't exist, assume iteration 0)

2. CREATE the archive directory:
   planmaxer/archived/iteration-{NNN}/
   where NNN = current iteration number, zero-padded to 3 digits

3. MOVE all contents of planmaxer/active/ into the archive directory:
   planmaxer/active/handoffs/    → planmaxer/archived/iteration-{NNN}/handoffs/
   planmaxer/active/prepreps/    → planmaxer/archived/iteration-{NNN}/prepreps/
   planmaxer/active/reviews/     → planmaxer/archived/iteration-{NNN}/reviews/
   planmaxer/active/holistic-pass.md → planmaxer/archived/iteration-{NNN}/holistic-pass.md
   planmaxer/active/archive.md   → planmaxer/archived/iteration-{NNN}/archive.md

4. RECREATE empty active/ subdirectories:
   planmaxer/active/handoffs/
   planmaxer/active/prepreps/
   planmaxer/active/reviews/

5. INCREMENT the iteration counter:
   Write (current + 1) to planmaxer/.iteration

6. REPORT what was archived:
   - Number of handoffs, prepreps, reviews archived
   - New iteration number
   - Reminder: "Run /planmaxer to generate fresh artifacts for iteration {N+1}"
```

The archive prompt itself should be saved as `planmaxer/active/archive.md` alongside the other artifacts.

---

## Phase 7: OUTPUT & MANIFEST

**Duration:** 5 minutes
**Goal:** Write all artifacts and report to user

### Output Location

All artifacts go into the `planmaxer/active/` directory structure:

```
Location priority for planmaxer/ root:
  1. planmaxer/ (if it already exists at project root)
  2. docs/planmaxer/ (if docs/ exists)
  3. Create planmaxer/ at project root

Create if needed:
  planmaxer/active/handoffs/
  planmaxer/active/prepreps/
  planmaxer/active/reviews/
  planmaxer/.iteration (set to 0 if doesn't exist)
```

### Naming Convention

```
Handoffs:  planmaxer/active/handoffs/handoff-{domain-slug}.md
Pre-Preps: planmaxer/active/prepreps/preprep-{domain-slug}.md
Holistic:  planmaxer/active/holistic-pass.md
Archive:   planmaxer/active/archive.md
```

No date prefix in filenames — the iteration archive provides the temporal context.

### Report to User

After generating all artifacts, report:

```
PLANMAXER OUTPUT (iteration {N}):
  Architecture type: [MULTI_LAYER | SINGLE_PLAN | MULTI_MODULE]
  Threading model: [SINGLE_THREAD | MULTI_THREAD | HYBRID]
  Domains detected: [N]
  Value proposition: [1-line summary of core thesis]

  Generated:
    Handoffs:
      - planmaxer/active/handoffs/handoff-{domain1}.md  → Send to [expert type]
      - planmaxer/active/handoffs/handoff-{domain2}.md  → Send to [expert type]
      ...
    Pre-Preps:
      - planmaxer/active/prepreps/preprep-{domain1}.md  → Run after {domain1} feedback
      - planmaxer/active/prepreps/preprep-{domain2}.md  → Run after {domain2} feedback
      ...
    Holistic:
      - planmaxer/active/holistic-pass.md               → Run after all integrations
    Archive:
      - planmaxer/active/archive.md                     → Run to archive this iteration

  Workflow:
    1. Send handoff prompts to reviewers (attach context docs listed in each)
    2. Paste reviewer responses into pre-preps (replace <INSERT> placeholder)
    3. Run holistic pass after all domains integrated
    4. Run archive prompt to move active/ → archived/iteration-{NNN}/
    5. Re-run /planmaxer for the next iteration
```

---

## Quality Gates

### Gate 0 → 1: Orientation Complete
- [ ] Know project purpose and tech stack
- [ ] Know plan architecture type (single/multi-layer/multi-module)
- [ ] Have complete catalog of all plan documents with sizes
- [ ] Know output location for artifacts

### Gate 1 → 2: Deep Understanding Complete
- [ ] Can articulate the core value proposition in one paragraph
- [ ] Identified the user's strongest contrarian bets
- [ ] Can explain every core primitive without referring to docs
- [ ] Identified all stated and unstated design principles
- [ ] Mapped all tensions (at least 5 for a substantial plan)
- [ ] Identified all open questions (stated and implicit)
- [ ] Can trace dependencies between components

### Gate 2 → 3: Strategy Selected
- [ ] Threading model decided with clear rationale
- [ ] Domains defined with expert framing, primary docs, and key tensions
- [ ] File ownership mapped (if multi-thread)
- [ ] User beliefs/opinions captured for each domain
- [ ] Each domain connected to value proposition

### Gate 3 → 4: Handoffs Generated
- [ ] Each handoff oriented around improving the value proposition
- [ ] Each handoff has domain-specific expert framing (not generic)
- [ ] Each handoff has "what am I NOT asking?" provocation
- [ ] Each handoff has anti-patterns section
- [ ] Each handoff has user beliefs as tensions to engage with
- [ ] Each handoff references specific context docs to attach
- [ ] Each handoff asks for git-diff style output

### Gate 4 → 5: Pre-Preps Generated
- [ ] Each pre-prep has all 4 steps
- [ ] File ownership included (if multi-thread)
- [ ] File ownership and section boundaries clearly specified
- [ ] Each Step 2 has clear rules for direct edit vs mail-first

### Gate 5 → 6: Holistic Pass Generated
- [ ] Covers ALL plan docs
- [ ] Focuses on cross-cutting concerns, not single-doc improvements
- [ ] Includes specific things to look for (contradictions, terminology, invariants)

### Gate 6 → 7: Archive Prompt Generated
- [ ] Archive prompt handles all artifact subdirectories
- [ ] Iteration counter increment logic correct
- [ ] Clean active/ reset after archive

---

## Anti-Patterns

### The Generic Handoff
```
BAD: "ULTRATHINK and be a genius. Review this architecture and suggest
improvements. Be creative and innovative!"

WHY: No domain framing, no tensions, no context, no anti-patterns.
Reviewer will produce generic, surface-level suggestions.
```

### The Encyclopedia
```
BAD: Dumping the entire plan into the handoff with "review all of this."

WHY: No focus, no tensions highlighted, no expert framing.
Reviewer drowns in context without knowing what matters.
```

### The Leading Question List
```
BAD: "Should we use X? Should we change Y to Z? Is A better than B?"

WHY: Constrains the reviewer to YOUR questions. The best insights
come from questions the reviewer asks that YOU didn't think of.
Frame as tensions, not yes/no questions.
```

### The Missing Context
```
BAD: Referencing project-specific jargon without definition.
"The TFV uses the LC primitive against OAR collateral."

WHY: Reviewer can't engage deeply if they're guessing at terms.
Always define project jargon in the Essential Context section.
```

### The Single-Pass Assumption
```
BAD: Expecting one round of handoff → integration to produce a perfect plan.

WHY: Plans improve through iteration. Each cycle resolves tensions and
reveals new ones. Plan for 2-4 iterations minimum for a substantial architecture.
```
