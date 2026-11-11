---
name: product-board
description: Plan and maintain shared product milestones in an existing GitHub board or Git-tracked document. Use when iterating related plans, adding tracks, recording useful outcomes, reconciling milestone changes or linking external epics and PRs. Keeps completion evidence-based without duplicating the current tracker or replacing execution workflows.
---

# Product board

When the user or repository already uses GitHub epics/milestones as its canonical
product/status board, apply the outcome, truthful acceptance and affected-dependency
principles here to that surface. Preserve its issue/PR authority; do not create a
parallel Markdown board or copy live issue bodies. The Markdown-specific layout
and file instructions below apply when a Git-tracked document is the chosen home.
Use [git-contractmaxxer](../git-contractmaxxer/SKILL.md) for authorized Git-native
delivery or coordinator takeover; a separate research board can retain small links
to exact external outcomes under the adapter guidance below.

Help people and agents choose useful product outcomes across tracks. Maintain one
ordinary Markdown board, normally `docs/PRODUCT-BOARD.md`, in the agreed repository.
Use the board named by repository instructions when one exists. For several repos,
choose one canonical home and link to it; do not maintain competing copies.

The board owns milestone definitions, priorities, dependencies and product status.
Plans own detailed intent/design; contracts and task systems own implementation
and proof obligations. Reconcile affected documents when decisions change them.
The board is agent-maintained coordination, not a scheduler or automatic gate.

## Plan with the human, then keep the plan alive

- **Preliminary planning:** read the supplied plans and current board; discuss
  the full intended product, useful demonstrations, overlaps and real prerequisites.
  Iterate on milestones
  and affected plan sections together before contractmaxxer starts. Draft entries
  are proposals, not implementation authorization. Do not generate units or beads
  just to populate the board.
- **Add a track:** inspect existing milestones and evidence; link the new work to
  the specific outputs it needs. Preserve active units, IDs, owners and valid proof.
  Backfill meaningful outcomes, not one board row per historical unit.
- **Independent track:** record its own useful outcomes and what they unlock;
  dependencies may be “None currently identified.” Do not invent consumers or
  build speculative interfaces. A future track can reference those results later.
- **Revise during development:** use the impact check below. Contractmaxxer's
  research/contract phases may improve the board within current authority; it is
  not frozen at the end of the human's initial planning discussion.

Keep the **product goal** separate from the **next demonstration**. A first working
example can expose assumptions early without satisfying a promise of repeatable,
operable delivery. Preserve both where the user needs both; do not impose a demo/MVP
pair on every track. “Small first” controls the next useful step, not the total scope.

Milestone discussion may reveal architecture or operational changes. Develop those
in the canonical plan, then reconcile the concise board outcomes; a board-only
rewrite is not a completed plan amendment. During joint iteration, mark the affected
proposal and the pending plan change explicitly. If the user asks for plan-first
work, finish that affected plan revision before presenting dependent milestones as
settled. This does not freeze all future planning or block unrelated authorized work.

Start from [BOARD-TEMPLATE.md](BOARD-TEMPLATE.md) only when a board is needed and
absent. Keep one section per track, or optional epic headings for larger goals.
Shared milestones appear once with a coordinating owner and contributing links.
Split files only when actual size/ownership justifies it. Do not impose a milestone
count, hierarchy depth or new naming system on an existing useful board.

Each milestone needs a stable ID, an observable outcome/achieved-when statement,
its **unlock** (what can now be done or used), actual dependencies, state and a
proof or next-step note. “Unlock” is part of the milestone, not another artifact.
IDs survive renaming/reordering and do not imply execution order. Link the plan,
owner and execution guide at the track level rather than repeating them every row.

Use `Planned`, `Active`, `Blocked`, `Achieved`, and `Superseded` when replaced or
retired. A blocked entry names the missing input or decision. Keep future outcomes
brief; detail the near-term demonstrations and interfaces another owner needs.

## Size and present useful outcomes

Split a milestone when a part is independently useful and can be truthfully accepted,
unlocks a real consumer earlier, or needs a distinct delivery/proof boundary. Keep
several checks together when they establish one coherent outcome. A long paragraph,
technology component or implementation task is not by itself a reason for another
milestone, unit or gate. When a consumer needs only an interface, name that interface
and its qualification evidence; do not wait for an unrelated full baseline study.

Use a short, user-readable result as the title. Put observable acceptance in a few
plain bullets, then **Unlock**, **Needs**, and **Evidence / next**. Bullets clarify a
promise; they are not independently closable tasks or a second checklist database.
Keep architecture, commands and detailed proof in linked plans/contracts/reports.
Do not lose requirements while shortening: move detail to its canonical source or
retain it until that amendment exists. Future milestones can stay one sentence.

Prefer entries over wide tables containing paragraphs. A larger board may add a
compact ID/result/state index for scanning; keep current state in one place and
link to the detailed entries. Do not duplicate dependencies or build a second
dashboard. Before saving, check whether a human can quickly find the product goal,
what is usable, what comes next and what is waiting; and whether an agent can tell
what would prove or falsify the next outcome. Refine unclear wording first, split
only when a real boundary is missing. This is an editorial check, not a new gate.

## Truthful milestone completion

Mark **Achieved** only when all conditions below hold for the current promise:

1. **The promised outcome happened.** Exercise the actual consumer/product path
   on representative inputs. Implementation, a merged PR, green unrelated tests,
   a generated file or the existence of a measurement is not equivalent to the
   behavior or quality threshold promised. Synthetic proof supports only a
   milestone explicitly scoped to synthetic behavior.
2. **Required proof and review are satisfied.** Reuse applicable UVP suites,
   checklists and accepted review; inspect their actual results and scope. Required
   red, stale, never-run, failed or missing obligations prevent achievement. A
   milestone can precede completion of a larger unit when its own required proof
   is earned; it does not close that unit or bypass any real prerequisite.
3. **Evidence matches the claim.** Link retained, inspectable proof with the
   relevant source/build/artifact identity, observed result and important limits.
   Component results from incompatible revisions do not prove integration. Keep
   historical acceptance distinct from a claim about today's source/deployment.
   If the promised result is an operating service, verify it remains available
   for its intended consumer; teardown of test resources must not remove that
   deliverable. A successful temporary run proves only the scope it exercised.
4. **No unresolved contradiction is hidden.** A failure of the promise keeps it
   Active or Blocked. Partial results and external “done” reports without suitable
   proof remain explicitly partial/unverified. An unavailable proof source is
   not evidence of success.
5. **Scope changes remain honest.** If evidence or authorized steering changes the
   promise, record why and reconcile affected plans/contracts and dependents before
   evaluating the revised outcome. Preserve historical IDs/proof and explicitly
   account for removed requirements. Never narrow the promise merely to turn it green.

A compact entry is enough: “Achieved <date>: <observed result>; <proof link and
relevant revision>; <limits>.” Reuse a completion report if it already contains
that information. Required independence comes from the applicable contract/repo
policy; this skill does not add a mandatory new reviewer, test suite or UVP package.
Compilation/deterministic checks are automated; visual quality may use an
agent-observed checklist with video/time references and reasoning. Use a human
when the outcome requires human participation or judgment.

A producer can achieve its milestone before any downstream track exists. A later
consumer proves its own integration. If it needs more than the original promise,
record the additional requirement; do not erase valid earlier work. If it exposes
a false current claim, correct that status and route the repair. An unchanged
immutable result may remain usable after other source code advances.

## Dependencies, updates and reflection

Name milestone IDs and the actual needed output. An ordinary qualifier suffices:
“X and Y before integration; preparation can start now.” Distinguish requirements
from preferences, shared-file contention and resource placement. Do not make a
whole track a dependency when a smaller achieved output suffices. Resolve real
cycles by reconsidering the needed output or sequence, not by inventing completion.

The track coordinator reads relevant entries at planning, start/resume, next-outcome
selection and before relying on a changed prerequisite. Update the board after a
meaningful result, new block, milestone close or scope/reflection decision. Workers
return results through the existing work plane; they do not all edit the board after
every bead. Use existing edit reservations/Git discipline and re-read before writing.
Before publishing, compare with the latest canonical Git revision as well as local
edits. Another track or machine may have advanced the shared board. Merge by stable
milestone ID, preserve newer evidence/state and proposed plan edits, and resolve
conflicting promises explicitly; never replace the board from a stale whole-file copy.

Before changing a promise or dependency, search its ID in the board and relevant
linked plans. Reconcile affected milestone entries, contracts, suites, beads and prompts
only where their inputs/obligations actually change. Pause affected dispatch and
preserve checkpoints/healthy workloads; independent work continues. A priority or
wording edit alone needs no rerun. Reuse matching proof rather than binding every
suite to the whole board or creating a program-wide test gate.

Repeated effort without new information, rejected results, contradicted assumptions,
missed feedback expectations and user steering trigger thoughtful reconsideration of
the next product outcome. Use the existing contract reflection/amendment procedure;
a short unchanged decision is enough when the direction remains supported.

At that existing coordination cadence, notice verification that expands while
usable outcomes stand still. Name the next product result and what decision any
additional proof changes. Keep required quality/operational promises, but move
optional hardening off the critical path and amend overgrown contracts explicitly.
Do not create a second review schedule or equate checklist exhaustion with the
success of an experiment whose question is already answered. Preserve user stops.

Keep open questions and recent decisions concise, with affected IDs and the next
responsible owner/action. Git keeps history. A board entry does not wake an idle
agent, assign another person, authorize new work or broaden a worker's track scope.

## External workflow adapters are a few board lines

For an external track, record its canonical plan/tracker URL, owner, board-to-external
milestone/issue/PR mapping, and the date/source of the last meaningful status check.
Add the expected output/acceptance difference only if it matters to this dependency.
Use those existing IDs; do not clone their task list into Beads or create an adapter
service, new ledger or compulsory UVP adoption.

The external workflow owns its implementation status, assignments and release rules.
The board owns this product's milestone and dependency claims. Read current issue/PR
state and relevant evidence; draft, reviewed, merged, deployed and useful are different
facts. External closure satisfies a board milestone only if its scope and proof meet
the board's promise. Where inspection is unavailable, label the status as reported
and keep the affected completion claim unverified. A specifically accepted owner
review can be evidence; do not silently substitute an issue checkbox for one.

Surface disagreements (such as a different SDK, data format, camera source or release
requirement) as an open decision naming affected milestones. Do not decide another
participant's commitment or rewrite their tracker silently. Prepare bounded amendments
and follow that repository's existing publication/approval rules. Routine local board
maintenance within authorization needs no new approval ritual. Existing PR/issue links
are enough for the first adapter, including Ballot's epic/PR workflow.

## Contractmaxxer and repository routing

When a board exists, planning uses it alongside canonical research, unit selection
uses its actual dependencies/priorities, and completion uses the policy above. Add
the board link and relevant milestone IDs to the existing guide/kickoff; do not copy
the whole board into prompts. Generated instructions remind the coordinator to
reread it at meaningful boundaries. A missing board on an unrelated single-track
task is not a blocker or permission to manufacture a new product roadmap.

Both AGENTS.md and CLAUDE.md should point to the board and this skill, state the
read/update boundaries, require evidence for Achieved, and require an affected-ID
check on changes. The board's own completion policy must be readable by humans and
external collaborators without loading this skill; adapt the template's short policy
to actual repository rules. Do not weaken existing unit or release gates.
