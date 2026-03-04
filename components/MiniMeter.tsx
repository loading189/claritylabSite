'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/lib/motion';

type MiniMeterProps = {
  value: number;
  className?: string;
  tone?: 'accent' | 'accent2' | 'success' | 'warn';
  label?: string;
};

export function MiniMeter({
  value,
  className = '',
  tone = 'accent',
  label,
}: MiniMeterProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const width = Math.max(0, Math.min(value, 100));
  const targetWidth = prefersReducedMotion() ? width : visible ? width : 0;

  return (
    <div className={className}>
      {label ? (
        <div className="mb-1 flex items-center justify-between text-xs text-muted">
          <span>{label}</span>
          <span>{width}%</span>
        </div>
      ) : null}
      <div ref={ref} className="h-2 w-full overflow-hidden rounded-full bg-border/70">
        <div
          className={`mini-meter-fill mini-meter-${tone}`}
          style={{ width: `${targetWidth}%` }}
        />
      </div>
    </div>
  );
}
