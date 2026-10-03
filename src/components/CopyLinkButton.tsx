"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export default function CopyLinkButton({
  url,
  label = "Copy link",
  copiedLabel = "Link copied!",
  variant = "outline",
  className,
}: {
  url: string;
  label?: string;
  copiedLabel?: string;
  variant?: "primary" | "accent" | "secondary" | "outline" | "ghost";
  className?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);

  async function handleClick() {
    try {
      const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setError(false);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setError(true);
      setTimeout(() => setError(false), 2500);
    }
  }

  return (
    <Button type="button" variant={variant} className={className} onClick={handleClick}>
      {error ? "Copy failed" : copied ? copiedLabel : label}
    </Button>
  );
}
