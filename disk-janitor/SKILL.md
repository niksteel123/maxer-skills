---
name: disk-janitor
description: "Inspect disk pressure and rank cleanup candidates for long agent runs. Check headroom, protection, references and live ownership; deletion always needs the user's explicit authorization. Use for low disk, ENOSPC, cleanup planning, and before/between heavy builds. Also read before creating load-bearing state so its ownership, dependencies and retention are recorded."
---

# Disk Janitor — reclaim space without destroying proof

> Disk exhaustion is the most common silent blocker in long agent runs. When it hits, ENOSPC kills
> everything at once — builds, daemons, even the harness's own output files — and the symptoms look
> like anything except disk. Inspect and prepare concrete options autonomously;
> perform file deletion only within the user's explicit authorization. Being
> rebuildable, old, unprotected or owned by a finished unit is not authorization.

## Prime Rule: declare ownership; deletion requires explicit permission

Whoever creates load-bearing state records its owner, references and retention.
Read those declarations plus actual liveness before proposing exact cleanup paths.
No registry release, lease expiry or absent process grants deletion authority.
Existing user authorization for exact paths/actions carries forward; do not ask
again for the same authorized act. If permission is missing, finish the candidate
inventory and impact assessment before asking. Do not delete while waiting.

**Registries** (both read on every sweep; append-only, one entry per line, `#` comments):
- Repo-scoped: `<repo-root>/.disk-protect`
- Machine-scoped: `~/.claude/disk-protect`

**Entry format:**
```
<absolute-or-repo-relative path> | <owner> | <why it cannot be rebuilt> | <release-condition>
```
`release-condition` ∈
- `while-running:<process pattern>` — protected while a matching process lives (auto-releases)
- `until:<YYYY-MM-DD>` — protected until that date
- `manual` — never auto-reclaimed; only an explicit owner instruction releases it

⚠ **A `while-running:` pattern MUST test the artifact's OWN liveness — never a proxy.** Real
example: a build worktree was declared `while-running:<daemon's data-dir name>`. The daemon later
rebuilt and moved to a NEW worktree while keeping the same data dir — so the old 26 GB worktree was
ownerless garbage, but the condition still "held" and would have protected it forever. Name the
thing itself (`while-running:<that worktree's path>`), so the declaration expires exactly when the
artifact stops being load-bearing. A condition that can never release is `manual` wearing a
disguise — and it silently defeats the whole registry.

**You MUST add an entry before walking away from**: daemon/service data dirs, instantiated
fixtures or seeded DBs, uncommitted evidence, long-lived build worktrees, anything whose loss forces
re-earning proofs or re-running expensive work. An undeclared artifact needs an
ownership/reference check; it is never permission to delete.

## Model routing — consume the fleet registry

Use `fleet-controller` and the model registry selected by the actual `uvp-fleet`
configuration. Prefer an efficient eligible model for routine inspection, but
apply required judgment/tool capability, live capacity and qualified authorized
accounts before scores. Pass the selected model to the runner. No fixed provider
or tier replaces those checks; deterministic disk probes need no paid model.
Deletion authority remains the user's at every model tier.

## WHEN to sweep — phase-aware, not uniform polling

**Checking is free (`df -h .`); sweeping is not** (a subagent, and it races live work). So: check
often, sweep on triggers. Most of a pipeline's life — planning, contracts, beads, audits, boundary
advances — writes kilobytes and moves the disk not at all. Sweeping there burns an agent to reclaim
nothing. **Disk is consumed almost entirely by IMPLEMENTATION** (build worktrees ≈ 25–30 GB each,
cargo targets, daemon data, test artifacts). Trigger accordingly:

| Trigger | Why it is the right moment | Action |
|---|---|---|
| **Before implementation starts** (the pre-flight — first build-heavy dispatch of a unit) | Budget the actual incremental build/scratch demand on existing roots | Check configured headroom; propose eligible cleanup before launching if short. Do not assume one worktree per agent. |
| **Just after a unit closes / a daemon moves to a new worktree** | A prior root may have become unused, but retained proof can still reference it | Inspect ownership and inbound references; propose exact candidates without deleting |
| **During implementation** (before each heavy build; after a restart; on any suspicious tooling failure) | This is when the disk actually moves, and ENOSPC here kills every lane at once | Check headroom; pause a new build or propose exact authorized cleanup if short |
| **Any `df` reading under threshold, at any time** | Ambient pressure may come from a parallel pipeline | Inspect candidates in **your own** Scope A + B; delete only with explicit authorization. If only Scope C remains and you are still short: report + escalate, do not raid it |
| **Pipeline close** | Confirm which work and retention obligations actually ended | Record released ownership and report exact cleanup candidates; deletion and shared-daemon lifecycle still need their own authorization |
| Planning stages (contract, beads, audit, boundary advance) | They write KB. Nothing to reclaim, nothing being created | **Check only** (it is one command and catches ambient pressure). **Do NOT dispatch a janitor** unless the reading is actually under threshold |

The two triggers people forget are the ones that pay: **pre-implementation budgeting** (short disk
discovered *after* a 40-minute build is a wasted build) and the **post-unit-close reclaim** (a stale
worktree nobody owns, which will otherwise sit there for the rest of the run).

## RESIDENT MODE — the implementation watchdog (the one that saves the human)

**A single pre-flight check is stale within minutes** once N lanes are building: each lane's cargo
tree, each sanctioned rebuild-restart, each test run adds GBs *continuously*. Checking only at
boundaries is exactly why a human ends up cleaning by hand three times mid-run — the bottleneck
this skill exists to delete. So **for the duration of an implementation swarm, a janitor runs
RESIDENT**, in parallel with the lanes.

**Shape — a `Monitor` watches; an AGENT only sweeps when it fires.** Do NOT park a resident agent
in a sleep loop to watch a number: it burns tokens every wake, bloats its own context, and **dies
if it ever ends its turn** (the most common agent failure there is). A Monitor is a shell process:
free while sleeping, `persistent: true` for the session, and it wakes the ORCHESTRATOR — who can
then spawn a one-shot sweep agent if there is actually something to reclaim.

```bash
# Disk watch — emits ONLY below threshold (silence = healthy)
while true; do
  a=$(df -g . | tail -1 | awk '{print $4}')
  [ "${a:-999}" -lt 50 ] && echo "DISK: ${a}GB free — inspect pressure and propose exact cleanup candidates"
  [ "${a:-999}" -lt 20 ] && echo "DISK: ${a}GB free — pause new heavy builds; cleanup needs explicit authorization"
  sleep 900
done
```

The example thresholds are fallbacks; use the active project's measured budget
and configured floor. Reuse an existing resource watcher when available; do not
add a second monitoring stack as a prerequisite to ordinary work.

- **Poll ~15 min.** Disk fills over tens of minutes (a cargo build is minutes; a worktree is one
  event), so tighter polling buys nothing. Tighten only if a run is observed burning >1 GB/min.
- **Emit only what you would ACT on.** A monitor that narrates every quiet check trains everyone to
  ignore it — and the harness stops chatty monitors outright.

### ⚠ "Silence = healthy" is a LIE unless you can prove the watcher is alive

A monitor can die silently — a crashed script, a transient `df`/`br` failure that exits the loop,
a harness reap, a chatty-monitor auto-stop. **A dead monitor and a healthy system look identical:
both are quiet.** That is the worst failure shape there is, and it is the one everybody ships.

So every fast monitor writes a **heartbeat**, and a **slow WATCHDOG** (~30 min) checks it:

```bash
# In the fast monitor's loop — one line, before the real check:
date +%s > /tmp/<name>.hb 2>/dev/null || true

# The watchdog (separate Monitor, ~30 min):
hb=$(cat /tmp/<name>.hb 2>/dev/null || echo 0); age=$(( $(date +%s) - ${hb:-0} ))
[ "${hb:-0}" -eq 0 ] || [ "$age" -gt 2100 ] && echo "WATCHDOG: <name> is DEAD (${age}s stale) — RE-ARM it"
```

**The watchdog must ALSO run the real check itself**, not just the liveness probe. Then a dead fast
monitor degrades to *slower coverage* (30 min) instead of *no coverage* — a graceful failure
instead of a silent one. Guard every command with `|| true` so one transient error cannot exit the
loop and kill the watch.

**Layered, each catching the one above** (latency grows, coverage never hits zero):
lanes/agents report (instant, but they go dark) → fast monitor (~15 min, can crash silently) →
slow watchdog (~30 min, heartbeat + redundant real check) → the orchestrator's natural wakes
(free — check monitor liveness whenever a notification arrives for any reason) → the human.
You cannot make it infinitely reliable; you make each layer fail into a slower one that still works.
- **ONE inspection/authorized-cleanup agent at a time**, selected through the fleet registry, spawned on a firing and
  retired when done. Two concurrent sweeps race each other.
- **If you ARE running as a resident agent** (no Monitor armed, or a stretch the orchestrator wants
  actively watched): loop inside an OPEN turn with bounded foreground sleeps and never end the turn
  to "wait". But prefer the Monitor — an agent that exists only to sleep is the expensive way to
  watch a number.

**Second line of defense, free:** every lane checks `df` before each heavy build and after each
bead lands. Distributed, zero infra, catches growth at the source. The resident is the safety net
for what the lanes miss (their peers' builds, other pipelines, their own cargo dirs growing between
checks).

Inspect growth when it changes a build decision. Do not repeatedly purge caches
at every wake: persistent compatible build roots save iteration time. A green
capacity reading needs no cleanup run; deletion still requires explicit permission.

## Thresholds — check `df -h .` (one cheap command; run it often)

| Free | State | Action |
|---|---|---|
| > 80 GB | GREEN | none |
| 50–80 GB | AMBER | Inspect growth against the planned workload |
| 20–50 GB | RED | Rank Tier 0/1 candidates and their rebuild/retention cost |
| **< 20 GB** | **FLOOR BREACHED** | Pause work that would breach its budget; present exact candidates and obtain missing deletion permission |

These are fallback thresholds; use the project's explicit current resource budget
or user override. Never plan work that would cross its floor. Check **before every heavy build,
at every stage/unit boundary, and after anything that writes GBs**. A single Rust build worktree can
be 25 GB+ — headroom vanishes faster than intuition expects.

## The Reclaim Ladder — always in order, never skip ahead

### Tier 0 — potentially regenerable caches (inspect before proposing)
Check actual rebuildability, ownership and references. Every deletion still needs
explicit user authorization; this list is not an allowlist to execute.
- Package caches: `~/.npm/_cacache`, `~/.bun/install/cache`, pip/uv caches, `~/.cargo/registry/cache`
- OS/tool caches: `~/Library/Caches/*` (macOS), `~/.cache/*` (Linux) — skip anything a registry protects
- Rust incremental dirs: `target/**/incremental` (regenerates; often multi-GB)
- Session transcripts, pending patches, handoffs and proof logs are retained state,
  even under `/tmp`; age or a dead session is not evidence of disposability.

### Tier 1 — dead-owner artifacts (liveness-checked; where the real GBs are)
Eligible to propose **only** after proving the owner is gone — and **only in Scope A or B** (your own
pipeline's, or no-man's-land). Another pipeline's dead artifacts are Scope C: leave them.
- `target/` dirs inside **your** build worktrees no running process is executing from
- Stale build worktrees (e.g. `.tmp/*-build-<commit>`) of **your** pipeline, unreferenced
- Dead sessions' scratchpads (these routinely hide 10 GB+ cargo targets) — dead = provably no
  process, no recent mtime
- Retained evidence remains subject to its retention and input-reference obligations,
  even when committed. Verify exact recoverability before proposing any removal.
- `cargo clean` deletes files too: name its exact affected build root and obtain
  explicit authorization; prefer preserving reusable build outputs.

### Tier 2 — potentially rebuildable live resources (coordination required)
Only propose at RED/FLOOR, with rebuild and interruption costs stated.
- The main repo's `target/` can be shared by live builds; verify actual ownership.
- Build roots of a running daemon are not cleanup targets until its lifecycle and
  retained-state custody are explicitly coordinated. Never stop a healthy daemon
  merely to make its files appear unused.
- Container images/volumes, if any

### Tier 3 — NEVER auto-reclaim
- Anything matching a registry entry whose release-condition still holds
- Daemon/service data dirs holding earned state (proof state, ledgers, event stores)
- Uncommitted or untracked work in any repo (`git status` dirty = someone's in-flight work)
- `.git/`, `.beads/`, seeded fixtures that ARE proofs, un-committed evidence
- Anything under a **live** session's scratchpad
- The owner's personal files, Trash, Downloads, Documents — never touch; recommend, don't act

## Scope — stay in your own lane

| Scope | What | Rule |
|---|---|---|
| **A — yours** | Your pipeline's build roots, retained evidence and caches | Inspect per the ladder; ownership does not grant deletion permission. |
| **B — shared or apparently unowned** | Package/OS caches, incremental build outputs and session scratch | Determine ownership and retention; propose only confirmed candidates. |
| **C — another pipeline's** | Their worktrees, daemons, data dirs, scratchpads, evidence — live OR idle | **Hands off by default.** Every pipeline runs its own janitor; theirs knows its state, its protected paths and its timing better than you ever will. Reclaiming their artifacts is presumptuous and the fastest way to break work you cannot see. |

Pressure creates no Scope-C deletion exception. Report candidates and coordinate
with their owner; obtain the user's explicit deletion authorization before acting.

**At pipeline close**, record which ownership/retention conditions ended and
provide exact cleanup candidates. Keep still-referenced proof and healthy shared
processes intact; a unit close alone grants no deletion or daemon-stop authority.

## ⛔ Machine locality — WHOSE computer is this? (gates everything above)

All reads or operations on another machine run in a dedicated qualified machine
lane. Return concise findings and exact candidate paths; do not load private
machine runbooks into the orchestrator. Locality restrictions add to the user's
explicit deletion rule; they never replace it.

The entire scope/ladder model above silently assumes **you are on the operator's OWN primary
machine**, where OS caches, `/tmp`, `~/Library/Caches`, and other "no-man's-land" (Scope B, Tier 0)
are candidates for inspection, never automatic deletion. **On any machine you do not own, that assumption is false and
dangerous — "no-man's-land" is THAT person's land, and a computer-wide reclaim can delete a
stranger's real work or personal files.**

**Rule: on a REMOTE / BORROWED / SHARED / test-rig node that is not the operator's primary dev box,
cleanup is restricted to the PROJECT'S OWN directories that the rig itself created** — nothing else,
ever:

- ✅ Reclaimable: only paths the project provisioned (e.g. its rig root like `~/swarmnet-rig/**`,
  per-run `data`/`target`/`evidence`/scratch dirs the rig created, daemons the rig started). Scope A
  only, and only the subtree the project owns.
- ⛔ FORBIDDEN on a non-owned machine, regardless of disk pressure: computer-wide caches
  (`~/Library/Caches`, Homebrew/npm/pip/cargo registry caches, `sccache` unless the project created
  it), system/user `/tmp` and `/var`, ANY path outside the project's own rig root, and of course any
  other user's or the owner's personal data. The Scope-B "no-man's-land" tier and the 20 GB-floor
  Scope-C exception **do not apply** here — there is no floor emergency that justifies touching a
  borrowed machine's OS/personal storage. If the project's own dirs are exhausted and space is still
  low, **STOP and report to the operator**; never widen the blast radius on hardware you don't own.
- When in doubt about whether a path belongs to the project vs the machine's owner, treat it as the
  owner's and leave it. `rm`/cache-clear commands sent over SSH to a remote node must name explicit
  project-owned paths — never a broad sweep, never a wildcard that can escape the rig root.

For any project with a multi-node test rig, the non-primary nodes (any node that is not the
operator's own primary dev box — including borrowed or personal machines) are exactly this case. If
the rig has an operational runbook listing its exact project-owned paths, read it before any remote
cleanup.

## Swarm awareness — inspect before proposing cleanup

Read the swarm's declared state before proposing a path. Inspection is autonomous;
deletion requires the user's explicit authorization after the impact is concrete:

1. **The registry** (`.disk-protect`) — declarations + release-conditions
2. **Work claims** — `br list --status in_progress` (or the run's ledger): who is mid-bead
3. **File reservations** — agent-mail reservations name the exact files lanes hold
4. **Processes** — `ps` / `lsof`: what executes from where, what holds handles
5. **The run log** — AUTO-PILOT / pipeline guide: live roster, daemon identity, current unit

Coordinate live ownership before an authorized cleanup. A courtesy message or a
peer's silence is not approval; ambiguous ownership means leave the path intact.

**During an active swarm, bias hard to skip.** A lane's cargo dir mid-build is indistinguishable
from garbage. If a live lane could plausibly be using it, it is Tier 3 *for this sweep* — you get
another look in 15 minutes; they do not get their 40-minute build back.

## ⚠ Ownerless ≠ unreferenced — check for INBOUND references before reclaiming

**A protected artifact can depend on an unprotected one.** Proving nobody *executes* from a path is
not proving nothing *points at* it. Real incident (2026-07-15): a build worktree was correctly
released (the daemon had moved on) and reclaimed — but live, registry-**protected** fixtures held
`package_root` paths **into that worktree**. The fixtures were protected; the thing they referenced
was not. The reclaim silently broke them, and it surfaced hours later mid-re-earn as a confusing
"fixture is gone" failure with no obvious cause.

Before taking any Tier-1 path, grep the live state for references to it:
```bash
grep -rl "<candidate-path>" <data-dir> <registry> <pipeline-folder> 2>/dev/null | head
# plus: does any live instance/record embed it? (verify get … | grep <candidate-path>)
```
If a **protected** artifact references the candidate, it is Tier 3 **by inheritance** — protection
propagates along references. Either skip it, or (better) report it: *"X is ownerless but the
protected fixture Y points into it — that reference is the real bug; someone should re-root it."*

**Declare the reference AT CREATION, not at sweep time.** The Prime Rule says declare state when you
create it; the corollary is **declare the *edge* when you create the edge**. The moment you point
durable state at a disposable path — instantiate a package whose `package_root` lands in a build
worktree, seed a fixture inside one, key a cache to one — that is the moment to record it, in the
registry entry for BOTH ends. Discovering it later by grepping the ledger works only if a sweep
happens to look, which is luck, not a system. (Real, 2026-07-16: the same trap fired a second time —
a 73G worktree whose own condition had genuinely released, still referenced by 4 `package_root`
entries in the protected earned-green ledger, one of them a direct in-worktree path with no symlink
indirection. Caught only because the sweep grepped the ledger before acting.)

**When the reference itself is the bug, say so — don't just skip.** Durable state holding absolute
paths into disposable scratch dirs is a *durability defect in the durable thing*, not a janitorial
inconvenience. The registry can protect the path forever, but that only freezes the bug in place:
the scratch dir becomes permanent because something irreplaceable points at it. Report it to whoever
owns the durable state; the fix is re-rooting or path-independence, and it belongs to them.

**Generalise it**: this is the same class as the proxy release-condition — **the registry protects
paths, not dependency graphs**. When you declare a protected artifact, also declare (or eliminate)
what it points at. An artifact whose liveness depends on an undeclared path is a time-bomb with a
long fuse.

## Liveness — what makes Tier 1 safe
Before reclaiming anything with a possible owner, prove the owner is dead:
1. **Process check**: `ps aux` for a process whose cwd, `--data-dir`, or executable path sits inside
   the candidate path (that is what `while-running:` conditions test).
2. **Session check**: for `/private/tmp/claude-*/<id>/`, is any live process bound to that session id?
3. **Recency**: mtime within ~2h → assume live even without a process match; skip it.
4. **Ambiguity loses**: if you cannot prove the owner is dead, it is Tier 3 for this sweep. Skipping
   a reclaim costs disk; a wrong reclaim costs someone's day.

## Autonomy and authorization
Complete inspection, reference checks and a ranked exact-path impact report
without waiting for approval. Execute only deletion actions already explicitly
authorized by the user. Otherwise ask once for the concrete proposed action and
explain this file's rule; no age, tier, registry release or pressure waives it.
While permission is pending, preserve files and pause work that would breach its
resource budget. Never breach Tier 3 to avoid reporting a blocker.

## Coordination
After an authorized cleanup, report exact affected paths, preserved evidence and
headroom. Notify the relevant work owners through existing coordination; a
notification never substitutes for the required deletion authorization.

## Reporting (always, even when nothing was taken)
- Free before → after, and total reclaimed
- Per tier: what was taken (path + size)
- **What was SKIPPED and why** (protected by registry / live owner / ambiguous) — this is the part
  that earns trust in an autonomous janitor
- Any registry entries that look stale (released conditions) — recommend pruning; don't act on them
  in the same sweep

## Anti-patterns
- Blanket `rm -rf .tmp` / `rm -rf target` without exact user authorization and ownership/reference checks — the classic way to
  destroy a day of proofs in one second
- Reclaiming a daemon's data dir "because the daemon is down" (it is down *because* someone will
  restart it; its state is the point)
- Treating a cleanup tier, registry release, old timestamp or absent process as deletion permission
- Sweeping silently (nobody trusts a janitor that does not report)
- Treating an undeclared-but-obviously-precious path as fair game — if it smells load-bearing and
  liveness is ambiguous, skip it and flag the missing declaration in your report
