export type CorpusEntry = {
  id: string;
  type: "qa" | "style" | "boundary";
  question: string;
  answer: string;
  tags: string[];
};

const STORAGE_KEY = "self-chatbot-corpus";

export function buildCorpusFromAnswers(answers: string[]): CorpusEntry[] {
  return answers
    .map((answer, index) => answer.trim())
    .filter(Boolean)
    .map((answer, index) => ({
      id: `entry-${index + 1}`,
      type: inferType(index),
      question: getQuestionLabel(index),
      answer,
      tags: inferTags(getQuestionLabel(index), answer),
    }));
}

function inferType(index: number): CorpusEntry["type"] {
  if ([11, 13].includes(index)) return "style";
  if ([14, 15].includes(index)) return "boundary";
  return "qa";
}

function getQuestionLabel(index: number): string {
  const labels = [
    "self description",
    "values",
    "motivation",
    "energizing work",
    "decision making",
    "failure lesson",
    "life shaping story",
    "helping others",
    "favorite topics",
    "goals",
    "personality",
    "response tone",
    "stress",
    "common phrases",
    "boundaries",
    "unknown answer behavior",
    "strong belief",
    "learning",
    "pride",
    "desired feeling",
  ];
  return labels[index] ?? `question ${index + 1}`;
}

function inferTags(question: string, answer: string): string[] {
  const text = `${question} ${answer}`.toLowerCase();
  const tags = new Set<string>();

  const keywords = [
    "values",
    "motivation",
    "work",
    "failure",
    "story",
    "personality",
    "goals",
    "stress",
    "tone",
    "belief",
    "learning",
    "pride",
    "boundary",
    "help",
  ];

  for (const keyword of keywords) {
    if (text.includes(keyword)) tags.add(keyword);
  }

  question.split(/\s+/).forEach((word) => {
    const clean = word.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (clean.length > 3) tags.add(clean);
  });

  return Array.from(tags).slice(0, 8);
}

export function saveCorpus(corpus: CorpusEntry[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(corpus));
}

export function loadCorpus(): CorpusEntry[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as CorpusEntry[];
  } catch {
    return [];
  }
}

export function clearCorpus() {
  localStorage.removeItem(STORAGE_KEY);
}
