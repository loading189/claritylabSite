import { Button } from '@/components/Button';

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface p-6 text-center shadow-soft">
      <h2 className="text-lg font-semibold text-text">{title}</h2>
      <p className="mt-2 text-sm text-muted">{description}</p>
      <Button href={actionHref} className="mt-4">
        {actionLabel}
      </Button>
    </div>
  );
}
