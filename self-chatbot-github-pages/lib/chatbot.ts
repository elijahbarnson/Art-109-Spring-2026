import { CorpusEntry } from "./corpus";

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 2);
}

function scoreEntry(message: string, entry: CorpusEntry): number {
  const queryWords = tokenize(message);
  const entryText = `${entry.question} ${entry.answer} ${entry.tags.join(" ")}`.toLowerCase();
  let score = 0;

  for (const word of queryWords) {
    if (entryText.includes(word)) score += 2;
    if (entry.question.toLowerCase().includes(word)) score += 3;
    if (entry.tags.some((tag) => tag.toLowerCase().includes(word))) score += 4;
  }

  return score;
}

export function retrieveEntries(message: string, corpus: CorpusEntry[], limit = 4): CorpusEntry[] {
  return corpus
    .map((entry) => ({ entry, score: scoreEntry(message, entry) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.entry);
}

export function generateLocalReply(message: string, corpus: CorpusEntry[]): string {
  const matches = retrieveEntries(message, corpus);

  const unknownEntry = corpus.find((entry) => entry.question.includes("unknown answer behavior"));
  const toneEntry = corpus.find((entry) => entry.question.includes("response tone"));
  const phraseEntry = corpus.find((entry) => entry.question.includes("common phrases"));

  if (corpus.length === 0) {
    return "I do not have a corpus yet. Please complete onboarding first.";
  }

  if (matches.length === 0) {
    return unknownEntry?.answer || "I do not think I have answered that about myself yet.";
  }

  const intro = getIntro(message, toneEntry?.answer);
  const body = matches
    .map((entry) => firstPersonAnswer(entry.answer))
    .join(" ");
  const phrase = phraseEntry ? maybeAddPhrase(phraseEntry.answer) : "";

  return `${intro}${body}${phrase}`.trim();
}

function firstPersonAnswer(answer: string): string {
  return answer.trim().replace(/\s+/g, " ");
}

function getIntro(message: string, tone?: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("why") || lower.includes("how")) return "Based on what I shared, ";
  if (tone && tone.toLowerCase().includes("casual")) return "Honestly, ";
  return "";
}

function maybeAddPhrase(phrases: string): string {
  const firstPhrase = phrases.split(/[,.\n]/).map((p) => p.trim()).find(Boolean);
  if (!firstPhrase || firstPhrase.length > 40) return "";
  return ` ${firstPhrase}.`;
}
