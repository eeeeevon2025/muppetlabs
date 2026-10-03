"use client";

import { useActionState, useEffect, useRef } from "react";
import { addNewsCommentAction, type NewsCommentFormState } from "@/app/news/actions";
import { Button, Field, TextInput, Textarea, FormNotice } from "@/components/ui";

export default function NewsCommentForm({ articleSlug }: { articleSlug: string }) {
  const boundAction = addNewsCommentAction.bind(null, articleSlug);
  const [state, formAction, pending] = useActionState<NewsCommentFormState, FormData>(
    boundAction,
    undefined,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-3">
      <Field label="Your name" htmlFor="authorName">
        <TextInput id="authorName" name="authorName" required maxLength={60} />
      </Field>
      <Field label="Comment" htmlFor="message">
        <Textarea id="message" name="message" rows={3} required maxLength={600} />
      </Field>
      {state?.error && <FormNotice kind="error" message={state.error} />}
      {state?.success && <FormNotice kind="success" message="Comment posted." />}
      <Button type="submit" disabled={pending} className="self-start">
        {pending ? "Posting..." : "Post comment"}
      </Button>
    </form>
  );
}
