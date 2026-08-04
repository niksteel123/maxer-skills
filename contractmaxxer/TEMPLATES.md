# Contractmaxxer — Handoff Templates

> Parameterized templates, not copy-paste. Contractmaxxer fills `{placeholders}`
> from Phase 1 research. The Follow-Up Pass (sub-optimization) in each handoff
> is WRITTEN per-feature — the `WORKED EXAMPLE` blocks below show the required
> quality bar (Cortex-flavored; replace content, match depth). Every handoff
> ends with its Follow-Up Pass as the ABSOLUTE FINAL section (copyable).
>
> FORWARD ENRICHMENT is built into every template's workflow: the session that
> completes a stage updates the named `{ENRICHMENT:...}` markers in LATER
> handoffs before ending. A handoff must work without enrichment (point at the
> artifact directly) and improve with it.

Enrichment marker map (who fills what, when):

| Stage completes | Updates markers in | Markers |
| --- | --- | --- |
| 01 hardening | 02, 03 | `{ENRICHMENT:revision-pin}`, `{ENRICHMENT:readiness-notes}` |
| 02 contract pass 1 | 04, 05, 06, 07-prep | `{ENRICHMENT:unit-map}`, `{ENRICHMENT:package-spec-summary}`, `{ENRICHMENT:scenario-stats}` |
| 03 contract validate | 04 | `{ENRICHMENT:validation-outcome}` |
| 04 uvp transcribe | 05, 06, 07-prep | `{ENRICHMENT:package-instance}`, `{ENRICHMENT:suite-list}` |
| 05 beads create | 06, 07-prep | `{ENRICHMENT:epic-ids}`, `{ENRICHMENT:matrix-path}`, `{ENRICHMENT:bead-counts}` (stage 4 skill usually rewrites 06 fully — verify, then top up) |
| 06 beads audit | 07-prep | `{ENRICHMENT:audit-verdict}` |
| 07-prep / stage 6 | — terminal | 07/08/10 are BORN enriched by contract-to-execution |

---

## Template: 01 HARDENING Handoff

```markdown
# {Feature} — 01 Research Hardening (revision {next_rev})

## First Action
Invoke the `research-hardening` skill.

## Your Mission
Run ONE stamped hardening revision of `{research_doc}` (currently {rev_pin}).
The readiness pre-scan found: {weakest_items_summary}. This invocation should
run passes {recommended_passes} against those gaps. Done when: the revision
is stamped and the scorecard delta is reported. The pipeline cannot proceed
to the contract pass until all 7 bar items PASS.

## Source Documents (Read In This Order)
1. `{research_doc}` — header + outline + the sections flagged below — READ
2. {repo_instructions} — conventions — SKIM
3. {quality_bar_research_doc} — the grounding-audit revision style to match — REFERENCE

## Scope Gate
Hardening adds/verifies TRUTH CLAIMS only. Zero operational scaffolding
(units/scenarios/UVP specs belong to stage 2). Zero silent rewrites — every
correction listed in the revision entry. No readiness item may be reported
PASS without evidence.

## Key Context From Research (pre-scan findings)
- Readiness pre-scan: {item-by-item PASS/WEAK/FAIL with one-line evidence}
- Codebase claims to spot-verify first: {3-5 reality claims from subagent 2,
  with file paths}
- External dependencies needing BOM treatment: {list from subagent 1}
- {feature-specific finding}

## Step-by-Step Workflow
1. Read sources above; confirm the doc is not being edited in a parallel
   session (coordinate or snapshot if it is).
2. Invoke `research-hardening`; direct it at passes {recommended_passes}
   targeting: {specific gaps}.
3. While it runs, verify these pre-scan claims yourself: {2-3 claims}.
4. Verify output: revision {next_rev} stamped with corrections listed;
   scorecard delta reported; `01-hardening-revision.md` refreshed.
5. FORWARD ENRICHMENT: open `02-contract-create.md` and
   `03-contract-validate.md`; replace `{ENRICHMENT:revision-pin}` with the
   new revision id and `{ENRICHMENT:readiness-notes}` with any remaining
   WEAK items + where they live. If the bar is now READY, say so in both.

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
{WRITTEN per-feature. Rules: ≥3 real file refs; falsifiable questions;
red-flag language scan; honest exit.}

WORKED EXAMPLE (quality bar):
> ULTRATHINK and be meticulous. Re-read the revision entry you just stamped.
> (1) Open `crates/swarm-services/src/method_registry/types.rs` — the doc
> claims a MethodGroup count; recount the enum variants. Does the stamped
> correction match? (2) The doc's §"Existing SwarmNet Reality" cites
> `work/projection.rs` as the replay pattern — open it; is `rebuild()`
> actually side-effect-free as claimed, or did you take the doc's word?
> (3) Re-grep the revision header: is EVERY correction you made this session
> listed there, including the small ones? (4) Scan your additions for
> hedge-language that should be decisions ("could/should/maybe" on
> load-bearing items). (5) If you found zero problems in a {N}k-line doc,
> state that explicitly and list exactly what you spot-checked. Apply fixes
> now, amend the revision entry, and update the scorecard.
```

---

## Template: 02 CONTRACT CREATE Handoff

```markdown
# {Feature} — 02 Execution Contract (Pass 1: Create)

## First Action
Invoke the `research-to-contract` skill.

## Your Mission
Author the companion execution contract for `{research_doc}`
({ENRICHMENT:revision-pin}) at `{contract_doc_path}` — unit map + execution
topology, pre-research maps, scenario suites, verification prerequisites,
UVP package specs, crosswalk, close gates, amendment protocol. This is the
highest drift-risk stage in the pipeline: requirements become proof
obligations here. Done when: pass-1 quality checklist clean and prompts
02/03 refreshed with real unit data.

## Source Documents (Read In This Order)
1. `{research_doc}` — READ FULLY (it is the canonical requirement set)
2. {readiness_notes} — {ENRICHMENT:readiness-notes} — REFERENCE
3. `docs/research/2026-05-31-apple-vm-performance-headless-sudo-roadmap-research.md`
   §Step-By-Step UVP Scenario + §Codebase Study Map — SKIM (scenario quality bar)
4. `docs/research/2026-05-22-shared-workspace-data-zone-situational-awareness.md`
   one group's pre-research + scenario suite + do-not-count-as-pass — SKIM
5. `.claude/skills/verify-authoring/SKILL.md` — schema your package specs
   must transcribe into — SKIM
6. {best_existing_contract} — quality bar — MATCH OR EXCEED

## Scope Gate (BLOCKING)
Citation, not restatement: zero normative sentences without a research
citation. Every in-scope clause appears in the crosswalk or its deferred
footer. Banned language scan before finishing: post-MVP / Phase 2+ /
stretch goal / nice to have / deferred / out of scope / simplified.

## Key Context From Research
- Expected unit structure (pre-stage guess): {expected_units from subagent 1}
- Codebase surfaces for the study maps: {8-12 key files + why, integration
  seams/wiring points, exists-vs-assumed deltas, test-harness precedents —
  from subagent 2}
- Reality claims to embed as claims-to-verify: {list}
- Proof media the scenarios must cover: {list incl. any UI/browser medium —
  name the deliverable that needs it}
- UVP landscape: {label conventions, daemon state, model packages}
- Surface resolutions (W1 — from subagent 3, one per touched surface):
  {surface → AMEND <owning pkg> | MINT <new surface>, regression budget,
  current health + disposition if unhealthy}. The contract's
  §UVP-package-spec MUST be written as a DELTA SPEC against the AMEND
  target (new suites w/ family tags + unit views + proposed regression-view
  additions/retirements/supersessions) — a fresh standalone package spec is
  correct ONLY for a MINT decision.

## Step-by-Step Workflow
1. Read sources in order. Run the entry gate (readiness bar) — STOP and
   route to 01 if any item FAILs.
2. Invoke `research-to-contract`. MODE DIRECTIVE ({mode}, from manifest —
   research-to-contract must respect this carve, not re-expand it):
   mini = ONE unit (rarely 2), authored IN FULL, no stubs, no SPINE;
   normal = 2–4 units, author the first {N} in full, stub the rest;
   max = 5+ units, stub+graduation discipline, a SPINE release unit. The
   package model is NOT a contract decision: the stage-0 surface resolution
   already made it (AMEND the owning surface package, per-unit `unit:`
   views; a standalone package ONLY for a MINT record) — the contract
   encodes that resolution, never re-opens it.
   Escalate the mode (with a guide log line) if unit discovery outgrows it —
   never silently exceed the carve.
3. Feature-specific guidance while authoring:
   - {e.g., "Phase 1's UI capsule inspector deliverable needs a browser
     medium row + checklist item — the pilot missed this"}
   - {e.g., "the doc's eval-fixtures phase is the prerequisite unit; wire
     the blocked-not-skipped rule"}
   - {2-3 more from research}
4. Verify output: all 11 sections per authored unit; scenario QA layers
   L1–L4 run; quality checklist clean; 02/03 prompts refreshed by the skill.
5. FORWARD ENRICHMENT: open 04/05/06/07-prep; fill `{ENRICHMENT:unit-map}`
   (unit ids + scopes + sequence), `{ENRICHMENT:package-spec-summary}`
   (package ids, suite counts by kind, evidence roots), and
   `{ENRICHMENT:scenario-stats}` (steps/negatives/do-not-count counts).
   Keep 04/05/06/07-prep as SINGLE unit-agnostic prompts (each is re-run
   per unit in a fresh session; current unit + its runtime ids come from
   00-pipeline-guide's stage table). Do NOT duplicate per-unit files.

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
{WRITTEN per-feature. ≥5 questions; ≥3 real refs.}

WORKED EXAMPLE (quality bar):
> ULTRATHINK and be meticulous. (1) WITHOUT opening your crosswalk, list
> from research §"Phase 1" the deliverables for the navigation slice — now
> diff against the crosswalk: any clause with no row and no deferred-footer
> owner? (2) Open scenario step {N} — does it carry the full grounding
> triple (product command from §Developer Commands, citation, named
> artifact)? Sample 5 more steps at random. (3) Your topology Track A
> clusters {surfaces} — open `{key_file}`: is the convergence point really
> after its feeders, or did you serialize two independent tracks? (4) The
> tool-to-medium matrix: research lists "{UI deliverable}" — which row
> covers it, and which checklist item? If none, that is the exact gap class
> the pilot hit — fix it now. (5) Scan the whole contract for normative
> sentences with no citation, and for banned scope language. (6) Count
> do-not-count-as-pass bullets per scenario — fewer than 6 means you don't
> yet understand the gaming surface; red-team harder. Apply all fixes, log
> Class 1 lines, re-run the quality checklist.
```

---

## Template: 03 CONTRACT VALIDATE Handoff (Pass 2 — fresh session)

```markdown
# {Feature} — 03 Contract Validation (Pass 2, FRESH session)

## First Action
No skill — you ARE the adversarial validation pass. Cross-model capable
(Claude / Codex / Gemini). Do not skip ahead; run the seven checks in order.

## Your Mission
Adversarially validate `{contract_doc_path}` against `{research_doc}`
({ENRICHMENT:revision-pin}). The contract's authors cannot see their own
blind spots — you can. Done when: all seven checks executed with findings
applied (Class 1 log lines) or routed (research gaps → stage 1).

## What To Read First
1. `{research_doc}` — the sections the contract's unit scope boundaries
   cite — READ (independently of the contract's summaries)
2. `{contract_doc_path}` — READ FULLY
3. `.claude/skills/verify-authoring/SKILL.md` — REFERENCE for check 4
4. `{model_package}/TESTS.md` — REFERENCE schema example

## The Seven Checks (all blocking)
1. INDEPENDENT INVENTORY DIFF — re-derive each unit's clause list from the
   research doc WITHOUT reading the crosswalk; diff. Misses = CRITICAL.
2. GROUNDING-TRIPLE AUDIT — sample ≥50% of scenario steps: real command /
   resolving citation / named artifact consumed by Required Evidence.
3. SCENARIO RED-TEAM — actively try to pass each scenario while violating
   research intent. Specific attack surfaces for THIS feature:
   {feature-specific attack list, e.g., "compiled briefs replaced by static
   markdown", "replay proven by cache re-read", "novice agent coached"}.
   Every successful attack → new negative assertion / do-not-count bullet.
4. UVP SCHEMA LINT — three valid suite pairs only; quoted semver;
   package-root-relative paths; non-empty scopes; canonical capabilities;
   both docs in path_globs. For AMEND resolutions the §UVP-package-spec
   must be a DELTA SPEC: family-tagged unit-namespaced suites, the
   `unit:<epic>-u<N>` view, lineage target = the surface pkg's current
   published digest, and D9 SUPERSEDE entries enumerated for any
   intentional behavior change (never exemption or triage-RETIRE).
5. TOPOLOGY SANITY — tracks match study-map surfaces ({real surfaces});
   convergence after feeders; burndown suites fast-tier.
6. MEDIUM-COVERAGE AUDIT — every proof medium implied by the requirement
   set has a tool row AND a checklist item. Known media for this feature:
   {list — including the easy-to-miss one research found}.
7. FIXTURE-REALISM — real subject ({real_subject}), real data,
   representative scale; no hollow-shell pass possible.

## Severity + Application
CRITICAL (underscoping, invented scope, gameable scenario) → fix now +
Class 1 log line; research-level gaps → record + route to stage 1, mark
affected items BLOCKED. Do not soften any contract item to close a finding
— that is Class 2 territory and needs research_basis.

## Forward Enrichment
Open `04-uvp-transcribe.md`; fill `{ENRICHMENT:validation-outcome}` —
findings count by severity, contract sections changed, anything stage 3
must re-read.

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
> ULTRATHINK. Re-read every fix you just applied. (1) Did any fix RESTATE
> research content instead of citing it? (2) Is every Class 1 log line
> written? (3) Re-run check 1 on the two units you fixed most — did your
> fixes close the misses? (4) Did the red-team additions land as testable
> assertions (evidence-named) or as prose wishes? (5) If your total
> findings were zero: state what you sampled, which attacks you attempted
> and why they failed — silence is not a pass.
```

---

## Template: 04 UVP TRANSCRIBE Handoff (per unit)

```markdown
# {Feature} — 04 UVP Package: {unit_id}

## First Action
Invoke the `contract-to-uvp` skill (which reads `verify-authoring` first).

## Your Mission
Execute unit {unit_id}'s package spec from `{contract_doc_path}` per the
stage-0 surface resolution — **AMEND `{surface_pkg}` in delta mode**
(reserve the pkg dir → append suites w/ family tags + the
`unit:{epic}-u{N}` view → minor version bump + `lineage.previous_digest` →
validate → publish → ONE instantiate, pin the new instance id) — or, ONLY
for a MINT decision, author the new surface package. Then prove the
**DELTA-VIEW all-red baseline** (H1: `greenlight(view=unit:…)` = never-run
on the pinned instance) and **read the carryover audit** `{carried, reset,
new}` — reconcile every reset against the ancestor's pre-existing
suite-file stale set (D22: file edits since the ancestor's instantiate
reset legitimately — SoT/doc-drift staleness does not predict resets;
anything unreconciled is a finding). Transcription is mechanical fidelity — zero
invention, zero softening. Done when: validate clean, publish+instantiate
clean, delta baseline recorded, carryover audit reconciled, fidelity
checklist all-green.

## Enriched Context (filled by earlier sessions; if still bare, read the
contract directly — this handoff works either way)
- Unit map + sequence: {ENRICHMENT:unit-map}
- Package spec summary (ids, suite counts, evidence root): {ENRICHMENT:package-spec-summary}
- Scenario stats (steps / negatives / do-not-count): {ENRICHMENT:scenario-stats}
- Pass-2 validation outcome: {ENRICHMENT:validation-outcome}

## Source Documents
1. `{contract_doc_path}` — unit {unit_id}: UVP Package Spec, Scenario
   Required Evidence + checklist wording, Verification Prerequisites,
   Crosswalk — READ
2. Research sections the unit's scope boundary cites — READ (for the
   derived package docs)
3. `test-packages/{surface_pkg}/TESTS.md` — the AMEND target: current
   suites, views, version, published digest (your `lineage.previous_digest`)
   — READ (AMEND decisions; skip only on MINT)
4. `test-packages/{model_package}/` — closest-shape package — SKIM
5. `test-packages/bootstrap/simple-verify/TESTS.md` — minimal canonical — REFERENCE

## Scope Gate (BLOCKING)
Row-for-row fidelity: every contract suite-table row → one suite entry +
file; every Required Evidence artifact → evidence_contract; checklist item
ids verbatim. Missing obligations are CONTRACT amendments (Class 1) — never
invented or dropped here. Both the research doc and contract doc MUST be in
path_globs (staleness coupling).

## Step-by-Step Workflow
1. Preflight: debug binaries built; `target/debug/agent-swarm verify --help`
   responds (else BLOCKED — never hand-validate YAML). Check `df -h .`; if the
   daemon/data dir you are about to create is load-bearing, DECLARE it in
   `<repo>/.disk-protect` the moment it exists (path | owner | why-unrebuildable |
   release-condition) — the `disk-janitor` contract that keeps cleanup autonomous.
2. Invoke `contract-to-uvp` for unit {unit_id}.
3. Feature-specific guidance: {e.g., "the contract fixes these test names —
   transcribe exactly: {2-3 names}"; "evidence root is {root}; the synthetic
   evidence.required_artifacts suite will enforce the full list"}.
4. Verify: validate ok/zero errors; publish records lineage; the ONE
   instantiate returns the pinned instance id; DELTA-view greenlight
   (`view=unit:{epic}-u{N}`) shows green:false, every NEW suite never-run,
   evidence.required_artifacts red — ANY pre-implementation green INSIDE
   the delta view = defect. OUTSIDE the delta view, carried/inherited
   greens (and carried stale) are EXPECTED (B1): read the carryover audit
   `{carried, reset, new}` and reconcile every reset per D22. MINT only:
   whole-package all-red never-run, zero stale reasons.
5. FORWARD ENRICHMENT: open 05/06/07-prep; fill
   `{ENRICHMENT:package-instance}` (slug + instance id + baseline summary)
   and `{ENRICHMENT:suite-list}` (suite ids by kind).

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
WORKED EXAMPLE (quality bar):
> ULTRATHINK. (1) Diff the contract's suite table against TESTS.md
> `suites:` — row for row, both directions. Name any drift. (2) Diff the
> scenario's Required Evidence list against `evidence_contract.
> required_artifacts` — count both. (3) Open one checklist suite file and
> the contract scenario side by side — did any item description get
> paraphrased? (4) grep path_globs for BOTH `{research_doc}` and
> `{contract_doc_path}` — present? (5) Re-read the DELTA-view greenlight:
> is anything INSIDE the unit view green or skipped that should be
> never-run red? Carried greens outside the view are expected (B1) — but
> does every carryover reset reconcile against the ancestor's suite-file
> stale set (D22)? (5b) Is `lineage.previous_digest` the surface pkg's
> current published digest, was there exactly ONE instantiate, and does
> every new suite carry a `family:` tag + unit-namespaced id? (6) Did
> transcription force any contract correction — and is its Class 1 line in
> the Amendment Log? Fix everything now and re-validate.
```

---

## Template: 05 BEADS CREATE Handoff (per unit)

```markdown
# {Feature} — 05 Beads: {unit_id}

## First Action
Invoke the `contract-to-beads` skill.

## Your Mission
Convert unit {unit_id} into an executable bead graph: clause inventory →
topology tracks → proof classes (contributes / turns-green / gate) →
five-question anatomy → proof assignment matrix → gate bead with fix loop
→ polish to steady state. Done when: two-sided coverage 100%, matrix
invariants hold, `br dep cycles` empty, robot-plan matches topology, polish
flatlined.

## Enriched Context (filled by earlier sessions; if still bare, read the
contract + TESTS.md directly — this handoff works either way)
- Unit map + sequence: {ENRICHMENT:unit-map}
- Package + instance (slug, instance id, baseline): {ENRICHMENT:package-instance}
- Suite ids by kind: {ENRICHMENT:suite-list}

## Source Documents
1. `{contract_doc_path}` — unit {unit_id} (all sections) — READ
2. Research sections in the unit's scope boundary — READ (verbatim embeds
   come from HERE, not from the contract)
3. `test-packages/{package_slug}/TESTS.md` — suite ids + labels — REFERENCE
4. {quality_bar_beads_note} — REFERENCE

## Scope Gate (BLOCKING)
Every in-scope clause → ≥1 bead with VERBATIM cited embeds. Every suite →
≥1 turns-green/gate owner. No contributes bead claims greening. Labels ⊇
work_unit_queries ({labels}). Zero scope-reduction language in any bead.
Gate bead is `--type task` with the full fix-loop embedded.

## Step-by-Step Workflow
1. Confirm prerequisites: delta published + instantiated, DELTA-view
   all-red baseline recorded, carryover audit reconciled (else run 04
   first); audit verdict from prior units if sequential.
2. Invoke `contract-to-beads` for unit {unit_id}.
3. Feature-specific guidance: {e.g., "tracks per the contract topology:
   {tracks}; the convergence beads own {suite ids}"; "Background sections:
   the WHY for this unit is {1-line intent from research}"}.
4. Verify: coverage gate two-sided 100%; matrix at {matrix_path}; cycles
   empty; `bv --robot-plan` diffed vs topology; polish rounds run to
   steady state; synced + pushed.
5. FORWARD ENRICHMENT: stage-4 skill writes 06 itself with real ids —
   VERIFY it did; then open 07-prep and fill `{ENRICHMENT:epic-ids}`,
   `{ENRICHMENT:matrix-path}`, `{ENRICHMENT:bead-counts}` (by class).

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
WORKED EXAMPLE (quality bar):
> ULTRATHINK. Run polish round 1 verbatim from the skill, then additionally:
> (1) Pick the two largest beads — is every research excerpt blockquoted
> with a § citation, or did paraphrase creep in? (2) Open the matrix: does
> `{real_suite_id}` have a turns-green owner that sits AFTER its feeders in
> `br dep tree`? (3) `br dep cycles` — empty? `bv --robot-plan` — do its
> tracks match {tracks}? If not, which dependency is false? (4) Read the
> gate bead end-to-end: fix loop verbatim? 5-stalled valve? tool-to-medium
> matrix? `--type task`? (5) grep all beads for banned scope language and
> for AC that a no-op implementation could satisfy. (6) Could agent #3 of 3
> implement bead {example_id} with ZERO other context? Fix everything via
> `br`, re-run the coverage gate, sync + push.
```

---

## Template: 06 BEADS AUDIT Handoff (per unit — FRESH session)

```markdown
# {Feature} — 06 Bead Audit: {unit_id} (FRESH session)

## First Action
Invoke the `contract-bead-audit` skill. You must NOT be the session that
created these beads. Cross-model encouraged.

## Your Mission
Find what the bead creators went blind to, before the swarm pays for it:
mechanical preflight (cycles, robot-plan vs topology, matrix, labels,
reference resolution, coverage re-diff) + five judgment checks. Done when:
verdict READY / FIXED-READY with the report written, or BLOCKED with exact
needs named.

## Enriched Context (filled by earlier sessions; if still bare, discover via
`00-pipeline-guide.md` — this handoff works either way)
- Root/unit epic ids: {ENRICHMENT:epic-ids}
- Proof-matrix path: {ENRICHMENT:matrix-path}
- Bead counts by class: {ENRICHMENT:bead-counts}
- Package + instance: {ENRICHMENT:package-instance}

## Source Documents
Start at `00-pipeline-guide.md` (it names every artifact). Then: contract
unit {unit_id} → research sections it cites → `test-packages/
{package_slug}/TESTS.md` → matrix at {matrix_path} → ALL beads
(`br list --json`, `br show` — every one, not a sample).

## Blocking Dimensions
Scope drift is the prime dimension: uncovered clause = CRITICAL; invented
scope = CRITICAL; scope-reduction language anywhere = CRITICAL. Plus:
proof-class sanity (no contributes bead claiming greening; gate bead
complete) and topology consistency. Plus the W1 surface guards (BLOCKING):
a bead minting a parallel package over an owned surface = CRITICAL; diff
the planned touch-paths against SURFACES.md path-glob roots vs the declared
surface resolutions — an under-declared surface is the predicted
adjacency-rule evasion; every AMEND/MINT record must be reflected in the
graph (no orphan surface, no unsanctioned new package).

## Workflow
1. Run the skill's Phase 0–1 mechanical preflight (including: was
   03-contract-validate actually run? record if not).
2. Run the five judgment checks; document reasoning even for "no change".
3. Apply fixes via `br`, single batched commit, sync + push.
4. Write `{unit_id}-bead-audit-report.md`; update `00-pipeline-guide.md`.
5. FORWARD ENRICHMENT: open `07-execution-prep.md`; fill
   `{ENRICHMENT:audit-verdict}` (verdict + findings summary + anything the
   execution prep must know).

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
> ULTRATHINK. (1) Re-read your fixes: did any edit weaken a verbatim embed
> or an AC? (2) Re-run `br dep cycles` and the matrix consistency check
> AFTER your fixes. (3) Your check-5 reasoning: did you actually consider
> an alternative decomposition, or rubber-stamp? Write one sentence on the
> best alternative and why it loses. (4) If verdict is READY with few
> findings, list exactly what you verified so READY is auditable, not
> vibes.
```

---

## Template: 07 EXECUTION PREP Handoff (per unit)

```markdown
# {Feature} — 07 Execution Prep: {unit_id}

## First Action
Invoke the `contract-to-execution` skill.

## Your Mission
Generate the real execution prompts for unit {unit_id}: `07-execution-
kickoff.md` (identical for N agents, fully self-contained, all policy
verbatim), `08-execution-push.md`, `10-completion-sweep.md`. These are the
documents the swarm actually uses — they are born enriched with real ids
and are NEVER forward-patched afterward. Done when: all three exist with
zero unfilled placeholders and the kickoff passes the agent-#3 test.

> RE-RUN PER UNIT. These three files are NOT carried forward between units —
> each unit re-runs THIS prep step, which OVERWRITES 07/08/10 with that
> unit's real ids (the prior unit is already greenlit, so its copy is
> disposable). The generated files MUST carry a "GENERATED FOR UNIT <X> —
> stale if the guide shows a later execution unit" banner (the
> contract-to-execution skill stamps it). If you arrive at a new unit's
> execution and the kickoff still names the previous unit, that is EXPECTED
> — re-run this prep step; the kickoff updates only by regeneration, never
> by auto-patch.

## Enriched Context (filled by earlier sessions; if still bare, discover via
`00-pipeline-guide.md` — this handoff works either way)
- Unit map: {ENRICHMENT:unit-map} · Package + instance: {ENRICHMENT:package-instance}
- Epic ids: {ENRICHMENT:epic-ids} · Matrix: {ENRICHMENT:matrix-path}
- Audit verdict: {ENRICHMENT:audit-verdict}

## Preconditions (verify, do not assume)
Audit verdict READY/FIXED-READY · package instance current (zero stale
reasons) · AgentMail reachable · evidence root convention confirmed.

## Source Documents
Contract unit {unit_id} (topology → agent count; Verification
Prerequisites → tool matrix; amendment protocol) — READ. Package TESTS.md
(instance id, labels, suites) — REFERENCE. Matrix + audit report —
REFERENCE. Quality bar: {best_existing_kickoff} — MATCH OR EXCEED,
especially the AgentMail + work-loop sections.

## Step-by-Step Workflow
1. Invoke `contract-to-execution`; it embeds: boot sequence, scoped ready
   queue, work loop with burndown close-notes, proof-class table, gate
   fix-loop + 5-stalled valve, JIT defect & scope policy, tool-to-medium
   matrix, non-negotiables incl. STALE-instance handling, flat
   coordination, **the FRONTIER SENSOR duty** (after every `br close`,
   re-read the scoped ready queue; if it is wider than the active fleet,
   SendMessage the orchestrator `FRONTIER WIDENED → <n>: <ids>` — lanes are
   the sensors, the orchestrator owns the fleet), **and the disk duty** (`df -h .` before heavy builds;
   `disk-janitor` under 50 GB free, never below the 20 GB floor; DECLARE
   every build worktree / data dir / fixture the lane creates in
   `<repo>/.disk-protect` at creation — undeclared = reclaimable), **and —
   final/SPINE unit only — the W5 adjacency prereq rows from the contract**
   (`greenlight(surface, view=regression)` per touched surface, resolved
   against the lineage head at evaluation time; ADVISORY until Phase 2: a
   red mints an owner-routed work item and the close proceeds).
2. Verify each generated file against the skill's quality checklist —
   especially: REAL ids everywhere (epic {epic_ids}, instance
   {instance_id}); zero placeholders; push prompt commands-only.
3. Run the agent-#3 test: read the kickoff as the third of three parallel
   agents with nothing else — can you boot, claim, implement, burndown,
   land? Any question you'd need to ask = a gap to fix.
4. Update `00-pipeline-guide.md` (stage 6 active); report agent-count
   recommendation WITHIN the mode cap ({mode}: mini ≤2, normal ≤4,
   max ≤6 + one closer agent) — topology parallelism justifies count, the
   cap bounds it; literal next action for the human: "open {N} sessions,
   paste 07-execution-kickoff.md into each."

## Follow-Up Pass (Sub-Optimization) — send as follow-up in this session
> ULTRATHINK. (1) grep all three generated files for `TBD`, `TODO`, and
> `{ENRICHMENT` — none may remain; then verify every GENERATION-TIME id is
> real (epic ids, instance id, package slug, evidence root) — runtime
> per-bead variables in command patterns (e.g. `br close <id>`) are
> legitimate and not placeholders. (1b) SCOPE LOCK present and concrete?
> The kickoff must name THIS unit's root epic + unit epic + labels, forbid
> bare/unscoped `br ready`, require an in-scope id+label check before any
> claim, and say "empty/contended queue = STOP, never widen to another
> plan." An agent reading it must be unable to wander into another feature's
> beads. (2) Verify the
> fix-loop text in the kickoff matches the gate bead's verbatim (diff
> them). (3) Is the escape valve stall-sensitive (5 STALLED iterations),
> not count-sensitive? (4) Does the kickoff tell agents what to do on a
> STALE instance and on work-belonging-to-no-bead? (5) Confirm the sweep
> prompt's orphan-sweep wording counts deferred-footer ownership as owned.
> (6) Does the generated 10-completion-sweep carry the W3 TRIAGE + HANDBACK
> terminal stage — per-suite KEEP/SOAK/RETIRE (runbook lint; red retires
> escalate per D9), view + SURFACES.md updates, the fold-in ratio, and the
> surface package handed back to its owner — not bare wrap-up?
```

---

## Template: manifest.yaml

```yaml
feature: "{slug}"
created: "{date}"
source_doc: "{research_doc}"
revision_pin: "{rev}"
contract_doc: "{path-or-planned}"
entry_point: "{stage-N}"
mode: "mini|normal|max"          # see SKILL.md Pipeline Modes
mode_source: "agent|user"        # user override always wins
mode_rationale: "{1-2 lines: the signals that decided it}"
auto:
  enabled: false                 # true ONLY on explicit user request, Claude Code only
  stop_policy: "autonomous"      # autonomous (default) = NO approval stops; decisions delegated to the orchestrator (recorded, retro-review). "review-stops" only if the owner opted in. Hard stops ONLY: external-dependency blocks / unrecoverable blockage after recovery attempt
  routing: "default"             # the SKILL.md tier table, or a recorded override
units: []            # filled by enrichment after stage 2
package_slug_convention: "per surface resolution — AMEND test-packages/{surface_pkg} (delta); MINT test-packages/{new_surface_pkg} only per the decision record"
evidence_root_convention: "evidence/{slug}-unit{N}/"
bead_labels: ["{slug}", "{slug}-u{N}"]
bead_cli: "br"
handoffs:
  - {file: 01-..., status: generated|pending|stage-owned}
env: {build: "cargo build -p swarm-cli -p swarmd (debug)", daemon: "...",
      agentmail: true|false}
```

## Template: EXECUTION-GUIDE.md

```markdown
# {Feature} — Contract Pipeline Execution Guide

Entry point: stage {N}. One handoff = one fresh session. 03 and 06 MUST be
fresh sessions (cross-model encouraged).

## Run Order

| Session | Handoff | Fresh session? | Forward-enriches |
| --- | --- | --- | --- |
| 1 | 01-hardening-revision (repeat until READY) | yes | 02, 03 |
| 2 | 02-contract-create | yes | 04, 05, 06, 07-prep |
| 3 | 03-contract-validate | YES — mandatory fresh; cross-model encouraged | 04 |

DECISION CHECKPOINT (autonomous by default) — the pass-2 session (or a
designated top-tier reviewer) adjudicates the contract + validation
findings and any source-doc owner-gated decisions with recorded rationale
(retro-review flagged), then proceeds. Pause for the owner ONLY on an
external-dependency block or if the owner requested a review stop here.

Then PER UNIT, in contract order:

| Session | Handoff | Fresh session? | Forward-enriches |
| --- | --- | --- | --- |
| 4 | 04-uvp-transcribe | yes | 05, 06, 07-prep |
| 5 | 05-beads-create | yes | 06 (verify stage rewrote it), 07-prep |
| 6 | 06-beads-audit | YES — mandatory fresh; cross-model encouraged | 07-prep |

DECISION CHECKPOINT (autonomous by default) — execution proceeds when the
audit verdict is READY/FIXED-READY; the orchestrator (or audit session)
records the go decision. Same pause rule as above.

| Session | Handoff | Fresh session? | Notes |
| --- | --- | --- | --- |
| 7 | 07-execution-prep | yes | creates the real 07/08/10 (born enriched) |
| 8+ | 07-execution-kickoff × {N} agents | yes, each | 08-execution-push to nudge; gate fix-loop runs autonomously to greenlight |
| ▸ | **09-next-unit** (boundary advance) | yes | after greenlight: `contract-next-unit` advances cursor + re-primes next unit's prompts (+ graduates its stub if needed), then loops back |

Unit greenlights → **run `09-next-unit`** (the UNIT-BOUNDARY ADVANCE; invokes
`contract-next-unit` in a fresh session): it confirms the unit closed, picks
the next unit, graduates its contract stub if needed (routes to
`research-to-contract` for stub units), re-primes 04/05/06/07-prep + advances
the guide cursor, and names the literal next prompt. NOTE the package model:
the surface package is shared across units — each unit re-runs 04 in DELTA
mode (its own suites + `unit:` view appended via a lineage publish + one
instantiate); a unit with no new suites skips 04 and starts at 05.
After the final/SPINE unit greenlights: fresh session → 10-completion-sweep —
whose terminal act is TRIAGE + HANDBACK (W3): per-suite KEEP/SOAK/RETIRE
(runbook-required lint; red retires escalate per D9 SUPERSEDE), view +
SURFACES.md registry updates, the fold-in ratio, and the surface package
handed back to its owner with a health note. Operating-loop features
terminate at GA + readiness pending (W6), never bare COMPLETE.

> Numbered-prompt note: `09-next-unit` is the loop connector (re-run per
> boundary, like 04/05/06); `10-completion-sweep` is terminal (once). Both
> sit after `08-execution-push` in the folder; the swarm prompts (07-kickoff,
> 08, 10) are born by contract-to-execution, while 09-next-unit is part of the
> initial generated chain and is unit-agnostic (never re-primed itself).

## Forward Enrichment Discipline
Each session's LAST workflow step updates the named {ENRICHMENT} markers in
later handoffs. Verify the previous session did its enrichment before
starting yours (check the markers you depend on). Handoffs work without
enrichment — read the artifact directly — but enriched is faster and safer.

## Stops (owner doctrine 2026-07-14: autonomous by default)
There are NO approval stops. Decisions marked owner-gated in source docs,
Class-2 amendments, and checkpoint reviews are adjudicated by the
orchestrator / top-tier sessions with recorded rationale + retro-review
flags. Hard stops ONLY for: external-dependency blocks (credentials,
service signups, purchases, hardware/another machine, OS permissions) or
unrecoverable blockage after a top-tier recovery attempt. The owner may opt
IN to review stops in the invocation. Everything inside execution (fix
loops, amendments, JIT beads) is agent-autonomous by design.

## Auto Mode (if `auto.enabled` in manifest.yaml)
This chain is being executed by the contractmaxxer auto-pilot: each session
above runs as a FRESH background agent spawned by the orchestrator, which
verifies every done-condition against the artifacts before advancing (see
`AUTO-PILOT.md` for config + the live run log). The two ⛔ stops pause the
auto-pilot per its stop_policy; owner DECISION gates, Class-2 amendments,
CORE-PAUSE checkpoints, and stalled valves ALWAYS stop it. A human can take
over at any boundary — the handoffs above are the same ones you'd run
manually.
```

---

## Template: AUTO-PILOT.md (auto invocations only)

Written by contractmaxxer at generation time (config block), then appended
by the orchestrating session as the run progresses (log block). If a fresh
session inherits an in-flight auto run, this file + `00-pipeline-guide.md`'s
cursor are the resume state.

```markdown
# {Feature} — Auto-Pilot

## Config (set at generation; do not edit mid-run without a log line)
- Mode: {mini|normal|max} ({mode_source}; rationale: {mode_rationale})
- Stop policy: {autonomous (default) — no approval stops; owner-gated
  decisions delegated to the orchestrator, recorded + retro-review flagged
  | review-stops (owner opted in): "{quoted wording + which stops}"}
- HARD-stop triggers (the only ones): external-dependency blocks
  (credentials / signups / purchases / hardware / another machine / OS
  permissions) · unrecoverable blockage after a top-tier recovery attempt
  (stage failed twice / stalled gate valve / 3 boundary attempts)
- Delegated-decision log: every owner-gated item adjudicated by the
  orchestrator gets a run-log row with rationale + `retro-review` flag
- Model routing: {default per SKILL.md tier table | override + reason}
- Execution swarm cap: {per mode: mini ≤2 / normal ≤4 / max ≤6 + closer}
- Host check: background-agent tooling confirmed {date}

## Run Log (orchestrator appends; one line per event)
| When | Event | Agent/tier | Outcome | Notes |
| --- | --- | --- | --- | --- |
| {ts} | stage 01 dispatched | {tier} | — | {handoff path} |
| {ts} | stage 01 verified done | orchestrator | PASS | {done-condition evidence, 1 line} |
| {ts} | ⛔ post-03 review | — | PAUSED/skipped(pre-auth) | {user response if paused} |
| {ts} | unit {id} kickoff ×{N} | {mix} | — | {epic id, instance id} |
| {ts} | unit {id} greenlight | gate driver | GREEN | {run id} |
| {ts} | 09 boundary → unit {id2} | {tier} | — | {stub graduated? Y/N} |
| {ts} | EXIT | — | SHIPPED / HANDBACK at {prompt} | {sweep verdict / state summary} |
```
