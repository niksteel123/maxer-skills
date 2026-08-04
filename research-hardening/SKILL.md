---
name: research-hardening
description: "Stage 1 of the contract-first pipeline. Transform a research document into an ideal, conversion-ready source document through re-invocable stamped revision passes: codebase cartography (what exists/doesn't/relates), deep external BOM research, architecture+spec fleshing, fresh-eyes grounding audits, and decision forcing. One invocation = one stamped revision; re-invoke until the 7-item conversion readiness bar passes. Use when: 'harden this research doc', 'grounding audit', 'readiness check', 'is this research ready for the pipeline', 'research-hardening', or before research-to-contract. The ONLY pipeline stage allowed to write the research doc."
---

# Research Hardening — Make The Research Doc An Ideal Source Document

> ULTRATHINK. The research document is the single canonical truth for the
> entire contract-first pipeline. Every downstream artifact — execution
> contract, UVP packages, beads, code — cites it. A gap here becomes invented
> content downstream; an unverified claim here becomes a wasted implementation
> sprint. Hardening is cheap; drift is not.

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

**You are stage 1 — mission: iterate the research document through stamped
revision passes until it is an ideal source document (readiness bar READY)
that stage 2 can convert without inventing anything.**

## Position In The Contract-First Pipeline

```
idea-to-research → [research-hardening]* → research-to-contract (2-pass)
                         (loop)           → contract-to-uvp → contract-to-beads
                                          → contract-bead-audit → contract-to-execution
```

This skill is **re-invocable**: each invocation performs ONE stamped revision
and reports remaining gaps. Invoke repeatedly (researchmaxer-style) until the
readiness bar passes AND the human is satisfied. It is the ONLY stage in the
pipeline permitted to write the research document.

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

1. One stamped revision of the research doc (passes run + every correction
   and decision listed in the revision entry).
2. The readiness scorecard, before → after.
3. `00-pipeline-guide.md` created/updated; `01-hardening-revision.md`
   re-invoke prompt refreshed.

## Core Law: Stamped Additive Revisions

- Every invocation produces exactly one revision entry in the doc's revision
  header: `Revision: vN.M (date) — <pass types run>: <summary of changes,
  corrections, decisions>`. Follow the existing header convention of the doc.
- NEVER silently rewrite authored claims. Corrections are made in place but
  every correction is listed in the revision entry (the grounding-audit
  convention: "corrected X → Y").
- NEVER add operational scaffolding here: no shippable units, no scenarios,
  no UVP specs, no bead structure. Those are contract content (stage 2).
  Hardening adds and verifies TRUTH CLAIMS (architecture, grounding,
  decisions) — the research doc's native content type.
- Mode rule: if the doc lacks a CANONICAL/EXPLORATORY declaration, add
  CANONICAL (the safe default) in this revision and tell the human.

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
2. **Architecture decided to the point of naming** — layer placement, module/
   service shape, new-vs-reused surfaces are DECIDED and named ("stack
   DECIDED"), not lists of options.
3. **Codebase grounding audited** — every claim about existing code has been
   verified against the live tree in some stamped revision, with corrections
   recorded. Spot-check 5 claims yourself; any failure = FAIL.
4. **Citable requirement structure** — named sections, numbered invariants/
   contract rules, enumerable criteria or phase lists. A citation must be able
   to grip something stable. (Synthetic FR-IDs NOT required.)
5. **Product surface sketched** — candidate commands / RPC verbs / event
   kinds / APIs are named (a "Candidate RPC Surface" or "Developer Commands"
   style section), because downstream scenarios need a command surface.
6. **Open questions carry recommendations** — every open question has a
   working recommendation or an explicit "human decision required" flag, so
   the contract knows deliberately-open from missing.
7. **Scope edges explicit** — non-goals, exclusions, and phase/boundary
   statements exist.

Verdict: READY only if all 7 PASS. Otherwise pick the 1–2 weakest dimensions
for this invocation's passes (depth over breadth — one excellent pass beats
three shallow ones).

If the bar is ALREADY READY at entry, do not invent work: run a light
Pass D spot-verification (re-verify 5–10 load-bearing claims against the
live tree), report READY with the spot-check results, and stop.

### Phase 2 — Execute Passes (pick 1–2 per invocation)

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

Goal: every third-party tool/library/API/platform the implementation may need
is researched and DECIDED.

1. List every external dependency mentioned or implied by the doc.
2. For each: current version, license (including license HISTORY — note
   re-verify-at-vendoring caveats), capabilities relevant to the plan,
   credible alternatives, and a decision with rationale.
3. Verify against CURRENT official documentation via web search/fetch — never
   from memory. Spot-verify load-bearing external claims (paper IDs, model
   specs, benchmark numbers) and record "externally verified" in the revision.
4. Output a Bill Of Materials section: decided stack, per-item rationale,
   rejected alternatives, integration seam in the existing codebase.

#### Pass C — Architecture & Spec Fleshing

Goal: the doc can answer "where does this live and what is it made of"
without interpretation.

1. Placement: layer, service domain, crate/module shape, reuse of shipped
   substrate (no parallel substrates).
2. Core types and their relations (named structs/concepts, not prose blobs).
3. Candidate product surface: CLI commands, RPC verbs, event families.
4. Non-functional requirements: determinism, performance budgets,
   concurrency/load model, security/classification, rebuildability.
5. Convert every "could/should/maybe" that is actually load-bearing into a
   decision or an open question with recommendation.

#### Pass D — Grounding Audit (fresh eyes)

Goal: re-verify the WHOLE doc's claims after other passes have accumulated.

1. Full fresh re-read (or fan out section auditors with instructions to
   verify, not summarize).
2. Verify every codebase claim against the live tree; every external claim
   against current sources; every internal cross-reference against the doc
   itself; recompute derived numbers from their own inputs.
3. Record every correction in the revision entry. Zero corrections found on
   a large doc is suspicious — say so rather than claiming perfection.

#### Pass E — Decision Forcing

Goal: no load-bearing open question without a recommendation.

1. Collect all open questions (explicit section + implicit hedges in prose).
2. For each: give a working recommendation with rationale, or flag as
   human-only with exactly what input is needed.
3. Promote to DECIDED anything the evidence already settles.

### Phase 3 — Stamp The Revision

Add the revision entry to the doc header (one entry for this invocation,
listing passes run, sections added/changed, corrections, decisions). Keep
edits batched into this single stamped revision — downstream UVP instances
watch this file's path and go stale on every edit; deliberate revisions beat
edit-dribble.

### Phase 4 — Re-Audit, Report, Emit Prompt

1. Re-run the Phase 1 bar. Report the scorecard delta.
2. Update `00-pipeline-guide.md` status row.
3. Write/refresh `01-hardening-revision.md` in the pipeline prompt folder: a
   self-contained re-invoke prompt naming the doc, the current revision, the
   remaining WEAK/FAIL bar items, and which passes to run next. End it with a
   `Copyable Fresh-Eyes Re-Read Prompt` as the absolute final section.
4. FORWARD ENRICHMENT: if later handoffs exist in the pipeline folder
   (e.g., `02-contract-create.md`, `03-contract-validate.md`), update their
   `{ENRICHMENT:revision-pin}` and `{ENRICHMENT:readiness-notes}` markers
   with the new revision id and remaining WEAK/FAIL items — the finishing
   session is the cheapest context transfer in the pipeline.
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
- Doing 5 shallow passes in one invocation instead of 1–2 deep ones.

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
Prompts in this folder run in numbered order; each ends with its own
copyable fresh-eyes prompt as the final section.
```

## Final Response Shape

Readiness scorecard (7 rows, before→after) · passes executed · revision
stamped (vN.M) · corrections/decisions count · files written · next action
(re-invoke with passes X/Y, or proceed to research-to-contract).
