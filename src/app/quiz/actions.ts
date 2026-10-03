"use server";

import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { matchMuppets } from "@/lib/muppets";
import { computeVectorFromAnswers } from "@/lib/quiz-scoring";
import { quizSubmissionSchema } from "@/lib/validation";
import type { QuizResult } from "@/lib/types";

export type SubmitQuizState =
  | { ok: true; resultId: string }
  | { ok: false; error: string };

export async function submitQuiz(input: {
  displayName?: string;
  answers: { questionId: string; optionId: string }[];
  compareToken?: string;
}): Promise<SubmitQuizState> {
  const parsed = quizSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "That submission didn't look right." };
  }

  const { displayName, answers, compareToken } = parsed.data;
  const vector = computeVectorFromAnswers(answers);
  const { best, runnerUp } = matchMuppets(vector);

  const result: QuizResult = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    displayName,
    vector,
    muppetSlug: best.slug,
    runnerUpSlug: runnerUp.slug,
    answers,
  };

  db.append<QuizResult>("quizResults", result);

  if (compareToken) {
    const { linkGuestToCompare } = await import("@/app/compare/actions");
    const linked = await linkGuestToCompare(compareToken, result.id);
    if (!linked.ok) {
      return { ok: false, error: linked.error };
    }
  }

  return { ok: true, resultId: result.id };
}
