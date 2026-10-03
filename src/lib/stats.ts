import { db } from "@/lib/db";
import { MUPPETS, getMuppet } from "@/lib/muppets";
import type { QuizResult, TriviaScore } from "@/lib/types";

export function getQuizResultCount(): number {
  return db.read<QuizResult>("quizResults").length;
}

export function getMuppetMatchCounts(): { slug: string; name: string; color: string; count: number }[] {
  const results = db.read<QuizResult>("quizResults");
  const counts = new Map<string, number>();
  for (const r of results) {
    counts.set(r.muppetSlug, (counts.get(r.muppetSlug) ?? 0) + 1);
  }
  return MUPPETS.map((m) => ({
    slug: m.slug,
    name: m.name,
    color: m.color,
    count: counts.get(m.slug) ?? 0,
  })).sort((a, b) => b.count - a.count);
}

export function getMostPopularMuppet() {
  const counts = getMuppetMatchCounts();
  const top = counts.find((c) => c.count > 0);
  return top ? getMuppet(top.slug) : undefined;
}

export function getTopTriviaScores(limit = 10) {
  const scores = db.read<TriviaScore>("triviaScores");
  return [...scores]
    .sort((a, b) => {
      const ratioA = a.score / a.totalQuestions;
      const ratioB = b.score / b.totalQuestions;
      if (ratioB !== ratioA) return ratioB - ratioA;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })
    .slice(0, limit);
}
