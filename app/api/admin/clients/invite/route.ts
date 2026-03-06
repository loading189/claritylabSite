import { NextResponse } from 'next/server';
import { requireAdminUser } from '@/lib/auth/admin';

export async function POST() {
  const admin = await requireAdminUser();
  if (!admin.ok) {
    const status = admin.reason === 'signed_out' ? 401 : 403;
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status });
  }

  return NextResponse.json({
    ok: false,
    message:
      'Use Clerk dashboard invite flow for v1. API invite endpoint intentionally not wired in this sprint.',
  });
}
