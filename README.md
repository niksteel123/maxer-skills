# Maxer Skills

Agent skills for rigorous, spec-driven implementation pipelines — workflows that carry a feature from raw idea to production-audited code without spec drift.

Three workflow entry points ship here:

- **Git Contractmaxxer (everyday delivery)** — plan, implement, review or take over
  feature work through existing GitHub issues and PRs, without restarting a stage chain.
- **Contract-First (specialist)** — adopt explicit contracts, verification packages and unit gates
  where the project needs them.
- **3-SOT (legacy)** — preserve existing Spec / TDD / Strategy projects; avoid as the default for new work.

47 bundled skills, refreshed against the owner's installed sources on **2026-11-11**.
Everyday third-party helpers, including **no process porn/ceremony**, are catalogued
with upstream links in [dependencies](docs/DEPENDENCIES.md), subject to their licenses.

Works with [Claude Code](https://code.claude.com) and [Codex](https://developers.openai.com/codex).

## Which skills should I use now?

These are maintainer recommendations as of **2026-11-11**, based on the current
skill instructions and the recent usage check below. A recent copy is not
necessarily a modern workflow, and an unused specialist is not necessarily obsolete.
The labels guide selection; they do not delete skills, change existing contracts,
or disable installer entries. `--all` still includes legacy skills.

### Recommended current workflow

| Need | Start here | Why |
| --- | --- | --- |
| Deliver or take over a feature | [git-contractmaxxer](git-contractmaxxer/) | Continues current issues, PRs, ownership and evidence; adapts the next action rather than generating a compulsory stage chain |
| Plan related product outcomes | [product-board](product-board/) | Keeps the existing roadmap/work plane instead of creating another tracker |
| Choose models or delegate work | [fleet-controller](fleet-controller/) | Uses current authorized options and task fit; replaces fixed provider-role assumptions |
| Ground an uncertain proposal | [research-hardening](research-hardening/) | Check current intent, code and inputs; use its full stage only when adopting the contract pipeline |
| Preserve continuity or explain a failure | [intent-to-handoff](intent-to-handoff/), [error-manifest](error-manifest/) | Focused handoff and debugging utilities; use when a recipient needs them |

The external **no-process-porn/ceremony** and **reality-check-for-project** skills
are useful optional complements, installed through their authorized upstream.
See [dependencies](docs/DEPENDENCIES.md#optional-everyday-skills-install-from-the-owner).

### Current, but only for the relevant task or stack

| Group | Skills | Use when |
| --- | --- | --- |
| Contract-first delivery | [contractmaxxer](contractmaxxer/) and the [contract stages](#the-contract-first-pipeline) | The repository actually adopts contract units and executable verification; a heavier option than everyday GitHub delivery |
| Verification | [verify-authoring](verify-authoring/), [verify-ops](verify-ops/), [uvp-goal](uvp-goal/) | A compatible verification runtime exists; these are not a universal install-and-run test system |
| Accounts/storage | [fleet-accounts](fleet-accounts/), [disk-janitor](disk-janitor/) | Account qualification or actual disk pressure requires them |
| Research/document utilities | [idea-to-research](idea-to-research/), [codebase-to-spec](codebase-to-spec/), [skill-creator](skill-creator/) | The requested deliverable is research, an extracted specification or a skill |
| UI/browser work | [playwright-interactive](playwright-interactive/), [frontend-design](frontend-design/) | The host supports the required tools; the bundled frontend-design body is a local variant, not certified latest upstream |
| Swarm/VXG adapters | The eight skills in the [swarm preset](#swarm-operations) | The project actually uses agent-swarm/swarmd/VXG; unrelated projects do not need this stack |
| Focused document improvement | [researchmaxer](researchmaxer/), [planmaxer](planmaxer/), [harmonymaxer](harmonymaxer/) | An explicit research/plan/doc integration task needs them; their older multi-pass/handoff defaults are not a requirement for every change |

### What recent usage supports

A local review of readable Codex and Claude Code histories on Linux and Mac
covered **October 12–November 11, 2026**, ending before this maintenance chat.
It found recurring invocation or explicit skill-read signals for **fleet-controller**,
**git-contractmaxxer**, **agent-browser**, **intent-to-handoff**, **fleet-accounts**
and **disk-janitor**. Research-hardening and Railway also appeared repeatedly;
proof, account and contract-stage helpers remain task-specific.

No explicit signal was found for featuremaxxer, layermaxxer, pipemaxxer,
master-workflow or design-consistency in that window. Codex-first appeared in one
Claude Code conversation. That supports changing the promoted default, but the
rewrite recommendations below are based on the instructions themselves too.
Planmaxer, harmonymaxer and researchmaxer had some observed use, so keep them as
optional document tools rather than calling them useless.

This is a conservative usage signal, not an execution-success audit: reading a
skill does not prove applying it successfully, and implicit use, variable-built
paths or unavailable/isolated history may be missed. Catalog listings and this
audit's own reads were excluded. Raw conversations, session IDs and private
machine details are not published.

### Legacy or rewrite candidates — avoid as new defaults

| Skill | Recommendation | Concrete reason / replacement |
| --- | --- | --- |
| [codex-first](codex-first/) | **Highest-priority rewrite or retirement** | Hard-codes Claude/Codex roles, model/effort assumptions and local launch conventions; even warns against `resume --last` while later showing it. Use fleet-controller with a qualified adapter and explicit session identity |
| [design-consistency](design-consistency/) | **Rewrite before general use** | Uses a universal under-1% pixel-difference pass threshold and claims no human review is needed. Keep pixel comparisons for controlled screenshot regression; use browser interaction, DOM/state checks and the project's actual design/accessibility review for wider acceptance |
| [featuremaxxer](featuremaxxer/) | **Legacy orchestration** | Five handoff files plus Beads and older blanket scope/push rules overlap Git Contractmaxxer. Prefer git-contractmaxxer for new delivery; it skips a separate TDD document, not testing itself |
| [layermaxxer](layermaxxer/) | **Legacy orchestration** | Builds a six-prompt strategy/Beads/execution chain and shared active/archive structure. Prefer product-board plus git-contractmaxxer for incremental outcomes; use contractmaxxer when formal units are required |
| [pipemaxxer](pipemaxxer/), [master-workflow](master-workflow/) | **Retain for existing 3-SOT projects** | Their fixed Spec → TDD → Strategy → Beads pipeline is the older architecture. Prefer git-contractmaxxer for new work, or contractmaxxer for an explicitly adopted proof-package workflow |
| [research-to-spec](research-to-spec/), [spec-to-tdd](spec-to-tdd/), [spec-to-strategy](spec-to-strategy/), [beads-from-sources](beads-from-sources/), [bead-plan-audit](bead-plan-audit/), [beads-to-execution](beads-to-execution/), [bead-completion-audit](bead-completion-audit/) | **Legacy pipeline components; reuse selectively** | Still useful for a repository that consumes those artifacts. Avoid generating the whole chain solely to fit the tools; they are not all individually obsolete |

I would retire or rewrite **codex-first first**, then **design-consistency**.
Keep the older pipeline files available for existing consumers, but stop promoting
featuremaxxer, layermaxxer and pipemaxxer as the easiest route for new work.

## Installation

```sh
git clone https://github.com/niksteel123/maxer-skills.git
cd maxer-skills
python3 scripts/install.py --preset everyday --target shared --dry-run
python3 scripts/install.py --preset everyday --target shared
# Claude Code: use --target claude instead of --target shared.
```

Requires Python 3.10+. The installer includes bundled dependencies, skips matching
copies, and refuses to overwrite differing installations without explicit
`--replace` (which keeps backups). Use `--all` for all bundled skills or
`--preset contract`, `--preset legacy`, `--preset swarm` for a narrower workflow.
External/proprietary skills and their CLIs are installed separately.

See [setup/update instructions](docs/SETUP.md), [dependency map](docs/DEPENDENCIES.md),
[project AGENTS.md starter](examples/AGENTS.md), and [source audit](docs/source-snapshot.json).
Do not copy private machine or global agent configuration into another project.

## Everyday GitHub delivery

| Skill | Purpose |
| --- | --- |
| [git-contractmaxxer](git-contractmaxxer/) | GitHub-native feature planning, delivery, steering and takeover from current state |
| [product-board](product-board/) | Maintain useful product milestones in the existing shared work plane |
| [fleet-controller](fleet-controller/) | Choose authorized models/providers/effort and size delegation to useful work |
| [fleet-accounts](fleet-accounts/) | CAAM account enrollment, qualification and session/account operations |
| [verify-ops](verify-ops/) | Operate adopted verification packages and evidence |
| [disk-janitor](disk-janitor/) | Inspect storage pressure and ownership before cleanup |

```text
/git-contractmaxxer Continue this feature from its current issue, PRs and proof.
/product-board Reconcile the next milestones against what actually works.
```

Repository policy and scoped user authorization govern every workflow. A helper's
stage chain, AUTO mode or install preset does not grant deployment, spend or
publication permission.

---

## The Contract-First Pipeline

A current specialist workflow for projects that adopt executable proof packages.
It is not a prerequisite for Git Contractmaxxer. Its central claim: **a unit is complete only on a truthful verification greenlight** — never on narrative, never on acceptance criteria, never on local tests alone. Proof obligations are written down and validated *before* any implementation exists, so there is nothing to negotiate afterwards.

```
RESEARCH DOC  ──hardening──▶  ideal source doc (canonical)
                                    │
                              EXECUTION CONTRACT     — units, scenarios, proof specs, crosswalk
                                    │
                              VERIFICATION PACKAGES  — authored + validated ALL-RED, pre-implementation
                                    │
                                  BEADS              — proof classes: contributes / turns-green / gate
                                    │
                                  AUDIT              — fresh-eyes, zero drift
                                    │
                            EXECUTION + GATE LOOP    — swarm runs until greenlight
```

| # | Skill | Stage | Done when |
|---|-------|-------|-----------|
| 1 | **[research-hardening](research-hardening/)** | Harden the research doc via stamped revision passes | 7-item readiness bar = READY |
| 2 | **[research-to-contract](research-to-contract/)** | Author the execution contract (units, topology, scenarios, proof specs) | Pass-2 fresh-eyes validation clean |
| 3 | **[contract-to-uvp](contract-to-uvp/)** | Transcribe the contract's package spec into real, validated verification packages | Instantiated at an all-red never-run baseline |
| 4 | **[contract-to-beads](contract-to-beads/)** | Execution beads with proof classes + assignment matrix | 100% two-sided proof coverage |
| 5 | **[contract-bead-audit](contract-bead-audit/)** | Fresh-session adversarial audit of the bead graph | Verdict READY |
| 6 | **[contract-to-execution](contract-to-execution/)** | Flat-swarm kickoff / push / sweep prompts + operating policy | Unit greenlight via the gate fix-loop |
| 7 | **[contract-next-unit](contract-next-unit/)** | Unit-boundary advance: close, graduate the next stub, re-prime prompts | Cursor advanced, next action named |

### Orchestrator

| Skill | Purpose |
|-------|---------|
| **[contractmaxxer](contractmaxxer/)** | Generates the entire numbered handoff chain for a feature, each prompt packed with researched context and scope gates. Composable — detects what exists and starts there. Modes `mini` / `normal` / `max` set unit granularity; **auto mode** orchestrates end-to-end execution with a fresh agent per stage. Supersedes `pipemaxxer` for contract-first work. |

### Laws binding every stage

1. Research records current canonical intent. Cite it without duplicating requirements; authorized steering or contrary evidence can revise it and reconcile affected artifacts.
2. A unit completes **only** on truthful greenlight.
3. *Blocked* is a valid truthful result. Mocks never substitute for missing prerequisites.
4. Amendments are classed and logged. Red→green without a code change trips an automatic audit.
5. Manual scenarios run on **real** subjects with real data.
6. Each normal stage has one primary artifact class. Substantial steering reconciles the affected artifact classes together.
7. **The Consumer Rule — a declaration is not a mechanism.** Every claim must have a proven consumer. The test is never *"is it declared?"* but *"what breaks if I delete it?"* A schema field no executor evaluates, a guarantee no code reads, a rule living only in prose — all the same defect, all producing confident, vacuous greens.

> **Note on stage 3.** `contract-to-uvp` and `uvp-goal` are written against a verification-package CLI internal to the repo they grew up in. Published here as **pattern references** — the discipline (author proof obligations first, prove the baseline is red, only then implement) ports anywhere; the exact commands do not. Substitute your own test-runner surface.

---

## The 3-SOT Pipeline (legacy)

Retained for existing consumers. For new projects, start with Git Contractmaxxer
or explicitly choose the contract-first workflow above. Individual stages remain
usable when their artifacts serve a real consumer.

```
Source of Truth #1 (SPEC)     — WHAT to build
Source of Truth #2 (TDD)      — HOW to verify it
Source of Truth #3 (STRATEGY) — WHAT ORDER to build it
         |
      BEADS                    — Self-contained execution units
         |
      AUDIT                    — Zero drift from spec
         |
      KICKOFF + PUSH           — Agent onboarding + continuation
         |
      COMPLETION AUDIT         — Codebase matches spec 100%
```

If it's in the spec, it ships. No downstream document gets to make scope cuts.

### Orchestrator

| Skill | Description |
|-------|-------------|
| **[pipemaxxer](pipemaxxer/)** | Generate the complete handoff chain for any feature/layer. Deep-researches codebase, produces feature-specific handoffs. Composable entry points. |
| **[master-workflow](master-workflow/)** | Reference guide for the 3-SOT pipeline. Decision tree for which skill to use when. |

### Stages

| Skill | Stage | Input | Output |
|-------|-------|-------|--------|
| **[research-to-spec](research-to-spec/)** | Batch 1 | Research doc | Spec + Architecture |
| **[spec-to-tdd](spec-to-tdd/)** | Batch 2 | Spec | TDD + Bootstrap |
| **[spec-to-strategy](spec-to-strategy/)** | Batch 3 | Spec + TDD | Lightweight strategy |
| **[beads-from-sources](beads-from-sources/)** | Batch 4 | All 3 SOTs | Self-contained beads |
| **[bead-plan-audit](bead-plan-audit/)** | Batch 5 | Beads + SOTs | Audited beads (zero drift) |
| **[beads-to-execution](beads-to-execution/)** | Batch 6 | SOTs + Beads | Kickoff + Push prompts |
| **[bead-completion-audit](bead-completion-audit/)** | Post-impl | SOTs + Codebase | Audit-fix-verify loop |

---

## Maxxer Family

| Skill | Purpose |
|-------|---------|
| **[featuremaxxer](featuremaxxer/)** | **Legacy:** five-handoff feature/Beads pipeline; skips a separate TDD document, not tests. |
| **[researchmaxer](researchmaxer/)** | Two-pass research/feature doc optimization. |
| **[planmaxer](planmaxer/)** | Iterative plan/architecture optimization. |
| **[layermaxxer](layermaxxer/)** | **Legacy:** layer decomposition through a strategy/Beads/handoff chain. |
| **[harmonymaxer](harmonymaxer/)** | Cross-document consistency integration. |

## Swarm Operations

The optional `swarm` preset also includes [agent-swarm-cli](agent-swarm-cli/),
[project-ops](project-ops/), [vcs-ops](vcs-ops/), [vxg-project-ops](vxg-project-ops/),
[vxg-testing](vxg-testing/), [swarm-design-ops](swarm-design-ops/),
[canvas-to-vxg](canvas-to-vxg/) and [swarm2-vxg-feature-shell](swarm2-vxg-feature-shell/).
They require compatible external services/runtimes; the skills do not ship those.

Skills for running long, multi-agent implementations without the run degrading underneath you.

| Skill | Purpose |
|-------|---------|
| **[fleet-controller](fleet-controller/)** | Current task-fit model/provider/effort routing and staffing. A bounded delegation needs a short decision, not a new fleet-plan document. |
| **[disk-janitor](disk-janitor/)** | Autonomous disk-pressure relief for long runs. Reclaims by a safety-ranked ladder (regenerable caches → dead-owner build artifacts → stale worktrees), never touching declared-protected state. Declare load-bearing paths **at creation** — that declaration is what lets cleanup run unattended. |
| **[codex-first](codex-first/)** | **Rewrite/retire candidate:** historical fixed Claude/Codex role policy; prefer fleet-controller. |
| **[uvp-goal](uvp-goal/)** | Author verification goals, realistic scenario tests, and evidence contracts from a feature idea. Pattern reference — see the stage-3 note above. |
| **[verify-authoring](verify-authoring/)** | Author verification packages from scratch: manifest schema, proof kinds, execution modes, bindings, checklist items. Pattern reference. |

## Utility

| Skill | Purpose |
|-------|---------|
| **[idea-to-research](idea-to-research/)** | Ideas into research documents. |
| **[codebase-to-spec](codebase-to-spec/)** | Reverse-engineer codebases into specs. |
| **[error-manifest](error-manifest/)** | QA error manifests for debugging handoff. |
| **[intent-to-handoff](intent-to-handoff/)** | Handoff prompts for fresh sessions. |
| **[skill-creator](skill-creator/)** | Create, modify, and benchmark skills. |

## Development & Design

| Skill | Purpose |
|-------|---------|
| **[design-consistency](design-consistency/)** | **Rewrite candidate:** controlled pixel-diff regression technique; its universal threshold is insufficient for general UI acceptance. |
| **[playwright-interactive](playwright-interactive/)** | Persistent browser and Electron interaction for fast iterative UI debugging. |
| **[frontend-design](frontend-design/)** | Distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. |

## Quick Start

```text
# Recommended default: continue from the actual current work
/git-contractmaxxer Continue this feature from its current issue, PRs and proof.

# Product planning in the existing work plane
/product-board Reconcile the next useful milestones.

# Specialist: project has adopted contract units and a verification runtime
/contractmaxxer path/to/research-doc.md

# Legacy: only for an existing 3-SOT workflow
/pipemaxxer path/to/research-doc.md
```

## License

Original contributions: [MIT](LICENSE). Third-party materials retain their own
licenses; see [THIRD_PARTY.md](THIRD_PARTY.md). Proprietary optional skills are linked
in the dependency guide and are not bundled.
