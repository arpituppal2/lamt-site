"use client";

import { useEffect, useRef, useState } from "react";
import SubscribeForm from "./SubscribeForm";

const SEEN_KEY = "lamt_popup_seen_at";
const SUBSCRIBED_KEY = "lamt_popup_subscribed";
const DAY_MS = 24 * 60 * 60 * 1000;

export default function EmailPopup() {
  const [open, setOpen] = useState(false);

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

  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !popupRef.current) return;
    const el = popupRef.current;
    const animation = el.animate(
      [
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 360, easing: 'cubic-bezier(0.33, 0, 0.2, 1)', fill: 'forwards' }
    );
    return () => animation.cancel();
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={popupRef}
      className="fixed bottom-20 right-4 z-50 w-[21rem] max-w-[calc(100vw-2rem)] bg-[#003B5C] p-6 text-left"
      role="dialog"
      aria-modal="true"
      aria-label="Join the LAMT email list"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Close"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center text-xl font-extrabold text-white/60 hover:text-[var(--ucla-gold)]"
      >
        ✕
      </button>

      <p className="serif-kicker">Join the List</p>
      <h2 className="mt-2 text-xl font-extrabold leading-snug text-white">Be first to know.</h2>
      <p className="mt-3 text-sm leading-relaxed text-[#DAEBFE]">
        LAMT Blue (middle school and below) and LAMT Gold (high school and below) are coming in
        2027. Sign up for emails and we&#39;ll let you know when registration opens.
      </p>
      <div className="mt-6">
        <SubscribeForm autoFocus onDark buttonClassName="btn-gold" />
      </div>
    </div>
  );
}
