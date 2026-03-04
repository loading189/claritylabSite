import { Metadata } from 'next';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Founder background and philosophy behind Clarity Labs.',
};

export default function AboutPage() {
  return (
    <Section>
      <Container className="max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Built by an operator who values clear decisions.</h1>
        <p className="mt-4 text-slate-700">
          I’m {siteConfig.founder}, founder of {siteConfig.name}. I built this practice for owners who are tired of
          noisy reporting and want practical guidance they can actually use in the real week-to-week business.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card title="What I believe">
            <p>
              Most small service companies do not need more software. They need sharper visibility into where time,
              cash, and handoffs are breaking. Clarity first. Tools second.
            </p>
          </Card>
          <Card title="How I work">
            <p>
              Direct, collaborative, and plain English. You’ll get an honest assessment, concrete priorities, and a
              realistic sequence for execution.
            </p>
          </Card>
        </div>

        <Card title="Quietly building the long-term product direction" className="mt-4">
          <p>
            Every client engagement informs a bigger product vision: audit-grade financial intelligence for service
            businesses. For now, this site is focused on one thing—earning trust and helping owners make better
            decisions quickly.
          </p>
        </Card>
      </Container>
    </Section>
  );
}
