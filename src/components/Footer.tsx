import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t-[3px] border-foreground bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-lg font-normal">
              Muppet Personality Project
            </p>
            <p className="mt-2 text-sm text-background/70">
              An unofficial, not-for-profit fan project. Not affiliated with,
              endorsed by, or associated with The Muppets Studio or Disney.
            </p>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider">Explore</p>
            <ul className="mt-2 space-y-1 text-sm text-background/70">
              <li><Link href="/quiz" className="hover:text-primary">Take the Quiz</Link></li>
              <li><Link href="/compare" className="hover:text-primary">Compare with a Friend</Link></li>
              <li><Link href="/show" className="hover:text-primary">Build Your Show</Link></li>
              <li><Link href="/muppets" className="hover:text-primary">Muppet Directory</Link></li>
              <li><Link href="/theory" className="hover:text-primary">The Theory</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary">Leaderboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider">More</p>
            <ul className="mt-2 space-y-1 text-sm text-background/70">
              <li><Link href="/news" className="hover:text-accent">News</Link></li>
              <li><Link href="/trivia" className="hover:text-accent">Trivia Night</Link></li>
              <li><Link href="/store" className="hover:text-accent">Store</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-bold uppercase tracking-wider">Site</p>
            <ul className="mt-2 space-y-1 text-sm text-background/70">
              <li><Link href="/about" className="hover:text-primary">About &amp; Credits</Link></li>
              <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-8 border-t border-background/20 pt-6 text-xs text-background/50">
          © {new Date().getFullYear()} Muppet Personality Project. Fan-made
          demo site for personal, non-commercial use. All character names
          referenced belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
