import NavLinks from "@/components/NavLinks";
import { KERMIT_ILLUSTRATION } from "@/lib/illustrations";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-foreground bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 font-display text-lg font-normal whitespace-nowrap text-foreground sm:text-xl"
        >
          <span
            aria-hidden
            className="relative h-10 w-10 shrink-0 overflow-hidden border-[3px] border-foreground bg-white"
          >
            <Image
              src={KERMIT_ILLUSTRATION}
              alt=""
              fill
              className="object-cover object-center"
              sizes="40px"
            />
          </span>
          Muppet Personality
        </Link>

        <NavLinks />
      </div>
    </header>
  );
}
