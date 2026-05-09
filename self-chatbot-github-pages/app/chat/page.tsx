"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearCorpus, CorpusEntry, loadCorpus } from "@/lib/corpus";
import { generateLocalReply, retrieveEntries } from "@/lib/chatbot";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatPage() {
  const [corpus, setCorpus] = useState<CorpusEntry[]>([]);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Ask me something. I will answer using the corpus you created during onboarding.",
    },
  ]);
  const [input, setInput] = useState("");
  const [sources, setSources] = useState<CorpusEntry[]>([]);

  useEffect(() => {
    setCorpus(loadCorpus());
  }, []);

  function sendMessage() {
    const trimmed = input.trim();
    if (!trimmed) return;

    const reply = generateLocalReply(trimmed, corpus);
    const matchedSources = retrieveEntries(trimmed, corpus);

    setMessages((prev) => [
      ...prev,
      { role: "user", content: trimmed },
      { role: "assistant", content: reply },
    ]);
    setSources(matchedSources);
    setInput("");
  }

  function resetCorpus() {
    clearCorpus();
    setCorpus([]);
    setSources([]);
    setMessages([
      {
        role: "assistant",
        content: "Your corpus has been cleared. Complete onboarding again to rebuild it.",
      },
    ]);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_320px]">
        <section className="overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl">
          <header className="border-b border-zinc-800 p-5">
            <h1 className="text-2xl font-bold">Chat with your corpus</h1>
            <p className="mt-1 text-sm text-zinc-400">
              {corpus.length > 0
                ? `${corpus.length} corpus entries loaded from this browser.`
                : "No corpus found yet. Complete onboarding first."}
            </p>
          </header>

          <div className="h-[560px] overflow-y-auto p-5 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "user" ? "bg-blue-600 text-white" : "bg-zinc-800 text-zinc-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-zinc-800 p-4">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage();
                }}
                placeholder="Ask a question..."
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
              <button onClick={sendMessage} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500">
                Send
              </button>
            </div>
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-bold">Actions</h2>
            <div className="mt-4 grid gap-3">
              <Link href="/onboarding" className="rounded-xl bg-zinc-800 px-4 py-3 text-center text-sm font-medium hover:bg-zinc-700">
                Edit corpus
              </Link>
              <button onClick={resetCorpus} className="rounded-xl bg-red-950 px-4 py-3 text-sm font-medium text-red-100 hover:bg-red-900">
                Clear corpus
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-bold">Latest matched sources</h2>
            {sources.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">Ask a question to see which corpus entries were used.</p>
            ) : (
              <div className="mt-3 space-y-3">
                {sources.map((source) => (
                  <div key={source.id} className="rounded-xl bg-zinc-800 p-3">
                    <p className="text-sm font-semibold text-blue-300">{source.question}</p>
                    <p className="mt-1 line-clamp-4 text-xs text-zinc-300">{source.answer}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-5">
            <h2 className="font-bold">Note</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              This GitHub Pages version does not use a private AI API key. It uses local keyword retrieval and template-based replies so any visitor can try it safely.
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
