import { NextRequest, NextResponse } from 'next/server';
import { db } from '@firstweeks/db';
import { quizResults, referrals } from '@firstweeks/db';
import { calculateResult } from '../../quiz/quizData';
import { rateLimit } from '@/lib/rate-limit';

const limiter = rateLimit({
  interval: 60 * 1000,
  maxRequests: 5,
});

function generateReferralCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.ip ?? 'anonymous';
    const { allowed } = limiter.check(ip);
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    const { answers, email, name, referralCode } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers' }, { status: 400 });
    }

    const result = calculateResult(answers);

    // Save quiz result to database
    const [savedResult] = await db.insert(quizResults).values({
      answers: JSON.stringify(answers),
      riskLevel: result.riskLevel,
      summary: result.summary,
      recommendations: result.recommendations,
      nextSteps: result.nextSteps,
      email: email || null,
      name: name || null,
      referralCode: referralCode || generateReferralCode(),
      createdAt: new Date(),
    }).returning();

    // If email provided, track referral if applicable
    if (email && referralCode) {
      await db.insert(referrals).values({
        referrerCode: referralCode,
        referredEmail: email,
        status: 'pending',
        createdAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      result: savedResult,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz submission' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Return analytics summary (for dashboard)
    const totalResults = await db.select().from(quizResults);
    const riskDistribution = {
      low: totalResults.filter(r => r.riskLevel === 'low').length,
      moderate: totalResults.filter(r => r.riskLevel === 'moderate').length,
      high: totalResults.filter(r => r.riskLevel === 'high').length,
      urgent: totalResults.filter(r => r.riskLevel === 'urgent').length,
    };

    return NextResponse.json({
      total: totalResults.length,
      riskDistribution,
    });
  } catch (error) {
    console.error('Quiz analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz analytics' },
      { status: 500 }
    );
  }
}
