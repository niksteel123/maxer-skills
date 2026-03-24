# Intent-to-Handoff — Output Prompt Templates

Three templates covering the major handoff types. Select based on the task type identified in Phase 1. Each template includes the structural skeleton with guidance for what content goes in each section.

---

## Template Selection Guide

| Task Type | Template | When to Use |
|-----------|----------|-------------|
| Feature | A | New functionality, adding capabilities, building components |
| Bug | B | Investigating and fixing broken behavior |
| Refactor/Migration | C | Restructuring code, changing patterns, migrating libraries |
| Research | A (modified) | Deep exploration tasks — omit Implementation phase, expand Research |

---

## Template A: Feature Implementation Handoff

Use for new features, enhancements, and capability additions. The largest template — includes research, design, and implementation phases.

```markdown
# {Feature Name} — Research + Implementation Handoff

ULTRATHINK and be meticulous.

## MISSION

{One paragraph: What to build, why it matters, and the single most critical
constraint or warning about the codebase. This paragraph should be specific
enough that reading ONLY this section gives a clear picture of the task.}

{One sentence: scope boundary — what is explicitly OUT of scope.}

---

## PHASE 1: DEEP RESEARCH (mandatory before any implementation)

Do NOT write any code until you have completed this entire research phase.

### 1A. {Area Name} — {Why this area matters}

Read and fully understand:
- `{file/path/one.ts}` — {what this file does, what to focus on}
- `{file/path/two.ts}` — {what this file does, what to focus on}

You must be able to answer:
1. {Understanding checkpoint question about how this area works}
2. {Understanding checkpoint question about key design decisions}
3. {Understanding checkpoint question about integration points}

Key types (embedded from source):
```{language}
{Actual type definitions copied from the codebase — the critical types
 that the feature will use or extend. NOT just "see types.ts" but the
 actual shapes.}
`` `

### 1B. {Area Name} — {Why this area matters}

Read and fully understand:
- `{file/path/three.ts}` — {focus area}

You must be able to answer:
1. {Checkpoint question}
2. {Checkpoint question}

Key API signatures:
```{language}
{Actual function signatures and their contracts}
`` `

### 1C. {Existing Patterns} — {What to follow}

Study these existing implementations as models:
- `{file/path/example.ts}` — {what pattern this demonstrates}

Note how the codebase handles: {specific patterns like error handling,
event emission, state management, etc.}

---

## PHASE 2: ANALYSIS & DESIGN

{Brief guidance on what to think about before implementing.}

### Feature: {Feature Name 1}

**Concept**: {Description of what this feature does, with a diagram if the
interaction is complex}

**Questions to resolve during research**:
- {Question about architectural approach}
- {Question about edge cases}

**Implementation considerations**:
- {Layer/module guidance — where the code should live}
- {Pattern to follow from existing code}
- {Integration points to wire up}

### Feature: {Feature Name 2}

{Same pattern as above — repeat for each distinct feature or component}

---

## PHASE 3: IMPLEMENTATION

### Approach
{High-level sequencing — what to build first, what depends on what}

### Rules
- {Specific coding rule from CLAUDE.md or conventions}
- {Specific rule about the framework or library}
- {Specific rule about test expectations}

### File Organization
- New files should go in: `{path/}`
- Follow naming convention: `{pattern}`
- Tests should go in: `{test/path/}`

---

## CONSTRAINTS

1. {Specific constraint — e.g., "All WebSocket messages use CBOR encoding, not JSON. New message types must implement CborSerialize."}
2. {Specific constraint — e.g., "The transport layer cannot import from the UI layer. Dependencies flow downward only."}
3. {Specific constraint — e.g., "Backward compatibility: the existing FooClient API must not change."}
{... number as needed, typically 4-8}

---

## DELIVERABLES

1. {Concrete output — e.g., "New file `src/transport/reconnect.ts` implementing the ReconnectionManager class"}
2. {Concrete output — e.g., "Updated `src/transport/ws.ts` to use ReconnectionManager"}
3. {Concrete output — e.g., "Unit tests in `src/transport/__tests__/reconnect.test.ts` covering: happy path, max retries, backoff timing"}
4. {Concrete output — e.g., "Integration test verifying reconnection after server restart"}
{... number as needed}

---

## VERIFICATION

1. Run tests: `{test command}`
2. {Visual/manual check if applicable — e.g., "Open the app, disconnect the server, verify reconnection within 5s"}
3. {Type check: `{typecheck command}`}
4. {Build check: `{build command}`}

---

## REMINDERS

- ULTRATHINK and take your time. Read thoroughly before implementing.
- {Critical gotcha — e.g., "The EventBus uses WeakRefs — listeners must be stored as class properties, not inline lambdas."}
- {Critical gotcha — e.g., "Tests run in parallel by default. Avoid shared mutable state."}
- {Non-negotiable from project conventions}
- Do NOT skip the research phase. Understanding the existing architecture prevents costly refactors.
```

**Section guidance**:
- MISSION: 3-5 sentences max. Must work standalone.
- RESEARCH: Group files logically (by module, by concern). 2-5 files per group. Always include checkpoint questions — at least 2 per group.
- EMBEDDED TYPES: Copy actual type definitions. Include field-level comments if they exist. If a type is very large (>40 lines), include only the relevant subset with a note about where to find the rest.
- CONSTRAINTS: Must be specific and testable. Each constraint should answer: "What would a violation look like?"
- DELIVERABLES: Must be enumerable. "Improve performance" is not a deliverable. "Reduce WebSocket reconnection time to <2s" is.

---

## Template B: Bug Investigation Handoff

Use for debugging and fixing broken behavior. Emphasizes symptoms, tracing, and hypothesis-driven investigation.

```markdown
# {Bug Description} — Investigation + Fix Handoff

ULTRATHINK and be meticulous.

## MISSION

{What is broken, who is affected, and what the correct behavior should be.
Include reproduction steps if known. Note the severity/impact.}

---

## SYMPTOMS

- **Observed behavior**: {What actually happens}
- **Expected behavior**: {What should happen}
- **Reproduction**: {Steps to reproduce, or "intermittent — see conditions below"}
- **Error messages/stack traces** (if available):
```
{Actual error messages or stack traces}
`` `
- **Environment**: {Browser/OS/version where observed, if relevant}

---

## RESEARCH PHASE

### Understand the Affected System

Read these files to understand how the system is supposed to work:
- `{file/path.ts}` — {what to understand}

You must be able to answer:
1. {What is the normal flow for this operation?}
2. {What error handling exists?}

### Trace the Bug Path

Follow the execution path that triggers the bug:
1. Start at `{entry_point_file.ts}:{function_name}` — this is where the user action enters
2. Trace through `{middle_file.ts}:{function_name}` — data transformation happens here
3. The bug likely manifests at or before `{suspect_file.ts}:{function_name}`

Key functions to examine:
```{language}
{Function signatures in the trace path}
`` `

### Related Recent Changes

{Git context — recent commits that touched the affected area.
Include commit hashes and one-line descriptions if available.}

---

## HYPOTHESIS SPACE

Ranked by likelihood:

1. **{Most likely cause}** — {Why this is likely, what evidence points to it}
2. **{Second most likely}** — {Why, evidence}
3. **{Third possibility}** — {Why, evidence}

---

## FIX CONSTRAINTS

1. {What must NOT change — e.g., "The public API of FooService must remain identical"}
2. {Backward compatibility requirement}
3. {Performance constraint — e.g., "Fix must not add >1ms to the hot path"}

---

## DELIVERABLES

1. {Root cause identification with explanation}
2. {Fix implementation in {file(s)}}
3. {Regression test that fails before fix, passes after}
4. {Verification that existing tests still pass}

---

## VERIFICATION

1. Reproduce the bug: {reproduction steps}
2. Apply the fix
3. Verify the bug is fixed: {expected behavior after fix}
4. Run test suite: `{test command}`
5. {Any additional verification}

---

## REMINDERS

- ULTRATHINK and investigate thoroughly before jumping to a fix.
- {Critical gotcha about the affected area}
- Confirm the root cause before writing any fix code.
- The regression test is as important as the fix itself.
```

---

## Template C: Refactor / Migration Handoff

Use for restructuring code, changing patterns, migrating libraries, or large-scale code modifications. Emphasizes current state, target state, and incremental migration path.

```markdown
# {Refactor Description} — Migration Handoff

ULTRATHINK and be meticulous.

## MISSION

{What is being refactored/migrated, why (the pain point), and what the
target state looks like. Note whether this is incremental or big-bang.}

---

## CURRENT STATE

### Architecture
{Describe the current architecture with file paths and key types.
Include a simple ASCII diagram if the relationships are complex.}

```
{ASCII diagram of current architecture — modules, data flow, dependencies}
`` `

Key types in current state:
```{language}
{Current type definitions that will change}
`` `

### Pain Points
- {Why this refactor is needed — specific pain point 1}
- {Specific pain point 2}
- {Specific pain point 3}

---

## TARGET STATE

### Desired Architecture
{Describe the target architecture. Be specific about what changes.}

```
{ASCII diagram of target architecture}
`` `

Target types:
```{language}
{What the types should look like after migration}
`` `

### Key Differences
| Aspect | Current | Target |
|--------|---------|--------|
| {aspect} | {current approach} | {target approach} |
| {aspect} | {current approach} | {target approach} |

---

## MIGRATION PATH

{Step-by-step migration approach. Each step should be independently
verifiable — the codebase should work after each step.}

### Step 1: {Description}
- Files affected: {list}
- What changes: {description}
- Verification: {how to confirm this step worked}

### Step 2: {Description}
- Files affected: {list}
- What changes: {description}
- Verification: {how to confirm}

{Continue for each step...}

---

## RESEARCH PHASE

### Understand Current Implementation
- `{file.ts}` — {what to understand}

### Find All Consumers
{Critical for refactors — every consumer of the affected API must be updated.}
- Search for: `{import pattern or function name}`
- Known consumers:
  - `{consumer_file.ts}` — uses {what}

You must be able to answer:
1. {How many places use the current API?}
2. {Are there any external consumers (other packages, published APIs)?}

---

## CONSTRAINTS

1. {Incremental migration: the app must work after each step}
2. {Backward compatibility window — e.g., "Old API must work for 1 release cycle"}
3. {No feature regression — all existing behavior must be preserved}

---

## DELIVERABLES

1. {Migrated files with new architecture}
2. {Updated consumers}
3. {Deprecated old code (if keeping for compatibility) with removal timeline}
4. {Updated/new tests validating the new architecture}
5. {Migration guide or changelog entry if applicable}

---

## VERIFICATION

1. All existing tests pass: `{test command}`
2. New tests for migrated code pass: `{test command}`
3. {Visual/manual verification if applicable}
4. No TypeScript/lint errors: `{typecheck command}`

---

## REMINDERS

- ULTRATHINK and plan each migration step carefully.
- {Critical gotcha about the migration}
- Test after EVERY step, not just at the end.
- If you discover an unexpected consumer, add it to the migration plan before proceeding.
```

---

## Template Customization Notes

- **Omit sections** that don't apply — a simple bug fix doesn't need a "TARGET STATE" section. A pure research handoff doesn't need "IMPLEMENTATION".
- **Add sections** for domain-specific needs — e.g., a UI feature might need a "DESIGN REFERENCE" section with screenshots or mockup descriptions.
- **Combine templates** if the task spans types — e.g., a feature that also requires refactoring existing code can use Template A structure with a "MIGRATION" subsection.
- **Scale length** to task complexity — don't pad a simple task to fill the template. Remove unnecessary sections entirely rather than leaving them sparse.
