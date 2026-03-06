import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

const checklist = [
  'Expect a focused 45-minute operator session with clear next steps.',
  'Bring your top 2–3 operational bottlenecks from the last 30 days.',
  'Have basic numbers ready: cash pressure, capacity constraints, and workflow blockers.',
  'Bring any current KPI dashboard or weekly reporting snapshot if you use one.',
];

export default function ClientPrepPage() {
  return (
    <div className="space-y-4">
      <Card title="Prep for your Clarity Call">
        <p>Keep this simple: a little prep gives us a much sharper plan during the call.</p>
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
