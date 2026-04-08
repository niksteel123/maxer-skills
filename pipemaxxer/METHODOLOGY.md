# Pipemaxxer — Methodology

## Overview

Pipemaxxer runs in 4 phases to generate the complete handoff chain:

```
Phase 0: DETECT    — What exists? What's the entry point? What's the tech stack?
Phase 1: RESEARCH  — Deep codebase study via subagents (ULTRATHINK)
Phase 2: MANIFEST  — Determine all output paths, write manifest
Phase 3: GENERATE  — Write every handoff file with feature-specific context
Phase 4: OUTPUT    — Write execution guide, report to user
```

---

## Governing Principle: ZERO SCOPE DRIFT at Every Phase

The research doc provided to pipemaxxer has already been deeply iterated on. It IS the source of truth. Every phase of this methodology must preserve 100% of its feature surface. No phase may silently reduce scope.

**Every CREATE handoff must include:**
- Explicit instruction: "The research doc/spec defines what to build. You may improve HOW, resequence WHEN, but NEVER reduce WHAT."
- A mandatory follow-up scope-preservation check

**Every OPTIMIZE handoff must include:**
- A dedicated scope-drift scan for red-flag language ("post-MVP", "Phase 2+", "stretch goal", "nice to have", "deferred", "out of scope", "future iteration", "simplified for initial")
- A coverage verification: enumerate spec features → verify all present in target document

**Every AUDIT handoff must include:**
- A blocking scope-drift dimension: if ANY spec feature has zero coverage, the audit FAILS

This is not optional guidance — it is embedded into every handoff file that pipemaxxer generates.

---

## Phase 0: Detect Context (5-10 minutes)

### Step 0.1: Read the Source Document

Read the provided source doc (`$ARGUMENTS[0]`) completely. Determine:

- **Document type**: Is this a research doc or an existing spec?
  - Research doc indicators: "Research Document", exploratory language, multiple options evaluated, "Key Findings" sections, no requirement IDs
  - Spec indicators: "Specification", requirement IDs (FR-X.Y.Z), acceptance criteria bullets, subsystem numbering, success criteria table
  - Layer doc indicators: "Layer X", subsystem inventory, success criteria, cross-layer references

- **Feature name**: Extract a short slug for file naming (e.g., `unified-method-registry`, `layer-3-mesh`)

- **Feature scope**: What does this feature/layer touch? What's the domain?

### Step 0.2: Detect What Already Exists

Search the repo for existing pipeline artifacts:

```bash
# Check for existing spec
find . -path "*/specs/*" -name "*{feature}*" -type f 2>/dev/null

# Check for existing TDD
find . -path "*tdd*" -name "*{feature}*" -type f 2>/dev/null

# Check for existing strategy
find . -path "*strategy*" -name "*{feature}*" -type f 2>/dev/null

# Check for existing beads
bd list --json 2>/dev/null | head -5  # or br list --json

# Check for existing kickoff
find docs/plan-hub/prompts -name "*{feature}*" -type f 2>/dev/null
```

### Step 0.3: Determine Entry Point

| Found | Entry Point |
|-------|------------|
| Nothing (research doc input) | Batch 1: Create Spec |
| Nothing (spec/layer doc input) | Batch 1*: Validate Spec |
| Spec exists, no TDD | Batch 2: Create TDD |
| Spec + TDD exist, no strategy | Batch 3: Create Strategy |
| Spec + TDD + strategy, no beads | Batch 4: Create Beads |
| All + beads, not audited | Batch 5: Audit Beads |
| All + audited beads | Batch 6: Generate Kickoff |

If ambiguous, ASK the user: "I found {X} at {path}. Should I use it or regenerate?"

### Step 0.4: Detect Tech Stack

```bash
# Rust
ls Cargo.toml 2>/dev/null && echo "RUST"

# TypeScript/JavaScript
ls package.json 2>/dev/null && echo "TS/JS"
ls bun.lockb 2>/dev/null && echo "BUN"

# Python
ls pyproject.toml setup.py requirements.txt 2>/dev/null && echo "PYTHON"

# Go
ls go.mod 2>/dev/null && echo "GO"
```

Determine:
- Build commands (cargo build, bun run build, etc.)
- Test commands (cargo test, bun run test, pytest, etc.)
- Lint commands (cargo clippy, bun run lint, ruff, etc.)
- Test framework (Rust #[test], Vitest, pytest, Go testing, etc.)

### Step 0.5: Detect Bead CLI

```bash
which br 2>/dev/null && echo "br"
which bd 2>/dev/null && echo "bd"
```

Check AGENTS.md or CLAUDE.md for preferred bead CLI.

### Step 0.6: Detect Coordination

```bash
# AgentMail
curl -s http://127.0.0.1:8765/health/liveness 2>/dev/null && echo "AGENTMAIL"

# Check for AGENTS.md
ls AGENTS.md 2>/dev/null && echo "AGENTS_MD"
```

---

## Phase 1: Deep Codebase Research (15-30 minutes)

**This is what makes pipemaxxer different from template-stamping.** Launch 2-4 Explore subagents in parallel to study the codebase deeply. Use ULTRATHINK.

### Subagent 1: Project Structure + Key Files

Research questions:
- What's the directory structure? (src/, crates/, packages/, apps/)
- Where does this feature's code live or will live?
- What are the key files the feature touches?
- What existing modules are nearby?
- Line counts for key files (to gauge complexity)

### Subagent 2: Integration Surface

Research questions:
- What APIs/types does this feature interact with?
- What's the wire format? (JSON, CBOR, protobuf, etc.)
- What service methods will be called?
- What existing patterns should new code follow?
- What types cross boundaries? (List actual type names and fields)

### Subagent 3: Test Infrastructure

Research questions:
- What test framework is used? (cargo test, Vitest, pytest, etc.)
- Where do tests live? (tests/, __tests__/, *_test.go, etc.)
- What mock/stub patterns exist?
- What E2E infrastructure exists? (Playwright, Cypress, etc.)
- What CI configuration exists?

### Subagent 4: Existing Docs + Prior Art

Research questions:
- What other specs/TDDs/layer docs exist? (quality bar reference)
- What's the doc structure convention? (thoughts/specs/, docs/, etc.)
- Are there existing handoff prompts? (reference for style)
- What's in AGENTS.md / CLAUDE.md? (project conventions)
- Are there layer docs for context? (prior layers, architecture)

### Build Feature Context Object

After subagents return, synthesize into a structured context:

```yaml
feature_context:
  name: "{feature-slug}"
  source_doc: "{path}"
  source_type: "research|spec|layer"
  entry_point: "batch-1|batch-2|batch-3|..."

  tech_stack:
    language: "rust|typescript|python|go|mixed"
    build_cmd: "{command}"
    test_cmd: "{command}"
    lint_cmd: "{command}"
    test_framework: "{name}"

  bead_cli: "br|bd"
  agentmail: true|false
  agents_md: true|false

  key_files:
    - path: "{path}"
      description: "{what it does}"
      lines: {N}
    # ... up to 15-20 key files

  key_types:
    - name: "{TypeName}"
      location: "{path}"
      relevance: "{why this matters}"
    # ... key types/structs/traits

  integration_surface:
    - "{description of API/boundary}"
    # ...

  existing_docs:
    specs: ["{paths}"]
    tdds: ["{paths}"]
    layer_docs: ["{paths}"]
    architecture: ["{paths}"]
    quality_bar: "{path to best existing TDD/spec for reference}"

  conventions:
    doc_dir: "{where docs go}"
    spec_dir: "{where specs go}"
    test_dir: "{where tests go}"
    handoff_dir: "{where handoffs go}"
```

This context object is embedded into every handoff file.

---

## Phase 2: Generate Manifest (2-3 minutes)

Determine all output paths using convention or detected patterns:

```yaml
# {feature}-pipeline/manifest.yaml
feature: "{name}"
created: "{date}"
source_doc: "{path}"
source_type: "{research|spec|layer}"
entry_point: "{batch-N}"

paths:
  spec: "{detected_spec_dir}/{feature}-spec.md"
  architecture: "{detected_spec_dir}/{feature}-architecture.md"
  tdd: "{detected_spec_dir}/{feature}-tdd.md"
  bootstrap: "{detected_spec_dir}/{feature}-bootstrap.md"
  strategy: "{detected_spec_dir}/{feature}-strategy.md"
  kickoff: "docs/plan-hub/prompts/{feature}-kickoff.md"
  push: "docs/plan-hub/prompts/{feature}-push.md"
  status: "docs/plan-hub/status/{feature}.yaml"

bead_prefix: "{prefix}"
bead_cli: "{br|bd}"

tech_stack:
  language: "{lang}"
  build_cmd: "{cmd}"
  test_cmd: "{cmd}"
  lint_cmd: "{cmd}"

handoff_dir: "{feature}-pipeline"
```

---

## Phase 3: Generate Handoffs (30-60 minutes)

For each batch from the entry point onward, generate the handoff files. Each handoff follows the structure defined in TEMPLATES.md but with feature-specific content from the feature context.

### Per-Handoff Generation Process

For each handoff file:

1. **Select template** from TEMPLATES.md based on handoff type (create, optimize, audit, kickoff, etc.)

2. **Fill in feature context**:
   - Replace path placeholders with manifest paths
   - Embed relevant key_files from feature context
   - Embed relevant key_types from feature context
   - Add tech-stack-specific commands (build, test, lint)
   - Name the exact skill to invoke (from the mapping table in SKILL.md)

3. **Write step-by-step workflow** (CRITICAL — not just "invoke the skill"):
   Every create handoff must have numbered steps the agent follows:
   ```
   ## Step-by-Step Workflow

   ### Step 0: Read Source Documents (MANDATORY)
   Read these IN THIS ORDER before doing anything:
   1. {source_doc} — READ FULLY ({description})
   2. {context_doc} — SKIM ({description})
   ...

   ### Step 1: Invoke the Skill
   Run `/{skill_name}` with these inputs:
   - Source: {path}
   - Output: {path}

   ### Step 2: {Feature-Specific Guidance}
   While the skill runs, pay attention to:
   - {specific thing from codebase research}
   - {specific thing from codebase research}

   ### Step 3: Verify Output
   After the skill completes:
   - [ ] Output file exists at {path}
   - [ ] {Feature-specific verification}

   ### Step 4: Follow-Up Pass (Sub-Optimization)
   {The sub-optimization content — see below}
   ```

4. **Write sub-optimization** (for create and optimize handoffs):
   - This is the CREATIVE part — it must be feature-specific
   - Reference actual codebase files from the feature context
   - Reference actual type names and method counts
   - Ask verification questions that only make sense for THIS feature
   - Example: "Open `dispatch/mod.rs` — does the spec account for all 226 methods?" (not "verify completeness")

5. **Write the handoff file** to the output directory

### Handoff Quality Rules

- Every handoff must name the exact skill to invoke (or say "no skill — manual work")
- Every handoff must have a numbered step-by-step workflow (not just context + "invoke skill")
- Every handoff must list source docs with read/skim/reference annotations
- Every sub-optimization must reference at least 3 actual codebase files
- Every optimize handoff must have at least 5 feature-specific verification questions
- No handoff may contain the word "TODO" or "placeholder"
- Path references must be absolute or relative to project root (no "find the file")

### Scope-Preservation Rules (MANDATORY for every handoff)

- Every CREATE handoff (01, 03, 05, 07) must include the Cardinal Rule: "If it's in the research doc, it gets implemented. No exceptions."
- Every CREATE handoff must include a follow-up scope-preservation check that enumerates research doc features and verifies coverage
- Every OPTIMIZE handoff (02, 04, 06, 08) must include a scope-drift scan: search for "post-MVP," "Phase 2+," "stretch goal," "nice to have," "deferred," "out of scope," "future iteration," "simplified for initial implementation"
- Every OPTIMIZE handoff must include a coverage verification: "enumerate every feature/subsystem in the spec → verify each appears in the target document"
- The strategy handoff (05-06) must explicitly state: "Phases are execution ORDER, not importance tiers. Later phases get the SAME depth as early phases. Every phase ships."
- The beads handoff (07-08) must explicitly state: "100% spec coverage is MANDATORY. If any spec feature has zero corresponding beads, this is a BLOCKING failure."
- The audit handoff (09) must include scope-drift as a dedicated, blocking audit dimension
- The kickoff handoff (10) must include the full bead graph — covering ALL spec features, not a subset

---

## Phase 3.5: Enrichment Pass Instructions

The execution guide must include enrichment instructions between batches. After each batch completes, the user (or an agent) reads the newly created artifact and updates subsequent handoff files with specific data.

### What Gets Enriched

**After Batch 1 (spec created):**
- Read the spec. Extract: requirement ID range, subsystem count, key section names, total requirements count
- Update handoffs 03+ with: "The spec has {N} requirements across {N} subsystems. Key areas: {list}. Requirement IDs range from {first} to {last}."
- Update sub-optimizations in 03+ with spec-specific verification questions

**After Batch 2 (TDD created):**
- Read the TDD. Extract: test ID range, total test count (by type), CI tier distribution, coverage matrix summary
- Update handoffs 05+ with: "The TDD has {N} tests ({UT}/{IT}/{E2E}). Coverage matrix maps {N} spec requirements to test IDs."
- Update strategy handoff gate criteria with actual TDD test IDs

**After Batch 3 (strategy created):**
- Read the strategy. Extract: phase names, phase count, tasks per phase, gate criteria
- Update handoffs 07+ with: "The strategy has {N} phases. Phase ordering: {list}. Expected bead count: ~{N}."
- Update beads handoff with phase-to-epic mapping

**After Batch 4 (beads created):**
- Read bead inventory. Extract: bead prefix, total count, ready count, phase distribution
- Update handoffs 09+ with: "Bead prefix: {prefix}. Total: {N}. Per phase: {breakdown}."
- Update audit handoff with expected coverage numbers

### Enrichment Execution

The enrichment is a 5-minute task. In the EXECUTION-GUIDE.md, between each batch:

```markdown
### Enrichment: Update Subsequent Handoffs

After Batch {N} completes, read the newly created {artifact} and update
subsequent handoff files:

1. Read {artifact_path}
2. Extract: {what to extract}
3. Edit handoffs {range} — replace generic references with specific data:
   - "{ENRICHMENT: spec metadata}" → actual requirement counts, IDs, subsystems
   - "{ENRICHMENT: tdd metadata}" → actual test counts, IDs, coverage summary
   - "{ENRICHMENT: strategy metadata}" → actual phase names, gate criteria
   - "{ENRICHMENT: bead metadata}" → actual bead counts, prefix, distribution

This keeps later handoffs specific rather than generic.
```

### Enrichment Markers in Generated Handoffs

When generating handoffs for later batches, use enrichment markers that get replaced:

```markdown
## Key Context

{ENRICHMENT: This section will be updated after Batch 1 with actual spec metadata —
requirement IDs, subsystem count, section structure. For now, the spec path is
{spec_path} and the agent should read it directly.}
```

This makes it clear to the user which parts will improve after enrichment, and the handoff still works without enrichment (it just has less pre-digested context).

---

## Phase 4: Output (5 minutes)

### Write Execution Guide

```markdown
# {Feature} — Pipeline Execution Guide

## Pipeline Entry Point: Batch {N}
## Total Handoffs: {count}

## Execution Order

### Batch {N}: {Name}
| Session | File | Depends On |
|---------|------|-----------|
| 1 | {file} | — |
| 2 | {file} | Session 1 |

### Batch {N+1}: {Name}
...

## Mandatory Stops
- After Batch 6 (kickoff generated) — human authorizes execution
- After execution complete — human triggers completion audit

## Quick Reference
- Spec: {path}
- TDD: {path}
- Strategy: {path}
- Kickoff: {path}
- Push: {path}
- Bead prefix: {prefix}
- Bead CLI: {cli}
```

### Report to User

```
✅ Pipeline generated for {feature_name}

📁 Handoff files: {dir}/
📋 Manifest: {dir}/manifest.yaml
📖 Execution guide: {dir}/EXECUTION-GUIDE.md

📊 Entry point: Batch {N} ({name})
📊 Handoffs generated: {count}
📊 Codebase files studied: {count}
📊 Key types identified: {count}

Next step: Open {dir}/EXECUTION-GUIDE.md and start running handoffs.
```

---

## Phase 0.5: Spec Validation (Pattern B Only)

When the source doc is an existing spec/layer doc (not a research doc), Batch 1 becomes a **spec validation pass** instead of research-to-spec:

### What Spec Validation Checks

1. **Requirement IDs** — Does every requirement have a unique, stable ID (FR-X.Y.Z or equivalent)?
   - If missing: add them systematically (by section, subsystem, etc.)

2. **Acceptance Criteria** — Does every requirement have explicit, bullet-listed ACs?
   - If buried in prose: extract into bullet lists

3. **Structure** — Is the spec parseable for downstream coverage verification?
   - Consistent section numbering
   - Clear subsystem boundaries
   - Success criteria table

4. **Completeness** — Does the spec cover everything needed for implementation?
   - No "TBD" sections
   - No hand-waving ("handle appropriately")
   - Error paths defined, not just happy paths

The validation handoff invokes NO skill — it's manual reading + editing. The sub-optimization at the end is: "re-read the spec with fresh eyes — would a test engineer be able to write comprehensive tests for every feature? Would a developer know exactly what to build?"
