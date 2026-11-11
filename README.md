# Maxer Skills

Agent skills for rigorous, spec-driven implementation pipelines — workflows that carry a feature from raw idea to production-audited code without spec drift.

Three workflow entry points ship here:

- **Git Contractmaxxer (everyday delivery)** — plan, implement, review or take over
  feature work through existing GitHub issues and PRs, without restarting a stage chain.
- **Contract-First** — adopt explicit contracts, verification packages and unit gates
  where the project needs them.
- **3-SOT (original)** — Spec / TDD / Strategy feeding execution units.

47 bundled skills, refreshed against the owner's installed sources on **2026-11-11**.
Everyday third-party helpers, including **no process porn/ceremony**, are catalogued
with upstream links in [dependencies](docs/DEPENDENCIES.md), subject to their licenses.

Works with [Claude Code](https://code.claude.com) and [Codex](https://developers.openai.com/codex).

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

The newer pipeline. Its central claim: **a unit is complete only on a truthful verification greenlight** — never on narrative, never on acceptance criteria, never on local tests alone. Proof obligations are written down and validated *before* any implementation exists, so there is nothing to negotiate afterwards.

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

1. The research doc is canonical. Downstream artifacts **cite** it, never restate it. Conflicts resolve upward: code → package → contract → research.
2. A unit completes **only** on truthful greenlight.
3. *Blocked* is a valid truthful result. Mocks never substitute for missing prerequisites.
4. Amendments are classed and logged. Red→green without a code change trips an automatic audit.
5. Manual scenarios run on **real** subjects with real data.
6. Each stage writes exactly **one** artifact class.
7. **The Consumer Rule — a declaration is not a mechanism.** Every claim must have a proven consumer. The test is never *"is it declared?"* but *"what breaks if I delete it?"* A schema field no executor evaluates, a guarantee no code reads, a rule living only in prose — all the same defect, all producing confident, vacuous greens.

> **Note on stage 3.** `contract-to-uvp` and `uvp-goal` are written against a verification-package CLI internal to the repo they grew up in. Published here as **pattern references** — the discipline (author proof obligations first, prove the baseline is red, only then implement) ports anywhere; the exact commands do not. Substitute your own test-runner surface.

---

## The 3-SOT Pipeline

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
| **[featuremaxxer](featuremaxxer/)** | Fast-track pipeline (skips TDD). For quick features. |
| **[researchmaxer](researchmaxer/)** | Two-pass research/feature doc optimization. |
| **[planmaxer](planmaxer/)** | Iterative plan/architecture optimization. |
| **[layermaxxer](layermaxxer/)** | Decompose monoliths into shippable layers. |
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
| **[fleet-controller](fleet-controller/)** | Keep a swarm optimally sized via a *living* fleet plan — predict per-step agent counts from the work DAG, then correct against live reality on a cadence and on events. Read before spawning lanes. |
| **[disk-janitor](disk-janitor/)** | Autonomous disk-pressure relief for long runs. Reclaims by a safety-ranked ladder (regenerable caches → dead-owner build artifacts → stale worktrees), never touching declared-protected state. Declare load-bearing paths **at creation** — that declaration is what lets cleanup run unattended. |
| **[codex-first](codex-first/)** | Route implementation work to Codex CLI; Claude specs, reviews, verifies. |
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
| **[design-consistency](design-consistency/)** | Verify visual consistency between a reference design and implementation. Fully autonomous pixel-diff pass/fail. |
| **[playwright-interactive](playwright-interactive/)** | Persistent browser and Electron interaction for fast iterative UI debugging. |
| **[frontend-design](frontend-design/)** | Distinctive, production-grade frontend interfaces that avoid generic AI aesthetics. |

## Quick Start

```bash
# Contract-first pipeline from a research doc (recommended)
/contractmaxxer path/to/research-doc.md

# 3-SOT pipeline from a research doc
/pipemaxxer path/to/research-doc.md

# Quick feature (no TDD)
/featuremaxxer path/to/feature-doc.md

# Optimize a research doc before either pipeline
/researchmaxer path/to/research.md
```

## License

Original contributions: [MIT](LICENSE). Third-party materials retain their own
licenses; see [THIRD_PARTY.md](THIRD_PARTY.md). Proprietary optional skills are linked
in the dependency guide and are not bundled.
