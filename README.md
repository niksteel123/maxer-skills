# Maxer Skills

Agent skills for the **3-SOT (3 Source of Truth) implementation pipeline** — a rigorous, spec-driven workflow that eliminates spec drift from research to production-audited code.

Works with [Claude Code](https://code.claude.com) and [Codex](https://developers.openai.com/codex).

## Installation

### Claude Code
```bash
git clone https://github.com/niksteel123/maxer-skills.git /tmp/maxer-skills-install
cp -r /tmp/maxer-skills-install/*/ ~/.claude/skills/
rm -rf /tmp/maxer-skills-install
```

### Codex
```bash
git clone https://github.com/niksteel123/maxer-skills.git /tmp/maxer-skills-install
cp -r /tmp/maxer-skills-install/*/ ~/.agents/skills/
rm -rf /tmp/maxer-skills-install
```

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

## Skills

### Pipeline Orchestrator

| Skill | Description |
|-------|-------------|
| **[pipemaxxer](pipemaxxer/)** | Generate the complete handoff chain for any feature/layer. Deep-researches codebase, produces feature-specific handoffs. Composable entry points. |
| **[master-workflow](master-workflow/)** | Reference guide for the 3-SOT pipeline. Decision tree for which skill to use when. |

### Pipeline Stages

| Skill | Stage | Input | Output |
|-------|-------|-------|--------|
| **[research-to-spec](research-to-spec/)** | Batch 1 | Research doc | Spec + Architecture |
| **[spec-to-tdd](spec-to-tdd/)** | Batch 2 | Spec | TDD + Bootstrap |
| **[spec-to-strategy](spec-to-strategy/)** | Batch 3 | Spec + TDD | Lightweight strategy |
| **[beads-from-sources](beads-from-sources/)** | Batch 4 | All 3 SOTs | Self-contained beads |
| **[bead-plan-audit](bead-plan-audit/)** | Batch 5 | Beads + SOTs | Audited beads (zero drift) |
| **[beads-to-execution](beads-to-execution/)** | Batch 6 | SOTs + Beads | Kickoff + Push prompts |
| **[bead-completion-audit](bead-completion-audit/)** | Post-impl | SOTs + Codebase | Audit-fix-verify loop |

### Maxxer Family

| Skill | Purpose |
|-------|---------|
| **[featuremaxxer](featuremaxxer/)** | Fast-track pipeline (skips TDD). For quick features. |
| **[researchmaxer](researchmaxer/)** | Two-pass research/feature doc optimization. |
| **[planmaxer](planmaxer/)** | Iterative plan/architecture optimization. |
| **[layermaxxer](layermaxxer/)** | Decompose monoliths into shippable layers. |
| **[harmonymaxer](harmonymaxer/)** | Cross-document consistency integration. |

### Utility

| Skill | Purpose |
|-------|---------|
| **[idea-to-research](idea-to-research/)** | Ideas into research documents. |
| **[codebase-to-spec](codebase-to-spec/)** | Reverse-engineer codebases into specs. |
| **[error-manifest](error-manifest/)** | QA error manifests for debugging handoff. |
| **[intent-to-handoff](intent-to-handoff/)** | Handoff prompts for fresh sessions. |
| **[reset-workspace](reset-workspace/)** | Wipe beads, reset for fresh implementation. |
| **[skill-creator](skill-creator/)** | Create, modify, and benchmark skills. |

## Quick Start

```bash
# Full pipeline from research doc
/pipemaxxer path/to/research-doc.md

# Layer implementation (spec exists)
/pipemaxxer path/to/layer-spec.md

# Quick feature (no TDD)
/featuremaxxer path/to/feature-doc.md

# Optimize research doc
/researchmaxer path/to/research.md
```

## License

MIT
