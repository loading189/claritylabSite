export const MOTION = {
  duration: {
    fast: 180,
    base: 240,
    reveal: 320,
    slow: 700,
  },
  easing: {
    standard: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
  },
} as const;

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function motionSafeClass(
  animatedClass: string,
  reducedClass = ''
): string {
  return prefersReducedMotion() ? reducedClass : animatedClass;
}
