---
name: codebase-to-spec
description: Reverse-engineer existing codebases into comprehensive specification documents. Deep structural cartography, behavioral extraction, intent reconstruction, and unified spec output. Works on any codebase.
---

# Codebase to Spec Skill

> Reverse-engineer an existing codebase into a comprehensive, high-fidelity specification document.

---

# CRITICAL: READ THIS FIRST

## Why This Skill Exists

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   THIS IS THE INVERSE PIPELINE.                                                          │
│                                                                                          │
│   Forward:  idea → research → spec → plan → beads → execution                           │
│   Inverse:  codebase → THIS SKILL → spec → (same downstream pipeline)                   │
│                                                                                          │
│   The output of this skill is a single unified specification document that               │
│   captures EVERYTHING needed to reproduce the system from scratch.                       │
│                                                                                          │
│   A rushed or shallow extraction will produce:                                           │
│   • Missing requirements → incomplete rebuilds                                           │
│   • Wrong mental model → architecture that doesn't fit                                   │
│   • Overlooked edge cases → bugs in the rebuild                                          │
│   • Carbon-copy of mistakes → same tech debt, just newer code                            │
│   • Gaps in understanding → implementers blocked with questions                          │
│                                                                                          │
│   A thorough extraction will produce:                                                    │
│   • Complete behavioral spec → faithful reproduction                                     │
│   • Elevated design → BETTER than the original                                           │
│   • All edge cases captured → robust, complete implementation                            │
│   • Intent preserved → architecture that makes sense                                     │
│   • Pipeline-ready output → smooth spec-to-tdd handoff                                   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**THE QUALITY OF THIS EXTRACTION DIRECTLY DETERMINES THE QUALITY OF THE REBUILD.**

There is no shortcut. There is no "good enough." Every hour invested in extraction saves 10 hours of implementation confusion. Every behavior missed here becomes a gap, a regression, or a "wait, it was supposed to do THAT?" later.

---

## The Inverse Pipeline: Where You Sit

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   EXISTING CODEBASE ─────────────┐                                                       │
│         ↑                        │                                                       │
│    YOU ARE HERE                  │                                                       │
│    This is where understanding   ▼                                                       │
│    is won or lost       [codebase-to-spec]                                               │
│                                  │                                                       │
│                                  │  → Unified Extracted Spec (single document)            │
│                                  ▼                                                       │
│                          [spec-to-tdd]                                                   │
│                                  │                                                       │
│                                  │  ← TDD quality depends on spec quality                │
│                                  ▼                                                       │
│                          [spec-to-strategy]                                                   │
│                                  │                                                       │
│                                  │  ← Plan quality depends on spec quality               │
│                                  ▼                                                       │
│                          [beads-from-sources]                                                  │
│                                  │                                                       │
│                                  │  ← Bead quality depends on plan quality               │
│                                  ▼                                                       │
│                       [beads-to-execution]                                                │
│                                  │                                                       │
│                                  ▼                                                       │
│                        REBUILT SYSTEM                                                     │
│                   (cleaner, more robust)                                                  │
│                                                                                          │
│   GARBAGE EXTRACTION → GARBAGE REBUILD at every stage                                    │
│   QUALITY EXTRACTION → QUALITY REBUILD at every stage                                    │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**You are not just "reading code." You are creating the architectural blueprint that everything else builds upon.**

---

## The Core Philosophy: Intent Over Implementation

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   DO NOT CREATE A CARBON COPY.                                                           │
│                                                                                          │
│   The goal is NOT to perfectly describe every line of code as-is.                        │
│   The goal IS to capture the INTENT — what the code was TRYING to do —                   │
│   and specify that intent in a way that produces a BETTER system.                        │
│                                                                                          │
│   EXTRACT the intent    — what it was TRYING to do, not how it did it                    │
│   ELEVATE past mistakes — where anti-patterns exist, spec the RIGHT way                  │
│   NORMALIZE patterns    — where old code differs from new, pick the better               │
│   FILL gaps             — where error handling is missing, add it to spec                │
│   STRIP accidental      — remove workarounds, hacks, legacy constraints                  │
│                                                                                          │
│   Every requirement is tagged:                                                           │
│   [EXTRACTED] — faithful to original behavior                                            │
│   [ELEVATED]  — improved over original, with justification                               │
│                                                                                          │
│   A spec rebuilt from scratch using only [EXTRACTED] tags                                 │
│   would faithfully reproduce the original.                                               │
│                                                                                          │
│   A spec rebuilt using BOTH [EXTRACTED] + [ELEVATED] tags                                 │
│   would produce something BETTER than the original.                                      │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## What ULTRATHINK Actually Means

ULTRATHINK is not a buzzword. It is a specific cognitive approach required for Phase 4 (Intent Reconstruction).

### ULTRATHINK Methodology

```
ULTRATHINK = Extended, deliberate, multi-perspective reasoning about code intent

It means:
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  1. SLOW DOWN                                                                            │
│     • Do not rush to write the spec                                                      │
│     • Spend 3-5x longer than feels "necessary" in reasoning                              │
│     • The first interpretation of code intent is rarely the complete one                  │
│                                                                                          │
│  2. QUESTION EVERYTHING                                                                  │
│     • Why was this built this way?                                                       │
│     • Is this intentional design or accidental complexity?                                │
│     • What was the developer trying to achieve?                                          │
│     • What assumptions am I projecting onto this code?                                   │
│                                                                                          │
│  3. SEPARATE SIGNAL FROM NOISE                                                           │
│     • Which patterns are intentional? (well-tested, consistent, typed)                   │
│     • Which are accidental? (TODOs, dead code, inconsistent naming)                      │
│     • Which are forced? (workarounds, legacy compat, dep limitations)                    │
│     • Which are emergent? (patterns that evolved without design)                         │
│                                                                                          │
│  4. BUILD THE MENTAL MODEL                                                               │
│     • Can I explain this system to someone who's never seen it?                          │
│     • Can I trace any user action through the entire stack?                              │
│     • Do I understand WHY every major component exists?                                  │
│     • Where are the gaps in my understanding?                                            │
│                                                                                          │
│  5. IMPROVE THE DESIGN                                                                   │
│     • Where did the implementation fall short of its own intent?                         │
│     • What anti-patterns should a rebuild eliminate?                                     │
│     • What inconsistencies should be normalized?                                         │
│     • What missing behaviors should the spec fill in?                                    │
│                                                                                          │
│  6. SYNTHESIZE                                                                           │
│     • How does everything connect into a coherent specification?                         │
│     • Is the spec self-consistent? (no contradictions)                                   │
│     • Is the spec complete? (no gaps a builder would hit)                                │
│     • Is the spec better than a literal transcription?                                   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### What ULTRATHINK Feels Like

**WRONG (Shallow extraction):**
```
This module has a UserService with CRUD methods.
It uses bcrypt for passwords and JWT for tokens.
→ Write FR for user CRUD + auth. Move on.
```

**RIGHT (ULTRATHINK extraction):**
```
This module has a UserService with CRUD + auth. Let me deeply understand:

WHAT is the actual behavior?
- Create: validates email format, checks uniqueness, hashes password with bcrypt(12),
  generates UUID v4, stores with created_at. Returns user WITHOUT password field.
- But... the validation is incomplete. No password strength check. No email
  normalization. The unique check is app-level only, no DB constraint.

WHY was it built this way?
- Bcrypt(12) is good security — this was intentional.
- UUID v4 instead of auto-increment — privacy-conscious design choice.
- Missing DB unique constraint — likely an oversight, not intentional.
- No password strength check — early MVP, never added.

WHAT is the INTENT?
- Secure user management with privacy-focused ID generation.
- The INTENT is robust auth — the gaps are accidental, not design choices.

WHAT should the spec say?
- [EXTRACTED] bcrypt(12) password hashing
- [EXTRACTED] UUID v4 for user IDs
- [EXTRACTED] password field excluded from responses
- [ELEVATED] add DB-level unique constraint on email (the intent was uniqueness)
- [ELEVATED] add password strength validation (the intent was security)
- [ELEVATED] add email normalization (lowercase + trim) before uniqueness check

The spec captures the INTENT (secure user management) and ELEVATES
where the implementation fell short of that intent.
```

---

## Effort Expectations By Phase

| Phase | Minimum Effort | What "Thorough" Looks Like |
|-------|----------------|---------------------------|
| **Phase 0** | 10-20 minutes | Project fully profiled, scope locked, depth set |
| **Phase 1** | 30-60 minutes | 2-3 agents, all modules mapped, dep graph built |
| **Phase 2** | 60-120 minutes | 3-4 agents, 50+ files examined, all 10 dimensions |
| **Phase 3** | 30-45 minutes | All deps cataloged, config surface mapped, 3+ IADRs |
| **Phase 4** | 45-90 minutes | Deep ULTRATHINK, intent reconstructed, improvements listed |
| **Phase 5** | 120-180 minutes | 3000+ line unified document written |
| **Phase 6** | 30-45 minutes | Bidirectional check, handoff prompt generated |

**TOTAL MINIMUM: 5-9+ hours for a medium complexity, standard depth project**

If you're finishing in under 3 hours, you're almost certainly cutting corners.

---

## Scope & Depth: What to Extract

### Three Scope Modes

| Mode | When to Use | Coverage |
|------|-------------|----------|
| **Whole-Project** | "Extract spec from this codebase" | Every module, all public APIs, complete data model, all integrations |
| **Module-Targeted** | "Extract spec for `packages/auth/`" | Target module + boundary contracts (inbound/outbound deps) |
| **Feature-Targeted** | "Extract the real-time sync feature" | All files involved in feature, across ALL modules |

### Three Extraction Depths

| Depth | Output Size | What Gets Extracted |
|-------|-------------|--------------------|
| **Surface** | ~500-1500 lines | API signatures, field listings, entry→exit flows, deps list |
| **Standard** | ~2000-4000 lines | + Validation rules, state machines, step-by-step flows, security model, config |
| **Deep** | ~4000-8000+ lines | + Internal algorithms, performance, concurrency, all edge cases, complete error taxonomy |

### Depth Auto-Detection

```
IF user explicitly requests a depth:
  USE user's choice

ELSE IF scope_mode == "feature-targeted":
  IF feature_files < 20:  USE DEEP
  ELSE:                    USE STANDARD

ELSE IF scope_mode == "module-targeted":
  IF module_files < 30:   USE DEEP
  ELSE IF module_files < 100: USE STANDARD
  ELSE:                    USE STANDARD (warn about size)

ELSE IF scope_mode == "whole-project":
  IF total_files < 50:    USE DEEP
  ELSE IF total_files < 200: USE STANDARD
  ELSE:                    USE STANDARD (recommend module split)
```

See `references/SCOPE-GUIDE.md` for full scope definition protocols.

---

## Quality Gates: STOP Points Between Phases

**DO NOT proceed to the next phase until you can answer YES to every question.**

### Gate 0 → 1: Project Discovery Complete
- [ ] I know the project type (monorepo/single) and structure
- [ ] I know the tech stack (language, framework, build system, test framework)
- [ ] I know where source, tests, config, and docs live
- [ ] Scope mode is locked (whole/module/feature)
- [ ] Extraction depth is set (surface/standard/deep)
- [ ] Output path is determined
- [ ] I've read existing docs (README, ARCHITECTURE.md, CHANGELOG)

### Gate 1 → 2: Structural Cartography Complete
- [ ] All modules/packages enumerated with file counts
- [ ] All entry points discovered (routes, CLI, event handlers, workers)
- [ ] Architectural pattern identified (Clean Arch, MVC, Event-Driven, Layered)
- [ ] Internal dependency graph built (imports/uses)
- [ ] Test coverage landscape assessed (what's tested, what's not)
- [ ] ASCII architecture diagram created
- [ ] I launched at least 2 Explore agents

### Gate 2 → 3: Behavioral Extraction Complete
- [ ] All public APIs extracted with signatures, pre/post-conditions, errors
- [ ] All data models captured with fields, types, constraints, relationships
- [ ] 3-5 major data flows traced end-to-end (standard) or ALL flows (deep)
- [ ] Error model documented (error types, propagation, recovery)
- [ ] State machines identified with states, transitions, guards
- [ ] Validation logic extracted
- [ ] Security model mapped (auth, authz, data protection)
- [ ] 50+ files examined (standard) or 100+ files (deep)
- [ ] I launched at least 3 extraction agents

### Gate 3 → 4: Dependency & Interface Mapping Complete
- [ ] All external dependencies cataloged (name, version, purpose, coupling depth)
- [ ] External services mapped (databases, caches, queues, APIs)
- [ ] Configuration surface documented (env vars, config files, feature flags)
- [ ] Operational concerns noted (logging, metrics, health checks)
- [ ] 3+ Inferred Architecture Decision Records created

### Gate 4 → 5: Intent Reconstruction Complete (ULTRATHINK)
- [ ] Signal separated from noise (intentional vs accidental complexity)
- [ ] User stories reconstructed from behavioral extraction
- [ ] Goals and non-goals inferred with evidence
- [ ] 3-5 design principles extracted
- [ ] Design Improvement Pass complete (current → proposed → justification)
- [ ] Contradictions resolved (not just noted)
- [ ] I can explain the system's purpose in 2-3 sentences
- [ ] My mental model of the spec is BETTER than the original implementation
- [ ] I spent at least 45 minutes in ULTRATHINK reasoning

### Gate 5 → 6: Unified Spec Document Complete
- [ ] Document has all 19 sections (11 architecture + 4 spec + 4 elevation)
- [ ] All sections are substantive (not placeholder)
- [ ] ASCII diagrams present for architecture and major data flows
- [ ] All data models complete with fields, types, constraints
- [ ] All FRs have: identifier (FR-X.Y.Z), source evidence, [EXTRACTED]/[ELEVATED] tag
- [ ] All FRs have: acceptance criteria, core test
- [ ] User stories cover all major features
- [ ] Design Improvements Register populated (current → proposed → justification)
- [ ] Technical Debt Register populated
- [ ] Confidence levels annotated (HIGH/MEDIUM/LOW) per section
- [ ] Document is 3000+ lines (standard) or 5000+ lines (deep)

---

## Anti-Patterns: What NOT To Do

### The Transcription Trap

```
BAD:
"The UserService has a create() method that takes name, email, password
 and returns a User object."

Why it's bad:
- Listing function signatures is NOT extracting requirements
- No behavior described (what validation? what errors? what side effects?)
- An implementer learns nothing they couldn't get from reading the code
- This is TRANSCRIPTION, not EXTRACTION
```

**Correct approach:** Extract the BEHAVIOR — "System validates email format and uniqueness, hashes password with bcrypt(12), persists user with generated UUID, returns user without password field. Returns 409 if email exists, 400 if email format invalid."

### Implementation Leak

```
BAD:
"Uses a BTreeMap<UserId, SessionHandle> protected by an Arc<RwLock<>>
 with 30-second TTL eviction via a tokio::spawn'd background task."

Why it's bad:
- Describes HOW, not WHAT
- The spec should say WHAT the system does, not which data structures it uses
- An implementer in a different language can't use this
- Implementation details change; behavioral contracts don't
```

**Correct approach:** "System maintains active session registry with O(1) lookup by user ID. Sessions are automatically evicted after 30 seconds of inactivity. Registry supports concurrent read access."

### Completionist Trap

```
BAD:
Spending 2 hours documenting every private helper function,
internal utility, and implementation detail of one module
while missing entire other modules.

Why it's bad:
- Private functions are implementation detail, not spec
- Breadth-first then depth-first prevents this
- Time budget is finite — spend it where it matters
```

**Correct approach:** Extract the PUBLIC CONTRACT of each module. Private functions exist to serve the public contract — they don't need their own FRs. Go breadth-first across all modules, THEN deep on critical paths.

### Dead Code Inclusion

```
BAD:
Creating FRs for commented-out features, deprecated endpoints,
or code paths behind permanent feature flags set to false.

Why it's bad:
- Spec describes what the system DOES, not what it USED TO DO
- Dead code inflates the spec without adding value
- Implementers waste time building features no one uses
```

**Correct approach:** Note dead code in the Technical Debt Register if relevant, but do NOT create FRs for it. If there's ambiguity about whether something is dead, check test coverage and usage patterns.

### Carbon Copy Syndrome

```
BAD:
Faithfully specifying every bug, workaround, anti-pattern, and
tech debt from the original as if they were requirements.

"The system uses setTimeout(500) to wait for the database to be ready"
"Error responses are a mix of JSON and plain text strings"
"Some endpoints validate input, others don't"

Why it's bad:
- Reproduces all the problems of the original
- Defeats the purpose of re-specifying the system
- A rebuild should be BETTER, not the same with new code
```

**Correct approach:** Capture the INTENT, not the accidents. Tag improvements as [ELEVATED] with justification:
- [ELEVATED] "System uses connection pool with health checks" (was: setTimeout hack)
- [ELEVATED] "All error responses use consistent JSON envelope" (was: mixed formats)
- [ELEVATED] "All endpoints validate input against schema" (was: inconsistent)

### Assumption Omission

```
BAD:
Stating extracted requirements with full confidence when the code
is ambiguous, the tests are missing, and the behavior is unclear.

Why it's bad:
- Extraction inherently involves inference
- Confident-sounding wrong specs cause confident wrong implementations
- Human review is needed for uncertain areas
```

**Correct approach:** Always annotate confidence levels. Mark LOW-confidence items explicitly and generate review questions for the human.

### Archaeology Tunnel Vision

```
BAD:
Spending 3 hours reverse-engineering one obscure algorithm
while major features remain completely unexamined.

Why it's bad:
- Unbalanced extraction produces incomplete specs
- One deeply-understood module + 10 unexamined modules = useless spec
- The obscure algorithm might be less important than the basic CRUD
```

**Correct approach:** Breadth-first then depth-first. Map EVERYTHING at surface level first. Then go deep on the most critical paths. Use time budget proportional to importance.

---

## The 7 Phases: Detailed Protocols

## Phase 0: PROJECT DISCOVERY + SCOPE DEFINITION

**Duration:** 10-20 minutes
**Goal:** Understand project structure, define extraction boundaries, set output paths
**Gate:** Project type identified, scope locked, depth set, output path determined, git history mined

### Protocol

#### Step 0.1: Find Project Root

Search for root markers:
```
.git/            → Git repository root
package.json     → Node.js / TypeScript
Cargo.toml       → Rust
pyproject.toml   → Python
go.mod           → Go
pom.xml          → Java (Maven)
build.gradle     → Java/Kotlin (Gradle)
```

#### Step 0.2: Identify Tech Stack

| Detection File | Tech Stack | Package Manager |
|----------------|------------|-----------------|
| `tsconfig.json` | TypeScript | npm/yarn/pnpm/bun |
| `package.json` (only) | JavaScript | npm/yarn/pnpm |
| `pyproject.toml` | Python | pip/poetry/uv |
| `Cargo.toml` | Rust | cargo |
| `go.mod` | Go | go modules |
| `pom.xml` | Java (Maven) | maven |
| `build.gradle` | Java/Kotlin (Gradle) | gradle |

#### Step 0.3: Map Top-Level Structure

Find these directories:
- **Source:** `src/`, `lib/`, `app/`, `packages/*/src/`
- **Tests:** `__tests__/`, `tests/`, `test/`, `spec/`, `*_test.go`
- **Docs:** `docs/`, `documentation/`, `README*`, `ARCHITECTURE*`
- **Config:** `config/`, `.config/`, `.env*`, `*.toml`, `*.yaml`

#### Step 0.4: Read Existing Documentation

Read these if they exist (they declare intent explicitly):
- `README.md` — project purpose, getting started
- `ARCHITECTURE.md` — declared architecture
- `DESIGN.md` — design decisions
- `CHANGELOG.md` — feature history, reveals evolution and intent
- `CONTRIBUTING.md` — conventions

#### Step 0.5: Mine Git History (Git Archaeology)

Git history is one of the most powerful intelligence sources for reverse-engineering. Use it.

```bash
# Recent commit messages reveal active development areas and intent
git log --oneline -50

# File change frequency reveals what's actively maintained vs stale
git log --format='' --name-only -100 | sort | uniq -c | sort -rn | head -30

# Blame on critical files reveals WHY code exists
git blame {critical_file} | head -50

# Find when major architectural patterns were introduced
git log --all --oneline --diff-filter=A -- '*.rs' | tail -20  # first files added
```

**What git history reveals:**
- **Commit messages** explain WHY changes were made (intent you can't see in code alone)
- **File change frequency** identifies hotspots (high-change = important or troubled)
- **Author patterns** explain inconsistencies (different developers, different patterns)
- **Deletion history** reveals non-goals (features that were tried and removed)
- **Evolution trajectory** shows where the codebase is HEADING (migrating to async? new framework?)

This is intelligence you cannot get from reading code alone. Spend 5-10 minutes here.

#### Step 0.6: Determine Scope Mode

Parse user's invocation to determine scope:

| User Says | Scope Mode |
|-----------|-----------|
| "Extract spec from this codebase" | Whole-Project |
| "Reverse-engineer this project" | Whole-Project |
| "Extract spec for `packages/auth/`" | Module-Targeted |
| "Spec the database layer" | Module-Targeted |
| "Extract the real-time sync feature" | Feature-Targeted |
| "How does payments work?" + "spec it" | Feature-Targeted |

If ambiguous after reading the invocation, ask ONE clarifying question using `AskUserQuestion`.

#### Step 0.7: Auto-Detect Depth

Apply the depth auto-detection algorithm (see above or `references/SCOPE-GUIDE.md`).

#### Step 0.8: Set Output Path

```
Priority:
1. docs/specs/ (if docs/ exists)
2. thoughts/shared/specs/ (if thoughts/ exists)
3. Create docs/specs/
```

**Filename:** `{YYYY-MM-DD}-{slug}-extracted-spec.md`

#### Step 0.9: Document Project Profile (Internal Notes)

```markdown
## Project Profile

**Root:** {path}
**Type:** {monorepo/single/workspace}
**Stack:** {language} / {framework} / {runtime}
**Build:** {build system}
**Test:** {test framework}
**Package Manager:** {pm}
**File Count:** ~{N} source files
**Scope:** {Whole-Project | Module-Targeted: {path} | Feature-Targeted: {feature}}
**Depth:** {Surface | Standard | Deep} ({auto-detected | user-specified})
**Output:** {output path}
**Existing Docs:** {list of docs found}
```

---

## Phase 1: STRUCTURAL CARTOGRAPHY

**Duration:** 30-60 minutes
**Goal:** Map the complete structural topology — modules, entry points, layers, dependency graph
**Gate:** All modules enumerated, entry points found, dependency graph built, ASCII diagram created

### Launch 2-3 Parallel Explore Agents

**ALWAYS launch at least 2 agents. 3 for large or complex projects.**

#### Agent 1: Directory & Module Scanner

```
PROMPT FOR AGENT 1:

Explore the codebase at {project_root} to map its complete structure.

I need you to discover:

1. ALL MODULES/PACKAGES
   - Every directory that represents a distinct module or package
   - File count and approximate LOC per module
   - What each module is responsible for (infer from names, exports, README)

2. ALL ENTRY POINTS
   - Application entry points (main functions, server starts)
   - Route/endpoint definitions (HTTP, WebSocket, gRPC)
   - CLI command definitions
   - Event handlers and subscribers
   - Background workers, cron jobs, scheduled tasks
   - Test entry points (test runner configuration)

3. PUBLIC API SURFACE (per module)
   - What each module exports (functions, types, classes)
   - Which exports are used by other modules vs external consumers

4. FILE CATEGORIZATION
   Categorize every source file as:
   - LIBRARY: reusable code (types, utils, services)
   - APPLICATION: entry points, routes, handlers
   - TEST: test files
   - CONFIG: configuration, build, deployment
   - DOCUMENTATION: docs, READMEs

Search patterns:
{Use language-specific patterns from references/LANGUAGE-HEURISTICS.md}

For each module, report:
- Directory path
- File count
- Approximate responsibility
- Key exported symbols
- Entry points (if any)
```

#### Agent 2: Import/Dependency Analyzer

```
PROMPT FOR AGENT 2:

Analyze the internal dependency structure of {project_root}.

I need you to build:

1. IMPORT GRAPH
   - For each module, what other modules does it import/depend on?
   - Trace import/use/require statements across all source files
   - Identify the DIRECTION of dependencies (A depends on B)

2. DEPENDENCY METRICS
   - Which modules have the MOST dependents (high fan-in = core/shared)
   - Which modules depend on the MOST others (high fan-out = orchestrators)
   - Are there circular dependencies? (if so, which modules?)

3. LAYER DETECTION
   - Can modules be organized into layers?
   - Which modules are "leaf" (depend on nothing)?
   - Which are "root" (nothing depends on them)?
   - What's the longest dependency chain?

4. SHARED TYPES
   - What types/interfaces are shared across module boundaries?
   - Where are they defined?
   - How many modules use them?

Output as:
- Dependency table: Module → [depends on]
- Fan-in/fan-out table: Module, fan-in count, fan-out count
- Circular deps (if any)
- Layer diagram (if layers detected)
- Shared types table: Type → defined in → used by
```

#### Agent 3: Layer & Pattern Detector (Large Projects Only)

```
PROMPT FOR AGENT 3:

Identify architectural patterns and layer structure in {project_root}.

I need you to determine:

1. ARCHITECTURAL PATTERN
   - Clean Architecture / Hexagonal / Ports & Adapters?
   - MVC / MVVM?
   - Event-Driven / Event-Sourced?
   - Layered (presentation → business → data)?
   - Microservices / Modular Monolith?
   - Something else?
   Provide EVIDENCE for your assessment (file structure, naming, imports).

2. SERVICE PATTERNS
   - How are services structured? (classes, modules, functions)
   - What naming conventions are used?
   - How do services communicate?

3. DATA ACCESS PATTERNS
   - Repository pattern? Active Record? Direct queries?
   - ORM or query builder used?
   - How are database operations structured?

4. MIDDLEWARE / CROSS-CUTTING CONCERNS
   - Authentication middleware
   - Logging middleware
   - Error handling middleware
   - Validation middleware
   - Rate limiting, caching

5. EVENT SYSTEM
   - Is there an event bus or message system?
   - What events are emitted?
   - What subscribes to events?
```

### Synthesize Agent Results

After agents return, synthesize into:

1. **Module Table**

| Module | Path | Files | Responsibility | Fan-in | Fan-out |
|--------|------|-------|---------------|--------|---------|
| {name} | {path} | {N} | {description} | {N} | {N} |

2. **Internal Dependency Graph** (ASCII)

```
┌──────────┐     ┌──────────┐     ┌──────────┐
│  Routes  │ ──▶ │ Services │ ──▶ │   Data   │
│  (app)   │     │ (domain) │     │  (infra) │
└──────────┘     └──────────┘     └──────────┘
                      │
                      ▼
                 ┌──────────┐
                 │  Events  │
                 │  (cross) │
                 └──────────┘
```

3. **Entry Points List**
4. **Test Coverage Landscape** — what modules have tests, what's untested
5. **Domain Glossary** — any domain-specific terminology (e.g., "workspace", "tenant", "zone") that has a specific meaning in this codebase. Misunderstanding domain vocabulary causes misspecification.
6. **Architectural Red Flags** — note obvious structural issues for Phase 4 input:
   - Circular dependencies (A→B→C→A)
   - God modules (>1000 LOC with 10+ dependents)
   - Orphaned modules (no dependents, not an entry point)
   - Layer violations (data layer importing presentation layer)
   - Naming inconsistencies across modules

Don't analyze these yet — just flag them. Phase 4's Design Improvement Pass handles the analysis.

### Extract Test Behavioral Contracts

**Tests are the #1 most authoritative source of behavioral specifications.** They deserve dedicated attention.

```
Glob for: **/*test*|**/*spec*|**/__tests__/**

For each test file:
1. Read test names — these are FR descriptions written by the original developer
2. Read assertions — these are acceptance criteria, directly
3. Read test fixtures/factories — these reveal valid data shapes
4. Read mock configurations — these reveal expected service contracts
5. Note what ISN'T tested — these are confidence gaps
```

**Test names map directly to spec language:**
- `"should create user with valid email"` → FR: Create User Account
- `"should reject duplicate email"` → AC: GIVEN duplicate email WHEN create THEN 409
- `"should hash password before storing"` → AC: password stored as bcrypt hash

Integration tests are especially valuable — they document expected cross-component behavior.
E2E tests document complete user journeys.

**Prioritize test-heavy modules** — they have the highest-confidence extractions.

---

## Phase 2: BEHAVIORAL EXTRACTION (Core Phase)

**Duration:** 60-120 minutes
**Goal:** Extract what the code DOES — behaviors, data flows, state machines, error handling
**Gate:** All public APIs extracted, all data models captured, 3-5+ flows traced, error model documented, 50+ files examined

### The 11 Extraction Dimensions

Extract across all 11 dimensions per the patterns in `references/EXTRACTION-PATTERNS.md`:

1. **Public API Surface** — every operation exposed to consumers
2. **Data Models** — all structured types with fields, constraints, relationships
3. **State Machines** — states, transitions, guards, invalid transition handling
4. **Data Flows** — end-to-end request→response traces with error handling
5. **Validation Logic** — all constraints enforced on data
6. **Error Handling** — error types, propagation, recovery strategies
7. **Side Effects** — all interactions with external state (DB, network, filesystem)
8. **Configuration** — everything configurable vs hardcoded
9. **Security Model** — authentication, authorization, data protection
10. **Concurrency Model** — async patterns, shared state, ordering guarantees
11. **Cross-Cutting Invariants** — system-wide rules that span all dimensions (ID format, timestamp convention, API envelope format)

### Launch 3-4 Parallel Extraction Agents

**CRITICAL: Context-Pass Phase 1 Findings to All Agents**

Every Phase 2 agent prompt MUST include the key findings from Phase 1:
- The module table (which modules exist, their paths, their responsibilities)
- The entry points list (so agents know where to START tracing)
- The dependency graph (so agents understand module relationships)
- The domain glossary (so agents use consistent terminology)

Without this context, Phase 2 agents will waste time re-discovering structure and may miss modules entirely. Append a "## Context from Phase 1" section to each agent prompt below with the synthesized Phase 1 output.

#### Agent 1: API & Interface Extractor

```
PROMPT FOR AGENT 1:

Extract every public API from {scope_path} in {project_root}.

For EACH public function/method/endpoint, document:
1. Name and location (file:line)
2. Input parameters with types and constraints
3. Return type and possible values
4. Preconditions (what must be true before calling)
5. Postconditions (what is guaranteed after calling)
6. Error conditions (what can go wrong, error types returned)
7. Side effects (what external state changes)

Focus on BEHAVIOR, not implementation:
- BAD: "calls bcrypt.hash() on the password parameter"
- GOOD: "hashes password using bcrypt with cost factor 12"

Search using language-specific patterns:
{Insert appropriate patterns from references/LANGUAGE-HEURISTICS.md}

For HTTP endpoints also capture:
- HTTP method and path
- Request body schema
- Response body schema
- Status codes (success AND error)
- Authentication requirements
- Rate limiting (if any)

For WebSocket endpoints:
- Connection lifecycle (open, message types, close)
- Message schemas (inbound and outbound)
- Authentication method
```

#### Agent 2: Data Model & Schema Extractor

```
PROMPT FOR AGENT 2:

Extract every data model from {scope_path} in {project_root}.

For EACH data model (struct, class, interface, schema, DB table), document:
1. Name and semantic meaning (what does this represent?)
2. ALL fields with types
3. Required vs optional fields
4. Default values
5. Validation constraints (min/max, format, enum values, patterns)
6. Relationships to other models (references, foreign keys, nesting)
7. Serialization format (JSON field names, DB column names if different)
8. Database indices (if applicable)

Also find:
- Enums that represent domain concepts (statuses, categories, types)
- Type aliases that encode business meaning
- Configuration schemas
- Event/message types
- API request/response types

Search for:
{Insert appropriate patterns from references/LANGUAGE-HEURISTICS.md}

For each model, classify as:
- DOMAIN: core business entity
- API: request/response types
- EVENT: event/message payloads
- CONFIG: configuration schemas
- INTERNAL: implementation-only types (note but don't deep-extract)
```

#### Agent 3: State & Flow Extractor

```
PROMPT FOR AGENT 3:

Trace major data flows and state machines in {scope_path} in {project_root}.

STATE MACHINES:
For each state machine (enum with status/state/phase semantics):
1. All possible states
2. Initial state
3. Terminal states
4. Valid transitions: State A → State B
5. Guard conditions (when is transition allowed?)
6. Actions on transition (what side effects?)
7. What happens on invalid transitions?

DATA FLOWS:
For each major user action / entry point:
1. Trigger (what initiates the flow)
2. Step-by-step processing:
   a. Component → action → output
   b. Transformations applied
   c. Decisions/branches
   d. Async boundaries
3. Final result/effect
4. Error handling at each step
5. Timeout/retry behavior

Trace at least {3 for standard, ALL for deep} end-to-end flows:
- Start from entry points found in Phase 1
- Follow function calls downstream
- Note every service/repository call
- Track data transformations
- Find the terminal action (DB write, response, event emit)
```

#### Agent 4: Edge Case & Error Model Extractor

```
PROMPT FOR AGENT 4:

Extract the complete error model and edge case handling from {scope_path}.

ERROR TYPES:
For each custom error type/variant:
1. Error name and category
2. When it occurs (conditions)
3. Error code (HTTP status, custom code)
4. User-facing message vs internal message
5. How it propagates (caught where? converted to what?)
6. Recovery strategy (retry, fallback, fail)

EDGE CASE HANDLING:
Find all:
- Retry logic (what, when, how many times, backoff strategy)
- Timeout handling (what has timeouts, what values, what happens on timeout)
- Rate limiting (what's limited, what limits, what happens when exceeded)
- Circuit breakers (what's protected, what thresholds, what's the fallback)
- Graceful degradation (what degrades, how)
- Input validation edge cases (empty strings, max lengths, special characters)
- Concurrent access handling (locks, optimistic concurrency, idempotency keys)

CRASH RECOVERY:
- What happens on unexpected shutdown?
- Is there transaction rollback?
- Are there cleanup mechanisms?
- Is there data integrity protection?
```

### Synthesize Extraction Results

After agents return, organize findings into the 10 dimensions. For EACH finding, classify:

- **SIGNAL** — intentional design, well-tested, consistent pattern
- **NOISE** — accidental complexity, dead code, workaround
- **IMPROVEMENT OPPORTUNITY** — gap where the spec should exceed the original

---

## Phase 3: DEPENDENCY & INTERFACE MAPPING

**Duration:** 30-45 minutes
**Goal:** Catalog external dependencies, configuration, operational concerns, infer ADRs
**Gate:** All deps cataloged, services mapped, config documented, 3+ IADRs created

### Step 3.1: External Dependency Catalog

Read lock files (`package-lock.json`, `Cargo.lock`, `poetry.lock`, `go.sum`) and manifest files.

For each significant dependency:

| Dependency | Version | Category | Purpose | Coupling Depth | License |
|-----------|---------|----------|---------|---------------|---------|
| {name} | {ver} | {runtime/dev/build} | {what it does for the project} | {deep/shallow} | {license} |

**Coupling depth:**
- **Deep** — pervasive throughout codebase, hard to replace
- **Shallow** — used in one place, easily swappable

### Step 3.2: External Service Mapping

| Service | Type | Connection | Config | Failure Handling |
|---------|------|-----------|--------|-----------------|
| {name} | {DB/cache/queue/API} | {protocol, host, port} | {env vars} | {retry/circuit breaker/fallback} |

### Step 3.3: Configuration Surface

For each configurable value:

| Config Key | Type | Default | Valid Range | Used By | Restart Required | Secret? |
|-----------|------|---------|-------------|---------|-----------------|---------|
| {key} | {type} | {default} | {range} | {where} | {yes/no} | {yes/no} |

### Step 3.4: Operational Concerns

Document:
- **Logging:** patterns used, log levels, structured vs unstructured
- **Metrics/Telemetry:** what's measured, what's exported
- **Health Checks:** endpoints, what they check
- **Graceful Shutdown:** signals handled, cleanup sequence
- **Migrations:** database migration approach, version management

### Step 3.5: Infer Architecture Decision Records (IADRs)

For each major technology choice visible in the code, create an IADR:

```markdown
### IADR-{N}: {Decision Title}

**Decision:** {what was chosen}
**Evidence:** {code patterns, dep versions, config that reveal this choice}
**Inferred Rationale:** {why this was likely chosen — based on project context}
**Confidence:** {HIGH | MEDIUM | LOW}
**Alternatives Considered:** {what else could have been chosen}
```

Create at least 3 IADRs. Common subjects:
- Why this framework? (Express vs Fastify, Actix vs Axum)
- Why this database? (PostgreSQL vs MongoDB)
- Why this architecture? (monolith vs microservices)
- Why this auth approach? (JWT vs sessions)
- Why this deployment model? (containers vs serverless)

---

## Phase 4: INTENT RECONSTRUCTION (ULTRATHINK REQUIRED)

**Duration:** 45-90 minutes minimum
**Goal:** Synthesize all extracted data into a coherent mental model of WHY the system exists
**Gate:** Intent reconstructed, improvements documented, contradictions resolved, mental model is BETTER than original

**THIS IS THE HARDEST AND MOST IMPORTANT PHASE.**

This is where you transform raw extraction data into a coherent specification that captures the system's intent and ELEVATES beyond its current implementation.

### Core Method: Hypothesis-Driven Reasoning

**Do NOT linearly classify findings and move on.** Instead, apply the scientific method:

```
OBSERVE → HYPOTHESIZE → PREDICT → TEST → REFINE → SYNTHESIZE
   ↑                                         │
   └─────────────────────────────────────────┘
         (iterate until model is stable)
```

**Why this matters:** Linear classification produces shallow specifications. Hypothesis-driven reasoning forces you to verify your understanding against the actual codebase, catching misinterpretations BEFORE they become wrong FRs.

**The loop:**
1. **OBSERVE** — review extraction findings from Phases 1-3
2. **HYPOTHESIZE** — form theories about WHY the system is designed this way
3. **PREDICT** — if the hypothesis is correct, what ELSE should be true in the code?
4. **TEST** — go back to the codebase and verify predictions (use Read/Grep)
5. **REFINE** — update hypotheses based on what you find
6. **SYNTHESIZE** — once the model is stable (predictions consistently confirmed), proceed

**Example:**
```
OBSERVE: Auth module uses JWT with 15-minute expiry, refresh tokens in HttpOnly cookies
HYPOTHESIZE: System is designed for browser-based SPA with security focus
PREDICT: If true, I should find CORS configuration, CSRF protection, and no API key auth
TEST: Check for CORS middleware, CSRF tokens, API key routes
RESULT: Found CORS config, found CSRF middleware. BUT also found API key auth on /api/v1/*
REFINE: System serves BOTH a browser SPA AND external API consumers
         → This explains why there are two auth strategies
```

Without this loop, you'd have missed the dual-consumer architecture.

**Minimum iterations:** 3 hypothesis-test cycles before proceeding. More for complex systems.

**Convergence Criteria** — how to know when to STOP iterating:
1. Predictions consistently match observations (3+ correct predictions in a row)
2. No new counter-evidence found in 2 consecutive hypothesis tests
3. All major subsystems have at least 1 CONFIRMED hypothesis
4. You can explain the system's purpose and design rationale without referencing specific code
5. The mental model is coherent and stable

**Abductive Reasoning** — inference to the best explanation:

When you encounter unexplained complexity or seemingly unnecessary code, DON'T dismiss it as noise. Instead, reason backwards:

```
OBSERVATION: This function has an unusually complex retry mechanism with jitter
QUESTION: "What scenario would REQUIRE this specific complexity?"
ABDUCTION: High-concurrency access to a shared resource causes thundering herd
VERIFICATION: Check for shared resource + concurrent callers → CONFIRMED
```

Abductive reasoning catches the non-obvious design decisions that pure deductive reasoning misses. If code seems unnecessarily complex, assume the original developer had a reason — find it.

### Step 4.1: Separate Signal from Noise (20+ minutes)

Go through ALL extracted behaviors and classify:

**Intentional Design (SIGNAL):**
- Well-tested code paths (high test coverage = intentional)
- Consistent patterns (if the same pattern appears 5+ times, it's a design choice)
- Rich type definitions (detailed types = careful design)
- Error handling that covers specific cases (not generic catch-all)
- Documentation/comments explaining WHY

**Accidental Complexity (NOISE):**
- TODO/FIXME/HACK comments
- Dead code (unused functions, commented-out blocks)
- Inconsistent patterns (old code uses X, new code uses Y)
- Missing error handling on paths that clearly should have it
- Workarounds with explanatory comments
- Deprecated features still in code

**Forced Constraints (CONTEXT):**
- Legacy compatibility code
- Workarounds for dependency limitations
- Platform-specific code
- Backwards compatibility layers
- These should NOT be reproduced in spec — spec the ideal behavior

### Step 4.2: Form and Test Hypotheses (15+ minutes) — NEW

Before reconstructing user stories, verify your mental model:

```
For each major module/subsystem:
  1. HYPOTHESIZE: "This module exists to {purpose} because {evidence}"
  2. PREDICT: "If that's true, then I should find {X} in {location}"
  3. TEST: Read/Grep to verify prediction
  4. If prediction FAILS: revise hypothesis and re-test
  5. If prediction SUCCEEDS: hypothesis strengthened

Document each cycle:
  HYPOTHESIS: {theory}
  PREDICTION: {what should be true}
  EVIDENCE: {what was found}
  VERDICT: CONFIRMED / REFUTED / PARTIAL → {revised theory}
```

**You must find at least one REFUTED or PARTIAL hypothesis.** If all hypotheses are confirmed on first attempt, you're not testing hard enough — your predictions are too safe. Push for surprising predictions.

### Step 4.2b: Extraction Backfill (as needed) — NEW

**When hypothesis testing reveals Phase 2 gaps, DO NOT just note them — go back and extract.**

During Step 4.2, you may discover subsystems, behaviors, or entire modules that Phase 2 agents missed. Common triggers:
- Hypothesis test reveals an unexpected code path not in any agent's extraction
- A module's true purpose differs from what Phase 1 categorized it as
- Cross-module interactions that no agent traced because each only looked at one side

**Protocol:**
```
IF hypothesis testing reveals significant unextracted behavior:
  1. STOP Phase 4 iteration
  2. Launch a focused Explore agent for the gap:
     "Extract {specific behavior} from {specific files/module}.
      Context: Phase 4 hypothesis testing revealed {what was discovered}.
      Focus on: {specific extraction dimensions relevant to the gap}."
  3. Integrate new findings into Phase 2 extraction notes
  4. RESUME Phase 4 from the hypothesis that triggered the backfill
  5. Note in Reconciliation: "Backfill extraction performed for {area} — triggered by {hypothesis}"
```

**Guard against over-triggering:** Only backfill for SIGNIFICANT gaps (missing modules, major behaviors, critical error paths). Don't backfill for minor details or edge cases — those can be captured during Phase 5 writing.

### Step 4.3: Reconstruct User Stories (15+ minutes)

From the extracted behaviors (now validated by hypothesis testing), reverse-engineer user stories:

```
For each major feature area:
  1. Who uses this? (infer from auth checks, route names, UI components)
  2. What can they do? (infer from endpoints, actions, state transitions)
  3. Why would they do it? (infer from data flows, business logic)

Format:
  As a {user type},
  I want to {action},
  So that {benefit}.

  Evidence: {file:line references that implement this story}
```

### Step 4.4: Reconstruct Goals & Non-Goals (15+ minutes)

**Goals** — infer from what IS implemented:
- What the system does well → goal
- What gets the most code coverage → high-priority goal
- What has the most error handling → critical goal

**Non-Goals** — infer from what is NOT implemented:
- Common features that are absent → likely non-goal
- Explicit comments saying "not supported" → confirmed non-goal
- Simple workarounds instead of proper solutions → deferred, not goal

Mark each as: `Inferred (evidence: {what code suggests this})`

### Step 4.5: Identify Design Principles (10+ minutes)

What principles does the code implicitly follow?

Examples:
- "Explicit errors over silent failures" (evidence: extensive error types)
- "Security by default" (evidence: auth middleware on all routes)
- "Event-driven communication" (evidence: event bus used pervasively)
- "Configuration over convention" (evidence: everything is configurable)

### Step 4.6: Design Improvement Pass (20+ minutes) — CRITICAL

This is what makes the extracted spec BETTER than the original.

For EACH major area of the system, systematically ask:

```
1. WHERE DID THE IMPLEMENTATION FALL SHORT OF ITS OWN INTENT?
   - Missing error handling on paths that clearly should have it
   - Incomplete validation (validates some fields but not others)
   - Inconsistent API response formats
   - Missing edge case handling that the test names suggest was planned

2. WHAT ANTI-PATTERNS SHOULD A REBUILD ELIMINATE?
   - God objects (classes doing too many things)
   - Circular dependencies
   - Tight coupling between modules
   - Global mutable state
   - Stringly-typed interfaces

3. WHERE ARE WORKAROUNDS FOR CONSTRAINTS THAT NO LONGER APPLY?
   - Legacy API compatibility layers
   - Old dependency version workarounds
   - Platform-specific hacks that a new build wouldn't need

4. WHAT INCONSISTENCIES SHOULD BE NORMALIZED?
   - Old code uses callbacks, new code uses async/await → spec uses async/await
   - Some modules use Repository pattern, others use direct queries → normalize
   - Error messages in different formats → standardize

5. WHAT GAPS SHOULD THE SPEC FILL?
   - If the intent is "robust user auth" but token expiry isn't handled gracefully
   - If the intent is "data integrity" but there's no transaction rollback
   - If the intent is "observability" but half the services don't log
```

For EACH improvement, document:

```markdown
### IMP-{N}: {Improvement Title}

**Current:** {what the code does now}
**Proposed:** {what the spec should specify}
**Justification:** {why this serves the original INTENT better}
**Tag:** [ELEVATED]
```

### Step 4.7: Map Success Criteria (10+ minutes)

What would "working correctly" mean for this system?

Derive from:
- Test assertions (what do tests check?)
- Error handling (what does the code protect against?)
- Monitoring/alerting (what does the code measure?)
- But ELEVATE — what SHOULD it check that it doesn't?

### Step 4.8: Reconcile Contradictions (10+ minutes)

Where the code contradicts itself:
- Old pattern vs new pattern → resolve in favor of the BETTER approach
- Tests that contradict implementation → investigate, note in reconciliation
- Documentation that contradicts code → code is truth, but note the discrepancy
- Different modules handling same concern differently → normalize

---

## Phase 5: UNIFIED SPEC DOCUMENT GENERATION

**Duration:** 120-180 minutes
**Goal:** Produce a single comprehensive source-of-truth document
**Gate:** All 19 sections substantive, ASCII diagrams present, all FRs with identifiers + source evidence + tags

### Output Path

Write to the path determined in Phase 0. Use the template from `TEMPLATES.md`.

### Document Structure (19 Sections)

Follow the complete template in `TEMPLATES.md`. The structure is:

```
Part I — SYSTEM ARCHITECTURE (from Phases 1, 3)
  1.  System Overview (ASCII diagram, component descriptions, layer boundaries)
  2.  Data Flow Diagrams (ASCII sequence diagrams per major flow)
  3.  Data Models (domain models, DB schema, event types, config schema)
  4.  API Surface (REST/HTTP, WebSocket, CLI, internal module APIs)
  5.  Component Map (per component: location, responsibility, public API, deps)
  6.  State Management (application state, state machines with transitions/guards)
  7.  Error Architecture (error type hierarchy, propagation, recovery strategies)
  8.  Security Architecture (authn, authz, data protection)
  9.  External Dependencies & Services (runtime deps, external services, config)
  10. Operational Architecture (logging, metrics, health, build/deploy)
  11. Inferred Architecture Decision Records (IADRs)

Part II — FUNCTIONAL SPECIFICATION (from Phases 2, 4)
  12. Goals & Non-Goals (inferred, with evidence)
  13. Functional Requirements (FR-X.Y.Z with Source Evidence + tags)
  14. User Stories (reconstructed from behavioral extraction)
  15. E2E Test Scenarios (clean slate protocol + scenario flows)

Part III — DESIGN ELEVATION (unique to reverse-engineering)
  16. Design Improvements Register (current → proposed → justification)
  17. Technical Debt Register (anti-patterns, inconsistencies to eliminate)
  18. Reconciliation Notes (ambiguities, confidence levels, human review items)
  19. Risks, Dependencies & Future Considerations
```

### Writing the Functional Requirements (Section 13)

This is the most critical section. Each FR MUST have:

```markdown
#### FR-{DOM}.Y.Z: {Requirement Title}

**Source Evidence:** `{file_path}:{line_range}`
**Tag:** [EXTRACTED] | [ELEVATED]
**Elevation Justification:** {only if [ELEVATED] — why this improves on original}
**Confidence:** {HIGH | MEDIUM | LOW}

**Description:**
{What the system must do — behavioral, not implementation}

**Acceptance Criteria:**
- GIVEN {precondition} WHEN {action} THEN {expected result}
- GIVEN {precondition} WHEN {action} THEN {expected result}

**Core Test:**
```
TEST: {test description}
SETUP: {what to set up}
ACT: {what action to take}
ASSERT: {what to verify}
```
```

### FR Numbering Convention

```
FR-{DOM}.Y.Z where:
  {DOM} = Domain abbreviation (e.g., AUTH, DATA, API, UI, SYNC, TASK)
  Y = Feature group within domain (1-based)
  Z = Specific requirement (1-based)

Example:
  FR-AUTH.0.0 = Auth domain overview
  FR-AUTH.1.1 = Auth domain, Group 1, Requirement 1
  FR-AUTH.1.2 = Auth domain, Group 1, Requirement 2
  FR-AUTH.2.1 = Auth domain, Group 2, Requirement 1
  FR-DATA.1.1 = Data domain, Group 1, Requirement 1
```

### Size Targets

| Depth | Minimum Lines | Target Lines |
|-------|--------------|-------------|
| Surface | 500 | 500-1500 |
| Standard | 2000 | 3000-4000 |
| Deep | 4000 | 5000-8000+ |

If your document is under the minimum for your depth level, you're missing detail.

---

## Phase 6: VALIDATION, RECONCILIATION & HANDOFF

**Duration:** 30-45 minutes
**Goal:** Verify accuracy, ensure pipeline compatibility, generate handoff
**Gate:** Bidirectional checks complete, handoff prompt generated, human review items listed

### Step 6.1: Bidirectional Verification

**Forward check** — every FR traces to code:
```
For each FR in the spec:
  → Does Source Evidence point to real, current code?
  → If [EXTRACTED]: does the code actually do what the FR says?
  → If [ELEVATED]: is the elevation justified by the original intent?
```

**Backward check** — every significant code path has an FR:
```
For each major public function/endpoint/handler:
  → Is there an FR that covers this behavior?
  → If not, is it intentionally excluded? (dead code, internal detail)
  → If missing, add it now.
```

Document gaps:
- **Missing FRs** — code paths without spec coverage → add FRs
- **Phantom FRs** — FRs that don't trace to real code (and aren't [ELEVATED]) → investigate

### Step 6.2: Pipeline Compatibility + Internal Cross-Reference Check

Verify the document works with downstream skills:

- [ ] FR-{DOM}.Y.Z numbering is consistent and sequential
- [ ] Acceptance criteria use GIVEN/WHEN/THEN format
- [ ] Core tests have SETUP/ACT/ASSERT structure
- [ ] Data models have enough detail for schema creation
- [ ] API surface has enough detail for implementation
- [ ] E2E scenarios can be translated to actual test code

**Internal cross-reference integrity** — verify all document self-references are valid:

- [ ] Every FR referenced in User Stories (§14) exists in Functional Requirements (§13)
- [ ] Every FR referenced in E2E Scenarios (§15) exists in §13
- [ ] Every DI referenced in FRs ([ELEVATED] tag) appears in Design Improvements Register (§16)
- [ ] Every data model referenced in API Surface (§4) exists in Data Models (§3)
- [ ] Every component referenced in Data Flows (§2) exists in Component Map (§5)
- [ ] Every state machine referenced in FRs exists in State Management (§6)
- [ ] No orphan sections (every section references or is referenced by at least one other)

### Step 6.3: Confidence Annotation Review

Final pass on all confidence levels:
- [ ] HIGH: well-tested, clear intent, consistent pattern
- [ ] MEDIUM: partially tested or inferred from context
- [ ] LOW: ambiguous, untested, contradictory evidence

For every LOW confidence item, generate an explicit question:
```markdown
### Human Review Required

- [ ] Q1: {specific question about ambiguous behavior}
  Evidence: {what code suggests, and why it's unclear}

- [ ] Q2: {specific question about intent}
  Evidence: {conflicting signals in the code}
```

### Step 6.4: Generate Handoff Prompt

Create handoff prompt at `{output-dir}/prompts/{date}-{slug}-handoff.md`.

Use the handoff template from `TEMPLATES.md`. The prompt should:
1. Reference the extracted spec document
2. Highlight [ELEVATED] requirements for special attention
3. List human review items
4. Guide the next skill in the pipeline (`spec-to-tdd`)

### Step 6.5: Deliver Handoff Summary to User

```markdown
## Extraction Complete

### Document Location
`{output-path}`

### Extraction Metrics
- Files examined: {N}
- Modules covered: {N}
- Functional Requirements: {N} ({N} extracted, {N} elevated)
- Data Models: {N}
- Data Flows traced: {N}
- Confidence: {N} HIGH, {N} MEDIUM, {N} LOW

### Items Requiring Human Review
{list of LOW-confidence items and explicit questions}

### Design Improvements
{N} improvements identified — see Section 16 of the spec

### Next Steps
To proceed to TDD specification:
```
/spec-to-tdd
Spec: {output-path}
```
```

---

## What Good Looks Like: Worked Examples

### Example 1: Extracting a State Machine

**Source Code (Rust):**
```rust
// src/task/status.rs:15-45
pub enum TaskStatus {
    Pending,
    InProgress,
    Blocked(String),  // reason
    Completed,
    Failed(String),   // error message
}

impl TaskStatus {
    pub fn can_transition_to(&self, next: &TaskStatus) -> bool {
        matches!((self, next),
            (TaskStatus::Pending, TaskStatus::InProgress) |
            (TaskStatus::InProgress, TaskStatus::Completed) |
            (TaskStatus::InProgress, TaskStatus::Failed(_)) |
            (TaskStatus::InProgress, TaskStatus::Blocked(_)) |
            (TaskStatus::Blocked(_), TaskStatus::InProgress) |
            (TaskStatus::Failed(_), TaskStatus::Pending)     // retry
        )
    }
}
```

**BAD Extraction (Transcription Trap):**
```
FR-TASK.1.1: Task status is an enum with variants Pending, InProgress,
Blocked(String), Completed, Failed(String).
```

**GOOD Extraction:**
```markdown
#### FR-TASK.1.1: Task Lifecycle State Machine

**Source Evidence:** `src/task/status.rs:15-45`
**Tag:** [ELEVATED]
**Elevation Justification:** Original allows retry (Failed→Pending) but has no
maximum retry count, creating potential infinite retry loops. Spec adds retry limit.
**Confidence:** HIGH

**Description:**
Tasks follow a defined lifecycle with 5 states:
- **Pending**: initial state, task awaiting execution
- **InProgress**: task actively being worked on
- **Blocked**: task cannot proceed, with reason (string)
- **Completed**: task finished successfully (terminal)
- **Failed**: task encountered error, with message (terminal unless retried)

**Valid Transitions:**
| From | To | Guard |
|------|----|-------|
| Pending | InProgress | — |
| InProgress | Completed | — |
| InProgress | Failed | error occurs |
| InProgress | Blocked | blocking condition met |
| Blocked | InProgress | blocking condition resolved |
| Failed | Pending | retry requested, retry_count < max_retries |

**Invalid transitions** return error (not silently ignored).

**Acceptance Criteria:**
- GIVEN a Pending task WHEN started THEN status becomes InProgress
- GIVEN an InProgress task WHEN completed THEN status becomes Completed
- GIVEN a Failed task WHEN retried AND retry_count < 3 THEN status returns to Pending
- GIVEN a Failed task WHEN retried AND retry_count >= 3 THEN retry is rejected
- GIVEN a Completed task WHEN any transition attempted THEN error returned

**Core Test:**
TEST: Task state machine rejects invalid transitions
SETUP: Create task with status Completed
ACT: Attempt transition to InProgress
ASSERT: Error returned, status unchanged
```

### Example 2: Extracting an API Endpoint

**Source Code (TypeScript):**
```typescript
// src/routes/users.ts:23-58
router.post('/users', authMiddleware, async (req, res) => {
  const { name, email, password } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const existing = await db.users.findByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'Email already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await db.users.create({
    id: uuid(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date(),
  });

  const { password: _, ...userResponse } = user;
  res.status(201).json(userResponse);
});
```

**GOOD Extraction:**
```markdown
#### FR-USER.1.1: Create User Account

**Source Evidence:** `src/routes/users.ts:23-58`
**Tag:** [ELEVATED]
**Elevation Justification:** Original only validates email contains '@'.
Spec requires proper RFC 5322 email validation, password strength check,
and email normalization (lowercase + trim) before uniqueness check.
**Confidence:** HIGH

**Description:**
Create a new user account with name, email, and password.
Password is hashed before storage. User ID is generated as UUID v4.
Response excludes the password field.

**Acceptance Criteria:**
- GIVEN valid name, email, password WHEN POST /users THEN 201 + user object (no password)
- GIVEN email that fails RFC 5322 validation WHEN POST /users THEN 400 + error
- GIVEN email that already exists (case-insensitive) WHEN POST /users THEN 409 + error
- GIVEN password shorter than 8 characters WHEN POST /users THEN 400 + error [ELEVATED]
- GIVEN request without auth token WHEN POST /users THEN 401

**Core Test:**
TEST: Create user with valid data
SETUP: Clear users table, prepare valid user data
ACT: POST /users with { name: "Test", email: "test@example.com", password: "SecureP@ss1" }
ASSERT: 201 status, response has id/name/email/createdAt, response does NOT have password,
        user exists in database with bcrypt-hashed password
```

### Example 3: Identifying a Design Improvement

```markdown
### IMP-4: Consistent Error Response Format

**Current:** Error responses mix formats:
- Auth errors: `{ "error": "Unauthorized" }` (src/middleware/auth.ts:30)
- Validation errors: `{ "errors": [{ "field": "email", "message": "..." }] }` (src/routes/users.ts:25)
- DB errors: `{ "message": "Internal error" }` (src/services/user.ts:45)
- Some endpoints return plain strings

**Proposed:** All error responses use consistent JSON envelope:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable message",
    "details": [{ "field": "email", "issue": "Invalid format" }]
  }
}
```

**Justification:** The intent is a well-structured API (evidenced by consistent
success response formatting). The error format inconsistency is accidental — likely
from different developers at different times. A consistent envelope improves
client-side error handling and debugging.

**Tag:** [ELEVATED]
```

---

## Quick Reference: Tool Usage

### Internal Codebase Research (Phases 1-3)

| Tool | Use For |
|------|---------|
| `mcp__morph-mcp__warpgrep_codebase_search` | Broad semantic codebase search |
| `Task` + `subagent_type=Explore` | Deep parallel exploration (2-4 agents) |
| `Glob` | Find files by pattern (`**/*.rs`, `**/*.ts`) |
| `Grep` | Search file contents for patterns |
| `Read` | Read specific files |
| `Bash` | Project metrics (file counts, LOC), git log |

### User Interaction (Phase 0)

| Tool | Use For |
|------|---------|
| `AskUserQuestion` | Scope clarification (max 1 question) |

### Language-Specific Search Patterns

See `references/LANGUAGE-HEURISTICS.md` for language-specific Glob/Grep patterns.

### Extraction Dimension Patterns

See `references/EXTRACTION-PATTERNS.md` for what to extract and how.

### Output Template

See `TEMPLATES.md` for the complete 19-section unified document template.

### Quality Checklist

See `CHECKLIST.md` for the comprehensive verification checklist.

---

## Scope Negotiation Protocol

If the user's scope request is ambiguous, use `AskUserQuestion` with this pattern:

```
Question: "I see several ways to scope this extraction. Which fits your goal?"

Options:
A) Whole project — extract everything (~{N} files, estimated {depth} depth)
B) Module: {module_name} — just the {module_description} (~{N} files)
C) Feature: {feature_name} — trace the {feature} across all modules (~{N} files)
```

**Maximum 1 scope question.** If still unclear after one question, default to the most conservative interpretation (smaller scope) and note what was excluded.

For Whole-Project with >500 files:
```
"This is a large project ({N} files). I recommend extracting module-by-module
for best quality. Which module should we start with?"
```

---

## Handling Edge Cases

### Monorepo Projects

- Identify each package/workspace as a separate module
- Map cross-package dependencies explicitly
- For whole-project mode: start with shared/core packages, then applications

### No Tests

- Lower confidence on all behavioral extractions
- Lean more heavily on code comments and documentation
- Flag in reconciliation notes: "No test coverage — all behaviors inferred from code"
- Recommend test creation as first downstream step

### Minimal Documentation

- Don't guess project intent from code alone if it's truly ambiguous
- Note gaps in reconciliation: "No README/docs — purpose inferred from code structure"
- Create more IADRs with MEDIUM/LOW confidence

### Mixed Languages

- Use appropriate heuristics per language (see `references/LANGUAGE-HEURISTICS.md`)
- Note the language boundary in the component map
- Document cross-language interfaces carefully (FFI, IPC, HTTP)

### Very Large Codebase (>1000 files)

- Strongly recommend Module-Targeted mode
- If user insists on Whole-Project, use Surface depth
- Focus agents on high-fan-in modules (core abstractions)
- Time-box Phase 2 per module

### Legacy / Unclear Code

- Increase use of MEDIUM/LOW confidence ratings
- Note code smells in Technical Debt Register
- Be more generous with [ELEVATED] improvements
- When in doubt about intent, document the ambiguity explicitly

### Generated / Vendored / Auto-Generated Code

- **Detect first, exclude from behavioral extraction:**
  - Look for auto-generation headers: `// Code generated by`, `// DO NOT EDIT`, `@generated`
  - Look for vendored directories: `vendor/`, `third_party/`, `generated/`
  - Look for build output that's committed: `dist/`, `build/`, `*.pb.go`, `*.generated.ts`
- **Do NOT create FRs for generated code** — it's an implementation artifact
- **DO document the generation source** in the Component Map (e.g., "protobuf definitions generate gRPC stubs")
- **DO spec the input** that produces the generated code (e.g., `.proto` files, OpenAPI specs, database schemas)

### Session Resumption (Large Codebases)

For extractions spanning multiple sessions (>500 files, Deep depth on complex systems):

1. **Save progress checkpoint** at the end of each session:
   ```markdown
   ## Extraction Checkpoint — {date}

   ### Completed Phases
   - Phase 0: COMPLETE — project profile at {path}
   - Phase 1: COMPLETE — structural map at {path}
   - Phase 2: IN PROGRESS — 6/10 modules extracted

   ### Modules Extracted So Far
   - [x] core-types (45 files)
   - [x] auth (23 files)
   - [x] api-routes (67 files)
   - [ ] event-system (34 files)  ← RESUME HERE

   ### Key Findings So Far
   {summarize critical discoveries that inform remaining work}

   ### Next Session Plan
   1. Complete Phase 2 for remaining modules
   2. Phase 3: dependency mapping
   3. Phase 4: intent reconstruction
   ```

2. **On resumption:** read the checkpoint, verify nothing has changed in the codebase (`git status`/`git log` since checkpoint), then continue from where you left off.

3. **If codebase changed** since checkpoint: re-verify affected modules only, don't restart from scratch.

### Priority-Based Time Allocation (Multi-Module)

When extracting a multi-module project, allocate time proportional to importance:

```
Time allocation = f(fan-in count, test coverage, file count, user-facing?)

High Priority (40% of time):
  - Modules with highest fan-in (core abstractions)
  - Modules with most tests (most specified behavior)
  - User-facing entry points (routes, CLI, UI)

Standard Priority (40% of time):
  - Business logic modules
  - Data access / infrastructure modules

Low Priority (20% of time):
  - Utility/helper modules
  - Configuration modules
  - Build/deploy scripts
```

Don't spend equal time on every module. The auth module with 200 tests deserves 10x the attention of a string-utils module with 3 functions.

---

## Final Reminders

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   1. INTENT OVER IMPLEMENTATION                                                          │
│      Extract WHAT and WHY, not HOW. Describe behavior, not data structures.              │
│                                                                                          │
│   2. BETTER THAN THE ORIGINAL                                                            │
│      The spec should produce a cleaner system than the original.                         │
│      Use [EXTRACTED] and [ELEVATED] tags to make improvements traceable.                 │
│                                                                                          │
│   3. ULTRATHINK IS NOT OPTIONAL                                                          │
│      Phase 4 requires deep, deliberate reasoning. 45+ minutes minimum.                   │
│                                                                                          │
│   4. BREADTH FIRST, THEN DEPTH                                                           │
│      Map everything at surface level before going deep on any single area.               │
│                                                                                          │
│   5. EVIDENCE EVERYTHING                                                                 │
│      File paths, line numbers, confidence levels. Every claim is traceable.              │
│                                                                                          │
│   6. CONFIDENCE IS MANDATORY                                                             │
│      Extraction inherently involves inference. Annotate uncertainty. Ask for review.     │
│                                                                                          │
│   7. THOROUGHNESS OVER SPEED                                                             │
│      5-9 hours of extraction saves 50-90 hours of confused implementation.               │
│                                                                                          │
│   8. DEPLOY AGENTS LIBERALLY                                                             │
│      2-3 agents in Phase 1, 3-4 in Phase 2. Parallel exploration is key.                │
│                                                                                          │
│   9. THE OUTPUT IS A SINGLE DOCUMENT                                                     │
│      One unified doc with 19 sections. Architecture + Spec + Elevation together.         │
│                                                                                          │
│  10. QUALITY IS NON-NEGOTIABLE                                                           │
│      3,000+ lines (standard), all sections substantive, all FRs with AC + tests.        │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Files

- **METHODOLOGY.md** — Detailed step-by-step extraction methodology for each phase
- **TEMPLATES.md** — Unified 19-section output document template + handoff prompt template
- **CHECKLIST.md** — Quality verification checklist for all phase gates
- **references/SCOPE-GUIDE.md** — Scope modes, depth auto-detection, decision tree
- **references/EXTRACTION-PATTERNS.md** — The 11 extraction dimensions with patterns and interaction map
- **references/LANGUAGE-HEURISTICS.md** — Language-specific extraction heuristics (Rust/TS/Python/Go/Java)

---

## Version History

- v1.0.0 — Initial skill definition: 7-phase extraction workflow, ULTRATHINK methodology, 11 extraction dimensions, 3 scope modes, 3 depths, [EXTRACTED]/[ELEVATED] tagging, unified 19-section output, anti-patterns, worked examples
- v1.1.0 — Fresh-eyes audit: added git archaeology (Phase 0), hypothesis-driven reasoning loop (Phase 4), test behavioral contracts extraction (Phase 1), Phase 2 context-passing, domain glossary, session resumption protocol, generated/vendored code handling, priority-based time allocation, CHECKLIST.md section numbering fix
- v1.2.0 — Second fresh-eyes audit (16 findings): FR numbering normalized to domain abbreviations (CRITICAL), Phase 4 extraction backfill mechanism (CRITICAL), convergence criteria + abductive reasoning in Phase 4, cross-cutting invariants dimension, Phase 2 conflict resolution protocol, NFR extraction in Phase 3, internal cross-reference validation in Phase 6, Phase 1 architectural red flags, Surface depth quality targets, dimension interaction map, Phase 2 scope boundary handling, Phase 0 CI/CD check, C/C++ + Ruby + fallback language heuristics
