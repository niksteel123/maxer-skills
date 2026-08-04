---
name: disk-janitor
description: "Autonomous disk-pressure relief for long agent runs. Checks headroom and reclaims space by a safety-ranked ladder (regenerable caches → dead-owner build artifacts → stale worktrees), never touching declared-protected or live-held state. Use when: disk pressure, low disk, disk full, ENOSPC, 'no space left on device', 'clean up disk', 'reclaim space', 'free up space', before/between heavy builds, at stage/unit boundaries, or on any periodic check in a long implementation loop. ALSO read it BEFORE creating large or load-bearing state (build worktree, daemon data dir, seeded fixture, uncommitted evidence) — you MUST declare it in the protect registry at creation time, which is what lets cleanup run without asking anyone."
---

# Disk Janitor — reclaim space without destroying proof

> Disk exhaustion is the most common silent blocker in long agent runs. When it hits, ENOSPC kills
> everything at once — builds, daemons, even the harness's own output files — and the symptoms look
> like anything except disk. The cure must be **autonomous** (no human approving each sweep; that is
> the bottleneck) and **safe** (never deletes state that cannot be rebuilt). Those are compatible
> only because of the Prime Rule.

## Prime Rule: DECLARE at creation, never ASK at cleanup

Asking "is this safe to delete?" at cleanup time is slow, blocks on humans, and is unreliable —
background agents go dark and never answer. So the burden inverts: **whoever CREATES load-bearing
state declares it once, at creation.** Cleanup then reads declarations + process liveness and acts
alone.

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
re-earning proofs or re-running expensive work. An undeclared artifact is a reclaimable artifact —
that is the deal that buys autonomy.

## Model routing — sweeps are cheap work; do not burn a top tier on them

A sweep is ladder-following + liveness-checking + arithmetic. The *safety* lives in this skill's
rules and the registry, not in the sweeper's brilliance. So:

| Runner | Use | Never |
|---|---|---|
| Codex | `-c model="gpt-5.6-terra"` (the lighter tier) | `gpt-5.6-sol` — reserve it for implementation/gates |
| Claude | Opus, or Sonnet for a routine sweep | the top judgment tier (Fable) — reserve it for contracts/audits/gate reviews |

Top tiers are the scarce resource in a long run (and the first thing to hit a usage limit). A
janitor that burns them is stealing from the work it exists to protect. The one exception: if a
sweep escalates (floor breached after the full ladder), the *decision* about what else may go is
owner/orchestrator territory — not the sweeper's, at any tier.

## WHEN to sweep — phase-aware, not uniform polling

**Checking is free (`df -h .`); sweeping is not** (a subagent, and it races live work). So: check
often, sweep on triggers. Most of a pipeline's life — planning, contracts, beads, audits, boundary
advances — writes kilobytes and moves the disk not at all. Sweeping there burns an agent to reclaim
nothing. **Disk is consumed almost entirely by IMPLEMENTATION** (build worktrees ≈ 25–30 GB each,
cargo targets, daemon data, test artifacts). Trigger accordingly:

| Trigger | Why it is the right moment | Action |
|---|---|---|
| **Before implementation starts** (the pre-flight — first build-heavy dispatch of a unit) | You are about to CREATE the GBs. This is the only moment where being short is preventable rather than fatal | **BUDGET CHECK**: free ≥ (expected worktrees × ~30 GB) + the 20 GB floor? If not → sweep NOW, before the swarm launches |
| **Just after a unit closes / a daemon moves to a new worktree** | The finished unit's build worktree just became **ownerless garbage** — usually the single biggest reclaim on the machine (~26 GB). Nobody else will ever notice it | **Opportunistic sweep** — this is the highest-yield moment in the whole cycle |
| **During implementation** (before each heavy build; after a restart; on any suspicious tooling failure) | This is when the disk actually moves, and ENOSPC here kills every lane at once | Check every time; sweep if under threshold |
| **Any `df` reading under threshold, at any time** | Ambient pressure — usually a PARALLEL pipeline on the same machine, not you | Sweep **your own** Scope A + B (their pipeline has its own janitor — see Scope). If only Scope C remains and you are still short: report + escalate, do not raid them |
| **Pipeline close** | Your worktrees/daemons are now permanent garbage, and only YOU know they are | Reclaim your own; **release your registry entries**. Skipping this is how orphans are born |
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
  [ "${a:-999}" -lt 50 ] && echo "DISK: ${a}GB free — under 50GB, janitor sweep recommended"
  [ "${a:-999}" -lt 20 ] && echo "DISK: ${a}GB free — FLOOR BREACHED, sweep NOW"
  sleep 900
done
```

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
- **ONE sweep agent at a time**, cheap tier (`gpt-5.6-terra` / Sonnet), spawned on a firing and
  retired when done. Two concurrent sweeps race each other.
- **If you ARE running as a resident agent** (no Monitor armed, or a stretch the orchestrator wants
  actively watched): loop inside an OPEN turn with bounded foreground sleeps and never end the turn
  to "wait". But prefer the Monitor — an agent that exists only to sleep is the expensive way to
  watch a number.

**Second line of defense, free:** every lane checks `df` before each heavy build and after each
bead lands. Distributed, zero infra, catches growth at the source. The resident is the safety net
for what the lanes miss (their peers' builds, other pipelines, their own cargo dirs growing between
checks).

**Steady-state hygiene beats emergency reclaim**: during a swarm, sweeping Tier 0 opportunistically
at every wake — even when GREEN — keeps `target/**/incremental` and caches from ballooning into the
crisis that stops everyone. Cheap, constant, boring. That is the goal.

## Thresholds — check `df -h .` (one cheap command; run it often)

| Free | State | Action |
|---|---|---|
| > 80 GB | GREEN | none |
| 50–80 GB | AMBER | Tier 0 sweep (silent, zero risk) |
| 20–50 GB | RED | Tier 0 + Tier 1; report what was reclaimed |
| **< 20 GB** | **FLOOR BREACHED** | Tier 0+1+2 immediately; if still under after the full ladder → escalate to the owner (a genuine external block) |

**20 GB is the hard floor.** Never plan work that would cross it. Check **before every heavy build,
at every stage/unit boundary, and after anything that writes GBs**. A single Rust build worktree can
be 25 GB+ — headroom vanishes faster than intuition expects.

## The Reclaim Ladder — always in order, never skip ahead

### Tier 0 — regenerable caches (no coordination, no risk)
Everything here rebuilds itself on next use. Sweep freely.
- Package caches: `~/.npm/_cacache`, `~/.bun/install/cache`, pip/uv caches, `~/.cargo/registry/cache`
- OS/tool caches: `~/Library/Caches/*` (macOS), `~/.cache/*` (Linux) — skip anything a registry protects
- Rust incremental dirs: `target/**/incremental` (regenerates; often multi-GB)
- Stale tool temp: `/tmp/codex-*.md`, `*.log` in scratch dirs older than ~1 day
- Harness leftovers from **dead** sessions: `/private/tmp/claude-*/<session-id>/**` where that
  session id has no live process (see Liveness)

### Tier 1 — dead-owner artifacts (liveness-checked; where the real GBs are)
Reclaimable **only** after proving the owner is gone — and **only in Scope A or B** (your own
pipeline's, or no-man's-land). Another pipeline's dead artifacts are Scope C: leave them.
- `target/` dirs inside **your** build worktrees no running process is executing from
- Stale build worktrees (e.g. `.tmp/*-build-<commit>`) of **your** pipeline, unreferenced
- Dead sessions' scratchpads (these routinely hide 10 GB+ cargo targets) — dead = provably no
  process, no recent mtime
- Evidence/run-roots **already committed to git** (reconstructible → not precious)
- Prefer `cargo clean --manifest-path <worktree>/Cargo.toml` over blind `rm -rf` for cargo trees

### Tier 2 — live but rebuildable (costly, not dangerous)
Only at RED/FLOOR, and say so in the report.
- The main repo's `target/` (forces a full rebuild — expensive, never unsafe)
- Build worktrees of a **running** daemon: stop the daemon per its own protocol FIRST, reclaim,
  then let its owner rebuild+restart. If you cannot verify that protocol, treat as Tier 3.
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
| **A — yours** | Your pipeline's artifacts: its build worktrees, its stale daemons, its committed evidence, its caches | **Sweep per the ladder.** This is your job and nobody else's. |
| **B — no-man's-land** | Things owned by no pipeline: package/OS caches, `target/**/incremental`, `/tmp/codex-*.md`, provably dead sessions' scratchpads | Tier 0/1 rules apply; safe. |
| **C — another pipeline's** | Their worktrees, daemons, data dirs, scratchpads, evidence — live OR idle | **Hands off by default.** Every pipeline runs its own janitor; theirs knows its state, its protected paths and its timing better than you ever will. Reclaiming their artifacts is presumptuous and the fastest way to break work you cannot see. |

**The ONLY Scope-C exception**: you are **below the 20 GB floor**, your Scope A + B ladder is
**exhausted**, and the artifact is **provably dead** (no process, no registry claim, no recent
mtime). Even then, prefer to **report the candidates and escalate** over reclaiming them — under
pressure, a wrong cross-pipeline reclaim turns your disk problem into someone else's data loss.

**Corollary — clean up after yourself at PIPELINE CLOSE.** Reclaim your own worktrees/daemons and
**release your registry entries** when your pipeline finishes. Otherwise your garbage becomes
precisely the Scope-C orphan that every future janitor is too polite to touch, and the machine
silts up with debris nobody feels entitled to remove.

## ⛔ Machine locality — WHOSE computer is this? (gates everything above)

The entire scope/ladder model above silently assumes **you are on the operator's OWN primary
machine**, where OS caches, `/tmp`, `~/Library/Caches`, and other "no-man's-land" (Scope B, Tier 0)
are genuinely safe to reclaim. **On any machine you do not own, that assumption is false and
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

## Swarm awareness — look, don't ask

The Prime Rule bans **asking permission** (the bottleneck; dark agents never answer). It does not
ban **looking**. Before reclaiming anything while a swarm is live, read the swarm's own declared
state — authoritative, free, and non-blocking:

1. **The registry** (`.disk-protect`) — declarations + release-conditions
2. **Work claims** — `br list --status in_progress` (or the run's ledger): who is mid-bead
3. **File reservations** — agent-mail reservations name the exact files lanes hold
4. **Processes** — `ps` / `lsof`: what executes from where, what holds handles
5. **The run log** — AUTO-PILOT / pipeline guide: live roster, daemon identity, current unit

You MAY broadcast a courtesy heads-up before a large reclaim — but **never wait on replies**: a lane
mid-build will not answer and a dark one never will. Awareness informs the skip; it never gates the
sweep.

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

## Autonomy — and the ONE escalation
Run Tiers 0–2 **without asking anyone**. Do not request approval per path; do not block on peer
agents' replies (they may be mid-run or dark). The registry + liveness ARE the authorization.

Escalate to the owner in exactly one case: **the full ladder ran and free space is still under the
20 GB floor.** That is a genuine external block — report the ranked candidates you did NOT take
(with sizes + why each was protected), and let the owner decide. Never silently continue below the
floor, and never breach Tier 3 to avoid asking.

## Coordination — courtesy, not permission
After a sweep, notify live peers (agent-mail or the run's log) with what vanished, so a lane that
loses its cargo cache understands the recompile. Notification is **after** and **non-blocking** —
never a gate on the sweep.

## Reporting (always, even when nothing was taken)
- Free before → after, and total reclaimed
- Per tier: what was taken (path + size)
- **What was SKIPPED and why** (protected by registry / live owner / ambiguous) — this is the part
  that earns trust in an autonomous janitor
- Any registry entries that look stale (released conditions) — recommend pruning; don't act on them
  in the same sweep

## Anti-patterns
- Blanket `rm -rf .tmp` / `rm -rf target` without the ladder and liveness — the classic way to
  destroy a day of proofs in one second
- Reclaiming a daemon's data dir "because the daemon is down" (it is down *because* someone will
  restart it; its state is the point)
- Asking the owner per sweep (the bottleneck this skill exists to remove)
- Sweeping silently (nobody trusts a janitor that does not report)
- Treating an undeclared-but-obviously-precious path as fair game — if it smells load-bearing and
  liveness is ambiguous, skip it and flag the missing declaration in your report
