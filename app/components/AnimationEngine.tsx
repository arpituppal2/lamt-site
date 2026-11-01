'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/* ─── ANIMATION ENGINE ────────────────────────────────────────────────────────
   Motion thesis — UCLA printed-program surface (CSS-led so it is visible)

   Focal:     title words rise in, then gold rule draws L→R (CSS keyframes)
   Continuity: nav gold underline morphs between links
   Sections:  .reveal rises once on scroll (js-motion gated; visible w/o JS)
   Lists:     stagger-parent kids follow parent with capped delays
   Feedback:  gold click ripple

   html.js-motion enables “hidden until revealed”. Without JS, everything shows.
   ─────────────────────────────────────────────────────────────────────────── */

const GOLDEN = 'cubic-bezier(0.16, 1, 0.3, 1)';
const EXIT = 'cubic-bezier(0.4, 0, 1, 1)';

function initScrollReveals() {
  const targets = Array.from(
    document.querySelectorAll<HTMLElement>('.reveal, .reveal-block, .section-row.reveal, .stagger-parent')
  );

  const reveal = (el: HTMLElement, observer?: IntersectionObserver) => {
    if (el.dataset.revealed) return;
    el.dataset.revealed = '1';
    el.classList.add('is-visible');
    observer?.unobserve(el);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        .forEach((e) => reveal(e.target as HTMLElement, observer));
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    // Above-fold still animates via CSS on load for hero; mark sections visible
    // if already on screen so they don't sit invisible waiting for IO.
    if (rect.top < window.innerHeight * 0.85 && rect.bottom > 0) {
      // Delay one frame so CSS can paint the "from" state first.
      requestAnimationFrame(() => reveal(el));
      return;
    }
    observer.observe(el);
  });

  return () => observer.disconnect();
}

function initNavMorph() {
  const nav = document.querySelector<HTMLElement>('.site-nav');
  if (!nav) return () => {};

  const pill = document.createElement('span');
  pill.className = 'nav-morph-pill';
  pill.style.cssText = `
    position:absolute;bottom:-8px;height:3px;
    background:var(--ucla-gold);
    transition:left 320ms ${GOLDEN}, width 320ms ${GOLDEN}, opacity 200ms ease;
    pointer-events:none;border-radius:0;z-index:10;
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

function initRipple() {
  const targets = document.querySelectorAll<HTMLElement>(
    '.btn-premium, .btn-filled, .btn-gold, .lamt-button, .btn-ripple'
  );
  const cleanups: (() => void)[] = [];

  targets.forEach((btn) => {
    const overflow = btn.style.overflow;
    btn.style.overflow = 'hidden';
    if (getComputedStyle(btn).position === 'static') btn.style.position = 'relative';

    const onClick = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2.2;
      const circle = document.createElement('span');
      circle.style.cssText = `
        position:absolute;left:${x - size / 2}px;top:${y - size / 2}px;
        width:${size}px;height:${size}px;border-radius:50%;pointer-events:none;
        background:rgba(255,209,0,0.4);transform:scale(0);
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

export default function AnimationEngine() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      document.documentElement.classList.remove('js-motion');
      return initNavMorph();
    }

    // Enable CSS motion gates. Content stays visible when this class is absent.
    document.documentElement.classList.add('js-motion');

    document.querySelectorAll<HTMLElement>('[data-revealed]').forEach((el) => {
      delete el.dataset.revealed;
      el.classList.remove('is-visible');
    });

    // Retrigger CSS hero entrance on soft navigations by bouncing a class.
    const hero = document.querySelector('.hero-animate-words');
    if (hero) {
      hero.classList.remove('hero-run');
      // force reflow
      void (hero as HTMLElement).offsetWidth;
      hero.classList.add('hero-run');
    }
    document.querySelectorAll('.program-rule').forEach((rule) => {
      rule.classList.remove('rule-run');
      void (rule as HTMLElement).offsetWidth;
      rule.classList.add('rule-run');
    });
    document.querySelectorAll('.hero-enter').forEach((el) => {
      el.classList.remove('enter-run');
      void (el as HTMLElement).offsetWidth;
      el.classList.add('enter-run');
    });

    const cleanups: Array<(() => void) | void> = [
      initNavMorph(),
      initRipple(),
      initScrollReveals(),
    ];

    return () => {
      document.documentElement.classList.remove('js-motion');
      cleanups.forEach((fn) => fn?.());
    };
  }, [pathname]);

  return null;
}
