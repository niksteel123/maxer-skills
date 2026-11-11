# Resume and coordinator replacement

Read this for a mid-workflow takeover, provider/host change, lost coordinator or
resume after interruption. The goal is the next valid action on existing work.
Keep the current workflow's acceptance and authority until a change is authorized.

## Three different operations

| Operation | What it preserves / requires |
| --- | --- |
| Resume the same provider conversation | Supported session ID/history, observed account/tool adoption and actual latest outcome |
| Replace the coordinator while workers continue | One dispatch owner; existing worker identities, claims, receipts, result channels and resource custody |
| Replace a worker | Reconcile its work/children, checkpoint and edit ownership; prove absence of conflicting execution before another mutator |

Do not equate a credential swap, fresh chat or pasted checkpoint with any of these.
Native children may be bound to the old parent and inaccessible to another
harness. Check supported history/result/steering APIs. A new coordinator cannot
claim it adopted children merely because it knows their IDs. It can sometimes
observe existing external work without attaching to the original chat; state the
actual capability. Losing access does not prove the worker stopped.

## Reconstruct before dispatch

Start from the current checkpoint and links. If none exists, reconstruct the
same facts from applicable repository/local instructions, user decisions,
issues/PRs, source and live receipts. Do not demand that the previous agent return
or paste an entire session. Read previous context on demand for unresolved decisions.

1. **Goal and authority:** current product slice, relevant plan/contracts and
   revisions, standing approvals with their user/policy source, ownership limits,
   budgets including commitments, pauses and explicit stops. Preserve sourced
   standing approvals that still apply; a bare old AUTO flag or agent assertion
   does not prove their scope. Explicit current user steering can supersede the
   affected old pause; preserve unrelated stops.
2. **Work and proof:** live feature/PR heads and discussions, true blockers,
   incomplete criteria, interface consumers and retained passing/failed/unknown
   proof. Read existing UVP instance/view/package and Beads state if this workflow
   uses them. Do not instantiate new proof or recreate tasks to obtain a clean slate.
3. **Source:** repository/remote, target and working branches, observed revision
   or explicit dirty-content identity, WIP owners, index state and relevant
   target-branch advances. Fetch safely where authorized; preserve local edits.
   Do not reset/stash/clean/switch a shared tree or replay old commits blindly.
4. **Live work:** previous coordinator and worker conversation/run IDs, tool
   adapters, receipt/output channels, actual liveness, file/resource leases and
   queued work. Include owned builds, tests, renders, devices, services and rentals
   as relevant. A finished supervisor may have surviving work; a stale assignee
   or expired lease proves neither life nor death.
5. **Unresolved operations:** inspect commands with lost/ambiguous responses.
   Query PR/issue state, receipt/artifact/rental/job identity or provider history
   before retrying. Unknown post-dispatch outcome forbids blind replay. Continue
   unrelated verified work when safe rather than declaring the whole product blocked.

Bound this orientation by the next decision. Missing information blocks only
dependent mutations. Local records must distinguish observed facts, inherited
reports, stale claims and unknowns. Never fill gaps with invented pass/approval.

## Establish one coordinator

The directing user's takeover instruction authorizes the requested coordination
work within existing scope; it does not prove the previous dispatcher is quiet.
Before conflicting writes or new dispatch, establish that the predecessor has
stopped issuing that work or yielded at a safe boundary through a supported,
authorized mechanism. Record the change in the existing ownership/checkpoint
surface. Preserve independent coordinators and their scopes.

Use existing control-file reservations/leases when applicable. Transfer or release
only ownership that is authorized and reconciled; do not force-release a healthy
worker's edit reservations to take the coordinator seat. If the prior dispatcher
is still active and no safe authorized transfer is possible, keep conflicting
actions paused, report that exact gap, and do useful non-conflicting inspection.
No special new lock service, global reset or compulsory all-agent restart is needed.

Keep healthy workers on their actual tasks and current conversations. Match their
next actions to latest scope; steer affected workers only through supported
communication and existing messaging authority. Preserve requests awaiting an
answer, review findings, owned devices and spending commitments. A controller
change does not transfer another human's module ownership or release decision.

## Move to the new harness or host

Use [fleet-controller](../fleet-controller/SKILL.md) for any new delegation and
[fleet-accounts](../fleet-accounts/SKILL.md) for account adoption/qualification.
Use the dedicated machine lane required by repository/fleet policy for remote
operations. Keep account/machine identities and access details in private state.

- Check that the new environment can read the same plans, work plane, receipts,
  private task DB when needed, artifact store and coordination service. Resolve
  host-specific paths and correct CWD instead of copying literal old home paths.
- Preserve existing Beads IDs/DB authority and Agent Mail project identity; a new
  checkout must not silently become a second stale coordination plane. Use each
  repo's instructed identity rules. Do not rename an identity simply to avoid a
  conflict or claim both machines own the same task.
- Verify actual tool/MCP, Git/SSH, source and model/account capabilities required
  for the next action. CAAM vault and isolated profiles are distinct; qualification
  must be current for dispatch. A credential-file swap is not identity adoption.
  Keep OAuth grants host-local; do not copy tokens, history secrets or a default
  account's files across hosts. Avoid blind daemon reload or process shutdown.
- Same-history continuation is provider/harness-specific. If unsupported, use a
  new coordinator context with this checkpoint; do not claim portable conversation
  migration. A new worker starts only after its predecessor's outcome/custody is
  reconciled. Completed immutable results can be consumed without rerunning them.
- Check the actual effect of any scoped frontend replacement on children before
  using it. A user-authorized coordinator swap is not permission to kill healthy
  builds/tests/captures. Preserve leases or renew through their actual owner.

## Keep the existing contract setup

Use this minimal mapping only where the next action needs it:

| Existing setup | Continuation behavior |
| --- | --- |
| GitHub feature and PRs | Keep issue acceptance and effective closure targets; resume the existing PR/next contribution |
| Contractmaxxer units plus mandatory UVP | Keep unit IDs, actual package/instance/view, gates, amendments and task graph; route unfinished stage work to its existing owner |
| Shared specs / milestones without issue contracts | Use their current acceptance and owners; draft only missing near-term acceptance; publication follows existing authority |
| Mixed trackers or multiple repositories | Identify one home per fact and link exact consumed outputs; do not clone task/status databases |
| Local-only plan or unavailable GitHub | Reconstruct and continue authorized local work; shared publication/status remains explicitly pending or unverified |

Adopting this orchestrator is not acceptance migration. A deliberately requested
workflow change accounts for affected criteria, units, packages, tasks, PRs and
prompts as retained/revised/superseded/new, with proof impact and owners. Preserve
valid history and independent work; do not silently convert a required greenlight
into a narrative PR checkbox. A changed coordinator alone invalidates no proof.

## First action and continuation record

After reconciliation, give a short factual checkpoint: current authorized result,
actual live work, important corrections to stale claims, unresolved operations,
ready frontier and literal next action with its owner. Reuse [TEMPLATES.md](TEMPLATES.md#continuation-checkpoint)
if no suitable checkpoint exists. Keep operational identities privately where
appropriate; public issues need progress/evidence, not raw control payloads.

Prefer collecting a completed in-flight result, answering a blocking lane question
or continuing an existing PR over launching a duplicate. Record the resulting
observation, including uncertainty, through the normal work plane. A read-only
takeover assessment can finish at that checkpoint; an authorized AUTO takeover
continues the delivery loop without an extra kickoff ritual.

On a later swap, refresh only changed current facts and next actions. Summarize
important decisions with source links; move historical detail out of the current
checkpoint. Do not append every progress update into an ever-growing prompt.
