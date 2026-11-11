---
name: vxg-project-ops
description: VXG graph, feature-page discovery, design_ref linkage, implementation binding, preview, and browser-validation operations playbook for swarmd bridge RPC, MCP, and agent-swarm CLI. Use when creating, mutating, resolving, linking SwarmCanvas designs, binding implementation_ref, previewing via agent_url, filtering pages by feature, translating human VGX links, or diagnosing VXG state and dev sessions. For SwarmCanvas authoring/editing itself, load swarm-design-ops and prefer MCP.
---

# VXG Project Ops

Use this skill when the task involves VXG graph work, project-scoped persistence, or the native VXG preview route.

## Source of Truth Model

- VXG state is event-sourced in `swarmd` storage.
- Canonical VXG scope is `vxg/<vxg_id>`.
- For project-scoped VXG, use `vxg_id == project_id`.
- UI scope derivation falls back as:
  - `scopeId = zoneId ?? projectId ?? "system"`
  - `vxgId = scopeId`
- Bridge/UI/CLI reads return service-level projection shapes from `crates/swarm-services/src/vxg/primitives.rs`, not bare kernel structs.
- VXG does not author `.pen` design geometry directly. SwarmCanvas designs are authored through the Design Registry and linked into VXG as `design_ref`.

## Related Skills — Where Version Control and Verification Live Now

VXG does **not** own its own history/checkpoints or its own testing surface anymore. Two shared-L1 surfaces took over those responsibilities — point to them when the task is about either.

- **Shared VCS** (`vcs-ops` skill): version history, branches, tags, checkpoints, merges, rollback/restore, ref promotion for any `vxg/<vxg_id>` scope. Prefer `agent-swarm vcs ... --scope vxg/<id>` or `vcs_*` MCP tools over the legacy `vxg.history` / `vxg_checkpoint_*` wrappers. Most `vcs_*` methods require `SWARMNET_VCS_SHARED_CORE=1` on the swarmd process; `vcs_status` works without it.
- **Shared Verify / UVP** (`verify-ops` skill): checklist verdicts, pass lifecycle, automated runs, evidence bundles, greenlight projections, catalog, schedules, templates. VXG is the **first adapter** consuming shared verify core — author under `test-packages/` and drive via `verify_*` MCP tools / `agent-swarm verify ...` CLI. The `vxg test ...` command remains as a compatibility wrapper during migration; do not grow unique semantics in it.

If the task asks "what's the VXG history?", "how do I checkpoint this VXG?", or "is this VXG graph verified?" — jump to those skills first and return here only for VXG-local graph mutation, implementation binding, or preview/browser-runtime concerns.

## SwarmCanvas Design Linkage

For `.pen` blueprints, load `swarm-design-ops`. Agent-driven create/edit should use Agent Swarm MCP when available:

```text
design_write_html                         # Paper-like HTML fragment -> canonical .pen
design_list_primitives / design_instantiate_primitive
design_batch                              # structured object operations, expectedVersion
design_link / design_context / design_screenshot
```

Use CLI only as fallback/control validation for design export, lint, layout, style inventory, and screenshots.

Do not hand-edit `.pen` JSON for normal authoring, do not build VXG prototypes from screenshots alone, and do not render `.pen` HTML inside VXG preview. The link between surfaces is:

```text
SwarmCanvas design_ref (.pen snapshot) -> VXG component_ref (prototype route) -> implementation_ref (production binding)
```

`design_ref` is the visual/design source of truth. `component_ref` is the prototype render source. `implementation_ref` is added only after a real production surface exists.

## Critical Auth + Role Rules

- UI and CLI both mutate VXG through the same gateway-backed bridge RPC path.
- Local owner-local UI/CLI auth works only against `swarmd --role validator`.
- If you point the local app or CLI at `swarmd --role core`, owner-local bootstrap is rejected with `owner_local_unavailable`. That is expected.
- Use paired-device auth for remote or non-T0 usage.

If a user says "VXG works in tests but not in my local app/CLI," verify daemon role and auth mode before diagnosing VXG itself.

## Mandatory Preflight

Before claiming root cause, report:

- `git rev-parse --short HEAD`
- running `swarmd` pid and full command
- gateway endpoint
- swarmd role
- swarmd data dir
- auth path in use (`owner-local`, `paired-device`, `permissive-auth`)
- exact plane tested (`bridge` for UI/CLI)
- active `vxg_id` (`agent-swarm vxg use` context or explicit `--vxg`)

## Recommended Deterministic Setups

### Normal VXG/design feature work

```bash
./target/release/swarmd --role validator
```

For VXG graph changes, SwarmCanvas design linkage, shared VCS checkpoints, or anything the human app should see, use the real release swarmd backend database: the normal operator database that contains the project, usually including `swarm2`. Do not start a new `.tmp/*`, `/tmp/*`, fixture, or ad hoc `--data-dir` database for feature work.

If the operator's release backend uses an explicit data dir, use that exact configured production path. Do not invent one. Before mutating, prove you are on the real backend by checking the running swarmd command/data dir and confirming the target project/VXG exists there.

### Isolated tests only

Temporary databases are allowed only for deliberate isolated tests, destructive auth-negative checks, or reproducible fixtures that must not touch production graph/design state. When using one, name it as a test database in notes/evidence and do not claim it validates the human production VXG/design backend.

### Deliberate non-T0 / auth-negative testing

```bash
cargo run --bin swarmd -- --role core --data-dir "$PWD/.tmp/swarmd-data"
```

## Port And Origin Model

Do not conflate the human web app port with the VXG preview route origin.

- `swarmd` external API gateway:
  - default local origin is `http://127.0.0.1:9847`
  - VXG `agent_url`, `manifest_url`, `state_url`, `events_url`, `capture_base_url`, and `health_url` are served from this gateway origin
  - Port 9847 = swarmd gateway (agent view, VXG preview routes, design API, render-kit management)
- Next.js human app:
  - common local dev origin is `http://127.0.0.1:3000`
  - the current local proof stack will also commonly land on `3001`, `3002`, or `3003` when `3000` is occupied
  - this is where the human-facing app shell lives
  - Port 3000 = Next.js web app (human view, Design Canvas at `/ui/design-canvas/`)
- Render-kit (design rendering):
  - Ephemeral port = render-kit (Bun server, spawned by swarmd, serves `/render/design`)
  - The web app's Design Canvas loads design renders via `prepareOnly` -> render-kit URL -> iframe
  - swarmd pre-warms the render-kit at startup (no cold-start timeout on first screenshot)
- component preview assets:
  - often originate from the Next app/dev server
  - but VXG preview routes are still opened through the swarmd gateway origin, which proxies or embeds those assets as needed

Current local proof behavior:

- preview asset discovery prefers `SWARM_UI_BASE_URL` when explicitly set
- otherwise it checks `SWARM_UI_E2E_WEB_PORT`
- otherwise it falls back across common local Next.js dev ports `3000-3003`
- operator implication:
  - do not assume only `3000` is valid during local proof
  - if you need deterministic pinning, set `SWARM_UI_BASE_URL`

Operator rule:

- when a command returns `agent_url: /vxg/dev/...`, open it against the swarmd gateway base, not the Next app base
- example:
  - correct: `http://127.0.0.1:9847/vxg/dev/...`
  - usually wrong for direct `agent_url`: `http://127.0.0.1:3000/vxg/dev/...`

## Current Surface Areas

### Bridge RPC methods

- Graph root: `vxg.createGraph`, `vxg.getGraph`, `vxg.getSnapshot`, `vxg.listGraphs`, `vxg.updateGraph`, `vxg.deleteGraph`
- Graph mutations: `vxg.createNode`, `vxg.updateNode`, `vxg.deleteNode`, `vxg.listNodes`, `vxg.createEdge`, `vxg.updateEdge`, `vxg.deleteEdge`, `vxg.createBinding`, `vxg.updateBinding`, `vxg.connectBinding`, `vxg.deleteBinding`, `vxg.createAction`, `vxg.updateAction`, `vxg.deleteAction`, `vxg.createRef`, `vxg.updateRef`, `vxg.deleteRef`
- Graph utilities: `vxg.applyPatch`, `vxg.query`, `vxg.analyze`, `vxg.validate`, `vxg.autoLayout`, `vxg.canvasApplyLayout`, `vxg.traverse`, `vxg.findPath`, `vxg.export`
- Work-unit integration: `vxg.linkWorkUnit`, `vxg.generateWorkUnits`, `vxg.syncCompleteness`
- Native preview route: `vxg.resolveTarget`, `vxg.devStart`, `vxg.devShow`, `vxg.devList`, `vxg.devState`, `vxg.devStop`, `vxg.previewStart`, `vxg.previewStop`

Live subscription channel:

- `vxg:<vxg_id>`

### CLI surface

`agent-swarm` exposes the common operator paths directly and falls back to `vxg.getSnapshot` for some list/read flows:

```bash
agent-swarm vxg use <VXG_ID>
agent-swarm vxg create --name "My Graph" [--description <DESC>] [--vxg <VXG_ID>]
agent-swarm vxg show [<VXG_ID>]
agent-swarm vxg node add|update|delete|list|get
agent-swarm vxg edge add|update|delete|list
agent-swarm vxg binding add|connect|update|delete|list
agent-swarm vxg action add|delete|list
agent-swarm vxg ref add|delete|list
agent-swarm vxg query '<DSL>'
agent-swarm vxg analyze
agent-swarm vxg validate
agent-swarm vxg layout
agent-swarm vxg resolve target
agent-swarm vxg shell show|mode|page|layout|style
agent-swarm vxg link-work --node <NODE_REF> --work-unit <WORK_UNIT_ID>
agent-swarm vxg generate-work [--node-types <CSV>] [--dry-run]
agent-swarm vxg sync-completeness
agent-swarm vxg export --format <json|mermaid>
agent-swarm vxg dev start|show|list|state|url|logs|inspect|watch|capture|stop
agent-swarm vxg preview [flags]
agent-swarm vxg preview --stop
```

## Feature-First Page Discovery

`vxg query` now exposes feature-aware collections. Use them whenever the user
starts from a feature key, asks to build out every page in a feature, or gives a
human VGX feature-browser link. Do not manually infer shell/page ids from raw
nodes and edges when `feature_pages` can return the native preview targets.

```bash
agent-swarm vxg query 'features where key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
```

`feature_pages` normalizes feature grouping from:

- active `feature.meta.pageVariants`;
- `feature.meta.feature.pages`;
- explicit outgoing `contains` edges from a feature to page nodes when the edge
  role is a feature-page role such as `chat-app-page`, `console-feature-page`,
  `feature-page`, or another documented `*-feature-page` role.

Treat the `feature_pages` result as the authoritative inventory for
feature-wide buildout and review. Each row should give the agent enough stable
data to preview the page without graph spelunking:

```text
feature_key, feature_node_id,
page_key, page_node_id, page_name,
source, native_shell_key, native_page_id, preview_target,
chat_view and any feature/page metadata that exists
```

For a feature-wide task, query once, make a checklist from every returned row,
and preview or verify every page. Missing a row is a real coverage gap.

Start native preview from the normalized row, not from a guessed shell:

```bash
agent-swarm vxg dev start --vxg <VXG_ID> \
  --shell <native_shell_key> \
  --page <native_page_id> \
  --target shell \
  --viewing preview \
  --layout default \
  --style dark \
  --width 1680 \
  --height 1050 \
  --ui-mode immersive \
  --fit off \
  --fresh \
  --json
```

Open the returned `agent_url` on the swarmd gateway origin, normally
`http://127.0.0.1:9847/vxg/dev/<session-id>`.

## Human VGX Link Translation

When a user gives a human app link like `/ui/vxg-map/?project=...`, translate
it through `feature_pages` before starting native preview:

- `project` maps to `--vxg`.
- `shell`, `selectedFeatureId`, or a `feature-*` value maps to
  `feature_key`.
- `shellPage`, `page`, or a `page-*` value maps to `page_key` or
  `native_page_id`.
- `shellLayout`, `shellStyle`, `shellView`, and `previewTarget` map to native
  `--layout`, `--style`, `--viewing`, and `--target` when present.

Useful lookups:

```bash
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg <PROJECT> --json
agent-swarm vxg query 'feature_pages where page_key = "<PAGE_KEY>"' --vxg <PROJECT> --json
agent-swarm vxg query 'feature_pages where native_page_id = "<PAGE_ID>"' --vxg <PROJECT> --json
agent-swarm vxg query 'feature_pages where native_shell_key = "<SHELL_KEY>"' --vxg <PROJECT> --json
```

Example: a human route with
`project=swarm2&shell=feature-vgx-app&shellPage=page-vgx-features-layout`
translates by querying `feature_pages where feature_key = "feature-vgx-app"`
and selecting the row whose `page_key` is `page-vgx-features-layout`. Use that
row's `native_shell_key` and `native_page_id` for `vxg dev start`.

## Ideal VXG Workflow

1. Create or select the graph and define stable semantic targets.
2. If the work starts from a feature or should cover a whole feature, run
   `feature_pages where feature_key = "<FEATURE_KEY>"` and use the returned
   rows as the page checklist.
3. If a visual blueprint is needed, create/edit it through SwarmCanvas MCP (`design_write_html`, `design_instantiate_primitive`, `design_batch`) and link it to the node with `design_link`.
4. Write or update the test manifest for the target before doing major prototype work.
5. Ensure the prototype target fields exist on the node itself:
   - `component_ref` / `component_entry` for prototype rendering
   - semantic `key` for durable targeting
   - current CLI path:
     - `vxg node add|update --component-ref <PREVIEW_URL> --component-entry <ENTRY>`
     - use `vxg.applyPatch` only when you need bulk or scripted graph mutations
     - use `implementation_ref` only after a real production binding exists
6. Resolve the target before running anything live:
   - use `agent-swarm vxg resolve target ...` to confirm shell/page/target selection, bindings, actions, references, and any existing `implementation_ref`
   - page targets can resolve either from standalone graph page/screen nodes or from page ids declared inside shell metadata
7. Compile the manifest early through `vxg-testing` so resolution and clause errors fail before deeper design work.
8. Start a preview session and iterate on the prototype:
   - `agent-swarm vxg dev start ...`
   - inspect with `vxg dev state`, `inspect`, `logs`, `watch`, and `capture`
9. If you need real browser truth, open the preview route with browser automation tooling using the returned `agent_url`.
   Prefer `playwright-interactive`; Claude Chrome browser MCP is also acceptable; use `agent-browser` when its CLI flow is a better fit.
10. Re-run preview tests until the design is green.
11. Once a production surface exists, bind `implementation_ref` on the same VXG node.
12. Hand off to `vxg-testing` for implementation coverage and greenlight using the same semantic target.
13. Keep preview and implementation tied to the same node so drift is visible instead of hidden.

Stage rule:

- while the operator is still iterating on VXG design, preview is the whole workflow
- do not treat `implementation_ref` as required authoring metadata during style/layout/component refinement
- only bind `implementation_ref` after a real production surface exists or when the task is explicitly continuity/prod-proof work

## Design-Backed Feature Shell Contract

Design-backed VXG features are page/shell features, not raw component callouts.
The invalid topology is:

```text
feature -> design-backed component
```

The required topology is:

```text
feature -> page/shell -> slotted design-backed component
```

## Shell Config V2 And Dynamic Variations

For new shell work, `meta.shell.version = 2` is the canonical composition model.
V2 is generic project infrastructure, not a SwarmNet sidebar contract.

The intended shape is:

```text
top-level page shell
  -> slot
      -> nested shell
          -> fixed subslot(s)
          -> dynamic variation subslot(s)
              -> resolved component or nested shell
```

Core V2 fields:

```text
meta.shell.version = 2
meta.shell.variationGroups
meta.shell.pages[*].slotAssignments[*].variationGroupId
```

Every assigned target may be either a leaf component rendered through
`component_ref` / `component_entry`, or another shell node rendered recursively
through the same shared shell renderer. Recursion must be bounded, cycle
checked, and style/layout/token context must be inherited.

Variation resolution should stay generic:

1. explicit session or route `slotVariations` override
2. selected node/page or interaction match
3. shell/page `mode` match
4. variation group default
5. deterministic first valid variation as validation fallback

Runtime context should be modeled as shell data, not component-specific state:

```ts
{
  shellId,
  pageId,
  layoutModeId,
  styleModeId,
  previewTarget,
  selectedNodeId,
  selectedPageId,
  interactionAction,
  traceEvent,
  mode,
  slotVariations,
  payload
}
```

Leaf preview iframe URLs should receive durable render state such as `mode`,
`slotVariations`, style, layout, and tokens. Do not propagate passive telemetry
such as `animation.end`, `transition.end`, or ordinary `traceEvent` values into
leaf iframe URLs; that causes unnecessary remounts and hydration races.

Validation for any V2 shell change must prove the same nested shell tree and
active variations in both:

```text
/ui/vxg-map/?project=<project>&shell=<page-node>&view=prototype
/vxg/dev/<session-id>
```

Use `vxg dev state` to verify selected context, `mode`, and `slot_variations`
for native preview sessions, and use browser DOM assertions to verify fixed
subslots stay mounted while dynamic variation subslots switch.

`vxg validate` must fail when a `feature` directly `contains` a design-backed
preview `component`. A design-backed preview component is any component with
`design_ref` plus `component_ref`, `component_entry`, `meta.componentRef`, or
`meta.component_ref`. Valid graph authoring must add an intervening node with
`node_type = page | shell` or shell metadata and then mount the component into a
shell slot, usually through a `contains` edge whose metadata names the slot.

A selected design-backed component showing `480 x 320` is a failed geometry
contract, not a valid proof. Design-backed nodes must carry positive
`prototypeWidth` / `prototypeHeight` source dimensions from the canonical
SwarmCanvas render unless an explicit shell slot placement or `contains` edge
`childLayout` intentionally overrides the rendered frame.

For tldraw/canvas-like components inside octagon/fullscreen shell content, do
not fit-scale the shell preview as proof. Preserve the full native shell/canvas
surface and let the component handle pan/zoom. The relevant edge metadata may
include `fitMode: "off"`, `viewportMode: "native-tldraw"`, and
`allowCanvasPanZoom: true`.

Pixel parity against the linked SwarmCanvas render is mandatory for every
design-backed VXG feature. Browser evidence must prove both the human VXG map
route and the native VXG preview route, including shell/page/slot structure,
iframe/component refs derived from `component_ref`, and no fallback `480 x 320`
geometry unless the component is intentionally unbacked by design/prototype
dimensions.

Current continuity-proof surface:

- if a task explicitly asks for browser-visible implementation continuity proof, use the frontend-owned implementation proof route:
  - `/ui/vxg-implementation/`
- supply the relevant `vxg`, `shellId`, `pageId`, `layoutModeId`, `styleModeId`, `previewTarget`, and `implementationRef` query params
- do not use that proof route as justification for forcing `implementation_ref` into ordinary design-stage authoring

## What Preview Is For

`vxg dev` is not just a convenience viewer. It exists to support the design-first testing loop.

Default operator model:

1. manifest defines intended behavior, evidence, and review rubric
2. preview renders the current prototype target
3. browser automation, preferably `playwright-interactive`, checks the actual rendered experience through `agent_url`
   Claude Chrome browser MCP is also acceptable when available in that environment.
4. `vxg-testing` decides whether the design is good enough to hand off

If you are designing VXG screens without a manifest and without rerunning preview tests, you are not using the intended workflow.

Corollary:

- if a design-stage prompt or agent starts asking for `implementation_ref` before production handoff, that is usually a workflow mistake
- preview/design work should be able to proceed cleanly with only `component_ref` / `component_entry`

## Design Canvas Preview

VXG nodes can have `design_ref` linking to .pen designs stored in the Design Registry.

### Viewing designs in the web app

- The web app at `http://127.0.0.1:3000/ui/design-canvas/?project=<PROJECT_ID>` shows project designs with render preview
- `design.screenshot` with `prepareOnly: true` returns a render-kit URL for iframe embedding
- The web app calls `design.list({projectId})` to populate the sidebar, then loads selected designs via render-kit iframe

### Render-kit pre-warming

- swarmd pre-warms the render-kit at startup (no cold-start timeout on first screenshot)
- The render-kit is a Bun HTTP server on an ephemeral port, spawned by swarmd and auto-discovered via descriptor file

### Browser verification

- Use `agent-browser` skill to verify the human view (browser automation against the Next.js web app)
- For VXG preview routes, use `agent_url` against the swarmd gateway (port 9847)
- For Design Canvas, open `http://127.0.0.1:3000/ui/design-canvas/?project=<PROJECT_ID>` against the Next.js app (port 3000)

### Dev start with project scope

When starting VXG dev sessions for project-scoped graphs, pass the project ID as the VXG ID:

```bash
agent-swarm vxg dev start --vxg <PROJECT_ID> --node <NODE_ID_OR_KEY> --target component
```

## Core Graph Shapes

These are the service-level shapes agents actually read from snapshot/query responses.

### Node

```text
id, key, node_type, name,
design_ref, component_ref, component_entry, implementation_ref,
meta { work_unit_ids, instance_of, props_override, extra },
completeness, labels,
created_at, updated_at, created_by
```

- `design_ref` is a `CasRef` pointing at a `.pen` design document snapshot (added by SwarmCanvas)
- `node_type` conventions used in this layer: `screen`, `region`, `shell`, `flow`, `component`, `instance`, `modal`, `state`
- `completeness` is a `u8` in `[0, 100]`
- `key` is unique within the graph when present

### Three-phase component lifecycle

```text
DESIGN (design_ref)         PROTOTYPE (component_ref)      PRODUCTION (implementation_ref)
.pen document in CAS        Source code / preview URL       Anchored file path / route id
Stack-agnostic (universal)  Framework-specific              Codebase-specific
FAST iteration (JSON)       MEDIUM iteration (code+build)   SLOW iteration (CI/CD)
```

- `design_ref` links a `.pen` design snapshot to the node via the Design Registry
- Prefer `design_link` / `design_unlink` MCP to create or remove the linkage; CLI is fallback.
- Use `design_promote` / `agent-swarm design promote` only when promoting a design component into a prototype route is explicitly the intended operation.
- For design operations, also load `swarm-design-ops`

### Edge

```text
id, edge_type, from, to, label, meta, created_at, created_by
```

- Structural `edge_type` values are only `contains`, `sequences`, `inherits`, `variants`
- `from` and `to` resolve to node ids in the projection

### Binding

```text
id, node, path, mock, mock_ref, source, status, notes, created_at, updated_at
```

- `status` is `Mock` or `Connected`
- Large mock payloads go in `mock_ref`, not inline `mock`

### Action

```text
id, node, action_type, target, handler,
effects[] (Navigate, OpenNode, SetBinding, EmitAnalytics, CallService),
navigates_to, triggers_node, updates_bindings,
meta, created_at, created_by
```

- `navigates_to`, `triggers_node`, and `updates_bindings` are convenience fields derived from `effects`

### Reference

```text
id, node, ref_type, source { kind, value }, notes, created_at, created_by
```

- `node = None` means a graph-level reference
- `ReferenceSource.kind` is `Url`, `Cas`, `Text`, or `SourceRef`

### NodeRef mutation inputs

All mutation paths accept `NodeRef`:

```text
NodeRef::Id  { id }
NodeRef::Key { key }
```

Prefer keys for operator-authored patches; prefer ids when replay/debugging exact persisted state.

### Page targets

Preview/runtime page selection is not limited to dedicated page nodes.

- a page target may resolve from a graph node with type `screen` or `page`
- a page target may also resolve from a shell metadata page id declared under `meta.extra.shell.pages`
- in the second case, the runtime target carries the resolved `page_id` plus the owning shell as the preview anchor

Operator implication:

- a manifest clause like `open page focus-review` is valid when `focus-review` is a shell page id, even if there is no standalone `focus-review` node
- use `vxg resolve target` or `vxg dev start` to confirm the shell/page combination actually resolves the way you expect

## Prototype / Production Binding Model

The same VXG target should usually carry both prototype and production continuity data.

```text
component_ref + component_entry  -> prototype renderer input
implementation_ref               -> production implementation binding
```

- `component_ref` points at the prototype preview surface for that node
- in normal repo-local design work, `component_ref` is usually a preview URL such as `/preview/?component=MyCard`
- in more portable flows, `component_ref` may instead point at a durable prototype artifact route or bundle
- `component_entry` is the renderer entry hint for that prototype
- `implementation_ref` is the stable production binding used by implementation adapters and by VXG test fingerprints
- `implementation_ref` semantics are adapter-defined:
  - route id
  - component/module id
  - app-owned logical identifier

Operator pattern:

```bash
agent-swarm vxg node add --type component --name "My Card" --key my-card --component-ref "/preview/?component=MyCard" --component-entry MyCard
agent-swarm vxg node update --key my-card --component-ref "/preview/?component=MyCard&theme=dark"
agent-swarm vxg node update --key my-card --implementation-ref <IMPLEMENTATION_REF>
agent-swarm vxg query 'nodes where implementationRef is not null'
```

Use the same semantic node for both prototype and production. Do not create a parallel "production copy" node just to hold `implementation_ref`; that destroys handoff continuity.

But do not over-apply that rule:

- using the same semantic node for continuity does not mean you must set `implementation_ref` immediately
- during prototype/design iteration, it is correct for the node to have only prototype bindings

### External Project Portability

VXG bindings are meant to be portable across projects, but the portability boundary is the
reference + adapter layer, not the graph itself.

Operating model:

- VXG graph state stores semantic structure plus bindings
- VXG graph state does **not** store raw application source code as the primary artifact
- `component_ref` should point at a resolvable prototype preview surface
  - for normal Swarmnet design work that is usually a preview URL such as `/preview/?component=MyCard`
  - for more portable flows it can be a durable prototype artifact route or bundle
- `component_entry` identifies the entry inside that prototype surface when needed
- `implementation_ref` should point at a stable production binding
  - route id
  - component/module id
  - app-owned logical id

What this means for another project, for example Alma:

- Alma component files should live with Alma, not in this Swarmnet repo, unless Alma is actually
  implemented here
- VXG should carry references to Alma-owned prototype artifacts and Alma-owned implementation ids
- previews/rendering only work when an adapter can resolve those references into a live renderable
  surface

Current practical status:

- `implementation_ref` is the more portable piece today because it is already an adapter-defined
  stable identifier
- `component_ref` is portable in theory, but full generic cross-project CAS-backed prototype
  rendering still depends on having a preview adapter/bundle flow that knows how to materialize the
  artifact
- repo-local preview routes like `/preview/?component=...` are convenient for Swarmnet, but they
  are not the final cross-project portability model

Agent rule:

- do not assume a different project's prototype assets live in this repo
- do assume VXG needs a resolvable binding for both prototype and production surfaces
- when evaluating portability, ask:
  - where does the prototype artifact live?
  - how does the preview adapter resolve it?
  - what stable `implementation_ref` will the production adapter understand?

## Mutation Contract

### OCC

- Every service mutation accepts `expected_version: Option<u64>`
- If the supplied version is stale, the service returns `VxgError::VersionConflict { expected, actual }`
- Successful mutation responses return the new aggregate version
- Best practice:
  1. Read current state/version
  2. Submit the mutation with `expected_version`
  3. On conflict, re-read and retry against fresh state

### Idempotency

- Patch and work-unit flows use `request_id`
- `vxg.applyPatch` requires both `request_id` and `expected_version`
- Patch decisions store a stable digest over operations, so the same `request_id` replays the prior success and a mismatched body with the same id is rejected
- CLI-generated work-unit requests also synthesize request ids for safe retries

### `vxg.applyPatch`

`vxg.applyPatch` is the atomic batch route when you need multiple graph edits to succeed or fail together.

Request shape:

```text
request_id, expected_version, vxg_id, operations[]
```

Response shape:

```text
success, new_version, results[], conflicts?
```

Supported patch op families:

```text
node.create | node.update | node.delete
edge.create | edge.update | edge.delete
binding.create | binding.update | binding.delete
action.create | action.update | action.delete
reference.create | reference.update | reference.delete
```

## Validation Rules

- `key`: if present, must be non-empty and unique within the graph
- `node_type`: required, non-empty
- `name`: required, non-empty
- `completeness`: must be in `[0, 100]`
- `edge_type`: must be one of `contains`, `sequences`, `inherits`, `variants`
- Do not model navigation as an edge:
  - navigation belongs in `ActionEffect::Navigate` / `navigates_to`
- `path`: dot-separated, no leading/trailing dots, no empty segments, no whitespace
- `status=Connected` requires `source`
- `mock` and `mock_ref` are mutually exclusive
- Inline binding mocks must stay under `4KB`; otherwise use `mock_ref`
- `handler`: required, non-empty
- `EmitAnalytics.event`, `CallService.service`, and `CallService.method` must be non-empty
- `source.value`: required, non-empty
- URL references must start with `http://` or `https://` and include a non-empty host

## Error Types

Common VXG errors:

```text
EventStore(EventError)                # persistence failure
Encoding(String)                      # serialization / CAS / payload encoding failure
ValidationFailed(String)              # rejected valid-looking input
InvalidInput(String)                  # malformed request or mutually exclusive flags
QueryParseError { message, position } # DSL syntax error
QueryFieldError { collection, field } # unknown field for collection
QueryTypeMismatch { field, expected, got }
VersionConflict { expected, actual }  # OCC failure
GraphNotFound(String)
NodeNotFound(String)
EdgeNotFound(String)
BindingNotFound(String)
ActionNotFound(String)
ReferenceNotFound(String)
KeyConflict(String)
NotImplemented(String)
```

Treat `ValidationFailed` as a contract problem, not a transient daemon problem.

## Query DSL

Syntax:

```text
<collection> where <condition> [and|or <condition>]*
```

Collections:

```text
nodes | edges | bindings | actions | references | features | feature_pages
```

Operators:

```text
= != > >= < <= contains is null is not null
```

Field aliases:

- `nodes where type = "screen"` is canonicalized to `node_type`
- `actions where type = "transition"` is canonicalized to `action_type`
- `nodes where implementationRef is not null` is canonicalized to `implementation_ref`

Examples:

```bash
agent-swarm vxg query 'nodes where node_type = "screen" and completeness > 50'
agent-swarm vxg query 'edges where type = "sequences"'
agent-swarm vxg query 'bindings where status = "connected"'
agent-swarm vxg query 'actions where handler = "click"'
agent-swarm vxg query 'references where type = "design_token"'
agent-swarm vxg query 'nodes where implementationRef is not null'
agent-swarm vxg query 'features where key = "feature-chat-app"'
agent-swarm vxg query 'feature_pages where feature_key = "feature-chat-app"'
agent-swarm vxg query 'feature_pages where page_key = "page-chat-agent-inspect-layout"'
```

Notes:

- Query node references are key-first for equality checks on `node`, `from`, `to`, and `navigates_to`
- `feature_pages` is the preferred feature-to-page index for agent-native
  preview work; it returns normalized native shell/page ids from both metadata
  page variants and explicit feature-to-page edges.
- `contains` only works on string fields
- `is null` / `is not null` is the actual parser syntax; `is_null` is not accepted

## Native Preview Route

This is the agent-native route for rendering and interacting with VXG targets directly.

Lifecycle:

```text
dev_start -> VxgDevSession (running preview session)
          -> dev_state / capture / events / manifest / capabilities
dev_stop  -> terminal preview state
```

### CLI commands

```bash
agent-swarm vxg dev start [--vxg <ID>] [--node <NODE_ID>] [--shell <SHELL_ID>] [--page <PAGE_ID>] [--viewing <MODE>] [--layout <MODE_ID>] [--style <MODE_ID>] [--target <shell|page|component>] [--bundle <BUNDLE>] [--profile <PROFILE>] [--adapter <KIND>] [--fresh] [--width <PX>] [--height <PX>] [--ui-mode <debug|immersive>] [--fit <auto|off>]
agent-swarm vxg dev show --session <SESSION_ID>
agent-swarm vxg dev list [--vxg <VXG_ID>]
agent-swarm vxg dev state --session <SESSION_ID> [--shell <ID>] [--page <ID>] [--viewing <MODE>] [--layout <MODE_ID>] [--style <MODE_ID>] [--target <shell|page|component>] [--node <NODE_ID>] [--inspect-mode <interact|inspect>] [--width <PX>] [--height <PX>] [--ui-mode <debug|immersive>] [--fit <auto|off>]
agent-swarm vxg dev url --session <SESSION_ID>
agent-swarm vxg dev logs --session <SESSION_ID> [--stream <STREAM>]... [--follow]
agent-swarm vxg dev inspect --session <SESSION_ID> [--target <shell|page|component>] [--node <NODE_ID>] [--follow-selection]
agent-swarm vxg dev watch --session <SESSION_ID> [--stream <STREAM>]... [--follow]
agent-swarm vxg dev capture --session <SESSION_ID> --kind <screenshot|dom|a11y|layout>
agent-swarm vxg dev stop --session <SESSION_ID>
```

Compatibility wrapper:

```bash
agent-swarm vxg preview [--vxg <ID>] [--node <NODE_ID>] [--shell <SHELL_ID>] [--page <PAGE_ID>] [--viewing <MODE>] [--layout <MODE_ID>] [--style <MODE_ID>] [--target <shell|page|component>]
agent-swarm vxg preview --stop
```

The compatibility `preview` command is a wrapper over `vxg dev start` and `vxg dev stop`; it is not a separate session model.

### RPC methods

```text
vxg.resolveTarget  -> ResolvedTarget
vxg.devStart       -> VxgDevSession
vxg.devShow        -> VxgDevSession
vxg.devList        -> VxgDevSession[]
vxg.devState       -> VxgDevState
vxg.devStop        -> { success: bool }
vxg.previewStart   -> alias for vxg.devStart
vxg.previewStop    -> alias for vxg.devStop
```

### MCP tools

```text
vxg_dev_start
vxg_dev_show
vxg_dev_list
vxg_dev_state
vxg_dev_manifest
vxg_dev_capabilities
vxg_dev_stop
vxg_resolve_target
vxg_preview_start
vxg_preview_stop
```

### Session and target shapes

`VxgPreviewSession` is the internal lifecycle record:

```text
session_id, agent_id, vxg_id, status, port,
bundle_id, profile_id,
created_at, last_activity,
browser_heartbeat_at, browser_heartbeat_live, active_cli_leases, idle_deadline_at,
host_id, session_reuse_key, host_reuse_key,
adapter_kind, process_pid
```

`status`:

```text
Starting | Running | Stopped { reason }
```

`VxgDevSession` is the session contract returned to agents:

```text
session_id,
agent_url, manifest_url, state_url, events_url, capabilities_url, capture_base_url, health_url,
resolved_target_ref, host_reuse_key,
session_reuse, host_reuse
```

What the returned URLs are for:

- `agent_url`: stable rendered route for browser automation and human inspection
- `manifest_url`: resolved target manifest for debugging target resolution, bindings, and `implementation_ref`
- `state_url`: current preview state read/patch surface
- `events_url`: live event stream surface used by `logs` / `watch`
- `capabilities_url`: adapter capability readout
- `capture_base_url`: raw capture endpoint for screenshot/DOM/a11y/layout
- `health_url`: readiness/liveness probe

Reuse enums:

```text
session_reuse: Created | Reused
host_reuse: Created | Reused | Reassigned
```

`VxgDevState`:

```text
session_id, shell_id, page_id, viewing_mode, layout_mode_id, style_mode_id,
preview_target, node_id,
inspect_mode, viewport_width, viewport_height,
ui_mode, fit_mode
```

`preview_target` / state enums:

```text
preview_target: Shell | Page | Component
inspect_mode: Interact | Inspect
ui_mode: Debug | Immersive
fit_mode: Auto | Off
```

`VxgPreviewAdapterCapabilities`:

```text
interactive, selection_events, console_stream, network_stream, token_injection,
screenshot_capture, dom_capture, a11y_capture, layout_capture,
interaction_action_events
```

`ResolvedTarget`:

```text
resolved_target_ref,
shell { shell_id, name, viewing_mode, default_page_id, ... },
page { page_id, name, slot_assignments, default_layout_mode_id, default_style_mode_id, ... },
layout { layout_mode_id, label, ... },
style { style_mode_id, label, theme, tokens, ... },
target { preview_target, node_id, node_key, component_ref, component_entry, implementation_ref, ... },
bindings[], actions[], references[], token_map
```

### Event streams

Known stream names:

```text
session.runtime.stdout
session.runtime.stderr
session.browser.console
session.browser.error
session.network.error
preview.trace
preview.selection.changed
preview.interaction.action
preview.reload
binding.update
action.dispatch
state
host.adapter.boot
host.adapter.crash
host.adapter.idle_timeout
host.adapter.reuse
```

### Browser Automation Against `agent_url`

Use browser automation tooling when you need actual rendered browser truth instead of VXG-native captures alone.

Default browser-tool choice:

- prefer `playwright-interactive` for iterative preview debugging and richer in-browser inspection
- use `agent-browser` when you want a lighter CLI loop or a quick one-shot browser check

Typical loop:

```bash
agent-swarm vxg dev start --node <NODE_ID_OR_KEY> --target component
agent-swarm vxg dev url --session <SESSION_ID>
# Take the returned agent_url and open it on the same base origin.
# Prefer playwright-interactive; use agent-browser when it is the better fit.
agent-browser open "<BASE_ORIGIN><AGENT_URL>"
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot

# Equivalent browser validation with Playwright-interactive is preferred when available.
```

Rules:

- `agent_url` is the stable swarmd-owned preview route. Use it; do not invent a separate preview URL.
- Use `manifest_url` when you need to confirm what target actually resolved.
- Use `events_url` / `vxg dev logs` / `vxg dev watch` in parallel with browser automation when debugging interaction issues.
- browser automation tooling is for rendered browser proof:
  - pixel/layout truth
  - hover/focus/input behavior
  - manual or scripted interaction review
- `vxg dev capture` is for fast agent-native evidence and debug artifacts.
- when doing design work, the normal sequence is:
  - compile manifest
  - start preview
  - open `agent_url`
  - iterate
  - rerun preview suite

### Reuse and liveness model

- `session_reuse_key = resolved_target_ref:bundle:profile:adapter`
- `host_reuse_key = workspace:bundle:profile:adapter`
- Browser heartbeat interval: `15s`
- Browser stale threshold: `30s`
- CLI lease TTL: `30s`
- CLI lease renewal: `15s`
- Idle timeout: `300s`
- Treat preview sessions as volatile runtime state; restart `swarmd` and recreate them instead of expecting replay

Preview stop reasons:

```text
UserRequested
Timeout
IdleTimeout
ProcessCrash(String)
FailedToStart(String)
```

## Graph Analysis, Traversal, and Export

Extra RPC surfaces that are not fully mirrored by the CLI:

```text
vxg.getSnapshot        # full graph dump: graph, version, nodes, edges, bindings, actions, references
vxg.analyze            # summary, issues, nodeTypes, edgeTypes
vxg.traverse           # directional traversal from a node
vxg.findPath           # path search between two nodes
vxg.canvasApplyLayout  # persist layout positions to canvas snapshot
vxg.export             # json or mermaid export
```

CLI notes:

- `agent-swarm vxg layout` computes auto-layout positions but does not persist them
- `vxg.canvasApplyLayout` is RPC/MCP-only right now
- `agent-swarm vxg edge list`, `binding list`, `action list`, and `ref list` are implemented by reading `vxg.getSnapshot` and filtering locally
- `agent-swarm vxg generate-work` currently exposes `--node-types` and `--dry-run`; the underlying request type also supports `minCompleteness`, but the CLI does not surface it yet

## VXG Testing

For VXG manifests, suites, runs, reports, and greenlight gates, also load `vxg-testing`.

Testing-related RPC methods:

```text
vxg.testManifestAdd
vxg.testManifestList
vxg.testManifestShow
vxg.testManifestCompile
vxg.testSuiteList
vxg.testSuiteShow
vxg.testRun
vxg.testStatus
vxg.testReport
vxg.testGreenlight
```

Testing-related CLI:

```bash
agent-swarm vxg test manifest add|list|show|compile
agent-swarm vxg test suite list|show
agent-swarm vxg test run|status|report|greenlight
```

The test runner depends on preview sessions under the hood. If a VXG test is failing before assertions run, debug the preview route first.

Historical-lineage operator note:

- if `vxg test greenlight --include-blockers` reports `required_suite_orphaned`, that is a lifecycle/data-management issue, not a renderer or preview-session issue
- inspect `orphanedSuiteIds`, `repairedOrphanedSuiteIds`, and the suite history before assuming the target itself is bad
- if the current code exposes `agent-swarm vxg test suite repair-orphan`, use it only when:
  - the old suite is truly orphaned
  - the replacement suite is already present
  - the replacement suite is the legitimate same-lineage authority
- do not paper over this by inventing a new manifest family unless you are explicitly doing a new parallel intent

Prototype-to-production handoff rules:

- preview suites validate the prototype route bound through `component_ref`
- implementation suites validate the production binding carried through `implementation_ref`
- `Dual` / parity intent belongs in `vxg-testing`, but the current runner still executes preview and implementation separately
- when you change `implementation_ref`, assume implementation coverage must be revalidated

## MCP Tool Surface

After the Registry Surface Parity refactor (bd-lpmr), **all 57 VXG methods** are MCP-exposed. The unified registry auto-derives JSON schemas via `schemars`. Adding MCP to any method is metadata-only (`.with_mcp_name()` + `.with_json_schemas()`).

### Core MCP tools (original 8)

```text
vxg_apply_patch       (write, InjectedAndConsumed)  — atomic batch mutation (OCC + idempotent)
vxg_resolve_target    (read,  AlternateValidation)   — resolve preview target without starting session
vxg_query             (read,  InjectedAndConsumed)  — query VXG projection via bounded DSL
vxg_traverse          (read,  InjectedAndConsumed)  — graph traversal from a NodeRef
vxg_preview_merge     (read,  InjectedAndConsumed)  — preview merge without committing
vxg_preview_diff      (read,  InjectedAndConsumed)  — preview diff between revisions
vxg_preview_start     (write, AlternateValidation)   — start preview session
vxg_preview_stop      (write, AlternateValidation)   — stop preview session
```

### Graph CRUD (MCP-exposed)

```text
vxg_create_graph / vxg_update_graph / vxg_delete_graph
vxg_list_graphs / vxg_get_graph / vxg_get_snapshot / vxg_list_nodes
vxg_create_node / vxg_update_node / vxg_delete_node
vxg_create_edge / vxg_update_edge / vxg_delete_edge
vxg_create_binding / vxg_update_binding / vxg_connect_binding / vxg_delete_binding
vxg_create_action / vxg_update_action / vxg_delete_action
vxg_create_ref / vxg_update_ref / vxg_delete_ref
```

### Analysis & utilities (MCP-exposed)

```text
vxg_analyze / vxg_validate / vxg_auto_layout / vxg_export
vxg_canvas_apply_layout / vxg_find_path
vxg_link_work_unit / vxg_generate_work_units / vxg_sync_completeness
```

### Dev session (MCP-exposed)

```text
vxg_dev_start / vxg_dev_show / vxg_dev_list / vxg_dev_state / vxg_dev_stop
```

### Test methods (MCP-exposed — also usable via CLI)

```text
vxg_test_manifest_add / vxg_test_manifest_update / vxg_test_manifest_list
vxg_test_manifest_show / vxg_test_manifest_compile
vxg_test_suite_list / vxg_test_suite_show / vxg_test_suite_repair_orphan
vxg_test_run / vxg_test_status / vxg_test_report / vxg_test_greenlight
```

All VXG methods are accessible via **both** CLI (`agent-swarm vxg *`) and MCP. The handler is surface-neutral — identical behavior on both interfaces.

### MCP Transport Configuration

The MCP server uses rmcp SDK (official Rust MCP implementation) with stdio transport. It can run gateway-backed or direct-store depending on configuration; confirm mode before diagnosing data visibility.

**Claude Code** (`.mcp.json` in project root — verify before use):
```json
{"mcpServers": {"agent-swarm": {"command": "./target/debug/agent-swarm", "args": ["mcp", "stdio"], "env": {"SWARMD_DATA_DIR": "<REAL_RELEASE_SWARMD_DATA_DIR>"}}}}
```

**Codex** (`.codex/config.toml` — already configured):
```toml
[mcp_servers.agent-swarm]
command = "./target/debug/agent-swarm"
args = ["mcp", "stdio"]
```

**Prerequisites:** build the current binary, normally `cargo build --release --bin swarmd --bin agent-swarm` for parity validation. If using direct-store MCP for VXG/design feature work, pass the real release data dir explicitly. A `.tmp/swarmd-data` MCP data dir is valid only for isolated tests.

**Important:** Direct-store MCP and swarmd cannot run simultaneously against the same data dir (redb write lock). Gateway-backed MCP talks through swarmd and can coexist with CLI/UI because they share the same daemon path.

## Edge Type Constraint

Valid structural edge types are exactly:

- `contains`
- `sequences`
- `inherits`
- `variants`

Unknown strings are rejected. Put custom semantics in `label` or `meta`, and put navigation in action effects.

## Project-Scoped Workflow

1. Resolve canonical `project_id` first.
2. Set `vxg_id = project_id`.
3. Ensure the graph exists for that `vxg_id`.
4. Apply changes via UI or CLI.
5. Verify replay after restart.

Always echo:

- `project_id`
- chosen `vxg_id`
- expected VXG scope `vxg/<vxg_id>`

## Persistence Verification Checklist

1. Generate a unique VXG id:
   - `TEST_ID="diag-$(date +%s)"`
2. Create or mutate data against `vxgId=$TEST_ID`.
3. Verify delta evidence, not historical totals:
   - `vxg/$TEST_ID`
   - `vxg.dec.graph.created`
   - `vxg.dec.node.created`
4. Restart `swarmd`.
5. Re-read the same `vxgId`.

## Common Failure Modes

- Running against `swarmd --role core` and expecting local owner-local UI/CLI auth.
- No project/zone selected, so UI falls back to `system`.
- Using project display name instead of `project_id`.
- Missing CLI context:
  - run `agent-swarm vxg use <vxg-id>` or pass `--vxg`
- Using invalid edge types and trying to encode navigation as `edge_type`.
- Passing an empty node key, handler, path, source, or URL host and reading the response as a daemon failure instead of a validation error.
- Supplying both `mock` and `mock_ref` on a binding.
- Sending a `Connected` binding without `source`.
- Hitting `VersionConflict` after reading stale state and not retrying with a fresh version.
- Reusing a `request_id` for a different patch body and tripping idempotency mismatch detection.
- Expecting `agent-swarm vxg layout` to persist canvas coordinates.
- Expecting `agent-swarm vxg preview` to support subcommands:
  - the compatibility wrapper is `preview [flags]` and `preview --stop`
- Treating preview failures as graph failures when the real issue is a crashed adapter, expired CLI lease, or idle timeout.
- Treating test failures as manifest/assertion failures when the preview session never reached a healthy running state.

## Quick Triage Checklist

1. Confirm daemon role and auth path first.
2. Confirm `project_id`, `vxg_id`, and whether the active CLI context matches the intended graph.
3. Reproduce with UI, CLI, or MCP against a single explicit surface.
4. If a mutation failed, capture the request id, expected version, and actual version.
5. If preview is involved, inspect session status, capabilities, event streams, and stop reason.
6. Use exact unique-id token deltas in `events.redb`.
7. Restart and replay before claiming a VXG persistence bug.
