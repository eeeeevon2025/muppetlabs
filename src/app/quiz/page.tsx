import type { Metadata } from "next";
import { QUIZ_QUESTIONS } from "@/lib/quiz-questions";
import QuizWizard from "@/components/QuizWizard";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Take the Quiz",
  description: "Twelve questions, four traits, one Muppet match.",
};

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ compare?: string }>;
}) {
  const { compare: compareToken } = await searchParams;

  return (
    <div>
      <div className="border-b-[3px] border-foreground bg-surface-alt">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <Badge color="var(--accent)">{compareToken ? "Friend compare" : "Quiz"}</Badge>
          <h1 className="font-display mt-4 text-3xl font-normal sm:text-5xl">
            {compareToken ? "Take the quiz to compare" : "The Muppet Personality Quiz"}
          </h1>
          <p className="mt-2 text-text-secondary">
            {compareToken
              ? "Answer honestly — when you finish, you'll see how your match stacks up against your friend."
              : "Answer honestly. The cannon question is not a trick question."}
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <QuizWizard questions={QUIZ_QUESTIONS} compareToken={compareToken} />
      </div>
    </div>
  );
}
