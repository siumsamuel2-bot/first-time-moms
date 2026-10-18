import { Specialty } from '../enums.js';
import type { MatchedProvider, Provider, RecoveryProfile } from '../zod-schemas.js';

export interface MatchOptions {
  maxResults?: number;
  minScore?: number;
  requiredSpecialties?: Specialty[];
}

export function matchProviders(
  mom: RecoveryProfile,
  providers: Provider[],
  options: MatchOptions = {}
): MatchedProvider[] {
  const { maxResults = 5, minScore = 30, requiredSpecialties = [] } = options;

  return providers
    .filter((p) => p.screeningStatus === 'APPROVED')
    .filter(
      (p) =>
        requiredSpecialties.length === 0 ||
        requiredSpecialties.some((s) => p.specialties.includes(s))
    )
    .map((p) => {
      const { score, reasons } = calculateMatchScore(mom, p);
      return { provider: p, score, reasons };
    })
    .filter((m) => m.score >= minScore)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxResults);
}

function calculateMatchScore(
  mom: RecoveryProfile,
  provider: Provider
): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const distance = calculateDistance(
    mom.location?.lat,
    mom.location?.lng,
    provider.location.lat,
    provider.location.lng
  );

  const distanceScore = Math.max(0, 40 * (1 - distance / provider.location.radiusMiles));
  score += distanceScore;
  if (distanceScore > 20) {
    reasons.push(
      `${Math.round(distance)} miles away (within ${provider.location.radiusMiles}mi radius)`
    );
  }

  if (mom.needsMentalHealth && provider.specialties.includes(Specialty.PERINATAL_MH)) {
    score += 30;
    reasons.push('Specializes in perinatal mental health');
  }

  if (mom.needsLactation && provider.specialties.includes(Specialty.LACTATION)) {
    score += 30;
    reasons.push('Lactation consultant available');
  }

  if (mom.needsPelvicFloor && provider.specialties.includes(Specialty.PELVIC_FLOOR)) {
    score += 25;
    reasons.push('Pelvic floor specialist');
  }

  if (mom.insurance && provider.insuranceAccepted.includes(mom.insurance)) {
    score += 20;
    reasons.push(`Accepts ${mom.insurance}`);
  }

  if (provider.availability.nextSlotDays <= 3) {
    score += 15;
    reasons.push(`Available in ${provider.availability.nextSlotDays} days`);
  } else if (provider.availability.nextSlotDays <= 7) {
    score += 10;
    reasons.push(`Available in ${provider.availability.nextSlotDays} days`);
  }

  if (
    provider.specialties.includes(Specialty.OBGYN) ||
    provider.specialties.includes(Specialty.MIDWIFE)
  ) {
    score += 5;
    reasons.push('OB-GYN/Midwife');
  }

  const bounded = Math.max(0, Math.min(100, score));
  return { score: Number.isFinite(bounded) ? Math.round(bounded) : 0, reasons };
}

function calculateDistance(
  lat1: number | undefined,
  lng1: number | undefined,
  lat2: number,
  lng2: number
): number {
  if (lat1 === undefined || lng1 === undefined) return 999;

  const R = 3959;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

import type { RiskMetrics } from '../rules/escalation.js';

export function generateReferralContextSummary(mom: RecoveryProfile, metrics: RiskMetrics): string {
  return [
    `Postpartum week: ${Math.floor((mom.weeksPostpartum * 7) / 7)}`,
    `Delivery: ${mom.deliveryType}`,
    `Feeding: ${mom.feedingMethod}`,
    `Sleep disruption streak: ${metrics.consecutiveSleepDisruptionDays} days`,
    `Sadness streak: ${metrics.consecutiveSadnessDays} days`,
    `Risk flags: ${mom.riskFlags.join(', ') || 'none'}`,
    `Insurance: ${mom.insurance || 'not provided'}`,
  ].join('; ');
}
