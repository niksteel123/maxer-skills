---
name: idea-to-research
description: Transform feature ideas into comprehensive research documents. Deep intent analysis, internal codebase study, external tech stack research, and synthesized research output. Works on any codebase.
---

# Idea to Research Skill

> Transform the seed of a feature idea into a comprehensive, high-fidelity research document.

---

# ⚠️ CRITICAL: READ THIS FIRST ⚠️

## Why This Document Matters More Than Any Other

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   THIS RESEARCH DOCUMENT IS THE FOUNDATION OF EVERYTHING.                                │
│                                                                                          │
│   A rushed or shallow research document will cause:                                      │
│   • Wrong technology choices → painful migrations later                                  │
│   • Missed integration points → broken features in production                            │
│   • Incomplete understanding → endless rework and patches                                │
│   • Poor architectural decisions → technical debt for years                              │
│   • Wasted implementation time → features that don't fit                                 │
│                                                                                          │
│   A thorough research document will cause:                                               │
│   • Clean integration → code that fits naturally                                         │
│   • Right tools chosen → smooth implementation                                           │
│   • All edge cases known → robust, complete features                                     │
│   • Informed decisions → confident architecture                                          │
│   • Efficient implementation → no surprises, no rework                                   │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**THE QUALITY OF THIS RESEARCH DIRECTLY DETERMINES THE QUALITY OF THE FEATURE.**

There is no shortcut. There is no "good enough." Every hour invested in research saves 10 hours of implementation pain. Every detail missed here becomes a bug, a refactor, or a rewrite later.

---

## The Pipeline: Why You Are The Foundation

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│   [idea-to-research] ─────────────────┐                                                  │
│         ↑                             │                                                  │
│    YOU ARE HERE                       │                                                  │
│    This is where quality              ▼                                                  │
│    is won or lost            [research-to-spec]                                          │
│                                       │                                                  │
│                                       │  ← Spec quality depends on research quality      │
│                                       ▼                                                  │
│                              [spec-to-strategy]                                          │
│                                       │                                                  │
│                                       │  ← Strategy orders what spec defines             │
│                                       ▼                                                  │
│                              [beads-from-sources]                                        │
│                                       │                                                  │
│                                       │  ← Beads embed spec + TDD verbatim               │
│                                       ▼                                                  │
│                           [beads-to-execution]                                           │
│                                       │                                                  │
│                                       │  ← Implementation quality depends on beads       │
│                                       ▼                                                  │
│                              FINISHED FEATURE                                            │
│                                                                                          │
│   GARBAGE IN → GARBAGE OUT at every stage                                                │
│   QUALITY IN → QUALITY OUT at every stage                                                │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

**You are not just "researching." You are laying the foundation that everything else builds upon.**

---

## What ULTRATHINK Actually Means

ULTRATHINK is not a buzzword. It is a specific cognitive approach required for Phases 1 and 4.

### ULTRATHINK Methodology

```
ULTRATHINK = Extended, deliberate, multi-perspective reasoning

It means:
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                          │
│  1. SLOW DOWN                                                                            │
│     • Do not rush to conclusions                                                         │
│     • Spend 3-5x longer than feels "necessary"                                           │
│     • The first answer is rarely the best answer                                         │
│                                                                                          │
│  2. QUESTION EVERYTHING                                                                  │
│     • Why does the user want this?                                                       │
│     • What are they NOT saying?                                                          │
│     • What assumptions am I making?                                                      │
│     • What would break my understanding?                                                 │
│                                                                                          │
│  3. EXPLORE ALTERNATIVES                                                                 │
│     • What are 3 other ways to interpret this?                                           │
│     • What would a skeptic say?                                                          │
│     • What would an expert in this domain consider obvious?                              │
│     • What am I missing?                                                                 │
│                                                                                          │
│  4. BUILD MENTAL MODELS                                                                  │
│     • Can I draw this? Can I diagram the data flow?                                      │
│     • Can I explain this to someone unfamiliar?                                          │
│     • Do all the pieces connect coherently?                                              │
│     • Where are the gaps in my understanding?                                            │
│                                                                                          │
│  5. STRESS TEST                                                                          │
│     • What happens at scale?                                                             │
│     • What happens when things go wrong?                                                 │
│     • What are the edge cases?                                                           │
│     • What would make this fail?                                                         │
│                                                                                          │
│  6. SYNTHESIZE                                                                           │
│     • How does everything connect?                                                       │
│     • What's the coherent whole?                                                         │
│     • What's the story I can tell?                                                       │
│     • Is this complete enough to act on?                                                 │
│                                                                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### What ULTRATHINK Feels Like

**WRONG (Shallow thinking):**
```
User wants real-time collaboration. I'll use WebSockets and a CRDT library.
→ Move to next phase.
```

**RIGHT (ULTRATHINK):**
```
User wants real-time collaboration. Let me deeply understand:

WHY do they want this?
- Multiple users editing simultaneously
- But WHY? Team productivity? Client collaboration?
- Does "real-time" mean < 100ms or just "not manual refresh"?

WHAT does "collaboration" actually mean here?
- Just presence? (who's viewing)
- Cursor positions?
- Full operational transform / CRDT?
- Comments and annotations?
- Version history?

WHERE does this fit in the existing system?
- What's the current data model?
- How is state managed now?
- What's the auth model - will it work for shared sessions?
- Are there existing patterns for shared state?

WHAT could go wrong?
- Conflict resolution - what if two users edit same thing?
- Network partitions - offline support needed?
- Scale - how many concurrent users per document?
- Security - can users see each other's cursors/presence?

WHAT are the options?
- WebSocket + CRDT (Yjs, Automerge)
- WebSocket + OT (Google Docs style)
- Polling + last-write-wins (simple but limited)
- Third party service (Liveblocks, PartyKit)

Each option has different complexity, capability, and constraints.
I need to understand more before recommending...
```

---

## Effort Expectations By Phase

| Phase | Minimum Effort | What "Thorough" Looks Like |
|-------|----------------|---------------------------|
| **Phase 0** | 5-10 minutes | Complete project context documented |
| **Phase 1** | 20-45 minutes | Deep intent understood, user clarified |
| **Phase 2** | 45-90 minutes | 2-4 agents, 50+ files examined |
| **Phase 3** | 45-90 minutes | 3+ technologies compared, docs read |
| **Phase 4** | 30-60 minutes | Full mental model constructed |
| **Phase 5** | 60-120 minutes | 2-5k line document written |
| **Phase 6** | 15-30 minutes | All validations complete |

**TOTAL MINIMUM: 3-6+ hours for a medium complexity feature**

If you're finishing in under 2 hours, you're almost certainly cutting corners.

---

## Quality Gates: STOP Points Between Phases

**DO NOT proceed to the next phase until you can answer YES to every question.**

### Gate 0 → 1: Project Discovery Complete
- [ ] I know the project type (monorepo/single) and structure
- [ ] I know the tech stack (language, framework, build system)
- [ ] I know where source, tests, and docs live
- [ ] I know where to output the research document

### Gate 1 → 2: Intent Fully Understood
- [ ] I can explain the problem being solved in one sentence
- [ ] I know who the primary users are
- [ ] I know what success looks like
- [ ] I know what's in MVP scope vs future
- [ ] I've asked user clarifying questions (or none needed)
- [ ] I've spent at least 20 minutes thinking about intent

### Gate 2 → 3: Codebase Thoroughly Explored
- [ ] I launched at least 2 Explore agents (3-4 for complex features)
- [ ] I examined 50+ files (100+ for complex features)
- [ ] I found all relevant existing patterns
- [ ] I mapped all integration points (DB, API, services, frontend)
- [ ] I documented files to read, modify, and create
- [ ] I identified reusable abstractions

### Gate 3 → 4: Technology Research Complete
- [ ] I evaluated 3+ technology options for each major need
- [ ] I read official documentation (not just READMEs)
- [ ] I found comparison articles and benchmarks
- [ ] I researched best practices and common pitfalls
- [ ] I documented pros/cons with specific evidence

### Gate 4 → 5: Synthesis Complete
- [ ] I can draw the full system architecture
- [ ] I can trace data flow from user action to storage
- [ ] I identified all risks and mitigations
- [ ] I documented all architectural decisions with trade-offs
- [ ] I spent at least 30 minutes on synthesis thinking
- [ ] Everything connects into a coherent whole

### Gate 5 → 6: Document Complete
- [ ] Document is 2,000+ lines (3,000+ for complex features)
- [ ] All 11 sections are substantive (not placeholder)
- [ ] All file paths are valid and verified
- [ ] All recommendations include rationale
- [ ] Document can stand alone for implementation

---

## Anti-Patterns: What NOT To Do

### ❌ The Speedrun

```
BAD:
"User wants webhooks. I'll use Bull for queues and webhook.site for testing.
Here's a 500 line research doc."

Why it's bad:
- No understanding of WHY webhooks
- No codebase analysis for integration points
- No comparison of queue technologies
- No security considerations
- No failure handling analysis
- Implementer will have dozens of questions
```

### ❌ The Surface Skim

```
BAD:
"I searched for 'webhook' in the codebase and found 3 files.
I looked at the README for Bull. It seems fine."

Why it's bad:
- 3 files is not thorough exploration
- README is not documentation
- "Seems fine" is not analysis
- No patterns documented
- No integration points mapped
```

### ❌ The Copy-Paste Research

```
BAD:
"Here's what the Bull documentation says: [paste 500 lines]
Here's what the existing webhook file does: [paste code]"

Why it's bad:
- No analysis, just copying
- No synthesis of information
- No recommendations or decisions
- No original thinking
- Implementer could have done this themselves
```

### ❌ The Assumption Train

```
BAD:
"The user wants real-time, so they need WebSockets.
WebSockets means Socket.io. Socket.io needs Redis.
Therefore, add Redis and Socket.io."

Why it's bad:
- Chained assumptions without validation
- No alternatives considered
- No trade-offs documented
- Intent not verified
- May be completely wrong direction
```

### ❌ The Checkbox Completion

```
BAD:
"Phase 1: ✓ (read user message)
Phase 2: ✓ (ran one search)
Phase 3: ✓ (found one library)
Phase 4: ✓ (wrote summary)
Phase 5: ✓ (made document)"

Why it's bad:
- Phases are not checkboxes
- Minimum effort at each phase
- No depth anywhere
- Document will be shallow
- Implementer will struggle
```

---

## What Good Looks Like: Concrete Examples

### Example: Thorough Intent Understanding

```markdown
## Intent Analysis: Real-Time Collaboration Feature

### Problem Statement
The user wants multiple team members to edit documents simultaneously
without conflicts or lost work.

### Deep Analysis

**Why this is needed:**
Through questioning, I learned:
- Currently, team members email documents back and forth
- They've lost work due to conflicting edits multiple times
- The CEO specifically requested this after a major incident

**What "real-time" means to them:**
- User clarified: < 500ms is acceptable, not gaming-level latency
- Offline support is NOT required (always-online assumption is fine)
- This is for internal team only (5-20 concurrent editors max)

**What "collaboration" includes:**
- [Must Have] See who else is viewing the document
- [Must Have] See where others are editing (cursor position)
- [Must Have] Changes appear without refresh
- [Nice to Have] Comments and annotations
- [Future] Version history and undo

**Success Criteria:**
1. Two users can edit the same document with changes visible within 500ms
2. Conflicting edits are resolved automatically without data loss
3. Users can see a list of who else is viewing/editing
4. System handles 20 concurrent editors without degradation

**Scope Boundaries:**
- IN: Core editing, presence, cursor sharing
- OUT: Comments, version history, offline support
- DEFERRED: Mobile app support, public sharing

**Constraints Discovered:**
- Must use existing auth system (JWT-based)
- Cannot add new databases (must use existing PostgreSQL)
- Team has no WebSocket experience (learning curve consideration)
```

### Example: Thorough Codebase Exploration

```markdown
## Codebase Analysis: Integration Points for Webhooks

### Exploration Summary
- Launched 4 Explore agents
- Examined 127 files across 8 directories
- Found 23 directly relevant patterns

### Existing Event System (CRITICAL)

**Location:** `src/events/`

Found a complete event bus implementation that must be leveraged:

```typescript
// src/events/EventBus.ts:15-45
export class EventBus {
  private handlers: Map<string, EventHandler[]> = new Map();

  emit(event: string, payload: unknown): void {
    const handlers = this.handlers.get(event) || [];
    handlers.forEach(h => h(payload));
  }

  on(event: string, handler: EventHandler): () => void {
    // ...
  }
}
```

**Relevance:** Webhooks should subscribe to this event bus rather than
creating a parallel notification system. This ensures all events are
available for webhooks without modifying every event source.

**Integration approach:**
Create a `WebhookEventBridge` that listens to EventBus and dispatches
to registered webhooks. This is cleaner than modifying each event emitter.

### Database Patterns

**Location:** `src/db/`

The codebase uses Drizzle ORM with this pattern:

```typescript
// src/db/schema/users.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
```

**Webhook tables should follow this pattern exactly.**

### API Route Patterns

**Location:** `src/routes/`

All routes follow this structure:

```typescript
// src/routes/users.ts
export const usersRoutes = new Hono()
  .get('/', authMiddleware, async (c) => { ... })
  .post('/', authMiddleware, validateBody(schema), async (c) => { ... })
```

**Webhook routes must use:**
- `authMiddleware` for all endpoints
- `validateBody(schema)` for POST/PUT
- Consistent error response format

### Files to Study (with line numbers)

| Priority | File | Lines | Why |
|----------|------|-------|-----|
| 1 | `src/events/EventBus.ts` | 1-100 | Core event system to integrate with |
| 2 | `src/db/schema/index.ts` | all | Database patterns and conventions |
| 3 | `src/routes/users.ts` | 1-150 | Route pattern reference |
| 4 | `src/services/NotificationService.ts` | 1-200 | Similar async dispatch pattern |
| 5 | `src/middleware/auth.ts` | all | Auth middleware to reuse |

### Files to Modify

| File | Modification | Impact |
|------|--------------|--------|
| `src/events/EventBus.ts` | Add webhook bridge subscription | Low - additive |
| `src/db/schema/index.ts` | Export webhook tables | Low - additive |
| `src/routes/index.ts` | Register webhook routes | Low - additive |

### New Files Needed

| File | Purpose | Pattern Source |
|------|---------|----------------|
| `src/db/schema/webhooks.ts` | Webhook config storage | `src/db/schema/users.ts` |
| `src/routes/webhooks.ts` | CRUD endpoints | `src/routes/users.ts` |
| `src/services/WebhookService.ts` | Dispatch logic | `src/services/NotificationService.ts` |
| `src/events/WebhookBridge.ts` | Event bus bridge | Custom, integrates with EventBus |
```

---

## The 7 Phases: Detailed Protocols

## Phase 0: PROJECT DISCOVERY

**Duration:** 5-15 minutes
**Goal:** Understand project structure, tech stack, conventions
**Gate:** Can describe project type, tech stack, and output location

### Protocol

#### Step 0.1: Find Project Root

```bash
# Search for these markers
.git/                    # Git repository root
package.json             # Node.js project
Cargo.toml               # Rust project
pyproject.toml           # Python project
go.mod                   # Go project
pom.xml / build.gradle   # Java project
Gemfile                  # Ruby project
```

#### Step 0.2: Identify Tech Stack

| Detection File | Tech Stack | Package Manager |
|----------------|------------|-----------------|
| `tsconfig.json` | TypeScript | npm/yarn/pnpm/bun |
| `package.json` (only) | JavaScript | npm/yarn/pnpm |
| `pyproject.toml` | Python | pip/poetry/uv |
| `Cargo.toml` | Rust | cargo |
| `go.mod` | Go | go modules |
| `pom.xml` | Java (Maven) | maven |
| `build.gradle` | Java (Gradle) | gradle |

#### Step 0.3: Map Structure

Find these directories:
- **Source:** `src/`, `lib/`, `app/`, `packages/*/src/`
- **Tests:** `__tests__/`, `tests/`, `test/`, `spec/`
- **Docs:** `docs/`, `documentation/`
- **Config:** `config/`, `.config/`

#### Step 0.4: Detect Patterns

Search for existing research/spec documents:
- `*-research.md`
- `*-spec.md`
- `*-rfc.md`
- `*-design.md`

#### Step 0.5: Set Output Location

```
Priority:
1. docs/research/ (if docs/ exists)
2. thoughts/research/ (if thoughts/ exists)
3. Create docs/research/
```

**Filename:** `{YYYY-MM-DD}-{feature-slug}-research.md`

---

## Phase 1: INTENT UNDERSTANDING (ULTRATHINK REQUIRED)

**Duration:** 20-45 minutes minimum
**Goal:** Deeply understand what user wants and why
**Gate:** Can explain problem, users, success criteria, scope, and constraints

### The ULTRATHINK Process for Intent

This is not a quick read. This is deep, deliberate analysis.

#### Step 1.1: Read User Input Multiple Times

Read the user's description at least 3 times:
1. First read: What are they literally saying?
2. Second read: What are they implying but not saying?
3. Third read: What questions does this raise?

#### Step 1.2: The Five WHYs

For each stated requirement, ask WHY five times:

```
User says: "I need real-time collaboration"

Why? → Because multiple people need to edit simultaneously
Why? → Because the current workflow has them emailing documents
Why? → Because there's no shared editing capability
Why? → Because the original design assumed single-user editing
Why? → Because it was built as an MVP

Now I understand: This is a fundamental architecture upgrade,
not just adding a feature. The implications are significant.
```

#### Step 1.3: Map the Problem Space

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ PROBLEM SPACE MAPPING                                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│ WHAT is the problem?                                                         │
│ ├── Explicit problem stated by user                                          │
│ ├── Implicit problems I can infer                                            │
│ └── Related problems this might reveal                                       │
│                                                                              │
│ WHO has this problem?                                                        │
│ ├── Primary users (who's most affected)                                      │
│ ├── Secondary users (who else is impacted)                                   │
│ └── Non-users who are affected (admins, ops)                                 │
│                                                                              │
│ WHEN does this problem occur?                                                │
│ ├── Frequency (constant / occasional / rare)                                 │
│ ├── Trigger conditions                                                       │
│ └── Severity when it occurs                                                  │
│                                                                              │
│ WHERE in the system does this live?                                          │
│ ├── Which layers are affected                                                │
│ ├── Which existing features interact                                         │
│ └── What external systems are involved                                       │
│                                                                              │
│ WHY hasn't this been solved before?                                          │
│ ├── Technical complexity?                                                    │
│ ├── Priority / resources?                                                    │
│ ├── Unclear requirements?                                                    │
│ └── Dependencies on other work?                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Step 1.4: Identify Ambiguities

List every ambiguity that could change the research direction:

| Ambiguity | Why It Matters | Options |
|-----------|---------------|---------|
| "Real-time" - what latency? | Determines tech (WebSocket vs polling) | <100ms, <500ms, <2s |
| "Multiple users" - how many? | Affects architecture scale | 2-5, 10-50, 100+ |
| Offline support needed? | Adds significant complexity | Required, Nice-to-have, No |

#### Step 1.5: Ask User Questions

Use `AskUserQuestion` for ambiguities that would **significantly change research direction**.

**Good questions:**
- Change approach based on answer
- Have clear, distinct options
- Explain why it matters

**Don't ask:**
- Things you can find in codebase
- Implementation details
- Technology preferences (that's your job)

#### Step 1.6: Document Intent Summary

Create comprehensive intent summary (this is input to all future phases):

```markdown
## Intent Summary

### Core Problem
{One clear sentence}

### User Stories
As a {user type}, I want to {action} so that {benefit}.

### Success Criteria
1. {Specific, measurable criterion}
2. {Specific, measurable criterion}
3. {Specific, measurable criterion}

### Scope Definition
| Category | Items |
|----------|-------|
| Must Have (MVP) | {item 1}, {item 2} |
| Should Have (v1.1) | {item 1}, {item 2} |
| Won't Have (Out of Scope) | {item 1}, {item 2} |

### Constraints
- Technical: {constraint}
- Resource: {constraint}
- Business: {constraint}

### User Clarifications
- Q: {question asked}
- A: {user's answer}

### Research Direction
Based on intent analysis, prioritize researching:
1. {area 1} because {reason}
2. {area 2} because {reason}
```

---

## Phase 2: INTERNAL CODEBASE RESEARCH

**Duration:** 45-90 minutes minimum
**Goal:** Deep understanding of codebase for integration
**Gate:** 50+ files examined, all integration points mapped, patterns documented

### The Exploration Mindset

You are an archaeologist exploring a complex system. Your job is to:
1. Understand how this system was built
2. Find where the new feature fits
3. Discover patterns to follow
4. Identify abstractions to reuse
5. Map all integration points

### Launch Parallel Explore Agents

**ALWAYS launch at least 2 agents. 3-4 for complex features.**

Each agent should have a specific focus:

#### Agent 1: Architecture & Core Patterns

```
PROMPT FOR AGENT 1:

Explore the codebase architecture for {project_name}.

I need to understand:

1. OVERALL ARCHITECTURE
   - Is this a monolith, microservices, serverless, or hybrid?
   - What's the directory structure pattern?
   - How are features/modules organized?

2. DESIGN PATTERNS
   - Service layer patterns
   - Repository/data access patterns
   - Middleware patterns
   - Error handling patterns
   - Logging patterns

3. STATE MANAGEMENT
   - How is application state managed?
   - How is database state managed?
   - Any event sourcing or CQRS patterns?

4. CONFIGURATION
   - How is configuration handled?
   - Environment variables pattern?
   - Feature flags?

Search for:
- *Service.ts, *Repository.ts, *Controller.ts
- Base classes, interfaces, abstract classes
- middleware/, interceptors/, decorators/
- config/, .env files

For each pattern found, document:
- File path and line numbers
- Code example
- When to use this pattern
```

#### Agent 2: Related Features & Similar Implementations

```
PROMPT FOR AGENT 2:

Find features similar to {feature_description} in this codebase.

I need to understand:

1. EXISTING SIMILAR FEATURES
   - What features solve similar problems?
   - How were they implemented?
   - What patterns do they use?

2. REUSABLE COMPONENTS
   - What utilities exist that could be reused?
   - What base classes or helpers are available?
   - What shared types/interfaces exist?

3. IMPLEMENTATION PATTERNS
   - How do similar features handle errors?
   - How do they handle validation?
   - How do they handle auth/permissions?

Search for:
- Features with keywords: {relevant keywords}
- Similar functionality patterns
- Shared utilities in utils/, helpers/, common/

For each finding, document:
- Why it's relevant
- What patterns to follow
- What code to reuse
```

#### Agent 3: Integration Points & Data Layer

```
PROMPT FOR AGENT 3:

Map all integration points for a new {feature_type} feature.

I need to understand:

1. DATABASE LAYER
   - Database type (PostgreSQL, MongoDB, etc.)
   - ORM/query builder used
   - Schema definition patterns
   - Migration patterns
   - Existing tables/models that relate

2. API LAYER
   - Framework used (Express, Hono, Fastify)
   - Route definition patterns
   - Request validation patterns
   - Response format patterns
   - Authentication middleware

3. EXTERNAL INTEGRATIONS
   - What external services are used?
   - How are API clients structured?
   - Error handling for external calls

Search for:
- db/, database/, models/, schema/
- routes/, api/, controllers/
- clients/, integrations/, external/

For each integration point, document:
- Current implementation location
- How new feature will integrate
- Any modifications needed
```

#### Agent 4: Testing Patterns & Quality

```
PROMPT FOR AGENT 4:

Understand testing patterns in this codebase.

I need to understand:

1. TEST STRUCTURE
   - Where do tests live?
   - Test file naming conventions
   - Test organization (unit, integration, e2e)

2. TEST UTILITIES
   - Test helpers and utilities
   - Mock implementations
   - Test factories/fixtures
   - Database seeding for tests

3. TESTING PATTERNS
   - How are services tested?
   - How are routes tested?
   - How is authentication mocked?
   - How are external services mocked?

Search for:
- __tests__/, tests/, *.test.ts, *.spec.ts
- test-utils/, helpers/, mocks/, fixtures/
- jest.config.*, vitest.config.*, pytest.ini

For each pattern, document:
- Example with file path
- When to use this pattern
- How to apply to new feature
```

### What to Document From Exploration

For every relevant finding:

```markdown
### Finding: {Descriptive Name}

**Location:** `{file_path}:{start_line}-{end_line}`

**Relevance to Feature:**
{Why this matters for the new feature}

**Pattern/Code:**
```{language}
{Relevant code snippet - keep focused, not entire file}
```

**How to Use:**
{Specific guidance on how to apply this to new feature}

**Integration Notes:**
{Any specific considerations for integration}
```

### Create Comprehensive File Reference Map

This is CRITICAL for implementers. Be exhaustive.

```markdown
## File Reference Map

### Files to Read Before Implementation

**Critical (Must read before starting):**
| File | Lines | What to Understand |
|------|-------|-------------------|
| `{path}` | {range} | {specific concepts} |

**Important (Read for context):**
| File | What It Provides |
|------|------------------|
| `{path}` | {context it provides} |

**Reference (Good examples to follow):**
| File | Pattern It Demonstrates |
|------|------------------------|
| `{path}` | {pattern name} |

### Files to Modify

| File | What Changes | Why | Risk Level |
|------|--------------|-----|------------|
| `{path}` | {specific changes} | {reason} | Low/Med/High |

### New Files to Create

| File | Purpose | Pattern Source |
|------|---------|----------------|
| `{path}` | {purpose} | Based on `{reference file}` |

### Test Files Required

| Test File | What It Tests | Pattern Source |
|-----------|---------------|----------------|
| `{path}` | {test scope} | Based on `{reference test}` |
```

---

## Phase 3: EXTERNAL TECH STACK RESEARCH

**Duration:** 45-90 minutes minimum
**Goal:** Find best tools, understand integration, learn best practices
**Gate:** 3+ options compared per major need, documentation read, recommendations made

### Research Depth Expectations

**This is NOT:**
- Reading one README
- Skimming one comparison article
- Choosing the first popular option

**This IS:**
- Evaluating 3+ alternatives for each major need
- Reading official documentation (not just READMEs)
- Understanding integration patterns from docs
- Finding gotchas and limitations
- Researching security implications
- Understanding performance characteristics

### Research Protocol for Each Technology Need

#### Step 1: Discovery (10-15 minutes per category)

```
Tool: mcp__exa__get_code_context_exa
Query: "{language} {problem} library comparison 2024 2025"

Example: "TypeScript WebSocket library comparison 2025"
         "Python background job queue library comparison 2025"
```

Create shortlist of 3-5 candidates.

#### Step 2: Quick Evaluation (5 minutes per candidate)

Check each candidate:
- GitHub stars and activity
- Last commit date
- Open issues vs closed ratio
- npm/PyPI downloads
- TypeScript support (if applicable)

Narrow to top 3 for deep research.

#### Step 3: Documentation Deep Dive (15-20 minutes per finalist)

```
Tool: mcp__Ref__ref_search_documentation
Query: "{library} documentation {topic}"

Tool: mcp__Ref__ref_read_url
URL: {specific doc page}
```

**READ THESE SECTIONS:**
- Getting started / Installation
- Core concepts / How it works
- API reference for key methods
- Configuration options
- Error handling
- TypeScript types (if applicable)
- Migration guides (if upgrading)
- Known limitations / Gotchas

**DOCUMENT:**
- Key capabilities
- Integration approach
- Configuration needed
- Potential issues

#### Step 4: Comparison (10 minutes)

```
Tool: mcp__exa__web_search_exa
Query: "{library A} vs {library B} {year}"
       "{library} production experience"
       "{library} problems issues"
```

Find:
- Direct comparisons
- Production experiences
- Common problems
- Migration stories

#### Step 5: Best Practices Research (15-20 minutes)

```
Tool: mcp__exa__web_search_exa
Query: "{feature type} architecture best practices {year}"
       "{feature type} security considerations"
       "{feature type} scalability patterns"
       "{feature type} common mistakes"
```

Document:
- Industry patterns
- Security considerations
- Performance optimizations
- Common pitfalls to avoid

### Documentation Standard for Each Technology

```markdown
## Technology: {Name}

### Overview
{What it does and why it's being considered}

### Health Check
| Metric | Value | Assessment |
|--------|-------|------------|
| GitHub Stars | {count} | {good/concerning} |
| Weekly Downloads | {count} | {good/concerning} |
| Last Commit | {date} | {good/concerning} |
| Open Issues | {count} | {good/concerning} |
| Contributors | {count} | {good/concerning} |
| License | {license} | {compatible/issue} |

### Evaluation Scores

| Criterion | Weight | Score (1-5) | Notes |
|-----------|--------|-------------|-------|
| Functionality | 25% | {score} | {specific notes} |
| Maintenance | 20% | {score} | {specific notes} |
| Community | 15% | {score} | {specific notes} |
| Documentation | 15% | {score} | {specific notes} |
| Compatibility | 15% | {score} | {specific notes} |
| License | 10% | {score} | {specific notes} |
| **Weighted Total** | 100% | **{total}** | |

### Strengths
- {Strength 1 with evidence}
- {Strength 2 with evidence}

### Weaknesses
- {Weakness 1 with evidence}
- {Weakness 2 with evidence}

### Integration Approach
{How this would integrate with existing codebase}

```{language}
// Example integration code
{code example}
```

### Documentation Links
- [Official Docs]({url})
- [API Reference]({url})
- [Examples]({url})
- [Migration Guide]({url}) (if applicable)

### Key Configuration
```{language}
// Required configuration
{config example}
```

### Potential Issues
1. {Issue 1}: {mitigation}
2. {Issue 2}: {mitigation}

### Recommendation
{RECOMMEND / ACCEPTABLE / NOT RECOMMENDED}

{Detailed rationale for recommendation}
```

---

## Phase 4: DEEP REASONING & SYNTHESIS (ULTRATHINK REQUIRED)

**Duration:** 30-60 minutes minimum
**Goal:** Synthesize all research into coherent implementation picture
**Gate:** Can draw architecture, trace data flows, identify all decisions

### Why This Phase is THE MOST IMPORTANT

Phases 1-3 gathered information. Phase 4 transforms information into understanding.

Without proper synthesis:
- You have facts but no coherent picture
- Recommendations don't connect
- Implementer has to figure out how pieces fit
- Critical gaps go unnoticed
- Architecture doesn't hold together

With proper synthesis:
- Everything connects into a coherent whole
- Recommendations flow from understanding
- Implementer has clear path forward
- Gaps are identified and addressed
- Architecture is sound and complete

### The Synthesis Process

#### Step 4.1: Build the Mental Model (20+ minutes)

Close your metaphorical eyes. Visualize the complete system.

```
MENTAL MODEL CONSTRUCTION:

1. START WITH USER ACTION
   - User clicks button / makes request / triggers event
   - What happens first?

2. TRACE THE DATA FLOW
   - Where does the request go?
   - What data is needed?
   - What transformations happen?
   - What services are involved?
   - What external calls are made?
   - Where does data get stored?
   - What response comes back?

3. IDENTIFY EVERY COMPONENT
   - Frontend components
   - API endpoints
   - Service functions
   - Database tables
   - External integrations
   - Background jobs
   - Event handlers

4. MAP THE DEPENDENCIES
   - What depends on what?
   - What order must things happen?
   - What can happen in parallel?
   - What blocks what?

5. FIND THE COMPLEXITY
   - Where is the hard part?
   - What could go wrong?
   - What needs the most attention?
   - What is error-prone?
```

#### Step 4.2: Draw the Architecture

Actually create an ASCII diagram:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          SYSTEM ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────┐      ┌──────────────┐      ┌───────────────┐                  │
│  │  Client  │ ───▶ │  API Routes  │ ───▶ │   Services    │                  │
│  │  (React) │      │   (Hono)     │      │               │                  │
│  └──────────┘      └──────────────┘      └───────┬───────┘                  │
│                           │                      │                           │
│                           │                      ▼                           │
│                    ┌──────┴──────┐      ┌───────────────┐                   │
│                    │  WebSocket  │      │   Database    │                   │
│                    │   Server    │      │  (PostgreSQL) │                   │
│                    └──────┬──────┘      └───────────────┘                   │
│                           │                      ▲                           │
│                           ▼                      │                           │
│                    ┌─────────────┐      ┌───────┴───────┐                   │
│                    │   Redis     │      │  Background   │                   │
│                    │  (Pub/Sub)  │ ◀──▶ │    Jobs       │                   │
│                    └─────────────┘      └───────────────┘                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### Step 4.3: Trace Every Data Flow

Document each user action:

```markdown
### Data Flow: User Edits Document

1. **User types in editor**
   - Client: TextEditor component captures keystroke
   - Client: Debounce 100ms, batch changes

2. **Changes sent to server**
   - Client: WebSocket.send(documentId, operations)
   - Server: WebSocketHandler receives message
   - Server: Validate auth, permissions

3. **Changes processed**
   - Server: DocumentService.applyOperations()
   - Server: CRDT merge with current state
   - Server: Persist to database

4. **Changes broadcast**
   - Server: Redis.publish(documentId, operations)
   - Server: All connected clients receive via subscription

5. **Other clients update**
   - Client: WebSocket.onmessage handler
   - Client: Apply operations to local CRDT state
   - Client: Update React state, re-render

### Error Cases
- WebSocket disconnect: Queue operations, retry on reconnect
- Validation failure: Return error, rollback operation
- Database failure: Return error, emit alert, operations lost
- Redis failure: Fallback to direct client notification
```

#### Step 4.4: Identify Every Decision Point

For every architectural choice:

```markdown
### Decision: Real-time Sync Technology

**Question:** How should we synchronize changes between clients?

**Context:**
- Need < 500ms latency
- Up to 20 concurrent editors
- Must handle offline reconnection
- Team has no WebSocket experience

**Options:**

| Option | Description | Pros | Cons | Effort |
|--------|-------------|------|------|--------|
| A | WebSocket + Yjs CRDT | Mature, handles conflicts | Learning curve, new dependency | Medium |
| B | WebSocket + Custom OT | Full control, no deps | Complex, must build from scratch | High |
| C | Socket.io + Yjs | Easy setup, fallbacks | Larger bundle, opinionated | Low |
| D | Polling + Last-Write-Wins | Simplest, familiar | Bad UX, data loss risk | Very Low |

**Analysis:**

Option A (WebSocket + Yjs):
- Yjs is battle-tested (used by Notion, JupyterLab)
- CRDT handles all conflict resolution automatically
- WebSocket gives us control over transport
- Moderate learning curve but good documentation

Option B (Custom OT):
- Would need to implement operational transform from scratch
- Error-prone and complex
- Not justified for this use case

Option C (Socket.io + Yjs):
- Socket.io adds unnecessary abstraction
- Bundle size concern
- Fallback to polling rarely needed

Option D (Polling):
- Unacceptable for "real-time" requirement
- Would not meet user expectations

**Recommendation:** Option A (WebSocket + Yjs)

**Rationale:**
1. Yjs handles the hardest part (conflict resolution) out of the box
2. Native WebSocket keeps dependencies minimal
3. Well-documented with good TypeScript support
4. Proven at scale in production systems
5. Team can focus on features, not sync algorithms

**User Input Needed:** None - technical decision
```

#### Step 4.5: Risk Analysis

Identify everything that could go wrong:

```markdown
### Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| WebSocket connection drops | High | Medium | Implement reconnection with operation queue |
| Concurrent edits cause data corruption | Medium | Critical | CRDT ensures eventual consistency |
| Server overloaded with sync traffic | Medium | High | Debounce client updates, batch operations |
| Memory leak from long-lived connections | Medium | High | Implement connection cleanup, monitoring |
| Auth token expires mid-session | High | Medium | Implement token refresh, re-auth flow |
| Large documents slow to sync | Low | Medium | Implement chunked sync, lazy loading |

### Mitigation Details

**WebSocket Reconnection:**
- Implement exponential backoff (1s, 2s, 4s, 8s, max 30s)
- Queue operations during disconnect
- Replay queue on reconnect
- Show user connection status indicator

**CRDT Data Corruption:**
- Yjs provides strong eventual consistency guarantees
- All clients converge to same state given same operations
- No conflict resolution code needed
- Test with chaos scenarios (network partition, out-of-order)
```

#### Step 4.6: Completeness Check

Ask yourself:

```
□ Can I explain every component and its purpose?
□ Can I trace any user action through the entire system?
□ Do I know what happens when things go wrong?
□ Have I identified every file that needs to change?
□ Have I considered security implications?
□ Have I considered performance implications?
□ Have I considered scale implications?
□ Are there any gaps in my understanding?
□ Would an implementer be able to build this from my document?
```

---

## Phase 5: RESEARCH DOCUMENT GENERATION

**Duration:** 60-120 minutes minimum
**Goal:** Produce 2-5k+ line comprehensive document
**Gate:** All sections substantive, paths verified, actionable for implementation

### Document Quality Standards

**Your document must be so complete that an implementer can build the feature with ONLY this document.**

They should NOT need to:
- Re-research technologies
- Figure out integration points
- Discover codebase patterns
- Make architectural decisions
- Fill in missing details

### Target Document Size

| Complexity | Target Lines | Sections |
|------------|--------------|----------|
| Simple | 1,500-2,500 | All 11, some shorter |
| Medium | 2,500-4,000 | All 11, comprehensive |
| Complex | 4,000-6,000+ | All 11, exhaustive |

**If your document is under 2,000 lines, you're missing detail.**

### What Makes a Section "Substantive"

**NOT Substantive (BAD):**
```markdown
## 4.1 Technology Options
We'll use Socket.io for WebSocket communication.
```

**Substantive (GOOD):**
```markdown
## 4.1 Technology Options Analysis

### WebSocket Library Evaluation

We evaluated 4 WebSocket libraries for Node.js real-time communication:

#### Option A: ws (Native WebSocket)

**Overview:** Minimal, fast WebSocket implementation for Node.js

**Health Metrics:**
- GitHub Stars: 20,000+
- Weekly Downloads: 50M+
- Last Commit: 2 days ago
- Active Maintainer: Yes

**Evaluation:**

| Criterion | Score | Notes |
|-----------|-------|-------|
| Functionality | 4/5 | Core WebSocket only, no extras |
| Performance | 5/5 | Fastest option, minimal overhead |
| Documentation | 4/5 | Good API docs, fewer tutorials |
| TypeScript | 5/5 | Built-in types |
| Bundle Size | 5/5 | 25KB, minimal |

**Pros:**
- Extremely fast (benchmarks show 2x Socket.io)
- Minimal dependencies (just bufferutil optional)
- Full control over implementation
- Perfect TypeScript support

**Cons:**
- No built-in reconnection (must implement)
- No room/namespace abstraction (must implement)
- No fallback to polling (not needed for our use case)

**Integration Example:**
```typescript
import { WebSocketServer } from 'ws';
import { verifyToken } from './auth';

const wss = new WebSocketServer({
  server: httpServer,
  verifyClient: async (info, callback) => {
    const token = new URL(info.req.url, 'http://localhost')
      .searchParams.get('token');
    const valid = await verifyToken(token);
    callback(valid);
  }
});

wss.on('connection', (ws, req) => {
  const userId = req.userId; // Set by verifyClient
  // Handle connection...
});
```

#### Option B: Socket.io
{Similar detailed analysis...}

#### Option C: uWebSockets.js
{Similar detailed analysis...}

### Recommendation

**Selected: ws (Native WebSocket)**

**Rationale:**
1. Performance is critical for real-time editing - ws is fastest
2. We don't need Socket.io's abstractions (rooms, namespaces)
3. Polling fallback unnecessary (our users have modern browsers)
4. Smaller bundle size reduces client load time
5. Full control over reconnection behavior for our specific needs

**Trade-offs Accepted:**
- Must implement reconnection logic (~100 lines)
- Must implement our own room management for documents (~50 lines)
- More initial development for better long-term performance
```

### Use RESEARCH-TEMPLATE.md

Follow the complete template in `references/RESEARCH-TEMPLATE.md`.

Every section must be written, not skipped.

---

## Phase 6: VALIDATION & HANDOFF

**Duration:** 15-30 minutes
**Goal:** Verify quality and prepare for next stage
**Gate:** All paths valid, links work, document is actionable

### Validation Checklist

```markdown
## Document Validation

### Completeness
- [ ] Executive Summary present and informative
- [ ] Intent & Requirements comprehensive
- [ ] Codebase Analysis thorough (50+ files referenced)
- [ ] Technology Research substantive (3+ options per need)
- [ ] Architecture Blueprint complete with diagrams
- [ ] Implementation Considerations addressed
- [ ] All Decisions documented with options and rationale
- [ ] File Reference Map complete
- [ ] Dependencies listed
- [ ] Open Questions captured
- [ ] Next Steps defined

### Path Validation
For each file path in document:
- [ ] Path exists in codebase
- [ ] Line numbers are accurate
- [ ] Code snippets match current code

### Link Validation
For each external link:
- [ ] Link is accessible
- [ ] Content is relevant
- [ ] Not paywalled or restricted

### Quality
- [ ] Document is 2,000+ lines
- [ ] No placeholder text
- [ ] Recommendations include rationale
- [ ] Decisions include trade-offs
- [ ] Actionable for implementer
```

### Handoff Summary

Provide to user:

```markdown
## Research Complete

### Document Location
`docs/research/2025-01-15-real-time-collaboration-research.md`

### Key Recommendations
1. Use WebSocket + Yjs for real-time sync
2. Integrate with existing EventBus for notifications
3. Add 3 new database tables for document state

### Critical Decisions Made
1. **Sync Technology:** WebSocket + Yjs (vs Socket.io, custom OT)
2. **State Storage:** PostgreSQL JSONB (vs Redis, MongoDB)
3. **Conflict Resolution:** CRDT automatic merge (vs manual, last-write-wins)

### Open Questions for User
1. Should presence show user avatars or just names?
2. Maximum document size limit (impacts chunking strategy)?

### Next Steps
To proceed to specification:
```
/research-to-spec
Research: docs/research/2025-01-15-real-time-collaboration-research.md
```
```

---

## Quick Reference: Tool Usage

### Internal Codebase Research
| Tool | Use For |
|------|---------|
| `mcp__morph-mcp__warpgrep_codebase_search` | Initial broad code search |
| `Task` + `subagent_type=Explore` | Deep parallel exploration |
| `Glob` | Find files by pattern |
| `Read` | Read specific files |

### External Technology Research
| Tool | Use For |
|------|---------|
| `mcp__exa__get_code_context_exa` | Code examples, SDK usage |
| `mcp__exa__web_search_exa` | General tech articles |
| `mcp__Ref__ref_search_documentation` | Official documentation search |
| `mcp__Ref__ref_read_url` | Read specific doc pages |
| `WebFetch` | Read specific URLs |
| `WebSearch` | Backup general search |

### User Interaction
| Tool | Use For |
|------|---------|
| `AskUserQuestion` | Clarify requirements in Phase 1 |

---

## Final Reminders

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   1. THIS IS FOUNDATION WORK                                                 │
│      Everything downstream depends on this document's quality.               │
│                                                                              │
│   2. THERE ARE NO SHORTCUTS                                                  │
│      Rushed research = broken features = wasted time.                        │
│                                                                              │
│   3. ULTRATHINK IS NOT OPTIONAL                                              │
│      Phases 1 and 4 require deep, deliberate reasoning.                      │
│                                                                              │
│   4. THOROUGHNESS OVER SPEED                                                 │
│      3-6 hours of research saves 30-60 hours of rework.                      │
│                                                                              │
│   5. EVIDENCE EVERYTHING                                                     │
│      File paths, line numbers, documentation links.                          │
│                                                                              │
│   6. THINK LIKE AN IMPLEMENTER                                               │
│      What would YOU need to build this feature?                              │
│                                                                              │
│   7. QUALITY IS NON-NEGOTIABLE                                               │
│      2,000+ lines, all sections complete, all paths valid.                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Related Files

- **references/RESEARCH-TEMPLATE.md** - Complete output document template
- **references/INTENT-QUESTIONS.md** - Intent clarification framework
- **references/TECH-RESEARCH-GUIDE.md** - External research methodology

---

## Version History

- v2.0.0 - Major enhancement: Added ULTRATHINK methodology, quality gates, anti-patterns, concrete examples, effort guidance
- v1.0.0 - Initial skill definition
