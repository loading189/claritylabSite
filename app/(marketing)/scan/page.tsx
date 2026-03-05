import { Metadata } from 'next';
import { ScanShell } from '@/components/marketing/ScanShell';
import { ScanWizard } from '@/components/marketing/ScanWizard';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Clarity Scan',
  description:
    'Run a fast operational diagnostic and get your score, insights, and recommended next step.',
  alternates: { canonical: `${siteConfig.url}/scan` },
};

export default function ScanPage({
  searchParams,
}: {
  searchParams: {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
  };
}) {
  return (
    <section className={styles.scanPage}>
      <ScanShell
        title="Run a 4-minute diagnostic before booking."
        subtitle="Answer six focused steps to get your Operational Health Score, quick insights, and the right next move."
      >
        <ScanWizard utm={searchParams} />
      </ScanShell>
    </section>
  );
}
