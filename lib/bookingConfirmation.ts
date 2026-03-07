export type BookingConfirmationContext = {
  diagnosticId?: string;
  signal?: string;
  secondarySignal?: string;
  score?: number;
  tier?: string;
  startTime?: string;
  endTime?: string;
  timezone?: string;
  bookingSummary?: string;
};

function normalizeSignal(signal?: string) {
  if (!signal) return '';
  return signal.trim().toLowerCase().replace(/[_\s-]+/g, '');
}

function readString(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  const text = value?.trim();
  return text ? text : undefined;
}

function readNumber(value?: string | string[]) {
  const raw = readString(value);
  if (!raw) return undefined;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function parseBookingConfirmationContext(
  searchParams?: Record<string, string | string[] | undefined>,
): BookingConfirmationContext {
  if (!searchParams) return {};

  return {
    diagnosticId: readString(searchParams.diagnosticId) || readString(searchParams.a1),
    signal: readString(searchParams.signal) || readString(searchParams.a2),
    secondarySignal:
      readString(searchParams.secondarySignal) ||
      readString(searchParams.secondary) ||
      readString(searchParams.a5),
    score: readNumber(searchParams.score) ?? readNumber(searchParams.a3),
    tier: readString(searchParams.tier) || readString(searchParams.a4),
    startTime:
      readString(searchParams.startTime) ||
      readString(searchParams.event_start_time) ||
      readString(searchParams.start_time),
    endTime:
      readString(searchParams.endTime) ||
      readString(searchParams.event_end_time) ||
      readString(searchParams.end_time),
    timezone:
      readString(searchParams.timezone) ||
      readString(searchParams.event_timezone) ||
      readString(searchParams.tz),
    bookingSummary:
      readString(searchParams.bookingSummary) ||
      readString(searchParams.event_type_name) ||
      readString(searchParams.eventName),
  };
}

export function getSignalMeaning(signal?: string) {
  const normalized = normalizeSignal(signal);
  if (normalized.includes('cash')) {
    return 'This usually means money is getting stuck between work done, invoicing, and cash collected.';
  }
  if (normalized.includes('capacity')) {
    return 'This usually means your team is working hard, but handoffs and scheduling are creating delays.';
  }
  if (normalized.includes('pricing')) {
    return 'This usually means pricing decisions are uneven, so margin gets squeezed without warning.';
  }
  if (normalized.includes('system') || normalized.includes('workflow')) {
    return 'This usually means key work depends on memory, and that creates repeat mistakes and rework.';
  }
  if (normalized.includes('found')) {
    return 'This usually means too many key decisions still depend on you, which limits follow-through.';
  }
  return 'This helps us focus the call on the pressure point most likely to improve day-to-day operations first.';
}

export function getPrepChecklist(signal?: string) {
  const normalized = normalizeSignal(signal);
  const shared = [
    'Bring what you already have. We can work from there.',
    'If your numbers are hard to pull together, that is okay. That tells us something too.',
  ];

  if (normalized.includes('cash')) {
    return [
      'If you have an A/R aging report, bring it. If not, bring a short list of overdue invoices.',
      'If cash feels tight, bring your last 30 days of revenue or cash notes.',
      'Bring one recent example where work was finished but payment came in late.',
      ...shared,
    ];
  }

  if (normalized.includes('capacity')) {
    return [
      'Bring your current schedule or dispatch board, even if it is basic.',
      'Bring two recent jobs that slipped or got rescheduled.',
      'Bring notes on where handoffs break between office and field.',
      ...shared,
    ];
  }

  return [
    'Bring one recent example where work stalled, delayed, or cost more than expected.',
    'Bring any report you already use (cash, margin, backlog, or pipeline).',
    'Bring your top 2–3 issues causing friction right now.',
    ...shared,
  ];
}

export function getSignalResource(signal?: string) {
  const normalized = normalizeSignal(signal);
  if (normalized.includes('cash')) {
    return { title: 'AR Recovery Checklist', href: '/resources/ar-recovery-checklist' };
  }
  return { title: 'Cash-Flow Snapshot Template', href: '/resources/cash-flow-snapshot' };
}

export function formatScheduledWindow(context: BookingConfirmationContext) {
  if (!context.startTime) return null;

  const start = new Date(context.startTime);
  if (Number.isNaN(start.getTime())) return null;

  const timezone = context.timezone || 'UTC';
  const formatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
    timeZoneName: 'short',
  });

  return formatter.format(start);
}
