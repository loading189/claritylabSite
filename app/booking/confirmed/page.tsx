import { Button } from '@/components/Button';

export default function BookingConfirmedPage({
  searchParams,
}: {
  searchParams?: {
    signal?: string;
    score?: string;
    tier?: string;
  };
}) {
  const signal = searchParams?.signal || 'your top signal';
  const score = searchParams?.score || '—';
  const tier = searchParams?.tier || '—';

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <header className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Booking confirmed</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">You are booked. We are ready.</h1>
        <p className="mt-3 text-sm text-muted">
          Thanks for booking your Clarity call. We will keep this practical and focused on what matters most.
        </p>
        <p className="mt-3 text-sm text-text">
          Diagnostic reminder: <strong className="capitalize">{signal}</strong> signal, score <strong>{score}</strong>, tier{' '}
          <strong className="capitalize">{tier}</strong>.
        </p>
      </header>

      <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Preparation checklist</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">Top 2–3 operational issues causing the most friction right now.</li>
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">Any basic report you already use (cash, margin, workload, or pipeline).</li>
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">One recent example where work stalled, delayed, or cost more than expected.</li>
        </ul>
      </article>

      <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-text">What to bring to the call</h2>
        <p className="mt-3 text-sm text-muted">
          You do not need polished reports. Bring what you have, even if it is messy. We will use it to choose a clean first move.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button href="/client/prep" variant="secondary">
            Open prep workspace
          </Button>
          <Button href="/client/scan" variant="ghost">
            Review diagnostic
          </Button>
        </div>
      </article>
    </section>
  );
}
