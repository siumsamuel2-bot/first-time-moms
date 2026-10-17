export type DeliveryType = 'vaginal' | 'c_section' | 'emergency_c_section';
export type FeedingMethod = 'breast' | 'bottle' | 'both';
export type EscalationSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface RecoveryProfile {
  id: string;
  userId: string;
  deliveryDate: string;
  deliveryType: DeliveryType;
  feedingMethod: FeedingMethod;
  feedingChallenges?: string;
  mentalHealthBaseline?: Record<string, unknown>;
  epdsBaselineScore?: number;
  epdsFlagged?: boolean;
  monitoringTier?: 'standard' | 'higher_touch';
  complications?: string[];
  checkInTime?: string;
  smsBackup?: boolean;
  dataConsent?: boolean;
  dataConsentVersion?: string;
  dataConsentGrantedAt?: string;
  dataConsentRevokedAt?: string;
}

export interface ConsentRecord {
  userId: string;
  granted: boolean;
  consentVersion: string;
  timestamp: string;
  source: 'onboarding' | 'settings';
}

export interface DailyCheckIn {
  id: string;
  profileId: string;
  checkInDate: string;
  responses: Record<string, unknown>;
  escalationScore: number;
}

export interface Escalation {
  id: string;
  profileId: string;
  triggeredAt: string;
  severity: EscalationSeverity;
  symptoms?: string[];
  triageResult?: Record<string, unknown>;
  clinicianReviewedAt?: string;
  resolvedAt?: string;
}

export interface Provider {
  id: string;
  name: string;
  specialty: string;
  location: string;
  acceptingNewPatients: boolean;
  distance?: number;
}

export interface OnboardingState {
  step: 'welcome' | 'delivery_details' | 'feeding' | 'mental_health' | 'check_in_time' | 'data_consent' | 'complete';
  profile?: Partial<RecoveryProfile>;
}

export interface EpdsResponse {
  ableToLaugh: number;
  lookedForward: number;
  blamedSelf: number;
  anxious: number;
  scared: number;
  overwhelmed: number;
  difficultySleeping: number;
  sad: number;
  crying: number;
  selfHarm: number;
}