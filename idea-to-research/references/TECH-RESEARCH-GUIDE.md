# External Technology Research Guide

> Methodology for Phase 3: Researching 3rd-party tools, libraries, and best practices.

---

## Research Tools Overview

### Primary Tools

| Tool | Best For | Query Format |
|------|----------|--------------|
| `mcp__exa__get_code_context_exa` | Code examples, SDK usage, library APIs | Natural language + keywords |
| `mcp__exa__web_search_exa` | General tech articles, comparisons, news | Search query style |
| `mcp__Ref__ref_search_documentation` | Official documentation | Library + topic |
| `mcp__Ref__ref_read_url` | Deep-dive specific doc pages | Full URL |
| `WebFetch` | Read specific web pages | URL + extraction prompt |
| `WebSearch` | Backup general search | Search query |

---

## Search Strategy by Category

### Finding Libraries

**Goal:** Discover libraries that solve the problem

**Tool:** `mcp__exa__get_code_context_exa`

**Query Pattern:**
```
"{language} {problem description} library {year}"

Examples:
- "TypeScript real-time collaboration library 2025"
- "Python PDF generation library 2025"
- "Rust async HTTP client library 2025"
```

**Follow-up Queries:**
```
"{library name} alternatives comparison"
"{library name} vs {competitor} which is better"
"best {language} {category} libraries {year}"
```

### Reading Documentation

**Goal:** Understand library capabilities and integration

**Step 1: Find docs**
```
Tool: mcp__Ref__ref_search_documentation
Query: "{library name} documentation {specific topic}"

Example: "tRPC documentation client setup"
```

**Step 2: Read specific pages**
```
Tool: mcp__Ref__ref_read_url
URL: {exact URL from search results, including #hash}
```

**Topics to Research:**
- Getting started / Installation
- Basic usage / Quick start
- API reference for key methods
- Configuration options
- Error handling
- TypeScript/type support
- Migration guides (if upgrading)

### Comparing Alternatives

**Goal:** Make informed technology choice

**Tool:** `mcp__exa__web_search_exa`

**Query Patterns:**
```
"{library A} vs {library B} comparison {year}"
"{library A} vs {library B} performance benchmark"
"pros cons {library name} {year}"
"why choose {library name} over {alternative}"
"migrate from {old library} to {new library}"
```

### Best Practices Research

**Goal:** Learn industry patterns and pitfalls

**Tool:** `mcp__exa__web_search_exa` or `mcp__exa__get_code_context_exa`

**Query Patterns:**
```
"{feature type} architecture best practices {year}"
"{feature type} security considerations"
"{feature type} scalability patterns"
"{feature type} common mistakes to avoid"
"{feature type} production checklist"
```

---

## Evaluation Framework

### Library Evaluation Criteria

| Criterion | Weight | What to Check |
|-----------|--------|---------------|
| **Functionality** | 25% | Does it solve the problem completely? |
| **Maintenance** | 20% | Recent commits? Active issues? Responsive maintainers? |
| **Community** | 15% | GitHub stars? npm downloads? Stack Overflow presence? |
| **Documentation** | 15% | Quality? Examples? Up-to-date? |
| **Compatibility** | 15% | Works with existing stack? TypeScript support? |
| **License** | 10% | Compatible with project? Any restrictions? |

### Scoring Guide

| Score | Meaning |
|-------|---------|
| 5 | Excellent - Best in class |
| 4 | Good - Meets needs well |
| 3 | Adequate - Acceptable |
| 2 | Poor - Has significant gaps |
| 1 | Unsuitable - Major problems |

### Quick Health Checks

**GitHub Repository:**
- Stars: > 1,000 (popular), > 10,000 (very popular)
- Last commit: < 3 months (active)
- Open issues: Reasonable ratio to stars
- Contributors: Multiple active contributors

**npm Package:**
- Weekly downloads: > 10,000 (established)
- Version: > 1.0 (stable)
- Dependencies: Not excessive
- Bundle size: Appropriate for use case

---

## Research Workflow

### Step 1: Initial Discovery (10 minutes)

```
1. Search for libraries solving the problem
2. Create shortlist of 3-5 candidates
3. Quick health check each candidate
4. Narrow to 2-3 for deeper research
```

### Step 2: Documentation Deep Dive (20 minutes per library)

```
1. Read getting started / installation
2. Review core API / main features
3. Check TypeScript support
4. Look for integration examples
5. Review configuration options
6. Note limitations / gotchas
```

### Step 3: Comparison Analysis (15 minutes)

```
1. Score each library on criteria
2. Find comparison articles
3. Check migration stories (others' experiences)
4. Note trade-offs for each option
```

### Step 4: Best Practices (15 minutes)

```
1. Research architecture patterns for this feature type
2. Check security considerations
3. Review performance optimization patterns
4. Note common mistakes to avoid
```

### Step 5: Documentation (10 minutes)

```
1. Summarize each option with pros/cons
2. Document recommendation with rationale
3. Include key documentation links
4. Add integration code examples
```

---

## Common Research Patterns by Feature Type

### Authentication

**Libraries to Consider:**
- TypeScript: next-auth, lucia-auth, passport, clerk
- Python: authlib, python-jose, fastapi-users
- Go: go-jose, casbin

**Research Topics:**
- Session vs JWT vs stateless tokens
- OAuth providers to support
- MFA implementation
- Session management
- Security best practices

### Real-time Features

**Libraries to Consider:**
- WebSocket: socket.io, ws, uWebSockets.js
- CRDT: yjs, automerge, loro
- Pub/Sub: redis, pusher, ably

**Research Topics:**
- WebSocket vs SSE vs polling
- Conflict resolution strategies
- Offline support patterns
- Scale considerations

### Database/ORM

**Libraries to Consider:**
- TypeScript: drizzle, prisma, typeorm, kysely
- Python: sqlalchemy, tortoise-orm, prisma-client-py
- Go: sqlc, gorm, ent

**Research Topics:**
- Query builder vs ORM
- Migration strategies
- Type safety
- Performance characteristics

### API Design

**Libraries to Consider:**
- TypeScript: tRPC, hono, fastify, express
- Python: FastAPI, Flask, Django REST
- Go: chi, gin, echo

**Research Topics:**
- REST vs GraphQL vs tRPC
- Validation patterns
- Error handling
- OpenAPI/Swagger integration

### File Storage

**Libraries to Consider:**
- Cloud: AWS S3 SDK, GCS SDK, Cloudflare R2
- Local: multer, busboy, formidable

**Research Topics:**
- Direct upload vs server proxy
- CDN integration
- Image processing
- Access control

---

## Documentation Template

For each technology researched, document:

```markdown
## {Library Name}

### Overview
{Brief description}

### Health Metrics
- GitHub Stars: {count}
- npm Weekly Downloads: {count}
- Last Updated: {date}
- License: {license}

### Evaluation
| Criterion | Score | Notes |
|-----------|-------|-------|
| Functionality | {1-5} | {note} |
| Maintenance | {1-5} | {note} |
| Community | {1-5} | {note} |
| Documentation | {1-5} | {note} |
| Compatibility | {1-5} | {note} |
| License | {1-5} | {note} |

### Pros
- {Pro 1}
- {Pro 2}

### Cons
- {Con 1}
- {Con 2}

### Integration Example
```{language}
{Code example}
```

### Documentation Links
- [Official Docs]({url})
- [API Reference]({url})
- [Examples]({url})

### Recommendation
{Include/Exclude with rationale}
```

---

## Red Flags to Watch For

| Red Flag | Why It Matters |
|----------|----------------|
| No updates in 6+ months | May be abandoned |
| Only 1 contributor | Bus factor risk |
| Excessive dependencies | Security/bloat risk |
| No TypeScript types | DX problems |
| Outdated documentation | Integration pain |
| No error handling docs | Production issues |
| License change history | Legal risk |
| Corporate backing removed | Future uncertainty |

---

## Final Checklist

Before completing Phase 3:

- [ ] Researched 2+ alternatives for each technology need
- [ ] Checked health metrics for all candidates
- [ ] Read official documentation for top choices
- [ ] Found integration examples
- [ ] Researched best practices for feature type
- [ ] Checked security considerations
- [ ] Documented all recommendations with rationale
- [ ] Included code examples for recommended tools
- [ ] All documentation links are valid
