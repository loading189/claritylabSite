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
            ? 'I may not be the best fit based on what you shared. I can still offer a call and point you to practical alternatives.'
            : 'Great — book your Clarity Call so we can move from input to action.'}
        </p>
        {isCold ? (
          <ul className="mt-4 list-disc pl-5 text-sm text-slate-700">
            <li>Bookkeeping-only needs: start with a local bookkeeping specialist.</li>
            <li>Very early-stage/no volume: focus on offer and sales pipeline first.</li>
            <li>Still want guidance? You can still book a short call.</li>
          </ul>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={siteConfig.calendlyUrl || '/contact'}>Book your Clarity Call</Button>
          <Button href="/resources" variant="ghost">Get free resources</Button>
        </div>
      </Container>
    </Section>
  );
}
