# Strategy Document Template

The single output template for the spec-to-strategy skill.

---

## Template: Implementation Strategy

**File Location:** `docs/strategy/{feature}-strategy.md`

```markdown
# {FEATURE_NAME} — Implementation Strategy

## Source Documents

| Document | Path | Role |
|----------|------|------|
| **Spec** | `{SPEC_PATH}` | SOT #1 — WHAT to build |
| **TDD** | `{TDD_PATH}` | SOT #2 — HOW TO VERIFY |
| **Architecture** | `{ARCH_PATH}` | Structural reference (optional) |

## Phase Overview

| Phase | Name | Prerequisites | Gate |
|-------|------|---------------|------|
| 1 | {Phase Name} | None | {Concrete, testable gate summary} |
| 2 | {Phase Name} | Phase 1 | {Concrete, testable gate summary} |
| 3 | {Phase Name} | Phase 2 | {Concrete, testable gate summary} |
| ... | ... | ... | ... |

---

## Phase 1: {Phase Name}

### Prerequisites
- None (first phase)

### Ordering
- Parallel: {List of independent spec sections / subsystem names}
- Sequential: {A} → {B} → {C} (with brief dependency reason if non-obvious)

### Domain Batches (if applicable)
| Batch | Items | Approximate Scope |
|-------|-------|-------------------|
| 1 | {domain names} | ~{N} items |
| 2 | {domain names} | ~{N} items |

### Gate Criteria
- {Concrete criterion referencing TDD test IDs where possible}
- {Concrete criterion}
- {Concrete criterion}

### Roll Back If
- {Condition that means assumptions are wrong — stop and reassess}

---

## Phase 2: {Phase Name}

### Prerequisites
- Phase 1 gate passed
- {Any additional prerequisites}

### Ordering
- Parallel: {spec section refs}
- Sequential: {ordering with dependency reasons}

### Gate Criteria
- {criteria}

### Roll Back If
- {condition}

---

{... repeat for each phase ...}

---

## Completeness Mapping

| Spec Section | Phase | Notes |
|-------------|-------|-------|
| §1 | 1 | |
| §2.1-2.3 | 1 | |
| §3 | 2 | |
| §4.1-4.5 | 3 | |
| ... | ... | ... |

**Coverage:** {N}/{N} spec sections mapped (100%)

## Dependency Diagram

```
Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4
                │
                └──── Phase 2a (parallel track)
```

## Phase Gates Summary

| Phase | Gate | Roll Back If |
|-------|------|-------------|
| 1 | {gate} | {condition} |
| 2 | {gate} | {condition} |
| 3 | {gate} | {condition} |
```

---

## Template Notes

### Sizing Guide

| Feature Scale | Phases | Strategy Length |
|--------------|--------|---------------|
| Small (1-5 subsystems) | 2-3 | ~200-400 lines |
| Medium (5-15 subsystems) | 3-5 | ~400-600 lines |
| Large (15-30 subsystems) | 5-8 | ~600-800 lines |
| Very Large (30+ subsystems) | 6-10 | ~800-1000 lines |

### What Goes Where

| Content Type | Where It Lives | In Strategy? |
|-------------|---------------|-------------|
| Feature description | Spec | No |
| Implementation details | Spec | No |
| Test specifications | TDD | No |
| Test assertions | TDD | No |
| Acceptance criteria | Spec | No |
| Code examples | Spec / Architecture | No |
| Effort estimates | Nowhere (unreliable) | No |
| Phase ordering | **Strategy** | Yes |
| Dependencies | **Strategy** | Yes |
| Gate criteria | **Strategy** | Yes |
| Domain batches | **Strategy** | Yes |
| Completeness mapping | **Strategy** | Yes |
| Rollback criteria | **Strategy** | Yes |
