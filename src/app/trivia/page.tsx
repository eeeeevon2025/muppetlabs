import type { Metadata } from "next";
import { TRIVIA_QUESTIONS } from "@/lib/trivia";
import TriviaGame from "@/components/TriviaGame";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trivia Night",
  description: "Eight rapid-fire questions about the theory and the cast.",
};

export default function TriviaPage() {
  return (
    <div>
      <div className="border-b-[3px] border-foreground bg-surface-alt">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center sm:px-6">
          <Badge color="var(--primary)">Trivia</Badge>
          <h1 className="font-display mt-4 text-3xl font-normal sm:text-5xl">Trivia Night</h1>
          <p className="mt-2 text-text-secondary">
            Eight questions. No pressure. (Some pressure.)
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-4xl px-4 py-16 sm:px-6">
        <TriviaGame questions={TRIVIA_QUESTIONS} />
      </div>
    </div>
  );
}
