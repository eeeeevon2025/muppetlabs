// Types mirror the K_DATA shape from the source design HTML so monitors,
// goals, conversations and anomalies can be rendered with high fidelity.

export type MonitorKind = 'aic' | 'air' | 'both';
export type MonitorMetricKind =
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

export type MonitorTemplateCategory = 'ai_adherence' | 'cx_metric' | 'custom_business';
export type CxMetricMode = 'human' | 'ai_evaluated';
export type MonitorTemplateSubType =
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
export interface RubricBand {
  lo: number;
  hi: number;
  text: string;
  passing: boolean;
}

/** Custom rubric attached directly to a criterion. */
export interface CriterionRubric {
  name: string;
  bands: RubricBand[];
}

export interface MonitorCriterion {
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

export interface Monitor {
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

export interface Goal {
  id: string;
  name: string;
  description: string;
}

export type AnomalyCategory = 'monitor' | 'criteria';
export type AnomalySeverity = 'high' | 'med' | 'drift' | 'pos';
export type AnomalyDirection = 'up' | 'down';

export interface Anomaly {
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

export interface ConversationExcerpt {
  who: 'cust' | 'agent';
  t: string;
}

export type ConvoSentiment = 'angry' | 'frustrated' | 'resigned' | 'satisfied';

export interface InvestigationConversation {
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

export interface OperationalMetric {
  label: string;
  sub: string;
  vals: number[];
}

// Per-criterion score that a single conversation received against the monitor.
// Mirrors window.K_DATA.flaggedConversations[].criteriaScores from the source HTML.
export interface ReviewCriterionScore {
  name: string;
  weight: number;
  score: number;
  pass: boolean;
  essential?: boolean;
  rationale?: string;
  source?: string;
}

export type ReviewMessageRole = 'customer' | 'ai' | 'system' | 'tool';

export interface ReviewMessage {
  role: ReviewMessageRole;
  text: string;
  time: string;
}

// Conversation as shown inside the "Review conversations" / Investigate drawer.
// Combines real flagged failures and synthetic passing templates the monitor
// would expect a reviewer to label.
export interface ReviewConversation {
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
