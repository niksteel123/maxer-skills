---
name: contract-next-unit
description: "Select the next useful contract outcome from actual capability readiness and current feedback. Reconcile affected unit/package obligations, route unfinished authoring to its owner, and re-prime the guide and prompts without inventing prior-unit completion. Use for next unit, unit boundary, advancement or reconsidering the remaining plan."
---

# Contract Next Unit — The Unit-Boundary Advance

> You run when selecting the next outcome after a capability closes or evidence
> changes the remaining plan. Your job is to make the next action
> unambiguous — advance the cursor, re-prime the prompts, and route stub
> graduation if needed. You do NOT create beads/packages/code; you set the
> table for the stages that do.

## The Contract-First Pipeline — 60-Second Orientation

| # | Stage (skill) | Produces | Done when |
| --- | --- | --- | --- |
| 1 | research-hardening | current intent and falsifiable assumptions | readiness for the named next outcome or experiment |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | current surface-package delta or justified new package | delta baseline and actual carryover verified |
| 4 | contract-to-beads | bead graph with proof classes per unit | 100% two-sided coverage; polish steady-state |
| 5 | contract-bead-audit | fresh-eyes audited bead graph | verdict READY |
| 6 | contract-to-execution | kickoff/push/sweep prompts; flat swarm runs | unit UVP greenlight via gate fix-loop |

Laws binding every stage:
1. Research records current canonical intent. Cite requirements without
   duplicating them. User steering or contrary evidence can revise that intent;
   reconcile affected code, packages and contracts instead of resolving by rank.
2. A unit is complete ONLY on truthful UVP greenlight — never on narrative,
   bead acceptance criteria, or local tests alone.
3. Blocked is a valid truthful result; mocks never substitute for missing
   prerequisites.
4. Record amendment evidence and actual proof impact. Current authorized scope
   and evidence may revise design; weakened acceptance needs an explicit basis
   and review. Inspect carryover and changed claims before accepting green.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each normal stage has one primary artifact class. Substantial steering pauses
   affected dispatch and reconciles all affected artifact classes together.

**Select and prime the next valid frontier. Advancing independent work does
not close another unit or erase its remaining obligations.**

## When To Use / NOT Use

- USE: right after a unit's gate bead greenlights, when you want the next
  unit teed up. Also fine to use to simply ANSWER "what unit is next and
  what do I run" without changing anything (read-only mode — say so).
- For mid-unit steering, use the same affected-artifact reconciliation before
  selecting the next frontier. Package/bead authors own their required updates.
  After the FINAL/SPINE unit greenlights → `09-completion-sweep`, not this.

## Workflow

### Phase 0 — Confirm the boundary
1. Read `00-pipeline-guide.md` (the cursor) + the contract's Unit Map and
   shipping sequence.
2. Read the actual required capability proofs and the current product-readiness
   statement. An unfinished unit blocks only work that consumes its missing
   capability. Record its open obligations; do not manufacture an ordinal gate.
   Reflect on the latest product demonstration, contrary evidence, repeated
   failure without new information, feedback budget, and user steering before
   committing to the next slice.
   Check whether recent effort produced useful behavior or decision-relevant
   learning, or only additional verification. Name why another check would change
   the next decision. Reorder optional hardening behind the next useful outcome;
   amend overgrown required obligations explicitly. Do not restart a paused or
   concluded experiment to exhaust its old exploratory checklist.

When a product board is named by the guide or repository instructions, read this
track's milestones and linked prerequisites before selection. Use their actual
unlocks, current priorities and the [product-board](../product-board/SKILL.md)
completion policy; a closed unit alone does not achieve a product milestone.
If a milestone/dependency changed, reconcile affected plans and proof first.
Independent work stays eligible; another track's visibility does not expand scope.

### Phase 1 — Identify the next unit + package model
3. Select the smallest useful next outcome whose real prerequisites hold.
   Merge, split, reorder or retire remaining planned work when the evidence
   warrants it. Keep historical IDs and classify affected artifacts as retained,
   revised, superseded or new; the unit number is not a dependency.
4. **Package model** (decisive for whether transcription re-runs):
   Resolve existing surface ownership first; the default is an affected delta
   and unit view, not another package solely because the unit number changed.
   - **Per-unit packages** (e.g. `verify.cortex.u{N}-{slice}` — one package
     per unit): the next unit needs its OWN stage 4 (`04-uvp-transcribe`)
     before stage 5.
   - **Shared package**: compare the next outcome's actual suites, checklist
     items and view against the current contract. Run `04-uvp-transcribe` for
     its affected delta when obligations changed or remain stubbed. Skip it
     only when that exact package obligation is already current and complete.
   Read the contract / the `04` handoff banner to decide; state which.

### Phase 2 — Stub graduation gate
5. Is the next unit's contract section a full authored unit or a STUB? If
   STUB: **STOP and route to `research-to-contract`** — that unit's section
   must graduate to FULL (one stage-2 re-invoke for this unit) before its
   beads can be created. Do not let stage 4/5 run against a stub. (Units
   already authored FULL for the selected outcome skip
   this.)

5b. **⛔ GRADUATE THE PACKAGE TOO — a contract stub has a PACKAGE HALF.**
   Graduating §N alone is only half the job, and the missing half is invisible
   until the gate cannot close. A shared package may still carry rows authored
   against earlier intent: placeholder items, incomplete assertions or a
   `graduation-pending` marker. Compare item identities and obligations, not
   only counts. Check EVERY suite the graduated unit
   owns, against the live instance:
   use the installed `verify checklist list` and `verify get` commands against
   the recorded instance. Compare each required claim and runtime item identity;
   counts alone do not establish coverage.
   If stubbed: **STOP and route to stage 3 (`contract-to-uvp`) for a
   unit-scoped re-transcription** BEFORE beads. Do not let stage 4/5/6 run
   against stub suites: they turn **vacuously green** (a stub `negative_assertions`
   asserts nothing), which is the exact class every gate review exists to kill.

   > **Real incident (2026-07-15, U2).** Stage 3 transcribed U2's rows as stubs
   > and left a written note — "graduates at the U2 09 boundary". The boundary
   > graduated the contract, scoped itself "contract-doc-only", and nobody
   > carried the package half. The bead audit caught it only at stage 5, after
   > 12 beads had been authored against suites that could not close their gate.
   > **A written instruction with no named owner is not a plan.** U0/U1 never
   > exposed this seam because they were authored FULL at contract time — the
   > first stub-at-transcription unit is where it bites.
   >
   > Inspect the live carryover/staleness audit before routing work. Preserve
   > unchanged item identities, relevant inputs and evidence obligations;
   > invalidate changed acceptance. Do not assume a same-ID edit wipes all
   > proof, or promise retention without reading the actual lifecycle result.

### Phase 3 — Re-prime the prompts + advance the cursor
6. Re-prime the per-unit prompts for the next unit (titles/banners + the
   `{ENRICHMENT:unit-map}` block): `05-beads-create.md`, `06-beads-audit.md`,
   `07-execution-prep.md`, and `04-uvp-transcribe.md` whenever its affected
   package delta needs authoring, including shared packages. Keep
   them single files (never `-u<N>` duplicates). Set the next unit's id, its
   one-line scope, and the **capability dependency reminder**: name each
   consumed capability and its producing proof/bead. Add an edge only when
   that consumption requires it, never merely to the preceding numbered gate.
7. Update `00-pipeline-guide.md` with each unit's actual state. Mark DONE only
   where the required gate really closed; retain open obligations when another
   capability-ready outcome starts. Name the literal next action and owner.

When advancing for real, update relevant board entries after a meaningful result,
block or steering decision: actual unlock, evidence/revision, remaining limitation
and next action. Name the board and IDs in the refreshed guide/prompts. A read-only
“what next” request remains read-only. No routine board rewrite or extra tests are
needed when the milestone facts are unchanged.

### Phase 4 — Report
8. One tight report: "Current unit states = <actual open/closed evidence>. Next outcome = U<next>
   (<scope>). Package model = <per-unit | shared>. Stub graduation =
   <needed → run research-to-contract first | not needed, authored full>.
   Required capability edges: <consumer> → <actual prerequisite proof/bead>.
   LITERAL NEXT ACTION: fresh session → <04|05> for U<next>."

## Guardrails

- Read-only by default if the user only asked "what's next" — re-prime/write
  only when advancing for real.
- NEVER create beads, packages, or code here, and NEVER skip a stub
  graduation to "save a step" — a stub-fed stage 4/5 produces drift.
- Single-file discipline holds: re-prime in place, no per-unit file copies.
- If the package model is ambiguous, read the contract's UVP Package Spec
  section and the `04` handoff banner before deciding — do not guess.

## Final Response Shape
Actual capability readiness and open obligations · next unit + scope · package model ·
stub-graduation verdict · dep-edge reminder · prompts re-primed (list) ·
guide cursor advanced · literal next action.
