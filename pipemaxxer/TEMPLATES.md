# Pipemaxxer — Handoff Templates

> These are **parameterized templates**, not copy-paste. Pipemaxxer fills `{placeholders}` with feature-specific content from codebase research. The sub-optimizations are WRITTEN by pipemaxxer (not templated) because they must reference actual codebase files.

---

## Template: CREATE Handoff (Batches 1-4)

```markdown
# {Feature} — {Step Name}

## First Action

Invoke the `/{skill_name}` skill.

---

## Your Mission

{Feature-specific mission statement. 2-3 sentences explaining what this step produces
and why it matters. Reference the feature by name, mention the scope.}

---

## Source Documents (Read In This Order)

{Ordered list. Every item has a READ/SKIM/REFERENCE annotation.
Paths are absolute or project-relative. Never "find the file."}

### Primary Input (CREATE FROM THIS)
```
{source_doc_path}    — {description} — READ FULLY
```

### Source of Truth Context
```
{spec_path}          — Spec (SOT #1) — {READ/SKIM/REFERENCE}
{tdd_path}           — TDD (SOT #2) — {READ/SKIM/REFERENCE}
{strategy_path}      — Strategy (SOT #3) — {READ/SKIM/REFERENCE}
```

### Codebase Context (STUDY FOR PATTERNS)
```
{key_file_1}         — {what it does, why it matters}
{key_file_2}         — {what it does, why it matters}
{key_file_3}         — {what it does, why it matters}
```

### Quality Bar (MATCH OR EXCEED)
```
{quality_bar_path}   — {description} — Best existing {doc_type} for reference
```

---

## Cardinal Rule: ZERO SCOPE DRIFT

**If it's in the research doc / spec, it gets implemented. No exceptions.**

Your job is to IMPROVE quality, clarity, and implementability. It is NEVER to reduce scope.
You may improve HOW a feature is implemented, resequence WHEN features are built, or
strengthen vague language. You may NEVER:

- Remove features from scope
- Defer features to "post-MVP," "Phase 2+," or any non-existent future iteration
- Label features as "nice to have," "stretch goal," or "out of scope"
- Silently drop features during creation
- Reduce acceptance criteria below what the source documents define
- Treat later phases as less important than early phases

Phases are EXECUTION ORDER — they determine WHEN things are built, not WHETHER they
are built. Every phase ships. Later phases get the SAME depth as early phases.

---

## Key Context From Codebase Research

{3-5 bullet points of feature-specific findings from pipemaxxer's Phase 1 research.
Actual type names, actual method counts, actual file structures. NOT generic.}

- {finding_1}
- {finding_2}
- {finding_3}

{ENRICHMENT: This section will be updated after prior batches complete with
additional metadata from newly created artifacts (requirement IDs, test counts,
phase names, etc.). The handoff works without enrichment but improves with it.}

---

## Step-by-Step Workflow

### Step 0: Read Source Documents (MANDATORY — before doing anything)
Read these IN THIS ORDER:
1. `{primary_source}` — {description} — **READ FULLY**
2. `{context_doc_1}` — {description} — **{READ/SKIM/REFERENCE}**
3. `{context_doc_2}` — {description} — **{READ/SKIM/REFERENCE}**
4. `{key_codebase_file_1}` — {what to study} — **STUDY FOR PATTERNS**
5. `{key_codebase_file_2}` — {what to study} — **STUDY FOR PATTERNS**
{If quality bar doc exists:}
6. `{quality_bar_path}` — {description} — **MATCH OR EXCEED THIS QUALITY**

### Step 1: Invoke the Skill
Run `/{skill_name}`.

**Inputs:**
- Source: `{source_path}`
- Output: `{output_path}`

**Key arguments/context to provide the skill:**
- {feature-specific context the skill needs}
- {feature-specific context the skill needs}

### Step 2: Feature-Specific Guidance
While the skill runs, pay attention to:
- {guidance_1 — from codebase research}
- {guidance_2 — from codebase research}
- {guidance_3 — from codebase research}

### Step 3: Verify Output
After the skill completes, verify:
- [ ] Output file exists at `{output_path}`
- [ ] {Feature-specific verification check}
- [ ] {Feature-specific verification check}
- [ ] {Feature-specific verification check}

### Step 4: Follow-Up Pass (Sub-Optimization)

> Send this as a follow-up message in the same session after the main work is complete.

{FEATURE-SPECIFIC sub-optimization. This is WRITTEN by pipemaxxer, not templated.
It references actual codebase files, actual counts, actual types.
Minimum 3 codebase file references. Uses ULTRATHINK.
Asks specific verification questions only answerable by reading the codebase.}

### Step 5: Scope-Preservation Check (MANDATORY — BLOCKING)

After the sub-optimization, perform this check:

1. **Enumerate** every feature/subsystem/capability described in the source documents
2. **Verify** each one is represented in your output — nothing silently dropped
3. **Scan** your output for red-flag language: "post-MVP," "Phase 2+," "stretch goal,"
   "nice to have," "deferred," "out of scope," "future iteration," "simplified for initial
   implementation," "can be added later"
4. **If any feature is missing** — this is a BLOCKING failure. Add it before proceeding.
5. **If any red-flag language is found** — remove it and replace with proper content.

---

## Key Reminders

{5-8 feature-specific reminders. These come from the source doc + codebase research.}

- {reminder_1}
- {reminder_2}
- **ZERO SCOPE DRIFT: every feature in the source doc must be covered in the output**
```

---

## Template: OPTIMIZE Handoff (Batches 1-4)

```markdown
# {Feature} — {Step Name} (Fresh-Eyes Audit)

## Your Mission

You are performing a **comprehensive fresh-eyes audit** of the {doc_name} — {description of what this doc is and why it matters}.

{1-2 sentences of project context so the auditor understands the domain.}

**You are reading, analyzing, and improving an existing document — not writing code.**

---

## What To Read (Do This First)

### The Document to Audit (TARGET)
```
{target_path}        — {doc_type} (created in previous step)
```
Read fully. This is the primary audit target.

### Verify Against (SOURCE OF TRUTH)
```
{spec_path}          — Spec (SOT #1) — The source of truth for WHAT
{tdd_path}           — TDD (SOT #2) — The source of truth for HOW TO TEST
```

### Codebase (GROUND TRUTH)
```
{key_file_1}         — {what to verify against}
{key_file_2}         — {what to verify against}
{key_file_3}         — {what to verify against}
```

### Quality Bar (MATCH OR EXCEED)
```
{quality_bar_path}   — Best existing {doc_type}
```

---

## Think Independently

Don't just check for obvious errors. Think critically about these {N} areas:

### 1. {Feature-Specific Audit Dimension}
{Description. What to look for. What files to cross-reference.}

### 2. {Feature-Specific Audit Dimension}
{Description.}

### 3. {Feature-Specific Audit Dimension}
{Description.}

{... up to 8-10 dimensions, each feature-specific}

---

## Scope Drift Detection (MANDATORY — BLOCKING)

**This is the single most important part of the audit.** The research doc has been deeply
iterated on and represents the complete feature surface. Your job is to verify the
target document preserves 100% of it.

### Red-Flag Language Scan
Search the ENTIRE target document for these phrases. If ANY are found, this is a
BLOCKING failure — remove and replace with proper content:
- "post-MVP," "Phase 2+," "stretch goal," "nice to have"
- "future iteration," "out of scope," "can be added later"
- "simplified for initial implementation," "deferred to"
- Any language implying a spec feature won't be implemented

### Coverage Verification
Enumerate every feature/subsystem in the spec. For each one, verify it appears in
the target document with equivalent depth. If later phases/sections have thinner
coverage than early ones, investigate why — this is a scope-drift signal.

### Drift Checklist
- [ ] Every spec requirement is represented in this document
- [ ] No content was silently dropped or weakened
- [ ] No assumptions made that aren't in the spec
- [ ] No "post-MVP" / "Phase 2+" / "stretch goal" / "nice to have" language anywhere
- [ ] Later phases/sections have SAME depth as early phases/sections
- [ ] Phases are labeled as execution order, NOT importance tiers
- [ ] {Feature-specific drift check}
- [ ] {Feature-specific drift check}
- [ ] {Feature-specific drift check}

---

## Follow-Up Pass (Run After Fixes)

> After making your fixes, send this as a follow-up message in the same session.

{FEATURE-SPECIFIC sub-optimization for the auditor's own fixes.
"Re-read the fixes you just made. Did they introduce new issues?
Open {file} and verify {specific thing}. Check {specific count}."}
```

---

## Template: AUDIT BEADS Handoff (Batch 5)

```markdown
# {Feature} — Bead Audit (Spec Drift Detection)

## First Action

Invoke the `/bead-plan-audit` skill.

---

## Your Mission

You are performing a **dedicated, systematic audit** of all beads for {feature_name}. This is the LAST GATE before execution. Your job is to verify **zero spec drift** — every spec requirement is covered, every TDD test is assigned, no silent scope cuts.

---

## Source Documents

### Beads (TARGET — audit EVERY bead)
```bash
{bead_cli} list --json          # Full inventory
{bead_cli} show <id> --json     # Individual bead detail
```
Read EVERY bead. Not a sample — every single one.

### Verify Against
```
{spec_path}          — Spec (SOT #1) — Every requirement must have a bead
{tdd_path}           — TDD (SOT #2) — Every test ID must be assigned
{strategy_path}      — Strategy (SOT #3) — Phase ordering must match
```

### Codebase
```
{key_files — for verifying bead references are accurate}
```

---

## Audit Methodology

{Invoke /bead-plan-audit which handles the detailed methodology.
Add feature-specific instructions here:}

### Feature-Specific Checks
{What to look for in THIS feature's beads specifically.}
- {check_1}
- {check_2}

### Scope Drift Detection (MANDATORY — BLOCKING DIMENSION)

**This is the single most important audit dimension.** The research doc has been deeply
iterated on. Every feature in it must have corresponding beads.

**Red-flag language scan** — search ALL beads for:
- "post-MVP," "Phase 2+," "stretch goal," "nice to have"
- "future iteration," "out of scope," "can be added later"
- "simplified for initial implementation," "deferred to"
If found: BLOCKING failure. Remove and replace with full implementation content.

**Coverage verification** — for EVERY feature/subsystem in the spec:
- Identify which bead(s) implement it
- If ANY spec feature has ZERO corresponding beads → BLOCKING failure
- Create missing beads before proceeding

**Phase coverage equality** — count beads per strategy phase:
- If later phases have significantly fewer beads → investigate
- Later phases MUST have same depth as early phases
- Phases are execution order, not importance tiers

---

## Follow-Up Pass

> After the audit is complete and all fixes applied:

{Re-read your own fixes. Did fixing one bead break another's dependencies?
Re-run the coverage matrix. Is it still 100%?
Verify bead count matches strategy phase task count.
Verify ZERO scope-drift language remains in any bead.
Verify every spec feature has at least one bead mapping.}
```

---

## Template: GENERATE KICKOFF Handoff (Batch 6)

```markdown
# {Feature} — Generate Kickoff + Push Prompts

## First Action

Invoke the `/beads-to-execution` skill.

---

## Your Mission

Generate the **kickoff prompt** (full agent onboarding), **push prompt** (continuation nudge), and **status file** for {feature_name}.

These are the documents agents will actually USE during implementation. They must be deeply feature-specific — reference actual file paths, actual types, actual commands.

**CRITICAL: The kickoff and push prompts MUST include the full AgentMail coordination workflow.** Assume multiple agents may work in parallel. The prompts must leave ZERO ambiguity about:
- Organization model (FLAT — no hierarchy, agents pick next ready bead)
- How to register with AgentMail (exact MCP calls)
- How to check inbox before picking work (situational awareness)
- How to claim a bead (update status + reserve files + announce via mail)
- How to handle file reservation conflicts
- The full execution loop (claim → reserve → announce → implement → verify → commit → push → release → loop)
- Session landing protocol (when fully blocked)
- **Bead completion policy** (MUST fully complete every bead — no partial work)
- **Commit+push workflow** (complete bead fully → verify → stage specific files → commit with bead ID prefix → push is MANDATORY — work is NOT complete until push succeeds)

**If the feature is backend-heavy Rust / control-plane work, the generated kickoff and push prompts MUST also encode:**
- `fast-local` for the narrow inner loop
- `feature-local` for cross-crate backend close proof
- `phase-gate` for validation-model / config / workflow / control-plane changes
- `merge-gate` / `ci-merge` for broader pre-merge escalation
- `nightly-extended` only for env-gated heavy/default-off surfaces
- `cargo test --workspace` as fallback/debug compatibility only, not the default per-bead inner loop
- `resource-status` before heavy lanes once that routed command surface exists

---

## Source Documents

```
{spec_path}          — Spec (SOT #1)
{tdd_path}           — TDD (SOT #2)
{bootstrap_path}     — Bootstrap (environment setup)
{strategy_path}      — Strategy (SOT #3)
{architecture_path}  — Architecture
```

### Codebase (study for integration surface)
```
{key_files with descriptions}
```

### Quality Bar (MATCH THIS LEVEL OF DETAIL)
```
docs/plan-hub/prompts/l2.5-desktop-kickoff.md   — Best existing kickoff (study the AgentMail section)
docs/plan-hub/prompts/l2.5-desktop-push.md       — Best existing push prompt
```

---

## Output Files

| File | Path | Purpose |
|------|------|---------|
| Kickoff | `{kickoff_path}` | Full agent onboarding (~200-400 lines) |
| Push | `{push_path}` | Continuation nudge (~60-120 lines) |
| Status | `{status_path}` | YAML pointer to all SOT docs |

---

## Required Kickoff Sections (ALL mandatory — in this order)

### 1. Mission
- Feature description — WHAT is being built and WHY
- Scope description — what's in scope, what modules/crates/packages are touched
- Completion milestones (epic-level)
- "Work from the bead graph. Claim task beads, not epics. Each bead is self-contained — implement from the bead alone."

### 2. Implementation Boundary
- **EXISTS (build on top of):** List actual infrastructure, types, services, APIs that exist
- **DOES NOT EXIST (you're building):** List what the feature creates
- "Do NOT assume unbuilt infrastructure exists."

### 3. Core Contracts / Non-Negotiables
- Feature-specific architectural rules agents MUST follow
- Wire format, data model, pattern constraints
- "If code conflicts with this contract, the contract wins."

### 4. Source of Truth Loading (MANDATORY — before starting ANY implementation)
- Ordered list with READ/SKIM/REFERENCE annotations
- AGENTS.md first, then feature doc, strategy, bead graph, key codebase files
- Specific paths and descriptions for each

### 5. AgentMail Setup (Do This ONCE At Session Start)
Exact MCP calls — no ambiguity:
```
ensure_project(project_key="{project_path}")
register_agent(project_key, program="claude-code", model="opus")
set_contact_policy(project_key, agent_name, policy="open")
fetch_inbox(project_key, agent_name, limit=20)
```
"Read and acknowledge any pending messages before starting work."

### 6. Bead Completion Policy (CRITICAL)
**MUST be included verbatim in every generated kickoff:**

"You MUST fully complete every bead you claim. No partial completion.
No 'I'll finish this later.' No moving on to another bead while one is in progress.

A bead is COMPLETE when:
1. All code changes described in the bead are implemented
2. All tests described in the bead pass
3. All build/lint/test verification commands pass
4. Code is committed with proper message (bead ID prefix)
5. Bead is marked complete
6. Completion announced via AgentMail
7. File reservations released

If you hit a blocker during a bead:
- DO NOT abandon the bead and move to another track
- DO NOT mark it complete with missing pieces
- DO NOT do mid-way commits of incomplete work
- Diagnose the blocker. Read the error. Understand the root cause.
- Fix the blocker yourself — you have the full codebase available
- Only if the blocker is genuinely impossible to resolve (missing infrastructure
  not in your bead), announce the specific issue in AgentMail with file path,
  line number, and what's wrong, then wait for resolution"

### 7. Work Loop (Full Visual — claim through release)
Generate a detailed ASCII work loop diagram (like the VXG kickoff):
```
ONE-TIME SETUP:
  1. AgentMail registration
  2. Read SOT docs
  3. {bead_cli} ready --json → understand the bead graph

MAIN LOOP (repeat until all beads complete):

  ┌─ PICK ──────────────────────────────────────────────┐
  │ {bead_cli} ready --json                              │
  │ Pick the highest-priority ready bead.                │
  │ Read the bead description FULLY before touching code.│
  └──────────────────────────────────────────────────────┘
           │
  ┌─ CLAIM + ANNOUNCE ──────────────────────────────────┐
  │ {bead_cli} claim <bead-id>                           │
  │ file_reservation_paths(paths=[...], exclusive=true)  │
  │ send_message(thread_id="<bead-id>",                  │
  │   subject="[<bead-id>] Start: <title>")              │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ IMPLEMENT (TDD) ──────────────────────────────────┐
  │ Study target files → write tests FIRST →             │
  │ implement code → iterate until ALL pass.             │
  │ DO NOT cut corners. DO NOT skip tests.               │
  │ DO NOT leave TODOs. DO NOT do mid-way commits.       │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ VERIFY ────────────────────────────────────────────┐
  │ {build_cmd}                                          │
  │ {lint_cmd}                                           │
  │ {test_cmd}                                           │
  │ Fix ALL failures before proceeding.                  │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ COMMIT + PUSH (MANDATORY) ──────────────────────────┐
  │ git add <specific-files-only>                         │
  │ git commit -m "<bead-id>: <short description>"        │
  │ git push                                              │
  │ # PUSH IS MANDATORY — work is NOT complete until      │
  │ # push succeeds. If push fails → pull --rebase →      │
  │ # resolve → push again. NEVER say "ready to push      │
  │ # when you are" — YOU must push.                      │
  │ One commit per bead (multiple OK if large, but each   │
  │ must pass all checks independently).                  │
  └───────────────────────────────────────────────────────┘
           │
  ┌─ COMPLETE + RELEASE ────────────────────────────────┐
  │ {bead_cli} complete <bead-id>                        │
  │ {bead_cli} sync --flush-only                         │
  │ send_message(thread_id="<bead-id>",                  │
  │   subject="[<bead-id>] Complete: <title>",           │
  │   body="Commit: <hash>. All checks pass.")           │
  │ release_file_reservations(agent_name)                │
  └──────────────────────────────────────────────────────┘
           │
        LOOP → back to PICK
```

### 8. Verification Commands (actual commands per stack surface)
```bash
{build_cmd}
{lint_cmd}
{test_cmd}
```
"Use debug builds for fast iteration."
Stack-specific commands for each module/crate/package the feature touches.

### 9. File-Surface Map by Epic/Lane
For each epic: which specific files are in scope. Prevents unnecessary exploration.

### 10. Dependency Spine
Visual mental model of what comes first, parallel tracks, what's last.
"Trust `{bead_cli} ready`, but use this spine as your mental model."

### 11. AgentMail Quick Reference
Compact reference for ongoing use:
```
# Check inbox (do this between beads)
fetch_inbox(project_key, agent_name, limit=10)
# Claim bead
send_message(thread_id="<bead-id>", subject="[<bead-id>] Start: <title>")
# Complete bead
send_message(thread_id="<bead-id>", subject="[<bead-id>] Complete: <title>")
# Report blocker
send_message(thread_id="<bead-id>", subject="[<bead-id>] BLOCKED: <issue>")
# Release files
release_file_reservations(project_key, agent_name)
```

---

## Required Push Sections (ALL mandatory)

The generated push prompt MUST include these sections:

### 1. Re-Orient
- Re-read AGENTS.md
- Feature name + description (1 line)
- Feature doc + strategy paths
- "Your work orders are beads: `{bead_cli} ready --json`"

### 2. Core Contracts (compact reminder)
- Non-negotiable architectural rules, compact form

### 3. Bead Completion Policy (compact but firm)
"Every bead you claim MUST be fully completed. No partial work. No TODOs. No 'finish later.'
Complete means: all code + all tests + all checks + committed + announced.
If blocked: diagnose, fix yourself, only escalate via AgentMail if the blocker is in another agent's code."

### 4. Work Loop (compact)
```
1. Check inbox (fetch_inbox) → acknowledge messages
2. {bead_cli} ready --json → pick highest-priority ready bead
3. Read bead FULLY → study target files
4. CLAIM: {bead_cli} claim + file_reservation_paths + send_message
5. IMPLEMENT: TDD — test first, then code. Implement ALL of it. No mid-way commits.
6. VERIFY: {build_cmd} + {lint_cmd} + {test_cmd} (ALL must pass)
7. COMMIT + PUSH: git add <specific-files> + git commit -m "<bead-id>: <desc>" + git push (MANDATORY)
8. COMPLETE: {bead_cli} complete + sync + send_message + release_file_reservations
9. LOOP → step 1
Do not stop to ask what to work on next. Pick the next ready bead.
```

### 5. Verification Commands (compact, per stack surface)
Actual commands grouped by module/crate/package.

### 6. Dependency Spine (compact)
One-line per phase/epic.

### 7. File Surfaces (compact table)
| Epic | Key Files |
format.

### 8. AgentMail Quick Reference (compact)
Claim/complete/blocker/release patterns.

### 9. Backend Validation Contract (include when feature is backend-heavy)
- Start with `fast-local`
- Escalate to `feature-local` / `phase-gate` as touched backend surfaces widen
- Reserve `merge-gate` / `nightly-extended` for broader or env-gated proof
- Treat `cargo test --workspace` as fallback/debug compatibility only
- Mention `resource-status` before heavy lanes once it exists

---

## NO sub-optimization — these ARE the deliverables.
```

---

## Template: COMPLETION AUDIT Handoff (Post-Implementation)

```markdown
# {Feature} — Completion Audit

## First Action

Invoke the `/bead-completion-audit` skill.

---

## Your Mission

Deep-read the spec, TDD, and codebase for {feature_name}. Find EVERY gap between what
the spec requires and what's actually implemented. Create fix beads for gaps. Do NOT
execute them — just create and scope.

**CRITICAL: The spec is the source of truth. The research doc was deeply iterated on
before this pipeline started. EVERY feature in the spec must be implemented in the
codebase. If something is missing, it's a gap — not a "nice to have" that was
intentionally skipped. Create a fix bead for it.**

---

## Source Documents

```
{spec_path}          — Spec (SOT #1) — Walk EVERY requirement, no exceptions
{tdd_path}           — TDD (SOT #2) — Verify EVERY test exists with correct assertions
{bootstrap_path}     — Bootstrap — Verify environment matches
```

### Codebase (THE IMPLEMENTATION — read deeply)
```
{key_implementation_files}
{key_test_files}
```

---

## Audit Methodology

Walk the spec requirement by requirement. For each:
1. Find the corresponding implementation in the codebase
2. Verify it matches the spec's acceptance criteria
3. Find the corresponding TDD test(s)
4. Verify tests exist with correct assertions
5. If gap found → create a fix bead

**Do NOT accept "this was intentionally deferred" as an excuse.** If it's in the spec
and not in the codebase, it's a gap. Create a fix bead.

---

## Follow-Up Pass

> After creating all fix beads:

{Re-read the fix beads you created. Are they specific enough?
Does each one reference the right spec section and TDD test IDs?
Could an agent implement each fix from the bead description alone?
Is the acceptance criteria concrete — not "fix this" but "add field X of type Y to struct Z"?
Did you cover EVERY spec requirement, or did you stop early?
Run a final count: spec requirements vs fix beads + already-complete beads = 100%?}
```

---

## Template: FIX BEADS KICKOFF Handoff (Post-Implementation)

```markdown
# {Feature} — Fix Beads Execution Kickoff

> For fresh agents executing fix beads from the completion audit. Read this FIRST.

---

## Mission

You are executing fix beads for {feature_name} — gaps identified by the completion
audit between the spec and the actual implementation. Each fix bead is a targeted
correction: a missing field, a wrong assertion, an unimplemented edge case, etc.

Work from the fix bead graph. Each fix bead is self-contained — implement from the
bead alone. The spec and TDD are tiebreakers if a fix bead is ambiguous.

**Organization: FLAT.** No hierarchy. Pick the next ready fix bead, implement it fully,
move on.

**Coordination: AGENTMAIL-FIRST.** Register, check inbox, announce claims BEFORE
touching code.

---

## Implementation Boundary

**EXISTS (already implemented — the main feature):**
{main_feature_implementation_summary}

**FIX BEADS ADDRESS:** Gaps, missing edge cases, incorrect behavior, thin test coverage,
spec requirements not fully met. These are targeted surgical fixes, not new features.

---

## Core Contracts / Non-Negotiables

{core_contracts_from_feature}

"If code conflicts with this contract, the contract wins."

---

## Source of Truth Loading (MANDATORY — Read Before Starting)

1. **AGENTS.md** — agent guidelines, rules, coordination
   ```text
   {agents_md_path}
   ```
2. **Spec** — SOT #1 — the authority for WHAT the feature should do
   ```text
   {spec_path}
   ```
3. **TDD** — SOT #2 — test definitions for verification
   ```text
   {tdd_path}
   ```
4. **Fix bead graph** — your ACTUAL work orders
   ```bash
   {bead_cli} list --label audit-fix     # All fix beads
   {bead_cli} ready --label audit-fix    # Ready fix beads
   ```
5. **Integration surfaces** — study for context on each fix
   ```text
   {key_implementation_files}
   ```

---

## AgentMail Setup (Do This ONCE At Session Start)

```
# 1. Register with the project
ensure_project(project_key="{project_path}")
register_agent(project_key, program="claude-code", model="opus")

# 2. Set contact policy
set_contact_policy(project_key, agent_name, policy="open")

# 3. Check inbox for messages from prior sessions or other agents
fetch_inbox(project_key, agent_name, limit=20)
```

Read and acknowledge any pending messages before starting work. If another agent
left a blocker notice, address it first.

---

## Bead Completion Policy (CRITICAL)

**You MUST fully complete every fix bead you claim.** No partial completion.
No "I'll finish this later." No moving on to another fix bead while one is in progress.

A fix bead is COMPLETE when:
1. All code changes described in the fix bead are implemented
2. The specific TDD tests referenced in the bead pass
3. All build/lint/test verification commands pass (zero warnings)
4. Code is committed with fix bead ID prefix
5. Fix bead is marked complete
6. Completion announced via AgentMail
7. File reservations released

**If you hit a blocker:**
- DO NOT abandon the fix bead and move to another
- DO NOT mark it complete with missing pieces
- DO NOT do mid-way commits of incomplete work
- Diagnose the blocker. Fix it yourself.
- Only escalate via AgentMail if the blocker is in another agent's code (file path,
  line number, what's wrong)

---

## Work Loop

```
ONE-TIME SETUP:
  1. AgentMail registration (see above)
  2. Read AGENTS.md + spec + TDD
  3. {bead_cli} ready --label audit-fix → understand the fix graph

MAIN LOOP (repeat until all fix beads complete):

  ┌─ PICK ──────────────────────────────────────────────┐
  │ {bead_cli} ready --label audit-fix                   │
  │ Pick the highest-priority ready fix bead.            │
  │ Read the fix bead description FULLY.                 │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ CLAIM + ANNOUNCE ──────────────────────────────────┐
  │ {bead_cli} claim <fix-bead-id>                       │
  │                                                      │
  │ file_reservation_paths(                              │
  │   project_key="{project_path}",                      │
  │   agent_name=<your-name>,                            │
  │   paths=[<files this fix bead touches>],             │
  │   ttl_seconds=3600, exclusive=true,                  │
  │   reason="<fix-bead-id>"                             │
  │ )                                                    │
  │                                                      │
  │ send_message(                                        │
  │   project_key="{project_path}",                      │
  │   from_agent=<your-name>,                            │
  │   thread_id="<fix-bead-id>",                         │
  │   subject="[<fix-bead-id>] Start: <title>",          │
  │   body="Claiming fix bead. Files: <list>."           │
  │ )                                                    │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ IMPLEMENT ─────────────────────────────────────────┐
  │ 1. Study the target files — understand current state │
  │ 2. Read the spec section referenced in the fix bead  │
  │ 3. Write/fix tests FIRST (from TDD test IDs)         │
  │ 4. Implement the fix to make tests pass              │
  │ 5. Verify acceptance criteria from the fix bead      │
  │                                                      │
  │ DO NOT cut corners. DO NOT skip tests.               │
  │ DO NOT leave TODOs. DO NOT do mid-way commits.       │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ VERIFY ────────────────────────────────────────────┐
  │ {build_cmd}                                          │
  │ {lint_cmd}                                           │
  │ {test_cmd}                                           │
  │                                                      │
  │ Fix ALL failures before proceeding.                  │
  │ Never proceed with failing checks.                   │
  └──────────────────────────────────────────────────────┘
           │
  ┌─ COMMIT + PUSH (MANDATORY) ──────────────────────────┐
  │ git add <specific-files-only>                         │
  │ git commit -m "<fix-bead-id>: <short description>"    │
  │ git push                                              │
  │ # PUSH IS MANDATORY — work is NOT complete until      │
  │ # push succeeds. If push fails → pull --rebase →      │
  │ # resolve → push again.                               │
  │ One commit per fix bead.                              │
  └───────────────────────────────────────────────────────┘
           │
  ┌─ COMPLETE + RELEASE ────────────────────────────────┐
  │ {bead_cli} complete <fix-bead-id>                    │
  │ {bead_cli} sync --flush-only                         │
  │                                                      │
  │ send_message(                                        │
  │   project_key="{project_path}",                      │
  │   from_agent=<your-name>,                            │
  │   thread_id="<fix-bead-id>",                         │
  │   subject="[<fix-bead-id>] Complete: <title>",       │
  │   body="Fix complete. Commit: <hash>. All pass."     │
  │ )                                                    │
  │                                                      │
  │ release_file_reservations(                           │
  │   project_key="{project_path}",                      │
  │   agent_name=<your-name>                             │
  │ )                                                    │
  └──────────────────────────────────────────────────────┘
           │
        LOOP → back to PICK
```

"Use debug builds for fast iteration."

---

## Verification Commands

{build_lint_test_commands_per_surface}

---

## Completion Gate

When ALL fix beads are complete:
- Run the full test suite one final time
- Verify build is green with zero warnings
- If any gaps remain, go back to the completion audit (step 12) and re-audit
- Do NOT stop to ask what to work on next — pick the next ready fix bead
- Do NOT wait for permission between fix beads

If fully blocked on all remaining fix beads: push all work, release all reservations,
announce handoff via AgentMail with status of what's done and what's blocked.

---

## AgentMail Quick Reference

```
# Check inbox (between fix beads)
fetch_inbox(project_key, agent_name, limit=10)

# Claim fix bead
send_message(thread_id="<fix-bead-id>", subject="[<fix-bead-id>] Start: <title>")

# Complete fix bead
send_message(thread_id="<fix-bead-id>", subject="[<fix-bead-id>] Complete: <title>",
  body="Commit: <hash>. All checks pass.")

# Report blocker
send_message(thread_id="<fix-bead-id>", subject="[<fix-bead-id>] BLOCKED: <issue>",
  body="File: <path>, Line: <N>. Issue: <desc>. Needed: <what>")

# Release files
release_file_reservations(project_key, agent_name)
```
```

---

## Template: FIX BEADS PUSH Handoff (Post-Implementation)

```markdown
# {Feature} — Fix Beads Push

> For continuing agents. Compact reminder of contracts, work loop, and verification.

---

## Re-Orient

1. Re-read `AGENTS.md` — agent rules and coordination
2. Feature: {feature_name} — executing fix beads from completion audit
3. Spec: `{spec_path}` — SOT #1 (tiebreaker if fix bead is ambiguous)
4. TDD: `{tdd_path}` — SOT #2 (test definitions)
5. Fix bead graph: `{bead_cli} ready --label audit-fix`

---

## Core Contracts

{core_contracts_compact}

---

## Bead Completion Policy

**Every fix bead you claim MUST be fully completed.** No partial work. No TODOs. No "finish later."

Complete means: all code + all tests + all checks + committed + announced.

**If blocked:** Diagnose it. Fix it yourself. Only escalate via AgentMail if the blocker
is in another agent's code. Do NOT abandon the fix bead.

---

## Work Loop

```
1. Check inbox (fetch_inbox) → acknowledge any messages
2. {bead_cli} ready --label audit-fix → pick highest-priority ready fix bead
3. Read fix bead FULLY → study target files
4. CLAIM:
   {bead_cli} claim <fix-bead-id>
   file_reservation_paths(paths=[<files>], ttl_seconds=3600, exclusive=true, reason="<fix-bead-id>")
   send_message(thread_id="<fix-bead-id>", subject="[<fix-bead-id>] Start: <title>")
5. IMPLEMENT: Read spec section + TDD tests referenced. Fix/write tests first, then code.
   Implement ALL of it. No mid-way commits. No partial work.
6. VERIFY: {build_cmd} + {lint_cmd} + {test_cmd} (ALL must pass)
7. COMMIT + PUSH (MANDATORY):
   git add <specific-files>
   git commit -m "<fix-bead-id>: <short description>"
   git push
   (Work is NOT complete until push succeeds. If push fails → pull --rebase → retry.)
8. COMPLETE:
   {bead_cli} complete <fix-bead-id>
   {bead_cli} sync --flush-only
   send_message(thread_id="<fix-bead-id>", subject="[<fix-bead-id>] Complete", body="Commit: <hash>")
   release_file_reservations(agent_name)
9. LOOP → back to step 1

Do not stop to ask what to work on next. Pick the next ready fix bead.
```

---

## Verification (Every Fix Bead)

Use debug builds for fast iteration. Fix ALL failures before committing.

{build_lint_test_commands_compact}

---

## Completion Gate

When all fix beads are done, run the full test suite one final time.
If gaps remain, go back to completion audit (step 12) and re-audit.
If fully blocked: push work, release reservations, announce via AgentMail.

---

## AgentMail Quick Reference

```
fetch_inbox(project_key, agent_name, limit=10)
send_message(thread_id="<id>", subject="[<id>] Start: <title>")
send_message(thread_id="<id>", subject="[<id>] Complete: <title>", body="Commit: <hash>")
send_message(thread_id="<id>", subject="[<id>] BLOCKED: <issue>")
release_file_reservations(project_key, agent_name)
```
```

---

## Template: ARCHIVE Handoff (Step 15)

```markdown
# {Feature} — Archive Pipeline

## Your Mission

The {feature_name} implementation pipeline is complete. Archive all pipeline artifacts and clean up for the next run.

## Steps

### 1. Verify Completion
- [ ] All beads are closed (`{bead_cli} list --status done`)
- [ ] Completion audit passed (COMPLETE verdict)
- [ ] All fix beads executed and verified
- [ ] Build is green, tests pass

### 2. Archive Pipeline Handoffs
```bash
mkdir -p {handoff_dir}/archived/{date}-{feature}
mv {handoff_dir}/*.md {handoff_dir}/archived/{date}-{feature}/
mv {handoff_dir}/manifest.yaml {handoff_dir}/archived/{date}-{feature}/
```

### 3. Update Status
```bash
# Update status file
cat > {status_path} << 'EOF'
feature: {feature}
status: complete
completed: {date}
spec: {spec_path}
tdd: {tdd_path}
strategy: {strategy_path}
bead_prefix: {bead_prefix}
total_beads: {N}
fix_beads: {N}
audit_iterations: {N}
EOF
```

### 4. Report Deliverables
```
✅ {feature_name} — COMPLETE

📦 Deliverables:
  - Spec: {spec_path}
  - TDD: {tdd_path}
  - Strategy: {strategy_path}
  - Implementation: {N} beads executed
  - Fix beads: {N} created and resolved
  - Audit: {N} iterations to reach 100%

📁 Archived: {archive_path}
🔄 Ready for next pipeline run.
```

### 5. Clean Up (Optional)
- Remove any temporary working files
- Reset bead workspace if needed for next feature
- Verify git is clean

---

## Next Pipeline Run

To start the next feature/layer:
```
/pipemaxxer {next_source_doc_path}
```

The pipeline is stateless — each run generates fresh handoffs. Prior pipeline artifacts are archived, not overwritten.
```

---

## Template: VALIDATE SPEC Handoff (Pattern B — spec already exists)

```markdown
# {Feature} — Validate Existing Spec for 3-SOT Pipeline

## Your Mission

The spec for {feature_name} already exists at `{spec_path}`. Before it can enter the TDD pipeline, verify it has the structure needed for downstream coverage verification.

**This is NOT research-to-spec.** The spec content is good — you're checking STRUCTURE, not rewriting content.

---

## The Spec to Validate
```
{spec_path}           — READ FULLY
```

## Validation Checklist

### 1. Requirement IDs
- [ ] Every functional requirement has a unique, stable ID (FR-X.Y.Z or §N.N.N)
- [ ] IDs are systematic (by section/subsystem, not random)
- [ ] A downstream tool could grep for all requirement IDs mechanically
- If missing: ADD IDs systematically without changing content

### 2. Acceptance Criteria
- [ ] Every requirement has explicit, bullet-listed acceptance criteria
- [ ] ACs are specific and testable (not "handle appropriately")
- [ ] ACs are not buried in narrative prose
- If buried: EXTRACT into bullet lists under each requirement

### 3. Structure
- [ ] Consistent section numbering
- [ ] Clear subsystem/feature boundaries
- [ ] Success criteria table (or equivalent summary)
- [ ] No TBD sections, no hand-waving

### 4. Completeness
- [ ] Error paths defined (not just happy paths)
- [ ] Edge cases called out
- [ ] Integration points specified
- [ ] No "to be determined later" items — if it's in the spec, it's defined

### 5. Scope Preservation
- [ ] No features from the original research doc were silently dropped
- [ ] No "post-MVP," "Phase 2+," "stretch goal," or "nice to have" language
- [ ] All features from the research doc are represented in the spec
- [ ] If the spec was derived from a research doc, 100% of research doc features are present

---

## Output

The same spec file, validated and structured. Bump version if changes made.

---

## Follow-Up Pass

Re-read the spec with fresh eyes. Would a test engineer be able to write comprehensive tests for every feature? Would a developer know exactly what to build? If you find yourself thinking "this is vague" — it IS vague and needs fixing.
```
