'use client';
import { useEffect } from 'react';

export default function PremiumLogic() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const ring = document.getElementById('cursor-ring');
    const progressBar = document.getElementById('scroll-progress');
    
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    
    const onMouseMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (cursor) {
        cursor.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
    };

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      if (ring) {
        ring.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Continuous Reveal Interpolation
      const reveals = document.querySelectorAll('.reveal-item');
      reveals.forEach((el: any) => {
        const rect = el.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        const triggerPoint = elementTop - vh * 0.85;
        const endPoint = elementTop - vh * 0.15;
        
        let progress = (scrollY - triggerPoint) / (endPoint - triggerPoint);
        progress = Math.max(0, Math.min(1, progress));
        
        // Smooth eased progress
        const eased = 1 - Math.pow(1 - progress, 3); 
        
        el.style.opacity = eased;
        el.style.transform = `translate3d(0, ${15 * (1 - eased)}px, 0)`;
      });

      // Parallax effects
      const parallax = document.querySelectorAll('.parallax');
      parallax.forEach((el: any) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '0.1');
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${center * speed}px, 0)`;
      });

      if (progressBar) {
        const height = document.documentElement.scrollHeight - vh;
        const scrolled = (scrollY / height) * 100;
        progressBar.style.transform = `scaleX(${scrolled / 100})`;
      }

      requestAnimationFrame(animate);
    };

    const onMouseEnter = () => document.body.classList.add('cursor-hover');
    const onMouseLeave = () => document.body.classList.remove('cursor-hover');

    const updateListeners = () => {
      document.querySelectorAll('a, button, .card-premium').forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
        el.addEventListener('mouseenter', onMouseEnter);
        el.addEventListener('mouseleave', onMouseLeave);
      });
    };

    window.addEventListener('mousemove', onMouseMove);
    const animId = requestAnimationFrame(animate);
    const observer = new MutationObserver(updateListeners);
    observer.observe(document.body, { childList: true, subtree: true });
    updateListeners();

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return null;
}
