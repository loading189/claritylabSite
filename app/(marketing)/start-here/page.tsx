import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { startHereContent } from '@/content/marketing';
import { runtimeConfig } from '@/content/runtime';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Start Here',
  description: startHereContent.metadataDescription,
  alternates: {
    canonical: `${siteConfig.url}/start-here`,
  },
};

export default function StartHerePage() {
  return (
    <Section>
      <Container className={styles.container}>
        <Reveal>
          <h1 className={styles.title}>{startHereContent.heading}</h1>
          <p className={styles.intro}>{startHereContent.intro}</p>
        </Reveal>

        <div className={styles.grid}>
          {startHereContent.actions.map((action, index) => (
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
          {startHereContent.contactPrefix}{' '}
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
