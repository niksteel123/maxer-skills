# Master Workflow -- Quick Reference (3-SOT)

One-page cheat sheet for the 3-SOT implementation pipeline.

---

## Pipeline at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│  3-SOT SETUP (Master Workflow -- Automated)                      │
│                                                                   │
│  SPEC -> TDD -> STRATEGY -> BEADS -> AUDIT -> KICKOFF -> STOP    │
│   ↓       ↓       ↓          ↓       ↓        ↓                  │
│  SOT#1  SOT#2   SOT#3    .beads/  drift   kickoff                │
│                            +embed  check   .md                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ HUMAN HANDOFF REQUIRED
┌─────────────────────────────────────────────────────────────────┐
│  EXECUTION (Human Initiated)                                      │
│  EXECUTE -> STOP #2 -> AUDIT -> COMPLETE                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Skill Invocations

| Phase | Skill | Current Invocation | Trigger Phrase |
|-------|-------|-------------------|----------------|
| 0 | `research-to-spec` | `research-to-spec` | "Create spec from research" |
| -- | optimization | manual | "Check spec against research" |
| 1 | `spec-to-tdd` | `spec-to-tdd` | "Create TDD from spec" |
| -- | optimization | manual | "Check TDD covers all spec reqs" |
| 2 | `spec-to-strategy` | `spec-to-strategy` | "Create strategy from spec + TDD" |
| -- | optimization | manual | "Check strategy covers all spec sections" |
| 3 | `beads-from-sources` | `beads-from-sources` | "Create beads from SOTs" |
| -- | `bead-plan-audit` | `bead-plan-audit` | "Audit beads for spec drift" |
| 4 | `beads-to-execution` | `beads-to-execution` | "Prepare kickoff" |
| 6 | `bead-completion-audit` | `bead-completion-audit` | "Audit completed implementation" |

---

## Source of Truth Hierarchy

```
SPEC (SOT #1)      -> WHAT to build. Every requirement.
  ↓ feeds into
TDD (SOT #2)       -> HOW to test it. Real assertions.
  ↓ feeds into
STRATEGY (SOT #3)  -> WHAT ORDER. Phases + gates. Lightweight.
  ↓ all three feed into
BEADS              -> Self-contained. Embed spec + TDD verbatim.
```

**Rule:** If it's in the spec, it ships. No downstream doc cuts scope.

---

## Key Principles

1. **Spec ships.** If it's in the spec, it ships. Remove from spec to descope.
2. **Embed, don't paraphrase.** Beads contain spec + TDD verbatim.
3. **Strategy = ordering.** No content. ~500-800 lines.
4. **Drift checks everywhere.** Every optimization pass checks alignment with SOT above.
5. **Two mandatory stops.** Before execution and before audit.

---

## Optimization Pass Checklist

| After Creating | Check Against | Key Question |
|---------------|--------------|--------------|
| Spec (SOT #1) | Research | Every research finding in spec? |
| TDD (SOT #2) | Spec | Every spec requirement has a test? |
| Strategy (SOT #3) | Spec + TDD | Every spec section maps to a phase? Gates ref TDD? |
| Beads | Spec + TDD | Beads embed spec verbatim? All TDD IDs present? |

---

## Quick Decisions

| Situation | Action |
|-----------|--------|
| Have research, no spec | `research-to-spec` (Phase 0) |
| Have spec, no TDD | `spec-to-tdd` (Phase 1) |
| Have spec + TDD, no strategy | `spec-to-strategy` (Phase 2) |
| Have all 3 SOTs, no beads | `beads-from-sources` (Phase 3) |
| Have beads, not audited | `bead-plan-audit` |
| Have audited beads, no kickoff | `beads-to-execution` (Phase 4) |
| Everything ready | STOP #1 -- report to human |
| Human says "proceed" | Execute: `bd ready --json` |
| Execution done | STOP #2 -- report to human |
| Human triggers audit | `bead-completion-audit` (Phase 6) |

---

## Key Commands

### Beads CLI
```bash
bd list                    # List all beads
bd ready --json            # Show available beads
bd deps --tree             # Show dependency tree
bd update {ID} --status in-progress
bd update {ID} --status done
```

### SOT Document Checks
```bash
# SOT #1: Spec
ls {spec_path}

# SOT #2: TDD + Bootstrap
ls {tdd_path}

# SOT #3: Strategy
ls {strategy_path}

# Kickoff
cat docs/plan-hub/status/active-plan.yaml
cat docs/plan-hub/prompts/*-kickoff.md
```

### AgentMail (MCP)
```
macro_start_session(human_key, program, model)
send_message(project_key, sender_name, to, subject, body_md)
fetch_inbox(project_key, agent_name)
file_reservation_paths(project_key, agent_name, paths)
release_file_reservations(project_key, agent_name)
```

---

## Setup Workflow (Automated)

```
1. [research-to-spec] -> Spec + Arch (SOT #1)
   -> optimization: drift check vs research
2. [spec-to-tdd] -> TDD + Bootstrap (SOT #2)
   -> optimization: drift check vs spec
3. [spec-to-strategy] -> Strategy (SOT #3)
   -> optimization: drift check vs spec + TDD
4. [beads-from-sources] -> Beads (from all 3 SOTs)
   -> [bead-plan-audit]: spec drift detection
5. [beads-to-execution] -> Kickoff
6. STOP AND REPORT TO HUMAN
```

## Execution Workflow (Human Initiated)

```
Prerequisite: Human approval OR fresh session with kickoff prompt

1. bd ready --json -> pick bead
2. Read embedded spec + TDD in bead
3. Implement -> verify -> commit
4. bd update {ID} --status done
5. Repeat 1-4 until all done
6. STOP AND REPORT TO HUMAN
```

---

## Commit Convention

```
feat({BEAD_ID}): description
fix({BEAD_ID}): description
docs({BEAD_ID}): description
```

---

## File Locations

```
{spec_path}                    # SOT #1: Spec
{arch_path}                    # Architecture (companion to spec)
{tdd_path}                     # SOT #2: TDD + Bootstrap
{strategy_path}                # SOT #3: Strategy
.beads/issues.jsonl            # Beads
docs/plan-hub/status/          # Active plan config
docs/plan-hub/prompts/         # Kickoff prompts
artifacts/bd-{BEAD_ID}/        # Verification evidence
```

---

## Emergency

```
Everything broken?
  -> Start from Phase 0

Just beads broken?
  -> Re-run [beads-from-sources] from 3 SOTs

SOT doc wrong?
  -> Fix spec first, then cascade
  -> TDD, strategy, beads must be regenerated

Lost track?
  -> bd list --all
  -> bd ready --json
  -> Pick up from there
```
