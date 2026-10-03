import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Compare with a Friend",
  description: "Take the quiz separately and see how your Muppet matches stack up.",
};

export default function CompareIndexPage() {
  return (
    <div>
      <PageHeader
        badge="Compare"
        title="Compare with a friend"
        description="Finish the quiz, send an invite link, and see whether you're mirror matches, kindred spirits, or chaos × order."
      />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card>
          <ol className="list-decimal space-y-3 pl-5 text-text-secondary">
            <li>Take the personality quiz and get your match.</li>
            <li>Click <strong className="text-foreground">Compare with a friend</strong> on your result page.</li>
            <li>Send the invite link — your friend takes the same quiz.</li>
            <li>See your side-by-side compatibility verdict.</li>
          </ol>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/quiz">
            <Button variant="accent">Take the quiz first</Button>
          </Link>
          <Link href="/">
            <Button variant="outline">Back to home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
