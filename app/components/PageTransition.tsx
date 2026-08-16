'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const DURATION = 360;
const EASE = 'cubic-bezier(0.16, 1, 0.3, 1)';

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [sliding, setSliding] = useState(false);
  const [oldNode, setOldNode] = useState<ReactNode | null>(null);
  const [offset, setOffset] = useState(0);
  const lastPath = useRef(pathname);
  const lastChildren = useRef<ReactNode>(children);

  useEffect(() => {
    if (pathname === lastPath.current) return;

    setOldNode(lastChildren.current);
    setSliding(true);
    setOffset(0);

    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => setOffset(1));
    });

    const t = setTimeout(() => {
      setSliding(false);
      setOldNode(null);
    }, DURATION + 40);

    lastPath.current = pathname;
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    lastChildren.current = children;
  }, [children]);

  if (sliding && oldNode !== null) {
    return (
      <div style={{ overflow: 'hidden', width: '100%' }}>
        <div
          style={{
            display: 'flex',
            width: '200%',
            transform: `translateX(-${offset * 50}%)`,
            transition: `transform ${DURATION}ms ${EASE}`,
          }}
        >
          <div style={{ width: '50%', flexShrink: 0 }}>{oldNode}</div>
          <div style={{ width: '50%', flexShrink: 0 }}>{children}</div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
