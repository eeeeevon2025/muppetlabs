// Shared library — Procedures and Response Tones reused across AI for Customers and Reps.

const LIBRARY = {
  procedures: [
    { id: "pr1", name: "Verify Customer Identity", desc: "Check email + last-4 of order before sharing account details. Used by 4 automations.", usedIn: ["Refund Order", "Address Change", "Account Recovery", "Reps · Copilot"], updated: "Apr 22, 2026" },
    { id: "pr2", name: "Refund Eligibility Check", desc: "Confirm order is within 30-day window, hasn't already been refunded, and shipping is paid by us.", usedIn: ["Refund Order", "Reps · Copilot"], updated: "Apr 18, 2026" },
    { id: "pr3", name: "Convincing Customer", desc: "If hesitant about refund timeline, reassure by referencing policy and offering store credit alternative.", usedIn: ["Refund Order"], updated: "Mar 30, 2026" },
    { id: "pr4", name: "Issue Store Credit", desc: "Apply credit through Shopify, confirm amount with customer, log reason in CRM.", usedIn: ["Refund Order", "Order Cancellation"], updated: "Apr 11, 2026" },
    { id: "pr5", name: "Escalate to Human", desc: "Transfer to live rep when sentiment is angry, value > $500, or 3+ failed resolutions.", usedIn: ["Refund Order", "Address Change", "Reps · Copilot"], updated: "Apr 28, 2026" },
    { id: "pr6", name: "Handle Defective Product", desc: "Apologize, gather order + photos, offer replacement or refund based on customer preference.", usedIn: ["Reps · Copilot"], updated: "Apr 5, 2026" },
  ],
  tones: [
    { id: "t1", name: "Friendly + Concise", desc: "Maintain a warm and friendly tone while providing brief and to-the-point responses.", usedIn: ["Refund Order", "Reps · Copilot"], updated: "Apr 12, 2026" },
    { id: "t2", name: "Professional", desc: "Formal, neutral phrasing. No exclamation marks, minimal contractions.", usedIn: ["Address Change"], updated: "Mar 15, 2026" },
    { id: "t3", name: "Empathetic", desc: "Lead with acknowledgement of customer feeling. Apologize before solving.", usedIn: ["Defective Product", "Reps · Copilot"], updated: "Apr 20, 2026" },
    { id: "t4", name: "Matter of Fact", desc: "Direct, action-oriented. Skip pleasantries when customer asks status questions.", usedIn: [], updated: "Feb 28, 2026" },
  ],
};

Object.assign(window, { LIBRARY });
