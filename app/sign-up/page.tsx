import { SignUp } from '@clerk/nextjs';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignUpPage() {
  return (
    <Section>
      <Container className="max-w-xl">
        <Card className="space-y-5" title="Create your account">
          <p>Set up secure access to your Clarity Labs client vault and action plan.</p>
          {!isClerkConfigured ? (
            <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
              Account creation is not enabled in this environment yet. Please
              use the <a href="/contact">contact page</a> and we’ll follow up.
            </p>
          ) : (
            <div className="overflow-hidden rounded-card border border-border/70 bg-surface">
              <SignUp
                appearance={{
                  elements: {
                    card: 'shadow-none border-0 bg-transparent',
                    rootBox: 'w-full',
                  },
                }}
                fallbackRedirectUrl="/client"
                signInUrl="/sign-in"
              />
            </div>
          )}
        </Card>
      </Container>
    </Section>
  );
}
