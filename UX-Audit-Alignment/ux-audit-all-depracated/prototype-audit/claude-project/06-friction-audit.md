# Section 06 — Friction Points and Resolutions

## Purpose
This is the UX-best-practices layer: every place the proposed IA creates ambiguity, duplication, or a broken convention, paired with the standing contract that resolves it. Unlike Section 05 (strategic cost, often unresolved), every row here should end in a documented fix — if it doesn't have one yet, that's itself a finding worth flagging as open.

## Method — a friction point is any of these patterns
Scan the IA tree (02) and journey (03) for:
1. **Divergent entry points** — the same authoring action reachable from multiple places (a "create X" that appears in 3+ locations). Does each entry point behave identically, or drift?
2. **Look-alike surfaces** — two destinations that visually or structurally resemble each other but answer different questions (e.g. two dashboards, two "settings" pages). Will a user know which one they're on?
3. **Same primitive, two scopes** — an object type (monitor, suggestion, report) that exists both at a platform/aggregate level and a per-item level, with no visible rule for which to act on.
4. **Asymmetric coverage inside a rollup** — a set of "peer" items presented as equivalent that actually don't all apply the same way (one is AI-only, one is human-only, etc.).
5. **Same label, two homes** — a term used for two different things living in two different places (e.g. "guardrails" meaning both per-item and shared rules).
6. **Overlapping filters/facets** — two ways to slice the same list that partially overlap ("Mine" vs. an audience filter).
7. **Split authoring vs. analytics** — management of an object lives in one place, reporting on it lives in another, under the same name.
8. **Silent relocation** — something moved from its old home in the current baseline and isn't cross-linked from where people will still look for it.
9. **Resolved-in-this-version tensions** — a friction that existed in a *previous* iteration of the prototype and has since been fixed; document it anyway, marked **Resolved**, so the decision history isn't lost.
10. **Under-promoted critical tools** — something operationally important nested too deep in the IA to be discoverable.

## Output format
A table: `Friction | What's happening | Contract (documented in IA)`. The middle column states the problem in plain terms with real destination names; the third column states the exact rule that resolves it (not "we'll improve clarity" — a checkable rule, e.g. "Dropdown is switch-only... footer links to Manage all").

## Quality bar
- Every "Contract" must be checkable against Section 02 or 03 — if the resolution isn't actually reflected in the tree or journey, mark it as a stated intention, not a shipped contract.
- Include at least one row marked **Resolved** if the prototype has any iteration history — it shows the audit tracks decisions over time, not just a single snapshot.
- Prefer real friction over invented friction: if you can't point to the two exact destinations in tension, it's not a row yet.
