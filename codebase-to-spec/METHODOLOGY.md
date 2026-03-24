# Extraction Methodology

> Detailed step-by-step methodology for each phase of the codebase-to-spec skill.

---

## Overview

This methodology guide provides the detailed protocol for each of the 7 phases (0-6). Follow these steps precisely — they are designed to extract maximum understanding from the codebase while building toward a spec that is **better than the original implementation**.

```
Phase 0: Project Discovery + Scope Definition
    │
    ▼
Phase 1: Structural Cartography (2-3 parallel agents)
    │
    ▼
Phase 2: Behavioral Extraction (3-4 parallel agents)
    │
    ▼
Phase 3: Dependency & Interface Mapping
    │
    ▼
Phase 4: Intent Reconstruction (ULTRATHINK)
    │
    ▼
Phase 5: Unified Spec Document Generation
    │
    ▼
Phase 6: Validation, Reconciliation & Handoff
```

---

## Phase 0: Project Discovery + Scope Definition

**Duration:** 10-20 minutes
**Tools:** Glob, Read, Bash (for project metrics)
**Output:** Internal notes — project profile + scope definition

### Step 0.1: Find Project Root

Search for root markers in this priority:

```
.git/            → Git repository root
package.json     → Node.js / TypeScript
Cargo.toml       → Rust
pyproject.toml   → Python
go.mod           → Go
pom.xml          → Java (Maven)
build.gradle     → Java (Gradle)
Gemfile          → Ruby
*.sln            → .NET
```

If multiple markers exist (monorepo), identify the workspace structure.

### Step 0.2: Identify Tech Stack

| Detection File | Language | Framework Hints |
|----------------|----------|-----------------|
| `tsconfig.json` | TypeScript | Check for `next`, `react`, `express` in deps |
| `package.json` only | JavaScript | Same as above |
| `Cargo.toml` | Rust | Check for `actix`, `axum`, `tokio` |
| `pyproject.toml` | Python | Check for `fastapi`, `django`, `flask` |
| `go.mod` | Go | Check for `gin`, `echo`, `chi` |
| `pom.xml` | Java | Check for `spring-boot`, `quarkus` |

Also detect:
- **Build system:** cargo, npm, bun, pnpm, yarn, poetry, pip, maven, gradle
- **Test framework:** vitest, jest, pytest, cargo test, go test, JUnit
- **Database:** Look for migration files, ORM config, connection strings
- **CI/CD:** `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`

### Step 0.3: Map Top-Level Structure

Use Glob to map the project:

```
Glob: *
Glob: src/**/* (or app/, lib/, packages/*)
```

Categorize directories:
- **Source code:** `src/`, `lib/`, `app/`, `packages/*/src/`
- **Tests:** `__tests__/`, `tests/`, `test/`, `spec/`, `*_test.go`
- **Documentation:** `docs/`, `README*`, `ARCHITECTURE*`
- **Configuration:** `config/`, `.config/`, `.env*`
- **Build output:** `dist/`, `target/`, `build/`, `out/`
- **Dependencies:** `node_modules/`, `vendor/`

### Step 0.4: Read Existing Documentation

Read (if they exist):
- `README.md` — project description, setup instructions
- `ARCHITECTURE.md` or `DESIGN.md` — declared architecture
- `CHANGELOG.md` — feature history, can reveal intent
- `CONTRIBUTING.md` — development patterns, conventions
- `docs/` directory contents

These provide **declared intent** — compare against **observed implementation** later.

### Step 0.5: Mine Git History (Git Archaeology)

Git history is one of the most powerful intelligence sources for reverse-engineering:

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

**What to capture:**
- Active development areas (hotspots)
- Evolution trajectory (what's being migrated/modernized)
- Author patterns (explain inconsistencies)
- Deleted features (non-goals)

Spend 5-10 minutes here. This intelligence cannot be obtained from code alone.

### Step 0.5b: Check CI/CD Pipeline Results (if available)

If the project has CI/CD configured (`.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`):

```bash
# Check recent CI results
gh run list --limit 5 2>/dev/null || true

# Look for coverage reports
Glob: **/coverage/**/*|**/.coverage|**/lcov.info
```

**What to capture:**
- Which tests currently pass/fail (broken areas = lower confidence)
- Code coverage reports (high coverage = high confidence areas)
- Build warnings (deprecations, unused imports = noise markers)

This takes 2-3 minutes and provides valuable confidence calibration for Phase 2.

### Step 0.6: Determine Scope

See `references/SCOPE-GUIDE.md` for the full scope decision tree.

Quick decision:
- User says "whole project" → Whole-Project mode
- User mentions a path or directory → Module-Targeted mode
- User mentions a feature by name → Feature-Targeted mode
- User is unclear → Ask ONE clarifying question

### Step 0.7: Auto-Detect Depth

```
Files in scope < 50  → DEEP
Files in scope < 200 → STANDARD
Files in scope ≥ 200 → STANDARD (recommend module split if >500)

User can always override.
```

### Step 0.8: Set Output Path

```
Priority:
1. docs/specs/       (if docs/ exists)
2. thoughts/shared/specs/ (if thoughts/ exists)
3. Create docs/specs/

Filename: {YYYY-MM-DD}-{slug}-extracted-spec.md
```

### Step 0.9: Document Scope Profile

Write internal notes:
```
Project: {name}
Root: {path}
Tech Stack: {language} / {framework}
Build: {build system}
Tests: {test framework}
Scope Mode: {whole | module:{path} | feature:{name}}
Depth: {surface | standard | deep}
Output: {path}
Estimated Files: ~{N}
Estimated Complexity: {low | medium | high}
```

---

## Phase 1: Structural Cartography

**Duration:** 30-60 minutes
**Tools:** Task (Explore agents), Glob, Grep, Read
**Output:** Internal notes — structural map + ASCII diagram

### Step 1.1: Launch Parallel Agents

Launch 2-3 Explore agents with focused missions:

**Agent 1: Directory & Module Scanner**
```
Scan the project structure within {scope}.

For each package/module/directory:
- List all source files (not tests, not config)
- Count lines of code (approximate)
- Identify public exports (what does this module expose?)
- Identify entry points (main functions, route definitions, handler registrations)
- Categorize: library code, application code, test code, config, scripts

Also identify:
- Monorepo structure (if applicable)
- Shared packages/libraries
- Build artifacts and generated code (exclude from extraction)

Report format: Table with Module | Path | Files | LOC | Category | Key Exports
```

**Agent 2: Import/Dependency Analyzer**
```
Trace all internal imports/dependencies within {scope}.

Build a dependency graph:
- For each module, what other modules does it import from?
- What types/functions does it import?
- Are there circular dependencies?

Identify:
- High fan-in modules (many things depend on them = core abstractions)
- High fan-out modules (they depend on many things = orchestrators/controllers)
- Leaf modules (no dependents = top-level features or utilities)
- Hub modules (high fan-in AND high fan-out = potential god objects)

Report format: Adjacency list + high fan-in/fan-out summary
```

**Agent 3 (for large/complex projects): Layer & Pattern Detector**
```
Analyze the codebase for architectural patterns within {scope}.

Look for:
- Service layer patterns: *Service.*, *Repository.*, *Controller.*, *Handler.*
- Middleware patterns: middleware/, interceptors/, guards/
- Event/message patterns: events/, messages/, handlers/, subscribers/
- State management patterns: stores/, reducers/, context/
- Error handling patterns: custom error types, error middleware
- Configuration patterns: config files, env var usage, feature flags
- Dependency injection patterns: constructors, providers, factories

Determine the dominant architectural pattern:
- Clean Architecture (domain/application/infrastructure)
- MVC/MVVM
- Hexagonal / Ports & Adapters
- Event-Driven / Event-Sourced
- Layered (data → business → API → frontend)
- Microservices
- Hybrid/Custom

Report format: Pattern name + evidence locations + layer diagram
```

### Step 1.2: Synthesize Agent Results

After agents return, combine findings into:

1. **Module Table:**
```
| Module | Path | Files | LOC | Type | Key Exports |
|--------|------|-------|-----|------|-------------|
```

2. **Dependency Graph** (ASCII):
```
core-types ←── service-layer ←── api-routes
     ↑              ↑                ↑
     └── db-layer ──┘          middleware
```

3. **Layer Diagram:**
```
┌─────────────────────────────────────────────┐
│ Presentation Layer (routes, handlers, UI)    │
├─────────────────────────────────────────────┤
│ Application Layer (services, use cases)      │
├─────────────────────────────────────────────┤
│ Domain Layer (types, models, business logic) │
├─────────────────────────────────────────────┤
│ Infrastructure (DB, external APIs, config)   │
└─────────────────────────────────────────────┘
```

### Step 1.3: Identify Test Coverage (Behavior Documentation)

Existing tests are GOLD for extraction — they explicitly document expected behavior.

```
Glob for: **/*test*|**/*spec*|**/__tests__/**

For each test file found:
- What module/component does it test?
- What behaviors are verified (read test names)?
- What edge cases are covered?
- What test infrastructure exists (mocks, fixtures, factories)?
```

Test descriptions become FR candidates directly.

---

## Phase 2: Behavioral Extraction

**Duration:** 60-120 minutes
**Tools:** Task (Explore agents), Read, Grep, Glob
**Output:** Internal notes — extracted behaviors organized by dimension

### Step 2.1: Launch Parallel Agents

Launch 3-4 Explore agents. See `references/EXTRACTION-PATTERNS.md` for the 11 extraction dimensions and `references/LANGUAGE-HEURISTICS.md` for language-specific search patterns.

**CRITICAL: Context-pass Phase 1 findings.** Every agent prompt below MUST include:
- Module table (which modules exist, paths, responsibilities)
- Entry points list (so agents know where to start tracing)
- Dependency graph (so agents understand module relationships)
- Domain glossary (so agents use consistent terminology)

Append a `## Context from Phase 1` section to each agent prompt with the synthesized Phase 1 output. Without this, agents waste time re-discovering structure.

**SCOPE BOUNDARY RULE:** When tracing a data flow that exits the extraction scope, document the outgoing call as an interface contract (function name, parameters, expected return) but do NOT extract the called module's internals. Mark it as: "→ OUT OF SCOPE: calls {module}.{function}({params}) → {return type}".

**Agent 1: API & Interface Extractor**
```
Extract all public APIs and interfaces within {scope}.

For every public function/method/endpoint, document:
- Name and file location
- Signature (parameters with types, return type)
- What it DOES (behavior, not implementation)
- Preconditions (auth checks, validation)
- Error conditions (what errors can be returned)
- Side effects (DB writes, events emitted, external calls)

Focus on:
- HTTP route handlers
- Service layer public methods
- Public trait/interface implementations
- CLI command handlers
- Event handlers

Format each as:
  FUNCTION: {name}
  LOCATION: {file}:{lines}
  BEHAVIOR: Given {input}, when {condition}, then {result}
  ERRORS: {error conditions}
  SIDE EFFECTS: {external state changes}
```

**Agent 2: Data Model & Schema Extractor**
```
Extract all data models and schemas within {scope}.

For every struct/class/type/table:
- Name and file location
- All fields with types
- Required vs optional
- Default values
- Validation constraints
- Relationships to other models
- Serialization format (JSON names, DB columns)
- Database indices (for DB models)

Also find:
- Enum types (especially those representing states)
- Configuration schemas
- API request/response types
- Event/message types
- Type aliases and newtypes

Format each as:
  MODEL: {name}
  LOCATION: {file}:{lines}
  PURPOSE: {semantic meaning}
  FIELDS:
    - {name}: {type} ({required|optional}, default: {val}, constraint: {rule})
  RELATIONSHIPS:
    - {relation} to {other_model} via {mechanism}
```

**Agent 3: State & Flow Extractor**
```
Trace all major data flows end-to-end within {scope}.

For each major user action / API endpoint / event:
1. Start at the entry point
2. Follow each function call downstream
3. Note every transformation, decision, and side effect
4. Find where data is stored/returned
5. Document error handling at each step

Also find state machines:
- Enum types used as status/state fields
- Functions that check state before acting
- State transition logic (match/switch on state)
- Invalid transition handling

Format each flow as:
  FLOW: {name} (e.g., "User creates document")
  TRIGGER: {entry point}
  STEPS:
    1. {component} → {action} → {output}
    2. {component} → {action} → {output}
  ERROR HANDLING: {what happens on failure at each step}
  RESULT: {final effect}

Format each state machine as:
  STATE MACHINE: {name}
  STATES: {list of states}
  TRANSITIONS:
    {state A} → {state B}: when {condition}, do {action}
  INVALID: {what happens on invalid transition}
```

**Agent 4: Edge Case & Error Model Extractor**
```
Extract the complete error model and edge case handling within {scope}.

Find:
1. CUSTOM ERROR TYPES
   - All custom error enums/classes
   - Error variants and what triggers each
   - Error codes (HTTP status, internal codes)

2. ERROR PROPAGATION
   - How errors flow between layers
   - Error conversions (e.g., DB error → API error)
   - Where errors are caught vs propagated

3. EDGE CASE HANDLING
   - Retry logic (what's retried, backoff strategy)
   - Timeout handling (what has timeouts, values)
   - Rate limiting (limits, what happens when exceeded)
   - Circuit breakers (thresholds, fallback behavior)
   - Graceful degradation paths

4. INPUT VALIDATION
   - Boundary values checked
   - Format validation (emails, URLs, UUIDs)
   - Size limits (max string length, max file size)
   - Encoding/sanitization (XSS prevention, SQL injection)

5. RECOVERY PATTERNS
   - Crash recovery
   - Transaction rollback
   - Partial failure handling
   - Compensation/undo logic
```

### Step 2.2: Synthesize Extraction Results

Organize findings into the 11 extraction dimensions.

For each finding, classify:
- **SIGNAL** — intentional design, well-tested, consistent pattern
- **NOISE** — dead code, TODOs, workarounds, deprecated features
- **IMPROVEMENT CANDIDATE** — where the code falls short of its intent

### Conflict Resolution Protocol

When parallel agents return contradictory findings:

1. **Same code, different interpretation**: Read the actual implementation. The agent who traced DEEPER into the call chain wins. If Agent 1 says "creates user" and Agent 3 says "creates user AND sends welcome email", Agent 3's is more complete.

2. **One says alive, other says dead**: Check git blame and test coverage. Code that's recently modified AND tested is alive. Code that hasn't been touched in 6+ months with no tests is likely dead.

3. **Different behavior descriptions for same endpoint**: Both may be correct for different code paths. Merge into a single description with conditional branches.

4. **Truly irreconcilable**: Flag for Phase 4 hypothesis testing. Document both interpretations with evidence and let the hypothesis loop resolve it.

NEVER silently drop one agent's findings. Every contradiction must be explicitly resolved or flagged.

---

## Phase 3: Dependency & Interface Mapping

**Duration:** 30-45 minutes
**Tools:** Read, Grep, Glob, optionally WebSearch for library docs
**Output:** Internal notes — dependency catalog + config surface + IADRs

### Step 3.1: External Dependency Catalog

Read the lock file (`bun.lock`, `package-lock.json`, `Cargo.lock`, `poetry.lock`, etc.) and categorize:

```
For each dependency:
  NAME: {package name}
  VERSION: {version}
  CATEGORY: {runtime | dev | build | peer}
  PURPOSE: {what capability it provides}
  COUPLING: {surface | moderate | deep} — how tightly integrated
  LICENSE: {license type}
```

### Step 3.2: External Service Mapping

Search for connection strings, client instantiation, and SDK usage:

```
For each external service:
  SERVICE: {name} (e.g., PostgreSQL, Redis, S3)
  TYPE: {database | cache | queue | storage | API | auth}
  CONNECTION: {SDK | HTTP | gRPC | raw socket}
  CONFIG: {env vars that control it}
  FAILURE: {what happens when unavailable}
```

### Step 3.3: Configuration Surface

Grep for all configuration sources:

```
Grep: "process.env|std::env::var|os.environ|config\." (language-appropriate)
Glob: **/.env* | **/config.* | **/*.toml | **/*.yaml
```

Document every config value found.

### Step 3.4: Operational Concerns

Search for:
- **Logging:** `log::`, `console.log`, `logger.`, `logging.`
- **Metrics:** `metrics::`, `prometheus`, `statsd`, `telemetry`
- **Health checks:** `/health`, `/ready`, `/live`, `healthcheck`
- **Graceful shutdown:** `SIGTERM`, `SIGINT`, `shutdown`, `cleanup`

### Step 3.5: Non-Functional Requirements (NFR) Extraction

Search for performance/scalability/reliability characteristics embedded in code:

```
Grep for: "pool_size|max_connections|timeout|ttl|max_retries|batch_size|rate_limit|max_payload|page_size|cache_duration|concurrency_limit|buffer_size"
```

For each NFR found:

| NFR | Current Value | Location | Category |
|-----|-------------|----------|----------|
| {name} | {value} | `{file}:{line}` | {performance/scalability/reliability/capacity} |

**Common NFR sources:**
- Connection pool sizes → scalability constraints
- Timeout values → latency budgets
- Rate limit values → throughput constraints
- TTL values → data freshness requirements
- Batch sizes → memory/processing constraints
- Max payload sizes → API capacity limits
- Pagination defaults → query performance bounds

These are CRITICAL for rebuild accuracy — a system designed for 10K concurrent users has fundamentally different architecture than one designed for 100.

### Step 3.6: Create IADRs

For each major technology choice, create an Inferred Architecture Decision Record:

```markdown
### IADR-001: {Technology Choice}

**Observed:** Project uses {X} for {purpose}

**Inferred Rationale:**
- {Reason based on how it's used}
- {Reason based on what features are leveraged}
- {Reason based on codebase patterns}

**Evidence:**
- Used in {N} files
- Key pattern: {code location}
- Features leveraged: {specific features used}

**Confidence:** {HIGH | MEDIUM | LOW}
```

---

## Phase 4: Intent Reconstruction (ULTRATHINK)

**Duration:** 45-90 minutes
**Tools:** None (pure reasoning) — review internal notes from Phases 1-3
**Output:** Internal notes — mental model, user stories, improvements

### THIS IS THE MOST IMPORTANT PHASE.

Do not rush. Do not skip steps. Spend the full time.

### Core Method: Hypothesis-Driven Reasoning

Apply the scientific method — do NOT linearly classify and move on:

```
OBSERVE → HYPOTHESIZE → PREDICT → TEST → REFINE → SYNTHESIZE
   ↑                                         │
   └─────────────────────────────────────────┘
```

For each major subsystem, form a theory about WHY it exists, predict what else should be true if that theory is correct, then go back to the code and verify. Minimum 3 hypothesis-test cycles before proceeding to synthesis. At least 1 hypothesis must be REFUTED or PARTIAL — if all pass on first try, your predictions are too safe.

### Step 4.1: Separate Signal from Noise (20+ minutes)

Review ALL findings from Phases 1-3 and categorize:

**Signal (Intentional Design):**
- Rich type definitions with validation → designed carefully
- Well-tested code paths → important behavior
- Consistent patterns across codebase → established conventions
- Meaningful error types → thought-through error handling
- Feature flags → controlled rollout

**Noise (Accidental Complexity):**
- TODO/FIXME/HACK comments → known technical debt
- Dead code, unreachable branches → cleanup candidates
- Inconsistent patterns (old vs new code) → migration in progress
- Overly defensive checks for impossible states → copy-paste artifacts
- Commented-out code → abandoned attempts

### Step 4.2: Form and Test Hypotheses (15+ minutes)

Before reconstructing user stories, verify your mental model:

```
For each major module/subsystem:
  1. HYPOTHESIZE: "This module exists to {purpose} because {evidence}"
  2. PREDICT: "If true, I should find {X} in {location}"
  3. TEST: Read/Grep to verify prediction
  4. If FAILS: revise hypothesis and re-test
  5. If SUCCEEDS: hypothesis strengthened

Document:
  HYPOTHESIS: {theory}
  PREDICTION: {what should be true}
  EVIDENCE: {what was found}
  VERDICT: CONFIRMED / REFUTED / PARTIAL → {revised theory}
```

**Convergence:** Stop iterating when 3+ predictions match consecutively, no new counter-evidence in 2 consecutive tests, and all major subsystems have confirmed hypotheses.

**Backfill trigger:** If hypothesis testing reveals significant unextracted behaviors, STOP and launch a focused Explore agent to extract the gap before continuing. See SKILL.md Step 4.2b.

At least 1 hypothesis must be REFUTED or PARTIAL — this proves rigor.

### Step 4.3: Reconstruct User Stories (15+ minutes)

For every extracted behavior, ask: "What user story does this serve?"

```
BEHAVIOR: POST /api/documents creates a document with title, content, visibility
RECONSTRUCTED STORY:
  As an authenticated user
  I want to create documents with configurable visibility
  So that I can share my work with the appropriate audience
```

Group related behaviors into coherent user stories. A single story may span multiple endpoints/functions.

### Step 4.4: Reconstruct Goals & Non-Goals (15+ minutes)

**Goals** — infer from what IS implemented:
- What capabilities does the system provide?
- What quality attributes are enforced (security, performance, reliability)?
- What scale is it designed for?

**Non-Goals** — infer from what is NOT implemented:
- What obvious features are missing?
- What quality attributes are not enforced?
- What scale is not supported?

### Step 4.5: Identify Design Principles (10+ minutes)

What implicit rules govern the codebase?

Examples:
- "All mutations go through events" → Event-sourced design
- "Every endpoint has auth middleware" → Security by default
- "All errors are typed, not strings" → Explicit error handling
- "All state is immutable" → Functional design
- "Tests only test public API" → Contract testing

### Step 4.6: Design Improvement Pass (20+ minutes)

**THIS IS WHAT MAKES THE SPEC BETTER THAN THE ORIGINAL.**

For each major area, systematically ask:

1. **Where does the implementation fall short of its own intent?**
   - Missing error handling for known failure modes
   - Incomplete validation
   - Inconsistent application of patterns

2. **What anti-patterns should a rebuild eliminate?**
   - God objects / god functions
   - Circular dependencies
   - Tight coupling between layers
   - Magic numbers / hardcoded values

3. **What workarounds exist for constraints that no longer apply?**
   - Compatibility with old API versions
   - Support for deprecated libraries
   - Workarounds for bugs in old dependencies

4. **What inconsistencies should be normalized?**
   - If old code uses callbacks and new code uses async/await → spec uses async/await
   - If some endpoints validate input and others don't → spec validates all
   - If error formats vary → spec normalizes

5. **What gaps should the spec fill?**
   - Missing edge case handling
   - Missing timeout/retry logic
   - Missing authorization checks
   - Missing input sanitization

Document each improvement:
```
IMPROVEMENT: {area}
CURRENT: {what the code does now}
PROPOSED: {what the spec should specify}
JUSTIFICATION: {why — tied to inferred intent}
```

### Step 4.7: Map Success Criteria

Define what "working correctly" means — elevated to what it SHOULD be:

```
1. {Criterion} — evidence: {from tests/error handling/monitoring}
2. {Criterion} — evidence: {from tests/error handling/monitoring}
```

### Step 4.8: Resolve Contradictions

Where the code contradicts itself, make a decision:

```
CONTRADICTION: Old code uses pattern A, new code uses pattern B
RESOLUTION: Spec uses pattern B because {reason}
CONFIDENCE: {HIGH | MEDIUM | LOW}
```

---

## Phase 5: Unified Spec Document Generation

**Duration:** 120-180 minutes
**Tools:** Write
**Output:** The unified spec document

### Step 5.1: Create Document

Use the template from `TEMPLATES.md`. Write to the output path set in Phase 0.

### Step 5.2: Write Part I — System Architecture

Draw from Phase 1 (structure) and Phase 3 (dependencies) findings.

**Quality bar for each section:**
- System Overview → must have ASCII diagram with ALL components
- Data Flows → must have step-by-step flows, not just entry→exit
- Data Models → must include ALL fields with types and constraints
- API Surface → must include request/response examples and error codes
- Component Map → every component with location, responsibility, API

### Step 5.3: Write Part II — Functional Specification

Draw from Phase 2 (behaviors) and Phase 4 (intent reconstruction) findings.

**Quality bar:**
- Every FR has FR-X.Y.Z identifier
- Every FR has Source Evidence (file path + lines)
- Every FR has [EXTRACTED] or [ELEVATED] tag
- Every [ELEVATED] FR has justification
- Every FR has acceptance criteria (3+ items)
- Every FR has a core test (executable, not pseudocode)
- User stories cover ALL major user-facing features
- E2E scenarios cover critical happy paths and error paths

### Step 5.4: Write Part III — Design Elevation

Draw from Phase 4 Step 4.5 (design improvement pass).

**Quality bar:**
- Design Improvements Register has 5+ entries (standard), 10+ (deep)
- Each improvement has current→proposed→justification
- Tech Debt Register captures all NOISE items from Phase 4.1
- Reconciliation Notes list all LOW-confidence items
- Every LOW-confidence item has a specific question for human review

### Step 5.5: Verify Size

| Depth | Minimum Lines |
|-------|---------------|
| Surface | 500 |
| Standard | 3,000 |
| Deep | 5,000 |

If under minimum, you're missing detail. Go back and expand.

---

## Phase 6: Validation, Reconciliation & Handoff

**Duration:** 30-45 minutes
**Tools:** Read, Grep (for path verification), Write (handoff prompt)
**Output:** Verified spec + handoff prompt + summary to user

### Step 6.1: Bidirectional Verification

**Forward Check (Spec → Code):**
For each FR, verify the source evidence is accurate:
- Does the file exist at the stated path?
- Do the line numbers match?
- Does the code actually do what the FR says?

**Backward Check (Code → Spec):**
For each major code path in scope:
- Is it covered by at least one FR?
- If not, is it intentionally excluded (noise)?
- If not excluded, add a missing FR.

### Step 6.2: Pipeline Compatibility

Verify the document works for downstream skills:
- [ ] FR numbering is sequential (FR-2.1.1, FR-2.1.2, ...)
- [ ] Acceptance criteria use testable language ("SHALL", "MUST", "returns")
- [ ] Core tests are actually executable (not pseudocode)
- [ ] Data models are complete (all fields, not stubs)
- [ ] API contracts include examples

### Step 6.3: Confidence Review

Final pass on confidence annotations:
- [ ] Every section has HIGH/MEDIUM/LOW rating
- [ ] LOW sections have specific questions for human review
- [ ] MEDIUM sections note what could change with more info
- [ ] HIGH sections are well-evidenced

### Step 6.4: Generate Handoff Prompt

Write to `{output-dir}/prompts/{date}-{slug}-handoff.md`:

```markdown
# Extracted Spec Handoff

## Source Document
- Spec: {path to extracted spec}

## Your Mission
Use the extracted spec to proceed through the downstream pipeline.

## Steps
1. Read the extracted spec thoroughly
2. Review the Design Improvements Register (Part III, §16) — these are intentional elevations
3. Review the Reconciliation Notes (Part III, §18) — resolve any LOW-confidence items
4. Invoke `/spec-to-tdd` with the spec
5. Invoke `/spec-to-strategy` with the spec + TDD (invoke as `/spec-to-strategy`)
6. Invoke `/beads-from-sources` with spec + TDD + strategy (invoke as `/beads-from-sources`)
7. Invoke `/beads-to-execution` with the beads

## MANDATORY STOP
After beads-to-execution, STOP. Do not implement. Wait for human authorization.
```

### Step 6.5: Deliver Summary to User

```markdown
## Extraction Complete

### Document
- {output path}

### Metrics
| Metric | Value |
|--------|-------|
| Files Examined | {N} |
| Modules Covered | {N} |
| FRs Extracted | {N} ({X} [EXTRACTED], {Y} [ELEVATED]) |
| User Stories | {N} |
| IADRs | {N} |
| Design Improvements | {N} |
| Tech Debt Items | {N} |

### Confidence
| Rating | Sections |
|--------|----------|
| HIGH | {list} |
| MEDIUM | {list} |
| LOW | {list} |

### Items Requiring Human Review
1. {item}
2. {item}

### Next Step
/spec-to-tdd
Spec: {path}
```

---

## Quick Reference: Tool Usage by Phase

| Phase | Primary Tools | Agents |
|-------|--------------|--------|
| 0: Discovery | Glob, Read, Bash | 0 |
| 1: Cartography | Task(Explore) × 2-3 | 2-3 |
| 2: Extraction | Task(Explore) × 3-4 | 3-4 |
| 3: Dependencies | Read, Grep, Glob | 0-1 |
| 4: Intent | (pure reasoning) | 0 |
| 5: Generation | Write | 0 |
| 6: Validation | Read, Grep, Write | 0 |

---

## Effort Expectations

| Phase | Quick (Surface) | Standard | Deep |
|-------|----------------|----------|------|
| 0 | 5 min | 10-15 min | 15-20 min |
| 1 | 15 min | 30-60 min | 45-75 min |
| 2 | 20 min | 60-120 min | 90-150 min |
| 3 | 10 min | 30-45 min | 45-60 min |
| 4 | 15 min | 45-90 min | 60-120 min |
| 5 | 30 min | 120-180 min | 180-240 min |
| 6 | 10 min | 30-45 min | 45-60 min |
| **Total** | **~2 hrs** | **~5-9 hrs** | **~8-12 hrs** |

If you're finishing a STANDARD extraction in under 4 hours, you're almost certainly cutting corners.
