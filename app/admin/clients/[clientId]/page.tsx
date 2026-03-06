import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { FileList } from '@/components/client/FileList';
import {
  createEngagementRequest,
  listEngagementRequests,
  normalizeEngagementRequestStatus,
  updateEngagementRequestStatus,
} from '@/lib/engagementRequestsData';

const requestStatuses = ['open', 'submitted', 'reviewing', 'complete'] as const;

export default async function AdminClientDetail({ params }: { params: { clientId: string } }) {
  const requests = await listEngagementRequests(params.clientId);

  async function createRequest(formData: FormData) {
    'use server';

    await createEngagementRequest({
      clientId: params.clientId,
      title: String(formData.get('title') || '').trim(),
      category: String(formData.get('category') || 'general').trim() || 'general',
      dueDate: String(formData.get('dueDate') || '').trim() || null,
      owner: String(formData.get('owner') || '').trim() || null,
      notes: String(formData.get('notes') || '').trim() || null,
      status: 'open',
    });

    revalidatePath(`/admin/clients/${params.clientId}`);
    revalidatePath(`/admin/clients/${params.clientId}/upload-report`);
    revalidatePath('/client');
  }

  async function updateStatus(formData: FormData) {
    'use server';

    const requestId = String(formData.get('requestId') || '');
    const status = normalizeEngagementRequestStatus(formData.get('status'));
    if (!requestId) return;

    await updateEngagementRequestStatus(requestId, status);

    revalidatePath(`/admin/clients/${params.clientId}`);
    revalidatePath('/client');
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl">Client: {params.clientId}</h1>
      <Link href={`/admin/clients/${params.clientId}/upload-report`}>Upload report</Link>

      <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <h2 className="mb-2 text-lg font-semibold">Create request</h2>
        <form action={createRequest} className="grid gap-2 sm:grid-cols-2">
          <input required name="title" placeholder="Request title" className="rounded border border-border px-2 py-1 text-sm" />
          <input name="category" defaultValue="general" placeholder="Category" className="rounded border border-border px-2 py-1 text-sm" />
          <input name="dueDate" type="date" className="rounded border border-border px-2 py-1 text-sm" />
          <input name="owner" placeholder="Owner" className="rounded border border-border px-2 py-1 text-sm" />
          <textarea name="notes" placeholder="Notes" className="rounded border border-border px-2 py-1 text-sm sm:col-span-2" rows={3} />
          <button type="submit" className="rounded bg-text px-3 py-2 text-sm text-surface sm:col-span-2">
            Create request
          </button>
        </form>
      </section>

      <section className="rounded-card border border-border bg-surface p-4 shadow-soft">
        <h2 className="mb-2 text-lg font-semibold">Update request status</h2>
        <div className="space-y-2">
          {requests.length ? (
            requests.map((request) => (
              <form key={request.id} action={updateStatus} className="flex flex-wrap items-center gap-2 text-sm">
                <input type="hidden" name="requestId" value={request.id} />
                <span className="min-w-48">{request.title}</span>
                <select name="status" defaultValue={request.status} className="rounded border border-border px-2 py-1">
                  {requestStatuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <button type="submit" className="rounded border border-border px-2 py-1">
                  Save
                </button>
              </form>
            ))
          ) : (
            <p className="text-sm text-muted">No persisted requests yet.</p>
          )}
        </div>
      </section>
      <FileList category="all" clientId={params.clientId} />
    </div>
  );
}
