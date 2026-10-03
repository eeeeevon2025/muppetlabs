"use server";

import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { triviaSubmissionSchema } from "@/lib/validation";
import { TRIVIA_QUESTIONS } from "@/lib/trivia";
import type { TriviaScore } from "@/lib/types";

export type SubmitTriviaState = { ok: true } | { ok: false; error: string };

export async function submitTriviaScore(input: {
  playerName: string;
  score: number;
}): Promise<SubmitTriviaState> {
  const totalQuestions = TRIVIA_QUESTIONS.length;

  const parsed = triviaSubmissionSchema.safeParse({
    playerName: input.playerName,
    score: input.score,
    totalQuestions,
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Couldn't submit that score." };
  }
  // The score is trusted only up to the number of questions the quiz actually has —
  // a client could report a higher score, but not one that exceeds the real total.
  if (parsed.data.score > totalQuestions) {
    return { ok: false, error: "Score can't exceed the number of questions." };
  }

  const record: TriviaScore = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    playerName: parsed.data.playerName,
    score: parsed.data.score,
    totalQuestions,
  };

  db.append<TriviaScore>("triviaScores", record);
  return { ok: true };
}
