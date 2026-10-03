import { TRAIT_AXES } from "@/lib/muppets";
import type { TraitVector } from "@/lib/types";

export function TraitBar({ axisKey, value }: { axisKey: (typeof TRAIT_AXES)[number]["key"]; value: number }) {
  const axis = TRAIT_AXES.find((a) => a.key === axisKey)!;
  const percent = ((value + 5) / 10) * 100;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs font-bold uppercase tracking-wide text-text-secondary">
        <span>{axis.low}</span>
        <span>{axis.high}</span>
      </div>
      <div className="relative h-4 w-full border-[3px] border-foreground bg-surface-alt">
        <div
          className="absolute top-1/2 h-5 w-5 -translate-y-1/2 -translate-x-1/2 border-[3px] border-foreground bg-primary"
          style={{ left: `${percent}%` }}
        />
      </div>
    </div>
  );
}

export function TraitBarGroup({ vector }: { vector: TraitVector }) {
  return (
    <div className="flex flex-col gap-5">
      {TRAIT_AXES.map((axis) => (
        <TraitBar key={axis.key} axisKey={axis.key} value={vector[axis.key]} />
      ))}
    </div>
  );
}
