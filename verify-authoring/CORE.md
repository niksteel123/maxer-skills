# Verify Authoring — Core Reference

> ⚠ **Durable-fabric fields shipped 2026-07-19 — this file predates them.** For `lineage:` /
> `owner:` / `views:` / package-level `family:` frontmatter, see SKILL.md § Durable-fabric
> frontmatter. In particular, this file's "Recovery" advice to re-validate + re-instantiate on
> content-hash staleness is SUPERSEDED: re-instantiation wipes banked run state; the sanctioned
> change path is the lineage delta flow, and staleness clears on a fresh green run (B2) or via
> `verify rebaseline` (audited read). Local no-`--target` publish (lineage-recording) is now the
> primary publish; OCI is the distribution path.

Complete schema, validation rules, binding semantics, capability model, evidence model, staleness, and plan-attachment schema. This is the deep reference — read SKILL.md first for orientation.

## Source of Truth (code)

- Types: `crates/swarm-services/src/verify/types.rs` (lines 27–92 for the package spec group)
- Parser: `crates/swarm-services/src/verify/package_parse.rs` (entry: `parse_tests_md` line 132)
- Compiler: `crates/swarm-services/src/verify/compiler.rs` (entry: `compile_loaded_package` line 38)
- Capabilities: `crates/swarm-services/src/verify/capabilities.rs`
- Bindings / freshness: `crates/swarm-services/src/verify/bindings.rs`

When in doubt, the Rust types are authoritative. This doc is accurate as of the unified-verification-packages-pipeline landing but code drifts — verify field names against `types.rs` before deep work.

## 1. Full VerificationPackageSpec schema

The compiler requires `deny_unknown_fields` — any unrecognized key at any level rejects parse.

### Top-level fields

| Field | Type | Required | Notes |
|---|---|---|---|
| `package_id` | `String` | **yes** | Author-chosen; conventionally `verify.<slug>` or `<org>.<feature>.verify`. Must be non-empty. Becomes the first element of the identity chain. |
| `name` | `String` | **yes** | Human-readable display name. Non-empty. |
| `kind` | `String` | **yes** | **Must be the literal string `"verification"`**. Anything else rejects with `invalid package kind`. |
| `package_version` | `String` | **yes** | **Must be valid semver** (parsed via `semver::Version::parse`). `1.0.0` ✓; `v1`, `1`, `latest` ✗. |
| `description` | `Option<String>` | no | One-line human summary surfaced in catalog + template listings. |
| `layer_id` | `String` | **yes** | Non-empty. Typically `l0`, `l1`, `l2`, `l2.5`, `l3` etc. Used for layering visualizations and filtering. |
| `tags` | `Vec<String>` | no, default `[]` | Free-form taxonomy for catalog discovery (e.g., `[vxg, preview, browser]`). |
| `required_profile` | `Option<String>` | no | Execution profile requirement (see profile docs; e.g., `"headful-chrome-1920x1080"`). Optional. |
| `source_of_truth` | `VerificationSourceOfTruth` | **yes** | See §2. |
| `bindings` | `VerificationBindings` | **yes** (at least one category populated) | See §3. |
| `suites` | `Vec<VerificationSuiteSpec>` | **yes (≥1)** | See §4. Suite IDs must be unique. |

### Rust type (reference)

```rust
// crates/swarm-services/src/verify/types.rs ~line 27
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
pub struct VerificationPackageSpec {
    pub package_id: String,
    pub name: String,
    pub kind: String,
    pub package_version: String,
    pub description: Option<String>,
    pub layer_id: String,
    #[serde(default)]
    pub tags: Vec<String>,
    #[serde(default)]
    pub required_profile: Option<String>,
    pub source_of_truth: VerificationSourceOfTruth,
    pub bindings: VerificationBindings,
    pub suites: Vec<VerificationSuiteSpec>,
}
```

## 2. VerificationSourceOfTruth

```rust
pub struct VerificationSourceOfTruth {
    pub spec: String,                    // required, non-empty relative path
    pub architecture: Option<String>,    // optional relative path
    pub tdd: Option<String>,             // optional relative path
}
```

| Field | Required | Validation |
|---|---|---|
| `spec` | **yes** | Non-empty; must resolve to an existing file at package-root-relative path at compile time. |
| `architecture` | no | If present, must exist. |
| `tdd` | no | If present, must exist. |

**Path rules (all paths in TESTS.md)**:
- Relative to package root.
- No leading `/` (absolute rejected).
- No `../` (parent escapes rejected).
- Must resolve to a real file at validate/compile time (missing file = validation error).

**Staleness binding**: Any hash change to these files triggers `SourceOfTruthDoc` staleness across **all suites**. If your spec drifts and you don't re-validate, cached instances go stale and reports stop being trustable.

## 3. VerificationBindings

```rust
pub struct VerificationBindings {
    #[serde(default)]
    pub scopes: Vec<String>,
    #[serde(default)]
    pub skeleton_layers: Vec<String>,
    #[serde(default)]
    pub work_unit_queries: Vec<VerificationWorkUnitQuery>,
    #[serde(default)]
    pub path_globs: Vec<String>,
}

pub struct VerificationWorkUnitQuery {
    pub label: String,
}
```

### Per-field semantics

**`scopes` (required ≥1)** — Subject + contract binding. What this package covers. Accepted forms:
- `project/<project-id>` — whole project
- `vxg/<vxg-id>` — specific VXG graph
- `workspace/<workspace-id>` — specific workspace
- `zone/<zone-id>` — specific zone
- `design/<design-id>` — specific design

Examples:
```yaml
scopes: [project/swarmnet]
scopes: [vxg/swarm2-main, project/swarm2]
scopes: [design/home-hero, vxg/home-preview]
```

Multiple scopes = the package applies when any scope matches.

**`skeleton_layers` (optional, drift-only)** — Watched skeleton layer IDs. Staleness fires when the layer's version string changes (or becomes unavailable).
```yaml
skeleton_layers: [l2.5.vxg-map, l2.5.design-canvas]
```

**`work_unit_queries` (optional, contract/context)** — Work-unit label filters for plan-attachment applicability.
```yaml
work_unit_queries:
  - { label: vxg-checklist }
  - { label: ui-regression }
```

**`path_globs` (optional, drift-only)** — File-path glob watches. Staleness fires when matching files change. Uses standard glob syntax.
```yaml
path_globs:
  - "agent-swarm-ui/packages/ui/src/apps/vxg-map/**"
  - "crates/swarm-services/src/vxg/**"
```

### Binding-class mapping

The spec talks about three *classes* of binding (subject / contract / drift-only). They map onto the concrete fields as follows:

| Class | Concrete fields | Staleness impact |
|---|---|---|
| **Subject** | `scopes` (target-facing) | `TargetFingerprint` — suite-specific |
| **Contract** | `source_of_truth.*`, `scopes` (contract-facing), `work_unit_queries`, plan attachment fields | `SourceOfTruthDoc`, `PlanBinding`, `WorkBinding` — all-suite |
| **Drift-only** | `skeleton_layers`, `path_globs` | `SkeletonLayerVersion`, content-hash watches — advisory |

At least **one category must have entries** (typically `scopes`). Empty `bindings` rejects.

## 4. VerificationSuiteSpec

```rust
pub struct VerificationSuiteSpec {
    pub id: String,
    pub proof_kind: VerificationProofKind,      // Checklist | Automated
    pub execution_mode: VerificationExecutionMode, // Manual | Command | SwarmSession
    pub file: String,                            // relative path to suite file
    #[serde(default)]
    pub checklist_refs: Vec<String>,             // cross-suite refs within package
    #[serde(default)]
    pub required_capabilities: Vec<String>,
    #[serde(default)]
    pub optional_capabilities: Vec<String>,
}
```

### Field semantics

| Field | Required | Validation |
|---|---|---|
| `id` | **yes** | Unique within package. Dotted namespacing convention (`backend.fast`, `preview.checklist`). |
| `proof_kind` | **yes** | Enum: `checklist` or `automated` (serde lowercase). |
| `execution_mode` | **yes** | Enum: `manual`, `command`, or `swarm_session` (serde snake_case). |
| `file` | **yes** | Non-empty relative path to suite spec file (YAML or MD). Must exist. |
| `checklist_refs` | no | List of sibling suite IDs this suite depends on. All must exist in same package. |
| `required_capabilities` | no | Capabilities required at runtime for the suite to execute. |
| `optional_capabilities` | no | Capabilities that enhance the suite but are not required. |

### Valid `(proof_kind, execution_mode)` pairs

Only three combinations pass validation. Anything else rejects with `unsupported proof_kind/execution_mode pair`.

| proof_kind | execution_mode | Use for | Suite file |
|---|---|---|---|
| `checklist` | `manual` | Human/AI-reviewed rubric items | YAML or MD with checklist items |
| `automated` | `command` | nextest-routed backend validation | YAML with `lane:` + optional filters |
| `automated` | `swarm_session` | Browser / session-runtime proof | YAML with session profile + interaction script |

### ID conventions (not enforced, but strongly recommended)

Dotted prefixes so multiple suites of the same kind don't collide across packages:

- `backend.fast`, `backend.slow`, `backend.heavy`
- `preview.checklist`, `preview.a11y`, `preview.visual`
- `browser.smoke`, `browser.e2e`, `browser.regression`
- `integration.command`, `integration.session`

## 5. VerificationProofKind + VerificationExecutionMode (enums)

```rust
// crates/swarm-services/src/verify/types.rs ~line 416
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VerificationProofKind {
    Checklist,
    Automated,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum VerificationExecutionMode {
    Manual,
    Command,
    SwarmSession,
}
```

Wire serialization: `proof_kind: "checklist"` / `"automated"`; `execution_mode: "manual"` / `"command"` / `"swarm_session"`.

## 6. Capabilities

### Canonical set (13)

Defined in `crates/swarm-services/src/verify/capabilities.rs` as `KNOWN_VERIFICATION_CAPABILITIES`:

| Capability | Meaning |
|---|---|
| `interaction.click` | Can send click events to UI |
| `interaction.type` | Can type text into inputs |
| `interaction.scroll` | Can scroll viewport / element |
| `capture.screenshot` | Can capture rendered screenshots |
| `capture.dom` | Can snapshot DOM |
| `capture.full_document` | Can snapshot full scrollable document |
| `capture.a11y` | Can capture accessibility tree |
| `capture.layout` | Can capture computed layout (bounding rects etc.) |
| `trace.semantic` | Can record semantic action trace |
| `trace.dom` | Can record DOM mutation trace |
| `backend.assertions` | Suite makes backend/API assertions |
| `auth.real_session` | Suite uses a real authenticated session |
| `persistence.assertions` | Suite makes persistence / event-store assertions |

### Normalization rules

`normalize_capability_alias(raw: &str) -> VerificationCapabilityKey`:

1. Trim whitespace.
2. Lowercase (`BACKEND` → `backend`).
3. Match against the alias → canonical table:

| Raw / alias | Canonical |
|---|---|
| `click` | `interaction.click` |
| `type` | `interaction.type` |
| `scroll` | `interaction.scroll` |
| `screenshot` | `capture.screenshot` |
| `dom` | `capture.dom` |
| `full_document` | `capture.full_document` |
| `a11y` | `capture.a11y` |
| `layout` | `capture.layout` |
| `semantic_trace` | `trace.semantic` |
| `dom_trace` | `trace.dom` |
| `backend` | `backend.assertions` |
| `real_session` | `auth.real_session` |
| `persistence` | `persistence.assertions` |
| *(anything else)* | *passthrough as-is* |

Passthrough behaviour: unknown strings normalize to themselves. They don't error under `normalize_capability_alias` — they do under `normalize_capability_alias_strict` (used at specific validation gates).

### Declaration patterns

```yaml
# Terse form (aliases will expand)
required_capabilities: [click, screenshot, backend]

# Explicit form (preferred once you know the canonical names)
required_capabilities:
  - interaction.click
  - capture.screenshot
  - backend.assertions

# Optional capabilities — enhance if present, don't require
optional_capabilities:
  - trace.semantic
  - capture.a11y
```

### Over/under-declaration risks

| Risk | Symptom | Fix |
|---|---|---|
| Over-declaring | Instance fails to resolve because a profile lacks a capability you didn't actually use | Remove unused capabilities or move to `optional_capabilities` |
| Under-declaring | Runtime produces less evidence than the suite intends; may still report green but with thin bundle | Declare the full capability set the suite actually uses |
| Typo | Silent passthrough; a "non-functional requirement" | Always validate strict-mode at least once; use canonical names |

### Capability fingerprint staleness

The *normalized* capability set of an instance is tracked in `observed_capabilities: BTreeMap<String, BTreeSet<VerificationCapabilityKey>>`. If you add/remove a required capability and re-compile, existing instances go stale with `NormalizedCapabilities` (suite-scoped).

## 7. Evidence model

### Shape

Suite state carries `named_evidence_refs: BTreeMap<String, String>`. Each entry is a human-readable key → stable ref string.

### Underlying ref types (Rust)

```rust
// kernel L0
pub enum SourceRef {
    Cas(ContentHash),              // immutable CAS-stored blob
    SessionSeq(SessionId, u64),    // specific session event at a sequence
    SessionByte(SessionId, Range), // byte range within session stream
}
```

### Wire format (what you'll see in JSON responses)

- CAS-backed: `"cas://verify/<instance-id>/<suite-id>/<attempt>/<kind>"` — the stable, hashed ref pattern emitted by the runtime.
- Session refs: serialized forms of `SourceRef::SessionSeq` / `SessionByte`.

Example from a live `verify run` on a command suite:

```json
"named_evidence_refs": {
  "planner.json":   "cas://verify/verify-instance-1220.../backend.fast/2/planner-json",
  "preflight.json": "cas://verify/verify-instance-1220.../backend.fast/2/preflight-json",
  "nextest_output": "cas://verify/verify-instance-1220.../backend.fast/2/nextest-output",
  "coverage":       "cas://verify/verify-instance-1220.../backend.fast/2/coverage"
}
```

### Declaration rules (what authors do / don't do)

- **You do NOT declare evidence refs in TESTS.md.** Evidence accumulates at runtime and is keyed by the runtime (the planner for command suites; the session runtime for swarm_session; the verdict-setter for checklists).
- **You DO declare required capabilities** that imply what evidence will be emitted. `capture.screenshot` implies a screenshot ref will appear; `trace.dom` implies a DOM trace ref.
- For **checklist verdicts**, the agent/operator supplies `evidence_refs` at verdict time via `verify checklist verdict set --evidence-ref <ref>` (passing an existing CAS digest or `cas://...` URL).

## 8. Staleness — 8 kinds

When any bound input changes, the instance becomes stale. Re-running a stale instance is allowed but downstream gates should treat it as untrusted until the instance re-compiles/re-runs and stale-reason count drops to zero.

```rust
// crates/swarm-services/src/verify/bindings.rs ~line 61
pub enum VerificationStaleSourceKind {
    PackageContent,           // hash of TESTS.md changed
    SourceOfTruthDoc,         // hash of spec/architecture/tdd doc changed
    SuiteFile,                // hash of suite file changed (suite-specific)
    TargetFingerprint,        // target adapter fingerprint changed (suite-specific)
    NormalizedCapabilities,   // capability set changed (suite-specific)
    SkeletonLayerVersion,     // watched skeleton layer version changed
    PlanBinding,              // plan_id or phase_id binding context differs
    WorkBinding,              // work_selector binding context differs
}
```

### Per-kind reference

| Kind | Scope | Triggered by | Common cause |
|---|---|---|---|
| `PackageContent` | all suites | TESTS.md hash | You edited TESTS.md |
| `SourceOfTruthDoc` | all suites | spec/architecture/tdd file hash | Spec drift |
| `SuiteFile` | single suite | suite file hash | You edited a `suites/*.yaml` |
| `TargetFingerprint` | single suite | target adapter fingerprint | The underlying target changed (VXG mutated, design snapshot changed) |
| `NormalizedCapabilities` | single suite | capability set | You changed required/optional caps |
| `SkeletonLayerVersion` | all suites | watched layer version | A watched skeleton layer got updated |
| `PlanBinding` | all suites | plan_id/phase_id context | Plan attachment context changed |
| `WorkBinding` | all suites | work_selector context | Work binding context changed |

### Scope semantics

`stale_applies_to_all_suites(kind)` returns true for: `PackageContent`, `SourceOfTruthDoc`, `SkeletonLayerVersion`, `PlanBinding`, `WorkBinding`.

Suite-scoped kinds — `SuiteFile`, `TargetFingerprint`, `NormalizedCapabilities` — carry a `key: suite_id` identifying which suite went stale.

### Stale response shape

`verify.get` returns `stale_reasons: Vec<StaleReason>`:
```json
{
  "stale_reasons": [
    {
      "kind": "target_fingerprint",
      "key": "preview.checklist",
      "baseline": "vxg_abc123",
      "current":  "vxg_xyz789"
    }
  ]
}
```

### Recovery

- **Content-hash kinds (`PackageContent`, `SourceOfTruthDoc`, `SuiteFile`)**: re-validate + re-instantiate. The new instance has a new `instance_id` derived from the new content hash.
- **Target-fingerprint**: either wait for target to re-settle, re-point the scope, or accept the new fingerprint.
- **Capability**: changed capability declaration produces a new artifact; re-instantiate.
- **Skeleton-layer / plan-binding / work-binding**: advisory vs blocking depends on the suite/package's freshness policy.

Full freshness policy semantics: §11.

## 9. Identity chain

Every record in the UVP lifecycle has a stable ID. Most are deterministic from content; only `package_id`, suite `id`s, and `attachment_id` are author-provided.

| Identity | Author-provided? | Derivation |
|---|---|---|
| `package_id` | **yes** | TESTS.md frontmatter; conventionally `verify.<slug>` |
| `suites[].id` | **yes** | Suite declaration in frontmatter; unique within package |
| `artifact_id` | no | `prefix_content_hash("verify-artifact", SHA256(canonical_CBOR(CompiledArtifact)))` |
| `artifact_hash` | no | SHA256 of canonical CBOR encoding |
| `instance_id` | no | SHA256(CBOR(artifact_id, binding_fingerprint, owner_context)) + `"verify-instance-"` prefix |
| `evidence_bundle_id` | no | SHA256(CBOR(instance_id, artifact_id)) + `"verify-evidence-"` prefix |
| `report_id` | no | SHA256(CBOR(instance_id, evidence_bundle_id, projection_generation)) + `"verify-report-"` prefix |
| `obligation_id` | no | Deterministic from `plan_run_id + attachment_id + scope` at plan-run materialization |
| `attachment_id` | **yes** | Plan package YAML; unique within plan |
| `catalog_id` | no (system) | Digest-keyed index entry after publish |
| `schedule_id` | **yes** | `verify schedule create` arg |

### What this means for authoring

- **Rename a package**: new `package_id` → new artifact_id → new instance_id → everything downstream regenerates. Existing instances orphan.
- **Edit TESTS.md** (even whitespace): new artifact_id → new instance_id. Previous instances go stale via `PackageContent`.
- **Stable identity across re-compiles with identical content**: you get the same `artifact_id` → same `instance_id`. Re-instantiating is idempotent.

## 9b. Suite file schemas — authoritative reference

Each suite in `suites[]` references a file under `suites/<name>.{md,yaml,yml,json,toml}`. The runtime loads that file and parses it using a kind-specific parser. Every schema below is copied directly from the live Rust types — treat it as the ground truth.

### 9b.1 Checklist suites (`proof_kind: checklist`, `execution_mode: manual`)

**File format**: two authoring modes, chosen automatically by the parser based on whether the file starts with a YAML frontmatter block.

1. **Structured mode** — YAML frontmatter with an `items:` array. Per-item `severity`, `required_capabilities`, `tags`, and `automation_hint` are all author-controllable.
2. **Legacy mode** — Markdown bullet lines (`- `, `* `, or `+ `). Simpler; per-item metadata falls back to defaults.

**Parser entry**: `parse_runtime_checklist_items` (`crates/swarm-services/src/verify/service.rs:2560-2577`).

```rust
if let Some(items) = parse_structured_runtime_checklist_items(source, suite_path, suite)? {
    return Ok(items);
}
Ok(parse_markdown_runtime_checklist_items(source, suite))
```

`extract_checklist_frontmatter` (`service.rs:2661`) detects mode: the file must start with a line of exactly `---`, followed by YAML, followed by a closing `---`. Malformed frontmatter (present but no closing delimiter, invalid YAML, or missing `title` on an item) fails closed with `InvalidInput`. If the file doesn't start with `---`, it's treated as legacy Markdown.

#### Structured mode

Parsed into `StructuredRuntimeChecklistFrontmatter { items: Vec<StructuredRuntimeChecklistItem> }`. Both structs are `#[serde(deny_unknown_fields)]` — extra keys reject parse (`service.rs:2579-2599`):

```rust
struct StructuredRuntimeChecklistItem {
    title: String,                                  // required, trimmed, non-empty
    #[serde(default)] description: String,          // defaults to ""
    #[serde(default)] severity: Option<VerificationSeverity>,
    #[serde(default)] required_capabilities: Option<Vec<String>>,
    #[serde(default)] tags: Vec<String>,
    #[serde(default)] automation_hint: Option<String>,
}
```

Per-item semantics:

| Field | Default when omitted | Author control |
|---|---|---|
| `title` | **required** | Non-empty after `trim()`. Empty title errors with `structured checklist item in <path> is missing a non-empty \`title\``. |
| `description` | `""` | Trimmed. |
| `severity` | `VerificationSeverity::Medium` | One of `low`, `medium`, `high`, `critical` (serde lowercase). |
| `required_capabilities` | Suite-level `required_capabilities` (inherited) | When provided, normalized via `normalize_capability_values` (13-alias table — see §6). |
| `tags` | `[]` | Trimmed; empty / whitespace-only entries dropped (`service.rs:2633-2638`). |
| `automation_hint` | `None` | Trimmed; whitespace-only collapses to `None` (`service.rs:2652-2654`). |

Authors **cannot** set `item_id` — it's always auto-generated as `generate_checklist_item_id(suite_id, ordinal)` from `compiler.rs`. Ordinal is the 1-based position in the `items:` array.

Structured example:

```markdown
---
items:
  - title: Title bar renders at top of canvas
    description: |
      Top title bar spans full canvas width with traffic lights, breadcrumb,
      and action icons. Matches Pencil reference at 1920x1080.
    severity: high
    tags: [layout, chrome]
    required_capabilities: [capture.screenshot]
    automation_hint: DOM selector `.title-bar`.
  - title: Octagon map centered in main area
    description: Glassmorphism container visible; gradient glow rendered.
    severity: critical
    tags: [visual, map]
    required_capabilities: [capture.screenshot]
---

# Human notes

Everything below the closing `---` is commentary only once `items:` is present.
```

#### Legacy mode (Markdown bullets)

Parsed by `parse_markdown_runtime_checklist_items` (`service.rs:2694-2746`). Only lines starting with `- `, `* `, or `+ ` become items; every other line is skipped.

Canonical pattern: `- **item-slug**: description text...`

Parser behavior:

- `title` comes from the text between `**...**` if present; otherwise the whole bullet body is the title.
- `description` is the text after the closing `**` with leading `:`, `-`, or whitespace trimmed. When no `**...**` is used, description is empty.
- `item_id` auto-generated (same as structured mode).
- `severity` = `Medium` (hardcoded).
- `required_capabilities` = suite-level inheritance.
- `tags` = `[]`.
- `automation_hint` = `None`.

Use legacy mode when you only need title + description and don't care about per-item classification. Use structured mode when you need differentiated severity, per-item capabilities, tags, or automation hints.

#### Common authoring patterns

- **Start legacy, upgrade to structured** when differentiation becomes valuable. The upgrade path: wrap the existing bullets in `items:` as `title: ...` entries, promote any `**slug**` sluggery into structured `title` text, promote descriptions, then add metadata.
- **Mixing is not supported in one file**: the parser uses frontmatter presence as a binary switch. If YAML frontmatter is present, only `items:` is read and the Markdown body is commentary. Bullets below YAML frontmatter are ignored.
- **`item_id` stays deterministic in both modes** (`<suite_id>-<ordinal>`), so verdict-set CLI calls don't care which mode the file uses.

**Validation errors the parser can emit**:

| Error text | Cause |
|---|---|
| `invalid structured checklist metadata in <path>: <serde_yaml error>` | Malformed YAML inside frontmatter |
| `invalid structured checklist metadata in <path>: missing closing YAML frontmatter delimiter` | File starts with `---` but never closes |
| `structured checklist item in <path> is missing a non-empty \`title\`` | Empty or whitespace-only `title` field |
| `unknown field ...` (serde) | Extra key on `StructuredRuntimeChecklistFrontmatter` or `StructuredRuntimeChecklistItem` |

**Real-world example** (`test-packages/vxg-core-layout/suites/graph-structure.md` — legacy mode):

```markdown
# Graph Structure Checklist

Proves the `feature-core-layout` VXG subgraph is structurally correct per
docs/spec.md §2. All 12 items must pass before `visual.fidelity` is started.

The Markdown bullets below are the machine-tracked items; each becomes a
checklist item at instantiate time.

## Items

- **feature-exists**: `feature-core-layout` node exists with nodeType=feature. Verify via `agent-swarm vxg node get feature-core-layout --format json`. Fail if node is missing or has wrong type.
- **pages-exist**: `page-default-layout` and `page-expanded-layout` exist as nodeType=page, both referencing `core-layout-shell` via meta.shell.
- **contains-edges-correct**: The 14 `contains` edges in docs/spec.md §2.1 all exist; no stray contains edges tied to feature-core-layout subtree.
```

This produces three items with ids `graph.structure-1`, `graph.structure-2`, `graph.structure-3` (where `graph.structure` is the suite id from TESTS.md).

### 9b.2 Command suites (`proof_kind: automated`, `execution_mode: command`)

**File format**: `.yaml` / `.yml` / `.json` / `.toml` (extension-driven; anything else rejects with `UnsupportedFormat`).

**Parser**: `load_command_suite_spec` at `crates/swarm-services/src/verify/execution/command.rs:133-176`.

**Type**: `VerificationCommandSuiteSpec` (command.rs:60-81), `#[serde(deny_unknown_fields)]` — any extra field rejects parse.

```rust
pub struct VerificationCommandSuiteSpec {
    #[serde(default)] pub lane: Option<String>,
    #[serde(default)] pub paths: Vec<String>,
    #[serde(default)] pub packages: Vec<String>,
    #[serde(default)] pub staged_configs: Vec<String>,
    #[serde(default)] pub staged_payloads: Vec<String>,
    #[serde(default)] pub integration: VerificationCommandIntegration,
    #[serde(default)] pub mcp_call: Option<VerificationMcpCallSuiteSpec>,
    #[serde(default)] pub http_probe: Option<VerificationHttpProbeSuiteSpec>,
    #[serde(default)] pub sql_probe: Option<VerificationSqlProbeSuiteSpec>,
}
```

**Fields**:

| Field | Type | Default | Purpose |
|---|---|---|---|
| `lane` | `Option<String>` | `None` | Nextest profile name (`fast-local`, `feature-local`, `phase-gate`, `ci-fast`, `ci-merge`, `nightly-extended`). Required in practice for routed suites. |
| `paths` | `Vec<String>` | `[]` | Planner `--paths` filter. Empty → planner uses the suite file path itself. |
| `packages` | `Vec<String>` | `[]` | Planner `--packages` filter. Empty → no package filter. |
| `staged_configs` | `Vec<String>` | `[]` | Relative paths to config files under the package root that the integration will stage before run. Preflighted for existence + parseability. |
| `staged_payloads` | `Vec<String>` | `[]` | Relative paths to payload/fixture files (JSON/binary/etc.) under the package root. Preflighted for accessibility. |
| `integration` | `VerificationCommandIntegration` | `Routed` | Which integration to dispatch. See below. |
| `mcp_call` | `Option<VerificationMcpCallSuiteSpec>` | `None` | Required when `integration: mcp_call`. |
| `http_probe` | `Option<VerificationHttpProbeSuiteSpec>` | `None` | Required when `integration: http_probe`. |
| `sql_probe` | `Option<VerificationSqlProbeSuiteSpec>` | `None` | Required when `integration: sql_probe`. |

**`VerificationCommandIntegration` enum** (command.rs:15-23, `#[serde(rename_all = "snake_case")]`):
- `routed` (default) — dispatches to `scripts/dev/run-rust-tests.sh --tier <lane> --packages ... --paths ...`
- `mcp_call` — invokes an MCP tool via a bundle/profile; requires `mcp_call:` sub-block
- `http_probe` — issues an HTTP request against a URL; requires `http_probe:` sub-block
- `sql_probe` — runs a SQL query against a local sqlite file; requires `sql_probe:` sub-block

**`VerificationMcpCallSuiteSpec`** (command.rs:27-36):
```yaml
mcp_call:
  bundle: vxg_preview@1        # required; alias: bundleId
  tool_name: vxg.get_graph     # required; alias: toolName
  request: { vxgId: swarm2 }   # arbitrary JSON
  profile: vxg-preview-default # optional; alias: profileId
```

**`VerificationHttpProbeSuiteSpec`** (command.rs:40-48):
```yaml
http_probe:
  method: GET                  # default "GET"
  url: http://127.0.0.1:3000/api/health   # required
  headers:                     # default {}
    Accept: application/json
  body: null                   # default None; stringified payload if set
```

**`VerificationSqlProbeSuiteSpec`** (command.rs:52-58):
```yaml
sql_probe:
  database_path: .tmp/swarmd-data/events.redb   # required; alias: databasePath
  query: "SELECT COUNT(*) FROM events WHERE scope LIKE 'bridge.project%'"
  params: []                    # default []
```

**Minimum viable command suite** (`test-packages/bootstrap/simple-verify/suites/backend-fast.yaml`):
```yaml
lane: fast-local
```

That's it. Empty `paths` means planner uses the suite file path; `integration` defaults to `routed`.

### 9b.3 Swarm_session suites (`proof_kind: automated`, `execution_mode: swarm_session`)

**File format**: YAML / JSON (extension-driven).

**Parser**: `load_swarm_session_suite_spec` at `crates/swarm-services/src/verify/execution/swarm_session.rs:423`.

**Type**: `VerificationSwarmSessionSuiteSpec` (swarm_session.rs:29-70), `#[serde(deny_unknown_fields)]`.

```rust
pub struct VerificationSwarmSessionSuiteSpec {
    #[serde(default, alias = "profileId")]          pub profile: Option<String>,
    #[serde(default, alias = "bundleId")]           pub bundle: Option<String>,
    #[serde(default, alias = "adapterKind")]        pub adapter_kind: Option<String>,
    #[serde(default, alias = "targetRef")]          pub target_ref: Option<String>,
    #[serde(default, alias = "targetKind")]         pub target_kind: Option<String>,
    #[serde(default, alias = "runtimeScope")]       pub runtime_scope: Option<String>,
    #[serde(default, alias = "previewTarget")]      pub preview_target: Option<String>,
    #[serde(default, alias = "shellId")]            pub shell_id: Option<String>,
    #[serde(default, alias = "pageId")]             pub page_id: Option<String>,
    #[serde(default, alias = "viewingMode")]        pub viewing_mode: Option<String>,
    #[serde(default, alias = "layoutModeId")]       pub layout_mode_id: Option<String>,
    #[serde(default, alias = "styleModeId")]        pub style_mode_id: Option<String>,
    #[serde(default, alias = "nodeId")]             pub node_id: Option<String>,
    #[serde(default, alias = "implementationRef")]  pub implementation_ref: Option<String>,
    #[serde(default, alias = "viewportWidth")]      pub viewport_width: Option<u32>,
    #[serde(default, alias = "viewportHeight")]     pub viewport_height: Option<u32>,
    #[serde(default)]                               pub playwright: Option<VerificationPlaywrightSuiteSpec>,
    #[serde(default)]                               pub fresh: bool,
    #[serde(default)]                               pub keep_session: bool,
}
```

**Critical structural rules**:
- **All fields are flat.** There is NO nested `target: { kind, vxg_id, preview_target, ... }` object. Each field lives at the top level.
- **There is no `vxg_id` field.** The VXG target is inferred from the TESTS.md `bindings.scopes` (e.g., `vxg/swarm2`). You set `target_kind` + `target_ref` to further specify if needed.
- **There is no `interaction_script` or `expected_evidence` field.** Unknown fields reject parse. Browser automation happens via the `playwright:` sub-block (see below).
- **snake_case is canonical.** camelCase aliases exist (`profileId` → `profile`, `targetKind` → `target_kind`, etc.) — both parse identically, but pick one convention per file.

**Defaults** (swarm_session.rs:26-27):
- `profile` defaults to `"vxg-preview-default"` at runtime if `None`.
- `bundle` defaults to `"vxg_preview@1"` at runtime if `None`.

**Field semantics** (high-level):

| Field | Purpose |
|---|---|
| `profile` | Execution profile ID (e.g., `vxg-preview-default`, `headful-chrome-1680x1080`). |
| `bundle` | Tool bundle ref (e.g., `vxg_preview@1`, `swarm-browser-default`). |
| `adapter_kind` | Which runtime adapter to use (VXG preview vs custom). |
| `target_ref` | Explicit target reference, overriding the scope-derived one. |
| `target_kind` | Discriminator on `VxgTestTargetKind`; typical: `"preview"`. |
| `runtime_scope` | `VxgTestRuntimeScope` discriminator. |
| `preview_target` | `"shell"`, `"page"`, or `"component"` (maps to `VxgPreviewTarget`). |
| `shell_id`, `page_id`, `node_id` | VXG-specific selectors inside the target graph. |
| `viewing_mode`, `layout_mode_id`, `style_mode_id` | VXG shell mode overrides. |
| `implementation_ref` | Bind-time ref for the implementation to test. |
| `viewport_width`, `viewport_height` | Flat viewport dimensions (NOT a nested `viewport:` object). |
| `playwright` | Optional browser-automation sub-block; omit if the suite doesn't drive Playwright directly. |
| `fresh` | When `true`, the runtime spawns a new session instead of reusing. |
| `keep_session` | When `true`, the session persists after run completion. |

**`VerificationPlaywrightSuiteSpec`** (playwright.rs:150-168, `#[serde(deny_unknown_fields)]`):

```rust
pub struct VerificationPlaywrightSuiteSpec {
    #[serde(default = "default_playwright_route")]              pub route: String,
    #[serde(default, alias = "readySelector")]                  pub ready_selector: Option<String>,
    #[serde(default, alias = "viewportWidth")]                  pub viewport_width: Option<u32>,
    #[serde(default, alias = "viewportHeight")]                 pub viewport_height: Option<u32>,
    #[serde(default = "default_playwright_evidence_root", alias = "evidenceRoot")]
                                                                pub evidence_root: String,
    #[serde(default = "default_resource_status_preflight", alias = "resourceStatusPreflight")]
                                                                pub resource_status_preflight: bool,
}
```

| Field | Purpose |
|---|---|
| `route` | Named route in the tool bundle's route table; defaults to a bundle-provided default. |
| `ready_selector` | CSS selector to wait for before capturing evidence. |
| `viewport_width`, `viewport_height` | Playwright viewport (may override the session-level viewport). |
| `evidence_root` | Directory for retained evidence artifacts. |
| `resource_status_preflight` | Whether to run the resource-status preflight check before the browser session (default `true`). |

**Minimum viable swarm_session suite**:

```yaml
profile: vxg-preview-default
bundle: vxg_preview@1
target_kind: preview
preview_target: shell
playwright:
  route: vxg-map-shell
  ready_selector: '[data-ready="true"]'
  viewport_width: 1680
  viewport_height: 1080
```

A `deny_unknown_fields` violation (e.g., `profile_id:` instead of `profile:`, or a nested `target: {}` object) produces `VerificationSwarmSessionError::Parse { path, reason }`.

### 9b.4 Known-bad patterns (reject parse)

These patterns appear in pre-migration test packages (authored before shared verify landed) and **will reject** under the current parsers:

- Checklist YAML frontmatter with per-item `id` / `severity` / `tags` / `required_capabilities` / `automation_hint` — parser ignores frontmatter entirely (reads bullet lines only).
- Command suite `test_filter: "package(x) + test(pattern)"` — no such field; `deny_unknown_fields` rejects.
- Swarm_session nested `target: { kind, vxg_id, preview_target, node_selector }` — not a struct; fields are flat.
- Swarm_session nested `viewport: { width, height }` — not a struct; use flat `viewport_width` / `viewport_height`.
- Swarm_session `interaction_script: scripts/...ts` — no such field; browser automation is configured via `playwright:` sub-block.
- Swarm_session `expected_evidence: [...]` — no such field; evidence is runtime-emitted.
- Swarm_session `profile_id:` / `tool_bundle_ref:` — wrong names. Use `profile:` / `bundle:` (snake_case) or `profileId:` / `bundleId:` (camelCase alias).

## 10. Validation — what `verify.package.validate` checks

Errors surface as `{ ok: false, errors: ["..."] }`. Common categories:

| Error pattern | Cause | Fix |
|---|---|---|
| `missing required field '<x>'` | Frontmatter missing a required key | Add the field |
| `unknown field '<x>'` | Key that `deny_unknown_fields` rejects | Remove the key or double-check spelling |
| `invalid package kind '<x>' (expected 'verification')` | `kind:` is not the string `verification` | Set `kind: verification` |
| `invalid package_version '<x>': semver parse error` | Not valid semver | Use `X.Y.Z` format |
| `package refs must be workspace-relative (relative to workspace root)` | Absolute `package_ref` passed to `verify package validate` / `verify instantiate` / `verify run --package-ref` | Use `test-packages/<slug>` (or `local://test-packages/<slug>`) from the workspace root |
| `paths must be relative to package root` | `source_of_truth.*`, `suites[].file`, or other package-internal path uses an absolute path or `../` escape | Use a path relative to the package directory |
| `source-of-truth file '<path>' does not exist` | `source_of_truth.*` points at missing file | Create the file or fix the path |
| `bindings empty: at least one binding category required` | All binding categories empty | Add `scopes: [...]` |
| `bindings.scopes must have at least one entry` | Empty `scopes` list | Add at least one scope string |
| `duplicate suite id '<id>'` | Two suites share an ID | Rename one |
| `unsupported proof_kind/execution_mode pair: (<p>, <e>)` | Invalid combination | Use one of the 3 valid pairs (§4) |
| `suite file '<path>' does not exist` | `suites[].file` points at missing file | Create or fix |
| `checklist_ref '<id>' references unknown suite` | Cross-suite ref to a non-existent sibling | Ensure referenced suite exists in same package |

## 11. Freshness + blocker policies (for plan attachment)

Plan attachments carry per-attachment policies that control how stale-ness and red-ness interact with plan-run gates:

```rust
pub enum VerificationFreshnessPolicy { Strict, AllowStale }
pub enum VerificationBlockerPolicy { Blocking, Advisory }
```

| Combination | Behavior |
|---|---|
| `Strict` + `Blocking` | Stale OR red → gate fails; plan-run blocks. **Default for production gates.** |
| `Strict` + `Advisory` | Stale OR red → gate reports advisory; plan-run continues. |
| `AllowStale` + `Blocking` | Red → gate fails; stale alone does not block. Useful during migration. |
| `AllowStale` + `Advisory` | Informational only. |

These are **plan-level**, not package-level. The same package can be attached to Plan A with strict/blocking and Plan B with allow-stale/advisory. The package author doesn't write these; the plan author does.

## 12. Plan-attachment schema (for plan package authors)

When a plan consumes a verify package, the plan YAML carries a `verification_packages[]` block. Authors of plans (not packages) write this.

```yaml
# plan package YAML (NOT TESTS.md; in plan package)
verification_packages:
  - attachment_id: verify.vxg-map-proof.primary
    package_ref: local://test-packages/vxg-map-proof
    phases: [qa, final-review]
    work_selectors: []                       # optional label filters
    suite_selectors: [preview.checklist, browser.smoke]
    gate_policy: blocking                    # blocking | advisory
    freshness_policy: strict                 # strict | allow_stale
```

### Fields

| Field | Required | Semantics |
|---|---|---|
| `attachment_id` | yes | Author-chosen; unique within plan. Feeds into obligation_id derivation. |
| `package_ref` | yes | Local path, OCI ref, workspace-relative path, or `local://staged/...` for pulled OCI packages. |
| `phases` | no | Plan phase IDs to attach to. Empty = all phases. |
| `work_selectors` | no | Work-unit label filters (must match package's `bindings.work_unit_queries`). |
| `suite_selectors` | no | Suite IDs to run. Empty = all suites in package. |
| `gate_policy` | yes | `blocking` or `advisory`. |
| `freshness_policy` | yes | `strict` or `allow_stale`. |

Plan-run materialization creates one `VerificationObligationRecord` per (attachment × scope) tuple. Obligations carry the package's suite selectors, the plan's policy, and the normalized capability set.

## 13. Publish flow

`verify.package.publish <package-ref> --target <oci-ref>`:

1. Local compile → `CompiledVerificationArtifact` (with `artifact_id`).
2. OCI encode: manifest + layers (artifact CBOR, source-of-truth docs, suite files).
3. Compute digest: SHA256 of encoded manifest.
4. Sign (if signing config present) with operator key.
5. Push to registry (fail-closed: reject if media-type / digest / trust-policy fails).
6. Update catalog index with digest, trust metadata, publish source, acquisition timestamp.

Result:
```json
{
  "artifact_id": "verify-artifact-1220...",
  "digest": "sha256:abc...",
  "reference": "oci://registry.example.com/verify/<slug>:<version>@sha256:abc..."
}
```

`verify.package.pull <oci-ref>` reverses: verifies digest + signature + trust, stages a local ref, which you can then `verify instantiate local://staged/<slug>`.

## 14. Template lifecycle

`verify.template.list`, `verify.template.create`, `verify.template.validate`.

- Templates live under `test-packages/bootstrap/<template-id>/`.
- `simple-verify` is the one canonical template today (see verify-ops gotcha about its failing stub).
- `verify.template.create` copies the template directory into `--output <rel>`, substitutes variables, then runs `verify.package.validate` on the output. Variable syntax is Jinja2-like `{{ var_name }}` (details in `template.rs`).

Your own templates: create a new directory under `test-packages/bootstrap/`, populate a canonical `TESTS.md` + suites + docs, and it becomes discoverable via `verify.template.list`.

## 15. Package-on-disk layout (canonical)

```
test-packages/my-feature/
├── TESTS.md                        # YAML frontmatter + MD body
├── docs/
│   ├── spec.md                     # source_of_truth.spec (required)
│   ├── architecture.md             # optional
│   └── tdd.md                      # optional
└── suites/
    ├── backend-fast.yaml           # suites[].file for backend.fast
    ├── preview-checklist.md        # suites[].file for preview.checklist
    └── browser-smoke.yaml          # suites[].file for browser.smoke
```

Conventions:
- `docs/` for source-of-truth docs.
- `suites/` for suite execution specs.
- Any additional assets (design refs, fixtures) go under `assets/` (not required, but conventional).
- All paths are package-relative. Nothing escapes the package directory.

## 16. Top 20 gotchas (full list)

1. **`kind` must equal the literal `"verification"`**. Not `verify`, not `pkg`, not empty, not `"Verification"` (case-sensitive).
2. **`package_version` must be valid semver.**
3. **Paths are workspace-relative.** No absolute, no `../`.
4. **Only three valid suite-kind pairs.** (Checklist, Manual), (Automated, Command), (Automated, SwarmSession).
5. **`bindings.scopes` must have at least one entry.**
6. **Suite IDs unique within package.**
7. **`checklist_refs` must reference existing suite IDs** in the same package.
8. **Source-of-truth files must exist** at compile time.
9. **Unknown capabilities pass through non-strict.** Typo = silent drift.
10. **`TESTS.md` body is ignored.** All spec in frontmatter.
11. **`deny_unknown_fields`** rejects unrecognized keys at every level.
12. **Instance IDs are content-hashed.** Re-instantiating identical input returns identical ID.
13. **Editing TESTS.md stales all suites** (`PackageContent`).
14. **Editing a single suite file stales only that suite** (`SuiteFile`).
15. **Capability fingerprint is per-suite.** Changing one suite's caps doesn't stale other suites.
16. **OCI publish is fail-closed** on digest/signature/trust mismatches.
17. **`simple-verify` template's `backend.fast` suite is a deliberately-failing stub.** Don't copy it verbatim (see verify-ops F5).
18. **Checklist verdicts are author-scoped to passes** when `pass_id` is provided; bare verdicts skip pass rollup.
19. **Evidence refs are auto-emitted**; authors don't declare them in TESTS.md.
20. **Stale instances are still queryable** — `verify.greenlight` returns their last known state + stale reasons; it's the plan-gate policy that decides whether stale blocks.
