---
name: contractmaxxer
description: "Orchestrate an adaptive contract-first workflow from its current state: investigate unresolved questions, choose coherent product outcomes, author executable proof and handoffs, and reconcile plans when evidence or user steering changes them. Use for contractmaxxer, contract pipeline preparation or authorized end-to-end execution."
---

# Contractmaxxer — Contract-First Pipeline Orchestrator

> ULTRATHINK. You do not execute the pipeline — you generate the handoff
> prompts that make every stage execute CORRECTLY in a fresh session. A
> generic handoff produces a generic stage run; a handoff packed with
> researched, feature-specific context produces the run the contract
> deserves. The sub-optimization passes you write are the difference between
> template-stamping and orchestration.
>
> (AUTO MODE is the one exception — and only half of one: there you also
> ORCHESTRATE the chain's execution, but every stage still runs in a fresh
> agent, never in your own context. You remain the control plane, not a
> stage worker. See "Auto Mode" below.)

## The Contract-First Pipeline — 60-Second Orientation

| # | Stage (skill) | Produces | Done when |
| --- | --- | --- | --- |
| 1 | research-hardening | ideal source doc via stamped revisions | 7-item readiness bar = READY |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | **surface resolution executed**: AMEND the surface package (delta: append suites + unit view + minor bump + lineage publish, ONE instantiate) or MINT a new surface package — per the stage-0 decision record | instantiated; **DELTA-VIEW all-red** (H1: `greenlight(view=unit:<epic>-u<N>)` = never-run); carryover audit read, `reset=∅` expected ONLY for suites byte-unchanged since the ancestor's instantiate (D22) |
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
   **"Free" is doctrine, not a fact — PRICE IT AGAINST THE SUBSTRATE.** A
   Class-1 that edits a frozen input can cost every earned green (edit → input
   hashes drift → rebaseline → wipe). Measured: a one-line wording tightening
   priced out at 9 greens, so the rational act was to leave the wording wrong
   and queue it for the unit that makes amendment cheap. **When doctrine says
   "free" and the substrate says otherwise, the substrate is right** — and that
   gap IS the finding; log it, don't pay it.
   **POST-2026-07-19 UPDATE: the cheap-amend machinery is now LIVE** (B4
   lineage publish + B1 carryover + B8 content-addressed ids) — the measured
   9-green amendment re-priced to ZERO collateral through the delta flow, so
   "queue it for SPINE" is superseded: price amendments through a lineage
   publish + carryover audit instead of deferring them. The pricing duty
   remains (D22): expect resets for any suite whose FILE changed since the
   ancestor instance's birth — read the audit, never assert the price.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Each normal stage has one primary artifact class. Substantial steering pauses
   affected dispatch and reconciles all affected artifact classes together.
7. **THE CONSUMER RULE — a declaration is not a mechanism. Every claim must have
   a proven consumer.** A field the schema accepts but no executor evaluates, a
   guarantee the docs promise but no code reads, a rule written in one checker's
   prose that another re-derives without it — all are the SAME defect, and all
   produce confident, vacuous greens. **The test is never "is it declared?" but
   "what breaks if I delete it?"** If nothing breaks, nothing consumed it.
   Measured in ONE run: a metadata overlay with no read path (shipped green on
   its own gate's commit); `negative_assertions` parsed-but-never-evaluated
   across 307 suite files / 44 packages; a staleness channel with no writers; a
   phase rule no monitor enforced; and — the expensive one — **this toolkit's own
   skills asserting a lifecycle guarantee, a `br ready` semantic, and a "already
   reclaimed" registry line that were all simply false.** The disease is not
   confined to the code under test; **it lives in your instructions too.**
8. **RECURRENCE FALSIFIES THE FIX — do not narrow the rule, test the premise.**
   If the same failure returns after you fixed it, your model is wrong, not the
   agent's discipline. Adding a more specific prohibition each time is the
   anti-pattern: it feels like progress and buries the real cause deeper.
   Measured: 12 agents died over 4 "fixes" to the same wait-pattern rule before
   anyone tested the underlying claim — which was false, so every agent obeying
   it died obeying it. **After the second recurrence, stop patching and go
   measure the mechanism.** Blaming the operator is the tell.

## The Durable Fabric — packages OUTLIVE pipelines (binding since 2026-07-19)

The verify substrate now carries the durable-fabric machinery, SHIPPED and
proven by its own self-hosted pipeline (verify-durable-fabric, 6/6 units,
whole-package 26/26 earned on a post-amend instance): **B1** per-suite
carryover · **B2** rebaseline-on-green · **B3** scoped greenlight views ·
**B4** publish-with-lineage · **B5** lifecycle flags · **B8**
content-addressed checklist ids · **B9** supersession resolution · **B10-lite**
manual tick/run-now re-earn · **B11-core** CAS evidence manifests. Still Phase-2
(named, unscheduled): B6 binding-driven staleness, B7 durable timers,
B10-full dispatch. Canonical architecture: research doc
`docs/research/2026-07-14-uvp-durable-verification-hyperstructures-research.md`
§7 (read §7.1–§7.5 before generating any stage-3/6 handoff).

What this changes about EVERY pipeline this skill generates:

1. **Packages are keyed to SURFACES, not features.** A feature is an event;
   `verify.surface.<name>` packages are the durable hyperstructures that
   accrete suites across features. **The default for a touched surface that
   has a package is AMEND (delta-authoring), never a new package** — minting
   a parallel package over an owned surface is a BLOCKING audit violation.
   MINT only for a genuinely new surface (and register it). One-time
   pipelines that always mint fresh packages are the 83-fossil disease this
   machinery exists to end.
2. **The delta flow is cheap now — use it** (research §7.5): reserve the
   package dir → append suites (unit-namespaced ids + `family:` tags) + the
   `unit:<epic>-u<N>` view → minor version bump + `lineage.previous_digest` →
   publish → ONE instantiate → read the carryover audit `{carried, reset,
   new}` → prove the DELTA baseline red (H1). Earned greens carry over (B1);
   the unit never waits on foreign suites (B3 views).
3. **Suite families + triage, not permanence-by-default**: `construction`
   (RETIRE at close) · `regression` (KEEP → the budgeted regression view) ·
   `soak` (scheduled) · `journey` (KEEP, drift-scoped re-walks) ·
   `operational` (readiness-derived). Triage at the completion sweep is a
   SANCTIONED lifecycle mechanism, not scope drift — but intentional
   behavior change routes through **D9 SUPERSEDE** (owner-adjudicated,
   expected-red-by-design + born-red replacement), never through RETIRE or
   exemption, both of which are gameable.
4. **Honesty extends across the lineage** (H1–H5): delta all-red at birth;
   earned-vs-inherited labeling; `unit:*` gates require EARNED green; the
   regression view accepts inherited green only within its freshness floor;
   carryover misses trip an audit. **D22 caveat (measured at SPINE):**
   carryover matches INSTANTIATE-TIME file hashes, not green-time — the
   first lineage walk against a long-lived ancestor resets every suite whose
   file was legitimately edited since that ancestor's birth. Read the
   carryover audit against the ancestor's pre-existing SUITE-FILE stale set
   (only file-hash drift vs the instantiate-time baseline predicts resets —
   SoT/doc-drift staleness stales without resetting, and green-time
   snapshots are invisible to carryover); never assert `reset=∅` without it.
5. **The pipeline's terminal act changed** (W3): the sweep triages every
   delta suite (KEEP/SOAK/RETIRE, runbook-required lint), updates views +
   the registry, computes the fold-in ratio, and HANDS THE SURFACE PACKAGE
   BACK TO ITS OWNER with a health note. "Flip guide to COMPLETE and walk
   away" is the old world. Post-ship, the package's `AMENDMENTS.md` is the
   standing Class-1/Class-2 log (W8). Operating-loop features (Cortex-class)
   terminate at **GA + readiness pending**, not COMPLETE (W6).
6. **The adjacency rule** (W5): a unit map touching surface S includes, at
   SPINE close, `greenlight(S, view=regression)` against the surface's
   lineage head — ADVISORY until Phase 2 (red mints an owner-routed work
   item; the close proceeds), blocking after.
7. **Registry bootstrap**: the surface registry lives at
   `test-packages/SURFACES.md` (one row per surface: owner, owning package,
   path-glob roots, members, regression budget). **Until it exists, stage 0
   CREATES the touched surfaces' rows** from the research doc's §7.2 carve —
   the registry comes into existence opportunistically at first use (D7),
   never as a big-bang migration.

**You are stage 0 — the orchestrator: detect the entry point, deep-research
the feature, and generate the complete handoff chain so that every stage
session starts with everything it needs to execute correctly.**

## Account For Current Authorized Scope

Every current requirement must have a proof/work owner or an explicit remaining
disposition. Later authoring does not silently erase it. Review actual coverage,
authority and evidence; do not use a vocabulary ban as a proxy for scope drift.
User steering and contradicted assumptions may change the canonical design or
scope through recorded reconciliation. Do not weaken a criterion merely to
obtain green. Product readiness and a completed internal gate remain separate.

### Shared product board

When repository instructions, the guide or the user names a product board,
read its relevant milestones/prerequisites before partitioning or selecting work.
Use [product-board](../product-board/SKILL.md) for preliminary plan iteration,
new tracks, completion policy and external workflow mappings. A requested board
can be drafted before contracts; draft milestones are not new implementation
authorization. With no board in scope, continue the normal single-track workflow.

The research and contract phases may revise milestones alongside affected
canonical plans when evidence or steering warrants it. Preserve IDs, valid proof
and active ownership; a board does not freeze architecture or impose one unit
per milestone. Add its actual path/link and relevant IDs to the existing guide.
Generated planning/execution prompts must carry that pointer and boundary reminders.

Keep the full product goal distinct from the next demonstration. Use short outcome
titles and acceptance bullets; split milestones for useful delivery/dependency
boundaries, not one per check. Develop substantial design changes in the canonical
plan and reconcile the board; identify pending amendments and respect a requested
plan-first sequence. A board rewrite alone does not complete the redesign.

The coordinator rereads at start/resume, next-outcome selection and before relying
on a changed prerequisite; updates after meaningful results, blocks, milestone
closure or reflection. Apply the product-board Achieved policy: actual promised
behavior, applicable earned proof/review, matching evidence and no unresolved
contradiction. A green unit or merged PR alone does not establish a milestone.
Report the actual unlock and open product obligations at unit and final sweeps.
Before changing a promise, inspect dependent IDs and reconcile affected artifacts.
Existing worker scope, independent work and healthy workloads remain protected.

### Steering during execution

At the existing coordination cadence and before extending a repair/review loop,
ask: what useful behavior or decision has advanced, what is still unproven, and
what decision will the next verification change? Prefer the next product result
when more checks only elaborate already-qualified behavior. This is a short
choice in the current checkpoint, not a new watcher, worksheet or review round.
Apply [research-to-contract](../research-to-contract/SKILL.md#scenario-authoring-rules-the-heart-of-this-skill)
for proportional proof: representative success plus relevant material failures,
scoped repair, required close checks and a stopping condition. Reconcile an
overgrown contract explicitly; preserve genuine operational promises and valid
evidence. Honor paused/concluded experiments; findings need not become endless
repairs merely because an exploratory checklist still has open questions.

Use [research-to-contract — Reflection and substantial steering](../research-to-contract/SKILL.md#reflection-and-substantial-steering)
for the affected-artifact table and resume conditions. Pause affected dispatch,
checkpoint work, reconcile intent/contracts, suites/items, beads/edges and
prompts, and inspect actual evidence carryover. Unaffected work continues.

## First Action When Invoked

Before any delegation, including research and native subagents, read
[fleet-controller](../fleet-controller/SKILL.md#model-account-and-machine-routing)
and the current model registry. Choose the model/provider for the actual task
before choosing its launch adapter. This applies in every mode, not only AUTO.

1. Read the relevant complete handoff block in `TEMPLATES.md`, its enrichment
   map and the needed manifest/guide fields. Read later blocks when their work
   becomes ready; do not generate a handoff from the anatomy summary alone.
2. Skim the SIX stage skills' opening sections (they live in the same
   skills directory as this skill: `research-hardening`,
   `research-to-contract`, `contract-to-uvp`, `contract-to-beads`,
   `contract-bead-audit`, `contract-to-execution` — read each SKILL.md's
   mission line and done-condition). Every handoff's Mission must MIRROR its
   stage skill's mission, never re-invent it; drift between handoff and
   skill confuses the executing session.
3. Then execute Phase 0 (Detect).

## Ownership Model (critical — read before generating anything)

The six stage skills already write/refresh their own prompt files at
runtime. Contractmaxxer and the stages share the SAME folder
(`docs/plan-hub/prompts/<feature>-contract-pipeline/`) under this division:

| File | Contractmaxxer writes | Stage skill refreshes |
| --- | --- | --- |
| `manifest.yaml`, `EXECUTION-GUIDE.md` | initial + final | — |
| `00-pipeline-guide.md` | initial | every stage updates its row |
| `01-hardening-revision.md` | initial (researched) | research-hardening (per revision) |
| `02-contract-create.md`, `03-contract-validate.md` | initial (researched) | research-to-contract (with real unit data) |
| `04-uvp-transcribe.md` | initial (researched, unit-parameterized) | contract-to-uvp (per unit, real ids) |
| `05-beads-create.md`, `06-beads-audit.md` | initial (researched, unit-parameterized) | contract-to-beads (per unit, real ids) |
| `07-execution-prep.md` | initial | — |
| `09-next-unit.md` | initial (unit-agnostic; invokes contract-next-unit) | — (it re-primes the OTHER per-unit prompts at each boundary) |
| `07-execution-kickoff.md`, `08-execution-push.md`, `10-completion-sweep.md` | NOT written here | contract-to-execution creates them (needs runtime ids; sweep is `10`, leaving `09` for the boundary advance) |
| `AUTO-PILOT.md` (auto invocations only) | initial (config: mode, routing, stop policy, valves) | the orchestrating session appends its run log per stage/unit |

Your initial versions carry `{ENRICHMENT: ...}` markers for data that does
not exist yet (unit map before stage 2, instance ids before stage 3, epic
ids before stage 4). A handoff must WORK without enrichment (point at the
artifact to read directly) and IMPROVE with it. Never leave a bare
placeholder that breaks the handoff.

## Composable Entry Points

Detect what exists; generate only from the entry point onward:

| Found | Entry point | Handoffs generated |
| --- | --- | --- |
| Research doc, not READY (or readiness unknown) | Stage 1 | 01 → 07-prep |
| Research doc READY (stamped revisions, bar passes a spot-check) | Stage 2 | 02 → 07-prep |
| Contract doc exists, pass 2 not run | Stage 2 pass 2 | 03 → 07-prep |
| Contract validated, no package for next unit | Stage 3 | 04 → 07-prep |
| Package delta instantiated (DELTA-view all-red + carryover audit recorded), no beads | Stage 4 | 05 → 07-prep |
| Beads exist, not audited | Stage 5 | 06 → 07-prep |
| Audit verdict READY | Stage 6 | 07-prep only |

Detection commands (adapt paths to repo conventions):

```bash
ls docs/research/ | grep -i <feature>                  # research + contract docs
grep -n "^Revision:" <research_doc> | tail -3          # revision history exists?
ls docs/plan-hub/prompts/ | grep <feature>             # pipeline folder exists?
cat test-packages/SURFACES.md 2>/dev/null              # surface registry (bootstrap rows if absent)
ls test-packages/ | grep -i "surface\|<feature>"       # surface pkgs + legacy per-feature pkgs
agent-swarm verify list --format json     # instances, using the installed qualified CLI
br list --json | head -20                              # beads? root epic?  (run from REPO ROOT — a worktree CWD reads a frozen snapshot)
```

Surface-aware detection: `ls test-packages/ | grep <feature>` finding a
LEGACY per-feature package is NOT "the package exists" for entry-point
purposes — the stage-3 question is whether the touched SURFACE's owning
package has this unit's delta (check its TESTS.md version/lineage + the
unit view), and a legacy package on the same surface is a FOLD candidate to
note in the surface resolution, not a collision to avoid.

If ambiguous (e.g., a contract doc exists but looks stale against the
research revision), ASK the user which entry point to take — wrong entry
wastes a full stage session.

## Pipeline Modes — mini / normal / max (granularity calibration)

Mode describes how much near-term detail is useful; it does not prescribe a
unit count, document size, review quota, package count, or fleet size. Preserve
an explicitly requested mode, but size work from the next useful outcome,
remaining uncertainty, real capability dependencies and feedback cost.

Start with the smallest coherent slice that can demonstrate representative
product behavior. Add a unit only for a separately useful outcome, material
risk retirement, or genuinely independent work. Author near-term acceptance
fully and keep later work light. Backend, kernel and distributed work have no
automatic upward bias; UI and visual work have no automatic downward bias.

Use independent review where the risk or unresolved judgment warrants it.
Continue a review only for unresolved findings or new evidence, not a round
target. Fleet size comes from live claims, reservations, capacity and eligible
models; a mode name grants no slots.

**Rules:** (1) **User override always wins** — if the invocation names a
mode, use it and record `mode_source: user`. (2) Record `mode`,
`mode_source`, and a 1–2 line `mode_rationale` in `manifest.yaml` AND in
`00-pipeline-guide.md`'s header. (3) Thread the mode into the generated
handoffs as an explanation of near-term detail, not a unit or staffing quota.
(4) Escalation and de-escalation use the same evidence-based decision: record
what changed, preserve acceptance obligations and reconcile affected artifacts.
Neither direction requires a special model or ritual review merely for changing mode.

## Phase 0 — Detect (5–10 min)

1. Read the source doc's header + outline fully: type (research vs contract),
   feature slug, revision history, mode declaration, scale (line count,
   phase/unit structure).
2. Run the detection commands; build the entry-point decision; confirm with
   the user only if genuinely ambiguous.
3. Detect environment facts every handoff needs: authoritative bead CLI/context,
   installed/built tool provenance, intended daemon reachability, AgentMail availability,
   evidence-root conventions (`evidence/<unit>/...`).
4. Make the PROVISIONAL mode call (mini/normal/max — see Pipeline Modes)
   from the next useful outcome, unresolved risk and feedback cost; honor any explicit user
   mode. Confirm or adjust after Phase 1; state the final call + rationale
   in your report.
5. Detect whether AUTO mode applies: the user explicitly requested it and a
   verified current harness, NTM or local/SSH controller can launch, observe and
   checkpoint the owned work. Check the actual capabilities and fleet config;
   report a concrete missing capability rather than rejecting a harness brand.
   Never infer auto from silence.

## Phase 1 — Deep Research (the part that makes this orchestration, 20–40 min)

Research only unresolved questions that affect the next outcome or its proof.
Use the question groups below as coverage prompts, not a staffing quota. Reuse
current evidence; delegate only concrete independent questions within the live
capacity budget. Set a bounded question/output/time budget and stop when those
questions are resolved or their limits are explicit. Reassess the provisional
mode from findings, not document size or a prescribed number of agents.

**Subagent 1 — Research-doc cartography + readiness pre-scan**: full section
outline with line refs; which sections are citable anchors (numbered
invariants, phase lists, acceptance items, command surfaces); a pre-scan of
the 7-item readiness bar with per-item evidence; scale estimate (expected
unit count, expected bead count); the doc's own named codebase surfaces and
external dependencies.

**Subagent 2 — Codebase integration surface**: for every subsystem the
feature touches — exact files demonstrating the pattern to copy (service
domain anatomy, event/projection patterns, CLI envelope, method
registration, index precedents), key type names, **integration seams (the
exact wiring points new code plugs into — registries/enums to extend,
mod.rs/router entries, builder chains)**, the **exists-vs-assumed delta**
(what the research doc's design leans on that doesn't exist yet; what
already exists that must not be broken or duplicated — collision/naming
check), **test/eval harness precedents** (golden/snapshot patterns, lanes),
and 5–10 falsifiable reality claims with file refs. This feeds stage 2's
study maps AND your sub-optimization questions — it must match the depth
bar research-to-contract Phase 1.4 demands.

**Subagent 3 — Surface-ownership RESOLUTION (W1 — this replaced the old
collision-avoidance landscape scan, which was root-cause M4 of the
83-fossil disease)**: from subagent 2's touched paths/subsystems, consult
`test-packages/SURFACES.md` (if absent: derive from research doc §7.2's
carve and flag the registry rows for stage-0 creation) and emit **one
decision record per touched surface**: `AMEND <surface pkg>` (the DEFAULT
whenever the surface has an owning package) | `MINT <new surface>`
(genuinely new surface — registers it). Each record carries: the
regression-view budget the adjacency rule will bind, and the surface's
**current health** (greenlight state of its regression view / manifest) — a
pre-existing red or stale forces an upfront disposition (absorb as contract
pre-work · route to the surface owner with a recorded exemption · block
kickoff), chosen at stage 0, never discovered at SPINE. De-minimis:
docs/comments-only touches may be declared exempt with a one-line note.
Also still collect: verify CLI/daemon state, instances that could collide,
evidence directory precedents, label conventions.

**Subagent 4 — Prior art + conventions**: the model contract docs
(apple-vm roadmap §Step-By-Step UVP Scenario; shared-workspace doc's
per-group bundles) and the best existing execution contract as the quality
bar; bead state (`br list`) and any prior pipeline folders; AGENTS.md /
CLAUDE.md conventions the handoffs must restate.

Synthesize into a feature-context object (embed relevant slices into each
handoff):

```yaml
feature_context:
  slug, source_doc, revision_pin, entry_point
  readiness_prescan: {item: PASS|WEAK|FAIL + evidence}
  expected_units: [{id, research_phase, one_line_scope}]   # best guess pre-stage-2
  key_files: [{path, why}]            # 10–20, from subagent 2
  key_types: [{name, location, why}]
  reality_claims: [dated falsifiable claims]
  uvp_landscape:
    surface_resolutions: [{surface, decision: AMEND|MINT, owning_pkg,
                           regression_budget, health, disposition_if_unhealthy}]
    model_packages, daemon_state, label_conventions
  quality_bars: {best_contract, best_package, model_scenario_docs}
  env: {bead_cli, build_cmd, evidence_root_convention, agentmail}
```

## Phase 2 — Manifest (2–3 min)

Write `manifest.yaml` into the pipeline folder: feature, created, source doc
+ pinned revision, entry point, **mode + mode_source + mode_rationale**,
**auto block** (enabled, stop policy, routing), contract doc path (planned
or actual), package slug convention, evidence root convention, bead label
convention, handoff inventory with status (generated/pending/stage-owned),
env facts.

**Registry bootstrap (fabric rule 7 — executed HERE, not just declared):**
if `test-packages/SURFACES.md` lacks rows for the touched surfaces (or does
not exist), CREATE/append them now from Phase 1's `surface_resolutions` —
one row per surface (surface_id · owner · owning package · path-glob roots
· member/legacy packages · regression-view budget), per research §7.2's
carve. Additive only — never rewrite existing rows (they may carry another
pipeline's health notes). This is the one file outside the pipeline folder
this skill writes.

## Phase 3 — Generate Handoffs (30–60 min)

For each handoff from the entry point onward, use the FULL parameterized
template from `TEMPLATES.md` (mandatory — including its worked-example
sub-optimizations and per-template forward-enrichment steps). The anatomy
summary, for orientation only:

```markdown
# <Feature> — <NN> <Stage Name>

## First Action
Invoke the `<skill-name>` skill. (or: "No skill — this is the pass-2/audit
prompt; follow the missions below.")

## Your Mission
<2–3 sentences: what this stage produces, why it matters for THIS feature,
and the done-condition (from the stage table).>

## Source Documents (Read In This Order)
<READ FULLY / SKIM / REFERENCE annotations; exact paths; quality-bar doc
last with "match or exceed">

## Cardinal Rule: Zero Scope Drift
<the rule + this stage's specific scope gate (see per-stage table below)>

## Key Context From Research
<3–6 bullets of FEATURE-SPECIFIC findings from Phase 1: actual files, type
names, counts, readiness evidence. Never generic.>
{ENRICHMENT: marker for data from prior stages where applicable}

## Step-by-Step Workflow
<numbered: Step 0 read sources → Step 1 invoke skill with exact inputs →
Step 2 feature-specific guidance (from research) → Step 3 verify output
(stage's done-condition as checkboxes) → Step 4 scope gate>

## Follow-Up Pass (Sub-Optimization)   ← ABSOLUTE FINAL SECTION, copyable
<see Sub-Optimization Authoring Rules below>
```

### Handoff inventory + per-stage scope gates + sub-opt focus

| File | Invokes | Blocking scope gate | Sub-opt focus (feature-specific questions you WRITE) |
| --- | --- | --- | --- |
| 01-hardening-revision | research-hardening | readiness bar honest (no WEAK hidden as PASS) | "Open <file from subagent 2> — does the doc's claim about X hold? Were the N weakest bar items from the pre-scan actually addressed? Re-grep the revision header — is every correction listed?" |
| 02-contract-create | research-to-contract | every in-scope clause in crosswalk; zero restatement | "Re-derive 5 random clauses from research §<real sections> without the crosswalk — do they appear? Pick scenario step N — grounding triple complete (command/citation/artifact)? Does the topology match the surfaces at <real paths>? Does the tool-to-medium matrix cover the <specific medium subagent 1 found, e.g. a UI deliverable>?" |
| 03-contract-validate | none (fresh-eyes pass 2) | the seven checks, all blocking | "Re-read your own findings: did fixes introduce restatement? Is every Class 1 log line written? Did the inventory diff use the research doc directly?" |
| 04-uvp-transcribe | contract-to-uvp | transcription fidelity checklist; **the stage-0 surface decision EXECUTED** (AMEND: delta appended to the surface pkg + unit view + minor bump + lineage publish + ONE instantiate; MINT only per the decision record); **DELTA-view all-red proven (H1)**; carryover audit read + reconciled (D22) | "Diff the contract suite table vs TESTS.md suites — row-for-row. Re-run validate. Does every new suite carry a `family:` tag + unit-namespaced id? Is `lineage.previous_digest` the current published digest? Is the unit view's greenlight never-run? Does the carryover audit's reset list reconcile against the ancestor's suite-file stale set — any UNEXPLAINED reset? Are BOTH docs in path_globs? Did any checklist item wording drift from the scenario?" |
| 05-beads-create | contract-to-beads | two-sided coverage 100%; matrix invariants | "Check the changed graph: does <real suite id> have a turns-green owner? `br dep cycles` empty? Does `bv --robot-plan` match the actual capability topology? Is the gate bead `--type task`? Repeat review only for unresolved evidence or a changed input." |
| 06-beads-audit | contract-bead-audit | verdict READY/FIXED-READY; **W1 guards: a bead minting a parallel package over an owned surface = BLOCKING violation; closing lint diffs the planned touch-paths against SURFACES.md path-glob roots (under-declared surfaces = the predicted adjacency-rule evasion)** | "Re-read your fixes — did they preserve verbatim embeds? Re-run the mechanical preflight after fixes. Is the report's reasoning section honest about check 5? Does every touched surface from the resolution records have its AMEND/MINT reflected in the graph — no orphan surface, no unsanctioned new package?" |
| 07-execution-prep | contract-to-execution | kickoff self-contained, zero unfilled placeholders, real ids | "Can a fresh agent boot, claim, and run with the named inputs? Are epic/instance ids real? Are targeted reruns, evidence-triggered reflection and affected-artifact reconciliation executable? Is the tool-to-medium matrix embedded?" |

### Handoff quality rules (all mandatory)

- Exact skill name in First Action, or an explicit "no skill".
- Numbered workflow — never "context + invoke skill".
- Every source doc annotated READ/SKIM/REFERENCE with exact paths.
- Ground each follow-up in the actual files and unresolved questions needed to
  assess this change. No minimum question/reference count or empty review round.
- Zero "TODO"/bare placeholders; `{ENRICHMENT: ...}` markers must describe
  what will fill them AND how the handoff works without it.
- Each handoff restates only the laws it needs; the full block lives in the
  stage skill it invokes.
- The sub-optimization is the ABSOLUTE FINAL section — nothing after it, so
  it can be copy-pasted as the follow-up message (uvp-goal convention).
- RE-RUN SAFETY: when the pipeline folder already exists, NEVER overwrite
  stage-owned files (`07-execution-kickoff.md`, `08-execution-push.md`,
  `10-completion-sweep.md`, audit reports, proof matrices) and never clobber
  already-filled `{ENRICHMENT}` markers — diff each existing handoff before
  writing, and regenerate only what is stale or missing.

## Sub-Optimization Authoring Rules (the heart of this skill)

The sub-optimization is a feature-specific follow-up available in the same
session when unresolved evidence or changed inputs justify another pass. A
checked no-change result may stop; the prompt is not a mandatory extra round:

1. **Grounded**: reference the relevant actual files/sections/ids from Phase 1
   research — "Open `crates/swarm-services/src/work/projection.rs` — does
   your replay section follow this rebuild pattern?" not "verify quality".
2. **Falsifiable**: every question answerable only by re-reading the
   artifact or the codebase — counts, ids, row-diffs, command outputs. No
   "does it look good?".
3. **Stage-sharp**: target the stage's characteristic failure mode —
   hardening: unverified claims stated as fact; contract: restatement +
   orphan clauses + ungrounded scenario steps; transcription: silent
   weakening; beads: paraphrase + class/AC mismatch; execution prep:
   unfilled ids and non-self-contained kickoff.
4. **Scope-scanning**: always include the red-flag language scan + "
   enumerate features → verify presence" coverage check.
5. **Honest exit**: end with "if findings were zero on a large artifact, say
   that explicitly and state what you checked — silence is not a pass."
6. Directive header: `ULTRATHINK and be meticulous`, and instructions to
   apply fixes immediately (Class 1 log lines where the contract is
   touched), not to file them away.

## Phase 3.5 — Forward Enrichment Protocol

Enrichment is executed BY THE SESSION THAT JUST FINISHED A STAGE, as that
handoff's final workflow step — not as a manual between-batch chore. The
finishing session has the richest context about what it produced; spending
its last five minutes updating the named `{ENRICHMENT:...}` markers in
LATER handoffs is the cheapest context transfer in the pipeline. Three
layers make this robust:

1. **Generated handoffs** (your output) each end their workflow with a
   FORWARD ENRICHMENT step naming exactly which later files + markers to
   fill (the marker map lives in TEMPLATES.md).
2. **Stage skills** carry the general rule in their hand-off phases (they
   already refresh their OWN prompts + `00-pipeline-guide.md`; forward
   enrichment extends one hop further).
3. **EXECUTION-GUIDE.md** instructs each session to VERIFY the markers it
   depends on were filled by the previous session before starting — the
   safety net, not the mechanism.

Exception (by design): `07-execution-kickoff.md` / `08` / `09` are created
BORN-ENRICHED by contract-to-execution with real runtime ids and are never
forward-patched — execution runs independently later, and its prompts must
be complete at generation time.

Per-unit handling: units are unknown until stage 2; 04/05/06/07-prep are
generated unit-parameterized with `{ENRICHMENT:unit-map}`. They stay SINGLE
FILES — never duplicated per unit. Each is re-run once per unit in a fresh
session; "current unit" = the next pending unit per `00-pipeline-guide.md`'s
stage table (operator may name a unit explicitly for parallel units), and
per-unit runtime ids (instance, epics, matrix, verdict) are read from that
table — the guide is the cursor, the prompts are reusable. This keeps the
folder at ~10 files regardless of unit count.

## Phase 4 — Execution Guide + Report

`EXECUTION-GUIDE.md`: session-by-session run order (one handoff = one fresh
session; 03 and 06 MUST be fresh sessions, cross-model encouraged); the
per-unit loop (04 → 05 → 06 → 07-prep → swarm runs → gate fix-loop →
greenlight → next unit); enrichment steps between sessions; the DECISION
CHECKPOINTS after 03 and 06 — **autonomous by default** (the finishing
session or a designated top-tier reviewer adjudicates pending decisions
with recorded rationale + retro-review flag and proceeds; the owner reads
retrospectively); pause for a human ONLY on external-dependency blocks or
when the owner explicitly requested review stops; everything inside
execution (fix loops, amendments) is agent-autonomous by design;
10-completion-sweep after the final/SPINE unit greenlights.

Report to user: entry point, **mode + rationale**, handoffs generated
(list), research stats (files studied, claims collected, readiness pre-scan
result), manifest + guide paths, literal next action ("open a fresh
session, paste <first-handoff>" — or, in auto mode, "entering auto-pilot;
first stop at <stop>").

## Auto Mode (Phase 5 — explicit opt-in, available controller)

Auto mode executes the generated chain end-to-end by orchestrating fresh
agents. Three preconditions, all hard:

1. **Explicit opt-in.** Run it ONLY when the user's invocation requests it
   ("auto mode", "autopilot", "run it end to end"). Never inferred, never
   default, never suggested-then-assumed.
2. **A verified execution adapter.** The current harness, NTM or a local/SSH
   controller must be able to launch, observe and checkpoint owned work. Consume
   `uvp-fleet` for live model/account selection, ownership, source and capacity
   checks. If a required capability is absent, name that limit; do not infer it
   from the harness brand. Machine work remains in its dedicated qualified lane.
3. **Required artifacts first.** Prepare the current outcome's executable inputs
   and handoffs, with explicit prerequisites for later work and a durable
   `AUTO-PILOT.md` checkpoint. A human can take over at any boundary. Do not
   invent settled later decisions merely to fill a folder before the first demo.

**Control-plane rule: keep orchestration separate from stage work.** Dispatch a
bounded handoff to an owned, qualified agent; preserve healthy conversations and
children during continuation. Use an independent fresh context for a required
contract/bead audit. Execute an additional follow-up only when its unresolved
question or changed input warrants it. Stage numbers identify artifact roles;
they do not create ordinal dependencies between units.

**Stage loop:** spawn the stage agent → on completion, verify the stage's
done-condition YOURSELF against the artifact (read the guide's stage row,
spot-check the output — never advance on the agent's summary alone) →
**verify the artifact is COMMITTED, not merely written** → verify forward
enrichment landed → append the AUTO-PILOT log line → **DISK CHECK** → next
stage. On failure, classify the actual cause and retain the checkpoint. Retry
only when a specific recovery or new input can change the result, within the
declared budget. Repetition without information triggers affected-scope
reconciliation immediately; it is not permission to replay an unknown outcome.

> **The commit check is not pedantry.** If you tell stages "the orchestrator
> owns git" (a reasonable rule — it prevents lanes committing each other's
> half-work), then YOU must actually commit their output, and a forgotten
> `git add` becomes a silent time-bomb. Real incident: the pipeline's own UVP
> package sat UNTRACKED for two whole units — every clean-worktree build
> silently failed on it, and the cause surfaced only when a lane rebuilt the
> daemon from a clean worktree three hours later. `git status --short <path>`
> costs nothing; an uncommitted artifact costs a debugging session and a wrong
> theory. Check it every stage.

**Resource checks follow the workload.** Before a heavy run, inspect live disk,
memory and active build-root ownership, and compare the expected peak with the
configured host reserves. Reuse compatible durable checkout/build/cache roots;
a new worktree is not the default budget unit. Recheck on workload changes or
observed pressure. A watcher is justified by sustained growth or overlapping
builds, not by the mere existence of an implementation stage; select its runner
from current registry/qualification and keep observation foreground-bounded.
At close, retain the roots and evidence still needed by any consumer. Unit
completion, an expired claim or a moved daemon does not prove a root disposable.

Inspect pressure and report reclaim candidates; deletion follows the repository's
explicit-permission rule. Route inspection through the available qualified
operations lane. Corollary duty for every pipeline: **declare load-bearing
paths at creation** in `<repo>/.disk-protect` (daemon data dirs, fixtures,
build worktrees, uncommitted evidence) — that declaration is what makes
ownership review possible. An undeclared artifact is not permission to delete it.
Stage 3/6 prompts must carry this duty (see TEMPLATES).

**Orchestration substrate:** preserve judgment at stage transitions and a durable
checkpoint for steering and resume. Consume `uvp-fleet` from the available
controller: NTM, a local/SSH process adapter, or the current agent harness.
Use that adapter's messages/events where supported and bounded foreground
observation otherwise. Claude Agent/SendMessage/Workflow primitives are optional
adapters, not portable requirements. Enumerated independent work may fan out;
each launch still consumes current ownership, reservations and capacity.
NTM/vibing and janitor helpers are optional operator references. Their absence
does not prevent the installed fleet utility, current harness or local/SSH
adapter from observing owned processes and checking `df`, memory and build-root
use. Require the actual execution capability, not a particular helper package.

**Model routing — consume current policy at dispatch.**

Use `docs/plan-hub/shared/MODELS.md` with `uvp-fleet` (portable source:
`scripts/dev/uvp-fleet.py`; inspect live `--help`). Scores are editable
preferences, not benchmark facts. Apply availability, harness/model support,
task capabilities, resource limits, source identity and live claim/reservation
gates before scoring. Pass the chosen model and supported effort to the runner
and record what actually ran; a model column alone is not dispatch.

All delegation uses this rule: native children, reviews, research, CLI agents,
NTM panes and remote lanes. Compare the eligible registry pool across providers;
the current app's child-model menu is only one adapter's capability list. If the
chosen provider needs a qualified CLI/CAAM route, use it. Native inheritance is
valid only when its actual model/effort is the selected eligible choice. Record a
brief task-fit reason and meaningful exclusions in the existing dispatch note;
do not impose provider quotas or reassign healthy work for cosmetic diversity.
Inspect configured model lists and current account qualifications: `available: yes`
alone does not enable a route. Repair a stale authorized route when practical,
otherwise name the limitation and choose from the genuinely eligible set.

Effort is executable registry policy: explicit task `effort`, then the selected
`task_type` recommendation, then the model's `default_effort`, restricted by
`allowed_efforts` and verified provider support. Choose the task type from the
current table; this applies to Sol and the other Codex models as well as Astra.
Read `effort` and `effort_source` from placement and receipts. The fleet adds the
provider effort flag to new and resumed launches; remove conflicting fixed flags
from harness argv. Other dispatch adapters must pass the same resolved policy
explicitly and record it. Existing running turns keep their current settings.
Max requires `effort_reason` for an exceptional architecture/design/reasoning
decision and must be allowed for the selected model; it is not routine escalation.

Use `fleet-accounts` for CAAM account policy. Isolated enrollment, production
qualification and explicit project-data/model authorization are separate gates.
Bounded eligible-account selection/rotation is enabled by default, with an
explicit disable, attempt limit and cooldown policy. Distinguish usage exhaustion,
authentication failure and missing model access. A failure after dispatch keeps
its conversation and healthy children: checkpoint the outcome and resume only
when prior results and replay safety are known. Never blindly replay a mutation.

Keep second-machine operations in a dedicated qualified lane under repository
policy. NTM, local processes and SSH are adapters; none defines workflow identity.

**THE INDEPENDENCE RULE — an author may not drive the proof of their own fix.** The tier is only
half of trust; the other half is *who drives the drive*. A session that just wrote a fix has a
motive and a blind spot: it knows the shape it built, so it drives THAT shape, and the drive
passes. Whenever a fix's proof is a **checklist re-earn, a gate item, or an unblocking green**,
the drive belongs to a **clean-context session that did not write the code** — cheap next to a
false green, and it is the ONLY control that catches "the drive proves the implementation instead
of the claim." Corollaries:
- **Vacuity test belongs to the independent party**: stub/delete the new code path on a scratch
  copy and re-drive. If the item still passes, the item is vacuous — the strongest single attack
  available, and an author will not think to aim it at themselves.
- **Fail-open is a false-green machine.** Any resolver that falls back to the old value on error
  can green an item that would ALSO green with the resolver removed. Demand the vacuity test
  wherever fail-open exists.
- **"Evidence" that is prose is not evidence.** Grep the artifact for the actual payload; a
  green whose artifact carries catalog rows and narration proves only that someone wrote a file.
- If independence was genuinely impossible, that is a **disclosure, not a footnote** — record it
  in the verdict and dispatch the clean-context check before the green is spent downstream.

> **Real incident (2026-07-15, D15).** U1's gate closed GREEN on "metadata overlay resolves from
> the lineage head." No read path existed *at all* — the projector read the frozen artifact, and
> the proof artifact held prose, not payload. Blame landed on the gate's OWN closing commit. It
> surfaced only when a substrate wipe forced an independent re-earn months of work later. The
> author-drives-own-proof shape is what let it through; assume it will do so again.

| Work | Registry preferences after hard eligibility checks |
| --- | --- |
| Architecture, investigation, conflicting evidence | reasoning, thoughtfulness, orchestration and relevant domain capability |
| Defined implementation and targeted repair | required capabilities, speed and cost efficiency |
| Visual/3D product judgment | visual/3D and review capability; inspect real evidence |
| Independent acceptance review | review capability and independence from the author |

The qualified orchestrator makes ordinary scope and scheduling decisions directly.
Delegate bounded independent work where it improves progress, and keep required
independent review separate from authorship. Do not create a review lane merely
because a model-specific routing table once prescribed one.

**Availability changes:** read current registry/account state again and record
the eligible substitution and actual runner. If no eligible candidate remains,
report the blocked frontier without weakening qualification or authorizing an
unrecorded model/account substitution.

**Stops under auto (owner directive 2026-07-14, reaffirmed 2026-07-16: AUTONOMOUS BY DEFAULT, RUN TO FULL COMPLETION):**
- ⛔ **"Auto mode" means run until EVERY unit is shipped — not until the next milestone.** A unit
  greenlight is a checkpoint to RECORD and cross, never a place to stop and ask "continue?". The
  standing approval covers the whole pipeline (U0→SPINE→completion-sweep), so **advance the unit
  boundary and open the next unit's work in the same motion.** Do NOT call `AskUserQuestion` at a
  unit boundary, after a gate closes, or "to confirm before the next big run" — the owner has
  explicitly, repeatedly stated that asking at boundaries is the bottleneck being removed. Asking
  when the directive already answers is the "re-litigate a settled decision" failure. The ONLY
  things that halt the run are the two HARD STOP classes below; everything else proceeds.
- There are NO approval or review stops. The pipeline runs end-to-end.
  Decisions that source docs mark owner-gated (⛔ Q-items), Class-2
  amendments, CORE-PAUSE checkpoints, and mode de-escalations are
  **DELEGATED to the orchestrator**: adjudicate at top tier with recorded
  rationale (AUTO-PILOT log + the artifact's own decision/amendment log),
  flag `retro-review` for the owner's later reading, and PROCEED. Prefer
  the source doc's recorded recommendation; deviate only with written
  reasoning. Never manufacture an approval gate the owner didn't ask for.
- HARD STOPS exist for exactly two classes:
  1. **External-dependency blocks** — something only a human can provide:
     service signups / API keys / credentials, purchases, connecting
     hardware or another machine, granting OS-level permissions.
  2. **Unrecoverable blockage** — a stage failed twice, a gate valve
     stalled, or a unit looped 3 boundary attempts, AND a top-tier recovery
     attempt (re-plan, re-scope, alternate approach, JIT fix path) ALSO
     failed. Stop with a precise handback.
- The user may opt IN to review stops by requesting them in the invocation
  ("run with a review stop at the contract"); record the requested stops in
  AUTO-PILOT.md and honor exactly those.

**Execution orchestration (stage 6) — the fleet is a FUNCTION of the bead
graph, not a guess.** The bead graph IS the schedule. At any instant the
claimable frontier (`br ready --limit 0 --label-any <unit-label> --type task`,
then `jq '[.[]|select(.status=="open")]'`) has a width; that width is the hard
upper bound on useful parallelism. **⛔ Scope by LABEL, never `--parent`: JIT
fix beads get fresh ROOT ids, often `parent=NONE` and even `labels:null` in
JSON despite prose labels, and `br ready --parent` is STRUCTURALLY BLIND to
them — exactly at gate time when the fix-loop files them. `br dep list <gate>`
is the authoritative blocker list; `br dep tree`/`br show --json .blocked_by`
do NOT show them (verified live 2026-07-16, three distinct holes).** Staffing under it
leaks throughput (beads sit unowned while one lane grinds); staffing over it
produces idle agents that invent work. **Never fix N once — compute it, and
recompute every time the graph moves.**

**Read the `fleet-controller` skill — it owns this math, in four phases.**
07-prep authors a per-step **fleet plan** (`<unit>-fleet-plan.md`, beside the
proof matrix) — a forecast, not a promise. You STAFF step 1 from it. Then ONE
resident fleet-controller (cheap tier) runs ALONGSIDE the swarm exactly like
the resident janitor: every ~10 min it diffs the plan against the LIVE
frontier + reservations + lane roster, **patches the plan** (a CORRECTIONS
log that makes the next unit's forecast accurate), and RECOMMENDS widen/narrow.
**You own spawn/retire.** It also FOLDS IN JIT beads — the fix-loop widening
that nobody can forecast, arriving exactly when the fleet has drained to one
gate driver. The summary below is the contract between you and it.

**⚠ `br ready` is an UPPER BOUND, not a promise, and NO up-front number
survives contact.** The graph encodes LOGICAL dependencies (B needs A's
output). It cannot encode RESOURCE dependencies — and those are the hidden
serial bottlenecks that make a "2-wide" frontier actually 1-wide:

| Conflict | Effect | Handling |
| --- | --- | --- |
| **Shared FILE scope** | **HARD serial.** File reservations are EXCLUSIVE — an agent holds the file or it does not work. Two ready beads both editing `service.rs` are serial no matter what the graph says | They occupy **ONE** slot, not two |
| Shared CRATE, disjoint files | **Soft contention.** Both progress; builds convoy on the cargo lock | Tolerate ~2–3; beyond that it is negative-yield |

So compute the target by **greedy critical-path selection with file-disjointness**:

```
frontier = br ready --limit 0 --parent <unit-epic> --recursive --type task
selected = []
for bead in frontier ORDERED BY transitive-dependent-count DESC:   # critical path first
    if files(bead) ∩ ⋃ files(selected) == ∅:                       # no reservation clash
        selected += bead
target = min(|selected|, user_cap, available_resource_slots)        # live capacity and contention
```

- `files(bead)` — **live agent-mail reservations are the TRUTH**; the bead's
  declared `Files:` is only a pre-work HINT (files get created ad hoc as the
  plan unfolds, so a clean declaration proves nothing). Use the declaration
  for the INITIAL guess only — before lanes run there is no live data — then
  observe. This is why sizing is **just-in-time and resident**, not planned.
- **Staff for the next useful outcome.** Prefer work that unlocks real
  capabilities or delivers the promised early demo/uncertainty reduction.
  Compare dependency impact, feedback delay, cost and available resources;
  transitive-dependent count alone does not determine priority.
- **BIAS LOW — the costs are asymmetric.** Under-staffing costs one widening
  report (a lane tells you in seconds). Over-staffing costs a wasted spawn,
  a lane that immediately parks on a reservation it cannot take, and
  reservation/lock churn for the lanes that *are* working. When the file
  scopes are unclear, staff fewer and let the sensors widen you.

**Runtime correction — make the graph LEARN.** A lane that cannot take a
reservation has discovered placement contention. It PARKS
(claim held) and reports `HIDDEN SERIAL: <bead> blocked on <files> held by
<peer>`. The orchestrator narrows scopes or reschedules the conflicting edits.
Add a `br dep` edge only for an actual consumed capability, not temporary file
contention. Record recurring contention in the placement plan.
- **Lanes report events; the controller verifies liveness.** The kickoff requires:
  after every `br close`, re-read the frontier; if it is wider than the active
  lane count, notify the current controller (WIDENING + the ready ids); if it
  is empty, STOP per the empty-queue rule. Fleet control becomes event-driven
  and free.
- **Narrowing is self-service — NEVER kill a lane.** Empty-queue=STOP drains
  the fleet at sequential bottlenecks by itself. A lane that finds a SOFT
  dependency the graph did not encode (its bead needs a peer's in-flight code)
  parks its claim and stops cleanly. `br ready` can still list that claim;
  the frontier must filter actual status, assignee and reservations before
  staffing it. **The graph records capability dependencies; the
  lanes are the ground truth**, and the math self-corrects when they disagree.
- **Widening — consider valid continuation before spawning.** A parked lane may
  retain useful context. Recheck its conversation/checkpoint, outcome, account
  qualification and live ownership/reservations; resume through the current
  adapter only when those inputs support continuation. Do not assume leases or
  account access survived a pause.
- **Caps for multi-pipeline / subscription budgets**: bind an explicit owner
  limit to the actual controller/fleet configuration used for admission. Share
  physical worker capacity across products and honor current resource reserves.
  Gate drivers, reviewers and optional watchers consume capacity too; none is
  automatically outside the cap. Absent a requested limit, use measured capacity
  and useful eligible work rather than a decorative cap file or a forced spawn.

Fleet rules — all hard-won, all mandatory:
1. YOU own monitoring. Observe owned processes, receipts, claims and reservations
   through the current adapter; `uvp-fleet probe` and `reconcile` provide portable
   observations. Use bounded foreground waits while work is in flight. Optional
   host Monitors do not keep a turn alive. Kick idle agents through the adapter.
   **Expect to kick** — a lane going dark is
   the NORM, not misconduct (see rule 2's correction). Budget for it.
2. **⛔ CORRECTED 2026-07-16 — this rule used to read "kill + relaunch any agent
   degenerated into polling loops; put an explicit anti-polling rule in the
   relaunch prompt." That was BACKWARDS and it killed lanes for doing the right
   thing.** FOREGROUND POLLING IS THE ONLY CORRECT WAIT — a turn ends when an
   agent stops calling tools, and **nothing holds it open**: not a monitor, not
   a subagent, not a tracked `run_in_background` job (measured: a lane's
   completion fired while its Codex was still running). The old anti-polling
   rule is precisely what pushed agents into background waits, and 12 died.
   **The real distinction is WORK, not polling:**
   - polling **with work in flight** (a live codex/build proc, an output file
     still unwritten) = CORRECT. Leave it alone. LONG ≠ DEAD.
   - polling **with nothing running** = genuinely degenerate → kick, don't kill.
   **Kick before you kill, always.** A false kick costs one sentence; a false
   kill destroys in-flight work and orphans a reservation. Verify by looking for
   the WORK (processes, output files, commits) — never by wall-clock silence.
3. Consolidate tails into ONE closer agent — parallel stragglers create
   cargo-lock convoys.
4. Machine-wide CPU is meaningless as a progress signal; trace actual
   commits/bead-closes.
5. Mandatory push after bead commits (repo policy — never "do not push").
6. **Disk is a shared finite resource.** Check headroom before heavy work against
   the workload estimate and configured host reserves. Reuse suitable existing
   roots, declare new load-bearing paths, and request a bounded resource review
   when pressure warrants it. Registry release conditions do not authorize
   deletion or invalidate another consumer's retained proof.

Queue drained → gate fix-loop runs to TRUTHFUL greenlight (top-tier gate
driver; the valve stops the run, never loosens the gate). **Unit gates are
VIEW-SCOPED on the PINNED instance**: `greenlight(pinned instance,
view=unit:<epic>-u<N>, require_earned)` — earned green only, never
inherited (H3); the unit never waits on foreign suites. → fresh agent on
09-next-unit (stub graduation routes to top tier) → loop to the next unit.
Units run in parallel ONLY where the contract topology declares them
parallel. **SPINE close additionally evaluates the W5 adjacency prereq** —
`greenlight(surface, view=regression)` against the surface's lineage head
for every touched surface (ADVISORY until Phase 2: a red mints an
owner-routed work item and is recorded; the close proceeds). A surface not
yet folded into a fabric package satisfies it Phase-0-style: re-run its
registry manifest rows on their ORIGINAL instances — never re-instantiate
(W5/W4). After the
final/SPINE greenlight → fresh agent on 10-completion-sweep, whose job is
now **TRIAGE + HANDBACK, not just wrap-up** (W3): per-suite
KEEP/SOAK/RETIRE verdicts (runbook-required lint; no dangling view refs;
red-suite retires escalate per D9), view + registry updates, the fold-in
ratio (suites amended into surface packages ÷ suites authored — the
durability success metric), the W1 closing lint (diff the executed diffs'
paths against SURFACES.md path-glob roots vs the declared surface touches —
an under-declared surface is the predicted adjacency-rule evasion), and the
surface package handed back to its OWNER with a health note. Operating-loop features terminate at **GA +
readiness pending** (W6), with readiness units later authored as
`operational`-family amendments to the SAME surface package — never a
parallel namespace. → report **SHIPPED** with the sweep verdict + evidence
pointers.

**Global valves (in addition to the per-gate valve):** a stage failing
twice, a unit consuming 3 boundary attempts, or a stalled gate valve first
triggers a **top-tier recovery attempt** (re-plan the stage, re-scope the
unit, route a JIT fix — the orchestrator's out-of-the-box role); only if
recovery also fails does the run STOP. Auto mode's exit is always one of
exactly two shapes: SHIPPED (sweep verdict attached) or a precise handback
("blocked on <external dependency / unrecovered stall>, resume at <prompt>,
here's the state"). Silent stalls are forbidden — if you are waiting, say
what for.

## When NOT To Use

- Executing any stage yourself → invoke that stage's skill directly;
  contractmaxxer generates the chain (and, ONLY in explicitly-requested
  auto mode, orchestrates fresh agents through it — it still never does
  stage work in its own context).
- Legacy 3-SOT pipeline work → pipemaxxer.
- A single missing prompt mid-pipeline → the owning stage skill regenerates
  it; don't re-run the whole orchestrator (re-running IS safe for a full
  refresh — it must detect and preserve stage-owned files).

## Final Response Shape

Entry point + detection evidence · mode (+ source + rationale) · handoffs
generated (paths) · feature-context stats (files/types/claims/readiness) ·
manifest + EXECUTION-GUIDE paths · enrichment plan summary · literal next
action — or, in auto mode, the AUTO-PILOT config summary (routing, stop
policy, caps) followed by live orchestration with stop/exit reporting per
the Auto Mode section.
