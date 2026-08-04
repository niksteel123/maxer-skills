---
name: research-to-contract
description: "Stage 2 of the contract-first pipeline. Author the companion EXECUTION CONTRACT for a hardened CANONICAL research doc: shippable units + execution topology, per-unit pre-research maps, step-by-step real-data validation scenarios, UVP package specs, verification prerequisites (tool-to-medium matrix), requirement-to-proof crosswalk, close gates, and the amendment protocol. Two-pass: pass 1 creates the contract; pass 2 is a generated fresh-eyes adversarial validation prompt. Use when: 'contract pass', 'execution contract', 'research to contract', converting research into a validation-first implementation plan. Writes ONLY the contract doc — never the research doc."
---

# Research To Contract — The Contract Pass

> ULTRATHINK. This stage carries the highest drift risk in the entire
> pipeline: it is where requirements become proof obligations. Every shortcut
> here becomes either an unprovable claim or a gameable test. The research doc
> defines WHAT is true; this contract defines HOW IT GETS PROVEN AND
> NAVIGATED; it must add zero requirements and lose zero clauses.

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

**You are stage 2 — mission: produce ONE execution contract that lets every
downstream stage operate without re-interpreting the research — units to
ship, scenarios that prove them, packages that encode the proof, and the
governance for changing any of it.**

## Position And Write Target

```
research-hardening → [research-to-contract] → contract-to-uvp → contract-to-beads
                       pass 1: create            → contract-bead-audit
                       pass 2: validate (fresh)  → contract-to-execution
```

Write target: the contract doc ONLY — `docs/research/<date>-<feature>-execution-contract.md`
(companion file beside the research doc; for small features ≤~1500 lines of
research, an appended "Execution Contract" layer in the same file is
acceptable — state the choice). NEVER write the research doc. NEVER write
test-packages (stage 3's job).

Supersedes `spec-to-tdd`, `spec-to-strategy`, and the spec stage entirely.

## Entry Gate (mandatory, before anything else)

Score the research doc against the readiness bar (inlined so this skill
stands alone): (1) CANONICAL mode + stamped revision history declared;
(2) architecture decided to the point of naming — placement, module shape,
new-vs-reused surfaces, not option lists; (3) codebase grounding audited,
corrections recorded in a stamped revision; (4) citable structure — named
sections, numbered invariants, enumerable criteria/phases; (5) product
surface sketched — candidate commands/RPC verbs/event kinds named; (6) every
open question carries a recommendation or an explicit human-decision flag;
(7) scope edges explicit — non-goals, exclusions, boundaries.

If ANY item FAILs: **STOP**. Report the scorecard and route to
research-hardening. You are NEVER allowed to fill research gaps inside the
contract — a contract that invents architecture is a shadow spec, and shadow
specs recreate the drift problem this pipeline exists to kill.

If the research doc is under active revision elsewhere, either wait or work
from an explicitly frozen snapshot copy (state which, pin the revision).

## When NOT To Use

- The research doc fails the entry gate → `research-hardening` first.
- You need a TESTS.md written and validated → `contract-to-uvp` (stage 3).
- Mid-execution contract changes → the Amendment Protocol governs those; do
  not re-run this skill to rewrite a live contract wholesale.

## Deliverables (pass 1)

1. The execution contract doc (units authored or stubbed per the scope rule
   below).
2. `02-contract-create.md` (record + re-run prompt) and
   `03-contract-validate.md` (the pass-2 prompt) in the pipeline folder.
3. Updated `00-pipeline-guide.md`.

**Unit authoring scope rule:** author IN FULL the unit(s) that will be
implemented before the next natural decision point (typically the first one
or two); STUB the rest (id, research citation, one-line scope, package id,
status STUB). Stubs graduate to full sections by re-invoking this skill per
unit — re-invocation is the normal mode, not a failure.

## The Three Laws

1. **Citation, not restatement.** Requirements are referenced by section
   heading, invariant number, phase name, verb, event kind, or acceptance
   item — never paraphrased into new normative prose. If a sentence here
   defines behavior the research doc doesn't, that sentence is a defect.
2. **Conflicts resolve upward**: code → package → contract → research.
3. **Real subjects only** (scenarios): manual checklist scenarios run on real
   projects with real data at representative scale. Synthetic data is
   permitted only inside labeled automated eval decks.

## Pass 1 — Create The Contract

### Phase 1: Deep Study

1. Read the research doc thoroughly (full read; for very large docs read all
   load-bearing sections directly + agent summaries for the rest).
2. Read the model contracts for scenario discipline (shape, not content):
   `docs/research/2026-05-31-apple-vm-performance-headless-sudo-roadmap-research.md`
   (§Step-By-Step UVP Scenario, §Fresh-Agent Reading Guide, §Codebase Study
   Map) and
   `docs/research/2026-05-22-shared-workspace-data-zone-situational-awareness.md`
   (per-group pre-research + scenario suites + "do not count as pass").
3. Read `verify-authoring` SKILL.md (schema constraints your package specs
   must transcribe into) and skim 2 shipped packages under `test-packages/`.
4. DEEP CODEBASE PRE-RESEARCH — fan out study agents (parallel where
   available) to build the per-unit study maps. THIS is where pre-research
   content is authored, while context is hottest; downstream stages
   (beads, execution) only CONSUME it — if you under-research here, every
   executing agent re-researches badly later. Hardening's Pass A already
   established WHAT exists (truth, in the research doc); your job is the
   implementation-facing layer: HOW the new work integrates. Per subsystem
   the feature touches, the agents must return:
   - **Pattern anatomy**: the existing files a new implementation mirrors
     (domain module layout, event/projection patterns, service traits, CLI
     command shape, index/schema precedents) — each with a one-line STUDY
     PURPOSE ("copy this re-export pattern", "this rebuild() is the replay
     discipline").
   - **Integration seams**: the EXACT wiring points where new code plugs
     into existing code — registries/enums to extend, `mod.rs`/router
     entries, registration builder chains, config surfaces — with file
     paths and what changes at each.
   - **Boundary types**: the existing types/traits the feature consumes or
     crosses (names + locations + which fields matter).
   - **Exists-vs-assumed delta**: anything the research doc's design leans
     on that does NOT exist yet (this becomes honest scope, never a silent
     assumption), and anything that ALREADY exists that the feature must
     not break or duplicate (collision/naming check).
   - **Test & eval infrastructure precedents**: harnesses, golden/snapshot
     patterns, lanes the unit's suites will route through.
   - **5–10 dated, falsifiable reality claims** with file refs (these
     become the unit's Current Reality To Verify section verbatim).
   Depth bar: a fresh implementing agent reading the resulting study map
   should need ZERO additional codebase exploration to start correctly.

### Phase 2: Unit Design

Units are shippable slices with ONE outer UVP package and ONE close gate
each. Derive them from the feature's natural shipping structure (research
phases when they exist; one unit minimum for small features). For each unit:
id, research-phase citation, one-line scope, package id, status. Define:

- Macro sequence with explicit parallel marks (`U2 ∥ U3`), grounded in the
  research doc's own prerequisite statements.
- Prerequisite rule: a unit may not claim green while a prerequisite unit's
  package is red/stale/never-run.
- For multi-unit features: an outer SPINE/shipping package composing the unit
  packages as prerequisites (the production-chat product-package pattern).

### Phase 3: Per-Unit Authoring (the template)

Every unit gets ALL of these sections. Status of unauthored units = STUB.

1. **Primary Question** — one sentence: what does closing this unit prove?
2. **Scope Boundary** — BY REFERENCE: "Scope is <research §X> in its
   entirety"; explicit IN/OUT markers quoted from research; deferred items
   named with their owning unit.
3. **Prerequisites** — prior units/packages; the blocked-not-skipped rule.
4. **Pre-Research Map** — four components + first commands:
   - Reading Guide: ordered list — doc sections with focus guidance, prior
     packages, evidence baselines, then code.
   - Source Takeaway Matrix: source | why it matters | the specific facts.
   - Codebase Study Map: per-subsystem tables `file | study purpose` (what
     pattern to copy / what to confirm).
   - **Current Reality To Verify**: falsifiable, DATED claims — framed as
     claims to reconfirm ("the code wins"), never eternal truths.
   - First Commands: exact commands to run and retain before any edit.
5. **Non-Negotiables** — cited invariants/rules only; read-at-source.
6. **Verification Prerequisites** — what the PROOF needs (distinct from the
   implementation BOM in the research doc):
   - Environment: builds, daemon/data dirs, fixtures, seed corpora.
   - **Tool-To-Medium Matrix**: every proof medium in the unit → named tool
     (browser items → `agent-browser` skill or Claude Chrome MCP; Electron →
     playwright tooling; CLI → bash with full capture; API → curl; verdicts →
     `verify-ops`; novice/fresh-agent items → a second clean-context agent
     session). A medium with no tool = authoring defect.
   - External services/APIs: needed AND considered-but-deferred, auth mode,
     unavailable→BLOCKED rules.
   - Capability → tool mapping (which concrete tool satisfies each suite
     `required_capabilities` entry).
7. **Execution Topology** — the old strategy doc's surviving job, ordering
   content ONLY: parallel tracks (cluster by study-map surfaces), sequence
   constraints, the convergence point (where the turns-green beads sit —
   the late beads whose acceptance criteria are making named suites green;
   most earlier beads are `contributes` scaffolding with local gates only;
   proof classes are operationalized in contract-to-beads), which suites are
   burndown-tracked at fast tier, assumed agent count. Shape:

   ```text
   Track A (events + projection) ─┐
   Track B (index + search)  ∥ A  ├─► Convergence (integration; turns-green
   Track C (bootstrap)       ∥ AB ┘   beads) → Gate bead (scenario+greenlight)
   Burndown suites (fast tier): <suite ids> · Agents: 2 implement + 1 gate
   ```
8. **Scenario Suite** — see Scenario Authoring Rules below. Eight parts,
   all mandatory.
9. **UVP Package Spec** — transcription-ready: package id/slug, layout,
   frontmatter sketch (scopes, `work_unit_queries` labels that beads will
   carry, `path_globs` INCLUDING the research doc and this contract doc for
   mechanical staleness, evidence contract from the scenario's required
   evidence), suite tables: automated command suites + manual checklist
   suites with stable item ids matching scenario wording.
10. **Requirement-To-Proof Crosswalk** — the coverage instrument. Every
    in-scope research clause appears as a row; close with a **deferred
    footer** (later-unit clauses with owners, so they are not false orphans):

    | Requirement (research citation) | Scenario steps | Suite / item | Key evidence |
    | --- | --- | --- | --- |
    | <clause> (research §X; inv. N) | 8, 15 | `u1.suite/item-id` | `u1-artifact.json` |

    Deferred (not orphans): <clause> → U2 · <clause> → U4 · …
11. **Close Gate** — greenlight with zero red/stale/never-run required
    suites; no orphan crosswalk rows; prerequisites green or unit BLOCKED;
    quality gates; amendment records complete + tripwire clean.

### Phase 4: Document-Level Machinery

- **Header**: companion-to path, research revision pinned, status.
- **Relationship section**: the citation-not-restatement law verbatim.
- **Alignment Rules** (numbered, adapt as needed):
  1 research is canonical, conflicts resolve upward; 2 units close only on
  greenlight; 3 scenarios use product commands, current `--help` is
  authoritative for flags; 4 every checklist verdict cites retained evidence
  refs; 5 no fixture-specific logic in production code; 6 negative
  assertions are blocking; 7 blocked is a valid truthful result; 8
  amendments follow the protocol, unrecorded weakening is stop-the-line;
  9 rebase on research revision (re-grep citations, log Class 1 repairs,
  bump package versions, re-instantiate).
- **Amendment Protocol**: Class 1 (tighten/repair — frictionless, one log
  line, patch bump). Class 2 (weaken/redefine-pass — full YAML record:
  id, target, change, why_contract_was_wrong, **research_basis (REQUIRED —
  no supporting clause means the research is what needs changing: mark
  BLOCKED and surface, never amend around it)**, evidence, affected_suites,
  version bump). **Red-to-green tripwire**: any suite/item red under
  version N and green under N+1 without an intervening code change is an
  automatic audit trigger. Agent autonomy is total; friction is the control.
- **Amendment Log** (starts empty, last section).

### Scenario Authoring Rules (the heart of this skill)

**Eight mandatory parts**: Fixture · Happy Path · Negative Paths · Restart/
Replay Paths · Edge Cases · Fresh-Eyes Pass Assertions · Do Not Count As
Pass · Required Evidence.

**Fixture**: declares the REAL subject (real project, real data, real scale —
state why it's representative); the seed corpus; ALL actors including any
separate clean-context verification agent (a fixture-level declaration, not
an afterthought); prerequisite harness state; package
validated+instantiated BEFORE implementation (contract-first discipline).

**The grounding triple — every happy-path step must simultaneously**:
1. invoke a PRODUCT command from the research doc's command surface (exact
   flags deferred to current `--help`),
2. CITE the research clause it proves (inline: "(research §X; invariant N)"),
3. NAME the evidence artifact it retains (e.g., `u1-whereami-map.json`).
A step that cannot do all three is vague, invented, or unverifiable — fix or
delete. Steps are numbered, grouped into phases, 4–8 steps per phase, with
JIT gates between phases and blocked stop-conditions where prerequisites can
be missing.

**Negative paths**: deliberate failure-mode proofs (degraded modes, rejected
invalid operations, malformed input handling, non-TTY/format discipline) —
each with evidence.

**Do Not Count As Pass**: enumerate the gaming vectors — the exact ways an
agent could technically-pass while actually failing (static files
masquerading as compiled output, cache-reread "replay" proofs,
post-hoc-chosen eval tasks, coached fresh agents, fixture-hardcoded
behavior, prose-only verdicts, skipped-instead-of-blocked suites,
**synthetic/toy fixture substituted for the real subject** — a standing
bullet). Writing this list is the depth-forcing function; if you cannot
think of 6+ entries you do not yet understand the feature.

**Required Evidence**: named artifact list (becomes the package
`evidence_contract`, which greenlight enforces as its own synthetic suite) +
a command log (`*-command-log.jsonl` with argv/exit/stdout/stderr/timestamps)
+ final report + artifact index.

**Scenario QA layers (run before finishing pass 1)**:
- L1 structural completeness (all eight parts present);
- L2 grounding-triple audit on every step;
- L3 red-team yourself: try to pass each scenario while violating research
  intent — each successful attack becomes a negative assertion or
  do-not-count bullet;
- L4 fresh-eyes questions: could a fresh agent execute without asking what
  the feature means? does every acceptance claim have a proof owner? are
  blocked states honest?

### Phase 5: Emit Prompts

Into `docs/plan-hub/prompts/<feature>-contract-pipeline/`:
- update `00-pipeline-guide.md` (if stage 1 never ran, CREATE the folder and
  a minimal guide now: stage-status table + research/contract doc paths +
  pinned research revision — the full template lives in research-hardening,
  but do not block on it);
- `02-contract-create.md` — record of this pass + re-run instructions;
- `03-contract-validate.md` — the PASS 2 prompt (below);
- FORWARD ENRICHMENT: if later handoffs exist (04/05/06/07-prep), fill their
  `{ENRICHMENT:unit-map}`, `{ENRICHMENT:package-spec-summary}`, and
  `{ENRICHMENT:scenario-stats}` markers with the real unit data you just
  authored. Keep 04/05/06/07-prep as SINGLE unit-agnostic prompts — do NOT
  duplicate per-unit files. Each prompt is re-run once per unit in a fresh
  session; "current unit" = the next pending unit per
  `00-pipeline-guide.md`'s stage table (operator may name a unit explicitly
  when units run in parallel), and per-unit runtime ids (instance, epics,
  matrix, verdict) are read from that same table, which every stage
  already updates;
- end every emitted prompt with a `Copyable Fresh-Eyes Re-Read Prompt` as the
  absolute final section.

## Pass 2 — The Generated Validation Prompt (03-contract-validate.md)

A self-contained prompt for a FRESH session (cross-model capable: runnable by
Claude, Codex, or Gemini). It must embed paths, the research revision pin,
and these SEVEN checks:

1. **Independent inventory diff** — re-derive each unit's in-scope clause
   list from the research doc WITHOUT reading the crosswalk; then diff
   against the crosswalk. Misses = underscoping findings (CRITICAL).
2. **Grounding-triple audit** — sample ≥50% of steps: command real? citation
   resolves? artifact named and consumed by Required Evidence?
3. **Scenario red-team** — adversarially attempt to pass each scenario while
   violating intent; every attack found → new negative assertion /
   do-not-count bullet.
4. **UVP schema lint** — package specs against verify-authoring rules (three
   valid suite pairs only, quoted semver, package-root-relative paths,
   non-empty scopes, canonical capabilities).
5. **Topology sanity** — tracks match study-map surfaces; convergence point
   placed after its feeders; burndown suites are fast-tier.
6. **Medium-coverage audit** — every proof medium implied by the requirement
   set has a tool row in Verification Prerequisites AND a checklist item
   (this is the check that catches "the UI deliverable nobody wrote a
   browser step for").
7. **Fixture-realism check** — real subject, real data, representative
   scale; no hollow-shell pass possible.

Findings are applied as contract revisions (Class 1 log lines for tightens);
underscoping findings that trace to research gaps route back to
research-hardening.

Prompt skeleton for `03-contract-validate.md` (uvp-goal handoff
conventions): title → opening ("Use this prompt in a FRESH session to
adversarially validate the execution contract…") → `ULTRATHINK and be
meticulous` directive → read-first list with exact paths (research doc +
pinned revision, contract doc, `verify-authoring` SKILL.md, one shipped
package under `test-packages/` for schema reference) → the seven checks as
numbered missions, each with its expected output → severity model + how to
apply fixes (contract revisions + Class 1 log lines) → final response shape
→ `Copyable Fresh-Eyes Re-Read Prompt` as the absolute final section.

## Quality Checklist (before declaring pass 1 done)

- [ ] Entry gate run and recorded; research revision pinned
- [ ] Zero restated requirements (spot-check: any normative sentence without
      a citation?)
- [ ] Every unit has all 11 sections (stubs explicitly marked STUB)
- [ ] Every scenario passes QA layers L1–L4
- [ ] Every proof medium has a tool; every external dependency has a
      disposition (needed/considered/blocked-rule)
- [ ] Crosswalk: no orphan clauses, no citation-less rows, deferred footer
- [ ] Amendment protocol + log present; alignment rules present
- [ ] Prompts 00/02/03 emitted, fresh-eyes prompt last section

## Final Response Shape

Contract path + units authored/stubbed · scenario stats (steps/negatives/
do-not-count counts per unit) · crosswalk row count + deferred count ·
verification-prerequisite gaps found · prompts emitted · next action (run
03-contract-validate in a fresh session, then contract-to-uvp per unit).
