---
name: vxg-testing
description: VXG native testing and handoff framework. Use when creating manifests, compiling suites, running preview or implementation VXG tests, checking reports and greenlight, validating SwarmCanvas design_ref to prototype continuity, inventorying pages by feature, or deciding when to use browser automation tooling for rendered proof. For SwarmCanvas design creation/editing, load swarm-design-ops and prefer Agent Swarm MCP tools.
---

# VXG Testing

Use this skill when the task is manifest authoring, suite compilation, test execution, evidence inspection, or readiness gating for VXG targets.

## IMPORTANT — Unified Verification Packages (UVP) Is Now the Primary Surface

Proof topology, evidence lifecycle, checklist verdicts, report/greenlight projections, catalog, schedules, and templates moved out of VXG-local ownership into the shared **verify** L1 domain. VXG is the **first adapter** consuming shared verify core; its UI + preview resolution + browser runtime stay here.

- For authoring/validating/publishing/pulling verify packages (`TESTS.md`), instantiating, running suites, checklist pass/verdict lifecycle, reading reports, greenlight, catalog search, schedules, and templates — **use the `verify-ops` skill** (`verify_*` MCP tools / `agent-swarm verify …` CLI). That is the canonical authored surface.
- `vxg test ...` remains as a **compatibility wrapper** during migration. Do not grow unique semantics in it. Everything new lands under `verify_*`.
- Use this skill for: VXG-local preview origin resolution, browser-runtime capability matching, rendered-proof decisions, manifest-to-suite wiring questions specific to the VXG adapter, and handoff-to-verify mechanics.

A handy ladder: if the question mentions **checklist items**, **verdicts**, **greenlight**, **runs**, **evidence bundles**, **TESTS.md**, **catalog**, **schedules**, or **templates** — open `verify-ops` first. If it mentions **preview route**, **agent_url**, **browser capabilities**, **headless targets**, or **VXG-specific proof ergonomics** — stay here.

## Truth Model

- VXG test state is event-sourced alongside VXG graph state in `swarmd`
- Tests are scoped to a single `vxg_id`
- Lifecycle (legacy VXG-local path; shared verify path mirrors this with richer semantics):
  - manifest source -> stored manifest -> compiled suite artifact -> event-sourced suites/cases -> run -> report -> greenlight gate
- The preview runtime is part of the execution path, not an optional extra

## Test Lifecycle

```text
.manifest.md file
    -> vxg test manifest add
VxgTestManifest
    -> vxg test manifest compile
CompiledTestSuiteArtifact (CAS)
    -> materialized into
VxgTestSuite + VxgTestCase[]
    -> vxg test run
VxgTestRun
    -> report / evidence readback
VxgTestReport
    -> vxg test greenlight
VxgTestGreenlightResult
```

## Preflight

Before debugging the wrong thing, confirm:

- active `vxg_id` (`agent-swarm vxg use <id>` or explicit `--vxg`)
- target exists in the graph
- runtime target JSON uses snake_case enum values
- required capabilities are available on the chosen runtime
- exactly one selector is used for `vxg test status`

Port/origin sanity check:

- the human web app may be on `http://127.0.0.1:3000`
- local proof may also legitimately use `3001`, `3002`, or `3003` if `3000` is occupied
- VXG preview `agent_url` is normally served from the swarmd API gateway origin, commonly `http://127.0.0.1:9847`
- if a browser step is opening `/vxg/dev/...`, attach it to the gateway base unless you have explicit evidence that a different origin is proxying that route correctly

Current local preview-origin resolution order:

1. `SWARM_UI_BASE_URL`
2. `SWARM_UI_E2E_WEB_PORT`
3. common local dev ports `3000-3003`

If a proof task is flaky because the web app moved off `3000`, prefer pinning `SWARM_UI_BASE_URL` explicitly instead of assuming the gateway is broken.

If the failure looks like session boot, adapter crash, or capture unavailability, also load `vxg-project-ops`.

## Feature Coverage Preflight

When the task targets a whole feature, starts from a feature key, or asks to
build/check every page in a feature, first ask VXG for the normalized page
inventory:

```bash
agent-swarm vxg query 'features where key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
```

Treat the `feature_pages` result as the coverage list. Every row should either
receive preview proof, a test/checklist item, or an explicit blocker note. The
row's `source` field matters in evidence because feature pages may come from
active `meta.pageVariants`, `meta.feature.pages`, or explicit feature
`contains` edges such as `contains:chat-app-page`.

For each row, use the normalized native fields instead of guessing shell/page
ids:

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

Human `/ui/vxg-map` links also map through this inventory. Parse `project` as
`--vxg`; parse `shell`, `selectedFeatureId`, or another `feature-*` value as
`feature_key`; parse `shellPage`, `page`, or another `page-*` value as
`page_key` or `native_page_id`. Then select the matching `feature_pages` row and
run preview/tests against its `native_shell_key` and `native_page_id`.

## Design-First TDD Loop

This is the default workflow. Do not treat VXG testing as something you add after the screen already exists.

### Agentic Verification Model

VXG testing uses an **agent-as-test-runner** model, not a deterministic step executor. Manifests define acceptance criteria. The AGENT verifies them using multimodal capabilities:

1. **Visual comparison:** Agent renders the design via `design_screenshot`, renders the prototype via VXG preview, and visually compares them. The agent judges fidelity — layout, fonts, colors, spacing.
2. **Font verification:** Agent inspects the DOM (via `vxg dev capture --kind dom`) to verify font families match the design (e.g., Inter for UI, Geist Mono for code).
3. **Interaction testing:** Agent uses browser automation against the `agent_url` to click elements, verify state changes, test navigation actions.
4. **Evidence capture:** Agent uses `vxg dev capture` to store screenshots, DOM snapshots, and traces as CAS-backed evidence.

**The deterministic `vxg test run` executor** handles graph-owned suite lifecycle (green/red/stale status, CAS evidence storage, greenlight gates). But the actual visual and interaction verification is done by the agent agentically.

### Design Reference During Prototyping

During prototype development, the linked SwarmCanvas design is the agent's ground truth. The agent uses TWO reference sources — visual AND structural:

```bash
# Step 1: Render the design blueprint (visual reference)
# Prefer MCP: design_screenshot({ designId, projectId, scale: 1 })
# CLI fallback:
agent-swarm design screenshot --design <DESIGN_ID> --project <PROJECT_ID> --scale 1

# Step 2: Read the design structure from the SwarmCanvas registry (code reference)
# Prefer MCP: design_read({ designId, projectId, depth: 3 })
# CLI fallback:
agent-swarm design read --design <DESIGN_ID> --project <PROJECT_ID> --depth 3
# Returns: fontFamily, fontSize, fill colors (hex+opacity), padding, gap,
# cornerRadius, gradients, layout direction — the EXACT values to use in code
# Do NOT use Pencil MCP batch_get on the source file — use the registry copy

# Step 3: Build the prototype using exact design token values from Step 2
# Do NOT approximate from screenshots — use the actual CSS values

# Step 4: Render the VXG prototype
agent-swarm vxg dev start --node <KEY> --target component
agent-swarm vxg dev capture --session <ID> --kind screenshot

# Step 5: Agent visually compares prototype render against design render
# - Layout matches?
# - Fonts correct? (exact family/size/weight from design data)
# - Colors match? (exact hex values from design data)
# - All text/elements present?

# Step 6: Iterate until match, then mark manifest assertions as verified
```

For creating or editing the SwarmCanvas design itself, stop here and load `swarm-design-ops`: use `design_write_html` or `design_instantiate_primitive` for creation, and structured-object `design_batch` for edits. Do not hand-author registry JSON outside the shared Design Registry methods.

**CRITICAL: Do NOT build prototypes from screenshots alone.** Read the `.pen` design structure via `design_read` to get exact CSS values. Screenshots show what it looks like; the design data tells you the exact values to use in code.

The manifest defines WHAT to check. The agent decides HOW to verify and WHETHER it passes.

Operator doctrine:

1. Pick the VXG target first.
2. If a SwarmCanvas blueprint is part of the task, create/edit it through MCP and link it as `design_ref` before prototype matching.
3. If the target node does not already carry a prototype binding, set it directly with `vxg node add|update --component-ref <PREVIEW_URL> --component-entry <ENTRY>`.
4. Write the manifest before polishing the component or screen.
5. Compile the manifest immediately so target-resolution and clause errors fail early.
6. Start preview and iterate the design against that manifest.
7. Prefer `playwright-interactive` on preview `agent_url` when you need true browser-rendered proof.
   Claude Chrome browser MCP is also acceptable when it is the better fit for the current session.
8. Re-run the preview suite until it is green.
9. Only then treat the VXG design as handoff-ready.
10. Bind `implementation_ref` and run implementation coverage after the preview blueprint is already green.

Default rule:

- preview green means the design/blueprint is ready for handoff
- stale or red preview coverage means the design is still in progress
- implementation coverage is the second stage, not the starting point

Hard rule:

- do not expect, require, or invent `implementation_ref` during normal design-stage VXG iteration
- while a screen is still being designed, the default loop is preview-only
- only introduce `implementation_ref` when a real production binding exists or when the task is explicitly prototype-to-production continuity proof

## Runtime Scope Decision Rules

Choose runtime scope based on what you are validating:

- `preview`
  - runs against a live VXG preview session
  - use while designing or validating the prototype itself
  - gives live preview traces, captures, state, and selection evidence
- `implementation`
  - runs against the implementation adapter selected by `implementation_ref`
  - use after the target has a real production binding
  - hard requirement:
    - the target must resolve to an `implementation_ref`
- `dual`
  - compiles as a parity intent (`VxgTestSuiteClass::Parity`)
  - current runtime limitation:
    - direct dual/parity execution is rejected
    - run preview and implementation suites separately today

Operator rule:

- use `preview` to get the blueprint green
- bind `implementation_ref`
- use `implementation` to validate the production surface
- treat `dual` as parity intent and reporting structure, not a currently executable one-shot runtime

Interpretation rule:

- if the user is still refining shell/page/component design, stay in `preview`
- if there is no legitimate production binding yet, `implementation` is the wrong runtime
- the existence of test or renderer-contract proof tasks does not change the normal authoring rule

## Ideal Workflow

1. Define or update the VXG target in the graph, including `component_ref` / `component_entry` when the prototype binding is not already present.
2. Author a manifest against the semantic target, not brittle implementation selectors.
3. Compile the manifest before doing major design work.
4. Preview the target with `vxg dev start` and iterate the prototype live.
5. Use browser automation tooling against preview `agent_url` whenever you need actual browser-rendered proof beyond VXG-native evidence.
   Prefer `playwright-interactive`; Claude Chrome browser MCP is also acceptable; use `agent-browser` when its lighter CLI workflow is the better fit.
6. Compile and run the preview suite until prototype coverage is green.
7. Bind `implementation_ref` on the same VXG node once production code exists.
8. Compile and run the implementation suite against that same target.
9. Check greenlight for the target and inspect blockers until both required surfaces are green.

Current CLI operator notes:

- `vxg test run --no-wait`
  - submits the run immediately and lets you poll with `status` / `report`
- `vxg test run --evidence-profile fast|full`
  - use `fast` for ordinary iteration when you care mainly about pass/fail
  - use `full` for battle-test, QA, and evidence-heavy handoff proof
- if an active preview session already exists in CLI context, preview `vxg test run` reuses it automatically unless you force `--fresh` or pass an explicit `--session-id`

Do not collapse these stages:

- preview/design iteration does not need `implementation_ref`
- implementation coverage starts only after real production handoff or an explicit continuity-proof task

Current browser-proof note:

- for explicit implementation continuity browser proof, the current app surface is `/ui/vxg-implementation/`
- treat that as a proof/validation surface, not as a reason to require `implementation_ref` during ordinary preview-stage authoring
- if the canonical working graph does not yet have legitimate production bindings, use a dedicated validation/probe graph rather than inventing nonsense bindings on the design graph

## Prototype-to-Production Continuity

The same target should survive handoff.

```text
VXG target
  -> preview runtime via component_ref / preview target resolution
  -> implementation runtime via implementation_ref
  -> shared manifests / suites / assertions
```

Operational note:

- in normal repo-local design loops, `component_ref` is usually a preview URL such as `/preview/?component=MyCard`
- `component_entry` is the entry hint paired with that preview route when needed

What the system already does:

- the compiler fingerprints the resolved `implementation_ref`
- replay tracks suites by `implementation_ref`
- changing target structure or implementation binding can stale coverage

What that means operationally:

- do not rewrite the behavior spec just because implementation starts
- keep the same `target_ref`
- bind `implementation_ref` on the node
- rerun implementation coverage on that same target

What it does not mean:

- it does not mean every prototype target should already carry `implementation_ref`
- it does not mean style refinement or shell iteration should be blocked on production binding work

Binding example:

```bash
agent-swarm vxg node update --key my-card --implementation-ref <IMPLEMENTATION_REF>
agent-swarm vxg query 'nodes where implementationRef is not null'
```

## Core Type Shapes

Rust enum variants are shown below. CLI/RPC JSON values are snake_case.

### Enums

```text
VxgTestTargetKind: Component | Page | Shell | Flow
VxgTestRuntimeScope: Preview | Implementation | Dual
VxgTestSuiteClass: Prototype | Implementation | Parity
VxgTestSuiteStatus: Green | Red | Stale | NeverRun
VxgTestRunStatus: Passed | Failed | Partial | Errored
VxgTestSeverity: Low | Medium | High | Critical
VxgTestReportView: Summary | Full | Evidence
VxgReviewOutcome: Passed | Failed | NeedsReview
```

### Capability keys

```text
interaction.click
interaction.type
interaction.scroll
capture.screenshot
capture.dom
capture.a11y
capture.layout
trace.semantic
trace.dom
backend.assertions
auth.real_session
persistence.assertions
```

Preview adapters expose these through `VxgPreviewAdapterCapabilities`, and the test runner computes which preview capabilities are satisfied.

### Suite status transitions

```text
NeverRun -> Green
NeverRun -> Red
Green -> Stale
Red -> Stale
Green -> Red
Red -> Green
Stale -> Green
Stale -> Red
```

### Assertion kinds

```text
TraceContains
TraceSequence
StateMatches
SelectionMatches
DomContains
A11yContains
LayoutMatches
ScreenshotExists
VisualBaseline
ReviewRubric
ImplementationAssertion
ManifestExpectation
```

### Step kinds

```text
Open
LoadFixture
Click
Type
Press
Hover
Scroll
Wait
WaitForState
SetViewport
SetMode
Capture
AssertStateSnapshot
AssertTraceSnapshot
```

### Capture kinds

```text
Screenshot
Dom
A11y
Layout
TraceBundle
ConsoleMirror
StateSnapshot
SelectionSnapshot
CompiledManifest
```

### Implementation verifier kinds

```text
AuthRealSession
PersistenceAssertion
ApiAssertion
```

Wire strings for implementation verifiers:

```text
auth_real_session
persistence_assertion
api_assertion
```

### Greenlight blocker kinds

```text
MissingPrototypeCoverage
MissingImplementationCoverage
RequiredSuiteStale
RequiredSuiteNotGreen
```

### Selector variants

`VxgTestSelector`:

```text
TargetRef { target_ref }
NodeId { node_id }
NodeKey { node_key }
PageId { page_id }
ShellId { shell_id }
SlotId { slot_id }
Role { role, name? }
Label { label }
Text { text, exact }
TestId { test_id }
Css { selector }
```

### Key structs

`VxgTestManifest`:

```text
manifest_id, name, target_kind, target_ref, runtime_scope,
source_ref, source_path, source_origin,
required_capabilities, optional_capabilities, tags,
last_compile_summary, last_compile_diagnostic_counts,
created_at, updated_at
```

`VxgTestSuite`:

```text
suite_id, name, description,
target_kind, target_ref, runtime_scope, suite_class,
tags, fixture_refs, manifest_refs,
required_capabilities, optional_capabilities,
status, last_run_id, last_green_run_id, last_target_fingerprint,
case_ids, compiled_manifest_ref,
created_at, updated_at
```

`VxgTestCase`:

```text
case_id, suite_id, name, purpose, severity, steps, assertions
```

`VxgTestRun`:

```text
run_id, suite_id, runtime_target, status,
started_at, completed_at,
target_fingerprint,
evidence_bundle_ref, evidence_index,
session_id, failed_assertion_summary
```

`VxgTestReport`:

```text
view, summary, evidence_bundle_ref, named_evidence_handles,
implementation_assertion_results, visual_baseline_results, review_rubric_results,
run, dereferenced_evidence
```

`VxgTestGreenlightResult`:

```text
target_ref, green,
prototype_status, implementation_status,
required_suite_ids, blockers
```

`VxgTestGreenlightBlocker`:

```text
kind, suite_id, suite_class, status, message
```

`VxgTestDependencyFingerprint`:

```text
target_structural_version, target_structural_hash,
manifest_content_hash, manifest_source_ref,
fixture_refs, implementation_ref,
required_capabilities, ext
```

`VxgEvidenceIndex`:

```text
primary_screenshot, trace_bundle, console_mirror,
state_snapshot, selection_snapshot,
failed_assertion_summary,
implementation_assertion_results,
visual_baseline_results,
review_rubric_results,
compiled_manifest_snapshot,
named_captures
```

`VxgEvidenceArtifactRef`:

```text
data_ref, content_hash, original_size, stored_size,
content_type, content_encoding, capture_kind
```

`VxgTestRuntimeTarget`:

```text
target_kind, target_ref, runtime_scope,
preview_target,
shell_id, page_id, viewing_mode, layout_mode_id, style_mode_id,
node_id, implementation_ref,
bundle_id, profile_id, adapter_kind,
viewport_width, viewport_height,
inspect_mode, ui_mode, fit_mode
```

Interpretation:

- `target_ref` is the semantic VXG subject you are validating
- `preview_target`, `shell_id`, `page_id`, and `node_id` pin preview runtime resolution
- `implementation_ref` and `adapter_kind` pin implementation runtime resolution

## CLI Surface

### Manifest operations

```bash
agent-swarm vxg test manifest add <FILE> [--manifest-id <ID>] [--source-path <PATH>] [--fail-if-exists]
agent-swarm vxg test manifest list [--target-ref <REF>] [--limit <N>]
agent-swarm vxg test manifest show --manifest-id <ID>
agent-swarm vxg test manifest compile --manifest-id <ID> [--fail-on-warning]
```

Manifest ids default from filename stem. `my-card.manifest.md` becomes `my-card` unless `--manifest-id` overrides it.

### Suite operations

```bash
agent-swarm vxg test suite list [--target-ref <REF>] [--runtime-scope <preview|implementation|dual>] [--status <green|red|stale|never_run>]
agent-swarm vxg test suite show --suite-id <ID>
agent-swarm vxg test suite repair-orphan --suite-id <ORPHANED_SUITE_ID> --replacement-suite-id <ACTIVE_REPLACEMENT_SUITE_ID> --reason "<AUDITABLE_REASON>"
```

Use `never_run`, not `never-run`.

### Execution

```bash
agent-swarm vxg test run --suite-id <ID> --runtime-target '<JSON>' [--session-id <ID>] [--fresh] [--keep-session] [--fail-fast] [--no-wait] [--evidence-profile fast|full]
```

Runtime target example:

```json
{
  "target_kind": "component",
  "target_ref": "component:my-card",
  "runtime_scope": "preview",
  "preview_target": "component",
  "node_id": "my-card-node"
}
```

Notes:

- `--runtime-target` is required and must be valid JSON
- enum values are lowercase snake_case on the wire
- `--session-id` reuses an existing preview session
- `--fresh` forces a fresh preview session for the run
- `--keep-session` keeps the session alive after the run completes

Implementation runtime example:

```json
{
  "target_kind": "component",
  "target_ref": "component:my-card",
  "runtime_scope": "implementation",
  "implementation_ref": "<IMPLEMENTATION_REF>",
  "adapter_kind": "nextjs-ui-static"
}
```

### Status, report, and greenlight

```bash
agent-swarm vxg test status --suite-id <ID>
agent-swarm vxg test status --target-ref <REF>
agent-swarm vxg test status --run-id <ID>
agent-swarm vxg test report --run-id <ID> [--view <summary|full|evidence>]
agent-swarm vxg test greenlight --target <REF> [--include-blockers]
```

`vxg test status` requires exactly one selector. Zero or multiple selectors is a hard validation error.

Lifecycle repair note:

- `repair-orphan` is a narrow operator tool for already-orphaned historical suites whose manifest source is unrecoverable
- it does **not** erase history
- it records that a broken historical suite has been replaced by another suite in the same logical lineage
- use it only when:
  - the target suite is truly orphaned
  - the replacement suite already exists
  - the replacement suite is the legitimate same-intent authority

## Bridge RPC

Wire model:

- request: CBOR
- response: JSON
- live channel: `vxg:<vxg_id>`

Requests and responses:

| CLI | RPC | Request fields | Response fields |
| --- | --- | --- | --- |
| `manifest add` | `vxg.testManifestAdd` | `vxgId, manifestId, sourceText, sourcePath?, failIfExists` | `manifest, version` |
| `manifest list` | `vxg.testManifestList` | `vxgId, targetRef?, limit?` | `manifests[]` |
| `manifest show` | `vxg.testManifestShow` | `vxgId, manifestId` | `manifest, sourceText` |
| `manifest compile` | `vxg.testManifestCompile` | `vxgId, manifestId, failOnWarning` | `compiledManifestRef, suiteIds[], diagnostics[]` |
| `suite list` | `vxg.testSuiteList` | `vxgId, targetRef?, runtimeScope?, status?` | `suites[]` |
| `suite show` | `vxg.testSuiteShow` | `vxgId, suiteId` | `suite, cases[]` |
| `suite repair-orphan` | `vxg.testSuiteRepairOrphan` | `vxgId, suiteId, replacementSuiteId, reason` | `suite, version` |
| `run` | `vxg.testRun` | `vxgId, suiteId, runtimeTarget, sessionId?, fresh, keepSession, failFast` | `run, version` |
| `status` | `vxg.testStatus` | `vxgId, suiteId XOR targetRef XOR runId` | `statusSummary` |
| `report` | `vxg.testReport` | `vxgId, runId, view` | `report` |
| `greenlight` | `vxg.testGreenlight` | `vxgId, targetRef, includeBlockers?` | `greenlight` |

The underlying service layer also accepts optional `request_id` and `expected_version` for add/compile/run flows, even though the CLI does not expose them directly.

Current runtime limitation:

- `vxg.testRun` rejects `runtime_scope = dual`
- compile parity intent if you want that classification
- execute preview and implementation runs separately today

## MCP Route

After the Registry Surface Parity refactor (bd-lpmr), all 12 VXG test methods are **MCP-exposed** alongside their CLI equivalents. Both interfaces call the same surface-neutral handler.

MCP tool names for testing:

```text
vxg_test_manifest_add       — add a test manifest
vxg_test_manifest_update    — update a test manifest
vxg_test_manifest_list      — list manifests
vxg_test_manifest_show      — show manifest details
vxg_test_manifest_compile   — compile manifest into suite
vxg_test_suite_list         — list suites
vxg_test_suite_show         — show suite details
vxg_test_suite_repair_orphan — repair orphaned suite
vxg_test_run                — execute a test run
vxg_test_status             — check run/suite status
vxg_test_report             — get test report
vxg_test_greenlight         — check greenlight readiness
```

Use MCP when the caller is an agent with MCP tool routing. Use CLI (`agent-swarm vxg test *`) for operator workflows. Both hit the same handler with identical behavior.

## Choose The Right Validation Surface

Use the VXG-native runner when you need:

- graph-owned suites and reports
- green/stale/red lifecycle
- CAS-backed evidence
- semantic target continuity from prototype to implementation
- implementation assertions like:
  - `AuthRealSession`
  - `PersistenceAssertion`
  - `ApiAssertion`

Use browser automation tooling when you need:

- true browser rendering proof
- hover/focus/input behavior in a real page
- screenshot review against the live preview route
- independent browser automation outside the VXG runner

Default browser-tool choice:

- prefer `playwright-interactive` for iterative preview debugging, richer inspection, and persistent browser state
- use `agent-browser` when you specifically want its CLI loop or a lighter one-shot interaction flow

Use both when handoff quality matters:

- VXG-native suite for durable evidence and greenlight
- browser automation for rendered browser proof

Default design loop:

- manifest defines what the screen must do
- `vxg dev` gives the live prototype runtime
- browser automation gives browser truth for the rendered preview
- `vxg test run` decides whether the design is actually done
- for faster day-to-day loops, prefer `vxg dev` + browser proof + `vxg test run --evidence-profile fast`
- for QA and handoff proof, prefer `vxg test run --evidence-profile full`

## Manifest Format

Test manifests are markdown with YAML frontmatter:

```markdown
---
manifest_version: 1
name: "My Component Test"
target_kind: component
target_ref: "component:my-card"
runtime_scope: preview
required_capabilities:
  - interaction.click
  - capture.screenshot
optional_capabilities:
  - capture.a11y
tags:
  - smoke
  - regression
---

# My Component Test

## Intent
What this test validates and why.

## Setup
- Given the component is rendered with default props
- And fixture "test-data" is loaded

## Scenario
- When the user clicks the submit button
- And waits for the loading state to resolve
- Then the success message is displayed

## Evidence
- Screenshot of final state
- DOM snapshot of result container

## Review Rubric
- Layout matches design reference
- Color tokens are correct
- Typography is readable
```

Section roles:

- `Intent`: non-executable prose
- `Setup`: executable
- `Scenario`: executable
- `Evidence`: executable capture requests
- `Review Rubric`: non-executable rubric text

Compilation behavior:

- parses frontmatter, headings, and scenario clauses
- resolves target references against current VXG state
- generates `VxgTestStep` and `VxgTestAssertion` values
- stores `CompiledTestSuiteArtifact` in CAS
- materializes `VxgTestSuite` and `VxgTestCase` records into the event store

Diagnostic kinds:

```text
MissingFrontmatter
MissingFrontmatterField
UnknownFrontmatterKey
MalformedFrontmatter
DuplicateHeading
UnknownHeading
MalformedClause
EmptyExecutableSection
TargetNotFound
SubjectNotFound
FixtureNotFound
AmbiguousSubject
AmbiguousExpectation
UnsupportedVerb
InvalidLiteral
ProsePreserved
ArtifactEncodingFailure
```

Wire notes:

- diagnostic levels are `info`, `warning`, `error`
- compiler codes are snake_case
- `ProsePreserved` currently serializes as `compiled_with_warnings`

## How Tests Use Preview Sessions

The test runner boots or reuses preview sessions through `VxgPreviewService`.

Execution path:

1. `VxgTestRunner` resolves the runtime target
2. `preview.dev_start_for_runtime_target()` creates or reuses a preview session
3. interaction steps execute against that live session
4. capture steps collect screenshots, DOM, a11y, layout, traces, console, state, and selection
5. assertions evaluate against session state and collected evidence
6. the session is stopped or kept depending on `fresh` / `keepSession`

Implications:

- preview adapter capabilities gate whether a suite can run
- a screenshot step fails if the adapter lacks `screenshot_capture`
- a DOM-based assertion can fail because the preview route failed before the page stabilized
- for preview boot, capture, stream, or session-liveness issues, also load `vxg-project-ops`

Important distinction:

- preview runs use the preview session directly
- implementation runs use the implementation adapter path keyed by `implementation_ref`
- browser automation tooling is not invoked by `vxg test run`; it is an adjacent validation layer you use against `agent_url` or real app routes

## Where Browser Automation Fits

The correct relationship is:

```text
vxg test run           -> graph-owned execution, evidence, status, greenlight
vxg dev start/show/url -> stable preview route and runtime diagnostics
browser automation     -> independent browser automation against the rendered route
```

Preview browser-validation loop:

Preferred order:

```text
playwright-interactive first
agent-browser second
```

```bash
agent-swarm vxg dev start --node <NODE_ID_OR_KEY> --target component
agent-swarm vxg dev url --session <SESSION_ID>
# Open the returned agent_url on the swarmd gateway base origin unless your environment explicitly proxies it elsewhere.
# Prefer playwright-interactive; use agent-browser when it is the better fit.
agent-browser open "<BASE_ORIGIN><AGENT_URL>"
agent-browser snapshot -i
agent-browser click @e1
agent-browser screenshot

# Equivalent Playwright-interactive workflows are preferred when available.
```

Production browser-validation loop:

- use the real application route, not the VXG preview route
- keep the same semantic target and `implementation_ref`
- use browser automation when adapter-level implementation evidence is not enough

## Evidence Model

Evidence is CAS-backed and indexed per run.

Primary evidence types:

- primary screenshot
- trace bundle
- console mirror
- state snapshot
- selection snapshot
- compiled manifest snapshot
- named captures

The bundle handle is `VxgEvidenceBundleRef { cas_ref, content_hash }`. Individual artifacts are referenced through `VxgEvidenceArtifactRef`.

Expect the report surface to give you:

- bundle reference for reproducibility
- named handles for targeted captures
- summary-only evidence in `statusSummary.primaryEvidence`
- optional dereferenced payloads in full/evidence report views

Dereferenced payload field model:

- JSON artifacts:
  - structured content is in `json`
  - a text serialization may also appear in `text`
- plain text / HTML artifacts:
  - content is in `text`
- binary artifacts such as screenshots:
  - inline content, when present, is in `bytesBase64`
  - even when raw bytes are not inlined, metadata such as `contentType`, size, and the artifact handle/CAS ref remain authoritative

Operator rule:

- do **not** treat a missing `data` field as missing evidence
- inspect `json`, `text`, or `bytesBase64` depending on artifact type
- if CLI JSON does not inline a binary payload, validate via metadata and the CAS-backed evidence handle path

## Greenlight Gate

`vxg test greenlight` answers "is this target ready?"

- prototype coverage checks preview/runtime suites
- implementation coverage checks implementation suites
- `green: true` requires every required suite to be green
- blockers tell you whether the gap is missing coverage, stale coverage, or a non-green required suite

Current lifecycle surfaces also distinguish:

- `supersededSuiteIds`
  - historical suites that are no longer authoritative
- `orphanedSuiteIds`
  - suites whose manifest source is unrecoverable
- `repairedOrphanedSuiteIds`
  - orphaned suites that were explicitly replaced by a legitimate successor via `repair-orphan`

Current orphan blocker kind:

- `required_suite_orphaned`

Interpretation rule:

- orphaned suites should be visible and auditable
- they should not silently poison current truth
- if a valid replacement exists, use `repair-orphan` instead of inventing a fake new workflow

Use `--include-blockers` when you need operator-facing remediation instead of a simple pass/fail boolean.

## Common Failure Modes

- Manifest target does not resolve in the current graph:
  - compiler emits `TargetNotFound`
- Scenario prose compiles into ambiguous or unsupported clauses:
  - compiler emits `AmbiguousSubject`, `AmbiguousExpectation`, or `UnsupportedVerb`
- Forgetting to set `vxg` context:
  - manifest compiles or runs against the wrong graph
- Invalid runtime target JSON:
  - CLI rejects `--runtime-target`
- Using `Component` / `Preview` / `NeverRun` in raw JSON:
  - wire enums must be snake_case
- Requesting `status` with zero or multiple selectors:
  - service returns `InvalidInput`
- Running a suite before required preview capabilities are available:
  - runner fails before assertions
- Reading a `NeverRun` or `Stale` suite as greenlight-ready:
  - greenlight requires actual green status on required suites
- Graph or manifest changed after the last good run:
  - suite becomes `Stale` and must be re-run
- Test failure is really a preview-session failure:
  - inspect the preview route with `vxg-project-ops`
- Greenlight is blocked by an orphaned historical suite:
  - check `orphanedSuiteIds`, `repairedOrphanedSuiteIds`, and blocker kinds
  - if the suite is truly orphaned and a legitimate same-lineage replacement exists, use `agent-swarm vxg test suite repair-orphan ...`
- Cross-manifest same-intent replacement is expected to supersede automatically:
  - do not assume that
  - verify the actual lifecycle state
  - use `repair-orphan` for the already-broken historical-lineage edge case

## Typical Workflow

### Default Design Loop

```bash
agent-swarm vxg use <VXG_ID>
# If this is feature-wide work, inventory pages first and repeat the loop for every row.
agent-swarm vxg query 'feature_pages where feature_key = "<FEATURE_KEY>"' --vxg <VXG_ID> --json
agent-swarm vxg test manifest add ./tests/my-card.manifest.md
agent-swarm vxg test manifest compile --manifest-id my-card --fail-on-warning
agent-swarm vxg dev start --node my-card-node --target component
# Prefer `playwright-interactive` against the returned agent_url while iterating on the design.
agent-swarm vxg test suite list --target-ref "component:my-card"
agent-swarm vxg test run --suite-id <SUITE_ID> --runtime-target '{"target_kind":"component","target_ref":"component:my-card","runtime_scope":"preview","preview_target":"component","node_id":"my-card-node"}'
agent-swarm vxg test report --run-id <RUN_ID> --view full
```

Iteration rule:

- after every meaningful VXG design change, rerun the preview suite
- if the suite turns `stale`, treat that as immediate work, not as something to defer
- do not declare the VXG design done until the preview suite is green

### Production Handoff Loop

```bash
agent-swarm vxg node update --key my-card --implementation-ref <IMPLEMENTATION_REF>
agent-swarm vxg test manifest add ./tests/my-card-impl.manifest.md --manifest-id my-card-impl
agent-swarm vxg test manifest compile --manifest-id my-card-impl --fail-on-warning
agent-swarm vxg test suite list --target-ref "component:my-card" --runtime-scope implementation
agent-swarm vxg test run --suite-id <IMPL_SUITE_ID> --runtime-target '{"target_kind":"component","target_ref":"component:my-card","runtime_scope":"implementation","implementation_ref":"<IMPLEMENTATION_REF>","adapter_kind":"nextjs-ui-static"}'
agent-swarm vxg test report --run-id <IMPL_RUN_ID> --view full
agent-swarm vxg test greenlight --target "component:my-card" --include-blockers
```

## Deep-Dive Files

Use these only when the skill is not enough:

```text
crates/swarm-services/src/vxg/test_types.rs
crates/swarm-services/src/vxg/test_service.rs
crates/swarm-services/src/vxg/test_runner.rs
crates/swarm-services/src/vxg/manifest_compiler.rs
crates/swarm-cli/src/commands/vxg.rs
crates/swarm-cli/src/commands/vxg_args.rs
swarmd/src/api_gateway/dispatch/vxg.rs
```
