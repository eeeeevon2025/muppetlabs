"use server";

import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getMuppet } from "@/lib/muppets";
import { muppetShowSchema } from "@/lib/validation";
import type { MuppetShow } from "@/lib/types";

export type SubmitShowState =
  | { ok: true; showId: string }
  | { ok: false; error: string };

export async function submitShow(input: {
  creatorName: string;
  showTitle: string;
  episodeTitle: string;
  directorSlug: string;
  castSlugs: string[];
  conflictSlug: string;
  finaleSong: string;
  hostResultId?: string | null;
}): Promise<SubmitShowState> {
  const parsed = muppetShowSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Check your show details." };
  }

  const data = parsed.data;
  const slugs = new Set([data.directorSlug, data.conflictSlug, ...data.castSlugs]);
  for (const slug of slugs) {
    if (!getMuppet(slug)) {
      return { ok: false, error: "One of the Muppets you picked isn't on the cast list." };
    }
  }

  if (data.castSlugs.includes(data.directorSlug)) {
    return { ok: false, error: "The director can't also be in the main cast — pick someone else." };
  }

  const show: MuppetShow = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    creatorName: data.creatorName,
    showTitle: data.showTitle,
    episodeTitle: data.episodeTitle,
    directorSlug: data.directorSlug,
    castSlugs: data.castSlugs,
    conflictSlug: data.conflictSlug,
    finaleSong: data.finaleSong,
    hostResultId: data.hostResultId ?? null,
  };

  db.append<MuppetShow>("muppetShows", show);
  return { ok: true, showId: show.id };
}
