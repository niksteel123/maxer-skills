# Beads to Execution Workflow

A research-driven workflow for preparing beads for multi-agent execution. The quality of the kickoff prompt is directly proportional to the depth of codebase research.

---

## Overview

This workflow transforms existing beads into an executable multi-agent project by:
1. Conducting deep codebase research to understand the feature's integration surface
2. Generating feature-specific prompts grounded in real file paths, types, and commands
3. Creating a status file with all SOT document pointers

**Design Principle:** No generic templates. Every prompt is feature-specific, filled with real codebase details discovered during research.

---

## Step 1: Deep Codebase Research

This is the most important step. Skip or rush it and you'll produce generic, useless prompts.

### 1.1 Locate and Read SOT Documents

Identify all 3 Source of Truth documents plus supporting docs:

```bash
# Find spec, TDD, strategy, and bootstrap documents
# These are typically in thoughts/{layer}/ or docs/
# Ask the user if locations aren't obvious
```

**From the Spec (SOT #1), extract:**
- Mission statement / executive summary
- Subsystem list and count
- Success criteria list and count
- Completion milestones (what "done" looks like)
- Key architectural decisions
- Integration boundaries (what this feature consumes vs creates)

**From the TDD (SOT #2), extract:**
- Total test count (by type: UT, IT, E2E, VT, PERF)
- Test count by step/phase (if step-tagged)
- Key test infrastructure (mocks, fixtures, CI tiers, test harness)
- Testing stack (framework, assertion library, E2E tool)

**From the Strategy (SOT #3), extract:**
- Phase ordering and count
- Tasks per phase
- Parallel tracks within phases
- Gate criteria between phases
- Dependency graph structure
- Bead prefix
- Timeline estimates (if present)

**From the Bootstrap (if exists), extract:**
- Environment prerequisites (languages, tools, versions)
- Build/test/lint command chain
- CI validation script
- Monorepo layout
- External dependencies

### 1.2 Study the Codebase

Explore the actual code to understand the integration surface:

```bash
# Project structure
ls -la
ls -R apps/ packages/ crates/ src/

# Find AGENTS.md for conventions
find . -name "AGENTS.md" -maxdepth 3

# Identify the build/test/lint command chain
cat package.json       # or Cargo.toml, pyproject.toml, etc.
cat Makefile           # if exists

# Find existing patterns the feature integrates with
# (varies by feature — use judgment)
```

**Document these findings:**
- Project structure (directory tree of relevant areas)
- Stack and toolchain (package manager, framework, testing tools)
- Build/test/lint commands (exact shell commands)
- Integration surface (what APIs, types, wire formats exist)
- Key backend code to study (if frontend feature consuming backend)
- Key frontend code to study (if extending existing UI)
- Wire types that cross boundaries (CBOR, JSON, protobuf, etc.)
- Existing patterns agents should follow

### 1.3 Read Bead Metadata

```bash
# Total bead count
br list --json | jq length

# Ready beads (no blockers)
br ready --json | jq length

# Bead prefix (look at IDs)
br list --json | jq -r '.[0].id' | cut -d. -f1-2

# Phase-to-epic mapping (from bead IDs and labels)
br list --json | jq -r '.[].id' | sort

# Root epic
br list --json | jq -r '.[] | select(.type == "epic" and (.deps | length == 0)) | .id'

# Dependency graph health
bv --robot-insights | jq '.Cycles'  # MUST be empty []
```

**Document these findings:**
- Total bead count (tasks vs epics vs gates)
- Ready bead count and IDs
- Bead prefix (e.g., `bd-3pcr`)
- Phase-to-epic-to-bead mapping table
- Entry point bead(s) — the only task(s) with no blockers at start
- Other bead prefixes in the database to EXCLUDE (prior layers)

### 1.4 Verify AgentMail

```bash
# Check mail server health
curl -s http://127.0.0.1:8765/health/liveness

# Find database (for troubleshooting)
lsof -p $(lsof -i :8765 -t) 2>&1 | grep -E "cwd|sqlite"
```

**Document:**
- Server status (running or needs start command)
- Project key (absolute path to project root)
- Whether coordination is needed (multi-agent or solo)

### 1.5 Identify Quality Gate Commands

Determine the exact shell commands for this project's quality gates:

```bash
# Find the build/test/lint chain
# Examples by stack:

# TypeScript/Bun:     bun run lint && bun run typecheck && bun run test && bun run build
# Rust/Cargo:         cargo fmt --check && cargo clippy && cargo test && cargo build
# Python/uv:          uv run ruff check && uv run mypy && uv run pytest
# Mixed:              cargo test && bun run test   (for Rust+TS monorepos)
```

Also check for project-specific tools:
```bash
# UBS (Ultimate Bug Scanner) — if available
which ubs && echo "UBS available"

# bv (beads_viewer) — always --robot-* flags, NEVER bare bv
which bv && echo "bv available"
```

---

## Step 2: Generate Feature-Specific Outputs

### 2.1 Create Directory Structure

```bash
mkdir -p docs/plan-hub/prompts
```

### 2.2 Write Kickoff Prompt

**File:** `docs/plan-hub/prompts/{feature}-kickoff.md`

Using all research findings from Step 1, generate a deeply feature-specific kickoff prompt. Use Template B in TEMPLATES.md as the structural guide, but populate every section with real codebase details.

**Quality bar:** The L2.5 kickoff (`docs/plan-hub/prompts/l2.5-desktop-kickoff.md`) is the reference for quality. Your kickoff should be at least that specific and grounded.

**Key sections that MUST be feature-specific (not generic):**
- Mission statement — actual feature name, bead count, completion milestone
- Source of Truth reading list — actual file paths with read/skim/reference annotations
- Integration surface — actual APIs, types, wire formats, existing code paths
- Codebase structure — actual directory tree of what this feature creates
- Stack and toolchain — actual tools, versions, package manager
- Bead listing by phase — actual bead IDs, titles, dependencies, ready status
- Quality gate commands — actual shell commands for this stack
- Phase structure — actual phases with actual bead ranges

### 2.3 Write Push Prompt

**File:** `docs/plan-hub/prompts/{feature}-push.md`

A SHORT (~30-50 lines) continuation nudge for agents that stopped or need re-energizing. Use Template C in TEMPLATES.md.

**Key properties:**
- Starts with "Re-read AGENTS.md"
- Has exact project key
- Has exact bead prefix filter
- Has exact quality gate commands
- Has "Do NOT stop to ask" directive
- Has Session Landing Protocol reference

### 2.4 Write Status File

**File:** `docs/plan-hub/prompts/{feature}-pipeline-status.yaml`

Minimal YAML with all SOT paths and bead metadata. Use Template A in TEMPLATES.md.

---

## Step 3: Verify Outputs

```bash
# All 3 outputs exist
ls docs/plan-hub/prompts/{feature}-kickoff.md
ls docs/plan-hub/prompts/{feature}-push.md
ls docs/plan-hub/prompts/{feature}-pipeline-status.yaml

# Kickoff is feature-specific (not generic)
# Check: does it contain real file paths?
grep -c "/" docs/plan-hub/prompts/{feature}-kickoff.md  # Should be high (many paths)

# Kickoff has all 3 SOT docs in reading list
grep -c "SOT" docs/plan-hub/prompts/{feature}-kickoff.md  # Should be >= 3

# Push prompt is short
wc -l docs/plan-hub/prompts/{feature}-push.md  # Should be ~30-50 lines

# Status file is valid YAML
cat docs/plan-hub/prompts/{feature}-pipeline-status.yaml

# Beads are ready
br ready --json | jq '.[0].id'

# No dependency cycles
bv --robot-insights | jq '.Cycles'  # Should be empty []
```

---

## Step 4: Report and Stop

**DO NOT proceed to execution.** Report to the human:

```
Setup complete for {feature_name}

Kickoff prompt: docs/plan-hub/prompts/{feature}-kickoff.md
Push prompt:    docs/plan-hub/prompts/{feature}-push.md
Status file:    docs/plan-hub/prompts/{feature}-pipeline-status.yaml

Research findings:
- {N} total beads ({M} task beads, {P} phase epics, {Q} QA gates)
- {R} beads ready for execution
- Bead prefix: {prefix}
- Quality gates: {commands}
- Stack: {stack summary}

Awaiting your authorization to proceed.

Options:
1. Copy kickoff prompt to fresh session for implementation
2. Copy push prompt into existing session to continue work
3. Say "proceed" to execute in this session
4. Review beads first: br list --json
```

**The agent must wait for explicit human confirmation before any execution work.**

---

## Troubleshooting

### "Mail server not running"
```bash
cd apps/mail && uv run python -m mcp_agent_mail.http --port 8765
```

### "CLI schema mismatch" / "no such column"
The CLI version doesn't match the running server's database. Use SQL cleanup:
```bash
# Find correct database
lsof -p $(lsof -i :8765 -t) 2>&1 | grep sqlite
# Use SQL commands directly
```

### "Beads not showing as ready"
- Verify dependencies: `br dep tree {root-epic}`
- Check parent epic status: `br show {parent-id}`
- Look for cycles: `bv --robot-insights | jq '.Cycles'`

### "Kickoff looks too generic"
You didn't do enough codebase research. Go back to Step 1 and:
- Read more of the actual source code
- Find actual type names and file paths
- Extract actual build/test commands from package.json or Cargo.toml
- List actual bead IDs with actual titles and dependencies
