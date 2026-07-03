// Check-in persistence service for the daily check-in engine
// Handles storing responses, computing escalation scores, and querying check-in history.

import { eq, and, desc, gte, lte } from 'drizzle-orm';
import { db } from '@firstweeks/db';

// Re-export schema from local to avoid cross-module type mismatch
import {
  dailyCheckIns,
  escalations,
  recoveryProfiles,
} from './schema';

import { triageSymptoms, shouldEscalate } from '@firstweeks/ai';
import type { TriageInput, TriageResult } from '@firstweeks/ai';
import { audit, type AuditContext } from '@firstweeks/shared/audit';
import { sql } from 'drizzle-orm';

export interface CheckInResponse {
  symptoms: string[];
  durationDays: number;
  sleepDisruption: 'none' | 'mild' | 'moderate' | 'severe';
  moodScore: number;
  physicalPain: number;
  bleedingSeverity: 'normal' | 'heavy' | 'severe';
  consecutiveDays?: number;
}

export interface SavedCheckIn {
  id: string;
  profileId: string;
  checkInDate: string;
  responses: CheckInResponse;
  escalationScore: number | null;
  createdAt: Date;
}

export interface CreateCheckInResult {
  checkIn: SavedCheckIn;
  triage: TriageResult;
  escalate: boolean;
  escalationCreated?: string;
}

function mapRowToSavedCheckIn(row: any): SavedCheckIn {
  return {
    id: row.id,
    profileId: row.profileId,
    checkInDate: row.checkInDate.toString(),
    responses: row.responses as unknown as CheckInResponse,
    escalationScore: row.escalationScore,
    createdAt: row.createdAt,
  };
}

/**
 * Save a daily check-in, compute triage score, and optionally create an escalation.
 * @param profileId Recovery profile UUID
 * @param responses User check-in responses
 * @param ctx Audit context (optional; if omitted, no audit log is written)
 * @returns The saved check-in, triage result, and escalation status
 */
export async function createCheckIn(
  profileId: string,
  responses: CheckInResponse,
  ctx?: AuditContext,
): Promise<CreateCheckInResult> {
  // 1. Run triage engine server-side
  const triageInput: TriageInput = {
    symptoms: responses.symptoms,
    durationDays: responses.durationDays,
    sleepDisruption: responses.sleepDisruption,
    moodScore: responses.moodScore,
    physicalPain: responses.physicalPain,
    bleedingSeverity: responses.bleedingSeverity,
  };

  const triage = triageSymptoms(triageInput);
  const consecutiveDays = responses.consecutiveDays ?? 0;
  const escalate = shouldEscalate(triage, consecutiveDays);

  // 2. Persist the check-in
  const checkInDate = new Date().toISOString().split('T')[0];
  const [inserted] = await db
    .insert(dailyCheckIns)
    .values({
      profileId: profileId as string,
      checkInDate: checkInDate as string,
      responses: responses as unknown as NonNullable<typeof dailyCheckIns.$inferInsert.responses>,
      escalationScore: triage.score,
    } as any)
    .returning();

  if (!inserted) {
    throw new Error('Failed to insert daily check-in');
  }

  const checkIn: SavedCheckIn = mapRowToSavedCheckIn(inserted);

  // 3. Audit
  if (ctx) {
    audit(ctx, {
      action: 'CREATE',
      resourceType: 'daily_check_ins',
      resourceId: checkIn.id,
      details: { profileId, score: triage.score, severity: triage.severity },
    });
  }

  // 4. Create escalation record if warranted
  let escalationCreated: string | undefined;
  if (escalate) {
    const [escalation] = await db
      .insert(escalations)
      .values({
        profileId,
        severity: triage.severity,
        symptoms: responses.symptoms,
        triageResult: triage as unknown as NonNullable<typeof escalations.$inferInsert.triageResult>,
      })
      .returning();

    if (ctx) {
      audit(ctx, {
        action: 'ESCALATION',
        resourceType: 'escalations',
        resourceId: escalation?.id,
        details: { profileId, severity: triage.severity, score: triage.score },
      });
    }

    escalationCreated = escalation?.id;
  }

  return {
    checkIn,
    triage,
    escalate,
    escalationCreated,
  };
}

/**
 * Get a single check-in by ID.
 */
export async function getCheckInById(checkInId: string): Promise<SavedCheckIn | null> {
  const row = await db.query.dailyCheckIns.findFirst({
    where: eq(dailyCheckIns.id, checkInId),
  });
  if (!row) return null;
  return mapRowToSavedCheckIn(row);
}

/**
 * Get all check-ins for a profile, ordered by date (newest first).
 */
export async function getCheckInsByProfile(profileId: string): Promise<SavedCheckIn[]> {
  const rows = await db.query.dailyCheckIns.findMany({
    where: eq(dailyCheckIns.profileId, profileId),
    orderBy: [desc(dailyCheckIns.checkInDate)],
  });
  return rows.map(mapRowToSavedCheckIn);
}

/**
 * Get check-ins for a profile within a date range.
 */
export async function getCheckInsForProfileBetween(profileId: string, from: Date, to: Date): Promise<SavedCheckIn[]> {
  const fromStr = from.toISOString().split('T')[0] as string;
  const toStr = to.toISOString().split('T')[0] as string;
  const rows = await db.query.dailyCheckIns.findMany({
    where: and(
      eq(dailyCheckIns.profileId, profileId),
      gte(dailyCheckIns.checkInDate, fromStr),
      lte(dailyCheckIns.checkInDate, toStr),
    ),
    orderBy: [desc(dailyCheckIns.checkInDate)],
  });
  return rows.map(mapRowToSavedCheckIn);
}

/**
 * Get all flagged escalations with optional status filter.
 */
export async function getEscalations(status?: 'low' | 'medium' | 'high' | 'critical'): Promise<typeof escalations.$inferSelect[]> {
  if (status) {
    return db.query.escalations.findMany({
      where: eq(escalations.severity, status),
      orderBy: [desc(escalations.triggeredAt)],
    });
  }
  return db.query.escalations.findMany({
    orderBy: [desc(escalations.triggeredAt)],
  });
}

/**
 * Mark an escalation as reviewed by a clinician.
 */
export async function reviewEscalation(escalationId: string, ctx?: AuditContext): Promise<void> {
  await db
    .update(escalations)
    .set({ clinicianReviewedAt: new Date() })
    .where(eq(escalations.id, escalationId));

  if (ctx) {
    audit(ctx, {
      action: 'UPDATE',
      resourceType: 'escalations',
      resourceId: escalationId,
      details: { reviewed: true },
    });
  }
}

/**
 * Resolve an escalation.
 */
export async function resolveEscalation(escalationId: string, ctx?: AuditContext): Promise<void> {
  await db
    .update(escalations)
    .set({ resolvedAt: new Date() })
    .where(eq(escalations.id, escalationId));

  if (ctx) {
    audit(ctx, {
      action: 'UPDATE',
      resourceType: 'escalations',
      resourceId: escalationId,
      details: { resolved: true },
    });
  }
}
