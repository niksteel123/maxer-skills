# Verify Authoring — Annotated Examples

Six package patterns and their suite files. Replace project-specific targets,
fixtures and tests, then validate and inspect the selected execution plan.
Package-schema acceptance is not proof that a browser adapter, exact test
inventory, or retained evidence exists. Amend existing surface packages through
their lineage and inspect retained/reset/new obligations before adoption.

Checklist files support structured fenced `items:` metadata and legacy Markdown
bullets. Both return generated opaque `chk-*` IDs. A predecessor digest selects
content-based identity; otherwise IDs derive from suite and ordinal. Neither mode
accepts author-supplied `item_id`, and a title is not the runtime ID. Read
checklist list before verdict writes. Structured metadata supports severity,
tags, per-item capabilities and artifact hints (CORE.md §9b.1).

For required manual acceptance, declare `evidence_contract.required_artifacts`
and map item obligations with structured hints as shown in VXG-CANVAS.md. A
minimal package with no evidence contract illustrates parsing, not enforced
evidence-byte coverage or completed review.

## 1. Minimal checklist-only package (human review)

### Use case
Internal design review; a PM/design lead evaluates a finished UI component against rubric items. No automation.

### Package layout
```
test-packages/design-review-nav/
├── TESTS.md
├── docs/
│   └── spec.md
└── suites/
    └── design-checklist.md
```

### `TESTS.md`
```yaml
---
package_id: verify.design-review.nav-v2
name: Navigation V2 Design Review
kind: verification
package_version: "1.0.0"
layer_id: l2.5
description: Design-lead rubric for the v2 navigation redesign.
tags: [design-review, nav, v2]

source_of_truth:
  spec: docs/spec.md  # the design brief or PRD

bindings:
  scopes: [project/swarmnet]
  territory_layers: [l2.5.nav]  # layer-version input when projection is available

suites:
  - id: design.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/design-checklist.md
    required_capabilities: [capture.screenshot, capture.layout]
---

# Navigation V2 Design Review

Covers the v2 navigation redesign rubric. One checklist, graded by the
design lead. Not automated.
```

### `suites/design-checklist.md`
```markdown
# Navigation V2 Review Rubric

Design lead reviews the rendered nav at `/ui/nav` against the v2 brief.
Items are machine-extracted from Markdown bullets below.

## Typography + visual items

- **typography-matches-tokens**: Nav labels use `ui.body.md` token; active-state labels use `ui.body.md.active`. Verify via DOM computed styles on `.nav-item` and `.nav-item--active`.
- **hover-states-visible**: Every nav item shows a hover state distinguishable from resting. Capture before/after screenshots and attach as evidence.
- **keyboard-focus-visible**: Tab through all nav items; each shows a visible focus ring meeting WCAG 2.1 contrast. Fail if any item has no focus indicator.
- **motion-respects-prefers-reduced**: With `prefers-reduced-motion: reduce`, nav transitions drop to ≤50ms. Check via browser devtools emulation.
```

### Why these choices
- `proof_kind: checklist` + `execution_mode: manual` because rubric items need human judgement.
- No `swarm_session` suite — the reviewer drives the browser manually.
- `territory_layers: [l2.5.nav]` supplies a layer-version freshness input; inspect the available projection and actual stale reason.
- Four bullets produce four items with generated `chk-*` IDs; obtain them from checklist list.
- **Legacy Markdown-bullet mode** is fine here: every item has the same severity target (advisory design review) and inherits suite-level capabilities, so the structured-mode overhead isn't worth it. If you need per-item severity or tags (e.g., separating `critical` a11y items from `medium` polish items), switch to the structured YAML frontmatter shape shown in Example 5.

---

## 2. Minimal command-only package (backend nextest)

### Use case
Unit + integration tests for a specific Rust crate, gated into `feature-local` lane for local feature validation.

### Package layout
```
test-packages/event-store-persistence/
├── TESTS.md
├── docs/
│   └── spec.md
└── suites/
    └── persistence.yaml
```

### `TESTS.md`
```yaml
---
package_id: verify.event-store.persistence
name: Event Store Persistence Proof
kind: verification
package_version: "1.0.0"
layer_id: l0
description: Persistence contract tests for the swarmd event store.
tags: [backend, event-store, persistence]

source_of_truth:
  spec: docs/spec.md

bindings:
  scopes: [project/swarmnet]
  path_globs:
    - "crates/swarm-kernel/src/event_store/**"
    - "swarmd/src/storage/**"

suites:
  - id: backend.persistence
    proof_kind: automated
    execution_mode: command
    file: suites/persistence.yaml
    required_capabilities: [backend.assertions, persistence.assertions]
---

# Event Store Persistence Proof

Exercises the swarmd event store across append, read, replay, and
durability-boundary scenarios. Feature-local lane (one retry on flakes).
```

### `suites/persistence.yaml`
```yaml
lane: feature-local
packages: [swarm-kernel, swarmd]
paths:
  - crates/swarm-kernel/src/event_store
  - swarmd/src/storage
# integration defaults to `routed`; no mcp_call/http_probe/sql_probe sub-block needed.
```

### Why these choices
- `feature-local` lane: persistence tests hit disk, need one retry tolerance, slower than pure unit tests. (`fast-local` has retries=0.)
- `paths` and `packages` feed the repository router. This is a broader routed check,
  not a selector for tests in those subdirectories; policy can expand the lane or
  package set. Inspect actual commands with `verify run plan`.
- `path_globs` declares scope. Its set and router bytes are freshness inputs;
  matched source-file contents are not automatically watched.
- Both `backend.assertions` and `persistence.assertions` capabilities declared: the suite makes assertions against backend state AND persistence-layer state.
- For narrow repair, put exact Cargo package/target arguments and nextest `-E`
  expressions in `commands`, with a real inventory/count preflight. Do not change
  a shared profile's default filter for one package. BACKEND.md contains a literal
  explicit-command example and the limits of declared `scope_plan.test_count`.

---

## 3. Minimal swarm_session package (browser smoke)

### Use case
End-to-end browser smoke against the VXG preview route. Runs headless in CI via the session runtime's built-in Playwright.

### Package layout
```
test-packages/vxg-preview-smoke/
├── TESTS.md
├── docs/
│   └── spec.md
└── suites/
    └── preview-session.yaml
```

### `TESTS.md`
```yaml
---
package_id: verify.vxg-preview.smoke
name: VXG Preview Smoke
kind: verification
package_version: "1.0.0"
layer_id: l2.5
description: Browser smoke proof for the VXG preview route.
tags: [vxg, preview, browser, smoke]

source_of_truth:
  spec: docs/spec.md

bindings:
  scopes: [vxg/swarm2-main]
  path_globs:
    - "agent-swarm-ui/packages/ui/src/apps/vxg-map/**"
    - "swarmd/src/preview/**"

suites:
  - id: browser.smoke
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/preview-session.yaml
    required_capabilities:
      - interaction.click
      - capture.screenshot
      - capture.dom
      - capture.layout
    optional_capabilities:
      - trace.semantic
---

# VXG Preview Smoke

Smoke-tests the VXG preview route for `vxg/swarm2-main`. The session runtime
opens the target, waits for `ready_selector`, and retains evidence under
`evidence/browser-smoke`.
```

### `suites/preview-session.yaml`
```yaml
# All fields are flat; NO nested target:/viewport: objects.
profile: vxg-preview-default      # or headful-chrome-1680x1080 for headful
bundle: vxg_preview@1

target_kind: preview
preview_target: shell              # shell | page | component
# vxg is inferred from bindings.scopes; no vxg_id field in this struct.

viewport_width: 1920
viewport_height: 1080

playwright:
  route: vxg-map-shell             # named route in the bundle's route table
  ready_selector: '[data-vxg-ready="true"]'
  evidence_root: evidence/browser-smoke
  resource_status_preflight: true
```

### Why these choices
- `execution_mode: swarm_session` (not a mythical `browser` mode).
- `scopes: [vxg/swarm2-main]` ties the package to a specific VXG graph; target fingerprint staleness fires when that graph mutates.
- **No `vxg_id` field in the suite YAML** — the adapter derives it from the scope. Trying to set one rejects parse.
- Flat `viewport_width` / `viewport_height` — not a nested object.
- `playwright` sub-block controls browser automation; there is no author-facing interaction-script field.
- `path_globs` records the intended source scope; changes to matching UI/server
  files still need affected proof even if the stored projection remains fresh.

---

## 4. Mixed-mode package (checklist + command + session)

### Use case
A full-stack feature (UI + backend + interactive proof). The canonical shape for most real features.

### Package layout
```
test-packages/feature-x/
├── TESTS.md
├── docs/
│   ├── spec.md
│   ├── architecture.md
│   └── tdd.md
├── suites/
│   ├── backend-fast.yaml
│   ├── preview-checklist.md
│   └── browser-smoke.yaml
└── assets/
    └── reference-screenshots/
        └── feature-x-home-1920x1080.png
```

### `TESTS.md`
```yaml
---
package_id: verify.feature-x.full
name: Feature X Full Proof
kind: verification
package_version: "1.0.0"
layer_id: l2.5
description: End-to-end proof for Feature X — backend + UI + interaction.
tags: [feature-x, full-stack, mixed-mode]

source_of_truth:
  spec: docs/spec.md
  architecture: docs/architecture.md
  tdd: docs/tdd.md

bindings:
  scopes: [project/swarmnet, vxg/swarm2-main]
  territory_layers: [l2.5.feature-x]
  path_globs:
    - "crates/swarm-services/src/feature_x/**"
    - "agent-swarm-ui/packages/ui/src/apps/feature-x/**"
  work_unit_queries:
    - { label: feature-x-qa }

suites:
  - id: backend.fast
    proof_kind: automated
    execution_mode: command
    file: suites/backend-fast.yaml
    required_capabilities: [backend.assertions, persistence.assertions]

  - id: preview.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/preview-checklist.md
    required_capabilities: [capture.screenshot, capture.layout, capture.a11y]
    checklist_refs: [backend.fast]

  - id: browser.smoke
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/browser-smoke.yaml
    required_capabilities: [interaction.click, interaction.type, capture.screenshot, capture.dom]
---

# Feature X Full Proof

Mixed-mode proof for Feature X. Three suites:

- `backend.fast` — nextest fast-local lane, persistence + assertions.
- `preview.checklist` — manual rubric; presumes backend.fast has passed.
- `browser.smoke` — scripted browser smoke covering the main UI flow.

Run order: backend → session → checklist. Plan attachments typically make
`backend.fast` and `browser.smoke` blocking, `preview.checklist` advisory.
```

### `suites/backend-fast.yaml`
```yaml
lane: fast-local
packages: [swarm-services]
paths: [crates/swarm-services/src/feature_x]
```

### `suites/preview-checklist.md`
```markdown
# Feature X Preview Rubric

Manual visual + a11y review of the Feature X home view.

## Visual items

- **home-view-renders**: `/feature-x/home` renders at 1920×1080 with three panels (sidebar, main, details) visible. Compare to `assets/reference-screenshots/feature-x-home-1920x1080.png`.
- **empty-state-copy**: With no items, empty state shows "No items yet. Create your first …" per spec section 3.2.

## Accessibility items

- **a11y-focus-order**: Tab from top-left; focus order is sidebar → main toolbar → main content → details pane. No focus traps.
- **a11y-aria-landmarks**: Page exposes `<nav>`, `<main>`, `<aside>` landmarks. Screen reader announces each.
```

### `suites/browser-smoke.yaml`
```yaml
profile: vxg-preview-default
bundle: vxg_preview@1
target_kind: preview
preview_target: page
page_id: feature-x-home
viewport_width: 1920
viewport_height: 1080
playwright:
  route: feature-x-home
  ready_selector: '[data-feature-x-ready="true"]'
  evidence_root: evidence/feature-x-browser
```

### Why these choices
- Three suites covering the three proof axes (backend / visual / interactive).
- `checklist_refs: [backend.fast]` signals that the visual checklist presumes backend is healthy.
- Two scopes: `project/swarmnet` AND `vxg/swarm2-main` — both are subjects.
- `work_unit_queries` ties suite selection to work items labeled `feature-x-qa`.
- **Legacy Markdown-bullet mode** for the checklist because all four items share the same capability set (the suite-level `[capture.screenshot, capture.layout, capture.a11y]` covers both visual and a11y items). If you wanted the two a11y items to require an extra `axe.run` capability, promote the checklist to structured mode (see Example 5) and override `required_capabilities` on just those items.

---

## 5. VXG map rendering package (checklist + session)

### Use case
Visual + scripted proof of a specific VXG map page, including shell/slot layout verification. Pattern for any canvas UI feature.

### Package layout
```
test-packages/vxg-map-rendering/
├── TESTS.md
├── docs/
│   ├── spec.md
│   └── visual-reference.md
└── suites/
    ├── shell-layout.md
    └── canvas-interaction.yaml
```

### `TESTS.md`
```yaml
---
package_id: verify.vxg-map.rendering
name: VXG Map Rendering Proof
kind: verification
package_version: "1.0.0"
layer_id: l2.5
description: Shell/slot/canvas rendering proof for the VXG map page at swarm2.
tags: [vxg, canvas, shell, rendering]

source_of_truth:
  spec: docs/spec.md

bindings:
  scopes: [vxg/swarm2-main]
  territory_layers: [l2.5.vxg-map]
  path_globs:
    - "agent-swarm-ui/packages/ui/src/apps/vxg-map/**"
    - "agent-swarm-ui/packages/ui/src/canvas/**"

suites:
  - id: shell.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/shell-layout.md
    required_capabilities: [capture.layout, capture.screenshot]

  - id: canvas.interaction
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/canvas-interaction.yaml
    required_capabilities:
      - interaction.click
      - interaction.scroll
      - capture.dom
      - capture.screenshot
      - capture.layout
---

# VXG Map Rendering Proof

Two suites:
- `shell.checklist` — per-slot layout verification (header, rails, dock, status, content).
- `canvas.interaction` — scripted interaction (pan, zoom, node click, selection).
```

### `suites/shell-layout.md` (structured mode — YAML frontmatter)
```markdown
---
items:
  - title: shell-header-height
    description: Shell header renders at 44px (DEFAULT_SHELL_HEADER_HEIGHT).
    severity: high
    tags: [shell, layout]
  - title: shell-top-nav-height
    description: Top nav renders at 44px (DEFAULT_TOP_NAV_HEIGHT).
    severity: high
    tags: [shell, layout]
  - title: shell-rail-left-width
    description: Left rail slot width is 280px.
    severity: medium
    tags: [shell, layout, rail]
  - title: shell-rail-right-width
    description: Right rail slot width is 280px.
    severity: medium
    tags: [shell, layout, rail]
  - title: shell-dock-bottom-height
    description: Bottom dock renders at 118px (DEFAULT_DOCK_HEIGHT).
    severity: high
    tags: [shell, layout, dock]
  - title: shell-status-overlay
    description: Status bar (28px, DEFAULT_STATUS_HEIGHT) overlays bottom of content without clipping.
    severity: medium
    tags: [shell, layout, status]
  - title: canvas-octagon-centered
    description: Octagon map centered horizontally + vertically in content slot. Glassmorphism container visible; gradient glow rendered.
    severity: high
    tags: [canvas, visual]
    required_capabilities: [capture.screenshot, capture.layout]
    automation_hint: "DOM selector [data-octagon-map] should have computed transform containing translate() centering values; expect non-empty filter or backdrop-filter for the glass layer."
  - title: canvas-nav-island-floats
    description: Floating navigation island renders in top-right content area; shadow/blur visible.
    severity: medium
    tags: [canvas, visual]
    required_capabilities: [capture.screenshot]
---

# Shell + Slot Layout Checklist

Each item in the YAML frontmatter above is parsed into a runtime checklist
item with its own severity / tags / capability overrides. Prose below the
frontmatter is ignored by the parser when `items:` is present — keep human
context here as needed.
```

### `suites/canvas-interaction.yaml`
```yaml
profile: vxg-preview-default
bundle: vxg_preview@1
target_kind: preview
preview_target: shell
viewport_width: 1920
viewport_height: 1080
playwright:
  route: vxg-map-shell
  ready_selector: '[data-vxg-shell-ready="true"]'
  evidence_root: evidence/canvas-interaction
  resource_status_preflight: true
```

### Why these choices
- **Structured-mode checklist.** YAML frontmatter with an `items:` array lets each slot carry its own `severity`, `tags`, and (where useful) `required_capabilities` / `automation_hint`. The dimension slots stay at suite-level capabilities (`capture.layout` is enough); `canvas-octagon-centered` overrides to also require `capture.screenshot` because the glass gradient is the feature signature, and gets an `automation_hint` that nudges the reviewer to inspect computed styles on `[data-octagon-map]`.
- **One item per shell slot.** Distinct observations make affected review precise.
  `title` is a criterion label, not the generated runtime `chk-*` ID. Unaffected
  items can retain acceptance when their captured inputs and obligations match.
- **Severity mix.** Dimension drift on the shell header / top nav / dock is `high` because those regions drive the whole layout math; rail widths and status-overlay positioning are `medium`. Legacy Markdown-bullet mode — see Examples 1 and 4 — would hardcode every item to `Medium`.
- **VXG-specific scope** (`vxg/swarm2-main`) anchors the target fingerprint; if the underlying graph mutates, the instance stales automatically.
- `playwright.route: vxg-map-shell` — a named route in the `vxg_preview@1` bundle's route table.

---

## 6. OCI-published + plan-attached package

### Use case
A package authored in-repo, published to an OCI registry, then attached to a plan as a blocking gate on a specific phase.

### In-repo authoring (`test-packages/merge-gate-smoke/TESTS.md`)
```yaml
---
package_id: verify.merge-gate.smoke
name: Merge-Gate Smoke
kind: verification
package_version: "2.3.1"
layer_id: l1
description: Merge-gate blocking smoke for backend + gateway.
tags: [merge-gate, smoke, backend, gateway]

source_of_truth:
  spec: docs/spec.md
  architecture: docs/architecture.md

bindings:
  scopes: [project/swarmnet]
  path_globs:
    - "crates/swarm-services/**"
    - "crates/swarm-gateway/**"
    - "swarmd/**"

suites:
  - id: backend.merge
    proof_kind: automated
    execution_mode: command
    file: suites/backend-merge.yaml
    required_capabilities: [backend.assertions]

  - id: gateway.merge
    proof_kind: automated
    execution_mode: command
    file: suites/gateway-merge.yaml
    required_capabilities: [backend.assertions]

  - id: health.probe
    proof_kind: automated
    execution_mode: command
    file: suites/health-probe.yaml
    required_capabilities: [backend.assertions]
---

# Merge-Gate Smoke

Dual-crate nextest smoke + an HTTP health probe. Every suite uses `ci-merge`
lane for hosted T2 validation, plus one http_probe against the live gateway.
```

### `suites/backend-merge.yaml`
```yaml
lane: ci-merge
packages: [swarm-services]
paths: [crates/swarm-services]
```

### `suites/gateway-merge.yaml`
```yaml
lane: ci-merge
packages: [swarm-gateway, swarmd]
paths:
  - crates/swarm-gateway
  - swarmd
```

### `suites/health-probe.yaml`
```yaml
# Non-routed integration: HTTP probe against the live gateway.
integration: http_probe
http_probe:
  method: GET
  url: http://127.0.0.1:9847/health
  headers:
    Accept: application/json
```

### Publish flow
```bash
# 1. Validate locally first
agent-swarm verify package validate test-packages/merge-gate-smoke --format json

# 2. Publish to OCI (signs + pushes + updates catalog)
agent-swarm verify package publish test-packages/merge-gate-smoke \
  --target oci://registry.example.com/verify \
  --format json
# → { "artifact_id": "verify-artifact-1220...", "digest": "sha256:abc...",
#      "reference": "oci://registry.example.com/verify/merge-gate-smoke:2.3.1@sha256:abc..." }
```

### Plan attachment (in a plan package YAML — NOT in TESTS.md)
```yaml
# Excerpt from some/plan/package.yaml
verification_packages:
  - attachment_id: verify.merge-gate.primary
    package_ref: oci://registry.example.com/verify/merge-gate-smoke@sha256:abc...
    phases: [merge-gate]
    suite_selectors: [backend.merge, gateway.merge, health.probe]
    gate_policy: blocking
    freshness_policy: strict
```

### Pull flow (on a different node)
```bash
# Pull + verify digest + signature
agent-swarm verify package pull oci://registry.example.com/verify/merge-gate-smoke@sha256:abc... \
  --format json
# → { "staged_package_ref": "local://staged/merge-gate-smoke", "signature_verified": true }

# Instantiate from staged ref (same as local)
agent-swarm verify instantiate local://staged/merge-gate-smoke --format json
```

### Why these choices
- **`ci-merge` lane** — hosted T2, one retry, 120s timeout; appropriate for merge-gate blocking.
- Three suites: two broader routed checks and one dedicated HTTP adapter. A
  supported explicit command could also run a real health assertion; choose the
  adapter that gives the required proof and inspect its result semantics.
- Paths in backend-merge and gateway-merge are routing hints. They do not exclude
  unrelated tests by name, and policy can expand the resolved scope. Inspect the
  planned commands and actual matched inventory before claiming gate coverage.
- **Digest-pinned package_ref** in plan YAML — content changes require publishing a new digest; staleness is automatic.

---

## Pattern cheat-sheet

| Scenario | Suite pattern |
|---|---|
| Pure human review | 1 × checklist (Markdown bullets) |
| Pure backend unit tests | command with exact `-p`, `--lib` and test selectors; requested `fast-local` |
| Backend integration | 1 × command (`feature-local`) |
| Backend merge-gate | 1 × command (`ci-merge`) |
| Backend nightly heavy | 1 × command (`nightly-extended`) |
| Liveness / HTTP health | 1 × command with `integration: http_probe` |
| Persistence assertion against event store | 1 × command with `integration: sql_probe` |
| MCP tool invocation | 1 × command with `integration: mcp_call` |
| VXG preview smoke | 1 × swarm_session |
| VXG preview full | 1 × checklist + 1 × swarm_session |
| Full-stack feature | 1 × command + 1 × checklist + 1 × swarm_session |
| Multi-crate merge-gate | 2+ × command (`ci-merge`), one per crate group |
| Design review (no automation) | 1 × checklist |

## Staleness-expectations cheat-sheet

| Change | What stales | Fix |
|---|---|---|
| Edit `TESTS.md` | Semantic contract changes can stale affected acceptance; metadata/body edits are not universally new identities | Validate, plan and adopt a lineage delta; inspect carryover instead of minting a reset |
| Edit `docs/spec.md` | All suites (SourceOfTruthDoc) | Re-run after confirming contract intent |
| Edit `suites/backend-fast.yaml` | Its `SuiteFile` reason; lineage semantic-core changes can also affect shared inputs | Inspect actual stale/carryover results and rerun affected proof |
| Add `capture.a11y` to a suite | Changed capability/definition inputs | Reconcile the package delta and rerun/review affected proof |
| VXG graph mutates | Session suites whose target_fingerprint changed (TargetFingerprint) | Re-run affected session suites |
| Watched territory layer version changes | `SkeletonLayerVersion` input | Follow the actual gate freshness policy; optional binding does not mean advisory |
| Edit a matched product-source file | No automatic content watch from `path_globs` | Run the affected proof using change scope |
| Edit the declared glob set or router | `RoutingSurface` when the captured channel exists | Inspect routing and rerun affected acceptance |
| Edit one checklist item | Changed item/input/evidence obligations reset; compatible neighbors may retain judgments | Inspect item migration and review the changed criteria |
| Plan attachment context changes | All suites (PlanBinding / WorkBinding) | Plan-level; not a package-author concern |

## Plan-attachment policy cheat-sheet

| Phase | Typical gate policy | Typical freshness policy |
|---|---|---|
| Dev inner loop | advisory | allow_stale |
| Feature local | advisory | allow_stale |
| Phase gate | blocking | strict |
| Pre-merge (T1) | blocking | strict |
| Merge gate (T2) | blocking | strict |
| Nightly | advisory | strict |
| Release readiness | blocking | strict |
