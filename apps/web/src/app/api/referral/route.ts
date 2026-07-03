import { NextRequest, NextResponse } from 'next/server';
import { db } from '@firstweeks/db';
import { referrals, quizResults } from '@firstweeks/db';
import { eq } from 'drizzle-orm';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  maxRequests: 10,
});

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'anonymous';
    const { allowed } = limiter.check(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { referrerCode, referredEmail, referralSource } = body;

    if (!referrerCode || !referredEmail) {
      return NextResponse.json(
        { error: 'Referrer code and email are required' },
        { status: 400 }
      );
    }

    // Check if referrer code exists
    const existingReferrer = await db.query.quizResults.findFirst({
      where: (quizResults, { eq }) => eq(quizResults.referralCode, referrerCode),
    });

    if (!existingReferrer) {
      return NextResponse.json(
        { error: 'Invalid referral code' },
        { status: 400 }
      );
    }

    // Check for fraud: max 5 referrals per user
    const existingReferrals = await db.query.referrals.findMany({
      where: (referrals, { eq }) => eq(referrals.referrerCode, referrerCode),
    });

    if (existingReferrals.length >= 5) {
      return NextResponse.json(
        { error: 'Maximum referrals reached for this code' },
        { status: 400 }
      );
    }

    // Create referral record
    const [referral] = await db.insert(referrals).values({
      referrerCode,
      referredEmail,
      status: 'pending',
      createdAt: new Date(),
    }).returning();

    return NextResponse.json({
      success: true,
      referral,
    });
  } catch (error) {
    console.error('Referral creation error:', error);
    return NextResponse.json(
      { error: 'Failed to process referral' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json(
      { error: 'Referral code required' },
      { status: 400 }
    );
  }

  try {
    const referralStats = await db.query.referrals.findMany({
      where: (referrals, { eq }) => eq(referrals.referrerCode, code),
    });

    return NextResponse.json({
      code,
      totalReferrals: referralStats.length,
      completed: referralStats.filter(r => r.status === 'completed').length,
      pending: referralStats.filter(r => r.status === 'pending').length,
    });
  } catch (error) {
    console.error('Referral stats error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch referral stats' },
      { status: 500 }
    );
  }
}
