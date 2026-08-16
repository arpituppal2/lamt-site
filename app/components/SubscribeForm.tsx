"use client";

import { useState } from "react";
import { api, ApiError } from "../lib/api";

const SUBSCRIBED_KEY = "lamt_popup_subscribed";

export default function SubscribeForm({
  autoFocus = false,
  buttonLabel = "Keep Me Posted",
  onDark = false,
  buttonClassName = "btn-gold",
}: {
  autoFocus?: boolean;
  buttonLabel?: string;
  onDark?: boolean;
  buttonClassName?: string;
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
        <p className={`text-lg font-extrabold ${onDark ? "text-white" : "text-[var(--color-text)]"}`}>
          You&apos;re on the list.
        </p>
        <p className={`mt-1 text-sm leading-relaxed ${onDark ? "text-[#DAEBFE]" : "text-[var(--color-text-muted)]"}`}>
          We&apos;ll email you as soon as details for the next tournament are ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3">
      <label className="grid gap-2">
        <span className={`label-caps ${onDark ? "text-[#8BB8E8]" : ""}`}>Email</span>
        <input
          className={onDark ? "lamt-input lamt-input--on-dark" : "lamt-input"}
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          autoFocus={autoFocus}
        />
      </label>
      {status === "error" && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
      <button type="submit" disabled={!email || status === "pending"} className={`${buttonClassName} disabled:opacity-40`}>
        {status === "pending" ? "Signing up..." : buttonLabel}
      </button>
    </form>
  );
}