# Error Manifest — Methodology

Detailed execution guide for the 7-phase QA error manifest generation workflow. Each phase includes purpose, concrete steps, tools, evidence requirements, and gate criteria.

---

## Phase 0: Environment Snapshot

**Purpose**: Freeze the environment state at time of investigation. This establishes the baseline for reproduction and eliminates "works on my machine" ambiguity.

**Steps**:

1. **Capture runtime environment**:
   - OS version (`uname -a` or equivalent)
   - Language/runtime versions (`node -v`, `rustc --version`, `python3 --version`)
   - Package manager versions (`bun --version`, `cargo --version`)
   - Relevant env vars (redact secrets)

2. **Capture process state**:
   - Is the relevant service running? (`pgrep`, `lsof`, port checks)
   - PID and uptime if applicable
   - Memory/resource usage if relevant

3. **Capture data store state**:
   - Database file sizes and timestamps
   - Key record counts or table state
   - Recent write timestamps
   - File permissions if relevant

4. **Capture git state**:
   - Current branch and HEAD commit
   - Working tree status (clean/dirty)
   - Recent relevant commits

**Tools**: Bash (system commands), Glob (data files), Read (configs)

**Evidence format**: Every capture must be recorded as:
```
EVIDENCE E0.{n}: {description}
COMMAND: {exact command run}
OUTPUT: {exact output observed}
```

**Gate**: Can answer: What OS/platform? What versions? What services are running? What is the data store state? What git revision?

---

## Phase 1: Defect Characterization

**Purpose**: Precisely classify and fingerprint the defect. This determines the investigation strategy.

**Steps**:

1. **Classify defect type**:
   | Type | Description | Investigation Focus |
   |------|-------------|-------------------|
   | **Data Loss** | Data written but not persisted or retrievable | Write path tracing, storage layer |
   | **Silent Failure** | Operation reports success but has no effect | Error handling, return value propagation |
   | **Crash/Panic** | Unhandled error terminates process | Stack trace analysis, input validation |
   | **Wrong Behavior** | Code executes but produces incorrect results | Logic errors, state management |
   | **Performance** | Functionally correct but unacceptably slow | Profiling, algorithmic analysis |
   | **Race Condition** | Non-deterministic failure | Concurrency, ordering, locking |
   | **Integration Mismatch** | Components don't agree on protocol/format | Interface contracts, serialization |

2. **Build defect fingerprint**:
   ```
   {
     defectType: "silent_failure",
     severity: "critical",  // critical | high | medium | low
     scope: "project persistence via WebSocket bridge",
     affectedComponent: "swarmd::api_gateway::project",
     workingAnalogue: "swarmd::api_gateway::vxg (same store, different write path)",
     reproducibility: "deterministic",  // deterministic | intermittent | environment-specific
     dataDependency: "none",  // none | specific-input | state-dependent | timing-dependent
   }
   ```

3. **Identify the working analogue** (critical for silent failures and data loss):
   - Find a similar operation that DOES work correctly
   - The diff between working and broken paths is often the root cause
   - Document both paths precisely

4. **Parse user context** — Extract from conversation:
   - What the user observed
   - What the user expected
   - Any prior investigation the user already did
   - Known constraints or hypotheses

**Tools**: Read (affected code), Grep (find analogues), AskUserQuestion (if defect unclear)

**Gate**: Defect type classified. Fingerprint built. Working analogue identified (if applicable). Can state the defect in one sentence: "{operation} reports {observed} but should {expected}, while {analogue} works correctly."

---

## Phase 2: Reproduction Protocol

**Purpose**: Build a deterministic, copy-paste-ready reproduction sequence. The debugging agent must be able to reproduce the defect in <5 minutes by following these steps exactly.

**Steps**:

1. **Design reproduction sequence** — Build steps from scratch, don't rely on user's description:
   - Start from a clean known state (restart service, clear cache, etc.)
   - Minimum steps to trigger the defect
   - Include ALL prerequisite setup (running services, seed data, etc.)

2. **Execute the reproduction** — Actually run every step and record:
   - The exact command or UI action
   - The exact output or observation
   - Timestamps if timing matters

3. **Verify the reproduction** — Confirm the defect is present:
   - Check the expected side effect is missing (for data loss / silent failure)
   - Capture the actual error (for crashes)
   - Measure the metric (for performance)

4. **Verify the working analogue** — Run the equivalent operation that works:
   - Same steps but through the working path
   - Show it produces the expected result
   - This contrast is the most powerful debugging signal

5. **Record the protocol** — Format as numbered steps with evidence:
   ```
   STEP 1: {action description}
   COMMAND: {exact command}
   EXPECTED: {what should happen}
   ACTUAL: {what actually happens}
   EVIDENCE: E2.1
   ```

**Tools**: Bash (commands), browser tools (UI reproduction), Read (verify state)

**Special cases**:
- **UI-triggered defects**: Use browser automation tools (agent-browser skill, Chrome MCP) to reproduce. Take screenshots as evidence.
- **Intermittent defects**: Run the reproduction N times, record success/fail ratio. Note any patterns in failures.
- **Environment-specific defects**: Document the exact environment requirements.

**Gate**: The reproduction protocol, when followed exactly, triggers the defect 100% of the time (or N/M times for intermittent). The working analogue, when followed, works 100% of the time.

---

## Phase 3: Evidence Collection

**Purpose**: Gather all forensic evidence that narrows the root cause. Every claim about the system state must be backed by a verifiable evidence item.

**Steps**:

1. **Binary/data store evidence** — For persistence bugs:
   - Search data files for expected tokens/records
   - Compare file sizes before and after operations
   - Count occurrences of known patterns
   - Record exact search commands and results

2. **Log evidence** — For runtime behavior:
   - Capture relevant log output during reproduction
   - Filter for the affected component
   - Note what IS logged vs what is NOT logged (absence is evidence)

3. **Code path evidence** — For logic errors:
   - Read the affected codepath end-to-end
   - Identify branch points where behavior diverges from the working analogue
   - Extract key function signatures and types
   - Note error handling patterns (or lack thereof)

4. **State evidence** — For state management bugs:
   - Dump in-memory state if accessible
   - Query database/store state directly
   - Compare state before and after the operation

5. **Network/IPC evidence** — For integration bugs:
   - Capture request/response payloads
   - Check for mismatched protocols or encodings
   - Verify connection state

**Evidence numbering convention**:
```
E0.n — Environment snapshot evidence
E1.n — Defect characterization evidence
E2.n — Reproduction evidence
E3.n — Forensic collection evidence
E4.n — Root cause analysis evidence
```

**Tools**: Bash (binary search, state queries), Read (code), Grep (pattern search), browser tools (network, console)

**Gate**: At least 5 evidence items collected. Every evidence item has exact command + exact output. Evidence covers both the broken path and the working analogue.

---

## Phase 4: Root Cause Analysis

**Purpose**: Narrow the defect to the smallest possible code scope and build ranked hypotheses with evidence linkage.

**Steps**:

1. **Diff the codepaths** — Compare working vs broken:
   - Side-by-side the working path (e.g., `append()` direct) vs broken path (e.g., `reserve() → commit()`)
   - Identify every point of divergence
   - For each divergence: could this cause the observed defect?

2. **Build hypothesis list** — For each candidate root cause:
   ```
   HYPOTHESIS H{n}: {description}
   LIKELIHOOD: {high | medium | low}
   EVIDENCE FOR: {E-items that support this hypothesis}
   EVIDENCE AGAINST: {E-items that contradict this hypothesis}
   VERIFICATION: {what the debugging agent should check to confirm/reject}
   FIX SCOPE: {files and functions that would need to change}
   ```

3. **Rank hypotheses** — Order by:
   - Evidence strength (more supporting evidence = higher rank)
   - Simplicity (simpler explanations rank higher — Occam's razor)
   - Fix scope (smaller scope = faster to verify)

4. **Identify investigation gaps** — What evidence is still missing?
   - "H2 could be confirmed by adding a debug log at line X"
   - "H3 requires running under a debugger to check value Y"
   - These become instructions for the debugging agent

5. **Map the blast radius** — If each hypothesis is correct:
   - What other operations might be affected?
   - Are there other callers of the broken function?
   - Could the fix introduce regressions?

**Tools**: Read (codepaths), Grep (find callers), Bash (verification commands)

**Gate**: At least 2 hypotheses with evidence linkage. Top hypothesis has clear verification steps. Fix scope identified for top hypothesis.

---

## Phase 5: Manifest Synthesis

**Purpose**: Assemble all phases into the self-contained QA Error Manifest document.

**Steps**:

1. **Select output path**: `./prompts/{slug}-error-manifest.md`
   - Slug derived from defect description in kebab-case
   - Create `prompts/` directory if needed

2. **Populate template** (see TEMPLATE.md):
   - Copy the template structure
   - Fill every section from the phase outputs
   - Embed evidence inline (not as references)
   - Include the working vs broken codepath comparison

3. **Write acceptance criteria** — Define what "fixed" means:
   - Specific observable behavior after the fix
   - Test commands that must pass
   - State assertions that must hold
   - Regression checks for related functionality

4. **Write investigation roadmap** — Ordered instructions for the debugging agent:
   - "First, verify H1 by doing X"
   - "If H1 is confirmed, fix by doing Y"
   - "If H1 is rejected, check H2 by doing Z"
   - This is the agent's execution plan

5. **Embed critical code** — Include the actual source of:
   - The broken codepath (key functions)
   - The working analogue (for comparison)
   - Type definitions used by both
   - Error handling that may be swallowing failures

**Tools**: Write (output file), Read (embed code)

**Length calibration**:
- Simple single-function bug: 100-200 lines
- Multi-function / cross-module bug: 200-350 lines
- Multi-subsystem / architectural bug: 350-600 lines

---

## Phase 6: Self-Verification

**Purpose**: Ensure the manifest meets QA standards before delivery.

**Steps**:

1. **Run CHECKLIST.md** — Execute every gate check.

2. **Verify all file paths** — Glob every referenced path.

3. **Verify all commands** — Ensure every command in the reproduction protocol is syntactically correct and references real tools/paths.

4. **Test self-containment** — Could a fresh agent:
   - Reproduce the defect in <5 minutes?
   - Understand the codepath without re-reading files?
   - Start investigating immediately?

5. **Check evidence completeness** — Every claim has an E-item. Every hypothesis references E-items.

6. **Check for session leakage** — No "we found", "earlier", "as discussed", etc.

7. **Report to user**:
   - Output file path
   - Defect fingerprint summary (1-2 sentences)
   - Top hypothesis
   - Recommended next step

**Tools**: Glob (verify paths), Read (verify embedded code), Grep (check session leakage)

**Gate**: All CHECKLIST.md items pass. Zero broken paths. Zero unlinked claims. Reproduction protocol is complete and deterministic.

---

## Decision Trees

### When to use browser automation for evidence:
```
Is the defect triggered via UI?
├─ YES → Use browser tools for reproduction (Phase 2)
│   └─ Take screenshots as evidence
├─ NO, but UI shows symptoms?
│   └─ Use browser tools to verify symptoms (Phase 3)
└─ NO, purely backend?
    └─ CLI/Bash only for reproduction
```

### When to include a working analogue:
```
Is there a similar operation that works?
├─ YES → ALWAYS include the comparison (most powerful debugging signal)
├─ NO, but there's a related pattern?
│   └─ Include as reference with caveats
└─ NO, completely novel operation?
    └─ Focus on expected behavior from spec/docs
```

### When to embed code vs reference:
```
Is this function in the broken codepath?
├─ YES → Embed the full function body
├─ NO, but it's called by the broken path?
│   └─ Embed the function signature + key lines
└─ NO, just context?
    └─ Reference the file:line with a one-line description
```
