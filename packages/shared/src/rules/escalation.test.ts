import { describe, expect, it } from 'vitest';
import { BleedingLevel } from '../enums.js';
import type { CheckIn } from '../zod-schemas.js';
import { calculateRiskMetrics, evaluateEscalation } from './escalation.js';

const createCheckIn = (
  overrides: Partial<{
    date: string;
    sleepDisruption: number;
    sadness: number;
    anxiety: number;
    painLevel: number;
    bleeding: BleedingLevel;
  }> = {}
): CheckIn => ({
  id: 'test-id',
  userId: 'user-1',
  date: overrides.date ?? new Date().toISOString().split('T')[0],
  sleepHours: 6,
  sleepDisruption: overrides.sleepDisruption,
  sadness: overrides.sadness,
  anxiety: overrides.anxiety,
  painLevel: overrides.painLevel,
  bleeding: overrides.bleeding,
  feedingIssues: false,
  customResponses: {},
  createdAt: new Date().toISOString(),
});

describe('escalation rules', () => {
  describe('calculateRiskMetrics', () => {
    it('returns low risk for normal check-ins', () => {
      const checkIns = [
        createCheckIn({ date: '2024-01-05', sleepDisruption: 2, sadness: 1 }),
        createCheckIn({ date: '2024-01-04', sleepDisruption: 1, sadness: 1 }),
        createCheckIn({ date: '2024-01-03', sleepDisruption: 2, sadness: 2 }),
      ];
      const metrics = calculateRiskMetrics(checkIns);
      expect(metrics.riskLevel).toBe('low');
      expect(metrics.consecutiveSleepDisruptionDays).toBe(0);
      expect(metrics.consecutiveSadnessDays).toBe(0);
    });

    it('detects consecutive sleep disruption streak', () => {
      const checkIns = [
        createCheckIn({ date: '2024-01-05', sleepDisruption: 4 }),
        createCheckIn({ date: '2024-01-04', sleepDisruption: 5 }),
        createCheckIn({ date: '2024-01-03', sleepDisruption: 4 }),
        createCheckIn({ date: '2024-01-02', sleepDisruption: 5 }),
        createCheckIn({ date: '2024-01-01', sleepDisruption: 4 }),
      ];
      const metrics = calculateRiskMetrics(checkIns);
      expect(metrics.consecutiveSleepDisruptionDays).toBe(5);
      expect(metrics.riskLevel).toBe('medium');
    });

    it('detects critical risk with 5+ days sleep disruption and sadness', () => {
      const checkIns = [
        createCheckIn({ date: '2024-01-05', sleepDisruption: 4, sadness: 3 }),
        createCheckIn({ date: '2024-01-04', sleepDisruption: 5, sadness: 4 }),
        createCheckIn({ date: '2024-01-03', sleepDisruption: 4, sadness: 3 }),
        createCheckIn({ date: '2024-01-02', sleepDisruption: 5, sadness: 4 }),
        createCheckIn({ date: '2024-01-01', sleepDisruption: 4, sadness: 3 }),
      ];
      const metrics = calculateRiskMetrics(checkIns);
      expect(metrics.consecutiveSleepDisruptionDays).toBe(5);
      expect(metrics.consecutiveSadnessDays).toBe(5);
      expect(metrics.riskLevel).toBe('critical');
    });
  });

  describe('evaluateEscalation', () => {
    it('returns no escalation for low risk', () => {
      const checkIns = [
        createCheckIn({ date: '2024-01-05', sleepDisruption: 2, sadness: 1 }),
        createCheckIn({ date: '2024-01-04', sleepDisruption: 1, sadness: 1 }),
      ];
      const decision = evaluateEscalation(checkIns);
      expect(decision.shouldEscalate).toBe(false);
    });

    it('escalates for SLEEP_SADNESS_5DAY trigger', () => {
      const checkIns = [
        createCheckIn({ date: '2024-01-05', sleepDisruption: 4, sadness: 3 }),
        createCheckIn({ date: '2024-01-04', sleepDisruption: 5, sadness: 4 }),
        createCheckIn({ date: '2024-01-03', sleepDisruption: 4, sadness: 3 }),
        createCheckIn({ date: '2024-01-02', sleepDisruption: 5, sadness: 4 }),
        createCheckIn({ date: '2024-01-01', sleepDisruption: 4, sadness: 3 }),
      ];
      const decision = evaluateEscalation(checkIns);
      expect(decision.shouldEscalate).toBe(true);
      expect(decision.trigger).toBe('SLEEP_SADNESS_5DAY');
      expect(decision.severity).toBe('CRITICAL');
    });

    it('escalates for SLEEP_7DAY trigger', () => {
      const checkIns = Array.from({ length: 7 }, (_, i) =>
        createCheckIn({ date: `2024-01-${String(8 - i).padStart(2, '0')}`, sleepDisruption: 4 })
      );
      const decision = evaluateEscalation(checkIns);
      expect(decision.shouldEscalate).toBe(true);
      expect(decision.trigger).toBe('SLEEP_7DAY');
      expect(decision.severity).toBe('HIGH');
    });

    it('escalates for PAIN_SPIKE trigger', () => {
      const checkIns = [createCheckIn({ date: '2024-01-05', painLevel: 9 })];
      const decision = evaluateEscalation(checkIns);
      expect(decision.shouldEscalate).toBe(true);
      expect(decision.trigger).toBe('PAIN_SPIKE');
      expect(decision.severity).toBe('HIGH');
    });

    it('escalates for BLEEDING_HEAVY trigger', () => {
      const checkIns = [
        createCheckIn({ date: '2024-01-05', bleeding: BleedingLevel.HEAVY }),
        createCheckIn({ date: '2024-01-04', bleeding: BleedingLevel.HEAVY }),
      ];
      const decision = evaluateEscalation(checkIns);
      expect(decision.shouldEscalate).toBe(true);
      expect(decision.trigger).toBe('BLEEDING_HEAVY');
      expect(decision.severity).toBe('HIGH');
    });
  });
});
