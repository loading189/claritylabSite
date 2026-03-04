import { NextRequest, NextResponse } from 'next/server';
import { getObject, putObject } from '@/lib/objectStore';
import { verifyLocalSignature } from '@/lib/fileVault';

export async function PUT(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action') || '';
  const key = req.nextUrl.searchParams.get('key') || '';
  const exp = req.nextUrl.searchParams.get('exp') || '';
  const sig = req.nextUrl.searchParams.get('sig') || '';

  if (action !== 'put' || !verifyLocalSignature(action, key, exp, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const arrayBuffer = await req.arrayBuffer();
  await putObject(key, Buffer.from(arrayBuffer));
  return new NextResponse(null, { status: 200 });
}

export async function GET(req: NextRequest) {
  const action = req.nextUrl.searchParams.get('action') || '';
  const key = req.nextUrl.searchParams.get('key') || '';
  const exp = req.nextUrl.searchParams.get('exp') || '';
  const sig = req.nextUrl.searchParams.get('sig') || '';

  if (action !== 'get' || !verifyLocalSignature(action, key, exp, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const file = await getObject(key);
  return new NextResponse(file, { status: 200 });
}
