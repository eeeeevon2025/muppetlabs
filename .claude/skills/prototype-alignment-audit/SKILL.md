---
name: prototype-alignment-audit
description: Generates the prototype alignment audit as one styled HTML report for the Muppet Personality Project. Use when the user asks to run the alignment audit, generate the alignment report, audit this prototype against the product context, or show the UX audit from UX-Audit-Alignment. This is not the ux-cartographer atlas.
---

# Prototype alignment audit

Write one new HTML report for the Muppet Personality Project. Match the existing Goals report. Do not invent a new visual system, and do not reuse that report's Kustomer findings.

## Read first

Method, in this order:

1. `UX-Audit-Alignment/ux-audit-all-depracated/prototype-audit/claude-project/00-orchestrator.md`
2. `01-principles-extraction.md`
3. `02-ia-tree-mapping.md`
4. `03-journey-mapping.md`
5. `04-pattern-extraction.md`
6. `05-risk-assessment.md`
7. `06-friction-audit.md`
8. `07-usability-test-generator.md`

Look, read but do not edit:

- `UX-Audit-Alignment/ux-audit-all-depracated/Goals based config 1/Goals-First IA Recommendation.html`
- `colors_and_type.css` and `ia-tree.js` in that same folder

Site facts:

- `UX-Audit-Alignment/inputs/site-map.md`
- `src/app` and `src/components/NavLinks.tsx`
- `ux-cartographer/inputs/product-context.md`

Ignore `UX-Audit-Alignment/shell/` and `UX-Audit-Alignment/reports/2026-10-03-muppet-alignment.html`.

## Output

Write `UX-Audit-Alignment/ux-audit-all-depracated/Goals based config 1/muppet-alignment.html`.

- Copy the `<style>` block from `Goals-First IA Recommendation.html`. Link `colors_and_type.css`.
- Keep section ids `summary`, `map`, `experience`, `loop`, `newprobs`, `redundancy`, `jtbd`.
- Put this site's tree in a `window.IA_TREE` script. Then load `ia-tree.js`. Do not load `ia-tree-data.js`.
- Use real labels from the Muppet site. Every destination must be on the site map.
- There is no separate PRD and no older production snapshot. Say so. Do not mark nodes new, moved, renamed, or removed.
- Do not edit the Goals report, the CSS, or `ia-tree.js`.

## Done

Open the new HTML file. Click three tree nodes, Expand all, and Collapse. A reader who has not seen the site can tell what was built, where the rail departs from the quiz-first product context, which entry points disagree, and which usability tasks to run next.
