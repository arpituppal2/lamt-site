'use client';

import { useEffect } from 'react';

/* ─────────────────────────────────────────────────────────────
   LAMT Animation Engine v2 — Competition Edition
   Installs globally from layout.tsx — runs once on mount.

   Features:
   1.  Scroll reveal — IntersectionObserver for .reveal*, .reveal-block
   2.  Staggered timeline nodes w/ border draw trigger
   3.  Counter animation — [data-count] + auto-detect manifest metrics
   4.  Magnetic buttons — cursor-follow on hover
   5.  Parallax — .cinema-wordmark, .proof-stage__media, hero bear
   6.  Cursor glow trail — lerped, gold/blue radial
   7.  Proof chapters entrance — slide from left
   8.  Registration grid cell stagger — clip-path wipe
   9.  Nav link — sliding gold underline morph
   10. Stagger parent — auto-staggers direct children
   11. Page transition — route change fade
   12. Hero mouse parallax — subtle 3D tilt on hero section
   13. Manifest metrics stagger
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
      { threshold: 0.1, rootMargin: '0px 0px -32px 0px' }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));

    const mutationObs = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return;
          node.querySelectorAll<HTMLElement>(
            '.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-block'
          ).forEach((el) => revealObserver.observe(el));
          if (node.matches('.reveal, .reveal--left, .reveal--right, .reveal--scale, .reveal-block')) {
            revealObserver.observe(node);
          }
        });
      });
    });
    mutationObs.observe(document.body, { childList: true, subtree: true });

    // ── 2. Timeline node stagger + border draw ───────────────
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const rail = entry.target as HTMLElement;
          rail.classList.add('borders-drawn');
          const nodes = rail.querySelectorAll<HTMLElement>('.timeline-node');
          nodes.forEach((node, i) => {
            node.style.opacity = '0';
            node.style.transform = 'translateY(1.2rem)';
            node.style.transition = `opacity 540ms cubic-bezier(0.16,1,0.3,1) ${80 + i * 85}ms,
                                     transform 540ms cubic-bezier(0.16,1,0.3,1) ${80 + i * 85}ms`;
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
      { threshold: 0.06 }
    );

    document.querySelectorAll('.timeline-rail').forEach((el) => timelineObserver.observe(el));

    // ── 3. Counter animation ──────────────────────────────────
    function animateCounter(el: HTMLElement) {
      const raw = el.dataset.count ?? el.textContent ?? '0';
      const target = parseFloat(raw.replace(/[^0-9.]/g, ''));
      if (isNaN(target)) return;
      const duration = 1600;
      const start = performance.now();
      const isInt = Number.isInteger(target);
      el.classList.add('is-counting');

      const tick = (now: number) => {
        const elapsed = Math.min(now - start, duration);
        const t = elapsed / duration;
        const progress = 1 - Math.pow(1 - t, 3); // easeOutCubic
        const value = progress * target;
        el.textContent = isInt ? Math.round(value).toLocaleString() : value.toFixed(1);
        if (elapsed < duration) {
          requestAnimationFrame(tick);
        } else {
          el.textContent = isInt ? target.toLocaleString() : target.toFixed(1);
          el.classList.remove('is-counting');
        }
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
      const STRENGTH = 0.28;
      const MAX_DIST = 90;

      const onMove = (e: MouseEvent) => {
        const rect = btn.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const factor = STRENGTH * (1 - dist / MAX_DIST);
          btn.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
        }
      };
      const onLeave = () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 400ms cubic-bezier(0.16,1,0.3,1), background var(--transition-ui), color var(--transition-ui), border-color var(--transition-ui), box-shadow 220ms cubic-bezier(0.16,1,0.3,1)';
        setTimeout(() => { btn.style.transition = ''; }, 420);
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
    let rafId = 0;

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        const wordmark = document.querySelector<HTMLElement>('.cinema-wordmark');
        if (wordmark) {
          wordmark.style.transform = `translateY(${scrollY * 0.2}px)`;
        }

        const proofMedia = document.querySelector<HTMLElement>('.proof-stage__media');
        if (proofMedia) {
          const rect = proofMedia.getBoundingClientRect();
          const offset = (window.innerHeight * 0.5 - rect.top) * 0.055;
          proofMedia.style.transform = `translateY(${offset}px)`;
        }

        const bear = document.querySelector<HTMLElement>('.cinema-hero .pointer-events-none');
        if (bear) {
          bear.style.transform = `translateY(${scrollY * 0.12}px)`;
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
    const glowRef = glowEl;
    let glowRafId = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    document.addEventListener('mousemove', onMouseMove);

    const lerpGlow = () => {
      glowX += (mouseX - glowX) * 0.085;
      glowY += (mouseY - glowY) * 0.085;
      glowRef.style.left = `${glowX}px`;
      glowRef.style.top = `${glowY}px`;
      glowRafId = requestAnimationFrame(lerpGlow);
    };
    lerpGlow();

    const onMouseLeave = () => { glowRef.style.opacity = '0'; };
    const onMouseEnter = () => { glowRef.style.opacity = '1'; };
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
            ch.style.transform = 'translateX(-1.4rem)';
            ch.style.transition = `opacity 520ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms,
                                    transform 520ms cubic-bezier(0.16,1,0.3,1) ${i * 110}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                ch.style.opacity = '1';
                ch.style.transform = 'translateX(0)';
                ch.classList.add('is-chapter-visible');
              });
            });
          });
          chapterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.08 }
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
            cell.style.transition = `opacity 480ms cubic-bezier(0.16,1,0.3,1) ${i * 65}ms,
                                     clip-path 480ms cubic-bezier(0.16,1,0.3,1) ${i * 65}ms`;
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
      { threshold: 0.08 }
    );

    document.querySelectorAll('.registration-slab__grid').forEach((el) => regObserver.observe(el));

    // ── 9. Nav sliding gold underline ─────────────────────────
    const navLinks = document.querySelectorAll<HTMLElement>('.site-nav-link');
    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && window.location.pathname === href) {
        link.setAttribute('data-active', 'true');
      }
    });

    // ── 10. Stagger parent ────────────────────────────────────
    const staggerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const parent = entry.target as HTMLElement;
          const children = Array.from(parent.children) as HTMLElement[];
          children.forEach((child, i) => {
            child.style.opacity = '0';
            child.style.clipPath = 'inset(0 0 20% 0)';
            child.style.transition = `opacity 560ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms,
                                      clip-path 560ms cubic-bezier(0.16,1,0.3,1) ${i * 60}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                child.style.opacity = '1';
                child.style.clipPath = 'inset(0 0 0% 0)';
              });
            });
          });
          staggerObserver.unobserve(parent);
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll('.stagger-parent').forEach((el) => staggerObserver.observe(el));

    // ── 11. Hero mouse parallax tilt ─────────────────────────
    const heroSection = document.querySelector<HTMLElement>('.cinema-hero');
    let heroTiltCleanup: (() => void) | null = null;

    if (heroSection) {
      const onHeroMouseMove = (e: MouseEvent) => {
        const rect = heroSection.getBoundingClientRect();
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const dx = (e.clientX - rect.left - cx) / cx;
        const dy = (e.clientY - rect.top - cy) / cy;

        const content = heroSection.querySelector<HTMLElement>('.cinema-hero__content');
        const console_ = heroSection.querySelector<HTMLElement>('.hero-console');
        if (content) {
          content.style.transform = `translate(${dx * 5}px, ${dy * 3}px)`;
          content.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
        }
        if (console_) {
          console_.style.transform = `translate(${dx * -8}px, ${dy * -5}px)`;
          console_.style.transition = 'transform 600ms cubic-bezier(0.16,1,0.3,1)';
        }
      };

      const onHeroMouseLeave = () => {
        const content = heroSection.querySelector<HTMLElement>('.cinema-hero__content');
        const console_ = heroSection.querySelector<HTMLElement>('.hero-console');
        if (content) { content.style.transform = ''; }
        if (console_) { console_.style.transform = ''; }
      };

      heroSection.addEventListener('mousemove', onHeroMouseMove);
      heroSection.addEventListener('mouseleave', onHeroMouseLeave);
      heroTiltCleanup = () => {
        heroSection.removeEventListener('mousemove', onHeroMouseMove);
        heroSection.removeEventListener('mouseleave', onHeroMouseLeave);
      };
    }

    // ── 12. Manifest metrics stagger ─────────────────────────
    const manifestObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const metrics = (entry.target as HTMLElement).querySelectorAll<HTMLElement>('div');
          metrics.forEach((metric, i) => {
            metric.style.opacity = '0';
            metric.style.transform = 'translateY(1rem)';
            metric.style.transition = `opacity 500ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms,
                                       transform 500ms cubic-bezier(0.16,1,0.3,1) ${i * 90}ms`;
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                metric.style.opacity = '1';
                metric.style.transform = 'translateY(0)';
              });
            });
          });
          manifestObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll('.manifest-metrics').forEach((el) => manifestObserver.observe(el));

    // ── Cleanup ───────────────────────────────────────────────
    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
      timelineObserver.disconnect();
      chapterObserver.disconnect();
      regObserver.disconnect();
      staggerObserver.disconnect();
      manifestObserver.disconnect();
      mutationObs.disconnect();
      magnetCleanup.forEach((fn) => fn());
      heroTiltCleanup?.();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      if (rafId) cancelAnimationFrame(rafId);
      if (glowRafId) cancelAnimationFrame(glowRafId);
      const glow = document.getElementById('lamt-cursor-glow');
      if (glow) glow.remove();
    };
  }, []);

  return null;
}
