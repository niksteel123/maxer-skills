# Verify Authoring — Backend Command Packages

Author deterministic proof as `(automated, command)`. Use either the repository's
routed planner or an explicit command matrix with exact test selection. Both use
the same UVP command executor and evidence path. Read SKILL.md + CORE.md first.

## When to author a backend command suite

Write an `execution_mode: command` suite when the proof is:

- Rust unit tests in a crate (`#[test]` fns).
- Rust integration tests under `tests/`.
- Snapshot tests (insta, trybuild).
- Routed CLI tests (`agent-swarm` command coverage).
- Performance regression checks (wrapped as nextest tests).
- Persistence / event-store assertions via `cargo test`.
- Anything that `cargo nextest` can run with a suitable profile.

Use a checklist for subjective visual acceptance. Browser automation can use an
explicit project test runner or a supported `swarm_session` adapter; choose the
consumer that actually executes the required product path (VXG-CANVAS.md).

Explicit commands are supported, including narrow `cargo nextest` invocations,
build checks, and other projects' test runners. Keep the command tied to an actual
proof obligation. A version check or a script that merely writes a success file
does not establish product behavior.

## Source of truth (code + config)

- Lane definitions: `.config/nextest.toml`
- Planner script: `scripts/dev/run-rust-tests.sh`
- Command schema/structural checks: `crates/swarm-services/src/verify/execution/command.rs`
- Shared plan/execution wiring: `crates/swarm-services/src/verify/service/execution_plan.rs`
- Command execution/evidence: `crates/swarm-services/src/verify/service.rs`, `execution/nextest.rs`
- Resource groups and assignment overrides: `.config/nextest.toml`

## Lane system

Follow the project's testing policy: `fast-local` for narrow repair,
`feature-local` for cross-crate pre-close proof, `phase-gate` for milestone
validation, and `merge-gate` policy through the concrete `ci-merge` profile.
`ci-fast` mirrors the conservative CI fast path; `nightly-extended` carries
environment-gated heavy proof. Read current profile filters, retries, slow-timeout
periods and termination counts from `.config/nextest.toml`.

The routed planner receives the declared `lane` as `--tier`. Policy may escalate
it; `verify run plan` reports requested lane, resolved `routed.tier` and reasons.
With an explicit command matrix, `lane` labels the plan; it does not rewrite a
command's `--profile`, add `-p`, or enforce resource groups. Put the intended
profile/package/target selection in the command itself and inspect the plan.
Fix flakes rather than treating a retry or a slower lane as proof of correctness.

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

This table is illustrative; the live config contains additional groups. Nextest
groups are declared in `[test-groups]` and assigned through profile overrides with
`filter` + `test-group` (and sometimes `threads-required`). There is no Rust
`#[test_group]` mechanism to assume. An explicit nextest command consumes these
settings through its selected profile; a generic shell command does not.

If your test needs a resource group that doesn't exist, add it to `.config/nextest.toml` in the same PR as the suite; don't bypass.

## Command suite file format

Portable narrow suite, `suites/backend-fast.yaml`:

```yaml
lane: fast-local
commands:
  - bash -lc "python3 -m unittest discover -s tests -p test_slug.py"
```

This runs the named project's tests from the workspace root. Direct allowed tools
include `bash`, `sh`, `bun`, `bunx`, `cargo`, `git`, `rg`, and `rustc`; wrap Python,
Node or project scripts with the supported shell form. Check `nextest.rs` for the
full allowlist and quoting rules. `run plan` shows commands but does not execute
them or prove executable availability.

### Execution fields

`VerificationCommandSuiteSpec` rejects unknown fields. Its execution fields are:

```yaml
lane: feature-local                                 # Optional requested lane
paths:                                              # Routing hints, NOT test-name selectors
  - crates/swarm-services/src/verify
  - crates/swarm-cli/src/commands/verify.rs
packages: [swarm-services, swarm-cli]               # Optional; planner --packages filter
commands: []                                        # Explicit matrix overrides implicit routing
resource_commands: []                               # Execute before commands; failure blocks body
staged_configs:                                     # Optional; preflighted for parseability
  - configs/feature-x.toml
staged_payloads:                                    # Optional; preflighted for accessibility
  - fixtures/feature-x/payload.json
integration: routed                                 # Optional; routed (default) | mcp_call | http_probe | sql_probe
# One of these sub-blocks is required iff integration selects it:
mcp_call: null                                      # VerificationMcpCallSuiteSpec
http_probe: null                                    # VerificationHttpProbeSuiteSpec
sql_probe: null                                     # VerificationSqlProbeSuiteSpec
scope_plan: null                                    # Declared compile/test scope; see below
```

| Field | Default | Purpose |
|---|---|---|
| `lane` | `None` | Requested routed tier, or explicit-matrix label (default `fast-local` for that matrix). It does not modify explicit commands. |
| `paths` | `[]` | Input to implicit routing; empty uses the suite file path. Does not select unit vs integration tests. Explicit matrices expose these as inspection hints only. |
| `packages` | `[]` | Input to implicit routing; inspect resolved packages. In explicit matrices it does not add Cargo `-p` arguments. |
| `commands` | `[]` | Ordered explicit commands. A nonempty command or resource matrix bypasses the repository router, using the shared command executor. |
| `resource_commands` | `[]` | Commands executed before the body; nonzero exit prevents body execution. Use for actual inventory/count/resource preflight. |
| `scope_plan` | `None` | Structural scope contract; not an automatic compiled-test inventory check. |
| `staged_configs` | `[]` | Package-relative files preflighted for presence/parseability. This field does not itself copy files. |
| `staged_payloads` | `[]` | Package-relative files preflighted for accessibility, not semantic validity. |
| `integration` | `routed` | Which integration dispatches this suite. See next section. |
| `mcp_call` | `None` | Required when `integration: mcp_call`. |
| `http_probe` | `None` | Required when `integration: http_probe`. |
| `sql_probe` | `None` | Required when `integration: sql_probe`. |

There is no top-level `test_filter` field. Put exact nextest `-E` selection and
Cargo `-p` / `--lib` / `--test` target selection in `commands`. Do not change a
shared profile's `default-filter` to narrow one suite.

For example, this selects one existing Swarmnet service test. The declared
count is an expectation until an inventory preflight measures it:

```yaml
lane: fast-local
packages: [swarm-services]
scope_plan:
  profile: fast-local
  packages: [swarm-services]
  binaries: [swarm-services]
  test_count: 1
negative_assertions:
  - text: Planning must not execute the selected command or mutate earned state.
    bound_tests: [run_plan_is_read_only_and_shares_real_execution_commands]
commands:
  - cargo nextest run --profile fast-local -p swarm-services --lib -E 'test(=verify::service::execution_plan::tests::run_plan_is_read_only_and_shares_real_execution_commands)'
```

`scope_plan` requires sorted, unique, nonempty packages/binaries, a positive
`test_count`, exact equality of `packages` and `scope_plan.packages`, matching
lane/profile when both exist, and binaries owned by declared packages (`pkg` or
`pkg::binary`). With a scope plan, each negative assertion needs nonempty `text`
and `bound_tests`. The service validates these relationships; it does not
resolve those test names, compare the declared count with inventory, or evaluate
the prose. Add a project-owned `resource_commands` preflight that reads the same
scope/selector, checks actual compiled inventory and fails for zero, extra or
missing matches. Record the measured count in its evidence. Planning this
example alone establishes neither one compiled test nor the negative claim.

Other accepted annotation fields are `scope`, `summary`, `e2e_gates`,
`verification_criteria`, `checklist_items`, `evidence_required`,
`negative_assertions`, `static_no_mock_checks`, `static_checks` and
`agent_families`. Acceptance requires a test or adapter that actually consumes
the claim; parsing an annotation is not execution.

### Integration kinds — when to use each

`VerificationCommandIntegration` is an enum (`command.rs:15-23`, `#[serde(rename_all = "snake_case")]`):

| Integration | When to use |
|---|---|
| `routed` (default) | Explicit command matrix when present; otherwise repository routing via `scripts/dev/run-rust-tests.sh --tier <lane> --packages ... --paths ...`. |
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
  database_path: evidence/fixture.sqlite           # required SQLite DB; alias databasePath
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

- `--json` = router planner mode. Emits routing decisions and commands without running tests. Package validation alone does not execute this planner or prove test matches; use `verify run plan` to load the actual command definition and resolve execution planning.
- Without `--json` = executor mode. Actually runs the tests and streams results.

Use `verify package validate` → `verify run plan --package-ref <ref> --suite <id>`
→ inspect scope, commands and asset checks → actual selected run. Read-only
planning creates no instance/run and changes no earned state. It does not run
the compiled inventory, resource commands, test body, or live probe adapters.
`matched_suite_count` counts suites; `declared_test_count` is not a measurement.

## Evidence from nextest runs

`named_evidence_refs` emitted automatically for each command suite run:

| Key | Contents |
|---|---|
| `planner.json` | Resolved command matrix, lane, packages and routing reasons |
| `preflight.json` | Config/payload accessibility and parse checks |
| `resource.N.json` | Actual resource/preflight command, exit status, output and lifecycle timing |
| `command.N.json` | Actual body command, exit status, output and lifecycle timing |

These keys are runtime-emitted. Nextest JUnit files or a custom coverage output
are not automatically named UVP evidence merely because a profile writes them.
Retain and bind needed artifacts through the package evidence contract. Inspect
structured run verdicts: the CLI request can exit 0 while the suite is red.

## Execution boundaries

Commands execute with the runner's environment, workspace and child lifecycle
limits. Keep reusable setup in owned test fixtures or project scripts; explicit
build checks and shell-wrapped setup are supported when they are the real proof.
Do not put secrets into committed suite files. Guard external infrastructure and
platform-specific requirements, reserve actual conflicting resources, and follow
the project's authorization and artifact policies. Neither `lane` nor a parsed
scope declaration makes arbitrary side effects safe or resource-bounded.

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
commands:
  - cargo nextest run --profile fast-local -p swarm-services --lib -E 'test(=verify::service::execution_plan::tests::run_plan_is_read_only_and_shares_real_execution_commands)'

# suites/backend-integration.yaml
lane: feature-local
packages: [swarm-cli]
commands:
  - cargo nextest run --profile feature-local -p swarm-cli --test verify_cli_tests -E 'test(=it_verify_run_plan_cli_uses_narrow_service_plan_without_starting_a_run)'
```

The split comes from explicit Cargo target selection (`--lib` versus `--test`)
and exact test expressions. `paths` alone cannot establish that split. Add the
same inventory/count preflight described above; a narrow test-name selector can
still cause substantial compilation, so measure compile and execution separately.

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

These are implicit-routing examples, suitable when the intended gate really is
that broad. Inspect `verify run plan` because path policy can escalate the lane
or package set. For finer selection use an explicit matrix with the required
Cargo targets and exact test expressions, retaining the shared profile policy.

## Flakiness handling

Lanes set retry counts. One retry on `feature-local` / `phase-gate` / `ci-fast` / `ci-merge` / `nightly-extended` means: if a test fails once, it gets one retry; if it fails again, the suite fails.

Fix the underlying nondeterminism. If a case needs environmental isolation,
declare that requirement and schedule it accordingly. Quarantine requires an
explicit unresolved-proof record; it cannot quietly turn the affected gate green.
Read retry settings from the selected profile and retain failed-attempt evidence.

## Heavy-lane rules

Choose the heavy lane from project policy and actual requirements, rather than
an arbitrary duration threshold. Use nextest assignment overrides for groups,
explicit admission for scarce machines, and environment gates for infrastructure.
Inspect resource status before heavy work and reuse a compatible persistent build
root. Keep a small independent proof in the repair loop where one exists.

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

## Environment setup

Pass host-local configuration through the runner environment and use reusable
fixtures/scripts for lifecycle work. A shell wrapper may set nonsecret variables
for an explicit command. Resource groups serialize only their assigned nextest
members. Do not invent a top-level `env` or timeout field in suite YAML: the
current command schema has neither. The UVP child deadline and retention limits
are runner settings; nextest also applies its own profile settings.

## Relationship to repository routing

Keep shared scheduling/filter policy in `.config/nextest.toml` and routing policy
in `scripts/dev/run-rust-tests.sh`. Keep one suite's exact command selection in
that suite. External repositories without the Swarmnet router should use explicit
commands. Do not grow production handlers that recognize a UVP package or fixture.

## Staleness specifics for command suites

Key staleness triggers for backend suites:

| Kind | Triggers when |
|---|---|
| `SuiteFile` (suite-scoped) | `suites/backend-fast.yaml` edited (hash changes) |
| `PackageContent` | Semantic contract input changes; old snapshots may use full-document hash fallback |
| `SourceOfTruthDoc` (all-suite) | Spec doc hash changes |
| `NormalizedCapabilities` (suite-scoped) | Capability list changed |

Freshness hashes the declared `path_globs` set and router bytes as a routing
surface; it does not hash every source file matching those globs. A test or
product-source edit therefore needs an affected proof run even when the stored
projection remains fresh. Use existing per-suite snapshots and lineage carryover;
do not mint a replacement instance merely to make a stale result disappear.
Checklist item carryover has its own identity/input/evidence checks (CORE.md §9b.1).

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

Covers the actual invariant named by its explicit test command. Replace this
illustration with the product's real backing tests and inventory preflight.
```

And `suites/backend-fast.yaml`:

```yaml
lane: fast-local
packages: [swarm-services]
commands:
  - cargo nextest run --profile fast-local -p swarm-services --lib -E 'test(=verify::service::execution_plan::tests::run_plan_is_read_only_and_shares_real_execution_commands)'
```

Validate:

```bash
agent-swarm verify package validate test-packages/my-backend-proof --format json
agent-swarm verify run plan --package-ref test-packages/my-backend-proof --suite backend.fast --format json
```

Resolve parse/planning errors, inspect the actual selected command and declared
versus measured scope, then run. If the package already holds earned state,
amend through its existing lineage and inspect carryover before adoption.

## Gotchas specific to backend command authoring

1. **A lane-only file can route broadly.** Start from the smallest useful proof and inspect its real plan.
2. **Nextest filters are its DSL, not shell globs.** Use exact test equality or anchored expressions and verify the resulting inventory.
3. **`paths` filters are for planner hint, not final selection.** The planner uses them to decide which packages are touched; the lane's `default-filter` controls actual test selection.
4. **A profile name is not a schedule or gate policy.** A `nightly-extended` suite runs only when something actually invokes it; attachments define whether it blocks.
5. **Don't assume workspace-wide tests run.** Lanes like `fast-local` have `default-filter = "all() - binary(...)"` — read `.config/nextest.toml` before reasoning about selection.
6. **Command suites are instance-scoped, not global.** Two instances of the same package on different scopes get independent runs.
7. **There is no suite timeout field.** Account for both runner deadlines and nextest settings.
8. **Emitting coverage is not retaining it as UVP evidence.** Bind the artifact that the acceptance contract requires.
9. **`checklist_refs` is not an execution scheduler.** Existing-reference validation does not prove prerequisite ordering; orchestrate actual required outputs explicitly.
10. **Ignored tests need explicit runner selection.** Verify inventory and the runner's ignored-test options; a matching name alone does not establish execution.
