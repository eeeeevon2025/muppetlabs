import { z } from "zod";

export const signupSchema = z.object({
  displayName: z.string().trim().min(2, "Use at least 2 characters").max(60),
  email: z.string().trim().toLowerCase().email("That doesn't look like an email"),
  password: z.string().min(8, "Use at least 8 characters").max(200),
});

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("That doesn't look like an email"),
  password: z.string().min(1, "Password is required"),
});

export const profileUpdateSchema = z.object({
  displayName: z.string().trim().min(2).max(60),
  bio: z.string().trim().max(500).optional().default(""),
});

export const communityPostSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(60),
  message: z.string().trim().min(3, "Say a little more than that").max(600),
  muppetSlug: z.string().trim().max(60).optional().nullable(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("That doesn't look like an email"),
  topic: z.enum(["general", "press", "partnerships", "bug-report", "fan-theory"]),
  message: z.string().trim().min(10, "Give us a bit more detail").max(2000),
});

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email("That doesn't look like an email"),
  favoriteMuppet: z.string().trim().max(60).optional().nullable(),
});

export const newsCommentSchema = z.object({
  authorName: z.string().trim().min(1, "Name is required").max(60),
  message: z.string().trim().min(2, "Say a little more than that").max(600),
});

export const triviaSubmissionSchema = z.object({
  playerName: z.string().trim().min(1, "Name is required").max(60),
  score: z.number().int().min(0),
  totalQuestions: z.number().int().min(1),
});

export const checkoutSchema = z.object({
  shippingName: z.string().trim().min(1, "Name is required").max(80),
  email: z.string().trim().toLowerCase().email("That doesn't look like an email"),
  shippingAddress: z.string().trim().min(3, "Address is required").max(200),
  shippingCity: z.string().trim().min(1, "City is required").max(100),
  shippingPostalCode: z.string().trim().min(1, "Postal code is required").max(20),
});

export const quizSubmissionSchema = z.object({
  displayName: z.string().trim().min(1).max(60).optional().default("Anonymous Fan"),
  answers: z
    .array(
      z.object({
        questionId: z.string().min(1),
        optionId: z.string().min(1),
      }),
    )
    .min(1),
  compareToken: z.string().trim().min(8).max(64).optional(),
});

export const compareInviteSchema = z.object({
  hostResultId: z.string().uuid("Invalid result id"),
});

export const muppetShowSchema = z.object({
  creatorName: z.string().trim().min(1, "Name is required").max(60),
  showTitle: z.string().trim().min(2, "Give your show a title").max(80),
  episodeTitle: z.string().trim().min(2, "Name this episode").max(100),
  directorSlug: z.string().min(1),
  castSlugs: z.array(z.string().min(1)).min(3, "Pick at least 3 cast members").max(4),
  conflictSlug: z.string().min(1, "Pick a conflict character"),
  finaleSong: z.string().trim().min(2, "Name the finale song").max(100),
  hostResultId: z.string().uuid().optional().nullable(),
});
