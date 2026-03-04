import Link from 'next/link';
import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { IntakeForm } from '@/components/IntakeForm';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Audit Intake',
  description: 'Audit intake with secure token access.',
};

export default function AuditIntakePage({ searchParams }: { searchParams: { t?: string } }) {
  const token = searchParams.t || '';
  const valid = !process.env.INTAKE_TOKEN || token === process.env.INTAKE_TOKEN;

  if (!valid) {
    return (
      <Section>
        <Container className="max-w-2xl">
          <h1 className="text-3xl font-semibold text-slate-900">Audit intake link needed</h1>
          <p className="mt-3 text-slate-700">This intake is invite-only to reduce spam. Please request a fresh link.</p>
          <Link href="/contact" className="mt-5 inline-block text-sm font-semibold text-brand-700 underline">Go to contact</Link>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container className="max-w-3xl">
        <h1 className="text-3xl font-semibold text-slate-900">Audit Intake</h1>
        <p className="mt-2 text-sm text-slate-700">Operator detail up front means better findings later. Share what you can now.</p>
        <div className="mt-6">
          <IntakeForm type="audit" />
        </div>
      </Container>
    </Section>
  );
}
