---
name: error-manifest
description: "Generate QA error manifest handoff documents for debugging agents. Use when encountering a bug, unexpected behavior, persistence failure, or any reproducible defect that needs to be handed off to a specialist. Trigger phrases: 'create an error manifest', 'document this bug for handoff', 'write a QA manifest', 'error manifest for [issue]', 'manifest this issue', '/error-manifest'. Produces a self-contained reproduction + investigation document that a fresh debugging session can execute autonomously."
user_invocable: true
---

# Error Manifest — QA-Grade Bug Reproduction & Debugging Handoff

## Philosophy

This skill transforms observed defects into a forensic-grade error manifest that a fresh debugging agent (with ZERO prior context) can use to reproduce, investigate, and fix the issue autonomously.

```
┌──────────────────┐     ┌────────────────────────┐     ┌───────────────────────────┐
│  OBSERVED DEFECT │ ──► │  FORENSIC COLLECTION   │ ──► │   ERROR MANIFEST (.md)    │
│                  │     │                        │     │                           │
│ "X is broken,   │     │ • Reproduce defect     │     │ • Defect fingerprint      │
│  Y doesn't      │     │ • Collect evidence     │     │ • Reproduction protocol   │
│  persist"        │     │ • Trace execution path │     │ • Evidence bundle         │
│                  │     │ • Diff working vs      │     │ • Root cause hypotheses   │
│                  │     │   broken paths         │     │ • Fix constraints         │
│                  │     │ • Document environment  │     │ • Acceptance criteria     │
└──────────────────┘     └────────────────────────┘     └───────────────────────────┘
```

**Key insight**: A great error manifest is NOT a bug report — it's a **forensic evidence package**. It includes the exact commands that were run, the exact output that was observed, the exact files that were read, and the exact diff between working and broken codepaths. The receiving agent should not need to repeat ANY of the investigator's work.

**QA principle**: Every claim in the manifest must be backed by evidence. "The event store is empty" is a claim. "Running `python3 -c 'data.count(b\"token\")'` returned 0" is evidence.

## When to Use

Trigger phrases:
- "Create an error manifest for..."
- "Document this bug for handoff"
- "Write a QA manifest for [issue]"
- "Error manifest for [issue]"
- "Manifest this issue"
- "Prepare a debugging handoff for..."
- "/error-manifest"

Also use proactively when:
- You've been investigating a bug and need to hand off to a specialist
- A defect spans multiple subsystems and needs focused debugging
- You've gathered significant evidence but the fix requires deeper expertise
- The reproduction steps are complex and shouldn't be lost

## The 7-Phase Workflow

```
Phase 0          Phase 1             Phase 2              Phase 3
ENVIRONMENT  ──► DEFECT          ──► REPRODUCTION     ──► EVIDENCE
SNAPSHOT         CHARACTERIZATION    PROTOCOL              COLLECTION
(auto)           (auto/interactive)  (auto)                (auto)
                                                               │
                                                               ▼
Phase 6          Phase 5             Phase 4             ┌──────────┐
SELF-        ◄── MANIFEST       ◄── ROOT CAUSE      ◄── │ Forensic │
VERIFICATION     SYNTHESIS           ANALYSIS             │ Assembly │
(auto)           (auto)              (auto)              └──────────┘
    │
    ▼
 OUTPUT: ./prompts/{slug}-error-manifest.md
```

**Phase 0 — Environment Snapshot**: Capture runtime environment, versions, process state, and data store state. Fully automatic.

**Phase 1 — Defect Characterization**: Classify the defect (data loss, silent failure, crash, wrong behavior, performance). Build a defect fingerprint.

**Phase 2 — Reproduction Protocol**: Build deterministic, step-by-step reproduction instructions. Verify they reproduce the defect. Record exact commands and outputs.

**Phase 3 — Evidence Collection**: Gather all forensic evidence — binary file searches, log outputs, state dumps, codepath traces. Every claim gets evidence.

**Phase 4 — Root Cause Analysis**: Compare working vs broken codepaths. Build ranked hypothesis list with evidence linkage. Identify the narrowest possible scope of the bug.

**Phase 5 — Manifest Synthesis**: Assemble into the QA Error Manifest template. Embed evidence inline. Write acceptance criteria for the fix.

**Phase 6 — Self-Verification**: Run the quality checklist. Verify all paths, commands, and evidence. Confirm reproducibility.

See **METHODOLOGY.md** for detailed execution instructions per phase.
See **TEMPLATE.md** for the output document template.
See **CHECKLIST.md** for self-verification quality gates.

## Quick Reference

| Item | Convention |
|------|-----------|
| **Output location** | `./prompts/{slug}-error-manifest.md` (overridable) |
| **Naming** | Kebab-case slug, e.g. `project-persistence-silent-fail-error-manifest.md` |
| **Length target** | 150-400 lines typical, up to 600 for multi-subsystem defects |
| **Evidence format** | Inline code blocks with exact commands + exact outputs |
| **Hypothesis format** | Ranked list with evidence linkage (E1, E2, etc.) |

## What Makes This Different From intent-to-handoff

| Aspect | intent-to-handoff | error-manifest |
|--------|-------------------|----------------|
| **Goal** | Enable implementation | Enable debugging |
| **Audience** | Builder agent | Debugger/fixer agent |
| **Core content** | Architecture + types + patterns | Evidence + reproduction + traces |
| **Key question** | "What should I build?" | "What is broken and how do I prove it?" |
| **Evidence standard** | Reference (file paths + checkpoint Qs) | Forensic (exact commands + exact outputs) |
| **Template** | Feature/Bug/Refactor | Single QA Error Manifest |
| **Success metric** | Agent can implement without asking Qs | Agent can reproduce bug in <5 min |
