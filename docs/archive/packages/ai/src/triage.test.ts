import { describe, it, expect } from 'vitest';
import { triageSymptoms, shouldEscalate } from './triage';

describe('triageSymptoms', () => {
  it('returns low severity for mild symptoms', () => {
    const result = triageSymptoms({
      symptoms: ['mild headache'],
      durationDays: 1,
      sleepDisruption: 'none',
      moodScore: 3,
      physicalPain: 2,
      bleedingSeverity: 'normal',
    });
    expect(result.severity).toBe('low');
    expect(result.score).toBeLessThan(15);
  });

  it('returns critical for critical symptoms', () => {
    const result = triageSymptoms({
      symptoms: ['chest pain', 'difficulty breathing'],
      durationDays: 1,
      sleepDisruption: 'severe',
      moodScore: 8,
      physicalPain: 9,
      bleedingSeverity: 'severe',
    });
    expect(result.severity).toBe('critical');
    expect(result.score).toBeGreaterThanOrEqual(50);
  });

  it('returns high for persistent low mood', () => {
    const result = triageSymptoms({
      symptoms: ['persistent sadness'],
      durationDays: 6,
      sleepDisruption: 'severe',
      moodScore: 8,
      physicalPain: 3,
      bleedingSeverity: 'normal',
    });
    expect(result.severity).toBe('high');
  });
});

describe('shouldEscalate', () => {
  it('escalates critical immediately', () => {
    expect(shouldEscalate({ severity: 'critical', score: 60, reason: '', recommendations: [] }, 0)).toBe(true);
  });

  it('escalates medium after 3 days', () => {
    expect(shouldEscalate({ severity: 'medium', score: 20, reason: '', recommendations: [] }, 3)).toBe(true);
  });

  it('does not escalate low', () => {
    expect(shouldEscalate({ severity: 'low', score: 5, reason: '', recommendations: [] }, 5)).toBe(false);
  });
});