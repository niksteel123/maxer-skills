# Error Manifest — Output Template

The single QA Error Manifest template. Unlike intent-to-handoff (which has Feature/Bug/Refactor templates), error manifests use one forensic template for all defect types. The template scales by including or omitting optional sections.

---

## Template: QA Error Manifest

```markdown
# {Defect Title} — QA Error Manifest

ULTRATHINK and be meticulous. This is a forensic debugging document.

## DEFECT FINGERPRINT

| Field | Value |
|-------|-------|
| **Type** | {data_loss / silent_failure / crash / wrong_behavior / performance / race_condition / integration_mismatch} |
| **Severity** | {critical / high / medium / low} |
| **Reproducibility** | {deterministic / intermittent (N/M) / environment-specific} |
| **Affected Component** | {module::path or file path} |
| **Working Analogue** | {similar operation that works correctly, or "none"} |
| **Scope** | {one-line description of what is broken} |
| **Environment** | {OS, runtime versions, relevant config} |
| **Git State** | {branch, commit hash, clean/dirty} |

---

## REPRODUCTION PROTOCOL

> Follow these steps EXACTLY. You should be able to reproduce the defect in <5 minutes.

### Prerequisites
- {Service/process that must be running}
- {Data/state that must exist}
- {Environment setup if needed}

### Steps

**STEP 1**: {Action description}
```bash
{exact command}
`` `
**EXPECTED**: {what should happen}
**ACTUAL**: {what actually happens}

**STEP 2**: {Action description}
```bash
{exact command}
`` `
**EXPECTED**: {what should happen}
**ACTUAL**: {what actually happens}

{Continue for all reproduction steps...}

### Verification — Confirm Defect Present
```bash
{command that proves the defect exists — e.g., binary search, state check, log grep}
`` `
**OUTPUT**:
```
{exact output proving the defect}
`` `

### Control — Working Analogue (if applicable)
```bash
{same operation through the working path}
`` `
**OUTPUT**:
```
{exact output showing it works}
`` `

---

## EVIDENCE BUNDLE

> Every claim in this manifest is backed by evidence. Evidence items are numbered E{phase}.{n}.

### E0 — Environment Evidence

**E0.1**: {Description}
```bash
{command}
`` `
```
{output}
`` `

{Repeat for each environment evidence item}

### E2 — Reproduction Evidence

**E2.1**: {Description — e.g., "Binary search of event store shows zero project events"}
```bash
{exact command}
`` `
```
{exact output}
`` `

**E2.2**: {Description — e.g., "File size unchanged after operation"}
```bash
{exact command}
`` `
```
{exact output}
`` `

{Repeat for all evidence items}

### E3 — Forensic Evidence

**E3.1**: {Description — e.g., "Working VXG path uses direct append()"}
```{language}
{relevant code snippet with file:line reference}
`` `

**E3.2**: {Description — e.g., "Broken project path uses reserve()→commit()"}
```{language}
{relevant code snippet with file:line reference}
`` `

{Repeat for all forensic evidence}

---

## CODEPATH COMPARISON

> Side-by-side analysis of the working path vs the broken path.

### Working Path: {name}

**Entry point**: `{file}:{function}` (line {n})
**Flow**:
1. `{function_a}()` — {what it does}
2. `{function_b}()` — {what it does}
3. `{store.write()}` — {what it does}

**Key code**:
```{language}
{the critical function body from the working path}
`` `

### Broken Path: {name}

**Entry point**: `{file}:{function}` (line {n})
**Flow**:
1. `{function_a}()` — {what it does}
2. `{function_b}()` — {what it does, highlighting divergence}
3. `{store.write_different()}` — {what it does differently}

**Key code**:
```{language}
{the critical function body from the broken path}
`` `

### Divergence Points

| # | Working Path | Broken Path | Potential Impact |
|---|-------------|-------------|-----------------|
| 1 | {what working does} | {what broken does differently} | {could this cause the defect?} |
| 2 | {what working does} | {what broken does differently} | {could this cause the defect?} |

---

## ROOT CAUSE HYPOTHESES

> Ranked by likelihood. Each hypothesis links to evidence items.

### H1: {Most likely cause} — LIKELIHOOD: HIGH

**Description**: {What is wrong and why}

**Supporting evidence**: {E2.1, E3.2, ...}
**Contradicting evidence**: {E-items, or "none"}

**Verification steps**:
1. {What the debugging agent should do to confirm/reject this hypothesis}
2. {Specific command or code inspection}

**Fix scope**: `{file(s)}:{function(s)}`

### H2: {Second most likely} — LIKELIHOOD: MEDIUM

{Same structure as H1}

### H3: {Third possibility} — LIKELIHOOD: LOW

{Same structure as H1}

---

## INVESTIGATION ROADMAP

> Follow this order. Each step either confirms a hypothesis or redirects to the next.

### Step 1: Verify H1
{Specific instructions — exact code to read, exact values to check, exact commands to run}

**If confirmed** → Proceed to Fix Strategy below
**If rejected** → Proceed to Step 2

### Step 2: Verify H2
{Specific instructions}

**If confirmed** → {fix guidance}
**If rejected** → Proceed to Step 3

### Step 3: Verify H3
{Specific instructions}

**If confirmed** → {fix guidance}
**If rejected** → {Escalation: "The defect is outside the hypothesis space. Re-examine [area] with fresh eyes."}

---

## FIX CONSTRAINTS

1. {What must NOT change — e.g., "The working VXG path must remain untouched"}
2. {Backward compatibility — e.g., "Existing event store data must still be readable"}
3. {Performance — e.g., "Fix must not add latency to the hot path"}
4. {API stability — e.g., "The RPC interface to the frontend must not change"}

---

## ACCEPTANCE CRITERIA

> The fix is complete when ALL of these pass.

### Functional
- [ ] {The operation succeeds AND the side effect is observable — e.g., "project.create RPC writes event to events.redb"}
- [ ] {Data survives restart — e.g., "After swarmd restart, projects are still listed"}
- [ ] {Working analogue still works — e.g., "VXG operations remain functional"}

### Evidence-Based
- [ ] {Binary verification — e.g., "Binary search of events.redb finds `scope_ui_bridge_project` tokens after project creation"}
- [ ] {State verification — e.g., "File size of events.redb increases after project creation"}

### Regression
- [ ] {Existing tests pass: `{test command}`}
- [ ] {Related operations unaffected: `{verification command}`}
- [ ] {No new warnings or errors in logs}

### Test
- [ ] {Regression test exists that fails before fix and passes after}
- [ ] {Test covers the specific codepath that was broken}

---

## FILE MAP

> All files referenced in this manifest.

| File | Role | Lines Referenced |
|------|------|-----------------|
| `{path}` | {role in the defect} | {specific lines if applicable} |

---

## REMINDERS

- ULTRATHINK and investigate thoroughly before writing any fix code.
- Reproduce the defect FIRST. If you can't reproduce it, the manifest may be stale.
- Confirm the root cause before implementing a fix.
- The regression test is as important as the fix itself.
- Check that the working analogue still works after your fix.
- {Additional project-specific gotcha}
```

---

## Section Guidance

### Required sections (always include):
- DEFECT FINGERPRINT
- REPRODUCTION PROTOCOL
- EVIDENCE BUNDLE
- ROOT CAUSE HYPOTHESES
- ACCEPTANCE CRITERIA
- FILE MAP

### Conditional sections:
- **CODEPATH COMPARISON**: Include when a working analogue exists (most powerful debugging signal)
- **INVESTIGATION ROADMAP**: Include when the root cause is not confirmed (hypotheses need verification)
- **FIX CONSTRAINTS**: Include when the fix has non-obvious constraints

### Section scaling:
- **Simple bug** (one function, clear root cause): Fingerprint + Reproduction + Evidence (2-3 items) + Hypotheses (1-2) + Acceptance = ~100-150 lines
- **Cross-module bug** (multiple functions, unclear root cause): All sections, 5-8 evidence items, 3+ hypotheses = ~200-350 lines
- **Architectural bug** (systemic issue, multiple affected paths): All sections expanded, 10+ evidence items, detailed codepath comparison = ~350-600 lines

### Evidence quality standards:
- **GOOD**: `E2.1: Binary search shows 0 occurrences of "project_event"` → `python3 -c '...'` → `0`
- **BAD**: "The database doesn't have the event" (no command, no output)
- **GOOD**: `E3.2: reserve() returns Ok but file size unchanged` → `ls -la events.redb` → `24317952 before` / `24317952 after`
- **BAD**: "The file doesn't change" (no measurement)

### Hypothesis quality standards:
- **GOOD**: "H1: `commit_draft()` retry loop exhausts 3 attempts silently when `actor_tail()` returns stale sequence — EVIDENCE: E3.1 shows retry loop, E2.3 shows no error propagation"
- **BAD**: "H1: Something is wrong with the write path"
