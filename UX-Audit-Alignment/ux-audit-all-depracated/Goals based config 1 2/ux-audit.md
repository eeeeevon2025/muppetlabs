# Kustomer AI — UX Clarity & Consistency Audit

**Scope:** Revision/clarity pass on the existing Goals-First prototype (`prototype-v2/`). Not a redesign.
**Lens:** Non-technical reader, ~8th-grade reading level, scans quickly, forgets concepts between pages.
**Canonical mental model being taught:**

> Customer **Conversations** → cluster into **Topics** → reveal repeated issues → you set **Goals** (measurable outcomes) → **AI Automations** do the work to reach goals → automations use shared **Building Blocks** (Procedures, Knowledge Sources, Tools, Guardrails) → **Monitors** watch performance → **Suggestions** recommend fixes → **Drift** flags behavior changes → **Reporting** helps you optimize over time.

**Legend:** ✅ already addressed in this pass · ⚠️ partially addressed · ❗open issue

---

## PAGE-BY-PAGE AUDIT

### 1. First-run wizard — Step 1: "Tell us about your business"

**What users may not understand**
- Why a business profile is being collected before they've done anything.
- That the topic table is built from their own conversation history (not generic).
- What "AHT" means (now has a tooltip, but the abbreviation is still cold on first read).

**Glossary terms present:** Company Profile, Topic, Topic analysis, Volume, AHT, Goal (implied).

**Terminology problems**
- "AHT" abbreviation in a column header. ⚠️ Tooltip added; consider spelling out "Avg. handle time" inline.

**Missing relationships**
- ✅ Now stated: profile grounds AI responses **and** drives goal suggestions on the next step.
- ✅ Topic intro now spells out *conversations → topics → goal suggestions* with concrete examples.

**Mental-model breakdowns:** none material after edits.

**Rewritten copy (in place)**
- Subtitle: "We use this in two ways: to ground every AI response in your business, and to suggest the right goals for you on the next step."
- Topic section: "We've sorted your last 90 days of conversations into the topics below. Check the topics you care about most — we'll use these to suggest the right goals on the next step."

**Glossary reinforcement opportunities**
- Add a one-line "What's a topic?" inline definition the first time the word appears.

**Prioritized improvements:** (1) spell out AHT inline ❗ · (2) micro-definition of Topic ⚠️.

---

### 2. First-run wizard — Step 2: "Here are your suggested goals"

**What users may not understand**
- Why these specific goals were chosen.
- That they can keep/skip individually and edit later.

**Glossary terms present:** Goal, Topic, Conversation, Company Profile.

**Terminology problems:** none significant.

**Missing relationships**
- ✅ Subtitle ties goals back to the company's last-90-days conversations.
- ⚠️ Each draft goal lists its Topics (good), but doesn't show the *automation it will spawn* — the Goal→Automation link is taught later, not here.

**Rewritten copy (in place):** "Drafted from {company}'s last 90 days of conversations. Keep what fits, skip what doesn't. You can edit every goal after creating it."

**Glossary reinforcement:** add a quiet line — "Pick a goal and we'll set up the AI to drive it" — to pre-teach Goal→Automation.

**Prioritized improvements:** (1) pre-teach Goal→Automation on the draft cards ⚠️.

---

### 3. Goals (home)

**What users may not understand**
- That a goal is an *outcome*, not a task or a report.
- The relationship between a goal and the AI doing the work.

**Glossary terms present:** Goal, AI Automation, Monitor, Topic.

**Terminology problems:** none after edits.

**Missing relationships**
- ✅ Subtitle now: "A goal is a measurable result you want… You set the goal; AI automations do the work to reach it."
- ✅ Goal cards show "{N} AI automation(s) driving this goal" instead of the bare "{N} attached."

**Mental-model:** ✅ hero line "Define the outcome, the AI drives it" reinforces the spine.

**Glossary reinforcement:** the empty state is a strong teaching moment — consider a tiny inline diagram of the chain.

**Prioritized improvements:** (1) optional chain diagram in empty state ⚠️.

---

### 4. Goal detail

**What users may not understand**
- Where the attached automations / topics / monitors came from.
- That topics are auto-detected, not hand-tagged.

**Glossary terms present:** Goal, AI Automation, Topic, Monitor, Suggestion, Coverage.

**Terminology problems:** none after edits.

**Missing relationships**
- ✅ Section renamed "AI driving this goal" (was "Attached AI Automations").
- ✅ Topics section: "Topics this goal covers" + plain-English explanation of auto-detection.
- ✅ Fixed inconsistency: link now reads "See the full Topics report" (Reporting = view), matching onboarding's "Manage: Settings → Topics."

**Glossary reinforcement:** good density already; the info callouts do real teaching.

**Prioritized improvements:** none high-priority.

---

### 5. Automations (list)

**What users may not understand**
- That an automation is the *worker*, and a goal is the *why*.
- What "Drives" column means.

**Glossary terms present:** AI Automation, Goal (Drives), Audience, Status, Building Blocks (implied).

**Terminology problems**
- ❗ "Drives" column header is terse; non-technical users may not parse it. Consider "Goal it drives."
- ⚠️ Nav section "AI for Customers / AI for Reps" vs. the automation audience chip "Customer AI / Rep AI" — two phrasings for one idea (left as-is to avoid renaming; flagged).

**Missing relationships**
- ✅ Subtitle now: "AI automations do the work to reach your goals. Each one uses shared building blocks…"

**Prioritized improvements:** (1) clarify "Drives" column header ❗ · (2) reconcile "AI for Customers" vs "Customer AI" wording ⚠️ (needs sign-off — borders on rename).

---

### 6. Automation — Build tab

**What users may not understand**
- The order of operations and which decision is foundational.

**Glossary terms present:** AI Automation, Audience (Customer AI / Rep AI), Goal, Knowledge Sources, Procedures, Tone, Guardrails (cross-link), Scenarios.

**Terminology problems:** none after edits.

**Missing relationships**
- ✅ New "Who is this AI for?" selector (Step 1 · Decide first) makes the audience decision explicit and frames it as one-or-the-other.
- ✅ Goal-context strip keeps the Goal→Automation link visible ("This automation drives …").
- ✅ Section headers are declarative: "What the AI knows / does / sounds like."

**Glossary reinforcement:** strong. The audience selector descriptions double as definitions.

**Prioritized improvements:** none high-priority.

---

### 7. Automation — Test tab

**What users may not understand**
- What a "Test Category" is and how scoring relates to their goal.

**Glossary terms present:** Test Category, Goal, Topic, Conversation, Scorecard (implied).

**Terminology problems**
- ⚠️ "Test Categories" is clear enough, but the link from a failing category → the goal it endangers could be louder.

**Missing relationships**
- ⚠️ Tests are "scored against your configured goals" (stated once). Reinforce per-row.

**Prioritized improvements:** (1) per-category "affects goal: …" tag ⚠️.

---

### 8. Automation — Deploy tab

**What users may not understand**
- Why some sections appear/disappear (now gated by audience).

**Glossary terms present:** Deploy, Smart Routing, Rollout strategy, Holdback group, Conditions, Copilot.

**Terminology problems**
- ⚠️ "Smart Routing," "Holdback group" are SaaS terms; both now have helper text but remain slightly insider.

**Missing relationships**
- ✅ Deploy now shows only the matching configuration (Customer AI → Conditions/Routing; Rep AI → Copilot). No more "both at once" confusion.
- ✅ Header copy adapts to audience.

**Prioritized improvements:** (1) plain-language gloss on "Holdback group" in the label itself ⚠️.

---

### 9. Automation — Analyze tab

**What users may not understand**
- What "Analyze" delivers vs. Performance vs. Reporting (three overlapping "how's it doing" surfaces).
- What "Drift" means.

**Glossary terms present:** Suggestion, Conversation, Scorecard, Drift.

**Terminology problems**
- ❗ "Drift" is technical. Kept (no-rename), but needs an inline gloss everywhere it appears: "Drift — a change in the AI's behavior over time."
- ❗ "Analyze / Scorecards / Performance / Reporting" overlap conceptually (see Consolidation section).

**Missing relationships**
- ⚠️ Suggestions here vs. on Performance vs. on each block — the same Suggestion concept spans surfaces; tell users it's one inbox seen from different angles.

**Prioritized improvements:** (1) inline gloss for "Drift" ❗ · (2) one-line orientation distinguishing Analyze (this automation) from Performance (all automations) ❗.

---

### 10. Performance

**What users may not understand**
- How Performance differs from an automation's Analyze tab.

**Glossary terms present:** Monitor, Suggestion, Drift, Goal.

**Terminology problems:** "Drift" again ❗.

**Missing relationships**
- ✅ Subtitle now connects the trio: "Monitors watch how your AI is performing… when a monitor spots a problem or a drift, it shows up here with a suggestion to fix it." (Monitor → Drift → Suggestion).

**Prioritized improvements:** (1) "all automations, across goals" scope line to disambiguate from Analyze ⚠️.

---

### 11. Reporting

**What users may not understand**
- That this is where Topics live as a report (currently a stub).

**Glossary terms present:** Reporting, Topic.

**Terminology problems:** none.

**Missing relationships**
- ⚠️ Multiple pages deep-link to "Reporting → Topics"; the destination is a stub, so the relationship is asserted but not demonstrated.

**Prioritized improvements:** (1) build at least a minimal Topics report so the link pays off ⚠️.

---

### 12. Building Blocks — Procedures / Knowledge Sources / Tools / Guardrails / Scenarios

**What users may not understand**
- That these are *shared, reusable* and feed *automations* — not standalone settings.
- Scenarios → Procedures pipeline.

**Glossary terms present:** Procedures, Knowledge Sources, Tools, Guardrails, Scenarios, AI Automation.

**Terminology problems**
- ✅ Fixed: "Shared Guardrails" page now "Guardrails," matching the nav.
- ✅ Fixed: nav "Building Blocks" now matches page crumbs (was "Shared library").

**Missing relationships**
- ✅ Every block subtitle now ends "A building block your AI automations share," reinforcing Building Blocks → Automations four times.
- ✅ Scenarios subtitle now states the Scenarios → draft Procedures pipeline.

**Prioritized improvements:** (1) a Building Blocks landing/overview that names all five and the Automations they feed ⚠️.

---

## FINAL DELIVERABLE

### 1. Unified glossary (plain English)
See `Glossary` below — already aligned to the in-product copy.

| Term | Plain-English meaning | Comes from / used by |
|---|---|---|
| Goal | A measurable result you want (e.g. fewer refunds). | You set it; AI Automations drive it; Monitors track it. |
| AI Automation | An AI agent that does the work to reach a goal. | Driven by a Goal; uses Building Blocks. |
| Customer AI | An automation that handles customer conversations end to end. | One audience type of an Automation. |
| Rep AI (Copilot) | An automation that assists a human rep. | The other audience type. |
| Topic | A group of similar customer conversations (e.g. "Refund order"). | Built from Conversations; steers Goal suggestions. |
| Monitor | A live scorecard that watches AI behavior on a goal. | Attached to Goals; raises Suggestions/Drift. |
| Suggestion | An AI-proposed fix you can apply, edit, or dismiss. | Raised by Monitors; targets a Building Block. |
| Drift / Anomaly | A change in the AI's behavior over time. | Detected by Monitors; shown in Performance/Analyze. |
| Company Profile | Your business details, captured once. | Grounds AI responses; seeds Goal suggestions. |
| Conversation | A real customer interaction. | Source of Topics; reviewed in Analyze. |
| Procedure | Step-by-step instructions the AI follows. | Building Block shared by Automations; drafted from Scenarios. |
| Knowledge Source | Content the AI reads to answer questions. | Building Block shared by Automations. |
| Tool | An action the AI can take in other systems. | Building Block shared by Automations. |
| Guardrail | A rule limiting what the AI may do. | Building Block shared by Automations. |
| Scenario | A situation your team handles + what to do. | Turned into draft Procedures. |
| Test Category | A set of sample conversations the AI is scored on. | Used in Test; scored against Goals. |

### 2. Canonical naming recommendations
- Use **"AI Automation"** (not "automation," "agent," or "bot") on first mention per page.
- Use **"Building Blocks"** for the group; **Procedures / Knowledge Sources / Tools / Guardrails / Scenarios** for members. (Now consistent in nav + pages.)
- Use **"Guardrails"** as the page/nav label; reserve "shared" vs "per-automation" as a *qualifier in body copy*, not a different name.
- Pick ONE phrasing for audience: either **"Customer AI / Rep AI"** (chips) or **"AI for Customers / AI for Reps"** (nav). Currently both exist — see inconsistencies.

### 3. Terminology inconsistencies (status)
- ✅ "Shared library" (nav) vs "Building Blocks" (pages) → unified to **Building Blocks**.
- ✅ "Shared Guardrails" (page) vs "Guardrails" (nav) → unified to **Guardrails**.
- ✅ Topics "managed in Reporting" vs "Settings → Topics" → Reporting = **view**, Settings = **manage**.
- ❗ **"AI for Customers / AI for Reps" (nav) vs "Customer AI / Rep AI" (audience chip)** — same idea, two labels. Not yet reconciled (resolving it edges into renaming; needs sign-off).

### 4. Duplicate concepts to consolidate
- ❗ **Analyze (per-automation) · Scorecards · Performance (all automations) · Reporting** all answer "how's it doing?" Recommend an explicit scope line on each ("this automation" vs "all automations" vs "trends over time") rather than renaming.
- ⚠️ **Monitors vs Scorecards** — clarify that a Scorecard is the *output* of a Monitor, or pick one term in UI copy.

### 5. Top cognitive friction points
1. ❗ "Drift" with no inline definition.
2. ❗ Four overlapping performance surfaces with no scope cues.
3. ⚠️ "AHT," "Smart Routing," "Holdback group" — insider terms with only tooltip/helper support.
4. ⚠️ Reporting is a stub, so cross-page links to it don't pay off.

### 6. Highest-impact clarity improvements (done this pass)
- Plain, relationship-aware subtitles on Goals, Goal detail, Automations, Performance, and all Building Blocks.
- "Who is this AI for?" decision made explicit on Build; Deploy gated to one audience.
- Goal cards and goal-detail sections now name the Goal→Automation link.
- Onboarding primer drops "primitives" and teaches Conversations→Topics→Goals.

### 7. Areas that still assume technical knowledge
- "Drift," "Holdback group," "Smart Routing," "AHT," "Test Category" scoring math.

### 8. Cross-page consistency failures (status)
- ✅ Building Blocks naming · ✅ Guardrails naming · ✅ Topics view/manage location.
- ❗ Audience wording (nav vs chip) — open.

### 9. Missing glossary reinforcement opportunities
- Inline micro-definition for **Topic** at first use in the wizard.
- Inline gloss for **Drift** everywhere it appears.
- A **Building Blocks overview** page naming all five blocks and the automations they feed.
- Pre-teach **Goal→Automation** on the Step-2 draft-goal cards.

### 10. Recommendations for conceptual discoverability
1. Add a persistent "How it fits together" mini-diagram (Conversations→Topics→Goals→Automations→Building Blocks→Monitors) reachable from the help/primer button.
2. Give every "how's it doing" surface a one-line scope cue.
3. Gloss every technical term inline the first time it appears on a page (don't rely on tooltips alone).
4. Build the minimal Reporting → Topics view so asserted relationships are demonstrated, not just claimed.

---

*Audit reflects the prototype after the clarity/consistency pass. Items marked ❗ are open and recommended for the next round; ⚠️ are partially handled.*
