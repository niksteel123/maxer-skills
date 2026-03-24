# Research to Spec Methodology

Detailed step-by-step process for converting research documents into production-ready specification and architecture documents.

---

## Step 0: Gather Inputs

### Identify Research Documents

Collect all research documents to process:
```
thoughts/shared/research/{date}-{feature}-*.md
```

These may include:
- Feature exploration documents
- Technical investigation notes
- Prototype documentation
- Integration analysis

### Identify Output Locations

Prepare output paths:
```
Spec:         thoughts/shared/specs/{date}-{feature}-spec.md
Architecture: thoughts/shared/architecture/{date}-{feature}-architecture.md
```

---

## Step 1: Deep Codebase Study

### 1.1 Extract Touchpoints from Research

Read research documents and list every file/component mentioned:
- Files to modify
- Files to create
- Files to integrate with
- Related systems

### 1.2 Study Each Touchpoint

For each identified file, use exploration tools:

```bash
# Find the file
mcp__morph-mcp__warpgrep_codebase_search "find {component} implementation"

# Read completely
Read {file_path}

# Understand patterns
Grep "pattern" {directory}
```

**Document findings:**
- Current architecture
- Patterns used
- Dependencies
- Integration points

### 1.3 Study Related Systems

Look for similar features already implemented:
- How are they structured?
- What patterns do they follow?
- What test approaches are used?

### 1.4 Study Test Infrastructure

Understand existing test patterns:
- E2E test frameworks available
- Integration test patterns
- Test data management
- Evidence capture (screenshots, logs)

### 1.5 Create Codebase Summary

Write internal notes:
```markdown
## Codebase Analysis

### Files to Modify
- `path/file.ts` - Current purpose, what changes needed
- `path/other.ts` - Current purpose, integration point

### Patterns Observed
- Pattern A: Description, used in [files]
- Pattern B: Description, used in [files]

### Integration Points
- System X: How to integrate, what APIs available
- System Y: Constraints, requirements

### Test Infrastructure
- E2E: Framework, patterns
- Integration: Approach used
```

---

## Step 2: Research Document Analysis

### 2.1 Read All Research Thoroughly

For each research document:
1. Read completely (no skimming)
2. Extract key information
3. Note assumptions made

### 2.2 Extract Features

Create feature inventory:
```markdown
## Feature Inventory

### Feature 1: {Name}
- Description: ...
- Research location: §{section}
- Proposed approach: ...
- Files mentioned: ...

### Feature 2: {Name}
...
```

### 2.3 Map Features to Codebase

For each feature:
```markdown
### Feature 1 Mapping

| Research Says | Codebase Reality | Status |
|---------------|------------------|--------|
| Modify file X | File exists at path Y | Verified |
| Use API Z | API exists in file W | Verified |
| Pattern A | Pattern B is used instead | Discrepancy |
```

### 2.4 List Assumptions

Document all assumptions in research:
```markdown
## Research Assumptions

1. Assumes X API exists - VERIFY
2. Assumes pattern Y is used - VERIFY
3. Assumes file Z location - VERIFY
```

### 2.5 Extract Test Strategy from Research

If the research document contains test strategy sections (test scenarios, validation matrices, test approaches):

```markdown
## Research Test Strategy Extraction

### Tests to Carry Forward (spec-relevant)
- Test/Scenario 1: Description → maps to FR-X.Y.Z
- Test/Scenario 2: Description → maps to FR-X.Y.Z

### Tests to Acknowledge as Prior Art
- Test/Scenario 3: Research-level, informative for TDD author

### Tests NOT Carried Forward (and why)
- Test/Scenario 4: Out of scope for committed spec
```

**Why:** Research authors often include valuable test thinking. Silently discarding it loses institutional knowledge and may miss important validation scenarios.

---

## Step 3: Gap Analysis

### 3.1 Validate Each Assumption

For each assumption from Step 2.4:
- Search codebase for evidence
- Confirm or refute
- Document findings

### 3.2 Identify Discrepancies

```markdown
## Discrepancies Found

### D1: {Description}
- Research says: ...
- Reality is: ...
- Impact: ...
- Resolution: ...

### D2: {Description}
...
```

### 3.3 Challenge Proposed Approaches

For each major design decision in research:
1. Is this the best approach given codebase reality?
2. Are there simpler alternatives?
3. Does it align with existing patterns?
4. What are the trade-offs?

### 3.4 Identify Missing Considerations

What did research miss?
- Edge cases
- Error scenarios
- Permission requirements
- Performance implications
- Backward compatibility

### 3.5 Document Alternative Approaches

If you identify better approaches:
```markdown
## Alternative Approaches Considered

### Original: {Research Approach}
- Pros: ...
- Cons: ...

### Alternative: {Your Approach}
- Pros: ...
- Cons: ...
- Why better: ...
```

---

## Step 4: Architecture Design

### 4.1 Define Data Models

Design all data structures:
```typescript
interface SessionState {
  agentId: string;
  state: 'running' | 'paused' | 'stopped' | 'error';
  // ... complete definition
}
```

### 4.2 Define Database Schema

If database changes needed:
```sql
CREATE TABLE session_states (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL REFERENCES agents(id),
  -- ... complete schema
);

CREATE INDEX idx_session_states_agent ON session_states(agent_id);
```

### 4.3 Define API Contracts

For each endpoint:
```markdown
### POST /agents/:agentId/session/pause

**Request:**
```json
{
  "reason": "optional pause reason"
}
```

**Response 200:**
```json
{
  "success": true,
  "previousState": "running",
  "newState": "paused"
}
```

**Response 403:**
```json
{
  "error": "permission_denied",
  "required": "agent:session:pause"
}
```
```

### 4.4 Define Component Structure

Plan the code organization:
```
apps/core/src/session/
├── service.ts      # SessionService class
├── memory.ts       # MemoryService class
├── routes.ts       # HTTP route handlers
├── errors.ts       # Error definitions
└── types.ts        # TypeScript types
```

### 4.5 Design Integration Approach

How does new code connect to existing:
- Which existing files need modifications
- What new imports/exports needed
- Backward compatibility approach

---

## Step 5: Write Specification Document

### 5.1 Create Document Structure

```markdown
# {Feature} - Specification

## 1. Overview
## 2. Functional Requirements
## 3. User Stories
## 4. E2E Test Scenarios
## 5. Dependencies
## 6. Risks and Mitigations
## 7. Future Considerations
## 8. Integration Requirements (skills, docs, etc.)
## Document History
```

### 5.2 Write Functional Requirements

For EACH requirement, include:

```markdown
#### FR-X.Y.Z: Requirement Title

**Requirement**: Clear, unambiguous statement of what MUST happen.

**Acceptance Criteria**:
- Criterion 1
- Criterion 2
- Criterion 3

**Core Test**:
```bash
# Setup
SETUP_COMMAND

# Execute
RESPONSE=$(curl -s "http://endpoint" ...)

# Verify
echo "$RESPONSE" | jq -e '.expected' && \
echo "PASS: FR-X.Y.Z" || echo "FAIL: FR-X.Y.Z"
```
```

### 5.2b Requirement ID Convention (MANDATORY)

Every functional requirement MUST follow strict formatting for mechanical coverage verification:

1. **ID format**: `FR-X.Y.Z` where X=section, Y=subsection, Z=requirement
2. **IDs are immutable** — never renumber after assignment
3. **Acceptance criteria use sub-IDs**: `AC-FR-2.1.1-a`, `AC-FR-2.1.1-b`
4. **No requirements in prose** — every requirement gets its own `#### FR-X.Y.Z` heading
5. **No implicit requirements** — if it matters, give it an ID

**Verification:** A downstream tool must be able to `grep -oP 'FR-\d+\.\d+\.\d+' spec.md | sort -u` to get the complete requirement inventory.

### 5.2c "Everything Ships" Rule

The spec contains ONLY committed scope:
- Research Must + Should → spec
- Research Could + Won't → stay in research doc
- Section 7 (Future Considerations) = explicit out-of-scope extensions, NOT hedged scope

**If it's in the spec, it ships. If it shouldn't ship, remove it from the spec.**

### 5.3 Write E2E Test Scenarios

Include complete test flows:

```markdown
### 4.1 Clean Slate Protocol

Before each test run:
1. Step to reset state
2. Step to clean data
3. Step to prepare environment

### 4.2 Scenario: {Name}

**Setup:**
```bash
# Commands to set up test
```

**Execute:**
```bash
# Commands to run test
```

**Verify:**
```bash
# Commands to check results
```

**Evidence:**
- Screenshot: path/to/screenshot.png
- Logs: path/to/logs
```

### 5.4 Be Exhaustively Detailed

The spec should answer ANY question about what to build:
- Every edge case
- Every error scenario
- Every permission check
- Every validation rule

### 5.5 Coverage Verification Gate (MANDATORY)

Before proceeding to Step 6, mechanically verify the spec is coverage-checkable:

1. **Extract all FR-IDs**: `grep -oP 'FR-\d+\.\d+\.\d+' spec.md | sort -u`
2. **Count**: Every extracted ID must have an `#### FR-X.Y.Z` heading, acceptance criteria bullets, and a Core Test
3. **Scan for orphan requirements**: Search for "must", "shall", "required" in prose paragraphs — if any describe requirements not captured in an FR-section, extract them into new FR-IDs
4. **Verify "Everything Ships"**: Scan for hedging language ("could", "nice to have", "post-MVP", "future") — if found in a requirement section, either commit it (remove hedge) or move it to Section 7

**STOP if any FR-ID lacks acceptance criteria or a Core Test. Fix before continuing.**

---

## Step 6: Write Architecture Document

### 6.1 Create Document Structure

```markdown
# {Feature} - Architecture

## 1. System Overview
## 2. Data Flow Diagrams
## 3. Database Schema
## 4. API Specification
## 5. Component Implementation
## 6. Integration Points
## 7. Error Handling
## 8. Scalability Considerations
## 9. Implementation Phases
## Document History
```

### 6.2 Include ASCII Diagrams

```markdown
## System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SYSTEM ARCHITECTURE                             │
│                                                                             │
│  ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                   │
│  │  Component  │────▶│  Component  │────▶│  Component  │                   │
│  │     A       │     │     B       │     │     C       │                   │
│  └─────────────┘     └─────────────┘     └─────────────┘                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```
```

### 6.3 Include Complete Implementation Code

Not pseudocode - actual working code:

```markdown
### 5.1 Session Service

```typescript
import type { DbHandle } from '@project/db';

export class SessionService {
  constructor(private db: DbHandle) {}

  async pauseAgent(agentId: string, requesterId: string): Promise<PauseResult> {
    // Check permissions
    await this.checkPermission(requesterId, agentId, 'agent:session:pause');

    // Get current state
    const current = await this.getState(agentId);
    if (current.state !== 'running') {
      throw new SessionError(
        `Cannot pause agent in state: ${current.state}`,
        'invalid_state',
        400
      );
    }

    // Send control message to bridge
    const bridge = this.bridges.get(agentId);
    if (!bridge) {
      throw new SessionError('Agent not connected', 'agent_not_connected', 503);
    }

    bridge.send(JSON.stringify({ type: 'control:pause' }));

    // Update state in database
    this.db.prepare(`
      UPDATE session_states
      SET state = 'paused', updated_at = ?
      WHERE agent_id = ?
    `).run(Date.now(), agentId);

    // Broadcast state change
    this.broadcastStateChange(agentId, 'paused');

    return {
      success: true,
      previousState: 'running',
      newState: 'paused',
    };
  }

  // ... additional methods
}
```
```

### 6.4 Document All Integration Points

```markdown
## 6. Integration Points

### 6.1 Bridge Module (`apps/cli/src/bridge.ts`)

**Current State:**
- Handles PTY spawn and WebSocket connection
- Has persistent session mode

**Required Changes:**
- Add output routing to Core
- Add control message handling
- Add SIGSTOP/SIGCONT signal handling

**Code to Add:**
```typescript
// After line 245, add:
ws.on('message', (data) => {
  const msg = JSON.parse(data.toString());
  if (msg.type === 'control:pause') {
    process.kill(child.pid, 'SIGSTOP');
    ws.send(JSON.stringify({ type: 'state', state: 'paused' }));
  }
});
```
```

---

## Step 7: Generate Handoff Prompt

### 7.1 Identify Key Codebase Files

List all files the implementation agent should study:
```markdown
**Core Files to Study:**
```
path/to/file1.ts    # Description
path/to/file2.ts    # Description
path/to/dir/        # Description
```
```

### 7.2 Reference All Documents

```markdown
**Specification Document (SOURCE OF TRUTH):**
`{full path to spec}`

**Architecture Document:**
`{full path to architecture}`

**Original Research (for context):**
`{full path to research}`
```

### 7.3 Include QA Strategy

```markdown
**QA Strategy:**
- E2E tests for all features
- Screenshot evidence for UI
- Log evidence for API
- Clean slate before scenarios
```

### 7.4 Include Stop Points

```markdown
### MANDATORY STOP

After beads-to-execution, you MUST:
1. STOP - Do not implement
2. Report completion
3. Wait for authorization
```

---

## Quality Verification

Before delivering, verify:

### Specification Quality
- [ ] Every requirement has Core Test
- [ ] Core Tests are real E2E (not unit tests)
- [ ] All edge cases covered
- [ ] All error scenarios documented
- [ ] User stories complete
- [ ] E2E scenarios executable

### Architecture Quality
- [ ] System diagrams clear
- [ ] Data flows documented
- [ ] Complete implementation code (not stubs)
- [ ] API contracts complete with examples
- [ ] Integration points specific
- [ ] File paths accurate

### Handoff Quality
- [ ] All documents referenced
- [ ] Key files listed
- [ ] Workflow steps clear
- [ ] Stop points emphasized
