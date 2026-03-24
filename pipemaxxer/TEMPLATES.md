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

---

## Key Reminders

{5-8 feature-specific reminders. These come from the source doc + codebase research.}

- {reminder_1}
- {reminder_2}
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

## Drift Checklist

- [ ] Every spec requirement is represented in this document
- [ ] No content was silently dropped or weakened
- [ ] No assumptions made that aren't in the spec
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

---

## Follow-Up Pass

> After the audit is complete and all fixes applied:

{Re-read your own fixes. Did fixing one bead break another's dependencies?
Re-run the coverage matrix. Is it still 100%?
Verify bead count matches strategy phase task count.}
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

### Quality Bar
```
{existing_kickoff}   — Best existing kickoff prompt
{existing_push}      — Best existing push prompt
```

---

## Output Files

| File | Path | Purpose |
|------|------|---------|
| Kickoff | `{kickoff_path}` | Full agent onboarding (~150-250 lines) |
| Push | `{push_path}` | Continuation nudge (~30-50 lines) |
| Status | `{status_path}` | YAML pointer to all SOT docs |

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

Deep-read the spec, TDD, and codebase for {feature_name}. Find EVERY gap between what the spec requires and what's actually implemented. Create fix beads for gaps. Do NOT execute them — just create and scope.

---

## Source Documents

```
{spec_path}          — Spec (SOT #1) — Walk EVERY requirement
{tdd_path}           — TDD (SOT #2) — Verify EVERY test exists with correct assertions
{bootstrap_path}     — Bootstrap — Verify environment matches
```

### Codebase (THE IMPLEMENTATION — read deeply)
```
{key_implementation_files}
{key_test_files}
```

---

## Follow-Up Pass

> After creating all fix beads:

{Re-read the fix beads you created. Are they specific enough?
Does each one reference the right spec section and TDD test IDs?
Could an agent implement each fix from the bead description alone?
Is the acceptance criteria concrete — not "fix this" but "add field X of type Y to struct Z"?}
```

---

## Template: EXECUTE FIX BEADS Handoff (Post-Implementation)

```markdown
# {Feature} — Execute Fix Beads

## Your Mission

Execute the fix beads created by the completion audit. For each fix bead:
1. Read the bead — it's self-contained with spec refs and TDD test IDs
2. Implement the fix
3. Run the specific TDD tests referenced in the bead
4. Verify acceptance criteria
5. Commit, mark bead complete

---

## Source Documents

```
{spec_path}          — Spec (SOT #1) — Tiebreaker if fix bead is ambiguous
{tdd_path}           — TDD (SOT #2) — Test definitions for verification
```

### Fix Beads
```bash
{bead_cli} list --label audit-fix     # All fix beads from completion audit
{bead_cli} ready --label audit-fix    # Ready fix beads
```

---

## Quality Gates

```bash
{build_cmd}
{test_cmd}
{lint_cmd}
```

---

## Mini Push (After Each Fix)

If gaps remain after this pass, go back to the completion audit (step 12) and re-audit.
Check inbox for coordination messages. Check next fix bead.
Keep going until ALL fix beads are complete or you are BLOCKED on a SPEC_QUESTION.
Do NOT stop to ask what to work on next.
```

---

## Template: ARCHIVE Handoff

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

---

## Output

The same spec file, validated and structured. Bump version if changes made.

---

## Follow-Up Pass

Re-read the spec with fresh eyes. Would a test engineer be able to write comprehensive tests for every feature? Would a developer know exactly what to build? If you find yourself thinking "this is vague" — it IS vague and needs fixing.
```
