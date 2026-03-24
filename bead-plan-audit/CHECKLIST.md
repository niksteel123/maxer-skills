# Bead Plan Audit - Checklists

Pre-audit prerequisites and per-category audit checklists.

---

## Pre-Audit Checklist

Before starting the audit, verify all of the following:

### ⭐ Codebase Study (CRITICAL - DO THIS FIRST)

You CANNOT audit beads without understanding the codebase patterns first!

- [ ] **Project structure explored**
  ```bash
  ls -la apps/ packages/
  ```

- [ ] **AGENTS.md files read**
  ```bash
  find . -name "AGENTS.md" -exec cat {} \;
  ```

- [ ] **Existing patterns for similar features identified**
  - Where do similar features live?
  - What conventions does this codebase use?
  - What testing patterns exist?

- [ ] **Key file locations understood**
  - Bridge patterns: `apps/cli/src/bridge.ts`
  - WebSocket patterns: `apps/core/src/ws/`
  - Permissions patterns: `packages/shared/src/permissions.ts`
  - (Adjust for your project)

- [ ] **Answer documented**: "What patterns should beads tell agents to follow?"

### Environment Setup

- [ ] **Beads CLI available**
  ```bash
  bd --version
  # OR for agent-swarm context:
  # agent-swarm beads:list 2>/dev/null && echo "OK"
  ```

- [ ] **Beads exist for the feature**
  ```bash
  bd list --json | jq length
  # Should return > 0
  ```

### Input Documents

- [ ] **Spec document located**
  - Path verified and readable
  - Contains feature requirements

- [ ] **Architecture document located** (if applicable)
  - Path verified and readable

- [ ] **Strategy document located** (if applicable)
  - `*-strategy*.md` or `*-implementation-index*.md`

- [ ] **Kickoff prompt located** (optional but helpful)
  ```bash
  ls docs/plan-hub/prompts/*-kickoff*.md
  ```

- [ ] **Bead prefix identified**
  ```bash
  bd list --json | jq -r '.[0].id' | cut -d. -f1
  ```

### Output Location

- [ ] **Audit output directory exists**
  ```bash
  mkdir -p thoughts/shared/research
  ```

---

## Category 1: Source of Truth Violations

For EACH bead, check:

- [ ] **SOURCE OF TRUTH WARNING present**
  - Contains the standard warning block
  - Points to spec as PRIMARY
  - Points to arch as SECONDARY (if applicable)
  - Notes phase plan is FRAMEWORK ONLY

- [ ] **Spec reference included**
  - Format: `Spec: path/to/spec.md §X`
  - Section number is specific (not vague)

- [ ] **No phase plan duplication**
  - Bead doesn't copy entire phase plan content
  - References spec, not phase plan, for details

- [ ] **Pointer to full spec**
  - "READ THESE FIRST" or equivalent

**If any fail:** Issue severity = HIGH

---

## Category 2: Reference Accuracy

For EACH spec/arch reference in beads:

- [ ] **Spec section exists**
  - Open spec document
  - Find referenced section (e.g., §3.2)
  - Confirm section relates to bead topic

- [ ] **Architecture section exists** (if referenced)
  - Open arch document
  - Find referenced section
  - Confirm section relates to bead topic

- [ ] **File paths valid**
  - Check each file path in bead
  - Confirm path matches project structure
  - Use relative paths from repo root

**If spec/arch section doesn't exist:** Issue severity = CRITICAL

---

## Category 3: Completeness Issues

For task beads:

- [ ] **File list present**
  - "Files to Create/Modify" section
  - Specific file paths, not vague

- [ ] **Integration points documented** (if cross-component)
  - How this task connects to other components
  - API contracts, data flows

- [ ] **Verification section complete**
  - Automated checks (typecheck, tests)
  - Manual verification steps

For QA gate beads:

- [ ] **E2E tests specified**
  - Complete test scenarios
  - Step-by-step instructions
  - Expected results

- [ ] **All phase tasks as dependencies**
  - QA gate depends on every task in phase
  - No tasks missing from deps

**If missing:** Issue severity = HIGH for QA, MEDIUM for tasks

---

## Category 4: Hierarchy & Dependencies

- [ ] **All beads have parent** (except root)
  - Check parent assignment
  - Matches phase structure

- [ ] **All dependencies exist**
  ```bash
  # For each dep in bead.deps:
  bd show <dep-id>  # Should succeed
  # OR: agent-swarm beads:show --id <dep-id>
  ```

- [ ] **No circular dependencies**
  - A → B → C → A is INVALID
  - Check dependency chains

- [ ] **QA gates block next phase**
  - First task of Phase N depends on Phase N-1 QA gate
  - Or Phase N epic depends on Phase N-1 QA gate

- [ ] **Phase dependency chain complete**
  ```
  Phase 1 → QA Gate 1 → Phase 2 → QA Gate 2 → ...
  ```

**If circular dep or invalid dep:** Issue severity = CRITICAL

---

## Category 5: Content Quality

- [ ] **Description clarity**
  - Clear what needs to be done
  - Not too verbose (duplicating spec)
  - Not too vague ("implement feature")

- [ ] **Code examples valid** (if present)
  - Correct syntax
  - Relevant to task
  - Not outdated patterns

- [ ] **Verification commands work**
  ```bash
  # Test commands like:
  bun run tsc --noEmit
  bun test
  ```

- [ ] **Acceptance criteria clear**
  - Measurable outcomes
  - Testable assertions

**If too vague or verbose:** Issue severity = MEDIUM

---

## Category 6: E2E Test Quality (QA Gates) - EXPANDED

**Strong bias for E2E tests over unit tests.** Unit tests prove code works in isolation, not that the system works.

### Tool-to-Medium Matching (CRITICAL)

- [ ] **Web App tests specify correct tool**
  - Claude Chrome Extension (`mcp__claude-in-chrome__*`) OR
  - Playwright MCP (`mcp__playwright__*`)

- [ ] **Electron App tests specify correct tool**
  - Circuit Electron MCP (`mcp__circuit-electron__*`)

- [ ] **CLI tests use bash with output capture**
  - Direct execution with expected output patterns

- [ ] **API tests use curl/httpie**
  - Full request/response validation

### Real Validation Requirements (NO PLACEHOLDERS)

- [ ] **Real screenshots required**
  - Actual visual verification, not mock assertions
  - Path specified: `thoughts/shared/research/qa-{phase}-*.png`

- [ ] **Real log capture required**
  - Console/network logs with pattern matching
  - How to capture specified

- [ ] **Real UI verification**
  - Click, type, verify actual elements exist
  - Not just "element exists" - verify content

- [ ] **Full user story scenarios**
  - End-to-end flows, not partial steps
  - Complete happy path + error cases

- [ ] **Human-grade validation**
  - If a human would need to see it to believe it, capture evidence

### Anti-Patterns to Flag

- [ ] **No placeholder tests**
  - Flag: `// TODO: add real test`
  - Flag: Empty test bodies
  - Flag: `test.skip()` without explanation

- [ ] **No mock-heavy tests that don't prove system works**
  - Flag: Test only verifies mocked responses

- [ ] **No assertion-only tests**
  - Flag: Tests that only check function returns, not user-visible behavior

- [ ] **No shallow element checks**
  - Flag: "element exists" without verifying content
  - Flag: Tests that pass with broken UI

### Evidence Collection (REQUIRED)

- [ ] **Evidence path specified**
  ```
  thoughts/shared/research/qa-{phase}-{test-name}/
  ├── screenshot-{step}.png
  ├── console-log.txt
  ├── network-requests.json
  └── verification-notes.md
  ```

- [ ] **Verification artifacts listed**
  - [ ] Screenshot: {path}
  - [ ] Log: {what to check}
  - [ ] DB: {query to verify state}

**If missing E2E tests or using wrong tool:** Issue severity = HIGH

---

## Category 7: Label & Metadata Issues

- [ ] **Phase label present**
  - `phase-1`, `phase-2`, etc.
  - Matches actual phase

- [ ] **Feature label present**
  - Consistent across related beads
  - Descriptive

- [ ] **Spec section label** (optional but helpful)
  - `spec-section-3`
  - Matches actual spec section

- [ ] **Priority set** (if applicable)
  - P0-P4 scale
  - Appropriate for task importance

**If missing labels:** Issue severity = LOW

---

## Category 8: Naming Convention

- [ ] **Follows pattern**
  - `{phase}-{feature}-{type}`
  - Examples: `phase1-auth-task`, `phase2-api-qa-gate`

- [ ] **Phase number correct**
  - Matches actual phase
  - Consistent with labels

- [ ] **Type suffix correct**
  - `-task` for implementation tasks
  - `-epic` for phase/feature epics
  - `-qa-gate` for verification gates

- [ ] **Consistent within project**
  - All beads follow same pattern
  - No mixed conventions

**If naming wrong:** Issue severity = LOW

---

## Category 9: Cross-Phase Issues

- [ ] **Phase dependency chain unbroken**
  - Phase 2 first task → depends on → Phase 1 QA gate
  - No gaps in chain

- [ ] **QA gates properly positioned**
  - End of each phase
  - Block next phase

- [ ] **No orphan beads**
  - Every bead reachable from root
  - No disconnected clusters

- [ ] **Parallel phases correctly independent**
  - If phases can run parallel, no cross-dependencies
  - Clear documentation of parallelism

**If chain broken:** Issue severity = CRITICAL

---

## Category 10: Swarm Permissions Context

(Only if project uses agent-swarm)

- [ ] **Layer-scoped work noted**
  - Tasks modifying protected files note layer constraints
  - skeleton_access requirements mentioned

- [ ] **ACL-sensitive operations flagged**
  - Changes to permissions, ACLs
  - Cross-layer work

- [ ] **Lease considerations noted** (if applicable)
  - Sensitive operations that need coordination
  - Exclusive access requirements

**If permission context missing:** Issue severity = MEDIUM

---

## Category 11: Parallelization Issues (NEW)

Analyze dependency graph for optimization opportunities:

- [ ] **Tasks within phase analyzed for parallelism**
  - Can Task A and Task B in Phase 1 run simultaneously?
  - Do they modify different files?
  - Do they have independent test scopes?

- [ ] **False sequential dependencies flagged**
  - Task B depends on Task A but doesn't actually need A's output
  - Over-cautious blocking relationships

- [ ] **Phase-level parallelism analyzed**
  - Can Phase 4 and Phase 5 run in parallel?
  - Do they depend on the same QA gate but not each other?

- [ ] **Bottleneck tasks identified**
  - Tasks that block many downstream tasks
  - Consider splitting for better parallelism

- [ ] **Optimization recommendations documented**
  - List specific dependency changes to improve parallelism

**If significant parallelization opportunities missed:** Issue severity = MEDIUM

---

## Category 12: Phase Plan Design Issues (NEW)

Critique the plan itself, not just coverage:

- [ ] **Phase ordering makes architectural sense**
  - Database before services that use it
  - Core before extensions that depend on it

- [ ] **Phases are right-sized**
  - Not too large (hard to parallelize)
  - Not too small (overhead of QA gates)

- [ ] **Implicit dependencies captured**
  - Are there dependencies that exist in reality but not in beads?
  - Review file modification overlap between tasks

- [ ] **Alternative approaches considered**
  - Would a different phase structure be more efficient?
  - Document your reasoning

- [ ] **Phase plan matches spec structure**
  - Does the implementation order follow the spec's natural grouping?
  - Or does it fight against the spec's organization?

**If phase design is suboptimal:** Issue severity = MEDIUM

---

## Category 13: Fresh Agent Implementability (NEW)

Each bead must be implementable by a fresh agent with NO prior context:

- [ ] **All necessary information included or referenced**
  - Spec section clearly stated
  - File paths verifiable
  - No assumed knowledge

- [ ] **Codebase patterns referenced**
  - "Follow existing pattern in apps/cli/src/bridge.ts"
  - "Study similar feature at packages/shared/src/permissions.ts"

- [ ] **Study similar feature first guidance**
  - Points to existing implementations to learn from
  - Explains what patterns to follow

- [ ] **Self-contained verification steps**
  - Agent doesn't need to guess how to verify
  - Specific commands, expected outputs

- [ ] **Integration context provided**
  - How this bead connects to others
  - What files/components it will interact with

**Test:** Read each bead and ask "Could I implement this with ONLY the information here (plus spec)?"

**If bead requires assumed context:** Issue severity = HIGH

---

## Category 14: Spec Drift Detection (CRITICAL - NEW)

Systematic verification that beads faithfully represent the 3 Source of Truth documents with zero drift.

### 14a. Requirement Coverage

- [ ] **All spec requirement IDs extracted**
  - Every requirement has an ID (FR-X.Y.Z, §X.Y, or equivalent)
  - Requirements inventory is complete

- [ ] **Every requirement has at least one covering bead**
  - Cross-referenced against bead inventory
  - No uncovered requirements (CRITICAL if any found)

- [ ] **Bead coverage claims verified**
  - Bead actually implements what it claims to cover
  - Not just referencing the section — actually covering the requirement

### 14b. TDD Coverage

- [ ] **All TDD test IDs extracted**
  - Every test ID (UT-*, IT-*, E2E-*, etc.) inventoried
  - Test inventory is complete

- [ ] **Every test ID assigned to at least one bead**
  - Cross-referenced against bead inventory
  - No unassigned tests (HIGH if any found)

- [ ] **No ghost references**
  - No bead references a test ID that doesn't exist in TDD
  - Verify each referenced test ID exists (MEDIUM if ghost found)

### 14c. Silent Scope Cut Detection

- [ ] **Spec-to-bead delta computed**
  - Compare full spec requirements set vs bead-covered set
  - Any delta is a potential silent scope cut

- [ ] **Every uncovered requirement explicitly addressed**
  - Either: add a bead to cover it (CRITICAL)
  - Or: amend the spec to remove it (must be done in spec, not silently in beads)

- [ ] **Zero scope cuts after audit**
  - 100% spec coverage or explicit spec amendments

### 14d. Assumption Detection

- [ ] **No unauthorized scope assumptions in beads**
  - Scanned for: "post-MVP", "skip", "simplified", "out of scope", "deferred", "future enhancement", "not needed for MVP", "will be added later"
  - Flag as HIGH if found

- [ ] **Strategy phase exclusions are authorized**
  - Strategy doc may exclude items from a specific step/phase
  - But spec requirements are NEVER silently scoped down

### 14e. Acceptance Criteria Drift

- [ ] **Bead ACs compared against spec ACs**
  - For each bead's acceptance criteria, verified against spec's AC for same requirement

- [ ] **No paraphrased or weakened ACs**
  - Bead AC is a SUBSET of spec AC (splitting across beads OK)
  - Bead AC is never a REWRITE of spec AC
  - Measurable criteria (numbers, thresholds) preserved exactly

- [ ] **No missing AC items**
  - If spec has 4 AC items, bead(s) collectively cover all 4
  - Missing AC items flagged as HIGH

**If any requirement uncovered or scope cut found:** Issue severity = CRITICAL
**If TDD test unassigned or AC drift found:** Issue severity = HIGH

---

## During Audit Tracking

Track progress through the audit:

### Phase 0: Input Discovery
- [ ] Kickoff prompt read (if available)
- [ ] Spec document path confirmed
- [ ] Architecture document path confirmed
- [ ] Phase plans located
- [ ] Bead inventory built
- [ ] All paths validated

### Phase 1: Document Analysis
- [ ] Spec read COMPLETELY
- [ ] All requirements extracted
- [ ] Architecture read COMPLETELY
- [ ] Component mapping created
- [ ] Phase plans read
- [ ] Requirement-to-bead mapping started

### Phase 2: Bead-by-Bead Audit
- [ ] All beads audited (none skipped)
- [ ] Each bead checked against 10 categories
- [ ] Issues documented with severity
- [ ] Status assigned to each bead

### Phase 3: Coverage Analysis
- [ ] Spec requirements mapped to beads
- [ ] Missing coverage identified
- [ ] QA gaps identified
- [ ] Dependency chains verified

### Phase 3.5: Spec Drift Detection
- [ ] Spec requirements inventory built
- [ ] TDD test inventory built
- [ ] Requirement coverage matrix complete
- [ ] TDD coverage matrix complete
- [ ] Silent scope cuts identified and resolved
- [ ] Assumption violations flagged
- [ ] AC drift check complete

### Phase 4: Audit Document Generated
- [ ] Executive summary written
- [ ] Issues by category tallied
- [ ] Per-bead status table complete
- [ ] Missing beads listed
- [ ] Fix recommendations specific

### Phase 5: Improvements Applied
- [ ] All CRITICAL issues fixed
- [ ] All HIGH issues fixed
- [ ] MEDIUM issues fixed (if time)
- [ ] All fixes via bd CLI
- [ ] Single commit for all improvements

### Phase 6: Final Verification
- [ ] `bd list --json` succeeds
- [ ] `bd ready --json` shows correct beads
- [ ] Spec coverage verified
- [ ] Audit doc updated with FIXED status
- [ ] Readiness report generated

---

## Quick Reference: bd Commands

### Raw bd CLI (local development)

```bash
# List all beads
bd list --json

# Show bead details
bd show <bead-id>

# Check ready beads
bd ready --json

# Update description
bd update <id> --description "..."

# Update title
bd update <id> --title "..."

# Fix dependencies
bd update <id> --deps "dep1,dep2"

# Add label
bd update <id> --add-label "phase-1"

# Remove label
bd update <id> --remove-label "old"

# Create new bead
bd create "Title" --description "..." --deps "..." --labels "..."

# Update status
bd update <id> --status open
```

### Agent-Swarm CLI (packaged skills)

```bash
# List all beads
agent-swarm beads:list

# Show bead details
agent-swarm beads:show --id <bead-id>

# Check ready beads
agent-swarm beads:ready --project .

# Create new bead
agent-swarm beads:new --title "Title" --desc "..." --priority P2 --labels "..."

# Update bead
agent-swarm beads:update --id <bead-id> --priority P1 --labels-add "urgent"

# Add dependency
agent-swarm beads:dep:add --issue <bead-id> --dep <dep-id> --type blocks

# Sync beads
agent-swarm beads:sync
```

---

## Post-Audit Checklist

Final verification before completing:

- [ ] ALL beads examined (none skipped)
- [ ] ALL critical issues fixed
- [ ] ALL high issues fixed
- [ ] Spec coverage at target level
- [ ] Dependency chains valid
- [ ] `bd ready` shows expected beads
- [ ] Audit document complete
- [ ] Improvements committed
- [ ] Readiness recommendation provided
- [ ] Zero uncovered spec requirements (or spec amended)
- [ ] Zero unassigned TDD test IDs (or TDD amended)
- [ ] Zero unauthorized scope assumptions in beads
- [ ] Bead ACs match spec ACs (no drift)
