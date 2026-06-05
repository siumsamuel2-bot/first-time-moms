import { type NextRequest, NextResponse } from 'next/server';
import { triageSymptoms, shouldEscalate } from '@firstweeks/ai';
import type { TriageInput, TriageResult } from '@firstweeks/ai';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { responses, profileId } = body;

  if (!responses) {
    return NextResponse.json({ error: 'Missing check-in responses' }, { status: 400 });
  }

  const triageInput: TriageInput = {
    symptoms: responses.symptoms ?? [],
    durationDays: responses.durationDays ?? 1,
    sleepDisruption: responses.sleepDisruption ?? 'none',
    moodScore: responses.moodScore ?? 5,
    physicalPain: responses.physicalPain ?? 0,
    bleedingSeverity: responses.bleedingSeverity ?? 'normal',
  };

  const triageResult: TriageResult = triageSymptoms(triageInput);
  const escalate = shouldEscalate(triageResult, responses.consecutiveDays ?? 0);

  return NextResponse.json({
    profileId,
    checkInDate: new Date().toISOString().split('T')[0],
    triage: triageResult,
    escalate,
    action: escalate ? 'warm_referral' : 'routine_monitoring',
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const profileId = searchParams.get('profileId');
  const date = searchParams.get('date');

  return NextResponse.json({
    profileId,
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