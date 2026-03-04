import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const adminToken = process.env.ADMIN_DIAGNOSTIC_TOKEN;
  const token = request.nextUrl.searchParams.get('token');
  const allowedInProd = Boolean(adminToken && token === adminToken);

  if (process.env.NODE_ENV !== 'development' && !allowedInProd) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  throw new Error('Deliberate Sentry test error from /api/dev/sentry-test');
}
