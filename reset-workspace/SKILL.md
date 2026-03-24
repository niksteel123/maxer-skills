---
name: reset-workspace
description: Wipe beads, reset AgentMail (agents AND messages), and clean workspace for a fresh implementation. Use before starting a new feature cycle or when resetting project state.
---

# Reset Workspace

This skill performs a complete workspace reset for starting fresh implementations.

## What Gets Reset

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RESET WORKSPACE SCOPE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. BEADS                                                                   │
│  ├── Wipe .beads/ directory                                                 │
│  └── Reinitialize with bd init                                              │
│                                                                             │
│  2. AGENTMAIL                                                               │
│  ├── Delete all messages (messages, message_recipients, FTS)                │
│  ├── Delete all file reservations                                           │
│  ├── Prune/retire all agents                                                │
│  └── Clean git archive agent folders (optional)                             │
│                                                                             │
│  3. PLAN-HUB (optional)                                                     │
│  ├── Clear prompts/*.md (kickoff prompts)                                   │
│  └── Reset status/active-plan.yaml                                          │
│                                                                             │
│  4. SWARM CORE DB (optional, if using swarm-core)                           │
│  └── Clean workspace records                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## When to Use This Skill

- **Before starting a new feature** - Clean slate for fresh beads
- **After completing a feature** - Archive and reset for next iteration
- **Debugging workflow issues** - Reset state when things get corrupted
- **Switching between features** - Clean transition between projects

## When to Skip This Skill

Check the current state first:
```bash
bd list --json | jq length        # Count existing beads
bd ready --json                   # Check for pending work
```

**Skip reset if:**
- `bd list` returns 0 beads (already clean)
- You're continuing work on an existing feature
- Beads exist but are from the current feature you're implementing

**Run reset if:**
- Beads exist from a previous/different feature
- AgentMail has stale agents or messages from old work
- You want a completely fresh start
- State is corrupted or confusing

**Rule of thumb:** If unsure, check → if clean, skip → if dirty, reset.

## Prerequisites

1. AgentMail server accessible (port 8765)
2. Project directory with `.beads/` (or will be initialized)
3. `bd` CLI tool available
4. AgentMail CLI available (`uv run python -m mcp_agent_mail.cli`)

## Reset Levels

| Level | Beads | Messages | Agents | File Reservations | Plan-Hub |
|-------|-------|----------|--------|-------------------|----------|
| **Minimal** | ✓ | - | - | - | - |
| **Standard** | ✓ | ✓ | ✓ | ✓ | - |
| **Full** | ✓ | ✓ | ✓ | ✓ | ✓ |

## Quick Start

```bash
# 1. Check current state
bd list --json | jq length
uv run python -m mcp_agent_mail.cli agents list "/path/to/project" -s active --json

# 2. Invoke this skill
# "Reset workspace for fresh implementation"
# "Wipe beads and reset mail for project"
# "Full workspace reset before starting new feature"
```

## Critical Warnings

⚠️ **DESTRUCTIVE OPERATION** - This skill permanently deletes:
- All beads in `.beads/`
- All AgentMail messages for the project
- All agent profiles for the project
- All file reservations

**Always confirm** the project path before running reset commands.

## Supporting Files

- **WORKFLOW.md** - Step-by-step reset procedure
- **CHECKLIST.md** - Pre/post reset verification

---

## Next Stage Kickoff Prompt

After completing this skill, copy the prompt below to kick off the next stage:

```
Use the **spec-to-strategy** skill.

- Spec: `{spec_path}` 
- Arch: `{arch_path}` (e.g., `docs/ARCH-DATA.md`)
- Project root: `{project_root}`

Workspace has been reset. Create phased implementation plans from the spec.
Output location: `docs/implementation/`
```

**Fill in the placeholders** with your actual paths before pasting.
