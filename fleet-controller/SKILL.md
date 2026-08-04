---
name: fleet-controller
description: "Keep an agent swarm optimally sized via a LIVING fleet plan: predict per-step agent counts from the work DAG at planning time, write them down, then correct them against live reality on a cadence and on events. Four phases — PLAN (author the per-step staffing), STAFF (initial spawn), RECONCILE (resident: diff plan vs live frontier/reservations/lanes, patch the plan, recommend widen/narrow), FOLD-JIT (absorb unplanned fix beads, the ones nobody could forecast). Use when: orchestrating or running a multi-agent swarm over a bead/work graph, 'how many agents', 'are we parallelising optimally', authoring an execution/kickoff plan, launching a swarm, or whenever fix beads appear mid-run. Read BEFORE spawning lanes."
---

# Fleet Controller — a LIVING fleet plan: predicted, then corrected

> Two failure modes, one root cause. **Beads sit unowned while one lane grinds** (invisible from
> inside the swarm). **Agents spawn into a frontier narrower than it looks**, collide on
> reservations, and park. Both come from deciding the fleet size **once**, from a plan, and never
> revisiting it.

## Why a plan AND a controller — not one or the other

- **Pure up-front planning fails**: the DAG encodes LOGICAL deps only. It cannot know which files a
  bead will touch (some are *created ad hoc* as the plan unfolds), which reservations are held now,
  which lanes are alive, or which fix beads are coming. Any N is wrong within minutes.
- **Pure live recomputation fails differently**: it re-derives the whole DAG every wake (expensive),
  forgets what it learned last time, and dies with the session.
- **So: predict what you CAN, write it down, and correct it against reality.** The fleet plan is a
  living artifact — a forecast that gets patched, not a document that rots. Each correction makes
  the next wake cheap and the next unit's forecast better.

## The artifact — `<unit>-fleet-plan.md`

Lives in the pipeline folder beside the proof matrix (git-tracked, so it survives controller death
and a fresh controller resumes instead of starting blank).

```markdown
# <Unit> — Fleet Plan   (PREDICTED <date> by <stage>; CORRECTED by the fleet-controller)

## Caps
contention: ~2 (all beads land in one crate pair — soft, build convoy)
mode: max (≤6) · user: none · gate driver + janitor sit OUTSIDE the cap

## Predicted steps (from `br dep tree`; width = concurrently claimable)
| Step | Beads | Width | Staff | Model | Rationale |
| 1 heads | .1 (A), .4 (C) | 2 | 2 | Opus 5 | Broad discovery still needs judgment during execution |
| 2 after .1 | .2, .3 | 2 | 2 | Codex Sol | Decisions and acceptance criteria are now exact |
| 3 convergence | .5, .6, .7 | 3 | 2 | Codex Sol | All touch service.rs → soft contention |
| 4 gate | .8 | 1 | Fable gate driver (outside fleet) | Architecture and truthfulness synthesis |

## CORRECTIONS  ← the controller appends; this is where forecast meets reality
| When | Predicted | Observed | Action | Root cause |
| 14:20 | step 1 = 2 | 1 effective | narrowed to 1 | HIDDEN SERIAL: .4 needs .1's fields in-tree — soft dep, no edge → filed `br dep` |
| 15:05 | step 3 = 2 | 4 claimable | widened to 2 | JIT fix beads .9/.10 appeared (disjoint: CI allowlist vs shell script) |
```

The CORRECTIONS log is the point: it is the learning loop. Next unit's PLAN phase reads it.

## Model routing — intelligence follows task ambiguity

Model choice is a scheduling dimension, not an afterthought. Route each lane by how much
architectural judgment and in-flight improvisation it still requires:

| Model | Primary role | Use for | Do not spend it on |
|---|---|---|---|
| **Fable** | Orchestrator and architectural owner | Work-DAG synthesis, large cross-system architecture/proof review, scope and tradeoff decisions, conflicting-evidence resolution, gate-level truthfulness synthesis | Routine implementation, compile/test polling, inventory extraction, janitor sweeps |
| **Opus 5** | General reviewer and exploratory executor | Broad or under-defined reviews, cross-cutting investigations, ambiguous bug diagnosis, live execution where new evidence is likely to require intelligent improvisation | A fully specified edit whose files, behavior, and acceptance tests are already fixed |
| **Codex Sol** | Defined-task implementation workhorse | Exact beads with named files/symbols, concrete acceptance criteria, targeted red/green tests, bounded code review, deterministic repair and verification | Owning a vague multi-system mission or silently inventing architecture when the prompt has a decision gap |
| **Cheaper bounded tier** | Mechanical operator | Disk-janitor sweeps, inventory extraction, status collection, and other rule-following work with a complete procedure | Architecture, scope changes, final gate judgment |

Apply the routing as a living contract:

1. Keep **one Fable orchestrator** as the spawn/retire and architecture owner. The
   fleet-controller observes, patches the plan, and recommends; it does not become a second
   orchestrator.
2. Put the planned model and one-line ambiguity rationale in every fleet-plan row. At dispatch,
   the spawn command must consume that choice, and the plan must record the actual runner. A model
   column nobody passes to the runner is decoration.
3. Start broad, under-defined work on **Opus 5**. Its first durable output should narrow the problem
   into explicit decisions and bounded implementation tasks; hand those tasks to **Codex Sol**.
4. If Codex Sol encounters an unstated product or architecture decision, it must return the seam to
   Opus 5 or Fable rather than improvising a new contract. Conversely, do not keep a now-mechanical
   lane on Opus merely because it started there.
5. Fable may delegate source reading and evidence gathering, but it retains synthesis of
   architecture, requirement/consumer coverage, model corrections, and gate conclusions.
6. Janitor work follows the `disk-janitor` skill's cheap-tier routing. Do not burn Fable or Codex
   Sol on routine sweeps; a floor-breach escalation returns to the orchestrator for the decision.
7. Record every upgrade, downgrade, or unavailable-model substitution in `CORRECTIONS`, including
   the observed reason. Never silently substitute a different model and continue as if the plan
   was consumed.

The principle is not “always use the strongest model.” It is “use the least expensive model that
can honestly own the remaining ambiguity, and move the task to a workhorse once the ambiguity has
been removed.”

## Phase 1 — PLAN (at execution-prep, before any lane runs)

Walk `br dep tree` / `bv --robot-plan` and write the table above:
1. **Segment the DAG into steps** — each step = the set claimable once the prior step's beads close.
2. **Width** = size of that set.
3. **Order within a step by transitive-dependent count DESC** — critical path takes the first agent.
4. **Discount for contention**: declared `Files:` overlap → treat as serial (they share one slot);
   same-crate-different-file → soft, tolerate ~2–3.
5. **Staff = min(width_after_discount, user_cap, mode_cap)**.
6. **Model = the lowest tier that can own the remaining ambiguity**, using the routing table above.
7. **Label every number and model a PREDICTION and name its basis.** A prediction that hides its
   basis cannot be corrected honestly later.

## Phase 2 — STAFF (at swarm launch)

The orchestrator reads step 1's `Staff` and `Model`, spawns that many with the planned model in the
plan's critical-path order, and records the actual runner. Nothing clever — the thinking already
happened in Phase 1.

## Phase 3 — RECONCILE (JIT: a MONITOR watches; an agent only runs when it fires)

**The cadence primitive is a `Monitor`, NOT a resident agent.** This matters practically:

| | Resident **agent** loop | **Monitor** (shell poll) |
|---|---|---|
| Cost while idle | tokens every wake (observe→reason→sleep), context bloats over cycles | **zero** — it is a sleeping shell process |
| Survival | **dies if it ends its turn** (the single most common agent failure) | `persistent: true` — runs until TaskStop or session end |
| Who it wakes | itself (and it must never stop) | **the orchestrator**, who already owns spawn/retire |

### ⛔ THE REQUIRED PROBE SET — arming the frontier monitor alone is NOT armed

**At swarm launch, arm ALL FOUR. Then verify the armed set against this table** (list your live
monitors and check each row off — the arming step itself needs a consumer):

| Probe | Watches | Catches |
|---|---|---|
| **Frontier/staffing** (5min, emit-on-change) | open+unassigned set via the LABEL query | understaffing, JIT beads |
| **Phantom/no-progress** (10min, unit-ATTRIBUTED) | in_progress beads vs unit-attributed work evidence | **dead lanes holding claims** |
| **Disk floor** | free GB vs thresholds | ENOSPC mid-build |
| **Heartbeat watchdog** (30min) | the fast probes' liveness | a silently-dead monitor |

**⛔ ORTHOGONALITY, NOT JUST REDUNDANCY — a backup that re-runs the SAME check inherits the SAME
blind spot.** The watchdog exists to catch a **dead** watcher (heartbeat staleness); it can never
catch a **blind** one — a longer-period re-run of the frontier query is two clocks showing the same
wrong time. Blindness is caught only by a probe watching a **different dimension**: the frontier
probe reads *queue state* (who's claimed?), the phantom probe reads *work evidence* (is anything
actually happening?). Both must exist; the watchdog then checks **every** probe's heartbeat — a
probe with no heartbeat is a probe whose death silently re-opens its blind spot.

> **Real incident (2026-07-16, U3): 3 hours of phantom staffing with every gauge green.** The
> frontier monitor + watchdog were armed; the no-progress probe was NOT — this skill's launch
> instruction said "arm ONE Monitor" and its example showed only the frontier query, while the
> stall probe sat 350 lines away in another section. The fleet plan even specified
> "frontier+stall"; nothing checked the armed set against the specified set. **A specified-but-
> unarmed probe is a declaration with no consumer.** Worse: the heartbeat watchdog was healthy and
> truthfully silent the whole time — it watches the WATCHER, not the fleet; it is only valid
> backstop when the fleet-health probes actually exist.

The orchestrator (already the fleet owner) acts on probe notifications — reading the plan,
patching it, spawning/resuming. No agent sits burning tokens to watch a queue.

```bash
# Fleet watch — emits ONLY when genuinely UNSTAFFED work sits across two polls.
# NOTE the status filter: `br ready` does NOT exclude claimed beads (see the correction below).
prev=0
while true; do
  [ -f /tmp/<run>-swarm-open ] || { sleep 300; continue; }   # phase gate — see the SENTINEL block
  r=$(br ready --limit 0 --parent <unit-epic> --recursive --type task --json 2>/dev/null \
      | jq '[.[] | select(.status=="open") | select((.assignee // "") == "")] | length' || true)
  if [ "${r:-0}" -gt 0 ] && [ "$prev" -gt 0 ]; then
    echo "FLEET: $r ready+open+unassigned >5min — $(br ready --limit 0 --parent <unit-epic> \
      --recursive --type task --json 2>/dev/null \
      | jq -r '[.[] | select(.status=="open") | select((.assignee // "")=="") | .id] | join(" ")')"
  fi
  prev=${r:-0}; sleep 300
done
```

**⛔ `br list` EXCLUDES CLOSED BEADS BY DEFAULT — absence is not nonexistence.** Progress counted
from a bare `br list` silently uses the wrong denominator: closed work simply isn't there, so "all
open" reads as "nothing done." Use `br list --status closed` (or `--all`) to count completion, and
never infer "not done" from a bead's absence. Measured 2026-07-16: a status check reported zero
closed U2 beads while four were closed.

**⛔ SCOPE BY **LABEL** — NOT id-prefix, NOT `parent`. Both of those are structurally blind to JIT
fix beads.** Verified live 2026-07-16, after getting this wrong **twice**:

| JIT fix bead | id shape | `parent` | label | blocks the gate |
|---|---|---|---|---|
| `bd-3pfbm` | fresh ROOT | set | ✓ | ✓ |
| `bd-27skl` | fresh ROOT | **NONE** | ✓ | ✓ |
| `bd-3621t` | fresh ROOT | **NONE** | ✓ | ✓ |

- an **id-prefix** rule missed **all three**;
- the "corrected" **`parent` + label** rule still missed **two of three**;
- only the **label** finds all three.

**And it is worse than a bad predicate: `br ready --parent <epic> --recursive` CANNOT return a
parentless bead at all** (measured: 0 hits for `bd-27skl`). So a `--parent`-scoped discovery query is
**structurally blind to JIT fix beads — exactly at gate time**, when the fix-loop files them and the
fleet is smallest. `br dep tree` doesn't show them either, so **the graph looks complete while a
gating bead is invisible.** Never use `br dep tree` for ownership.

**The correct discovery query — use this:**
```bash
br ready --limit 0 --label-any <unit-label> --type task --json | jq '[.[]|select(.status=="open")]'
```
**And a bead can gate you via a dep edge with no parent and no label match** — `br dep list <gate-id>`
is the authoritative blocker list; run it before declaring a gate ready.

> This is the F-U0.1/F-U0.2 failure (fix beads sat unowned through a whole unit) reproduced through
> **three distinct holes**. Each "fix" theorised from structure — ids, then parents — instead of
> testing against the live system, and the live system falsified it within minutes each time.

**⛔ CORRECTION (2026-07-16) — `br ready` reports DEPENDENCY-readiness only; a claim does NOT remove
a bead from it.** This skill previously taught "a fully-staffed frontier is an EMPTY one — a claim
removes the bead from `br ready`." **That is FALSE**, and it poisoned this doctrine in *both*
directions at once:
- **False alarms forever.** A monitor keyed on `ready > 0` fires continuously while lanes work
  normally — measured: it reported `2 claimable & unstaffed` with both beads already claimed and
  6 codex + 15 cargo processes running. Per this skill's own lesson, a monitor that chatters gets
  muted, and then it is not a safety net.
- **A blind spot that wasn't.** The "phantom staffing" analysis below was built on the same false
  premise (see its correction).

**The signal is `ready AND status==open AND unassigned`** — dependency-readiness alone is not
staffing information. Debounce across two polls (a lane between beads is briefly unassigned; that
is not understaffing). Emit only what you would act on.

> **The same false premise was also a live COLLISION TRAP.** The kickoff's work loop, inheriting it,
> told lanes to verify *id + labels* then claim — never *status*. And `br update --claim` is **NOT
> compare-and-swap**: a second claim silently overwrites the assignee with no error. So two lanes
> could each believe they owned the same bead, with only the reserve-immediately-after-claim step
> standing between that and duplicated work on the same files. **Any prompt or query that asks
> "is this bead available?" MUST test `status=="open"` and an empty/own assignee.** Live
> reservations remain the real mutex; the claim is a label, not a lock.

### ⛔ NEVER `git reset <ref>` IN A SHARED CHECKOUT — IT ARMS A SILENT REVERT

**Moving a branch ref does NOT update the working tree.** In a shared checkout, `git reset origin/main`
leaves every line that landed since your tree was last synced sitting as a **pending deletion** —
and the next `git commit -a` (yours or *anyone's*) silently reverts closed, pushed work. The tree
looks normal; `git status` shows "modified"; nothing warns you.

> **Measured (U2, 2026-07-16) — the ORCHESTRATOR armed this one.** After a plumbing push it ran
> `git reset origin/main`; a peer's 275 landed lines (a **closed, pushed bead**) became a pending
> deletion. The next lane found the checkout booby-trapped, proved both worktree blobs were
> byte-identical to that commit's *parent* blobs (so there was zero WIP to lose), restored
> surgically from HEAD, and alerted the fleet. One `commit -a` would have reverted a closed bead
> and silently taken a downstream bead's requirement with it.

**The rule: in a shared checkout carrying foreign WIP, do not move HEAD and do not bulk-stage.**
- Push via plumbing (`commit-tree` + `push <sha>:main`).
- If you must sync the tree, `git checkout <ref> -- <specific paths>` **after** proving the local
  blobs are pristine parents (no WIP to lose) — never a bulk reset.
- **`git add -A` / `git commit -a` are banned outright** in any tree another agent touches.

### ⛔ THE STALE-TREE LANDMINE — `commit-tree` NEVER TOUCHES THE TREE; SYNC IS THE PUSHER'S DEBT

**⛔ RETRACTED (2026-07-16): this section used to say "let HEAD lag — a lagging HEAD is harmless if
you never `add -A`/`commit -a`." FALSIFIED, reflog-verified, after it armed the same landmine
TWICE in one run.** Why it's false:
1. **Agents advance HEAD anyway.** The recipe gave no reconciliation step, so sessions ran
   `git reset <new-sha>` to keep `git status` readable — and a mixed reset moves HEAD/index while
   leaving the TREE at the old content. Every commit built via `commit-tree` from another tree now
   shows in the checkout as an unstaged **reversion** of landed work. (`git reset --soft` is WORSE:
   the reversions arrive **pre-staged**, and a plain `git commit` — no `-a` needed — ships them.)
2. **"Never `commit -a`" is not a guarantee you control.** Other sessions commit from the shared
   checkout without reading this skill (measured: a foreign workstream committed on top mid-run;
   it happened to touch only its own paths — luck, not design).
3. **The stale tree is read as ground truth.** A lane grepped the main checkout and nearly
   concluded a landed fix "wasn't wired"; a boundary session found the H4 honesty guard reverted
   in-tree — the SAME regression a stray `cargo fmt` commit had already shipped once.

**The invariant: on pipeline-owned paths, tree == HEAD == origin/main at all times. Divergence is
an armed landmine, not a curiosity.** Protocol:
- **Sync is the pusher's debt.** After every `commit-tree` push, the pusher fetches and re-syncs
  the paths their commit touched into the shared tree (`git checkout origin/main -- <those paths>`)
  — the commit's content exists nowhere in that tree until they do.
- **HEAD advance and path re-sync are ONE atomic act.** Never `git reset <sha>` without immediately
  `git checkout <sha> -- <pipeline paths>` (after the pristine-blob check). Never `--soft` at all.
- **Session-start preflight** for any session using the shared checkout:
  `git diff HEAD --stat -- <pipeline paths>` — non-empty means a landmine is armed; verify the tree
  copies are stale (grep for landed symbols: 0 in tree, >0 in HEAD) and restore from HEAD before
  doing anything else.

### ⛔ AN EMPTY RESULT FROM THE WRONG QUERY LOOKS EXACTLY LIKE A CONFIDENT "NO"

Verified instances, all near-misses in one night:
- `jq '.blocked_by[]?'` on `br show --json` — **that key does not exist** (deps live under
  `dependencies`) → null → `// "none"` → **"no blockers"** printed for four beads, two of which
  `br` had already refused as blocked.
- `git diff <ref> -- <files>` (working tree vs ref) mistaken for `git diff <parent> <ref>` (peer
  edits) — it reports **your own** edits as if they were someone else's.
- An evidence extractor filtered `endswith('command-0-json')` and took `[0]` — grabbing **a
  different suite's** payload. The lane was one step from reporting *"every green is false, the
  suite runs stale source."* Its own sloppy query, not a system failure.
  > **⛔ WHEN EVIDENCE IMPLIES CATASTROPHE, SUSPECT YOUR QUERY BEFORE THE SYSTEM.** A result that
  > says everything is broken is far more often a broken *question*. Re-derive it a second way
  > before you raise the alarm — and certainly before you act.

> **⛔ RETRACTED 2026-07-16 — "BSD grep on darwin doesn't alternate on `\|`" was NEVER VERIFIED and
> DOES NOT REPRODUCE.** I wrote it into this skill from a single lane's report without testing it;
> a later lane challenged it and was right. Measured: `grep -c 'alpha\|beta'` → `2`, identical to
> `-E`; and the shell's `grep` here is **ugrep 7.5.0**, not BSD grep at all. Whatever silenced that
> lane's pattern, the mechanism is **unknown**. **This retraction is the entry's real lesson: the
> author of a "don't propagate unverified claims" rule propagated one, into that same rule, within
> the hour.** Prefer `-E` anyway (portable, unambiguous) — but never on this basis.

**A tool never says "you asked the wrong question." It says nothing, and nothing looks like good
news.** Before acting on a falsy/empty result, prove the query was well-formed: `jq 'keys'`, run
the pattern against a string you *know* matches, or check the inverse. This is the Consumer Rule
aimed at your own tooling — **the check ran; it just wasn't checking that.**

### ⛔ IN A SHARED WORKTREE, YOUR TEST RUN DOES NOT DESCRIBE YOUR COMMIT

**You test the working tree; you push the index.** In a shared tree those diverge *between* the two
— a peer's tool rewrites a file, and your green run now describes bytes you are not shipping. **Your
commit message then states a falsehood in good faith.**

> **Measured (U2, 2026-07-16) — the most dangerous event of the run.** A commit labeled
> *"cargo fmt fixes… no logic change"* **silently reverted a peer's entire H4 fix onto `origin/main`
> while leaving that peer's regression tests in place.** Its own claimed "153 passed" was **false for
> what it pushed** — true when run, stale when staged. It was caught only because the wronged lane
> ran a **paranoid before/after re-verification of `origin/main` itself** and pushed a correction.
> Had it not, the unit's honesty invariant (H4) would have been **dead on main with green tests
> sitting on top of it** — the exact false-green this whole feature exists to kill.

- **Re-verify AFTER staging, against the staged content** — `git diff --cached` and read it, or run
  the gates on the index/commit, not on the tree you edited ten minutes ago.
- **After pushing, re-read `origin/main`** and confirm your change is actually there. Cheap; the only
  thing that catches this.
- **`cargo fmt` / lint / "no logic change" commits are the most dangerous shape** — wide file
  surface, trusted label, nobody reviews them. **Never bulk-stage a formatting commit in a shared
  tree.**
- A green test run is a claim about a *moment*, not about a *commit*. **Passing tests are not a
  consumer** of the bytes you ship, either.

### ⛔ RESERVATION STATE LIES IN BOTH DIRECTIONS — VERIFY AGAINST REAL EVIDENCE

`file_reservation_paths` **does not filter by `expires_ts`**: it reports **genuinely expired**
reservations as live conflicts (measured 2026-07-16, confirmed via direct archive-timestamp
inspection). Combined with the `granted`-vs-`conflicts` trap, the tool can tell you you're clear when
you aren't *and* that you're blocked when you aren't. **Adjudicate with real evidence** — is a
process live? is there an actual diff? did the heads-up go unanswered? — and record what you proved.

### ⛔ IN A SHARED WORKTREE, `git diff` IS THE FLEET'S — NOT YOUR AGENT'S

**Never attribute an uncommitted change to your own tool by presence alone.** In a shared build
tree, `git diff` shows every lane's in-flight work mixed together. Measured (U2, 2026-07-16): a lane
read the diff, concluded *its own* Codex had scope-crept into wiring an unrelated function, and
**stripped a peer's live `.3.9` work — twice**. The peer kept rewriting it (correctly), which the
lane then misdiagnosed as a `resume --last` ghost. Nothing was lost only because the
parent-vs-origin pre-flight came back non-empty and stopped a blob-copy replay.

- **Attribute by SYMBOL, never by presence**: does this hunk touch the symbols *your* prompt named?
- ⛔ **The RULE-4 gated staged-diff catches foreign PATHS, not foreign HUNKS inside a shared file.** A whole-file overlay of a shared source file (`service.rs`) silently co-ships a peer's uncommitted method — `git diff --cached --stat origin/main` shows only your intended *path*, so the file-level gate passes while foreign code rides along. Measured 2026-07-17 (harmless that time: an unused `pub fn` that compiled). **In a shared worktree, never whole-file-overlay a co-edited file — inspect and stage HUNKS** (`git apply --cached` with content filters, or read the full `git diff --cached` not just `--stat`), and confirm every hunk touches symbols your prompt named.
- **Snapshot before every Codex round** — peers' tools rewrite files directly, and reservations
  coordinate *intent*, not the filesystem. (Same run: a lane's uncommitted diff was overwritten
  twice by a peer's tool activity — not a git op.)
- **Consider landing from the clean main checkout** after verifying a byte-identical base for your
  files, rather than committing out of the shared tree at all.
- If you think a peer is corrupting your work, **say so on the thread before acting** — you are
  more likely misreading the shared tree than watching a real fault.

### ⛔ `granted` IS NOT "CLEAR" — READ `conflicts` IN THE SAME RESPONSE

**`file_reservation_paths` returns `granted` AND `conflicts` together.** A lane can be granted every
path it asked for *while the same payload reports those paths conflict with a peer's exclusive
holds. **Reading only `granted` walks you straight into a collision believing you are clear.**
Measured (U2, 2026-07-16): a lane was granted all 6 paths and simultaneously told 3 conflicted with
a peer; it noticed, held the overlap ~2 min, released all 6, and told the peer directly.

**Always parse `conflicts`. If non-empty: release everything, do not "hold the safe subset", and
report `HIDDEN SERIAL`.** This is the Consumer Rule in the coordination layer — the field exists,
it is populated, and nothing reads it. A response you half-consume is a guarantee you don't have.

### ⛔ THE CLAIM ATTEMPT IS THE ONLY AUTHORITATIVE FRONTIER TEST — RUN IT BEFORE ASSIGNING

**Never assign work off a *reported* frontier — not a plan, not a reconcile, not a lane's
close-out note, not your own memory of the DAG.** `br update <id> --claim` refuses a blocked bead
outright (`VALIDATION_FAILED: cannot claim blocked issue: <blocker>`). That refusal is free, instant,
and authoritative; every other signal is a snapshot that was already stale when it was written.

⛔ **And do NOT substitute a JSON dep query — `br show --json` has NO `blocked_by` key.** Deps live
under **`dependencies`** / **`dependents`**; use **`br dep list <id>`** (or `br dep tree`, but never
for *ownership* — it is id-hierarchy-based). Measured 2026-07-16: an orchestrator ran
`jq '.blocked_by[]?' // "none"` across four beads, got **"none" for all of them**, and was one step
from staffing two beads that `br` had already refused as blocked.

> **The general trap, and it is vicious: a query for a field that does not exist returns EMPTY, and
> empty renders as a confident NEGATIVE.** `.blocked_by` → null → `// "none"` → *"no blockers!"* —
> indistinguishable from a real answer. **A tool never says "you asked the wrong question"; it says
> nothing, and nothing looks like good news.** Before trusting a falsy result, prove the key exists
> (`jq 'keys'`) — otherwise you are reading your own typo as a fact about the world. Same class as
> a passing unit test on a function nobody calls: the check ran, it just wasn't checking that.

> **Measured (U2, 2026-07-16): an orchestrator mis-staffed FOUR times in one unit** — each time from
> a plausible secondary source (a fleet plan's prediction, a from-memory reconcile that forgot one
> bead's file blanket, a lane's own close-out asserting "X is the only unblocked bead"). Every one
> would have been caught by attempting the claim first. The lanes were never wrong about reality;
> the *reports about* reality were.

**Corollary — a serial cannot be widened by staffing, and idle lanes must PARK, not poll.** When one
bead gates everything, extra lanes polling it is pure waste and generates noise that looks like
progress. Say "N-wide, nothing claimable until X lands" plainly and stop. **Resume before spawn**
when it does.

### ⛔ THE GRAPH BLOCKS BEFORE THE FILES DO — CHECK `blocked_by` FIRST

File contention is the *second* reason a bead may be unclaimable; a hard dep edge is the first, and
it is cheaper to check: `br update <id> --claim` → `VALIDATION_FAILED: cannot claim blocked issue`.
**And the dep is usually load-bearing, not bureaucratic**: if bead B must surface a shape bead A
*defines*, starting B early doesn't produce risky work — it produces the **wrong artifact**,
inventing a field ahead of its decision. That is the same fabrication class as claiming a green with
no backing test. **When a serial is real, staffing cannot break it — only the predecessor landing
can.** Say so plainly instead of hunting for a third lane to fill.

### ⚠ RESERVATIONS ARE LINE-RANGED; GIT STAGES PER-FILE

**Two lanes with disjoint *line* reservations still collide at COMMIT.** A reservation on
`service.rs:130-173` and one on `service.rs:2610-2720` are genuinely disjoint work — but `git add
service.rs` stages **the whole file**, sweeping the peer's in-flight hunks into your commit. The
mutex protects the *edit*, not the *commit*. Nothing warns you; the peer's half-finished work just
silently ships under your bead.

- Lanes sharing a file must agree a **hunk-level staging protocol** (via AgentMail) and **verify
  zero cross-contamination in both directions** before pushing.
- **Shared build worktrees are usually on a detached HEAD** diverging from `origin/main`, so
  `push HEAD:main` is rejected and rebase is impossible while the tree is dirty with a peer's work.
  Replay via plumbing (temp `GIT_INDEX_FILE`, working tree untouched).
- ⛔ **Safety check for any blob-copy replay**: it is safe ONLY if your commit's parent is
  content-identical to `origin/main` for your files —
  `git diff --stat <parent> origin/main -- <files>` must be **empty**. Otherwise the replay
  silently drags the other lane's work in. (Real: U2 lanes, 2026-07-16; both lanes used this and
  it held.)
- **Prefer disjoint FILES when planning tracks.** Line-disjointness buys concurrent editing and
  nothing else; it is not free parallelism.

### ⚠ SURFACE BREADTH IS A SECOND SCHEDULING AXIS — dependents alone will mis-order you

"Order by transitive-dependents DESC" is **insufficient**. A bead with the FEWEST dependents can
have the WIDEST file surface, and holding it **locks the whole unit** while the real critical path
starves. Measured (U2, 2026-07-16): `.3.7` had 1 dependent but declared 5 files — blanketing *both*
other claimable beads — while `.3.5` had 4 dependents and could not start. **Score each candidate on
BOTH axes: how much it unblocks, and how much it forecloses.** A wide-surface bead is a
unit-wide lock; schedule it when the alternatives are already blocked anyway, not when it would
idle a lane that has work.

⛔ **And check every candidate against every OTHER candidate — not just the obvious pair.** The same
plan called `.3.9` "genuinely disjoint" by checking it against `.3.5` and **never against `.3.7`**.
Pairwise-disjoint is not set-disjoint; one unchecked pair invalidates the staffing number.

### ⚠ REBASING A SHARED BRANCH REWRITES YOUR LANES' IN-FLIGHT HISTORY

**If your agents commit to the same branch you are on, `git pull --rebase`/`--autostash` will start
rewriting THEIR commits and conflict on shared state** (`.beads/issues.jsonl` is the usual first
casualty). Measured (U2, 2026-07-16): an autostash rebase began rewriting live lanes' history mid-run;
the session aborted, verified all 152 foreign WIP files restored, and landed instead via `commit-tree`
(no history rewritten). **Never rebase a branch with live lanes on it.** Land side work with plumbing
(`commit-tree`) or wait for drain. Autostash copies left in `stash@{n}` are harmless duplicates —
**do not prune them**; they may be another session's only copy.

### ⚠ SINGLETONS SERIALISE WHAT THE FILE GRAPH SAYS IS PARALLEL

A shared **daemon**, data dir, port, or fixture is a mutex no reservation system models. Two
`turns-green` beads can hold perfectly disjoint file reservations and still be serial because both
need a rebuild+restart of the ONE daemon. When sizing, subtract singleton contention *after* file
contention — a nominally 4-wide frontier can have a real independent set of 2. Name the singleton's
owner explicitly (e.g. "the first turns-green bead owns the rebuild; the rest coordinate, never
restart").

### ⚠ The blind spot: PHANTOM STAFFING (a dead lane holding a claim)

**A lane that dies mid-bead keeps its claim.** The bead sits `in_progress` with an assignee and no
one working it — the unit **stalls with every gauge green**. A dead lane holding a claim is worse
than no lane: no lane at least leaves the bead unassigned where the size check can see it.

> **Corrected 2026-07-16**: this section used to say a claimed bead "is NOT in `br ready`," which is
> false — it *is*. But that does not rescue the frontier check, because the corrected query filters
> to `status=="open"` + unassigned precisely to avoid crying wolf, which filters phantom-staffed
> beads right back out. **The blind spot is real; only its mechanism was wrong.** Detect it the way
> the no-progress heuristic below does — by looking for *work* (codex/build processes, output files,
> commits), never by reading the frontier.

Agents cannot guarantee their own liveness — **they cannot watch themselves die** (9 silent deaths
in one run, every lane, every stage). So liveness is *always* an external check. Two complementary
probes; neither catches the other's failure:

| Probe | Catches | Blind to |
|---|---|---|
| `ready > 0` (debounced) | **Under-staffing** — work nobody took | Dead lanes (their claim hides the bead) |
| **Stall detection** | **Phantom staffing** — work someone took and died holding | Work nobody ever claimed |

### 🛑 LONG ≠ DEAD — check for EVIDENCE OF WORK, never elapsed time alone

**A lane running a 40-minute Codex job or a cargo build produces no commits and is perfectly
healthy.** Reporting it as stalled is actively harmful: the orchestrator may staff a duplicate onto
its claimed bead (collision) or reclaim work that is progressing. **Elapsed silence is not
evidence. Absence of work is.**

⛔ **AND THE EVIDENCE YOU PROBE FOR MUST MATCH THE WORK TYPE — or "absence of work" is your own
blind spot.** A probe grepping `codex`/`cargo`/commits describes an **implementer**. A **gate
driver** emits none of those: its §5.8 drive is dozens of CLI calls that commit only at the very
end — so **a healthy 85-minute drive looks exactly like a corpse**. Measured 2026-07-16: the alert
fired on a driver that was demonstrably alive (`projection_generation` 111→121, evidence roots being
written, 3 agent procs). It said SUSPECT and was verified before anyone acted — the doctrine
working — but it would have re-fired every 5 minutes for hours. **Enumerate what THIS work actually
emits before probing for it**: for a gate driver that's the daemon's projection counter advancing,
evidence files appearing, and its own agent process. **A probe aimed at the wrong evidence returns
nothing, and nothing looks like death** — the same shape as a query for a field that doesn't exist.

⛔ **And watch the SPAWNED WORK, not the DRIVER** (same family, inverted): a test driver (nextest,
a runner script) exits while the binaries it spawned keep executing. A watcher keyed on the driver's
process pattern fires "done" early — measured 2026-07-16: a disk-reclaim watcher fired on nextest's
exit while its spawned test binaries still held 33 open handles in the target dir; only the
four-way idleness check stopped a reclaim that would have yanked running binaries. Key liveness
watchers on the work's own footprint (exe paths, open handles), never on the orchestrating process.

**Two layers, and be honest about which does the heavy lifting:**

| Layer | Catches | Cost |
|---|---|---|
| **Task-notifications (PRIMARY)** | An agent that **stopped**. The harness notifies the orchestrator — this is definitive and it caught **9/9** silent deaths in one run | free, already working |
| **Stall probe (SECONDARY)** | An agent **alive but wedged** — spinning, or waiting forever on something that will never return. No notification ever fires for these | a few commands |

⛔ **A LANE'S COMPLETION NOTIFICATION IS A DEATH CERTIFICATE, NOT A NEWSLETTER.** The primary layer
only works if the orchestrator treats it as terminal: when a completion arrives for a lane whose
bead is still `in_progress`, that lane is **STOPPED** — decide IMMEDIATELY: resume it (kick with its
own literal-next-action) or reassign the bead. Its report's "literal next action" was written by an
agent that then ceased to exist — **it is a handoff request, not a promise**; the lane cannot do it.
> Measured (2026-07-16, U3): both lanes' completion reports arrived, read as status updates
> ("excellent, work continues"), and 3 hours of phantom staffing followed. The primary layer FIRED;
> the reader failed. Discipline: every lane completion ends with an explicit orchestrator action —
> kick, reassign, or a written reason why idle is correct.

So the probe's job is *not* "detect death" (the harness does that). It is **"detect no progress"**.

**Evidence-of-work hierarchy — if ANY holds, the lane is WORKING → stay silent. ⛔ EVERY CHANNEL
MUST BE UNIT-ATTRIBUTED on a shared machine** (retracted 2026-07-16: this list used to say *"a
build is running → working, definitively"* — **FALSE**: a foreign session's continuous builds kept
`build>0` and a foreign commit kept resetting the quiet clock, so the probe as written would have
slept through the 3-hour phantom-staffing incident even if armed. **Unattributed evidence is
another session's alibi.**):
1. **A codex process exists** → working (fine unattributed only if all codex lanes are yours).
   **Do NOT use %CPU**: a Codex awaiting an API response sits at 0.0% and is mid-thought.
2. **A build is running IN THE UNIT'S WORKTREE** — attribute via `lsof -p <pid> | grep <worktree>`,
   never bare `pgrep cargo|rustc`.
3. **The lane's own transcript is growing** (`…/tasks/<agent-id>.output` gaining bytes).
4. **Fresh writes under the UNIT worktree**; a unit-labeled bead comment/thread message; a commit
   touching the unit's paths — never `git log -1` bare (any session's commit resets it).
5. ⚠ **Codex's `-o` result file does NOT stream** — written only at completion; unchanged size
   proves nothing (verified 2026-07-15).

```bash
# Stall probe — fires ONLY when in-progress work has NO UNIT-ATTRIBUTED evidence of life
inprog=$(br list --label-any <unit-label> --json | jq '[.[]|select(.status=="in_progress")]|length') || true
work=0
pgrep -f 'codex exec' >/dev/null && work=1
[ $work -eq 0 ] && find <unit-worktree> -name '*.rs' -newermt '-15 minutes' | head -1 | grep -q . && work=1
[ $work -eq 0 ] && for p in $(pgrep rustc); do lsof -p $p 2>/dev/null | grep -q <unit-worktree> && work=1 && break; done
[ $work -eq 0 ] && git log --since='15 minutes ago' --oneline origin/main -- <unit paths> | grep -q . && work=1
# accumulate quiet across polls; ≥30–45min with inprog>0 and work=0 → emit SUSPECT (never DEAD)
```

**Threshold ~45 min AND all evidence quiet** — both conditions, never time alone.

**Report SUSPECT, never DEAD; the orchestrator verifies before acting.** It checks the specific
agent's transcript before doing anything. Then:
- **`SendMessage` (kick/resume) is safe in both directions** — a live agent reads it as a nudge at
  its next tool round; a stopped one is *resumed*. Cheap either way, so prefer it.
### ⛔ LANE CONTEXT HAS A LIFETIME — RETIRE AND RESPAWN PAST THE CLIFF

**Resumes are cheap until the transcript is huge; then every resume inherits instability.** The
tell: the SAME lane dying repeatedly with DIFFERENT transient errors (stream stall, then 500, then
ENOTFOUND, then a silent 151-byte resume). That is not bad luck — it is a context near its limit
choking the stream on every push. Measured (2026-07-16): a lane at ~300 tool uses / ~430k tokens
died 4 ways in a row; each resume produced less than the last.

**Fix: retire the lane with honors and spawn a FRESH one on the next bead.** This is exactly what
the kickoff's agent-#2 test guarantees is possible — a cold agent can boot→claim→work from the
kickoff alone. Re-claim over the stale assignee (claims aren't CAS; announce the takeover on the
unit thread). Rule of thumb: after TWO transient deaths of the same lane in a row, respawn instead
of a third resume; a fresh context is cheaper than debugging a dying one.

⛔ **RETIREMENT MUST BE ENFORCED, NOT ASSUMED — TaskStop the predecessor BEFORE spawning the
successor.** Measured (2026-07-16, an hour after this entry was written): the orchestrator judged a
lane dead from a 151-byte static transcript — but **a resume creates a FRESH output file; a tiny
static transcript seconds after a resume is a lane BOOTING, not a corpse.** The "dead" lane was
alive, relaunched a Codex continuation, and a successor was spawned onto the SAME bead — two lanes
+ an orphaned Codex converging on one worktree. Rules: (1) after resuming a lane, judge its
liveness only after a full probe cycle; (2) a successor is spawned only after `TaskStop` on the
predecessor — a retirement the predecessor can outvote is a race, not a decision; (3) if an
orphaned Codex survives the predecessor, the successor INHERITS its output as round 1 (review like
any Codex diff) — never fire a colliding round while it runs.

- **NEVER kill a lane on a stall suspicion.** A false kill destroys in-flight work and orphans a
  reservation; a false kick costs one sentence. The asymmetry is enormous — respect it.

**Arm it at SWARM LAUNCH, not before** — until lanes exist, ready beads are *supposed* to be
unstaffed and the monitor would cry wolf through the whole planning phase. `TaskStop` it at gate
close.

**⛔ Arming a monitor does NOT hold your turn open — it is a DELIVERABLE, not a wait.** Monitors
are fire-and-forget: they outlive you *by design*, which is exactly what makes them a trap. An
agent that arms one and then reasons "my monitors are holding the turn open, I can stop polling"
is dead the moment it stops emitting tool calls — and this skill's own instruction to arm watches
during prep is what sets that trap. After arming: **`touch` the sentinel, log it, and get back to
your own work in the same turn.** A turn ends when you stop calling tools; nothing you spawn
prevents that. (Real: a 07-prep agent died this exact way, 2026-07-16 — see `codex-first`'s ONE
RULE block, variant 3.)

**The phase gate is a SENTINEL, not a convention — and the watchdog must obey it too.** "Arm it
late" only disciplines the monitor you remember to arm late; anything else that re-runs the
frontier check inherits nothing. Make the phase a fact on disk that every checker reads:

```bash
# at swarm launch:            touch /tmp/<run>-swarm-open
# at gate close / drain:      rm -f /tmp/<run>-swarm-open
# in EVERY frontier check (fast monitor AND watchdog), first line of the loop body:
[ -f /tmp/<run>-swarm-open ] || { echo "phase: swarm not open — frontier check skipped"; continue; }
```

A watchdog whose *only* job is liveness may still run its heartbeat-age check while the swarm is
closed (a dead monitor is worth knowing about early) — but it must **not** alarm on an unstaffed
frontier, and it must not report "fast monitor dead" when the truth is "not armed yet." Those are
different sentences and only one is an emergency. Split them.

> **Real incident (2026-07-16, U2).** The watchdog fired `2 claimable & unstaffed on <epic>
> (check the fast monitor is alive)` while 07-prep was still authoring the kickoff that opens the
> swarm. Both halves were false alarms wearing true statements: the frontier *was* unstaffed
> (correct for the phase) and the fast monitor *was* absent (not yet armed). The fast monitor had
> the phase rule; the watchdog re-derived the check without it. **A rule that lives in one
> checker's prose is not a rule — put it in the data both read.** Cost of the miss: a safety net
> that cries wolf gets muted, and then it is not a safety net.
>
> **Root cause was a PROXY, and this is the general disease.** Its guard read
> `if [ -f /tmp/<run>-fleet-epic ]` with the comment *"only once a swarm epic is live"* — testing
> **"the epic file exists"** as a stand-in for **"the swarm is open."** But that file is published
> at *prep* time so the watchdog can read it: the proxy went true hours before the thing it stood
> for. Identical in shape to `disk-janitor`'s worst bug, where a worktree's release condition named
> `while-running:<the daemon's data-dir pattern>` — a proxy that could never go false. **Same
> disease, opposite symptom: a proxy that is true too early cries wolf; a proxy that is never false
> never releases.**
>
> **THE RULE: never test something *correlated* with your condition — test the condition.** If you
> cannot test it directly, *manufacture* a fact that means exactly what you mean (a sentinel someone
> writes at the moment it becomes true, and deletes the moment it stops) and test that. When you
> catch yourself writing "well, if X exists then Y must have happened" — that is the disease
> talking, and Y is what you should be testing.

### Monitors outlive the fix — re-arm after any logic change

**Fixing this skill does not fix an already-armed monitor.** The fire-and-forget property that makes
monitors useful also means an armed one keeps running its *old* logic forever, immune to every
correction you make afterwards. (Real: the incident above fired a SECOND time, from the same stale
pre-fix watchdog, after both the skill and the freshly-armed monitors were correct.) So a monitor
logic change is a **deploy**, not an edit: `TaskStop` every monitor running the old logic, then
re-arm. Two watchdogs with different rules is worse than one with the wrong rule — you cannot tell
which one is talking.

### The monitor itself can die silently — heartbeat it

A quiet monitor and a **dead** monitor look identical. So: the fast monitor writes
`date +%s > /tmp/<name>.hb` each poll, and a slow **WATCHDOG** Monitor (~30 min) checks the
heartbeat's age AND re-runs the frontier check itself — so a crashed fast monitor degrades to
30-minute coverage instead of none. Guard every command with `|| true`; one transient `br` failure
must not exit the loop and kill the watch. Publish the epic id somewhere the watchdog can read
(e.g. `/tmp/<run>-fleet-epic`) so its redundant check knows what to look at. See `disk-janitor`
§"Silence = healthy is a LIE" — same pattern, same reasoning.

**When the monitor fires**, the orchestrator (or a cheap-tier agent it spawns) does the reconcile:

```
read     <unit>-fleet-plan.md                 # what we believed
observe  frontier  = br ready --limit 0 --parent <epic> --recursive --type task
         claims    = br list --status in_progress        # working vs PARKED
         holds     = agent-mail file reservations        # ← the ACTUAL mutex, the ground truth
         lanes     = live roster (dark ≠ alive)
diff     staffable = frontier − { beads colliding with live holds }
         target    = min(|staffable|, user_cap, mode_cap)
if plan holds        → stay SILENT (silence = the fleet is right)
if plan diverged     → PATCH the plan (append a CORRECTION row, fix the affected step)
                       + recommend to the orchestrator
sleep    bounded FOREGROUND (~10 min: `for i in $(seq 1 40); do sleep 15; done`)
```

- **Poll ~5 min in the Monitor** (it is free) but only EMIT after a debounce — the notification is
  what costs attention, not the poll.
- **Patch the plan every time reality disagrees.** A plan that is never corrected is a lie that
  compounds; a corrected one makes the next reconcile a cheap diff instead of a full re-derivation.
- **If you ARE running as an agent** (a one-shot reconcile the orchestrator spawned, or a stretch
  with no Monitor armed): do the loop inside an OPEN turn with bounded foreground sleeps and
  **never end the turn to "wait"** — a background timer you start dies with your turn. But prefer
  the Monitor: an agent that exists only to sleep is the expensive way to watch a queue.

**Three layers, cheapest first** — none is sufficient alone:
1. **Lanes** (free, event-accurate): they report on close/collision — the fast path.
2. **Monitor** (free, durable): catches what dark or forgetful lanes miss. Lanes have gone dark 8×
   in a single run; this layer is why the fleet still self-corrects when they do.
3. **Orchestrator** (acts): reads the plan, patches, spawns/resumes.

**Events that should wake the fleet early** (lanes report these; the Monitor is the backstop):
- `FRONTIER WIDENED → <n>: <ids>` — a bead closed and unblocked more than the fleet can take
- `HIDDEN SERIAL: <bead> blocked on <files> held by <peer>` — a resource dep the graph missed
- `JIT BEADS FILED → <ids>` — see Phase 4

## Phase 4 — FOLD JIT (the payoff — what cannot be planned at all)

Fix beads from a gate's fix-loop, bugs found mid-run, defects a reviewer surfaces: **these cannot
be forecast, and they are precisely why a resident controller exists.** When they appear:

1. Add them to the plan's step table (a new step, or widen the current one).
2. Compute their width and check disjointness — **against live holds, not declared scopes**.
3. Recommend re-staffing, critical-path first.

**⚠ The fix-loop is when the fleet is SMALLEST and the frontier most likely to suddenly WIDEN.**
By then the lanes have drained (empty-queue=STOP did its job) and a single gate driver is holding
the unit. If it files 7 fix beads, the default outcome is one agent grinding through all 7
serially — while three of them are trivially disjoint (a CI allowlist, a shell script, a test
file). *This has really happened.* Wake, look, and say so:

> `FLEET: 7 JIT beads filed; 3 disjoint (ids…) → recommend +2 lanes, gate driver keeps the
> coupled 4.`

The gate driver must never be the bottleneck for work it does not need to own.

## Declared file scopes are a HINT, never a contract

- **Before lanes run**: the declaration is all you have → use it for Phase 1.
- **Once lanes run**: **live reservations are the truth** → prefer them, always.
- **A declared overlap is real signal** (they collide, at least partly) → treat as serial.
- **A CLEAN declaration proves NOTHING** — the collision may only appear at runtime.

**Bias LOW; the costs are asymmetric.** Under-staffing costs one widening report (seconds).
Over-staffing costs a wasted spawn, a lane parked on a reservation it cannot take, and lock churn
for the lanes that *are* working.

## Recommend — do not spawn

**The orchestrator owns spawn/retire; you observe, patch, and recommend.** Spawning needs its
context (model routing, dispatch prompts, kickoff paths, caps), and two fleet owners means
double-staffing races. Send: current fleet → computed target, the ordered ids, one-line reason.

- **Widening: RESUME before SPAWN.** A parked lane is a warm pool — context, AgentMail identity,
  reservations, seam knowledge all intact. Cheaper and faster than a cold agent.
- **Narrowing is SELF-SERVICE — never recommend killing a lane.** Empty-queue=STOP drains the fleet
  at bottlenecks by itself; a lane that hits a hidden serial parks its claim, which removes the
  bead from the frontier so the math self-corrects. Killing mid-bead destroys work.

## Make the graph learn

Every observed collision is a resource dependency the graph missed. Report it; the orchestrator
files the real `br dep` edge. An undeclared resource dependency that bites twice is a bug in the
graph, not bad luck. Over a run this converts hidden serial bottlenecks into declared ones — and
the next unit's Phase 1 forecast is right the first time.

## Anti-patterns

- **Watching only for under-staffing** — a dead lane's claim makes the frontier look healthy; if
  your only probe is `ready > 0` you will sleep through a stalled unit (see Phantom Staffing)
- **Trusting an agent to report its own death** — it cannot; liveness is always external
- **Treating elapsed time as evidence of death** — long ≠ dead. A 40-min Codex run and a corpse
  look identical if you only measure silence. Check for evidence of WORK (process, build,
  transcript growth), and if any exists, stay quiet
- **Judging a codex by %CPU** (0.0% is what *thinking* looks like — it is awaiting an API response)
  or by its `-o` file size (it does not stream; it is written once, at the end)
- **Killing on suspicion** — a false kill destroys in-flight work; a false kick costs a sentence
- **Fixing N up front and never revisiting** (the original sin)
- **Planning with no artifact** — every wake re-derives the DAG, learns nothing, dies with the session
- **An artifact nobody patches** — a stale plan is worse than none; it is confidently wrong
- Trusting `Files:` over live reservations; reading a clean declaration as permission to over-staff
- **Letting the gate driver solo a pile of disjoint fix beads** (Phase 4 exists for this)
- Killing lanes to narrow (they self-drain)
- Spawning from the controller (two owners = races)
- Polling every minute (events are bead closes, and lanes already report those)
- Narrating quiet checks (a controller that talks when nothing changed is ignored when it matters)
