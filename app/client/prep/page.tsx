import { Button } from '@/components/Button';
import { PortalPageHeader } from '@/components/portal/PortalPageHeader';
import { getClientByEmail } from '@/lib/bookingsData';
import { getAdvisoryBriefFromDiagnostic } from '@/lib/diagnosticGuidance';
import { getLatestDiagnosticByEmailWithStatus } from '@/lib/diagnosticsData';
import { getServerUser } from '@/lib/serverAuth';

const defaultChecklist = [
  'Your latest P&L and any cash snapshot you already track.',
  'A short list of current bottlenecks from the last 30 days.',
  'One or two examples of jobs that slowed down or got stuck.',
  'Any KPI report, dashboard, or weekly scorecard you already use.',
];

const defaultQuestions = [
  'Where are we losing the most time each week?',
  'What is the smallest change that could ease pressure fast?',
  'What should we track first so progress is clear?',
];

function formatDateTime(startTime?: string | null, timezone?: string | null) {
  if (!startTime) return 'Once booked, details appear here.';
  const date = new Date(startTime);
  if (Number.isNaN(date.getTime())) return startTime;

  try {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone || 'UTC',
    }).format(date);
  } catch {
    return date.toISOString();
  }
}

export default async function ClientPrepPage() {
  const user = await getServerUser();
  const client = user?.email ? await getClientByEmail(user.email) : null;
  const diagnosticResult = user?.email
    ? await getLatestDiagnosticByEmailWithStatus(user.email)
    : { record: null, status: 'error' as const };
  const diagnostic = diagnosticResult.record;
  const brief = diagnostic ? getAdvisoryBriefFromDiagnostic(diagnostic) : null;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';
  const isBooked = client?.status === 'booked';

  const prepItems = brief?.prepItems?.length ? brief.prepItems : defaultChecklist;
  const startPoints = brief?.whereToStart?.slice(0, 2) || [];

  return (
    <div className="space-y-6">
      <PortalPageHeader
        eyebrow="Call prep"
        title="Prepare for your call"
        description="This page helps you gather the right numbers, reports, examples, and questions before we meet."
      />

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Booked session</h2>
          <p className="mt-3 text-sm text-muted">
            <strong className="text-text">Scheduled:</strong> {formatDateTime(client?.booked_start_time, client?.booked_timezone)}
          </p>
          <p className="mt-2 text-sm text-muted">
            <strong className="text-text">Timezone:</strong> {client?.booked_timezone || 'Pending'}
          </p>
          <Button href={calendlyUrl} variant="ghost" className="mt-4">
            {isBooked ? 'View booking details' : 'Book call'}
          </Button>
        </article>

        <article className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">What to expect</h2>
          <p className="mt-3 text-sm text-muted">
            In 45 minutes, we will review what is slowing the business down, agree on where to start, and set practical next steps.
          </p>
          <Button href="/client/scan" variant="secondary" className="mt-4">
            Review diagnostic results
          </Button>
        </article>
      </section>

      {brief ? (
        <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
          <h2 className="text-lg font-semibold text-text">Prep focus from your scan</h2>
          <p className="mt-2 text-sm text-muted">{brief.shortSummary}</p>
          {startPoints.length ? (
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {startPoints.map((point) => (
                <li key={point} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                  {point}
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Bring these numbers and reports</h2>
        <p className="mt-2 text-sm text-muted">If these numbers are hard to pull together, that tells us something too.</p>
        <ul className="mt-4 space-y-3">
          {prepItems.map((item, index) => (
            <li key={item} className="flex gap-3 rounded-input border border-border/70 bg-surfaceRaised px-3 py-2 text-sm text-muted">
              <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Bring examples and questions</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-semibold text-text">Examples to bring</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                One job or invoice that went smoothly.
              </li>
              <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                One recent case where work slowed down, was delayed, or had to be reworked.
              </li>
              <li className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                One handoff between teams that still feels messy.
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text">Questions we can answer together</h3>
            <ul className="mt-2 space-y-2 text-sm text-muted">
              {(brief?.discussionPoints?.length ? brief.discussionPoints : defaultQuestions).map((question) => (
                <li key={question} className="rounded-input border border-border/70 bg-surfaceRaised px-3 py-2">
                  {question}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="rounded-card border border-border bg-surface p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-text">Upload supporting files</h2>
        <p className="mt-2 text-sm text-muted">Bring what you already have. We can work from there.</p>
        <Button href="/client/files" className="mt-4">
          Upload documents
        </Button>
      </section>
    </div>
  );
}
