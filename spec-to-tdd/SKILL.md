---
name: spec-to-tdd
description: Transform specification and architecture documents into comprehensive TDD test specifications AND bootstrap documents. Creates layered test plans (unit, integration, E2E) with tool-to-medium matching, plus environment prerequisites, validation scripts, and actual test implementations. Outputs both a TDD specification document and a bootstrap implementation document.
---

# Spec to TDD + Bootstrap Conversion

This skill transforms **specification and architecture documents** into TWO comprehensive documents:
1. **TDD Document** - Test specifications (WHAT tests must exist)
2. **Bootstrap Document** - Test implementation (HOW tests run, prerequisites, actual code)

## Philosophy

```
┌─────────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────────┐
│   Spec + Architecture   │     │    Your Analysis        │     │    TDD Document         │
│        (WHAT)           │ ──▶ │    (TEST DESIGN)        │ ──▶ │   (HOW TO VERIFY)       │
│                         │     │                         │     │                         │
│  Feature requirements,  │     │  Map requirements to    │     │  Layered test specs,    │
│  acceptance criteria,   │     │  testable scenarios,    │     │  tool selection,        │
│  user stories           │     │  choose test tools      │     │  evidence requirements  │
└─────────────────────────┘     └─────────────────────────┘     └─────────────────────────┘
                                          │
                                          ▼
                                ┌─────────────────────────┐
                                │   Bootstrap Document    │
                                │   (HOW TO RUN)          │
                                │                         │
                                │  Prerequisites,         │
                                │  validation scripts,    │
                                │  test implementations   │
                                └─────────────────────────┘
```

**Key Distinction:**
- **TDD Document** = WHAT tests must exist (specifications, inputs, outputs, scenarios)
- **Bootstrap Document** = HOW tests run (prerequisites, fixtures, actual test code)

**Key Principle:** TDD document defines tests BEFORE implementation. Bootstrap document provides everything needed to RUN those tests. Both are created BEFORE implementation begins.

## When to Use This Skill

Use this skill when:
- You have completed `research-to-spec` and have spec + architecture documents
- You need to define comprehensive test coverage before planning
- You want TDD-style development with tests written first
- You're preparing for strategy creation (SOT #3) in the 3-SOT workflow

**Trigger phrases:**
- "Create TDD document from spec"
- "Design test plan for [feature]"
- "Convert spec to TDD specifications"
- "Prepare TDD and bootstrap before planning"

---

## The Complete Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SPEC TO TDD + BOOTSTRAP WORKFLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ══════════════════════════════════════════════════════════════════════════ │
│  PART A: TEST SPECIFICATION (TDD Document)                                  │
│  ══════════════════════════════════════════════════════════════════════════ │
│                                                                             │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 1: STUDY     │   Requirements Analysis                            │
│  │  SPEC               │                                                    │
│  │  ─────────────────  │   • Read spec document COMPLETELY                  │
│  │  • Extract FRs      │   • Extract all functional requirements (FR-X.Y)   │
│  │  • Map user stories │   • Map user stories (US-X)                        │
│  │  • Note acceptance  │   • Note acceptance criteria                       │
│  │    criteria         │   • Identify testable behaviors                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 2: STUDY     │   Architecture Analysis                            │
│  │  ARCHITECTURE       │                                                    │
│  │  ─────────────────  │   • Read architecture document                     │
│  │  • Map components   │   • Identify API endpoints                         │
│  │  • Identify APIs    │   • Map CLI commands                               │
│  │  • Note data flows  │   • Understand data flows                          │
│  │  • Find boundaries  │   • Find integration boundaries                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 3: DESIGN    │   Layer 1 - Unit Test Specifications               │
│  │  UNIT TESTS         │                                                    │
│  │  ─────────────────  │   • Pure function tests (no mocks)                 │
│  │  • Input/output     │   • Input validation tests                         │
│  │  • Edge cases       │   • Edge case coverage                             │
│  │  • Error conditions │   • Error condition handling                       │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 4: DESIGN    │   Layer 2 - Integration Test Specifications        │
│  │  INTEGRATION TESTS  │                                                    │
│  │  ─────────────────  │   • API endpoint tests (request/response)          │
│  │  • API tests        │   • CLI command tests (args/stdout/exit)           │
│  │  • CLI tests        │   • Database state verification                    │
│  │  • Auth flows       │   • Auth/permission flows                          │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 5: DESIGN    │   Layer 3 - E2E Test Specifications                │
│  │  E2E TESTS          │                                                    │
│  │  ─────────────────  │   • User story scenarios                           │
│  │  • User stories     │   • Tool selection (Playwright, Circuit, etc.)     │
│  │  • Tool selection   │   • Screenshot checkpoints                         │
│  │  • Evidence reqs    │   • Evidence requirements                          │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│  ══════════════════════════════════════════════════════════════════════════ │
│  PART B: TEST IMPLEMENTATION (Bootstrap Document)                           │
│  ══════════════════════════════════════════════════════════════════════════ │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 6: IDENTIFY  │   Test Prerequisites                               │
│  │  PREREQUISITES      │                                                    │
│  │  ─────────────────  │   For each test layer, identify:                   │
│  │  • Toolchain reqs   │   • Language/runtime versions (Rust, Node, etc.)   │
│  │  • External deps    │   • External services (databases, APIs)            │
│  │  • API keys/creds   │   • Authentication credentials needed              │
│  │  • System packages  │   • OS-level packages (jq, curl, etc.)             │
│  │  • Prior layers     │   • Dependencies on prior layer completion         │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 7: DESIGN    │   Validation Scripts                               │
│  │  VALIDATION         │                                                    │
│  │  ─────────────────  │   • Executable scripts to verify prerequisites     │
│  │  • Prereq checks    │   • Structured output: [PASS] / [FAIL] / [WARN]    │
│  │  • Version checks   │   • Actionable error messages with fix commands    │
│  │  • Connectivity     │   • API connectivity tests                         │
│  │  • Prior artifacts  │   • Verify prior layer artifacts exist             │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 8: DESIGN    │   Test Harness & Fixtures                          │
│  │  HARNESS/FIXTURES   │                                                    │
│  │  ─────────────────  │   • TestHarness struct/class design                │
│  │  • Harness design   │   • Setup/teardown procedures                      │
│  │  • Fixture data     │   • Test fixture data (JSON, SQL, etc.)            │
│  │  • Mock services    │   • Mock external services (when unavoidable)      │
│  │  • Artifact paths   │   • Artifact templates (profiles, bundles)         │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 9: WRITE     │   Actual Test Implementations                      │
│  │  TEST CODE          │                                                    │
│  │  ─────────────────  │   • REAL executable test code (not specs!)         │
│  │  • Unit tests       │   • Structured logging: [TEST_START], [ASSERT]     │
│  │  • Integration      │   • Full test bodies with assertions               │
│  │  • E2E tests        │   • Evidence capture (screenshots, logs)           │
│  │  • Structured logs  │   • False positive prevention checks               │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│  ══════════════════════════════════════════════════════════════════════════ │
│  PART C: DOCUMENTATION                                                      │
│  ══════════════════════════════════════════════════════════════════════════ │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 10: WRITE    │   TDD Document                                     │
│  │  TDD DOCUMENT       │                                                    │
│  │  ─────────────────  │   Output: thoughts/shared/tdd/                     │
│  │  • All test specs   │   {date}-{feature}-tdd.md                          │
│  │  • QA gate criteria │                                                    │
│  │  • Anti-patterns    │   Test SPECIFICATIONS (what to test)               │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 11: WRITE    │   Bootstrap Document                               │
│  │  BOOTSTRAP DOC      │                                                    │
│  │  ─────────────────  │   Output: thoughts/shared/bootstrap/               │
│  │  • Prerequisites    │   {date}-{feature}-bootstrap.md                    │
│  │  • Validation       │                                                    │
│  │  • Test impls       │   Test IMPLEMENTATIONS (how to run)                │
│  │  • Artifact list    │                                                    │
│  └──────────┬──────────┘                                                    │
│             │                                                               │
│             ▼                                                               │
│  ┌─────────────────────┐                                                    │
│  │  PHASE 12: HANDOFF  │   Generate Handoff Prompt                          │
│  │  PROMPT             │                                                    │
│  │  ─────────────────  │   • Reference all documents                        │
│  │  • Next skill guide │   • Guide to strategy creation (SOT #3)             │
│  │  • Document paths   │   • Include spec, arch, tdd, bootstrap paths       │
│  └─────────────────────┘                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Input Requirements

1. **Required:** Path to spec document
   - Example: `thoughts/shared/specs/{date}-{feature}-spec.md`

2. **Optional:** Path to architecture document
   - Example: `thoughts/shared/architecture/{date}-{feature}-architecture.md`

---

## Outputs

### Primary Output: TDD Document
**Location:** `thoughts/shared/tdd/{date}-{feature}-tdd.md`

The TDD document contains **test specifications** (not executable code):
- **Coverage Matrix** — spec-requirement → test-ID mapping for mechanical gap detection
- **Test Infrastructure** — shared mocks, harnesses, fixtures defined upfront
- **Step/Phase Tags** — every test tagged with build step and subsystem
- **CI Tier Classification** — T1/T2/T3/T4 execution time budgets
- What tests must exist (names, categories)
- Inputs and expected outputs for each test
- Scenarios and user flows to verify
- Evidence requirements (screenshots, logs)
- Tool recommendations per test type
- QA gate criteria
- Anti-pattern checklist
- **Downstream Consumer Context** — how strategy, beads, and audits use this TDD

### Secondary Output: Bootstrap Document
**Location:** `thoughts/shared/bootstrap/{date}-{feature}-bootstrap.md`

The Bootstrap document contains **test implementations** (executable):
- Environment prerequisites with validation scripts
- Success criteria coverage summary
- Actual test implementations (Rust, TypeScript, Bash)
- Test harness and fixture designs
- Artifact templates (profiles, bundles, plans)
- Artifact checklist (what must exist before tests run)
- Structured logging requirements
- False positive prevention table

---

## Core Principles

### 1. Two Documents, Two Purposes

| Document | Purpose | Contains | When Used |
|----------|---------|----------|-----------|
| **TDD** | Define WHAT to test | Specifications, scenarios, evidence requirements | During strategy/bead creation (downstream consumers reference it) |
| **Bootstrap** | Define HOW to run tests | Prerequisites, actual code, fixtures | Before implementation (agents run tests) |

### 2. Layered Test Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Layer 3: E2E Tests                    │
│         (User story scenarios, tool-specific)            │
├─────────────────────────────────────────────────────────┤
│               Layer 2: Integration Tests                 │
│          (API endpoints, CLI commands, auth)             │
├─────────────────────────────────────────────────────────┤
│                  Layer 1: Unit Tests                     │
│       (Pure functions, input/output, edge cases)         │
└─────────────────────────────────────────────────────────┘
```

### 3. Tool-to-Medium Matching

| Application Type | Primary Tool | Evidence Type |
|------------------|--------------|---------------|
| Web Browser UI | Playwright MCP / Claude Chrome | Screenshots, DOM snapshots |
| Electron Desktop | Circuit Electron MCP | Screenshots, IPC logs |
| CLI/Terminal | Bash + expect | stdout/stderr capture |
| REST API | curl + jq | JSON response logs |
| Mobile | Detox/Appium | Screenshots, gesture logs |
| Rust Backend | cargo test | Structured tracing logs |

### 4. No Stubs, No Fakes

TDD document explicitly forbids:
- TODO placeholders in tests
- .skip / xit / xtest markers
- Empty test bodies
- Mock-heavy tests (>3 mocks)
- Existence-only assertions (just checking something exists without verifying value)
- Vague assertions (`assert(true)`, `assert(result != null)`, "verify correct behavior")
- Stub implementations that return hardcoded values
- Tests that pass with `return Ok(())` implementations

**Every test MUST have the 4-part structure:**
1. **Setup** — prerequisites, fixtures, state initialization
2. **Execution** — the specific action being tested
3. **Assertions** — concrete, specific, measurable outcomes (not "verify it works")
4. **Cleanup** — teardown if applicable (often handled by test harness)

Bootstrap document provides REAL, EXECUTABLE tests that:
- Start with `[TEST_START]` structured log
- Follow the 4-part structure above
- Make real assertions with concrete expected values
- End with `[TEST_END] ... PASS/FAIL`

### 5. Evidence-Based Verification

Every E2E test must capture:
- Before screenshot (initial state)
- After screenshot (result state)
- Console/network logs if applicable
- Database state snapshot if data changed

### 6. Prerequisites Before Tests

Bootstrap document MUST specify:
- What tools/versions are required
- How to verify they're installed (validation script)
- What to do if verification fails (fix commands)
- What artifacts from prior layers are needed

### 7. 3-SOT Pipeline Alignment

This skill produces **SOT #2** (TDD + Bootstrap) in the 3-Source-of-Truth workflow:

| SOT | Document | Purpose |
|-----|----------|---------|
| **#1** | Spec | What to build. Every detail. No shortcuts. |
| **#2** | TDD + Bootstrap | How to test it. Real assertions, real bootstrap, no stubs. |
| **#3** | Implementation Strategy | What order, what blocks what, phase gates. Lightweight routing table. |

Beads are created directly from Spec + TDD + Strategy. The TDD must be rigorous enough to support:
- **Mechanical coverage verification** — spec requirement → test ID mapping
- **Bead creation** — each bead references specific test IDs
- **Post-implementation audit** — TDD assertions compared against actual test code

If it's in the spec, it must have a test. If it can't be tested, it shouldn't be in the spec.

### 8. Coverage Matrix (Spec → Test Mapping)

The TDD document MUST include a **Coverage Matrix** that maps every spec requirement to test IDs:

```markdown
| Spec Requirement | Test ID(s) | Test Type | Status |
|------------------|-----------|-----------|--------|
| FR-2.1.1 | UT-REG-001, IT-REG-005 | UT + IT | Covered |
| FR-2.2.1 | — | — | GAP |
```

After writing all tests, build the coverage matrix and flag any spec requirement with zero tests. Every gap is either: (a) a missing test to write, or (b) an untestable spec requirement to flag for spec revision.

### 9. Step/Phase Tagging

If the spec has phases, implementation steps, or build stages, every test MUST be tagged:

```
step: 1|2|3           — Build step (mandatory if spec has steps)
subsystem: D-L2.5.{N} — Primary deliverable/subsystem
priority: P0|P1|P2    — MVP priority
```

This enables downstream strategy and beads to reference tests by scope.

### 10. CI Tier Classification

Tests MUST be classified by execution time for CI pipeline design:

| Tier | Time Budget | Purpose |
|------|-------------|---------|
| T1 | <3 min | Fast feedback loop |
| T2 | <10 min | Standard CI |
| T3 | <20 min | Integration/heavy |
| T4 | <45 min | E2E/chaos/performance |

### 11. Test Infrastructure Section

The TDD document MUST define mock/stub/harness patterns upfront so individual tests reference them consistently. This section lists all shared test infrastructure (e.g., `MockSwarmd`, `LiveGatewayHarness`, `MSW handlers`, `SwarmLab`) with their purpose and scope.

---

## Success Criteria Coverage

The Bootstrap document includes a **Success Criteria Coverage Summary**:

```markdown
## Success Criteria Coverage Summary

| Subsystem | Criteria | Tests | Status |
|-----------|----------|-------|--------|
| L1.1 Native Swarm Mail | 4 | 6 | ✅ |
| L1.2 Native WorkUnits | 8 | 12 | ✅ |
| ...
| **TOTAL** | **59** | **92** | **100%** |
```

This ensures every success criterion from the spec has corresponding test coverage.

---

## Supporting Files

For detailed guidance, see:
- **METHODOLOGY.md** - Complete step-by-step TDD + Bootstrap document creation process
- **TEMPLATES.md** - Ready-to-use TDD and Bootstrap document templates
- **EXAMPLES.md** - Real-world TDD + Bootstrap document examples

---

## Workflow Integration (3-SOT Model)

This skill produces **SOT #2** in the 3-Source-of-Truth pipeline:

```
research-to-spec  →  spec-to-tdd           →  create strategy doc  →  beads-from-sources
(SOT #1: spec)       (SOT #2: TDD+Bootstrap)  (SOT #3: strategy)     (beads directly from 3 SOTs)
```

**Previous:** `research-to-spec` - Creates specification and architecture documents (SOT #1)
**Next:** Create lightweight implementation strategy (SOT #3) — ordering, dependencies, gates

> **NOTE:** In the 3-SOT model, beads are created directly from Spec + TDD + Strategy.
> There is no intermediate "plan" document. The strategy is a routing table (~500-800 lines),
> NOT a full task decomposition. All content lives in the spec and TDD.

---

## Downstream Consumers

The TDD document is consumed by 4 downstream stages. Understanding these consumers ensures the TDD author writes with the right format and level of detail.

| Consumer | How It Uses TDD | What It Needs |
|----------|----------------|---------------|
| **Strategy creation** | References TDD test IDs for gate criteria | Greppable test IDs, CI tier classifications |
| **Beads-from-sources** | Each bead embeds relevant test IDs with assertions | Full pseudo-code per test (setup → execute → assert → cleanup) |
| **Bead-plan-audit** | Verifies every test ID is assigned to at least one bead | Coverage matrix with unique, stable test IDs |
| **Bead-completion-audit** | Compares TDD assertions against actual test code | Concrete assertions specific enough to compare against real code |

**Test IDs must be:** unique, stable (don't change between versions), greppable (no spaces or special chars in ID), and organized by subsystem for easy bead assignment.

**Assertions must be:** concrete enough that a post-implementation auditor can grep the actual test file and verify the TDD assertion is faithfully implemented — not "verify correct behavior" but `assert_eq!(result.status, 201)`.

---

## Next Stage Kickoff Prompt

After completing this skill, copy the prompt below to kick off the next stage:

```
Create a lightweight **implementation strategy** document (SOT #3).

- Spec: `{spec_path}` (SOT #1 — SOURCE OF TRUTH)
- TDD: `{tdd_path}` (SOT #2 — TEST SPECIFICATIONS)
- Bootstrap: `{bootstrap_path}` (TEST IMPLEMENTATIONS)

The strategy is a ROUTING TABLE, not a content document:
- Phase ordering and dependencies (what blocks what)
- Domain batches (which subsystems ship together)
- Gate criteria (which TDD test IDs must pass at each gate)
- Parallel execution guidance (which phases can overlap)

Target: ~500-800 lines. All content lives in spec + TDD.
Output: `{feature}-strategy.md`
```

**Fill in the placeholders** with your actual paths before pasting.

---

## Quick Start

```bash
# 1. Ensure spec document exists
ls thoughts/shared/specs/*-spec.md

# 2. Invoke this skill with the spec path
# "Create TDD and bootstrap documents from spec"

# 3. Review generated TDD document (specifications)
cat thoughts/shared/tdd/*-tdd.md

# 4. Review generated Bootstrap document (implementations)
cat thoughts/shared/bootstrap/*-bootstrap.md

# 5. Run prerequisite validation
bash thoughts/shared/bootstrap/*-bootstrap/validate-prerequisites.sh

# 6. Proceed to create implementation strategy (SOT #3)
```

---

## Best Practices

### TDD Document
1. **Read spec completely** - Every requirement (FR-X.Y) needs test coverage
2. **Map user stories** - Each US-X becomes an E2E scenario
3. **Choose tools wisely** - Match test tool to application medium
4. **Define evidence** - Be specific about what screenshots/logs to capture
5. **No shortcuts** - TDD document must be comprehensive before strategy begins
6. **Build coverage matrix** - Map every spec requirement to test IDs, flag gaps
7. **Tag every test** - Step/phase, subsystem, priority tags are mandatory
8. **Classify CI tiers** - Every test gets a T1/T2/T3/T4 budget
9. **Define test infrastructure** - Shared mocks/harnesses upfront, not inline
10. **Think downstream** - Strategy, beads, and audits will consume this TDD

### Bootstrap Document
1. **Validate prerequisites** - Never assume environment is correct
2. **Structured logging** - Use `[TEST_START]`, `[ASSERT]`, `[TEST_END]` format
3. **Real assertions** - No empty tests or existence-only checks
4. **False positive prevention** - Document how each test avoids false passes
5. **Artifact checklist** - List everything that must exist before tests run
6. **Coverage mapping** - Map every success criterion to specific tests
7. **Real commands only** - "Install dependencies" is not a step; `bun install` is
8. **4-part test structure** - Every test has Setup → Execution → Assertions → Cleanup
