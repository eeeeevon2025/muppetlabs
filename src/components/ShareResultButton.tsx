"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function ShareResultButton() {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Button type="button" variant="outline" onClick={handleClick}>
      {copied ? "Link copied!" : "Copy share link"}
    </Button>
  );
}
