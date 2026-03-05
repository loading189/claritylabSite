import { Card } from '@/components/Card';
import { DataMotif } from '@/components/brand/DataMotif';
import { BrandConcept, BrandIcon } from '@/components/brand/iconMap';
import { Reveal } from '@/components/Reveal';
import { TextureOverlay } from '@/components/brand/TextureOverlay';

type ProcessStep = {
  step: string;
  description: string;
};

type ProcessStepsProps = {
  steps: ProcessStep[];
};

const stepIcons: BrandConcept[] = [
  'diagnose',
  'analyze',
  'optimize',
  'stabilize',
];

export function ProcessSteps({ steps }: ProcessStepsProps) {
  return (
    <div className="relative mt-6">
      <TextureOverlay variant="grid" className="rounded-card" />
      <div className="relative z-10 grid gap-4 md:grid-cols-4">
        {steps.map((item, index) => (
          <Reveal key={item.step} delay={index * 60}>
            <Card interactive neumorphic>
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                  Step {index + 1}
                </p>
                <BrandIcon concept={stepIcons[index] ?? 'workflow'} size={16} />
              </div>
              <h3 className="mt-2 text-lg font-bold text-text">{item.step}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
              <DataMotif variant="signal" className="mt-3" />
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
