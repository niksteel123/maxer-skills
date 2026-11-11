---
name: swarm-design-ops
description: SwarmCanvas design registry and .pen document operations via MCP-first Agent Swarm registry methods, with CLI as validation/control fallback. Use when creating, reading, editing, importing, exporting, linking, validating, linting, screenshotting, or Paper/Pencil-comparing designs in swarmnet. Covers design.* and canvas.* method surfaces, structured design_batch editing, design_write_html, shared primitives, VXG design_ref lifecycle, and Pencil/Paper MCP interop.
---

# SwarmCanvas Design Operations

Use this skill when the task involves `.pen` design documents, the Design Registry, canvas snapshots/deltas, VXG design linking, or Pencil MCP interoperability.

## Source of Truth Model

- Design state is event-sourced in `swarmd` storage via the Design Registry
- Canvas delta state is also event-sourced (scope: `bridge.canvas`)
- `.pen` documents are JSON-based visual design files stored in CAS with version control
- Design snapshots are immutable CAS artifacts; mutations create new snapshots
- All design and canvas methods are accessible via **both CLI and MCP**. The unified registry auto-derives JSON schemas and MCP tool definitions from registration metadata.
- The web UI, CLI, and MCP must all mutate through these same Design Registry methods. Do not invent UI-only or agent-only geometry mutation models.

## MCP-First Authoring Doctrine

For agent-driven SwarmCanvas work, prefer the Agent Swarm MCP tools when they are available. Use CLI for validation/control fallback, release builds, scripted export, and debugging.

Default create/edit path:

1. Discover capabilities with MCP tool listing or `tool_search`. `mcp.designer` and `mcp.full` should expose Design and Canvas tools.
2. Create from a shared primitive with `design_list_primitives` + `design_instantiate_primitive`, or create from a Paper-like HTML fragment with `design_write_html`.
3. Edit through `design_batch` using structured JSON operation objects and `expectedVersion`.
4. Validate through `design_validate`, `design_lint`, `design_snapshot_layout`, `design_style_inventory`, and `design_screenshot`.
5. Open the render URL with browser automation and compare visually against Paper/Pencil evidence when authoring quality matters.

Do not stringify batch operations. The MCP schema for `design_batch.inputSchema.properties.operations.items.type` must be `object`. If a generated client still reports `string[]`, refresh/rebuild the MCP server or use direct list-tools evidence before proceeding; the registry payload itself accepts JSON operation objects.

Useful MCP tool names:

```text
design_list_primitives / design_instantiate_primitive
design_write_html
design_batch
design_validate / design_lint / design_snapshot_layout / design_style_inventory
design_screenshot / design_export / design_read / design_link / design_context
canvas_get_snapshot / canvas_get_deltas_since / canvas_apply_deltas
```

`design_batch.operations[]` supports object operations with `op` values:

```text
insert, update, replace, copy, move, remove, delete, setVariables, setVariable
```

Common operation fields: `nodeId`, `id`, `parent`, `source`, `index`, `node`, `patch`, `data`, `replacement`, `variables`, `name`, `type`, `value`, `alias`, `bind`.

## Authoring Parity Loop

When the task is visual authoring quality, do not stop at schema/unit proof. Create fresh side-by-side evidence:

1. Paper MCP creates the reference artboard from the same brief.
2. Agent Swarm MCP creates the SwarmCanvas design with `design_write_html` or `design_instantiate_primitive`.
3. Agent Swarm MCP performs second-pass edits with structured `design_batch` operations.
4. Export canonical `.pen 2.11`, then run validate, `lint --profile paper-parity`, layout snapshot, style inventory, render screenshot, browser inspection, and Pencil layout/screenshot if available.
5. Compare screenshots side by side. Check hierarchy, spatial rhythm, typography, state colors, rounded corners, connector/line joins and curves, clipping, overlap, and edit ergonomics.

Do not claim authoring parity from automated tests alone. Parity is a visual judgment supported by registry, render-kit, browser, and Pencil/Paper evidence.

## Version Control for Designs — Use Shared VCS

Design lineage (history, checkpoints, branches, tags, rollback/restore) now lives on the **shared VCS** surface under scope `design/<design_id>`. Prefer `vcs_*` MCP tools / `agent-swarm vcs … --scope design/<id>` over the legacy `design_history` + `design_restore` wrappers.

- Create a design-local checkpoint: `agent-swarm vcs checkpoint create --scope design/<id> --name stable-before-redesign`
- Restore: `agent-swarm vcs restore --scope design/<id> --ref refs/shared/checkpoints/stable-before-redesign`
- Inspect status/history without the shared-core flag: `agent-swarm vcs status --scope design/<id>` (always works)
- Most other `vcs.*` methods require swarmd started with `SWARMNET_VCS_SHARED_CORE=1`.

See the **`vcs-ops`** skill for the full ref model, feature-flag story, and cross-scope semantics. `design_*` methods in this skill remain authoritative for design authoring, linking, promoting, and rendering — not for versioning.

## Project Scoping

Designs are stored in scope `design/{project_id}` in the event store. All design operations should include `projectId` in MCP payloads or `--project <PROJECT_ID>` on CLI.

Without project scope, designs land in the default workspace scope and can become invisible to the web app.

```bash
# Correct: visible to the web app
agent-swarm design import --file design.pen --project swarm2
agent-swarm design list --project swarm2
agent-swarm design screenshot --design <ID> --project swarm2

# Wrong for project work: default workspace scope
agent-swarm design import --file design.pen
agent-swarm design list
```

## Two Namespaces

The design surface is split across two method groups:

### Canvas Methods (3 methods, `MethodGroup::Canvas`)

Low-level snapshot and delta operations:

```text
canvas.getSnapshot     (read-only)  — Get a canvas snapshot by canvasId
canvas.getDeltasSince  (read-only)  — Get canvas deltas since a version
canvas.applyDeltas     (write)      — Apply a canvas delta
```

### Design Methods (35 methods, `MethodGroup::Design`)

Higher-level Design Registry operations with VXG integration:

```text
design.create          — Create a new design
design.list            — List designs (filterable by status/project)
design.listPrimitives  — List shared authoring primitives
design.instantiatePrimitive — Create from a shared primitive
design.show            — Show one design by ID
design.read            — Read a design snapshot (by design ID or CAS ref)
design.search          — Search a design tree (by name/type/reusable)
design.export          — Export a design snapshot to file
design.screenshot      — Capture a design screenshot via render-kit
design.validate        — Validate .pen schema/layout compatibility
design.migratePen      — Migrate .pen to canonical schema
design.batch           — Apply structured batch edits transactionally
design.writeHtml       — Create/replace from Paper-like HTML
design.snapshotLayout  — Inspect layout/clipping diagnostics
design.lint            — Run visual/schema lint diagnostics
design.styleInventory  — Summarize colors/typography/style usage
design.import          — Import a .pen file as a design (with optional VXG link)
design.link            — Link a design to a VXG node (sets design_ref)
design.unlink          — Unlink a design from a VXG node
design.context         — Resolve design context from a VXG node
design.promote         — Promote a design component to prototype (sets component_ref)
design.history         — List design version history
design.restore         — Restore a design to a previous snapshot
design.diff            — Diff two design snapshots
design.update          — Update design metadata (name/description)
design.archive         — Archive a design
design.destroy         — Destroy a design (with optional VXG cleanup)
design.write           — Write a design snapshot (with base + patch or file)
design.insert          — Insert a node into a design tree
design.copy            — Copy a node within a design
design.move            — Move a node to a new parent
design.remove          — Remove a node from a design
design.replace         — Replace a node in a design
design.variables       — Read design variables
design.variablesSet    — Update design variables
```

## CLI Surface

All design operations are available through the `agent-swarm design` CLI. For authoring/editing, prefer MCP when available; use CLI for fallback and validation/control loops.

```bash
# Discovery and lifecycle
agent-swarm design create --name "My Design" [--description DESC] [--width 1920] [--height 1080] --project <PROJECT_ID>
agent-swarm design list [--status active|linked|unlinked|archived] --project <PROJECT_ID> [--limit N]
agent-swarm design list-primitives --project <PROJECT_ID> [--category swarm2]
agent-swarm design instantiate-primitive --primitive swarm2.plan-package-canvas.v1 --project <PROJECT_ID> --name "Plan Package Canvas" --brief "..." [--theme industrial-light]
agent-swarm design show --design <DESIGN_ID> --project <PROJECT_ID>
agent-swarm design update --design <DESIGN_ID> --expected-version <V> --project <PROJECT_ID> [--name NAME] [--description DESC]
agent-swarm design archive --design <DESIGN_ID> --expected-version <V> --project <PROJECT_ID>
agent-swarm design destroy --design <DESIGN_ID> --expected-version <V> --project <PROJECT_ID> [--expected-vxg-version V] [--force]

# Content read operations
agent-swarm design read --design <DESIGN_ID> --project <PROJECT_ID> [--object OBJ_ID] [--depth N]
agent-swarm design read --ref <CAS_REF> [--object OBJ_ID] [--depth N]
agent-swarm design search --design <DESIGN_ID> --project <PROJECT_ID> [--name REGEX] [--type TYPE] [--reusable] [--depth N]
agent-swarm design variables --design <DESIGN_ID> --project <PROJECT_ID>

# Content mutation operations
agent-swarm design write --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --project <PROJECT_ID> [--patch JSON | --file PATH]
agent-swarm design insert --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --parent <PARENT_ID> --node <NODE_JSON> --project <PROJECT_ID> [--index N]
agent-swarm design copy --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --source <SRC_ID> --parent <PARENT_ID> --project <PROJECT_ID> [--index N]
agent-swarm design move --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --node <NODE_ID> --parent <NEW_PARENT_ID> --project <PROJECT_ID> [--index N]
agent-swarm design remove --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --node <NODE_ID> --project <PROJECT_ID>
agent-swarm design replace --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --node <NODE_ID> --replacement <REPLACEMENT_JSON> --project <PROJECT_ID>
agent-swarm design variables set --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --name <VAR_NAME> --type <TYPE> --value <VALUE> --project <PROJECT_ID> [--theme THEME]
agent-swarm design batch --design <DESIGN_ID> --expected-version <V> --base <BASE_REF> --project <PROJECT_ID> --operations-file edits.json
agent-swarm design write-html --name "Fresh Board" --project <PROJECT_ID> --html-file fragment.html [--mode new-design|replace-design] [--design <DESIGN_ID>] [--expected-version <V>]

# Import / Export
agent-swarm design import --file <PATH.pen> --project <PROJECT_ID> [--design DESIGN_ID] [--expected-version V] [--vxg-node NODE_REF] [--expected-vxg-version V]
agent-swarm design export --design <DESIGN_ID> --project <PROJECT_ID> [--object OBJ_ID] --output <PATH> [--export-format pen]
agent-swarm design export --vxg-node <NODE_REF> --output <PATH>
agent-swarm design export --ref <CAS_REF> --output <PATH>

# Rendering
agent-swarm design screenshot --design <DESIGN_ID> --project <PROJECT_ID> [--object OBJ_ID] [--scale 2.0] [--image-format png] [--format json]
agent-swarm design validate --design <DESIGN_ID> --project <PROJECT_ID> [--profile paper-parity]
agent-swarm design lint --design <DESIGN_ID> --project <PROJECT_ID> --profile paper-parity
agent-swarm design snapshot-layout --design <DESIGN_ID> --project <PROJECT_ID> [--object OBJ_ID] [--problems-only]
agent-swarm design style-inventory --design <DESIGN_ID> --project <PROJECT_ID>

# VXG lifecycle
agent-swarm design link --design <DESIGN_ID> --expected-version <V> --expected-vxg-version <V> --vxg-node <NODE_REF> --project <PROJECT_ID> [--pen-object OBJ_ID]
agent-swarm design unlink --design <DESIGN_ID> --expected-version <V> --expected-vxg-version <V> --vxg-node <NODE_REF> --project <PROJECT_ID>
agent-swarm design context --vxg-node <NODE_REF> --project <PROJECT_ID> [--pen-object OBJ_ID]
agent-swarm design promote --design <DESIGN_ID> --expected-version <V> --expected-vxg-version <V> --vxg-node <NODE_REF> --component-ref <PREVIEW_URL> --project <PROJECT_ID>

# Version control
agent-swarm design history [--design DESIGN_ID | --vxg-node NODE_REF] --project <PROJECT_ID> [--limit 20]
agent-swarm design diff --from <CAS_REF_A> --to <CAS_REF_B>
agent-swarm design restore [--design DESIGN_ID | --vxg-node NODE_REF] --expected-version <V> --ref <CAS_REF> --project <PROJECT_ID>
```

## Pencil MCP Interop

Both the swarmnet Design Registry and the Pencil MCP work on the same `.pen` document format with no translation. Interop workflow:

### Export from Pencil to swarmnet

```text
1. Use Pencil MCP batch_get to read node trees from a .pen file
2. Use Pencil MCP export_nodes to export specific nodes to a .pen file
3. Use `agent-swarm design import --file <exported.pen> --project <PROJECT_ID>` to ingest into Design Registry
4. The import stores the document as a CAS artifact and creates a design entry
```

### Import from swarmnet to Pencil

```text
1. Use `agent-swarm design export --design <ID> --project <PROJECT_ID> --output <path.pen>` to export
2. Open the exported .pen file in Pencil via Pencil MCP open_document
3. Use Pencil MCP batch_get to inspect the contents
```

### Pencil MCP Tools Reference

```text
batch_get         — Query nodes by pattern or ID (read .pen contents)
batch_design      — Bulk operations on .pen nodes
export_nodes      — Export specific nodes to .pen files
get_screenshot    — Skia-rendered screenshot (canonical reference for fidelity)
snapshot_layout   — Layout introspection
get_variables     — Read theme/variables
set_variables     — Update variables
find_empty_space  — Layout helper
open_document     — Open/create .pen files in Pencil
get_editor_state  — Get current Pencil editor state
```

## VXG Design Lifecycle

The VXG node carries `design_ref` alongside `component_ref` and `implementation_ref`:

```text
VxgNode {
    design_ref: Option<CasRef>,        // .pen document snapshot
    component_ref: Option<CasRef>,     // prototype preview surface
    component_entry: Option<String>,   // renderer entry hint
    implementation_ref: Option<String>, // production binding
}
```

### Role in the Prototype Pipeline

SwarmCanvas designs are the VISUAL BLUEPRINT for VXG prototype development. Understanding this relationship is critical:

- **SwarmCanvas** manages `.pen` files — these are HTML/CSS design documents rendered by render-kit. They define what a component SHOULD look like.
- **VXG** manages prototype components — these are real TypeScript/React (or other language) components rendered by the VXG preview pipeline. They are the working implementation.
- **`design.link`** connects a SwarmCanvas design to a VXG node. This does NOT make the design render inside VXG preview. It creates a reference link so agents can access the design spec during prototyping.

**During prototype development, agents use SwarmCanvas as their reference in TWO ways:**

**Visual reference** — render the design as an image:
```bash
# Render the design blueprint (ground truth screenshot)
agent-swarm design screenshot --design <DESIGN_ID> --scale 1 --image-format png
```

**Code reference** — read the design structure from the SwarmCanvas registry for exact CSS values:
```bash
# Read the design tree from the registry (canonical CAS-backed copy)
agent-swarm design read --design <DESIGN_ID> --depth 3

# OR via MCP:
# design_read(designId="<DESIGN_ID>", depth=3)

# Returns: exact fontFamily, fontSize, fontWeight, fill colors (hex+opacity),
# padding, gap, cornerRadius, gradients, layout direction, dimensions
#
# Do NOT use Pencil MCP batch_get against the original source .pen file —
# the SwarmCanvas registry is the canonical copy that design_ref points to.
```

**CRITICAL: Do NOT build prototypes from screenshots alone.** Screenshots show what it looks like; the `.pen` structure tells you the exact values to use. Read the design code to extract:
- Font families + sizes + weights + line heights + letter spacing
- Colors with exact hex values and opacity (e.g., `#FFFFFF66`, `#00E8C6B3`)
- Padding, gap, margins as exact pixel values
- Corner radius, border thickness, border colors
- Gradient definitions (type, colors, positions, center points)
- Layout direction (vertical/horizontal), alignment, justify

Then compare the prototype against the design screenshot:
```bash
# Compare against the VXG prototype preview
agent-swarm vxg dev start --node <NODE_KEY> --target component
agent-swarm vxg dev capture --session <SESSION_ID> --kind screenshot
```

The `design_screenshot` output is the canonical visual reference. The `design_read` output is the canonical code reference. Use both when building prototypes.

### Three-phase lifecycle

```text
DESIGN → PROTOTYPE → PRODUCTION

1. design.create + design.write → design.link (sets design_ref on VXG node)
2. design.promote (sets component_ref on VXG node for prototype rendering)
3. vxg node update --implementation-ref (sets production binding)
```

### Linking workflow

```bash
# Create a design
agent-swarm design create --name "Board Home Page" --project swarm2
# Returns: design_id, version, snapshot_ref

# Write content to the design
agent-swarm design write --design <DESIGN_ID> --expected-version 1 --base <SNAPSHOT_REF> --file ./my-design.pen --project swarm2

# Link the design to a VXG node
agent-swarm design link --design <DESIGN_ID> --expected-version 2 --expected-vxg-version <VXG_V> --vxg-node <NODE_REF> --project swarm2

# Check the link from VXG side
agent-swarm design context --vxg-node <NODE_REF> --project swarm2
```

## OCC (Optimistic Concurrency Control)

All mutation operations require `--expected-version` to prevent lost updates:

1. Read current state to get the version
2. Submit mutation with `--expected-version`
3. On version conflict, re-read and retry

For operations that touch both design and VXG state (link, unlink, promote, destroy), both `--expected-version` (design) and `--expected-vxg-version` (VXG graph) are required.

## Canvas Low-Level Operations

The canvas methods operate on raw delta streams:

```text
canvas.getSnapshot    — Replay deltas + stored snapshots for a canvasId
canvas.getDeltasSince — Get deltas after a version for incremental sync
canvas.applyDeltas    — Append a delta event, returns next version
```

These are bridge-only and used internally by the canvas view. Most agents should use the higher-level `design.*` surface instead.

Canvas methods are accessible via both CLI and MCP:

```bash
agent-swarm canvas get-snapshot [--canvas-id <ID>]
agent-swarm canvas get-deltas [--canvas-id <ID>] [--since-version <V>]
agent-swarm canvas apply-delta --canvas-id <ID> --delta <JSON>
```

MCP tool names: `canvas_get_snapshot`, `canvas_get_deltas_since`, `canvas_apply_deltas`.

Live subscription channel: `canvas:<canvasId>`

## Important Notes

- All `design.*` and `canvas.*` methods are available via **both CLI and MCP**; for canvas authoring/editing, use MCP first when available.
- CLI: `agent-swarm design *` and `agent-swarm canvas *`
- MCP tool names: `design_create`, `design_list`, `design_list_primitives`, `design_instantiate_primitive`, `design_write_html`, `design_batch`, `design_validate`, `design_lint`, `design_snapshot_layout`, `design_style_inventory`, `design_screenshot`, `design_link`, `canvas_get_snapshot`, `canvas_apply_deltas`, etc.
- MCP transport: rmcp SDK via `agent-swarm mcp stdio` (configured in `.mcp.json` for Claude Code, `.codex/config.toml` for Codex)
- MCP server mode can be gateway-backed or direct-store depending on configuration. Confirm the mode before diagnosing data visibility. Do not run direct-store MCP and swarmd against the same data dir at the same time.
- Prerequisites: build the current binary with `cargo build --release --bin swarmd --bin agent-swarm` when validating repo changes.
- `.pen` is JSON — human-readable, git-diffable, version-controllable
- The Pencil MCP `get_screenshot` is the canonical reference for fidelity comparison
- `design.screenshot` uses swarm-render-kit (agent-side rendering, not Pencil)
- For VXG graph operations, also load `vxg-project-ops`
- For VXG testing workflows, also load `vxg-testing`

## Common Failure Modes

- Calling a design/canvas MCP tool that doesn't exist — verify the exact tool name (e.g., `design_create` not `design.create`)
- Forgetting `--expected-version` on mutations → stale version error
- Forgetting `--expected-vxg-version` on link/unlink/promote → VXG version conflict
- Using `--design` and `--vxg-node` simultaneously when they are mutually exclusive
- Expecting `design.screenshot` to match Pencil fidelity exactly — it uses swarm-render-kit, not Skia
- Importing a non-.pen file — the importer expects valid .pen JSON
- Forgetting `projectId` / `--project` — designs land in default workspace scope and may be invisible to the web app

## Deep-Dive Files

```text
swarmd/src/method_registrations/design.rs            — Design method registration
swarmd/src/method_registrations/design/handlers.rs   — Design bridge handlers
swarmd/src/method_registrations/canvas.rs            — Canvas method registration + handlers
crates/swarm-cli/src/commands/design.rs              — CLI command definitions
crates/swarm-kernel/src/vxg/canvas.rs                — Canvas kernel types
```
