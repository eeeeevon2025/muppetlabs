import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import { clampAxis } from "@/lib/muppets";
import type { QuizAnswerRecord, TraitAxis, TraitVector } from "@/lib/types";

const ZERO_VECTOR: TraitVector = { chaosOrder: 0, warmth: 0, ego: 0, energy: 0 };

// Raw deltas can add up past +/-5 well before all questions are answered;
// this scales them back down into the same -5..5 range the Muppet archetypes live on.
const SCALE_FACTOR = 2.2;

export function computeVectorFromAnswers(answers: QuizAnswerRecord[]): TraitVector {
  const raw: TraitVector = { ...ZERO_VECTOR };

  for (const answer of answers) {
    const question = QUIZ_QUESTIONS.find((q) => q.id === answer.questionId);
    const option = question?.options.find((o) => o.id === answer.optionId);
    if (!option) continue;

    for (const key of Object.keys(option.effects) as TraitAxis[]) {
      raw[key] += option.effects[key] ?? 0;
    }
  }

  const scaled: TraitVector = { ...ZERO_VECTOR };
  for (const axis of Object.keys(raw) as TraitAxis[]) {
    scaled[axis] = clampAxis(raw[axis] / SCALE_FACTOR);
  }
  return scaled;
}
