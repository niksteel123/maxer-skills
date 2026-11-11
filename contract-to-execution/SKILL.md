---
name: contract-to-execution
description: "Generate execution prompts for contract-pipeline beads with live coordination, scoped proof, targeted repair, evidence-triggered reflection and affected-artifact reconciliation. Use for execution kickoff, beads execution or starting the swarm. Normal output is the pipeline prompt folder; substantive steering reconciles its affected consumers."
---

# Contract To Execution — The Flat Swarm

> ULTRATHINK on the prompts, because they ARE the management layer. There is
> no manager agent and no goal loop: N agents run the SAME kickoff prompt,
> coordinate through AgentMail + reservations, and the unit closes only when
> its gate bead reaches truthful UVP greenlight. Everything an executing
> agent must know lives in (a) the bead it claimed and (b) the kickoff
> prompt — design both as if nothing else will ever be read, because it won't.

## The Contract-First Pipeline — 60-Second Orientation

| # | Stage (skill) | Produces | Done when |
| --- | --- | --- | --- |
| 1 | research-hardening | grounded current intent and explicit assumptions | ready for the named next outcome or bounded experiment |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | validated package or affected package delta | new-obligation baseline and actual carryover reconciled |
| 4 | contract-to-beads | bead graph with proof classes per outcome | coverage and actual capability dependencies verified |
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
4. Amendments: Class 1 (tighten/repair) = free + one log line. Class 2
   (weaken/redefine-pass) = recorded with research_basis. Red→green without a
   code change trips an automatic audit.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each normal stage has one primary artifact class. Substantial steering pauses
   affected dispatch and reconciles all affected artifact classes together.

Stage numbers identify artifact roles, not ordinal dependencies between units.
Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

**You are stage 6 — mission: compile the operating policy into prompts so
good that N identical agents plus one gate loop replace a manager and a goal
runner.**

## Position And Write Target

```
contract-bead-audit → [contract-to-execution] → agents run → gate fix-loops
                                                → unit greenlights → next unit
                                                → SPINE/final unit → 10-completion-sweep
```

Writes ONLY into `docs/plan-hub/prompts/<feature>-contract-pipeline/`:
`07-execution-kickoff.md`, `08-execution-push.md`, `10-completion-sweep.md`,
and a status update in `00-pipeline-guide.md`. Supersedes the legacy
`beads-to-execution` (its deep-research phase moved upstream into the
contract's pre-research maps — do NOT redo codebase research here; point at
the contract).

## Phase 1 — Gather (read, don't research)

Read: contract doc (unit map, topology, Verification Prerequisites,
amendment protocol), package TESTS.md (instance ids, labels, suites), proof
matrix, audit report verdict (must be READY/FIXED-READY), root/unit epic ids
(`br list --json`). Confirm AgentMail server availability and the evidence
run-root convention.

If a product board is named by repository instructions or the guide, read its
relevant milestone IDs, prerequisites, completion policy and current decisions.
Check that the contract and board agree for this outcome; route a substantive
conflict to affected-scope reconciliation rather than silently picking one.

## Product-board reminders in generated prompts

For a participating track, put the actual board path/link and milestone IDs into
07, 08 and 10. Instruct the coordinator to reread relevant entries at start/resume,
next-outcome selection and before relying on a changed prerequisite; update after
meaningful results, blocks, milestone closure and reflection. Follow
[product-board](../product-board/SKILL.md): Achieved requires the promised product
behavior and applicable evidence/review, not unit/PR closure alone. Final sweeps
report actual unlocks and outstanding milestone obligations. Changed promises
require an affected-ID check and matching plan/contract updates.

Workers retain their existing unit scope and report results to the coordinator;
they do not all edit the board after each bead. Prompts link the current board,
not a copied status snapshot. Omit this block when no board participates. This
skill authors execution instructions; it does not mark milestones achieved merely
because preparation is complete or add new UVP/CLI machinery.

## Phase 2 — Generate 07-execution-kickoff.md

Self-contained, identical for every agent, ~150–300 lines. Required
sections, with the policy embedded VERBATIM (not referenced):

**0. Unit + staleness banner (MANDATORY first lines of all THREE generated
files — 07/08/10)** — stamp the actual unit, epic, instance and accepted
obligations. Refresh affected prompts after reconciliation. Preserve active
unaffected prompt content and checkpoint references when re-priming shared
files; selecting a later outcome does not close earlier work.

```
> GENERATED FOR UNIT <unit_id> (<unit title>) — instance <id>, epic <epic>,
> gate <gate-bead>, obligations <contract/package revision + suite/item IDs>.
> STALENESS CHECK: compare these bindings with the recorded reconciliation for
> this work. Pause affected dispatch if a binding or required obligation changed
> and remains unreconciled. A later guide cursor alone does not invalidate this
> prompt, another active unit, or its retained checkpoint.
```

**1. Identity & boot**
- Register on AgentMail (`ensure_project`, `register_agent`,
  `set_contact_policy`), check inbox for situational awareness.
- Read THIS prompt fully + `00-pipeline-guide.md` pointers. Do not re-read
  the research doc cover-to-cover — your bead embeds what you need; the
  contract's pre-research map exists for deliberate lookups only.

**2. SCOPE LOCK (read before the work loop — this is non-negotiable)**
The repo's bead database holds MANY unrelated plans (other features, other
unit epics). YOUR scope is exactly ONE graph: descendants of the unit epic
`<unit-epic-id>` (root `<root-epic-id>`), every one carrying the labels
`<work_unit_queries labels>`. Hard rules:
- You may ONLY claim, reserve files for, or edit beads UNDER `<unit-epic-id>`
  (its task beads, its gate bead, and `F-<unit>.*` / gap beads created for
  it). A bead id outside `<root-epic-id>.*`, or missing the unit labels, is
  NOT YOURS — never claim it, even if `br ready` shows it.
- NEVER run an unscoped/bare `br ready` (it returns the GLOBAL queue across
  every plan and is how agents wander into unrelated features). ALWAYS the
  scoped query below. Before claiming ANY bead, verify its id is under
  `<root-epic-id>` AND its labels include the unit labels — if not, skip it.
- EMPTY/CONTENDED QUEUE = STOP, NOT WIDEN. If the scoped query returns
  nothing claimable (all done, in_progress, or blocked) and there is no
  ready gate/fix bead for THIS unit, you are idle-by-design: post a brief
  "idle — no claimable <unit> beads" note on the unit thread and STOP. Do
  NOT broaden scope, do NOT pick another plan's bead, do NOT invent work.
  A clean stop is the correct outcome; touching another feature is a
  stop-the-line error. (Your STOP is also how the fleet NARROWS at a
  sequential bottleneck — it is a feature, not a failure. Park your claim if
  a SOFT dependency blocks you — a claimed bead leaves the correctly filtered frontier, so the
  orchestrator will not mis-staff it — and say what you are waiting on.)

**JIT BEAD REPORTING (the fix-loop widening — do not skip this)**
When you FILE a JIT fix bead (defect found, gate-loop finding), report
`JIT BEADS FILED → <ids>` to the orchestrator. This matters most exactly when
it feels least urgent: by fix-loop time the lanes have drained (empty-queue=
STOP did its job) and one agent is holding the unit — so a pile of fix beads
gets ground through SERIALLY even when several are trivially disjoint (a CI
allowlist, a shell script, a test file). The frontier just widened at the
moment the fleet was smallest; say so, and let the controller re-staff.

**FRONTIER SENSOR (mandatory — this is how the fleet sizes itself)**
The bead graph is the schedule; the claimable frontier's width is the exact
useful parallelism. It moves ONLY when a bead closes — and YOU are the first
to know. So **after every `br close`**: re-run the scoped ready query and
compare `|ready|` against the number of active lanes (the unit thread's
roster). If the frontier is now WIDER than the active fleet, notify the current
controller: `FRONTIER WIDENED → <n> claimable: <ids>` and keep working
(claim the highest-value one yourself — most transitive dependents first).
Do not spawn agents; the orchestrator owns the fleet. This one report is what
prevents beads sitting unowned while a lone lane grinds — the single biggest
throughput leak in a swarm, and invisible from the inside without it.

**HIDDEN SERIAL reporting (the graph's blind spot).** `br ready` encodes
LOGICAL dependencies only — it does not know that two ready beads both edit
`service.rs` and are therefore serial, because file reservations are
EXCLUSIVE. If you cannot take a reservation your bead needs (a peer holds it),
you have found a resource dependency the graph missed:
1. PARK — keep your claim, do NOT start editing around the conflict, and do
   NOT reserve "half" the files and wait. (**Corrected 2026-07-16:** this
   step used to justify itself with "a claimed bead leaves `br ready`" —
   FALSE. `br ready` is dependency-readiness only and still lists claimed
   beads. Keep the claim anyway: it is what your `status`/assignee tells a
   correctly-written frontier query, and it is your park marker.)
2. Report `HIDDEN SERIAL: <your-bead> blocked on <files> held by <peer/bead>`
   on the unit thread AND to the orchestrator.
3. STOP cleanly (or work your bead's genuinely non-conflicting steps first,
   if any exist and you can do them without the reservation).
The orchestrator updates placement and reservations to resolve the collision.
Add a `br dep` edge only when one bead consumes another's required output or
capability. Repeated file contention alone does not create a dependency.

**Work loop**
```
br ready --limit 0 --parent <unit-epic-id> --recursive --type task --json
  (NEVER bare `br ready` — global queue, leaks other plans into your scope)
→ VERIFY in-scope: id under <root-epic-id>.* AND labels ⊇ unit labels
  AND status=="open" AND assignee is empty-or-yours   ← ⛔ NON-NEGOTIABLE
  (else SKIP; if nothing in-scope is claimable → STOP per SCOPE LOCK)
  ⛔ The status/assignee test is a COLLISION GUARD, not a nicety. `br ready`
     lists claimed beads (dependency-readiness only), and `br update --claim`
     is NOT compare-and-swap — a second claim silently overwrites the
     assignee with no error. Skip it and two lanes work the same bead on the
     same files. The claim is a LABEL, not a lock; reservations are the mutex.
→ read the bead COMPLETELY (it is self-contained; SOT block lists refs)
→ reserve files (file_reservation_paths, reason=<bead-id>; NEVER .beads/**)
→ re-read status/assignee; do not overwrite a peer claim; set your explicit
  assignee + in_progress status, read it back, announce on thread_id=<bead-id>
→ implement per Technical Approach; reconfirm reality-to-verify claims
→ local gates (build, unit tests, lint, scoped quality gates)
→ TARGETED BURNDOWN: inspect the plan and execute affected named suites
  (agent-swarm verify run --instance-id <id> --suite <suite-id>) and record
  the suite delta in your close note ("moved u1.projection-replay 3→1
  failing") — regressions you introduce are yours to fix NOW
→ commit + push (MANDATORY — work is not complete until push succeeds)
→ br close <id> --reason "<one-line outcome + burndown delta>"
  (the reason IS the close note: e.g. "projection core; u1.projection-replay
  3→1 failing"); br sync --flush-only; git add .beads/ + commit + push;
  release reservations; announce; loop
```

**3. Proof-class discipline** (embed the table)
- `contributes`: AC = local gates only. You may NOT claim any suite green.
- `turns-green`: AC = named suites green via `verify run` against instance
  `<id>` — local cargo test alone does not count. Fixing prior beads' work
  is in scope.
- `gate`: run the FIX LOOP below.

**4. Product progress and the gate fix-loop** (embed in coordinator/worker prompts):
At the existing coordination cadence, before more failure/recovery tests or another
review pass, name the next useful behavior and what decision the extra proof will
change. Use representative success plus failures material to the current promise;
do not invent future production hardening or combinatorial edge cases. Stop adding
checks when sufficient required evidence exists and advance the next useful work.
If the contract itself overreaches, reconcile it through explicit amendment before
changing required proof. Keep actual access, data, control and spend protections.
Use the existing checkpoint for a short decision, not a new audit form or timer.

For required gate failures:
red greenlight → cluster failures → JIT-draft `F-<unit>.<seq>` fix beads
(unit labels + `fix` + suite-slug; failure evidence + root-cause hypothesis
embedded; class turns-green) → `br dep add <gate> <fix>` (gate re-blocks) →
announce; fixes claimable by eligible in-scope agents → repair the affected
tests/suites first → run the required gate scope after candidate inputs settle.
Record execution evidence for each actual run. Contrary evidence, a missed
feedback/budget target, user steering, or repetition without new information
triggers reflection immediately: pause affected dispatch, checkpoint, reconcile
the affected-artifact table and resume valid work. A changed pass criterion needs
the Amendment Protocol and research_basis; a missing prerequisite is a truthful
BLOCKED result. No fixed stall count delays that decision.

**5. JIT defect & scope policy**: defect found in prior work → fix inline if
<30min and localized; otherwise draft a fix bead with evidence. Never silent
rework, never ignore. Work that belongs to NO bead: check the contract's
crosswalk — if a research clause is genuinely uncovered, draft a gap bead +
flag the unit thread; NEVER silently expand your current bead's scope, and
existing code never expands scope on its own.

**6. Verification prerequisites** (embed the unit's tool-to-medium matrix):
which tools execute which proof media — `verify-ops` for verdict mechanics,
`agent-browser`/Chrome MCP for browser items, bash-with-capture for CLI
evidence, a SECOND clean-context agent session for novice/fresh-agent items.
Evidence root: `evidence/<unit>/<run-id>/`; every checklist verdict cites
`--evidence-ref`; prose verdicts are invalid.

**7. Non-negotiables** (embed): greenlight-only unit closure · scenarios on
the REAL fixture subject only (synthetic = not a pass) · BLOCKED is a
truthful result when a required input or capability is unavailable after bounded
authorized recovery (see Initiative doctrine §7.5). Name the unblock condition
and continue independent work; a blocked verdict never mocks or fakes a green · no fixture-specific
logic in production code · amendment protocol (Class
1 free + log line; Class 2 full record with research_basis; red→green
without code change = tripwire; bead-set changes during execution are
fix/gap beads + recorded reconciliation) · reconcile canonical intent with
contrary evidence and user steering · STALE instances: if
`verify` reports the instance stale (research/contract doc or watched paths
changed), stop claiming or trusting suite results, surface it on the unit
thread, inspect affected inputs and carryover, and reconcile only changed
obligations before further green claims. Do not reset unaffected earned proof.

**7.5 Initiative & Blocker-Recovery Doctrine (embed VERBATIM — default = act,
not idle).** This is the section that prevents lazy BLOCKED and passive
idling. Initiative is the DEFAULT; drive the unit to greenlight.

1. DRIVE TO COMPLETION. Finish your bead → close + push → immediately pick the
   next ready in-scope bead → repeat. Never ask "what next," never stop after
   one bead, never report "nothing to do" while recovery is possible.
2. Investigate blockers and recover within the current authorization and
   ownership boundary. Preserve shared daemons, healthy children and conversation
   IDs. Inspect stale inputs/carryover before reinstantiation; repair the affected
   suite and run its targeted proof first. A retained artifact can be reused only
   when its relevant inputs still match. Classify transient, authentication,
   usage, capability and unknown-outcome failures before any bounded retry.
3. Report BLOCKED with the concrete missing prerequisite, attempted recovery and
   next condition that would permit progress. Never bypass qualification or fake
   a green. A contradicted premise, repeated failure without new information,
   missed feedback/time budget or user steering triggers reflection immediately:
   pause affected dispatch, checkpoint, reconcile the affected-artifact table,
   recompute real dependencies, then resume the valid frontier.
4. Reclaim only after checking authoritative claims, live reservations and actual
   process/outcome evidence. Silence, old commits or an expired lease alone do
   not prove abandonment. Preserve live work and coordinate a deliberate handoff.
5. IDLE IS LAST RESORT AND IS NOT "DONE." Idle only when there is NO
   recoverable in-scope blocker AND no stale in-scope bead to reclaim AND the
   gate isn't claimable — and even then prefer monitor-and-resume; the unit is
   not done until its gate greenlights.
6. SCOPE-LOCK still binds (orthogonal axis): max effort WITHIN your unit/plan,
   NEVER widen to another plan's beads. Recovering your daemon / reclaiming
   your stale bead = initiative; claiming another plan's bead = stop-the-line.

**8. Coordination — flat, no managers, NO COLLISIONS (embed VERBATIM).** Peers
via mail threads (thread per bead id) + file reservations. Agents must NOT walk
over each other — who you may claim:
- **READY + UNCLAIMED bead** → reserve its concrete files, re-read ownership,
  write your explicit assignee/status and verify the result. `br --claim` is not
  compare-and-swap; the live reservation and ownership recheck are required.
- **A bead BLOCKED by a dependency** → do NOT claim it directly. Instead DRIVE
  its blocker so it ships: if the blocker is a ready bead, take it; if the
  blocker is a recoverable infra/runtime failure, recover it (§7.5); if the
  blocker is a STALE in_progress bead (owner gone), reclaim and ship it. That's
  how you "unblock, fix, and ship" rather than passively waiting.
- **An in_progress bead under an ACTIVE peer** → LEAVE IT. Never claim, never
  reserve its files, never edit its surface — its owner will close it and the
  graph will unblock. Reclaiming is ONLY for VERIFIED-stale ownership (fetch
  inbox, check last activity + reservation expiry FIRST); when in doubt, assume
  active and leave it.
- File-reservation conflict → pick a different ready bead or coordinate via
  mail; never `--force`, never release another agent's reservation.
Stuck >30min on missing context: mail the thread, check the pre-research map,
then BLOCKED-flag — but only after §7.5 recovery is exhausted. Idle only when
nothing in-scope is claimable, recoverable, or reclaimable (never another
plan's beads); monitor-resume rather than terminate.

## Phase 3 — Generate 08-execution-push.md (~30–50 lines)

The continuation nudge for an agent already booted: re-check inbox → reconcile
your settled reservations without releasing live or unknown-outcome work →
re-run the SCOPED ready query (`--parent <unit-epic-id>`,
NEVER bare `br ready`) → if no ready task beads: check whether the gate bead
or a `F-<unit>.*`/gap bead for THIS unit is ready → land everything (push).
Must restate SCOPE LOCK verbatim (only beads under `<root-epic-id>.*` with the
unit labels are claimable; never unscoped `br ready`, never another plan's
bead) AND restate the §7.5 Initiative & Blocker-Recovery doctrine in full
(initiative is default; recover daemon/instance/red-suite yourself; reclaim
stale in-scope beads only after actual ownership/outcome checks; name truthful
unblock conditions; idle does not mean done). A daemon/503/outage instruction
must classify the failure and inspect the owned process, ledger and live runs.
Reuse healthy daemons and valid instances. Restart or reinstantiate only when
the observed fault requires it, with retained state and an authorized safe
checkpoint; preserve healthy children and conversation IDs. Give exact commands
for the chosen recovery, or record the missing prerequisite.

## Phase 4 — Generate 10-completion-sweep.md

The slim replacement for the old end-of-plan completion audit (most of its
job already happened JIT in the gate loops). A self-contained prompt for a
fresh session after the FINAL unit (or SPINE package) greenlights:

1. All unit packages + the outer SPINE package: `verify greenlight` green,
   zero red/stale/never-run, current instances (no staleness pending).
2. **Research-doc orphan sweep**: walk the contract crosswalks' union
   against the research doc's full requirement surface — a clause owned by
   NO unit is a finding (deferred-footer ownership COUNTS as owned; the
   sweep hunts clauses that fell through entirely).
3. **Amendment & tripwire review**: diff package versions across run
   history; every red→green-by-amendment transition has a Class 2 record
   with research_basis; unrecorded weakening = stop-the-line.
4. Burndown archaeology: uvp-run-N histories complete; final evidence roots
   + artifact indexes intact; provenance = current HEAD or honestly noted.
5. Repo hygiene: all beads closed/accounted, reservations released, all work
   pushed; update `00-pipeline-guide.md` to COMPLETE.
Verdict: SHIPPED · SHIPPED-WITH-NOTES · FINDINGS (each finding → fix bead or
BLOCKED). End with a copyable fresh-eyes re-read prompt as the final section.

## Phase 4.5 — Author the FLEET PLAN (`<unit>-fleet-plan.md`)

Read the `fleet-controller` skill and run its **Phase 1 (PLAN)**: walk
`br dep tree` / `bv --robot-plan`, segment the DAG into steps, and write
`<unit>-fleet-plan.md` beside the proof matrix — per-step beads, width,
staffing, and the rationale, ordered within each step by transitive-dependent
count (critical path first), discounted for declared `Files:` overlap.

This replaces the single static "N" with a per-step forecast — because the
frontier's width CHANGES as the graph opens and closes, and one number cannot
describe it. Label every number a PREDICTION with its basis: the resident
fleet-controller will diff it against live reservations and PATCH it, and the
CORRECTIONS log it appends is what makes the next unit's forecast accurate.
Predict what you can; the controller handles what you cannot (JIT fix beads,
ad-hoc-created files, dark lanes).

## Phase 5 — Hand Off

Update `00-pipeline-guide.md` (stage 6 active, kickoff/push paths, epic ids,
instance ids). Optional NTM/janitor helpers are not execution prerequisites:
the current harness or local/SSH controller can consume `uvp-fleet`, inspect
owned processes and compare resource snapshots with configured reserves.
Final response: prompts written (paths), unit/epic/instance
ids embedded, the **fleet plan path + step-1 staffing** (not a bare N — the
plan carries the whole shape), and the next eligible dispatch through the current
controller/`uvp-fleet`. Resolve model, account, capacity, source and reservations
at launch; the predicted headcount is not a spawn command. Start a resource
watcher only when observed or forecast pressure justifies one.

Embed the current registry's effort routing in kickoff and dispatch guidance:
choose `task_type` for the work, or an explicit allowed `effort` override. The
fleet resolves override, task recommendation, then model default and records
`effort`/`effort_source` in placement and receipts. All Codex models, including
Sol, use this policy. Other adapters must pass the resolved effort explicitly;
do not infer it from a model name, reuse a stale fixed launch flag, or change
healthy running turns merely to adopt new defaults.
Max requires `effort_reason` for an exceptional architecture/design/reasoning
decision and must be allowed for the selected model; it is not routine escalation.

Embed fleet-controller routing for every delegated task, including native research,
implementation and reviewer children. Compare eligible models across providers in
the current registry, with task-relevant weights/floors, before choosing the adapter.
The native spawn menu does not define the fleet. Use a qualified CLI/CAAM or remote
route when it matches the chosen model; record actual model/effort and any material
eligibility limitation in the existing dispatch note. Verify configured model lists
and current qualifications rather than silently inheriting the parent provider.

## Quality Checklist

- [ ] Kickoff is fully self-contained (a fresh agent needs nothing else)
- [ ] All policy embedded verbatim: work loop, proof classes, fix loop +
      evidence-triggered reflection, affected-artifact table, JIT defect policy,
      tool matrix, non-negotiables
- [ ] Real ids everywhere (epic ids, instance ids, package slugs, evidence
      roots) — zero placeholders left unfilled
- [ ] Push prompt is commands-only; sweep prompt is fresh-session-runnable
- [ ] Every prompt ends with its copyable fresh-eyes prompt as final section
