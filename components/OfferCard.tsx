import { Button } from './Button';
import { Card } from './Card';
import { FeatureList } from './FeatureList';
import { TrackOnMount } from './TrackOnMount';

type OfferCardProps = {
  id: string;
  title: string;
  description: string;
  whoItsFor: string[];
  whatYouGet: string[];
  howItWorks: string[];
  timeframe: string;
  ctaLabel: string;
  ctaHref: string;
};

export function OfferCard({
  id,
  title,
  description,
  whoItsFor,
  whatYouGet,
  howItWorks,
  timeframe,
  ctaLabel,
  ctaHref,
}: OfferCardProps) {
  return (
    <Card title={title} interactive>
      <TrackOnMount eventName="offer_view" props={{ offer: id }} />
      <p className="text-sm text-muted">{description}</p>

      <div className="mt-5 space-y-5 text-sm text-muted">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted/80">
            Who it&apos;s for
          </h3>
          <div className="mt-2">
            <FeatureList items={whoItsFor} />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted/80">
            What you get
          </h3>
          <div className="mt-2">
            <FeatureList items={whatYouGet} />
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted/80">
            How it works
          </h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            {howItWorks.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </section>

        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-muted/80">
            Timeframe
          </h3>
          <p className="mt-2">{timeframe}</p>
        </section>
      </div>

      <Button
        href={ctaHref}
        className="mt-6"
        trackingEvent="offer_cta_click"
        trackingProps={{ offer: id, cta: ctaLabel }}
      >
        {ctaLabel}
      </Button>
    </Card>
  );
}
