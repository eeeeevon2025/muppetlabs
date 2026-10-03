# Section 05 — Risks

## Purpose
This is the strategic-cost / PRD-divergence layer. Where does this proposal cost something — organizationally, cognitively, or in migration effort — even if it's directionally correct? A prototype with zero listed risks has not been audited honestly.

## Method
1. Re-read Sections 01-04 specifically hunting for tension: every principle in Section 01 that resolves a conflict implies a cost paid by the losing side. Every new primitive or promoted destination in Section 02 costs something else its rail position, its discoverability, or its ownership clarity. Mine these systematically rather than brainstorming risks from scratch.
2. For each candidate risk, write:
   - **Risk** — short name, screen-reader-friendly (e.g. "Rail real estate," not "the navigation may become cluttered which could hypothetically confuse users").
   - **Severity** — High / Medium / Low, using the rubric below.
   - **Why it hurts** — concrete blast radius: who is affected, what breaks, and (where possible) a mitigation already designed into the prototype, or a note that none exists yet.
3. Order by severity, highest first.

## Severity rubric
- **High** — affects most or all personas, touches primary navigation or a primitive referenced across many surfaces, or has no mitigation yet designed.
- **Medium** — affects a specific persona or workflow segment; a mitigation exists but depends on discipline (naming conventions, required fields, audit jobs) rather than structural prevention.
- **Low** — affects edge cases, one-time transitions (e.g. migration, renaming), or is fully mitigated by an explicit, already-designed contract.

Severity reflects blast radius across personas — not how annoying the individual instance is. A high-frequency minor annoyance is still Low if it only touches one persona in a narrow flow.

## Output format
A table: `# | Risk | Severity | Why it hurts`.

## Quality bar
- Every High severity risk must name which sections/personas are affected specifically — "confusing to users" is not acceptable; "Rail runs eight items deep before utility; four items pushed to overflow" is.
- Don't let every risk resolve to "needs more mitigation" — where the prototype already designed a fix, say so; that's a legitimate Low/Medium downgrade and shows you checked.
- Minimum 6 risks for a platform-level IA change; fewer suggests the mining pass in step 1 wasn't thorough.
