---
name: uvp-goal
description: Add or improve UVP requirements, realistic scenario tests, evidence contracts, and UVP/implementation handoff prompts from a feature idea or research document. Use when the user asks for a UVP goal, UVP contract, verification package plan, manual scenarios, real user testing scenarios, implementation goal handoff, fresh-eyes UVP review, or wants to combine idea-to-research with UVP planning for backend, agent/runtime, data, frontend/browser, design, or app work.
---

# UVP Goal

Use this skill to turn a feature idea or research document into a verification-backed execution plan. The output should make it possible for a fresh agent to author a correct UVP package and then for another fresh agent to implement until the UVP truthfully passes.

This skill is a bridge between research and execution:

1. The research document explains the feature, codebase, constraints, risks, and desired product behavior.
2. The UVP layer turns that into a proof contract: suites, scenarios, evidence, reports, negative assertions, and stop-the-line rules.
3. The handoffs make the next two phases repeatable: UVP authoring and implementation/validation.

## Trigger Modes

Support all three modes:

- Existing research document: read it fully, improve it in place with UVP/scenario sections, then create handoffs.
- New feature idea: first follow `idea-to-research` to create the research document, then add the UVP/scenario layer and handoffs.
- Existing UVP/handoff review: reread with fresh eyes, improve missing suite coverage, scenario detail, evidence contracts, and handoff self-containment.

If the user invokes this together with an idea/research skill, do the work in order: research first, UVP layer second, handoffs third.

## Canonical Workflow

Follow this order unless the user explicitly asks for a narrower review:

1. Identify the mode: new idea, existing research document, or UVP/handoff review.
2. Announce the relevant skills you will use and why.
3. Read repository instructions and local workflow conventions before choosing output paths or validation commands.
4. If there is no adequate research document, create or deepen it first with `idea-to-research`.
5. Read `verify-authoring` before designing package shape, suite taxonomy, capabilities, checklist items, or TESTS.md fields.
6. Study comparable local UVP packages, handoffs, tests, code surfaces, product commands, frontend routes, design references, retained evidence, and official external docs where applicable.
7. Add or improve the research document's UVP layer: package shape, scenario phases, suite taxonomy, evidence contract, manual checklist requirements, final report shape, stop-the-line rules, completion criteria, and requirement-to-proof crosswalk.
8. Write the UVP contract handoff as a self-contained authoring prompt.
9. Write the implementation goal handoff as a self-contained execution and validation prompt.
10. Reread all new sections and handoffs fresh, repair gaps, then run lightweight validation appropriate to the files changed.
11. Put a copyable fresh-eyes re-read prompt as the absolute final section of each UVP contract handoff or implementation handoff when the user is expected to reuse that prompt in a later session.

Ask a clarifying question only when the missing answer changes the proof boundary in a way local context cannot resolve, such as which product is in scope, which research document to modify, or which design/reference target is authoritative. Otherwise proceed with a reasonable assumption and record it in the research document or handoff.

## Operating Principles

- The research document remains the source of truth. Handoffs and UVP package requirements should derive from it, not from hidden conversation memory.
- The UVP proves product behavior. It must not become a private checklist, demo script, fixture-only proof, or production-code shortcut.
- The workflow must fit the project in front of you. Discover local conventions for docs, prompts, packages, tests, browser tooling, issue tracking, and commit policy before choosing paths or commands.
- Resolve the existing surface package before choosing package shape. Prefer a lineage delta and scoped view for a feature touching an owned surface. Create a new package only for a genuinely new or independently owned surface; a feature name alone is not a package boundary.
- Every important acceptance claim needs a traceable proof owner: suite id, checklist item id, artifact, final report field, or stop-the-line condition.
- Blocked is a valid truthful result. If a real platform, credential, provider, browser, data, or product prerequisite is unavailable, require retained red/blocked evidence instead of substituting a fake path.

## Skills To Compose

Use the smallest set that fits the request:

- `idea-to-research`: when no research document exists, or the research document is shallow and needs a full source-of-truth pass.
- `verify-authoring`: always before designing a UVP contract, suite taxonomy, TESTS.md shape, manual checklist items, or evidence requirements.
- `intent-to-handoff`: when creating UVP authoring and implementation goal handoffs.
- `verify-ops`: when a handoff includes UVP validate/instantiate/run/report/greenlight operations or checklist verdict operations.
- `agent-swarm-cli`: for SwarmNet product command surfaces, CLI help requirements, daemon/session/runtime paths, and product evidence commands.
- `agent-browser` or the Browser plugin: when the feature includes frontend/browser/manual UX proof.
- Frontend/design skills only when the feature includes actual frontend design or visual consistency work.
- Project-specific skills named by the user or repository instructions.

If a relevant skill is unavailable, state that briefly and continue with the same workflow manually.

## Required Outputs

For a complete pass, produce or update:

- The research document, with explicit UVP contract and scenario sections.
- A UVP contract handoff, usually `docs/plan-hub/prompts/<slug>-uvp-contract-handoff.md`.
- An implementation goal handoff, usually `docs/plan-hub/prompts/<slug>-implementation-goal-handoff.md`.
- A requirement-to-proof crosswalk in either the research document or handoffs.
- A copyable fresh-eyes re-read prompt at the very bottom of any generated handoff when the workflow expects iterative review. It must be the final section, with nothing after it, so the user can copy it separately.
- A short validation note stating what was checked and what remains unvalidated.

Use the repository's prompt/doc conventions when they exist. If the repo does not use `docs/plan-hub/prompts/`, choose the local equivalent, such as `docs/prompts/`, `prompts/`, or a user-specified directory, and state the choice.

The crosswalk should map:

`requirement -> scenario phase -> suite/checklist item -> required artifacts -> final report fields -> stop-the-line rule`

The research document is the source of truth. The handoffs should not contain hidden requirements that are absent from the research document.

## Source Study

Before writing UVP requirements, read enough source material to avoid vague or impossible proof contracts:

- Repository instructions such as `AGENTS.md`, `CLAUDE.md`, `README.md`, testing policy docs, and local workflow docs.
- The full target research document and any linked source docs.
- Existing similar UVP packages: `TESTS.md`, `docs/spec.md`, `docs/architecture.md`, `docs/tdd.md`, and all suite files.
- Existing similar handoffs in the repo, especially prior UVP contract and implementation goal prompts.
- Product code surfaces that own the feature, including CLI commands, daemon handlers, services, runtime adapters, frontend routes, data models, tests, and docs.
- Current command help for any product commands referenced in the handoffs. Handoffs may name product surfaces, but the current binary help is authoritative for exact flags.
- Retained evidence/reports if the work is a follow-up to a prior proof.
- Current official external documentation when the proof depends on platform behavior, third-party APIs, browser behavior, cloud services, device permissions, OS features, or security configuration that may have changed.

For SwarmNet-style work, prior examples to inspect when present:

- `docs/plan-hub/prompts/*-uvp-contract-handoff.md`
- `docs/plan-hub/prompts/*-implementation-goal-handoff.md`
- `test-packages/*/TESTS.md`
- `test-packages/*/docs/spec.md`
- `test-packages/*/docs/tdd.md`
- `test-packages/*/suites/*`

Use `rg` or codebase search for exploration. Prefer exact code and docs over memory.

Do not treat these SwarmNet paths as universal. They are examples for SwarmNet-style work. For other repositories, derive equivalent local package, prompt, evidence, and test locations.

## Research Document UVP Sections

Add or improve sections equivalent to these. Names may adapt to the existing document style, but the content must be explicit.

### Proposed UVP Contract

State whether the work needs:

- One outer shipping UVP package, with suite families inside it.
- Multiple UVP packages, only when independent close gates are genuinely useful.
- A focus package plus a regression/baseline package reference.

First resolve existing surface ownership and package lineage. Within that boundary,
use a coherent view for the feature's obligations and split only where independent
ownership or acceptance is useful. Preserve existing earned proof through the
actual lineage/carryover procedure.

Use one outer package when the work shares one product story, one evidence root, one final report, and one operator greenlight.

Split packages only when at least one is true:

- separate features can ship independently;
- scopes or owners differ materially, such as backend runtime versus a separate frontend design system;
- one package is a prerequisite baseline and another is the implementation proof;
- platform/live proof is expected to be blocked while deterministic package work can still greenlight separately;
- the repo already has a package layering convention that requires it.

Include:

- package id and slug proposal;
- package directory layout;
- source-of-truth docs required inside the package;
- expected suite families;
- binding scopes and path globs;
- required capabilities;
- greenlight policy;
- staleness policy;
- prerequisite package/report policy if applicable.
- traceability crosswalk expectations.
- regression baseline expectations for adjacent behavior that must not break.

### Suite Taxonomy

Make every suite own a distinct proof obligation. Use current UVP semantics:

- `automated` + `command` for deterministic tests, schema checks, CLI checks, report validators, benchmark parsers, no-hardcode scans, lint/build/test gates, and artifact integrity checks.
- `checklist` + `manual` for live operating scenarios, visual review, UX judgement, no-shortcut review, environment/platform proof, and evidence correlation.
- `automated` + `swarm_session` only when a generic reusable session adapter exists for the subject. Do not invent a fixture-specific adapter or route backend proof through an unrelated UI preview.

Avoid narrative-only proof. If a claim matters, it must map to a suite, checklist item, artifact, or final report field.

For frontend/browser subjects, do not invent a `browser` execution mode unless the current UVP parser supports it. Browser evidence should usually be represented as manual checklist proof with retained browser artifacts, or as `automated` + `swarm_session` only when a generic adapter exists.

### Evidence Contract

Define the run root and required artifacts. Include enough structure that an operator or fresh agent can audit the claim without reading prose.

Evidence should normally include:

- command logs with command, exit code, stdout ref, stderr ref, timestamps, auth mode, daemon endpoint, and evidence refs;
- final report JSON and human-readable report;
- final doctor/diagnostics;
- artifact index;
- quality gates;
- UVP validate/instantiate/run/report/greenlight artifacts;
- checklist pass/verdict artifacts with evidence refs;
- negative assertion proof;
- provenance/current-HEAD proof;
- transcripts, screenshots, traces, diffs, VCS logs, data exports, benchmark samples, or runtime logs as appropriate to the feature.
- requirement-to-proof crosswalk output.

Every manual checklist verdict must cite concrete evidence refs from the retained run root.

### Step-By-Step Scenario

Write a realistic product scenario, not a list of infrastructure toggles. The scenario should use small but real work that exercises the feature in context.

Each phase should state:

- actor or user persona;
- product commands or UI actions;
- expected state transitions;
- data/workspace/runtime objects created;
- evidence retained;
- JIT gate to run before moving to the next phase;
- negative assertion or failure mode to prove;
- stop condition if a prerequisite is unavailable.

For backend/runtime features, scenario phases usually cover preflight, package validation, product setup, dispatch/runtime execution, data/workspace mutation, report generation, UVP checklist verdicts, and current-HEAD validation.

For frontend/app features, scenario phases usually cover build/start, primary user journey, alternate/edge journey, responsive coverage, keyboard/accessibility, console/network cleanliness, persistence/state refresh, visual/design consistency, and evidence capture.

For design-heavy frontend work, include the target design source: GX, VXG, screenshot, Figma/Stitch output, product style guide, or existing app convention. The UVP should prove both behavior and visual consistency, with screenshots or semantic layout evidence retained.

### Regression And Baseline Strategy

State what existing behavior this work could regress and how the UVP will guard it.

Specify an executable narrow repair command or selected suite, inspect its actual
scope with `verify run plan`, and record expected selection counts where supported.
Broader pre-close/gate checks follow stable candidate inputs. Reuse retained
capture/render artifacts for repeated interpretation when relevant input and
evidence identities still match.

Include:

- existing packages, tests, browser flows, reports, or retained evidence that serve as baselines;
- which baseline checks must run for final greenlight;
- which checks are advisory during inner-loop work;
- what current-HEAD provenance is required if scenario evidence predates later source changes;
- how stale, superseded, or earlier failed evidence is represented without pretending it passed.

### Manual Checklist Requirements

Define manual suites and item criteria before implementation starts. Obtain opaque
item IDs from the compiled runtime checklist; do not hand-author them or infer
them from list positions. Items should be specific and evidence-oriented.

Good manual items:

- name the exact claim;
- say what evidence proves it;
- say what evidence fails it;
- include negative assertions;
- include platform/prerequisite blockers;
- include user-observable UX acceptance when relevant.

Bad manual items:

- "Feature works";
- "Looks good";
- "Agent verified manually";
- any item that can pass without an artifact ref.

An agent can judge a retained video against an explicit avatar/action rubric.
Record actual observations, reviewer, reasoning and usable evidence references.
Reserve human-required criteria for obligations that need that person's judgment
or physical interaction. Compilation and deterministic behavior remain automated.

### Reconsidering The Plan During Execution

User steering, contradictory evidence or repeated work without information can
change the canonical design. Pause affected dispatch and checkpoint live work;
reconcile intent/contracts, suites/items, beads/edges, prompts and earned evidence
as retained, revised, superseded or new. Preserve matching proof and unaffected
work. A temporary scheduling conflict is not a permanent capability dependency.
Resume affected work on the reconciled inputs. Do not weaken acceptance merely
to obtain green or force all later design decisions before a bounded experiment.

### Final Report Shape

Define the machine-readable report schema or required top-level sections. Include:

- run id, start/end times, current commit, host/runtime environment;
- product objects created or modified;
- requirement-to-proof crosswalk summary;
- scenario phases and gate verdicts;
- evidence refs per claim;
- quality gates;
- UVP report and greenlight ids;
- stale/red/never-run suite summary;
- negative assertions;
- blocked-state representation;
- current-HEAD provenance if scenario evidence and final source commit differ.

### Stop-The-Line Conditions

State what must stop the run and produce red/blocked instead of green. Examples:

- prerequisite package missing, stale, red, or never-run;
- product path unavailable and only a mock/private path works;
- manual checklist without evidence refs;
- direct host edits used as proof when product workflow is required;
- hidden scripts used as product substitutes;
- synthetic roots, fake sessions, fixture-specific production logic, or narrative-only evidence;
- browser/manual UX evidence missing screenshots/traces when required;
- performance threshold missed without a truthful red/blocker.

### Completion Criteria

Make completion impossible to claim unless:

- UVP validates, instantiates, runs, reports, and greenlights truthfully;
- all required automated suites pass or are honestly blocked/red;
- manual checklist verdicts are set from retained evidence;
- no red/stale/never-run required suites remain for final greenlight;
- final report and artifact index are complete;
- current source state is proven;
- quality gates appropriate to changed files pass;
- changes are committed/pushed if the repo workflow requires it.
- the requirement-to-proof crosswalk has no orphan acceptance requirement.
- regression/baseline gates named by the UVP are either green or honestly red/blocked.

## Scenario Design Rules

Scenarios should be boringly real.

- Use product workflows, not helper-only scripts, unless the helper is the product surface under test.
- Use small realistic work payloads that a user would recognize as feature work.
- Keep fixtures generic and package-local. Fixtures may describe inputs and expected evidence, but must not become hidden orchestration scripts.
- Prove negative cases deliberately.
- Run just-in-time gates after meaningful slices. Do not defer all testing to the end.
- If a platform prerequisite is unavailable, record blocked/red evidence; do not substitute a mock path for final proof.

For performance work:

- define cold, warm, hot, and already-running paths separately;
- record raw samples, percentiles, timeouts, and bottleneck phase timings;
- specify sample counts for advisory runs and final greenlight;
- make missed targets red or blocked with evidence, not narrative exceptions.

For data work:

- define import/export, normalized data-at-rest, runtime state, stale/reimport behavior, contract compile/verify, violation, resolution, and final root linking;
- require evidence tying data roots to VCS/history/contract/report objects.

For agent/runtime work:

- require real transcripts, stdout/stderr, tool calls, command logs, session metadata, lifecycle events, claims/leases if applicable, and doctor rows.

For frontend/browser work:

- define real user flows, not only component snapshots;
- include browser evidence: screenshots, DOM/accessibility snapshots, console logs, network failures, responsive breakpoints, keyboard flow, persistence/refresh behavior, and relevant visual design comparison;
- if there is a GX/VXG/design reference, require explicit design consistency evidence against it;
- use manual checklist items for judgement-based UX/visual claims and automated command suites for deterministic tests.
- include failure-state and loading-state coverage when those states are user-visible.

For security/permission work:

- define the actor, privilege boundary, allowed operation, denied operation, audit evidence, and revocation/negative case;
- require current platform documentation or local policy evidence if behavior depends on an OS, cloud, browser, or auth provider.

## Handoff Structure

Create two self-contained handoffs. They must not rely on the current conversation.

Both handoffs should embed enough context for a fresh agent to act:

- exact read-first file paths and sections;
- relevant code surfaces with why they matter, not just filenames;
- key command families or UI/browser flows to inspect;
- required skills to invoke;
- current assumptions and facts to reconfirm;
- concrete deliverables;
- validation commands and blocked-state rules;
- final response shape.

Avoid phrases like "as discussed" or "the previous run" unless the artifact path and exact fact are named.

If you include copy/paste follow-up prompts, the reusable fresh-eyes prompt
must be the absolute final section, titled `Copyable Fresh-Eyes Re-Read
Prompt`. Do not place queued follow-ups between the opening sections and
read-first/source-study sections. The expected workflow is: copy/paste the main
prompt first, then copy the fresh-eyes re-read prompt from the very bottom.

### UVP Contract Handoff

Use this structure:

1. Title.
2. Opening: "Use this handoff to create the Unified Verification Package..."
3. `ULTRATHINK and be meticulous` directive.
4. Mission and package id/directory.
5. Concrete deliverables.
6. Required skills, especially `verify-authoring`.
7. Fresh-eyes audit requirements.
8. Read-first list with exact file paths and sections to focus on.
9. Pre-research findings the UVP must preserve.
10. Codebase surfaces to study.
11. Current codebase facts to reconfirm.
12. Required output structure.
13. Suite design requirements.
14. Evidence contract and final report shape.
15. Manual checklist requirements.
16. Step-by-step UVP scenario.
17. Performance/data/frontend/user-scenario thresholds when applicable.
18. Requirement-to-proof crosswalk.
19. Regression and baseline strategy.
20. Stop-the-line conditions.
21. Validation commands for package validate/instantiate.
22. Completion criteria and final response shape.
23. `Copyable Fresh-Eyes Re-Read Prompt`, as the absolute final section only
    when iterative review is expected.

This handoff is for package authoring. It should not tell the agent to implement product behavior except for narrow, generic verify-infrastructure fixes needed to validate the package.

### Implementation Goal Handoff

Use this structure:

1. Title.
2. Opening: "Use this handoff after the UVP package exists and validates..."
3. `ULTRATHINK and be meticulous` directive.
4. Mission and product proof chain.
5. Concrete deliverables.
6. Required skills, usually `verify-ops` plus product/domain skills.
7. Required first steps.
8. Fresh-eyes execution audit.
9. Codebase surfaces to study.
10. Understanding checkpoints before editing.
11. Product command or browser/UI anchors.
12. Non-negotiable product rules.
13. Expected missing seams.
14. Scenario execution phases with JIT gates.
15. Final report shape.
16. Validation commands.
17. Stop-the-line conditions.
18. Completion criteria.
19. Commit/push or handoff requirements from the repo policy.
20. Requirement-to-proof crosswalk expectations.
21. Regression and baseline requirements.
22. Final response shape.
23. `Copyable Fresh-Eyes Re-Read Prompt`, as the absolute final section only
    when iterative review is expected.

This handoff is for implementation and validation. It should require iteration until green or an honest blocked/red report.

## Fresh-Eyes Review Pass

After drafting, reread the research UVP sections and both handoffs as if you have no session context.

Check:

- Does every acceptance claim map to a suite, checklist item, evidence artifact, or final report field?
- Does the crosswalk expose any requirement that has no proof owner?
- Is there an explicit ordered workflow for UVP authoring and implementation?
- Are all file paths real or clearly proposed outputs?
- Are current parser-supported UVP fields used?
- Are valid suite kind/execution mode pairs used?
- Could a fresh agent author the UVP without asking what the feature means?
- Could a different fresh agent implement the goal without relying on hidden conversation context?
- Do the handoffs embed enough code/API/product context, not only file lists?
- Are product paths protected from fixture-specific branches and private scripts?
- Are manual checklist items evidence-based?
- Are frontend/browser flows user-realistic and not only visual smoke tests?
- Are regression/baseline checks named for behavior this work could break?
- Are external platform or third-party assumptions backed by current official docs or flagged as assumptions?
- Are blocked states represented honestly with `green=false`?
- Is current-HEAD provenance required when evidence and final source state diverge?
- Is the reusable fresh-eyes re-read prompt placed as the final section at the
  very bottom, after the main copy/paste handoff is complete?

If any answer is weak, revise before finishing.

## Validation

For documentation-only changes, run lightweight checks such as:

```bash
git diff --check
```

Validate a new or changed package with current commands. For an existing earned
instance, inspect its identity and use the supported lineage/delta flow when the
package changes; do not blindly instantiate it as a refresh. Read the actual
carryover disposition and re-earn only obligations whose proof is no longer valid.

For code changes, follow the repository's normal quality policy. In SwarmNet this usually includes scoped `ubs` on changed files and the relevant Cargo/Bun/browser gates named by the repo and the handoff.

## Final Response

Report:

- research document updated;
- UVP contract handoff path;
- implementation goal handoff path;
- crosswalk location;
- validation commands run and status;
- any regression/baseline expectations added;
- any remaining caveats or blocked items.

Package validation proves structural validity; it does not earn product acceptance.
Claim a package green only from the appropriate current `verify greenlight`
result and required evidence. Report a blocked/red result truthfully.
