import { type NextRequest, NextResponse } from 'next/server';
import { triageSymptoms, shouldEscalate } from '@firstweeks/ai';
import type { TriageInput } from '@firstweeks/ai';
import { auth } from '@/lib/auth';
import { audit, auditContextFromRequest } from '@firstweeks/shared/audit';
import { createCheckIn, getCheckInsByProfile, getEscalations } from '@firstweeks/db/check-in';
import { getCheckInsForProfileBetween } from '@firstweeks/db/check-in';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = auditContextFromRequest(req, session.user.id);

  const body = await req.json();
  const { responses, profileId } = body;

  if (!responses || !profileId) {
    return NextResponse.json({ error: 'Missing check-in responses or profileId' }, { status: 400 });
  }

  const result = await createCheckIn(profileId, responses, ctx);

  return NextResponse.json({
    checkInId: result.checkIn.id,
    checkInDate: result.checkIn.checkInDate,
    triage: result.triage,
    escalate: result.escalate,
    escalationCreated: result.escalationCreated,
    action: result.escalate ? 'warm_referral' : 'routine_monitoring',
  });
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get('profileId');
  const date = searchParams.get('date');

  const ctx = auditContextFromRequest(req, session.user.id);

  if (profileId) {
    let history;
    if (date) {
      const from = new Date(date);
      const to = new Date(date);
      history = await getCheckInsForProfileBetween(profileId, from, to);
    } else {
      history = await getCheckInsByProfile(profileId);
    }

    audit(ctx, {
      action: 'READ',
      resourceType: 'daily_check_ins',
      resourceId: profileId,
      details: { count: history.length, date: date ?? 'all' },
    });

    return NextResponse.json({ items: history, total: history.length });
  }

  // Default: return today's question set
  audit(ctx, {
    action: 'READ',
    resourceType: 'daily_check_ins',
    details: { date: date ?? new Date().toISOString().split('T')[0] },
  });

  return NextResponse.json({
    date: date ?? new Date().toISOString().split('T')[0],
    questions: [
      { id: 'q1', text: 'How is your pain level today? (0-10)', type: 'scale' },
      { id: 'q2', text: 'How is your mood today? (0-10)', type: 'scale' },
      { id: 'q3', text: 'How has your sleep been?', type: 'select', options: ['Good', 'Fair', 'Poor', 'Very poor'] },
      { id: 'q4', text: 'Any new or worsening symptoms?', type: 'multiselect', options: ['Headache', 'Bleeding', 'Pain', 'Fever', 'Mood changes', 'None'] },
      { id: 'q5', text: 'How is your bleeding?', type: 'select', options: ['Normal', 'Heavy', 'Very heavy'] },
    ],
  });
}
