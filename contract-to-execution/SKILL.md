---
name: contract-to-execution
description: "Stage 6 of the contract-first pipeline. Generate the flat-swarm execution prompts and operating policy for contract-pipeline beads: a repeatable multi-agent kickoff (same prompt for N agents), push prompt, and completion-sweep prompt — embedding AgentMail coordination, scoped ready queues, proof-class discipline, fast-tier burndown runs, the gate fix-loop (JIT fix beads until UVP greenlight, 5-stalled-iteration valve), amendment protocol, realism rules, and mandatory push. Use when: 'execution kickoff', 'kickoff prompts', 'beads execution', 'start the swarm' for the contract-first pipeline. Writes ONLY the pipeline prompts folder."
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

## Phase 2 — Generate 07-execution-kickoff.md

Self-contained, identical for every agent, ~150–300 lines. Required
sections, with the policy embedded VERBATIM (not referenced):

**0. Unit + staleness banner (MANDATORY first lines of all THREE generated
files — 07/08/10)** — these files are REGENERATED PER UNIT (this stage is
re-run for each unit; each run overwrites the prior unit's copies, which is
correct since that unit is already greenlit). To prevent a reader running a
stale prior-unit kickoff, stamp the top of each generated file:

```
> GENERATED FOR UNIT <unit_id> (<unit title>) — instance <id>, epic <epic>,
> gate <gate-bead>. Regenerated per unit by 07-execution-prep; this OVERWROTE
> the prior unit's copy. STALENESS CHECK: if 00-pipeline-guide's stage table
> shows a LATER unit than <unit_id> as the current execution unit, this file
> is STALE — STOP and re-run 07-execution-prep for that unit before launching.
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
  a SOFT dependency blocks you — a claimed bead leaves the frontier, so the
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
roster). If the frontier is now WIDER than the active fleet, SendMessage the
orchestrator: `FRONTIER WIDENED → <n> claimable: <ids>` and keep working
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
The orchestrator files the missing `br dep` edge so the graph is right for the
next unit. An undeclared resource dependency that bites twice is a bug in the
graph, not bad luck.

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
→ claim (br update <id> --status in_progress; announce on thread_id=<bead-id>)
→ read the bead COMPLETELY (it is self-contained; SOT block lists refs)
→ reserve files (file_reservation_paths, reason=<bead-id>; NEVER .beads/**)
→ implement per Technical Approach; reconfirm reality-to-verify claims
→ local gates (build, unit tests, lint, scoped quality gates)
→ BURNDOWN RUN: execute the unit's fast-tier suites
  (target/debug/agent-swarm verify run --instance-id <id> ...) and record
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

**4. The gate fix-loop** (embed verbatim from the gate bead / contract):
red greenlight → cluster failures → JIT-draft `F-<unit>.<seq>` fix beads
(unit labels + `fix` + suite-slug; failure evidence + root-cause hypothesis
embedded; class turns-green) → `br dep add <gate> <fix>` (gate re-blocks) →
announce; fixes claimable by ANY agent → on fixes closed, gate re-runs →
record `uvp-run-N-status.json` every iteration → ESCAPE VALVE: 5 consecutive
STALLED iterations (no burndown progress) → "is the contract wrong?" →
Amendment Protocol (Class 2 with research_basis) or BLOCKED to human.
Converging loops run past 5 freely.

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
LAST-RESORT result for TRUE human-required hard blockers ONLY, declared only
after recovery is genuinely exhausted (see Initiative doctrine §7.5) — an
outage/stale-instance/red-suite you can recover is NEVER blocked; and a
blocked verdict still never mocks or fakes a green · no fixture-specific
logic in production code · amendment protocol (Class
1 free + log line; Class 2 full record with research_basis; red→green
without code change = tripwire; bead-set changes during execution are
fix/gap beads + amendments only — polish rounds are over) · conflicts
resolve upward: code → package → contract → research · STALE instances: if
`verify` reports the instance stale (research/contract doc or watched paths
changed), stop claiming or trusting suite results, surface it on the unit
thread, and run the rebase pass (re-grep contract citations, bump package
version, re-instantiate) before any further green claims.

**7.5 Initiative & Blocker-Recovery Doctrine (embed VERBATIM — default = act,
not idle).** This is the section that prevents lazy BLOCKED and passive
idling. Initiative is the DEFAULT; drive the unit to greenlight.

1. DRIVE TO COMPLETION. Finish your bead → close + push → immediately pick the
   next ready in-scope bead → repeat. Never ask "what next," never stop after
   one bead, never report "nothing to do" while recovery is possible.
2. BLOCKERS ARE WORK YOU FIX, not exits. Your DEFAULT on any obstacle is to
   recover it yourself: daemon down / gateway 503 / runtime outage → RESTART
   the owner-local swarmd over its data dir (`~/Library/Application Support/
   swarmd`), re-serve the gateway, recover runtime-state — this is recovery,
   NOT a blocker. Instance stale/404 → re-instantiate (patch-bump) against the
   CURRENT package, resolve the live instance from the newest
   `uvp-instantiate.json`. Suite red → run the fix-loop (red is fuel).
   Transient/tool error → retry / alternate path. Missing artifact → build it.
3. BLOCKED IS LAST RESORT, narrowly defined. Declare BLOCKED-with-envelope
   ONLY after genuinely exhausting recovery, and ONLY for a TRUE hard blocker
   that REQUIRES A HUMAN: a real product/contract defect needing a human
   decision, a capability you cannot create, an external dependency you cannot
   provision, or the gate fix-loop's 5-stalled-iterations "is the contract
   wrong?" valve. "Don't fake a green" means RECOVER then prove green honestly
   — it does NOT mean "declare BLOCKED." Faking a green AND lazily declaring
   BLOCKED are BOTH failures.
4. RECLAIM STALE WORK. An `in_progress` bead whose owner has gone idle (no
   recent mail/commits, reservation expired) is STALE — verify staleness
   (fetch_inbox + last activity), then reclaim (`br update --claim`) and drive
   it. Only leave a bead a peer is ACTIVELY working.
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
- **READY + UNCLAIMED bead** → claim it atomically (`br update <id> --claim`;
  reserve its files). The atomic claim + reservation are the mutex.
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

The continuation nudge for an agent already booted: re-check inbox → release
stale reservations → re-run the SCOPED ready query (`--parent <unit-epic-id>`,
NEVER bare `br ready`) → if no ready task beads: check whether the gate bead
or a `F-<unit>.*`/gap bead for THIS unit is ready → land everything (push).
Must restate SCOPE LOCK verbatim (only beads under `<root-epic-id>.*` with the
unit labels are claimable; never unscoped `br ready`, never another plan's
bead) AND restate the §7.5 Initiative & Blocker-Recovery doctrine in full
(initiative is default; recover daemon/instance/red-suite yourself; reclaim
stale in-scope beads; BLOCKED is last-resort for human-required hard blockers
only; idle ≠ done, monitor-resume). Critical: any "daemon down / 503 / outage"
line in the push MUST say RECOVER (restart swarmd over its data dir,
re-instantiate), NOT "→ BLOCKED" — the prior generation's "daemon down →
BLOCKED-with-envelope" wording caused real lazy stops and is banned. Exact
commands, zero narrative.

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
instance ids). Final response: prompts written (paths), unit/epic/instance
ids embedded, the **fleet plan path + step-1 staffing** (not a bare N — the
plan carries the whole shape), and the literal next action: "open N sessions,
paste 07-execution-kickoff into each; launch the resident fleet-controller +
disk-janitor alongside."

## Quality Checklist

- [ ] Kickoff is fully self-contained (a fresh agent needs nothing else)
- [ ] All policy embedded verbatim: work loop, proof classes, fix loop +
      5-stalled valve, JIT defect policy, tool matrix, non-negotiables
- [ ] Real ids everywhere (epic ids, instance ids, package slugs, evidence
      roots) — zero placeholders left unfilled
- [ ] Push prompt is commands-only; sweep prompt is fresh-session-runnable
- [ ] Every prompt ends with its copyable fresh-eyes prompt as final section
