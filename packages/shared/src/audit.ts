/**
 * Centralized audit logging for all PHI access and modifications.
 * Every read, write, or delete of PHI must flow through this module.
 *
 * HIPAA Requirements Covered:
 * - § 164.312(b) Audit Controls: record who, what, when for PHI access
 * - § 164.308(a)(1)(ii)(D) Information Access Management
 *
 * Usage:
 *   audit(ctx, { action: 'READ', resourceType: 'recovery_profiles', resourceId, details })
 */

export interface AuditContext {
  userId: string;
  userRole?: string;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
}

export type AuditAction =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  | 'EXPORT'
  | 'LOGIN'
  | 'LOGOUT'
  | 'CONSENT_GRANTED'
  | 'CONSENT_REVOKED'
  | 'TRIAGE'
  | 'ESCALATION'
  | 'MATCH_PROVIDER'
  | 'DE_IDENTIFY';

export interface AuditLogEntry {
  userId: string;
  userRole?: string;
  action: AuditAction;
  resourceType: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  userAgent?: string;
  ipAddress?: string;
  sessionId?: string;
  timestamp: string;
}

const logBuffer: AuditLogEntry[] = [];
const LOG_FLUSH_SIZE = 50;
const LOG_FLUSH_MS = 5000;

let flushTimer: ReturnType<typeof setInterval> | null = null;

function startFlushTimer() {
  if (flushTimer) return;
  flushTimer = setInterval(() => {
    if (logBuffer.length > 0) flush();
  }, LOG_FLUSH_MS);
}

function flush() {
  if (logBuffer.length === 0) return;
  const batch = logBuffer.splice(0, logBuffer.length);
  for (const entry of batch) {
    // eslint-disable-next-line no-console
    console.log('[AUDIT]', JSON.stringify(entry));
  }
}

function queue(entry: AuditLogEntry) {
  logBuffer.push(entry);
  if (logBuffer.length >= LOG_FLUSH_SIZE) flush();
  startFlushTimer();
}

/**
 * Log an audit event. Call this synchronously after every PHI access.
 */
export function audit(ctx: AuditContext, event: Omit<AuditLogEntry, 'userId' | 'userRole' | 'userAgent' | 'ipAddress' | 'sessionId' | 'timestamp'>) {
  const entry: AuditLogEntry = {
    ...event,
    userId: ctx.userId,
    userRole: ctx.userRole,
    userAgent: ctx.userAgent,
    ipAddress: ctx.ipAddress,
    sessionId: ctx.sessionId,
    timestamp: new Date().toISOString(),
  };
  queue(entry);
}

/**
 * Use in Next.js route handlers to extract audit context from the request.
 */
export function auditContextFromRequest(req: Request, userId: string): AuditContext {
  const headers = req.headers;
  return {
    userId,
    userAgent: headers.get('user-agent') ?? undefined,
    ipAddress: headers.get('x-forwarded-for') ?? undefined,
  };
}

/**
 * Explicitly flush any pending audit logs. Call before process exit or in tests.
 */
export function flushAuditLogs() {
  flush();
}
