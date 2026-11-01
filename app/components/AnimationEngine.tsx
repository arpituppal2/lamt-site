'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ─── ANIMATION ENGINE ────────────────────────────────────────────────────────
   Motion thesis — UCLA printed-program surface

   Focal:     title words settle, then the victory-gold rule draws L→R
   Continuity: nav gold underline morphs between links
   Composition: section entries unmask via clip-path (not translateY shuffle)
   Lists:     true list grids (stagger-parent) opacity-stagger, capped
   Feedback:  gold click ripple on primary buttons

   Content stays visible by default. Never blank with opacity:0.
   ─────────────────────────────────────────────────────────────────────────── */

const GOLDEN = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EXIT = 'cubic-bezier(0.4, 0, 1, 1)';

// ─── COMPOSITION REVEAL (clip-path, no layout shuffle) ───────────────────────
function initCompositionReveal() {
  const selectors = ['.reveal', '.reveal-block', '.section-row.reveal'].join(', ');
  const all = Array.from(document.querySelectorAll<HTMLElement>(selectors));

  const play = (el: HTMLElement, observer?: IntersectionObserver, sequenceIndex = 0) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    el.classList.add('is-visible');

    // Cap sibling delay so a long FAQ never waits through a parade.
    const delay = Math.min(sequenceIndex, 3) * 55;

    el.animate(
      [
        { opacity: 0.82, clipPath: 'inset(10% 0 0 0)' },
        { opacity: 1, clipPath: 'inset(0 0 0 0)' },
      ],
      { duration: 480, delay, easing: GOLDEN, fill: 'none' }
    );

    observer?.unobserve(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const incoming = entries
        .filter((e) => e.isIntersecting)
        .map((e) => e.target as HTMLElement)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top);
      incoming.forEach((el, i) => play(el, observer, i));
    },
    { threshold: 0.08, rootMargin: '0px 0px -6% 0px' }
  );

  all.forEach((el) => {
    const rect = el.getBoundingClientRect();
    const inView = rect.bottom > 40 && rect.top < window.innerHeight * 0.92;
    if (inView) {
      // Above-fold: mark only — no entrance parade competing with the focal title.
      el.dataset.revealed = '1';
      el.classList.add('is-visible');
      return;
    }
    observer.observe(el);
  });

  return () => {
    observer.disconnect();
  };
}

// ─── LIST STAGGER (only real lists) ──────────────────────────────────────────
function initListStagger() {
  const parents = document.querySelectorAll<HTMLElement>('.stagger-parent');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const parent = entry.target as HTMLElement;
        if (parent.dataset.listRevealed) return;
        parent.dataset.listRevealed = '1';

        const kids = Array.from(parent.children) as HTMLElement[];
        kids.forEach((kid, i) => {
          // Cap total delay ~180ms so lists feel together, not shuffled.
          const delay = Math.min(i, 4) * 45;
          kid.animate(
            [
              { opacity: 0.72 },
              { opacity: 1 },
            ],
            { duration: 360, delay, easing: GOLDEN, fill: 'none' }
          );
        });
        observer.unobserve(parent);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -4% 0px' }
  );

  parents.forEach((p) => {
    const rect = p.getBoundingClientRect();
    if (rect.bottom > 0 && rect.top < window.innerHeight * 0.9) {
      p.dataset.listRevealed = '1';
      return;
    }
    observer.observe(p);
  });

  return () => observer.disconnect();
}

// ─── GOLD RULE DRAW (brand material) ─────────────────────────────────────────
function initGoldRules() {
  const rules = document.querySelectorAll<HTMLElement>('.program-rule');
  const animated: HTMLElement[] = [];

  rules.forEach((rule, i) => {
    animated.push(rule);
    rule.style.transformOrigin = 'left center';
    rule.animate(
      [
        { transform: 'scaleX(0)' },
        { transform: 'scaleX(1)' },
      ],
      {
        duration: 560,
        delay: 280 + i * 80,
        easing: GOLDEN,
        fill: 'both',
      }
    );
  });

  return () => {
    animated.forEach((rule) => {
      rule.style.transform = '';
      rule.style.transformOrigin = '';
    });
  };
}

// ─── NAV UNDERLINE MORPH ─────────────────────────────────────────────────────
function initNavMorph() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return () => {};

  const pill = document.createElement('span');
  pill.className = 'nav-morph-pill';
  pill.style.cssText = `
    position:absolute;bottom:-8px;height:3px;
    background:var(--ucla-gold);
    transition:left 320ms ${GOLDEN}, width 320ms ${GOLDEN}, opacity 200ms ease;
    pointer-events:none;border-radius:0;
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

// ─── GOLD RIPPLE FEEDBACK ────────────────────────────────────────────────────
function initRipple() {
  const targets = document.querySelectorAll<HTMLElement>(
    '.btn-premium, .btn-filled, .btn-gold, .lamt-button, .btn-ripple'
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
        background:rgba(255,209,0,0.32);
        transform:scale(0);
        animation:lamt-ripple 520ms ${EXIT} forwards;
      `;
      btn.appendChild(circle);
      setTimeout(() => circle.remove(), 560);
    };

    btn.addEventListener('click', onClick);
    cleanups.push(() => {
      btn.removeEventListener('click', onClick);
      btn.style.overflow = overflow;
    });
  });

  return () => cleanups.forEach((fn) => fn());
}

// ─── FOCAL: TITLE WORDS ──────────────────────────────────────────────────────
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
  const containers = document.querySelectorAll<HTMLElement>('.hero-animate-words');
  const animated: HTMLElement[] = [];

  containers.forEach((container) => {
    ensureWordSpans(container);
    const words = container.querySelectorAll<HTMLElement>('.word');
    words.forEach((word, i) => {
      animated.push(word);
      word.style.display = 'inline-block';
      word.style.opacity = '1';
      word.animate(
        [
          { opacity: 0.78, filter: 'blur(3px)', transform: 'translateY(8px)' },
          { opacity: 1, filter: 'blur(0)', transform: 'none' },
        ],
        {
          duration: 560,
          delay: 40 + i * 70,
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
      word.style.filter = '';
      word.style.display = '';
    });
  };
}

// ─── MAIN ────────────────────────────────────────────────────────────────────
export default function AnimationEngine() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      // Still keep nav active-state pill for orientation; skip authored motion.
      return initNavMorph();
    }

    document.querySelectorAll<HTMLElement>('[data-revealed], [data-list-revealed]').forEach((el) => {
      delete el.dataset.revealed;
      delete el.dataset.listRevealed;
      el.classList.remove('is-visible');
    });

    const cleanups: Array<(() => void) | void> = [
      initNavMorph(),
      initRipple(),
      initCompositionReveal(),
      initListStagger(),
    ];

    let heroCleanup: (() => void) | void;
    let ruleCleanup: (() => void) | void;
    const t = window.setTimeout(() => {
      heroCleanup = initHeroEntrance();
      ruleCleanup = initGoldRules();
    }, 40);

    return () => {
      window.clearTimeout(t);
      heroCleanup?.();
      ruleCleanup?.();
      cleanups.forEach((fn) => fn?.());
    };
  }, [pathname]);

  return null;
}
