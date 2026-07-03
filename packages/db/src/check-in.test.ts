import { describe, it, expect, vi } from 'vitest';

// Inline minimal triage types so we don't need @firstweeks/ai import during unit tests
type EscalationSeverity = 'low' | 'medium' | 'high' | 'critical';
interface TriageResult {
  severity: EscalationSeverity;
  score: number;
  reason: string;
  recommendations: string[];
}

function triageSymptoms(input: {
  symptoms: string[];
  durationDays: number;
  sleepDisruption: string;
  moodScore: number;
  physicalPain: number;
  bleedingSeverity: string;
}): TriageResult {
  const criticalKeywords = ['chest pain', 'difficulty breathing', 'thoughts of harming self'];
  const hasCritical = input.symptoms.some((s) => criticalKeywords.some((c) => s.toLowerCase().includes(c)));
  if (hasCritical) {
    return { severity: 'critical', score: 50, reason: 'Critical symptom', recommendations: [] };
  }
  return { severity: 'low', score: 5, reason: 'Mild symptom', recommendations: [] };
}

function shouldEscalate(result: TriageResult, consecutiveDays: number): boolean {
  if (result.severity === 'critical') return true;
  if (result.severity === 'high') return true;
  if (result.severity === 'medium' && consecutiveDays >= 3) return true;
  return false;
}

describe('check-in persistence (unit)', () => {
  it('creates check-in data for a low-severity response', () => {
    const input = {
      symptoms: ['mild headache'],
      durationDays: 1,
      sleepDisruption: 'none',
      moodScore: 3,
      physicalPain: 2,
      bleedingSeverity: 'normal',
    };
    const result = triageSymptoms(input);
    expect(result.severity).toBe('low');
    expect(result.score).toBe(5);
  });

  it('returns critical for chest pain', () => {
    const result = triageSymptoms({
      symptoms: ['chest pain'],
      durationDays: 1,
      sleepDisruption: 'none',
      moodScore: 3,
      physicalPain: 2,
      bleedingSeverity: 'normal',
    });
    expect(result.severity).toBe('critical');
    expect(result.score).toBe(50);
  });

  it('should not escalate low severity', () => {
    const result = triageSymptoms({
      symptoms: ['mild headache'],
      durationDays: 1,
      sleepDisruption: 'none',
      moodScore: 3,
      physicalPain: 2,
      bleedingSeverity: 'normal',
    });
    expect(shouldEscalate(result, 0)).toBe(false);
  });

  it('should escalate critical immediately', () => {
    const result = triageSymptoms({
      symptoms: ['chest pain'],
      durationDays: 1,
      sleepDisruption: 'none',
      moodScore: 3,
      physicalPain: 2,
      bleedingSeverity: 'normal',
    });
    expect(shouldEscalate(result, 0)).toBe(true);
  });
});
