import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "About & Credits",
  description: "What this site is, who made it, and the obligatory fan-project disclaimer.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <Badge color="var(--primary)">About</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">About this project</h1>

      <div className="mt-6 flex flex-col gap-4 text-text-secondary">
        <p>
          The Muppet Personality Project is a fan-made, non-commercial demo
          site built around one very old bit of internet folk psychology:
          that everyone is secretly a Chaos Muppet or an Order Muppet. We
          took that idea, added three more traits, and built a quiz, a
          directory, a fan wall, a trivia game, and — because no fan site is
          complete without one — a small merch store that doesn&apos;t actually
          charge anyone anything.
        </p>
        <p>
          Fourteen archetypes, four traits, one map. Everything else on the
          site — the theory essay, the news articles, the trivia questions —
          exists to support that one idea from as many angles as we could
          think of.
        </p>
      </div>

      <Card className="mt-10">
        <h2 className="font-display font-normal">Disclaimer</h2>
        <p className="mt-2 text-sm text-text-secondary">
          This is an unofficial fan project made for personal, non-commercial
          purposes. It is not affiliated with, endorsed by, or associated
          with The Muppets Studio, Disney, or any of the original creators
          and rights holders of the referenced characters. All character
          names belong to their respective owners and are used here for
          commentary and fan appreciation only. No official artwork, audio,
          or video is used anywhere on this site.
        </p>
      </Card>

      <Card className="mt-6">
        <h2 className="font-display font-normal">Credits</h2>
        <ul className="mt-2 space-y-1 text-sm text-text-secondary">
          <li>Theory &amp; trait model: the site&apos;s own editorial team</li>
          <li>Quiz questions &amp; archetype bios: original writing for this project</li>
          <li>Built with Next.js, React, and Tailwind CSS</li>
        </ul>
      </Card>

      <p className="mt-10 text-center text-sm text-text-secondary">
        Questions? Head over to the{" "}
        <Link href="/contact" className="link-brutal">
          contact page
        </Link>
        .
      </p>
    </div>
  );
}
