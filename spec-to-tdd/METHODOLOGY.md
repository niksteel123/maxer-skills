# Spec to TDD + Bootstrap - Methodology

This document provides the complete step-by-step process for creating both a TDD document and Bootstrap document from specification and architecture documents.

---

## Overview

The TDD + Bootstrap document creation process has 12 phases across 3 parts:

### Part A: Test Specification (TDD Document)

| Phase | Name | Focus | Output |
|-------|------|-------|--------|
| 1 | Study Spec | Requirements analysis | Requirements checklist |
| 2 | Study Architecture | Component mapping | Integration points |
| 3 | Design Unit Tests | Layer 1 specs | Unit test specifications |
| 4 | Design Integration Tests | Layer 2 specs | API/CLI test specifications |
| 5 | Design E2E Tests | Layer 3 specs | User story scenarios |
| 5A | Coverage Verification | Gap detection + metadata | Coverage matrix, step tags, CI tiers, test infra |

### Part B: Test Implementation (Bootstrap Document)

| Phase | Name | Focus | Output |
|-------|------|-------|--------|
| 6 | Identify Prerequisites | Environment needs | Prerequisites list |
| 7 | Design Validation Scripts | Prereq verification | Validation scripts |
| 8 | Design Harness/Fixtures | Test infrastructure | Harness & fixtures |
| 9 | Write Test Code | Actual implementations | Executable test code |

### Part C: Documentation

| Phase | Name | Focus | Output |
|-------|------|-------|--------|
| 10 | Write TDD Document | Test specs | `{date}-{feature}-tdd.md` |
| 11 | Write Bootstrap Document | Test implementations | `{date}-{feature}-bootstrap.md` |
| 12 | Handoff Prompt | Next skill guidance | Kickoff for strategy creation (SOT #3) |

---

## Part A: Test Specification

---

## Phase 1: Study Spec Document

**Duration:** Thorough - do not rush this phase

### 1.1 Read Spec Completely

Read the specification document from beginning to end. Do not skim.

### 1.2 Extract Functional Requirements

Create a checklist of all requirements:

```markdown
## Requirements Checklist

### Feature Area 1
- [ ] FR-1.1: [Requirement title]
  - Acceptance criteria: [...]
  - Testable behavior: [...]
- [ ] FR-1.2: [Requirement title]
  - Acceptance criteria: [...]
  - Testable behavior: [...]

### Feature Area 2
- [ ] FR-2.1: [Requirement title]
  ...
```

### 1.3 Map User Stories

Extract all user stories:

```markdown
## User Stories

| ID | As a... | I want... | So that... |
|----|---------|-----------|------------|
| US-1 | user | create workspace | organize my projects |
| US-2 | admin | manage users | control access |
```

### 1.4 Identify Testable Behaviors

For each requirement, identify:
- What input triggers this behavior?
- What output proves it works?
- What edge cases exist?
- What error conditions are possible?

### 1.5 Extract Success Criteria

Create a mapping of success criteria to subsystems:

```markdown
## Success Criteria Inventory

| Subsystem | Criterion ID | Description |
|-----------|--------------|-------------|
| L1.1 Mail | L1.1.1 | MessageSent events with per-recipient key wrapping |
| L1.1 Mail | L1.1.2 | MessageRead and MessageAcknowledged events |
| L1.2 Work | L1.2.1 | All WorkUnitTypes implemented |
```

---

## Phase 2: Study Architecture Document

**Duration:** Proportional to architecture complexity

### 2.1 Map Components

Identify all system components:
- Services
- Routes/endpoints
- Database tables
- CLI commands
- UI components

### 2.2 Identify API Endpoints

Create endpoint inventory:

```markdown
## API Endpoint Inventory

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | /api/workspace | Create workspace | Required |
| GET | /api/workspace/:id | Get workspace | Required |
| DELETE | /api/workspace/:id | Delete workspace | Admin |
```

### 2.3 Map CLI Commands

List all CLI commands:

```markdown
## CLI Command Inventory

| Command | Arguments | Description |
|---------|-----------|-------------|
| workspace:create | --name | Create new workspace |
| workspace:list | --json | List all workspaces |
```

### 2.4 Identify Integration Boundaries

Note where systems connect:
- API to database
- CLI to API
- UI to API
- External service integrations

### 2.5 Note Technology Stack

Document the tech stack for test tool selection:

```markdown
## Technology Stack

| Component | Technology | Version | Test Tool |
|-----------|------------|---------|-----------|
| Backend | Rust | 1.75+ | cargo test |
| Frontend | TypeScript | 5.0+ | vitest |
| Database | SQLite | 3.40+ | direct queries |
| CLI | Rust/clap | - | bash scripts |
```

---

## Phase 3: Design Unit Test Specifications

**Focus:** Layer 1 - Pure function tests

### 3.1 Map Requirements to Unit Tests

For each FR-X.Y, design unit tests:

```markdown
## Unit Test Specifications

### FR-1.1: Validate Workspace Name

| Test ID | Description | Input | Expected Output |
|---------|-------------|-------|-----------------|
| UT-FR-1.1.1 | Valid name accepted | "my-workspace" | true |
| UT-FR-1.1.2 | Empty name rejected | "" | Error: "Name required" |
| UT-FR-1.1.3 | Special chars rejected | "my@workspace" | Error: "Invalid chars" |
| UT-FR-1.1.4 | Max length enforced | "a".repeat(256) | Error: "Too long" |
```

### 3.2 Design Edge Case Tests

For each function, consider:
- Null/undefined inputs
- Empty arrays/objects
- Boundary values (0, -1, MAX_INT)
- Invalid types
- Unicode characters

### 3.3 Design Error Condition Tests

Document expected error behaviors:
- Error messages
- Error codes
- Stack trace handling
- Recovery behavior

---

## Phase 4: Design Integration Test Specifications

**Focus:** Layer 2 - API and CLI tests

### 4.1 API Test Specifications

For each endpoint:

```markdown
## API Test Specifications

### POST /api/workspace - Create Workspace

| Test ID | Scenario | Request | Expected Response |
|---------|----------|---------|-------------------|
| IT-API-1.1 | Success | { "name": "test" } | 201 + { "id": "...", "name": "test" } |
| IT-API-1.2 | Missing name | { } | 400 + { "error": "Name required" } |
| IT-API-1.3 | Unauthorized | (no auth header) | 401 + { "error": "Unauthorized" } |
| IT-API-1.4 | Duplicate name | { "name": "existing" } | 409 + { "error": "Already exists" } |
```

### 4.2 CLI Test Specifications

For each command:

```markdown
## CLI Test Specifications

### workspace:create Command

| Test ID | Args | Expected stdout | Exit Code |
|---------|------|-----------------|-----------|
| IT-CLI-1.1 | --name "test" | "Created workspace: test" | 0 |
| IT-CLI-1.2 | (no args) | "Error: Name required" | 1 |
| IT-CLI-1.3 | --name "" | "Error: Name cannot be empty" | 1 |
```

### 4.3 Database State Verification

Define expected database changes:

```markdown
## Database State Tests

| Test ID | Action | Before State | After State |
|---------|--------|--------------|-------------|
| IT-DB-1.1 | Create workspace | 0 workspaces | 1 workspace with name "test" |
| IT-DB-1.2 | Delete workspace | 1 workspace | 0 workspaces |
```

### 4.4 Auth Flow Tests

Document authentication scenarios:

```markdown
## Auth Flow Tests

| Test ID | Scenario | Credentials | Expected Result |
|---------|----------|-------------|-----------------|
| IT-AUTH-1 | Valid token | Bearer <valid> | 200 OK |
| IT-AUTH-2 | Expired token | Bearer <expired> | 401 Unauthorized |
| IT-AUTH-3 | Missing token | (none) | 401 Unauthorized |
| IT-AUTH-4 | Admin action | Bearer <user> | 403 Forbidden |
```

---

## Phase 5: Design E2E Test Specifications

**Focus:** Layer 3 - User story scenarios with tool selection

### 5.1 Select Testing Tools

Based on application type:

| Application | Tool | Why |
|-------------|------|-----|
| Web Browser UI | Playwright MCP | Headless browser automation |
| Electron Desktop | Circuit Electron MCP | Native app testing |
| CLI/Terminal | Bash scripts | Direct command execution |
| REST API | curl + jq | HTTP request testing |
| Rust Backend | cargo test | Native test runner |

### 5.2 Design User Story Scenarios

For each US-X, create step-by-step scenario:

```markdown
## E2E Scenario: US-1 - User Creates Workspace

**Tool:** Circuit Electron MCP (Electron app)

### Setup
- Launch application
- Login as test user
- Navigate to workspaces page

### Steps

| Step | Action | Verification | Screenshot |
|------|--------|--------------|------------|
| 1 | Click "New Workspace" button | Modal appears | 01-modal-open.png |
| 2 | Type "My Test Workspace" in name field | Input shows text | 02-name-entered.png |
| 3 | Click "Create" button | Modal closes, workspace appears in list | 03-workspace-created.png |
| 4 | Click on new workspace | Workspace detail view opens | 04-workspace-detail.png |

### Teardown
- Delete test workspace
- Logout
```

### 5.3 Define Evidence Requirements

For each scenario, specify:

```markdown
### Evidence Requirements

| Evidence Type | Location | Format |
|---------------|----------|--------|
| Screenshots | test-screenshots/US-1/ | PNG |
| Console logs | test-logs/US-1-console.log | JSON |
| Network requests | test-logs/US-1-network.log | HAR |
| Database snapshot | test-data/US-1-db.json | JSON |
```

### 5.4 Tool-Specific Test Details

**For Playwright MCP (Web):**
```markdown
### Playwright Test Details

- Browser: Chromium (headless)
- Viewport: 1280x720
- Timeout: 30s per step
- Selectors: data-testid preferred
```

**For Circuit Electron MCP (Desktop):**
```markdown
### Circuit Electron Test Details

- App path: /path/to/electron/app
- Launch args: --no-sandbox
- Window timeout: 60s
- Screenshot compression: JPEG 50%
```

**For Bash (CLI):**
```markdown
### Bash Test Details

- Shell: bash
- Timeout: 30s per command
- Capture: stdout, stderr, exit code
- Environment: isolated test env
```

---

## Phase 5A: Coverage Verification & Test Metadata

**Focus:** Build coverage matrix, detect gaps, add step tags, CI tiers, and define test infrastructure

> **CRITICAL:** This phase is the bridge between test design and test implementation.
> It ensures 100% spec coverage and adds the metadata that downstream consumers need.

### 5A.1 Build Coverage Matrix

After designing all tests (Phases 3-5), construct a complete spec-requirement → test-ID mapping:

```markdown
## Coverage Matrix

| Spec Requirement | Test ID(s) | Test Type | Status |
|------------------|-----------|-----------|--------|
| FR-2.1.1 | UT-REG-001, IT-REG-005 | UT + IT | Covered |
| FR-2.1.2 | UT-REG-002 | UT | Covered |
| FR-2.2.1 | — | — | **GAP** |
| US-1 | E2E-US-001 | E2E | Covered |
| SC-3.1 | UT-SC-003, IT-SC-007 | UT + IT | Covered |
```

**Rules:**
- **Count verification:** The matrix MUST have exactly N rows, where N equals the total number of spec requirements extracted in Phase 1. If the row count doesn't match, you've missed requirements — go back and find them before proceeding.
- Every spec requirement (FR-X.Y, US-X, SC-X.Y, success criteria) must appear in at least one row
- Use "GAP" status for any requirement with zero mapped tests
- Cross-reference against the requirements checklist from Phase 1

### 5A.2 Gap Detection

After building the coverage matrix:

1. **Count rows with GAP status** — these are spec requirements without tests
2. For each gap, determine:
   - **(a) Missing test** — write the test (go back to Phase 3/4/5 and add it)
   - **(b) Untestable requirement** — flag for spec revision: "Requirement FR-X.Y cannot be tested because [reason]. Recommend spec change: [suggestion]"
3. **Iterate until zero gaps** — the coverage matrix must show 100% "Covered" or explicit "Flagged for spec revision"
4. **Never silently skip a gap** — if it's in the spec, it ships. If it shouldn't ship, remove it from the spec first.

### 5A.3 Step/Phase Tagging

If the spec defines implementation steps, build phases, or deployment stages, tag every test:

```markdown
**step: 1 | subsystem: D-L2.5.3 | priority: P0**
```

Tags to apply:
- `step: N` — Build step or implementation phase (mandatory if spec has steps)
- `subsystem: {ID}` — Primary deliverable or subsystem being tested
- `priority: P0|P1|P2` — MVP priority (P0 = must-have, P1 = should-have, P2 = nice-to-have)

Add a summary table showing test count per step:

```markdown
### Step Distribution
| Step | UT | IT | E2E | Total |
|------|----|----|-----|-------|
| 1    | 87 | 45 | 22  | 154   |
| 2    | 8  | 4  | 12  | 24    |
| 3    | 55 | 30 | 18  | 103   |
```

### 5A.4 CI Tier Classification

Classify each test by expected execution time:

| Tier | Time Budget | Typical Content |
|------|-------------|-----------------|
| **T1** | <3 min | Unit tests, type checks, lint |
| **T2** | <10 min | Integration tests, API tests |
| **T3** | <20 min | E2E tests, multi-service integration |
| **T4** | <45 min | Chaos tests, performance benchmarks, full E2E suites |

Include tier annotation in test specs or as a summary table:

```markdown
### CI Tier Summary
| Tier | Tests | Estimated Time |
|------|-------|---------------|
| T1   | 145   | ~2 min        |
| T2   | 85    | ~8 min        |
| T3   | 42    | ~15 min       |
| T4   | 12    | ~30 min       |
```

### 5A.5 Define Test Infrastructure

List all shared test infrastructure that individual tests reference. This section goes in the TDD document (not just the bootstrap):

```markdown
## Test Infrastructure

| Tool | Purpose | Used By |
|------|---------|---------|
| **MockSwarmd** | WebSocket mock with CBOR support | All UT/IT |
| **MSW handlers** | REST API mocking | IT tests |
| **SwarmLab** | Multi-node deterministic simulation | CH/E2E tests |
| **TestHarness** | Service initialization + cleanup | All tests |
| **Fixtures** | Pre-built test data | UT/IT |
```

For each infrastructure component, briefly describe:
- What it provides
- What invariants it enforces (mocks must enforce real protocol constraints)
- Which test types use it

---

## Part A Completion Gate

> **STOP.** Before proceeding to Part B, verify all Part A outputs:

- [ ] Coverage matrix has exactly N rows matching the Phase 1 requirement count
- [ ] Zero unaddressed GAP rows (all resolved as "Covered" or "Flagged for spec revision")
- [ ] Every test has 4-part structure (Setup → Execution → Assertions → Cleanup)
- [ ] Step/phase tags applied to all tests (if spec has steps)
- [ ] CI tier assigned to all tests
- [ ] Test infrastructure tools listed

**If any item fails, go back and fix it before Part B.** Part B implements what Part A specifies — gaps here become missing tests downstream.

> **Conflict resolution:** If the spec contradicts existing tests in the codebase, the spec wins. Existing tests are updated or replaced to match. Flag the conflict in the coverage matrix notes column so downstream auditors know the change was intentional.

---

## Part B: Test Implementation

---

## Phase 6: Identify Test Prerequisites

**Focus:** What environment/dependencies do these tests need to run?

### 6.1 Analyze Each Test Layer

For each test layer, identify ALL dependencies:

```markdown
## Layer Prerequisites Analysis

### Layer 1 (Unit Tests)
- Language runtime: Rust 1.75+
- Build tools: cargo
- No external dependencies

### Layer 2 (Integration Tests)
- Everything from Layer 1
- Database: SQLite 3.40+
- Server must be running
- Test database must exist

### Layer 3 (E2E Tests)
- Everything from Layer 1 + 2
- External API access: ANTHROPIC_API_KEY
- MCP servers: mcp-filesystem, mcp-git
- System tools: jq, curl
```

### 6.2 Document Environment Variables

List all required environment variables:

```markdown
## Required Environment Variables

| Variable | Purpose | Example | Required |
|----------|---------|---------|----------|
| ANTHROPIC_API_KEY | Claude API access | sk-ant-... | Yes (L2+) |
| DATABASE_URL | Test database path | sqlite://test.db | Yes (L2+) |
| TEST_WORKSPACE | Test workspace path | /tmp/test-ws | Yes (E2E) |
```

### 6.3 Document System Dependencies

List all system-level requirements:

```markdown
## System Dependencies

| Dependency | Version | Check Command | Install Command |
|------------|---------|---------------|-----------------|
| Rust | 1.75+ | rustc --version | rustup install stable |
| SQLite | 3.40+ | sqlite3 --version | brew install sqlite |
| jq | 1.6+ | jq --version | brew install jq |
| curl | 7.0+ | curl --version | (usually pre-installed) |
```

### 6.4 Document Prior Layer Dependencies

Specify what must exist from prior layers:

```markdown
## Prior Layer Dependencies

| Layer | Depends On | Required Artifacts |
|-------|------------|-------------------|
| L1 | L0 | L0 Event Store passing all tests |
| L2 | L1 | L1 Services operational |
| L2.5 | L2 | L2 Mesh operational |
```

### 6.5 Document Artifact Dependencies

List artifacts that must exist before tests run:

```markdown
## Required Artifacts

### Execution Profiles
- [ ] `.agent-swarm/profiles/minimal.PROFILE.md`
- [ ] `.agent-swarm/profiles/dev-local.PROFILE.md`

### Tool Bundles
- [ ] `.agent-swarm/bundles/core/read-tools.BUNDLE.md`
- [ ] `.agent-swarm/bundles/core/write-tools.BUNDLE.md`

### Test Fixtures
- [ ] `tests/fixtures/mail/` - Mail test data
- [ ] `tests/fixtures/work/` - WorkUnit test data
```

---

## Phase 7: Design Validation Scripts

**Focus:** Executable scripts to verify prerequisites

### 7.1 Create Main Validation Script

Design a master validation script:

```bash
#!/bin/bash
# validate-prerequisites.sh
# Validates all prerequisites for running tests

set -e
TEST_ID="PREREQ-$(date +%s)"
echo "[TEST_START] $TEST_ID: Prerequisites Validation"

ERRORS=0

# Function to check requirement
check() {
  local name="$1"
  local check_cmd="$2"
  local install_hint="$3"

  if eval "$check_cmd" > /dev/null 2>&1; then
    echo "[PASS] $name"
  else
    echo "[FAIL] $name"
    echo "  Fix: $install_hint"
    ERRORS=$((ERRORS + 1))
  fi
}

# Function for warnings (non-fatal)
warn_check() {
  local name="$1"
  local check_cmd="$2"

  if eval "$check_cmd" > /dev/null 2>&1; then
    echo "[PASS] $name"
  else
    echo "[WARN] $name (optional, some tests may skip)"
  fi
}

# Check each prerequisite
# ... (specific checks)

# Summary
if [ $ERRORS -eq 0 ]; then
  echo "[TEST_END] $TEST_ID: PASS"
  exit 0
else
  echo "[TEST_END] $TEST_ID: FAIL ($ERRORS errors)"
  exit 1
fi
```

### 7.2 Design Per-Prerequisite Checks

Create specific checks for each requirement:

```bash
# Rust toolchain
check "Rust toolchain" \
  "rustc --version | grep -E '1\.(7[5-9]|[8-9][0-9])'" \
  "rustup install stable"

# Cargo
check "Cargo" \
  "cargo --version" \
  "Installed with rustup"

# SQLite
check "SQLite 3.40+" \
  "sqlite3 --version | grep -E '3\.(4[0-9]|[5-9][0-9])'" \
  "brew install sqlite / apt install sqlite3"

# jq
check "jq" \
  "jq --version" \
  "brew install jq / apt install jq"

# Environment variables
check "ANTHROPIC_API_KEY set" \
  "[ -n \"$ANTHROPIC_API_KEY\" ]" \
  "export ANTHROPIC_API_KEY=sk-ant-..."

# API connectivity
check "Claude API accessible" \
  "curl -sf --max-time 10 -H \"x-api-key: $ANTHROPIC_API_KEY\" \
   -H \"anthropic-version: 2023-06-01\" \
   -H \"content-type: application/json\" \
   https://api.anthropic.com/v1/messages \
   -d '{\"model\":\"claude-3-haiku-20240307\",\"max_tokens\":1,\"messages\":[{\"role\":\"user\",\"content\":\"hi\"}]}'" \
  "Check API key is valid"
```

### 7.3 Design Prior Layer Validation

Validate that prior layer tests pass:

```bash
# Prior layer validation
echo "Checking prior layer: L0..."
if [ -f ".test-results/l0-pass" ]; then
  echo "[PASS] L0 tests previously passed"
else
  echo "[WARN] L0 tests not verified - running now..."
  cargo test --package l0-kernel -- --test-threads=1
  if [ $? -eq 0 ]; then
    touch .test-results/l0-pass
    echo "[PASS] L0 tests pass"
  else
    echo "[FAIL] L0 tests must pass before L1"
    exit 1
  fi
fi
```

### 7.4 Design Artifact Validation

Verify required artifacts exist:

```bash
# Artifact validation
check_artifact() {
  local path="$1"
  if [ -f "$path" ] || [ -d "$path" ]; then
    echo "[PASS] Artifact: $path"
  else
    echo "[FAIL] Missing artifact: $path"
    ERRORS=$((ERRORS + 1))
  fi
}

# Check required artifacts
check_artifact ".agent-swarm/profiles/minimal.PROFILE.md"
check_artifact ".agent-swarm/profiles/dev-local.PROFILE.md"
check_artifact ".agent-swarm/bundles/core/read-tools.BUNDLE.md"
check_artifact "tests/fixtures/mail/"
```

---

## Phase 8: Design Test Harness & Fixtures

**Focus:** Test infrastructure and data

### 8.1 Design Test Harness

Create a reusable test harness:

```rust
/// Test harness for L1 tests
pub struct TestHarness {
    pub event_store: Arc<EventStore>,
    pub cas: Arc<CASStore>,
    pub mail_service: Arc<MailService>,
    pub work_service: Arc<WorkService>,
    pub session_service: Arc<SessionService>,
    pub mcp_gateway: Option<Arc<MCPGateway>>,
    _temp_dir: TempDir,
}

impl TestHarness {
    /// Create new test harness with fresh database
    pub async fn new() -> Self {
        let temp_dir = TempDir::new().unwrap();
        let db_path = temp_dir.path().join("test.db");

        // Initialize services
        let event_store = Arc::new(EventStore::new(&db_path).await.unwrap());
        let cas = Arc::new(CASStore::new(&db_path).await.unwrap());

        // ... initialize other services

        Self {
            event_store,
            cas,
            mail_service: Arc::new(MailService::new(/* ... */)),
            work_service: Arc::new(WorkService::new(/* ... */)),
            session_service: Arc::new(SessionService::new(/* ... */)),
            mcp_gateway: None,
            _temp_dir: temp_dir,
        }
    }

    /// Create harness with MCP gateway for tool tests
    pub async fn with_mcp_gateway() -> Self {
        let mut harness = Self::new().await;
        harness.mcp_gateway = Some(Arc::new(MCPGateway::new(/* ... */).await));
        harness
    }

    /// Create a test agent
    pub async fn create_agent(&self, name: &str) -> TestAgent {
        // ... implementation
    }

    /// Create a test agent in a team
    pub async fn create_agent_in_team(&self, name: &str, team: &str) -> TestAgent {
        // ... implementation
    }

    /// Create a running session for testing
    pub async fn create_running_session(&self) -> Session {
        // ... implementation
    }
}
```

### 8.2 Design Fixture Data

Create fixture data structures:

```markdown
## Test Fixtures

### Mail Fixtures (`tests/fixtures/mail/`)

```json
// test-messages.json
{
  "messages": [
    {
      "id": "msg_test_001",
      "from": "alice",
      "to": ["bob"],
      "subject": "Test message",
      "body": "Hello from test"
    }
  ]
}
```

### Work Fixtures (`tests/fixtures/work/`)

```json
// test-work-units.json
{
  "work_units": [
    {
      "id": "work_test_001",
      "type": "Task",
      "title": "Test task",
      "state": "Ready"
    }
  ]
}
```
```

### 8.3 Design Artifact Templates

Create templates for required artifacts:

```markdown
### Execution Profile Template

```yaml
# .agent-swarm/profiles/test-minimal.PROFILE.md
---
profile_id: test-minimal
name: Test Minimal Profile
version: "1.0.0"
trust_tier: T0
classification_clearance: [C0_Public]

provides:
  network:
    internet_egress: false
    inbound_allowed: false
  filesystem:
    workspace_write: true
    scratch_space_bytes: 1073741824
  compute:
    memory_bytes: 2147483648
    cpu_cores: 2
  services: []
  capabilities:
    - file-read
    - file-write
  auth:
    agent_accounts: []
---
# Test Minimal Profile

Bare minimum execution environment for unit tests.
```
```

### 8.4 Design Setup/Teardown Procedures

Document setup and teardown:

```rust
/// Per-test setup
async fn setup_test(harness: &TestHarness, test_name: &str) -> TestContext {
    let test_id = format!("{}-{}", test_name, Ulid::new());
    tracing::info!("[TEST_START] {}", test_id);

    TestContext {
        test_id,
        start_time: Instant::now(),
    }
}

/// Per-test teardown
async fn teardown_test(ctx: TestContext, result: Result<(), TestError>) {
    let duration = ctx.start_time.elapsed();

    match result {
        Ok(()) => {
            tracing::info!("[TEST_END] {}: PASS ({:?})", ctx.test_id, duration);
        }
        Err(e) => {
            tracing::error!("[TEST_END] {}: FAIL - {}", ctx.test_id, e);
        }
    }
}
```

---

## Phase 9: Write Actual Test Implementations

**Focus:** REAL, EXECUTABLE test code

### 9.1 Structured Logging Requirements

All tests MUST use structured logging:

```
[TEST_START] <test_id>: <description>
[SETUP] <setup action>
[ACTION] <action description>
[ASSERT] <assertion description>
[PERF] <metric>: <value>
[STATE_DUMP] <key>: <value>
[WARN] <warning message>
[TEST_END] <test_id>: PASS|FAIL
```

### 9.2 Write Unit Test Implementations

```rust
#[tokio::test]
async fn test_validate_workspace_name_valid() {
    let test_id = format!("UT-FR-1.1.1-{}", Ulid::new());
    tracing::info!("[TEST_START] {}: Valid workspace name accepted", test_id);

    // ACTION
    let result = validate_workspace_name("my-workspace");
    tracing::info!("[ACTION] validate_workspace_name(\"my-workspace\")");

    // ASSERT
    assert!(result.is_ok(), "Valid name should be accepted");
    tracing::info!("[ASSERT] Valid name accepted");

    tracing::info!("[TEST_END] {}: PASS", test_id);
}

#[tokio::test]
async fn test_validate_workspace_name_empty_rejected() {
    let test_id = format!("UT-FR-1.1.2-{}", Ulid::new());
    tracing::info!("[TEST_START] {}: Empty workspace name rejected", test_id);

    // ACTION
    let result = validate_workspace_name("");
    tracing::info!("[ACTION] validate_workspace_name(\"\")");

    // ASSERT
    assert!(result.is_err(), "Empty name should be rejected");
    assert_eq!(
        result.unwrap_err().message,
        "Name required",
        "Error message should match"
    );
    tracing::info!("[ASSERT] Empty name rejected with correct error");

    tracing::info!("[TEST_END] {}: PASS", test_id);
}
```

### 9.3 Write Integration Test Implementations

```rust
#[tokio::test]
async fn test_mail_message_sent_per_recipient_keys() {
    let test_id = format!("IT-MAIL-1.1-{}", Ulid::new());
    tracing::info!("[TEST_START] {}: MessageSent per-recipient keys", test_id);

    // SETUP
    let harness = TestHarness::new().await;
    let alice = harness.create_agent("alice").await;
    let bob = harness.create_agent("bob").await;
    let carol = harness.create_agent("carol").await;
    tracing::info!("[SETUP] Created test agents: alice, bob, carol");

    // ACTION
    let result = harness.mail_service.send_message(SendRequest {
        from: alice.id.clone(),
        to: vec![bob.id.clone(), carol.id.clone()],
        subject: "Test multi-recipient".into(),
        body: "Hello to both".into(),
        ..Default::default()
    }).await.unwrap();
    tracing::info!("[ACTION] Sent message from alice to bob, carol");

    // VERIFY
    let bob_inbox = harness.event_store.query_scope(
        &format!("mailbox/inbox/{}", bob.id)
    ).await;
    let carol_inbox = harness.event_store.query_scope(
        &format!("mailbox/inbox/{}", carol.id)
    ).await;

    assert_eq!(bob_inbox.len(), 1, "Bob should have 1 message");
    tracing::info!("[ASSERT] Bob has 1 message in inbox");

    assert_eq!(carol_inbox.len(), 1, "Carol should have 1 message");
    tracing::info!("[ASSERT] Carol has 1 message in inbox");

    // Verify different CAS refs (per-recipient key wrapping)
    let bob_event: MailMessageSentPayload = bob_inbox[0].payload.deserialize().unwrap();
    let carol_event: MailMessageSentPayload = carol_inbox[0].payload.deserialize().unwrap();

    assert_eq!(
        result.message_content_id,
        compute_message_content_id(&bob_event.message),
        "Content ID should match"
    );
    tracing::info!("[ASSERT] Content IDs match");

    tracing::info!("[TEST_END] {}: PASS", test_id);
}
```

### 9.4 Write E2E Test Implementations

```bash
#!/bin/bash
# test_e2e_external_api_gateway.sh

set -e
TEST_ID="E2E-L1.15-$(date +%s)"
echo "[TEST_START] $TEST_ID: External API Gateway E2E"

GATEWAY_URL="http://localhost:8080"
API_KEY="${TEST_API_KEY:-swarm_test_k123_sk_test_abc123}"
WORKSPACE_ID="ws_test_001"
LOG_FILE="/tmp/test-gateway-${TEST_ID}.log"

# [L1.15.12] Health endpoints
echo "[ACTION] Testing health endpoints"
curl -sf "$GATEWAY_URL/healthz" > /dev/null
echo "[ASSERT] /healthz returns 200"

curl -sf "$GATEWAY_URL/readyz" > /dev/null
echo "[ASSERT] /readyz returns 200"

curl -sf "$GATEWAY_URL/metrics" | grep -q "http_requests_total"
echo "[ASSERT] /metrics returns prometheus data"

# [L1.15.7] Token exchange
echo "[ACTION] Testing token exchange"
TOKEN_RESPONSE=$(curl -sf "$GATEWAY_URL/v1/auth/token" \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"workspace_id\": \"$WORKSPACE_ID\", \"requested_actions\": [\"STRATEGY_RUN\"], \"ttl_seconds\": 900}")

BISCUIT_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')
[ -n "$BISCUIT_TOKEN" ] && [ "$BISCUIT_TOKEN" != "null" ]
echo "[ASSERT] Token exchange returns biscuit token"

# [L1.15.6] Token validation
echo "[ACTION] Testing token validation"
curl -sf "$GATEWAY_URL/v1/workspaces/$WORKSPACE_ID/strategies" \
  -H "Authorization: Bearer $BISCUIT_TOKEN" > /dev/null
echo "[ASSERT] Valid token accepted"

# Invalid token should fail
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
  "$GATEWAY_URL/v1/workspaces/$WORKSPACE_ID/strategies" \
  -H "Authorization: Bearer invalid_token")
[ "$HTTP_CODE" = "401" ]
echo "[ASSERT] Invalid token rejected with 401"

echo "[STATE_DUMP] Log file: $LOG_FILE"
echo "[TEST_END] $TEST_ID: PASS"
```

### 9.5 False Positive Prevention

Document how each test prevents false positives:

```markdown
## False Positive Prevention

| Test | False Positive Risk | Mitigation |
|------|---------------------|------------|
| Mail send | Empty recipient list passes | Verify event count matches recipient count |
| OCC version | Stale version silently succeeds | Assert version increments |
| Lease claim | Race condition misses conflict | Use deterministic test ordering |
| Session state | Async state not updated | Poll with timeout, verify event |
| FTS5 search | Index lag | Add small delay after write |
| Rate limiting | Test runs below threshold | Parameterize threshold for testing |
| SSRF prevention | Regex miss | Test multiple internal IP patterns |
```

---

## Part C: Documentation

---

## Phase 10: Write TDD Document

**Output:** `thoughts/shared/tdd/{date}-{feature}-tdd.md`

### 10.1 Use Template Structure

See **TEMPLATES.md** for the complete TDD document template.

### 10.2 Include All Layers

Ensure document covers:
- [ ] Layer 1: All unit test specifications
- [ ] Layer 2: All integration test specifications
- [ ] Layer 3: All E2E test specifications

### 10.2a Include Coverage Matrix (from Phase 5A)

Place the coverage matrix near the top of the TDD document, after the executive summary. This is the first thing downstream consumers check.

### 10.2b Include Test Infrastructure (from Phase 5A)

Place the test infrastructure table after the coverage matrix. Individual tests reference these tools by name.

### 10.2c Include Step Distribution and CI Tier Summary

Add the step distribution and CI tier summary tables.

### 10.3 Define QA Gate Criteria

Specify pass/fail criteria:

```markdown
## QA Gate Criteria

| Gate | Requirement |
|------|-------------|
| Unit Tests | 100% Layer 1 tests pass |
| Integration Tests | 100% Layer 2 tests pass |
| E2E Tests | 100% Layer 3 tests pass |
| Evidence | All screenshots/logs captured |
| Eye Test | Real user would accept this |
```

### 10.4 Include Anti-Pattern Checklist

Add enforcement section:

```markdown
## Anti-Pattern Checklist

Tests MUST NOT contain:
- [ ] TODO placeholders
- [ ] .skip / xit / xtest markers
- [ ] Empty test bodies
- [ ] Mock-heavy tests (>3 mocks)
- [ ] Existence-only assertions
```

---

## Phase 11: Write Bootstrap Document

**Output:** `thoughts/shared/bootstrap/{date}-{feature}-bootstrap.md`

### 11.1 Document Structure

The Bootstrap document MUST include:

1. **Overview** - Layer, complexity, dependencies
2. **Success Criteria Coverage Summary** - Mapping of all criteria to tests
3. **Environment Prerequisites** - What's needed to run tests
4. **Validation Script** - Complete executable script
5. **Test Scenarios by Subsystem** - Actual test implementations
6. **False Positive Prevention** - How tests avoid false passes
7. **Structured Logging Requirements** - Logging format
8. **Artifact Templates** - Profile/bundle templates
9. **Artifact Checklist** - What must exist
10. **Success Criteria Mapping** - Criterion → test function table
11. **Handoff to Next Layer** - What next layer needs

### 11.2 Include Complete Validation Script

The validation script must be FULLY EXECUTABLE:

```bash
#!/bin/bash
# validate-{layer}-prerequisites.sh

set -e
TEST_ID="{LAYER}-PREREQ-$(date +%s)"
echo "[TEST_START] $TEST_ID: {Layer} Prerequisites Validation"

ERRORS=0

# ... all checks ...

if [ $ERRORS -eq 0 ]; then
  echo "[TEST_END] $TEST_ID: PASS"
  exit 0
else
  echo "[TEST_END] $TEST_ID: FAIL ($ERRORS errors)"
  exit 1
fi
```

### 11.3 Include All Test Implementations

Include COMPLETE, RUNNABLE test code for every test specified in TDD:

```rust
// Full test with all assertions
#[tokio::test]
async fn test_work_state_transitions_occ() {
    let test_id = format!("L1.2.2-{}", Ulid::new());
    tracing::info!("[TEST_START] {}: WorkState transitions OCC", test_id);

    let harness = TestHarness::new().await;

    let work = harness.work_service.create(CreateWorkRequest {
        work_type: WorkType::Task,
        title: "OCC test task".into(),
        ..Default::default()
    }).await.unwrap();

    assert_eq!(work.state, WorkState::Draft);
    let v1 = work.version;
    tracing::info!("[ASSERT] Initial state is Draft");

    // ... complete test implementation ...

    tracing::info!("[TEST_END] {}: PASS", test_id);
}
```

### 11.4 Include Artifact Checklist

Complete checklist of required artifacts:

```markdown
## Artifact Checklist

Before {Layer} implementation begins:

### Environment
- [ ] `ANTHROPIC_API_KEY` is set and valid
- [ ] Claude API is accessible (run validation script)
- [ ] jq is installed

### Execution Profiles
- [ ] `.agent-swarm/profiles/minimal.PROFILE.md` exists
- [ ] `.agent-swarm/profiles/dev-local.PROFILE.md` exists

### Tool Bundles
- [ ] `.agent-swarm/bundles/core/read-tools.BUNDLE.md` exists
- [ ] `.agent-swarm/bundles/core/write-tools.BUNDLE.md` exists

### Test Fixtures
- [ ] `tests/fixtures/{layer}/` - Test fixtures exist
```

---

## Phase 12: Generate Handoff Prompt (3-SOT Model)

### 12.1 Create Kickoff for Strategy Document (SOT #3)

In the 3-SOT model, the next step after TDD is creating a lightweight implementation strategy — NOT a full plan document.

```markdown
Create a lightweight **implementation strategy** document (SOT #3).

- Spec: `{spec_path}` (SOT #1 — SOURCE OF TRUTH)
- TDD: `{tdd_path}` (SOT #2 — TEST SPECIFICATIONS)
- Bootstrap: `{bootstrap_path}` (TEST IMPLEMENTATIONS)

The strategy is a ROUTING TABLE (~500-800 lines), not a content document:
- Phase ordering and dependencies (what blocks what)
- Domain batches (which subsystems ship together)
- Gate criteria (which TDD test IDs must pass at each gate)
- Parallel execution guidance (which phases can overlap)
- CI tier assignment per gate (T1/T2/T3/T4)

All implementation content lives in spec + TDD. Strategy only provides ordering.
Output: `{feature}-strategy.md`
```

### 12.2 Document All File Paths

List all generated/referenced files:

```markdown
## Document Paths (3-SOT)

- Spec (SOT #1): {spec_path}
- TDD (SOT #2): {tdd_path}
- Bootstrap: {bootstrap_path}
- Strategy (SOT #3): [to be created next]
```

### 12.3 Downstream Consumer Reminder

Include a note in the handoff about how the TDD will be consumed:

```markdown
## TDD Downstream Consumers

This TDD document will be consumed by:
1. **Strategy creation** — uses test IDs for gate criteria
2. **Beads-from-sources** — embeds test IDs + assertions in each bead
3. **Bead-plan-audit** — verifies every test ID maps to a bead
4. **Bead-completion-audit** — compares TDD assertions against actual test code

Test IDs are unique, stable, greppable. Assertions are concrete.
```

---

## Quality Checklist

Before completing, verify:

### TDD Document — Core
- [ ] All FR-X.Y requirements have unit test specs
- [ ] All API endpoints have integration test specs
- [ ] All CLI commands have integration test specs
- [ ] All US-X user stories have E2E scenarios
- [ ] Tool selection matches application type
- [ ] Evidence requirements are specific
- [ ] QA gate criteria are defined
- [ ] Anti-pattern checklist is included

### TDD Document — 3-SOT Alignment (NEW)
- [ ] **Coverage matrix** maps every spec requirement to test IDs
- [ ] **Gap detection** complete — zero unaddressed gaps
- [ ] **Step/phase tags** on every test (if spec has steps)
- [ ] **CI tier classification** (T1/T2/T3/T4) for all tests
- [ ] **Test infrastructure** section defines shared mocks/harnesses
- [ ] **Every test** has 4-part structure: Setup → Execution → Assertions → Cleanup
- [ ] **No vague assertions** — no `assert(true)`, no "verify correct behavior"
- [ ] **Downstream consumer context** section included
- [ ] Test IDs are unique, stable, greppable (no spaces/special chars)

### Bootstrap Document
- [ ] All prerequisites are documented
- [ ] Validation script is complete and executable (real commands, not prose)
- [ ] All tests have actual implementations (not specs!)
- [ ] Structured logging is used consistently
- [ ] False positive prevention is documented
- [ ] Artifact templates are included
- [ ] Artifact checklist is complete
- [ ] Success criteria mapping covers 100%
- [ ] Test harness design is included
- [ ] Every test follows 4-part structure with concrete assertions

### Handoff (3-SOT)
- [ ] Handoff prompt targets strategy document creation (SOT #3)
- [ ] All 3 SOT document paths listed
- [ ] Downstream consumer reminder included

---

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| Skipping requirements | Read spec completely, extract ALL FR-X.Y |
| Vague test descriptions | Be specific: exact inputs, exact outputs |
| Missing edge cases | Consider null, empty, boundary, invalid |
| Wrong tool selection | Match tool to application medium |
| No evidence requirements | Specify screenshots, logs for each E2E |
| Skipping auth tests | Always test auth flows separately |
| **Bootstrap: specs not code** | Bootstrap contains ACTUAL test code, not specs |
| **Missing validation script** | MUST have executable validation script |
| **No structured logging** | All tests MUST use [TEST_START]/[TEST_END] |
| **No false positive prevention** | Document how each test avoids false passes |
| **Missing prior layer check** | Validate prior layer passes before this one |
