# Allowed destinations — Muppet Personality Project

Use these routes and labels only. If a journey step, risk, or friction row needs a screen that is not on this list, that is a gap. Do not add the screen.

Confirmed from `src/app` and `src/components/NavLinks.tsx` on 2026-10-03.

| Label in the report | Route | Where the label is visible |
| --- | --- | --- |
| Home | `/` | Hero: "Which Muppet are you, actually?" Buttons: "Take the quiz", "Read the theory first", "Start the quiz" |
| Quiz | `/quiz` | Nav "Quiz". Title "The Muppet Personality Quiz", or "Take the quiz to compare" when `?compare=` is set |
| Result | `/results/[id]` | "You are…", then the matched name. Buttons: "Copy share link", "Read the full profile", "Take it again", "Compare with a friend", "Build your Muppet show" |
| Compare | `/compare` | Nav "Compare". Title "Compare with a friend". Button "Take the quiz first" |
| Compare invite | `/compare/[token]` | Titles: "Waiting for friend", "Compare results", "Compare invite", or "This compare link timed out" |
| Show | `/show` | Nav "Show". Title "Build your Muppet show". Buttons "Start building", "Take the quiz first" |
| Show builder | `/show/build` | Title "Build Your Show". Steps: Show details, Director, Main cast, Conflict, Finale |
| Episode card | `/show/[id]` | Title is the episode title plus the show title. Buttons "Build another show", "Compare with a friend" |
| Muppet directory | `/muppets` | Nav "Muppets". Title "Muppet Directory" |
| Profile | `/muppets/[slug]` | Title is the cast member's name. Fourteen profiles exist in `src/lib/muppets.ts` |
| Theory | `/theory` | Nav "Theory". Title "The Theory" |
| News | `/news` | Nav "News" |
| Article | `/news/[slug]` | Title is that article's title |
| Leaderboard | `/leaderboard` | Nav "Leaderboard" |
| Trivia | `/trivia` | Nav "Trivia". Title "Trivia Night" |
| Store | `/store` | Nav "Store" |
| Cart | `/store/cart` | Title "Your Cart" |
| Checkout | `/store/checkout` | Title "Checkout" |
| Order confirmed | `/store/order/[id]` | Title "Order Confirmed" |
| Contact | `/contact` | Nav "Contact" |
| About | `/about` | Nav "About". Title "About & Credits" |

Vision document: `ux-cartographer/inputs/product-context.md`, updated 2026-07-18. It has no named author and it says "PRD on file: No."

Baseline: there is no earlier production snapshot in this repo. The built routes above are the current site. Do not mark a node new, moved, renamed, or removed unless a diff against a real baseline is in the repo.
