# Bead Completion Audit — TDD Cross-Check & Test Verification (v4.0)

Deep dive guide for TDD assertion cross-checking, test body reading, and mock fidelity.
Language-agnostic with examples for Rust, TypeScript, Python, and Go.

---

## Core Principle: TDD is Co-Primary Source of Truth

The TDD document specifies:
- **Which tests must exist** (by test ID)
- **What each test asserts** (pseudo-code with specific checks)
- **What infrastructure each test uses** (real vs mock)
- **What edge cases each test covers**

A test that exists but doesn't match TDD assertions is a **[FAIL]** — not a [PASS].

---

## TDD Cross-Check Protocol

### For Each TDD Test ID:

1. **FIND** — Search for the test in the codebase
   ```bash
   # Search by test ID in comments or function names
   grep -rn "UT-REG-001\|ut_reg_001\|test_registry_insert" tests/ src/
   ```

2. **READ THE BODY** — Open the test, read every line

3. **COMPARE** — Put TDD pseudo-code and test body side-by-side:
   ```
   TDD says:                          Test does:
   ────────                            ─────────
   Insert 226 methods                  ✓ Inserts 226 methods
   Verify count == 226                 ✓ assert_eq!(count, 226)
   Lookup by name returns correct      ✗ MISSING — no lookup test
   Lookup by unknown returns None      ✗ MISSING — no negative test
   ```

4. **CLASSIFY gaps:**
   - All assertions match → [PASS]
   - Missing 1-2 assertions → INLINE_FIX (add assertions)
   - Missing most assertions → FIX_BEAD (rewrite test)
   - Test doesn't exist → FIX_BEAD (create test file)
   - Test is stubbed/skipped → FIX_BEAD (implement)

5. **CHECK INFRASTRUCTURE:**
   - TDD says "real harness" → test must use real harness
   - TDD says "real database" → test must not mock the database
   - TDD says "live swarmd" → test must spawn real swarmd
   - Mismatch → [FAIL]

---

## Test Body Reading: Red Flags by Language

### Rust

```rust
// FAKE: Empty body
#[test] fn test_something() {}

// FAKE: Trivially passing
#[test] fn test_something() { assert!(true); }

// WEAK: Only checks Ok, not contents
#[test] fn test_compile() {
    assert!(compile(input).is_ok()); // What's in the Ok?
}

// SUSPICIOUS: Ignore without reason
#[ignore]
#[test] fn test_expensive() { ... }

// SUSPICIOUS: Compilation-only
#[test] fn test_types() { let _x: MyType = MyType::default(); }

// HIDDEN FAKE: Asserts on mock, not real behavior
#[test] fn test_service() {
    let mock = MockStore::new();
    mock.expect_get().returning(|_| Ok(default()));
    let svc = Service::new(mock);
    assert!(svc.get("key").is_ok()); // Mock always returns Ok!
}
```

**Good Rust tests (TDD-aligned):**
```rust
// Checks specific fields matching TDD assertions
let result = compile(input).unwrap();
assert_eq!(result.cases.len(), 3);          // TDD: "3 cases"
assert_eq!(result.cases[0].name, "login");  // TDD: "first case is login"
assert_eq!(result.target_ref, expected_ref); // TDD: "target_ref set"

// Tests error path matching TDD
let err = parse("bad input").unwrap_err();
assert!(err.to_string().contains("unknown key")); // TDD: "rejects unknown keys"

// Uses real infrastructure matching TDD
let harness = LiveHarness::start().await;    // TDD: "live harness"
let result = harness.client().call().await;
assert_eq!(result.status, "active");         // TDD: "returns active status"
```

### TypeScript

```typescript
// FAKE: Empty
it('should compile', () => {});

// FAKE: Trivially passing
it('should compile', () => { expect(true).toBe(true); });

// WEAK: Existence-only
it('should render', () => {
    render(<Panel />);
    expect(screen.getByTestId('panel')).toBeInTheDocument(); // TDD wants content checks
});

// SUSPICIOUS: Skip without reason
it.skip('should handle error', () => { ... });

// SUSPICIOUS: Mock-heavy "integration"
jest.mock('../services/runner');
jest.mock('../storage/cas');
it('integration test', () => { ... }); // Tests nothing real
```

**Good TypeScript tests (TDD-aligned):**
```typescript
// Matches TDD assertions specifically
expect(screen.getByText('Passing')).toHaveClass('badge-green'); // TDD: "green badge"
expect(screen.getByText('3/3 cases')).toBeInTheDocument();       // TDD: "case count"

// Error propagation matching TDD
await userEvent.click(screen.getByRole('button'));
expect(screen.getByRole('alert')).toHaveTextContent('Invalid'); // TDD: "shows error"
```

### Python

```python
# FAKE: Empty
def test_something(): pass

# FAKE: Trivially passing
def test_something(): assert True

# WEAK: Type-only
def test_parse():
    result = parse(input)
    assert isinstance(result, Manifest)  # TDD wants field checks
```

### Go

```go
// FAKE: Empty
func TestSomething(t *testing.T) {}

// WEAK: Only nil-error check
func TestCompile(t *testing.T) {
    result, err := Compile(input)
    if err != nil { t.Fatal(err) }
    _ = result // Never checks result!
}
```

---

## The No-Op Test

**The definitive fake test detector:**

For each test, ask: "Would a completely empty/no-op implementation pass this test?"

```rust
// The no-op implementation:
fn compile(_input: &str) -> Result<Output, Error> {
    Ok(Output::default())
}

// This test PASSES with the no-op → FAKE:
#[test] fn test_compile() {
    assert!(compile("anything").is_ok());
}

// This test FAILS with the no-op → REAL (GOOD):
#[test] fn test_compile() {
    let result = compile("real input").unwrap();
    assert_eq!(result.cases.len(), 3); // default() has 0 cases
}
```

---

## Mock Fidelity Analysis

### Mock Levels

| Level | Acceptable For |
|-------|----------------|
| **Full mock** (all deps mocked) | Unit tests ONLY |
| **In-memory shim** | Unit tests, some integration |
| **Test double** (behavioral clone) | Integration (carefully) |
| **Real dependency** (actual service) | Integration + E2E (PREFERRED) |
| **Live infrastructure** | E2E (REQUIRED for E2E claims) |

### Verifying Mock Level

For each "integration" or "E2E" test:
1. **Check setup** — What does the harness start?
2. **Check imports** — Mock utilities or real clients?
3. **Check infrastructure** — Real services or in-memory fakes?

```bash
# Rust: Real harness?
grep -n "LiveGatewayHarness\|TestHarness\|spawn" tests/*.rs

# TypeScript: MSW (mock) vs real server?
grep -n "setupServer\|rest.get\|rest.post\|msw" tests/*.test.ts
grep -n "localhost\|127.0.0.1" tests/*.spec.ts
```

### Mock Deceptions

| Claim | Reality | Verdict |
|-------|---------|---------|
| "E2E test" | Uses MSW for all API | NOT E2E → [FAIL] |
| "Integration test" | Mocks the database | NOT integration → [FAIL] |
| "Live test" | In-memory store | NOT live → [FAIL] |

---

## Rewriting Fake Tests

### Strategy 1: Strengthen Assertions (INLINE_FIX)

Add the missing assertions from TDD:
```rust
// BEFORE (weak — only 1 of 4 TDD assertions)
assert!(result.is_ok());

// AFTER (matches all TDD assertions)
let result = result.unwrap();
assert_eq!(result.cases.len(), 3);
assert_eq!(result.cases[0].name, "login flow");
assert!(result.target_ref.is_some());
assert_eq!(result.metadata.version, "1.0.0");
```

### Strategy 2: Replace Mocks with Real Infrastructure (FIX_BEAD)

```rust
// BEFORE (mocked)
let mock_store = MockStore::new();
let service = Service::new(mock_store);
assert!(service.add(input).await.is_ok());

// AFTER (real — matches TDD infrastructure requirement)
let harness = LiveGatewayHarness::start().await;
let result = harness.client().add(input).await.unwrap();
assert_eq!(result.name, "test-manifest");
let retrieved = harness.client().get(result.id).await.unwrap();
assert_eq!(retrieved.name, result.name);
```

### Strategy 3: Create Missing Test (FIX_BEAD)

If TDD specifies a test that doesn't exist at all, create the entire test file/function as a fix bead.

---

## Test Quality Evidence for Report

```
### Test Quality: {file_name}

**Tests:** {N} | **REAL:** {N} | **WEAK:** {N} | **FAKE:** {N} | **Ignored:** {N}
**TDD Coverage:** {N}/{total} TDD assertions verified

| Test | TDD ID | Quality | TDD Match | Issue | Fix |
|------|--------|---------|-----------|-------|-----|
| test_compile | UT-001 | REAL | 4/4 | — | — |
| test_error | UT-002 | WEAK | 1/3 | Missing 2 assertions | INLINE_FIX |
| test_lifecycle | UT-003 | FAKE | 0/5 | Empty body | FIX_BEAD |
| test_expensive | UT-004 | IGNORED | — | "Needs live swarmd" | Justified |
```
