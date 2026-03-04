import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { IntakeForm } from '@/components/IntakeForm';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Clarity Call Intake',
  description: 'Structured intake to prepare your Clarity Call.',
};

export default function CallIntakePage() {
  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900">Clarity Call Intake</h1>
        <p className="mt-2 text-sm text-slate-700">Give me context now so we can use your call for decisions, not discovery theater.</p>
        <div className="mt-6">
          <IntakeForm type="call" />
        </div>
      </Container>
    </Section>
  );
}
