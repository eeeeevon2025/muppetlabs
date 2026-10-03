"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/quiz", label: "Quiz" },
  { href: "/compare", label: "Compare" },
  { href: "/show", label: "Show" },
  { href: "/muppets", label: "Muppets" },
  { href: "/theory", label: "Theory" },
  { href: "/news", label: "News" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/trivia", label: "Trivia" },
  { href: "/store", label: "Store" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
];

function NavLink({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  return (
    <Link
      href={href}
      className={`whitespace-nowrap border-[3px] px-3 py-1.5 text-sm font-bold uppercase tracking-wide transition-colors ${
        active
          ? "border-foreground bg-primary text-foreground"
          : "border-transparent text-text-secondary hover:border-foreground hover:bg-surface-alt hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

export default function NavLinks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="lg:hidden border-[3px] border-foreground bg-surface px-3 py-1.5 text-sm font-bold uppercase tracking-wide brutal-shadow-sm"
        aria-expanded={open}
        aria-controls="primary-nav"
      >
        Menu
      </button>
      <nav
        id="primary-nav"
        className={`${
          open ? "flex" : "hidden"
        } lg:flex absolute lg:static right-0 top-full mt-2 lg:mt-0 z-40 w-56 lg:w-auto flex-col lg:flex-row lg:flex-nowrap gap-1 border-[3px] lg:border-0 border-foreground bg-surface lg:bg-transparent p-3 lg:p-0 items-stretch lg:items-center brutal-shadow lg:shadow-none`}
      >
        {LINKS.map((link) => (
          <NavLink key={link.href} {...link} />
        ))}
      </nav>
    </div>
  );
}
