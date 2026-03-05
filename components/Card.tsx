import { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
};

export function Card({
  title,
  children,
  className = '',
  interactive = false,
  ...props
}: CardProps) {
  return (
    <article
      {...props}
      className={`rounded-card border border-border/90 bg-surfaceRaised p-6 shadow-soft transition duration-200 ${interactive ? 'hover-lift cursor-pointer hover:border-accent/60 hover:shadow-raised' : ''} ${className}`}
    >
      {title ? (
        <h3 className="text-lg font-semibold text-text">{title}</h3>
      ) : null}
      <div className={title ? 'mt-3 text-sm text-muted' : 'text-sm text-muted'}>
        {children}
      </div>
    </article>
  );
}
