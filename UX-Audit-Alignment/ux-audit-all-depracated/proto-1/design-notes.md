# Goals & AI Monitoring — Design Rationale

## v2 — Reframed around narrative, traceability, and one mental model

### What changed from v1

**v1 problem:** I treated the PM's prototype as the spec and just polished the surfaces. Result: same 4 nav items, same dashboard-of-tiles home page, same wizard-driven creation flow. It looked better but didn't actually reduce cognitive load.

**v2 reframe:** Goals is the *only* primary mental model. Monitors and Computed Fields are plumbing — they exist, but admins shouldn't have to learn them to use the product.

### Key shifts

1. **Sidebar collapsed from 4 → 2 + 1.** Goals (primary) and Inbox (alerts) are the only things admins need daily. Scoring & fields lives under "Configuration" with an explicit "you probably don't need to be here" callout. Monitors no longer exist as a primary surface — they show up inline on the Goal page as "How conversations are scored," collapsed by default.

2. **Goals home leads with a narrative summary, not metric tiles.** v1 opened with 5 dashboard tiles (avg score, pass rate, items needing review, etc.). That's data slop — it doesn't tell you anything about what to *do*. v2 opens with a one-sentence summary: *"3 of 5 goals are improving this week. 1 needs a closer look — Procedure Adherence has stalled."* Wins-first, then attention items.

3. **Operational loop is visible.** A 4-step strip (Observe → Investigate → Understand → Resolve) makes the closed-loop model explicit. Each step is clickable; counts show what's flowing through. This is the "first-run banner" from v1, but persistent and functional.

4. **Goal cards have inline rationale.** Every goal card has a "Why this number?" callout — *"Up 8% this week. 91% of conversations passed scoring."* Not just trend arrows. The rationale is the hero.

5. **Goal creation is one step, not three.** v1 had a 2-step wizard (template → refine). v2 is a single picker: pick a template, set a target, done. Scope/criteria/naming are behind an "Advanced options" expander. We auto-create the scorer and Computed Field invisibly.

6. **Suggestions show a traceability chain.** Every suggestion card has a 3-column trace: *"We saw 23 conversations failing → common pattern → proposed fix"* with clickable conversation IDs. This is the explainability story — admins can audit our reasoning end-to-end.

7. **Calmer visual tone.** Soft yellow for attention (not red). Batched daily digest, not real-time alert noise. Anomalies and suggestions live in one inbox.

8. **Every screen has a clear next action.** A footer card on each screen tells the user what to do next ("Review suggestions" / "Set up scoring" / "Add another goal"). No dead ends.

### What v1 still has that v2 inherits

- Full scoring criteria drill-down (essential vs weighted) — kept on Goal detail
- Conversation-level evaluation drawer (JOB 5) — unchanged, still works
- Computed Fields surface — moved to Settings, still complete
- Kustomer brand (Sunshine Yellow + Periwinkle) — applied throughout

### Files

- `Goals.html` — v2 (current)
- `Goals v1.html` — v1 preserved for comparison
- `app/v2.css` + `app/v2.jsx` — v2 overlays on the v1 component library
