import { Metadata } from 'next';
import { Container } from '@/components/Container';
import { OfferCard } from '@/components/OfferCard';
import { Reveal } from '@/components/Reveal';
import { Section } from '@/components/Section';
import { StartIntakeSection } from '@/components/StartIntakeSection';
import { TrustList } from '@/components/TrustList';
import { siteConfig } from '@/content/site';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Work With Me',
  description:
    'Choose the right engagement: Clarity Audit, Implementation Sprint, or Ongoing Advisory support.',
};

const offers = [
  {
    id: 'clarity_audit',
    title: 'Clarity Audit',
    description:
      'Deep analysis of financial and operational workflows so you can see what is actually causing pressure.',
    whoItsFor: [
      'Cash is tighter than revenue would suggest.',
      'Work is getting done but results feel inconsistent.',
      'You need a focused outside read before making bigger changes.',
    ],
    whatYouGet: [
      'AR aging + recovery plan',
      'Cash flow pressure points',
      'Technician productivity snapshot',
      'Workflow leak analysis',
      '90-day action plan',
      'Written report + walkthrough call',
    ],
    howItWorks: [
      'Kickoff to align scope and data access',
      'Audit and signal review',
      'Report delivery and walkthrough call',
    ],
    timeframe: 'Typically 1–2 weeks.',
    ctaLabel: 'Start Diagnostic',
    ctaHref: '/scan',
  },
  {
    id: 'implementation_sprint',
    title: 'Implementation Sprint',
    description:
      'Hands-on execution of the highest-impact fixes identified in your audit.',
    whoItsFor: [
      'You already know the issues and need fast execution.',
      'Your team needs process structure, not more tools.',
      'You want clear ownership and SOPs for repeatable outcomes.',
    ],
    whatYouGet: [
      'Workflow redesign',
      'Automation triggers',
      'Invoicing process improvements',
      'Reporting dashboards',
      'SOP documentation',
    ],
    howItWorks: [
      'Prioritize sprint goals',
      'Build and implement process changes',
      'Handoff SOPs and dashboard tracking',
    ],
    timeframe: 'Typically 2–4 weeks.',
    ctaLabel: 'Start Diagnostic',
    ctaHref: '/scan',
  },
  {
    id: 'ongoing_advisory',
    title: 'Ongoing Advisory',
    description:
      'Light monthly support to keep improvements moving without adding full-time overhead.',
    whoItsFor: [
      'You want accountability after implementation.',
      'You need quick operator-level feedback each month.',
      'You want KPI visibility with practical next steps.',
    ],
    whatYouGet: [
      'Monthly reviews',
      'Workflow tweaks',
      'KPI tracking',
      'Implementation support',
    ],
    howItWorks: [
      'Monthly review meeting',
      'Prioritized adjustments',
      'Support between sessions as needed',
    ],
    timeframe: 'Month-to-month support cadence.',
    ctaLabel: 'Start Diagnostic',
    ctaHref: '/scan',
  },
];

export default function WorkWithMePage() {
  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType:
      'Operational consulting and financial workflow audits for service businesses',
    provider: {
      '@type': 'ProfessionalService',
      name: siteConfig.name,
    },
    areaServed: 'United States',
    description:
      'Clarity Audit, Implementation Sprint, and Ongoing Advisory services for service business owners who want practical fixes and clear execution plans.',
  };

  return (
    <>
      <Section>
        <Container className={styles.heroContainer}>
          <Reveal>
            <h1 className="text-4xl font-semibold tracking-tight text-text">
              Work With Me
            </h1>
          </Reveal>
          <Reveal delay={80}>
            <p className="mt-4 max-w-3xl text-muted">
              If you want clarity without a long pitch process, start with the
              offer that matches where your business is right now. Every
              engagement is built around practical fixes your team can actually
              run.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section className={styles.offerSection}>
        <Container className={styles.offerGrid}>
          {offers.map((offer) => (
            <OfferCard key={offer.id} {...offer} />
          ))}
        </Container>
      </Section>

      <Section>
        <Container className={styles.trustContainer}>
          <TrustList />
          <StartIntakeSection where="work_with_me" />
        </Container>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}
