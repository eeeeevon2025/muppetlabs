// Auto-generated from cursor/ TSX/TS sources.
// Loaded via @babel/standalone with presets typescript + react.

// ─── cursor/types.ts ───────────────────────────────
(() => {
// Types mirror the K_DATA shape from the source design HTML so monitors,
// goals, conversations and anomalies can be rendered with high fidelity.

type MonitorKind = 'aic' | 'air' | 'both';
type MonitorMetricKind =
  | 'csat_avg'
  | 'adoption_pct'
  | 'adherence_pct'
  | 'qa_score'
  // Human-measured CX
  | 'aht_avg'
  | 'resolution_pct'
  | 'reopen_pct'
  | 'escalation_pct'
  | 'custom_metric'
  // AI-evaluated CX
  | 'aicsat_avg'
  | 'sentiment_avg'
  | 'resolution_quality'
  | 'empathy_avg'
  | 'effort_avg'
  | 'clarity_avg';

type MonitorTemplateCategory = 'ai_adherence' | 'cx_metric' | 'custom_business';
type CxMetricMode = 'human' | 'ai_evaluated';
type MonitorTemplateSubType =
  // ai_adherence
  | 'procedure'
  | 'tools'
  | 'knowledge_base'
  | 'tone'
  | 'hallucination'
  // cx_metric human
  | 'aht'
  | 'resolution_rate'
  | 'csat'
  | 'reopen_rate'
  | 'escalation_rate'
  | 'other'
  // cx_metric ai_evaluated
  | 'aicsat'
  | 'ai_sentiment'
  | 'ai_resolution_quality'
  | 'ai_empathy'
  | 'ai_effort'
  | 'ai_clarity'
  // custom_business
  | 'computed_field'
  | 'business_opportunities'
  | 'regex'
  | 'formula'
  | 'code';

/** A single scored band in a custom rubric (e.g. 1.0–2.4 / 5). */
interface RubricBand {
  lo: number;
  hi: number;
  text: string;
  passing: boolean;
}

/** Custom rubric attached directly to a criterion. */
interface CriterionRubric {
  name: string;
  bands: RubricBand[];
}

interface MonitorCriterion {
  name: string;
  description?: string;
  guidance?: string;
  weight: number;
  essential: boolean;
  pass: number;
  source: string;
  baseline?: number;
  criterionThreshold?: number;
  current?: number;
  trend?: number[];
  unit?: string;
  inlineRubric?: CriterionRubric;
}

interface Monitor {
  id: string;
  name: string;
  description?: string;
  isDefault: boolean;
  kind: MonitorKind;
  metricKind: MonitorMetricKind;
  metricLabel: string;
  metricUnit: string;
  evals30d: number;
  trend: number[];
  criteria: MonitorCriterion[];
  contextProfile: string[];
  writesField: string;
  goalIds: string[];
  alerting: {
    enabled: boolean;
    cadence: 'hourly' | 'daily';
    channels: string[];
  };
  suggestionsEnabled: boolean;
  /** For adherence_pct monitors: average % at or above which a conversation counts as passing. */
  passingScore?: number;
  templateCategory?: MonitorTemplateCategory;
  templateSubType?: MonitorTemplateSubType;
  cxMetricMode?: CxMetricMode;
  alsoMonitorAIR?: boolean;
  /** 0–100; percentage of conversations to evaluate (default 100). */
  samplingRate?: number;
  sparkEvents?: { idx: number; kind: 'criteria' | 'examples'; label: string }[];
  editLog?: { date: string; who: string; change: string }[];
}

interface Goal {
  id: string;
  name: string;
  description: string;
}

type AnomalyCategory = 'monitor' | 'criteria';
type AnomalySeverity = 'high' | 'med' | 'drift' | 'pos';
type AnomalyDirection = 'up' | 'down';

interface Anomaly {
  id: string;
  cat: AnomalyCategory;
  metric: string;
  monitorName: string;
  monitorKey: 'AI CSAT' | 'Procedure' | 'Escalation' | 'Repeat' | 'Copilot' | 'QA';
  monitorId: string;
  sev: AnomalySeverity;
  base: number;
  now: number;
  unit: string;
  dir: AnomalyDirection;
  variance: number;
  head: string;
  spark: number[];
  hist: number[];
  why: string;
  threatens: string;
  goalLabel: string;
  linkedTo: string | null;
  siblings?: string[];
  flaggedConvCount: number;
  investigateCount: number;
  weight?: number;
  firstSeen: string;
}

interface ConversationExcerpt {
  who: 'cust' | 'agent';
  t: string;
}

type ConvoSentiment = 'angry' | 'frustrated' | 'resigned' | 'satisfied';

interface InvestigationConversation {
  id: string;
  cust: string;
  topic: string;
  dur: string;
  turns: number;
  sentiment: ConvoSentiment;
  failed: string[];
  rationale: string;
  excerpt: ConversationExcerpt[];
}

interface OperationalMetric {
  label: string;
  sub: string;
  vals: number[];
}

// Per-criterion score that a single conversation received against the monitor.
// Mirrors window.K_DATA.flaggedConversations[].criteriaScores from the source HTML.
interface ReviewCriterionScore {
  name: string;
  weight: number;
  score: number;
  pass: boolean;
  essential?: boolean;
  rationale?: string;
  source?: string;
}

type ReviewMessageRole = 'customer' | 'ai' | 'system' | 'tool';

interface ReviewMessage {
  role: ReviewMessageRole;
  text: string;
  time: string;
}

// Conversation as shown inside the "Review conversations" / Investigate drawer.
// Combines real flagged failures and synthetic passing templates the monitor
// would expect a reviewer to label.
interface ReviewConversation {
  id: string;
  customer: string;
  customerCompany: string;
  monitor?: string;
  monitorId?: string;
  score: number;
  status: 'pass' | 'fail';
  timeAgo: string;
  preview: string;
  criteriaScores: ReviewCriterionScore[];
  messages: ReviewMessage[];
}


})();

// ─── cursor/data/rubricRefs.ts ───────────────────────────────
(() => {
// Shared rubric reference catalog and seeding helpers.
// Used by MonitorCard (when editing scoring criteria) AND ReviewPanel
// (so the "With scoring" view can show the same /kb:, /tool:, /procedure:
// chips that the criterion is linked to in its monitor definition).

const { MonitorCriterion } = window;

type RubricRefType = 'kb' | 'tool' | 'procedure' | 'rubric';

interface RubricRef {
  type: RubricRefType;
  slug: string;
}

interface RubricRefMeta {
  color: string;
  bg: string;
  border: string;
  label: string;
}

interface RefLibEntry {
  slug: string;
  label: string;
}

const REF_LIB: Record<RubricRefType, RefLibEntry[]> = {
  rubric: [],
  kb: [
    { slug: 'returns-policy', label: 'Returns policy' },
    { slug: 'refund-eligibility', label: 'Refund eligibility' },
    { slug: 'shipping-faq', label: 'Shipping FAQ' },
    { slug: 'billing-disputes', label: 'Billing disputes' },
    { slug: 'sla-table', label: 'SLA response targets' },
  ],
  tool: [
    { slug: 'order-lookup', label: 'Order lookup' },
    { slug: 'refund-issue', label: 'Issue refund' },
    { slug: 'ticket-status', label: 'Ticket status' },
    { slug: 'customer-context', label: 'Customer context' },
    { slug: 'kb-search', label: 'KB search' },
  ],
  procedure: [
    { slug: 'escalation-path', label: 'Escalation path' },
    { slug: 'vip-handoff', label: 'VIP handoff' },
    { slug: 'fraud-flag', label: 'Fraud flag' },
    { slug: 'compliance-check', label: 'Compliance check' },
    { slug: 'first-response', label: 'First response procedure' },
  ],
};

const REF_TYPE_META: Record<RubricRefType, RubricRefMeta> = {
  rubric: { color: '#1C6EF2', bg: '#EFF6FF', border: '#BFDBFE', label: 'rubric' },
  kb: { color: '#0E7C86', bg: '#E2F7F8', border: '#A5E1E5', label: 'kb' },
  tool: { color: '#6B3FA0', bg: '#F1ECFA', border: '#D6C5EE', label: 'tool' },
  procedure: {
    color: '#9B5A00',
    bg: '#FFF4E0',
    border: '#FCE0B0',
    label: 'procedure',
  },
};

// Deterministic seed of rubric refs for a criterion based on keywords in its
// name. Mirrors the seedRefsForCriterion helper in the source design HTML so
// the same monitor + criteria produces the same chips everywhere.
const seedRefsForCriterion = (c: MonitorCriterion): RubricRef[] => {
  const n = (c.name || '').toLowerCase();
  if (/escalat|handoff|hand-off|transfer/.test(n))
    return [
      { type: 'procedure', slug: 'escalation-path' },
      { type: 'kb', slug: 'sla-table' },
    ];
  if (/refund|return|billing|charge/.test(n))
    return [
      { type: 'tool', slug: 'refund-issue' },
      { type: 'kb', slug: 'refund-eligibility' },
    ];
  if (/order|status|tracking|shipping/.test(n))
    return [
      { type: 'tool', slug: 'order-lookup' },
      { type: 'kb', slug: 'shipping-faq' },
    ];
  if (/ground|knowledge|kb|cite|source|accuracy/.test(n))
    return [
      { type: 'tool', slug: 'kb-search' },
      { type: 'kb', slug: 'returns-policy' },
    ];
  if (/proced|compli|policy|fraud/.test(n)) return [{ type: 'procedure', slug: 'compliance-check' }];
  if (/tone|empath|professional|greeting|closing/.test(n)) return [{ type: 'procedure', slug: 'first-response' }];
  if (/vip|priority|loyal/.test(n))
    return [
      { type: 'procedure', slug: 'vip-handoff' },
      { type: 'tool', slug: 'customer-context' },
    ];
  return [];
};

// Build a name -> refs map for a list of monitor criteria, suitable for
// joining against `criteriaScores` entries on a ReviewConversation.
const buildRefsByCriterion = (criteria: MonitorCriterion[]): Record<string, RubricRef[]> => {
  const out: Record<string, RubricRef[]> = {};
  criteria.forEach((c) => {
    out[c.name] = seedRefsForCriterion(c);
  });
  return out;
};

// Fuzzy lookup that tolerates small drift between monitor criterion names
// and the names recorded on a conversation's criteriaScores entry. Tries
// (in order): exact match, score name is a prefix of a criterion name,
// criterion name is a prefix of the score name, then a substring match
// either way. Falls back to seeding refs from the score name itself.
const findRefsForScoreName = (refsByCriterion: Record<string, RubricRef[]>, scoreName: string): RubricRef[] => {
  if (refsByCriterion[scoreName] && refsByCriterion[scoreName].length > 0) {
    return refsByCriterion[scoreName];
  }
  const norm = scoreName.toLowerCase();
  for (const [crName, refs] of Object.entries(refsByCriterion)) {
    if (refs.length === 0) continue;
    const cn = crName.toLowerCase();
    if (cn.startsWith(norm) || norm.startsWith(cn)) return refs;
    if (cn.includes(norm) || norm.includes(cn)) return refs;
  }
  return seedRefsForCriterion({
    name: scoreName,
    weight: 0,
    essential: false,
    pass: 0,
    source: '',
  });
};

Object.assign(window, { REF_LIB, REF_TYPE_META, seedRefsForCriterion, buildRefsByCriterion, findRefsForScoreName });
})();

// ─── cursor/data/conversations.ts ───────────────────────────────
(() => {
const { InvestigationConversation } = window;

const CONVOS_BASE: InvestigationConversation[] = [
  {
    id: 'C-8821',
    cust: 'Marisol P.',
    topic: 'Refund denied \u00b7 billing',
    dur: '14m',
    turns: 9,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state', 'Acknowledged customer frustration', 'Customer confirmed problem solved'],
    rationale: 'Agent stayed procedural while customer escalated. No empathy lines for 6 consecutive turns.',
    excerpt: [
      { who: 'cust', t: "I've asked three times. This is the THIRD time I'm typing this out." },
      {
        who: 'agent',
        t: 'Per our policy, refunds outside 30 days require manager approval. Please hold.',
      },
      { who: 'cust', t: "I don't care about the policy. I care that nobody is listening." },
      { who: 'agent', t: 'I understand. Let me check the manager queue.' },
    ],
  },
  {
    id: 'C-8814',
    cust: 'Devon T.',
    topic: 'Refund denied \u00b7 billing',
    dur: '11m',
    turns: 7,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state', 'Customer confirmed problem solved'],
    rationale: 'Customer asked the same question 3 times before agent reframed. Resolution unclear at close.',
    excerpt: [
      { who: 'cust', t: 'So why was it denied? I just need to understand.' },
      { who: 'agent', t: 'It falls outside our policy window.' },
      { who: 'cust', t: "But why? What's the actual reason?" },
      { who: 'agent', t: 'The 30-day window has passed.' },
    ],
  },
  {
    id: 'C-8809',
    cust: 'Asha B.',
    topic: 'Refund denied \u00b7 billing',
    dur: '18m',
    turns: 12,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state', 'Acknowledged customer frustration'],
    rationale: 'Customer expressed frustration twice. Agent did not acknowledge either time.',
    excerpt: [
      { who: 'cust', t: "I'm honestly so tired of this." },
      { who: 'agent', t: 'I can look up your order if you give me the ID.' },
      { who: 'cust', t: 'I already gave it to you twice.' },
      { who: 'agent', t: 'Apologies. Order #44219, correct?' },
    ],
  },
  {
    id: 'C-8803',
    cust: 'R. Mueller',
    topic: 'Refund denied \u00b7 billing',
    dur: '9m',
    turns: 6,
    sentiment: 'resigned',
    failed: ['Customer confirmed problem solved'],
    rationale: 'Conversation ended without explicit confirmation. Customer\u2019s last message: "whatever, fine."',
    excerpt: [
      { who: 'agent', t: "So we'll process the credit instead. Is that acceptable?" },
      { who: 'cust', t: 'whatever, fine.' },
      { who: 'agent', t: 'Great, all set! Anything else?' },
    ],
  },
  {
    id: 'C-8798',
    cust: 'Theo N.',
    topic: 'Refund denied \u00b7 billing',
    dur: '22m',
    turns: 14,
    sentiment: 'angry',
    failed: ['Tone matched emotional state', 'Acknowledged customer frustration', 'Customer confirmed problem solved'],
    rationale: 'Triple failure. Customer used emphatic language by turn 8. Agent stayed scripted.',
    excerpt: [
      { who: 'cust', t: "This is absurd. I've been a customer for 4 years." },
      { who: 'agent', t: 'I appreciate your loyalty. Per policy\u2014' },
      { who: 'cust', t: 'Stop saying "per policy."' },
    ],
  },
  {
    id: 'C-8794',
    cust: 'L. Okafor',
    topic: 'Refund denied \u00b7 billing',
    dur: '7m',
    turns: 5,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state'],
    rationale: 'Customer joked dryly; agent missed the cue and stayed formal.',
    excerpt: [
      { who: 'cust', t: 'Great, another no. Wonderful.' },
      { who: 'agent', t: 'I have processed your request as denied per policy.' },
    ],
  },
  {
    id: 'C-8786',
    cust: 'J. Park',
    topic: 'Refund denied \u00b7 billing',
    dur: '13m',
    turns: 8,
    sentiment: 'frustrated',
    failed: ['Acknowledged customer frustration', 'Customer confirmed problem solved'],
    rationale: 'Customer explicitly said "this is frustrating"; not acknowledged.',
    excerpt: [
      { who: 'cust', t: 'This is frustrating to keep explaining.' },
      { who: 'agent', t: 'Could you provide your order ID once more?' },
    ],
  },
];

const CONVOS_PADDING: InvestigationConversation[] = [
  {
    id: 'C-8779',
    cust: 'M. Chen',
    dur: '10m',
    turns: 6,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8771',
    cust: 'A. Singh',
    dur: '15m',
    turns: 10,
    sentiment: 'frustrated',
    failed: ['Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8763',
    cust: 'P. Volkov',
    dur: '8m',
    turns: 5,
    sentiment: 'resigned',
    failed: ['Tone matched emotional state'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8755',
    cust: 'S. Idris',
    dur: '12m',
    turns: 7,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state', 'Acknowledged customer frustration'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8748',
    cust: 'D. Romero',
    dur: '19m',
    turns: 11,
    sentiment: 'angry',
    failed: ['Tone matched emotional state', 'Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8741',
    cust: 'F. Bauer',
    dur: '6m',
    turns: 4,
    sentiment: 'resigned',
    failed: ['Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8734',
    cust: 'Y. Tanaka',
    dur: '14m',
    turns: 9,
    sentiment: 'frustrated',
    failed: ['Acknowledged customer frustration'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8727',
    cust: 'B. Adekoya',
    dur: '17m',
    turns: 11,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state', 'Acknowledged customer frustration', 'Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8719',
    cust: 'C. Lefevre',
    dur: '11m',
    turns: 7,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8712',
    cust: 'N. Pavlova',
    dur: '9m',
    turns: 5,
    sentiment: 'resigned',
    failed: ['Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8704',
    cust: 'I. Ahmed',
    dur: '13m',
    turns: 8,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state', 'Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8697',
    cust: 'V. Sokolov',
    dur: '21m',
    turns: 13,
    sentiment: 'angry',
    failed: ['Tone matched emotional state', 'Acknowledged customer frustration'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8689',
    cust: 'G. Hassan',
    dur: '7m',
    turns: 5,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8682',
    cust: 'O. Nakamura',
    dur: '16m',
    turns: 10,
    sentiment: 'frustrated',
    failed: ['Acknowledged customer frustration', 'Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8674',
    cust: 'E. Costa',
    dur: '12m',
    turns: 7,
    sentiment: 'resigned',
    failed: ['Customer confirmed problem solved'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
  {
    id: 'C-8666',
    cust: 'T. Larsen',
    dur: '10m',
    turns: 6,
    sentiment: 'frustrated',
    failed: ['Tone matched emotional state'],
    topic: 'Refund denied \u00b7 billing',
    rationale: '',
    excerpt: [],
  },
];

const INVESTIGATION_CONVERSATIONS: InvestigationConversation[] = [...CONVOS_BASE, ...CONVOS_PADDING];

Object.assign(window, { INVESTIGATION_CONVERSATIONS });
})();

// ─── cursor/data/anomalies.ts ───────────────────────────────
(() => {
const { Anomaly, OperationalMetric } = window;

const ANOMALY_DAYS = [
  'Apr 30',
  'May 1',
  'May 2',
  'May 3',
  'May 4',
  'May 5',
  'May 6',
  'May 7',
  'May 8',
  'May 9',
  'May 10',
  'May 11',
  'May 12',
  'today',
];

const STUB_ANOMALIES: Anomaly[] = [
  // Monitor anomalies
  {
    id: 'm1',
    cat: 'monitor',
    metric: 'Daily AI-CSAT average',
    monitorName: 'AICSAT',
    monitorKey: 'AI CSAT',
    monitorId: 'mon_csat',
    sev: 'high',
    base: 4.3,
    now: 3.8,
    unit: '/ 5.0',
    dir: 'down',
    variance: 0.2,
    head: 'Average AI-CSAT score has dropped from 4.3 to 3.8 over the last 10 days — driven by refund conversations failing tone and empathy checks.',
    spark: [4.3, 4.2, 4.1, 4.0, 4.0, 3.9, 3.8, 3.8],
    hist: [4.4, 4.3, 4.3, 4.2, 4.2, 4.1, 4.0, 4.0, 3.9, 3.9, 3.8, 3.8, 3.8, 3.8],
    why: '62 of the last 220 scored conversations failed at least one criterion. Most are billing and refund denials dragging the daily average down.',
    threatens: 'CSAT \u2265 4.5 goal',
    goalLabel: 'CSAT \u2265 4.5',
    linkedTo: 'c1',
    siblings: ['c1', 'c2', 'c4'],
    flaggedConvCount: 62,
    investigateCount: 23,
    firstSeen: '3 days ago',
  },
  {
    id: 'm2',
    cat: 'monitor',
    metric: 'Procedure adherence rate',
    monitorName: 'Refund Procedure Adherence',
    monitorKey: 'Procedure',
    monitorId: 'mon_proc',
    sev: 'med',
    base: 92,
    now: 82,
    unit: '%',
    dir: 'down',
    variance: 3,
    head: 'Procedure adherence has fallen from 92% to 82% over the past month — agents are still referencing the old refund policy, not the May 4 update.',
    spark: [92, 91, 90, 89, 88, 87, 85, 82],
    hist: [92, 92, 91, 91, 90, 90, 89, 88, 87, 86, 85, 84, 83, 82],
    why: 'The policy-citation check is failing most frequently. Agents haven\u2019t updated their responses to reflect the new refund window.',
    threatens: 'Procedure adherence goal',
    goalLabel: 'Adherence \u2265 90%',
    linkedTo: 'c3',
    siblings: ['c3'],
    flaggedConvCount: 19,
    investigateCount: 14,
    firstSeen: '4 days ago',
  },
  {
    id: 'm3',
    cat: 'monitor',
    metric: 'Escalation Monitor rate',
    monitorName: 'Escalation Monitor',
    monitorKey: 'Escalation',
    monitorId: 'mon_esc',
    sev: 'med',
    base: 7.1,
    now: 8.4,
    unit: '%',
    dir: 'up',
    variance: 1.5,
    head: 'Escalation rate is climbing because customers have to ask the same question 3 or more times before the AI hands off the conversation.',
    spark: [7, 7.2, 7, 7.4, 7.8, 8.1, 8.4, 8.4],
    hist: [7, 7.1, 7, 7.2, 7, 7.4, 7.8, 8.1, 8.4, 8.4, 8.5, 8.5, 8.6, 8.6],
    why: '18 flagged conversations show the same pattern: repeated questions, no resolution, then handoff.',
    threatens: 'Escalation \u2264 5% goal',
    goalLabel: 'Escalation \u2264 5%',
    linkedTo: null,
    siblings: [],
    flaggedConvCount: 18,
    investigateCount: 12,
    firstSeen: '3 days ago',
  },
  {
    id: 'm4',
    cat: 'monitor',
    metric: 'Repeat Contact rate',
    monitorName: 'Repeat Contact Monitor',
    monitorKey: 'Repeat',
    monitorId: 'mon_rep',
    sev: 'pos',
    base: 14.9,
    now: 11.2,
    unit: '%',
    dir: 'down',
    variance: 4,
    head: 'Repeat contacts are down — which is good — because the self-service flow launched Tuesday appears to be working.',
    spark: [14, 15, 14, 13, 12, 11.5, 11.2, 11.2],
    hist: [14.5, 15, 14, 15, 14, 13, 12, 11.5, 11.2, 11.2, 11, 11, 11.1, 11.1],
    why: 'Confirm the data includes enough conversations. Holiday-period volume may be making the drop look bigger than it is.',
    threatens: 'Repeat contact \u2264 12% goal',
    goalLabel: 'Repeat \u2264 12%',
    linkedTo: null,
    siblings: [],
    flaggedConvCount: 0,
    investigateCount: 0,
    firstSeen: '2 days ago',
  },

  // Criteria cluster anomalies
  {
    id: 'c1',
    cat: 'criteria',
    metric: 'Tone matched the customer\u2019s emotional state',
    monitorName: 'AICSAT',
    monitorKey: 'AI CSAT',
    monitorId: 'mon_csat',
    sev: 'high',
    base: 5,
    now: 23,
    unit: ' fails',
    dir: 'up',
    variance: 3,
    head: 'Tone-matching failures are spiking because agents are using scripted responses on refund denials without adjusting to the customer\u2019s emotional state.',
    spark: [5, 4, 6, 8, 12, 18, 23, 23],
    hist: [5, 4, 6, 5, 4, 6, 8, 12, 18, 23, 23, 23, 22, 23],
    why: 'All 23 daily failures are billing and refund conversations where the customer pushed back after the first denial.',
    threatens: 'AI CSAT Monitor (weighted 15%)',
    goalLabel: 'CSAT \u2265 4.5',
    linkedTo: 'm1',
    flaggedConvCount: 23,
    investigateCount: 23,
    weight: 15,
    firstSeen: '3 days ago',
  },
  {
    id: 'c2',
    cat: 'criteria',
    metric: 'Customer got the help they needed',
    monitorName: 'AICSAT',
    monitorKey: 'AI CSAT',
    monitorId: 'mon_csat',
    sev: 'med',
    base: 8,
    now: 14,
    unit: ' fails',
    dir: 'up',
    variance: 4,
    head: 'Problem-confirmed failures are up because the same 23 refund conversations failing tone are also failing this check — it\u2019s one root cause, not two.',
    spark: [8, 9, 8, 10, 11, 13, 14, 14],
    hist: [8, 9, 8, 9, 8, 10, 11, 13, 14, 14, 14, 13, 14, 14],
    why: 'Same conversation set as the Tone anomaly. Fixing tone on refund denials will likely resolve both.',
    threatens: 'AI CSAT Monitor (weighted 40%)',
    goalLabel: 'CSAT \u2265 4.5',
    linkedTo: 'm1',
    flaggedConvCount: 14,
    investigateCount: 14,
    weight: 40,
    firstSeen: '3 days ago',
  },
  {
    id: 'c3',
    cat: 'criteria',
    metric: 'Cited current policy version when explaining refund decisions',
    monitorName: 'Refund Procedure Adherence',
    monitorKey: 'Procedure',
    monitorId: 'mon_proc',
    sev: 'drift',
    base: 3,
    now: 6,
    unit: '% miss',
    dir: 'up',
    variance: 2,
    head: 'Policy citation misses are growing because agents are still citing the old refund policy — the May 4 update has not been reflected in responses.',
    spark: [3, 3, 4, 4, 5, 5, 6, 6],
    hist: [3, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6, 6],
    why: 'Miss rate doubled from 3% to 6% since May 4. No alert threshold crossed yet, but trending toward it.',
    threatens: 'Refund Procedure Adherence (weighted 30%)',
    goalLabel: 'Procedure \u2265 90%',
    linkedTo: 'm2',
    flaggedConvCount: 14,
    investigateCount: 14,
    weight: 30,
    firstSeen: '7 days ago',
  },
  {
    id: 'c4',
    cat: 'criteria',
    metric: 'AI acknowledged frustration before offering a solution',
    monitorName: 'AICSAT',
    monitorKey: 'AI CSAT',
    monitorId: 'mon_csat',
    sev: 'med',
    base: 6,
    now: 11,
    unit: ' fails',
    dir: 'up',
    variance: 3,
    head: 'Frustration acknowledgment failures are rising because agents are jumping straight to the resolution without first recognizing the customer is frustrated.',
    spark: [6, 5, 6, 7, 8, 9, 11, 11],
    hist: [6, 5, 6, 6, 5, 6, 7, 8, 9, 11, 11, 10, 11, 11],
    why: 'Responses are technically correct but skip the empathy step. Appears in the same conversation set as the Tone failures.',
    threatens: 'AI CSAT Monitor (weighted 10%)',
    goalLabel: 'CSAT \u2265 4.5',
    linkedTo: 'm1',
    flaggedConvCount: 11,
    investigateCount: 11,
    weight: 10,
    firstSeen: '3 days ago',
  },
];

const ANOMALY_BY_ID: Record<string, Anomaly> = STUB_ANOMALIES.reduce(
  (acc, a) => {
    acc[a.id] = a;
    return acc;
  },
  {} as Record<string, Anomaly>,
);

const OPS_METRICS: Record<string, OperationalMetric> = {
  'AI CSAT': {
    label: 'CSAT score (operational)',
    sub: 'avg ticket CSAT, daily',
    vals: [4.5, 4.5, 4.4, 4.5, 4.4, 4.4, 4.3, 4.3, 4.2, 4.2, 4.1, 4.0, 4.0, 3.9],
  },
  Procedure: {
    label: 'Refund-handling AHT (operational)',
    sub: 'avg minutes, daily',
    vals: [4.2, 4.3, 4.2, 4.4, 4.3, 4.5, 4.6, 4.8, 5.0, 5.1, 5.2, 5.3, 5.4, 5.5],
  },
  Escalation: {
    label: 'Tier-2 queue depth (operational)',
    sub: 'avg open tickets, daily',
    vals: [22, 21, 23, 22, 24, 25, 28, 31, 34, 36, 38, 40, 42, 45],
  },
  Repeat: {
    label: 'First-contact resolution',
    sub: 'avg %, daily',
    vals: [78, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 88],
  },
};

Object.assign(window, { ANOMALY_DAYS, STUB_ANOMALIES, ANOMALY_BY_ID, OPS_METRICS });
})();

// ─── cursor/data/lookups.ts ───────────────────────────────
(() => {
const { Anomaly, AnomalySeverity } = window;
const { STUB_ANOMALIES } = window;

const SEV_RANK: Record<AnomalySeverity, number> = {
  high: 0,
  med: 1,
  drift: 2,
  pos: 3,
};

const ANOMALY_BY_CRITERION: Record<string, Anomaly> = STUB_ANOMALIES.reduce(
  (acc, a) => {
    if (a.cat === 'criteria') acc[a.metric] = a;
    return acc;
  },
  {} as Record<string, Anomaly>,
);

const ANOMALIES_BY_MONITOR_ID: Record<string, Anomaly[]> = STUB_ANOMALIES.reduce(
  (acc, a) => {
    if (!a.monitorId) return acc;
    (acc[a.monitorId] = acc[a.monitorId] || []).push(a);
    return acc;
  },
  {} as Record<string, Anomaly[]>,
);

const getRecommendedAnomalyForMonitor = (monitorId: string): Anomaly | undefined => {
  const all = ANOMALIES_BY_MONITOR_ID[monitorId] || [];
  // Prefer criteria anomalies (they appear on the Anomalies tab as rows
  // the user can scroll to). Then sort by severity, then by absolute deviation
  // so the most-deviant anomaly wins as the lead.
  const criteria = all.filter((a) => a.cat === 'criteria');
  const pool = criteria.length ? criteria : all;
  return [...pool].sort((a, b) => {
    const s = SEV_RANK[a.sev] - SEV_RANK[b.sev];
    if (s !== 0) return s;
    const da = Math.abs(a.now - a.base);
    const db = Math.abs(b.now - b.base);
    return db - da;
  })[0];
};

Object.assign(window, { ANOMALY_BY_CRITERION, ANOMALIES_BY_MONITOR_ID, getRecommendedAnomalyForMonitor });
})();

// ─── cursor/data/reviewQueue.ts ───────────────────────────────
(() => {
const { ReviewConversation } = window;

// Real-world flagged failures, mirroring window.K_DATA.flaggedConversations
// from the source AI-Monitoring HTML. Each carries the criteria scores the
// monitor judged it against, plus a transcript so the reviewer can confirm or
// overturn the AI's verdict directly inside the drawer.
const FLAGGED_CONVERSATIONS: ReviewConversation[] = [
  {
    id: 'conv-8821',
    customer: 'Maya Chen',
    customerCompany: 'Acme Co',
    monitor: 'AICSAT',
    monitorId: 'mon_csat',
    score: 41,
    status: 'fail',
    timeAgo: '14 min ago',
    preview: 'Customer asked about coupon eligibility, AI applied without checking order history\u2026',
    criteriaScores: [
      {
        name: 'Response matched what the customer was asking for',
        weight: 20,
        score: 75,
        pass: true,
        source: 'Procedure: Intent Resolution \u00a72.1',
      },
      {
        name: 'Customer got the help they needed during the conversation',
        weight: 35,
        score: 22,
        pass: false,
        essential: true,
        rationale: 'Customer asked twice about return eligibility. AI provided coupon instead.',
        source: 'Outcome \u00b7 intent + closing message',
      },
      {
        name: 'Required return information was included',
        weight: 20,
        score: 80,
        pass: true,
        source: 'KB-RET-001',
      },
      {
        name: 'Closing follow-up offered before ending',
        weight: 25,
        score: 60,
        pass: false,
        rationale: 'No follow-up offered after closing.',
        source: 'Procedure: Conversation Close \u00a73.2',
      },
    ],
    messages: [
      {
        role: 'customer',
        text: 'Hi, I want to return a sweater I bought last month \u2014 it doesn\u2019t fit.',
        time: '2:14pm',
      },
      {
        role: 'ai',
        text: 'I\u2019d be happy to help! Let me see what I can do for you.',
        time: '2:14pm',
      },
      {
        role: 'ai',
        text: 'I\u2019ve applied a 20% off coupon to your account that you can use on a replacement.',
        time: '2:15pm',
      },
      {
        role: 'customer',
        text: 'I don\u2019t want a replacement, I want to return it for a refund.',
        time: '2:15pm',
      },
      {
        role: 'ai',
        text: 'The coupon I sent should help offset the cost! Anything else?',
        time: '2:16pm',
      },
      { role: 'customer', text: 'No, just refund please.', time: '2:16pm' },
    ],
  },
  {
    id: 'conv-8819',
    customer: 'Jordan Park',
    customerCompany: 'Globex Inc',
    monitor: 'Address Change Procedure Adherence',
    monitorId: 'mon_qa',
    score: 44,
    status: 'fail',
    timeAgo: '31 min ago',
    preview: 'Address updated without verify_identity call \u2014 procedural breach on corporate account\u2026',
    criteriaScores: [
      {
        name: 'verify_identity called before updating address',
        weight: 35,
        score: 14,
        pass: false,
        essential: true,
        rationale: 'Address saved before verify_identity was called. Customer had to point out the gap themselves.',
        source: 'Procedure: Address Change \u00a71.2 \u00b7 tool: verify_identity',
      },
      {
        name: 'New address read back to customer before saving',
        weight: 25,
        score: 20,
        pass: false,
        rationale:
          'AI saved the address without reading it back. Customer never confirmed the new address was correct.',
        source: 'Procedure: Address Change \u00a71.4 \u00b7 confirmation step',
      },
      {
        name: 'Confirmation reference provided after address update',
        weight: 20,
        score: 0,
        pass: false,
        rationale: 'No reference number was provided. Conversation transferred to Tier-2 before close.',
        source: 'Procedure: Address Change \u00a71.6 \u00b7 reference_number field',
      },
      {
        name: 'Change verified in customer record before closing',
        weight: 20,
        score: 0,
        pass: false,
        rationale: 'Conversation ended in escalation transfer \u2014 record confirmation step was never reached.',
        source: 'Procedure: Address Change \u00a71.7 \u00b7 record_confirmed signal',
      },
    ],
    messages: [
      {
        role: 'customer',
        text: 'I need to change the shipping address on order #44218 \u2014 moving next week.',
        time: '11:02am',
      },
      {
        role: 'ai',
        text: 'Got it, I can update that for you. The new address is now saved on the order.',
        time: '11:02am',
      },
      {
        role: 'customer',
        text: 'Wait, did you confirm I\u2019m the account owner? You didn\u2019t ask for anything.',
        time: '11:03am',
      },
      {
        role: 'ai',
        text: 'Your account was already authenticated when you opened this chat, so we\u2019re good.',
        time: '11:03am',
      },
      {
        role: 'customer',
        text: 'OK but this is a corporate account with multiple users \u2014 that should still be verified.',
        time: '11:04am',
      },
      {
        role: 'ai',
        text: 'I\u2019ll go ahead and escalate this to a human agent for additional verification.',
        time: '11:04am',
      },
      {
        role: 'system',
        text: 'Conversation transferred to Tier-2 (no context summary attached).',
        time: '11:05am',
      },
    ],
  },
  {
    id: 'conv-8814',
    customer: 'Sam Lee',
    customerCompany: 'Initech',
    monitor: 'Refund Procedure Adherence',
    monitorId: 'mon_proc',
    score: 38,
    status: 'fail',
    timeAgo: '1 hr ago',
    preview: 'Refund issued without eligibility check; AI cited old 30-day policy after the May 4 update\u2026',
    criteriaScores: [
      {
        name: 'Cited current policy version when explaining refund decisions',
        weight: 30,
        score: 12,
        pass: false,
        essential: true,
        rationale:
          'AI quoted the 30-day return window from the pre-May 4 policy. The updated policy extended the window to 45 days for digital purchases. Customer was incorrectly denied.',
        source: 'KB-REF-007 \u00b7 Refund Policy \u00b7 version: May 4 update',
      },
      {
        name: 'Verified refund eligibility before issuing a credit or refund',
        weight: 25,
        score: 18,
        pass: false,
        essential: true,
        rationale: 'No verify_eligibility call was made before the denial. AI went straight to citing policy.',
        source: 'Procedure: Refund Authorization \u00a71.4 \u00b7 tool: verify_eligibility',
      },
      {
        name: 'Refund amount and timeline confirmed to customer before close',
        weight: 25,
        score: 0,
        pass: false,
        rationale: 'Refund was denied, so no confirmation was offered. Close occurred without resolution.',
        source: 'Procedure: Refund Confirmation \u00a72.1',
      },
      {
        name: 'Escalation triggered when customer frustration score exceeded threshold',
        weight: 20,
        score: 72,
        pass: true,
        source: 'Escalation Policy \u00a72.3 \u00b7 field: frustration_score',
      },
    ],
    messages: [
      {
        role: 'customer',
        text: 'I bought a digital download 35 days ago and it stopped working. I want a refund.',
        time: '10:21am',
      },
      {
        role: 'ai',
        text: 'I\u2019m sorry to hear that. Unfortunately, our return window is 30 days, so this purchase is outside the eligible period.',
        time: '10:22am',
      },
      {
        role: 'customer',
        text: 'I was told the policy changed. My colleague got a refund on a 40-day-old purchase last week.',
        time: '10:22am',
      },
      {
        role: 'ai',
        text: 'I understand your concern, but I\u2019m showing the 30-day window in our policy. I\u2019m not able to process this refund.',
        time: '10:23am',
      },
      {
        role: 'customer',
        text: 'This is ridiculous. Can I speak to someone who actually knows the current policy?',
        time: '10:24am',
      },
      {
        role: 'system',
        text: 'Frustration score: 0.82 \u2014 escalation threshold exceeded. Transferring to billing team.',
        time: '10:24am',
      },
    ],
  },
  {
    id: 'conv-8801',
    customer: 'Priya Singh',
    customerCompany: 'Hooli',
    monitor: 'AICSAT',
    monitorId: 'mon_csat',
    score: 52,
    status: 'fail',
    timeAgo: '3 hrs ago',
    preview: 'Customer escalated frustrated, AI did not acknowledge before handoff\u2026',
    // No criteriaScores: triggers the "Per-criterion rationale expired" callout.
    criteriaScores: [],
    messages: [
      {
        role: 'customer',
        text: 'This is the THIRD time I\u2019m contacting you about this billing error. I am DONE.',
        time: '8:47am',
      },
      {
        role: 'ai',
        text: 'I can see your account here. Let me transfer you to a specialist who can help.',
        time: '8:47am',
      },
      {
        role: 'customer',
        text: 'You\u2019re not even going to apologize? I\u2019ve wasted hours on this.',
        time: '8:48am',
      },
      {
        role: 'system',
        text: 'Conversation transferred to billing team.',
        time: '8:48am',
      },
    ],
  },
];

// Synthetic passing-conversation templates from buildReviewQueue() in the source.
// They give the queue a mix of pass + fail so reviewers can label both
// directions \u2014 a passing conversation may still be a bad example.
const PASSING_TEMPLATES: ReviewConversation[] = [
  {
    id: 'conv-8902',
    customer: 'Tara Wells',
    customerCompany: 'Northwind',
    score: 92,
    status: 'pass',
    timeAgo: '8 min ago',
    preview: 'Customer asked about return window. AI confirmed eligibility, offered prepaid label, closed cleanly.',
    criteriaScores: [
      {
        name: 'Customer got the help they needed during the conversation',
        weight: 35,
        score: 95,
        pass: true,
        essential: true,
        source: 'Outcome \u00b7 intent + closing message',
      },
      {
        name: 'Response matched what the customer was asking for',
        weight: 20,
        score: 92,
        pass: true,
        source: 'Procedure: Intent Resolution \u00a72.1',
      },
      {
        name: 'Required return information was included',
        weight: 20,
        score: 90,
        pass: true,
        source: 'KB-RET-001',
      },
      {
        name: 'Closing follow-up offered before ending',
        weight: 25,
        score: 88,
        pass: true,
        source: 'Procedure: Conversation Close \u00a73.2',
      },
    ],
    messages: [
      {
        role: 'customer',
        text: 'Can I still return my order from last week?',
        time: '9:02am',
      },
      {
        role: 'ai',
        text: 'Yes \u2014 you\u2019re inside the 30-day window. Want me to email a prepaid return label?',
        time: '9:02am',
      },
      { role: 'customer', text: 'Yes please.', time: '9:03am' },
      {
        role: 'ai',
        text: 'Sent. You should see it in your inbox shortly. Anything else I can help with?',
        time: '9:03am',
      },
      { role: 'customer', text: 'Nope, thanks!', time: '9:04am' },
    ],
  },
  {
    id: 'conv-8895',
    customer: 'Marcus Reed',
    customerCompany: 'Wayne Co',
    score: 84,
    status: 'pass',
    timeAgo: '22 min ago',
    preview: 'Order tracking question \u2014 AI fetched status, gave ETA. Customer satisfied, no follow-up needed.',
    criteriaScores: [
      {
        name: 'Customer got the help they needed during the conversation',
        weight: 35,
        score: 88,
        pass: true,
        essential: true,
        source: 'Outcome \u00b7 intent + closing message',
      },
      {
        name: 'Response matched what the customer was asking for',
        weight: 20,
        score: 90,
        pass: true,
        source: 'Procedure: Intent Resolution \u00a72.1',
      },
      {
        name: 'Required return information was included',
        weight: 20,
        score: 95,
        pass: true,
        source: 'KB-RET-001 \u00b7 not applicable here',
      },
      {
        name: 'Closing follow-up offered before ending',
        weight: 25,
        score: 62,
        pass: false,
        rationale: 'Customer reply \u201cok\u201d not acknowledged before close \u2014 borderline.',
        source: 'Procedure: Conversation Close \u00a73.2',
      },
    ],
    messages: [
      { role: 'customer', text: 'Where\u2019s my package?', time: '11:14am' },
      {
        role: 'ai',
        text: 'Your order #4421 is out for delivery \u2014 ETA today between 2\u20136pm.',
        time: '11:14am',
      },
      { role: 'customer', text: 'ok', time: '11:15am' },
    ],
  },
  {
    id: 'conv-8888',
    customer: 'Lin Hayes',
    customerCompany: 'Stark Industries',
    score: 76,
    status: 'pass',
    timeAgo: '45 min ago',
    preview:
      'Refund processed without confirming bank account on file \u2014 passed criteria but customer flagged later.',
    criteriaScores: [
      {
        name: 'Customer got the help they needed during the conversation',
        weight: 35,
        score: 84,
        pass: true,
        essential: true,
        source: 'Outcome \u00b7 intent + closing message',
      },
      {
        name: 'Response matched what the customer was asking for',
        weight: 20,
        score: 80,
        pass: true,
        source: 'Procedure: Intent Resolution \u00a72.1',
      },
      {
        name: 'Refund issued only after verify_identity tool call',
        weight: 25,
        score: 38,
        pass: false,
        rationale: 'No verify_identity call before issuing refund \u2014 procedural breach despite passing overall.',
        source: 'Procedure: Refund Authorization \u00a71.4 \u00b7 tool: verify_identity',
      },
      {
        name: 'Closing follow-up offered before ending',
        weight: 20,
        score: 75,
        pass: true,
        source: 'Procedure: Conversation Close \u00a73.2',
      },
    ],
    messages: [
      {
        role: 'customer',
        text: 'Need a refund on order 8821',
        time: '10:21am',
      },
      {
        role: 'ai',
        text: 'Refund of $48.20 processed to your card ending in 4421.',
        time: '10:22am',
      },
      {
        role: 'customer',
        text: 'Wait, I changed cards last month.',
        time: '10:22am',
      },
    ],
  },
];

// Mirror buildReviewQueue() in the source: 2 failing + 3 passing + the rest of
// the failing tail. Reviewers see a mix of directions so they can label both
// false positives and false negatives.
const buildReviewQueue = (monitorId: string): ReviewConversation[] => {
  const failing = FLAGGED_CONVERSATIONS.filter((c) => c.monitorId === monitorId);
  return [...failing.slice(0, 2), ...PASSING_TEMPLATES.slice(0, 3), ...failing.slice(2)];
};

Object.assign(window, { FLAGGED_CONVERSATIONS, buildReviewQueue });
})();

// ─── cursor/data/monitors.ts ───────────────────────────────
(() => {
const { Monitor, Goal } = window;

const STUB_GOALS: Goal[] = [
  { id: 'goal_csat', name: 'Increase CSAT', description: '' },
  { id: 'goal_sentiment', name: 'Improve customer sentiment', description: '' },
  { id: 'goal_retention', name: 'Improve net retention in european market', description: '' },
  { id: 'goal_cost', name: 'Reduce AI cost per conversation', description: '' },
];

const STUB_MONITORS: Monitor[] = [
  {
    id: 'mon_csat',
    name: 'AICSAT',
    description:
      'Tracks the daily average AI-CSAT score across all AI agent conversations, derived from four scored sub-criteria: response time, resolution quality, tone, and KB accuracy.',
    isDefault: true,
    kind: 'aic',
    metricKind: 'csat_avg',
    metricLabel: 'Daily AI-CSAT average',
    metricUnit: '/ 5',
    evals30d: 4218,
    // 30-day daily average CSAT derived from sub-criteria, declining from 4.1 to 3.6
    trend: [
      4.1, 4.1, 4.0, 4.1, 4.0, 4.0, 4.0, 3.9, 3.9, 3.9, 3.9, 3.8, 3.8, 3.8, 3.8, 3.8, 3.7, 3.7, 3.7, 3.7, 3.7, 3.6, 3.6,
      3.7, 3.6, 3.6, 3.6, 3.6, 3.6, 3.6,
    ],
    criteria: [
      {
        name: 'Responded quickly and efficiently',
        weight: 25,
        essential: false,
        pass: 78,
        source: 'Telemetry \u00b7 response_latency_score + turn_count',
        baseline: 4.2,
        criterionThreshold: 3.5,
        unit: '/ 5',
        inlineRubric: {
          name: 'Response Time Rubric',
          bands: [
            {
              lo: 1.0,
              hi: 2.9,
              passing: false,
              text: 'AI asked 4+ clarifying questions before reaching an answer, or failed to respond within a reasonable turn window. Customer had to repeat their request. Conversation feels circular \u2014 there is no momentum toward resolution.',
            },
            {
              lo: 3.0,
              hi: 3.4,
              passing: false,
              text: 'Response came eventually but required 3 clarifying questions or an unnecessary re-statement of context. Customer showed signs of impatience. Below the 3.5 floor \u2014 not acceptable for routine queries.',
            },
            {
              lo: 3.5,
              hi: 4.2,
              passing: true,
              text: 'AI answered within 1\u20132 clarifying questions or none at all. Response was timely and moved the conversation forward without unnecessary friction. Meets the minimum efficiency bar.',
            },
            {
              lo: 4.3,
              hi: 5.0,
              passing: true,
              text: 'AI answered directly on the first or second turn with no clarifying questions needed. Response matched intent immediately. Customer experienced no friction or delay. Above the 4.2 baseline.',
            },
          ],
        },
      },
      {
        name: 'Customer got the help they needed',
        weight: 30,
        essential: true,
        pass: 67,
        source: 'Outcome \u00b7 customer_intent_resolved + closing_message_signal',
        baseline: 3.8,
        criterionThreshold: 3.0,
        unit: '/ 5',
        inlineRubric: {
          name: 'Resolution Rubric',
          bands: [
            {
              lo: 1.0,
              hi: 2.4,
              passing: false,
              text: 'Customer\u2019s core issue was not addressed. The AI either misread the intent or closed the conversation before any resolution attempt. Strong signal of repeat contact.',
            },
            {
              lo: 2.5,
              hi: 2.9,
              passing: false,
              text: 'AI acknowledged the issue but did not resolve it. Provided partial information or a scripted deflection. Intent-resolved signal was absent at close. Below the 3.0 threshold.',
            },
            {
              lo: 3.0,
              hi: 3.8,
              passing: true,
              text: 'Customer\u2019s stated need was addressed. Intent-resolved signal was present at close. Some residual friction, but the core problem was solved. Meets the minimum resolution bar.',
            },
            {
              lo: 3.9,
              hi: 5.0,
              passing: true,
              text: 'Customer confirmed resolution explicitly. AI offered additional help before ending. No follow-up contact expected. Above the 3.8 baseline \u2014 this is the target outcome.',
            },
          ],
        },
      },
      {
        name: 'Tone matched the customer\u2019s emotional state',
        weight: 25,
        essential: false,
        pass: 52,
        source: 'Rubric: Empathy \u00b7 tone calibration signal',
        baseline: 3.9,
        criterionThreshold: 3.1,
        unit: '/ 5',
        inlineRubric: {
          name: 'Tone Rubric',
          bands: [
            {
              lo: 1.0,
              hi: 2.4,
              passing: false,
              text: 'AI response was mismatched to the customer\u2019s emotional state in a way that made the situation worse \u2014 clinical or robotic on a clearly upset customer, or over-empathetic on a simple transactional query.',
            },
            {
              lo: 2.5,
              hi: 3.0,
              passing: false,
              text: 'Some attempt at tone calibration but it fell short. Generic empathy phrase without reflecting the actual situation, or tone switched midway. Below the 3.1 floor \u2014 noticeable mismatch.',
            },
            {
              lo: 3.1,
              hi: 3.9,
              passing: true,
              text: 'Tone was appropriate and did not create friction. AI acknowledged emotional state before moving to resolution on charged conversations, and was concise on straightforward ones. Meets the threshold.',
            },
            {
              lo: 4.0,
              hi: 5.0,
              passing: true,
              text: 'AI demonstrated clear, natural tone calibration throughout. On frustration, it validated before solving. On simple queries, it was efficient without being cold. Above the 3.9 baseline.',
            },
          ],
        },
      },
      {
        name: 'Information cited was accurate and current',
        weight: 20,
        essential: false,
        pass: 76,
        source: 'KB index \u00b7 cited_version vs current_version',
        baseline: 4.1,
        criterionThreshold: 3.2,
        unit: '/ 5',
        inlineRubric: {
          name: 'KB Accuracy Rubric',
          bands: [
            {
              lo: 1.0,
              hi: 2.4,
              passing: false,
              text: 'AI cited incorrect, hallucinated, or clearly outdated information. The guidance given could cause the customer to take the wrong action. High risk of brand or regulatory damage.',
            },
            {
              lo: 2.5,
              hi: 3.1,
              passing: false,
              text: 'Information cited was mostly real but contained at least one outdated version reference or was applied to the wrong scenario. Customer may have been misled. Below the 3.2 threshold.',
            },
            {
              lo: 3.2,
              hi: 4.1,
              passing: true,
              text: 'AI cited accurate, current information applicable to the customer\u2019s situation. No hallucinations or outdated references. Meets the accuracy floor. Minor gaps possible but nothing misleading.',
            },
            {
              lo: 4.2,
              hi: 5.0,
              passing: true,
              text: 'AI cited the exact, most current version of the relevant KB article and applied it precisely. No inaccuracies, no outdated references. Above the 4.1 baseline \u2014 exemplary knowledge retrieval.',
            },
          ],
        },
      },
    ],
    contextProfile: ['messages', 'kb', 'traces'],
    writesField: 'ai_generated_csat',
    goalIds: ['goal_csat'],
    alerting: { enabled: true, cadence: 'daily', channels: ['email', 'in_app'] },
    suggestionsEnabled: true,
    passingScore: 70,
    sparkEvents: [
      { idx: 12, kind: 'criteria', label: 'Tone and Resolution criteria rebalanced' },
      { idx: 19, kind: 'examples', label: '12 ground truth examples added for refund-denial conversations' },
    ],
    editLog: [
      {
        date: 'May 4',
        who: 'J. Chin',
        change: 'Rebalanced weights: Resolution raised to 30%, KB accuracy lowered to 20%',
      },
      { date: 'May 9', who: 'J. Chin', change: 'Added 12 ground truth examples for refund-denial conversations' },
    ],
  },
  {
    id: 'mon_proc',
    name: 'Refund Procedure Adherence',
    description:
      'Checks that the AI followed the correct refund procedure \u2014 citing the current policy, verifying eligibility, confirming the outcome, and escalating when needed.',
    isDefault: false,
    kind: 'aic',
    metricKind: 'qa_score',
    metricLabel: 'QA score',
    metricUnit: '/ 100',
    evals30d: 3104,
    // 30-day daily adherence %, declining from 92% to 82%
    trend: [
      92, 92, 93, 92, 92, 91, 91, 91, 90, 90, 90, 89, 89, 89, 88, 88, 88, 87, 87, 87, 86, 86, 86, 85, 85, 84, 84, 83,
      83, 82,
    ],
    criteria: [
      {
        name: 'Cited current policy version when explaining refund decisions',
        weight: 30,
        essential: true,
        pass: 61,
        source: 'KB-REF-007 \u00b7 Refund Policy \u00b7 version: May 4 update',
      },
      {
        name: 'Verified refund eligibility before issuing a credit or refund',
        weight: 25,
        essential: true,
        pass: 68,
        source: 'Procedure: Refund Authorization \u00a71.4 \u00b7 tool: verify_eligibility',
      },
      {
        name: 'Refund amount and timeline confirmed to customer before close',
        weight: 25,
        essential: false,
        pass: 74,
        source: 'Procedure: Refund Confirmation \u00a72.1 \u00b7 closing message signal',
      },
      {
        name: 'Escalation triggered when customer frustration score exceeded threshold',
        weight: 20,
        essential: false,
        pass: 61,
        source: 'Escalation Policy \u00a72.3 \u00b7 field: frustration_score',
      },
    ],
    contextProfile: ['messages', 'traces', 'kb'],
    writesField: 'procedure_adherence_score',
    goalIds: ['goal_cost'],
    alerting: { enabled: true, cadence: 'hourly', channels: ['email', 'in_app'] },
    suggestionsEnabled: true,
    passingScore: 85,
    sparkEvents: [
      { idx: 10, kind: 'criteria', label: 'Policy citation criterion added' },
      { idx: 22, kind: 'examples', label: '6 ground truth examples added for address-change failures' },
    ],
    editLog: [
      { date: 'Apr 18', who: 'M. Torres', change: 'Created monitor; initial 4 procedure criteria added' },
      {
        date: 'May 4',
        who: 'System',
        change: 'Policy doc KB-REF-007 updated — cited-policy criterion now flagging drift',
      },
      { date: 'May 6', who: 'J. Chin', change: 'Added Cited current policy version criterion, rebalanced weights' },
    ],
  },
  {
    id: 'mon_qa',
    name: 'Address Change Procedure Adherence',
    description:
      'Checks that the AI correctly followed the address change procedure — verifying identity, reading back the new address, providing a confirmation reference, and closing only after the change is confirmed in the customer record.',
    isDefault: false,
    kind: 'aic',
    metricKind: 'qa_score',
    metricLabel: 'QA score',
    metricUnit: '/ 100',
    evals30d: 2640,
    // 30-day QA scores, stable in 72–78 range
    trend: [
      74, 75, 74, 76, 75, 74, 75, 76, 75, 76, 77, 76, 77, 77, 76, 75, 76, 77, 76, 77, 78, 77, 78, 77, 78, 77, 78, 78,
      77, 78,
    ],
    criteria: [
      {
        name: 'verify_identity called before updating address',
        weight: 35,
        essential: true,
        pass: 71,
        source: 'Procedure: Address Change \u00a71.2 \u00b7 tool: verify_identity',
      },
      {
        name: 'New address read back to customer before saving',
        weight: 25,
        essential: false,
        pass: 84,
        source: 'Procedure: Address Change \u00a71.4 \u00b7 confirmation step',
      },
      {
        name: 'Confirmation reference provided after address update',
        weight: 20,
        essential: false,
        pass: 88,
        source: 'Procedure: Address Change \u00a71.6 \u00b7 reference_number field',
      },
      {
        name: 'Change verified in customer record before closing',
        weight: 20,
        essential: false,
        pass: 79,
        source: 'Procedure: Address Change \u00a71.7 \u00b7 record_confirmed signal',
      },
    ],
    contextProfile: ['messages', 'traces', 'customer'],
    writesField: 'address_change_adherence_score',
    goalIds: ['goal_cost'],
    alerting: { enabled: false, cadence: 'daily', channels: [] },
    suggestionsEnabled: true,
    passingScore: 80,
    editLog: [{ date: 'May 10', who: 'J. Chin', change: 'Created monitor for address change procedure adherence' }],
  },
  {
    id: 'mon_esc',
    name: 'Escalation Handoff Quality',
    description:
      'Checks that when the AI hands a conversation off to a human, it does so at the right moment, with a clear summary, the customer\u2019s verified context, and any pending actions noted — so the agent can pick up without restarting the conversation.',
    isDefault: false,
    kind: 'aic',
    metricKind: 'qa_score',
    metricLabel: 'QA score',
    metricUnit: '/ 100',
    evals30d: 1820,
    // 30-day QA scores, gradual decline 82 → 74
    trend: [
      82, 82, 81, 82, 81, 80, 81, 80, 80, 79, 80, 79, 78, 79, 78, 77, 78, 77, 76, 77, 76, 75, 76, 75, 75, 74, 75, 74,
      74, 74,
    ],
    criteria: [
      {
        name: 'Handoff triggered before customer asked twice',
        weight: 30,
        essential: true,
        pass: 68,
        source: 'Procedure: Escalation \u00a72.1 \u00b7 signal: repeat_request',
      },
      {
        name: 'Summary of conversation included in handoff note',
        weight: 25,
        essential: true,
        pass: 81,
        source: 'Procedure: Escalation \u00a72.3 \u00b7 tool: handoff_summary',
      },
      {
        name: 'Verified customer identity passed to agent',
        weight: 25,
        essential: false,
        pass: 86,
        source: 'Procedure: Escalation \u00a72.4 \u00b7 tool: verify_identity',
      },
      {
        name: 'Pending actions and promises flagged in note',
        weight: 20,
        essential: false,
        pass: 73,
        source: 'Procedure: Escalation \u00a72.5 \u00b7 promises_pending field',
      },
    ],
    contextProfile: ['messages', 'traces', 'customer'],
    writesField: 'escalation_handoff_score',
    goalIds: ['goal_csat'],
    alerting: { enabled: true, cadence: 'daily', channels: ['in_app'] },
    suggestionsEnabled: true,
    passingScore: 80,
    editLog: [
      { date: 'Apr 28', who: 'J. Chin', change: 'Created monitor to catch late/unclear handoffs from AI to human agents' },
      { date: 'May 12', who: 'System', change: 'Pending-actions criterion drift detected — added to anomalies feed' },
    ],
  },
];

Object.assign(window, { STUB_GOALS, STUB_MONITORS });
})();

// ─── cursor/components/Drawer/useViewportWidth.ts ───────────────────────────────
(() => {
const { useEffect, useState } = React;

const useViewportWidth = () => {
  const [vw, setVw] = useState(() => window.innerWidth);
  useEffect(() => {
    const handler = () => setVw(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return vw;
};

/* export default useViewportWidth */
Object.assign(window, { useViewportWidth });
})();

// ─── cursor/components/Drawer/useElementWidth.ts ───────────────────────────────
(() => {
const { useState, useEffect, RefObject } = React;

const useElementWidth = (ref: RefObject<HTMLElement | null>) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, [ref]);
  return width;
};

/* export default useElementWidth */
Object.assign(window, { useElementWidth });
})();

// ─── cursor/components/Drawer/Drawer.tsx ───────────────────────────────
(() => {
const { useEffect, useState } = React;

const useViewportWidth = window.useViewportWidth;

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Drawer = ({ open, onClose, children }: DrawerProps) => {
  const vw = useViewportWidth();
  const drawerWidth = vw < 400 ? '100vw' : vw < 720 ? '90vw' : '67vw';
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setVisible(true), 10);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
    return undefined;
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 38, 0.4)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 240ms ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: drawerWidth,
          background: '#fff',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 30px rgba(15,30,55,0.15)',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
        }}
      >
        {children}
      </div>
    </>
  );
};

/* export default Drawer */
Object.assign(window, { Drawer });
})();

// ─── cursor/components/Sparkline/Sparkline.tsx ───────────────────────────────
(() => {
interface SparklineProps {
  data: number[];
  w?: number;
  h?: number;
  color?: string;
  fill?: boolean;
}

const Sparkline = ({ data, w = 110, h = 32, color = '#005BD8', fill = true }: SparklineProps) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={w} height={h} style={{ display: 'block' }}>
      {fill && <path d={`${d} L ${w} ${h} L 0 ${h} Z`} fill={color} opacity="0.10" />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
};

/* export default Sparkline */
Object.assign(window, { Sparkline });
})();

// ─── cursor/components/BandChart/BandChart.tsx ───────────────────────────────
(() => {
interface BandChartProps {
  data: number[];
  baseline: number;
  variance: number;
  currentVar: number;
  w?: number;
  h?: number;
}

const BandChart = ({ data, baseline, variance, currentVar, w = 720, h = 200 }: BandChartProps) => {
  const padX = 28;
  const padY = 22;
  const W = w - padX * 2;
  const H = h - padY * 2;
  const max = Math.max(...data, baseline + Math.max(variance, currentVar) + 4);
  const min = Math.min(...data, baseline - Math.max(variance, currentVar) - 4);
  const y = (v: number) => padY + H - ((v - min) / (max - min || 1)) * H;
  const x = (i: number) => padX + (W / (data.length - 1)) * i;
  const linePts = data.map((v, i) => [x(i), y(v)] as const);
  const linePath = linePts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const crossings = data.map((v, i) => (Math.abs(v - baseline) > currentVar ? i : -1)).filter((i) => i >= 0);

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <rect x={0} y={0} width={w} height={h} fill="#FAFBFE" />
      {/* Current band */}
      <rect
        x={padX}
        y={y(baseline + variance)}
        width={W}
        height={Math.max(0, y(baseline - variance) - y(baseline + variance))}
        fill="none"
        stroke="var(--gray-50)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />
      {/* Proposed band */}
      <rect
        x={padX}
        y={y(baseline + currentVar)}
        width={W}
        height={Math.max(0, y(baseline - currentVar) - y(baseline + currentVar))}
        fill="rgba(252,237,146,0.35)"
        stroke="var(--yellow-100)"
        strokeWidth="1"
      />
      {/* Baseline */}
      <line
        x1={padX}
        y1={y(baseline)}
        x2={w - padX}
        y2={y(baseline)}
        stroke="var(--gray-90)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <text x={w - padX} y={y(baseline) - 4} textAnchor="end" fontSize="10" fill="var(--gray-95)" fontFamily="Inter">
        baseline {baseline}
      </text>
      <path d={linePath} fill="none" stroke="var(--gray-130)" strokeWidth="1.6" />
      {linePts.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r={crossings.includes(i) ? 4.5 : 2.5}
          fill={crossings.includes(i) ? '#9E181E' : '#fff'}
          stroke="var(--gray-130)"
          strokeWidth="1.4"
        />
      ))}
      <text x={padX} y={padY - 8} fontSize="11" fill="var(--gray-115)" fontFamily="Inter" fontWeight="600">
        {crossings.length} day{crossings.length === 1 ? '' : 's'} would have alerted at \u00b1
        {currentVar}
      </text>
    </svg>
  );
};

interface ClusterBandChartProps {
  data: number[];
  baseline: number;
  threshold: number;
  w?: number;
  h?: number;
}

const ClusterBandChart = ({ data, baseline, threshold, w = 720, h = 200 }: ClusterBandChartProps) => {
  const padX = 28;
  const padY = 22;
  const W = w - padX * 2;
  const H = h - padY * 2;
  const max = Math.max(...data, threshold + 5);
  const barW = W / data.length - 4;
  const y = (v: number) => padY + H - (v / (max || 1)) * H;
  const overCount = data.filter((v) => v >= threshold).length;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ display: 'block' }}>
      <rect x={0} y={0} width={w} height={h} fill="#FAFBFE" />
      <rect
        x={padX}
        y={padY}
        width={W}
        height={Math.max(0, y(threshold) - padY)}
        fill="rgba(252,237,146,0.30)"
        stroke="var(--yellow-100)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      <line
        x1={padX}
        y1={y(baseline)}
        x2={w - padX}
        y2={y(baseline)}
        stroke="var(--gray-90)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />
      <text x={w - padX} y={y(baseline) - 3} textAnchor="end" fontSize="10" fill="var(--gray-95)" fontFamily="Inter">
        baseline ~{baseline}/day
      </text>
      <line x1={padX} y1={y(threshold)} x2={w - padX} y2={y(threshold)} stroke="var(--yellow-110)" strokeWidth="1.6" />
      <text
        x={w - padX}
        y={y(threshold) - 4}
        textAnchor="end"
        fontSize="11"
        fill="var(--yellow-110)"
        fontFamily="Inter"
        fontWeight="600"
      >
        threshold {'\u2265'} {threshold}/day
      </text>
      {data.map((v, i) => {
        const cx = padX + (W / data.length) * i + 2;
        const over = v >= threshold;
        return (
          <rect
            key={i}
            x={cx}
            y={y(v)}
            width={barW}
            height={Math.max(0, padY + H - y(v))}
            fill={over ? '#9E181E' : 'var(--gray-25)'}
            stroke={over ? '#9E181E' : 'var(--gray-50)'}
            strokeWidth="1"
          />
        );
      })}
      <text x={padX} y={padY - 8} fontSize="11" fill="var(--gray-115)" fontFamily="Inter" fontWeight="600">
        {overCount} day{overCount === 1 ? '' : 's'} would have alerted at {'\u2265'} {threshold}
      </text>
    </svg>
  );
};

Object.assign(window, { BandChart, ClusterBandChart });
})();

// ─── cursor/components/NeighborhoodHeatmap/NeighborhoodHeatmap.tsx ───────────────────────────────
(() => {
const { Fragment } = React;

const { Anomaly } = window;
const { ANOMALY_BY_ID, ANOMALY_DAYS, OPS_METRICS, STUB_ANOMALIES } = window;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type DirHint = 'good' | 'bad';

interface HeatmapRow {
  section: string;
  label: string;
  sub: string;
  vals: number[];
  focal?: boolean;
  anomId?: string;
  dirHint: DirHint;
}

const heatStyle = (vals: number[], i: number, dirHint: DirHint): { background: string; color: string } => {
  const base = vals.slice(0, 6).reduce((a, b) => a + b, 0) / 6 || 0.5;
  const v = vals[i];
  const ratio = (v - base) / Math.max(Math.abs(base), 0.5);
  const a = Math.abs(ratio);
  let bg = '#FAFBFE';
  let color = 'var(--gray-115)';
  const upIsBad = dirHint !== 'good';
  if (a >= 0.1) {
    if ((ratio > 0 && upIsBad) || (ratio < 0 && !upIsBad)) {
      if (a > 1.5) {
        bg = '#9E181E';
        color = '#fff';
      } else if (a > 0.6) {
        bg = '#E21325';
        color = '#fff';
      } else if (a > 0.3) {
        bg = '#FFAAAD';
        color = '#7A1518';
      } else if (a > 0.15) {
        bg = '#FFD0D2';
        color = '#7A1518';
      } else {
        bg = '#FFE8E9';
        color = '#7A1518';
      }
    } else if (a > 0.3) {
      bg = '#15803D';
      color = '#fff';
    } else if (a > 0.15) {
      bg = '#B7E0C1';
      color = '#0F4C24';
    } else {
      bg = '#E8F6EC';
      color = '#0F4C24';
    }
  }
  return { background: bg, color };
};

interface NeighborhoodHeatmapProps {
  focal: Anomaly;
  onJump?: (a: Anomaly) => void;
  focalOnly?: boolean;
}

const NeighborhoodHeatmap = ({ focal, onJump, focalOnly }: NeighborhoodHeatmapProps) => {
  const rows: HeatmapRow[] = [];
  rows.push({
    section: 'Focal',
    label: focal.metric,
    sub: focal.cat === 'monitor' ? 'monitor headline' : 'criterion',
    vals: focal.hist,
    focal: true,
    dirHint: focal.cat === 'monitor' && focal.dir === 'down' ? 'good' : 'bad',
  });

  if (
    !focalOnly &&
    focal.linkedTo &&
    ANOMALY_BY_ID[focal.linkedTo] &&
    ANOMALY_BY_ID[focal.linkedTo].cat !== 'monitor'
  ) {
    const l = ANOMALY_BY_ID[focal.linkedTo];
    rows.push({
      section: l.cat === 'monitor' ? 'Linked monitor' : 'Linked criteria cluster',
      label: l.metric,
      sub: l.cat === 'monitor' ? 'monitor headline' : 'criterion',
      vals: l.hist,
      anomId: l.id,
      dirHint: l.cat === 'monitor' && l.dir === 'down' ? 'good' : 'bad',
    });
  }

  if (!focalOnly) {
    const siblings = STUB_ANOMALIES.filter(
      (x) => x.cat === 'criteria' && x.monitorKey === focal.monitorKey && x.id !== focal.id && x.id !== focal.linkedTo,
    );
    siblings.forEach((s) => {
      rows.push({
        section: `Sibling criteria \u00b7 ${focal.monitorName}`,
        label: s.metric,
        sub: `criterion \u00b7 weight ${s.weight ?? '?'}%`,
        vals: s.hist,
        anomId: s.id,
        dirHint: 'bad',
      });
    });

    const op = OPS_METRICS[focal.monitorKey] || OPS_METRICS['AI CSAT'];
    const opDir: DirHint = focal.monitorKey === 'Repeat' ? 'good' : focal.monitorKey === 'AI CSAT' ? 'good' : 'bad';
    rows.push({
      section: 'Operational nearby',
      label: op.label,
      sub: op.sub,
      vals: op.vals,
      dirHint: opDir,
    });
  }

  const sections = Array.from(new Set(rows.map((r) => r.section)));
  const colTpl = `260px repeat(${ANOMALY_DAYS.length}, minmax(36px, 1fr))`;

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid var(--gray-30)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: colTpl, fontFamily: FF }}>
        <div
          style={{
            padding: '10px 14px',
            background: 'var(--gray-15)',
            borderBottom: '1px solid var(--gray-30)',
            borderRight: '1px solid var(--gray-30)',
            fontSize: 10,
            fontWeight: 600,
            color: 'var(--gray-90)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Metric / criterion
        </div>
        {ANOMALY_DAYS.map((d, i) => (
          <div
            key={d}
            style={{
              padding: '8px 0',
              textAlign: 'center',
              background: 'var(--gray-15)',
              borderBottom: '1px solid var(--gray-30)',
              borderRight: i === ANOMALY_DAYS.length - 1 ? 'none' : '1px solid var(--gray-25)',
              fontSize: 10,
              color: i === ANOMALY_DAYS.length - 1 ? 'var(--gray-130)' : 'var(--gray-90)',
              fontWeight: i === ANOMALY_DAYS.length - 1 ? 700 : 500,
              fontFamily: MONO,
            }}
          >
            {d}
          </div>
        ))}

        {sections.map((sec) => (
          <Fragment key={sec}>
            <div
              style={{
                gridColumn: '1 / -1',
                padding: '8px 14px',
                background: 'var(--gray-150)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                fontFamily: FF,
              }}
            >
              {sec}
            </div>
            {rows
              .filter((r) => r.section === sec)
              .map((r, i) => (
                <Fragment key={`${sec}-${i}`}>
                  <div
                    style={{
                      padding: '10px 14px',
                      background: r.focal ? 'var(--yellow-15)' : '#fff',
                      borderBottom: '1px solid var(--gray-25)',
                      borderRight: '1px solid var(--gray-30)',
                    }}
                  >
                    {r.anomId && onJump ? (
                      <button
                        type="button"
                        onClick={() => onJump(ANOMALY_BY_ID[r.anomId as string])}
                        style={{
                          background: 'none',
                          border: 0,
                          padding: 0,
                          cursor: 'pointer',
                          textAlign: 'left',
                          fontFamily: FF,
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--blue-90)',
                          letterSpacing: '-0.005em',
                          textDecoration: 'underline',
                          textDecorationColor: 'var(--blue-25)',
                          textUnderlineOffset: 3,
                        }}
                      >
                        {r.label} \u2192
                      </button>
                    ) : (
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: 'var(--gray-130)',
                          letterSpacing: '-0.005em',
                        }}
                      >
                        {r.label}
                      </div>
                    )}
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: 'var(--gray-85)',
                        marginTop: 2,
                        letterSpacing: '0.02em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {r.sub}
                    </div>
                  </div>
                  {r.vals.map((v, j) => {
                    const st = heatStyle(r.vals, j, r.dirHint);
                    return (
                      <div
                        key={j}
                        style={{
                          ...st,
                          padding: '10px 0',
                          textAlign: 'center',
                          fontSize: 11,
                          fontWeight: 600,
                          fontFamily: MONO,
                          borderBottom: '1px solid var(--gray-25)',
                          borderRight: j === r.vals.length - 1 ? 'none' : '1px solid var(--gray-25)',
                        }}
                      >
                        {typeof v === 'number' ? (Number.isInteger(v) ? v : v.toFixed(1)) : v}
                      </div>
                    );
                  })}
                </Fragment>
              ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

/* export default NeighborhoodHeatmap */
Object.assign(window, { NeighborhoodHeatmap });
})();

// ─── cursor/components/RubricRefEditor/index.tsx ───────────────────────────────
(() => {
const { useState, useEffect, useRef } = React;

const { REF_LIB, REF_TYPE_META } = window;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const BORDER = '#dce0e9';

interface RubricRefEditorProps {
  refs: RubricRef[];
  onChange: (next: RubricRef[]) => void;
  onWriteRubric?: () => void;
  onClickRubricRef?: () => void;
}

const RubricRefEditor = ({ refs, onChange, onWriteRubric, onClickRubricRef }: RubricRefEditorProps) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return undefined;
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && e.target instanceof Node && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const m = query.match(/^\/(kb|tool|procedure)?:?(.*)$/i);
  const ns = m && m[1] ? (m[1].toLowerCase() as RubricRefType) : null;
  const filter = (m ? m[2] : query).toLowerCase().trim();
  const namespaces: RubricRefType[] = ns ? [ns] : ['kb', 'tool', 'procedure'];

  const suggestions: { type: RubricRefType; slug: string; label: string }[] = [];
  namespaces.forEach((type) => {
    REF_LIB[type].forEach((item) => {
      if (refs.some((r) => r.type === type && r.slug === item.slug)) return;
      const hay = `${item.slug} ${item.label}`.toLowerCase();
      if (!filter || hay.includes(filter)) suggestions.push({ type, slug: item.slug, label: item.label });
    });
  });
  const top = suggestions.slice(0, 6);

  const add = (s: { type: RubricRefType; slug: string }) => {
    onChange([...refs, { type: s.type, slug: s.slug }]);
    setQuery('');
    setOpen(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };
  const remove = (idx: number) => onChange(refs.filter((_, i) => i !== idx));

  return (
    <div
      ref={containerRef}
      style={{
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px dashed #E8EBF0',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
        <span
          style={{
            font: '500 10px/14px Inter,sans-serif',
            color: '#8A94A6',
            textTransform: 'uppercase',
            letterSpacing: 0.4,
            marginRight: 4,
          }}
        >
          Related guidance
        </span>
        {refs.map((r, idx) => {
          const meta = REF_TYPE_META[r.type] || REF_TYPE_META.kb;
          const isRubric = r.type === 'rubric';
          return (
            <span
              key={`${r.type}:${r.slug}:${idx}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '2px 4px 2px 8px',
                background: meta.bg,
                border: `1px solid ${meta.border}`,
                borderRadius: 5,
                font: '600 11px/14px ui-monospace,SFMono-Regular,monospace',
                color: meta.color,
              }}
            >
              {isRubric && onClickRubricRef ? (
                <button
                  type="button"
                  onClick={onClickRubricRef}
                  title={`View rubric: ${r.slug}`}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                    font: '600 11px/14px ui-monospace,SFMono-Regular,monospace',
                    color: meta.color,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span style={{ opacity: 0.75 }}>/{meta.label}:</span>
                  {r.slug}
                  <span style={{ fontSize: 9, opacity: 0.75 }}>↗</span>
                </button>
              ) : (
                <>
                  <span style={{ opacity: 0.75 }}>/{meta.label}:</span>
                  {r.slug}
                </>
              )}
              <button
                type="button"
                onClick={() => remove(idx)}
                title="Remove"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 3px',
                  color: meta.color,
                  opacity: 0.6,
                  fontSize: 13,
                  lineHeight: 1,
                }}
              >
                ×
              </button>
            </span>
          );
        })}
        <div style={{ position: 'relative' }}>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            placeholder={refs.length ? 'Search for guidance…' : 'Search for guidance, tools, or procedures'}
            style={{
              padding: '3px 8px',
              borderRadius: 5,
              border: '1px dashed #DCE0E9',
              font: '500 11px/14px ui-monospace,SFMono-Regular,monospace',
              color: '#5A6478',
              outline: 'none',
              background: '#fff',
              minWidth: refs.length ? 140 : 240,
              fontFamily: 'ui-monospace,SFMono-Regular,monospace',
            }}
          />
          {open && (query.startsWith('/') || query === '') && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                zIndex: 50,
                minWidth: 280,
                maxHeight: 240,
                overflowY: 'auto',
                background: '#fff',
                border: `1px solid ${BORDER}`,
                borderRadius: 6,
                boxShadow: '0 6px 22px rgba(15,18,25,0.14)',
                padding: 4,
                fontFamily: FF,
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  onWriteRubric?.();
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  width: '100%',
                  padding: '6px 8px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  textAlign: 'left',
                  borderRadius: 4,
                  fontFamily: FF,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#EFF6FF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <span
                  style={{
                    font: '600 10px/14px Inter,sans-serif',
                    color: '#1C6EF2',
                    background: '#EFF6FF',
                    border: '1px solid #BFDBFE',
                    borderRadius: 4,
                    padding: '1px 6px',
                    minWidth: 60,
                    textAlign: 'center',
                    flexShrink: 0,
                  }}
                >
                  rubric
                </span>
                <span style={{ font: '600 12px/16px Inter,sans-serif', color: '#1C6EF2' }}>Write custom rubric</span>
                <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6', marginLeft: 'auto' }}>
                  Create from scratch
                </span>
              </button>
              <div style={{ borderTop: `1px solid #F0F2F6`, margin: '4px 0' }} />
              {top.length === 0 ? (
                <div style={{ padding: '8px 10px', font: '400 11px/16px Inter,sans-serif', color: '#8A94A6' }}>
                  No matches. Try <code style={{ color: '#1C6EF2' }}>/kb:</code>,{' '}
                  <code style={{ color: '#1C6EF2' }}>/tool:</code>, or{' '}
                  <code style={{ color: '#1C6EF2' }}>/procedure:</code>
                </div>
              ) : (
                top.map((s) => {
                  const meta = REF_TYPE_META[s.type];
                  return (
                    <button
                      key={`${s.type}:${s.slug}`}
                      type="button"
                      onClick={() => add(s)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        width: '100%',
                        padding: '6px 8px',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        textAlign: 'left',
                        borderRadius: 4,
                        fontFamily: FF,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#F4F5F7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span
                        style={{
                          font: '600 10px/14px Inter,sans-serif',
                          color: meta.color,
                          background: meta.bg,
                          border: `1px solid ${meta.border}`,
                          borderRadius: 4,
                          padding: '1px 6px',
                          minWidth: 60,
                          textAlign: 'center',
                        }}
                      >
                        {meta.label}
                      </span>
                      <span style={{ font: '600 12px/16px ui-monospace,SFMono-Regular,monospace', color: '#1A1D23' }}>
                        {s.slug}
                      </span>
                      <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6', marginLeft: 'auto' }}>
                        {s.label}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* export default RubricRefEditor */
Object.assign(window, { RubricRefEditor });
})();

// ─── cursor/components/ReviewPanel/ReviewPanel.tsx ───────────────────────────────
(() => {
const { useEffect, useLayoutEffect, useMemo, useRef, useState } = React;


const { REF_TYPE_META, buildRefsByCriterion, findRefsForScoreName } = window;
const useViewportWidth = window.useViewportWidth;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = 'ui-monospace, Menlo, Consolas, monospace';

const C = {
  border: '#dce0e9',
  textPrimary: '#1A1D23',
  textSec: '#5A6478',
  textMuted: '#8A94A6',
};

interface ReviewFilter {
  id: string;
  label: string;
  count: number;
  filterFn: (c: ReviewConversation) => boolean;
}

interface Props {
  open: boolean;
  monitor: Monitor;
  queue: ReviewConversation[];
  onClose: () => void;
  // Optional override of the default header (eyebrow + title block)
  headerKicker?: string;
  headerTitle?: string;
  headerSub?: string;
  headerCustom?: ReactNode;
  // Anomaly investigation drawers inject a callout above the queue.
  extraBodyTop?: ReactNode;
  // Custom filter chips replace the default per-criterion pills.
  customFilters?: ReviewFilter[];
  // Override the displayed total count (e.g. "0 of 23 labeled" for an anomaly cluster).
  totalCountOverride?: number;
  pageSize?: number;
  // Optional callback when a reviewer clicks a conversation id — opens the
  // full conversation drawer in the host app. No-op when omitted.
  openConvo?: (id: string) => void;
}

type LabelKind = 'good' | 'bad' | 'skip';

const labelTone: Record<LabelKind, { fg: string; bg: string; bor: string }> = {
  good: { fg: '#16A34A', bg: '#F0FDF4', bor: '#86EFAC' },
  bad: { fg: '#DC2626', bg: '#FEF2F2', bor: '#FECACA' },
  skip: { fg: '#5A6478', bg: '#F4F5F7', bor: '#DCE0E9' },
};

const ReviewPanel = ({
  open,
  monitor,
  queue,
  onClose,
  headerKicker,
  headerTitle,
  headerSub,
  headerCustom,
  extraBodyTop,
  customFilters,
  totalCountOverride,
  pageSize = 5,
  openConvo,
}: Props) => {
  const vw = useViewportWidth();
  const drawerWidth = vw < 400 ? '100vw' : vw < 720 ? '90vw' : '67vw';
  const [visible, setVisible] = useState(false);

  // Animation toggle — slide in after mount, slide out before unmount.
  useEffect(() => {
    if (open) {
      const t = window.setTimeout(() => setVisible(true), 10);
      return () => window.clearTimeout(t);
    }
    setVisible(false);
    return undefined;
  }, [open]);

  const [labels, setLabels] = useState<Record<string, LabelKind>>({});
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [activeCriterion, setActiveCriterion] = useState<string | null>(null);
  const [activeCustomFilterId, setActiveCustomFilterId] = useState<string | null>(null);
  const [loadedCount, setLoadedCount] = useState(pageSize);

  // Reset queue state whenever the panel reopens against a different monitor.
  useEffect(() => {
    if (!open) return;
    setLabels({});
    setCollapsed({});
    setActiveCriterion(null);
    setActiveCustomFilterId(null);
    setLoadedCount(pageSize);
  }, [open, monitor.id, pageSize]);

  // Per-criterion counts — used for the red filter pills (failed criteria).
  const criterionFailCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    monitor.criteria.forEach((cr) => {
      counts[cr.name] = queue.filter((c) => (c.criteriaScores || []).some((s) => s.name === cr.name && !s.pass)).length;
    });
    return counts;
  }, [monitor.criteria, queue]);

  // Map criterion name -> linked rubric refs (kb / tool / procedure chips).
  // Seeded from the monitor's criteria so the "With scoring" view shows the
  // same rubric chips that appear when editing the monitor.
  const refsByCriterion = useMemo(() => buildRefsByCriterion(monitor.criteria), [monitor.criteria]);

  const activeCustomFilter = (customFilters || []).find((f) => f.id === activeCustomFilterId);

  const visibleQueue = activeCustomFilter
    ? queue.filter(activeCustomFilter.filterFn)
    : activeCriterion
      ? queue.filter((c) => (c.criteriaScores || []).some((s) => s.name === activeCriterion && !s.pass))
      : queue;

  const totalForDisplay = activeCustomFilter
    ? activeCustomFilter.count
    : activeCriterion
      ? criterionFailCounts[activeCriterion] || visibleQueue.length
      : totalCountOverride != null
        ? totalCountOverride
        : visibleQueue.length;

  const displayedQueue = visibleQueue.slice(0, loadedCount);
  const hasMore = displayedQueue.length < visibleQueue.length || displayedQueue.length < totalForDisplay;

  const labeledCount = Object.keys(labels).filter((id) => visibleQueue.some((c) => c.id === id)).length;

  // Preserve scroll across label clicks (state changes remount card subtree).
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const restoreScroll = useRef<number | null>(null);
  useLayoutEffect(() => {
    if (restoreScroll.current != null && bodyRef.current) {
      bodyRef.current.scrollTop = restoreScroll.current;
      restoreScroll.current = null;
    }
  });

  const setLabel = (id: string, kind: LabelKind) => {
    if (bodyRef.current) restoreScroll.current = bodyRef.current.scrollTop;
    setLabels((prev) => ({ ...prev, [id]: kind }));
  };

  const toggleCollapsed = (id: string) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));

  if (!open) return null;

  return (
    <>
      <div
        onClick={onClose}
        role="presentation"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,18,25,0.32)',
          zIndex: 200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 240ms ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: drawerWidth,
          background: '#fff',
          boxShadow: '-8px 0 32px rgba(15,18,25,0.18)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 320ms cubic-bezier(0.22,1,0.36,1)',
          fontFamily: FF,
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 22px 14px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div style={{ minWidth: 0, flex: 1 }}>
              {headerCustom || (
                <>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: C.textMuted,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      marginBottom: 4,
                    }}
                  >
                    {headerKicker || 'Review conversations \u00b7 ground truth'}
                  </div>
                  <h2
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: C.textPrimary,
                      margin: 0,
                      lineHeight: 1.3,
                    }}
                  >
                    {headerTitle || monitor.name}
                  </h2>
                  {headerSub && (
                    <div
                      style={{
                        fontSize: 12,
                        color: C.textSec,
                        marginTop: 4,
                        lineHeight: 1.5,
                      }}
                    >
                      {headerSub}
                    </div>
                  )}
                </>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                color: C.textMuted,
                height: 32,
                width: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg
                width={16}
                height={16}
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.6}
                strokeLinecap="round"
              >
                <path d="M3 3l10 10M13 3L3 13" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          ref={bodyRef}
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 22px 24px',
            background: '#FAFBFC',
          }}
        >
          {extraBodyTop}

          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: C.textPrimary,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {activeCustomFilter || activeCriterion ? 'Filtered conversations' : 'Recent conversations'}
              </div>
              <div style={{ fontSize: 11, color: C.textMuted }}>
                {labeledCount} of {totalForDisplay} labeled
              </div>
            </div>

            {/* Filter pills */}
            {customFilters && customFilters.length > 0 ? (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <FilterPill
                  active={!activeCustomFilterId}
                  onClick={() => setActiveCustomFilterId(null)}
                  label="All"
                  count={totalCountOverride != null ? totalCountOverride : queue.length}
                />
                {customFilters.map((f) => (
                  <FilterPill
                    key={f.id}
                    active={activeCustomFilterId === f.id}
                    onClick={() => setActiveCustomFilterId(activeCustomFilterId === f.id ? null : f.id)}
                    label={f.label}
                    count={f.count}
                  />
                ))}
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <FilterPill
                  active={!activeCriterion}
                  onClick={() => setActiveCriterion(null)}
                  label="All recent"
                  count={queue.length}
                />
                {monitor.criteria.map((cr) => {
                  const failCount = criterionFailCounts[cr.name] || 0;
                  if (failCount === 0) return null;
                  const active = activeCriterion === cr.name;
                  return (
                    <button
                      key={cr.name}
                      type="button"
                      onClick={() => setActiveCriterion(active ? null : cr.name)}
                      title={cr.name}
                      style={{
                        font: '600 11px/14px Inter,sans-serif',
                        padding: '4px 10px',
                        borderRadius: 999,
                        cursor: 'pointer',
                        border: `1px solid ${active ? '#B91C1C' : '#FCA5A5'}`,
                        background: active ? '#B91C1C' : '#fff',
                        color: active ? '#fff' : '#B91C1C',
                        fontFamily: FF,
                        transition: 'all 0.12s',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 5,
                        maxWidth: 380,
                        textAlign: 'left',
                      }}
                    >
                      <span
                        style={{
                          width: 5,
                          height: 5,
                          borderRadius: 999,
                          background: active ? '#fff' : '#B91C1C',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0,
                        }}
                      >
                        {cr.name}
                      </span>
                      <span style={{ opacity: 0.7 }}>{failCount}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {displayedQueue.map((c) => (
              <ConvCard
                key={c.id}
                c={c}
                expanded={!collapsed[c.id]}
                label={labels[c.id]}
                onToggle={() => toggleCollapsed(c.id)}
                onLabel={(kind) => setLabel(c.id, kind)}
                onOpenConvo={openConvo}
                refsByCriterion={refsByCriterion}
              />
            ))}

            {hasMore && (
              <button
                type="button"
                onClick={() => setLoadedCount((n) => n + pageSize)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 6,
                  border: `1px dashed ${C.border}`,
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                  color: C.textSec,
                  fontFamily: FF,
                }}
              >
                Load more conversations ·{' '}
                {Math.min(
                  pageSize,
                  Math.max(0, totalForDisplay - displayedQueue.length, visibleQueue.length - displayedQueue.length),
                )}{' '}
                more
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 22px',
            borderTop: `1px solid ${C.border}`,
            background: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ fontSize: 12, color: C.textSec }}>
            {labeledCount > 0 ? (
              <>
                <span style={{ fontWeight: 600, color: C.textPrimary }}>{labeledCount}</span> example
                {labeledCount !== 1 ? 's' : ''} ready to apply
              </>
            ) : (
              <span style={{ color: C.textMuted }}>Label conversations to refine the scorer</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: `1px solid ${C.border}`,
                background: '#fff',
                fontSize: 13,
                fontWeight: 600,
                color: C.textSec,
                cursor: 'pointer',
                fontFamily: FF,
                height: 34,
              }}
            >
              Close
            </button>
            <button
              type="button"
              disabled={labeledCount === 0}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: 'none',
                background: labeledCount === 0 ? '#A3B1CC' : '#1C6EF2',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: labeledCount === 0 ? 'not-allowed' : 'pointer',
                fontFamily: FF,
                height: 34,
              }}
            >
              Apply {labeledCount > 0 ? `${labeledCount} label${labeledCount !== 1 ? 's' : ''}` : 'labels'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const FilterPill = ({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      font: '600 11px/14px Inter,sans-serif',
      padding: '4px 10px',
      borderRadius: 999,
      cursor: 'pointer',
      border: `1px solid ${active ? '#1C6EF2' : C.border}`,
      background: active ? '#1C6EF2' : '#fff',
      color: active ? '#fff' : C.textSec,
      fontFamily: FF,
      transition: 'all 0.12s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 5,
    }}
  >
    {label}
    <span style={{ opacity: 0.7 }}>{count}</span>
  </button>
);

interface ConvCardProps {
  c: ReviewConversation;
  expanded: boolean;
  label: LabelKind | undefined;
  onToggle: () => void;
  onLabel: (kind: LabelKind) => void;
  onOpenConvo?: (id: string) => void;
  refsByCriterion: Record<string, RubricRef[]>;
}

const ConvCard = ({ c, expanded, label, onToggle, onLabel, onOpenConvo, refsByCriterion }: ConvCardProps) => {
  const [showAnnotated, setShowAnnotated] = useState(false);
  const passColor = c.status === 'pass' ? '#16A34A' : '#DC2626';
  const passBg = c.status === 'pass' ? '#F0FDF4' : '#FEF2F2';
  const passBor = c.status === 'pass' ? '#86EFAC' : '#FECACA';

  const labelStyle = (kind: LabelKind): React.CSSProperties => {
    const active = label === kind;
    const t = labelTone[kind];
    return {
      padding: '6px 12px',
      borderRadius: 6,
      fontSize: 12,
      fontWeight: 600,
      fontFamily: FF,
      cursor: 'pointer',
      border: `1px solid ${active ? t.fg : t.bor}`,
      background: active ? t.bg : '#fff',
      color: active ? t.fg : C.textSec,
      flex: 1,
      transition: 'all 0.12s',
    };
  };

  return (
    <div
      style={{
        border: `1px solid ${label ? '#86EFAC' : C.border}`,
        borderRadius: 8,
        marginBottom: 10,
        background: '#fff',
        boxShadow: label ? '0 0 0 2px rgba(22,163,74,0.08)' : 'none',
        transition: 'all 0.15s',
        opacity: label === 'skip' ? 0.6 : 1,
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '12px 14px 10px',
          borderBottom: `1px solid ${C.border}`,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 4,
          }}
        >
          <button
            type="button"
            onClick={() => onOpenConvo?.(c.id)}
            disabled={!onOpenConvo}
            title={onOpenConvo ? `Open ${c.id}` : c.id}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: onOpenConvo ? 'pointer' : 'default',
              font: `600 12px/16px ${MONO}`,
              color: '#1C6EF2',
              textDecoration: 'underline',
              textUnderlineOffset: 2,
            }}
          >
            {c.id}
          </button>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: passColor,
              background: passBg,
              border: `1px solid ${passBor}`,
              padding: '2px 6px',
              borderRadius: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginLeft: 'auto',
            }}
          >
            {c.status === 'pass' ? `Pass \u00b7 ${c.score}/100` : `Fail \u00b7 ${c.score}/100`}
          </span>
        </div>
        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>
          <span style={{ color: C.textPrimary, fontWeight: 600 }}>{c.customer}</span> · {c.customerCompany} ·{' '}
          <span style={{ color: C.textMuted }}>{c.timeAgo}</span>
        </div>
      </div>

      {/* Criteria breakdown */}
      <div style={{ padding: '10px 14px 4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: C.textMuted,
            }}
          >
            Criteria
          </div>
          {(c.criteriaScores || []).length > 0 && (
            <div style={{ fontSize: 10, color: C.textMuted }}>Weighted contribution out of total weight</div>
          )}
        </div>
        {(c.criteriaScores || []).length === 0 ? (
          <div
            style={{
              padding: '10px 12px',
              background: '#FFFBEB',
              border: '1px dashed #FCD34D',
              borderRadius: 6,
              fontSize: 11,
              color: '#92400E',
              lineHeight: 1.5,
              marginBottom: 6,
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 3, color: '#78350F' }}>Per-criterion rationale expired</div>
            Detailed scores are retained for 30 days. After that, only the overall score and pass/fail outcome remain in
            long-term storage. This conversation scored <strong>{c.score}/100</strong> against the monitor — open the
            full conversation to review the messages directly.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {c.criteriaScores.map((cr) => (
              <div
                key={cr.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: cr.pass ? '#F0FDF4' : '#FEF2F2',
                    border: `1px solid ${cr.pass ? '#86EFAC' : '#FECACA'}`,
                    color: cr.pass ? '#16A34A' : '#DC2626',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {cr.pass ? '\u2713' : '\u2715'}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    color: C.textPrimary,
                    flex: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {cr.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: cr.pass ? '#16A34A' : '#DC2626',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {((cr.score * cr.weight) / 100).toFixed(1)}
                  <span style={{ color: C.textMuted, fontWeight: 400 }}>/{cr.weight}</span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View conversation toggle + transcript */}
      <div style={{ padding: '8px 14px 12px' }}>
        <button
          type="button"
          onClick={onToggle}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontFamily: FF,
            fontSize: 11,
            fontWeight: 600,
            color: '#1C6EF2',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          {expanded ? 'Hide conversation' : 'View conversation'}
          <svg
            width={9}
            height={9}
            viewBox="0 0 9 9"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.6}
            style={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 150ms',
            }}
          >
            <path d="M3 2l3 2.5L3 7" strokeLinecap="round" />
          </svg>
        </button>

        {expanded && c.messages.length > 0 && (
          <ConversationView
            c={c}
            showAnnotated={showAnnotated}
            onToggleAnnotated={setShowAnnotated}
            onOpenConvo={onOpenConvo}
            refsByCriterion={refsByCriterion}
          />
        )}
      </div>

      {/* Label actions */}
      <div
        style={{
          padding: '10px 14px',
          borderTop: `1px solid ${C.border}`,
          background: '#FAFBFC',
          borderRadius: '0 0 8px 8px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: C.textMuted,
            marginBottom: 6,
          }}
        >
          Mark as ground-truth example
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button type="button" onClick={() => onLabel('good')} style={labelStyle('good')}>
            ✓ Good example
          </button>
          <button type="button" onClick={() => onLabel('bad')} style={labelStyle('bad')}>
            ✕ False positive
          </button>
          <button type="button" onClick={() => onLabel('skip')} style={labelStyle('skip')}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConvViewProps {
  c: ReviewConversation;
  showAnnotated: boolean;
  onToggleAnnotated: (v: boolean) => void;
  onOpenConvo?: (id: string) => void;
  refsByCriterion: Record<string, RubricRef[]>;
}

// Per-criterion miss-pattern dictionary used by the "With scoring" view to
// map a failing criterion to the AI turn that most plausibly triggered the
// verdict — and to the customer re-ask that supplies context. Mirrors the
// PATTERNS / RE_ASK / categoriesFor logic in the source HTML's ReviewPanel.
const MISS_PATTERNS: Record<string, RegExp> = {
  resolution: /coupon|discount|voucher|store credit|replacement|gift card|instead/i,
  policy: /per (our )?policy|per process|policy (window|requires|states)|protocol|per our/i,
  verification: /already authenticated|already verified|no need to verify|account was already/i,
  tool: /prior session|cached|stale|earlier session|delivered|signature on file/i,
  closing: /anything else|all set|have a (great|good) day/i,
};
const RE_ASK = /actually|but|wait|already|asked|I said|I want|just (the )?refund|no, |third time|second time/i;

const categoriesFor = (criterionName: string): string[] => {
  const n = (criterionName || '').toLowerCase();
  if (/resolved|need|intent|outcome|solve/.test(n)) return ['resolution'];
  if (/tone|empathy|frustration|emotional/.test(n)) return ['policy'];
  if (/verif|identity|auth|disclosure/.test(n)) return ['verification', 'policy'];
  if (/tool|lookup|customer.id|session|stale/.test(n)) return ['tool', 'verification'];
  if (/close|follow.up|confirm|confirmation/.test(n)) return ['closing'];
  return ['resolution', 'policy'];
};

type TurnTagKind = 'matched' | 'missed' | 'context';
interface TurnTag {
  tag: TurnTagKind;
  cr: { name: string; score: number };
  refs: RubricRef[];
}

const buildTurnTags = (
  c: ReviewConversation,
  refsByCriterion: Record<string, RubricRef[]>,
): Record<number, TurnTag[]> => {
  const msgs = c.messages;
  const tagsByTurn: Record<number, TurnTag[]> = {};
  (c.criteriaScores || []).forEach((cr) => {
    // Resolve the monitor's linked rubric for this criterion. Tolerates name
    // drift between the monitor's criterion (e.g. with parentheticals) and the
    // shorter label stored on criteriaScores entries, then falls back to
    // seeding refs from the score name itself.
    const refs = findRefsForScoreName(refsByCriterion, cr.name);
    if (!cr.pass) {
      const cats = categoriesFor(cr.name);
      let aiMissIdx = -1;
      for (const cat of cats) {
        const pat = MISS_PATTERNS[cat];
        const idx = msgs.findIndex((mm) => mm.role === 'ai' && pat.test(mm.text || ''));
        if (idx >= 0) {
          aiMissIdx = idx;
          break;
        }
      }
      if (aiMissIdx < 0) aiMissIdx = msgs.findIndex((mm) => mm.role === 'ai');
      if (aiMissIdx >= 0) {
        (tagsByTurn[aiMissIdx] = tagsByTurn[aiMissIdx] || []).push({
          tag: 'missed',
          cr,
          refs,
        });
      }
      let custIdx = msgs.findIndex((mm, i) => i > aiMissIdx && mm.role === 'customer' && RE_ASK.test(mm.text || ''));
      if (custIdx < 0) custIdx = msgs.findIndex((mm) => mm.role === 'customer' && RE_ASK.test(mm.text || ''));
      if (custIdx < 0) custIdx = msgs.findIndex((mm) => mm.role === 'customer');
      if (custIdx >= 0 && custIdx !== aiMissIdx) {
        (tagsByTurn[custIdx] = tagsByTurn[custIdx] || []).push({
          tag: 'context',
          cr,
          refs,
        });
      }
    } else {
      const aiIdx = msgs.findIndex((mm) => mm.role === 'ai');
      if (aiIdx >= 0) {
        (tagsByTurn[aiIdx] = tagsByTurn[aiIdx] || []).push({
          tag: 'matched',
          cr,
          refs,
        });
      }
    }
  });
  return tagsByTurn;
};

const tagToneFor = (tag: TurnTagKind) => {
  if (tag === 'matched') return { fg: '#16A34A', bg: '#F0FDF4', bor: '#86EFAC' };
  if (tag === 'missed') return { fg: '#DC2626', bg: '#FEF2F2', bor: '#FECACA' };
  return { fg: '#B45309', bg: '#FFFBEB', bor: '#FCD34D' };
};

const roleLabel = (role: ReviewMessage['role']): string => {
  if (role === 'customer') return 'Customer';
  if (role === 'ai') return 'AI';
  if (role === 'tool') return 'Tool';
  return 'System';
};

const roleColor = (role: ReviewMessage['role']): string => {
  if (role === 'customer') return '#7C3AED';
  if (role === 'ai') return '#1C6EF2';
  return C.textMuted;
};

const ConversationView = ({ c, showAnnotated, onToggleAnnotated, onOpenConvo, refsByCriterion }: ConvViewProps) => {
  const messages: ReviewMessage[] = c.messages.slice(0, 5);
  const tagsByTurn = useMemo(() => buildTurnTags(c, refsByCriterion), [c, refsByCriterion]);

  return (
    <div
      style={{
        marginTop: 10,
        background: '#FAFBFC',
        border: `1px solid ${C.border}`,
        borderRadius: 6,
        overflow: 'hidden',
      }}
    >
      {/* View-mode subtoggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '6px 10px',
          borderBottom: `1px solid ${C.border}`,
          background: '#fff',
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginRight: 8,
          }}
        >
          View
        </span>
        {[
          { k: false, label: 'Transcript' },
          { k: true, label: 'With scoring' },
        ].map((opt) => {
          const on = showAnnotated === opt.k;
          return (
            <button
              key={String(opt.k)}
              type="button"
              onClick={() => onToggleAnnotated(opt.k)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: 999,
                cursor: 'pointer',
                border: `1px solid ${on ? '#1C6EF2' : C.border}`,
                background: on ? '#1C6EF2' : '#fff',
                color: on ? '#fff' : C.textSec,
                fontFamily: FF,
                marginRight: 4,
                transition: 'all 0.12s',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Turns */}
      <div
        style={{
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: showAnnotated ? 10 : 6,
        }}
      >
        {messages.map((m, i) => {
          const tags = tagsByTurn[i] || [];
          if (showAnnotated) {
            const leftBorder =
              tags.length === 0
                ? C.border
                : tags.some((t) => t.tag === 'missed')
                  ? '#FECACA'
                  : tags.some((t) => t.tag === 'matched')
                    ? '#86EFAC'
                    : '#FCD34D';
            return (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr',
                  gap: 10,
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: roleColor(m.role),
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    turn {i + 1} · {roleLabel(m.role)} · {m.time}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.textPrimary,
                      lineHeight: 1.5,
                      marginTop: 2,
                      fontFamily: m.role === 'tool' ? MONO : FF,
                    }}
                  >
                    {m.text}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    paddingLeft: 8,
                    borderLeft: `2px solid ${leftBorder}`,
                  }}
                >
                  {tags.length === 0 ? (
                    <span
                      style={{
                        fontSize: 10,
                        color: C.textMuted,
                        fontStyle: 'italic',
                        lineHeight: 1.4,
                      }}
                    >
                      no scoring signal
                    </span>
                  ) : (
                    tags.map((t, ti) => {
                      const tone = tagToneFor(t.tag);
                      return (
                        <div
                          key={ti}
                          style={{
                            padding: '4px 6px',
                            borderRadius: 4,
                            background: tone.bg,
                            border: `1px solid ${tone.bor}`,
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 4,
                              marginBottom: 2,
                            }}
                          >
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 700,
                                color: tone.fg,
                                textTransform: 'uppercase',
                                letterSpacing: '0.04em',
                              }}
                            >
                              {t.tag}
                            </span>
                            <span
                              style={{
                                fontSize: 9,
                                fontWeight: 600,
                                color: tone.fg,
                                marginLeft: 'auto',
                                fontFamily: MONO,
                              }}
                            >
                              {t.cr.score}/100
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: C.textSec,
                              lineHeight: 1.4,
                            }}
                          >
                            {t.cr.name}
                          </div>
                          {t.refs.length > 0 && (
                            <div
                              style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 3,
                                marginTop: 4,
                              }}
                              title="Related guidance for this criterion"
                            >
                              {t.refs.map((r, ri) => {
                                const meta = REF_TYPE_META[r.type] || REF_TYPE_META.kb;
                                return (
                                  <span
                                    key={`${r.type}:${r.slug}:${ri}`}
                                    style={{
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      padding: '0 4px',
                                      background: meta.bg,
                                      border: `1px solid ${meta.border}`,
                                      borderRadius: 3,
                                      font: `600 9px/14px ${MONO}`,
                                      color: meta.color,
                                    }}
                                  >
                                    <span style={{ opacity: 0.75 }}>/{meta.label}:</span>
                                    {r.slug}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: roleColor(m.role),
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                }}
              >
                {roleLabel(m.role)} · {m.time}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: C.textPrimary,
                  lineHeight: 1.5,
                  fontFamily: m.role === 'tool' ? MONO : FF,
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {c.messages.length > 5 && (
          <div
            style={{
              paddingTop: 6,
              borderTop: `1px dashed ${C.border}`,
              marginTop: 2,
              fontSize: 11,
              color: C.textMuted,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <span>
              {c.messages.length - 5} more turn
              {c.messages.length - 5 !== 1 ? 's' : ''} not shown
            </span>
            <button
              type="button"
              onClick={() => onOpenConvo?.(c.id)}
              disabled={!onOpenConvo}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: onOpenConvo ? 'pointer' : 'default',
                fontFamily: FF,
                fontSize: 11,
                fontWeight: 600,
                color: '#1C6EF2',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              Go to full conversation
              <svg
                width={9}
                height={9}
                viewBox="0 0 9 9"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 1.5h4.5V6M7.5 1.5L4 5M3.5 2.5H2v5h5V6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/* export default ReviewPanel */
Object.assign(window, { ReviewPanel });
})();

// ─── cursor/AnomaliesTab/DetailPane.tsx ───────────────────────────────
(() => {
const { useState } = React;

const { ANOMALY_BY_ID } = window;
const NeighborhoodHeatmap = window.NeighborhoodHeatmap;
const ButtonText = window.ButtonText;
const PopoverMenu = window.PopoverMenu;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

const sevTokens = (sev: Anomaly['sev']) => {
  if (sev === 'high') return { label: 'High', color: '#9E181E', bg: '#FFE8E9', border: '#FFAAAD' };
  if (sev === 'med') return { label: 'Medium', color: '#826F1C', bg: '#FFFDE5', border: '#FCED92' };
  if (sev === 'drift') return { label: 'Drift', color: '#5F6675', bg: '#F2F3F7', border: '#DCE0E9' };
  if (sev === 'pos') return { label: 'Positive', color: '#15803D', bg: '#E8F6EC', border: '#B7E0C1' };
  return { label: '\u2014', color: '#697182', bg: '#F2F3F7', border: '#DCE0E9' };
};

const fmt = (v: number, unit: string) => {
  const n = Number.isInteger(v) ? v : v.toFixed(1);
  return unit ? `${n}${unit}` : `${n}`;
};

interface DetailPaneProps {
  a: Anomaly;
  onInvestigate: () => void;
  onTune: () => void;
  monitorCriteriaCount?: number;
}

const SNOOZE_DURATIONS = ['1 hour', '4 hours', '24 hours', '7 days', 'Until resolved'];

const DetailPane = ({ a, onInvestigate, onTune, monitorCriteriaCount }: DetailPaneProps) => {
  const [snoozeOpen, setSnoozeOpen] = useState(false);
  const sev = sevTokens(a.sev);
  const linked = a.linkedTo ? ANOMALY_BY_ID[a.linkedTo] : null;
  const crIndex = ({ c1: 0, c2: 1, c3: 0, c4: 2 } as Record<string, number>)[a.id] ?? 0;
  const crTotal = monitorCriteriaCount || 4;

  const stats: {
    lab: string;
    val: string;
    sub: string;
    highlight?: boolean;
    small?: boolean;
    onClick?: () => void;
  }[] = [
    { lab: 'Baseline', val: fmt(a.base, a.unit), sub: 'recent average' },
    {
      lab: 'Now',
      val: fmt(a.now, a.unit),
      sub: `${a.dir === 'up' ? '\u2191' : '\u2193'} outside \u00b1${fmt(a.variance, a.unit)} band`,
      highlight: true,
      onClick: a.investigateCount > 0 ? onInvestigate : undefined,
    },
    { lab: 'Threatens', val: a.goalLabel, sub: a.threatens, small: true },
  ];

  return (
    <div style={{ fontFamily: FF }}>
      {/* Header */}
      <div
        style={{
          borderBottom: '1px solid var(--gray-30)',
          paddingBottom: 18,
          marginBottom: 22,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 8,
            alignItems: 'center',
            marginBottom: 10,
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-130)' }}>
            {a.metric}{' '}
            <span
              style={{
                color: 'var(--gray-90)',
                fontWeight: 500,
                fontFamily: MONO,
              }}
            >
              ({crIndex + 1} of {crTotal})
            </span>
          </span>
          <span style={{ width: 1, height: 12, background: 'var(--gray-30)' }} />
          <a
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--blue-80)',
              textDecoration: 'none',
              borderBottom: '1px dotted var(--blue-25)',
            }}
          >
            {a.monitorName}
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <h2
            style={{
              margin: 0,
              flex: 1,
              fontSize: 22,
              fontWeight: 600,
              color: 'var(--gray-130)',
              letterSpacing: '-0.015em',
              lineHeight: 1.3,
            }}
          >
            {a.head}
          </h2>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              flexShrink: 0,
            }}
          >
            <PopoverMenu
              target={
                <ButtonText size="small" icon="alarm" onClick={() => setSnoozeOpen((o) => !o)}>
                  Snooze
                </ButtonText>
              }
              options={SNOOZE_DURATIONS.map((label) => ({
                label,
                onClick: () => setSnoozeOpen(false),
              }))}
              showPopover={snoozeOpen}
              onClose={() => setSnoozeOpen(false)}
              attachment="bottom right"
              targetAttachment="top right"
            />
            <ButtonText size="small" icon="sliders" onClick={onTune}>
              Tune sensitivity
            </ButtonText>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1px 1fr 1px 1fr',
          border: '1px solid var(--gray-30)',
          borderRadius: 8,
          overflow: 'hidden',
          marginBottom: 20,
        }}
      >
        {stats.map((s, i) => (
          <React.Fragment key={i}>
            {i > 0 && <div style={{ background: 'var(--gray-30)', margin: '10px 0' }} />}
            <div style={{ padding: '10px 14px' }}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'var(--gray-90)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: 4,
                }}
              >
                {s.lab}
              </div>
              <div
                onClick={s.onClick}
                style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: s.highlight ? sev.color : 'var(--gray-130)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.2,
                  cursor: s.onClick ? 'pointer' : undefined,
                  textDecoration: s.onClick ? 'underline' : undefined,
                  textUnderlineOffset: s.onClick ? 3 : undefined,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'var(--gray-90)',
                  marginTop: 3,
                  lineHeight: 1.4,
                }}
              >
                {s.sub}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Linked criteria callout */}
      {linked && linked.cat !== 'monitor' && (
        <div
          style={{
            padding: '16px 18px',
            borderRadius: 10,
            border: '1px solid var(--yellow-50)',
            background: 'var(--yellow-15)',
            marginBottom: 22,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 600,
              color: 'var(--yellow-100)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: 8,
            }}
          >
            \u2194 Linked criteria cluster
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--gray-130)',
            }}
          >
            {linked.metric}
          </div>
          <div
            style={{
              fontSize: 12,
              color: 'var(--gray-100)',
              marginTop: 6,
              lineHeight: 1.55,
            }}
          >
            {linked.head}
          </div>
        </div>
      )}

      {/* Heatmap */}
      <NeighborhoodHeatmap focal={a} focalOnly />

      {/* Footer */}
      {a.investigateCount > 0 && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            padding: '14px 0 0',
            marginTop: 14,
            borderTop: '1px solid var(--gray-30)',
          }}
        >
          <button
            type="button"
            onClick={onInvestigate}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 16px',
              border: '1px solid #1C6EF2',
              borderRadius: 6,
              background: '#1C6EF2',
              font: '600 13px/18px Inter,sans-serif',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Review all affected conversations
            <span style={{ fontSize: 10 }}>→</span>
          </button>
        </div>
      )}
    </div>
  );
};

/* export default DetailPane */
Object.assign(window, { DetailPane, sevTokens, fmt });
})();

// ─── cursor/AnomaliesTab/InvestigationDrawer.tsx ───────────────────────────────
(() => {
const { useMemo } = React;

const { Anomaly } = window;
const { STUB_ANOMALIES } = window;
const { STUB_MONITORS } = window;
const { buildReviewQueue } = window;
const ReviewPanel = window.ReviewPanel;
const { ReviewFilter } = window;

interface Props {
  open: boolean;
  a: Anomaly | null;
  onClose: () => void;
}

// Anomaly investigation drawer — thin wrapper around ReviewPanel that provides
// an anomaly-scoped header and conversation filters.
const InvestigationDrawer = ({ open, a, onClose }: Props) => {
  const monitor = useMemo(() => (a ? STUB_MONITORS.find((m) => m.id === a.monitorId) : undefined), [a]);
  const queue = useMemo(() => (monitor ? buildReviewQueue(monitor.id) : []), [monitor]);

  if (!a || !monitor) return null;

  const linkedCriteria = STUB_ANOMALIES.filter(
    (x) => x.cat === 'criteria' && x.monitorKey === a.monitorKey && x.id !== a.id,
  );
  const linkedNames = linkedCriteria.map((x) => x.metric);
  const tripleFailCount = queue.filter((c) => (c.criteriaScores || []).filter((s) => !s.pass).length >= 2).length;
  const coFailureCount = linkedCriteria.length > 0 ? Math.max(1, Math.min(a.investigateCount, tripleFailCount)) : 0;

  const headerCustom = (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1D23' }}>{a.metric}</span>
      <span style={{ width: 1, height: 12, background: '#dce0e9' }} />
      <a
        style={{
          fontSize: 13,
          fontWeight: 500,
          color: '#005BD8',
          textDecoration: 'none',
          borderBottom: '1px dotted #BBD1FF',
          cursor: 'default',
        }}
      >
        {a.monitorName}
      </a>
      <span style={{ width: 1, height: 12, background: '#dce0e9' }} />
      <span
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#5A6478',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        Topic
      </span>
      <a
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: '#005BD8',
          textDecoration: 'none',
          borderBottom: '1px dotted #BBD1FF',
          cursor: 'default',
        }}
      >
        refund-denial
      </a>
    </div>
  );

  const customFilters: ReviewFilter[] = [
    ...(coFailureCount > 0
      ? [
          {
            id: 'co_fail',
            label: `Also failed ${linkedNames.join(', ')}`,
            count: coFailureCount,
            filterFn: (c: (typeof queue)[number]) => (c.criteriaScores || []).filter((s) => !s.pass).length >= 2,
          },
        ]
      : []),
    {
      id: 'kb',
      label: 'Cited outdated kb:refund-eligibility',
      count: 17,
      filterFn: (c: (typeof queue)[number]) => c.messages.some((m) => /policy|refund/i.test(m.text)),
    },
    {
      id: 'repeat',
      label: 'Repeat contact within 7d',
      count: 14,
      filterFn: (c: (typeof queue)[number]) => c.score < 60,
    },
  ];

  return (
    <ReviewPanel
      open={open}
      monitor={monitor}
      queue={queue}
      onClose={onClose}
      headerCustom={headerCustom}
      customFilters={customFilters}
      totalCountOverride={a.investigateCount}
      pageSize={5}
    />
  );
};

/* export default InvestigationDrawer */
Object.assign(window, { InvestigationDrawer });
})();

// ─── cursor/AnomaliesTab/TuneSensitivityPane.tsx ───────────────────────────────
(() => {
const { useState } = React;


const { BandChart, ClusterBandChart } = window;
const ButtonText = window.ButtonText;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

interface Props {
  a: Anomaly;
  onBack: () => void;
}

const TuneSensitivityPane = ({ a, onBack }: Props) => {
  const isMonitor = a.cat === 'monitor';
  const replay14 = a.hist || [];
  const recommendedVar = Math.max(1, Math.round(a.variance * 0.7 * 10) / 10);
  const recommendedThr = Math.max(a.base + 2, Math.round(a.base * 1.6));
  const recommendedClusterMin = 8;
  const recommendedWindow = 2;

  const [variance, setVariance] = useState(a.variance);
  const [threshold, setThreshold] = useState(recommendedThr);
  const [clusterMin, setClusterMin] = useState(recommendedClusterMin);
  const [windowDays, setWindowDays] = useState(recommendedWindow);

  const wouldAlert = isMonitor
    ? replay14.filter((v) => Math.abs(v - a.base) > variance).length
    : replay14.filter((v) => v >= threshold).length;

  const monitorDirty = variance !== recommendedVar;
  const criteriaDirty =
    threshold !== recommendedThr || clusterMin !== recommendedClusterMin || windowDays !== recommendedWindow;

  const verdictNote =
    wouldAlert === 0
      ? isMonitor
        ? "Probably too loose — would have missed today's drop."
        : "Too quiet — wouldn't have caught the drift."
      : wouldAlert > 5
        ? isMonitor
          ? "Probably too tight — that's alert fatigue."
          : 'Noisy — narrow the cluster rule.'
        : 'Feels balanced. Save it and watch tomorrow.';

  const labelStyle = {
    fontSize: 10,
    fontWeight: 600,
    color: 'var(--gray-90)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.06em',
  };
  const cardStyle = {
    padding: '16px 18px',
    borderRadius: 10,
    border: '1px solid var(--gray-30)',
    background: '#fff',
  };

  return (
    <div style={{ fontFamily: FF }}>
      <div
        style={{
          display: 'flex',
          gap: 10,
          alignItems: 'center',
          marginBottom: 14,
        }}
      >
        <ButtonText size="small" onClick={onBack} icon="chevron-left">
          {a.metric}
        </ButtonText>
        <span style={{ color: 'var(--gray-50)' }}>/</span>
        <span style={{ fontSize: 12, color: 'var(--gray-115)', fontWeight: 500 }}>Tune sensitivity</span>
      </div>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--gray-30)',
          paddingBottom: 18,
          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              alignItems: 'center',
              marginBottom: 6,
            }}
          >
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                padding: '2px 7px',
                borderRadius: 999,
                background: isMonitor ? 'var(--gray-150)' : 'var(--yellow-15)',
                color: isMonitor ? '#fff' : 'var(--yellow-100)',
                border: isMonitor ? 'none' : '1px solid var(--yellow-50)',
              }}
            >
              {isMonitor ? 'Monitor anomaly' : 'Criteria cluster'}
            </span>
            <span style={{ fontSize: 11, color: 'var(--gray-95)' }}>{a.metric}</span>
          </div>
          <h2
            style={{
              margin: '4px 0 0',
              fontSize: 24,
              fontWeight: 600,
              color: 'var(--gray-130)',
              letterSpacing: '-0.015em',
            }}
          >
            {isMonitor ? 'Tune the variance band' : 'Tune the cluster threshold'}
          </h2>
          <div
            style={{
              fontSize: 13,
              color: 'var(--gray-95)',
              marginTop: 6,
              maxWidth: 720,
              lineHeight: 1.5,
            }}
          >
            {isMonitor ? (
              <>
                The band is <strong>baseline \u00b1 variance</strong>. Replays the last 14 days against your proposed
                setting.
              </>
            ) : (
              <>
                Two rules &mdash; <strong>fail-count threshold</strong> and <strong>cluster size</strong>. Both must
                trip to alert.
              </>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            type="button"
            onClick={onBack}
            style={{
              fontFamily: FF,
              padding: '6px 12px',
              borderRadius: 6,
              border: '1px solid transparent',
              background: 'transparent',
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--gray-105)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onBack}
            style={{
              fontFamily: FF,
              padding: '6px 12px',
              borderRadius: 6,
              border: 'none',
              background: 'var(--blue-70)',
              fontSize: 12,
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            Save band
          </button>
        </div>
      </div>

      {/* Replay chart */}
      <div style={{ ...cardStyle, padding: '14px 16px', marginBottom: 18 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: 10,
          }}
        >
          <div>
            <div style={labelStyle}>14-day replay · proposed band shaded</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-95)',
                marginTop: 4,
                lineHeight: 1.5,
              }}
            >
              {isMonitor
                ? 'Red dots = days that would have alerted at the proposed band.'
                : 'Red bars = days over your proposed threshold.'}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              gap: 14,
              alignItems: 'center',
              fontSize: 11,
              color: 'var(--gray-95)',
            }}
          >
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span
                style={{
                  width: 18,
                  height: 10,
                  background: 'rgba(252,237,146,0.35)',
                  border: '1px solid var(--yellow-100)',
                }}
              />
              proposed
            </span>
            <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span
                style={{
                  width: 18,
                  height: 10,
                  border: '1px dashed var(--gray-50)',
                }}
              />
              current
            </span>
          </div>
        </div>
        {isMonitor ? (
          <BandChart data={replay14} baseline={a.base} variance={a.variance} currentVar={variance} />
        ) : (
          <ClusterBandChart data={replay14} baseline={a.base} threshold={threshold} />
        )}
      </div>

      {/* Controls */}
      {isMonitor ? (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Variance band \u00b1</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                marginTop: 8,
                marginBottom: 14,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--gray-130)',
                  letterSpacing: '-0.02em',
                }}
              >
                \u00b1{variance}
                {a.unit}
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>
                currently \u00b1{a.variance}
                {a.unit}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={12}
              step={0.5}
              value={variance}
              onChange={(e) => setVariance(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--blue-80)' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 11,
                color: 'var(--gray-90)',
              }}
            >
              <span>tighter (more alerts)</span>
              <span>looser (fewer alerts)</span>
            </div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: 'var(--yellow-15)',
              border: '1px solid var(--yellow-50)',
            }}
          >
            <div style={labelStyle}>Replay verdict</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--gray-130)',
                letterSpacing: '-0.02em',
                marginTop: 6,
                lineHeight: 1.1,
              }}
            >
              {wouldAlert} alert{wouldAlert === 1 ? '' : 's'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-100)',
                marginTop: 4,
              }}
            >
              over the last 14 days
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--yellow-110)',
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              {verdictNote}
            </div>
          </div>
          <div style={cardStyle}>
            <div style={labelStyle}>Recommendation</div>
            <div
              style={{
                fontSize: 13,
                color: 'var(--gray-115)',
                marginTop: 8,
                lineHeight: 1.55,
              }}
            >
              Today&rsquo;s drop was{' '}
              <strong>
                {Math.abs(a.now - a.base)}
                {a.unit}
              </strong>
              . To catch it earlier, try{' '}
              <strong style={{ color: 'var(--blue-90)' }}>
                \u00b1{recommendedVar}
                {a.unit}
              </strong>
              .
            </div>
            <button
              type="button"
              onClick={() => setVariance(recommendedVar)}
              disabled={!monitorDirty}
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: 600,
                padding: '6px 10px',
                borderRadius: 6,
                background: monitorDirty ? 'var(--blue-10)' : 'var(--gray-15)',
                border: `1px solid ${monitorDirty ? 'var(--blue-25)' : 'var(--gray-30)'}`,
                color: monitorDirty ? 'var(--blue-90)' : 'var(--gray-90)',
                cursor: monitorDirty ? 'pointer' : 'default',
                fontFamily: FF,
              }}
            >
              \u21bb Reset to recommended (\u00b1{recommendedVar}
              {a.unit})
            </button>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 2fr 1fr',
            gap: 14,
            marginBottom: 18,
          }}
        >
          <div style={cardStyle}>
            <div style={labelStyle}>Rule 1 \u00b7 fail-count threshold</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-95)',
                marginTop: 4,
              }}
            >
              alert when daily failures of <strong>{a.metric}</strong> hit this number
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
                marginTop: 10,
                marginBottom: 12,
              }}
            >
              <span
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: 'var(--gray-130)',
                  letterSpacing: '-0.02em',
                }}
              >
                {'\u2265'} {threshold}/day
              </span>
              <span style={{ fontSize: 12, color: 'var(--gray-95)' }}>baseline ~{a.base}/day</span>
            </div>
            <input
              type="range"
              min={a.base}
              max={a.base + 30}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(+e.target.value)}
              style={{ width: '100%', accentColor: 'var(--blue-80)' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 6,
                fontSize: 11,
                color: 'var(--gray-90)',
              }}
            >
              <span>sensitive ({a.base}+)</span>
              <span>quiet ({a.base + 30})</span>
            </div>
          </div>
          <div style={{ ...cardStyle, background: 'var(--gray-10)' }}>
            <div style={labelStyle}>Rule 2 \u00b7 cluster size</div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-95)',
                marginTop: 4,
              }}
            >
              only alert when these failures share a topic / pattern
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginTop: 12,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--gray-130)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  {'\u2265'} {clusterMin} convos
                </div>
                <input
                  type="range"
                  min={3}
                  max={20}
                  step={1}
                  value={clusterMin}
                  onChange={(e) => setClusterMin(+e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--blue-80)',
                    marginTop: 6,
                  }}
                />
                <div style={{ ...labelStyle, marginTop: 4 }}>min cluster size</div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 20,
                    fontWeight: 700,
                    color: 'var(--gray-130)',
                    letterSpacing: '-0.015em',
                  }}
                >
                  within {windowDays}d
                </div>
                <input
                  type="range"
                  min={1}
                  max={7}
                  step={1}
                  value={windowDays}
                  onChange={(e) => setWindowDays(+e.target.value)}
                  style={{
                    width: '100%',
                    accentColor: 'var(--blue-80)',
                    marginTop: 6,
                  }}
                />
                <div style={{ ...labelStyle, marginTop: 4 }}>rolling window</div>
              </div>
            </div>
            <div
              style={{
                marginTop: 14,
                padding: '10px 12px',
                background: '#fff',
                border: '1px dashed var(--gray-50)',
                borderRadius: 8,
                fontSize: 12,
                color: 'var(--gray-115)',
                lineHeight: 1.55,
              }}
            >
              Today&rsquo;s cluster: <strong>23 convos</strong> \u00b7 all billing/refund \u00b7 within 2 days \u2192
              would still alert.
            </div>
          </div>
          <div
            style={{
              ...cardStyle,
              background: 'var(--yellow-15)',
              border: '1px solid var(--yellow-50)',
            }}
          >
            <div style={labelStyle}>Replay verdict</div>
            <div
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--gray-130)',
                letterSpacing: '-0.02em',
                marginTop: 6,
                lineHeight: 1.1,
              }}
            >
              {wouldAlert} alert{wouldAlert === 1 ? '' : 's'}
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--gray-100)',
                marginTop: 4,
              }}
            >
              past 14 days, both rules
            </div>
            <div
              style={{
                fontSize: 12,
                color: 'var(--yellow-110)',
                marginTop: 12,
                lineHeight: 1.5,
              }}
            >
              {verdictNote}
            </div>
            <button
              type="button"
              onClick={() => {
                setThreshold(recommendedThr);
                setClusterMin(recommendedClusterMin);
                setWindowDays(recommendedWindow);
              }}
              disabled={!criteriaDirty}
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: 600,
                width: '100%',
                padding: '6px 10px',
                borderRadius: 6,
                background: criteriaDirty ? '#fff' : 'var(--gray-15)',
                border: `1px solid ${criteriaDirty ? 'var(--yellow-100)' : 'var(--gray-30)'}`,
                color: criteriaDirty ? 'var(--yellow-110)' : 'var(--gray-90)',
                cursor: criteriaDirty ? 'pointer' : 'default',
                fontFamily: FF,
              }}
            >
              \u21bb Reset to recommended
            </button>
            <div
              style={{
                fontSize: 11,
                color: 'var(--gray-90)',
                marginTop: 6,
                lineHeight: 1.5,
              }}
            >
              {'\u2265'} {recommendedThr} fails {'\u00b7'} {recommendedClusterMin} convos {'\u00b7'} {recommendedWindow}
              d
            </div>
          </div>
        </div>
      )}

      {/* Downstream */}
      <div
        style={{
          padding: '14px 18px',
          borderRadius: 10,
          border: '1px dashed var(--gray-40)',
          background: 'var(--gray-10)',
        }}
      >
        <div style={labelStyle}>What changes downstream</div>
        <div
          style={{
            display: 'flex',
            gap: 18,
            marginTop: 8,
            flexWrap: 'wrap',
            fontSize: 13,
            color: 'var(--gray-115)',
            lineHeight: 1.55,
          }}
        >
          <span>
            {'\u21b3'} Affects <strong>{a.threatens}</strong>
          </span>
          {!isMonitor && (
            <span>
              {'\u21b3'} Rule 2 changes apply to every check inside <strong>{a.monitorName}</strong>
            </span>
          )}
          <span style={{ color: 'var(--gray-95)' }}>
            {'\u21b3'} Edit logged in goal history. Old band kept for 30 days for comparison.
          </span>
        </div>
      </div>
    </div>
  );
};

/* export default TuneSensitivityPane */
Object.assign(window, { TuneSensitivityPane });
})();

// ─── cursor/AnomaliesTab/AnomaliesTab.tsx ───────────────────────────────
(() => {
const { useEffect, useMemo, useRef, useState } = React;

const { ANOMALY_BY_ID, STUB_ANOMALIES } = window;
const DetailPane = window.DetailPane;
const TuneSensitivityPane = window.TuneSensitivityPane;
const InvestigationDrawer = window.InvestigationDrawer;

interface Props {
  focusAnomalyId?: string | null;
  onFocusConsumed?: () => void;
}

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, monospace";

type RangeKey = '24h' | '7d' | '30d';
const AnomaliesTab = ({ focusAnomalyId, onFocusConsumed }: Props) => {
  const criteriaAll = useMemo(() => STUB_ANOMALIES.filter((a) => a.cat === 'criteria'), []);
  const [range, setRange] = useState<RangeKey>('7d');
  const [tuningId, setTuningId] = useState<string | null>(null);
  const [investigatingId, setInvestigatingId] = useState<string | null>(null);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const highlightTimerRef = useRef<number | undefined>(undefined);

  // When a focus anomaly arrives from the Monitors tab scroll it into view and briefly highlight it.
  useEffect(() => {
    if (!focusAnomalyId) return;
    const target = ANOMALY_BY_ID[focusAnomalyId];
    if (!target) {
      onFocusConsumed?.();
      return;
    }
    const id = focusAnomalyId;
    const raf = window.requestAnimationFrame(() => {
      const el = document.getElementById(`anom-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setHighlightId(id);
        window.clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = window.setTimeout(() => setHighlightId(null), 1800);
      }
      onFocusConsumed?.();
    });
    return () => window.cancelAnimationFrame(raf);
  }, [focusAnomalyId, onFocusConsumed]);

  useEffect(() => () => window.clearTimeout(highlightTimerRef.current), []);

  const criteria = criteriaAll;

  const investigating = investigatingId ? ANOMALY_BY_ID[investigatingId] : null;

  return (
    <div style={{ fontFamily: FF }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          borderBottom: '1px solid var(--gray-30)',
          paddingBottom: 18,
          marginBottom: 20,
        }}
      >
        <div>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 24,
              fontWeight: 600,
              color: '#161B25',
              letterSpacing: '-0.015em',
            }}
          >
            Anomalies
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: 'var(--gray-95)',
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Anomalies are AI-detected patterns and trends in the monitors and their criterias.
          </p>
        </div>
        <div
          style={{
            display: 'inline-flex',
            borderRadius: 6,
            border: '1px solid var(--gray-30)',
            overflow: 'hidden',
          }}
        >
          {(['24h', '7d', '30d'] as const).map((r, i) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '6px 10px',
                borderLeft: i ? '1px solid var(--gray-30)' : 'none',
                background: range === r ? 'var(--gray-15)' : '#fff',
                color: range === r ? 'var(--gray-130)' : 'var(--gray-95)',
                cursor: 'pointer',
                border: 'none',
                fontFamily: FF,
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Story today — digest card */}
      <div
        style={{
          borderRadius: 10,
          border: '1px solid var(--gray-30)',
          background: '#fff',
          boxShadow: '0 1px 4px rgba(15,18,25,0.06)',
          overflow: 'hidden',
          marginBottom: 22,
          display: 'flex',
        }}
      >
        {/* Left accent bar */}
        <div style={{ width: 4, flexShrink: 0, background: 'var(--yellow-70, #f1c91e)' }} />

        <div style={{ flex: 1, padding: '16px 18px' }}>
          {/* Eyebrow row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--gray-90)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              Today's signal
            </span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 600,
                color: 'var(--gray-90)',
                background: 'var(--gray-15)',
                border: '1px solid var(--gray-30)',
                borderRadius: 4,
                padding: '1px 7px',
              }}
            >
              {range}
            </span>
          </div>

          {/* Headline */}
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: 'var(--gray-130)',
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              marginBottom: 8,
            }}
          >
            3 criteria across 2 monitors degrading on the same topic for 3 days
          </div>

          {/* Body */}
          <div
            style={{
              fontSize: 13,
              color: 'var(--gray-100)',
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            In the <strong>Refund Procedure Adherence</strong> monitor, <strong>Tone</strong> (wt 30) and{' '}
            <strong>Acknowledged frustration</strong> (wt 25) are both below threshold. In <strong>AICSAT</strong>,{' '}
            <strong>Customer confirmed solved</strong> (wt 20) is also failing. All 3 cluster on the topic{' '}
            <span
              style={{
                fontFamily: MONO,
                fontSize: 12,
                color: 'var(--gray-95)',
                background: 'var(--gray-15)',
                border: '1px solid var(--gray-30)',
                borderRadius: 4,
                padding: '1px 6px',
              }}
            >
              refund-denial
            </span>{' '}
            — 23 conversations affected over the last 3 days. <strong>Tone</strong> carries the highest weight and is
            the most actionable first step.
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => setInvestigatingId('c1')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '7px 14px',
              borderRadius: 6,
              border: '1px solid #1C6EF2',
              background: '#1C6EF2',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              fontFamily: FF,
              cursor: 'pointer',
              letterSpacing: '0.01em',
            }}
          >
            Review 23 conversations
            <span style={{ fontSize: 10 }}>→</span>
          </button>
        </div>
      </div>

      {/* Anomaly list — always-expanded cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {criteria.map((a) => {
          const isTuning = tuningId === a.id;
          const isHighlighted = highlightId === a.id;
          return (
            <div
              key={a.id}
              id={`anom-${a.id}`}
              style={{
                padding: '20px 22px',
                borderRadius: 12,
                border: isHighlighted ? '1px solid var(--blue-80)' : '1px solid var(--gray-30)',
                background: '#fff',
                boxShadow: isHighlighted
                  ? '0 0 0 3px rgba(28,110,242,0.45), 0 6px 18px rgba(28,110,242,0.18)'
                  : '0 1px 2px rgba(15,18,25,0.04)',
                scrollMarginTop: 80,
                transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
              }}
            >
              {isTuning ? (
                <TuneSensitivityPane a={a} onBack={() => setTuningId(null)} />
              ) : (
                <DetailPane a={a} onInvestigate={() => setInvestigatingId(a.id)} onTune={() => setTuningId(a.id)} />
              )}
            </div>
          );
        })}
      </div>

      {/* Hint footer */}
      <div
        style={{
          marginTop: 22,
          padding: '14px 18px',
          borderRadius: 10,
          border: '1px dashed var(--gray-40)',
          background: 'var(--gray-10)',
          fontSize: 13,
          color: 'var(--gray-100)',
          lineHeight: 1.55,
        }}
      >
        Each anomaly opens with its 14-day neighborhood. Use <strong>Investigate</strong> for the conversation cluster,{' '}
        <strong>Tune sensitivity</strong> to adjust the band.
      </div>

      <InvestigationDrawer open={!!investigating} a={investigating} onClose={() => setInvestigatingId(null)} />
    </div>
  );
};

/* export default AnomaliesTab */
Object.assign(window, { AnomaliesTab });
})();

// ─── cursor/MonitorsTab/MonitorCard.tsx ───────────────────────────────
(() => {
const { useEffect, useMemo, useRef, useState } = React;


const { buildReviewQueue } = window;
const ReviewPanel = window.ReviewPanel;
const { seedRefsForCriterion } = window;
const RubricRefEditor = window.RubricRefEditor;
const ButtonPrimary = window.ButtonPrimary;
const ButtonText = window.ButtonText;
const Icon = window.Icon;
const Pill = window.Pill;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const C = {
  border: '#dce0e9',
  red: '#dc2626',
  redBg: '#fef2f2',
  redBor: '#fecaca',
};

interface EditableCriterion extends MonitorCriterion {
  refs: RubricRef[];
}

const SEV_LABEL: Record<string, string> = {
  high: 'High',
  med: 'Medium',
  drift: 'Drift',
  pos: 'Positive',
};

interface Props {
  monitor: Monitor;
  goal: Goal | undefined;
  goals?: Goal[];
  hideLinkedGoal?: boolean;
  recommendedAnomaly?: Anomaly;
  anomalyByCriterion?: Record<string, Anomaly>;
  onViewAnomaly?: (anomalyId: string) => void;
}

const MonitorCard = ({
  monitor,
  goal,
  goals,
  hideLinkedGoal,
  recommendedAnomaly,
  anomalyByCriterion,
  onViewAnomaly,
}: Props) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [rubricModalCriterionIdx, setRubricModalCriterionIdx] = useState<number | null>(null);
  const [rubricModalReadOnly, setRubricModalReadOnly] = useState(false);
  const [name, setName] = useState(monitor.name);
  const [description, setDescription] = useState(monitor.description ?? '');
  const [passingScore, setPassingScore] = useState<number | ''>(monitor.passingScore ?? '');
  const [criteria, setCriteria] = useState<EditableCriterion[]>(() =>
    monitor.criteria.map((c) => {
      const seeded = seedRefsForCriterion(c);
      const rubricRef: RubricRef[] = c.inlineRubric ? [{ type: 'rubric' as const, slug: c.inlineRubric.name }] : [];
      return { ...c, refs: [...rubricRef, ...seeded] };
    }),
  );
  const [goalId, setGoalId] = useState<string>(monitor.goalIds?.[0] || '');
  const [kind, setKind] = useState<Monitor['kind']>(monitor.kind);
  const [toast, setToast] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const toastTimer = useRef<number | undefined>(undefined);

  const totalWeight = criteria.reduce((s, c) => s + (c.weight || 0), 0);

  const reviewQueue = useMemo(() => buildReviewQueue(monitor.id), [monitor.id]);

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);
  useEffect(() => {
    if (editing) setCriteriaOpen(true);
  }, [editing]);

  const flash = () => {
    setToast(true);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(false), 1800);
  };

  const [timeFilter, setTimeFilter] = useState<'7d' | '30d'>('7d');
  const [hoveredBarIdx, setHoveredBarIdx] = useState<number | null>(null);
  const [criteriaOpen, setCriteriaOpen] = useState(false);

  const hasAnomaly = !!recommendedAnomaly;
  const dotColor = hasAnomaly ? C.red : '#1C6EF2';

  // Compute the displayed trend slice
  const trendSlice = (() => {
    const t = monitor.trend;
    if (timeFilter === '7d') return t.slice(-7);
    return t;
  })();

  return (
    <div
      ref={cardRef}
      style={{
        background: '#fff',
        border: `1px solid ${C.border}`,
        borderRadius: 8,
        boxShadow: '0 2px 5px rgba(0,0,0,0.06)',
        overflow: 'hidden',
        fontFamily: FF,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          padding: '14px 20px 8px',
          gap: 10,
        }}
      >
        {/* Title row — dot + name input/label + pill, always on one line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
            }}
          />
          {editing ? (
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={flash}
              style={{
                font: '700 16px/22px Inter,sans-serif',
                color: '#1A1D23',
                border: '1px solid #DCE0E9',
                borderRadius: 6,
                padding: '2px 8px',
                background: '#fff',
                outline: 'none',
                minWidth: 0,
                flex: 1,
                fontFamily: FF,
              }}
            />
          ) : (
            <span
              title={description || undefined}
              style={{
                font: '700 16px/22px Inter,sans-serif',
                color: '#1A1D23',
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: description ? 'help' : 'default',
              }}
            >
              {name}
            </span>
          )}
          {/* Default/Custom pill removed for scannability — the red/blue status dot already signals state */}
        </div>
        {/* Edit / Done button — always top-right, never wraps */}
        <button
          type="button"
          onClick={() => {
            if (editing) flash();
            setEditing((v) => !v);
          }}
          style={{
            font: '500 12px/16px Inter,sans-serif',
            color: editing ? '#fff' : '#5A6478',
            background: editing ? '#1C6EF2' : 'transparent',
            border: editing ? '1px solid #1C6EF2' : '1px solid transparent',
            borderRadius: 6,
            padding: '5px 10px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 5,
            flexShrink: 0,
            fontFamily: FF,
            alignSelf: 'flex-start',
          }}
        >
          {editing ? (
            <>
              <Icon type="check" size="xSmall" />
              Done
            </>
          ) : (
            <>
              <Icon type="pen" size="xSmall" />
              Edit
            </>
          )}
        </button>
      </div>
      {/* Sub-header content (description, who-to-monitor, linked goal) */}
      <div
        style={{
          padding: '0 20px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}
      >
        {/* Description */}
        {editing ? (
          <textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              flash();
            }}
            rows={2}
            placeholder="Describe what this monitor measures…"
            style={{
              display: 'block',
              width: '100%',
              marginTop: 8,
              padding: '6px 10px',
              border: `1px solid ${C.border}`,
              borderRadius: 6,
              font: '400 12px/18px Inter,sans-serif',
              fontFamily: FF,
              color: '#1A1D23',
              outline: 'none',
              resize: 'vertical',
              boxSizing: 'border-box',
              background: '#fff',
            }}
          />
        ) : null}
        {/* Read-only description hidden from resting view (progressive disclosure).
            Available on the name's hover tooltip and inside Edit mode. */}

        {editing && (
          <div style={{ display: 'flex', gap: 16, paddingLeft: 18, marginTop: 4, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#8A94A6', alignSelf: 'center' }}>Who to monitor</span>
            {(
              [
                { value: 'aic', label: 'AI Agents' },
                { value: 'air', label: 'Agents' },
                { value: 'both', label: 'Both' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: '#1A1D23',
                  cursor: 'pointer',
                  fontFamily: FF,
                }}
              >
                <input
                  type="radio"
                  name={`monitor-kind-${monitor.id}`}
                  value={opt.value}
                  checked={kind === opt.value}
                  onChange={() => {
                    setKind(opt.value);
                    flash();
                  }}
                  style={{ accentColor: '#1C6EF2' }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        )}

        {!hideLinkedGoal && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              paddingLeft: 18,
            }}
          >
            <span
              style={{
                font: '400 11px/16px Inter,sans-serif',
                color: '#8A94A6',
                flexShrink: 0,
              }}
            >
              Linked goal:
            </span>
            {editing && goals ? (
              <select
                value={goalId}
                onChange={(e) => {
                  setGoalId(e.target.value);
                  flash();
                }}
                style={{
                  font: '600 12px/16px Inter,sans-serif',
                  color: goalId ? '#1C6EF2' : '#8A94A6',
                  background: '#fff',
                  border: '1px solid #DCE0E9',
                  borderRadius: 4,
                  padding: '2px 6px',
                  cursor: 'pointer',
                  outline: 'none',
                  fontFamily: FF,
                  maxWidth: 340,
                }}
              >
                <option value="">— No goal linked —</option>
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            ) : goal ? (
              <a
                style={{
                  font: '600 12px/16px Inter,sans-serif',
                  color: '#1C6EF2',
                  textDecoration: 'none',
                  cursor: 'pointer',
                }}
              >
                {goal.name}
              </a>
            ) : (
              <span style={{ font: '400 12px/16px Inter,sans-serif', color: '#8A94A6' }}>No goal linked</span>
            )}
          </div>
        )}
      </div>

      {/* Anomaly moved to chip in the bottom strip (progressive disclosure). */}

      {/* Trend graph */}
      {!editing &&
        (() => {
          const pts = trendSlice;
          const W = 400;
          const H = 64;
          const PY = 6;
          const PX = 8;

          // Fixed y-axis floor per metric kind — prevents flatline on tight ranges
          const Y_FLOOR: Record<string, number> = {
            csat_avg: 2.5,
            qa_score: 50,
          };
          const yMin = Y_FLOOR[monitor.metricKind] ?? 0;
          const yMax = Math.max(...pts) + (monitor.metricKind === 'csat_avg' ? 0.1 : 2);
          const range = yMax - yMin || 1;
          const toY = (v: number) => H - PY - ((v - yMin) / range) * (H - PY * 2);
          const slotW = (W - PX * 2) / pts.length;
          const barW = slotW * 0.65;

          const currentVal = pts[pts.length - 1];
          const firstVal = pts[0];
          const trending = currentVal < firstVal ? 'down' : currentVal > firstVal ? 'up' : 'flat';
          const trendColor = trending === 'down' ? C.red : trending === 'up' ? '#22A05B' : '#8A94A6';

          // QA-score monitors show the slice average; others show the most recent value.
          const eyebrowVal =
            monitor.metricKind === 'qa_score'
              ? parseFloat((pts.reduce((a, b) => a + b, 0) / pts.length).toFixed(1))
              : currentVal;

          return (
            <div
              style={{
                padding: '6px 20px 4px',
              }}
            >
              {/* Eyebrow row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ font: '700 22px/26px Inter,sans-serif', color: trendColor }}>
                  {eyebrowVal}
                  <span style={{ font: '500 13px/16px Inter,sans-serif', color: '#8A94A6', marginLeft: 4 }}>
                    {monitor.metricUnit}
                  </span>
                </span>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: `1px solid ${C.border}`,
                    borderRadius: 5,
                    overflow: 'hidden',
                  }}
                >
                  {(['7d', '30d'] as const).map((f, i) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setTimeFilter(f)}
                      style={{
                        padding: '3px 8px',
                        border: 'none',
                        borderLeft: i > 0 ? `1px solid ${C.border}` : 'none',
                        background: timeFilter === f ? '#1C6EF2' : '#fff',
                        color: timeFilter === f ? '#fff' : '#5A6478',
                        font: '600 10px/14px Inter,sans-serif',
                        fontFamily: FF,
                        cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* SVG bar chart */}
              <div style={{ position: 'relative' }}>
                <svg
                  viewBox={`0 0 ${W} ${H}`}
                  style={{ width: '100%', height: H, display: 'block', marginBottom: 4 }}
                  preserveAspectRatio="none"
                  onMouseLeave={() => setHoveredBarIdx(null)}
                >
                  {/* Baseline floor */}
                  <line x1={PX} y1={H - PY} x2={W - PX} y2={H - PY} stroke="#F0F2F6" strokeWidth={1} />
                  {/* Bars */}
                  {pts.map((v, i) => {
                    const isLast = i === pts.length - 1;
                    const isHovered = hoveredBarIdx === i;
                    const x = PX + i * slotW + (slotW - barW) / 2;
                    const barH = Math.max(1, toY(yMin) - toY(v));
                    const y = toY(v);
                    return (
                      <rect
                        key={i}
                        x={x}
                        y={y}
                        width={barW}
                        height={barH}
                        rx={2}
                        fill={trendColor}
                        opacity={isHovered ? 1 : isLast ? 0.85 : 0.35}
                        style={{ cursor: 'default' }}
                        onMouseEnter={() => setHoveredBarIdx(i)}
                      />
                    );
                  })}
                </svg>
                {/* Hover tooltip */}
                {hoveredBarIdx !== null &&
                  (() => {
                    const v = pts[hoveredBarIdx];
                    const pct = ((PX + hoveredBarIdx * slotW + slotW / 2) / W) * 100;
                    return (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '100%',
                          left: `${pct}%`,
                          transform: 'translateX(-50%)',
                          background: '#1A1D23',
                          color: '#fff',
                          font: '600 11px/14px Inter,sans-serif',
                          fontFamily: FF,
                          padding: '3px 7px',
                          borderRadius: 4,
                          whiteSpace: 'nowrap',
                          pointerEvents: 'none',
                          zIndex: 10,
                        }}
                      >
                        {v}
                        {monitor.metricUnit}
                      </div>
                    );
                  })()}
              </div>
            </div>
          );
        })()}

      {/* Scoring criteria accordion */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
        }}
      >
        {/* Action bar — uniform row of buttons at the bottom of the card. */}
        {!editing && (() => {
          const matchCount = anomalyByCriterion ? criteria.filter((c) => anomalyByCriterion[c.name]).length : 0;
          const items = [];
          if (hasAnomaly && recommendedAnomaly) {
            items.push({
              key: 'anomaly',
              onClick: () => onViewAnomaly?.(recommendedAnomaly.id),
              disabled: !onViewAnomaly,
              title: `${recommendedAnomaly.metric} — ${recommendedAnomaly.head}`,
              leading: (
                <span
                  aria-hidden="true"
                  style={{
                    width: 14,
                    height: 14,
                    borderRadius: 999,
                    background: '#F1C91E',
                    color: '#584E1C',
                    fontSize: 10,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  !
                </span>
              ),
              label: 'View anomaly',
              trailing: null,
            });
          }
          items.push({
            key: 'criteria',
            onClick: () => setCriteriaOpen((v) => !v),
            title: `${criteria.length} scoring criteria${matchCount > 0 ? ` · ${matchCount} flagged` : ''}`,
            active: criteriaOpen,
            leading: null,
            label: `Criteria (${criteria.length})`,
            trailing: matchCount > 0 ? (
              <span
                style={{
                  font: '600 10px/14px Inter,sans-serif',
                  color: '#9E181E',
                  background: '#FFE8E9',
                  border: '1px solid #FFAAAD',
                  borderRadius: 10,
                  padding: '0 6px',
                  flexShrink: 0,
                }}
              >
                {matchCount}
              </span>
            ) : null,
          });
          items.push({
            key: 'review',
            onClick: () => setReviewOpen(true),
            title: 'Review conversations evaluated by this monitor',
            leading: null,
            label: 'Review conversations',
            trailing: <span aria-hidden="true" style={{ color: '#1C6EF2', fontSize: 12 }}>→</span>,
          });
          return (
            <div style={{ display: 'flex', alignItems: 'stretch', width: '100%' }}>
              {items.map((it, i) => (
                <button
                  type="button"
                  key={it.key}
                  onClick={it.onClick}
                  disabled={it.disabled}
                  title={it.title}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '12px 14px',
                    background: it.active ? '#F4F5F7' : 'transparent',
                    border: 'none',
                    borderLeft: i === 0 ? 'none' : `1px solid ${C.border}`,
                    cursor: it.disabled ? 'default' : 'pointer',
                    font: '600 12px/16px Inter,sans-serif',
                    fontFamily: FF,
                    color: it.disabled ? '#B5BCC9' : '#1A1D23',
                  }}
                >
                  {it.leading}
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0 }}>
                    {it.label}
                  </span>
                  {it.trailing}
                </button>
              ))}
            </div>
          );
        })()}

        {/* Edit-mode accordion header — kept for the weight-validation feedback */}
        {editing && (
          <button
            type="button"
            onClick={() => setCriteriaOpen((v) => !v)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              width: '100%',
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              fontFamily: FF,
            }}
          >
            <span style={{ font: '600 13px/18px Inter,sans-serif', color: '#1A1D23', flex: 1 }}>Monitor Criteria</span>
            <Pill
              type={totalWeight === 100 ? 'success' : 'danger'}
              message={totalWeight === 100 ? '✓ Total weight: 100%' : `⚠ ${totalWeight}% — must equal 100%`}
              removeIcon
            />
            <span
              style={{
                font: '400 14px/1 Inter,sans-serif',
                color: '#8A94A6',
                flexShrink: 0,
                transform: criteriaOpen ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.15s',
                display: 'inline-block',
              }}
            >
              ▾
            </span>
          </button>
        )}

        {/* Accordion body */}
        {criteriaOpen && (
          <div style={{ padding: '0 20px 14px' }}>
            <div
              style={{
                font: '400 11px/16px Inter,sans-serif',
                color: '#5A6478',
                marginBottom: 12,
              }}
            >
              Choose what the AI should evaluate in conversations. Each item contributes to the final score. Total
              weight must equal 100%.
            </div>

            {/* Passing score — edit mode only */}
            {editing && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 12px',
                  background: '#F4F5F7',
                  borderRadius: 7,
                  marginBottom: 12,
                }}
              >
                <label
                  style={{
                    font: '600 11px/14px Inter,sans-serif',
                    color: '#5A6478',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Passing score (out of 100)
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={passingScore}
                  onChange={(e) => {
                    const v = e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value)));
                    setPassingScore(v);
                    flash();
                  }}
                  style={{
                    width: 64,
                    padding: '4px 8px',
                    border: `1px solid ${C.border}`,
                    borderRadius: 5,
                    font: '400 12px/18px Inter,sans-serif',
                    fontFamily: FF,
                    color: '#1A1D23',
                    outline: 'none',
                    background: '#fff',
                  }}
                />
                <span
                  style={{
                    font: '400 11px/15px Inter,sans-serif',
                    color: '#8A94A6',
                  }}
                >
                  Conversations at or above this score count as passing.
                </span>
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {criteria.map((c, idx) =>
                editing ? (
                  <div
                    key={idx}
                    style={{
                      padding: '10px 12px',
                      background: '#fff',
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        value={c.name || ''}
                        onChange={(e) =>
                          setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, name: e.target.value } : x)))
                        }
                        onBlur={flash}
                        placeholder="Criterion name"
                        style={{
                          flex: 1,
                          minWidth: 0,
                          padding: '5px 8px',
                          borderRadius: 5,
                          border: '1px solid #DCE0E9',
                          font: '600 12px/16px Inter,sans-serif',
                          fontFamily: FF,
                          color: '#1A1D23',
                          outline: 'none',
                          background: '#fff',
                        }}
                      />
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          background: '#fff',
                          overflow: 'hidden',
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={c.weight ?? 0}
                          onChange={(e) => {
                            const v = e.target.value === '' ? 0 : parseInt(e.target.value, 10) || 0;
                            setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, weight: v } : x)));
                          }}
                          onBlur={(e) => {
                            const v = Math.max(0, Math.min(100, parseInt(e.target.value, 10) || 0));
                            setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, weight: v } : x)));
                            flash();
                          }}
                          title="Weight"
                          style={{
                            width: 42,
                            padding: '4px 6px',
                            border: 'none',
                            outline: 'none',
                            font: '600 12px/16px Inter,sans-serif',
                            color: '#1A1D23',
                            textAlign: 'right',
                            background: 'transparent',
                            fontFamily: FF,
                          }}
                        />
                        <span
                          style={{
                            font: '400 11px/16px Inter,sans-serif',
                            color: '#8A94A6',
                            paddingRight: 6,
                          }}
                        >
                          %
                        </span>
                      </div>
                      <label
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 5,
                          font: '500 11px/14px Inter,sans-serif',
                          color: '#5A6478',
                          cursor: 'pointer',
                          paddingLeft: 8,
                          borderLeft: `1px solid ${C.border}`,
                          flexShrink: 0,
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={!!c.essential}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, essential: checked } : x)));
                            flash();
                          }}
                          style={{ accentColor: '#1C6EF2' }}
                        />
                        Must pass
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setCriteria((prev) => prev.filter((_, i) => i !== idx));
                          flash();
                        }}
                        title="Remove criterion"
                        style={{
                          background: 'none',
                          border: '1px solid #DCE0E9',
                          borderRadius: 5,
                          padding: '2px 7px',
                          height: 24,
                          cursor: 'pointer',
                          color: '#8A94A6',
                          fontSize: 14,
                          lineHeight: 1,
                          flexShrink: 0,
                        }}
                      >
                        ×
                      </button>
                    </div>
                    <RubricRefEditor
                      refs={c.refs}
                      onChange={(next) => {
                        setCriteria((prev) => prev.map((x, i) => (i === idx ? { ...x, refs: next } : x)));
                        flash();
                      }}
                      onWriteRubric={() => {
                        setRubricModalCriterionIdx(idx);
                        setRubricModalReadOnly(false);
                      }}
                      onClickRubricRef={() => {
                        setRubricModalCriterionIdx(idx);
                        setRubricModalReadOnly(true);
                      }}
                    />
                  </div>
                ) : (
                  <div
                    key={idx}
                    style={{
                      padding: '8px 12px',
                      background: '#fff',
                      border: `1px solid ${C.border}`,
                      borderRadius: 7,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 12,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0, flex: 1 }}>
                      <span
                        style={{
                          font: '600 12px/16px Inter,sans-serif',
                          color: '#1A1D23',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.name || 'Untitled criterion'}
                      </span>
                      {c.essential && <Pill type="alert" message="Must pass" removeIcon />}
                      {anomalyByCriterion?.[c.name] && (
                        <button
                          type="button"
                          title="Open anomaly detail"
                          onClick={(e) => {
                            e.stopPropagation();
                            const a = anomalyByCriterion[c.name];
                            onViewAnomaly?.(a.id);
                          }}
                          disabled={!onViewAnomaly}
                          style={{
                            font: '600 10px/14px Inter,sans-serif',
                            color: '#9E181E',
                            background: '#FFE8E9',
                            border: '1px solid #FFAAAD',
                            borderRadius: 4,
                            padding: '1px 7px 1px 6px',
                            flexShrink: 0,
                            cursor: onViewAnomaly ? 'pointer' : 'default',
                            letterSpacing: '0.03em',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 3,
                            fontFamily: FF,
                          }}
                        >
                          Anomaly{' '}
                          <span aria-hidden="true" style={{ fontSize: 9 }}>
                            →
                          </span>
                        </button>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                      <span style={{ font: '400 11px/14px Inter,sans-serif', color: '#8A94A6' }}>
                        Weight {c.weight || 0}%
                      </span>
                      <span
                        style={{
                          font: '600 12px/14px Inter,sans-serif',
                          color: c.pass >= 80 ? '#22A05B' : c.pass >= 65 ? '#D4A017' : C.red,
                          minWidth: 54,
                          textAlign: 'right',
                        }}
                      >
                        {c.pass != null ? `${c.pass}% pass` : '—'}
                      </span>
                    </div>
                  </div>
                ),
              )}
            </div>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setCriteria((prev) => [
                    ...prev,
                    { name: '', weight: 0, essential: false, pass: 0, source: '', refs: [] },
                  ]);
                  flash();
                }}
                style={{
                  marginTop: 8,
                  padding: '8px 12px',
                  borderRadius: 6,
                  border: `1px dashed ${C.border}`,
                  background: '#fff',
                  cursor: 'pointer',
                  font: '500 12px/16px Inter,sans-serif',
                  color: '#5A6478',
                  width: '100%',
                  textAlign: 'left',
                  fontFamily: FF,
                }}
              >
                + Add evaluation item
              </button>
            )}
          </div>
        )}
      </div>

      {/* Edit log collapsible content */}
      {monitor.editLog && monitor.editLog.length > 0 && showLog && (
        <div style={{ borderTop: `1px solid ${C.border}`, padding: '10px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {monitor.editLog.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, fontSize: 12 }}>
                <span style={{ color: '#8A94A6', flexShrink: 0, minWidth: 48 }}>{e.date}</span>
                <span style={{ color: '#5A6478', flexShrink: 0 }}>{e.who}</span>
                <span style={{ color: '#1A1D23' }}>{e.change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Resting-state footer removed \u2014 Review conversations moved into the chips strip above. */}

      <ReviewPanel open={reviewOpen} monitor={monitor} queue={reviewQueue} onClose={() => setReviewOpen(false)} />

      {rubricModalCriterionIdx !== null &&
        (() => {
          const rc = criteria[rubricModalCriterionIdx];
          const closeModal = () => {
            setRubricModalCriterionIdx(null);
            setRubricModalReadOnly(false);
          };
          return (
            <CustomRubricModal
              criterionName={rc?.name ?? ''}
              initialRubric={rc?.inlineRubric}
              initialBands={seedBandsFromCriterion(rc)}
              readOnly={rubricModalReadOnly}
              onClose={closeModal}
              onSave={(slug) => {
                setCriteria((prev) =>
                  prev.map((c, i) =>
                    i === rubricModalCriterionIdx ? { ...c, refs: [...c.refs, { type: 'rubric' as const, slug }] } : c,
                  ),
                );
                closeModal();
                flash();
              }}
            />
          );
        })()}

      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1A1D23',
            color: '#fff',
            font: '600 13px/20px Inter,sans-serif',
            padding: '10px 18px',
            borderRadius: 8,
            zIndex: 100,
            whiteSpace: 'nowrap',
            boxShadow: '0 6px 20px rgba(15,18,25,0.22)',
          }}
        >
          ✓ Changes saved
        </div>
      )}
    </div>
  );
};

interface Band {
  lo: number;
  hi: number;
  text: string;
  passing: boolean;
}

/** Generate 4 bands pre-seeded from a criterion's baseline + criterionThreshold values. */
const seedBandsFromCriterion = (c: MonitorCriterion | undefined): Band[] | null => {
  if (!c || c.baseline == null || c.criterionThreshold == null) return null;
  const t = c.criterionThreshold;
  const b = c.baseline;
  const scale = b <= 5 ? 1.0 : 0; // /5 scale floor
  return [
    { lo: scale, hi: Math.round((t - 0.6) * 10) / 10, passing: false, text: '' },
    { lo: Math.round((t - 0.5) * 10) / 10, hi: Math.round((t - 0.1) * 10) / 10, passing: false, text: '' },
    { lo: t, hi: b, passing: true, text: '' },
    { lo: Math.round((b + 0.1) * 10) / 10, hi: b <= 5 ? 5.0 : 100, passing: true, text: '' },
  ];
};

interface CustomRubricModalProps {
  criterionName: string;
  initialRubric?: CriterionRubric;
  initialBands?: Band[] | null;
  readOnly?: boolean;
  onClose: () => void;
  onSave: (rubricSlug: string) => void;
}

const BAND_PLACEHOLDERS = [
  'Describe what makes a conversation land in this range. What is clearly missing or wrong?',
  'Describe what a conversation in this range looks like. Some things are right but key elements are absent.',
  'Describe a mostly passing conversation in this range. What holds it back from full marks?',
  'Describe what a high-scoring conversation looks like. What does it get right?',
];

const DEFAULT_BANDS: Band[] = [
  { lo: 0, hi: 25, text: '', passing: false },
  { lo: 26, hi: 50, text: '', passing: false },
  { lo: 51, hi: 75, text: '', passing: false },
  { lo: 76, hi: 100, text: '', passing: true },
];

const bandColor = (passing: boolean, rank: 'low' | 'mid' | 'high') => {
  if (passing) return { color: '#22A05B', bg: '#F0FDF4', border: '#BBF7D0' };
  if (rank === 'low') return { color: '#DC2626', bg: '#FEF2F2', border: '#FECACA' };
  if (rank === 'mid') return { color: '#D97706', bg: '#FFFBEB', border: '#FDE68A' };
  return { color: '#5A6478', bg: '#F4F5F7', border: '#DCE0E9' };
};

const bandRank = (i: number, total: number): 'low' | 'mid' | 'high' => {
  if (i < total / 3) return 'low';
  if (i < (2 * total) / 3) return 'mid';
  return 'high';
};

const CustomRubricModal = ({
  criterionName,
  initialRubric,
  initialBands,
  readOnly = false,
  onClose,
  onSave,
}: CustomRubricModalProps) => {
  const [name, setName] = useState(initialRubric?.name ?? criterionName);
  const [bands, setBands] = useState<Band[]>(() => {
    if (initialRubric?.bands?.length) return initialRubric.bands as Band[];
    if (initialBands?.length) return initialBands;
    return DEFAULT_BANDS;
  });
  // readOnly starts locked; Edit button unlocks in-place without closing
  const [isEditing, setIsEditing] = useState(!readOnly);

  const updateBand = (i: number, patch: Partial<Band>) =>
    setBands((prev) => prev.map((b, j) => (j === i ? { ...b, ...patch } : b)));

  const addBand = () => {
    setBands((prev) => {
      const last = prev[prev.length - 1];
      const newLo = Math.min(last.hi + 1, 100);
      return [...prev, { lo: newLo, hi: 100, text: '', passing: false }];
    });
  };

  const removeBand = (i: number) => setBands((prev) => prev.filter((_, j) => j !== i));

  const passingCount = bands.filter((b) => b.passing).length;

  const handleSave = () => {
    const slug = `custom-${
      name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 32) || 'rubric'
    }`;
    onSave(slug);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(15,18,25,0.45)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          background: '#fff',
          borderRadius: 10,
          boxShadow: '0 16px 48px rgba(15,18,25,0.22)',
          width: '100%',
          maxWidth: 600,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: FF,
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <span style={{ font: '700 15px/20px Inter,sans-serif', color: '#1A1D23' }}>
            {isEditing ? 'Edit rubric' : name || 'Custom rubric'}
          </span>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              font: '400 18px/1 Inter,sans-serif',
              color: '#8A94A6',
              padding: '2px 6px',
            }}
          >
            ×
          </button>
        </div>

        {/* Modal body */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Criterion name */}
          <div>
            <label
              style={{
                display: 'block',
                font: '600 11px/16px Inter,sans-serif',
                color: '#5A6478',
                marginBottom: 6,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Criterion
            </label>
            {isEditing ? (
              <textarea
                value={name}
                onChange={(e) => setName(e.target.value)}
                rows={2}
                placeholder="Describe the criterion being evaluated…"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  font: '500 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#1A1D23',
                  outline: 'none',
                  resize: 'vertical',
                  boxSizing: 'border-box',
                }}
              />
            ) : (
              <p style={{ margin: 0, font: '500 13px/18px Inter,sans-serif', color: '#1A1D23' }}>{name}</p>
            )}
          </div>

          {/* Score band descriptions */}
          <div>
            <label
              style={{
                display: 'block',
                font: '600 11px/16px Inter,sans-serif',
                color: '#5A6478',
                marginBottom: 10,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
              }}
            >
              Score bands
            </label>
            {isEditing && (
              <p style={{ margin: '0 0 14px', font: '400 12px/16px Inter,sans-serif', color: '#8A94A6' }}>
                Explain why a conversation would score in each range. Check the bands that count as passing.
              </p>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {bands.map((band, i) => {
                const { color, bg, border } = bandColor(band.passing, bandRank(i, bands.length));
                const placeholder = BAND_PLACEHOLDERS[Math.min(i, BAND_PLACEHOLDERS.length - 1)];
                return (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    {/* Left: range + passing */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0, paddingTop: 2 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        {isEditing ? (
                          <>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={band.lo}
                              onChange={(e) =>
                                updateBand(i, { lo: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
                              }
                              style={{
                                width: 46,
                                padding: '4px 6px',
                                border: `1px solid ${border}`,
                                borderRadius: 4,
                                font: '700 11px/14px Inter,sans-serif',
                                fontFamily: FF,
                                color,
                                background: bg,
                                outline: 'none',
                                textAlign: 'center',
                              }}
                            />
                            <span style={{ font: '700 11px/14px Inter,sans-serif', color: '#8A94A6' }}>–</span>
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={band.hi}
                              onChange={(e) =>
                                updateBand(i, { hi: Math.max(0, Math.min(100, parseInt(e.target.value) || 0)) })
                              }
                              style={{
                                width: 46,
                                padding: '4px 6px',
                                border: `1px solid ${border}`,
                                borderRadius: 4,
                                font: '700 11px/14px Inter,sans-serif',
                                fontFamily: FF,
                                color,
                                background: bg,
                                outline: 'none',
                                textAlign: 'center',
                              }}
                            />
                          </>
                        ) : (
                          <span
                            style={{
                              font: '700 11px/14px Inter,sans-serif',
                              color,
                              background: bg,
                              border: `1px solid ${border}`,
                              borderRadius: 4,
                              padding: '3px 8px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {band.lo} – {band.hi}
                          </span>
                        )}
                      </div>
                      {isEditing ? (
                        <label
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 5,
                            cursor: 'pointer',
                            font: '600 11px/14px Inter,sans-serif',
                            fontFamily: FF,
                            color: band.passing ? '#22A05B' : '#8A94A6',
                            userSelect: 'none',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={band.passing}
                            onChange={(e) => updateBand(i, { passing: e.target.checked })}
                            style={{ accentColor: '#22A05B', width: 13, height: 13 }}
                          />
                          Passing
                        </label>
                      ) : (
                        <span
                          style={{
                            font: '600 10px/14px Inter,sans-serif',
                            color: band.passing ? '#22A05B' : '#8A94A6',
                          }}
                        >
                          {band.passing ? '✓ Passing' : '✗ Failing'}
                        </span>
                      )}
                    </div>

                    {/* Band text */}
                    {isEditing ? (
                      <textarea
                        value={band.text}
                        onChange={(e) => updateBand(i, { text: e.target.value })}
                        rows={3}
                        placeholder={placeholder}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          border: `1px solid ${C.border}`,
                          borderRadius: 6,
                          font: '400 12px/18px Inter,sans-serif',
                          fontFamily: FF,
                          color: '#1A1D23',
                          outline: 'none',
                          resize: 'vertical',
                          boxSizing: 'border-box',
                        }}
                      />
                    ) : (
                      <p
                        style={{
                          flex: 1,
                          margin: 0,
                          font: '400 12px/18px Inter,sans-serif',
                          color: band.text ? '#1A1D23' : '#8A94A6',
                          fontStyle: band.text ? 'normal' : 'italic',
                          paddingTop: 2,
                        }}
                      >
                        {band.text || placeholder}
                      </p>
                    )}

                    {/* Remove button — edit only */}
                    {isEditing && bands.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeBand(i)}
                        title="Remove band"
                        style={{
                          flexShrink: 0,
                          marginTop: 4,
                          padding: '3px 7px',
                          border: `1px solid ${C.border}`,
                          borderRadius: 4,
                          background: '#fff',
                          font: '600 13px/16px Inter,sans-serif',
                          fontFamily: FF,
                          color: '#8A94A6',
                          cursor: 'pointer',
                          lineHeight: 1,
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#FEF2F2';
                          e.currentTarget.style.color = '#DC2626';
                          e.currentTarget.style.borderColor = '#FECACA';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = '#fff';
                          e.currentTarget.style.color = '#8A94A6';
                          e.currentTarget.style.borderColor = C.border;
                        }}
                      >
                        ×
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add band — edit only */}
            {isEditing && (
              <>
                <button
                  type="button"
                  onClick={addBand}
                  style={{
                    marginTop: 10,
                    padding: '6px 12px',
                    border: `1px dashed ${C.border}`,
                    borderRadius: 6,
                    background: 'transparent',
                    font: '600 12px/16px Inter,sans-serif',
                    fontFamily: FF,
                    color: '#1C6EF2',
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'center',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#EFF6FF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  + Add band
                </button>
                <p style={{ margin: '8px 0 0', font: '400 11px/16px Inter,sans-serif', color: '#8A94A6' }}>
                  Passing bands:{' '}
                  <strong style={{ color: passingCount > 0 ? '#22A05B' : '#DC2626' }}>{passingCount}</strong> of{' '}
                  {bands.length}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 10,
            padding: '14px 20px',
            borderTop: `1px solid ${C.border}`,
          }}
        >
          {!isEditing ? (
            <>
              <button
                type="button"
                onClick={onClose}
                style={{
                  padding: '7px 16px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  background: '#fff',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#5A6478',
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                style={{
                  padding: '7px 16px',
                  border: '1px solid #1C6EF2',
                  borderRadius: 6,
                  background: '#EFF6FF',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#1C6EF2',
                  cursor: 'pointer',
                }}
              >
                Edit rubric
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => {
                  if (readOnly) {
                    // cancel edit — revert to initial values and go back to read-only
                    setName(initialRubric?.name ?? criterionName);
                    setBands(() => {
                      if (initialRubric?.bands?.length) return initialRubric.bands as Band[];
                      if (initialBands?.length) return initialBands;
                      return DEFAULT_BANDS;
                    });
                    setIsEditing(false);
                  } else {
                    onClose();
                  }
                }}
                style={{
                  padding: '7px 16px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 6,
                  background: '#fff',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#5A6478',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                style={{
                  padding: '7px 16px',
                  border: '1px solid #1C6EF2',
                  borderRadius: 6,
                  background: '#1C6EF2',
                  font: '600 13px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: '#fff',
                  cursor: 'pointer',
                }}
              >
                Save rubric
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/* export default MonitorCard */
Object.assign(window, { MonitorCard });
})();

// ─── cursor/MonitorsTab/MonitorsTab.tsx ───────────────────────────────
(() => {
const { useCallback, useMemo, useRef, useState } = React;

const { STUB_GOALS, STUB_MONITORS } = window;
const { Monitor } = window;
const { ANOMALY_BY_CRITERION, getRecommendedAnomalyForMonitor } = window;
const MonitorCard = window.MonitorCard;
const ButtonPrimary = window.ButtonPrimary;
const InputSearch = window.InputSearch;
const useElementWidth = window.useElementWidth;

interface Props {
  onViewAnomaly?: (anomalyId: string) => void;
  onStartCreate?: () => void;
}

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const C = {
  border: '#dce0e9',
  surface: '#ffffff',
  textPrimary: '#1A1D23',
  textSec: '#5A6478',
  textMuted: '#8A94A6',
};

// Grip handle SVG — 6 dots in a 2×3 grid
const GripIcon = () => (
  <svg width="10" height="14" viewBox="0 0 10 14" fill="none" style={{ display: 'block' }}>
    {[0, 4].map((cx) =>
      [1, 5, 9].map((cy) => <circle key={`${cx}-${cy}`} cx={cx + 2} cy={cy + 1} r={1.2} fill="#C1C7D4" />),
    )}
  </svg>
);

const MonitorsTab = ({ onViewAnomaly, onStartCreate }: Props) => {
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const containerWidth = useElementWidth(containerRef);
  const cols = 2;
  const goalById = useMemo(() => Object.fromEntries(STUB_GOALS.map((g) => [g.id, g])), []);

  // Ordered monitor lists (local state so drag-reorder persists during session)
  const [defaultOrder, setDefaultOrder] = useState<Monitor[]>(() => STUB_MONITORS.filter((m) => m.isDefault));
  const [customOrder, setCustomOrder] = useState<Monitor[]>(() => STUB_MONITORS.filter((m) => !m.isDefault));

  // Drag state
  const dragSrc = useRef<{ list: 'default' | 'custom'; idx: number } | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  const reorder = useCallback((list: 'default' | 'custom', fromIdx: number, toIdx: number) => {
    if (fromIdx === toIdx) return;
    const setter = list === 'default' ? setDefaultOrder : setCustomOrder;
    setter((prev) => {
      const next = [...prev];
      const [item] = next.splice(fromIdx, 1);
      next.splice(toIdx, 0, item);
      return next;
    });
  }, []);

  const q = query.trim().toLowerCase();
  const matches = (m: Monitor) => {
    if (!q) return true;
    if (m.name.toLowerCase().includes(q)) return true;
    if (m.criteria.some((c) => c.name.toLowerCase().includes(q))) return true;
    const goal = goalById[m.goalIds[0]];
    if (goal && goal.name.toLowerCase().includes(q)) return true;
    return false;
  };

  const defaults = defaultOrder.filter(matches);
  const customs = customOrder.filter(matches);
  const totalVisible = defaults.length + customs.length;

  return (
    <div ref={containerRef} style={{ fontFamily: FF }}>
      {/* Page header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 24,
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <h1
            style={{
              margin: '0 0 4px',
              fontSize: 24,
              fontWeight: 600,
              color: '#161B25',
              letterSpacing: '-0.015em',
            }}
          >
            Monitors
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: C.textSec,
              lineHeight: 1.6,
              maxWidth: 720,
            }}
          >
            Monitors evaluate conversations against quality criteria to surface trends, flagged conversations, and
            review candidates across AI and human-assisted interactions.
          </p>
        </div>
        <div style={{ flexShrink: 0 }}>
          <ButtonPrimary onClick={() => onStartCreate?.()} icon="plus" size="small">
            Add monitoring
          </ButtonPrimary>
        </div>
      </div>

      {/* Filter bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '10px 12px',
          marginBottom: 14,
          background: '#fff',
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          position: 'sticky',
          top: 8,
          zIndex: 10,
          boxShadow: '0 1px 2px rgba(15,18,25,0.04)',
        }}
      >
        <div style={{ flex: 1, maxWidth: 380 }}>
          <InputSearch
            value={query}
            onChange={(val) => setQuery(val)}
            onClear={() => setQuery('')}
            placeholder="Search monitors, criteria, or linked goals…"
          />
        </div>

        <div
          style={{
            width: 1,
            alignSelf: 'stretch',
            background: C.border,
            margin: '0 2px',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ font: '500 12px/16px Inter,sans-serif', color: '#5A6478' }}>Jump to:</span>
          <select
            value=""
            onChange={(e) => {
              const id = e.target.value;
              if (!id) return;
              const el = document.getElementById(`mon-${id}`);
              el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              e.target.value = '';
            }}
            style={{
              padding: '6px 8px',
              borderRadius: 6,
              border: `1px solid ${C.border}`,
              font: '500 12px/16px Inter,sans-serif',
              fontFamily: FF,
              color: '#1A1D23',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none',
              height: 32,
              minWidth: 200,
            }}
          >
            <option value="">{'Select monitor\u2026'}</option>
            {STUB_MONITORS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: 1 }} />

        <span style={{ font: '500 12px/16px Inter,sans-serif', color: '#8A94A6' }}>
          {q ? `${totalVisible} of ${STUB_MONITORS.length} match` : `${STUB_MONITORS.length} monitors`}
        </span>
      </div>

      {/* Monitors grid — all monitors render in one shared 2-up grid so cards always pair side-by-side */}
      {(defaults.length > 0 || customs.length > 0) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            gap: 14,
            marginBottom: 24,
          }}
        >
          {[
            ...defaults.map((m, idx) => ({ m, list: 'default' as const, idx })),
            ...customs.map((m, idx) => ({ m, list: 'custom' as const, idx })),
          ].map(({ m, list, idx }) => {
            const isOver = overKey === `${list}-${idx}`;
            return (
              <div
                key={m.id}
                id={`mon-${m.id}`}
                draggable
                onDragStart={(e) => {
                  dragSrc.current = { list, idx };
                  e.dataTransfer.effectAllowed = 'move';
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'move';
                  setOverKey(`${list}-${idx}`);
                }}
                onDragLeave={() => setOverKey(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setOverKey(null);
                  // Only allow reordering within the same list (defaults vs customs).
                  if (dragSrc.current?.list === list) {
                    reorder(list, dragSrc.current.idx, idx);
                  }
                  dragSrc.current = null;
                }}
                onDragEnd={() => {
                  setOverKey(null);
                  dragSrc.current = null;
                }}
                style={{
                  borderRadius: 10,
                  scrollMarginTop: 80,
                  minWidth: 0,
                  position: 'relative',
                  outline: isOver ? `2px dashed #1C6EF2` : '2px solid transparent',
                  outlineOffset: 2,
                  transition: 'outline-color 0.1s',
                }}
              >
                {/* Drag handle */}
                <div
                  title="Drag to reorder"
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: -18,
                    zIndex: 5,
                    cursor: 'grab',
                    padding: '4px 3px',
                    opacity: 0.5,
                  }}
                >
                  <GripIcon />
                </div>
                <MonitorCard
                  monitor={m}
                  goal={goalById[m.goalIds[0]]}
                  goals={STUB_GOALS}
                  hideLinkedGoal
                  recommendedAnomaly={getRecommendedAnomalyForMonitor(m.id)}
                  anomalyByCriterion={ANOMALY_BY_CRITERION}
                  onViewAnomaly={onViewAnomaly}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Empty states: search produced no results, or no custom monitors exist yet */}
      <div>
        {q && totalVisible === 0 ? (
          <div
            style={{
              padding: '24px 20px',
              border: `1px dashed ${C.border}`,
              borderRadius: 10,
              background: C.surface,
              textAlign: 'center',
              fontSize: 13,
              color: C.textMuted,
            }}
          >
            {'No monitors match \u201c'}
            {query}
            {'\u201d.'}
          </div>
        ) : !q && customOrder.length === 0 ? (
          <div
            style={{
              padding: '24px 20px',
              border: `1px dashed ${C.border}`,
              borderRadius: 10,
              background: C.surface,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: C.textPrimary,
                marginBottom: 4,
              }}
            >
              No custom monitor yet
            </div>
            <div
              style={{
                fontSize: 12,
                color: C.textMuted,
                marginBottom: 14,
                lineHeight: 1.5,
              }}
            >
              Add a monitor tailored to your business. Conversations are scored automatically &mdash; results are
              surfaced for your review.
            </div>
            <ButtonPrimary onClick={() => onStartCreate?.()} icon="plus" size="small">
              Add monitoring
            </ButtonPrimary>
          </div>
        ) : null}
      </div>
    </div>
  );
};

/* export default MonitorsTab */
Object.assign(window, { MonitorsTab });
})();

// ─── cursor/MonitorsTab/CreateMonitorPanel.tsx ───────────────────────────────
(() => {
const { useState, useRef } = React;


const { seedRefsForCriterion } = window;
const Drawer = window.Drawer;
const RubricRefEditor = window.RubricRefEditor;
const ButtonPrimary = window.ButtonPrimary;
const ButtonSecondary = window.ButtonSecondary;
const ButtonText = window.ButtonText;
const IconButton = window.IconButton;
const Icon = window.Icon;
const { CopilotContainer } = window;

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const C = {
  border: '#dce0e9',
  surface: '#ffffff',
  textPrimary: '#1A1D23',
  textSec: '#5A6478',
  textMuted: '#8A94A6',
  blue: '#1C6EF2',
  blueBg: '#F5F8FF',
  blueBorder: '#DCE6FF',
};

// ---------------------------------------------------------------------------
// Static configuration data
// ---------------------------------------------------------------------------

const CATEGORY_CARDS: { id: MonitorTemplateCategory; title: string; desc: string; icon: string; detail: string }[] = [
  {
    id: 'ai_adherence',
    title: 'AI Adherence',
    desc: 'Evaluate how well the AI follows defined procedures, tools, and guidance.',
    icon: 'shield-check',
    detail: 'Best for tracking procedure compliance, tool usage, and response quality across AI-handled conversations.',
  },
  {
    id: 'cx_metric',
    title: 'CX Metric Monitoring',
    desc: 'Track customer experience outcomes like CSAT, AHT, and resolution rate.',
    icon: 'chart-bar',
    detail: 'Ideal for surfacing trends in satisfaction scores, handle times, and first-contact resolution.',
  },
  {
    id: 'custom_business',
    title: 'Custom Monitor',
    desc: 'Build a monitor around any operational or business signal.',
    icon: 'sliders',
    detail: 'Flexible framework for business opportunities, computed field rollups, and formula-based signals.',
  },
];

type AdherenceSubType = Extract<
  MonitorTemplateSubType,
  'procedure' | 'tools' | 'knowledge_base' | 'tone' | 'hallucination'
>;

const ADHERENCE_SUBTYPES: {
  id: AdherenceSubType;
  label: string;
  desc: string;
  defaultPassingScore: number;
  criteria: Omit<MonitorCriterion, 'pass'>[];
}[] = [
  {
    id: 'procedure',
    label: 'Procedure adherence',
    desc: 'Track whether the AI follows defined steps and completes required fields.',
    defaultPassingScore: 85,
    criteria: [
      { name: 'Correct procedure invoked for the request type', weight: 35, essential: true, source: '' },
      { name: 'All required steps completed in the defined order', weight: 35, essential: true, source: '' },
      { name: 'Required fields populated before closing', weight: 30, essential: false, source: '' },
    ],
  },
  {
    id: 'tools',
    label: 'Tool usage',
    desc: 'Verify the AI called the right tools with valid parameters.',
    defaultPassingScore: 85,
    criteria: [
      { name: 'Correct tool called for the task', weight: 40, essential: true, source: '' },
      { name: 'Tool parameters were valid and complete', weight: 35, essential: true, source: '' },
      { name: 'Fallback handled gracefully on tool error', weight: 25, essential: false, source: '' },
    ],
  },
  {
    id: 'knowledge_base',
    label: 'Knowledge grounding',
    desc: "Detect responses that aren't supported by approved knowledge sources.",
    defaultPassingScore: 85,
    criteria: [
      { name: 'Response grounded in approved KB content', weight: 40, essential: true, source: '' },
      { name: 'No unsupported factual claims made', weight: 35, essential: true, source: '' },
      { name: 'KB citation or source present when applicable', weight: 25, essential: false, source: '' },
    ],
  },
  {
    id: 'tone',
    label: 'Tone & guidance',
    desc: 'Evaluate whether the AI matched the right tone for each customer interaction.',
    defaultPassingScore: 75,
    criteria: [
      { name: 'Tone matched the customer\u2019s emotional state', weight: 40, essential: true, source: '' },
      { name: 'Empathy signals present before solution offered', weight: 35, essential: false, source: '' },
      { name: 'Escalation language avoided unless warranted', weight: 25, essential: false, source: '' },
    ],
  },
  {
    id: 'hallucination',
    label: 'Hallucination detection',
    desc: 'Flag responses containing invented facts not present in any approved source.',
    defaultPassingScore: 75,
    criteria: [
      { name: 'All stated facts verifiable in KB or tool output', weight: 45, essential: true, source: '' },
      { name: 'No invented data or fabricated citations', weight: 35, essential: true, source: '' },
      { name: 'Uncertainty expressed correctly when AI is unsure', weight: 20, essential: false, source: '' },
    ],
  },
];

type HumanCxSubType = Extract<
  MonitorTemplateSubType,
  'aht' | 'resolution_rate' | 'csat' | 'reopen_rate' | 'escalation_rate' | 'other'
>;

const CX_HUMAN_SUBTYPES: {
  id: HumanCxSubType;
  label: string;
  desc: string;
  unit: string;
  defaultTarget: number;
  targetLabel: string;
}[] = [
  {
    id: 'aht',
    label: 'Average handle time',
    desc: 'Alert when average handle time exceeds a threshold.',
    unit: 'min',
    defaultTarget: 8,
    targetLabel: 'Alert if AHT exceeds',
  },
  {
    id: 'resolution_rate',
    label: 'Resolution rate',
    desc: 'Alert when first-contact resolution rate falls below target.',
    unit: '%',
    defaultTarget: 75,
    targetLabel: 'Alert if resolution rate falls below',
  },
  {
    id: 'csat',
    label: 'CSAT',
    desc: 'Track human-scored customer satisfaction.',
    unit: '/5',
    defaultTarget: 3.5,
    targetLabel: 'Alert if CSAT falls below',
  },
  {
    id: 'reopen_rate',
    label: 'Reopen rate',
    desc: 'Alert when conversation reopen rate exceeds a threshold.',
    unit: '%',
    defaultTarget: 10,
    targetLabel: 'Alert if reopen rate exceeds',
  },
  {
    id: 'escalation_rate',
    label: 'Escalation rate',
    desc: 'Alert when AI-to-human escalation rate exceeds a threshold.',
    unit: '%',
    defaultTarget: 20,
    targetLabel: 'Alert if escalation rate exceeds',
  },
  {
    id: 'other',
    label: 'Other metric',
    desc: 'Choose from common reporting metrics.',
    unit: '',
    defaultTarget: 0,
    targetLabel: 'Alert threshold',
  },
];

type AiCxSubType = Extract<
  MonitorTemplateSubType,
  'aicsat' | 'ai_sentiment' | 'ai_resolution_quality' | 'ai_empathy' | 'ai_effort' | 'ai_clarity'
>;

const CX_AI_SUBTYPES: {
  id: AiCxSubType;
  label: string;
  desc: string;
  defaultPassingScore: number;
  criteria: Omit<MonitorCriterion, 'pass'>[];
}[] = [
  {
    id: 'aicsat',
    label: 'AI CSAT',
    desc: 'AI-evaluated customer satisfaction across response quality dimensions.',
    defaultPassingScore: 70,
    criteria: [
      { name: 'Responded quickly and efficiently', weight: 25, essential: false, source: '' },
      { name: 'Resolution quality was accurate and complete', weight: 30, essential: true, source: '' },
      { name: 'Tone matched the customer\u2019s emotional state', weight: 25, essential: false, source: '' },
      { name: 'Response grounded in accurate KB content', weight: 20, essential: false, source: '' },
    ],
  },
  {
    id: 'ai_sentiment',
    label: 'Customer sentiment',
    desc: 'Track whether AI conversations end with a positive sentiment shift.',
    defaultPassingScore: 65,
    criteria: [
      { name: 'Frustration signals acknowledged early in conversation', weight: 35, essential: true, source: '' },
      { name: 'De-escalation language used when frustration detected', weight: 35, essential: false, source: '' },
      { name: 'Conversation closed with positive or neutral sentiment', weight: 30, essential: false, source: '' },
    ],
  },
  {
    id: 'ai_resolution_quality',
    label: 'Resolution quality',
    desc: 'Evaluate whether the AI correctly and completely solved the customer\u2019s issue.',
    defaultPassingScore: 75,
    criteria: [
      { name: 'Root cause of the issue correctly identified', weight: 35, essential: true, source: '' },
      { name: 'Solution provided was accurate and applicable', weight: 35, essential: true, source: '' },
      { name: 'Customer confirmed the resolution before close', weight: 30, essential: false, source: '' },
    ],
  },
  {
    id: 'ai_empathy',
    label: 'Empathy score',
    desc: 'Measure how well the AI demonstrated empathy and emotional intelligence.',
    defaultPassingScore: 65,
    criteria: [
      { name: 'Customer frustration acknowledged before solution', weight: 40, essential: true, source: '' },
      { name: 'Language matched the urgency of the situation', weight: 35, essential: false, source: '' },
      { name: 'No dismissive or minimising phrasing used', weight: 25, essential: false, source: '' },
    ],
  },
  {
    id: 'ai_effort',
    label: 'Customer effort score',
    desc: 'Evaluate how hard the customer had to work to get help.',
    defaultPassingScore: 70,
    criteria: [
      { name: 'Issue resolved in the fewest steps necessary', weight: 40, essential: true, source: '' },
      { name: 'No unnecessary information requested from customer', weight: 35, essential: false, source: '' },
      { name: 'Proactive next step offered before customer had to ask', weight: 25, essential: false, source: '' },
    ],
  },
  {
    id: 'ai_clarity',
    label: 'Communication clarity',
    desc: 'Score whether the AI communicated clearly and at the right level.',
    defaultPassingScore: 70,
    criteria: [
      { name: 'No unexplained jargon or technical language', weight: 35, essential: false, source: '' },
      { name: 'Response length appropriate for the complexity of the issue', weight: 35, essential: false, source: '' },
      { name: 'No ambiguous or contradictory statements', weight: 30, essential: true, source: '' },
    ],
  },
];

type CustomSubType = Extract<
  MonitorTemplateSubType,
  'computed_field' | 'business_opportunities' | 'regex' | 'formula' | 'code'
>;

const CUSTOM_SUBTYPES: { id: CustomSubType; label: string; desc: string }[] = [
  {
    id: 'business_opportunities',
    label: 'Business Opportunities',
    desc: 'Use AI to detect high-value signals in conversations — upsell moments, VIP treatment needed, churn risk, and more.',
  },
  {
    id: 'computed_field',
    label: 'Computed field',
    desc: 'Aggregate multiple kObject attributes into a single scored metric.',
  },
  { id: 'regex', label: 'Regex / keyword', desc: 'Flag conversations matching a text pattern.' },
  {
    id: 'formula',
    label: 'Formula',
    desc: 'Build a metric from existing fields (e.g. upsell revenue \u00f7 AI conversations).',
  },
  { id: 'code', label: 'Custom code', desc: 'Write an expression to define any metric or flag condition.' },
];

interface ComputedFieldDef {
  id: string;
  label: string;
  description: string;
  criteria: { name: string; weight: number; description: string }[];
  defaultPassingScore: number;
}
const COMPUTED_FIELD_DEFINITIONS: ComputedFieldDef[] = [
  {
    id: 'upsell_opportunity',
    label: 'Upsell opportunity identified',
    description: 'AI detected signals the customer may be open to an upgrade or expansion.',
    criteria: [
      {
        name: 'Product upgrade mentioned',
        weight: 30,
        description: 'Customer asked about higher-tier features or plans.',
      },
      { name: 'Pricing inquiry detected', weight: 25, description: 'Customer asked about pricing or plan options.' },
      {
        name: 'Feature interest expressed',
        weight: 25,
        description: 'Customer showed interest in a feature not in current plan.',
      },
      { name: 'Open to recommendation', weight: 20, description: 'Customer was receptive to a suggested next step.' },
    ],
    defaultPassingScore: 60,
  },
  {
    id: 'churn_risk',
    label: 'Churn risk detected',
    description: 'AI flagged signals suggesting the customer may be at risk of churning.',
    criteria: [
      { name: 'Cancellation intent', weight: 40, description: 'Customer mentioned cancelling or downgrading.' },
      { name: 'Negative sentiment', weight: 30, description: 'Sentiment score below acceptable threshold.' },
      { name: 'Repeated issue', weight: 20, description: 'Same issue appeared more than once in the conversation.' },
      { name: 'Escalation requested', weight: 10, description: 'Customer asked to speak with a manager.' },
    ],
    defaultPassingScore: 40,
  },
  {
    id: 'feature_request',
    label: 'Feature request captured',
    description: 'The conversation contained an explicit request for a new product feature or capability.',
    criteria: [
      {
        name: 'Feature explicitly named',
        weight: 40,
        description: 'Customer named or described a specific feature they want.',
      },
      {
        name: 'Use case described',
        weight: 35,
        description: 'Customer explained the business problem the feature would solve.',
      },
      {
        name: 'Urgency indicated',
        weight: 25,
        description: 'Customer indicated the request was time-sensitive or a blocker.',
      },
    ],
    defaultPassingScore: 50,
  },
  {
    id: 'negative_sentiment',
    label: 'Negative sentiment spike',
    description: 'Sentiment score fell below an acceptable threshold at any point during the conversation.',
    criteria: [
      {
        name: 'Negative language detected',
        weight: 40,
        description: 'Customer used strongly negative words or phrases.',
      },
      {
        name: 'Frustration expressed',
        weight: 35,
        description: 'Customer indicated frustration with the product or support experience.',
      },
      { name: 'Threat to leave', weight: 25, description: 'Customer hinted at or stated they may leave.' },
    ],
    defaultPassingScore: 35,
  },
  {
    id: 'ai_resolution_failed',
    label: 'AI resolution failed',
    description: 'The AI Copilot was unable to fully resolve the issue and required agent takeover or escalation.',
    criteria: [
      {
        name: 'Handoff to human agent',
        weight: 40,
        description: 'Conversation was transferred to a live agent after AI involvement.',
      },
      {
        name: 'Issue unresolved at close',
        weight: 35,
        description: 'Conversation ended without a confirmed resolution.',
      },
      {
        name: 'Customer re-contacted',
        weight: 25,
        description: 'Customer opened a new conversation within 24h on the same issue.',
      },
    ],
    defaultPassingScore: 45,
  },
  {
    id: 'billing_issue',
    label: 'Billing issue raised',
    description: 'Customer mentioned an invoice discrepancy, unexpected charge, or refund request.',
    criteria: [
      { name: 'Charge disputed', weight: 40, description: 'Customer explicitly disputed a charge on their account.' },
      { name: 'Refund requested', weight: 35, description: 'Customer asked for a full or partial refund.' },
      {
        name: 'Invoice confusion',
        weight: 25,
        description: 'Customer expressed confusion about a line item or billing cycle.',
      },
    ],
    defaultPassingScore: 50,
  },
  {
    id: 'sla_risk',
    label: 'SLA at risk',
    description:
      'Pylon signal: the conversation was at risk of breaching its SLA window based on current response times.',
    criteria: [
      { name: 'Response time near breach', weight: 50, description: 'Time to next reply approached the SLA limit.' },
      {
        name: 'High-priority account',
        weight: 30,
        description: 'Account tier or ARR places this conversation under tighter SLA.',
      },
      {
        name: 'No activity window exceeded',
        weight: 20,
        description: 'Conversation was idle beyond the expected activity window.',
      },
    ],
    defaultPassingScore: 55,
  },
  {
    id: 'knowledge_gap',
    label: 'Knowledge gap identified',
    description:
      "The agent or AI could not answer the customer's question — no matching article or procedure was found.",
    criteria: [
      { name: 'No KB article matched', weight: 45, description: 'Search returned no relevant knowledge base results.' },
      {
        name: 'Agent escalated for info',
        weight: 35,
        description: 'Agent had to consult a colleague or escalate to find the answer.',
      },
      {
        name: 'Customer question unanswered',
        weight: 20,
        description: 'Conversation closed without the original question being answered.',
      },
    ],
    defaultPassingScore: 40,
  },
  {
    id: 'first_contact_failure',
    label: 'First contact failure',
    description: 'The issue was not resolved in the first interaction and required a follow-up conversation.',
    criteria: [
      {
        name: 'Follow-up conversation opened',
        weight: 50,
        description: 'Customer started a new conversation about the same issue within 48h.',
      },
      {
        name: 'Resolution not confirmed',
        weight: 30,
        description: 'No explicit resolution was confirmed before the conversation closed.',
      },
      {
        name: 'Reopened ticket',
        weight: 20,
        description: 'The original conversation was reopened after being marked resolved.',
      },
    ],
    defaultPassingScore: 45,
  },
  {
    id: 'escalation_trigger',
    label: 'Escalation trigger',
    description:
      'Pylon signal: the conversation matched an escalation rule — e.g. VIP customer, high ARR account, or contractual SLA tier.',
    criteria: [
      {
        name: 'VIP or high-ARR account',
        weight: 40,
        description: 'Account is tagged as VIP or falls above the ARR escalation threshold.',
      },
      { name: 'Contractual SLA tier', weight: 35, description: 'Account has a contract requiring priority handling.' },
      { name: 'Escalation rule matched', weight: 25, description: 'A Pylon escalation rule was explicitly triggered.' },
    ],
    defaultPassingScore: 55,
  },
];

/** Computed field options for the "Computed field" sub-type — CX platform custom fields & rollups */
const COMPUTED_FIELD_OPTIONS: { id: string; label: string; description: string }[] = [
  {
    id: 'total_handle_time',
    label: 'Total handle time',
    description:
      'Sum of active agent time across all messages in the conversation (similar to AHT in Salesforce Service Cloud).',
  },
  {
    id: 'response_time_p50',
    label: 'Median first response time',
    description: 'Median time from conversation created to first agent reply — equivalent to a Zendesk Explore metric.',
  },
  {
    id: 'conversation_effort_score',
    label: 'Customer effort score (CES)',
    description: 'AI-estimated effort the customer had to exert to get their issue resolved, on a 1–7 scale.',
  },
  {
    id: 'messages_per_resolution',
    label: 'Messages to resolution',
    description: 'Total number of back-and-forth messages before the conversation was marked resolved.',
  },
  {
    id: 'kb_deflection_rate',
    label: 'KB deflection rate',
    description:
      'Percentage of conversations where a knowledge base article was surfaced and the customer self-served without agent reply.',
  },
  {
    id: 'agent_reassignment_count',
    label: 'Reassignment count',
    description:
      'Number of times the conversation was reassigned to a different agent or team (Freshdesk-style routing metric).',
  },
  {
    id: 'reopen_count',
    label: 'Reopen count',
    description: 'How many times the conversation was closed and then reopened — a proxy for unresolved issues.',
  },
  {
    id: 'csat_predicted',
    label: 'Predicted CSAT score',
    description:
      'AI-predicted satisfaction score based on sentiment, response time, and resolution quality before a survey is sent.',
  },
  {
    id: 'custom_field_rollup',
    label: 'Custom kObject field rollup',
    description:
      'Aggregate any numeric custom field on the kObject (e.g. contract ARR, account tier score, days since onboarding).',
  },
  {
    id: 'tag_frequency',
    label: 'Tag / label frequency',
    description:
      'How often a specific conversation tag or label appears in the evaluation window — useful for tracking issue categories.',
  },
  {
    id: 'copilot_acceptance_rate',
    label: 'Copilot suggestion acceptance rate',
    description: 'Percentage of AI Copilot suggestions the agent accepted vs. dismissed during the conversation.',
  },
  {
    id: 'sla_breach_risk_score',
    label: 'SLA breach risk score',
    description:
      'Composite score (0–100) combining time remaining, account tier, and queue depth to predict SLA breach likelihood.',
  },
];

const OTHER_CX_METRICS = [
  'First Reply Time',
  'Time to Close',
  'Deflection Rate',
  'NPS',
  'Agent Utilisation',
  'Conversations per Agent',
  'SLA Compliance Rate',
];

const FORMULA_OPERANDS = [
  'AI conversations',
  'Resolved conversations',
  'Upsell revenue',
  'Escalations',
  'Reopens',
  'CSAT responses',
  'Agent handle time (total)',
];

const STUB_GOALS: Goal[] = [
  { id: 'goal_csat', name: 'Improve customer satisfaction', description: '' },
  { id: 'goal_cost', name: 'Reduce cost per resolution', description: '' },
  { id: 'goal_sentiment', name: 'Improve customer sentiment', description: '' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function labelForCategory(cat: MonitorTemplateCategory | null): string {
  return CATEGORY_CARDS.find((c) => c.id === cat)?.title ?? '';
}

function labelForSubType(
  category: MonitorTemplateCategory | null,
  subType: MonitorTemplateSubType | null,
  cxMode: CxMetricMode | null,
): string {
  if (!category || !subType) return '';
  if (category === 'ai_adherence') return ADHERENCE_SUBTYPES.find((s) => s.id === subType)?.label ?? '';
  if (category === 'cx_metric') {
    if (cxMode === 'human') return CX_HUMAN_SUBTYPES.find((s) => s.id === subType)?.label ?? '';
    return CX_AI_SUBTYPES.find((s) => s.id === (subType as AiCxSubType))?.label ?? '';
  }
  return CUSTOM_SUBTYPES.find((s) => s.id === subType)?.label ?? '';
}

function defaultNameFor(
  category: MonitorTemplateCategory | null,
  subType: MonitorTemplateSubType | null,
  cxMode: CxMetricMode | null,
): string {
  return labelForSubType(category, subType, cxMode);
}

function defaultCriteriaFor(
  category: MonitorTemplateCategory | null,
  subType: MonitorTemplateSubType | null,
  cxMode: CxMetricMode | null,
): Omit<MonitorCriterion, 'pass'>[] {
  if (category === 'ai_adherence') return ADHERENCE_SUBTYPES.find((s) => s.id === subType)?.criteria ?? [];
  if (category === 'cx_metric' && cxMode === 'ai_evaluated')
    return CX_AI_SUBTYPES.find((s) => s.id === (subType as AiCxSubType))?.criteria ?? [];
  return [];
}

function defaultPassingScoreFor(
  category: MonitorTemplateCategory | null,
  subType: MonitorTemplateSubType | null,
  cxMode: CxMetricMode | null,
): number {
  if (category === 'ai_adherence') return ADHERENCE_SUBTYPES.find((s) => s.id === subType)?.defaultPassingScore ?? 75;
  if (category === 'cx_metric' && cxMode === 'ai_evaluated')
    return CX_AI_SUBTYPES.find((s) => s.id === (subType as AiCxSubType))?.defaultPassingScore ?? 70;
  return 75;
}

function needsCriteriaBuilder(
  category: MonitorTemplateCategory | null,
  cxMode: CxMetricMode | null,
  subType: MonitorTemplateSubType | null,
): boolean {
  if (category === 'ai_adherence') return true;
  if (category === 'cx_metric' && cxMode === 'ai_evaluated') return true;
  if (category === 'custom_business' && subType === 'business_opportunities') return true;
  return false;
}

// ---------------------------------------------------------------------------
// Editable criterion row
// ---------------------------------------------------------------------------

type EditCriterion = Omit<MonitorCriterion, 'pass'> & { id: number; refs: RubricRef[] };

const CriterionRow = ({
  c,
  idx,
  totalWeight,
  onChange,
  onRemove,
  readOnly,
}: {
  c: EditCriterion;
  idx: number;
  totalWeight: number;
  onChange: (patch: Partial<EditCriterion>) => void;
  onRemove: () => void;
  readOnly?: boolean;
}) => (
  <div
    style={{
      padding: '10px 12px',
      background: readOnly ? '#FAFBFC' : '#fff',
      border: `1px solid ${C.border}`,
      borderRadius: 7,
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: readOnly ? 0 : 4 }}>
      {readOnly ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ font: '600 13px/18px Inter,sans-serif', color: C.textPrimary, marginBottom: 2 }}>{c.name}</div>
          {c.description && <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.5 }}>{c.description}</div>}
        </div>
      ) : (
        <textarea
          value={c.name}
          rows={2}
          onChange={(e) => onChange({ name: e.target.value })}
          placeholder="Criterion name"
          style={{
            flex: 1,
            minWidth: 0,
            padding: '5px 8px',
            borderRadius: 5,
            border: `1px solid ${C.border}`,
            font: '600 12px/16px Inter,sans-serif',
            fontFamily: FF,
            color: C.textPrimary,
            outline: 'none',
            background: '#fff',
            resize: 'vertical',
          }}
        />
      )}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          border: `1px solid ${C.border}`,
          borderRadius: 4,
          background: readOnly ? '#F0F1F5' : '#fff',
          overflow: 'hidden',
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 10, color: C.textMuted, padding: '0 6px', borderRight: `1px solid ${C.border}` }}>
          wt
        </span>
        <input
          type="number"
          min={1}
          max={100}
          value={c.weight}
          readOnly={readOnly}
          onChange={
            readOnly ? undefined : (e) => onChange({ weight: Math.max(1, Math.min(100, Number(e.target.value))) })
          }
          style={{
            width: 60,
            border: 'none',
            padding: '4px 6px',
            font: '600 12px/16px Inter,sans-serif',
            fontFamily: FF,
            color: readOnly ? C.textSec : totalWeight === 100 ? C.textPrimary : '#DC2626',
            outline: 'none',
            textAlign: 'center',
            background: 'transparent',
            cursor: readOnly ? 'default' : undefined,
          }}
        />
      </div>
      {!readOnly && (
        <>
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              fontSize: 12,
              color: C.textSec,
              cursor: 'pointer',
              flexShrink: 0,
              paddingTop: 4,
            }}
          >
            <input
              type="checkbox"
              checked={c.essential}
              onChange={(e) => onChange({ essential: e.target.checked })}
              style={{ accentColor: C.blue }}
            />
            Must pass
          </label>
          <button
            type="button"
            onClick={onRemove}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.textMuted,
              padding: 2,
              flexShrink: 0,
              paddingTop: 6,
            }}
            aria-label="Remove criterion"
          >
            <svg
              width={12}
              height={12}
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeLinecap="round"
            >
              <path d="M2 2l8 8M10 2L2 10" />
            </svg>
          </button>
        </>
      )}
    </div>
    {!readOnly && <RubricRefEditor refs={c.refs} onChange={(next) => onChange({ refs: next })} />}
  </div>
);

// ---------------------------------------------------------------------------
// AI Assistant Panel (full-page mode)
// ---------------------------------------------------------------------------

const AI_STEP_PROMPTS: Record<number, string[]> = {
  0: [
    'Help me choose the right monitor type',
    "What's the difference between AI Adherence and CX Metric?",
    'What should I monitor for CSAT quality?',
  ],
  1: ['Suggest a name for this monitor', 'What makes a good monitor description?', 'What sampling rate should I use?'],
  2: [
    'Suggest evaluation criteria for this monitor',
    'How should I weight my criteria?',
    "What's a good passing score?",
  ],
  3: [
    'Does this monitor configuration look right?',
    'What happens after I add this monitor?',
    'Can I change criteria after creating?',
  ],
};

const AI_CANNED_RESPONSES: Record<string, string> = {
  'Help me choose the right monitor type':
    'Start with **AI Adherence** if you want to measure whether AI follows specific procedures or scripts. Use **CX Metric** to track outcomes like CSAT or resolution rate. **Custom Monitor** is best for unique operational signals or AI-detected business opportunities.',
  "What's the difference between AI Adherence and CX Metric?":
    '**AI Adherence** evaluates conversation-level quality using a scoring rubric — great for procedure compliance. **CX Metric** monitors aggregate numbers like AHT or resolution rate using a threshold.',
  'What should I monitor for CSAT quality?':
    'Consider an AI Adherence monitor with criteria like greeting quality, resolution clarity, empathy, and follow-through. Pair it with a CX Metric monitor tracking raw CSAT to see both the score and its drivers.',
  'Suggest a name for this monitor':
    'A good name is short and specific: "Refund Procedure Adherence", "Returns CSAT", or "Billing Resolution Rate". Avoid generic names like "Quality Monitor."',
  'What makes a good monitor description?':
    'Describe what the monitor measures and why it matters. Example: "Tracks whether AI agents follow the refund escalation procedure on conversations involving order returns."',
  'What sampling rate should I use?':
    '100% is best for high-stakes procedures. For general quality monitoring, 25–50% gives a solid statistical sample while keeping review queues manageable.',
  'Suggest evaluation criteria for this monitor':
    'Good starting criteria include: greeting quality (10%), problem identification (20%), solution accuracy (35%), empathy (15%), and resolution confirmation (20%). Adjust weights to match what matters most.',
  'How should I weight my criteria?':
    'Give the highest weight to criteria that most directly impact the customer outcome. Resolution accuracy and solution quality typically deserve 30–40% combined.',
  "What's a good passing score?":
    'For procedure adherence monitors, 80–85 is a common baseline. For general quality, 70–75 allows room for nuance while still flagging poor interactions.',
  'Does this monitor configuration look right?':
    'Looks good! Make sure your total weight adds to 100% and your passing score aligns with your quality benchmarks. You can always adjust criteria after saving.',
  'What happens after I add this monitor?':
    'Kustomer will begin scoring new conversations against your criteria. Results appear in the Monitors tab within ~15 minutes for the first conversations.',
  'Can I change criteria after creating?':
    "Yes — you can edit any monitor's criteria at any time. Historical scores will reflect the criteria that were active at the time they were recorded.",
};

interface AiMessage {
  role: 'user' | 'ai';
  text: string;
}

const AiAssistantPanel = ({ step, onClose }: { step: number; onClose: () => void }) => {
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [thinking, setThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const prompts = AI_STEP_PROMPTS[step] ?? AI_STEP_PROMPTS[0];

  const sendMessage = (text: string) => {
    if (!text.trim() || thinking) return;
    const userMsg: AiMessage = { role: 'user', text: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setThinking(true);
    setTimeout(() => {
      const response =
        AI_CANNED_RESPONSES[text.trim()] ??
        'Great question! This is a stub response — the AI assistant will provide contextual guidance here once integrated with the AI backend.';
      setMessages((prev) => [...prev, { role: 'ai', text: response }]);
      setThinking(false);
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      });
    }, 900);
  };

  const renderMarkdownish = (text: string) => {
    // Very basic **bold** rendering
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((p, i) =>
      p.startsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>,
    );
  };

  return (
    <CopilotContainer
      style={
        {
          width: 340,
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          fontFamily: FF,
          margin: 8,
          height: 'calc(100% - 16px)',
        } as React.CSSProperties
      }
    >
      {/* Panel header — matches CopilotHeader styles */}
      <div
        style={{
          padding: 12,
          borderBottom: `1px solid ${C.border}`,
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexShrink: 0,
          borderTopLeftRadius: 'inherit',
          borderTopRightRadius: 'inherit',
        }}
      >
        <svg width={14} height={14} viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 13l-1.5-4.5L2 7l4.5-1.5z" fill={C.blue} />
        </svg>
        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: C.textPrimary }}>AI assistant</span>
        <IconButton icon="xmark" onClick={onClose} size="small" tooltip="Close AI assistant" />
      </div>

      {/* Suggested prompts */}
      {messages.length === 0 && (
        <div style={{ padding: '12px 16px', borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              color: C.textMuted,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            Suggestions
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {prompts.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => sendMessage(p)}
                style={{
                  textAlign: 'left',
                  padding: '7px 10px',
                  borderRadius: 6,
                  border: `1px solid ${C.border}`,
                  background: C.blueBg,
                  cursor: 'pointer',
                  fontFamily: FF,
                  fontSize: 12,
                  color: C.blue,
                  lineHeight: 1.4,
                  transition: 'background 0.1s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '88%',
              padding: '8px 11px',
              borderRadius: msg.role === 'user' ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
              background: msg.role === 'user' ? C.blue : '#F4F5F7',
              color: msg.role === 'user' ? '#fff' : C.textPrimary,
              fontSize: 12,
              lineHeight: 1.55,
            }}
          >
            {msg.role === 'ai' ? renderMarkdownish(msg.text) : msg.text}
          </div>
        ))}
        {thinking && (
          <div
            style={{
              alignSelf: 'flex-start',
              padding: '8px 11px',
              borderRadius: '12px 12px 12px 3px',
              background: '#F4F5F7',
              display: 'flex',
              gap: 4,
              alignItems: 'center',
            }}
          >
            {[0, 1, 2].map((d) => (
              <span
                key={d}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: C.textMuted,
                  display: 'inline-block',
                  animation: `aiDot 1.2s ${d * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.border}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
          <textarea
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage(inputVal);
              }
            }}
            placeholder="Ask anything about this monitor…"
            rows={2}
            style={{
              flex: 1,
              resize: 'none',
              padding: '7px 10px',
              border: `1px solid ${C.border}`,
              borderRadius: 7,
              fontFamily: FF,
              fontSize: 12,
              color: C.textPrimary,
              outline: 'none',
              background: '#fff',
              lineHeight: 1.5,
            }}
          />
          <button
            type="button"
            onClick={() => sendMessage(inputVal)}
            disabled={!inputVal.trim() || thinking}
            style={{
              padding: '7px 12px',
              borderRadius: 7,
              background: inputVal.trim() && !thinking ? C.blue : '#E5E7EB',
              border: 'none',
              cursor: inputVal.trim() && !thinking ? 'pointer' : 'default',
              color: inputVal.trim() && !thinking ? '#fff' : C.textMuted,
              fontFamily: FF,
              fontSize: 12,
              fontWeight: 600,
              transition: 'background 0.14s',
              alignSelf: 'flex-end',
              height: 36,
            }}
          >
            Send
          </button>
        </div>
      </div>
    </CopilotContainer>
  );
};

// ---------------------------------------------------------------------------
// Step indicator (3 steps)
// ---------------------------------------------------------------------------

const STEP_LABELS = ['Configure', 'Details', 'Criteria', 'Review'];

const StepIndicator = ({ current }: { current: number }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 14 }}>
    {STEP_LABELS.map((lbl, i) => {
      const done = i < current;
      const active = i === current;
      return (
        <div key={lbl} style={{ display: 'flex', alignItems: 'center', flex: i < STEP_LABELS.length - 1 ? 1 : 'none' }}>
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: '50%',
              border: `2px solid ${done || active ? C.blue : C.border}`,
              background: done ? C.blue : active ? C.blueBg : '#fff',
              color: done ? '#fff' : active ? C.blue : C.textMuted,
              fontSize: 10,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {done ? (
              <svg
                width={10}
                height={10}
                viewBox="0 0 10 10"
                fill="none"
                stroke="#fff"
                strokeWidth={2}
                strokeLinecap="round"
              >
                <path d="M2 5l2.5 2.5L8 3" />
              </svg>
            ) : (
              i + 1
            )}
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div style={{ flex: 1, height: 2, background: done ? C.blue : C.border, margin: '0 4px' }} />
          )}
        </div>
      );
    })}
  </div>
);

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface Props {
  open: boolean;
  onClose: () => void;
  goals?: Goal[];
  /** When true, renders as a fixed full-page view instead of a slide-in Drawer */
  fullPage?: boolean;
  /** Called when the user clicks the back button in full-page mode */
  onBack?: () => void;
}

let criterionCounter = 0;
const nextId = () => ++criterionCounter;

const CreateMonitorPanel = ({ open, onClose, goals = STUB_GOALS, fullPage = false, onBack }: Props) => {
  // #region agent log
  fetch('http://127.0.0.1:7843/ingest/c954a5b1-ba58-484d-8df9-325c01df1e66', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '61942b' },
    body: JSON.stringify({
      sessionId: '61942b',
      location: 'CreateMonitorPanel.tsx:576',
      message: 'CreateMonitorPanel rendered — module loaded OK',
      data: { open },
      hypothesisId: 'A',
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  // 3 steps: 0=configure, 1=setup, 2=review
  const [step, setStep] = useState(0);

  // Step 0 state
  const [category, setCategory] = useState<MonitorTemplateCategory | null>(null);
  const [cxMode, setCxMode] = useState<CxMetricMode | null>(null);
  const [subType, setSubType] = useState<MonitorTemplateSubType | null>(null);
  const [otherMetric, setOtherMetric] = useState('');
  const [formulaA, setFormulaA] = useState(FORMULA_OPERANDS[0]);
  const [formulaOp, setFormulaOp] = useState<'\u00f7' | '\u00d7' | '+' | '-'>('\u00f7');
  const [formulaB, setFormulaB] = useState(FORMULA_OPERANDS[1]);
  const [regexPattern, setRegexPattern] = useState('');
  const [computedField, setComputedField] = useState('');
  const [selectedOpportunity, setSelectedOpportunity] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [targetValue, setTargetValue] = useState<number | ''>('');

  // Step 1 state
  const [monitorName, setMonitorName] = useState('');
  const [monitorDesc, setMonitorDesc] = useState('');
  const [who, setWho] = useState<MonitorKind>('aic');
  const [alsoMonitorAIR, setAlsoMonitorAIR] = useState(false);
  const [criteria, setCriteria] = useState<EditCriterion[]>([]);
  const [passingScore, setPassingScore] = useState<number | ''>(75);
  const [linkedGoal, setLinkedGoal] = useState('');
  const [alertingEnabled, setAlertingEnabled] = useState(false);
  const [alertCadence, setAlertCadence] = useState<'hourly' | 'daily'>('daily');
  const [samplingRate, setSamplingRate] = useState(100);

  const resetWizard = () => {
    setStep(0);
    setCategory(null);
    setCxMode(null);
    setSubType(null);
    setOtherMetric('');
    setFormulaA(FORMULA_OPERANDS[0]);
    setFormulaOp('\u00f7');
    setFormulaB(FORMULA_OPERANDS[1]);
    setRegexPattern('');
    setComputedField('');
    setCodeSnippet('');
    setTargetValue('');
    setMonitorName('');
    setMonitorDesc('');
    setWho('aic');
    setAlsoMonitorAIR(false);
    setCriteria([]);
    setPassingScore(75);
    setLinkedGoal('');
    setAlertingEnabled(false);
    setAlertCadence('daily');
    setSamplingRate(100);
  };

  const handleClose = () => {
    resetWizard();
    onClose();
  };

  // When category changes, reset sub-type selections
  const handleCategorySelect = (cat: MonitorTemplateCategory) => {
    if (cat === category) return;
    setCategory(cat);
    setSubType(null);
    setCxMode(null);
  };

  // Seed defaults when sub-type is picked
  const applySubType = (st: MonitorTemplateSubType, cxModeOverride?: CxMetricMode) => {
    const resolvedCxMode = cxModeOverride ?? cxMode;
    setSubType(st);
    const name = defaultNameFor(category, st, resolvedCxMode);
    setMonitorName(name);
    // For business_opportunities, criteria + passing score are seeded by the opportunity
    // card click — don't overwrite them here.
    if (!(category === 'custom_business' && st === 'business_opportunities')) {
      const seeded = defaultCriteriaFor(category, st, resolvedCxMode).map((c) => ({
        ...c,
        id: nextId(),
        refs: seedRefsForCriterion(c as MonitorCriterion),
      }));
      // #region agent log
      fetch('http://127.0.0.1:7843/ingest/c954a5b1-ba58-484d-8df9-325c01df1e66', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '61942b' },
        body: JSON.stringify({
          sessionId: '61942b',
          location: 'CreateMonitorPanel.tsx:applySubType',
          message: 'applySubType called - seeding criteria',
          data: { st, category, seededCount: seeded.length },
          timestamp: Date.now(),
          runId: 'post-fix',
          hypothesisId: 'A',
        }),
      }).catch(() => {});
      // #endregion
      setCriteria(seeded);
      setPassingScore(defaultPassingScoreFor(category, st, resolvedCxMode));
    } else {
      // #region agent log
      fetch('http://127.0.0.1:7843/ingest/c954a5b1-ba58-484d-8df9-325c01df1e66', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '61942b' },
        body: JSON.stringify({
          sessionId: '61942b',
          location: 'CreateMonitorPanel.tsx:applySubType',
          message: 'applySubType skipped criteria overwrite for business_opportunities',
          data: { st, selectedOpportunity },
          timestamp: Date.now(),
          runId: 'post-fix',
          hypothesisId: 'A',
        }),
      }).catch(() => {});
      // #endregion
    }
    if (category === 'cx_metric' && resolvedCxMode === 'human') {
      const found = CX_HUMAN_SUBTYPES.find((s) => s.id === st);
      setTargetValue(found?.defaultTarget ?? '');
    }
  };

  const hasCriteria = needsCriteriaBuilder(category, cxMode, subType);

  const canAdvanceStep = (): boolean => {
    if (step === 0) {
      if (!subType) return false;
      if (category === 'cx_metric' && !cxMode) return false;
      if (category === 'custom_business' && subType === 'business_opportunities' && !selectedOpportunity) return false;
      return true;
    }
    if (step === 1) return monitorName.trim().length > 0;
    if (step === 2) {
      const tw = criteria.reduce((s, c) => s + c.weight, 0);
      return criteria.length > 0 && tw === 100;
    }
    return true;
  };

  const goNext = () => {
    if (!canAdvanceStep()) return;
    if (step === 0) {
      if (subType) applySubType(subType, cxMode ?? undefined);
      setStep(1);
      return;
    }
    if (step === 1 && !hasCriteria) {
      setStep(3); // skip criteria step for types that don't need it
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const goBack = () => {
    if (step === 3 && !hasCriteria) {
      setStep(1); // skip back over criteria step
      return;
    }
    setStep((s) => Math.max(s - 1, 0));
  };

  const updateCriterion = (idx: number, patch: Partial<EditCriterion>) => {
    setCriteria((prev) => prev.map((c, i) => (i === idx ? { ...c, ...patch } : c)));
  };
  const removeCriterion = (idx: number) => setCriteria((prev) => prev.filter((_, i) => i !== idx));
  const addCriterion = () =>
    setCriteria((prev) => [...prev, { id: nextId(), name: '', weight: 0, essential: false, source: '', refs: [] }]);

  const totalWeight = criteria.reduce((s, c) => s + (c.weight || 0), 0);

  // AI assistant panel state (full-page mode only)
  const [aiOpen, setAiOpen] = useState(false);

  // Inject thinking-dot animation once
  const _styleInjected = useRef(false);
  if (!_styleInjected.current && typeof document !== 'undefined') {
    _styleInjected.current = true;
    if (!document.getElementById('ai-dot-style')) {
      const s = document.createElement('style');
      s.id = 'ai-dot-style';
      s.textContent =
        '@keyframes aiDot{0%,80%,100%{opacity:.25;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}';
      document.head.appendChild(s);
    }
  }

  // ------------------------------------------------------------------
  // Step 0 — Configure: type + sub-type inline
  // ------------------------------------------------------------------

  const renderStep0 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Category cards — horizontal row */}
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        {CATEGORY_CARDS.map((card) => {
          const active = category === card.id;
          const anySelected = !!category;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => handleCategorySelect(card.id)}
              style={{
                flex: 1,
                textAlign: 'left',
                padding: anySelected ? '10px 12px' : '18px 16px',
                borderRadius: 10,
                border: `1.5px solid ${active ? C.blue : C.border}`,
                background: active ? C.blueBg : '#fff',
                cursor: 'pointer',
                fontFamily: FF,
                boxShadow: active ? `0 0 0 3px rgba(28,110,242,0.12)` : 'none',
                transition:
                  'padding 0.22s cubic-bezier(0.4,0,0.2,1), border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease',
                overflow: 'hidden',
              }}
            >
              {/* Icon — fades out when any card is selected */}
              <div
                style={{
                  marginBottom: anySelected ? 0 : 10,
                  maxHeight: anySelected ? 0 : 36,
                  opacity: anySelected ? 0 : 1,
                  overflow: 'hidden',
                  color: active ? C.blue : C.textMuted,
                  transition:
                    'max-height 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease, margin-bottom 0.22s ease',
                }}
              >
                <Icon type={card.icon} size="large" />
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: active ? C.blue : C.textPrimary,
                  marginBottom: 4,
                  lineHeight: 1.3,
                }}
              >
                {card.title}
              </div>
              <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.4 }}>{card.desc}</div>
              {/* Detail line — fades out when any card is selected */}
              <div
                style={{
                  fontSize: 12,
                  color: C.textMuted,
                  lineHeight: 1.45,
                  marginTop: anySelected ? 0 : 8,
                  maxHeight: anySelected ? 0 : 60,
                  opacity: anySelected ? 0 : 0.8,
                  overflow: 'hidden',
                  transition: 'max-height 0.22s cubic-bezier(0.4,0,0.2,1), opacity 0.18s ease, margin-top 0.22s ease',
                }}
              >
                {card.detail}
              </div>
            </button>
          );
        })}
      </div>

      {/* Sub-type reveal — only when a category is selected */}
      {category && (
        <div
          style={{
            borderTop: `1px solid ${C.border}`,
            paddingTop: 14,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: C.textMuted,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              marginBottom: 10,
            }}
          >
            {category === 'cx_metric' && !cxMode ? 'How is this metric measured?' : 'Select a type'}
          </div>

          {/* ai_adherence sub-types — horizontal grid, max 3 per row */}
          {category === 'ai_adherence' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ADHERENCE_SUBTYPES.map((s) => {
                const active = subType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSubType(s.id)}
                    style={{
                      ...subTypeCardStyle(active),
                      width: 'calc(33.33% - 4px)',
                      minWidth: 120,
                      boxSizing: 'border-box',
                    }}
                  >
                    <div
                      style={{ fontSize: 13, fontWeight: 600, color: active ? C.blue : C.textPrimary, marginBottom: 2 }}
                    >
                      {s.label}
                    </div>
                    <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.4 }}>{s.desc}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* cx_metric: mode toggle always visible, sub-types appear in grid below */}
          {category === 'cx_metric' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Mode picker — always shown */}
              <div style={{ display: 'flex', gap: 8 }}>
                {(
                  [
                    { id: 'human' as CxMetricMode, label: 'Human-measured', desc: 'AHT, CSAT, Reopen Rate…' },
                    { id: 'ai_evaluated' as CxMetricMode, label: 'AI-evaluated', desc: 'AI CSAT, Empathy, Clarity…' },
                  ] as const
                ).map((m) => {
                  const active = cxMode === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setCxMode(m.id);
                        setSubType(null);
                      }}
                      style={{ ...subTypeCardStyle(active), flex: 1 }}
                    >
                      <div
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: active ? C.blue : C.textPrimary,
                          marginBottom: 2,
                        }}
                      >
                        {m.label}
                      </div>
                      <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.4 }}>{m.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Sub-type grid — max 3 per row */}
              {cxMode && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {(cxMode === 'human' ? CX_HUMAN_SUBTYPES : CX_AI_SUBTYPES).map((s) => {
                    const active = subType === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSubType(s.id)}
                        style={{
                          ...subTypeCardStyle(active),
                          width: 'calc(33.33% - 4px)',
                          minWidth: 120,
                          boxSizing: 'border-box',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: active ? C.blue : C.textPrimary,
                            marginBottom: 2,
                          }}
                        >
                          {s.label}
                        </div>
                        <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.4 }}>{s.desc}</div>
                      </button>
                    );
                  })}
                </div>
              )}

              {subType === 'other' && cxMode === 'human' && (
                <div>
                  <label style={labelStyle}>Select a metric</label>
                  <select value={otherMetric} onChange={(e) => setOtherMetric(e.target.value)} style={inputStyle}>
                    <option value="">— choose a metric —</option>
                    {OTHER_CX_METRICS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* custom_business sub-types — horizontal grid, max 3 per row */}
          {category === 'custom_business' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {CUSTOM_SUBTYPES.map((s) => {
                  const active = subType === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSubType(s.id);
                        setSelectedOpportunity('');
                        setCriteria([]);
                      }}
                      style={{
                        ...subTypeCardStyle(active),
                        width: 'calc(33.33% - 4px)',
                        minWidth: 120,
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: active ? C.blue : C.textPrimary,
                          marginBottom: 2,
                        }}
                      >
                        {s.label}
                      </div>
                      <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.4 }}>{s.desc}</div>
                    </button>
                  );
                })}
              </div>

              {/* Business Opportunities — tertiary cards */}
              {subType === 'business_opportunities' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: C.textMuted,
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Select an opportunity to detect
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {COMPUTED_FIELD_DEFINITIONS.map((opp) => {
                      const active = selectedOpportunity === opp.id;
                      return (
                        <button
                          key={opp.id}
                          type="button"
                          onClick={() => {
                            setSelectedOpportunity(opp.id);
                            const seeded = opp.criteria.map((c) => ({
                              ...c,
                              id: nextId(),
                              essential: false,
                              refs: [],
                              source: 'ai',
                            }));
                            setCriteria(seeded);
                            setPassingScore(opp.defaultPassingScore);
                            // #region agent log
                            fetch('http://127.0.0.1:7843/ingest/c954a5b1-ba58-484d-8df9-325c01df1e66', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '61942b' },
                              body: JSON.stringify({
                                sessionId: '61942b',
                                location: 'CreateMonitorPanel.tsx:oppClick',
                                message: 'opportunity selected, criteria seeded',
                                data: { oppId: opp.id, seededCount: seeded.length },
                                timestamp: Date.now(),
                                runId: 'run1',
                                hypothesisId: 'A',
                              }),
                            }).catch(() => {});
                            // #endregion
                          }}
                          style={{
                            ...subTypeCardStyle(active),
                            width: 'calc(33.33% - 4px)',
                            minWidth: 140,
                            boxSizing: 'border-box',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 13,
                              fontWeight: 600,
                              color: active ? C.blue : C.textPrimary,
                              marginBottom: 2,
                            }}
                          >
                            {opp.label}
                          </div>
                          <div style={{ fontSize: 12, color: C.textSec, lineHeight: 1.4 }}>{opp.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inline config for the selected custom sub-type */}
              {subType === 'computed_field' && (
                <div>
                  <label style={labelStyle}>Computed Field</label>
                  <select value={computedField} onChange={(e) => setComputedField(e.target.value)} style={inputStyle}>
                    <option value="">— choose a field —</option>
                    {COMPUTED_FIELD_OPTIONS.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.label}
                      </option>
                    ))}
                  </select>
                  {computedField &&
                    (() => {
                      const def = COMPUTED_FIELD_OPTIONS.find((f) => f.id === computedField);
                      return def ? (
                        <div style={{ fontSize: 12, color: C.textSec, marginTop: 6, lineHeight: 1.5 }}>
                          {def.description}
                        </div>
                      ) : null;
                    })()}
                </div>
              )}
              {subType === 'regex' && (
                <div>
                  <label style={labelStyle}>Pattern (regex or keyword)</label>
                  <input
                    value={regexPattern}
                    onChange={(e) => setRegexPattern(e.target.value)}
                    placeholder="e.g. refund|cancel|chargeback"
                    style={inputStyle}
                  />
                </div>
              )}
              {subType === 'code' && (
                <div>
                  <label style={labelStyle}>Expression</label>
                  <textarea
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    rows={5}
                    placeholder={'// Example:\n// conversation.upsell_revenue / ai_conversations_count'}
                    style={{
                      ...inputStyle,
                      fontFamily: 'ui-monospace,SFMono-Regular,monospace',
                      fontSize: 12,
                      resize: 'vertical',
                      height: 'auto',
                    }}
                  />
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4, lineHeight: 1.5 }}>
                    Reference any conversation field or aggregate. This expression is evaluated per evaluation window.
                  </div>
                </div>
              )}
              {subType === 'formula' && (
                <div
                  style={{
                    padding: '12px 14px',
                    background: '#FAFBFC',
                    border: `1px solid ${C.border}`,
                    borderRadius: 8,
                  }}
                >
                  <label style={labelStyle}>Build formula</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <select
                      value={formulaA}
                      onChange={(e) => setFormulaA(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    >
                      {FORMULA_OPERANDS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formulaOp}
                      onChange={(e) => setFormulaOp(e.target.value as typeof formulaOp)}
                      style={{
                        width: 50,
                        padding: '6px 4px',
                        border: `1px solid ${C.border}`,
                        borderRadius: 5,
                        fontFamily: FF,
                        fontSize: 14,
                        textAlign: 'center',
                      }}
                    >
                      {(['\u00f7', '\u00d7', '+', '-'] as const).map((op) => (
                        <option key={op} value={op}>
                          {op}
                        </option>
                      ))}
                    </select>
                    <select
                      value={formulaB}
                      onChange={(e) => setFormulaB(e.target.value)}
                      style={{ ...inputStyle, flex: 1 }}
                    >
                      {FORMULA_OPERANDS.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div style={{ marginTop: 8, fontSize: 12, color: C.textSec, fontStyle: 'italic' }}>
                    Preview:{' '}
                    <strong style={{ color: C.textPrimary }}>
                      {formulaA} {formulaOp} {formulaB}
                    </strong>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );

  // ------------------------------------------------------------------
  // Step 1 — Details + Advanced
  // ------------------------------------------------------------------

  const renderStep1 = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* — Details — */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label style={labelStyle}>Monitor name</label>
          <input
            value={monitorName}
            onChange={(e) => setMonitorName(e.target.value)}
            placeholder="e.g. Refund Procedure Adherence"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>
            Description <span style={{ fontWeight: 400, color: C.textMuted }}>(optional)</span>
          </label>
          <textarea
            value={monitorDesc}
            onChange={(e) => setMonitorDesc(e.target.value)}
            rows={2}
            placeholder="What does this monitor measure and why does it matter?"
            style={{ ...inputStyle, height: 'auto', resize: 'vertical' }}
          />
        </div>
        <div>
          <label style={labelStyle}>Who to monitor</label>
          <div style={{ display: 'flex', gap: 16 }}>
            {(
              [
                { value: 'aic', label: 'AI Agents' },
                { value: 'air', label: 'Agents' },
                { value: 'both', label: 'Both' },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  fontSize: 13,
                  color: C.textPrimary,
                  cursor: 'pointer',
                  fontFamily: FF,
                }}
              >
                <input
                  type="radio"
                  name="who-to-monitor"
                  value={opt.value}
                  checked={who === opt.value}
                  onChange={() => setWho(opt.value)}
                  style={{ accentColor: C.blue }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>
        {category === 'ai_adherence' && who === 'aic' && (
          <label
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
              padding: '10px 12px',
              background: C.blueBg,
              border: `1px solid ${C.blueBorder}`,
              borderRadius: 7,
              cursor: 'pointer',
              fontSize: 12,
              color: C.textPrimary,
              lineHeight: 1.5,
              fontFamily: FF,
            }}
          >
            <input
              type="checkbox"
              checked={alsoMonitorAIR}
              onChange={(e) => setAlsoMonitorAIR(e.target.checked)}
              style={{ accentColor: C.blue, marginTop: 2, flexShrink: 0 }}
            />
            <div>
              <div style={{ fontWeight: 600, marginBottom: 2 }}>Also monitor AIR (Copilot)</div>
              <div style={{ color: C.textSec }}>
                Evaluate AIR suggestion quality in flagged conversations alongside AI Agent adherence.
              </div>
            </div>
          </label>
        )}
      </div>

      {/* — Advanced — */}
      <div
        style={{
          borderTop: `1px solid ${C.border}`,
          paddingTop: 16,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: C.textMuted,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          Advanced
        </div>
        <div>
          <label style={labelStyle}>
            Linked business outcome <span style={{ fontWeight: 400, color: C.textMuted }}>(optional)</span>
          </label>
          <select value={linkedGoal} onChange={(e) => setLinkedGoal(e.target.value)} style={inputStyle}>
            <option value="">— Don&apos;t link to a goal —</option>
            {goals.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        </div>
        <div style={{ padding: '12px 14px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={alertingEnabled}
              onChange={(e) => setAlertingEnabled(e.target.checked)}
              style={{ accentColor: C.blue }}
            />
            <span style={{ fontSize: 13, fontWeight: 600, color: C.textPrimary }}>Enable alerting</span>
          </label>
          {alertingEnabled && (
            <div style={{ marginTop: 10 }}>
              <label style={labelStyle}>Cadence</label>
              <div style={{ display: 'flex', gap: 10 }}>
                {(['hourly', 'daily'] as const).map((c) => (
                  <label
                    key={c}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 5,
                      fontSize: 12,
                      color: C.textPrimary,
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="alert-cadence"
                      checked={alertCadence === c}
                      onChange={() => setAlertCadence(c)}
                      style={{ accentColor: C.blue }}
                    />
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <label style={labelStyle}>Sampling rate — evaluate {samplingRate}% of conversations</label>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={samplingRate}
            onChange={(e) => setSamplingRate(Number(e.target.value))}
            style={{ width: '100%', accentColor: C.blue }}
          />
          <div
            style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: C.textMuted, marginTop: 2 }}
          >
            <span>10%</span>
            <span>100% (all)</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ------------------------------------------------------------------
  // Step 2 — Criteria / Metric definition
  // ------------------------------------------------------------------

  const renderStep2 = () => {
    const humanSub = CX_HUMAN_SUBTYPES.find((s) => s.id === subType);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {hasCriteria && (
          <>
            {/* Passing score */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 12px',
                background: '#F4F5F7',
                borderRadius: 7,
              }}
            >
              <label style={{ font: '600 11px/14px Inter,sans-serif', color: C.textSec, whiteSpace: 'nowrap' }}>
                Passing score (out of 100)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={passingScore}
                onChange={(e) => {
                  const v = e.target.value === '' ? '' : Math.min(100, Math.max(0, Number(e.target.value)));
                  setPassingScore(v);
                }}
                style={{
                  width: 64,
                  padding: '4px 8px',
                  border: `1px solid ${C.border}`,
                  borderRadius: 5,
                  font: '400 12px/18px Inter,sans-serif',
                  fontFamily: FF,
                  color: C.textPrimary,
                  outline: 'none',
                  background: '#fff',
                }}
              />
              <span style={{ font: '400 13px/17px Inter,sans-serif', color: C.textMuted }}>
                Conversations at or above this score count as passing.
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 12, color: C.textSec }}>Name · weight · must pass</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: totalWeight === 100 ? '#16A34A' : '#DC2626' }}>
                Total weight: {totalWeight} / 100
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {criteria.map((c, idx) => (
                <CriterionRow
                  key={c.id}
                  c={c}
                  idx={idx}
                  totalWeight={totalWeight}
                  onChange={(patch) => updateCriterion(idx, patch)}
                  onRemove={() => removeCriterion(idx)}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={addCriterion}
              style={{
                width: '100%',
                padding: '8px',
                border: `1px dashed ${C.border}`,
                borderRadius: 6,
                background: '#fff',
                cursor: 'pointer',
                fontSize: 12,
                color: C.textSec,
                fontFamily: FF,
              }}
            >
              + Add evaluation item
            </button>
          </>
        )}

        {/* Human CX: target range */}
        {!hasCriteria && humanSub && (
          <div>
            <label style={labelStyle}>{humanSub.targetLabel}</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="number"
                min={0}
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value === '' ? '' : Number(e.target.value))}
                style={{ ...inputStyle, width: 100 }}
              />
              <span style={{ fontSize: 13, color: C.textSec }}>{humanSub.unit}</span>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>
              An alert will be triggered when the metric crosses this threshold.
            </div>
          </div>
        )}

        {/* Custom: metric recaps */}
        {!hasCriteria && subType === 'computed_field' && (
          <div style={{ padding: '10px 12px', background: '#F4F5F7', borderRadius: 7, fontSize: 12, color: C.textSec }}>
            Field:{' '}
            <strong style={{ color: C.textPrimary, fontFamily: 'ui-monospace,SFMono-Regular,monospace' }}>
              {computedField || '—'}
            </strong>
          </div>
        )}
        {!hasCriteria && subType === 'formula' && (
          <div style={{ padding: '10px 12px', background: '#F4F5F7', borderRadius: 7, fontSize: 12, color: C.textSec }}>
            Formula:{' '}
            <strong style={{ color: C.textPrimary }}>
              {formulaA} {formulaOp} {formulaB}
            </strong>
          </div>
        )}
        {!hasCriteria && subType === 'regex' && (
          <div style={{ padding: '10px 12px', background: '#F4F5F7', borderRadius: 7, fontSize: 12, color: C.textSec }}>
            Pattern:{' '}
            <strong style={{ color: C.textPrimary, fontFamily: 'ui-monospace,SFMono-Regular,monospace' }}>
              {regexPattern || '—'}
            </strong>
          </div>
        )}
        {!hasCriteria && subType === 'code' && (
          <div style={{ padding: '10px 12px', background: '#F4F5F7', borderRadius: 7, fontSize: 12, color: C.textSec }}>
            <div style={{ marginBottom: 4 }}>Expression:</div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'ui-monospace,SFMono-Regular,monospace',
                fontSize: 11,
                color: '#1A1D23',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {codeSnippet || '—'}
            </pre>
          </div>
        )}
      </div>
    );
  };

  // ------------------------------------------------------------------
  // Step 3 — Review
  // ------------------------------------------------------------------

  const renderStep3 = () => {
    const humanSub = CX_HUMAN_SUBTYPES.find((s) => s.id === subType);
    const linkedGoalName = goals.find((g) => g.id === linkedGoal)?.name;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ fontSize: 13, color: C.textSec, lineHeight: 1.5 }}>
          Review your monitor before adding it. You can go back to make changes.
        </div>

        {/* Name + Type */}
        <div
          style={{
            padding: '14px 16px',
            background: '#FAFBFC',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 3,
              }}
            >
              Monitor name
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.textPrimary }}>{monitorName || '—'}</div>
            {monitorDesc && (
              <div style={{ fontSize: 12, color: C.textSec, marginTop: 3, lineHeight: 1.5 }}>{monitorDesc}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 3,
                }}
              >
                Type
              </div>
              <div style={{ fontSize: 12, color: C.textPrimary }}>
                {labelForCategory(category)}
                {subType && <span style={{ color: C.textSec }}> › {labelForSubType(category, subType, cxMode)}</span>}
                {subType === 'business_opportunities' && selectedOpportunity && (
                  <span style={{ color: C.textSec }}>
                    {' › '}
                    {COMPUTED_FIELD_DEFINITIONS.find((f) => f.id === selectedOpportunity)?.label}
                  </span>
                )}
                {subType === 'computed_field' && computedField && (
                  <span style={{ color: C.textSec }}>
                    {' › '}
                    {COMPUTED_FIELD_OPTIONS.find((f) => f.id === computedField)?.label}
                  </span>
                )}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 3,
                }}
              >
                Who
              </div>
              <div style={{ fontSize: 12, color: C.textPrimary }}>
                {{ aic: 'AI Agents', air: 'Agents', both: 'Both' }[who]}
                {alsoMonitorAIR && <span style={{ color: C.textSec }}> + AIR</span>}
              </div>
            </div>
            {passingScore !== '' && hasCriteria && (
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: C.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                    marginBottom: 3,
                  }}
                >
                  Passing score
                </div>
                <div style={{ fontSize: 12, color: C.textPrimary }}>{passingScore} / 100</div>
              </div>
            )}
          </div>
        </div>

        {/* Criteria */}
        {hasCriteria && criteria.length > 0 && (
          <div
            style={{ padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 10,
              }}
            >
              Evaluation criteria
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {criteria.map((c) => (
                <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 12, color: C.textPrimary, fontWeight: 500 }}>
                    {c.name || <em style={{ color: C.textMuted }}>Unnamed</em>}
                  </div>
                  <span style={{ fontSize: 12, color: C.textSec, flexShrink: 0 }}>{c.weight} wt</span>
                  {c.essential && (
                    <span
                      style={{
                        fontSize: 10,
                        background: '#FEF3C7',
                        color: '#92400E',
                        border: '1px solid #FDE68A',
                        borderRadius: 3,
                        padding: '1px 5px',
                        flexShrink: 0,
                      }}
                    >
                      must pass
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Human CX target */}
        {!hasCriteria && humanSub && targetValue !== '' && (
          <div
            style={{ padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              Alert threshold
            </div>
            <div style={{ fontSize: 12, color: C.textPrimary }}>
              {humanSub.targetLabel}:{' '}
              <strong>
                {targetValue} {humanSub.unit}
              </strong>
            </div>
          </div>
        )}

        {/* Custom metric recaps */}
        {!hasCriteria && subType === 'computed_field' && computedField && (
          <div
            style={{ padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              Computed field
            </div>
            <div style={{ fontSize: 12, fontFamily: 'ui-monospace,SFMono-Regular,monospace', color: '#1A1D23' }}>
              {computedField}
            </div>
          </div>
        )}
        {!hasCriteria && subType === 'formula' && (
          <div
            style={{ padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              Formula
            </div>
            <div style={{ fontSize: 12, color: C.textPrimary }}>
              {formulaA} {formulaOp} {formulaB}
            </div>
          </div>
        )}
        {!hasCriteria && subType === 'regex' && regexPattern && (
          <div
            style={{ padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              Pattern
            </div>
            <div style={{ fontSize: 12, fontFamily: 'ui-monospace,SFMono-Regular,monospace', color: '#1A1D23' }}>
              {regexPattern}
            </div>
          </div>
        )}
        {!hasCriteria && subType === 'code' && codeSnippet && (
          <div
            style={{ padding: '14px 16px', background: '#FAFBFC', border: `1px solid ${C.border}`, borderRadius: 8 }}
          >
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 6,
              }}
            >
              Expression
            </div>
            <pre
              style={{
                margin: 0,
                fontSize: 11,
                fontFamily: 'ui-monospace,SFMono-Regular,monospace',
                color: '#1A1D23',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
              }}
            >
              {codeSnippet}
            </pre>
          </div>
        )}

        {/* Advanced */}
        <div
          style={{
            padding: '14px 16px',
            background: '#FAFBFC',
            border: `1px solid ${C.border}`,
            borderRadius: 8,
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 3,
              }}
            >
              Alerting
            </div>
            <div style={{ fontSize: 12, color: C.textPrimary }}>
              {alertingEnabled ? `${alertCadence.charAt(0).toUpperCase() + alertCadence.slice(1)} alerts` : 'Off'}
            </div>
          </div>
          <div>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: C.textMuted,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                marginBottom: 3,
              }}
            >
              Sampling
            </div>
            <div style={{ fontSize: 12, color: C.textPrimary }}>{samplingRate}% of conversations</div>
          </div>
          {linkedGoalName && (
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: C.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginBottom: 3,
                }}
              >
                Linked goal
              </div>
              <div style={{ fontSize: 12, color: C.textPrimary }}>{linkedGoalName}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const stepTitles = ['Choose monitor type', 'Details', 'Criteria', 'Review'];
  const currentTitle = stepTitles[step] ?? 'Add monitor';

  // Shared footer buttons used by both layouts
  const footerButtons = (
    <div
      style={{
        padding: '14px 24px',
        borderTop: `1px solid ${C.border}`,
        background: '#fff',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        flexShrink: 0,
      }}
    >
      <div>
        {step > 0 && (
          <ButtonSecondary onClick={goBack} size="small">
            Back
          </ButtonSecondary>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <ButtonSecondary onClick={handleClose} size="small">
          Cancel
        </ButtonSecondary>
        {step === 3 ? (
          <ButtonPrimary onClick={handleClose} size="small">
            Add monitor
          </ButtonPrimary>
        ) : (
          <ButtonPrimary onClick={goNext} disabled={!canAdvanceStep()} size="small">
            Continue
          </ButtonPrimary>
        )}
      </div>
    </div>
  );

  // Step label row shared between layouts
  const stepLabelsRow = (
    <div style={{ display: 'flex', gap: 0 }}>
      {STEP_LABELS.map((lbl, i) => (
        <div
          key={lbl}
          style={{
            flex: 1,
            fontSize: 9,
            fontWeight: i === step ? 700 : 400,
            color: i <= step ? C.blue : C.textMuted,
            textAlign: 'center',
            lineHeight: 1.4,
            paddingTop: 2,
          }}
        >
          {lbl}
        </div>
      ))}
    </div>
  );

  // ── Full-page layout ──────────────────────────────────────────────────────
  if (fullPage) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: '#F4F5F7',
          fontFamily: FF,
        }}
      >
        {/* Top navigation bar — minimal, matches automations header chrome */}
        <div
          style={{
            background: '#fff',
            borderBottom: `1px solid ${C.border}`,
            height: 56,
            padding: '0 16px 0 8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          {/* Left: back button */}
          <ButtonText onClick={onBack ?? handleClose} icon="chevron-left">
            Monitors
          </ButtonText>

          {/* Center: page label */}
          <span style={{ fontSize: 13, fontWeight: 600, color: C.textMuted, letterSpacing: '0.02em' }}>
            New monitor
          </span>

          {/* Right: sidebar toggle */}
          <IconButton
            icon="sidebar-flip"
            onClick={() => setAiOpen((o) => !o)}
            tooltip={aiOpen ? 'Collapse AI assistant' : 'Expand AI assistant'}
            size="small"
            isActive={aiOpen}
          />
        </div>

        {/* Main area: wizard + optional AI panel */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Wizard body — scrollable, centered */}
          <div
            style={{ flex: 1, overflowY: 'auto', padding: '28px 24px 32px', display: 'flex', justifyContent: 'center' }}
          >
            <div style={{ width: '100%', maxWidth: 1080 }}>
              {/* Step indicator lives in the body, not the header */}
              <div style={{ marginBottom: 24 }}>
                <StepIndicator current={step} />
                {stepLabelsRow}
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 700, color: C.textPrimary, margin: '0 0 20px', lineHeight: 1.3 }}>
                {currentTitle}
              </h2>
              {step === 0 && renderStep0()}
              {step === 1 && renderStep1()}
              {step === 2 && renderStep2()}
              {step === 3 && renderStep3()}
            </div>
          </div>

          {/* AI assistant sidebar */}
          {aiOpen && <AiAssistantPanel step={step} onClose={() => setAiOpen(false)} />}
        </div>

        {footerButtons}
      </div>
    );
  }

  // ── Drawer layout (default) ───────────────────────────────────────────────
  return (
    <Drawer open={open} onClose={handleClose}>
      <div style={{ fontFamily: FF, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: C.textMuted,
                  letterSpacing: 0.4,
                  textTransform: 'uppercase',
                  marginBottom: 4,
                }}
              >
                New monitor
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: C.textPrimary, margin: 0, lineHeight: 1.3 }}>
                {currentTitle}
              </h2>
            </div>
            <IconButton icon="xmark" onClick={handleClose} size="small" tooltip="Close" />
          </div>
          <StepIndicator current={step} />
          <div style={{ marginTop: 4 }}>{stepLabelsRow}</div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '18px 22px 24px' }}>
          {step === 0 && renderStep0()}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {footerButtons}
      </div>
    </Drawer>
  );
};

// ---------------------------------------------------------------------------
// Shared style helpers
// ---------------------------------------------------------------------------

const subTypeCardStyle = (active: boolean): React.CSSProperties => ({
  textAlign: 'left',
  padding: '10px 14px',
  borderRadius: 8,
  border: `1.5px solid ${active ? C.blue : C.border}`,
  background: active ? C.blueBg : '#fff',
  cursor: 'pointer',
  fontFamily: FF,
  boxShadow: active ? '0 0 0 3px rgba(28,110,242,0.12)' : 'none',
  transition: 'all 0.12s ease',
  width: '100%',
});

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 600,
  color: '#1A1D23',
  marginBottom: 6,
  fontFamily: FF,
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: `1px solid ${C.border}`,
  fontSize: 13,
  fontFamily: FF,
  color: '#1A1D23',
  outline: 'none',
  background: '#fff',
  boxSizing: 'border-box',
};

/* export default CreateMonitorPanel */
Object.assign(window, { CreateMonitorPanel });
})();

// ─── cursor/MonitoringPage.tsx ───────────────────────────────
(() => {
const { useCallback, useMemo, useState } = React;

const { STUB_MONITORS, STUB_GOALS } = window;
const { STUB_ANOMALIES } = window;
const MonitorsTab = window.MonitorsTab;
const AnomaliesTab = window.AnomaliesTab;
const CreateMonitorPanel = window.CreateMonitorPanel;
const Tabs = window.Tabs;
const Tab = window.Tab;
const styles = new Proxy({}, { get: (_, k) => String(k) });

const FF = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif";

const MonitoringPage = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [focusAnomalyId, setFocusAnomalyId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const counts = useMemo(() => {
    const monitorsNeedingReview = STUB_MONITORS.filter((m) => !!m.alerting?.enabled).length;
    return {
      monitorsNeedingReview,
      anomalies: STUB_ANOMALIES.filter((a) => a.cat === 'criteria').length,
    };
  }, []);

  const onViewAnomaly = useCallback((anomalyId: string) => {
    setFocusAnomalyId(anomalyId);
    setActiveTab(1);
  }, []);

  const consumeFocus = useCallback(() => setFocusAnomalyId(null), []);

  return (
    <div
      className={styles.monitoringPage}
      data-kt="kustomer-ai-monitoring"
      style={{ fontFamily: FF, display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {creating ? (
        <CreateMonitorPanel
          open
          onClose={() => setCreating(false)}
          onBack={() => setCreating(false)}
          goals={STUB_GOALS}
          fullPage
        />
      ) : (
        <Tabs activeTab={activeTab} onTabChange={setActiveTab} tabListContainerClassName={styles.tabNav}>
          <Tab title="Monitors" count={counts.monitorsNeedingReview || undefined}>
            <div className={styles.page}>
              <MonitorsTab onViewAnomaly={onViewAnomaly} onStartCreate={() => setCreating(true)} />
            </div>
          </Tab>
          <Tab title="Anomalies" count={counts.anomalies || undefined}>
            <div className={styles.page}>
              <AnomaliesTab focusAnomalyId={focusAnomalyId} onFocusConsumed={consumeFocus} />
            </div>
          </Tab>
        </Tabs>
      )}
    </div>
  );
};

/* export default MonitoringPage */
Object.assign(window, { MonitoringPage });
})();
