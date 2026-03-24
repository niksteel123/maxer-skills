# Quality Checklist

Verification checklist for codebase-to-spec reverse engineering.

---

## Pre-Work Checklist

Before starting, verify:

- [ ] Codebase accessible and readable
- [ ] Output path determined for spec document
  - Default: `thoughts/shared/specs/{date}-{name}-codebase-spec.md`
- [ ] User intent clarified (whole project, module, or feature)
- [ ] Estimated project size assessed (file count, language mix)
- [ ] Reference docs identified (README, ARCHITECTURE, DESIGN)
- [ ] Agent parallelism available (sub-agents for Phase 1+2)
- [ ] Language heuristics loaded (`references/LANGUAGE-HEURISTICS.md`)
- [ ] Extraction patterns loaded (`references/EXTRACTION-PATTERNS.md`)

---

## Phase 0: Project Discovery + Scope

- [ ] **Project type identified**
  - [ ] Primary language(s) detected
  - [ ] Framework(s) detected (web, CLI, library, service, etc.)
  - [ ] Build system identified (Cargo, npm, pip, Gradle, etc.)
  - [ ] Monorepo vs single-project structure determined

- [ ] **Tech stack documented**
  - [ ] Runtime/platform listed (Node, Tokio, JVM, etc.)
  - [ ] Key libraries/frameworks noted
  - [ ] Database/storage layer identified (if any)
  - [ ] Test framework(s) identified

- [ ] **Project structure mapped**
  - [ ] Top-level directory layout documented
  - [ ] Package/module boundaries identified
  - [ ] Config files located (env, TOML, YAML, JSON)
  - [ ] Entry point files located

- [ ] **Scope mode chosen**
  - [ ] Whole-Project, Module-Targeted, or Feature-Targeted selected
  - [ ] Scope negotiation completed (max 1 clarification question)
  - [ ] If whole-project >500 files: module split recommended

- [ ] **Extraction depth selected**
  - [ ] Surface, Standard, or Deep chosen
  - [ ] Depth auto-detection algorithm applied (or user override)
  - [ ] Expected output size estimated (Surface: 500-1500, Standard: 2000-4000, Deep: 4000-8000+)

- [ ] **Scope boundaries documented**
  - [ ] In-scope directories/files/features listed
  - [ ] Out-of-scope items listed with reasons
  - [ ] Boundary contracts noted (for module/feature mode)

- [ ] **Output path set**
  - [ ] File path confirmed with user or default used
  - [ ] No existing file at path (or overwrite confirmed)

- [ ] **Git history mined**
  - [ ] Recent commit messages reviewed (git log --oneline -50)
  - [ ] File change frequency analyzed (hotspot detection)
  - [ ] Evolution trajectory noted (migration patterns, active development areas)

- [ ] **CI/CD pipeline checked (if available)**
  - [ ] Recent CI run results reviewed (pass/fail status)
  - [ ] Code coverage reports found and noted
  - [ ] Build warnings reviewed for deprecation markers

- [ ] **Estimated complexity assessed**
  - [ ] File count per language tallied
  - [ ] Approximate public API surface estimated
  - [ ] Session count estimated (1 for small, 2+ for large)

---

## Phase 1: Structural Cartography

- [ ] **All modules/packages enumerated**
  - [ ] Each module listed with name and purpose
  - [ ] File count per module documented
  - [ ] Primary language per module noted
  - [ ] Internal vs external module distinction made

- [ ] **Entry points discovered**
  - [ ] Main/binary entry points found
  - [ ] HTTP/API route definitions located
  - [ ] CLI command handlers located
  - [ ] Event/message handlers located
  - [ ] Scheduled tasks/cron jobs located
  - [ ] Test entry points noted (for behavior documentation)

- [ ] **Internal dependency graph built**
  - [ ] Module-to-module import/dependency edges mapped
  - [ ] Circular dependencies identified (if any)
  - [ ] Layering violations noted (if architectural layers detected)
  - [ ] Shared types/interfaces identified across modules

- [ ] **Architectural pattern identified**
  - [ ] Pattern name documented (MVC, Clean Architecture, Hexagonal, Microservices, Monolith, etc.)
  - [ ] Layer structure mapped (presentation, domain, infrastructure, etc.)
  - [ ] Cross-cutting concerns identified (logging, auth, metrics)
  - [ ] Deviations from pattern noted

- [ ] **ASCII architecture diagram created**
  - [ ] All major modules/components represented
  - [ ] Dependency arrows show direction of calls
  - [ ] External systems depicted at boundaries
  - [ ] Diagram is self-explanatory without surrounding text

- [ ] **Architectural red flags noted**
  - [ ] Circular dependencies identified
  - [ ] God modules flagged (>1000 LOC with 10+ dependents)
  - [ ] Orphaned modules identified (no dependents, not entry point)
  - [ ] Layer violations noted

- [ ] **Agent work documented**
  - [ ] At least 2 parallel agents launched for structural discovery
  - [ ] Each agent's scope clearly defined
  - [ ] Agent findings merged without contradictions
  - [ ] Conflicting findings resolved with evidence

---

## Phase 2: Behavioral Extraction

- [ ] **Public APIs extracted**
  - [ ] All exported functions/methods catalogued
  - [ ] Input parameters with types and constraints documented
  - [ ] Return types and possible values documented
  - [ ] Preconditions and postconditions noted
  - [ ] Error conditions listed per API
  - [ ] Side effects identified per API

- [ ] **Data models captured**
  - [ ] All domain types/structs/interfaces documented
  - [ ] Field names and types listed for each model
  - [ ] Required vs optional fields marked
  - [ ] Default values noted
  - [ ] Validation constraints captured (min, max, format, enum)
  - [ ] Relationships between models mapped
  - [ ] Serialization formats noted (JSON keys, DB columns)

- [ ] **Major data flows traced end-to-end**
  - [ ] Minimum 3 flows for Surface depth
  - [ ] Minimum 3-5 flows for Standard depth
  - [ ] ALL significant flows for Deep depth
  - [ ] Each flow documented: trigger, steps, result, error handling
  - [ ] Async boundaries marked in flow traces
  - [ ] Data transformations at each step noted

- [ ] **Error model documented**
  - [ ] Custom error types catalogued
  - [ ] Error propagation paths traced
  - [ ] User-facing vs internal error distinction made
  - [ ] Recovery strategies documented per error type
  - [ ] HTTP status code mapping documented (if applicable)

- [ ] **State machines identified**
  - [ ] All state enums/types found
  - [ ] Valid state transitions documented
  - [ ] Guard conditions for transitions captured
  - [ ] Actions/side effects on transitions noted
  - [ ] Invalid transition handling documented
  - [ ] Initial and terminal states marked

- [ ] **Validation rules captured**
  - [ ] Schema-level validation (Zod, Pydantic, etc.) extracted
  - [ ] Manual validation checks extracted
  - [ ] Database constraints documented
  - [ ] Which layer enforces each validation noted

- [ ] **Security model observed**
  - [ ] Authentication mechanism identified (JWT, session, API key, etc.)
  - [ ] Authorization model identified (RBAC, ABAC, ACL)
  - [ ] Permission checks located (middleware, inline)
  - [ ] Sensitive data handling patterns noted
  - [ ] Encryption/hashing usage documented

- [ ] **Agent work documented**
  - [ ] At least 3 parallel agents launched for behavioral extraction
  - [ ] Each agent assigned distinct extraction dimensions
  - [ ] Agent findings merged and cross-referenced
  - [ ] No contradictions between agent findings

- [ ] **Agent conflict resolution applied**
  - [ ] Contradictory findings between agents identified
  - [ ] Each contradiction resolved with documented reasoning
  - [ ] No findings silently dropped
  - [ ] Irreconcilable items flagged for Phase 4 hypothesis testing

- [ ] **File examination breadth**
  - [ ] 50+ files examined for Standard depth
  - [ ] 100+ files examined for Deep depth
  - [ ] Files span all major modules (not concentrated in one)
  - [ ] Test files examined for behavior documentation

---

## Phase 3: Dependency + Interface Mapping

- [ ] **External dependencies catalogued**
  - [ ] All direct dependencies listed (from package manifest)
  - [ ] Version for each dependency recorded
  - [ ] Purpose/role of each dependency documented
  - [ ] License noted for significant dependencies
  - [ ] Dev-only vs runtime dependencies distinguished

- [ ] **External services mapped**
  - [ ] All external API calls identified
  - [ ] Connection method documented (HTTP, gRPC, WebSocket, etc.)
  - [ ] Authentication method for each service noted
  - [ ] Failure handling per service documented (retry, circuit breaker, fallback)
  - [ ] Timeout/deadline configuration captured

- [ ] **Configuration surface documented**
  - [ ] All environment variables listed with types and defaults
  - [ ] Config file formats and locations documented
  - [ ] Feature flags identified
  - [ ] CLI arguments documented
  - [ ] Secret vs non-secret config distinguished
  - [ ] Restart-required vs hot-reload config distinguished

- [ ] **Operational concerns identified**
  - [ ] Logging patterns documented (structured, levels, libraries)
  - [ ] Metrics/observability patterns noted
  - [ ] Health check endpoints found
  - [ ] Deployment method identified
  - [ ] Migration/upgrade patterns noted

- [ ] **Non-functional requirements extracted**
  - [ ] Connection pool sizes / scalability constraints documented
  - [ ] Timeout values / latency budgets documented
  - [ ] Rate limits / throughput constraints documented
  - [ ] TTL values / data freshness requirements documented
  - [ ] Batch sizes / capacity limits documented

- [ ] **IADRs created**
  - [ ] Minimum 3 Implicit Architectural Decision Records created
  - [ ] Each IADR has: decision, context, evidence, consequences
  - [ ] Decisions inferred from code patterns (not stated in docs)
  - [ ] Evidence cites specific files and line ranges
  - [ ] Consequences include both benefits and trade-offs

---

## Phase 4: Intent Reconstruction (ULTRATHINK)

- [ ] **Signal vs noise categorization complete**
  - [ ] Core business logic distinguished from boilerplate
  - [ ] Framework plumbing separated from domain logic
  - [ ] Dead code identified and marked for exclusion
  - [ ] Test helpers/fixtures separated from test behavior

- [ ] **Hypothesis-driven reasoning applied**
  - [ ] At least 3 hypothesis-test cycles completed
  - [ ] Each hypothesis documented with prediction and evidence
  - [ ] At least 1 hypothesis was REFUTED or PARTIAL (proving rigor)
  - [ ] Mental model refined based on test results
  - [ ] Surprising findings documented

- [ ] **Convergence criteria met**
  - [ ] 3+ predictions matched consecutively
  - [ ] No new counter-evidence in 2 consecutive tests
  - [ ] All major subsystems have confirmed hypotheses

- [ ] **Extraction backfill completed (if triggered)**
  - [ ] Significant gaps discovered during hypothesis testing addressed
  - [ ] Focused extraction agents launched for missed areas
  - [ ] New findings integrated into Phase 2 extraction notes
  - [ ] Backfill noted in Reconciliation Notes

- [ ] **User stories reconstructed**
  - [ ] All major user-facing features have user stories
  - [ ] Stories use "As a {role}, I want {action}, so that {benefit}" format
  - [ ] Stories are reconstructed from code behavior, not assumed
  - [ ] Edge case scenarios included as story variants
  - [ ] Non-functional stories included (performance, reliability)

- [ ] **Goals and non-goals inferred**
  - [ ] Goals have evidence citations (file path + line)
  - [ ] Non-goals inferred from what the system deliberately does NOT do
  - [ ] Prioritization inferred from code complexity/attention given
  - [ ] At least 3 goals and 2 non-goals documented

- [ ] **Design principles extracted**
  - [ ] 3-5 design principles identified from code patterns
  - [ ] Each principle has evidence (repeated pattern across 2+ locations)
  - [ ] Principles describe WHY decisions were made, not just WHAT was done
  - [ ] Contradictions between stated principles and code noted

- [ ] **Design Improvement Pass complete**
  - [ ] Each improvement has: current behavior, proposed improvement, justification
  - [ ] Tag: [ELEVATED] applied to all improved requirements
  - [ ] Improvements are genuinely better, not just different
  - [ ] Missing validation added where code lacks it
  - [ ] Missing error handling added where code swallows errors
  - [ ] Inconsistencies normalized across the system
  - [ ] No "cosmetic only" improvements (must be substantive)

- [ ] **Contradictions resolved**
  - [ ] Conflicting behaviors across modules identified
  - [ ] Each contradiction resolved with a clear decision
  - [ ] Resolution justification documented
  - [ ] Contradictions are RESOLVED in the spec, not merely listed

- [ ] **System purpose articulable**
  - [ ] Can explain system purpose in 2-3 sentences
  - [ ] Purpose statement is specific, not generic
  - [ ] Purpose statement would be recognizable to original developers

- [ ] **Mental model quality**
  - [ ] Mental model is BETTER than the original implementation
  - [ ] Understands not just WHAT but WHY
  - [ ] Could reconstruct the system from the spec alone
  - [ ] Spec reader would understand trade-offs and design rationale

---

## Phase 5: Unified Spec Document Generation

### Document Structure
- [ ] **Document written to output path**
  - [ ] File exists at the confirmed output path
  - [ ] Markdown formatting is clean and consistent

- [ ] **All 19 sections substantive** (must match SKILL.md/TEMPLATES.md canonical ordering)
  - [ ] Part I — System Architecture:
    - [ ] 1. System Overview (ASCII diagram, component descriptions, layer boundaries)
    - [ ] 2. Data Flow Diagrams (ASCII sequence diagrams per major flow)
    - [ ] 3. Data Models (domain models, DB schema, event types, config schema)
    - [ ] 4. API Surface (REST/HTTP, WebSocket, CLI, internal module APIs)
    - [ ] 5. Component Map (per component: location, responsibility, public API, deps)
    - [ ] 6. State Management (application state, state machines with transitions/guards)
    - [ ] 7. Error Architecture (error type hierarchy, propagation, recovery strategies)
    - [ ] 8. Security Architecture (authn, authz, data protection)
    - [ ] 9. External Dependencies & Services (runtime deps, external services, config)
    - [ ] 10. Operational Architecture (logging, metrics, health, build/deploy)
    - [ ] 11. Inferred Architecture Decision Records (IADRs)
  - [ ] Part II — Functional Specification:
    - [ ] 12. Goals & Non-Goals (inferred, with evidence)
    - [ ] 13. Functional Requirements (FR-X.Y.Z with Source Evidence + tags)
    - [ ] 14. User Stories (reconstructed from behavioral extraction)
    - [ ] 15. E2E Test Scenarios (clean slate protocol + scenario flows)
  - [ ] Part III — Design Elevation:
    - [ ] 16. Design Improvements Register (current -> proposed -> justification)
    - [ ] 17. Technical Debt Register (anti-patterns, inconsistencies to eliminate)
    - [ ] 18. Reconciliation Notes (ambiguities, confidence levels, human review items)
    - [ ] 19. Risks, Dependencies & Future Considerations
  - [ ] No section is a stub or placeholder ("TBD", "TODO", empty)

### Diagrams
- [ ] **ASCII diagrams present**
  - [ ] System overview architecture diagram included
  - [ ] At least 1 diagram per major data flow
  - [ ] State machine diagrams for all identified state machines
  - [ ] Diagrams are readable and self-explanatory

### Data Models
- [ ] **Complete field definitions**
  - [ ] Every model has all fields listed
  - [ ] Types specified for every field
  - [ ] Constraints documented (required, optional, default, range)
  - [ ] Relationships between models documented

### API Documentation
- [ ] **All endpoints documented**
  - [ ] Route/path specified
  - [ ] HTTP method (or equivalent protocol operation)
  - [ ] Request parameters/body with types
  - [ ] Response format with types
  - [ ] Error responses with status codes
  - [ ] Authentication/authorization requirements

### Functional Requirements
- [ ] **FR identifiers assigned**
  - [ ] All FRs use FR-X.Y.Z format (X=module, Y=feature, Z=requirement)
  - [ ] Numbering is sequential within each module
  - [ ] No duplicate identifiers
  - [ ] No gaps in numbering

- [ ] **Source evidence provided**
  - [ ] Every FR cites a file path
  - [ ] Line numbers or line ranges included
  - [ ] Evidence is verifiable (actually exists in codebase)

- [ ] **Extraction tags applied**
  - [ ] Every FR tagged [EXTRACTED] or [ELEVATED]
  - [ ] [EXTRACTED]: behavior matches code exactly
  - [ ] [ELEVATED]: spec intentionally improves on code behavior
  - [ ] [ELEVATED] FRs include justification for the elevation

- [ ] **Acceptance criteria present**
  - [ ] Every FR has bullet-list acceptance criteria
  - [ ] Criteria use testable language ("MUST", "SHALL", "returns", "rejects")
  - [ ] No vague criteria ("should work correctly", "handles errors properly")
  - [ ] Edge cases covered in criteria

- [ ] **Core tests present**
  - [ ] Every FR has at least 1 core test
  - [ ] Core tests are executable (not pseudocode)
  - [ ] Tests exercise actual system behavior (not mocks)
  - [ ] Tests produce PASS/FAIL output

### User Stories
- [ ] **Coverage**
  - [ ] All major user-facing features have stories
  - [ ] Multiple personas covered (if applicable)
  - [ ] Stories map to functional requirements

### Design Improvements Register
- [ ] **Register populated**
  - [ ] At least 3 improvements for Standard depth
  - [ ] At least 5 improvements for Deep depth
  - [ ] Each entry has: current behavior, proposed improvement, justification
  - [ ] Improvements are linked to [ELEVATED] FRs

### Tech Debt Register
- [ ] **Register populated**
  - [ ] Known tech debt items documented
  - [ ] Each entry has: description, location, impact, suggested resolution
  - [ ] Dead code flagged
  - [ ] Workarounds and hacks identified

### Confidence Levels
- [ ] **Confidence annotated per section**
  - [ ] HIGH: directly observed in code with clear evidence
  - [ ] MEDIUM: inferred from patterns with reasonable confidence
  - [ ] LOW: best guess based on limited evidence
  - [ ] No section lacks a confidence annotation

### Size Thresholds
- [ ] **Minimum line counts met**
  - [ ] Surface depth: 500+ lines
  - [ ] Standard depth: 3000+ lines
  - [ ] Deep depth: 5000+ lines

---

## Phase 6: Validation, Reconciliation + Handoff

### Forward Check (Spec → Code)
- [ ] **All FRs trace to code**
  - [ ] Each [EXTRACTED] FR has verified source evidence
  - [ ] Each [ELEVATED] FR is explicitly flagged as improvement
  - [ ] No FR has stale or incorrect file path references
  - [ ] Source evidence spot-checked (minimum 10% random sample)

### Backward Check (Code → Spec)
- [ ] **All significant code paths have FR coverage**
  - [ ] Every public API endpoint has corresponding FR(s)
  - [ ] Every state machine has corresponding FR(s)
  - [ ] Every data model has corresponding FR(s)
  - [ ] Coverage gaps documented with justification (intentional exclusion)

### Numbering + Formatting
- [ ] **FR-X.Y.Z numbering consistent and sequential**
  - [ ] No duplicate FR identifiers
  - [ ] No gaps in sequential numbering
  - [ ] Module groupings (X) match the module catalogue
  - [ ] Cross-references between FRs use correct identifiers

### Internal Cross-Reference Integrity
- [ ] **All document self-references valid**
  - [ ] Every FR referenced in User Stories (§14) exists in §13
  - [ ] Every FR referenced in E2E Scenarios (§15) exists in §13
  - [ ] Every DI in Design Improvements Register (§16) links to an [ELEVATED] FR
  - [ ] Every model referenced in API Surface (§4) exists in Data Models (§3)
  - [ ] Every component in Data Flows (§2) exists in Component Map (§5)
  - [ ] No orphan sections

### Acceptance Criteria Quality
- [ ] **Testable language used throughout**
  - [ ] "MUST" / "SHALL" / "MUST NOT" instead of "should"
  - [ ] Specific values instead of "appropriate" or "reasonable"
  - [ ] Measurable outcomes instead of subjective assessments
  - [ ] No criteria that require human judgment to verify

### Core Test Quality
- [ ] **Tests are executable**
  - [ ] Test code is syntactically correct for target language
  - [ ] All imports/dependencies specified
  - [ ] Test setup and teardown included
  - [ ] Assertions are concrete (specific values, not "truthy")

### Human Review Items
- [ ] **Review items clearly identified**
  - [ ] LOW confidence sections flagged for human review
  - [ ] [ELEVATED] FRs marked for human approval
  - [ ] Ambiguous design decisions called out
  - [ ] Items formatted as a reviewable checklist

### Handoff Prompt Generated
- [ ] **Handoff prompt includes:**
  - [ ] Full path to spec document
  - [ ] Extraction scope summary
  - [ ] Key design decisions and rationale
  - [ ] Human review items list
  - [ ] Suggested next steps (TDD, implementation planning, etc.)
  - [ ] Caveats and confidence warnings

### Handoff Summary Delivered
- [ ] **Summary provided to user**
  - [ ] Total FRs extracted (with [EXTRACTED] vs [ELEVATED] counts)
  - [ ] Total data models documented
  - [ ] Total API endpoints documented
  - [ ] Total data flows traced
  - [ ] Confidence distribution (HIGH/MEDIUM/LOW section counts)
  - [ ] Top 3 human review items highlighted
  - [ ] Estimated spec completeness percentage

---

## Final Quality Gate

Before delivering the spec:

- [ ] **Accuracy verified**
  - [ ] File paths in source evidence are correct and current
  - [ ] Line numbers correspond to actual code
  - [ ] API signatures match codebase exactly ([EXTRACTED] FRs)
  - [ ] Data model field lists match codebase exactly ([EXTRACTED] FRs)
  - [ ] No hallucinated features or behaviors

- [ ] **Completeness verified**
  - [ ] No TODO comments in the spec
  - [ ] No placeholder text ("TBD", "fill in later", empty sections)
  - [ ] All 19 sections have substantive content
  - [ ] Size threshold met for the selected depth
  - [ ] All diagrams are complete (no "..." in diagram boxes)

- [ ] **Consistency verified**
  - [ ] FR numbering is sequential with no gaps or duplicates
  - [ ] Module names match between catalogue and FR groupings
  - [ ] Data model names match between model section and FR references
  - [ ] API names match between API section and FR references
  - [ ] [EXTRACTED] vs [ELEVATED] tags are consistent with content

- [ ] **Extraction tag audit**
  - [ ] Every FR has exactly one tag: [EXTRACTED] or [ELEVATED]
  - [ ] [ELEVATED] FRs appear in Design Improvements Register
  - [ ] [EXTRACTED] FRs match observable code behavior exactly
  - [ ] No tag is missing or ambiguous

- [ ] **Handoff readiness**
  - [ ] Spec is self-contained (reader needs no additional context)
  - [ ] All paths are absolute or project-relative
  - [ ] Handoff prompt is complete and actionable
  - [ ] Human review items are enumerated and prioritized

---

## Common Issues to Catch

### Phase 0 Issues
- [ ] Scope too broad for single session (>500 files whole-project)
- [ ] Depth not matched to scope (Surface on small project, Deep on large)
- [ ] Module boundaries misidentified (monorepo packages vs directories)
- [ ] Framework-specific structure missed (e.g., Next.js app/ vs pages/)

### Phase 1 Issues
- [ ] Missing entry points (background workers, cron jobs, event handlers)
- [ ] Dependency graph missing transitive dependencies
- [ ] Architectural pattern misidentified (layered but called "hexagonal")
- [ ] ASCII diagram missing external system boundaries

### Phase 2 Issues
- [ ] Public API incomplete (missed internal module exports)
- [ ] Data model fields missing defaults or constraints
- [ ] Data flows only trace happy path (no error branches)
- [ ] State machine missing invalid transition handling
- [ ] Security model overlooked (no auth check extraction)
- [ ] Too few files examined (under 50 for Standard depth)
- [ ] Agent findings contain unresolved contradictions

### Phase 3 Issues
- [ ] Dependencies listed without purpose/role
- [ ] External services missing failure handling documentation
- [ ] Configuration values missing defaults
- [ ] Secret config values not flagged as sensitive
- [ ] Fewer than 3 IADRs created

### Phase 4 Issues
- [ ] User stories are generic (not derived from actual code behavior)
- [ ] Goals restated from README without code evidence
- [ ] Design principles are platitudes ("clean code") not specific patterns
- [ ] Design improvements are cosmetic, not substantive
- [ ] Contradictions listed but not resolved
- [ ] System purpose statement is vague or could apply to any project
- [ ] No extraction backfill performed despite hypothesis tests revealing gaps
- [ ] Convergence criteria not met before moving to Phase 5

### Phase 5 Issues
- [ ] Requirements without core tests
- [ ] Core tests that are actually unit test stubs (not E2E)
- [ ] Missing [EXTRACTED] or [ELEVATED] tags on FRs
- [ ] Missing source evidence (file + lines) on FRs
- [ ] Acceptance criteria using vague language ("properly", "correctly")
- [ ] Sections below 19 count (stub or missing sections)
- [ ] ASCII diagrams missing or incomplete
- [ ] Confidence levels not annotated
- [ ] Design Improvements Register empty
- [ ] Tech Debt Register empty
- [ ] Under minimum line count for depth

### Phase 6 Issues
- [ ] Forward check skipped (FRs not traced to code)
- [ ] Backward check skipped (code paths not checked for FR coverage)
- [ ] Stale file paths in source evidence (code moved/refactored)
- [ ] Handoff prompt missing spec path or scope summary
- [ ] Human review items buried in text instead of enumerated
- [ ] Handoff summary missing quantitative metrics
