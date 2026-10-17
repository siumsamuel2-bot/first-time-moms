import { db, providers } from '@firstweeks/db';
import { type NextRequest, NextResponse } from 'next/server';
import { eq, ilike, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get('specialty')?.toLowerCase();
  const acceptingOnly = searchParams.get('acceptingOnly') !== 'false';

  const conditions = [];
  if (specialty) {
    conditions.push(ilike(providers.specialty, `%${specialty}%`));
  }
  if (acceptingOnly) {
    conditions.push(eq(providers.acceptingNewPatients, 'true'));
  }

  const results = await db.query.providers.findMany({
    where: conditions.length > 0 ? and(...conditions) : undefined,
  });

  return NextResponse.json({ providers: results });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { providerId, patientId } = body;

  if (!providerId || !patientId) {
    return NextResponse.json({ error: 'Missing providerId or patientId' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    referralSent: true,
    providerId,
    patientId,
    estimatedWaitHours: 24,
  });
}
