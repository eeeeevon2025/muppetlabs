import type { Muppet, TraitAxis, TraitVector } from "@/lib/types";

/**
 * Trait axes, each roughly -5 to +5:
 *  - chaosOrder: -5 pure chaos agent ... +5 methodical and orderly
 *  - warmth:     -5 sincere / heart-on-sleeve ... +5 dry, detached, deadpan
 *  - ego:        -5 humble / self-effacing ... +5 diva / center of attention
 *  - energy:     -5 calm / low-key ... +5 frenetic / maximum volume
 */
export const TRAIT_AXES: {
  key: TraitAxis;
  label: string;
  low: string;
  high: string;
}[] = [
  { key: "chaosOrder", label: "Chaos ↔ Order", low: "Chaos", high: "Order" },
  { key: "warmth", label: "Sincerity ↔ Detachment", low: "Sincere", high: "Deadpan" },
  { key: "ego", label: "Humility ↔ Ego", low: "Humble", high: "Diva" },
  { key: "energy", label: "Calm ↔ Frenetic", low: "Calm", high: "Frenetic" },
];

export const MUPPETS: Muppet[] = [
  {
    slug: "kermit",
    name: "Kermit the Frog",
    title: "The Reluctant Ringleader",
    color: "#4ADE80",
    vector: { chaosOrder: 2, warmth: -3, ego: -1, energy: 1 },
    tagline: "It's not easy being the only sane frog in the room.",
    bio: "Kermit holds the whole variety show together with index cards, patience, and a steadily fraying grip on his own blood pressure. He didn't ask to be in charge — he just happened to be the one still standing when everyone else wandered off to set something on fire.",
    strengths: ["Keeps the show on schedule (mostly)", "Diplomatic under pressure", "Genuinely believes in everyone else's act"],
    quirks: ["Sighs audibly before saying yes to anything", "Keeps a running mental list of things that are definitely going to go wrong tonight"],
    quote: "Time's up, folks — we're moving on!",
  },
  {
    slug: "miss-piggy",
    name: "Miss Piggy",
    title: "The Icon",
    color: "#FF2264",
    vector: { chaosOrder: -2, warmth: -2, ego: 5, energy: 4 },
    tagline: "There is no room. There is only her room, and you are visiting it.",
    bio: "Miss Piggy enters every scene as though the scene had been waiting for her, because it had. She loves fiercely, negotiates ruthlessly, and treats every disagreement as a professional performance review she is guaranteed to win.",
    strengths: ["Unshakeable self-belief", "Fights for the people (frog) she loves", "Turns any room into her stage"],
    quirks: ["Refers to herself in the third person when it's warranted, which is often", "Has a karate chop ready at all times"],
    quote: "Never eat more than you can lift.",
  },
  {
    slug: "fozzie-bear",
    name: "Fozzie Bear",
    title: "The Optimist With a Wocka Wocka",
    color: "#FF2264",
    vector: { chaosOrder: -1, warmth: -4, ego: -3, energy: 3 },
    tagline: "The joke didn't land. He's already on the next one.",
    bio: "Fozzie tells the bit even when the room has made it very clear the bit is not working, because somewhere out there is the version of the audience that will love it. He is the most sincerely hopeful person in any building he enters.",
    strengths: ["Unstoppable resilience", "Wants everyone to have a good time, genuinely", "Never holds a grudge over a bad crowd"],
    quirks: ["Checks in mid-joke to see if you're still with him", "Owns several props no one asked for"],
    quote: "Wocka wocka!",
  },
  {
    slug: "gonzo",
    name: "Gonzo the Great",
    title: "The Whatever-He-Is",
    color: "#FF2264",
    vector: { chaosOrder: -5, warmth: 1, ego: 1, energy: 5 },
    tagline: "He was going to be launched out of a cannon anyway. Might as well add fireworks.",
    bio: "Gonzo does not perform stunts because they will succeed. He performs them because the attempt itself is the art. Species unclear, commitment absolute.",
    strengths: ["Total creative fearlessness", "Loyal to chickens and friends in equal measure", "Never once asked 'is this a good idea'"],
    quirks: ["Answers 'what are you' with a shrug and a grin", "Considers safety gear optional"],
    quote: "I'll do it! I'll do the death-defying whatever-it-is!",
  },
  {
    slug: "animal",
    name: "Animal",
    title: "The Id",
    color: "#4ADE80",
    vector: { chaosOrder: -5, warmth: 0, ego: 0, energy: 5 },
    tagline: "WOMAN! DRUMS! FOOD! In that order, or all at once.",
    bio: "Animal experiences the world at full volume and zero filter. There is no thought so small it doesn't deserve to be shouted, and no drum kit so nearby it doesn't deserve to be hit.",
    strengths: ["Pure unfiltered enthusiasm", "Incredible stamina behind a drum kit", "Says exactly what he means, always"],
    quirks: ["Needs to be physically restrained near cake", "Communicates mostly in nouns"],
    quote: "MUST EAT DRUMS! I MEAN... PLAY DRUMS!",
  },
  {
    slug: "rowlf",
    name: "Rowlf the Dog",
    title: "The House Musician",
    color: "#FF2264",
    vector: { chaosOrder: 3, warmth: 2, ego: -2, energy: -3 },
    tagline: "He's seen everything happen backstage, and he's not going to make it weird by reacting.",
    bio: "Rowlf plays the piano, offers the one calm observation in a scene full of noise, and generally seems like the only one who read the itinerary. His humor is dry enough to double as kindling.",
    strengths: ["Reliable, unflappable presence", "Genuinely talented, no notes", "Great advice, rarely asked for"],
    quirks: ["Deadpans even his compliments", "Never seems surprised by anything"],
    quote: "Nothing wrong with quiet. Try it sometime.",
  },
  {
    slug: "scooter",
    name: "Scooter",
    title: "The One Who Actually Knows Where Everything Is",
    color: "#4ADE80",
    vector: { chaosOrder: 4, warmth: -1, ego: -2, energy: 2 },
    tagline: "The show would not start on time, or at all, without him.",
    bio: "Scooter runs the clipboard, the callsheet, and half the building from memory. He is enthusiastic about being useful in a way that borders on a personality trait of its own.",
    strengths: ["Genuinely organized", "Anticipates problems before they happen", "Cheerfully takes on more than his job description"],
    quirks: ["Name-drops his uncle when leverage is needed", "Answers 'got it' before hearing the whole request"],
    quote: "Places, everyone! We go live in five!",
  },
  {
    slug: "statler-and-waldorf",
    name: "Statler & Waldorf",
    title: "The Peanut Gallery",
    color: "#FF2264",
    vector: { chaosOrder: 2, warmth: 5, ego: 2, energy: -2 },
    tagline: "They have never once enjoyed the show. They have never once missed it.",
    bio: "From the balcony, every act gets a verdict, and the verdict is rarely kind. And yet, week after week, there they are — front row seats to their own favorite hobby: complaining about the thing they love.",
    strengths: ["Devastatingly precise wit", "Consistent, if you count showing up every week as consistency", "Say the thing everyone else is thinking"],
    quirks: ["Laugh only at each other's jokes, never anyone else's", "Have opinions about acts that haven't started yet"],
    quote: "That was terrible! Bring it back!",
  },
  {
    slug: "swedish-chef",
    name: "Swedish Chef",
    title: "The Culinary Force of Nature",
    color: "#FF2264",
    vector: { chaosOrder: -4, warmth: 2, ego: -1, energy: 4 },
    tagline: "Nobody understands a word he says, and yet the recipe is somehow followed.",
    bio: "Ingredients enter the kitchen. Something happens, usually involving significant airtime for at least one vegetable. A dish emerges, or a small fire does. Either way, it was made with total commitment.",
    strengths: ["Fearless improvisation", "Endless enthusiasm for the process", "Never once apologizes for the chaos"],
    quirks: ["Speaks a language that is 90% 'bork'", "Treats whisks as percussion instruments"],
    quote: "Börk börk börk!",
  },
  {
    slug: "bunsen-honeydew",
    name: "Dr. Bunsen Honeydew",
    title: "The Scientist Who Skipped the Safety Briefing",
    color: "#FF2264",
    vector: { chaosOrder: 4, warmth: 3, ego: 1, energy: 0 },
    tagline: "The hypothesis was sound. The test subject was Beaker. Both facts are related.",
    bio: "Bunsen approaches the universe as a series of experiments to be run, results pending, consequences someone else's problem — usually his loyal, long-suffering assistant's.",
    strengths: ["Methodical, rigorous thinking", "Endlessly curious", "Unwavering belief in the scientific process"],
    quirks: ["Consistently underestimates blast radius", "Introduces every invention with total confidence"],
    quote: "Well, this is completely safe... probably.",
  },
  {
    slug: "beaker",
    name: "Beaker",
    title: "The Lab Assistant Who Deserves a Raise",
    color: "#4ADE80",
    vector: { chaosOrder: -3, warmth: -2, ego: -4, energy: 4 },
    tagline: "Meep meep meep MEEP.",
    bio: "Beaker shows up to work every day knowing the odds, and shows up anyway. He is the most sympathetic figure in any lab, mostly because he is also the one on fire in it.",
    strengths: ["Extraordinary bravery, whether he wants it or not", "Deeply loyal to Bunsen despite everything", "Communicates volumes with one syllable"],
    quirks: ["Flinches preemptively, correctly, before anything even happens", "Keeps volunteering anyway"],
    quote: "Meep!",
  },
  {
    slug: "sam-eagle",
    name: "Sam the Eagle",
    title: "The Self-Appointed Standards Committee",
    color: "#FF2264",
    vector: { chaosOrder: 5, warmth: 5, ego: 3, energy: -3 },
    tagline: "Someone has to maintain the dignity of this production. He has appointed himself.",
    bio: "Sam believes deeply in decorum, tradition, and the moral seriousness of live variety entertainment, all of which are under constant assault by literally every other performer in the building.",
    strengths: ["Unwavering principles", "Says what he believes, consequences aside", "Genuinely wants the show to mean something"],
    quirks: ["Files a formal objection at least once per scene", "Cannot relax, has never relaxed, will not start now"],
    quote: "This is not what this great nation of ours was founded on!",
  },
  {
    slug: "rizzo",
    name: "Rizzo the Rat",
    title: "The Guy With a Guy for That",
    color: "#4ADE80",
    vector: { chaosOrder: -3, warmth: 1, ego: 2, energy: 3 },
    tagline: "He's got an angle. He's always got an angle.",
    bio: "Rizzo can get you concert tickets, a snack, or out of a building through a vent, and he will absolutely mention it later. Streetwise, self-interested, and secretly a reliable friend when it counts.",
    strengths: ["Resourceful under pressure", "Reads a room instantly", "Comes through when it actually matters"],
    quirks: ["Always has a side hustle running", "Narrates his own close calls after the fact"],
    quote: "Hey, I know a guy.",
  },
  {
    slug: "pepe",
    name: "Pepe the King Prawn",
    title: "The Self-Proclaimed King",
    color: "#FF2264",
    vector: { chaosOrder: -2, warmth: 0, ego: 4, energy: 3 },
    tagline: "He's not a shrimp. He would like that noted, okay.",
    bio: "Pepe carries himself with the confidence of royalty despite a title nobody officially granted him. He'll take any job, romance any storyline, and correct your seafood taxonomy along the way.",
    strengths: ["Fearless self-promotion", "Adapts to literally any gig", "Never lets an insult go unanswered"],
    quirks: ["Corrects 'shrimp' to 'king prawn' on principle", "Overstates his own importance, constantly, on purpose"],
    quote: "Okay, that's it, that's the joke, no more!",
  },
];

export function getMuppet(slug: string): Muppet | undefined {
  return MUPPETS.find((m) => m.slug === slug);
}

export function vectorDistance(a: TraitVector, b: TraitVector): number {
  const axes: TraitAxis[] = ["chaosOrder", "warmth", "ego", "energy"];
  return Math.sqrt(
    axes.reduce((sum, axis) => sum + (a[axis] - b[axis]) ** 2, 0),
  );
}

export function matchMuppets(vector: TraitVector): {
  best: Muppet;
  runnerUp: Muppet;
} {
  const ranked = [...MUPPETS].sort(
    (a, b) => vectorDistance(vector, a.vector) - vectorDistance(vector, b.vector),
  );
  return { best: ranked[0], runnerUp: ranked[1] };
}

export function clampAxis(value: number): number {
  return Math.max(-5, Math.min(5, value));
}
