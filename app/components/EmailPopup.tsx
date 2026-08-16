"use client";

import { useEffect, useState } from "react";
import { api, ApiError } from "../lib/api";

const SEEN_KEY = "lamt_popup_seen_at";
const SUBSCRIBED_KEY = "lamt_popup_subscribed";
const DAY_MS = 24 * 60 * 60 * 1000;

export default function EmailPopup() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    try {
      if (window.localStorage.getItem(SUBSCRIBED_KEY)) return;
      const seenAt = Number(window.localStorage.getItem(SEEN_KEY) || 0);
      if (Date.now() - seenAt < DAY_MS) return;
      if (window.location.pathname.startsWith("/admin") || window.location.pathname.startsWith("/live")) return;
    } catch {}
    timer = window.setTimeout(() => setOpen(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function dismiss() {
    setOpen(false);
    try {
      window.localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {}
  }

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

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Join the LAMT email list"
      onClick={dismiss}
    >
      <div className="lamt-panel relative w-full max-w-md" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center border-2 border-[var(--color-border)] font-extrabold text-[var(--color-text-muted)] hover:border-[var(--ucla-gold)] hover:text-[var(--color-text)]"
        >
          ✕
        </button>

        <div className="lamt-panel-body">
          <p className="label-caps">Join the List</p>
          <h2 className="mt-3 text-2xl font-extrabold text-[var(--color-text)]">We&apos;re just getting started.</h2>
          <p className="section-copy mt-3">
            LAMT 2026 brought 180+ students from 8 counties to UCLA — and it&apos;s only the first one. Join the email list and be
            first to know about next year&apos;s tournament.
          </p>

          {status === "done" ? (
            <div className="mt-6">
              <p className="text-lg font-extrabold text-[var(--color-text)]">You&apos;re on the list.</p>
              <p className="section-copy mt-1">See you next year. No spam, only tournament news.</p>
              <button type="button" onClick={dismiss} className="btn-outline mt-5">
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="mt-6 grid gap-3">
              <label className="grid gap-2">
                <span className="label-caps">Email</span>
                <input
                  className="lamt-input"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </label>
              {status === "error" && <p className="text-sm font-bold text-[#B33A2B]">{error}</p>}
              <button type="submit" disabled={!email || status === "pending"} className="btn-filled disabled:opacity-40">
                {status === "pending" ? "Signing up..." : "Keep Me Posted"}
              </button>
              <p className="text-xs font-bold text-[var(--color-text-muted)]">No spam. Unsubscribe anytime.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}