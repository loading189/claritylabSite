'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MOTION, prefersReducedMotion } from '@/lib/motion';

type PageTransitionProps = {
  children: ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const settleTimer = useRef<number | null>(null);
  const [phase, setPhase] = useState<'enter' | 'idle' | 'exit'>('enter');
  const [renderedChildren, setRenderedChildren] = useState(children);

  useEffect(() => {
    if (settleTimer.current) window.clearTimeout(settleTimer.current);

    if (prefersReducedMotion()) {
      setRenderedChildren(children);
      setPhase('idle');
      previousPath.current = pathname;
      return;
    }

    if (previousPath.current === pathname) {
      setRenderedChildren(children);
      settleTimer.current = window.setTimeout(
        () => setPhase('idle'),
        MOTION.duration.base
      );
      return;
    }

    setPhase('exit');

    const exitTimer = window.setTimeout(() => {
      setRenderedChildren(children);
      setPhase('enter');
      previousPath.current = pathname;
      settleTimer.current = window.setTimeout(
        () => setPhase('idle'),
        MOTION.duration.base
      );
    }, MOTION.duration.fast);

    return () => {
      window.clearTimeout(exitTimer);
      if (settleTimer.current) window.clearTimeout(settleTimer.current);
    };
  }, [children, pathname]);

  return (
    <div className={`page-transition page-transition-${phase}`}>
      {renderedChildren}
    </div>
  );
}
