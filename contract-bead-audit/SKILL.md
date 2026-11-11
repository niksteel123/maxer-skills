---
name: contract-bead-audit
description: "Stage 5 of the contract-first pipeline. FRESH-SESSION audit of contract-pipeline beads before execution: mechanical preflight (br dep cycles, bv --robot-plan vs the contract's execution topology, proof-matrix consistency, labels vs work_unit_queries, citation/suite-id/path resolution) plus five judgment checks (fresh-agent implementability, reference accuracy, embedded-content fidelity, proof-class sanity, independent decomposition critique). Applies fixes via br. Cross-model capable. Use IN A FRESH SESSION when: 'audit the beads', 'bead audit', 'contract bead audit', after contract-to-beads and before execution."
---

# Contract Bead Audit — Fresh Eyes Before The Swarm Runs

Use fresh context to find task/proof mistakes that would delay useful product
feedback. Verify real consumer wiring, coherent outcomes and executable proof;
a green gate with a vacuous scope can still misrepresent product readiness.

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
   and review. Inspect carryover and the changed claims before accepting green.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each normal stage has one primary artifact class. Substantial steering pauses
   affected dispatch and reconciles all affected artifact classes together.

Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

**You are stage 5 — mission: in a fresh session, find what the bead creators
went blind to — before the swarm pays for it in execution time.**

## Mandate

- Run in a session that did NOT create the beads. Select its model through
  fleet-controller and the current registry across eligible providers; fresh
  context establishes reviewer independence, not a provider name. Do not add
  another review round solely to use a different model.
- Discovery entry point:
  `docs/plan-hub/prompts/<feature>-contract-pipeline/00-pipeline-guide.md`
  names every artifact and id; start there (or from the `06-beads-audit.md`
  prompt that invoked you). Inputs to read: the execution contract (unit
  sections), the research doc sections the unit cites, the UVP package
  (`test-packages/<slug>/TESTS.md` + suites), the proof matrix file
  (`docs/plan-hub/prompts/<feature>-contract-pipeline/<unit>-proof-matrix.md`),
  and the beads (`br list --json`, `br show <id>` — use `br`, never `bd`).
- Write targets: bead fixes via `br` (single batched commit), audit report
  in the pipeline prompts folder, Class 1 lines in the contract Amendment
  Log where the contract itself needed repair.

## Phase 1 — Mechanical Preflight (commands, not judgment)

0. **Sequencing**: confirm via `00-pipeline-guide.md` that pass-2 contract
   validation (`03-contract-validate`) actually ran. If it did not, record
   that as a finding and proceed — this audit checks BEADS against the
   contract; it does not substitute for validating the contract itself.
1. **Cycles**: `br dep cycles` → MUST be empty.
2. **Graph health**: `bv --robot-insights | jq '.Cycles, .bottlenecks'` —
   flag serializing chains (deep chains = false sequencing).
2b. **HIDDEN SERIAL check (declared file scopes vs dep edges)** — an
   ASYMMETRIC check; read the asymmetry carefully:
   - For every pair of beads that could be READY simultaneously (no dep path
     between them), intersect their declared `Files:` scopes. **A non-empty
     intersection IS a placement finding**: exclusive reservations can prevent
     concurrent edits. Narrow scopes or schedule the conflicting edits through
     live reservations. Add a `br dep` edge only when one bead consumes the
     other's delivered capability; temporary file contention is not a permanent
     product dependency.
   - **A clean intersection proves NOTHING.** `Files:` is a pre-work
     prediction; files get created ad hoc as the plan unfolds, so runtime
     collisions can exist that no declaration foresaw. **Do not report "no
     hidden serialisation" — report "no *declared* overlap"**, and never let a
     clean result justify a bigger fleet. Runtime sizing is the
     `fleet-controller`'s job, from live reservations.
   - A bead with no `Files:` at all is a minor finding (it costs the initial
     staffing guess its only input), not a blocker.
3. **Topology diff**: `bv --robot-plan` computed tracks vs the contract's
   Execution Topology (if `bv` is unavailable, derive tracks manually from
   `br dep list`/`br dep tree` output and note the manual derivation in the
   report — never skip the diff silently). Divergence = false/missing deps (fix beads) OR stale
   topology (Class 1 contract amendment). Resolve every divergence.
4. **Proof matrix consistency**: every suite/checklist suite in the unit's current view
   has ≥1 `turns-green`/`gate` owner; every bead appears with exactly one
   class; no `contributes` bead occupies an owner cell.
5. **Labels**: every bead's labels ⊇ the package `bindings.work_unit_queries`
   labels (grep the TESTS.md frontmatter; mismatch = bead invisible to the
   proof contract).
6. **Reference resolution**: every cited research section heading exists in
   the research doc (grep); every suite id / item id / fixed test name in
   beads exists in the package; every file path in Technical Approach
   sections exists or is explicitly marked "to create".
7. **Coverage re-diff**: independently re-derive the unit's clause inventory
   from the research doc via the contract's scope boundary; diff against the
   union of bead Scope sections. Uncovered clause = CRITICAL (silent scope
   cut). Bead content with no clause = invented scope (CRITICAL).

## Phase 2 — Judgment Checks (the five that can't be mechanized)

1. **Fresh-agent implementability** — for each bead: could you, with ZERO
   session context beyond this bead, implement it? Is anything load-bearing
   only in the creator's head? Are patterns pointed at concrete files? If
   implementing would force you to GUESS integration details (wiring
   points, boundary types, registration seams), the root cause is usually a
   thin contract Study Map — route that finding as a contract Class 1
   (enrich the map), not merely a bead edit, so the fix benefits every
   later unit.
2. **Reference accuracy in spirit** — do the cited sections actually SAY
   what the bead claims they say (not just exist)? Spot-read.
3. **Requirement fidelity** — citations resolve to current authorized intent;
   excerpts and measurable criteria remain faithful. Judge the actual obligation
   change and its authority, not prohibited words. Owner steering or a justified
   redesign may revise scope; silent omission or weakened proof to obtain green
   is a finding. Check affected-artifact reconciliation and preserved evidence.
4. **Proof-class sanity** — scaffolding beads claim no greening in their AC;
   `turns-green` beads sit AFTER their feeders in the graph and verify via
   `verify run`, not local tests; the gate bead embeds the full fix loop
   (JIT fix beads, evidence-triggered reflection and reconciliation, verdict workflow,
   tool-to-medium matrix, blocked-is-valid, realism rule).
5. **Independent decomposition critique** — is this the BEST decomposition,
   or merely A valid one? Could tracks parallelize further? Are there
   implicit dependencies not captured? What would you do differently from
   scratch? Document reasoning even when concluding "no change".

## Phase 3 — Severity + Fixes

| Severity | Examples | Action |
|---|---|---|
| CRITICAL | uncovered current clause, unauthorized scope change, contributes-bead claiming greening, cycle, required suite with no owner | Fix before affected execution |
| HIGH | paraphrased AC, ghost references, false dependency serializing a track, gate bead missing fix-loop parts | Fix before execution |
| MEDIUM | thin Background/WHY, vague Technical Approach, label gaps | Fix if quick |
| LOW | naming/style | Note only |

Apply affected fixes through the actual task plane. Check supported CLI flags,
the task/edge identities and the export diff. Follow repository allowlist and
shared-checkout Git policy; inspect the staged candidate in a separate step
before committing. Do not broadly stage the task directory or rewrite peers'
provenance to close this audit.

## Phase 4 — Report + Verdict

Check whether the graph's proof work protects the current product promise or
invents optional future hardening. Required consumer defects remain findings;
speculative cases do not automatically become fix beads. Route overgrown contract
obligations for explicit amendment, preserve honest open states, and stop review
when material findings are resolved or clearly routed. No additional audit quota.

Write `<unit>-bead-audit-report.md` into the pipeline prompts folder:
executive summary, findings by severity with bead ids, fixes applied,
topology-diff outcome, coverage numbers (clauses %, suites %), reasoning
notes from check 5. Update `00-pipeline-guide.md`. FORWARD ENRICHMENT: if
`07-execution-prep.md` exists, fill its `{ENRICHMENT:audit-verdict}` marker
(verdict + findings summary + anything execution prep must know).

Verdict: **READY** (proceed to contract-to-execution) · **FIXED-READY**
(fixes applied, re-run preflight passed) · **BLOCKED** (findings need the
creator session or human — name exactly what).

## What This Audit Is NOT

- Not a re-run of contract validation (pass 2 already attacked the
  scenarios/UVP specs — don't re-litigate the contract, audit the BEADS
  against it).
- Not the correctness gate (greenlight is). Don't inflate findings to feel
  useful; an honest "READY, two MEDIUMs fixed" is a great outcome.
- Not a polish round. If the bead set needed wholesale rework, the finding
  is "return to contract-to-beads Phase 8", not 40 individual edits.

## Final Response Shape

Verdict · findings count by severity · fixes applied (bead ids) · coverage
re-diff result · topology-diff result · report path · next action.
