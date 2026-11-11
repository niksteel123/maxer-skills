---
name: project-ops
description: Project lifecycle and project-scoped swarmd bridge operations. Use when creating, listing, getting, renaming, deleting, checkpointing, or diagnosing project persistence/auth behavior from the UI or agent-swarm CLI.
---

# Project Ops

Use this skill for any task that touches project IDs, project CRUD, project checkpoints, project activity, or project-scoped persistence.

## Truth Model

- Project state is event-sourced in the `swarmd` event store.
- Primary project scope is `bridge.project`.
- Checkpoint scope is `bridge.project.checkpoint`.
- Project IDs are slugified from names and deduped with numeric suffixes.
- UI and CLI both hit the same gateway-backed bridge RPC path.

## Critical Auth + Role Rules

- Local owner-local Web/Desktop/CLI auth works only against `swarmd --role validator`.
- If the local app or CLI is pointed at `swarmd --role core`, owner-local bootstrap is rejected with `owner_local_unavailable`. That is expected behavior, not a permission bug.
- `project.delete` is admin-gated. In strict auth it requires a validator/T0 owner-local session or an equivalent admin-capable paired-device session.
- Remote or non-T0 usage should use paired-device auth, not owner-local bootstrap.

If the user says “I am local, why is project delete denied?”, check the daemon role first.

## Mandatory Preflight

Before diagnosing anything, report:

- `git rev-parse --short HEAD`
- running `swarmd` pid and full command
- gateway endpoint being used (`ws://...` / `tcp://...`)
- swarmd role (`validator`, `core`, etc.)
- swarmd data dir path
- auth path in use (`owner-local`, `paired-device`, or `permissive-auth`)

If any of those are unknown, do not claim root cause yet.

## Recommended Deterministic Setups

### Normal local operator testing

Use validator/T0:

```bash
cargo run --bin swarmd -- --role validator --data-dir "$PWD/.tmp/swarmd-data"
```

### Auth denial-path testing

Use a non-T0 role intentionally:

```bash
cargo run --bin swarmd -- --role core --data-dir "$PWD/.tmp/swarmd-data"
```

Then expect owner-local admin flows like `project.delete` to fail with `owner_local_unavailable` or `permission_denied`.

## Gateway / Wire Contract

The bridge gateway expects:

1. `ServerHello`
2. `ClientHello`
3. `SessionEstablished`
4. `RpcRequest`
5. `RpcResponse`

Important:

- frame type is `RpcRequest`, not `Rpc`
- wire format is CBOR, not JSON
- auth is bearer token via WebSocket subprotocol or `Authorization: Bearer ...`
- prefer typed clients (`WebSwarmdConnection`, `ConnectionMultiplexer`, or `agent-swarm`) over raw frame crafting

## Supported Project RPC Methods

- `project.list`
- `project.get`
- `project.create`
- `project.rename`
- `project.delete`
- `project.zones`
- `project.activity`
- `project.checkpoint.list`
- `project.checkpoint.create`
- `project.checkpoint.restore`

## Project Checkpoints Are Barrier-Atomic Over Shared VCS

`project.checkpoint.*` is NOT a separate checkpoint engine. It is a **cross-scope atomic barrier** that captures real shared VCS refs from each member scope (VXG + zone + workspace + design) into one `ProjectCheckpointManifest`. The steps under the hood:

1. Acquire per-scope mutation gates on all members.
2. Capture committed head refs from each member scope.
3. Stage retention heads in a single manifest write.
4. Release gates.

What that means for agents:

- If you only need to checkpoint a single scope (one VXG, one zone), use **shared VCS directly** via the `vcs-ops` skill — cheaper, no barrier coordination.
- If you need atomic coordination across multiple scopes (VXG + Zone + Workspace snapshot at the same wall-clock moment), use `project.checkpoint.*`.
- Project checkpoints **reference** `vcs_checkpoint_*` refs; inspecting a project checkpoint surfaces the underlying per-scope checkpoints, which you can then resolve via `vcs_ref_show` / `vcs_show`.

See the **`vcs-ops`** skill for per-scope ref model, branches/tags/checkpoints, merge semantics, and the `SWARMNET_VCS_SHARED_CORE` feature flag gotcha.

## CLI Project Commands

```bash
agent-swarm project list
agent-swarm project get <PROJECT_ID>
agent-swarm project create --name "My Project"
agent-swarm project rename <PROJECT_ID> --name "New Name"
agent-swarm project delete <PROJECT_ID>
agent-swarm project zones <PROJECT_ID>
agent-swarm project activity <PROJECT_ID>
```

Useful auth diagnostic:

```bash
agent-swarm session whoami --format json
```

## Delete Semantics

- `project.delete` is a soft-delete, not a hard purge.
- It appends a `ProjectDeleted` event.
- Replay removes the project from the live projection.
- `project.list` stops showing it.
- `project.get` returns `null`.
- There is no cascade purge of zone/checkpoint/VXG event history.

## Persistence Verification Protocol

Use unique-id delta evidence, not historical counts.

1. Create a unique project name:
   - `NAME="diag-project-$(date +%s)"`
2. Create or delete it via CLI or bridge RPC.
3. Confirm the response contains the expected `result.id` / `{ ok: true }`.
4. Inspect `events.redb` for exact tokens:
   - `bridge.project`
   - `project.created`
   - `project.deleted`
   - `<project_id>`
5. Restart `swarmd`.
6. Re-verify with `project.list` / `project.get`.

## Project <-> VXG Coupling Rules

- For project-scoped VXG, use `vxgId == projectId`.
- If no project/zone is selected, UI falls back to `system`.
- Project delete does **not** cascade-delete VXG.

## Common Failure Modes

- Running against `swarmd --role core` and expecting local owner-local admin behavior.
- Searching legacy tokens instead of `bridge.project`.
- Using raw WS frames with wrong `type`.
- Using JSON instead of CBOR.
- Confusing soft-delete with physical data purge.
- Interpreting historical `bridge.vxg` bytes as current project-write evidence.

## Quick Triage Checklist

1. Confirm daemon role and auth path first.
2. Confirm method exists in `dispatch_project`.
3. Reproduce with CLI or typed client.
4. Use `session whoami` to verify actual permission/auth source.
5. Collect before/after event-store evidence with a unique project id.
6. Restart and replay before claiming a persistence bug.
