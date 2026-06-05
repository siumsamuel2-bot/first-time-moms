import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { step, data } = body;

  if (!step || !data) {
    return NextResponse.json({ error: 'Missing step or data' }, { status: 400 });
  }

  return NextResponse.json({
    step,
    valid: true,
    nextStep: step === 'feeding_plan' ? null : getNextStepName(step),
  });
}

function getNextStepName(current: string): string | null {
  const steps = ['welcome', 'delivery_details', 'mental_health', 'feeding_plan', 'complete'];
  const idx = steps.indexOf(current);
  if (idx < 0) return null;
  return idx < steps.length - 1 ? (steps[idx + 1] ?? 'complete') : null;
}