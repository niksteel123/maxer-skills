# Bead Plan Audit - Methodology

Detailed step-by-step process for conducting a comprehensive pre-implementation bead audit.

---

## Pre-Audit Setup

### 1. Verify Prerequisites

Before starting the audit, confirm:

**NOTE:** The bead CLI binary varies by project. Check CLAUDE.md or MEMORY.md for the correct tool. Common options: `bd`, `br` (beads_rust), or `agent-swarm beads:*`. Examples below use `bd` — substitute your project's binary.

```bash
# Beads CLI available (choose one based on context)
bd --version                              # Local development (or: br --version)
agent-swarm beads:list 2>/dev/null && echo "OK"  # Agent-swarm context

# Beads exist
bd list --json | jq length

# Check bead hierarchy
bv --robot-plan
```

### 2. Gather Input Paths

You need these documents (provided or discovered):

| Document | How to Find |
|----------|-------------|
| Kickoff Prompt | `ls docs/plan-hub/prompts/*-kickoff*.md` |
| Spec | Look in kickoff or search `*-spec.md` |
| Architecture | Look in kickoff or search `*-architecture.md` |
| Strategy | `*-strategy*.md` or `*-implementation-index*.md` |
| Beads | `bd list --json` |

### 3. Create Audit Output Directory

```bash
mkdir -p thoughts/shared/research
```

---

## ⭐ Phase 0.5: CODEBASE STUDY (CRITICAL - DO THIS FIRST)

**You CANNOT audit beads without understanding the codebase first!**

### Why This Matters

Beads should tell agents to follow existing codebase patterns. If you don't know what patterns exist, you cannot verify beads reference them correctly.

### Step 0.5.1: Explore Project Structure

```bash
# Get project structure
ls -la apps/ packages/

# Read project root files
cat AGENTS.md
cat CLAUDE.md

# Understand package relationships
cat package.json
ls packages/*/package.json | head -5
```

### Step 0.5.2: Find Existing Patterns for Similar Features

Look for features similar to what the beads implement:

```bash
# Find AGENTS.md files (codebase conventions)
find . -name "AGENTS.md" -exec cat {} \;

# Find existing patterns
grep -r "class.*Service" apps/core/src/ | head -10
grep -r "export.*function" apps/cli/src/ | head -10
```

### Step 0.5.3: Identify Key File Locations

For the feature being audited, locate:
- Bridge patterns: `apps/cli/src/bridge.ts`
- WebSocket patterns: `apps/core/src/ws/`
- Permissions patterns: `packages/shared/src/permissions.ts`
- (Adjust for your project)

### Step 0.5.4: Document Pattern Requirements

Answer and document:
- "What patterns should beads tell agents to follow?"
- "Where do similar features live?"
- "What conventions does this codebase use?"
- "What testing patterns exist?"

### Output: Pattern Reference

```markdown
## Codebase Patterns for Bead Audit

### Key Conventions
- Services in: apps/core/src/{feature}/service.ts
- Commands in: apps/cli/src/commands/{feature}.ts
- Types in: packages/shared/src/{feature}.ts

### Similar Features to Reference
- {existing-feature-1}: apps/core/src/{path}
- {existing-feature-2}: apps/cli/src/{path}

### Testing Patterns
- E2E tests: {pattern}
- Unit tests: {pattern}
```

---

## Phase 0: Input Discovery (Detailed)

### Step 0.1: Find Kickoff Prompt

```bash
# Search for kickoff prompts
find docs/plan-hub/prompts -name "*-kickoff*.md" 2>/dev/null
```

Read the kickoff prompt - it typically contains all paths:
- Spec document path
- Architecture document path
- Bead prefix/root ID
- Phase structure

### Step 0.2: Extract Paths from Kickoff

When reading the kickoff, look for sections like:

```markdown
## 1. Load Source of Truth

**Read these documents FIRST:**
- docs/spec: path/to/spec.md
- docs/arch: path/to/architecture.md
```

### Step 0.3: Validate Each Path

For each document, verify it exists:

```bash
# Check file exists
test -f "path/to/spec.md" && echo "EXISTS" || echo "MISSING"
```

### Step 0.4: Build Bead Inventory

```bash
# Get all beads as JSON
bd list --json > /tmp/beads-inventory.json
# OR with agent-swarm:
# agent-swarm beads:list --json > /tmp/beads-inventory.json

# Count beads
bd list --json | jq length

# Get bead hierarchy
bv --robot-plan
```

Extract the bead prefix (e.g., `AIGeneral-5hl`) from the root bead ID.

### Step 0.5: Read Swarm Skills (if applicable)

If the project uses agent-swarm, read permission context:

```bash
# Find swarm skills
ls .agent-swarm/skills/

# Key skills to read
cat .agent-swarm/skills/swarm-bead-layers/SKILL.md
cat .agent-swarm/skills/swarm-permissions-auditor/SKILL.md
```

---

## Phase 1: Document Analysis (Detailed)

### Step 1.1: Read Spec Document COMPLETELY

Create a requirements checklist:

```markdown
## Requirements Extracted from Spec

### Section 1: [Name]
- [ ] REQ-1.1: Description (line X)
- [ ] REQ-1.2: Description (line Y)

### Section 2: [Name]
- [ ] REQ-2.1: Description (line Z)
```

Note each requirement that MUST have a covering bead.

### Step 1.2: Read Architecture Document COMPLETELY

Build a component-to-file mapping:

```markdown
## Component Mapping

| Component | Expected Files | Bead Coverage |
|-----------|----------------|---------------|
| PlanOrchestrator | apps/core/src/plans/orchestrator.ts | TBD |
| ApprovalGates | apps/core/src/plans/approval-gates.ts | TBD |
```

### Step 1.3: Read Strategy Document

Understand the intended structure:
- How many phases?
- What's in each phase?
- What are the QA gates?
- What E2E tests are expected?

### Step 1.4: Build Requirement-to-Bead Mapping

Create a tracking table:

```markdown
## Requirement to Bead Mapping

| Spec Section | Requirement | Covering Bead | Status |
|--------------|-------------|---------------|--------|
| §1.1 | Feature X | AIGeneral-5hl.1.1 | COVERED |
| §1.2 | Feature Y | ??? | MISSING |
| §2.1 | Feature Z | AIGeneral-5hl.2.1 | PARTIAL |
```

---

## Phase 2: Bead-by-Bead Audit (Detailed)

### Step 2.1: Get Bead List

```bash
# Get beads sorted by ID
bd list --json | jq -r '.[] | .id' | sort
# OR with agent-swarm:
# agent-swarm beads:list --json | jq -r '.[] | .id' | sort
```

### Step 2.2: For Each Bead - Full Audit

**Template for each bead:**

```markdown
### Bead: {bead-id}

**Title:** {from bd show}
**Status:** {open/closed}
**Labels:** {from bd show}
**Dependencies:** {from bd show}

#### Audit Checks

| Check | Status | Notes |
|-------|--------|-------|
| SOURCE OF TRUTH WARNING | YES/NO | {notes} |
| Spec reference valid | YES/NO | References §{X} |
| Arch reference valid | YES/NO/N/A | References §{Y} |
| Dependencies exist | YES/NO | {invalid deps if any} |
| No circular deps | YES/NO | {cycle if any} |
| Content quality | GOOD/POOR/VAGUE | {notes} |
| Labels complete | YES/NO | Missing: {labels} |
| Naming follows convention | YES/NO | {issue if any} |
| Codebase pattern referenced | YES/NO | {notes} |
| Fresh agent implementable | YES/NO | {notes} |

#### Status: PASS | NEEDS_UPDATE | NEEDS_SPLIT | MISSING_BEAD

#### Issues Found
- Issue #N: {brief description}
```

### Step 2.3: Checking SOURCE OF TRUTH WARNING

Look for this pattern in bead description:

```
⚠️ SOURCE OF TRUTH WARNING

This bead contains key excerpts but is NOT sufficient for implementation.
You MUST read the referenced spec and architecture sections before implementing.

Source Documents (READ THESE FIRST):
- Spec: `docs/spec.md` §{section} ← PRIMARY
- Arch: `docs/ARCH-DATA.md` §{section} ← SECONDARY
```

If missing → **HIGH severity issue**

### Step 2.4: Validating Spec References

For each spec reference (e.g., §3.2):
1. Open the spec document
2. Find section 3.2
3. Verify it exists and relates to this bead

If reference doesn't exist → **CRITICAL severity issue**

### Step 2.5: Validating Dependencies

```bash
# Get this bead's dependencies
bd show <bead-id> --json | jq -r '.deps[]'
# OR with agent-swarm:
# agent-swarm beads:show --id <bead-id> --json | jq -r '.deps[]'

# For each dependency, verify it exists
bd show <dep-id> --json
```

If dependency doesn't exist → **CRITICAL severity issue**

### Step 2.6: Checking for Circular Dependencies

Build a dependency graph and check for cycles:

```
A → B → C → A  (CYCLE!)
```

If circular dependency found → **CRITICAL severity issue**

### Step 2.7: Evaluating Content Quality

**Good content:**
- Clear task description
- Spec references
- File list to modify
- Verification steps
- Code examples (where helpful)

**Poor content:**
- Duplicates entire spec section
- Too vague ("implement feature")
- No verification steps
- Wrong code examples

### Step 2.8: Anti-Pattern Detection

For each bead, flag these anti-patterns:

**Content Anti-Patterns:**
- `// TODO: add real test` or similar placeholders
- Mock-heavy test descriptions that don't prove system works
- "Element exists" assertions without content verification
- Vague verification: "ensure it works" without specific steps

**Structural Anti-Patterns:**
- Duplicates entire spec section (should reference, not copy)
- No file list (agent won't know what to modify)
- No verification section
- References non-existent spec sections

**E2E Test Anti-Patterns (QA Gates):**
- Unit tests instead of E2E tests
- Wrong tool for medium (e.g., curl for Electron app)
- No screenshot/log evidence required
- Partial user story (only tests happy path opening)

**If anti-patterns found:** Flag as issue with appropriate severity

### Step 2.9: Fresh Agent Implementability Check

For each bead, ask:
- "Could a fresh agent with NO prior context implement this?"
- "Is all necessary information included or referenced?"
- "Does it point to codebase patterns to follow?"
- "Are verification steps self-contained?"

If answer is "no" to any → flag as HIGH severity issue

---

## Phase 3: Coverage Analysis (Detailed)

### Step 3.1: Spec Coverage Check

For each requirement in your checklist:

```markdown
| Requirement | Bead | Status |
|-------------|------|--------|
| REQ-1.1 | AIGeneral-5hl.1.1 | COVERED |
| REQ-1.2 | - | MISSING |
| REQ-2.1 | AIGeneral-5hl.2.1 | PARTIAL |
```

### Step 3.2: QA Gate Verification

For each phase, verify:
1. QA gate bead exists
2. QA gate depends on ALL phase tasks
3. Next phase depends on QA gate
4. E2E tests are specified

```bash
# List phase 1 tasks
bd list --json | jq '.[] | select(.labels[] | contains("phase-1"))'

# Check QA gate dependencies
bd show <qa-gate-id> --json | jq '.deps'
```

### Step 3.3: Dependency Chain Verification

Verify the chain:
```
Root Epic
  └── Phase 1 Epic
       ├── Task 1.1
       ├── Task 1.2
       └── QA Gate 1 (depends on 1.1, 1.2)
  └── Phase 2 Epic (or first task depends on QA Gate 1)
       ├── Task 2.1 (should depend on QA Gate 1)
       ...
```

---

## ⭐ Phase 3.5: Spec Drift Detection (CRITICAL - NEW)

Systematic verification that beads faithfully represent the 3 Source of Truth documents (Spec, TDD, Strategy) with zero drift.

### Step 3.5.0: Determine Audit Scope

If `audit_scope` is set (e.g., "step:1,step:2"), cross-reference the strategy document to identify which requirements and TDD tests belong to the scoped steps. Requirements assigned to steps OUTSIDE scope will be tracked as `OUT_OF_SCOPE` rather than `UNCOVERED`.

```markdown
## Audit Scope

- **Scope:** {step:1,step:2 or "all"}
- **Strategy:** {path} — used to determine step assignments
- **In-scope requirements:** {count}
- **Out-of-scope requirements:** {count} (deferred to later steps per strategy)
```

### Step 3.5.1: Build Requirement Inventory from Spec

Extract every requirement from the spec — both explicitly numbered (FR-X.Y.Z) AND prose requirements:

```markdown
## Spec Requirements Inventory

| Req ID | Description | Spec Section | Source | Bead Coverage |
|--------|-------------|--------------|--------|---------------|
| FR-1.1 | {requirement text} | §1.1 | Explicit ID | TBD |
| REQ-1.2 | {requirement text} | §1.2 | Prose (MUST) | TBD |
```

**Requirement extraction rules:**
- Extract every explicitly numbered requirement (FR-X, REQ-X, etc.)
- Extract every prose statement using MUST/SHALL/SHOULD or describing required behavior
- For prose requirements without IDs, create synthetic IDs from section numbers (e.g., §3.2.1 → REQ-3.2.1)
- Include non-functional requirements (performance, security, reliability)
- A requirement is ANY statement that constrains what must be built

### Step 3.5.2: Build TDD Test Inventory

Extract every test ID from the TDD:

```markdown
## TDD Test Inventory

| Test ID | Description | Bead Coverage |
|---------|-------------|---------------|
| UT-L2.1-001 | {test description} | TBD |
| IT-L2.1-001 | {test description} | TBD |
| E2E-L2.1-001 | {test description} | TBD |
```

### Step 3.5.3: Requirement Coverage Check

For each spec requirement, search all beads for coverage:

```markdown
## Requirement Coverage Matrix

| Req ID | Covering Bead(s) | AC Match | Status |
|--------|-------------------|----------|--------|
| FR-1.1 | bd-xxx.1.1 | YES | COVERED |
| FR-1.2 | - | - | **UNCOVERED (CRITICAL)** |
| FR-2.1 | bd-xxx.2.1 | PARTIAL | **AC DRIFT (HIGH)** |
```

**If requirement is uncovered:** Flag as CRITICAL — this is a silent scope cut.
**If AC doesn't match:** Flag as HIGH — this is AC drift.

### Step 3.5.4: TDD Coverage Check

For each TDD test ID, verify at least one bead references it:

```markdown
## TDD Coverage Matrix

| Test ID | Referencing Bead(s) | Status |
|---------|---------------------|--------|
| UT-L2.1-001 | bd-xxx.1.1 | ASSIGNED |
| IT-L2.2-003 | - | **UNASSIGNED (HIGH)** |
```

Also check for ghost references — bead references a test ID that doesn't exist in the TDD:

```markdown
## Ghost References (test IDs in beads but not in TDD)

| Bead | Referenced Test ID | Status |
|------|--------------------|--------|
| bd-xxx.3.2 | UT-L2.99-001 | **GHOST REF (MEDIUM)** |
```

### Step 3.5.5: Silent Scope Cut Detection (with Scope Awareness)

Compare the full spec requirements set against the bead-covered set:

```markdown
## Silent Scope Cut Analysis

Total spec requirements: {N}
In audit scope: {S} (per strategy step assignments)
Out of audit scope: {N-S} (assigned to steps outside audit_scope)
Covered by in-scope beads: {M}
Delta (potential scope cuts): {S-M}

### Uncovered Requirements (In-Scope)

| Req ID | Description | Resolution |
|--------|-------------|------------|
| FR-2.3 | {desc} | CRITICAL — add bead or amend spec |
| FR-4.1 | {desc} | CRITICAL — add bead or amend spec |

### Out-of-Scope Requirements (Deferred per Strategy)

| Req ID | Description | Assigned Step | Status |
|--------|-------------|---------------|--------|
| FR-5.1 | {desc} | step:3 | OUT_OF_SCOPE — verified in strategy |
```

**Rules:**
- If `audit_scope` is set: Only in-scope uncovered requirements are CRITICAL. Out-of-scope requirements verified against strategy are `OUT_OF_SCOPE`.
- If `audit_scope` is NOT set (full audit): Every uncovered requirement is CRITICAL.
- There should be ZERO in-scope uncovered requirements after audit — either add a bead or amend the spec.
- Out-of-scope requirements must be verified against the strategy doc — if the strategy doesn't assign them to a specific step, they ARE scope cuts.

### Step 3.5.6: Assumption Detection

For each bead, scan for unauthorized scope assumptions:

**Flag these patterns:**
- "this is not needed for MVP"
- "we can skip this"
- "this will be added later"
- "simplified version"
- "out of scope"
- "post-MVP"
- "future enhancement"
- "deferred"

```markdown
## Assumption Violations

| Bead | Assumption Text | Spec Says | Severity |
|------|----------------|-----------|----------|
| bd-xxx.2.1 | "simplified version of X" | §2.1 requires full X | **HIGH** |
```

**Rule:** Beads implement what the spec says. The strategy doc may phase things, but NO document gets to silently reduce spec scope.

### Step 3.5.7: Acceptance Criteria Drift Check

For each bead's acceptance criteria, compare against the spec's AC:

```markdown
## AC Drift Analysis

| Bead | Bead AC | Spec AC | Status |
|------|---------|---------|--------|
| bd-xxx.1.1 | "Service starts" | "Service starts within 5s" | **WEAKENED (HIGH)** |
| bd-xxx.1.2 | Matches spec §1.2 AC | Same | PASS |
| bd-xxx.2.1 | Missing 2 of 4 AC items | §2.1 has 4 AC items | **INCOMPLETE (HIGH)** |
```

**Rules:**
- Bead AC should be a SUBSET of spec AC (splitting across beads is OK)
- Bead AC should NEVER be a REWRITE of spec AC (paraphrasing weakens)
- If spec has measurable criteria (numbers, thresholds), bead must preserve them exactly

### Step 3.5.8: Collective AC Union Verification

After checking individual bead ACs, verify that for each requirement, the UNION of all beads' ACs covers 100% of the spec's ACs:

```markdown
## Collective AC Coverage

| Req ID | Spec AC Items | Covered By Beads | Missing AC Items |
|--------|---------------|------------------|------------------|
| FR-1.1 | 4 items | bd-xxx.1.1 (3/4), bd-xxx.1.2 (1/4) | None — 4/4 |
| FR-2.1 | 3 items | bd-xxx.2.1 (2/3) | Item 3: "{missing AC text}" — **HIGH** |
```

**Rule:** If spec has N AC items for a requirement, the union of all covering beads must collectively address all N. Missing items = **HIGH**.

---

## ⭐ Phase 3.7: Parallelization Analysis

Analyze dependency graph for optimization opportunities.

### Step 3.7.1: Identify Task-Level Parallelism

For each phase, analyze:

```markdown
### Phase {N} Parallelization Analysis

| Task A | Task B | Can Parallelize? | Reason |
|--------|--------|------------------|--------|
| P1.1 | P1.2 | YES | Different files, no data dependency |
| P1.2 | P1.3 | NO | P1.3 uses P1.2's output |
```

Questions to answer:
- Do they modify different files?
- Do they have independent test scopes?
- Does one need the other's output?

### Step 3.7.2: Flag False Sequential Dependencies

Look for:
- Task B depends on Task A but doesn't actually need A's output
- Over-cautious blocking relationships
- Dependencies added "just to be safe"

**If found:** Issue severity = MEDIUM, recommendation to remove dependency

### Step 3.7.3: Analyze Phase-Level Parallelism

Can entire phases run in parallel?

```markdown
### Cross-Phase Parallelism

| Phase A | Phase B | Can Parallelize? | Reason |
|---------|---------|------------------|--------|
| P4 | P5 | YES | Both depend on P2 QA, not each other |
| P7 | P8 | YES | Both depend on P4+P5 QA gates |
```

### Step 3.7.4: Identify Bottleneck Tasks

Tasks that block many downstream tasks:
- Consider splitting for better parallelism
- Ensure they're not artificially blocking

### Step 3.7.5: Document Optimization Recommendations

```markdown
## Parallelization Recommendations

### Remove These Dependencies (False Sequentials)
- {bead-id}: Remove dep on {other-id}, reason: {why}

### Consider Splitting These Tasks
- {bead-id}: Large task blocking {N} downstream tasks

### Phase Parallelization
- P4 and P5 can run in parallel (both only need P2 QA gate)
```

---

## ⭐ Phase 3.8: Phase Plan Critique

Critique the plan itself, not just coverage.

### Step 3.8.1: Architectural Order Analysis

Ask:
- Does the phase ordering make architectural sense?
- Database before services that use it?
- Core before extensions that depend on it?

**If phase order is wrong:** Issue severity = MEDIUM

### Step 3.8.2: Phase Sizing Analysis

Are phases right-sized?
- **Too large:** Hard to parallelize, long QA gate waits
- **Too small:** Overhead of QA gates, coordination cost

Ideal phase: 3-6 tasks that can mostly run in parallel

### Step 3.8.3: Implicit Dependency Detection

Are there dependencies that exist in reality but not in beads?
- Review file modification overlap between tasks
- Check for shared state or resources
- Look for hidden ordering requirements

### Step 3.8.4: Alternative Approach Consideration

Would a different phase structure be more efficient?
- Document your reasoning
- Consider: "What would I do differently?"

### Step 3.8.5: Spec Structure Alignment

Does the implementation order follow the spec's natural grouping?
- Or does it fight against the spec's organization?
- Should phases map to spec sections?

---

## Phase 4: Audit Document Generation (Detailed)

### Step 4.1: Create Report File

```bash
# Generate filename with date
AUDIT_FILE="thoughts/shared/research/$(date +%Y-%m-%d)-{feature}-bead-plan-audit.md"
```

### Step 4.2: Write Executive Summary

Based on your findings, calculate:
- Total beads audited
- Pass / Needs Update / Needs Split / Missing counts
- Spec coverage percentage
- Critical issue count
- Overall recommendation

### Step 4.3: Document Each Issue

Use the format in TEMPLATES.md for consistent issue documentation.

---

## ⭐ Phase 4.5: E2E Test & Evidence Audit (NEW)

### Tool-to-Medium Matching Verification

For each QA gate, verify correct tool is specified:

| Application Type | Required Tool | Alternatives |
|------------------|---------------|--------------|
| Web Apps | `mcp__claude-in-chrome__*` | `mcp__playwright__*` |
| Electron Apps | `mcp__circuit-electron__*` | None |
| CLI Tools | Direct bash with output capture | None |
| APIs | curl/httpie with response validation | None |

**If wrong tool:** Issue severity = HIGH

### Real Validation Requirements Check

For each QA gate, verify:
- [ ] Real screenshots required (not mock assertions)
- [ ] Real log capture specified
- [ ] Real UI verification (click, type, verify content)
- [ ] Full user story scenarios (not partial)
- [ ] Evidence path specified

### Evidence Collection Methodology

Verify QA gates specify evidence collection:

```markdown
### Expected Evidence Structure

thoughts/shared/research/qa-{phase}-{test-name}/
├── screenshot-{step}.png
├── console-log.txt
├── network-requests.json
└── verification-notes.md
```

**If evidence not specified:** Issue severity = MEDIUM

### Anti-Pattern Detection for E2E

Flag these patterns in QA gates:
- `// TODO: add real test`
- Empty test bodies
- `test.skip()` without explanation
- Mock-heavy tests
- "Element exists" without content verification
- Tests that would pass with broken UI

---

## Phase 5: Apply Improvements (Detailed)

### Step 5.1: Prioritize Issues

Sort issues by severity:
1. CRITICAL - Blocks execution
2. HIGH - Missing coverage
3. MEDIUM - Quality issues
4. LOW - Style issues
5. INFO - Observations

### Step 5.2: For Each Issue - Apply Fix

**Fix Type: Update Bead Description**

```bash
# Using raw bd CLI:
bd update <bead-id> --description "$(cat <<'EOF'
⚠️ SOURCE OF TRUTH WARNING

This bead contains key excerpts but is NOT sufficient for implementation.
You MUST read the referenced spec and architecture sections before implementing.

Source Documents (READ THESE FIRST):
- Spec: `docs/spec.md` §3.1 ← PRIMARY

## Task Description
{Clear description of what to implement}

## Files to Modify
- path/to/file1.ts
- path/to/file2.ts

## Verification
- [ ] Typecheck passes
- [ ] Tests pass
EOF
)"

# Using agent-swarm CLI (preferred for packaged skills):
# agent-swarm beads:update --id <bead-id> --desc "..."
```

**Fix Type: Add Missing Label**

```bash
# Using raw bd CLI:
bd update <bead-id> --add-label "phase-1" --add-label "spec-section-3"

# Using agent-swarm CLI:
# agent-swarm beads:update --id <bead-id> --labels-add "phase-1,spec-section-3"
```

**Fix Type: Fix Dependencies**

```bash
# Using raw bd CLI:
bd update <bead-id> --deps "dep1,dep2,dep3"

# Using agent-swarm CLI:
# agent-swarm beads:dep:add --issue <bead-id> --dep <dep-id> --type blocks
```

**Fix Type: Fix AC Drift (copy spec AC verbatim)**

When a bead has weakened or paraphrased acceptance criteria:
1. Find the EXACT AC text from the spec for the requirement this bead covers
2. Replace the bead's AC section with the spec's AC text VERBATIM (not paraphrased)
3. If the bead covers only a subset of the requirement's ACs, include only the relevant subset — but use the spec's exact wording
4. Preserve measurable criteria (numbers, thresholds, timing) EXACTLY as stated in spec

```bash
# Update bead with verbatim spec AC
bd update <bead-id> --description "$(cat <<'EOF'
{existing description with AC section replaced by verbatim spec AC}
EOF
)"
```

**Fix Type: Create Missing Bead**

```bash
# Using raw bd CLI:
bd create "Missing Task for REQ-1.2" \
  --description "$(cat <<'EOF'
⚠️ SOURCE OF TRUTH WARNING
...full description...
EOF
)" \
  --deps "parent-bead-id" \
  --labels "phase-1,feature-name" \
  --priority 2

# Using agent-swarm CLI:
# agent-swarm beads:new \
#   --title "Missing Task for REQ-1.2" \
#   --desc "..." \
#   --priority P2 \
#   --labels "phase-1,feature-name" \
#   --parent <parent-bead-id>
```

### Step 5.3: Commit All Improvements

```bash
git add .beads/
git commit -m "Bead plan audit: improvements for {feature}

- Fixed {N} SOURCE OF TRUTH WARNING issues
- Added {M} missing beads for uncovered requirements
- Corrected {P} dependency chains
- Added missing labels to {Q} beads

Audit doc: thoughts/shared/research/{date}-{feature}-bead-plan-audit.md"
```

---

## Phase 6: Final Verification (Detailed)

### Step 6.1: Verify Bead Validity

```bash
# List all beads - should complete without errors
bd list --json
# OR: agent-swarm beads:list --json
```

### Step 6.2: Verify Dependency Chains

```bash
# Check ready beads - should show correct unblocked beads
bd ready --json
# OR: agent-swarm beads:ready --project .

# Verify count matches expected
bd ready --json | jq length
```

### Step 6.3: Verify Coverage

Re-run the requirement-to-bead mapping:
- All spec requirements should now have covering beads
- Coverage should be 100% for critical requirements

### Step 6.4: Update Audit Document

Add to audit document:

```markdown
## Fix Log

| Issue # | Bead | Fix Applied | Status |
|---------|------|-------------|--------|
| #1 | {id} | Added SOURCE OF TRUTH WARNING | FIXED |
| #2 | {id} | Created missing bead | FIXED |

## Final Status

**Audit Recommendation:** READY FOR EXECUTION

- All critical issues resolved
- Spec coverage: 100%
- Dependency chains valid
- Ready for agents to begin implementation
```

---

## Independent Reasoning Requirement

Throughout the audit, you MUST think independently, not just check boxes.

### Questions to Ask Yourself

1. **Implementability:** "Could a fresh agent with no context implement this bead?"
2. **Pattern Alignment:** "Does this bead tell agents to follow codebase patterns?"
3. **Dependency Logic:** "Do these dependencies model REAL dependencies?"
4. **Parallelization:** "Are there false sequential dependencies?"
5. **Phase Structure:** "Is this the best way to organize these phases?"
6. **Verification:** "Would these tests actually catch bugs?"

### What "Thinking Independently" Means

- Don't just verify references exist - verify they MAKE SENSE
- Don't just check dependencies - ask if they're OPTIMAL
- Don't just confirm E2E tests - ask if they'd CATCH REAL BUGS
- Don't just accept phase structure - ask if there's a BETTER WAY

### Document Your Reasoning

For non-obvious decisions, add reasoning:

```markdown
**Reasoning:** I flagged this as a false sequential dependency because
Task B only reads from the database, it doesn't need Task A's specific
output. They can safely run in parallel.
```

---

## Troubleshooting

### Bead Has Invalid Reference

If spec section doesn't exist:
1. Check if section number is wrong
2. Check if spec was updated
3. Update bead with correct reference

### Circular Dependency Found

To resolve:
1. Identify the cycle
2. Determine which dependency is incorrect
3. Remove incorrect dependency: `bd update <id> --deps "correct-deps"`

### Missing QA Gate

To create:
1. List all phase tasks
2. Create QA gate with dependencies on all tasks
3. Ensure next phase depends on QA gate

### Bead Description Too Long

If bd update truncates:
1. Keep bead description concise
2. Reference spec for details instead of duplicating
3. Use "See spec §X" pattern

---

## Best Practices

1. **Study Codebase Before Auditing**
   - Explore project structure first
   - Find existing patterns for similar features
   - Document what beads should reference

2. **Read Before Auditing**
   - Read the entire spec first
   - Understand the architecture
   - Know what beads should exist

3. **Think Independently**
   - Don't just check boxes
   - Question the phase structure
   - Look for optimization opportunities

4. **Be Systematic**
   - Audit every bead, no exceptions
   - Use the checklist for each bead
   - Document everything

5. **Verify E2E Tests Match Medium**
   - Chrome extension for web apps
   - Circuit Electron for Electron apps
   - Curl for APIs

6. **Check Fresh Agent Implementability**
   - Each bead should be self-contained
   - Reference codebase patterns
   - Include all necessary context

7. **Fix As You Go**
   - Don't batch up fixes
   - Fix critical issues immediately
   - Verify each fix works

8. **Communicate Progress**
   - Update the user periodically
   - Report blockers immediately
   - Ask questions when uncertain
