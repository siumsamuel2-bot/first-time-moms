import type { OnboardingState, DeliveryType, FeedingMethod } from './types';

export type { OnboardingState };

export type OnboardingStep = OnboardingState['step'];

const STEP_ORDER: OnboardingStep[] = [
  'welcome',
  'delivery_details',
  'feeding',
  'mental_health',
  'check_in_time',
  'data_consent',
  'complete',
];

export function createInitialState(): OnboardingState {
  return { step: 'welcome' };
}

export function advanceStep(
  state: OnboardingState,
  data: Record<string, unknown>,
): OnboardingState & { errors?: string[] } {
  const errors: string[] = [];
  const profile = state.profile ? { ...state.profile } : {};

  switch (state.step) {
    case 'welcome':
      return { step: 'delivery_details', profile };

    case 'delivery_details':
      if (!data.deliveryDate) errors.push('Delivery date is required');
      if (!data.deliveryType) errors.push('Delivery type is required');
      if (errors.length > 0) return { step: 'delivery_details', profile, errors };

      const deliveryType = data.deliveryType as DeliveryType;
      const isHigherTouch = deliveryType === 'emergency_c_section';

      return {
        step: 'feeding',
        profile: {
          ...profile,
          deliveryDate: data.deliveryDate as string,
          deliveryType,
          complications: data.complications as string[] | undefined,
          monitoringTier: isHigherTouch ? 'higher_touch' : 'standard',
        },
      };

    case 'feeding':
      if (!data.feedingMethod) errors.push('Feeding method is required');
      if (errors.length > 0) return { step: 'feeding', profile, errors };

      return {
        step: 'mental_health',
        profile: {
          ...profile,
          feedingMethod: data.feedingMethod as FeedingMethod,
          feedingChallenges: data.feedingChallenges as string | undefined,
        },
      };

    case 'mental_health':
      if (data.skippedMentalHealth) {
        return {
          step: 'check_in_time',
          profile,
        };
      }
      if (!data.mentalHealthBaseline) {
        errors.push('Mental health baseline is required');
      }
      if (errors.length > 0) return { step: 'mental_health', profile, errors };

      const epds = data.mentalHealthBaseline as Record<string, number>;
      const epdsScore = Object.values(epds).reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);
      const flagged = epdsScore >= 10;

      return {
        step: 'check_in_time',
        profile: {
          ...profile,
          mentalHealthBaseline: epds,
          epdsBaselineScore: epdsScore,
          epdsFlagged: flagged,
        },
      };

    case 'check_in_time':
      return {
        step: 'data_consent',
        profile: {
          ...profile,
          checkInTime: data.checkInTime as string | undefined,
          smsBackup: data.smsBackup as boolean | undefined,
        },
      };

    case 'data_consent': {
      if (typeof data.dataConsent !== 'boolean') {
        errors.push('Data consent decision is required');
      }
      if (errors.length > 0) return { step: 'data_consent', profile, errors };

      const consentGranted = data.dataConsent === true;
      const now = new Date().toISOString();
      return {
        step: 'complete',
        profile: {
          ...profile,
          dataConsent: consentGranted,
          dataConsentVersion: '1.0',
          dataConsentGrantedAt: consentGranted ? now : undefined,
        },
      };
    }

    case 'complete':
      return { step: 'complete', profile };
  }
}

export function getAvailableSteps(): OnboardingStep[] {
  return [...STEP_ORDER];
}

export function nextStep(step: OnboardingStep): OnboardingStep | null {
  const idx = STEP_ORDER.indexOf(step);
  if (idx < 0) return null;
  return idx < STEP_ORDER.length - 1 ? (STEP_ORDER[idx + 1] ?? null) : null;
}

export function previousStep(step: OnboardingStep): OnboardingStep | null {
  const idx = STEP_ORDER.indexOf(step);
  if (idx < 0) return null;
  return idx > 0 ? (STEP_ORDER[idx - 1] ?? null) : null;
}

export function getCompletionPercentage(step: OnboardingStep): number {
  const idx = STEP_ORDER.indexOf(step);
  return Math.round(((idx + 1) / STEP_ORDER.length) * 100);
}

export function validateStep(
  state: OnboardingState,
  data: Record<string, unknown>,
): string[] {
  const result = advanceStep(state, data);
  return result.errors ?? [];
}

export function canTransition(state: OnboardingState, data: Record<string, unknown>): boolean {
  return validateStep(state, data).length === 0;
}
