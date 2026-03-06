import Link from 'next/link';
import { SignUp } from '@clerk/nextjs';
import { Container } from '@/components/Container';
import { getClerkConfig } from '@/lib/clerkConfig';

const isClerkConfigured = getClerkConfig().clerkProviderEnabled;

export default function SignUpPage() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-5xl">
        <div className="grid overflow-hidden rounded-card border border-border bg-surface shadow-soft md:grid-cols-[1.1fr_1fr]">
          <div className="border-b border-border/80 p-8 md:border-b-0 md:border-r md:p-10">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Client onboarding</p>
            <h1 className="mt-3 text-3xl font-semibold text-text md:text-4xl">Create secure portal access</h1>
            <p className="mt-4 text-sm text-muted md:text-base">
              Set up your account to access diagnostic results, prep checklists, and protected delivery files.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-muted">
              <li>• Access your diagnostic and score interpretation.</li>
              <li>• Upload and manage audit materials in one vault.</li>
              <li>• Track next actions without leaving the workspace.</li>
            </ul>
          </div>

          <div className="p-6 md:p-8">
            {!isClerkConfigured ? (
              <div className="rounded-card border border-border bg-surfaceRaised p-5">
                <p className="text-sm text-muted">
                  Account creation is not enabled in this environment yet. Use the{' '}
                  <Link href="/contact" className="text-accent underline">
                    contact page
                  </Link>{' '}
                  and we&apos;ll follow up with access.
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
