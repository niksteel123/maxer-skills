---
name: bead-plan-audit
description: Pre-implementation audit for plan beads with spec drift detection. Reviews spec, TDD, strategy (3-SOT model) and all beads BEFORE execution to find gaps, silent scope cuts, and AC drift, then applies improvements by adding/editing/updating beads.
---

# Bead Plan Audit Skill

> Pre-implementation audit for plan beads. Reviews spec, architecture, TDD document, and
> all beads BEFORE execution to find gaps, then applies improvements by adding/editing/updating beads.

## When to Use This Skill

Use this skill when:
- Beads have been created but agents haven't started implementing
- You want to verify beads fully cover the spec before execution
- You need a fresh, unbiased review of bead quality
- Pre-execution QA to ensure beads are well-formed

**Trigger phrases:**
- "Audit the beads before implementation"
- "Run bead plan audit for {feature}"
- "Review all beads and improve them"
- "Pre-implementation bead audit"
- "Check bead quality before execution"

---

## Companion Skill

This skill is the **PRE-implementation** counterpart to `bead-completion-audit`:

| Aspect | bead-plan-audit (THIS) | bead-completion-audit |
|--------|------------------------|----------------------|
| **When** | BEFORE implementation | AFTER implementation |
| **Reviews** | Beads themselves | Code changes (git diffs) |
| **Finds** | Planning gaps | Implementation gaps |
| **Fixes** | Bead edits (`bd update`, `bd create`) | Code edits |
| **Output** | Improved beads ready for execution | Fixed code ready for release |

---

## Inputs

### Required (provided or discovered)

| Input | Description | Discovery Method |
|-------|-------------|------------------|
| `spec` | Feature specification | Search `*-spec*.md` or extract from kickoff |
| `tdd` | TDD test specifications | Search `*-tdd*.md` or extract from kickoff |
| `beads` | Beads to audit | `bd list --json` in repo |

### Optional

| Input | Default |
|-------|---------|
| `kickoff_prompt` | Search `docs/plan-hub/prompts/*-kickoff*.md` |
| `architecture` | Search `*-architecture*.md` (supplementary context, NOT a SOT) |
| `strategy` | Search `*-strategy*.md` or `*-implementation-index*.md` |
| `audit_scope` | All steps/phases (set to e.g. "step:1,step:2" to scope audit) |
| `bead_prefix` | Infer from `bd list` |
| `bead_cli` | Auto-detect (`bd`, `br`, or `agent-swarm beads:*`) — check CLAUDE.md/MEMORY.md |
| `output_path` | `thoughts/shared/research/{date}-{feature}-bead-plan-audit.md` |
| `auto_fix` | `true` (apply improvements automatically) |

### Source of Truth Hierarchy (3-SOT Model)

| Priority | Document | Role | Content Expectation |
|----------|----------|------|---------------------|
| **PRIMARY** | Spec | What to build | Every detail, no shortcuts |
| **PRIMARY** | TDD + Bootstrap | How to test it | Real assertions, real bootstrap |
| **ORDERING ONLY** | Strategy | What order | Phase gates, dependency graph (~500-800 lines) |

**Key principle:** If it's in the spec, it ships. No bead or strategy document gets to make scope cuts. If something shouldn't ship, remove it from the spec first — don't silently drop it in beads.

**Beads are created directly from Spec + TDD + Strategy:**
- Bead CONTENT comes from spec + TDD directly, not paraphrased through a plan
- Bead embeds relevant spec sections verbatim, TDD test IDs with full assertions
- Strategy provides phase context and ordering ONLY — never content
- Every audit pass is a drift check against spec + TDD, not internal consistency

---

## Execution Workflow (8 Phases)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      BEAD PLAN AUDIT WORKFLOW                                    │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  Phase 0: INPUT DISCOVERY                                                        │
│  ─────────────────────────                                                       │
│  • Find kickoff prompt, spec, TDD, strategy paths                               │
│  • Discover beads via `bd list --json`                                          │
│  • Read swarm master skills for permission context                              │
│  • Build bead hierarchy tree                                                    │
│                                                                                  │
│  ⭐ Phase 0.5: CODEBASE STUDY (CRITICAL - NEW)                                   │
│  ─────────────────────────────────────────────                                   │
│  You CANNOT audit beads without understanding the codebase first!               │
│  • Explore project structure: apps/, packages/, AGENTS.md                       │
│  • Find existing patterns for similar features                                  │
│  • Understand coding conventions, testing patterns                              │
│  • Answer: "What patterns should beads tell agents to follow?"                  │
│  • Answer: "What files/components already exist that beads should reference?"   │
│  • Answer: "Do beads reference correct TDD test IDs from TDD doc?"              │
│                                                                                  │
│  Phase 1: DOCUMENT ANALYSIS                                                      │
│  ─────────────────────────                                                       │
│  • Read spec COMPLETELY - extract all requirements as checklist                 │
│  • Read arch COMPLETELY - map components to expected files                      │
│  • Read TDD COMPLETELY - extract test specifications (UT-*, IT-*, US-*)         │
│  • Read strategy - understand phase ordering and gates                          │
│  • Read swarm skills - understand permission/ACL patterns                       │
│  • Build requirement-to-bead-to-TDD mapping                                     │
│                                                                                  │
│  Phase 2: BEAD-BY-BEAD AUDIT                                                     │
│  ─────────────────────────                                                       │
│  For EACH bead (hierarchical traversal):                                         │
│    1. Read bead: `bd show <bead-id>`                                             │
│    2. Verify: SOURCE OF TRUTH WARNING present? (includes TDD path)              │
│    3. Validate: Spec/arch/TDD references exist and accurate?                    │
│    4. Check: Dependencies valid and complete?                                    │
│    5. Review: Content quality and completeness?                                  │
│    6. Verify: TDD test IDs referenced for verification criteria?                │
│    7. Verify: Labels, naming, metadata correct?                                  │
│    8. Status: PASS | NEEDS_UPDATE | NEEDS_SPLIT | MISSING_BEAD                   │
│                                                                                  │
│  Phase 3: COVERAGE ANALYSIS                                                      │
│  ─────────────────────────                                                       │
│  • Cross-reference spec requirements to beads                                   │
│  • Cross-reference TDD test specs to QA gate beads                              │
│  • Identify spec sections with no covering bead                                 │
│  • Identify TDD tests with no referencing bead                                  │
│  • Identify QA gaps (missing E2E tests)                                         │
│  • Verify phase dependency chains complete                                      │
│                                                                                  │
│  ⭐ Phase 3.5: SPEC DRIFT DETECTION (CRITICAL - NEW)                             │
│  ──────────────────────────────────────────────────                               │
│  For EACH spec requirement and TDD test:                                        │
│    1. Requirement coverage: Every spec req ID → ≥1 bead                         │
│    2. TDD coverage: Every test ID → ≥1 bead                                    │
│    3. Silent scope cut: Uncovered req = CRITICAL (not "post-MVP")              │
│    4. Assumption detection: "post-MVP", "skip", "simplified" = HIGH            │
│    5. AC drift: Bead ACs match spec ACs (subset OK, rewrite NOT OK)            │
│                                                                                  │
│  ⭐ Phase 3.7: PARALLELIZATION ANALYSIS                                          │
│  ──────────────────────────────────────────                                      │
│  • Are tasks within each phase actually parallelizable?                         │
│  • Are there FALSE sequential dependencies? (unnecessary blocking)              │
│  • Could phases themselves run in parallel? (e.g., P4 || P5)                    │
│  • Dependency graph optimization opportunities                                  │
│  • Flag: "These tasks could run in parallel but are sequenced"                  │
│                                                                                  │
│  ⭐ Phase 3.8: PHASE PLAN CRITIQUE                                               │
│  ─────────────────────────────────────                                           │
│  Don't just check coverage - critique the PLAN ITSELF:                          │
│  • Is the phase ordering optimal architecturally?                               │
│  • Could phases be reorganized for better parallelism?                          │
│  • Are there implicit dependencies not captured in beads?                       │
│  • Would YOU design it differently if starting from scratch?                    │
│  • Is this the BEST approach for the spec, not just A valid approach?           │
│                                                                                  │
│  Phase 4: AUDIT DOCUMENT GENERATION                                              │
│  ─────────────────────────────────                                               │
│  Output: `thoughts/shared/research/{date}-{feature}-bead-plan-audit.md`          │
│  • Executive summary (coverage %, issues by severity)                           │
│  • Per-bead status table                                                        │
│  • Issues list with severity and fix recommendation                            │
│  • Missing beads to create                                                      │
│  • Beads to update/improve                                                      │
│                                                                                  │
│  Phase 5: APPLY IMPROVEMENTS                                                     │
│  ─────────────────────────                                                       │
│  For EACH issue (prioritized by severity):                                       │
│    1. UPDATE existing bead: `bd update <id> --description "..."`                 │
│    2. CREATE missing bead: `bd create "..." --deps ... --labels ...`             │
│    3. FIX dependencies: `bd update <id> --deps "new-dep"`                        │
│    4. ADD labels: `bd update <id> --add-label "phase-1"`                         │
│  • Commit: Single commit for all bead improvements                              │
│                                                                                  │
│  Phase 6: FINAL VERIFICATION                                                     │
│  ─────────────────────────                                                       │
│  • Run `bd list --json` - verify all beads valid                                │
│  • Run `bd ready --json` - confirm dependency chains work                       │
│  • Verify coverage: all spec requirements have beads                            │
│  • Update audit doc with FIXED status                                           │
│  • Generate readiness report                                                    │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## What This Skill Audits (14 Categories)

### 1. Source of Truth Violations
- Missing SOURCE OF TRUTH WARNING in bead descriptions
- Spec section references incorrect or missing
- Phase plan content duplicated instead of referenced
- No pointer to read full spec

### 2. Reference Accuracy
- Spec sections that don't exist (e.g., §99 when spec has 8 sections)
- Architecture section referenced but file doesn't exist
- File paths in bead don't match project structure

### 3. Completeness Issues
- Missing file list in task beads
- No integration points documented
- Verification section incomplete
- QA gates missing E2E test specifications
- QA gate doesn't depend on all phase tasks

### 4. Hierarchy & Dependency Issues
- Task missing parent epic assignment
- Dependencies point to non-existent bead IDs
- Circular dependencies
- QA gate not blocking next phase
- Phase 2 task not depending on Phase 1 QA gate

### 5. Content Quality
- Task too verbose (duplicates entire spec)
- Task too vague (no implementation guidance)
- Code examples incomplete or wrong syntax
- Verification commands broken

### 6. E2E Test Quality (QA Gates) - EXPANDED

**Strong bias for E2E tests over unit tests.** Unit tests prove code works in isolation, not that the system works.

#### Tool-to-Medium Matching (CRITICAL)
| Application Type | Required Validation Tool |
|------------------|--------------------------|
| Web Apps | Claude Chrome Extension (`mcp__claude-in-chrome__*`) or Playwright MCP (`mcp__playwright__*`) |
| Electron Apps | Circuit Electron MCP (`mcp__circuit-electron__*`) |
| CLI Tools | Direct bash execution with output capture |
| APIs | Curl/httpie with response validation |

#### Real Validation Requirements (NO PLACEHOLDERS)
- **Real Screenshots** - Actual visual verification, not mock assertions
- **Real Log Capture** - Console/network logs with pattern matching
- **Real UI Verification** - Click, type, verify actual elements exist
- **Full User Story Scenarios** - End-to-end flows, not partial steps
- **Human-Grade Validation** - If a human would need to see it to believe it, capture evidence

#### Anti-Patterns to Flag (CRITICAL)
- `// TODO: add real test` - Placeholder tests
- Mock-heavy tests that don't prove system works
- Tests that only check function returns, not user-visible behavior
- Assertions like "element exists" without verifying content
- Tests that pass with broken UI

#### Evidence Collection Methodology
```
Evidence Path: thoughts/shared/research/qa-{phase}-{test-name}/
├── screenshot-{step}.png     # Visual verification
├── console-log.txt           # Console output
├── network-requests.json     # API calls captured
└── verification-notes.md     # Agent observations
```

#### What GOOD E2E Tests Look Like
```markdown
### Test: Pause Running Agent
1. Spawn agent: `curl -X POST localhost:3000/agents/spawn ...`
2. Verify running: `curl localhost:3000/agents/{id}` → state: "running"
3. Pause: `curl -X POST localhost:3000/agents/{id}/pause`
4. Verify paused: `curl localhost:3000/agents/{id}` → state: "paused"
5. **Screenshot Evidence**: Capture agent list showing paused state
6. **Log Evidence**: Console shows "Agent {id} paused via SIGSTOP"

Artifacts:
- [ ] Screenshot: `qa-p3-pause-screenshot.png`
- [ ] Log: Agent pause logged with timestamp
- [ ] DB: state = "paused" verified
```

### 7. Label & Metadata Issues
- Missing phase label
- Missing feature label
- Spec/arch section metadata incorrect

### 8. Naming Convention
- Inconsistent pattern
- Phase number wrong
- Type suffix wrong (should be `-task`, `-epic`, `-qa-gate`)

### 9. Cross-Phase Issues
- Phase dependency chain broken
- First task of Phase N doesn't depend on Phase N-1 QA gate

### 10. Swarm Permissions Context
- Tasks that modify protected files without noting layer constraints
- Missing skeleton_access considerations for layer-scoped work
- ACL-sensitive operations not flagged

### 11. Parallelization Issues (NEW)
- Tasks marked sequential but could run in parallel
- Phase dependencies too strict (blocking unnecessarily)
- Phases that could run in parallel but are sequenced
- Bottleneck tasks that block too many downstream tasks
- Missing parallel execution opportunities

### 12. Phase Plan Design Issues (NEW)
- Phase ordering doesn't match architectural dependencies
- Phases could be split for better parallelism
- Implicit dependencies not captured in beads
- Over-engineering (too many phases for simple feature)
- Under-engineering (phases too large to parallelize)

### 13. Fresh Agent Implementability (NEW)
- Could a fresh agent with NO prior context implement this bead?
- Is all necessary information included or referenced?
- Are codebase patterns referenced? ("Follow existing pattern in X")
- Are file paths correct and verifiable?
- Missing "Study Similar Feature First" guidance

### 14. Spec Drift Detection (CRITICAL - NEW)

Systematic verification that beads faithfully represent the 3 Source of Truth documents with zero drift.

**14a. Requirement Coverage**
- Extract every requirement ID from the spec (FR-X.Y.Z, §X.Y, or equivalent)
- For each requirement, verify at least one bead covers it
- Flag any uncovered requirement as **CRITICAL**
- Flag any bead that claims coverage but doesn't match spec acceptance criteria

**14b. TDD Coverage**
- Extract every test ID from the TDD (UT-X, IT-X, E2E-X, etc.)
- For each test, verify at least one bead references it
- Flag any unassigned test as **HIGH**
- Flag any bead referencing a test ID that doesn't exist in the TDD (ghost ref)

**14c. Silent Scope Cut Detection (with Scope Awareness)**
- Compare spec requirements set against bead-covered requirements set
- **If `audit_scope` is set**: Cross-reference uncovered requirements against strategy to determine if they belong to a step/phase outside audit scope. Mark as `OUT_OF_SCOPE (Step X)` — not CRITICAL.
- **If `audit_scope` is NOT set** (full audit): Any delta is a potential silent scope cut.
- For each truly uncovered requirement (not out-of-scope), explicitly ask: "Is this intentionally excluded? If so, it should be removed from the spec, not silently dropped in beads."
- Flag genuine scope cuts as **CRITICAL** — there should be ZERO after audit

**14d. Assumption Detection**
- For each bead, check for claims not traceable to the spec
- Common patterns to flag: "this is not needed for MVP", "we can skip this", "this will be added later", "simplified version", "out of scope"
- Flag as **HIGH** — beads implement what the spec says, not make editorial judgments
- The strategy doc may exclude items from a specific step/phase, but the SPEC never gets silently scoped down

**14e. Acceptance Criteria Drift Check**
- For each bead's acceptance criteria, compare against the spec's AC for the same requirement
- Flag any paraphrased, weakened, or missing acceptance criteria
- Bead AC should be a SUBSET of spec AC (splitting across beads is OK), but never a REWRITE
- **Collective coverage**: After checking individual beads, verify the UNION of all beads' ACs for each requirement covers 100% of the spec's ACs. Missing AC items = **HIGH**
- If spec has measurable criteria (numbers, thresholds), bead must preserve them EXACTLY
- Flag as **HIGH** if AC is rewritten or weakened

---

## Issue Severity Levels

| Severity | Description | Action |
|----------|-------------|--------|
| **CRITICAL** | Blocks execution, missing dependencies, circular refs | Fix immediately |
| **CRITICAL** | Spec requirement not covered by any bead (silent scope cut) | Fix immediately |
| **CRITICAL** | Bead makes "post-MVP" or "skip" assumption not authorized by spec | Fix immediately |
| **HIGH** | Spec requirements not covered, QA gaps | Fix before execution |
| **HIGH** | TDD test ID not assigned to any bead | Fix before execution |
| **HIGH** | Bead acceptance criteria don't match spec acceptance criteria | Fix before execution |
| **MEDIUM** | Poor content quality, missing labels | Fix if time permits |
| **MEDIUM** | Bead references spec section that doesn't exist or has moved | Fix if time permits |
| **LOW** | Naming conventions, style issues | Note for future |
| **INFO** | Observations, suggestions | No action required |

---

## BD CLI Commands Reference

### For Local Development (raw bd CLI)

When working in your own repo without agent-swarm:

```bash
# List all beads
bd list --json

# Show bead details
bd show <bead-id>

# Check ready beads (no blocking dependencies)
bd ready --json

# Update bead description
bd update <bead-id> --description "New description..."

# Update bead title
bd update <bead-id> --title "New Title"

# Add/fix dependencies
bd update <bead-id> --deps "dep1,dep2,dep3"

# Add labels
bd update <bead-id> --add-label "phase-1" --add-label "spec-section-3"

# Remove labels
bd update <bead-id> --remove-label "old-label"

# Create missing bead
bd create "Task Title" \
  --description "Description with SOURCE OF TRUTH WARNING..." \
  --deps "parent-bead-id" \
  --labels "phase-1,feature-name" \
  --priority 2

# Fix status if needed
bd update <bead-id> --status open
```

### For Agent-Swarm Context (packaged skills)

When using agent-swarm CLI (preferred for packaged skills):

```bash
# Initialize beads in repo
agent-swarm beads:init --project .

# List ready (unblocked) beads
agent-swarm beads:ready --project .

# List all beads
agent-swarm beads:list

# Show bead details
agent-swarm beads:show --id <bead-id>

# Create a new bead
agent-swarm beads:new \
  --title "Task Title" \
  --desc "Description with SOURCE OF TRUTH WARNING..." \
  --priority P2 \
  --labels "phase-1,feature-name" \
  --parent <parent-bead-id>

# Update a bead
agent-swarm beads:update \
  --id <bead-id> \
  --priority P1 \
  --labels-add "urgent"

# Add dependency
agent-swarm beads:dep:add \
  --issue <bead-id> \
  --dep <dependency-id> \
  --type blocks

# Sync beads to database
agent-swarm beads:sync
```

**Priority Levels:**
| Priority | Meaning |
|----------|---------|
| P0 | Critical - immediate attention |
| P1 | High - current sprint |
| P2 | Medium - normal priority (default) |
| P3 | Low - nice to have |
| P4 | Backlog - future consideration |

---

## Swarm Context to Read

The skill should read these swarm skills for permission context:

| Skill | Purpose for Audit |
|-------|-------------------|
| `swarm-bead-layers` | Layer ACL model (read/edit_beads/admin) |
| `swarm-permissions-auditor` | Permission audit patterns |
| `swarm-team-compose` | Role-based permission profiles |
| `swarm-civilization-leases` | Lease patterns for coordination |
| `swarm-cli-beads` | BD CLI command reference |

**When to flag permission issues:**
- Task modifies files in skeleton layers without noting access requirements
- Cross-layer work not properly coordinated
- Missing lease considerations for sensitive operations

---

## Quality Checklist

Before completing audit, verify:
- [ ] ALL beads examined (none skipped)
- [ ] ALL spec requirements mapped to beads
- [ ] Every spec requirement ID has at least one bead (100% coverage or explicit spec amendments)
- [ ] Every TDD test ID has at least one bead
- [ ] Zero silent scope cuts (no requirements dropped without spec authorization)
- [ ] Zero unauthorized assumptions ("post-MVP", "skip", "simplified")
- [ ] Bead ACs match spec ACs (subset OK, rewrite not OK)
- [ ] Dependencies point to valid bead IDs
- [ ] No circular dependencies exist
- [ ] QA gates depend on all phase tasks
- [ ] SOURCE OF TRUTH WARNING present in all beads
- [ ] Labels consistent and complete
- [ ] Naming conventions followed
- [ ] Improvements applied via bd CLI
- [ ] Final `bd ready --json` shows correct unblocked beads

---

## ⭐ Independent Reasoning Requirement (CRITICAL)

**This audit is NOT just a checklist exercise.** You must THINK and REASON independently.

### Questions You MUST Answer

For each bead, answer these questions in your audit notes:

1. **Fresh Agent Test**: "If I were a fresh agent with no context, could I implement this bead?"
   - If NO → Missing information, file references, or pattern guidance

2. **Codebase Alignment**: "Does this bead tell agents to follow existing codebase patterns?"
   - If NO → Add "Study similar feature at X" guidance

3. **Dependency Validity**: "Are the dependencies modeling REAL implementation dependencies?"
   - If NO → Fix dependencies to match actual code dependencies

4. **Parallelization**: "Could this task run in parallel with others in its phase?"
   - If YES but sequenced → Flag as optimization opportunity

### Phase Plan Meta-Questions

After auditing all beads, answer:

1. "Is this phase ordering the BEST approach, or just A valid approach?"
2. "What would I do differently if designing this from scratch?"
3. "Are there implicit dependencies not captured anywhere?"
4. "Could phases be reorganized for better parallelism?"

### Document Your Reasoning

In the audit report, include a "Reasoning Notes" section with your independent analysis:

```markdown
## Reasoning Notes

### Phase Plan Assessment
[Your independent analysis of whether this is the best approach]

### Parallelization Opportunities
[Tasks/phases that could be optimized]

### Fresh Agent Concerns
[Beads that would be hard to implement with no context]

### Alternative Approaches Considered
[What you would do differently and why]
```

---

## Integration with Master Workflow

```
WORKFLOW POSITION:

[research-to-spec] → [spec-to-tdd] → [spec-to-strategy] → [beads-from-sources] → [bead-plan-audit] → [beads-to-execution]
                                                                                                    ^^^^^^^^^^^^^^^^
                                                                                                    THIS SKILL

After this skill:
• Beads are improved and ready for execution
• Spec coverage is verified
• Dependencies are validated
```

---

## Related Files

- **METHODOLOGY.md** - Detailed step-by-step audit process
- **TEMPLATES.md** - Audit report templates
- **CHECKLIST.md** - Per-category audit checklists

---

## Example Invocations

**With kickoff prompt:**
```
Run the bead-plan-audit skill.
Kickoff: docs/plan-hub/prompts/plan-mode-infrastructure-kickoff.md
```

**Minimal:**
```
Audit all beads before implementation. Check docs/ for the spec.
```

**With explicit paths:**
```
Run a pre-implementation audit for Plan Mode Infrastructure.
Spec: thoughts/shared/specs/2025-12-24-plan-mode-feature-specification.md
Arch: thoughts/shared/specs/2025-12-24-plan-mode-architecture.md
Beads: bd list --json (prefix AIGeneral-5hl)
```

---

## Notes for Agents

1. **Thoroughness over Speed:** A missed issue now means bugs later. Take time.

2. **Read the Spec First:** You cannot audit beads without understanding requirements.

3. **Validate References:** Actually check that §X exists in the spec before marking PASS.

4. **Check Dependencies:** Run `bd ready --json` to catch blocking issues.

5. **Use BD CLI for Fixes:** All bead improvements go through `bd update` or `bd create`.

6. **Single Commit:** Batch all bead improvements into one commit.

7. **Update Audit Doc:** Mark issues as FIXED after applying improvements.

8. **Permission Context:** If project uses swarm, read relevant skills for ACL understanding.
