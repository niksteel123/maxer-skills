# Extraction Patterns

> Systematic patterns for extracting behavior, architecture, and intent from code. Use during Phase 2 (Behavioral Extraction) and Phase 4 (Intent Reconstruction).

---

## Core Principle

**EXTRACT WHAT, NOT HOW.** The goal is to describe observable behavior and contracts, not internal implementation details. A requirement like "returns user data within 200ms" is better than "uses a BTreeMap lookup in the UserCache struct."

**ELEVATE, DON'T COPY.** Where the code has bugs, workarounds, or anti-patterns, extract the INTENT — what it was trying to do — and specify that intent cleanly.

---

## The 11 Extraction Dimensions

### Dimension 1: Public API Surface

**What to extract:** Every operation the module/system exposes to consumers.

**Pattern:**
```
For each public function/method/endpoint:
  1. Name and location
  2. Input parameters with types and constraints
  3. Return type and possible values
  4. Preconditions (what must be true before calling)
  5. Postconditions (what is guaranteed after calling)
  6. Error conditions (what can go wrong)
  7. Side effects (what external state changes)
```

**How to find:**
- Exported functions/types (language-specific: `pub`, `export`, capitalized names)
- Route/endpoint definitions
- Trait/interface implementations
- CLI command definitions
- Event handler registrations

**Common elevation opportunities:**
- Missing input validation → add to spec
- Inconsistent error return types → normalize
- Undocumented side effects → make explicit

---

### Dimension 2: Data Models

**What to extract:** All structured data types that represent domain concepts.

**Pattern:**
```
For each data model:
  1. Name and semantic meaning
  2. All fields with types
  3. Required vs optional fields
  4. Default values
  5. Validation constraints (min/max, format, enum values)
  6. Relationships to other models
  7. Serialization format (JSON field names, DB column names)
  8. Indices (for DB models)
```

**How to find:**
- Struct/class definitions
- Database migration files
- ORM model definitions
- API request/response types
- Protobuf/GraphQL schema files
- Zod/Joi/Pydantic validation schemas

**Common elevation opportunities:**
- Fields without validation → add constraints based on usage patterns
- Implicit relationships (foreign key IDs without joins) → make explicit
- Inconsistent naming → normalize

---

### Dimension 3: State Machines

**What to extract:** Any system that transitions between discrete states.

**Pattern:**
```
For each state machine:
  1. All possible states (enum variants)
  2. Initial state
  3. Terminal states
  4. Valid transitions: State A → State B
  5. Guard conditions (when is transition allowed?)
  6. Actions on transition (side effects)
  7. Invalid transitions (what happens if attempted?)
```

**How to find:**
- Enum types with names like `Status`, `State`, `Phase`, `Stage`
- Functions that check current state before acting
- Match/switch statements on state values
- Database columns like `status`, `state`

**Common elevation opportunities:**
- Missing invalid transition handling → add explicit rejection
- States reachable only through bugs → remove from spec
- Ambiguous state names → clarify semantics

---

### Dimension 4: Data Flows

**What to extract:** End-to-end paths data takes through the system.

**Pattern:**
```
For each major flow:
  1. Trigger (what initiates the flow)
  2. Step-by-step processing:
     a. Component → action → output
     b. Any transformations applied
     c. Any decisions/branches
     d. Any async boundaries
  3. Final result/effect
  4. Error handling at each step
  5. Timeout/retry behavior
```

**How to find:**
- Start from entry points (routes, event handlers)
- Follow function calls downstream
- Note every service/repository call
- Track data transformations
- Find the terminal action (DB write, response, event emit)

**Tracing technique:**
```
START at entry point (e.g., POST /api/documents)
  → route handler: validates request
    → service method: applies business logic
      → repository method: persists to DB
      → event emitter: emits "document.created"
    ← returns created document
  ← sends 201 response with document
```

**Common elevation opportunities:**
- Missing error handling at intermediate steps → add
- No timeout on external calls → specify timeout
- Data validation only at API layer → validate at service layer too

---

### Dimension 5: Validation Logic

**What to extract:** All constraints enforced on data.

**Pattern:**
```
For each validation:
  1. What field/input is validated
  2. The constraint (min, max, format, enum, custom)
  3. When validation occurs (API entry, service layer, DB constraint)
  4. What happens on failure (error type, message, HTTP code)
  5. Whether it's client-facing or internal
```

**How to find:**
- Schema validation libraries (Zod, Joi, Pydantic, serde validation)
- Manual checks (`if field.len() > MAX`, `if !valid_email(input)`)
- Database constraints (NOT NULL, CHECK, UNIQUE)
- Frontend form validation
- API middleware validators

**Common elevation opportunities:**
- Validation in only one layer → spec for defense-in-depth
- Inconsistent error messages → normalize
- Missing format validation → add (emails, URLs, UUIDs)

---

### Dimension 6: Error Handling

**What to extract:** The complete error model.

**Pattern:**
```
For each error type/variant:
  1. Error name and category
  2. When it occurs (conditions)
  3. Error code (HTTP status, custom code)
  4. User-facing message vs internal message
  5. How it propagates (caught where? converted to what?)
  6. Recovery strategy (retry, fallback, fail)
  7. Logging/alerting behavior
```

**How to find:**
- Custom error types (`enum AppError`, `class ApiError extends Error`)
- Error mapping/conversion (`impl From<DbError> for ApiError`)
- Catch/match blocks
- Error middleware
- Retry logic

**Common elevation opportunities:**
- Generic error messages ("Something went wrong") → specific messages
- Swallowed errors (empty catch blocks) → proper handling
- Missing error variants for known failure modes → add

---

### Dimension 7: Side Effects

**What to extract:** All interactions with external state.

**Pattern:**
```
For each side effect:
  1. What external system is touched (DB, cache, queue, filesystem, API)
  2. Operation type (read, write, delete)
  3. When it occurs (in which flows)
  4. Transactional guarantees (atomic, eventual, none)
  5. Failure handling (rollback, compensate, ignore)
  6. Ordering constraints (must happen before/after X)
```

**How to find:**
- Database queries/mutations
- HTTP client calls
- File system operations
- Message queue publish/subscribe
- Cache read/write operations
- Email/notification sends

**Common elevation opportunities:**
- Non-transactional multi-step mutations → add transaction boundaries
- No failure handling for external calls → add retry/circuit breaker
- Missing cleanup on failure (e.g., partial writes) → add rollback

---

### Dimension 8: Configuration

**What to extract:** Everything that can be configured.

**Pattern:**
```
For each config value:
  1. Name (env var, config key)
  2. Type (string, number, boolean, enum)
  3. Default value (if any)
  4. Valid range/values
  5. Where it's used
  6. Whether it requires restart
  7. Security sensitivity (should it be secret?)
```

**How to find:**
- `process.env`, `std::env::var`, `os.environ`
- Config files (TOML, YAML, JSON)
- Feature flag checks
- Constant definitions with explanatory comments
- CLI argument parsing

**Common elevation opportunities:**
- Hardcoded values that should be configurable → externalize
- Missing defaults → add sensible defaults
- Sensitive values in plaintext → mark as secrets

---

### Dimension 9: Security Model

**What to extract:** All authentication, authorization, and data protection.

**Pattern:**
```
Authentication:
  1. How users/agents authenticate (JWT, API key, session, OAuth)
  2. Token lifecycle (creation, validation, refresh, revocation)
  3. Credential storage (hashing algorithm, salt)

Authorization:
  1. Permission model (RBAC, ABAC, ACL)
  2. Permission checks (where enforced, middleware vs inline)
  3. Roles/permissions defined
  4. Default permissions for new entities

Data Protection:
  1. Encryption at rest (what's encrypted, algorithm)
  2. Encryption in transit (TLS, certificate handling)
  3. Input sanitization (XSS, SQL injection prevention)
  4. PII handling (masking, redaction in logs)
```

**How to find:**
- Auth middleware
- JWT/token libraries
- Permission check functions
- Crypto library usage
- Input sanitization functions
- Security headers

**Common elevation opportunities:**
- Missing auth on endpoints → add
- Permissions checked inconsistently → normalize to middleware
- PII in logs → add redaction

---

### Dimension 10: Concurrency Model

**What to extract:** How the system handles concurrent operations.

**Pattern:**
```
For each concurrency pattern:
  1. What runs concurrently (async tasks, threads, processes)
  2. Shared state and how it's protected (mutex, rwlock, atomic, channel)
  3. Ordering guarantees (sequential, parallel, unordered)
  4. Backpressure handling (bounded queues, rate limiting)
  5. Cancellation behavior (graceful shutdown, abort)
  6. Deadlock/livelock prevention strategies
```

**How to find:**
- `async/await`, `tokio::spawn`, `Promise.all`, `threading.Thread`
- Lock types (`Mutex`, `RwLock`, `Semaphore`)
- Channel/queue usage
- Connection pool configuration
- Worker pool patterns
- Rate limiter implementations

**Common elevation opportunities:**
- Unbounded queues → add backpressure
- Missing cancellation handling → add graceful shutdown
- Lock ordering not documented → document or redesign

---

### Dimension 11: Cross-Cutting Invariants

**What to extract:** System-wide rules that span multiple dimensions — the implicit "laws" of the system that, if violated in a rebuild, would cause subtle bugs.

**Pattern:**
```
For each invariant:
  1. The rule (what must always be true)
  2. Where it's enforced (which layers/components)
  3. What breaks if violated
  4. Whether it's explicit (documented/asserted) or implicit (convention only)
```

**How to find:**
- Grep for patterns repeated across ALL modules (timestamp formats, ID generation, encoding)
- Look at API responses: are there common fields always present? (request_id, version, timestamp)
- Check middleware: what's applied to ALL routes? (CORS, content-type, request logging)
- Look at data creation: are IDs always UUID v4? Timestamps always UTC?
- Check serialization: is camelCase or snake_case used consistently?
- Look at pagination: is there a standard page size, cursor format?

**Common invariants to check:**
- ID format (UUID v4, nanoid, sequential int)
- Timestamp format and timezone (UTC ISO 8601)
- String encoding (UTF-8)
- API envelope format (consistent response wrapper)
- Naming conventions (camelCase in JSON, snake_case in DB)
- Max payload size (applied at middleware/proxy level)
- Authentication header format
- Error response structure

**Common elevation opportunities:**
- Invariant enforced in some places but not others → enforce everywhere
- Implicit convention → make explicit with validation
- Inconsistent between old and new code → normalize to one standard

---

## Extraction Decision Matrix

Use this to prioritize which dimensions to extract first:

| Dimension | SURFACE | STANDARD | DEEP |
|-----------|---------|----------|------|
| 1. Public API | Signatures only | + Behavior | + Edge cases |
| 2. Data Models | Field listing | + Constraints | + Relationships graph |
| 3. State Machines | States listed | + Transitions | + Guards + invalid handling |
| 4. Data Flows | Entry→Exit | + Step-by-step | + ALL flows |
| 5. Validation | Noted | + Full rules | + Defense-in-depth |
| 6. Error Handling | Error types | + Propagation | + Recovery strategies |
| 7. Side Effects | Listed | + Failure handling | + Transactional guarantees |
| 8. Configuration | Env vars listed | + Defaults + ranges | + Sensitivity + restart req |
| 9. Security | Auth method | + Permissions model | + Full threat surface |
| 10. Concurrency | Noted | + Shared state | + Ordering + cancellation |
| 11. Cross-Cutting Invariants | Noted | + Enforcement audit | + Completeness verification |

---

## Dimension Interaction Map

Extraction dimensions are NOT independent — they heavily cross-reference each other. When extracting one dimension, check its interactions:

```
┌────────────────────────────────────────────────────────────────────┐
│                    DIMENSION INTERACTIONS                          │
│                                                                    │
│  Security (D9) ──constrains──► API Surface (D1)                   │
│                  ──constrains──► Side Effects (D7)                 │
│                                                                    │
│  State Machines (D3) ──drives──► Data Flows (D4)                  │
│                       ──triggers──► Error Handling (D6)            │
│                                                                    │
│  Configuration (D8) ──parameterizes──► ALL dimensions             │
│                                                                    │
│  Validation (D5) ──enforces──► Data Models (D2)                   │
│                   ──feeds──► Error Handling (D6)                   │
│                                                                    │
│  Concurrency (D10) ──constrains──► Side Effects (D7)              │
│                     ──constrains──► State Machines (D3)            │
│                                                                    │
│  Cross-Cutting (D11) ──spans──► ALL dimensions                    │
└────────────────────────────────────────────────────────────────────┘
```

**Key cross-checks:**
| When extracting... | Also verify... |
|--------------------|---------------|
| API Surface (D1) | Security checks (D9) per endpoint |
| Data Models (D2) | Validation rules (D5) per field |
| State Machines (D3) | Error handling (D6) for invalid transitions |
| Data Flows (D4) | Side effects (D7) at each step |
| Error Handling (D6) | Recovery strategies interact with concurrency (D10) |
| Configuration (D8) | Which dimensions each config value affects |
| Cross-Cutting (D11) | Whether invariant is enforced across all dimensions |

---

## Behavioral Extraction Template

For each extracted behavior, document:

```markdown
### BEH-{N}: {Behavior Name}

**Dimension:** {which of the 11}
**Source:** `{file_path}:{line_range}`
**Confidence:** {HIGH | MEDIUM | LOW}

**Current Behavior:**
{What the code actually does}

**Extracted Requirement:**
{What the spec should say — may be ELEVATED over current behavior}

**Tag:** {[EXTRACTED] | [ELEVATED]}
**Elevation Justification:** {If ELEVATED: why the spec improves on the original}
```
