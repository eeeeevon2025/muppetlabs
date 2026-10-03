import { getMuppet, MUPPETS } from "@/lib/muppets";
import type { Muppet, MuppetShow } from "@/lib/types";

export const SHOW_CAST_SIZE = 3;

export function generateEpisodeSynopsis(show: MuppetShow): string {
  const director = getMuppet(show.directorSlug);
  const conflict = getMuppet(show.conflictSlug);
  const cast = show.castSlugs.map((slug) => getMuppet(slug)).filter(Boolean) as Muppet[];

  if (!director || !conflict || cast.length === 0) {
    return "A variety show episode is forming backstage. Details still loading.";
  }

  const castNames = cast.map((m) => m.name).join(", ");
  const chaosScore =
    [director, conflict, ...cast].reduce((sum, m) => sum + m.vector.chaosOrder, 0) /
    (cast.length + 2);

  const tone =
    chaosScore <= -2
      ? "pure chaos from cold open to credits"
      : chaosScore >= 2
        ? "surprisingly under control until the third act"
        : "balanced enough to fool the network, then not";

  return `${director.name} directs "${show.episodeTitle}" for ${show.showTitle}. ${castNames} carry the A-plot while ${conflict.name} manufactures the conflict. The episode runs ${tone}. Finale: "${show.finaleSong}."`;
}

export function getShowChaosRating(show: MuppetShow): {
  label: string;
  score: number;
} {
  const slugs = [show.directorSlug, show.conflictSlug, ...show.castSlugs];
  const muppets = slugs.map((s) => getMuppet(s)).filter(Boolean) as Muppet[];
  if (muppets.length === 0) return { label: "Unknown", score: 0 };

  const avgChaos =
    muppets.reduce((sum, m) => sum + m.vector.chaosOrder, 0) / muppets.length;

  if (avgChaos <= -2.5) return { label: "Maximum chaos", score: avgChaos };
  if (avgChaos >= 2.5) return { label: "Boardroom tidy", score: avgChaos };
  return { label: "Controlled variety", score: avgChaos };
}

export function suggestDirectorFromResult(muppetSlug: string): string {
  return getMuppet(muppetSlug)?.slug ?? MUPPETS[0].slug;
}
