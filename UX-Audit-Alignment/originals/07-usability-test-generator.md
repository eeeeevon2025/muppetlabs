# Section 07 — Jobs to Be Done / Usability Test Plan

## Purpose
Convert the audit into a runnable test plan. This is the section that proves the report isn't just documentation — it's falsifiable. Every principle, pattern, and contract claimed earlier in the report should have at least one test scenario here that would expose it as false if it doesn't hold up with real users.

## Method
1. Identify the pillars — the 2-4 major capability areas the prototype spans (usually mirrors the biggest nodes in Section 02's tree, or the major stages in Section 03's journey). Name each pillar and, in one line, what it covers.
2. For each pillar, map to source research where it exists — cite prior research docs by name/author/date if the org has them (JTBD interviews, prior studies). If no prior research exists, say so and mark the tasks as "hypothesis-driven, not yet field-validated."
3. Write 4-6 tasks per pillar. Each task:
   - **Scenario** — written as a moderator would say it to a participant, in plain language, with a concrete situation (not "test the goal creation flow" but "You've been asked to reduce refund-related escalations. Set up a goal to track this.")
   - **Success** — an observable signal a moderator could actually watch for, phrased behaviorally ("lands on X, chooses Y, without backtracking") — not an opinion ("finds it intuitive").
   - **Tests** — which specific capability/pattern/principle from earlier sections this task is designed to break or confirm. This is the traceability link back to Sections 01-04.
4. Order tasks roughly by journey position (setup/authoring tasks before analysis/iteration tasks) within each pillar.

## Output format
Grouped by pillar. Each pillar: name, one-line scope, source mapping, then numbered tasks with Scenario / Success / Tests sub-fields.

## Quality bar
- Every "Tests" line must reference something specific from Sections 01, 04, or 06 (a named principle, the core pattern, or a specific friction contract) — a task that tests nothing already claimed in the report is out of scope for this audit.
- Success criteria must be observable in a session, not self-reported ("participant rates it 4/5" is not acceptable; "participant completes X without asking a follow-up question" is).
- Minimum 3 tasks per pillar; a pillar with fewer than 3 hasn't been decomposed enough to be testable.
- Close the whole report with the footer: `Prepared for [stakeholder] · source vision: [doc, author, date] · baseline: [current state description]`.
