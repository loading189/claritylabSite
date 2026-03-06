import Link from 'next/link';
import { SignIn } from '@clerk/nextjs';
import { Container } from '@/components/Container';
import { getClerkConfig } from '@/lib/clerkConfig';

const isClerkConfigured = getClerkConfig().clerkProviderEnabled;

export default function SignInPage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-5xl">
        <div className="grid overflow-hidden rounded-card border border-border bg-surface shadow-soft md:grid-cols-[1.1fr_1fr]">
          <div className="border-b border-border/80 p-8 md:border-b-0 md:border-r md:p-10">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Secure portal access</p>
            <h1 className="mt-3 text-3xl font-semibold text-text md:text-4xl">Sign in to your client vault</h1>
            <p className="mt-4 text-sm text-muted md:text-base">
              Your diagnostic history, audit files, and delivery materials live in this secure workspace.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>• Encrypted auth and session controls.</li>
              <li>• Centralized file vault for reports and supporting docs.</li>
              <li>• Operator-ready dashboard for next steps.</li>
            </ul>
          </div>

          <div className="p-6 md:p-8">
            {!isClerkConfigured ? (
              <div className="rounded-card border border-border bg-surfaceRaised p-5">
                <p className="text-sm text-muted">
                  Portal auth is not configured in this environment yet. Use the{' '}
                  <Link href="/contact" className="text-accent underline">
                    contact page
                  </Link>{' '}
                  and we&apos;ll help with access.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
