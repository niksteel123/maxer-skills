---
name: researchmaxer
description: "Optimize any research or feature document through deep codebase research and two expert passes — WITHOUT touching existing project documentation. Use when: user says 'researchmaxer', 'researchmaxxer', 'optimize my research', 'improve my feature doc', 'iterate on research', 'research review cycle', 'researchmax', or '/researchmaxer'. Does deep codebase exploration, reads all source docs, then generates a per-feature folder with 2 numbered handoff prompts (01-improvement-pass → 02-audit-test-pass), plus manifest.yaml and EXECUTION-GUIDE.md. Each prompt is packed with actual research findings, file paths, and code context. Each feature gets its own folder so multiple research docs can be optimized in parallel without collision (matches pipemaxxer/featuremaxxer convention). Works on any codebase."
user_invocable: true
compatibility: "Works with Claude Code, Codex, and any Agent Skills-compatible tool."
metadata:
  author: steel
  version: "3.0"
  changelog:
    - "3.0 (2026-05-11): Per-feature folder convention. Each research doc gets its own folder at {parent_dir}/{feature-slug}-researchmaxer/ instead of the shared researchmaxer/active/ + archived/ + .run pattern. Adds manifest.yaml + EXECUTION-GUIDE.md. Pass files are numbered 01-02 matching pipemaxxer/featuremaxxer. Supports parallel research-doc optimization."
    - "2.0: Complete rewrite — replaced planmaxer-style multi-domain iteration with two-pass workflow (improvement + audit/test). Added mandatory subagent codebase exploration. Prompts now embed actual research findings instead of templates. Added E2E test manifest requirements."
    - "1.0: Initial skill definition (planmaxer-style, deprecated)."
---

# Researchmaxer — Deep Research + Two-Pass Feature Document Optimization

> Transform any research or feature document into its best possible version through deep codebase research and two expert optimization passes.

---

## Why This Skill Exists

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   THE GAP:                                                              │
│                                                                         │
│   idea-to-research → [???] → harmonymaxer / featuremaxxer              │
│                        ↑                                                │
│                   YOU ARE HERE                                           │
│                                                                         │
│   • planmaxer optimizes PLANS (multi-doc iteration cycles)              │
│   • featuremaxxer produces IMPLEMENTATION artifacts                     │
│   • harmonymaxer INTEGRATES into existing docs                          │
│   • idea-to-research CREATES from scratch                               │
│                                                                         │
│   NOTHING deeply researches a codebase + existing docs and then         │
│   generates rich, context-packed prompts to optimize a single           │
│   research doc through improvement + audit passes.                      │
│                                                                         │
│   researchmaxer fills this gap.                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### The Core Principle

**This skill does HEAVY RESEARCH upfront** — reading the target doc, all related project docs, and deeply exploring the codebase with subagents — then generates **two context-rich handoff prompts** packed with actual findings, file paths, code patterns, and integration surfaces. The executing agent gets everything it needs embedded in the prompt, not vague placeholders.

**The target document is the ONLY file that gets edited** by the executing agents. Existing project docs are READ-ONLY context.

### When to Use (and When NOT To)

```
USE researchmaxer when:
  ✓ You have a research/feature doc and want it deeply improved
  ✓ You want the doc's quality maximized before implementation or integration
  ✓ You want a thorough testing strategy defined alongside the feature

DO NOT use researchmaxer when:
  ✗ You want to optimize a PLAN (multi-doc, multi-layer) → use planmaxer
  ✗ You want to INTEGRATE into existing docs → use harmonymaxer
  ✗ You want to go from feature doc to CODE → use featuremaxxer
  ✗ You want to CREATE a research doc from an idea → use idea-to-research
```

---

## The Two-Pass Workflow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   /researchmaxer path/to/research-doc.md                                         │
│       │                                                                          │
│       ├── Phase 0-2: Derive feature slug, pick parent dir,                       │
│       │             deep research (codebase, docs, subagents)                    │
│       │                                                                          │
│       ├── Creates folder: {parent_dir}/{feature-slug}-researchmaxer/             │
│       │                                                                          │
│       ├── Generates: 01-improvement-pass.md                                      │
│       ├── Generates: 02-audit-test-pass.md                                       │
│       ├── Generates: manifest.yaml (research metadata + findings summary)        │
│       └── Generates: EXECUTION-GUIDE.md (per-feature operating manual)           │
│                                                                                  │
│   USER RUNS 01-improvement-pass.md                                               │
│       │   Agent researches → improves feature → edits target doc                 │
│       │   Agent runs fresh-eyes follow-up in same session                        │
│       │                                                                          │
│   USER RUNS 02-audit-test-pass.md                                                │
│       │   Agent audits → finds gaps → defines testing strategy                   │
│       │   Agent edits target doc with findings + test manifests                  │
│       │   Agent runs fresh-eyes follow-up in same session                        │
│       │                                                                          │
│   DONE: Target doc is optimized and test-strategy-complete                       │
│                                                                                  │
│   THEN: /harmonymaxer or /featuremaxxer (human decision)                         │
│                                                                                  │
│   Multiple research docs can be in-flight simultaneously — each lives in its     │
│   own folder. No global state, no run counter, no archive collisions.            │
│                                                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

**Each handoff prompt is PACKED with research findings.** The executing agent gets:
- Full feature understanding with value proposition analysis
- Specific codebase file paths, code patterns, and integration surfaces
- Existing test suite analysis with specific test file references
- Architecture/design doc context relevant to the feature
- Tension analysis and quality gap identification
- Concrete improvement directives (not generic "improve this")

### File Structure (Per-Feature Isolation)

**Each target document gets its own folder so multiple research docs can be optimized in parallel without collision.** Matches the pipemaxxer/featuremaxxer convention.

```
{parent_dir}/{feature-slug}-researchmaxer/        (parent picked per §0.5; slug derived per §0.5)
├── manifest.yaml                                   (research metadata, findings summary, pass deliverables)
├── EXECUTION-GUIDE.md                              (run order, contracts, checkpoints, findings reference)
├── 01-improvement-pass.md                          (Pass 1: improve feature from every dimension)
└── 02-audit-test-pass.md                           (Pass 2: audit gaps + define testing strategy + E2E manifests)
```

**`{parent_dir}` resolution priority** (use first that exists; create if needed):
1. `prompts/` (recent pipemaxxer/featuremaxxer convention — recommended default)
2. `docs/plan-hub/` (older convention)
3. `thoughts/handoffs/` (oldest convention)
4. Create `prompts/` if it can be created
5. Fall back to `{cwd}/`

**`{feature-slug}` derivation** from the target doc filename:
- `docs/research/2026-05-10-vgx-human-production-rework-research.md` → `vgx-human-production-rework`
- Strip leading date `YYYY-MM-DD-` if present
- Strip trailing `-research` / `-spec` / `-feature` / `-doc` if present
- Lowercase, hyphenate, alphanumeric-only

Or override with `--name <slug>` and `--into <dir>` flags.

**No more `researchmaxer/active/`**, **no more `researchmaxer/archived/`**, **no more `.run` counter**. Each feature folder is self-contained and parallelizable.

**Parallel research-doc optimization** — multiple folders coexist with no conflict:
- `prompts/console-dock-researchmaxer/` (target A — Pass 1 complete, ready for Pass 2)
- `prompts/canvas-substrate-researchmaxer/` (target B — both passes complete)
- `prompts/vgx-rework-researchmaxer/` (target C — just generated)

Agents pick which folder they're working from via the EXECUTION-GUIDE.md inside each folder.

---

## Arguments

```
/researchmaxer <target-doc-path> [flags]

Flags:
  --name <slug>           Override the derived feature slug
                          (default: derived from target doc filename)
  --into <dir>            Override the parent directory for the feature folder
                          (default: prompts/ | docs/plan-hub/ | thoughts/handoffs/ | cwd)
  --folder <path>         Skip discovery — operate directly on the named feature folder
                          (useful for re-runs when the folder already exists)
  --improvement-only      Generate only stage 01 (improvement pass)
  --audit-only            Generate only stage 02 (audit & test pass);
                          requires {feature_folder} to exist with stage 01 result
  --native                Include "write MD" directive in the pass prompts

Examples:
  /researchmaxer docs/research/console-dock-research.md
      Full run — creates prompts/console-dock-researchmaxer/ with both passes

  /researchmaxer thoughts/canvas-research.md --name canvas-v2 --into thoughts/handoffs/
      Override slug + parent: thoughts/handoffs/canvas-v2-researchmaxer/

  /researchmaxer feature-spec.md --improvement-only
      Only generate stage 01 (Pass 1 — improvement)

  /researchmaxer feature-spec.md --audit-only
      Only regenerate stage 02 (Pass 2 — audit & test); requires the
      feature folder to already exist

  /researchmaxer --folder prompts/console-dock-researchmaxer/ --audit-only
      Operate directly on a known folder (skip discovery + slug derivation)

  /researchmaxer feature-spec.md --native
      Include "write MD" directive in both pass prompts (for native model agents)
```

**The target document path is REQUIRED** unless `--folder <path>` is provided (in which case the target doc is read from the folder's `manifest.yaml`).

**Parallel target docs:** Each target gets its own folder. You can run researchmaxer for doc A, then immediately for doc B, and both folders coexist:
- `prompts/console-dock-researchmaxer/` (target A — both passes complete)
- `prompts/canvas-substrate-researchmaxer/` (target B — only Pass 1 generated)
- `prompts/vgx-rework-researchmaxer/` (target C — fresh run)

Agents pick which folder they're working from via the EXECUTION-GUIDE.md and manifest.yaml inside each folder. No global state, no run counter, no archive collisions.

---

## The 5-Phase Workflow

```
Phase 0             Phase 1                Phase 2
ORIENTATION    ──►  DEEP RESEARCH     ──►  ANALYSIS &
(auto)              (ULTRATHINK +           SYNTHESIS
                     SUBAGENTS)             (ULTRATHINK)
                                                 │
                                                 ▼
              Phase 4               Phase 3
              OUTPUT &         ◄── PROMPT
              MANIFEST              GENERATION
```

---

## Phase 0: ORIENTATION

**Duration:** 5-10 minutes
**Goal:** Locate everything — target doc, project docs, codebase layout, test infrastructure
**Gate:** Complete inventory of target doc, context docs, codebase structure, and test suite

### Protocol

#### Step 0.1: Read Foundation Documents

Read these if they exist (in order):
1. `AGENTS.md` — agent guidelines, toolchain, rules
2. `README.md` — project overview
3. `CLAUDE.md` — project-specific instructions (check both root and `.claude/`)

#### Step 0.2: Locate and Validate the Target Document

```
TARGET DOCUMENT:
  Path: {user-specified path}
  Exists: yes/no (error if not found)
  Line count: {N}
  Classification: BRIEF (<500) / STRUCTURED (500-2000) / DEEP RESEARCH (2000+)
```

#### Step 0.3: Scan for Context Documents (READ-ONLY)

Find ALL project documentation that provides context for the feature:

```
SEARCH PATTERNS (adapt to project structure):
  docs/strategy/*.md, docs/layers/*.md        → Strategy/layer docs
  docs/spec/*.md, specs/*.md                  → Specifications
  docs/architecture/*.md, docs/design/*.md    → Architecture/design
  docs/research/*.md (EXCLUDING target doc)   → Related research
  thoughts/**/*.md                            → Informal design docs
  *-architecture*.md, *-spec.md, *-plan*.md   → Top-level docs
  README.md, *README*.md                      → Project overviews
```

Record each with: path, line count, scope, integration relevance to target doc.

If no context docs found, record `CONTEXT: GREENFIELD` — the skill still works.

#### Step 0.4: Map Codebase Structure

```
CODEBASE INVENTORY:
  Source code: src/, lib/, crates/, packages/
  Test suites: tests/, __tests__/, spec/, e2e/
  Build config: Cargo.toml, package.json, pyproject.toml, go.mod
  Test frameworks: cargo test, jest/vitest, playwright, pytest
  Build/lint commands: cargo build, npm run build, eslint, clippy
  CI configuration: .github/workflows/, .gitlab-ci.yml
```

#### Step 0.5: Derive Feature Slug + Parent Directory + Feature Folder

```
FEATURE SLUG:
  If --name <slug> flag provided: use it verbatim
  Else if --folder <path> provided: extract slug from folder basename
       (strip trailing "-researchmaxer")
  Else derive from target doc filename:
    1. Strip path:           docs/research/2026-05-10-vgx-human-production-rework-research.md
                             → 2026-05-10-vgx-human-production-rework-research.md
    2. Strip extension:      → 2026-05-10-vgx-human-production-rework-research
    3. Strip YYYY-MM-DD-:    → vgx-human-production-rework-research
    4. Strip -research / -spec / -feature / -doc suffix:
                             → vgx-human-production-rework
    5. Lowercase, hyphenate, alphanumeric+hyphen-only.
    6. If empty/invalid: ASK user for a slug.

PARENT DIRECTORY (mirrors pipemaxxer/featuremaxxer convention):
  If --into <dir> flag provided: use it
  Else if --folder <path> provided: use the path's parent
  Else check in order (use first that exists):
    1. prompts/                (recent pipemaxxer/featuremaxxer convention — recommended default)
    2. docs/plan-hub/          (older convention)
    3. thoughts/handoffs/      (oldest convention)
    4. Create prompts/ if writable
    5. Fall back to {cwd}/

FEATURE FOLDER:
  full_path = {parent_dir}/{feature-slug}-researchmaxer/

  If folder does NOT exist: create it. Continue.

  If folder ALREADY exists:
    - First-run mode (no --improvement-only / --audit-only / --folder): ASK user
      "Folder {full_path} already exists. (a) Re-use and overwrite pass files,
       (b) Pick a different slug, (c) Abort"
    - --improvement-only / --audit-only / --folder: re-use (this is expected)
```

#### Step 0.6: Detect Existing Pass State

Check if earlier pass outputs exist (for `--improvement-only` / `--audit-only` re-runs):

```
EXISTING IMPROVEMENT PASS:
  {feature_folder}/01-improvement-pass.md
  If found: prior Pass 1 exists. --audit-only is the natural follow-up.

EXISTING AUDIT PASS:
  {feature_folder}/02-audit-test-pass.md
  If found: prior Pass 2 exists. Both passes have been generated.

EXISTING MANIFEST:
  {feature_folder}/manifest.yaml
  If found: load existing metadata to preserve user edits;
  this run UPDATES (does not overwrite wholesale) stage entries.
```

#### Step 0.7: Apply Re-Run Skip Logic

If invoked with `--improvement-only` or `--audit-only`, focus the run:

```
RE-RUN ROUTING:

  --improvement-only:
    SKIP: Phase 3 stage-02 generation
    GENERATE: Only stage 01 (improvement pass)
    UPDATE: manifest.yaml stage 01 deliverable (mark regenerated, bump timestamp)

  --audit-only:
    REQUIRES: {feature_folder} exists (manifest.yaml + 01-improvement-pass.md)
    If missing: ERROR — "Run /researchmaxer first to generate stage 01."

    SKIP: Phase 3 stage-01 generation
    GENERATE: Only stage 02 (audit & test pass)
    UPDATE: manifest.yaml stage 02 deliverable

    Phase 1 (Deep Research) still runs — but the agent should NOT redo
    work that was captured in manifest.yaml's findings_summary if it's
    still accurate. Read existing 01-improvement-pass.md to understand
    what changed in the target doc, then layer audit findings on top.

  (no flag — full run):
    Execute all phases. Create feature folder, write manifest.yaml +
    EXECUTION-GUIDE.md + both pass prompts.
```

---

## Phase 1: DEEP RESEARCH (ULTRATHINK + SUBAGENTS REQUIRED)

**Duration:** 60-120 minutes — THIS IS THE MOST IMPORTANT PHASE
**Goal:** Build comprehensive understanding of the feature, the codebase, the existing docs, the test landscape, and all integration surfaces — deep enough to generate prompts packed with real context
**Gate:** Can articulate exactly how this feature fits into the codebase, what files it touches, what tests exist, what patterns to follow, and what tensions need resolution

### Why This Phase Exists

The entire value of researchmaxer is that the generated prompts contain REAL research findings — actual file paths, actual code patterns, actual test files, actual integration surfaces. Without deep research, the prompts are generic templates that produce generic results. **This phase is why researchmaxer exists.**

### What ULTRATHINK Means Here

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  1. SLOW DOWN — spend 3-5x longer than feels "necessary"                │
│  2. QUESTION EVERYTHING — what is the doc NOT saying?                   │
│  3. EXPLORE ALTERNATIVES — what are 3 other approaches?                 │
│  4. BUILD MENTAL MODELS — can I diagram every data flow?                │
│  5. STRESS TEST — what happens at scale / when things fail?             │
│  6. SYNTHESIZE — how does everything connect into a coherent whole?     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Protocol

#### Step 1.1: Read the Target Document Fully

Read the ENTIRE target document at least twice:
1. **First read:** What is it saying? Major sections, key decisions, data structures.
2. **Second read:** What is it implying? What's missing? What assumptions are embedded?

#### Step 1.2: Read ALL Context Documents

Read every context doc identified in Phase 0.3. For each, extract:
- How it relates to the target feature
- What terminology it defines that the feature must align with
- What invariants/constraints the feature must respect
- What integration surfaces exist

#### Step 1.3: Launch Codebase Exploration Subagents (CRITICAL)

**ALWAYS launch at least 2 Explore agents. 3-4 for complex features.**

Each agent should have a SPECIFIC focus. Adapt these templates to the actual feature:

```
AGENT 1: Integration Surfaces & Architecture
  "Explore the codebase for {project_name}. I need to understand:
   - Overall architecture (directory structure, module organization)
   - How features similar to {feature_description} are implemented
   - What modules/files the feature described in {target_doc} will touch
   - What APIs, types, and interfaces exist at those surfaces
   - What patterns the codebase uses (error handling, state management, etc.)
   Search for: {relevant keywords from the feature doc}
   For each finding: file path, line numbers, code snippet, relevance."

AGENT 2: Existing Test Suite & Testing Patterns
  "Explore the test infrastructure for {project_name}. I need to understand:
   - Where tests live and what frameworks are used
   - What E2E test harnesses exist
   - What integration test patterns are used
   - What test helpers, mocks, and fixtures exist
   - Which existing tests relate to {feature_description}
   - What test coverage gaps exist near the feature's integration surfaces
   Search for: test files, harnesses, fixtures, E2E flows
   For each finding: file path, what it tests, patterns to follow."

AGENT 3 (if warranted): Related Features & Reusable Patterns
  "Find features similar to {feature_description} in this codebase.
   - How were they implemented?
   - What shared utilities/types/helpers exist?
   - What can be reused for the new feature?
   For each: file path, pattern, how to apply to new feature."

AGENT 4 (if warranted): External Research
  "Research best practices and prior art for {feature_domain}:
   - What industry patterns exist for this type of feature?
   - What production systems have solved similar problems?
   - What gotchas and pitfalls are common?
   - What alternatives should be considered?"
```

**Wait for all subagents to complete before proceeding.** Their findings are the foundation for everything downstream.

#### Step 1.4: Extract Feature Value Proposition (Five WHYs)

For each major design decision in the doc, ask WHY five times to reach the root motivation:

```
VALUE PROPOSITION:
  What problem does this feature solve? For whom?
  What is the core "unlock"?
  What is the author's thesis about WHY this approach wins?
  What existing solutions does it replace or improve on?

COMPETITIVE FRAMING:
  What are the closest alternatives or prior art?
  Where does this feature DELIBERATELY differ from conventional wisdom?
  What is the author's strongest contrarian bet?
```

#### Step 1.5: Map Tensions

```
For each tension, note:
  - The two competing goals
  - The current resolution (if any)
  - Why the current resolution might be wrong
  - Specific scenarios that stress-test it
```

---

## Phase 2: ANALYSIS & SYNTHESIS (ULTRATHINK REQUIRED)

**Duration:** 30-60 minutes
**Goal:** Synthesize all research into structured findings that will be embedded in the handoff prompts
**Gate:** Have concrete, specific findings for every dimension that the prompts will address

### Protocol

#### Step 2.1: Build Integration Surface Map

From the subagent findings, build the SPECIFIC map:

```
INTEGRATION SURFACE MAP:

For each integration point:
  FILE: {exact_file_path}
  CURRENT BEHAVIOR: {what this code does now}
  FEATURE IMPACT: {how the feature changes/extends this}
  COMPLEXITY: Trivial / Moderate / Complex / Risky
  DEPENDENCIES: {what other surfaces depend on this}
  EXISTING TESTS: {test files that cover this surface}
  TEST GAPS: {what's not tested}
```

#### Step 2.2: Build Testing Landscape

```
TESTING LANDSCAPE:

  EXISTING TESTS AFFECTED:
    - {test_file:line_range}: {what it tests} → {what needs changing}
    ...

  NEW TESTS NEEDED:
    - {description}: {what it validates} ({type: unit/integration/E2E})
    ...

  E2E / REAL-RUNTIME FLOWS:
    - {flow_description}: {what runtime infrastructure is required}
    ...

  BROWSER-BASED TESTS NEEDED:
    - {flow}: {why it needs real browser interaction}
    ...

  TEST INFRASTRUCTURE GAPS:
    - {gap}: {what needs to be created}
    ...
```

#### Step 2.3: Assess Document Quality

```
QUALITY ASSESSMENT:

  STRONG SECTIONS:
    - §{N}: {what's strong about it}

  WEAK SECTIONS:
    - §{N}: {specific weakness — e.g., "hand-wavy on failure modes"}

  MISSING ENTIRELY:
    - {topic}: {why it should be in the doc}

  TERMINOLOGY ISSUES:
    - {term in doc} vs {term in codebase/project docs}: {conflict}

  INTEGRATION READINESS:
    - {assumption the doc makes that doesn't match reality}

  COHERENCE ISSUES:
    - §{A} says X but §{B} implies Y
```

#### Step 2.4: Identify Improvement Directives

Based on all research, build the SPECIFIC list of improvements:

```
IMPROVEMENT DIRECTIVES:

  EXPAND:
    - §{N}: {what detail needs adding, with specific codebase evidence}

  CORRECT:
    - §{N}: {what's wrong, with evidence from codebase/docs}

  ADD:
    - {new section/content}: {what it should contain, grounded in research}

  STRENGTHEN:
    - §{N}: {what's vague, what concrete detail to add}

  ALIGN:
    - {terminology/concept}: {how to align with project conventions}
```

---

## Phase 3: PROMPT GENERATION

**Duration:** 30-45 minutes
**Goal:** Generate two context-rich handoff prompts packed with actual research findings
**Gate:** Each prompt contains enough embedded context that the executing agent doesn't need to re-research

### What Makes These Prompts Different

```
BAD PROMPT (what v1 generated):
  "Review this research doc and improve it. Consider the existing
  system context. Look for quality gaps."
  → No files, no code, no specific findings. Useless.

GOOD PROMPT (what v2 generates):
  "The feature doc describes a Console Dock at §4.2. The codebase
  currently implements agent sessions in src/services/agent-session.ts
  (lines 45-120) using the AgentOutputStream pattern from L1.11. The
  doc assumes PTY-based streaming but the codebase uses CBOR WebSocket
  frames (see src/transport/ws-codec.ts:78). This is a critical
  misalignment. The existing test suite at tests/integration/session.test.ts
  covers session lifecycle but has no coverage for the streaming path
  the Console Dock requires..."
  → Specific files, specific lines, specific misalignments. Actionable.
```

**Every claim in the prompt must be grounded in research findings from Phase 1-2.** No placeholders, no generic language, no "consider the codebase."

### Generate Pass 1: Improvement Pass

See **references/TEMPLATES.md → Improvement Pass Template** for the full structure.

The improvement pass prompt must contain:

```
1. MISSION — Clear scope: improve the feature doc from every dimension
   "You are NOT implementing. You are researching, analyzing, and improving."
   One session: research → improve → edit the doc → fresh-eyes verify.

2. SOURCE-OF-TRUTH HIERARCHY
   Target doc = what to improve
   Existing project docs = context (READ-ONLY)
   Codebase = ground truth for what exists today

3. WHAT TO READ (with specific paths, line counts, and reading notes)
   Target doc: exact path, key sections to focus on
   Context docs: exact paths, what to look for in each
   Codebase files: exact paths, what patterns/types/APIs to study

4. EMBEDDED RESEARCH FINDINGS (THE CORE VALUE)
   Integration surface map (from Phase 2.1) — embedded verbatim
   Value proposition analysis (from Phase 1.4) — embedded
   Tension graph (from Phase 1.5) — embedded
   Quality assessment (from Phase 2.3) — embedded
   Codebase patterns discovered (from Phase 1.3 subagents) — embedded

5. IMPROVEMENT DIRECTIVES (from Phase 2.4) — embedded verbatim
   Specific sections to expand, correct, add, strengthen, align
   Each directive grounded in codebase evidence

6. THINK INDEPENDENTLY DIRECTIVE
   "After absorbing all context, generate YOUR OWN questions.
   Research externally where your analysis identifies gaps.
   Challenge the approach — what would an adversary architect do?
   The surface-level issues are flagged above. What remains are
   deep, non-obvious insights."

7. NON-NEGOTIABLES
   Existing system constraints the feature must respect
   Author's locked decisions (if identifiable)

8. WHAT I DON'T WANT
   Don't rewrite strong sections
   Don't change non-negotiables
   Don't edit existing project docs
   Don't add fluff — add substance

9. WHAT A GREAT OUTCOME LOOKS LIKE
   Feature doc that seamlessly integrates with the codebase
   All weak sections strengthened with concrete detail
   Terminology aligned with project conventions
   Usage patterns clear for both human users and AI agents
   Integration surfaces precisely documented

10. FOLLOW-UP FRESH-EYES PASS (run in same session after improvements)
    Re-read the improved doc with completely fresh eyes.
    Verify: coherence, terminology consistency, no bolted-on sections,
    integration readiness, nothing weakened.
```

### Generate Pass 2: Audit & Test Pass

See **references/TEMPLATES.md → Audit & Test Pass Template** for the full structure.

The audit & test pass prompt must contain:

```
1. MISSION — Audit the improved feature doc for gaps, gotchas, and
   implementation readiness. Define comprehensive testing strategy.
   "You are the last quality gate before implementation."

2. WHAT TO READ (same structure as Pass 1, but also read the
   improvement-pass output if it produced implementation-strategy notes)

3. EMBEDDED RESEARCH FINDINGS (same core from Phase 2, plus
   testing landscape from Phase 2.2 — embedded verbatim)
   Existing test files with paths and descriptions
   Test patterns and frameworks used
   E2E harness infrastructure
   Coverage gaps identified

4. AUDIT DIRECTIVES
   For each feature subsystem:
     - Is the design complete enough to implement?
     - Are failure modes documented?
     - Are edge cases addressed?
     - Does it integrate cleanly with existing code?
     - What gotchas will implementers hit?
   Cross-cutting:
     - Are there contradictions between sections?
     - Are there dependency cycles?
     - What's the weakest point?
     - What would a hostile code reviewer challenge?

5. TESTING STRATEGY REQUIREMENTS
   The agent MUST produce a complete testing strategy:

   a. EXISTING TEST UPDATES
      For each existing test affected:
        - File path, current coverage, what needs changing
      Embedded from Phase 2.2 findings

   b. NEW UNIT/INTEGRATION TESTS
      For each new test needed:
        - What it validates, test type, which patterns to follow
      Reference specific exemplar test files from the codebase

   c. E2E TEST MANIFESTS (CRITICAL — real, not stubs)
      Define end-to-end test scenarios that simulate REAL usage:
        - Agent workflows that exercise the full feature
        - NOT mock/stub simulations — real runtime tests
        - Each manifest: scenario name, preconditions, steps, expected
          outcomes, verification method
      These must cover EVERY aspect of the feature

   d. BROWSER-BASED TESTS (where applicable)
      For features with UI or web interaction:
        - Playwright MCP or agent-browser CLI test definitions
        - Real browser interaction, not headless stubs
        - Visual verification where relevant

   e. VERIFICATION CRITERIA
      For each feature subsystem, define:
        - What "correctly implemented" looks like
        - How to verify it (specific test commands, expected output)
        - What would indicate a regression

6. WHAT A GREAT OUTCOME LOOKS LIKE
   Every feature gap identified and fixed
   No implementation gotchas left undocumented
   Testing strategy covers every feature subsystem
   E2E manifests enable full verification by an agent
   A fresh implementation agent could build + verify the feature
   using only the doc + test manifests

7. FOLLOW-UP FRESH-EYES PASS (run in same session)
   Re-read doc + testing strategy with fresh eyes.
   Verify: no gaps in test coverage, E2E manifests are complete,
   verification criteria are specific enough, no contradictions.
```

---

## Phase 4: OUTPUT & MANIFEST

**Duration:** 5-10 minutes
**Goal:** Create the feature folder (if new), write both pass prompts + manifest + execution guide, report to user

### Create Feature Folder (Per-Feature Isolation)

```
1. RESOLVE feature folder path: {parent_dir}/{feature-slug}-researchmaxer/
   (parent + slug derived in §0.5)

2. IF folder does NOT exist:
   a. CREATE {parent_dir}/{feature-slug}-researchmaxer/
   b. CREATE manifest.yaml (see Manifest Schema below)
   c. CREATE EXECUTION-GUIDE.md (see Execution Guide Schema below)

3. IF folder ALREADY exists (re-run mode):
   a. PRESERVE existing files in folder
   b. OVERWRITE only the pass files this run is regenerating (per --flag)
   c. UPDATE manifest.yaml: mark regenerated stage entries with new timestamps
   d. APPEND a "Re-run note" entry to the EXECUTION-GUIDE.md change log

4. NO archive directory needed — each target doc is already isolated by folder.
   To "archive" a completed research-maxxing run, just leave the folder in place —
   it serves as historical reference for how the target doc was optimized.
```

### File Names

Numbered prefixes match pipemaxxer/featuremaxxer convention so the run order is obvious from `ls` alone:

```
{feature_folder}/manifest.yaml
{feature_folder}/EXECUTION-GUIDE.md
{feature_folder}/01-improvement-pass.md
{feature_folder}/02-audit-test-pass.md
```

### Manifest Schema

`manifest.yaml` contains research metadata + findings summary + pass deliverables. Template:

```yaml
name: {feature-slug}-researchmaxer
target: {Target Document Title — human-readable}
pipeline: researchmaxer
classification: {brief | structured | deep-research}
created: {YYYY-MM-DD}

source:
  target_doc: {path/to/target-doc.md}
  lines: {N}
  classification: {brief | structured | deep-research}

context_docs:
  - path: {path/to/context-doc.md}
    relevance: {one-line — how it relates to target}
  # ... or `[]` if GREENFIELD

codebase_research:
  subagents_launched: {N}
  files_examined: {N}
  modules_touched: {N}
  integration_surfaces: {N}
  existing_tests_analyzed: {N}
  test_frameworks: [{list}]

findings_summary:
  value_proposition: {one-line description}
  tensions_identified:
    - {tension 1 — one-line}
    - {tension 2 — one-line}
    # ... 3-5 for structured, 5+ for deep research
  quality_gaps:
    - {gap 1}
    - {gap 2}
  critical_integration_surfaces:
    - {file_path} — {what changes}
    # ... key files only
  improvement_directives_count: {N}

deliverables:
  - id: "01"
    file: 01-improvement-pass.md
    stage: improvement-pass
    role: producer
    produces: [improved target doc]
    consumes:
      - target_doc
      - context_docs (read-only)
      - codebase (read-only via Explore agents)
    duration_estimate_minutes: 60-120
    status: generated   # generated | regenerated | pending
    last_generated_at: {ISO-8601 timestamp}
  - id: "02"
    file: 02-audit-test-pass.md
    stage: audit-test-pass
    role: producer
    produces:
      - audit findings appended to target doc
      - E2E test manifests appended to target doc
      - verification criteria appended to target doc
    consumes:
      - improved target_doc (from stage 01)
      - existing test suite (read-only)
    depends_on: ["01"]
    duration_estimate_minutes: 60-90
    status: generated
    last_generated_at: {ISO-8601 timestamp}

isolation_contract:
  - "Target doc is the ONLY editable artifact."
  - "Existing project docs are READ-ONLY context."
  - "No codebase changes."

next_steps:
  - "/harmonymaxer to integrate into project docs"
  - "/featuremaxxer to produce implementation pipeline"
  - "/pipemaxxer to produce full 3-SOT pipeline"
```

### Execution Guide Schema

`EXECUTION-GUIDE.md` is the per-feature operating manual. Template:

```markdown
# {Target Title} — Researchmaxer Execution Guide

**Target document:** {path} ({line count}, {classification})
**Pipeline:** Researchmaxer (2-pass: improvement + audit/test)
**Generated:** {YYYY-MM-DD}

## Run Order

01 → improved target doc
   ↓
02 → audited target doc + E2E test manifests + verification criteria

## Critical Contracts

- **Target doc is the ONLY editable artifact.** Existing project docs are READ-ONLY context.
- **No codebase changes.** Researchmaxer is doc-only; implementation comes later via /featuremaxxer or /pipemaxxer.
- **Each pass runs fresh-eyes follow-up** in the same session before reporting done.
- **Real E2E test manifests** — no mocked/stubbed simulations.

## Embedded Findings (in pass prompts)

The pass prompts ALREADY contain the research findings — agents don't need to re-research:
- Integration surface map ({N} files)
- Testing landscape ({N} existing tests, {N} new tests needed)
- {N} tensions
- {N} quality gaps
- {N} improvement directives

## Required Skills (Invoke Per Pass)

| Pass | Required Skills |
|---|---|
| 01 Improvement | (depends on feature domain — pass prompt names specific skills) |
| 02 Audit & Test | (depends on testing surface — pass prompt names specific skills) |

## Checkpoints

After each pass, the agent should report and stop for human review before starting the next:

- **After 01:** report what changed in target doc + any deferred issues + Pass 2 risk notes
- **After 02:** report audit findings + E2E manifest summary + verification criteria + ready-for-handoff signal

## Verification

- Re-read target doc with fresh eyes after EACH pass
- Confirm: no contradictions, terminology aligned, integration surfaces precise
- Confirm: NO existing project doc was edited
- Confirm: E2E manifests are REAL (not stubs)

## When You're Done

Both passes complete → target doc is optimized and test-strategy-complete.

Next step is a HUMAN DECISION:
- `/harmonymaxer` to integrate the improved target doc into project docs
- `/featuremaxxer` to take it through the implementation pipeline (5 stages)
- `/pipemaxxer` to take it through the full 3-SOT pipeline (15 stages)

This folder remains as historical record. No archival needed.
```

### Report to User

```
RESEARCHMAXER OUTPUT:
  Feature folder: {parent_dir}/{feature-slug}-researchmaxer/
  Target document: {path} ({line_count} lines, {classification})
  Context docs read: {N} files
  Codebase explored: {N} files across {N} modules (via {N} subagents)
  Integration surfaces: {N} files identified
  Existing tests analyzed: {N} test files
  Tensions identified: {N}
  Quality gaps found: {N}

  Generated:
    1. 01-improvement-pass.md
       → Run FIRST: improves target doc from every dimension
       → Agent researches → improves → edits doc → fresh-eyes verify
       → Best with: model with deep reasoning + codebase access

    2. 02-audit-test-pass.md
       → Run AFTER stage 01 completes
       → Agent audits gaps → defines testing strategy → edits doc
       → Produces: E2E test manifests, verification criteria
       → Best with: model with deep reasoning + codebase access

  Plus: manifest.yaml + EXECUTION-GUIDE.md

  Workflow:
    1. Run 01-improvement-pass.md (agent edits the target doc directly)
    2. Run 02-audit-test-pass.md (agent audits + adds testing strategy)
    3. Target doc is now optimized and test-strategy-complete
    4. → /harmonymaxer to integrate into project docs
       → /featuremaxxer to produce implementation pipeline (5 stages)
       → /pipemaxxer to produce full 3-SOT pipeline (15 stages)

  Key findings embedded in prompts:
    Integration surfaces: {brief list}
    Critical tensions: {brief list}
    Biggest quality gaps: {brief list}

  Parallel research-doc optimization:
    Each target doc lives in its OWN folder — multiple target docs can be in-flight
    at the same time without collision. Agents pick the folder they're working from
    via the EXECUTION-GUIDE.md and manifest.yaml inside each folder.
```

---

## Quality Gates

### Gate 0 → 1: Orientation Complete
- [ ] Target document located with path and line count
- [ ] Context docs cataloged (or GREENFIELD noted)
- [ ] Codebase structure mapped (source, tests, build, CI)
- [ ] Derived feature-slug (from filename or `--name` flag)
- [ ] Resolved parent directory (`prompts/` | `docs/plan-hub/` | `thoughts/handoffs/` | cwd)
- [ ] Resolved feature folder path `{parent_dir}/{feature-slug}-researchmaxer/`
- [ ] Verified folder either doesn't exist (will create) OR existing folder confirmed re-usable
- [ ] Detected existing pass state (01/02 prior outputs, manifest.yaml) for re-run flag routing

### Gate 1 → 2: Deep Research Complete
- [ ] Target doc read fully (at least twice)
- [ ] All relevant context docs read
- [ ] **At least 2 Explore subagents launched and completed**
- [ ] Codebase integration surfaces identified with SPECIFIC file paths
- [ ] Existing test suite analyzed with SPECIFIC test file paths
- [ ] Test patterns and frameworks documented
- [ ] Value proposition extracted (Five WHYs applied)
- [ ] Tensions mapped (min 3 for structured doc, 5+ for deep research)

### Gate 2 → 3: Analysis & Synthesis Complete
- [ ] Integration surface map built with specific files and change descriptions
- [ ] Testing landscape built with specific test files and gaps
- [ ] Document quality assessed with specific section references
- [ ] Improvement directives built, each grounded in codebase evidence
- [ ] Terminology alignment issues identified (if context docs exist)

### Gate 3 → 4: Prompts Generated
- [ ] Improvement pass contains embedded research findings (not placeholders)
- [ ] Improvement pass references specific files, lines, and code patterns
- [ ] Improvement pass has fresh-eyes follow-up section
- [ ] Audit pass contains embedded testing landscape
- [ ] Audit pass requires E2E test manifests (real, not stubs)
- [ ] Audit pass requires browser-based tests where applicable
- [ ] Audit pass has verification criteria for every feature subsystem
- [ ] Audit pass has fresh-eyes follow-up section
- [ ] Neither prompt tells the agent to edit existing project docs

### Gate 4 → Done: Output & Manifest Complete
- [ ] Feature folder created at `{parent_dir}/{feature-slug}-researchmaxer/`
- [ ] manifest.yaml written with target doc metadata, codebase research stats, findings summary, deliverables, isolation contract, next steps
- [ ] EXECUTION-GUIDE.md written with run order, contracts, embedded findings reference, skills table, checkpoints, verification, next-step decision tree
- [ ] Both pass prompts written with numbered prefixes (01- and 02-)
- [ ] No `researchmaxer/active/` or `researchmaxer/archived/` or `.run` references anywhere in generated files
- [ ] User report includes the feature folder path so they can navigate to it

---

## Anti-Patterns

### The Empty Handoff
```
BAD: "Review this research doc. Consider the codebase. Find quality gaps."

WHY: No embedded research. No file paths. No specific findings. The
executing agent must re-do all the research from scratch, producing
generic results. The entire point of researchmaxer is that the SKILL
does the research and EMBEDS it in the prompts.
```

### The Scope Creep
```
BAD: Prompt tells agent to edit existing project docs alongside the target.

WHY: Researchmaxer's isolation guarantee. Target doc only. Integration
with project docs happens later via harmonymaxer.
```

### The Mock Test Trap
```
BAD: Testing strategy relies on mocked/stubbed E2E tests that don't
exercise real runtime behavior.

WHY: The audit pass must define REAL end-to-end tests — actual agent
workflows, actual browser interactions, actual runtime verification.
Mock-only tests hide integration bugs that only surface in production.
```

### The Planmaxer Clone
```
BAD: Generating N domain handoffs + N prepreps + holistic pass.

WHY: Researchmaxer is NOT planmaxer. It's two passes, not an iteration
cycle. Pass 1 improves. Pass 2 audits and tests. Done. If you need
multi-doc optimization, use planmaxer.
```

### The Research Skip
```
BAD: Generating prompts without launching codebase exploration subagents.

WHY: Without actual codebase research, the prompts contain no real file
paths, no real code patterns, no real test files. They become generic
templates that any agent could generate without the skill. The subagent
research in Phase 1.3 is non-negotiable.
```

---

## Effort Expectations

| Phase | Minimum Effort | What "Thorough" Looks Like |
|-------|----------------|---------------------------|
| **Phase 0** (Orientation) | 5-10 min | Full inventory of docs, codebase, tests |
| **Phase 1** (Deep Research) | 60-120 min | 2-4 subagents, 50+ files examined, all docs read |
| **Phase 2** (Analysis) | 30-60 min | Full surface map, testing landscape, quality assessment |
| **Phase 3** (Prompt Gen) | 30-45 min | Both prompts rich with embedded findings |
| **Phase 4** (Output) | 5-10 min | Archive, write, report |

**TOTAL: 2-4 hours for a substantial research doc.** If finishing in under 90 minutes, the research is too shallow and the prompts will be generic.

---

## Version History

See `metadata.changelog` in the frontmatter for the canonical version history. Highlights:

- **v3.0 (2026-05-11)** — Per-feature folder convention. Each target doc gets `{parent_dir}/{feature-slug}-researchmaxer/` with `manifest.yaml` + `EXECUTION-GUIDE.md` + numbered pass files (`01-improvement-pass.md`, `02-audit-test-pass.md`). Replaces shared `researchmaxer/active/` + `archived/` + `.run` pattern. Supports parallel research-doc optimization. Adds `--name`, `--into`, `--folder` flags. Matches pipemaxxer/featuremaxxer convention.
- **v2.0** — Complete rewrite: two-pass workflow (improvement + audit/test), mandatory subagent codebase exploration, prompts embed actual research findings, E2E test manifest requirements.
- **v1.x** — Initial skill (planmaxer-style, deprecated).
