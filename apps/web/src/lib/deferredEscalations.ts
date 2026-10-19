/**
 * Night-detected escalation queueing (3 AM Mode spec §6).
 *
 * Anti-anxiety guardrail from [FIR-9]: nothing alarms a user overnight.
 * When a risk is detected between 22:00 and 06:00 the event is persisted with
 * `deferredUntilMorning: true` and surfaced on the next morning check-in:
 *   - 1 deferred event  → fold into the morning banner (soft pattern).
 *   - ≥2 events or any crisis keyword → standard-urgency day-mode banner.
 */

export type EscalationSeverity = 'low' | 'moderate' | 'high' | 'crisis';

export interface DeferredEscalation {
  id: string;
  severity: EscalationSeverity;
  /** ISO timestamp of the original night-time detection. */
  detectedAt: string;
  deferredUntilMorning: true;
  crisisKeyword: boolean;
  reason?: string;
}

export interface DeferEscalationInput {
  id: string;
  severity: EscalationSeverity;
  detectedAt: string | Date;
  crisisKeyword?: boolean;
  reason?: string;
}

export type MorningSurface = 'none' | 'soft' | 'standard';

export interface MorningDeferralSummary {
  surface: MorningSurface;
  count: number;
  includesCrisisKeyword: boolean;
  events: DeferredEscalation[];
  message: string;
}

const SOFT_BANNER_COPY = 'This week has been harder. Want to talk about it?';
const STANDARD_BANNER_COPY =
  'A couple of nights in a row have been tough. Your care team can help — want to review it together?';
const NONE_COPY = '';

/** Mark a night-time risk for morning review — never surface it at night. */
export function deferEscalation(input: DeferEscalationInput): DeferredEscalation {
  const detectedAt =
    input.detectedAt instanceof Date ? input.detectedAt.toISOString() : input.detectedAt;
  return {
    id: input.id,
    severity: input.severity,
    detectedAt,
    deferredUntilMorning: true,
    crisisKeyword: input.crisisKeyword ?? false,
    reason: input.reason,
  };
}

/** Build the morning summary without mutating the input list. */
export function summarizeMorningDeferrals(events: DeferredEscalation[]): MorningDeferralSummary {
  const count = events.length;
  const includesCrisisKeyword = events.some((event) => event.crisisKeyword);

  if (count === 0) {
    return { surface: 'none', count, includesCrisisKeyword, events: [], message: NONE_COPY };
  }

  const surface: MorningSurface = count >= 2 || includesCrisisKeyword ? 'standard' : 'soft';
  return {
    surface,
    count,
    includesCrisisKeyword,
    events: [...events],
    message: surface === 'standard' ? STANDARD_BANNER_COPY : SOFT_BANNER_COPY,
  };
}

export interface MorningDrain {
  summary: MorningDeferralSummary;
  /** Events that remain queued (those detected after `now`). */
  remaining: DeferredEscalation[];
}

/**
 * Drain the queue for the morning review. Events detected at or before `now`
 * are folded into the summary; anything newer stays queued.
 */
export function drainDeferredUntilMorning(events: DeferredEscalation[], now: Date): MorningDrain {
  const due: DeferredEscalation[] = [];
  const remaining: DeferredEscalation[] = [];

  for (const event of events) {
    if (new Date(event.detectedAt).getTime() <= now.getTime()) {
      due.push(event);
    } else {
      remaining.push(event);
    }
  }

  return { summary: summarizeMorningDeferrals(due), remaining };
}

/**
 * In-memory queue used by the app shell while offline. The server persists the
 * authoritative copy; this keeps the guardrail true for optimistic UI.
 */
export class DeferredEscalationQueue {
  private events: DeferredEscalation[] = [];

  enqueue(input: DeferEscalationInput): DeferredEscalation {
    const event = deferEscalation(input);
    this.events.push(event);
    return event;
  }

  pending(): DeferredEscalation[] {
    return [...this.events];
  }

  /** Consume everything due at `now` and keep the newer events queued. */
  drainForMorning(now: Date): MorningDeferralSummary {
    const { summary, remaining } = drainDeferredUntilMorning(this.events, now);
    this.events = remaining;
    return summary;
  }

  clear(): void {
    this.events = [];
  }
}
