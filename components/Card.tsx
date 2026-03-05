import { HTMLAttributes, ReactNode } from 'react';

type CardProps = HTMLAttributes<HTMLElement> & {
  title?: string;
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  neumorphic?: boolean;
};

export function Card({
  title,
  children,
  className = '',
  interactive = false,
  neumorphic = false,
  ...props
}: CardProps) {
  return (
    <article
      {...props}
      className={`${neumorphic ? 'neu-card border-border/50 bg-surface' : 'rounded-card border border-border/90 bg-surfaceRaised shadow-soft'} p-cardPad transition duration-200 ${interactive ? 'hover-lift cursor-pointer hover:border-accent2/40 hover:shadow-raised' : ''} ${className}`}
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
