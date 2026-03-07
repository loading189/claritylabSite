import { NextRequest, NextResponse } from 'next/server';
import { createFileRecord } from '@/lib/vaultData';
import { requireServerUser } from '@/lib/serverAuth';
import { sendClientUploadNotification, sendReportReadyNotification } from '@/lib/email';
import { updateEngagementRequestStatus } from '@/lib/engagementRequestsData';

type DeliverableVisibilityInput = 'draft' | 'internal' | 'client_visible' | 'visibleToClient' | 'internalOnly';
type DeliverableVisibility = 'draft' | 'internal' | 'client_visible';

function normalizeVisibility(value: unknown): DeliverableVisibility {
  const visibility = String(value || '').trim();
  if (visibility === 'draft' || visibility === 'internal' || visibility === 'client_visible') return visibility;
  if (visibility === 'internalOnly') return 'internal';
  if (visibility === 'visibleToClient') return 'client_visible';
  return 'draft';
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireServerUser();
    const body = (await req.json()) as {
      storageKey: string;
      filename: string;
      mimeType: string;
      sizeBytes: number;
      category: 'upload' | 'report' | 'contract';
      clientId?: string;
      clientEmail?: string;
      note?: string;
      title?: string;
      deliverableType?: string;
      summaryNote?: string;
      periodCovered?: string;
      visibleToClient?: boolean;
      visibility?: DeliverableVisibilityInput;
      reportContentJson?: string;
      status?: string;
      relatedRequestId?: string;
      markRelatedRequestSubmitted?: boolean;
    };

    const clientId = user.role === 'admin' ? body.clientId || user.userId : user.userId;
    const clientEmail = body.clientEmail || user.email;

    const visibility = normalizeVisibility(body.visibility);
    const visibleToClient = visibility === 'client_visible' ? body.visibleToClient !== false : false;
    const publishedAt = visibility === 'client_visible' ? new Date().toISOString() : undefined;

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
      title: body.title,
      deliverable_type: body.deliverableType,
      summary_note: body.summaryNote,
      period_covered: body.periodCovered,
      report_content_json: body.reportContentJson,
      visible_to_client: visibleToClient,
      deliverable_visibility: visibility,
      report_publish_state: visibility,
      report_published_at: publishedAt,
      status: body.status,
    });

    if (user.role === 'admin' && body.markRelatedRequestSubmitted && body.relatedRequestId) {
      await updateEngagementRequestStatus(body.relatedRequestId, 'submitted');
    }

    if (body.category === 'upload') {
      await sendClientUploadNotification({ clientEmail, filename: body.filename, clientId });
    }
    if (body.category === 'report' && visibility === 'client_visible') {
      await sendReportReadyNotification({ to: clientEmail });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}
