"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createCompareInvite } from "@/app/compare/actions";
import { Button, FormNotice } from "@/components/ui";

export default function CreateCompareInviteButton({ hostResultId }: { hostResultId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await createCompareInvite(hostResultId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/compare/${result.token}`);
    });
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button type="button" variant="accent" onClick={handleClick} disabled={isPending}>
        {isPending ? "Creating invite..." : "Compare with a friend"}
      </Button>
      {error && <FormNotice kind="error" message={error} />}
    </div>
  );
}
