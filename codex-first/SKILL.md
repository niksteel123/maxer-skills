---
name: codex-first
description: "Route implementation work to Codex CLI; Claude specs, reviews, verifies."
---

# Codex First

Claude Code sessions only. Codex/other harnesses: skip; never self-delegate.

Rationale: Claude (Fable/Opus) tokens metered + expensive; Codex flat-rate. GPT-5.5+ is usually the better and faster model at writing/implementing code; Claude wins at ergonomics — judgment, design, spec-writing, review, orchestration. So Codex types, Claude thinks and verifies.

## Route

Delegate to Codex (default for hands-on work):

- implementation from a frozen spec; refactors; mechanical migrations
- bug fixes with known repro; test writing; coverage fills
- CI fixes, dependency bumps, scripts/tooling
- bulk codebase exploration where raw reading ≫ the answer

Keep in Claude:

- design, API design, architecture, naming, UX judgment
- tasks where writing the spec IS the work (ambiguity = design)
- tiny edits (~<20 lines, single obvious change) — delegation overhead loses
- anything needing session tools: MCP (browser/computer-use/chronicle), 1Password, secrets
- destructive/irreversible ops, releases, pushes, GitHub mutations — Claude-side per git rules
- review of Codex output — never delegated, never skipped

Mixed task: Claude designs first, freezes spec, delegates build-out.
Heuristic: prompt reads as a work order → delegate; writing it forces decisions → design, Claude.
Portfolio/multi-repo work: `$maintainer-orchestrator` instead.

## Invoke

Prompt via temp file, never inline quoting:

```bash
P=$(mktemp); cat >"$P" <<'EOF'
<goal, repo + key paths, constraints ("don't touch X"), non-goals, proof expected, output shape>
EOF
command codex exec --yolo -C <repo> \
  -c model_reasoning_effort="xhigh" \
  `# substantive work (implementation/audits/planning) = sol + xhigh, the config defaults.` \
  `# NEVER pass a lower effort — a stale "high" here silently downgraded a whole run once.` \
  `# Ops chores only (cleanup/housekeeping): add -c model="gpt-5.6-terra" to save the top tier.` \
  -o /tmp/codex-last.md - <"$P" 2>/dev/null
```

- `--yolo` is the house default; Codex may run commands/tests freely. Keep prompts scoped to the target repo.
- `command codex` bypasses the interactive zsh wrapper; if not on PATH: `fnm exec --using default -- codex`
- stderr suppressed (thinking noise bloats context); drop `2>/dev/null` only to debug a failing run
- read `-o` file for the result; don't parse the JSONL stream
- **⛔ READ THIS FIRST — THE ONE RULE: a turn ends when you stop calling tools. NOTHING you spawn
  holds it open.** Not a background job, not a monitor, not a subagent. There is no "parked" or
  "waiting" state — the only thing keeping you alive is *continuing to act*. Every death below is
  the same death: an agent reasoned its way to "something else is holding my turn" and stopped.
  **You cannot verify that belief from inside your own reasoning, so never act on it.** If the work
  is not done, keep polling in the FOREGROUND. That is the whole discipline; the rest is detail.
  Four variants seen, all fatal, all in ONE pipeline run — and all four are the same death:
  1. *untracked wait* — nohup/detached/self-armed timer (×9)
  2. *tracked the WAITER, not the work* — backgrounded a poll wrapper; it exited, the wake raced the turn-end (×1)
  3. *"my monitors hold me open"* — armed durable monitors (correctly! by design!) and mistook them
     for life support. **Monitors are FIRE-AND-FORGET: they outlive you by design and hold
     nothing.** Arming one is a deliverable, not a wait. (×1)
  4. *"my tracked background job holds me open"* — **the one this skill itself taught.** It does
     not. Measured: the job was still running when the agent's completion fired. (×1) See the
     CORRECTION below.

  Do not go looking for the safe way to wait. **There isn't one.** Every variant above was an agent
  finding a new thing to trust instead of taking its next tool call.
- **long runs — FOREGROUND POLLING IS THE ONLY RELIABLE PATTERN.** Poll inside an open turn:
  ```bash
  for i in $(seq 1 24); do test -s /tmp/codex-last.md && break; sleep 15; done
  ```
  repeated across tool calls, doing useful prep between them. Don't kill quiet runs <30 min —
  LONG ≠ DEAD; judge Codex by its OUTPUT, never by wall-clock silence.
- **⛔ CORRECTION (2026-07-16) — `run_in_background` does NOT hold a subagent's turn open.**
  This skill previously claimed the harness "TRACKS it, keeps you alive, and RE-INVOKES you when
  it exits." **That is FALSE for subagents, and it was the root cause of all 12 deaths in one
  pipeline run.** Measured directly: a lane launched `codex exec` with `run_in_background: true`,
  ended its turn citing the guarantee — and the orchestrator confirmed **the Codex process was
  still alive (pid 40580) while the lane's completion notification had already fired.** A live
  tracked job did not prevent the turn from ending. (Likely only spawned *agents* count as
  "children"; a background bash job does not. Do not rely on the distinction either way.)
  **You may still `run_in_background` the work — just never treat it as life support.** Launch it,
  then keep polling in the foreground. If you are a subagent and your work isn't done, the only
  thing keeping you alive is your next tool call.
  > The lesson beyond the mechanism: this skill *asserted* a guarantee nobody verified, and 12
  > agents obeyed it into the ground. A declared invariant with no verified consumer is exactly
  > the defect class the verify substrate exists to catch — and it was sitting in the operating
  > manual the whole time. When a rule says "the system will take care of X for you," **test that
  > it does** before writing it down.
- **Background the WORK, never a WAITER.** Backgrounding a *poll/sleep wrapper* that watches Codex
  is not the same as backgrounding Codex — and it dies differently. The waiter is short-lived by
  design: it exits, and the wake you were counting on races your own turn-end. `run_in_background`
  the `codex exec` command ITSELF, so the tracked child's lifetime IS the work's lifetime.
  Rule of thumb: if your background job would still be running when the work finishes, it's a
  waiter — delete it.
- **Your last message IS a completion — the harness cannot hear "but I'm still waiting."** There is
  no "pause" state. Ending a turn with *"waiting for X; no further action needed from me"* does not
  park you; it ENDS you, and your report of a wait reads to the caller as a finished task. If the
  work isn't done, your turn must not end — hold it open with a foreground poll and say what you
  found, not what you're waiting for.
  > Real incident (2026-07-15, D15 lane): the agent correctly used a tracked background job — but
  > tracked a *poll*, then signed off "waiting for the poll to signal." The poll had already exited;
  > the completion fired to the orchestrator; the lane sat dead until kicked. Doing the tracked-job
  > step right does not save you if the turn ends on a wait. **The turn-end is the bug, not the
  > backgrounding mechanism.**
- parallel independent tasks OK: separate repos/dirs, separate `-o` files
- outside a git repo add `--skip-git-repo-check`

⛔ **`resume --last` IS MACHINE-WIDE, NOT YOURS — never use it when lanes run concurrently.**
"Last" means the last Codex session *on this machine*, so with 2+ lanes it silently resumes a
**peer's** session and answers you from their context. Measured (U2, 2026-07-16): a lane's resume
picked up the wrong session and returned a misleading summary; only a direct grep/diff of the actual
code proved the changes were still correct. This fails **quietly** — you get a fluent, plausible,
wrong answer. In any swarm: resume by **explicit session id**, or just start a fresh `codex exec`
(cheaper than debugging a cross-contaminated context). If you do resume, **verify the output
describes YOUR files** before trusting a word of it.

Follow-up fixes — cheaper than fresh runs, keeps context. `resume` has no `-C`/`--yolo`: run from the repo dir, spell the long flag:

```bash
(cd <repo> && command codex exec resume --last \
  --dangerously-bypass-approvals-and-sandbox \
  -o /tmp/codex-last.md - <"$P2" 2>/dev/null)
```

## Prompt contract

Codex starts with zero session context. Every prompt: goal, exact repo/paths, constraints, non-goals, proof expected (exact test command), output shape ("report files changed + test output"). Spec quality decides success.

## Verify (Claude, always)

- `git status -sb` + read the full diff; judge like a contributor PR
- run focused tests yourself or demand proof output; Codex claims are advisory
- iterate via resume; after 2 failed rounds, take over and do it directly
- normal closeout still applies: `$autoreview` before ship

## Economics

Win = generation + exploration tokens moved to Codex; Claude spends only on spec + diff review. Don't ping-pong trivia through delegation; don't re-read what Codex already summarized.
