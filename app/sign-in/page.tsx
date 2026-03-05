import { SignIn } from '@clerk/nextjs';
import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

const isClerkConfigured = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

export default function SignInPage() {
  return (
    <Section>
      <Container className="max-w-xl">
        <Card className="space-y-5" title="Sign in">
          <p>Use your secure portal credentials to access your client workspace.</p>
          {!isClerkConfigured ? (
            <p className="rounded-lg border border-border bg-card p-3 text-sm text-muted">
              The portal is not configured in this environment yet. Please use
              the <a href="/contact">contact page</a> and we’ll help you with
              access.
            </p>
          ) : (
            <div className="overflow-hidden rounded-card border border-border/70 bg-surface">
              <SignIn
                appearance={{
                  elements: {
                    card: 'shadow-none border-0 bg-transparent',
                    rootBox: 'w-full',
                  },
                }}
                fallbackRedirectUrl="/client"
                signUpUrl="/sign-up"
              />
            </div>
          )}
        </Card>
      </Container>
    </Section>
  );
}
