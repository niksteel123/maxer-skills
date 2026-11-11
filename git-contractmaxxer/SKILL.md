---
name: git-contractmaxxer
description: "Plan, execute, steer or take over contract-driven feature delivery through GitHub issues and PRs. Use for Git-native collaboration, authorized AUTO execution, or replacing an orchestrator mid-workflow. Adapts existing plans, contracts, UVP and private tasks without resetting active work; ordinary isolated Git operations do not need this workflow."
---

# Git Contractmaxxer

Deliver useful product outcomes with inspectable acceptance and collaboration.
Use the project's existing plans, trackers and proof. GitHub is the shared work
plane when adopted; implementation methods beneath a feature remain flexible.
The primary may implement or delegate according to task fit and repository policy.

## Choose the entry point

| Request / observed state | Begin here |
| --- | --- |
| An idea or plan, before implementation | Ground intent and iterate useful milestones/features with the human |
| Existing ready issue or contract | Read its current acceptance and implement the next useful contribution |
| Resume, takeover, different coordinator/provider/host | Read [TAKEOVER.md](TAKEOVER.md) before dispatch or external mutation |
| New requirement, contradicted assumption or stalled progress | Use reflection and reconcile only affected work |
| Authorized AUTO over an agreed scope | Repeat the delivery loop within that scope and its stopping conditions |

These are entry points, not a compulsory stage chain. Do not restart planning
because the coordinator changed. A request to plan does not authorize execution.
Takeover preserves existing pauses; an explicit resume can revoke the affected
pause without waking unrelated tracks. Read only the references needed now:
[INTEGRATIONS.md](INTEGRATIONS.md) for adapters; [TEMPLATES.md](TEMPLATES.md) when
an issue, lane brief, PR note or continuation checkpoint actually needs writing.

## Apply local policy and act

Read applicable AGENTS.md/CLAUDE.md, directory rules, local appendices/imports and
current user directives. Resolve their declared precedence and scope, including
ownership, required proof/review, publication/merge/messaging authority and actual
exceptions. These rules remain effective when loading sibling skills or changing
harness; a helper's default stage chain or review ritual cannot restore an
explicitly overridden requirement. Surface a consequential unresolved conflict.

Within that policy, take the next useful action. Use sourced standing approvals;
do not ask again for routine work they cover. Owner-merge, inform-without-gating,
docs self-check, protected-branch review and human approval each apply where the
actual policy says so. If an action truly needs approval, finish authorized
preparation of its reviewable result, then ask with the exact policy source
and reason. Continue independent authorized work while it waits.

Before adding a process artifact, review round, check or watcher, identify its
consumer and the decision or observed defect it addresses. Reuse existing state;
omit additions that change no decision. Required proof remains binding until an
authorized amendment changes it. This is a decision check, not another worksheet.

Read canonical intent, target issues/contracts and recent decisions; inspect
actual code, target branch, relevant PR heads and evidence. Expand research where
the next decision needs it instead of ingesting an entire historical catalogue.

Resolve one canonical home per fact in the existing guide or checkpoint:

| Fact | Usual home |
| --- | --- |
| Product intent and architecture | Existing plan/spec/ADR |
| Feature acceptance, live owner and work status | Live GitHub issue, or the existing work plane during adoption |
| Shared interface semantics/version state | Repository spec/state registry and executable fixtures |
| Contribution, diff and review | Current PR and commit |
| Observed proof | CI/artifact report, manual observation or existing UVP record |
| Product milestone acceptance | Existing epic/milestone/board's achieved-when |
| Private implementation subtasks | Optional Beads or existing lane task list |

Copied status text and a previous agent's report are leads to inspect. Resolve
conflicting claims from live evidence and applicable authority; do not assume
the newest timestamp grants permission or that an agent-written brief can widen
human authorization. Re-read an issue before editing its body, preserve others'
decisions, and change only affected sections rather than replacing a stale copy.

Adopt existing names, issue hierarchy, branches, contracts and evidence locations.
A local-only/Contractmaxxer takeover can continue on its original work plane;
publishing or converting it to GitHub is a separate authorized change. Preserve
required UVP greenlights and unit gates until explicitly reconciled, even when
GitHub is chosen for the shared status surface. Never create parallel units,
issues, packages or a second roadmap merely to fit this skill.

## Plan useful outcomes and feature contracts

Begin with the intended product behavior and the earliest representative
demonstration or decision. Reuse existing epics/milestones. Detail work through
the next useful decision boundary; keep later outcomes brief and adaptable.
For an uncertain architecture, define a bounded experiment with real inputs,
resource/spend limits and a falsifiable result, then reconcile the finding.
Research can finish with an honest negative verdict.

Keep the full authorized product goal distinct from the first demonstration.
Staging a small contribution preserves the remaining scope and intended delivery;
it does not turn a demonstration into completion of the larger promise.

A feature has one accountable owner, an observable outcome, relevant consumers,
citable plan/interface requirements, acceptance and named proof routes. Include
needed inputs with their owners, real start dependencies, integration partners,
scope limits and remaining broader obligations. Use [the feature template](TEMPLATES.md#feature-contract)
only where existing content lacks these facts. Stable criterion IDs help multiple
PRs reference acceptance; do not retrofit them everywhere without a consumer.

Distinguish three contracts: feature acceptance, shared interface semantics, and
an optional executable proof package. An agreed interface is not implemented
behavior; a feature close does not itself freeze bytes. Apply the repository's
actual interface/version rules. Shared fixtures must be exercised by the named
producers/readers; declarations and unrelated unit tests do not prove wiring.

Split a feature for an independently useful outcome, distinct ownership or a real
delivery/proof boundary. One feature can receive several scoped PRs. Avoid fixed
unit counts, checkbox limits, universal refusal quotas and one issue per check.
Relevant material refusals/recovery belong in acceptance; imagined combinations
do not automatically become required hardening.

**Ready:** current scope/owner are clear, the written acceptance and proof route
are actionable, true start capabilities hold and required inputs are available.
Distinguish `Starts after`, `Integrates with` and `Inputs`. Only true start blockers
become native blocked-by links. A closed prerequisite still needs the consumed
capability; an unrelated open issue or milestone boundary is not a blocker.
When only part of an interface is needed, qualify that part rather than waiting
for the producer's entire roadmap. Unavailable device/data/access blocks only
the work that consumes it. Do not invent a kickoff approval where none applies.

## Delivery loop

1. **Select useful ready work.** Read current issue/PR discussion, unresolved
   owner/lane questions and the next product unlock. Recheck ownership, inputs,
   source identity and edit/resource conflicts. Continue independent authorized
   work while another slice waits; idle workers are not a reason to invent work.
2. **Implement or dispatch.** Before any delegation, including native children,
   use [fleet-controller](../fleet-controller/SKILL.md) and the governing model policy.
   Choose task-fit model/provider/effort before the adapter. Give a short brief
   linking current acceptance, exact source, scoped edits, proof and stop boundary.
   An issue assignee is not a file lock. Use the actual reservations/coordination
   mechanism; do not overwrite a peer's claim. See [INTEGRATIONS.md](INTEGRATIONS.md).
3. **Repair with focused feedback.** Run relevant exact tests against the real
   consumer, inspect matched cases and fix actual failures. Use representative
   real artifacts where the promise concerns them; label synthetic proof. Follow
   required repository checks without defaulting to a full suite per repair.
4. **Prepare a scoped PR.** Describe the actual contribution, satisfied criteria,
   evidence/review and remaining feature work. Use non-closing references for
   intermediate work and parents. Close only complete authorized targets. Open
   drafts at a useful reviewable point under existing publication authority.
5. **Review and integrate.** Apply actual repository review policy, including
   docs/self-check distinctions and required independence. Re-review affected
   material for unresolved findings, new evidence or a real policy requirement;
   an unchanged review does not need another round. Fix material findings;
   route unrelated valid defects to their real owner without making every one a
   new blocker. Check overlapping target-branch changes for semantic regressions,
   even when Git reports no conflict, before final applicable validation.
6. **Merge and reconcile.** Re-read current PR head, effective closing targets,
   applicable checks/review, comments and authority. Merge the checked candidate
   under server rules, with a head-match guard where supported. Fetch/verify the
   landed result and actual issue/project status; a successful command is not a
   substitute for observing its outcome. Preserve remaining obligations, inform
   affected consumers within messaging authority, then select the next outcome.

Use [the PR note](TEMPLATES.md#pr-contribution-and-evidence) for missing information,
not a second copy of every issue. Repository conventions take precedence over
the template. GitHub closing keywords can occur in commits as well as PR bodies;
inspect both. A head-match guard does not establish current-base integration or
protect against every concurrent update; observe the result before retrying.

## Proof and truthful completion

Each criterion needs the proof appropriate to its actual promise. Automated
compilation/state/byte checks, existing CI, a real consumer scenario, structured
agent judgment, human participation and UVP are complementary options—not a
requirement to run every option. Existing mandatory proof remains mandatory.
Automation proves deterministic behavior. Visual/avatar/action quality may need
an identified reviewer, retained video/frame/time references, observations and
reasoning. A video file, counter or measurement's existence is not its threshold.

Record relevant revision/build/artifact identity, actual tests/items and results,
evidence location, limitations and unresolved contradictions. Reuse matching
proof at its real input boundary and label reuse; do not call it a fresh run.
Changed code, fixtures, tools, device configuration or normative obligations
invalidate only the proof they affect, subject to actual final-gate policy.
Inspect the run plan before expensive UVP execution. Keep required broader
close/release checks outside the narrow repair loop.

**Feature Done** requires its current authorized acceptance, inspectable matching
proof and required review, with implementation verified on the target branch.
Where it promises a deployed/operable result, verify that result and its intended
availability. Partial work remains partial. Integration features exercise the
connected path; component greens alone cannot close them. Milestones/epics close
on achieved-when, not merged-PR counts or private task completion. Supersession
records a changed decision and preserved history rather than inventing a pass.

Later contrary evidence can falsify a current Done/Achieved claim. Correct that
claim through its authorized owner, preserve historical proof, and route a scoped
repair of the actual promise. A merged PR or inaccessible report cannot overrule
an observed failure; production recovery follows its own authority.

## Reflection and steering

At meaningful result/next-work boundaries, first representative demonstration,
contradiction, rejected outcome, repeated effort without new information, missed
feedback expectations or user steering, ask:

- What useful behavior or decision advanced, and what is still unproven?
- What current promise/material risk does the next check protect; what decision
  would it change? Would a different experiment, architecture or ordering help?
- Are a stale assumption, unnecessary dependency or verification loop delaying
  the next product outcome?

Record a changed decision briefly in the current work, not another audit schedule.
Reflect immediately when evidence warrants it; no arbitrary day-long stall timer.
When direction holds, proceed. When it changes, pause only affected dispatch;
reconcile canonical intent, criteria, interface consumers, PRs, proof and private
tasks as retained/revised/superseded/new. Preserve IDs, valid evidence, live work
and legitimate operational guarantees. Never weaken acceptance merely for green.
Frozen interface changes and cross-owner live dependencies follow actual policy.

If compilation dominates feedback, inspect targets, crate/dependency/feature
boundaries and rebuild causes. Separate preparation, compile, link and execution;
compare meaningful test-edit and production-edit loops. Choose a bounded measured
change with real consumer coverage; more crates or a filtered test alone is not
proof of a faster development loop. Keep the next product result moving.

## AUTO, stopping and continuation

Keep the authorized slice, applicable policy/standing approvals, budgets/resources
and stops explicit in the existing guide/checkpoint where needed for continuity.
Apply sourced scoped approvals to deployment/spend too; AUTO alone adds no such
authority or another person's commitment. Do not export one repository's approval,
meeting, model or deadline conventions into another.

Reconcile on results, relevant discussion/steering, resource changes and bounded
foreground waits while actual work is in flight. Observe work-specific receipts,
processes, outputs and reservations; silence is not death. A helper or background
job does not hold the coordinator's turn open. Avoid idle token loops and new
watchers without a concrete operational need. On a lane completion, reconcile
unfinished owned work and decide to continue/reassign/stop; do not assume it runs.

Finish when the authorized result is delivered, the user pauses, or the remaining
frontier genuinely requires unavailable input/authority/resources. State achieved
behavior, remaining acceptance, blocker/owner and literal next action. Preserve
healthy in-flight work and paid-resource custody. Do not repeat unknown-outcome
mutations/rentals or automatically continue into an unapproved milestone.

For a coordinator swap, use [TAKEOVER.md](TAKEOVER.md) and update one existing
compact checkpoint. Link durable facts instead of pasting the full transcript.
Expose useful product progress and blockers to humans; the private checkpoint
owns operational continuity, not a second public feature status database.
