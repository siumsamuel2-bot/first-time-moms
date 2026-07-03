import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { audit, auditContextFromRequest } from '@firstweeks/shared/audit';
import { getEscalations, reviewEscalation, resolveEscalation } from '@firstweeks/db/check-in';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  const escalations = await getEscalations(status as any ?? undefined);

  const ctx = auditContextFromRequest(req, session.user.id as string);
  audit(ctx, {
    action: 'READ',
    resourceType: 'escalations',
    details: { count: escalations.length, status: status ?? 'all' },
  });

  const alerts = escalations.map((e) => ({
    id: e.id,
    patientId: e.profileId,
    severity: e.severity,
    symptoms: e.symptoms,
    triggeredAt: e.triggeredAt,
    status: e.resolvedAt ? 'resolved' : e.clinicianReviewedAt ? 'reviewed' : 'pending',
    triageResult: e.triageResult,
  }));

  return NextResponse.json({
    alerts,
    total: alerts.length,
    pending: alerts.filter((a) => a.status === 'pending').length,
    reviewed: alerts.filter((a) => a.status === 'reviewed').length,
    resolved: alerts.filter((a) => a.status === 'resolved').length,
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { alertId, action: reviewAction, notes } = body;

  if (!alertId || !reviewAction) {
    return NextResponse.json({ error: 'Missing alertId or action' }, { status: 400 });
  }

  const ctx = auditContextFromRequest(req, session.user.id as string);

  if (reviewAction === 'review') {
    await reviewEscalation(alertId, ctx);
  } else if (reviewAction === 'resolve') {
    await resolveEscalation(alertId, ctx);
  } else {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    alertId,
    status: reviewAction === 'resolve' ? 'resolved' : 'reviewed',
    notes: notes ?? '',
    reviewedAt: new Date().toISOString(),
  });
}
