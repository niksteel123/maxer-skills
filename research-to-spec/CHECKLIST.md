# Quality Checklist

Verification checklist for research-to-spec conversion.

---

## Pre-Work Checklist

Before starting, verify:

- [ ] Research document(s) identified and accessible
- [ ] Output paths determined:
  - Spec: `thoughts/shared/specs/{date}-{feature}-spec.md`
  - Arch: `thoughts/shared/architecture/{date}-{feature}-architecture.md`
- [ ] Codebase accessible for exploration
- [ ] Understanding of project's tech stack

---

## Phase 1: Codebase Study Checklist

- [ ] **All touchpoint files identified**
  - [ ] Files to modify listed
  - [ ] Files to create listed
  - [ ] Integration point files listed

- [ ] **Each touchpoint file studied**
  - [ ] Read completely (not skimmed)
  - [ ] Current architecture understood
  - [ ] Patterns documented
  - [ ] Dependencies noted

- [ ] **Related systems explored**
  - [ ] Similar features found and studied
  - [ ] Common patterns identified
  - [ ] Established conventions noted

- [ ] **Test infrastructure understood**
  - [ ] E2E test patterns documented
  - [ ] Test frameworks available
  - [ ] Evidence capture methods known

- [ ] **Codebase summary written**
  - Internal notes documenting findings

---

## Phase 2: Research Analysis Checklist

- [ ] **All research documents read completely**
  - [ ] No sections skipped
  - [ ] Key points extracted

- [ ] **Feature inventory created**
  - [ ] All features listed
  - [ ] Descriptions documented
  - [ ] Proposed approaches noted

- [ ] **Mapping completed**
  - [ ] Each feature mapped to codebase files
  - [ ] Status (verified/discrepancy) marked

- [ ] **Assumptions listed**
  - [ ] All assumptions from research documented
  - [ ] Each marked for verification

- [ ] **Research test strategy extracted** (if research contains test sections)
  - [ ] Spec-relevant tests identified and tagged for carry-forward
  - [ ] Prior art acknowledged
  - [ ] Discarded tests documented with rationale

---

## Phase 3: Gap Analysis Checklist

- [ ] **Each assumption validated**
  - [ ] Evidence gathered from codebase
  - [ ] Confirmed or refuted
  - [ ] Findings documented

- [ ] **Discrepancies identified**
  - [ ] Each discrepancy documented
  - [ ] Impact assessed
  - [ ] Resolution proposed

- [ ] **Proposed approaches challenged**
  - [ ] Each major design decision questioned
  - [ ] Alternatives considered
  - [ ] Best approach determined

- [ ] **Missing considerations identified**
  - [ ] Edge cases found
  - [ ] Error scenarios noted
  - [ ] Permission requirements identified
  - [ ] Performance implications considered

---

## Phase 4: Architecture Design Checklist

- [ ] **Data models defined**
  - [ ] All interfaces/types specified
  - [ ] Complete, not stub definitions

- [ ] **Database schema defined** (if applicable)
  - [ ] All tables specified
  - [ ] Indexes planned
  - [ ] Constraints defined
  - [ ] Migration strategy noted

- [ ] **API contracts defined**
  - [ ] All endpoints specified
  - [ ] Request/response formats documented
  - [ ] Error codes defined

- [ ] **Component structure planned**
  - [ ] Directory structure defined
  - [ ] File responsibilities clear
  - [ ] Dependencies mapped

- [ ] **Integration approach defined**
  - [ ] Existing file modifications specified
  - [ ] New connections documented
  - [ ] Backward compatibility considered

---

## Phase 5: Specification Document Checklist

### Structure
- [ ] Overview section complete
  - [ ] Feature summary clear
  - [ ] Goals listed
  - [ ] Non-goals listed
  - [ ] Success metrics defined

### Functional Requirements
- [ ] **Every requirement has:**
  - [ ] FR-X.Y.Z identifier (unique, stable, immutable)
  - [ ] Clear requirement statement
  - [ ] Acceptance criteria (bullet list with sub-IDs: AC-FR-X.Y.Z-a)
  - [ ] Core Test (executable)

- [ ] **Coverage-checkable structure:**
  - [ ] All requirements in `#### FR-X.Y.Z` sections (not buried in prose)
  - [ ] All acceptance criteria as explicit bullet lists
  - [ ] Requirement inventory extractable via regex
  - [ ] No implicit requirements (everything that matters has an ID)

- [ ] **"Everything Ships" verified:**
  - [ ] Spec contains only Must + Should from research
  - [ ] No hedged scope ("could have", "nice to have", "post-MVP")
  - [ ] Section 7 only contains explicitly deferred extensions
  - [ ] If it shouldn't ship, it's been removed from spec

- [ ] **Core Tests are real E2E tests:**
  - [ ] Exercise actual endpoints/systems
  - [ ] Not mock-based
  - [ ] Not unit test stubs
  - [ ] Produce PASS/FAIL output

- [ ] **All scenarios covered:**
  - [ ] Happy paths
  - [ ] Error scenarios
  - [ ] Edge cases
  - [ ] Permission checks

### User Stories
- [ ] All personas covered
- [ ] Each story has acceptance criteria
- [ ] Stories map to requirements

### E2E Test Scenarios
- [ ] Clean slate protocol defined
- [ ] Each scenario has:
  - [ ] Purpose stated
  - [ ] Prerequisites listed
  - [ ] Setup commands
  - [ ] Execution commands
  - [ ] Verification commands
  - [ ] Evidence requirements

### Dependencies
- [ ] External dependencies listed
- [ ] Internal dependencies listed
- [ ] Required permissions listed

### Risks
- [ ] Risks identified
- [ ] Severity/likelihood assessed
- [ ] Mitigations defined

### Integration
- [ ] Documentation updates listed
- [ ] Skill updates listed (if applicable)

---

## Phase 6: Architecture Document Checklist

### Structure
- [ ] System overview with diagram
- [ ] Component descriptions

### Data Flows
- [ ] Each major flow diagrammed
- [ ] Components labeled
- [ ] Sync/async marked

### Database (if applicable)
- [ ] All tables with complete DDL
- [ ] Field descriptions
- [ ] Indexes defined

### API Specification
- [ ] All endpoints documented
- [ ] Request examples complete
- [ ] Response examples complete
- [ ] Error responses complete

### Component Implementation
- [ ] **Code is complete, not stubs**
  - [ ] Full method implementations
  - [ ] Error handling included
  - [ ] Types defined
  - [ ] Dependencies injected

- [ ] **Not pseudocode**
  - [ ] Actually compilable/runnable
  - [ ] All imports specified
  - [ ] All types defined

### Integration Points
- [ ] Each integration point specified
- [ ] Existing file identified
- [ ] Changes documented with line references
- [ ] Code snippets provided

### Error Handling
- [ ] Error types defined
- [ ] Error codes documented
- [ ] Handler patterns shown

### Scalability
- [ ] Performance considerations listed
- [ ] Resource limits defined
- [ ] Caching strategy noted (if applicable)

### Phases
- [ ] Implementation phases outlined
- [ ] Dependencies between phases noted

---

## Phase 7: Handoff Prompt Checklist

- [ ] **All documents referenced with full paths**
  - [ ] Spec path
  - [ ] Architecture path
  - [ ] Research path(s)

- [ ] **Key codebase files listed**
  - [ ] All files to study
  - [ ] Descriptions provided

- [ ] **Workflow steps included**
  - [ ] Skill study step
  - [ ] Codebase study step
  - [ ] Reset step
  - [ ] Spec-to-tdd step (SOT #2)
  - [ ] Strategy creation step (SOT #3, lightweight)
  - [ ] Beads-from-sources step (reads all 3 SOTs)
  - [ ] Beads-to-execution step

- [ ] **Stop points emphasized**
  - [ ] MANDATORY STOP clearly stated
  - [ ] Report format provided
  - [ ] "Wait for authorization" explicit

- [ ] **QA strategy included**
  - [ ] E2E test emphasis
  - [ ] Evidence requirements
  - [ ] Clean slate protocol (if applicable)

---

## Final Quality Gate

Before delivering:

- [ ] **Accuracy verified**
  - [ ] File paths are correct
  - [ ] API contracts match codebase patterns
  - [ ] Code compiles/is syntactically correct

- [ ] **Completeness verified**
  - [ ] No TODO comments left
  - [ ] No placeholder text
  - [ ] All sections filled

- [ ] **E2E test bias verified**
  - [ ] Core tests are real E2E
  - [ ] No unit test stubs masquerading as E2E
  - [ ] Evidence requirements specified

- [ ] **SOT hierarchy explicit**
  - [ ] Spec marked as PRIMARY source of truth
  - [ ] Architecture marked as SUPPLEMENTARY
  - [ ] Handoff references 3-SOT pipeline (not old spec-to-plan → plan-to-beads)

- [ ] **Handoff ready**
  - [ ] Agent can proceed with only these documents
  - [ ] No external context required
  - [ ] All paths are absolute/findable

---

## Spec Drift Prevention (CRITICAL)

Group all drift-related checks for quick scanning:

- [ ] **SOT hierarchy stated**: Spec = PRIMARY, Architecture = SUPPLEMENTARY
- [ ] **"Everything Ships" verified**: No hedged scope in spec (no "could have", "nice to have", "post-MVP")
- [ ] **No orphan requirements**: All requirements in `#### FR-X.Y.Z` sections, none buried in prose
- [ ] **Mechanical coverage check passed**: `grep -oP 'FR-\d+\.\d+\.\d+' spec.md | sort -u` returns complete inventory
- [ ] **Every FR has AC**: No FR-section without explicit acceptance criteria bullets
- [ ] **Every FR has Core Test**: No FR-section without an executable test
- [ ] **Research test strategy preserved**: If research had test sections, spec-relevant tests carried forward
- [ ] **Handoff references 3-SOT pipeline**: spec-to-tdd → spec-to-strategy → beads-from-sources → beads-to-execution
- [ ] **No stale pipeline references**: No mentions of old pipeline names: "spec-to-plan", "plan-to-beads"
- [ ] **Handoff names specific skills**: Each step references an invocable skill by name

---

## Common Issues to Catch

### Specification Issues
- [ ] Requirements without core tests
- [ ] Core tests that are actually unit tests
- [ ] Missing error scenarios
- [ ] Ambiguous acceptance criteria
- [ ] Missing permission requirements

### Architecture Issues
- [ ] Incomplete code (TODO comments)
- [ ] Pseudocode instead of real code
- [ ] Missing error handling
- [ ] Incorrect file paths
- [ ] Missing type definitions

### Handoff Issues
- [ ] Relative paths instead of absolute
- [ ] Missing skill references
- [ ] Missing codebase file list
- [ ] Unclear stop points
