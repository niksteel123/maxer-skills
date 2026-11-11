---
name: contract-to-uvp
description: "Transcribe an execution contract's current proof obligations into a validated UVP package or package delta, with real suites, item identities, provenance and observed baseline/carryover. Use for contract to UVP, package transcription or an affected package update. Normal output is test-packages; reconcile changed intent with its owners."
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
| 1 | research-hardening | grounded current intent and explicit assumptions | ready for the named outcome or bounded experiment |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | validated package or affected package delta | observed baseline for new obligations; matching carryover retained |
| 4 | contract-to-beads | bead graph with proof classes per outcome | coverage and actual capability dependencies verified |
| 5 | contract-bead-audit | fresh-eyes audited bead graph | verdict READY |
| 6 | contract-to-execution | kickoff/push/sweep prompts; flat swarm runs | unit UVP greenlight via gate fix-loop |

Laws binding every stage:
1. Research records current canonical intent. Cite requirements without
   duplicating them. User steering or contrary evidence can revise that intent;
   reconcile affected code, packages and contracts instead of resolving by rank.
2. A unit is complete ONLY on truthful UVP greenlight — never on narrative,
   bead acceptance criteria, or local tests alone.
3. Blocked is a valid truthful result; mocks never substitute for missing
   prerequisites.
4. Amendments: Class 1 (tighten/repair) = free + one log line. Class 2
   (weaken/redefine-pass) = recorded with research_basis. Red→green without a
   code change trips an automatic audit.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each normal stage has one primary artifact class. Substantial steering pauses
   affected dispatch and reconciles all affected artifact classes together.

Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

**You are stage 3 — mission: turn the contract's package spec into a real
package the verify service accepts, and record the honest starting state of its
new obligations without discarding valid existing proof.**

## Position And Write Target

```
research-to-contract → [contract-to-uvp] → contract-to-beads → contract-bead-audit
                        (run for a new package or affected package delta)
```

Normal write target: `test-packages/<slug>/`. If transcription exposes a schema
error or changed obligation, pause affected dispatch and reconcile it with the
contract/research owner before continuing. Record the amendment and affected
artifacts; do not silently invent requirements inside a package.

## When NOT To Use

- No contract unit spec exists yet → `research-to-contract` first. If the
  spec seems to be missing a suite, artifact, or checklist item you believe
  is needed, that is a CONTRACT amendment (Class 1 tighten) — never invent
  proof obligations at transcription time.
- Running/scheduling/reporting on already-authored packages → `verify-ops`.

## Preflight

Resolve the installed or already-built CLI and the intended project's daemon;
record their version/source provenance and confirm the required verbs exist.
Reuse a suitable build and durable checkout. Build only when the needed consumer
is missing or changed, after checking available resources. Preserve shared
daemons and their ledgers; a restart requires an owned, safe checkpoint. Package
syntax checks are useful while runtime prerequisites are unavailable, but report
that limit instead of calling unexecuted runtime validation complete.

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

**Automated command suites**: select the execution mode the installed planner
actually supports. With `commands`, the explicit command list is authoritative;
use exact test selectors and matched counts. Without it, routed mode uses the
declared lane/package policy. `paths` identifies watched/planned scope; it does
not by itself select individual unit or integration tests.

```yaml
# <suite purpose>; contract scenario steps <N..M>.
lane: fast-local                               # per contract proof tier
paths: [<implementation paths this suite watches>]
packages: [<crates>]
commands:
  - 'bash -lc "<tested product command or exact named-test selector>"'
resource_commands:
  - <help/version/provenance commands to retain>
```

Inspect `verify run plan --package-ref test-packages/<slug> --suite <suite-id>
--format json` before expensive execution; check selected suites, actual commands
and any policy escalation. Use targeted repair runs, then the required close/gate
scope after the candidate stabilizes. Do not change a shared lane's default filter
just to narrow one suite.

Contract-first convention: commands referencing not-yet-existing product
surfaces are CORRECT — they run red until implementation. Note it in the
file's comment. Never soften a command to make it pass early.

**Checklist suites** (structured YAML mode):

```yaml
---
items:
  - title: <criterion title from the contract>   # preserve scenario wording
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

Criterion keys and wording come FROM the contract scenario — transcribe, don't
re-author. The parser does not accept an authored `id` or `item_id`: it generates
opaque runtime IDs. Read `verify checklist list` and record the criterion-to-item
mapping before verdict calls; do not treat a title or ordinal as the runtime ID.
Include the standing integrity items the contract defines
(do-not-count-as-pass review, evidence-integrity, verdict-cites-refs).

## Phase 4 — Validate Loop

```bash
agent-swarm verify package validate test-packages/<slug> --format json
```

Iterate on `errors[]` until clean. Common rejects: unquoted semver, `kind`
not literal, missing suite file, invalid pair, empty scopes, absolute/parent
paths. If the contract's spec itself was schema-invalid, fix the package AND
log a Class 1 line in the contract's Amendment Log.

## Phase 5 — Instantiate + Baseline Proof

```bash
agent-swarm verify instantiate test-packages/<slug> --format json
agent-swarm verify greenlight --instance-id <id> --format json
```

For genuinely unimplemented obligations, record their never-run/red baseline
and missing required evidence. Inspect the relevant unit view and item status,
not the whole package's color alone. Existing implemented behavior may already
have valid proof; verify its inputs and carryover rather than forcing it red.
For an amendment, preserve unaffected judgments whose identity, inputs and
evidence still match. Record the instance, new/changed obligations, retained and
reset proof, and the reason for each reset. An empty implementation passing a
claim it cannot satisfy remains a vacuous-proof defect.

### ⛔ THE ALL-RED BASELINE CANNOT DISTINGUISH `never_run` FROM **UNRUNNABLE**

An instantiated never-run suite does not prove its executable specification is
runnable. Use the installed typed parser through `verify run plan` for selected
command suites and confirm their matched count and commands. Syntax-check other
declared suite files with their applicable parser; YAML syntax alone does not
validate the runtime schema or prove a command ran.

For YAML files, propagate parser errors instead of printing an error and leaving
the shell green. Confirm the checked files cover the declared YAML suite paths:
```bash
python3 - <<'PY'
from pathlib import Path
import yaml
paths = list(Path('test-packages/<slug>/suites').glob('*.yaml'))
assert paths, 'No YAML suite files matched; check the declared suite paths'
for path in paths:
    list(yaml.safe_load_all(path.read_text()))
print(f'Parsed {len(paths)} YAML files; runtime schema/execution proof is separate')
PY
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
  self-contained prompt for the next affected outcome or package delta (paths,
  commands, this checklist), ending with a copyable fresh-eyes re-read
  prompt as the final section.
- Final response: package path, suite count by kind, validate/instantiate
  results, baseline summary, any Class 1 amendments logged, next action
  (contract-to-beads for this unit).

## Transcription Fidelity Checklist

- [ ] Every contract suite-table row → exactly one suite entry + file
- [ ] Every Required Evidence artifact → `evidence_contract.required_artifacts`
- [ ] Contract criterion wording is faithful; observed runtime item IDs are mapped
- [ ] `work_unit_queries` labels match the unit's planned bead labels
- [ ] Research + contract docs present in `path_globs`
- [ ] No suite weakened/strengthened relative to the contract (diff them)
- [ ] No fixture-specific logic anywhere near production code; fixtures are
      data only
- [ ] Validate/instantiate results recorded; new-obligation baseline and carryover reconciled
