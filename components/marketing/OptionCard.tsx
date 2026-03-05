import { ReactNode } from 'react';

type OptionCardProps = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  children?: ReactNode;
};

export function OptionCard({
  label,
  description,
  selected,
  onSelect,
  children,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-card border p-4 text-left transition duration-200 motion-reduce:transition-none ${
        selected
          ? 'border-accent bg-accent/15 shadow-raised'
          : 'border-border bg-surfaceRaised hover:border-accent2/45 hover:bg-surface'
      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg`}
      aria-pressed={selected}
    >
      <p className="text-base font-semibold text-text">{label}</p>
      {description ? (
        <p className="mt-1 text-sm text-muted">{description}</p>
      ) : null}
      {children}
    </button>
  );
}
