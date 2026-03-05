import { Metadata } from 'next';
import { BrandIcon } from '@/components/brand/iconMap';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { FeatureList } from '@/components/FeatureList';
import { Section } from '@/components/Section';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Thanks — next steps',
  description:
    'Thanks for booking. Here is what to prepare before your clarity audit call.',
};

export default function ThanksPage() {
  return (
    <Section>
      <Container className={styles.container}>
        <Card className={styles.heroCard} neumorphic>
          <h1 className="inline-flex items-center gap-2 text-2xl font-semibold text-text">
            <BrandIcon concept="proof" size={18} />
            You’re booked
          </h1>
          <p className="max-w-2xl text-sm text-muted sm:text-base">
            Thanks — next steps are simple. Bring the items below so we can
            focus the call on fast, practical wins.
          </p>
          <div className={styles.gridTwo}>
            <Card title="Prepare these before the call" neumorphic>
              <FeatureList
                items={[
                  'AR aging report (current month + prior month if available)',
                  'Invoice turnaround timing from job close to send date',
                  'Primary tools list (FSM, accounting, dispatch, payment tools)',
                  'Top 2 workflow bottlenecks your team feels weekly',
                ]}
              />
            </Card>
            <Card title="What happens next" neumorphic>
              <FeatureList
                items={[
                  'We align on your highest-pressure objective first',
                  'We identify likely leaks in cash, margin, and execution',
                  'You leave with a clear recommendation and immediate next step',
                ]}
              />
            </Card>
          </div>
          <div className={styles.actions}>
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
