# Spec to Strategy Examples

Real-world examples demonstrating the strategy creation process.

---

## Example 1: Unified Method Registry (Rust Backend)

### Context

A feature that builds a unified method registry to replace dual CLI/MCP dispatch paths, then adds dynamic MCP tool subsetting. Spec covers ~226 methods across 19 dispatch files.

### Generated Strategy

```markdown
# Unified Method Registry — Implementation Strategy

## Source Documents
- Spec: `thoughts/research/2026-03-23-dynamic-mcp-tool-subsetting-research.md`
- TDD: `thoughts/tdd/unified-method-registry-tdd.md`

## Phase Overview

| Phase | Name | Prerequisites | Gate |
|-------|------|---------------|------|
| 1 | Registry Core + Macros | None | Registry compiles, 21 methods register, duplicate-name test passes, EventSink drains correctly |
| 2 | MCP Migration | Phase 1 | tools/list semantic parity, tools/call parity, confused-deputy tests pass, legacy parity fixtures captured |
| 3 | Bridge Migration + Normalization | Phase 2 | All 226 methods registered, CLI parity verified against fixtures, all 19 dispatch files deleted |
| 4 | Dynamic Subsetting | Phase 3 | Role-token-identity-tools/list pipeline verified E2E, CapabilityDenied for out-of-subset calls |
| 5 | Surface Expansion | Phase 4 | Additional tools exposed via mcp_exposed flag, token savings measurable |

## Phase 1: Registry Core + Macros
### Prerequisites
- None
### Ordering
- Parallel: Crate boundary decision, schemars integration, shared serde helpers
- Sequential: SwarmMethodRegistry types → register_method helper → proc macro + bulk macro → EventSink → dispatch methods → unit tests
### Gate Criteria
- UT-REG-001 through UT-REG-015 pass
- 21-method registration succeeds without panics
- Duplicate-name registration is rejected
- Empty-registry startup is rejected
### Roll Back If
- Registry core requires swarm-services to import swarmd types
- Schema generation requires widespread type duplication beyond documented exceptions

## Phase 2: MCP Migration
### Prerequisites
- Phase 1 gate passed
### Ordering
- Sequential: Register 21 MCP tools → wire scoping → replace handle_tools_list → replace handle_tools_call → address cross-crate coupling → delete old MCP dispatch/schema files
### Domain Batches
| Batch | Tools | Count |
|-------|-------|-------|
| 1 | Mail (send, search, list, acknowledge) | 4 |
| 2 | Work (create, update, list, get, watch, assign) | 6 |
| 3 | Session (create, list, display.stream) | 3 |
| 4 | VXG (8 tools) | 8 |
### Gate Criteria
- IT-MCP-001 through IT-MCP-009 pass
- Schema comparison: schemars output semantically matches old hand-written schemas for all 21 tools
- Pre-initialize tools/list behavior explicitly documented and tested
- Legacy parity fixtures captured before file deletion
### Roll Back If
- Any of the 21 MCP tools changes behavior without intentional spec callout
- Schema mismatch cannot be explained by harmless metadata differences

## Phase 3: Bridge Migration + Normalization
### Prerequisites
- Phase 2 gate passed
### Ordering
- Sequential: Extract shared CBOR-JSON helper → implement StreamingMethodHandler → migrate domain batches → replace dispatch_bridge() → delete router + 19 dispatch files
### Domain Batches
| Batch | Domains | Methods |
|-------|---------|---------|
| 1 | device, capability, canvas | ~14 |
| 2 | project, view, plan, zone, work | ~51 |
| 3 | session, run, agent | ~38 |
| 4 | mail, approval, bead | ~42 |
| 5 | vxg, connector, sync | ~35 |
| 6 | utility.rs split (artifact, tool, debug, cert) | ~31 |
| 7 | cron, lease, event, trigger | ~15 |
### Per-Batch Process
For each batch: normalize param/result structs → register → capture fixtures → verify → delete old dispatch file
### Gate Criteria
- All 226 methods registered and responding correctly
- Bridge auth parity verified
- CBOR conversion parity verified
- Streaming method parity for all 4 streaming endpoints
- Event publishing parity for all 16 publishing sites
- All 19 dispatch files + router deleted
### Roll Back If
- pre_dispatch_guard() or method_permission() behavior changes
- Event delivery regresses
- Any CLI command changes output

## Phase 4: Dynamic Subsetting
### Prerequisites
- Phase 3 gate passed
### Ordering
- Sequential: Add mcp_groups to ExecutionProfile → wire to capability token → define 5 role templates → E2E test
### Gate Criteria
- E2E-SUB-001 through E2E-SUB-005 pass
- Empty-group behavior documented and tested
- Reconnect semantics verified
### Roll Back If
- Policy source duplicated across profile/bundle/token layers

## Phase 5: Surface Expansion
### Prerequisites
- Phase 4 gate passed
### Ordering
- Parallel: Each domain's mcp_exposed flags can be flipped independently
### Gate Criteria
- Context token savings >= 30% for specialized roles
- No regressions in existing MCP surface

## Completeness Mapping

| Spec Section | Phase |
|-------------|-------|
| §1 (Executive Summary) | — (context, not implementation) |
| §2 (Intent & Requirements) | — (requirements, not implementation) |
| §3 (Current State Analysis) | — (analysis, not implementation) |
| §4 (Architecture) | 1 (Registry Core) |
| §5 (Normalization Spec) | 3 (Bridge Migration) |
| §6 (Migration Strategy) | 1-5 (all phases) |
| §7 (Key Questions) | — (answered, not implementation) |
| §8 (Risks & Mitigations) | — (gates/rollback criteria incorporate key risks) |
| §9-12 (Testing/Appendices) | Referenced by gates as needed |

## Dependency Diagram

Phase 1 ──▶ Phase 2 ──▶ Phase 3 ──▶ Phase 4 ──▶ Phase 5
```

---

## Example 2: Comparison — Strategy vs Plan

### What the OLD plan-based approach produces (~3000+ lines across 6 files)

```
docs/implementation/
├── implementation-index.md          (~200 lines)
├── phase-1-registry-core.md         (~500 lines)
├── phase-2-mcp-migration.md         (~500 lines)
├── phase-3-bridge-migration.md      (~800 lines)
├── phase-4-subsetting.md            (~400 lines)
└── phase-5-expansion.md             (~300 lines)
```

Each phase file contains:
- Task descriptions rewriting spec content
- Per-task acceptance criteria (duplicating spec)
- Per-task test mappings (duplicating TDD)
- Implementation guidance (duplicating spec/architecture)
- Effort estimates
- E2E test designs with full test steps

### What the NEW strategy-based approach produces (~500-800 lines, 1 file)

```
docs/strategy/
└── unified-method-registry-strategy.md
```

Contains only:
- Phase ordering with prerequisites
- Parallel/sequential classification (item names, not descriptions)
- Domain batches (counts and groupings)
- Gate criteria (referencing TDD test IDs)
- Rollback criteria
- Completeness mapping

### Key Differences

| Aspect | Old Plan | New Strategy |
|--------|----------|-------------|
| Output size | ~3000+ lines across 6+ files | ~500-800 lines, 1 file |
| Task descriptions | Full descriptions per task | Spec section references only |
| Effort estimates | Per-phase complexity + effort | None |
| Test mappings | Per-task test file paths | Gate-level TDD test ID ranges |
| Acceptance criteria | Per-task checkbox lists | Per-phase gate criteria |
| Implementation guidance | Per-task code/architecture hints | None (in spec) |
| Drift risk | HIGH — plan rewrites spec in own words | LOW — strategy is ordering only |
| Useful lifetime | Degrades as implementation diverges | Stable — ordering rarely changes |

---

## Example 3: Desktop Application (TypeScript + Electron)

### Context

L2.5 Desktop & Web Application layer. 33 subsystems, ~84 success criteria, TypeScript stack.

### Generated Strategy Excerpt

```markdown
# L2.5 Desktop & Web — Implementation Strategy

## Source Documents
- Spec: `thoughts/layer-2.5/unified-mesh-layer-2.5-desktop.md`
- TDD: `thoughts/layer-2.5/layer-2.5-tdd.md`

## Phase Overview

| Phase | Name | Prerequisites | Gate |
|-------|------|---------------|------|
| 1.1 | Bootstrap | None | Monorepo builds, MockSwarmd connects, smoke test passes |
| 1.2 | Connection | 1.1 | CBOR WebSocket stable, reconnect works, session lifecycle correct |
| 1.3 | Shell | 1.1 (5/7 items start after 1.1, not 1.2) | App chrome renders, navigation works, scope model functional |
| 1.4 | Canvas | 1.2 + 1.3 | tldraw integration, shape rendering, selection |
| 1.5 | Apps + Dock | 1.4 | Console Dock, App Frames, Triggers, Zone portability |
| 1.6 | QA Gate | 1.5 | All step:1 TDD tests pass (327 tests) |
| 2.1 | Theme | 1.6 | Design tokens, Tailwind config, component library |
| 2.2 | Designs | 2.1 | All 18 design tasks verified with screenshots |
| 2.3 | Lock | 2.2 | Design system spec frozen, all step:2 tests pass |

## Phase 1.2: Connection
### Prerequisites
- Phase 1.1 gate passed
### Ordering
- Parallel: §D-L2.5.3 (WebSocket transport), §D-L2.5.4 (CBOR codec)
- Sequential: Transport → §D-L2.5.5 (Session lifecycle) → §D-L2.5.6 (Reconnection) → §D-L2.5.7 (Auth) → §D-L2.5.8 (Status UI)
### Gate Criteria
- UT-CONN-001 through UT-CONN-032 pass
- IT-CONN-001 through IT-CONN-020 pass
- MockSwarmd WebSocket stable under reconnect cycles
```

Note how the strategy names spec sections (§D-L2.5.3) and TDD test ranges (UT-CONN-001 through UT-CONN-032), never task descriptions. To understand what §D-L2.5.3 involves, you read the spec.
