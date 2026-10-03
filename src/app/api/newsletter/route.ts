import { NextResponse, type NextRequest } from "next/server";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { newsletterSchema } from "@/lib/validation";
import type { NewsletterSignup } from "@/lib/types";

// JSON API alternative to the /contact page's newsletter form — same validation and
// storage, for anything that wants to subscribe programmatically instead of via HTML form.
export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid payload." },
      { status: 422 },
    );
  }

  const existing = db
    .read<NewsletterSignup>("newsletterSignups")
    .find((s) => s.email.toLowerCase() === parsed.data.email.toLowerCase());
  if (existing) {
    return NextResponse.json({ status: "already subscribed" }, { status: 200 });
  }

  const signup: NewsletterSignup = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    email: parsed.data.email,
    favoriteMuppet: parsed.data.favoriteMuppet ?? null,
  };
  db.append<NewsletterSignup>("newsletterSignups", signup);

  return NextResponse.json({ status: "subscribed" }, { status: 201 });
}
