# Product board

Status: draft for planning. Proposed milestones do not authorize implementation.
Canonical home: this document. Link here from other participating repositories.

## Current direction

- **Product goal:** <The complete useful result, including operation if required.>
- **Next demonstration:** <The smallest representative result that advances it.>
- **Next decision / priority:** <What matters now and why; reference milestone IDs.>

<Keep a first working example distinct from an operating-product promise when both
are required. Proposed architecture changes must also reach the canonical plan;
name any pending amendment rather than treating board prose as a completed redesign.>

## Completion policy

- Achieved means the stated outcome and quality threshold were demonstrated through
  the actual product/consumer path, with relevant required proof and review satisfied.
  A closed issue, merged PR, passing unrelated tests or generated artifact alone is
  insufficient. Partial, failed, stale, never-run or missing required proof stays open.
- Link existing inspectable evidence, observed result and relevant source/build/artifact
  identity; state important limitations. Historical proof is not automatically a claim
  about current source/deployment. Reuse valid proof rather than add a new test process.
- A producer milestone may be achieved before consumers exist; later consumers verify
  their own integration. A useful milestone need not wait for its entire track, but
  does not bypass applicable unit/release gates or erase remaining obligations.
- Changes to the promise require a reason and an affected-dependency check. Amend
  relevant plans/contracts and preserve prior identities/results. Do not weaken the
  promise just to claim completion. Correct contradicted current claims explicitly.
- Use Planned, Active, Blocked, Achieved or Superseded. Name blockers; distinguish
  externally reported completion from inspected proof. Record meaningful updates only.

## <Track or epic>

Owner/coordinator: <owner or session; mark unassigned where appropriate>.
Plan: <canonical plan link>. Execution: <guide, if started>.

### <TRACK-1> — <Short title describing a useful result>

**State:** Planned.

**Achieved when:**

- <Observable behavior on a representative input, with its actual consumer.>
- <Required quality/operational boundary; link the detailed plan or contract.>

**Unlock:** <What can now be done or used.>

**Needs:** <Milestone IDs and actual required output/stage, or none identified.
Say if preparation can begin before integration; do not imply all work must wait.>

**Evidence / next:** <Next representative check; when earned, link the observed
result, relevant identity and limitations. Reuse a report rather than copy its log.>

<Repeat track sections only as needed. A shared milestone appears once. IDs are
stable references, not ordering constraints. Split only for independently useful
results or real delivery/dependency boundaries; acceptance bullets are not new tasks.
Keep detailed implementation in linked plans. Future outcomes can stay one sentence.>

<For a larger board, optionally add a short ID/result/state index linked to these
entries. Keep state in that index OR the entries, not both. Avoid paragraph tables.>

## External workflow links (only when needed)

<Canonical external plan/tracker; owner; board-ID → original milestone/issue/PR;
last checked date/source; any meaningful acceptance mismatch or pending decision.
The external tracker owns task/release state; this board owns the shared outcome.
Do not infer project readiness from external issue closure or duplicate their task list.>

## Open questions and recent decisions

- Open — <decision, affected IDs, responsible owner and next action>.
- <Date> — <material change and reason; affected IDs/linked plan sections>.

Track coordinators reread at planning/start/resume/next-outcome boundaries and update
after meaningful results, blockers or steering. Before changing a milestone, check
its dependents and update affected plans/prompts; unaffected work continues. Preserve
other editors' changes. This board does not automatically wake agents or assign work.
Before publishing, reconcile the latest canonical Git revision and local edits by
milestone ID so another track's progress is not overwritten by a stale board copy.
