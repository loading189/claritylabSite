import { Metadata } from 'next';
import { Suspense } from 'react';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { ScanShell } from '@/components/marketing/ScanShell';
import { scanLandingContent } from '@/content/scan';
import { pickVariant } from '@/content/variants';
import { ScanWizard } from '@/components/marketing/ScanWizard';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: scanLandingContent.metadataTitle,
  description: scanLandingContent.metadataDescription,
};

export default function ScanPage() {
  const lead = pickVariant(scanLandingContent.lead);

  return (
    <Section>
      <Container className={styles.wrap}>
        <h1 className="text-4xl font-semibold tracking-tight text-text">
          {scanLandingContent.heading}
        </h1>
        <p className={styles.lead}>{lead}</p>
        <ScanShell>
          <Suspense
            fallback={
              <p className="text-sm text-muted">{scanLandingContent.loadingLabel}</p>
            }
          >
            <ScanWizard />
          </Suspense>
        </ScanShell>
      </Container>
    </Section>
  );
}
