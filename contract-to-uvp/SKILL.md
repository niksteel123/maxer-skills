---
name: contract-to-uvp
description: "Stage 3 of the contract-first pipeline. Transcribe one unit's UVP package spec from the execution contract into a real, validated verification package: TESTS.md + provenance-stamped derived docs + suite files, then verify package validate → instantiate → confirm the ALL-RED never-run baseline (contract-first discipline: packages exist and validate BEFORE implementation). Composes verify-authoring for schema authority. Use when: 'transcribe the UVP', 'create the unit package', 'contract to uvp', turning a contract's package spec into test-packages/<slug>/. Writes ONLY test-packages/."
---

# Contract To UVP — Transcription Into Machine-Checked Contracts

> ULTRATHINK on fidelity, not creativity. This stage is deliberately
> mechanical: the contract already designed the proof; your job is a 1:1
> transcription into the verify parser's schema, proven by validate +
> instantiate + the correct red baseline. Invented content here is drift;
> dropped content here is underscoping. Both are findable by diffing against
> the contract's suite tables — so diff them.

## The Contract-First Pipeline — 60-Second Orientation

| # | Stage (skill) | Produces | Done when |
| --- | --- | --- | --- |
| 1 | research-hardening | ideal source doc via stamped revisions | 7-item readiness bar = READY |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | validated TESTS.md package per unit | instantiated; ALL-RED never-run baseline |
| 4 | contract-to-beads | bead graph with proof classes per unit | 100% two-sided coverage; polish steady-state |
| 5 | contract-bead-audit | fresh-eyes audited bead graph | verdict READY |
| 6 | contract-to-execution | kickoff/push/sweep prompts; flat swarm runs | unit UVP greenlight via gate fix-loop |

Laws binding every stage:
1. The research doc is canonical. Downstream artifacts CITE it, never restate
   it. Conflicts resolve upward: code → package → contract → research.
2. A unit is complete ONLY on truthful UVP greenlight — never on narrative,
   bead acceptance criteria, or local tests alone.
3. Blocked is a valid truthful result; mocks never substitute for missing
   prerequisites.
4. Amendments: Class 1 (tighten/repair) = free + one log line. Class 2
   (weaken/redefine-pass) = recorded with research_basis. Red→green without a
   code change trips an automatic audit.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each stage writes exactly ONE artifact class.

Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

**You are stage 3 — mission: turn the contract's package spec into a real
package the verify service accepts, and prove the honest starting state
(all-red, never-run) before any implementation exists.**

## Position And Write Target

```
research-to-contract → [contract-to-uvp] → contract-to-beads → contract-bead-audit
                        (run once per unit)
```

Write target: `test-packages/<slug>/` ONLY. Never the research doc, never the
contract doc EXCEPT a Class 1 amendment-log line when transcription forces a
contract correction (e.g., a suite shape the parser rejects).

## When NOT To Use

- No contract unit spec exists yet → `research-to-contract` first. If the
  spec seems to be missing a suite, artifact, or checklist item you believe
  is needed, that is a CONTRACT amendment (Class 1 tighten) — never invent
  proof obligations at transcription time.
- Running/scheduling/reporting on already-authored packages → `verify-ops`.

## Preflight

`verify` commands need a reachable daemon: build debug binaries
(`cargo build -p swarm-cli -p swarmd`, repo convention is debug for
iteration) and confirm `target/debug/agent-swarm verify --help` responds.
If the daemon is unavailable and cannot be started, record BLOCKED with the
error — do not hand-check YAML and call it validated.

## Phase 0 — Required Reading

1. **Invoke/read the `verify-authoring` skill.** It is the schema authority
   (frontmatter fields, the THREE valid suite pairs, capabilities, path
   rules, checklist modes). This skill is the pipeline wrapper around it,
   not a replacement.
2. Read the contract unit: UVP Package Spec, Scenario Suite (Required
   Evidence + checklist item wording), Verification Prerequisites, Close
   Gate, Crosswalk.
3. Read the research sections the unit's scope boundary cites (you will
   derive the package docs from them).
4. Skim one shipped package of similar shape under `test-packages/`
   (`bootstrap/simple-verify` is the canonical minimal template; a
   group-style package shows the live-checklist + command-suite mix).

## Phase 1 — Package Skeleton

```
test-packages/<slug>/
  TESTS.md
  docs/spec.md           # derived extract; provenance header REQUIRED
  docs/architecture.md   # optional but recommended; provenance header
  suites/<one file per suite>
  fixtures/              # data only — manifests, eval task refs; NEVER scripts
```

Derived-doc rules: each `docs/*.md` opens with a PROVENANCE header naming the
research doc (+ pinned revision) and the contract doc it derives from, states
"the research doc is canonical; this file is a package-local anchor", and
contains only quoted/cited content — zero new requirements. Keep them
compact; the executable truth is the frontmatter + suites.

## Phase 2 — TESTS.md Frontmatter (field-by-field)

- `package_id`: from the contract spec (dotted, stable).
- `kind`: the literal string `verification`.
- `package_version`: QUOTED semver (`"1.0.0"`).
- `layer_id`, `name`, `description`, `tags`: from the contract spec;
  description should say "contract-first: automated suites run red until the
  implementation lands" when that is true.
- `source_of_truth`: `spec: docs/spec.md` (+ architecture/tdd if present) —
  package-root-relative, files must exist at compile time.
- `evidence_contract`: `run_root_glob` + `required_artifacts` — transcribe
  the scenario's Required Evidence list COMPLETELY. Greenlight enforces this
  as its own synthetic suite (`evidence.required_artifacts`), so every name
  here is a hard gate; do not pad it with nice-to-haves.
- `bindings.scopes`: from the contract (e.g., `project/<id>`,
  `workspace/<id>`); at least one.
- `bindings.work_unit_queries`: the unit's bead labels — MUST match what
  contract-to-beads will stamp on beads (e.g., `{label: <feature>}`,
  `{label: <feature>-u<N>}`).
- `bindings.path_globs`: implementation paths + the RESEARCH DOC + the
  CONTRACT DOC + the package itself. The doc globs are the mechanical
  drift-coupling: any research/contract edit stales every instance until the
  rebase pass runs. Do not omit them.
- `suites[]`: one entry per contract suite-table row — id, proof_kind +
  execution_mode (only `(checklist,manual)`, `(automated,command)`,
  `(automated,swarm_session)` exist), file, `required_capabilities`
  (minimal, canonical names), `checklist_refs` where the contract declares
  ordering between checklist suites.

## Phase 3 — Suite Files

**Automated command suites** (lane + planner pattern; never raw `cargo
nextest` invocations):

```yaml
# <suite purpose>; contract scenario steps <N..M>.
lane: fast-local | feature-local | phase-gate     # per contract burndown tier
paths: [<implementation paths this suite watches>]
packages: [<crates>]
commands:
  - <product command or cargo test with the EXACT test names the contract
     fixed — these names are the contract; implementation must create them>
resource_commands:
  - <help/version/provenance commands to retain>
```

Contract-first convention: commands referencing not-yet-existing product
surfaces are CORRECT — they run red until implementation. Note it in the
file's comment. Never soften a command to make it pass early.

**Checklist suites** (structured YAML mode):

```yaml
---
items:
  - title: <stable-item-id-from-contract>          # kebab-case, scenario wording
    description: >
      <the exact claim, citing contract scenario step + research clause>
    severity: critical | high | medium
    required_capabilities: [<canonical>]
    tags: [<unit>, <topic>]
    automation_hint: >
      <which TOOL executes this (from Verification Prerequisites tool-to-medium
      matrix: agent-browser / Chrome MCP / bash capture / second clean-context
      agent session) and which evidence refs the verdict must cite>
---
```

Item ids and wording come FROM the contract scenario — transcribe, don't
re-author. Include the standing integrity items the contract defines
(do-not-count-as-pass review, evidence-integrity, verdict-cites-refs).

## Phase 4 — Validate Loop

```bash
target/debug/agent-swarm verify package validate test-packages/<slug> --format json
```

Iterate on `errors[]` until clean. Common rejects: unquoted semver, `kind`
not literal, missing suite file, invalid pair, empty scopes, absolute/parent
paths. If the contract's spec itself was schema-invalid, fix the package AND
log a Class 1 line in the contract's Amendment Log.

## Phase 5 — Instantiate + Baseline Proof

```bash
target/debug/agent-swarm verify instantiate test-packages/<slug> --format json
target/debug/agent-swarm verify greenlight --instance-id <id> --format json
```

Required baseline for a pre-implementation package: `green: false`; every
suite in `never_run_suite_ids`; `evidence.required_artifacts` red; zero
stale reasons. **Anything green before implementation exists is a defect**
(a suite that can pass on an empty tree proves nothing). Record instance id
+ baseline output.

### ⛔ THE ALL-RED BASELINE CANNOT DISTINGUISH `never_run` FROM **UNRUNNABLE**

**Both look identical, and one is a time bomb.** Suite YAML parses at **`verify run` time**, not
at author/validate/instantiate time — and `package validate` reads only TESTS.md. So a suite file
with a **syntax error** sails through transcription, validate, instantiate, AND the ALL-RED
baseline, then 409s at parse the first time someone tries to earn it — typically units later, with
the gate on the line.

**PARSE-CHECK EVERY SUITE FILE AT TRANSCRIPTION. It is one line and it closes the hole:**
```bash
for f in test-packages/<slug>/suites/*.yaml; do
  python3 -c "import yaml,sys;list(yaml.safe_load_all(open('$f')))" || echo "⛔ UNPARSEABLE: $f"
done   # safe_load_all — multi-document manual/checklist suites are legitimate
```
> **Real (U2, 2026-07-16):** a `negative_assertions` entry began with a backtick — a YAML reserved
> indicator that cannot open a plain scalar — making the **whole file unloadable**. It blocked two
> `turns-green` beads and the unit gate, and was found only when a lane tried to earn the suite.
> **The line was decorative** (D19: `negative_assertions` are parsed but never evaluated) — yet it
> killed the document, because it shares that document with `commands`. **Never-evaluated ≠ inert:
> "vacuously green" has a twin, "vacuously DEAD."** Cost: one JIT fix bead + an amendment cycle
> mid-gate. A parse-check at stage 3 would have caught it before the unit began.

### ⛔ A REJECTION TEST NEEDS A MATCHING ACCEPTANCE TEST

**"It rejected the bad input" proves nothing unless something proves it accepts the good one.** A
merely-broken checker rejects *everything* and passes your negative test for entirely the wrong
reason — a confident-looking green over a fixture that never worked.

Pair every rejection assertion with the minimal-delta acceptance case:
> **Real (U2, 2026-07-16):** a `deny_unknown_fields` store-compat proof asserted a new-shaped store
> is rejected, then stripped **only** the one new field and asserted the *same* mirror loads
> cleanly. Without that second half, a mirror broken in any way would have passed.

Related discipline from the same proof: **derive fixtures from git history, never from memory.** That
mirror struct was copied verbatim from `types.rs` at `<commit>^` — the commit before the field was
added. **A guessed mirror proves the wrong thing** while looking identical in the diff.

### ⛔ A BROAD COMMAND SELECTOR MANUFACTURES VACUOUS GREENS

A suite whose command is a wide selector (`cargo nextest run -E 'test(/verify::/)'`) goes green
when **that command exits 0** — which it does when 133 *unrelated* tests pass. **The suite's own
assertions may have ZERO backing tests and it still reads green.** The pass criterion verifies the
selector, not the claim.

- When authoring: prefer selectors scoped to the suite's own tests, and **name in the suite the
  exact tests each assertion depends on**.
- When earning: apply the **exact-named-test + matched-count** rule — prove YOUR assertions
  executed, not merely that the command succeeded.
> **Real (U2, 2026-07-16):** `vdf.u2.provenance-store-compat` reported **green** while its N10
> assertion and downgrade-fail control had **no matching tests at all** — the work hadn't landed
> yet. A lane refused the free close and left the bead open. **That refusal is the standard**: a
> green earned by someone else's tests is not evidence for your claim.

## Phase 6 — Record + Hand Off

- Update `00-pipeline-guide.md` (package path, instance id, baseline).
- FORWARD ENRICHMENT: if later handoffs exist (05/06/07-prep), fill their
  `{ENRICHMENT:package-instance}` (slug + instance id + baseline summary)
  and `{ENRICHMENT:suite-list}` markers.
- Write/refresh `04-uvp-transcribe.md` in the pipeline prompts folder: a
  self-contained prompt to repeat this stage for the NEXT unit (paths,
  commands, this checklist), ending with a copyable fresh-eyes re-read
  prompt as the final section.
- Final response: package path, suite count by kind, validate/instantiate
  results, baseline summary, any Class 1 amendments logged, next action
  (contract-to-beads for this unit).

## Transcription Fidelity Checklist

- [ ] Every contract suite-table row → exactly one suite entry + file
- [ ] Every Required Evidence artifact → `evidence_contract.required_artifacts`
- [ ] Every checklist item id matches the contract's stable ids verbatim
- [ ] `work_unit_queries` labels match the unit's planned bead labels
- [ ] Research + contract docs present in `path_globs`
- [ ] No suite weakened/strengthened relative to the contract (diff them)
- [ ] No fixture-specific logic anywhere near production code; fixtures are
      data only
- [ ] Validate clean · instantiate clean · all-red never-run baseline proven
