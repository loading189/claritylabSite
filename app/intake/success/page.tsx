import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Container } from '@/components/Container';
import { ScoreBadge } from '@/components/ScoreBadge';
import { Section } from '@/components/Section';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Intake Received',
  description: 'Your intake was received and next steps are ready.',
};

export default function IntakeSuccessPage({ searchParams }: { searchParams: { intake_type?: string; tier?: string } }) {
  const tier = searchParams.tier || 'Warm';
  const isCold = tier === 'Cold';

  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900">Thanks — intake received.</h1>
        <div className="mt-3"><ScoreBadge tier={tier} /></div>
        <p className="mt-4 text-slate-700">
          {isCold
            ? 'Based on what you shared, I may not be the best fit right now. I can still offer a short call and point you to practical alternatives.'
            : 'Thanks for sharing this. Your next step is to book a call so we can turn this into a simple action plan.'}
        </p>
        {isCold ? (
          <ul className="mt-4 list-disc pl-5 text-sm text-slate-700">
            <li>If your main need is bookkeeping, start with a local bookkeeping specialist.</li>
            <li>If volume is still very low, focus first on sales consistency.</li>
            <li>If a short second opinion would help, you can still book a call.</li>
          </ul>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={siteConfig.calendlyUrl || '/contact'}>Book your call</Button>
          <Button href="/resources" variant="ghost">Browse free resources</Button>
        </div>
      </Container>
    </Section>
  );
}
