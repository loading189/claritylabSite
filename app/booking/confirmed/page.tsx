import { Button } from '@/components/Button';
import {
  formatScheduledWindow,
  getPrepChecklist,
  getSignalMeaning,
  getSignalResource,
  parseBookingConfirmationContext,
} from '@/lib/bookingConfirmation';

export default function BookingConfirmedPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const context = parseBookingConfirmationContext(searchParams);
  const signal = context.signal || 'your strongest signal';
  const secondarySignal = context.secondarySignal;
  const score = context.score ?? '—';
  const tier = context.tier || '—';
  const scheduledTime = formatScheduledWindow(context);
  const checklist = getPrepChecklist(context.signal);
  const meaning = getSignalMeaning(context.signal);
  const resource = getSignalResource(context.signal);
  const hasDiagnostic = Boolean(context.diagnosticId);

  return (
    <section className="mx-auto max-w-3xl space-y-6 px-4 py-16">
      <header className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <p className="text-xs uppercase tracking-[0.14em] text-muted">Booking confirmed</p>
        <h1 className="mt-2 text-3xl font-semibold text-text">You’re booked.</h1>
        <p className="mt-3 text-sm text-muted">
          Thanks for booking your Clarity call. We’ll keep this practical and focused on what matters most.
        </p>

        {scheduledTime ? (
          <p className="mt-3 text-sm text-text">
            <strong>Call time:</strong> {scheduledTime}
          </p>
        ) : null}

        <p className="mt-3 text-sm text-text">
          Scan reminder: <strong className="capitalize">{signal}</strong>
          {secondarySignal ? (
            <>
              {' '}
              with secondary <strong className="capitalize">{secondarySignal}</strong>
            </>
          ) : null}
          , score <strong>{score}</strong>, tier <strong className="capitalize">{tier}</strong>.
        </p>
        <p className="mt-2 text-sm text-muted">{meaning}</p>
      </header>

      <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Here’s what happens next</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
            We’ll review your scan and anything you share before the call.
          </li>
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
            On the call, we’ll identify the first move that reduces pressure fastest.
          </li>
          <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
            You’ll leave with a clear next step, not a long list of homework.
          </li>
        </ol>
      </article>

      <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Here’s what to bring</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted">
          {checklist.map((item) => (
            <li key={item} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </article>

      <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-xl font-semibold text-text">Keep going in Clarity Labs</h2>
        <p className="mt-3 text-sm text-muted">
          You’re still on the same path: scan → booking → prep → engagement.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {hasDiagnostic ? (
            <Button href="/client/scan" variant="secondary">
              Review your scan results
            </Button>
          ) : null}
          <Button href="/client/prep">Open prep page</Button>
          <Button href={resource.href} variant="ghost">
            Read: {resource.title}
          </Button>
        </div>
      </article>
    </section>
  );
}
