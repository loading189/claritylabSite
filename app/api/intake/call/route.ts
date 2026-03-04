import { NextRequest, NextResponse } from 'next/server';
import { handleIntake, IntakePayload, readIp } from '@/lib/intake';

export async function POST(request: NextRequest) {
  try {
    const payload = (await request.json()) as IntakePayload;
    const result = await handleIntake(payload, 'call', readIp(request.headers));

    if ('error' in result) {
      return NextResponse.json({ ok: false, error: result.error }, { status: result.status || 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Call intake error', error);
    return NextResponse.json({ ok: false, error: 'Could not submit right now. Please email directly.' }, { status: 500 });
  }
}
