import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import {
  getCompareInvite,
  getCompareResults,
  getCompatibilityVerdict,
} from "@/lib/compare";
import { getMuppet } from "@/lib/muppets";
import { getMuppetIllustration } from "@/lib/illustrations";
import type { QuizResult } from "@/lib/types";
import CopyLinkButton from "@/components/CopyLinkButton";
import { MuppetAvatar } from "@/components/MuppetCard";
import { TraitBarGroup } from "@/components/TraitBar";
import { Badge, Button, Card } from "@/components/ui";

function ResultMini({ result }: { result: QuizResult }) {
  const muppet = getMuppet(result.muppetSlug);
  if (!muppet) return null;
  const illustration = getMuppetIllustration(muppet.slug);

  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
        {result.displayName}
      </p>
      {illustration ? (
        <div className="relative mt-3 h-28 w-28 overflow-hidden border-[3px] border-foreground bg-white brutal-shadow-sm">
          <Image src={illustration} alt="" fill className="object-cover object-center" sizes="112px" />
        </div>
      ) : (
        <div className="mt-3">
          <MuppetAvatar muppet={muppet} size={112} />
        </div>
      )}
      <h3
        className="font-display mt-3 text-2xl font-normal"
        style={{ color: muppet.color === "#4ADE80" ? "var(--primary)" : "var(--accent)" }}
      >
        {muppet.name}
      </h3>
      <p className="text-sm text-text-secondary">{muppet.title}</p>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>;
}): Promise<Metadata> {
  const { token } = await params;
  const invite = getCompareInvite(token);
  if (!invite) return { title: "Compare invite" };
  if (invite.status === "complete") return { title: "Compare results" };
  return { title: "Waiting for friend" };
}

export default async function CompareTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const invite = getCompareInvite(token);
  if (!invite) notFound();

  const hostResult = db.find<QuizResult>("quizResults", invite.hostResultId);
  if (!hostResult) notFound();

  const hostMuppet = getMuppet(hostResult.muppetSlug);
  if (!hostMuppet) notFound();

  const invitePath = `/compare/${token}`;
  const quizPath = `/quiz?compare=${token}`;

  if (invite.status === "expired") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <Badge color="var(--accent)">Invite expired</Badge>
        <h1 className="font-display mt-4 text-3xl font-normal">This compare link timed out</h1>
        <p className="mt-3 text-text-secondary">
          Invites last seven days. Ask your friend to send a fresh one from their result page.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/quiz"><Button variant="primary">Take the quiz</Button></Link>
          <Link href="/compare"><Button variant="outline">About compare</Button></Link>
        </div>
      </div>
    );
  }

  if (invite.status === "waiting") {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
        <div className="text-center">
          <Badge color="var(--primary)">Waiting for friend</Badge>
          <h1 className="font-display mt-4 text-3xl font-normal sm:text-4xl">
            {hostResult.displayName} is {hostMuppet.name}
          </h1>
          <p className="mt-3 text-text-secondary">
            Send this link to a friend. When they finish the quiz, you'll both see the compatibility verdict here.
          </p>
        </div>

        <Card className="mt-8 text-center">
          <p className="text-sm font-bold uppercase tracking-wider text-text-secondary">Invite link</p>
          <p className="mt-2 break-all font-mono text-sm">{invitePath}</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <CopyLinkButton url={invitePath} label="Copy invite link" variant="accent" />
          </div>
        </Card>

        <div className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-sm text-text-secondary">Are you the friend?</p>
          <Link href={quizPath}>
            <Button variant="primary">Take the quiz to compare</Button>
          </Link>
          <Link href={`/results/${hostResult.id}`} className="link-brutal text-sm">
            View {hostResult.displayName}&apos;s result →
          </Link>
        </div>
      </div>
    );
  }

  const pair = getCompareResults(invite);
  if (!pair) notFound();

  const verdict = getCompatibilityVerdict(pair.host, pair.guest);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <div className="text-center">
        <Badge color="var(--accent)">{verdict.duoLabel}</Badge>
        <h1 className="font-display mt-4 text-3xl font-normal sm:text-5xl">{verdict.headline}</h1>
        <p className="mt-3 text-lg text-text-secondary">{verdict.summary}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <Card><ResultMini result={pair.host} /></Card>
        <Card><ResultMini result={pair.guest} /></Card>
      </div>

      <Card className="mt-6">
        <h2 className="font-display font-normal">Trait overlap</h2>
        <p className="mt-1 text-sm text-text-secondary">
          Map distance: {verdict.distance.toFixed(1)} — lower means closer on the four axes.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider">{pair.host.displayName}</p>
            <TraitBarGroup vector={pair.host.vector} />
          </div>
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wider">{pair.guest.displayName}</p>
            <TraitBarGroup vector={pair.guest.vector} />
          </div>
        </div>
      </Card>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <CopyLinkButton url={invitePath} label="Copy compare link" />
        <Link href="/quiz"><Button variant="primary">Take the quiz</Button></Link>
        <Link href="/show/build"><Button variant="outline">Build your Muppet show</Button></Link>
      </div>
    </div>
  );
}
