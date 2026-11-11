---
name: swarm2-vxg-feature-shell
description: "Swarm2-specific workflow for creating or migrating VXG feature pages that inherit the shared SwarmNet shell framework: V2 nested shell slots, dynamic sidebar/inspector/header/console variations, page-local octagon containers, Oxygen content layout profiles, token-driven style modes, feature_pages query inventory, graph-backed page variants, and real React preview components inside the octagon."
---

# Swarm2 VXG Feature Shell

Use this skill for `swarm2` VXG feature pages that must reuse the shared
SwarmNet shell framework and support dynamic shell variations. For graph
mutation also load `vxg-project-ops`; for visual design ports also load
`canvas-to-vxg`; for browser proof load `browser-use:browser`.

## Core Feature Contract

The reusable feature content structure is:

```text
feature app
  -> page/shell
      -> page-local octagon container
          -> feature-specific runtime component
```

Do not mount a design-backed runtime component directly under a feature. Do not
globally retarget existing octagon nodes. Each page owns its own octagon
container so shell chrome, side rails, title bar, console dock, layout modes,
and style tokens stay consistent.

The octagon container is a shell/runtime boundary, not a claim that the inner
page must be native canvas. The inner component declares an Oxygen profile:

```text
canvas.flat | canvas.header | canvas.headerFooter
app.flat    | app.header    | app.headerFooter
```

Store the profile at `node.meta.contentLayoutProfileId`. Canvas profiles keep
the body full-surface and overlay header/footer bands. App profiles reserve
header/body/footer regions for structured React/flex content.

## Shell Config V2

Use Shell Config V2 for all dynamic chrome. This is the canonical model:

```text
top-level page shell
  left-rail     -> shell-left-sidebar
  top-title-bar -> shell-top-title
  right-rail    -> shell-right-sidebar
  bottom-dock   -> shell-console
  main-content  -> page-local octagon container

shell-left-sidebar
  hex     -> swarm-left-hex
  content -> variation group left-sidebar-content

shell-right-sidebar
  hex     -> swarm-right-hex
  content -> variation group right-inspect-content

shell-console
  content -> variation group console-content

shell-top-title
  content -> variation group title-content
```

Do not introduce sidebar-specific slot contracts. Top-level slots stay stable;
dynamic behavior happens inside nested shell nodes through `variationGroups`.

Leaf preview components such as `SwarmLeftSidebarNavigationV2`,
`SwarmLeftSidebarNodeManager`, `SwarmRightContent`, and console variants are
allowed as variation targets. Full composite wrappers such as
`SwarmLeftSidebarFull` and `SwarmRightSidebarFull` may exist for isolated
inspection, but they should not be active shell infrastructure for new or
migrated pages.

## Variation Resolution

Core metadata:

```text
meta.shell.version = 2
meta.shell.variationGroups
meta.shell.pages[*].slotAssignments[*].variationGroupId
```

Resolver precedence:

1. explicit session or route `slotVariations` override
2. selected node/page or interaction match
3. shell/page `mode` match
4. variation group default
5. deterministic first valid variation fallback

Runtime controls should emit generic preview interactions, for example:

```text
action = shell.slotVariation.set
mode = { leftSidebarMode: "node-manager" }
slotVariations = { "left-sidebar-content": "node-manager" }
```

The shell resolver should not depend on Swarm-specific sidebar branches.

## Runtime State And Tokens

Durable render state should flow to preview leaves:

```text
theme, styleModeId, layoutModeId, tokens, mode, slotVariations
```

Transient telemetry should not be appended to leaf iframe URLs:

```text
traceEvent, animation.end, transition.end, ordinary passive traces
```

Those belong in resolver/session logging. Passing passive traces into nested
iframe URLs remounts previews and can leave controls unhydrated.

Runtime components should consume shell tokens instead of hardcoded backgrounds:

```css
background: var(--swarm-surface-canvas);
```

Transparent sidebar/inspector hex containers should let the outer shell style
tokens drive the surface.

## Graph Shape

Use slot-bearing `contains` edges:

```text
feature-<domain>-app
  contains page-<domain>-<page>-layout

page-<domain>-<page>-layout
  contains shell-left-sidebar      slot left-rail
  contains shell-top-title         slot top-title-bar
  contains shell-right-sidebar     slot right-rail
  contains shell-console           slot bottom-dock
  contains swarm-<domain>-<page>-octagon-map slot main-content

swarm-<domain>-<page>-octagon-map
  contains swarm-<domain>-<page>-runtime slot inner
```

Structured app/flex pages should not claim native tldraw canvas metadata.
Native canvas pages should preserve pan/zoom and expose runtime shape,
connector, selection, and camera state.

## Feature Page Query Contract

Before creating, migrating, or validating a Swarm2 feature page set, query the
feature inventory:

```bash
agent-swarm vxg query 'features where key = "<FEATURE_KEY>"' --vxg swarm2 --json
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg swarm2 --json
```

Use `feature_pages` as the source of truth for all pages in the feature. It
normalizes active `meta.pageVariants`, `meta.feature.pages`, and explicit
feature-to-page `contains` edges with feature-page roles. This is how agents
avoid validating only the currently visible human page while missing sibling
pages in the feature.

Every returned row must resolve or have an explicit blocker. Open native
preview with the row's normalized target:

```bash
agent-swarm vxg dev start --vxg swarm2 \
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

After mutating feature/page topology, rerun `feature_pages` and confirm the
new or migrated pages are discoverable. Do not leave a page reachable only by
manual graph-node inspection.

For human `/ui/vxg-map` links, parse `project=swarm2`, use `shell` or another
`feature-*` value as `feature_key`, and use `shellPage`, `page`, or another
`page-*` value as `page_key` or `native_page_id`. Query `feature_pages` and use
the matching row's `native_shell_key` / `native_page_id` for native preview.

## Frontend Surfaces

Before implementing, inspect:

```text
agent-swarm-ui/packages/ui/src/apps/vxg-map/shell.ts
agent-swarm-ui/packages/ui/src/apps/vxg-map/views/SharedShellSurface.tsx
agent-swarm-ui/packages/ui/src/apps/vxg-map/views/PrototypeView.tsx
agent-swarm-ui/packages/ui/src/apps/vxg-map/VXGMapPage.tsx
agent-swarm-ui/apps/web/app/preview/page.tsx
agent-swarm-ui/apps/web/app/preview/previews/previewRuntime.ts
agent-swarm-ui/apps/web/app/preview/previews/oxygenContentLayout.tsx
```

Register leaf preview entries in `/preview/`. Do not create a second shell
renderer for a feature family; nested shells should render recursively through
the shared shell surface.

## Validation

Use the real `swarm2` backend, not temp databases:

```bash
ps -axo pid,command | rg 'swarmd|agent-swarm-ui|next dev'
./target/release/agent-swarm project get swarm2 --format json || ./target/debug/agent-swarm project get swarm2 --format json
./target/release/agent-swarm vxg validate --vxg swarm2 --format json || ./target/debug/agent-swarm vxg validate --vxg swarm2 --format json
```

Validate both routes for every shell variation change:

```text
Human:
http://127.0.0.1:3000/ui/vxg-map/?project=swarm2&shell=<page-node-id>&view=prototype&shellLayout=expanded&shellStyle=<style>&previewTarget=shell&swarmd=http%3A%2F%2F127.0.0.1%3A9847

Agent:
agent-swarm vxg dev start --vxg swarm2 --shell <page-node-or-key> --target shell --layout expanded --style <style> --width 1680 --height 1050 --ui-mode immersive --format json
http://127.0.0.1:9847/vxg/dev/<session-id>
```

For feature-wide validation, derive `<page-node-or-key>` from:

```bash
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg swarm2 --json
```

Then run native preview for every row using `native_shell_key` and
`native_page_id`.

Browser evidence must prove:

- page renders through shared V2 shell slots;
- fixed subslots such as hex controls stay mounted;
- dynamic subslots expose `data-vxg-variation-group-id`;
- `mode` and `slotVariations` switch the intended variation;
- passive traces are not appended to leaf iframe URLs;
- tokens reach nested runtime components;
- expanded and fullscreen layouts preserve sidebars, inspector rail, title bar,
  console dock, octagon/sidebar clipping, and transparent token-driven
  backgrounds.

## Completion Checklist

- Feature topology is `feature -> page/shell -> octagon -> runtime`.
- `feature_pages where feature_key = "<FEATURE_KEY>"` returns every expected
  page in the feature.
- Every `feature_pages` row has native preview proof or a documented blocker.
- Page node is shell-sized; runtime keeps source design dimensions.
- Dynamic chrome uses V2 nested shell hosts and variation groups.
- No new sidebar-specific slot contract or hardcoded renderer branch exists.
- Runtime variation controls emit generic preview interactions with `mode` and
  `slotVariations`.
- Component backgrounds and accents are token-driven.
- `vxg validate` passes.
- Human route and agent `/vxg/dev` route are both browser-validated in expanded
  and fullscreen layouts.
