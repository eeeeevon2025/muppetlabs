import Image from "next/image";
import Link from "next/link";
import { MUPPETS } from "@/lib/muppets";
import { KERMIT_ILLUSTRATION, MISS_PIGGY_ILLUSTRATION } from "@/lib/illustrations";
import { Card, Button, Badge } from "@/components/ui";
import MuppetCard from "@/components/MuppetCard";
import MuppetBuilder from "@/components/MuppetBuilder";
import { getQuizResultCount } from "@/lib/stats";

export default function Home() {
  const resultCount = getQuizResultCount();
  const featured = MUPPETS.slice(0, 4);

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden border-b-[3px] border-foreground bg-surface grain">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-20">
          <div className="flex flex-col gap-6">
            <Badge color="var(--accent)">Unofficial fan project</Badge>
            <h1 className="font-display text-4xl font-normal leading-none sm:text-6xl">
              Which Muppet are you, actually?
            </h1>
            <p className="max-w-xl text-lg text-text-secondary">
              Answer twelve questions, get sorted along four traits pulled
              straight from backstage psychology, and find out which
              felt-hearted icon you really are. {resultCount > 0 && `Join ${resultCount.toLocaleString()} fans who already took the quiz.`}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link href="/quiz">
                <Button variant="accent" className="px-8 py-3 text-base">
                  Take the quiz
                </Button>
              </Link>
              <Link href="/theory">
                <Button variant="outline" className="px-8 py-3 text-base">
                  Read the theory first
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 justify-self-center border-[3px] border-foreground bg-white brutal-shadow lg:max-w-none">
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={KERMIT_ILLUSTRATION}
                alt=""
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
            <div className="relative aspect-square overflow-hidden border-l-[3px] border-foreground">
              <Image
                src={MISS_PIGGY_ILLUSTRATION}
                alt=""
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 1024px) 50vw, 25vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between gap-4 border-b-[3px] border-foreground pb-4">
          <div>
            <h2 className="font-display text-2xl font-normal">Meet a few of the cast</h2>
            <p className="text-text-secondary">
              Fourteen archetypes, each mapped across four traits.
            </p>
          </div>
          <Link href="/muppets" className="link-brutal whitespace-nowrap text-sm">
            See full directory →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((m) => (
            <MuppetCard key={m.slug} muppet={m} />
          ))}
        </div>
      </section>

      <MuppetBuilder />

      <section className="border-y-[3px] border-foreground bg-foreground text-background">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-3">
          <Card className="bg-background text-foreground">
            <h3 className="font-display text-xl font-normal">Compare with a friend</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Finish the quiz, send an invite link, and see if you&apos;re mirror
              matches or chaos × order.
            </p>
            <Link href="/compare" className="link-brutal mt-4 inline-block text-sm">
              Start a compare →
            </Link>
          </Card>
          <Card className="bg-background text-foreground">
            <h3 className="font-display text-xl font-normal">Build your show</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Cast a director, pick performers, choose the conflict, and publish
              a shareable episode card.
            </p>
            <Link href="/show/build" className="link-brutal mt-4 inline-block text-sm">
              Open show builder →
            </Link>
          </Card>
          <Card className="bg-background text-foreground">
            <h3 className="font-display text-xl font-normal">The theory</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Everyone&apos;s secretly a Chaos Muppet or an Order Muppet. We took
              that classic idea and built three more axes on top of it.
            </p>
            <Link href="/theory" className="link-brutal mt-4 inline-block text-sm">
              Read the full breakdown →
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <h3 className="font-display text-xl font-normal">Trivia night</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Eight rapid-fire questions about the theory and the cast.
              Submit your score to the leaderboard.
            </p>
            <Link href="/trivia" className="link-brutal mt-4 inline-block text-sm">
              Play trivia →
            </Link>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-normal">The store</h3>
            <p className="mt-2 text-sm text-text-secondary">
              Merch for every corner of the trait map, from chaos pins to
              order-muppet desk organizers.
            </p>
            <Link href="/store" className="link-brutal mt-4 inline-block text-sm">
              Browse the store →
            </Link>
          </Card>
          <Card>
            <h3 className="font-display text-xl font-normal">Leaderboard</h3>
            <p className="mt-2 text-sm text-text-secondary">
              See which Muppet matches show up most often — and who&apos;s topping trivia.
            </p>
            <Link href="/leaderboard" className="link-brutal mt-4 inline-block text-sm">
              View leaderboard →
            </Link>
          </Card>
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-2xl font-normal">Ready to find out?</h2>
        <p className="max-w-md text-text-secondary">
          It takes about three minutes. No email required to see your result.
        </p>
        <Link href="/quiz">
          <Button variant="primary" className="px-8 py-3 text-base">
            Start the quiz
          </Button>
        </Link>
      </section>
    </div>
  );
}
