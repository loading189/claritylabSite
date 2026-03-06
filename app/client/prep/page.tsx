import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getClientByEmail } from '@/lib/bookingsData';
import { getServerUser } from '@/lib/serverAuth';

const checklist = [
  'Expect a focused 45-minute operator session with clear next steps.',
  'Bring your top 2–3 operational bottlenecks from the last 30 days.',
  'Have basic numbers ready: cash pressure, capacity constraints, and workflow blockers.',
  'Bring any current KPI dashboard or weekly reporting snapshot if you use one.',
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
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || '/contact';

  return (
    <div className="space-y-4">
      <Card title="Prep for your Clarity Call">
        <p>Keep this simple: a little prep gives us a much sharper plan during the call.</p>
      </Card>

      <Card title="Booked details">
        <p>
          <strong>Scheduled:</strong> {formatDateTime(client?.booked_start_time, client?.booked_timezone)}
        </p>
        <p>
          <strong>Timezone:</strong> {client?.booked_timezone || 'Pending'}
        </p>
        <Button href={calendlyUrl} variant="ghost" className="mt-4">
          If you haven&apos;t booked yet, book now
        </Button>
      </Card>

      <Card title="Call prep checklist">
        <ul className="list-disc space-y-2 pl-5">
          {checklist.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Card>

      <Card title="Optional documents">
        <p>If it helps, upload any supporting files before the call.</p>
        <Button href="/client/files" variant="ghost" className="mt-4">
          Upload documents (optional)
        </Button>
      </Card>
    </div>
  );
}
