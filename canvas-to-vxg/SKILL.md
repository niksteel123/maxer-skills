---
name: canvas-to-vxg
description: Pixel-perfect porting workflow from Paper, Pencil, or SwarmCanvas designs into VXG/VGX graph features, shells, slotted components, prototypes, and validation evidence. Use when converting canvas designs to VXG, linking design_ref/component_ref, implementing design-backed VXG frontend surfaces, inventorying pages by feature, comparing Paper or SwarmCanvas render-kit output to VXG human map and agent preview routes with Browser Use, authoring Verify/UVP checklists, or enforcing pixel parity and canvas interactivity.
---

# Canvas To VXG

Use this skill when a visual design must become a VXG feature, page, shell, or component. Treat "VGX" in user prompts as VXG unless the repo has a separate VGX subsystem.

## Mission

Convert a design artifact into a working VXG feature without losing visual fidelity, graph semantics, shell structure, or interaction behavior.

The expected end state is not "a screenshot appears in VXG." The expected end state is:

- the design is linked through VXG graph metadata;
- the feature is mounted through the correct page/shell layer;
- the runtime component preserves the reference design's visual system;
- canvas-like regions remain real, navigable, interactive canvas surfaces;
- Browser Use proves the human map and agent preview routes render the same intended structure;
- side-by-side evidence shows pixel-level visual parity against the design reference;
- Verify/UVP checklists make the handoff repeatable for the next agent.

## Operating Standard

Pixel parity is the contract. The port is not complete until the VXG human map and native preview visually match the linked Paper/Pencil/SwarmCanvas reference and the browser proves the component is interactive.

Default companion skills and when to load them:

- `vxg-project-ops`: always load for graph mutation, shell/page topology, `design_ref`, `component_ref`, preview sessions, `vxg validate`, and human map diagnosis.
- `swarm-design-ops`: always load when touching `.pen`, Design Registry, render-kit, SwarmCanvas design linkage, style inventory, or Paper/Pencil comparison.
- `vxg-testing`: load when authoring manifests, Verify/UVP packages, checklist gates, greenlight reports, or preview/implementation coverage.
- `browser-use:browser`: load for in-app browser evidence on localhost, human VXG map, native VXG preview, iframe inspection, screenshots, DOM state, and real interactions.
- `agent-browser`: use only as a documented browser fallback when Browser Use is unavailable or the task explicitly prefers its CLI workflow.
- Frontend design skills such as `frontend-design`, `design-taste-frontend`, `image-taste-frontend`, or `design-consistency`: load when the prototype must be implemented or visually repaired, especially for typography, spacing, masking, blur, transparency, state colors, transitions, animation, and responsive behavior.
- `verify-authoring` / `verify-ops`: load when the task needs a new or hardened UVP package rather than only running an existing one.

## Source Of Truth Contract

- `design_ref`: visual reference source of truth from SwarmCanvas/Paper/Pencil.
- `component_ref`: prototype render source used by VXG preview iframe/component resolution.
- `implementation_ref`: production binding, only required after a production surface exists.
- Do not infer design linkage from legacy top-level fields. Use `design_link` / `design_context` or the supported CLI/MCP equivalent.
- Do not validate a completed design-backed feature as a raw component callout. Valid topology is:

```text
feature -> page/shell -> slotted design-backed component
```

Invalid topology is:

```text
feature -> design-backed component
```

Direct component preview routes are allowed during early component development. They are not enough to validate a completed design-backed VXG feature.

## Feature Page Inventory

When converting or repairing a feature, start from the normalized VXG page
inventory instead of the one page currently visible in the human UI:

```bash
agent-swarm vxg query 'features where key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
```

`feature_pages` is the feature buildout checklist. It includes page groups
declared through active `meta.pageVariants`, `meta.feature.pages`, and explicit
feature `contains` edges with page roles such as `chat-app-page` or
`console-feature-page`. For every returned row, use `native_shell_key` and
`native_page_id` to open native preview and verify the page inside its shell:

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

For new or migrated feature pages, make sure future agents can discover the
page through one of the normalized models: active `feature.meta.pageVariants`,
`feature.meta.feature.pages`, or an explicit feature-to-page `contains` edge
with a documented feature-page role. Do not leave a page reachable only through
manual node/edge inspection.

If a user provides a human `/ui/vxg-map` link, parse `project` as `--vxg`,
parse `shell` or another `feature-*` parameter as `feature_key`, and parse
`shellPage`, `page`, or another `page-*` parameter as `page_key` or
`native_page_id`. Query `feature_pages` with those values, then use the
matching row's native shell/page ids for preview proof.

## Graph Contract

Every design-backed VXG component must have:

- durable semantic `key`;
- `component_ref` / `componentRef` or `component_entry` / `componentEntry`;
- linked `design_ref` through design-link/design-context tooling;
- positive finite `prototypeWidth` and `prototypeHeight`, or snake_case equivalents;
- an explicit shell/page slot when used as a feature surface.

For shell chrome, sidebars, inspectors, titles, consoles, and future project
chrome regions, use Shell Config V2 instead of one-off composite components.
The generic pattern is:

```text
top-level page shell
  -> stable slot
      -> nested shell
          -> fixed subslot
          -> variation subslot resolved by variationGroups
```

`meta.shell.version = 2`, `variationGroups`, and
`slotAssignments[].variationGroupId` are the portable graph contract. Leaf
components remain useful as variation targets, but a full sidebar or console
composite should not become the shell infrastructure when the design needs
dynamic variations.

`480 x 320` on a selected design-backed component is a failed geometry contract unless the component intentionally has no design/prototype dimensions. Fix dimension propagation instead of accepting the fallback.

For tldraw/SwarmCanvas-style components:

- preserve native pan/zoom behavior;
- prefer `fitMode: "off"`, `viewportMode: "native-tldraw"`, and `allowCanvasPanZoom: true` on shell slot metadata when applicable;
- use semantic shapes/connectors for interaction, not a raster-only screenshot masquerading as the component.

## Pixel-Perfect Transition Rules

"Transition" means the handoff from reference design to VXG graph, shell, component runtime, and browser-rendered preview. Every transition must preserve measurable facts:

- Dimensions: artboard, shell, slots, components, overlays, and canvas viewport are derived from source dimensions or explicit slot overrides.
- Position: major landmarks must align when screenshots are overlaid or inspected side by side.
- Shape: masks, clip paths, radius, octagon/shelf cuts, corner transparency, and connector curves must survive runtime rendering.
- Color and effects: backgrounds, fills, blur, opacity, gradients, glass layers, strokes, shadows, and state colors must be sourced from the design/style system.
- Typography: font family, weight, size, line height, letter spacing, truncation, and text opacity must match the reference.
- Interaction states: default, hover, selected, active, focus, inspector-open, drag, pan/zoom, error, and disabled states must be checked when present in the design.
- Motion: transitions and animations must use the intended easing, duration, transform origin, opacity behavior, and reduced-motion fallback when the reference or surrounding app implies motion.
- Responsive behavior: default, expanded/fullscreen, embedded shell, preview route, and human map route must each render intentionally, not as accidental fit-scaling.

Do not "eyeball once" and move on. Capture the reference, capture the runtime, compare them, fix drift, and repeat until the difference is either gone or explicitly documented as an intentional product decision.

## Design Reference Capture

Use the strongest available reference path:

1. Paper/Pencil screenshot system for Paper-native files and exact visual reference.
2. SwarmCanvas render-kit for canonical `.pen` references and renderer-fidelity proof.
3. Browser-opened render URL only as visual inspection support, not as the only source validation.

For SwarmCanvas references, the standard registry validation chain is:

```text
design_export
design_validate
design_lint --profile paper-parity
design_snapshot_layout --problems-only
design_style_inventory
design_screenshot
```

Use `design_read` or style inventory to extract exact dimensions, fills, strokes, blur, opacity, radius, typography, layout gaps, and component ids. Do not implement from screenshot pixels alone when structured design data is available.

## Port Workflow

1. **Preflight and checkpoint**
   - Verify the intended local stack: swarmd command, role, data dir, gateway, project, VXG id, and frontend URL.
   - Use the real release swarmd backend database that the human app/operator CLI use, usually the one containing `swarm2`. Do not start `.tmp/*`, `/tmp/*`, fixture, or ad hoc `--data-dir` databases for VXG graph/design feature work unless the task explicitly asks for an isolated test.
   - If the target project/VXG/design is missing, assume the agent is pointed at the wrong backend before debugging the graph.
   - If the work is scoped to a feature, run `feature_pages where feature_key = "<FEATURE_KEY>"` and save the result as the page inventory.
   - Capture current VXG snapshot JSON before mutation.
   - Capture VCS status/checkpoint for `vxg/<project>` and design scopes when available.

2. **Capture the reference**
   - Use Paper/Pencil screenshot tooling or SwarmCanvas render-kit.
   - For SwarmCanvas, prefer MCP first: `design_export`, `design_validate`, `design_lint`, `design_snapshot_layout`, `design_style_inventory`, and `design_screenshot`.
   - Store canonical `.pen`, render PNG, and render JSON/metadata in the evidence directory for the iteration.

3. **Build the VXG topology**
   - Link design to the relevant VXG node with `design_link` / `design_context`.
   - Mount design-backed components through a page/shell node and a slot-bearing `contains` edge.
   - Keep feature grouping queryable through `feature_pages` by using active page variants, `meta.feature.pages`, or explicit feature-to-page `contains` edges with documented page roles.
   - For dynamic chrome, create or reuse V2 nested shell nodes and mount fixed subslots plus variation subslots through `variationGroups`; do not introduce sidebar-specific slot names or hardcoded wrapper contracts.
   - Copy source design dimensions into graph metadata unless a deliberate slot override exists.
   - Keep page/shell layout modes explicit: default embedded shell, expanded/fullscreen shell, and any route-specific preview target.
   - Keep shell chrome, sidebar shelves, console regions, inspector surfaces, and canvas content as separate graph/runtime concepts. Do not flatten them into a single raw component.

4. **Implement the frontend prototype**
   - Reuse existing shell, style, and layout infrastructure before adding new abstractions.
   - Preserve the visual structure from the reference: fills, blur, opacity, clipping, masks, corners, typography, spacing, state colors, connectors, and overlays.
   - For canvas surfaces, implement real canvas primitives and interactions. The reference art may guide placement, but the runtime must remain navigable and editable where expected.
   - Do not hard-code one-off visual fixes when the root cause is a reusable style, mask, geometry, or shell-slot contract.
   - If a design uses background-driven theming, wire through the existing style infrastructure instead of baking a palette into the component.

5. **Resolve and start preview**
   - Resolve the VXG target before browser work.
   - For feature-wide work, resolve each row from the `feature_pages` inventory and use its `native_shell_key` / `native_page_id`.
   - Start or reuse a VXG dev session for the page/shell target, not just the raw component.
   - Open the returned `agent_url`, `/vxg/dev/<session-id>`, or render URL through Browser Use in the in-app browser.

6. **Browser validation**
   - Validate both the human route and the native VXG preview route.
   - Human route example:

```text
http://127.0.0.1:3000/ui/vxg-map/?project=swarm2&swarmd=http%3A%2F%2F127.0.0.1%3A9847
```

   - Native preview route example:

```text
http://127.0.0.1:9847/vxg/dev/<session-id>
```

   - Capture screenshot evidence through Browser Use, not just shell commands.
   - Inspect DOM/iframe state and prove iframe/component source derives from VXG `component_ref`.
   - For V2 shell variation work, prove fixed subslots stay mounted while dynamic subslots switch, and verify `mode` / `slotVariations` reach the resolver without passive trace events being appended to leaf iframe URLs.
   - Inspect tldraw runtime state when available: shape count, connector count/types, selected ids, and viewport state.
   - Trigger interactions: select, pan/zoom or drag/reposition, connector click, inspector focus, and trace/console capture.

7. **Pixel comparison**
   - Produce side-by-side HTML/PNG comparing the Paper/SwarmCanvas render to the VXG preview.
   - Prefer an overlay or bounding-box measurement when screenshots look close but drift is still possible.
   - Check visual parity directly: no missing shell layer, no wrong fallback dimensions, no clipping, no extra fills in transparent regions, no radius/corner defects, no connector defects, no overlap, no missing text, no wrong state colors, and no accidental fit-to-viewport behavior.
   - If the comparison exposes drift, fix the implementation or graph metadata and repeat the loop.

8. **Verify and checklist**
   - Use `vxg-testing` or Verify/UVP to create per-component checklists for:
     - graph topology;
     - shell/page/slot structure;
     - design reference link;
     - pixel parity;
     - native canvas interactivity;
     - preview route and human map route evidence;
     - browser interaction trace;
     - pixel-perfect transition from reference -> graph -> shell -> component -> preview;
     - greenlight status.
   - If Browser Use is unavailable, write a structured failure artifact and keep the checklist yellow. Do not mark green without browser-visible proof.

## Checklist Template

Use or adapt this checklist for every design-backed component or feature:

```markdown
## <Feature Or Component> VXG Port Checklist

- [ ] Reference design captured from Paper/Pencil or SwarmCanvas render-kit.
- [ ] Canonical `.pen` or Paper screenshot stored with render PNG/JSON.
- [ ] `design_ref` linked through design tooling and visible in design context.
- [ ] `component_ref` / `component_entry` set as prototype render source.
- [ ] Source dimensions copied to positive `prototypeWidth` / `prototypeHeight`.
- [ ] Feature topology is `feature -> page/shell -> slotted component`.
- [ ] `feature_pages where feature_key = "<FEATURE_KEY>"` returns the expected page inventory.
- [ ] Every page returned by `feature_pages` has native preview evidence or a documented blocker.
- [ ] Dynamic chrome uses Shell Config V2 nested shell nodes, fixed subslots, and `variationGroups` rather than hardcoded composite wrapper infrastructure.
- [ ] Runtime variation state uses generic `mode` and `slotVariations`, and passive traces do not remount nested leaf previews.
- [ ] Shell layout modes render intentionally: default, expanded/fullscreen, preview.
- [ ] Canvas/tldraw surface uses real primitives and native pan/zoom.
- [ ] Human VXG map screenshot captured with Browser Use.
- [ ] Native VXG preview screenshot captured with Browser Use.
- [ ] DOM/iframe proof shows source derives from VXG `component_ref`.
- [ ] Runtime state proves shapes/connectors and selection state.
- [ ] Interaction trace covers select, pan/zoom or drag, connector click, inspector focus.
- [ ] Side-by-side or overlay comparison against reference is generated.
- [ ] Pixel parity verified for dimensions, position, typography, colors, effects, masks, corners, connectors, and states.
- [ ] No fallback `480 x 320`, raw component callout, shell bypass, raster-only canvas, or dual-renderer drift remains.
- [ ] UVP/Verify package validates and greenlight/checklist status is green, or yellow blockers are explicitly recorded.
```

## Required Evidence

Each meaningful iteration should store fresh evidence under the task evidence directory, commonly:

```text
evidence/vxg-orchestration-canvas-20260425/
```

Required artifact types:

- VXG snapshot JSON before mutation;
- VXG snapshot JSON after mutation;
- VCS status/checkpoint JSON;
- linked SwarmCanvas design export `.pen`;
- SwarmCanvas/Paper design render PNG and JSON;
- VXG human map browser screenshot;
- VXG native preview browser screenshot;
- DOM capture or notes for iframe/component refs;
- tldraw/canvas runtime state capture where available;
- interaction trace JSON or browser console capture;
- side-by-side comparison HTML/PNG;
- UVP/Verify report or greenlight/checklist JSON.

## Browser Use Setup

Use the browser skill and runtime supplied by the current host. The following is a legacy Atlas adapter example only; use it only when that API is available and set `BROWSER_RUNTIME_PATH` to the runtime module path supplied by the host:

```js
if (!globalThis.agent) {
  const runtimePath = process.env.BROWSER_RUNTIME_PATH;
  if (!runtimePath) throw new Error("Resolve BROWSER_RUNTIME_PATH from the host browser skill first");
  const { setupAtlasRuntime } = await import(runtimePath);
  const backend = "iab";
  await setupAtlasRuntime({ globals: globalThis, backend });
}
await agent.browser.nameSession("VXG design parity validation");
if (typeof tab === "undefined") {
  globalThis.tab = await agent.browser.tabs.selected();
}
```

If already on the target URL, do not reload unless intentionally testing fresh state.

## Common CLI Fallbacks

Use MCP equivalents first when available. CLI commands are reproducibility and control fallbacks.

```bash
agent-swarm design export --design <design-id> --project <project> --output <path>.pen --format json
agent-swarm design validate --file <path>.pen --format json
agent-swarm design lint --file <path>.pen --profile paper-parity --format json
agent-swarm design snapshot-layout --file <path>.pen --problems-only --format json
agent-swarm design style-inventory --file <path>.pen --format json
agent-swarm design screenshot --design <design-id> --project <project> --scale 1 --image-format png --format json

agent-swarm vcs status --scope vxg/<project> --format json
agent-swarm vxg validate --vxg <project> --format json
agent-swarm vxg dev start --vxg <project> --node <page-or-shell-node> --target component --width 1680 --height 1050 --ui-mode immersive --format json
agent-swarm vxg dev url --vxg <project> --session <session-id> --format json
agent-swarm vxg dev capture --vxg <project> --session <session-id> --kind dom --format json
agent-swarm vxg dev capture --vxg <project> --session <session-id> --kind screenshot --renderer render-kit --format json

agent-swarm verify package validate test-packages/<package> --format json
agent-swarm verify instantiate test-packages/<package> --format json
agent-swarm verify greenlight --instance-id <instance-id> --format json
```

## Completion Gate

Do not call the port complete unless all are true:

- design-backed feature validates as `feature -> page/shell -> slotted component`;
- `design_ref` and `component_ref` are linked and visible in graph/design context;
- source dimensions propagate and no design-backed component falls back to `480 x 320`;
- human VXG map and native VXG preview both render the same shell/page/component structure;
- Browser Use evidence proves iframe/component refs derive from `component_ref`;
- tldraw/SwarmCanvas runtime has real shapes/connectors and expected interactions;
- side-by-side comparison is visually close enough to the reference to survive user inspection;
- no obvious clipping, extra fill, corner, blur, radius, state-color, overlap, missing-text, or connector issue remains;
- UVP/Verify checklist is green, or any yellow item is explicitly documented with the blocking reason.

## Known Bad Smells

- The visual looks correct only in a direct `/preview/?component=...` route, not inside the VXG page/shell.
- The human map and agent preview differ in shell structure, dimensions, or behavior.
- The inspector shows a design-backed component at `480 x 320`.
- Browser evidence uses only screenshots and never inspects DOM, iframe `src`, runtime state, or interactions.
- A tldraw/SwarmCanvas design is represented by one fixed image and cannot pan, zoom, select, drag, or inspect connectors.
- Transparent clipped corners show accidental background fills or square artifacts.
- Fullscreen mode still renders the main content inside the default octagon when the design says fullscreen should be plain canvas background.
- Sidebars, shelves, consoles, inspectors, or overlays are visually present but not represented as shell/page/slot structure.
- The implementation uses one-off CSS constants where the repo already has style/theme infrastructure for the same concern.
- The UVP/checklist is green even though Browser Use was unavailable or the evidence is missing.
