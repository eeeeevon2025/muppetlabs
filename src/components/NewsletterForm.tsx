"use client";

import { useActionState, useEffect, useRef } from "react";
import { subscribeNewsletterAction, type NewsletterFormState } from "@/app/contact/actions";
import { Button, Field, TextInput, Select, FormNotice } from "@/components/ui";
import type { Muppet } from "@/lib/types";

export default function NewsletterForm({ muppets }: { muppets: Muppet[] }) {
  const [state, formAction, pending] = useActionState<NewsletterFormState, FormData>(
    subscribeNewsletterAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <Field label="Email" htmlFor="newsletter-email">
        <TextInput id="newsletter-email" name="email" type="email" required placeholder="you@example.com" />
      </Field>
      <Field label="Favorite Muppet (optional)" htmlFor="favoriteMuppet">
        <Select id="favoriteMuppet" name="favoriteMuppet" defaultValue="">
          <option value="">Prefer not to say</option>
          {muppets.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.name}
            </option>
          ))}
        </Select>
      </Field>

      {state?.error && <FormNotice kind="error" message={state.error} />}
      {state?.success && <FormNotice kind="success" message="Subscribed! Welcome aboard." />}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
