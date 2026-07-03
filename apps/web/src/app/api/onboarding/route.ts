import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@firstweeks/db';
import { recoveryProfiles } from '@firstweeks/db/schema';
import { eq } from 'drizzle-orm';
import { ensureEncrypted } from '@firstweeks/shared/encryption';
import { audit, auditContextFromRequest } from '@firstweeks/shared/audit';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  const ctx = auditContextFromRequest(req, userId);

  const body = await req.json();
  const { step, data, profileId } = body;

  if (!step || !data) {
    return NextResponse.json({ error: 'Missing step or data' }, { status: 400 });
  }

  if (step === 'data_consent' && data.dataConsent === true && profileId) {
    const consentProfiles = await db
      .update(recoveryProfiles)
      .set({
        dataConsent: 'true',
        dataConsentVersion: '1.0',
        dataConsentGrantedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(recoveryProfiles.id, profileId))
      .returning();
    audit(ctx, {
      action: 'UPDATE',
      resourceType: 'recovery_profiles',
      resourceId: profileId,
      details: { step: 'data_consent' },
    });
    return NextResponse.json({ step, valid: true, nextStep: 'complete', profile: consentProfiles[0] });
  }

  if (step === 'feeding' && data.feedingMethod && profileId) {
    const feedingProfiles = await db
      .update(recoveryProfiles)
      .set({
        feedingMethod: data.feedingMethod,
        updatedAt: new Date(),
      })
      .where(eq(recoveryProfiles.id, profileId))
      .returning();
    audit(ctx, {
      action: 'UPDATE',
      resourceType: 'recovery_profiles',
      resourceId: profileId,
      details: { step: 'feeding' },
    });
    return NextResponse.json({ step, valid: true, nextStep: 'data_consent', profile: feedingProfiles[0] });
  }

  if (step === 'mental_health' && data.mentalHealthBaseline && profileId) {
    const mentalHealthEncrypted = await ensureEncrypted(
      JSON.stringify(data.mentalHealthBaseline)
    );
    const mhProfiles = await db
      .update(recoveryProfiles)
      .set({
        mentalHealthBaseline: mentalHealthEncrypted,
        updatedAt: new Date(),
      })
      .where(eq(recoveryProfiles.id, profileId))
      .returning();
    audit(ctx, {
      action: 'UPDATE',
      resourceType: 'recovery_profiles',
      resourceId: profileId,
      details: { step: 'mental_health' },
    });
    return NextResponse.json({ step, valid: true, nextStep: 'feeding', profile: mhProfiles[0] });
  }

  if (step === 'delivery_details' && data.deliveryDate && data.deliveryType) {
    const newProfiles = await db
      .insert(recoveryProfiles)
      .values({
        userId,
        deliveryDate: data.deliveryDate,
        deliveryType: data.deliveryType,
        feedingMethod: null,
        dataConsent: 'false',
        updatedAt: new Date(),
      })
      .returning();
    const profile = newProfiles[0];
    if (!profile?.id) {
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }
    audit(ctx, {
      action: 'CREATE',
      resourceType: 'recovery_profiles',
      resourceId: profile.id,
      details: { step: 'delivery_details' },
    });
    return NextResponse.json({ step, valid: true, nextStep: 'mental_health', profile });
  }

  return NextResponse.json({
    step,
    valid: true,
    nextStep: getNextStepName(step),
  });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  const ctx = auditContextFromRequest(req, session.user.id);

  const profiles = await db
    .select()
    .from(recoveryProfiles)
    .where(eq(recoveryProfiles.userId, userId));

  const firstProfile = profiles[0];
  if (firstProfile?.id) {
    audit(ctx, {
      action: 'READ',
      resourceType: 'recovery_profiles',
      resourceId: firstProfile.id,
      details: { count: profiles.length },
    });
  }

  return NextResponse.json({ profiles });
}

function getNextStepName(current: string): string | null {
  const steps = [
    'welcome',
    'delivery_details',
    'mental_health',
    'feeding',
    'data_consent',
    'complete',
  ];
  for (let i = 0; i < steps.length - 1; i++) {
    if (steps[i] === current) return steps[i + 1] ?? null;
  }
  return null;
}
