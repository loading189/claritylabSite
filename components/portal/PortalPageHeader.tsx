export function PortalPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="rounded-card border border-border/80 bg-surface p-6 shadow-soft">
      {eyebrow ? (
        <p className="text-xs uppercase tracking-[0.16em] text-muted">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-2xl font-semibold text-text md:text-3xl">
        {title}
      </h1>
      <p className="mt-2 max-w-3xl text-sm text-muted md:text-base">
        {description}
      </p>
    </header>
  );
}
