import { useState, useRef } from 'react';

import {
  type Goal,
  type MonitorCriterion,
  type MonitorTemplateCategory,
  type MonitorTemplateSubType,
  type CxMetricMode,
  type MonitorKind,
} from '../types';
import { type RubricRef, seedRefsForCriterion } from '../data/rubricRefs';
import Drawer from '../components/Drawer/Drawer';
import RubricRefEditor from '../components/RubricRefEditor';
import ButtonPrimary from 'komponentsV2/buttons/ButtonPrimary';
import ButtonSecondary from 'komponentsV2/buttons/ButtonSecondary';
import ButtonText from 'komponentsV2/buttons/ButtonText';
import IconButton from 'komponentsV2/buttons/IconButton';
import Icon from 'komponentsV2/icons/Icon';
import { CopilotContainer } from 'komponentsV2/copilot/CopilotContainer';

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

export default CreateMonitorPanel;
