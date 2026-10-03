// Business-outcome catalog + recommended plans.
// Each outcome has a richly-modeled "plan" that powers the GoalPlan screen.
// Three outcomes have full plans (reduce-escalations, increase-upsell,
// improve-resolution-quality). The rest use a generic template so the demo
// stays clickable across the whole catalog.

const OUTCOMES = [
  {
    id: "reduce-escalations",
    family: "efficiency",
    title: "Reduce escalations",
    one_liner: "Resolve repetitive issues safely before they reach a human, while still escalating risky or high-frustration cases.",
    icon: "shield",
    accent: "#0165E4",
    surfaces: ["aic", "air", "monitors", "procedures", "alerts"],
    targets: [
      { label: "Avoidable handoffs", op: "-25%" },
      { label: "AI CSAT", op: "≥ 4.5" },
      { label: "Escalate refund disputes & angry customers", op: "always" },
    ],
  },
  {
    id: "increase-upsell",
    family: "revenue",
    title: "Increase upsell revenue by 15%",
    one_liner: "Identify qualified upsell opportunities during support conversations and help reps act on them without making the experience feel pushy or irrelevant.",
    icon: "chartLine",
    accent: "#0E7A3D",
    surfaces: ["aic", "air", "monitors", "procedures", "alerts", "approval"],
    targets: [
      { label: "Support-influenced upsell revenue", op: "+15%" },
      { label: "CSAT after upsell attempt", op: "≥ 4.5" },
      { label: "Human approval before revenue-driving offers", op: "required" },
    ],
  },
  {
    id: "improve-resolution-quality",
    family: "agent",
    title: "Improve human agent resolution quality by 20%",
    one_liner: "Help reps resolve conversations more accurately and consistently while reducing unnecessary escalations, reopens, and rework.",
    icon: "sparkles",
    accent: "#7B22A4",
    surfaces: ["air", "monitors", "qa", "supervisor", "alerts"],
    targets: [
      { label: "QA pass rate", op: "+20%" },
      { label: "Reopen rate", op: "-15%" },
      { label: "First contact resolution", op: "↑" },
      { label: "CSAT", op: "maintain or ↑" },
    ],
  },
  {
    id: "reduce-cost",
    family: "efficiency",
    title: "Reduce support cost",
    one_liner: "Bring cost-to-serve down by deflecting common questions, shrinking handle time, and trimming rework — without degrading CSAT.",
    icon: "package",
    accent: "#0165E4",
    surfaces: ["aic", "air", "monitors"],
    targets: [
      { label: "Cost-per-contact", op: "-20%" },
      { label: "AI containment", op: "≥ 60%" },
      { label: "CSAT", op: "maintain" },
    ],
  },
  {
    id: "improve-cx",
    family: "cx",
    title: "Improve customer experience",
    one_liner: "Raise CSAT and reduce repeat contacts by giving customers faster, clearer, and more consistent answers across every channel.",
    icon: "chat",
    accent: "#0165E4",
    surfaces: ["aic", "air", "monitors", "procedures"],
    targets: [
      { label: "CSAT", op: "+0.4" },
      { label: "Repeat contacts", op: "-15%" },
      { label: "First reply time", op: "-30%" },
    ],
  },
  {
    id: "rep-productivity",
    family: "agent",
    title: "Increase rep productivity",
    one_liner: "Help reps move faster on every conversation with summaries, drafts, and next-best-action recommendations they can trust.",
    icon: "bolt",
    accent: "#7B22A4",
    surfaces: ["air", "monitors"],
    targets: [
      { label: "Average handle time", op: "-15%" },
      { label: "Concurrent conversations per rep", op: "↑" },
      { label: "CSAT", op: "maintain" },
    ],
  },
  {
    id: "order-tracking",
    family: "cx",
    title: "Improve order tracking",
    one_liner: "Resolve where-is-my-order and shipping questions end-to-end without a human, using order, shipment, and return data.",
    icon: "package",
    accent: "#0165E4",
    surfaces: ["aic", "procedures", "monitors"],
    targets: [
      { label: "Tracking deflection rate", op: "≥ 85%" },
      { label: "Tracking CSAT", op: "≥ 4.6" },
      { label: "Escalations on tracking", op: "-50%" },
    ],
  },
  {
    id: "compliance-trust",
    family: "risk",
    title: "Protect compliance and trust",
    one_liner: "Prevent unsafe AI answers, enforce required disclosures, and keep regulated topics under human review.",
    icon: "shield",
    accent: "#CD1D2B",
    surfaces: ["aic", "air", "monitors", "supervisor", "qa"],
    targets: [
      { label: "Policy violations", op: "0" },
      { label: "Required-disclosure adherence", op: "100%" },
      { label: "AI escalation on regulated topics", op: "always" },
    ],
  },
  {
    id: "retention",
    family: "cx",
    title: "Improve retention",
    one_liner: "Detect at-risk customers in support conversations, route them carefully, and offer save plays before they churn.",
    icon: "chartLine",
    accent: "#0E7A3D",
    surfaces: ["aic", "air", "monitors", "approval"],
    targets: [
      { label: "Churn signals captured", op: "≥ 90%" },
      { label: "Save-rate on at-risk contacts", op: "+25%" },
      { label: "Discount approval before send", op: "required" },
    ],
  },
];

// Audience labels & meta
const FAMILY_LABEL = {
  efficiency: "Support efficiency",
  cx: "Customer experience",
  revenue: "Revenue",
  agent: "Human-agent performance",
  risk: "Risk & compliance",
};
const FAMILY_TONE = {
  efficiency: { bg: "#EBF1FF", fg: "#0E3280" },
  cx:         { bg: "#DEF7FA", fg: "#016E7C" },
  revenue:    { bg: "#DBF5E0", fg: "#016A2A" },
  agent:      { bg: "#F5EBFD", fg: "#7B22A4" },
  risk:       { bg: "#FFE8E9", fg: "#CD1D2B" },
};

const SURFACE_LABEL = {
  aic:        "AI for Customers",
  air:        "AI for Reps",
  monitors:   "Monitors",
  procedures: "Procedures",
  alerts:     "Alerts",
  approval:   "Approvals",
  qa:         "QA scorecards",
  supervisor: "Supervisor review",
};

// =====================================================================
// PLAN TEMPLATES — keyed by outcome id.
// Each plan describes: customer-AI behaviour, rep-AI behaviour, procedures
// & guardrails, the responsibility matrix, monitors, alerts, scope &
// safety, enforcement defaults, and blast-radius (what will be created).
// =====================================================================

const PLAN_LIBRARY = {
  "reduce-escalations": {
    summary: "Customer AI handles the long tail of repetitive, low-risk requests end-to-end. Rep AI catches the rest with summaries and escalation recommendations. Anything tied to refunds, identity, or high frustration stays human-owned.",
    customer_ai: [
      "Answer order status questions",
      "Explain return policy",
      "Start a return label flow",
      "Escalate damaged item, refund dispute, or angry customer",
    ],
    rep_ai: [
      "Summarize conversation history",
      "Draft replies for late shipments",
      "Recommend escalation when refund policy or VIP account applies",
      "Warn reps when a response may hurt CSAT or compliance",
    ],
    procedures: [
      "Order tracking procedure",
      "Lost package workflow",
      "Refund exception handling",
      "Identity verification before changing shipping address",
      "Escalate when customer sentiment is highly negative",
    ],
    matrix: {
      cols: ["Customer AI handles", "Rep AI assists", "Human required"],
      rows: [
        { label: "Order status",         marks: [1, 0, 0] },
        { label: "Return policy",        marks: [1, 0, 0] },
        { label: "Refund dispute",       marks: [0, 1, 1] },
        { label: "Damaged item",         marks: [0, 1, 1] },
        { label: "Angry customer",       marks: [0, 1, 1] },
        { label: "VIP customer",         marks: [0, 1, 1] },
      ],
    },
    monitors: {
      primary: [
        { label: "Avoidable escalation rate", op: "lt",  value: "-25%" },
        { label: "AI-contained resolution",   op: "gte", value: "60%"   },
        { label: "AI CSAT",                   op: "gte", value: "4.5/5" },
      ],
      guardrail: [
        { label: "Wrong-answer rate",         op: "lt",  value: "1%"  },
        { label: "Repeat contact rate",       op: "lt",  value: "8%"  },
        { label: "Refund dispute escalation", op: "always" },
        { label: "Human rescue rate",         op: "lt",  value: "5%"  },
        { label: "Procedure adherence",       op: "gte", value: "95%" },
      ],
    },
    alerts: [
      "Alert when escalation rate rises above target",
      "Alert when CSAT drops below 4.5",
      "Weekly goal report by topic, channel, and automation",
      "Flagged conversations requiring review",
    ],
    enforcement: [
      { surface: "Customer AI", level: "recommend",        note: "Resolves low-risk repetitive questions end-to-end" },
      { surface: "Rep AI",      level: "recommend",        note: "Recommends escalation when policy or sentiment triggers fire" },
      { surface: "Automation",  level: "require-approval", note: "Always escalate refund disputes, high frustration, identity-sensitive changes" },
    ],
    safety_note: "This goal will not automatically change live AI behavior until you approve and deploy it.",
    blast_radius: [
      { kind: "Customer AI procedures",         count: 2 },
      { kind: "Rep assistant guidance rules",   count: 3 },
      { kind: "Quality monitors",               count: 5 },
      { kind: "Alerts",                         count: 2 },
      { kind: "Goal dashboard",                 count: 1 },
      { kind: "Report breakdowns",              count: 4 },
    ],
  },

  "increase-upsell": {
    summary: "Reps stay in the driver's seat for revenue moments. Customer AI educates, Rep AI surfaces qualified opportunities and drafts low-pressure language, but no revenue offer leaves the platform without a human OK.",
    customer_ai: [
      "Detect signals that a customer may need a higher-tier product, add-on, warranty, subscription, or service plan",
      "Answer basic questions about available plans or services",
      "Avoid hard-sell offers when the customer is frustrated, unresolved, or asking about a problem",
      "Escalate qualified upsell opportunities to a human rep when timing and context are appropriate",
    ],
    rep_ai: [
      "Surface upsell cues in the conversation summary",
      "Suggest relevant offers based on customer history, plan, product usage, or purchase pattern",
      "Draft a low-pressure upsell message for the rep to review",
      "Warn the rep if the moment is not appropriate — angry, unresolved, or at-risk customer",
      "Recommend follow-up timing if the upsell should happen after resolution",
    ],
    procedures: [
      "Do not upsell before the customer's primary issue is resolved",
      "Do not suggest products the customer already owns",
      "Do not upsell during refund disputes, complaints, or high-frustration conversations",
      "Require human approval before sending any revenue-driving offer",
      "Follow brand rules for discounts, eligibility, and offer language",
    ],
    matrix: {
      cols: ["Customer AI may educate", "Rep AI suggests offer", "Human approval required", "Do not upsell"],
      rows: [
        { label: "Customer asks about plan limits",                 marks: [1, 1, 1, 0] },
        { label: "Customer repeatedly contacts about capacity",     marks: [1, 1, 1, 0] },
        { label: "Customer uses a feature heavily",                 marks: [0, 1, 1, 0] },
        { label: "Customer asks about add-ons",                     marks: [1, 1, 1, 0] },
        { label: "Customer is angry or unresolved",                 marks: [0, 0, 0, 1] },
        { label: "Customer is in refund dispute",                   marks: [0, 0, 0, 1] },
      ],
    },
    monitors: {
      primary: [
        { label: "Support-influenced upsell revenue", op: "gte", value: "+15%" },
        { label: "Qualified opportunities identified", op: "gte", value: "target" },
        { label: "Rep acceptance rate (AI offers)",   op: "gte", value: "60%" },
        { label: "Conversion rate",                   op: "gte", value: "target" },
      ],
      guardrail: [
        { label: "CSAT after upsell attempt",                op: "gte", value: "4.5/5" },
        { label: "Complaint rate after upsell",              op: "lt",  value: "1%"   },
        { label: "Repeat contact rate",                      op: "lt",  value: "8%"   },
        { label: "Offer relevance score",                    op: "gte", value: "0.8"  },
        { label: "Human override / dismissal rate",          op: "lt",  value: "30%"  },
        { label: "Upsell attempted before issue resolved",   op: "lt",  value: "5%"   },
      ],
    },
    alerts: [
      "Alert when upsell attempts increase but CSAT drops",
      "Alert when reps dismiss AI upsell suggestions above a set threshold",
      "Weekly revenue report by topic, channel, product, rep team, and AI influence",
      "Breakdown of missed qualified opportunities",
      "Breakdown of inappropriate upsell attempts",
    ],
    enforcement: [
      { surface: "Customer AI", level: "monitor",          note: "Tracks signals; never closes a revenue offer on its own" },
      { surface: "Rep AI",      level: "require-approval", note: "Drafts offer language; rep must approve before sending" },
      { surface: "Automation",  level: "monitor",          note: "Revenue actions are never auto-applied" },
    ],
    safety_note: "Revenue recommendations require human approval by default.",
    blast_radius: [
      { kind: "Qualified upsell detection rule",        count: 1 },
      { kind: "Rep guidance prompts",                   count: 2 },
      { kind: "Offer eligibility procedure",            count: 1 },
      { kind: "Revenue & CX monitors",                  count: 4 },
      { kind: "Alerts",                                 count: 2 },
      { kind: "Revenue influence dashboard",            count: 1 },
    ],
  },

  "improve-resolution-quality": {
    summary: "Rep AI becomes a coach. It surfaces what was missed, what to say next, and where the rep should slow down — feeding the same signal back into QA so coaching and scoring stay in lockstep.",
    customer_ai: [
      "Collect required context before handoff",
      "Summarize the customer issue for the rep",
      "Route the customer to the right team based on topic, urgency, and account status",
      "Avoid attempting full resolution when the issue requires human judgment",
    ],
    rep_ai: [
      "Summarize the customer's issue and history",
      "Recommend the next best action",
      "Draft responses based on approved procedures and knowledge",
      "Warn when the rep's draft may violate policy, miss required steps, or create escalation risk",
      "Suggest when to escalate to a supervisor or specialist",
      "Coach reps toward clearer, more empathetic, more complete responses",
    ],
    procedures: [
      "Required troubleshooting checklist",
      "Required identity verification steps",
      "Supervisor escalation criteria",
      "Approved refund / replacement / retention language",
      "Tone and empathy standards",
      "Compliance language for regulated topics",
    ],
    matrix: {
      cols: ["Customer AI collects context", "Rep AI coaches", "QA monitor tracks", "Human supervisor required"],
      rows: [
        { label: "Missing troubleshooting step", marks: [1, 1, 1, 0] },
        { label: "Possible policy violation",    marks: [0, 1, 1, 1] },
        { label: "Low-empathy draft",            marks: [0, 1, 1, 0] },
        { label: "Escalation recommended",       marks: [0, 1, 1, 1] },
        { label: "Customer has repeated issue",  marks: [1, 1, 1, 0] },
        { label: "Supervisor review needed",     marks: [0, 0, 1, 1] },
      ],
    },
    monitors: {
      primary: [
        { label: "QA pass rate",              op: "gte", value: "+20%" },
        { label: "First contact resolution",  op: "gte", value: "↑" },
        { label: "Reopen rate",               op: "lt",  value: "-15%" },
        { label: "Required-step completion",  op: "gte", value: "95%" },
      ],
      guardrail: [
        { label: "CSAT",                              op: "gte", value: "maintain" },
        { label: "Escalation accuracy",               op: "gte", value: "90%"   },
        { label: "Customer frustration sentiment",    op: "lt",  value: "5%"    },
        { label: "Supervisor override rate",          op: "lt",  value: "10%"   },
        { label: "Repeat contact within 7 days",      op: "lt",  value: "8%"    },
        { label: "Average handle time (secondary)",   op: "monitor" },
      ],
    },
    alerts: [
      "Alert when QA pass rate drops below target",
      "Alert when reopen rate increases for a specific topic",
      "Report agent performance by topic, procedure, team, and AI assistance level",
      "Show whether AIR suggestions improved or hurt resolution quality",
      "Show conversations where the rep ignored a high-confidence AIR warning",
    ],
    enforcement: [
      { surface: "Customer AI",          level: "recommend",        note: "Collects context and routes to the right team" },
      { surface: "Rep AI",               level: "recommend",        note: "Recommends and warns; rep retains control" },
      { surface: "QA monitors",          level: "enforce",          note: "Required-step checks enforced only for high-risk workflows" },
      { surface: "Supervisor review",    level: "require-approval", note: "Required for repeated failures or sensitive topics" },
    ],
    safety_note: "Coaching suggestions are visible to reps before they are used in QA scoring.",
    blast_radius: [
      { kind: "AIR coaching rules",          count: 3 },
      { kind: "Required-step monitors",      count: 2 },
      { kind: "QA scorecard",                count: 1 },
      { kind: "Supervisor alerts",           count: 2 },
      { kind: "Agent performance report",    count: 1 },
    ],
  },
};

// Fallback generic plan for the outcomes we didn't model in full.
const genericPlan = (outcome) => ({
  summary: outcome.one_liner,
  customer_ai: [
    "Resolve common questions tied to this outcome",
    "Collect context the rep will need on handoff",
    "Escalate edge cases or high-risk conversations",
  ],
  rep_ai: [
    "Summarize the conversation and prior history",
    "Recommend the next best action",
    "Warn when an action would conflict with the goal",
  ],
  procedures: [
    "Identity verification on sensitive changes",
    "Escalation rules linked to this outcome",
    "Brand & tone guardrails",
  ],
  matrix: {
    cols: ["Customer AI handles", "Rep AI assists", "Human required"],
    rows: [
      { label: "Routine question",            marks: [1, 0, 0] },
      { label: "Ambiguous context",           marks: [0, 1, 0] },
      { label: "Sensitive / regulated topic", marks: [0, 1, 1] },
      { label: "High-frustration customer",   marks: [0, 1, 1] },
    ],
  },
  monitors: {
    primary: outcome.targets.map(t => ({ label: t.label, op: "gte", value: t.op })),
    guardrail: [
      { label: "CSAT",                op: "gte", value: "maintain" },
      { label: "Repeat contact rate", op: "lt",  value: "10%" },
      { label: "Policy adherence",    op: "gte", value: "95%" },
    ],
  },
  alerts: [
    "Alert when a primary metric drifts past target",
    "Weekly goal report by topic and channel",
    "Flagged conversations requiring review",
  ],
  enforcement: [
    { surface: "Customer AI", level: "recommend" },
    { surface: "Rep AI",      level: "recommend" },
    { surface: "Automation",  level: "monitor" },
  ],
  safety_note: "This goal will not automatically change live AI behavior until you approve and deploy it.",
  blast_radius: [
    { kind: "Procedures",     count: 2 },
    { kind: "Guidance rules", count: 2 },
    { kind: "Monitors",       count: 4 },
    { kind: "Alerts",         count: 2 },
    { kind: "Goal dashboard", count: 1 },
  ],
});

const getOutcome = (id) => OUTCOMES.find(o => o.id === id);
const getPlan = (id) => {
  const out = getOutcome(id);
  if (!out) return null;
  return PLAN_LIBRARY[id] || genericPlan(out);
};

// Enforcement-level metadata (used by the GoalPlan view + Tune controls).
const ENFORCEMENT = {
  "monitor":          { label: "Monitor only",        desc: "Track performance and alert admins.",                 fg: "#0E3280", bg: "#EBF1FF" },
  "recommend":        { label: "Recommend",            desc: "AI suggests actions, humans decide.",                  fg: "#7B22A4", bg: "#F5EBFD" },
  "require-approval": { label: "Require approval",     desc: "AI drafts or recommends, a human must approve.",       fg: "#8A5A08", bg: "#FFF4E6" },
  "enforce":          { label: "Enforce",              desc: "System blocks or prevents risky actions.",             fg: "#CD1D2B", bg: "#FFE8E9" },
};

Object.assign(window, {
  OUTCOMES, FAMILY_LABEL, FAMILY_TONE, SURFACE_LABEL,
  PLAN_LIBRARY, getOutcome, getPlan, ENFORCEMENT,
});
