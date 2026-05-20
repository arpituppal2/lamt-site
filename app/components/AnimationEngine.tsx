'use client';

import { useEffect } from 'react';

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
   • Cursor trail    – gold dot trail on desktop
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

  const getInitialClip = (el: HTMLElement) => {
    if (el.classList.contains('reveal--left'))  return 'inset(0 100% 0 0)';
    if (el.classList.contains('reveal--right')) return 'inset(0 0 0 100%)';
    if (el.closest('.stagger-parent'))         return 'inset(0 0 100% 0)';
    return 'inset(0 0 100% 0)';
  };

  // Set initial state (invisible, not displacing layout)
  all.forEach((el) => {
    if (el.classList.contains('is-visible') || el.dataset.revealed) return;
    if (el.classList.contains('reveal--scale')) {
      el.style.opacity = '0';
      el.style.transform = 'scale(0.88)';
    } else {
      el.style.opacity = '0';
      el.style.clipPath = getInitialClip(el);
    }
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        if (el.dataset.revealed) return;
        el.dataset.revealed = '1';

        // Stagger siblings inside .stagger-parent
        const parent = el.parentElement;
        const staggerIndex = parent?.classList.contains('stagger-parent')
          ? Array.from(parent.children).indexOf(el)
          : 0;
        const delay = staggerIndex * 70;

        const baseDelay = parseInt(el.dataset.delay ?? '0', 10) + delay;

        if (el.classList.contains('reveal--scale')) {
          el.animate(
            [
              { opacity: 0, transform: 'scale(0.88)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: 600, delay: baseDelay, easing: GOLDEN, fill: 'forwards' }
          ).onfinish = () => {
            el.style.opacity = '1';
            el.style.transform = 'scale(1)';
          };
        } else {
          const clip = getInitialClip(el);
          el.animate(
            [
              { opacity: 0, clipPath: clip },
              { opacity: 1, clipPath: 'inset(0 0 0 0)' },
            ],
            { duration: 680, delay: baseDelay, easing: GOLDEN, fill: 'forwards' }
          ).onfinish = () => {
            el.style.opacity = '1';
            el.style.clipPath = 'none';
          };
        }

        // Legacy reveal-block compat
        el.classList.add('is-visible');
        observer.unobserve(el);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  all.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
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
function initMagnetic() {
  const btns = document.querySelectorAll<HTMLElement>(
    '.btn-premium, .btn-magnetic, .btn-filled, .lamt-button'
  );

  const MAX = 10;

  const cleanups: (() => void)[] = [];

  btns.forEach((btn) => {
    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = Math.max(-MAX, Math.min(MAX, (e.clientX - cx) * 0.35));
      const dy = Math.max(-MAX, Math.min(MAX, (e.clientY - cy) * 0.35));
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 80ms linear';
    };

    const onLeave = () => {
      btn.style.transform = '';
      btn.style.transition = `transform 500ms ${GOLDEN}`;
    };

    btn.addEventListener('mousemove', onMove);
    btn.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      btn.removeEventListener('mousemove', onMove);
      btn.removeEventListener('mouseleave', onLeave);
    });
  });

  return () => cleanups.forEach((fn) => fn());
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
      slow.forEach((el) => { el.style.transform = `translateY(${y * 0.08}px)`; });
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
    position:absolute;bottom:-2px;height:2px;
    background:var(--ucla-gold);
    transition:left 260ms ${GOLDEN}, width 260ms ${GOLDEN};
    pointer-events:none;border-radius:9999px;
  `;
  nav.style.position = 'relative';
  nav.appendChild(pill);

  const links = nav.querySelectorAll<HTMLElement>('a');
  const active = nav.querySelector<HTMLElement>('a[style*="underline"]');

  // Init pill on active link
  if (active) {
    const r = active.getBoundingClientRect();
    const nr = nav.getBoundingClientRect();
    pill.style.left = `${r.left - nr.left}px`;
    pill.style.width = `${r.width}px`;
    pill.style.opacity = '1';
  } else {
    pill.style.opacity = '0';
  }

  const cleanups: (() => void)[] = [];

  links.forEach((link) => {
    const onEnter = () => {
      const r = link.getBoundingClientRect();
      const nr = nav.getBoundingClientRect();
      pill.style.left = `${r.left - nr.left}px`;
      pill.style.width = `${r.width}px`;
      pill.style.opacity = '1';
    };

    const onLeave = () => {
      if (active) {
        const r = active.getBoundingClientRect();
        const nr = nav.getBoundingClientRect();
        pill.style.left = `${r.left - nr.left}px`;
        pill.style.width = `${r.width}px`;
      } else {
        pill.style.opacity = '0';
      }
    };

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

// ─── 7. CURSOR TRAIL ─────────────────────────────────────────────────────────
function initCursorTrail() {
  if (window.matchMedia('(hover: none)').matches) return () => {};
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  const TRAIL_COUNT = 8;
  const dots: HTMLElement[] = [];

  for (let i = 0; i < TRAIL_COUNT; i++) {
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed;top:0;left:0;pointer-events:none;z-index:99999;
      width:${6 - i * 0.4}px;height:${6 - i * 0.4}px;border-radius:50%;
      background:var(--ucla-gold);opacity:${0.7 - i * 0.07};
      transform:translate(-50%,-50%);
      transition:transform 0ms, opacity 400ms;
      will-change:transform;
    `;
    document.body.appendChild(dot);
    dots.push(dot);
  }

  const positions: { x: number; y: number }[] = Array(TRAIL_COUNT).fill({ x: -100, y: -100 });

  const onMove = (e: MouseEvent) => {
    positions[0] = { x: e.clientX, y: e.clientY };
  };

  let raf: number;
  const tick = () => {
    for (let i = TRAIL_COUNT - 1; i > 0; i--) {
      positions[i] = {
        x: positions[i].x + (positions[i - 1].x - positions[i].x) * 0.35,
        y: positions[i].y + (positions[i - 1].y - positions[i].y) * 0.35,
      };
    }
    dots.forEach((dot, i) => {
      dot.style.transform = `translate(${positions[i].x - (3 - i * 0.2)}px, ${positions[i].y - (3 - i * 0.2)}px)`;
    });
    raf = requestAnimationFrame(tick);
  };

  window.addEventListener('mousemove', onMove);
  raf = requestAnimationFrame(tick);

  return () => {
    window.removeEventListener('mousemove', onMove);
    cancelAnimationFrame(raf);
    dots.forEach((d) => d.remove());
  };
}

// ─── 8. GOLD RIPPLE ON CLICK ─────────────────────────────────────────────────
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

// ─── 9. TYPEWRITER ───────────────────────────────────────────────────────────
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

// ─── 10. HERO HEADLINE ENTRANCE ──────────────────────────────────────────────
function initHeroEntrance() {
  // Stagger each word in .hero-animate-words on page load
  const containers = document.querySelectorAll<HTMLElement>('.hero-animate-words');

  containers.forEach((container) => {
    const words = container.querySelectorAll<HTMLElement>('.word');
    words.forEach((word, i) => {
      word.style.opacity = '0';
      word.style.clipPath = 'inset(0 0 100% 0)';
      word.animate(
        [
          { opacity: 0, clipPath: 'inset(0 0 100% 0)' },
          { opacity: 1, clipPath: 'inset(0 0 0% 0)' },
        ],
        {
          duration: 800,
          delay: 300 + i * 120,
          easing: GOLDEN,
          fill: 'forwards',
        }
      ).onfinish = () => {
        word.style.opacity = '1';
        word.style.clipPath = 'none';
      };
    });
  });
}

// ─── 11. PROOF CHAPTER HOVER LIFT ────────────────────────────────────────────
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
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

    const cleanups = [
      initReveal(),
      initCounters(),
      initMagnetic(),
      initParallax(),
      initTimelineDraw(),
      initNavMorph(),
      initCursorTrail(),
      initRipple(),
      initTypewriter(),
      initProofHover(),
    ];

    // Fire hero entrance after a brief paint settle
    const t = setTimeout(initHeroEntrance, 60);

    return () => {
      clearTimeout(t);
      cleanups.forEach((fn) => fn?.());
    };
  }, []);

  return null;
}
