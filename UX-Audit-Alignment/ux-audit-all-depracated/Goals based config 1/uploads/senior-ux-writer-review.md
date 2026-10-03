# Senior UX Writer Review

> **Rubric for senior/staff-level UX copy review.** When reviewing UX copy, evaluate it against the following senior-level criteria. Treat failures in **high-risk areas as blocking**.

---

## 1. Behavioral Accuracy (Mental Model Integrity)

**Requirement:** Copy must align precisely with system behavior, including edge cases.

**Check:**
- Does the copy accurately describe what the system actually does?
- Could a reasonable user form an incorrect mental model after reading it?

**Flag if:**
- Copy implies outcomes the system can't guarantee
- Automation scope is vague or overstated
- Timing or sequencing is unclear

---

## 2. Mental Model Consistency Across the Flow

**Requirement:** Terminology and verbs must be stable and predictable.

**Check:**
- Are the same concepts described using the same terms and verbs?
- Do labels, buttons, and confirmations reinforce a single mental model?

**Flag if:**
- Synonyms are used for the same action or object
- Verb tense or abstraction level shifts mid-flow
- Users must re-interpret meaning across screens

---

## 3. Risk & Consequence Clarity

**Requirement:** High-risk actions must be boringly clear and explicit.

**Check:**
- Are risks, impacts, and downstream effects clearly named before action?
- Does confirmation strength match the severity of the action?

**Flag if:**
- Destructive or irreversible actions are softened or under-explained
- Consequences are implied but not stated
- Tone is casual where caution is required

---

## 4. Error, Failure & Recovery Handling

**Requirement:** Every failure state must provide clarity, direction, and reassurance.

**Check:**
- Does the copy explain what went wrong and what to do next?
- Is responsibility clear (system vs user)?

**Flag if:**
- Errors are generic ("Something went wrong")
- Recovery paths are missing or unclear
- Copy shifts blame to the user without guidance

---

## 5. Cognitive Load & Progressive Disclosure

**Requirement:** Minimize cognitive effort without hiding critical information.

**Check:**
- Is only the necessary information shown at each moment?
- Are explanations introduced only when they become relevant?

**Flag if:**
- Copy over-explains early
- Long explanations block action
- Users must read too much to proceed

---

## 6. Actionability & Decision Support

**Requirement:** Every action should feel intentional and informed.

**Check:**
- Does the copy help users decide what to do?
- Are CTAs specific and outcome-oriented?

**Flag if:**
- CTAs are vague ("Submit," "Continue")
- Users can't predict what will happen next
- Copy describes but doesn't guide

---

## 7. Tone Appropriateness & Emotional Fit

**Requirement:** Tone must support trust and confidence, not personality.

**Check:**
- Does tone match the user's emotional state and context?
- Is the language calm, respectful, and professional?

**Flag if:**
- Humor appears in errors or risky moments
- Tone minimizes user concern
- Over-friendliness undermines seriousness

---

## 8. Constraint Awareness (What Copy Cannot Fix)

**Requirement:** Call out product or interaction issues that copy alone cannot resolve.

**Check:**
- Is the copy compensating for unclear product behavior or unsafe defaults?

**Flag if:**
- Excessive explanation is required for basic actions
- Copy is being used to justify confusing UX
- Warnings are replacing better safeguards

---

## 9. Trust Protection & Ethical Clarity

**Requirement:** Protect the user, even when it conflicts with business pressure.

**Check:**
- Is the copy honest, transparent, and non-manipulative?
- Does it respect user autonomy and informed consent?

**Flag if:**
- Language nudges users into risky actions
- Automation is framed as more capable than it is
- Important information is hidden or minimized

---

## 10. Failure Impact Assessment (Severity Lens)

**Requirement:** Higher risk → higher copy precision.

**Check:**
- If this copy is misunderstood, what's the worst realistic outcome?

**Flag if:**
- High-impact misunderstanding is possible
- Copy lacks guardrails in critical moments

---

## Scoring

Assess copy as one of:
- **Ship-ready** — Meets all high-risk criteria
- **Needs revision** — Fixable clarity or consistency issues
- **Blocking** — Risk, trust, or mental model failures

### Strict Mode
- Treat failures in sections **1, 3, 4, 9, or 10** as blocking
- Always provide rewrite-ready recommendations

---

## Output Format

For each piece of copy reviewed, return:

1. **Verdict** — Ship-ready / Needs revision / Blocking
2. **Findings** — section-by-section, only flagging issues (not every pass)
3. **Rewrite recommendations** — drop-in replacements for each problem identified
4. **Blocking summary** (if applicable) — concise list of must-fix items before ship
