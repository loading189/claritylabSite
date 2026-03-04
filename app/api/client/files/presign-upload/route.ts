import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/app/api/_utils/rateLimit';
import { allowedMimeTypes, createLocalPresignedUrl, makeStorageKey, maxFileSizeBytes } from '@/lib/fileVault';
import { requireServerUser } from '@/lib/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const user = requireServerUser();
    const ip = req.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(ip, user.userId);
    if (rate.limited) {
      return NextResponse.json({ error: 'Rate limited' }, { status: 429, headers: { 'Retry-After': `${rate.retryAfterSeconds}` } });
    }

    const body = (await req.json()) as {
      category: 'upload' | 'report';
      filename: string;
      mimeType: string;
      sizeBytes: number;
      clientId?: string;
    };

    if (!allowedMimeTypes.has(body.mimeType) || body.sizeBytes > maxFileSizeBytes) {
      return NextResponse.json({ error: 'Invalid file type or size' }, { status: 400 });
    }

    const isAdmin = user.role === 'admin';
    if (!isAdmin && body.category !== 'upload') {
      return NextResponse.json({ error: 'Forbidden category' }, { status: 403 });
    }

    const clientId = isAdmin ? body.clientId || user.userId : user.userId;
    if (!clientId) return NextResponse.json({ error: 'Missing clientId' }, { status: 400 });

    const storageKey = makeStorageKey(clientId, body.category, body.filename);
    const uploadUrl = createLocalPresignedUrl({ key: storageKey, action: 'put' });

    return NextResponse.json({ uploadUrl, storageKey, expiresInSeconds: Number(process.env.FILE_URL_TTL_SECONDS || '900') });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
