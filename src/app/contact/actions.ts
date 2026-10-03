"use server";

import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { contactSchema, newsletterSchema } from "@/lib/validation";
import type { ContactMessage, NewsletterSignup } from "@/lib/types";

export type ContactFormState = { error?: string; success?: boolean } | undefined;

export async function submitContactAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    topic: formData.get("topic"),
    message: formData.get("message"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check your message and try again." };
  }

  const message: ContactMessage = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    handled: false,
    ...parsed.data,
  };

  db.append<ContactMessage>("contactMessages", message);
  return { success: true };
}

export type NewsletterFormState = { error?: string; success?: boolean } | undefined;

export async function subscribeNewsletterAction(
  _prevState: NewsletterFormState,
  formData: FormData,
): Promise<NewsletterFormState> {
  const rawFavorite = formData.get("favoriteMuppet");
  const parsed = newsletterSchema.safeParse({
    email: formData.get("email"),
    favoriteMuppet: rawFavorite ? String(rawFavorite) : null,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Enter a valid email." };
  }

  const existing = db
    .read<NewsletterSignup>("newsletterSignups")
    .find((s) => s.email.toLowerCase() === parsed.data.email.toLowerCase());
  if (existing) {
    return { success: true };
  }

  const signup: NewsletterSignup = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    email: parsed.data.email,
    favoriteMuppet: parsed.data.favoriteMuppet ?? null,
  };
  db.append<NewsletterSignup>("newsletterSignups", signup);
  return { success: true };
}
