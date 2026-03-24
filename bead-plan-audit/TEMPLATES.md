# Bead Plan Audit - Templates

Ready-to-use templates for audit documentation.

---

## Audit Report Template

```markdown
---
date: {YYYY-MM-DDTHH:MM:SSZ}
auditor: Claude Opus 4.6
feature: {feature-name}
spec: {path-to-spec}
architecture: {path-to-arch}
beads_prefix: {e.g., AIGeneral-5hl}
status: {in_progress | complete}
type: pre-implementation
---

# Bead Plan Audit Report: {Feature Name}

## Executive Summary

| Metric | Value |
|--------|-------|
| **Audit Date** | {YYYY-MM-DD} |
| **Total Beads** | {N} |
| **Passed** | {X} |
| **Needs Update** | {Y} |
| **Needs Split** | {Z} |
| **Missing Beads** | {W} |
| **Spec Coverage** | {X/N * 100}% |
| **Critical Issues** | {count} |
| **Recommendation** | READY | NEEDS_WORK | BLOCKED |

### Summary

{2-3 sentence summary of findings}

---

## Issues by Category

| Category | Critical | High | Medium | Low |
|----------|----------|------|--------|-----|
| Source of Truth | {n} | {n} | {n} | {n} |
| Reference Accuracy | {n} | {n} | {n} | {n} |
| Completeness | {n} | {n} | {n} | {n} |
| Dependencies | {n} | {n} | {n} | {n} |
| Content Quality | {n} | {n} | {n} | {n} |
| E2E Tests | {n} | {n} | {n} | {n} |
| Metadata | {n} | {n} | {n} | {n} |
| Naming | {n} | {n} | {n} | {n} |
| Cross-Phase | {n} | {n} | {n} | {n} |
| Permissions | {n} | {n} | {n} | {n} |
| Parallelization | {n} | {n} | {n} | {n} |
| Phase Design | {n} | {n} | {n} | {n} |
| Fresh Agent | {n} | {n} | {n} | {n} |
| Spec Drift | {n} | {n} | {n} | {n} |

---

## Issues Found

{Repeat for each issue}

### Issue #N: {Title} ({SEVERITY})

**Bead:** `{bead-id}`
**Category:** {category from 10 above}
**Severity:** CRITICAL | HIGH | MEDIUM | LOW | INFO

**Problem:**
{Clear description of what's wrong}

**Impact:**
{What breaks or is affected due to this issue}

**Fix Recommendation:**
{Specific bd command or action to resolve}

```bash
# Fix command
bd update {bead-id} --{option} "..."
```

**Status:** OPEN | FIXED

---

## Phase-by-Phase Verification

### Phase 1: {Phase Name}

| Bead ID | Title | SOT Warning | Deps Valid | Labels | Status |
|---------|-------|-------------|------------|--------|--------|
| {id} | {title} | Yes/No | Yes/No | Yes/No | PASS |
| {id} | {title} | Yes/No | Yes/No | Yes/No | NEEDS_UPDATE |

**Phase Coverage:** {X/Y requirements covered}
**QA Gate:** {Present/Missing}
**Issues:** {list issue numbers}

{Repeat for each phase}

---

## Spec Coverage Analysis

### Covered Requirements

| Spec Section | Requirement | Bead | Status |
|--------------|-------------|------|--------|
| §1.1 | {requirement} | {bead-id} | COVERED |
| §1.2 | {requirement} | {bead-id} | COVERED |

### Missing Coverage

| Spec Section | Requirement | Suggested Bead |
|--------------|-------------|----------------|
| §2.3 | {requirement} | Create: "{title}" |
| §3.1 | {requirement} | Create: "{title}" |

### Spec Drift Summary

#### Requirement Coverage
- Spec requirements total: {N}
- Covered by beads: {M} ({M/N * 100}%)
- Uncovered (CRITICAL): {list or "None"}

#### TDD Coverage
- TDD test IDs total: {N}
- Assigned to beads: {M} ({M/N * 100}%)
- Unassigned (HIGH): {list or "None"}
- Ghost references (MEDIUM): {list or "None"}

#### Silent Scope Cuts
{list of requirements dropped without spec authorization, or "None — 100% coverage achieved"}

#### Assumption Violations
{list of beads making unauthorized scope assumptions, or "None found"}

#### AC Drift
{list of beads with paraphrased/weakened acceptance criteria, or "None — all ACs match spec"}

---

## Dependency Analysis

### Valid Chains
```
Root → Phase1 Epic → [Tasks] → QA Gate 1 → Phase2 Epic → ...
```

### Broken Chains
- {bead-id}: depends on non-existent {bad-dep-id}
- {bead-id}: circular dependency with {cycle-id}

---

## Beads Requiring Updates

| Bead ID | Issue | Fix Required | Priority |
|---------|-------|--------------|----------|
| {id} | Missing SOT WARNING | Add warning | CRITICAL |
| {id} | Invalid spec ref | Fix §X → §Y | HIGH |
| {id} | Missing labels | Add phase-1 | MEDIUM |

---

## Missing Beads to Create

| Title | Parent | Deps | Labels | Spec Ref |
|-------|--------|------|--------|----------|
| {title} | {parent-id} | {deps} | phase-1,feature | §2.3 |

---

## Fix Log

| Issue # | Bead | Description | Command | Status |
|---------|------|-------------|---------|--------|
| #1 | {id} | Added SOT warning | bd update ... | FIXED |
| #2 | {id} | Created missing bead | bd create ... | FIXED |

---

## Conclusion

{Final assessment paragraph}

### Recommendation

{READY FOR EXECUTION | REQUIRES FIXES | BLOCKED}

### Next Steps

1. {Action item 1}
2. {Action item 2}
```

---

## Individual Issue Template

```markdown
### Issue #N: {Title} ({SEVERITY})

**Bead:** `{bead-id}`
**Category:** {one of: Source of Truth | Reference Accuracy | Completeness | Dependencies | Content Quality | E2E Tests | Metadata | Naming | Cross-Phase | Permissions | Parallelization | Phase Design | Fresh Agent | Spec Drift}
**Severity:** CRITICAL | HIGH | MEDIUM | LOW | INFO
**Status:** OPEN | FIXED

#### Problem
{Clear description of what's wrong or missing}

#### Evidence
```
# Bead content showing the issue
{bead description excerpt}
```

#### Impact
- {Impact 1}
- {Impact 2}

#### Fix Recommendation
{Specific steps to resolve}

```bash
# Command to fix
bd update {bead-id} --{option} "..."
```

#### Resolution
- **Fix Applied:** {Yes/No}
- **Command Used:** `{command}`
- **Verified:** {Yes/No}
```

---

## Bead Audit Template

```markdown
### Bead: {bead-id}

**Title:** {title}
**Phase:** {phase-number}
**Status:** {open/closed}
**Labels:** {labels}
**Dependencies:** {deps}

#### Audit Checklist

| Check | Status | Notes |
|-------|--------|-------|
| SOURCE OF TRUTH WARNING present | YES/NO | {notes} |
| Spec reference valid (§{X} exists) | YES/NO | {notes} |
| Arch reference valid | YES/NO/N/A | {notes} |
| All dependencies exist | YES/NO | {invalid: ...} |
| No circular dependencies | YES/NO | {cycle: ...} |
| Content quality adequate | GOOD/POOR | {notes} |
| File list present | YES/NO | {notes} |
| Verification steps present | YES/NO | {notes} |
| Labels complete | YES/NO | Missing: {labels} |
| Naming follows convention | YES/NO | {issue} |

#### Requirements Covered
- REQ-{X}: {description}
- REQ-{Y}: {description}

#### Final Status: {PASS | NEEDS_UPDATE | NEEDS_SPLIT | MISSING_BEAD}

#### Issues Found
- Issue #{N}: {brief description}
```

---

## Bead Fix Template

```markdown
## Fix: Issue #{N}

**Issue:** {Title}
**Bead:** `{bead-id}`
**Severity:** {severity}
**Category:** {category}

### Before

**Problem:**
{Description of the issue}

```
# Original bead content
{excerpt}
```

### After

**Solution:**
{Description of the fix}

```bash
# Command used
bd update {bead-id} --description "$(cat <<'EOF'
{new description}
EOF
)"
```

### Verification

```bash
# Verify the fix
bd show {bead-id}
```

- [ ] Bead description updated
- [ ] Spec reference valid
- [ ] Dependencies correct
- [ ] Labels complete
```

---

## Missing Bead Creation Template

```markdown
## Create: {Bead Title}

**Covering:** Spec §{section} - {requirement description}
**Parent:** `{parent-bead-id}`
**Phase:** {phase-number}

### Command

```bash
bd create "{Bead Title}" \
  --description "$(cat <<'EOF'
⚠️ SOURCE OF TRUTH WARNING

This bead contains key excerpts but is NOT sufficient for implementation.
You MUST read the referenced spec and architecture sections before implementing.

Source Documents (READ THESE FIRST):
- Spec: `{path/to/spec.md}` §{section} ← PRIMARY
- Arch: `{path/to/arch.md}` §{section} ← supplementary context (if applicable)

## Task Description

{Clear description of what to implement}

## Key Implementation Details

{Excerpts from spec, not full duplication}

## Files to Create/Modify

- {path/to/file1.ts}
- {path/to/file2.ts}

## Verification

- [ ] Typecheck passes: `bun run tsc --noEmit`
- [ ] Tests pass: `bun test`
- [ ] Manual verification: {steps}
EOF
)" \
  --deps "{parent-bead-id}" \
  --labels "phase-{N},{feature-name},spec-section-{X}" \
  --priority 2
```

### Verification

```bash
# Verify bead was created
bd list --json | jq '.[] | select(.title | contains("{Title}"))'
```
```

---

## Completion Report Template

```markdown
# Bead Plan Audit Completion Report

## Summary

| Metric | Initial | Final |
|--------|---------|-------|
| Total Beads | {N} | {N+created} |
| Issues Found | {N} | - |
| Issues Fixed | - | {M} |
| Issues Remaining | - | {N-M} |
| Spec Coverage | {X}% | {Y}% |

## Fixes Applied

| # | Issue | Bead | Fix | Verified |
|---|-------|------|-----|----------|
| 1 | {description} | {id} | Added SOT warning | Yes |
| 2 | {description} | {id} | Created bead | Yes |

## Beads Created

| ID | Title | Parent | Spec Ref |
|----|-------|--------|----------|
| {new-id} | {title} | {parent} | §{section} |

## Remaining Items

| # | Issue | Bead | Priority | Reason |
|---|-------|------|----------|--------|
| 3 | {description} | {id} | LOW | Deferred |

## Verification Results

### Bead Validity
```bash
$ bd list --json | jq length
{count}
```

### Ready Beads
```bash
$ bd ready --json | jq length
{count}
```

### Spec Coverage
- Total requirements: {N}
- Covered: {M}
- Coverage: {M/N * 100}%

## Recommendation

**READY FOR EXECUTION**

{Justification paragraph}

## Sign-Off

- **Auditor:** Claude Opus 4.6
- **Date:** {YYYY-MM-DD}
- **Confidence:** HIGH | MEDIUM | LOW
```

---

## Progress Update Template

Use this to update the user during long audits:

```markdown
## Bead Plan Audit Progress Update

**Time:** {HH:MM}
**Phase:** {current phase}
**Progress:** {X}/{N} beads audited

### Completed
- [x] Phase 0: Input Discovery
- [x] Phase 1: Document Analysis
- [ ] Phase 2: Bead-by-Bead Audit ({X}/{N})

### Current Activity
{What you're doing right now}

### Findings So Far
- Issues found: {N}
- Critical: {X}
- Beads passing: {Y}/{Z}
- Missing coverage: {W} requirements

### Estimated Remaining
{estimate if possible}
```

---

## E2E Test Quality Template (QA Gates)

Use this template for auditing QA gate E2E tests:

```markdown
### QA Gate: {bead-id} - {Phase Name}

#### Tool-to-Medium Matching

| Requirement | Status | Notes |
|-------------|--------|-------|
| Application Type | {Web/Electron/CLI/API} | |
| Required Tool | {correct tool} | |
| Specified Tool | {what bead says} | |
| Match | YES/NO | {issue if no} |

**Tool Reference:**
- Web Apps: `mcp__claude-in-chrome__*` or `mcp__playwright__*`
- Electron Apps: `mcp__circuit-electron__*`
- CLI Tools: Direct bash execution
- APIs: curl/httpie

#### Real Validation Checks

| Check | Present | Notes |
|-------|---------|-------|
| Real screenshots required | YES/NO | Path: {path} |
| Real log capture specified | YES/NO | What: {what} |
| Real UI verification (click/type/verify) | YES/NO | Steps: {N} |
| Full user story scenarios | YES/NO | Not just partial |
| Evidence path specified | YES/NO | Path: {path} |
| Human-grade validation | YES/NO | Would convince a human |

#### Anti-Patterns Found

- [ ] `// TODO: add real test` placeholder
- [ ] Empty test bodies
- [ ] `test.skip()` without explanation
- [ ] Mock-heavy tests (doesn't prove system works)
- [ ] "Element exists" without content verification
- [ ] Tests that pass with broken UI
- [ ] Partial user story (missing error cases)

#### E2E Test Quality Score

| Rating | Criteria |
|--------|----------|
| EXCELLENT | All checks pass, full user stories, evidence specified |
| GOOD | Most checks pass, minor improvements needed |
| POOR | Multiple anti-patterns, missing evidence |
| FAILING | Wrong tool, placeholder tests, no real validation |

**Score:** {EXCELLENT/GOOD/POOR/FAILING}

#### Issues
- Issue #{N}: {description}
```

---

## Evidence Collection Template

Template for specifying evidence collection in QA gates:

```markdown
### Evidence Collection: {test-name}

#### Evidence Directory Structure

```
thoughts/shared/research/qa-{phase}-{test-name}/
├── screenshot-01-initial-state.png
├── screenshot-02-after-action.png
├── screenshot-03-verification.png
├── console-log.txt
├── network-requests.json
└── verification-notes.md
```

#### Screenshot Evidence

| Step | Action | Screenshot | Verification |
|------|--------|------------|--------------|
| 1 | Initial state | `screenshot-01-*.png` | Shows {expected} |
| 2 | After {action} | `screenshot-02-*.png` | Shows {result} |
| 3 | Final verification | `screenshot-03-*.png` | Confirms {outcome} |

#### Log Evidence

**Console Logs:**
```bash
# Capture console logs
# Using Claude Chrome Extension:
mcp__claude-in-chrome__read_console_messages pattern="AgentSession"

# Using Playwright:
mcp__playwright__browser_console_messages

# Using Circuit Electron:
mcp__circuit-electron__browser_console_messages
```

**Expected patterns:**
- `Agent {id} state changed to {state}`
- `Session output stored: {count} bytes`

#### Network Evidence

**Capture requests:**
```bash
# Using Claude Chrome Extension:
mcp__claude-in-chrome__read_network_requests urlPattern="/api/sessions"

# Using Playwright:
mcp__playwright__browser_network_requests
```

**Expected requests:**
- POST /api/sessions/{id}/pause → 200 OK
- GET /api/sessions/{id} → { state: "paused" }

#### Verification Checklist

- [ ] All screenshots captured and saved
- [ ] Console logs show expected messages
- [ ] Network requests returned expected responses
- [ ] Database state verified (if applicable)
- [ ] Evidence organized in correct directory
```

---

## Parallelization Analysis Template

```markdown
## Parallelization Analysis: {Feature Name}

### Task-Level Parallelism by Phase

#### Phase {N}: {Phase Name}

| Task A | Task B | Files Modified | Can Parallelize? | Reason |
|--------|--------|----------------|------------------|--------|
| {id-a} | {id-b} | A: {files}, B: {files} | YES/NO | {reason} |

**Phase Parallelism Score:** {X}% of tasks can run in parallel

### False Sequential Dependencies

| Bead | Depends On | Actually Needs? | Recommendation |
|------|------------|-----------------|----------------|
| {id} | {dep-id} | NO | Remove dependency |
| {id} | {dep-id} | PARTIAL | Split task |

### Phase-Level Parallelism

| Phase A | Phase B | Shared Deps | Can Parallelize? |
|---------|---------|-------------|------------------|
| P4 | P5 | P2 QA Gate | YES - run in parallel |
| P7 | P8 | P4+P5 QA Gates | YES - run in parallel |

### Bottleneck Tasks

| Bead | Blocks | Recommendation |
|------|--------|----------------|
| {id} | {N} downstream tasks | Consider splitting |

### Optimization Recommendations

#### Remove These Dependencies
1. `{bead-id}` → remove dep on `{other-id}`
   - **Reason:** {why this is false dependency}
   - **Command:** `bd update {bead-id} --deps "{remaining-deps}"`

#### Add Parallel Execution Markers
1. P4 and P5 can run in parallel
2. P7 and P8 can run in parallel

#### Consider Splitting
1. `{bead-id}` - large task blocking many downstream
   - **Split into:** {suggested tasks}

### Parallelism Summary

| Metric | Value |
|--------|-------|
| Total tasks | {N} |
| Parallelizable tasks | {M} |
| False sequential deps | {P} |
| Phase parallelism opportunities | {Q} |
| Bottleneck tasks | {R} |
```

---

## Phase Plan Critique Template

```markdown
## Phase Plan Critique: {Feature Name}

### Architectural Order Analysis

| Phase | Dependencies | Architecturally Correct? | Notes |
|-------|--------------|--------------------------|-------|
| P1: {name} | None | YES/NO | {reason} |
| P2: {name} | P1 QA | YES/NO | {reason} |

**Order Issues Found:**
- {issue if any}

### Phase Sizing Analysis

| Phase | Task Count | Parallel Potential | Size Rating |
|-------|------------|-------------------|-------------|
| P1 | {N} | {X}% | RIGHT/TOO_LARGE/TOO_SMALL |

**Sizing Issues:**
- {phase}: Too large, consider splitting
- {phase}: Too small, consider merging with {other}

### Implicit Dependencies

| Task A | Task B | Implicit Dependency | Captured in Beads? |
|--------|--------|---------------------|-------------------|
| {id-a} | {id-b} | Both modify {file} | YES/NO |

**Missing Dependencies to Add:**
- `{bead-id}` should depend on `{other-id}` (file conflict)

### Alternative Approaches

**Current Structure:**
```
P1 → P2 → P3 → P4 → ...
```

**Alternative Considered:**
```
P1 → (P2 + P3 parallel) → P4 → ...
```

**Reasoning:**
{Why current is better, or why alternative would be better}

### Spec Structure Alignment

| Spec Section | Phase | Alignment |
|--------------|-------|-----------|
| §1 | P1 | ALIGNED/MISALIGNED |
| §2 | P2 | ALIGNED/MISALIGNED |

**Alignment Issues:**
- Spec §{X} split across phases {A} and {B} - consider reorganizing

### Recommendations

1. **Phase Order:** {keep/change}
2. **Phase Sizing:** {adjustments}
3. **Missing Dependencies:** {list}
4. **Parallelization:** {opportunities}
```

---

## Fresh Agent Implementability Template

```markdown
## Fresh Agent Implementability Check: {bead-id}

### Context Requirements

| Requirement | Present? | Location |
|-------------|----------|----------|
| SOURCE OF TRUTH WARNING | YES/NO | {line} |
| Spec section reference | YES/NO | §{section} |
| Arch section reference | YES/NO/N/A | §{section} |
| Codebase pattern reference | YES/NO | {file} |
| File list to modify | YES/NO | {count} files |
| Verification steps | YES/NO | {count} steps |

### Self-Containment Test

Ask: "Could I implement this with ONLY the information here (plus spec)?"

| Question | Answer | Notes |
|----------|--------|-------|
| All necessary info included or referenced? | YES/NO | |
| Points to codebase patterns to follow? | YES/NO | e.g., "follow pattern in bridge.ts" |
| Includes "study similar feature first" guidance? | YES/NO | |
| Verification steps are self-contained? | YES/NO | No assumed knowledge |
| Integration context provided? | YES/NO | How it connects to other components |

### Missing Context

What a fresh agent would NOT know:
- {missing context item 1}
- {missing context item 2}

### Recommendations

Add to bead description:
```markdown
## Codebase Patterns to Follow
- Study existing pattern at: apps/core/src/{similar-feature}/service.ts
- Follow naming convention in: packages/shared/src/types.ts

## Integration Context
- This connects to: {component}
- API contract: {reference}
```

### Implementability Score

| Rating | Criteria |
|--------|----------|
| EXCELLENT | Fresh agent could implement with zero questions |
| GOOD | Fresh agent could implement with minor exploration |
| POOR | Fresh agent would struggle, needs significant context |
| FAILING | Fresh agent would fail, missing critical information |

**Score:** {EXCELLENT/GOOD/POOR/FAILING}
```

---

## Spec Drift Detection Template

```markdown
## Spec Drift Detection: {Feature Name}

### Source Documents
- **Spec:** `{path/to/spec.md}` (PRIMARY)
- **TDD:** `{path/to/tdd.md}` (PRIMARY)
- **Strategy:** `{path/to/strategy.md}` (ORDERING ONLY)

### Requirement Coverage Matrix

| Req ID | Description | Spec Section | Covering Bead(s) | AC Match | Status |
|--------|-------------|--------------|-------------------|----------|--------|
| {id} | {desc} | §{section} | {bead-id} | YES/NO | COVERED/UNCOVERED/AC_DRIFT |

**Coverage:** {M}/{N} ({percentage}%)

### TDD Coverage Matrix

| Test ID | Description | Referencing Bead(s) | Status |
|---------|-------------|---------------------|--------|
| {test-id} | {desc} | {bead-id} | ASSIGNED/UNASSIGNED |

**Coverage:** {M}/{N} ({percentage}%)

### Ghost References

| Bead | Referenced Test ID | Exists in TDD? |
|------|--------------------|-----------------|
| {bead-id} | {test-id} | NO (GHOST) |

### Silent Scope Cuts

| Req ID | Description | Resolution |
|--------|-------------|------------|
| {req-id} | {desc} | Add bead / Amend spec |

**Rule:** ZERO scope cuts after audit. Either add bead or amend spec.

### Assumption Violations

| Bead | Assumption Text | Spec Says | Severity |
|------|----------------|-----------|----------|
| {bead-id} | "{assumption}" | §{section}: {spec requirement} | HIGH |

### AC Drift

| Bead | Bead AC | Spec AC | Drift Type | Severity |
|------|---------|---------|------------|----------|
| {bead-id} | "{bead ac}" | "{spec ac}" | WEAKENED/INCOMPLETE/REWRITTEN | HIGH |

### Summary

| Metric | Count | Severity |
|--------|-------|----------|
| Uncovered requirements | {N} | CRITICAL |
| Unassigned TDD tests | {N} | HIGH |
| Ghost references | {N} | MEDIUM |
| Assumption violations | {N} | HIGH |
| AC drift instances | {N} | HIGH |
| **Total drift findings** | **{N}** | |
```

---

## Codebase Study Template

Use this to document codebase patterns before auditing:

```markdown
## Codebase Patterns for Audit: {Feature Name}

### Project Structure

```
{project-root}/
├── apps/
│   ├── cli/          # CLI application
│   │   └── src/
│   │       ├── bridge.ts    # Agent bridge (key pattern)
│   │       └── commands/    # CLI commands
│   └── core/         # Core server
│       └── src/
│           ├── spawn/       # Agent spawning
│           └── ws/          # WebSocket handlers
├── packages/
│   ├── db/           # Database layer
│   ├── shared/       # Shared types and utilities
│   └── swarm-client/ # SDK client
```

### Key Patterns for This Feature

| Pattern | Location | What to Reference |
|---------|----------|-------------------|
| Service class | apps/core/src/{feature}/service.ts | Class structure, DI |
| Route handlers | apps/core/src/{feature}/routes.ts | Express patterns |
| CLI commands | apps/cli/src/commands/{feature}.ts | Commander patterns |
| Types | packages/shared/src/{feature}.ts | Type definitions |
| Tests | apps/core/src/{feature}/*.test.ts | Test patterns |

### Similar Features to Study

| Feature | Location | What to Learn |
|---------|----------|---------------|
| {existing-feature-1} | apps/core/src/{path} | {pattern to copy} |
| {existing-feature-2} | apps/cli/src/{path} | {pattern to copy} |

### Conventions from AGENTS.md

- {convention 1}
- {convention 2}

### Testing Patterns

**E2E Tests:**
- Location: {path}
- Pattern: {description}

**Unit Tests:**
- Location: {path}
- Pattern: {description}

### Questions Beads Should Answer

1. "Follow existing pattern in {file}" - YES/NO
2. "Study similar feature at {path}" - YES/NO
3. "Use conventions from AGENTS.md" - YES/NO
```

---

## SOURCE OF TRUTH WARNING Template

Standard warning to add to all beads:

```markdown
⚠️ SOURCE OF TRUTH WARNING

This bead contains key excerpts but is NOT sufficient for implementation.
You MUST read the referenced spec and architecture sections before implementing.

Source Documents (READ THESE FIRST):
- Spec: `{path/to/spec.md}` §{section} ← PRIMARY
- Arch: `{path/to/arch.md}` §{section} ← supplementary context (if applicable)
- TDD: `{path/to/tdd.md}` §{section} ← PRIMARY (test specifications)
- Strategy: `{path/to/strategy.md}` ← ORDERING ONLY (phase gates, dependency graph)

Codebase Patterns (STUDY THESE):
- Similar feature: `{path/to/similar-feature.ts}`
- Follow pattern in: `{path/to/pattern-file.ts}`
```

