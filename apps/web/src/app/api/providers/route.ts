import { type NextRequest, NextResponse } from 'next/server';

const sampleProviders = [
  { id: '1', name: 'Dr. Sarah Chen, MD', specialty: 'OB-GYN', location: 'Portland, OR', accepting: true, distance: 1.2 },
  { id: '2', name: 'Maternal Wellness Center', specialty: 'Postpartum Care', location: 'Portland, OR', accepting: true, distance: 3.5 },
  { id: '3', name: 'Dr. James Wilson, MD', specialty: 'Mental Health', location: 'Portland, OR', accepting: true, distance: 2.1 },
  { id: '4', name: 'Lactation Support Clinic', specialty: 'Lactation', location: 'Portland, OR', accepting: true, distance: 4.0 },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const specialty = searchParams.get('specialty')?.toLowerCase();
  const acceptingOnly = searchParams.get('acceptingOnly') !== 'false';

  let results = sampleProviders;
  if (specialty) {
    results = results.filter((p) => p.specialty.toLowerCase().includes(specialty));
  }
  if (acceptingOnly) {
    results = results.filter((p) => p.accepting);
  }

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