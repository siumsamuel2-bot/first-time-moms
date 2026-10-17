import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { audit, auditContextFromRequest } from '@firstweeks/shared/audit';
import { createCheckIn, getCheckInsByProfile, getCheckInsForProfileBetween } from '@firstweeks/db/check-in';

const EPDS_SHORT = [
  { id: 'ableToLaugh', question: 'I have been able to laugh and see the funny side of things' },
  { id: 'anxious', question: 'I have felt anxious or worried for no good reason' },
];

function mapMoodAnswersToScore(moodAnswers: Record<string, number>): number {
  const values = Object.values(moodAnswers).filter(
    (v) => typeof v === 'number' && v >= 0 && v <= 3,
  );
  if (values.length === 0) return 0;
  const total = values.reduce((sum, v) => sum + v, 0);
  // EPDS short has 2 questions max, total 0-6; convert to 0-10 scale
  return Math.round((total / 6) * 10);
}

function mapSleepDisruption(troubleSleeping: string): 'none' | 'mild' | 'moderate' | 'severe' {
  if (troubleSleeping === 'No') return 'none';
  if (troubleSleeping === 'Yes') return 'moderate';
  return 'none';
}

function mapCheckInData(data: {
  physicalComfort: number;
  sleepHours: number;
  troubleSleeping: string;
  moodAnswers: Record<string, number>;
  comment: string;
}): { responses: Parameters<typeof createCheckIn>[1]; profileId: string } {
  const responses = {
    symptoms: [],
    durationDays: data.sleepHours,
    sleepDisruption: mapSleepDisruption(data.troubleSleeping),
    moodScore: mapMoodAnswersToScore(data.moodAnswers),
    physicalPain: data.physicalComfort,
    bleedingSeverity: 'normal',
    consecutiveDays: 0,
  } as Parameters<typeof createCheckIn>[1];

  return {
    responses,
    profileId: data.profileId,
  };
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ctx = auditContextFromRequest(req, session.user.id);

  const body = await req.json();
  const { profileId, physicalComfort, sleepHours, troubleSleeping, moodAnswers, comment } = body;

  if (!profileId) {
    return NextResponse.json({ error: 'Missing profileId' }, { status: 400 });
  }

  const mapped = mapCheckInData({
    physicalComfort,
    sleepHours,
    troubleSleeping,
    moodAnswers,
    comment,
  });

  const result = await createCheckIn(profileId, mapped.responses, ctx);

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
