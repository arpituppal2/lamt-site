'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState<ReactNode>(children);
  const [transitionStage, setTransitionStage] = useState<'idle' | 'out' | 'in'>('in');

  useEffect(() => {
    if (!pathname) return;
    setTransitionStage('out');
    const outTimer = setTimeout(() => {
      setDisplayChildren(children);
      setTransitionStage('in');
    }, 180);
    return () => clearTimeout(outTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    setDisplayChildren(children);
  }, [children]);

  return (
    <div
      style={{
        opacity: transitionStage === 'out' ? 0 : 1,
        transform: transitionStage === 'out' ? 'translateX(-20px)' : 'translateX(0)',
        transition: 'opacity 180ms ease, transform 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {displayChildren}
    </div>
  );
}
