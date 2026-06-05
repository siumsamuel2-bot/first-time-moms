import { type NextRequest, NextResponse } from 'next/server';

const demoAlerts = [
  {
    id: '1',
    patientId: 'p1',
    severity: 'high',
    symptoms: ['Persistent sadness', 'Sleep disruption', 'Fatigue'],
    durationDays: 6,
    flaggedAt: '2026-06-04T08:30:00Z',
    status: 'pending',
  },
  {
    id: '2',
    patientId: 'p2',
    severity: 'critical',
    symptoms: ['Chest pain', 'Difficulty breathing'],
    durationDays: 1,
    flaggedAt: '2026-06-04T07:15:00Z',
    status: 'reviewed',
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let results = demoAlerts;
  if (status) {
    results = results.filter((a) => a.status === status);
  }

  return NextResponse.json({ alerts: results, total: results.length, pending: results.filter((a) => a.status === 'pending').length });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { alertId, action: reviewAction, notes } = body;

  if (!alertId || !reviewAction) {
    return NextResponse.json({ error: 'Missing alertId or action' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    alertId,
    status: reviewAction === 'resolve' ? 'resolved' : 'escalated',
    reviewedBy: 'clinician',
    notes: notes ?? '',
    reviewedAt: new Date().toISOString(),
  });
}