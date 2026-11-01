'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ─── ANIMATION ENGINE ────────────────────────────────────────────────────────
   Installs all site-wide animations once in RootLayout.
   • Scroll reveals  – staggered clip-path + opacity (no CLS)
   • Counter anim    – [data-count] integers count up on entry
   • Magnetic btns   – .btn-magnetic follows cursor (max 10px)
   • Parallax        – .parallax-[slow|med|fast] depth on scroll
   • Timeline draw   – .timeline-rail border draws on entry
   • Nav underline   – sliding gold pill under hovered nav link
   • Bear drift      – subtle idle float on .hero-bear-img
   • Typewriter      – [data-typewrite] text types itself on entry
   • Gold ripple     – btn-premium / btn-filled clicks spawn a ripple
   ─────────────────────────────────────────────────────────────────────────── */

const GOLDEN = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EXIT   = 'cubic-bezier(0.4, 0, 1, 1)';

// ─── 1. SCROLL REVEALS ───────────────────────────────────────────────────────
function initReveal() {
  const selectors = [
    '.reveal',
    '.reveal--left',
    '.reveal--right',
    '.reveal--scale',
    '.reveal--up',
    '.stagger-parent > *',
    '.reveal-block',
  ].join(', ');

  const all = document.querySelectorAll<HTMLElement>(selectors);

  const getInitialTransform = (el: HTMLElement) => {
    if (el.classList.contains('reveal--left'))  return 'translateX(-28px)';
    if (el.classList.contains('reveal--right')) return 'translateX(28px)';
    if (el.classList.contains('reveal--scale')) return 'scale(0.92)';
    return 'translateY(16px)';
  };

  // Content stays visible by default. Motion is additive only — never blank text
  // with opacity:0 (IO misses / soft nav / above-fold would otherwise ship empty).
  // Sequence index staggers siblings that enter together so motion reads top→down.
  const reveal = (el: HTMLElement, observer?: IntersectionObserver, sequenceIndex = 0) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    el.classList.add('is-visible');
    el.style.opacity = '';
    el.style.transform = '';

    const parent = el.parentElement;
    const staggerIndex = parent?.classList.contains('stagger-parent')
      ? Array.from(parent.children).indexOf(el)
      : sequenceIndex;
    const delay = staggerIndex * 120;
    const baseDelay = parseInt(el.dataset.delay ?? '0', 10) + delay;

    el.animate(
      [
        { opacity: 0.45, transform: getInitialTransform(el) },
        { opacity: 1, transform: 'none' },
      ],
      { duration: 560, delay: baseDelay, easing: GOLDEN, fill: 'none' }
    );

    observer?.unobserve(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const incoming = entries
        .filter((entry) => entry.isIntersecting)
        .map((entry) => entry.target as HTMLElement)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      incoming.forEach((el, i) => reveal(el, observer, i));
    },
    { threshold: 0.01, rootMargin: '0px 0px -4% 0px' }
  );

  let bootSeq = 0;
  all.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.bottom > 0 && rect.top < window.innerHeight * 0.96;
    if (inView) {
      reveal(el, undefined, bootSeq++);
      return;
    }
    observer.observe(el);
  });

  // Failsafe: if anything is still unmarked after paint, show it (already-revealed no-ops).
  const failsafe = window.setTimeout(() => {
    all.forEach((el) => reveal(el));
  }, 900);

  return () => {
    window.clearTimeout(failsafe);
    observer.disconnect();
    all.forEach((el) => {
      el.style.opacity = '';
      el.style.transform = '';
    });
  };
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

// ─── 4. PARALLAX ─────────────────────────────────────────────────────────────
function initParallax() {
  const slow = document.querySelectorAll<HTMLElement>('.parallax-slow');
  const med  = document.querySelectorAll<HTMLElement>('.parallax-med');
  const fast = document.querySelectorAll<HTMLElement>('.parallax-fast');
  const wordmark = document.querySelector<HTMLElement>('.cinema-wordmark');

  let ticking = false;

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      slow.forEach((el) => { el.style.transform = `translateY(${y * 0.03}px)`; });
      med.forEach((el)  => { el.style.transform = `translateY(${y * 0.18}px)`; });
      fast.forEach((el) => { el.style.transform = `translateY(${y * 0.32}px)`; });
      if (wordmark) wordmark.style.transform = `translateY(${y * 0.22}px)`;
      ticking = false;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  return () => window.removeEventListener('scroll', onScroll);
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
  // Additive only — words stay readable; never start at opacity 0.
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
          { opacity: 0.88, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'none' },
        ],
        {
          duration: 480,
          delay: 40 + i * 60,
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
      word.style.clipPath = '';
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

    // Clear prior reveal marks so soft navigations re-animate
    document.querySelectorAll<HTMLElement>('[data-revealed]').forEach((el) => {
      delete el.dataset.revealed;
      el.classList.remove('is-visible');
    });

    // Motion diet: keep reveals, nav underline, hero entrance, light ripple.
    // Skip typewriter / proof hover / counters unless marked in DOM.
    const cleanups: Array<(() => void) | void> = [
      initReveal(),
      initCounters(),
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
