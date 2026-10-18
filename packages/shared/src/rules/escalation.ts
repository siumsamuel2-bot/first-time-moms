import { EscalationSeverity, EscalationTrigger } from '../enums.js';
import type { CheckIn } from '../zod-schemas.js';

export interface EscalationDecision {
  shouldEscalate: boolean;
  trigger?: EscalationTrigger;
  severity?: EscalationSeverity;
  reason?: string;
}

export interface RiskMetrics {
  consecutiveSleepDisruptionDays: number;
  consecutiveSadnessDays: number;
  consecutiveAnxietyDays: number;
  maxPainLevel: number;
  heavyBleedingDays: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export function calculateRiskMetrics(checkIns: CheckIn[]): RiskMetrics {
  const sorted = [...checkIns].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const consecutiveSleepDisruptionDays = consecutiveDays(
    sorted,
    (c) => (c.sleepDisruption ?? 0) >= 4
  );
  const consecutiveSadnessDays = consecutiveDays(sorted, (c) => (c.sadness ?? 0) >= 3);
  const consecutiveAnxietyDays = consecutiveDays(sorted, (c) => (c.anxiety ?? 0) >= 3);

  const maxPainLevel = Math.max(...sorted.map((c) => c.painLevel ?? 0), 0);
  const heavyBleedingDays = sorted.filter((c) => c.bleeding === 'HEAVY').length;

  let riskLevel: RiskMetrics['riskLevel'] = 'low';

  if (consecutiveSleepDisruptionDays >= 5 && consecutiveSadnessDays >= 5) {
    riskLevel = 'critical';
  } else if (consecutiveSleepDisruptionDays >= 7 || consecutiveSadnessDays >= 7) {
    riskLevel = 'high';
  } else if (
    consecutiveSleepDisruptionDays >= 5 ||
    consecutiveSadnessDays >= 5 ||
    maxPainLevel >= 8 ||
    heavyBleedingDays >= 2
  ) {
    riskLevel = 'medium';
  }

  return {
    consecutiveSleepDisruptionDays,
    consecutiveSadnessDays,
    consecutiveAnxietyDays,
    maxPainLevel,
    heavyBleedingDays,
    riskLevel,
  };
}

function consecutiveDays(checkIns: CheckIn[], predicate: (c: CheckIn) => boolean): number {
  if (checkIns.length === 0) return 0;

  let count = 0;
  for (const checkIn of checkIns) {
    if (predicate(checkIn)) {
      count++;
    } else {
      break;
    }
  }

  return count;
}

export function evaluateEscalation(checkIns: CheckIn[]): EscalationDecision {
  const metrics = calculateRiskMetrics(checkIns);

  if (metrics.consecutiveSleepDisruptionDays >= 5 && metrics.consecutiveSadnessDays >= 5) {
    return {
      shouldEscalate: true,
      trigger: EscalationTrigger.SLEEP_SADNESS_5DAY,
      severity: EscalationSeverity.CRITICAL,
      reason: '5+ consecutive days of sleep disruption (>=4) and sadness (>=3)',
    };
  }

  if (metrics.consecutiveSleepDisruptionDays >= 7) {
    return {
      shouldEscalate: true,
      trigger: EscalationTrigger.SLEEP_7DAY,
      severity: EscalationSeverity.HIGH,
      reason: '7+ consecutive days of sleep disruption (>=4)',
    };
  }

  if (metrics.consecutiveSadnessDays >= 7) {
    return {
      shouldEscalate: true,
      trigger: EscalationTrigger.SADNESS_7DAY,
      severity: EscalationSeverity.HIGH,
      reason: '7+ consecutive days of sadness (>=3)',
    };
  }

  if (metrics.maxPainLevel >= 9) {
    return {
      shouldEscalate: true,
      trigger: EscalationTrigger.PAIN_SPIKE,
      severity: EscalationSeverity.HIGH,
      reason: 'Pain level >= 9 reported',
    };
  }

  if (metrics.heavyBleedingDays >= 2) {
    return {
      shouldEscalate: true,
      trigger: EscalationTrigger.BLEEDING_HEAVY,
      severity: EscalationSeverity.HIGH,
      reason: 'Heavy bleeding on 2+ days',
    };
  }

  return { shouldEscalate: false };
}

export function generateContextSummary(checkIns: CheckIn[], metrics: RiskMetrics): string {
  const latest = checkIns[0];
  const daysSinceDelivery = latest
    ? Math.floor((Date.now() - new Date(latest.date).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return [
    `Postpartum day: ${daysSinceDelivery}`,
    `Sleep disruption streak: ${metrics.consecutiveSleepDisruptionDays} days (>=4/5)`,
    `Sadness streak: ${metrics.consecutiveSadnessDays} days (>=3/5)`,
    `Anxiety streak: ${metrics.consecutiveAnxietyDays} days (>=3/5)`,
    `Max pain level: ${metrics.maxPainLevel}/10`,
    `Heavy bleeding days: ${metrics.heavyBleedingDays}`,
    `Risk level: ${metrics.riskLevel.toUpperCase()}`,
  ].join(' | ');
}
