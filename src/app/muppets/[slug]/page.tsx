import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MUPPETS, getMuppet, vectorDistance } from "@/lib/muppets";
import { getMuppetIllustration } from "@/lib/illustrations";
import { MuppetAvatar } from "@/components/MuppetCard";
import { TraitBarGroup } from "@/components/TraitBar";
import { Badge, Button, Card } from "@/components/ui";

export function generateStaticParams() {
  return MUPPETS.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const muppet = getMuppet(slug);
  if (!muppet) return {};
  return {
    title: muppet.name,
    description: muppet.tagline,
  };
}

export default async function MuppetDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const muppet = getMuppet(slug);
  if (!muppet) notFound();

  const illustration = getMuppetIllustration(muppet.slug);
  const closest = [...MUPPETS]
    .filter((m) => m.slug !== muppet.slug)
    .sort((a, b) => vectorDistance(muppet.vector, a.vector) - vectorDistance(muppet.vector, b.vector))
    .slice(0, 3);

  const accentColor = muppet.color === "#4ADE80" ? "var(--primary)" : "var(--accent)";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Link href="/muppets" className="link-brutal text-sm">
        ← Back to directory
      </Link>

      {illustration && (
        <div className="relative mt-6 aspect-[4/3] w-full overflow-hidden border-[3px] border-foreground bg-white brutal-shadow">
          <Image
            src={illustration}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      <div className="mt-6 flex items-center gap-4">
        <MuppetAvatar muppet={muppet} size={72} />
        <div>
          <h1 className="font-display text-3xl font-normal sm:text-4xl">{muppet.name}</h1>
          <p className="font-bold uppercase tracking-wider text-text-secondary">{muppet.title}</p>
        </div>
      </div>

      <p className="mt-4 text-lg italic text-text-secondary">&ldquo;{muppet.tagline}&rdquo;</p>

      <blockquote
        className="mt-6 border-l-[6px] pl-4 text-xl font-display font-normal"
        style={{ borderColor: accentColor }}
      >
        &ldquo;{muppet.quote}&rdquo;
      </blockquote>

      <p className="mt-6 text-text-secondary">{muppet.bio}</p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card>
          <h2 className="font-display font-normal">Strengths</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-secondary">
            {muppet.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </Card>
        <Card>
          <h2 className="font-display font-normal">Quirks</h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text-secondary">
            {muppet.quirks.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display font-normal">Trait breakdown</h2>
        <div className="mt-4">
          <TraitBarGroup vector={muppet.vector} />
        </div>
      </Card>

      <div className="mt-10">
        <h2 className="font-display font-normal">Closest matches on the map</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {closest.map((m) => (
            <Link key={m.slug} href={`/muppets/${m.slug}`} className="block">
              <Card className="flex flex-row items-center gap-3 p-3">
                <MuppetAvatar muppet={m} size={36} />
                <span className="text-sm font-bold">{m.name}</span>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card className="mt-12 flex flex-col items-center gap-3 bg-surface-alt p-8 text-center">
        <Badge color={muppet.color}>Think you&apos;re a {muppet.name.split(" ")[0]}?</Badge>
        <p className="font-display text-xl font-normal">Take the quiz and find out for sure</p>
        <Link href="/quiz">
          <Button variant="primary" className="px-8 py-3 text-base">
            Start the quiz
          </Button>
        </Link>
      </Card>
    </div>
  );
}
