import { Card } from '@/components/Card';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

export default function SignInPage() {
  return (
    <Section>
      <Container className="max-w-xl">
        <Card title="Sign in">
          <p>Sign-in is handled by Clerk in production. If you are in local/dev, pass auth headers through your proxy for testing protected routes.</p>
        </Card>
      </Container>
    </Section>
  );
}
