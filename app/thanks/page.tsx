import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Thanks — next steps',
  description:
    'Thanks for booking. Here is what to prepare before your clarity audit call.',
};

export default function ThanksPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <Card
          className="border-accent/40 bg-gradient-subtle"
          title="You’re booked"
        >
          <p className="max-w-2xl text-sm text-muted sm:text-base">
            Thanks — next steps are simple. Bring the items below so we can
            focus the call on fast, practical wins.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Card title="Prepare these before the call">
              <FeatureList
                items={[
                  'AR aging report (current month + prior month if available)',
                  'Invoice turnaround timing from job close to send date',
                  'Primary tools list (FSM, accounting, dispatch, payment tools)',
                  'Top 2 workflow bottlenecks your team feels weekly',
                ]}
              />
            </Card>
            <Card title="What happens next">
              <FeatureList
                items={[
                  'We align on your highest-pressure objective first',
                  'We identify likely leaks in cash, margin, and execution',
                  'You leave with a clear recommendation and immediate next step',
                ]}
              />
            </Card>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/">Back to home</Button>
            <Button href="/sample-report" variant="ghost">
              View Sample Report
            </Button>
            <Button href="/insights" variant="secondary">
              Read Insights
            </Button>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
