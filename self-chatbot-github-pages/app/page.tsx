import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center p-6">
      <section className="w-full max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
        <p className="mb-3 text-sm font-medium text-blue-300">GitHub Pages compatible</p>
        <h1 className="text-4xl font-bold tracking-tight">Build a chatbot from your own answers</h1>
        <p className="mt-4 text-zinc-300 leading-7">
          Answer a guided set of questions, generate a personal corpus in your browser,
          then chat with a simple simulated version of yourself. This version runs fully
          client-side, so it works on static hosting like GitHub Pages.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-zinc-800 p-4">
            <h2 className="font-semibold">1. Answer</h2>
            <p className="mt-2 text-sm text-zinc-400">Complete 20 prompts about values, stories, tone, and boundaries.</p>
          </div>
          <div className="rounded-2xl bg-zinc-800 p-4">
            <h2 className="font-semibold">2. Save</h2>
            <p className="mt-2 text-sm text-zinc-400">Your corpus is stored locally in your own browser.</p>
          </div>
          <div className="rounded-2xl bg-zinc-800 p-4">
            <h2 className="font-semibold">3. Chat</h2>
            <p className="mt-2 text-sm text-zinc-400">Ask questions and get responses grounded in your answers.</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/onboarding" className="rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500">
            Start onboarding
          </Link>
          <Link href="/chat" className="rounded-xl bg-zinc-800 px-5 py-3 font-medium hover:bg-zinc-700">
            Go to chat
          </Link>
        </div>
      </section>
    </main>
  );
}
