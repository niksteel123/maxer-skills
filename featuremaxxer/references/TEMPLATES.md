# Featuremaxxer — Output Templates

## Feature Optimization Template

```markdown
# {PROJECT} — Feature Optimization: {Feature_Name}

## Your Mission

You are performing a deep architecture review AND implementation strategy
analysis for {feature_name_description} in the {PROJECT} project.

You have TWO deliverables:

1. **Improved feature doc** — edit `{feature_doc_path}` in place with targeted
   improvements (NOT a rewrite — surgical fixes to weak sections only)
2. **Implementation & testing strategy** — saved to
   `{output_dir}/implementation-strategy.md` (temporary artifact consumed
   during beads creation, then discarded)

You are NOT implementing anything. You are reading, analyzing, improving, and
strategizing.

Think of yourself as the principal engineer who gets final sign-off before any
code is written. You must understand the feature deeply AND understand how it
integrates into the existing codebase. Your strategy must be grounded in real
files, real types, and real tests — not abstract module names.

---

## Governing Principle

{governing_principle_description}

{refactoring_constraints}

If you find a simpler, more correct way to achieve the same outcome — propose
it. The feature doc is the starting direction, not a frozen blueprint.

### CARDINAL RULE: ZERO SCOPE DRIFT

**If it's in the spec, it gets implemented. No exceptions.**

Your job is to IMPROVE the quality, clarity, and implementability of the spec.
It is NEVER to reduce scope. You may improve HOW a feature is implemented,
resequence WHEN features are built, strengthen vague language, or flag genuine
contradictions with proposed SOLUTIONS. You may NEVER:

- Remove features from the spec
- Defer features to "post-MVP," "Phase 2+," or any non-existent future iteration
- Label spec features as "nice to have," "stretch goal," or "out of scope"
- Reduce acceptance criteria below what the spec defines
- "Simplify" by dropping features instead of improving approach

Phases in the implementation strategy are EXECUTION ORDER — they determine
WHEN things are built, not WHETHER they are built. Every phase ships. Later
phases get the same depth of treatment as early phases.

---

## Source-of-Truth Hierarchy

```text
Feature doc > layer docs  (for the feature's domain)
Layer docs  = existing system context (what the feature integrates into)
Codebase    = ground truth for what exists today
```

If the feature doc and layer docs contradict on the feature, the feature doc
wins. If the feature doc assumes infrastructure that doesn't exist, that's a
finding worth flagging.

{IF_IMPLEMENTATION_CONTEXT}
---

## Current Implementation Context

{implementation_state_description}

This matters because:

- the feature must build on what actually exists, not what the docs describe
- integration surfaces must be verified against real code, not assumed
- test infrastructure availability constrains the testing strategy
{END_IF}

---

## What To Read (Do This First)

### Feature Document (PRIMARY — read fully)
```text
{feature_doc_path} ({line_count} lines)
```

{feature_doc_reading_notes}

### Architecture / Layer Docs (EXISTING SYSTEM CONTEXT)
```text
{architecture_doc_paths_with_focus_notes}
```

Read for: integration surfaces, existing invariants, decisions that constrain
the feature.

### Codebase — Integration Surfaces (STUDY CAREFULLY)
```text
{codebase_surface_paths_with_reading_strategy}
```

{codebase_reading_notes}

### Test Suite (STUDY FOR TESTING STRATEGY)
```text
{test_file_paths_with_notes}
```

{test_suite_reading_notes}

---

## Think Independently (CRITICAL)

After reading everything, your process should be:

1. Absorb the architecture. Let it marinate.
2. Generate YOUR OWN questions — the uncomfortable ones.
3. Research externally where YOUR analysis identifies gaps.
4. Think about what's missing entirely.
5. Challenge the approach itself — what would an adversary architect do differently?

These docs have been through reviews. The surface-level issues are already
fixed. What remains are deep, non-obvious insights:

- Design tensions that look fine in isolation but conflict under load
- Integration points where the feature doc's model doesn't match the codebase
- Testing gaps where mock-only coverage would hide real bugs
- Simplifications nobody has considered because the current approach "works"
- Performance or security implications that emerge only at the intersection
- Alternative approaches that weren't chosen — and whether the choice is actually right

Trust your instincts — if something feels off, chase that feeling.

### Architecture Tensions to Investigate

These tensions were identified during codebase analysis. They are NOT questions
for you to answer verbatim — they're thinking catalysts pointing at the deepest
architectural fault lines. The resolution may be correct. Or it may create
downstream problems. That's what you're here to find out.

{architecture_tensions_from_phase1}

For each tension: consider the current resolution, stress-test it against the
codebase reality, and determine whether it holds or breaks under implementation
pressure.

---

## Non-Negotiables (Don't Question These)

{non_negotiables_organized_by_category}

Everything else is fair game for questioning.

---

## Improvement Directives

### What to do with the feature doc:

- Strengthen weak technical sections (vague descriptions → precise specs)
- Add missing risk/trade-off analysis
- Correct technical errors found during codebase study
- Tighten verbose prose where it obscures meaning
- Ensure self-consistency within the doc
- Flag integration assumptions that don't match the codebase

### What NOT to do:

- Don't rewrite strong sections for the sake of it
- Don't add fluff or ceremonial prose
- Don't make code changes
- Don't change non-negotiables
- Don't turn the feature doc into an implementation plan
- **Don't remove, defer, or scope-down ANY feature defined in the spec**
- **Don't label anything as "post-MVP," "Phase 2+," "nice to have," or "stretch goal"**
- **Don't reduce acceptance criteria below what the spec defines**
- **Don't "simplify" by dropping features — simplify the APPROACH, not the feature set**

---

## Implementation Strategy Deliverable (REQUIRED)

You MUST also produce: `{output_dir}/implementation-strategy.md`

This document is explicitly temporary — it will be consumed during beads
creation and then discarded. It should contain:

### 1. Integration Surface Map

For each file/module the feature touches:

```
| File/Module | Current Purpose | Required Change | Complexity | Dependencies |
|-------------|-----------------|-----------------|------------|--------------|
```

### 2. Sequencing Analysis

- What must be built first? (foundational types, shared infrastructure)
- What can be built in parallel? (independent tracks with clear boundaries)
- What must come last? (integration tests, E2E gates)
- Critical path items

### 3. Dependency Spine

**IMPORTANT: Phases are EXECUTION ORDER, not importance tiers. Every phase
listed here MUST be implemented — later phases get the same depth and rigor
as early phases. No phase may be labeled "post-MVP," "stretch," or "optional."
If it's in the spec, it's in a phase, and that phase ships.**

```
Phase 1: {foundational_work}
  → Phase 2a: {parallel_track_1}  |  Phase 2b: {parallel_track_2}
    → Phase 3: {integration_and_testing}
      → Phase 4: {final_qa_gates}
```

### 4. Testing Strategy

**Existing tests to update:**
- `{test_file}`: {what changes} ({reason})

**New tests to create:**
- {description}: {what it validates} ({type})

**E2E / real-runtime gates:**
- {flow}: {runtime infrastructure required}

**Test infrastructure gaps:**
- {gap}: {what needs creation}

### 5. Risk Assessment

Technical, integration, and testing risks with severity and mitigation.

---

## What a Great Outcome Looks Like

Not generic praise. Not restating the docs in different words.

- Questions nobody has asked yet
- Connections nobody has made yet
- Risks nobody has identified yet
- Simplifications nobody has considered yet
- Integration conflicts nobody has noticed yet
- A testing strategy grounded in real test files and real infrastructure

{project_specific_success_criteria}

---

## Deliverable

Output:

1. Edited feature doc (targeted improvements, not a rewrite)
2. `{output_dir}/implementation-strategy.md` with all 5 sections above
3. A concise change summary listing:
   - What was improved in the feature doc and why
   - Key findings from the codebase study
   - Implementation strategy rationale
   - Any open questions or risks that need resolution

---

## Follow-Up Pass (Queue After Main Work)

> Send this as a follow-up message in the same session after the optimization
> is complete.

Now re-read the feature doc AND the implementation strategy with completely
"fresh eyes." Use ultrathink. Verify:

- Strategy is implementable against the actual codebase (not imaginary surfaces)
- Testing strategy covers all integration surfaces from the surface map
- No non-negotiable was accidentally violated in the feature doc edits
- The sequencing analysis has no circular dependencies
- The dependency spine can actually be executed as described
- Parallel tracks have genuinely independent file ownership
- **SCOPE PRESERVATION CHECK (MANDATORY):** Enumerate every feature/subsystem
  in the ORIGINAL spec. Verify that NONE were removed, deferred, or labeled
  "post-MVP"/"Phase 2+". Every spec feature must appear in the strategy's
  dependency spine. If any feature is missing, this is a BLOCKING failure —
  add it back before proceeding.
- **No scope-reduction language:** Scan for "post-MVP," "Phase 2+," "stretch
  goal," "nice to have," "out of scope," "future iteration." If found,
  remove and replace with proper execution-order phasing.
- {specific_fresh_eyes_verification_items}

If anything doesn't hold up, fix it now. This is the last quality gate before
beads creation.
```

---

## Beads Creation Template

```markdown
# {PROJECT} — Beads Creation: {Feature_Name}

## Your Mission

You are converting {feature_name_description} into executable work orders
(beads). Each bead must be self-contained — the agent implementing a bead
should NOT need to read the feature doc.

Think of yourself as a principal engineer breaking down a feature into
parallelizable, dependency-correct work packages. Each package must contain
everything an implementation agent needs: background, current-state context,
target behavior, exact files/types/functions, testing requirements, and
acceptance criteria.

This is a cross-cutting feature that touches {scope_description}.

---

{IF_IMPLEMENTATION_CONTEXT}
## Implementation Context

{implementation_state_description}

Practical consequence: do NOT build against imaginary infrastructure. If a bead
depends on something that doesn't exist yet, it must either create it or
explicitly depend on a bead that does.
{END_IF}

---

## Mandatory Pre-Bead Research (Do NOT Skip)

Before creating a single bead, you must:

1. **Read the optimized feature doc fully**
   ```text
   {feature_doc_path}
   ```

2. **Read the implementation strategy fully**
   ```text
   {strategy_path}
   ```

3. **Study the codebase integration surfaces**
   ```text
   {codebase_surface_paths}
   ```

4. **Study the existing test suite**
   ```text
   {test_file_paths}
   ```

5. **Produce a private implementation map** before creating beads:
   - What can be parallelized (independent file surfaces)
   - What must be sequential (type/API dependencies)
   - Which tests must be rewritten (breaking changes)
   - Which new tests must be added (new behavior)
   - Which real-runtime harnesses exist vs must be created

---

## Bead Creation Goals

Every bead must be:

- **Self-contained**: implementation agent reads ONLY the bead
- **Implementation-ready**: exact files, types, functions — no hand-waving
- **Dependency-correct**: if A depends on B, the dependency is encoded
- **Parallelized where safe**: independent surfaces are separate beads
- **TDD-first**: testing requirements embedded, not deferred
- **Architecture-preserving**: respects existing patterns and conventions
- **Test-harness-aware**: real-runtime validation, not mock-only

**CARDINAL RULE: 100% SPEC COVERAGE**

The bead graph must cover EVERY feature defined in the spec. No feature may be
deferred, dropped, or labeled "post-MVP." Phases in the bead hierarchy are
EXECUTION ORDER — they determine WHEN things are built, not WHETHER they are
built. Every phase ships. If the strategy document has N phases, the bead graph
must have beads for ALL N phases, not just the early ones.

If you find yourself thinking "this can be added later" — stop. If it's in the
spec, it gets a bead NOW. The only valid reason to exclude a spec feature from
the bead graph is a genuine technical impossibility, which must be flagged with
a proposed SOLUTION, not a cut.

---

## Suggested Bead Hierarchy

{suggested_bead_hierarchy_from_strategy}

This is a SUGGESTION based on the implementation strategy. You may restructure
if your analysis reveals a better decomposition, but you must preserve the
dependency spine and parallel-track boundaries.

Explicitly encode parallel/sequential decisions into bead dependencies. If two
beads CAN run in parallel, they should have no dependency between them. If they
MUST be sequential, the dependency must be explicit.

---

## Bead Quality Standard

Every bead must contain AT MINIMUM:

```
BACKGROUND:
  What this bead implements and why.
  Enough context that the agent understands the purpose without reading
  the feature doc.

CURRENT STATE:
  What the relevant code looks like TODAY.
  Specific files, types, functions with current behavior.

TARGET BEHAVIOR:
  What the code should look like AFTER this bead.
  Specific changes to specific files/types/functions.

IMPLEMENTATION DETAIL:
  Exact files to modify/create.
  Exact types/functions/traits to add/change.
  Exact module structure changes.
  Exact import/dependency changes.
  Code patterns to follow (reference exemplar files).

TESTING DETAIL:
  Tests to rewrite: {test_file} — {what changes}
  Tests to add: {test_description} — {type: unit/integration/E2E}
  Real-runtime validation: {what must be verified against live infrastructure}
  Regression gates: {existing tests that must still pass}

ACCEPTANCE CRITERIA:
  Specific, verifiable conditions for this bead to be "done."
  Include both implementation criteria and test criteria.

DEPENDENCIES:
  Beads that must complete before this one can start.
  Reason for each dependency.
```

**Never say "see the feature doc" — embed the context directly.**

---

## Testing Requirements Embedded in Beads

This is a fast-tracked pipeline — there is no separate TDD stage. Testing is
embedded in every bead.

Every bead touching the feature must carry:

1. **Which existing tests to rewrite** (file paths, what changes, why)
2. **Which new tests to add** (description, type, what they validate)
3. **Regression gates** (tests that must still pass after this bead)
4. **Real-runtime validation** (E2E flows against actual infrastructure)

Mock/unit tests are useful canaries but NOT authoritative for runtime-facing
work. Every integration surface must have a real-runtime validation path.

{IF_BEAD_TOOL}
---

## Tooling

{bead_tool_commands_and_usage}
{END_IF}

---

## What a Great Outcome Looks Like

- Bead tree mirrors the feature architecture cleanly
- Foundational work sequenced before dependent work
- Every bead is self-contained (no "see the doc" references)
- Testing requirements are per-bead, not a separate "testing phase"
- Parallel tracks have clear file-ownership boundaries
- An implementation session can execute without reopening the feature doc
- {project_specific_success_criteria}

---

## Follow-Up Pass (Queue After Main Work)

> Send this as a follow-up message in the same session after the beads are
> created.

Now re-read the feature doc AND every bead with completely "fresh eyes." Use
ultrathink. Perform:

1. **Self-containment check**: Pick any bead at random. Could an agent
   implement it without reading anything else? If not, it's not ready.

2. **Dependency correctness check**: Trace the dependency graph. Are there
   circular dependencies? Missing dependencies? Unnecessary sequential
   constraints?

3. **Testing completeness check**: Does every integration surface have a bead
   that includes its testing requirements? Are there untested paths?

4. **File/symbol accuracy check**: Are all file paths real? Are all
   type/function names accurate against the current codebase?

5. **Coverage check (MANDATORY — BLOCKING)**: Does the bead tree cover the
   ENTIRE feature? Build an explicit mapping:

   ```
   For EVERY feature/subsystem in the spec:
     Spec feature → bead ID(s) that implement it
   ```

   If ANY spec feature has ZERO corresponding beads, this is a BLOCKING
   failure. Create the missing beads before proceeding. No feature may be
   deferred to a future phase that doesn't exist in the bead graph.

6. **Scope drift scan**: Search all beads for these red-flag phrases:
   "post-MVP," "Phase 2+," "stretch goal," "nice to have," "future
   iteration," "out of scope," "can be added later." If found, remove and
   replace with proper implementation content. Phases are execution order,
   not importance tiers.

Fix any issues found. {additional_followup_instructions}
```

---

## Beads Optimization Template

```markdown
# {PROJECT} — Beads Optimization: {Feature_Name}

## Your Mission

You are performing a meticulous bead-by-bead QA audit of the {feature_name}
implementation beads. Your job is to find and fix every issue before execution
agents start implementing.

Think of yourself as the architect who reviews every work order before sending
them to the build crews. A vague, inaccurate, or dependency-confused bead
wastes implementation time and produces bugs.

**Standard:** If two different agents could read the same bead and make
materially different implementation decisions, that bead is not ready.

---

## What To Read (Do This First)

### Feature Document
```text
{feature_doc_path}
```

### Implementation Strategy
```text
{strategy_path}
```

### Bead Graph
```text
{bead_graph_location_or_command}
```

### Codebase (spot-check where beads reference specific files)
```text
{codebase_root}
```

---

## Audit Dimensions

### 1. Self-Containment Audit

For EVERY task bead:

- Could an agent implement this WITHOUT reading the feature doc?
- Are exact files and symbol names included (not module-level hand-waving)?
- Are testing requirements included per-bead (not "see the testing strategy")?
- Does the bead explain the "why" — enough context that the agent understands
  purpose?
- Are acceptance criteria specific and verifiable?

**Red flag:** Any bead that says "see the feature doc," "refer to the
architecture doc," or "follow the pattern from X" without embedding the
relevant content.

### 2. Dependency Audit

For the ENTIRE bead graph:

- Is the sequencing correct? (foundational → core → integration → QA)
- Are parallel tracks genuinely independent? (no shared files without
  coordination)
- Are there missing dependencies? (bead uses types/APIs from another bead
  but doesn't depend on it)
- Are there fake dependencies? (beads marked sequential that could actually
  run in parallel)
- Is the critical path optimal? (no unnecessary serialization)

### 3. Technical Accuracy Audit

For EVERY bead that references code:

- Are file paths real and current?
- Are type/function/trait names accurate?
- Does the "current state" section match what the code actually looks like?
- Does the "target behavior" section reflect the feature doc's architecture?
- Are code patterns referenced consistent with the codebase's conventions?

### 4. Testing Audit

For EVERY bead:

- Are existing tests to rewrite named explicitly (file paths)?
- Are new tests described specifically enough to implement?
- Is real-runtime validation required where appropriate?
- Is the bead NOT accidentally relying on mock-only coverage for
  runtime-facing work?
- Are regression gates listed (tests that must still pass)?

{project_specific_testing_audit_items}

### 5. Platform / Surface Coverage Audit

{platform_coverage_items_from_phase1}

Verify:
- All integration surfaces from the strategy are covered by at least one bead
- No significant codebase module is orphaned (touched by the feature but
  missing from the bead graph)
- Cross-cutting concerns have explicit beads (not assumed to be handled
  "along the way")

### 6. Scope Drift Detection Audit (MOST CRITICAL DIMENSION)

**This is the single most important audit dimension.** Scope drift — where
spec features are silently deferred or dropped — is the #1 failure mode of
the entire pipeline.

**Scan ALL beads for these red-flag phrases:**
- "post-MVP," "Phase 2+," "stretch goal," "nice to have"
- "future iteration," "out of scope," "can be added later"
- "simplified for initial implementation," "deferred to"
- Any language that implies a spec feature won't be implemented

**If found:** This is a BLOCKING failure. Remove the scope-reduction language
and replace with full implementation content. If the bead was deliberately
thinned because someone decided the feature "wasn't important enough," that
decision was wrong — the spec is the contract.

**Verify phase coverage equality:**
- Count beads per strategy phase. If later phases have significantly fewer
  beads than early phases, investigate why. Later phases should NOT be
  treated as less important.
- Every strategy phase must have full-depth beads, not thin stubs.

### 7. Coverage Matrix Audit

Build these mappings and verify completeness:

```
Feature subsystem → bead(s) that implement it
Integration surface → bead(s) that touch it
Test requirement → bead(s) that include it
Architecture decision → bead(s) that implement it
```

Flag any feature subsystem, integration surface, test requirement, or
architecture decision that has NO corresponding bead.

**100% spec coverage is MANDATORY.** If any spec feature has zero
corresponding beads, this is a BLOCKING failure. Create the missing beads
before proceeding. Do not defer them to a future iteration.

### 8. Fix and Follow-Up Fresh-Eyes Pass

Fix every issue found in dimensions 1-7:

- Thin beads → add missing detail
- Vague beads → replace with specific files/types/functions
- Dependency-confused beads → correct the dependency graph
- Missing beads → create new beads to fill coverage gaps
- Mock-only beads → add real-runtime validation requirements

After all fixes, re-read every bead one more time with fresh eyes.

Ask yourself: "If I were an implementation agent seeing this bead for the
first time, would I know EXACTLY what to build, EXACTLY what to test, and
EXACTLY when I'm done?"

If the answer is no for any bead, fix it now.

{additional_audit_instructions}
```

---

## Execution Kickoff Template

```markdown
# {PROJECT} — Execution Kickoff: {Feature_Name}

> For fresh agents starting implementation. Read this FIRST.

---

## Mission

You are implementing the {feature_name} feature from the bead graph.
{scope_description}

Work from the bead graph. Claim task beads, not epics. Each bead is
self-contained — implement from the bead alone.

---

## Root Bead: {root_epic_id} — {root_epic_title}

{phase_epics_with_bead_ids_and_task_counts}

Total: {total_bead_count} beads across {epic_count} epics.

---

{IF_IMPLEMENTATION_CONTEXT}
## Implementation Boundary

**EXISTS (build on top of):**
{existing_infrastructure_description}

**DOES NOT EXIST (you're building):**
{new_feature_description}

**Do NOT assume unbuilt infrastructure exists.** If a bead depends on
something that isn't built yet, check the dependency graph — the prerequisite
bead should build it.
{END_IF}

---

## Core Contracts / Non-Negotiables

{core_contracts_from_feature}

If code conflicts with this contract, the contract wins.

---

## Source of Truth Loading (MANDATORY — Read Before Starting ANY Implementation)

Read these in order before starting:

1. **AGENTS.md** — agent guidelines, rules, coordination
   ```text
   {agents_md_path}
   ```

2. **Feature doc** — architecture context (NOT your work orders)
   ```text
   {feature_doc_path}
   ```

3. **Implementation strategy** — sequencing and integration surface map
   ```text
   {strategy_path}
   ```

4. **Architecture docs** — existing system context
   ```text
   {architecture_doc_paths}
   ```

5. **Bead graph** — your ACTUAL work orders
   ```text
   {bead_graph_location_or_command}
   ```

6. **Key integration surfaces** — study for patterns
   ```text
   {key_codebase_files_with_descriptions}
   ```

---

## AgentMail Setup (Do This ONCE At Session Start)

```
# 1. Register with the project
ensure_project(project_key="{project_path}")
register_agent(project_key, program="claude-code", model="opus",
  task_description="{feature_name} implementation")

# 2. Set contact policy — accept messages from any agent in this project
set_contact_policy(project_key, agent_name, policy="open")

# 3. Check inbox for any messages from prior sessions or other agents
fetch_inbox(project_key, agent_name, limit=20)
```

Read and acknowledge any pending messages before starting work. If another
agent left a blocker notice, address it first.

---

## Bead Completion Policy (CRITICAL)

**You MUST fully complete every bead you claim.** No partial completion.
No "I'll finish this later." No moving on to another bead while one is
in progress.

A bead is COMPLETE when:
1. All code changes described in the bead are implemented
2. All tests described in the bead pass
3. All build/lint/test verification commands pass (zero warnings)
4. Code is committed with proper message (bead ID prefix)
5. Bead is marked complete
6. Completion announced via AgentMail
7. File reservations released

**If you hit a blocker during a bead:**
- DO NOT abandon the bead and move to another track
- DO NOT mark it complete with missing pieces
- DO NOT do mid-way commits of incomplete work
- Diagnose the blocker. Read the error. Understand the root cause.
- Fix the blocker yourself — you have the full codebase available
- If the blocker is in a DIFFERENT bead's code (not yours), announce the
  specific issue in AgentMail with file path, line number, and what's wrong,
  then wait for resolution
- Only if genuinely impossible to resolve (missing infrastructure not in
  your bead) should you report it and move on

---

## Work Loop

```
ONE-TIME SETUP:
  1. AgentMail registration (see above)
  2. Read AGENTS.md + feature doc + strategy
  3. {bead_cli} ready --json → understand the bead graph

MAIN LOOP (repeat until all beads complete):

  ┌─ PICK ──────────────────────────────────────────────────────────┐
  │ {bead_cli} ready --json                                          │
  │ Pick the highest-priority ready bead.                            │
  │ Read the bead description FULLY before touching any code.        │
  └──────────────────────────────────────────────────────────────────┘
           │
  ┌─ CLAIM + ANNOUNCE ──────────────────────────────────────────────┐
  │ {bead_cli} claim <bead-id>                                       │
  │                                                                  │
  │ file_reservation_paths(                                          │
  │   project_key="{project_path}",                                  │
  │   agent_name=<your-name>,                                        │
  │   paths=[<files this bead touches>],                             │
  │   ttl_seconds=3600,                                              │
  │   exclusive=true,                                                │
  │   reason="<bead-id>"                                             │
  │ )                                                                │
  │                                                                  │
  │ send_message(                                                    │
  │   project_key="{project_path}",                                  │
  │   from_agent=<your-name>,                                        │
  │   thread_id="<bead-id>",                                         │
  │   subject="[<bead-id>] Start: <bead title>",                     │
  │   body="Claiming bead. Files: <list>. Starting implementation."  │
  │ )                                                                │
  └──────────────────────────────────────────────────────────────────┘
           │
  ┌─ IMPLEMENT (TDD) ──────────────────────────────────────────────┐
  │ 1. Study the target files — understand current state             │
  │ 2. Write tests FIRST (from test IDs in the bead)                │
  │ 3. Implement the feature code to make tests pass                 │
  │ 4. Iterate until ALL tests pass and ALL acceptance criteria met  │
  │                                                                  │
  │ DO NOT cut corners. DO NOT skip tests. DO NOT leave TODOs.       │
  │ DO NOT do mid-way commits of incomplete work.                    │
  │ The bead defines what "done" means — implement ALL of it.        │
  └──────────────────────────────────────────────────────────────────┘
           │
  ┌─ VERIFY ────────────────────────────────────────────────────────┐
  │ # MUST ALL PASS — fix any failures before proceeding             │
  │ {build_cmd}                                                      │
  │ {lint_cmd}                                                       │
  │ {test_cmd}                                                       │
  │                                                                  │
  │ If ANY command fails → fix the issue → re-verify.                │
  │ Never proceed with failing checks.                               │
  └──────────────────────────────────────────────────────────────────┘
           │
  ┌─ COMMIT ────────────────────────────────────────────────────────┐
  │ # Stage only the files this bead touches — not unrelated files   │
  │ git add <specific-files>                                         │
  │                                                                  │
  │ # Commit message format:                                         │
  │ git commit -m "<bead-id>: <short description of what was done>"  │
  │                                                                  │
  │ # DO NOT push unless explicitly told to.                         │
  │ # One commit per bead. If the bead is large, multiple commits    │
  │ # are acceptable but each must pass all checks independently.    │
  └──────────────────────────────────────────────────────────────────┘
           │
  ┌─ COMPLETE + RELEASE ────────────────────────────────────────────┐
  │ {bead_cli} complete <bead-id>                                    │
  │ {bead_cli} sync --flush-only                                     │
  │                                                                  │
  │ send_message(                                                    │
  │   project_key="{project_path}",                                  │
  │   from_agent=<your-name>,                                        │
  │   thread_id="<bead-id>",                                         │
  │   subject="[<bead-id>] Complete: <bead title>",                  │
  │   body="Bead complete. Commit: <hash>. All checks pass."         │
  │ )                                                                │
  │                                                                  │
  │ release_file_reservations(                                       │
  │   project_key="{project_path}",                                  │
  │   agent_name=<your-name>                                         │
  │ )                                                                │
  └──────────────────────────────────────────────────────────────────┘
           │
        LOOP → back to PICK
```

**Use debug builds for fast iteration** — only use release profile for final validation.

---

## Verification Commands

{build_lint_test_commands_per_surface}

**Real-runtime rule:** Mock/unit tests are canaries, not proof. For
runtime-facing work, real acceptance requires E2E tests against actual running
infrastructure.

{specific_test_commands_per_lane}

---

## File-Surface Map by Lane

{file_surface_map_per_epic}

Stay within your lane's file surface. If a bead requires files outside your
lane, check dependencies — another lane's bead should handle those files.

---

## Dependency Spine

{dependency_spine_visualization}

Trust `{bead_cli} ready`, but use this spine as your mental model for what
comes first, what's parallel, and what's last.

---

## AgentMail Quick Reference

```
# Check inbox (do this at start of session and between beads)
fetch_inbox(project_key, agent_name, limit=10)

# Claim bead
send_message(thread_id="<bead-id>", subject="[<bead-id>] Start: <title>")

# Complete bead
send_message(thread_id="<bead-id>", subject="[<bead-id>] Complete: <title>",
  body="Commit: <hash>. All checks pass.")

# Report blocker (only if you truly cannot fix it yourself)
send_message(thread_id="<bead-id>", subject="[<bead-id>] BLOCKED: <issue>",
  body="File: <path>, Line: <N>. Issue: <desc>. Needed: <what would unblock>")

# Release files
release_file_reservations(project_key, agent_name)
```
```

---

## Execution Push Template

```markdown
# {PROJECT} — Execution Push: {Feature_Name}

> For continuing agents. Compact reminder of contracts, work loop, and verification.

---

## Re-Orient

1. Re-read `{agents_md_path}` — agent rules and coordination
2. Feature: {feature_name} — {one_line_description}
3. Feature doc: `{feature_doc_path}`
4. Strategy: `{strategy_path}`
5. Bead graph: `{bead_cli} ready --json`

---

## Core Contracts

{core_contracts_compact}

---

## Bead Completion Policy

**Every bead you claim MUST be fully completed.** No partial work. No TODOs.
No "finish later."

Complete means: all code implemented + all tests pass + all checks pass +
committed + announced.

**If you hit a blocker:** Diagnose it. Fix it yourself. Only escalate via
AgentMail if the blocker is in another agent's code that you cannot modify.
Do NOT abandon the bead.

---

## Work Loop

```
1. Check inbox (fetch_inbox) → acknowledge any messages
2. {bead_cli} ready --json → pick highest-priority ready bead
3. Read bead FULLY → study target files
4. CLAIM:
   {bead_cli} claim <bead-id>
   file_reservation_paths(paths=[<files>], ttl_seconds=3600,
     exclusive=true, reason="<bead-id>")
   send_message(thread_id="<bead-id>",
     subject="[<bead-id>] Start: <title>")
5. IMPLEMENT: TDD — test first, then code. Implement ALL of it.
   No mid-way commits. No partial work.
6. VERIFY: {build_cmd} + {lint_cmd} + {test_cmd} (ALL must pass)
7. COMMIT:
   git add <specific-files>
   git commit -m "<bead-id>: <short description>"
   (do NOT push unless told to)
8. COMPLETE:
   {bead_cli} complete <bead-id>
   {bead_cli} sync --flush-only
   send_message(thread_id="<bead-id>",
     subject="[<bead-id>] Complete: <title>",
     body="Commit: <hash>. All checks pass.")
   release_file_reservations(agent_name)
9. LOOP → back to step 1

Do not stop to ask what to work on next. Pick the next ready bead.
```

---

## Verification (Every Bead)

Use debug builds for fast iteration. Fix ALL failures before committing.

{build_lint_test_commands_compact}

**Real-runtime rule:** Mock-only is not proof for runtime-facing work.

---

## Dependency Spine

{dependency_spine_compact}

---

## File Surfaces by Lane

{file_surface_map_compact}

---

## AgentMail Quick Reference

```
# Check inbox (between beads)
fetch_inbox(project_key, agent_name, limit=10)

# Claim bead
send_message(thread_id="<bead-id>",
  subject="[<bead-id>] Start: <title>")

# Complete bead
send_message(thread_id="<bead-id>",
  subject="[<bead-id>] Complete: <title>",
  body="Commit: <hash>")

# Report blocker
send_message(thread_id="<bead-id>",
  subject="[<bead-id>] BLOCKED: <issue>",
  body="File: <path>, Line: <N>. Issue: <desc>.")

# Release files
release_file_reservations(project_key, agent_name)
```
```

---

## Feature Complexity Heuristics

When assessing feature complexity, use these heuristics:

```
SURGICAL FEATURE:
  Signals: touches 1-3 files, adds a new endpoint/command/handler,
  doesn't change existing data structures, straightforward testing
  → 3-8 beads total
  → Likely single-track (no parallel tracks needed)
  → Testing strategy: extend existing test suite
  → Optimization handoff may be lightweight

CROSS-CUTTING FEATURE:
  Signals: touches 5-15 files across multiple modules, requires new
  types/traits shared by several modules, changes existing APIs,
  existing tests need rewriting
  → 10-30 beads total
  → 2-4 parallel tracks with coordination points
  → Testing strategy: mix of rewrites and new tests
  → Optimization handoff must be thorough

ARCHITECTURAL FEATURE:
  Signals: touches 15+ files, introduces new patterns/abstractions,
  requires new shared crates/packages, changes module boundaries,
  may require infrastructure changes (new services, new storage)
  → 30-80+ beads total
  → 3-6+ parallel tracks with complex dependencies
  → Testing strategy: infrastructure + harness creation + comprehensive tests
  → Optimization handoff is critical — strategy must be rigorous
```

---

## Implementation Strategy Classification

When determining the right strategy pattern:

```
LINEAR SPINE:
  Signals: each piece depends on the previous, no safe parallelization,
  foundational types → core logic → integration → testing
  → Sequential bead chain
  → Risk: slow but safe
  → Best for: surgical features, tightly coupled changes

FAN-OUT / FAN-IN:
  Signals: foundational work, then independent parallel tracks, then
  integration testing that requires all tracks complete
  → Diamond-shaped dependency graph
  → Risk: coordination at fan-in point
  → Best for: cross-cutting features with independent surfaces

LAYERED CAKE:
  Signals: infrastructure layer → types layer → logic layer → API layer
  → test layer, each layer fully complete before next starts
  → Horizontal bead layers
  → Risk: over-serialization if layers aren't truly dependent
  → Best for: architectural features building new subsystems

HYBRID:
  Signals: mix of sequential constraints and parallel opportunities,
  some tracks depend on shared foundation, others are independent
  → Mix of linear spine + fan-out sections
  → Most common for real-world features
  → Strategy must explicitly document which parts are sequential vs parallel
```

---

## Testing Strategy Patterns

```
EXTEND-EXISTING:
  Signals: feature follows existing patterns, test infrastructure covers
  the integration surfaces, mostly adding new test cases
  → Identify: which test files to extend, which harnesses to reuse
  → Risk: assuming existing harnesses cover new behavior

REWRITE-AND-EXTEND:
  Signals: feature changes existing behavior, some tests will break,
  need both rewrites and new tests
  → Identify: breaking tests (rewrite), new behavior (add), regression (keep)
  → Risk: breaking tests without understanding why they existed

INFRASTRUCTURE-FIRST:
  Signals: feature requires test infrastructure that doesn't exist,
  need new harnesses, fixtures, or E2E setup before testing
  → Identify: infrastructure gaps → harness beads → test beads
  → Risk: infrastructure creation delays blocking all testing

GREEN-FIELD:
  Signals: feature is in a new area with no existing tests,
  all tests are new, no rewrites needed
  → Identify: test patterns from elsewhere in codebase to follow
  → Risk: creating tests that don't match project conventions
```
