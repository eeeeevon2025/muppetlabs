import { db } from "@/lib/db";
import { getMuppet, vectorDistance } from "@/lib/muppets";
import type { CompareInvite, QuizResult } from "@/lib/types";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export function refreshCompareStatus(invite: CompareInvite): CompareInvite {
  if (invite.status === "complete") return invite;
  if (new Date(invite.expiresAt).getTime() < Date.now()) {
    return { ...invite, status: "expired" };
  }
  if (invite.guestResultId) {
    return { ...invite, status: "complete" };
  }
  return invite;
}

export function getCompareInvite(token: string): CompareInvite | null {
  const invite = db.findBy<CompareInvite>("compareInvites", (row) => row.token === token);
  if (!invite) return null;
  const refreshed = refreshCompareStatus(invite);
  if (refreshed.status !== invite.status) {
    db.update<CompareInvite>("compareInvites", invite.id, { status: refreshed.status });
  }
  return refreshed;
}

export function getCompareResults(invite: CompareInvite): {
  host: QuizResult;
  guest: QuizResult;
} | null {
  if (!invite.guestResultId) return null;
  const host = db.find<QuizResult>("quizResults", invite.hostResultId);
  const guest = db.find<QuizResult>("quizResults", invite.guestResultId);
  if (!host || !guest) return null;
  return { host, guest };
}

export interface CompatibilityVerdict {
  headline: string;
  summary: string;
  distance: number;
  sameMatch: boolean;
  duoLabel: string;
}

export function getCompatibilityVerdict(host: QuizResult, guest: QuizResult): CompatibilityVerdict {
  const hostMuppet = getMuppet(host.muppetSlug)!;
  const guestMuppet = getMuppet(guest.muppetSlug)!;
  const distance = vectorDistance(host.vector, guest.vector);
  const sameMatch = host.muppetSlug === guest.muppetSlug;

  if (sameMatch) {
    return {
      headline: "Same Muppet, same energy",
      summary: `Both of you landed on ${hostMuppet.name}. You're either soulmates or you're about to compete for the same dressing room.`,
      distance,
      sameMatch: true,
      duoLabel: "Mirror match",
    };
  }

  if (distance <= 3) {
    return {
      headline: "Near twins backstage",
      summary: `${hostMuppet.name} and ${guestMuppet.name} sit close on the trait map. You'll finish each other's punchlines — and each other's chaos.`,
      distance,
      sameMatch: false,
      duoLabel: "Kindred spirits",
    };
  }

  if (distance >= 9) {
    return {
      headline: "Opposites, on purpose",
      summary: `${hostMuppet.name} meets ${guestMuppet.name} — maximum contrast, maximum comedy. Someone has to hold the index cards.`,
      distance,
      sameMatch: false,
      duoLabel: "Chaos × Order",
    };
  }

  const hostChaos = host.vector.chaosOrder;
  const guestChaos = guest.vector.chaosOrder;
  if (Math.sign(hostChaos) !== Math.sign(guestChaos) && Math.abs(hostChaos) >= 2 && Math.abs(guestChaos) >= 2) {
    return {
      headline: "The classic duo",
      summary: `One of you runs the clipboard (${hostChaos > 0 ? hostMuppet.name : guestMuppet.name}), one of you runs the cannon (${hostChaos < 0 ? hostMuppet.name : guestMuppet.name}).`,
      distance,
      sameMatch: false,
      duoLabel: "Balanced act",
    };
  }

  return {
    headline: "Different icons, shared stage",
    summary: `${hostMuppet.name} and ${guestMuppet.name} aren't identical on the map, but that's what makes the bit work.`,
    distance,
    sameMatch: false,
    duoLabel: "Complementary cast",
  };
}

export function compareInviteUrl(token: string): string {
  return `/compare/${token}`;
}

export { INVITE_TTL_MS };
