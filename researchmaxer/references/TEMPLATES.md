# Researchmaxer — Output Templates

These templates show the STRUCTURE of each generated prompt. When generating actual prompts, the `{placeholders}` are replaced with REAL research findings from Phases 1-2 — specific file paths, specific code patterns, specific test files, specific tensions. **No placeholder should survive into the final prompt.**

---

## Improvement Pass Template

```markdown
# {Feature Name} — Improvement Pass

**Date:** {YYYY-MM-DD}
**Target Document:** `{target_doc_path}` ({line_count} lines)
**Scope:** Deep improvement of the feature document from every dimension

---

## Your Mission

You are performing a deep analysis and improvement of the {feature_name}
research document. In a single session, you will:

1. **Research** — read the target doc, context docs, and study the codebase
2. **Improve** — strengthen every weak section, fix misalignments, add depth
3. **Edit** — apply all improvements directly to `{target_doc_path}`
4. **Verify** — run the fresh-eyes follow-up (Step 10 below)

You are NOT implementing anything. You are making this document the best
possible foundation for implementation.

**You edit EXACTLY ONE FILE:** `{target_doc_path}`
All other files are READ-ONLY context.

---

## Source-of-Truth Hierarchy

```text
Target doc  = what you are improving (the feature's authority)
Project docs = existing system context (READ-ONLY)
Codebase    = ground truth for what exists today (READ-ONLY)
```

If the target doc and project docs contradict on the feature, the target doc
wins. If the target doc assumes infrastructure that doesn't exist in the
codebase, that's a finding — flag it and propose how to address it.

---

## What To Read (Do This First)

### Target Document (PRIMARY — read fully, twice)
```text
{target_doc_path} ({line_count} lines)
```
First read: understand the architecture and key decisions.
Second read: identify gaps, assumptions, and weak reasoning.

{reading_notes_for_target_doc}

### Project Documentation (EXISTING SYSTEM CONTEXT — READ-ONLY)
```text
{for each context doc:}
{doc_path} ({line_count} lines)
  Focus on: {specific sections/topics relevant to the feature}
```

### Codebase Files (STUDY THESE — READ-ONLY)
```text
{for each integration surface discovered by subagents:}
{file_path}:{line_range}
  What it does: {brief description}
  Relevance: {how the feature relates to this code}
  Pattern to note: {coding pattern, type, API the feature should align with}
```

### Test Files (STUDY THESE — READ-ONLY)
```text
{for each relevant test file discovered by subagents:}
{test_file_path}
  What it tests: {description}
  Pattern: {testing pattern to follow}
  Gap: {what's not tested that the feature will need}
```

---

## Research Findings (Embedded — from researchmaxer analysis)

### Feature Value Proposition

{value_proposition_analysis — the Five WHYs results, core unlock,
competitive framing, contrarian bets — all from Phase 1.4}

### Integration Surface Map

{full integration surface map from Phase 2.1 — every file, every
change type, every dependency, every risk level}

### Codebase Patterns Discovered

{key findings from the Explore subagents — patterns, conventions,
reusable utilities, naming conventions, module structure}

### Tensions Identified

{full tension graph from Phase 1.5 — each tension with competing
goals, current resolution, why it might be wrong, stress-test scenarios}

### Terminology Alignment Issues

{from Phase 2.3 — where the doc's terms don't match the project's terms,
with specific examples from both the doc and the codebase/project docs}

---

## Document Quality Assessment

{full quality assessment from Phase 2.3 — strong sections, weak sections,
missing topics, coherence issues, integration readiness gaps}

---

## Improvement Directives

These are the specific improvements you should make, grounded in the
research findings above:

### Sections to EXPAND (add depth)
{for each:}
- **§{N} ({section_name}):** {what to add, grounded in codebase evidence.
  E.g., "Add failure mode analysis — the codebase handles disconnections
  via src/transport/reconnect.ts:45-80 using exponential backoff, but the
  doc doesn't address reconnection at all."}

### Sections to CORRECT (fix errors)
{for each:}
- **§{N} ({section_name}):** {what's wrong and what the correct version is.
  E.g., "Doc says 'JSON WebSocket frames' but codebase uses CBOR encoding
  (see src/transport/ws-codec.ts:78). Fix to CBOR."}

### Sections to ADD (new content)
{for each:}
- **{Topic}:** {what the new section should contain and why it's needed.
  E.g., "Add 'Agent Session Lifecycle' section — the codebase has a
  well-defined lifecycle (Created→Active→Hibernated→Terminated) in
  src/services/session-state.ts but the doc doesn't address state transitions."}

### Sections to STRENGTHEN (add precision)
{for each:}
- **§{N} ({section_name}):** {what's vague and what concrete detail to add.
  E.g., "§4.2 describes 'streaming output' but doesn't specify the protocol.
  The codebase uses AgentOutputStream (src/services/agent-output.ts) with
  typed message frames. Specify the exact frame types and flow."}

### Terminology to ALIGN
{for each:}
- **{term_in_doc}** → **{term_in_project}:** {why and where. E.g., "Doc says
  'data namespace' but project uses 'zone' everywhere (L0 spec §3.1,
  codebase src/core/zone.ts). Align to 'zone'."}

---

## Think Independently (CRITICAL)

After absorbing all the embedded research above, your process should be:

1. **Absorb the architecture.** Let it marinate. Don't rush to edits.
2. **Generate YOUR OWN questions** — the uncomfortable ones the research
   didn't ask. What feels off? What's suspiciously clean?
3. **Research externally** where YOUR analysis identifies gaps — what prior
   art, best practices, or production systems are relevant?
4. **Think about what's missing entirely** — not just weak sections, but
   entire topics the doc should address but doesn't.
5. **Challenge the approach** — what would an adversary architect do
   differently? What would a competitor say is wrong?

The improvement directives above cover the KNOWN issues. Your value is
finding the UNKNOWN issues that the research couldn't anticipate.

Trust your instincts — if something feels off, chase that feeling.

---

## Non-Negotiables (Don't Change These)

{non_negotiables — existing system constraints, author's locked decisions,
fundamental architectural choices that are not up for debate.
E.g., "Event-sourced kernel (swarmd) — this is the foundation, don't
propose replacing it." Or "Rust for L0-L2, TypeScript for L2.5 — locked."}

Everything else is fair game for improvement.

---

## What I Don't Want

- Don't rewrite strong sections for the sake of it — only improve weak ones
- Don't add ceremonial prose or filler
- Don't edit any files except `{target_doc_path}`
- Don't change non-negotiables
- Don't turn the research doc into an implementation plan
- Don't just summarize — add original analysis and depth

## What I Do Want

- Every weak section strengthened with concrete, codebase-grounded detail
- Terminology aligned with project conventions
- Usage patterns clear for both human users and AI agents
- Integration surfaces precisely documented
- Feature design that seamlessly fits the existing codebase patterns
- **Ideas I haven't asked about** — what am I missing entirely?

---

## Follow-Up Fresh-Eyes Pass

> **Run this in the same session immediately after completing all improvements.**

Now re-read `{target_doc_path}` with completely "fresh eyes." Use ultrathink.

Ask yourself:

1. **Coherence:** Do all sections agree with each other? Is terminology
   consistent throughout? Does the narrative flow logically?

2. **Bolted-on test:** Do any sections feel "added" rather than integrated?
   If review feedback was incorporated, does it feel native to the doc?

3. **Completeness:** Is every feature subsystem fully described? Are all
   edge cases addressed? Are failure modes documented?

4. **Integration readiness:** Does the doc use project terminology
   correctly? Does it reference existing system concepts accurately?
   Would a reader of both this doc and the existing project docs be
   confused by anything?

5. **Strength check:** Is every section STRONGER than before the
   improvements, or just different? Revert any changes that weakened
   the doc.

Fix anything that's off. This is the quality gate before the audit pass.
```

---

## Audit & Test Pass Template

```markdown
# {Feature Name} — Audit & Test Pass

**Date:** {YYYY-MM-DD}
**Target Document:** `{target_doc_path}` ({line_count} lines)
**Scope:** Comprehensive audit + testing strategy definition

---

## Your Mission

You are the last quality gate before this feature goes to implementation.
In a single session, you will:

1. **Audit** — find every gap, gotcha, and implementation risk
2. **Fix** — resolve all gaps directly in the target doc
3. **Define testing strategy** — create comprehensive test definitions
   including REAL end-to-end test manifests (not stubs or mocks)
4. **Verify** — run the fresh-eyes follow-up (Step 9 below)

After you're done, an implementation agent should be able to build AND
verify the entire feature using only this document and the test manifests.

**You edit EXACTLY ONE FILE:** `{target_doc_path}`
All other files are READ-ONLY context.

---

## What To Read (Do This First)

### Target Document (read fully — this has been through improvement pass)
```text
{target_doc_path}
```

### Project Documentation (READ-ONLY)
```text
{same context doc list as improvement pass}
```

### Codebase — Integration Surfaces (READ-ONLY)
```text
{same codebase file list as improvement pass, with any updates
from improvement pass findings}
```

### Existing Test Suite (STUDY CAREFULLY)
```text
{for each test file:}
{test_file_path}
  Framework: {jest/vitest/cargo test/playwright/etc}
  What it tests: {description}
  Patterns used: {describe testing patterns — helpers, fixtures, assertions}
  Coverage: {what's covered, what's NOT covered for this feature}
```

---

## Research Findings (Embedded — from researchmaxer analysis)

### Integration Surface Map
{same map as improvement pass — for reference during audit}

### Testing Landscape
{full testing landscape from Phase 2.2 — existing tests affected,
new tests needed, E2E flows, browser tests, infrastructure gaps}

### Codebase Testing Patterns
{from subagent findings — how the codebase structures tests, what
helpers exist, what fixtures are used, what E2E harnesses exist}

---

## Audit Directives

### Per-Subsystem Audit

For EVERY feature subsystem described in the target doc, verify:

```
For each subsystem:
  □ Design complete enough to implement? (no hand-waving)
  □ Failure modes documented?
  □ Edge cases addressed?
  □ Error handling specified?
  □ Integration with existing code described precisely?
  □ Data structures fully specified (field names, types, constraints)?
  □ State machines have all transitions defined?
  □ API contracts fully specified (endpoints, params, responses, errors)?
  □ What gotchas will implementers hit?
```

{for each subsystem identified in the target doc:}
- **{Subsystem name} (§{N}):** {specific audit focus areas based on
  research findings. E.g., "Verify the streaming protocol matches
  AgentOutputStream's frame types. Check that the Hibernated→Active
  transition handles stale session data correctly."}

### Cross-Cutting Audit

```
□ Contradictions between sections?
□ Dependency cycles between components?
□ Assumptions about infrastructure that doesn't exist?
□ Security considerations addressed?
□ Performance implications documented?
□ Backwards compatibility considered?
□ What's the weakest point in the design?
□ What would a hostile code reviewer challenge?
□ What would break first under load?
```

### Integration Audit

```
{for each integration surface:}
□ {file_path}: Is the feature's interaction with this code fully specified?
  Current behavior: {what it does now}
  Feature impact: {what changes}
  Risk: {what could go wrong}
```

Fix every gap you find by editing the target document directly.

---

## Testing Strategy Requirements

You MUST produce a comprehensive testing strategy as part of the target
document. This is not optional. Add it as a new section or significantly
expand an existing testing section.

### A. Existing Test Updates

For each existing test affected by the feature:

```
{for each test identified in the testing landscape:}
FILE: {test_file_path}
  Currently tests: {what it covers now}
  Required change: {what needs updating for the feature}
  Pattern to follow: {reference the existing test patterns}
```

### B. New Unit & Integration Tests

Define new tests needed. For each:
- What it validates (specific behavior)
- Test type (unit / integration)
- Which file to create or extend
- Pattern to follow (reference an exemplar test file)
- Key assertions

```
{for each new test identified in the testing landscape:}
TEST: {test_name}
  Validates: {specific behavior}
  Type: {unit/integration}
  Location: {file_path}
  Pattern: Follow {exemplar_test_file}
  Key assertions: {what must be true}
```

### C. End-to-End Test Manifests (CRITICAL — real, not stubs)

Define E2E test scenarios that exercise REAL feature behavior. These are
NOT mock tests — they run against actual runtime infrastructure and
simulate real agent/user workflows.

For EVERY feature subsystem, define at least one E2E manifest:

```
E2E MANIFEST: {scenario_name}
  Subsystem: {which part of the feature this tests}
  Preconditions:
    - {what must be set up before the test — real infrastructure}
  Steps:
    1. {concrete action — e.g., "Create agent session via POST /api/sessions"}
    2. {concrete action}
    3. {concrete action}
  Expected Outcomes:
    - {specific, verifiable result}
    - {specific, verifiable result}
  Verification Method: {how to check — API response, DB state, log output, etc}
  Failure Indicators: {what would indicate a bug}
```

These manifests must be detailed enough that an agent can execute them
autonomously against a real running system.

### D. Browser-Based Tests (where applicable)

For features with UI, web interaction, or visual output:

```
BROWSER TEST: {test_name}
  Tool: {Playwright MCP / agent-browser CLI}
  URL: {target page/endpoint}
  Steps:
    1. {navigate, click, type, etc}
    2. {interact with feature}
    3. {verify visual/functional outcome}
  Assertions:
    - {what to check — element presence, text content, visual state}
  Screenshot verification: {yes/no, what to compare}
```

### E. Verification Criteria

For EVERY feature subsystem, define what "correctly implemented" means:

```
SUBSYSTEM: {name}
  Implemented correctly when:
    - {specific, testable criterion}
    - {specific, testable criterion}
  Verify by:
    - {specific command or test to run}
    - {expected output}
  Regression check:
    - {existing test that must still pass}
```

---

## What A Great Outcome Looks Like

- Every feature gap identified and fixed in the target doc
- No implementation gotchas left undocumented
- Testing strategy covers EVERY feature subsystem
- E2E manifests enable full verification by an autonomous agent
- Browser tests defined for all user-facing features
- Verification criteria are specific enough to be automated
- A fresh implementation agent could build + verify the feature
  using only this document and the test definitions

---

## Follow-Up Fresh-Eyes Pass

> **Run this in the same session immediately after completing the audit.**

Now re-read `{target_doc_path}` with completely "fresh eyes." Use ultrathink.

Focus specifically on:

1. **Test coverage completeness:** Is every feature subsystem covered by
   at least one E2E manifest? Is there any path through the feature that
   has no verification criteria?

2. **E2E manifest quality:** Could an autonomous agent actually execute
   each manifest? Are the steps concrete enough? Are the expected
   outcomes specific enough to verify programmatically?

3. **Audit completeness:** Did you find and fix every gap? Read the doc
   as if you're the implementation agent — what questions would you have?
   If you have questions, the doc is not ready.

4. **Contradiction check:** Do the audit fixes contradict anything from
   the improvement pass? Is the doc still internally coherent?

5. **Implementation readiness:** Is the doc complete enough that an
   implementation agent would NOT need to ask clarifying questions?
   Every "TBD" or "future work" that blocks implementation must be
   resolved now.

Fix anything that's off. This is the FINAL quality gate.
```
