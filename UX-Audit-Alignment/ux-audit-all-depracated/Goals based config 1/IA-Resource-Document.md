# Kustomer AI — Goals Based AI Setup
## Information Architecture Reference Document

> **Purpose of this document.** This is a complete, self-contained reference describing the Information Architecture, navigation tree, screen states, content layout, and flow of the **Goals Based AI Setup** prototype. It is structured so a language model can ingest it and reason about the IA without needing to read the source code. Use it as ground truth when rebuilding, extending, or comparing prototypes.

---

## 1. Top-level frame

The product is laid out as **three fixed columns plus an optional fourth right rail**:

```
┌────────────┬────────────────┬──────────────────────────────────┬──────────────┐
│ LeftRail   │ NavSection     │ Main column                      │ Right rail   │
│ 48px       │ 232px          │ flex                             │ (context)    │
│ dark       │ white          │ scrollable                       │ varies       │
│ #1F242D    │ border-right   │ optional 48px breadcrumb bar     │ 280-380px    │
│            │                │ optional sticky 48px save bar    │              │
└────────────┴────────────────┴──────────────────────────────────┴──────────────┘
```

- Page height = 100vh, no body scroll. Each region manages its own overflow.
- Body background = `#FFFFFF`. Primary text = `#1F242D`. Secondary = `#5F6675` / `#697182`.
- Font system: `var(--font-sans)` (UI), `var(--font-display)` (page headings), `var(--font-mono)` (technical readouts).

---

## 2. Color & typography tokens used by IA chrome

| Token | Value | Used for |
|---|---|---|
| Dark surface | `#1F242D` | Left rail, primary buttons-on-dark |
| Active rail item | `#2C3641` | Selected icon-button on left rail |
| Rail icon idle | `#A7B0C0` | LeftRail icons |
| Border | `#E8EAF0` | All nav/section dividers |
| Soft bg | `#FAFBFD` | Right-rail panel, table headers |
| Hover bg | `#F2F3F7` | Nav item hover |
| Active nav bg | `#DBE7FF` | Selected NavSection row |
| Active nav fg | `#0165E4` | Selected NavSection text |
| Brand blue | `#0165E4` | Primary buttons, links |
| Brand yellow | `#F4CC10` | Kusty mark, user avatar |
| AIC accent | `#0165E4` / `#EBF1FF` | "AI for Customers" badges |
| AIR accent | `#7B22A4` / `#F5EBFD` | "AI for Reps" badges |
| Success | `#16A36B` / `#E8F5EE` | Pass states |
| Warning | `#8A5A08` / `#FFF4E6` | Warning pills |
| Danger | `#A8202A` / `#FFEDED` | Fail / destructive |

---

## 3. Left Rail (global app rail)

**Width:** 48px. **Background:** `#1F242D`. **Padding:** 10px 0.

**Top-most:** Kustomer "Kusty" mark — a 30×30 rounded yellow tile (`#F4CC10`) containing the official Kusty face glyph. This is the brand anchor; always visible.

### Top icon group (8 items, single-select)

| id | icon | notes |
|---|---|---|
| `home` | home | |
| `ai` | sparkles | **default active** — enters Kustomer AI workspace |
| `inbox` | inbox | badge count: 1 |
| `lists` | barChart | |
| `pulse` | pulse | |
| `reports` | chartLine | |
| `apps` | grid | badge count: 2 |
| `settings` | cog | |

### Bottom icon group (3 items + avatar)

| id | icon |
|---|---|
| `search` | search |
| `bell` | bell |
| `help` | help |
| (avatar) | initials "AS" in yellow circle |

### Item visual states

- **Idle:** transparent background, icon color `#A7B0C0`.
- **Hover:** icon turns `#FFFFFF`.
- **Active:** background `#2C3641`, icon `#FFFFFF`.
- **Badge:** small 14×14 pill, `#3F8CFF` bg, white text, 2px dark border, positioned top-right.

---

## 4. NavSection (secondary nav)

**Width:** 232px. **Background:** white. **Right border:** `1px solid #E8EAF0`. **Padding:** `18px 16px 8px`.

**Header label** (top of column): `Kustomer AI` — 14px / 700 / `#1F242D`, 14px margin below.

### Structure (top to bottom)

```
┌─────────────────────────────────────────────┐
│ Kustomer AI                                 │  ← section header
│                                             │
│ ✨  Set Goals                    (top-level)│  id="setup"
│       💬  Build                  (indent 6) │  id="setup-build"
│       🧪  Test & Evaluate                   │  id="setup-test"
│       🚀  Deploy                            │  id="setup-deploy"
│       📊  Analyze                           │  id="setup-analyze"
│                                             │
│ 📈  Performance                  (top-level)│  id="performance"
│                                             │
│ AI FOR CUSTOMERS                            │  ← section label
│ ┌─────────────────────────────────────────┐ │
│ │ 🔵 Refund Order                       ▼ │ │  ← bordered card, expandable
│ └─────────────────────────────────────────┘ │
│       ⚙  Settings                           │  id="settings"
│ ⚡  Manage Automations                      │  id="automations"
│                                             │
│ AI FOR REPS                                 │  ← section label
│ ⚙  Settings                                 │  id="reps"
│                                             │
│ RESOURCES                                   │  ← section label
│ 📖  Knowledge Sources                       │  id="knowledge"
│ 🗄  MCP Servers                             │  id="mcp"
│ 🔧  Tools                                   │  id="tools"
└─────────────────────────────────────────────┘
```

### Item visual specs

- **Row:** padding `7px 10px`, gap 10, border-radius 6, 13px / 500.
- **Indent for sub-items:** `padding-left = 10 + indent (6px)`.
- **Idle top-level:** `#1F242D`.
- **Idle sub-item:** `#697182`.
- **Hover:** background `#F2F3F7`.
- **Active:** background `#DBE7FF`, foreground `#0165E4`, weight 600.

### Section labels

11px / 700 / `#5F6675`, letter-spacing 0.02em, 18px top margin, 6px bottom margin. Labels: `AI for Customers`, `AI for Reps`, `Resources`. The Set Goals + Performance group is **unlabelled** (it sits directly under the Kustomer AI header).

### Special: "Refund Order" expandable card (under AI for Customers)

Not a standard nav row — it's a bordered button:
- Border: `1px solid #E8EAF0`, white background, subtle shadow.
- Padding: `8px 10px`. Radius: 6.
- Leading badge: 18×18 blue circle (`#3F8CFF`) with white refund icon.
- Trailing chevron rotates with expanded state.
- When expanded, reveals an indented `Settings` row (sub-item style).

This represents a per-automation grouping. The IA pattern is: each AIC automation gets its own expandable card with child config items — not a flat list of automations.

---

## 5. Main column

### 5.1 Top breadcrumb bar (conditional)

Renders **only** when `activeNav === "build"` or `activeNav === "test"`.

- Height 48, border-bottom `1px solid #E8EAF0`, padding `0 20px`, white bg.
- Contents (left to right):
  - Ghost button "AI Automations" (`#5F6675`, 13/500).
  - Chevron separator (12px, `#B3BBCB`).
  - Automation crumb: 18×18 blue circle with chat-bubble icon + name "Refund Order" (13/700).
  - Status pill:
    - **build view:** neutral pill `#F2F3F7` bg, "● Deployed on 03/04/2026 4:03 PM" with green dot.
    - **test view:** warning pill `#FFF4E6` bg, `#FDE2B4` border, "Not deployed" with warning glyph.
  - Trailing "more" (⋯) button.

No breadcrumb on any other view.

### 5.2 Content area

Padding `28px 36px` (wizard: `40px 48px 80px`). Bottom padding adjusts when save bar is dirty (`paddingBottom: 80`). Max-width depends on view:

| View | Max-width |
|---|---|
| Setup form | 700 |
| GeneratedPanel / Test / Deploy / Analyze | 1100 |
| Reps (home) | 920 |
| Reps (observe) | 1200 |

### 5.3 Save bar (footer)

Absolute-positioned at bottom of main column. Always rendered when `view === "home"`. Right inset = sidebar width:

| activeNav | Right inset |
|---|---|
| `build` | 380 (or 48 if collapsed) |
| `test` | 280 (or 48 if collapsed) |
| any other | 0 |

Layout: `12px 28px` padding, right-aligned, gap 12, top border `#E8EAF0`.

- **Idle (clean):** ghost "Cancel" placeholder + disabled "Save Changes" pill (`#F2F3F7` bg).
- **Dirty:** real "Cancel" ghost button + blue "Save Changes" button (`#0165E4`), with `box-shadow: 0 -2px 8px rgba(31,42,46,0.04)` on the bar.

---

## 6. Routing table (activeNav → content)

| `activeNav` | Top bar | Content rendered | Right rail |
|---|---|---|---|
| `setup` | none | SetupPanel (form view) | SetupAssistant (360px) |
| `setup-build` | none | GeneratedPanel — Step 2 of 5 | SetupAssistant |
| `setup-test` | none | TestEvaluatePanel — Step 3 of 5 | SetupAssistant |
| `setup-deploy` | none | DeployPanel — Step 4 of 5 | SetupAssistant |
| `setup-analyze` | none | AnalyzePanel — Step 5 of 5 | SetupAssistant |
| `performance` | none | PerformancePanel | — |
| `reps` | none | "AI for Reps" + tabs (Copilot / Summaries) — branches to ObservePanel | — |
| `procedures` | none | ProceduresLibrary | — |
| `build` | breadcrumb (Deployed) | BuildPanel | TestConsole (380px, collapsible to 48) |
| `test` | breadcrumb (Not deployed) | TestPanel | right rail (280px, collapsible to 48) |
| `settings`, `automations`, `knowledge`, `mcp`, `tools` | none | EmptySection placeholder | — |

---

## 7. SetupPanel — the Goals-Based Setup form

The form for first-run intake. Rendered at `activeNav === "setup"`. Two-column layout: form (left, scrollable, max 700px) + SetupAssistant (right, 360px sticky).

### 7.1 Page header

- Pill: "✨ Goals-based setup" — `#F5EBFD` bg, `#EBD2FF` border, purple sparkle.
- H1 (display font, 20/500, line-height 1.3): "Tell us about your business. We'll set up your AI."
- Body (15/regular, line-height 1.55, color `#5F6675`): describes that the form generates AI Automations, Procedures, and Copilot config to review before going live.

### 7.2 Section pattern

Each section is rendered by `SetupSection({ number, title, sub, last, children })`:
- Top border `1px solid #E8EAF0`, padding `28px 0`.
- Numbered avatar: 26×26 dark circle (`#1F242D`), white bold number, auto-incremented.
- Title (17/700, `-0.005em` tracking).
- Subtitle (13/regular, `#697182`).
- Section content below.

### 7.3 Sections (in render order)

| # | Title | Subtitle | Component |
|---|---|---|---|
| 1 | About your company | Pulled from your account profile. Edit anything that's off. | `CompanyCard` (read-mode + edit-mode) |
| 2 | Who are you setting up Kustomer AI for? | Pick one or both. | `AudiencePicker` — 2-up cards: AI for Customers (blue), AI for Reps (purple) |
| 3 | What are your goals with Kustomer AI? | Select all that apply. | `GoalsGrid` — filtered by audience selection + "Add a custom goal" |
| 4 | Your top conversation topics (existing accts only) | From last 90 days of conversations. | `TopicGrid` with stats band (Topics selected / Coverage / Avg deflectable) |
| 5 | Performance monitors | Auto-generated targets, tweakable. | `MonitorsEditor` — list of `MonitorRow`s with metric/operator/value, add button (max 6) |
| 6 | Scenarios you want to automate | Upload examples. | `ScenarioUploader` — drag-drop + file list, types: PDF / DOC / IMG / AUDIO / VIDEO / TXT |
| 7 | Where does your AI learn from? | Point us at content. | Help-center URL input + dashed-border file upload card |
| 8 | How should your AI sound? | Tone of voice (last section). | Pill row: Friendly / Professional / Casual / Matter of Fact / Custom |

### 7.4 Footer CTA row

Right-aligned, 36px top margin, gap 10:
- Ghost button: "Skip & configure manually"
- Primary button: "✨ Generate my AI setup" — disabled until `company.name && (goals.length || topics.length)`.

### 7.5 Goal catalog (`GOAL_OPTIONS`)

| id | title | description | audience |
|---|---|---|---|
| `deflect` | Deflect common questions | Answer FAQs directly so reps focus on harder cases. | aic |
| `speed` | Speed up rep responses | Draft replies and summarize threads in Copilot. | air |
| `escalate` | Reduce unnecessary escalations | Verify identity, classify intent, route only when needed. | aic |
| `tracking` | Status & order tracking | Look up orders, shipments, returns end-to-end. | aic + air |

### 7.6 Topic catalog (`TOPIC_OPTIONS`, used for existing-account flow)

| id | label | volume | avg handle | deflectable | suggested automations | procedures |
|---|---|---|---|---|---|---|
| tracking | Order tracking | 24% | 3.2 min | 78% | Order Tracking | Tracking Lookup |
| returns | Returns & refunds | 18% | 5.8 min | 62% | Refund Order, Returns | Main Refund Procedure, Convincing Customer |
| product | Product questions | 12% | 2.4 min | 85% | Product FAQ | Answer FAQ from KB |
| account | Account & login | 9% | 4.1 min | 45% | Account Help | Verify Customer Identity |
| shipping | Shipping delays | 8% | 3.7 min | 70% | Shipping Updates | Tracking Lookup |

### 7.7 Industries (`INDUSTRY_OPTIONS`)

Retail & E-commerce · SaaS · Travel & Hospitality · Financial Services · Telecommunications · Healthcare · Logistics & Shipping · Other

### 7.8 Channels (`CHANNEL_OPTIONS` — defined but not currently rendered as a section)

Email · Chat · SMS · Voice · Instagram · WhatsApp

### 7.9 Escalation (built into `computePlan`, surfaced via SetupAssistant preview)

**Triggers** (`TRIGGER_OPTIONS`):
- `cant_answer` — When AI can't answer after trying
- `asks_human` — When the customer asks for a human
- `frustrated` — When the customer seems frustrated or repeats themselves
- `timeout` — After a set amount of time with no resolution

**Destinations:** Specific team / Queue / Leave unassigned in inbox.

**Teams:** Tier 1 Support, Tier 2 Support, Billing, Returns & Refunds, VIP / High-value, Trust & Safety.

**Queues:** General Inbox, Priority Queue, Billing Queue, VIP Queue, After-hours Queue.

**Message types:** Default ("Let me connect you with a team member who can help.") or Custom (free-text).

### 7.10 Performance monitor catalog

Auto-derivation is keyed on `goals × topics × audience`. Catalog presets:

| id | label | metric | op | value | unit | scope |
|---|---|---|---|---|---|---|
| auto_deflect_returns | AI Deflections on Returns & Refunds | Deflection rate | ≥ | 80 | % | ai |
| auto_deflect_product | AI Deflections on Product Questions | Deflection rate | ≥ | 85 | % | ai |
| auto_deflect_account | AI Deflections on Account & Login | Deflection rate | ≥ | 60 | % | ai |
| auto_tracking_resolution | Order Tracking Resolution rate | Deflection rate | ≥ | 90 | % | ai |
| auto_escalation_rate | Unnecessary escalation rate | Escalation rate | < | 15 | % | ai |
| auto_csat_ai | AI CSAT | CSAT | ≥ | 4.5 | /5 | ai |
| auto_rep_frt | Human Rep FRT | First response | < | 2 | min | reps |
| auto_rep_aht | Rep AHT | Average handle time | < | 4 | min | reps |
| auto_copilot_accept | Copilot suggestion accept rate | Copilot acceptance | ≥ | 60 | % | reps |

**MAX_AUTO_MONITORS = 4**, manual add limit = 6. Selection is round-robin by primary goal so every selected goal gets at least one monitor before any single goal claims a second slot.

**Operator labels:** lt → "is less than", lte → "is at most", gte → "is at least", gt → "is more than", eq → "equals".

**Manual-add presets:** Average handle time / Deflection rate / CSAT / First response time / Escalations per 100 convos / AI resolution rate / Reopen rate / Backlog.

---

## 8. SetupAssistant (right rail, 360px)

Persistent across all 5 wizard views. Soft `#FAFBFD` bg. Left border `1px solid #E8EAF0`. Scrollable.

### 8.1 Sticky header

- Title: "✨ What we'll generate" (13/700).
- Sub-copy varies by state:
  - Generated: "Build ready. Review and tweak each item below."
  - Existing account: "Based on your conversation history and answers."
  - Otherwise: "Updates as you fill in the form."
- Progress bar — 4px height, gradient `#3F8CFF → #6E79E0 → #B31DF0`, width = `progress%`.

### 8.2 Preview cards (in order)

Each `PreviewCard` is a 30×30 colored icon tile + title + subtitle + optional bulleted item list (with green checkmark).

1. **N AI Procedures** — tone=aic — items from `planned.automations` — empty: "Pick goals like Status & order tracking or Deflect to unlock procedures."
2. **Knowledge Sources** — tone=neutral — subtitle = the URL.
3. **Copilot for Reps** — tone=air — items = copilot features (Proactive Suggestions, Draft replies, Summaries, Signals).
4. **Translations** — tone=air — on/off.
5. **Escalation** (rules) — tone=aic — items = trigger list, routing, handoff message.
6. **Scenarios** — tone=neutral — items = each uploaded scenario name.
7. **Performance monitors** — tone=aic — items = `${label} ${op} ${value}${unit}`.
8. **Tone of voice** — tone=neutral — subtitle = picked tone name.

### 8.3 `computePlan` rules

- Topics with `suggested` automations and `procedures` flow directly into the plan.
- `deflect` adds: FAQ Deflection automation + Greeting & Triage, Answer FAQ from KB procedures.
- `tracking` adds: Order Tracking, Returns automations + Tracking Lookup, Main Return Procedure.
- `escalate` adds: Verify Customer Identity, Escalate to Specialist procedures.
- `speed` adds: Proactive Suggestions, Draft replies (copilot items).
- `summarize` adds: Conversation summaries, Customer signals (copilot items).
- Uploaded scenarios become: `Draft: <name>` procedures.

---

## 9. Wizard sub-views

### 9.1 GeneratedPanel — Step 2 of 5 (Build)

Rendered for `activeNav === "setup-build"`. Padding `40px 48px 80px`. Max-width 1100. White bg.

- "Step 2 of 5" pill — `#EBF1FF` bg, `#CBDCFF` border, `#0E3280` text.
- `BuildProceduresTable` — 5 auto-drafted procedures, each row expandable to reveal:
  - description, whenToUse, stepsHtml (rich editor)
  - per-row remove
  - add button at table foot
- Footer actions: ghost "← Edit my answers" (returns to setup form) · ghost "Discard" · primary "Save & continue →" (advances to setup-test).

**Procedure catalog (top-5, scored by goal × topic):**

| id | title | goal | topics |
|---|---|---|---|
| p_track | Order Tracking Lookup | tracking | tracking, shipping |
| p_return | Process Return or Refund | deflect | returns |
| p_faq | Answer Product FAQ from KB | deflect | product |
| p_account | Verify Identity & Account Help | escalate | account |
| p_handoff | Smart Escalation Handoff | escalate | returns, account, shipping |
| p_assist | Rep Draft Assist | speed | tracking, returns, product, account, shipping |

### 9.2 TestEvaluatePanel — Step 3 of 5 (Test)

- "Step 3 of 5" pill.
- H1: "Test Categories" (display font, 22/500).
- Body: "Run your AI against sample conversations grouped by scenario type."
- Primary CTA: "▶ Run All Tests" (turns to "Running…" then "Re-run All Tests").
- Status line: `N passed · N warnings · N failed · running X/Y`.
- Table columns: **Category name** · **Used by** (audience pills) · **Topics Covered** (topic chips) · **Status** · **Last run** · **Score**.
- Verdict pills: Pass (green) / Warning (amber) / Fail (red).
- Footer: "← Back to Build" + "Continue to Deploy →" (gated on 100% completion, turns green when active).

**Test category bank (top-6, scored by goal × topic):**

| id | name | cases | goal | topics |
|---|---|---|---|---|
| refund_standard | Standard Refund Requests | 5 | deflect | returns |
| damaged | Damaged or Defective Items | 4 | deflect | returns, product |
| delivery_refund | Late Delivery Refunds | 3 | tracking | tracking, shipping, returns |
| tracking | Order Tracking & Status | 6 | tracking | tracking, shipping |
| product_faq | Product Questions | 5 | deflect | product |
| account_verify | Identity & Account Access | 4 | escalate | account |
| escalation | Smart Escalation Handoff | 3 | escalate | returns, account, shipping |
| rep_assist | Rep Draft Assist | 4 | speed | tracking, returns, product, account, shipping |

### 9.3 DeployPanel — Step 4 of 5

- "Step 4 of 5" pill.
- H1 (display, 22/500).
- Form: routing rules + deploy notes textarea.
- Footer: back to test · primary deploy button.

### 9.4 AnalyzePanel — Step 5 of 5

- "Step 5 of 5" pill.
- Live metrics / monitors dashboard.
- Back to deploy.

---

## 10. AI for Reps page (`activeNav === "reps"`)

Two-tab view inside the main column.

### 10.1 Header

- Section title: "AI for Reps" with `helpIcon` (?) trailing.
- Description: "Configure AI for Reps to support your teams behind the scenes, or manage Summaries and Signals to provide context on customer history."

### 10.2 Tabs

| id | label | renders |
|---|---|---|
| `copilot` | Copilot | `CopilotPanel` |
| `summaries` | Summaries and Signals | `SummariesPanel` |

### 10.3 Copilot state (default ON)

State keys controlled by this page:

- `copilotOn` — master toggle (default true)
- `translations` — toggle (default true)
- `translationExclusions` — array (`["Kustomer", "Kusty", "AS-1024"]`)
- `typeahead` — toggle (default true)
- `suggestionsOn` — toggle (default true)
- `suggestionsMode` — `"quality"` or `"speed"`
- `summariesOn` — toggle (default true)
- `sigSentiment`, `sigUrgency`, `sigIntent`, `sigChurn` — signal toggles

### 10.4 Observe sub-view

CopilotPanel exposes an "Observe" CTA that flips `view` from `"home"` to `"observe"`, swapping content to `ObservePanel`. Max-width grows to 1200. Save bar is hidden in observe mode. Back action returns to home.

---

## 11. Build / Test detail views (linked from AI for Customers section)

These appear when a specific automation is opened.

### 11.1 `activeNav === "build"`

- Top breadcrumb bar with **Deployed** pill.
- Left content: `BuildPanel` (procedures, agents, conditions).
- Right rail: `TestConsole` — 380px, collapsible to 48px.

### 11.2 `activeNav === "test"`

- Top breadcrumb bar with **Not deployed** pill.
- Left content: `TestPanel`.
- Right rail: 280px, collapsible to 48px.

---

## 12. EmptySection (placeholder)

Rendered for `activeNav` ∈ {`knowledge`, `mcp`, `tools`, `automations`, `performance` (when component missing), `settings`}.

Just a section title + description: "Placeholder — click Reps in the sidebar to return to the AI for Reps page."

---

## 13. Full text-based flowmap

```
APPLICATION ROOT
│
├── LEFT RAIL (global Kustomer rail, dark)
│   • Kusty logo
│   • home · ai★ · inbox(1) · lists · pulse · reports · apps(2) · settings
│   • search · bell · help · user avatar
│
└── AI WORKSPACE (active when LeftRail = "ai")
    │
    ├── NAV SECTION "Kustomer AI"
    │   │
    │   ├── ✨ Set Goals  ──────────────────────┐
    │   │     ├─ 💬 Build                       │   GOALS-BASED SETUP WIZARD (5 steps)
    │   │     ├─ 🧪 Test & Evaluate             │
    │   │     ├─ 🚀 Deploy                      │
    │   │     └─ 📊 Analyze                     │
    │   │                                       │
    │   ├── 📈 Performance                      │   (top-level, sibling of Set Goals)
    │   │                                       │
    │   ├── ▼ AI FOR CUSTOMERS                  │
    │   │     ├─ 🔵 Refund Order (expand card)  │
    │   │     │     └─ ⚙ Settings               │
    │   │     └─ ⚡ Manage Automations          │
    │   │                                       │
    │   ├── ▼ AI FOR REPS                       │
    │   │     └─ ⚙ Settings  ───── AI for Reps page (tabs: Copilot / Summaries+Signals)
    │   │                                                │
    │   │                                                └─ (Copilot → "Observe" → ObservePanel)
    │   │
    │   └── ▼ RESOURCES
    │         ├─ 📖 Knowledge Sources
    │         ├─ 🗄 MCP Servers
    │         └─ 🔧 Tools
    │
    └── MAIN COLUMN  (+ optional right rail)
        │
        ╔═══ WIZARD VIEWS (always have SetupAssistant right rail) ═══╗
        ║                                                            ║
        ║   STEP 1 — SetupPanel (form)   activeNav = "setup"         ║
        ║       │                                                    ║
        ║       │  Sections (auto-numbered):                         ║
        ║       │   1. About your company                            ║
        ║       │   2. Audience picker (AIC / AIR)                   ║
        ║       │   3. Goals (filtered by audience + custom)         ║
        ║       │   4. Top conversation topics (existing accts only) ║
        ║       │   5. Performance monitors (auto-derived)           ║
        ║       │   6. Scenarios (upload)                            ║
        ║       │   7. Knowledge (URL + files)                       ║
        ║       │   8. Tone of voice                                 ║
        ║       │                                                    ║
        ║       │  CTA: ✨ "Generate my AI setup"                    ║
        ║       ▼                                                    ║
        ║   STEP 2 — GeneratedPanel       activeNav = "setup-build"  ║
        ║       │  Pill: "Step 2 of 5"                               ║
        ║       │  BuildProceduresTable (top-5 procedures)           ║
        ║       │  Back: "Edit my answers"                           ║
        ║       │  Forward: "Save & continue"                        ║
        ║       ▼                                                    ║
        ║   STEP 3 — TestEvaluatePanel    activeNav = "setup-test"   ║
        ║       │  Pill: "Step 3 of 5"                               ║
        ║       │  Test Categories table + Run All Tests             ║
        ║       │  Forward gated on 100% completion                  ║
        ║       │  Back: "Back to Build"                             ║
        ║       │  Forward: "Continue to Deploy"                     ║
        ║       ▼                                                    ║
        ║   STEP 4 — DeployPanel          activeNav = "setup-deploy" ║
        ║       │  Pill: "Step 4 of 5"                               ║
        ║       │  Routing rules + deploy notes                      ║
        ║       │  Back · Deploy                                     ║
        ║       ▼                                                    ║
        ║   STEP 5 — AnalyzePanel         activeNav = "setup-analyze"║
        ║          Pill: "Step 5 of 5"                               ║
        ║          Live metrics / monitors                           ║
        ║          Back                                              ║
        ╚════════════════════════════════════════════════════════════╝
        │
        ├── PERFORMANCE          activeNav = "performance"     (own dashboard)
        │
        ├── AI for Reps          activeNav = "reps"            (tabs)
        │     ├─ Copilot         → CopilotPanel
        │     │     └─ "Observe" → ObservePanel (view = "observe", maxW 1200)
        │     └─ Summaries+Signals → SummariesPanel
        │
        ├── BUILD (per automation)   activeNav = "build"
        │     ├─ Top bar: breadcrumb + Deployed pill
        │     ├─ Left: BuildPanel
        │     └─ Right: TestConsole (380px, collapsible 48px)
        │
        ├── TEST (per automation)    activeNav = "test"
        │     ├─ Top bar: breadcrumb + Not deployed pill
        │     ├─ Left: TestPanel
        │     └─ Right: side rail (280px, collapsible 48px)
        │
        └── PLACEHOLDERS         {knowledge, mcp, tools, automations, settings}
              → EmptySection
```

---

## 14. State model (top-level App component)

```js
{
  activeRail: "ai",                  // LeftRail selection
  activeNav: "setup",                // NavSection selection
  refundExpanded: true,              // "Refund Order" card open/closed
  tab: "copilot",                    // AI-for-Reps tab
  view: "home",                      // "home" | "observe"
  state: {                           // Reps config state
    copilotOn: true,
    translations: true,
    translationExclusions: ["Kustomer","Kusty","AS-1024"],
    typeahead: true,
    suggestionsOn: true,
    suggestionsMode: "quality",
    summariesOn: true,
    sigSentiment: true,
    sigUrgency: true,
    sigIntent: false,
    sigChurn: false,
  },
  dirty: false,                      // controls save-bar enabled state
  rightCollapsed: false,             // collapses build/test right rail
}
```

SetupPanel owns its own state: `selectedOutcome`, `accountType` (`"existing"` | `"new"`), `company`, `topics`, `goals`, `audience`, `customGoals`, `knowledge`, `tone`, `escalation`, `scenarios`, `monitors`.

---

## 15. IA rules to preserve when re-implementing

1. **The wizard's sub-steps live in the secondary nav tree, not in a separate stepper.** Set Goals always expands to its 4 children when the user is in any step. The active child mirrors the current step.
2. **The same SetupPanel component is mounted across all 5 wizard views**, branching internally on `activeNav` to render form / Generated / Test / Deploy / Analyze. SetupAssistant is rendered alongside it consistently.
3. **Step pill** ("Step N of 5", `#EBF1FF` / `#CBDCFF` / `#0E3280`) appears in the top-left of steps 2-5; **never** on the form view.
4. **Breadcrumb top bar (48px)** only renders for `build` and `test` automation-detail views; everywhere else the main column has no top chrome.
5. **Save bar (sticky footer)** only renders when `view === "home"`; right inset shrinks for views with side rails. Idle vs. dirty are distinct visuals.
6. **AI for Customers is keyed by automation, not feature.** Each automation is its own expandable card (e.g. "Refund Order"), with child config items. New automations should follow the same card pattern.
7. **Audience tagging is universal.** Every goal, monitor, procedure, and test category renders an audience pill (AIC blue / AIR purple). Items that apply to both render both pills.
8. **Auto-derivation cascades:** Audience → filters goals · Goals × Topics × Audience → derives monitors · Goals × Topics → orders procedures and test categories. The relationships are one-way (forward).
9. **Color tones for content cards** are consistent: AIC = blue family, AIR = purple family, neutral = grey. Used in preview cards, audience pills, and accent fills.
10. **Visual hierarchy of nav weight:** active row (`#DBE7FF` + `#0165E4` 600) > hover row (`#F2F3F7`) > idle top-level (`#1F242D`) > idle sub-item (`#697182`).

---

## 16. Glossary

| Term | Meaning |
|---|---|
| AIC | "AI for Customers" — autonomous AI handling inbound customer conversations end-to-end. Color: blue. |
| AIR | "AI for Reps" — Copilot helping reps reply faster with drafts, summaries, signals. Color: purple. |
| Procedure | A step-by-step playbook the AI follows. Has name, description, whenToUse, stepsHtml. |
| Automation | A higher-level "skill" the AI exposes (e.g. "Refund Order"). One automation contains many procedures. |
| Monitor | A KPI target with metric / operator / value / unit / scope. |
| Scenario | A user-uploaded artifact (PDF, screenshot, recording) that seeds a draft Procedure. |
| Topic | A cluster of past conversations the system has classified (e.g. "Order tracking"). |
| Goal | A business outcome selected by the user; drives which automations / procedures / monitors are scaffolded. |
| Audience | Whom the AI is being configured for: AIC, AIR, or both. |
| Build / Test / Deploy / Analyze | The four post-setup wizard steps. |

— end of document —
