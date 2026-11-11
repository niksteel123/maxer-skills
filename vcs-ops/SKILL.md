---
name: vcs-ops
description: Shared CAS/VCS operations playbook across workspace/zone/vxg/design/project scopes. Use when inspecting or mutating refs (branch/tag/checkpoint), reading version history, committing save points, merging or rolling back, restoring to a named ref, navigating namespaces, exporting Git-shaped views, or subscribing to VCS events through swarmd bridge RPC, MCP (vcs_* tools), or the `agent-swarm vcs` CLI. Triggers include any mention of vcs, commit, save point, branch, tag, checkpoint, ref, restore, rollback, merge (preview/apply), backfill, namespace, vcs log / ref log / operation log / events, vcs_export, SWARMNET_VCS_SHARED_CORE, shared-core feature flag, project checkpoints, VXG checkpoints, design checkpoints, zone versions, or per-scope history.
---

# VCS Ops — Unified Shared Version Control

Use this skill when the task touches the shared **VCS** surface — the content-addressed version-control layer above MeshSync (zones), Workspace snapshots, VXG revisions, Design lineage, and the event-sourced kernel. The shared VCS is domain-agnostic: one surface serves every scope family by delegating to per-scope adapters.

This is **not Git**. There is no staging area, no commit tree, and no fetch/push. Versions are integers per scope, history is paged CAS-backed `RevisionCatalog`, refs are `VersionedRef` records, and domain mutations happen through adapters.

## Source of Truth

- **Spec**: `thoughts/unified-cas-vcs/unified-cas-vcs-spec.md`
- **TDD**: `thoughts/unified-cas-vcs/unified-cas-vcs-tdd.md`
- **Bootstrap**: `thoughts/unified-cas-vcs/unified-cas-vcs-bootstrap.md`
- **Strategy**: `thoughts/unified-cas-vcs/unified-cas-vcs-strategy.md`
- **Research doc**: `docs/research/2026-04-08-shared-cas-data-vcs-research.md`
- **Implementation root**: `crates/swarm-services/src/vcs/` (refs, history, operation_log, domain, export)
- **Method registrations**: `swarmd/src/method_registrations/vcs.rs` (30 methods under `MethodGroup::Vcs`)
- **CLI command tree**: `crates/swarm-cli/src/commands/vcs.rs`

## Mental Model

### Scopes and Namespacing

Every VCS call is addressed by a `--scope` path. Shape: `<domain>/<domain-scope-id>`.

| Domain | Scope example | Adapter |
|---|---|---|
| VXG graphs | `vxg/design-board-e2e-29aa1bee` | `VxgAdapter` (reads VXG revision catalog) |
| Workspaces | `workspace/project-123/main` | `WorkspaceAdapter` (maps snapshot DAG) |
| Zones (MeshSync) | `zone/zone-456` | `ZoneAdapter` (reads MeshSync root history) |
| Designs | `design/component-789` | `DesignAdapter` (design lineage) |
| Projects | `project/project-999` | Project-level adapter (project checkpoints) |

Metadata for each scope is persisted under a derived meta-scope (`refs/meta/<domain-scope-id>`), auto-bootstrapped by `bootstrap_ref_metadata_scope()` and idempotent under re-entry.

### Revisions, Refs, and Two-Tier Commits

- `RevisionRecord` = one versioned snapshot. Fields: `version` (u64, monotonic, never reused), `head_ref` (CasRef, points to domain state), `actor_id`, `timestamp`, `message`, `parent_versions`, `commit_kind`.
- **Tier 1 (Automatic)** — substrate durability boundaries mint revisions automatically (MeshSync root flush, workspace snapshot commit, VXG decision). `commit_kind: "automatic"` (omitted from serialized form by default).
- **Tier 2 (Manual)** — operator save points. `vcs.commit` creates a `commit_kind: "manual"` revision with a message. It does **not** create a durable ref.
- `RevisionRecord.commit_kind` values: `Automatic` | `Manual` | `Rollback` | `Merge`.
- History lives in paged `RevisionCatalog` (page size 500 by default), backward-linked in CAS. `vcs.log` handles pagination transparently.

### Refs: Kind × Namespace

A `VersionedRef` has a `kind` (`Checkpoint` | `Tag` | `Branch`) and a `namespace` (`Local` | `Shared` | `Archive` | `Peer`). Canonical paths:

| Ref class | Canonical path | Movable | Propagated |
|---|---|---|---|
| Local branch | `refs/local/heads/<name>` | Y | N (scratch) |
| Shared branch | `refs/shared/heads/<name>` | Y | Y (gossip-visible) |
| Shared checkpoint | `refs/shared/checkpoints/<name>` | **N** (immovable) | Y |
| Archive tag | `refs/archive/tags/<name>` | **N** (immovable) | On-demand |
| Peer mirror | `refs/peers/<hex-node-id>/shared/heads/<name>` | **N** (read-only) | Inbound only |

All refs validate against reserved names, control characters, and trailing `.lock`. Protected refs (e.g., `refs/shared/heads/main`) require T0 trust tier or explicit attestation.

## Feature Flag — READ THIS FIRST

## Release Backend Rule

For VXG, design, and project checkpoint work, VCS must talk to the same real release swarmd backend database used by the human app and operator CLI. Do not start a fresh `.tmp/*`, `/tmp/*`, fixture, or ad hoc `--data-dir` database for graph/design/VCS mutations unless the task is explicitly an isolated test.

Before creating refs, checkpoints, branches, tags, commits, restores, or backfills for `vxg/<id>`, `design/<id>`, or `project/<id>` scopes:

- inspect the running `swarmd` process and data dir;
- confirm the daemon is the intended release backend, not a temp test daemon;
- confirm the expected project/VXG/design exists there, especially `swarm2` for swarm2 work;
- prefer gateway-backed CLI/MCP through the running daemon so UI, CLI, design registry, VXG, and VCS share one truth.

If using direct-store MCP, set `SWARMD_DATA_DIR` to the real release database path. A direct-store `.tmp/swarmd-data` config is valid only for isolated tests and must not be used to validate production VXG or design state.

**Most VCS methods are gated behind `SWARMNET_VCS_SHARED_CORE=1`** on the swarmd server process. Without the flag, calls fail with:

```
internal_error: failed_precondition: vcs.<method> is registered but SWARMNET_VCS_SHARED_CORE is disabled
```

Setting the flag on the CLI/MCP client does **nothing** — the server process is what reads it. Verify swarmd startup args or env before debugging further.

Exceptions (work with or without the flag):
- `vcs.status` — returns head version, head_ref, and a built-in ref counts block; includes a `health` field with explicit rollout state (`shared_core_enabled`, `state: "disabled" | "healthy" | "degraded" | "repairing"`, `metadata_lagging`, `repair_available`, `catalog_lag`, `backfill_debt`, `reasons[]`).

Enable on the release swarmd backend:
```bash
SWARMNET_VCS_SHARED_CORE=1 ./target/release/swarmd --role validator
```

Only add `--data-dir` when it is the operator's known real release data dir. Do not use `.tmp/swarmd-data` for ordinary VXG/design feature work.

## Canonical Method Surface

30 methods registered under `MethodGroup::Vcs`. CLI path `agent-swarm vcs …` ↔ MCP tool `vcs_*` ↔ RPC name `vcs.*`. All require `--scope`.

### Inspection (read-only)
| CLI | MCP tool | Purpose | Flag required |
|---|---|---|---|
| `vcs status --scope <s>` | `vcs_status` | Head version, head_ref, active_branch, health (incl. `shared_core_enabled`), and the full `RefNamespaceView` inline under `namespace` | No |
| `vcs log --scope <s> [--limit] [--cursor]` | `vcs_log` | Paged revision history (version, commit_kind, message, parent_versions, actor_id, timestamp, head_ref) | Yes |
| `vcs show --scope <s> <--version \| --ref>` | `vcs_show` | Resolve + display one revision or the target of a ref | Yes |
| `vcs diff --scope <s> --from <v\|ref> --to <v\|ref>` | `vcs_diff` | Adapter-specific structured diff between two points | Yes |
| `vcs namespace --scope <s>` | `vcs_namespace` | Same `RefNamespaceView` shape as `vcs.status.namespace`, but gated behind the shared-core flag | Yes |
| `vcs events --scope <s> [--cursor]` | `vcs_events` | Stream normalized VCS events (version change, ref mutation) | Yes |
| `vcs operation log --scope <s> [--limit]` | `vcs_operation_log` | Node-local op journal (Started/Completed pairs + compensation plans) | Yes |

### Commits (write)
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs commit --scope <s> --message <text>` | `vcs_commit` | Tier 2 manual save point (no durable ref) |

### Refs — CRUD & promotion
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs ref list --scope <s> [--namespace] [--kind]` | `vcs_ref_list` | List refs, optionally filtered |
| `vcs ref show --scope <s> <name>` | `vcs_ref_show` | Full `VersionedRef` record (target_version, head_ref, author, signature, created_at) |
| `vcs ref log --scope <s> [--name] [--limit]` | `vcs_ref_log` | **Ref mutation** history (create/move/delete/promote events) — NOT version history |
| `vcs ref promote --scope <s> --source <path> --destination <path>` | `vcs_ref_promote` | Re-classify a ref (e.g. local → shared, branch → tag) |

### Checkpoints
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs checkpoint create --scope <s> --name <n> [--version] [--message]` | `vcs_checkpoint_create` | Immovable shared ref at a version (default: head) |
| `vcs checkpoint list --scope <s>` | `vcs_checkpoint_list` | List checkpoints |
| `vcs checkpoint delete --scope <s> --name <n>` | `vcs_checkpoint_delete` | Soft-delete with grace period |
| `vcs checkpoint restore --scope <s> --name <n>` | `vcs_checkpoint_restore` | Rewind to checkpoint (adds a rollback commit) |

### Tags (write-once, immovable)
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs tag create --scope <s> --name <n> [--version] [--message]` | `vcs_tag_create` | Create archive tag (immovable) |
| `vcs tag list --scope <s>` | `vcs_tag_list` | List tags |
| `vcs tag delete --scope <s> --name <n>` | `vcs_tag_delete` | Soft-delete (grace period) |

### Branches (movable lines of history)
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs branch create --scope <s> --name <n> [--version] [--shared]` | `vcs_branch_create` | Local (default) or shared branch from version/head |
| `vcs branch list --scope <s>` | `vcs_branch_list` | List branches |
| `vcs branch move --scope <s> --name <n> <--version \| --ref> [--force]` | `vcs_branch_move` | Retarget (force bypasses ancestry check) |
| `vcs branch delete --scope <s> --name <n>` | `vcs_branch_delete` | Soft-delete |
| `vcs branch publish --scope <s> --name <n>` | `vcs_branch_publish` | Promote local → shared (the "push" analogue) |

### Rewinds
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs rollback --scope <s> --version <v>` | `vcs_rollback` | Rewind to explicit version; emits `commit_kind: "rollback"` |
| `vcs restore --scope <s> --ref <name>` | `vcs_restore` | Resolve ref, then rollback to its target_version |

### Merges
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs merge preview --scope <s> --ours <n> --theirs <n>` | `vcs_merge_preview` | Dry-run merge; returns `{ merged_version: null, conflicts? }` |
| `vcs merge --scope <s> --ours <n> --theirs <n>` | `vcs_merge` | Execute merge; emits `commit_kind: "merge"` with `parent_versions: [ours, theirs]` |

### Session state
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs checkout --scope <s> <--version \| --ref> [--detached]` | `vcs_checkout` | Per-session active context (event-sourced scopes) or mount state (zone-backed) |

### Administrative
| CLI | MCP tool | Purpose |
|---|---|---|
| `vcs backfill --scope <s>` | `vcs_backfill` | Rebuild RevisionCatalog from domain truth — idempotent, deterministic |
| `vcs export --scope <s> --output <dir> [--ref \| --version] [--history-limit]` | (none) | Write Git-shaped read-only compat tree (refs/, HEAD, history/revisions.json, divergences) |

## Envelope Conventions

Same CLI envelope as other `agent-swarm` commands (`--format toon | json | human`):
```json
{ "v": 1, "ok": true, "data": { … }, "meta": { "trace_id": "trace:agent-swarm:vcs.xxx", "actor_id": "ag-xxxx" }, "error": null }
```

MCP tools return raw inner data. Error prefix examples:
- `internal_error: failed_precondition: vcs.<m> is registered but SWARMNET_VCS_SHARED_CORE is disabled`
- `not_found: <scope-id or ref-name>`
- `invalid_params: <field> required`

`vcs.status` returns rich health info worth parsing:
```json
{
  "scope": "vxg/foo",
  "head_version": 6,
  "head_ref": { "Convergent": { "storage_hash": [...], "content_hash": [...], "workspace_id": "swarmd-local", "key_epoch": 1 } },
  "active_branch": null,
  "namespace": { "scope_id": "...", "head_version": 6, "counts": { "checkpoints": 0, "tags": 0, "branches": 0, "total": 0 }, "checkpoints": [], "tags": [], "branches": [] },
  "health": { "state": "disabled", "shared_core_enabled": false, "metadata_lagging": false, "repair_available": false, "catalog_lag": 0, "backfill_debt": 0, "reasons": ["shared_core_disabled"], "repair_key": null, ... }
}
```

## Canonical Agent Workflows

### 1. Inspect a scope (works without shared-core flag)
```bash
agent-swarm vcs status --scope vxg/design-board-e2e-29aa1bee --format json
# → head_version, head_ref, namespace counts, health state
```

MCP equivalent:
```json
vcs_status({ "scope": "vxg/design-board-e2e-29aa1bee" })
```

If `health.state == "disabled"` and `shared_core_enabled == false`, do not retry gated `vcs.*` methods yet — restart swarmd with `SWARMNET_VCS_SHARED_CORE=1` first. If `health.state == "degraded"` and `metadata_lagging: true`, run `vcs.backfill` to rebuild the catalog — or accept the native domain truth as primary and treat shared as shadow.

### 2. Start feature work on a branch
```bash
# Local scratch branch from current head
agent-swarm vcs branch create --scope workspace/my-proj --name feature/auth --format json
# → { "reference": { "id": "refs/local/heads/feature/auth", "kind": "branch", "namespace": "local", "target_version": <head>, "movable": true, ... } }

# From an explicit version
agent-swarm vcs branch create --scope vxg/demo --name feature/revise --version 42
```

MCP:
```json
vcs_branch_create({ "scope": "vxg/demo", "name": "feature/revise", "version": 42, "shared": false })
```

### 3. Commit a save point and publish the branch
```bash
agent-swarm vcs commit --scope workspace/my-proj --message "WIP: wire OAuth callback" --format json
# → Revision with commit_kind: "manual"

agent-swarm vcs branch move --scope workspace/my-proj --name feature/auth --version <new-head>
agent-swarm vcs branch publish --scope workspace/my-proj --name feature/auth
# → local → shared, gossip-visible
```

### 4. Checkpoint before risky refactor, restore on regression
```bash
agent-swarm vcs checkpoint create --scope design/home --name pre-redesign --message "stable design before hero section overhaul"

# … work, find regression …
agent-swarm vcs restore --scope design/home --ref refs/shared/checkpoints/pre-redesign
# Adds a Rollback commit pointing to the checkpoint's target_version; head advances.
```

### 5. Merge a branch in (preview first)
```bash
agent-swarm vcs merge preview --scope workspace/my-proj --ours refs/shared/heads/main --theirs refs/shared/heads/feature/auth --format json
# → { "merged_version": null, "conflicts": null } (clean) OR { conflicts: { "path/to/file": { artifact_ref: "...", ... } } }

# If clean, execute
agent-swarm vcs merge --scope workspace/my-proj --ours refs/shared/heads/main --theirs refs/shared/heads/feature/auth
# → Revision with commit_kind: "merge", parent_versions: [ours_head, theirs_head]
```

Conflicts are **structured**, not flattened. Workspace merges preserve one conflict per `RepoPath` with a CAS artifact ref. Domain adapters that don't implement merge return `MergeNotSupported` from both preview and execute.

### 6. Roll back a bad version
```bash
agent-swarm vcs log --scope vxg/demo --limit 10 --format json
# Identify the bad version (say 11)

agent-swarm vcs rollback --scope vxg/demo --version 10
# New revision with commit_kind: "rollback", parent_versions: [10], advances head.
# Rollback is FORWARD history — the bad version stays queryable.
```

### 7. Read the four different histories (pick the right one)
```bash
# Revision history — what changed, when
agent-swarm vcs log --scope vxg/demo --limit 20 --format json

# Ref mutation history — which refs moved, when (NOT revision history)
agent-swarm vcs ref log --scope vxg/demo --name main --limit 20 --format json

# Node-local op journal — compensation / transaction boundaries
agent-swarm vcs operation log --scope vxg/demo --limit 10 --format json

# Live events stream — version changes + ref mutations
agent-swarm vcs events --scope vxg/demo --cursor <seq> --format json
```

Rule of thumb: use `vcs log` for "what's the history?", `vcs ref log` for "who moved my branch?", `vcs operation log` for "what transactions happened on this node?", `vcs events` for tailing.

### 8. Tag a release
```bash
agent-swarm vcs tag create --scope vxg/demo --name v1.0.0 --version 42 --message "Release 1.0.0"
# Immovable archive ref: refs/archive/tags/v1.0.0
```

Attempting to `tag delete` within the grace window succeeds; after grace window, tag is locked.

### 9. Repair a lagging catalog
```bash
# Status will show metadata_lagging: true, catalog_lag: N, repair_available: true
agent-swarm vcs status --scope vxg/demo --format json

# Rebuild catalog from domain truth (idempotent, deterministic)
agent-swarm vcs backfill --scope vxg/demo --format json
```

`backfill` respects `VCS_COLD_REBUILD_BUDGET_MS_PER_1000_REFS`; if the budget is exceeded, it fails explicitly rather than silently truncating.

### 10. Export a Git-shaped compatibility view
```bash
agent-swarm vcs export --scope vxg/demo --output /tmp/vxg-git --ref refs/shared/heads/main --history-limit 100
# Writes refs/, HEAD, history/revisions.json, divergences/*.json
```

This is read-only for external tools; it does not let you edit the exported tree and push changes back.

## Checkpoint Landscape (across surfaces)

Three checkpoint systems live in the repo. Know which one to use.

| Surface | Method pattern | What it checkpoints | When to use |
|---|---|---|---|
| **Shared VCS** (this skill) | `vcs.checkpoint.*`, scope `<domain>/<id>` | Single scope only (one VXG graph, one zone, one workspace, one design) | Default. Single-scope versioning. |
| **Project checkpoints** (`project-ops` skill) | `project.checkpoint.*` | Barrier-atomic combination of real member refs from multiple scopes | Cross-scope atomicity (e.g., snapshot VXG + Zone + Workspace together) |
| **Legacy domain** (deprecated) | `vxg_checkpoint_*`, `design_checkpoint_*` | Per-domain compatibility wrappers migrating to shared refs | Only for legacy code paths during migration |

Project checkpoints acquire per-scope mutation gates, capture committed heads from each member, then stage retention heads in one manifest write before releasing gates. See `project-ops` skill for project-checkpoint workflows. Under the hood, they reference real shared VCS refs — not a separate checkpoint engine.

## Gotchas

- **Wrong database invalidates the proof.** If `swarm2` or the expected design/VXG scope is missing, assume you are pointed at a temp or wrong backend before debugging VCS itself.
- **Shared-core flag is server-side.** `SWARMNET_VCS_SHARED_CORE=1` on your CLI shell is meaningless. Verify on swarmd startup.
- **`--scope` is mandatory.** Every `vcs` subcommand except `help` errors with `` `agent-swarm vcs` requires --scope`` if it's missing.
- **`vcs status` always works and is richer than it looks.** It returns head + full `RefNamespaceView` + full health; when rollout is off, expect `health.shared_core_enabled == false` and `health.state == "disabled"` rather than a fake lag signal. Rollout-disabled wins state precedence **unconditionally** — even when peer tracking refs or conflict signals are present on the scope, `state` stays `"disabled"` until the flag flips. Only four states are possible: `repairing` > `disabled` > `degraded` > `healthy`.
- **`vcs.namespace` is feature-gated; `vcs.status.namespace` is not.** Both emit the same `RefNamespaceView`. If you only need the ref view and want it to work on a rollout-disabled daemon, read `vcs.status.namespace` — no second call needed.
- **Commits don't create refs.** `vcs.commit` mints a Manual revision; to make it discoverable, create a checkpoint/branch/tag pointing to it.
- **Rollback is forward history.** The old version stays queryable. Do not assume `vcs.rollback` is destructive.
- **Tags and checkpoints are immovable.** Any "move" operation on them fails — delete (within grace) and recreate instead.
- **Branch `force` bypasses ancestry.** `vcs.branch.move --force` skips the check that the new target is a descendant of the current target. Use it for intentional resets; otherwise expect an ancestry-failure error.
- **Peer refs are read-only.** `refs/peers/<node-id>/...` appear when receiving gossip updates; they cannot be mutated locally.
- **Protected refs enforce trust tier.** Promoting to `refs/shared/heads/main` (or similar "main" refs) requires T0 or explicit attestation. Cross-scope operations may require project-level gates.
- **Conflicts are structured.** Workspace conflicts surface one per `RepoPath` with a CAS artifact ref; domain adapters without merge support return `MergeNotSupported` from both preview and execute.
- **Grace period on deletion.** `ref/tag/checkpoint delete` marks soft-deleted; within `DEFAULT_REF_DELETION_GRACE_MS` the ref is still resolvable, then swept by GC.
- **GC frontier is union of mount pins (zone), ref pins, and degraded pins.** Zone VCS does not invent a second GC path.
- **Shadow mode and kill-switch.** During Phase C (VXG) and Phase E (Design), shared VCS runs in shadow under the feature flag. If divergence is detected, the kill-switch disables shared delegation for the scope without corrupting native truth.
- **`commit_kind: Automatic` is omitted from serialized records.** Deserialized records with no `commit_kind` default to Automatic.
- **Head refs include a `Convergent` wrapper.** `head_ref.Convergent = { storage_hash: [multihash bytes], content_hash: [...], workspace_id, key_epoch }`. The byte arrays are **SHA-256 prefixed with multihash tag `1220`** — that's why you'll see `12, 32, …` as the first two array elements.
- **MCP returns raw payloads, CLI wraps in envelope.** Same pattern as every other `agent-swarm` surface.

## Relationship to Adjacent Surfaces

- **VXG** (`vxg-project-ops` skill): VXG graph state is the domain truth; `vxg/<id>` is the VCS scope pattern. Use `vcs.log --scope vxg/<id>` instead of the legacy `vxg.history`. VXG-local graph mutations still go through `vxg_*` methods; **version navigation and ref management go through `vcs_*`**.
- **Designs** (`swarm-design-ops` skill): Design lineage maps to `design/<id>` scope after Phase E. Prefer `vcs_*` for design checkpoints rather than legacy `design_checkpoint_*` wrappers.
- **Zones**: `zone/<id>` scopes read MeshSync root history; restore validates writer-fence and epoch-fence preconditions before advancing. Do not call zone-mutation methods to move VCS refs; use shared `vcs_branch_move`, `vcs_checkpoint_restore`, etc.
- **Workspaces**: Workspace snapshot DAG maps to `workspace/<id>` scope; reflog translates `WorkspaceSnapshotId` to `VersionedRef` semantics. Conflicts are preserved per `RepoPath` with artifact refs.
- **Projects** (`project-ops` skill): `project.checkpoint.*` is the barrier-atomic multi-scope checkpointing layer built on top of shared VCS. A project checkpoint's members are real `vcs_*` refs in their respective scopes.
- **Verify** (`verify-ops` skill): Verify evidence bundles are CAS-backed and separate from VCS history. Verify owns acceptance; VCS owns versioning. They do not cross over.

## Quick Reference — Example Invocations

### CLI — inspect & inspect
```bash
agent-swarm vcs status --scope vxg/demo --format json
agent-swarm vcs log --scope workspace/proj --limit 50 --format json
agent-swarm vcs ref list --scope design/home --namespace shared --kind branch --format json
```

### CLI — work & ship
```bash
agent-swarm vcs branch create --scope workspace/proj --name feature/search
agent-swarm vcs commit --scope workspace/proj --message "land search pass 1"
agent-swarm vcs branch move --scope workspace/proj --name feature/search --version <v>
agent-swarm vcs branch publish --scope workspace/proj --name feature/search
agent-swarm vcs merge preview --scope workspace/proj --ours refs/shared/heads/main --theirs refs/shared/heads/feature/search
agent-swarm vcs merge --scope workspace/proj --ours refs/shared/heads/main --theirs refs/shared/heads/feature/search
agent-swarm vcs tag create --scope workspace/proj --name v2.0.0 --message "Search GA"
```

### CLI — safety nets
```bash
agent-swarm vcs checkpoint create --scope design/home --name stable-before-redesign
agent-swarm vcs restore --scope design/home --ref refs/shared/checkpoints/stable-before-redesign
agent-swarm vcs rollback --scope vxg/demo --version 42
```

### MCP — payload shapes
```json
// vcs_status
{ "scope": "vxg/demo" }
→ { "scope", "head_version", "head_ref": { "Convergent": {...} }, "active_branch", "namespace": { counts + lists }, "health": { state, reasons, ... } }

// vcs_branch_create
{ "scope": "workspace/proj", "name": "feature/a", "version": 42, "shared": false }
→ { "reference": { "id": "refs/local/heads/feature/a", "kind": "branch", "namespace": "local", "target_version": 42, "movable": true, ... } }

// vcs_commit
{ "scope": "workspace/proj", "message": "WIP" }
→ { "version": 87, "commit_kind": "manual", "message": "WIP", "actor_id": "...", "parent_versions": [86], ... }

// vcs_merge_preview
{ "scope": "workspace/proj", "ours": "refs/shared/heads/main", "theirs": "refs/shared/heads/feature/a" }
→ { "merged_version": null, "conflicts": null | { "path/to/file": { "artifact_ref": "...", ... } } }

// vcs_checkpoint_restore
{ "scope": "design/home", "name": "stable-before-redesign" }
→ { "version": <new-head>, "commit_kind": "rollback", "parent_versions": [<target>], "head_ref": {...} }
```

## Diagnostics

| Symptom | Likely cause | Fix |
|---|---|---|
| `failed_precondition: vcs.<m> is registered but SWARMNET_VCS_SHARED_CORE is disabled` | swarmd launched without the flag | Restart swarmd with `SWARMNET_VCS_SHARED_CORE=1` |
| `` `agent-swarm vcs` requires --scope`` | Subcommand missing `--scope` | Add `--scope <domain>/<id>` |
| `not_found: <scope>` | Scope id typo or scope not yet bootstrapped | List candidates: `agent-swarm vxg list`, `agent-swarm project list`, etc. |
| `vcs.status.health.state == "disabled"` with `shared_core_enabled: false` | Scope is observable, but shared VCS rollout is still off | Restart swarmd with `SWARMNET_VCS_SHARED_CORE=1`; do not retry gated methods until then. |
| `vcs.status.health.state == "degraded"` with `metadata_lagging: true` | Shared catalog is behind domain truth | Run `vcs.backfill` for the scope |
| `MergeNotSupported` | Domain adapter doesn't implement merges | Adapter-local tool (VXG merge UI, workspace merge flow) or file an issue |
| Branch move fails with `ancestry` error | Target version not descendant of current target | Use `--force` intentionally if a reset is what you want |
| `vcs.commit` not visible in a named branch | `commit` doesn't move refs automatically | Follow with `vcs branch move` or `vcs checkpoint create` |
| Peer ref appears read-only | By design — peer refs are inbound mirrors | Use a local branch + publish instead |

## What NOT to do

- Do not assume Git semantics. No staging area, no cherry-pick, no rebase, no fetch/push.
- Do not treat `vcs.commit` as mandatory for Tier 1 history. Automatic revisions are minted by substrates; manual commits are optional operator save points.
- Do not bypass `vcs.ref.promote` with hand-edited ref paths — promotion enforces trust tier checks.
- Do not modify peer refs locally.
- Do not expect cross-scope atomicity from `vcs.*` calls. Use `project.checkpoint.*` (see `project-ops` skill) for multi-scope barriers.
- Do not skip `vcs.merge.preview` before `vcs.merge` on non-trivial branches — structured conflict output is the only clean way to inspect them before apply.
- Do not use `vcs.export` as a push target for external tools — it's a read-only compat surface.
