import type { Metadata } from "next";
import Link from "next/link";
import { MUPPETS, TRAIT_AXES } from "@/lib/muppets";
import { Card, Badge, Button } from "@/components/ui";
import { TraitBarGroup } from "@/components/TraitBar";
import { MuppetAvatar } from "@/components/MuppetCard";

export const metadata: Metadata = {
  title: "The Theory",
  description:
    "The Chaos Muppet / Order Muppet theory, explained, plus the three extra traits we added to build a full personality match.",
};

export default function TheoryPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Badge color="var(--primary)">The Theory</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">
        Everyone is secretly a Chaos Muppet or an Order Muppet
      </h1>
      <p className="mt-4 text-lg text-text-secondary">
        It&apos;s an old bit of internet folk psychology, and like most good folk
        psychology, it survives because it&apos;s immediately true of everyone you
        know. Some people bring order to a room. Some people bring a cannon.
        You already know which one you are.
      </p>

      <div className="prose-like mt-10 flex flex-col gap-6 text-text-secondary">
        <section>
          <h2 className="font-display text-2xl font-normal">The original idea</h2>
          <p className="mt-2">
            <strong>Order Muppets</strong> — think Kermit, Scooter, Sam the
            Eagle — operate on schedules, standards, and a quiet dread that
            everything is about to fall apart. They read the room and then
            try to fix the room. <strong>Chaos Muppets</strong> — think
            Animal, Gonzo, the Swedish Chef — operate on vibes and volume.
            They <em>are</em> the reason the room is falling apart, and they
            regret nothing.
          </p>
          <p className="mt-2">
            Neither side is right. A cast of only Order Muppets never gets
            off the ground; a cast of only Chaos Muppets never gets on
            stage. The show needs both, which is the whole point of the
            theory: chaos and order aren&apos;t good and bad, they&apos;re just two
            different jobs.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal">Why we added three more axes</h2>
          <p className="mt-2">
            Chaos vs. order tells you how someone handles a plan. It doesn&apos;t
            tell you how they handle a compliment, an audience, or a
            Tuesday. So our quiz scores four traits instead of one:
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {TRAIT_AXES.map((axis) => (
              <Card key={axis.key} className="gap-2">
                <p className="font-display font-normal">{axis.label}</p>
                <p className="text-sm text-text-secondary">
                  {axis.key === "chaosOrder" &&
                    "Do you improvise the plan, or protect it with your life?"}
                  {axis.key === "warmth" &&
                    "Do your jokes land like a hug, or like a well-aimed jab?"}
                  {axis.key === "ego" &&
                    "Do you deflect the spotlight, or was it always yours?"}
                  {axis.key === "energy" &&
                    "Is your default volume a whisper or a drum solo?"}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal">How matching works</h2>
          <p className="mt-2">
            Each of the fourteen archetypes in our directory has a fixed
            position on all four axes. Your twelve quiz answers nudge you
            around a shared map, and when you&apos;re done we find whichever
            archetype sits closest to you — plus a runner-up, which is
            usually more revealing than the headline result.
          </p>
        </section>

        <section>
          <h2 className="font-display text-2xl font-normal">The full map</h2>
          <p className="mt-2">
            Here&apos;s where all fourteen archetypes land. Extremes in every
            direction, on purpose — the theory only works if the map has
            edges.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {MUPPETS.map((m) => (
              <Card key={m.slug} className="gap-3">
                <div className="flex items-center gap-3">
                  <MuppetAvatar muppet={m} size={40} />
                  <Link href={`/muppets/${m.slug}`} className="link-brutal font-display font-normal">
                    {m.name}
                  </Link>
                </div>
                <TraitBarGroup vector={m.vector} />
              </Card>
            ))}
          </div>
        </section>
      </div>

      <Card className="mt-12 flex flex-col items-center gap-3 bg-surface-alt p-8 text-center">
        <p className="font-display text-xl font-normal">Curious where you land?</p>
        <Link href="/quiz">
          <Button variant="primary" className="px-8 py-3 text-base">
            Take the quiz
          </Button>
        </Link>
      </Card>
    </div>
  );
}
