import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/app/api/_utils/rateLimit';
import { ensureClientFromDiagnostic, getDiagnosticById } from '@/lib/diagnosticsData';
import { getServerUser } from '@/lib/serverAuth';

const readIp = (request: NextRequest) => request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';

export async function POST(request: NextRequest) {
  try {
    const user = await getServerUser();
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }

    const ip = readIp(request);
    const rateLimit = checkRateLimit(ip, 'admin_invite_from_diagnostic');
    if (rateLimit.limited) {
      return NextResponse.json({ ok: false, error: 'Too many requests. Please wait and retry.' }, { status: 429 });
    }

    const body = (await request.json()) as { diagnosticId?: string };
    const diagnosticId = (body.diagnosticId || '').trim();
    if (!diagnosticId) {
      return NextResponse.json({ ok: false, error: 'diagnosticId is required.' }, { status: 400 });
    }

    const diagnostic = await getDiagnosticById(diagnosticId);
    if (!diagnostic) {
      return NextResponse.json({ ok: false, error: 'Diagnostic not found.' }, { status: 404 });
    }

    const clientResult = await ensureClientFromDiagnostic(diagnostic);
    if (!clientResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: 'Airtable clients table is not configured. Add AIRTABLE_API_KEY/AIRTABLE_BASE_ID/AIRTABLE_CLIENTS_TABLE.',
        },
        { status: 500 },
      );
    }

    const clerkReady = Boolean(process.env.CLERK_SECRET_KEY && process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

    if (!clerkReady) {
      return NextResponse.json({
        ok: true,
        message: `Client ${diagnostic.email} marked invited in Airtable. Clerk invite not sent in this environment.`,
        instructions: `Create user in Clerk dashboard for email ${diagnostic.email}; set role if needed.`,
      });
    }

    try {
      const { clerkClient } = await import('@clerk/nextjs/server');
      const client = await clerkClient();
      await client.invitations.createInvitation({
        emailAddress: diagnostic.email,
        publicMetadata: { role: 'client' },
        ignoreExisting: true,
      });

      return NextResponse.json({
        ok: true,
        message: `Invitation sent to ${diagnostic.email}. Client record ${clientResult.updated ? 'updated' : 'created'} in Airtable.`,
      });
    } catch (error) {
      console.error('Clerk invite failed, falling back to manual instructions', error);
      return NextResponse.json({
        ok: true,
        message: `Client ${diagnostic.email} marked invited in Airtable.`,
        instructions: `Create user in Clerk dashboard for email ${diagnostic.email}; set role if needed.`,
      });
    }
  } catch (error) {
    console.error('Invite from diagnostic failed', error);
    return NextResponse.json({ ok: false, error: 'Failed to invite client from diagnostic.' }, { status: 500 });
  }
}
