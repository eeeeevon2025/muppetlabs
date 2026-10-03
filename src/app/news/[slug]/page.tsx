import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NEWS_ARTICLES, getArticle } from "@/lib/news";
import { db } from "@/lib/db";
import type { NewsComment } from "@/lib/types";
import { Card } from "@/components/ui";
import NewsCommentForm from "@/components/NewsCommentForm";

export function generateStaticParams() {
  return NEWS_ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return { title: article.title, description: article.excerpt };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const comments = db
    .read<NewsComment>("newsComments")
    .filter((c) => c.articleSlug === slug)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <Link href="/news" className="link-brutal text-sm">
        ← Back to news
      </Link>

      <p className="mt-4 text-xs font-bold uppercase tracking-wider text-text-secondary">
        {new Date(article.publishedAt).toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}{" "}
        · {article.author}
      </p>
      <h1 className="font-display mt-1 text-3xl font-normal sm:text-4xl">{article.title}</h1>

      <div className="mt-6 flex flex-col gap-4 text-text-secondary">
        {article.body.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <h2 className="font-display mt-14 text-xl font-normal">
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      <Card className="mt-4">
        <NewsCommentForm articleSlug={slug} />
      </Card>

      <div className="mt-6 flex flex-col gap-3">
        {comments.map((c) => (
          <Card key={c.id} className="gap-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold">{c.authorName}</span>
              <span className="text-xs text-text-secondary">
                {new Date(c.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
              </span>
            </div>
            <p className="text-sm text-text-secondary">{c.message}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
