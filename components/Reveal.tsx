'use client';

import { ElementType, ReactNode, useEffect, useRef, useState } from 'react';
import { MOTION, prefersReducedMotion } from '@/lib/motion';

type RevealVariant = 'fadeUp' | 'fadeIn' | 'scaleIn';

type RevealProps = {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  once?: boolean;
  as?: ElementType;
};

export function Reveal({
  children,
  className = '',
  variant = 'fadeUp',
  delay = 0,
  once = true,
  as: Component = 'div',
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    setReduceMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const node = ref.current;

    if (!node || reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (once) observer.unobserve(entry.target);
        } else if (!once) {
          setVisible(false);
        }
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.16,
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [once, reduceMotion]);

  return (
    <Component
      ref={ref}
      className={`reveal-base reveal-${variant} ${visible ? 'reveal-visible' : 'reveal-hidden'} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${MOTION.duration.reveal}ms`,
        transitionTimingFunction: MOTION.easing.standard,
      }}
    >
      {children}
    </Component>
  );
}
