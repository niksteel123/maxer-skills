# Intent-to-Handoff — Methodology

Detailed execution guide for the 6-phase handoff prompt generation workflow. Each phase includes its purpose, concrete steps, tools to use, and gate criteria that must pass before proceeding.

---

## Phase 0: Project Discovery

**Purpose**: Build internal context about the project so that subsequent phases make informed decisions. Fully automatic — no user interaction.

**Steps**:

1. **Detect project root markers** — Search for:
   - `package.json`, `tsconfig.json` (Node/TypeScript)
   - `Cargo.toml`, `rust-toolchain.toml` (Rust)
   - `go.mod` (Go)
   - `pyproject.toml`, `setup.py`, `requirements.txt` (Python)
   - `pom.xml`, `build.gradle` (JVM)
   - Monorepo markers: `turbo.json`, `nx.json`, `lerna.json`, `pnpm-workspace.yaml`

2. **Map directory structure** — Glob for top-level and second-level directories. Identify:
   - Source directories (`src/`, `lib/`, `packages/`, `apps/`, `crates/`)
   - Test directories (`tests/`, `__tests__/`, `test/`, `spec/`)
   - Documentation (`docs/`, `thoughts/`, `specs/`, `design/`)
   - Configuration (`.github/`, `.claude/`, `scripts/`)

3. **Locate documentation** — Find and note paths for:
   - `README.md` (project root and key subdirectories)
   - `CLAUDE.md` (project-specific Claude instructions)
   - Architecture documents, specs, design docs
   - Any `thoughts/` or `docs/plan-hub/` directories

4. **Identify build & test infrastructure** — Determine:
   - Package manager (npm, bun, pnpm, cargo, go, pip)
   - Test framework (vitest, jest, cargo test, pytest, go test)
   - Build commands (from package.json scripts, Makefile, Cargo.toml)
   - CI/CD configuration (.github/workflows/, .gitlab-ci.yml)

5. **Check for project memory** — Read CLAUDE.md and any `.claude/` memory files for:
   - Project conventions and constraints
   - Architecture decisions
   - Key terminology

**Tools**: Glob, Read (for package.json/Cargo.toml), Bash (`ls` for directory listing)

**Gate**: Can answer: What is this project? What languages/frameworks? Where are the docs? Where are the tests?

**Output**: Internal context object (not shown to user):
```
{
  projectType: "monorepo" | "single",
  languages: ["typescript", "rust"],
  frameworks: ["react", "tauri", "tldraw"],
  rootMarkers: ["package.json", "turbo.json"],
  docPaths: ["README.md", "CLAUDE.md", "docs/", "thoughts/"],
  testFramework: "vitest",
  buildSystem: "turborepo + bun",
  conventions: [...from CLAUDE.md...]
}
```

---

## Phase 1: Intent Capture

**Purpose**: Understand exactly what the user wants the handoff session to accomplish. Interactive — ask clarifying questions if needed.

**Steps**:

1. **Parse the user's request** — Extract:
   - **Task type**: feature | bug | refactor | research | migration
   - **Scope**: Which parts of the codebase are affected?
   - **Features/changes**: What specifically needs to be built/fixed/changed?
   - **Constraints**: Any mentioned limitations or requirements

2. **Assess clarity** — Determine if the request is:
   - **Clear**: Specific task with defined scope → proceed to Phase 2
   - **Ambiguous**: Missing scope, unclear requirements → ask clarifying questions
   - **Broad**: Large scope that may need narrowing → confirm boundaries

3. **Ask clarifying questions** (if needed, max 3) using AskUserQuestion:
   - **Scope**: "Should the handoff cover just X, or also Y and Z?"
   - **Audience**: "Is this handoff for an implementation session, or a research/planning session?"
   - **Known files**: "Are there specific files or areas you already know are relevant?"
   - **Priority**: "Are there specific aspects that are more critical than others?"

4. **Build intent model**:
   ```
   {
     taskType: "feature",
     scope: "Add WebSocket reconnection logic to the transport layer",
     features: ["auto-reconnect", "backoff strategy", "state recovery"],
     constraints: ["must work with existing CBOR protocol", "no breaking API changes"],
     knownFiles: ["src/transport/ws.ts", "src/transport/types.ts"],
     targetAudience: "implementation",
     priority: "reconnect reliability > performance optimization"
   }
   ```

**Tools**: AskUserQuestion (for clarification)

**Gate**: Can explain what the handoff session should accomplish in ONE sentence. Example: "The receiving session should implement WebSocket auto-reconnection with exponential backoff in the transport layer, preserving the existing CBOR protocol."

---

## Phase 2: Codebase Exploration

**Purpose**: Find all files, patterns, and integration points relevant to the task. Automatic — uses subagents for parallel exploration.

**Steps**:

1. **Design search strategy** — Based on the intent model, plan 2-3 search angles:
   - **Direct search**: Files/patterns directly related to the task (grep for domain terms, find modules by name)
   - **Architecture search**: Imports, dependencies, integration points around the affected area
   - **Context search**: Documentation, specs, tests related to the area

2. **Launch Explore subagents** — Use the Task tool with `subagent_type: "Explore"`:

   **Agent A — Direct Relevance**: Search for files and code directly related to the task.
   - Grep for domain-specific terms (function names, type names, module names)
   - Find the primary files that will be modified
   - Identify existing implementations of similar patterns

   **Agent B — Architecture Mapping**: Map the architecture around the affected area.
   - Trace imports and dependencies (what depends on the affected files?)
   - Find integration points (where does this code connect to other systems?)
   - Identify shared types, interfaces, and contracts

   **Agent C — Context & Tests** (launch if the area has specs or complex test requirements):
   - Find related documentation and specs
   - Locate existing tests for the affected area
   - Find test utilities and helpers that should be reused

3. **Synthesize results** — From subagent outputs, build a file relevance map:
   ```
   critical: [files that MUST be read and understood]
   supporting: [files that provide context but won't be modified]
   reference: [docs, specs, tests for background understanding]
   ```

4. **Read critical files** — For each critical file, note:
   - Path and role in the system
   - Key types, functions, and exports
   - How it relates to the task
   - Important patterns or conventions used

**Tools**: Task (Explore subagents), Read (for critical files), Grep/Glob (for targeted follow-up searches)

**Gate**: Found at least 5 relevant files (10+ for complex tasks). Mapped key integration points. Can describe how the affected area connects to the rest of the system.

**Intelligence layer — How to decide search queries**:
- Extract nouns from the intent: "WebSocket", "transport", "reconnection" → search for these terms
- Think about what the feature TOUCHES: if adding reconnection, also search for connection state, error handling, event emission
- Consider the architecture: if it's a layered system, search each layer that the feature crosses
- Look for existing patterns: if the codebase already has retry/backoff logic elsewhere, find it

---

## Phase 3: Documentation & Constraint Scan

**Purpose**: Understand the project's rules, conventions, and constraints that the handoff session must follow. Automatic.

**Steps**:

1. **Read project instructions** — Scan:
   - `CLAUDE.md` (root and any subdirectory-specific)
   - `README.md` (project overview and setup)
   - Contributing guides, style guides

2. **Extract coding conventions**:
   - Naming patterns (camelCase vs snake_case, file naming)
   - Import organization
   - Error handling patterns
   - Logging conventions
   - Comment style

3. **Identify architectural constraints**:
   - Framework version locks or requirements
   - API contracts that must be preserved
   - Backward compatibility requirements
   - Performance requirements
   - Security requirements

4. **Scan related specs/docs** — If the project has specification documents:
   - Find specs related to the affected area
   - Extract relevant requirements, type definitions, protocol definitions
   - Note any spec version numbers for reference

5. **Understand test patterns**:
   - What test framework is used?
   - How are tests organized? (co-located, separate directory, by type)
   - What test utilities exist?
   - What's the expected test coverage pattern?

**Tools**: Read (for docs and specs), Grep (for convention patterns), Glob (for finding doc files)

**Gate**: Documented at least 3 architectural constraints and identified the project's test approach. Can list the conventions the handoff session must follow.

---

## Phase 4: Prompt Synthesis

**Purpose**: Assemble all gathered context into a self-contained handoff prompt document. This is the core intelligence of the skill. Automatic.

**Steps**:

1. **Select template** — Based on task type from the intent model:
   - Feature → Template A (see TEMPLATES.md)
   - Bug → Template B
   - Refactor/Migration → Template C
   - Research → Modified Template A (research-only, no implementation phase)

2. **Write MISSION section**:
   - One paragraph: what to do, why, and the most critical warning/constraint
   - Must be specific enough that someone reading ONLY the mission understands the task
   - Include the one-sentence summary from Phase 1's gate

3. **Write RESEARCH PHASE section**:
   - Organize files into logical reading groups (e.g., "Core Types", "Transport Layer", "Test Infrastructure")
   - For each group:
     - List specific file paths
     - State what to understand from each file
     - Include **understanding checkpoint questions** — questions the reader should be able to answer after reading
   - **Embed key types and API signatures** directly in the prompt:
     - Read critical type files and extract the relevant type definitions
     - Include actual function signatures, not just "look at the function"
     - Show interface contracts that must be respected

4. **Write TASK SPECIFICATION section** (Template A) or equivalent:
   - Feature-by-feature or change-by-change breakdown
   - For each item: concept, questions to resolve, implementation guidance
   - Include per-layer guidance if the codebase is layered

5. **Write CONSTRAINTS section**:
   - Numbered list of hard constraints from Phase 3
   - Each constraint should be specific and actionable
   - BAD: "Be careful with the API"
   - GOOD: "The WebSocket message format uses CBOR encoding (not JSON). All new message types must implement CborSerialize and be added to the MessageType enum in src/protocol/types.ts"

6. **Write DELIVERABLES section**:
   - Numbered list of concrete outputs expected
   - Each deliverable should be verifiable
   - Include file paths where new code should go

7. **Write VERIFICATION section**:
   - Specific test commands to run
   - Visual/manual checks if applicable
   - Expected behavior descriptions

8. **Write REMINDERS section**:
   - Critical gotchas from codebase exploration
   - Non-negotiable rules from CLAUDE.md
   - The ULTRATHINK directive

9. **Determine output path**:
   - Default: `./prompts/{feature-slug}-handoff.md`
   - Create the `prompts/` directory if it doesn't exist
   - Use kebab-case for the slug, derived from the task description
   - If the user specified a path, use that instead

**Tools**: Write (for the output file), Read (for embedding types)

**Context assembly decision tree**:
```
For each piece of context discovered in Phases 0-3:
  ├─ Is it a type definition used by the affected code?
  │   └─ YES → Embed it directly in the prompt
  ├─ Is it an API signature/contract?
  │   └─ YES → Embed it directly in the prompt
  ├─ Is it a coding convention?
  │   └─ YES → Add to CONSTRAINTS section
  ├─ Is it a file that must be read for understanding?
  │   └─ YES → Add to RESEARCH PHASE with checkpoint questions
  ├─ Is it background context (spec, architecture doc)?
  │   └─ YES → Add to RESEARCH PHASE as reference reading
  └─ Is it tangentially related?
      └─ YES → Omit (keep the prompt focused)
```

**Length calibration**:
- Simple single-file change: 150-200 lines
- Typical feature (2-5 files): 200-400 lines
- Complex multi-feature task: 400-600 lines
- Large architectural change: 600-800 lines
- If exceeding 800 lines, consider splitting into multiple handoff prompts

---

## Phase 5: Self-Verification

**Purpose**: Ensure the output prompt meets quality standards before delivering it. Automatic.

**Steps**:

1. **Run CHECKLIST.md** — Execute every check in the quality gates checklist.

2. **Verify file paths** — For every file path mentioned in the prompt:
   - Glob or Read to confirm it exists
   - If a path is invalid, fix it or remove the reference

3. **Test self-containment** — Mentally simulate:
   - "If I opened a brand new session and pasted ONLY this document..."
   - "...could I execute the task without asking any questions about context?"
   - If no → identify what's missing and add it

4. **Check for session leakage** — Grep the output for:
   - "our discussion", "as we discussed", "earlier", "above"
   - "the user mentioned", "you said"
   - Any reference to the current session's conversation
   - If found → rewrite to be self-contained

5. **Fix issues** — Address any failures found in steps 1-4.

6. **Report to user**:
   - State the output file path
   - Summarize what the prompt covers (2-3 sentences)
   - Note the task type and template used
   - Suggest the next step: "Open a new session and paste the contents of {path}"

**Tools**: Glob (verify file paths), Read (verify embedded content matches actual code), Grep (check for session leakage)

**Gate**: All CHECKLIST.md items pass. Zero invalid file paths. Zero session-context leakage.

---

## Error Handling

**If Phase 2 finds very few relevant files** (<5):
- The task may be greenfield (new feature with no existing code) — adjust the prompt to focus on where new code should go and what patterns to follow
- Or the search queries may need broadening — try alternative terms

**If the intent is too broad**:
- Ask the user to narrow scope in Phase 1
- Or propose splitting into multiple handoff prompts

**If the codebase has no documentation**:
- Rely more heavily on code exploration (Phase 2)
- Note in the prompt that the codebase lacks docs and conventions must be inferred from existing code

**If embedded types are very large** (>50 lines per type):
- Include only the relevant subset of the type
- Add a note pointing to the full definition file
