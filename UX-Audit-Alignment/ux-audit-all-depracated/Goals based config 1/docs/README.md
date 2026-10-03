# Goals-First IA — Decision Records

Architectural Decision Records (ADRs) that bridge the Goals-First IA Recommendation into a buildable specification. Each ADR resolves one or more of the Critical/High items from the principal UX architect review.

These docs are *decision records*, not designs. They commit to schemas, state machines, and behavioral contracts. UI work happens downstream.

---

## Sprint 0 — Foundational ADRs (no UI work; unblock everything else)

| ADR | Resolves | Status |
|---|---|---|
| [ADR-001 — Automation Lifecycle State Machine](./ADR-001-automation-lifecycle-state-machine.md) | C-3 (firstRunMode hidden state) | Proposed |
| [ADR-002 — Goal as a Kind-Registered Primitive](./ADR-002-goal-kind-registry.md) | C-4 (Goal overclaimed across teams) | Proposed |
| [ADR-003 — Performance ↔ Analyze Separation of Concerns](./ADR-003-performance-analyze-separation.md) | C-7 (duplicated primitives) | Proposed |

---

## Cross-references between ADRs

- **ADR-001** introduces an automation-level state machine with a `live_with_override` state. The corresponding goal-level state machine is partially specified in **ADR-002 §2.1** (`Goal.state`); a future ADR will fully enumerate goal state transitions (this is **H-1** in the review).
- **ADR-002** references a Metric Registry (`trajectory_metric_id`). That registry is **H-6** in the review; a separate ADR (Sprint 1) will define it.
- **ADR-003** references the Metric Registry too — the disambiguation of Goals-Home tiles vs. Performance tiles depends on consistent metric definitions.
- **ADR-001's** two-person rule on `activate` depends on the permission/role model (**C-6**); a separate ADR will define that.

## Recommended sequencing

1. **Sprint 0 (now):** ADR-001, ADR-002, ADR-003 — *this batch*
2. **Sprint 1:** Permission/role model (C-6), Metric Registry (H-6), Topic taxonomy hierarchy (C-5)
3. **Sprint 1:** Activate-as-sequence ADR (C-1), Preview-against-eval ADR (C-2)
4. **Sprint 2:** Suggestion conflict + staleness ADR (H-3), Ownership-transfer ADR (H-2)

## How to use these documents

- **PMs / Staff PD:** Read the Context and Decision sections. The Acceptance checklists at the bottom tell you when this ADR is signed off.
- **Eng:** Schemas (ADR-002) and state tables (ADR-001) are the contract you build against. Transition triggers and chrome contracts (ADR-003) are non-negotiable; cost everything else against them.
- **Reviewers:** Open Questions sections list known unresolved sub-decisions; they are tracked as follow-ups, not blockers for the parent ADR.

## Status meanings

- **Proposed** — written, not yet reviewed. Open to material change.
- **Accepted** — reviewed and signed off by Eng + PM + Staff PD. Schemas are now contracts.
- **Superseded** — replaced by a later ADR; kept in the index for historical context.
- **Deprecated** — accepted at the time, no longer reflects current architecture; superseded ADR usually exists.
