import { Metadata } from 'next';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Sample Report',
  description: 'A lightweight preview of Clarity Labs audit outputs and what you can get for your business.',
};

export default function SampleReportPage() {
  return (
    <>
      <Section>
        <Container>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900">Sample audit preview</h1>
          <p className="mt-4 max-w-2xl text-slate-700">
            Mock data example showing the type of scorecards and recommendations included in a Clarity Labs audit.
          </p>

          <div className="mt-6 rounded-lg border border-brand-200 bg-brand-50 p-4">
            <p className="text-sm text-brand-900">Want this for your business? We can build this with your numbers in a focused audit.</p>
            <Button href={siteConfig.calendlyUrl || '/contact'} className="mt-3">
              Book a 15-min Clarity Call
            </Button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            <Card title="AR & cash flow">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th>Bucket</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>0–30 days</td><td>$112,000</td></tr>
                  <tr><td>31–60 days</td><td>$48,000</td></tr>
                  <tr><td>61–90 days</td><td>$21,500</td></tr>
                  <tr><td>90+ days</td><td>$17,200</td></tr>
                </tbody>
              </table>
              <p className="mt-4">DSO: 54 days. Recommendation: launch a 90-day collections sprint and tighten payment terms.</p>
            </Card>

            <Card title="Technician productivity">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th>Metric</th>
                    <th>Current</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Utilization</td><td>68%</td></tr>
                  <tr><td>Revenue per tech/day</td><td>$1,040</td></tr>
                  <tr><td>Rework rate</td><td>8.4%</td></tr>
                </tbody>
              </table>
              <p className="mt-4">Recommendation: close dispatch gaps and track first-time-fix consistency weekly.</p>
            </Card>

            <Card title="Workflow gaps">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-slate-500">
                    <th>Checkpoint</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Card on file at booking</td><td>Partial</td></tr>
                  <tr><td>Invoice sent within 24h</td><td>63%</td></tr>
                  <tr><td>Follow-up cadence</td><td>Inconsistent</td></tr>
                </tbody>
              </table>
              <p className="mt-4">Recommendation: standardize closeout checklist and automate post-job follow-up triggers.</p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section className="bg-white">
        <Container className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
          <h2 className="text-2xl font-semibold text-slate-900">Get this for your business</h2>
          <p className="mt-3 max-w-2xl text-slate-700">
            Bring your own data, and you’ll get a deliverable-driven audit with clear next actions and optional implementation support.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button href={siteConfig.calendlyUrl || '/contact'}>Book a 15-min Clarity Call</Button>
            <Button href="/audit" variant="ghost">
              Request an audit
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
