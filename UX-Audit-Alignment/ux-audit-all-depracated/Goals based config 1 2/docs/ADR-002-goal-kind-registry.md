# ADR-002 — Goal as a Kind-Registered Primitive

**Status:** Proposed · Sprint 0
**Resolves:** C-4 (Goal primitive overclaimed across teams)
**Operating System principles addressed:** §3.14 Semantic Precision, §3.18 Latent Complexity Containment, §3.1 Outcome Compression
**Owner:** Staff PD + Eng + PM
**Date:** 2026-05-27

---

## 1. Context

The IA recommendation commits to "one Goal object, one edit surface, contextual variants" across AI, Sales, Human Reps, and Other teams. AI-deflection goals (`% reduction`, audience `AIC`, topics) and Sales-pipeline goals (`$ revenue`, account segment, region) share only the label. The Create Goals slide-out cannot author both with the same fields unless "contextual variants" silently implies divergent schemas, validation, rollup logic, and field-level permissions.

If we keep one rigid Goal schema, non-AI teams will build workarounds outside the slide-out and the platform spine collapses to a team-spine. If we let every team add fields ad hoc, the slide-out grows tabs and conditionals until it is a switch statement masquerading as one primitive.

**The Operating System is explicit:** §3.14 ("Labels must describe reality precisely") and §3.18 ("Powerful products are inherently complex. Do not remove power. Contain complexity until needed.") demand that the Goal abstraction either declares an extension contract or commits to a narrow scope.

---

## 2. Decision

**Goal is an abstract primitive parameterized by a `kind`.** Each kind is registered against a Kind Registry. The Create Goals slide-out, Goals Home tiles, goal pickers, and goal reports are all composed from the registry — none of them hardcodes a single schema.

### 2.1 The base Goal schema (shared by all kinds)

Every goal — regardless of kind — has these fields:

```ts
interface Goal {
  // Identity
  id: string;
  kind: GoalKindId;                    // see §2.2

  // Display
  name: string;                        // required, max 80 char
  description: string;                 // optional, max 500 char

  // Ownership
  owner_user_id: string | null;        // null = orphaned, see ADR follow-up
  owner_team_id: string;               // required — team always owns even if user departs

  // Audience tagging (multi-select)
  audience_tags: AudienceTag[];        // ["AIC", "AIR", "HUMAN_REPS", "SALES", "OTHER"]
  primary_audience: AudienceTag;       // exactly one, drives default pickers

  // State (from ADR-001-style lifecycle, adapted for goals)
  state: GoalState;                    // "draft" | "limited" | "testing" | "live" | "attention" | "retired"
  state_changed_at: timestamp;
  state_changed_by: string;            // user_id

  // Trajectory — every kind has a single primary metric to track
  trajectory_metric_id: string;        // FK to Metric Registry (see C-7 / future ADR)
  trajectory_window: "7d" | "30d" | "90d" | "quarterly" | "annual";

  // Topic scoping (when applicable — kind decides whether shown)
  topic_ids: string[];                 // FK to Topics (org-canonical taxonomy)

  // Lifecycle metadata
  created_at: timestamp;
  created_by: string;
  updated_at: timestamp;

  // Cross-references (computed)
  attached_automation_ids: string[];   // computed; never authored directly
  attached_monitor_ids: string[];
  attached_workflow_ids: string[];

  // Kind-specific payload
  kind_payload: Record<string, unknown>;  // shape determined by the kind contract
}
```

Anything not in `Goal` lives in `kind_payload`. The slide-out, picker, and rollup tile call into the kind's renderers to handle the kind-specific surface.

### 2.2 Goal Kind Registry

A kind contributes the following contract:

```ts
interface GoalKindContract {
  id: GoalKindId;                      // e.g. "ai_deflection"
  display_name: string;                // "AI deflection"
  audience_constraints: AudienceTag[]; // which audiences this kind is valid for
  required_permission: Permission;     // e.g. "goals.author.ai" or "goals.author.sales"
  default_window: TrajectoryWindow;
  icon: IconName;

  // Payload schema (JSON Schema or Zod-style)
  payload_schema: JSONSchema;

  // UI contracts — registered renderers
  slide_out_form: ReactComponent<{value: KindPayload, onChange: (p: KindPayload) => void}>;
  rollup_tile:    ReactComponent<{goal: Goal, scope: TimeWindow}>;
  picker_chip:    ReactComponent<{goal: Goal}>;
  report:         ReactComponent<{goal: Goal}>;

  // Trajectory contract — how does this kind compute progress?
  trajectory_provider: (goal: Goal, window: TrajectoryWindow) => Promise<TrajectoryPoint[]>;

  // Permission gates per action (optional overrides)
  can_create: (user: User) => boolean;
  can_edit:   (user: User, goal: Goal) => boolean;
  can_retire: (user: User, goal: Goal) => boolean;
}
```

### 2.3 Launch kinds (Sprint 1 ship list)

Only AI kinds ship at launch. Non-AI kinds are deferred and explicitly NOT in the slide-out picker until their contracts are written.

| Kind ID | Display name | Audience constraints | Payload fields |
|---|---|---|---|
| `ai_deflection` | AI deflection | AIC | `direction: "decrease"`, `target_value: number`, `unit: "%"`, topic-required |
| `ai_quality` | AI quality (CSAT) | AIC, AIR | `direction: "increase"`, `target_value: number`, `unit: "score" | "%"`, topic-required |
| `ai_latency` | AI response time | AIC, AIR | `direction: "decrease"`, `target_value: number`, `unit: "seconds"`, topic-required |
| `ai_save` | AI save rate | AIC, AIR | `direction: "increase"`, `target_value: number`, `unit: "%"`, topic-required |

### 2.4 Post-launch kinds (deferred — separate ADRs required before adding)

These names are reserved in the registry but **not implemented at launch**. Adding any of them requires:

1. A team-specific UX research pass (Sales doesn't author goals the way AI admins do).
2. A permission-model extension (Sales leadership must be granted the right role).
3. A separate ADR that fills in `GoalKindContract` for the kind.

Reserved IDs:

- `sales_pipeline` — revenue, account segment, region; no topic scoping
- `human_csat` — CSAT score per team, requires team segmentation
- `human_efficiency` — handle time, first-reply time, per team
- `generic` — fallback for "Other"; intentionally last-resort

**Reserving these IDs does not commit us to building them.** It commits us to *not breaking* them when they ship later.

### 2.5 The Create Goals slide-out becomes a composition

The slide-out renders:

1. **Always:** the shared header (Company Profile capture for first run; Start-from-template strip; name; description; owner / owner team; audience tags; primary audience).
2. **Kind picker (sub-section):** dropdown of allowed kinds for the user's role.
3. **`kind.slide_out_form`:** the kind-specific payload form (target shape, unit, direction, topic picker, etc.).
4. **Always:** state selector (default `draft`); review-by trigger (if applicable).

The slide-out has no `if (audience === "AIC")` branches in its render. Kind contracts own those branches.

### 2.6 Goals Home composition

Goals Home renders the goal list by:

1. Loading goals filtered by role-default audience.
2. For each goal, calling `kind.rollup_tile(goal, scope)` to render the row.
3. Filters (state, audience, kind) live on the page header; topic filter only shows if at least one goal-kind in scope uses topics.

The rollup grid is a renderer for the registered tile contract — not a hardcoded template.

### 2.7 Picker contract

Goal pickers opened from any of the six entry points pass `context`:

```ts
interface PickerContext {
  pre_filter: {
    audience?: AudienceTag[];     // e.g. opening from per-automation Settings: [AIC]
    kind?: GoalKindId[];          // e.g. opening from Refund Order Build: ["ai_deflection", "ai_quality"]
    state?: GoalState[];
    topic_ids?: string[];
  };
  on_select: (goal: Goal) => void;
  on_create?: (context: PickerContext) => void;  // open Create Goals slide-out with pre-fills
  allow_create: boolean;
}
```

Pre-fills are *applied as defaults, never as locks*. A user can always override a pre-filled field.

---

## 3. Consequences

**Positive**

- Goals can grow beyond AI without re-architecting the schema. §3.18 satisfied.
- The slide-out is composable, not a switch statement. §3.14 satisfied — "Goal" means one thing (an outcome-tracking primitive) and each kind names its own shape precisely.
- Permissions are kind-scoped. Sales leadership can author Sales goals without unlocking AI authoring.
- Audit becomes simpler: every goal has a `kind`, and per-kind reports can roll up consistently.

**Negative / cost**

- Engineering build cost is higher: a registry layer, per-kind renderers, contracts.
- PMs / designers must specify a kind contract for every new kind. This is the intended friction — adding a new kind should be a deliberate decision, not a slip.
- The kind registry is a new mental model for admins. Mitigated by display-name framing: admins see "AI deflection," "Sales pipeline," etc. — they do not need to know the registry exists.

**Migration**

- Launch ships with 4 AI kinds only. Existing goals migrate by stamping `kind = "ai_deflection"` (or `ai_quality`, `ai_latency` based on unit).
- No external API contract change at launch (single-kind world is indistinguishable).

---

## 4. Alternatives considered

| Alternative | Rejected because |
|---|---|
| Single rigid Goal schema with optional fields | Doesn't scale to non-AI teams; field bloat; "is this field for me?" confusion. §3.2 (Brutal Cognitive Load Reduction). |
| Free-form `custom_fields: Record<string, unknown>` per goal | No validation, no permission scoping, no per-team UI. §3.14 (Semantic Precision) violated. |
| Separate top-level objects per team (`AIGoal`, `SalesGoal`) | Defeats the "Goals are the platform spine" thesis; admins can't see a unified outcome rollup. |
| Goal subclassing (OO inheritance) | Same as kind-registry but more brittle; rejected for composition. |

---

## 5. Open questions

- Q1: Cross-kind aggregation in Goals Home — what does "all goals on track" mean when comparing a `% reduction` AI goal with a `$ revenue` Sales goal? Recommend: each kind contributes a normalized "on-track / at-risk / draft" classification; the cross-goal rollup counts classifications, never values.
- Q2: Can one goal have multiple kinds? Recommend: no. Use multiple goals with shared `program_id` (deferred to a later ADR on goal cohorts).
- Q3: When does a kind become deprecated? Need a `deprecated_at` field on `GoalKindContract` and a soft-warning state for goals using deprecated kinds.

---

## 6. Acceptance for this ADR

This ADR is accepted when:

- [ ] Schemas (Goal, GoalKindContract) reviewed by Eng + PM + Staff PD
- [ ] Launch kind list (4 AI kinds) signed off
- [ ] Reserved-but-deferred kind list signed off (we agree to *not break* them later)
- [ ] Slide-out composition pattern signed off by Staff PD
- [ ] Picker context contract signed off by Eng
- [ ] Open questions Q1–Q3 tracked as follow-ups
