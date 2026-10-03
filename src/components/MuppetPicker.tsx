"use client";

import type { Muppet } from "@/lib/types";
import { MuppetAvatar } from "@/components/MuppetCard";

export default function MuppetPicker({
  muppets,
  selected,
  onToggle,
  disabledSlugs = [],
  max,
}: {
  muppets: Muppet[];
  selected: string[];
  onToggle: (slug: string) => void;
  disabledSlugs?: string[];
  max?: number;
}) {
  const atMax = max != null && selected.length >= max;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {muppets.map((muppet) => {
        const isSelected = selected.includes(muppet.slug);
        const isDisabled = disabledSlugs.includes(muppet.slug) || (atMax && !isSelected);

        return (
          <button
            key={muppet.slug}
            type="button"
            disabled={isDisabled}
            onClick={() => onToggle(muppet.slug)}
            className={`flex items-start gap-3 border-[3px] p-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
              isSelected
                ? "border-foreground bg-primary brutal-shadow-sm"
                : "border-foreground bg-surface hover:bg-surface-alt"
            }`}
          >
            <MuppetAvatar muppet={muppet} size={48} />
            <div className="min-w-0 flex-1">
              <p className="font-display text-base font-normal leading-tight">{muppet.name}</p>
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {muppet.title}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
