"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitContactAction, type ContactFormState } from "@/app/contact/actions";
import { Button, Field, TextInput, Textarea, Select, FormNotice } from "@/components/ui";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState<ContactFormState, FormData>(
    submitContactAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" htmlFor="name">
          <TextInput id="name" name="name" required maxLength={80} />
        </Field>
        <Field label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" required />
        </Field>
      </div>
      <Field label="Topic" htmlFor="topic">
        <Select id="topic" name="topic" defaultValue="general">
          <option value="general">General question</option>
          <option value="press">Press</option>
          <option value="partnerships">Partnerships</option>
          <option value="bug-report">Bug report</option>
          <option value="fan-theory">Fan theory submission</option>
        </Select>
      </Field>
      <Field label="Message" htmlFor="message">
        <Textarea id="message" name="message" rows={5} required maxLength={2000} />
      </Field>

      {state?.error && <FormNotice kind="error" message={state.error} />}
      {state?.success && <FormNotice kind="success" message="Thanks — we'll get back to you soon." />}

      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  );
}
