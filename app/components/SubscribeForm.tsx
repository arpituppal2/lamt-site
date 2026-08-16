"use client";

import { useState } from "react";
import { api, ApiError } from "../lib/api";

const SUBSCRIBED_KEY = "lamt_popup_subscribed";

export default function SubscribeForm({
  autoFocus = false,
  buttonLabel = "Keep Me Posted",
}: {
  autoFocus?: boolean;
  buttonLabel?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("pending");
    setError(null);
    try {
      await api.subscribe(email);
      setStatus("done");
      try {
        window.localStorage.setItem(SUBSCRIBED_KEY, "1");
      } catch {}
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not reach the server.");
    }
  }

  if (status === "done") {
    return (
      <div>
        <p className="text-lg font-extrabold text-[var(--color-text)]">You&apos;re on the list.</p>
        <p className="section-copy mt-1">We&apos;ll email you as soon as details for the next tournament are ready.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="grid gap-2">
        <span className="label-caps">Email</span>
        <input
          className="lamt-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          autoFocus={autoFocus}
        />
      </label>
      {status === "error" && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
      <button type="submit" disabled={!email || status === "pending"} className="btn-filled disabled:opacity-40">
        {status === "pending" ? "Signing up..." : buttonLabel}
      </button>
    </form>
  );
}