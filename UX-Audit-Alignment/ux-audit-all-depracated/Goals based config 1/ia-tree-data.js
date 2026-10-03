// ============================================================
// Goals-First IA, node data
// Each node:
//   { id, label, iconClass, iconGlyph?, pills?, children?, detail }
// detail: { one_liner, purpose, contents (string|array), rationale,
//           sources (array of {kind, label, note?}), sketch (string) }
// ============================================================

window.IA_TREE = {
  id: "root",
  label: "Kustomer Platform",
  iconClass: "kusty",
  iconGlyph: "",
      iconImg: "hybrid/kusty-logomark.svg",
  detail: {
    one_liner: "The Kustomer site rail, redesigned around two user modes (daily agent + admin / configuration) with low-frequency items in an overflow menu.",
    purpose: "The top-level Kustomer Platform structure. Houses all primary destinations and the utility area.",
    contents: [
      "Site rail navigation for the whole platform",
      "Top-level routing to Goals, Performance, AI, Inbox, Searches, Reporting, TeamPulse",
      "Utility area (Global Search, Notifications, Avatar, overflow More menu)",
    ],
    rationale: "Two driving design goals. First, the Goals-First Kustomer vision: every part of the platform aligns to the goals an admin declares, which only works if Goals is a platform primitive in the site rail. Second, agent operationality: prioritize speed, clarity, and confidence for daily agents and agent admins; avoid the enterprise reflex that 'everything is equally important.'",
    goals_ref: "Goals are the primitive that organizes every destination in the rail. The site rail itself elevates Goals to first-class peerage with Inbox and Companies.",
    topics_ref: "Topics is a platform primitive, every closed conversation gets one broad topic and up to five descriptors. The same primitive surfaces in Reporting (analytics), Settings (taxonomy management), Search, Inbox, TeamPulse, Goals, Performance, and AI.",
    touchpoints: [
      "<b>Site rail</b>, primary nav to every destination",
      "<b>Utility area</b>, Global Search, Notifications, Avatar, More menu",
    ],
    sources: [
      { kind: "canon", label: "Vision", note: "Goals-First Kustomer (May 2026, Aditya). Beacon M1 (Summer 2026) ships Goals as first-class platform object, Quality Monitors, AI Computed Fields, Suggestions, Anomaly Detection, Goal-Level Performance Reporting." },
      { kind: "new", label: "New", note: "Daily-workflow vs admin-workflow split + overflow menu" }
    ],
    sketch:
`Kustomer Platform (site rail, far left, 56px)
── primary ──
├── 🎯 Goals               [New]            ← platform spine, faceted by audience
├── 📈 Performance         [Lifted]         ← cross-agent observability (AI + human)
├── ✨ AI                                     ← collapsed: setup + library + test/analyze
├── 🏠 Rep Dashboard       [Renamed]
├── 📥 Inbox
├── 🔍 Searches
├── 📊 Reporting                            ← presentation-ready analytics
├── 〰 TeamPulse                            ← real-time presence
── utility (bottom) ──
├── 🔎 Global Search
├── 🔔 Notifications
├── ⋯ More                [New, popover]
└── 👤 Avatar`
  },
  children: [

    // ============ GOALS (platform-level) ============
    {
      id: "goals",
      label: "Goals",
      iconClass: "goals",
      iconName: "target",
      pills: [{ text: "New", kind: "new" }],
      detail: {
    suggestions_ref: "AI Suggestions surface as ranked recommendations to fix what monitors and anomalies surface against each goal. Cross-goal queue lives at Performance, Suggestions.",
    goal_cards: [
      { label: "Goal 1", subtitle: "Reduce refund tickets 20%", state: "Live", audience: "AIC", progress: 71, points: [12, 18, 22, 28, 33, 41, 48, 55, 62, 71] },
      { label: "Goal 2", subtitle: "Speed up rep responses", state: "Testing", audience: "AIR", progress: 42, points: [8, 11, 14, 19, 22, 25, 31, 35, 38, 42] },
      { label: "Goal 3", subtitle: "Save at-risk renewals 80%", state: "Attention", audience: "AIC+AIR", progress: 31, points: [42, 38, 35, 33, 30, 28, 27, 29, 30, 31] }
    ],
        one_liner: "Cross-goal outcome rollup at the top, then the list. \"Are we hitting what we said we'd hit?\" Sparkline grid of every goal, at-risk lane, contribution-by-audience aggregate. Leadership view.",
        purpose: "The org's declared outcomes plus the leadership-level read on whether they're being hit. The header is a cross-goal outcome summary; the body is the audience-faceted goal list. Distinct from platform Performance, which is the cross-agent operational rollup.",
        contents: [
          "<b>Outcome summary header</b> at the top of Goals Home: cross-goal sparkline grid, at-risk lane, contribution-by-audience aggregate (AIC / AIR / Human / Sales / Other), % on track / at risk / draft",
          "Links from any summary tile into platform Performance scoped to the contributing AI / human signals",
          "Goal list view with state, audience, owner, and progress",
          "Audience facet filtering and role-default scope",
          "State filters (Live, Limited, Testing, Attention, Draft)",
          "Time-window selection for trajectory readings",
          "Goal templates entry point",
          "Goal reports, per-goal trajectory, contribution breakdown by audience (AIC / AIR / Human / Sales / Other), period-over-period delta, topic-level slice, export, and schedule",
          "Cross-team goal authoring and management",
          "Audience faceting (AIC, AIR, Sales, Human Reps, Other)",
          "Goal templates and starter library",
          "Per-goal detail pages with outcome trajectory",
          "Goal pre-filtering by viewer role",
          "Pre-filtering contract for goal pickers opened from any destination",
        ],
        ctas: [
          { primary: true, label: "+ Create goal", note: "opens Create Goals slide-out" },
          { label: "Browse templates", note: "6 OOTB goal templates" },
          { facet: true, label: "Filter by audience", note: "AIC · AIR · Human Reps · Sales · Other" },
          { facet: true, label: "Filter by state", note: "Live · Limited · Testing · Attention · Draft" },
          { label: "Open goal detail", note: "click any row to drill in" },
          { label: "Time-window", note: "7d / 30d / 90d trajectory readings" },
          { label: "Open report", note: "per-goal contribution breakdown" },
          { label: "See cross-goal Performance", note: "→ Performance scoped to contributing signals" },
        ],
        rationale: "Lifted out of the AI workspace and reframed as a platform primitive. The faceting model is the unlock that lets every team's goals coexist in one list without forcing AI admins to wade through sales-pipeline targets, or sales leaders through deflection percentages. Authoring stays a single canonical primitive (one slide-out); browsing adapts to context via persistent audience filters.",
        goals_ref: "This is where Goals are declared and tuned. Every other destination reads from this primitive, pre-filtered by audience when context is implied. The slide-out form is the single canonical authoring surface for a goal regardless of where it opens from.",
        topics_ref: "Goals select a topic subset to declare scope. Topic chips on each goal define what conversations it covers; coverage rollups read from the canonical Topics taxonomy.",
        touchpoints: [
          "<b>AI Setup</b>, provides scope (audience, topics, scenarios) for every new automation",
          "<b>AI for Customers / AI for Reps</b>, every attached automation drives one or more goals",
          "<b>Performance</b>, outcome trajectories roll up across all goals",
          "<b>Reporting → Data Explorer</b>, goals are a first-class dimension in ad-hoc queries",
                  "<b>Performance, Suggestions</b>, suggestions targeting goals surface here",
        ],
        sources: [
          { kind: "canon", label: "Beacon M1", note: "Summer 2026, Goals as first-class platform object: API-addressable, stable schemas (field refs, thresholds, directions, owners), B2C goals (CSAT, deflection, AHT) + B2B goals (account health, renewal risk, NRR)" },
          { kind: "p2", label: "Prototype", note: "Slide-out form, templates, and Goals Home all carry forward intact" },
          { kind: "new", label: "New", note: "Elevation to site rail is the structural change" }
        ],
        sketch:
`Goals (site rail)
─────────────────────────────────────────
Your goals                       + New goal · Browse templates
─────────────────────────────────────────
Audience: [All]  [AIC]  [AIR]  [Human Reps]  [Sales]  [Other]  [Mine]
State:    [All 12]  [Needs attention 3]  [Running 7]  [Not yet live 2]

● LIVE      Reduce refund tickets 20%      AIC          ━━━━━━━━━ 71%
○ TESTING   Improve CSAT to 4.6            AIR          ━━━━     42%
! ATTENTION Save at-risk renewals 80%      AIC+AIR      ━━━      31%
○ LIMITED   Auto-resolve order tracking    AIC          ━━━━━━   62%
● LIVE      Cut FRT to 90s                 Human Reps   ━━━━━━━  74%
○ TESTING   NRR to 112%                    Sales        ━━━      35%`
      },
      children: [
        {
          id: "goal-slideout",
          label: "Create Goals (slide-out panel)",
          iconClass: "leaf",
          iconGlyph: "·",
          pills: [{ text: "New", kind: "new" }],
          detail: {
            one_liner: "The canonical authoring surface for a new goal. Captures business context inline on first run (industry, channels, brands), then audience, target, topics, scenarios, and AI-learned-from rep training docs.",
            purpose: "The single authoring surface for goals. On first run, captures the org's Company profile inline (industry, channels, brands, description) and writes through to Settings → Company profile. On subsequent goals, the Company profile is shown as a collapsed one-line context strip with an “Edit in Settings” link. Goal-specific fields, audience, target, topic scope, owner, alert channel, and the rep training docs the AI learns from, are captured every time.",
            contents: [
              "<b>Inline Company profile capture (first time only)</b>: industry, channels, brands, description. Writes through to More → Settings → Company profile. Subsequent goals: collapsed one-line context strip with ‘Edit in Settings’ link.",
              "Goal authoring form (single canonical surface)",
              "Audience tagging with smart defaults from context",
              "Topic selection from the org's canonical taxonomy",
              "Scenario upload (rep training docs, SOPs, recordings) for parser-driven Building Blocks suggestions",
              "Target value, direction, and window",
              "Owner assignment and alert channel opt-in",
              "Jump-links to attached monitors, suggestions, and anomalies",
            ],
            ctas: [
              { primary: true, label: "Save goal", note: "commits goal + writes Company profile through to Settings (first run)" },
              { label: "Capture Company profile", note: "first time only: industry, channels, brands, description" },
              { label: "Pick audience", note: "AIC / AIR / Human Reps / Sales / Other" },
              { label: "Select topics", note: "multi-select from canonical taxonomy" },
              { label: "Upload scenarios", note: "SOPs / call recordings / decision trees → parser drafts Building Blocks" },
              { label: "Set target", note: "value, direction, time window" },
              { label: "Assign owner & alerts", note: "owner + email/Slack opt-in" },
              { label: "Edit in Company profile", note: "on subsequent goals, link out to canonical home" },
              { destructive: true, label: "Archive goal", note: "freezes the goal, keeps history" },
              { label: "Cancel", note: "discard" },
            ],
            rationale: "The slide-out replaces any heavyweight per-goal workspace AND is the inline-capture moment for Company profile. Pattern: capture inline where the data is first needed, write through to its canonical org-level home, stamp provenance on every consuming surface. Users never hit a setup dead-end and learn the canonical destinations through edit-link provenance, not navigation.",
            goals_ref: "The per-goal config form. All edits to a goal happen here; the rest of the platform reads the result.",
            topics_ref: "\"Topics this goal covers\" is a required field, multi-select from the org's canonical Topics taxonomy. Goal templates pre-pick matching topics; uploaded scenarios pre-check the topics they reference.",
            touchpoints: [
              "<b>More → Settings → Company profile</b>, inline-captured industry/channels/brands/description writes through here on first goal",
              "<b>Reporting → Topics</b>, Topics this goal covers reads from the canonical taxonomy",
              "<b>Building Blocks</b>, uploaded scenarios parse into procedures, tools, knowledge",
              "<b>AI Setup</b>, saving a new goal can deep-link directly into the wizard scoped to this goal",
            ],
            sources: [{ kind: "p2", label: "Prototype", note: "GoalSlideout carried forward" }],
            sketch: `Create Goals (slide-out, first run)
─────────────────────────────────────────
First, tell us about your company  (inline capture, first time only)
Stored in Settings → Company profile, edit anywhere
[Industry ▾]  [Channels: + Add]
[Brand 1 + ]  [Description ──────]

Now, what's the goal?
Name           Reduce refund tickets by 20%
Description    Cut refund-ticket volume from baseline...
Audience       [AIC ✓]  AIR  Human Reps  Sales  Other
Owner          Amisha Sharma

TOPICS THIS GOAL COVERS  (from Reporting → Topics)
[Returns & refunds ✓]  [Refund Order ✓]  [Cancel subscription ✓]
[Order tracking]  [Product questions]  [Account & login]  [Shipping delays]

SCENARIOS  (rep training doc, SOPs, recordings)
↑ Drop file or browse, parser writes procedures + tools + knowledge

TARGET
Value -20%   Direction decrease   Window 90 days
Alert channels: email, Slack

[ Archive ]                       [ Cancel ]    [ Save ]
─────────────────────────────────────────
On subsequent goals, the Company profile section collapses to:
✓ Acme Inc · Retail & E-commerce · 2 brands  [Edit in Settings]`
          }
        },
        {
          id: "goal-detail",
          label: "Goal detail",
          iconClass: "leaf",
          iconGlyph: "·",
          pills: [{ text: "New", kind: "new" }],
          detail: {
            suggestions_ref: "AI suggestions targeting this goal surface here as actionable cards. Apply writes through to the contributing automation's Building Blocks attachments or rep coaching path.",
            one_liner: "That one goal's trajectory. Inline performance section, attached resources, and the canonical drill-in target for every reference across the platform.",
            purpose: "The per-goal home. Shows the goal's trajectory plus every attached resource, including one or more AI automations, human workflows, and performance monitors.",
            goals_ref: "The canonical landing page for any single goal. Every other surface (Inbox conversations, Analyze rows, Reporting cells) links into this page when context narrows to one goal.",
            topics_ref: "Topic chips strip at the top names the goal's scope. Coverage stats, topics-covered / % volume / % AI-deflectable, roll up per topic.",
            touchpoints: [
              "<b>AI for Customers / AI for Reps</b>, attached AI automations drive the goal",
              "<b>Building Blocks</b>, attached procedures, knowledge sources, tools, guardrails surface here",
              "<b>Performance → Monitors</b>, attached scorecards roll into the outcome trajectory",
              "<b>AI → Analyze</b>, Your Automation tabs (Build / Test / Analyze) deep-link scoped to this goal",
              "<b>More → Settings → Computed Fields</b>, threshold fields read from here",
              "<b>Inbox</b>, contributing conversations link out",
              "<b>Notifications</b>, alert opt-in cadence per channel",
                          "<b>Performance, Suggestions</b>, AI-recommended fixes scoped to this goal surface here",
            ],
            contents: [
              "Per-goal home page with topic coverage, outcome trajectory, and attached resources",
              "Topic chips with coverage and AI-deflectable rollup",
              "Outcome performance section (trajectory, threshold, at-risk state)",
              "Attached AI automation, Building Blocks, human workflows, and performance monitors",
              "Your Automation tab with Build / Test / Analyze deep-links scoped to this goal",
              "Activity feed of recent changes",
              "Empty-state guidance for attaching AI, monitor, or human workflow",
            ],
            ctas: [
              { primary: true, label: "+ Attach AI automation", note: "opens AI Setup wizard scoped to this goal" },
              { label: "+ Attach performance monitor", note: "Quality Monitor scorecard" },
              { label: "+ Attach human workflow", note: "for edge cases routed off the AI" },
              { label: "Open Build / Test / Analyze", note: "deep-link into attached automation's tabs" },
              { label: "Edit goal", note: "opens Create Goals slide-out pre-filled" },
              { label: "View contributing conversations", note: "goal-attributed Inbox slice" },
              { label: "Open attached blocks", note: "→ Building Blocks scoped to this goal" },
              { facet: true, label: "Time-window", note: "trajectory range" },
            ],
            rationale: "Outcome performance lives on the goal, not in a separate destination. The detail page is where 'how is this goal doing?' has a single, obvious answer; everything else (AI Analyze, Reporting cells, conversation pills) links back here. Splitting outcome from operational performance is the unlock, and the detail page is the surface that operationalizes the split.",
            sources: [
              { kind: "new", label: "New", note: "Per-goal home page; consolidates trajectory + attached resources + drill-in into one canonical surface" }
            ],
            sketch:
`Goal detail, Reduce refund tickets 20%
─────────────────────────────────────────
AIC · owner Amisha · target -20% over 90d · LIVE
─────────────────────────────────────────
TOPICS & COVERAGE
[Returns & refunds]  [Refund Order]  [Cancel subscription]
3 of 5 topics · 54% of last 90d volume · 75% AI-deflectable

PERFORMANCE (outcome)
Trajectory: on track       Δ vs 30d ago: -14%      ━━━━━━ 71%

ATTACHED
🤖 AI automation         Refund Order v3     Active
📚 Building Blocks       3 procedures · 2 KB · 4 tools
👤 Human workflow        Damaged items escalation
📈 Performance monitor   Quality drop alert

YOUR AUTOMATION
[ Build ]  [ Test ]  [ Analyze ]

ACTIVITY
2h ago    Suggestion applied: tighten refund eligibility
1d ago    Drift alert: Damaged items, last 24h
3d ago    +1 procedure attached: Process Return or Refund`
          }
        }
      ]
    },

    // ============ PERFORMANCE (cross-goal rollup) ============
    {
      id: "monitors",
      label: "Performance",
      iconClass: "perf",
      iconName: "activity",
      pills: [{ text: "New", kind: "new" }],
      detail: {
        suggestions_ref: "Suggestions is a sibling rollup that lists every AI-recommended fix across the workspace. Drill-in routes to the contributing automation's surface.",
        one_liner: "Cross-agent operational rollup. \"How are our agents performing?\" Monitors + Suggestions across AI and human (Anomalies are AI-only), filterable by AI / Human / My monitors. Ops view.",
        purpose: "The platform's cross-agent operational hub. Reads up from per-automation AIC Analyze and from human team monitors; aggregates by audience, by goal, by topic. Distinct from Goals Home, which is the outcome rollup; Performance is the agent-quality rollup. Every Performance row carries a scoping pill that deep-links to the per-automation source (AIC Analyze → Scorecards / Drift alerts / Suggestion queue). Performance owns the cross-AI aggregate view; the per-automation surfaces own authoring (apply, dismiss, acknowledge). A Performance row links back to the goal it serves; a Goals Home tile links into Performance scoped to its contributing signals.",
        contents: [
          "Monitor-owner facets at the top: <b>AI monitors</b> (Validation Agent + AI quality scorecards), <b>Human monitors</b> (rep quality + queue + SLA), <b>My monitors</b> (filtered to monitors I own or follow). Default to the viewer's role.",
          "Cross-goal trajectory rollup (the executive / ops-leader view)",
          "Audience facet filtering",
          "At-risk goal surfacing",
          "Cross-goal aggregates (% on track, % at risk, % drafted)",
          "Drill-down into goal detail",
          "Aggregated Monitors and Suggestions across all AIs and human teams (Anomalies live in AI → Analyze)",
        ],
        ctas: [
          { facet: true, label: "Monitor owner: AI", note: "AI monitors only" },
          { facet: true, label: "Monitor owner: Human", note: "rep scorecards + SLA" },
          { facet: true, label: "Monitor owner: Mine", note: "only monitors I own" },
          { facet: true, label: "Audience filter", note: "AIC / AIR / Human / Sales / Other" },
          { facet: true, label: "Time range", note: "7d / 30d / 90d" },
          { label: "Drill into goal", note: "row links back to the goal it serves" },
          { label: "Drill into source surface", note: "per-automation scoping pill → AIC Analyze" },
          { label: "Export rollup", note: "CSV or scheduled delivery" },
        ],
        rationale: "Splitting outcome from operational performance forces this destination to do one thing well: roll up goal trajectories across the whole org. Operational AI signals (Monitors, Suggestions, Anomalies) belonged here in the previous draft, but they grade up *into* goals, they aren't a parallel view of them. Moving them into AI → Analyze and keeping Performance as the rollup aligns the destination with the question its audience actually asks: 'how are we doing against what we said we'd do?'",
        goals_ref: "Performance is the cross-goal trajectory view. Every tile is a goal; every metric is a goal-progress reading. Operational AI signals are linked, not embedded.",
        topics_ref: "Performance can be sliced by topic. The cross-goal rollup shows topic-attached vs unowned conversation share, and the at-risk lane links into per-topic drill-down.",
        touchpoints: [
          "<b>Goal detail</b>, per-goal Performance section rolls up here",
          "<b>AI → Analyze</b>, AI-specific operational deep-dive for any single AI version",
          "<b>Notifications</b>, at-risk goals trigger alerts here",
          "<b>Reporting</b>, exports and scheduled deliveries originate here",
                  "<b>Suggestions</b> rollup queue across the workspace",
        ],
        sources: [
          { kind: "canon", label: "Beacon M1", note: "Goal-Level Performance Reporting ships in Beacon M1 (target: Summer 2026)" },
          { kind: "new", label: "New", note: "Reframed as outcome rollup; operational AI signals migrate to AI → Analyze" }
        ],
        sketch:
`Performance (site rail), cross-agent observability
─────────────────────────────────────────
Audience: [All]  [AIC]  [AIR]  [Human Reps]  [Sales]  [Other]
Range:    [Last 30d ▾]                  On track 7 · At risk 3 · Draft 2
─────────────────────────────────────────
ON TRACK
Speed up rep responses        AIR          ━━━━━━━━━ 92%
Status & order tracking       AIC+AIR      ━━━━━━━━  85%
Cut FRT to 90s                Human Reps   ━━━━━━━   74%

AT RISK
Reduce refund tickets 20%     AIC          ━━━━━━    71%   ⚠ drift, 24h
Save at-risk renewals 80%     AIC+AIR      ━━━       31%   ⚠ trending down
NRR to 112%                   Sales        ━━━       35%   ⚠ off-pace

LAYERS
Monitors · Suggestions  (cross-agent, AI + human)
Anomalies  → AI → Analyze (AI-only, fed by the Validation Agent)`
      },
      children: [

        { id: "mon-quality", label: "Monitors", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Rollup", kind: "moved" }],
          detail: {
            one_liner: "Cross-agent quality and efficiency scorecards. Filter by monitor-owner (AI, Human Reps, Sales) and by goal at the top of the page. Every row carries a scoping pill that deep-links to the per-automation source.",
            purpose: "Cross-AI and cross-team quality scoring. Grades every conversation, AI or human, against the goals it touches.",
            contents: [
              "Cross-AI Quality Monitors rollup",
              "Beacon M1 OOTB scorecards (AI-Generated CSAT, Customer Health Score, Company Health Score)",
              "Goal-attached scoring and pass-rate tracking",
              "Cross-version comparison",
              "Goal / audience / AI version filtering",
            ],
            ctas: [
              { label: "Open scorecard detail", note: "per-criterion breakdown" },
              { label: "Drill into source", note: "→ AIC Analyze → Scorecards for the affected automation" },
              { primary: true, label: "Set alert opt-in", note: "channel + cadence" },
              { facet: true, label: "Filter by goal" },
              { facet: true, label: "Filter by audience" },
              { facet: true, label: "Filter by AI version" },
              { label: "Compare versions", note: "cross-version scoring" },
            ],
            rationale: "Rollup means platform-wide aggregate view; the per-automation source surface owns authoring and lives somewhere inside AI for Customers. Beacon M1 ships Quality Monitors as one of five goals-aware primitives. Surfaces here at platform level because monitor results are read by ops, QA, and reps. AI → Analyze owns the per-version focused view.",
            goals_ref: "Each scorecard is bound to one or more goals. Failing scorecards surface against the goals they impact and link back to the goal detail page.",
            topics_ref: "Every scorecard carries topic tags. Filter by topic to see where AI or human resolution quality is slipping in a specific conversation category.",
            touchpoints: [
              "<b>More → Settings → Computed Fields</b>, scorecards read field values (AI-Generated CSAT, Customer Health, Company Health)",
              "<b>AI → Analyze</b>, same scorecards, scoped to a single AI version",
              "<b>Building Blocks → Procedures</b>, failing scorecards link into the contributing procedure",
              "<b>Notifications</b>, threshold breaches fire here",
            ],
            sources: [{ kind: "canon", label: "Beacon M1", note: "Summer 2026, Quality Monitors" }],
            sketch: `Monitors (Performance → Monitors)
─────────────────────────────────────────
Filter:  [All goals ▾]  [All audiences ▾]  [All AI versions ▾]
─────────────────────────────────────────
AI-Generated CSAT          all conv · rolling    ━━━━━━━━━ 4.4 / 5
Customer Health Score      per customer · daily  ━━━━━━━   82%
Company Health Score       per company · daily   ━━━━━━━━  88%

Failing scorecards
Refund eligibility check   AIC v3                ━━━       62%   ⚠
Rep handle time            Human Reps team A     ━━━━      71%   ⚠`
          }
        },
        { id: "mon-suggestions", label: "Suggestions", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Rollup", kind: "moved" }],
          detail: {
            suggestions_ref: "Canonical platform-level home for Suggestions. Per-automation Suggestions queues feed up here.",
            one_liner: "Cross-agent corrective queue. Ranked recommendations to fix what Monitors and Analyze's anomaly stream surfaced. Each card shows confidence, goal, and a before / after diff inline; an Edit Procedure / Edit Article / Edit Tool / Edit Guardrail button opens a slide-out with the affected block pre-loaded and AI-suggested changes marked, so admins apply or tweak without leaving the page.",
            purpose: "The corrective queue. Ranked recommendations to fix what Monitors and Anomalies surface, across AI tuning and human coaching. Action happens inline: every suggestion's primary CTA opens a slide-out edit view of the affected block (procedure, KB article, tool, shared guardrail) with the AI's proposed changes pre-staged. Save and apply commits without page navigation.",
            contents: [
              "Cross-AI suggestion queue ranked by goal impact",
              "Apply / dismiss workflow with affected-conversation drill-in",
              "Pass-through to AI configuration via Building Blocks",
              "Version deploy history integration",
              "Goal / audience / AI version filtering",
            ],
            ctas: [
              { primary: true, label: "Apply in Procedure", note: "opens inline slide-out with AI changes pre-staged" },
              { primary: true, label: "Apply in KB Article", note: "opens inline slide-out" },
              { primary: true, label: "Apply in Tool", note: "opens inline slide-out" },
              { primary: true, label: "Apply in Guardrail", note: "opens inline slide-out" },
              { label: "Edit & apply", note: "tweak before commit" },
              { destructive: true, label: "Dismiss with reason", note: "feeds back into the model" },
              { facet: true, label: "Filter by goal" },
              { facet: true, label: "Filter by audience" },
              { label: "See affected conversations", note: "drill into supporting evidence" },
            ],
            rationale: "Rollup means platform-wide aggregate view; the per-automation source surface owns authoring and lives somewhere inside AI for Customers. Beacon M1's closing-the-loop primitive. Without Suggestions, Quality Monitors only diagnose; with Suggestions, they prescribe. AI → Analyze shows the same queue scoped to a single AI version.",
            goals_ref: "Suggestions are ranked by goal impact; each card names which goals it would move.",
            topics_ref: "Each suggestion names the affected topic and proposes a topic-specific fix (procedure tweak, knowledge update, rep coaching).",
            touchpoints: [
              "<b>Building Blocks → Procedures</b>, applying a suggestion writes to the procedure body",
              "<b>Building Blocks → Knowledge Sources</b>, apply updates the KB article",
              "<b>Building Blocks → Tools</b>, apply updates tool configuration",
              "<b>Building Blocks → Guardrails</b>, apply tightens or relaxes a guardrail rule",
              "<b>AI → Analyze</b>, same queue, scoped to a single AI version",
              "<b>AI for Reps</b>, coaching-path suggestions feed back into AIR config",
              "<b>Reporting → Topics</b>, each suggestion carries its topic tag",
            ],
            sources: [{ kind: "canon", label: "Beacon M1", note: "Summer 2026, Suggestions" }],
            sketch: `Suggestions (Performance → Suggestions)
─────────────────────────────────────────
Filter:  [All goals ▾]  [All audiences ▾]  [12 pending]
─────────────────────────────────────────
1.  Tighten refund eligibility step           Goal: refund 20%   AIC v3
    Reason: Tone & empathy criterion failed in 16% of escalations
                                                   [ Apply ]  [ Dismiss ]

2.  Add Damaged-item branch                   Goal: refund 20%   AIC v3
    Reason: 23% pass rate on Damaged or Defective Items category
                                                   [ Apply ]  [ Dismiss ]

3.  Coach team A on handle time               Goal: FRT 90s     Human Reps
    Reason: AHT trending up 14% over 7 days
                                                   [ Open ]   [ Dismiss ]`
          }
        },
        { id: "mon-anomalies", label: "Anomalies", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Rollup", kind: "moved" }],
          detail: {
            one_liner: "AI-only. Cross-AI runtime drift rollup. Aggregates Validation Agent anomaly events across every AI version in the workspace.",
            purpose: "Platform-level view of AI drift signals. Marked AI-only in the rollup chrome since the Validation Agent only detects AI behavior, not human-rep degradation (human degradation surfaces via Performance → Monitors and Suggestions). Same primitive AIC Analyze surfaces per-automation; here it's the cross-automation, cross-version stream filtered by goal, audience, severity. Every row carries a scoping pill linking to the per-automation source.",
            goals_ref: "Each anomaly is tagged with the goal it threatens; filter by goal to see drift impacting one outcome.",
            topics_ref: "Each anomaly carries topic tags from the affected conversations.",
            touchpoints: [
              "<b>AI for Customers → [automation] → Analyze → Drift alerts</b>, the per-automation source view",
              "<b>Performance → Suggestions</b>, anomalies feed the suggestion queue with proposed fixes",
              "<b>Notifications</b>, severe anomalies fire here"
            ],
            contents: [
              "AI-only badge + one-line explainer on the page header",
              "Time-ordered anomaly stream across every AI version",
              "Per-row scoping pill linking to AI for Customers → [automation] → Analyze → Drift alerts (source)",
              "Severity tinting (high / medium / low)",
              "Pattern + root-cause hypothesis per row",
              "Linked-criteria cluster correlation",
              "Filter by goal, by audience, by AI version, by severity",
              "Acknowledge / snooze / drill into AIC Analyze for the affected version"
            ],
            ctas: [
              { primary: true, label: "Acknowledge", note: "mark as seen, no action yet" },
              { label: "Snooze", note: "24h / 7d / 30d" },
              { label: "Drill into AIC Analyze", note: "per-automation drift alerts" },
              { facet: true, label: "Severity", note: "High / Medium / Low" },
              { facet: true, label: "Goal" },
              { facet: true, label: "Audience" },
              { facet: true, label: "AI version" },
            ],
            rationale: "Rollup means platform-wide aggregate view; the per-automation source surface owns authoring and lives somewhere inside AI for Customers. Anomalies remain AI-only (fed by the AIC 2.0 Validation Agent), but the rollup view across all automations belongs at platform Performance so ops sees drift across the whole AI surface in one place.",
            sketch: ""
          }
        },
      ]
    },

    // ============ AI WORKSPACE (collapsed) ============
    {
      id: "ai",
      label: "AI",
      iconClass: "launch",
      iconName: "sparkles",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "The AI workspace, collapsed to the configuration work that genuinely belongs here.",
        purpose: "The AI configuration workspace. Houses setup, the shared Building Blocks library, Test, Analyze, AIC and AIR config, Connections, and the legacy surface.",
        contents: [
          "Single AI workspace for AIC and AIR setup",
          "Wizard-driven AI Setup that reads from Goals",
          "Building Blocks library access",
          "Test and Analyze surfaces",
          "AI for Customers and AI for Reps configuration",
          "Connections to external systems",
          "Legacy power-user surface (Advanced)",
        ],
        rationale: "The current Hybrid Prototype has 7 destinations inside AI plus Advanced. After lifting Goals and Monitors, only 5 remain plus Advanced. The workspace becomes scannable in one second.",
        goals_ref: "The AI workspace reads goals from the platform as input. AIC and AIR setup show 'this drives Goal X' annotations inline against every section, toggle, and procedure.",
        topics_ref: "Topics flow into AI from the attached goal. AI Setup reads topics as scope; Building Blocks filters by topic overlap; Test categories group by topic; Analyze tags every live signal with topic.",
        touchpoints: [
          "<b>Goals</b>, every AI configuration reads goals as input",
          "<b>Building Blocks</b>, shared library of attached procedures, tools, knowledge, guardrails",
          "<b>More → Settings</b>, org profile, audience tags, Computed Fields",
          "<b>Connections</b>, external integrations and MCP servers the AI calls",
          "<b>Performance</b>, observability layer that aggregates across AI versions",
        ],
        sources: [
          { kind: "p2", label: "Prototype", note: "Reduced from current shape" },
          { kind: "new", label: "New", note: "Collapse of nav inside AI is the second structural move" }
        ],
        sketch:
`AI (site rail, collapsed)
─────────────────────────────────────────
🪄 AI Setup           ← wizard, reads from Goals
📚 Building Blocks    ← shared library
🧪 Test               ← pre-deploy validation
📈 Analyze            ← live operational performance
⚙ Settings
   ├── AI for Customers
   └── AI for Reps
🔌 Connections
⚡ Advanced [LEGACY]`
      },
      children: [

        // + New automation — first-time mode of Build
        {
          id: "get-started",
          label: "+ New automation",
          iconClass: "launch",
          iconName: "wand",
          pills: [{ text: "Shortcut", kind: "new" }],
          subtitle: "Shortcut to Automations → Build, first-time mode",
          detail: {
            one_liner: "Not a separate destination, a shortcut that creates a new automation row and lands the admin on its Build tab in first-time mode. There is no wizard; first-time mode IS the Build tab with onboarding affordances.",
            purpose: "Removes the duplicate 'AI Setup wizard vs per-automation tabs' problem. + New automation creates a row in Automations and routes to /automations/{new-id}/build with first-time mode enabled. Same surface, same URL pattern, same fields as steady-state editing, with a stepper + locked future tabs + parser-drafted callouts overlaid until Deploy activates the automation.",
            rationale: "Before this change, AI Setup was a parallel surface that captured the same data the per-automation Build / Test / Deploy / Analyze tabs already captured. After the lifecycle-vocabulary unification (Build / Test / Deploy / Analyze everywhere), the only remaining difference was sequencing and onboarding affordances. Those move into the steady-state surface as a mode, not a separate destination. Result: one URL per task, no duplicate authoring surfaces, no jump-back-to-finish-the-wizard.",
            goals_ref: "Goal is picked at row-creation time (via the Attached Goals card on Build, or pre-selected when launched from a goal's '+ Attach AI automation' affordance). The picker uses the canonical Create Goals slide-out for new goals.",
            topics_ref: "Topics are read from the attached goal as a context strip on Build.",
            touchpoints: [
              "<b>Automations</b>, creates a row and routes into it",
              "<b>Goal detail</b>, + Attach AI automation routes here with the goal pre-selected",
              "<b>AI for Customers → automation → Build</b>, where the user actually lands (first-time mode on)",
              "<b>Building Blocks</b>, parser-drafted procedures / tools / knowledge land here, attached to the new automation",
            ],
            contents: [
              "Shortcut behavior, no UI of its own",
              "Creates a new Automation row with firstRunMode: true",
              "Routes to /automations/{id}/build",
              "Build enters first-time mode (stepper + locked future tabs + parser callouts)",
              "First-time mode ends when Deploy → Activate succeeds",
            ],
            ctas: [
              { primary: true, label: "Create automation", note: "creates the row + lands on Build in first-time mode" },
              { label: "Cancel", note: "discards the in-progress row" },
            ],
            sources: [{ kind: "new", label: "New", note: "Collapse of the AI Setup wizard into Build's first-time mode" }],
            sketch: `+ New automation, shortcut behavior
─────────────────────────────────────────
Click "+ New automation" anywhere it appears (rail row, Automations toolbar,
Goal detail + Attach AI automation, recommendation card)
                            │
                            ▼
Creates Automation row, firstRunMode: true
                            │
                            ▼
Route to /automations/{id}/build
                            │
                            ▼
Build tab opens in FIRST-TIME MODE:
  ┌──────────────────────────────────────────────────┐
  │ Stepper:  ● Build → ○ Test → ○ Deploy → ○ Analyze │
  └──────────────────────────────────────────────────┘
  • Future tabs visible but DISABLED ("Complete Build first")
  • Goal-context strip at top
  • Parser-drafted procedures / tools / KB pre-populated with callouts
  • "Save & continue" advances stepper + unlocks next tab
                            │
                            ▼
After Deploy → Activate:
  • firstRunMode flips to false
  • Stepper disappears
  • All tabs unlock
  • Automation behaves like any other`
          }
        },


        {
          id: "automations",
          label: "Manage Automations",
          iconClass: "set",
          iconName: "bolt",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: { goal_attach: "Per-row Goals column with attach/detach affordance. List-level + Create new goal CTA opens the canonical Create Goals slide-out, then drops the new goal into the picker on any row.",
            one_liner: "The portfolio surface for AI automations. The only place to add, edit, delete, duplicate, filter, sort, and bulk-manage automations.",
            purpose: "Manage Automations owns portfolio work; the AI for Customers dropdown owns quick switching. Add Automation, bulk-select, filter by deploy state / goal / topic, and richer columns (created, modified, modified-by, attached goals, attached topics) all live here.",
            goals_ref: "Each row shows which goals the automation drives.",
            topics_ref: "Topic tags on every automation, inherited from goals.",
            touchpoints: [
              "<b>AI for Customers</b>, click a row to open per-automation config",
              "<b>+ New automation</b>, shortcut creates a row and lands on Build in first-time mode",
              "<b>Goals</b>, filter automations by attached goal"
            ],
            contents: [
              "Full automation table with name, deploy status, type, attached goals, attached topics, created, modified, modified-by",
              "Audience facets: All / AIC / AIR",
              "Filters: deploy state, goal, topic, type",
              "Sort by any column",
              "Bulk-select for batch deploy / undeploy / delete",
              "Per-row controls: deploy toggle, edit (opens AIC config), duplicate, delete",
              "Add Automation CTA opens AI Setup wizard",
            ],
            ctas: [
              { primary: true, label: "+ Add Automation", note: "opens AI Setup wizard" },
              { label: "Edit automation", note: "click row → AIC config" },
              { label: "Duplicate", note: "clone an existing automation" },
              { destructive: true, label: "Delete", note: "with confirmation" },
              { label: "Deploy / Undeploy", note: "per-row toggle" },
              { facet: true, label: "Audience facet", note: "All / AIC / AIR" },
              { facet: true, label: "Filter", note: "deploy state / goal / topic / type" },
              { facet: true, label: "Sort", note: "any column" },
              { label: "Bulk-select", note: "batch deploy / undeploy / delete" },
            ],
            rationale: "Automations are the workspace's primary deliverable. One cross-cutting list gives admins deploy state and goal attachment at a glance.",
            sketch: ""
          }
        },


        {
          id: "ai-aic",
          label: "AI for Customers (selector)",
          iconClass: "perf",
          iconName: "chat",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: {
            suggestions_ref: "Suggestions surface across every AIC automation. The cross-automation queue lives at Performance, Suggestions; per-automation surfaces appear inside Analyze.",
            one_liner: "AI for Customers is a selector. The rail item opens a dropdown of every AIC automation (name + small status pill + 'Manage all automations' footer link). Picking one drops you into that automation's Build / Test / Deploy / Analyze / Settings tabs.",
            purpose: "Pure switcher in the rail. The dropdown is the only way to switch context between AIC automations from the rail. Portfolio operations (add, edit, delete, duplicate, filter, sort, bulk) live in Manage Automations, not in this dropdown.",
            goals_ref: "Goal-contribution annotations next to every section show which goals each toggle drives.",
            topics_ref: "Topic chips appear inline on each section that's topic-scoped.",
            touchpoints: [
              "<b>Manage Automations</b>, the list of automations opens this page when a row is clicked",
              "<b>Building Blocks</b>, procedures, tools, knowledge, shared guardrails attach inside this surface",
              "<b>More, Settings</b>, channels, brands, business hours inherit from org profile",
              "<b>Test</b>, validates the active automation",
              "<b>Analyze</b>, live signals for the deployed automation",
              "<b>Performance, Suggestions</b>, cross-automation suggestion queue surfaces fixes for any AIC automation",
            ],
            contents: [
              "Display Name, Description, deployment status pill",
              "Guardrails section (per-automation): Competitors, Secrets, Response Tone",
              "Email Template selector",
              "Handoff: Enable human-to-AI handoff toggle",
              "Conversation Start: Chat / SMS / WhatsApp greeting messages",
              "Verification: email + SMS account pickers",
              "Enable conversation abandonment handling",
              "AI Agent fallback behavior message",
              "Routing Settings: skip channels after routing",
              "Business hours awareness + schedule + outside-hours behavior",
              "Test Console (right rail) for live testing against this configuration",
              "Sticky save-bar across the surface"
            ],
            ctas: [
              { facet: true, label: "Switch automation", note: "dropdown lists every AIC automation" },
              { label: "→ Manage all automations", note: "footer link to portfolio surface" },
              { label: "+ Add automation", note: "deep-link to AI Setup" },
            ],
            rationale: "Mirror of AI for Reps in shape, one scrollable settings page. Production already presents AIC config this way; the new IA preserves it.",
            sketch: ""
          },
          children: [
            { id: "aic-build", label: "Build", iconClass: "leaf", iconGlyph: "·",
              detail: {
                suggestions_ref: "Suggestions recommend procedures here based on the goal's topics. Applying writes through to the automation's Procedures or attached Building Blocks.",
                one_liner: "Per-automation Build tab. Procedures (authored here), internal tools, attached Knowledge / Tools / Shared Guardrails from Building Blocks. Suggestions recommend procedures based on the goal topics. Attached Goals affordance at top.",
                purpose: "Inside one AIC automation, this is where the conversational logic is authored. Procedures live per-automation; internal tools live per-automation; shared resources reference Building Blocks.",
                topics_ref: "Procedures and tools carry topic tags from the automation's attached goals.",
                touchpoints: [
                  "<b>Building Blocks, Knowledge Sources</b>, attached as summary cards with link-out",
                  "<b>Building Blocks, Shared Tools</b>, attached as summary cards with link-out",
                  "<b>Building Blocks, Shared Guardrails</b>, attached as summary cards with link-out",
                  "<b>Goals</b>, Attached Goals affordance at top: + Attach goal opens picker, + Create new goal opens the slide-out",
                  "<b>Performance, Suggestions</b>, AI recommends procedures based on the goal topics",
                ],
                contents: [
                  "Knowledge Sources block: combobox selector for attached KB / docs / structured data",
                  "Procedures block: attach from shared library or create new (picker modal)",
                  "Inline procedure editor: Name, When to Use, Steps (rich text with @-mentions for tools)",
                  "Response Tone block: Friendly / Professional / Casual / Matter of Fact / Custom (with custom textarea)",
                  "Add Guidance affordance (top-right) for new guidance block types",
                  "Right-side rail: Assistant (chat helper) + Test Console (channel + brand, send messages)",
                  "Per-automation Procedures (authored here, not shared)",
                  "Internal Tools (scoped to this automation only)",
                  "Attached Shared Tools summary card",
                  "Attached Shared Guardrails summary card"
                ],
                ctas: [
                  { primary: true, label: "+ Add Guidance", note: "opens picker for new guidance block (KB, procedure, tone)" },
                  { label: "Attach knowledge source", note: "opens KB combobox" },
                  { primary: true, label: "Add Procedure", note: "opens picker (From library / Create new tabs)" },
                  { label: "Edit procedure inline", note: "Name, When to Use, Steps (rich text + @-mentions)" },
                  { label: "Pick response tone", note: "5 pills: Friendly · Professional · Casual · Matter of Fact · Custom" },
                  { destructive: true, label: "Detach procedure", note: "remove from this automation (keeps in library)" },
                  { label: "Open Assistant", note: "right rail — chat helper for guidance review" },
                  { label: "Open Test Console", note: "right rail — send test messages live" },
                  { primary: true, label: "Save", note: "commits the Current Draft version" },
                ],
                rationale: "Procedures and internal tools live per-automation by definition. Shared items reference the library.",
                sketch: ""
              }
            },
            { id: "aic-test", label: "Test", iconClass: "leaf", iconGlyph: "·",
              detail: {
                suggestions_ref: "Failing test categories generate suggestions that surface here. Apply edits the procedure or guardrail and re-runs the test.",
                one_liner: "Per-automation pre-deploy validation. Sample conversations grouped by category, scored against attached goals.",
                purpose: "Validate proposed changes to this automation before deploy. Runs against the Current Draft version.",
                goals_ref: "Test categories score against the automation's attached goals.",
                topics_ref: "Test categories group by topic.",
                touchpoints: [
                  "<b>AIC Build</b>, edits change the version under test",
                  "<b>AIC Deploy</b>, continue-to-deploy after a passing run",
                  "<b>Performance, Suggestions</b>, failing test categories generate suggestions that surface here",
                ],
                contents: [
                  "Evaluation categories table: name, audience tags (AIC/AIR), status, last run, score",
                  "Status badges: Current / Outdated / Running",
                  "Score column with info-tooltip (recommended threshold)",
                  "Category count chip (e.g. 5/30 categories)",
                  "Add category affordance (top-right)",
                  "Click a category row → detail with sample conversations + criteria",
                  "Right-side rail: Test Channel selector (Email / Chat / SMS / Instagram DM / WhatsApp)",
                  "Test Categories table",
                  "Run All Tests / Re-run All Tests",
                  "Pass / Warning / Fail per category",
                  "Version selector (Current Draft, deployed, archived)"
                ],
                ctas: [
                  { primary: true, label: "Run all tests", note: "scores every category against Current Draft" },
                  { label: "Re-run failed", note: "only categories that warned or failed" },
                  { primary: true, label: "+ Add category", note: "new test category with sample conversations + criteria" },
                  { label: "Open category", note: "click row — detail + per-case scoring" },
                  { label: "Pick test channel", note: "right rail — Email / Chat / SMS / Instagram / WhatsApp" },
                  { label: "Pick brand", note: "brand-scoped test context" },
                  { label: "Send test message", note: "live ad-hoc test in the side rail" },
                  { facet: true, label: "Version", note: "Current Draft / deployed / archived" },
                  { label: "Continue to Deploy", note: "footer CTA after passing" },
                ],
                rationale: "Production has this exact tab inside each automation.",
                sketch: ""
              }
            },
            { id: "aic-deploy", label: "Deploy", iconClass: "leaf", iconGlyph: "·",
              detail: {
                suggestions_ref: "Suggestions can be auto-applied as part of a new deploy, with the diff shown in Deploy Notes.",
                one_liner: "Per-automation deployment, <b>cross-audience by design</b>. AIC section (conditions, smart routing, eval recap) plus AIR section (Copilot toggle, mode picker, teams) on one page, separated by audience banners. One Activate button covers both.",
                purpose: "Take a new version of this automation live. Deploy is the activation moment for both AIC and AIR; it owns deploy notes, conditions, smart routing (with natural-language description), eval recap, Copilot enablement, and version history. AIR Settings still owns the steady-state Copilot config (writing guidance, summaries, signals); Deploy owns the on/off + mode for this deploy.",
                goals_ref: "Deploy shows the goals this automation drives and expected impact preview.",
                touchpoints: [
                  "<b>AIC Test</b>, must pass (or override) before deploy",
                  "<b>AIC Analyze</b>, post-deploy continuation",
                  "<b>Performance, Monitors</b>, deploy state mirrors here",
                  "<b>Performance, Suggestions</b>, suggestions can be auto-applied as part of a new deploy",
                ],
                contents: [
                  "Audience-banner sections: AIC section + AIR section (Copilot config) on one page",
                  "Deploy Notes textarea (1024-char limit)",
                  "Conditions: Matches ALL / Matches ANY rule groups (channel, brand, message body, customer locale, VIP flag)",
                  "Smart Routing description textarea (1024-char): natural-language description of what AI should handle vs escalate",
                  "Smart Routing visual: Match → AI handles · No match → Human agent pills",
                  "Review Evaluations summary: pulled-in test category scores with Go to Test link",
                  "AIR section: Turn on Copilot toggle, Proactive Suggestions toggle, Mode picker (Essentials / Full Context), Teams selector",
                  "Version History list: version, deployed-at, deployed-by, deploy note, restore action",
                  "Deploy Notes",
                  "Conditions (Matches ALL / Matches ANY rule groups)",
                  "Smart Routing (Match → AI handles, No match → Human agent)",
                  "Version history with deployed-by + when + note"
                ],
                ctas: [
                  { primary: true, label: "Deploy", note: "activates the new version (requires ≥1 condition)" },
                  { label: "Add deploy note", note: "describe what changed in this deployment" },
                  { label: "+ Add rule", note: "in Matches ALL or Matches ANY rule group" },
                  { label: "Edit Smart Routing", note: "natural-language guidance for handle vs escalate" },
                  { label: "Toggle Copilot", note: "AIR section — Turn on Copilot" },
                  { label: "Pick Copilot mode", note: "Essentials vs Full Context" },
                  { label: "Scope Copilot to teams", note: "All teams or specific team list" },
                  { label: "Observe Copilot", note: "opens live observation view" },
                  { label: "Restore version", note: "rollback to a prior deploy from Version History" },
                  { label: "Go to Test", note: "jump to evaluations from the Review Evaluations card" },
                  { destructive: true, label: "Remove rule", note: "delete a condition rule" },
                ],
                rationale: "Production has this exact tab inside each automation.",
                sketch: ""
              }
            },
            { id: "aic-analyze", label: "Analyze", iconClass: "leaf", iconGlyph: "·",
              detail: {
                suggestions_ref: "AI recommends how to fix the automation from observed drift and scorecard failures. Same primitive aggregated at Performance, Suggestions across all automations.",
                one_liner: "That one automation's live conversations table, <b>primary view</b>. Filter by version / customer / audience / date. Metrics overlays (Scorecards, Drift alerts, Suggestion queue) live as sibling sub-tabs.",
                purpose: "Answers 'how is THIS automation doing right now?' The canonical view is the conversations table (version + customer + audience + date filters). Metrics views, Scorecards, Drift alerts, Suggestion queue, are sibling sub-tabs that re-scope the same conversations data by signal type. AIC Analyze is per-automation, per-version. Platform Performance is the cross-AI rollup.",
                goals_ref: "Every signal carries goal attribution.",
                topics_ref: "Every signal carries topic tags.",
                touchpoints: [
                  "<b>Performance, Monitors</b>, aggregated across automations",
                  "<b>Performance, Suggestions</b>, aggregated across automations",
                  "<b>AIC Build</b>, drill-in from a failing scorecard",
                  "<b>Performance, Suggestions</b>, AI recommends how to fix the automation from observed drift and scorecard failures",
                ],
                contents: [
                  "<b>Primary tab: Conversations table</b> (default view) with version, customer, audience, date filters",
                  "Sub-tabs alongside: Scorecards · Drift alerts · Suggestion queue (re-scopings of the same data by signal type)",
                  "Version selector (Current Draft / v3 / v2 / v1)",
                  "Conversations list, paged",
                  "Search by subject or snippet",
                  "Audience segmented control: All / AI for Customers / AI for Reps",
                  "Date range filter (24h / 7d / 30d / 90d / All time)",
                  "Customer filter (named customer or all)",
                  "Per-conversation: subject, snippet, customer, topics, timestamp, tags",
                  "Click conversation row → transcript + per-criterion scoring + linked drift/suggestions",
                ],
                ctas: [
                  { facet: true, label: "Switch version", note: "Current Draft / v3 / v2 / v1" },
                  { label: "Search conversations", note: "matches subject or snippet" },
                  { facet: true, label: "Audience", note: "All / AI for Customers / AI for Reps" },
                  { facet: true, label: "Date range", note: "24h / 7d / 30d / 90d / all" },
                  { facet: true, label: "Customer", note: "filter by named customer" },
                  { label: "Open conversation", note: "transcript + criteria scoring + linked signals" },
                  { primary: true, label: "Apply in Procedure", note: "from a flagged conversation — inline slide-out fix" },
                  { primary: true, label: "Apply in Guardrail", note: "from a flagged conversation — inline slide-out fix" },
                  { label: "See in Performance", note: "footer link — cross-automation rollup" },
                  { label: "Back to Deploy", note: "footer link" },
                ],
                rationale: "Production has this exact tab inside each automation.",
                sketch: ""
              }
            ,
              children: [
                { id: "aic-analyze-scorecards", label: "Scorecards", iconClass: "leaf", iconGlyph: "·",
                  detail: { one_liner: "Live quality scores for this AIC version. Each card grades a slice of conversations against the attached goals. Footer link: see across all automations → Performance → Monitors.", purpose: "Per-version, per-automation scorecards. This is the source surface (author, apply, dismiss). Aggregated rollup of these lives in Performance → Monitors.", goals_ref: "Each scorecard carries goal attribution.", topics_ref: "Filterable by topic; topic-scoped scorecards surface here.", contents: ["Live scorecard list for this automation's deployed version","Goal-attribution badge on every card","Pass/Warning/Fail tinting","Filter by topic, by date range","Drill-in to underlying conversations"], rationale: "Per-version scorecard view, distinct from the cross-AI rollup in platform Performance.", sketch: "" } },
                { id: "aic-analyze-drift", label: "Drift alerts", iconClass: "leaf", iconGlyph: "·",
                  detail: { one_liner: "Runtime anomaly stream from the Validation Agent, scored by goal impact. Footer link: see across all automations → Performance → Anomalies.", purpose: "Surfaces where AI behavior is drifting in this automation's deployed version. This is the source surface. AI-only signal (Validation Agent); human degradation surfaces in Performance → Monitors.", goals_ref: "Each anomaly names the goal it threatens.", topics_ref: "Anomalies are topic-tagged.", contents: ["Validation Agent anomaly stream for this version","Severity-tinted (high/medium/low)","Linked-criteria cluster correlation","Pattern + root-cause hypothesis","Acknowledge / snooze / drill-into-conversations"], rationale: "Production AIC 2.0 Validation Agent already produces these; this surface exposes them per-automation.", sketch: "" } },
                { id: "aic-analyze-suggestions", label: "Suggestion queue", iconClass: "leaf", iconGlyph: "·",
                  detail: { one_liner: "Ranked corrective recommendations to fix what Scorecards and Drift alerts surfaced. Each card shows the before / after diff inline; Edit Procedure / Edit Article / Edit Tool / Edit Guardrail opens a slide-out with the affected block pre-loaded and AI changes marked, applied with Save and apply. Footer link: see across all automations → Performance → Suggestions.", purpose: "Per-automation suggestion queue. This is the source surface (apply, dismiss). The primary CTA on every card opens an inline slide-out edit view of the affected block (procedure, KB article, tool, shared guardrail) with AI-proposed changes pre-staged. Apply writes through to the automation's Build tab (procedures), Settings (per-automation guardrails), or attached Building Blocks (knowledge, tools, shared guardrails). No page navigation.", goals_ref: "Each suggestion names which goals it would move.", topics_ref: "Suggestions are topic-tagged.", contents: ["Ranked recommendations for this version","Preview before/after diff per card","Apply / Dismiss / See affected conversations","Write-through to Build, Settings, or Building Blocks","Cross-AI rollup lives in Performance, Suggestions"], rationale: "Per-automation surface that maps to production's Suggestions concept, scoped to the active automation.", sketch: "" } }
              ]},
            { id: "aic-settings", label: "Settings", iconClass: "leaf", iconGlyph: "·",
              detail: { suggestions_ref: "Suggestions for per-automation guardrails (tightening Competitors, refining Tone, adjusting Routing) surface here.", goal_attach: "Inline section on the Settings tab. The + Attach goal button opens a picker scoped to AIC audience; the picker's footer link + Create new goal opens the canonical Create Goals slide-out, which returns the new goal pre-selected on save.",
                one_liner: "Per-automation configuration. Identity, Per-automation guardrails (Competitors, Secrets, Tone), Email Template, Greetings, Verification, Business Hours, Routing, Fallback. Inline + Attach shared guardrail affordance pulls from Building Blocks → Shared Guardrails.",
                purpose: "Per-automation knobs that aren't authored conversational logic. Mirrors production's Settings tab. Per-automation guardrails (Competitors, Secrets, Tone) live here; reusable guardrails (refund ceilings, escalation triggers) live in Building Blocks → Shared Guardrails and attach via the inline affordance.",
                touchpoints: [
                  "<b>Building Blocks, Shared Guardrails</b>, inline + Attach shared guardrail affordance pulls from the library",
                  "<b>More, Settings</b>, org profile and channels inherit from here",
                  "<b>Performance, Suggestions</b>, suggestions for per-automation Guardrails surface here",
                ],
                contents: [
                  "Display Name, Description, deployment status",
                  "Per-automation guardrails: Competitors, Secrets, Tone",
                  "+ Attach shared guardrail affordance (opens Building Blocks → Shared Guardrails picker)",
                  "Email Template",
                  "Handoff toggle",
                  "Conversation Start: Greetings per channel",
                  "Verification: Email, SMS",
                  "Conversation abandonment handling",
                  "AI Agent fallback behavior",
                  "Routing Settings",
                  "Business hours awareness and routing"
                ],
                rationale: "Production has this exact tab inside each automation.",
                sketch: ""
              }
            }
          ]
        },

        {
          id: "ai-air",
          label: "AI for Reps",
          iconClass: "goals",
          iconName: "headset",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: {
            suggestions_ref: "Suggestions for AIR Copilot surface as coaching-path recommendations (writing-guidance tweaks, AI Agent tuning, summary cadence).",
            one_liner: "Workspace-level settings page for the rep Copilot. One Copilot per workspace, not a list of automations.",
            purpose: "AI for Reps is a settings destination, not an automation list. Configures the single workspace Copilot: turn on, team scope, AI Agents (specialist agents that power Copilot), Writing Guidance (drafts, expand, fix spelling), Translations, Typeahead, Summaries & Signals. Asymmetric with AI for Customers (which manages many AI Agent Teams) because AIR is a single primitive.",
            contents: [
              "Single-page AIR copilot configuration",
              "Copilot master toggle and live observation",
              "<b>Copilot Mode picker</b>: Essentials (faster, conversation + customer + writing guidance, suggests replies only) vs Full Context (slower, full AI Agents + Writing Guidance + knowledge, suggests replies AND actions)",
              "Team scoping for copilot availability",
              "Internal AI Agent specialist registry (separate from AIC agents)",
              "Writing guidance (draft, expand, fix spelling) with custom prompts",
              "Translation toggle and language management",
              "Typeahead suggestions toggle",
              "Auto-summary cadence",
              "Urgency, escalation risk, sentiment, churn-risk signals",
              "Goal-contribution annotations on every toggle",
              "Sticky save-bar across the surface",
            ],
            rationale: "Mirror of AIC setup. Same shape, same save-bar, different content. Predictable for admins who set up one, then the other.",
            goals_ref: "Mirror of AIC. Rep scoring is bound to goal contribution; assist suggestions are weighted by goal impact, not just frequency.",
            topics_ref: "AIR signals (urgency, sentiment, churn risk) and writing-guidance suggestions are computed per topic; team scoping reads topic distribution from TeamPulse.",
            touchpoints: [
              "<b>Goals</b>, AIR reads attached goals for scope and goal-contribution annotations",
              "<b>Building Blocks</b>, AI Agent specialists, writing-guidance prompts, knowledge sources",
              "<b>TeamPulse</b>, team scoping reads team distribution from here",
              "<b>AI → Analyze</b>, live signals for the deployed AIR version",
            ],
            sources: [
              { kind: "p1", label: "Prototype", note: "AIR settings concepts from Prototype A's Copilot + Summaries tabs" },
              { kind: "new", label: "New", note: "Collapses into one surface" }
            ],
            sketch: `AI for Reps (AI → Settings → AIR)
─────────────────────────────────────────
GOAL CONTEXT (read-only)
Driving: Speed up rep responses · Improve CSAT to 4.6
─────────────────────────────────────────
COPILOT
Master toggle   ✓ On                          [ Observe Copilot → ]
Teams           All teams (default)
AI Agents       3 specialists (Customer Expert, Conversation Analyst, Custom)
Writing guidance
 ├ Drafts          prompt set ·    drives Speed up
 ├ Expand text     prompt set ·    drives CSAT
 └ Fix spelling    prompt set
Translations    ✓ ·  EN ↔ ES, FR, PT
Typeahead       ✓

SUMMARIES & SIGNALS
Auto-summary cadence              every 5 turns
Urgency / Sentiment / Churn risk   ✓ ✓ ✓                         [ Save ]`
          }
        },

        {
          id: "building-blocks",
          label: "Building Blocks",
          iconClass: "res",
          iconName: "building",
          pills: [{ text: "Renamed", kind: "moved" }],
          detail: {
            one_liner: "Shared library of Knowledge Sources, Procedures, Tools, and Shared Guardrails that automations attach. Per-automation guardrails (Competitors, Secrets, Tone) live on each automation's Settings tab; Shared Guardrails (refund ceilings, escalation triggers, no-improvise rules) live here. Rail row exposes its top children (Knowledge Sources, Procedures, Tools, Shared Guardrails) as a one-click flyout.",
            purpose: "The cross-automation library. Procedures, tools, knowledge sources, and shared guardrails can be attached to many automations; edits propagate to every automation that uses them, with a blast-radius prompt on destructive changes. Rail flyout surfaces the four library types directly so Tools is one click from the rail.",
            goals_ref: "Every block in the library declares which goals it serves. Blocks used by multiple goals fire a blast-radius prompt before saving destructive edits.",
            topics_ref: "Every block (procedure, tool, knowledge) carries Topics tags. AI Setup uses topic overlap to suggest defaults; the library list filters by topic.",
            touchpoints: [
              "<b>Goals</b>, every block carries goal attachments",
              "<b>AI Setup</b>, writes through to every block type",
              "<b>AI for Customers / AI for Reps</b>, reads attached blocks per configuration",
              "<b>Connections</b>, Tools call external integrations registered here",
              "<b>Reporting → Topics</b>, every block tagged by topic for filtering and ranking",
              "<b>Performance → Suggestions</b>, applied suggestions write here",
            ],
            sources: [
              { kind: "p2", label: "Prototype", note: "Resources renamed to Building Blocks" },
              { kind: "canon", label: "Beacon M1", note: "Goal-attachment via the M1 reference model" }
            ],
            sketch: `Building Blocks (AI → Building Blocks)
─────────────────────────────────────────
LIBRARY                                        Goals attached
📑 Knowledge Sources         12 sources        7
🔧 Procedures                18 procedures     9
🛠 Tools                      11 tools          6
🛡 Shared Guardrails          24 rules          5     ← refund ceilings, escalation triggers

Rail row flyout: → Knowledge Sources · Procedures · Tools · Shared Guardrails

Every block carries: name, topics-covered, goals-attached, audience (AIC/AIR/both),
last-edited, health. Multi-goal blocks fire a blast-radius prompt on destructive edits.

Per-automation guardrails (Competitors, Secrets, Tone) live on each automation's Settings tab,
not here. The Settings card cross-links "+ Attach shared guardrail" into this library.`
          },
          ctas: [
            { primary: true, label: "Open Knowledge Sources", note: "KB articles, docs, structured data" },
            { primary: true, label: "Open Procedures", note: "step-by-step procedures" },
            { primary: true, label: "Open Tools", note: "API tools the AI calls" },
            { primary: true, label: "Open Shared Guardrails", note: "reusable rules attached to many automations" },
            { facet: true, label: "Filter by topic" },
            { facet: true, label: "Filter by goal" },
            { facet: true, label: "Filter by audience", note: "AIC / AIR / both" },
          ],
          children: [
            { id: "res-guardrails", label: "Shared Guardrails", iconClass: "leaf", iconGlyph: "·",
              detail: { one_liner: "Reusable guardrails that attach to many automations: refund ceilings, escalation triggers, no-improvise rules.", purpose: "The shared library of guardrails the AI applies across automations. Distinct from per-automation guardrails (Competitors, Secrets, Tone) which live on each automation's Settings tab.", contents: [
                "Shared guardrail registry (refund ceilings, escalation triggers, no-improvise rules)",
                "Per-rule attached-automation list with blast-radius prompt on destructive edits",
                "Goal-attachment per rule",
                "Audience scoping (AIC / AIR / both)",
                "Topic-tagged for filtering"
              ], rationale: "Separating reusable guardrails from per-automation knobs keeps the library shape symmetrical with Procedures, Tools, Knowledge Sources, every block here is shared. Per-automation guardrails stay on each automation's Settings tab where they belong.", goals_ref: "Each shared guardrail names the goals it serves. Multi-goal rules fire a blast-radius prompt before destructive edits.", topics_ref: "Topic-tagged so AI Setup can suggest defaults by topic overlap.", touchpoints: ["<b>AI for Customers / AI for Reps Settings</b>, per-automation Settings shows + Attach shared guardrail to pull from this library", "<b>Building Blocks, Procedures</b>, guardrails constrain procedure outputs", "<b>Performance, Suggestions</b>, applied suggestions can tighten or relax a shared guardrail"], sources: [{ kind: "canon", label: "Beacon M1", note: "Goal-attachment via the M1 reference model" }], sketch: "" } },
            { id: "res-knowledge", label: "Knowledge Sources", iconClass: "leaf", iconGlyph: "·",
              detail: { one_liner: "KB articles, docs, structured data sources.", purpose: "Knowledge source registry. KB articles, docs, and structured data the AI grounds in.", contents: [
                "Knowledge source registry (KB articles, docs, structured data)",
                "Source ingestion via URL, file upload, or MCP",
                "Goal-attachment chips and goal-aware ranking",
                "Source health and sync status",
              ], rationale: "Existing primitive. Beacon M1 (Summer 2026) adds goal-attachment chips and goal-aware ranking; M2 extends to admin authoring of computed fields from KB content.", goals_ref: "KB articles surface 'used by Goal X' chips. Goal-aware ranking promotes articles that move at-risk goals.", sources: [{ kind: "canon", label: "Beacon M1", note: "Goal-attachment via the M1 reference model" }], sketch: "", topics_ref: "Knowledge sources carry topic tags. Goal-aware ranking promotes articles whose topics overlap the at-risk goal's scope.", touchpoints: ["<b>Building Blocks → Procedures</b>, procedures reference KB articles", "<b>Connections</b>, MCP ingest is one source type", "<b>AI Setup</b>, wizard attaches existing KB and ingests new sources", "<b>Reporting → Topics</b>, each source is topic-tagged for goal-aware ranking"] } },
            { id: "res-procedures", label: "Procedures", iconClass: "leaf", iconGlyph: "·",
              detail: { one_liner: "Reusable step-by-step procedures attached to AIC or AIR setups.", purpose: "Reusable step-by-step procedures the AI executes. Topic-tagged and goal-attached.", contents: [
                "Procedures management",
                "Topic coverage tracking",
                "Audience scoping (AIC, AIR, both)",
                "Order tracking workflows",
                "Returns and refund workflows",
                "Knowledge base answer generation",
                "Escalation routing",
                "Rep response assistance",
                "Goal-attachment per procedure",
              ], rationale: "Existing primitive (pre-dates Beacon). Beacon M1 (Summer 2026) adds the reference model that lets every procedure declare which goals it supports.", goals_ref: "Procedures show their attached goals inline. Editing a procedure used by multiple goals fires a blast-radius prompt before save.", sources: [{ kind: "canon", label: "Beacon M1", note: "Procedures gain goal-attachment via the M1 reference model" }], sketch: "", topics_ref: "Every procedure declares its Topics Covered. The list view supports topic filter chips and shows topic pills on each row.", touchpoints: ["<b>Building Blocks → Knowledge Sources</b>, procedures cite KB articles for grounding", "<b>Building Blocks → Tools</b>, procedures invoke API tools", "<b>Building Blocks → Guardrails</b>, guardrails constrain procedure outputs", "<b>Performance → Suggestions</b>, applied suggestions edit procedure body", "<b>AI for Customers / AI for Reps</b>, each procedure attaches to one or both", "<b>Reporting → Topics</b>, every procedure carries Topics Covered tags"] } },
            { id: "res-tools", label: "Tools", iconClass: "leaf", iconGlyph: "·",
              detail: { one_liner: "API tools AIC and AIR can call.", purpose: "API tools and integrations the AI invokes. Health-tracked against the goals they support.", contents: [
                "API tool registry",
                "Integration source and auth tracking",
                "Tool health monitoring with goal-impact escalation",
                "Goal-attachment per tool",
              ], rationale: "Existing primitive. Beacon M1 (Summer 2026) makes tool health goal-aware so a failing tool that supports a live goal escalates faster.", goals_ref: "Tools show their attached goals. A failing tool that supports a live goal escalates faster than one that doesn't.", sources: [{ kind: "canon", label: "Beacon M1", note: "Goal-aware tool health" }], sketch: "", topics_ref: "Tools carry topic tags so tool health can be scored by topic exposure, a failing tool that supports a live-topic goal escalates faster.", touchpoints: ["<b>Connections</b>, every tool calls an external integration registered here", "<b>Building Blocks → Procedures</b>, procedures invoke tools by name", "<b>Goals</b>, tool health is scored against attached goals (broken tool escalates faster)"] } },
          ]
        },

        {
          id: "connections",
          label: "Connections",
          iconClass: "conn",
          iconName: "server",
          detail: {
            one_liner: "Integrations and MCP servers, the external systems Kustomer AI calls into.",
            purpose: "Integrations and MCP servers the AI calls into.",
            contents: [
              "External integration registry (Shopify, Stripe, EasyPost, Snowflake, MCP)",
              "Auth method tracking per integration",
              "Health and sync status",
              "Goal-impact halo for integrations supporting live goals",
              "Reconfigure / disconnect / test workflow",
            ],
            rationale: "Carried forward unchanged from the prototype.",
            goals_ref: "Connections show which goals depend on each integration's data. A broken Shopify connection that feeds a deflection goal escalates faster than one that doesn't.",
            topics_ref: "Integrations don't carry topic tags directly, but their health is annotated with the topics they affect, a failing Shopify connection raises Returns & refunds risk.",
            touchpoints: [
              "<b>Building Blocks → Tools</b>, every tool calls an integration registered here",
              "<b>AI for Customers / AI for Reps</b>, affected by integration health",
              "<b>Goals</b>, integrations carry goal-impact halos when broken",
            ],
            sources: [{ kind: "p2", label: "Prototype" }],
            sketch: ""
          }
        },

        {
          id: "advanced",
          label: "Advanced",
          iconClass: "adv",
          iconName: "bolt",
          pills: [{ text: "Legacy", kind: "legacy" }],
          detail: {
            one_liner: "The tool-first surface, preserved for customers with existing automations.",
            purpose: "Legacy surface for power users. Houses Build, Test, Deploy, and Manage Automations during migration. All settings work has moved to platform Settings (More → Settings) and per-automation Settings tabs.",
            contents: [
              "Legacy power-user surface",
              "Build, Test, Deploy, Manage Automations (legacy)",
              "Migration affordance for existing AI customers",
            ],
            rationale: "Stays inside AI under a 'For power users' subheader with a LEGACY pill. Sunset path pending.",
            goals_ref: "Legacy build / test / deploy / automations. No native goals integration; existing automations can be tagged with the goals they support so their impact is measurable in Monitors.",
            topics_ref: "Legacy surfaces have read-only topic awareness where Beacon M1 has propagated tags. Authoring of topics happens in Settings, not here.",
            touchpoints: [
              "<b>AI for Customers / AI for Reps</b>, legacy multi-automation surface lives here during migration",
              "<b>Manage Automations</b>, legacy cross-automation list (deprecated)",
              "<b>More → Settings</b>, platform Settings owns all org-wide config; legacy Settings has been removed from Advanced",
            ],
            sources: [{ kind: "p2", label: "Prototype", note: "Carried forward unchanged" }],
            sketch: ""
          }
        },












        // AI for Customers and AI for Reps (promoted out of Settings)
        // AIC setup

        // AIR setup

,


      ]
    },

// ============ REPORTING ============
    {
      id: "reporting",
      label: "Reporting",
      iconClass: "set",
      iconName: "pieChart",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "Presentation-ready, exportable analytics. Periodic snapshots and scheduled deliveries of agent efficiency and important metrics.",
        purpose: "Presentation-ready analytics. Standard reports, custom builders, scheduled deliveries, raw exports, and the AI Data Copilot for natural-language queries.",
        contents: [
          "Data Explorer (AI Data Copilot) for natural-language analytics",
          "Topics report (the canonical analytical view of the Topics primitive)",
          "Data Exports (raw conversation, customer, goal exports)",
          "Scheduled Reports (cross-report delivery queue)",
          "Standard Reports (OOTB library)",
        ],
        rationale: "Kept separate from Performance. Reporting answers 'how did we do, in a document I can hand someone'; Performance answers 'what is happening right now in trajectory and quality'. Both are platform-level peers. Goal reports moved out of Reporting to live on the Goals home page, that's where leaders go to ask about goal progress.",
        goals_ref: "Every report inherits a goals filter so leaders can slice any report by which goals it speaks to. Goal-specific reports live on the Goals home page rather than here.",
        topics_ref: "Topic is a first-class filter on every report. The Topics child is the headline analytical view; Data Explorer exposes Topic as a conversation attribute for ad-hoc queries.",
        touchpoints: [
          "<b>Goals Home</b>, Goal reports moved there; cross-link from Data Explorer",
          "<b>Performance</b>, live observability vs Reporting's presentation snapshots",
          "<b>More → Settings</b>, Topics taxonomy management",
          "<b>All destinations</b>, every conversation, customer, goal, and AI version is queryable",
        ],
        sources: [
          { kind: "p2", label: "Platform", note: "Existing destination, renamed" }
        ],
        sketch: `Reporting (site rail)
─────────────────────────────────────────
DATA EXPLORER (new)
🤖 AI Data Copilot, ask anything about your data in plain English

DATA EXPORTS · SCHEDULED REPORTS

STANDARD REPORTS
Goal reports (headline)
Conversation topics
Conversation · Team · Revenue · SLAs · Routing · Satisfaction
AI for Customers · AI for Customers 2.0 · AI for Reps · Assistant
Heatmap · Deflection · Agent Assist · Knowledge Base · Companies

CUSTOM REPORTS , SQL-like builder, save & share`
      },
      children: [
        { id: "data-explorer", label: "Data Explorer", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: {
            one_liner: "AI Data Copilot, ask anything about your data in plain English, get charts, tables, and follow-up suggestions.",
            purpose: "Natural-language analytics. Ask any question about the data, get charts and follow-up suggestions.",
            goals_ref: "Goals are a first-class dimension in the data model, \"how is the refund-tickets goal trending against AHT?\" returns a chart scoped to the goal.",
            topics_ref: "Topic and sub-topic are first-class conversation attributes available to the copilot. \"Which topics correlate with low CSAT?\" returns a topic-by-CSAT cross-tab.",
            touchpoints: [
              "<b>Goals</b>, goals are a queryable dimension",
              "<b>Reporting → Topics</b>, topic and sub-topic are queryable attributes",
              "<b>All destinations</b>, anything in the data model is fair game",
              "<b>Reporting → Scheduled Reports</b>, pin chart outputs as scheduled deliveries",
            ],
            contents: [
              "Conversational AI copilot for ad-hoc analytics",
              "Structured prompt library (best practices, workload, busiest times, multi-channel, benchmarks, SLA compliance, sentiment, repeat-contact)",
              "Saved threads with versioned questions and answers",
              "Chart + table output with one-click export and pin-to-dashboard",
              "Goals, Topics, and Customer attributes as queryable dimensions",
              "Voice-input affordance",
            ],
            rationale: "Lifted from the production Reporting destination's new Data Explorer surface. Sits at the top of Reporting because it's the new way most users will ask questions; standard reports stay for prebuilt views.",
            sketch: `Data Explorer (Reporting → Data Explorer)
─────────────────────────────────────────
✨ AI Data Copilot                                  New thread · 20h ago

Welcome to your AI Data Explorer
I can help you analyze your customer support data, create reports, track
performance metrics, and uncover insights about your team and customers.

What would you like to explore?

▸ Identify best practices among your top performing reps
▸ Create a coaching plan to help your reps improve
▸ Analyze the workload for each of your teams
▸ Analyze your busiest times
▸ Explore conversations that used multiple channels
▸ Get benchmarks for key performance metrics
▸ Predict future conversation demand with confidence intervals
▸ See how SLA compliance is changing over time
▸ Analyze positive and negative customer trends
▸ Identify customers who contacted support multiple times

[ Prompts library ]    Ask me about anything…              🎙  ↑`
          }
        },
        { id: "topics", label: "Topics", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "New", kind: "new" }],
          detail: {
            one_liner: "Canonical analytical view of the Topics primitive, volume %, AHT, CSAT correlation, drill-into-conversations, audience filter (AI / human / both).",
            purpose: "The canonical analytical view of the org's conversation taxonomy. Volume, AHT, CSAT correlation, drill-in to conversations.",
            goals_ref: "Topics that aren't goal-attached surface as ⚠ unowned. Drilling into a topic links into the goals it's referenced by.",
            topics_ref: "This is the analytical home of the Topics primitive. Volume %, AHT, descriptors, cluster labels, and per-topic conversation drill-down all live here.",
            touchpoints: [
              "<b>More → Settings</b>, taxonomy authoring (rename, merge, hide, custom instructions) lives there",
              "<b>Goals</b>, Topics this goal covers reads from this list",
              "<b>Building Blocks</b>, every block carries topic tags from this taxonomy",
              "<b>Inbox</b>, conversation headers show topics from this taxonomy",
              "<b>AI → Analyze</b>, every live signal is topic-tagged",
              "<b>TeamPulse</b>, topic column reads from this taxonomy",
            ],
            contents: [
              "Auto-detected topic taxonomy from closed conversations",
              "Per-topic volume %, AHT, CSAT correlation, and trend",
              "Audience filter (AI agents / human reps / both)",
              "Drill-down to conversations per topic",
              "Coverage rollup (% goal-attached, % unowned)",
              "Linked goals + procedures + AI versions per topic",
            ],
            rationale: "Topics is a primitive that touches many surfaces; this is the canonical place to read it analytically. Management lives in Settings; consumption lives here.",
            sketch: `Topics (Reporting → Topics)
─────────────────────────────────────────
Coverage:  5 topics · 87% of 90d volume · 62% goal-attached
─────────────────────────────────────────
Order tracking         24%   AHT 3.2m   ⟶ 1 goal · 4 procedures
Returns & refunds      18%   AHT 5.8m   ⟶ 2 goals · 7 procedures
Product questions      12%   AHT 2.4m   ⟶ 1 goal · 3 procedures
Account & login         9%   AHT 4.1m   ⟶ 0 goals · 1 procedure   ⚠ unowned
Shipping delays         8%   AHT 3.7m   ⟶ 1 goal · 2 procedures

Manage taxonomy → Settings → Topics`
          }
        },
        { id: "data-exports", label: "Data Exports", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: {
            one_liner: "One-off and recurring exports of raw conversation, customer, and goal data.",
            purpose: "Raw data exports of conversations, customers, and goals. One-off or scheduled.",
            goals_ref: "Goals and goal-attached conversations are exportable as first-class objects.",
            topics_ref: "Topic and sub-topic are first-class conversation attributes in every export.",
            touchpoints: [
              "<b>Reporting → Scheduled Reports</b>, recurring exports are scheduled here",
              "<b>Goals</b>, goal-attached conversations export as first-class objects",
            ],
            contents: [
              "One-off CSV / JSON exports of conversations, customers, goals",
              "Recurring exports with cadence (daily, weekly, monthly)",
              "Destinations: CSV download, BigQuery sync, Snowflake sync, S3 drop",
              "Export status, last run, next run, error history",
              "Schema browser for the exported data model",
            ],
            rationale: "Existing category in the production Reporting destination. Carried forward as a top-level Reporting child to match what users see today.",
            sketch: ""
          }
        },
        { id: "scheduled-reports", label: "Scheduled Reports", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: {
            one_liner: "All reports with recurring delivery, in one queue.",
            purpose: "Cross-report scheduled delivery queue. Pause, edit, or rerun any recurring report.",
            goals_ref: "Scheduled reports inherit goal filters from their source report.",
            topics_ref: "Scheduled reports inherit topic filters from their source report.",
            touchpoints: [
              "<b>Reporting → Standard Reports</b>, every standard report can be scheduled",
              "<b>Reporting → Data Explorer</b>, saved threads can be scheduled",
              "<b>Notifications</b>, failed deliveries surface here",
            ],
            contents: [
              "Cross-report scheduled delivery queue",
              "Per-row: report name, cadence, recipients, last run, next run, status",
              "Pause / run-now / edit / delete controls",
              "Failed-delivery alerts",
            ],
            rationale: "Carried forward unchanged from the production Reporting destination.",
            sketch: ""
          }
        },
        { id: "standard-reports", label: "Standard Reports", iconClass: "leaf", iconGlyph: "·",
          pills: [{ text: "Existing", kind: "tab" }],
          detail: {
            one_liner: "Pre-built reports for the operational categories every CX org tracks.",
            purpose: "The OOTB report library. Conversation, Team, Revenue, SLAs, AI, Knowledge Base, and more.",
            goals_ref: "Every standard report inherits a goals filter so leaders can slice any report by which goals it speaks to.",
            topics_ref: "Topic and sub-topic are first-class filters on every standard report.",
            touchpoints: [
              "<b>Goals</b>, every report inherits a goals filter",
              "<b>Reporting → Topics</b>, topic + sub-topic are first-class filters",
              "<b>Reporting → Scheduled Reports</b>, any report can be scheduled",
              "<b>AI for Customers / AI for Reps</b>, AI reports group by version",
            ],
            contents: [
              "Overview, Conversation, Revenue, Team, SLAs, Routing, Satisfaction",
              "AI for Customers, AI for Customers 2.0, AI for Reps, Assistant",
              "Heatmap, Deflection, Agent Assist, Knowledge Base, Companies",
              "Per-report filters, audience splits, date-range controls",
              "Save view, share, schedule, export per report",
            ],
            rationale: "Mirrors the production Standard Reports list exactly. Custom report builder for ad-hoc views; Data Explorer for natural-language queries.",
            sketch: ""
          }
        }
      ]
    },

        // ============ HOME ============
    {
      id: "home",
      label: "Rep Dashboard",
      iconClass: "set",
      iconName: "home",
      pills: [{ text: "Renamed", kind: "moved" }],
      detail: {
        one_liner: "The rep cockpit, personal queue, performance KPIs, and notifications. Same surface for admins, weighted differently.",
        purpose: "The rep cockpit. Personal queue, KPIs, recent activity, and notifications for the signed-in rep.",
        contents: [
          "Personalized rep cockpit",
          "Time-of-day greeting and personal context",
          "Personal queue and recent activity",
          "Performance KPIs (open / snoozed / done / AHT)",
          "Secondary KPIs (FCR, AFR, breached, SLA)",
          "Response Time and Messages Sent charts",
          "Notification stream",
          "Same surface for admins, weighted differently",
        ],
        rationale: "Listed for completeness so the site rail story is unambiguous.",
        goals_ref: "Home shifts from a generic dashboard to a goal-aware rep cockpit. KPI tiles get goal-attribution pills (\"contributing to: Reduce escalations\"). Notifications surface goal-impact alerts (\"this conversation is putting CSAT at risk\"). The same surface for admins emphasizes goal trajectory instead of personal KPIs.",
        topics_ref: "Personal queue can be filtered by topic. The daily summary surfaces the top topics the rep handled this shift.",
        touchpoints: [
          "<b>Inbox</b>, personal queue links from here",
          "<b>Performance → Monitors</b>, KPI tiles read scorecards",
          "<b>Goals</b>, KPI tiles carry goal-attribution pills",
          "<b>Notifications</b>, recent alerts surface inline",
        ],
        sources: [{ kind: "p2", label: "Platform", note: "Existing Kustomer destination" }],
        sketch: ""
      }
    },

    // ============ INBOX ============
    {
      id: "inbox",
      label: "Inbox",
      iconClass: "set",
      iconName: "inbox",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "The conversation inbox, unchanged by this IA.",
        purpose: "The rep's primary workspace. Conversations decorated with goal pills and topic tags.",
        contents: [
          "Rep primary workspace",
          "All / Assigned to me / Mentions / Following / Closed filters",
          "Goal pill decoration on conversations",
          "Conversation rows linked to platform Goals",
        ],
        rationale: "Listed so the site rail story is whole. The elevation of Goals lets Inbox become goal-aware over time.",
        goals_ref: "Every conversation row shows pills for the goals it contributes to. Clicking a pill jumps to Goals filtered to that goal. Closed conversations contribute to or detract from goal progress.",
        topics_ref: "Every conversation header shows its broad topic and sub-topic. Topic is an editable conversation attribute (admin scope) so admins can correct mis-tagged conversations.",
        touchpoints: [
          "<b>Goals</b>, every conversation row decorated with goal pills",
          "<b>Reporting → Topics</b>, header shows broad topic and sub-topic; topic is editable per conversation",
          "<b>Searches</b>, Saved searches deep-link in",
          "<b>AI → Analyze</b>, drift-flagged conversations link out from here",
        ],
        sources: [{ kind: "p2", label: "Platform", note: "Existing Kustomer destination" }],
        sketch: ""
      }
    },

    // ============ SEARCHES ============
    {
      id: "searches",
      label: "Searches",
      iconClass: "set",
      iconName: "listSearch",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "Saved searches, reusable views, and workflow-specific search sets.",
        purpose: "Saved search management. Personal, team, and org-shared scopes.",
        contents: [
          "Saved search management",
          "Personal, team, and org-shared scopes",
          "Reach-back lookup separate from Global Search",
        ],
        rationale: "Renamed to plural so the meaning is unambiguous. Global Search lives in the utility area at the top of the rail, not as a primary destination, so the two don't compete visually.",
        goals_ref: "Saved searches can be goal-aware: 'conversations contributing to Goal X' is a built-in scope filter alongside channel, team, and customer segment.",
        topics_ref: "Topic and sub-topic are filter attributes on the Conversation object. Saved searches can scope by topic; Search Assistant surfaces topic as a structured filter.",
        touchpoints: [
          "<b>Inbox</b>, saved searches open results in Inbox",
          "<b>Reporting → Topics</b>, topic is a filter attribute on the Conversation object",
          "<b>Goals</b>, saved searches can scope by goal",
          "<b>Global Search</b>, Search Assistant surfaces topic and goal as structured filters",
        ],
        sources: [
          { kind: "p2", label: "Platform", note: "Existing destination, clarified" },
          { kind: "new", label: "New", note: "Naming clarification" }
        ],
        sketch: ""
      }
    },

        // ============ TEAMPULSE ============
    {
      id: "teampulse",
      label: "TeamPulse",
      iconClass: "perf",
      iconName: "activity",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "Real-time presence and queue health. The 'what are my agents doing right now?' view across AI and human.",
        purpose: "Real-time team presence. Workload, sentiment, queue health, and active conversation signals.",
        contents: [
          "Team-facing live signals",
          "Workload, quality, sentiment, and queue visibility",
          "Distinct from Performance (goal-aware) and Reporting (periodic)",
        ],
        rationale: "Existing platform destination, kept in primary nav per the agent / admin daily-workflow guideline.",
        goals_ref: "Team metrics include each team's contribution to org goals. Drill into a team to see which goals their work is moving and which they're underperforming on.",
        topics_ref: "Topic filter and topic column on the team grid. See which teams are handling which topics live, and where topic concentration is shifting.",
        touchpoints: [
          "<b>Reporting → Topics</b>, topic column on the team grid",
          "<b>Inbox</b>, drilling into a team opens its active conversations",
          "<b>Performance → Monitors</b>, quality dips on a team link to scorecards",
          "<b>AI for Reps</b>, Copilot team scoping reads team distribution",
        ],
        sources: [
          { kind: "p2", label: "Platform", note: "Existing Kustomer destination" }
        ],
        sketch: `TeamPulse (site rail)
─────────────────────────────────────────
RIGHT NOW                                Live · refreshed every 15s
─────────────────────────────────────────
Team A     │ ⚪⚪⚪⚪⚫⚫  12 reps, 8 active   3 in-queue · AHT 4:12
Team B     │ ⚪⚪⚫⚫⚫⚫   9 reps, 3 active   0 in-queue · AHT 2:58
Team C     │ ⚪⚪⚪⚪⚪⚪  14 reps, 12 active  7 in-queue · AHT 5:31 ⚠

SENTIMENT (last 30 min)
Team A   ━━━━━━━━━━ 92% positive
Team C   ━━━━━━     71% positive  ⚠ trending down

QUEUE HEALTH
Chat      87% within SLA · 2 waiting
Email     94% within SLA · 14 queued
SMS       100% · 0 queued`
      }
    },

    // ============ GLOBAL SEARCH (utility) ============
    {
      id: "global-search",
      label: "Global Search",
      iconClass: "set",
      iconName: "searchCode",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "Global search launcher pinned at the bottom of the site rail.",
        purpose: "Persistent platform-wide launcher. Finds conversations, goals, customers, KB, and more.",
        contents: [
          "Persistent platform-wide launcher",
          "Cross-destination search (conversations, goals, customers, KB)",
          "Top utility-bar placement",
        ],
        goals_ref: "Goals are searchable. Typing a goal name opens the goal directly; results from other types (conversations, monitors) are tagged with the goals they touch.",
        topics_ref: "Topic and sub-topic are filter attributes on the conversation object in Search and Search Assistant.",
        touchpoints: [
          "<b>Inbox</b>, conversation results open in Inbox",
          "<b>Goals</b>, typing a goal name opens the goal slide-out directly",
          "<b>Reporting → Topics</b>, topic and sub-topic are structured filters",
          "<b>All destinations</b>, searchable across the platform",
        ],
        rationale: "Pinned at the bottom of the rail because it's a launcher, not a destination. Reachable with one keystroke from anywhere.",
        sources: [{ kind: "p2", label: "Platform", note: "Existing Kustomer utility" }],
        sketch: ""
      }
    },

    // ============ NOTIFICATIONS (utility) ============
    {
      id: "notifications",
      label: "Notifications",
      iconClass: "set",
      iconName: "bell",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "Notifications pinned at the bottom of the site rail with an unread badge.",
        purpose: "System notification stream. Assignments, mentions, monitor alerts, goal-threshold breaches.",
        contents: [
          "System notification stream",
          "Assignment alerts, escalations, goal-state changes",
          "Per-channel routing",
        ],
        goals_ref: "Goal-aware notifications surface when a goal trips a threshold, an anomaly impacts a goal, or a suggestion is ready that would move a goal. Notifications cite the goal in the body.",
        topics_ref: "Topic-scoped alerts (P2): notify when a topic's volume spikes or its quality scorecard trips a threshold.",
        touchpoints: [
          "<b>Performance → Monitors</b>, threshold breaches fire here",
          "<b>Goals</b>, goal-state changes alert here",
          "<b>AI → Analyze</b>, drift alerts fire here",
          "<b>Inbox</b>, assignment + mention alerts",
        ],
        rationale: "Pinned at the bottom of the rail because it's a utility, not a destination. The badge needs to be glance-able from anywhere.",
        sources: [{ kind: "p2", label: "Platform", note: "Existing Kustomer utility" }],
        sketch: ""
      }
    },

    // ============ OVERFLOW / MORE MENU ============
    {
      id: "overflow",
      label: "More",
      iconClass: "set",
      iconName: "moreH",
      pills: [{ text: "New", kind: "new" }],
      detail: {
        one_liner: "The kebab menu, low-frequency destinations live here.",
        purpose: "Kebab menu for low-frequency destinations. Houses Apps, Knowledge Base, Widgets, Settings, and Help.",
        contents: [
          "Low-frequency destination overflow (kebab menu)",
          "Houses Apps, Knowledge Base, Widgets, Settings, Help",
        ],
        rationale: "The primary rail keeps the existing destinations (Inbox, Searches, Reporting, TeamPulse, Rep Dashboard) and adds Goals + Performance, nine items total. Moving infrequent admin and support items into an overflow keeps the rail scannable and pushes daily-workflow items to the front. Goes against the enterprise reflex that everything is equally important.",
        goals_ref: "Overflow items reference goals indirectly. Settings hosts goal-aware alerting and retention; KB and Widgets read goal usage; Apps tag the goals they support.",
        topics_ref: "Topics taxonomy management lives in Settings (under More), the canonical admin surface for rename, merge, create, hide, and Topic Analysis enable/disable.",
        touchpoints: [
          "<b>More → Settings</b>, admin-managed taxonomies and org config",
          "<b>More → Apps</b>, integrations marketplace",
          "<b>More → Knowledge Base</b>, KB authoring",
          "<b>More → Widgets</b>, embed configuration",
          "<b>More → Help</b>, support center",
        ],
        sources: [
          { kind: "new", label: "New", note: "Overflow grouping per the navigation revision spec" }
        ],
        sketch:
`More (kebab popover)
─────────────────────────────────────────
Apps
Knowledge Base
Widgets
Settings
Help
─────────────────────────────────────────
(Anchored to the kebab icon at the bottom of the site rail)`
      },
      children: [
        { id: "of-apps", label: "Apps", pills: [{ text: "Moved", kind: "moved" }], iconClass: "leaf", iconName: "grid",
          detail: { one_liner: "The application store.", purpose: "The application store.", contents: "", rationale: "Not a daily workflow item.", goals_ref: "Apps are setup. Where applicable, app cards show 'supports Goal X' tags so admins can see which goals an app would help.", sources: [{ kind: "new", label: "Moved" }], sketch: "", touchpoints: ["<b>Connections</b>, installed apps register integrations here"] } },
        { id: "of-kb", label: "Knowledge Base", pills: [{ text: "Moved", kind: "moved" }], iconClass: "leaf", iconName: "bookOpen",
          detail: { one_liner: "KB authoring and management.", purpose: "Knowledge base authoring and management.", contents: "", rationale: "In an AI-first product, the knowledge base functions as infrastructure that powers AI answers. It shouldn't compete for primary nav space unless authors are working in it daily.", goals_ref: "Knowledge Base authoring surfaces 'used by Goal X' chips on every article and an at-risk-goal lens that highlights gaps.", sources: [{ kind: "new", label: "Moved" }], sketch: "", touchpoints: ["<b>Building Blocks → Knowledge Sources</b>, KB articles feed into AI ingestion", "<b>Inbox</b>, KB suggestions surface contextually for reps"] } },
        { id: "of-widgets", label: "Widgets", pills: [{ text: "Moved", kind: "moved" }], iconClass: "leaf", iconName: "grid",
          detail: { one_liner: "Embeddable widget configuration.", purpose: "Embeddable widget configuration.", contents: "", rationale: "Doesn't belong in primary nav unless users configure widgets daily.", goals_ref: "Widgets reference goals through the data they expose; widget configuration shows the goals their data impacts.", sources: [{ kind: "new", label: "Moved" }], sketch: "", touchpoints: ["<b>AI for Customers</b>, widget-channel deployment configures here"] } },
        {
          id: "of-settings",
          label: "Settings",
          pills: [{ text: "Moved", kind: "moved" }],
          iconClass: "leaf",
          iconName: "cog",
          detail: {
            one_liner: "Platform-wide configuration. The canonical home for org-level settings, taxonomies, and policy.",
            purpose: "Platform-wide configuration. Org profile, Topics taxonomy, Computed Fields, audience tags, channels, queues, roles.",
            goals_ref: "Goal-related defaults (state colors, audience tags, computed-field locks against deletion) live here as one canonical set so every destination renders goals consistently.",
            topics_ref: "Houses Topics taxonomy management, rename, merge, create, hide, draft → publish, custom instructions per topic, and the Topic Analysis enable/disable toggle.",
            touchpoints: [
              "<b>Reporting → Topics</b>, taxonomy authoring lives here; analytical view is in Reporting",
              "<b>Goals</b>, org profile and audience tags read from here",
              "<b>More → Settings → Computed Fields</b>, admin field management (M1 read-only)",
              "<b>AI for Customers / AI for Reps</b>, channels, brands, business hours, SLAs",
            ],
            contents: [
              "Org profile (industry, channels, brands, description), source of truth read by Goals",
              "Conversation Topics taxonomy management",
              "AI Computed Fields (read-only OOTB in M1, admin-authored in M2)",
              "Audience-tag taxonomy",
              "Channels, queues, business hours, SLAs",
              "Role & permission management",
              "Org-level policy + compliance toggles",
            ],
            rationale: "Settings are admin work. Daily agents shouldn't need to navigate here; lives in the kebab overflow so primary nav stays scannable for daily workflows.",
            sketch: `Settings (More → Settings)
─────────────────────────────────────────
ORG PROFILE
Acme Outdoors · Retail & E-commerce · 2 brands
Channels: email, chat, SMS, Instagram

CONVERSATION TOPICS  →  manage taxonomy (rename, merge, hide, custom instructions)
AI COMPUTED FIELDS   →  AI-Generated CSAT · Customer Health Score · Company Health Score
AUDIENCE TAGS        →  AIC · AIR · Sales · Human Reps · Other
CHANNELS · QUEUES · BUSINESS HOURS · SLAs
ROLES & PERMISSIONS`
          },
          children: [
            { id: "settings-computed", label: "Computed Fields", iconClass: "leaf", iconGlyph: "·",
              pills: [{ text: "Moved", kind: "moved" }],
              detail: {
                one_liner: "AI-Generated CSAT, Customer Health Score, Company Health Score, the three OOTB computed fields that feed goal progress.",
                purpose: "The three OOTB AI Computed Fields that feed goal progress. Read-only in M1; admin-authored in M2.",
                goals_ref: "All three computed fields feed goal progress. Each field shows which goals consume it; deleting or pausing a field warns about affected goals.",
                topics_ref: "Computed fields are sliceable by topic in downstream reports and monitors.",
                touchpoints: [
                  "<b>Goals</b>, every field feeds one or more goal trajectories",
                  "<b>Performance → Monitors</b>, quality scorecards read field values",
                  "<b>Reporting</b>, sliceable by topic, audience, and AI version",
                  "<b>AI for Customers</b>, AI-Generated CSAT is computed per AIC conversation",
                ],
                contents: [
                  "AI-Generated CSAT field",
                  "Customer Health Score field",
                  "Company Health Score field",
                  "Read-only OOTB fields in M1; admin authoring in M2",
                  "Goal-feed visibility per field",
                ],
                rationale: "Org-level data primitive that feeds every goal trajectory. Belongs in platform Settings (one canonical config surface) rather than buried in AI's Building Blocks.",
                sketch: ""
              }
            }
          ]
        },
        { id: "of-help", label: "Help", pills: [{ text: "Moved", kind: "moved" }], iconClass: "leaf", iconName: "help",
          detail: { one_liner: "Help and support.", purpose: "Help and support center.", contents: "", rationale: "Daily-use help should appear in context, not as a top-level destination.", goals_ref: "Help is contextual. From any destination, help articles surface the goal-related how-tos for that context first.", sources: [{ kind: "new", label: "Moved" }], sketch: "", touchpoints: ["<b>Inbox</b>, contextual help links from conversation surfaces"] } }
      ]
    },

    // ============ AVATAR (utility, bottom pinned) ============
    {
      id: "avatar",
      label: "Avatar",
      iconClass: "set",
      iconName: "user",
      pills: [{ text: "Existing", kind: "tab" }],
      detail: {
        one_liner: "User avatar pinned to the very bottom of the site rail.",
        purpose: "User profile menu. Account, session, and signout.",
        contents: [
          "User profile menu",
          "Account, session, and signout controls",
        ],
        goals_ref: "Profile surfaces the goals the user owns (admin) or is scored against (rep). Theme / preferences include 'show goal pills on conversation rows' as an opt-out.",
        touchpoints: [
          "<b>More → Settings</b>, profile, role, and session config",
        ],
        rationale: "Bottom-pinned because account-level access is always-on, low-frequency, and conventionally anchored there. Never moves into overflow.",
        sources: [{ kind: "p2", label: "Platform", note: "Existing Kustomer utility" }],
        sketch: ""
      }
    }
  ]
};
