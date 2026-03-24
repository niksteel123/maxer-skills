# Templates

Ready-to-use templates for specification and architecture documents.

---

## Specification Document Template

```markdown
# {Feature Name} - Specification

> Comprehensive specification for {feature description}.

---

## 1. Overview

### 1.1 Feature Summary

{2-3 paragraph description of what this feature does and why it's needed}

### 1.2 Goals

1. **Goal 1**: Description
2. **Goal 2**: Description
3. **Goal 3**: Description

### 1.3 Non-Goals

- Non-goal 1: Why explicitly excluded
- Non-goal 2: Why explicitly excluded

### 1.4 Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| Metric 1 | Target value | How to measure |
| Metric 2 | Target value | How to measure |

---

## 2. Functional Requirements

### 2.1 {Category Name}

#### FR-2.1.1: {Requirement Title}

**Requirement**: {Clear statement of what MUST happen}

**Acceptance Criteria**:
- Criterion 1
- Criterion 2
- Criterion 3

**Core Test**:
```bash
# Setup (if needed)
{setup commands}

# Execute
RESPONSE=$(curl -s "{endpoint}" ...)

# Verify
echo "$RESPONSE" | jq -e '{assertion}' && \
echo "PASS: FR-2.1.1" || echo "FAIL: FR-2.1.1"
```

#### FR-2.1.2: {Requirement Title}

{Same structure as above}

### 2.2 {Category Name}

{Continue pattern for all requirements}

---

## 3. User Stories

### US-1: {Story Title}

**As** a {persona}
**I want** {goal/desire}
**So that** {benefit/value}

**Acceptance Criteria**:
1. Criterion 1
2. Criterion 2
3. Criterion 3

### US-2: {Story Title}

{Same structure}

---

## 4. E2E Test Scenarios

### 4.1 Clean Slate Protocol

Before each E2E test run, execute these steps:

```bash
# 1. Reset component A
{command}

# 2. Clean data store B
{command}

# 3. Verify clean state
{command}
```

### 4.2 Scenario: {Scenario Name}

**Purpose**: What this scenario validates

**Prerequisites**:
- Prerequisite 1
- Prerequisite 2

**Setup**:
```bash
# Setup commands
{commands}
```

**Execution**:
```bash
# Test execution commands
{commands}
```

**Verification**:
```bash
# Verification commands
{commands}
```

**Evidence Required**:
- [ ] Screenshot of {state}
- [ ] Log showing {event}

### 4.3 Scenario: {Another Scenario}

{Same structure}

---

## 5. Dependencies

### 5.1 External Dependencies

| Dependency | Version | Purpose |
|------------|---------|---------|
| Dependency 1 | X.Y.Z | Purpose |

### 5.2 Internal Dependencies

| Component | Relationship | Notes |
|-----------|--------------|-------|
| Component A | Depends on | Details |

### 5.3 Required Permissions

| Permission | Required For | Profiles |
|------------|--------------|----------|
| permission:scope | FR-X.Y.Z | lead, senior |

---

## 6. Risks and Mitigations

| Risk | Severity | Likelihood | Mitigation |
|------|----------|------------|------------|
| Risk 1 | High/Med/Low | High/Med/Low | Mitigation strategy |
| Risk 2 | High/Med/Low | High/Med/Low | Mitigation strategy |

---

## 7. Future Considerations

1. **Future Item 1**: Description of planned extension
2. **Future Item 2**: Description of planned extension
3. **Future Item 3**: Description of planned extension

---

## 8. Integration Requirements

### 8.1 Documentation Updates

| Document | Change Required |
|----------|-----------------|
| Document 1 | Description |

### 8.2 Skill Updates (if applicable)

| Skill | Change Required |
|-------|-----------------|
| skill-name | Description |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | Author | Initial specification |
```

---

## Architecture Document Template

```markdown
# {Feature Name} - Architecture

> Technical architecture for {feature description}.

---

## 1. System Overview

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              {SYSTEM NAME}                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐       │
│  │   Component A   │────▶│   Component B   │────▶│   Component C   │       │
│  │                 │     │                 │     │                 │       │
│  │  Description    │     │  Description    │     │  Description    │       │
│  └─────────────────┘     └─────────────────┘     └─────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Component Descriptions

| Component | Responsibility | Location |
|-----------|----------------|----------|
| Component A | Description | `path/to/component` |
| Component B | Description | `path/to/component` |

---

## 2. Data Flow Diagrams

### 2.1 {Flow Name}

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              {FLOW NAME}                                     │
│                                                                             │
│  ┌─────────┐         ┌─────────┐         ┌─────────┐         ┌─────────┐   │
│  │ Actor   │         │ System  │         │ System  │         │ Storage │   │
│  │   A     │         │   B     │         │   C     │         │         │   │
│  └────┬────┘         └────┬────┘         └────┬────┘         └────┬────┘   │
│       │                   │                   │                   │         │
│       │   1. Action       │                   │                   │         │
│       ├──────────────────▶│                   │                   │         │
│       │                   │                   │                   │         │
│       │                   │   2. Process      │                   │         │
│       │                   ├──────────────────▶│                   │         │
│       │                   │                   │                   │         │
│       │                   │                   │   3. Store        │         │
│       │                   │                   ├──────────────────▶│         │
│       │                   │                   │                   │         │
│       │                   │   4. Response     │                   │         │
│       │◀────────────────────────────────────────────────────────────────    │
│       │                   │                   │                   │         │
└───────┴───────────────────┴───────────────────┴───────────────────┴─────────┘
```

### 2.2 {Another Flow}

{Same structure}

---

## 3. Database Schema

### 3.1 New Tables

#### {table_name}

```sql
CREATE TABLE {table_name} (
  id TEXT PRIMARY KEY,
  field_1 TEXT NOT NULL,
  field_2 INTEGER DEFAULT 0,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
  updated_at INTEGER,

  FOREIGN KEY (field_1) REFERENCES other_table(id)
);

CREATE INDEX idx_{table_name}_field_1 ON {table_name}(field_1);
CREATE INDEX idx_{table_name}_created ON {table_name}(created_at);
```

**Field Descriptions:**

| Field | Type | Description |
|-------|------|-------------|
| id | TEXT | Primary key, format: `prefix-{random}` |
| field_1 | TEXT | Description |

### 3.2 Schema Modifications

{If modifying existing tables}

---

## 4. API Specification

### 4.1 {Category} Endpoints

#### {METHOD} {path}

**Description**: What this endpoint does.

**Request**:
```
{METHOD} {path}
Authorization: Bearer <token>
Content-Type: application/json

{
  "field_1": "value",
  "field_2": 123
}
```

**Response 200**:
```json
{
  "success": true,
  "data": {
    "id": "resource-123",
    "field_1": "value"
  }
}
```

**Response 400** (Validation Error):
```json
{
  "error": "validation_error",
  "message": "field_1 is required",
  "field": "field_1"
}
```

**Response 403** (Permission Denied):
```json
{
  "error": "permission_denied",
  "required": "permission:scope"
}
```

**Response 404** (Not Found):
```json
{
  "error": "not_found",
  "resource": "resource_type",
  "id": "resource-123"
}
```

### 4.2 WebSocket Protocol (if applicable)

#### Message Types

```typescript
// Client → Server
interface ClientMessage {
  type: 'subscribe' | 'unsubscribe' | 'action';
  // ... fields
}

// Server → Client
interface ServerMessage {
  type: 'event' | 'error' | 'ack';
  // ... fields
}
```

---

## 5. Component Implementation

### 5.1 {Component Name} (`path/to/component.ts`)

```typescript
import type { Dependencies } from './types';

export interface {ComponentName}Config {
  option1: string;
  option2?: number;
}

export class {ComponentName} {
  private state: Map<string, StateItem> = new Map();

  constructor(
    private config: {ComponentName}Config,
    private deps: Dependencies
  ) {}

  /**
   * Method description
   * @param param1 - Description
   * @returns Description
   * @throws {ErrorType} When condition
   */
  async methodName(param1: string): Promise<ReturnType> {
    // Validation
    if (!param1) {
      throw new ValidationError('param1 is required');
    }

    // Business logic
    const result = await this.deps.otherService.doSomething(param1);

    // State update
    this.state.set(param1, result);

    // Return
    return {
      success: true,
      data: result,
    };
  }

  /**
   * Another method
   */
  async anotherMethod(): Promise<void> {
    // Implementation
  }
}
```

### 5.2 {Another Component}

{Same structure}

---

## 6. Integration Points

### 6.1 {Existing Component} Integration

**File**: `path/to/existing/file.ts`

**Current State**:
- Description of current functionality
- Relevant existing code

**Required Changes**:

```typescript
// Add import at top
import { NewComponent } from '../new/component';

// Add to existing class (after line X)
private newComponent: NewComponent;

// Modify constructor
constructor(deps: Deps) {
  // ... existing code ...
  this.newComponent = new NewComponent(deps.config);
}

// Add new method
async newMethod(): Promise<void> {
  return this.newComponent.doSomething();
}
```

### 6.2 {Another Integration}

{Same structure}

---

## 7. Error Handling

### 7.1 Error Types

```typescript
export class {Feature}Error extends Error {
  constructor(
    message: string,
    public code: string,
    public status: number = 500
  ) {
    super(message);
    this.name = '{Feature}Error';
  }
}

export const {FEATURE}_ERRORS = {
  NOT_FOUND: new {Feature}Error('Resource not found', 'not_found', 404),
  PERMISSION_DENIED: (perm: string) =>
    new {Feature}Error(`Permission denied: ${perm}`, 'permission_denied', 403),
  INVALID_STATE: (current: string, required: string) =>
    new {Feature}Error(
      `Invalid state: ${current}, requires ${required}`,
      'invalid_state',
      400
    ),
};
```

### 7.2 Error Handling Pattern

```typescript
app.post('/endpoint', async (request, reply) => {
  try {
    const result = await service.doSomething(request.body);
    return reply.send(result);
  } catch (err) {
    if (err instanceof {Feature}Error) {
      return reply.status(err.status).send({
        error: err.code,
        message: err.message,
      });
    }
    // Log unexpected errors
    logger.error('Unexpected error', { err });
    return reply.status(500).send({ error: 'internal_error' });
  }
});
```

---

## 8. Scalability Considerations

### 8.1 Performance

| Concern | Approach |
|---------|----------|
| Concern 1 | Solution/mitigation |
| Concern 2 | Solution/mitigation |

### 8.2 Resource Limits

| Resource | Limit | Rationale |
|----------|-------|-----------|
| Resource 1 | Value | Why this limit |

### 8.3 Caching Strategy

{If applicable}

---

## 9. Implementation Phases

### Phase 1: {Phase Name}
- Task 1
- Task 2
- Gate: Verification criteria

### Phase 2: {Phase Name}
- Task 1
- Task 2
- Gate: Verification criteria

{Continue for all phases}

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | YYYY-MM-DD | Author | Initial architecture |
```

---

## Handoff Prompt Template

```markdown
## Handoff: {Feature Name} Implementation

---

### Your Mission

Prepare the {Feature Name} feature for multi-agent execution using the
**3-SOT pipeline**: create TDD (SOT #2), implementation strategy (SOT #3),
then beads directly from all three source-of-truth documents.
**Do NOT implement any beads in this session - preparation only.**

---

### Step 0: Study the Workflow Skills (MANDATORY FIRST)

Before doing ANYTHING else, thoroughly read and understand the workflow skills:

1. `~/.claude/skills/master-workflow/SKILL.md`
2. `~/.claude/skills/reset-workspace/SKILL.md`
3. `~/.claude/skills/spec-to-tdd/SKILL.md` — Spec to TDD (SOT #2)
4. `~/.claude/skills/spec-to-strategy/SKILL.md` — Implementation strategy (SOT #3, ~500-800 line routing table)
5. `~/.claude/skills/beads-from-sources/SKILL.md` — Create beads from Spec + TDD + Strategy
6. `~/.claude/skills/beads-to-execution/SKILL.md`

These skills are your operational guide. Follow them precisely.

---

### Step 1: Study the Codebase (MANDATORY BEFORE PLANNING)

Before creating any plans, deeply explore the codebase.

**Core Files to Study:**
```
{path/to/file1}    # {description}
{path/to/file2}    # {description}
{path/to/dir/}     # {description}
```

For each file, understand:
- Current architecture and patterns
- How new code integrates
- Patterns to follow
- Dependencies

---

### Step 2: Read the Source Documents

**Specification (SOURCE OF TRUTH):**
`{path/to/spec.md}`

**Architecture:**
`{path/to/architecture.md}`

**Original Research:**
`{path/to/research.md}`

---

### Step 3: Clean Slate

Invoke `reset-workspace` skill:
- Wipe beads
- Reset AgentMail
- Clean workspace

---

### Step 4: Spec to TDD (SOT #2)

Invoke `spec-to-tdd` skill.

**Requirements:**
1. Layered tests: UT → IT → E2E
2. Tool selection matched to application medium
3. Real assertions, no stubs
4. Evidence requirements (screenshots, logs)

---

### Step 5: Create Implementation Strategy (SOT #3)

Invoke the `spec-to-strategy` skill.

Create a lightweight strategy document (~500-800 lines):
- Phase sequencing (what blocks what)
- Domain batches (which FRs group together)
- Gate criteria (what must pass before next phase)
- NOT task descriptions, NOT effort estimates

---

### Step 6: Create Beads from Sources

Invoke the `beads-from-sources` skill, using the strategy document as the
organizational framework and spec + TDD as source of truth inputs.

Create beads directly from Spec + TDD + Strategy:
- Embed spec sections verbatim in each bead
- Reference TDD test IDs with assertions
- Phase assignment from strategy
- SOURCE OF TRUTH WARNING in every bead
- Drift check: each bead faithfully represents spec

---

### Step 7: Beads to Execution

Invoke `beads-to-execution` skill.

---

### MANDATORY STOP

After beads-to-execution:

1. **STOP** - No implementation
2. **Report:**
   ```
   Setup complete for {Feature Name}

   Spec: {path}
   Arch: {path}
   Phases: docs/implementation/phase-*.md
   Kickoff: docs/plan-hub/prompts/{feature}-kickoff.md
   Ready beads: {count}

   Awaiting instruction.
   ```
3. **Wait for authorization**

---

### Deliverables

| Output | Status |
|--------|--------|
| Codebase studied | Required |
| Workspace reset | Required |
| Phase plans | Required |
| Beads created | Required |
| Kickoff prepared | Required |
| Implementation | DO NOT DO |
```

---

## Core Test Templates

### HTTP Endpoint Test

```bash
# {FR-X.Y.Z}: {Requirement Title}

# Setup
{SETUP_COMMANDS}

# Execute
RESPONSE=$(curl -s -X {METHOD} "http://127.0.0.1:{PORT}/{path}" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{json_body}')

# Verify
echo "$RESPONSE" | jq -e '{assertion}' && \
echo "PASS: FR-X.Y.Z" || echo "FAIL: FR-X.Y.Z"
```

### Database State Test

```bash
# {FR-X.Y.Z}: {Requirement Title}

# Execute action that should update DB
{ACTION_COMMAND}

# Query database
COUNT=$(sqlite3 "$DB_PATH" \
  "SELECT COUNT(*) FROM {table} WHERE {condition}")

# Verify
[ "$COUNT" -gt 0 ] && \
echo "PASS: FR-X.Y.Z" || echo "FAIL: FR-X.Y.Z"
```

### WebSocket Test

```bash
# {FR-X.Y.Z}: {Requirement Title}

# Connect and capture messages
timeout 10 websocat "ws://127.0.0.1:{PORT}/ws" > /tmp/ws-output.txt &
WS_PID=$!

sleep 2

# Trigger event
{TRIGGER_COMMAND}

sleep 3
kill $WS_PID 2>/dev/null

# Verify message received
grep -q "{expected_pattern}" /tmp/ws-output.txt && \
echo "PASS: FR-X.Y.Z" || echo "FAIL: FR-X.Y.Z"
```

### CLI Command Test

```bash
# {FR-X.Y.Z}: {Requirement Title}

# Execute CLI command
OUTPUT=$({cli_command} 2>&1)
EXIT_CODE=$?

# Verify exit code
[ $EXIT_CODE -eq 0 ] || { echo "FAIL: FR-X.Y.Z (exit $EXIT_CODE)"; exit 1; }

# Verify output
echo "$OUTPUT" | grep -q "{expected}" && \
echo "PASS: FR-X.Y.Z" || echo "FAIL: FR-X.Y.Z"
```

### SDK Client Test

```typescript
// {FR-X.Y.Z}: {Requirement Title}

import { Client } from '@project/client';

const client = new Client({
  baseUrl: process.env.API_URL,
  token: process.env.TOKEN,
});

async function test() {
  // Execute
  const result = await client.method(params);

  // Verify
  console.assert(result.field === expected, 'Field should match');
  console.assert(result.other !== undefined, 'Other should exist');

  console.log('PASS: FR-X.Y.Z');
}

test().catch((err) => {
  console.error('FAIL: FR-X.Y.Z', err.message);
  process.exit(1);
});
```
