---
name: verify-ops
description: Unified Verification Packages (UVP) operations playbook. Use when authoring, validating, publishing, pulling, instantiating, running, scheduling, or reading greenlight/reports from proof packages via swarmd bridge RPC, MCP (verify_* tools), or the `agent-swarm verify` CLI. Covers the full canonical surface — package lifecycle, checklist pass/verdict, automated runs, catalog discovery, schedules, templates — and the fail-closed scoping contract the UVP service enforces. Triggers include any mention of TESTS.md, verification packages, checklist verdicts, `verify_run`, greenlight, evidence bundles, instance staleness, OCI verify distribution, verify catalog, verify schedules, verify templates, or proof obligations attached to plans/work.
---

# Verify Ops — Unified Verification Packages

Use this skill when the task touches the shared **verify** surface: authored verification packages (`TESTS.md`), compiled artifacts, runtime instances, checklist verdicts, automated runs, evidence bundles, report/greenlight projections, OCI catalog distribution, verify schedules, or verify templates.

The verify surface is a shared L1 domain that owns proof topology, evidence lifecycle, freshness, and acceptance semantics. VXG testing and plan gates consume it — do not reach past the shared surface when the task has a verify answer.

## Plan, repair, then gate

Before extending verification, identify the unproven product behavior or material
failure risk and the decision this run will change. Execute the required proof;
do not turn optional edge/recovery ideas into new blockers. When sufficient evidence
exists, advance the next useful outcome. If an existing obligation exceeds current
intent, request its explicit contract amendment rather than silently skipping it.

Inspect `agent-swarm verify --help` and use the supported read-only execution
plan before an expensive run. Confirm selected suites, execution mode, commands,
requested/resolved lane, scope and preflight notes. `matched_suite_count` counts
suites; `declared_test_count` is an expectation, not compiled inventory. Invalid
selectors fail before command planning. Planning is not a run or acceptance.

For a narrow fix, run exact failing tests or affected suites first. Run the
broader pre-close proof when inputs stabilize, then the required milestone gate.
Do not repeat capture/render/build solely to re-judge retained evidence whose
relevant inputs remain valid. Report actual cold/warm timings when available;
do not infer a speedup from selection alone.

Manual acceptance requires the reviewer's actual observation, reasoning and a
usable retained evidence reference. A measured value or generated video is not
itself a quality pass. Use agent review unless the criterion explicitly needs a
person or physical interaction. On package/checklist edits, inspect carryover
and retain only unchanged item/input/evidence obligations; changed obligations
lose prior acceptance. Keep product readiness distinct from internal gate status.

## Source of Truth

- **Spec**: `thoughts/unified-verification-packages/unified-verification-packages-spec.md`
- **Architecture**: `thoughts/unified-verification-packages/unified-verification-packages-architecture.md`
- **TDD**: `thoughts/unified-verification-packages/unified-verification-packages-tdd.md`
- **Bootstrap**: `thoughts/unified-verification-packages/unified-verification-packages-bootstrap.md`
- **Strategy**: `thoughts/unified-verification-packages/unified-verification-packages-strategy.md`
- **Implementation root**: `crates/swarm-services/src/verify/` (service, compiler, report, schedule, template, catalog, adapters)
- **Method registrations**: `swarmd/src/method_registrations/verify.rs` (`MethodGroup::Verify`; the count moves — enumerate live via `agent-swarm verify --help`)
- **CLI command tree**: `crates/swarm-cli/src/commands/verify.rs`
- **Bootstrap template**: `test-packages/bootstrap/simple-verify/`

## Mental Model

Five lifecycle records compose the verify domain. Treat them as progressive states of a single proof object — never mix identifiers across layers.

| Record | Mutability | Identity | Created by |
|---|---|---|---|
| `VerificationPackageSpec` | authored (mutable) | `package_id` (author-provided) | human / template author |
| `CompiledVerificationArtifact` | immutable | `artifact_id` (deterministic hash of canonical compiled payload) | `verify.package.validate` / `verify.instantiate` |
| `VerificationInstance` | mutable runtime state | `instance_id` (deterministic from `artifact_id + binding fingerprint + owner context`) | `verify.instantiate` |
| `VerificationEvidenceBundle` | CAS-backed, append-only | `evidence_bundle_id` | automated runs and verdict writes |
| `VerificationReportProjection` | mutable projection (never mutates source data) | `report_id` | `verify.report` / `verify.greenlight` |

Identity rules worth burning in:

- `package_id` is author-provided; `artifact_id`, `instance_id`, `obligation_id` are **deterministic hashes**. Re-instantiating with identical inputs returns the same `instance_id`.
- If the binding fingerprint changes (target, capabilities, skeleton version, plan metadata), the instance becomes **stale**. Agent must re-check `stale_reason_count`/`stale_reasons` before trusting a cached report.
- `projection_generation` increments whenever suite state changes. If your cached `report_id` has a lower generation than the live instance, the report is stale.

Durable-fabric records riding on these (2026-07-19): **lineage edges** (recorded at local
publish when `lineage.previous_digest` is set; `verify get` exposes the instance's ancestor
edge via `.carryover` — `ancestor_instance_id`/`ancestor_digest` — and the catalog surfaces
`superseded_by` recomputed from the lineage index; there is no chain-listing verb), a **carryover
audit** `{carried, reset, new}` persisted per instantiate (B1), **per-suite provenance**
(`earned` vs `inherited`, H2) and **green-time input snapshots** (`inputs_as_of_last_green`,
B2 — what staleness actually evaluates against after a green), **rebaseline audit records**
(`vrba-…`), and **evidence manifests** (sha256+CAS entries per green run, B11-core). See
"Durable-Fabric Operations" below.

## Canonical Method Surface

Methods registered under `MethodGroup::Verify` (the durable-fabric work added `rebaseline`, `schedule tick`, and the scoped-greenlight/lineage parameters — enumerate live via `agent-swarm verify --help` rather than trusting a count). CLI path `agent-swarm verify …` ↔ MCP tool `verify_*` ↔ RPC name `verify.*`. All share the fail-closed scoping contract: foreign workspace/path references are rejected with `permission_denied`.

### Package lifecycle (author → distribute → stage)
| CLI | MCP tool | Purpose | Mutates |
|---|---|---|---|
| `verify package validate <ref>` | `verify_package_validate` | Parse + validate TESTS.md, relative refs, proof/execution matrix | N |
| `verify package publish <ref> --target <oci>` | `verify_package_publish` | Sign + push to OCI distribution, pin digest | Y |
| `verify package pull <oci-ref>` | `verify_package_pull` | Verify digest + signature, stage local staged ref | Y |

### Runtime (instance → run → read projection)
| CLI | MCP tool | Purpose | Mutates |
|---|---|---|---|
| `verify instantiate <ref>` | `verify_instantiate` | Compile + resolve adapter + create instance + preflight | Y |
| `verify list` | `verify_list` | Lightweight summary of all workspace instances (suite counts, green bool) | N |
| `verify get <instance-id>` | `verify_get` | Full instance detail — suites, named evidence refs, stale reasons | N |
| `verify report <instance-id>` | `verify_report` | Derive projection (refreshes generation) | N (side-effect: caches projection) |
| `verify greenlight [--instance-id] [--view <name>] [--suite-selector <id>…] [--require-earned] [--detail summary\|normal\|full]` | `verify_greenlight` | Read projection buckets: required / red / stale / never-run suite IDs, advisory buckets, `earned_suite_count` / `inherited_suite_count`, `unresolved_carryover_miss_count`, `stale_reasons` audit trail. **Scoped reads** (`--view` / `--suite-selector`) additionally return the `earned_suite_ids` / `inherited_suite_ids` lists, `floor_expired` (suite-id list, H3), and `view_error` (`unknown_view` when the view name doesn't exist — check it before trusting an empty result). `--view` evaluates a named package view (B3 scoped greenlight); `--suite-selector` (repeatable, exact suite ids) scopes ad hoc; `--require-earned` enforces Earned provenance on every member (H2/H3) | N |
| `verify rebaseline [--instance-id] [--view <name>]` | `verify_rebaseline` | Audited **reporting-only** rebaseline re-check (records a `vrba-…` audit record with per-member status). Never refreshes stored baselines, never mutates suite state — use for honest "where do we stand" reads | N (writes audit record) |
| `verify run [--instance-id \| --package-ref] [--no-wait]` | `verify_run` | Execute automated suites (instantiate+run if only `--package-ref`); returns `run_id` | Y |
| `verify run plan [--instance-id \| --package-ref] [--suite <exact-id>…]` | — (CLI/RPC `verify.run.plan`) | Read selected command/session inputs, actual routed commands/resources, requested/resolved lane and asset checks; no instance/run, inventory execution or earned-state mutation | N |
| `verify run status <run-id>` | `verify_run_status` | Poll automated run result + named evidence refs | N |

### Checklist (manual verdicts grouped into passes)
| CLI | MCP tool | Purpose | Mutates |
|---|---|---|---|
| `verify checklist list [--instance-id] [--suite-id] [--status]` | `verify_checklist_list` | List items + latest verdict + status rollup | N |
| `verify checklist pass start --suite-id <id>` | `verify_checklist_pass_start` | Open a checklist pass (scopes subsequent verdicts) | Y |
| `verify checklist pass finish --suite-id <id> --pass-id <id>` | `verify_checklist_pass_finish` | Close pass, emit summary | Y |
| `verify checklist verdict set --suite-id --item-id --verdict pass\|fail\|skip [--pass-id] [--evidence-ref <ref>...] [--reasoning]` | `verify_checklist_verdict_set` | Record one verdict (optionally scoped to pass) with concrete evidence refs | Y |
| `verify checklist verdict reset --suite-id --item-id [--reason]` | `verify_checklist_verdict_reset` | Clear verdict (for replay or stale clear) | Y |

### Catalog (discover published packages)
| CLI | MCP tool | Purpose | Mutates |
|---|---|---|---|
| `verify catalog search [--query] [--limit]` | `verify_catalog_search` | FTS over digest-keyed published index | N |
| `verify catalog get <catalog-id>` | `verify_catalog_get` | Fetch one record with trust summary + signature state | N |

### Schedules (recurring / drift-triggered verify)
| CLI | MCP tool | Purpose | Mutates |
|---|---|---|---|
| `verify schedule create <id> --trigger interval\|drift [--interval-minutes] [--package-ref] [--suite-selector …] [--watch-binding …] [--freshness strict\|allow-stale] [--blocker blocking\|advisory]` | `verify_schedule_create` | Explicit verify schedule record | Y |
| `verify schedule list` | `verify_schedule_list` | List workspace schedules | N |
| `verify schedule pause <id>` | `verify_schedule_pause` | Suspend | Y |
| `verify schedule resume <id>` | `verify_schedule_resume` | Reactivate | Y |
| `verify schedule run-now <id>` | `verify_schedule_run_now` | Force immediate execution via the shared executor (same path as tick) | Y |
| `verify schedule tick [<id>]` | — (CLI/RPC only; no MCP tool registered) | **Manual driver (B10-lite/D14 — there is NO daemon timer).** Evaluates due interval schedules (all due when id omitted): executes the EXISTING pinned instance id-unchanged (never re-instantiates); mixed automated+checklist views run the automated subset; a red run mints a daemon-side WorkUnit assigned to the surface owner + owner mail (read via bare `work list` / `work get` and `mail --agent <owner> inbox`) | Y |

### Templates (bootstrap packages)
| CLI | MCP tool | Purpose | Mutates |
|---|---|---|---|
| `verify template list` | `verify_template_list` | Discover bootstrap templates under `test-packages/bootstrap/` | N |
| `verify template create --template-id <id> [--output <rel>]` | `verify_template_create` | Render template into new package + validate + stage | Y |
| `verify template validate <template-ref>` | `verify_template_validate` | Validate template package without staging | N |

## Envelope Conventions

**CLI** wraps every response in a uniform envelope — use `--format json` to see it, `--format human` for terse output, and default `toon` for compact JSON suitable for piping.

```json
{ "v": 1, "ok": true, "data": { … }, "meta": { "trace_id": "trace:agent-swarm:verify.xxx", "actor_id": "ag-xxxx" }, "error": null }
```

Error envelope:
```json
{ "v": 1, "ok": false, "error": { "code": 403, "kind": "Policy", "message": "permission_denied: …" }, "meta": { "trace_id": "…" }, "data": null }
```

**MCP tools** return the raw inner data (no envelope). Errors surface as `internal_error: <message> (code <N>, kind <K>)`.

Common error kinds: `InvalidInput` (400), `Policy` (403), `InvalidInput` with `not_found:` prefix (404), `Permanent` (500 — precondition failures like missing feature flag).

## Canonical Agent Workflows

### 1. Run a verification package end-to-end
```bash
# 1. Validate locally (fast parse/schema check)
agent-swarm verify package validate test-packages/my-feature --format json

# 2. Instantiate — produces a deterministic instance_id
#    For an existing surface inspect the pinned instance and lineage first.
#    Same-identity calls can preserve state; changed baselines can reset it.
#    Adopt acceptance changes through a delta and inspect carryover.
agent-swarm verify instantiate test-packages/my-feature --format json
# → { "instance_id": "verify-instance-1220..." }

# 3. Inspect suites + stale state
agent-swarm verify get verify-instance-1220... --format json

# 4. Inspect the selected plan, then execute (use --no-wait for async)
agent-swarm verify run plan --instance-id verify-instance-1220... --suite backend.fast --format json
agent-swarm verify run --instance-id verify-instance-1220... --suite backend.fast --format json

# 5. Read projection — has the instance gone green?
agent-swarm verify greenlight --instance-id verify-instance-1220... --format json
# → { "green": bool, "required_suite_ids":[…], "red_suite_ids":[…], "stale_suite_ids":[…], "never_run_suite_ids":[…],
#     "earned_suite_count": N, "inherited_suite_count": N, "unresolved_carryover_miss_count": N, … }
# (durable-fabric: green alone is not the gate bar — unit gates need EARNED; see Durable-Fabric Operations)
```

MCP equivalent for steps 3 + 5:
```
verify_get({ "instance_id": "verify-instance-1220..." })
verify_greenlight({ "instance_id": "verify-instance-1220..." })
```

### 2. Manual checklist walk (passes scope verdicts)
```bash
# List items + current verdict state, filter by suite
agent-swarm verify checklist list --instance-id <id> --suite-id preview.checklist --format json

# Open a pass — grouping mechanism; every verdict inside this pass is linked to pass_id
agent-swarm verify checklist pass start --instance-id <id> --suite-id preview.checklist --format json
# → { "pass_id": "pass_…" }

# Record verdicts against the pass
agent-swarm verify checklist verdict set \
  --instance-id <id> --suite-id preview.checklist --item-id <item-id-from-list> \
  --verdict pass --reasoning "Rendered correctly at 1920x1080" \
  --pass-id <pass_id> \
  --evidence-ref evidence/<run-id>/preview-map-1920x1080.png

# Reset a verdict (replay or stale cleanup)
agent-swarm verify checklist verdict reset --instance-id <id> --suite-id preview.checklist --item-id <item-id-from-list> --reason "re-test after fix"

# Close the pass — emits summary and increments projection generation
agent-swarm verify checklist pass finish --instance-id <id> --suite-id preview.checklist --pass-id <pass_id> --summary "All preview items verified"
```

### 2b. Manual operating-scenario proof

For realistic backend/control-plane scenarios, the verifier agent should run the product workflow manually through CLI/RPC/session surfaces, retain evidence, then mark checklist items with evidence refs. This is first-class UVP usage, not a fallback.

Required shape:

1. Run the real product scenario with product commands and sessions.
2. Capture retained evidence under a run id: transcripts, doctor/report output, command stdout/stderr, event logs, negative-case output, and source-grep/no-hardcode proof where relevant.
3. Open a checklist pass for every scenario checklist suite.
4. Set each verdict with `--evidence-ref` pointing at the exact artifact(s) that prove that item.
5. Finish the pass and confirm `verify report` and `verify greenlight`.

Use doctor/report evidence for the scenario's actual acceptance conditions and
observed blockers; retain required diagnostic proof and reuse matching observations.
Touching an infrastructure surface alone does not require a new preflight/final/
negative/gap matrix or a diagnostic implementation before product work can continue.

Do not hide this scenario in production handlers or runtime adapters. Automated `swarm_session` is appropriate only after a reusable fixture-agnostic adapter exists.

### 3. Publish to OCI then pull on another node
```bash
# Publish — package must already validate cleanly
agent-swarm verify package publish test-packages/my-feature --target oci://registry.example.com/verify --format json
# → { "artifact_id", "digest", "reference": "oci://…/my-feature:1.0.0@sha256:…" }

# On the pulling node, digest-pinned pull with signature verification
agent-swarm verify package pull oci://registry.example.com/verify/my-feature@sha256:… --format json
# → { "artifact_id", "digest", "staged_package_ref": "local://staged/…", "signature_verified": true }

# Stage ref flows through instantiate as a normal package_ref
agent-swarm verify instantiate local://staged/my-feature
```

### 4. Discover a package in the catalog
```bash
agent-swarm verify catalog search --query "vxg browser smoke" --limit 5 --format json
# → { "records": [ { catalog_id, digest, package_id, version, target_domains, suite_kinds, execution_modes, tags, trust } ] }

agent-swarm verify catalog get <catalog-id> --format json
# → Full record including trust.signature_verified and policy_digest
```

### 5. Bootstrap a package from a template
```bash
agent-swarm verify template list --format json
# → { "templates": [ { template_id, source_rel, package_id, name, version, suite_ids } ], "templates_root_rel": "test-packages/bootstrap" }

agent-swarm verify template create --template-id simple-verify --output test-packages/my-new-check --format json
# → { "output_rel", "generated_package_ref", "files_written": [...] }

# Always validate the generated output before committing
agent-swarm verify package validate test-packages/my-new-check
```

Inspect the stock template's current suite file and run plan. Its seed is not
product proof. Replace it with a real explicit command or a deliberately broader
routed check; `paths` and `packages` alone do not prove exact test coverage.

### 6. Create and manage a schedule
```bash
# Interval-triggered schedule
agent-swarm verify schedule create hourly-smoke \
  --trigger interval --interval-minutes 60 \
  --package-ref test-packages/my-smoke \
  --suite-selector preview.checklist \
  --suite-selector backend.fast \
  --freshness strict --blocker blocking \
  --format json

# Drift-triggered schedule (fires when bound binding fingerprint changes)
agent-swarm verify schedule create drift-repro \
  --trigger drift --watch-binding vxg.my-graph:head --watch-binding docs:spec-sha \
  --package-ref test-packages/my-repro \
  --format json

# Lifecycle controls
agent-swarm verify schedule list
agent-swarm verify schedule pause hourly-smoke
agent-swarm verify schedule resume hourly-smoke
agent-swarm verify schedule run-now hourly-smoke   # force immediate execution (same shared-executor path as tick)

# ⚠ Schedules are IN-MEMORY (B7 unshipped): a daemon restart drops them all — recreate after
# any restart, and drive interval schedules with `verify schedule tick` (there is no daemon timer).
```

### 7. Poll an async run
```bash
agent-swarm verify run --instance-id <id> --no-wait --format json
# → { "run_id": "run-…", "status": "running" }

agent-swarm verify run status <run-id> --format json
# Poll until status is "completed"/"red"/"green". Named evidence refs include planner.json, preflight.json, nextest output, browser trace, etc.
```

## Durable-Fabric Operations (shipped 2026-07-19 — packages are durable assets now)

The verify substrate carries the durable-verification-fabric machinery, proven by its own
self-hosted pipeline (whole-package 26/26 earned on a post-amend instance). Canonical
architecture: `docs/research/2026-07-14-uvp-durable-verification-hyperstructures-research.md`
§7–§8. What changed operationally:

**Lineage publish (B4).** `verify package publish <ref>` WITHOUT `--target` is a LOCAL
lineage-recording publish, and it is the primary meaning of "publish" now (OCI via `--target`
is the distribution path). When the package's TESTS.md carries `lineage.previous_digest`
(the currently-published digest), publish records a lineage edge (d0→d1…), returns a
`suite_diff` (suite-id LISTS `added` / `changed` / `unchanged` / `removed` / `superseded`, plus
`predecessor_digest` / `predecessor_available` — READ IT:
it is the amendment's price sheet), and the first lineage publish changes `artifact_id`
(legacy no-lineage suite-file content is excluded from the preimage — AMEND-U1-1).

**The delta-amend flow** (the sanctioned way to change a package that holds banked greens):
```bash
# 1. Revise/add affected suites and views, bump the version for the change,
#    set lineage.previous_digest = current published digest
agent-swarm verify package validate test-packages/<surface-pkg>
agent-swarm verify package publish test-packages/<surface-pkg>     # records lineage; read suite_diff
agent-swarm verify instantiate test-packages/<surface-pkg>          # ONE instantiate → the new pinned instance
agent-swarm verify get <new-instance-id> --format json              # READ .carryover: {carried, reset, new}
```
**Read the carryover audit before trusting anything.** Automated-suite carryover
still applies its suite-definition/file/input checks; do not infer retention from
a neighboring green. Checklist migration now compares individual definitions,
captured inputs, target/capabilities and evidence obligations, so a neighboring
checklist edit need not reset every observation. Missing old input snapshots
cannot confer fresh acceptance. Inspect suite carryover, item resets and evidence
disposition. Carried suite green is **inherited** with its source instance; a fresh
run/review earns current proof. Apply `--require-earned` where the current contract
requires it, and enforce configured earned-age floors for retained regression.

**Checklist identity.** Structured frontmatter supports title, description,
severity, tags, capabilities and automation hints, but no authored `item_id`.
Both parser modes expose generated `chk-*` IDs. With `lineage.previous_digest`,
IDs derive from suite ID, trimmed title/description and a duplicate-content
tiebreak; otherwise from suite ID and ordinal. Read checklist list rather than
constructing IDs. Changes to metadata or obligations can reset a judgment even
if its text-derived ID remains the same.

Use a pass for grouped review, or omit `--pass-id` for an individual judgment.
With a nonempty `evidence_contract.required_artifacts`, passing judgments require
reviewer, reasoning and resolvable retained bytes. Hints map declared artifact
names to item obligations; the service verifies their path/CAS bindings and
retains payloads. Arbitrary substring citations do not satisfy this check.
Empty-contract legacy packages do not gain evidence-byte validation automatically;
author a real evidence contract for required manual acceptance.

**Evidence manifests (B11-core).** At green time the run records an `evidence_manifest`
(entries `{artifact_name, sha256, cas_ref: cas://verify/sha256/…}`). Proof is
CAS-durable — it survives deletion of the backing build worktree (D20), and a raw
`.tmp/*-build-*` path is NEVER acceptable as proof. Per-suite `evidence_disposition` in
`verify get`/`report` reads `"evidence: manifest-verified (local)"` for locally earned members
and `"evidence: manifest-verified (non-local)"` for inherited ones (grep for the full string —
it carries the `evidence: ` prefix).

**The claim ceiling.** Freshness hashes contract inputs plus the declared
`path_globs` set and router bytes (`routing_surface`). It does not hash all product
files matching those globs. Product edits still need affected proof even when
stored state appears fresh. A declared fresh projection is not a blanket claim
that the implementation is unchanged.

## Lifecycle State Machine

```
VerificationPackageSpec (authored, mutable)
    │ validate
    ▼
CompiledVerificationArtifact (immutable; hashed)
    │ instantiate (+ binding fingerprint)
    ▼
VerificationInstance ──► stale (if binding fingerprint / suite file drifts)
    │                    │
    │ run / checklist   │ fresh green run clears (B2) · rebaseline = audited read
    ▼                   ▼   (do not use re-instantiation as a stale-clear shortcut)
VerificationEvidenceBundle  (CAS append-only)
    │
    │ report / greenlight (projection)
    ▼
ReportProjection + GreenlightProjection
```

OCI distribution path:
```
publish  → sign + OCI manifest (digest-pinned)
  ← pull ← verify digest + signature + trust policy
    → stage → instantiate  (same path as local)
```

Schedule path:
```
verify.schedule.create
    │ trigger fires (interval or drift)
    ▼
obligation materialization (deterministic from plan_run_id + attachment_id + scope)
    │
    ▼
verify.run + report/greenlight refresh
```

## Gotchas

- **Package refs are workspace-relative.** Absolute package refs fail with `permission_denied: package refs must be workspace-relative (relative to workspace root)`. Use `test-packages/my-feature`, not `/Users/.../test-packages/my-feature`.
- **`verify.run` without args errors.** Must pass `--instance-id`/`instance_id` **or** `--package-ref`/`package_ref`. `--package-ref` instantiates + runs in one call; `--instance-id` only runs on the existing instance.
- **Instance identity is deterministic.** Identical compiled inputs and binding return the same ID. The current same-instance path can preserve unchanged state; changed baselines may reset automated state, and checklists undergo item/input migration. Identity equality alone does not prove a no-op or a wipe.
- **Read live freshness before using cached proof.** Input kinds include
  `package_content`, `source_of_truth_doc`, `suite_file`, `target_fingerprint`,
  `normalized_capabilities`, `skeleton_layer_version`, `plan_binding`,
  `work_binding` and `routing_surface`. `view_freshness_floor` comes only from
  the view-scoped earned-age evaluator. Fresh green execution records current
  per-suite snapshots; `verify rebaseline` is reporting-only and cannot clear
  acceptance by refreshing stored baselines. Checklist review follows its
  item/input/evidence rules rather than an automatic whole-file reset.
- **`verify.checklist.list` errors if the instance has no checklist suites.** The bootstrap `simple-verify` template only contains `backend.fast` (automated), so checklist calls against it fail with `no checklist suites are available for this verification instance`. Confirm suites via `verify.get` before probing checklist.
- **Checklist verdicts can be scoped to a pass or bare.** Bare verdicts are valid but skip pass-level rollup. Prefer `pass.start → verdict.set (with pass_id) → pass.finish` for clean audit trails.
- **OCI pull fails closed.** Digest mismatch, signature mismatch, or trust policy rejection all return `failed_precondition`. There is no soft-fail path.
- **Catalog is read-only derived index.** You cannot mutate catalog state; publish writes through `verify.package.publish`, which in turn updates the catalog index.
- **Schedules are explicit records, not hidden automation.** Use `verify.schedule.*` — do not wire cron or skeleton trigger actions to mint obligations. **And schedules are IN-MEMORY until B7 lands: a daemon restart silently drops every schedule** (measured 6→0 twice). After any restart, recreate required schedules; there is no daemon timer — `verify schedule tick` is the only driver.
- **Resolve the actual workspace and transport.** RPC package refs use the
  service's workspace root; supported local package fallback uses the CLI's
  workspace. Inspect `run plan`'s `workspace_root` and `package_root`. Pass raw
  CLI `--gateway` explicitly when selecting a daemon; it does not consume
  `SWARM_GATEWAY`. Preserve the intended runtime/auth roots through supported
  `SWARM_CLI_DATA_DIR` and `SWARM_CLI_AUTH_DATA_DIR` when isolating CLI state.
  Planning an unavailable local package gateway may fall back; 403 must not.
- **`projection_generation` increments on every mutating call** (verdict set/reset, run finish, checklist pass close). If you cached a report, check generation parity before trusting it.
- **`swarm_session` is not synonymous with VXG or mandatory for every live
  scenario.** The runner includes VXG preview and `web-app-browser` support.
  Backend/control-plane proof can use real command suites plus manual review.
  VM/agent automation needs an actually implemented adapter/profile/bundle;
  declaring its name is insufficient. Never substitute VXG bindings to conceal
  a missing backend adapter.
- **Manual scenario checklists are not narrative-only approval.** Every pass/fail verdict must cite concrete retained evidence via `--evidence-ref` or, on older binaries, a machine-readable evidence index referenced in the verdict reasoning.
- **Do not special-case UVP packages in production code.** A handler, daemon method, service, runtime adapter, or CLI command must not know a test package id, fixture path, fixed agent name, flow id, or evidence filename just to make a verification suite pass.
- **A greenlight is not a review.** Before accepting a package as complete, inspect `verify get`, confirm required suites have no stale/red/never-run/unchecked state, inspect manual checklist verdict evidence refs, and retain the final `verify report` plus `verify greenlight` output.
- **Do not re-instantiate as a stale-clear operation.** Read the existing instance,
  adopt actual contract changes through lineage, and inspect the resulting
  carryover/item reset audit. Fresh proof earns current inputs; `verify rebaseline`
  only reports. Historical whole-state wipes are not a truthful description of
  every current same-instance call, nor a reason to ignore its remaining reset conditions.
- **Synthetic or unit-test-only product paths do not satisfy operating-scenario proof.** Command suites may use unit tests for deterministic invariants, but scenario evidence must go through reusable product surfaces, doctor/report paths, real sessions/daemons, and real runtime data. A production handler that calls fixture-specific or unit-test-only logic is a product gap even if the UVP appears green.
- **MCP returns raw payloads; CLI wraps in envelope.** When piping CLI output into scripts, parse the `data` field. When using MCP tools, you get the inner shape directly.
- **Instance IDs start `verify-instance-1220…`**, artifacts `verify-artifact-1220…`, reports `verify-report-1220…`, evidence bundles `verify-evidence-1220…`. The `1220` prefix is the multihash tag for SHA-256.

## Relationship to Adjacent Surfaces

- **VXG testing** (`vxg-testing` skill): VXG is the first adapter consuming shared verify core. VXG-local preview/browser-runtime semantics remain there; **checklist/verdict/evidence/report/greenlight/catalog/schedule/template live under `verify`** now. Prefer `verify_*` over `vxg_test_*` during/after the migration. The `vxg test` CLI remains as a compatibility wrapper but must not grow unique semantics.
- **Plan attachments** (`swarm-civilization-plans` / plan surfaces): Plans reference verify packages via `verification_packages[]` blocks with `attachment_id`, `package_ref`, `phases`, `work_selectors`, `suite_selectors`, `gate_policy`, `freshness_policy`. When a plan runs, `PlanRunService` materializes `VerificationObligationRecord` deterministically from `plan_run_id + attachment_id + scope`.
- **Work gates** (`swarm-cli-beads`, work-type `Gate`): Verify obligations land on work items via `VerificationGatePayload` ext (schema version 1) — `{ schema_version, package_ref, attachment_id, obligation_id, normalized_caps, plan_id, phase, work_id }`. Gate evaluation reads live projection.
- **Shared VCS** (`vcs-ops` skill): Verify evidence bundles are CAS-backed and may be referenced by commit messages/refs, but verify does not own version history for code. Use `vcs-ops` for branch/tag/checkpoint operations; verify owns *acceptance*, not *versioning*.
- **Backend routing:** implicit command suites call the repository router with
  the requested lane. Explicit `commands` can instead select exact Cargo targets
  and nextest expressions through the shared executor. Put `--profile` and `-p`
  in those commands: `lane`/`packages` do not inject them. Inspect `run plan` and
  retain measured inventory/count evidence; do not edit a shared default filter
  merely to narrow one suite.

## Quick Reference — Example Invocations

### CLI (most common)
```bash
# One-liner: instantiate + run + read greenlight
agent-swarm verify run --package-ref test-packages/my-feature --format json
agent-swarm verify greenlight --instance-id <id> --format json

# Human-readable quick check (good for shell scripts)
agent-swarm verify package validate test-packages/my-feature --format human
# → ok
```

### MCP (payload shapes)
```json
// verify_instantiate
{ "package_ref": "test-packages/my-feature" }
→ { "instance_id": "verify-instance-1220…" }

// verify_checklist_verdict_set
{
  "instance_id": "verify-instance-1220…",
  "suite_id": "preview.checklist",
  "item_id": "<generated-item-id-from-checklist-list>",
  "verdict": "pass",
  "reasoning": "Rendered correctly at 1920x1080",
  "pass_id": "pass_abc",
  "evidence_refs": ["evidence/run-123/preview-map-1920x1080.png"]
}
→ { "verdict": { … }, "status_summary": { … } }

// verify_schedule_create
{
  "schedule_id": "hourly-smoke",
  "package_ref": "test-packages/my-smoke",
  "suite_selectors": ["preview.checklist", "backend.fast"],
  "trigger_mode": "interval",
  "interval_minutes": 60,
  "freshness_policy": "strict",
  "blocker_policy": "blocking"
}
→ { "schedule_id", "workspace_id", "owner_scope", …, "status": "active", "next_due_at_ms": … }

// verify_package_pull
{ "package_ref": "oci://registry.example.com/verify/my-feature@sha256:…" }
→ { "artifact_id", "digest", "staged_package_ref", "signature_verified": true }
```

## Authoring Tips (TESTS.md)

> For comprehensive authoring guidance — full schema, suite-kind decision trees, VXG/canvas patterns, backend nextest-lane routing, capability declaration, template bootstrapping, validation loop, and annotated examples — use the **`verify-authoring`** skill. That skill is the write-path complement to this one (which is the run-path).


- Author under `test-packages/<slug>/TESTS.md`. Keep refs relative (`./suites/checklist.md`) — absolute paths or `../` escapes out of the package root are rejected by `verify.package.validate`.
- Suite IDs are namespaced dotted identifiers (`preview.checklist`, `backend.fast`, `browser.smoke`). Reuse names across packages — suite IDs are scoped by package.
- Capabilities declared in TESTS.md are **normalized** at compile time via `normalize_capability_alias` (`crates/swarm-services/src/verify/capabilities.rs`). Aliases collapse to canonical dotted names — e.g., `click` → `interaction.click`, `screenshot` → `capture.screenshot`, `backend` → `backend.assertions`, `real_session` → `auth.real_session`. The 13 known canonical capabilities live in `KNOWN_VERIFICATION_CAPABILITIES`. Gate payloads and obligation routing use the normalized form — never ship raw aliases or adapter-specific strings.
- Evidence refs emitted by runs use the pattern `cas://verify/<instance>/<suite>/<attempt>/<kind>` (e.g., `cas://verify/verify-instance-.../backend.fast/2/planner-json`).
- For automated suites, use explicit commands for narrow target/test selection,
  or the repository router for the intended broader gate. `scope_plan` validates
  declared relationships; its `test_count` and `bound_tests` still need an actual
  inventory/assertion consumer. See verify-authoring/BACKEND.md.

## Diagnostics

| Symptom | Likely cause | Fix |
|---|---|---|
| `permission_denied: package refs must be workspace-relative (relative to workspace root)` | Absolute path in `package_ref` | Use a path relative to repo root (`test-packages/foo`). |
| `invalid_params: no checklist suites are available for this verification instance` | The package has no checklist suites | Confirm via `verify.get`; only call checklist.* on instances whose `suites[].proof_kind == "checklist"`. |
| `not_found: <id>` on `verify.get` | Instance was never created in this workspace, or `instance_id` typo | Call `verify.list` to confirm IDs. |
| `failed_precondition` on `verify.package.pull` | OCI digest/signature/trust mismatch | Pull from a digest-pinned ref; verify trust policy accepts the publisher. |
| Instance `green: false` but all suites appear to pass | Stale inputs or another unmet obligation | Inspect reasons and run/review affected proof; `rebaseline` is reporting-only, and re-instantiation is not a stale-clear shortcut. |
| Bootstrap run is red or broad | Template command/routing is not the product's proof | Inspect `run plan`; author a real explicit test command or deliberate broad gate, with measured match checks. |
| CLI exits 0 but a suite is red | The run request completed successfully; acceptance failed | Check `data.status`, per-suite results and greenlight `data.green`; do not use process exit alone as the gate. |
| Retained evidence says green but live CLI cannot find the instance | Reviewing an old evidence bundle without the original daemon/data dir | State that you reviewed retained evidence only, or restart against the same data dir and re-query `verify get`/`verify report`/`verify greenlight`. |

## What NOT to do

- Do not mint obligation IDs manually. `obligation_id` is deterministic from `plan_run_id + attachment_id + scope` — it's computed at plan activation, not at verify time.
- Do not hand-edit published catalog entries. The catalog is read-only; re-publish instead.
- Do not bypass `verify.package.pull` with a local copy of a published package — signature + trust verification only happens on pull.
- Do not call `verify.checklist.verdict.set` without first confirming the suite is a checklist suite (`verify.get` → `suites[].proof_kind`).
- Do not assume `verify.run` is synchronous by default with large suites — prefer `--no-wait` + `verify.run.status` for runs exceeding a few seconds, to avoid tying up the CLI/MCP call.
