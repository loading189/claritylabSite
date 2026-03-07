import { NextRequest, NextResponse } from 'next/server';
import { mapFileToDeliverable } from '@/lib/deliverablesData';
import { listFiles } from '@/lib/vaultData';
import { requireServerUser } from '@/lib/serverAuth';

export async function GET(req: NextRequest) {
  try {
    const user = await requireServerUser();
    const category = req.nextUrl.searchParams.get('category') || 'all';
    const targetClientId = req.nextUrl.searchParams.get('clientId');
    const clientId = user.role === 'admin' ? targetClientId || user.userId : user.userId;

    const files = await listFiles(clientId, category);
    const filtered =
      user.role === 'admin'
        ? files
        : files.filter((file) => {
            if (file.category !== 'report') return true;
            return mapFileToDeliverable(file).visibleToClient;
          });

    return NextResponse.json({ files: filtered });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
