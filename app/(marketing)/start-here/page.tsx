import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { MarketingHero } from '@/components/marketing/MarketingHero';
import { NextStepCTA } from '@/components/marketing/NextStepCTA';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Start Here',
  description:
    'New here? Start with the Clarity Scan, sample report preview, or AR checklist in under two minutes.',
  alternates: {
    canonical: `${siteConfig.url}/start-here`,
  },
};

const actions = [
  {
    title: 'Start Diagnostic',
    description:
      'Best first step if you want a focused review of cash, capacity, and execution leaks.',
    href: '/scan',
    event: 'start_here_book_click',
  },
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
];

export default function StartHerePage() {
  return (
    <Section>
      <Container className={styles.container}>
        <Reveal>
          <MarketingHero
            badge="Start Here"
            title="Pick the fastest path to clarity."
            description="This page is for service business owners who know something is leaking but want a clean next step."
            trackingPage="start_here"
          />
        </Reveal>

        <div className={styles.grid}>
          {actions.map((action, index) => (
            <Reveal key={action.title} delay={index * 80}>
              <Card interactive className={styles.actionCard} neumorphic>
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

        <Card className={styles.nextCard} neumorphic>
          <NextStepCTA
            title="Want a quick recommendation first?"
            subtitle="Use one of the three paths above and we will help you choose the right next move."
            trackingPage="start_here_next"
          />
        </Card>

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
