# Codified Principles — Prototype Audit Toolkit

This is the actual audit system behind the Hybrid IA Recommendation case study: a knowledge base that checks a prototype against a set of agreed-upon, load-bearing principles, then produces a structured report covering what's been built, where it diverges from the plan, what UX conventions it breaks, and a usability test plan to validate it.

It's built to run in two environments. Pick whichever matches how you prototype.

## Option A — Claude Projects
1. Create a new Project in Claude.
2. Upload every file in `/claude-project` as Project knowledge.
3. Start a chat in the project and share your prototype (screens, a written flow description, exported code, or a link) along with your source vision/PRD doc and a description of what currently exists in production.
4. Ask it to run the audit. It will ask for anything it's missing, then produce the seven-section report.

Good for: prototypes you want to hand off as a doc/report, or when you want an interactive HTML artifact (the IA tree explorer) as the output.

## Option B — Cursor
1. Copy every file in `/cursor-rules` into your project's `.cursor/rules/` folder (create it if it doesn't exist).
2. These are scoped as agent-requested rules (`alwaysApply: false`), so they won't clutter every prompt — Cursor pulls in the relevant one(s) when you ask for something that matches their description.
3. In a chat with your prototype's code open, ask Cursor to audit the prototype against your codified principles, or ask for a specific section (e.g. "run a friction-point audit on this flow").

Good for: auditing a prototype you're actively building in code, or running one section of the audit (e.g. just the risk assessment) without generating the full report.

## What's in here
| File | What it does |
|---|---|
| `00-orchestrator` | The master workflow — required inputs, fixed section order, cross-checking rules |
| `01-principles-extraction` | How to pull load-bearing rules out of a design and state them as checkable principles |
| `02-ia-tree-mapping` | How to inventory the IA/nav structure, including what's new/moved/removed vs. baseline |
| `03-journey-mapping` | How to document one concrete end-to-end flow that proves nothing was invented mid-journey |
| `04-pattern-extraction` | How to isolate the one structural pattern doing the differentiating work |
| `05-risk-assessment` | How to score strategic/organizational risk with an honest severity rubric |
| `06-friction-audit` | A 10-pattern checklist for finding broken UX conventions, plus how to document the fix |
| `07-usability-test-generator` | How to turn the audit into a runnable, JTBD-based test plan |
| `output-style-guide` | The visual/design-token spec for the final report |
| `report-architecture` | The actual HTML/CSS/JS structure — including the data schema for the interactive IA tree |

## Adapting this to your own project
This toolkit is written to be portable — it doesn't assume Kustomer-specific vocabulary. To use it on your own product:
- Swap in your own source vision/PRD doc and current-state baseline as the audit inputs.
- If you already have a set of codified principles for your own project, drop them straight into a chat before running the audit — the system will check the prototype against *your* principles, not invent new ones.
- The friction-point checklist (`06-friction-audit`) and risk severity rubric (`05-risk-assessment`) are the two files most worth reading closely before your first run — they're the rubrics that make the audit's judgment calls (severity, what counts as friction) consistent across different people using this.

---
Built by Yvonne Dollux · yvonnedollux.com
