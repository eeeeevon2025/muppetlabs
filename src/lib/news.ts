export interface NewsArticle {
  slug: string;
  title: string;
  publishedAt: string;
  author: string;
  excerpt: string;
  body: string[];
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: "why-chaos-order-theory-still-holds-up",
    title: "Why the Chaos/Order Theory Still Holds Up, 50-ish Years Later",
    publishedAt: "2026-06-02",
    author: "The Editorial Desk",
    excerpt:
      "A revisit of the classic framework for sorting people into 'agents of chaos' and 'agents of order' — and why we built three more axes on top of it.",
    body: [
      "You've probably encountered some version of this theory before, usually phrased as a party icebreaker: everyone is secretly either a Chaos Muppet or an Order Muppet. Chaos Muppets — your Animals, your Gonzos, your Swedish Chefs — operate on vibes, impulse, and volume. Order Muppets — your Kermits, your Scooters, your Sam Eagles — operate on schedules, standards, and a quiet, simmering resentment of the Chaos Muppets.",
      "It's a good theory because it's immediately legible. You already know which one you are. The trouble is that it flattens a lot of real personality into a single axis, which is why our resident quiz nerds spent an embarrassing number of weekends adding three more: warmth (how sincere vs. deadpan you are), ego (how much of the room you need), and energy (how loud your operating volume runs).",
      "Four axes, one Muppet at the far end of each combination. That's the whole theory. Take the quiz if you haven't; you already know someone who needs to see your result.",
    ],
  },
  {
    slug: "field-guide-to-backstage-personalities",
    title: "A Field Guide to Backstage Personalities",
    publishedAt: "2026-05-14",
    author: "Staff Writers",
    excerpt: "How to spot each archetype in the wild — the office, the group chat, the family group chat.",
    body: [
      "The Order Muppet arrives fifteen minutes early with a printed agenda. The Chaos Muppet arrives fifteen minutes late having already changed the agenda without telling anyone. Somewhere in between is everyone else, muddling along on a mix of the two.",
      "You can spot a low-ego archetype by how quickly they deflect a compliment, and a high-ego archetype by how quickly they don't. Warmth shows up in whether a joke lands as a hug or a jab. None of this is a personality test in the clinical sense — it's closer to a horoscope with better jokes and a stronger evidence base (four axes, at least).",
      "Read the full theory breakdown, then go argue with your group chat about who's the Rizzo.",
    ],
  },
  {
    slug: "meet-the-runner-ups",
    title: "Meet the Runner-Ups: Your Second-Place Muppet Matters Too",
    publishedAt: "2026-04-28",
    author: "The Editorial Desk",
    excerpt: "Everyone fixates on their top match. We think the runner-up tells you almost as much.",
    body: [
      "Every quiz result on this site comes with a runner-up — the archetype you almost were. We think that's the more interesting number, honestly. Your top match is who you are on a normal Tuesday. Your runner-up is who you become after two coffees, or none.",
      "We've heard from a lot of quiz-takers who related more to their runner-up than their actual result, and that's fine — the vectors are close for a reason. Chaos and order aren't opposites so much as a dial, and most of us live somewhere in the middle of it, occasionally lurching toward one end during a deadline.",
    ],
  },
];

export function getArticle(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((a) => a.slug === slug);
}
