---
name: intent-to-handoff
description: "Generate comprehensive handoff prompts for fresh sessions. Use when the user wants to 'create a handoff prompt', 'prepare a prompt for a new session', 'generate a handoff for [feature]', 'create a session prompt', 'write a prompt to hand off [task]', or 'handoff [feature/task]'. Captures intent, researches the codebase automatically, and outputs a standalone document with full context."
user_invocable: true
---

# Intent-to-Handoff — Intelligent Handoff Prompt Generator

## Philosophy

This skill transforms raw user intent into a self-contained handoff prompt that a fresh Claude Code session (with ZERO prior context) can execute autonomously.

```
┌─────────────────┐     ┌──────────────────────┐     ┌─────────────────────────┐
│   USER INTENT   │ ──► │  INTELLIGENT RESEARCH │ ──► │   HANDOFF PROMPT (.md)  │
│                 │     │                       │     │                         │
│ "I want to add  │     │ • Discover project    │     │ • MISSION statement     │
│  feature X to   │     │ • Explore codebase    │     │ • File-specific reading │
│  this project"  │     │ • Map architecture    │     │ • Embedded types/APIs   │
│                 │     │ • Scan docs/specs     │     │ • Constraints & rules   │
│                 │     │ • Find conventions    │     │ • Concrete deliverables │
└─────────────────┘     └──────────────────────┘     └─────────────────────────┘
```

The user describes WHAT they want done. The skill figures out HOW to research it, WHAT context is needed, and synthesizes a document that stands completely on its own.

**Key insight**: A good handoff prompt doesn't just list file paths — it embeds the actual type definitions, API signatures, and architectural patterns that the receiving session needs. "Read types.ts" is insufficient. The actual type shapes must be right there in the prompt.

## When to Use

Trigger phrases:
- "Create a handoff prompt for..."
- "Prepare a prompt for a new session to..."
- "Generate a handoff for [feature/task]"
- "Write a prompt to hand off [task]"
- "Create a session prompt for..."
- "Handoff [feature/task]"
- "I need a fresh session to [do X], prepare the context"
- "/intent-to-handoff" or "/handoff"

## The 6-Phase Workflow

```
Phase 0          Phase 1           Phase 2              Phase 3
PROJECT     ──►  INTENT       ──►  CODEBASE        ──►  DOC & CONSTRAINT
DISCOVERY        CAPTURE           EXPLORATION          SCAN
(auto)           (interactive)     (subagents)          (auto)
                                        │
                                        ▼
Phase 5          Phase 4           ┌─────────┐
SELF-        ◄── PROMPT       ◄──  │ Context │
VERIFICATION     SYNTHESIS         │ Assembly│
(auto)           (auto)            └─────────┘
    │
    ▼
 OUTPUT: ./prompts/{slug}-handoff.md
```

**Phase 0 — Project Discovery**: Detect project type, languages, framework, docs, and structure. Fully automatic.

**Phase 1 — Intent Capture**: Parse the user's request. Ask 1-3 clarifying questions if needed (scope, audience, known files). Build an intent model.

**Phase 2 — Codebase Exploration**: Launch 2-3 Explore subagents to search for relevant files, map architecture around the affected area, and find related docs/tests.

**Phase 3 — Documentation & Constraint Scan**: Read project README/CLAUDE.md, relevant specs, and discover coding conventions, architectural patterns, and constraints.

**Phase 4 — Prompt Synthesis**: Select the appropriate template (Feature/Bug/Refactor), assemble all sections, embed key type definitions and API signatures directly into the prompt.

**Phase 5 — Self-Verification**: Run the quality checklist. Verify all file paths exist, ensure self-containment, fix issues, and report to the user.

See **METHODOLOGY.md** for detailed execution instructions per phase.

## Quick Reference

| Item | Convention |
|------|-----------|
| **Output location** | `./prompts/{feature-slug}-handoff.md` (overridable) |
| **Naming** | Kebab-case slug derived from the task, e.g. `add-auth-flow-handoff.md` |
| **Length target** | 200-500 lines typical, up to 800 for complex multi-feature tasks |
| **Templates** | Feature (A), Bug (B), Refactor/Migration (C) — see TEMPLATES.md |
| **Quality gates** | CHECKLIST.md — run before every output |

## Supporting Files

- **METHODOLOGY.md** — Detailed phase-by-phase execution guide with tool usage, gate criteria, and decision trees
- **TEMPLATES.md** — Output prompt templates for Feature, Bug, and Refactor/Migration task types
- **CHECKLIST.md** — Quality verification checklist for self-verification (Phase 5)

## Execution Notes

- **Subagent usage**: Phase 2 uses Explore subagents for parallel codebase research. Launch them with specific, targeted queries based on the intent model.
- **Embedded context**: Always prefer embedding key types/signatures over just referencing file paths. A fresh session should not need to do redundant exploration.
- **Self-containment test**: After writing the prompt, mentally simulate: "If I opened a brand new session and pasted ONLY this document, could I execute the task?" If no, the prompt is incomplete.
- **ULTRATHINK**: Every output prompt MUST include the "ULTRATHINK and be meticulous" directive.
- **No session leakage**: Never reference "our discussion", "as we discussed", or any context from the current session in the output prompt. It must stand alone.
