import styles from './brand.module.css';

type DataMotifProps = {
  variant: 'ticks' | 'signal' | 'nodes';
  className?: string;
};

export function DataMotif({ variant, className = '' }: DataMotifProps) {
  if (variant === 'ticks') {
    return (
      <span aria-hidden className={`${styles.dataMotif} ${className}`}>
        <svg width="20" height="10" viewBox="0 0 20 10" fill="none">
          <path
            d="M2 1.5V8.5M8 1.5V8.5M14 1.5V8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </span>
    );
  }

  if (variant === 'nodes') {
    return (
      <span aria-hidden className={`${styles.dataMotif} ${className}`}>
        <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
          <path
            d="M4 6H18"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
          <circle
            cx="4"
            cy="6"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle
            cx="11"
            cy="3"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
          <circle
            cx="18"
            cy="6"
            r="1.5"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </svg>
      </span>
    );
  }

  return (
    <span aria-hidden className={`${styles.dataMotif} ${className}`}>
      <svg width="22" height="12" viewBox="0 0 22 12" fill="none">
        <path
          d="M1 9L6 6L11 7L16 3L21 4"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
