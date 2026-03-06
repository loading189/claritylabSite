import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { IntakeForm } from '@/components/IntakeForm';
import { Section } from '@/components/Section';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Clarity Call Intake',
  description: 'Structured intake to prepare your Clarity Call.',
};

export default function CallIntakePage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-text">
          Clarity Call Intake
        </h1>
        <p className="mt-2 text-sm text-muted">
          Share a little context now so we can spend your call on clear decisions.
        </p>
        <div className="mt-6 rounded-card border border-border bg-surface p-4 shadow-soft">
          <IntakeForm type="call" />
        </div>
      </Container>
    </Section>
  );
}
