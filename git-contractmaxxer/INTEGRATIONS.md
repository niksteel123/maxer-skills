# Work, proof and fleet adapters

Read the relevant adapter when selecting or changing it. Inspect installed help,
actual repository rules and observed capabilities; examples are not a promise
that a tool or flag exists. Missing optional tooling blocks only its consumed
operation. Do not create a dispatcher or migrate existing state merely to use
this skill.

## GitHub and existing trackers

Use qualified GitHub CLI/MCP APIs or another existing repository adapter. Resolve
repository, default/target branch, issue/PR conventions, merge/review rules and
available permissions, including applicable local appendices and sourced standing
approvals. Keep one coordinating writer per shared status surface. Prefer existing
native issue relationships/project automation; ordinary links work when types,
sub-issues, dependencies or Project permissions are unavailable.

Read-only examples, adapted to current help:

```sh
gh issue view ISSUE --repo OWNER/REPO --json number,title,body,state,assignees,comments
gh pr view PR --repo OWNER/REPO --json number,body,headRefOid,baseRefName,state,closingIssuesReferences,reviews,statusCheckRollup
gh pr diff PR --repo OWNER/REPO
```

Inspect effective closing targets and commit references, including the intended
merge message. An empty API field alone does not prove no commit can close an
issue. Closing effects depend on the actual default/target branch; recheck after
retargeting and observe the result. See [GitHub's linking rules](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/linking-a-pull-request-to-an-issue).

For stacked PRs, retain their actual bases/dependencies and preserve downstream
work while the base contribution lands. Reconcile the remaining diff against the
landed content, especially after squash/rebase, before judging its review, checks
and closure targets. Coordinate rewrites with active owners; a textual clean merge
or old green does not prove the resulting candidate. Keep branches/build roots
still consumed by another PR or live worker under their actual retention policy.

Where supported, `--match-head-commit` guards the selected PR head. Queue/auto-merge
acceptance is pending integration: retain the PR/head and required queue checks,
continue independent work, and observe actual landing or failure before retry or
completion. Follow [merge-queue/server rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-a-merge-queue)
without bypass flags; the guard alone does not pin every later queue candidate.

Read required/applicable checks and the subject they exercised. Empty status lists
and skipped/neutral/cancelled runs are not execution proof. An expected skip under
the actual applicability policy needs no extra approval or rerun; an unproven
required behavior still needs its proof or an authorized amendment. Diagnose the
actual failed/missing check instead of rerunning CI until green. See [GitHub's check semantics](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/troubleshooting-required-status-checks).

Store multiline publication text in a body file or a structured tool argument;
preserve newlines and literal text. Unknown create/merge/comment outcomes require
readback before retry, avoiding duplicate mutations. Decisions with shared meaning
move to the canonical spec/ADR; issue discussions remain linked history.

## Planning and contract skills

Use [product-board](../product-board/SKILL.md) when iterating related product
outcomes or maintaining an existing board. In a GitHub-native programme, use its
current epic/milestone achieved-when and dependencies; do not generate a duplicate
Markdown board. A separate research board can map to exact main issue outputs.

Reuse the grounded-intent, real-consumer and amendment principles of
[research-hardening](../research-hardening/SKILL.md) and
[research-to-contract](../research-to-contract/SKILL.md). Their normal artifact
contracts may require unit/pipeline outputs. Invoke those stage workflows when
the project uses them; otherwise apply the principles here without asking a
unit-producing stage to pretend it authored a different artifact.
Existing Contractmaxxer/Beads stages retain ownership during a takeover.

## Proof adapters

- **Repository tests and CI:** exact consumer tests in repair; applicable broader
  checks at close. Retain actual cases/results and source/artifact identity.
- **Agent/human review:** evidence-backed observation with subject, inputs,
  reviewer, result and limits. Use a human for criteria requiring participation
  or human judgment; do not invent a wearer run.
- **UVP:** read [verify-authoring](../verify-authoring/SKILL.md) when authoring
  or amending a package, and [verify-ops](../verify-ops/SKILL.md) for operations.
  Resolve existing surface ownership, package digest, instance and relevant
  suites/view before mutation. Use a scoped amendment with inspected carryover,
  not one new package per issue. Inspect `verify run plan` before costly runs;
  follow actual required greenlights and record checklist evidence/verdicts.
  The standalone Kit uses `uvp verify`; a qualified repo CLI can use its own
  adapter. Do not invent flags, instance IDs or passing verdicts.

A reusable test/checklist can cover several feature criteria without separate
executions when its actual subject and inputs match. Private artifact locations
must be accessible to the intended reviewer or labelled unverified. Publish a
small safe report/reference rather than tokens, raw transcripts or large payloads.

## Fleet policy versus the executable dispatcher

Use [fleet-controller](../fleet-controller/SKILL.md) before every delegation.
Resolve the governing owner-approved model pool; when a registry applies, compare
providers with task-fit scores/floors and allowed effort. Then choose a genuinely
available adapter. Record actual model/effort, reason and important exclusions
in the existing brief/receipt. Preserve healthy
work rather than switching it for provider diversity. Deterministic commands
need no paid reasoning model.
For a repo with no adopted registry, fleet-controller permits a bounded existing
adapter when the user explicitly authorizes choosing from available models. Use
observed eligible options and supported effort in the existing dispatch note;
label that basis honestly. A template is a starting point for deliberate adoption,
not the new owner's policy or an availability claim. This route does not relax an
existing registry, CAAM qualification or `uvp-fleet`'s executable requirements.
With neither governing selection policy nor that user authority, continue useful
primary work while resolving the actual choice; do not invent scores or access.

**Current `uvp-fleet` has a concrete Beads/Agent Mail ownership contract.** Its
dispatch reads the configured canonical Beads DB for a claimed task/assignee and
requires live exclusive file reservations. A GitHub issue number is not that
task ID, and a successful placement plan is not permission or proof of dispatch.

| Adapter | Use and retain |
| --- | --- |
| Existing native agent / qualified CLI or NTM worker | GitHub feature/criterion, actual branch/content, owner/edit coordination, session/run and result channel; actual model/effort/account capabilities |
| `uvp-fleet` | Explicit feature-to-private-task mapping, canonical DB/project identity and actual reservations, current fleet config/qualification, returned run/receipt IDs |
| Remote worker | The above plus exact synchronized source/build inputs and host capability; private machine lane per policy |

When `uvp-fleet` is selected, create only the bounded private task it actually
consumes if missing and authorized. Keep the mapping in its existing brief;
avoid mirroring the entire GitHub backlog into private epics. Use its installed
`plan`, `dispatch`, `probe`, `sync`, `accounts` and `reconcile` as appropriate,
with configured ownership and real qualified routes. Never bypass an ownership
failure or claim native execution is CAAM-isolated. If no eligible route exists,
report the exact limit and continue independent useful work within authority.

Use [fleet-accounts](../fleet-accounts/SKILL.md) for CAAM. Honor current profile
qualification and project/model access, host-local grants, bounded selection and
default-enabled eligible rotation. Authentication failure, model access and
usage exhaustion differ. Preserve conversations/children; after dispatch an
unknown outcome or rate limit requires a checkpoint/resume decision, not replay.
Do not turn an unrelated task into a fleet-wide account-repair campaign.

## Source, machines and resources

Reuse suitable existing checkouts and warm build roots. Shared work is valid
only with a compatible branch/content identity and disjoint edits. Different PR
branches can require an existing isolated checkout or justified worktree; record
owner, source, build root, storage and retention. Do not create one per agent.
Sync only a suitable clean idle tree by fast-forward, or use an explicitly pinned
dirty-content workflow. Never overwrite foreign WIP to make source status clean.

Place workloads where actual OS/tools/device access, memory/disk and slots fit.
Reserve constrained Unity/build/device resources through the existing mechanism;
an idle CPU does not imply an available editor or headset. Expose queued resource
needs and spending commitments in the current checkpoint. Retained proof and
operating services are not disposable scratch. Cleanup/deletion follows actual
authorization and verified absence of live references.

Second-machine operations use the dedicated qualified machine lane when required
by fleet/repository policy. Keep machine/account/access identities privately;
shared skills and public issues carry portable roles and source/result links.
