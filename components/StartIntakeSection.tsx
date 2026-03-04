import { Button } from './Button';

export function StartIntakeSection({ where }: { where: string }) {
  return (
    <div className="mt-8 rounded-lg border border-slate-200 bg-white p-5">
      <h3 className="text-lg font-semibold text-slate-900">Start Intake</h3>
      <p className="mt-2 text-sm text-slate-700">Prefer a structured start? Share context first so we can keep calls focused.</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button href="/intake/call" trackingEvent="intake_cta_click" trackingProps={{ where, type: 'call' }}>
          Clarity Call Intake
        </Button>
        <Button href="/intake/audit" variant="secondary" trackingEvent="intake_cta_click" trackingProps={{ where, type: 'audit' }}>
          Audit Intake
        </Button>
      </div>
    </div>
  );
}
