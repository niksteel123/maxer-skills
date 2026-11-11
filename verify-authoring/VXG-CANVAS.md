# Verify Authoring — VXG / Canvas Packages

Authoring guidance for verification packages that target VXG graphs, canvas UI surfaces, preview routes, shells/slots, and design-reference comparisons. Read SKILL.md + CORE.md first.

## When to author a VXG-scoped package

Write a VXG-scoped package when the proof obligation concerns:

- A VXG map page or canvas surface (tldraw shapes, shell layout, slot geometry).
- A VXG preview route (component, shell, page-mode renders).
- A design-linked node (`design_ref`) — visual correctness of rendered output vs the pinned design.
- Interaction flows that only make sense in the browser (click, type, scroll, navigate).
- Component renders at a specific viewport (breakpoint-sensitive UI).
- Accessibility / layout correctness of rendered UI.

If the proof is a pure-logic Rust test, use a backend command suite instead (BACKEND.md).

## Package layout conventions

```
test-packages/vxg-map-proof/
├── TESTS.md
├── docs/
│   ├── spec.md              # source_of_truth.spec (required)
│   └── visual-reference.md  # (optional) human-readable design intent
├── suites/
│   ├── preview-checklist.md  # checklist items
│   ├── preview-session.yaml  # swarm_session (browser) suite
│   └── a11y-checklist.md     # optional a11y-specific items
└── assets/
    └── reference-screenshots/
        └── map-home-1920x1080.png
```

## Canonical scopes

VXG-scoped packages typically bind to one or more of:

| Scope | Use when |
|---|---|
| `vxg/<vxg-id>` | Proof targets a specific VXG graph (most common) |
| `project/<project-id>` | Proof targets the project as a whole (`vxg_id == project_id` for project-scoped VXGs) |
| `design/<design-id>` | Proof targets a specific design artifact |

```yaml
bindings:
  scopes: [vxg/swarm2-main]
  # Declared scope; matched source-file content is not automatically hashed:
  path_globs:
    - "agent-swarm-ui/packages/ui/src/apps/vxg-map/**"
    - "agent-swarm-ui/packages/ui/src/canvas/shapes/**"
  territory_layers:
    - l2.5.vxg-map
```

## Pattern A — Checklist + Manual (visual/human-graded)

Use when acceptance requires visual judgment: "does this match the reference?",
"is the spacing consistent?", or "is the avatar legible during this replay?".
An agent may review retained captures; require a human only when the criterion
needs human perception or physical interaction. Automate deterministic geometry
or latency thresholds and retain their measurements separately from judgment.

### Suite frontmatter

```yaml
evidence_contract:
  run_root_glob: evidence/vxg-proof/*
  required_artifacts: [preview.png]
suites:
  - id: preview.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/preview-checklist.md
    required_capabilities:
      - capture.screenshot
      - capture.layout
    optional_capabilities:
      - capture.a11y
```

### Suite file format (checklist manifest)

Use structured YAML frontmatter in `suites/preview-checklist.md` for new
checklists. The opening `---` selects the structured parser; the Markdown body
after the closing fence is commentary. Supported item fields are `title`,
`description`, `severity`, `tags`, `required_capabilities` and `automation_hint`.
Unknown fields, including authored `id`/`item_id`, reject at checklist parse time.

```markdown
---
items:
  - title: title-bar-renders
    description: Compare title bar width, icons and labels with the pinned reference at 1920x1080.
    severity: high
    tags: [layout, chrome]
    required_capabilities: [capture.screenshot]
    automation_hint: Cite preview.png after comparing the retained render with the reference.
  - title: octagon-map-centered
    description: Review centering, gradients and clipping at the same viewport.
    severity: medium
    automation_hint: Cite preview.png and record the visual comparison reasoning.
---
# Preview Checklist

Record the reference identity, capture inputs and actual reviewer observation.
```

### What authors CAN set

| Part | Source | Notes |
|---|---|---|
| `title`, `description` | Structured item fields | Title is required and nonempty; both are trimmed. Keep criterion traceability without treating the title as a runtime ID. |
| `severity` | Structured item field | `low`, `medium` (default), `high`, `critical`. |
| `tags` | Structured item field | Defaults empty. |
| `required_capabilities` | Structured item field | Inherits suite requirements when omitted; supplied values are normalized. |
| `automation_hint` | Structured item field | Maps concrete artifact names from `evidence_contract.required_artifacts` to this item; prose is not an automatic test. |

### Legacy files and identity

Without opening YAML frontmatter, the legacy parser extracts Markdown bullets
`- `, `* ` and `+ `: bold text becomes title and the remainder description.
Severity defaults to medium, capabilities inherit from the suite, and tags/hint
are empty. Do not place unfenced YAML in that mode: its list lines can be
misread as checklist items. Prefer structured fields over severity encoded in
a title prefix.

Both modes return generated opaque `chk-*` IDs. Without a predecessor digest,
IDs derive from suite ID and ordinal; with `lineage.previous_digest`, they derive
from suite ID, trimmed title/description and a duplicate-content tiebreak. Parser
mode alone does not choose identity. Inspect migration after inserting/reordering
legacy items; preserve unchanged acceptance only when its inputs and evidence
obligations match. A neighboring edit no longer implies a whole-checklist reset.

### Verdict targeting

Use the actual ID returned by checklist list, never a title or fabricated ordinal:

```bash
agent-swarm verify checklist list --instance-id <id> --suite-id preview.checklist --format json
```

The full item list (with derived ids) is visible via `agent-swarm verify checklist list --instance-id <id> --suite-id <suite>` — always cross-reference it before writing verdicts.

### Verdict workflow (at runtime)

```bash
# 1. Start a pass — scopes all subsequent verdicts
agent-swarm verify checklist pass start --instance-id <id> --suite-id preview.checklist
# → { "pass_id": "pass_..." }

# 2. Set a verdict per item (verifier reviewed the item)
agent-swarm verify checklist verdict set \
  --instance-id <id> \
  --suite-id preview.checklist \
  --item-id <item-id-from-list> \
  --verdict pass \
  --reasoning "Renders correctly at 1920x1080; matches reference screenshot." \
  --evidence-ref evidence/vxg-proof/<run-id>/preview.png \
  --pass-id <pass_id>

# 3. Close the pass with a summary
agent-swarm verify checklist pass finish \
  --instance-id <id> \
  --suite-id preview.checklist \
  --pass-id <pass_id> \
  --summary "All 8 items verified; minor a11y note on item-4."
```

### When to use checklist vs swarm_session

Choose **checklist** when:
- The verifier is a human or an AI acting as a visual reviewer.
- Judgement is inherently subjective ("does this look right?").
- The proof needs to capture nuance that isn't easily expressible in code.
- You want a persistent audit trail of who reviewed what, when.

Choose **swarm_session** when:
- The proof is deterministic ("this button, when clicked, produces this event").
- You want it to run in CI without human intervention.
- Interactions are scripted and repeatable.

## Pattern B — Automated + SwarmSession (browser/preview)

Use when the proof is a scripted browser interaction against a VXG preview route or the rendered app.

### Suite frontmatter

```yaml
suites:
  - id: browser.smoke
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/browser-smoke.yaml
    required_capabilities:
      - interaction.click
      - interaction.scroll
      - capture.screenshot
      - capture.dom
      - capture.layout
    optional_capabilities:
      - trace.semantic
      - trace.dom
      - capture.a11y
```

### Suite file format (swarm_session spec)

The file is YAML or JSON, parsed into `VerificationSwarmSessionSuiteSpec` (`crates/swarm-services/src/verify/execution/swarm_session.rs:29-70`). `#[serde(deny_unknown_fields)]` is enforced — **any unknown field rejects parse**. All fields are flat; there is NO nested `target:` or `viewport:` object.

Canonical `suites/browser-smoke.yaml`:

```yaml
# Session-level — what target to open and how
profile: vxg-preview-default       # alias: profileId
bundle: vxg_preview@1               # alias: bundleId
target_kind: preview                # alias: targetKind
preview_target: shell               # alias: previewTarget — shell | page | component
node_id: vxg-map-shell              # alias: nodeId — optional VXG node selector
viewport_width: 1920                # alias: viewportWidth — flat, NOT nested
viewport_height: 1080               # alias: viewportHeight — flat, NOT nested

# Browser automation (optional; include when the suite drives Playwright)
playwright:
  route: vxg-map-shell              # named route in the tool bundle's route table
  ready_selector: '[data-ready="true"]'   # wait for this selector before capture
  viewport_width: 1920              # may override session viewport
  viewport_height: 1080
  evidence_root: evidence/browser-smoke    # where retained artifacts land
  resource_status_preflight: true   # default true; preflight resource-status check

fresh: false                        # true = force-spawn a new session
keep_session: false                 # true = keep session alive after run
```

### Swarm_session field semantics (authoritative — flat structure)

| Field | camelCase alias | Purpose |
|---|---|---|
| `profile` | `profileId` | Execution profile ID (browser kind, headless/headful, viewport defaults). Defaults to `"vxg-preview-default"` if omitted. |
| `bundle` | `bundleId` | Tool bundle ref. Defaults to `"vxg_preview@1"` if omitted. |
| `adapter_kind` | `adapterKind` | Discriminator for which runtime adapter handles execution. |
| `target_ref` | `targetRef` | Explicit target reference, overrides scope-derived one. |
| `target_kind` | `targetKind` | `VxgTestTargetKind` discriminator. Typical: `"preview"`. |
| `runtime_scope` | `runtimeScope` | `VxgTestRuntimeScope` discriminator. |
| `preview_target` | `previewTarget` | `"shell"` / `"page"` / `"component"` (maps to `VxgPreviewTarget`). |
| `shell_id` | `shellId` | VXG shell ID to focus (when `preview_target: shell`). |
| `page_id` | `pageId` | VXG page ID to focus. |
| `viewing_mode` | `viewingMode` | Shell viewing-mode override. |
| `layout_mode_id` | `layoutModeId` | Shell layout-mode override. |
| `style_mode_id` | `styleModeId` | Shell style-mode override. |
| `node_id` | `nodeId` | Specific VXG node to focus. |
| `implementation_ref` | `implementationRef` | Bind-time ref for the implementation under test. |
| `viewport_width` | `viewportWidth` | Flat viewport width (u32). Do NOT use a nested `viewport:` object. |
| `viewport_height` | `viewportHeight` | Flat viewport height (u32). |
| `playwright` | — | Optional sub-block for browser automation. See next table. |
| `fresh` | — | Bool. `true` = spawn a new session instead of reusing. Default `false`. |
| `keep_session` | — | Bool. `true` = keep session alive after run completion. Default `false`. |

### Playwright sub-block

`playwright:` is a nested object parsed into `VerificationPlaywrightSuiteSpec` (`playwright.rs:150-168`). Include it when the suite drives actual browser automation.

| Field | camelCase alias | Purpose |
|---|---|---|
| `route` | — | Named route in the tool bundle's route table. Has a bundle-provided default. |
| `ready_selector` | `readySelector` | CSS selector to wait for before capturing evidence. Optional. |
| `viewport_width` | `viewportWidth` | Optional override of the session-level viewport. |
| `viewport_height` | `viewportHeight` | Optional override. |
| `evidence_root` | `evidenceRoot` | Directory for retained evidence artifacts. Default `evidence/playwright`. |
| `resource_status_preflight` | `resourceStatusPreflight` | Run resource-status preflight before the browser session. Default `true`. |

### What is NOT in the schema (these reject parse)

- `profile_id:` → wrong name. Use `profile:` (snake_case) or `profileId:` (camelCase alias).
- `tool_bundle_ref:` → wrong name. Use `bundle:` or `bundleId:`.
- Nested `target: { kind, vxg_id, preview_target, node_selector }` → fields are flat (`target_kind`, `preview_target`, `node_id`, etc.). There is no `vxg_id` field at all — VXG is inferred from `bindings.scopes`.
- Nested `viewport: { width, height }` → flat `viewport_width` / `viewport_height`.
- `interaction_script: scripts/...ts` → no such field. Browser automation is configured via the `playwright:` sub-block.
- `expected_evidence: [...]` → no such field. Evidence is runtime-emitted based on capabilities + the Playwright runtime's built-in capture hooks.

If you need custom interaction logic beyond what `playwright:` supports, that's additional infra work — not an authoring concern.

### How preview URL gets resolved

You don't put the preview URL in the suite file. The VXG adapter resolves it at instantiate/run time from:
- `target.vxg_id` + `target.preview_target` + `target.node_selector`
- swarmd's current gateway origin (typically `http://127.0.0.1:9847/preview/...`)
- Runtime shell/page overrides if the plan specifies them

The suite should describe **what it wants** (a VXG target); the adapter decides **where** (the concrete URL).

### Browser automation — the Playwright sub-block is the only knob

The current `VerificationSwarmSessionSuiteSpec` does **not** expose a script-file field. Browser driving happens inside the runtime itself, configured by the `playwright:` sub-block. Authors control:

- `route` — named route in the tool bundle's route table (each bundle ships its own route table; pick the one your target implies).
- `ready_selector` — CSS selector the runtime waits for before capturing evidence.
- `viewport_width` / `viewport_height` — optional overrides.
- `evidence_root` — directory under the session workspace for retained evidence artifacts.
- `resource_status_preflight` — whether to preflight the resource-status check (default `true`).

What the runtime does on its own (authors don't script it):
- Opens the route under the requested profile/viewport.
- Waits for `ready_selector` (or a bundle default).
- Captures a baseline screenshot + DOM snapshot if the suite's capabilities include `capture.screenshot` / `capture.dom`.
- Retains artifacts under `evidence_root`, which appear in `named_evidence_refs` after the run.

If you need custom interaction scripts (click/type/scroll flows), that's additional infra work — open a feature request rather than inventing a field in the suite YAML; `deny_unknown_fields` will reject anything not in the struct.

## Pattern C — Mixed-mode (the common case)

Most VXG features benefit from both checklist + swarm_session. The checklist catches what a browser script can't (visual judgement), the session catches what humans can't keep up with (every interaction, every render).

```yaml
suites:
  - id: preview.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/preview-checklist.md
    required_capabilities: [capture.screenshot, capture.layout]

  - id: browser.smoke
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/browser-smoke.yaml
    required_capabilities: [interaction.click, capture.screenshot, capture.dom]

  - id: a11y.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/a11y-checklist.md
    required_capabilities: [capture.a11y]
    checklist_refs: [browser.smoke]   # a11y pass should happen after browser state settles
```

`checklist_refs` validates references to other suites; it does not schedule or
prove prerequisite execution. If review depends on a capture or settled browser
state, explicitly run that producer and review its retained artifact. Reuse the
capture when its relevant inputs remain valid.

## Design-reference comparison

VXG nodes can carry a first-class `design_ref` pointing at a SwarmCanvas `.pen` snapshot. Use it as the visual reference for prototype parity. If the UVP suite schema you are authoring does not have a dedicated suite-level design reference field, anchor the proof in the target VXG scope and add explicit checklist items that name the linked design/design id.

Prefer MCP for design evidence:

```text
design_context({ vxgNode, projectId })
design_screenshot({ designId, projectId, scale: 1 })
design_read({ designId, projectId, depth: 3 })
```

CLI fallback:

```markdown
## Visual reference items

- **matches-linked-design-reference**: Octagon map matches the linked SwarmCanvas/Pencil reference at `design/home-v2`. Check gradient colors, octagon vertex positions, glow radius, label typography, rounded corners, connector curves, and clipping. Compare `agent-swarm design screenshot --design design/home-v2 --project swarm2 --scale 1 --format json` against the VXG preview route for `/preview/?component=SwarmOctagonMap`.
```

When a dedicated suite-level design-reference field exists in the package schema, use it. Until then, keep the visual reference explicit in checklist item text and evidence notes.

## Shell / slot-scoped items

When verifying shell composition (navigation rails, top bars, status bars, content areas, dock panels), one bullet per slot region gives tight blame when something breaks:

```markdown
## Shell slot items

- **shell-rail-left-width**: Left rail slot renders at 280px width (from DEFAULT_CONTENT_WIDTH in shell.ts).
- **shell-top-nav-height**: Top nav slot renders at 44px height (DEFAULT_TOP_NAV_HEIGHT).
- **shell-dock-bottom-height**: Bottom dock slot renders at 118px height (DEFAULT_DOCK_HEIGHT).
- **shell-status-bar-overlays-content**: Status bar renders as overlay at bottom of content area, 28px height (DEFAULT_STATUS_HEIGHT). Content below must not be clipped.
- **shell-rail-right-width**: Right rail slot renders at 280px width.
```

The bullets above illustrate criterion wording. Use structured frontmatter when
the items need severity, tags, capability overrides or artifact hints. Legacy
bullets inherit suite-level capabilities and medium severity.

## Interaction with `agent-browser` skill

For **local dev iteration** on a VXG package, `agent-browser` is faster than running a full swarm_session suite. Use it to:

- Open the preview route at `http://127.0.0.1:9847/preview/<vxg_id>...` or `http://127.0.0.1:3000/ui/vxg-map/?project=<id>`
- Capture screenshots for manual verdict evidence.
- Inspect DOM / computed styles to validate layout constraints.
- Iterate on the checklist items while the suite definition stabilizes.

Codify repeatable deterministic interactions through a supported adapter when
useful. Keep visual/video judgments as checklists; do not replace review with
the fact that a screenshot or replay was generated.

## Viewport + breakpoint discipline

When a checklist item or swarm_session asserts layout, always pin the viewport. Don't write "sidebar should be 280px" without declaring "at 1920x1080 viewport". `DesignArtboardShapeUtil` supports breakpoints `[320, 375, 414, 768, 1024, 1280, 1440, 1920]`; checklist items that verify layout should pick one breakpoint per item (or create parallel items per breakpoint).

## Evidence handling

For checklist verdicts, the verifier can attach evidence refs (screenshots, DOM snapshots, CAS blobs) at verdict time:

```bash
agent-swarm verify checklist verdict set \
  --instance-id <id> \
  --suite-id preview.checklist \
  --item-id <item-id-from-list> \
  --verdict pass \
  --reasoning "Verified via screenshot: see CAS digest." \
  --evidence-ref cas://verify/sha256/<retained-sha256> \
  --pass-id <pass_id>
```

Required passing judgments resolve retained bytes through the service; the CAS
ref must already resolve, or provide a readable retained path. Reviewer identity,
reasoning and coverage of the item's declared artifact obligations are checked.
Merely typing an artifact-looking string is insufficient. Declare the contract
with `evidence_contract`, and do not hand-author `named_evidence_refs`.

For swarm_session suites, verify that the selected adapter actually captures the
required evidence. Capabilities and a generated capture are not acceptance by
themselves.

## Gotchas specific to VXG/canvas authoring

1. **No `browser` execution mode.** Use `swarm_session`. If you author `execution_mode: browser`, `verify.package.validate` rejects with `unsupported proof_kind/execution_mode pair`.
2. **Preview URL is resolved by the adapter, not declared.** Don't hard-code `http://127.0.0.1:9847/preview/...` in the suite; declare the target and let the VXG adapter resolve.
3. **Viewport matters for layout checklists.** Items that verify pixel widths/heights must declare the viewport — otherwise the verdict is ambiguous.
4. **tldraw shapes are in TypeScript source, not in the VXG graph.** The graph models what should render; the shape utils render it. Checklists that assert visual correctness are really asserting the whole pipeline (graph → materializer → shape util → tldraw rendering). A red checklist doesn't tell you which layer is broken.
5. **Distinguish node-level and suite-level design refs.** VXG nodes can carry `design_ref`; some UVP suite schemas may still need explicit checklist wording for the reference. Always render/read the linked SwarmCanvas registry design, not a stale local `.pen` copy.
6. **Headful vs headless matters.** Some visual effects (glassmorphism, backdrop-filter, gradient glows) render differently in headless Chrome. Use `capture.screenshot` + pin a headful profile if visual exactness is the contract.
7. **Shell overrides can change what renders.** If the plan specifies `VxgShellRouteOverrides`, the rendered preview may not match a naive default. Pin the override set in the suite spec if needed (future field).
8. **Interaction scripts should wait for stability, not time.** Use DOM-based waits (`page.waitFor('.selector')`) instead of `page.sleep(500)`. Timer-based scripts flake in CI.
9. **DOM snapshots can be huge.** `capture.full_document` emits the entire scrollable document; use `capture.dom` (viewport-only) unless you truly need full-document.
10. **VXG preview routes require swarmd to be up.** Schedules that run when swarmd is down will fail with network errors. If your schedule is drift-triggered on a VXG scope, ensure swarmd availability is a precondition.

## Minimum viable VXG package checklist (as a literal file)

Save this as `test-packages/my-vxg-proof/TESTS.md` to get a running start:

```yaml
---
package_id: verify.my-vxg-proof
name: My VXG Proof
kind: verification
package_version: "1.0.0"
layer_id: l2.5
description: Visual + interaction proof for the <feature> VXG graph.
tags: [vxg, canvas, preview]

source_of_truth:
  spec: docs/spec.md

bindings:
  scopes: [vxg/my-vxg-id]
  path_globs:
    - "agent-swarm-ui/packages/ui/src/apps/vxg-map/**"

suites:
  - id: preview.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/preview-checklist.md
    required_capabilities: [capture.screenshot, capture.layout]

  - id: browser.smoke
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/browser-smoke.yaml
    required_capabilities: [interaction.click, capture.screenshot, capture.dom]
---

# My VXG Proof

(Human-facing documentation. Describe what the package covers, the canonical
reference viewport, and any preconditions.)
```

Then create `docs/spec.md`, `suites/preview-checklist.md`, and `suites/browser-smoke.yaml`, and run `agent-swarm verify package validate test-packages/my-vxg-proof`.
