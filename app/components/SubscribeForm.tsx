"use client";

import { useState, useRef, useEffect, useId } from "react";
import { api, ApiError } from "../lib/api";

const SUBSCRIBED_KEY = "lamt_popup_subscribed";

const PHASES = [
  { afterMs: 0, label: "Submitting..." },
  { afterMs: 4000, label: "Almost there..." },
  { afterMs: 9000, label: "Final touches..." },
];

function usePendingPhase(active: boolean) {
  const [label, setLabel] = useState(PHASES[0].label);

  useEffect(() => {
    if (!active) return;
    setLabel(PHASES[0].label);
    const timers = PHASES.slice(1).map((phase) =>
      window.setTimeout(() => setLabel(phase.label), phase.afterMs),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [active]);

  return label;
}

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
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const pendingLabel = usePendingPhase(status === "pending");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

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
      setError(err instanceof ApiError ? err.message : "Could not reach the server. Try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <div role="status">
        <p className={`text-lg font-extrabold ${onDark ? "text-white" : "text-[var(--color-text)]"}`}>
          You&apos;re on the list.
        </p>
        <p className={`mt-1 text-sm leading-relaxed ${onDark ? "text-[var(--ucla-blue-light)]" : "text-[var(--color-text-muted)]"}`}>
          We&apos;ll email you as soon as details for the next tournament are ready.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-3" noValidate>
      <label className="grid gap-2" htmlFor={emailId}>
        <span className={`label-caps ${onDark ? "text-[var(--color-border)]" : ""}`}>Email</span>
        <input
          id={emailId}
          ref={inputRef}
          className={onDark ? "lamt-input lamt-input--on-dark" : "lamt-input"}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
          aria-invalid={status === "error"}
          aria-describedby={status === "error" ? `${emailId}-error` : undefined}
        />
      </label>
      {status === "error" && (
        <p id={`${emailId}-error`} className="text-sm font-bold text-[var(--error-brick,#B33A2B)]" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={!email || status === "pending"} className={`w-full ${buttonClassName} disabled:opacity-40`}>
        {status === "pending" ? pendingLabel : buttonLabel}
      </button>
    </form>
  );
}
