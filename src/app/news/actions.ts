"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getArticle } from "@/lib/news";
import { newsCommentSchema } from "@/lib/validation";
import type { NewsComment } from "@/lib/types";

export type NewsCommentFormState = { error?: string; success?: boolean } | undefined;

export async function addNewsCommentAction(
  articleSlug: string,
  _prevState: NewsCommentFormState,
  formData: FormData,
): Promise<NewsCommentFormState> {
  if (!getArticle(articleSlug)) {
    return { error: "That article doesn't exist." };
  }

  const parsed = newsCommentSchema.safeParse({
    authorName: formData.get("authorName"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your comment and try again." };
  }

  const comment: NewsComment = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    articleSlug,
    authorName: parsed.data.authorName,
    message: parsed.data.message,
  };

  db.append<NewsComment>("newsComments", comment);
  revalidatePath(`/news/${articleSlug}`);
  return { success: true };
}
