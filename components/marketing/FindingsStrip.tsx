import { Card } from '@/components/Card';
import { Reveal } from '@/components/Reveal';

type FindingsStripProps = {
  findings: string[];
};

export function FindingsStrip({ findings }: FindingsStripProps) {
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-3">
      {findings.map((finding, index) => (
        <Reveal key={finding} delay={index * 50}>
          <Card>
            <p>{finding}</p>
          </Card>
        </Reveal>
      ))}
    </div>
  );
}
