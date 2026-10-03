import type { QuizQuestion } from "@/lib/types";

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "backstage-chaos",
    prompt: "Backstage, five minutes before curtain, something is on fire (again). You:",
    options: [
      { id: "a", label: "Grab the fire extinguisher and a clipboard, in that order", effects: { chaosOrder: 3, energy: 1 } },
      { id: "b", label: "Add it to the show — the audience will love it", effects: { chaosOrder: -4, energy: 2 } },
      { id: "c", label: "Deliver a passionate speech about fire safety standards", effects: { chaosOrder: 4, warmth: 4, ego: 1 } },
      { id: "d", label: "Scream once, then keep doing exactly what you were doing", effects: { chaosOrder: -3, energy: 4, warmth: -1 } },
    ],
  },
  {
    id: "spotlight",
    prompt: "How do you feel about the spotlight?",
    options: [
      { id: "a", label: "It should be on someone more talented, but fine, hand it over", effects: { ego: -3, warmth: -3 } },
      { id: "b", label: "I *am* the spotlight. It was invented for me.", effects: { ego: 5, energy: 3 } },
      { id: "c", label: "I'll take it if nobody else is going to organize this", effects: { ego: -1, chaosOrder: 2 } },
      { id: "d", label: "Can I heckle from the balcony instead?", effects: { ego: 2, warmth: 5, energy: -3 } },
    ],
  },
  {
    id: "criticism",
    prompt: "Someone in the front row just booed. What now?",
    options: [
      { id: "a", label: "That's fair, actually. Let me try the bit again but worse.", effects: { warmth: -4, ego: -3 } },
      { id: "b", label: "They will be dealt with. Personally. After the show.", effects: { ego: 4, chaosOrder: -1, energy: 2 } },
      { id: "c", label: "Note it on the clipboard for the post-show debrief", effects: { chaosOrder: 4, warmth: 1 } },
      { id: "d", label: "Boo them back, louder, immediately", effects: { energy: 5, chaosOrder: -3, warmth: 0 } },
    ],
  },
  {
    id: "friday-night",
    prompt: "Your ideal Friday night is:",
    options: [
      { id: "a", label: "A quiet set at the piano, nobody needs to talk", effects: { energy: -4, chaosOrder: 2, warmth: 2 } },
      { id: "b", label: "Whatever stunt hasn't been attempted before, cannon optional", effects: { energy: 4, chaosOrder: -5 } },
      { id: "c", label: "Organizing next week's schedule so nothing goes wrong (it will anyway)", effects: { chaosOrder: 5, ego: -1 } },
      { id: "d", label: "Being the center of a party I definitely did not RSVP to", effects: { ego: 4, energy: 3, chaosOrder: -2 } },
    ],
  },
  {
    id: "teamwork",
    prompt: "A teammate's plan is, generously, a bad plan. You:",
    options: [
      { id: "a", label: "Support it enthusiastically anyway — their heart's in the right place", effects: { warmth: -4, chaosOrder: -1 } },
      { id: "b", label: "Rewrite it into a better plan without telling anyone", effects: { chaosOrder: 4, ego: 1 } },
      { id: "c", label: "Deliver a formal, well-cited objection", effects: { warmth: 5, chaosOrder: 3, ego: 2 } },
      { id: "d", label: "Say 'I know a guy' who can fix it, quietly take a cut", effects: { ego: 2, chaosOrder: -2, energy: 1 } },
    ],
  },
  {
    id: "compliment",
    prompt: "Someone compliments your work. Your honest internal reaction:",
    options: [
      { id: "a", label: "MEEP.", effects: { ego: -4, energy: 3, warmth: -2 } },
      { id: "b", label: "Obviously. Tell your friends.", effects: { ego: 5, warmth: -1 } },
      { id: "c", label: "That's... surprisingly nice, thank you, truly", effects: { warmth: -4, ego: -2 } },
      { id: "d", label: "Was that sarcasm? I'll allow it, provisionally.", effects: { warmth: 5, ego: 1, energy: -2 } },
    ],
  },
  {
    id: "problem-solving",
    prompt: "When a real problem shows up, your first move is:",
    options: [
      { id: "a", label: "Run an experiment. Consequences are data.", effects: { chaosOrder: 4, warmth: 3, energy: 0 } },
      { id: "b", label: "Improvise something loud and hope for the best", effects: { chaosOrder: -4, energy: 3 } },
      { id: "c", label: "Make a list. Then make a list about the list.", effects: { chaosOrder: 5, ego: -2 } },
      { id: "d", label: "Deploy immense charisma until the problem gives up", effects: { ego: 4, energy: 2, chaosOrder: -1 } },
    ],
  },
  {
    id: "downtime",
    prompt: "In your downtime, people usually find you:",
    options: [
      { id: "a", label: "Quietly playing something on an instrument, unbothered", effects: { energy: -4, warmth: 1 } },
      { id: "b", label: "Mid-rant about a principle nobody else cares about", effects: { warmth: 4, ego: 2, chaosOrder: 3 } },
      { id: "c", label: "Telling a joke that isn't landing, and trying again anyway", effects: { warmth: -4, ego: -3, energy: 2 } },
      { id: "d", label: "Somewhere unexpected, doing something nobody signed off on", effects: { chaosOrder: -5, energy: 3 } },
    ],
  },
  {
    id: "conflict",
    prompt: "Two friends are fighting. You:",
    options: [
      { id: "a", label: "Mediate calmly, with an index card of talking points", effects: { chaosOrder: 3, warmth: -1, ego: -1 } },
      { id: "b", label: "Pick a side loudly and dramatically, no regrets", effects: { ego: 3, energy: 3, warmth: -1 } },
      { id: "c", label: "Offer a snack. Somehow it helps.", effects: { warmth: -3, chaosOrder: 1 } },
      { id: "d", label: "Point out, correctly, that you predicted this exact fight", effects: { warmth: 5, energy: -2 } },
    ],
  },
  {
    id: "self-description",
    prompt: "Pick the phrase that fits you best:",
    options: [
      { id: "a", label: "\"Reluctantly in charge\"", effects: { chaosOrder: 2, ego: -1, warmth: -2 } },
      { id: "b", label: "\"Icon, legend, star\"", effects: { ego: 5, energy: 2 } },
      { id: "c", label: "\"Professionally unimpressed\"", effects: { warmth: 5, energy: -3 } },
      { id: "d", label: "\"Whatever-I-am, and proud of it\"", effects: { chaosOrder: -5, ego: 1, energy: 4 } },
    ],
  },
  {
    id: "risk",
    prompt: "How do you feel about being launched out of a cannon, hypothetically?",
    options: [
      { id: "a", label: "Absolutely, immediately, where do I stand", effects: { chaosOrder: -5, energy: 5, ego: 1 } },
      { id: "b", label: "Only after I've triple-checked the math myself", effects: { chaosOrder: 4, energy: -1 } },
      { id: "c", label: "I'll be launched if it's for someone else's experiment, again", effects: { ego: -4, warmth: -1, energy: 3 } },
      { id: "d", label: "A cannon? For me? I mean, I *am* worth the gunpowder.", effects: { ego: 4, energy: 2 } },
    ],
  },
  {
    id: "legacy",
    prompt: "What do you want people to remember about you?",
    options: [
      { id: "a", label: "That I held it together when nobody else would", effects: { chaosOrder: 3, ego: -2, warmth: -1 } },
      { id: "b", label: "That I never once compromised on my principles", effects: { warmth: 5, chaosOrder: 4, ego: 2 } },
      { id: "c", label: "That the show, whatever it was, was never boring around me", effects: { chaosOrder: -4, energy: 4 } },
      { id: "d", label: "That I loved my people loudly and completely", effects: { warmth: -5, ego: 2, energy: 2 } },
    ],
  },
];
