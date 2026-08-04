# Verify Authoring — Backend Command Packages

> ⚠ Fabric fields shipped 2026-07-19 — see SKILL.md § Durable-fabric frontmatter; this file
> predates them. One claim below is corrected there: `path_globs` do NOT stale an instance on
> source changes today — the shipped freshness inputs hash no watched-file content (D21,
> measured; wiring is B6, Phase-2). Also follow SKILL.md's D19 selector discipline: exact
> backing tests + matched-count assertion; `negative_assertions` is never evaluated.

Authoring guidance for verification packages that run Rust tests via the nextest lane system. The only suite kind here is `(Automated, Command)`. Read SKILL.md + CORE.md first.

## When to author a backend command suite

Write an `execution_mode: command` suite when the proof is:

- Rust unit tests in a crate (`#[test]` fns).
- Rust integration tests under `tests/`.
- Snapshot tests (insta, trybuild).
- Routed CLI tests (`agent-swarm` command coverage).
- Performance regression checks (wrapped as nextest tests).
- Persistence / event-store assertions via `cargo test`.
- Anything that `cargo nextest` can run with a suitable profile.

**Do NOT use command suites for:**
- Browser UI proof → swarm_session (VXG-CANVAS.md)
- Human-judgement visual review → checklist (VXG-CANVAS.md)
- Raw shell commands that aren't cargo/nextest-routed → these bypass the planner and break CI routing

## Source of truth (code + config)

- Lane definitions: `.config/nextest.toml`
- Planner script: `scripts/dev/run-rust-tests.sh`
- Verify command execution integration: `crates/swarm-services/src/verify/execution/command.rs` (approximate path)
- Resource groups: `.config/nextest.toml` lines 76–82

## Lane system — canonical six

| Lane | Retries | Slow timeout | Intended tier | When to use |
|---|---|---|---|---|
| `fast-local` | 0 | 30s | dev-loop | Inner loop during development. Fail-fast disabled; run the whole set quickly. |
| `feature-local` | 1 | 60s | feature-gate | Feature-level local validation. One retry on flakes. |
| `phase-gate` | 1 | 90s | phase-gate | Blocks phase progression. Higher timeout for deeper integration tests. |
| `ci-fast` | 1 | inherit | hosted T1 | CI fast-path (PR pre-check). |
| `ci-merge` | 1 | 120s | hosted T2 | Merge-gate validation. Must pass before merge to main. |
| `nightly-extended` | 1 | 180s | hosted T4a | Nightly extended validation. Slow/heavy tests only. |

Verify never invents a new lane — it inherits from `.config/nextest.toml`. If you need a new test family, propose a lane addition there (Phase 0 backend-test-rework territory).

### Lane decision tree

```
┌────────────────────────────────────────────────────────┐
│ Is the test expected to run in CI (hosted)?            │
└────────────────────────────────────────────────────────┘
   │ no                                      │ yes
   ▼                                         ▼
┌──────────────────────┐          ┌────────────────────────────────┐
│ Runtime < 30s,       │          │ Test runtime < 60s on CI?       │
│ zero external deps?  │          └────────────────────────────────┘
└──────────────────────┘            │ yes              │ no
   │ yes         │ no               ▼                  ▼
   ▼             ▼              ┌──────────┐   ┌──────────────────┐
fast-local   feature-local      │ ci-fast  │   │ Nightly only?    │
                                │ ci-merge │   └──────────────────┘
                                └──────────┘      │ yes        │ no
                                                  ▼            ▼
                                            ┌────────────────┐  ┌──────────┐
                                            │ nightly-       │  │ phase-   │
                                            │ extended       │  │ gate     │
                                            └────────────────┘  └──────────┘
```

Rule of thumb: start a new suite at `fast-local`. Escalate lanes only when real signals demand it:
- Flakes → `feature-local` (one retry).
- Slow (>30s) → `phase-gate` or `ci-merge`.
- Very slow (>2min), external services, heavy resources → `nightly-extended`.

## Resource groups

For tests that cannot run in parallel (shared port, shared fixture, heavy resource):

| Group | Max threads | Use for |
|---|---|---|
| `live-gateway` | 1 | Tests that bind to a gateway socket |
| `gateway-boot` | 1 | Gateway bootstrap/shutdown tests |
| `vxg-heavy` | 1 | VXG backend tests with large graphs |
| `design-heavy` | 1 | Design registry heavy tests |
| `fuse` | 1 | FUSE mount tests (Phase 2 / L2) |
| `sandbox` | 1 | Sandbox-execution tests |

Authors don't declare resource groups in suite files — they're set at the nextest test level via `#[test_group("name")]` attributes or in `.config/nextest.toml`'s `[test-groups]` section. Verify respects them automatically.

If your test needs a resource group that doesn't exist, add it to `.config/nextest.toml` in the same PR as the suite; don't bypass.

## Command suite file format

Minimal `suites/backend-fast.yaml`:

```yaml
lane: fast-local
```

That's enough. The planner resolves the lane to the nextest profile, runs relevant tests in the workspace, and emits evidence.

### Extended form — all fields

The full `VerificationCommandSuiteSpec` (`crates/swarm-services/src/verify/execution/command.rs:60-81`, `#[serde(deny_unknown_fields)]`):

```yaml
lane: feature-local                                 # Optional; omit for non-routed integrations
paths:                                              # Optional; planner --paths filter
  - crates/swarm-services/src/verify
  - crates/swarm-cli/src/commands/verify.rs
packages: [swarm-services, swarm-cli]               # Optional; planner --packages filter
staged_configs:                                     # Optional; preflighted for parseability
  - configs/feature-x.toml
staged_payloads:                                    # Optional; preflighted for accessibility
  - fixtures/feature-x/payload.json
integration: routed                                 # Optional; routed (default) | mcp_call | http_probe | sql_probe
# One of these sub-blocks is required iff integration selects it:
mcp_call: null                                      # VerificationMcpCallSuiteSpec
http_probe: null                                    # VerificationHttpProbeSuiteSpec
sql_probe: null                                     # VerificationSqlProbeSuiteSpec
```

| Field | Default | Purpose |
|---|---|---|
| `lane` | `None` | Nextest profile name. Required for `routed` integration in practice. |
| `paths` | `[]` | Planner `--paths` filter. Empty → planner uses the suite file path itself. Paths in examples are prefixes, not glob patterns. |
| `packages` | `[]` | Planner `--packages` filter. Empty → no package filter. |
| `staged_configs` | `[]` | Relative paths (under package root) to config files the integration stages before run. Preflighted for filesystem presence + parseability. |
| `staged_payloads` | `[]` | Relative paths to payload/fixture files. Preflighted for filesystem accessibility. |
| `integration` | `routed` | Which integration dispatches this suite. See next section. |
| `mcp_call` | `None` | Required when `integration: mcp_call`. |
| `http_probe` | `None` | Required when `integration: http_probe`. |
| `sql_probe` | `None` | Required when `integration: sql_probe`. |

**There is no `test_filter` field.** If you need nextest filter expressions beyond `paths` + `packages`, encode them in the nextest profile (`.config/nextest.toml`'s `default-filter` for the lane) — not in the suite YAML. `deny_unknown_fields` will reject unknown keys at parse time.

### Integration kinds — when to use each

`VerificationCommandIntegration` is an enum (`command.rs:15-23`, `#[serde(rename_all = "snake_case")]`):

| Integration | When to use |
|---|---|
| `routed` (default) | Standard Rust test execution via `scripts/dev/run-rust-tests.sh --tier <lane> --packages ... --paths ...`. This is what you want 95% of the time. |
| `mcp_call` | Suite is an MCP tool invocation against a running bundle/profile. Used when the "test" is really "call this MCP tool and assert the response shape". |
| `http_probe` | Suite is an HTTP request against a running endpoint. Used for liveness / health checks. |
| `sql_probe` | Suite is a SQL query against a local sqlite database (typically the swarmd event store). Used for persistence assertions. |

### Sub-block schemas

**`mcp_call` sub-block** (`VerificationMcpCallSuiteSpec`, command.rs:27-36):
```yaml
integration: mcp_call
mcp_call:
  bundle: vxg_preview@1            # required; alias bundleId
  tool_name: vxg.get_graph         # required; alias toolName
  request:                         # default {}; arbitrary JSON
    vxgId: swarm2
  profile: vxg-preview-default     # optional; alias profileId
```

**`http_probe` sub-block** (`VerificationHttpProbeSuiteSpec`, command.rs:40-48):
```yaml
integration: http_probe
http_probe:
  method: GET                                       # default "GET"
  url: http://127.0.0.1:3000/api/health             # required; absolute URL
  headers:                                          # default {}
    Accept: application/json
  body: null                                        # default None; stringified payload if non-null
```

**`sql_probe` sub-block** (`VerificationSqlProbeSuiteSpec`, command.rs:52-58):
```yaml
integration: sql_probe
sql_probe:
  database_path: .tmp/swarmd-data/events.redb       # required; alias databasePath
  query: "SELECT COUNT(*) FROM events WHERE scope LIKE 'bridge.project%'"
  params: []                                         # default []
```

All sub-block structs are `#[serde(deny_unknown_fields)]` — keep them tight.

## Invocation contract — the planner

Verify invokes `scripts/dev/run-rust-tests.sh` with:

```bash
scripts/dev/run-rust-tests.sh \
  --json \
  --tier fast-local \
  --paths suites/backend-fast.yaml \
  --packages swarm-services,swarm-cli
```

### Script arguments (`scripts/dev/run-rust-tests.sh`)

```
usage: scripts/dev/run-rust-tests.sh [--json] [--run-auxiliary] [--tier TIER] [--paths PATH ...] [--packages PKG[,PKG...]]

  --json          Emit JSON planner output instead of running tests
  --run-auxiliary Run auxiliary test programs (slow, opt-in)
  --tier TIER     One of: fast-local | feature-local | phase-gate | ci-fast | ci-merge | nightly-extended
  --paths PATH    Filter by path; repeat for multiple paths
  --packages PKG  Comma-separated list of workspace packages to filter
```

### Planner vs executor

- `--json` = planner mode. Emits the computed test manifest without running. Verify uses this during `verify.package.validate` to pre-check that the lane + filter combination selects something.
- Without `--json` = executor mode. Actually runs the tests and streams results.

Verify command suites flow: validate → planner introspection (`--json`) → real run → capture output as CAS evidence.

## Evidence from nextest runs

`named_evidence_refs` emitted automatically for each command suite run:

| Key | Contents |
|---|---|
| `planner.json` | Planner output (which tests would run, which packages were touched) |
| `preflight.json` | Preflight checks (lane resolution, resource groups, filter validation) |
| `nextest_output` | Raw nextest stdout + stderr (per-test results, timing) |
| `coverage` | Optional coverage output if enabled at the profile level |
| `junit.xml` | Optional JUnit XML if enabled |

Authors cannot rename these keys — they're runtime-emitted. If you need custom evidence (e.g., a performance baseline file), have your test write it to a known path and ensure the lane's profile captures it.

## What NOT to embed in a command suite

1. **Raw `cargo test` invocations.** Bypasses the planner, breaks CI routing. Always use the lane.
2. **Raw `cargo nextest run ...` commands.** Same problem — the planner is the integration point.
3. **Shell scripts with side effects.** Command suites run inside the planner's execution context; they are not arbitrary shell escape hatches.
4. **Build steps.** Verify command suites assume the workspace is already buildable. If your test needs a prebuild step, model it as a test-level `#[ctor]` or fixture, not as a suite-level shell command.
5. **Environment variable setup.** Declare env vars via the nextest profile (`.config/nextest.toml`), not in the suite file.
6. **Docker orchestration.** Model docker dependencies as resource groups + test fixtures (e.g., `testcontainers` crate). Do not shell out to `docker` from a command suite.
7. **Network-dependent tests without guards.** Tests that hit real networks must be guarded by a feature flag or env var and live in `nightly-extended`.
8. **Platform-specific tests without `cfg` guards.** Use `#[cfg(target_os = "macos")]` etc. at the test level, not in the suite file.

## Integration test vs unit test packaging

One package can contain both:

```yaml
suites:
  - id: backend.unit
    proof_kind: automated
    execution_mode: command
    file: suites/backend-unit.yaml
    required_capabilities: [backend.assertions]

  - id: backend.integration
    proof_kind: automated
    execution_mode: command
    file: suites/backend-integration.yaml
    required_capabilities: [backend.assertions, persistence.assertions]
```

Where:
```yaml
# suites/backend-unit.yaml
lane: fast-local
packages: [swarm-services]
paths: [crates/swarm-services/src]

# suites/backend-integration.yaml
lane: feature-local
packages: [swarm-services]
paths: [crates/swarm-services/tests]
```

The split between unit and integration comes from the **paths** filter (which subdirectory the planner selects) plus the lane choice (unit → `fast-local`, integration → `feature-local` with its one retry). There is no suite-level test-name filter.

## Multi-crate suites

A single command suite can span multiple workspace crates via `packages`:

```yaml
lane: ci-merge
packages: [swarm-services, swarm-gateway, swarm-cli]
```

Or narrow the set of paths the planner considers:

```yaml
lane: feature-local
packages: [swarm-services, swarm-gateway]
paths:
  - crates/swarm-services/src/verify
  - crates/swarm-gateway/src/verify_handlers
```

The nextest profile's `default-filter` (in `.config/nextest.toml`) still governs which tests in the selected packages actually run. If you need finer-grained test selection within a crate, **edit the nextest profile**, not the suite YAML.

## Flakiness handling

Lanes set retry counts. One retry on `feature-local` / `phase-gate` / `ci-fast` / `ci-merge` / `nightly-extended` means: if a test fails once, it gets one retry; if it fails again, the suite fails.

**Do not fight flakes at the suite level.** Either:
1. Fix the test to be deterministic (preferred).
2. Move it to `nightly-extended` if it's inherently slow/flaky (for now).
3. Quarantine it via nextest's `filter_expr` exclusion until fixed.

Adding retries beyond the lane default requires a `.config/nextest.toml` change, not a suite change.

## Heavy-lane rules

Heavy tests (>60s, external services, large fixtures) must:

1. Land in `nightly-extended` (or `phase-gate` if phase-gating demands it).
2. Declare any required resource group via test attributes.
3. Be gated behind an env var or feature flag if they need external infrastructure.
4. Not run in `fast-local` or `feature-local` (those are inner-loop lanes).

If a feature has a natural heavy-test backbone, split it:

```yaml
suites:
  - id: backend.fast
    proof_kind: automated
    execution_mode: command
    file: suites/backend-fast.yaml         # fast-local, no external deps

  - id: backend.integration
    proof_kind: automated
    execution_mode: command
    file: suites/backend-integration.yaml  # feature-local, docker required

  - id: backend.nightly
    proof_kind: automated
    execution_mode: command
    file: suites/backend-nightly.yaml      # nightly-extended, real network
```

Plan attachment can then gate phases on only the lanes appropriate for that phase (blocking `fast-local` for PR, `ci-merge` for merge-gate, advisory `nightly-extended` for release readiness).

## Environment setup — don't put it in the suite

Env vars, secrets, docker setup, service bootstrapping — none of these go in the suite YAML. They live in:

- **Nextest profile** (`.config/nextest.toml`) — set env vars per profile.
- **Test fixtures** (crate code) — set up + tear down per-test or per-module.
- **Resource groups** — serialize conflicting tests.
- **CI orchestration** — bring up docker/network before nextest runs.

A command suite file should be **2–10 lines** in almost all cases. If yours is longer, push the complexity down.

## Relationship to Phase 0 backend-test-rework

The lane system is the product of Phase 0's backend-test-rework. Verify command suites are **consumers** of that system, not an alternative to it:

- Do not embed `cargo nextest` folklore in TESTS.md suites.
- Do not define lanes inside TESTS.md.
- Do not bypass the planner.

If the lane system is missing something you need, the fix lives in `.config/nextest.toml` + `scripts/dev/run-rust-tests.sh` — not in the verify suite spec.

Relevant docs: `docs/plan-hub/audit/` (Phase 0 alignment), `thoughts/alignment/phase-0-tdd.md`.

## Staleness specifics for command suites

Key staleness triggers for backend suites:

| Kind | Triggers when |
|---|---|
| `SuiteFile` (suite-scoped) | `suites/backend-fast.yaml` edited (hash changes) |
| `PackageContent` (all-suite) | `TESTS.md` edited |
| `SourceOfTruthDoc` (all-suite) | Spec doc hash changes |
| `NormalizedCapabilities` (suite-scoped) | Capability list changed |

**Key absence**: unit tests themselves changing does NOT stale the instance. Stale is about the package contract, not about source code. A package that binds to `crates/swarm-services/src/verify/**` via `path_globs` will stale on source changes (drift-only); a package without `path_globs` won't.

## Minimum viable backend package (literal)

Save as `test-packages/my-backend-proof/TESTS.md`:

```yaml
---
package_id: verify.my-backend-proof
name: My Backend Proof
kind: verification
package_version: "1.0.0"
layer_id: l1
description: Command-suite proof for the <feature> crate(s).
tags: [backend, feature-x]

source_of_truth:
  spec: docs/spec.md

bindings:
  scopes: [project/swarmnet]
  path_globs:
    - "crates/swarm-services/src/feature_x/**"

suites:
  - id: backend.fast
    proof_kind: automated
    execution_mode: command
    file: suites/backend-fast.yaml
    required_capabilities: [backend.assertions]
---

# My Backend Proof

Covers the <feature-x> subsystem. Runs a fast-local lane filter over
`swarm-services::feature_x::tests::*`.
```

And `suites/backend-fast.yaml`:

```yaml
lane: fast-local
packages: [swarm-services]
paths: [crates/swarm-services/src/feature_x]
```

Validate:

```bash
agent-swarm verify package validate test-packages/my-backend-proof --format json
```

Iterate until `ok: true`, then instantiate + run.

## Gotchas specific to backend command authoring

1. **`lane` is the only required field in most suite YAMLs.** Over-specifying (filters, packages) narrows scope; start broad, narrow as needed.
2. **Filters are nextest DSL, not shell globs.** `package(x)`, `test(pattern)`, `kind(bench)`. See `cargo nextest help filter` for the full grammar.
3. **`paths` filters are for planner hint, not final selection.** The planner uses them to decide which packages are touched; the lane's `default-filter` controls actual test selection.
4. **`nightly-extended` runs nightly only.** A suite on this lane will never surface in PR gates — it's advisory until nightly.
5. **Don't assume workspace-wide tests run.** Lanes like `fast-local` have `default-filter = "all() - binary(...)"` — read `.config/nextest.toml` before reasoning about selection.
6. **Command suites are instance-scoped, not global.** Two instances of the same package on different scopes get independent runs.
7. **Test timeouts are set at the lane level, not the suite level.** If your test needs longer, move to a slower lane or fix the test.
8. **Coverage evidence is opt-in.** Don't expect coverage unless the lane's profile enables it.
9. **Don't chain suites with `checklist_refs` for ordering automated runs.** The field is for cross-suite dependencies. Command suites run independently; `checklist_refs` is mainly meaningful when a checklist depends on a prior run's state.
10. **`#[ignore]` tests are skipped by default.** Don't rely on them running in any lane unless the profile's filter explicitly includes `ignore(...)`.
