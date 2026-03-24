# Beads From Sources — Examples

Real-world examples demonstrating bead creation directly from Spec + TDD + Strategy, with verbatim content embedding.

---

## Example 1: Task Bead with Verbatim Spec + TDD

This shows a task bead that embeds spec requirements verbatim and includes full TDD test assertions.

### Source Documents

```
Spec:     thoughts/layer-2.5/unified-mesh-layer-2.5-desktop.md v4.0.12
TDD:      thoughts/layer-2.5/layer-2.5-tdd.md v1.4.5
Strategy: thoughts/layer-2.5/l2.5-build-strategy.md v1.0.0
```

### Bead: T-1.2.1 — CBOR WebSocket Transport

```yaml
id: bd-3pcr.2.1
title: "T-1.2.1: CBOR WebSocket Transport"
type: task
status: pending
parent_bead_id: bd-3pcr.2
deps: [bd-3pcr.1.6]
labels: [phase-1-2, step-1, connection, transport]
description: |
  # T-1.2.1: CBOR WebSocket Transport

  ## SOURCE OF TRUTH WARNING

  This bead is a quick-reference derived from:
  - **Spec**: `thoughts/layer-2.5/unified-mesh-layer-2.5-desktop.md` — §D-L2.5.2 (PRIMARY — read this first)
  - **TDD**: `thoughts/layer-2.5/layer-2.5-tdd.md` — UT-L2.5.02-001 through UT-L2.5.02-008 (PRIMARY — test definitions here)
  - **Strategy**: `thoughts/layer-2.5/l2.5-build-strategy.md` — Phase 1.2 (ordering context only)

  Before implementing, you MUST read the referenced spec and TDD sections directly.
  This bead embeds key excerpts but the full documents are authoritative.

  ## Spec Requirements

  ### From §D-L2.5.2: WebSocket Connection Manager

  > The WebSocket Connection Manager establishes and maintains the CBOR-encoded
  > WebSocket connection to swarmd. All RPC communication uses CBOR on the wire
  > (NOT JSON). The connection manager handles:
  >
  > 1. Connection lifecycle (connect, reconnect, disconnect)
  > 2. CBOR encode/decode for all messages
  > 3. Request/response correlation via message IDs
  > 4. Heartbeat ping/pong at 30-second intervals
  > 5. Exponential backoff reconnection (1s, 2s, 4s, 8s, max 30s)
  > 6. Connection state observable (connecting, connected, disconnected, error)

  **Acceptance Criteria** (from spec §D-L2.5.2):
  1. WebSocket connects to `ws://localhost:{port}/ws` with CBOR subprotocol
  2. All messages encoded/decoded as CBOR (never JSON on the wire)
  3. Request/response pairs correlated by unique message ID
  4. Heartbeat sent every 30s; connection closed if no pong within 10s
  5. Reconnection uses exponential backoff: 1s → 2s → 4s → 8s → max 30s
  6. Connection state exposed as observable stream

  ## Implementation Details

  ### Files to Create/Modify
  - `packages/core/src/transport/ws-connection.ts` — WebSocket connection manager
  - `packages/core/src/transport/cbor-codec.ts` — CBOR encode/decode utilities
  - `packages/core/src/transport/types.ts` — Transport type definitions

  ### Architecture Context (from spec §D-L2.5.2)
  - Uses `cbor-x` library for CBOR encoding (faster than `cbor`)
  - Connection state modeled as a finite state machine
  - Message ID format: `{timestamp}-{random}` (collision-resistant)
  - Heartbeat runs on the connection level, not per-request

  ## Tests To Pass

  ### UT-L2.5.02-001: WebSocket Connection Lifecycle
  **Priority:** P0 | **Type:** UT | **Subsystem:** D-L2.5.2

  ```typescript
  import { describe, it, expect, vi } from 'vitest';
  import { WsConnectionManager } from './ws-connection';
  import { MockWebSocket } from '../test-utils/mock-ws';

  describe('WsConnectionManager', () => {
    it('connects with CBOR subprotocol', () => {
      const ws = new MockWebSocket();
      const mgr = new WsConnectionManager({ url: 'ws://localhost:9000/ws', ws });
      mgr.connect();
      expect(ws.protocol).toBe('cbor');
      expect(ws.url).toBe('ws://localhost:9000/ws');
    });

    it('transitions through connection states', async () => {
      const mgr = new WsConnectionManager({ url: 'ws://localhost:9000/ws' });
      const states: string[] = [];
      mgr.state$.subscribe(s => states.push(s));

      mgr.connect();
      expect(states).toContain('connecting');

      await mgr.waitForOpen();
      expect(states).toContain('connected');

      mgr.disconnect();
      expect(states).toContain('disconnected');
    });
  });
  ```

  **Expected Output:** Connection state transitions follow FSM: disconnected → connecting → connected → disconnected.
  **False Positive Prevention:** Checks state sequence, not just final state.

  ### UT-L2.5.02-003: CBOR Encode/Decode Round-Trip
  **Priority:** P0 | **Type:** UT | **Subsystem:** D-L2.5.2

  ```typescript
  describe('CBOR codec', () => {
    it('round-trips RPC messages', () => {
      const msg = {
        id: '1234-abcd',
        method: 'agent.list',
        params: { workspace_id: 'ws-001' },
      };
      const encoded = cborEncode(msg);
      expect(encoded).toBeInstanceOf(Uint8Array);

      const decoded = cborDecode(encoded);
      expect(decoded).toEqual(msg);
    });

    it('handles binary payloads', () => {
      const msg = { data: new Uint8Array([0x01, 0x02, 0x03]) };
      const decoded = cborDecode(cborEncode(msg));
      expect(decoded.data).toEqual(new Uint8Array([0x01, 0x02, 0x03]));
    });
  });
  ```

  **Expected Output:** Messages survive encode→decode without loss.

  ### UT-L2.5.02-005: Exponential Backoff Reconnection
  **Priority:** P1 | **Type:** UT | **Subsystem:** D-L2.5.2

  ```typescript
  describe('reconnection', () => {
    it('uses exponential backoff', async () => {
      vi.useFakeTimers();
      const mgr = new WsConnectionManager({
        url: 'ws://localhost:9000/ws',
        maxReconnectDelay: 30_000,
      });

      // Simulate connection failure
      mgr.connect();
      mgr.simulateClose(1006);

      // First retry after 1s
      expect(mgr.nextRetryDelay).toBe(1000);
      vi.advanceTimersByTime(1000);

      // Second retry after 2s
      mgr.simulateClose(1006);
      expect(mgr.nextRetryDelay).toBe(2000);

      // Verify cap at 30s
      for (let i = 0; i < 10; i++) {
        vi.advanceTimersByTime(mgr.nextRetryDelay);
        mgr.simulateClose(1006);
      }
      expect(mgr.nextRetryDelay).toBeLessThanOrEqual(30_000);
    });
  });
  ```

  **Expected Output:** Delay doubles each retry, capped at 30s.

  ## Acceptance Criteria

  1. WebSocket connects to `ws://localhost:{port}/ws` with CBOR subprotocol
  2. All messages encoded/decoded as CBOR (never JSON on the wire)
  3. Request/response pairs correlated by unique message ID
  4. Heartbeat sent every 30s; connection closed if no pong within 10s
  5. Reconnection uses exponential backoff: 1s → 2s → 4s → 8s → max 30s
  6. Connection state exposed as observable stream
  7. Tests pass: UT-L2.5.02-001, UT-L2.5.02-003, UT-L2.5.02-005

  ## Gotchas & Anti-Patterns

  1. **Do NOT use JSON on the wire.** The spec mandates CBOR. Using JSON will break interop with swarmd.
  2. **Do NOT use `cbor` library.** Use `cbor-x` for performance (spec §D-L2.5.2 mandates this).
  3. **Heartbeat is connection-level.** Do not implement per-request timeouts here.
  4. **Message IDs must be unique across reconnections.** Reset the correlation map on reconnect.

  ## Dependencies

  - **Blocked by:** bd-3pcr.1.6 (Phase 1.1 QA Gate)
  - **Blocks:** bd-3pcr.2.2 (RPC Client), bd-3pcr.2.3 (Connection UI)
  - **Phase:** 1.2 — Connection & Transport
```

---

## Example 2: QA Gate Bead with Embedded E2E Tests

QA gates embed gate criteria from the strategy AND complete test definitions from the TDD.

```yaml
id: bd-3pcr.2.8
title: "Phase 1.2 QA Gate"
type: task
status: pending
parent_bead_id: bd-3pcr.2
deps: [bd-3pcr.2.1, bd-3pcr.2.2, bd-3pcr.2.3, bd-3pcr.2.4, bd-3pcr.2.5, bd-3pcr.2.6, bd-3pcr.2.7]
labels: [phase-1-2, step-1, qa-gate]
description: |
  # Phase 1.2 QA Gate: Connection & Transport

  ## SOURCE OF TRUTH WARNING

  This bead is a quick-reference derived from:
  - **Spec**: `thoughts/layer-2.5/unified-mesh-layer-2.5-desktop.md` — §D-L2.5.2-D-L2.5.3 (PRIMARY)
  - **TDD**: `thoughts/layer-2.5/layer-2.5-tdd.md` — IT-L2.5.02-*, IT-L2.5.03-* (PRIMARY)
  - **Strategy**: `thoughts/layer-2.5/l2.5-build-strategy.md` — Phase 1.2 gate (ordering context only)

  ## Gate Criteria (from strategy)

  Phase 1.2 passes when:
  1. CBOR WebSocket connects to swarmd and exchanges messages
  2. RPC client sends requests and receives responses
  3. Connection state is observable and drives UI indicators
  4. All Phase 1.2 unit tests pass
  5. All Phase 1.2 integration tests pass

  ## Prerequisites

  All Phase 1.2 tasks must be complete:
  - [ ] bd-3pcr.2.1 — CBOR WebSocket Transport
  - [ ] bd-3pcr.2.2 — RPC Client Layer
  - [ ] bd-3pcr.2.3 — Connection Status UI
  - [ ] bd-3pcr.2.4 — Auth Token Injection
  - [ ] bd-3pcr.2.5 — Message Queue & Retry
  - [ ] bd-3pcr.2.6 — Connection Error Handling
  - [ ] bd-3pcr.2.7 — Transport Integration Wiring

  ## Integration Tests to Execute

  ### IT-L2.5.02-001: Full RPC Round-Trip
  **Priority:** P0 | **Type:** IT | **Subsystem:** D-L2.5.2

  ```typescript
  import { describe, it, expect } from 'vitest';
  import { createMockSwarmd } from '../test-utils/mock-swarmd';
  import { WsConnectionManager } from '../transport/ws-connection';
  import { RpcClient } from '../transport/rpc-client';

  describe('Full RPC round-trip', () => {
    it('sends request and receives response via CBOR', async () => {
      const swarmd = await createMockSwarmd({ port: 0 });
      swarmd.onMethod('agent.list', () => ({
        agents: [{ id: 'agent-1', name: 'Test Agent' }],
      }));

      const ws = new WsConnectionManager({ url: swarmd.url });
      const rpc = new RpcClient(ws);
      await ws.connect();

      const result = await rpc.call('agent.list', { workspace_id: 'ws-1' });
      expect(result.agents).toHaveLength(1);
      expect(result.agents[0].id).toBe('agent-1');

      await ws.disconnect();
      await swarmd.close();
    });
  });
  ```

  **Expected Output:** RPC call returns mock response through CBOR WebSocket.

  ### IT-L2.5.02-003: Reconnection Recovery
  **Priority:** P1 | **Type:** IT | **Subsystem:** D-L2.5.2

  ```typescript
  describe('Reconnection recovery', () => {
    it('re-sends queued messages after reconnect', async () => {
      const swarmd = await createMockSwarmd({ port: 0 });
      const ws = new WsConnectionManager({ url: swarmd.url });
      const rpc = new RpcClient(ws);
      await ws.connect();

      // Queue a request during disconnect
      swarmd.dropConnections();
      const pending = rpc.call('agent.get', { id: 'agent-1' });

      // Reconnect
      await ws.waitForReconnect();
      swarmd.onMethod('agent.get', () => ({ id: 'agent-1', name: 'Test' }));

      const result = await pending;
      expect(result.id).toBe('agent-1');
    });
  });
  ```

  ## Automated Verification

  ```bash
  cd agent-swarm-ui
  bun run typecheck
  bunx turbo test --filter=@swarm/core -- --grep "transport|connection|rpc"
  bun run lint
  ```

  ## Success Criteria

  - [ ] All unit tests for Phase 1.2 pass (UT-L2.5.02-* and UT-L2.5.03-*)
  - [ ] All integration tests pass (IT-L2.5.02-001, IT-L2.5.02-003)
  - [ ] Connection state observable drives UI correctly
  - [ ] No TypeScript errors in transport layer
  - [ ] Ready to proceed to Phase 1.3
```

---

## Example 3: Phase Epic with SOT References

Phase epics reference the scope within each SOT document.

```yaml
id: bd-3pcr.2
title: "Phase 1.2: Connection & Transport"
type: epic
status: pending
parent_bead_id: bd-3pcr
deps: [bd-3pcr.1.6]
labels: [phase-1-2, step-1, connection]
description: |
  # Phase 1.2: Connection & Transport

  ## SOURCE OF TRUTH WARNING

  - **Spec**: `thoughts/layer-2.5/unified-mesh-layer-2.5-desktop.md` — §D-L2.5.2, §D-L2.5.3
  - **TDD**: `thoughts/layer-2.5/layer-2.5-tdd.md` — §02, §03
  - **Strategy**: `thoughts/layer-2.5/l2.5-build-strategy.md` — Phase 1.2

  ## Overview

  Establish the CBOR WebSocket transport layer that all UI↔swarmd communication flows through.
  This phase creates the connection manager, RPC client, and connection status UI.

  ## Tasks (8 total)

  1. **T-1.2.1** — CBOR WebSocket Transport (spec §D-L2.5.2)
  2. **T-1.2.2** — RPC Client Layer (spec §D-L2.5.2)
  3. **T-1.2.3** — Connection Status UI (spec §D-L2.5.3)
  4. **T-1.2.4** — Auth Token Injection (spec §D-L2.5.2)
  5. **T-1.2.5** — Message Queue & Retry (spec §D-L2.5.2)
  6. **T-1.2.6** — Connection Error Handling (spec §D-L2.5.2)
  7. **T-1.2.7** — Transport Integration Wiring (spec §D-L2.5.2+3)
  8. **QA Gate** — Phase 1.2 verification

  ## Spec Coverage

  | Requirement | Bead |
  |------------|------|
  | §D-L2.5.2 Connection Manager | T-1.2.1 |
  | §D-L2.5.2 RPC Protocol | T-1.2.2 |
  | §D-L2.5.3 Status Indicator | T-1.2.3 |
  | §D-L2.5.2 Authentication | T-1.2.4 |
  | §D-L2.5.2 Message Reliability | T-1.2.5 |
  | §D-L2.5.2 Error Handling | T-1.2.6 |

  ## TDD Coverage

  | Test Range | Bead |
  |-----------|------|
  | UT-L2.5.02-001..008 | T-1.2.1, T-1.2.2, T-1.2.5 |
  | UT-L2.5.03-001..004 | T-1.2.3 |
  | IT-L2.5.02-001..003 | QA Gate |

  ## Dependencies

  - **Blocked by:** Phase 1.1 QA Gate (bd-3pcr.1.6)
  - **Blocks:** Phase 1.3 (Shell & Layout)
```

---

## Example 4: Root Epic

```yaml
id: bd-3pcr
title: "L2.5 — Desktop & Web Application"
type: epic
status: pending
deps: []
labels: [l2-5, root]
description: |
  # L2.5 — Desktop & Web Application

  ## SOURCE OF TRUTH WARNING

  All beads in this project implement features from:
  - **Spec**: `thoughts/layer-2.5/unified-mesh-layer-2.5-desktop.md` v4.0.12 (PRIMARY)
  - **TDD**: `thoughts/layer-2.5/layer-2.5-tdd.md` v1.4.5 (PRIMARY)
  - **Strategy**: `thoughts/layer-2.5/l2.5-build-strategy.md` v1.0.0 (ORDERING ONLY)

  When implementing any bead:
  1. Read the spec section referenced in the bead
  2. Read the TDD tests referenced in the bead
  3. Use the bead content as a quick reference, NOT as the complete specification
  4. The spec + TDD are ALWAYS the source of truth

  ## Phases

  1. **Phase 1.1** — Bootstrap & Scaffold (6 beads)
  2. **Phase 1.2** — Connection & Transport (8 beads)
  3. **Phase 1.3** — Shell & Layout (7 beads)
  4. **Phase 1.4** — Canvas Foundation (6 beads)
  5. **Phase 1.5** — Apps & Dock (14 beads)
  6. **Phase 1.6** — QA & Polish (7 beads)
  7. **Phase 2.1** — Theme System (5 beads)
  8. **Phase 2.2** — Design Implementation (18 beads)
  9. **Phase 2.3** — Design Lock (4 beads)

  ## Coverage Summary

  - Spec requirements: 84 total → 84 covered (100%)
  - TDD tests: 499 total → 499 assigned (100%)
  - Step split: 327 step:1, 24 step:2, 148 step:3
```

---

## Example 5: Coverage Verification Report

After creating all beads, produce a coverage report like this:

```
COVERAGE VERIFICATION REPORT
=============================
Feature: L2.5 Desktop & Web Application
Date: 2026-02-21
Beads: 86 total (1 root + 9 phase epics + 75 tasks + 1 gate)

SPEC REQUIREMENT COVERAGE
--------------------------
§D-L2.5.1 (Monorepo)       → bd-3pcr.1.1                    ✓
§D-L2.5.2 (Connection)     → bd-3pcr.2.1, .2.2, .2.4-.2.6  ✓
§D-L2.5.3 (Status UI)      → bd-3pcr.2.3                    ✓
§D-L2.5.4 (Shell)          → bd-3pcr.3.1, .3.2              ✓
...
Coverage: 33/33 subsystems covered (100%)
Uncovered: NONE

TDD TEST COVERAGE
------------------
UT-L2.5.01-001..003  → bd-3pcr.1.1, .1.2, .1.3             ✓
UT-L2.5.02-001..008  → bd-3pcr.2.1, .2.2, .2.5             ✓
IT-L2.5.02-001..003  → bd-3pcr.2.8 (QA Gate)               ✓
...
Coverage: 499/499 tests assigned (100%)
Unassigned: NONE

DRIFT CHECK
------------
Spot-checked 10 random beads:
- bd-3pcr.1.1: AC matches spec ✓, tests match TDD ✓
- bd-3pcr.2.1: AC matches spec ✓, tests match TDD ✓
- bd-3pcr.3.1: AC matches spec ✓, tests match TDD ✓
...
Drift detected: NONE

BEAD SIZE STATISTICS
---------------------
Min: 4,075 chars (bd-3pcr.7.4 — integration wiring)
Max: 36,287 chars (bd-3pcr.5.1 — complex subsystem)
Avg: 10,555 chars
Median: 8,036 chars
Thin beads (<5000 chars): 4 (all scope-appropriate)

VERDICT: PASS — ready for beads-to-execution
```

---

## Anti-Pattern Examples

### BAD: Bead with Paraphrased Spec Content

```markdown
## Overview
The WebSocket manager handles connections to the backend server.
It supports reconnection and heartbeat monitoring.
```

**Why this is bad:** This is paraphrased. The spec says specific things about CBOR encoding, 30-second heartbeat intervals, and exponential backoff. The paraphrase loses precision and introduces drift.

### GOOD: Bead with Verbatim Spec Content

```markdown
## Spec Requirements

### From §D-L2.5.2: WebSocket Connection Manager

> The WebSocket Connection Manager establishes and maintains the CBOR-encoded
> WebSocket connection to swarmd. All RPC communication uses CBOR on the wire
> (NOT JSON).

**Acceptance Criteria** (from spec §D-L2.5.2):
1. WebSocket connects to `ws://localhost:{port}/ws` with CBOR subprotocol
2. Heartbeat sent every 30s; connection closed if no pong within 10s
3. Reconnection uses exponential backoff: 1s → 2s → 4s → 8s → max 30s
```

### BAD: Bead with Test ID Only (No Assertions)

```markdown
## Tests
- UT-L2.5.02-001: WebSocket connection test
- UT-L2.5.02-003: CBOR encoding test
```

**Why this is bad:** Test IDs without assertions are useless. The implementing agent doesn't know what to verify.

### GOOD: Bead with Full Test Assertions

```markdown
## Tests To Pass

### UT-L2.5.02-001: WebSocket Connection Lifecycle
```typescript
it('connects with CBOR subprotocol', () => {
  const mgr = new WsConnectionManager({ url: 'ws://localhost:9000/ws' });
  mgr.connect();
  expect(ws.protocol).toBe('cbor');
});
```
```

### BAD: Strategy Content Used as Bead Content

```markdown
## Overview (from strategy Phase 1.2)
Phase 1.2 establishes the transport layer. This phase has 8 tasks
and takes approximately 3-4 weeks.
```

**Why this is bad:** The strategy is for ordering only. "8 tasks" and "3-4 weeks" are structural metadata, not implementation content. Bead content must come from the spec.

---

## Quick Reference: bd Commands

```bash
# Create hierarchy
bd create "Root Epic" --type epic
bd create "Phase Epic" --type epic --parent <root-id>
bd create "Task" --type task --parent <phase-id>

# Set dependencies
bd update <id> --deps <dep1>,<dep2>

# Add labels (include spec section references)
bd update <id> --labels "phase-1,spec-d-l2.5.2,step-1"

# Query
bd list --json          # All beads
bd ready --json         # Ready to work
bd show <id> --json     # Single bead details

# Analysis
bv --robot-insights     # Graph metrics
bv --robot-plan         # Execution plan
```
