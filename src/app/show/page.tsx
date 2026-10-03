import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, Card, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Build Your Muppet Show",
  description: "Cast a director, assemble performers, pick the conflict, and publish a shareable episode card.",
};

export default function ShowIndexPage() {
  return (
    <div>
      <PageHeader
        badge="Show builder"
        title="Build your Muppet show"
        description="Five steps from pitch to episode card — director, cast, conflict character, and a finale song worth applauding through."
      />

      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <Card>
          <ol className="list-decimal space-y-3 pl-5 text-text-secondary">
            <li>Name your show and claim executive producer credit.</li>
            <li>Pick a director to hold the clipboard.</li>
            <li>Cast three main performers.</li>
            <li>Choose who derails the cold open.</li>
            <li>Title the episode and name the finale song.</li>
          </ol>
        </Card>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/show/build">
            <Button variant="accent">Start building</Button>
          </Link>
          <Link href="/quiz">
            <Button variant="outline">Take the quiz first</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
