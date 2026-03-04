import { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <article className={`rounded-card border bg-surface p-6 shadow-subtle transition duration-200 hover:-translate-y-0.5 ${className}`}>
      {title ? <h3 className="text-lg font-semibold text-text">{title}</h3> : null}
      <div className={title ? 'mt-3 text-sm text-muted' : 'text-sm text-muted'}>{children}</div>
    </article>
  );
}
