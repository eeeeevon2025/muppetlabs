# ADR-003 — Performance ↔ Analyze Separation of Concerns

**Status:** Proposed · Sprint 0
**Resolves:** C-7 (Performance and Analyze are structurally indistinguishable)
**Operating System principles addressed:** §6 Navigation & Spatial Consistency, §3.19 System Status, §3.20 Zero-Guess Interaction, §3.2 Brutal Cognitive Load Reduction
**Owner:** Staff PD + PM + Eng
**Date:** 2026-05-27

---

## 1. Context

The IA proposal positions three layered metric surfaces:

| Surface | Question it answers |
|---|---|
| **Goals** | "Did we hit the outcome?" |
| **Performance** | "Are agents healthy right now?" |
| **Analyze** (per-automation) | "Is this automation behaving?" |

Performance and Analyze share the same three child primitives: **Monitors, Suggestions, Anomalies**. The proposal also states that Suggestions live inline on every affected block (Procedure, KB, Tool, Guardrail).

That is *three homes* for the same primitives — Performance, per-automation Analyze, and inline-on-block. The IA's resolution is a contract: "rollup rows carry a scoping pill that deep-links to source; sources footer-link to 'across all automations'."

A contract is not an architecture. The Operating System forbids duplicated navigation systems (§6: "Avoid duplicated navigation systems") and demands zero-guess interaction (§3.20). If admins land at Performance and see a fixable issue, they will try to fix it there. If they land at Analyze and see the same issue from a different angle, they will try to fix it again. Conflicts, double-applies, dismiss-in-one-but-not-the-other — all become live operational risks.

---

## 2. Decision

**Performance is a read-only aggregate surface. Analyze owns all per-automation authoring.**

The duplicated-primitive problem is resolved by collapsing authoring to a single home and explicitly preventing Performance from being an authoring surface — enforced in chrome, in the action set, and in the data layer.

### 2.1 Authoring vs. Aggregate — the contract

| Capability | Performance | Analyze (per-automation) | Inline on block |
|---|---|---|---|
| List/read Monitors | yes (across automations) | yes (this automation's) | n/a |
| Create/edit a Monitor | **no** | **yes** | n/a |
| Disable/enable a Monitor | **no** (deep-links to Analyze) | **yes** | n/a |
| List/read Suggestions | yes (cross-AI queue) | yes (this automation's) | yes (the one on this block) |
| **Apply** a Suggestion | **no** (deep-links to inline-on-block) | **yes** | **yes** |
| **Dismiss** a Suggestion | **no** (deep-links to inline-on-block) | **yes** | **yes** |
| List/read Anomalies | yes (cross-AI) | yes (this automation's) | n/a |
| Acknowledge an Anomaly | **no** (deep-links to Analyze) | **yes** | n/a |
| Resolve an Anomaly | **no** (deep-links to Analyze) | **yes** | n/a |

**Performance can ONLY do bulk read-only actions:**
- Bulk-export to CSV
- Bulk-mark-for-review (creates work-items; does not change underlying state)
- Bulk-drill (open a filtered Analyze view across all matching automations)

These actions are intentional. They do not change the state of Monitors, Suggestions, or Anomalies — they create out-of-band work items.

### 2.2 Chrome enforcement

Every surface declares its mode in chrome. Admins never have to infer where they are.

- **Performance** displays a persistent ribbon: `Aggregate · read-only · drill to source to act`
- **Analyze** displays a persistent ribbon: `Authoring · this automation` with the automation name
- **Inline-on-block** uses the existing slide-out chrome (already authoring-scoped)

The chrome ribbons are not decorative. They are the §3.19 status signal. They render at the top of the page below the breadcrumb, in a distinct color band.

### 2.3 The "drill to source" deep-link contract

Every Performance row exposes a single deep-link affordance that opens the source authoring surface, pre-scoped. The link is the *only* way to act from Performance.

| Row type on Performance | Drill target | Pre-scope |
|---|---|---|
| Monitor row | `automation:{id}:analyze/monitors/{monitor_id}` | filtered to this monitor |
| Suggestion row | inline slide-out for the target block | pre-loaded with diff |
| Anomaly row | `automation:{id}:analyze/anomalies/{anomaly_id}` | filtered to this anomaly |

The Performance row does *not* contain Apply, Dismiss, Acknowledge, Resolve, or Edit buttons. Hover does not reveal hidden actions. The only action is the drill link.

### 2.4 Sync model

When Analyze (or inline-on-block) commits a state change, Performance reflects within the eventual-consistency SLA:

- **P95 latency:** 5 seconds
- **Max latency:** 30 seconds
- **Mechanism:** server-side event bus emits `monitor.updated | suggestion.updated | anomaly.updated`; Performance subscribes and re-renders affected rows.

If Performance is stale at render time, an inline "Updated {N}s ago — refresh" affordance appears at the top right of the affected section.

**Performance never optimistically updates.** State changes flow through Analyze, get persisted, then surface on Performance. This is the §3.20 zero-guess principle: the admin who made a change in Analyze does not see Performance update *before* the persistence completes.

### 2.5 What about the "Anomalies is AI-only inside a cross-agent rollup" friction?

The IA acknowledged this and proposed labeling ("AI only" subhead). That stays — but we tighten it: Performance's three sections (Monitors / Suggestions / Anomalies) each declare their coverage:

- **Monitors:** AI + human (Quality Monitor scorecards span both)
- **Suggestions:** AI-only at launch (human coaching paths are deferred)
- **Anomalies:** AI-only (Validation Agent)

The section headers carry an explicit coverage badge: `AI · human` or `AI only`. Not a subhead — a typed metadata signal admins can filter on.

### 2.6 Goals Home rollup tiles vs. Performance rollup tiles — disambiguation

Goals Home shows outcome tiles ("did we hit the target?"). Performance shows operational tiles ("are signals healthy?"). They will *look* similar. They must be distinguished:

| Surface | Tile question | Time window | Acting affordance |
|---|---|---|---|
| Goals Home | "On track / at risk / draft" — outcome classification | per goal's window (typically 90d) | open Goal Detail |
| Performance | "Pass rate / drift / open count" — operational | rolling 7d default | drill to Analyze |

Tiles must never share a renderer. The kind registry (ADR-002) and Performance components are separate code paths. Visual chrome differs deliberately: Goals tiles emphasize the target value and direction; Performance tiles emphasize the operational metric and trend slope.

---

## 3. Consequences

**Positive**

- §6 satisfied: one home for authoring each primitive. The duplicated-navigation anti-pattern is removed.
- §3.19 satisfied: chrome ribbons announce surface mode. Admins know whether they can act.
- §3.20 satisfied: no implicit "did this apply here or also there?" question.
- Suggestion conflict surface area shrinks dramatically: Apply only happens from Analyze or inline-on-block, which already know each other's state via shared persistence.

**Negative / cost**

- Performance becomes more inert. Admins who land there from an alert email cannot one-click resolve. They must drill. This is the intended trade — §3.13 (Friction Where It Matters) — high-stakes acts require navigation into the authoring surface.
- Eventual-consistency model requires staleness handling in chrome.
- Bulk actions (mass-dismiss across automations) move out of Performance. Replaced by "bulk-mark-for-review" + drill, which is slower but safer.

**Migration**

- Existing prototype-v2 has only minimal Performance authoring affordances; strip the few that exist.
- Re-route any existing "Apply from Performance" UI to the deep-link.

---

## 4. Alternatives considered

| Alternative | Rejected because |
|---|---|
| **Performance owns authoring; Analyze is read-only per-automation slice** | Performance is a leadership-readable rollup. Adding authoring to it makes the surface dense (§3.2 Cognitive Load) and conflicts with the leadership mental model. |
| **Both authoring; sync via last-write-wins** | Creates the exact conflict-and-staleness problem the IA was supposed to remove. Two homes, two intents, one truth — admins lose trust. |
| **Performance is just deep-link rows; no aggregate** | Loses the leadership "are agents healthy?" rollup that justified Performance's existence. |
| **Collapse Performance entirely into Reporting** | Performance is operational, not analytical. Reporting users build queries; Performance users scan for active drift. Different mental models. |

---

## 5. Open questions

- Q1: Cross-automation alerts (a monitor that watches *all* automations for a topic) — where does that monitor live as its canonical authoring home? Recommend: a new "Shared Monitors" section in Building Blocks; Performance shows them aggregated like any other.
- Q2: The bulk-mark-for-review work-items — where do they live? Recommend: per-user review queue, surfaced in the notifications area.
- Q3: Performance "drift" computation — what defines "active drift" vs. "noise"? Out of scope for this ADR; will be defined in the Metric Registry ADR (H-6).

---

## 6. Acceptance for this ADR

This ADR is accepted when:

- [ ] Authoring matrix (§2.1) reviewed by Eng + PM + Staff PD
- [ ] Chrome ribbon designs spec'd (separate UI ADR)
- [ ] Deep-link contract (§2.3) signed off by Eng
- [ ] Eventual-consistency SLA accepted by Eng (5s P95, 30s max)
- [ ] Section coverage badges (§2.5) reviewed
- [ ] Goals-Home-vs-Performance tile disambiguation (§2.6) reviewed by Staff PD
- [ ] Open questions Q1–Q3 tracked as follow-ups, not blockers
