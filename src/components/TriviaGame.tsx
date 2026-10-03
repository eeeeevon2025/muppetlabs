"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { TriviaQuestion } from "@/lib/trivia";
import { submitTriviaScore } from "@/app/trivia/actions";
import { Button, Card, TextInput, FormNotice } from "@/components/ui";

export default function TriviaGame({ questions }: { questions: TriviaQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const question = questions[index];
  const isLast = index === questions.length - 1;

  function handleSelect(optionIndex: number) {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) {
      setScore((s) => s + 1);
    }
  }

  function handleNext() {
    setSelected(null);
    if (isLast) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
    }
  }

  function handleSubmitScore() {
    setError(null);
    if (!playerName.trim()) {
      setError("Enter a name to save your score.");
      return;
    }
    startTransition(async () => {
      const result = await submitTriviaScore({ playerName: playerName.trim(), score });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSubmitted(true);
    });
  }

  if (finished) {
    return (
      <Card className="mx-auto max-w-lg text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-text-secondary">Final score</p>
        <p className="font-display mt-2 text-5xl font-extrabold text-accent">
          {score} / {questions.length}
        </p>

        {submitted ? (
          <div className="mt-6">
            <FormNotice kind="success" message="Score saved to the leaderboard." />
            <Link href="/leaderboard" className="link-brutal mt-4 inline-block text-sm">
              View leaderboard →
            </Link>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-3">
            <TextInput
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              maxLength={60}
              aria-label="Your name"
            />
            {error && <FormNotice kind="error" message={error} />}
            <Button type="button" onClick={handleSubmitScore} disabled={isPending}>
              {isPending ? "Saving..." : "Save score to leaderboard"}
            </Button>
          </div>
        )}
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg">
      <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">
        Question {index + 1} of {questions.length}
      </p>
      <h2 className="font-display mt-2 text-xl font-bold">{question.prompt}</h2>

      <div className="mt-4 flex flex-col gap-2">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctIndex;
          const isSelected = i === selected;
          let style = "border-foreground bg-surface hover:bg-surface-alt";
          if (selected !== null) {
            if (isCorrect) style = "border-foreground bg-primary brutal-shadow-sm";
            else if (isSelected) style = "border-foreground bg-accent/20";
          }
          return (
            <button
              key={option}
              type="button"
              onClick={() => handleSelect(i)}
              disabled={selected !== null}
              className={`border-[3px] px-4 py-3 text-left text-sm font-bold transition ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <Button type="button" onClick={handleNext} className="mt-4 w-full">
          {isLast ? "See final score" : "Next question"}
        </Button>
      )}
    </Card>
  );
}
