# Beads From Sources — Templates

Ready-to-use templates for creating beads from Spec + TDD + Strategy. All templates embed content verbatim from source documents.

---

## Critical: SOURCE OF TRUTH WARNING

**EVERY bead MUST include this warning at the top of the description:**

```markdown
## SOURCE OF TRUTH WARNING

This bead is a quick-reference derived from:
- **Spec**: `{spec_path}` — §{section} (PRIMARY — read this first)
- **TDD**: `{tdd_path}` — {test_ids} (PRIMARY — test definitions here)
- **Strategy**: `{strategy_path}` — Phase {N} (ordering context only)

Before implementing, you MUST read the referenced spec and TDD sections directly.
This bead embeds key excerpts but the full documents are authoritative.
```

---

## Template: Root Epic

```
bd create "{Project} Implementation" --type epic
```

```markdown
# {Project} Implementation

## SOURCE OF TRUTH WARNING

All beads in this project implement features from:
- **Spec**: `{spec_path}` (PRIMARY)
- **TDD**: `{tdd_path}` (PRIMARY)
- **Strategy**: `{strategy_path}` (ORDERING ONLY)

When implementing any bead:
1. Read the spec section referenced in the bead
2. Read the TDD tests referenced in the bead
3. Use the bead content as a quick reference, NOT as the complete specification
4. The spec + TDD are ALWAYS the source of truth

## Phases

1. **Phase {N}** — {Name} ({X} beads) — Spec §{sections}
2. **Phase {N+1}** — {Name} ({X} beads) — Spec §{sections}
...

## Coverage Summary

- Spec requirements: {N} total → {N} covered (100%)
- TDD tests: {N} total → {N} assigned (100%)
```

---

## Template: Phase Epic

```
bd create "Phase {N}: {Domain Name}" --type epic --parent <root-id>
```

```markdown
# Phase {N}: {Domain Name}

## SOURCE OF TRUTH WARNING

- **Spec**: `{spec_path}` — §{sections for this phase}
- **TDD**: `{tdd_path}` — §{test sections for this phase}
- **Strategy**: `{strategy_path}` — Phase {N}

## Overview

{Brief description of what this phase accomplishes — from spec, not strategy}

## Tasks ({X} total)

1. **T-{N}.1** — {Title} (spec §{section})
2. **T-{N}.2** — {Title} (spec §{section})
...
{X}. **QA Gate** — Phase {N} verification

## Spec Coverage

| Requirement | Bead |
|------------|------|
| §{section} {name} | T-{N}.1 |
| §{section} {name} | T-{N}.2 |
...

## TDD Coverage

| Test Range | Bead |
|-----------|------|
| UT-{prefix}-001..00X | T-{N}.1, T-{N}.2 |
| IT-{prefix}-001..00X | QA Gate |
...

## Dependencies

- **Blocked by:** Phase {N-1} QA Gate
- **Blocks:** Phase {N+1}
```

---

## Template: Implementation Task

```
bd create "T-{N}.{M}: {Title}" --type task --parent <phase-epic-id>
bd update <id> --deps <prerequisite-ids>
bd update <id> --labels "phase-{N},{domain},step-{S}"
```

```markdown
# T-{N}.{M}: {Descriptive Title}

## SOURCE OF TRUTH WARNING

This bead is a quick-reference derived from:
- **Spec**: `{spec_path}` — §{section} (PRIMARY — read this first)
- **TDD**: `{tdd_path}` — {test_ids} (PRIMARY — test definitions here)
- **Strategy**: `{strategy_path}` — Phase {N} (ordering context only)

Before implementing, you MUST read the referenced spec and TDD sections directly.
This bead embeds key excerpts but the full documents are authoritative.

## Context

{1-2 sentences: what this task does and why it matters in the larger system}

## Spec Requirements

### From §{section}: {Section Title}

> {VERBATIM quote from spec — copy-paste directly}
> {Include all relevant paragraphs}

**Acceptance Criteria** (from spec §{section}):
1. {AC-1 — verbatim from spec}
2. {AC-2 — verbatim from spec}
3. {AC-3 — verbatim from spec}
...

{If spec section is >200 lines, embed core requirements and add:}
See spec §{section} for complete details including {what's omitted}.

## Implementation Details

### Files to Create/Modify
- `{path/to/file1}` — {what to create/change}
- `{path/to/file2}` — {what to create/change}

### Architecture Context (from spec §{arch_section})
- {Integration point or pattern — verbatim from spec}
- {Key constraint — verbatim from spec}

### Key Types/Interfaces (from spec §{section})

```{language}
// Verbatim from spec — do not modify
{type definitions, interfaces, signatures from spec}
```

## Tests To Pass

### {test_id}: {Test Title}
**Priority:** {P0/P1/P2} | **Type:** {UT/IT/E2E} | **Subsystem:** {subsystem}

```{language}
// Full pseudo-code from TDD — copy verbatim
{complete test with setup, execute, assert}
```

**Expected Output:** {what success looks like}
**False Positive Prevention:** {how to avoid false passes}

### {test_id_2}: {Test Title 2}
{repeat for each test assigned to this bead}

## Acceptance Criteria

1. {AC from spec — verbatim}
2. {AC from spec — verbatim}
3. All tests pass: {list test IDs}

## Gotchas & Anti-Patterns

1. {Known issue or common mistake — from spec or TDD}
2. {Another gotcha}

## Dependencies

- **Blocked by:** {bead_ids that must complete first}
- **Blocks:** {bead_ids this bead blocks}
- **Phase:** {N} — {phase name}
```

---

## Template: QA Gate

```
bd create "Phase {N} QA Gate" --type task --parent <phase-epic-id>
bd update <id> --deps <all-phase-task-ids>
bd update <id> --labels "phase-{N},qa-gate"
```

```markdown
# Phase {N} QA Gate: {Domain} Verification

## SOURCE OF TRUTH WARNING

This bead is a quick-reference derived from:
- **Spec**: `{spec_path}` — §{sections for this phase} (PRIMARY)
- **TDD**: `{tdd_path}` — IT-{prefix}-*, E2E-{prefix}-* (PRIMARY)
- **Strategy**: `{strategy_path}` — Phase {N} gate criteria (ordering context only)

## Gate Criteria (from strategy)

Phase {N} passes when:
1. {criterion from strategy}
2. {criterion from strategy}
3. {criterion from strategy}

## Prerequisites

All Phase {N} tasks must be complete:
- [ ] {bead_id} — {Task title}
- [ ] {bead_id} — {Task title}
- [ ] {bead_id} — {Task title}

## Integration Tests to Execute

### {test_id}: {Test Title}
**Priority:** {P0/P1} | **Type:** IT | **Subsystem:** {subsystem}

```{language}
// Full test from TDD — copy verbatim
{complete integration test with setup, execute, assert}
```

**Expected Output:** {what success looks like}

### {test_id_2}: {Test Title 2}
{repeat for each IT/E2E test scoped to this phase}

## E2E Tests to Execute

### {e2e_test_id}: {E2E Test Title}
**Priority:** {P0/P1} | **Type:** E2E

```{language}
// Full E2E test from TDD — copy verbatim
{complete E2E test}
```

## Automated Verification

```bash
{build command}
{typecheck command}
{test command with filter for this phase}
{lint command}
```

## Success Criteria

- [ ] All unit tests for Phase {N} pass
- [ ] All integration tests pass: {list IT test IDs}
- [ ] All E2E tests pass: {list E2E test IDs}
- [ ] No TypeScript/compilation errors
- [ ] Ready to proceed to Phase {N+1}
```

---

## Template: Coverage Verification Report

Run this after all beads are created to verify completeness.

```markdown
# Coverage Verification Report

**Feature:** {feature name}
**Date:** {date}
**Beads:** {N} total ({X} epics + {Y} tasks + {Z} QA gates)

## Spec Requirement Coverage

| Requirement | Spec Section | Bead(s) | Status |
|------------|-------------|---------|--------|
| {req_name} | §{section} | {bead_id} | {check or MISSING} |
| {req_name} | §{section} | {bead_id} | {check or MISSING} |
...

**Coverage:** {N}/{N} requirements covered ({percentage}%)
**Uncovered:** {list or NONE}

## TDD Test Assignment

| Test ID | Type | Bead(s) | Status |
|---------|------|---------|--------|
| {test_id} | {UT/IT/E2E} | {bead_id} | {check or UNASSIGNED} |
| {test_id} | {UT/IT/E2E} | {bead_id} | {check or UNASSIGNED} |
...

**Coverage:** {N}/{N} tests assigned ({percentage}%)
**Unassigned:** {list or NONE}

## Drift Check

Spot-checked {N} random beads:
- {bead_id}: AC matches spec {check}, tests match TDD {check}
- {bead_id}: AC matches spec {check}, tests match TDD {check}
...

**Drift detected:** {list or NONE}

## Bead Size Statistics

- Min: {N} chars ({bead_id} — {reason if thin})
- Max: {N} chars ({bead_id})
- Avg: {N} chars
- Median: {N} chars
- Thin beads (<5000 chars): {N} ({scope-appropriate? list them})

## Verdict

{PASS or FAIL — with reason}
```

---

## Template: Bead Description Metadata

These metadata fields help with querying and filtering:

```yaml
labels:
  - "phase-{N}"           # Phase number
  - "{domain}"            # Domain area (transport, ui, service, etc.)
  - "step-{S}"            # Step number (if multi-step build strategy)
  - "spec-{section}"      # Spec section reference

metadata:
  spec_section: "{section}"
  tdd_tests: ["{test_id_1}", "{test_id_2}"]
  strategy_phase: "{N}"
  source_of_truth_warning: true
  files_to_modify:
    - "{path/to/file.ts}"
```

---

## Quick Reference: Content Rules

| Content Type | Source | How to Embed |
|-------------|--------|-------------|
| Requirements | Spec | Verbatim quote with `>` blockquote and §citation |
| Acceptance criteria | Spec | Verbatim numbered list with §citation |
| Type definitions | Spec | Verbatim code block with §citation |
| Architecture patterns | Spec | Verbatim or summarized with §citation |
| Test assertions | TDD | Verbatim full pseudo-code with test ID |
| Test setup | TDD | Verbatim or summarized with test ID |
| Phase ordering | Strategy | Reference only ("Phase {N}, depends on Phase {N-1} gate") |
| Gate criteria | Strategy | Short list of pass/fail conditions |
| Task descriptions | **SPEC ONLY** | Never from strategy — strategy has no task descriptions |
| Effort estimates | **NOWHERE** | Beads do not contain effort estimates |

---

## Anti-Pattern Checklist

Before finalizing any bead, verify it does NOT:

- [ ] Paraphrase spec content instead of quoting verbatim
- [ ] List test IDs without their full assertions
- [ ] Copy task descriptions from the strategy document
- [ ] Include effort estimates or timeline predictions
- [ ] Scope out spec requirements as "post-MVP" or "future work"
- [ ] Reference a "phase plan" document (those don't exist in the 3-SOT model)
- [ ] Use the strategy as a content source (it's ordering only)
- [ ] Leave any spec requirement uncovered by a bead
- [ ] Leave any TDD test unassigned to a bead
