import { Monitor, Goal } from '../types';

export const STUB_GOALS: Goal[] = [
  { id: 'goal_csat', name: 'Increase CSAT', description: '' },
  { id: 'goal_sentiment', name: 'Improve customer sentiment', description: '' },
  { id: 'goal_retention', name: 'Improve net retention in european market', description: '' },
  { id: 'goal_cost', name: 'Reduce AI cost per conversation', description: '' },
];

export const STUB_MONITORS: Monitor[] = [
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
];
