---
name: research-hardening
description: "Ground canonical research in current code and evidence, expose falsifiable assumptions, and establish readiness for the next useful outcome or a bounded experiment. Use for research-hardening, grounding/readiness audits, or evidence-driven revisions before or during a contract pipeline."
---

# Research Hardening — Ground The Next Outcome In Evidence

The research document records current authorized intent and the evidence for
the design. Downstream artifacts cite it. Separate verified facts, working
assumptions and unresolved questions; evidence or user steering may change
any affected design decision. Price further research against the next useful
product demonstration or experiment instead of trying to settle the whole
project before implementation.

## The Contract-First Pipeline — 60-Second Orientation

| # | Stage (skill) | Produces | Done when |
| --- | --- | --- | --- |
| 1 | research-hardening | grounded current intent and explicit assumptions | readiness for the named next outcome or experiment |
| 2 | research-to-contract | execution contract (units, scenarios, UVP specs, crosswalk) | pass-2 fresh-eyes validation clean |
| 3 | contract-to-uvp | current surface-package delta or justified new package | delta baseline and actual carryover disposition verified |
| 4 | contract-to-beads | bead graph with proof classes per outcome | coverage and actual capability dependencies verified |
| 5 | contract-bead-audit | fresh-eyes audited bead graph | verdict READY |
| 6 | contract-to-execution | kickoff/push/sweep prompts; flat swarm runs | unit UVP greenlight via gate fix-loop |

Laws binding every stage:
1. The research doc records current canonical intent. Cite its requirements;
   when evidence contradicts a decision, reconcile the affected research,
   contract, suites, beads and prompts instead of resolving by document rank.
2. A unit is complete ONLY on truthful UVP greenlight — never on narrative,
   bead acceptance criteria, or local tests alone.
3. Blocked is a valid truthful result; mocks never substitute for missing
   prerequisites.
4. Record an amendment's evidence and actual effect on proof. A justified
   design revision or owner-requested scope change may update canonical
   intent. Weakening acceptance needs an explicit basis and review of the
   affected proof; making a gate green is not a basis. Inspect lineage and
   carryover before claiming unchanged evidence remains valid.
5. Manual scenarios run on REAL subjects with real data; synthetic data only
   in labeled automated eval decks.
6. Normal hardening edits research and its handoff. Substantial steering
   pauses affected dispatch and coordinates changes across artifact classes.

Stage prompts live in `docs/plan-hub/prompts/<feature>-contract-pipeline/`
(numbered 00–10; every iterative prompt ends with its copyable fresh-eyes
prompt as the absolute final section).

You are stage 1: supply enough verified context to author the next outcome
honestly. An experiment may be the next outcome when implementation evidence
is needed to decide the architecture; its result is learning, not product
acceptance.

## Position In The Contract-First Pipeline

```
idea-to-research → [research-hardening]* → research-to-contract (2-pass)
                         (loop)           → contract-to-uvp → contract-to-beads
                                          → contract-bead-audit → contract-to-execution
```

This skill is re-invocable when new evidence or a material unresolved question
warrants another pass. Stamp meaningful changes; a clean audit does not need
an empty revision. Once the scoped readiness bar passes, continue within the
user's authorization. Ask only for a genuinely missing product decision.

Supersedes `research-to-spec` for the contract-first pipeline (no separate
spec is ever produced — the research doc graduates in place). The old 3-SOT
chain remains only for legacy in-flight work.

## When NOT To Use

- The doc doesn't exist yet or is mid-ideation → `idea-to-research` first;
  hardening polishes truth, it does not originate the idea.
- You want shippable units, scenarios, or UVP specs → `research-to-contract`
  (stage 2). Hardening NEVER adds operational scaffolding.
- The doc is being edited in a PARALLEL session → coordinate first, or work
  against an explicitly frozen snapshot copy and rebase later. Never produce
  competing concurrent revisions of the canonical file.

## Deliverables Per Invocation

1. A meaningful revision, if needed, with changed assumptions/decisions and
   their evidence recorded in the existing revision log.
2. Readiness for the named next outcome, unresolved questions and the next
   action. Record these in the existing guide rather than another report.
3. Update affected handoffs when their inputs change; emit a re-invoke prompt
   only when another material research pass is needed.

## Record Meaningful Revisions

- Record related edits together in the existing revision convention:
  `Revision: vN.M (date) — <changes, evidence, decisions>`. Preserve history;
  no-op verification leaves the revision unchanged.
- NEVER silently rewrite authored claims. Corrections are made in place but
  every correction is listed in the revision entry (the grounding-audit
  convention: "corrected X → Y").
- NEVER add operational scaffolding here: no shippable units, no scenarios,
  no UVP specs, no bead structure. Those are contract content (stage 2).
  Hardening records architecture, grounding, assumptions and decisions. A
  bounded experiment brief names its question, actual inputs, cost/feedback
  budget, observable result and the decision it will inform; stage 2 owns
  its execution contract and proof details.
- Mode rule: if the doc lacks a CANONICAL/EXPLORATORY declaration, add
  CANONICAL (the safe default) in this revision and tell the human.

## Product milestones when a board is in scope

Read the board's relevant outcomes, priorities and prerequisites with the research.
Use [product-board](../product-board/SKILL.md) to iterate on these before implementation
or reconcile them during hardening. Milestone discussion does not create units,
beads or execution authority. Correct a consequential assumption in both the plan
and affected board entries; preserve unaffected work. Research readiness is not
product achievement. Carry the board pointer and relevant IDs into the next prompt.
Preserve the full product goal while choosing the next small demonstration. Develop
architecture/operational changes in the canonical plan and reconcile the concise
board entries; flag pending amendments and honor a requested plan-first sequence.

Bound proof to the intended use: distinguish required product behavior, a bounded
experiment's learning question and optional later hardening. Challenge requirements
that add edge/recovery work without protecting a current promise or material risk.
Name the first representative result and the decision it enables; an honest failed
experiment may resolve that decision without repairing every exploratory branch.
Use fleet-controller and the current registry before delegating research, including
native child calls; choose task fit across eligible providers before the adapter.

## Workflow

### Phase 0 — Orient

1. Read the target doc's header, revision history, and full section outline.
   For large docs (>3k lines), read header + outline yourself and fan out
   Explore agents for section summaries; read load-bearing sections directly.
2. Read repo instructions (`AGENTS.md`, `CLAUDE.md`) and note where research
   docs and pipeline prompts live (`docs/research/`,
   `docs/plan-hub/prompts/` are the SwarmNet conventions; derive local
   equivalents elsewhere).
3. If this is the first hardening invocation for this feature, create the
   pipeline prompt folder `docs/plan-hub/prompts/<feature>-contract-pipeline/`
   with `00-pipeline-guide.md` (template at the end of this skill).

### Phase 1 — Readiness Audit (the 7-item bar)

Score each item PASS / WEAK / FAIL with one-line evidence:

1. **Mode + status declared** — CANONICAL/EXPLORATORY in header; revision
   history stamped.
2. **Next decision is executable** — name the next product outcome and its
   required architecture. If that architecture depends on unresolved evidence,
   name a bounded experiment, its falsifiable assumption, inputs, budget,
   observations and resulting decision. Do not declare an untested assumption
   DECIDED to pass this bar. Later design may remain explicitly provisional.
3. **Codebase grounding audited** — each claim about existing code that is
   relevant to the next outcome is verified against current source, with
   corrections recorded. In a stale shared checkout use the intended source
   revision. Recheck changed or load-bearing claims rather than a fixed count.
4. **Citable requirement structure** — named sections, numbered invariants/
   contract rules, enumerable criteria or phase lists. A citation must be able
   to grip something stable. (Synthetic FR-IDs NOT required.)
5. **Representative result identified** — name the real user-visible path,
   commands/APIs or observed artifact that will provide early feedback. For
   an experiment, state what it can establish and which product claims remain
   unearned. A measurement existing does not mean its threshold is met.
6. **Assumptions and questions have dispositions** — each material assumption
   states what would falsify it, how/when to observe that and the consequence
   for the design. Questions carry an evidence-backed recommendation, bounded
   experiment, or a precise missing owner decision. Do not label an engineering
   uncertainty human-only merely because more evidence is needed.
7. **Scope edges explicit** — non-goals, exclusions, and phase/boundary
   statements exist.

Verdict: READY only if the seven checks pass for the explicitly named next
outcome. Qualify READY as product implementation or bounded experiment; never
imply that experiment readiness settles the full product architecture.
Otherwise address the material gaps. Add a pass only when it can change a
decision or retire a demonstrated risk.

If current evidence already establishes readiness, reuse it. Recheck only
claims affected by changes, suspected drift or unresolved risk, then continue.

### Phase 2 — Execute The Passes Needed By The Gaps

#### Pass A — Codebase Cartography

Goal: the doc gains/extends an "Existing Reality" style section: ground-up
understanding of what EXISTS, what DOESN'T, and what's RELATED.

1. Derive the subsystem list the feature touches from the doc's own claims.
2. Fan out parallel research subagents per subsystem where available
   (otherwise sequential deep reads): exact surfaces (types, methods,
   files), maturity, integration seams, and what the doc ASSUMES exists but
   doesn't.
3. Write findings as **falsifiable, dated claims with file references**:
   "`L1EventStore::append_typed_with_request_id` lives in
   `crates/swarm-services/src/infra/event_store.rs` and is the canonical
   append path" — never "the event system should support this".
4. Explicitly enumerate the GAPS: things the plan needs that do not exist
   (these become honest implementation scope, not silent assumptions).
5. Cover adjacency: neighboring domains that constrain or duplicate the
   feature (so the doc can state integrate-vs-replace decisions).

#### Pass B — External BOM Research

Goal: external dependencies required by the next outcome have verified
capabilities and a justified selection or a bounded evaluation.

1. List the external dependencies required by the next outcome.
2. For each: current version, license (including license HISTORY — note
   re-verify-at-vendoring caveats), capabilities relevant to the plan,
   credible alternatives, and a decision with rationale.
3. Verify against CURRENT official documentation via web search/fetch — never
   from memory. Spot-verify load-bearing external claims (paper IDs, model
   specs, benchmark numbers) and record "externally verified" in the revision.
4. Update the existing dependency decisions: selection, rationale, relevant
   alternatives, integration seam and any assumption still awaiting evidence.

#### Pass C — Architecture & Spec Fleshing

Goal: the doc can answer "where does this live and what is it made of"
without interpretation.

1. Placement: layer, service domain, crate/module shape, reuse of shipped
   substrate (no parallel substrates).
2. Core types and their relations (named structs/concepts, not prose blobs).
3. Candidate product surface: CLI commands, RPC verbs, event families.
4. Non-functional requirements: determinism, performance budgets,
   concurrency/load model, security/classification, rebuildability.
5. Convert load-bearing uncertainty into a justified decision, a falsifiable
   assumption or a bounded experiment. Preserve honest uncertainty.

#### Pass D — Grounding Audit (fresh eyes)

Goal: verify changed decisions and the claims they rely on.

1. Read the changed sections and their actual dependencies. Broaden the audit
   when contradictory evidence or missing provenance warrants it.
2. Verify code claims against intended source, external claims against current
   sources and derived numbers against their inputs. Inspect consumer wiring.
3. Record corrections and unresolved findings. Stop when no material finding
   remains; document size or a zero-finding pass does not justify another round.

#### Pass E — Resolve Or Test The Next Decision

Goal: each blocking question has a decision or a way to obtain missing evidence.

1. Collect all open questions (explicit section + implicit hedges in prose).
2. For each: give a recommendation with rationale, a bounded experiment, or
   the exact owner input required. Prefer early representative feedback when
   it can resolve the uncertainty more cheaply than another review.
3. Promote to DECIDED anything the evidence already settles.

### Phase 3 — Stamp The Revision

Record the actual change and its evidence. Inspect affected UVP input bindings
and carryover before predicting its validation cost; do not assume every
document edit resets every earned judgment.

When already in execution, use contractmaxxer's steering procedure: checkpoint
affected work, revise current intent and classify affected contracts, suites,
beads and prompts as retained, revised, superseded or new. Preserve valid
evidence and unchanged work. Resume affected dispatch on reconciled inputs.

### Phase 4 — Re-Audit, Report, Emit Prompt

1. Re-run the Phase 1 bar. Report the scorecard delta.
2. Update `00-pipeline-guide.md` status row.
3. If a further research pass is justified, refresh `01-hardening-revision.md`: a
   self-contained re-invoke prompt naming the doc, the current revision, the
   remaining WEAK/FAIL bar items, and which passes to run next. End it with a
   `Copyable Fresh-Eyes Re-Read Prompt` as the absolute final section.
4. FORWARD ENRICHMENT: if later handoffs exist in the pipeline folder
   (e.g., `02-contract-create.md`, `03-contract-validate.md`), update their
   `{ENRICHMENT:revision-pin}` and `{ENRICHMENT:readiness-notes}` markers
   for changed inputs. Preserve unaffected active prompts and checkpoints;
   a guide cursor or unrelated revision alone does not invalidate their work.
5. Final response: scorecard, revision stamped, corrections count, remaining
   gaps, and either "re-invoke for passes X/Y" or "READY — proceed to
   research-to-contract".

## Anti-Patterns (stop-the-line for this skill)

- Rewriting authored research prose without listing the change in the
  revision entry.
- Adding units/scenarios/UVP specs/bead structure to the research doc.
- Stating an unverified claim as fact (claims are dated and falsifiable or
  they are labeled assumptions).
- Declaring READY with any bar item at FAIL, or with WEAK items undisclosed.
- Repeating audits without a material unresolved finding or forcing a design
  decision that needs implementation evidence.
- Describing experiment readiness or an internal gate as product acceptance.

## 00-pipeline-guide.md Template

```markdown
# <Feature> — Contract-First Pipeline Guide
Research doc: <path> (revision: vN.M)
Contract doc: <path or PENDING>
Stage status:
| Stage | Skill | Status | Output |
| --- | --- | --- | --- |
| 1 Hardening | research-hardening | in-progress vN.M | revision log |
| 2 Contract | research-to-contract | pending | <contract path> |
| 3 Packages | contract-to-uvp | pending | test-packages/<slug>... |
| 4 Beads | contract-to-beads | pending | root epic <id> |
| 5 Audit | contract-bead-audit | pending | audit report |
| 6 Execution | contract-to-execution | pending | kickoff/push prompts |
Stage numbers identify artifact roles. Select work by actual capability
readiness and current evidence; unaffected ready work may proceed in parallel.
Record the next representative result and unresolved assumptions here.
```

## Final Response Shape

Readiness scorecard (7 rows, before→after) · passes executed · revision
stamped (vN.M) · corrections/decisions count · files written · next action
(re-invoke with passes X/Y, or proceed to research-to-contract).
