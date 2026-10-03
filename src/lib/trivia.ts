export interface TriviaQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
}

export const TRIVIA_QUESTIONS: TriviaQuestion[] = [
  {
    id: "t1",
    prompt: "In our four-axis theory, which trait measures how much of the room someone needs?",
    options: ["Chaos ↔ Order", "Ego", "Energy", "Warmth"],
    correctIndex: 1,
  },
  {
    id: "t2",
    prompt: "Which archetype is famous for running the whole production off a single clipboard?",
    options: ["Gonzo the Great", "Scooter", "Animal", "Pepe the King Prawn"],
    correctIndex: 1,
  },
  {
    id: "t3",
    prompt: "Who delivers the verdict on every act from the balcony, every single week, forever?",
    options: ["Sam the Eagle", "Statler & Waldorf", "Rizzo", "Dr. Bunsen Honeydew"],
    correctIndex: 1,
  },
  {
    id: "t4",
    prompt: "On the Chaos ↔ Order axis, a score of -5 means:",
    options: ["Maximum order", "Perfectly balanced", "Maximum chaos", "Off the scale entirely"],
    correctIndex: 2,
  },
  {
    id: "t5",
    prompt: "Whose catchphrase is essentially just one syllable, repeated, at volume?",
    options: ["Beaker", "Kermit", "Miss Piggy", "Rowlf"],
    correctIndex: 0,
  },
  {
    id: "t6",
    prompt: "According to the site's theory article, what does your runner-up match represent?",
    options: [
      "A calculation error",
      "Who you are on a normal day",
      "Who you become after two coffees, or none",
      "Nothing — it's discarded",
    ],
    correctIndex: 2,
  },
  {
    id: "t7",
    prompt: "Which archetype treats every disagreement as a professional performance review they will win?",
    options: ["Fozzie Bear", "Miss Piggy", "Beaker", "Rowlf"],
    correctIndex: 1,
  },
  {
    id: "t8",
    prompt: "Who is the self-appointed standards committee for the entire show?",
    options: ["Sam the Eagle", "Scooter", "Swedish Chef", "Gonzo the Great"],
    correctIndex: 0,
  },
];
