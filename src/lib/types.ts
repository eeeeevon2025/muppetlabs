export type TraitAxis = "chaosOrder" | "warmth" | "ego" | "energy";

export type TraitVector = Record<TraitAxis, number>;

export interface Muppet {
  slug: string;
  name: string;
  title: string;
  color: string;
  vector: TraitVector;
  tagline: string;
  bio: string;
  strengths: string[];
  quirks: string[];
  quote: string;
}

export interface QuizOption {
  id: string;
  label: string;
  effects: Partial<TraitVector>;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  helpText?: string;
  options: QuizOption[];
}

export interface QuizAnswerRecord {
  questionId: string;
  optionId: string;
}

export interface QuizResult {
  id: string;
  createdAt: string;
  displayName: string;
  vector: TraitVector;
  muppetSlug: string;
  runnerUpSlug: string;
  answers: QuizAnswerRecord[];
}

export interface NewsletterSignup {
  id: string;
  createdAt: string;
  email: string;
  favoriteMuppet: string | null;
}

export interface ContactMessage {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  handled: boolean;
}

export interface NewsComment {
  id: string;
  createdAt: string;
  articleSlug: string;
  authorName: string;
  message: string;
}

export interface TriviaScore {
  id: string;
  createdAt: string;
  playerName: string;
  score: number;
  totalQuestions: number;
}

export interface CartItem {
  productSlug: string;
  quantity: number;
}

export interface Order {
  id: string;
  createdAt: string;
  items: CartItem[];
  totalCents: number;
  shippingName: string;
  shippingAddress: string;
  shippingCity: string;
  shippingPostalCode: string;
  email: string;
}

export type CompareInviteStatus = "waiting" | "complete" | "expired";

export interface CompareInvite {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  hostResultId: string;
  guestResultId: string | null;
  status: CompareInviteStatus;
}

export interface MuppetShow {
  id: string;
  createdAt: string;
  creatorName: string;
  showTitle: string;
  episodeTitle: string;
  directorSlug: string;
  castSlugs: string[];
  conflictSlug: string;
  finaleSong: string;
  hostResultId: string | null;
}
