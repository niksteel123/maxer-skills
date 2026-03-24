# Intent-to-Handoff — Quality Verification Checklist

Run this checklist during Phase 5 (Self-Verification) before delivering the handoff prompt. Every item must pass. Fix failures before outputting.

---

## Completeness

- [ ] **Mission is present and standalone** — Reading ONLY the MISSION section gives a clear picture of the task. It states what, why, and the top constraint.
- [ ] **Mission is concise** — One paragraph, 3-5 sentences max. Not a wall of text.
- [ ] **All template sections are populated** — No empty sections, no TODO placeholders, no "fill this in" stubs. If a section doesn't apply, remove it entirely rather than leaving it empty.
- [ ] **Research phase has file-specific instructions** — Not just "explore the codebase" but specific file paths with specific things to understand.
- [ ] **Understanding checkpoints exist** — Every research group has at least 2 questions the reader should be able to answer after reading.
- [ ] **Deliverables are enumerated** — Numbered list of concrete, verifiable outputs. Not vague ("improve things") but specific ("new file at path X implementing Y").
- [ ] **Verification steps are actionable** — Specific commands to run, specific behavior to observe.

## Accuracy

- [ ] **Every file path exists** — Glob or Read-verify every `path/to/file.ext` reference in the prompt. Zero broken paths.
- [ ] **Embedded types match actual code** — Type definitions copied into the prompt match what's actually in the source files. No stale or invented types.
- [ ] **Embedded API signatures are current** — Function signatures reflect the actual current code, not a previous version.
- [ ] **Constraint numbers are correct** — If the prompt says "the Foo type has 5 fields", verify it actually has 5 fields.
- [ ] **Test commands work** — If the prompt says "run `bun test`", verify that's actually the project's test command.

## Self-Containment

- [ ] **No session leakage** — Zero references to "our discussion", "as mentioned earlier", "above", "the user said", or any current-session context. The prompt must stand completely alone.
- [ ] **No assumed prior knowledge** — A fresh session with zero context about this project can understand and execute the prompt. Project-specific terms are defined or explained.
- [ ] **Key types are embedded, not just referenced** — Critical type definitions appear directly in the prompt. "See types.ts" is insufficient — the actual shapes must be present.
- [ ] **Architecture is explained, not assumed** — If the codebase has a layered architecture, the prompt explains the layers. If there's a specific data flow, it's described.

## Actionability

- [ ] **Every instruction is specific** — No vague guidance like "be careful with the API" or "handle errors properly". Instead: specific patterns, specific files, specific approaches.
- [ ] **Constraints are testable** — Each constraint answers: "What would a violation look like?" A reviewer could check each constraint against the output.
- [ ] **Implementation guidance follows existing patterns** — If the codebase has a convention for error handling, event emission, or state management, the prompt shows the pattern to follow (with file:line references).

## Scope

- [ ] **Not too broad** — The prompt covers one coherent task, not a sprawling multi-week project. If it's too broad, suggest splitting into multiple handoffs.
- [ ] **Not too narrow** — The prompt includes enough context for the receiving session to make good architectural decisions, not just mechanical code changes.
- [ ] **Scope boundaries are stated** — What is explicitly in scope and out of scope is clear.

## Formatting & Conventions

- [ ] **ULTRATHINK directive is present** — The phrase "ULTRATHINK and be meticulous" appears near the top of the document.
- [ ] **Markdown is well-formed** — Headers, code blocks, lists all render correctly. Code blocks have language annotations.
- [ ] **Length is appropriate** — 200-500 lines for typical tasks, up to 800 for complex ones. Not padded, not sparse.
- [ ] **Output path follows convention** — File is at `./prompts/{feature-slug}-handoff.md` (or user-specified path). Directory exists.

---

## Common Mistakes to Avoid

1. **Listing files without saying WHY to read them** — Every file reference needs context: what to look for, what role it plays, what to understand.

2. **Referencing types without embedding them** — "The FooConfig type in config.ts" is useless to a fresh session. Copy the type definition into the prompt.

3. **Vague constraints** — "Follow the existing patterns" is not actionable. "Error handling follows the Result<T, AppError> pattern — see src/core/errors.ts:15-30 for the AppError type" is actionable.

4. **Missing integration points** — If the feature needs to wire into an event bus, router, or plugin system, the prompt must explain how. Don't assume the receiving session knows the registration pattern.

5. **Scope creep in the prompt** — The handoff prompt should cover what needs to be DONE, not everything interesting about the codebase. Stay focused.

6. **Stale embedded code** — If you copied a type definition, verify it's current. Codebases change fast.

7. **Forgetting test infrastructure** — If the project has test utilities, mock factories, or fixture patterns, include them. The receiving session shouldn't reinvent test helpers.

---

## Quick Self-Test

After writing the prompt, answer these three questions:

1. **Could a brand new session execute this with zero other context?** If you have to answer "well, they'd also need to know about..." — that context is missing from the prompt.

2. **Are the deliverables concrete enough to verify?** If a reviewer can't tell whether each deliverable is done by looking at the code, they're too vague.

3. **Would YOU want to receive this prompt?** If you'd be frustrated by missing context or confused by vague instructions, fix it.
