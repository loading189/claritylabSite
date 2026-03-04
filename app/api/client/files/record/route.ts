import { NextRequest, NextResponse } from 'next/server';
import { createFileRecord } from '@/lib/vaultData';
import { requireServerUser } from '@/lib/serverAuth';
import { sendClientUploadNotification, sendReportReadyNotification } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const user = requireServerUser();
    const body = (await req.json()) as {
      storageKey: string;
      filename: string;
      mimeType: string;
      sizeBytes: number;
      category: 'upload' | 'report' | 'contract';
      clientId?: string;
      clientEmail?: string;
      note?: string;
    };

    const clientId = user.role === 'admin' ? body.clientId || user.userId : user.userId;
    const clientEmail = body.clientEmail || user.email;

    await createFileRecord({
      client_id: clientId,
      client_email: clientEmail,
      uploader_role: user.role,
      uploader_user_id: user.userId,
      category: body.category,
      filename: body.filename,
      storage_key: body.storageKey,
      mime_type: body.mimeType,
      size_bytes: body.sizeBytes,
      created_at: new Date().toISOString(),
      note: body.note,
    });

    if (body.category === 'upload') {
      await sendClientUploadNotification({ clientEmail, filename: body.filename, clientId });
    }
    if (body.category === 'report') {
      await sendReportReadyNotification({ to: clientEmail });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
