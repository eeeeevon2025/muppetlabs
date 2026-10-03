"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { QuizQuestion } from "@/lib/types";
import { submitQuiz } from "@/app/quiz/actions";
import { Button, Card, TextInput, FormNotice } from "@/components/ui";

export default function QuizWizard({
  questions,
  compareToken,
}: {
  questions: QuizQuestion[];
  compareToken?: string;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalSteps = questions.length + 1;
  const isFinalStep = stepIndex === questions.length;
  const currentQuestion = isFinalStep ? null : questions[stepIndex];
  const progressPercent = Math.round((stepIndex / totalSteps) * 100);

  const answeredCount = useMemo(() => Object.keys(answers).length, [answers]);

  function selectOption(questionId: string, optionId: string) {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  }

  function goNext() {
    setError(null);
    if (currentQuestion && !answers[currentQuestion.id]) {
      setError("Pick an answer before moving on.");
      return;
    }
    setStepIndex((i) => Math.min(i + 1, totalSteps - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    setError(null);
    if (answeredCount < questions.length) {
      setError("Looks like a question got skipped — use Back to finish it.");
      return;
    }

    startTransition(async () => {
      const result = await submitQuiz({
        displayName: displayName.trim() || undefined,
        answers: questions.map((q) => ({ questionId: q.id, optionId: answers[q.id] })),
        compareToken,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      if (compareToken) {
        router.push(`/compare/${compareToken}`);
        return;
      }

      router.push(`/results/${result.resultId}`);
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-semibold text-text-secondary">
          <span>{isFinalStep ? "Almost done" : `Question ${stepIndex + 1} of ${questions.length}`}</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-4 w-full overflow-hidden border-[3px] border-foreground bg-surface-alt">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <Card>
        {!isFinalStep && currentQuestion && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold">{currentQuestion.prompt}</h2>
            <div className="flex flex-col gap-2">
              {currentQuestion.options.map((option) => {
                const selected = answers[currentQuestion.id] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => selectOption(currentQuestion.id, option.id)}
                    aria-pressed={selected}
                    className={`border-[3px] px-4 py-3 text-left text-sm font-bold transition ${
                      selected
                        ? "border-foreground bg-primary brutal-shadow-sm"
                        : "border-foreground bg-surface hover:bg-surface-alt"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {isFinalStep && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-xl font-bold">One last thing</h2>
            <p className="text-sm text-text-secondary">
              What should we call you on your result? Totally optional.
            </p>
            <TextInput
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Anonymous Fan"
              maxLength={60}
              aria-label="Display name"
            />
          </div>
        )}

        {error && (
          <div className="mt-4">
            <FormNotice kind="error" message={error} />
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" type="button" onClick={goBack} disabled={stepIndex === 0 || isPending}>
            Back
          </Button>
          {isFinalStep ? (
            <Button variant="accent" type="button" onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Matching you..." : "See my result"}
            </Button>
          ) : (
            <Button type="button" onClick={goNext}>
              Next
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
