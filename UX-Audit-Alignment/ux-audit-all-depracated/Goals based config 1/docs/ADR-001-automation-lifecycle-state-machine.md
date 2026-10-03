# ADR-001 — Automation Lifecycle State Machine

**Status:** Proposed · Sprint 0
**Resolves:** C-3 (firstRunMode is a hidden state machine)
**Operating System principles addressed:** §3.19 System Status, §3.20 Zero-Guess Interaction, §3.11 Human-in-the-Loop Control, §3.8 Reversibility
**Owner:** Staff PD + Eng
**Date:** 2026-05-27

---

## 1. Context

The IA proposal collapses the parallel AI Setup wizard into the per-automation Build tab via a boolean flag `firstRunMode: true | false`. The same Build surface authors both first-run drafts and live edits; first-run mode adds a stepper, locks future tabs, and renders parser-drafted callouts.

The flag is described in prose. It is not a state machine. The proposal leaves the following unanswered:

- Can two admins enter the wizard concurrently?
- What happens when an admin starts a draft and leaves it for 90 days?
- Does first-run mode re-appear if Deploy is reverted?
- Can an admin edit a deployed automation back into first-run mode?
- What distinguishes a never-deployed automation from one that has been reverted?
- Does pausing an automation revert it to draft, or hold it in a separate paused state?
- When an automation is archived, what happens to its goal associations?

At enterprise scale (multi-admin teams, multi-month deploy timelines, governance audits) every one of these becomes a support ticket the IA cannot answer.

**The Operating System is non-negotiable:** §3.19 ("Status is not decorative. Status is operational trust") and §3.20 ("Make implicit states explicit") require an enumerated lifecycle, not a boolean.

---

## 2. Decision

Automation lifecycle is modeled as an explicit finite state machine with **eight states** and **typed transitions**. `firstRunMode` is **derived** from the state, not stored separately.

### States

| ID | Display | First-run mode? | Customer-facing? | Editable? | Description |
|---|---|---|---|---|---|
| `draft` | Draft | yes | no | yes | Created but never tested. Stepper visible. Future tabs locked. |
| `in_wizard` | Setting up (locked) | yes | no | exclusive | Sub-state of draft. One admin currently holds an editor lock. Other admins see a read-only view + a "Take over" affordance. |
| `ready_for_test` | Ready to test | yes | no | yes | Build content saved; eval not yet run. |
| `tested` | Tested | yes | no | yes | Eval has run; results available. Test → Deploy unlocked. |
| `live` | Live | no | yes | yes | Activated. All tabs unlocked. |
| `live_with_override` | Live (override) | no | yes | yes | Activated with a known-failing category routed away. Tracked as recurring suggestion + monitor (see ADR-001-Override). |
| `paused` | Paused | no | no | yes (limited) | Was live, now suspended. Settings + analyze accessible; cannot author new content without exiting paused. |
| `reverted` | Reverted to draft | yes | no | yes | A live automation was reverted. Equivalent to `tested` but flagged so reviewers know it has prior production history. |
| `archived` | Archived | no | no | no | Soft-delete. Goal associations preserved for audit; not visible in main lists. |

### Transitions

```
draft ──save──> ready_for_test ──run-eval──> tested ──activate──> live
                                                          │
                                                          └─activate-with-override─> live_with_override

draft ──lock──> in_wizard ──unlock──> draft           (any admin can enter/exit)

live          ──pause──> paused      ──resume──> live
live_with_override ──pause──> paused
live          ──revert──> reverted   (creates new revision; production rolls back)
live_with_override ──revert──> reverted

paused        ──archive──> archived  (manual)
draft         ──archive──> archived
reverted      ──save──> ready_for_test   (loop back to test)

archived      ──restore──> paused    (admin-only)
```

Disallowed: `live ──> draft` (must go through `reverted`). `archived ──> live` (must restore to paused first).

### Triggers — who can fire each transition

| Transition | Requires role | Requires gate |
|---|---|---|
| `save` (draft → ready_for_test) | AI Admin | none |
| `run-eval` (ready_for_test → tested) | AI Admin | none |
| `activate` (tested → live) | AI Admin + Reviewer (two-person rule) | passing eval OR explicit override decision recorded |
| `activate-with-override` | AI Admin + Reviewer | override decision recorded; recurring suggestion + monitor auto-created |
| `pause` | AI Admin | none — pause is recoverable |
| `resume` | AI Admin + Reviewer | re-eval if paused > 7 days |
| `revert` | AI Admin + Reviewer | reason required; production rollback completes before state flip |
| `archive` | AI Admin | confirmation modal showing goal associations being severed |
| `restore` | Org Admin | confirmation modal |

### Editor lock (`in_wizard` sub-state)

When an admin opens the Build tab on a `draft` automation, an editor lock is acquired:

- Lock TTL: 15 minutes of inactivity, then auto-released.
- Other admins see: `Setting up — locked by {admin name} · since {time}`. A "Request takeover" button sends an in-app notification to the lockholder.
- Lockholder sees a heartbeat indicator and a "Release lock" button.
- Force-takeover requires Org Admin role; produces an audit entry.

**Concurrency model: pessimistic for first-run mode; optimistic (last-write-wins with version stamps) for live editing.** This is a deliberate asymmetry: first-run setup is high-stakes per-step and benefits from exclusion; live edits are higher-frequency and lower-stakes per-change.

### Re-entry into first-run mode

`reverted` is its own state, not a return to `draft`. Stepper UI re-appears with a banner: `Reverted from production · originally deployed {date} by {admin}`. This makes the difference between "never been live" and "was live, now isn't" legible.

### Draft persistence

- Drafts never auto-delete.
- Drafts unmodified for 90 days surface in the Automations list with an "Inactive draft" badge.
- Drafts unmodified for 180 days require a re-confirm step before further edits.
- Archive is the only path that removes a draft from view.

---

## 3. UI implications

These are recorded for the downstream UI spec; this ADR commits only to the state machine.

- Build tab chrome reads from `automation.state`, not `firstRunMode`. The stepper, locked tabs, and parser callouts switch on `draft | in_wizard | ready_for_test | tested | reverted`.
- Status pill shows the user-facing display name (table column above).
- Editor lock surfaces as a banner at the top of Build when another admin holds it.
- "Reverted" banner persists on `reverted` automations until the next successful activate.

---

## 4. Consequences

**Positive**

- Every cell in the lifecycle is named. §3.19 satisfied.
- Multi-admin concurrency is no longer "undefined." §3.11 satisfied (Human-in-the-Loop control is real).
- Reversibility is a state, not a button. §3.8 satisfied.
- Audit becomes possible: every transition is loggable with `from_state`, `to_state`, `actor`, `reason`, `timestamp`.

**Negative / cost**

- State machine adds engineering surface (transition validation, lock service, heartbeat).
- "Reverted" as a distinct state requires admins to learn one more concept. Mitigated by banner copy.
- Two-person rule on `activate` slows shipping. This is the trade — see §3.13 (Friction Where It Matters).

**Migration**

- Existing automations with `firstRunMode: true` map to `draft` if no Build content saved, else `ready_for_test`.
- Existing automations with `firstRunMode: false` map to `live`.
- One-time migration job; no admin action required.

---

## 5. Alternatives considered

| Alternative | Rejected because |
|---|---|
| Keep `firstRunMode` boolean + add `paused` flag | Doesn't resolve concurrency or re-entry; just adds a second hidden state. |
| Three states only (draft / live / paused) | Loses the `reverted` legibility and the `live_with_override` tracking. |
| Optimistic locking everywhere | First-run wizard step ordering breaks under concurrent edits; pessimistic is correct here. |
| Per-admin scratchpad drafts (each admin gets their own) | Defeats the "one canonical automation" model and creates merge complexity. |

---

## 6. Open questions (resolve in C-3 follow-up)

- Q1: Lock TTL — is 15 minutes right? Test in user research.
- Q2: Re-confirm step at 180-day drafts — what does that interaction look like?
- Q3: Restore-from-archive — does the restored automation come back as `paused` or `reverted`? Recommend `paused` (was live before, may still be wired) — confirm.
- Q4: Does a `paused` automation with attached goals count toward goal coverage? Recommend: no, surface as "paused, not contributing" on Goal Detail.

---

## 7. Acceptance for this ADR

This ADR is accepted when:

- [ ] State table reviewed by Eng + PM + Staff PD
- [ ] Transition matrix reviewed for completeness
- [ ] Migration plan signed off by Eng
- [ ] Lock-service design has an owner
- [ ] Open questions Q1–Q4 are tracked as follow-ups, not blockers
