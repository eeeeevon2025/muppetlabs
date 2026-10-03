import Image from "next/image";
import Link from "next/link";
import type { Muppet } from "@/lib/types";
import { getMuppetIllustration } from "@/lib/illustrations";
import { Card } from "@/components/ui";

export function MuppetAvatar({ muppet, size = 56 }: { muppet: Muppet; size?: number }) {
  const illustration = getMuppetIllustration(muppet.slug);

  if (illustration) {
    return (
      <div
        className="relative shrink-0 overflow-hidden border-[3px] border-foreground bg-white"
        style={{ width: size, height: size }}
        aria-hidden
      >
        <Image
          src={illustration}
          alt=""
          fill
          className="object-cover object-center"
          sizes={`${size}px`}
        />
      </div>
    );
  }

  const initials = muppet.name
    .split(" ")
    .filter((w) => !["the", "&"].includes(w.toLowerCase()))
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className="flex shrink-0 items-center justify-center border-[3px] border-foreground font-display font-bold"
      style={{
        backgroundColor: muppet.color,
        color: muppet.color === "#4ADE80" ? "#000000" : "#FFFFFF",
        width: size,
        height: size,
        fontSize: size * 0.36,
      }}
      aria-hidden
    >
      {initials}
    </div>
  );
}

export default function MuppetCard({ muppet }: { muppet: Muppet }) {
  return (
    <Link href={`/muppets/${muppet.slug}`} className="group block h-full">
      <Card className="flex h-full flex-col gap-3 p-0 transition group-hover:translate-x-0.5 group-hover:translate-y-0.5 group-hover:shadow-none">
        <div className="relative aspect-square w-full overflow-hidden border-b-[3px] border-foreground bg-white">
          {getMuppetIllustration(muppet.slug) ? (
            <Image
              src={getMuppetIllustration(muppet.slug)!}
              alt=""
              fill
              className="object-cover object-center transition group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <MuppetAvatar muppet={muppet} size={80} />
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 px-4 pb-4">
          <div>
            <p className="font-display text-lg font-normal leading-tight">{muppet.name}</p>
            <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
              {muppet.title}
            </p>
          </div>
          <p className="text-sm text-text-secondary">{muppet.tagline}</p>
        </div>
      </Card>
    </Link>
  );
}
