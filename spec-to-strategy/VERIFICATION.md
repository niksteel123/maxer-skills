# Strategy Verification

How to verify a strategy document is complete, correct, and drift-free.

---

## Verification Checklist

### 1. Structural Checks

- [ ] Single document (not multiple phase files)
- [ ] Source documents section links to spec and TDD
- [ ] Phase overview table exists with prerequisites and gates
- [ ] Every phase has ordering, gate criteria, and rollback criteria sections
- [ ] Completeness mapping exists
- [ ] Dependency diagram exists

### 2. Completeness Checks

- [ ] Every spec section maps to exactly one phase in completeness mapping
- [ ] No spec sections silently dropped
- [ ] Every TDD test has a phase home (through the spec section it tests)
- [ ] All phases have gate criteria

### 3. Drift Checks (Critical)

These are the most important checks. The strategy must NOT contain:

- [ ] **No task descriptions** — Items are named by spec section reference, not described
- [ ] **No effort estimates** — No complexity ratings, time estimates, or sizing
- [ ] **No per-task test mappings** — Gates reference TDD test ID ranges, not per-item test files
- [ ] **No acceptance criteria** — Those live in the spec
- [ ] **No implementation guidance** — No code snippets, architecture advice, or "how to" content
- [ ] **No spec content duplication** — Strategy doesn't restate what the spec says
- [ ] **No per-task file paths** — File-level concerns belong in beads, not strategy

### 4. Quality Checks

- [ ] Gate criteria are concrete and testable (not "all tests pass")
- [ ] Rollback criteria identify genuine assumption-breaking conditions
- [ ] Parallel/sequential classification is correct (no false parallelism)
- [ ] Prerequisites accurately reflect real dependencies
- [ ] Domain batches (if present) have reasonable groupings
- [ ] Document is <=1000 lines (target 500-800)

---

## Verification Process

### Step 1: Read the Strategy Standalone

Read the strategy without the spec open. Ask:
- Can I tell WHAT ORDER to build things? (Should be yes)
- Can I tell WHAT to build in detail? (Should be no — that's spec's job)
- Can I write code from just this document? (Should be no)

If you can understand implementation details from the strategy alone, it's duplicating the spec.

### Step 2: Cross-Reference Spec Sections

Open the spec's table of contents. For each section:
1. Find it in the completeness mapping
2. Verify it maps to the correct phase
3. Confirm the strategy doesn't restate the section's content

### Step 3: Cross-Reference TDD Tests

Open the TDD test list. For each test:
1. Identify which spec section it tests
2. Confirm that spec section has a phase
3. Verify gate criteria reference the right TDD test ID ranges

### Step 4: Check for Creeping Content

Search the strategy for these red flags:
- Sentences longer than ~20 words in ordering sections (likely descriptions)
- Bullet points that explain HOW rather than WHAT ORDER
- Any mention of specific types, functions, or code patterns
- Any mention of time/effort ("~2 weeks", "medium complexity")

---

## Common Verification Failures

### Failure: Strategy has "Implementation Details" sections
**Fix:** Remove entirely. That content belongs in the spec.

### Failure: Gate criteria invent new tests
**Fix:** Replace with TDD test ID references. If the TDD doesn't have the right tests, fix the TDD first.

### Failure: Strategy is over 1000 lines
**Fix:** Check for task descriptions, implementation guidance, or test specifications. Remove them — they belong in spec or TDD.

### Failure: Spec section missing from completeness mapping
**Fix:** Either map it to a phase or explicitly note it as non-implementation (e.g., "§1 Executive Summary — context only").

### Failure: Effort estimates present
**Fix:** Remove all estimates. They're unreliable and bias scope decisions. The strategy should be effort-agnostic.

---

## Post-Creation Workflow

After the strategy is verified:

1. **Create beads** directly from Spec + TDD + Strategy
   - Bead CONTENT comes from spec + TDD (verbatim)
   - Strategy provides phase context and ordering only
   - Each bead embeds its relevant spec sections and TDD test assertions

2. **Optimization pass** checks every bead against the spec for drift:
   - "Does this bead faithfully represent the spec?"
   - NOT "Is this bead internally consistent?" (that misses silent drops)
