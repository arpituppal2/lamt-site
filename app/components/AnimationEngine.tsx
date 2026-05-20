'use client';

import { useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   LAMT Animation Engine
   Installs globally from layout.tsx — runs once on mount.

   Features:
   1. Scroll reveal — IntersectionObserver for .reveal*, .reveal-block
   2. Staggered timeline nodes
   3. Counter animation — [data-count] elements
   4. Magnetic buttons — subtle cursor-follow on hover
   5. Parallax — .cinema-wordmark and .proof-stage__media
   6. Cursor glow trail
   7. Number ticker for .manifest-metrics strong
───────────────────────────────────────────────────────────── */

export default function AnimationEngine() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ── 1. Scroll Reveal ─────────────────────────────────────
    const revealTargets = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-block'
    );

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));

    // Auto-observe future DOM nodes (dynamic routes)
    const mutationObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          const targets = node.querySelectorAll<HTMLElement>(
            '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-block'
          );
          targets.forEach((el) => revealObserver.observe(el));
          if (node.matches('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-block')) {
            revealObserver.observe(node);
          }
        });
      });
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });

    // ── 2. Timeline node stagger ─────────────────────────────
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const rail = entry.target as HTMLElement;
          const nodes = rail.querySelectorAll<HTMLElement>('.timeline-node');
          nodes.forEach((node, i) => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(1.2rem)';
            node.style.transition = `opacity 520ms cubic-bezier(0.16,1,0.3,1) ${i * 85}ms,
                                     transform 520ms cubic-bezier(0.16,1,0.3,1) ${i * 85}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                node.style.opacity = '1';
                node.style.transform = 'translateY(0)';
              });
            });
          });
          timelineObserver.unobserve(rail);
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll('.timeline-rail').forEach((el) => timelineObserver.observe(el));

    // ── 3. Counter animation ──────────────────────────────────
    function animateCounter(el: HTMLElement) {
      const target = parseFloat(el.dataset.count ?? el.textContent ?? '0');
      const duration = 1400;
      const start = performance.now();
      const isInt = Number.isInteger(target);

      const tick = (now: number) => {
        const elapsed = Math.min(now - start, duration);
        const progress = 1 - Math.pow(1 - elapsed / duration, 3); // easeOutCubic
        const value = progress * target;
        el.textContent = isInt ? Math.round(value).toLocaleString() : value.toFixed(1);
        if (elapsed < duration) requestAnimationFrame(tick);
        else el.textContent = isInt ? target.toLocaleString() : target.toFixed(1);
      };
      requestAnimationFrame(tick);
    }

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target as HTMLElement);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll<HTMLElement>('[data-count]').forEach((el) =>
      counterObserver.observe(el)
    );

    // Auto-detect manifest metrics numbers
    document.querySelectorAll<HTMLElement>('.manifest-metrics strong').forEach((el) => {
      const text = el.textContent?.replace(/[^0-9.]/g, '') ?? '';
      const num = parseFloat(text);
      if (!isNaN(num) && num > 0) {
        el.dataset.count = String(num);
        counterObserver.observe(el);
      }
    });

    if (reduced) {
      return () => {
        revealObserver.disconnect();
        counterObserver.disconnect();
        timelineObserver.disconnect();
        mutationObs.disconnect();
      };
    }

    // ── 4. Magnetic buttons ───────────────────────────────────
    const magnetSelectors = '.btn-premium, .btn-outline, .btn-filled, .lamt-button';
    const magnetCleanup: (() => void)[] = [];

    function attachMagnetic(btn: HTMLElement) {
      const STRENGTH = 0.32;
      const MAX_DIST = 80;

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const tx = dx * STRENGTH * (1 - dist / MAX_DIST);
          const ty = dy * STRENGTH * (1 - dist / MAX_DIST);
          btn.style.transform = `translate(${tx}px, ${ty}px)`;
        }
      };
      const onLeave = () => {
        btn.style.transform = '';
      };

      btn.addEventListener('mousemove', onMove);
      btn.addEventListener('mouseleave', onLeave);
      return () => {
        btn.removeEventListener('mousemove', onMove);
        btn.removeEventListener('mouseleave', onLeave);
      };
    }

    document.querySelectorAll<HTMLElement>(magnetSelectors).forEach((btn) => {
      magnetCleanup.push(attachMagnetic(btn));
    });

    // ── 5. Parallax scroll ────────────────────────────────────
    let rafId: number;

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        const wordmark = document.querySelector<HTMLElement>('.cinema-wordmark');
        if (wordmark) {
          wordmark.style.transform = `translateY(${scrollY * 0.18}px)`;
        }

        const proofMedia = document.querySelector<HTMLElement>('.proof-stage__media');
        if (proofMedia) {
          const rect = proofMedia.getBoundingClientRect();
          const offset = (window.innerHeight / 2 - rect.top) * 0.06;
          proofMedia.style.transform = `translateY(${offset}px)`;
        }
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // ── 6. Cursor glow trail ──────────────────────────────────
    let glowEl = document.getElementById('lamt-cursor-glow');
    if (!glowEl) {
      glowEl = document.createElement('div');
      glowEl.id = 'lamt-cursor-glow';
      document.body.appendChild(glowEl);
    }

    let mouseX = -999, mouseY = -999;
    let glowX = -999, glowY = -999;
    const glowEl2 = glowEl;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', onMouseMove);

    const lerpGlow = () => {
      glowX += (mouseX - glowX) * 0.09;
      glowY += (mouseY - glowY) * 0.09;
      glowEl2.style.left = `${glowX}px`;
      glowEl2.style.top = `${glowY}px`;
      requestAnimationFrame(lerpGlow);
    };
    lerpGlow();

    const onMouseLeave = () => { glowEl2.style.opacity = '0'; };
    const onMouseEnter = () => { glowEl2.style.opacity = '1'; };
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // ── 7. Proof chapters entrance ────────────────────────────
    const chapterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const chapters = (entry.target as HTMLElement).querySelectorAll<HTMLElement>('.proof-chapter');
          chapters.forEach((ch, i) => {
            ch.style.opacity = '0';
            ch.style.transform = 'translateX(-1.2rem)';
            ch.style.transition = `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${i * 100}ms,
                                    transform 500ms cubic-bezier(0.16,1,0.3,1) ${i * 100}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                ch.style.opacity = '1';
                ch.style.transform = 'translateX(0)';
              });
            });
          });
          chapterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.proof-stage__rail').forEach((el) => chapterObserver.observe(el));

    // ── 8. Registration grid cell stagger ────────────────────
    const regObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const cells = (entry.target as HTMLElement).querySelectorAll<HTMLElement>('div');
          cells.forEach((cell, i) => {
            cell.style.opacity = '0';
            cell.style.clipPath = 'inset(0 0 100% 0)';
            cell.style.transition = `opacity 460ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms,
                                     clip-path 460ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                cell.style.opacity = '1';
                cell.style.clipPath = 'inset(0 0 0% 0)';
              });
            });
          });
          regObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.registration-slab__grid').forEach((el) => regObserver.observe(el));

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      timelineObserver.disconnect();
      chapterObserver.disconnect();
      regObserver.disconnect();
      mutationObs.disconnect();
      magnetCleanup.forEach((fn) => fn());
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
      const glow = document.getElementById('lamt-cursor-glow');
      if (glow) glow.remove();
    };
  }, []);

  return null;
}
