# Dependencies and everyday helpers

`skills.json` is the install inventory. `requires` lists bundled installation
companions, not universal runtime/start blockers. Presets expand those companions;
external skills remain opt-in. Load only the skills needed for the current task.

See the [complete installed-skill coverage](INSTALLED-INVENTORY.md) for the audit inventory, including specialist skills not bundled here.

## Bundled workflows

| Work | Entry point | Companions and runtime |
| --- | --- | --- |
| GitHub feature delivery/takeover | git-contractmaxxer | fleet-controller, product-board; research and proof adapters as used; authenticated GitHub CLI/MCP and Git |
| Related product milestones | product-board | Existing GitHub board or repository document; preserve the current tracker |
| Model/account/machine placement | fleet-controller | Repository's authorized pool/registry when adopted; available qualified launch adapter; fleet-accounts for CAAM work |
| Account/session operations | fleet-accounts | CAAM and the relevant Claude/Codex CLI; private qualifications/configuration, not included here |
| Contract-first pipeline | contractmaxxer | The seven contract stages, verify-authoring/verify-ops, fleet-controller, disk-janitor; Beads/Agent Mail and UVP only as adopted by the project |
| Original spec/TDD/strategy pipeline | pipemaxxer | The bundled 3-SOT stages; br/bv and Agent Mail for its swarm adapters |
| Verification packages | verify-authoring, verify-ops, uvp-goal | A real compatible UVP/verify runtime; some examples target agent-swarm/swarmd or a standalone Kit not shipped here |
| Disk hygiene | disk-janitor | OS inspection tools and explicit ownership/protection facts; installation grants no deletion permission |
| Design/VXG/Swarm operations | agent-swarm-cli, project-ops, vcs-ops, vxg-project-ops, vxg-testing, swarm-design-ops, canvas-to-vxg, swarm2-vxg-feature-shell | Compatible agent-swarm CLI/swarmd/MCP, authorized project and preview/browser runtime; these are specialist adapters, not a generic required stack |
| Browser/editor UI work | playwright-interactive | The host's supported persistent JavaScript/browser environment; inspect the actual tool surface |
| Creating and evaluating skills | skill-creator | Python; PyYAML for its bundled validator; the harness/CLI expected by the chosen evaluation scripts |

`uvp-fleet` and its private model registry/qualification files are not bundled.
Fleet policy can guide a bounded native delegation without installing that
executable dispatcher. Do not invent an available adapter or bypass project rules.
Inspect the actual installed CLI help before copying a command from a skill.

## Optional everyday skills: install from the owner

These are useful parts of the working environment, not files redistributed by
this repository. Follow the upstream's current install instructions and terms.
Do not install every technology skill just because it appears here.

| Skill / collection | Use | Source |
| --- | --- | --- |
| just-say-no-to-process-porn-and-ceremony | Inspect busywork, ceremony and evidence honesty | [Jeffrey's Skills](https://jeffreys-skills.md) |
| reality-check-for-project | Compare delivered capability with current authorized intent | [Jeffrey's Skills](https://jeffreys-skills.md) |
| idea-wizard | Generate and assess useful next improvements | [Jeffrey's Skills](https://jeffreys-skills.md) |
| ntm, vibing-with-ntm | Manage and tend tmux agent swarms | [Jeffrey's Skills](https://jeffreys-skills.md) |
| mcp-server-design | Design agent-facing MCP tools | [Jeffrey's Skills](https://jeffreys-skills.md) |
| beads-workflow | Plan-to-Beads workflow | [Upstream skill](https://github.com/Dicklesworthstone/agent_flywheel_clawdbot_skills_and_integrations/tree/main/skills/beads-workflow) |
| agent-browser | Browser automation | [Vercel Labs](https://github.com/vercel-labs/agent-browser) |
| use-railway | Railway infrastructure operations | [Railway skills](https://github.com/railwayapp/railway-skills) |
| Google Workspace helpers | Gmail, Calendar, Drive, Docs, Sheets and related workflows | [Google Workspace CLI](https://github.com/googleworkspace/cli) |
| Clerk skills | Framework-specific authentication and account operations | [Clerk](https://github.com/clerk/skills) |
| React best practices, composition patterns, web design guidelines | React engineering and interface review | [Vercel agent skills](https://github.com/vercel-labs/agent-skills) |

Jeffrey's installed subscriber bundles are proprietary. The [terms](https://jeffreys-skills.md/terms)
permit personal/professional use and prohibit redistribution outside the service.
Keep their content, subscriber manifests and account watermarks out of public Git.
Only public names and source links are catalogued here. An installed local copy
may have owner-specific amendments; upstream installation does not promise those.

The NTM skill and `ntm` executable are separate dependencies. Likewise a browser
skill does not install a browser CLI, and a Railway/Clerk skill does not authenticate
an account. Some older skills use a particular repository's commands; substitute
only a real qualified adapter, and label unverified integrations honestly.
