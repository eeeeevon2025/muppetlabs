import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { getMuppet } from "@/lib/muppets";
import { suggestDirectorFromResult } from "@/lib/show";
import type { QuizResult } from "@/lib/types";
import ShowBuilderWizard from "@/components/ShowBuilderWizard";
import { Badge, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Build Your Show",
  description: "Cast your dream Muppet variety show in five steps.",
};

export default async function ShowBuildPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  let defaultDirectorSlug: string | undefined;
  let hostResultId: string | undefined;
  let fromName: string | undefined;

  if (from) {
    const result = db.find<QuizResult>("quizResults", from);
    if (result) {
      defaultDirectorSlug = suggestDirectorFromResult(result.muppetSlug);
      hostResultId = result.id;
      fromName = result.displayName;
    }
  }

  return (
    <div>
      <PageHeader
        badge="Show builder"
        title="Assemble the cast"
        description={
          fromName
            ? `${fromName}, we'll default the director to your quiz match — change it anytime.`
            : "No quiz required, but your match makes a great default director."
        }
      />

      {fromName && (
        <div className="mx-auto max-w-2xl px-4 pt-8 sm:px-6">
          <Badge color="var(--primary)">Linked to quiz result</Badge>
        </div>
      )}

      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <ShowBuilderWizard
          defaultDirectorSlug={defaultDirectorSlug}
          hostResultId={hostResultId}
        />
        <p className="mt-8 text-center text-sm text-text-secondary">
          Changed your mind?{" "}
          <Link href="/show" className="link-brutal">
            Read how it works
          </Link>
        </p>
      </div>
    </div>
  );
}
