# The Muppet Personality Project

An unofficial, non-commercial fan-site demo: a personality quiz that scores
you on four traits (chaos↔order, sincerity↔detachment, humility↔ego,
calm↔frenetic) and matches you to one of fourteen archetypes. Built as a
realistically-sized Next.js app — forms, a store with checkout, trivia,
and more — for use as a demo target.

Not affiliated with, endorsed by, or associated with The Muppets Studio,
Disney, or any rights holders of the referenced characters. See `/about`
in the running app for the full disclaimer.

## Stack

- Next.js 16 (App Router, Server Actions, Route Handlers)
- React 19, TypeScript, Tailwind CSS 4
- Bricolage Grotesque (variable font), zod for validation
- A tiny JSON-file "database" in `data/` (see `src/lib/db.ts`) — good enough
  for a single-process demo, not for real concurrent traffic

## Getting started

```bash
npm install
npm run seed   # populates data/ with demo quiz results, comments, etc.
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Re-run `npm run seed -- --force` to wipe and reseed `data/`.

## Pages

Home, `/quiz` (+ `/results/[id]`), `/muppets` (+ `/muppets/[slug]`),
`/theory`, `/news` (+ `/news/[slug]`), `/leaderboard`, `/trivia`,
`/store` (+ `/store/cart`, `/store/checkout`, `/store/order/[id]`),
`/contact`, `/about`. Route Handlers live under `/api/*`.

## Other commands

```bash
npm run build   # production build + typecheck
npm run lint    # eslint
```
