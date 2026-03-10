# Planmaxer — Output Templates

## Handoff Prompt Template

```markdown
# {PROJECT} — {Domain Name} Deep Review Handoff

**Date:** {YYYY-MM-DD}
**Target Reviewer:** {GPT Pro / Claude / Agent}
**Scope:** {1-line scope description}
**Context Documents to Attach:**
- `{path/to/doc1}` ({Doc 1} — {what to look for})
- `{path/to/doc2}` ({Doc 2} — {what to look for})
- ...

---

## YOUR MISSION

You are a world-class {domain-specific expert type} reviewing the {domain}
architecture of {brief project description}. ULTRATHINK and be meticulous.
I need your absolute best work — the kind of insight that comes from deeply
understanding how {reference system 1}, {reference system 2}, and
{reference system 3} all approached the same fundamental problems
({problem framing}) and then transcending all of them.

Don't just answer my questions — those are the questions I KNOW to ask. The
questions I DON'T KNOW to ask are more important. {Domain-specific provocation:
what game-theoretic equilibrium / architectural pattern / industry practice
have I missed?}

**I hold {N} strong belief(s) you should engage with directly:**

1. **{Belief 1}.** {Context and why this belief might be wrong or could be
   pushed further.}

2. **{Belief 2}.** {Context and reasoning.}

For each proposed change, give me your detailed analysis and rationale/
justification for why it would make the project better along with the
git-diff style change versus the original doc. Reference the specific
document and section for each diff.

---

## THE VALUE THESIS

{1-2 paragraphs framing the project's core value proposition in terms relevant
to this domain. Not just "what it does" but WHY this specific design approach
creates outsized value. What is the key insight, the contrarian bet, the
"triple duty" moment where one design choice serves multiple goals?}

---

## WHAT {PROJECT} IS

{2-3 paragraphs of essential context. Define all project-specific jargon.
Include key technical constraints. Frame in terms relevant to this domain.}

**What a "{term1}" is:** {Definition for reviewer who has zero project context.}

**What a "{term2}" is:** {Definition.}

**Key constraints:** {Platform, math model, account model, etc.}

---

## CURRENT ARCHITECTURE

{Current architecture in this domain. Include:
- Account schemas / data structures / models (with field types)
- Key algorithms or flows (pseudocode or state machines)
- Invariants that apply to this domain
- Existing decisions (ADRs or equivalent)
Only include what's relevant to this domain — don't dump everything.}

---

## THE TENSIONS I NEED YOU TO RESOLVE

### 1. {Tension Name} — {Brief Framing}

{The tension: two legitimate goals pulling in opposite directions.
The current resolution and why it might be wrong.
Specific scenarios that stress-test the design.}

### 2. {Tension Name} — {Brief Framing}

{Same structure.}

### 3. {Tension Name} — {Brief Framing}

{Same structure. Include 3-5 tensions per handoff.}

---

## WHAT I DON'T WANT

- Don't propose {anti-pattern 1}. {Brief reason.}
- Don't suggest {anti-pattern 2}. {Brief reason.}
- Don't add complexity for {hypothetical case}. {What to focus on instead.}
- Don't hand-wave about {hard problem}. Show me the mechanism.

## WHAT I DO WANT

1. {Concrete deliverable 1}
2. {Concrete deliverable 2}
3. {Concrete deliverable 3}
4. **Ideas I haven't asked about** — {what paradigm/system/pattern should
   I be learning from that I haven't mentioned?}
5. **For each proposed change:** detailed analysis + rationale + git-diff
   style change vs the original doc (specify document and section)

{Final reminder of key constraints: platform, math model, non-negotiable
design principles, etc.}

{OPTIONAL — for native coding agents only:}
**IMPORTANT: Write your complete response as a markdown document saved to
`planmaxer/active/reviews/review-{domain}.md`. Do NOT modify any plan documents
directly — feedback integration is handled by a separate step.**
```

---

## Pre-Prep Prompt Template

```markdown
# {PROJECT} — {Domain Name} Reintegration Pre-Prep

**Date:** {YYYY-MM-DD}
**Session:** {Domain} feedback integration

---

## Step 1: Pre-Prep Research

~~~
First read ALL of the AGENTS.md file super carefully and understand everything.

{IF MULTI_THREAD:}
This session runs IN PARALLEL with {N-1} other integration sessions
({list other domains}) editing the same repo.

{IF AGENT MAIL MCP PRESENT — include setup:}
AGENT MAIL SETUP:
  1. ensure_project(project_key="{project_path}")
  2. register_agent(project_key="{project_path}",
       program="claude-code", model="claude-opus-4-6")
     → Note your assigned agent_name
  3. file_reservation_paths(
       project_key="{project_path}",
       agent_name=<your_name>,
       paths=[{exclusive file list}],
       ttl_seconds=7200, exclusive=true,
       reason="planmaxer-reintegration-{domain}")
{END IF AGENT MAIL}

FILE OWNERSHIP (this agent):
  YOUR FILES: {list of files this agent owns}
  DO NOT EDIT: {list of files owned by other agents}
  {section-level notes for any shared files}
{END IF MULTI_THREAD}

Now read these plan docs IN ORDER and understand the full architecture:
  {numbered list of docs with parenthetical notes on what to focus on}

Also read the handoff prompt that produced the feedback:
  {path to handoff doc}

Your goal: deeply understand the current architecture so you can critically
evaluate the reviewer's feedback. Pay special attention to:
  {bulleted list of domain-specific focus areas}

Use ultrathink.
~~~

## Step 2: Feedback Integration

~~~
Now integrate all of this feedback into the plan docs. For each proposed
change, tell me whether you agree, partially agree, or disagree — and
how strongly. Be honest about what's brilliant and what's wrong.

<INSERT REVIEWER RESPONSE HERE>

Rules:
  {per-file editing rules: which files to edit directly, which need mail-first}
  - Preserve all existing invariant IDs. New invariants get the NEXT available ID.
  - Preserve all existing decision/ADR numbers. New ones get the NEXT available number.


Be meticulous. Use ultrathink.
~~~

## Step 3: Fresh-Eyes Optimization

~~~
Now re-read the plan docs you edited with completely "fresh eyes":
  {numbered list of docs to re-read}

Ask yourself:
  - Is the feedback integrated cleanly or does it feel bolted-on?
  - Are there any contradictions between documents?
  - Are the invariants still internally consistent?
  - Are open questions updated to reflect resolved items?
  - Does the cross-reference index need updating?
  - Did any edit break cross-references to other docs?

Fix anything that's off.

Be meticulous. Use ultrathink.
~~~

## Step 4: Sync Pass

~~~
Now update {README/index docs} to reflect any architectural changes from
the integrated feedback. Write as if the architecture was always this way —
no "we changed X" language. This is canonical documentation, not a changelog.

{IF MULTI_THREAD:}
Update {cross-reference index} if any accounts, invariants, decisions,
or open questions changed (only edit sections you own).
{END IF}

Use ultrathink.
~~~
```

---

## Holistic Pass Prompt Template

```markdown
# {PROJECT} — Holistic Cross-Plan Optimization

**Date:** {YYYY-MM-DD}
**Scope:** Full-context cross-plan improvement pass

---

## Step 1: Deep Read

~~~
First read ALL of the AGENTS.md file super carefully and understand everything.

Now read the ENTIRE plan documentation set, cover to cover, in this order:
  {numbered list of ALL plan docs in dependency order}
  {cross-reference index last}

Build a complete mental model of the architecture. This is a UNIFICATION
pass — the goal is to find and fix cross-cutting issues that domain-specific
reviews couldn't see.

Use ultrathink.
~~~

## Step 2: Cross-Plan Improvement

~~~
Now re-read all plan docs with completely "fresh eyes." Look super carefully
for:

CONTRADICTIONS:
  - Same concept described differently in different docs
  - A rule stated in one doc violated by another
  - Inconsistent field names, types, or semantics across docs

TERMINOLOGY:
  - Same thing called different names in different docs
  - Terms defined differently in different places
  - Jargon used without definition

CROSS-REFERENCES:
  - Doc A implies something about Doc B but doesn't say it explicitly
  - Missing forward/backward references between docs
  - Stale references to sections that moved or were renamed

INVARIANTS:
  - Properties that are assumed everywhere but stated nowhere
  - Invariants that should cross-reference each other but don't
  - Invariant numbering gaps or duplicates

COMPLEXITY:
  - Things that could be simplified now that the design has matured
  - Abstractions that no longer earn their keep
  - Features deferred so long they should be explicitly cut
  - Duplicate mechanisms that could be unified

OPEN QUESTIONS:
  - Questions resolved by recent changes but not marked as such
  - New questions raised by recent changes but not captured
  - Questions that block more work than they should

Fix each issue with a small, targeted edit. Not one big rewrite.
Be meticulous. Use ultrathink.
~~~

## Step 3: Architectural Coherence

~~~
Now step back and evaluate the architecture as a whole:

  - Does every component serve a clear purpose?
  - Are the boundaries between components in the right place?
  - Is the dependency direction correct everywhere?
  - Are there circular dependencies or unnecessary coupling?
  - Is complexity allocated to the right places?
  - What would a senior architect challenge about this design?
  - What's the weakest point in the architecture right now?

If you find architectural issues, fix them with careful edits. For major
changes, explain the rationale before making the edit.

Use ultrathink.
~~~

## Step 4: Sync

~~~
Update all cross-reference documentation:
  - {README/index docs}
  - Verify all doc metadata (dates, revision numbers, status fields)
  - Ensure invariant numbering is contiguous
  - Ensure decision/ADR numbering is contiguous
  - Verify all open questions reflect current state

Use ultrathink.
~~~
```

---

## Domain Decomposition Heuristics

When auto-extracting domains, use these heuristics:

```
FINANCIAL SYSTEMS:
  Common domains: LP/liquidity, pricing/AMM, settlement, governance,
                  risk management, token mechanics

DISTRIBUTED SYSTEMS:
  Common domains: consensus, networking, storage, API/interface,
                  monitoring/observability, deployment

WEB APPLICATIONS:
  Common domains: data model, API layer, frontend/UX, auth/permissions,
                  infrastructure, testing strategy

PROTOCOL DESIGN:
  Common domains: core protocol, extension mechanisms, governance,
                  economic model, security model, upgrade path

GENERAL:
  Look for natural clusters around: data, compute, interface, policy
  Look for tension hotspots (where most open questions cluster)
  Look for complexity hotspots (largest/most-revised sections)
```
