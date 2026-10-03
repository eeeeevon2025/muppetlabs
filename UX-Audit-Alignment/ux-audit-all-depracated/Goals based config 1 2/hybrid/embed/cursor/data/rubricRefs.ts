// Shared rubric reference catalog and seeding helpers.
// Used by MonitorCard (when editing scoring criteria) AND ReviewPanel
// (so the "With scoring" view can show the same /kb:, /tool:, /procedure:
// chips that the criterion is linked to in its monitor definition).

import { MonitorCriterion } from '../types';

export type RubricRefType = 'kb' | 'tool' | 'procedure' | 'rubric';

export interface RubricRef {
  type: RubricRefType;
  slug: string;
}

export interface RubricRefMeta {
  color: string;
  bg: string;
  border: string;
  label: string;
}

export interface RefLibEntry {
  slug: string;
  label: string;
}

export const REF_LIB: Record<RubricRefType, RefLibEntry[]> = {
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

export const REF_TYPE_META: Record<RubricRefType, RubricRefMeta> = {
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
export const seedRefsForCriterion = (c: MonitorCriterion): RubricRef[] => {
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
export const buildRefsByCriterion = (criteria: MonitorCriterion[]): Record<string, RubricRef[]> => {
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
export const findRefsForScoreName = (refsByCriterion: Record<string, RubricRef[]>, scoreName: string): RubricRef[] => {
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
