# Harmonymaxer — Output Templates

## Harmonization Handoff Template

```markdown
# {PROJECT} — Harmonize {Target_Docs_Description} From {Source_Description}

## Your Mission

You are harmonizing the {PROJECT} source-of-truth documentation around
{what_the_new_material_addresses}.

The {PROJECT} project currently has:
{current_state_summary}

Your job is to make the **{target_docs_description}** fully agree with the
{source_material_description}, so the documentation is internally consistent
{before_what_milestone}.

Think of yourself as a chief systems integrator updating the master technical
architecture set after {a_design_review_or_feature_addition}. The {source_type}
is the approved direction. Now the architecture docs must be synchronized so
implementation engineers are never forced to choose between contradictory
source-of-truth documents.

**You are editing documentation only. Do not change code.**

**Primary goal:** After this step, an engineer reading the {target_docs_type}
should have one coherent {domain_model}. No contradictions. No stale
{stale_wording_examples}.

**Secondary goal:** Produce a doc set that is implementation-safe. A fresh
implementation agent should not be able to justify mutually incompatible
designs by quoting different source-of-truth documents.

{IF_IMPLEMENTATION_CONTEXT}
---

## Current Implementation Context

You must keep the current program state in mind while doing this harmonization:

{implementation_state_description}

Use this as a worldview constraint:

- harmonize the docs so they reflect the intended long-term architecture
- but do not write as if {unbuilt_features} already exist in code
- make the documents clear about what is implemented, what is foundationally
  in place, and what remains future architecture
{END_IF}

---

## First Requirement

Before you touch any documentation, you MUST perform a deep-reading and
comparison pass of all relevant documents{and_affected_code_surfaces}.

This is not optional. Do not start editing after reading only the {source_type}.

You must:

1. Read the {source_type} in full
2. Read every relevant {target_doc_type} in full
3. Read the top-level overview/index docs in full
{IF_CODE_EXISTS}
4. Inspect the relevant code surfaces to understand implementation drift
{END_IF}
5. Make a private comparison matrix of:
   - intended architecture (from {source_type})
   - current documented behavior
{IF_CODE_EXISTS}
   - current implemented behavior
{END_IF}
6. Only then begin harmonizing the docs

You must not skip or collapse this research pass.

---

## What To Read (Do This First)

### Primary Source of Truth (START HERE)
```text
{source_material_path}
```

Read fully. This is the {source_type_description} to harmonize the docs around.

{source_content_summary}

You must not dilute or omit {source_key_conclusions} when harmonizing the docs.

### {Target_Docs_Label} (READ ALL RELEVANT DOCS FULLY)

These are the most important documents to harmonize.

```text
{primary_target_docs_with_paths_and_focus_notes}
```

{primary_target_critical_notes}

### Overview / Source-of-Truth Index Docs (READ FULLY)

```text
{overview_docs_with_paths}
```

These must be consistent with the updated {domain_model} after harmonization.

{IF_CODE_EXISTS}
### Current Code Surfaces (READ FOR IMPLEMENTATION DRIFT AWARENESS)

Read these carefully so you understand what the docs are currently lying about
or oversimplifying:

```text
{code_surface_paths}
```

You are not changing code in this step, but you must understand it.
{END_IF}

---

## Core Harmonization Goals

You must align the docs around the following points.

{numbered_harmonization_goals_with_subsections}

---

## Expected Document Changes

### Highest-Priority {Target_Doc_Type_Plural}

These must receive the most careful attention:

{primary_target_changes_with_section_specifics}

### Secondary But Important Docs

{secondary_target_changes_with_section_specifics}

### {Target_Doc_Type_Plural} That May Need Light Clarification

Only update if {domain_concept} wording is affected:

{light_touch_changes}

If a doc already matches the {source_type} direction, do not churn it
unnecessarily.

---

## Integration Rules

### What must be true after harmonization

{numbered_truth_requirements}

### What must stay out

Do not turn the {target_docs_type} into an implementation task plan.

Do NOT add:

- bead/task sequencing
- implementation step ordering
- "first implement X then Y"
- design iteration workflow
- tool-specific dev instructions

This is architecture harmonization, not execution planning.

### What must be added where appropriate

When the existing doc is too vague, add:

{specific_additions_list}

### Style rules

- preserve each document's local style and section structure where possible
- integrate carefully instead of dumping new appendices everywhere
- if a document already has the right conceptual section, update it in place
- if a concept is missing entirely, add a properly placed section/subsection

{IF_FEEDBACK_MODE}
---

## Reasoning Guidance

The source material is brief or unstructured in places. For the following
points, you must reason about implications before editing:

{reasoning_questions_for_ambiguous_points}

### Interpretation principles

{interpretation_principles}

### Where you must use judgment

{judgment_areas_with_constraints}
{END_IF}

---

## What a Great Outcome Looks Like

{success_criteria_as_bullet_list}

You should expect to edit documents until this standard is actually met, not
until you have only touched the "obvious" files.

---

## Deliverable

Output:

- updated harmonized documentation
- a concise change summary listing:
  - which docs changed
  - which {domain_concept} inconsistencies were resolved
  - any open issues that remain and why

At minimum you should expect to modify:

{minimum_expected_changes_list}

And any additional {target_doc_type_plural} that truly need {domain_concept}
alignment.

### Required final verification before you stop

Before finishing, verify all of the following:

- every modified doc was re-read after editing
- no modified doc still contradicts the {source_type}
- no modified doc still contradicts another {target_doc_type}
- no modified doc accidentally gained implementation sequencing content
{project_specific_verification_items}

---

## Follow-Up Pass (Queue After Main Work)

> Send this as a follow-up message in the same session after the harmonization
> is complete.

Now re-read the {source_type} AND every document you modified with completely
"fresh eyes." Use ultrathink. Do a contradiction hunt. Search for any remaining
stale wording around: {specific_terms_to_hunt_comma_separated}. Verify that
every document now tells the same story. Also verify that you did NOT
accidentally inject implementation sequencing or planning content into the
{target_doc_type_plural}. If any document still disagrees with the {source_type}
or another {target_doc_type}, fix it. {additional_followup_instructions}
```

---

## Harmonization Optimization Template

```markdown
# {PROJECT} — Harmonization Fresh-Eyes Optimization

## Your Mission

You are performing a comprehensive fresh-eyes optimization pass on the
harmonized {target_docs_description}.

The previous step updated the {target_docs_type} to match the {source_type}
direction. Your job now is to verify that the harmonization is flawless,
internally consistent, and implementation-ready.

Think of yourself as the final architecture QA reviewer before {next_milestone}.
The docs should now be stable enough that an engineer can implement without
guessing.

**You are editing documentation only. Do not change code.**

**Optimization standard:** do not settle for "mostly aligned." The docs should
be boringly consistent after this pass.

{IF_IMPLEMENTATION_CONTEXT}
## Current Implementation Context

Keep this implementation status in view during the audit:

{implementation_state_description}

This matters because the docs must not accidentally imply:

- that {unbuilt_features} already exist in code
- that {future_layer_mechanisms} are available as implementation shortcuts today
- that unresolved {current_layer} work can be deferred upward into unimplemented layers
{END_IF}

---

## What To Read (Do This First)

### Primary comparison source
```text
{source_material_path}
```

Re-read in full.

### Re-read every harmonized doc in full
```text
{all_target_docs_with_paths}
```

{IF_CODE_EXISTS}
### Current code surfaces (spot-check only where needed)
```text
{code_surface_paths}
```

You do not need another deep code audit, but if the harmonized docs say
something that no longer seems consistent with implementation drift, verify it.
{END_IF}

---

## Audit Checklist

### 1. Contradiction Hunt

Search every modified doc for stale or conflicting statements about:

{specific_concepts_to_hunt_as_bullet_list}

If two docs still disagree, fix them.

### 2. {Doc_Boundary_Label} sanity

Verify:

{boundary_verification_items}

### 3. Implementation readiness

Ask:

- can an engineer read only the docs and understand the exact intended {domain_model}?
{implementation_readiness_questions}
- could multiple engineers reading different docs derive the same implementation model?

### 4. Overreach check

Verify the docs do NOT:

- prescribe bead/task sequencing
- include implementation-step instructions
- blur into execution planning

### 5. Drift check against {source_type}

For each major topic in the {source_type}, verify it survived into the
harmonized docs:

{major_topics_as_bullet_list}

### 6. Coverage and omission check

Explicitly confirm that the harmonized docs now cover:

{coverage_items_as_bullet_list}

### 7. Absorption completeness

Verify the {source_type} is now redundant:

- every concept has a home in the target docs
- nothing was silently dropped
- an engineer does NOT need to read the {source_type} to implement

### 8. Terminology consistency

Verify all documents use identical terminology for:

{terminology_items_as_bullet_list}

---

## What To Improve

Fix any of the following if present:

{specific_patterns_to_fix_as_bullet_list}

---

## What a Great Outcome Looks Like

{success_criteria_as_bullet_list}

### Required final output summary

When done, provide:

- list of every document changed
- list of contradictions removed
- list of ambiguities tightened
- any remaining decisions that are genuinely product-policy choices rather
  than doc bugs

---

## Follow-Up Pass (Queue After Main Work)

> Send this as a follow-up message in the same session after the optimization
> pass is complete.

Now re-read the {source_type} and ALL harmonized docs one final time with
completely "fresh eyes." Use ultrathink. Imagine you are the implementation
engineer and the docs are the only thing you get. Could you still misread
anything about: {specific_concepts_to_verify}? Search every doc for stale
{domain_term} language and for hidden assumptions. If any ambiguity remains,
fix it now. This is the last architecture-quality gate before
{next_milestone_description}.
```

---

## Integration Type Heuristics

When classifying the integration type, use these heuristics:

```
FEATURE ADDITION:
  Signals: the source material describes something that doesn't exist
  in the current docs at all. New concepts, new data structures, new flows,
  new capabilities that extend the system.
  → Primarily adds new sections to existing docs
  → Main risk: new material contradicting implicit assumptions in existing docs
  → Key check: does the new feature's model conflict with existing patterns?
  → Harmonization is mostly additive — few existing sections need rewriting

ARCHITECTURE EVOLUTION:
  Signals: the source material describes a better version of something
  that already exists. Same domain, different approach or refined model.
  → Primarily modifies existing sections in docs
  → Main risk: partial updates leaving some docs on the old model
  → Key check: are ALL references to the old approach updated everywhere?
  → Harmonization requires careful find-and-replace across all docs

FEEDBACK CORRECTION:
  Signals: the source material points out problems, suggests improvements,
  or corrects misunderstandings in existing documentation. May come from
  external review, user testing, or implementation experience.
  → Mix of modifications and additions
  → Main risk: addressing the literal feedback but missing its implications
  → Key check: are cascading effects of each correction fully traced?
  → Harmonization requires reasoning about what feedback IMPLIES, not just says

CROSS-CUTTING CONCERN:
  Signals: the source material describes something that touches many
  layers/docs simultaneously. Security, auth, monitoring, governance,
  error handling, observability.
  → Affects many docs with tight consistency requirements
  → Main risk: docs telling slightly different versions of the same story
  → Key check: is the same concept described identically everywhere it appears?
  → Harmonization is the hardest — must coordinate changes across many docs
```

---

## Source Material Classification Heuristics

```
RESEARCH DOC (>500 lines, structured):
  Signals: clear section headers, data schemas, decisions/ADRs, invariants,
  state machines, detailed analysis, formal structure, numbered sections
  → Map source sections to target doc sections mechanically
  → Generated prompt can be very specific about placement
  → Less reasoning guidance needed — the source tells you what goes where
  → Focus: complete absorption, no detail loss, mechanical consistency

FEEDBACK (<300 lines, unstructured):
  Signals: bullet points, reviewer comments, informal notes, suggestions
  without full justification, no formal sections, conversational tone
  → Include reasoning questions for ambiguous points
  → Generated prompt must include interpretation principles
  → More reasoning guidance needed — the agent must infer implications
  → Focus: cascading effects, judgment calls, thorough implication tracing

HYBRID (mix of detailed and brief):
  Signals: some sections are well-structured research, others are brief
  notes, action items, or commentary
  → Treat each section independently based on its structure
  → Detailed sections get research-doc treatment (mechanical mapping)
  → Brief sections get feedback treatment (reasoning guidance)
  → Focus: ensuring brief sections get the same depth of integration
```

---

## Affected Document Priority Heuristics

When classifying which docs are affected:

```
MULTI-LAYER DOC SET:
  1. Check EVERY layer doc for references to concepts the source touches
  2. The "obvious" layers are almost never the only affected ones
  3. Cross-cutting concepts (auth, fees, governance, error handling)
     typically touch MORE layers than you initially expect
  4. Index/README/strategy docs almost always need light updates
  5. If in doubt, classify as "secondary" not "unaffected" — it's cheaper
     to verify a doc is fine than to miss a contradiction

SINGLE PLAN DOC:
  1. Check every major section for references to affected concepts
  2. Pay special attention to cross-reference sections
  3. Check invariant sections — new features may add or modify invariants
  4. Check decision/ADR sections — new features may add decisions
  5. Check open questions — some may be resolved by the new material

MIXED DOC SET:
  1. Treat the primary plan doc as always-primary
  2. Classify supporting docs based on concept overlap
  3. Pay attention to authority split — don't accidentally move
     authoritative content into the wrong doc
```
