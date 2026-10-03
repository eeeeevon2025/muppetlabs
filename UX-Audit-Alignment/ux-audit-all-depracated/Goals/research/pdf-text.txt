Goals-Based AI Monitoring
Concept: AI Monitor & Goals (Revised)
Aligned with AI Monitoring & Org-Level Metrics Tech Spec (April 2026)
Author 	Aditya Subramaniam
Status 	Draft (Revised)
Productboard 	AI Monitor, AI Computed Fields, Goals & Reporting
Linear 	TBD
Team
Product 	Aditya Subramaniam
Engineering 	Sylvia Lujo Kevin Lee Michael Meli
Design 	Yvonne Doll
Consulted / Reviewed
TBD — to be populated after initial review cycle.
Changelog
Initial draft created. April 17, 2026
Revised to align with AI Monitoring & Org-Level Metrics tech spec. April 27, 2026

-- 1 of 20 --

Business Goals
Improve admin confidence in AI automation performance by providing continuous,
AI-evaluated monitoring of every AI-handled conversation, with configurable goals that track
performance against measurable targets over time. This milestone introduces a closed-loop
monitoring system where Quality Monitors score live conversations, Suggestions
recommend improvements, Goals track business outcomes, and Anomaly Detection surfaces
runtime behavioral drift.
Key Results
• Increase admin adoption of AI-powered performance monitoring (tracked via Goals,
Quality Monitors, and Computed Field feature usage).
• Reduce mean time to detect AI performance degradation from days to hours.
• Achieve 80%+ admin satisfaction with AI performance visibility (measured via in-app
feedback).
• Establish baseline AI Computed Field coverage across 100% of AI-handled
conversations within 30 days of deployment.

-- 2 of 20 --

Concept Summary
What we’re building
Computed Fields — A new field type on the Conversation, Customer, and Company Klasses
whose value is produced by an LLM-based or deterministic tool. Each Computed Field has its
own scope, event trigger, computation (via a tool config), and output configuration. Three
default Computed Fields ship out of the box: AI-Generated CSAT (conversation-scoped, 1–5
scale), Customer Health Score (customer-scoped, composite of recent sentiment,
resolution paerns, and escalation rate), and Company Health Score (company-scoped,
aggregated at the company level). A 3-per-Klass limit is enforced. Fields are available across
the platform for routing, reporting, and automation. These fields are not seeded historically
upon enable.
Quality Monitors (under Analyze) — Post-deployment evaluations that score live, closed
conversations against explicit, configurable criteria. Each Quality Monitor defines multiple
weighted criteria (each with its own rating categories and pass/fail determination), a pass
threshold, segmentation conditions controlling which conversations are evaluated, a
context profile defining what data the LLM judge receives, and an optional suggestion
configuration. Two default monitors ship: an AIC AI-CSAT Monitor (if AIC is enabled) and an
AIR Copilot Usage Monitor (if AIR is enabled). One additional custom monitor is permied in
M1, with room to expand as business need arises. Quality Monitors cover both AI-handled and
human-assisted conversations via the Kind field ("aic", "air", or "all").
Suggestions — AI-proposed improvements generated in response to Quality Monitor failures
or Anomaly Detection events. Each Suggestion targets a specific resource (a procedure, KB
article, tool config, or agent), includes a proposed change with before/after content, and
carries a priority (high, medium, low). Suggestions bridge the gap between observing a
problem and taking action — not just showing that quality has degraded, but proposing what
to change next. Admins review and apply or dismiss suggestions manually.
Anomaly Detection — Extends the existing AIC 2.0 Validation Agent into a customer-visible
product surface. The Validation Agent already detects runtime deviations such as procedure
non-adherence, KB non-adherence, and tool misuse. This milestone turns those internal
signals into reportable anomaly events visible through a dedicated Anomaly Detection
Report, and feeds them into the Suggestion pipeline so detected drift can lead to concrete
improvement proposals.
Goals — Configurable performance targets tied to Computed Fields. Each goal defines a field
reference, a target value, a direction (higher is beer or lower is beer), and a unit (percent,
count, score, or currency). Admins can use three default goals (Increase CSAT, Improve
Customer Sentiment, Improve Net Retention) or create custom goals referencing any
Computed Field. Goals can optionally be scoped to a specific AI Agent via a Goal Resource

-- 3 of 20 --

reference. Goals are used strictly for monitoring and alerting in this milestone, not for
building or configuring AI agents.
Goal-Level Performance Reporting — A reporting surface that shows progress against each
configured goal. Goal progress is tracked via point-in-time snapshots
(GoalProgressSnapshot events) wrien each time a qualifying conversation is evaluated,
capturing the field value, whether the linked evaluation passed, and the conversation
context. Reporting surfaces these snapshots as trend data over time, broken down by
procedure and topic where applicable, with flagged conversations shown alongside per-field
scores.
Alerting — Configurable alert thresholds on Quality Monitors and Goals. Admins can opt into
alerts for specific monitors and configure delivery cadence (hourly or daily). Alerts are
delivered via email and in-app notifications. Alert delivery is coalesced to one notification per
monitor per delivery window to prevent notification spam.
What we’re not building
• Using goals to build, configure, or optimize AI agents. Goals are monitoring-only in this
milestone.
• Automated remediation. When a goal is missed or a monitor fails, we alert the admin
and may generate a Suggestion, but we do not automatically adjust procedures,
routing, or agent behavior.
• AI Computed Fields admin UI for standalone field management. Fields are created
implicitly when configuring monitors and goals. A dedicated field management UI is
deferred to a future milestone.
• Custom aggregation strategies for Customer and Company level fields. M1 uses a
default rolling average. Configurable aggregation (weighted average, percentile) is
deferred.
• Goal-linked custom reporting queries. Tracking higher-order business outcomes such
as subscription save rate, average order value, or revenue via saved reporting queries
is deferred to M3.
• Monitoring all conversations. Quality Monitors evaluate AI-handled and AIR-assisted
conversations. Extending to fully unassisted human conversations is planned for a
future milestone.
• Kobject-scoped Computed Fields. Kobject fact pipelines require Debezium
connectors and new dbt models and are deferred.

-- 4 of 20 --

Milestone Phasing
This concept aligns with the four-phase delivery model defined in the tech spec. The
concept doc focuses on the M1 customer experience but notes M0 dependencies and
M2/M3 extensions for context.
M0 — Internal Foundation (Target: May 8)
• AI-Generated CSAT, Customer Health Score, Company Health Score, and general
Computed Fields available internally.
• Quality Monitors, Suggestions, Anomaly Detection, and Computed Fields available
internally behind internal-only controls with reasonable per-org safety caps.
• Basic cost and usage instrumentation so internal dogfooding can inform the external
rollout plan.
M1 — Starter Experience + Customer Beta (Target: June 2)
• Every org that enables Kustomer AI sees a working quality monitoring experience
within one click, without authoring anything themselves.
• Three pre-built Computed Fields visible to customers: AI-Generated CSAT, Customer
Health Score, and Company Health Score, each with an out-of-the-box report on the
reporting page.
• Beta for Quality Monitors (2 OOTB + 1 custom allowed), Suggestions, Goals, and
Anomaly Detection Reports.
• Alerting available for opted-in monitors with hourly or daily cadence via email and
in-app notifications.
• A “Kustomer AI Monitoring” dashboard landing page that surfaces these defaults.
M2 — Customer Authoring + Billing Limits (Target: June 15)
• Customers can author their own Computed Fields and Quality Monitors, subject to
billing limits per tier/contract.
• Usage accounting and limit enforcement surface the relevant execution and cost
constraints.
M3 — Goal-Linked Custom Reporting Queries (Target: July 6)
• Customers can link a custom reporting query to their goal, allowing them to track
higher-level objectives such as subscription save rate, revenue, and average order
value.
• Goals authored against fieldRef in M1/M2 remain backward-compatible. The
integration surface is additive.

-- 5 of 20 --



-- 6 of 20 --

Problems & Solutions
Business Challenges
Admins deploying AI automations today lack continuous, AI-evaluated metrics. They can see
conversation counts and basic resolution rates, but cannot track customer satisfaction,
sentiment trends, or churn risk at the conversation and customer level.
Solution: Introduce Computed Fields and Quality Monitors to continuously evaluate every
AI-handled conversation. Computed Fields write AI-derived scores (CSAT, sentiment, churn
risk) onto Conversation, Customer, and Company Klasses as first-class aributes available
across routing, reporting, and automation. Quality Monitors score conversations against
multi-criterion rubrics with weighted pass/fail evaluation. Default monitors and Computed
Fields are provided out of the box so admins see value immediately upon deployment.
Admins cannot set measurable targets for AI performance or detect degradation before it
impacts customers.
Solution: Goals allow admins to define a target value and direction for any Computed Field.
Alerting notifies admins when a Quality Monitor detects degradation at a configured
cadence (hourly or daily). The reporting surface shows real-time progress against each goal,
making it easy to spot trends and take action before metrics deteriorate further.
When problems are detected, admins have no systematic path from observation to action.
Solution: Suggestions are auto-generated when Quality Monitors fail or Anomaly Detection
events fire, proposing concrete changes to procedures, KB articles, tool configs, or agent
seings. Each suggestion includes before/after content and a rationale, so admins can
review and apply fixes without starting from scratch.
Technical Challenges
Computed Fields must be evaluated on every AI-handled conversation without meaningfully
impacting conversation latency or throughput.
Solution: Evaluate asynchronously post-conversation so the customer experience is never
impacted. Implement queue-based processing with backpressure handling and debouncing
to prevent redundant evaluations from automations that repeatedly open/close
conversations.
Quality Monitor results generate high data volumes that must be retained for both
operational access and long-term analytics.
Solution: Dual-store architecture. MongoDB retains operational data with a 30-day TTL on
evaluation results (conversationevaluationresults collection) for recent drill-down access.
ClickHouse retains analytical data for 24+ months via staging, intermediate, and mart

-- 7 of 20 --

models. After 30 days, the UI falls back to ClickHouse summary data (evaluation outcome,
score, pass/fail) without per-criterion rationale detail.

-- 8 of 20 --

Jobs To Be Done
ID PERSO
NA
JOB 	SUCCESS INDICATOR
JOB
1
Admin When deploying an AI automation, I want to
define measurable performance goals, so
that I can track whether my AI is meeting
my standards over time.
Admin can configure goals tied to
Computed Fields with target values,
directions, and units, and can do so
using defaults or custom goals,
without needing to write queries or
build reports manually.
JOB
2
Admin When monitoring AI performance, I want AI
to automatically score every AI-handled
conversation on metrics like CSAT,
sentiment, and churn risk, so that I have
continuous, objective data without
needing to manually review conversations.
Quality Monitors evaluate every
qualifying conversation and write
scores to Computed Fields on the
Conversation and Customer Klasses
automatically without admin
intervention after initial
configuration.
JOB
3
Admin When a performance metric degrades, I
want to be alerted at a cadence I choose,
so that I can investigate and fix issues
before they impact more customers.
Admin receives alerts via email or
in-app at hourly or daily cadence
when an opted-in Quality Monitor
detects degradation, without
needing to manually check the
dashboard.
JOB
4
Admin When reviewing AI performance, I want to
see goal-level reporting broken down by
procedure, topic, and time period, so that I
can pinpoint exactly where my AI is
underperforming.
Admin can view reporting with
per-goal trend data, procedure and
topic breakdowns, and flagged
conversations from a single view
without switching between multiple
reports.
JOB
5
Admin When investigating flagged conversations,
I want to see the per-criterion Quality
Monitor scores alongside the reason it was
flagged, so that I can quickly understand
what went wrong.
Admin can see per-criterion scores,
weights, pass/fail status, and
rationale for each conversation with
a single click to view the full
conversation.
JOB
6
Admin When a Quality Monitor flags a failure, I
want an AI-generated Suggestion that
proposes a concrete fix, so that I can act
on problems instead of just observing
them.
Admin receives Suggestions
targeting a specific procedure, KB
article, or tool config with a proposed
change (before/after), rationale, and
priority, and can apply or dismiss
from the Suggestions view.
JOB
7
Admin When my AI agent deviates from expected
behavior at runtime, I want to see those
Anomaly Detection events from the
AIC 2.0 Validation Agent are visible in

-- 9 of 20 --

anomalies surfaced in a report and linked
to improvement suggestions, so that I can
catch drift before it becomes a paern.
a dedicated Anomaly Detection
Report and feed into the Suggestion
pipeline.
JOB
8
Admin When I need to track a custom metric
specific to my business, I want to add a
new goal tied to a Computed Field, so that I
can monitor what maers most to my
organization.
Admin can create custom goals by
specifying a Computed Field
reference, target, direction, and unit
from the Goals configuration screen
without needing engineering
support.
JOB
9
Admin When configuring Quality Monitors, I want
to define weighted criteria with rating
categories and a pass threshold, so that
the scoring matches my business context
and priorities.
Admin can add, weight, and mark
criteria as essential, configure rating
categories per criterion, and set a
pass threshold from the Quality
Monitor configuration screen.

-- 10 of 20 --

Initial Spec Ideas
Exploratory first thoughts to pressure-test feasibility and direction. Non-binding and subject to
change after review.
Computed Fields
Computed Fields are AI-generated or deterministic aributes wrien back onto Kustomer
resources (conversations, customers, companies). They are standalone product primitives
with their own scope, event trigger, computation pipeline, and output configuration.
Default Computed Fields
• AI-Generated CSAT — Conversation-scoped. LLM-inferred CSAT from a closed
conversation’s transcript, wrien to a conversation custom field on a 1.0–5.0 scale.
• Customer Health Score — Customer-scoped. LLM-graded composite of recent
conversation sentiment, resolution paerns, and escalation rate over the last 90
days. Rolling average on the Customer Klass.
• Company Health Score — Company-scoped. Same paern aggregated at the
company level.
Computed Field Configuration
• Name — Friendly label for the field.
• Description — What the field measures and why it maers.
• Scope — Which resource type the field lives on: Conversation, Customer, Company, or
Kobject (Kobject deferred).
• Trigger — The event that initiates computation (e.g.,
kustomer.conversation.update:done).
• Computation — References a tool config that defines how the field is calculated
(LLM-based or deterministic).
• Output — The custom field key the value is wrien to, the value type, and an optional
rationale field name for AI explanations.
Limits and Constraints
• 3 Computed Fields per Klass (each default counts toward the limit).
• Fields are not seeded historically upon enable.
• Evaluation is asynchronous post-conversation (fire-and-forget with observability).
• Debouncing: if multiple trigger events fire for the same resource within a short
window, only the last is processed.
• Optimistic locking with PATCH operations on sobjects, retrying on conflict.

-- 11 of 20 --



-- 12 of 20 --

Quality Monitors (Analyze > Quality Monitors)
Quality Monitors are post-deployment evaluations that score live, closed conversations
against explicit criteria. They are the core operator-facing surface for understanding
whether AI-handled and human-assisted conversations are behaving as intended.
Default Monitors
• AIC AI-CSAT Monitor (if AIC is enabled) — Evaluates AI-handled conversations for
resolution quality, accuracy, tone, and customer satisfaction signals.
• AIR Copilot Usage Monitor (if AIR is enabled) — Evaluates human-assisted
conversations for copilot adoption, suggestion acceptance, and quality impact.
Monitor Configuration
• Name / Description — Friendly label and explanation of what the monitor evaluates.
• Kind — Which conversations are evaluated: "aic" (AI-handled), "air"
(human-assisted), or "all".
• Segmentation — Conditions (structured) and/or natural-language conditions
controlling which conversations match.
• Context Profile — Controls what data the LLM judge receives: messages, automation
config, execution traces, copilot messages, relevant KB articles, customer data,
and/or kobject data.
• Analysis — The scoring rubric:
◦ Criteria — Each criterion has a name, type ("ai", "tool", or "condition"),
instructions or tool config reference, rating categories (each with a name,
description, pass/fail flag, and score percentage), a weight (relative
importance), and an essential flag (failing an essential criterion = entire
evaluation score becomes 0%).
◦ Pass Threshold — A 0.0–1.0 threshold that the overall weighted score must
meet for the conversation to pass.
• Output Field — Optional fields where the overall score and pass/fail result are wrien
as Computed Fields on the conversation.
• Suggestion Config — Whether suggestions are enabled for this monitor, and which
target types are eligible (procedure, KB article, tool config, agent).
• Goal IDs — Links this monitor to one or more Goals for progress tracking.
One Custom Monitor in M1
Beyond the two defaults, admins can create one additional custom monitor in M1. This allows
admins to define their own criteria, weights, and thresholds for a use case specific to their
business. The limit can be expanded as business need arises.

-- 13 of 20 --

Suggestions
Suggestions are AI-proposed improvements generated when a Quality Monitor fails or an
Anomaly Detection event fires. They are paired with monitors and anomalies rather than
positioned as a standalone product surface.
Suggestion Fields
• Type — What kind of change: procedure_edit, kb_update, tool_config, or agent.
• Status — pending, applied, or dismissed.
• Priority — high, medium, or low.
• Target — The specific resource the suggestion applies to (resource type, ID, and
name).
• Proposed Change — Change type (edit or create), with before and after content so
admins can see exactly what would change.
• Rationale — Explanation of why the change is recommended, linked to the Quality
Monitor failure or anomaly that triggered it.
Admins review suggestions and apply or dismiss them manually. Dismissed suggestions
require a dismiss reason. Repeated suggestions for the same target are deduped within a
bounded time window.
Anomaly Detection
Anomaly Detection extends the AIC 2.0 Validation Agent (already shipped in production) into
a customer-visible surface. The Validation Agent inspects an agent’s in-flight or
just-completed reasoning and flags deviations such as procedure non-adherence, KB
non-adherence, and tool misuse.
• Anomaly events are emied with an anomaly type, description, trigger source, and
aected resource.
• Anomaly Detection Report surfaces these events in a dedicated reporting view.
• Suggestion pipeline integration — Anomalies feed into the same Suggestion
pipeline as Quality Monitor failures, generating proposed fixes when actionable.

-- 14 of 20 --

Goals (Seings > Goals)
Goals are configurable performance targets that reference Computed Fields. Each goal
defines what metric to track, a target value, and the direction that indicates improvement.
Default Goals
• Increase CSAT — References AI-Generated CSAT Computed Field. Direction: higher is
beer. Target: configurable (suggested default 4.5).
• Improve Customer Sentiment — References Customer Health Score Computed
Field. Direction: higher is beer.
• Improve Net Retention — References a churn risk Computed Field. Direction: lower is
beer.
Goal Configuration Fields
• Goal Name — Short label (e.g., "Improve CSAT").
• Description — Natural language objective.
• Field Refs — One or more Computed Field paths tracked by this goal.
• Goal Resource (optional) — Scopes the goal to a specific resource type and ID (e.g., a
specific AI Agent/automation).
• Metric — The primary tracked field, consisting of:
◦ Field Ref — Must match one entry in Field Refs.
◦ Target — Numeric target value.
◦ Direction — "higher_is_beer" or "lower_is_beer".
◦ Unit — "percent", "count", "score", or "currency".
• Evaluation IDs — Links to Quality Monitors whose results contribute to goal progress
tracking.
Goal Progress Tracking
Goal progress is tracked via GoalProgressSnapshot events. Each snapshot captures the goal
ID, field reference, current field value, the conversation and evaluation that produced it, and
whether the evaluation passed. These snapshots are aggregated daily in ClickHouse
(avg/min/max values, pass/fail counts) and surfaced in the reporting view as trend data.
Open Questions
• Do we need a maximum number of goals per org, or is this unlimited?
• Should Goals support being scoped to multiple automations, or is one-to-one
suicient for M1?

-- 15 of 20 --

• How do we handle the case where an admin creates a goal referencing a Computed
Field that no monitor writes to? Should we warn them, or allow it and show "no data"?
Alerting
Alerting allows admins to opt into notifications when Quality Monitors detect degradation.
Alert Configuration
• Opt-in per monitor — Admins choose which monitors trigger alerts.
• Cadence — Hourly or daily.
• Delivery channels — Email and in-app notifications.
• Coalescing — One notification per monitor per delivery window. Delivery retries are
rate-limited to avoid notification spam.
Open Questions
• Should alerts support delivery to specific users or teams, or is org-admin-only
suicient for M1?
• Should goal-level alerts (not just monitor-level) be supported in M1, or deferred?
Reporting Surfaces
The following reporting surfaces ship in M1:
• AI-Generated CSAT Report — OOTB report on the reporting page for the AI-CSAT
Computed Field.
• Customer Health Score Report — OOTB report for the customer-scoped health
score.
• Company Health Score Report — OOTB report for the company-scoped health score.
• Anomaly Detection Report — Surfaces AIC 2.0 Validation Agent anomaly events.
• Kustomer AI Monitoring Dashboard — Landing page surfacing default monitors,
goals, recent alerts, and flagged conversations.
Goal-level trend data (from GoalProgressSnapshot events) is available through the
monitoring dashboard. Detailed procedure-level and topic-level breakdowns depend on the
data available in ClickHouse intermediate models (evaluation performance hourly, goal
progress daily).
Data Retention
Quality Monitor results are stored in MongoDB with a 30-day TTL on the conversation
evaluation results collection. For conversations older than 30 days, the UI falls back to

-- 16 of 20 --

ClickHouse summary data (evaluation outcome, score, pass/fail) without per-criterion
rationale detail. ClickHouse retains analytical data for 24+ months. Suggestions retain a
30-day TTL past resolution; pending suggestions never expire via TTL.

-- 17 of 20 --

Existing Screens (Preserved)
The following existing screens are preserved as-is within the AI for Customers navigation and
are not modified in this milestone:
• Build — Guidance, Knowledge Sources, and Procedures configuration.
• Test — Test categories and evaluation scores (pre-deployment Evaluations, distinct
from Quality Monitors).
• Deploy — Conditions, Smart Routing, and Review Evaluations.
• Seings > General — AI Automation Seings, Guardrails, Hando, Conversation
Start, Verification, Abandonment, Fallback, and Business Hours.
• Analyze > Observability — Traces and execution logs.
Out of Scope
• Goal-driven AI agent optimization: Using goals to automatically adjust AI agent
behavior, procedures, or routing. Goals are monitoring-only in M1.
• Automated remediation: When a goal is missed, we alert the admin and may
generate a Suggestion, but do not automatically fix the issue.
• AI Computed Fields admin UI: A dedicated screen for managing (creating, renaming,
deleting) Computed Fields is deferred. In M1, fields are created implicitly via monitor
and goal configuration.
• Custom aggregation strategies: Configurable aggregation for Customer and
Company level fields is deferred. M1 uses a default rolling average.
• Goal-linked custom reporting queries: Tracking higher-order business outcomes via
saved reporting queries is deferred to M3. Goals in M1/M2 use fieldRef; M3 will add a
queryId or similar reference additively.
• Kobject-scoped Computed Fields: Requires Debezium connector and new dbt
models. Deferred.
• Historical backfill: Computed Fields are not seeded historically upon enable.
• User-authored raw SQL: Authoring happens through structured config, not
free-form expressions.

-- 18 of 20 --

Risks & Mitigation
Evaluation latency and throughput: Running AI evaluations on every conversation could
introduce latency or create a processing boleneck at scale.
Mitigation: Evaluate asynchronously post-conversation. Implement debouncing so
repeated trigger events for the same resource within a short window only process the last
one. Start with the default monitors and measure throughput before expanding custom
monitor limits.
LLM cost runaway: One enterprise org enabling several Computed Fields and monitors
across high-volume traic could cost far more than expected.
Mitigation: Per-org daily execution caps. 3-per-Klass Computed Field limit. Monitor
limits (2 OOTB + 1 custom in M1). Cost alerting when org crosses thresholds. Billing-based
enforcement before broad M2 rollout.
Concurrent automation conflicts: Computed Fields introduce another automation system
running alongside Workflows, Business Rules, and Queues/Routing, increasing the risk of
concurrent writes to the same resource.
Mitigation: Optimistic locking with retry on conflict for Computed Field PATCH
operations. Batching multiple Computed Fields for the same Klass and trigger into a single
PATCH where possible.
AI Computed Field accuracy: AI-generated scores may not always align with ground truth,
especially for nuanced conversations.
Mitigation: Allow admins to customize evaluation criteria and prompts. Surface
flagged conversations with full per-criterion scores so admins can audit AI evaluations.
Consider adding a human feedback loop (thumbs up/down on AI scores) in a future
milestone.
30-day TTL impact on drill-down: After MongoDB TTL expiration, per-criterion rationale
detail is unavailable.
Mitigation: Fall back to ClickHouse summary data (outcome, score, pass/fail).
Document this limitation clearly. Evaluate whether mirroring rationale to a cheaper store is
warranted based on customer feedback.
Alert fatigue: Poorly tuned monitors or repeated failures could produce noisy notifications.
Mitigation: Opt-in alerts only. One notification per monitor per delivery window.
Delivery throles. Easy mute/disable controls.
Scope creep into agent optimization: Stakeholders may push to use goals for automated
agent tuning in M1.

-- 19 of 20 --

Mitigation: Clearly scope M1 as monitoring-only. Goals power dashboards, alerts, and
suggestions, not agent behavior. Document the vision for goal-driven optimization so
stakeholders know it’s planned, just not in this milestone.
Competitor Analysis
See the separate Competitive Research document for a full landscape analysis. Key areas
evaluated for this initiative include how competitors (Intercom, Zendesk, Sierra, Decagon,
Siena, Gorgias) surface AI performance metrics to admins, whether they oer configurable
goals or targets, how they handle AI-evaluated quality scoring, and what alerting
mechanisms exist for AI performance degradation. The core finding remains: no competitor
has shipped a true goals-first configuration experience where admins declare business
outcomes and the platform auto-steers monitoring, evals, and reporting. Quality Monitors,
Computed Fields, and Goals together position Kustomer to claim this whitespace.
•

-- 20 of 20 --

