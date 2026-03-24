---
name: research-to-spec
description: Transform research documents into production-ready specification and architecture documents. Deep codebase study, critical evaluation of proposed approaches, and comprehensive design with E2E testing focus. Outputs spec (SOT #1, PRIMARY), architecture (SUPPLEMENTARY), and handoff prompt for 3-SOT pipeline.
---

# Research to Spec & Architecture

This skill transforms research documents into **production-ready specification and architecture documents** through deep codebase analysis, critical design evaluation, and comprehensive documentation.

## Philosophy

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Research Documents    │     │    Your Analysis        │     │   Spec + Architecture   │
│   (CONTEXT/IDEAS)       │ ──▶ │    (DESIGN/ARCHITECT)   │ ──▶ │   (SOURCE OF TRUTH)     │
│                         │     │                         │     │                         │
│  Initial exploration,   │     │  Critical evaluation,   │     │  Comprehensive docs     │
│  proposed approaches,   │     │  codebase-aware design, │     │  ready for phased       │
│  feature ideas          │     │  best-fit architecture  │     │  implementation         │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
```

**Critical Distinction:**
- Research documents are **exploratory context** - they suggest approaches but are NOT authoritative
- YOU are the **architect** - you critically evaluate and design the best solution
- Spec + Architecture become the **source of truth** for implementation

## 3-SOT Alignment

This skill produces the **Spec** (SOT #1) — the first and most important Source of Truth in the 3-SOT workflow model. The three SOTs are:

1. **Spec** (SOT #1) — What to build. Every detail. No shortcuts. **PRIMARY source of truth.**
2. **TDD + Bootstrap** (SOT #2) — How to test it. Created downstream by `spec-to-tdd`.
3. **Implementation Strategy** (SOT #3) — What order to build in. Lightweight routing table (~500-800 lines), NOT a full plan.

**Architecture Document** is SUPPLEMENTARY — it provides design detail (data models, API contracts, component blueprints) but the spec is authoritative for what ships. If spec and architecture conflict, spec wins.

**Key principle: If it's in the spec, it ships.** There is no "post-MVP" or "could have" in the spec. Those scope decisions happen BEFORE the spec is written (in research). The spec only contains committed scope.

**Beads are created directly from Spec + TDD + Strategy** — no intermediate plan document that can drift.

---

## When to Use This Skill

Use when you have:
- One or more research documents describing features to implement
- Need to create comprehensive spec and architecture before implementation
- Want to ensure accuracy and avoid implementation mistakes
- Preparing for the 3-SOT pipeline (spec-to-tdd → strategy → beads-from-sources)

**Trigger phrases:**
- "Convert this research to spec and architecture"
- "Create spec from research document"
- "Design architecture for [feature] from research"
- "Prepare implementation docs from research"

---

## The Complete Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RESEARCH TO SPEC WORKFLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 1: STUDY     │   Deep Codebase Research (MANDATORY)               │
│  │  CODEBASE           │                                                    │
│  │  ─────────────────  │   • Spawn parallel sub-agents for exploration      │
│  │  • Read key files   │   • Identify ALL files touched by feature          │
│  │  • Map dependencies │   • Understand existing patterns & conventions     │
│  │  • Note patterns    │   • Find integration points                        │
│  │  • Use sub-agents   │   • Study similar implementations                  │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 2: STUDY     │   Research Document Analysis                       │
│  │  RESEARCH           │                                                    │
│  │  ─────────────────  │   • Read ALL research documents thoroughly         │
│  │  • Extract features │   • Identify proposed approaches                   │
│  │  • Note assumptions │   • List open questions                            │
│  │  • Map to codebase  │   • Map features to codebase touchpoints           │
│  │  • Web research     │   • Fetch external docs if needed (sub-agents)     │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 3: GAP       │   Critical Analysis                                │
│  │  ANALYSIS           │                                                    │
│  │  ─────────────────  │   • Compare research assumptions vs reality        │
│  │  • Validate claims  │   • Identify discrepancies                         │
│  │  • Find gaps        │   • Challenge proposed approaches                  │
│  │  • Question design  │   • Consider alternatives                          │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 4: DESIGN    │   Architecture Design (YOUR JOB)                   │
│  │  ARCHITECTURE       │                                                    │
│  │  ─────────────────  │   • Design optimal solution                        │
│  │  • Best-fit design  │   • Define data models & schemas                   │
│  │  • API contracts    │   • Specify API contracts                          │
│  │  • Integration plan │   • Plan integrations with existing code           │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 5: WRITE     │   Specification Document                           │
│  │  SPEC               │                                                    │
│  │  ─────────────────  │   Output: thoughts/shared/specs/                   │
│  │  • Requirements     │   {date}-{feature}-spec.md                         │
│  │  • User stories     │                                                    │
│  │  • Core tests       │   Extremely detailed, no ambiguity                 │
│  │  • E2E scenarios    │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 6: WRITE     │   Architecture Document                            │
│  │  ARCHITECTURE       │                                                    │
│  │  ─────────────────  │   Output: thoughts/shared/architecture/            │
│  │  • System diagrams  │   {date}-{feature}-architecture.md                 │
│  │  • Data flows       │                                                    │
│  │  • Full impl code   │   Complete implementation blueprints               │
│  │  • Integration map  │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 7: HANDOFF   │   Generate Handoff Prompt                          │
│  │  PROMPT             │                                                    │
│  │  ─────────────────  │   • Reference all output documents                 │
│  │  • Workflow guide   │   • Guide to master workflow skills                │
│  │  • Key files list   │   • Key codebase files to study                    │
│  │  • QA strategy      │   • QA and testing strategy                        │
│  └─────────────────────┘                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Deep Codebase Study (MANDATORY)

**This phase cannot be skipped.** You must understand what you're building on.

### Use Sub-Agents for Parallel Research

Spawn multiple sub-agents to research different aspects concurrently:

```
Task tool with subagent_type:
├── codebase-locator     → Find WHERE files and components live
├── codebase-analyzer    → Understand HOW specific code works
├── codebase-pattern-finder → Find examples of existing patterns
├── Explore              → General codebase exploration
└── web-search-researcher → External documentation (if needed)
```

**Example parallel research:**
```
Agent 1: "Find all files related to WebSocket handling"
Agent 2: "Analyze the permission system in packages/shared"
Agent 3: "Find patterns for adding new API endpoints"
Agent 4: "Research node-pty signal handling documentation" (web)
```

### What to Study

1. **Files that will be modified/extended:**
   - Read each file completely
   - Understand current architecture
   - Note patterns and conventions used

2. **Related systems:**
   - How does existing code handle similar features?
   - What patterns are established?
   - What dependencies exist?

3. **Integration points:**
   - Where does new code connect to existing code?
   - What interfaces must be respected?
   - What contracts exist?

4. **Test patterns:**
   - How are similar features tested?
   - What test infrastructure exists?
   - What E2E patterns are used?

### How to Study

Use codebase exploration tools aggressively:
- `Task` with sub-agents for parallel exploration
- `mcp__morph-mcp__warpgrep_codebase_search` for semantic search
- `Grep` for pattern matching
- `Glob` for file discovery
- `Read` for deep file analysis

**Document your findings** - they inform the architecture.

### Web Research (When Needed)

If the feature requires external knowledge (libraries, APIs, protocols):
- Use `web-search-researcher` sub-agent
- Fetch official documentation
- Understand best practices
- Note version-specific behaviors

---

## Phase 2: Research Document Analysis

### Read Thoroughly

- Read ALL provided research documents completely
- Extract every feature, requirement, and suggestion
- Note all assumptions made by the research
- Identify proposed technical approaches

### Map to Codebase

For each feature/requirement:
- Which files will be touched?
- What new files are needed?
- What existing patterns apply?
- What dependencies exist?

---

## Phase 3: Gap Analysis (CRITICAL)

**Do NOT take research at face value.** Critically evaluate:

### Validate Assumptions

- Does the research assume APIs/methods that don't exist?
- Are the proposed file locations correct?
- Do the suggested patterns match the codebase?

### Identify Discrepancies

- Research says X, but codebase actually does Y
- Research assumes capability Z, but it doesn't exist
- Research suggests approach A, but pattern B is established

### Challenge the Design

- Is the proposed approach the best fit?
- Are there simpler alternatives?
- Does it align with existing architecture?
- Will it scale appropriately?

### Document Gaps

Create a clear list of:
- Corrections needed from research
- Missing considerations
- Alternative approaches to evaluate

---

## Phase 4: Architecture Design

**YOU are the architect.** Design the optimal solution based on:
- Codebase reality (from Phase 1)
- Feature requirements (from Phase 2)
- Gap analysis (from Phase 3)

### Design Decisions

- Data models and schemas
- API contracts and endpoints
- Component structure
- Integration approach
- Error handling strategy
- Permission model

### Prioritize

- Consistency with existing patterns
- Minimal changes for maximum impact
- Clear boundaries and interfaces
- Testability

---

## Phase 5: Write Specification Document

**Location:** `thoughts/shared/specs/{date}-{feature}-spec.md`

### Required Sections

```markdown
# {Feature Name} - Specification

## 1. Overview
- Feature summary
- Goals and non-goals
- Success metrics

## 2. Functional Requirements
For EACH requirement:
- FR-X.Y.Z: Requirement Title
- **Requirement**: Clear statement
- **Acceptance Criteria**: Bullet list
- **Core Test**: Automated test script (bash/typescript)

## 3. User Stories
- US-X: As a [persona], I want [goal], So that [benefit]
- Acceptance criteria for each

## 4. E2E Test Scenarios
### Clean Slate Protocol (if applicable)
- Steps to reset test environment

### Scenario Tests
- Full end-to-end test flows
- With setup, execution, verification steps
- Screenshot/log evidence requirements

## 5. Dependencies
- External systems
- Internal components
- Required permissions

## 6. Risks and Mitigations
| Risk | Severity | Likelihood | Mitigation |

## 7. Future Considerations
- Planned extensions
- Out of scope for now

## 8. Skill/Documentation Integration (if applicable)
- What skills need updating
- What docs need updating
```

### Requirement ID Convention (MANDATORY)

Every functional requirement MUST have a unique, stable ID following the `FR-X.Y.Z` pattern:
- `X` = section number (matches document section)
- `Y` = subsection number
- `Z` = requirement number within subsection

**Why:** Stable IDs enable mechanical coverage verification. Downstream TDD tests reference `FR-X.Y.Z`, beads reference `FR-X.Y.Z` — if an ID is missing downstream, coverage is broken.

**Rules:**
- IDs are immutable once assigned (never renumber)
- Every requirement is in a numbered section with explicit acceptance criteria bullets — not buried in narrative text
- Acceptance criteria use sub-IDs: `AC-FR-2.1.1-a`, `AC-FR-2.1.1-b`, etc.
- A downstream tool must be able to `grep -oP 'FR-\d+\.\d+\.\d+' spec.md | sort -u` to get the complete requirement inventory

### Test Strategy Preservation

If the research document contains test strategy sections (test scenarios, validation approaches, test matrices):
1. Acknowledge the research test strategy as prior art
2. Extract spec-relevant tests into functional requirement Core Tests
3. Carry forward E2E scenario definitions that validate committed scope
4. Do NOT silently discard research-level test planning

### "Everything Ships" Principle

The spec defines what ships. There is no "post-MVP", "nice to have", or "could have" in the spec.

- Research doc may have Must/Should/Could/Won't categories
- Spec contains ONLY Must + Should (committed scope)
- Could/Won't stay in the research doc as context
- Section 7 ("Future Considerations") is for **planned extensions** explicitly out of scope for THIS implementation — not for hedged scope
- **If something shouldn't ship, remove it from the spec.** No downstream document gets to make scope cuts.

### Coverage-Checkable Structure

The spec must be structured so downstream tools can mechanically verify coverage:

1. **Extract all requirement IDs** — every `FR-X.Y.Z` found by regex
2. **Extract all acceptance criteria** — each AC is a bullet under its FR
3. **Map to TDD tests and beads** — each FR-ID appears in TDD and bead descriptions

**Anti-patterns to avoid:**
- Requirements buried in prose paragraphs (must be in `#### FR-X.Y.Z` sections)
- Acceptance criteria hidden in narrative (must be explicit bullet lists)
- Implicit requirements (if it matters, give it an ID)

### Core Test Philosophy

**STRONG BIAS TOWARDS E2E TESTS:**

- Unit tests are easily faked and don't prove the system works
- E2E tests exercise real system behavior
- Tests should simulate real user/agent interactions
- Require evidence (screenshots, logs) not just assertions
- **NEVER ask humans to manually verify** - all testing is automated
- **Iterate until tests pass** - don't give up, but don't overfit either
- Tests must pass the "eye test" - would a real user accept this?

### Testing Tools by Application Type

**Match the testing tool to the application medium:**

| Application Type | Testing Tool | Evidence |
|------------------|--------------|----------|
| **Web Browser App** | Playwright MCP, Claude Browser Extension, Puppeteer | Screenshots, DOM state, network logs |
| **Electron Desktop App** | Circuit Electron MCP | Screenshots, console logs, IPC traces |
| **CLI/Terminal App** | Bash scripts, expect | stdout/stderr capture, exit codes |
| **API/Backend** | curl, httpie, SDK tests | Response JSON, status codes, DB state |
| **Mobile App** | Detox, Appium | Screenshots, gesture logs |

### E2E Test Requirements

Every E2E test MUST include:

1. **Setup Phase**: Clear environment preparation
2. **Execution Phase**: Actual user/agent actions
3. **Verification Phase**: Automated assertions
4. **Evidence Capture**: 
   - Screenshots at key states
   - Log files saved
   - Network requests recorded
   - Database state snapshots

### Validation Criteria

```markdown
**Validation Criteria** (REQUIRED for each test):
- [ ] Screenshot evidence: `path/to/screenshot-{state}.png`
- [ ] Log evidence: `path/to/test-{name}.log`
- [ ] Automated assertion: `echo "PASS" || echo "FAIL"`
- [ ] Eye test: Would a human user accept this result?
```

### Iteration Philosophy

**Don't cut corners. Don't give up. Don't overfit.**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST ITERATION LOOP                          │
│                                                                 │
│  Run Test → Failed? → Investigate → Fix Root Cause → Re-run    │
│      ↑                                                    │     │
│      └────────────────────────────────────────────────────┘     │
│                                                                 │
│  STOP CONDITIONS:                                               │
│  ✅ Test passes AND passes eye test (real user would accept)    │
│  ❌ DO NOT: Hack test to pass without fixing underlying issue   │
│  ❌ DO NOT: Skip test because it's "too hard"                   │
│  ❌ DO NOT: Ask human to manually verify                        │
└─────────────────────────────────────────────────────────────────┘
```

### Example: Electron App E2E Test

```markdown
**Core Test** (Electron Desktop):
```typescript
// Using Circuit Electron MCP
const session = await mcp__circuit_electron__app_launch({
  app: "/path/to/electron",
  args: ["/path/to/app"],
  cwd: "/project/root"
});

// Wait for app ready
await mcp__circuit_electron__wait_for_load_state({
  sessionId: session.id,
  state: "domcontentloaded"
});

// Screenshot initial state
await mcp__circuit_electron__screenshot({
  sessionId: session.id,
  path: "/tmp/test-01-initial.png"
});

// Perform action
await mcp__circuit_electron__click({
  sessionId: session.id,
  selector: "[data-testid='action-button']"
});

// Screenshot result
await mcp__circuit_electron__screenshot({
  sessionId: session.id,
  path: "/tmp/test-02-after-action.png"
});

// Verify state
const result = await mcp__circuit_electron__evaluate({
  sessionId: session.id,
  script: "document.querySelector('.result').textContent"
});

// Assert
console.assert(result.includes("expected"), "Result should contain expected");
console.log("PASS: FR-X.Y.Z");

// Capture console logs as evidence
const logs = await mcp__circuit_electron__browser_console_messages({
  sessionId: session.id
});
fs.writeFileSync("/tmp/test-console.log", JSON.stringify(logs, null, 2));

// Cleanup
await mcp__circuit_electron__close({ sessionId: session.id });
```
```

### Example: API E2E Test

```markdown
**Core Test** (API/Backend):
```bash
# Setup
export API_URL="http://127.0.0.1:5714"
export LOG_FILE="/tmp/test-api-$(date +%s).log"

# Execute with logging
echo "=== Test: FR-X.Y.Z ===" >> $LOG_FILE
RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/endpoint" \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}')

# Extract response and status
HTTP_CODE=$(echo "$RESPONSE" | tail -1)
BODY=$(echo "$RESPONSE" | sed '$d')

# Log evidence
echo "Request: POST /endpoint" >> $LOG_FILE
echo "Response Code: $HTTP_CODE" >> $LOG_FILE
echo "Response Body: $BODY" >> $LOG_FILE

# Verify
if [ "$HTTP_CODE" = "200" ] && echo "$BODY" | jq -e '.success == true' > /dev/null; then
  echo "PASS: FR-X.Y.Z" | tee -a $LOG_FILE
else
  echo "FAIL: FR-X.Y.Z" | tee -a $LOG_FILE
  echo "Evidence saved to: $LOG_FILE"
  exit 1
fi
```
```

### Example: Browser E2E Test

```markdown
**Core Test** (Web Browser):
```typescript
// Using Playwright MCP or similar
const browser = await playwright.chromium.launch();
const page = await browser.newPage();

// Navigate
await page.goto('http://localhost:3000/feature');

// Screenshot before
await page.screenshot({ path: '/tmp/test-01-before.png' });

// Interact like a real user
await page.click('[data-testid="submit-button"]');
await page.waitForSelector('.success-message');

// Screenshot after
await page.screenshot({ path: '/tmp/test-02-after.png' });

// Verify
const message = await page.textContent('.success-message');
console.assert(message.includes('Success'), 'Should show success');

// Capture network logs
const requests = [];
page.on('request', req => requests.push(req.url()));
fs.writeFileSync('/tmp/test-network.log', requests.join('\n'));

console.log('PASS: FR-X.Y.Z');
await browser.close();
```
```

---

## Phase 6: Write Architecture Document (SUPPLEMENTARY)

**Location:** `thoughts/shared/architecture/{date}-{feature}-architecture.md`

**Role in 3-SOT model:** The architecture document is SUPPLEMENTARY to the spec. It provides design detail (data models, API contracts, component blueprints) that informs implementation, but the spec is authoritative for what ships. If spec and architecture conflict, spec wins.

### Required Sections

```markdown
# {Feature Name} - Architecture

## 1. System Overview
- High-level architecture diagram (ASCII)
- Component descriptions
- Key responsibilities

## 2. Data Flow Diagrams
- For each major flow (ASCII diagrams)
- Show all components involved
- Mark async vs sync operations

## 3. Database Schema (if applicable)
- New tables with full DDL
- Indexes and constraints
- Migration strategy

## 4. API Specification
### HTTP Endpoints
For each endpoint:
- Method, path, description
- Request format with example
- Response format with example
- Error codes

### WebSocket Protocol (if applicable)
- Message types
- Subscription model

## 5. Component Implementation
Full implementation code for key components:
- Service classes
- Route handlers
- Client classes

Include COMPLETE code, not pseudocode.

## 6. Integration Points
- How new code connects to existing
- Required changes to existing files
- Backward compatibility considerations

## 7. Error Handling
- Error types and codes
- Recovery strategies
- User-facing messages

## 8. Scalability Considerations
- Performance implications
- Resource limits
- Caching strategy

## 9. Implementation Phases
High-level phase breakdown for reference.
(Detailed phasing is done in spec-to-strategy skill)
```

### Implementation Code Quality

Include **complete, production-ready code**:

```typescript
// GOOD: Full implementation
export class SessionService {
  constructor(private db: DbHandle) {}

  async pauseAgent(agentId: string, requesterId: string): Promise<void> {
    // Permission check
    await this.checkPermission(requesterId, agentId, 'agent:session:pause');

    // Get bridge connection
    const bridge = this.getBridgeConnection(agentId);
    if (!bridge) {
      throw SESSION_ERRORS.AGENT_NOT_CONNECTED;
    }

    // Send control message
    bridge.send(JSON.stringify({ type: 'control:pause' }));

    // Update state
    this.db.prepare(`
      UPDATE session_states
      SET state = 'paused', updated_at = ?
      WHERE agent_id = ?
    `).run(Date.now(), agentId);
  }

  // ... complete implementation
}

// BAD: Pseudocode or stubs
export class SessionService {
  pauseAgent(agentId: string) {
    // TODO: implement
  }
}
```

---

## Phase 7: Generate Handoff Prompt

Create a comprehensive handoff prompt for the beads master workflow.

**IMPORTANT:** The handoff prompt MUST be written to a SEPARATE file, not embedded in the spec or architecture documents.

**Handoff File Location:** `thoughts/shared/prompts/{date}-{feature}-handoff.md`

### Handoff Prompt Template

```markdown
# Handoff Prompt: {Feature Name}

> **Document Type:** Implementation Handoff
> **Created:** {date}
> **Source Spec:** `thoughts/shared/specs/{date}-{feature}-spec.md`
> **Source Architecture:** `thoughts/shared/architecture/{date}-{feature}-architecture.md`

---

## Your Mission

Prepare the {Feature Name} feature for multi-agent execution using the
**3-SOT pipeline**: create TDD (SOT #2), implementation strategy (SOT #3),
then beads directly from all three source-of-truth documents.
**Do NOT implement any beads in this session - preparation only.**

---

## Step 0: Study the Beads Master Workflow (MANDATORY FIRST)

Before doing ANYTHING else, you MUST thoroughly read and understand the complete beads master workflow system.

### Primary Workflow Skill (READ FIRST)
```
/Users/{user}/.claude/skills/master-workflow/SKILL.md
```

**Read the master workflow skill FIRST** to understand:
- The overall pipeline and how all sub-skills fit together
- How phases sequence and depend on each other
- How QA gates work between phases
- How beads are structured for autonomous execution
- How agents coordinate via AgentMail
- The source-of-truth pattern that prevents drift

### Sub-Skills (Read After Master Workflow)
2. `/Users/{user}/.claude/skills/spec-to-tdd/SKILL.md` - Spec to TDD test specifications (SOT #2)
3. `/Users/{user}/.claude/skills/spec-to-strategy/SKILL.md` - Implementation strategy (SOT #3, lightweight ~500-800 line routing table)
4. `/Users/{user}/.claude/skills/beads-from-sources/SKILL.md` - Create beads from Spec + TDD + Strategy (strategy serves as organizational framework)
5. `/Users/{user}/.claude/skills/beads-to-execution/SKILL.md` - Preparing for multi-agent execution

**Understanding the master workflow is CRITICAL** - it defines how all other skills integrate.

---

### Step 1: Study the Codebase (MANDATORY BEFORE PLANNING)

Before creating any plans, deeply explore the codebase. The spec and
architecture reference many existing files.

**Core Files to Study:**
```
{list key files that will be modified/extended}
```

For each file, understand:
- Current architecture and patterns
- How new code integrates
- What patterns to follow
- What dependencies exist

---

### Step 2: Read the Source Documents

**Specification Document (SOURCE OF TRUTH):**
`{path to spec}`

**Architecture Document:**
`{path to architecture}`

**Original Research (for context):**
`{path to research}`

---


- Wipe all existing beads
- Reset AgentMail (agents AND messages)
- Clean workspace for fresh implementation

---

### Step 4: Spec to TDD Conversion (NEW)

Invoke the `spec-to-tdd` skill.

**TDD Document Requirements:**

1. **Layered Test Specifications**:
   - Layer 1: Unit tests (pure functions, input/output)
   - Layer 2: Integration tests (API, CLI, database)
   - Layer 3: E2E tests (user story scenarios)

2. **Tool Selection per Medium**:
   - Web Browser → Playwright MCP / Claude Chrome
   - Electron Desktop → Circuit Electron MCP
   - CLI/Terminal → Bash scripts
   - REST API → curl + jq

3. **Evidence Requirements**:
   - Screenshots, logs, database snapshots
   - All tests must be automatable
   - No stubs, no fake tests

**Output:** `thoughts/shared/tdd/{date}-{feature}-tdd.md`

---

### Step 5: Create Implementation Strategy (SOT #3)

Invoke the `spec-to-strategy` skill.

Create a lightweight implementation strategy document (~500-800 lines).

**This is NOT a full plan.** It is a routing table for execution ordering:
- Phase sequencing (what blocks what)
- Domain batches (which requirements group together)
- Gate criteria (what must pass before next phase)
- Parallel vs sequential decisions based on file dependencies

**Inputs:**
- Spec: `{spec_path}` (PRIMARY SOURCE OF TRUTH)
- Arch: `{arch_path}` (supplementary design detail)
- TDD: `{tdd_path}` (TEST SPECIFICATIONS)

**Output:** `thoughts/shared/strategy/{date}-{feature}-strategy.md`

**Strategy does NOT contain:**
- Task descriptions (those come from spec)
- Effort estimates
- Implementation detail (that's in spec + architecture)

---

### Step 6: Create Beads from Sources

Invoke the `beads-from-sources` skill, using the strategy document as the organizational
framework and spec + TDD as source of truth inputs.

Create beads directly from the 3 Source of Truth documents:
- **Spec** (SOT #1) — requirement content, acceptance criteria, core tests
- **TDD** (SOT #2) — test IDs, assertions, verification criteria
- **Strategy** (SOT #3) — phase assignment, dependencies, gate membership

Each bead MUST:
- Embed relevant spec sections verbatim (not paraphrased)
- Reference TDD test IDs with full assertions
- Include phase context from strategy
- Be fully self-contained for autonomous execution
- Include SOURCE OF TRUTH WARNING pointing back to spec

**Drift check:** Every bead is verified against spec — "Does this bead faithfully represent the spec?"

---

### Step 7: Beads to Execution Preparation

Invoke `beads-to-execution` skill.

---

### MANDATORY STOP

After completing beads-to-execution:

1. **STOP** - Do not implement any beads
2. **Report completion:**
   ```
   Setup complete for {Feature Name}

   Spec: {path}
   Arch: {path}
   Phase plans: docs/implementation/phase-*.md
   Kickoff: docs/plan-hub/prompts/{feature}-kickoff.md
   Ready beads: {count}

   Awaiting instruction to proceed.
   ```
3. **Wait for explicit authorization**

---

### Deliverables

| Output | Status |
|--------|--------|
| Codebase studied | Required |
| Workspace reset | Required |
| Phase plans created | Required |
| Beads created | Required |
| Kickoff prepared | Required |
| Implementation | DO NOT DO |
```

---

## Output Summary

| Output | Location | Purpose |
|--------|----------|---------|
| Specification | `thoughts/shared/specs/{date}-{feature}-spec.md` | PRIMARY source of truth (SOT #1) |
| Architecture | `thoughts/shared/architecture/{date}-{feature}-architecture.md` | SUPPLEMENTARY design detail |
| Handoff Prompt | `thoughts/shared/prompts/{date}-{feature}-handoff.md` | Kickoff for 3-SOT pipeline |

**Downstream outputs** (created by handoff recipient, NOT by this skill):

| Output | Location | Purpose |
|--------|----------|---------|
| TDD Document | `thoughts/shared/tdd/{date}-{feature}-tdd.md` | SOT #2 — test specifications |
| Strategy | `thoughts/shared/strategy/{date}-{feature}-strategy.md` | SOT #3 — implementation ordering |

**Note:** The handoff prompt MUST be a separate file, not embedded in other documents. This allows it to be easily shared and executed independently.

---

## Quality Checklist

Before completing, verify:

- [ ] Codebase deeply studied (not superficial)
- [ ] Research critically evaluated (not blindly accepted)
- [ ] Gaps identified and resolved
- [ ] Spec is exhaustively detailed
- [ ] Every requirement has a unique, stable FR-X.Y.Z identifier
- [ ] Every requirement has explicit acceptance criteria bullets (not buried in prose)
- [ ] Research test strategy preserved (if research had test sections)
- [ ] Spec contains only committed scope (no "could have" or hedged items)
- [ ] Architecture includes complete implementation code
- [ ] Architecture is marked SUPPLEMENTARY (spec is PRIMARY SOT)
- [ ] Core tests are real E2E tests (not unit test stubs)
- [ ] All file paths are accurate
- [ ] Integration points clearly documented
- [ ] Handoff prompt written to SEPARATE file (`thoughts/shared/prompts/`)
- [ ] Handoff prompt references 3-SOT pipeline (spec-to-tdd → strategy → beads-from-sources)
- [ ] Handoff prompt includes master workflow as FIRST prerequisite

---

## Supporting Files

- **METHODOLOGY.md** - Detailed step-by-step process
- **TEMPLATES.md** - Document templates
- **CHECKLIST.md** - Quality verification checklist

---
