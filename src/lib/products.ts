export interface Product {
  slug: string;
  name: string;
  priceCents: number;
  color: string;
  description: string;
  tag: string;
}

export const PRODUCTS: Product[] = [
  {
    slug: "chaos-agent-pin",
    name: "Chaos Agent Enamel Pin",
    priceCents: 1200,
    color: "#FF2264",
    description: "For those who consider 'the plan' a rough first draft. Glow-in-the-dark cannon fuse detail.",
    tag: "Chaos",
  },
  {
    slug: "order-desk-organizer",
    name: "Order Muppet Desk Organizer",
    priceCents: 2800,
    color: "#4ADE80",
    description: "Seventeen labeled compartments. You will use twelve of them. That's still more than anyone else.",
    tag: "Order",
  },
  {
    slug: "wocka-wocka-joke-book",
    name: "\"Wocka Wocka\" Joke Book, Vol. 3",
    priceCents: 1500,
    color: "#FF2264",
    description: "200 jokes. An estimated 40 of them land. Includes a certificate of resilience.",
    tag: "Heart",
  },
  {
    slug: "balcony-heckler-hoodie",
    name: "Balcony Heckler Hoodie",
    priceCents: 4600,
    color: "#FF2264",
    description: "Oversized hood for maximum disapproving-silhouette effect. Comes with two (2) opinions, free of charge.",
    tag: "Detached",
  },
  {
    slug: "diva-tote-bag",
    name: "\"Star. Icon. Legend.\" Tote Bag",
    priceCents: 1800,
    color: "#FF2264",
    description: "Big enough for everything you need. Small enough that you still make an entrance.",
    tag: "Diva",
  },
  {
    slug: "lab-safety-poster",
    name: "Lab Safety Poster (Rarely Followed)",
    priceCents: 1000,
    color: "#FF2264",
    description: "A friendly reminder to wear goggles. Frame not included. Neither is a working fire extinguisher.",
    tag: "Chaos",
  },
  {
    slug: "clipboard-of-destiny",
    name: "The Clipboard of Destiny",
    priceCents: 2200,
    color: "#4ADE80",
    description: "Genuine faux-leather clipboard. Holds one call sheet and the entire weight of the production.",
    tag: "Order",
  },
  {
    slug: "meep-meep-mug",
    name: "\"Meep Meep\" Mug",
    priceCents: 1400,
    color: "#FF2264",
    description: "Holds coffee, tea, or the sound you make right before something goes very wrong.",
    tag: "Heart",
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
