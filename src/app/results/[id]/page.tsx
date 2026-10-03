import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getMuppet } from "@/lib/muppets";
import { getMuppetIllustration } from "@/lib/illustrations";
import type { QuizResult } from "@/lib/types";
import { MuppetAvatar } from "@/components/MuppetCard";
import { TraitBarGroup } from "@/components/TraitBar";
import { Badge, Button, Card } from "@/components/ui";
import ShareResultButton from "@/components/ShareResultButton";
import CreateCompareInviteButton from "@/components/CreateCompareInviteButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const result = db.find<QuizResult>("quizResults", id);
  const muppet = result ? getMuppet(result.muppetSlug) : undefined;
  if (!muppet) return {};
  return {
    title: `${result?.displayName ?? "Someone"} matched with ${muppet.name}`,
    description: muppet.tagline,
  };
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = db.find<QuizResult>("quizResults", id);
  if (!result) notFound();

  const muppet = getMuppet(result.muppetSlug);
  const runnerUp = getMuppet(result.runnerUpSlug);
  if (!muppet) notFound();

  const illustration = getMuppetIllustration(muppet.slug);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <Badge color="var(--accent)">{result.displayName}&rsquo;s result</Badge>
        <p className="mt-4 text-sm font-bold uppercase tracking-wider text-text-secondary">
          You are...
        </p>
        <h1 className="font-display mt-1 text-4xl font-normal sm:text-5xl" style={{ color: muppet.color === "#4ADE80" ? "var(--primary)" : "var(--accent)" }}>
          {muppet.name}
        </h1>
        <p className="mt-2 text-lg text-text-secondary">{muppet.title}</p>
      </div>

      <div className="mt-8 flex justify-center">
        {illustration ? (
          <div className="relative h-48 w-48 overflow-hidden border-[3px] border-foreground bg-white brutal-shadow">
            <Image
              src={illustration}
              alt=""
              fill
              className="object-cover object-center"
              sizes="192px"
            />
          </div>
        ) : (
          <MuppetAvatar muppet={muppet} size={120} />
        )}
      </div>

      <Card className="mt-8">
        <p className="text-text-secondary">{muppet.bio}</p>
      </Card>

      <Card className="mt-6">
        <h2 className="font-display font-normal">Your traits</h2>
        <div className="mt-4">
          <TraitBarGroup vector={result.vector} />
        </div>
      </Card>

      {runnerUp && (
        <Card className="mt-6 flex items-center gap-4">
          <MuppetAvatar muppet={runnerUp} size={48} />
          <div>
            <p className="text-sm text-text-secondary">Your runner-up match:</p>
            <Link href={`/muppets/${runnerUp.slug}`} className="link-brutal font-display font-normal">
              {runnerUp.name}
            </Link>
          </div>
        </Card>
      )}

      <div className="mt-10 flex flex-col items-center gap-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <ShareResultButton />
          <Link href={`/muppets/${muppet.slug}`}>
            <Button variant="outline">Read the full profile</Button>
          </Link>
          <Link href="/quiz">
            <Button variant="primary">Take it again</Button>
          </Link>
        </div>

        <div className="w-full max-w-md border-t-[3px] border-foreground pt-6 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-text-secondary">
            Keep going
          </p>
          <div className="mt-4 flex flex-col items-center gap-4">
            <CreateCompareInviteButton hostResultId={result.id} />
            <Link href={`/show/build?from=${result.id}`}>
              <Button variant="outline">Build your Muppet show</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
