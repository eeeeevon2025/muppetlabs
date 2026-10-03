"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitShow } from "@/app/show/actions";
import { MUPPETS } from "@/lib/muppets";
import { SHOW_CAST_SIZE } from "@/lib/show";
import MuppetPicker from "@/components/MuppetPicker";
import { Button, Card, FormNotice, TextInput, Field } from "@/components/ui";

const STEPS = ["Show details", "Director", "Main cast", "Conflict", "Finale"];

export default function ShowBuilderWizard({
  defaultDirectorSlug,
  hostResultId,
}: {
  defaultDirectorSlug?: string;
  hostResultId?: string;
}) {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [creatorName, setCreatorName] = useState("");
  const [showTitle, setShowTitle] = useState("");
  const [directorSlug, setDirectorSlug] = useState(defaultDirectorSlug ?? "");
  const [castSlugs, setCastSlugs] = useState<string[]>([]);
  const [conflictSlug, setConflictSlug] = useState("");
  const [episodeTitle, setEpisodeTitle] = useState("");
  const [finaleSong, setFinaleSong] = useState("");

  const progressPercent = Math.round((stepIndex / (STEPS.length - 1)) * 100);

  function toggleCast(slug: string) {
    setCastSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : prev.length < SHOW_CAST_SIZE ? [...prev, slug] : prev,
    );
  }

  function goNext() {
    setError(null);
    if (stepIndex === 0) {
      if (!creatorName.trim()) return setError("Tell us who's producing this.");
      if (!showTitle.trim()) return setError("Every show needs a title.");
    }
    if (stepIndex === 1 && !directorSlug) return setError("Pick a director.");
    if (stepIndex === 2 && castSlugs.length < SHOW_CAST_SIZE) {
      return setError(`Pick ${SHOW_CAST_SIZE} cast members.`);
    }
    if (stepIndex === 3 && !conflictSlug) return setError("Pick who starts the drama.");
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  }

  function goBack() {
    setError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  function handleSubmit() {
    setError(null);
    if (!episodeTitle.trim()) return setError("Name this episode.");
    if (!finaleSong.trim()) return setError("Every episode needs a finale song.");

    startTransition(async () => {
      const result = await submitShow({
        creatorName: creatorName.trim(),
        showTitle: showTitle.trim(),
        episodeTitle: episodeTitle.trim(),
        directorSlug,
        castSlugs,
        conflictSlug,
        finaleSong: finaleSong.trim(),
        hostResultId: hostResultId ?? null,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }

      router.push(`/show/${result.showId}`);
    });
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-semibold text-text-secondary">
          <span>
            Step {stepIndex + 1} of {STEPS.length}: {STEPS[stepIndex]}
          </span>
          <span>{progressPercent}%</span>
        </div>
        <div className="h-4 w-full overflow-hidden border-[3px] border-foreground bg-surface-alt">
          <div className="h-full bg-accent transition-all" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <Card>
        {stepIndex === 0 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-normal">Name the production</h2>
            <Field label="Your name" htmlFor="creatorName">
              <TextInput
                id="creatorName"
                value={creatorName}
                onChange={(e) => setCreatorName(e.target.value)}
                placeholder="Stage name or real name"
              />
            </Field>
            <Field label="Show title" htmlFor="showTitle" hint="The series — not just one episode.">
              <TextInput
                id="showTitle"
                value={showTitle}
                onChange={(e) => setShowTitle(e.target.value)}
                placeholder="e.g. Muppet Mayhem Hour"
              />
            </Field>
          </div>
        )}

        {stepIndex === 1 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-normal">Who's directing?</h2>
            <p className="text-sm text-text-secondary">
              The director holds the clipboard — or pretends to.
            </p>
            <MuppetPicker
              muppets={MUPPETS}
              selected={directorSlug ? [directorSlug] : []}
              onToggle={(slug) => setDirectorSlug(directorSlug === slug ? "" : slug)}
              max={1}
            />
          </div>
        )}

        {stepIndex === 2 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-normal">Build the main cast</h2>
            <p className="text-sm text-text-secondary">
              Pick {SHOW_CAST_SIZE} performers. The director is already busy.
            </p>
            <MuppetPicker
              muppets={MUPPETS}
              selected={castSlugs}
              onToggle={toggleCast}
              disabledSlugs={directorSlug ? [directorSlug] : []}
              max={SHOW_CAST_SIZE}
            />
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              {castSlugs.length} / {SHOW_CAST_SIZE} selected
            </p>
          </div>
        )}

        {stepIndex === 3 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-normal">Who causes the conflict?</h2>
            <p className="text-sm text-text-secondary">
              Every good episode needs someone who derails the cold open.
            </p>
            <MuppetPicker
              muppets={MUPPETS}
              selected={conflictSlug ? [conflictSlug] : []}
              onToggle={(slug) => setConflictSlug(conflictSlug === slug ? "" : slug)}
              disabledSlugs={[directorSlug, ...castSlugs].filter(Boolean)}
              max={1}
            />
          </div>
        )}

        {stepIndex === 4 && (
          <div className="flex flex-col gap-4">
            <h2 className="font-display text-2xl font-normal">Finale details</h2>
            <Field label="Episode title" htmlFor="episodeTitle">
              <TextInput
                id="episodeTitle"
                value={episodeTitle}
                onChange={(e) => setEpisodeTitle(e.target.value)}
                placeholder="e.g. The Great Cannon Rehearsal"
              />
            </Field>
            <Field label="Finale song" htmlFor="finaleSong" hint="The number that brings the house down.">
              <TextInput
                id="finaleSong"
                value={finaleSong}
                onChange={(e) => setFinaleSong(e.target.value)}
                placeholder="e.g. Rainbow Connection (Chaos Remix)"
              />
            </Field>
          </div>
        )}

        {error && (
          <div className="mt-4">
            <FormNotice kind="error" message={error} />
          </div>
        )}

        <div className="mt-6 flex flex-wrap justify-between gap-3">
          <Button type="button" variant="ghost" onClick={goBack} disabled={stepIndex === 0 || isPending}>
            Back
          </Button>
          {stepIndex < STEPS.length - 1 ? (
            <Button type="button" variant="primary" onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button type="button" variant="accent" onClick={handleSubmit} disabled={isPending}>
              {isPending ? "Building episode..." : "Publish episode card"}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
