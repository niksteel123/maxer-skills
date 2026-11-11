# Start a new project with a small skill set

Start with the core pack below: **five bundled skills plus one separately
installed external skill**. The `starter` preset installs those five bundled
skills, including required bundled dependencies. It is also the installer's
default selection; `everyday` is an alias for the same selection.

| Install | Purpose |
| --- | --- |
| `git-contractmaxxer` | Plan, deliver or take over work using current issues, PRs and evidence |
| `product-board` | Organize useful product outcomes in the existing shared work plane |
| `fleet-controller` | Choose an authorized, available model/adapter when delegation is useful |
| `intent-to-handoff` | Preserve context when a real handoff is needed |
| `disk-janitor` | Inspect disk pressure and ownership before cleanup |
| `just-say-no-to-process-porn-and-ceremony` (external) | Keep work focused on useful outcomes and honest evidence |

The preset has no legacy orchestrators, fixed provider-role policy, account
manager, UVP/Beads pipeline, Swarm/VXG adapters or technology-specific stack.
Installing the bundled skills does not require those services. Delegation itself
is optional; fleet-controller applies when you actually delegate.

## Install for the harness you use

From a reviewed Maxer Skills checkout, preview before writing:

```sh
# Codex: user-wide shared discovery root
python3 scripts/install.py --preset starter --target shared --dry-run
python3 scripts/install.py --preset starter --target shared

# Claude Code: its user-wide skill root, if you use it too
python3 scripts/install.py --preset starter --target claude --dry-run
python3 scripts/install.py --preset starter --target claude
```

For an isolated project install, use an absolute destination instead of `--target`:

```sh
python3 scripts/install.py --preset starter --dest /path/to/your-project/.agents/skills --dry-run
python3 scripts/install.py --preset starter --dest /path/to/your-project/.agents/skills
# Claude Code alternative destination: /path/to/your-project/.claude/skills
```

Choose user-wide OR project-scoped copies for a skill, rather than maintaining
unreviewed duplicates. Keep a personal project install out of Git using local
excludes. If the team chooses to vendor skills, review that separately, pin their
source revision and preserve applicable licenses/notices. Installing user-wide
skills on your workstation does not install them for teammates or CI.

## Complete the external core step

Install **just-say-no-to-process-porn-and-ceremony** through your authorized
[Jeffrey's Skills account](https://jeffreys-skills.md), following the current
upstream instructions for the harness and scope you use. Its [terms](https://jeffreys-skills.md/terms)
prohibit public redistribution, so its content is not copied into this repository
and this installer does not download it or handle subscriber credentials.

The installer reports this core companion separately and checks only whether a
SKILL.md exists at the selected destination. A successful installer exit confirms
the bundled installation, not a complete upstream install or working core setup.
If upstream installs elsewhere, verify that the intended harness discovers it;
local presence alone does not verify provenance, version or successful use.
If you lack access, the five bundled skills remain usable; record the companion
as unavailable rather than claiming the entire core pack is installed.

## Add project instructions

Use [examples/AGENTS.md](../examples/AGENTS.md) as a starting point, then replace
placeholders with the real product, canonical docs, commands and ownership rules.
For a cross-harness setup, [examples/CLAUDE.md](../examples/CLAUDE.md) imports that
shared file. Keep personal machine details in the local files described in the
[integration guide](INTEGRATION.md#shared-policy-and-private-machine-notes).

A small project does not need a new issue hierarchy, model registry, fleet plan,
contract-unit tree or proof runtime just to adopt these skills. Start with the
project's existing tools and add structure when a concrete consumer needs it.

## Add only what the project now needs

| Situation | Optional addition |
| --- | --- |
| Investigating a poorly specified proposal | `research-hardening`; add `idea-to-research` or `codebase-to-spec` for those specific deliverables |
| Preparing a debugging handoff | `error-manifest` |
| Real CAAM account/qualification work | `fleet-accounts` |
| An adopted executable-proof workflow | `--preset contract`, with a compatible verified runtime |
| Existing agent-swarm/swarmd/VXG project | `--preset swarm` |
| Browser UI work | The available host browser skill or upstream `agent-browser`; `playwright-interactive` where supported |
| React, Clerk, Railway or Google Workspace work | The relevant [upstream skills](DEPENDENCIES.md#everyday-external-skills-install-from-the-owner) |
| Comparing delivered behavior with product intent | Optional reality-check-for-project from the authorized upstream; no-process-porn/ceremony is already part of the core recommendation |

For one bundled addition:

```sh
python3 scripts/install.py --skill error-manifest --target shared --dry-run
python3 scripts/install.py --skill error-manifest --target shared
```

Avoid `--all` and `--preset legacy` for a fresh project. `--all` deliberately
preserves the full collection, including historical and specialist material.
