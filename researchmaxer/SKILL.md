---
name: researchmaxer
description: "Optimize any research or feature document through deep codebase research and two expert passes — WITHOUT touching existing project documentation. Use when: user says 'researchmaxer', 'optimize my research', 'improve my feature doc', 'iterate on research', 'research review cycle', 'researchmax', or '/researchmaxer'. Does deep codebase exploration, reads all source docs, then generates two context-rich handoff prompts: (1) Improvement Pass — improve the feature from every dimension, (2) Audit & Test Pass — find gaps, define testing strategy with real E2E manifests. Each prompt is packed with actual research findings, file paths, and code context. Works on any codebase."
user_invocable: true
compatibility: "Works with Claude Code, Codex, and any Agent Skills-compatible tool."
metadata:
  author: steel
  version: "2.0"
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
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   /researchmaxer path/to/research-doc.md                                │
│       │                                                                 │
│       ├── Phase 0-3: Deep research (codebase, docs, subagents)          │
│       │                                                                 │
│       ├── Generates: IMPROVEMENT PASS     → researchmaxer/active/       │
│       └── Generates: AUDIT & TEST PASS    → researchmaxer/active/       │
│                                                                         │
│   USER RUNS improvement-pass.md                                         │
│       │   Agent researches → improves feature → edits research doc      │
│       │   Agent runs fresh-eyes follow-up in same session               │
│       │                                                                 │
│   USER RUNS audit-test-pass.md                                          │
│       │   Agent audits → finds gaps → defines testing strategy          │
│       │   Agent edits research doc with findings + test manifests       │
│       │   Agent runs fresh-eyes follow-up in same session               │
│       │                                                                 │
│   DONE: Research doc is optimized and test-strategy-complete            │
│                                                                         │
│   THEN: /harmonymaxer or /featuremaxxer (human decision)                │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Each handoff prompt is PACKED with research findings.** The executing agent gets:
- Full feature understanding with value proposition analysis
- Specific codebase file paths, code patterns, and integration surfaces
- Existing test suite analysis with specific test file references
- Architecture/design doc context relevant to the feature
- Tension analysis and quality gap identification
- Concrete improvement directives (not generic "improve this")

### File Structure

```
researchmaxer/                       (lives at project root or docs/researchmaxer/)
├── active/                          (current run)
│   ├── improvement-pass.md          (Pass 1: improve feature from every dimension)
│   └── audit-test-pass.md           (Pass 2: audit gaps + define testing strategy)
├── archived/                        (previous runs)
│   ├── run-001/
│   └── run-002/
└── .run                             (counter file: current run number)
```

---

## Arguments

```
/researchmaxer <target-doc-path> [flags]

Examples:
  /researchmaxer docs/research/console-dock-research.md       Full run — both passes
  /researchmaxer thoughts/canvas-research.md                   Target a specific doc
  /researchmaxer feature-spec.md --improvement-only            Only generate Pass 1
  /researchmaxer feature-spec.md --audit-only                  Only generate Pass 2
  /researchmaxer feature-spec.md --native                      Include "write MD" directive
```

**The target document path is REQUIRED.**

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

#### Step 0.5: Identify Output Location

```
Location priority:
  1. researchmaxer/ (if exists)
  2. docs/researchmaxer/ (if docs/ exists)
  3. Create researchmaxer/ at project root
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
**Goal:** Archive previous run (if any), write both prompts, report to user

### Archive Previous Run

If `researchmaxer/active/` has content:
1. Read run counter from `.run` (default 0)
2. Move `active/` to `archived/run-{NNN}/`
3. Increment counter
4. Recreate empty `active/`

### Write Prompts

```
researchmaxer/active/improvement-pass.md    (Pass 1)
researchmaxer/active/audit-test-pass.md     (Pass 2)
```

### Report to User

```
RESEARCHMAXER OUTPUT (run {N}):
  Target document: {path} ({line_count} lines, {classification})
  Context docs read: {N} files
  Codebase explored: {N} files across {N} modules (via {N} subagents)
  Integration surfaces: {N} files identified
  Existing tests analyzed: {N} test files
  Tensions identified: {N}
  Quality gaps found: {N}

  Generated:
    1. researchmaxer/active/improvement-pass.md
       → Run FIRST: improves feature doc from every dimension
       → Agent researches → improves → edits doc → fresh-eyes verify
       → Best with: model with deep reasoning + codebase access

    2. researchmaxer/active/audit-test-pass.md
       → Run AFTER improvement pass
       → Agent audits gaps → defines testing strategy → edits doc
       → Produces: E2E test manifests, verification criteria
       → Best with: model with deep reasoning + codebase access

  Workflow:
    1. Run improvement-pass.md (agent edits the research doc directly)
    2. Run audit-test-pass.md (agent audits + adds testing strategy)
    3. Research doc is now optimized and test-strategy-complete
    4. → /harmonymaxer to integrate into project docs
       → /featuremaxxer to produce implementation pipeline

  Key findings embedded in prompts:
    Integration surfaces: {brief list}
    Critical tensions: {brief list}
    Biggest quality gaps: {brief list}
```

---

## Quality Gates

### Gate 0 → 1: Orientation Complete
- [ ] Target document located with path and line count
- [ ] Context docs cataloged (or GREENFIELD noted)
- [ ] Codebase structure mapped (source, tests, build, CI)
- [ ] Output location determined

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

- v2.0.0 — Complete rewrite: replaced planmaxer-style multi-domain iteration with two-pass workflow (improvement + audit/test). Added mandatory subagent codebase exploration. Prompts now embed actual research findings instead of templates. Added E2E test manifest requirements.
- v1.1.0 — Fresh-eyes audit: Five WHYs, greenfield handling, cross-repo generalization
- v1.0.0 — Initial skill definition (planmaxer-style, deprecated)
