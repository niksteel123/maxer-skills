# Scope Definition Guide

> How to define extraction scope for the codebase-to-spec skill.

---

## Core Principle

**SCOPE DEFINES QUALITY.** A well-scoped extraction produces a focused, actionable spec. A poorly-scoped extraction produces a shallow, overwhelming document that helps nobody.

---

## Scope Modes

### Mode 1: Whole-Project

**Trigger phrases:**
- "Extract spec from this codebase"
- "Reverse-engineer this entire project"
- "Create a complete spec for this system"

**What it covers:**
- Every module/package in the project
- All public APIs and interfaces
- Complete data model
- All external integrations
- Full operational surface

**Output organization:**
- Organized by module/subsystem within the unified document
- Top-level overview section spanning all modules
- Cross-module data flows documented

**Size heuristics:**
- Projects <100 files: straightforward, use STANDARD depth
- Projects 100-500 files: moderate, use STANDARD depth, may need 2 sessions
- Projects >500 files: recommend Module-Targeted mode first, then aggregate

**When to recommend splitting:**
```
IF project_files > 500:
  SUGGEST: "This is a large project. I recommend extracting module-by-module.
           Which module should we start with?"

IF project_has_clear_modules AND module_count > 8:
  SUGGEST: "This project has {N} distinct modules. Shall I extract the core
           modules first, or focus on a specific subsystem?"
```

---

### Mode 2: Module-Targeted

**Trigger phrases:**
- "Extract spec for `packages/auth/`"
- "Spec the database layer"
- "Reverse-engineer the WebSocket module"

**What it covers:**
- All files within the target module/directory
- The module's public API surface (what it exports)
- Internal implementation within the module
- **Boundary contracts** — how this module connects to the rest of the system

**Boundary contracts section (REQUIRED for module-targeted):**
```markdown
## Boundary Contracts

### Inbound Dependencies (what calls INTO this module)
| Caller | Interface Used | Purpose |
|--------|---------------|---------|
| {module} | {function/type} | {why} |

### Outbound Dependencies (what this module calls OUT to)
| Dependency | Interface Used | Purpose |
|-----------|---------------|---------|
| {module} | {function/type} | {why} |

### Shared Types
| Type | Defined In | Used By |
|------|-----------|---------|
| {type} | {module} | {modules} |
```

**Scope boundary rules:**
- Include all files directly within the target directory (recursive)
- Include type definitions imported from other modules (document, don't extract)
- Include integration tests that test this module
- Exclude files from other modules (even if they call this one)

---

### Mode 3: Feature-Targeted

**Trigger phrases:**
- "Extract spec for the real-time collaboration feature"
- "Spec the user authentication flow"
- "Reverse-engineer how payments work"

**What it covers:**
- All files involved in the feature, across ALL modules
- The end-to-end data flow for the feature
- All touchpoints where the feature intersects with other features

**Feature tracing protocol:**
```
Step 1: ENTRY POINT IDENTIFICATION
  - Find the user-facing entry point (route, UI component, CLI command)
  - Search for keywords related to the feature

Step 2: FORWARD TRACE
  - From entry point, trace all function calls downstream
  - Follow data through services, repositories, external calls
  - Map the complete request→response path

Step 3: EVENT TRACE
  - Find all events/messages emitted by this feature
  - Trace event handlers and side effects

Step 4: BOUNDARY MARKING
  - For each file touched, determine if it's:
    - CORE: primarily exists for this feature
    - SHARED: used by multiple features (extract interface only)
    - PERIPHERAL: tangentially related (note but don't deep-extract)
```

**Output organization:**
- Organized by feature flow, not by module
- Start with end-to-end flow diagram
- Requirements grouped by user action/scenario

---

## Depth Auto-Detection

The skill auto-detects extraction depth based on project characteristics:

```
DEPTH SELECTION ALGORITHM:

IF user explicitly requests a depth:
  USE user's choice

ELSE IF scope_mode == "feature-targeted":
  IF feature_files < 20:  USE DEEP
  ELSE:                    USE STANDARD

ELSE IF scope_mode == "module-targeted":
  IF module_files < 30:   USE DEEP
  ELSE IF module_files < 100: USE STANDARD
  ELSE:                    USE STANDARD (warn about size)

ELSE IF scope_mode == "whole-project":
  IF total_files < 50:    USE DEEP
  ELSE IF total_files < 200: USE STANDARD
  ELSE:                    USE STANDARD (recommend module split)
```

### Depth Definitions

**SURFACE** (~500-1500 lines output):
- Directory structure and module layout
- Public API signatures (no implementation detail)
- Type/schema definitions (fields only, no validation logic)
- High-level data flow (entry→exit, no intermediate steps)
- External dependencies list
- Suitable for: initial overview, very large codebases, quick orientation

**STANDARD** (~2000-4000 lines output):
- Everything in SURFACE, plus:
- Data flow step-by-step with error handling at each step
- Validation rules and constraint logic
- State machines with transition conditions
- Security model (auth checks, permission patterns)
- Configuration surface (env vars, feature flags)
- 3-5 end-to-end data flow traces
- Suitable for: most projects, module extraction, feature specs

**DEEP** (~4000-8000+ lines output):
- Everything in STANDARD, plus:
- Internal algorithms and business logic
- Performance characteristics and optimization patterns
- Concurrency model (locks, channels, async patterns)
- Edge cases and boundary conditions
- Operational concerns (logging, metrics, health checks)
- Migration and upgrade paths
- Complete error taxonomy with recovery strategies
- ALL end-to-end data flows (not just 3-5)
- Suitable for: critical systems, complete reproduction specs, small focused codebases

---

## Scope Negotiation

If the user's scope request is ambiguous, use `AskUserQuestion`:

```
Question: "I see several ways to scope this extraction. Which fits your goal?"

Options:
A) Whole project — extract everything (~{N} files, estimated {depth} depth)
B) Module: {module_name} — just the {module_description} (~{N} files)
C) Feature: {feature_name} — trace the {feature} across all modules (~{N} files)

Why this matters: Scope determines both quality and completion time.
```

**Maximum 1 scope question.** If still unclear after one question, default to the most conservative interpretation (smaller scope) and note what was excluded.

---

## Scope Change Mid-Extraction

During extraction, if you discover the scope needs adjustment:

```
IF discovered_scope > original_scope:
  Document what you found that's out of scope
  Add to Reconciliation Notes: "Feature X extends beyond {module} into {other_module}"
  Continue with original scope but note the boundary

IF discovered_scope < original_scope:
  The module is smaller than expected
  Consider upgrading depth (STANDARD → DEEP)
  Fill remaining capacity with deeper analysis
```

---

## Scope Documentation Template

At the start of every extraction, document the scope:

```markdown
## Extraction Scope

**Mode:** {Whole-Project | Module-Targeted | Feature-Targeted}
**Depth:** {Surface | Standard | Deep} (auto-detected | user-specified)
**Target:** {path or feature description}

**In Scope:**
- {directory/file/feature 1}
- {directory/file/feature 2}

**Out of Scope:**
- {what's excluded and why}

**Boundary Notes:**
- {any boundary contracts or cross-cutting concerns to watch}
```
