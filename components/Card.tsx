import { ReactNode } from 'react';

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Card({ title, children, className = '' }: CardProps) {
  return (
    <article className={`rounded-xl border border-slate-200 bg-white p-6 shadow-soft ${className}`}>
      {title ? <h3 className="text-lg font-semibold text-slate-900">{title}</h3> : null}
      <div className={title ? 'mt-3 text-sm text-slate-700' : 'text-sm text-slate-700'}>{children}</div>
    </article>
  );
}
