import type { Metadata } from "next";
import { MUPPETS } from "@/lib/muppets";
import MuppetCard from "@/components/MuppetCard";
import { Badge } from "@/components/ui";

export const metadata: Metadata = {
  title: "Muppet Directory",
  description: "All fourteen archetypes in our personality theory, with full bios and trait breakdowns.",
};

export default function MuppetsPage() {
  return (
    <div>
      <div className="border-b-[3px] border-foreground bg-surface-alt">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <Badge color="var(--primary)">Directory</Badge>
          <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">The full cast</h1>
          <p className="mt-3 max-w-2xl text-lg text-text-secondary">
            Fourteen archetypes, each anchored to a fixed spot on the four-trait
            map. Click through for the full bio, strengths, quirks, and trait
            breakdown.
          </p>
        </div>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MUPPETS.map((m) => (
            <MuppetCard key={m.slug} muppet={m} />
          ))}
        </div>
      </div>
    </div>
  );
}
