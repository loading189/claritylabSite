import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    ok: false,
    message: 'Use Clerk dashboard invite flow for v1. API invite endpoint intentionally not wired in this sprint.',
  });
}
