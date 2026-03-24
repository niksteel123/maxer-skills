# Master Workflow -- Detailed Phase Guide (3-SOT)

Step-by-step guidance for each phase of the 3-SOT implementation pipeline.

---

## Phase 0: Create Spec (research-to-spec)

### Purpose
Transform research into a formal specification -- the first Source of Truth.

### Prerequisites
- Research document exists (from idea-to-research or manual research)
- OR: Human writes spec manually (skip this phase)

### Steps

1. **Check if spec already exists**
   - If you have a complete spec -> skip to Phase 1
   - If you have research but no spec -> invoke skill

2. **Invoke the Skill**
   ```
   Use the [research-to-spec] skill

   Input:
   - Research doc: {path_to_research}
   ```

3. **Expected Outputs**
   - Spec document (SOT #1): every requirement, acceptance criterion, constraint
   - Architecture document: data models, system design, integration points

4. **Optimization Pass -- Drift Check vs Research**
   - Read the research document and the generated spec side by side
   - Check: every research finding appears in the spec
   - Check: no spec content that contradicts or exceeds research scope
   - Fix any drift before proceeding

### Verification
- [ ] Spec covers all research findings
- [ ] Architecture document captures system design
- [ ] Optimization pass completed (drift check vs research)
- [ ] No requirements lost from research -> spec transition

---

## Phase 1: Create TDD (spec-to-tdd)

### Purpose
Generate comprehensive test specifications -- the second Source of Truth.

### Prerequisites
- Spec document (SOT #1) completed
- Architecture document available

### Steps

1. **Invoke the Skill**
   ```
   Use the [spec-to-tdd] skill

   Input:
   - Spec path: {spec_path}
   - Arch path: {arch_path}
   ```

2. **Expected Outputs**
   - TDD document (SOT #2): layered test specs (unit, integration, E2E)
   - Bootstrap document: environment setup, validation scripts

3. **Optimization Pass -- Drift Check vs Spec**
   - Every spec requirement must have at least one test
   - Every test must trace back to a spec requirement
   - No stub tests -- real assertions with real expected values
   - If a requirement can't be tested, fix the spec (make it testable)

### Verification
- [ ] TDD document has layered test specs
- [ ] Bootstrap document has environment setup
- [ ] Every spec requirement has test coverage (drift check)
- [ ] No stub or placeholder tests
- [ ] Test IDs are stable and referenceable

### Common Issues
- **Untestable requirement:** Fix the spec to make it testable, don't skip it
- **Missing integration tests:** Check spec for system boundary requirements
- **Test count explosion:** Group related assertions, but never reduce coverage

---

## Phase 2: Create Strategy (spec-to-strategy)

### Purpose
Define execution ordering -- the third Source of Truth. Lightweight by design.

### Prerequisites
- Spec (SOT #1) and TDD (SOT #2) completed

### Steps

1. **Invoke the Skill**
   ```
   Use the [spec-to-strategy] skill

   Input:
   - Spec: {spec_path}
   - TDD: {tdd_path}
   ```

2. **Expected Outputs**
   - Implementation Strategy (SOT #3): ~500-800 lines
   - Contains: phase ordering, domain batches, gate criteria, dependencies
   - Does NOT contain: task descriptions, effort estimates, or content

3. **Optimization Pass -- Drift Check vs Spec + TDD**
   - Every spec section maps to at least one phase
   - Phase gates reference TDD test IDs
   - No phases that introduce scope not in the spec
   - Strategy is pure ordering -- if you find content, push it back to spec

### Verification
- [ ] Strategy is lightweight (~500-800 lines)
- [ ] Every spec section maps to a phase
- [ ] Phase gates reference TDD tests
- [ ] No content duplication (strategy is ordering only)
- [ ] Dependencies form a valid DAG

### Common Issues
- **Strategy too detailed:** It's trying to be a plan. Strip content, keep ordering.
- **Missing phases:** A spec section has no corresponding phase -- add it.
- **Gate criteria vague:** Gates must reference specific TDD test IDs, not prose.

---

## Phase 3: Create Beads (beads-from-sources)

### Purpose
Create self-contained execution units directly from all 3 SOTs.

### Prerequisites
- All 3 SOTs exist: Spec, TDD + Bootstrap, Strategy

### Steps

1. **Invoke the Skill**
   ```
   Use the [beads-from-sources] skill

   Input:
   - Spec: {spec_path} (SOT #1)
   - TDD: {tdd_path} (SOT #2)
   - Strategy: {strategy_path} (SOT #3)
   ```

2. **Expected Outputs**
   - Beads with:
     - Embedded spec sections (verbatim, not paraphrased)
     - TDD test IDs with full assertion details
     - Phase context from strategy
   - Dependencies matching strategy ordering

3. **Audit: bead-plan-audit**
   ```
   Use the [bead-plan-audit] skill

   Input: Beads + Spec + TDD + Strategy
   ```
   - Checks every bead against spec for drift
   - "Does this bead faithfully represent the spec?"
   - Fixes beads that paraphrase instead of embed
   - Ensures no spec requirements are missing from beads

### Verification
```bash
# Check beads were created
bd list

# Verify dependency chain
bd deps --tree

# Check for ready beads
bd ready --json
```

- [ ] Beads exist for all spec requirements
- [ ] Each bead embeds spec content verbatim (not paraphrased)
- [ ] Each bead references TDD test IDs
- [ ] Dependencies match strategy ordering
- [ ] bead-plan-audit passed (spec drift check)

### Common Issues
- **Beads paraphrase instead of embed:** Fix -- embed spec text verbatim
- **Missing spec coverage:** A requirement exists in spec but no bead covers it -- add bead
- **Strategy drift:** Bead ordering doesn't match strategy -- realign

---

## Phase 4: Prepare Execution (beads-to-execution)

### Purpose
Prepare minimal context for agents to start execution.

### Prerequisites
- Beads created and audited (Phase 3 complete)
- All 3 SOTs available

### Steps

1. **Invoke the Skill**
   ```
   Use the [beads-to-execution] skill

   Input:
   - Beads: .beads/issues.jsonl
   - Spec: {spec_path}
   - TDD: {tdd_path}
   ```

2. **Expected Outputs**
   ```
   docs/plan-hub/
   ├── status/
   │   └── active-plan.yaml
   └── prompts/
       └── {feature}-kickoff.md
   ```

### Verification
- [ ] active-plan.yaml points to correct SOT paths
- [ ] Kickoff prompt references all 3 SOTs
- [ ] `bd ready --json` shows available starting beads

### Common Issues
- **Wrong SOT paths:** Update active-plan.yaml manually if needed.
- **Kickoff too verbose:** Keep it minimal; agents read the spec and TDD directly.

---

## MANDATORY STOP #1 -- SETUP COMPLETE

### The Master Workflow Ends Here

After completing Phase 4 (Kickoff), the agent **MUST**:

1. **STOP all work** -- Do not proceed to Phase 5
2. **Report completion** to the human with:
   - Confirmation that setup is complete
   - All 3 SOT document paths
   - Location of kickoff prompt
   - Number of ready beads
3. **Wait for explicit authorization** before any execution

### Report Template

```
Setup complete for 3-SOT pipeline.

SOT documents:
  Spec (SOT #1):     {spec_path}
  TDD (SOT #2):      {tdd_path}
  Strategy (SOT #3): {strategy_path}

Kickoff prompt:  docs/plan-hub/prompts/{feature}-kickoff.md
Status file:     docs/plan-hub/status/active-plan.yaml
Ready beads:     {N} available for execution

Awaiting your instruction to proceed with execution.

Options:
1. Start fresh session with the kickoff prompt
2. Say "proceed" to execute in this session
3. Review beads first with: bd list --json
```

### Human Options

The human can then choose to:
- **Option A:** Start a fresh session using the kickoff prompt (recommended for large tasks)
- **Option B:** Give explicit confirmation: "Proceed with execution"
- **Option C:** Review/modify beads before execution

### Why Two Stops

This pipeline has TWO mandatory stops (before execution and before audit) because:
- Fresh sessions have full context windows for implementation
- Human maintains control over execution timing
- Prevents accidental work on incomplete setups
- Allows human review before irreversible work

---

## Phase 5: Execute (HUMAN-INITIATED ONLY)

> This phase is NOT part of the automated master workflow.
> It requires explicit human authorization.

### Agent Workflow

1. **Session Start**
   - Read active-plan.yaml for SOT paths
   - Load Spec (SOT #1) -- primary reference during execution
   - Load TDD (SOT #2) -- test specifications for each bead
   - Check `bd ready --json` for available beads

2. **Pick a Bead**
   - Select based on: no blocking deps, matches expertise, not reserved
   - `bd update {BEAD_ID} --status in-progress`

3. **Coordinate via AgentMail**
   ```
   macro_start_session(project_key, program, model)
   send_message(thread_id="bd-{BEAD_ID}", ...)
   file_reservation_paths(paths=[...])
   ```

4. **Implement**
   - Read embedded spec sections in bead (PRIMARY source)
   - Read TDD test IDs in bead for verification criteria
   - Do NOT read strategy during execution -- beads are self-contained
   - Write code, run tests

5. **Verify & Commit**
   ```bash
   # Run verification criteria from bead
   # Save evidence to artifacts/bd-{BEAD_ID}/

   bd update {BEAD_ID} --status done
   git commit -m "feat({BEAD_ID}): description"
   ```

6. **Repeat** until all beads done

### MANDATORY STOP #2 -- EXECUTION COMPLETE

When all beads are closed:
1. **STOP** and report to human
2. Wait for human to trigger Phase 6 audit

### Verification
- [ ] Each bead marked done has passing verification
- [ ] Commits reference bead IDs
- [ ] Artifacts stored under artifacts/bd-{BEAD_ID}/
- [ ] AgentMail threads updated with progress

### Common Issues
- **Blocked on another agent:** Post in their thread, retry later.
- **Bead too large:** Split into sub-beads if needed.
- **Conflicting file reservations:** Coordinate via AgentMail.

---

## Phase 6: Audit (HUMAN-TRIGGERED)

> Requires explicit human trigger.

### Invoke the Skill
```
Use the [bead-completion-audit] skill

Input: (discovers automatically from workspace)
```

### Key Activities
- Spec drift detection against SOT #1
- Test coverage verification against SOT #2
- Implementation quality review
- REOPEN -> FIX -> CLOSE lifecycle for findings
- Findings document generation

### Verification
- [ ] All beads reviewed against spec
- [ ] TDD test coverage verified
- [ ] Findings document generated
- [ ] All issues fixed and verified

---

## Phase 7: Complete

### Steps

1. **Verify All Beads Done**
   ```bash
   bd list --status done   # Should show all beads
   bd ready --json         # Should return empty
   ```

2. **Final QA Pass**
   - Run full test suite
   - Verify acceptance criteria against spec
   - Review audit findings document

3. **Prepare for Next Feature**

### Verification
- [ ] All beads completed
- [ ] All tests passing
- [ ] Feature meets spec requirements
- [ ] Audit findings resolved

---

## Emergency Recovery

### Everything Broken
```
2. Verify SOT docs still exist (never delete SOTs!)
3. Start from earliest missing phase
```

### Just Beads Corrupted
```
2. Re-run [beads-from-sources] from 3 SOTs
3. Re-run [bead-plan-audit]
4. Continue from Phase 4
```

### Strategy Wrong but Spec + TDD Fine
```
1. Delete strategy document
2. Re-run [spec-to-strategy] from Spec + TDD
3. Re-run pipeline from Phase 2
```

### TDD Wrong but Spec Fine
```
1. Delete TDD document
2. Re-run [spec-to-tdd] from Spec
3. Cascade: re-run strategy, beads from Phase 1
```

### Lost Track of Progress
```
1. bd list --all     # See all beads
2. bd deps --tree    # See dependency structure
3. bd ready --json   # See what's available
4. Pick up from last incomplete bead
```
