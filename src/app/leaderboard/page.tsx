import type { Metadata } from "next";
import Link from "next/link";
import { getMuppetMatchCounts, getTopTriviaScores, getQuizResultCount } from "@/lib/stats";
import { getMuppet } from "@/lib/muppets";
import { Badge, Card } from "@/components/ui";
import { MuppetAvatar } from "@/components/MuppetCard";

export const metadata: Metadata = {
  title: "Leaderboard",
  description: "The most common Muppet matches on the site, plus the trivia night high scores.",
};

export default function LeaderboardPage() {
  const matchCounts = getMuppetMatchCounts();
  const totalResults = getQuizResultCount();
  const maxCount = Math.max(1, ...matchCounts.map((c) => c.count));
  const triviaScores = getTopTriviaScores();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Badge color="var(--primary)">Leaderboard</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">Where the internet lands</h1>
      <p className="mt-3 text-lg text-text-secondary">
        {totalResults > 0
          ? `Based on ${totalResults.toLocaleString()} quiz results so far.`
          : "No quiz results yet — be the first to take the quiz."}
      </p>

      <div className="mt-8 flex flex-col gap-3">
        {matchCounts.map((entry) => {
          const muppet = getMuppet(entry.slug);
          if (!muppet) return null;
          const percent = totalResults > 0 ? Math.round((entry.count / totalResults) * 100) : 0;
          const barColor = muppet.color === "#4ADE80" ? "var(--primary)" : "var(--accent)";
          return (
            <Card key={entry.slug} className="gap-2">
              <div className="flex items-center justify-between gap-3">
                <Link href={`/muppets/${muppet.slug}`} className="flex items-center gap-3 link-brutal">
                  <MuppetAvatar muppet={muppet} size={36} />
                  <span className="font-bold">{muppet.name}</span>
                </Link>
                <span className="text-sm font-bold text-text-secondary">
                  {entry.count} {entry.count === 1 ? "match" : "matches"} ({percent}%)
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden border-[3px] border-foreground bg-surface-alt">
                <div
                  className="h-full"
                  style={{ width: `${(entry.count / maxCount) * 100}%`, backgroundColor: barColor }}
                />
              </div>
            </Card>
          );
        })}
      </div>

      <h2 className="font-display mt-14 text-2xl font-normal">Trivia night high scores</h2>
      <p className="mt-1 text-sm text-text-secondary">Top scores from the trivia game, best accuracy first.</p>
      <Card className="mt-4">
        {triviaScores.length === 0 ? (
          <p className="text-sm text-text-secondary">
            No trivia scores yet.{" "}
            <Link href="/trivia" className="link-brutal">
              Play a round
            </Link>
            .
          </p>
        ) : (
          <ol className="flex flex-col gap-2">
            {triviaScores.map((score, i) => (
              <li key={score.id} className="flex items-center justify-between border-b-[3px] border-foreground py-2 text-sm last:border-none">
                <span className="flex items-center gap-3">
                  <span className="w-5 text-right font-bold text-text-secondary">{i + 1}.</span>
                  <span className="font-bold">{score.playerName}</span>
                </span>
                <span className="font-bold text-primary">
                  {score.score} / {score.totalQuestions}
                </span>
              </li>
            ))}
          </ol>
        )}
      </Card>
    </div>
  );
}
