import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Start Here',
  description:
    'New here? Start with a practical resource, then choose the next step that fits your situation.',
  alternates: {
    canonical: `${siteConfig.url}/start-here`,
  },
};

const actions = [
  {
    title: 'View Sample Report',
    description:
      'See the exact deliverable format before you decide to engage.',
    href: '/sample-report',
    event: 'start_here_sample_report_click',
  },
  {
    title: 'Get the AR Checklist',
    description:
      'Run the one-page collections cadence with your team this week.',
    href: '/resources/ar-recovery-checklist',
    event: 'start_here_checklist_click',
  },
  {
    title: 'Take the Diagnostic',
    description:
      'Use this when you want a quick read on where cash, capacity, and execution may be getting stuck.',
    href: '/scan',
    event: 'start_here_scan_click',
  },
];

export default function StartHerePage() {
  return (
    <Section>
      <Container className={styles.container}>
        <Reveal>
          <h1 className={styles.title}>Start here</h1>
          <p className={styles.intro}>
            This page is for service business owners who know something is
            leaking but want a clean next step. Pick one path below and move
            immediately: grab a resource, review the sample output, or take the
            diagnostic when you want a deeper read.
          </p>
        </Reveal>

        <div className={styles.grid}>
          {actions.map((action, index) => (
            <Reveal key={action.title} delay={index * 80}>
              <Card interactive className={styles.actionCard}>
                <h2 className="text-xl font-semibold text-text">
                  {action.title}
                </h2>
                <p className="mt-2 text-sm text-muted">{action.description}</p>
                <Button
                  href={action.href}
                  className="mt-5"
                  trackingEvent={action.event}
                  trackingProps={{ page: 'start_here' }}
                >
                  {action.title}
                </Button>
              </Card>
            </Reveal>
          ))}
        </div>

        <p className={styles.contactLine}>
          Prefer email?{' '}
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          {runtimeConfig.site.hasPhone ? (
            <>
              {' '}
              • <a href={`tel:${siteConfig.phone}`}>{siteConfig.phone}</a>
            </>
          ) : null}
        </p>
      </Container>
    </Section>
  );
}
