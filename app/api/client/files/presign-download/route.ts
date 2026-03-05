import { NextRequest, NextResponse } from 'next/server';
import { createLocalPresignedUrl } from '@/lib/fileVault';
import { findFileByStorageKey } from '@/lib/vaultData';
import { requireServerUser } from '@/lib/serverAuth';

export async function POST(req: NextRequest) {
  try {
    const user = await requireServerUser();
    const { storageKey } = (await req.json()) as { storageKey: string };
    const file = await findFileByStorageKey(storageKey);
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    if (user.role !== 'admin' && file.client_id !== user.userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({
      downloadUrl: createLocalPresignedUrl({ key: storageKey, action: 'get' }),
      expiresInSeconds: Number(process.env.FILE_URL_TTL_SECONDS || '900'),
    });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
