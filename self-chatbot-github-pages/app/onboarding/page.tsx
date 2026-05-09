"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingQuestions } from "@/lib/questions";
import { buildCorpusFromAnswers, saveCorpus } from "@/lib/corpus";

export default function OnboardingPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<string[]>(Array(onboardingQuestions.length).fill(""));
  const answeredCount = answers.filter((answer) => answer.trim()).length;

  function updateAnswer(index: number, value: string) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function submit() {
    const corpus = buildCorpusFromAnswers(answers);
    saveCorpus(corpus);
    router.push("/chat");
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h1 className="text-3xl font-bold">Create your corpus</h1>
          <p className="mt-3 text-zinc-300">
            Answer as many questions as you want. More detailed answers make the chatbot feel more specific.
          </p>
          <div className="mt-4 h-3 rounded-full bg-zinc-800">
            <div
              className="h-3 rounded-full bg-blue-600 transition-all"
              style={{ width: `${(answeredCount / onboardingQuestions.length) * 100}%` }}
            />
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            {answeredCount} of {onboardingQuestions.length} answered
          </p>
        </div>

        <div className="space-y-4">
          {onboardingQuestions.map((question, index) => (
            <label key={question} className="block rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <span className="text-sm font-semibold text-blue-300">Question {index + 1}</span>
              <p className="mt-1 font-medium">{question}</p>
              <textarea
                value={answers[index]}
                onChange={(event) => updateAnswer(index, event.target.value)}
                placeholder="Write your answer here..."
                className="mt-4 min-h-28 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 p-4 text-sm text-white outline-none focus:border-blue-500"
              />
            </label>
          ))}
        </div>

        <div className="sticky bottom-0 mt-6 border-t border-zinc-800 bg-zinc-950/95 py-4 backdrop-blur">
          <button
            onClick={submit}
            className="w-full rounded-xl bg-blue-600 px-5 py-4 font-semibold hover:bg-blue-500"
          >
            Save corpus and start chatting
          </button>
        </div>
      </div>
    </main>
  );
}
