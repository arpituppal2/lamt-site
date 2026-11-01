'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ─── ANIMATION ENGINE ────────────────────────────────────────────────────────
   Motion thesis (UCLA program surface):
   • Focal: page title word entrance only
   • Continuity: nav gold underline morph
   • Feedback: light gold click ripple
   No scroll-reveal / parallax shuffle — content stays still and readable.
   ─────────────────────────────────────────────────────────────────────────── */

const GOLDEN = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EXIT   = 'cubic-bezier(0.4, 0, 1, 1)';

// Scroll reveals removed — every section translating on entry read as shuffle.
function initReveal() {
  // Content stays visible by default; never blank with opacity 0.
  return () => {};
}

// ─── 2. COUNTER ANIMATION ────────────────────────────────────────────────────
function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count]');

  const ease = (t: number) => 1 - Math.pow(1 - t, 3);

  const animate = (el: HTMLElement) => {
    const target = parseFloat(el.dataset.count ?? '0');
    const suffix = el.dataset.countSuffix ?? '';
    const prefix = el.dataset.countPrefix ?? '';
    const duration = 1400;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const val = target * ease(p);
      el.textContent = prefix + (Number.isInteger(target) ? Math.round(val).toString() : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          animate(e.target as HTMLElement);
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

// ─── 3. MAGNETIC BUTTONS ─────────────────────────────────────────────────────
// Removed per user feedback — buttons following cursor was distracting
// function initMagnetic() { ... }

function initMagnetic() {
  return () => {};
}

// Parallax removed — scroll transforms fought the hero and made pages shuffle.
function initParallax() {
  return () => {};
}

// ─── 5. TIMELINE BORDER DRAW ─────────────────────────────────────────────────
function initTimelineDraw() {
  const rails = document.querySelectorAll<HTMLElement>('.timeline-rail');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const rail = e.target as HTMLElement;
        rail.classList.add('timeline-drawn');
        observer.unobserve(rail);
      });
    },
    { threshold: 0.1 }
  );

  rails.forEach((r) => observer.observe(r));
  return () => observer.disconnect();
}

// ─── 6. NAV UNDERLINE MORPH ──────────────────────────────────────────────────
function initNavMorph() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return () => {};

  const pill = document.createElement('span');
  pill.className = 'nav-morph-pill';
  pill.style.cssText = `
    position:absolute;bottom:-8px;height:3px;
    background:var(--ucla-gold);
    transition:left 320ms ${GOLDEN}, width 320ms ${GOLDEN}, opacity 200ms ease;
    pointer-events:none;border-radius:9999px;
    z-index:10;
  `;
  nav.style.position = 'relative';
  nav.appendChild(pill);

  const links = Array.from(nav.querySelectorAll<HTMLElement>('a'));
  const getActive = () => nav.querySelector<HTMLElement>('a[data-active="true"]');

  const moveTo = (link: HTMLElement | null) => {
    if (!link) {
      pill.style.opacity = '0';
      return;
    }
    const r = link.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    pill.style.left = `${r.left - nr.left}px`;
    pill.style.width = `${r.width}px`;
    pill.style.opacity = '1';
  };

  moveTo(getActive());

  const cleanups: (() => void)[] = [];

  links.forEach((link) => {
    const onEnter = () => moveTo(link);
    const onLeave = () => moveTo(getActive());

    link.addEventListener('mouseenter', onEnter);
    link.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      link.removeEventListener('mouseenter', onEnter);
      link.removeEventListener('mouseleave', onLeave);
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
    pill.remove();
  };
}

// ─── 7. GOLD RIPPLE ON CLICK ─────────────────────────────────────────────────
function initRipple() {
  const targets = document.querySelectorAll<HTMLElement>(
    '.btn-premium, .btn-filled, .lamt-button, .btn-ripple'
  );

  const cleanups: (() => void)[] = [];

  targets.forEach((btn) => {
    const overflow = btn.style.overflow;
    btn.style.overflow = 'hidden';
    btn.style.position = btn.style.position || 'relative';

    const onClick = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.2;

      const circle = document.createElement('span');
      circle.style.cssText = `
        position:absolute;
        left:${x - size / 2}px;top:${y - size / 2}px;
        width:${size}px;height:${size}px;
        border-radius:50%;pointer-events:none;
        background:rgba(255,209,0,0.28);
        transform:scale(0);
        animation:lamt-ripple 550ms ${EXIT} forwards;
      `;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    };

    btn.addEventListener('click', onClick);
    cleanups.push(() => {
      btn.removeEventListener('click', onClick);
      btn.style.overflow = overflow;
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

// ─── 8. TYPEWRITER ───────────────────────────────────────────────────────────
function initTypewriter() {
  const els = document.querySelectorAll<HTMLElement>('[data-typewrite]');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        const text = el.dataset.typewrite ?? el.textContent ?? '';
        el.textContent = '';
        el.style.borderRight = '2px solid var(--ucla-gold)';

        let i = 0;
        const interval = setInterval(() => {
          el.textContent = text.slice(0, i + 1);
          i++;
          if (i >= text.length) {
            clearInterval(interval);
            setTimeout(() => { el.style.borderRight = ''; }, 800);
          }
        }, 42);

        observer.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  els.forEach((el) => observer.observe(el));
  return () => observer.disconnect();
}

// ─── 9. HERO HEADLINE ENTRANCE ───────────────────────────────────────────────
function ensureWordSpans(container: HTMLElement) {
  if (container.querySelector('.word')) return;
  const text = (container.textContent ?? '').trim();
  if (!text) return;
  container.textContent = '';
  text.split(/\s+/).forEach((token, i, arr) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.textContent = token;
    container.appendChild(span);
    if (i < arr.length - 1) container.appendChild(document.createTextNode(' '));
  });
}

function initHeroEntrance() {
  // Focal moment only: title words settle in place. Opacity-led, tiny rise.
  const containers = document.querySelectorAll<HTMLElement>('.hero-animate-words');
  const animated: HTMLElement[] = [];

  containers.forEach((container) => {
    ensureWordSpans(container);
    const words = container.querySelectorAll<HTMLElement>('.word');
    words.forEach((word, i) => {
      animated.push(word);
      word.style.opacity = '1';
      word.animate(
        [
          { opacity: 0.92, transform: 'translateY(4px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 420,
          delay: 30 + i * 50,
          easing: GOLDEN,
          fill: 'none',
        }
      );
    });
  });

  return () => {
    animated.forEach((word) => {
      word.style.opacity = '';
      word.style.transform = '';
    });
  };
}

// ─── 10. PROOF CHAPTER HOVER LIFT ────────────────────────────────────────────
function initProofHover() {
  const chapters = document.querySelectorAll<HTMLElement>('.proof-chapter');
  chapters.forEach((ch) => {
    ch.style.transition = `transform 280ms ${GOLDEN}, box-shadow 280ms ${GOLDEN}`;
    ch.addEventListener('mouseenter', () => {
      ch.style.transform = 'translateX(6px)';
      ch.style.boxShadow = '-3px 0 0 var(--ucla-gold)';
    });
    ch.addEventListener('mouseleave', () => {
      ch.style.transform = '';
      ch.style.boxShadow = '';
    });
  });
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function AnimationEngine() {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    // Focal title + nav underline + light ripple. No scroll shuffle / parallax.
    const cleanups: Array<(() => void) | void> = [
      initReveal(),
      initParallax(),
      initNavMorph(),
      initRipple(),
    ];

    let heroCleanup: (() => void) | void;
    const t = setTimeout(() => {
      heroCleanup = initHeroEntrance();
    }, 60);

    return () => {
      clearTimeout(t);
      heroCleanup?.();
      cleanups.forEach((fn) => fn?.());
    };
  }, [pathname]);

  return null;
}
