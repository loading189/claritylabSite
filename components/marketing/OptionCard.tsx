'use client';

type OptionCardProps = {
  label: string;
  description: string;
  selected?: boolean;
  onClick: () => void;
};

export function OptionCard({
  label,
  description,
  selected,
  onClick,
}: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-card border p-4 text-left transition ${
        selected
          ? 'border-accent bg-surfaceRaised shadow-soft'
          : 'border-border bg-surface hover:border-accent/40'
      }`}
    >
      <p className="font-semibold text-text">{label}</p>
      <p className="mt-1 text-sm text-muted">{description}</p>
    </button>
  );
}
