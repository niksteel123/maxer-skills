---
name: contract-bead-audit
description: "Stage 5 of the contract-first pipeline. FRESH-SESSION audit of contract-pipeline beads before execution: mechanical preflight (br dep cycles, bv --robot-plan vs the contract's execution topology, proof-matrix consistency, labels vs work_unit_queries, citation/suite-id/path resolution) plus five judgment checks (fresh-agent implementability, reference accuracy, embedded-content fidelity, proof-class sanity, independent decomposition critique). Applies fixes via br. Cross-model capable. Use IN A FRESH SESSION when: 'audit the beads', 'bead audit', 'contract bead audit', after contract-to-beads and before execution."
---

# Contract Bead Audit — Fresh Eyes Before The Swarm Runs

> ULTRATHINK. In the contract-first pipeline, greenlight backstops
> CORRECTNESS — a bad bead set cannot ship a falsely-complete unit. What it
> CAN do is burn agent-days: mis-parallelized tracks, misread scope
> discovered as stubborn reds at bead 9 of 10, fresh agents thrashing on
> ambiguous context. This audit is the ECONOMY defense: catch in plan space
> for the cost of one read what execution space charges in days. Your value
> is precisely that you did NOT write these beads — stay adversarial.

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

Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

**You are stage 5 — mission: in a fresh session, find what the bead creators
went blind to — before the swarm pays for it in execution time.**

## Mandate

- Run in a session that did NOT create the beads (fresh context is the
  mechanism, not a nicety). Cross-model runs (Codex/Gemini) are encouraged
  as a final round.
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
     intersection with no dependency edge IS a finding**: reservations are
     exclusive, so those beads are serial in reality while the graph
     advertises them as parallel. Resolve: add the real `br dep` edge (they
     ARE sequential), or narrow the scopes (they only *looked* overlapping).
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
4. **Proof matrix consistency**: every suite/checklist suite in the package
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
3. **Embedded-content fidelity** — research excerpts verbatim (blockquoted,
   cited), not paraphrase-weakened; measurable criteria preserved EXACTLY;
   zero "post-MVP"/"simplified"/"nice to have" language anywhere
   (DO NOT OVERSIMPLIFY — any scope-reduction phrasing is CRITICAL).
4. **Proof-class sanity** — scaffolding beads claim no greening in their AC;
   `turns-green` beads sit AFTER their feeders in the graph and verify via
   `verify run`, not local tests; the gate bead embeds the full fix loop
   (JIT fix beads, 5-stalled-iteration escape valve, verdict workflow,
   tool-to-medium matrix, blocked-is-valid, realism rule).
5. **Independent decomposition critique** — is this the BEST decomposition,
   or merely A valid one? Could tracks parallelize further? Are there
   implicit dependencies not captured? What would you do differently from
   scratch? Document reasoning even when concluding "no change".

## Phase 3 — Severity + Fixes

| Severity | Examples | Action |
|---|---|---|
| CRITICAL | uncovered clause, invented scope, scope-reduction language, contributes-bead claiming greening, cycle, suite with no owner | Fix before anything else |
| HIGH | paraphrased AC, ghost references, false dependency serializing a track, gate bead missing fix-loop parts | Fix before execution |
| MEDIUM | thin Background/WHY, vague Technical Approach, label gaps | Fix if quick |
| LOW | naming/style | Note only |

Apply fixes via `br update` / `br create` / `br dep add|remove`; batch into
one commit; `br sync --flush-only && git add .beads/ && git commit && git push`.

## Phase 4 — Report + Verdict

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
