---
name: contract-to-beads
description: "Stage 4 of the contract-first pipeline. Create execution beads from an execution contract unit using the br CLI: research-clause inventory, track clustering per the contract's execution topology, PROOF CLASSES (contributes / turns-green / gate), five-question bead anatomy with Background/WHY, a proof assignment matrix (every suite gets a turns-green owner), gate bead with the UVP fix-loop, then polish-to-steady-state and mechanical graph validation (br dep cycles, bv --robot-plan). Use when: 'create beads from the contract', 'contract to beads', bead creation in the contract-first pipeline. Writes ONLY beads (+ proof matrix file)."
---

# Contract To Beads — Work Assignments Against A Living Proof Contract

Beads assign useful work against current requirements and proof obligations.
Include enough context to execute and cite the canonical sources. UVP gates
still need valid consumers and evidence; a green flag alone does not rule out
a badly scoped proof. Review unresolved risk, then obtain representative feedback.

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
4. Record amendment evidence and the actual proof impact. Design revisions and
   owner steering may change current intent; weakened acceptance needs an explicit
   basis and review. Inspect changed obligations and carryover before claiming
   retention. A red-to-green criteria change needs review of what earned it.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each normal stage has one primary artifact class. Substantial steering pauses
   affected dispatch and reconciles all affected artifact classes together.

Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

**You are stage 4 — mission: convert one contract unit into a bead graph a
flat swarm can execute without thrash — every bead self-contained, every
suite owned, every dependency real.**

## Position And Write Targets

```
contract-to-uvp → [contract-to-beads] → contract-bead-audit → contract-to-execution
                   (run once per unit)
```

Writes: beads via `br` (NEVER `bd`), plus one proof-matrix file in the
pipeline prompts folder. May add Class 1 lines to the contract's Amendment
Log (e.g., topology refinement). Nothing else.

Supersedes `beads-from-sources` for this pipeline. Use task anatomy and graph
hygiene from the installed Beads tooling. This contract workflow owns its
review/steering policy; optional legacy templates do not add review quotas or
duplicate the canonical plan into tasks. Source documents remain authoritative
and proof lives in the package.

## Where Bead Content Comes From (the three-source rule)

| Bead section | Source | Mode |
|---|---|---|
| Scope / requirements | Current RESEARCH DOC sections named by the contract | cite exact requirements; include a short faithful excerpt where needed to execute |
| Background (WHY), Technical Approach, Gotchas | CONTRACT (study map, non-negotiables, topology) + research rationale | embedded |
| Tests / proof obligations | UVP PACKAGE (suite ids, fixed test names, checklist item ids) | REFERENCED — never restated |
| Labels | package `bindings.work_unit_queries` | mechanical match |

**Study-map gap rule:** if a bead's surface is missing or thin in the
contract's Codebase Study Map, do the targeted research NOW, add the
findings to the CONTRACT's study map (Class 1 amendment + log line), then
embed in the bead. Pre-research lives durably in the contract — a bead must
never carry unsourced integration research that the next unit's beads would
have to rediscover.

## Workflow

### Phase 1 — Inventory

1. Read the contract unit completely: scope boundary, topology, package
   spec, scenario, close gate. Read the research sections the scope boundary
   cites. Confirm the package exists, validates, and its instance id +
   delta baseline and actual carried/reset/new disposition are recorded
   (if not → run contract-to-uvp for the affected obligations first).
2. Build the unit's **clause inventory**: every research clause in scope,
   listed with its citation. This is the 100%-coverage denominator.

### Phase 2 — Cluster Into Tasks Along Tracks

Group clauses into task beads along the contract's Execution Topology tracks
(surface clusters = tracks). One coherent implementation surface per bead.
Honor: shallow dependency chains (deep chains serialize the swarm), explicit
ALL blocking relationships, no "it's obvious" omissions.

Reuse the existing feature/unit hierarchy and task identities. A gate blocks
only work that consumes its delivered capability; unit numbers do not impose
an order. Preserve unrelated open obligations when another outcome can proceed.
`br dep add <child> <parent>` means CHILD DEPENDS ON PARENT; inspect the actual
edge after adding it. Temporary file/build/device contention belongs in live
placement and reservations.

### Phase 3 — Proof Class Assignment

Every bead declares exactly one class; AC is class-determined:

- **`contributes`** (most beads — scaffolding/building): AC = local gates
  ONLY (compiles, unit tests written+green locally, conventions, no-hardcode
  clean). Lists which suites its work FEEDS (trace). **Structurally
  forbidden from claiming any suite green.**
- **`turns-green`** (whenever a coherent capability can earn proof): AC includes named suites
  green **via `verify run` against the recorded instance — not just local
  tests**; expected to fix relevant work as needed. Assign an early representative
  proof owner instead of reserving all product feedback for the last few beads.
- **`gate`** (exactly one per unit): runs the scenario + verdicts + fix-loop
  to greenlight (template below).

**Proof Assignment Matrix** — write it as a literal table to
`docs/plan-hub/prompts/<feature>-contract-pipeline/<unit>-proof-matrix.md`:
rows = suites + checklist suites; columns = owning turns-green/gate bead,
feeding contributes beads. Invariants: every suite has ≥1 turns-green owner;
every bead appears with a class; no contributes bead in an owner cell.

| Suite / checklist | turns-green / gate owner | Fed by (contributes) |
| --- | --- | --- |
| `u1.projection-replay` | T-U1.7 | T-U1.1, T-U1.2 |
| `u1.live.journey-loop` | G-U1 (gate) | T-U1.3, T-U1.4 |

### Phase 4 — Bead Authoring (anatomy template)

Keep each work item tied to a useful outcome or proof required for its actual use.
Do not mint speculative failure/recovery tasks merely because a reviewer imagined
them. If existing proof work overreaches current intent, route an explicit contract
amendment; do not silently omit required checks from the graph. Carry the named
product result and bounded proof/stop condition into fix and gate briefs so workers
can choose the next useful repair rather than only chase test counts.

```markdown
# <T-<unit>.<n>> — <actionable title>
Labels: <feature>, <feature>-u<N> [, fix]      ← MUST match work_unit_queries
Class: contributes | turns-green | gate
Files (best-effort): <paths this bead is EXPECTED to edit; "+ new: <what>" if
                      it will create files that do not exist yet>

> `Files:` is a **planning HINT, not a contract** — and everyone downstream
> must treat it that way. It is written before the work exists, so it is
> often incomplete: some files are CREATED ad hoc as the plan unfolds.
> Its one job is to seed the fleet's INITIAL staffing guess (before any lane
> runs there is no live reservation data). Once lanes run, **live agent-mail
> reservations are the truth**, not this field.
> Declare narrowly and honestly, and say when you expect to create files.
> A declared overlap is a placement/reservation constraint. Add a `br dep`
> edge only when one bead consumes the other's output or capability; otherwise
> live reservations serialize the conflicting edits. A CLEAN
> declaration proves nothing — the collision may only appear at runtime, which
> is why the fleet is sized just-in-time (see the `fleet-controller` skill).

## SOURCE OF TRUTH
- Research (canonical): <path> §<sections>      [pinned revision]
- Execution contract: <path> Unit <U> §<sections>
- Validation contract: test-packages/<slug> — instance <id>
  This bead [feeds | must turn green]: <suite ids / item ids>

## Background
<2–4 sentences of WHY from research: why this exists, which invariants make
it load-bearing, how it serves the feature. Agents who know the intent make
better calls than agents who follow steps.>

## Scope
<exact current requirement citations with enough context to execute; use short
faithful excerpts where needed. Preserve criteria without copying the whole plan.>

## Technical Approach
<from the contract study map: files to create/modify, shipped patterns to
copy (file + what to mirror), integration seams, reality-to-verify claims
relevant to this bead ("the code wins").>

## Tests
contributes → unit tests this bead writes (real assertions, no mocks-as-proof)
              + "feeds suites: <ids>"
turns-green → the package's FIXED test names + suite ids to make green
gate        → the scenario reference + verdict workflow

## Acceptance Criteria
<class formula — see Phase 3. Always ends with: no-hardcode scan stays clean;
commit + push (work is not complete until push succeeds).>

## Gotchas & Considerations
<NFR rules from research (concurrency, determinism, performance budgets),
contract non-negotiables that bite here, known edge cases.>

## Dependencies
Blocked by: <ids> · Blocks: <ids> · Track: <topology track>
```

Anti-patterns (from beads-workflow, enforced): too short, too vague, missing
deps, OVERSIMPLIFIED (lost complexity), test-ids-without-context, AC that a
no-op implementation could satisfy.

### Phase 5 — Gate Bead (template, one per unit)

Create it as `--type task` with a `gate` label and Class: gate — it MUST
appear in the swarm's scoped ready queue (`br ready ... --type task`) once
its dependencies close, so any agent can claim it. A gate bead typed as
epic/chore is invisible to the swarm and never runs.

Mission: execute the unit scenario end-to-end on the REAL fixture subject,
retain required evidence, set the required checklist verdicts with usable
evidence refs, and earn the unit view's current automated/checklist obligations.
Repair runs select affected suites; the complete applicable gate runs on a stable
candidate. Unrelated surface-package suites do not become an implicit unit gate.

Embed verbatim in the gate bead:
- the close gate conditions;
- the verdict workflow (`verify run` → `checklist pass start` → `verdict set
  --evidence-ref` → `pass finish` → `greenlight`);
- the Verification Prerequisites tool-to-medium matrix (which tools to
  invoke: verify-ops, agent-browser, second clean-context session, …);
- **THE FIX LOOP**:

```
ON RED GREENLIGHT — do not grind solo, do not close anything:
1. Cluster failures by suite/root-cause (not one bead per assertion).
2. JIT-draft fix beads: `F-<unit>.<seq> — <suite-id>: <summary>`;
   labels = unit labels + fix + <suite-slug>; body embeds failure evidence
   (run id, failing assertions, evidence refs), root-cause hypothesis,
   SOT block; class = turns-green for the red suite(s).
3. `br dep add <gate-bead> <fix-bead>` for each → gate re-blocks itself.
4. Announce on the unit AgentMail thread; fix beads claimable by ANY agent.
5. Re-run the exact failing tests or affected suite first. Inspect the read-only
   execution plan; do not repeat a broad gate merely because a fix closed.
   Run the broader pre-close proof once its affected inputs are stable.
6. Reflect when a premise is contradicted, failure repeats without new
   information, a feedback/time budget is missed, or the user steers. Pause
   affected dispatch, checkpoint work and evidence, reconcile intent and the
   affected artifact table, then resume the valid capability frontier. Do not
   wait for a fixed stall count or weaken acceptance merely to obtain green.
```

Plus: truthful blocked states, real-subject scenario proof, labeled deterministic
test fixtures, and amendment review based on changed obligations and evidence.

### Phase 6 — Graph Mechanics

```bash
br dep cycles                      # MUST be empty
bv --robot-insights | jq '.Cycles, .bottlenecks'
bv --robot-plan                    # computed parallel tracks
```

Diff `bv --robot-plan` tracks against the contract's Execution Topology:
divergence means false/missing dependencies (fix beads) OR wrong topology
(Class 1 amendment in the contract log). Resolve before proceeding.

### Phase 7 — Coverage Gate (BLOCKER, two-sided)

- Every current clause in the Phase 1 inventory → ≥1 bead citing it. 100%.
- Every suite/checklist suite → ≥1 turns-green/gate owner. 100%.
- Every bead → declared class + labels matching `work_unit_queries`.
Any gap: fix now. An incomplete bead set is worse than none.

### Phase 8 — Polish To Steady State

Run a focused review of implementability, proof ownership and real dependency
edges. Repeat only to resolve a finding or examine new evidence; there is no
round quota. Use this prompt as a checklist rather than a repetition mandate:

> Re-read the execution contract's Unit <U> sections so they are fresh in
> your mind. Check over each bead super carefully — does it make sense? Is
> it optimal? Could a fresh agent with ZERO context implement it? Is every
> embedded research excerpt verbatim and cited? Does every bead's class
> match its AC (contributes = local gates only, never claims greening;
> turns-green = named suites via verify run)? Does the proof matrix still
> hold? DO NOT OVERSIMPLIFY. DO NOT LOSE ANY FEATURES OR REQUIREMENTS. It is
> far cheaper to fix beads in plan space than during execution. Use ONLY
> `br` to create/modify beads and dependencies. ULTRATHINK.

Stop when the applicable checks pass and remaining uncertainty is explicit.
Use an independent audit where risk warrants it. During execution, update
affected beads through the recorded reconciliation transaction; preserve IDs
and provenance and keep unaffected work running.

### Phase 9 — Sync + Hand Off

Follow repository task-export and Git policy. Inspect the export for exactly the
intended task IDs and changes; do not stage the entire task directory or chain a
printed review with commit. In a shared checkout use the repository's isolated
index/commit mechanism and review the staged allowlist before committing.

Update `00-pipeline-guide.md`; write `05-beads-create.md` (re-run prompt for
the next unit) and `06-beads-audit.md` — a SELF-CONTAINED fresh-session
prompt invoking `contract-bead-audit` with all paths/ids embedded (contract
doc path + unit id, research doc path + pinned revision, package slug +
verify instance id, proof-matrix path, root/unit epic ids), ending with its
copyable fresh-eyes prompt as the final section. FORWARD ENRICHMENT: if
`07-execution-prep.md` exists, fill its `{ENRICHMENT:epic-ids}`,
`{ENRICHMENT:matrix-path}`, and `{ENRICHMENT:bead-counts}` markers.

## Final Response Shape

LEAD WITH UNIT FRAMING, loudly: "Created beads for unit <X> ONLY — unit
<n> of <M>. Later units' beads are intentionally NOT created yet (JIT by
design: they would rot while earlier units' execution amends the
contract). Re-run this same prompt per unit when each becomes current per
00-pipeline-guide." · Bead counts by class + epic/root ids · matrix path + invariant check results
· cycles/robot-plan results + topology diff outcome · coverage gate (clauses
%, suites %) · polish rounds run + steady-state declaration · prompts
emitted · next action (contract-bead-audit in a FRESH session).
