import { Card } from '@/components/Card';
import { Reveal } from '@/components/Reveal';

type ProcessStep = {
  step: string;
  description: string;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
};

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-4">
      {steps.map((item, index) => (
        <Reveal key={item.step} delay={index * 60}>
          <Card interactive>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
              Step {index + 1}
            </p>
            <h3 className="mt-2 text-lg font-bold text-text">{item.step}</h3>
            <p className="mt-2 text-sm text-muted">{item.description}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
