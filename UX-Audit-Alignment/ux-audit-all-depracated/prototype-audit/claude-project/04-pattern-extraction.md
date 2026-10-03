# Section 04 — The Core Structural Pattern

## Purpose
Every strong IA has one interaction pattern that's doing the differentiating work — the thing that, if you cut it, the redesign collapses into "same features, rearranged." This section isolates that pattern and documents it as a reusable spec, not a one-off screen description. Skip this section only if the prototype genuinely has no such pattern — say so rather than forcing one.

## Method
1. Identify the pattern by asking: what closes a loop that used to be a dead end? What's the one mechanism that shows up in more than one place in the journey (Section 03) and always behaves the same way?
2. Break it into stages (commonly 3: Signal → Response → Resolution, but use whatever the actual mechanism dictates). Name each stage.
3. For each stage, list:
   - The triggers/conditions that start it (with real examples pulled from the prototype, not hypotheticals)
   - What's presented to the user, structurally (what information, in what order)
   - The exact affordance/CTA copy
4. Close with a reference list of every place in the product this pattern's *target* can point to (e.g., every type of object a suggestion can open). This proves the pattern is systemic, not decorative.

## Output format
Stage-by-stage blocks, each with a short "what this looks like" example lifted directly from the journey in Section 03 (reuse the same example — don't invent a second one). End with the target/destination reference list.

## Quality bar
- The pattern must appear at least twice in Section 03's journey, or it isn't validated as a real pattern yet — flag it as "proposed but not yet demonstrated in the flow" if it only appears once.
- Avoid describing this as a generic UX pattern name ("progressive disclosure," "inline editing") without also stating the product-specific mechanism. Generic naming without mechanism is filler.
- This section is the answer to "what's actually new here" — if what you've described could describe any dashboard-with-notifications product, dig deeper for the specific mechanism.
