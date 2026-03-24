# Master Workflow -- Decision Tree (3-SOT)

Use this guide to determine which skill to invoke based on your current situation.

---

## Primary Decision Tree

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     WHICH SKILL SHOULD I USE?                               │
│                     (3-SOT Pipeline)                                        │
└────────────────────────────────────────────────────────────────────────────┘

Start here: What SOT documents exist?
│
├─── Step 0: Check if reset needed
│    │
│    ├─── Run: bd list --json | jq length
│    ├─── Returns 0 (clean)? -> SKIP reset, check SOTs below
│    └─── Returns >0 (has beads)?
│         ├─── Beads from THIS feature? -> SKIP reset, continue work
│         └─── Beads from OLD feature? -> [reset-workspace] first
│
├─── No research or spec?
│    │
│    ├─── Have a feature idea? -> [idea-to-research] first
│    └─── Then: Phase 0 [research-to-spec]
│
├─── Have research but no spec (SOT #1)?
│    │
│    └─── ACTION: Phase 0 -- Use [research-to-spec]
│         Input: research document
│         Output: Spec (SOT #1) + Architecture
│         -> Then: optimization pass (drift check vs research)
│
├─── Have spec (SOT #1) but no TDD (SOT #2)?
│    │
│    └─── ACTION: Phase 1 -- Use [spec-to-tdd]
│         Input: Spec + Architecture
│         Output: TDD + Bootstrap (SOT #2)
│         -> Then: optimization pass (drift check vs spec)
│
├─── Have spec + TDD but no strategy (SOT #3)?
│    │
│    └─── ACTION: Phase 2 -- Use [spec-to-strategy]
│         Input: Spec (SOT #1) + TDD (SOT #2)
│         Output: Implementation Strategy (SOT #3)
│         -> Then: optimization pass (drift check vs spec + TDD)
│
├─── Have all 3 SOTs but no beads?
│    │
│    └─── ACTION: Phase 3 -- Use [beads-from-sources]
│         Input: Spec + TDD + Strategy
│         Output: Self-contained beads
│         -> Then: [bead-plan-audit] for spec drift detection
│
├─── Have beads, not yet audited?
│    │
│    └─── ACTION: Use [bead-plan-audit]
│         Input: Beads + Spec + TDD + Strategy
│         Output: Improved beads, drift findings
│
├─── Have audited beads, no kickoff?
│    │
│    └─── ACTION: Phase 4 -- Use [beads-to-execution]
│         Input: Beads + 3 SOTs
│         Output: Kickoff prompt + status file
│
├─── Have kickoff, beads ready?
│    │
│    └─── MANDATORY STOP #1 -- Report to human
│         Wait for human to authorize execution.
│
├─── Execution complete, all beads closed?
│    │
│    └─── MANDATORY STOP #2 -- Report to human
│         Wait for human to trigger audit.
│         -> Phase 6: Use [bead-completion-audit]
│
└─── Everything corrupted or confused?
     │
     └─── ACTION: Use [reset-workspace]
          Then start over from earliest missing SOT
```

---

## Optimization Pass Decision Tree

```
┌────────────────────────────────────────────────────────────────────────────┐
│               SHOULD I RUN AN OPTIMIZATION PASS?                           │
└────────────────────────────────────────────────────────────────────────────┘

What document did you just create?
│
├─── Just created a Spec (SOT #1)?
│    │
│    └─── Drift check vs RESEARCH
│         * Every research finding in spec?
│         * No spec content exceeding research scope?
│         * Fix drift before proceeding to TDD
│
├─── Just created TDD (SOT #2)?
│    │
│    └─── Drift check vs SPEC (SOT #1)
│         * Every spec requirement has a test?
│         * Every test traces to a spec requirement?
│         * No stub tests?
│         * Fix drift before proceeding to Strategy
│
├─── Just created Strategy (SOT #3)?
│    │
│    └─── Drift check vs SPEC + TDD
│         * Every spec section maps to a phase?
│         * Phase gates reference TDD test IDs?
│         * No content in strategy (ordering only)?
│         * Fix drift before proceeding to Beads
│
├─── Just created Beads?
│    │
│    └─── Use [bead-plan-audit] -- formal drift check
│         * Every bead embeds spec verbatim?
│         * Every bead references TDD test IDs?
│         * No spec requirements missing from beads?
│
└─── Want to verify quality of existing doc?
     │
     ├─── Spec quality -> [researchmaxer] or manual checklist
     ├─── TDD coverage -> compare spec requirement list to test list
     ├─── Strategy completeness -> compare spec sections to phases
     └─── Bead fidelity -> [bead-plan-audit]
```

---

## Reset Decision Tree

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     DO I NEED TO RESET?                                     │
└────────────────────────────────────────────────────────────────────────────┘

What's your situation?
│
├─── Starting a completely new feature
│    ├─── Want to keep previous artifacts? -> NO RESET needed
│    └─── Want a clean slate? -> [reset-workspace] FULL
│
├─── Beads corrupted but SOT docs are fine
│    └─── [reset-workspace] MINIMAL (beads only)
│         Then: Re-run [beads-from-sources] from 3 SOTs
│
├─── Strategy wrong but spec + TDD fine
│    └─── Delete strategy document manually
│         Then: Re-run [spec-to-strategy]
│
├─── TDD wrong but spec is fine
│    └─── Delete TDD document
│         Then: Re-run [spec-to-tdd]
│         Then: Cascade pipeline from Phase 2
│
├─── Spec is wrong
│    └─── Fix the spec first (manual)
│         Then: Consider [reset-workspace] FULL
│         Then: Re-run entire pipeline from Phase 1
│
└─── Just want to clear AgentMail
     └─── [reset-workspace] with mail-only option
```

---

## Skill Selection Matrix

| Current State | Missing | Skill to Use |
|---------------|---------|--------------|
| Nothing | Everything | [idea-to-research] or manual research |
| Research only | Spec, TDD, strategy, beads | `research-to-spec` |
| Spec (SOT #1) | TDD, strategy, beads | `spec-to-tdd` |
| Spec + TDD | Strategy, beads | `spec-to-strategy` |
| All 3 SOTs | Beads | `beads-from-sources` |
| 3 SOTs + beads | Audit | `bead-plan-audit` |
| 3 SOTs + audited beads | Kickoff | `beads-to-execution` |
| Everything ready | Nothing | STOP #1 and report to human |
| Human approves | Execution | Execute (`bd ready --json`) |
| Execution done | Audit | STOP #2 and report to human |
| Human triggers audit | Findings | `bead-completion-audit` |
| Corrupted state | Varies | `reset-workspace` |

---

## Execution State Decision Tree

> **PREREQUISITE:** This section only applies AFTER human has authorized execution.

```
┌────────────────────────────────────────────────────────────────────────────┐
│        I'M IN EXECUTION (HUMAN AUTHORIZED) -- WHAT NOW?                    │
└────────────────────────────────────────────────────────────────────────────┘

bd ready --json shows:
│
├─── Empty array []
│    ├─── All beads completed? -> MANDATORY STOP #2 -- Report to human
│    └─── Beads exist but blocked? -> Resolve blockers
│
├─── Multiple beads available
│    └─── Pick based on:
│         1. No conflicting file reservations
│         2. Matches your expertise
│         3. Unblocks the most other work
│
└─── One or more beads available
     └─── Standard execution:
          1. bd update {ID} --status in-progress
          2. Read embedded spec + TDD in bead
          3. Implement
          4. Verify against TDD test IDs
          5. bd update {ID} --status done
          6. Commit with bead reference
```

---

## Error Recovery Decision Tree

```
┌────────────────────────────────────────────────────────────────────────────┐
│                     SOMETHING WENT WRONG                                    │
└────────────────────────────────────────────────────────────────────────────┘

What's the problem?
│
├─── "bd command not found"
│    └─── Install beads CLI or check PATH
│
├─── "No beads found"
│    ├─── All 3 SOTs exist? -> Run [beads-from-sources]
│    ├─── Missing strategy? -> Run [spec-to-strategy] first
│    ├─── Missing TDD? -> Run [spec-to-tdd] first
│    └─── Missing spec? -> Start from Phase 0
│
├─── "Spec doesn't match implementation"
│    ├─── Spec is authoritative -> fix implementation
│    └─── Spec is wrong -> fix spec, cascade through TDD + strategy + beads
│
├─── "Bead doesn't match spec"
│    └─── This is spec drift. Run [bead-plan-audit] to fix.
│
├─── "Circular dependency detected"
│    └─── Edit beads or [reset-workspace] minimal + re-run [beads-from-sources]
│
├─── "File reservation conflict"
│    ├─── Check who holds: list_contacts, fetch_inbox
│    └─── Wait or force_release if stale
│
├─── "AgentMail unreachable"
│    └─── Work locally, resume coordination when available
│
└─── "I don't know what to do"
     ├─── Check which SOT docs exist
     ├─── Find the first missing one
     └─── Invoke the corresponding skill from the matrix
```

---

## Quick Checks

### "What state am I in?"
```bash
# Check for SOT documents
ls {spec_path}                 # SOT #1: Spec
ls {tdd_path}                  # SOT #2: TDD
ls {strategy_path}             # SOT #3: Strategy

# Check for beads
bd list

# Check for kickoff
cat docs/plan-hub/status/active-plan.yaml

# Check for ready work
bd ready --json
```

### "What skill should I invoke?"
1. Run the checks above
2. Find the first missing SOT or artifact
3. Invoke the corresponding skill from the matrix

### "Should I reset?"
- Only reset if state is corrupted or you want a fresh start
- Prefer minimal resets (beads only) over full resets
- Never delete SOT documents unless they're fundamentally wrong
- Fixing a SOT doc means regenerating everything downstream
