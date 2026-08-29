"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setStatus(res.ok ? "done" : "error");
  }

  if (status === "done") {
    return <p className="font-medium">You&apos;re on the list — thank you.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="flex-1 px-4 py-3 rounded-full bg-paper/10 border border-paper/30 text-paper placeholder:text-paper/50 focus:outline-none focus:border-sun"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-sun text-ink px-6 py-3 rounded-full font-semibold hover:brightness-95 transition disabled:opacity-50"
      >
        {status === "loading" ? "Joining..." : "Stay Updated"}
      </button>
      {status === "error" && (
        <p className="text-sm text-red-300 sm:absolute sm:mt-14">Something went wrong — try again.</p>
      )}
    </form>
  );
}