import { ReviewConversation } from '../types';

// Real-world flagged failures, mirroring window.K_DATA.flaggedConversations
// from the source AI-Monitoring HTML. Each carries the criteria scores the
// monitor judged it against, plus a transcript so the reviewer can confirm or
// overturn the AI's verdict directly inside the drawer.
export const FLAGGED_CONVERSATIONS: ReviewConversation[] = [
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
export const buildReviewQueue = (monitorId: string): ReviewConversation[] => {
  const failing = FLAGGED_CONVERSATIONS.filter((c) => c.monitorId === monitorId);
  return [...failing.slice(0, 2), ...PASSING_TEMPLATES.slice(0, 3), ...failing.slice(2)];
};
