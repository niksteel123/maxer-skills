---
name: verify-authoring
description: Author or amend Unified Verification Packages (UVP) — TESTS.md and suite files — for backend, VXG/canvas, and mixed-mode proof. Covers current package and structured-checklist schemas, scopes and territory_layers, explicit narrow command matrices, routed nextest plans, declared versus measured test scope, retained evidence, lineage and item-specific carryover. Use for writing or repairing a verification package, test manifest, checklist, command/swarm_session suite, source-of-truth binding, or plan attachment.
---

# Verify Authoring — TESTS.md Write Playbook

> ULTRATHINK before you write. A verification package is a proof contract — every suite must be grounded in a source-of-truth doc, bound to a real subject, and declare capabilities it actually needs. Shortcuts here compound into red runs, stale instances, and foot-gunned plan attachments downstream.

Use this skill to author or amend `TESTS.md` and its suite files. It complements
verify-ops, which covers executing and inspecting the resulting proof. Keep
existing surface packages and earned observations when their obligations remain valid.

## When to use this skill

- Writing a new `TESTS.md` for a feature (VXG, backend, mixed, etc.)
- Extending an existing package with a new suite (**the durable-fabric DEFAULT — do it as a
  lineage delta amendment with inspected carryover**; see "Durable-fabric
  frontmatter" below)
- Bootstrapping a package from the `simple-verify` template
- Fixing `verify package validate` failures on a TESTS.md you authored
- Mapping a spec section to a proof obligation (source-of-truth anchoring)
- Choosing between `Checklist+Manual`, `Automated+Command`, and `Automated+SwarmSession`
- Expressing VXG targets (scope `vxg/<id>`), canvas preview sessions, or design-ref comparisons
- Declaring nextest lane routing for backend suites
- Writing checklist item manifests (severity, capabilities, tags)
- Planning a `verification_packages[]` attachment block in a plan package

## When NOT to use this skill

- **Running / instantiating / scheduling already-authored packages** → `verify-ops`
- VXG preview / browser-runtime / agent_url resolution internals → `vxg-project-ops`
- SwarmCanvas `.pen` creation/editing, Paper/Pencil A/B authoring parity, or Design Registry mutations → `swarm-design-ops` and prefer Agent Swarm MCP tools
- Plan package supersession / activation semantics → `swarm-civilization-plans`
- Per-scope version control for authored packages (branching/tagging package versions) → `vcs-ops`

## 60-second mental model

UVP has five lifecycle records. Authoring is step 1 — everything downstream derives from it.

```
[1] VerificationPackageSpec          <-- YOU WRITE THIS (TESTS.md + suite files)
       | validate + compile
       v
[2] CompiledVerificationArtifact     (deterministic hash; immutable)
       | instantiate(binding fingerprint, owner context)
       v
[3] VerificationInstance             (mutable runtime state)
       | run / verdict / pass
       v
[4] VerificationEvidenceBundle       (CAS-backed, append-only)
       | report / greenlight
       v
[5] ReportProjection + GreenlightProjection
```

Author-provided IDs: `package_id`, `suites[].id`, `attachment_id` (for plan attachments). Everything else — `artifact_id`, `instance_id`, `evidence_bundle_id`, `report_id`, `obligation_id` — is **deterministic from content hashes**. You can't override them, and they're stable across identical inputs.

## TESTS.md at a glance

A verification package is a **directory**:

```
test-packages/<slug>/
  TESTS.md                  # YAML frontmatter + informational Markdown body
  docs/
    spec.md                 # source-of-truth (required)
    architecture.md         # (optional)
    tdd.md                  # (optional)
  suites/
    <suite-id>.yaml         # or .md — one per suite, referenced from frontmatter
```

`TESTS.md` is **YAML frontmatter + Markdown body**. The frontmatter IS the whole machine-readable spec. The body is for humans only — the compiler never parses it.

Minimal valid frontmatter:

```yaml
---
package_id: verify.my-feature
name: My Feature Proof
kind: verification                # MUST be the literal string "verification"
package_version: "1.0.0"          # MUST be valid semver
layer_id: l2.5
description: One-line summary of what this package proves.
tags: [my-feature, ui]

source_of_truth:
  spec: docs/spec.md              # required, relative to package root
  architecture: docs/architecture.md   # optional
  tdd: docs/tdd.md                     # optional

bindings:
  scopes: [project/swarmnet]      # required, nonempty concrete subject binding
  # optional: territory_layers, work_unit_queries, path_globs

suites:
  - id: backend.fast
    proof_kind: automated
    execution_mode: command
    file: suites/backend-fast.yaml
---

# My Feature Proof

(Human-facing commentary. Ignored by the compiler.)
```

Every field of `VerificationPackageSpec`, every validation rule, every subtype is in **CORE.md**. Read it once; use it as reference during authoring.

## Fast proof and real product feedback

Each required suite/item must protect a current product promise or a material risk
at its intended use boundary. Separate representative positive proof, necessary
failure checks and optional future hardening. Prefer one sufficient check of a
mechanism over a combinatorial recovery/edge matrix. Before adding another case,
name what decision it changes. Do not add new suites merely to satisfy scenario
section counts; reconcile overgrown existing obligations with the contract owner.

Design the earliest runnable slice to demonstrate representative product
behavior. Declare exact narrow command/suite scopes for local repair, a broader
pre-close check, and the actual milestone gate. Keep capture/render/build
production separate from interpretation so retained artifacts can be judged
again without repeating expensive work when their relevant inputs still match.
Inspect the real execution plan and matched-test counts; a narrow selector alone
does not prove less compilation or faster execution.

Distinguish measurement from acceptance. Emitting a timing, video or image is
not meeting its quality criterion. Automate deterministic thresholds; use an
agent checklist for visual/video judgment unless the criterion needs a human
or physical interaction. Record reviewer identity, reasoning and a valid retained
evidence reference through the supported pass/verdict mechanism.

On steering, classify affected suites and items as retained, revised, superseded
or new. Preserve judgments only when item identity, relevant inputs and evidence
obligations still match; invalidate changed acceptance honestly. Reconcile the
contract, beads and prompts before affected execution resumes.

## Durable-fabric frontmatter (shipped 2026-07-19 — live-proven on `test-packages/verify-self` v1.1.0)

Packages are durable, surface-keyed assets now (canonical architecture: research doc
`2026-07-14-uvp-durable-verification-hyperstructures-research.md` §7). **The default for a
feature touching a surface that already has a package is a DELTA AMENDMENT of that package,
not a new package** — the surface decision comes from the pipeline's stage-0 resolution
(contractmaxxer W1). The fabric fields, all accepted by the shipped compiler:

```yaml
family:                                             # PACKAGE-level list of surface/family tags
  - <surface-family>                                # (metadata-only: excluded from the semantic
  - <package-tag>                                   #  preimage; live example: verify-self)
lineage:
  previous_digest: "<currently-published digest>"   # makes the next publish record a lineage
                                                    # edge; ALSO activates content-addressed
                                                    # checklist item ids (B8). First lineage
                                                    # publish changes artifact_id.
owner: <accountable party>                          # red schedule runs route WorkUnits + mail here

views:                                              # named suite selectors (B3 scoped greenlight)
  "unit:<root-epic>-u<N>":                          # the amending unit's delta view — its gate
    suites: [<the delta's suite ids>]               #   proves DELTA all-red at birth (H1) and
  regression:                                       #   closes on EARNED green only (H3)
    suites: [<the durable regression set>]
    max_age_since_earned_ms: 1209600000             # per-view earned-age floor (H3) — the ONLY
                                                    # view field besides `suites` the schema
                                                    # accepts (deny_unknown_fields; a configured
                                                    # floor fails CLOSED when a member has no
                                                    # earned timestamp)
# `full` is auto-derived (all non-retired suites) — authoring a view named `full` REJECTS

suites:
  - id: <surface>.u<N>.<name>                       # unit-namespaced ids — the birth unit rides
    …                                               # in the id itself
```

⛔ **Per-suite `family:` is NOT a schema field.** The §7.3 suite-family taxonomy
(`construction|regression|soak|journey|operational`, triage defaults riding the family) is
research DESIGN — `VerificationSuiteSpec` is `deny_unknown_fields` and carries no `family`;
authoring one fails validate. What ships: unit-namespaced suite IDS carry the birth unit, and
`family:` exists only at PACKAGE level as the tag list above (confirmed against live
`test-packages/verify-self` v1.1.0, whose suites carry no family field).

Delta-amend authoring sequence: revise/add affected suites and views → bump the version for the change → set
`lineage.previous_digest` → validate → publish (read the returned `suite_diff` — it is the
amendment's price sheet) → ONE instantiate → read the carryover audit `{carried, reset, new}`.
Run-path details + the carryover/D22 reconciliation rules: `verify-ops` § Durable-Fabric
Operations. Suite lifecycle flags (B5) let triage retire/soft-demote without deleting: the
authored per-suite `lifecycle:` values are `active` (default), `advisory`, and
`retired: { reason: <why>, since: "<version>" }`. B9 supersession is NOT an authored field —
`superseded_by` is a catalog-projection field recomputed from the lineage index when a later
publish supersedes a digest. A red caused by INTENTIONAL behavior change routes through
owner-adjudicated SUPERSEDE (D9), never through quiet retirement.

> **Checklist authoring — two modes.** A checklist suite file chooses its mode automatically: if it starts with a YAML frontmatter block (`---` / `items:` / `---`), the parser reads **structured mode** with per-item `title` / `description` / `severity` / `tags` / `required_capabilities` / `automation_hint`. Otherwise the parser falls back to **legacy mode** (Markdown bullets `- **title**: description`) which inherits defaults for everything but title + description. See CORE.md §9b.1 for the exact schema, deny_unknown_fields rules, and validation errors. Use structured mode when you need per-item differentiation; use legacy when you don't.
>
> **Item identity and carryover:** structured and legacy parser modes both return
> generated opaque `chk-*` IDs, never authored `item_id` fields. With
> `lineage.previous_digest`, IDs hash suite ID, trimmed title/description and a
> duplicate-content tiebreak; otherwise they derive from suite ID and ordinal.
> List the real IDs before verdict writes. Current item-aware migration can
> preserve unaffected judgments across a neighboring checklist-file edit when
> captured inputs, target/capabilities and evidence obligations match. Changed
> items reset; missing old input snapshots cannot confer fresh acceptance.
> Required passing judgments resolve actual retained bytes and artifact bindings;
> an arbitrary substring citation is insufficient. See CORE.md §9b.1 and verify-ops.

## Suite-kind decision tree

Only **three valid `(proof_kind, execution_mode)` pairs** exist. Everything else is rejected at `verify.package.validate` time with `unsupported proof_kind/execution_mode pair`.

```
┌──────────────────────────────────────────────────────────────────────┐
│ Is the proof evaluated by a human (or AI acting as human reviewer)?  │
└──────────────────────────────────────────────────────────────────────┘
   │ yes                                        │ no (automated)
   ▼                                            ▼
┌───────────────────────────┐        ┌─────────────────────────────────┐
│ proof_kind: Checklist     │        │ Does the proof run inside a     │
│ execution_mode: Manual    │        │ session runtime (browser,       │
│                           │        │ MCP, interactive)?              │
│ Use for:                  │        └─────────────────────────────────┘
│ - Visual / UX items       │           │ yes                  │ no
│ - "Looks right" proofs    │           ▼                      ▼
│ - Human-graded criteria   │    ┌──────────────────┐  ┌─────────────────────┐
│ - Accessibility review    │    │ proof_kind:      │  │ proof_kind:         │
│ - Preview shell/slot      │    │   Automated      │  │   Automated         │
│   correctness             │    │ execution_mode:  │  │ execution_mode:     │
└───────────────────────────┘    │   SwarmSession   │  │   Command           │
                                  │                  │  │                     │
                                  │ Use for:         │  │ Use for:            │
                                  │ - VXG/canvas     │  │ - Rust unit tests   │
                                  │   browser proof  │  │ - Integration tests │
                                  │ - Interaction    │  │ - Snapshot tests    │
                                  │   flows in a     │  │ - CLI tests         │
                                  │   product runtime│  │                     │
                                  │ - Screenshot /   │  │ - Performance       │
                                  │   DOM proof      │  │   benchmarks        │
                                  │ - VM/agent       │  │ - nextest lanes     │
                                  │   session proof  │  │                     │
                                  └──────────────────┘  └─────────────────────┘
```

There is **no `browser` execution mode**. Browser/preview proof goes through `SwarmSession` with a browser-capable tool bundle. If you're tempted to write `execution_mode: browser`, use `swarm_session` instead.

## Manual scenario checklist is first-class

Use `Checklist + Manual` as the default for realistic operating scenarios that require a verifier or agent to orchestrate product commands, inspect retained artifacts, correlate session transcripts with doctor/report output, evaluate negative cases, or decide whether the run used real production paths. The checklist verdict is the acceptance record; attach concrete artifact paths or `--evidence-ref` values to every verdict.

Use `Automated + SwarmSession` only when the scenario can run through a reusable, generic product session adapter. The adapter must derive target project/workspace/session context from package bindings, instance metadata, plan/work scope, or operator inputs. It must not know a package id, fixture path, fixed agent name, evidence filename, flow id, or scenario-specific file path.

Backend/control-plane packages usually combine:

- `Automated + Command` suites for deterministic invariants and schema/output checks.
- `Checklist + Manual` suites for the full live operating scenario and no-shortcut review.
- Optional `Automated + SwarmSession` suites only after a generic adapter exists.

For infrastructure and control-plane packages, use doctor/report output where it
proves a named acceptance condition or diagnoses an observed blocker. Reuse matching
preflight/final observations. Do not require a new diagnostic or negative-case
matrix for every touched surface merely because it is infrastructure. Keep any
diagnostic proof the actual product contract requires, with retained evidence refs.

Never make a UVP pass by adding fixture-aware logic to production handlers, daemon methods, runtime adapters, services, or CLI commands. UVP verifies product behavior; it is not a place to smuggle test orchestration into production code.

**Do not default backend or infrastructure packages to VXG.** UVP is domain-neutral; VXG is only one adapter. For backend/control-plane work, start with `Automated + Command` suites under `project/<id>`, `workspace/<id>`, or `zone/<id>` scopes and put the full live scenario in `Checklist + Manual` unless a generic session adapter exists. Use `Automated + SwarmSession` for backend work only when the proof truly must run inside a real product session, VM, sandbox, or agent runtime through a reusable non-VXG adapter/profile/bundle such as `adapter_kind: vm-agent-event-plane`. Do not use `vxg-preview-default`, `vxg_preview@1`, `preview_target`, `page:*`, or `vxg/<id>` unless the subject is actually a VXG/canvas UI target.

Current implementation includes VXG preview and a `web-app-browser` adapter with
`web-app-browser-default`. Declaring an arbitrary VM/agent adapter name does not
implement it. Resolve the actual adapter/profile for the product target; missing
capability remains a blocker. Do not make a backend package green by relabeling it
as VXG or adding package-specific production behavior.

For the full authoring patterns of each:
- Checklist and automated SwarmSession patterns for VXG/canvas → **VXG-CANVAS.md**
- Automated + Command for backend → **BACKEND.md**

## Bindings at a glance

Supply a nonempty `scopes` list. The parser checks it separately after the
general binding-category check; other categories cannot replace it.

| Field | Required | Class | Purpose |
|---|---|---|---|
| `bindings.scopes` | **yes (≥1)** | subject/contract | What this package covers (`project/<id>`, `vxg/<id>`, `workspace/<id>`, `zone/<id>`, `design/<id>`) |
| `bindings.territory_layers` | no | drift input | Layer versions consumed through the available projection; stale kind remains `skeleton_layer_version` |
| `bindings.work_unit_queries` | no | contract/context | Work-unit label filters for suite applicability |
| `bindings.path_globs` | no | declared scope | The declared glob set and router bytes are hashed as a routing surface; matching source-file contents are not. Run affected proof on product edits even if stored state remains fresh. |

Binding classes (conceptual, not literal enum):

- **Subject** — what's being proven (the target). Lives in `scopes`. Drives target-fingerprint staleness.
- **Contract** — the proof contract (source-of-truth docs, suite selectors, gate/freshness policy). Lives in `source_of_truth` + plan attachment. Drives content/suite/doc staleness.
- **Drift inputs** — layer versions and routing surface. Whether stale proof blocks
  is a gate policy decision; an optional field is not automatically advisory.

Full rules: **CORE.md § Bindings**.

## Capability quick table (13 canonical)

`required_capabilities` and `optional_capabilities` on each suite. Aliases auto-normalize at compile time via `normalize_capability_alias` (`crates/swarm-services/src/verify/capabilities.rs`). Unknown capabilities pass through but are flagged in strict mode.

| Category | Canonical | Common aliases |
|---|---|---|
| Interaction | `interaction.click` | `click` |
| Interaction | `interaction.type` | `type` |
| Interaction | `interaction.scroll` | `scroll` |
| Capture | `capture.screenshot` | `screenshot` |
| Capture | `capture.dom` | `dom` |
| Capture | `capture.full_document` | `full_document` |
| Capture | `capture.a11y` | `a11y` |
| Capture | `capture.layout` | `layout` |
| Trace | `trace.semantic` | `semantic_trace` |
| Trace | `trace.dom` | `dom_trace` |
| Assertion | `backend.assertions` | `backend` |
| Session | `auth.real_session` | `real_session` |
| Persistence | `persistence.assertions` | `persistence` |

Rule of thumb: declare the minimum capability set your suite truly needs. Over-declaring makes instantiation fragile (needs more things available at runtime); under-declaring makes evidence incomplete.

Full normalization rules and strictness semantics: **CORE.md § Capabilities**.

## The authoring loop (canonical flow)

```bash
# 1. Bootstrap from template
agent-swarm verify template create --template-id simple-verify --output test-packages/my-feature

# 2. Edit TESTS.md + docs/spec.md + suites/*.yaml
#    (see EXAMPLES.md for canonical patterns)

# 3. Validate locally — fast parse/schema check, no execution
agent-swarm verify package validate test-packages/my-feature --format json

# 4. Fix errors iteratively — read errors[], amend TESTS.md, re-validate
#    In CLI JSON inspect data.ok and data.errors as well as outer ok/exit status.
#    Common errors: missing kind, invalid semver, non-existent file refs,
#    unsupported proof_kind/execution_mode pair, empty bindings.scopes

# 5. Instantiate — compiles, resolves adapters, preflights, returns instance_id
#    For an existing surface, inspect its pinned state and lineage first.
#    Same identity does not imply a reset, but changed baselines can reset state;
#    use the lineage delta flow for contract evolution and inspect carryover.
agent-swarm verify instantiate test-packages/my-feature --format json
# → { "instance_id": "verify-instance-1220..." }

# 6. Inspect the instance — suites, capabilities, stale reasons
agent-swarm verify get <instance-id> --format json

# 7. Plan and run the selected automated proof (commands + swarm_session)
agent-swarm verify run plan --instance-id <id> --suite <suite> --format json
agent-swarm verify run --instance-id <id> --suite <suite> --format json

# 8. For checklist suites: open a pass, set verdicts, finish pass
agent-swarm verify checklist pass start --suite-id <suite> --instance-id <id>
agent-swarm verify checklist list --suite-id <suite> --instance-id <id> --format json
agent-swarm verify checklist verdict set --instance-id <id> --suite-id <suite> --item-id <item-id-from-list> --verdict pass --pass-id <pass> --reasoning "Actual observation against the criterion" --evidence-ref evidence/<run-id>/<artifact>
agent-swarm verify checklist pass finish --suite-id <suite> --pass-id <pass> --summary "..."

# 9. Read greenlight to see pass/fail rollup
agent-swarm verify greenlight --instance-id <id> --format json

# 10. Publish. A plain publish (no --target) is the LOCAL lineage-recording publish —
#     do it at package birth to establish d0, so a later delta amendment can set
#     lineage.previous_digest and chain d0→d1. OCI --target is the distribution path.
agent-swarm verify package publish test-packages/my-feature
agent-swarm verify package publish test-packages/my-feature --target oci://registry.example.com/verify
```

Resolve authoring errors through validation and read-only planning before
instantiation. For an existing instance, rerun/review affected obligations and
inspect lineage/carryover; do not repeat instantiation as a stale-clear loop.

## Top 10 authoring gotchas (summary — full list in CORE.md)

1. **`kind` must be the literal string `"verification"`**. Not `verify`, not `pkg`, not empty.
2. **`package_version` must be valid semver.** `1.0.0` works; `v1`, `1`, `1.0`, `latest` all reject.
3. **Know the two path scopes.** `package_ref` values are workspace-relative (`test-packages/<slug>`), but paths inside `TESTS.md` like `source_of_truth.*` and `suites[].file` are package-root-relative. Absolute paths (`/Users/...`), parent escapes (`../`), or leading `/` still reject.
4. **Only three valid suite-kind pairs.** `(Checklist, Manual)`, `(Automated, Command)`, `(Automated, SwarmSession)`. No `browser` mode. No `(Checklist, Command)`.
5. **`bindings.scopes` must be nonempty.** Other binding categories do not replace it; do not author the obsolete `skeleton_layers` field.
6. **Suite IDs must be unique within the package.** Dotted namespacing convention — `backend.fast`, `preview.checklist`, `browser.smoke`.
7. **`checklist_refs` must reference existing suite IDs** in the same package. Forward refs allowed; unknown suites reject.
8. **Author real referenced files.** Lineage packages reject missing files; legacy diagnostics can be weaker. Successful package validation alone does not prove a runnable suite.
9. **Unknown capabilities pass through non-strict.** If you misspell `click` as `clik`, it normalizes to `clik` and silently becomes a non-functional requirement at runtime.
10. **The body of `TESTS.md` is ignored by the compiler.** Everything machine-readable goes in the YAML frontmatter.

## Mixed-mode packages are first-class

A single feature often needs all three suite kinds in one package. That's normal and correct:

```yaml
suites:
  - id: backend.fast
    proof_kind: automated
    execution_mode: command
    file: suites/backend-fast.yaml
    required_capabilities: [backend.assertions]

  - id: preview.checklist
    proof_kind: checklist
    execution_mode: manual
    file: suites/preview-checklist.md
    required_capabilities: [capture.screenshot, capture.layout]
    checklist_refs: [backend.fast]   # reference only; explicitly orchestrate needed producer proof

  - id: browser.smoke
    proof_kind: automated
    execution_mode: swarm_session
    file: suites/browser-smoke.yaml
    required_capabilities: [interaction.click, capture.screenshot, capture.dom]
```

See **EXAMPLES.md § Mixed-Mode Package** for a full annotated TESTS.md.

## Pointers — deep dives

- **CORE.md** — package/suite schemas, bindings, capabilities, evidence, freshness channels, publish flow and plan attachments; distinguishes declarations from runtime consumers.
- **VXG-CANVAS.md** — VXG/canvas authoring: visual checklists, swarm_session browser suites, preview routes, design-ref comparison, shell/slot-scoped items, screenshot evidence.
- **BACKEND.md** — command-suite authoring: nextest lane routing, `scripts/dev/run-rust-tests.sh` contract, resource groups, heavy-lane rules, flakiness policy, evidence from nextest output.
- **EXAMPLES.md** — six annotated end-to-end TESTS.md packages: minimal checklist, minimal command, minimal swarm_session, mixed-mode, VXG map rendering, backend event-store persistence.

## Cross-references

- **Already-authored operations** (run, schedule, publish, greenlight) → `verify-ops` skill.
- **Hands-on CLI syntax** for every `verify` command → `verify-ops` § Quick Reference.
- **Package versioning** (branch/tag TESTS.md revisions in the repo) → `vcs-ops` skill with scope `workspace/<id>` for repo-rooted packages.
- **Plan package wiring** (how `verification_packages[]` attachments work) → `swarm-civilization-plans` skill + CORE.md § Plan Attachment.
- **Phase 0 backend test rework** (lane system inheritance) → `backend-test-rework-pipeline` plan-hub + BACKEND.md § Lane System.

## Before you start writing

1. Read the source-of-truth spec doc the package will be anchored to. If it doesn't exist yet, write it first (verify packages without source-of-truth bindings are rejected — `spec: docs/spec.md` is required).
2. Decide suite kinds. If the feature is UI-only, you probably want manual visual checklists plus automated `swarm_session` browser proof where a reusable adapter exists. If backend-only, `command` suites are the deterministic default and `checklist + manual` is the default for full realistic scenarios. If backend proof requires a real VM/agent/session and a generic adapter exists, use `swarm_session` with an explicit backend adapter; otherwise keep the scenario as manual checklist proof and do not fake it.
3. Pick the target scope. `project/<id>` is the safest default; `vxg/<id>`, `workspace/<id>`, `zone/<id>`, `design/<id>` are scope-specific.
4. Bootstrap from `simple-verify` template — don't start from a blank file. Rename, then edit.
5. Read the relevant deep-dive (VXG-CANVAS.md or BACKEND.md) before adding suites in that domain.

## Command-suite selector discipline (D19 — measured, binding)

- **Name exact tests and assert the matched count.** A selector broad enough to match
  unrelated tests manufactures vacuous greens: `test(/superseded/)` matched an unrelated
  VXG test live (AMEND-U3-1); a suite whose command matches 133 unrelated tests goes green
  with zero backing tests of its own. Ordinary-English-word filter terms are banned; the
  suite must fail on zero, extra, or missing matches.
- **Negative prose is not an executable assertion.** `scope_plan` adds structural
  checks and requires nonempty `bound_tests`; the runtime does not resolve their
  inventory or evaluate the English text. A real preflight must measure exact
  matches and the named tests must exercise the claimed negative. Use VALID YAML: a
  reserved-indicator scalar (e.g. a leading backtick) makes the whole suite file unloadable
  and `verify run` 409 at parse time — "vacuously green" has a twin, "vacuously DEAD", and
  the ALL-RED birth baseline cannot distinguish `never_run` from `unrunnable`. Parse-check
  every suite file at authoring time.
- **Evidence must be durably retained (D20).** `evidence_contract.required_artifacts` and hint
  artifacts must never cite a disposable build-worktree path (`.tmp/*-build-*`) as proof —
  green-time manifests (B11-core) make proof survive worktree deletion, and a raw pinned
  path defeats that. Also: literal path templates (`<unit>`-style placeholders) in
  `required_artifacts` do not expand — an unexpanded placeholder glob makes the overlay
  structurally unsatisfiable (measured, F-U5.4). Use real paths.

## What NOT to do

- Do not write a package without a source-of-truth doc. A proof without a contract is noise.
- Do not declare capabilities you don't actually use. Over-declaration makes instances brittle.
- Do not put machine-readable config in the Markdown body. The body is for humans; the compiler ignores it.
- Do not hand-craft `artifact_id`, `instance_id`, or any derived ID. They're content hashes.
- Do not use a template suite as product proof unchanged. Inspect its current
  plan and replace its seed with the actual required test/target selection.
- Use explicit narrow `commands` for exact test/target selection, with a measured
  inventory preflight where required. Use implicit routing for the intended
  broader gate; inspect requested/resolved lanes before execution (BACKEND.md).
- Validate and inspect the run plan before executing changed proof. Do not use
  repeated instantiation to manufacture a clean-looking acceptance state.
- Do not add package-specific scenario runners, fixture paths, fixed agent names, flow ids, or evidence filenames to production code to satisfy a UVP. Put orchestration in the verification run/evidence, and keep product code generic.
