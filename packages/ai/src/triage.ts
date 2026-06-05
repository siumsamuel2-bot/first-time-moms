export type EscalationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface TriageInput {
  symptoms: string[];
  durationDays: number;
  sleepDisruption: 'none' | 'mild' | 'moderate' | 'severe';
  moodScore: number;
  physicalPain: number;
  bleedingSeverity: 'normal' | 'heavy' | 'severe';
}

export interface TriageResult {
  severity: EscalationSeverity;
  score: number;
  reason: string;
  recommendations: string[];
}

const CRITICAL_SYMPTOMS = [
  'chest pain',
  'difficulty breathing',
  'seizures',
  'thoughts of harming self',
  'heavy bleeding soaking pad in 1 hour',
  'fever above 101',
];

const HIGH_SYMPTOMS = [
  'severe headache',
  'vision changes',
  'swelling in face or hands',
  'severe abdominal pain',
  'pain or burning with urination',
];

export function triageSymptoms(input: TriageInput): TriageResult {
  const normalizedSymptoms = input.symptoms.map((s) => s.toLowerCase());

  let score = 0;
  let severity: EscalationSeverity = 'low';
  const reasons: string[] = [];
  const recommendations: string[] = [];

  const hasCritical = normalizedSymptoms.some((s) =>
    CRITICAL_SYMPTOMS.some((c) => s.includes(c)),
  );
  if (hasCritical) {
    score += 50;
    reasons.push('Critical symptom detected');
    recommendations.push(
      'Immediate medical attention required. Call 911 or go to emergency room.',
    );
  }

  const hasHigh = normalizedSymptoms.some((s) =>
    HIGH_SYMPTOMS.some((h) => s.includes(h)),
  );
  if (hasHigh) {
    score += 30;
    reasons.push('High-severity symptom detected');
    recommendations.push('Contact your healthcare provider within 24 hours.');
  }

  if (input.durationDays >= 5 && input.moodScore >= 7) {
    score += 20;
    reasons.push(
      `Persistent low mood for ${input.durationDays} days (score: ${input.moodScore}/10)`,
    );
    recommendations.push(
      'Schedule a mental health evaluation. Warm provider referral available.',
    );
  }

  if (input.durationDays >= 3 && input.sleepDisruption === 'severe') {
    score += 10;
    reasons.push('Severe sleep disruption for 3+ days');
  }

  if (input.physicalPain >= 7) {
    score += 15;
    reasons.push(`High pain level reported: ${input.physicalPain}/10`);
    recommendations.push('Pain management consultation recommended.');
  }

  if (input.bleedingSeverity === 'severe') {
    score += 25;
    reasons.push('Severe bleeding reported');
    recommendations.push('Urgent evaluation for postpartum hemorrhage.');
  } else if (input.bleedingSeverity === 'heavy') {
    score += 10;
    reasons.push('Heavy bleeding reported');
    recommendations.push('Monitor closely. Contact provider if it continues.');
  }

  if (score >= 50) severity = 'critical';
  else if (score >= 30) severity = 'high';
  else if (score >= 15) severity = 'medium';

  return {
    severity,
    score,
    reason: reasons.join('; ') || 'No significant concerns detected',
    recommendations:
      recommendations.length > 0
        ? recommendations
        : ['Continue routine monitoring.'],
  };
}

export function shouldEscalate(
  triageResult: TriageResult,
  consecutiveDaysOverThreshold: number,
): boolean {
  if (triageResult.severity === 'critical') return true;
  if (triageResult.severity === 'high') return true;
  if (triageResult.severity === 'medium' && consecutiveDaysOverThreshold >= 3)
    return true;
  return false;
}
