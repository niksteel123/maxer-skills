---
name: contract-next-unit
description: "Unit-boundary ADVANCE step for the contract-first pipeline. Run ONCE after a unit greenlights, before the next unit's cycle: confirm the prior unit closed, pick the next unit from the contract unit map, graduate its contract stub if it is still a STUB (route to research-to-contract), re-prime the per-unit prompts (04/05/06/07-prep) and advance the 00-pipeline-guide cursor to the next unit, then report the literal next action. Handles BOTH package models — per-unit packages (04 re-runs per unit) and one shared package (04 is one-time, next unit starts at 05). Use when: 'advance to next unit', 'next unit', 'move to U<N>', 'unit boundary', 'what's next after this unit greenlit'. Writes ONLY the pipeline prompt folder (prompt re-priming + guide cursor) — never beads, packages, or code."
---

# Contract Next Unit — The Unit-Boundary Advance

> You run between unit cycles: a unit just greenlit, and the next unit's
> prompts still name the OLD unit. Your job is to make the next paste
> unambiguous — advance the cursor, re-prime the prompts, and route stub
> graduation if needed. You do NOT create beads/packages/code; you set the
> table for the stages that do.

## The Contract-First Pipeline — 60-Second Orientation

| # | Stage (skill) | Produces | Done when |
| --- | --- | --- | --- |
| 1 | research-hardening | ideal source doc via stamped revisions | 7-item readiness bar = READY |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | validated TESTS.md package per unit | instantiated; ALL-RED never-run baseline |
| 4 | contract-to-beads | bead graph with proof classes per unit | 100% two-sided coverage; polish steady-state |
| 5 | contract-bead-audit | fresh-eyes audited bead graph | verdict READY |
| 6 | contract-to-execution | kickoff/push/sweep prompts; flat swarm runs | unit UVP greenlight via gate fix-loop |

Laws binding every stage:
1. The research doc is canonical. Downstream artifacts CITE it, never restate
   it. Conflicts resolve upward: code → package → contract → research.
2. A unit is complete ONLY on truthful UVP greenlight — never on narrative,
   bead acceptance criteria, or local tests alone.
3. Blocked is a valid truthful result; mocks never substitute for missing
   prerequisites.
4. Amendments: Class 1 (tighten/repair) = free + one log line. Class 2
   (weaken/redefine-pass) = recorded with research_basis. Red→green without a
   code change trips an automatic audit.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each stage writes exactly ONE artifact class.

**You are the UNIT-BOUNDARY step — between stage 6 greenlight and the next
unit's stage 3/4. Mission: advance the pipeline cleanly from the unit that
just closed to the next unit, so the operator's next paste is obvious and
correctly primed.**

## When To Use / NOT Use

- USE: right after a unit's gate bead greenlights, when you want the next
  unit teed up. Also fine to use to simply ANSWER "what unit is next and
  what do I run" without changing anything (read-only mode — say so).
- NOT USE: mid-unit (forward enrichment handles within-unit). To create the
  next unit's beads/package → that's stage 3/4, which this step points AT.
  After the FINAL/SPINE unit greenlights → `09-completion-sweep`, not this.

## Workflow

### Phase 0 — Confirm the boundary
1. Read `00-pipeline-guide.md` (the cursor) + the contract's Unit Map and
   shipping sequence.
2. Confirm the prior unit actually GREENLIT: its gate bead closed AND its
   package `verify greenlight` is green (or the guide records it). If it did
   NOT, STOP — you are not at a boundary; report what's still open. (Early
   advance is only valid if the user explicitly says so; note it.)

### Phase 1 — Identify the next unit + package model
3. Next unit = the first unit AFTER the just-closed one in contract order
   (respect hard sequencing, e.g. U0-before-U1, prerequisite gates).
4. **Package model** (decisive for whether stage 4 re-runs):
   - **Per-unit packages** (e.g. `verify.cortex.u{N}-{slice}` — one package
     per unit): the next unit needs its OWN stage 4 (`04-uvp-transcribe`)
     before stage 5.
   - **ONE shared package** for all units (e.g. Linux's single
     `verify.sandbox.linux-container-provider` covering M1–M4): stage 4 is
     ONE-TIME and already done — the next unit SKIPS 04 and starts at 05,
     consuming the existing instance and greening its assigned suites.
   Read the contract / the `04` handoff banner to decide; state which.

### Phase 2 — Stub graduation gate
5. Is the next unit's contract section a full authored unit or a STUB? If
   STUB: **STOP and route to `research-to-contract`** — that unit's section
   must graduate to FULL (one stage-2 re-invoke for this unit) before its
   beads can be created. Do not let stage 4/5 run against a stub. (Units
   authored FULL at contract time — typically the first one or two — skip
   this.)

5b. **⛔ GRADUATE THE PACKAGE TOO — a contract stub has a PACKAGE HALF.**
   Graduating §N alone is only half the job, and the missing half is invisible
   until the gate cannot close. **SHARED-PACKAGE MODEL ESPECIALLY**: stage 3
   runs ONCE, so it transcribed this unit's suites while its contract was
   still a STUB — the suites on disk are stub rows (placeholder items, stub
   `negative_assertions`, often a literal `graduation-pending` marker) that
   the now-FULL contract contradicts. Check EVERY suite the graduated unit
   owns, against the live instance:
   `verify get <instance> --format json | jq '.checklist_items | group_by(.suite_id)'`
   — a unit whose checklist carries 4 items where §N.9 requires 12 is a stub.
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
   > **Know the price before you route it**: re-transcribing edits suite files →
   > `suite_file_hashes` drift → `classify_stale_reasons` non-empty →
   > `should_rebaseline` → **the same-id path wipes EVERY earned green on that
   > instance**, not just the edited unit's. Cost compounds each boundary (U3
   > re-earns U0+U1+U2…). Surface the wipe cost and the re-earn plan in your
   > boundary report — the orchestrator decides, and it is a real decision.

### Phase 3 — Re-prime the prompts + advance the cursor
6. Re-prime the per-unit prompts for the next unit (titles/banners + the
   `{ENRICHMENT:unit-map}` block): `05-beads-create.md`, `06-beads-audit.md`,
   `07-execution-prep.md`, and `04-uvp-transcribe.md` ONLY if per-unit
   packages (for a shared package, leave 04's COMPLETE banner intact). Keep
   them single files (never `-u<N>` duplicates). Set the next unit's id, its
   one-line scope, and the **prerequisite dep-edge reminder** (the next
   unit's epic must be created blocking on the prior unit's gate bead, even
   though it's closed — the graph edge is still required).
7. Advance `00-pipeline-guide.md`: mark the prior unit DONE across its stage
   rows, set the next unit as the current execution unit, and name the
   LITERAL next prompt + "fresh session."

### Phase 4 — Report
8. One tight report: "Unit U<prev> closed/greenlit. Next unit = U<next>
   (<scope>). Package model = <per-unit | shared>. Stub graduation =
   <needed → run research-to-contract first | not needed, authored full>.
   Dep edge to add at epic creation: <next-epic> → <prior-gate-bead>.
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
Boundary confirmed (prev greenlit?) · next unit + scope · package model ·
stub-graduation verdict · dep-edge reminder · prompts re-primed (list) ·
guide cursor advanced · literal next action.
