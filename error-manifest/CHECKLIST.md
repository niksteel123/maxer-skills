# Error Manifest — Quality Verification Checklist

Run this checklist during Phase 6 (Self-Verification) before delivering the error manifest. Every item must pass. Fix failures before outputting.

---

## Reproducibility

- [ ] **Reproduction protocol is complete** — Every step has an exact command (or exact UI action) and exact expected vs actual output. No hand-waving.
- [ ] **Reproduction is deterministic** — Following the steps exactly reproduces the defect every time (or the intermittency rate is documented with N/M).
- [ ] **Prerequisites are listed** — All services, data, environment setup needed before step 1.
- [ ] **Working analogue is documented** (if one exists) — The equivalent operation that works is shown with the same level of command/output detail.
- [ ] **Reproduction is minimal** — No unnecessary steps. Shortest path to trigger the defect.

## Evidence Quality

- [ ] **Every claim has an evidence item** — No unsubstantiated assertions. "The store is empty" must have an E-item with the command that proves it.
- [ ] **Every evidence item has command + output** — Not just "I checked and it's empty" but the exact command and exact output.
- [ ] **Evidence items are numbered** — E{phase}.{n} format, referenced from hypotheses and other sections.
- [ ] **At least 5 evidence items** — Sufficient forensic depth for the debugging agent.
- [ ] **Evidence covers both paths** — If there's a working analogue, evidence exists for BOTH the working and broken paths.

## Code Accuracy

- [ ] **Every file path exists** — Glob/Read verified. Zero broken paths.
- [ ] **Embedded code matches source** — Code snippets are current, not stale or invented.
- [ ] **Line numbers are approximate but close** — Within ~10 lines of the actual code (code may shift between edits).
- [ ] **Function signatures are correct** — Parameter names, types, return types match the actual code.

## Hypothesis Quality

- [ ] **At least 2 hypotheses** — Even if one seems obvious, consider alternatives.
- [ ] **Hypotheses are ranked** — By likelihood with justification.
- [ ] **Each hypothesis links to evidence** — "Supporting: E2.1, E3.2" format. No orphan hypotheses.
- [ ] **Each hypothesis has verification steps** — The debugging agent knows exactly what to check to confirm/reject.
- [ ] **Fix scope is identified** — For each hypothesis, which files/functions would change.

## Self-Containment

- [ ] **No session leakage** — Zero references to "we found", "earlier investigation", "as discussed", "the user mentioned". The manifest stands alone.
- [ ] **Architecture is explained** — Enough context for a fresh agent to understand how the affected system works.
- [ ] **Terminology is defined** — Project-specific terms (scope, lane, permit, etc.) are explained or obvious from context.
- [ ] **Key types are embedded** — Critical type definitions appear in the manifest, not just referenced.

## Acceptance Criteria

- [ ] **Functional criteria exist** — What the operation should do after the fix.
- [ ] **Evidence-based criteria exist** — How to verify the fix with the same evidence commands used to prove the defect.
- [ ] **Regression criteria exist** — What must still work after the fix.
- [ ] **Test criteria exist** — A regression test must be written.

## Completeness

- [ ] **Defect fingerprint is filled** — All fields have values, not "TBD" or blank.
- [ ] **File map is complete** — Every file referenced anywhere in the manifest appears in the file map.
- [ ] **Investigation roadmap is ordered** — Steps are sequential, each step has "if confirmed → X, if rejected → Y".
- [ ] **Fix constraints are stated** — What must NOT change, backward compatibility, performance, API stability.

## Formatting

- [ ] **ULTRATHINK directive is present** — Near the top of the document.
- [ ] **Markdown is well-formed** — Code blocks have language annotations, tables render, headers are hierarchical.
- [ ] **Length is appropriate** — 100-600 lines. Not padded, not too sparse for the defect complexity.
- [ ] **Output path follows convention** — `./prompts/{slug}-error-manifest.md`

---

## Common Mistakes to Avoid

1. **Evidence without commands** — "The database is empty" is a claim. `python3 -c 'print(data.count(b"token"))'` → `0` is evidence. Always include the command.

2. **Hypotheses without evidence linkage** — "Maybe the write fails" is speculation. "H1: write fails because `commit_draft()` silently exhausts retries (E3.1 shows 3-retry loop, E2.3 shows no error logged)" is analysis.

3. **Reproduction assumes environment** — "Create a project in the UI" is insufficient. Specify: what URL, what fields, what button, what the response looks like.

4. **Missing the working analogue** — The single most powerful debugging signal is "X works but Y doesn't, and they should be identical." If a working analogue exists and isn't documented, the manifest is incomplete.

5. **Stale evidence** — If you collected evidence hours ago and the code has changed, re-verify. Evidence must reflect current state.

6. **Scope creep** — The manifest documents ONE defect. If you found three bugs during investigation, create three manifests (or note the others as "related but out of scope").

7. **Forgetting acceptance criteria** — The manifest must define what "fixed" looks like. Without acceptance criteria, the debugging agent doesn't know when they're done.

8. **Not including the working path's code** — If there's a working analogue, embed its code side-by-side with the broken path. The diff IS the debugging signal.

---

## Quick Self-Test

After writing the manifest, answer these four questions:

1. **Can a fresh agent reproduce the defect in <5 minutes?** If the reproduction protocol requires guessing, exploring, or asking questions — it's incomplete.

2. **Is every claim backed by evidence?** Scan the manifest for assertions. Each one should have an E-item. If you find an unbacked claim, add the evidence or remove the claim.

3. **Could the top hypothesis be verified in <15 minutes?** If the verification steps are vague or require extensive exploration, they're not specific enough.

4. **Do the acceptance criteria use the SAME commands as the evidence?** The evidence proves the defect exists; the acceptance criteria should prove it's gone — ideally with the same commands producing different (correct) output.
