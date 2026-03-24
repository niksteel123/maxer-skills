# Spec to TDD + Bootstrap - Templates

This document provides ready-to-use templates for TDD documents and Bootstrap documents.

---

## Complete TDD Document Template

```markdown
# {Feature Name} - Test-Driven Development Plan

> **Document Type:** TDD Specification
> **Created:** {YYYY-MM-DD}
> **Source Spec:** `{path to spec document}`
> **Source Architecture:** `{path to architecture document}`

---

## 1. Test Philosophy

This document defines test specifications that MUST be implemented BEFORE feature code.

### Core Principles
- No stubs, no fake tests, no mocks (except external services)
- Tests define behavior BEFORE implementation
- All tests must be runnable and automatable
- Evidence-based: screenshots, logs, network captures

### TDD Workflow
1. Agent reads this spec, writes test files → Run → All MUST fail
2. COMMIT: Test suite committed BEFORE any implementation
3. Agent implements feature code incrementally
4. Tests turn green progressively (no test modification!)
5. Capture evidence as specified

---

## 1A. Coverage Matrix

> Maps every spec requirement to test IDs for mechanical gap detection.

| Spec Requirement | Test ID(s) | Test Type | Status |
|------------------|-----------|-----------|--------|
| FR-{X.Y} | {Test IDs} | {UT/IT/E2E} | Covered |
| US-{N} | {Test IDs} | {E2E} | Covered |
| SC-{X.Y} | {Test IDs} | {UT/IT} | Covered |
| **TOTAL** | **{N} tests** | | **{N}/{M} = {%}** |

> **Gaps:** Any requirement with no test IDs is flagged here with resolution status.

---

## 1B. Test Infrastructure

| Tool | Purpose | Used By |
|------|---------|---------|
| {MockService} | {What it provides} | {UT/IT/E2E} |
| {TestHarness} | {Service setup + cleanup} | {All} |
| {Fixtures} | {Pre-built test data} | {UT/IT} |

---

## 1C. CI Tier Classification

| Tier | Time Budget | Tests | Estimated Time |
|------|-------------|-------|---------------|
| T1 | <3 min | {N} | ~{X} min |
| T2 | <10 min | {N} | ~{X} min |
| T3 | <20 min | {N} | ~{X} min |
| T4 | <45 min | {N} | ~{X} min |

---

## 2. Layer 1: Unit Test Specifications

### 2.1 {Feature Area 1}

#### FR-{X.Y}: {Requirement Title}
**step: {N} | subsystem: {ID} | priority: P{N}**

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-FR-{X.Y}.1 | {Test description} | {Input value} | {Expected output} | {Edge cases to test} |
| UT-FR-{X.Y}.2 | {Test description} | {Input value} | {Expected output} | {Edge cases to test} |

**Failure Conditions:**
- {What should happen on invalid input}
- {What errors should be thrown}
- {How errors should propagate}

### 2.2 {Feature Area 2}

#### FR-{X.Y}: {Requirement Title}
**step: {N} | subsystem: {ID} | priority: P{N}**

| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-FR-{X.Y}.1 | {Test description} | {Input value} | {Expected output} | {Edge cases to test} |

---

## 3. Layer 2: Integration Test Specifications

### 3.1 API Tests

#### {Endpoint Group}

| Test ID | Endpoint | Method | Request | Expected Response | Error Codes |
|---------|----------|--------|---------|-------------------|-------------|
| IT-API-{N} | {/api/path} | {GET/POST/etc} | {Request body} | {Status + body} | {400, 401, etc} |

**Auth Scenarios:**
| Test ID | Scenario | Auth Header | Expected Result |
|---------|----------|-------------|-----------------|
| IT-AUTH-{N} | {Scenario} | {Bearer token/none} | {Expected result} |

### 3.2 CLI Tests

#### {Command Group}

| Test ID | Command | Args | Expected stdout | Exit Code | Side Effects |
|---------|---------|------|-----------------|-----------|--------------|
| IT-CLI-{N} | {command} | {--args} | {Expected output} | {0/1} | {File/DB changes} |

### 3.3 Database State Tests

| Test ID | Action | Before State | After State | Verification Query |
|---------|--------|--------------|-------------|-------------------|
| IT-DB-{N} | {Action} | {State before} | {State after} | {SQL or query} |

---

## 4. Layer 3: E2E Test Specifications

### 4.1 Tool Selection

| Feature Area | Primary Tool | Fallback | Evidence Type |
|--------------|--------------|----------|---------------|
| {Area} | {Tool name} | {Fallback} | {Evidence types} |

### 4.2 User Story Scenarios

#### US-{N}: {User Story Title}

**Tool:** {Selected tool}

**Setup:**
1. {Setup step 1}
2. {Setup step 2}

**Scenario Steps:**

| Step | Action | Verification | Screenshot |
|------|--------|--------------|------------|
| 1 | {Action to perform} | {How to verify success} | {screenshot-name.png} |
| 2 | {Action to perform} | {How to verify success} | {screenshot-name.png} |
| 3 | {Action to perform} | {How to verify success} | {screenshot-name.png} |

**Teardown:**
1. {Cleanup step 1}
2. {Cleanup step 2}

**Evidence Requirements:**
| Evidence Type | Location | Format |
|---------------|----------|--------|
| Screenshots | test-screenshots/US-{N}/ | PNG |
| Console logs | test-logs/US-{N}-console.log | JSON |
| Network requests | test-logs/US-{N}-network.log | HAR |

---

## 5. Test Execution Order

### During Implementation

1. **Write Layer 1 Tests**
   - Create unit test files based on specifications above
   - Run tests → All MUST fail (no implementation yet)
   - If any pass, test is invalid

2. **Write Layer 2 Tests**
   - Create integration test files based on specifications above
   - Run tests → All MUST fail
   - If any pass, test is invalid

3. **Write Layer 3 Tests**
   - Create E2E test scenarios based on specifications above
   - Run tests → All MUST fail
   - If any pass, test is invalid

4. **COMMIT TEST SUITE**
   - Commit all test files BEFORE any implementation code
   - Message: "test: add TDD test suite for {feature}"

5. **Implement Feature Code**
   - Write code incrementally
   - Run tests after each change
   - Tests turn green progressively
   - DO NOT modify tests to make them pass

---

## 6. QA Gate Criteria

| Gate | Requirement | Verification |
|------|-------------|--------------|
| Unit | 100% Layer 1 tests pass | `npm test -- --grep "UT-"` |
| Integration | 100% Layer 2 tests pass | `npm test -- --grep "IT-"` |
| E2E | 100% Layer 3 tests pass | Run E2E scenarios with tool |
| Evidence | All screenshots/logs captured | Check evidence directories |
| Eye Test | Real user would accept this | Manual review of screenshots |

---

## 7. Anti-Pattern Checklist

During implementation and audit, tests will be scanned for these CRITICAL violations:

- [ ] **TODO placeholders** - `// TODO`, `/* TODO */`
- [ ] **Skip markers** - `.skip`, `xit`, `xtest`, `xdescribe`
- [ ] **Empty test bodies** - `test('...', () => {})` with no assertions
- [ ] **Mock-heavy tests** - More than 3 mocks per test file
- [ ] **Existence-only assertions** - Just checking something exists without verifying value
- [ ] **Hardcoded test data** - Data that doesn't match spec requirements
- [ ] **Commented-out tests** - Tests disabled via comments
- [ ] **Conditional skips** - `if (condition) return` early in tests

**If ANY anti-pattern is found, the test suite fails QA gate.**

---

## 8. Evidence Directory Structure

```
test-evidence/
├── screenshots/
│   ├── US-1/
│   │   ├── 01-initial-state.png
│   │   ├── 02-after-action.png
│   │   └── 03-final-state.png
│   └── US-2/
│       └── ...
├── logs/
│   ├── US-1-console.log
│   ├── US-1-network.har
│   └── ...
└── snapshots/
    ├── US-1-db-before.json
    ├── US-1-db-after.json
    └── ...
```

---

## Document Paths (3-SOT)

- **Spec (SOT #1):** `{spec_path}`
- **TDD (SOT #2):** `{tdd_path}` (this document)
- **Bootstrap:** `{bootstrap_path}` (companion document)
- **Strategy (SOT #3):** [to be created next]

---

## Next Stage

Create a lightweight **implementation strategy** document (SOT #3) with:
- Spec (SOT #1): `{spec_path}` (SOURCE OF TRUTH)
- TDD (SOT #2): `{tdd_path}` (TEST SPECIFICATIONS)
- Bootstrap: `{bootstrap_path}` (TEST IMPLEMENTATIONS)
- The strategy defines phase ordering, dependency graphs, and gate criteria — it does NOT duplicate spec or TDD content

---

## 9. Downstream Consumers

This TDD document is consumed by:

| Consumer | What It Uses | What It Needs |
|----------|-------------|---------------|
| Strategy creation | Test IDs for gate criteria | Greppable test IDs, CI tier classifications |
| Beads-from-sources | Test IDs with assertions per bead | Full pseudo-code (setup → execute → assert → cleanup) |
| Bead-plan-audit | Verifies every test ID → bead mapping | Coverage matrix with unique, stable test IDs |
| Bead-completion-audit | Compares TDD vs actual test code | Concrete assertions specific enough to diff |
```

---

## Complete Bootstrap Document Template

```markdown
# {Layer}: {Feature} Bootstrap Specification

> **Layer:** {L0/L1/L2/L2.5} - {Layer Name}
> **Complexity:** {LOW/MEDIUM/HIGH}
> **Dependencies:** {Prior Layer} Complete
> **Version:** {X.Y.Z}
> **Date:** {YYYY-MM-DD}
> **Success Criteria:** {N} criteria, {M}+ test scenarios mapped

---

## Overview

{Brief description of what this layer/feature implements and why bootstrap is needed}

**Without these prerequisites, tests cannot run.** {Explanation of critical dependencies}

---

## Success Criteria Coverage Summary

| Subsystem | Criteria | Tests | Status |
|-----------|----------|-------|--------|
| {Subsystem 1} | {N} | {M} | ✅ |
| {Subsystem 2} | {N} | {M} | ✅ |
| {Subsystem 3} | {N} | {M} | ✅ |
| **TOTAL** | **{N}** | **{M}** | **100%** |

---

## 1. Environment Prerequisites

### Required from Prior Layer
- {Prior layer requirements}
- {Prior layer artifacts that must exist}

### Required for This Layer

| Requirement | Check | Install/Setup |
|-------------|-------|---------------|
| {Tool/Service} | `{check command}` | {Install command or URL} |
| {Tool/Service} | `{check command}` | {Install command or URL} |
| {Environment Variable} | `echo $VAR_NAME` | {How to set it} |

### Validation Script

```bash
#!/bin/bash
# validate-{layer}-prerequisites.sh

set -e
TEST_ID="{LAYER}-PREREQ-$(date +%s)"
echo "[TEST_START] $TEST_ID: {Layer} Prerequisites Validation"

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

# Inherit prior layer
./{prior-layer}-validate-prerequisites.sh || { echo "[FAIL] Prior layer prerequisites not met"; exit 1; }

# {Requirement 1}
check "{Requirement name}" \
  "{check command}" \
  "{install/fix command}"

# {Requirement 2}
check "{Requirement name}" \
  "{check command}" \
  "{install/fix command}"

# Environment variables
check "{VAR_NAME} set" \
  "[ -n \"\${VAR_NAME}\" ]" \
  "export {VAR_NAME}=..."

# API connectivity (if applicable)
check "{API Name} accessible" \
  "{connectivity check command}" \
  "{troubleshooting hint}"

# Summary
if [ $ERRORS -eq 0 ]; then
  echo "[TEST_END] $TEST_ID: PASS"
  exit 0
else
  echo "[TEST_END] $TEST_ID: FAIL ($ERRORS errors)"
  exit 1
fi
```

---

## 2. Test Scenarios by Subsystem

### 2.1 {Subsystem 1} Tests

**Success Criteria:**
- [{Layer}.{Subsystem}.{N}] {Criterion description}
- [{Layer}.{Subsystem}.{N}] {Criterion description}

#### Test: {Layer}.{Subsystem}.{N} - {Test Name}

```{language}
{Complete, executable test code}

// Example structure for Rust:
#[tokio::test]
async fn test_{subsystem}_{feature}() {
    // SETUP
    let test_id = format!("{Layer}.{Subsystem}.{N}-{}", Ulid::new());
    tracing::info!("[TEST_START] {}: {Test description}", test_id);

    let harness = TestHarness::new().await;
    // ... setup code ...
    tracing::info!("[SETUP] {Setup description}");

    // ACTION
    let result = harness.service.action(/* params */).await.unwrap();
    tracing::info!("[ACTION] {Action description}");

    // VERIFY
    assert_eq!(result.field, expected_value, "Assertion message");
    tracing::info!("[ASSERT] {Assertion description}");

    // Additional assertions...

    tracing::info!("[TEST_END] {}: PASS", test_id);
}
```

#### Test: {Layer}.{Subsystem}.{N} - {Another Test Name}

```{language}
{Complete, executable test code}
```

### 2.2 {Subsystem 2} Tests

**Success Criteria:**
- [{Layer}.{Subsystem}.{N}] {Criterion description}

#### Test: {Layer}.{Subsystem}.{N} - {Test Name}

```{language}
{Complete, executable test code}
```

### 2.3 {Subsystem 3} E2E Tests (Bash/CLI)

```bash
#!/bin/bash
# test_{layer}_{subsystem}_e2e.sh

set -e
TEST_ID="{Layer}.{Subsystem}-$(date +%s)"
echo "[TEST_START] $TEST_ID: {Subsystem} E2E"

# Variables
ENDPOINT="http://localhost:{port}"
LOG_FILE="/tmp/test-{subsystem}-${TEST_ID}.log"

# [{Layer}.{Subsystem}.{N}] {Test name}
echo "[ACTION] {Action description}"
RESPONSE=$(curl -sf "$ENDPOINT/{path}" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{json payload}')

echo "$RESPONSE" | jq -e '.expected_field' > /dev/null
echo "[ASSERT] {Assertion description}"

# [{Layer}.{Subsystem}.{N}] {Another test}
echo "[ACTION] {Action description}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$ENDPOINT/{path}" \
  -H "Authorization: Bearer invalid")
[ "$HTTP_CODE" = "401" ]
echo "[ASSERT] {Assertion description}"

echo "[STATE_DUMP] Log file: $LOG_FILE"
echo "[TEST_END] $TEST_ID: PASS"
```

---

## 3. False Positive Prevention

| Test | False Positive Risk | Mitigation |
|------|---------------------|------------|
| {Test name} | {Risk description} | {Mitigation strategy} |
| {Test name} | {Risk description} | {Mitigation strategy} |
| {Test name} | {Risk description} | {Mitigation strategy} |

---

## 4. Structured Logging Requirements

All tests MUST emit structured logs:

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

### Log Configuration

```{language}
// Test harness logging setup example
{language-specific logging configuration}
```

---

## 5. Artifact Templates

### 5.1 Execution Profiles

**Location:** `.agent-swarm/profiles/`

#### {profile-name}.PROFILE.md

```yaml
---
profile_id: {profile-id}
name: {Profile Name}
version: "{X.Y.Z}"
trust_tier: {T0/T1/T2}
classification_clearance: [{C0_Public/C1_Internal/etc}]

provides:
  network:
    internet_egress: {true/false}
    inbound_allowed: {true/false}
  filesystem:
    workspace_write: {true/false}
    scratch_space_bytes: {bytes}
  compute:
    memory_bytes: {bytes}
    cpu_cores: {N}
  services: [{service list}]
  capabilities:
    - {capability-1}
    - {capability-2}
  auth:
    agent_accounts: []
    browser_profiles: []
    egress_connectors: []
    cli_tools: [{tool list}]

policies:
  max_concurrent_agents: {N}
  require_approval_for: [{action list}]
  audit_level: {Full/Summary/Minimal}
  default_scrub_level: {Fast/Thorough}
---
# {Profile Name}

{Profile description}
```

### 5.2 Tool Bundles

**Location:** `.agent-swarm/bundles/{category}/`

#### {bundle-name}.BUNDLE.md

```yaml
---
bundle_id: {bundle-id}
name: {Bundle Name}
version: "{X.Y.Z}"
category: {category}

tools:
  - name: {tool-name}
    description: {tool description}
    parameters: {parameter schema}

permissions_required:
  - {permission-1}
  - {permission-2}
---
# {Bundle Name}

{Bundle description and usage}
```

---

## 6. Artifact Checklist

Before {Layer} implementation begins:

### Environment
- [ ] {Prerequisite 1} is set and valid
- [ ] {Prerequisite 2} is accessible (run validation script)
- [ ] {Tool/Service} is installed

### Execution Profiles
- [ ] `.agent-swarm/profiles/{profile-1}.PROFILE.md` exists
- [ ] `.agent-swarm/profiles/{profile-2}.PROFILE.md` exists

### Tool Bundles
- [ ] `.agent-swarm/bundles/{category}/{bundle-1}.BUNDLE.md` exists
- [ ] `.agent-swarm/bundles/{category}/{bundle-2}.BUNDLE.md` exists

### Plan Packages (if applicable)
- [ ] `plan-packages/{category}/{plan-1}/` complete
- [ ] `plan-packages/{category}/{plan-2}/` complete

### Strategy Packages (if applicable)
- [ ] `strategy-packages/{category}/{strategy-1}/` complete

### Test Fixtures
- [ ] `tests/fixtures/{layer}/{subsystem-1}/` - {Subsystem 1} test fixtures
- [ ] `tests/fixtures/{layer}/{subsystem-2}/` - {Subsystem 2} test fixtures

---

## 7. Success Criteria Mapping

| Criterion | Test File | Test Function |
|-----------|-----------|---------------|
| {Layer}.{Subsystem}.{N} | {test_file}.rs | test_{feature}_{scenario} |
| {Layer}.{Subsystem}.{N} | {test_file}.rs | test_{feature}_{scenario} |
| {Layer}.{Subsystem}.{N} | test_{layer}_{subsystem}.sh | CLI test |

---

## 8. Test Harness Design

### Harness Structure

```{language}
/// Test harness for {Layer} tests
pub struct TestHarness {
    // Core infrastructure
    pub event_store: Arc<EventStore>,
    pub cas: Arc<CASStore>,

    // Layer-specific services
    pub {service_1}: Arc<{Service1}>,
    pub {service_2}: Arc<{Service2}>,

    // Optional components
    pub {optional_component}: Option<Arc<{Component}>>,

    // Cleanup
    _temp_dir: TempDir,
}

impl TestHarness {
    /// Create new test harness with fresh database
    pub async fn new() -> Self {
        // ... initialization
    }

    /// Create harness with {optional feature}
    pub async fn with_{feature}() -> Self {
        // ... initialization with feature
    }

    /// Helper: Create test {entity}
    pub async fn create_{entity}(&self, name: &str) -> {Entity} {
        // ... implementation
    }

    /// Helper: Create {entity} in {context}
    pub async fn create_{entity}_in_{context}(&self, name: &str, context: &str) -> {Entity} {
        // ... implementation
    }
}
```

### Fixture Loading

```{language}
/// Load fixtures from disk
pub fn load_fixtures(path: &str) -> Result<Fixtures, Error> {
    // ... implementation
}

/// Fixture data structures
#[derive(Deserialize)]
pub struct Fixtures {
    pub {entity_1}: Vec<{Entity1}>,
    pub {entity_2}: Vec<{Entity2}>,
}
```

---

## 9. Handoff to Next Layer

After {Layer} implementation is complete with all E2E tests passing:

**{Next Layer} will use all {Layer} artifacts:**
- {Artifact 1} for {purpose}
- {Artifact 2} for {purpose}
- {Artifact 3} for {purpose}

**{Next Layer} adds:**
- {New capability 1}
- {New capability 2}
- {New capability 3}

---

## Document Paths

- **Spec:** `{spec_path}`
- **Architecture:** `{arch_path}`
- **TDD:** `{tdd_path}`
- **Bootstrap:** `{bootstrap_path}` (this document)
```

---

## Layer Templates

### Unit Test Specification Table

```markdown
| Test ID | Description | Input | Expected Output | Edge Cases |
|---------|-------------|-------|-----------------|------------|
| UT-FR-X.Y.1 | Description | Input | Output | edge1, edge2 |
```

### API Test Specification Table

```markdown
| Test ID | Endpoint | Method | Request | Expected Response | Error Codes |
|---------|----------|--------|---------|-------------------|-------------|
| IT-API-N | /api/path | POST | { ... } | 201 + { ... } | 400, 401, 409 |
```

### CLI Test Specification Table

```markdown
| Test ID | Command | Args | Expected stdout | Exit Code | Side Effects |
|---------|---------|------|-----------------|-----------|--------------|
| IT-CLI-N | cmd:action | --arg val | "output text" | 0 | .file/ updated |
```

### E2E Scenario Step Table

```markdown
| Step | Action | Verification | Screenshot |
|------|--------|--------------|------------|
| 1 | Click button X | Modal opens | 01-modal.png |
| 2 | Type "value" | Input populated | 02-typed.png |
| 3 | Click Submit | Success message | 03-success.png |
```

### Tool Selection Table

```markdown
| Feature Area | Primary Tool | Fallback | Evidence Type |
|--------------|--------------|----------|---------------|
| Web UI | Playwright MCP | Claude Chrome | Screenshots, DOM |
| Electron | Circuit Electron MCP | - | Screenshots, IPC |
| CLI | Bash + expect | - | stdout/stderr |
| API | curl + jq | httpie | JSON responses |
```

---

## QA Gate Template

```markdown
## QA Gate Criteria

| Gate | Requirement | Pass Criteria |
|------|-------------|---------------|
| Unit | 100% Layer 1 pass | All UT-* tests green |
| Integration | 100% Layer 2 pass | All IT-* tests green |
| E2E | 100% Layer 3 pass | All scenarios complete |
| Evidence | All captured | All screenshots exist |
| Eye Test | User acceptance | Manual approval |
```

---

## Anti-Pattern Scan Template

```markdown
## Anti-Pattern Checklist

Before QA sign-off, scan for:
- [ ] TODO placeholders in test code
- [ ] .skip / xit / xtest markers
- [ ] Empty test bodies
- [ ] Mock-heavy tests (>3 mocks)
- [ ] Existence-only assertions
- [ ] Hardcoded test data
- [ ] Commented-out tests
- [ ] Conditional skips
```

---

## Prerequisites Validation Script Template

```bash
#!/bin/bash
# validate-{layer}-prerequisites.sh

set -e
TEST_ID="{LAYER}-PREREQ-$(date +%s)"
echo "[TEST_START] $TEST_ID: {Layer} Prerequisites Validation"

ERRORS=0

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

warn_check() {
  local name="$1"
  local check_cmd="$2"

  if eval "$check_cmd" > /dev/null 2>&1; then
    echo "[PASS] $name"
  else
    echo "[WARN] $name (optional, some tests may skip)"
  fi
}

check_artifact() {
  local path="$1"
  if [ -f "$path" ] || [ -d "$path" ]; then
    echo "[PASS] Artifact: $path"
  else
    echo "[FAIL] Missing artifact: $path"
    ERRORS=$((ERRORS + 1))
  fi
}

# ======================
# Prior Layer Check
# ======================
echo "Checking prior layer..."
# ./{prior-layer}-validate-prerequisites.sh

# ======================
# Toolchain
# ======================
check "{Language} toolchain" \
  "{version check command}" \
  "{install command}"

# ======================
# System Dependencies
# ======================
check "{Tool}" \
  "{tool} --version" \
  "{install command}"

# ======================
# Environment Variables
# ======================
check "{VAR_NAME} set" \
  "[ -n \"\${VAR_NAME}\" ]" \
  "export {VAR_NAME}=..."

# ======================
# API Connectivity
# ======================
check "{API} accessible" \
  "{connectivity test command}" \
  "{troubleshooting hint}"

# ======================
# Required Artifacts
# ======================
check_artifact "{artifact_path_1}"
check_artifact "{artifact_path_2}"

# ======================
# Summary
# ======================
if [ $ERRORS -eq 0 ]; then
  echo "[TEST_END] $TEST_ID: PASS"
  exit 0
else
  echo "[TEST_END] $TEST_ID: FAIL ($ERRORS errors)"
  exit 1
fi
```

---

## False Positive Prevention Table Template

```markdown
## False Positive Prevention

| Test | False Positive Risk | Mitigation |
|------|---------------------|------------|
| {Test name} | {What could cause false pass} | {How test prevents it} |
```

Common patterns:

| Risk Pattern | Mitigation |
|--------------|------------|
| Empty result passes | Verify count > 0 before checking contents |
| Async not waited | Poll with timeout, verify completion event |
| Version not checked | Assert version increments after mutation |
| Race condition | Deterministic ordering, locks, or retries |
| Index lag | Small delay after write before query |
| Threshold not hit | Parameterize threshold for test environment |

---

## Success Criteria Mapping Table Template

```markdown
## Success Criteria Mapping

| Criterion | Test File | Test Function |
|-----------|-----------|---------------|
| L{X}.{Y}.{Z} | {filename}.rs | test_{feature}_{scenario} |
| L{X}.{Y}.{Z} | {filename}.rs | test_{feature}_{scenario} |
| L{X}.{Y}.{Z} | test_{feature}.sh | CLI E2E test |
```
