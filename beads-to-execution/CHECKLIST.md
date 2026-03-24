# Beads to Execution Pre-Flight Checklist

A thorough checklist for verifying that beads-to-execution outputs are ready for multi-agent implementation.

---

## Prerequisites (Before Running This Skill)

- [ ] **Spec (SOT #1) exists**: Primary "what to build" document
- [ ] **TDD (SOT #2) exists**: Test specifications with real assertions
- [ ] **Strategy (SOT #3) exists**: Phase ordering + gate criteria (lightweight routing table)
- [ ] **Bootstrap exists** (optional): Environment setup companion to TDD
- [ ] **Beads exist**: `.beads/` directory with `br list --json` returning results
- [ ] **Mail server running**: `curl http://127.0.0.1:8765/health/liveness`

**Verification:**
```bash
# Check beads
br list --json | jq length

# Check mail server
curl -s http://127.0.0.1:8765/health/liveness | grep ok

# Check ready beads
br ready --json | jq length

# Check for cycles
bv --robot-insights | jq '.Cycles'  # MUST be []
```

---

## Deep Codebase Research (Step 1 — Most Important)

- [ ] **Spec read**: Extracted mission statement, subsystem count, success criteria count, completion milestones
- [ ] **TDD read**: Extracted test counts by type (UT/IT/E2E/VT/PERF), test infrastructure, testing stack
- [ ] **Strategy read**: Extracted phase ordering, task counts per phase, parallel tracks, gate criteria
- [ ] **Bootstrap read**: Extracted build/test/lint commands, environment prerequisites, CI setup
- [ ] **Codebase studied**: Found integration surface — APIs, types, wire formats, existing patterns
- [ ] **Bead metadata collected**: Total count, ready count, bead prefix, phase-to-epic mapping, entry point
- [ ] **AgentMail verified**: Server status, project key, coordination needs
- [ ] **Quality gate commands identified**: Exact shell commands for this project's stack

**Research Quality Check:**
- [ ] Can you name 5+ specific file paths that agents need to study? If not, do more research.
- [ ] Can you list the exact type names that cross integration boundaries? If not, read more code.
- [ ] Can you write the exact quality gate commands without looking them up? If not, find them.
- [ ] Do you know the exact bead prefix and which other prefixes to EXCLUDE? If not, check `br list`.

---

## Outputs Created (3 Total)

### Kickoff Prompt
- [ ] **File exists**: `docs/plan-hub/prompts/{feature}-kickoff.md`
- [ ] **Mission statement**: Feature-specific with bead count, completion milestone, scope
- [ ] **Source of Truth reading list**: All 3 SOT docs listed with read/skim/reference annotations
  - [ ] Spec (SOT #1) with specific sections to read deeply
  - [ ] TDD (SOT #2) with test count breakdown
  - [ ] Strategy (SOT #3) for phase ordering context
  - [ ] Bootstrap for environment setup
  - [ ] Architecture for system context
  - [ ] Key codebase files with what to study in each
- [ ] **Integration surface**: Feature-specific APIs, types, wire formats, existing code paths
- [ ] **Codebase structure**: Directory tree of what exists AND what this feature creates
- [ ] **Stack and toolchain**: Actual tools, versions, package manager
- [ ] **AgentMail registration**: Both `ensure_project` + `register_agent` AND `macro_start_session` paths shown, with project key
- [ ] **Beads & triage tools**: br/bv commands with bead prefix filter
- [ ] **Bead listing by phase**: Actual bead IDs, titles, dependencies, ready status
- [ ] **Work loop**: Coordinate → implement → verify → complete → announce → repeat
- [ ] **Quality gate commands**: Actual shell commands (not placeholders)
- [ ] **UBS severity guidance**: Language-specific Critical/Important/Contextual categories
- [ ] **Inbox polling discipline**: When to check inbox (before bead, every ~15min, after completing, when stuck)
- [ ] **QA gates**: Phase-specific gate checks + "announce loudly" pattern for phase completions
- [ ] **AgentMail coordination patterns**: Discovering agents, resolving conflicts, session handoff, asking for help
- [ ] **FILE_RESERVATION_CONFLICT handling**: Guidance for when reservations conflict + first/only agent guidance
- [ ] **Initiative rules**: "Never ask what to work on" directive
- [ ] **Critical rules**: Universal rules hardcoded (items 8-11) + feature-specific rules filled in
- [ ] **Phase structure**: Actual phases with parallel tracks and dependencies
- [ ] **Session Landing Protocol**: Push all work, release reservations, announce handoff
- [ ] **Multi-agent conflict rule**: Don't disturb other agents' changes
- [ ] **Environment setup**: From bootstrap document
- [ ] **Quick reference**: Documents table, phase-to-bead map, tools cheat sheet

### Push Prompt
- [ ] **File exists**: `docs/plan-hub/prompts/{feature}-push.md`
- [ ] **Short**: ~30-50 lines (NOT a full onboarding doc)
- [ ] **Starts with**: "Re-read AGENTS.md"
- [ ] **Project key**: Exact absolute path
- [ ] **Bead prefix filter**: Only `{prefix}.*` beads, lists which prefixes to ignore
- [ ] **7-step action list**: Finish → Check inbox → br ready → Claim → Read → Study → Implement loop
- [ ] **Quality gate commands**: Actual shell commands
- [ ] **"Do NOT stop" directive**: Explicit "don't ask, don't wait, just keep going"
- [ ] **Fallback when blocked**: QA checks, missing tests, Session Landing Protocol

### Status File
- [ ] **File exists**: `docs/plan-hub/prompts/{feature}-pipeline-status.yaml`
- [ ] **All 3 SOT paths**: spec, tdd, strategy
- [ ] **Bootstrap path**: If exists
- [ ] **Architecture path**: If exists
- [ ] **Bead metadata**: prefix, root epic, total count, ready count
- [ ] **Prompt paths**: kickoff and push locations
- [ ] **Project root**: Absolute path
- [ ] **Stack**: Primary stack summary

---

## Quality Bar Verification

### Feature-Specificity Test
- [ ] **Not generic**: Could this kickoff apply to a different feature by just changing the title? If yes → too generic.
- [ ] **Real file paths**: At least 10+ actual file/directory paths from the codebase
- [ ] **Real type names**: Actual type/struct/class names from the code (not `{SomeType}`)
- [ ] **Real commands**: Actual build/test/lint commands (not `{your_build_command}`)
- [ ] **Real bead IDs**: Actual bead IDs with actual titles (not `{bead-id}: {title}`)
- [ ] **Real bead prefix**: Actual prefix with explicit list of OTHER prefixes to ignore

### Structural Completeness Test
- [ ] **Self-sufficient**: Can an agent with ZERO prior context start implementing from this kickoff alone?
- [ ] **Integration surface covered**: Agent knows what APIs, types, and wire formats they're working with
- [ ] **Environment setup covered**: Agent can set up their environment from the kickoff
- [ ] **Coordination covered**: Agent knows how to register, claim beads, and communicate via AgentMail
- [ ] **Quality gates covered**: Agent knows exactly what commands to run before committing

### 3-SOT Alignment Test
- [ ] **Source of Truth hierarchy stated**: Spec > TDD > Strategy > Beads
- [ ] **Strategy is ORDERING ONLY**: Not treated as a content document
- [ ] **Beads are SELF-CONTAINED**: Agents implement from beads, spec only as tiebreaker
- [ ] **No audit prompt generated**: That's bead-plan-audit's job (upstream)
- [ ] **Uses `br` commands**: Never `bd`

---

## Final Verification

| Check | Command | Expected |
|-------|---------|----------|
| Mail server | `curl http://127.0.0.1:8765/health/liveness` | `ok` |
| Beads exist | `br list --json \| jq length` | `> 0` |
| Ready work | `br ready --json \| jq length` | `> 0` |
| No cycles | `bv --robot-insights \| jq '.Cycles'` | `[]` |
| Kickoff exists | `ls docs/plan-hub/prompts/*-kickoff.md` | File exists |
| Push exists | `ls docs/plan-hub/prompts/*-push.md` | File exists |
| Status exists | `ls docs/plan-hub/prompts/*-pipeline-status.yaml` | File exists |
| Kickoff has real paths | `grep -c "/" docs/plan-hub/prompts/*-kickoff.md` | `> 30` |
| Push is short | `wc -l docs/plan-hub/prompts/*-push.md` | `30-50` |

---

## Completion — STOP AND REPORT

Once all checks pass:

- [ ] **Report to human** (do not auto-execute)
- [ ] **Provide all 3 output locations**
- [ ] **State ready bead count**
- [ ] **Wait for explicit authorization**

```
Setup complete for {feature_name}

Kickoff prompt: docs/plan-hub/prompts/{feature}-kickoff.md
Push prompt:    docs/plan-hub/prompts/{feature}-push.md
Status file:    docs/plan-hub/prompts/{feature}-pipeline-status.yaml
Ready beads:    {N} available for execution

Awaiting your instruction to proceed.

Options:
1. Copy kickoff prompt to fresh session for implementation
2. Copy push prompt into existing session to continue work
3. Say "proceed" to execute in this session
4. Review beads first: br list --json
```

**DO NOT start executing beads. This is SETUP ONLY.**

---

## Troubleshooting

### Mail server not running
```bash
cd apps/mail && uv run python -m mcp_agent_mail.http --port 8765
```

### CLI schema mismatch
If CLI commands fail with "no such column" errors, use SQL instead. See WORKFLOW.md step 1.4.

### CLI uses wrong database
Always find the correct database first:
```bash
lsof -p $(lsof -i :8765 -t) 2>&1 | grep sqlite
```

### No ready beads
- Check dependencies: `br dep tree {root-epic}`
- Check parent status: `br show {parent-id}`
- Run insights: `bv --robot-insights`

### Cycles detected
- Review dependency chain in `bv` output
- Fix circular dependencies with `br update {id} --deps {corrected-deps}`

### Kickoff is too generic
Go back to Step 1 (research) and:
- Read more source code files
- Find actual type names, function signatures, API endpoints
- Extract actual build/test commands from config files
- List actual bead IDs with actual titles
