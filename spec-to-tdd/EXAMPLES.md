# Spec to TDD - Examples

This document provides real-world examples of TDD documents for different application types.

---

## Example 1: Electron Desktop App - Workspace Management

This example shows TDD specifications for a workspace management feature in an Electron app.

```markdown
# Workspace Management - Test-Driven Development Plan

> **Document Type:** TDD Specification
> **Created:** 2025-01-13
> **Source Spec:** `thoughts/shared/specs/2025-01-13-workspace-management-spec.md`
> **Source Architecture:** `thoughts/shared/architecture/2025-01-13-workspace-architecture.md`

---

## 1. Test Philosophy

- No stubs, no fake tests, no mocks (except external services)
- Tests define behavior BEFORE implementation
- Evidence captured via Circuit Electron MCP screenshots

---

## 2. Layer 1: Unit Test Specifications

### 2.1 Workspace Name Validation

#### FR-1.1: Validate Workspace Name

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-FR-1.1.1 | Valid alphanumeric name | "my-workspace" | true | - |
| UT-FR-1.1.2 | Empty name rejected | "" | Error: "Name required" | null, undefined |
| UT-FR-1.1.3 | Special chars rejected | "my@workspace!" | Error: "Invalid characters" | all special chars |
| UT-FR-1.1.4 | Max length enforced | "a".repeat(100) | Error: "Max 64 chars" | 64, 65, 1000 |
| UT-FR-1.1.5 | Whitespace trimmed | "  test  " | "test" | leading, trailing, both |

**Failure Conditions:**
- Invalid names throw `ValidationError` with descriptive message
- Error messages include the invalid character or length

### 2.2 Workspace Path Generation

#### FR-1.2: Generate Workspace Path

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-FR-1.2.1 | Path from name | "my-project" | ".workspaces/my-project" | - |
| UT-FR-1.2.2 | Slugify spaces | "My Project" | ".workspaces/my-project" | multiple spaces |
| UT-FR-1.2.3 | Handle duplicates | existing: "test" | ".workspaces/test-2" | test-2, test-3 |

---

## 3. Layer 2: Integration Test Specifications

### 3.1 API Tests

#### Workspace CRUD Endpoints

| Test ID | Endpoint | Method | Request | Expected Response | Error Codes |
|---------|----------|--------|---------|-------------------|-------------|
| IT-API-1.1 | /api/workspaces | POST | `{ "name": "test" }` | 201 + `{ "id": "...", "name": "test" }` | 400, 409 |
| IT-API-1.2 | /api/workspaces | GET | - | 200 + `[{ "id": "...", "name": "..." }]` | - |
| IT-API-1.3 | /api/workspaces/:id | GET | - | 200 + `{ "id": "...", "name": "..." }` | 404 |
| IT-API-1.4 | /api/workspaces/:id | DELETE | - | 204 | 404 |

**Auth Scenarios:**
| Test ID | Scenario | Auth Header | Expected Result |
|---------|----------|-------------|-----------------|
| IT-AUTH-1.1 | Valid token | Bearer <valid> | 200/201 OK |
| IT-AUTH-1.2 | No token | (none) | 401 Unauthorized |
| IT-AUTH-1.3 | Invalid token | Bearer invalid | 401 Unauthorized |

### 3.2 CLI Tests

#### workspace:* Commands

| Test ID | Command | Args | Expected stdout | Exit Code | Side Effects |
|---------|---------|------|-----------------|-----------|--------------|
| IT-CLI-1.1 | workspace:create | --name "test" | "Created workspace: test" | 0 | .workspaces/test created |
| IT-CLI-1.2 | workspace:list | --json | `[{"name":"test",...}]` | 0 | - |
| IT-CLI-1.3 | workspace:delete | test | "Deleted workspace: test" | 0 | .workspaces/test removed |
| IT-CLI-1.4 | workspace:create | (no name) | "Error: Name required" | 1 | - |

---

## 4. Layer 3: E2E Test Specifications

### 4.1 Tool Selection

| Feature Area | Primary Tool | Evidence Type |
|--------------|--------------|---------------|
| Electron Desktop UI | Circuit Electron MCP | Screenshots, console logs |

### 4.2 User Story Scenarios

#### US-1: User Creates a New Workspace

**Tool:** Circuit Electron MCP

**Setup:**
1. Launch desktop app with `mcp__circuit_electron__app_launch`
2. Wait for main window: `mcp__circuit_electron__wait_for_load_state`

**Scenario Steps:**

| Step | Action | Verification | Screenshot |
|------|--------|--------------|------------|
| 1 | Take initial screenshot | App main view visible | 01-initial-state.png |
| 2 | Click "New Workspace" button (`[data-testid="new-workspace-btn"]`) | Modal appears | 02-modal-opened.png |
| 3 | Type "My Test Project" in name field | Input shows text | 03-name-entered.png |
| 4 | Click "Create" button | Modal closes, workspace in list | 04-workspace-created.png |
| 5 | Verify workspace in sidebar | "My Test Project" visible | 05-sidebar-updated.png |

**Teardown:**
1. Delete test workspace via UI or CLI
2. Close app: `mcp__circuit_electron__close`

**Evidence Requirements:**
| Evidence Type | Location | Format |
|---------------|----------|--------|
| Screenshots | test-screenshots/US-1/ | PNG (compressed) |
| Console logs | test-logs/US-1-console.json | JSON |

#### US-2: User Deletes a Workspace

**Tool:** Circuit Electron MCP

**Setup:**
1. Launch app
2. Create test workspace "to-delete"

**Scenario Steps:**

| Step | Action | Verification | Screenshot |
|------|--------|--------------|------------|
| 1 | Right-click workspace "to-delete" | Context menu appears | 01-context-menu.png |
| 2 | Click "Delete" option | Confirmation dialog appears | 02-confirm-dialog.png |
| 3 | Click "Confirm Delete" | Workspace removed from list | 03-deleted.png |

---

## 5. QA Gate Criteria

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Unit | 100% UT-* pass | `bun test -- --grep "UT-"` |
| Integration | 100% IT-* pass | `bun test -- --grep "IT-"` |
| E2E | US-1, US-2 complete | Circuit screenshots captured |
| Evidence | 8 screenshots exist | Check test-screenshots/ |
| Eye Test | UI looks correct | Review screenshots manually |

---

## 6. Anti-Pattern Checklist

- [ ] No TODO placeholders
- [ ] No .skip markers
- [ ] No empty test bodies
- [ ] No mock overuse
```

---

## Example 2: CLI Application - Beads Task Management

This example shows TDD specifications for a CLI tool.

```markdown
# Beads CLI - Test-Driven Development Plan

> **Document Type:** TDD Specification
> **Created:** 2025-01-13
> **Source Spec:** `thoughts/shared/specs/2025-01-13-beads-cli-spec.md`

---

## 2. Layer 1: Unit Test Specifications

### 2.1 Bead ID Generation

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-BD-1.1 | Generate unique ID | project: "test" | "test-abc123" | collision handling |
| UT-BD-1.2 | ID format validation | "test-abc" | true (valid) | special chars |
| UT-BD-1.3 | Parse ID components | "test-abc123" | { project: "test", hash: "abc123" } | malformed IDs |

### 2.2 Dependency Resolution

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-BD-2.1 | No deps = ready | bead with deps: [] | status: ready | - |
| UT-BD-2.2 | Unmet dep = blocked | deps: ["bd-1"], bd-1: open | status: blocked | - |
| UT-BD-2.3 | All deps met = ready | deps: ["bd-1"], bd-1: closed | status: ready | - |
| UT-BD-2.4 | Cycle detection | A→B→C→A | Error: "Circular dependency" | self-reference |

---

## 3. Layer 2: Integration Test Specifications

### 3.1 CLI Tests

| Test ID | Command | Args | Expected stdout | Exit Code | Side Effects |
|---------|---------|------|-----------------|-----------|--------------|
| IT-BD-1.1 | bd create | "Task title" | "Created bd-xxx" | 0 | .beads/issues.jsonl updated |
| IT-BD-1.2 | bd list | --json | `[{...}]` | 0 | - |
| IT-BD-1.3 | bd show | bd-xxx | Full bead details | 0 | - |
| IT-BD-1.4 | bd update | bd-xxx --status active | "Updated bd-xxx" | 0 | Status changed |
| IT-BD-1.5 | bd close | bd-xxx --message "Done" | "Closed bd-xxx" | 0 | Status = closed |
| IT-BD-1.6 | bd ready | --json | Ready beads list | 0 | - |

### 3.2 File State Tests

| Test ID | Action | Before State | After State |
|---------|--------|--------------|-------------|
| IT-FILE-1.1 | bd create | 0 lines in issues.jsonl | 1 line added |
| IT-FILE-1.2 | bd close | status: "open" | status: "closed" |

---

## 4. Layer 3: E2E Test Specifications

### 4.1 Tool Selection

| Feature Area | Primary Tool | Evidence Type |
|--------------|--------------|---------------|
| CLI/Terminal | Bash scripts | stdout/stderr capture |

### 4.2 User Story Scenarios

#### US-1: Developer Creates and Completes a Task

**Tool:** Bash

**Setup:**
```bash
# Create fresh test directory
rm -rf /tmp/test-beads
mkdir -p /tmp/test-beads
cd /tmp/test-beads
bd init
```

**Scenario Steps:**

| Step | Command | Expected Output | Verification |
|------|---------|-----------------|--------------|
| 1 | `bd create "Fix login bug"` | "Created bd-xxx" | Exit code 0 |
| 2 | `bd list --json \| jq length` | "1" | One bead exists |
| 3 | `bd update bd-xxx --status active` | "Updated bd-xxx" | Status changed |
| 4 | `bd close bd-xxx --message "Fixed"` | "Closed bd-xxx" | Status = closed |
| 5 | `bd ready --json \| jq length` | "0" | No ready beads |

**Evidence Capture:**
```bash
# Capture all output
script -q /tmp/test-logs/US-1.log bash -c '
  bd create "Fix login bug"
  bd list --json
  bd update $BEAD_ID --status active
  bd close $BEAD_ID --message "Fixed"
  bd ready --json
'
```

---

## 5. QA Gate Criteria

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Unit | All UT-BD-* pass | `bun test -- --grep "UT-BD"` |
| Integration | All IT-BD-* pass | `bun test -- --grep "IT-BD"` |
| E2E | US-1 complete | Review test-logs/US-1.log |
| Evidence | Log file captured | File exists with expected output |
```

---

## Example 3: REST API - User Authentication

This example shows TDD specifications for an API.

```markdown
# User Authentication API - Test-Driven Development Plan

> **Document Type:** TDD Specification
> **Created:** 2025-01-13

---

## 2. Layer 1: Unit Test Specifications

### 2.1 Password Hashing

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-AUTH-1.1 | Hash password | "password123" | bcrypt hash string | empty string |
| UT-AUTH-1.2 | Verify correct password | password + hash | true | - |
| UT-AUTH-1.3 | Reject wrong password | wrong + hash | false | similar passwords |

### 2.2 JWT Token Generation

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-AUTH-2.1 | Generate valid token | userId: "123" | JWT string | - |
| UT-AUTH-2.2 | Token contains claims | token | { sub: "123", exp: ... } | - |
| UT-AUTH-2.3 | Verify valid token | valid token | decoded payload | - |
| UT-AUTH-2.4 | Reject expired token | expired token | Error: "Token expired" | just expired |
| UT-AUTH-2.5 | Reject invalid token | "not.a.token" | Error: "Invalid token" | malformed |

---

## 3. Layer 2: Integration Test Specifications

### 3.1 API Tests

#### Authentication Endpoints

| Test ID | Endpoint | Method | Request | Expected Response | Error Codes |
|---------|----------|--------|---------|-------------------|-------------|
| IT-AUTH-API-1 | /api/auth/register | POST | `{ "email": "test@example.com", "password": "pass123" }` | 201 + `{ "id": "...", "email": "..." }` | 400, 409 |
| IT-AUTH-API-2 | /api/auth/login | POST | `{ "email": "test@example.com", "password": "pass123" }` | 200 + `{ "token": "..." }` | 400, 401 |
| IT-AUTH-API-3 | /api/auth/me | GET | (with Bearer token) | 200 + `{ "id": "...", "email": "..." }` | 401 |
| IT-AUTH-API-4 | /api/auth/logout | POST | (with Bearer token) | 204 | 401 |

---

## 4. Layer 3: E2E Test Specifications

### 4.1 Tool Selection

| Feature Area | Primary Tool | Evidence Type |
|--------------|--------------|---------------|
| REST API | curl + jq | JSON response logs |

### 4.2 User Story Scenarios

#### US-1: User Registers and Logs In

**Tool:** curl + jq

**Scenario:**

```bash
#!/bin/bash
LOG_FILE="/tmp/test-logs/US-AUTH-1.log"
API_URL="http://localhost:3000"

echo "=== US-1: User Registration and Login ===" > $LOG_FILE

# Step 1: Register
echo "Step 1: Register" >> $LOG_FILE
curl -s -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' \
  | tee -a $LOG_FILE | jq .

# Step 2: Login
echo "Step 2: Login" >> $LOG_FILE
TOKEN=$(curl -s -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}' \
  | tee -a $LOG_FILE | jq -r .token)

# Step 3: Get profile
echo "Step 3: Get profile with token" >> $LOG_FILE
curl -s "$API_URL/api/auth/me" \
  -H "Authorization: Bearer $TOKEN" \
  | tee -a $LOG_FILE | jq .

echo "=== Complete ===" >> $LOG_FILE
```

**Evidence:**
- `test-logs/US-AUTH-1.log` - Complete request/response log
```

---

## Example 4: 3-SOT Aligned TDD — Coverage Matrix, Step Tags, CI Tiers

This example shows TDD specifications aligned with the 3-SOT (Three Sources of Truth) workflow model, demonstrating coverage matrices, step-tagged tests, CI tier classification, and gap detection — patterns used in production L2.5 TDD documents.

### Coverage Matrix

The coverage matrix maps every subsystem to its test counts by type and implementation step. Zero silent gaps — if a spec requirement exists, a test row must cover it.

```markdown
## Coverage Matrix

| # | Subsystem | Description | UT | IT | E2E | VT | Step |
|---|-----------|-------------|----|----|-----|-----|------|
| 01 | Auth | Session, token, RBAC | 12 | 6 | 3 | 0 | 1 |
| 02 | API Gateway | Routes, middleware, rate limit | 8 | 5 | 2 | 0 | 1 |
| 03 | Data Store | CRUD, transactions, migration | 15 | 8 | 4 | 0 | 1,2 |
| 04 | UI Shell | Navigation, theme, layout | 6 | 3 | 2 | 4 | 2 |
| **TOTAL** | | | **41** | **22** | **11** | **4** | |

**Grand Total: 78 tests**
```

**Why this matters:** Downstream beads authors use this matrix to verify their task covers all assigned tests. If a subsystem shows 0 in a column, that is an intentional decision — not a gap. The Step column tells which implementation phase the tests belong to, preventing step:3 tests from leaking into step:1 beads.

### Step-Tagged Test Specification

Every test carries metadata tags that downstream consumers (plans, beads, CI) use for filtering and assignment. The 4-part structure (Setup, Execution, Assertions, Cleanup) eliminates ambiguity about what "passes" means.

```markdown
#### UT-AUTH-001: Token Validation — Valid JWT Accepted

**step: 1 | subsystem: Auth | priority: P0 | tier: T1**

**Setup:**
- Generate valid JWT with known secret and claims {sub: "user_123", exp: now+1h}

**Execution:**
- Call `validateToken(jwt)` with the generated token

**Assertions:**
- Returns `Ok(Claims { sub: "user_123" })` — not just "truthy"
- `claims.exp` matches expected expiry within 1s tolerance
- `claims.iat` is present and < now

**Cleanup:** None (pure function)

**False Positive Prevention:** Uses a DIFFERENT valid token format than the one hardcoded in any mock. Verifies actual claim values, not just that parsing succeeds.
```

**Why this matters:** The `step: 1` tag ensures this test is assigned to a Step 1 bead — not deferred to later steps. The `tier: T1` tag places it in the fastest CI tier. The `priority: P0` tag means it blocks the QA gate. False Positive Prevention sections catch tests that "pass" without actually testing anything meaningful.

### CI Tier Classification

Tests are classified by execution time to enable fast feedback loops. T1 runs on every commit; T4 runs nightly or on PR merge.

```markdown
### CI Tier Summary

| Tier | Tests | Content | Estimated Time |
|------|-------|---------|---------------|
| T1 | 41 UT | Pure functions, validators, parsers | ~1.5 min |
| T2 | 22 IT | API endpoints, auth flows, DB state | ~7 min |
| T3 | 11 E2E | User story flows with real services | ~15 min |
| T4 | 4 VT | Visual regression screenshots | ~25 min |
```

**Tier rules:**
- **T1:** No I/O, no network, no DB. Pure computation only. Must complete in < 3 minutes.
- **T2:** May use test databases, mock servers, or local services. Must complete in < 10 minutes.
- **T3:** Full stack integration with real (or containerized) services. Must complete in < 20 minutes.
- **T4:** Visual regression, performance benchmarks, or cross-browser tests. Must complete in < 45 minutes.

### Gap Detection

After mapping all spec requirements to test IDs, run a gap detection pass. Every FR/NFR must trace to at least one test. Gaps are either filled with new tests or flagged for spec revision.

```markdown
### Gap Detection Results

| Spec Requirement | Status | Resolution |
|------------------|--------|------------|
| FR-3.2.4 Rate limiting per API key | **GAP** | Added IT-GATE-012 |
| FR-4.1.1 Webhook retry logic | **GAP** | Flagged for spec revision — retry policy undefined |
| All other FRs | Covered | — |
```

**Gap resolution rules:**
1. If the requirement is clear enough to test, add the missing test immediately and update the coverage matrix.
2. If the requirement is ambiguous or underspecified, flag it for spec revision — do NOT write a test against an assumption.
3. After all gaps are resolved, re-run the coverage matrix totals to confirm consistency.

---

## Key Takeaways from Examples

1. **Be Specific:** Every test has exact inputs and outputs
2. **Cover Layers:** Unit → Integration → E2E progression
3. **Match Tools:** CLI uses bash, API uses curl, Desktop uses Circuit
4. **Capture Evidence:** Logs, screenshots, exit codes documented
5. **Include Edge Cases:** Null, empty, boundary, invalid all tested
6. **Coverage Matrix:** Map every spec requirement to test IDs — zero silent gaps
7. **Step Tags:** Tag every test with step/subsystem/priority for downstream beads
8. **CI Tiers:** Classify tests by execution time for pipeline design
9. **4-Part Structure:** Every test has Setup → Execution → Assertions → Cleanup
