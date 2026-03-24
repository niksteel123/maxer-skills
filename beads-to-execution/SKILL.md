---
name: beads-to-execution
description: Prepare a codebase for beads execution with deep codebase research. Generates 3 outputs — a feature-specific kickoff prompt (agent onboarding), a push prompt (continuation nudge), and a status file (SOT pointers). Requires spec (SOT #1), TDD (SOT #2), and strategy (SOT #3). Eliminates redundant plan documents.
---

# Beads to Execution

This skill prepares a codebase with existing beads for multi-agent execution using **deep codebase research** to generate **feature-specific** prompts — not generic templates.

## Philosophy: 3 Source of Truth (3-SOT)

```
┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
│   Spec (SOT #1)      │  │   TDD (SOT #2)       │  │  Strategy (SOT #3)   │
│   PRIMARY             │  │   PRIMARY             │  │   ORDERING ONLY      │
│                      │  │                      │  │                      │
│ WHAT to build        │  │ HOW to verify         │  │ WHAT ORDER to build  │
│ Complete requirements │  │ Test layers & evidence│  │ Phase gates & deps   │
└──────────────────────┘  └──────────────────────┘  └──────────────────────┘
              ▲                       ▲                       ▲
              │                       │                       │
              └───────────────────────┼───────────────────────┘
                                      │
                          ┌──────────────────────┐
                          │        Beads          │
                          │    (SELF-CONTAINED)   │
                          │                      │
                          │ Atomic tasks with     │
                          │ embedded spec + TDD   │
                          └──────────────────────┘
```

**Source of Truth Hierarchy:**
```
Spec (PRIMARY) > TDD (PRIMARY) > Strategy (ORDERING) > Beads (SELF-CONTAINED)
```

**Key Principles:**
- Agents read **spec** (what to build), **TDD** (how to verify), **strategy** (what order), and **beads** (self-contained tasks) directly
- No intermediate "plan" documents that duplicate or distort the source of truth
- Beads embed spec + TDD content verbatim — they are self-contained execution units
- Strategy is a routing table (ordering + gates), NOT a content document

## When to Use This Skill

- You have beads already created (using `br create` or the `beads-from-sources` skill)
- You need to prepare for multi-agent execution
- You need a kickoff prompt for agent onboarding
- You need a push prompt for session continuation
- You need a status file pointing to all SOT documents

## Prerequisites

Before using this skill, ensure:
1. **Spec (SOT #1)** exists — the primary "what to build" document
2. **TDD (SOT #2)** exists — test specifications with real assertions
3. **Strategy (SOT #3)** exists — phase ordering, dependency graph, gate criteria
4. **Beads** exist in `.beads/` — run `br list --json` to verify
5. **Bootstrap** exists (optional) — environment setup companion to TDD
6. **AgentMail** server is accessible (port 8765 for coordination)

## Key Outputs (3 Total)

| Output | Location | Purpose | Size |
|--------|----------|---------|------|
| **Kickoff Prompt** | `docs/plan-hub/prompts/{feature}-kickoff.md` | Full agent onboarding — deeply feature-specific | ~150-300 lines |
| **Push Prompt** | `docs/plan-hub/prompts/{feature}-push.md` | "Continue working" nudge — short, action-oriented | ~30-50 lines |
| **Status File** | `docs/plan-hub/prompts/{feature}-pipeline-status.yaml` | Minimal pointer to all SOT docs + bead metadata | ~20-30 lines |

**What's NOT Generated Here:**
- Audit prompt — that's `bead-plan-audit`'s job (run upstream before this skill)
- Plan documents — eliminated as redundant
- Catalogs — unnecessary with 3-SOT model

## Directory Structure

```
docs/plan-hub/
└── prompts/
    ├── {feature}-kickoff.md              # Agent onboarding
    ├── {feature}-push.md                 # Continuation nudge
    └── {feature}-pipeline-status.yaml    # SOT pointers + metadata
```

## The 3-Step Workflow

### Step 1: Deep Codebase Research (THE KEY STEP)

This is what separates good kickoff prompts from generic templates. The skill MUST study:

1. **Read the Spec (SOT #1)** — extract mission statement, completion milestones, subsystem count, success criteria count
2. **Read the TDD (SOT #2)** — extract test counts (by type and step/phase), key test infrastructure (mocks, fixtures, CI tiers)
3. **Read the Strategy (SOT #3)** — extract phase ordering, current phase, bead prefix, gate criteria, parallel tracks
4. **Read the Bootstrap** — extract environment setup, toolchain, build commands, CI validation script
5. **Study the Codebase** — find the integration surface:
   - What files/modules does this feature touch?
   - What existing patterns should agents follow?
   - What's the build/test/lint command chain?
   - What types cross the boundary (wire types, API types)?
   - What's the stack and toolchain?
   - What does the monorepo/project structure look like?
6. **Read Bead Metadata** — `br list --json` for total count, `br ready` for ready queue, bead prefix, phase-to-epic mapping
7. **Check AgentMail** — is coordination needed? What's the project key?

### Step 2: Generate Feature-Specific Outputs

Using the research findings, generate all 3 outputs:
- **Kickoff prompt** — deeply specific to this feature, with real file paths, real types, real commands, real bead listings
- **Push prompt** — short continuation nudge with exact commands
- **Status file** — YAML with all SOT paths and bead metadata

See TEMPLATES.md for structural guidance. Templates define STRUCTURE — the research provides CONTENT.

### Step 3: Report and Stop

Report outputs to human and wait for authorization. **Do NOT auto-execute.**

## Agent Onboarding Flow (Kickoff Prompt Guides This)

1. **Load Source of Truth** — ordered reading list with read/skim/reference annotations for each document
2. **Understand Integration Surface** — feature-specific APIs, types, wire formats, existing code to study
3. **Register with AgentMail** — boot session, check inbox, situational awareness
4. **Beads & Triage Tools** — br/bv commands, bead prefix, ready queue
5. **The Work Loop** — claim → read → study → implement → verify → commit → push → announce → release → loop
6. **Quality Gates** — actual shell commands for this project's stack
7. **Initiative Rules** — never ask "what should I work on?", never wait for permission
8. **Session Landing Protocol** — push all work, release reservations, announce handoff

## Critical Rules

1. **ALWAYS do deep codebase research first** — generic prompts are useless
2. **ALWAYS include all 3 SOT documents** in reading list (spec, TDD, strategy)
3. **ALWAYS use `br` commands** (beads_rust) — never `bd`
4. **NEVER generate an audit prompt** — that's `bead-plan-audit`'s job
5. **NEVER generate generic template output** — prompts must be feature-specific
6. **ALWAYS embed real file paths, type names, and commands** from codebase research
7. **ALWAYS include bead prefix filter** — agents must only pick beads for THIS feature
8. **ALWAYS include AgentMail coordination** — it's how multi-agent execution works
9. **ALWAYS include Session Landing Protocol** — work is not complete until `git push` succeeds

## Supporting Files

- **WORKFLOW.md** — Complete step-by-step workflow with research methodology
- **TEMPLATES.md** — Structural templates for all 3 outputs
- **CHECKLIST.md** — Pre-execution verification checklist

---

## MANDATORY STOP — DO NOT EXECUTE

### This Skill is SETUP ONLY

After completing beads-to-execution, the agent **MUST**:

1. **STOP** — Do not start executing beads
2. **Report to human:**
   ```
   Setup complete for {feature_name}

   Kickoff prompt: docs/plan-hub/prompts/{feature}-kickoff.md
   Push prompt:    docs/plan-hub/prompts/{feature}-push.md
   Status file:    docs/plan-hub/prompts/{feature}-pipeline-status.yaml
   Ready beads:    {count} available for execution

   Awaiting your instruction to proceed.

   Options:
   1. Copy kickoff prompt to fresh session for implementation
   2. Copy push prompt into existing session to continue work
   3. Say "proceed" to execute in this session
   4. Review beads first: br list --json
   ```
3. **Wait for explicit authorization**

### Why No Auto-Execution?

- Execution is resource-intensive (potentially hours of work)
- Human should verify setup is correct first
- Fresh session provides full context window for implementation
- Human controls timing of implementation work
