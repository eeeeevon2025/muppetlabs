"use server";

import { randomBytes, randomUUID } from "crypto";
import { db } from "@/lib/db";
import { INVITE_TTL_MS } from "@/lib/compare";
import { compareInviteSchema } from "@/lib/validation";
import type { CompareInvite, QuizResult } from "@/lib/types";

export type CreateCompareState =
  | { ok: true; token: string }
  | { ok: false; error: string };

export async function createCompareInvite(hostResultId: string): Promise<CreateCompareState> {
  const parsed = compareInviteSchema.safeParse({ hostResultId });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid result." };
  }

  const host = db.find<QuizResult>("quizResults", parsed.data.hostResultId);
  if (!host) {
    return { ok: false, error: "We couldn't find that quiz result." };
  }

  const token = randomBytes(6).toString("hex");
  const now = new Date();
  const invite: CompareInvite = {
    id: randomUUID(),
    token,
    createdAt: now.toISOString(),
    expiresAt: new Date(now.getTime() + INVITE_TTL_MS).toISOString(),
    hostResultId: host.id,
    guestResultId: null,
    status: "waiting",
  };

  db.append<CompareInvite>("compareInvites", invite);
  return { ok: true, token };
}

export async function linkGuestToCompare(
  token: string,
  guestResultId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const invite = db.findBy<CompareInvite>("compareInvites", (row) => row.token === token);
  if (!invite) {
    return { ok: false, error: "That compare link isn't valid." };
  }

  if (new Date(invite.expiresAt).getTime() < Date.now()) {
    db.update<CompareInvite>("compareInvites", invite.id, { status: "expired" });
    return { ok: false, error: "This compare invite expired." };
  }

  if (invite.guestResultId) {
    return { ok: true };
  }

  const guest = db.find<QuizResult>("quizResults", guestResultId);
  if (!guest) {
    return { ok: false, error: "Guest result not found." };
  }

  if (guest.id === invite.hostResultId) {
    return { ok: false, error: "You can't compare with yourself — send the link to a friend." };
  }

  db.update<CompareInvite>("compareInvites", invite.id, {
    guestResultId: guest.id,
    status: "complete",
  });

  return { ok: true };
}
