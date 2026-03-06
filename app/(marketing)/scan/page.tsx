import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ScanShell } from '@/components/marketing/ScanShell';
import { ScanWizard } from '@/components/marketing/ScanWizard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Clarity Scan',
  description:
    'Use the 6-step Clarity Scan when you want a deeper read before booking a call.',
};

export default function ScanPage() {
  return (
    <Section>
      <Container className={styles.wrap}>
        <h1 className="text-4xl font-semibold tracking-tight text-text">
          Clarity Scan
        </h1>
        <p className={styles.lead}>
          In about two minutes, identify your strongest operational signal and
          decide whether a call is the right next step.
        </p>
        <ScanShell>
          <Suspense
            fallback={<p className="text-sm text-muted">Loading scan…</p>}
          >
            <ScanWizard />
          </Suspense>
        </ScanShell>
      </Container>
    </Section>
  );
}
