import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMuppet } from "@/lib/muppets";
import { generateEpisodeSynopsis, getShowChaosRating } from "@/lib/show";
import type { MuppetShow } from "@/lib/types";
import CopyLinkButton from "@/components/CopyLinkButton";
import { MuppetAvatar } from "@/components/MuppetCard";
import { Badge, Button, Card } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const show = db.find<MuppetShow>("muppetShows", id);
  if (!show) return {};
  return {
    title: `${show.episodeTitle} — ${show.showTitle}`,
    description: generateEpisodeSynopsis(show),
  };
}

function CastRow({ slug, role }: { slug: string; role: string }) {
  const muppet = getMuppet(slug);
  if (!muppet) return null;
  return (
    <div className="flex items-center gap-3 border-t-[3px] border-foreground pt-3 first:border-t-0 first:pt-0">
      <MuppetAvatar muppet={muppet} size={48} />
      <div>
        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">{role}</p>
        <p className="font-display text-lg font-normal">{muppet.name}</p>
      </div>
    </div>
  );
}

export default async function ShowDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const show = db.find<MuppetShow>("muppetShows", id);
  if (!show) notFound();

  const director = getMuppet(show.directorSlug);
  const conflict = getMuppet(show.conflictSlug);
  const chaos = getShowChaosRating(show);
  const synopsis = generateEpisodeSynopsis(show);
  const showPath = `/show/${show.id}`;

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <Badge color="var(--accent)">{show.showTitle}</Badge>
        <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">{show.episodeTitle}</h1>
        <p className="mt-2 text-sm font-bold uppercase tracking-wider text-text-secondary">
          Executive producer: {show.creatorName}
        </p>
      </div>

      <Card className="mt-8">
        <p className="text-text-secondary">{synopsis}</p>
        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-text-secondary">
          Backstage rating: {chaos.label}
        </p>
      </Card>

      <Card className="mt-6 space-y-3">
        <h2 className="font-display font-normal">Credits</h2>
        {director && <CastRow slug={director.slug} role="Director" />}
        {show.castSlugs.map((slug) => (
          <CastRow key={slug} slug={slug} role="Main cast" />
        ))}
        {conflict && <CastRow slug={conflict.slug} role="Conflict instigator" />}
      </Card>

      <Card className="mt-6 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">Finale</p>
        <p className="font-display mt-2 text-2xl font-normal">&ldquo;{show.finaleSong}&rdquo;</p>
      </Card>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <CopyLinkButton url={showPath} label="Copy episode link" variant="accent" />
        <Link href="/show/build">
          <Button variant="primary">Build another show</Button>
        </Link>
        <Link href="/compare">
          <Button variant="outline">Compare with a friend</Button>
        </Link>
      </div>
    </div>
  );
}
