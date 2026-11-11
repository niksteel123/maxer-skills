---
name: agent-swarm-cli
description: General operations playbook for the agent-swarm CLI. Use when invoking, debugging, or choosing commands and auth modes for project, device, session, VXG, SwarmCanvas/design validation, preview, implementation handoff, testing, mesh, or other gateway-backed CLI workflows. For SwarmCanvas creation/editing, prefer Agent Swarm MCP tools and load swarm-design-ops; use CLI as validation/control fallback.
---

# Agent Swarm CLI

Use this skill when the task should be executed or diagnosed through the `agent-swarm` CLI.

## Core Truth Model

- `agent-swarm` is the canonical operator CLI for Swarmnet.
- Gateway-backed commands use the same `swarmd` bridge/runtime path as the UI; the CLI does not have its own separate datastore.
- For SwarmCanvas authoring/editing, MCP is the preferred agent interface when available. CLI is still the right control surface for release builds, fallback calls, export, validate/lint/layout/style inventory, and reproducing operator commands.
- Default gateway is `tcp://127.0.0.1:9847`.
- When working from a local checkout, refresh the CLI with `cargo build --release -p swarm-cli` and invoke `./target/release/agent-swarm ...` so the runtime behavior matches the repo sources.
- Global auth mode is explicit:
  - `--auth-mode auto`
  - `--auth-mode owner-local`
  - `--auth-mode paired-device`

## Critical Auth + Role Rules

- Local owner-local CLI auth works only against `swarmd --role validator`.
- If the CLI targets local `swarmd --role core`, owner-local bootstrap is rejected with `owner_local_unavailable`. That is expected.
- For remote or non-T0 usage, use `--auth-mode paired-device`.
- If the operator sees "permission denied" on an admin action, run `agent-swarm session whoami --format json` and check:
  - auth source
  - permissions
  - daemon role

## Mandatory Preflight

Before diagnosing CLI behavior, report:

- `git rev-parse --short HEAD`
- `agent-swarm --version`
- running `swarmd` pid and full command
- gateway endpoint
- daemon role
- auth mode in use
- data dir path if relevant
- `agent-swarm vm doctor --format json` when native Apple VM behavior is involved
- `agent-swarm package list --format json` when agent package resolution is involved

If those are unknown, do not claim root cause yet.

## Recommended Deterministic Setups

### Normal local operator workflow

```bash
cargo run --bin swarmd -- --role validator --data-dir "$PWD/.tmp/swarmd-data"
./target/release/agent-swarm --gateway tcp://127.0.0.1:9847 --auth-mode auto session whoami --format json
```

### Deliberate auth-negative check

```bash
cargo run --bin swarmd -- --role core --data-dir "$PWD/.tmp/swarmd-data"
./target/release/agent-swarm --gateway tcp://127.0.0.1:9847 --auth-mode owner-local session whoami --format json
```

Expect owner-local bootstrap to be unavailable in the second case.

## High-Value Commands

### Auth / device / session

```bash
agent-swarm session whoami --format json
agent-swarm device list --json
agent-swarm device pair issue --name "Remote Desktop" --type desktop --json
agent-swarm device pair redeem --code XXXX-XXXX-XXXX-XXXX --json
agent-swarm device revoke <DEVICE_ID> --json
```

### Project

```bash
agent-swarm project list
agent-swarm project get <PROJECT_ID>
agent-swarm project create --name "My Project"
agent-swarm project rename <PROJECT_ID> --name "New Name"
agent-swarm project delete <PROJECT_ID>
```

### Agent Packages

Agent sessions are package-driven. Do not hardcode Overseer or Codex behavior in commands. The package descriptor chooses role material, tool bundles, runtime preference, and ACP wrapper metadata.

```bash
agent-swarm package list --format json
agent-swarm package get swarmnet.overseer.v1 --format json
agent-swarm package get swarmnet.worker.codex.v1 --format json
```

Current important packages:

- `swarmnet.overseer.v1` is the default high-capability overseer package.
- `swarmnet.worker.codex.v1` is the Codex ACP worker package. It uses ACP with `codex-acp` as the wrapper binary.

### Spawn Agents

Use `agent-swarm spawn agent` as the normal happy path. It goes through the production session orchestrator, package registry, sandbox/provider path, PTY/ACP capture, and Session Prompt Control. Do **not** use low-level `session create` unless you are specifically testing gateway/session internals.

Fresh sandbox, default package selection:

```bash
agent-swarm spawn agent \
  --task "Summarize the repo status and wait for follow-up." \
  --format json
```

Fresh Apple VM with Codex ACP:

```bash
agent-swarm spawn agent \
  --package swarmnet.worker.codex.v1 \
  --environment local_sandbox \
  --provider apple_vm \
  --sandbox-scope fresh \
  --task "Use the real runtime and answer: what is the capital of Australia?" \
  --format json
```

Same-VM child process from the host CLI:

```bash
agent-swarm spawn agent \
  --package swarmnet.worker.codex.v1 \
  --sandbox-scope current \
  --parent-session <PARENT_SESSION_ID> \
  --task "Run in the parent session's VM as a separate process slot." \
  --format json
```

Rules:

- `--sandbox-scope fresh` is the default. It requests a new sandbox lease, usually from the warm pool when available.
- `--sandbox-scope current` starts a separate process/PTY/ACP runtime in the parent session's sandbox. It must keep a distinct `session_id`, process slot, PTY handle, session token, and ACP runtime/session id.
- From the host CLI, `--sandbox-scope current` requires `--parent-session`.
- The `--provider` flag is a sandbox provider hint such as `apple_vm`; it is not the LLM/provider selector. Select agent behavior through `--package`.
- For Codex-in-Apple-VM proof, prefer `--package swarmnet.worker.codex.v1 --provider apple_vm`.

### Prompt, Queue, Steer, and Inspect Sessions

After spawn, capture the returned `session_id` and use session commands for all follow-up and proof.

```bash
agent-swarm session active --format json
agent-swarm session get <SESSION_ID> --format json
agent-swarm session health <SESSION_ID> --format json
agent-swarm session diagnose <SESSION_ID> --format json
agent-swarm session stdout <SESSION_ID> --follow
agent-swarm session stream <SESSION_ID> --format json
agent-swarm session export <SESSION_ID> --output evidence/session-export.json --format json
```

Session Prompt Control modes:

```bash
agent-swarm session prompt create <SESSION_ID> \
  --mode steer_now \
  --text "Answer this immediately in the current session." \
  --idempotency-key "steer-$(date +%s)" \
  --format json

agent-swarm session prompt create <SESSION_ID> \
  --mode queue_after_idle \
  --text "Run this after the active turn is idle." \
  --idempotency-key "queue-$(date +%s)" \
  --format json
```

End sessions explicitly when the work is finished:

```bash
agent-swarm session end <SESSION_ID> --format json
```

### Native Apple VM Readiness and Diagnostics

Native macOS VM execution is owned by the SwarmNet node. Agents should not hand-manage VM lifecycle when spawning; they should use `spawn agent` and let the node/hypervisor path do the work.

Use these checks before blaming agent/package logic:

```bash
agent-swarm doctor --sandbox --format json
agent-swarm vm doctor --format json
agent-swarm sandbox apple-vm doctor --format json
agent-swarm pool status --format json
agent-swarm sandbox list --format json
```

Apple VM readiness requires:

- Apple Silicon/macOS host with Apple's Virtualization framework available.
- Signed SwarmNet helper/menu-bar sidecar with the virtualization entitlement.
- A local macOS restore image or prepared VM bundle.
- `swarmnet-guest-rpcd` provisioned in the guest.
- Required tool binaries in the guest, for example `agent-swarm`, `codex`, and `codex-acp` for the Codex ACP package.

Prepare/provision commands:

```bash
agent-swarm vm prepare \
  --restore-image-path /path/to/macos.ipsw \
  --bundle-path /path/to/SwarmNet.bundle \
  --install-macos \
  --guest-daemon-path /path/to/swarmnet-guest-rpcd \
  --privileged-provisioner-path /path/to/provisioner \
  --format json

agent-swarm vm provision-guest-bridge \
  --bundle-path /path/to/SwarmNet.bundle \
  --guest-daemon-path /path/to/swarmnet-guest-rpcd \
  --tool-binary /host/codex-acp=/usr/local/bin/codex-acp \
  --format json
```

Current status notes:

- The real Apple VM path fail-closes; do not accept a host-local fallback as production VM proof.
- `vm doctor` and `sandbox apple-vm doctor` are mirrors for native Apple VM readiness.
- `pool status` currently reports the warm-pool surface; do not assume true hot reuse unless evidence says a lease was warm.
- For proof of real runtime, look for PTY stdin/stdout, ACP runtime frames, tool calls, session export, and Apple VM lifecycle evidence. Heartbeats alone are not proof that a Codex agent answered.

### Design / SwarmCanvas

For design creation and editing, load `swarm-design-ops` and prefer MCP tools:

```text
design_write_html
design_list_primitives / design_instantiate_primitive
design_batch
```

Use CLI as fallback and for validation/control:

```bash
agent-swarm design list --project <PROJECT_ID> --format json
agent-swarm design list-primitives --project <PROJECT_ID> --format json
agent-swarm design instantiate-primitive --project <PROJECT_ID> --primitive swarm2.plan-package-canvas.v1 --name "Plan Package Canvas" --brief "..."
agent-swarm design write-html --project <PROJECT_ID> --name "Fresh Board" --html-file fragment.html --format json
agent-swarm design batch --project <PROJECT_ID> --design <DESIGN_ID> --expected-version <V> --base <CAS_REF> --operations-file edits.json --format json
agent-swarm design export --project <PROJECT_ID> --design <DESIGN_ID> --output /tmp/design.pen --format json
agent-swarm design validate --file /tmp/design.pen --format json
agent-swarm design lint --file /tmp/design.pen --profile paper-parity --format json
agent-swarm design snapshot-layout --file /tmp/design.pen --problems-only --format json
agent-swarm design style-inventory --file /tmp/design.pen --format json
agent-swarm design screenshot --project <PROJECT_ID> --design <DESIGN_ID> --scale 1 --image-format png --format json
```

`design.batch` operations are structured JSON objects, not strings. If MCP tool discovery shows `design_batch.operations: string[]`, refresh the MCP server/schema before using it for authoring.

### VXG Graph Operations

```bash
agent-swarm vxg create --name "My Graph" [--description <DESC>] [--vxg <VXG_ID>]
agent-swarm vxg list [--limit <N>]
agent-swarm vxg show [<VXG_ID>]
agent-swarm vxg use <VXG_ID>
agent-swarm vxg delete <VXG_ID>
```

### VXG Node / Edge / Binding / Action / Ref CRUD

```bash
agent-swarm vxg node add|update|delete|list|get
agent-swarm vxg edge add|update|delete|list
agent-swarm vxg binding add|connect|list|update|delete
agent-swarm vxg action add|list|delete
agent-swarm vxg ref add|list|delete
```

Direct prototype-binding examples:

```bash
agent-swarm vxg node add --type component --name "My Card" --key my-card --component-ref "/preview/?component=MyCard" --component-entry MyCard
agent-swarm vxg node update --key my-card --component-ref "/preview/?component=MyCard&theme=dark"
agent-swarm vxg node update --key my-card --implementation-ref app://cards/my-card
```

### VXG Query / Analysis / Shell / Work

```bash
agent-swarm vxg query '<DSL>'
agent-swarm vxg analyze
agent-swarm vxg validate [--conventions <CAS_REF>]
agent-swarm vxg layout [--mode <MODE>] [--direction <LR|TB|BT|RL>] [--snap-to-grid <N>]
agent-swarm vxg export [--format <json|mermaid>] [--include <CSV>]
agent-swarm vxg resolve target [--node <ID>] [--shell <ID>] [--page <ID>] [--viewing <MODE>] [--layout <MODE_ID>] [--style <MODE_ID>] [--target <shell|page|component>]
agent-swarm vxg shell show|mode|page|layout|style
agent-swarm vxg link-work --node <NODE_REF> --work-unit <WORK_UNIT_ID>
agent-swarm vxg generate-work [--node-types <CSV>] [--dry-run]
agent-swarm vxg sync-completeness
agent-swarm vxg apply-patch --file <PATCH_JSON>
```

### VXG Dev / Preview Sessions

```bash
agent-swarm vxg dev start|show|list|state|url|logs|inspect|watch|capture|stop
agent-swarm vxg preview [flags]
agent-swarm vxg preview --stop
```

Most common rendered-preview handoff:

```bash
agent-swarm vxg dev start ...
agent-swarm vxg dev url --session <SESSION_ID>
```

Take the returned `agent_url` and, if you need browser-rendered proof, open it with `agent-browser` on the same base origin.

### VXG Testing

```bash
agent-swarm vxg test manifest add|list|show|compile
agent-swarm vxg test suite list|show|repair-orphan
agent-swarm vxg test run|status|report|greenlight
```

Note: `vxg test *` is a **compatibility wrapper** during the UVP migration. For authored verification packages (including VXG's), prefer the shared `verify *` surface below — see the `verify-ops` skill.

### Verify (Unified Verification Packages)

Shared verify surface for authored proof packages. 25 MCP tools under `MethodGroup::Verify`; CLI mirrors them under `agent-swarm verify …`.

```bash
# Package lifecycle (workspace-relative refs only; absolute paths rejected)
agent-swarm verify package validate test-packages/<slug>
agent-swarm verify package publish test-packages/<slug> --target oci://registry.example.com/verify
agent-swarm verify package pull oci://registry.example.com/verify/<slug>@sha256:...

# Runtime
agent-swarm verify instantiate test-packages/<slug>
agent-swarm verify list
agent-swarm verify get <instance-id>
agent-swarm verify run --instance-id <id> [--no-wait]
agent-swarm verify run status <run-id>
agent-swarm verify report <instance-id>
agent-swarm verify greenlight --instance-id <id>

# Checklist (manual verdicts grouped into passes)
agent-swarm verify checklist list --instance-id <id> [--suite-id <id>] [--status <filter>]
agent-swarm verify checklist pass start --suite-id <id>
agent-swarm verify checklist verdict set --suite-id <id> --item-id <id> --verdict pass|fail|skip [--pass-id <id>] [--reasoning <text>]
agent-swarm verify checklist verdict reset --suite-id <id> --item-id <id> [--reason <text>]
agent-swarm verify checklist pass finish --suite-id <id> --pass-id <id> [--summary <text>]

# Catalog, schedules, templates
agent-swarm verify catalog search [--query <q>] [--limit <n>]
agent-swarm verify catalog get <catalog-id>
agent-swarm verify schedule create <id> --trigger interval|drift [--interval-minutes <n>] [--package-ref <ref>] ...
agent-swarm verify schedule list|pause|resume|run-now
agent-swarm verify template list
agent-swarm verify template create --template-id <id> [--output <rel>]
agent-swarm verify template validate <template-ref>
```

Full reference: the `verify-ops` skill. Canonical one-liners:

```bash
agent-swarm verify run --package-ref test-packages/<slug> --format json        # instantiate + run
agent-swarm verify greenlight --instance-id <id> --format json                 # pass/fail rollup
```

### VCS (Shared Version Control)

Shared CAS/VCS operations across workspace/zone/vxg/design/project scopes. 30 MCP tools under `MethodGroup::Vcs`; CLI under `agent-swarm vcs …`. `--scope` is always required.

> **Feature flag**: Most `vcs.*` methods require swarmd launched with `SWARMNET_VCS_SHARED_CORE=1`. `vcs status` works without the flag and reports `health.shared_core_enabled: false` with `health.state: "disabled"` when the shared core is still off.

```bash
# Inspection
agent-swarm vcs status --scope <domain>/<id>                 # always works; includes health + built-in ref counts
agent-swarm vcs log --scope <s> [--limit <n>] [--cursor <c>]
agent-swarm vcs show --scope <s> <--version | --ref>
agent-swarm vcs diff --scope <s> --from <v|ref> --to <v|ref>
agent-swarm vcs namespace --scope <s>                         # full RefNamespaceView
agent-swarm vcs events --scope <s> [--cursor <c>]
agent-swarm vcs operation log --scope <s> [--limit <n>]

# Tier 2 save points
agent-swarm vcs commit --scope <s> --message "..."            # does NOT create a ref

# Refs
agent-swarm vcs ref list|show|log|promote --scope <s> ...

# Checkpoints / tags (immovable) and branches (movable)
agent-swarm vcs checkpoint create|list|delete|restore --scope <s> ...
agent-swarm vcs tag create|list|delete --scope <s> ...
agent-swarm vcs branch create|list|move|delete|publish --scope <s> ...

# Rewinds & merges
agent-swarm vcs rollback --scope <s> --version <v>            # creates a Rollback commit
agent-swarm vcs restore --scope <s> --ref <name>              # resolve + rollback
agent-swarm vcs merge preview --scope <s> --ours <n> --theirs <n>
agent-swarm vcs merge --scope <s> --ours <n> --theirs <n>

# Session + admin
agent-swarm vcs checkout --scope <s> <--version | --ref> [--detached]
agent-swarm vcs backfill --scope <s>                          # rebuild catalog from domain truth
agent-swarm vcs export --scope <s> --output <dir>             # Git-shaped read-only compat tree
```

Scope patterns: `workspace/<id>`, `zone/<id>`, `vxg/<id>`, `design/<id>`, `project/<id>`.

Full reference: the `vcs-ops` skill.

### Mesh / diagnostics

```bash
agent-swarm mesh status
agent-swarm doctor
agent-swarm doctor --sandbox --format json
agent-swarm vm doctor --format json
agent-swarm pool status --format json
```

## Global VXG Flags

These are defined on the top-level `vxg` command and apply across subcommands:

```text
--vxg <VXG_ID>   Override the active VXG context instead of using `agent-swarm vxg use`
--agent <AGENT>  Override the agent id for dev/test flows
```

Use `--vxg` when you need an explicit one-shot target in scripts. Use `vxg use` when you want the CLI context file updated.

## VXG Workflow Choice

- Use `vxg-project-ops` when the task is graph authoring, preview routing, or binding `implementation_ref`.
- Use `swarm-design-ops` when the task touches SwarmCanvas, `.pen`, `design_ref`, Paper/Pencil comparison, or Design Canvas authoring. Prefer MCP create/edit tools over CLI for this surface.
- Use `vxg-testing` for VXG-local preview/browser-runtime concerns — but route checklist/verdict/greenlight/runs/catalog/schedule/template work to **`verify-ops`** (the shared UVP surface).
- Use `vcs-ops` for VXG (or any scope) **history, branches, tags, checkpoints, rollback/restore, merges**. Scope format: `vxg/<vxg_id>`. Legacy `vxg.history` / `vxg_checkpoint_*` calls remain only as compatibility wrappers.
- Use `agent-browser` after `vxg dev start` / `vxg dev url` when you need true browser interaction or screenshot proof against `agent_url`.
- Use the real app route plus `agent-browser` for full production browser validation; use VXG-native implementation suites for graph-owned handoff evidence.

## Default VXG Design TDD Loop

When the task is "design a VXG screen," the default CLI loop is:

```bash
agent-swarm vxg use <VXG_ID>
agent-swarm vxg node add --type component --name "My Card" --key my-card --component-ref "/preview/?component=MyCard" --component-entry MyCard
agent-swarm vxg test manifest add <FILE>
agent-swarm vxg test manifest compile --manifest-id <ID> --fail-on-warning
agent-swarm vxg dev start ...
agent-swarm vxg dev url --session <SESSION_ID>
# Open the returned agent_url with agent-browser and iterate on the rendered preview.
agent-swarm vxg test suite list --target-ref <TARGET_REF>
agent-swarm vxg test run --suite-id <SUITE_ID> --runtime-target '<PREVIEW_JSON>' --evidence-profile fast
agent-swarm vxg test report --run-id <RUN_ID> --view full
```

Current VXG test-run notes:

- `vxg test run --no-wait` submits immediately and is meant for submit-then-poll flows
- `vxg test run --evidence-profile fast` is the lighter day-to-day iteration mode
- `vxg test run --evidence-profile full` is the heavier QA / handoff proof mode
- if the CLI already has an active preview session in its context, preview `vxg test run` reuses it automatically unless `--fresh` or an explicit `--session-id` is provided
- if greenlight blockers include orphaned historical suites and the repair command is available, prefer:
  - `agent-swarm vxg test suite repair-orphan --suite-id <ORPHANED> --replacement-suite-id <ACTIVE> --reason "<AUDITABLE_REASON>"`
  over inventing a new ad hoc cleanup process

Evidence readback rule:

- JSON artifacts use `json` and/or `text`
- HTML/text artifacts use `text`
- binary artifacts such as screenshots use `bytesBase64` when inlined
- when the CLI does not inline binary bytes, trust `contentType`, size, and the CAS-backed handle/ref instead of assuming evidence is missing

Default rule:

- do not design first and test later
- set the prototype binding directly on the node when the design target is being created
- write the manifest first
- iterate in preview until the preview suite is green
- bind `implementation_ref` and run implementation coverage only after the blueprint is already green

## Command Selection Rules

- If the task is project lifecycle or project persistence, also load `project-ops`.
- If the task is agent launch, chat session runtime, VM-backed execution, ACP, sandbox lifecycle, or prompt steering/queueing, stay in this skill and use `spawn agent`, `session prompt`, `session diagnose/export/stdout`, `vm doctor`, and `pool status`.
- If the task is VXG graph work, also load `vxg-project-ops`.
- If the task is SwarmCanvas/design work, also load `swarm-design-ops`.
- If the task involves VXG preview/dev sessions, also load `vxg-project-ops`.
- If the task is VXG testing, also load `vxg-testing`.
- If the task needs rendered browser proof for a VXG preview or production page, also load `agent-browser`.
- If the task is VXG screen design, default to all three:
  - `swarm-design-ops` when a `.pen` blueprint/design_ref is part of the task
  - `vxg-project-ops`
  - `vxg-testing`
  - `agent-browser`
- Prefer `agent-swarm` over hand-crafted WebSocket frames when the CLI already exposes the workflow.
- Use `agent-swarm <command> --help` for the exact live surface before guessing flags.

## Common Failure Modes

- Pointing the CLI at `swarmd --role core` and expecting owner-local admin behavior.
- Forgetting `--auth-mode paired-device` for remote/non-T0 usage.
- No paired-device credential stored yet:
  - run `agent-swarm device pair redeem ...`
- Admin action denied because the session is paired but not admin:
  - check `session whoami`
- Assuming the CLI stores data separately from the UI:
  - it does not
- Using `session create` for ordinary agent launch:
  - use `agent-swarm spawn agent`; `session create` is the lower-level gateway/session primitive
- Treating `--provider apple_vm` as the LLM provider:
  - `--provider` is a sandbox provider hint; choose agent runtime through `--package`
- Omitting `--parent-session` for host-side `--sandbox-scope current`
- Treating heartbeats as proof that Codex ran:
  - require `session stdout`, `session export`, ACP frames, tool calls, and VM lifecycle evidence
- Assuming Apple VM is ready because the host is a Mac:
  - run `agent-swarm vm doctor --format json`; signed helper, prepared bundle/restore image, guest bridge, and guest tools must all be ready
- Expecting `agent-swarm vxg preview start` or `preview stop` subcommands:
  - the compatibility wrapper is `agent-swarm vxg preview [flags]` or `agent-swarm vxg preview --stop`
- Passing non-snake-case enum values to raw JSON flags like `--runtime-target`

## Quick Triage Checklist

1. Confirm daemon role and gateway endpoint.
2. Confirm auth mode.
3. Run `agent-swarm session whoami --format json`.
4. Reproduce with the exact CLI command you expect the user to run.
5. If it is a project or VXG task, resolve canonical `project_id` / `vxg_id` explicitly.
