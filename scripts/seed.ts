/**
 * Seeds the JSON "database" in ./data with enough sample content that every
 * page has something to show on first run. Run with: npm run seed
 * Pass --force to wipe existing data first.
 */
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import { db } from "../src/lib/db";
import { matchMuppets } from "../src/lib/muppets";
import type {
  QuizResult,
  NewsComment,
  TriviaScore,
  NewsletterSignup,
  ContactMessage,
  TraitVector,
} from "../src/lib/types";

const DATA_DIR = path.join(process.cwd(), "data");
const force = process.argv.includes("--force");

async function main() {
  if (force && fs.existsSync(DATA_DIR)) {
    fs.rmSync(DATA_DIR, { recursive: true, force: true });
    console.log("Cleared existing data/ directory (--force).");
  }

  const existingResults = db.read<QuizResult>("quizResults");
  if (existingResults.length > 0 && !force) {
    console.log("data/quizResults.json already has content — skipping seed. Use --force to reset.");
    return;
  }

  const now = Date.now();
  const daysAgo = (n: number) => new Date(now - n * 24 * 60 * 60 * 1000).toISOString();

  const sampleVectors: { displayName: string; vector: TraitVector; daysBack: number }[] = [
    { displayName: "Robin F.", vector: { chaosOrder: 3, warmth: -2, ego: -2, energy: 1 }, daysBack: 38 },
    { displayName: "Anonymous Fan", vector: { chaosOrder: -4, warmth: 1, ego: 1, energy: 5 }, daysBack: 30 },
    { displayName: "Jordan", vector: { chaosOrder: -1, warmth: -3, ego: 4, energy: 4 }, daysBack: 25 },
    { displayName: "Sam K.", vector: { chaosOrder: 4, warmth: 4, ego: 2, energy: -3 }, daysBack: 20 },
    { displayName: "Anonymous Fan", vector: { chaosOrder: -3, warmth: -1, ego: -3, energy: 4 }, daysBack: 14 },
    { displayName: "Priya", vector: { chaosOrder: 2, warmth: -4, ego: -3, energy: 2 }, daysBack: 9 },
    { displayName: "Anonymous Fan", vector: { chaosOrder: -2, warmth: 0, ego: 3, energy: 3 }, daysBack: 5 },
    { displayName: "Theo", vector: { chaosOrder: -5, warmth: 2, ego: 1, energy: 5 }, daysBack: 2 },
  ];

  const quizResults: QuizResult[] = sampleVectors.map((entry) => {
    const { best, runnerUp } = matchMuppets(entry.vector);
    return {
      id: randomUUID(),
      createdAt: daysAgo(entry.daysBack),
      displayName: entry.displayName,
      vector: entry.vector,
      muppetSlug: best.slug,
      runnerUpSlug: runnerUp.slug,
      answers: [],
    };
  });
  db.write<QuizResult>("quizResults", quizResults);

  const newsComments: NewsComment[] = [
    {
      id: randomUUID(),
      createdAt: daysAgo(8),
      articleSlug: "why-chaos-order-theory-still-holds-up",
      authorName: "Priya",
      message: "The four-axis breakdown is such a good addition, the original theory always felt like it was missing something.",
    },
    {
      id: randomUUID(),
      createdAt: daysAgo(4),
      articleSlug: "meet-the-runner-ups",
      authorName: "Robin F.",
      message: "My runner-up was more accurate than my actual result, no notes.",
    },
  ];
  db.write<NewsComment>("newsComments", newsComments);

  const triviaScores: TriviaScore[] = [
    { id: randomUUID(), createdAt: daysAgo(11), playerName: "Priya", score: 8, totalQuestions: 8 },
    { id: randomUUID(), createdAt: daysAgo(7), playerName: "Robin F.", score: 6, totalQuestions: 8 },
    { id: randomUUID(), createdAt: daysAgo(3), playerName: "Jordan", score: 5, totalQuestions: 8 },
  ];
  db.write<TriviaScore>("triviaScores", triviaScores);

  const newsletterSignups: NewsletterSignup[] = [
    { id: randomUUID(), createdAt: daysAgo(20), email: "priya@example.com", favoriteMuppet: "rowlf" },
    { id: randomUUID(), createdAt: daysAgo(5), email: "theo@example.com", favoriteMuppet: "gonzo" },
  ];
  db.write<NewsletterSignup>("newsletterSignups", newsletterSignups);

  const contactMessages: ContactMessage[] = [
    {
      id: randomUUID(),
      createdAt: daysAgo(15),
      name: "Priya",
      email: "priya@example.com",
      topic: "fan-theory",
      message: "Have you considered adding a fifth axis for how someone handles a heckler? Statler & Waldorf deserve their own dimension.",
      handled: true,
    },
    {
      id: randomUUID(),
      createdAt: daysAgo(2),
      name: "Alex",
      email: "alex@example.com",
      topic: "bug-report",
      message: "The trivia leaderboard didn't show my score right after I submitted it — had to refresh.",
      handled: false,
    },
  ];
  db.write<ContactMessage>("contactMessages", contactMessages);

  db.write("orders", []);

  console.log("Seeded data/ with demo quiz results, comments, and scores.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
