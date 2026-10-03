import type { Metadata } from "next";
import Link from "next/link";
import { NEWS_ARTICLES } from "@/lib/news";
import { Badge, Card } from "@/components/ui";

export const metadata: Metadata = {
  title: "News",
  description: "Editorial takes on the theory, the cast, and the site itself.",
};

export default function NewsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      <Badge color="var(--accent)">News</Badge>
      <h1 className="font-display mt-4 text-4xl font-normal sm:text-5xl">From the editorial desk</h1>
      <p className="mt-3 text-lg text-text-secondary">
        Theory deep-dives, cast profiles, and the occasional opinion piece.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        {NEWS_ARTICLES.map((article) => (
          <Link key={article.slug} href={`/news/${article.slug}`}>
            <Card className="transition hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none">
              <p className="text-xs font-bold uppercase tracking-wider text-text-secondary">
                {new Date(article.publishedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}
                · {article.author}
              </p>
              <h2 className="font-display mt-1 text-xl font-normal">{article.title}</h2>
              <p className="mt-2 text-sm text-text-secondary">{article.excerpt}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
