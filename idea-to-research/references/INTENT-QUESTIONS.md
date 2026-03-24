# Intent Understanding Framework

> Use this framework during Phase 1 to deeply understand user intent before conducting research.

---

## Core Principle

**UNDERSTAND BEFORE YOU RESEARCH.**

The quality of research directly depends on understanding intent. A misunderstood feature
leads to wasted research and misaligned recommendations.

---

## The 5 Pillars of Intent

### 1. PROBLEM (What problem is being solved?)

**Questions to answer:**
- What pain point or gap does this address?
- Why does this problem exist?
- What's the impact of NOT solving it?
- Who experiences this problem most acutely?

**Red flags of unclear intent:**
- Solution described without problem context
- Feature request without user benefit
- Technical implementation without "why"

### 2. USERS (Who will use this?)

**Questions to answer:**
- Who is the primary user?
- Who are secondary users?
- What's their technical level?
- What's their current workflow?

**User Types:**
| Type | Needs | Considerations |
|------|-------|----------------|
| End User | Simplicity, reliability | UX, error handling |
| Developer | APIs, flexibility | DX, documentation |
| Admin | Control, visibility | Permissions, logging |
| System | Automation, reliability | Performance, stability |

### 3. SUCCESS (What does "done" look like?)

**Questions to answer:**
- What's the definition of done?
- How will success be measured?
- What's the MVP vs full vision?
- What would exceed expectations?

**Success Criteria Categories:**
- Functional: What must it DO?
- Performance: How FAST must it be?
- Reliability: How AVAILABLE must it be?
- Security: What PROTECTION is needed?
- UX: How EASY must it be?

### 4. SCOPE (What's in and out?)

**Questions to answer:**
- What's explicitly in scope?
- What's explicitly out of scope?
- What's deferred to later?
- Where might scope creep occur?

**Scope Zones:**
```
┌─────────────────────────────────────────────────────┐
│                     FULL VISION                      │
│  ┌───────────────────────────────────────────────┐  │
│  │               PHASE 2 / FUTURE                 │  │
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │             MVP / MUST HAVE              │  │  │
│  │  │                                          │  │  │
│  │  │     ← Focus research HERE first          │  │  │
│  │  │                                          │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  │                                               │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
└─────────────────────────────────────────────────────┘
```

### 5. CONSTRAINTS (What limits exist?)

**Questions to answer:**
- Technical constraints (existing architecture)?
- Resource constraints (time, budget, team)?
- Compatibility constraints (browsers, devices)?
- Business constraints (compliance, security)?
- External constraints (3rd party limitations)?

---

## Question Decision Tree

Use this decision tree to determine what to ask the user:

```
                        User provides idea
                              │
                              ▼
                   Is the PROBLEM clear?
                      /           \
                    No             Yes
                    │               │
                    ▼               ▼
         ASK: "What problem      Is the USER clear?
         does this solve?"         /           \
                                 No             Yes
                                 │               │
                                 ▼               ▼
                      ASK: "Who will        Is SUCCESS clear?
                      use this?"               /           \
                                             No             Yes
                                             │               │
                                             ▼               ▼
                                  ASK: "What does       Is SCOPE clear?
                                  success look like?"      /           \
                                                         No             Yes
                                                         │               │
                                                         ▼               ▼
                                              ASK: "What's in    Are CONSTRAINTS
                                              MVP vs future?"    known?
                                                                    /           \
                                                                  No             Yes
                                                                  │               │
                                                                  ▼               ▼
                                                       ASK: "Any        PROCEED TO
                                                       constraints?"    RESEARCH
```

---

## AskUserQuestion Guidelines

### When to Ask

**DO ask when:**
- Problem is unclear and would change research direction
- Multiple valid interpretations exist
- Scope is ambiguous on core functionality
- Technical constraints would change approach

**DON'T ask when:**
- Answer can be found in codebase
- Question is about implementation detail
- Question is about technology choice (that's your job)
- Answer doesn't significantly impact research

### How to Ask

**Good questions are:**
- Focused (one topic per question)
- Provide options when possible
- Explain why it matters
- Actionable regardless of answer

**Example - Good:**
```
Question: "Should the collaboration feature support real-time updates or is eventual consistency acceptable?"

Options:
A) Real-time (< 100ms latency) - Requires WebSocket infrastructure
B) Near-real-time (< 2 seconds) - Can use polling/SSE
C) Eventual (< 30 seconds) - Simple HTTP sync sufficient

Why this matters: This significantly impacts architecture complexity and technology choices.
```

**Example - Bad:**
```
Question: "How should I implement this feature?"
```
(Too broad, not your user's job to design)

### Maximum Questions

**Limit to 2-4 questions total in Phase 1.**

If you need more, you likely don't understand the domain well enough.
Do more codebase exploration before asking.

---

## Intent Analysis Template

After gathering information, document intent:

```markdown
## Intent Summary

### Problem Statement
{One clear sentence describing the problem}

### User Context
- Primary user: {who}
- User workflow: {what they do today}
- Pain point: {specific pain}

### Success Definition
{What "done" looks like}

### Scope Boundaries
| In Scope | Out of Scope |
|----------|--------------|
| {item} | {item} |

### Constraints
- {constraint 1}
- {constraint 2}

### User Clarifications
| Question | Answer |
|----------|--------|
| {Q} | {A} |

### Research Direction
Based on intent, focus research on:
1. {Area 1}
2. {Area 2}
3. {Area 3}
```

---

## Common Intent Patterns

### Pattern: "Add Feature X"

**Unpack by asking:**
- What triggers the need for X?
- What happens before/after X?
- What existing features does X interact with?

### Pattern: "Improve Performance"

**Unpack by asking:**
- What specifically is slow?
- What's the current measurement?
- What's the target measurement?
- Who notices the slowness?

### Pattern: "Fix Bug Y"

**Unpack by asking:**
- What's the expected behavior?
- What's the actual behavior?
- What's the impact/severity?
- When did this start?

### Pattern: "Integrate with Z"

**Unpack by asking:**
- What data flows between systems?
- Who initiates the integration?
- What's the sync frequency needed?
- What happens when Z is unavailable?

---

## Warning Signs of Incomplete Intent

| Warning Sign | What's Missing | Action |
|--------------|----------------|--------|
| "Just do X" | Problem context | Ask WHY |
| Technical spec only | User value | Ask WHO BENEFITS |
| "Like competitor Y" | Unique requirements | Ask WHAT'S DIFFERENT |
| Very broad request | Scope definition | Ask MVP SCOPE |
| No constraints mentioned | Reality check | Ask CONSTRAINTS |

---

## Final Checklist

Before proceeding to Phase 2, verify:

- [ ] I can explain the problem in one sentence
- [ ] I know who the primary user is
- [ ] I know what success looks like
- [ ] I know what's in MVP scope
- [ ] I know major constraints
- [ ] Any ambiguities would NOT change research direction
- [ ] I've asked maximum 2-4 clarifying questions
